package com.mustafa.borsaanaliz.worker

import android.content.Context
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.mustafa.borsaanaliz.analysis.Analyzer
import com.mustafa.borsaanaliz.analysis.RiskLevel
import com.mustafa.borsaanaliz.analysis.Signal
import com.mustafa.borsaanaliz.data.Prefs
import com.mustafa.borsaanaliz.data.Repository
import com.mustafa.borsaanaliz.data.Universe
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import java.util.concurrent.TimeUnit

object MonitorScheduler {
    private const val NAME = "market-monitor"

    fun schedule(ctx: Context, intervalMin: Int) {
        val req = PeriodicWorkRequestBuilder<MonitorWorker>(intervalMin.coerceAtLeast(15).toLong(), TimeUnit.MINUTES)
            .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
            .build()
        WorkManager.getInstance(ctx).enqueueUniquePeriodicWork(NAME, ExistingPeriodicWorkPolicy.UPDATE, req)
    }

    fun runNow(ctx: Context) {
        WorkManager.getInstance(ctx).enqueue(OneTimeWorkRequestBuilder<MonitorWorker>().build())
    }
}

/** Arka planda portföyü ve piyasayı tarar; gerekirse bildirim gönderir. */
class MonitorWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {

    override suspend fun doWork(): Result {
        val prefs = Prefs(applicationContext)
        val s = prefs.settings()
        if (!s.notificationsEnabled) return Result.success()
        val ctx = applicationContext
        val tz = TimeZone.getTimeZone("Europe/Istanbul")
        val day = SimpleDateFormat("yyyyMMdd", Locale.US).apply { timeZone = tz }.format(Date())
        val cal = Calendar.getInstance(tz)
        val weekday = cal.get(Calendar.DAY_OF_WEEK) !in listOf(Calendar.SATURDAY, Calendar.SUNDAY)
        val hour = cal.get(Calendar.HOUR_OF_DAY)
        var nid = 1000

        try {
            // 1) Portföy: acil satış uyarıları
            val positions = prefs.positions()
            for (p in positions) {
                val inst = Universe.find(p.symbol)
                val a = Repository.analyze(inst, withNews = false, withFundamentals = false, maxAgeMs = 60_000) ?: continue
                val price = a.quote.price
                val code = Universe.displayCode(inst)
                val stop = p.stopLoss ?: (p.cost * (1 - s.autoStopPct / 100))
                val target = p.target ?: (p.cost * (1 + s.autoTargetPct / 100))
                val pl = (price / p.cost - 1) * 100

                if (price <= stop && prefs.markNotified("stop_${p.symbol}", day)) {
                    Notifier.send(ctx, nid++, Notifier.CH_URGENT, "⚠ ACİL: $code stop seviyesinin altında",
                        "Fiyat %.2f, stop %.2f (maliyete göre %%%.1f). Zararı sınırlamak için SATIŞ düşünün.".format(price, stop, pl), p.symbol)
                }
                if (a.quote.changePct <= -s.dailyDropAlertPct && prefs.markNotified("drop_${p.symbol}", day)) {
                    Notifier.send(ctx, nid++, Notifier.CH_URGENT, "⚠ $code sert düşüşte: %%%.1f".format(a.quote.changePct),
                        "Bugün sert satış var. Fiyat %.2f. Teknik görünüm: ${a.signal.label}. Pozisyonunuzu gözden geçirin.".format(price), p.symbol)
                }
                if (s.notifySellSignals && a.signal.isSell && prefs.markNotified("sell_${p.symbol}_${a.signal}", day)) {
                    val why = a.technical?.reasons?.filter { it.weight < 0 }?.take(2)?.joinToString("; ") { it.text } ?: ""
                    Notifier.send(ctx, nid++, if (a.signal == Signal.STRONG_SELL) Notifier.CH_URGENT else Notifier.CH_SIGNAL,
                        "$code için ${a.signal.label} sinyali", "Fiyat %.2f (K/Z %%%.1f). $why".format(price, pl), p.symbol)
                }
                if (price >= target && prefs.markNotified("target_${p.symbol}", day)) {
                    Notifier.send(ctx, nid++, Notifier.CH_SIGNAL, "$code hedefe ulaştı 🎯",
                        "Fiyat %.2f, kâr %%%.1f. Kâr realizasyonu değerlendirilebilir.".format(price, pl), p.symbol)
                }
            }

            // 2) Fiyat alarmları
            val alarms = prefs.alarms()
            val remaining = alarms.toMutableList()
            for (al in alarms) {
                val q = Repository.quote(Universe.find(al.symbol), 60_000) ?: continue
                val hit = if (al.above) q.price >= al.price else q.price <= al.price
                if (hit) {
                    Notifier.send(ctx, nid++, Notifier.CH_URGENT, "🔔 Fiyat alarmı: ${Universe.displayCode(q.instrument)}",
                        "Fiyat %.2f, alarm seviyesi %.2f (%s)".format(q.price, al.price, if (al.above) "üzerine çıktı" else "altına indi"), al.symbol)
                    remaining.remove(al)
                }
            }
            if (remaining.size != alarms.size) prefs.setAlarms(remaining)

            // 3) Piyasa riski
            val marketQuotes = Repository.quotes(Universe.markets, 60_000)
            val news = if (s.notifyMarketRisk || s.dailySummary) Repository.news(null) else emptyList()
            val mr = Analyzer.marketRisk(marketQuotes, news)
            if (s.notifyMarketRisk && mr.level >= RiskLevel.HIGH && prefs.markNotified("market_risk", day)) {
                Notifier.send(ctx, nid++, Notifier.CH_URGENT, "⚠ Piyasa riski ${mr.level.label} (${mr.score}/100)",
                    mr.reasons.take(3).joinToString("\n• ", prefix = "• "))
            }

            // 4) Güçlü al sinyalleri (BIST 100 + izleme listesi taraması)
            if (s.notifyBuySignals && weekday && hour in 10..17) {
                val list = Repository.analyzeAll((Universe.bist100 + prefs.watchlist()).distinct().map { Universe.stock(it) }, withFundamentals = false, maxAgeMs = 60_000)
                list.filter { it.signal == Signal.STRONG_BUY }.forEach { a ->
                    if (prefs.markNotified("buy_${a.quote.instrument.symbol}", day)) {
                        Notifier.send(ctx, nid++, Notifier.CH_SIGNAL, "${Universe.displayCode(a.quote.instrument)}: GÜÇLÜ AL sinyali",
                            "Fiyat %.2f. Stop %.2f, hedef %.2f".format(a.quote.price, a.stopLoss ?: 0.0, a.target ?: 0.0), a.quote.instrument.symbol)
                    }
                }
            }

            // 5) Günlük özet (hafta içi sabah)
            if (s.dailySummary && weekday && hour >= 9 && prefs.markNotified("summary", day)) {
                val bist = marketQuotes["XU100.IS"]; val usd = marketQuotes["USDTRY=X"]; val gold = marketQuotes[Universe.GRAM_GOLD]
                val text = buildString {
                    bist?.let { append("BIST100 %.0f (%+.1f%%)  ".format(it.price, it.changePct)) }
                    usd?.let { append("USD %.2f  ".format(it.price)) }
                    gold?.let { append("Gram altın %.0f\n".format(it.price)) }
                    append("Piyasa riski: ${mr.level.label}. ")
                    append(mr.reasons.first())
                }
                Notifier.send(ctx, 999, Notifier.CH_SUMMARY, "Günlük piyasa özeti", text)
            }
            prefs.lastCheck = System.currentTimeMillis()
        } catch (e: Exception) {
            return Result.retry()
        }
        return Result.success()
    }
}
