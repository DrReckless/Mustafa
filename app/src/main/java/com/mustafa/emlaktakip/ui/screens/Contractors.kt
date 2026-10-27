package com.mustafa.emlaktakip.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Apartment
import androidx.compose.material.icons.filled.Landscape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.mustafa.emlaktakip.data.Contractor
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.Options
import com.mustafa.emlaktakip.data.Titles
import com.mustafa.emlaktakip.data.colorOf
import com.mustafa.emlaktakip.data.labelOf
import com.mustafa.emlaktakip.ui.components.Avatar
import com.mustafa.emlaktakip.ui.components.DetailColumn
import com.mustafa.emlaktakip.ui.components.EditDeleteActions
import com.mustafa.emlaktakip.ui.components.EmptyHint
import com.mustafa.emlaktakip.ui.components.FormSection
import com.mustafa.emlaktakip.ui.components.HeaderCard
import com.mustafa.emlaktakip.ui.components.IconAvatar
import com.mustafa.emlaktakip.ui.components.InfoCard
import com.mustafa.emlaktakip.ui.components.InfoRow
import com.mustafa.emlaktakip.ui.components.LinkedTasks
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.components.LocalNav
import com.mustafa.emlaktakip.ui.components.NotesCard
import com.mustafa.emlaktakip.ui.components.NotesInput
import com.mustafa.emlaktakip.ui.components.PhoneActions
import com.mustafa.emlaktakip.ui.components.PhoneInput
import com.mustafa.emlaktakip.ui.components.RatingInput
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

private fun stars(n: Int) = if (n <= 0) "" else "★".repeat(n) + "☆".repeat(5 - n)

@Composable
fun ContractorList() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val items by rememberFlow("all", emptyList()) { dao.contractors() }
    ListScaffold(
        title = "Müteahhitler",
        addText = "Müteahhit",
        onAdd = { nav.navigate(Routes.edit(LinkType.CONTRACTOR)) },
        items = items,
        key = { it.id },
        searchText = { "${it.name} ${it.company} ${it.phone} ${it.region} ${it.notes}" },
        emptyText = "Henüz müteahhit eklenmedi. Tanıştığınız müteahhitleri buraya kaydedin.",
    ) { c ->
        RowCard(
            title = Titles.contractor(c),
            subtitle = listOf(c.company, c.region, stars(c.rating)).filter { it.isNotBlank() }.joinToString(" · "),
            onClick = { nav.navigate(Routes.detail(LinkType.CONTRACTOR, c.id)) },
            leading = { Avatar(c.name.ifBlank { c.company }) },
            trailing = { SmallCallButton(c.phone) },
        )
    }
}

