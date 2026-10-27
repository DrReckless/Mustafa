package com.mustafa.emlaktakip.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Apartment
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Landscape
import androidx.compose.material.icons.filled.PhoneInTalk
import androidx.compose.material.icons.filled.Sell
import androidx.compose.material3.AssistChip
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.mustafa.emlaktakip.data.BuildingContact
import com.mustafa.emlaktakip.data.Investor
import com.mustafa.emlaktakip.data.InvestorInterest
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.Options
import com.mustafa.emlaktakip.data.PickItem
import com.mustafa.emlaktakip.data.Titles
import com.mustafa.emlaktakip.data.colorOf
import com.mustafa.emlaktakip.data.labelOf
import com.mustafa.emlaktakip.data.linkTitle
import com.mustafa.emlaktakip.data.pickItems
import com.mustafa.emlaktakip.ui.components.Avatar
import com.mustafa.emlaktakip.ui.components.ChoiceChips
import com.mustafa.emlaktakip.ui.components.DateTimeInput
import com.mustafa.emlaktakip.ui.components.DetailColumn
import com.mustafa.emlaktakip.ui.components.EditDeleteActions
import com.mustafa.emlaktakip.ui.components.EmptyHint
import com.mustafa.emlaktakip.ui.components.FormSection
import com.mustafa.emlaktakip.ui.components.HeaderCard
import com.mustafa.emlaktakip.ui.components.IconAvatar
import com.mustafa.emlaktakip.ui.components.InfoCard
import com.mustafa.emlaktakip.ui.components.InfoRow
import com.mustafa.emlaktakip.ui.components.LinkRow
import com.mustafa.emlaktakip.ui.components.LinkedTasks
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.components.LocalNav
import com.mustafa.emlaktakip.ui.components.MoneyInput
import com.mustafa.emlaktakip.ui.components.NotesCard
import com.mustafa.emlaktakip.ui.components.NotesInput
import com.mustafa.emlaktakip.ui.components.PhoneActions
import com.mustafa.emlaktakip.ui.components.PhoneInput
import com.mustafa.emlaktakip.ui.components.PickDialog
import com.mustafa.emlaktakip.ui.components.RecordPicker
import com.mustafa.emlaktakip.ui.components.RowCard
import com.mustafa.emlaktakip.ui.components.Routes
import com.mustafa.emlaktakip.ui.components.Screen
import com.mustafa.emlaktakip.ui.components.Section
import com.mustafa.emlaktakip.ui.components.SmallCallButton
import com.mustafa.emlaktakip.ui.components.TextInput
import com.mustafa.emlaktakip.ui.components.rememberFlow
import com.mustafa.emlaktakip.util.Act
import com.mustafa.emlaktakip.util.Days
import com.mustafa.emlaktakip.util.Fmt
import com.mustafa.emlaktakip.util.norm
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

// =============================================================== Yatırımcılar

@Composable
fun InvestorList() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val items by rememberFlow("all", emptyList()) { dao.investors() }
    ListScaffold(
        title = "Yatırımcı Müşteriler",
        addText = "Yatırımcı",
        onAdd = { nav.navigate(Routes.edit(LinkType.INVESTOR)) },
        items = items,
        key = { it.id },
        searchText = { "${it.name} ${it.phone} ${it.regions} ${it.propertyTypes} ${it.profession} ${it.notes}" },
        emptyText = "Tanıştığınız yatırımcı müşterileri buraya ekleyin; bütçelerini ve takip tarihlerini izleyin.",
        filters = Options.investorTemp,
        filterKey = { it.temperature },
    ) { inv ->
        val next = inv.nextContactAt?.let {
            (if (it < Days.endOfToday()) "⚠ " else "") + "Takip: " + Fmt.relative(it, withTime = false)
        }
        RowCard(
            title = Titles.investor(inv),
            subtitle = listOfNotNull(
                Fmt.budget(inv.budgetMin, inv.budgetMax).ifBlank { null },
                inv.regions.ifBlank { null },
                next,
            ).joinToString(" · "),
            onClick = { nav.navigate(Routes.detail(LinkType.INVESTOR, inv.id)) },
            leading = { Avatar(inv.name, Options.investorTemp.colorOf(inv.temperature)) },
            trailing = { SmallCallButton(inv.phone) },
        )
    }
}

