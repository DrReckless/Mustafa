package com.mustafa.borsaanaliz.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mustafa.borsaanaliz.analysis.RiskLevel
import com.mustafa.borsaanaliz.analysis.Signal
import java.util.Locale

private val TR = Locale("tr", "TR")

fun fmt(v: Double?, digits: Int = 2): String =
    if (v == null || v.isNaN()) "-" else String.format(TR, "%,.${digits}f", v)

fun fmtPrice(v: Double): String = fmt(
    v,
    when {
        v.isNaN() -> 2
        v >= 1000 -> 0
        v >= 10 -> 2
        v >= 0.01 -> 4
        // Çok düşük fiyatlı coinler (ör. SHIB, PEPE) için anlamlı basamak sayısı
        v > 0 -> (-kotlin.math.log10(v)).toInt() + 4
        else -> 2
    }.coerceAtMost(12),
)

fun fmtPct(v: Double?): String = if (v == null || v.isNaN()) "-" else String.format(TR, "%+.2f%%", v)

fun changeColor(v: Double): Color = when {
    v > 0.0001 -> Palette.Up
    v < -0.0001 -> Palette.Down
    else -> Palette.Gray
}

fun signalColor(s: Signal): Color = when (s) {
    Signal.STRONG_BUY -> Palette.Up
    Signal.BUY -> Palette.Up.copy(alpha = 0.75f)
    Signal.HOLD -> Palette.Gray
    Signal.SELL -> Palette.Down.copy(alpha = 0.8f)
    Signal.STRONG_SELL -> Palette.Down
}

fun riskColor(r: RiskLevel): Color = when (r) {
    RiskLevel.LOW -> Palette.Up
    RiskLevel.MEDIUM -> Palette.Warn
    RiskLevel.HIGH -> Palette.Down.copy(alpha = 0.8f)
    RiskLevel.VERY_HIGH -> Palette.Down
}

@Composable
fun SignalChip(s: Signal, modifier: Modifier = Modifier) {
    Box(
        modifier
            .clip(RoundedCornerShape(6.dp))
            .background(signalColor(s))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(s.label, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun Pill(text: String, color: Color, modifier: Modifier = Modifier) {
    Box(
        modifier
            .clip(RoundedCornerShape(6.dp))
            .background(color.copy(alpha = 0.15f))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(text, color = color, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
fun SectionCard(title: String? = null, modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    Card(
        modifier = modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 6.dp),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column(Modifier.padding(14.dp)) {
            if (title != null) {
                Text(title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.height(8.dp))
            }
            content()
        }
    }
}

@Composable
fun KeyValue(key: String, value: String, valueColor: Color = Color.Unspecified) {
    Row(Modifier.fillMaxWidth().padding(vertical = 3.dp), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(key, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, color = valueColor)
    }
}

@Composable
fun Sparkline(values: List<Double>, modifier: Modifier = Modifier) {
    if (values.size < 2) return
    val color = changeColor(values.last() - values.first())
    Canvas(modifier) {
        val mn = values.min(); val mx = values.max()
        val range = (mx - mn).takeIf { it > 0 } ?: 1.0
        val path = Path()
        values.forEachIndexed { i, v ->
            val x = i * size.width / (values.size - 1)
            val y = size.height - ((v - mn) / range * size.height).toFloat()
            if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
        }
        drawPath(path, color, style = Stroke(width = 2.dp.toPx()))
    }
}

/** Fiyat grafiği + SMA20 / SMA50 ve destek/direnç çizgileri. */
@Composable
fun PriceChart(
    closes: List<Double>, sma20: List<Double>, sma50: List<Double>,
    support: Double?, resistance: Double?, modifier: Modifier = Modifier,
) {
    if (closes.size < 2) return
    val line = MaterialTheme.colorScheme.onSurface
    val grid = MaterialTheme.colorScheme.outline
    Canvas(modifier) {
        val all = closes + sma20.filter { !it.isNaN() } + sma50.filter { !it.isNaN() }
        val mn = all.min(); val mx = all.max()
        val range = (mx - mn).takeIf { it > 0 } ?: 1.0
        fun y(v: Double) = size.height - ((v - mn) / range * size.height).toFloat()
        fun x(i: Int) = i * size.width / (closes.size - 1)
        for (k in 0..4) {
            val yy = size.height * k / 4f
            drawLine(grid, Offset(0f, yy), Offset(size.width, yy), strokeWidth = 1f)
        }
        fun series(s: List<Double>, c: Color, w: Float) {
            val p = Path(); var started = false
            s.forEachIndexed { i, v ->
                if (v.isNaN()) return@forEachIndexed
                if (!started) { p.moveTo(x(i), y(v)); started = true } else p.lineTo(x(i), y(v))
            }
            drawPath(p, c, style = Stroke(width = w))
        }
        val dash = PathEffect.dashPathEffect(floatArrayOf(12f, 10f))
        support?.let { if (it in mn..mx) drawLine(Palette.Up, Offset(0f, y(it)), Offset(size.width, y(it)), 2f, pathEffect = dash) }
        resistance?.let { if (it in mn..mx) drawLine(Palette.Down, Offset(0f, y(it)), Offset(size.width, y(it)), 2f, pathEffect = dash) }
        series(sma50, Palette.Gray, 2.dp.toPx())
        series(sma20, Palette.Beige, 2.dp.toPx())
        series(closes, line, 2.5f.dp.toPx())
    }
}

@Composable
fun ScoreBar(score: Double, modifier: Modifier = Modifier) {
    // -100..100 skalası, ortası 0
    val frac = ((score + 100) / 200).toFloat().coerceIn(0f, 1f)
    Column(modifier) {
        Box(Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp)).background(MaterialTheme.colorScheme.surfaceVariant)) {
            Box(Modifier.fillMaxWidth(frac).height(8.dp).clip(RoundedCornerShape(4.dp)).background(changeColor(score)))
        }
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("Sat", fontSize = 10.sp, color = Palette.Gray)
            Text("Skor ${score.toInt()}", fontSize = 10.sp, color = Palette.Gray)
            Text("Al", fontSize = 10.sp, color = Palette.Gray)
        }
    }
}

@Composable
fun RiskMeter(score: Int, level: RiskLevel) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(Modifier.weight(1f).height(10.dp).clip(RoundedCornerShape(5.dp)).background(MaterialTheme.colorScheme.surfaceVariant)) {
            Box(Modifier.fillMaxWidth(score / 100f).height(10.dp).clip(RoundedCornerShape(5.dp)).background(riskColor(level)))
        }
        Spacer(Modifier.width(10.dp))
        Text("$score/100", fontWeight = FontWeight.Bold, color = riskColor(level))
    }
}
