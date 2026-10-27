package com.mustafa.emlaktakip.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [
        Contractor::class, Listing::class, ExchangeUnit::class, LandDeal::class,
        Investor::class, InvestorInterest::class, KmlLayer::class, Building::class,
        BuildingContact::class, TaskItem::class,
    ],
    version = 1,
    exportSchema = false,
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun dao(): AppDao

    companion object {
        const val NAME = "emlak_takip.db"

        @Volatile private var instance: AppDatabase? = null

        fun get(context: Context): AppDatabase = instance ?: synchronized(this) {
            instance ?: Room.databaseBuilder(context.applicationContext, AppDatabase::class.java, NAME)
                .build().also { instance = it }
        }

        /** Yedek geri yüklenmeden önce veritabanını kapatır. */
        fun closeAndReset() = synchronized(this) {
            instance?.close()
            instance = null
        }
    }
}