private fun inBudget(price: Long?, inv: Investor): Boolean {
    if (price == null) return false
    if (inv.budgetMin == null && inv.budgetMax == null) return false
    // %10 esneklik
    val min = inv.budgetMin?.let { it * 9 / 10 } ?: 0
    val max = inv.budgetMax?.let { it * 11 / 10 } ?: Long.MAX_VALUE
    return price in min..max
}

private fun regionMatch(text: String, inv: Investor): Boolean {
    val regions = inv.regions.split(',', ';', '/').map { it.trim().norm() }.filter { it.isNotEmpty() }
    if (regions.isEmpty()) return true
    val t = text.norm()
    return regions.any { t.contains(it) }
}

@Composable
fun InvestorDetail(id: Long) {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    val inv by rememberFlow(id, null) { dao.investor(id) }
    val interests by rememberFlow(id, emptyList()) { dao.interestsByInvestor(id) }
    val listings by rememberFlow("l", emptyList()) { dao.listings() }
    val units by rememberFlow("u", emptyList()) { dao.units() }
    var addType by remember { mutableStateOf<LinkType?>(null) }

    Screen(
        "Yatırımcı",
        actions = {
            EditDeleteActions(
                onEdit = { nav.navigate(Routes.edit(LinkType.INVESTOR, id)) },
                onDelete = { inv?.let { scope.launch(Dispatchers.Main.immediate) { dao.deleteInvestorFull(it); nav.popBackStack() } } },
            )
        },
    ) { padding ->
        val item = inv ?: return@Screen LoadingBox(padding)
        DetailColumn(padding) {
            HeaderCard(
                Titles.investor(item), Fmt.budget(item.budgetMin, item.budgetMax),
                pill = Options.investorTemp.labelOf(item.temperature) to Options.investorTemp.colorOf(item.temperature),
            ) {
                PhoneActions(item.phone)
                FilledTonalButton(onClick = {
                    scope.launch(Dispatchers.Main.immediate) { dao.update(item.copy(lastContactAt = System.currentTimeMillis(), updatedAt = System.currentTimeMillis())) }
                    Act.toast(ctx, "Son görüşme bugün olarak kaydedildi")
                }) { Icon(Icons.Filled.PhoneInTalk, null); Text("  Bugün görüştüm") }
            }
            InfoCard {
                ChoiceChips("İlgi durumu", Options.investorTemp, item.temperature) { t ->
                    scope.launch(Dispatchers.Main.immediate) { dao.update(item.copy(temperature = t)) }
                }
            }
            InfoCard {
                InfoRow("Telefon", item.phone, onClick = { Act.call(ctx, item.phone) })
                InfoRow("E-posta", item.email, onClick = { Act.email(ctx, item.email) })
                InfoRow("Meslek", item.profession)
                InfoRow("Aradığı", item.propertyTypes)
                InfoRow("Bölgeler", item.regions)
                InfoRow("Son görüşme", Fmt.date(item.lastContactAt))
                InfoRow("Sonraki takip", Fmt.date(item.nextContactAt))
            }
            NotesCard(item.notes)

            Section("İlgilendiği Portföyler", interests.size) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    LinkType.portfolio.forEach { t ->
                        AssistChip(
                            onClick = { addType = t },
                            label = { Text(when (t) { LinkType.UNIT -> "Daire"; LinkType.LAND -> "Arsa"; else -> "İlan" }) },
                            leadingIcon = { Icon(Icons.Filled.Add, null) },
                        )
                    }
                }
                if (interests.isEmpty()) EmptyHint("İlan, daire veya arsa önerdikçe buraya ekleyin.")
                interests.forEach { InterestRow(it) }
            }

            val linked = interests.map { it.itemType to it.itemId }.toSet()
            val suggestions = buildList {
                listings.filter { it.status != "PASIF" && (LinkType.LISTING.name to it.id) !in linked && inBudget(it.price, item) && regionMatch("${it.district} ${it.neighborhood} ${it.address}", item) }
                    .forEach { add(Titles.pick(it)) }
                units.filter { it.status != "SATILDI" && (LinkType.UNIT.name to it.id) !in linked && inBudget(it.price, item) && regionMatch("${it.district} ${it.neighborhood} ${it.address} ${it.projectName}", item) }
                    .forEach { add(Titles.pick(it)) }
            }
            if (suggestions.isNotEmpty()) Section("Bütçesine Uygun Portföyler", suggestions.size) {
                suggestions.take(10).forEach { p ->
                    RowCard(
                        title = p.title, subtitle = p.type.label + " · " + p.subtitle,
                        onClick = { nav.navigate(Routes.detail(p.type, p.id)) },
                        trailing = {
                            TextButton(onClick = {
                                scope.launch(Dispatchers.Main.immediate) { dao.insert(InvestorInterest(investorId = id, itemType = p.type.name, itemId = p.id)) }
                            }) { Text("Öner") }
                        },
                    )
                }
            }
            LinkedTasks(LinkType.INVESTOR, id)
        }
    }

    addType?.let { type ->
        val items by rememberFlow(type, emptyList<PickItem>()) { dao.pickItems(type) }
        PickDialog("${type.label} seçin", items, onPick = { p ->
            addType = null
            scope.launch(Dispatchers.Main.immediate) {
                if (dao.interestCount(id, type.name, p.id) == 0) dao.insert(InvestorInterest(investorId = id, itemType = type.name, itemId = p.id))
            }
        }, onDismiss = { addType = null })
    }
}

