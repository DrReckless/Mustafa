package com.mustafa.emlaktakip.notify

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.mustafa.emlaktakip.MainActivity
import com.mustafa.emlaktakip.R
import com.mustafa.emlaktakip.data.AppDatabase
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.TaskItem
import com.mustafa.emlaktakip.data.linkTitle
import com.mustafa.emlaktakip.util.Days
import com.mustafa.emlaktakip.util.Fmt
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.util.Calendar

object Notifier {
    const val CH_TASKS = "tasks"
    const val CH_SUMMARY = "summary"
    const val EXTRA_TASK_ID = "taskId"
    const val EXTRA_ROUTE = "route"
    private const val SUMMARY_ID = 1_000_000_001

    fun createChannels(ctx: Context) {
        if (Build.VERSION.SDK_INT < 26) return
        val nm = ctx.getSystemService(NotificationManager::class.java)
        nm.createNotificationChannel(
            NotificationChannel(CH_TASKS, "Görev hatırlatmaları", NotificationManager.IMPORTANCE_HIGH).apply {
                description = "Görev saati geldiğinde bildirim"
            }
        )
        nm.createNotificationChannel(
            NotificationChannel(CH_SUMMARY, "Günlük özet", NotificationManager.IMPORTANCE_DEFAULT).apply {
                description = "Her sabah günün görevleri"
            }
        )
    }

    fun canNotify(ctx: Context) = Build.VERSION.SDK_INT < 33 ||
        ContextCompat.checkSelfPermission(ctx, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED

    private fun openApp(ctx: Context, route: String, req: Int): PendingIntent =
        PendingIntent.getActivity(
            ctx, req,
            Intent(ctx, MainActivity::class.java).putExtra(EXTRA_ROUTE, route)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

    private fun action(ctx: Context, action: String, taskId: Long): PendingIntent =
        PendingIntent.getBroadcast(
            ctx, (taskId * 10 + action.length).toInt(),
            Intent(ctx, TaskActionReceiver::class.java).setAction(action).putExtra(EXTRA_TASK_ID, taskId),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

    fun showTask(ctx: Context, task: TaskItem, linkText: String?) {
        if (!canNotify(ctx)) return
        val body = listOfNotNull(
            task.description.takeIf { it.isNotBlank() },
            linkText,
            task.dueAt?.let { "Saat: " + Fmt.time(it) },
        ).joinToString("\n")
        val n = NotificationCompat.Builder(ctx, CH_TASKS)
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(0xFF0E4D64.toInt())
            .setContentTitle(task.title)
            .setContentText(body.lineSequence().firstOrNull() ?: "")
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(openApp(ctx, "task_edit?id=${task.id}", task.id.toInt()))
            .addAction(0, "Tamamlandı", action(ctx, TaskActionReceiver.ACTION_DONE, task.id))
            .addAction(0, "1 saat ertele", action(ctx, TaskActionReceiver.ACTION_SNOOZE, task.id))
            .build()
        try {
            NotificationManagerCompat.from(ctx).notify(task.id.toInt(), n)
        } catch (_: SecurityException) {
        }
    }

    fun showSummary(ctx: Context, title: String, lines: List<String>) {
        if (!canNotify(ctx)) return
        val style = NotificationCompat.InboxStyle()
        lines.take(7).forEach { style.addLine(it) }
        if (lines.size > 7) style.setSummaryText("+${lines.size - 7} daha")
        val n = NotificationCompat.Builder(ctx, CH_SUMMARY)
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(0xFF0E4D64.toInt())
            .setContentTitle(title)
            .setContentText(lines.firstOrNull() ?: "")
            .setStyle(style)
            .setAutoCancel(true)
            .setContentIntent(openApp(ctx, "tasks", SUMMARY_ID))
            .build()
        try {
            NotificationManagerCompat.from(ctx).notify(SUMMARY_ID, n)
        } catch (_: SecurityException) {
        }
    }

    fun cancel(ctx: Context, taskId: Long) = NotificationManagerCompat.from(ctx).cancel(taskId.toInt())
}

object Prefs {
    private fun p(ctx: Context) = ctx.getSharedPreferences("settings", Context.MODE_PRIVATE)
    fun summaryEnabled(ctx: Context) = p(ctx).getBoolean("summaryEnabled", true)
    fun summaryHour(ctx: Context) = p(ctx).getInt("summaryHour", 8)
    fun summaryMinute(ctx: Context) = p(ctx).getInt("summaryMinute", 30)
    fun setSummary(ctx: Context, enabled: Boolean, hour: Int, minute: Int) =
        p(ctx).edit().putBoolean("summaryEnabled", enabled).putInt("summaryHour", hour).putInt("summaryMinute", minute).apply()
}

object Alarms {
    private const val SUMMARY_REQ = 999_999_999

    private fun am(ctx: Context) = ctx.getSystemService(AlarmManager::class.java)

    private fun taskIntent(ctx: Context, id: Long) = PendingIntent.getBroadcast(
        ctx, id.toInt(),
        Intent(ctx, TaskAlarmReceiver::class.java).putExtra(Notifier.EXTRA_TASK_ID, id),
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    private fun setAt(ctx: Context, at: Long, pi: PendingIntent) {
        val am = am(ctx)
        val exact = Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms()
        try {
            if (exact) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
            else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
        } catch (_: SecurityException) {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi)
        }
    }

    fun schedule(ctx: Context, task: TaskItem) {
        val due = task.dueAt
        if (task.done || !task.remind || due == null || due <= System.currentTimeMillis()) {
            cancel(ctx, task.id)
            return
        }
        setAt(ctx, due, taskIntent(ctx, task.id))
    }

    fun cancel(ctx: Context, taskId: Long) = am(ctx).cancel(taskIntent(ctx, taskId))

    fun scheduleSummary(ctx: Context) {
        val pi = PendingIntent.getBroadcast(
            ctx, SUMMARY_REQ, Intent(ctx, DailySummaryReceiver::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        if (!Prefs.summaryEnabled(ctx)) {
            am(ctx).cancel(pi); return
        }
        val cal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, Prefs.summaryHour(ctx))
            set(Calendar.MINUTE, Prefs.summaryMinute(ctx))
            set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
            if (timeInMillis <= System.currentTimeMillis()) add(Calendar.DAY_OF_MONTH, 1)
        }
        setAt(ctx, cal.timeInMillis, pi)
    }

    suspend fun rescheduleAll(ctx: Context) {
        AppDatabase.get(ctx).dao().pendingReminders(System.currentTimeMillis()).forEach { schedule(ctx, it) }
        scheduleSummary(ctx)
    }
}

/** Görev tamamlama ve tekrar mantığı (uygulama ve bildirimler ortak kullanır). */
object TaskOps {
    suspend fun save(ctx: Context, task: TaskItem): Long {
        val dao = AppDatabase.get(ctx).dao()
        val id = if (task.id == 0L) dao.insert(task) else { dao.update(task); task.id }
        Alarms.schedule(ctx, task.copy(id = id))
        return id
    }

    suspend fun setDone(ctx: Context, task: TaskItem, done: Boolean) {
        val dao = AppDatabase.get(ctx).dao()
        if (done) {
            dao.update(task.copy(done = true, doneAt = System.currentTimeMillis()))
            Alarms.cancel(ctx, task.id)
            Notifier.cancel(ctx, task.id)
            if (task.repeat != "NONE") {
                // Tekrarlanan görevin bir sonraki tekrarını oluştur
                var next = Days.next(task.dueAt ?: System.currentTimeMillis(), task.repeat)
                while (next < System.currentTimeMillis()) next = Days.next(next, task.repeat)
                save(ctx, task.copy(id = 0, dueAt = next, done = false, doneAt = null, createdAt = System.currentTimeMillis()))
            }
        } else {
            val t = task.copy(done = false, doneAt = null)
            dao.update(t)
            Alarms.schedule(ctx, t)
        }
    }

    suspend fun delete(ctx: Context, task: TaskItem) {
        AppDatabase.get(ctx).dao().delete(task)
        Alarms.cancel(ctx, task.id)
        Notifier.cancel(ctx, task.id)
    }
}

private val receiverScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

private fun BroadcastReceiver.async(block: suspend () -> Unit) {
    val pending = goAsync()
    receiverScope.launch {
        try { block() } finally { pending.finish() }
    }
}

class TaskAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val id = intent.getLongExtra(Notifier.EXTRA_TASK_ID, 0)
        async {
            val dao = AppDatabase.get(context).dao()
            val task = dao.getTask(id) ?: return@async
            if (task.done) return@async
            val link = LinkType.of(task.linkType)?.let { t ->
                task.linkId?.let { dao.linkTitle(t, it) }?.let { "${t.label}: $it" }
            }
            Notifier.showTask(context, task, link)
        }
    }
}

class TaskActionReceiver : BroadcastReceiver() {
    companion object {
        const val ACTION_DONE = "com.mustafa.emlaktakip.DONE"
        const val ACTION_SNOOZE = "com.mustafa.emlaktakip.SNOOZE"
    }

