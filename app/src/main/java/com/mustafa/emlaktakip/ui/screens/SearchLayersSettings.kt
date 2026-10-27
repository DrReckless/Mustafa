package com.mustafa.emlaktakip.ui.screens

import android.content.Intent
import android.os.Build
import android.provider.Settings
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.FileDownload
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.ZoomIn
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TimePicker
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.rememberTimePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.mustafa.emlaktakip.data.KmlLayer
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.searchIndex
import com.mustafa.emlaktakip.kml.KmlImport
import com.mustafa.emlaktakip.notify.Alarms
import com.mustafa.emlaktakip.notify.Notifier
import com.mustafa.emlaktakip.notify.Prefs
import com.mustafa.emlaktakip.ui.components.AddFab
import com.mustafa.emlaktakip.ui.components.DetailColumn
import com.mustafa.emlaktakip.ui.components.EmptyHint
import com.mustafa.emlaktakip.ui.components.IconAvatar
import com.mustafa.emlaktakip.ui.components.InfoCard
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.components.LocalNav
import com.mustafa.emlaktakip.ui.components.RowCard
import com.mustafa.emlaktakip.ui.components.Routes
import com.mustafa.emlaktakip.ui.components.Screen
import com.mustafa.emlaktakip.ui.components.SearchField
import com.mustafa.emlaktakip.ui.components.rememberFlow
import com.mustafa.emlaktakip.util.Act
import com.mustafa.emlaktakip.util.Backup
import com.mustafa.emlaktakip.util.Fmt
import com.mustafa.emlaktakip.util.matchesQuery
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

// =============================================================== Genel arama

@Composable
fun SearchScreen() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val index by rememberFlow("idx", emptyList()) { dao.searchIndex() }
    var q by rememberSaveable { mutableStateOf("") }
    val results = if (q.isBlank()) emptyList() else index.filter { it.second.matchesQuery(q) }.map { it.first }

    Screen("Ara", back = false) { padding ->
        Column(Modifier.padding(padding).fillMaxSize()) {
            SearchField(q, { q = it }, "İsim, telefon, adres, not…", Modifier.fillMaxWidth().padding(12.dp))
            if (q.isBlank()) EmptyHint("Müteahhit, ilan, daire, arsa, yatırımcı, bina ve bina görevlileri arasında arayın.")
            else if (results.isEmpty()) EmptyHint("Sonuç bulunamadı.")
            LazyColumn(
                contentPadding = PaddingValues(start = 12.dp, end = 12.dp, bottom = 24.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                results.groupBy { it.type }.forEach { (type, list) ->
                    item(key = "h-$type") {
                        Text(
                            "${type.label} (${list.size})", style = MaterialTheme.typography.titleSmall,
                            color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(top = 8.dp),
                        )
                    }
                    items(list, key = { "${it.type}-${it.id}" }) { p ->
                        RowCard(p.title, p.subtitle, onClick = { nav.navigate(Routes.detail(p.type, p.id)) })
                    }
                }
            }
        }
    }
}

// =============================================================== KML katmanları

