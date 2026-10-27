# Uygulama sınıfları ve harita kütüphanesi küçültülür ama isimleri korunur.
-dontobfuscate
-keep class com.mustafa.emlaktakip.** { *; }
-keep class org.osmdroid.** { *; }
-dontwarn org.osmdroid.**
