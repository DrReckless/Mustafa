package com.mustafa.emlaktakip.data

/** Seçmeli alanlar için anahtar + Türkçe etiket + renk (ARGB). */
data class Option(val key: String, val label: String, val color: Long = 0xFF607D8B)

fun List<Option>.labelOf(key: String?): String = firstOrNull { it.key == key }?.label ?: (key ?: "")
fun List<Option>.colorOf(key: String?): Long = firstOrNull { it.key == key }?.color ?: 0xFF607D8B

object Options {
    val listingStatus = listOf(
        Option("YENI", "Yeni", 0xFF1E88E5),
        Option("ARANDI", "Arandı", 0xFF8E24AA),
        Option("GORULDU", "Görüldü", 0xFFF4A62A),
        Option("TEKLIF", "Teklif", 0xFFE65100),
        Option("ANLASILDI", "Anlaşıldı", 0xFF2E7D32),
        Option("PASIF", "Pasif", 0xFF757575),
    )
    val listingType = listOf(
        Option("SATILIK", "Satılık"),
        Option("KIRALIK", "Kiralık"),
    )
    val propertyType = listOf(
        Option("Daire", "Daire"),
        Option("Müstakil", "Müstakil"),
        Option("Villa", "Villa"),
        Option("Arsa", "Arsa"),
        Option("Dükkan", "Dükkan"),
        Option("Ofis", "Ofis"),
        Option("Bina", "Bina"),
        Option("Diğer", "Diğer"),
    )
    val ownerType = listOf(
        Option("Sahibinden", "Sahibinden"),
        Option("Emlakçı", "Emlakçı"),
        Option("Müteahhit", "Müteahhit"),
    )
    val unitStatus = listOf(
        Option("MUSAIT", "Müsait", 0xFF2E7D32),
        Option("REZERVE", "Rezerve", 0xFFF4A62A),
        Option("SATILDI", "Satıldı", 0xFF757575),
    )
    val landStatus = listOf(
        Option("GORUSULUYOR", "Görüşülüyor", 0xFF1E88E5),
        Option("TEKLIF", "Teklif Verildi", 0xFFE65100),
        Option("ANLASILDI", "Anlaşıldı", 0xFF2E7D32),
        Option("IPTAL", "İptal", 0xFF757575),
    )
    val investorTemp = listOf(
        Option("SICAK", "Sıcak", 0xFFD32F2F),
        Option("ILIK", "Ilık", 0xFFF4A62A),
        Option("SOGUK", "Soğuk", 0xFF1E88E5),
    )
    val contactRole = listOf(
        Option("GUVENLIK", "Güvenlik", 0xFF37474F),
        Option("KAPICI", "Kapıcı", 0xFF6D4C41),
        Option("YONETICI", "Yönetici", 0xFF0E4D64),
        Option("SITE_MUDURU", "Site Müdürü", 0xFF00897B),
        Option("DIGER", "Diğer", 0xFF757575),
    )
    val buildingStatus = listOf(
        Option("", "Ziyaret edilmedi", 0xFF1E88E5),
        Option("ZIYARET", "Ziyaret edildi", 0xFFF4A62A),
        Option("PORTFOY", "Portföyde", 0xFF2E7D32),
        Option("TAKIP", "Takipte", 0xFF8E24AA),
        Option("ILGISIZ", "İlgilenmiyor", 0xFF757575),
    )
    val buildingType = listOf(
        Option("Konut", "Konut"),
        Option("Site", "Site"),
        Option("Ticari", "Ticari"),
        Option("Karma", "Karma"),
        Option("İnşaat", "İnşaat"),
        Option("Arsa", "Arsa"),
    )
    val taskRepeat = listOf(
        Option("NONE", "Tekrar yok"),
        Option("DAILY", "Her gün"),
        Option("WEEKLY", "Her hafta"),
        Option("MONTHLY", "Her ay"),
    )
    val taskPriority = listOf(
        Option("0", "Normal", 0xFF607D8B),
        Option("1", "Önemli", 0xFFF4A62A),
        Option("2", "Acil", 0xFFD32F2F),
    )
}

/** Görevlerin ve yatırımcı ilgilerinin bağlanabildiği kayıt türleri. */
enum class LinkType(val label: String, val route: String) {
    CONTRACTOR("Müteahhit", "contractor"),
    LISTING("İlan", "listing"),
    UNIT("İş Karşılığı Daire", "unit"),
    LAND("Kat Karşılığı Arsa", "land"),
    INVESTOR("Yatırımcı", "investor"),
    CONTACT("Bina Görevlisi", "contact"),
    BUILDING("Bina", "building");

    companion object {
        fun of(name: String?): LinkType? = entries.firstOrNull { it.name == name }
        /** Yatırımcıya önerilebilen portföy türleri */
        val portfolio = listOf(LISTING, UNIT, LAND)
    }
}
