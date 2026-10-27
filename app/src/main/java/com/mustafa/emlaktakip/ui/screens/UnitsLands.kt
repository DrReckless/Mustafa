package com.mustafa.emlaktakip.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.mustafa.emlaktakip.data.ExchangeUnit
import com.mustafa.emlaktakip.data.LandDeal
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.Options
import com.mustafa.emlaktakip.data.Titles
import com.mustafa.emlaktakip.data.colorOf
import com.mustafa.emlaktakip.data.labelOf
import com.mustafa.emlaktakip.ui.components.ChoiceChips
import com.mustafa.emlaktakip.ui.components.DetailColumn
import com.mustafa.emlaktakip.ui.components.EditDeleteActions
import com.mustafa.emlaktakip.ui.components.FormSection
import com.mustafa.emlaktakip.ui.components.HeaderCard
import com.mustafa.emlaktakip.ui.components.InfoCard
import com.mustafa.emlaktakip.ui.components.InfoRow
import com.mustafa.emlaktakip.ui.components.IntInput
import com.mustafa.emlaktakip.ui.components.InterestedInvestors
import com.mustafa.emlaktakip.ui.components.LinkRow
import com.mustafa.emlaktakip.ui.components.LinkedTasks
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.components.LocalNav
import com.mustafa.emlaktakip.ui.components.MoneyInput
import com.mustafa.emlaktakip.ui.components.NotesCard
import com.mustafa.emlaktakip.ui.components.NotesInput
import com.mustafa.emlaktakip.ui.components.PhoneActions
import com.mustafa.emlaktakip.ui.components.PhoneInput
import com.mustafa.emlaktakip.ui.components.RecordPicker
import com.mustafa.emlaktakip.ui.components.RowCard
import com.mustafa.emlaktakip.ui.components.Routes
import com.mustafa.emlaktakip.ui.components.Screen
import com.mustafa.emlaktakip.ui.components.TextInput
import com.mustafa.emlaktakip.ui.components.rememberFlow
import com.mustafa.emlaktakip.util.Fmt
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

// =============================================================== İş karşılığı daireler

fun unitSubtitle(u: ExchangeUnit) = listOf(
    u.rooms, Fmt.sqm(u.sqm), Fmt.money(u.price), listOf(u.district, u.neighborhood).filter { it.isNotBlank() }.joinToString("/"),
).filter { it.isNotBlank() }.joinToString(" · ")

@Composable
fun UnitList() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val items by rememberFlow("all", emptyList()) { dao.units() }
    val contractors by rememberFlow("c", emptyList()) { dao.contractors() }
    val names = contractors.associate { it.id to Titles.contractor(it) }
    ListScaffold(
        title = "İş Karşılığı Daireler",
        addText = "Daire",
        onAdd = { nav.navigate(Routes.edit(LinkType.UNIT)) },
        items = items,
        key = { it.id },
        searchText = { "${Titles.unit(it)} ${it.workDescription} ${it.district} ${it.neighborhood} ${names[it.contractorId] ?: ""} ${it.notes}" },
        emptyText = "Müteahhitlerin iş karşılığı verdiği daireleri buraya kaydedin.",
        filters = Options.unitStatus,
        filterKey = { it.status },
    ) { u ->
        RowCard(
            title = Titles.unit(u),
            subtitle = unitSubtitle(u) + (names[u.contractorId]?.let { "\nMüteahhit: $it" } ?: ""),
            onClick = { nav.navigate(Routes.detail(LinkType.UNIT, u.id)) },
            pill = Options.unitStatus.labelOf(u.status) to Options.unitStatus.colorOf(u.status),
        )
    }
}

@Composable
fun UnitDetail(id: Long) {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val scope = rememberCoroutineScope()
    val u by rememberFlow(id, null) { dao.unit(id) }
    Screen(
        "İş Karşılığı Daire",
        actions = {
            EditDeleteActions(
                onEdit = { nav.navigate(Routes.edit(LinkType.UNIT, id)) },
                onDelete = { u?.let { scope.launch(Dispatchers.Main.immediate) { dao.deleteUnitFull(it); nav.popBackStack() } } },
            )
        },
    ) { padding ->
        val item = u ?: return@Screen LoadingBox(padding)
        DetailColumn(padding) {
            HeaderCard(
                Titles.unit(item), Fmt.money(item.price),
                pill = Options.unitStatus.labelOf(item.status) to Options.unitStatus.colorOf(item.status),
            )
            InfoCard {
                ChoiceChips("Durum", Options.unitStatus, item.status) { s ->
                    scope.launch(Dispatchers.Main.immediate) { dao.update(item.copy(status = s, updatedAt = System.currentTimeMillis())) }
                }
            }
            InfoCard {
                LinkRow("Müteahhit", LinkType.CONTRACTOR, item.contractorId)
                InfoRow("Karşılığı iş", item.workDescription)
                InfoRow("Proje", item.projectName)
                InfoRow("Blok / Kat / No", listOf(item.block, item.floor, item.unitNo).filter { it.isNotBlank() }.joinToString(" / "))
                InfoRow("Oda", item.rooms)
                InfoRow("m²", Fmt.sqm(item.sqm))
                InfoRow("İlçe / Mahalle", listOf(item.district, item.neighborhood).filter { it.isNotBlank() }.joinToString(" / "))
                InfoRow("Adres", item.address)
                LinkRow("Bina", LinkType.BUILDING, item.buildingId)
            }
            NotesCard(item.notes)
            InterestedInvestors(LinkType.UNIT, id)
            LinkedTasks(LinkType.UNIT, id)
        }
    }
}

