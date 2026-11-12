package com.mustafa.borsaanaliz.data

import com.mustafa.borsaanaliz.analysis.Analysis
import com.mustafa.borsaanaliz.analysis.Analyzer
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.coroutines.withContext
import java.util.concurrent.ConcurrentHashMap

/** Veri çekme + önbellek. */
object Repository {
    private val gate = Semaphore(6)
    private val quoteCache = ConcurrentHashMap<String, Quote>()
    private val fundCache = ConcurrentHashMap<String, Pair<Long, Fundamentals?>>()
    private val newsCache = ConcurrentHashMap<String, Pair<Long, List<NewsItem>>>()
    private const val GRAMS_PER_OUNCE = 31.1035

    suspend fun quote(i: Instrument, maxAgeMs: Long = 30_000): Quote? = withContext(Dispatchers.IO) {
        quoteCache[i.symbol]?.let { if (System.currentTimeMillis() - it.updatedAt < maxAgeMs) return@withContext it }
        val q = runCatching {
            when {
                i.symbol == Universe.GRAM_GOLD -> gramGold(i)
                i.type == AssetType.CRYPTO -> gate.withPermit { fetchCrypto(i) }
                else -> gate.withPermit { fetchQuote(i) }
            }
        }.getOrNull()
        if (q != null) quoteCache[i.symbol] = q
        q ?: quoteCache[i.symbol]
    }

    private fun fetchQuote(i: Instrument): Quote? {
        val (candles, meta) = YahooClient.chart(i.symbol)
        if (candles.isEmpty()) return null
        val live = meta.optDouble("regularMarketPrice").takeIf { !it.isNaN() } ?: candles.last().close
        val list = candles.toMutableList()
        val last = list.last()
        list[list.size - 1] = last.copy(close = live, high = maxOf(last.high, live), low = minOf(last.low, live))
        val prev = if (list.size >= 2) list[list.size - 2].close else live
        return Quote(i, list, live, prev, meta.optString("currency", ""), System.currentTimeMillis())
    }

    private fun fetchCrypto(i: Instrument): Quote? {
        val code = i.symbol.removeSuffix("-USD")
        val (candles, _) = CryptoClient.history(code, CryptoNames.get(code)) ?: return null
        val prev = candles[candles.size - 2].close
        return Quote(i, candles, candles.last().close, prev, "USD", System.currentTimeMillis())
    }

    @Volatile private var coinsCache: Pair<Long, CoinList>? = null

    /** Son başarılı coin listesini telefonda saklamak için (BorsaApp ayarlar). */
    @Volatile var prefs: Prefs? = null

    /**
     * Piyasa değerine göre güncel ilk 100 coin (2 dakika önbellekli). Tüm kaynaklar başarısız olursa
     * son başarılı liste, o da yoksa yerleşik büyük coin listesi kullanılır; liste asla boş dönmez.
     */
    suspend fun topCoins(maxAgeMs: Long = 120_000): CoinList = withContext(Dispatchers.IO) {
        coinsCache?.let { if (System.currentTimeMillis() - it.first < maxAgeMs) return@withContext it.second }
        val fresh = CryptoClient.topCoins(100)
        if (fresh.coins.isNotEmpty()) {
            coinsCache = System.currentTimeMillis() to fresh
            prefs?.saveCoins(fresh.coins)
            return@withContext fresh
        }
        coinsCache?.second?.let { return@withContext it.copy(source = it.source + " (önceki liste)", errors = fresh.errors) }
        val saved = prefs?.savedCoins().orEmpty()
        if (saved.isNotEmpty()) return@withContext CoinList(saved, "kayıtlı son liste", fresh.errors)
        val builtin = CryptoNames.builtinCodes().mapIndexed { i, c -> CoinInfo(c, CryptoNames.get(c) ?: c, i + 1, 0.0, Double.NaN, Double.NaN, 0.0, 0.0) }
        CoinList(builtin, "yerleşik liste", fresh.errors)
    }

    suspend fun fearGreed(): FearGreed? = withContext(Dispatchers.IO) { CryptoClient.fearGreed() }

    private suspend fun gramGold(i: Instrument): Quote? {
        val ons = quote(Universe.find("GC=F")) ?: return null
        val usd = quote(Universe.find("USDTRY=X")) ?: return null
        val usdMap = usd.candles.associateBy { Analyzer.dayKey(it.time) }
        val candles = ons.candles.mapNotNull { c ->
            val u = usdMap[Analyzer.dayKey(c.time)]?.close ?: return@mapNotNull null
            val k = u / GRAMS_PER_OUNCE
            Candle(c.time, c.open * k, c.high * k, c.low * k, c.close * k, 0.0)
        }.toMutableList()
        if (candles.size < 2) return null
        val live = ons.price * usd.price / GRAMS_PER_OUNCE
        candles[candles.size - 1] = candles.last().copy(close = live)
        return Quote(i, candles, live, candles[candles.size - 2].close, "TRY", System.currentTimeMillis())
    }

    suspend fun fundamentals(i: Instrument): Fundamentals? = withContext(Dispatchers.IO) {
        if (i.type != AssetType.STOCK) return@withContext null
        fundCache[i.symbol]?.let { if (System.currentTimeMillis() - it.first < 6 * 3_600_000L) return@withContext it.second }
        val f = runCatching { gate.withPermit { YahooClient.fundamentals(i.symbol) } }.getOrNull()
        if (f != null) fundCache[i.symbol] = System.currentTimeMillis() to f
        f
    }

    suspend fun news(i: Instrument?): List<NewsItem> = withContext(Dispatchers.IO) {
        val key = i?.symbol ?: "_general"
        newsCache[key]?.let { if (System.currentTimeMillis() - it.first < 10 * 60_000L) return@withContext it.second }
        val list = runCatching { if (i == null) NewsClient.general() else NewsClient.forInstrument(i) }.getOrDefault(emptyList())
        if (list.isNotEmpty()) newsCache[key] = System.currentTimeMillis() to list
        list.ifEmpty { newsCache[key]?.second ?: emptyList() }
    }

    suspend fun quotes(list: List<Instrument>, maxAgeMs: Long = 30_000): Map<String, Quote> = coroutineScope {
        list.map { i -> async { quote(i, maxAgeMs)?.let { i.symbol to it } } }.awaitAll().filterNotNull().toMap()
    }

    /** withNews: hisse/enstrümana özel haber taraması (yavaştır; detay ekranı için). */
    suspend fun analyze(i: Instrument, withNews: Boolean, withFundamentals: Boolean = true, maxAgeMs: Long = 30_000): Analysis? {
        val q = quote(i, maxAgeMs) ?: return null
        val bench = when (i.type) {
            AssetType.STOCK -> quote(Universe.find("XU100.IS"), 120_000)
            AssetType.CRYPTO -> if (i.symbol == "BTC-USD") null else quote(Universe.crypto("BTC"), 120_000)
            else -> null
        }
        val f = if (withFundamentals) fundamentals(i) else null
        val n = if (withNews) news(i) else null
        return Analyzer.analyze(q, f, n, bench)
    }

    suspend fun analyzeAll(list: List<Instrument>, withFundamentals: Boolean, maxAgeMs: Long = 30_000): List<Analysis> = coroutineScope {
        list.map { async { analyze(it, withNews = false, withFundamentals = withFundamentals, maxAgeMs = maxAgeMs) } }
            .awaitAll().filterNotNull()
    }
}
