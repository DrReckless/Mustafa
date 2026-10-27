package com.mustafa.emlaktakip.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Sms
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TimePicker
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.material3.rememberTimePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.OffsetMapping
import androidx.compose.ui.text.input.TransformedText
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.navigation.NavHostController
import com.mustafa.emlaktakip.data.AppDao
import com.mustafa.emlaktakip.data.InvestorInterest
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.Option
import com.mustafa.emlaktakip.data.Options
import com.mustafa.emlaktakip.data.PickItem
import com.mustafa.emlaktakip.data.TaskItem
import com.mustafa.emlaktakip.data.Titles
import com.mustafa.emlaktakip.data.colorOf
import com.mustafa.emlaktakip.data.labelOf
import com.mustafa.emlaktakip.data.linkTitle
import com.mustafa.emlaktakip.data.pickItems
import com.mustafa.emlaktakip.notify.TaskOps
import com.mustafa.emlaktakip.util.Act
import com.mustafa.emlaktakip.util.Days
import com.mustafa.emlaktakip.util.Fmt
import com.mustafa.emlaktakip.util.matchesQuery
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.Calendar
import java.util.TimeZone

val LocalDao = staticCompositionLocalOf<AppDao> { error("dao yok") }
val LocalNav = staticCompositionLocalOf<NavHostController> { error("nav yok") }

/** Rota oluşturucular */
object Routes {
    fun detail(type: LinkType, id: Long) = "${type.route}?id=$id"
    fun edit(type: LinkType, id: Long = 0, extra: String = "") = "${type.route}_edit?id=$id$extra"
    fun list(type: LinkType) = "${type.route}_list"
    fun task(id: Long = 0, type: LinkType? = null, linkId: Long? = null) =
        "task_edit?id=$id" + (if (type != null && linkId != null) "&linkType=${type.name}&linkId=$linkId" else "")
    fun map(focus: Long = 0) = "map?focus=$focus"
}

@Composable
fun <T> rememberFlow(key: Any?, initial: T, factory: () -> Flow<T>): State<T> =
    remember(key) { factory() }.collectAsState(initial)

fun Long.color() = Color(this)

// ---------------------------------------------------------------- iskelet

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Screen(
    title: String,
    back: Boolean = true,
    actions: @Composable RowScope.() -> Unit = {},
    fab: @Composable () -> Unit = {},
    content: @Composable (PaddingValues) -> Unit,
) {
    val nav = LocalNav.current
    Scaffold(
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        topBar = {
            TopAppBar(
                title = { Text(title, maxLines = 1, overflow = TextOverflow.Ellipsis) },
                navigationIcon = {
                    if (back) IconButton(onClick = { nav.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Geri")
                    }
                },
                actions = actions,
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    navigationIconContentColor = MaterialTheme.colorScheme.onPrimary,
                    actionIconContentColor = MaterialTheme.colorScheme.onPrimary,
                ),
            )
        },
        floatingActionButton = fab,
        content = content,
    )
}

@Composable
fun AddFab(text: String, onClick: () -> Unit) {
    ExtendedFloatingActionButton(
        onClick = onClick,
        icon = { Icon(Icons.Filled.Add, null) },
        text = { Text(text) },
        containerColor = MaterialTheme.colorScheme.secondaryContainer,
    )
}

/** Detay ekranı üst çubuğundaki düzenle / sil */
@Composable
fun EditDeleteActions(onEdit: () -> Unit, onDelete: () -> Unit) {
    var confirm by remember { mutableStateOf(false) }
    IconButton(onClick = onEdit) { Icon(Icons.Filled.Edit, "Düzenle") }
    IconButton(onClick = { confirm = true }) { Icon(Icons.Filled.Delete, "Sil") }
    if (confirm) ConfirmDialog("Bu kayıt silinsin mi?", onConfirm = { confirm = false; onDelete() }, onDismiss = { confirm = false })
}

@Composable
fun ConfirmDialog(text: String, confirmText: String = "Sil", onConfirm: () -> Unit, onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        text = { Text(text) },
        confirmButton = { TextButton(onClick = onConfirm) { Text(confirmText) } },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Vazgeç") } },
    )
}

