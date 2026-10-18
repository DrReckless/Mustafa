# Demir Sınır

Android için 3B üs inşa etme, endüstri ve savunma oyunu. Satisfactory'nin üretim zincirleri,
RimWorld'ün gece baskınları ve Northgard'ın bölge fethi hissinden ilham alır.

## APK'yı indir ve kur

1. Bu depodaki [`apk/DemirSinir.apk`](apk/DemirSinir.apk) dosyasını telefonuna indir.
2. Dosyayı aç; Android "bilinmeyen kaynaklardan yükleme" izni isterse izin ver.
3. Oyunu yatay tutarak oyna.

Her push'ta GitHub Actions da APK'yı yeniden derler (Actions sekmesi → *Android APK* → *DemirSinir-apk*).

## Oyun

- **Haritalar:** Yeni oyunda harita tipi seçilir: *Karma Bölgeler* (ılıman vadide başla, doğuda
  çöl, tundra ve volkanik bölgeler), *Ilıman Vadi*, *Kızıl Çöl* (vahalar, mesalar), *Donmuş Tundra*
  (kar, çam ormanları) ve *Volkanik Ada* (kül çölleri, lav gölleri). Harita 96×64 karodur.
- **Madencilik:** Demir, bakır, kömür, taş, kuvars, boksit, kükürt ve uranyum yataklarına matkap
  (ya da daha hızlı Ağır Matkap) kur; petrol sızıntılarına Petrol Pompası gerekir. Yatakların saflığı
  (Saf Olmayan / Normal / Saf) çıkarma hızını belirler.
- **Lojistik:** Konveyör ve hızlı konveyör hatlarını parmağınla sürükleyerek çiz (hızlıyı eski hattın
  üstüne çizersen yükseltir), ayırıcılarla dağıt. Ana Üs'e giren her şey depoya eklenir.
- **Eritme:** Her kaynağın kendi tesisi var: Demir Fırını, Bakır İzabe Fırını, Taş Fırını (beton
  blok, cam), Ark Fırını (silikon), Alüminyum Tesisi ve Dökümhane (çelik, hafif alaşım). Fırınlara
  kömür verirsen kok tarifleriyle daha verimli çalışırlar.
- **Montaj:** Montaj Makinesi (dişli, kablo, demir levha, devre kartı, motor, mühimmat), İleri Montaj
  Hattı (batarya, işlemci, füze, kompozit zırh, seri üretim), Petrol Rafinerisi (yakıt, plastik),
  Kimya Tesisi (patlayıcı, yüksek verimli mühimmat, kömürden plastik) ve Zenginleştirme Tesisi
  (nükleer yakıt çubuğu).
- **Enerji:** Makineler ancak bir şebekeye bağlıysa çalışır. Ana Üs 10 karo çevresine 30 kW verir;
  şebekeyi Elektrik Direği ve Yüksek Gerilim Kulesi ile uzat. Üretim: kömür ve yakıt jeneratörü,
  güneş paneli, rüzgar türbini, nükleer reaktör. Akü Deposu gündüz fazlasını geceye saklar.
  ⚡ göstergesine dokununca şebeke raporu açılır; makineler bilgi panelinden kapatılabilir.
- **Araştırma:** 10 teknoloji: Otomasyon, Yarı İletkenler, Metalurji, İleri Elektronik, Petrokimya,
  Hafif Metaller, Mekanize Ordu, Enerji Depolama, Roket Teknolojisi, Nükleer Enerji.
- **Savunma:** Gün-gece döngüsü ve düzenli baskınlar var. Makineli, obüs, lazer taretleri ve füze
  bataryası; beton ve zırhlı duvarlar. Projektörler geceyi aydınlatır ve ışığındaki taretlerin
  menzilini artırır.
- **Saldırı:** Araç Fabrikası'nda muharebe robotu, ağır tank ve saldırı dronu üret, Ordu
  menüsünden *Kızıl Lejyon*, *Pas Klanı* ve *Kara Sancak* üslerine saldır.
- Oyun 45 saniyede bir ve uygulamadan çıkarken otomatik kaydedilir.

**Kontroller:** tek parmak kaydırır, iki parmak yakınlaştırır ve döndürür, bir yapıya dokunmak bilgi
panelini açar. Menüden grafik kalitesi (Düşük / Orta / Yüksek) ve gece aydınlığı (Karanlık /
Normal / Aydınlık) seçilebilir.

## Teknik

- Three.js (WebGL) ile gerçek zamanlı 3B: PBR malzemeler, prosedürel dokular, gölgeler,
  gün batımı ve gece aydınlatması, rüzgârda sallanan çimler, parçacıklı patlamalar, Yüksek
  kalitede bloom.
- Tüm modeller, dokular ve sesler kodla üretilir; harici varlık dosyası yoktur.
- Capacitor ile Android'e paketlenir.

```bash
npm install
npm run dev            # tarayıcıda geliştirme
npm run build          # dist/ üretir
npx cap sync android
cd android && ./gradlew assembleRelease   # android/app/build/outputs/apk/release/
```

APK, depodaki `android/app/demirsinir.keystore` ile imzalanır. Böylece yerelde ve CI'da derlenen
sürümler birbirinin üzerine kurulabilir. Bu anahtar yalnızca kişisel dağıtım içindir; Play
Store'a yüklemeden önce gizli tutulan yeni bir anahtar oluştur.
