package com.mustafa.emlaktakip.kml

import com.mustafa.emlaktakip.data.Building
import com.mustafa.emlaktakip.data.BuildingContact
import com.mustafa.emlaktakip.data.Options
import com.mustafa.emlaktakip.data.labelOf
import org.xmlpull.v1.XmlPullParser
import org.xmlpull.v1.XmlPullParserFactory
import java.io.BufferedInputStream
import java.io.InputStream
import java.util.zip.ZipInputStream

/** KML'den okunan tek bir yer işareti */
data class Placemark(
    val name: String,
    val description: String,
    val data: List<Pair<String, String>>,
    val geomType: String,
    /** Halkalar '|' ile ayrılmış "lon,lat lon,lat" dizileri */
    val coords: String,
    val lat: Double,
    val lon: Double,
)

data class KmlResult(val documentName: String, val placemarks: List<Placemark>)

object KmlParser {

    /** KML veya KMZ akışını okur. */
    fun parse(input: InputStream): KmlResult {
        val bis = BufferedInputStream(input)
        bis.mark(4)
        val b0 = bis.read(); val b1 = bis.read()
        bis.reset()
        return if (b0 == 'P'.code && b1 == 'K'.code) {
            val zip = ZipInputStream(bis)
            var entry = zip.nextEntry
            while (entry != null) {
                if (!entry.isDirectory && entry.name.lowercase().endsWith(".kml")) return parseKml(zip)
                entry = zip.nextEntry
            }
            throw IllegalArgumentException("KMZ içinde KML dosyası bulunamadı")
        } else {
            parseKml(bis)
        }
    }

    private fun local(name: String?) = name?.substringAfter(':') ?: ""

    /** İç içe etiketleri de geçerek metni okur (HTML açıklamalar için). */
    private fun readText(p: XmlPullParser): String {
        val sb = StringBuilder()
        var depth = 1
        while (depth > 0) {
            when (p.next()) {
                XmlPullParser.TEXT, XmlPullParser.CDSECT, XmlPullParser.ENTITY_REF -> sb.append(p.text ?: "")
                XmlPullParser.START_TAG -> {
                    depth++
                    // HTML açıklamada satır kırılımlarını koru
                    if (local(p.name).lowercase() in setOf("br", "tr", "p", "div", "li")) sb.append('\n')
                    else if (local(p.name).lowercase() == "td") sb.append(' ')
                }
                XmlPullParser.END_TAG -> depth--
                XmlPullParser.END_DOCUMENT -> return sb.toString()
            }
        }
        return sb.toString()
    }

    private fun parseKml(input: InputStream): KmlResult {
        val factory = XmlPullParserFactory.newInstance().apply { isNamespaceAware = false }
        val p = factory.newPullParser()
        p.setInput(input, null)

        val stack = ArrayList<String>()
        var docName = ""
        val result = ArrayList<Placemark>()

        // geçerli yer işareti durumu
        var inPm = false
        var pmName = ""; var pmDesc = ""
        var data = ArrayList<Pair<String, String>>()
        var dataName = ""
        val points = ArrayList<String>(); val lines = ArrayList<String>(); val polys = ArrayList<String>()

        var ev = p.eventType
        while (ev != XmlPullParser.END_DOCUMENT) {
            if (ev == XmlPullParser.START_TAG) {
                val tag = local(p.name)
                val parent = stack.lastOrNull()
                when {
                    tag == "Placemark" -> {
                        inPm = true; pmName = ""; pmDesc = ""; data = ArrayList()
                        points.clear(); lines.clear(); polys.clear()
                        stack.add(tag)
                    }
                    tag == "name" && parent == "Placemark" -> pmName = readText(p).trim()
                    tag == "name" && parent == "Document" && docName.isEmpty() -> docName = readText(p).trim()
                    tag == "description" && parent == "Placemark" -> pmDesc = htmlToText(readText(p))
                    tag == "Data" && inPm -> { dataName = p.getAttributeValue(null, "name") ?: ""; stack.add(tag) }
                    tag == "displayName" && parent == "Data" -> readText(p) // atla
                    tag == "value" && parent == "Data" -> {
                        val v = readText(p).trim()
                        if (dataName.isNotBlank() && v.isNotBlank()) data.add(dataName to v)
                    }
                    tag == "SimpleData" && inPm -> {
                        val n = p.getAttributeValue(null, "name") ?: ""
                        val v = readText(p).trim()
                        if (n.isNotBlank() && v.isNotBlank()) data.add(n to v)
                    }
                    tag == "coordinates" && inPm -> {
                        val c = normalizeCoords(readText(p))
                        if (c.isNotEmpty() && "innerBoundaryIs" !in stack) {
                            when {
                                "Polygon" in stack -> polys.add(c)
                                "LineString" in stack || "LinearRing" in stack -> lines.add(c)
                                else -> points.add(c)
                            }
                        }
                    }
                    else -> stack.add(tag)
                }
            } else if (ev == XmlPullParser.END_TAG) {
                val tag = local(p.name)
                if (stack.isNotEmpty()) stack.removeAt(stack.size - 1)
                if (tag == "Placemark" && inPm) {
                    inPm = false
                    val (type, coords) = when {
                        polys.isNotEmpty() -> "Polygon" to polys.joinToString("|")
                        lines.isNotEmpty() -> "LineString" to lines.joinToString("|")
                        points.isNotEmpty() -> "Point" to points.first()
                        else -> "" to ""
                    }
                    if (type.isNotEmpty()) {
                        val (lat, lon) = center(coords)
                        result.add(Placemark(pmName, pmDesc.trim(), data, type, coords, lat, lon))
                    }
                }
            }
            ev = p.next()
        }
        return KmlResult(docName, result)
    }

