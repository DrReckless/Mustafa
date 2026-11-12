package com.mustafa.borsaanaliz.analysis

import com.mustafa.borsaanaliz.analysis.Indicators.lastValid
import com.mustafa.borsaanaliz.data.AssetType
import com.mustafa.borsaanaliz.data.Fundamentals
import com.mustafa.borsaanaliz.data.NewsItem
import com.mustafa.borsaanaliz.data.Quote
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sqrt

enum class Signal(val label: String) {
    STRONG_BUY("GÜÇLÜ AL"), BUY("AL"), HOLD("TUT"), SELL("SAT"), STRONG_SELL("GÜÇLÜ SAT");

    val isSell get() = this == SELL || this == STRONG_SELL
    val isBuy get() = this == BUY || this == STRONG_BUY
}

enum class RiskLevel(val label: String) { LOW("Düşük"), MEDIUM("Orta"), HIGH("Yüksek"), VERY_HIGH("Çok Yüksek") }

data class Reason(val text: String, val weight: Double)

data class TechnicalResult(
    val score: Double, // -100..100
    val rsi: Double, val macd: Double, val macdSignal: Double, val macdHist: Double,
    val sma20: Double, val sma50: Double, val sma200: Double,
    val bbUpper: Double, val bbLower: Double,
    val stochK: Double, val stochD: Double,
    val atr: Double, val roc20: Double,
    val support: Double, val resistance: Double,
    val reasons: List<Reason>,
)

data class FundamentalResult(val score: Double, val reasons: List<Reason>)

data class RiskResult(
    val volatility: Double, // yıllık %
    val maxDrawdown: Double, // %
    val var95: Double, // günlük %
    val beta: Double?,
    val level: RiskLevel,
)

data class Analysis(
    val quote: Quote,
    val technical: TechnicalResult?,
    val fundamental: FundamentalResult?,
    val fundamentals: Fundamentals?,
    val newsScore: Int?,
    val risk: RiskResult?,
    val score: Double,
    val signal: Signal,
    val stopLoss: Double?,
    val target: Double?,
    val summary: String,
)

data class MarketRisk(val score: Int, val level: RiskLevel, val reasons: List<String>, val newsSentiment: Int)

object Analyzer {

