package com.mustafa.emlaktakip.util

import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.LruCache
import android.webkit.MimeTypeMap
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.core.content.FileProvider
import androidx.exifinterface.media.ExifInterface
import com.mustafa.emlaktakip.data.AppDao
import com.mustafa.emlaktakip.data.BuildingPhoto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.util.UUID

/** Bina fotoğraflarının dosya işlemleri */
object Photos {
    const val DIR = "photos"
    private const val GALLERY_FOLDER = "EmlakTakip"

    fun dir(ctx: Context): File = File(ctx.filesDir, DIR).apply { mkdirs() }
    fun file(ctx: Context, p: BuildingPhoto): File = File(dir(ctx), p.fileName)
    private fun authority(ctx: Context) = ctx.packageName + ".files"

    private fun newName(buildingId: Long, ext: String) =
        "b${buildingId}_${System.currentTimeMillis()}_${UUID.randomUUID().toString().take(6)}.$ext"

    fun mimeOf(name: String): String =
        MimeTypeMap.getSingleton().getMimeTypeFromExtension(name.substringAfterLast('.').lowercase()) ?: "image/jpeg"

    /** Galeriden seçilen görseli uygulama klasörüne kopyalar ve kaydeder. */
    suspend fun importUri(ctx: Context, dao: AppDao, uri: Uri, buildingId: Long): Long = withContext(Dispatchers.IO) {
        val mime = ctx.contentResolver.getType(uri) ?: "image/jpeg"
        val ext = MimeTypeMap.getSingleton().getExtensionFromMimeType(mime) ?: "jpg"
        val name = newName(buildingId, ext)
        val target = File(dir(ctx), name)
        ctx.contentResolver.openInputStream(uri)?.use { inp -> target.outputStream().use { inp.copyTo(it) } }
            ?: throw IllegalStateException("Görsel okunamadı")
        dao.insert(BuildingPhoto(buildingId = buildingId, fileName = name))
    }

    /** Kamera için geçici dosya ve ona yazma izni verilen adres */
    fun newCameraTarget(ctx: Context): Pair<File, Uri> {
        val d = File(ctx.cacheDir, "camera").apply { mkdirs() }
        val f = File(d, "cam_${System.currentTimeMillis()}.jpg")
        return f to FileProvider.getUriForFile(ctx, authority(ctx), f)
    }

    fun uriForCamera(ctx: Context, f: File): Uri = FileProvider.getUriForFile(ctx, authority(ctx), f)

    /** Kameranın çektiği geçici dosyayı kalıcı klasöre taşır. */
    suspend fun importCameraFile(ctx: Context, dao: AppDao, src: File, buildingId: Long): Long = withContext(Dispatchers.IO) {
        val name = newName(buildingId, "jpg")
        val target = File(dir(ctx), name)
        if (!src.renameTo(target)) { src.copyTo(target, overwrite = true); src.delete() }
        dao.insert(BuildingPhoto(buildingId = buildingId, fileName = name))
    }

    suspend fun delete(ctx: Context, dao: AppDao, p: BuildingPhoto) = withContext(Dispatchers.IO) {
        dao.delete(p)
        file(ctx, p).delete()
        val path = file(ctx, p).path
        cache.snapshot().keys.filter { it.startsWith("$path@") }.forEach { cache.remove(it) }
    }

    /** Hiçbir kayda bağlı olmayan dosyaları siler (ör. bina silindiyse). */
    suspend fun cleanOrphans(ctx: Context, dao: AppDao) = withContext(Dispatchers.IO) {
        val used = dao.allPhotoFileNames().toSet()
        val cutoff = System.currentTimeMillis() - 10 * 60 * 1000
        dir(ctx).listFiles()?.forEach { f ->
            if (f.name !in used && f.lastModified() < cutoff) f.delete()
        }
        File(ctx.cacheDir, "camera").listFiles()?.forEach { if (it.lastModified() < cutoff) it.delete() }
    }

    /** Telefonun galerisine (Resimler/EmlakTakip) kaydeder. */
    suspend fun saveToGallery(ctx: Context, p: BuildingPhoto, displayName: String) = withContext(Dispatchers.IO) {
        val src = file(ctx, p)
        val ext = p.fileName.substringAfterLast('.', "jpg")
        val name = displayName.replace(Regex("[^\\p{L}\\p{N}_ -]"), "_").take(60) + "." + ext
        val resolver = ctx.contentResolver
        val values = ContentValues().apply {
            put(MediaStore.Images.Media.DISPLAY_NAME, name)
            put(MediaStore.Images.Media.MIME_TYPE, mimeOf(p.fileName))
            if (Build.VERSION.SDK_INT >= 29) {
                put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/" + GALLERY_FOLDER)
                put(MediaStore.Images.Media.IS_PENDING, 1)
            } else {
                @Suppress("DEPRECATION")
                val d = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), GALLERY_FOLDER)
                d.mkdirs()
                @Suppress("DEPRECATION")
                put(MediaStore.Images.Media.DATA, File(d, "${System.currentTimeMillis()}_$name").absolutePath)
            }
        }
        val uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
            ?: throw IllegalStateException("Galeriye kaydedilemedi")
        resolver.openOutputStream(uri)?.use { out -> src.inputStream().use { it.copyTo(out) } }
        if (Build.VERSION.SDK_INT >= 29) {
            values.clear()
            values.put(MediaStore.Images.Media.IS_PENDING, 0)
            resolver.update(uri, values, null, null)
        }
    }

    fun share(ctx: Context, photos: List<BuildingPhoto>, text: String) {
        val uris = ArrayList(photos.map { FileProvider.getUriForFile(ctx, authority(ctx), file(ctx, it)) })
        val intent = if (uris.size == 1) {
            Intent(Intent.ACTION_SEND).putExtra(Intent.EXTRA_STREAM, uris[0]).setType(mimeOf(photos[0].fileName))
        } else {
            Intent(Intent.ACTION_SEND_MULTIPLE).putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris).setType("image/*")
        }
        intent.putExtra(Intent.EXTRA_TEXT, text).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        ctx.startActivity(Intent.createChooser(intent, "Paylaş").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
    }

    // Küçük resimler tekrar tekrar çözülmesin
    private val cache = object : LruCache<String, ImageBitmap>(24 * 1024 * 1024) {
        override fun sizeOf(key: String, value: ImageBitmap) = value.width * value.height * 4
    }

    /** Görseli en fazla maxPx boyutunda, EXIF yönüne göre döndürülmüş olarak okur. */
    fun decode(file: File, maxPx: Int): ImageBitmap? {
        val key = "${file.path}@$maxPx"
        cache.get(key)?.let { return it }
        if (!file.exists()) return null
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        BitmapFactory.decodeFile(file.path, bounds)
        if (bounds.outWidth <= 0) return null
        var sample = 1
        while (bounds.outWidth / (sample * 2) >= maxPx || bounds.outHeight / (sample * 2) >= maxPx) sample *= 2
        var bmp: Bitmap = BitmapFactory.decodeFile(file.path, BitmapFactory.Options().apply { inSampleSize = sample }) ?: return null
        val rotation = runCatching { ExifInterface(file).rotationDegrees }.getOrDefault(0)
        if (rotation != 0) {
            bmp = Bitmap.createBitmap(bmp, 0, 0, bmp.width, bmp.height, Matrix().apply { postRotate(rotation.toFloat()) }, true)
        }
        return bmp.asImageBitmap().also { cache.put(key, it) }
    }
}
