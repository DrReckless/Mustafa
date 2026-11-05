package com.mustafa.borsaanaliz.data

enum class AssetType(val label: String) {
    INDEX("Endeks"), FX("Döviz"), COMMODITY("Emtia"), STOCK("Hisse"), GLOBAL("Küresel")
}

data class Instrument(
    val symbol: String,
    val name: String,
    val type: AssetType,
)

/** Günlük mum verisi. */
data class Candle(
    val time: Long,
    val open: Double,
    val high: Double,
    val low: Double,
    val close: Double,
    val volume: Double,
)

data class Quote(
    val instrument: Instrument,
    val candles: List<Candle>,
    val price: Double,
    val prevClose: Double,
    val currency: String,
    val updatedAt: Long,
) {
    val change: Double get() = price - prevClose
    val changePct: Double get() = if (prevClose != 0.0) (price - prevClose) / prevClose * 100 else 0.0
}

data class Fundamentals(
    val pe: Double? = null,
    val pb: Double? = null,
    val roe: Double? = null,
    val profitMargin: Double? = null,
    val debtToEquity: Double? = null,
    val revenueGrowth: Double? = null,
    val earningsGrowth: Double? = null,
    val dividendYield: Double? = null,
    val marketCap: Double? = null,
    val currentRatio: Double? = null,
)

data class NewsItem(
    val title: String,
    val link: String,
    val source: String,
    val time: Long,
    val sentiment: Int, // -100..100
)

data class Position(
    val symbol: String,
    val quantity: Double,
    val cost: Double,
    val stopLoss: Double? = null,
    val target: Double? = null,
)

data class PriceAlarm(
    val symbol: String,
    val price: Double,
    val above: Boolean,
)

data class Settings(
    val notificationsEnabled: Boolean = true,
    val checkIntervalMin: Int = 15,
    val autoStopPct: Double = 8.0,
    val autoTargetPct: Double = 20.0,
    val dailyDropAlertPct: Double = 5.0,
    val notifySellSignals: Boolean = true,
    val notifyBuySignals: Boolean = false,
    val notifyMarketRisk: Boolean = true,
    val dailySummary: Boolean = true,
)

object Universe {
    val markets = listOf(
        Instrument("XU100.IS", "BIST 100", AssetType.INDEX),
        Instrument("XU030.IS", "BIST 30", AssetType.INDEX),
        Instrument("XBANK.IS", "BIST Banka", AssetType.INDEX),
        Instrument("USDTRY=X", "Dolar / TL", AssetType.FX),
        Instrument("EURTRY=X", "Euro / TL", AssetType.FX),
        Instrument("EURUSD=X", "Euro / Dolar", AssetType.FX),
        Instrument(GRAM_GOLD, "Gram Altın (TL)", AssetType.COMMODITY),
        Instrument("GC=F", "Ons Altın ($)", AssetType.COMMODITY),
        Instrument("SI=F", "Gümüş ($)", AssetType.COMMODITY),
        Instrument("BZ=F", "Brent Petrol ($)", AssetType.COMMODITY),
        Instrument("CL=F", "WTI Petrol ($)", AssetType.COMMODITY),
        Instrument("^GSPC", "S&P 500", AssetType.GLOBAL),
        Instrument("^VIX", "VIX Korku Endeksi", AssetType.GLOBAL),
        Instrument("BTC-USD", "Bitcoin ($)", AssetType.GLOBAL),
    )

    const val GRAM_GOLD = "GRAMALTIN"

    val defaultStocks = listOf(
        "THYAO", "ASELS", "GARAN", "AKBNK", "YKBNK", "ISCTR", "EREGL", "BIMAS",
        "KCHOL", "SAHOL", "SISE", "TUPRS", "FROTO", "TOASO", "PGSUS", "TCELL", "ARCLK", "KRDMD",
    )

