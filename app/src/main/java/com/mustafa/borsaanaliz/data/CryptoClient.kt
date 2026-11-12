package com.mustafa.borsaanaliz.data

import org.json.JSONArray
import org.json.JSONObject
import java.util.Locale

data class CoinInfo(
    val code: String, // BTC
    val name: String,
    val rank: Int,
    val price: Double,
    val change24h: Double,
    val change7d: Double,
    val marketCap: Double,
    val volume: Double,
)

data class FearGreed(val value: Int, val label: String, val weekAgo: Int?)

/** Coin listesi + hangi kaynaktan geldiği; kaynaklar başarısız olduysa nedenleri. */
data class CoinList(val coins: List<CoinInfo>, val source: String, val errors: List<String>)

/**
 * Kripto verileri. Liste: CoinGecko → CoinPaprika → Binance (hacme göre) sırasıyla denenir, çünkü
 * ücretsiz servisler (özellikle CoinGecko) paylaşımlı mobil IP'lerden sık sık istek sınırına (HTTP 429) takılır.
 * Günlük mumlar: Binance, yoksa Yahoo. Korku/açgözlülük: alternative.me.
 */
object CryptoClient {
    private val binanceHosts = listOf("data-api.binance.vision", "api.binance.com", "api1.binance.com")

    // Sarılı/stake edilmiş tokenlar asıl coinin kopyasıdır; altın tokenları emtiadır. Analiz dışı.
    private val excludedNameParts = listOf("wrapped", "staked", "bridged", "restaked", "gold")
    private val stableCodes = setOf(
        "USDT", "USDC", "DAI", "TUSD", "FDUSD", "USDP", "BUSD", "USDE", "USDS", "USD1", "PYUSD", "USDD",
        "EURC", "EURI", "AEUR", "RLUSD", "USDG", "GHO", "FRAX", "LUSD", "USD0", "USDF", "USDTB", "BFUSD", "A7A5",
    )
    // Tokenize fonlar / stablecoinler adlarından tanınır
    private val fundNameParts = listOf("usd", "dollar", "euro", "treasury", "fund", "yield", "t-bill", "money market")

    private fun isExcludedName(name: String) = name.lowercase(Locale.ROOT).let { n -> excludedNameParts.any { n.contains(it) } }

    /**
     * Dolara/euroya sabitlenmiş coin veya tokenize fon. Gerçek verilerle ayarlandı:
     * stablecoinler ~1$ civarında ve hareketsiz; fonlar (USTB, OUSG...) her fiyatta ama neredeyse hiç kıpırdamıyor.
     * Bilinen büyük coinler (TRX, TON gibi sakin günleri olanlar) asla elenmez.
     */
    private fun isPegged(code: String, name: String, price: Double, c24: Double, c7: Double?): Boolean {
        if (CryptoNames.isCore(code)) return false
        if (code in stableCodes || code.startsWith("USD")) return true
        val n = name.lowercase(Locale.ROOT)
        if (fundNameParts.any { n.contains(it) }) return true
        val a24 = kotlin.math.abs(c24); val a7 = c7?.let { kotlin.math.abs(it) }
        if (a24 < 0.1 && (a7 == null || a7 < 0.3)) return true
        return price in 0.90..1.25 && a24 < 0.5 && (a7 == null || a7 < 2.0)
    }

    /** Borsalardaki koda çevirir (ör. CoinGecko/CoinPaprika TON'u artık "GRAM" diye listeliyor). */
    private fun normalizeCode(symbol: String, name: String): String =
        if (name.contains("Toncoin", ignoreCase = true)) "TON" else symbol.uppercase(Locale.ROOT)

    private fun validCode(code: String) = code.isNotBlank() && code.all { it in 'A'..'Z' || it in '0'..'9' }

    /** ETH/BTC/SOL türevleri (WETH, RETH, SOLVBTC, MSOL, WBNB...): asıl coinin kopyası. */
    private fun isDerivative(code: String): Boolean =
        !CryptoNames.isCore(code) && code.length > 3 && listOf("ETH", "BTC", "SOL", "BNB").any { code.endsWith(it) } ||
            code in setOf("JLP", "TBTC")

    private fun MutableList<CoinInfo>.addCoin(c: CoinInfo, n: Int): Boolean {
        if (size >= n || !validCode(c.code) || any { it.code == c.code }) return size < n
        if (isExcludedName(c.name) || isDerivative(c.code) ||
            isPegged(c.code, c.name, c.price, c.change24h, c.change7d.takeIf { !it.isNaN() })
        ) return true
        CryptoNames.put(c.code, c.name)
        add(c)
        return size < n
    }

    private fun JSONObject.num(key: String) = optDouble(key, 0.0).let { if (it.isNaN()) 0.0 else it }

    /** Piyasa değerine göre ilk [n] coin (stablecoin, sarılı token ve altın tokenları hariç). */
    fun topCoins(n: Int = 100): CoinList {
        val errors = mutableListOf<String>()
        fun attempt(source: String, f: () -> List<CoinInfo>): CoinList? = try {
            val list = f()
            if (list.size >= 10) CoinList(list, source, errors.toList()) else { errors += "$source: boş yanıt"; null }
        } catch (e: HttpException) {
            errors += "$source: HTTP ${e.code}"; null
        } catch (e: Exception) {
            errors += "$source: ${e.javaClass.simpleName}"; null
        }
        return attempt("CoinGecko") { coinGecko(n) }
            ?: attempt("CoinPaprika") { coinPaprika(n) }
            ?: attempt("Binance (hacme göre)") { binanceByVolume(n) }
            ?: CoinList(emptyList(), "", errors)
    }