    /** "lon,lat,alt lon,lat,alt" -> "lon,lat lon,lat" */
    fun normalizeCoords(raw: String): String = raw.trim().split(Regex("\\s+"))
        .mapNotNull { tuple ->
            val parts = tuple.split(',')
            val lon = parts.getOrNull(0)?.toDoubleOrNull()
            val lat = parts.getOrNull(1)?.toDoubleOrNull()
            if (lon != null && lat != null) "$lon,$lat" else null
        }.joinToString(" ")

    fun parseRing(ring: String): List<Pair<Double, Double>> = ring.trim().split(' ')
        .mapNotNull { t ->
            val parts = t.split(',')
            val lon = parts.getOrNull(0)?.toDoubleOrNull()
            val lat = parts.getOrNull(1)?.toDoubleOrNull()
            if (lon != null && lat != null) lat to lon else null
        }

    /** Tüm noktaların ortalaması (lat, lon) */
    fun center(coords: String): Pair<Double, Double> {
        val pts = coords.split('|').flatMap { parseRing(it) }
        if (pts.isEmpty()) return 0.0 to 0.0
        // kapalı halkanın tekrar eden son noktasını sayma
        val uniq = pts.distinct()
        return uniq.sumOf { it.first } / uniq.size to uniq.sumOf { it.second } / uniq.size
    }

    fun htmlToText(s: String): String = s
        .replace(Regex("(?i)<br\\s*/?>|</p>|</tr>|</div>|</li>"), "\n")
        .replace(Regex("(?i)</td>|</th>"), " ")
        .replace(Regex("<[^>]+>"), "")
        .replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<")
        .replace("&gt;", ">").replace("&quot;", "\"").replace("&#39;", "'")
        .lines().map { it.trim() }.filter { it.isNotEmpty() }.joinToString("\n")

    /** KML ExtendedData'daki bilinen anahtarlardan bina alanlarını doldurur. */
    fun toBuilding(pm: Placemark, index: Int): Building {
        fun find(vararg keys: String): String? = pm.data.firstOrNull { (k, _) ->
            val nk = k.lowercase().replace(" ", "_")
            keys.any { nk == it || nk.contains(it) }
        }?.second
        val digits = { s: String? -> s?.filter { it.isDigit() }?.take(9)?.toIntOrNull() }
        return Building(
            name = pm.name.ifBlank { find("name", "ad", "isim", "bina_adi") ?: "Yapı ${index + 1}" },
            address = find("adres", "address") ?: "",
            siteName = find("site", "proje") ?: "",
            lat = pm.lat, lon = pm.lon,
            geomType = pm.geomType, coords = pm.coords,
            floors = digits(find("kat_sayisi", "kat_adedi", "katsayisi", "floors", "kat")),
            unitCount = digits(find("daire_sayisi", "bagimsiz_bolum", "units", "daire")),
            buildYear = digits(find("yapim_yili", "insa_yili", "year", "yil"))?.takeIf { it in 1800..2100 },
            kmlDescription = pm.description,
            extraData = pm.data.joinToString("\n") { "${it.first}: ${it.second}" },
        )
    }
}

