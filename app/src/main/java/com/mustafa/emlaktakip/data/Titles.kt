package com.mustafa.emlaktakip.data

import com.mustafa.emlaktakip.util.Fmt
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map

/** Kayıtların listelerde ve bağlantılarda görünen başlıkları. */
object Titles {
    fun contractor(c: Contractor) = c.name.ifBlank { c.company.ifBlank { "İsimsiz müteahhit" } }

    fun listing(l: Listing) = l.title.ifBlank {
        listOf(l.rooms, l.propertyType, l.neighborhood).filter { it.isNotBlank() }.joinToString(" ")
            .ifBlank { "İlan #${l.id}" }
    }

    fun unit(u: ExchangeUnit): String {
        val parts = buildList {
            if (u.projectName.isNotBlank()) add(u.projectName)
            if (u.block.isNotBlank()) add("${u.block} Blok")
            if (u.floor.isNotBlank()) add("Kat ${u.floor}")
            if (u.unitNo.isNotBlank()) add("No ${u.unitNo}")
        }
        return parts.joinToString(" · ").ifBlank { "Daire #${u.id}" }
    }

    fun land(l: LandDeal) = l.title.ifBlank {
        val adaParsel = if (l.ada.isNotBlank() || l.parsel.isNotBlank()) "${l.ada}/${l.parsel} ada/parsel" else ""
        listOf(l.neighborhood.ifBlank { l.district }, adaParsel).filter { it.isNotBlank() }.joinToString(" ")
            .ifBlank { "Arsa #${l.id}" }
    }

    fun investor(i: Investor) = i.name.ifBlank { "İsimsiz yatırımcı" }
    fun contact(c: BuildingContact) = c.name.ifBlank { Options.contactRole.labelOf(c.role) }
    fun building(b: Building) = b.name.ifBlank { b.address.ifBlank { "Bina #${b.id}" } }

    fun pick(c: Contractor) = PickItem(LinkType.CONTRACTOR, c.id, contractor(c),
        listOf(c.company, c.region, c.phone).filter { it.isNotBlank() }.joinToString(" · "))
    fun pick(l: Listing) = PickItem(LinkType.LISTING, l.id, listing(l),
        listOf(Fmt.money(l.price), l.district, l.listingNo).filter { it.isNotBlank() }.joinToString(" · "))
    fun pick(u: ExchangeUnit) = PickItem(LinkType.UNIT, u.id, unit(u),
        listOf(u.rooms, Fmt.money(u.price), u.district).filter { it.isNotBlank() }.joinToString(" · "))
    fun pick(l: LandDeal) = PickItem(LinkType.LAND, l.id, land(l),
        listOf(l.ownerName, Fmt.sqm(l.sqm), l.district).filter { it.isNotBlank() }.joinToString(" · "))
    fun pick(i: Investor) = PickItem(LinkType.INVESTOR, i.id, investor(i),
        listOf(Fmt.budget(i.budgetMin, i.budgetMax), i.regions).filter { it.isNotBlank() }.joinToString(" · "))
    fun pick(c: BuildingContact) = PickItem(LinkType.CONTACT, c.id, contact(c),
        listOf(Options.contactRole.labelOf(c.role), c.buildingName, c.phone).filter { it.isNotBlank() }.joinToString(" · "))
    fun pick(b: Building) = PickItem(LinkType.BUILDING, b.id, building(b),
        listOf(b.siteName, b.address).filter { it.isNotBlank() }.joinToString(" · "))
}

/** Bir kayıt türünün tüm kayıtlarını seçim listesi olarak verir. */
fun AppDao.pickItems(type: LinkType): Flow<List<PickItem>> = when (type) {
    LinkType.CONTRACTOR -> contractors().map { l -> l.map(Titles::pick) }
    LinkType.LISTING -> listings().map { l -> l.map(Titles::pick) }
    LinkType.UNIT -> units().map { l -> l.map(Titles::pick) }
    LinkType.LAND -> lands().map { l -> l.map(Titles::pick) }
    LinkType.INVESTOR -> investors().map { l -> l.map(Titles::pick) }
    LinkType.CONTACT -> contacts().map { l -> l.map(Titles::pick) }
    LinkType.BUILDING -> buildings().map { l -> l.map(Titles::pick) }
}

/** Genel arama için tüm kayıtlar */
fun AppDao.everything(): Flow<List<PickItem>> = combine(
    LinkType.entries.map { pickItems(it) }
) { arrays -> arrays.flatMap { it } }

/** Ham alanlarla birlikte aranabilir metin (arama için not, telefon vb. dahil) */
fun AppDao.searchIndex(): Flow<List<Pair<PickItem, String>>> = combine(
    listOf(
        contractors().map { l -> l.map { Titles.pick(it) to "${it.name} ${it.company} ${it.phone} ${it.phone2} ${it.region} ${it.address} ${it.notes}" } },
        listings().map { l -> l.map { Titles.pick(it) to "${it.title} ${it.listingNo} ${it.district} ${it.neighborhood} ${it.address} ${it.ownerName} ${it.ownerPhone} ${it.notes}" } },
        units().map { l -> l.map { Titles.pick(it) to "${it.projectName} ${it.workDescription} ${it.district} ${it.neighborhood} ${it.address} ${it.notes}" } },
        lands().map { l -> l.map { Titles.pick(it) to "${it.title} ${it.ownerName} ${it.ownerPhone} ${it.district} ${it.neighborhood} ${it.ada} ${it.parsel} ${it.notes}" } },
        investors().map { l -> l.map { Titles.pick(it) to "${it.name} ${it.phone} ${it.email} ${it.regions} ${it.propertyTypes} ${it.notes}" } },
        contacts().map { l -> l.map { Titles.pick(it) to "${it.name} ${it.phone} ${it.buildingName} ${it.notes}" } },
        buildings().map { l -> l.map { Titles.pick(it) to "${it.name} ${it.siteName} ${it.address} ${it.notes} ${it.kmlDescription}" } },
    )
) { arrays -> arrays.flatMap { it } }

suspend fun AppDao.linkTitle(type: LinkType, id: Long): String? = when (type) {
    LinkType.CONTRACTOR -> getContractor(id)?.let(Titles::contractor)
    LinkType.LISTING -> getListing(id)?.let(Titles::listing)
    LinkType.UNIT -> getUnit(id)?.let(Titles::unit)
    LinkType.LAND -> getLand(id)?.let(Titles::land)
    LinkType.INVESTOR -> getInvestor(id)?.let(Titles::investor)
    LinkType.CONTACT -> getContact(id)?.let(Titles::contact)
    LinkType.BUILDING -> getBuilding(id)?.let(Titles::building)
}