@Composable
fun FormColumn(padding: PaddingValues, content: @Composable ColumnScope.() -> Unit) {
    Column(
        Modifier
            .padding(padding)
            .fillMaxSize()
            .imePadding()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        content = {
            content()
            Spacer(Modifier.heightIn(min = 80.dp))
        },
    )
}

@Composable
fun DetailColumn(padding: PaddingValues, content: @Composable ColumnScope.() -> Unit) {
    Column(
        Modifier
            .padding(padding)
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 12.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        content = {
            content()
            Spacer(Modifier.heightIn(min = 24.dp))
        },
    )
}

@Composable
fun FormSection(title: String) {
    Text(
        title, style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.primary,
        modifier = Modifier.padding(top = 8.dp),
    )
}

// ---------------------------------------------------------------- girişler

@Composable
fun TextInput(
    label: String,
    value: String,
    onChange: (String) -> Unit,
    modifier: Modifier = Modifier.fillMaxWidth(),
    keyboard: KeyboardType = KeyboardType.Text,
    lines: Int = 1,
    placeholder: String? = null,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        label = { Text(label) },
        placeholder = placeholder?.let { { Text(it) } },
        modifier = modifier,
        singleLine = lines == 1,
        minLines = lines,
        keyboardOptions = KeyboardOptions(
            keyboardType = keyboard,
            capitalization = if (keyboard == KeyboardType.Text) KeyboardCapitalization.Sentences else KeyboardCapitalization.None,
        ),
    )
}

@Composable
fun NotesInput(value: String, onChange: (String) -> Unit, label: String = "Notlar") =
    TextInput(label, value, onChange, lines = 4)

@Composable
fun PhoneInput(label: String, value: String, onChange: (String) -> Unit, modifier: Modifier = Modifier.fillMaxWidth()) =
    TextInput(label, value, onChange, modifier, keyboard = KeyboardType.Phone)

/** Binlik ayraçlı tutar girişi */
@Composable
fun MoneyInput(label: String, value: Long?, onChange: (Long?) -> Unit, modifier: Modifier = Modifier.fillMaxWidth()) {
    OutlinedTextField(
        value = value?.toString() ?: "",
        onValueChange = { s -> onChange(s.filter { it.isDigit() }.take(15).toLongOrNull()) },
        label = { Text(label) },
        suffix = { Text("₺") },
        singleLine = true,
        visualTransformation = ThousandsTransformation,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
        modifier = modifier,
    )
}

@Composable
fun IntInput(label: String, value: Int?, onChange: (Int?) -> Unit, modifier: Modifier = Modifier.fillMaxWidth(), suffix: String? = null) {
    OutlinedTextField(
        value = value?.toString() ?: "",
        onValueChange = { s -> onChange(s.filter { it.isDigit() }.take(9).toIntOrNull()) },
        label = { Text(label) },
        suffix = suffix?.let { { Text(it) } },
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
        modifier = modifier,
    )
}

