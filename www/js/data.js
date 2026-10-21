// =====================================================================
//  BEYLİK — oyun verileri
//  Kaynaklar, binalar, unvanlar, kanunlar, birlikler, bölgeler, komşular
// =====================================================================
var TW = 64, TH = 32;
var MAP_N = 64;                  // harita 64x64 karo
var DAY_SEC = 4;                 // 1x hızda bir gün (saniye)
var SEASON_DAYS = 30;            // bir mevsim 30 gün → bir yıl 120 gün
var YEAR_DAYS = SEASON_DAYS * 4;
var SEASONS = ['Bahar', 'Yaz', 'Güz', 'Kış'];
var SEASON_ICON = ['🌱', '☀️', '🍂', '❄️'];
var WORK_RATIO = 0.65;           // nüfusun çalışabilen kısmı
var START_YEAR = 1299;

// kat: ozel (sınırsız), gida (ambar), ham ve mal (depo)
var RES = {
  akce:   { ad: 'Akçe',    ikon: '🪙', kat: 'ozel' },
  nufuz:  { ad: 'Nüfuz',   ikon: '✨', kat: 'ozel' },
  odun:   { ad: 'Odun',    ikon: '🪵', kat: 'ham' },
  tas:    { ad: 'Taş',     ikon: '🪨', kat: 'ham' },
  kil:    { ad: 'Kil',     ikon: '🟤', kat: 'ham' },
  demir:  { ad: 'Demir',   ikon: '⛓️', kat: 'ham' },
  komur:  { ad: 'Kömür',   ikon: '⚫', kat: 'ham' },
  yun:    { ad: 'Yün',     ikon: '🧶', kat: 'ham' },
  deri:   { ad: 'Deri',    ikon: '🟫', kat: 'ham' },
  bugday: { ad: 'Buğday',  ikon: '🌾', kat: 'gida' },
  arpa:   { ad: 'Arpa',    ikon: '🌿', kat: 'gida' },
  un:     { ad: 'Un',      ikon: '🥣', kat: 'gida' },
  uzum:   { ad: 'Üzüm',    ikon: '🍇', kat: 'gida' },
  sut:    { ad: 'Süt',     ikon: '🥛', kat: 'gida' },
  ekmek:  { ad: 'Ekmek',   ikon: '🍞', kat: 'gida', yemek: 1, bozul: 0.012 },
  et:     { ad: 'Et',      ikon: '🍖', kat: 'gida', yemek: 1, bozul: 0.01 },
  balik:  { ad: 'Balık',   ikon: '🐟', kat: 'gida', yemek: 1, bozul: 0.015 },
  sebze:  { ad: 'Sebze',   ikon: '🥬', kat: 'gida', yemek: 1, bozul: 0.01 },
  meyve:  { ad: 'Meyve',   ikon: '🍎', kat: 'gida', yemek: 1, bozul: 0.008 },
  peynir: { ad: 'Peynir',  ikon: '🧀', kat: 'gida', yemek: 1, luks: 1, bozul: 0.002 },
  bal:    { ad: 'Bal',     ikon: '🍯', kat: 'gida', yemek: 1, luks: 1, bozul: 0 },
  pekmez: { ad: 'Pekmez',  ikon: '🫙', kat: 'gida', yemek: 1, luks: 1, bozul: 0 },
  elbise: { ad: 'Elbise',  ikon: '👘', kat: 'mal' },
  kilim:  { ad: 'Kilim',   ikon: '🧺', kat: 'mal' },
  comlek: { ad: 'Çömlek',  ikon: '🏺', kat: 'mal' },
  alet:   { ad: 'Alet',    ikon: '🔨', kat: 'mal' },
  silah:  { ad: 'Silah',   ikon: '🗡️', kat: 'mal' },
  yay:    { ad: 'Yay',     ikon: '🏹', kat: 'mal' },
  at:     { ad: 'At',      ikon: '🐎', kat: 'mal' }
};
var RES_KEYS = Object.keys(RES);
var FOODS = RES_KEYS.filter(function (k) { return RES[k].yemek; });

// Kervansaray fiyatları (birim başına)
var PRICES = {
  odun: { al: 2, sat: 1 }, tas: { al: 3, sat: 2 }, kil: { al: 2, sat: 1 }, demir: { al: 8, sat: 5 },
  komur: { al: 4, sat: 2 }, yun: { al: 4, sat: 2 }, deri: { al: 5, sat: 3 },
  bugday: { al: 3, sat: 2 }, arpa: { al: 3, sat: 1 }, un: { al: 4, sat: 3 },
  ekmek: { al: 5, sat: 3 }, et: { al: 5, sat: 3 }, balik: { al: 4, sat: 2 }, sebze: { al: 4, sat: 2 },
  meyve: { al: 5, sat: 3 }, peynir: { al: 9, sat: 6 }, bal: { al: 14, sat: 9 }, pekmez: { al: 12, sat: 8 },
  elbise: { al: 14, sat: 9 }, kilim: { al: 30, sat: 20 }, comlek: { al: 10, sat: 6 },
  alet: { al: 16, sat: 10 }, silah: { al: 24, sat: 15 }, yay: { al: 20, sat: 12 }, at: { al: 60, sat: 35 }
};

var TAX = [
  { ad: 'Yok',   carpan: 0,   mutluluk: 8 },
  { ad: 'Hafif', carpan: 0.6, mutluluk: 2 },
  { ad: 'Orta',  carpan: 1,   mutluluk: -6 },
  { ad: 'Ağır',  carpan: 1.5, mutluluk: -16 },
  { ad: 'Zalim', carpan: 2.2, mutluluk: -32 }
];

// Unvanlar: yeni binaların kilidini açar
var TITLES = [
  { id: 'oba',    ad: 'Oba',    sart: 'Başlangıç' },
  { id: 'koy',    ad: 'Köy',    pop: 40, sart: '40 nüfus' },
  { id: 'kasaba', ad: 'Kasaba', pop: 90, l2: 6, sart: '90 nüfus ve 6 avlulu ev' },
  { id: 'sehir',  ad: 'Şehir',  pop: 200, l3: 8, sart: '200 nüfus ve 8 kâgir konak' },
  { id: 'sancak', ad: 'Sancak', pop: 320, bolge: 3, sart: '320 nüfus ve 3 fethedilmiş bölge' }
];
var TITLE_IDX = {}; TITLES.forEach(function (t, n) { TITLE_IDX[t.id] = n; });
var LAW_SLOTS = [0, 1, 3, 5, 10];