    fun technical(q: Quote): TechnicalResult? {
        val c = q.candles.map { it.close }
        if (c.size < 35) return null
        val h = q.candles.map { it.high }; val l = q.candles.map { it.low }; val v = q.candles.map { it.volume }
        val price = c.last()
        val rsiArr = Indicators.rsi(c)
        val rsi = rsiArr.lastValid()
        val m = Indicators.macd(c)
        val sma20 = Indicators.sma(c, 20).lastValid()
        val sma50 = Indicators.sma(c, 50).lastValid()
        val sma200 = Indicators.sma(c, 200).lastValid()
        val bb = Indicators.bollinger(c)
        val st = Indicators.stochastic(h, l, c)
        val atr = Indicators.atr(h, l, c).lastValid()
        val roc20 = if (c.size > 21) (price / c[c.size - 21] - 1) * 100 else 0.0
        val reasons = mutableListOf<Reason>()
        fun add(w: Double, t: String) { reasons += Reason(t, w) }

        // Trend
        if (!sma50.isNaN()) {
            if (price > sma50) add(1.0, "Fiyat 50 günlük ortalamanın üzerinde (yükseliş trendi)")
            else add(-1.0, "Fiyat 50 günlük ortalamanın altında (zayıf trend)")
        }
        if (!sma200.isNaN()) {
            if (price > sma200) add(1.0, "Fiyat 200 günlük ortalamanın üzerinde (uzun vadeli trend pozitif)")
            else add(-1.0, "Fiyat 200 günlük ortalamanın altında (uzun vadeli trend negatif)")
            val s50 = Indicators.sma(c, 50); val s200 = Indicators.sma(c, 200)
            val n = c.size - 1
            for (i in max(n - 5, 1)..n) {
                if (s50[i - 1].isNaN() || s200[i - 1].isNaN()) continue
                if (s50[i - 1] <= s200[i - 1] && s50[i] > s200[i]) add(1.5, "Altın kesişim: SMA50, SMA200'ü yukarı kesti")
                if (s50[i - 1] >= s200[i - 1] && s50[i] < s200[i]) add(-1.5, "Ölüm kesişimi: SMA50, SMA200'ü aşağı kesti")
            }
        }
        if (!sma20.isNaN() && !sma50.isNaN()) {
            if (sma20 > sma50) add(0.5, "Kısa vadeli ortalama (20) orta vadelinin (50) üzerinde")
            else add(-0.5, "Kısa vadeli ortalama (20) orta vadelinin (50) altında")
        }
        // RSI
        when {
            rsi < 25 -> add(2.0, "RSI %.0f: güçlü aşırı satım, tepki yükselişi olası".format(rsi))
            rsi < 32 -> add(1.2, "RSI %.0f: aşırı satım bölgesi".format(rsi))
            rsi > 78 -> add(-2.0, "RSI %.0f: güçlü aşırı alım, düzeltme riski".format(rsi))
            rsi > 70 -> add(-1.2, "RSI %.0f: aşırı alım bölgesi".format(rsi))
            rsi in 50.0..65.0 -> add(0.4, "RSI %.0f: pozitif momentum".format(rsi))
            rsi in 35.0..50.0 -> add(-0.3, "RSI %.0f: zayıf momentum".format(rsi))
        }
        // MACD
        val n = c.size - 1
        val hist = m.hist[n]; val prevHist = m.hist[n - 1]
        if (!hist.isNaN() && !prevHist.isNaN()) {
            var crossed = false
            for (i in max(n - 3, 1)..n) {
                if (m.hist[i - 1] <= 0 && m.hist[i] > 0) { add(1.5, "MACD al sinyali: sinyal çizgisini yukarı kesti"); crossed = true; break }
                if (m.hist[i - 1] >= 0 && m.hist[i] < 0) { add(-1.5, "MACD sat sinyali: sinyal çizgisini aşağı kesti"); crossed = true; break }
            }
            if (!crossed) {
                if (hist > 0 && hist > prevHist) add(0.8, "MACD pozitif ve güçleniyor")
                else if (hist > 0) add(0.3, "MACD pozitif ama zayıflıyor")
                else if (hist < 0 && hist < prevHist) add(-0.8, "MACD negatif ve zayıflıyor")
                else add(-0.3, "MACD negatif ama toparlanıyor")
            }
        }
        // Bollinger
        val up = bb.upper[n]; val lo = bb.lower[n]
        if (!up.isNaN()) {
            if (price > up) add(-0.8, "Fiyat Bollinger üst bandının üzerinde (aşırı uzama)")
            else if (price < lo) add(0.8, "Fiyat Bollinger alt bandının altında (aşırı satış)")
        }
        // Stokastik
        val k = st.k[n]; val d = st.d[n]
        if (!k.isNaN() && !d.isNaN()) {
            if (k < 20 && k > d) add(0.8, "Stokastik aşırı satım bölgesinden dönüyor")
            else if (k > 80 && k < d) add(-0.8, "Stokastik aşırı alım bölgesinden dönüyor")
        }
        // Momentum
        when {
            roc20 > 15 -> add(0.5, "Son 20 günde güçlü yükseliş (%%%.1f)".format(roc20))
            roc20 < -15 -> add(-0.5, "Son 20 günde sert düşüş (%%%.1f)".format(roc20))
        }
        // Hacim
        if (v.takeLast(21).count { it > 0 } > 15) {
            val avgVol = v.takeLast(21).dropLast(1).average()
            val lastVol = v.last()
            val dayUp = c[n] >= c[n - 1]
            if (avgVol > 0 && lastVol > avgVol * 1.6) {
                if (dayUp) add(0.6, "Yükseliş yüksek hacimle destekleniyor")
                else add(-0.6, "Düşüş yüksek hacimle geliyor (satış baskısı)")
            }
        }
        // Destek / direnç: son 20 gün
        val support = l.takeLast(20).min()
        val resistance = h.takeLast(20).max()

        val raw = reasons.sumOf { it.weight }
        val score = (raw / 7.0 * 100).coerceIn(-100.0, 100.0)
        return TechnicalResult(
            score, rsi, m.macd[n], m.signal[n], hist, sma20, sma50, sma200, up, lo, k, d, atr, roc20,
            support, resistance, reasons.sortedByDescending { abs(it.weight) },
        )
    }

