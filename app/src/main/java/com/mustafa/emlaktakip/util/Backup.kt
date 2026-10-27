package com.mustafa.emlaktakip.util

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.mustafa.emlaktakip.data.AppDatabase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.OutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream

/**
 * Yedekleme: veritabanı + bina fotoğrafları tek bir ZIP dosyasında.
 * Geri yükleme hem ZIP yedeği hem de eski sürümün .db yedeğini kabul eder.
 */
object Backup {
    private const val DB_ENTRY = "emlak_takip.db"
    private const val PHOTO_PREFIX = "photos/"

    suspend fun export(ctx: Context, uri: Uri) = withContext(Dispatchers.IO) {
        ctx.contentResolver.openOutputStream(uri, "wt")?.use { writeZip(ctx, it) }
            ?: throw IllegalStateException("Dosya açılamadı")
    }

    fun writeZip(ctx: Context, out: OutputStream) {
        val db = AppDatabase.get(ctx)
        // WAL günlüğündeki değişiklikleri ana dosyaya yaz
        db.openHelper.writableDatabase.query("PRAGMA wal_checkpoint(FULL)").use { it.moveToFirst() }
        ZipOutputStream(out).use { zip ->
            zip.putNextEntry(ZipEntry(DB_ENTRY))
            ctx.getDatabasePath(AppDatabase.NAME).inputStream().use { it.copyTo(zip) }
            zip.closeEntry()
            Photos.dir(ctx).listFiles()?.filter { it.isFile }?.forEach { f ->
                zip.putNextEntry(ZipEntry(PHOTO_PREFIX + f.name))
                f.inputStream().use { it.copyTo(zip) }
                zip.closeEntry()
            }
        }
    }

    private fun isSqlite(f: File) = f.inputStream().use { s ->
        val h = ByteArray(16); s.read(h) == 16 && String(h, Charsets.US_ASCII).startsWith("SQLite format 3")
    }

    /** Yedeği geçici klasöre açar ve doğrular; sonra mevcut verilerin yerine koyar. */
    fun restoreFrom(ctx: Context, input: () -> java.io.InputStream) {
        val work = File(ctx.cacheDir, "restore").apply { deleteRecursively(); mkdirs() }
        val raw = File(work, "upload")
        input().use { inp -> raw.outputStream().use { inp.copyTo(it) } }

        val dbTmp = File(work, DB_ENTRY)
        val photoTmp = File(work, "photos").apply { mkdirs() }
        val isZip = raw.inputStream().use { s -> s.read() == 'P'.code && s.read() == 'K'.code }
        if (isZip) {
            ZipInputStream(raw.inputStream()).use { zip ->
                var e = zip.nextEntry
                while (e != null) {
                    val n = e.name
                    when {
                        e.isDirectory -> {}
                        n == DB_ENTRY -> dbTmp.outputStream().use { zip.copyTo(it) }
                        // Yalnızca düz dosya adlarını kabul et (klasör dışına yazmayı engeller)
                        n.startsWith(PHOTO_PREFIX) && n.removePrefix(PHOTO_PREFIX).let { it.isNotBlank() && !it.contains('/') && !it.contains('\\') && it != ".." } ->
                            File(photoTmp, n.removePrefix(PHOTO_PREFIX)).outputStream().use { zip.copyTo(it) }
                    }
                    e = zip.nextEntry
                }
            }
        } else {
            raw.renameTo(dbTmp)
        }
        if (!dbTmp.exists() || !isSqlite(dbTmp)) {
            work.deleteRecursively()
            throw IllegalArgumentException("Bu dosya bir Emlak Takip yedeği değil")
        }

        AppDatabase.closeAndReset()
        val dbFile = ctx.getDatabasePath(AppDatabase.NAME)
        File(dbFile.path + "-wal").delete()
        File(dbFile.path + "-shm").delete()
        dbTmp.copyTo(dbFile, overwrite = true)
        if (isZip) {
            // ZIP yedeği fotoğrafları da içerir: mevcut fotoğrafların yerine geçer
            val dir = Photos.dir(ctx)
            dir.listFiles()?.forEach { it.delete() }
            photoTmp.listFiles()?.forEach { it.copyTo(File(dir, it.name), overwrite = true) }
        }
        work.deleteRecursively()
    }

    suspend fun restore(ctx: Context, uri: Uri) {
        withContext(Dispatchers.IO) {
            restoreFrom(ctx) { ctx.contentResolver.openInputStream(uri) ?: throw IllegalStateException("Dosya okunamadı") }
        }
        // Uygulamayı yeniden başlat
        val intent = ctx.packageManager.getLaunchIntentForPackage(ctx.packageName) ?: return
        ctx.startActivity(Intent.makeRestartActivityTask(intent.component))
        Runtime.getRuntime().exit(0)
    }
}