// Ev seviyeleri ve ihtiyaçları
var HOUSE_LEVELS = [
  null,
  { ad: 'Kerpiç Ev', kap: 5, vergi: 0.035, ihtiyac: ['yemek1', 'su'] },
  { ad: 'Avlulu Ev', kap: 7, vergi: 0.07, ihtiyac: ['yemek2', 'su', 'pazar', 'ibadet', 'elbise'], yukselt: { odun: 20, tas: 15 } },
  { ad: 'Kâgir Konak', kap: 9, vergi: 0.13, ihtiyac: ['yemek3', 'su', 'pazar', 'ibadet', 'elbise', 'hamam', 'medrese', 'comlek', 'luks'], yukselt: { tas: 40, odun: 20, akce: 30, alet: 4 } }
];
var NEED_TEXT = {
  yemek1: 'En az 1 çeşit yiyecek', yemek2: 'En az 2 çeşit yiyecek', yemek3: 'En az 3 çeşit yiyecek',
  su: 'Çeşme/kuyu yakında', pazar: 'Pazar yakında', ibadet: 'Mescit/cami yakında', elbise: 'Elbise',
  hamam: 'Hamam yakında', medrese: 'Medrese yakında', comlek: 'Çömlek', luks: 'Lüks yiyecek (peynir/bal/pekmez)'
};

var CATEGORIES = [
  { id: 'halk', ad: 'Halk' }, { id: 'gida', ad: 'Gıda' }, { id: 'ham', ad: 'Hammadde' },
  { id: 'zanaat', ad: 'Zanaat' }, { id: 'din', ad: 'Din/İlim' }, { id: 'ticaret', ad: 'Ticaret' }, { id: 'askeri', ad: 'Askerî' }
];