    override fun onReceive(context: Context, intent: Intent) {
        val id = intent.getLongExtra(Notifier.EXTRA_TASK_ID, 0)
        async {
            val dao = AppDatabase.get(context).dao()
            val task = dao.getTask(id) ?: return@async
            when (intent.action) {
                ACTION_DONE -> TaskOps.setDone(context, task, true)
                ACTION_SNOOZE -> {
                    Notifier.cancel(context, id)
                    TaskOps.save(context, task.copy(dueAt = System.currentTimeMillis() + 60 * 60 * 1000, remind = true))
                }
            }
        }
    }
}

class DailySummaryReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        async {
            val dao = AppDatabase.get(context).dao()
            val until = Days.endOfToday()
            val tasks = dao.openTasksUntil(until)
            val investors = dao.investorsToContact(until)
            val lines = tasks.map { t ->
                val prefix = if (Days.isOverdue(t.dueAt) && t.dueAt!! < Days.startOfDay(System.currentTimeMillis())) "⚠ " else "• "
                prefix + Fmt.time(t.dueAt) + " " + t.title
            } + investors.map { "☎ Yatırımcı: ${it.name}" }
            if (lines.isNotEmpty()) {
                Notifier.showSummary(context, "Bugün ${tasks.size} görev, ${investors.size} yatırımcı takibi", lines)
            }
            Alarms.scheduleSummary(context)
        }
    }
}

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        async { Alarms.rescheduleAll(context) }
    }
}
