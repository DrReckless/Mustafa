package com.mustafa.borsaanaliz.data

import android.util.Xml
import com.mustafa.borsaanaliz.analysis.Sentiment
import org.xmlpull.v1.XmlPullParser
import java.net.URLEncoder
import java.text.SimpleDateFormat
import java.util.Locale

/** RSS tabanlı ekonomi haberleri. */
object NewsClient {
    private val generalQueries = listOf(
        "borsa istanbul", "bist 100", "merkez bankası faiz", "dolar kur", "altın fiyatları", "petrol fiyatları", "enflasyon ekonomi",
    )
    private val directFeeds = listOf(
        "https://www.aa.com.tr/tr/rss/default?cat=ekonomi",
        "https://www.trthaber.com/ekonomi_articles.rss",
    )

    private fun googleUrl(q: String) =
        "https://news.google.com/rss/search?q=" + URLEncoder.encode("$q when:2d", "UTF-8") + "&hl=tr&gl=TR&ceid=TR:tr"

    fun general(): List<NewsItem> {
        val urls = generalQueries.map { googleUrl(it) } + directFeeds
        val all = urls.flatMap { runCatching { fetch(it) }.getOrDefault(emptyList()) }
        return dedupe(all).take(80)
    }

    fun forInstrument(i: Instrument): List<NewsItem> {
        val q = when (i.type) {
            AssetType.STOCK -> "${i.symbol.removeSuffix(".IS")} hisse"
            else -> i.name.replace(Regex("\\(.*\\)"), "").replace("/", " ").trim()
        }
        return dedupe(runCatching { fetch(googleUrl(q)) }.getOrDefault(emptyList())).take(15)
    }

    private fun dedupe(items: List<NewsItem>) =
        items.distinctBy { it.title.lowercase(Locale("tr")).take(60) }.sortedByDescending { it.time }

    private val dateFormats = listOf(
        "EEE, dd MMM yyyy HH:mm:ss zzz", "EEE, dd MMM yyyy HH:mm:ss Z", "dd MMM yyyy HH:mm:ss Z",
    )

    private fun parseDate(s: String): Long {
        for (f in dateFormats) {
            runCatching { return SimpleDateFormat(f, Locale.ENGLISH).parse(s.trim())!!.time }
        }
        return 0L
    }

    fun fetch(url: String): List<NewsItem> {
        val body = Http.get(url)
        val parser = Xml.newPullParser()
        parser.setFeature(XmlPullParser.FEATURE_PROCESS_NAMESPACES, false)
        parser.setInput(body.reader())
        val out = mutableListOf<NewsItem>()
        var inItem = false
        var title = ""; var link = ""; var date = ""; var source = ""
        var event = parser.eventType
        while (event != XmlPullParser.END_DOCUMENT) {
            when (event) {
                XmlPullParser.START_TAG -> when (parser.name) {
                    "item" -> { inItem = true; title = ""; link = ""; date = ""; source = "" }
                    "title" -> if (inItem) title = parser.nextText()
                    "link" -> if (inItem) link = parser.nextText()
                    "pubDate" -> if (inItem) date = parser.nextText()
                    "source" -> if (inItem) source = parser.nextText()
                }
                XmlPullParser.END_TAG -> if (parser.name == "item" && inItem) {
                    inItem = false
                    var t = title.trim()
                    // Google News başlıkları "Başlık - Kaynak" biçimindedir.
                    if (source.isBlank()) {
                        val idx = t.lastIndexOf(" - ")
                        source = if (idx > 0) t.substring(idx + 3) else hostOf(url)
                    }
                    if (t.endsWith(" - $source")) t = t.removeSuffix(" - $source")
                    if (t.isNotBlank()) out += NewsItem(t, link.trim(), source.trim(), parseDate(date), Sentiment.score(t))
                }
            }
            event = parser.next()
        }
        return out
    }

    private fun hostOf(url: String) = url.substringAfter("://").substringBefore("/").removePrefix("www.")
}
