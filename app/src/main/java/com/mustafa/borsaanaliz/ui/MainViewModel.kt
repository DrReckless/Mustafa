package com.mustafa.borsaanaliz.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.mustafa.borsaanaliz.analysis.Analysis
import com.mustafa.borsaanaliz.analysis.Analyzer
import com.mustafa.borsaanaliz.analysis.MarketRisk
import com.mustafa.borsaanaliz.data.Instrument
import com.mustafa.borsaanaliz.data.NewsItem
import com.mustafa.borsaanaliz.data.Position
import com.mustafa.borsaanaliz.data.PriceAlarm
import com.mustafa.borsaanaliz.data.Prefs
import com.mustafa.borsaanaliz.data.Quote
import com.mustafa.borsaanaliz.data.Repository
import com.mustafa.borsaanaliz.data.Settings
import com.mustafa.borsaanaliz.data.Universe
import com.mustafa.borsaanaliz.worker.MonitorScheduler
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

data class UiState(
    val loading: Boolean = false,
    val markets: List<Analysis> = emptyList(),
    val stocks: List<Analysis> = emptyList(), // izleme listesi
    val scan: List<Analysis> = emptyList(), // BIST 100 + izleme listesi taraması
    val scanTotal: Int = 0,
    val lastScan: Long = 0,
    val marketRisk: MarketRisk? = null,
    val news: List<NewsItem> = emptyList(),
    val watchlist: List<String> = emptyList(),
    val positions: List<Position> = emptyList(),
    val positionQuotes: Map<String, Quote> = emptyMap(),
    val alarms: List<PriceAlarm> = emptyList(),
    val settings: Settings = Settings(),
    val lastUpdate: Long = 0,
    val error: String? = null,
)

data class DetailState(
    val instrument: Instrument,
    val loading: Boolean = true,
    val analysis: Analysis? = null,
    val news: List<NewsItem> = emptyList(),
)

class MainViewModel(app: Application) : AndroidViewModel(app) {
    private val prefs = Prefs(app)
    private val _state = MutableStateFlow(
        UiState(watchlist = prefs.watchlist(), positions = prefs.positions(), alarms = prefs.alarms(), settings = prefs.settings())
    )
    val state: StateFlow<UiState> = _state.asStateFlow()

    private val _detail = MutableStateFlow<DetailState?>(null)
    val detail: StateFlow<DetailState?> = _detail.asStateFlow()

    private var autoJob: Job? = null
    private var detailJob: Job? = null

    init {
        refresh(full = true)
    }

    /** Uygulama açıkken piyasa verilerini her dakika tazeler. */
    fun startAutoRefresh() {
        if (autoJob?.isActive == true) return
        autoJob = viewModelScope.launch {
            while (isActive) {
                delay(60_000)
                refresh(full = false)
            }
        }
    }

    fun stopAutoRefresh() { autoJob?.cancel() }

    fun refresh(full: Boolean = true) {
        viewModelScope.launch {
            _state.update { it.copy(loading = true, error = null) }
            val maxAge = if (full) 0L else 30_000L
            val markets = Repository.analyzeAll(Universe.markets, withFundamentals = false, maxAgeMs = maxAge)
            val quotes = markets.associate { it.quote.instrument.symbol to it.quote }
            _state.update { it.copy(markets = markets) }
            val news = if (full || _state.value.news.isEmpty()) Repository.news(null) else _state.value.news
            val risk = Analyzer.marketRisk(quotes, news)
            _state.update { it.copy(news = news, marketRisk = risk) }

            // Hisse taraması ağır olduğundan otomatik yenilemede en fazla 5 dakikada bir yapılır.
            if (full || System.currentTimeMillis() - _state.value.lastScan > 5 * 60_000L) scanStocks(maxAge)
            val posQuotes = Repository.quotes(prefs.positions().map { Universe.find(it.symbol) }, maxAge.coerceAtLeast(10_000))
            _state.update {
                it.copy(
                    loading = false, positionQuotes = posQuotes,
                    lastUpdate = System.currentTimeMillis(),
                    error = if (markets.isEmpty() && it.scan.isEmpty()) "Veri alınamadı. İnternet bağlantınızı kontrol edin." else null,
                )
            }
        }
    }

