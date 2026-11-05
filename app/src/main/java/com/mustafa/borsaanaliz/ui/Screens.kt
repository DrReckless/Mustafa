package com.mustafa.borsaanaliz.ui

import android.content.Intent
import android.net.Uri
import androidx.activity.compose.BackHandler
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mustafa.borsaanaliz.analysis.Analysis
import com.mustafa.borsaanaliz.analysis.Indicators
import com.mustafa.borsaanaliz.analysis.Sentiment
import com.mustafa.borsaanaliz.data.AssetType
import com.mustafa.borsaanaliz.data.Instrument
import com.mustafa.borsaanaliz.data.NewsItem
import com.mustafa.borsaanaliz.data.Position
import com.mustafa.borsaanaliz.data.PriceAlarm
import com.mustafa.borsaanaliz.data.Settings
import com.mustafa.borsaanaliz.data.Universe
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

private enum class Tab(val title: String) { MARKET("Piyasa"), SIGNALS("Sinyaller"), PORTFOLIO("Portföy"), NEWS("Haberler"), SETTINGS("Ayarlar") }

private const val DISCLAIMER = "Bu uygulamadaki analizler otomatik hesaplanan göstergelere dayanır ve yatırım tavsiyesi değildir. " +
    "Nihai karar ve sorumluluk kullanıcıya aittir."

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppRoot(vm: MainViewModel) {
    val st by vm.state.collectAsState()
    val detail by vm.detail.collectAsState()
    var tab by remember { mutableIntStateOf(0) }

    detail?.let { d ->
        BackHandler { vm.closeDetail() }
        DetailScreen(d, onBack = vm::closeDetail, onAlarm = vm::addAlarm)
        return
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Borsa Analiz", fontWeight = FontWeight.Bold)
                        if (st.lastUpdate > 0) Text("Güncelleme " + timeStr(st.lastUpdate), fontSize = 11.sp, color = Palette.Gray)
                    }
                },
                actions = {
                    IconButton(onClick = { vm.refresh(true) }) { Icon(Icons.Filled.Refresh, "Yenile") }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Palette.Anthracite, titleContentColor = Palette.BeigeLight, actionIconContentColor = Palette.Beige,
                ),
            )
        },
        bottomBar = {
            NavigationBar(containerColor = Palette.Anthracite) {
                Tab.entries.forEachIndexed { i, t ->
                    NavigationBarItem(
                        selected = tab == i, onClick = { tab = i },
                        icon = {
                            Icon(
                                when (t) {
                                    Tab.MARKET -> Icons.Filled.Home
                                    Tab.SIGNALS -> Icons.Filled.Star
                                    Tab.PORTFOLIO -> Icons.Filled.ShoppingCart
                                    Tab.NEWS -> Icons.AutoMirrored.Filled.List
                                    Tab.SETTINGS -> Icons.Filled.Settings
                                }, t.title
                            )
                        },
                        label = { Text(t.title, fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Palette.Anthracite, indicatorColor = Palette.Beige,
                            selectedTextColor = Palette.Beige, unselectedIconColor = Palette.GrayLight, unselectedTextColor = Palette.Gray,
                        ),
                    )
                }
            }
        },
    ) { pad ->
        Column(Modifier.padding(pad).fillMaxSize()) {
            if (st.loading) LinearProgressIndicator(Modifier.fillMaxWidth(), color = Palette.Beige, trackColor = Palette.AnthraciteLight)
            st.error?.let { Text(it, color = Palette.Down, modifier = Modifier.padding(12.dp)) }
            when (Tab.entries[tab]) {
                Tab.MARKET -> MarketScreen(st, vm)
                Tab.SIGNALS -> SignalsScreen(st, vm)
                Tab.PORTFOLIO -> PortfolioScreen(st, vm)
                Tab.NEWS -> NewsScreen(st.news, st.marketRisk?.newsSentiment)
                Tab.SETTINGS -> SettingsScreen(st, vm)
            }
        }
    }
}

private fun timeStr(t: Long) = SimpleDateFormat("HH:mm", Locale("tr")).format(Date(t))
private fun dateTimeStr(t: Long) = if (t <= 0) "" else SimpleDateFormat("d MMM HH:mm", Locale("tr")).format(Date(t))