    fun fundamental(f: Fundamentals?): FundamentalResult? {
        if (f == null) return null
        val r = mutableListOf<Reason>()
        fun add(w: Double, t: String) { r += Reason(t, w) }
        f.pe?.let {
            when {
                it <= 0 -> add(-1.5, "F/K negatif (şirket zarar ediyor)")
                it < 6 -> add(1.5, "F/K %.1f: çok ucuz".format(it))
                it < 12 -> add(1.0, "F/K %.1f: makul/ucuz".format(it))
                it > 35 -> add(-1.2, "F/K %.1f: pahalı".format(it))
                it > 20 -> add(-0.4, "F/K %.1f: ortalamanın üzerinde".format(it))
                else -> {}
            }
        }
        f.pb?.let {
            when {
                it < 1 -> add(1.2, "PD/DD %.2f: defter değerinin altında".format(it))
                it < 2 -> add(0.5, "PD/DD %.2f: makul".format(it))
                it > 6 -> add(-1.0, "PD/DD %.2f: yüksek".format(it))
                else -> {}
            }
        }
        f.roe?.let {
            when {
                it > 0.30 -> add(1.5, "Özsermaye kârlılığı %%%.0f: çok güçlü".format(it * 100))
                it > 0.15 -> add(0.8, "Özsermaye kârlılığı %%%.0f: iyi".format(it * 100))
                it < 0 -> add(-1.2, "Özsermaye kârlılığı negatif")
                else -> {}
            }
        }
        f.profitMargin?.let {
            when {
                it > 0.15 -> add(0.8, "Net kâr marjı %%%.0f: yüksek".format(it * 100))
                it < 0 -> add(-1.0, "Net kâr marjı negatif")
                else -> {}
            }
        }
        f.debtToEquity?.let {
            when {
                it < 50 -> add(0.7, "Borç/Özsermaye %%%.0f: düşük borçluluk".format(it))
                it > 200 -> add(-1.0, "Borç/Özsermaye %%%.0f: yüksek borçluluk".format(it))
                else -> {}
            }
        }
        f.revenueGrowth?.let {
            when {
                it > 0.5 -> add(0.7, "Satış büyümesi %%%.0f (enflasyon üstü)".format(it * 100))
                it < 0 -> add(-0.8, "Satışlar küçülüyor (%%%.0f)".format(it * 100))
                else -> {}
            }
        }
        f.earningsGrowth?.let {
            when {
                it > 0.3 -> add(0.7, "Kâr büyümesi %%%.0f".format(it * 100))
                it < -0.2 -> add(-0.8, "Kâr düşüşü %%%.0f".format(it * 100))
                else -> {}
            }
        }
        f.dividendYield?.let { if (it > 0.04) add(0.4, "Temettü verimi %%%.1f".format(it * 100)) }
        if (r.isEmpty()) return null
        val score = (r.sumOf { it.weight } / 5.0 * 100).coerceIn(-100.0, 100.0)
        return FundamentalResult(score, r.sortedByDescending { abs(it.weight) })
    }

