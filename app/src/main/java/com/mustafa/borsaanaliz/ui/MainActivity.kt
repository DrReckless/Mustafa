package com.mustafa.borsaanaliz.ui

import android.Manifest
import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import com.mustafa.borsaanaliz.data.Universe

class MainActivity : ComponentActivity() {
    companion object { const val EXTRA_SYMBOL = "symbol" }

    private val vm: MainViewModel by viewModels()
    private val permLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) {}

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Build.VERSION.SDK_INT >= 33) permLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        handleIntent(intent)
        setContent { BorsaTheme { AppRoot(vm) } }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(i: Intent?) {
        i?.getStringExtra(EXTRA_SYMBOL)?.let { vm.openDetail(Universe.find(it)) }
    }

    override fun onStart() { super.onStart(); vm.startAutoRefresh() }
    override fun onStop() { super.onStop(); vm.stopAutoRefresh() }
}