@Composable
fun UnitEdit(id: Long, contractorId: Long?, buildingId: Long?) {
    val dao = LocalDao.current
    var u by remember { mutableStateOf<ExchangeUnit?>(if (id == 0L) ExchangeUnit(contractorId = contractorId, buildingId = buildingId) else null) }
    LaunchedEffect(id) { if (id > 0) u = dao.getUnit(id) }

    EditScaffold(
        title = if (id == 0L) "Yeni İş Karşılığı Daire" else "Daireyi Düzenle",
        loaded = u != null,
        onSave = {
            val item = u!!
            if (item.id == 0L) dao.insert(item) else dao.update(item.copy(updatedAt = System.currentTimeMillis()))
            true
        },
    ) {
        val item = u ?: return@EditScaffold
        RecordPicker("Müteahhit", LinkType.CONTRACTOR, item.contractorId) { u = item.copy(contractorId = it) }
        TextInput("Hangi iş karşılığı", item.workDescription, { u = item.copy(workDescription = it) }, placeholder = "ör. Elektrik tesisatı, hafriyat, kaba inşaat")
        ChoiceChips("Durum", Options.unitStatus, item.status) { u = item.copy(status = it) }
        FormSection("Daire")
        TextInput("Proje adı", item.projectName, { u = item.copy(projectName = it) })
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TextInput("Blok", item.block, { u = item.copy(block = it) }, Modifier.weight(1f))
            TextInput("Kat", item.floor, { u = item.copy(floor = it) }, Modifier.weight(1f))
            TextInput("Daire No", item.unitNo, { u = item.copy(unitNo = it) }, Modifier.weight(1f))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TextInput("Oda", item.rooms, { u = item.copy(rooms = it) }, Modifier.weight(1f), placeholder = "2+1")
            IntInput("m²", item.sqm, { u = item.copy(sqm = it) }, Modifier.weight(1f))
        }
        MoneyInput("Satış fiyatı / değeri", item.price, { u = item.copy(price = it) })
        FormSection("Konum")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TextInput("İlçe", item.district, { u = item.copy(district = it) }, Modifier.weight(1f))
            TextInput("Mahalle", item.neighborhood, { u = item.copy(neighborhood = it) }, Modifier.weight(1f))
        }
        TextInput("Adres", item.address, { u = item.copy(address = it) }, lines = 2)
        RecordPicker("Bina (haritadaki)", LinkType.BUILDING, item.buildingId) { u = item.copy(buildingId = it) }
        FormSection("Notlar")
        NotesInput(item.notes, { u = item.copy(notes = it) })
    }
}

// =============================================================== Kat karşılığı arsalar

fun landSubtitle(l: LandDeal) = listOf(
    Fmt.sqm(l.sqm), l.zoning, l.ownerSharePercent?.let { "Arsa sahibi %$it" } ?: "",
    listOf(l.district, l.neighborhood).filter { it.isNotBlank() }.joinToString("/"),
).filter { it.isNotBlank() }.joinToString(" · ")

@Composable
fun LandList() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val items by rememberFlow("all", emptyList()) { dao.lands() }
    ListScaffold(
        title = "Kat Karşılığı Arsalar",
        addText = "Arsa",
        onAdd = { nav.navigate(Routes.edit(LinkType.LAND)) },
        items = items,
        key = { it.id },
        searchText = { "${Titles.land(it)} ${it.ownerName} ${it.ownerPhone} ${it.district} ${it.neighborhood} ${it.ada} ${it.parsel} ${it.zoning} ${it.notes}" },
        emptyText = "Kat karşılığı verilen arsaları buraya kaydedin.",
        filters = Options.landStatus,
        filterKey = { it.status },
    ) { l ->
        RowCard(
            title = Titles.land(l),
            subtitle = landSubtitle(l) + (if (l.ownerName.isNotBlank()) "\nSahibi: ${l.ownerName}" else ""),
            onClick = { nav.navigate(Routes.detail(LinkType.LAND, l.id)) },
            pill = Options.landStatus.labelOf(l.status) to Options.landStatus.colorOf(l.status),
        )
    }
}

