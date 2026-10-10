package com.mustafa.borsaanaliz.data

import org.json.JSONObject
import java.net.URLEncoder

/** Yahoo Finance üzerinden fiyat geçmişi ve temel veriler. */
object YahooClient {
    private val hosts = listOf("query1.finance.yahoo.com", "query2.finance.yahoo.com")
    @Volatile private var crumb: String? = null

    fun chart(symbol: String, range: String = "1y", interval: String = "1d"): Pair<List<Candle>, JSONObject> {
        val enc = URLEncoder.encode(symbol, "UTF-8")
        var last: Exception? = null
        for (h in hosts) {
            try {
                val body = Http.get("https://$h/v8/finance/chart/$enc?range=$range&interval=$interval&includePrePost=false")
                return parseChart(body)
            } catch (e: Exception) {
                last = e
            }
        }
        throw last ?: IllegalStateException("veri yok")
    }

    private fun parseChart(body: String): Pair<List<Candle>, JSONObject> {
        val result = JSONObject(body).getJSONObject("chart").getJSONArray("result").getJSONObject(0)
        val meta = result.getJSONObject("meta")
        val ts = result.optJSONArray("timestamp") ?: return emptyList<Candle>() to meta
        val q = result.getJSONObject("indicators").getJSONArray("quote").getJSONObject(0)
        val o = q.optJSONArray("open"); val h = q.optJSONArray("high"); val l = q.optJSONArray("low")
        val c = q.optJSONArray("close"); val v = q.optJSONArray("volume")
        val list = ArrayList<Candle>(ts.length())
        for (i in 0 until ts.length()) {
            if (c == null || c.isNull(i)) continue
            val close = c.getDouble(i)
            list += Candle(
                time = ts.getLong(i) * 1000,
                open = o?.optDouble(i, close)?.takeIf { !it.isNaN() } ?: close,
                high = h?.optDouble(i, close)?.takeIf { !it.isNaN() } ?: close,
                low = l?.optDouble(i, close)?.takeIf { !it.isNaN() } ?: close,
                close = close,
                volume = v?.optDouble(i, 0.0)?.takeIf { !it.isNaN() } ?: 0.0,
            )
        }
        return list to meta
    }

    private fun ensureCrumb(): String? {
        crumb?.let { return it }
        runCatching { Http.get("https://fc.yahoo.com/", allowError = true) }
        runCatching { Http.get("https://finance.yahoo.com/quote/XU100.IS/", allowError = true) }
        val c = runCatching { Http.get("https://query1.finance.yahoo.com/v1/test/getcrumb") }.getOrNull()
            ?.trim()?.takeIf { it.isNotEmpty() && !it.contains(' ') && it.length < 40 }
        crumb = c
        return c
    }

    fun fundamentals(symbol: String): Fundamentals? {
        val c = ensureCrumb() ?: return null
        val enc = URLEncoder.encode(symbol, "UTF-8")
        val url = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/$enc" +
            "?modules=summaryDetail,defaultKeyStatistics,financialData&crumb=" + URLEncoder.encode(c, "UTF-8")
        val body = try {
            Http.get(url)
        } catch (e: HttpException) {
            if (e.code == 401 || e.code == 403) crumb = null
            return null
        }
        val r = JSONObject(body).getJSONObject("quoteSummary").optJSONArray("result")?.optJSONObject(0) ?: return null
        val sd = r.optJSONObject("summaryDetail")
        val ks = r.optJSONObject("defaultKeyStatistics")
        val fd = r.optJSONObject("financialData")
        fun JSONObject?.raw(key: String): Double? =
            this?.optJSONObject(key)?.optDouble("raw")?.takeIf { !it.isNaN() }
        return Fundamentals(
            pe = sd.raw("trailingPE") ?: ks.raw("trailingPE"),
            pb = ks.raw("priceToBook"),
            roe = fd.raw("returnOnEquity"),
            profitMargin = fd.raw("profitMargins") ?: ks.raw("profitMargins"),
            debtToEquity = fd.raw("debtToEquity"),
            revenueGrowth = fd.raw("revenueGrowth"),
            earningsGrowth = fd.raw("earningsGrowth"),
            dividendYield = sd.raw("dividendYield"),
            marketCap = sd.raw("marketCap"),
            currentRatio = fd.raw("currentRatio"),
        )
    }
}
