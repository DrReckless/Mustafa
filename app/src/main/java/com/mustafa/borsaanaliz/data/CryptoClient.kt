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

/** Kripto verileri: CoinGecko (piyasa değeri sıralaması), Binance (günlük mumlar), alternative.me (korku/açgözlülük). */
object CryptoClient {
    private val binanceHosts = listOf("data-api.binance.vision", "api.binance.com", "api1.binance.com")

    // Altına/dolara endeksli varlıklar ve sarılı (wrapped) tokenlar analiz dışı.
    private val excludedIds = setOf("tether-gold", "pax-gold", "kinesis-gold", "kinesis-silver")
    // CoinGecko kodu borsadaki koddan farklı olanlar
    private val codeOverrides = mapOf("the-open-network" to "TON")
    private val excludedIdParts = listOf("wrapped", "staked", "bridged", "liquid-staked", "restaked")

    /** Piyasa değerine göre ilk [n] coin (stablecoin ve endeksli varlıklar hariç). */
    fun topCoins(n: Int = 100): List<CoinInfo> {
        val body = Http.get(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc" +
                "&per_page=250&page=1&price_change_percentage=24h,7d"
        )
        val arr = JSONArray(body)
        val out = mutableListOf<CoinInfo>()
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            val id = o.optString("id")
            if (id in excludedIds || excludedIdParts.any { id.contains(it) }) continue
            val c24 = o.optDouble("price_change_percentage_24h", 0.0).let { if (it.isNaN()) 0.0 else it }
            val c7 = o.optDouble("price_change_percentage_7d_in_currency", 0.0).let { if (it.isNaN()) 0.0 else it }
            // Sabit değerli (stablecoin) varlıklar: haftalık ve günlük hareket neredeyse sıfır.
            if (kotlin.math.abs(c7) < 1.0 && kotlin.math.abs(c24) < 0.6) continue
            val code = codeOverrides[id] ?: o.optString("symbol").uppercase(Locale.ROOT)
            // Yalnızca Latin harf/rakam içeren kodlar (borsalarda işlem gören kodlar böyledir)
            if (code.isBlank() || !code.all { it in 'A'..'Z' || it in '0'..'9' } || out.any { it.code == code }) continue
            val name = o.optString("name", code)
            CryptoNames.put(code, name)
            out += CoinInfo(
                code, name, o.optInt("market_cap_rank", i + 1), o.optDouble("current_price", 0.0),
                c24, c7, o.optDouble("market_cap", 0.0), o.optDouble("total_volume", 0.0),
            )
            if (out.size >= n) break
        }
        return out
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
