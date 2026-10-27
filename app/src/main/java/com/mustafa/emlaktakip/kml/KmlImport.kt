package com.mustafa.emlaktakip.kml

import android.content.Context
import android.net.Uri
import android.provider.OpenableColumns
import com.mustafa.emlaktakip.data.AppDao
import com.mustafa.emlaktakip.data.Building
import com.mustafa.emlaktakip.data.KmlLayer
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object KmlImport {
    fun displayName(ctx: Context, uri: Uri): String {
        runCatching {
            ctx.contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)?.use { c ->
                if (c.moveToFirst()) return c.getString(0) ?: ""
            }
        }
        return uri.lastPathSegment?.substringAfterLast('/') ?: "harita.kml"
    }

    /** Dosyayı okur, yeni katman olarak kaydeder. Dönen: (katmanId, yapı sayısı) */
    suspend fun import(ctx: Context, dao: AppDao, uri: Uri): Pair<Long, Int> = withContext(Dispatchers.IO) {
        val fileName = displayName(ctx, uri)
        val result = ctx.contentResolver.openInputStream(uri)?.use { KmlParser.parse(it) }
            ?: throw IllegalArgumentException("Dosya okunamadı")
        if (result.placemarks.isEmpty()) throw IllegalArgumentException("Dosyada konum bulunamadı")
        val layer = KmlLayer(
            name = result.documentName.ifBlank { fileName.substringBeforeLast('.') },
            fileName = fileName,
        )
        val buildings = result.placemarks.mapIndexed { i, pm -> KmlParser.toBuilding(pm, i) }
        dao.importLayer(layer, buildings) to buildings.size
    }

    /** Binaları (ve görevlileri) KML olarak dosyaya yazar. */
    suspend fun export(ctx: Context, dao: AppDao, uri: Uri, name: String, buildings: List<Building>) = withContext(Dispatchers.IO) {
        val contacts = buildings.associate { it.id to dao.getContactsByBuilding(it.id) }
        val xml = KmlWriter.write(name, buildings, contacts)
        ctx.contentResolver.openOutputStream(uri, "wt")?.use { it.write(xml.toByteArray(Charsets.UTF_8)) }
            ?: throw IllegalArgumentException("Dosyaya yazılamadı")
    }
}