// work: toplam işçi-gün; prod/input: işçi başına günlük
var BUILDINGS = {
  konak: { ad: 'Bey Konağı', kat: null, w: 2, h: 2, cost: {}, work: 0, ikon: '🏯', desc: 'Beyliğin merkezi. Vergi, kanunlar, ordu ve diplomasi buradan yönetilir.' },

  // ---- Halk ----
  ev: { ad: 'Kerpiç Ev', kat: 'halk', w: 1, h: 1, cost: { odun: 12 }, work: 6, unlock: 'oba', ikon: '🏠', house: true, fire: 0.5,
    desc: 'Bir hane barınır. İhtiyaçları karşılanırsa Avlulu Ev ve Kâgir Konak seviyesine yükselir; daha çok kişi barınır, daha çok vergi verir.' },
  kuyu: { ad: 'Kuyu', kat: 'halk', w: 1, h: 1, cost: { odun: 6, tas: 6 }, work: 6, unlock: 'oba', ikon: '🪣', service: 'su', radius: 4, desc: 'Yakındaki evlere su verir. Yangın söndürmeye yardım eder.' },
  cesme: { ad: 'Çeşme', kat: 'halk', w: 1, h: 1, cost: { tas: 15 }, work: 10, unlock: 'koy', ikon: '⛲', service: 'su', radius: 7, desc: 'Geniş alana su verir. Salgın ve yangın riskini azaltır.' },
  pazar: { ad: 'Pazar Yeri', kat: 'halk', w: 2, h: 2, cost: { odun: 30 }, work: 16, workers: 3, unlock: 'koy', ikon: '⛺', service: 'pazar', radius: 9,
    desc: 'Avlulu evler için gereklidir. Her 7 günde bir Pazar Günü kurulur: halk sevinir, pazar vergisi gelir.' },
  hamam: { ad: 'Hamam', kat: 'halk', w: 2, h: 2, cost: { tas: 50, odun: 30, akce: 60 }, work: 45, workers: 2, unlock: 'kasaba', ikon: '♨️', service: 'hamam', radius: 9,
    input: { odun: 0.4 }, desc: 'Kâgir konaklar için gereklidir. Odun yakar. Temizlik salgın riskini azaltır.' },
  imaret: { ad: 'İmaret', kat: 'halk', w: 2, h: 2, cost: { tas: 30, odun: 25 }, work: 30, workers: 2, unlock: 'kasaba', ikon: '🍲', service: 'imaret', radius: 10,
    input: { ekmek: 0.6, sebze: 0.3 }, desc: 'Yoksullara aş dağıtır. Yakındaki evlerde açlığı hafifletir, suçu azaltır.' },
  subasi: { ad: 'Subaşı Karakolu', kat: 'halk', w: 1, h: 1, cost: { tas: 20, odun: 15 }, work: 16, workers: 2, unlock: 'kasaba', ikon: '🛡️', service: 'asayis', radius: 10,
    desc: 'Asayişi sağlar. Etki alanında suç düşer.' },
  darussifa: { ad: 'Darüşşifa', kat: 'halk', w: 2, h: 2, cost: { tas: 60, odun: 30, akce: 80 }, work: 50, workers: 3, unlock: 'sehir', ikon: '⚕️', service: 'saglik', radius: 14,
    desc: 'Hastane. Salgın riskini ve salgında ölümleri büyük ölçüde azaltır.' },

  // ---- Gıda ----
  tarla: { ad: 'Tarla', kat: 'gida', w: 3, h: 3, cost: { odun: 8 }, work: 8, workers: 3, unlock: 'oba', ikon: '🌾', farm: true,
    desc: 'Baharda ekilir, yazın büyür, güzün hasat edilir. Ekin seçilebilir: buğday veya arpa. Her hasat toprağı yorar; nadasa bırakılan tarla dinlenir.' },
  bostan: { ad: 'Bostan', kat: 'gida', w: 2, h: 2, cost: { odun: 10 }, work: 8, workers: 2, unlock: 'koy', ikon: '🥬', need: 'su', prod: { sebze: 0.6 }, sezon: [0.3, 1, 1, 0],
    desc: 'Sebze yetiştirir. Nehre veya suya yakın olmalı. Kışın üretim yok.' },
  meyve: { ad: 'Meyve Bahçesi', kat: 'gida', w: 2, h: 2, cost: { odun: 15 }, work: 10, workers: 2, unlock: 'kasaba', ikon: '🍎', orchard: 'meyve',
    desc: 'Fidanlar ilk yıl ürün vermez. Sonra her yaz ve güz meyve verir.' },
  bag: { ad: 'Bağ', kat: 'gida', w: 2, h: 2, cost: { odun: 15 }, work: 10, workers: 2, unlock: 'kasaba', ikon: '🍇', orchard: 'uzum',
    desc: 'Asmalar ilk yıl ürün vermez. Sonra her güz üzüm verir.' },
  agil: { ad: 'Ağıl', kat: 'gida', w: 2, h: 2, cost: { odun: 25 }, work: 12, workers: 2, unlock: 'oba', ikon: '🐑', flock: true,
    desc: 'Koyun sürüsü: süt, yün, deri ve et. Sürü büyür ama kışın arpa yemi ister; yem yoksa koyunlar ölür.' },
  avci: { ad: 'Avcı Kulübesi', kat: 'gida', w: 1, h: 1, cost: { odun: 10 }, work: 6, workers: 2, unlock: 'oba', ikon: '🏹', need: 'orman',
    prod: { et: 0.45, deri: 0.12 }, sezon: [1, 1, 1, 0.35], fire: 1, desc: 'Ormanda avlanır: et ve deri. Kışın av azalır.' },
  balikci: { ad: 'Balıkçı', kat: 'gida', w: 1, h: 1, cost: { odun: 12 }, work: 6, workers: 2, unlock: 'oba', ikon: '🎣', need: 'kiyi',
    prod: { balik: 0.6 }, sezon: [1, 1, 0.8, 0.25], fire: 1, desc: 'Nehir kıyısına kurulmalı. Kışın az balık tutulur.' },
  arici: { ad: 'Arıcı', kat: 'gida', w: 1, h: 1, cost: { odun: 12 }, work: 6, workers: 1, unlock: 'koy', ikon: '🐝', prod: { bal: 0.25 }, sezon: [1, 1, 0.3, 0],
    desc: 'Bal üretir (lüks yiyecek). Baharda ve yazın çalışır.' },
  degirmen: { ad: 'Yel Değirmeni', kat: 'gida', w: 1, h: 1, cost: { odun: 25, tas: 10 }, work: 16, workers: 1, unlock: 'oba', ikon: '🌀',
    input: { bugday: 3 }, prod: { un: 3 }, fire: 0.6, desc: 'Buğdayı una çevirir.' },
  firin: { ad: 'Fırın', kat: 'gida', w: 1, h: 1, cost: { odun: 15, tas: 6 }, work: 12, workers: 2, unlock: 'oba', ikon: '🍞',
    input: { un: 1, odun: 0.15 }, prod: { ekmek: 2 }, fire: 1.2, desc: 'Undan ekmek pişirir.' },
  mandira: { ad: 'Mandıra', kat: 'gida', w: 1, h: 1, cost: { odun: 15, tas: 8 }, work: 10, workers: 2, unlock: 'koy', ikon: '🧀',
    input: { sut: 1.5 }, prod: { peynir: 0.6 }, desc: 'Sütten peynir yapar (lüks yiyecek, az bozulur).' },
  pekmezhane: { ad: 'Pekmezhane', kat: 'gida', w: 1, h: 1, cost: { odun: 15, tas: 15 }, work: 14, workers: 2, unlock: 'kasaba', ikon: '🫙',
    input: { uzum: 2, odun: 0.2 }, prod: { pekmez: 0.8 }, fire: 0.8, desc: 'Üzümden pekmez kaynatır (lüks yiyecek, bozulmaz).' },

  // ---- Hammadde ----
  oduncu: { ad: 'Oduncu', kat: 'ham', w: 1, h: 1, cost: { odun: 6 }, work: 6, workers: 2, unlock: 'oba', ikon: '🪓', need: 'orman',
    prod: { odun: 1.4 }, fire: 1, desc: 'Ağaç keser. Kesilen ağaçlar azalır; orman baharda yavaşça yenilenir.' },
  tasocagi: { ad: 'Taş Ocağı', kat: 'ham', w: 1, h: 1, cost: { odun: 15 }, work: 10, workers: 3, unlock: 'oba', ikon: '⛏️', need: 'tas',
    prod: { tas: 0.55 }, desc: 'Kayalık arazinin yanına kurulur.' },
  kilocagi: { ad: 'Kil Ocağı', kat: 'ham', w: 1, h: 1, cost: { odun: 10 }, work: 6, workers: 2, unlock: 'koy', ikon: '🟤', need: 'kiyi',
    prod: { kil: 0.8 }, sezon: [1, 1, 1, 0.3], desc: 'Nehir kıyısından kil çıkarır.' },
  maden: { ad: 'Demir Madeni', kat: 'ham', w: 2, h: 2, cost: { odun: 40, tas: 20 }, work: 30, workers: 4, unlock: 'kasaba', ikon: '⛰️', need: 'demir',
    prod: { demir: 0.35 }, desc: 'Kızıl kayalıklardaki demir damarına kurulur.' },
  komurcu: { ad: 'Kömürcü', kat: 'ham', w: 1, h: 1, cost: { odun: 15 }, work: 8, workers: 2, unlock: 'kasaba', ikon: '⚫',
    input: { odun: 1.2 }, prod: { komur: 0.6 }, fire: 1.5, desc: 'Odunu yakarak demirciler için kömür yapar.' },

  // ---- Zanaat ----
  dokumaci: { ad: 'Dokumacı', kat: 'zanaat', w: 1, h: 1, cost: { odun: 18 }, work: 10, workers: 2, unlock: 'koy', ikon: '🧵',
    input: { yun: 0.9 }, prod: { elbise: 0.45 }, zanaat: true, fire: 0.8, desc: 'Yünden elbise diker. Avlulu evler elbise ister.' },
  comlekci: { ad: 'Çömlekçi', kat: 'zanaat', w: 1, h: 1, cost: { odun: 15, tas: 8 }, work: 10, workers: 2, unlock: 'koy', ikon: '🏺',
    input: { kil: 1, odun: 0.3 }, prod: { comlek: 0.5 }, zanaat: true, desc: 'Kilden çömlek yapar. Kâgir konaklar çömlek ister.' },
  kilimci: { ad: 'Kilim Tezgâhı', kat: 'zanaat', w: 1, h: 1, cost: { odun: 20 }, work: 12, workers: 2, unlock: 'kasaba', ikon: '🧺',
    input: { yun: 1.2 }, prod: { kilim: 0.22 }, zanaat: true, fire: 0.8, desc: 'Yünden kilim dokur. Kervanlara ve bedestene pahalıya satılır.' },
  demirci: { ad: 'Demirci', kat: 'zanaat', w: 1, h: 1, cost: { odun: 20, tas: 20 }, work: 16, workers: 2, unlock: 'kasaba', ikon: '⚒️',
    input: { demir: 0.45, komur: 0.45 }, prod: { alet: 0.35 }, zanaat: true, fire: 1, desc: 'Alet yapar. Tüm işçiler alet kullanır; alet yoksa üretim düşer.' },
  silahhane: { ad: 'Silahhane', kat: 'askeri', w: 2, h: 2, cost: { tas: 40, odun: 30 }, work: 30, workers: 3, unlock: 'kasaba', ikon: '🗡️',
    input: { demir: 0.5, komur: 0.4, odun: 0.2 }, prod: { silah: 0.25 }, zanaat: true, fire: 0.8, desc: 'Kılıç ve mızrak yapar. Asker toplamak için gerekir.' },
  yayci: { ad: 'Yaycı', kat: 'askeri', w: 1, h: 1, cost: { odun: 25 }, work: 12, workers: 2, unlock: 'kasaba', ikon: '🏹',
    input: { odun: 0.5, deri: 0.25 }, prod: { yay: 0.25 }, zanaat: true, fire: 1, desc: 'Türk yayı yapar. Okçu toplamak için gerekir.' },
  ahir: { ad: 'Ahır', kat: 'askeri', w: 2, h: 2, cost: { odun: 40, tas: 10 }, work: 20, workers: 2, unlock: 'kasaba', ikon: '🐎',
    input: { arpa: 0.8 }, prod: { at: 0.05 }, fire: 1, desc: 'At yetiştirir. Arpa ister. Akıncı ve sipahi atsız olmaz.' },

  // ---- Din / İlim ----
  mescit: { ad: 'Mescit', kat: 'din', w: 1, h: 1, cost: { odun: 20, tas: 15 }, work: 16, workers: 1, unlock: 'koy', ikon: '🕌', service: 'ibadet', radius: 7, mahalle: true, nufuz: 0.02,
    desc: 'Küçük cami. Çevresindeki evler bir mahalle olur.' },
  cami: { ad: 'Cami', kat: 'din', w: 3, h: 3, cost: { tas: 90, odun: 40, akce: 120 }, work: 90, workers: 2, unlock: 'kasaba', ikon: '🕌', service: 'ibadet', radius: 13, mahalle: true, nufuz: 0.1,
    desc: 'Büyük mahalle merkezi. Nüfuz kazandırır.' },
  tekke: { ad: 'Tekke', kat: 'din', w: 2, h: 2, cost: { odun: 30, tas: 25 }, work: 30, workers: 2, unlock: 'kasaba', ikon: '🌙', service: 'tekke', radius: 10, nufuz: 0.06,
    desc: 'Dervişler halkı teselli eder: mutluluk ve nüfuz.' },
  medrese: { ad: 'Medrese', kat: 'din', w: 2, h: 2, cost: { tas: 70, odun: 30, akce: 100 }, work: 70, workers: 3, unlock: 'sehir', ikon: '📚', service: 'medrese', radius: 12, nufuz: 0.12,
    desc: 'İlim yuvası. Kâgir konaklar için gerekir. Nüfuz kazandırır.' },
  kadi: { ad: 'Kadı Mahkemesi', kat: 'din', w: 2, h: 2, cost: { tas: 50, odun: 30, akce: 80 }, work: 45, workers: 2, unlock: 'sehir', ikon: '⚖️', nufuz: 0.08,
    desc: 'Adalet dağıtır: tüm şehirde suç azalır, kanun sayısı artar (+1).' },
  ulucami: { ad: 'Ulu Cami', kat: 'din', w: 4, h: 4, cost: { tas: 400, odun: 150, akce: 800, alet: 40, kilim: 20 }, work: 500, workers: 5, unlock: 'sancak', ikon: '🕌',
    service: 'ibadet', radius: 22, mahalle: true, nufuz: 0.5, harika: true, desc: 'Beyliğin şaheseri. Sultanlık için gerekir. Çok büyük nüfuz kazandırır.' },

  // ---- Ticaret ----
  ambar: { ad: 'Ambar', kat: 'ticaret', w: 1, h: 1, cost: { odun: 25 }, work: 10, unlock: 'oba', ikon: '🛖', storage: { gida: 200 }, fire: 1,
    desc: 'Yiyecek deposu: gıda sınırını 200 artırır, bozulmayı azaltır.' },
  depo: { ad: 'Depo', kat: 'ticaret', w: 1, h: 1, cost: { odun: 25, tas: 5 }, work: 10, unlock: 'oba', ikon: '📦', storage: { ham: 200, mal: 100 }, fire: 0.6,
    desc: 'Hammadde ve mal deposu: sınırları artırır.' },
  kervansaray: { ad: 'Kervansaray', kat: 'ticaret', w: 3, h: 3, cost: { tas: 80, odun: 50, akce: 100 }, work: 70, workers: 3, unlock: 'kasaba', ikon: '🐫',
    desc: 'Kervanlar uğrar: alım satım yapılır, gümrük geliri gelir. Ticaret anlaşmaları kervan sayısını artırır.' },
  bedesten: { ad: 'Bedesten', kat: 'ticaret', w: 2, h: 3, cost: { tas: 100, odun: 30, akce: 150, alet: 10 }, work: 80, workers: 4, unlock: 'sehir', ikon: '🏛️',
    desc: 'Kapalı çarşı. Kilim, çömlek, pekmez ve balı otomatik satıp yüksek akçe getirir.' },

  // ---- Askerî ----
  kisla: { ad: 'Kışla', kat: 'askeri', w: 3, h: 3, cost: { tas: 60, odun: 50 }, work: 50, unlock: 'kasaba', ikon: '🏰', kisla: 40, fire: 0.5,
    desc: 'Asker toplanır ve barınır (40 asker). Askerler nüfustan alınır.' },
  kule: { ad: 'Gözcü Kulesi', kat: 'askeri', w: 1, h: 1, cost: { tas: 30, odun: 15 }, work: 20, workers: 1, unlock: 'kasaba', ikon: '🗼', savunma: 15,
    desc: 'Savunmayı güçlendirir, baskınları erken haber verir.' },
  mehterhane: { ad: 'Mehterhane', kat: 'askeri', w: 1, h: 1, cost: { tas: 20, odun: 20, akce: 60 }, work: 20, workers: 2, unlock: 'sehir', ikon: '🥁',
    desc: 'Mehter takımı ordunun moralini yükseltir (+%15).' }
};
Object.keys(BUILDINGS).forEach(function (k) { BUILDINGS[k].key = k; });