    /**
     * Tüm BIST 100 + izleme listesini yeniden çeker ve teknik analizden geçirir; ardından
     * en güçlü/zayıf adaylar ile izleme listesi için temel analiz eklenir.
     */
    private suspend fun scanStocks(maxAge: Long) {
        val watch = prefs.watchlist()
        val codes = (Universe.bist100 + watch).distinct()
        val tech = Repository.analyzeAll(codes.map { Universe.stock(it) }, withFundamentals = false, maxAgeMs = maxAge)
            .sortedByDescending { it.score }
        val deepSymbols = (tech.take(20) + tech.takeLast(10)).map { it.quote.instrument.symbol }.toSet() +
            watch.map { Universe.stock(it).symbol }
        val deep = Repository.analyzeAll(
            tech.filter { it.quote.instrument.symbol in deepSymbols }.map { it.quote.instrument },
            withFundamentals = true, maxAgeMs = Long.MAX_VALUE,
        ).associateBy { it.quote.instrument.symbol }
        val scan = tech.map { deep[it.quote.instrument.symbol] ?: it }.sortedByDescending { it.score }
        val watchSet = watch.map { Universe.stock(it).symbol }.toSet()
        _state.update {
            it.copy(
                scan = scan, scanTotal = codes.size, lastScan = System.currentTimeMillis(),
                stocks = scan.filter { a -> a.quote.instrument.symbol in watchSet },
            )
        }
    }

    fun openDetail(i: Instrument) {
        detailJob?.cancel()
        _detail.value = DetailState(i)
        detailJob = viewModelScope.launch {
            val a = Repository.analyze(i, withNews = true, withFundamentals = true)
            _detail.value = DetailState(i, loading = false, analysis = a, news = Repository.news(i))
        }
    }

    fun closeDetail() { detailJob?.cancel(); _detail.value = null }

    fun addToWatchlist(code: String) {
        val c = code.uppercase().removeSuffix(".IS").trim()
        if (c.isBlank()) return
        val list = (prefs.watchlist() + c).distinct()
        prefs.setWatchlist(list)
        _state.update { it.copy(watchlist = list) }
        viewModelScope.launch {
            Repository.analyze(Universe.stock(c), withNews = false)?.let { a ->
                _state.update { st ->
                    st.copy(
                        stocks = (st.stocks.filter { it.quote.instrument.symbol != a.quote.instrument.symbol } + a).sortedByDescending { it.score },
                        scan = (st.scan.filter { it.quote.instrument.symbol != a.quote.instrument.symbol } + a).sortedByDescending { it.score },
                    )
                }
            }
        }
    }

    fun removeFromWatchlist(code: String) {
        val list = prefs.watchlist() - code
        prefs.setWatchlist(list)
        _state.update { st -> st.copy(watchlist = list, stocks = st.stocks.filter { it.quote.instrument.symbol != "$code.IS" }) }
    }

    fun addPosition(p: Position) {
        val list = prefs.positions().filter { it.symbol != p.symbol } + p
        prefs.setPositions(list)
        _state.update { it.copy(positions = list) }
        viewModelScope.launch {
            Repository.quote(Universe.find(p.symbol))?.let { q -> _state.update { it.copy(positionQuotes = it.positionQuotes + (p.symbol to q)) } }
        }
    }

    fun removePosition(symbol: String) {
        val list = prefs.positions().filter { it.symbol != symbol }
        prefs.setPositions(list)
        _state.update { it.copy(positions = list) }
    }

    fun addAlarm(a: PriceAlarm) {
        val list = prefs.alarms() + a
        prefs.setAlarms(list)
        _state.update { it.copy(alarms = list) }
    }

    fun removeAlarm(a: PriceAlarm) {
        val list = prefs.alarms() - a
        prefs.setAlarms(list)
        _state.update { it.copy(alarms = list) }
    }

    fun updateSettings(s: Settings) {
        val old = prefs.settings()
        prefs.setSettings(s)
        _state.update { it.copy(settings = s) }
        if (old.checkIntervalMin != s.checkIntervalMin) MonitorScheduler.schedule(getApplication(), s.checkIntervalMin)
    }

    fun testCheck() = MonitorScheduler.runNow(getApplication())
}