@Composable
fun ContractorDetail(id: Long) {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    val c by rememberFlow(id, null) { dao.contractor(id) }
    val units by rememberFlow(id, emptyList()) { dao.unitsByContractor(id) }
    val lands by rememberFlow(id, emptyList()) { dao.landsByContractor(id) }

    Screen(
        "Müteahhit",
        actions = {
            EditDeleteActions(
                onEdit = { nav.navigate(Routes.edit(LinkType.CONTRACTOR, id)) },
                onDelete = { c?.let { scope.launch(Dispatchers.Main.immediate) { dao.deleteContractorFull(it); nav.popBackStack() } } },
            )
        },
    ) { padding ->
        val item = c ?: return@Screen LoadingBox(padding)
        DetailColumn(padding) {
            HeaderCard(Titles.contractor(item), item.company) {
                if (item.rating > 0) Text(stars(item.rating))
                PhoneActions(item.phone)
            }
            InfoCard {
                InfoRow("Telefon", item.phone, onClick = { Act.call(ctx, item.phone) })
                InfoRow("Telefon 2", item.phone2, onClick = { Act.call(ctx, item.phone2) })
                InfoRow("E-posta", item.email, onClick = { Act.email(ctx, item.email) })
                InfoRow("Çalıştığı bölge", item.region)
                InfoRow("Adres", item.address)
                InfoRow("Kayıt tarihi", Fmt.date(item.createdAt))
            }
            NotesCard(item.notes)

            Section("İş Karşılığı Daireler", units.size, "Daire ekle", onAdd = {
                nav.navigate(Routes.edit(LinkType.UNIT, 0, "&contractorId=$id"))
            }) {
                if (units.isEmpty()) EmptyHint("Bu müteahhitten iş karşılığı daire kaydı yok.")
                units.forEach { u ->
                    RowCard(
                        title = Titles.unit(u),
                        subtitle = listOf(u.rooms, Fmt.sqm(u.sqm), Fmt.money(u.price)).filter { it.isNotBlank() }.joinToString(" · "),
                        onClick = { nav.navigate(Routes.detail(LinkType.UNIT, u.id)) },
                        leading = { IconAvatar(Icons.Filled.Apartment, 0xFF6A1B9A) },
                        pill = Options.unitStatus.labelOf(u.status) to Options.unitStatus.colorOf(u.status),
                    )
                }
            }
            Section("Kat Karşılığı Arsalar", lands.size, "Arsa ekle", onAdd = {
                nav.navigate(Routes.edit(LinkType.LAND, 0, "&contractorId=$id"))
            }) {
                if (lands.isEmpty()) EmptyHint("Bu müteahhitle ilgili arsa kaydı yok.")
                lands.forEach { l ->
                    RowCard(
                        title = Titles.land(l),
                        subtitle = listOf(l.ownerName, Fmt.sqm(l.sqm), l.zoning).filter { it.isNotBlank() }.joinToString(" · "),
                        onClick = { nav.navigate(Routes.detail(LinkType.LAND, l.id)) },
                        leading = { IconAvatar(Icons.Filled.Landscape, 0xFF2E7D32) },
                        pill = Options.landStatus.labelOf(l.status) to Options.landStatus.colorOf(l.status),
                    )
                }
            }
            LinkedTasks(LinkType.CONTRACTOR, id)
        }
    }
}

@Composable
fun ContractorEdit(id: Long) {
    val dao = LocalDao.current
    val required = requireText()
    var c by remember { mutableStateOf<Contractor?>(if (id == 0L) Contractor() else null) }
    LaunchedEffect(id) { if (id > 0) c = dao.getContractor(id) }

    EditScaffold(
        title = if (id == 0L) "Yeni Müteahhit" else "Müteahhidi Düzenle",
        loaded = c != null,
        onSave = {
            val item = c!!
            if (!required(item.name + item.company, "Ad veya firma adı girin")) false
            else {
                if (item.id == 0L) dao.insert(item) else dao.update(item.copy(updatedAt = System.currentTimeMillis()))
                true
            }
        },
    ) {
        val item = c ?: return@EditScaffold
        TextInput("Ad Soyad", item.name, { c = item.copy(name = it) })
        TextInput("Firma", item.company, { c = item.copy(company = it) })
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            PhoneInput("Telefon", item.phone, { c = item.copy(phone = it) }, Modifier.weight(1f))
            PhoneInput("Telefon 2", item.phone2, { c = item.copy(phone2 = it) }, Modifier.weight(1f))
        }
        TextInput("E-posta", item.email, { c = item.copy(email = it) }, keyboard = KeyboardType.Email)
        TextInput("Çalıştığı bölge", item.region, { c = item.copy(region = it) }, placeholder = "ör. Kadıköy, Ataşehir")
        TextInput("Adres / Ofis", item.address, { c = item.copy(address = it) }, lines = 2)
        RatingInput(item.rating) { c = item.copy(rating = it) }
        FormSection("Notlar")
        NotesInput(item.notes, { c = item.copy(notes = it) }, "Nasıl tanıştınız, çalışma şekli, projeleri…")
        Row(Modifier.fillMaxWidth()) {}
    }
}
