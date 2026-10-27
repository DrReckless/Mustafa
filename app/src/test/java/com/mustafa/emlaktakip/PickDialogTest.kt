package com.mustafa.emlaktakip

import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import com.mustafa.emlaktakip.data.LinkType
import com.mustafa.emlaktakip.data.PickItem
import com.mustafa.emlaktakip.ui.components.PickDialog
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class PickDialogTest {
    @get:Rule val rule = createComposeRule()

    @Test
    fun pick() {
        rule.setContent {
            var picked by remember { mutableStateOf("yok") }
            var open by remember { mutableStateOf(true) }
            Text("Seçilen: $picked")
            if (open) PickDialog("Seç", listOf(PickItem(LinkType.LISTING, 1, "Moda 3+1", "alt")), onPick = { picked = it.title; open = false }, onDismiss = { open = false })
        }
        rule.onNodeWithText("Moda 3+1").performClick()
        rule.onNodeWithText("Seçilen: Moda 3+1").assertExists()
    }
}

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class RecordPickerTest {
    @get:Rule val rule = createComposeRule()

    @Test
    fun pickFromDb() {
        val ctx = androidx.test.core.app.ApplicationProvider.getApplicationContext<android.content.Context>()
        val dao = com.mustafa.emlaktakip.data.AppDatabase.get(ctx).dao()
        kotlinx.coroutines.runBlocking { dao.insert(com.mustafa.emlaktakip.data.Listing(title = "Moda 3+1")) }
        rule.setContent {
            var sel by remember { mutableStateOf<Long?>(null) }
            androidx.compose.runtime.CompositionLocalProvider(com.mustafa.emlaktakip.ui.components.LocalDao provides dao) {
                Text("Seçilen: $sel")
                com.mustafa.emlaktakip.ui.components.RecordPicker("İlan", LinkType.LISTING, sel) { sel = it }
            }
        }
        rule.onNodeWithText("Seçilmedi (dokunarak seçin)").performClick()
        rule.waitUntil(5000) { rule.onAllNodes(androidx.compose.ui.test.hasText("Moda 3+1")).fetchSemanticsNodes().isNotEmpty() }
        rule.onNodeWithText("Moda 3+1").performClick()
        rule.onNodeWithText("Seçilen: 1").assertExists()
    }

    @org.junit.Before
    fun resetDb() = com.mustafa.emlaktakip.data.AppDatabase.closeAndReset()
}
