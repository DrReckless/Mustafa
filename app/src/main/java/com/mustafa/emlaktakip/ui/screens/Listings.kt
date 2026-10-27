@file:Suppress("DEPRECATION")

package com.mustafa.emlaktakip.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentPaste
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.Listing
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
import com.mustafa.emlaktakip.ui.components.InterestedInvestors
import com.mustafa.emlaktakip.ui.components.IntInput
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
import com.mustafa.emlaktakip.util.Act
import com.mustafa.emlaktakip.util.Fmt
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

fun listingSubtitle(l: Listing) = listOf(
    Fmt.money(l.price), l.rooms, Fmt.sqm(l.sqm), listOf(l.district, l.neighborhood).filter { it.isNotBlank() }.joinToString("/"),
).filter { it.isNotBlank() }.joinToString(" · ")

@Composable
fun ListingList() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val items by rememberFlow("all", emptyList()) { dao.listings() }
    ListScaffold(
        title = "Sahibinden İlanları",
        addText = "İlan",
        onAdd = { nav.navigate(Routes.edit(LinkType.LISTING)) },
        items = items,
        key = { it.id },
        searchText = { "${it.title} ${it.listingNo} ${it.district} ${it.neighborhood} ${it.ownerName} ${it.ownerPhone} ${it.rooms} ${it.notes}" },
        emptyText = "Sahibinden.com'da gördüğünüz ilanları buraya ekleyin. İlan linkini yapıştırabilirsiniz.",
        filters = Options.listingStatus,
        filterKey = { it.status },
    ) { l ->
        RowCard(
            title = Titles.listing(l),
            subtitle = listingSubtitle(l) + (if (l.ownerName.isNotBlank()) "\n${l.ownerName} (${l.ownerType})" else ""),
            onClick = { nav.navigate(Routes.detail(LinkType.LISTING, l.id)) },
            pill = Options.listingStatus.labelOf(l.status) to Options.listingStatus.colorOf(l.status),
        )
    }
}

@Composable
fun ListingDetail(id: Long) {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()
    val l by rememberFlow(id, null) { dao.listing(id) }

    Screen(
        "İlan",
        actions = {
            l?.let { item ->
                IconButton(onClick = {
                    Act.shareText(ctx, listOf(Titles.listing(item), listingSubtitle(item), item.url).filter { it.isNotBlank() }.joinToString("\n"))
                }) { Icon(Icons.Filled.Share, "Paylaş") }
            }
            EditDeleteActions(
                onEdit = { nav.navigate(Routes.edit(LinkType.LISTING, id)) },
                onDelete = { l?.let { scope.launch(Dispatchers.Main.immediate) { dao.deleteListingFull(it); nav.popBackStack() } } },
            )
        },
    ) { padding ->
        val item = l ?: return@Screen LoadingBox(padding)
        DetailColumn(padding) {
            HeaderCard(
                Titles.listing(item), Fmt.money(item.price),
                pill = Options.listingStatus.labelOf(item.status) to Options.listingStatus.colorOf(item.status),
            ) {
                if (item.url.isNotBlank()) FilledTonalButton(onClick = { Act.openUrl(ctx, item.url) }) {
                    Icon(Icons.Filled.OpenInBrowser, null); Text("  İlanı aç")
                }
            }
            // Hızlı durum değişikliği
            InfoCard {
                ChoiceChips("Durum", Options.listingStatus, item.status) { s ->
                    scope.launch(Dispatchers.Main.immediate) { dao.update(item.copy(status = s, updatedAt = System.currentTimeMillis())) }
                }
            }
            InfoCard {
                InfoRow("İlan No", item.listingNo)
                InfoRow("Tür", "${Options.listingType.labelOf(item.listingType)} ${item.propertyType}")
                InfoRow("Oda", item.rooms)
                InfoRow("Brüt m²", Fmt.sqm(item.sqm))
                InfoRow("Kat", item.floor)
                InfoRow("Bina yaşı", item.buildingAge)
                InfoRow("İlçe / Mahalle", listOf(item.district, item.neighborhood).filter { it.isNotBlank() }.joinToString(" / "))
                InfoRow("Adres", item.address)
                LinkRow("Bina", LinkType.BUILDING, item.buildingId)
                InfoRow("Eklenme", Fmt.date(item.createdAt))
            }
            if (item.ownerName.isNotBlank() || item.ownerPhone.isNotBlank()) InfoCard {
                Text("İlan Sahibi (${item.ownerType})")
                InfoRow("Ad", item.ownerName)
                InfoRow("Telefon", item.ownerPhone)
                PhoneActions(item.ownerPhone)
            }
            NotesCard(item.notes)
            InterestedInvestors(LinkType.LISTING, id)
            LinkedTasks(LinkType.LISTING, id)
        }
    }
}