@Composable
private fun InterestRow(ii: InvestorInterest) {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val scope = rememberCoroutineScope()
    val type = LinkType.of(ii.itemType) ?: return
    val title by produceState<String?>(null, ii.id) { value = dao.linkTitle(type, ii.itemId) }
    val icon = when (type) {
        LinkType.UNIT -> Icons.Filled.Apartment
        LinkType.LAND -> Icons.Filled.Landscape
        else -> Icons.Filled.Sell
    }
    RowCard(
        title = title ?: "(silinmiş kayıt)",
        subtitle = type.label + " · " + Fmt.dateShort(ii.createdAt) + " tarihinde eklendi",
        onClick = { nav.navigate(Routes.detail(type, ii.itemId)) },
        leading = { IconAvatar(icon, 0xFF0E4D64) },
        trailing = {
            IconButton(onClick = { scope.launch(Dispatchers.Main.immediate) { dao.deleteInterest(ii.investorId, ii.itemType, ii.itemId) } }) {
                Icon(Icons.Filled.Close, "Kaldır")
            }
        },
    )
}

@Composable
fun InvestorEdit(id: Long) {
    val dao = LocalDao.current
    val required = requireText()
    var i by remember { mutableStateOf<Investor?>(if (id == 0L) Investor() else null) }
    LaunchedEffect(id) { if (id > 0) i = dao.getInvestor(id) }

    EditScaffold(
        title = if (id == 0L) "Yeni Yatırımcı" else "Yatırımcıyı Düzenle",
        loaded = i != null,
        onSave = {
            val item = i!!
            if (!required(item.name, "Ad girin")) false
            else {
                if (item.id == 0L) dao.insert(item) else dao.update(item.copy(updatedAt = System.currentTimeMillis()))
                true
            }
        },
    ) {
        val item = i ?: return@EditScaffold
        TextInput("Ad Soyad", item.name, { i = item.copy(name = it) })
        PhoneInput("Telefon", item.phone, { i = item.copy(phone = it) })
        TextInput("E-posta", item.email, { i = item.copy(email = it) }, keyboard = KeyboardType.Email)
        TextInput("Meslek / Şirket", item.profession, { i = item.copy(profession = it) })
        ChoiceChips("İlgi durumu", Options.investorTemp, item.temperature) { i = item.copy(temperature = it) }
        FormSection("Aradığı")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            MoneyInput("En az bütçe", item.budgetMin, { i = item.copy(budgetMin = it) }, Modifier.weight(1f))
            MoneyInput("En fazla bütçe", item.budgetMax, { i = item.copy(budgetMax = it) }, Modifier.weight(1f))
        }
        TextInput("Mülk tipi", item.propertyTypes, { i = item.copy(propertyTypes = it) }, placeholder = "ör. 2+1 daire, arsa, dükkan")
        TextInput("Bölgeler (virgülle)", item.regions, { i = item.copy(regions = it) }, placeholder = "ör. Kadıköy, Maltepe")
        FormSection("Takip")
        DateTimeInput("Son görüşme", item.lastContactAt, { i = item.copy(lastContactAt = it) }, withTime = false)
        DateTimeInput("Sonraki takip", item.nextContactAt, { i = item.copy(nextContactAt = it) }, withTime = false)
        FormSection("Notlar")
        NotesInput(item.notes, { i = item.copy(notes = it) }, "Beklentileri, aile durumu, tercihleri…")
    }
}

// =============================================================== Bina görevlileri