    fun risk(q: Quote, benchmark: Quote?): RiskResult? {
        val c = q.candles.map { it.close }
        if (c.size < 30) return null
        val rets = Indicators.logReturns(c)
        val crypto = q.instrument.type == AssetType.CRYPTO
        // Kripto 7/24 işlem görür: yıllıklandırma 365 gün üzerinden.
        val vol = Indicators.stdev(rets.takeLast(120)) * sqrt(if (crypto) 365.0 else 252.0) * 100
        val mdd = Indicators.maxDrawdown(c) * 100
        val sorted = rets.takeLast(250).sorted()
        val var95 = -sorted[(sorted.size * 0.05).toInt().coerceAtMost(sorted.size - 1)] * 100
        var beta: Double? = null
        if (benchmark != null && benchmark.instrument.symbol != q.instrument.symbol) {
            val bMap = benchmark.candles.associate { dayKey(it.time) to it.close }
            val pairs = q.candles.mapNotNull { cd -> bMap[dayKey(cd.time)]?.let { cd.close to it } }
            if (pairs.size > 40) {
                val a = Indicators.logReturns(pairs.map { it.first })
                val b = Indicators.logReturns(pairs.map { it.second })
                val ma = a.average(); val mb = b.average()
                val cov = a.indices.sumOf { (a[it] - ma) * (b[it] - mb) }
                val varB = b.sumOf { (it - mb) * (it - mb) }
                if (varB > 0) beta = cov / varB
            }
        }
        val level = if (crypto) when {
            // Kripto için eşikler daha geniş; aksi halde her coin "Çok Yüksek" çıkar.
            vol > 120 || var95 > 10 -> RiskLevel.VERY_HIGH
            vol > 80 -> RiskLevel.HIGH
            vol > 50 -> RiskLevel.MEDIUM
            else -> RiskLevel.LOW
        } else when {
            vol > 60 || var95 > 5 -> RiskLevel.VERY_HIGH
            vol > 40 -> RiskLevel.HIGH
            vol > 22 -> RiskLevel.MEDIUM
            else -> RiskLevel.LOW
        }
        return RiskResult(vol, mdd, var95, beta, level)
    }

    fun analyze(q: Quote, f: Fundamentals?, news: List<NewsItem>?, benchmark: Quote?): Analysis {
        val t = technical(q)
        val fr = if (q.instrument.type == AssetType.STOCK) fundamental(f) else null
        val newsScore = news?.takeIf { it.isNotEmpty() }?.let { list -> list.take(10).map { it.sentiment }.average().toInt() }
        val risk = risk(q, benchmark)

        var wSum = 0.0; var sSum = 0.0
        t?.let { wSum += 0.6; sSum += 0.6 * it.score }
        fr?.let { wSum += 0.3; sSum += 0.3 * it.score }
        newsScore?.let { wSum += 0.12; sSum += 0.12 * it }
        var score = if (wSum > 0) sSum / wSum else 0.0
        // Yüksek risk sinyal güvenini azaltır
        if (risk?.level == RiskLevel.VERY_HIGH) score *= 0.85

        val signal = when {
            score >= 40 -> Signal.STRONG_BUY
            score >= 15 -> Signal.BUY
            score > -15 -> Signal.HOLD
            score > -40 -> Signal.SELL
            else -> Signal.STRONG_SELL
        }
        val price = q.price
        val atr = t?.atr?.takeIf { !it.isNaN() } ?: price * 0.02
        val stop = if (signal.isSell) null else max(price - 2 * atr, t?.support?.let { min(it, price - atr) } ?: 0.0)
        val target = if (signal.isSell) null else price + 3 * atr

        val summary = buildString {
            append(when (signal) {
                Signal.STRONG_BUY -> "Göstergelerin büyük çoğunluğu olumlu. Alım için güçlü görünüm."
                Signal.BUY -> "Görünüm olumlu; kademeli alım değerlendirilebilir."
                Signal.HOLD -> "Karışık sinyaller; pozisyon korunabilir, yeni işlem için teyit beklenmeli."
                Signal.SELL -> "Görünüm zayıf; pozisyon azaltma veya stop kullanma önerilir."
                Signal.STRONG_SELL -> "Göstergeler belirgin şekilde olumsuz; satış/riskten kaçınma öne çıkıyor."
            })
            risk?.let { append(" Risk seviyesi: ${it.level.label}.") }
        }
        return Analysis(q, t, fr, f, newsScore, risk, score, signal, stop, target, summary)
    }