    internal fun coinGecko(n: Int): List<CoinInfo> {
        val arr = JSONArray(Http.get(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc" +
                "&per_page=250&page=1&price_change_percentage=24h,7d"
        ))
        val out = mutableListOf<CoinInfo>()
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            val name = o.optString("name")
            val c = CoinInfo(
                normalizeCode(o.optString("symbol"), name), name, o.optInt("market_cap_rank", i + 1), o.num("current_price"),
                o.num("price_change_percentage_24h"), o.num("price_change_percentage_7d_in_currency"),
                o.num("market_cap"), o.num("total_volume"),
            )
            if (!out.addCoin(c, n)) break
        }
        return out
    }

    internal fun coinPaprika(n: Int): List<CoinInfo> {
        val arr = JSONArray(Http.get("https://api.coinpaprika.com/v1/tickers?limit=250"))
        val out = mutableListOf<CoinInfo>()
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            val q = o.optJSONObject("quotes")?.optJSONObject("USD") ?: continue
            val name = o.optString("name")
            val c = CoinInfo(
                normalizeCode(o.optString("symbol"), name), name, o.optInt("rank", i + 1), q.num("price"),
                q.num("percent_change_24h"), q.num("percent_change_7d"), q.num("market_cap"), q.num("volume_24h"),
            )
            if (!out.addCoin(c, n)) break
        }
        return out.sortedBy { it.rank }
    }

    /** Son çare: Binance USDT paritelerinin 24 saatlik işlem hacmine göre sıralaması (piyasa değeri değil). */
    internal fun binanceByVolume(n: Int): List<CoinInfo> {
        val arr = JSONArray(Http.get("https://data-api.binance.vision/api/v3/ticker/24hr?type=FULL"))
        val rows = (0 until arr.length()).map { arr.getJSONObject(it) }
            .filter { it.optString("symbol").endsWith("USDT") }
            .sortedByDescending { it.num("quoteVolume") }
        val out = mutableListOf<CoinInfo>()
        rows.forEachIndexed { i, o ->
            val code = o.optString("symbol").removeSuffix("USDT")
            // Binance hacim listesinde tokenize hisseler (NVDAB...), altın ve kaldıraçlı tokenlar da var:
            // bu son çare kaynakta yalnızca daha önce tanınmış coinler kabul edilir.
            if (!CryptoNames.isKnown(code) || code in setOf("XAUT", "PAXG", "EUR")) return@forEachIndexed
            val c = CoinInfo(
                code, CryptoNames.get(code) ?: code, i + 1, o.num("lastPrice"), o.num("priceChangePercent"), Double.NaN,
                0.0, o.num("quoteVolume"),
            )
            if (!out.addCoin(c, n)) return out.mapIndexed { r, x -> x.copy(rank = r + 1) }
        }
        return out.mapIndexed { r, x -> x.copy(rank = r + 1) }
    }

    /** Günlük mumlar. Önce Binance (USDT paritesi), yoksa Yahoo (yalnızca coin adı eşleşirse). */
    fun history(code: String, name: String?): Pair<List<Candle>, String>? {
        binance(code)?.let { if (it.size >= 2) return it to "Binance" }
        val (candles, meta) = runCatching { YahooClient.chart("$code-USD") }.getOrNull() ?: return null
        if (candles.size < 2) return null
        // Yahoo bazı kısa kodları başka coinlerle eşleştiriyor (ör. "M"); adı doğrulanmayan veri kullanılmaz.
        val yName = (meta.optString("longName") + " " + meta.optString("shortName")).lowercase(Locale.ROOT)
        val first = name?.lowercase(Locale.ROOT)?.split(' ', '-')?.firstOrNull { it.length >= 2 }
        if (name != null && first != null && !yName.contains(first)) return null
        return candles to "Yahoo"
    }

    private fun binance(code: String): List<Candle>? {
        for (h in binanceHosts) {
            try {
                val body = Http.get("https://$h/api/v3/klines?symbol=${code}USDT&interval=1d&limit=365")
                val arr = JSONArray(body)
                return List(arr.length()) {
                    val k = arr.getJSONArray(it)
                    Candle(k.getLong(0), k.getString(1).toDouble(), k.getString(2).toDouble(),
                        k.getString(3).toDouble(), k.getString(4).toDouble(), k.getString(5).toDouble())
                }
            } catch (e: HttpException) {
                if (e.code == 400) return null // parite yok
            } catch (_: Exception) {
            }
        }
        return null
    }

    fun fearGreed(): FearGreed? = runCatching {
        val d = JSONObject(Http.get("https://api.alternative.me/fng/?limit=8")).getJSONArray("data")
        val now = d.getJSONObject(0)
        val v = now.getString("value").toInt()
        FearGreed(v, fngLabel(v), if (d.length() > 7) d.getJSONObject(7).getString("value").toInt() else null)
    }.getOrNull()

    fun fngLabel(v: Int) = when {
        v <= 24 -> "Aşırı Korku"
        v <= 44 -> "Korku"
        v <= 55 -> "Nötr"
        v <= 75 -> "Açgözlülük"
        else -> "Aşırı Açgözlülük"
    }
}
