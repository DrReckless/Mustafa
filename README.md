# Demir Sınır

Android için 3B üs inşa etme, endüstri ve savunma oyunu. Satisfactory'nin üretim zincirleri,
RimWorld'ün gece baskınları ve Northgard'ın bölge fethi hissinden ilham alır.

## APK'yı indir ve kur

1. Bu depodaki [`apk/DemirSinir.apk`](apk/DemirSinir.apk) dosyasını telefonuna indir.
2. Dosyayı aç; Android "bilinmeyen kaynaklardan yükleme" izni isterse izin ver.
3. Oyunu yatay tutarak oyna.

Her push'ta GitHub Actions da APK'yı yeniden derler (Actions sekmesi → *Android APK* → *DemirSinir-apk*).

## Oyun

- **Madencilik:** Demir, bakır, kömür, taş ve kuvars yataklarına matkap kur. Yatakların saflığı
  (Saf Olmayan / Normal / Saf) çıkarma hızını belirler.
- **Lojistik:** Konveyör hatlarını parmağınla sürükleyerek çiz, ayırıcılarla dağıt. Ana Üs'e giren
  her şey depoya eklenir.
- **İşleme:** Eritme Fırını (külçe, beton blok, silikon), Montaj Makinesi (dişli, kablo, devre
  kartı, motor, mühimmat) ve Dökümhane (çelik, mühimmat).
- **Enerji:** Ana Üs 30 kW verir; kömür jeneratörleri ve güneş panelleriyle şebekeyi büyüt.
  Enerji yetmezse tüm makineler yavaşlar.
- **Araştırma:** Otomasyon → Yarı İletkenler / Metalurji → İleri Elektronik → Mekanize Ordu.
- **Savunma:** Gün-gece döngüsü var; her gece rakipler saldırır. Makineli, obüs ve lazer taretleri
  ile beton duvarlar kur. Makineli ve obüs taretleri depodaki mühimmatı harcar.
- **Saldırı:** Araç Fabrikası'nda muharebe robotu, ağır tank ve saldırı dronu üret, Ordu
  menüsünden *Kızıl Lejyon* ve *Pas Klanı* üslerine saldır. İkisini de yok edersen kazanırsın.
- Oyun 45 saniyede bir ve uygulamadan çıkarken otomatik kaydedilir.

**Kontroller:** tek parmak kaydırır, iki parmak yakınlaştırır ve döndürür, bir yapıya dokunmak bilgi
panelini açar. Menüden grafik kalitesi (Düşük / Orta / Yüksek) seçilebilir.

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
