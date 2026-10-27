package com.mustafa.emlaktakip

import android.graphics.Bitmap
import android.net.Uri
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.test.hasClickAction
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.performClick
import androidx.test.core.app.ApplicationProvider
import com.mustafa.emlaktakip.data.AppDatabase
import com.mustafa.emlaktakip.data.Building
import com.mustafa.emlaktakip.ui.components.LocalDao
import com.mustafa.emlaktakip.ui.screens.BuildingPhotos
import com.mustafa.emlaktakip.util.Photos
import kotlinx.coroutines.runBlocking
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import java.io.File

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class PhotoUiTest {
    @get:Rule(order = 0)
    val resetDb = object : org.junit.rules.ExternalResource() { override fun before() = AppDatabase.closeAndReset() }
    @get:Rule(order = 1)
    val rule = createComposeRule()

    @Test
    fun openViewer() {
        val ctx = ApplicationProvider.getApplicationContext<android.content.Context>()
        val dao = AppDatabase.get(ctx).dao()
        val b = runBlocking {
            val id = dao.insert(Building(name = "Gül"))
            val f = File(ctx.cacheDir, "p.png")
            f.outputStream().use { Bitmap.createBitmap(40, 30, Bitmap.Config.ARGB_8888).compress(Bitmap.CompressFormat.PNG, 100, it) }
            Photos.importUri(ctx, dao, Uri.fromFile(f), id)
            dao.getBuilding(id)!!
        }
        rule.setContent { CompositionLocalProvider(LocalDao provides dao) { BuildingPhotos(b) } }
        rule.waitUntil(5000) { rule.onAllNodes(hasText("Fotoğraflar (1)")).fetchSemanticsNodes().isNotEmpty() }
        // Galeriden, Çek, Tümünü indir düğmelerinden sonra 4. tıklanabilir öğe küçük resimdir
        rule.onAllNodes(hasClickAction())[3].performClick()
        rule.waitForIdle()
        rule.waitUntil(5000) { rule.onAllNodesWithText("1 / 1", useUnmergedTree = true).fetchSemanticsNodes().isNotEmpty() }
        rule.onAllNodesWithText("İndir", substring = true, useUnmergedTree = true).fetchSemanticsNodes().let { assert(it.isNotEmpty()) }
        // Kapat
        rule.onNode(androidx.compose.ui.test.hasContentDescription("Kapat")).performClick()
        rule.waitForIdle()
        rule.waitUntil(5000) { rule.onAllNodesWithText("1 / 1", useUnmergedTree = true).fetchSemanticsNodes().isEmpty() }
    }
}
