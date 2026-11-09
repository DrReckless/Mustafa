package com.mustafa.borsaanaliz

import com.mustafa.borsaanaliz.analysis.Analyzer
import com.mustafa.borsaanaliz.analysis.RiskLevel
import com.mustafa.borsaanaliz.data.AssetType
import com.mustafa.borsaanaliz.data.Candle
import com.mustafa.borsaanaliz.data.CoinInfo
import com.mustafa.borsaanaliz.data.FearGreed
import com.mustafa.borsaanaliz.data.Quote
import com.mustafa.borsaanaliz.data.Universe
import com.mustafa.borsaanaliz.ui.fmtPrice
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.sin

class CryptoTest {
    private fun cryptoQuote(closes: List<Double>, code: String = "ETH"): Quote {
        val candles = closes.mapIndexed { i, c -> Candle(i * 86_400_000L, c, c * 1.02, c * 0.98, c, 1000.0) }
        return Quote(Universe.crypto(code), candles, closes.last(), closes[closes.size - 2], "USD", 0)
    }

    @Test fun resolveRecognisesCoins() {
        assertEquals(AssetType.CRYPTO, Universe.resolve("btc").type)
        assertEquals("BTC-USD", Universe.resolve("bitcoin").symbol)
        assertEquals("ETH-USD", Universe.find("ETH-USD").symbol)
        assertEquals(AssetType.STOCK, Universe.resolve("thyao").type)
        assertEquals("GRAMALTIN", Universe.resolve("altın").symbol)
    }

    @Test fun cryptoRiskThresholdsAreWider() {
        // Günlük ~%3 dalgalanma: yıllık ~%55 oynaklık. Hisse için "Çok Yüksek", kripto için "Orta" olmalı.
        val closes = (0 until 200).map { 100.0 * (1 + 0.03 * sin(it * 1.7)) }
        val r = Analyzer.risk(cryptoQuote(closes), null)!!
        assertTrue("oynaklık ${r.volatility}", r.volatility in 40.0..90.0)
        assertTrue("seviye ${r.level}", r.level <= RiskLevel.HIGH)
    }

    @Test fun cryptoMarketRiskReactsToPanic() {
        val falling = (0 until 250).map { 100_000.0 - it * 150 }
        val btc = cryptoQuote(falling, "BTC")
        val coins = (1..100).map { CoinInfo("C$it", "Coin $it", it, 1.0, -9.0, -20.0, 1e9, 1e8) } +
            CoinInfo("BTC", "Bitcoin", 1, btc.price, -7.0, -15.0, 1e12, 1e10)
        val r = Analyzer.cryptoRisk(btc, FearGreed(12, "Aşırı Korku", 50), coins, emptyList())
        assertTrue("puan ${r.score}", r.level >= RiskLevel.HIGH)
        val calm = Analyzer.cryptoRisk(null, FearGreed(50, "Nötr", 52), emptyList(), emptyList())
        assertEquals(RiskLevel.LOW, calm.level)
    }

    @Test fun smallPricesKeepDigits() {
        assertTrue(fmtPrice(0.00001234).contains("1234"))
        assertEquals("1.234", fmtPrice(1234.4))
    }
}