object ThousandsTransformation : VisualTransformation {
    override fun filter(text: AnnotatedString): TransformedText {
        val digits = text.text
        val n = digits.length
        val out = StringBuilder()
        for (i in digits.indices) {
            if (i > 0 && (n - i) % 3 == 0) out.append('.')
            out.append(digits[i])
        }
        val formatted = out.toString()
        val mapping = object : OffsetMapping {
            override fun originalToTransformed(offset: Int): Int {
                var seps = 0
                for (i in 1 until offset.coerceAtMost(n)) if ((n - i) % 3 == 0) seps++
                return (offset + seps).coerceAtMost(formatted.length)
            }

            override fun transformedToOriginal(offset: Int): Int =
                formatted.take(offset).count { it != '.' }.coerceAtMost(n)
        }
        return TransformedText(AnnotatedString(formatted), mapping)
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ChoiceChips(label: String?, options: List<Option>, selected: String, onSelect: (String) -> Unit) {
    Column {
        if (label != null) Text(label, style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            options.forEach { o ->
                FilterChip(selected = o.key == selected, onClick = { onSelect(o.key) }, label = { Text(o.label) })
            }
        }
    }
}

@Composable
fun RatingInput(value: Int, onChange: (Int) -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text("Değerlendirme", style = MaterialTheme.typography.labelLarge, modifier = Modifier.width(110.dp))
        (1..5).forEach { i ->
            Text(
                if (i <= value) "★" else "☆",
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.secondary,
                modifier = Modifier
                    .clickable { onChange(if (value == i) 0 else i) }
                    .padding(4.dp),
            )
        }
    }
}

/** Tarih (ve isteğe bağlı saat) seçimi */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DateTimeInput(label: String, value: Long?, onChange: (Long?) -> Unit, withTime: Boolean = true) {
    var showDate by remember { mutableStateOf(false) }
    var showTime by remember { mutableStateOf(false) }
    var pickedDay by remember { mutableStateOf<Calendar?>(null) }

    OutlinedCardRow(
        icon = Icons.Filled.Event,
        label = label,
        text = if (value == null) "Seçilmedi" else if (withTime) Fmt.dateTime(value) + " · " + Fmt.weekday(value) else Fmt.date(value),
        onClick = { showDate = true },
        onClear = if (value != null) ({ onChange(null) }) else null,
    )

    if (showDate) {
        val initialUtc = value?.let {
            val local = Calendar.getInstance().apply { timeInMillis = it }
            Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
                clear(); set(local.get(Calendar.YEAR), local.get(Calendar.MONTH), local.get(Calendar.DAY_OF_MONTH))
            }.timeInMillis
        } ?: System.currentTimeMillis()
        val state = rememberDatePickerState(initialSelectedDateMillis = initialUtc)
        DatePickerDialog(
            onDismissRequest = { showDate = false },
            confirmButton = {
                TextButton(onClick = {
                    showDate = false
                    val sel = state.selectedDateMillis ?: return@TextButton
                    val utc = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply { timeInMillis = sel }
                    val prev = Calendar.getInstance().apply { value?.let { timeInMillis = it } }
                    val local = Calendar.getInstance().apply {
                        clear()
                        set(utc.get(Calendar.YEAR), utc.get(Calendar.MONTH), utc.get(Calendar.DAY_OF_MONTH))
                        if (withTime) {
                            set(Calendar.HOUR_OF_DAY, if (value == null) 9 else prev.get(Calendar.HOUR_OF_DAY))
                            set(Calendar.MINUTE, if (value == null) 0 else prev.get(Calendar.MINUTE))
                        } else {
                            set(Calendar.HOUR_OF_DAY, 9)
                        }
                    }
                    if (withTime) { pickedDay = local; showTime = true } else onChange(local.timeInMillis)
                }) { Text(if (withTime) "İleri" else "Tamam") }
            },
            dismissButton = { TextButton(onClick = { showDate = false }) { Text("Vazgeç") } },
        ) { DatePicker(state = state) }
    }

    if (showTime) {
        val day = pickedDay ?: Calendar.getInstance()
        val state = rememberTimePickerState(day.get(Calendar.HOUR_OF_DAY), day.get(Calendar.MINUTE), is24Hour = true)
        AlertDialog(
            onDismissRequest = { showTime = false },
            title = { Text("Saat seçin") },
            text = { TimePicker(state = state) },
            confirmButton = {
                TextButton(onClick = {
                    showTime = false
                    day.set(Calendar.HOUR_OF_DAY, state.hour); day.set(Calendar.MINUTE, state.minute)
                    onChange(day.timeInMillis)
                }) { Text("Tamam") }
            },
            dismissButton = { TextButton(onClick = { showTime = false }) { Text("Vazgeç") } },
        )
    }
}

