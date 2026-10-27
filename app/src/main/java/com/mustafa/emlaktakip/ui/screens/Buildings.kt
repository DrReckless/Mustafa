package com.mustafa.emlaktakip.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Apartment
import androidx.compose.material.icons.filled.Directions
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Landscape
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Sell
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.mustafa.emlaktakip.data.Building
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.Options
import com.mustafa.emlaktakip.data.Titles
import com.mustafa.emlaktakip.data.colorOf
import com.mustafa.emlaktakip.data.labelOf
import com.mustafa.emlaktakip.ui.components.Avatar
import com.mustafa.emlaktakip.ui.components.ChoiceChips
import com.mustafa.emlaktakip.ui.components.DetailColumn
import com.mustafa.emlaktakip.ui.components.EditDeleteActions
import com.mustafa.emlaktakip.ui.components.EmptyHint
import com.mustafa.emlaktakip.ui.components.FormSection
import com.mustafa.emlaktakip.ui.components.HeaderCard
import com.mustafa.emlaktakip.ui.components.IconAvatar
import com.mustafa.emlaktakip.ui.components.InfoCard
import com.mustafa.emlaktakip.ui.components.InfoRow
import com.mustafa.emlaktakip.ui.components.IntInput
import com.mustafa.emlaktakip.ui.components.LinkedTasks
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.components.LocalNav
import com.mustafa.emlaktakip.ui.components.NotesCard
import com.mustafa.emlaktakip.ui.components.NotesInput
import com.mustafa.emlaktakip.ui.components.RowCard
import com.mustafa.emlaktakip.ui.components.Routes
import com.mustafa.emlaktakip.ui.components.Screen
import com.mustafa.emlaktakip.ui.components.Section
import com.mustafa.emlaktakip.ui.components.SmallCallButton
import com.mustafa.emlaktakip.ui.components.TextInput
import com.mustafa.emlaktakip.ui.components.rememberFlow
import com.mustafa.emlaktakip.util.Act
import com.mustafa.emlaktakip.util.Fmt
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

fun buildingSubtitle(b: Building) = listOf(
    b.siteName, b.address,
    b.floors?.let { "$it kat" } ?: "", b.unitCount?.let { "$it daire" } ?: "",
).filter { it.isNotBlank() }.joinToString(" · ")

@Composable
fun BuildingList() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val items by rememberFlow("all", emptyList()) { dao.buildings() }
    ListScaffold(
        title = "Binalar",
        addText = "Haritadan ekle",
        onAdd = { nav.navigate(Routes.map()) },
        items = items,
        key = { it.id },
        searchText = { "${it.name} ${it.siteName} ${it.address} ${it.notes} ${it.kmlDescription} ${it.extraData}" },
        emptyText = "Henüz bina yok. Haritada KML dosyası açın veya haritaya uzun basarak bina ekleyin.",
        filters = Options.buildingStatus,
        filterKey = { it.status },
    ) { b ->
        RowCard(
            title = Titles.building(b),
            subtitle = buildingSubtitle(b),
            onClick = { nav.navigate(Routes.detail(LinkType.BUILDING, b.id)) },
            leading = { IconAvatar(Icons.Filled.Home, Options.buildingStatus.colorOf(b.status)) },
            pill = Options.buildingStatus.labelOf(b.status) to Options.buildingStatus.colorOf(b.status),
        )
    }
}

