# Borsa Analiz (Android)

BIST 100, hisse senetleri, dolar/euro, altın, gümüş ve petrol için günlük teknik + temel analiz,
piyasa risk analizi, ekonomi haberleri duygu analizi ve acil durum bildirimleri yapan Android uygulaması.

## Kurulum

1. `release/BorsaAnaliz.apk` dosyasını telefona indirin.
2. Açın; Android "bilinmeyen kaynaklardan yükleme" izni isterse verin.
3. İlk açılışta **bildirim iznine** izin verin.
4. Arka plan uyarılarının kaçmaması için: Ayarlar → Uygulamalar → Borsa Analiz → Pil → **Kısıtlanmamış**.

## Özellikler

- **Piyasa**: BIST 100/30/Banka, Dolar/TL, Euro/TL, gram & ons altın, gümüş, Brent/WTI petrol, S&P 500, VIX, Bitcoin.
  Her biri için AL/TUT/SAT sinyali ve risk seviyesi. Uygulama açıkken veriler her dakika tazelenir.
- **Piyasa risk analizi** (0-100): BIST trendi ve oynaklığı, kur şoku, VIX, petrol, altına kaçış ve haber tonu.
- **Sinyaller**: İzleme listesindeki hisseler (eklenip çıkarılabilir) skora göre sıralanır;
  önerilen stop ve hedef fiyat (ATR tabanlı) gösterilir.
- **Teknik analiz**: RSI, MACD, SMA 20/50/200 (altın/ölüm kesişimi), Bollinger, Stokastik, ATR, hacim, destek/direnç.
- **Temel analiz**: F/K, PD/DD, özsermaye kârlılığı, kâr marjı, borçluluk, büyüme, temettü.
- **Risk**: yıllık oynaklık, maksimum düşüş, günlük VaR %95, BIST 100'e göre beta.
- **Kripto**: Her yenilemede CoinGecko'dan piyasa değerine göre güncel ilk 100 coin (stablecoinler hariç)
  + kullanıcının eklediği coinler çekilir; Binance günlük mumlarıyla teknik analiz yapılır (yoksa Yahoo).
  Kripto risk kartı: Korku ve Açgözlülük Endeksi, Bitcoin trendi/oynaklığı, piyasa genişliği, haber tonu.
  Fiyatlar dolar ve yaklaşık TL karşılığıyla gösterilir.
- **Haberler**: Google Haberler + AA ekonomi RSS; başlıklar olumlu/olumsuz/nötr olarak puanlanır.
- **Portföy & bildirimler** (15/30/60 dk'da bir arka planda kontrol):
  - Fiyat stop seviyesinin altına inince **ACİL SAT** uyarısı
  - Günlük sert düşüş (varsayılan %5)
  - Portföydeki hissede SAT / GÜÇLÜ SAT sinyali
  - Hedef fiyata ulaşma, kullanıcı fiyat alarmları
  - Yüksek piyasa riski ve sabah günlük özet

## Derleme

```
./gradlew assembleRelease   # çıktı: app/build/outputs/apk/release/app-release.apk
```

GitHub Actions her push'ta APK'yı derleyip "BorsaAnaliz-apk" artifact'ı olarak yükler.

> Uyarı: Analizler otomatik göstergelere dayanır, yatırım tavsiyesi değildir.
> Veriler Yahoo Finance'ten gelir ve 15 dakikaya kadar gecikmeli olabilir.
