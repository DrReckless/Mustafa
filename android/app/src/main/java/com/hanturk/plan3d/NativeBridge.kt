package com.hanturk.plan3d

import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Base64
import android.webkit.JavascriptInterface
import android.widget.Toast
import androidx.core.content.FileProvider
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

/** Web arayüzünün çağırdığı yerel işlevler (window.HanturkNative). */
class NativeBridge(private val activity: Activity) {

    private val dir: File by lazy { File(activity.filesDir, "projects").apply { mkdirs() } }

    private fun safeId(id: String): String = id.replace(Regex("[^A-Za-z0-9_]"), "_").take(80)

    @JavascriptInterface
    fun listProjects(): String {
        val arr = JSONArray()
        dir.listFiles { f -> f.name.endsWith(".meta.json") }?.forEach { f ->
            try { arr.put(JSONObject(f.readText())) } catch (_: Exception) { }
        }
        return arr.toString()
    }

    @JavascriptInterface
    fun loadProject(id: String): String? {
        val f = File(dir, safeId(id) + ".json")
        return if (f.exists()) f.readText() else null
    }

    @JavascriptInterface
    fun saveProject(id: String, json: String, meta: String) {
        val sid = safeId(id)
        // önce geçici dosyaya yaz, sonra yer değiştir (yarım kayıt olmasın)
        val tmp = File(dir, "$sid.json.tmp")
        tmp.writeText(json)
        tmp.renameTo(File(dir, "$sid.json"))
        File(dir, "$sid.meta.json").writeText(meta)
    }

    @JavascriptInterface
    fun deleteProject(id: String) {
        val sid = safeId(id)
        File(dir, "$sid.json").delete()
        File(dir, "$sid.meta.json").delete()
    }

    private fun safeName(name: String): String =
        name.replace(Regex("[\\\\/:*?\"<>|]"), "_").ifBlank { "dosya" }.take(120)

    @JavascriptInterface
    fun shareFile(base64: String, filename: String, mime: String, title: String) {
        try {
            val shared = File(activity.cacheDir, "shared").apply { mkdirs() }
            shared.listFiles()?.forEach { if (System.currentTimeMillis() - it.lastModified() > 86_400_000) it.delete() }
            val f = File(shared, safeName(filename))
            f.writeBytes(Base64.decode(base64, Base64.DEFAULT))
            val uri = FileProvider.getUriForFile(activity, activity.packageName + ".files", f)
            val intent = Intent(Intent.ACTION_SEND).apply {
                type = mime
                putExtra(Intent.EXTRA_STREAM, uri)
                putExtra(Intent.EXTRA_SUBJECT, filename)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            activity.runOnUiThread {
                activity.startActivity(Intent.createChooser(intent, title))
            }
        } catch (e: Exception) {
            toast("Paylaşılamadı: ${e.message}")
        }
    }

    @JavascriptInterface
    fun saveToDownloads(base64: String, filename: String, mime: String): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            // Eski sürümlerde izin gerektirmemek için paylaşım menüsünü aç
            shareFile(base64, filename, mime, "Kaydet")
            return false
        }
        return try {
            val values = ContentValues().apply {
                put(MediaStore.Downloads.DISPLAY_NAME, safeName(filename))
                put(MediaStore.Downloads.MIME_TYPE, mime)
                put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Hanturk")
            }
            val resolver = activity.contentResolver
            val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values) ?: return false
            resolver.openOutputStream(uri)?.use { it.write(Base64.decode(base64, Base64.DEFAULT)) }
            true
        } catch (e: Exception) {
            toast("Kaydedilemedi: ${e.message}")
            false
        }
    }

    @JavascriptInterface
    fun toast(msg: String) {
        activity.runOnUiThread { Toast.makeText(activity, msg, Toast.LENGTH_SHORT).show() }
    }
}