// Kanunname
var LAWS = [
  { id: 'ahi', ad: 'Ahi Teşkilatı', bedel: 30, desc: 'Zanaat üretimi +%20, alet aşınması −%30.' },
  { id: 'vakif', ad: 'Vakıf Sistemi', bedel: 25, desc: 'Cami, imaret, çeşme gibi hizmetler halkı daha çok mutlu eder (+5).' },
  { id: 'timar', ad: 'Tımar Kanunu', bedel: 40, desc: 'Tımarlı sipahi toplanabilir. Tarla verimi +%10.' },
  { id: 'kervan', ad: 'Kervan Himayesi', bedel: 30, desc: 'Kervanlar daha sık gelir, eşkıya kervan soyamaz.' },
  { id: 'asayis', ad: 'Sıkı Asayiş', bedel: 20, desc: 'Suç −%50 ama halk mutluluğu −4.' },
  { id: 'istimalet', ad: 'İstimalet (Hoşgörü)', bedel: 35, desc: 'Fethedilen bölgelerde isyan riski yarıya iner, göç artar.' },
  { id: 'kitlik', ad: 'Kıtlık Ambarları', bedel: 20, desc: 'Yiyecek bozulması yarıya iner.' },
  { id: 'akinci', ad: 'Akıncı Geleneği', bedel: 30, desc: 'Akıncı maliyeti −%30, seferlerde ganimet ×2.' },
  { id: 'ilim', ad: 'İlme Hürmet', bedel: 40, req: 'medrese', desc: 'Nüfuz üretimi +%50. (Medrese gerekir)' },
  { id: 'mehter', ad: 'Mehter Usulü', bedel: 25, req: 'mehterhane', desc: 'Ordu morali +%20. (Mehterhane gerekir)' },
  { id: 'imece', ad: 'İmece', bedel: 15, desc: 'İnşaatlar %30 daha hızlı.' }
];

