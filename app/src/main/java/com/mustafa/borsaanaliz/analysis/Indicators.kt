package com.mustafa.borsaanaliz.analysis

import kotlin.math.abs
import kotlin.math.ln
import kotlin.math.max
import kotlin.math.sqrt

/** Teknik göstergeler. Tüm diziler giriş ile aynı uzunluktadır; hesaplanamayan noktalar NaN. */
object Indicators {

    fun sma(x: List<Double>, n: Int): DoubleArray {
        val out = DoubleArray(x.size) { Double.NaN }
        var sum = 0.0
        for (i in x.indices) {
            sum += x[i]
            if (i >= n) sum -= x[i - n]
            if (i >= n - 1) out[i] = sum / n
        }
        return out
    }

    fun ema(x: List<Double>, n: Int): DoubleArray {
        val out = DoubleArray(x.size) { Double.NaN }
        if (x.size < n) return out
        val k = 2.0 / (n + 1)
        var prev = x.take(n).average()
        out[n - 1] = prev
        for (i in n until x.size) {
            prev = x[i] * k + prev * (1 - k)
            out[i] = prev
        }
        return out
    }

    /** Wilder RSI. */
    fun rsi(x: List<Double>, n: Int = 14): DoubleArray {
        val out = DoubleArray(x.size) { Double.NaN }
        if (x.size <= n) return out
        var gain = 0.0; var loss = 0.0
        for (i in 1..n) {
            val d = x[i] - x[i - 1]
            if (d > 0) gain += d else loss -= d
        }
        gain /= n; loss /= n
        out[n] = if (loss == 0.0) 100.0 else 100 - 100 / (1 + gain / loss)
        for (i in n + 1 until x.size) {
            val d = x[i] - x[i - 1]
            gain = (gain * (n - 1) + max(d, 0.0)) / n
            loss = (loss * (n - 1) + max(-d, 0.0)) / n
            out[i] = if (loss == 0.0) 100.0 else 100 - 100 / (1 + gain / loss)
        }
        return out
    }

    data class Macd(val macd: DoubleArray, val signal: DoubleArray, val hist: DoubleArray)

    fun macd(x: List<Double>, fast: Int = 12, slow: Int = 26, sig: Int = 9): Macd {
        val f = ema(x, fast); val s = ema(x, slow)
        val m = DoubleArray(x.size) { f[it] - s[it] }
        val valid = m.indexOfFirst { !it.isNaN() }
        val signal = DoubleArray(x.size) { Double.NaN }
        if (valid >= 0) {
            val e = ema(m.drop(valid), sig)
            for (i in e.indices) signal[i + valid] = e[i]
        }
        return Macd(m, signal, DoubleArray(x.size) { m[it] - signal[it] })
    }

    data class Bands(val mid: DoubleArray, val upper: DoubleArray, val lower: DoubleArray)

    fun bollinger(x: List<Double>, n: Int = 20, k: Double = 2.0): Bands {
        val mid = sma(x, n)
        val up = DoubleArray(x.size) { Double.NaN }
        val lo = DoubleArray(x.size) { Double.NaN }
        for (i in n - 1 until x.size) {
            val w = x.subList(i - n + 1, i + 1)
            val sd = sqrt(w.sumOf { (it - mid[i]) * (it - mid[i]) } / n)
            up[i] = mid[i] + k * sd; lo[i] = mid[i] - k * sd
        }
        return Bands(mid, up, lo)
    }

    data class Stoch(val k: DoubleArray, val d: DoubleArray)

    fun stochastic(h: List<Double>, l: List<Double>, c: List<Double>, n: Int = 14, dN: Int = 3): Stoch {
        val k = DoubleArray(c.size) { Double.NaN }
        for (i in n - 1 until c.size) {
            val hh = h.subList(i - n + 1, i + 1).max()
            val ll = l.subList(i - n + 1, i + 1).min()
            k[i] = if (hh == ll) 50.0 else (c[i] - ll) / (hh - ll) * 100
        }
        val d = DoubleArray(c.size) { Double.NaN }
        for (i in n - 1 + dN - 1 until c.size) d[i] = (0 until dN).sumOf { k[i - it] } / dN
        return Stoch(k, d)
    }

    fun atr(h: List<Double>, l: List<Double>, c: List<Double>, n: Int = 14): DoubleArray {
        val out = DoubleArray(c.size) { Double.NaN }
        if (c.size <= n) return out
        val tr = DoubleArray(c.size) { i ->
            if (i == 0) h[0] - l[0]
            else maxOf(h[i] - l[i], abs(h[i] - c[i - 1]), abs(l[i] - c[i - 1]))
        }
        var a = tr.slice(1..n).average()
        out[n] = a
        for (i in n + 1 until c.size) { a = (a * (n - 1) + tr[i]) / n; out[i] = a }
        return out
    }

    fun logReturns(x: List<Double>): List<Double> =
        (1 until x.size).mapNotNull { i -> if (x[i - 1] > 0 && x[i] > 0) ln(x[i] / x[i - 1]) else null }

    fun stdev(x: List<Double>): Double {
        if (x.size < 2) return 0.0
        val m = x.average()
        return sqrt(x.sumOf { (it - m) * (it - m) } / (x.size - 1))
    }

    fun maxDrawdown(x: List<Double>): Double {
        var peak = Double.MIN_VALUE; var mdd = 0.0
        for (v in x) {
            if (v > peak) peak = v
            if (peak > 0) mdd = max(mdd, (peak - v) / peak)
        }
        return mdd
    }

    fun DoubleArray.lastValid(): Double = lastOrNull { !it.isNaN() } ?: Double.NaN
}