@Composable
private fun OutlinedCardRow(icon: ImageVector, label: String, text: String, onClick: () -> Unit, onClear: (() -> Unit)?) {
    Card(
        onClick = onClick,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(Modifier.padding(horizontal = 12.dp, vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, null, tint = MaterialTheme.colorScheme.primary)
            Column(Modifier.weight(1f).padding(start = 12.dp)) {
                Text(label, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(text, style = MaterialTheme.typography.bodyLarge)
            }
            if (onClear != null) IconButton(onClick = onClear) { Icon(Icons.Filled.Clear, "Temizle") }
        }
    }
}

/** Başka bir kayda bağlantı seçimi (müteahhit, bina vb.) */
@Composable
fun RecordPicker(label: String, type: LinkType, selectedId: Long?, onChange: (Long?) -> Unit) {
    val dao = LocalDao.current
    var open by remember { mutableStateOf(false) }
    val title by produceState<String?>(null, selectedId) {
        value = selectedId?.let { dao.linkTitle(type, it) }
    }
    OutlinedCardRow(
        icon = Icons.Filled.Link,
        label = label,
        text = if (selectedId == null) "Seçilmedi (dokunarak seçin)" else title ?: "…",
        onClick = { open = true },
        onClear = if (selectedId != null) ({ onChange(null) }) else null,
    )
    if (open) {
        val items by rememberFlow(type, emptyList()) { dao.pickItems(type) }
        PickDialog("$label seçin", items, onPick = { open = false; onChange(it.id) }, onDismiss = { open = false })
    }
}

@Composable
fun PickDialog(title: String, items: List<PickItem>, onPick: (PickItem) -> Unit, onDismiss: () -> Unit) {
    var q by remember { mutableStateOf("") }
    Dialog(onDismissRequest = onDismiss) {
        // Sabit oranlı yükseklik: içerik değiştikçe pencere boyutu oynamaz
        Card(Modifier.fillMaxWidth().fillMaxHeight(0.8f)) {
            Column(Modifier.fillMaxSize().padding(16.dp)) {
                Text(title, style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.size(8.dp))
                SearchField(q, { q = it })
                val filtered = items.filter { "${it.title} ${it.subtitle}".matchesQuery(q) }
                LazyColumn(Modifier.weight(1f).fillMaxWidth()) {
                    if (filtered.isEmpty()) item { EmptyHint("Kayıt bulunamadı. Önce ilgili bölümden kayıt ekleyin.") }
                    items(filtered, key = { "${it.type}-${it.id}" }) { item ->
                        Column(
                            Modifier
                                .fillMaxWidth()
                                .clickable { onPick(item) }
                                .padding(vertical = 10.dp)
                        ) {
                            Text(item.title, style = MaterialTheme.typography.bodyLarge)
                            if (item.subtitle.isNotBlank()) Text(item.subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        HorizontalDivider()
                    }
                }
                TextButton(onClick = onDismiss, modifier = Modifier.align(Alignment.End)) { Text("Kapat") }
            }
        }
    }
}

@Composable
fun SearchField(query: String, onChange: (String) -> Unit, placeholder: String = "Ara…", modifier: Modifier = Modifier.fillMaxWidth()) {
    OutlinedTextField(
        value = query,
        onValueChange = onChange,
        placeholder = { Text(placeholder) },
        leadingIcon = { Icon(Icons.Filled.Search, null) },
        trailingIcon = { if (query.isNotEmpty()) IconButton(onClick = { onChange("") }) { Icon(Icons.Filled.Clear, "Temizle") } },
        singleLine = true,
        shape = RoundedCornerShape(28.dp),
        modifier = modifier,
    )
}

// ---------------------------------------------------------------- görünümler

@Composable
fun StatusPill(text: String, color: Long) {
    if (text.isBlank()) return
    Text(
        text,
        style = MaterialTheme.typography.labelSmall,
        color = Color.White,
        modifier = Modifier
            .clip(RoundedCornerShape(50))
            .background(color.color())
            .padding(horizontal = 8.dp, vertical = 2.dp),
    )
}

@Composable
fun RowCard(
    title: String,
    subtitle: String = "",
    onClick: () -> Unit,
    leading: (@Composable () -> Unit)? = null,
    pill: Pair<String, Long>? = null,
    trailing: (@Composable () -> Unit)? = null,
) {
    Card(
        onClick = onClick,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLow),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            if (leading != null) { leading(); Spacer(Modifier.width(12.dp)) }
            Column(Modifier.weight(1f)) {
                Text(title, style = MaterialTheme.typography.titleMedium, maxLines = 2, overflow = TextOverflow.Ellipsis)
                if (subtitle.isNotBlank()) Text(
                    subtitle, style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 3, overflow = TextOverflow.Ellipsis,
                )
            }
            if (pill != null) StatusPill(pill.first, pill.second)
            trailing?.invoke()
        }
    }
}

@Composable
fun Avatar(text: String, color: Long = 0xFF0E4D64) {
    Box(
        Modifier.size(40.dp).clip(CircleShape).background(color.color()),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text.trim().split(' ').filter { it.isNotEmpty() }.take(2).joinToString("") { it.take(1).uppercase() }.ifBlank { "?" },
            color = Color.White, fontWeight = FontWeight.Bold,
        )
    }
}

