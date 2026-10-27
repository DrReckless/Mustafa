package com.mustafa.emlaktakip.util

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

val TR: Locale = Locale.forLanguageTag("tr-TR")

/** Türkçe biçimlendirme yardımcıları */
object Fmt {
    fun money(v: Long?): String = v?.let { NumberFormat.getIntegerInstance(TR).format(it) + " ₺" } ?: ""

    fun budget(min: Long?, max: Long?): String = when {
        min != null && max != null -> "${short(min)} – ${short(max)} ₺"
        max != null -> "En fazla ${short(max)} ₺"
        min != null -> "En az ${short(min)} ₺"
        else -> ""
    }

    /** 2.500.000 -> "2,5 M", 750.000 -> "750 B" */
    fun short(v: Long): String = when {
        v >= 1_000_000 -> {
            val m = v / 1_000_000.0
            (if (m % 1.0 == 0.0) m.toLong().toString() else String.format(TR, "%.1f", m)) + " M"
        }
        v >= 1_000 -> "${v / 1_000} B"
        else -> v.toString()
    }

    fun sqm(v: Int?): String = v?.let { "$it m²" } ?: ""

    fun date(ms: Long?): String = ms?.let { SimpleDateFormat("d MMMM yyyy", TR).format(Date(it)) } ?: ""
    fun dateShort(ms: Long?): String = ms?.let { SimpleDateFormat("d MMM", TR).format(Date(it)) } ?: ""
    fun time(ms: Long?): String = ms?.let { SimpleDateFormat("HH:mm", TR).format(Date(it)) } ?: ""
    fun dateTime(ms: Long?): String = ms?.let { SimpleDateFormat("d MMM yyyy HH:mm", TR).format(Date(it)) } ?: ""
    fun weekday(ms: Long): String = SimpleDateFormat("EEEE", TR).format(Date(ms))

    /** "Bugün 14:30", "Yarın 09:00", "Dün", "5 Kas 10:00" */
    fun relative(ms: Long?, withTime: Boolean = true): String {
        if (ms == null) return ""
        val day = Days.startOfDay(ms)
        val today = Days.startOfDay(System.currentTimeMillis())
        val t = if (withTime) " " + time(ms) else ""
        return when ((day - today) / Days.DAY) {
            0L -> "Bugün$t"
            1L -> "Yarın$t"
            -1L -> "Dün$t"
            else -> dateShort(ms) + t
        }
    }
}

object Days {
    const val DAY = 24L * 60 * 60 * 1000

    fun startOfDay(ms: Long): Long = Calendar.getInstance().apply {
        timeInMillis = ms
        set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0)
        set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
    }.timeInMillis

    fun endOfToday(): Long = startOfDay(System.currentTimeMillis()) + DAY

    fun isOverdue(ms: Long?) = ms != null && ms < System.currentTimeMillis()

    /** Tekrarlanan görev için bir sonraki zaman */
    fun next(ms: Long, repeat: String): Long = Calendar.getInstance().apply {
        timeInMillis = ms
        when (repeat) {
            "DAILY" -> add(Calendar.DAY_OF_MONTH, 1)
            "WEEKLY" -> add(Calendar.WEEK_OF_YEAR, 1)
            "MONTHLY" -> add(Calendar.MONTH, 1)
        }
    }.timeInMillis
}

/** Metin aramada Türkçe karakter duyarsız karşılaştırma */
fun String.norm(): String = lowercase(TR)
    .replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u')
    .replace('ş', 's').replace('ö', 'o').replace('ç', 'c').replace("̇", "")

fun String.matchesQuery(q: String): Boolean {
    if (q.isBlank()) return true
    val hay = norm()
    return q.norm().split(' ').filter { it.isNotBlank() }.all { hay.contains(it) }
}

/** Telefon / WhatsApp / harita / link açma */
object Act {
    private fun start(ctx: Context, intent: Intent) {
        try {
            ctx.startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
        } catch (e: ActivityNotFoundException) {
            Toast.makeText(ctx, "Bu işlemi açacak uygulama bulunamadı", Toast.LENGTH_SHORT).show()
        }
    }

    /** 0532 123 45 67 -> 905321234567 */
    fun intlPhone(phone: String): String {
        var d = phone.filter { it.isDigit() }
        if (d.startsWith("00")) d = d.drop(2)
        if (d.startsWith("0")) d = "90" + d.drop(1)
        if (d.length == 10 && d.startsWith("5")) d = "90$d"
        return d
    }

    fun call(ctx: Context, phone: String) = start(ctx, Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + phone.filter { it.isDigit() || it == '+' })))
    fun sms(ctx: Context, phone: String) = start(ctx, Intent(Intent.ACTION_SENDTO, Uri.parse("smsto:" + phone.filter { it.isDigit() || it == '+' })))
    fun whatsapp(ctx: Context, phone: String) = start(ctx, Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/" + intlPhone(phone))))
    fun email(ctx: Context, email: String) = start(ctx, Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:$email")))

    fun openUrl(ctx: Context, url: String) {
        val u = if (url.startsWith("http")) url else "https://$url"
        start(ctx, Intent(Intent.ACTION_VIEW, Uri.parse(u)))
    }

    fun navigate(ctx: Context, lat: Double, lon: Double, label: String) =
        start(ctx, Intent(Intent.ACTION_VIEW, Uri.parse("geo:$lat,$lon?q=$lat,$lon(${Uri.encode(label)})")))

    fun shareText(ctx: Context, text: String) = start(
        ctx,
        Intent.createChooser(Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text), "Paylaş"),
    )

    fun toast(ctx: Context, msg: String) = Toast.makeText(ctx, msg, Toast.LENGTH_SHORT).show()
}