    fun marketRisk(quotes: Map<String, Quote>, news: List<NewsItem>): MarketRisk {
        var s = 0
        val r = mutableListOf<String>()
        fun pct(q: Quote?, days: Int): Double? {
            val c = q?.candles ?: return null
            if (c.size <= days) return null
            return (c.last().close / c[c.size - 1 - days].close - 1) * 100
        }
        quotes["XU100.IS"]?.let { q ->
            val c = q.candles.map { it.close }
            val s50 = Indicators.sma(c, 50).lastValid(); val s200 = Indicators.sma(c, 200).lastValid()
            if (!s50.isNaN() && q.price < s50) { s += 12; r += "BIST 100, 50 günlük ortalamanın altında" }
            if (!s200.isNaN() && q.price < s200) { s += 12; r += "BIST 100, 200 günlük ortalamanın altında" }
            val vol = Indicators.stdev(Indicators.logReturns(c).takeLast(20)) * sqrt(252.0) * 100
            if (vol > 35) { s += 14; r += "BIST 100 oynaklığı yüksek (yıllık %%%.0f)".format(vol) }
            if (q.changePct < -2.5) { s += 12; r += "BIST 100 bugün sert düşüşte (%%%.1f)".format(q.changePct) }
            val rsi = Indicators.rsi(c).lastValid()
            if (rsi > 75) { s += 6; r += "BIST 100 aşırı alım bölgesinde (RSI %.0f)".format(rsi) }
        }
        pct(quotes["USDTRY=X"], 5)?.let { if (it > 1.5) { s += 14; r += "Dolar/TL son 5 günde %%%.1f yükseldi".format(it) } }
        quotes["USDTRY=X"]?.let { if (it.changePct > 1.0) { s += 10; r += "Dolar/TL bugün sert yükselişte (%%%.1f)".format(it.changePct) } }
        quotes["^VIX"]?.let {
            when {
                it.price > 30 -> { s += 16; r += "Küresel korku endeksi (VIX) çok yüksek: %.1f".format(it.price) }
                it.price > 22 -> { s += 8; r += "Küresel korku endeksi (VIX) yüksek: %.1f".format(it.price) }
            }
        }
        pct(quotes["BZ=F"], 5)?.let { if (abs(it) > 8) { s += 8; r += "Petrol fiyatlarında sert hareket (5 günde %%%.1f)".format(it) } }
        pct(quotes["GC=F"], 5)?.let { if (it > 3) { s += 6; r += "Altına güvenli liman talebi (5 günde %%%.1f)".format(it) } }
        pct(quotes["^GSPC"], 5)?.let { if (it < -3) { s += 8; r += "ABD borsaları zayıf (S&P 500 5 günde %%%.1f)".format(it) } }
        val newsSent = if (news.isEmpty()) 0 else news.take(40).map { it.sentiment }.average().toInt()
        if (newsSent < -15) { s += 12; r += "Ekonomi haberlerinin genel tonu olumsuz" }
        else if (newsSent > 15) { s -= 5; r += "Ekonomi haberlerinin genel tonu olumlu" }
        s = s.coerceIn(0, 100)
        if (r.isEmpty()) r += "Belirgin bir risk sinyali yok"
        val level = when {
            s >= 70 -> RiskLevel.VERY_HIGH
            s >= 45 -> RiskLevel.HIGH
            s >= 20 -> RiskLevel.MEDIUM
            else -> RiskLevel.LOW
        }
        return MarketRisk(s, level, r, newsSent)
    }