@Composable
fun LayersScreen() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    val layers by rememberFlow("l", emptyList()) { dao.layers() }
    var exportLayer by remember { mutableStateOf<KmlLayer?>(null) }
    var exportAll by remember { mutableStateOf(false) }
    var deleteLayer by remember { mutableStateOf<KmlLayer?>(null) }

    val importLauncher = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) scope.launch(Dispatchers.Main.immediate) {
            try {
                val (id, n) = KmlImport.import(ctx, dao, uri)
                Act.toast(ctx, "$n yapı içe aktarıldı")
                nav.navigate("map?focus=0&layer=$id")
            } catch (e: Exception) {
                Act.toast(ctx, "KML açılamadı: ${e.message}")
            }
        }
    }
    val exportLauncher = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("application/vnd.google-earth.kml+xml")) { uri ->
        val layer = exportLayer
        val all = exportAll
        exportLayer = null; exportAll = false
        if (uri != null) scope.launch(Dispatchers.Main.immediate) {
            try {
                val list = if (all) dao.allBuildings() else dao.buildingsInLayer(layer!!.id)
                KmlImport.export(ctx, dao, uri, if (all) "Emlak Takip - Tüm Binalar" else layer!!.name, list)
                Act.toast(ctx, "${list.size} yapı KML olarak kaydedildi")
            } catch (e: Exception) {
                Act.toast(ctx, "Kaydedilemedi: ${e.message}")
            }
        }
    }

    Screen(
        "KML Katmanları",
        actions = {
            IconButton(onClick = { exportAll = true; exportLauncher.launch("emlak_takip_binalar.kml") }) {
                Icon(Icons.Filled.FileDownload, "Tümünü KML olarak kaydet")
            }
        },
        fab = { AddFab("KML / KMZ aç") { importLauncher.launch(arrayOf("*/*")) } },
    ) { padding ->
        LazyColumn(
            Modifier.padding(padding).fillMaxSize(),
            contentPadding = PaddingValues(start = 12.dp, end = 12.dp, top = 12.dp, bottom = 96.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item {
                Text(
                    "KML dosyalarındaki binalar haritada gösterilir. Binaya dokunup bilgilerini girdikten sonra " +
                        "katmanı, girdiğiniz bilgilerle birlikte yeniden KML olarak kaydedebilirsiniz (Google Earth ile açılabilir).",
                    style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            if (layers.isEmpty()) item { EmptyHint("Henüz KML dosyası açılmadı.") }
            items(layers, key = { it.id }) { layer ->
                val count by rememberFlow(layer.id, 0) { dao.buildingCountInLayer(layer.id) }
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLow),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                ) {
                    Column(Modifier.padding(12.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconAvatar(Icons.Filled.Layers, if (layer.visible) 0xFF0E4D64 else 0xFF9E9E9E)
                            Column(Modifier.weight(1f).padding(start = 12.dp)) {
                                Text(layer.name, style = MaterialTheme.typography.titleMedium)
                                Text(
                                    "$count yapı · ${layer.fileName} · ${Fmt.dateShort(layer.importedAt)}",
                                    style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                            Switch(checked = layer.visible, onCheckedChange = { v -> scope.launch(Dispatchers.Main.immediate) { dao.update(layer.copy(visible = v)) } })
                        }
                        Row {
                            TextButton(onClick = { nav.navigate("map?focus=0&layer=${layer.id}") }) {
                                Icon(Icons.Filled.ZoomIn, null); Text(" Göster")
                            }
                            TextButton(onClick = {
                                exportLayer = layer
                                exportLauncher.launch(layer.name.replace(Regex("[^\\p{L}\\p{N}_ -]"), "_") + "_guncel.kml")
                            }) { Icon(Icons.Filled.FileDownload, null); Text(" KML kaydet") }
                            TextButton(onClick = { deleteLayer = layer }) {
                                Icon(Icons.Filled.Delete, null, tint = MaterialTheme.colorScheme.error)
                                Text(" Sil", color = MaterialTheme.colorScheme.error)
                            }
                        }
                    }
                }
            }
        }
    }

    deleteLayer?.let { layer ->
        AlertDialog(
            onDismissRequest = { deleteLayer = null },
            title = { Text("Katmanı sil") },
            text = { Text("\"${layer.name}\" katmanı silinecek. İçindeki binalara girdiğiniz bilgiler de silinsin mi?") },
            confirmButton = {
                TextButton(onClick = {
                    deleteLayer = null
                    scope.launch(Dispatchers.Main.immediate) { dao.deleteLayerFull(layer, withBuildings = true) }
                }) { Text("Binalarla sil", color = MaterialTheme.colorScheme.error) }
            },
            dismissButton = {
                Row {
                    TextButton(onClick = { deleteLayer = null }) { Text("Vazgeç") }
                    TextButton(onClick = {
                        deleteLayer = null
                        scope.launch(Dispatchers.Main.immediate) { dao.deleteLayerFull(layer, withBuildings = false) }
                    }) { Text("Binaları koru") }
                }
            },
        )
    }
}

// =============================================================== Ayarlar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen() {
    val ctx = LocalContext.current
    val nav = LocalNav.current
    val scope = rememberCoroutineScope()
    var summaryOn by remember { mutableStateOf(Prefs.summaryEnabled(ctx)) }
    var hour by remember { mutableStateOf(Prefs.summaryHour(ctx)) }
    var minute by remember { mutableStateOf(Prefs.summaryMinute(ctx)) }
    var pickTime by remember { mutableStateOf(false) }
    var confirmRestore by remember { mutableStateOf<android.net.Uri?>(null) }
    var canNotify by remember { mutableStateOf(Notifier.canNotify(ctx)) }

    fun saveSummary() {
        Prefs.setSummary(ctx, summaryOn, hour, minute)
        Alarms.scheduleSummary(ctx)
    }

    val notifPermission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { canNotify = it }
    val backupLauncher = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("application/octet-stream")) { uri ->
        if (uri != null) scope.launch(Dispatchers.Main.immediate) {
            try { Backup.export(ctx, uri); Act.toast(ctx, "Yedek kaydedildi") } catch (e: Exception) { Act.toast(ctx, "Yedeklenemedi: ${e.message}") }
        }
    }
    val restoreLauncher = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) confirmRestore = uri
    }

    Screen("Ayarlar") { padding ->
        DetailColumn(padding) {
            InfoCard {
                Text("Bildirimler", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.primary)
                if (!canNotify) {
                    Text("Bildirim izni kapalı. Görev hatırlatmaları gelmez.", color = MaterialTheme.colorScheme.error)
                    Button(onClick = {
                        if (Build.VERSION.SDK_INT >= 33) notifPermission.launch(android.Manifest.permission.POST_NOTIFICATIONS)
                        else ctx.startActivity(Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, ctx.packageName))
                    }) { Text("İzin ver") }
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text("Günlük özet bildirimi")
                        Text(
                            "Her sabah günün görevleri ve aranacak yatırımcılar",
                            style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Switch(checked = summaryOn, onCheckedChange = { summaryOn = it; saveSummary() })
                }
                if (summaryOn) OutlinedButton(onClick = { pickTime = true }) {
                    Text("Saat: %02d:%02d".format(hour, minute))
                }
                Text(
                    "İpucu: Bildirimlerin zamanında gelmesi için telefon ayarlarında bu uygulamanın pil optimizasyonunu kapatın.",
                    style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                TextButton(onClick = {
                    runCatching {
                        ctx.startActivity(Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS))
                    }
                }) { Text("Pil optimizasyonu ayarları") }
            }

            InfoCard {
                Text("Yedekleme", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.primary)
                Text(
                    "Tüm kayıtlarınız yalnızca bu telefonda saklanır. Telefon değiştirirken veya düzenli olarak yedek alın " +
                        "(Google Drive, WhatsApp veya bilgisayara kaydedebilirsiniz).",
                    style = MaterialTheme.typography.bodySmall,
                )
                Button(onClick = {
                    val stamp = SimpleDateFormat("yyyyMMdd_HHmm", Locale.US).format(Date())
                    backupLauncher.launch("emlak_takip_yedek_$stamp.db")
                }, modifier = Modifier.fillMaxWidth()) { Text("Yedek al") }
                OutlinedButton(onClick = { restoreLauncher.launch(arrayOf("*/*")) }, modifier = Modifier.fillMaxWidth()) {
                    Text("Yedekten geri yükle")
                }
            }

            InfoCard {
                Text("Harita", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.primary)
                OutlinedButton(onClick = { nav.navigate("layers") }, modifier = Modifier.fillMaxWidth()) { Text("KML katmanları") }
                OutlinedButton(onClick = { nav.navigate(Routes.list(LinkType.BUILDING)) }, modifier = Modifier.fillMaxWidth()) { Text("Bina listesi") }
            }

            InfoCard {
                Text("Hakkında", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.primary)
                val version = runCatching { ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionName }.getOrNull()
                Text("Emlak Takip ${version ?: ""}")
                Text(
                    "Harita verileri © OpenStreetMap katkıcıları. Uydu görüntüsü © Esri.",
                    style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }

    if (pickTime) {
        val state = rememberTimePickerState(hour, minute, is24Hour = true)
        AlertDialog(
            onDismissRequest = { pickTime = false },
            title = { Text("Özet saati") },
            text = { TimePicker(state = state) },
            confirmButton = {
                TextButton(onClick = { pickTime = false; hour = state.hour; minute = state.minute; saveSummary() }) { Text("Tamam") }
            },
            dismissButton = { TextButton(onClick = { pickTime = false }) { Text("Vazgeç") } },
        )
    }

    confirmRestore?.let { uri ->
        AlertDialog(
            onDismissRequest = { confirmRestore = null },
            title = { Text("Yedekten geri yükle") },
            text = { Text("Telefondaki TÜM mevcut kayıtlar silinip yedekteki kayıtlar yüklenecek. Uygulama yeniden başlayacak. Devam edilsin mi?") },
            confirmButton = {
                TextButton(onClick = {
                    confirmRestore = null
                    scope.launch(Dispatchers.Main.immediate) {
                        try { Backup.restore(ctx, uri) } catch (e: Exception) { Act.toast(ctx, "Geri yüklenemedi: ${e.message}") }
                    }
                }) { Text("Geri yükle", color = MaterialTheme.colorScheme.error) }
            },
            dismissButton = { TextButton(onClick = { confirmRestore = null }) { Text("Vazgeç") } },
        )
    }
}