// Birlikler: g=güç, kars=karşı üstünlük
var UNITS = {
  azap:   { ad: 'Azap (Piyade)', ikon: '🛡️', guc: 1.0, kars: 'akinci', bedel: { silah: 1, akce: 4 }, bakim: 0.06 },
  okcu:   { ad: 'Okçu', ikon: '🏹', guc: 1.1, kars: 'azap', bedel: { yay: 1, akce: 5 }, bakim: 0.08 },
  akinci: { ad: 'Akıncı', ikon: '🐎', guc: 1.6, kars: 'okcu', bedel: { at: 1, silah: 1, akce: 10 }, bakim: 0.14 },
  sipahi: { ad: 'Tımarlı Sipahi', ikon: '⚔️', guc: 2.4, kars: 'azap', bedel: { at: 1, silah: 1, nufuz: 3 }, bakim: 0, timar: true }
};
var UNIT_KEYS = Object.keys(UNITS);

// Komşu beylikler ve devletler
var FACTIONS = {
  bizans:   { ad: 'Bizans Tekfurları', renk: '#7b2d5a', guc: 160, buyume: 0.25, tavir: 'savunmaci' },
  germiyan: { ad: 'Germiyanoğulları', renk: '#2f6b4a', guc: 120, buyume: 0.3, tavir: 'firsatci' },
  karaman:  { ad: 'Karamanoğulları', renk: '#a8322b', guc: 200, buyume: 0.35, tavir: 'saldirgan' },
  ilhanli:  { ad: 'İlhanlı Valisi', renk: '#3a4a6a', guc: 300, buyume: 0.2, tavir: 'haracci' },
  turkmen:  { ad: 'Bağımsız Türkmenler', renk: '#a07a30', guc: 40, buyume: 0.1, tavir: 'baris' }
};

// Bölgeler (strateji haritası; x,y yüzde)
var REGIONS = [
  { id: 'karacahisar', ad: 'Karacahisar', sahip: 'bizans', garnizon: 45, mesafe: 6, x: 47, y: 50, gelir: { akce: 1.5, tas: 1 } },
  { id: 'yenisehir', ad: 'Yenişehir', sahip: 'turkmen', garnizon: 30, mesafe: 5, x: 40, y: 32, gelir: { akce: 1, bugday: 2 } },
  { id: 'inegol', ad: 'İnegöl', sahip: 'bizans', garnizon: 60, mesafe: 7, x: 30, y: 40, gelir: { akce: 1.5, odun: 2, et: 0.5 } },
  { id: 'bilecik', ad: 'Bilecik', sahip: 'bizans', garnizon: 70, mesafe: 6, x: 58, y: 33, gelir: { akce: 2.5 } },
  { id: 'eskisehir', ad: 'Eskişehir', sahip: 'germiyan', garnizon: 85, mesafe: 8, x: 66, y: 60, gelir: { akce: 2, yun: 1.5 } },
  { id: 'kutahya', ad: 'Kütahya', sahip: 'germiyan', garnizon: 140, mesafe: 12, x: 55, y: 80, gelir: { akce: 4, nufuz: 0.1 } },
  { id: 'iznik', ad: 'İznik', sahip: 'bizans', garnizon: 180, mesafe: 10, x: 40, y: 14, gelir: { akce: 5, nufuz: 0.15 } },
  { id: 'bursa', ad: 'Bursa', sahip: 'bizans', garnizon: 230, mesafe: 14, x: 15, y: 30, gelir: { akce: 7, kilim: 0.05 } },
  { id: 'ankara', ad: 'Ankara', sahip: 'ilhanli', garnizon: 200, mesafe: 16, x: 88, y: 45, gelir: { akce: 4, yun: 2, nufuz: 0.1 } },
  { id: 'konya', ad: 'Konya', sahip: 'karaman', garnizon: 260, mesafe: 20, x: 82, y: 88, gelir: { akce: 6, nufuz: 0.2 } }
];

var MAHALLE_NAMES = ['Hacı Bayram', 'Ahi Evran', 'Kayı', 'Yeşilce', 'Çarşı', 'Kuyulu', 'Dere', 'Bağlar', 'Hamam', 'Sarıca', 'Tekke', 'Kale', 'Ilıca', 'Kozluca', 'Değirmen', 'Musalla', 'Şeyh Edebali', 'Karaca', 'Akpınar', 'Bostanlı'];