@Composable
fun BuildingDetail(id: Long) {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    val b by rememberFlow(id, null) { dao.building(id) }
    val contacts by rememberFlow(id, emptyList()) { dao.contactsByBuilding(id) }
    val listings by rememberFlow(id, emptyList()) { dao.listingsByBuilding(id) }
    val units by rememberFlow(id, emptyList()) { dao.unitsByBuilding(id) }
    val lands by rememberFlow(id, emptyList()) { dao.landsByBuilding(id) }
    var showKml by remember { mutableStateOf(false) }

    Screen(
        "Bina",
        actions = {
            EditDeleteActions(
                onEdit = { nav.navigate(Routes.edit(LinkType.BUILDING, id)) },
                onDelete = { b?.let { scope.launch(Dispatchers.Main.immediate) { dao.deleteBuildingFull(it); nav.popBackStack() } } },
            )
        },
    ) { padding ->
        val item = b ?: return@Screen LoadingBox(padding)
        DetailColumn(padding) {
            HeaderCard(
                Titles.building(item), buildingSubtitle(item),
                pill = Options.buildingStatus.labelOf(item.status) to Options.buildingStatus.colorOf(item.status),
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilledTonalButton(onClick = { nav.navigate(Routes.map(id)) }) { Icon(Icons.Filled.Map, null); Text("  Haritada") }
                    FilledTonalButton(onClick = { Act.navigate(ctx, item.lat, item.lon, Titles.building(item)) }) {
                        Icon(Icons.Filled.Directions, null); Text("  Yol tarifi")
                    }
                }
            }
            InfoCard {
                ChoiceChips("Durum", Options.buildingStatus, item.status) { s ->
                    scope.launch(Dispatchers.Main.immediate) { dao.update(item.copy(status = s, updatedAt = System.currentTimeMillis())) }
                }
            }
            BuildingPhotos(item)
            InfoCard {
                InfoRow("Tür", item.buildingType)
                InfoRow("Site / Proje", item.siteName)
                InfoRow("Adres", item.address)
                InfoRow("Kat sayısı", item.floors?.toString())
                InfoRow("Daire sayısı", item.unitCount?.toString())
                InfoRow("Yapım yılı", item.buildYear?.toString())
                InfoRow("Konum", String.format(java.util.Locale.US, "%.6f, %.6f", item.lat, item.lon))
                InfoRow("Son güncelleme", Fmt.dateTime(item.updatedAt))
            }
            NotesCard(item.notes)
            if (item.kmlDescription.isNotBlank() || item.extraData.isNotBlank()) InfoCard {
                Row {
                    Text("KML bilgileri", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.primary, modifier = Modifier.weight(1f))
                    TextButton(onClick = { showKml = !showKml }) { Text(if (showKml) "Gizle" else "Göster") }
                }
                if (showKml) {
                    if (item.extraData.isNotBlank()) Text(item.extraData, style = MaterialTheme.typography.bodySmall)
                    if (item.kmlDescription.isNotBlank()) Text(item.kmlDescription, style = MaterialTheme.typography.bodySmall)
                }
            }

            Section("Güvenlik / Kapıcı / Yönetici", contacts.size, "Kişi ekle", onAdd = {
                nav.navigate(Routes.edit(LinkType.CONTACT, 0, "&buildingId=$id"))
            }) {
                if (contacts.isEmpty()) EmptyHint("Bu binada kayıtlı görevli yok.")
                contacts.forEach { c ->
                    RowCard(
                        title = Titles.contact(c), subtitle = c.phone,
                        onClick = { nav.navigate(Routes.detail(LinkType.CONTACT, c.id)) },
                        leading = { Avatar(c.name, Options.contactRole.colorOf(c.role)) },
                        pill = Options.contactRole.labelOf(c.role) to Options.contactRole.colorOf(c.role),
                        trailing = { SmallCallButton(c.phone) },
                    )
                }
            }
            Section("Bu Binadaki İlanlar", listings.size, "İlan ekle", onAdd = {
                nav.navigate(Routes.edit(LinkType.LISTING, 0, "&buildingId=$id"))
            }) {
                if (listings.isEmpty()) EmptyHint("Bağlı ilan yok.")
                listings.forEach { l ->
                    RowCard(
                        title = Titles.listing(l), subtitle = listingSubtitle(l),
                        onClick = { nav.navigate(Routes.detail(LinkType.LISTING, l.id)) },
                        leading = { IconAvatar(Icons.Filled.Sell, 0xFFE65100) },
                        pill = Options.listingStatus.labelOf(l.status) to Options.listingStatus.colorOf(l.status),
                    )
                }
            }
            Section("İş Karşılığı Daireler", units.size, "Daire ekle", onAdd = {
                nav.navigate(Routes.edit(LinkType.UNIT, 0, "&buildingId=$id"))
            }) {
                if (units.isEmpty()) EmptyHint("Bağlı daire yok.")
                units.forEach { u ->
                    RowCard(
                        title = Titles.unit(u), subtitle = unitSubtitle(u),
                        onClick = { nav.navigate(Routes.detail(LinkType.UNIT, u.id)) },
                        leading = { IconAvatar(Icons.Filled.Apartment, 0xFF6A1B9A) },
                        pill = Options.unitStatus.labelOf(u.status) to Options.unitStatus.colorOf(u.status),
                    )
                }
            }
            if (lands.isNotEmpty() || item.buildingType == "Arsa") Section("Kat Karşılığı Arsa", lands.size, "Arsa ekle", onAdd = {
                nav.navigate(Routes.edit(LinkType.LAND, 0, "&buildingId=$id"))
            }) {
                lands.forEach { l ->
                    RowCard(
                        title = Titles.land(l), subtitle = landSubtitle(l),
                        onClick = { nav.navigate(Routes.detail(LinkType.LAND, l.id)) },
                        leading = { IconAvatar(Icons.Filled.Landscape, 0xFF2E7D32) },
                        pill = Options.landStatus.labelOf(l.status) to Options.landStatus.colorOf(l.status),
                    )
                }
            }
            LinkedTasks(LinkType.BUILDING, id)
        }
    }
}

