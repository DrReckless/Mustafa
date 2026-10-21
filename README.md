# Beylik 🏯

Anadolu'da geçen, Manor Lords tarzı **3D şehir kurma ve strateji oyunu** (Android).
Küçük bir obadan başlayıp Oba → Köy → Kasaba → Şehir → Sancak olarak büyür, komşu beylikleri alt edip
Sultanlığa yükselirsin.

**İçerik:** 40 bina · 3 seviyeli evler (Kerpiç → Avlulu → Kâgir Konak) · 28 kaynak · üretim zincirleri
(buğday→un→ekmek, demir+kömür→alet, yün→elbise/kilim, kil→çömlek, üzüm→pekmez, süt→peynir) ·
120 günlük yıl ve mevsimler · nadas ve toprak yorgunluğu · kışın yem ve odun · yiyecek bozulması ·
alet aşınması · salgın, yangın, suç · mahalleler · pazar günü · kervanlar ve seyyar tüccar ·
11 kanunluk kanunname · 5 komşu devletle diplomasi (haraç, ticaret, ittifak, savaş, baskınlar) ·
4 birlik türü (azap, okçu, akıncı, tımarlı sipahi) · 10 bölgelik fetih haritası ve akınlar ·
30 Divan olayı · 6 bölümde 32 görev · vakayiname ve istatistikler.

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