@Composable
fun LandDetail(id: Long) {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val scope = rememberCoroutineScope()
    val l by rememberFlow(id, null) { dao.land(id) }
    Screen(
        "Kat Karşılığı Arsa",
        actions = {
            EditDeleteActions(
                onEdit = { nav.navigate(Routes.edit(LinkType.LAND, id)) },
                onDelete = { l?.let { scope.launch(Dispatchers.Main.immediate) { dao.deleteLandFull(it); nav.popBackStack() } } },
            )
        },
    ) { padding ->
        val item = l ?: return@Screen LoadingBox(padding)
        DetailColumn(padding) {
            HeaderCard(
                Titles.land(item), landSubtitle(item),
                pill = Options.landStatus.labelOf(item.status) to Options.landStatus.colorOf(item.status),
            )
            InfoCard {
                ChoiceChips("Durum", Options.landStatus, item.status) { s ->
                    scope.launch(Dispatchers.Main.immediate) { dao.update(item.copy(status = s, updatedAt = System.currentTimeMillis())) }
                }
            }
            InfoCard {
                InfoRow("Ada / Parsel", listOf(item.ada, item.parsel).filter { it.isNotBlank() }.joinToString(" / "))
                InfoRow("Alan", Fmt.sqm(item.sqm))
                InfoRow("İmar durumu", item.zoning)
                InfoRow("Emsal (KAKS)", item.emsal)
                InfoRow("Kat izni", item.maxFloors)
                InfoRow("Arsa sahibi payı", item.ownerSharePercent?.let { "%$it (müteahhit %${100 - it})" })
                InfoRow("Sahibine verilecek", item.ownerUnits)
                InfoRow("Değer", Fmt.money(item.price))
                InfoRow("İlçe / Mahalle", listOf(item.district, item.neighborhood).filter { it.isNotBlank() }.joinToString(" / "))
                LinkRow("Müteahhit", LinkType.CONTRACTOR, item.contractorId)
                LinkRow("Haritadaki yer", LinkType.BUILDING, item.buildingId)
            }
            if (item.ownerName.isNotBlank() || item.ownerPhone.isNotBlank()) InfoCard {
                InfoRow("Arsa sahibi", item.ownerName)
                InfoRow("Telefon", item.ownerPhone)
                PhoneActions(item.ownerPhone)
            }
            NotesCard(item.notes)
            InterestedInvestors(LinkType.LAND, id)
            LinkedTasks(LinkType.LAND, id)
        }
    }
}

@Composable
fun LandEdit(id: Long, contractorId: Long?, buildingId: Long?) {
    val dao = LocalDao.current
    var l by remember { mutableStateOf<LandDeal?>(if (id == 0L) LandDeal(contractorId = contractorId, buildingId = buildingId) else null) }
    LaunchedEffect(id) { if (id > 0) l = dao.getLand(id) }

    EditScaffold(
        title = if (id == 0L) "Yeni Kat Karşılığı Arsa" else "Arsayı Düzenle",
        loaded = l != null,
        onSave = {
            val item = l!!
            if (item.id == 0L) dao.insert(item) else dao.update(item.copy(updatedAt = System.currentTimeMillis()))
            true
        },
    ) {
        val item = l ?: return@EditScaffold
        TextInput("Başlık", item.title, { l = item.copy(title = it) }, placeholder = "ör. Fenerbahçe köşe parsel")
        ChoiceChips("Durum", Options.landStatus, item.status) { l = item.copy(status = it) }
        FormSection("Arsa bilgileri")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TextInput("Ada", item.ada, { l = item.copy(ada = it) }, Modifier.weight(1f))
            TextInput("Parsel", item.parsel, { l = item.copy(parsel = it) }, Modifier.weight(1f))
            IntInput("m²", item.sqm, { l = item.copy(sqm = it) }, Modifier.weight(1f))
        }
        TextInput("İmar durumu", item.zoning, { l = item.copy(zoning = it) }, placeholder = "ör. Konut alanı, ayrık nizam")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TextInput("Emsal (KAKS)", item.emsal, { l = item.copy(emsal = it) }, Modifier.weight(1f))
            TextInput("Kat izni", item.maxFloors, { l = item.copy(maxFloors = it) }, Modifier.weight(1f))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TextInput("İlçe", item.district, { l = item.copy(district = it) }, Modifier.weight(1f))
            TextInput("Mahalle", item.neighborhood, { l = item.copy(neighborhood = it) }, Modifier.weight(1f))
        }
        RecordPicker("Haritadaki yer", LinkType.BUILDING, item.buildingId) { l = item.copy(buildingId = it) }
        FormSection("Anlaşma")
        RecordPicker("Müteahhit", LinkType.CONTRACTOR, item.contractorId) { l = item.copy(contractorId = it) }
        IntInput("Arsa sahibi payı", item.ownerSharePercent, { l = item.copy(ownerSharePercent = it?.coerceIn(0, 100)) }, suffix = "%")
        TextInput("Arsa sahibine verilecek daireler", item.ownerUnits, { l = item.copy(ownerUnits = it) }, lines = 2, placeholder = "ör. 4 daire + 1 dükkan")
        MoneyInput("Tahmini değer", item.price, { l = item.copy(price = it) })
        FormSection("Arsa sahibi")
        TextInput("Ad Soyad", item.ownerName, { l = item.copy(ownerName = it) })
        PhoneInput("Telefon", item.ownerPhone, { l = item.copy(ownerPhone = it) })
        FormSection("Notlar")
        NotesInput(item.notes, { l = item.copy(notes = it) })
    }
}