@Composable
fun BuildingEdit(id: Long, lat: Double?, lon: Double?) {
    val dao = LocalDao.current
    var b by remember {
        mutableStateOf<Building?>(
            if (id == 0L) Building(
                name = "", lat = lat ?: 0.0, lon = lon ?: 0.0,
                geomType = "Point", coords = "${lon ?: 0.0},${lat ?: 0.0}",
            ) else null
        )
    }
    LaunchedEffect(id) { if (id > 0) b = dao.getBuilding(id) }

    EditScaffold(
        title = if (id == 0L) "Yeni Bina" else "Binayı Düzenle",
        loaded = b != null,
        onSave = {
            val item = b!!.let { it.copy(name = it.name.ifBlank { "Bina" }) }
            if (item.id == 0L) dao.insert(item) else dao.update(item.copy(updatedAt = System.currentTimeMillis()))
            true
        },
    ) {
        val item = b ?: return@EditScaffold
        TextInput("Bina adı", item.name, { b = item.copy(name = it) }, placeholder = "ör. Gül Apartmanı")
        TextInput("Site / Proje", item.siteName, { b = item.copy(siteName = it) })
        TextInput("Adres", item.address, { b = item.copy(address = it) }, lines = 2)
        ChoiceChips("Durum", Options.buildingStatus, item.status) { b = item.copy(status = it) }
        ChoiceChips("Tür", Options.buildingType, item.buildingType) { b = item.copy(buildingType = it) }
        FormSection("Yapı bilgileri")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            IntInput("Kat sayısı", item.floors, { b = item.copy(floors = it) }, Modifier.weight(1f))
            IntInput("Daire sayısı", item.unitCount, { b = item.copy(unitCount = it) }, Modifier.weight(1f))
            IntInput("Yapım yılı", item.buildYear, { b = item.copy(buildYear = it) }, Modifier.weight(1f))
        }
        FormSection("Notlar")
        NotesInput(item.notes, { b = item.copy(notes = it) }, "Bina durumu, boş daireler, otopark, asansör, kat malikleri…")
        if (item.extraData.isNotBlank()) {
            FormSection("KML ek verileri")
            TextInput("Ek veriler (anahtar: değer)", item.extraData, { b = item.copy(extraData = it) }, lines = 3)
        }
    }
}