// ---------- Görevler (bölümler halinde) ----------
function countB(g, type, builtOnly) {
  var n = 0;
  for (var i = 0; i < g.buildings.length; i++) {
    var b = g.buildings[i];
    if (b.type === type && (!builtOnly || b.progress >= 1)) n++;
  }
  return n;
}
function countLevel(g, lvl) {
  var n = 0;
  for (var i = 0; i < g.buildings.length; i++) if (g.buildings[i].type === 'ev' && g.buildings[i].progress >= 1 && g.buildings[i].level >= lvl) n++;
  return n;
}
function cb(t) { return function (g) { return countB(g, t, true) >= 1; }; }
var QUESTS = [
  { bolum: 'I. Oba', ad: '4 kerpiç ev tamamla', check: function (g) { return countB(g, 'ev', true) >= 4; }, odul: { odun: 30 } },
  { bolum: 'I. Oba', ad: 'Bir kuyu kaz', check: cb('kuyu'), odul: { akce: 20 } },
  { bolum: 'I. Oba', ad: 'Oduncu kur', check: cb('oduncu'), odul: { odun: 20 } },
  { bolum: 'I. Oba', ad: 'Avcı veya balıkçı kur', check: function (g) { return countB(g, 'avci', true) + countB(g, 'balikci', true) >= 1; }, odul: { et: 15 } },
  { bolum: 'I. Oba', ad: 'Bir tarla aç', check: cb('tarla'), odul: { akce: 25 } },
  { bolum: 'I. Oba', ad: 'Ambar kur', check: cb('ambar'), odul: { odun: 25 } },
  { bolum: 'I. Oba', ad: 'Taş ocağı kur', check: cb('tasocagi'), odul: { akce: 25 } },
  { bolum: 'I. Oba', ad: 'İlk kışı atlat', check: function (g) { return g.day >= YEAR_DAYS; }, odul: { akce: 50, nufuz: 5 } },
  { bolum: 'II. Köy', ad: 'Köy ol (40 nüfus)', check: function (g) { return g.titleIdx >= 1; }, odul: { akce: 50 } },
  { bolum: 'II. Köy', ad: 'Değirmen ve fırın kur', check: function (g) { return countB(g, 'degirmen', true) && countB(g, 'firin', true); }, odul: { bugday: 30 } },
  { bolum: 'II. Köy', ad: 'Ağıl ve dokumacı kur', check: function (g) { return countB(g, 'agil', true) && countB(g, 'dokumaci', true); }, odul: { yun: 20 } },
  { bolum: 'II. Köy', ad: 'Pazar ve mescit kur', check: function (g) { return countB(g, 'pazar', true) && countB(g, 'mescit', true); }, odul: { akce: 60, nufuz: 5 } },
  { bolum: 'II. Köy', ad: 'İlk avlulu evi yükselt', check: function (g) { return countLevel(g, 2) >= 1; }, odul: { akce: 60 } },
  { bolum: 'II. Köy', ad: 'İlk kanunu çıkar', check: function (g) { return g.laws.length >= 1; }, odul: { nufuz: 10 } },
  { bolum: 'II. Köy', ad: '5 çeşit yiyecek stokla', check: function (g) { return FOODS.filter(function (f) { return g.res[f] >= 5; }).length >= 5; }, odul: { akce: 80 } },
  { bolum: 'III. Kasaba', ad: 'Kasaba ol', check: function (g) { return g.titleIdx >= 2; }, odul: { akce: 100, nufuz: 10 } },
  { bolum: 'III. Kasaba', ad: 'Demir madeni, kömürcü ve demirci kur', check: function (g) { return countB(g, 'maden', true) && countB(g, 'komurcu', true) && countB(g, 'demirci', true); }, odul: { alet: 10 } },
  { bolum: 'III. Kasaba', ad: 'Cami inşa et', check: cb('cami'), odul: { nufuz: 20 } },
  { bolum: 'III. Kasaba', ad: 'Kervansaray kur', check: cb('kervansaray'), odul: { akce: 150 } },
  { bolum: 'III. Kasaba', ad: 'Kışla kur ve 10 asker topla', check: function (g) { return armySize(g) >= 10; }, odul: { silah: 5 } },
  { bolum: 'III. Kasaba', ad: 'Bir komşuyla ticaret anlaşması yap', check: function (g) { return Object.keys(g.fac).some(function (f) { return g.fac[f].antlasma === 'ticaret' || g.fac[f].antlasma === 'ittifak'; }); }, odul: { akce: 100 } },
  { bolum: 'III. Kasaba', ad: 'İlk bölgeyi fethet', check: function (g) { return ownedRegions(g) >= 1; }, odul: { nufuz: 25, akce: 150 } },
  { bolum: 'III. Kasaba', ad: 'Hamam yaptır', check: cb('hamam'), odul: { akce: 80 } },
  { bolum: 'IV. Şehir', ad: 'Şehir ol', check: function (g) { return g.titleIdx >= 3; }, odul: { akce: 250, nufuz: 25 } },
  { bolum: 'IV. Şehir', ad: 'Medrese kur', check: cb('medrese'), odul: { nufuz: 30 } },
  { bolum: 'IV. Şehir', ad: 'Bedesten kur', check: cb('bedesten'), odul: { akce: 300 } },
  { bolum: 'IV. Şehir', ad: '3 bölgeye hükmet', check: function (g) { return ownedRegions(g) >= 3; }, odul: { nufuz: 40 } },
  { bolum: 'IV. Şehir', ad: '10 kâgir konak', check: function (g) { return countLevel(g, 3) >= 10; }, odul: { akce: 400 } },
  { bolum: 'V. Sancak', ad: 'Sancak ol', check: function (g) { return g.titleIdx >= 4; }, odul: { akce: 500, nufuz: 50 } },
  { bolum: 'V. Sancak', ad: 'Ulu Cami inşa et', check: cb('ulucami'), odul: { nufuz: 100 } },
  { bolum: 'V. Sancak', ad: '6 bölgeye hükmet', check: function (g) { return ownedRegions(g) >= 6; }, odul: { akce: 800 } },
  { bolum: 'VI. Sultanlık', ad: 'Tüm bölgeleri fethet, 400 nüfusa ulaş', check: function (g) { return ownedRegions(g) >= REGIONS.length && g.pop >= 400 && countB(g, 'ulucami', true) >= 1; }, odul: { nufuz: 500 } }
];

function armySize(g) { var n = 0; for (var k in g.army) n += g.army[k]; return n; }
function ownedRegions(g) { var n = 0; for (var k in g.regions) if (g.regions[k].sahip === 'biz') n++; return n; }