// ---------------- Piyasa ----------------

@Composable
private fun MarketScreen(st: UiState, vm: MainViewModel) {
    LazyColumn(contentPadding = PaddingValues(vertical = 6.dp)) {
        st.marketRisk?.let { mr ->
            item {
                SectionCard("Piyasa Risk Analizi") {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Risk: ", style = MaterialTheme.typography.titleMedium)
                        Text(mr.level.label, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = riskColor(mr.level))
                    }
                    Spacer(Modifier.height(6.dp))
                    RiskMeter(mr.score, mr.level)
                    Spacer(Modifier.height(8.dp))
                    mr.reasons.forEach { Text("• $it", style = MaterialTheme.typography.bodySmall) }
                }
            }
        }
        if (st.scan.isNotEmpty()) {
            item {
                SectionCard("Günün Öne Çıkanları (${st.scan.size} hisse tarandı, ${timeStr(st.lastScan)})") {
                    val best = st.scan.take(5)
                    val worst = st.scan.takeLast(5).reversed().filter { it !in best }
                    val buys = st.scan.count { it.signal.isBuy }; val sells = st.scan.count { it.signal.isSell }
                    Text("AL: $buys  ·  TUT: ${st.scan.size - buys - sells}  ·  SAT: $sells", fontSize = 12.sp, color = Palette.Gray)
                    Spacer(Modifier.height(6.dp))
                    Text("En güçlü sinyaller", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                    best.forEach { MiniRow(it) { vm.openDetail(it.quote.instrument) } }
                    if (worst.isNotEmpty()) {
                        Spacer(Modifier.height(6.dp))
                        Text("En zayıf görünüm", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                        worst.forEach { MiniRow(it) { vm.openDetail(it.quote.instrument) } }
                    }
                }
            }
        }
        item { SectionHeader("Piyasalar") }
        items(st.markets, key = { it.quote.instrument.symbol }) { a -> InstrumentRow(a) { vm.openDetail(a.quote.instrument) } }
        item { Text(DISCLAIMER, fontSize = 11.sp, color = Palette.Gray, modifier = Modifier.padding(16.dp)) }
    }
}

@Composable
private fun SectionHeader(t: String) {
    Text(t, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = Palette.Gray,
        modifier = Modifier.padding(start = 18.dp, top = 12.dp, bottom = 4.dp))
}

@Composable
private fun MiniRow(a: Analysis, onClick: () -> Unit) {
    Row(Modifier.fillMaxWidth().clickable(onClick = onClick).padding(vertical = 5.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(Universe.displayCode(a.quote.instrument), fontWeight = FontWeight.Bold, modifier = Modifier.width(70.dp))
        Text(fmtPrice(a.quote.price), modifier = Modifier.weight(1f))
        Text(fmtPct(a.quote.changePct), color = changeColor(a.quote.changePct), fontSize = 13.sp, modifier = Modifier.padding(end = 8.dp))
        SignalChip(a.signal)
    }
}

@Composable
private fun InstrumentRow(a: Analysis, onClick: () -> Unit) {
    SectionCard(modifier = Modifier.clickable(onClick = onClick)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(Universe.displayCode(a.quote.instrument), fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text(
                    if (a.quote.instrument.type == AssetType.STOCK) a.quote.instrument.name else a.quote.instrument.type.label,
                    fontSize = 12.sp, color = Palette.Gray, maxLines = 1, overflow = TextOverflow.Ellipsis,
                )
            }
            Sparkline(a.quote.candles.takeLast(30).map { it.close }, Modifier.width(70.dp).height(30.dp))
            Spacer(Modifier.width(10.dp))
            Column(horizontalAlignment = Alignment.End, modifier = Modifier.width(96.dp)) {
                Text(fmtPrice(a.quote.price), fontWeight = FontWeight.SemiBold)
                Text(fmtPct(a.quote.changePct), color = changeColor(a.quote.changePct), fontSize = 12.sp)
            }
        }
        Spacer(Modifier.height(6.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            SignalChip(a.signal)
            Spacer(Modifier.width(6.dp))
            a.risk?.let { Pill("Risk: ${it.level.label}", riskColor(it.level)) }
            Spacer(Modifier.weight(1f))
            a.technical?.let { Text("RSI ${fmt(it.rsi, 0)}", fontSize = 11.sp, color = Palette.Gray) }
        }
    }
}

// ---------------- Sinyaller ----------------

@Composable
private fun SignalsScreen(st: UiState, vm: MainViewModel) {
    var input by remember { mutableStateOf("") }
    var showScan by remember { mutableStateOf(true) }
    var filter by remember { mutableIntStateOf(0) } // 0 tümü, 1 al, 2 sat
    val base = if (showScan) st.scan else st.stocks
    val list = when (filter) {
        1 -> base.filter { it.signal.isBuy }
        2 -> base.filter { it.signal.isSell }.reversed()
        else -> base
    }
    LazyColumn(contentPadding = PaddingValues(vertical = 6.dp)) {
        item {
            SectionCard("Günlük İşlem Tavsiyeleri") {
                Text("Her yenilemede BIST 100'ün tamamı ve izleme listeniz yeniden çekilip analiz edilir. " +
                    "Sıralama teknik (%60), temel (%30) ve haber (%12) skoruna göredir.",
                    fontSize = 12.sp, color = Palette.Gray)
                if (st.lastScan > 0) Text("Son tarama ${timeStr(st.lastScan)} · ${st.scan.size}/${st.scanTotal} hisse verisi alındı",
                    fontSize = 12.sp, color = Palette.Gray)
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    FilterChip(selected = showScan, onClick = { showScan = true }, label = { Text("BIST 100 taraması") })
                    FilterChip(selected = !showScan, onClick = { showScan = false }, label = { Text("İzleme listem") })
                }
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf("Tümü", "Al sinyalleri", "Sat sinyalleri").forEachIndexed { i, l ->
                        FilterChip(selected = filter == i, onClick = { filter = i }, label = { Text(l, fontSize = 12.sp) })
                    }
                }
                if (!showScan) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        OutlinedTextField(
                            value = input, onValueChange = { input = it.uppercase() }, singleLine = true,
                            label = { Text("Hisse kodu ekle (örn. SASA)") }, modifier = Modifier.weight(1f),
                        )
                        IconButton(onClick = { vm.addToWatchlist(input); input = "" }) { Icon(Icons.Filled.Add, "Ekle") }
                    }
                }
            }
        }
        if (list.isEmpty()) item {
            Text(if (st.loading) "Hisseler taranıyor..." else "Bu filtrede hisse yok.", color = Palette.Gray, modifier = Modifier.padding(16.dp))
        }
        items(list, key = { it.quote.instrument.symbol }) { a ->
            SignalRow(a, onClick = { vm.openDetail(a.quote.instrument) },
                onRemove = if (showScan) null else { { vm.removeFromWatchlist(a.quote.instrument.symbol.removeSuffix(".IS")) } })
        }
        item { Text(DISCLAIMER, fontSize = 11.sp, color = Palette.Gray, modifier = Modifier.padding(16.dp)) }
    }
}

