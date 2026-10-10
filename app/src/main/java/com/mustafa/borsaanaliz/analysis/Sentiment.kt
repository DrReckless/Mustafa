package com.mustafa.borsaanaliz.analysis

import java.util.Locale

/** Türkçe ekonomi haber başlıkları için basit sözlük tabanlı duygu analizi. */
object Sentiment {
    private val tr = Locale("tr")

    private val positive = listOf(
        "yüksel", "yükseliş", "rekor kâr", "rekor kar", "artış", "arttı", "artırdı", "kazanç", "kazandı", "kazandır",
        "kâr", "net kar", "büyüme", "büyüdü", "olumlu", "toparlan", "ralli", "güçlü", "iyimser", "alım fırsatı",
        "hedef fiyat", "temettü", "faiz indirimi", "indirime gitti", "prim yaptı", "zirve", "pozitif", "anlaşma imzaladı",
        "ihracat", "yatırım", "sözleşme", "ihale kazandı", "geri alım", "not artırımı", "yükseltti", "beklentilerin üzerinde",
        "tavan", "rekor ihracat", "istikrar", "dezenflasyon", "güven endeksi yükseldi", "sipariş",
    )
    private val negative = listOf(
        "düşüş", "düştü", "geriledi", "geriliyor", "kayıp", "kaybetti", "zarar", "kriz", "olumsuz", "endişe",
        "savaş", "gerilim", "çatışma", "faiz artırımı", "faizi artırdı", "satış baskısı", "sert düş", "çöküş", "çöktü",
        "iflas", "konkordato", "ceza", "soruşturma", "yaptırım", "daralma", "daraldı", "resesyon", "durgunluk",
        "değer kaybı", "eridi", "taban", "panik", "belirsizlik", "not indirimi", "düşürdü", "beklentilerin altında",
        "işsizlik", "temerrüt", "uyarı", "tehdit", "saldırı", "deprem", "grev", "sert satış", "kan kaybı",
    )

    /** -100 (çok olumsuz) .. 100 (çok olumlu) */
    fun score(text: String): Int {
        val t = text.lowercase(tr)
        var s = 0
        positive.forEach { if (t.contains(it)) s += 1 }
        negative.forEach { if (t.contains(it)) s -= 1 }
        // Türkiye bağlamı: kur/enflasyon "yükselişi" piyasa için olumsuzdur.
        val fxOrInflation = listOf("dolar", "euro", "kur ", "kurda", "enflasyon", "cds", "faiz oran", "petrol")
        if (fxOrInflation.any { t.contains(it) } && (t.contains("yüksel") || t.contains("rekor") || t.contains("arttı"))) s -= 2
        if (fxOrInflation.any { t.contains(it) } && (t.contains("geriledi") || t.contains("düştü"))) s += 2
        return (s * 34).coerceIn(-100, 100)
    }

    fun label(score: Int) = when {
        score >= 30 -> "Olumlu"
        score <= -30 -> "Olumsuz"
        else -> "Nötr"
    }
}
