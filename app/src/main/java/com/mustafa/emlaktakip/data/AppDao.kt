package com.mustafa.emlaktakip.data

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Transaction
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface AppDao {
    // ---------- Müteahhitler ----------
    @Query("SELECT * FROM contractors ORDER BY name COLLATE NOCASE")
    fun contractors(): Flow<List<Contractor>>
    @Query("SELECT * FROM contractors WHERE id = :id")
    fun contractor(id: Long): Flow<Contractor?>
    @Query("SELECT * FROM contractors WHERE id = :id")
    suspend fun getContractor(id: Long): Contractor?
    @Insert suspend fun insert(item: Contractor): Long
    @Update suspend fun update(item: Contractor)
    @Delete suspend fun delete(item: Contractor)

    // ---------- İlanlar ----------
    @Query("SELECT * FROM listings ORDER BY updatedAt DESC")
    fun listings(): Flow<List<Listing>>
    @Query("SELECT * FROM listings WHERE id = :id")
    fun listing(id: Long): Flow<Listing?>
    @Query("SELECT * FROM listings WHERE id = :id")
    suspend fun getListing(id: Long): Listing?
    @Query("SELECT * FROM listings WHERE buildingId = :buildingId ORDER BY updatedAt DESC")
    fun listingsByBuilding(buildingId: Long): Flow<List<Listing>>
    @Insert suspend fun insert(item: Listing): Long
    @Update suspend fun update(item: Listing)
    @Delete suspend fun delete(item: Listing)

    // ---------- İş karşılığı daireler ----------
    @Query("SELECT * FROM units ORDER BY updatedAt DESC")
    fun units(): Flow<List<ExchangeUnit>>
    @Query("SELECT * FROM units WHERE id = :id")
    fun unit(id: Long): Flow<ExchangeUnit?>
    @Query("SELECT * FROM units WHERE id = :id")
    suspend fun getUnit(id: Long): ExchangeUnit?
    @Query("SELECT * FROM units WHERE contractorId = :contractorId ORDER BY updatedAt DESC")
    fun unitsByContractor(contractorId: Long): Flow<List<ExchangeUnit>>
    @Query("SELECT * FROM units WHERE buildingId = :buildingId ORDER BY updatedAt DESC")
    fun unitsByBuilding(buildingId: Long): Flow<List<ExchangeUnit>>
    @Query("SELECT COUNT(*) FROM units WHERE contractorId = :contractorId")
    suspend fun unitsByContractorList(contractorId: Long): Int
    @Insert suspend fun insert(item: ExchangeUnit): Long
    @Update suspend fun update(item: ExchangeUnit)
    @Delete suspend fun delete(item: ExchangeUnit)

    // ---------- Kat karşılığı arsalar ----------
    @Query("SELECT * FROM lands ORDER BY updatedAt DESC")
    fun lands(): Flow<List<LandDeal>>
    @Query("SELECT * FROM lands WHERE id = :id")
    fun land(id: Long): Flow<LandDeal?>
    @Query("SELECT * FROM lands WHERE id = :id")
    suspend fun getLand(id: Long): LandDeal?
    @Query("SELECT * FROM lands WHERE contractorId = :contractorId ORDER BY updatedAt DESC")
    fun landsByContractor(contractorId: Long): Flow<List<LandDeal>>
    @Query("SELECT * FROM lands WHERE buildingId = :buildingId ORDER BY updatedAt DESC")
    fun landsByBuilding(buildingId: Long): Flow<List<LandDeal>>
    @Insert suspend fun insert(item: LandDeal): Long
    @Update suspend fun update(item: LandDeal)
    @Delete suspend fun delete(item: LandDeal)

    // ---------- Yatırımcılar ----------
    @Query("SELECT * FROM investors ORDER BY name COLLATE NOCASE")
    fun investors(): Flow<List<Investor>>
    @Query("SELECT * FROM investors WHERE id = :id")
    fun investor(id: Long): Flow<Investor?>
    @Query("SELECT * FROM investors WHERE id = :id")
    suspend fun getInvestor(id: Long): Investor?
    @Insert suspend fun insert(item: Investor): Long
    @Update suspend fun update(item: Investor)
    @Delete suspend fun delete(item: Investor)

    @Query("SELECT * FROM investor_interests WHERE investorId = :investorId ORDER BY createdAt DESC")
    fun interestsByInvestor(investorId: Long): Flow<List<InvestorInterest>>
    @Query(
        "SELECT investors.* FROM investors INNER JOIN investor_interests ii ON ii.investorId = investors.id " +
            "WHERE ii.itemType = :itemType AND ii.itemId = :itemId ORDER BY investors.name COLLATE NOCASE"
    )
    fun investorsForItem(itemType: String, itemId: Long): Flow<List<Investor>>
    @Query("SELECT COUNT(*) FROM investor_interests WHERE investorId = :investorId AND itemType = :itemType AND itemId = :itemId")
    suspend fun interestCount(investorId: Long, itemType: String, itemId: Long): Int
    @Insert suspend fun insert(item: InvestorInterest): Long
    @Query("DELETE FROM investor_interests WHERE investorId = :investorId AND itemType = :itemType AND itemId = :itemId")
    suspend fun deleteInterest(investorId: Long, itemType: String, itemId: Long)

    // ---------- KML katmanları ----------
    @Query("SELECT * FROM kml_layers ORDER BY importedAt DESC")
    fun layers(): Flow<List<KmlLayer>>
    @Query("SELECT * FROM kml_layers WHERE id = :id")
    suspend fun getLayer(id: Long): KmlLayer?
    @Insert suspend fun insert(item: KmlLayer): Long
    @Update suspend fun update(item: KmlLayer)
    @Delete suspend fun delete(item: KmlLayer)

    // ---------- Binalar ----------
    @Query("SELECT * FROM buildings ORDER BY name COLLATE NOCASE")
    fun buildings(): Flow<List<Building>>
    @Query("SELECT * FROM buildings WHERE id = :id")
    fun building(id: Long): Flow<Building?>
    @Query("SELECT * FROM buildings WHERE id = :id")
    suspend fun getBuilding(id: Long): Building?
    @Query("SELECT * FROM buildings WHERE layerId = :layerId")
    suspend fun buildingsInLayer(layerId: Long): List<Building>
    @Query("SELECT * FROM buildings")
    suspend fun allBuildings(): List<Building>
    @Query("SELECT COUNT(*) FROM buildings WHERE layerId = :layerId")
    fun buildingCountInLayer(layerId: Long): Flow<Int>
    @Insert suspend fun insert(item: Building): Long
    @Insert suspend fun insertBuildings(items: List<Building>)
    @Update suspend fun update(item: Building)
    @Delete suspend fun delete(item: Building)

    // ---------- Bina görevlileri ----------
    @Query("SELECT * FROM building_contacts ORDER BY name COLLATE NOCASE")
    fun contacts(): Flow<List<BuildingContact>>
    @Query("SELECT * FROM building_contacts WHERE id = :id")
    fun contact(id: Long): Flow<BuildingContact?>
    @Query("SELECT * FROM building_contacts WHERE id = :id")
    suspend fun getContact(id: Long): BuildingContact?
    @Query("SELECT * FROM building_contacts WHERE buildingId = :buildingId ORDER BY role, name")
    fun contactsByBuilding(buildingId: Long): Flow<List<BuildingContact>>
    @Query("SELECT * FROM building_contacts WHERE buildingId = :buildingId")
    suspend fun getContactsByBuilding(buildingId: Long): List<BuildingContact>
    @Insert suspend fun insert(item: BuildingContact): Long
    @Update suspend fun update(item: BuildingContact)
    @Delete suspend fun delete(item: BuildingContact)

    // ---------- Bina fotoğrafları ----------
    @Query("SELECT * FROM building_photos WHERE buildingId = :buildingId ORDER BY createdAt")
    fun photosByBuilding(buildingId: Long): Flow<List<BuildingPhoto>>
    @Query("SELECT COUNT(*) FROM building_photos WHERE buildingId = :buildingId")
    fun photoCount(buildingId: Long): Flow<Int>
    @Query("SELECT fileName FROM building_photos")
    suspend fun allPhotoFileNames(): List<String>
    @Insert suspend fun insert(item: BuildingPhoto): Long
    @Update suspend fun update(item: BuildingPhoto)
    @Delete suspend fun delete(item: BuildingPhoto)
    @Query("DELETE FROM building_photos WHERE buildingId = :buildingId")
    suspend fun deletePhotosForBuilding(buildingId: Long)

    // ---------- Görevler ----------
    @Query("SELECT * FROM tasks WHERE done = 0 ORDER BY CASE WHEN dueAt IS NULL THEN 1 ELSE 0 END, dueAt, priority DESC")
    fun openTasks(): Flow<List<TaskItem>>
    @Query("SELECT * FROM tasks WHERE done = 1 ORDER BY doneAt DESC LIMIT 500")
    fun doneTasks(): Flow<List<TaskItem>>
    @Query("SELECT * FROM tasks WHERE linkType = :linkType AND linkId = :linkId ORDER BY done, dueAt")
    fun tasksForLink(linkType: String, linkId: Long): Flow<List<TaskItem>>
    @Query("SELECT * FROM tasks WHERE id = :id")
    suspend fun getTask(id: Long): TaskItem?
    @Query("SELECT * FROM tasks WHERE done = 0 AND remind = 1 AND dueAt > :now")
    suspend fun pendingReminders(now: Long): List<TaskItem>
    @Query("SELECT * FROM tasks WHERE done = 0 AND dueAt IS NOT NULL AND dueAt < :until ORDER BY dueAt")
    suspend fun openTasksUntil(until: Long): List<TaskItem>
    @Query("SELECT * FROM investors WHERE nextContactAt IS NOT NULL AND nextContactAt < :until ORDER BY nextContactAt")
    suspend fun investorsToContact(until: Long): List<Investor>
    @Insert suspend fun insert(item: TaskItem): Long
    @Update suspend fun update(item: TaskItem)
    @Delete suspend fun delete(item: TaskItem)

    // ---------- Sayılar ----------
    @Query("SELECT COUNT(*) FROM contractors") fun countContractors(): Flow<Int>
    @Query("SELECT COUNT(*) FROM listings") fun countListings(): Flow<Int>
    @Query("SELECT COUNT(*) FROM units") fun countUnits(): Flow<Int>
    @Query("SELECT COUNT(*) FROM lands") fun countLands(): Flow<Int>
    @Query("SELECT COUNT(*) FROM investors") fun countInvestors(): Flow<Int>
    @Query("SELECT COUNT(*) FROM building_contacts") fun countContacts(): Flow<Int>
    @Query("SELECT COUNT(*) FROM buildings") fun countBuildings(): Flow<Int>

    // ---------- Bağlantı temizliği ----------
    @Query("UPDATE units SET contractorId = NULL WHERE contractorId = :id")
    suspend fun unlinkContractorFromUnits(id: Long)
    @Query("UPDATE lands SET contractorId = NULL WHERE contractorId = :id")
    suspend fun unlinkContractorFromLands(id: Long)
    @Query("UPDATE listings SET buildingId = NULL WHERE buildingId = :id")
    suspend fun unlinkBuildingFromListings(id: Long)
    @Query("UPDATE units SET buildingId = NULL WHERE buildingId = :id")
    suspend fun unlinkBuildingFromUnits(id: Long)
    @Query("UPDATE lands SET buildingId = NULL WHERE buildingId = :id")
    suspend fun unlinkBuildingFromLands(id: Long)
    @Query("UPDATE building_contacts SET buildingId = NULL, buildingName = :name WHERE buildingId = :id")
    suspend fun unlinkBuildingFromContacts(id: Long, name: String)
    @Query("UPDATE tasks SET linkType = NULL, linkId = NULL WHERE linkType = :type AND linkId = :id")
    suspend fun unlinkTasks(type: String, id: Long)
    @Query("DELETE FROM investor_interests WHERE itemType = :type AND itemId = :id")
    suspend fun deleteInterestsForItem(type: String, id: Long)
    @Query("DELETE FROM investor_interests WHERE investorId = :id")
    suspend fun deleteInterestsForInvestor(id: Long)
    @Query("UPDATE buildings SET layerId = NULL WHERE layerId = :layerId")
    suspend fun detachLayerBuildings(layerId: Long)

    @Transaction
    suspend fun deleteContractorFull(item: Contractor) {
        unlinkContractorFromUnits(item.id)
        unlinkContractorFromLands(item.id)
        unlinkTasks(LinkType.CONTRACTOR.name, item.id)
        delete(item)
    }

    @Transaction
    suspend fun deleteListingFull(item: Listing) {
        deleteInterestsForItem(LinkType.LISTING.name, item.id)
        unlinkTasks(LinkType.LISTING.name, item.id)
        delete(item)
    }

    @Transaction
    suspend fun deleteUnitFull(item: ExchangeUnit) {
        deleteInterestsForItem(LinkType.UNIT.name, item.id)
        unlinkTasks(LinkType.UNIT.name, item.id)
        delete(item)
    }

    @Transaction
    suspend fun deleteLandFull(item: LandDeal) {
        deleteInterestsForItem(LinkType.LAND.name, item.id)
        unlinkTasks(LinkType.LAND.name, item.id)
        delete(item)
    }

    @Transaction
    suspend fun deleteInvestorFull(item: Investor) {
        deleteInterestsForInvestor(item.id)
        unlinkTasks(LinkType.INVESTOR.name, item.id)
        delete(item)
    }

    @Transaction
    suspend fun deleteContactFull(item: BuildingContact) {
        unlinkTasks(LinkType.CONTACT.name, item.id)
        delete(item)
    }

    @Transaction
    suspend fun deleteBuildingFull(item: Building) {
        unlinkBuildingFromListings(item.id)
        unlinkBuildingFromUnits(item.id)
        unlinkBuildingFromLands(item.id)
        unlinkBuildingFromContacts(item.id, item.name)
        unlinkTasks(LinkType.BUILDING.name, item.id)
        deletePhotosForBuilding(item.id) // dosyalar açılışta temizlenir
        delete(item)
    }

    /** Katmanı siler; withBuildings ise içindeki binaları da siler. */
    @Transaction
    suspend fun deleteLayerFull(layer: KmlLayer, withBuildings: Boolean) {
        if (withBuildings) {
            buildingsInLayer(layer.id).forEach { deleteBuildingFull(it) }
        } else {
            detachLayerBuildings(layer.id)
        }
        delete(layer)
    }

    @Transaction
    suspend fun importLayer(layer: KmlLayer, buildings: List<Building>): Long {
        val layerId = insert(layer)
        insertBuildings(buildings.map { it.copy(layerId = layerId) })
        return layerId
    }
}
