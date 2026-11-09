package com.mustafa.borsaanaliz.ui

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mustafa.borsaanaliz.analysis.Analysis
import com.mustafa.borsaanaliz.analysis.Sentiment
import com.mustafa.borsaanaliz.data.CoinInfo
import com.mustafa.borsaanaliz.data.CryptoClient
import com.mustafa.borsaanaliz.data.Universe

/** Kripto sayfası: güncel ilk 100 coin + kullanıcı coinleri, kripto risk kartı ve kripto haberleri. */
@Composable
fun CryptoScreen(st: UiState, vm: MainViewModel) {
    var view by remember { mutableIntStateOf(0) } // 0 tümü, 1 al, 2 sat, 3 haberler
    var input by remember { mutableStateOf("") }
    val ctx = LocalContext.current
    val list = when (view) {
        1 -> st.crypto.filter { it.signal.isBuy }
        2 -> st.crypto.filter { it.signal.isSell }.reversed()
        else -> st.crypto
    }
    LazyColumn(contentPadding = PaddingValues(vertical = 6.dp)) {
        if (st.cryptoLoading) item {
            LinearProgressIndicator(
                Modifier.fillMaxWidth().padding(horizontal = 12.dp),
                color = Palette.Beige, trackColor = Palette.AnthraciteLight,
            )
        }
        st.cryptoRisk?.let { mr ->
            item {
                SectionCard("Kripto Piyasa Risk Analizi") {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Risk: ", style = MaterialTheme.typography.titleMedium)
                        Text(mr.level.label, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = riskColor(mr.level))
                    }
                    Spacer(Modifier.height(6.dp))
                    RiskMeter(mr.score, mr.level)
                    st.fearGreed?.let { f ->
                        Spacer(Modifier.height(8.dp))
                        val c = when {
                            f.value <= 24 || f.value >= 76 -> Palette.Down
                            f.value in 45..55 -> Palette.Gray
                            else -> Palette.Warn
                        }
                        KeyValue("Korku ve Açgözlülük Endeksi", "${f.value} · ${f.label}", c)
                        f.weekAgo?.let { KeyValue("1 hafta önce", "$it · ${CryptoClient.fngLabel(it)}") }
                    }
                    Spacer(Modifier.height(8.dp))
                    mr.reasons.forEach { Text("• $it", style = MaterialTheme.typography.bodySmall) }
                }
            }
        }
        item {
            SectionCard("Kripto Tavsiyeleri") {
                Text(
                    "Her yenilemede piyasa değerine göre güncel ilk 100 coin (stablecoinler hariç) ve eklediğiniz coinler " +
                        "yeniden çekilip teknik analiz ve haberlere göre değerlendirilir.",
                    fontSize = 12.sp, color = Palette.Gray,
                )
                if (st.lastCryptoScan > 0) {
                    val buys = st.crypto.count { it.signal.isBuy }
                    val sells = st.crypto.count { it.signal.isSell }
                    Text("Son tarama ${timeStr(st.lastCryptoScan)} · ${st.crypto.size}/${st.cryptoTotal} coin analiz edildi",
                        fontSize = 12.sp, color = Palette.Gray)
                    Text("AL: $buys  ·  TUT: ${st.crypto.size - buys - sells}  ·  SAT: $sells", fontSize = 12.sp, color = Palette.Gray)
                    if (st.cryptoMissing.isNotEmpty()) {
                        Text("Geçmiş fiyat verisi bulunamadığı için analiz edilemeyenler: " + st.cryptoMissing.joinToString(", "),
                            fontSize = 11.sp, color = Palette.Gray)
                    }
                }
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf("Tümü", "Al", "Sat", "Haberler").forEachIndexed { i, l ->
                        FilterChip(selected = view == i, onClick = { view = i }, label = { Text(l, fontSize = 12.sp) })
                    }
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    OutlinedTextField(
                        value = input, onValueChange = { input = it.uppercase() }, singleLine = true,
                        label = { Text("Coin ekle (örn. PEPE)") }, modifier = Modifier.weight(1f),
                    )
                    IconButton(onClick = { vm.addCrypto(input); input = "" }) { Icon(Icons.Filled.Add, "Ekle") }
                }
            }
        }
        if (view == 3) {
            if (st.cryptoNews.isEmpty()) {
                item { Text("Haber yükleniyor...", modifier = Modifier.padding(16.dp), color = Palette.Gray) }
            } else {
                item {
                    val ns = st.cryptoRisk?.newsSentiment ?: 0
                    SectionCard { KeyValue("Kripto haberlerinin genel tonu", Sentiment.label(ns), changeColor(ns.toDouble())) }
                }
            }
            items(st.cryptoNews) { n -> NewsRow(n) { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(n.link))) } }
        } else {
            if (list.isEmpty()) item {
                Text(
                    if (st.cryptoLoading) "Coinler taranıyor..." else "Bu filtrede coin yok.",
                    color = Palette.Gray, modifier = Modifier.padding(16.dp),
                )
            }
            items(list, key = { it.quote.instrument.symbol }) { a ->
                val code = a.quote.instrument.symbol.removeSuffix("-USD")
                CoinRow(
                    a, st.coins[code], st.usdTry,
                    onClick = { vm.openDetail(a.quote.instrument) },
                    onRemove = if (code in st.cryptoWatchlist) ({ vm.removeCrypto(code) }) else null,
                )
            }
        }
        item {
            Text(
                "Kripto paralar 7/24 işlem görür ve çok oynaktır. $DISCLAIMER",
                fontSize = 11.sp, color = Palette.Gray, modifier = Modifier.padding(16.dp),
            )
        }
    }
}