@Composable
private fun SignalRow(a: Analysis, onClick: () -> Unit, onRemove: (() -> Unit)?) {
    SectionCard(modifier = Modifier.clickable(onClick = onClick)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(Universe.displayCode(a.quote.instrument), fontWeight = FontWeight.Bold)
                Text(a.quote.instrument.name, fontSize = 12.sp, color = Palette.Gray, maxLines = 1)
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(fmtPrice(a.quote.price), fontWeight = FontWeight.SemiBold)
                Text(fmtPct(a.quote.changePct), color = changeColor(a.quote.changePct), fontSize = 12.sp)
            }
            Spacer(Modifier.width(8.dp))
            SignalChip(a.signal)
            if (onRemove != null) IconButton(onClick = onRemove, modifier = Modifier.size(32.dp)) { Icon(Icons.Filled.Delete, "Kaldır", tint = Palette.Gray) }
        }
        ScoreBar(a.score, Modifier.padding(top = 6.dp))
        if (a.signal.isBuy && a.stopLoss != null) {
            Text("Stop: ${fmtPrice(a.stopLoss)}   Hedef: ${fmtPrice(a.target ?: 0.0)}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        a.technical?.reasons?.firstOrNull()?.let { Text("• ${it.text}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant) }
    }
}

// ---------------- Portföy ----------------

