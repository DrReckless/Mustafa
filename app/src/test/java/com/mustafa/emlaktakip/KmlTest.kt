package com.mustafa.emlaktakip

import com.mustafa.emlaktakip.data.Building
import com.mustafa.emlaktakip.data.BuildingContact
import com.mustafa.emlaktakip.kml.KmlParser
import com.mustafa.emlaktakip.kml.KmlWriter
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import java.io.ByteArrayOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class KmlTest {
    private val sample = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <name>Kadıköy Binaları</name>
  <Folder><name>Klasör</name>
  <Placemark>
    <name>Gül Apt.</name>
    <description><![CDATA[<table><tr><td>Kat</td><td>6</td></tr></table>]]></description>
    <ExtendedData>
      <Data name="Kat Sayısı"><value>6</value></Data>
      <Data name="Adres"><value>Moda Cad. No:5</value></Data>
    </ExtendedData>
    <Polygon>
      <outerBoundaryIs><LinearRing><coordinates>
        29.0,41.0,0 29.001,41.0,0 29.001,41.001,0 29.0,41.001,0 29.0,41.0,0
      </coordinates></LinearRing></outerBoundaryIs>
      <innerBoundaryIs><LinearRing><coordinates>29.0005,41.0005 29.0006,41.0005 29.0006,41.0006</coordinates></LinearRing></innerBoundaryIs>
    </Polygon>
  </Placemark>
  <Placemark>
    <name>Nokta</name>
    <description>Düz &amp; metin</description>
    <ExtendedData><SchemaData schemaUrl="#s"><SimpleData name="daire_sayisi">12</SimpleData></SchemaData></ExtendedData>
    <Point><coordinates>28.95,40.99,0</coordinates></Point>
  </Placemark>
  <Placemark>
    <name>Çoklu</name>
    <MultiGeometry>
      <Polygon><outerBoundaryIs><LinearRing><coordinates>29.1,41.1 29.2,41.1 29.2,41.2 29.1,41.1</coordinates></LinearRing></outerBoundaryIs></Polygon>
      <Polygon><outerBoundaryIs><LinearRing><coordinates>29.3,41.3 29.4,41.3 29.4,41.4 29.3,41.3</coordinates></LinearRing></outerBoundaryIs></Polygon>
    </MultiGeometry>
  </Placemark>
  </Folder>
</Document>
</kml>"""

    @Test
    fun parsesPlacemarks() {
        val r = KmlParser.parse(sample.byteInputStream())
        assertEquals("Kadıköy Binaları", r.documentName)
        assertEquals(3, r.placemarks.size)

        val gul = r.placemarks[0]
        assertEquals("Gül Apt.", gul.name)
        assertEquals("Polygon", gul.geomType)
        assertEquals(1, gul.coords.split('|').size) // iç halka atlanır
        assertEquals(41.0005, gul.lat, 0.0001)
        assertTrue(gul.description.contains("Kat"))
        assertEquals("6", gul.data.toMap()["Kat Sayısı"])

        val b = KmlParser.toBuilding(gul, 0)
        assertEquals(6, b.floors)
        assertEquals("Moda Cad. No:5", b.address)

        val nokta = r.placemarks[1]
        assertEquals("Point", nokta.geomType)
        assertEquals(40.99, nokta.lat, 1e-9)
        assertEquals(28.95, nokta.lon, 1e-9)
        assertEquals("Düz & metin", nokta.description)
        assertEquals(12, KmlParser.toBuilding(nokta, 1).unitCount)

        assertEquals(2, r.placemarks[2].coords.split('|').size)
    }

    @Test
    fun parsesKmz() {
        val bos = ByteArrayOutputStream()
        ZipOutputStream(bos).use { z ->
            z.putNextEntry(ZipEntry("doc.kml")); z.write(sample.toByteArray()); z.closeEntry()
        }
        val r = KmlParser.parse(bos.toByteArray().inputStream())
        assertEquals(3, r.placemarks.size)
    }

    @Test
    fun exportRoundTrip() {
        val r = KmlParser.parse(sample.byteInputStream())
        val buildings = r.placemarks.mapIndexed { i, pm ->
            KmlParser.toBuilding(pm, i).copy(id = i + 1L, status = "PORTFOY", notes = "Kapıcı iyi biri <not> & ]]> test")
        }
        val contacts = mapOf(1L to listOf(BuildingContact(id = 1, buildingId = 1, role = "KAPICI", name = "Ali", phone = "0532")))
        val xml = KmlWriter.write("Dışa aktarım", buildings, contacts)
        val back = KmlParser.parse(xml.byteInputStream())
        assertEquals(3, back.placemarks.size)
        val first = back.placemarks[0]
        assertEquals("Gül Apt.", first.name)
        val data = first.data.toMap()
        assertEquals("Portföyde", data["Durum"])
        assertEquals("Ali - 0532", data["Kapıcı"])
        assertEquals("Kapıcı iyi biri <not> & ]]> test", data["Notlar"])
        assertEquals("Moda Cad. No:5", data["Adres"])
        assertEquals(buildings[0].coords, first.coords)
        assertEquals("Point", back.placemarks[1].geomType)
        assertEquals(2, back.placemarks[2].coords.split('|').size)
    }

    @Test
    fun manualBuildingExport() {
        val b = Building(id = 5, name = "Yeni", lat = 41.0, lon = 29.0, coords = "29.0,41.0")
        val back = KmlParser.parse(KmlWriter.write("x", listOf(b), emptyMap()).byteInputStream())
        assertEquals(41.0, back.placemarks.single().lat, 1e-9)
    }
}
