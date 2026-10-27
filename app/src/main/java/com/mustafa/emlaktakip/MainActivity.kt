package com.mustafa.emlaktakip

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.mutableStateOf
import com.mustafa.emlaktakip.notify.Notifier
import com.mustafa.emlaktakip.ui.AppRoot
import com.mustafa.emlaktakip.ui.theme.EmlakTheme

class MainActivity : ComponentActivity() {
    /** Dışarıdan açılan KML dosyası */
    val pendingKml = mutableStateOf<Uri?>(null)
    /** Bildirimden gelen yönlendirme */
    val pendingRoute = mutableStateOf<String?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        handleIntent(intent)
        setContent {
            EmlakTheme {
                AppRoot(this)
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(intent: Intent?) {
        intent ?: return
        intent.getStringExtra(Notifier.EXTRA_ROUTE)?.let { pendingRoute.value = it }
        val uri: Uri? = when (intent.action) {
            Intent.ACTION_VIEW -> intent.data
            Intent.ACTION_SEND -> if (Build.VERSION.SDK_INT >= 33) {
                intent.getParcelableExtra(Intent.EXTRA_STREAM, Uri::class.java)
            } else {
                @Suppress("DEPRECATION") intent.getParcelableExtra(Intent.EXTRA_STREAM)
            }
            else -> null
        }
        if (uri != null) pendingKml.value = uri
    }
}
