package com.mustafa.emlaktakip.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Apartment
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.Engineering
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Landscape
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Sell
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.automirrored.filled.TrendingUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.Options
import com.mustafa.emlaktakip.data.Titles
import com.mustafa.emlaktakip.data.colorOf
import com.mustafa.emlaktakip.data.labelOf
import com.mustafa.emlaktakip.ui.components.Avatar
import com.mustafa.emlaktakip.ui.components.EmptyHint
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.components.LocalNav
import com.mustafa.emlaktakip.ui.components.RowCard
import com.mustafa.emlaktakip.ui.components.Routes
import com.mustafa.emlaktakip.ui.components.Screen
import com.mustafa.emlaktakip.ui.components.Section
import com.mustafa.emlaktakip.ui.components.SmallCallButton
import com.mustafa.emlaktakip.ui.components.TaskRow
import com.mustafa.emlaktakip.ui.components.rememberFlow
import com.mustafa.emlaktakip.util.Days
import com.mustafa.emlaktakip.util.Fmt

private data class Tile(val label: String, val icon: ImageVector, val color: Long, val count: Int?, val route: String)

@Composable
fun HomeScreen() {
    val dao = LocalDao.current
    val nav = LocalNav.current
    val open by rememberFlow("open", emptyList()) { dao.openTasks() }
    val investors by rememberFlow("inv", emptyList()) { dao.investors() }
    val listings by rememberFlow("lst", emptyList()) { dao.listings() }
    val cContractors by rememberFlow("c1", 0) { dao.countContractors() }
    val cListings by rememberFlow("c2", 0) { dao.countListings() }
    val cUnits by rememberFlow("c3", 0) { dao.countUnits() }
    val cLands by rememberFlow("c4", 0) { dao.countLands() }
    val cInvestors by rememberFlow("c5", 0) { dao.countInvestors() }
    val cContacts by rememberFlow("c6", 0) { dao.countContacts() }
    val cBuildings by rememberFlow("c7", 0) { dao.countBuildings() }

    val endToday = Days.endOfToday()
    val startToday = Days.startOfDay(System.currentTimeMillis())
    val today = open.filter { it.dueAt == null || it.dueAt < endToday }
    val overdue = open.count { it.dueAt != null && it.dueAt < startToday }
    val toCall = investors.filter { it.nextContactAt != null && it.nextContactAt < endToday }

    val tiles = listOf(
        Tile("Müteahhitler", Icons.Filled.Engineering, 0xFF0E4D64, cContractors, Routes.list(LinkType.CONTRACTOR)),
        Tile("Sahibinden İlanları", Icons.Filled.Sell, 0xFFE65100, cListings, Routes.list(LinkType.LISTING)),
        Tile("İş Karşılığı Daireler", Icons.Filled.Apartment, 0xFF6A1B9A, cUnits, Routes.list(LinkType.UNIT)),
        Tile("Kat Karşılığı Arsalar", Icons.Filled.Landscape, 0xFF2E7D32, cLands, Routes.list(LinkType.LAND)),
        Tile("Yatırımcılar", Icons.AutoMirrored.Filled.TrendingUp, 0xFFC62828, cInvestors, Routes.list(LinkType.INVESTOR)),
        Tile("Bina Görevlileri", Icons.Filled.Badge, 0xFF5D4037, cContacts, Routes.list(LinkType.CONTACT)),
        Tile("Binalar", Icons.Filled.Home, 0xFF00838F, cBuildings, Routes.list(LinkType.BUILDING)),
        Tile("Harita", Icons.Filled.Map, 0xFF1565C0, null, Routes.map()),
    )

    Screen(
        "Emlak Takip", back = false,
        actions = { IconButton(onClick = { nav.navigate("settings") }) { Icon(Icons.Filled.Settings, "Ayarlar") } },
    ) { padding ->
        Column(
            Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                modifier = Modifier.fillMaxWidth(),
            ) {
                Column(Modifier.padding(16.dp)) {
                    val now = System.currentTimeMillis()
                    Text(Fmt.date(now) + ", " + Fmt.weekday(now), style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "Bugün ${today.size} görev" +
                            (if (overdue > 0) " · $overdue gecikmiş" else "") +
                            (if (toCall.isNotEmpty()) " · ${toCall.size} yatırımcı aranacak" else ""),
                        style = MaterialTheme.typography.bodyLarge,
                    )
                }
            }

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                tiles.chunked(2).forEach { row ->
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        row.forEach { t ->
                            Card(
                                onClick = { nav.navigate(t.route) },
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLow),
                                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                                modifier = Modifier.weight(1f).height(92.dp),
                            ) {
                                Column(Modifier.padding(12.dp).fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(t.icon, null, tint = androidx.compose.ui.graphics.Color(t.color), modifier = Modifier.size(28.dp))
                                        Spacer(Modifier.weight(1f))
                                        if (t.count != null) Text(t.count.toString(), style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                                    }
                                    Text(t.label, style = MaterialTheme.typography.titleSmall, maxLines = 2)
                                }
                            }
                        }
                    }
                }
            }

            Section("Bugünkü Görevler", today.size, "Görev ekle", onAdd = { nav.navigate(Routes.task()) }) {
                if (today.isEmpty()) EmptyHint("Bugün için görev yok.")
                today.take(8).forEach { TaskRow(it) }
                if (today.size > 8) androidx.compose.material3.TextButton(onClick = { nav.navigate("tasks") }) {
                    Text("Tümünü gör (${today.size})")
                }
            }

            if (toCall.isNotEmpty()) Section("Aranacak Yatırımcılar", toCall.size) {
                toCall.forEach { inv ->
                    RowCard(
                        title = Titles.investor(inv),
                        subtitle = "Takip: " + Fmt.relative(inv.nextContactAt, withTime = false) + " · " + Fmt.budget(inv.budgetMin, inv.budgetMax),
                        onClick = { nav.navigate(Routes.detail(LinkType.INVESTOR, inv.id)) },
                        leading = { Avatar(inv.name, Options.investorTemp.colorOf(inv.temperature)) },
                        trailing = { SmallCallButton(inv.phone) },
                    )
                }
            }

            if (listings.isNotEmpty()) Section("Son İlanlar") {
                listings.take(3).forEach { l ->
                    RowCard(
                        title = Titles.listing(l),
                        subtitle = listOf(Fmt.money(l.price), l.district, l.neighborhood).filter { it.isNotBlank() }.joinToString(" · "),
                        onClick = { nav.navigate(Routes.detail(LinkType.LISTING, l.id)) },
                        pill = Options.listingStatus.labelOf(l.status) to Options.listingStatus.colorOf(l.status),
                    )
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}