@Composable
private fun PortfolioScreen(st: UiState, vm: MainViewModel) {
    var showAdd by remember { mutableStateOf(false) }
    val s = st.settings
    LazyColumn(contentPadding = PaddingValues(vertical = 6.dp)) {
        item {
            var total = 0.0; var cost = 0.0
            st.positions.forEach { p -> st.positionQuotes[p.symbol]?.let { total += it.price * p.quantity; cost += p.cost * p.quantity } }
            SectionCard("Portföy Özeti") {
                KeyValue("Güncel değer", fmt(total))
                KeyValue("Maliyet", fmt(cost))
                val pl = total - cost
                KeyValue("Kâr / Zarar", "${fmt(pl)}  (${fmtPct(if (cost > 0) pl / cost * 100 else 0.0)})", changeColor(pl))
                Spacer(Modifier.height(8.dp))
                Text("Fiyat stop seviyesinin altına inerse, günlük %${fmt(s.dailyDropAlertPct, 0)} üzeri düşerse veya SAT sinyali oluşursa acil bildirim alırsınız.",
                    fontSize = 12.sp, color = Palette.Gray)
                Spacer(Modifier.height(8.dp))
                Button(onClick = { showAdd = true }, colors = ButtonDefaults.buttonColors(containerColor = Palette.Anthracite, contentColor = Palette.BeigeLight)) {
                    Icon(Icons.Filled.Add, null); Spacer(Modifier.width(6.dp)); Text("Pozisyon ekle")
                }
            }
        }
        items(st.positions, key = { it.symbol }) { p ->
            val q = st.positionQuotes[p.symbol]
            val inst = Universe.find(p.symbol)
            val stop = p.stopLoss ?: p.cost * (1 - s.autoStopPct / 100)
            val target = p.target ?: p.cost * (1 + s.autoTargetPct / 100)
            SectionCard(modifier = Modifier.clickable { vm.openDetail(inst) }) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(Universe.displayCode(inst), fontWeight = FontWeight.Bold)
                        Text("${fmt(p.quantity, 2)} adet × ${fmtPrice(p.cost)}", fontSize = 12.sp, color = Palette.Gray)
                    }
                    if (q != null) {
                        val pl = (q.price / p.cost - 1) * 100
                        Column(horizontalAlignment = Alignment.End) {
                            Text(fmtPrice(q.price), fontWeight = FontWeight.SemiBold)
                            Text("K/Z ${fmtPct(pl)}", color = changeColor(pl), fontSize = 12.sp)
                        }
                    }
                    IconButton(onClick = { vm.removePosition(p.symbol) }) { Icon(Icons.Filled.Delete, "Sil", tint = Palette.Gray) }
                }
                Row {
                    Pill("Stop ${fmtPrice(stop)}", Palette.Down)
                    Spacer(Modifier.width(6.dp))
                    Pill("Hedef ${fmtPrice(target)}", Palette.Up)
                    if (q != null && q.price <= stop) { Spacer(Modifier.width(6.dp)); Pill("STOP ALTINDA!", Palette.Down) }
                }
            }
        }
        if (st.alarms.isNotEmpty()) {
            item { SectionHeader("Fiyat Alarmları") }
            items(st.alarms) { al ->
                SectionCard {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Filled.Notifications, null, tint = Palette.Warn)
                        Spacer(Modifier.width(8.dp))
                        Text("${Universe.displayCode(Universe.find(al.symbol))} ${if (al.above) "≥" else "≤"} ${fmtPrice(al.price)}", modifier = Modifier.weight(1f))
                        IconButton(onClick = { vm.removeAlarm(al) }) { Icon(Icons.Filled.Delete, "Sil", tint = Palette.Gray) }
                    }
                }
            }
        }
    }
    if (showAdd) AddPositionDialog(onDismiss = { showAdd = false }, onAdd = { vm.addPosition(it); showAdd = false })
}

