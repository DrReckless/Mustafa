package com.mustafa.emlaktakip

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.graphics.Bitmap
import android.net.Uri
import androidx.test.core.app.ApplicationProvider
import com.mustafa.emlaktakip.data.AppDatabase
import com.mustafa.emlaktakip.data.Building
import com.mustafa.emlaktakip.data.Contractor
import com.mustafa.emlaktakip.util.Backup
import com.mustafa.emlaktakip.util.Photos
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import java.io.ByteArrayOutputStream
import java.io.File

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class PhotoBackupTest {
    private val ctx: Context = ApplicationProvider.getApplicationContext()
    private fun dao() = AppDatabase.get(ctx).dao()

    @org.junit.Before
    fun resetDb() = AppDatabase.closeAndReset()

    private fun samplePng(): Uri {
        val f = File(ctx.cacheDir, "sample.png")
        val bmp = Bitmap.createBitmap(64, 48, Bitmap.Config.ARGB_8888)
        f.outputStream().use { bmp.compress(Bitmap.CompressFormat.PNG, 100, it) }
        return Uri.fromFile(f)
    }

    @Test
    fun migrationFromV1KeepsData() = runBlocking {
        // Sürüm 2 veritabanı oluştur, bir kayıt ekle, sonra onu sürüm 1'e "geri al"
        dao().insert(Contractor(name = "Eski Kayıt"))
        AppDatabase.closeAndReset()
        val path = ctx.getDatabasePath(AppDatabase.NAME).path
        SQLiteDatabase.openDatabase(path, null, SQLiteDatabase.OPEN_READWRITE).use { db ->
            db.execSQL("DROP TABLE building_photos")
            db.version = 1
        }
        // Yeniden açılınca 1->2 geçişi çalışmalı, eski kayıt kalmalı
        assertEquals("Eski Kayıt", dao().contractors().first().single().name)
        assertEquals(0, dao().allPhotoFileNames().size)
    }

    @Test
    fun importDecodeAndBackupRoundTrip() = runBlocking {
        val bId = dao().insert(Building(name = "Gül Apt.", lat = 41.0, lon = 29.0))
        Photos.importUri(ctx, dao(), samplePng(), bId)
        val photos = dao().photosByBuilding(bId).first()
        assertEquals(1, photos.size)
        val file = Photos.file(ctx, photos[0])
        assertTrue(file.exists())
        val img = Photos.decode(file, 32)
        assertNotNull(img)
        assertTrue(img!!.width <= 64)

        // Yedek al
        val zip = ByteArrayOutputStream().also { Backup.writeZip(ctx, it) }.toByteArray()

        // Verileri boz: binayı ve fotoğrafı sil
        dao().deleteBuildingFull(dao().getBuilding(bId)!!)
        file.delete()
        assertEquals(0, dao().allPhotoFileNames().size)

        // Geri yükle
        Backup.restoreFrom(ctx) { zip.inputStream() }
        assertEquals("Gül Apt.", dao().getBuilding(bId)?.name)
        val restored = dao().photosByBuilding(bId).first()
        assertEquals(1, restored.size)
        assertTrue(Photos.file(ctx, restored[0]).exists())
    }

    @Test
    fun orphanFilesAreCleaned() = runBlocking {
        val bId = dao().insert(Building(name = "Silinecek"))
        Photos.importUri(ctx, dao(), samplePng(), bId)
        val f = Photos.file(ctx, dao().photosByBuilding(bId).first().single())
        dao().deleteBuildingFull(dao().getBuilding(bId)!!)
        f.setLastModified(System.currentTimeMillis() - 60 * 60 * 1000)
        Photos.cleanOrphans(ctx, dao())
        assertTrue(!f.exists())
    }
}
