package com.mustafa.emlaktakip

import android.app.Application
import com.mustafa.emlaktakip.data.AppDatabase
import com.mustafa.emlaktakip.notify.Alarms
import com.mustafa.emlaktakip.util.Photos
import com.mustafa.emlaktakip.notify.Notifier
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import org.osmdroid.config.Configuration
import java.io.File

class EmlakApp : Application() {
    val appScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onCreate() {
        super.onCreate()
        Notifier.createChannels(this)
        Configuration.getInstance().apply {
            userAgentValue = packageName
            osmdroidBasePath = File(filesDir, "osmdroid")
            osmdroidTileCache = File(cacheDir, "osmdroid-tiles")
        }
        appScope.launch { Alarms.rescheduleAll(this@EmlakApp) }
        appScope.launch {
            runCatching { Photos.cleanOrphans(this@EmlakApp, AppDatabase.get(this@EmlakApp).dao()) }
        }
    }
}
