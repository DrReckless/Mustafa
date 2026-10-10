package com.mustafa.borsaanaliz.worker

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.mustafa.borsaanaliz.R
import com.mustafa.borsaanaliz.ui.MainActivity

object Notifier {
    const val CH_URGENT = "urgent"
    const val CH_SIGNAL = "signals"
    const val CH_SUMMARY = "summary"

    fun createChannels(ctx: Context) {
        val nm = ctx.getSystemService(NotificationManager::class.java)
        nm.createNotificationChannel(NotificationChannel(CH_URGENT, "Acil uyarılar (stop / sert düşüş)", NotificationManager.IMPORTANCE_HIGH).apply {
            description = "Portföyünüzdeki hisseler için acil satış uyarıları"
            enableVibration(true)
            vibrationPattern = longArrayOf(0, 400, 200, 400)
        })
        nm.createNotificationChannel(NotificationChannel(CH_SIGNAL, "Al/Sat sinyalleri", NotificationManager.IMPORTANCE_DEFAULT))
        nm.createNotificationChannel(NotificationChannel(CH_SUMMARY, "Günlük özet", NotificationManager.IMPORTANCE_LOW))
    }

    fun canNotify(ctx: Context): Boolean =
        Build.VERSION.SDK_INT < 33 ||
            ContextCompat.checkSelfPermission(ctx, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED

    fun send(ctx: Context, id: Int, channel: String, title: String, text: String, symbol: String? = null) {
        if (!canNotify(ctx)) return
        val intent = Intent(ctx, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            symbol?.let { putExtra(MainActivity.EXTRA_SYMBOL, it) }
        }
        val pi = PendingIntent.getActivity(ctx, id, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        val n = NotificationCompat.Builder(ctx, channel)
            .setSmallIcon(R.drawable.ic_notify)
            .setColor(0xFF2B2E33.toInt())
            .setContentTitle(title)
            .setContentText(text)
            .setStyle(NotificationCompat.BigTextStyle().bigText(text))
            .setPriority(if (channel == CH_URGENT) NotificationCompat.PRIORITY_HIGH else NotificationCompat.PRIORITY_DEFAULT)
            .setCategory(if (channel == CH_URGENT) NotificationCompat.CATEGORY_ALARM else NotificationCompat.CATEGORY_RECOMMENDATION)
            .setAutoCancel(true)
            .setContentIntent(pi)
            .build()
        try {
            NotificationManagerCompat.from(ctx).notify(id, n)
        } catch (_: SecurityException) {
        }
    }
}
