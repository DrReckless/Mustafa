package com.mustafa.emlaktakip.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AssistChip
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Switch
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.Options
import com.mustafa.emlaktakip.data.TaskItem
import com.mustafa.emlaktakip.notify.Notifier
import com.mustafa.emlaktakip.notify.TaskOps
import com.mustafa.emlaktakip.ui.components.AddFab
import com.mustafa.emlaktakip.ui.components.ChoiceChips
import com.mustafa.emlaktakip.ui.components.ConfirmDialog
import com.mustafa.emlaktakip.ui.components.DateTimeInput
import com.mustafa.emlaktakip.ui.components.EmptyHint
import com.mustafa.emlaktakip.ui.components.FormSection
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.components.LocalNav
import com.mustafa.emlaktakip.ui.components.RecordPicker
import com.mustafa.emlaktakip.ui.components.Routes
import com.mustafa.emlaktakip.ui.components.Screen
import com.mustafa.emlaktakip.ui.components.TaskRow
import com.mustafa.emlaktakip.ui.components.TextInput
import com.mustafa.emlaktakip.ui.components.rememberFlow
import com.mustafa.emlaktakip.util.Act
import com.mustafa.emlaktakip.util.Days
import com.mustafa.emlaktakip.util.Fmt
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.Calendar

@OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)
@Composable
fun TasksScreen() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val open by rememberFlow("open", emptyList()) { dao.openTasks() }
    val done by rememberFlow("done", emptyList()) { dao.doneTasks() }
    var tab by rememberSaveable { mutableIntStateOf(0) }

    val endToday = Days.endOfToday()
    val today = open.filter { it.dueAt == null || it.dueAt < endToday }
    val upcoming = open.filter { it.dueAt != null && it.dueAt >= endToday }

    Screen("Görevler", back = false, fab = { AddFab("Görev") { nav.navigate(Routes.task()) } }) { padding ->
        Column(Modifier.padding(padding).fillMaxSize()) {
            PrimaryTabRow(selectedTabIndex = tab) {
                Tab(tab == 0, { tab = 0 }, text = { Text("Bugün (${today.size})") })
                Tab(tab == 1, { tab = 1 }, text = { Text("Yaklaşan (${upcoming.size})") })
                Tab(tab == 2, { tab = 2 }, text = { Text("Yapılanlar") })
            }
            val list = when (tab) { 0 -> today; 1 -> upcoming; else -> done }
            // Güne göre grupla
            val groups = list.groupBy { t ->
                val ms = if (tab == 2) t.doneAt else t.dueAt
                when {
                    ms == null -> "Tarihsiz"
                    tab == 0 && ms < Days.startOfDay(System.currentTimeMillis()) -> "Gecikmiş"
                    else -> Fmt.relative(ms, withTime = false) + " · " + Fmt.weekday(ms)
                }
            }
            if (list.isEmpty()) EmptyHint(
                when (tab) {
                    0 -> "Bugün için görev yok. Sağ alttan yeni görev ekleyin."
                    1 -> "Yaklaşan görev yok."
                    else -> "Henüz tamamlanan görev yok."
                }
            )
            LazyColumn(
                contentPadding = PaddingValues(start = 12.dp, end = 12.dp, top = 8.dp, bottom = 96.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                groups.forEach { (header, tasks) ->
                    item(key = "h-$header") {
                        Text(
                            header, style = MaterialTheme.typography.titleSmall,
                            color = if (header == "Gecikmiş") MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(top = 8.dp, start = 4.dp),
                        )
                    }
                    items(tasks, key = { it.id }) { TaskRow(it) }
                }
            }
        }
    }
}

private val quickTitles = listOf("Ara: ", "Ziyaret: ", "Yer göster: ", "Teklif: ", "Tapu: ", "Toplantı: ")

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun TaskEdit(id: Long, linkType: String?, linkId: Long?) {
    val dao = LocalDao.current
    val ctx = LocalContext.current
    val nav = LocalNav.current
    val scope = rememberCoroutineScope()
    val required = requireText()
    val defaultDue = remember {
        // Varsayılan: bir sonraki tam saat
        Calendar.getInstance().apply {
            add(Calendar.HOUR_OF_DAY, 1); set(Calendar.MINUTE, 0); set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
        }.timeInMillis
    }
    var t by remember {
        mutableStateOf<TaskItem?>(if (id == 0L) TaskItem(dueAt = defaultDue, linkType = linkType, linkId = linkId) else null)
    }
    var confirmDelete by remember { mutableStateOf(false) }
    LaunchedEffect(id) { if (id > 0) t = dao.getTask(id) }

    run {
        EditScaffold(
            title = if (id == 0L) "Yeni Görev" else "Görevi Düzenle",
            loaded = t != null,
            onSave = {
                val item = t!!
                if (!required(item.title, "Görev başlığı girin")) false
                else {
                    TaskOps.save(ctx, item)
                    if (item.remind && item.dueAt != null && !Notifier.canNotify(ctx)) {
                        Act.toast(ctx, "Bildirim izni kapalı; Ayarlar'dan açın")
                    }
                    true
                }
            },
        ) {
            val item = t ?: return@EditScaffold
            TextInput("Görev", item.title, { t = item.copy(title = it) }, placeholder = "ör. Ahmet Bey'i ara")
            if (item.title.isBlank()) FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                quickTitles.forEach { q -> AssistChip(onClick = { t = item.copy(title = q) }, label = { Text(q.trimEnd(':', ' ')) }) }
            }
            TextInput("Açıklama", item.description, { t = item.copy(description = it) }, lines = 3)
            DateTimeInput("Tarih ve saat", item.dueAt, { t = item.copy(dueAt = it) })
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text("Bildirim gönder", style = MaterialTheme.typography.bodyLarge)
                    Text("Görev saatinde hatırlatma", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Switch(checked = item.remind, onCheckedChange = { t = item.copy(remind = it) })
            }
            ChoiceChips("Tekrar", Options.taskRepeat, item.repeat) { t = item.copy(repeat = it) }
            ChoiceChips("Öncelik", Options.taskPriority, item.priority.toString()) { t = item.copy(priority = it.toInt()) }

            FormSection("Bağlantılı kayıt")
            FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                FilterChip(selected = item.linkType == null, onClick = { t = item.copy(linkType = null, linkId = null) }, label = { Text("Yok") })
                LinkType.entries.forEach { type ->
                    FilterChip(
                        selected = item.linkType == type.name,
                        onClick = { t = item.copy(linkType = type.name, linkId = if (item.linkType == type.name) item.linkId else null) },
                        label = { Text(type.label) },
                    )
                }
            }
            LinkType.of(item.linkType)?.let { type ->
                RecordPicker(type.label, type, item.linkId) { t = item.copy(linkId = it) }
            }
            if (item.id > 0) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        if (item.done) "Tamamlandı: ${Fmt.dateTime(item.doneAt)}" else "Oluşturuldu: ${Fmt.dateTime(item.createdAt)}",
                        style = MaterialTheme.typography.bodySmall, modifier = Modifier.weight(1f),
                    )
                    IconButton(onClick = { confirmDelete = true }) { Icon(Icons.Filled.Delete, "Sil", tint = MaterialTheme.colorScheme.error) }
                }
            }
        }
    }
    if (confirmDelete) ConfirmDialog("Görev silinsin mi?", onConfirm = {
        confirmDelete = false
        t?.let { scope.launch(Dispatchers.Main.immediate) { TaskOps.delete(ctx, it); nav.popBackStack() } }
    }, onDismiss = { confirmDelete = false })
}
