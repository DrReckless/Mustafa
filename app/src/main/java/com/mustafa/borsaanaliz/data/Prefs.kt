package com.mustafa.borsaanaliz.data

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

/** Kullanıcı verilerinin (izleme listesi, portföy, alarmlar, ayarlar) kalıcı saklanması. */
class Prefs(context: Context) {
    private val sp = context.applicationContext.getSharedPreferences("borsa", Context.MODE_PRIVATE)

    fun watchlist(): List<String> {
        val raw = sp.getString("watchlist", null) ?: return Universe.defaultStocks
        val arr = JSONArray(raw)
        return List(arr.length()) { arr.getString(it) }
    }

    fun setWatchlist(list: List<String>) {
        sp.edit().putString("watchlist", JSONArray(list.distinct()).toString()).apply()
    }

    /** Kullanıcının ilk 100 dışında da takip etmek istediği coinler (ör. "PEPE"). */
    fun cryptoWatchlist(): List<String> {
        val arr = JSONArray(sp.getString("crypto_watchlist", "[]"))
        return List(arr.length()) { arr.getString(it) }
    }

    fun setCryptoWatchlist(list: List<String>) {
        sp.edit().putString("crypto_watchlist", JSONArray(list.distinct()).toString()).apply()
    }

    /** Kripto sekmesi en az bir kez açıldıysa arka planda kripto riski de izlenir. */
    var cryptoUsed: Boolean
        get() = sp.getBoolean("crypto_used", false)
        set(v) = sp.edit().putBoolean("crypto_used", v).apply()

    fun positions(): List<Position> {
        val arr = JSONArray(sp.getString("positions", "[]"))
        return List(arr.length()) {
            val o = arr.getJSONObject(it)
            Position(
                symbol = o.getString("symbol"),
                quantity = o.getDouble("quantity"),
                cost = o.getDouble("cost"),
                stopLoss = o.optDouble("stop").takeIf { d -> !d.isNaN() },
                target = o.optDouble("target").takeIf { d -> !d.isNaN() },
            )
        }
    }

    fun setPositions(list: List<Position>) {
        val arr = JSONArray()
        list.forEach { p ->
            arr.put(JSONObject().apply {
                put("symbol", p.symbol); put("quantity", p.quantity); put("cost", p.cost)
                p.stopLoss?.let { put("stop", it) }
                p.target?.let { put("target", it) }
            })
        }
        sp.edit().putString("positions", arr.toString()).apply()
    }

    fun alarms(): List<PriceAlarm> {
        val arr = JSONArray(sp.getString("alarms", "[]"))
        return List(arr.length()) {
            val o = arr.getJSONObject(it)
            PriceAlarm(o.getString("symbol"), o.getDouble("price"), o.getBoolean("above"))
        }
    }

    fun setAlarms(list: List<PriceAlarm>) {
        val arr = JSONArray()
        list.forEach { a -> arr.put(JSONObject().put("symbol", a.symbol).put("price", a.price).put("above", a.above)) }
        sp.edit().putString("alarms", arr.toString()).apply()
    }

    fun settings(): Settings {
        val d = Settings()
        return Settings(
            notificationsEnabled = sp.getBoolean("s_notif", d.notificationsEnabled),
            checkIntervalMin = sp.getInt("s_interval", d.checkIntervalMin),
            autoStopPct = sp.getFloat("s_stop", d.autoStopPct.toFloat()).toDouble(),
            autoTargetPct = sp.getFloat("s_target", d.autoTargetPct.toFloat()).toDouble(),
            dailyDropAlertPct = sp.getFloat("s_drop", d.dailyDropAlertPct.toFloat()).toDouble(),
            cryptoDropAlertPct = sp.getFloat("s_cdrop", d.cryptoDropAlertPct.toFloat()).toDouble(),
            notifySellSignals = sp.getBoolean("s_sell", d.notifySellSignals),
            notifyBuySignals = sp.getBoolean("s_buy", d.notifyBuySignals),
            notifyMarketRisk = sp.getBoolean("s_risk", d.notifyMarketRisk),
            dailySummary = sp.getBoolean("s_summary", d.dailySummary),
        )
    }

    fun setSettings(s: Settings) {
        sp.edit()
            .putBoolean("s_notif", s.notificationsEnabled)
            .putInt("s_interval", s.checkIntervalMin)
            .putFloat("s_stop", s.autoStopPct.toFloat())
            .putFloat("s_target", s.autoTargetPct.toFloat())
            .putFloat("s_drop", s.dailyDropAlertPct.toFloat())
            .putFloat("s_cdrop", s.cryptoDropAlertPct.toFloat())
            .putBoolean("s_sell", s.notifySellSignals)
            .putBoolean("s_buy", s.notifyBuySignals)
            .putBoolean("s_risk", s.notifyMarketRisk)
            .putBoolean("s_summary", s.dailySummary)
            .apply()
    }

    /** Aynı uyarının gün içinde tekrar gönderilmesini engeller. true dönerse gönderilebilir. */
    fun markNotified(key: String, day: String): Boolean {
        val k = "n_$key"
        if (sp.getString(k, null) == day) return false
        sp.edit().putString(k, day).apply()
        return true
    }

    var lastCheck: Long
        get() = sp.getLong("last_check", 0L)
        set(v) = sp.edit().putLong("last_check", v).apply()
}