// ---------- Divan olayları ----------
// kosul(g): olay çıkabilir mi; secenekler: {ad, kosul:{kaynak}, etki:{res, mod, pop, ...}}
var EVENTS = [
  { id: 'dervis', baslik: 'Gezgin Derviş', metin: 'Horasan\'dan gelen bir derviş kasabana yerleşmek istiyor. Tekke için 25 odun istiyor.',
    secenekler: [{ ad: 'Odun ver (−25 odun)', kosul: { odun: 25 }, etki: { res: { odun: -25, nufuz: 4 }, mod: { ad: 'Dervişin duası', mutluluk: 8, gun: 40 } } }, { ad: 'Kibarca reddet', etki: {} }] },
  { id: 'eskiya', baslik: 'Eşkıya Baskını', metin: 'Dağdaki eşkıyalar köy yollarını kesiyor. Halk tedirgin.',
    secenekler: [{ ad: 'Subaşıyı gönder (−40 akçe)', kosul: { akce: 40 }, etki: { res: { akce: -40 }, mod: { ad: 'Yollar güvende', mutluluk: 4, gun: 20 } } },
      { ad: 'Askerlerle ez (5+ asker)', kosulF: function (g) { return armySize(g) >= 5; }, etki: { res: { nufuz: 3 }, kayipAsker: 1 } },
      { ad: 'Görmezden gel', etki: { mod: { ad: 'Eşkıya korkusu', mutluluk: -12, gun: 30 }, kayip: 0.1 } }] },
  { id: 'yoruk', baslik: 'Yörük Obası', metin: 'Bir Yörük obası kışlak arıyor. Toprağına yerleşmelerine izin verir misin?',
    secenekler: [{ ad: 'Yerleşsinler (+nüfus)', etki: { pop: 8 } }, { ad: 'Koyunlarını satın al (−30 akçe)', kosul: { akce: 30 }, etki: { res: { akce: -30, et: 20, yun: 20, deri: 5 } } }, { ad: 'Geçsinler', etki: {} }] },
  { id: 'kurak', baslik: 'Kuraklık', mevsim: [0, 1], metin: 'Aylardır yağmur yağmadı. Tarlalar kuruyor.',
    secenekler: [{ ad: 'Kuyular kazdır (−30 taş, −20 odun)', kosul: { tas: 30, odun: 20 }, etki: { res: { tas: -30, odun: -20 }, kuraklik: 0.1 } }, { ad: 'Yağmur duasına çık', etki: { kuraklik: 0.4, res: { nufuz: 2 } } }] },
  { id: 'cekirge', baslik: 'Çekirge İstilası', mevsim: [1], kosul: function (g) { return countB(g, 'tarla', true) > 0; }, metin: 'Çekirge sürüleri ufukta göründü!',
    secenekler: [{ ad: 'Halkı tarlaya çıkar (10 gün üretim −%30)', etki: { mod: { ad: 'Çekirgeyle mücadele', uretim: -0.3, gun: 10 }, kuraklik: 0.1 } }, { ad: 'Allah\'a havale et', etki: { kuraklik: 0.5 } }] },
  { id: 'kurt', baslik: 'Kurt Sürüsü', mevsim: [3], kosul: function (g) { return countB(g, 'agil', true) > 0; }, metin: 'Aç kurtlar ağıllara dadandı.',
    secenekler: [{ ad: 'Avcıları gönder (−15 akçe)', kosul: { akce: 15 }, etki: { res: { akce: -15, deri: 4 } } }, { ad: 'Çobanlar baksın', etki: { koyunKayip: 0.3 } }] },
  { id: 'sel', baslik: 'Sel', mevsim: [0], metin: 'Kar suları nehri taşırdı. Kıyıdaki yapılar tehlikede.',
    secenekler: [{ ad: 'Set çek (−40 taş)', kosul: { tas: 40 }, etki: { res: { tas: -40 } } }, { ad: 'Kıyıdakileri tahliye et', etki: { sel: true } }] },
  { id: 'kacak', baslik: 'Bizans Kaçakları', metin: 'Tekfurun zulmünden kaçan Rum köylüler sığınma istiyor. Usta zanaatkârlar var aralarında.',
    secenekler: [{ ad: 'Kabul et (+nüfus, Bizans kızar)', etki: { pop: 10, iliski: { bizans: -10 }, mod: { ad: 'Usta ellerin bereketi', uretim: 0.1, gun: 60 } } }, { ad: 'Geri çevir (Bizans memnun)', etki: { iliski: { bizans: 8 } } }] },
  { id: 'ulema', baslik: 'Âlimlerin Daveti', kosul: function (g) { return g.titleIdx >= 1; }, metin: 'Konya\'dan bir âlim gelip ders vermek istiyor. Ağırlanması masraflı.',
    secenekler: [{ ad: 'Ağırla (−50 akçe)', kosul: { akce: 50 }, etki: { res: { akce: -50, nufuz: 12 } } }, { ad: 'Teşekkür et', etki: {} }] },
  { id: 'asik', baslik: 'Âşık Geldi', metin: 'Sazıyla bir âşık geldi. Meydanda halka destan okumak istiyor.',
    secenekler: [{ ad: 'Şenlik düzenle (−20 ekmek, −10 et)', kosul: { ekmek: 20, et: 10 }, etki: { res: { ekmek: -20, et: -10 }, mod: { ad: 'Şenlik', mutluluk: 12, gun: 20 } } }, { ad: 'Bahşiş ver (−10 akçe)', kosul: { akce: 10 }, etki: { res: { akce: -10 }, mod: { ad: 'Destanlar', mutluluk: 4, gun: 15 } } }] },
  { id: 'hirsiz', baslik: 'Hırsızlık Şikâyeti', kosul: function (g) { return g.crime > 25; }, metin: 'Çarşıda hırsızlık arttı. Esnaf divana şikâyete geldi.',
    secenekler: [{ ad: 'Bekçi tut (−30 akçe/sezon gibi; şimdi −40)', kosul: { akce: 40 }, etki: { res: { akce: -40 }, suc: -20 } }, { ad: 'Hırsızı ibret için cezalandır', etki: { suc: -10, mod: { ad: 'Sert ceza', mutluluk: -5, gun: 20 } } }] },
  { id: 'sinir', baslik: 'Toprak Davası', kosul: function (g) { return g.pop > 40; }, metin: 'İki köylü bir tarla sınırı için kavgalı. Hükmünü bekliyorlar.',
    secenekler: [{ ad: 'Hakkaniyetle böl', etki: { mod: { ad: 'Adil hüküm', mutluluk: 5, gun: 25 }, res: { nufuz: 2 } } }, { ad: 'Zengin olana ver (+30 akçe rüşvet)', etki: { res: { akce: 30 }, mod: { ad: 'Haksız hüküm', mutluluk: -8, gun: 40 }, suc: 5 } }] },
  { id: 'mimar', baslik: 'Usta Mimar', kosul: function (g) { return g.titleIdx >= 1; }, metin: 'Tebrizli bir mimar hizmet vermek istiyor.',
    secenekler: [{ ad: 'İşe al (−60 akçe): 60 gün inşaat hızı +%50', kosul: { akce: 60 }, etki: { res: { akce: -60 }, mod: { ad: 'Usta mimar', insaat: 0.5, gun: 60 } } }, { ad: 'Gerek yok', etki: {} }] },
  { id: 'damar', baslik: 'Maden Damarı', kosul: function (g) { return countB(g, 'tasocagi', true) > 0; }, metin: 'Taşçılar kayalıkta parlak bir damar buldu!',
    secenekler: [{ ad: 'Hemen kazdır (+25 demir)', etki: { res: { demir: 25 } } }, { ad: 'Satıp akçe yap (+70 akçe)', etki: { res: { akce: 70 } } }] },
  { id: 'soygun', baslik: 'Kervan Soyuldu', kosul: function (g) { return countB(g, 'kervansaray', true) > 0 && g.laws.indexOf('kervan') < 0; }, metin: 'Halep\'ten gelen kervan senin topraklarında soyuldu. Tüccarlar tazminat istiyor.',
    secenekler: [{ ad: 'Tazminat öde (−80 akçe)', kosul: { akce: 80 }, etki: { res: { akce: -80, nufuz: 5 } } }, { ad: 'Reddet (kervanlar bir süre gelmez)', etki: { kervanYasak: 60, res: { nufuz: -5 } } }] },
  { id: 'hasat', baslik: 'Hasat Bayramı', mevsim: [2], metin: 'Ambarlar doldu, köylüler hasat bayramı yapmak istiyor.',
    secenekler: [{ ad: 'Bayram yap (−30 ekmek)', kosul: { ekmek: 30 }, etki: { res: { ekmek: -30 }, mod: { ad: 'Hasat bayramı', mutluluk: 10, gun: 25 } } }, { ad: 'Ambarı koru', etki: { mod: { ad: 'Kırgınlık', mutluluk: -3, gun: 15 } } }] },
  { id: 'bayram', baslik: 'Kurban Bayramı', metin: 'Bayram geldi. Halk beyin kurban dağıtmasını bekliyor.',
    secenekler: [{ ad: 'Kurban dağıt (−25 et)', kosul: { et: 25 }, etki: { res: { et: -25, nufuz: 6 }, mod: { ad: 'Bayram', mutluluk: 12, gun: 15 } } }, { ad: 'Sade bayram', etki: { mod: { ad: 'Sönük bayram', mutluluk: -4, gun: 15 } } }] },
  { id: 'kitlik', baslik: 'Kıtlık', mevsim: [3], kosul: function (g) { return foodTotal(g) < g.pop * 2; }, metin: 'Kış uzun sürdü, ambarlar boşalıyor. Halk aç.',
    secenekler: [{ ad: 'Hazineden tahıl al (−100 akçe, +60 buğday)', kosul: { akce: 100 }, etki: { res: { akce: -100, bugday: 60 } } }, { ad: 'Vergiyi kaldır (bu sezon)', etki: { mod: { ad: 'Vergi affı', mutluluk: 10, vergi: -1, gun: 30 } } }, { ad: 'Dayansınlar', etki: { mod: { ad: 'Kıtlık', mutluluk: -15, gun: 30 } } }] },
  { id: 'yigit', baslik: 'Yiğitler', kosul: function (g) { return countB(g, 'kisla', true) > 0; }, metin: 'Civar köylerden genç yiğitler gaza için orduna katılmak istiyor.',
    secenekler: [{ ad: 'Kabul et (+6 azap, silahları sende)', kosulF: function (g) { return g.res.silah >= 6; }, etki: { res: { silah: -6 }, asker: { azap: 6 } } }, { ad: 'Kendi silahlarıyla gelsinler (+3 azap)', etki: { asker: { azap: 3 } } }] },
  { id: 'sipahi', baslik: 'Sipahi Şikâyeti', kosul: function (g) { return g.army.sipahi > 0; }, metin: 'Tımarlı sipahiler dirliklerinin küçük olduğundan yakınıyor.',
    secenekler: [{ ad: 'Dirlik ekle (−8 nüfuz)', kosul: { nufuz: 8 }, etki: { res: { nufuz: -8 }, moral: 10 } }, { ad: 'Sabır tavsiye et', etki: { moral: -15 } }] },
  { id: 'borc', baslik: 'Tüccarın Teklifi', metin: 'Zengin bir tüccar 250 akçe borç vermeyi teklif ediyor. 90 gün sonra 330 akçe geri isteyecek.',
    secenekler: [{ ad: 'Borç al (+250 akçe)', etki: { res: { akce: 250 }, borc: { tutar: 330, gun: 90 } } }, { ad: 'Gerek yok', etki: {} }] },
  { id: 'yangin', baslik: 'Kuru Rüzgâr', mevsim: [1], metin: 'Sıcak ve kuru rüzgâr esiyor. Ahşap yapılar yangın tehlikesinde.',
    secenekler: [{ ad: 'Bekçi ve su fıçıları (−25 akçe)', kosul: { akce: 25 }, etki: { res: { akce: -25 }, mod: { ad: 'Yangın nöbeti', yangin: -0.8, gun: 30 } } }, { ad: 'Önlem alma', etki: { mod: { ad: 'Kuru rüzgâr', yangin: 1.5, gun: 30 } } }] },
  { id: 'tahsildar', baslik: 'Moğol Tahsildarı', kosul: function (g) { return g.titleIdx >= 1 && g.fac.ilhanli.antlasma !== 'ittifak'; }, metin: 'İlhanlı valisinin tahsildarı geldi. "Sultanımıza vergi borcunuz var" diyor.',
    secenekler: [{ ad: 'Öde (−akçe)', kosulF: function (g) { return g.res.akce >= Math.round(30 + g.pop * 0.5); }, etki: { haracIlhanli: true, iliski: { ilhanli: 10 } } },
      { ad: 'Oyala, hediye ver (−5 nüfuz)', kosul: { nufuz: 5 }, etki: { res: { nufuz: -5 }, iliski: { ilhanli: 2 } } }, { ad: 'Kov', etki: { iliski: { ilhanli: -25 } } }] },
  { id: 'ahi', baslik: 'Ahi Esnafı', kosul: function (g) { return g.titleIdx >= 1; }, metin: 'Ahi ustaları dükkân açmak istiyor. Karşılığında vergi muafiyeti istiyorlar.',
    secenekler: [{ ad: 'Kabul et (−30 akçe, 90 gün üretim +%15)', kosul: { akce: 30 }, etki: { res: { akce: -30 }, mod: { ad: 'Ahi ustaları', uretim: 0.15, gun: 90 } } }, { ad: 'Reddet', etki: {} }] },
  { id: 'veba', baslik: 'Veba Söylentisi', kosul: function (g) { return g.pop > 70; }, metin: 'Limandan gelen tüccarlar arasında hastalık varmış. Ne yapalım?',
    secenekler: [{ ad: 'Karantina (30 gün ticaret yok, −10 mutluluk)', etki: { kervanYasak: 30, mod: { ad: 'Karantina', mutluluk: -6, saglik: 0.8, gun: 30 } } }, { ad: 'Önemseme', etki: { salgin: 0.5 } }] },
  { id: 'evlilik', baslik: 'Kız İstemeye Geldiler', kosul: function (g) { return g.titleIdx >= 2; }, metin: 'Germiyan beyi oğlu için senin kızını istiyor.',
    secenekler: [{ ad: 'Ver (−100 akçe çeyiz, Germiyan +30)', kosul: { akce: 100 }, etki: { res: { akce: -100 }, iliski: { germiyan: 30 } } }, { ad: 'Reddet', etki: { iliski: { germiyan: -10 } } }] },
  { id: 'ganimet', baslik: 'Akıncılar Döndü', kosul: function (g) { return g.army.akinci >= 3; }, metin: 'Akıncı beyleri sınır ötesine yağma akını yapmak için izin istiyor.',
    secenekler: [{ ad: 'İzin ver (ganimet, Bizans kızar)', etki: { ganimet: true, iliski: { bizans: -15 } } }, { ad: 'Yasakla', etki: { moral: -5 } }] },
  { id: 'kehanet', baslik: 'Şeyhin Rüyası', kosul: function (g) { return g.titleIdx >= 1; }, metin: 'Şeyh, rüyasında göğsünden bir ağaç çıkıp dalları cihanı sardığını görmüş. Halk heyecanlı.',
    secenekler: [{ ad: 'Şeyhi ziyaret et (+nüfuz)', etki: { res: { nufuz: 8 }, mod: { ad: 'Kutlu rüya', mutluluk: 6, gun: 40 } } }] },
  { id: 'ayaklanma', baslik: 'Halk Ayaklanıyor', kosul: function (g) { return g.taxLevel >= 3 && g.happiness < 45; }, metin: 'Ağır vergilerden bunalan köylüler konağın önünde toplandı!',
    secenekler: [{ ad: 'Vergiyi indir', etki: { vergiIndir: true, res: { nufuz: -3 } } }, { ad: 'Askerle dağıt (5+ asker)', kosulF: function (g) { return armySize(g) >= 5; }, etki: { mod: { ad: 'Kanlı bastırma', mutluluk: -15, gun: 60 }, pop: -4 } }, { ad: 'Elebaşlarını sürgün et', etki: { pop: -8, mod: { ad: 'Sürgün', mutluluk: -5, gun: 30 } } }] },
  { id: 'misafir', baslik: 'Elçi Ziyareti', kosul: function (g) { return g.titleIdx >= 2; }, metin: 'Karamanoğulları\'ndan bir elçi dostluk mektubu getirdi.',
    secenekler: [{ ad: 'Hediyelerle karşıla (−40 akçe, Karaman +20)', kosul: { akce: 40 }, etki: { res: { akce: -40 }, iliski: { karaman: 20 } } }, { ad: 'Soğuk karşıla', etki: { iliski: { karaman: -8 } } }] }
];

function foodTotal(g) { var s = 0; for (var i = 0; i < FOODS.length; i++) s += g.res[FOODS[i]]; return s; }
