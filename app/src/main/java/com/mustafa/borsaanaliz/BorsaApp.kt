package com.mustafa.borsaanaliz

import android.app.Application
import com.mustafa.borsaanaliz.data.Prefs
import com.mustafa.borsaanaliz.data.Repository
import com.mustafa.borsaanaliz.worker.MonitorScheduler
import com.mustafa.borsaanaliz.worker.Notifier

class BorsaApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Notifier.createChannels(this)
        Repository.prefs = Prefs(this)
        // Kayıtlı son coin listesindeki adları yükler (yedek kaynaklar coinleri tanıyabilsin)
        runCatching { Repository.prefs?.savedCoins() }
        MonitorScheduler.schedule(this, Prefs(this).settings().checkIntervalMin)
    }
}