@Composable
fun ListingEdit(id: Long, buildingId: Long?) {
    val dao = LocalDao.current
    val clipboard = LocalClipboardManager.current
    var l by remember { mutableStateOf<Listing?>(if (id == 0L) Listing(buildingId = buildingId) else null) }
    LaunchedEffect(id) { if (id > 0) l = dao.getListing(id) }

    EditScaffold(
        title = if (id == 0L) "Yeni İlan" else "İlanı Düzenle",
        loaded = l != null,
        onSave = {
            val item = l!!
            if (item.id == 0L) dao.insert(item) else dao.update(item.copy(updatedAt = System.currentTimeMillis()))
            true
        },
    ) {
        val item = l ?: return@EditScaffold
        OutlinedTextField(
            value = item.url,
            onValueChange = { l = item.copy(url = it, listingNo = item.listingNo.ifBlank { listingNoFromUrl(it) }) },
            label = { Text("İlan linki (sahibinden.com)") },
            singleLine = true,
            trailingIcon = {
                IconButton(onClick = {
                    val text = clipboard.getText()?.text?.trim().orEmpty()
                    if (text.isNotBlank()) l = item.copy(url = text, listingNo = item.listingNo.ifBlank { listingNoFromUrl(text) })
                }) { Icon(Icons.Filled.ContentPaste, "Yapıştır") }
            },
            modifier = Modifier.fillMaxWidth(),
        )
        TextInput("Başlık", item.title, { l = item.copy(title = it) }, placeholder = "ör. Moda'da deniz manzaralı 3+1")
        TextInput("İlan No", item.listingNo, { l = item.copy(listingNo = it) }, keyboard = KeyboardType.Number)
        ChoiceChips("Durum", Options.listingStatus, item.status) { l = item.copy(status = it) }
        ChoiceChips("İlan tipi", Options.listingType, item.listingType) { l = item.copy(listingType = it) }
        ChoiceChips("Emlak tipi", Options.propertyType, item.propertyType) { l = item.copy(propertyType = it) }
        MoneyInput("Fiyat", item.price, { l = item.copy(price = it) })
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TextInput("Oda", item.rooms, { l = item.copy(rooms = it) }, Modifier.weight(1f), placeholder = "3+1")
            IntInput("Brüt m²", item.sqm, { l = item.copy(sqm = it) }, Modifier.weight(1f))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TextInput("Kat", item.floor, { l = item.copy(floor = it) }, Modifier.weight(1f))
            TextInput("Bina yaşı", item.buildingAge, { l = item.copy(buildingAge = it) }, Modifier.weight(1f))
        }
        FormSection("Konum")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TextInput("İlçe", item.district, { l = item.copy(district = it) }, Modifier.weight(1f))
            TextInput("Mahalle", item.neighborhood, { l = item.copy(neighborhood = it) }, Modifier.weight(1f))
        }
        TextInput("Adres", item.address, { l = item.copy(address = it) }, lines = 2)
        RecordPicker("Bina (haritadaki)", LinkType.BUILDING, item.buildingId) { l = item.copy(buildingId = it) }
        FormSection("İlan Sahibi")
        ChoiceChips(null, Options.ownerType, item.ownerType) { l = item.copy(ownerType = it) }
        TextInput("Ad Soyad", item.ownerName, { l = item.copy(ownerName = it) })
        PhoneInput("Telefon", item.ownerPhone, { l = item.copy(ownerPhone = it) })
        FormSection("Notlar")
        NotesInput(item.notes, { l = item.copy(notes = it) }, "Görüşme notları, pazarlık payı, eksikler…")
    }
}

/** sahibinden.com/ilan/...-1234567890/detay -> 1234567890 */
fun listingNoFromUrl(url: String): String =
    Regex("(\\d{8,12})").findAll(url).lastOrNull()?.value ?: ""