@Composable
private fun AddPositionDialog(onDismiss: () -> Unit, onAdd: (Position) -> Unit) {
    var code by remember { mutableStateOf("") }
    var qty by remember { mutableStateOf("") }
    var cost by remember { mutableStateOf("") }
    var stop by remember { mutableStateOf("") }
    var target by remember { mutableStateOf("") }
    fun num(s: String) = s.replace(",", ".").toDoubleOrNull()
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Pozisyon ekle") },
        text = {
            Column {
                OutlinedTextField(code, { code = it.uppercase() }, label = { Text("Kod (THYAO, DOLAR, ALTIN...)") }, singleLine = true)
                OutlinedTextField(qty, { qty = it }, label = { Text("Adet") }, singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal))
                OutlinedTextField(cost, { cost = it }, label = { Text("Alış fiyatı") }, singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal))
                OutlinedTextField(stop, { stop = it }, label = { Text("Stop (boş = otomatik)") }, singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal))
                OutlinedTextField(target, { target = it }, label = { Text("Hedef (boş = otomatik)") }, singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal))
            }
        },
        confirmButton = {
            TextButton(onClick = {
                val q = num(qty); val c = num(cost)
                if (code.isNotBlank() && q != null && c != null && c > 0) {
                    onAdd(Position(Universe.resolve(code).symbol, q, c, num(stop), num(target)))
                }
            }) { Text("Kaydet") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("İptal") } },
    )
}

// ---------------- Haberler ----------------

@Composable
private fun NewsScreen(news: List<NewsItem>, overall: Int?) {
    val ctx = LocalContext.current
    LazyColumn(contentPadding = PaddingValues(vertical = 6.dp)) {
        item {
            SectionCard("Ekonomi Gündemi Analizi") {
                val pos = news.count { it.sentiment >= 30 }; val neg = news.count { it.sentiment <= -30 }
                KeyValue("Genel ton", overall?.let { Sentiment.label(it) } ?: "-", changeColor((overall ?: 0).toDouble()))
                KeyValue("Olumlu / Olumsuz / Nötr", "$pos / $neg / ${news.size - pos - neg}")
                Text("Başlıklar Türkçe ekonomi sözlüğüyle puanlanır; dolar/enflasyon artışı borsa için olumsuz kabul edilir.",
                    fontSize = 11.sp, color = Palette.Gray)
            }
        }
        if (news.isEmpty()) item { Text("Haber yükleniyor...", modifier = Modifier.padding(16.dp), color = Palette.Gray) }
        items(news) { n -> NewsRow(n) { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(n.link))) } }
    }
}

