package com.mustafa.emlaktakip.util

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.mustafa.emlaktakip.data.AppDatabase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

/** Veritabanı dosyasını yedekleme / geri yükleme */
object Backup {
    suspend fun export(ctx: Context, uri: Uri) = withContext(Dispatchers.IO) {
        val db = AppDatabase.get(ctx)
        // WAL günlüğündeki değişiklikleri ana dosyaya yaz
        db.openHelper.writableDatabase.query("PRAGMA wal_checkpoint(FULL)").use { it.moveToFirst() }
        val file = ctx.getDatabasePath(AppDatabase.NAME)
        ctx.contentResolver.openOutputStream(uri, "wt")?.use { out -> file.inputStream().use { it.copyTo(out) } }
            ?: throw IllegalStateException("Dosya açılamadı")
    }

    suspend fun restore(ctx: Context, uri: Uri) {
        withContext(Dispatchers.IO) {
            val tmp = File(ctx.cacheDir, "restore.db")
            ctx.contentResolver.openInputStream(uri)?.use { inp -> tmp.outputStream().use { inp.copyTo(it) } }
                ?: throw IllegalStateException("Dosya okunamadı")
            val header = tmp.inputStream().use { s -> ByteArray(16).also { s.read(it) } }
            if (!String(header, Charsets.US_ASCII).startsWith("SQLite format 3")) {
                tmp.delete()
                throw IllegalArgumentException("Bu dosya bir Emlak Takip yedeği değil")
            }
            AppDatabase.closeAndReset()
            val dbFile = ctx.getDatabasePath(AppDatabase.NAME)
            File(dbFile.path + "-wal").delete()
            File(dbFile.path + "-shm").delete()
            tmp.copyTo(dbFile, overwrite = true)
            tmp.delete()
        }
        // Uygulamayı yeniden başlat
        val intent = ctx.packageManager.getLaunchIntentForPackage(ctx.packageName) ?: return
        ctx.startActivity(Intent.makeRestartActivityTask(intent.component))
        Runtime.getRuntime().exit(0)
    }
}