    /** Taranan hisse evreni: BIST 100 bileşenleri (dönemsel değişebilir; geçersiz kodlar sessizce atlanır). */
    val bist100 = listOf(
        "AEFES", "AGHOL", "AHGAZ", "AKBNK", "AKSA", "AKSEN", "ALARK", "ALFAS", "ALTNY", "ANSGR", "ARCLK", "ASELS",
        "ASTOR", "BERA", "BIMAS", "BRSAN", "BRYAT", "BSOKE", "BTCIM", "CANTE", "CCOLA", "CIMSA", "CLEBI", "CWENE",
        "DOAS", "DOHOL", "ECILC", "EGEEN", "EKGYO", "ENERY", "ENJSA", "ENKAI", "EREGL", "EUPWR", "FENER", "FROTO",
        "GARAN", "GESAN", "GOLTS", "GRSEL", "GUBRF", "HALKB", "HEKTS", "ISCTR", "ISMEN", "IZENR", "KCAER", "KCHOL",
        "KONTR", "TRALT", "TRMET", "KRDMD", "KTLEV", "LMKDC", "MAGEN", "MAVI", "MGROS", "MIATK", "MPARK", "OBAMS",
        "ODAS", "OTKAR", "OYAKC", "PASEU", "PETKM", "PGSUS", "QUAGR", "RALYH", "REEDR", "SAHOL", "SASA", "SELEC",
        "SISE", "SKBNK", "SMRTG", "SOKM", "TABGD", "TAVHL", "TCELL", "THYAO", "TKFEN", "TMSN", "TOASO", "TSKB",
        "TTKOM", "TTRAK", "TUKAS", "TUPRS", "TURSG", "ULKER", "VAKBN", "VESBE", "VESTL", "YEOTK", "YKBNK", "ZOREN",
    )

    private val stockNames = mapOf(
        "THYAO" to "Türk Hava Yolları", "ASELS" to "Aselsan", "GARAN" to "Garanti BBVA",
        "AKBNK" to "Akbank", "YKBNK" to "Yapı Kredi", "ISCTR" to "İş Bankası",
        "EREGL" to "Ereğli Demir Çelik", "BIMAS" to "BİM", "KCHOL" to "Koç Holding",
        "SAHOL" to "Sabancı Holding", "SISE" to "Şişecam", "TUPRS" to "Tüpraş",
        "FROTO" to "Ford Otosan", "TOASO" to "Tofaş", "PGSUS" to "Pegasus",
        "TCELL" to "Turkcell", "ARCLK" to "Arçelik", "KRDMD" to "Kardemir",
        "HEKTS" to "Hektaş", "SASA" to "Sasa", "PETKM" to "Petkim", "TTKOM" to "Türk Telekom",
        "ENKAI" to "Enka", "TRALT" to "Türk Altın (eski KOZAL)", "VESTL" to "Vestel", "ULKER" to "Ülker",
        "MGROS" to "Migros", "AEFES" to "Anadolu Efes", "TAVHL" to "TAV Havalimanları",
        "VAKBN" to "Vakıfbank", "HALKB" to "Halkbank", "ASTOR" to "Astor Enerji",
    )

    fun stock(code: String): Instrument {
        val c = code.uppercase().removeSuffix(".IS").trim()
        return Instrument("$c.IS", stockNames[c] ?: c, AssetType.STOCK)
    }

    fun find(symbol: String): Instrument =
        markets.firstOrNull { it.symbol == symbol } ?: stock(symbol)

    /** Kullanıcı girdisini sembole çevirir: "thyao" -> THYAO.IS, "dolar" -> USDTRY=X */
    fun resolve(input: String): Instrument {
        val t = input.trim().uppercase(java.util.Locale("tr"))
        val alias = mapOf(
            "DOLAR" to "USDTRY=X", "USD" to "USDTRY=X", "EURO" to "EURTRY=X", "EUR" to "EURTRY=X",
            "ALTIN" to GRAM_GOLD, "GRAM ALTIN" to GRAM_GOLD, "ONS" to "GC=F", "GÜMÜŞ" to "SI=F",
            "PETROL" to "BZ=F", "BRENT" to "BZ=F", "BIST" to "XU100.IS", "BIST100" to "XU100.IS", "BITCOIN" to "BTC-USD",
        )
        alias[t]?.let { return find(it) }
        markets.firstOrNull { it.symbol.equals(t, true) }?.let { return it }
        return stock(t)
    }

    fun displayCode(i: Instrument) =
        if (i.type == AssetType.STOCK) i.symbol.removeSuffix(".IS") else i.name
}