@Composable
fun ContactList() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val items by rememberFlow("all", emptyList()) { dao.contacts() }
    val buildings by rememberFlow("b", emptyList()) { dao.buildings() }
    val names = buildings.associate { it.id to Titles.building(it) }
    ListScaffold(
        title = "Bina Görevlileri",
        addText = "Kişi",
        onAdd = { nav.navigate(Routes.edit(LinkType.CONTACT)) },
        items = items,
        key = { it.id },
        searchText = { "${it.name} ${it.phone} ${it.buildingName} ${names[it.buildingId] ?: ""} ${Options.contactRole.labelOf(it.role)} ${it.notes}" },
        emptyText = "Binalarda tanıştığınız güvenlik, kapıcı ve yöneticileri buraya kaydedin.",
        filters = Options.contactRole,
        filterKey = { it.role },
    ) { c ->
        RowCard(
            title = Titles.contact(c),
            subtitle = listOf(names[c.buildingId] ?: c.buildingName, c.phone).filter { it.isNotBlank() }.joinToString(" · "),
            onClick = { nav.navigate(Routes.detail(LinkType.CONTACT, c.id)) },
            leading = { Avatar(c.name, Options.contactRole.colorOf(c.role)) },
            pill = Options.contactRole.labelOf(c.role) to Options.contactRole.colorOf(c.role),
            trailing = { SmallCallButton(c.phone) },
        )
    }
}

@Composable
fun ContactDetail(id: Long) {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val scope = rememberCoroutineScope()
    val c by rememberFlow(id, null) { dao.contact(id) }
    Screen(
        "Bina Görevlisi",
        actions = {
            EditDeleteActions(
                onEdit = { nav.navigate(Routes.edit(LinkType.CONTACT, id)) },
                onDelete = { c?.let { scope.launch(Dispatchers.Main.immediate) { dao.deleteContactFull(it); nav.popBackStack() } } },
            )
        },
    ) { padding ->
        val item = c ?: return@Screen LoadingBox(padding)
        DetailColumn(padding) {
            HeaderCard(
                Titles.contact(item), item.phone,
                pill = Options.contactRole.labelOf(item.role) to Options.contactRole.colorOf(item.role),
            ) { PhoneActions(item.phone) }
            InfoCard {
                LinkRow("Bina", LinkType.BUILDING, item.buildingId)
                if (item.buildingId == null) InfoRow("Bina", item.buildingName)
                InfoRow("Çalışma saatleri", item.workHours)
                InfoRow("Kayıt tarihi", Fmt.date(item.createdAt))
            }
            NotesCard(item.notes)
            LinkedTasks(LinkType.CONTACT, id)
        }
    }
}

@Composable
fun ContactEdit(id: Long, buildingId: Long?) {
    val dao = LocalDao.current
    val required = requireText()
    var c by remember { mutableStateOf<BuildingContact?>(if (id == 0L) BuildingContact(buildingId = buildingId) else null) }
    LaunchedEffect(id) { if (id > 0) c = dao.getContact(id) }

    EditScaffold(
        title = if (id == 0L) "Yeni Bina Görevlisi" else "Kişiyi Düzenle",
        loaded = c != null,
        onSave = {
            val item = c!!
            if (!required(item.name + item.phone, "Ad veya telefon girin")) false
            else {
                // Bina adını da sakla (bina silinse bile kaybolmasın)
                val bName = item.buildingId?.let { dao.getBuilding(it)?.let(Titles::building) } ?: item.buildingName
                val toSave = item.copy(buildingName = bName, updatedAt = System.currentTimeMillis())
                if (item.id == 0L) dao.insert(toSave) else dao.update(toSave)
                true
            }
        },
    ) {
        val item = c ?: return@EditScaffold
        ChoiceChips("Görevi", Options.contactRole, item.role) { c = item.copy(role = it) }
        TextInput("Ad Soyad", item.name, { c = item.copy(name = it) })
        PhoneInput("Telefon", item.phone, { c = item.copy(phone = it) })
        FormSection("Bina")
        RecordPicker("Haritadaki bina", LinkType.BUILDING, item.buildingId) { c = item.copy(buildingId = it) }
        if (item.buildingId == null) TextInput("Bina adı / adresi", item.buildingName, { c = item.copy(buildingName = it) })
        TextInput("Çalışma saatleri", item.workHours, { c = item.copy(workHours = it) }, placeholder = "ör. Hafta içi 08-18")
        FormSection("Notlar")
        NotesInput(item.notes, { c = item.copy(notes = it) }, "Binadaki boş/satılık daireler, kat malikleri, ilişki…")
    }
}
