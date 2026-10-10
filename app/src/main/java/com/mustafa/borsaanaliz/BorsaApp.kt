package com.mustafa.borsaanaliz

import android.app.Application
import com.mustafa.borsaanaliz.data.Prefs
import com.mustafa.borsaanaliz.worker.MonitorScheduler
import com.mustafa.borsaanaliz.worker.Notifier

class BorsaApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Notifier.createChannels(this)
        MonitorScheduler.schedule(this, Prefs(this).settings().checkIntervalMin)
    }
}