private fun usd(v: Double) = "$" + fmtPrice(v)

@Composable
private fun CoinRow(a: Analysis, info: CoinInfo?, usdTry: Double?, onClick: () -> Unit, onRemove: (() -> Unit)?) {
    SectionCard(modifier = Modifier.clickable(onClick = onClick)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    info?.let { Text("#${it.rank} ", fontSize = 11.sp, color = Palette.Gray) }
                    Text(Universe.displayCode(a.quote.instrument), fontWeight = FontWeight.Bold)
                }
                Text(a.quote.instrument.name, fontSize = 12.sp, color = Palette.Gray, maxLines = 1, overflow = TextOverflow.Ellipsis)
            }
            Sparkline(a.quote.candles.takeLast(30).map { it.close }, Modifier.width(60.dp).height(28.dp))
            Spacer(Modifier.width(8.dp))
            Column(horizontalAlignment = Alignment.End, modifier = Modifier.width(104.dp)) {
                Text(usd(a.quote.price), fontWeight = FontWeight.SemiBold, maxLines = 1)
                usdTry?.let { Text("≈ ₺" + fmtPrice(a.quote.price * it), fontSize = 11.sp, color = Palette.Gray, maxLines = 1) }
            }
            if (onRemove != null) {
                IconButton(onClick = onRemove, modifier = Modifier.size(32.dp)) { Icon(Icons.Filled.Delete, "Kaldır", tint = Palette.Gray) }
            }
        }
        Spacer(Modifier.height(6.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            SignalChip(a.signal)
            Spacer(Modifier.width(6.dp))
            a.risk?.let { Pill("Risk: ${it.level.label}", riskColor(it.level)) }
            Spacer(Modifier.weight(1f))
            val c24 = info?.change24h ?: a.quote.changePct
            Text("24s ${fmtPct(c24)}", color = changeColor(c24), fontSize = 12.sp)
            info?.let { Text("  7g ${fmtPct(it.change7d)}", color = changeColor(it.change7d), fontSize = 12.sp) }
        }
        if (a.signal.isBuy && a.stopLoss != null) {
            Text(
                "Stop: ${usd(a.stopLoss)}   Hedef: ${usd(a.target ?: 0.0)}",
                fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
