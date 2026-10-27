package com.mustafa.emlaktakip.ui.screens

import android.Manifest
import android.content.ActivityNotFoundException
import android.content.pm.PackageManager
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.core.content.ContextCompat
import com.mustafa.emlaktakip.data.Building
import com.mustafa.emlaktakip.data.BuildingPhoto
import com.mustafa.emlaktakip.data.Titles
import com.mustafa.emlaktakip.ui.components.EmptyHint
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.components.Section
import com.mustafa.emlaktakip.ui.components.rememberFlow
import com.mustafa.emlaktakip.util.Act
import com.mustafa.emlaktakip.util.Fmt
import com.mustafa.emlaktakip.util.Photos
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

/** Dosyadan görseli arka planda yükleyip gösterir. */
@Composable
fun PhotoImage(file: File, maxPx: Int, modifier: Modifier, contentScale: ContentScale = ContentScale.Crop) {
    val bmp by produceState<ImageBitmap?>(null, file.path, maxPx) {
        value = withContext(Dispatchers.IO) { runCatching { Photos.decode(file, maxPx) }.getOrNull() }
    }
    val b = bmp
    if (b != null) Image(b, null, modifier, contentScale = contentScale)
    else Box(modifier.background(MaterialTheme.colorScheme.surfaceVariant))
}

/** Bina detayındaki fotoğraf bölümü */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun BuildingPhotos(building: Building) {
    val ctx = LocalContext.current
    val dao = LocalDao.current
    val scope = rememberCoroutineScope()
    val photos by rememberFlow(building.id, emptyList()) { dao.photosByBuilding(building.id) }
    var viewer by rememberSaveable { mutableStateOf<Int?>(null) }
    var busy by remember { mutableStateOf(false) }
    // Kamera geçici dosya yolu (uygulama arka plana atılsa da kaybolmasın)
    var cameraPath by rememberSaveable { mutableStateOf<String?>(null) }
    // Android 9 ve altında galeriye kaydetmek için izin gerekir; izin sonrası yapılacak iş
    var pendingSave by remember { mutableStateOf<List<BuildingPhoto>?>(null) }

    val name = Titles.building(building)

    fun saveAll(list: List<BuildingPhoto>) {
        scope.launch(Dispatchers.Main.immediate) {
            busy = true
            try {
                list.forEach { p ->
                    Photos.saveToGallery(ctx, p, if (list.size == 1 && p.caption.isNotBlank()) "${name}_${p.caption}" else "${name}_${photos.indexOf(p) + 1}")
                }
                Act.toast(ctx, if (list.size == 1) "Fotoğraf galeriye indirildi (Resimler/EmlakTakip)" else "${list.size} fotoğraf galeriye indirildi (Resimler/EmlakTakip)")
            } catch (e: Exception) {
                Act.toast(ctx, "İndirilemedi: ${e.message}")
            } finally {
                busy = false
            }
        }
    }

    val storagePermission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        val list = pendingSave
        pendingSave = null
        if (granted && list != null) saveAll(list) else if (!granted) Act.toast(ctx, "Depolama izni verilmedi")
    }

    fun download(list: List<BuildingPhoto>) {
        if (list.isEmpty()) return
        val needsPermission = Build.VERSION.SDK_INT < 29 &&
            ContextCompat.checkSelfPermission(ctx, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED
        if (needsPermission) {
            pendingSave = list
            storagePermission.launch(Manifest.permission.WRITE_EXTERNAL_STORAGE)
        } else saveAll(list)
    }

    val pickLauncher = rememberLauncherForActivityResult(ActivityResultContracts.PickMultipleVisualMedia(30)) { uris ->
        if (uris.isNotEmpty()) scope.launch(Dispatchers.Main.immediate) {
            busy = true
            var ok = 0
            uris.forEach { uri -> runCatching { Photos.importUri(ctx, dao, uri, building.id) }.onSuccess { ok++ } }
            busy = false
            Act.toast(ctx, "$ok fotoğraf eklendi")
        }
    }

    val cameraLauncher = rememberLauncherForActivityResult(ActivityResultContracts.TakePicture()) { success ->
        val path = cameraPath
        cameraPath = null
        if (path != null) scope.launch(Dispatchers.Main.immediate) {
            val f = File(path)
            if (success && f.exists() && f.length() > 0) {
                runCatching { Photos.importCameraFile(ctx, dao, f, building.id) }
                    .onSuccess { Act.toast(ctx, "Fotoğraf eklendi") }
                    .onFailure { Act.toast(ctx, "Fotoğraf kaydedilemedi") }
            } else f.delete()
        }
    }

    Section("Fotoğraflar", photos.size) {
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilledTonalButton(onClick = {
                pickLauncher.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
            }) { Icon(Icons.Filled.PhotoLibrary, null, Modifier.size(18.dp)); Text("  Galeriden") }
            FilledTonalButton(onClick = {
                val (file, uri) = Photos.newCameraTarget(ctx)
                cameraPath = file.path
                try {
                    cameraLauncher.launch(uri)
                } catch (e: ActivityNotFoundException) {
                    cameraPath = null
                    Act.toast(ctx, "Kamera uygulaması bulunamadı")
                }
            }) { Icon(Icons.Filled.PhotoCamera, null, Modifier.size(18.dp)); Text("  Çek") }
            if (photos.isNotEmpty()) FilledTonalButton(onClick = { download(photos) }) {
                Icon(Icons.Filled.Download, null, Modifier.size(18.dp)); Text("  Tümünü indir")
            }
        }
        if (busy) LinearProgressIndicator(Modifier.fillMaxWidth())
        if (photos.isEmpty()) EmptyHint("Henüz fotoğraf yok. Bina dışı, giriş, daireler, ilan panosu gibi görselleri ekleyin.")
        else LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            itemsIndexed(photos, key = { _, p -> p.id }) { i, p ->
                Column(Modifier.size(width = 120.dp, height = 140.dp).clickable { viewer = i }) {
                    PhotoImage(
                        Photos.file(ctx, p), 360,
                        Modifier.size(120.dp).clip(RoundedCornerShape(10.dp)),
                    )
                    Text(
                        p.caption.ifBlank { Fmt.dateShort(p.createdAt) },
                        style = MaterialTheme.typography.labelSmall, maxLines = 1,
                    )
                }
            }
        }
    }

    viewer?.let { start ->
        if (photos.isEmpty()) { viewer = null; return@let }
        PhotoViewer(
            photos = photos,
            start = start.coerceIn(0, photos.size - 1),
            title = name,
            onClose = { viewer = null },
            onDownload = { download(listOf(it)) },
        )
    }
}

