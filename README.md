# Beylik 🏯

Anadolu'da geçen, Manor Lords tarzı **3D şehir kurma oyunu** (Android).
Küçük bir obadan başlayıp köy, kasaba ve şehir kurarsın: kerpiç evler, cami, hamam, kervansaray,
değirmen, tarlalar, ağıllar… Mevsimler, kış hazırlığı, vergi (öşür), Divan kararları ve ticaret var.

## Telefona kurulum
1. `dist/Beylik.apk` dosyasını telefona indir.
2. Dosyaya dokun. Android "bilinmeyen kaynaklardan yükleme" izni isterse izin ver.
3. Yükle → Aç.

Oyun yatay (landscape) oynanır. Telefon zorlanırsa: Menü ☰ → **Grafik: Yüksek/Orta/Düşük**.

## Kontroller
- Tek parmak: haritayı kaydır
- İki parmak: yakınlaştır / döndür (⟲ ⟳ tuşları da döndürür)
- Alttan bina seç → haritaya dokun → **İnşa Et**

## Proje yapısı
| Klasör | İçerik |
|---|---|
| `www/` | Oyunun kendisi (HTML/JS). `js/sim.js` kurallar, `js/data.js` binalar/olaylar, `js/main.js` arayüz |
| `src/r3d/` | 3D grafik motoru (Three.js): arazi, ağaçlar, binalar, ışık |
| `www/tex/` | Dokular (Poly Haven ve ambientCG, CC0 lisanslı) |
| `assets_src/` | Doku indirme/üretme betikleri |
| `android/` | Android kabuğu (WebView) |
| `build_apk.sh` | APK derleme betiği |

## Derleme
Gerekenler: Node.js, JDK 17+, Android SDK (platform 34, build-tools 35).
```bash
cd tools && npm install && cd ..
./build_apk.sh        # → dist/Beylik.apk
```
Tarayıcıda denemek için: `cd www && npx http-server` → http://localhost:8080

Not: `android/beylik.keystore` sadece bu proje için oluşturulmuş bir imza anahtarıdır
(şifre: `beylik123`). Güncellemelerin eski sürümün üstüne kurulabilmesi için aynı anahtar kullanılmalı.
