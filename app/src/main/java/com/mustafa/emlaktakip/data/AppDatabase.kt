package com.mustafa.emlaktakip.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase

@Database(
    entities = [
        Contractor::class, Listing::class, ExchangeUnit::class, LandDeal::class,
        Investor::class, InvestorInterest::class, KmlLayer::class, Building::class,
        BuildingContact::class, TaskItem::class, BuildingPhoto::class,
    ],
    version = 2,
    exportSchema = false,
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun dao(): AppDao

    companion object {
        const val NAME = "emlak_takip.db"

        /** 1 -> 2: bina fotoğrafları tablosu (mevcut kayıtlar korunur) */
        val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL(
                    "CREATE TABLE IF NOT EXISTS `building_photos` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, " +
                        "`buildingId` INTEGER NOT NULL, `fileName` TEXT NOT NULL, `caption` TEXT NOT NULL, `createdAt` INTEGER NOT NULL)"
                )
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_building_photos_buildingId` ON `building_photos` (`buildingId`)")
            }
        }

        @Volatile private var instance: AppDatabase? = null

        fun get(context: Context): AppDatabase = instance ?: synchronized(this) {
            instance ?: Room.databaseBuilder(context.applicationContext, AppDatabase::class.java, NAME)
                .addMigrations(MIGRATION_1_2)
                .build().also { instance = it }
        }

        /** Yedek geri yüklenmeden önce veritabanını kapatır. */
        fun closeAndReset() = synchronized(this) {
            instance?.close()
            instance = null
        }
    }
}