@Composable
fun IconAvatar(icon: ImageVector, color: Long = 0xFF0E4D64) {
    Box(
        Modifier.size(40.dp).clip(CircleShape).background(color.color()),
        contentAlignment = Alignment.Center,
    ) { Icon(icon, null, tint = Color.White) }
}

@Composable
fun EmptyHint(text: String) {
    Text(
        text,
        style = MaterialTheme.typography.bodyMedium,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp, horizontal = 8.dp),
    )
}

@Composable
fun InfoCard(content: @Composable ColumnScope.() -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLow),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp), content = content)
    }
}

@Composable
fun HeaderCard(title: String, subtitle: String = "", pill: Pair<String, Long>? = null, content: @Composable ColumnScope.() -> Unit = {}) {
    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(title, style = MaterialTheme.typography.headlineSmall, modifier = Modifier.weight(1f))
                if (pill != null) StatusPill(pill.first, pill.second)
            }
            if (subtitle.isNotBlank()) Text(subtitle, style = MaterialTheme.typography.bodyLarge)
            content()
        }
    }
}

@Composable
fun InfoRow(label: String, value: String?, onClick: (() -> Unit)? = null) {
    if (value.isNullOrBlank()) return
    Row(
        Modifier
            .fillMaxWidth()
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(vertical = 2.dp)
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.width(120.dp))
        Text(
            value, style = MaterialTheme.typography.bodyMedium,
            color = if (onClick != null) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface,
            textDecoration = if (onClick != null) TextDecoration.Underline else null,
            modifier = Modifier.weight(1f),
        )
    }
}

@Composable
fun NotesCard(notes: String, title: String = "Notlar") {
    if (notes.isBlank()) return
    InfoCard {
        Text(title, style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.primary)
        Text(notes, style = MaterialTheme.typography.bodyMedium)
    }
}

@Composable
fun Section(title: String, count: Int? = null, addText: String? = null, onAdd: (() -> Unit)? = null, content: @Composable ColumnScope.() -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                title + (count?.let { " ($it)" } ?: ""),
                style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.weight(1f).padding(start = 4.dp),
            )
            if (onAdd != null) TextButton(onClick = onAdd) {
                Icon(Icons.Filled.Add, null, Modifier.size(18.dp)); Text(addText ?: "Ekle")
            }
        }
        content()
    }
}

/** Ara / WhatsApp / SMS düğmeleri */
@Composable
fun PhoneActions(phone: String) {
    if (phone.isBlank()) return
    val ctx = LocalContext.current
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        FilledTonalButton(onClick = { Act.call(ctx, phone) }, contentPadding = PaddingValues(horizontal = 12.dp)) {
            Icon(Icons.Filled.Call, null, Modifier.size(18.dp)); Spacer(Modifier.width(4.dp)); Text("Ara")
        }
        FilledTonalButton(onClick = { Act.whatsapp(ctx, phone) }, contentPadding = PaddingValues(horizontal = 12.dp)) {
            Icon(Icons.AutoMirrored.Filled.Chat, null, Modifier.size(18.dp)); Spacer(Modifier.width(4.dp)); Text("WhatsApp")
        }
        FilledTonalButton(onClick = { Act.sms(ctx, phone) }, contentPadding = PaddingValues(horizontal = 12.dp)) {
            Icon(Icons.Filled.Sms, null, Modifier.size(18.dp)); Spacer(Modifier.width(4.dp)); Text("SMS")
        }
    }
}

@Composable
fun SmallCallButton(phone: String) {
    if (phone.isBlank()) return
    val ctx = LocalContext.current
    IconButton(onClick = { Act.call(ctx, phone) }) { Icon(Icons.Filled.Call, "Ara", tint = MaterialTheme.colorScheme.primary) }
}

// ---------------------------------------------------------------- görevler

