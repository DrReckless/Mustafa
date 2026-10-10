package com.mustafa.borsaanaliz

import com.mustafa.borsaanaliz.analysis.Analyzer
import com.mustafa.borsaanaliz.analysis.Indicators
import com.mustafa.borsaanaliz.analysis.Sentiment
import com.mustafa.borsaanaliz.data.Candle
import com.mustafa.borsaanaliz.data.Quote
import com.mustafa.borsaanaliz.data.Universe
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.sin

class AnalyzerTest {
    private fun quote(closes: List<Double>): Quote {
        val candles = closes.mapIndexed { i, c -> Candle(i * 86_400_000L, c, c * 1.01, c * 0.99, c, 1000.0) }
        return Quote(Universe.stock("TEST"), candles, closes.last(), closes[closes.size - 2], "TRY", 0)
    }

    @Test fun smaAndRsi() {
        val x = (1..30).map { it.toDouble() }
        assertEquals(28.0, Indicators.sma(x, 5).last(), 1e-9)
        assertEquals(100.0, Indicators.rsi(x).last(), 1e-9) // sürekli yükseliş
    }

    @Test fun uptrendGivesPositiveScore() {
        val closes = (0 until 250).map { 100 + it * 0.5 + sin(it / 3.0) * 2 }
        val a = Analyzer.analyze(quote(closes), null, null, null)
        assertTrue("skor ${a.score}", a.technical!!.score > 0)
        assertTrue(a.stopLoss!! < a.quote.price)
    }

    @Test fun crashGivesSellSignal() {
        val closes = (0 until 200).map { 100.0 + it * 0.2 } + (0 until 50).map { 140.0 - it * 1.2 + sin(it.toDouble()) }
        val a = Analyzer.analyze(quote(closes), null, null, null)
        assertTrue("skor ${a.score}", a.signal.isSell)
    }

    @Test fun sentiment() {
        assertTrue(Sentiment.score("Borsa günü yükselişle tamamladı, rekor kâr") > 0)
        assertTrue(Sentiment.score("Dolar rekor kırdı, piyasada sert düşüş") < 0)
    }
}