object KmlWriter {
    private fun esc(s: String) = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;")
    private fun cdata(s: String) = "<![CDATA[" + s.replace("]]>", "]]]]><![CDATA[>") + "]]>"

    /** ARGB -> KML aabbggrr */
    private fun kmlColor(argb: Long, alpha: Int): String {
        val r = (argb shr 16) and 0xFF; val g = (argb shr 8) and 0xFF; val b = argb and 0xFF
        return String.format("%02x%02x%02x%02x", alpha, b, g, r)
    }

    /**
     * Binaları, uygulamada girilen tüm bilgilerle birlikte KML'e yazar.
     * Google Earth / My Maps ile açılabilir, tekrar bu uygulamaya da aktarılabilir.
     */
    fun write(
        docName: String,
        buildings: List<Building>,
        contacts: Map<Long, List<BuildingContact>>,
    ): String = buildString {
        append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n")
        append("<kml xmlns=\"http://www.opengis.net/kml/2.2\">\n<Document>\n")
        append("<name>").append(esc(docName)).append("</name>\n")
        Options.buildingStatus.forEachIndexed { i, o ->
            append("<Style id=\"s$i\"><IconStyle><color>${kmlColor(o.color, 0xff)}</color></IconStyle>")
            append("<LineStyle><color>${kmlColor(o.color, 0xff)}</color><width>2</width></LineStyle>")
            append("<PolyStyle><color>${kmlColor(o.color, 0x55)}</color></PolyStyle></Style>\n")
        }
        for (b in buildings) {
            val styleIdx = Options.buildingStatus.indexOfFirst { it.key == b.status }.coerceAtLeast(0)
            val fields = buildList {
                add("Durum" to Options.buildingStatus.labelOf(b.status))
                add("Tür" to b.buildingType)
                add("Site / Proje" to b.siteName)
                add("Adres" to b.address)
                add("Kat Sayısı" to (b.floors?.toString() ?: ""))
                add("Daire Sayısı" to (b.unitCount?.toString() ?: ""))
                add("Yapım Yılı" to (b.buildYear?.toString() ?: ""))
                contacts[b.id].orEmpty().forEach { c ->
                    add(Options.contactRole.labelOf(c.role) to listOf(c.name, c.phone).filter { it.isNotBlank() }.joinToString(" - "))
                }
                add("Notlar" to b.notes)
            }.filter { it.second.isNotBlank() }

            append("<Placemark>\n<name>").append(esc(b.name)).append("</name>\n")
            val html = buildString {
                append("<table>")
                fields.forEach { (k, v) -> append("<tr><td><b>${esc(k)}</b></td><td>${esc(v).replace("\n", "<br/>")}</td></tr>") }
                append("</table>")
                if (b.kmlDescription.isNotBlank()) append("<hr/>").append(esc(b.kmlDescription).replace("\n", "<br/>"))
            }
            append("<description>").append(cdata(html)).append("</description>\n")
            append("<styleUrl>#s$styleIdx</styleUrl>\n<ExtendedData>\n")
            fields.forEach { (k, v) -> append("<Data name=\"${esc(k)}\"><value>${esc(v)}</value></Data>\n") }
            // KML'den gelen orijinal ek veriler
            b.extraData.lines().filter { it.contains(": ") }.forEach { line ->
                val k = line.substringBefore(": "); val v = line.substringAfter(": ")
                if (fields.none { it.first == k }) append("<Data name=\"${esc(k)}\"><value>${esc(v)}</value></Data>\n")
            }
            append("</ExtendedData>\n")
            append(geometry(b))
            append("</Placemark>\n")
        }
        append("</Document>\n</kml>\n")
    }

    private fun geometry(b: Building): String {
        val rings = b.coords.split('|').filter { it.isNotBlank() }
        val single = rings.size <= 1
        val parts = when {
            b.geomType == "Polygon" && rings.isNotEmpty() -> rings.map {
                "<Polygon><outerBoundaryIs><LinearRing><coordinates>$it</coordinates></LinearRing></outerBoundaryIs></Polygon>"
            }
            b.geomType == "LineString" && rings.isNotEmpty() -> rings.map { "<LineString><coordinates>$it</coordinates></LineString>" }
            else -> listOf("<Point><coordinates>${b.lon},${b.lat}</coordinates></Point>")
        }
        return if (single || parts.size == 1) parts.first() + "\n"
        else "<MultiGeometry>" + parts.joinToString("") + "</MultiGeometry>\n"
    }
}
