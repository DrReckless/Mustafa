# Emlak Takip

Emlak danışmanları için Android uygulaması: müteahhit rehberi, sahibinden ilan notları, iş karşılığı daireler,
kat karşılığı arsalar, yatırımcı takibi, bina görevlileri, KML destekli harita ve bildirimli günlük görevler.
Tüm veriler telefonda saklanır, internet gerektirmez (harita altlığı hariç).

## Kurulum (APK)

1. GitHub'da bu deponun **Releases** bölümünü telefonunuzdan açın.
2. En yeni `EmlakTakip-1.0.X.apk` dosyasını indirin.
3. Dosyaya dokunun; "Bilinmeyen kaynaklardan yükleme" izni istenirse verin.
4. İlk açılışta bildirim iznine **İzin ver** deyin.

Yeni sürümler eskisinin üstüne kurulur, kayıtlar silinmez (tüm APK'lar aynı anahtarla imzalanır).

## Modüller

| Modül | Ne yapar |
|---|---|
| **Panel** | Günün görevleri, gecikenler, aranacak yatırımcılar, tüm modüllere kısayol |
| **Müteahhitler** | Rehber + not defteri. Kartından o müteahhidin dairelerini, arsalarını ve görevlerini görürsünüz |
| **Sahibinden İlanları** | İlan linki (yapıştır düğmesi, ilan no otomatik), fiyat, oda, m², sahibi, durum (Yeni → Anlaşıldı) |
| **İş Karşılığı Daireler** | Hangi müteahhitten, hangi iş karşılığı, proje/blok/kat/no, fiyat, durum |
| **Kat Karşılığı Arsalar** | Ada/parsel, imar, emsal, arsa sahibi payı, müteahhit, arsa sahibi iletişim |
| **Yatırımcılar** | Bütçe, bölge, ilgi durumu, son/sonraki görüşme; ilan-daire-arsa eşleştirme ve bütçeye uygun öneriler |
| **Bina Fotoğrafları** | Bina detayında galeriden çoklu seçim veya kamerayla çekim, fotoğraf notu, tam ekran görüntüleme; tek tek veya tümünü telefon galerisine (Resimler/EmlakTakip) indirme ve paylaşma |
| **Bina Görevlileri** | Güvenlik, kapıcı, yönetici, site müdürü; binaya bağlı |
| **Harita** | KML/KMZ açma, binaya dokunup bilgi girme, durum renkleri, uydu görünümü, konumum, uzun basarak bina ekleme |
| **KML Katmanları** | Katmanları gizle/göster, sil, girdiğiniz bilgilerle birlikte yeniden KML olarak kaydet (Google Earth uyumlu) |
| **Görevler** | Bugün / Yaklaşan / Yapılanlar; saatinde bildirim, "Tamamlandı" ve "1 saat ertele" düğmeleri, tekrar eden görevler, her sabah özet |
| **Ara** | Tüm kayıtlarda Türkçe karakter duyarsız arama |
| **Ayarlar** | Günlük özet saati, yedek alma / geri yükleme (kayıtlar + fotoğraflar tek ZIP dosyası) |

### Birbirine bağlı çalışma
- Her detay ekranında **Görev ekle** o kayda bağlı görev oluşturur; görev bildiriminde kayıt adı görünür.
- Bina detayında o binanın görevlileri, ilanları, daireleri ve arsaları listelenir.
- İlan/daire/arsa detayından **Yatırımcıya öner**, yatırımcı detayından **+ İlan / + Daire / + Arsa**.
- WhatsApp, arama ve SMS düğmeleri tüm kişi kartlarında.

## Geliştirme

```bash
./gradlew :app:testDebugUnitTest   # testler (KML okuma/yazma + uygulama akışı)
./gradlew :app:assembleRelease     # app/build/outputs/apk/release/app-release.apk
```

Kotlin, Jetpack Compose (Material 3), Room, osmdroid (OpenStreetMap). minSdk 26 (Android 8.0).