@Composable
private fun NewsRow(n: NewsItem, onClick: () -> Unit) {
    SectionCard(modifier = Modifier.clickable(onClick = onClick)) {
        Text(n.title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
        Spacer(Modifier.height(4.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("${n.source} · ${dateTimeStr(n.time)}", fontSize = 11.sp, color = Palette.Gray, modifier = Modifier.weight(1f),
                maxLines = 1, overflow = TextOverflow.Ellipsis)
            Pill(Sentiment.label(n.sentiment), changeColor(n.sentiment.toDouble()))
        }
    }
}

// ---------------- Ayarlar ----------------

@Composable
private fun SettingsScreen(st: UiState, vm: MainViewModel) {
    val s = st.settings
    Column(Modifier.verticalScroll(rememberScrollState()).padding(vertical = 6.dp)) {
        SectionCard("Bildirimler") {
            ToggleRow("Bildirimler açık", s.notificationsEnabled) { vm.updateSettings(s.copy(notificationsEnabled = it)) }
            ToggleRow("Portföyde SAT sinyali uyarısı", s.notifySellSignals) { vm.updateSettings(s.copy(notifySellSignals = it)) }
            ToggleRow("İzleme listesinde GÜÇLÜ AL uyarısı", s.notifyBuySignals) { vm.updateSettings(s.copy(notifyBuySignals = it)) }
            ToggleRow("Yüksek piyasa riski uyarısı", s.notifyMarketRisk) { vm.updateSettings(s.copy(notifyMarketRisk = it)) }
            ToggleRow("Sabah günlük özet", s.dailySummary) { vm.updateSettings(s.copy(dailySummary = it)) }
        }
        SectionCard("Kontrol sıklığı") {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(15, 30, 60).forEach { m ->
                    FilterChip(selected = s.checkIntervalMin == m, onClick = { vm.updateSettings(s.copy(checkIntervalMin = m)) }, label = { Text("$m dk") })
                }
            }
            Text("Android en sık 15 dakikada bir arka plan kontrolüne izin verir.", fontSize = 11.sp, color = Palette.Gray)
        }
        SectionCard("Eşikler") {
            Stepper("Otomatik stop (maliyetin altında %)", s.autoStopPct, 1.0, 1.0..30.0) { vm.updateSettings(s.copy(autoStopPct = it)) }
            Stepper("Otomatik hedef (maliyetin üstünde %)", s.autoTargetPct, 1.0, 2.0..100.0) { vm.updateSettings(s.copy(autoTargetPct = it)) }
            Stepper("Günlük düşüş uyarısı (%)", s.dailyDropAlertPct, 0.5, 1.0..20.0) { vm.updateSettings(s.copy(dailyDropAlertPct = it)) }
        }
        SectionCard("Test") {
            OutlinedButton(onClick = { vm.testCheck() }) { Text("Şimdi kontrol et (bildirimleri dene)") }
            Text("Bildirimlerin gelmesi için telefon ayarlarından pil optimizasyonunu bu uygulama için kapatmanız önerilir.",
                fontSize = 11.sp, color = Palette.Gray)
        }
        SectionCard("Hakkında") {
            Text("Veri kaynakları: Yahoo Finance (fiyat, temel veriler), Google Haberler / AA RSS (haberler). Veriler 15 dakikaya kadar gecikmeli olabilir.",
                fontSize = 12.sp)
            Spacer(Modifier.height(6.dp))
            Text(DISCLAIMER, fontSize = 12.sp, color = Palette.Gray)
        }
    }
}

@Composable
private fun ToggleRow(label: String, value: Boolean, onChange: (Boolean) -> Unit) {
    Row(Modifier.fillMaxWidth().padding(vertical = 2.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(label, modifier = Modifier.weight(1f))
        Switch(value, onChange, colors = SwitchDefaults.colors(checkedTrackColor = Palette.Anthracite, checkedThumbColor = Palette.Beige))
    }
}

@Composable
private fun Stepper(label: String, value: Double, step: Double, range: ClosedFloatingPointRange<Double>, onChange: (Double) -> Unit) {
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Text(label, modifier = Modifier.weight(1f), fontSize = 14.sp)
        TextButton(onClick = { onChange((value - step).coerceIn(range)) }) { Text("−", fontSize = 18.sp) }
        Text(fmt(value, 1), fontWeight = FontWeight.Bold)
        TextButton(onClick = { onChange((value + step).coerceIn(range)) }) { Text("+", fontSize = 18.sp) }
    }
}

// ---------------- Detay ----------------

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DetailScreen(d: DetailState, onBack: () -> Unit, onAlarm: (PriceAlarm) -> Unit) {
    val ctx = LocalContext.current
    var alarmDialog by remember { mutableStateOf(false) }
    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text(Universe.displayCode(d.instrument), fontWeight = FontWeight.Bold) },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Geri") } },
                actions = { IconButton(onClick = { alarmDialog = true }) { Icon(Icons.Filled.Notifications, "Alarm") } },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Palette.Anthracite, titleContentColor = Palette.BeigeLight,
                    navigationIconContentColor = Palette.Beige, actionIconContentColor = Palette.Beige,
                ),
            )
        },
    ) { pad ->
        val a = d.analysis
        if (d.loading) {
            Box(Modifier.padding(pad).fillMaxSize()) { LinearProgressIndicator(Modifier.fillMaxWidth(), color = Palette.Beige) }
            return@Scaffold
        }
        if (a == null) {
            Text("Veri alınamadı.", modifier = Modifier.padding(pad).padding(16.dp))
            return@Scaffold
        }
        LazyColumn(Modifier.padding(pad), contentPadding = PaddingValues(vertical = 6.dp)) {
            item { DetailHeader(a, d.instrument) }
            item { RecommendationCard(a) }
            a.technical?.let { t ->
                item {
                    SectionCard("Teknik Göstergeler") {
                        KeyValue("RSI (14)", fmt(t.rsi, 1), when { t.rsi > 70 -> Palette.Down; t.rsi < 30 -> Palette.Up; else -> MaterialTheme.colorScheme.onSurface })
                        KeyValue("MACD / Sinyal", "${fmt(t.macd, 3)} / ${fmt(t.macdSignal, 3)}", changeColor(t.macdHist))
                        KeyValue("Stokastik %K / %D", "${fmt(t.stochK, 0)} / ${fmt(t.stochD, 0)}")
                        KeyValue("SMA 20 / 50 / 200", "${fmtPrice(t.sma20)} / ${fmtPrice(t.sma50)} / ${if (t.sma200.isNaN()) "-" else fmtPrice(t.sma200)}")
                        KeyValue("Bollinger (alt-üst)", "${fmtPrice(t.bbLower)} – ${fmtPrice(t.bbUpper)}")
                        KeyValue("ATR (14)", fmtPrice(t.atr))
                        KeyValue("20 günlük getiri", fmtPct(t.roc20), changeColor(t.roc20))
                        KeyValue("Destek / Direnç (20g)", "${fmtPrice(t.support)} / ${fmtPrice(t.resistance)}")
                        Spacer(Modifier.height(8.dp))
                        HorizontalDivider()
                        Spacer(Modifier.height(8.dp))
                        t.reasons.forEach { r -> Text("${if (r.weight > 0) "▲" else "▼"} ${r.text}", fontSize = 13.sp, color = changeColor(r.weight), modifier = Modifier.padding(vertical = 2.dp)) }
                    }
                }
            }
            if (d.instrument.type == AssetType.STOCK) {
                item {
                    SectionCard("Temel Analiz") {
                        val f = a.fundamentals
                        if (f == null) {
                            Text("Temel veriler şu an alınamadı (kaynak kısıtlaması). Analiz teknik ve haber verisine dayanıyor.", fontSize = 12.sp, color = Palette.Gray)
                        } else {
                            KeyValue("F/K", fmt(f.pe, 2)); KeyValue("PD/DD", fmt(f.pb, 2))
                            KeyValue("Özsermaye kârlılığı", f.roe?.let { fmtPct(it * 100) } ?: "-")
                            KeyValue("Net kâr marjı", f.profitMargin?.let { fmtPct(it * 100) } ?: "-")
                            KeyValue("Borç / Özsermaye", f.debtToEquity?.let { fmt(it, 0) + "%" } ?: "-")
                            KeyValue("Satış büyümesi", f.revenueGrowth?.let { fmtPct(it * 100) } ?: "-")
                            KeyValue("Temettü verimi", f.dividendYield?.let { fmtPct(it * 100) } ?: "-")
                            KeyValue("Piyasa değeri", f.marketCap?.let { fmt(it / 1e9, 1) + " Milyar" } ?: "-")
                            a.fundamental?.let { fr ->
                                Spacer(Modifier.height(8.dp)); HorizontalDivider(); Spacer(Modifier.height(8.dp))
                                fr.reasons.forEach { r -> Text("${if (r.weight > 0) "▲" else "▼"} ${r.text}", fontSize = 13.sp, color = changeColor(r.weight), modifier = Modifier.padding(vertical = 2.dp)) }
                            }
                        }
                    }
                }
            }
            a.risk?.let { r ->
                item {
                    SectionCard("Risk Analizi") {
                        KeyValue("Risk seviyesi", r.level.label, riskColor(r.level))
                        KeyValue("Yıllık oynaklık", "%" + fmt(r.volatility, 1))
                        KeyValue("Maks. düşüş (1 yıl)", "%" + fmt(r.maxDrawdown, 1))
                        KeyValue("Günlük VaR (%95)", "%" + fmt(r.var95, 2))
                        r.beta?.let { KeyValue("Beta (BIST100'e göre)", fmt(it, 2)) }
                        Text("VaR: normal bir günde %95 olasılıkla bundan fazla kayıp beklenmez.", fontSize = 11.sp, color = Palette.Gray)
                    }
                }
            }
            item {
                SectionCard("İlgili Haberler" + (a.newsScore?.let { "  ·  ton: ${Sentiment.label(it)}" } ?: "")) {
                    if (d.news.isEmpty()) Text("Haber bulunamadı.", fontSize = 12.sp, color = Palette.Gray)
                    d.news.take(10).forEach { n ->
                        Row(Modifier.fillMaxWidth().clickable { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(n.link))) }.padding(vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically) {
                            Column(Modifier.weight(1f)) {
                                Text(n.title, fontSize = 13.sp, maxLines = 3, overflow = TextOverflow.Ellipsis)
                                Text("${n.source} · ${dateTimeStr(n.time)}", fontSize = 11.sp, color = Palette.Gray)
                            }
                            Spacer(Modifier.width(6.dp))
                            Pill(Sentiment.label(n.sentiment), changeColor(n.sentiment.toDouble()))
                        }
                    }
                }
            }
            item { Text(DISCLAIMER, fontSize = 11.sp, color = Palette.Gray, modifier = Modifier.padding(16.dp)) }
        }
    }
    if (alarmDialog) {
        AlarmDialog(d.instrument, d.analysis?.quote?.price, onDismiss = { alarmDialog = false }) { onAlarm(it); alarmDialog = false }
    }
}