    // İstanbul saatine göre gün (döviz barları önceki gün 23:00 UTC damgalı gelir)
    /** Kripto piyasası risk puanı (0-100). */
    fun cryptoRisk(btc: Quote?, fng: com.mustafa.borsaanaliz.data.FearGreed?, coins: List<com.mustafa.borsaanaliz.data.CoinInfo>, news: List<NewsItem>): MarketRisk {
        var s = 0
        val r = mutableListOf<String>()
        fng?.let {
            when {
                it.value <= 20 -> { s += 18; r += "Korku ve Açgözlülük Endeksi ${it.value}: aşırı korku (panik satışları)" }
                it.value <= 35 -> { s += 9; r += "Korku ve Açgözlülük Endeksi ${it.value}: korku" }
                it.value >= 80 -> { s += 20; r += "Korku ve Açgözlülük Endeksi ${it.value}: aşırı açgözlülük (balon/düzeltme riski)" }
                it.value >= 65 -> { s += 9; r += "Korku ve Açgözlülük Endeksi ${it.value}: açgözlülük" }
            }
            if (it.weekAgo != null && kotlin.math.abs(it.value - it.weekAgo) >= 20) {
                s += 6; r += "Piyasa duygusu bir haftada sert değişti (${it.weekAgo} → ${it.value})"
            }
        }
        btc?.let { q ->
            val c = q.candles.map { it.close }
            val s50 = Indicators.sma(c, 50).lastValid(); val s200 = Indicators.sma(c, 200).lastValid()
            if (!s50.isNaN() && q.price < s50) { s += 12; r += "Bitcoin 50 günlük ortalamanın altında" }
            if (!s200.isNaN() && q.price < s200) { s += 12; r += "Bitcoin 200 günlük ortalamanın altında (ayı piyasası sinyali)" }
            val vol = Indicators.stdev(Indicators.logReturns(c).takeLast(30)) * sqrt(365.0) * 100
            if (vol > 70) { s += 12; r += "Bitcoin oynaklığı yüksek (yıllık %%%.0f)".format(vol) }
        }
        // Yedek listeden gelen coinlerde 24s değişim bilinmeyebilir (NaN); yalnızca bilinenler sayılır.
        val live = coins.filter { !it.change24h.isNaN() }
        val btcInfo = live.firstOrNull { it.code == "BTC" }
        btcInfo?.let { if (it.change24h < -5) { s += 14; r += "Bitcoin son 24 saatte sert düştü (%%%.1f)".format(it.change24h) } }
        if (live.size >= 20) {
            val bigDrops = live.count { it.change24h < -5 } * 100 / live.size
            val falling = live.count { it.change24h < 0 } * 100 / live.size
            if (bigDrops >= 40) { s += 14; r += "İlk 100 coinin %$bigDrops'i 24 saatte %5'ten fazla düştü" }
            else if (falling >= 75) { s += 8; r += "İlk 100 coinin %$falling'i günü ekside geçiriyor" }
            else if (falling <= 25) { r += "Genel görünüm olumlu: coinlerin %${100 - falling}'i yükselişte" }
        }
        val newsSent = if (news.isEmpty()) 0 else news.take(30).map { it.sentiment }.average().toInt()
        if (newsSent < -15) { s += 10; r += "Kripto haberlerinin genel tonu olumsuz" }
        else if (newsSent > 15) { s -= 5; r += "Kripto haberlerinin genel tonu olumlu" }
        s = s.coerceIn(0, 100)
        if (r.isEmpty()) r += "Belirgin bir risk sinyali yok"
        val level = when {
            s >= 70 -> RiskLevel.VERY_HIGH
            s >= 45 -> RiskLevel.HIGH
            s >= 20 -> RiskLevel.MEDIUM
            else -> RiskLevel.LOW
        }
        return MarketRisk(s, level, r, newsSent)
    }

    fun dayKey(t: Long): Long = (t + 3 * 3_600_000L) / 86_400_000L
}
