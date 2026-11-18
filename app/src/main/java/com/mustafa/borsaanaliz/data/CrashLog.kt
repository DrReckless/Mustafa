package com.mustafa.borsaanaliz.data

import android.content.Context
import android.os.Build
import java.io.File
import java.io.PrintWriter
import java.io.StringWriter
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Çökme kaydı: uygulama beklenmedik bir hatayla kapanırsa hatanın ayrıntısı dosyaya yazılır ve
 * bir sonraki açılışta kullanıcıya gösterilir (kopyalanıp geliştiriciye iletilebilsin diye).
 * Ayrıca atlanan analizler gibi kapanmaya yol açmayan hatalardan son birkaçı da tutulur.
 */
object CrashLog {
    private var dir: File? = null
    private val notes = ArrayDeque<String>()

    fun install(ctx: Context, versionName: String) {
        dir = ctx.filesDir
        val previous = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, e ->
            runCatching {
                val sw = StringWriter()
                e.printStackTrace(PrintWriter(sw))
                val text = buildString {
                    appendLine("Borsa Analiz $versionName · Android ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT}) · ${Build.MANUFACTURER} ${Build.MODEL}")
                    appendLine(SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date()) + " · iş parçacığı: ${thread.name}")
                    synchronized(notes) { if (notes.isNotEmpty()) appendLine("Son notlar:\n" + notes.joinToString("\n")) }
                    appendLine()
                    append(sw.toString().take(12_000))
                }
                File(ctx.filesDir, FILE).writeText(text)
            }
            previous?.uncaughtException(thread, e)
        }
    }

    /** Kapanmaya yol açmayan ama kayda değer bir hata (son 10 tanesi saklanır). */
    fun note(text: String) {
        synchronized(notes) {
            notes.addLast(text.take(300))
            while (notes.size > 10) notes.removeFirst()
        }
    }

    fun lastCrash(): String? = dir?.let { File(it, FILE) }?.takeIf { it.exists() }?.readText()

    fun clear() {
        dir?.let { File(it, FILE).delete() }
    }

    private const val FILE = "last_crash.txt"
}
