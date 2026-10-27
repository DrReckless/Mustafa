package com.mustafa.emlaktakip.data

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

private fun now() = System.currentTimeMillis()

@Entity(tableName = "contractors")
data class Contractor(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String = "",
    val company: String = "",
    val phone: String = "",
    val phone2: String = "",
    val email: String = "",
    val region: String = "",
    val address: String = "",
    val rating: Int = 0,
    val notes: String = "",
    val createdAt: Long = now(),
    val updatedAt: Long = now(),
)

@Entity(tableName = "listings", indices = [Index("buildingId")])
data class Listing(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String = "",
    val listingNo: String = "",
    val url: String = "",
    val listingType: String = "SATILIK",
    val propertyType: String = "Daire",
    val price: Long? = null,
    val sqm: Int? = null,
    val rooms: String = "",
    val floor: String = "",
    val buildingAge: String = "",
    val district: String = "",
    val neighborhood: String = "",
    val address: String = "",
    val ownerName: String = "",
    val ownerPhone: String = "",
    val ownerType: String = "Sahibinden",
    val status: String = "YENI",
    val buildingId: Long? = null,
    val notes: String = "",
    val createdAt: Long = now(),
    val updatedAt: Long = now(),
)

/** Müteahhitlerin iş karşılığı verdiği daireler */
@Entity(tableName = "units", indices = [Index("contractorId"), Index("buildingId")])
data class ExchangeUnit(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val contractorId: Long? = null,
    val projectName: String = "",
    val workDescription: String = "",
    val district: String = "",
    val neighborhood: String = "",
    val address: String = "",
    val block: String = "",
    val floor: String = "",
    val unitNo: String = "",
    val rooms: String = "",
    val sqm: Int? = null,
    val price: Long? = null,
    val status: String = "MUSAIT",
    val buildingId: Long? = null,
    val notes: String = "",
    val createdAt: Long = now(),
    val updatedAt: Long = now(),
)

/** Kat karşılığı verilen arsalar */
@Entity(tableName = "lands", indices = [Index("contractorId"), Index("buildingId")])
data class LandDeal(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String = "",
    val contractorId: Long? = null,
    val ownerName: String = "",
    val ownerPhone: String = "",
    val district: String = "",
    val neighborhood: String = "",
    val ada: String = "",
    val parsel: String = "",
    val sqm: Int? = null,
    val zoning: String = "",
    val emsal: String = "",
    val maxFloors: String = "",
    val ownerSharePercent: Int? = null,
    val ownerUnits: String = "",
    val price: Long? = null,
    val status: String = "GORUSULUYOR",
    val buildingId: Long? = null,
    val notes: String = "",
    val createdAt: Long = now(),
    val updatedAt: Long = now(),
)

@Entity(tableName = "investors")
data class Investor(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String = "",
    val phone: String = "",
    val email: String = "",
    val profession: String = "",
    val budgetMin: Long? = null,
    val budgetMax: Long? = null,
    val propertyTypes: String = "",
    val regions: String = "",
    val temperature: String = "ILIK",
    val lastContactAt: Long? = null,
    val nextContactAt: Long? = null,
    val notes: String = "",
    val createdAt: Long = now(),
    val updatedAt: Long = now(),
)

/** Yatırımcının ilgilendiği / önerilen portföy (ilan, daire veya arsa) */
@Entity(
    tableName = "investor_interests",
    indices = [Index("investorId"), Index(value = ["itemType", "itemId"])],
)
data class InvestorInterest(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val investorId: Long,
    val itemType: String,
    val itemId: Long,
    val note: String = "",
    val createdAt: Long = now(),
)

@Entity(tableName = "kml_layers")
data class KmlLayer(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String = "",
    val fileName: String = "",
    val visible: Boolean = true,
    val importedAt: Long = now(),
)

/**
 * Harita üzerindeki bina / yapı / parsel. KML'den gelir veya haritada uzun
 * basılarak eklenir. coords: "lon,lat lon,lat ..." halkalar '|' ile ayrılır.
 */
@Entity(tableName = "buildings", indices = [Index("layerId")])
data class Building(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val layerId: Long? = null,
    val name: String = "",
    val address: String = "",
    val siteName: String = "",
    val lat: Double = 0.0,
    val lon: Double = 0.0,
    val geomType: String = "Point",
    val coords: String = "",
    val buildingType: String = "Konut",
    val floors: Int? = null,
    val unitCount: Int? = null,
    val buildYear: Int? = null,
    val status: String = "",
    val kmlDescription: String = "",
    val extraData: String = "",
    val notes: String = "",
    val createdAt: Long = now(),
    val updatedAt: Long = now(),
)

/** Binalardaki güvenlik, kapıcı, yönetici vb. kişiler */
@Entity(tableName = "building_contacts", indices = [Index("buildingId")])
data class BuildingContact(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val buildingId: Long? = null,
    val buildingName: String = "",
    val role: String = "KAPICI",
    val name: String = "",
    val phone: String = "",
    val workHours: String = "",
    val notes: String = "",
    val createdAt: Long = now(),
    val updatedAt: Long = now(),
)

@Entity(tableName = "tasks", indices = [Index(value = ["linkType", "linkId"]), Index("dueAt")])
data class TaskItem(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String = "",
    val description: String = "",
    val dueAt: Long? = null,
    val remind: Boolean = true,
    val repeat: String = "NONE",
    val priority: Int = 0,
    val done: Boolean = false,
    val doneAt: Long? = null,
    val linkType: String? = null,
    val linkId: Long? = null,
    val createdAt: Long = now(),
)

/** Arama ve seçim listeleri için ortak satır */
data class PickItem(val type: LinkType, val id: Long, val title: String, val subtitle: String = "")

/** Binaya ait fotoğraf. Dosya, uygulamanın kendi klasöründe (files/photos) durur. */
@Entity(tableName = "building_photos", indices = [Index("buildingId")])
data class BuildingPhoto(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val buildingId: Long,
    val fileName: String,
    val caption: String = "",
    val createdAt: Long = now(),
)