@Composable
private fun DetailHeader(a: Analysis, i: Instrument) {
    val q = a.quote
    SectionCard {
        Text(i.name, color = Palette.Gray, fontSize = 13.sp)
        Row(verticalAlignment = Alignment.Bottom) {
            Text(fmtPrice(q.price), style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.width(8.dp))
            Text("${fmtPct(q.changePct)}  ${q.currency}", color = changeColor(q.changePct), modifier = Modifier.padding(bottom = 4.dp))
        }
        Spacer(Modifier.height(8.dp))
        var days by remember { mutableIntStateOf(90) }
        val closes = q.candles.map { it.close }
        val s20 = Indicators.sma(closes, 20).toList(); val s50 = Indicators.sma(closes, 50).toList()
        val n = days.coerceAtMost(closes.size)
        PriceChart(closes.takeLast(n), s20.takeLast(n), s50.takeLast(n), a.technical?.support, a.technical?.resistance,
            Modifier.fillMaxWidth().height(190.dp))
        Spacer(Modifier.height(6.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
            listOf(30 to "1A", 90 to "3A", 180 to "6A", 365 to "1Y").forEach { (dd, l) ->
                FilterChip(selected = days == dd, onClick = { days = dd }, label = { Text(l, fontSize = 11.sp) })
            }
        }
        Text("— Fiyat   — SMA20 (bej)   — SMA50 (gri)   - - destek/direnç", fontSize = 10.sp, color = Palette.Gray)
    }
}

@Composable
private fun RecommendationCard(a: Analysis) {
    SectionCard("Günlük Tavsiye") {
        Row(verticalAlignment = Alignment.CenterVertically) {
            SignalChip(a.signal)
            Spacer(Modifier.width(8.dp))
            Text("Toplam skor: ${a.score.toInt()}", fontWeight = FontWeight.SemiBold)
        }
        ScoreBar(a.score, Modifier.padding(vertical = 8.dp))
        Text(a.summary, fontSize = 14.sp)
        Spacer(Modifier.height(6.dp))
        a.technical?.let { KeyValue("Teknik skor", it.score.toInt().toString(), changeColor(it.score)) }
        a.fundamental?.let { KeyValue("Temel skor", it.score.toInt().toString(), changeColor(it.score)) }
        a.newsScore?.let { KeyValue("Haber skoru", it.toString(), changeColor(it.toDouble())) }
        if (a.stopLoss != null) KeyValue("Önerilen stop", fmtPrice(a.stopLoss), Palette.Down)
        if (a.target != null) KeyValue("Hedef fiyat", fmtPrice(a.target), Palette.Up)
    }
}

@Composable
private fun AlarmDialog(i: Instrument, price: Double?, onDismiss: () -> Unit, onAdd: (PriceAlarm) -> Unit) {
    var value by remember { mutableStateOf(price?.let { fmtPrice(it).replace(".", "").replace(",", ".") } ?: "") }
    var above by remember { mutableStateOf(false) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Fiyat alarmı: ${Universe.displayCode(i)}") },
        text = {
            Column {
                OutlinedTextField(value, { value = it }, label = { Text("Fiyat") }, singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal))
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilterChip(selected = !above, onClick = { above = false }, label = { Text("Altına inerse") })
                    FilterChip(selected = above, onClick = { above = true }, label = { Text("Üstüne çıkarsa") })
                }
            }
        },
        confirmButton = {
            TextButton(onClick = { value.replace(",", ".").toDoubleOrNull()?.let { onAdd(PriceAlarm(i.symbol, it, above)) } }) { Text("Kaydet") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("İptal") } },
    )
}
