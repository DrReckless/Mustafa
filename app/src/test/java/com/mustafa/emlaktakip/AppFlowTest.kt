package com.mustafa.emlaktakip

import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onFirst
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollTo
import androidx.compose.ui.test.performTextInput
import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasAnyAncestor
import androidx.compose.ui.test.isRoot
import androidx.test.core.app.ApplicationProvider
import com.mustafa.emlaktakip.data.AppDatabase
import com.mustafa.emlaktakip.data.Building
import com.mustafa.emlaktakip.data.KmlLayer
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.flow.first
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/** Uygulamayı açıp tüm modüllerde kayıt ekleyerek gezinen duman testi. */
@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class AppFlowTest {
    // Uygulama açılmadan önce önceki testten kalan veritabanı bağlantısını kapat
    @get:Rule(order = 0)
    val resetDb = object : org.junit.rules.ExternalResource() {
        override fun before() = AppDatabase.closeAndReset()
    }

    @get:Rule(order = 1)
    val rule = createAndroidComposeRule<MainActivity>()

    private fun dao() = AppDatabase.get(ApplicationProvider.getApplicationContext()).dao()

    private fun click(text: String) {
        try {
            rule.waitUntil(5000) { rule.onAllNodesWithText(text, useUnmergedTree = true).fetchSemanticsNodes().isNotEmpty() }
        } catch (e: Throwable) {
            throw AssertionError("'$text' bulunamadı. Ekran:\n" + dump(), e)
        }
        rule.onAllNodesWithText(text, useUnmergedTree = true).onFirst().performScrollTo().performClick()
        rule.waitForIdle()
    }

    private fun dump(): String = rule.onAllNodes(isRoot(), useUnmergedTree = true).fetchSemanticsNodes().joinToString("\n----\n") { root ->
        fun walk(n: androidx.compose.ui.semantics.SemanticsNode, d: Int): String =
            "  ".repeat(d) + (n.config.getOrElseNullable(androidx.compose.ui.semantics.SemanticsProperties.Text) { null }?.joinToString("|") ?: "") +
                " cd=" + (n.config.getOrElseNullable(androidx.compose.ui.semantics.SemanticsProperties.ContentDescription) { null }?.joinToString("|") ?: "") +
                " et=" + (n.config.getOrElseNullable(androidx.compose.ui.semantics.SemanticsProperties.EditableText) { null } ?: "") + "\n" + n.children.joinToString("") { walk(it, d + 1) }
        walk(root, 0)
    }

    private fun clickNoScroll(text: String) {
        try {
            rule.waitUntil(5000) { rule.onAllNodesWithText(text, useUnmergedTree = true).fetchSemanticsNodes().isNotEmpty() }
        } catch (e: Throwable) {
            throw AssertionError("'$text' bulunamadı. Ekran:\n" + dump(), e)
        }
        rule.onAllNodesWithText(text, useUnmergedTree = true).onFirst().performClick()
        rule.waitForIdle()
    }

    private fun type(label: String, value: String) {
        rule.onNode(hasSetTextAction() and hasText(label)).performScrollTo().performTextInput(value)
    }

    private fun save() {
        rule.onNodeWithContentDescription("Kaydet").performClick()
        // Form kapanana kadar bekle
        rule.waitUntil(5000) { rule.onAllNodes(hasContentDescription("Kaydet")).fetchSemanticsNodes().isEmpty() }
        rule.waitForIdle()
    }

    private fun back() {
        rule.onNodeWithContentDescription("Geri").performClick()
        rule.waitForIdle()
    }

    private fun waitText(text: String) {
        try {
            rule.waitUntil(5000) { rule.onAllNodesWithText(text, substring = true, useUnmergedTree = true).fetchSemanticsNodes().isNotEmpty() }
        } catch (e: Throwable) {
            throw AssertionError("'$text' bulunamadı. Ekran:\n" + dump(), e)
        }
    }

    @Test
    fun fullFlow() {
        // Ana panel
        waitText("Bugünkü Görevler")

        // Müteahhit ekle
        click("Müteahhitler")
        clickNoScroll("Müteahhit")
        type("Ad Soyad", "Ahmet Yılmaz")
        type("Firma", "Yılmaz İnşaat")
        save()

        waitText("Ahmet Yılmaz")
        clickNoScroll("Ahmet Yılmaz")
        waitText("İş Karşılığı Daireler")

        // Müteahhit üzerinden iş karşılığı daire ekle
        click("Daire ekle")
        type("Proje adı", "Moda Evleri")
        type("Hangi iş karşılığı", "Elektrik işi")
        save()
        waitText("Moda Evleri")
        assertEquals(1, runBlocking { dao().unitsByContractorList(1) })

        // Müteahhit üzerinden arsa ekle
        click("Arsa ekle")
        type("Başlık", "Köşe parsel")
        save()
        waitText("Köşe parsel")

        // Göreve bağla
        click("Görev ekle")
        type("Görev", "Ahmet Bey'i ara")
        save()
        waitText("Ahmet Bey'i ara")
        back()
        back()

        // İlan
        click("Sahibinden İlanları")
        clickNoScroll("İlan")
        type("Başlık", "Moda 3+1")
        save()
        waitText("Moda 3+1")
        clickNoScroll("Moda 3+1")
        waitText("İlgilenen Yatırımcılar")
        back()
        back()

        // Yatırımcı
        click("Yatırımcılar")
        clickNoScroll("Yatırımcı")
        type("Ad Soyad", "Mehmet Kaya")
        save()
        waitText("Mehmet Kaya")
        clickNoScroll("Mehmet Kaya")
        waitText("İlgilendiği Portföyler")
        // İlanı yatırımcıya ekle
        clickNoScroll("İlan")
        clickNoScroll("Moda 3+1")
        waitText("tarihinde eklendi")
        back()
        back()

        // Bina görevlisi
        click("Bina Görevlileri")
        clickNoScroll("Kişi")
        type("Ad Soyad", "Hasan Efendi")
        type("Telefon", "05321234567")
        save()
        waitText("Hasan Efendi")
        back()

        // Diğer modül listeleri
        click("İş Karşılığı Daireler"); waitText("Moda Evleri"); back()
        click("Kat Karşılığı Arsalar"); waitText("Köşe parsel"); back()

        // Bina (KML'den gelmiş gibi) ve detay
        runBlocking {
            dao().importLayer(KmlLayer(name = "Test"), listOf(Building(name = "Gül Apt.", lat = 41.0, lon = 29.0, coords = "29.0,41.0")))
        }
        runBlocking {
            val f = java.io.File(ApplicationProvider.getApplicationContext<android.content.Context>().cacheDir, "p.png")
            f.outputStream().use { android.graphics.Bitmap.createBitmap(40, 30, android.graphics.Bitmap.Config.ARGB_8888).compress(android.graphics.Bitmap.CompressFormat.PNG, 100, it) }
            com.mustafa.emlaktakip.util.Photos.importUri(ApplicationProvider.getApplicationContext(), dao(), android.net.Uri.fromFile(f), 1)
            dao().update(dao().photosByBuilding(1).first().single().copy(caption = "Giriş kapısı"))
        }
        click("Binalar")
        waitText("Gül Apt.")
        clickNoScroll("Gül Apt.")
        waitText("Fotoğraflar (1)")
        waitText("Tümünü indir")
        waitText("Giriş kapısı")
        waitText("Güvenlik / Kapıcı / Yönetici")
        click("Kişi ekle")
        type("Ad Soyad", "Veli Kapıcı")
        save()
        waitText("Veli Kapıcı")
        back()
        back()

        // Görevler sekmesi
        clickNoScroll("Görevler")
        waitText("Ahmet Bey'i ara")
        clickNoScroll("Yapılanlar")
        back2Home()

        // Arama
        clickTab("Ara")
        rule.onNode(hasSetTextAction()).performTextInput("kaya")
        waitText("Mehmet Kaya")

        // Harita
        clickTab("Harita")
        rule.waitUntil(5000) { rule.onAllNodes(hasContentDescription("Katmanlar")).fetchSemanticsNodes().isNotEmpty() }
        rule.onNodeWithContentDescription("Katmanlar").performClick()
        waitText("Test")
        back()

        // Ayarlar
        clickTab("Panel")
        rule.onNodeWithContentDescription("Ayarlar").performClick()
        waitText("Yedekleme")
        rule.onNodeWithText("Yedek al").assertExists()
    }

    private fun clickTab(label: String) {
        rule.onAllNodesWithText(label).fetchSemanticsNodes()
        rule.onAllNodes(hasText(label)).onFirst().performClick()
        rule.waitForIdle()
    }

    private fun back2Home() = clickTab("Panel")
}
