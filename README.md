# Hantürk Plan 3D

Hantürk Gayrimenkul için Android uygulaması: dairenin kat planını çizin, mobilyaları otomatik
yerleştirin, 3B olarak gezin ve müşteriye logolu PDF sunum hazırlayın.

## Özellikler

- **Kat planı editörü**: parmakla oda çizme, ölçüyle düzenleme (cm), komşu odaya duvar payıyla yapışma,
  kapı (açılış yönü, menteşe) ve pencere (denizlik/yükseklik) ekleme, geri al / yinele.
- **Hazır şablonlar**: 1+1, 2+1, 3+1 ya da boş plan.
- **Otomatik mobilya yerleşimi**: her oda tipi için iç mimari kurallar (kapı açılma alanı, pencere önü,
  60 cm geçiş yolu, mobilya ön boşlukları, yatak başı duvara, TV–koltuk mesafesi, mutfak çalışma üçgeni,
  banyo ıslak hacim vb.). En uygun 3 seçenek sunulur; tek oda ya da tüm daire için çalışır.
- **Mobilya kataloğu**: ~50 parça, gerçek ölçülerde; döndürme, ölçü değiştirme, çoğaltma.
- **3B görünüm**: kuşbakışı (döndür / yakınlaştır) ve "içeride gez" modu, gölgeler, malzeme ve renk
  seçimi (parke, seramik, duvar rengi, mobilya tonu, kumaş), 1920×1080 fotoğraf.
- **Müşteri sunumu (PDF)**: logolu kapak, ölçülü kat planı, mobilya planı, 3B kat planı, perspektifler,
  oda oda iç mekân görselleri, alan tablosu. WhatsApp / e-posta ile paylaşma veya İndirilenler'e kaydetme.
- İnternet gerektirmez; projeler telefonda saklanır, dosya olarak dışa / içe aktarılabilir.

## Proje yapısı

```
web/        Arayüz ve tüm mantık (JavaScript, three.js, jsPDF)
  src/model.js         veri modeli ve şablonlar
  src/walls.js         odalardan duvar / açıklık geometrisi
  src/layout.js        otomatik yerleşim motoru
  src/catalog.js       mobilya kataloğu
  src/plan2d.js        2B plan çizimi
  src/editor.js        dokunmatik plan editörü
  src/view3d.js        3B sahne, gezinme, görüntü alma
  src/models3d.js      3B mobilya modelleri
  src/presentation.js  PDF sunum
android/    WebView tabanlı Android kabuğu (Kotlin)
branding/   Logo ve ikon üretimi
```

## Derleme

```bash
cd web && npm ci && npm test && npm run build     # arayüzü android/app/src/main/assets/www içine derler
cd ../android && ./gradlew assembleRelease          # APK: app/build/outputs/apk/release/
```

İmzalama anahtarı depoda **yoktur**. `android/keystore.properties` dosyası (storeFile, storePassword,
keyAlias, keyPassword) veya `HANTURK_KEYSTORE*` ortam değişkenleri verilmezse APK hata ayıklama
anahtarıyla imzalanır. GitHub Actions için `HANTURK_KEYSTORE_B64`, `HANTURK_KEYSTORE_PASSWORD`,
`HANTURK_KEY_ALIAS`, `HANTURK_KEY_PASSWORD` gizli değişkenleri tanımlanabilir.

Tarayıcıda geliştirme: `cd web && OUT_DIR=dist node build.mjs` ardından `dist` klasörünü bir yerel sunucuyla açın.