@Composable
private fun PhotoViewer(
    photos: List<BuildingPhoto>,
    start: Int,
    title: String,
    onClose: () -> Unit,
    onDownload: (BuildingPhoto) -> Unit,
) {
    val ctx = LocalContext.current
    val dao = LocalDao.current
    val scope = rememberCoroutineScope()
    val pager = rememberPagerState(initialPage = start) { photos.size }
    var editCaption by remember { mutableStateOf<BuildingPhoto?>(null) }
    var confirmDelete by remember { mutableStateOf<BuildingPhoto?>(null) }

    Dialog(onDismissRequest = onClose, properties = DialogProperties(usePlatformDefaultWidth = false)) {
        Box(Modifier.fillMaxSize().background(Color.Black)) {
            HorizontalPager(state = pager, modifier = Modifier.fillMaxSize()) { page ->
                PhotoImage(Photos.file(ctx, photos[page]), 2048, Modifier.fillMaxSize(), ContentScale.Fit)
            }
            Row(
                Modifier.fillMaxWidth().background(Color(0x99000000)).padding(4.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = onClose) { Icon(Icons.Filled.Close, "Kapat", tint = Color.White) }
                Text("${pager.currentPage + 1} / ${photos.size}", color = Color.White, modifier = Modifier.weight(1f))
            }
            val current = photos.getOrNull(pager.currentPage)
            if (current != null) Column(
                Modifier.align(Alignment.BottomCenter).fillMaxWidth().background(Color(0x99000000)).padding(8.dp),
            ) {
                Text(
                    current.caption.ifBlank { "Açıklama yok" } + " · " + Fmt.dateTime(current.createdAt),
                    color = Color.White, style = MaterialTheme.typography.bodySmall,
                )
                Row(horizontalArrangement = Arrangement.SpaceEvenly, modifier = Modifier.fillMaxWidth()) {
                    TextButton(onClick = { onDownload(current) }) {
                        Icon(Icons.Filled.Download, null, tint = Color.White); Text(" İndir", color = Color.White)
                    }
                    TextButton(onClick = {
                        runCatching { Photos.share(ctx, listOf(current), title) }
                    }) { Icon(Icons.Filled.Share, null, tint = Color.White); Text(" Paylaş", color = Color.White) }
                    TextButton(onClick = { editCaption = current }) {
                        Icon(Icons.Filled.Edit, null, tint = Color.White); Text(" Not", color = Color.White)
                    }
                    TextButton(onClick = { confirmDelete = current }) {
                        Icon(Icons.Filled.Delete, null, tint = Color(0xFFFF8A80)); Text(" Sil", color = Color(0xFFFF8A80))
                    }
                }
            }
        }

        editCaption?.let { p ->
            var text by remember(p.id) { mutableStateOf(p.caption) }
            AlertDialog(
                onDismissRequest = { editCaption = null },
                title = { Text("Fotoğraf notu") },
                text = { OutlinedTextField(text, { text = it }, placeholder = { Text("ör. Giriş kapısı, 3. kat daire") }) },
                confirmButton = {
                    TextButton(onClick = {
                        editCaption = null
                        scope.launch(Dispatchers.Main.immediate) { dao.update(p.copy(caption = text.trim())) }
                    }) { Text("Kaydet") }
                },
                dismissButton = { TextButton(onClick = { editCaption = null }) { Text("Vazgeç") } },
            )
        }
        confirmDelete?.let { p ->
            AlertDialog(
                onDismissRequest = { confirmDelete = null },
                text = { Text("Bu fotoğraf silinsin mi? (İndirdiğiniz kopyalar galeride kalır.)") },
                confirmButton = {
                    TextButton(onClick = {
                        confirmDelete = null
                        if (photos.size == 1) onClose()
                        scope.launch(Dispatchers.Main.immediate) { Photos.delete(ctx, dao, p) }
                    }) { Text("Sil", color = MaterialTheme.colorScheme.error) }
                },
                dismissButton = { TextButton(onClick = { confirmDelete = null }) { Text("Vazgeç") } },
            )
        }
    }
}
