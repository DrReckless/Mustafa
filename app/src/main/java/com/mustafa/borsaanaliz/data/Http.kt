package com.mustafa.borsaanaliz.data

import java.net.CookieHandler
import java.net.CookieManager
import java.net.CookiePolicy
import java.net.HttpURLConnection
import java.net.URL

object Http {
    const val UA = "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36"

    init {
        if (CookieHandler.getDefault() == null) {
            CookieHandler.setDefault(CookieManager(null, CookiePolicy.ACCEPT_ALL))
        }
    }

    /** Basit GET. 2xx dışı yanıtlarda istisna fırlatır (allowError true ise gövdeyi döner). */
    fun get(url: String, allowError: Boolean = false): String {
        val conn = URL(url).openConnection() as HttpURLConnection
        try {
            conn.connectTimeout = 12_000
            conn.readTimeout = 15_000
            conn.instanceFollowRedirects = true
            conn.setRequestProperty("User-Agent", UA)
            conn.setRequestProperty("Accept", "*/*")
            conn.setRequestProperty("Accept-Language", "tr-TR,tr;q=0.9,en;q=0.8")
            val code = conn.responseCode
            val stream = if (code in 200..299) conn.inputStream else conn.errorStream
            val body = stream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() } ?: ""
            if (code !in 200..299 && !allowError) throw HttpException(code, url)
            return body
        } finally {
            conn.disconnect()
        }
    }
}

class HttpException(val code: Int, url: String) : Exception("HTTP $code: $url")
