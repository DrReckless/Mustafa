package com.mustafa.emlaktakip.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.mustafa.emlaktakip.data.Option
import com.mustafa.emlaktakip.ui.components.AddFab
import com.mustafa.emlaktakip.ui.components.EmptyHint
import com.mustafa.emlaktakip.ui.components.FormColumn
import com.mustafa.emlaktakip.ui.components.LocalNav
import com.mustafa.emlaktakip.ui.components.Screen
import com.mustafa.emlaktakip.ui.components.SearchField
import com.mustafa.emlaktakip.util.Act
import com.mustafa.emlaktakip.util.matchesQuery
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/** Arama + durum filtresi + liste + ekle düğmesi olan ortak liste ekranı */
@Composable
fun <T> ListScaffold(
    title: String,
    addText: String,
    onAdd: () -> Unit,
    items: List<T>,
    key: (T) -> Any,
    searchText: (T) -> String,
    emptyText: String,
    filters: List<Option>? = null,
    filterKey: (T) -> String = { "" },
    row: @Composable (T) -> Unit,
) {
    var q by rememberSaveable { mutableStateOf("") }
    var filter by rememberSaveable { mutableStateOf<String?>(null) }
    val shown = items.filter { (filter == null || filterKey(it) == filter) && searchText(it).matchesQuery(q) }

    Screen(title, fab = { AddFab(addText, onAdd) }) { padding ->
        Column(Modifier.padding(padding).fillMaxSize()) {
            SearchField(q, { q = it }, modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp))
            if (filters != null) {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    item {
                        FilterChip(selected = filter == null, onClick = { filter = null }, label = { Text("Tümü (${items.size})") })
                    }
                    items(filters) { o ->
                        val n = items.count { filterKey(it) == o.key }
                        FilterChip(
                            selected = filter == o.key,
                            onClick = { filter = if (filter == o.key) null else o.key },
                            label = { Text("${o.label} ($n)") },
                        )
                    }
                }
            }
            if (shown.isEmpty()) {
                EmptyHint(if (items.isEmpty()) emptyText else "Aramaya uygun kayıt yok.")
            }
            LazyColumn(
                contentPadding = PaddingValues(start = 12.dp, end = 12.dp, top = 8.dp, bottom = 96.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxSize(),
            ) {
                items(shown, key = key) { row(it) }
            }
        }
    }
}

/** Kaydet düğmeli form ekranı. onSave false dönerse ekran kapanmaz. */
@Composable
fun EditScaffold(
    title: String,
    loaded: Boolean,
    onSave: suspend () -> Boolean,
    content: @Composable ColumnScope.() -> Unit,
) {
    val nav = LocalNav.current
    val scope = rememberCoroutineScope()
    var saving by rememberSaveable { mutableStateOf(false) }
    val save: () -> Unit = {
        if (!saving) {
            saving = true
            scope.launch(Dispatchers.Main.immediate) {
                val ok = onSave()
                saving = false
                if (ok) nav.popBackStack()
            }
        }
    }
    Screen(title, actions = { IconButton(onClick = save) { Icon(Icons.Filled.Check, "Kaydet") } }) { padding ->
        if (!loaded) {
            Box(Modifier.padding(padding).fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
        } else {
            FormColumn(padding) {
                content()
                Button(onClick = save, modifier = Modifier.fillMaxWidth().height(52.dp)) { Text("Kaydet") }
            }
        }
    }
}

/** Zorunlu alan kontrolü */
@Composable
fun requireText(): (String, String) -> Boolean {
    val ctx = LocalContext.current
    return { value, message ->
        if (value.isBlank()) { Act.toast(ctx, message); false } else true
    }
}

@Composable
fun LoadingBox(padding: PaddingValues) {
    Box(Modifier.padding(padding).fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
}