@Composable
fun TaskRow(task: TaskItem, showLink: Boolean = true) {
    val ctx = LocalContext.current
    val dao = LocalDao.current
    val nav = LocalNav.current
    val scope = rememberCoroutineScope()
    val linkType = LinkType.of(task.linkType)
    val linkTitle by produceState<String?>(null, task.linkType, task.linkId) {
        value = if (showLink && linkType != null && task.linkId != null) dao.linkTitle(linkType, task.linkId) else null
    }
    val overdue = !task.done && Days.isOverdue(task.dueAt)
    Card(
        onClick = { nav.navigate(Routes.task(task.id)) },
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLow),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Row(Modifier.padding(start = 4.dp, end = 12.dp, top = 6.dp, bottom = 6.dp), verticalAlignment = Alignment.CenterVertically) {
            Checkbox(checked = task.done, onCheckedChange = { checked -> scope.launch(Dispatchers.Main.immediate) { TaskOps.setDone(ctx, task, checked) } })
            Column(Modifier.weight(1f)) {
                Text(
                    task.title, style = MaterialTheme.typography.titleSmall,
                    textDecoration = if (task.done) TextDecoration.LineThrough else null,
                    color = if (task.done) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface,
                )
                val info = buildList {
                    if (task.done && task.doneAt != null) add("✓ " + Fmt.relative(task.doneAt))
                    else if (task.dueAt != null) add((if (overdue) "⚠ " else "") + Fmt.relative(task.dueAt))
                    if (task.repeat != "NONE") add("↻ " + Options.taskRepeat.labelOf(task.repeat))
                }.joinToString(" · ")
                if (info.isNotBlank()) Text(
                    info, style = MaterialTheme.typography.bodySmall,
                    color = if (overdue) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant,
                )
                if (linkTitle != null && linkType != null) Text(
                    "${linkType.label}: $linkTitle",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.clickable { nav.navigate(Routes.detail(linkType, task.linkId!!)) },
                )
            }
            if (task.priority > 0) StatusPill(Options.taskPriority.labelOf(task.priority.toString()), Options.taskPriority.colorOf(task.priority.toString()))
        }
    }
}

/** Bir kayda bağlı görevler bölümü */
@Composable
fun LinkedTasks(type: LinkType, id: Long) {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val tasks by rememberFlow(id, emptyList()) { dao.tasksForLink(type.name, id) }
    Section("Görevler", tasks.size, "Görev ekle", onAdd = { nav.navigate(Routes.task(0, type, id)) }) {
        if (tasks.isEmpty()) EmptyHint("Bu kayda bağlı görev yok.")
        tasks.forEach { TaskRow(it, showLink = false) }
    }
}

/** İlan / daire / arsa ile ilgilenen yatırımcılar */
@Composable
fun InterestedInvestors(type: LinkType, id: Long) {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    val investors by rememberFlow(id, emptyList()) { dao.investorsForItem(type.name, id) }
    var pick by rememberSaveable { mutableStateOf(false) }
    Section("İlgilenen Yatırımcılar", investors.size, "Yatırımcıya öner", onAdd = { pick = true }) {
        if (investors.isEmpty()) EmptyHint("Henüz bir yatırımcıya önerilmedi.")
        investors.forEach { inv ->
            RowCard(
                title = Titles.investor(inv),
                subtitle = listOf(inv.phone, Fmt.budget(inv.budgetMin, inv.budgetMax)).filter { it.isNotBlank() }.joinToString(" · "),
                onClick = { nav.navigate(Routes.detail(LinkType.INVESTOR, inv.id)) },
                leading = { Avatar(inv.name, Options.investorTemp.colorOf(inv.temperature)) },
                trailing = { SmallCallButton(inv.phone) },
            )
        }
    }
    if (pick) {
        val items by rememberFlow("inv", emptyList()) { dao.pickItems(LinkType.INVESTOR) }
        PickDialog("Yatırımcı seçin", items, onPick = { p ->
            pick = false
            scope.launch(Dispatchers.Main.immediate) {
                if (dao.interestCount(p.id, type.name, id) == 0) {
                    dao.insert(InvestorInterest(investorId = p.id, itemType = type.name, itemId = id))
                    Act.toast(ctx, "${p.title} ile eşleştirildi")
                } else Act.toast(ctx, "Zaten eşleştirilmiş")
            }
        }, onDismiss = { pick = false })
    }
}

/** Kayda bağlı tek bir bağlantıyı (müteahhit, bina) tıklanabilir gösterir */
@Composable
fun LinkRow(label: String, type: LinkType, id: Long?) {
    if (id == null) return
    val dao = LocalDao.current
    val nav = LocalNav.current
    val title by produceState<String?>(null, id) { value = dao.linkTitle(type, id) }
    InfoRow(label, title ?: "…", onClick = { nav.navigate(Routes.detail(type, id)) })
}
