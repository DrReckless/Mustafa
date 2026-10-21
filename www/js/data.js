// Oyun verileri: kaynaklar, binalar, olaylar, görevler
var TW = 64, TH = 32;            // izometrik karo boyutu (piksel)
var MAP_N = 48;                  // harita 48x48 karo
var DAY_SEC = 2.5;               // 1x hızda bir gün kaç saniye
var SEASON_DAYS = 12;            // bir mevsim kaç gün
var SEASONS = ['Bahar', 'Yaz', 'Güz', 'Kış'];
var SEASON_ICON = ['🌱', '☀️', '🍂', '❄️'];

var RES = {
  akce:   { ad: 'Akçe',   ikon: '🪙' },
  odun:   { ad: 'Odun',   ikon: '🪵' },
  tas:    { ad: 'Taş',    ikon: '🪨' },
  bugday: { ad: 'Buğday', ikon: '🌾' },
  un:     { ad: 'Un',     ikon: '🥣' },
  ekmek:  { ad: 'Ekmek',  ikon: '🍞' },
  et:     { ad: 'Et',     ikon: '🍖' },
  yun:    { ad: 'Yün',    ikon: '🧶' },
  kilim:  { ad: 'Kilim',  ikon: '🧺' }
};
var RES_KEYS = Object.keys(RES);
var FOODS = ['ekmek', 'et'];

// Kervansaray alım/satım fiyatları (10 birim için değil, birim başına)
var PRICES = {
  odun:   { al: 2, sat: 1 },
  tas:    { al: 3, sat: 2 },
  bugday: { al: 3, sat: 2 },
  un:     { al: 4, sat: 3 },
  ekmek:  { al: 4, sat: 3 },
  et:     { al: 4, sat: 3 },
  yun:    { al: 5, sat: 3 },
  kilim:  { al: 22, sat: 15 }
};

var TAX = [
  { ad: 'Yok',   gelir: 0,    mutluluk: 10 },
  { ad: 'Hafif', gelir: 0.05, mutluluk: 0 },
  { ad: 'Orta',  gelir: 0.1,  mutluluk: -10 },
  { ad: 'Ağır',  gelir: 0.16, mutluluk: -20 },
  { ad: 'Zalim', gelir: 0.25, mutluluk: -35 }
];

var CATEGORIES = [
  { id: 'halk',   ad: 'Halk' },
  { id: 'kaynak', ad: 'Kaynak' },
  { id: 'uretim', ad: 'Üretim' },
  { id: 'ticaret', ad: 'Ticaret' }
];

// w,h: karo boyutu; build: inşa süresi (gün); workers: işçi sayısı
// prod: tam kadroyla günlük üretim; input: günlük tüketim
var BUILDINGS = {
  konak: {
    ad: 'Bey Konağı', kat: null, w: 2, h: 2, cost: {}, build: 0,
    desc: 'Beyin konağı. Vergiyi ve beyliği buradan yönetirsin.', ikon: '🏯'
  },
  ev: {
    ad: 'Kerpiç Ev', kat: 'halk', w: 1, h: 1, cost: { odun: 10 }, build: 2,
    housing: 5, desc: '5 kişi barınır. Yakınında çeşme, cami, pazar olursa halk mutlu olur.', ikon: '🏠'
  },
  cesme: {
    ad: 'Çeşme', kat: 'halk', w: 1, h: 1, cost: { tas: 10 }, build: 2,
    service: 'su', radius: 5, desc: 'Çevresindeki evlere su verir.', ikon: '⛲'
  },
  pazar: {
    ad: 'Pazar Yeri', kat: 'halk', w: 2, h: 2, cost: { odun: 25 }, build: 3, workers: 2,
    service: 'pazar', radius: 7, desc: 'Çevresindeki evlere mal dağıtır.', ikon: '⛺'
  },
  cami: {
    ad: 'Cami', kat: 'halk', w: 2, h: 2, cost: { tas: 40, odun: 20, akce: 60 }, build: 8, workers: 1,
    service: 'cami', radius: 8, desc: 'İmam görev yapar. Çevresindeki evlerin mutluluğu artar.', ikon: '🕌'
  },
  hamam: {
    ad: 'Hamam', kat: 'halk', w: 2, h: 2, cost: { tas: 30, odun: 20, akce: 40 }, build: 6, workers: 2,
    input: { odun: 0.4 }, service: 'hamam', radius: 7,
    desc: 'Odun yakar. Temizlik halkı mutlu eder.', ikon: '♨️'
  },
  oduncu: {
    ad: 'Oduncu', kat: 'kaynak', w: 1, h: 1, cost: { odun: 5 }, build: 2, workers: 2,
    prod: { odun: 2 }, need: 'orman', desc: 'Ormana yakın kur. Çevredeki ağaç sayısı verimi belirler.', ikon: '🪓'
  },
  tasocagi: {
    ad: 'Taş Ocağı', kat: 'kaynak', w: 1, h: 1, cost: { odun: 15 }, build: 3, workers: 2,
    prod: { tas: 1.4 }, need: 'tas', desc: 'Kayalık arazinin yanına kurulmalı.', ikon: '⛏️'
  },
  avci: {
    ad: 'Avcı', kat: 'kaynak', w: 1, h: 1, cost: { odun: 8 }, build: 2, workers: 2,
    prod: { et: 1.1 }, need: 'orman', desc: 'Ormanda av avlar. Kışın verim düşer.', ikon: '🏹'
  },
  tarla: {
    ad: 'Buğday Tarlası', kat: 'kaynak', w: 2, h: 2, cost: { odun: 5 }, build: 2, workers: 2,
    farm: true, desc: 'Baharda ekilir, yazın büyür, güzün hasat edilir. Verimli toprak (koyu yeşil) daha çok ürün verir.', ikon: '🌾'
  },
  agil: {
    ad: 'Ağıl', kat: 'kaynak', w: 2, h: 2, cost: { odun: 20 }, build: 3, workers: 1,
    prod: { et: 0.7, yun: 0.8 }, desc: 'Koyun besler: et ve yün verir.', ikon: '🐑'
  },
  degirmen: {
    ad: 'Değirmen', kat: 'uretim', w: 1, h: 1, cost: { odun: 20, tas: 10 }, build: 4, workers: 1,
    input: { bugday: 2 }, prod: { un: 2 }, desc: 'Buğdayı una çevirir.', ikon: '🌀'
  },
  firin: {
    ad: 'Fırın', kat: 'uretim', w: 1, h: 1, cost: { odun: 15, tas: 5 }, build: 3, workers: 2,
    input: { un: 2, odun: 0.2 }, prod: { ekmek: 4 }, desc: 'Undan ekmek pişirir.', ikon: '🍞'
  },
  dokumaci: {
    ad: 'Kilim Tezgâhı', kat: 'uretim', w: 1, h: 1, cost: { odun: 15 }, build: 3, workers: 2,
    input: { yun: 1.2 }, prod: { kilim: 0.4 }, desc: 'Yünden kilim dokur. Kilim kervanlara pahalıya satılır.', ikon: '🧵'
  },
  ambar: {
    ad: 'Ambar', kat: 'ticaret', w: 1, h: 1, cost: { odun: 25 }, build: 3,
    storage: 150, desc: 'Her kaynağın depo sınırını 150 artırır.', ikon: '🛖'
  },
  kervansaray: {
    ad: 'Kervansaray', kat: 'ticaret', w: 2, h: 2, cost: { tas: 50, odun: 40, akce: 80 }, build: 8, workers: 3,
    prod: { akce: 3 }, trade: true, desc: 'Kervanlar uğrar: alım-satım yapılır ve gümrük geliri gelir.', ikon: '🐫'
  }
};

// Görevler sırayla açılır
var QUESTS = [
  { ad: 'Köyü büyüt: toplam 4 ev olsun', check: function (g) { return countB(g, 'ev') >= 4; }, odul: { odun: 20 } },
  { ad: 'Bir oduncu kur', check: function (g) { return countB(g, 'oduncu') >= 1; }, odul: { akce: 20 } },
  { ad: 'Bir çeşme kur', check: function (g) { return countB(g, 'cesme') >= 1; }, odul: { tas: 15 } },
  { ad: 'Bir avcı kur (et için)', check: function (g) { return countB(g, 'avci') >= 1; }, odul: { odun: 15 } },
  { ad: 'Bir taş ocağı kur', check: function (g) { return countB(g, 'tasocagi') >= 1; }, odul: { akce: 25 } },
  { ad: 'Buğday tarlası kur', check: function (g) { return countB(g, 'tarla') >= 1; }, odul: { bugday: 20 } },
  { ad: 'Değirmen ve fırın kur', check: function (g) { return countB(g, 'degirmen') >= 1 && countB(g, 'firin') >= 1; }, odul: { akce: 40 } },
  { ad: 'Nüfus 30 olsun (Köy)', check: function (g) { return g.pop >= 30; }, odul: { akce: 50 } },
  { ad: 'Bir cami inşa et', check: function (g) { return countB(g, 'cami', true) >= 1; }, odul: { tas: 30 } },
  { ad: 'Ağıl ve kilim tezgâhı kur', check: function (g) { return countB(g, 'agil') >= 1 && countB(g, 'dokumaci') >= 1; }, odul: { akce: 40 } },
  { ad: 'Kervansaray kur', check: function (g) { return countB(g, 'kervansaray', true) >= 1; }, odul: { akce: 100 } },
  { ad: 'Nüfus 60 olsun (Kasaba)', check: function (g) { return g.pop >= 60; }, odul: { akce: 100 } },
  { ad: 'Hamam yaptır', check: function (g) { return countB(g, 'hamam', true) >= 1; }, odul: { akce: 60 } },
  { ad: 'Nüfus 120 olsun (Şehir)', check: function (g) { return g.pop >= 120; }, odul: { akce: 200 } }
];

function countB(g, type, builtOnly) {
  var n = 0;
  for (var i = 0; i < g.buildings.length; i++) {
    var b = g.buildings[i];
    if (b.type === type && (!builtOnly || b.progress >= 1)) n++;
  }
  return n;
}

function townTitle(pop) {
  if (pop < 20) return 'Oba';
  if (pop < 50) return 'Köy';
  if (pop < 100) return 'Kasaba';
  return 'Şehir';
}

// Divan olayları: her biri bir karar ister
var EVENTS = [
  {
    id: 'dervis', baslik: 'Gezgin Derviş',
    metin: 'Horasan\'dan gelen bir derviş kasabana yerleşmek istiyor. Küçük bir tekke için 20 odun istiyor.',
    secenekler: [
      { ad: 'Odun ver (−20 odun)', kosul: { odun: 20 }, etki: { res: { odun: -20 }, mod: { ad: 'Dervişin duası', mutluluk: 10, gun: 24 } } },
      { ad: 'Kibarca reddet', etki: {} }
    ]
  },
  {
    id: 'eskiya', baslik: 'Eşkıya Baskını',
    metin: 'Dağdaki eşkıyalar köy yollarını kesiyor. Halk tedirgin.',
    secenekler: [
      { ad: 'Subaşıyı gönder (−30 akçe)', kosul: { akce: 30 }, etki: { res: { akce: -30 }, mod: { ad: 'Yollar güvende', mutluluk: 5, gun: 12 } } },
      { ad: 'Görmezden gel', etki: { mod: { ad: 'Eşkıya korkusu', mutluluk: -12, gun: 18 }, kayip: 0.15 } }
    ]
  },
  {
    id: 'yoruk', baslik: 'Yörük Obası',
    metin: 'Bir Yörük obası kışlak arıyor. Toprağına yerleşmelerine izin verir misin?',
    secenekler: [
      { ad: 'Yerleşsinler (+nüfus)', etki: { pop: 6 } },
      { ad: 'Hayvanlarını sat (+15 et, +12 yün)', etki: { res: { et: 15, yun: 12 } } }
    ]
  },
  {
    id: 'kurak', baslik: 'Kuraklık', mevsim: [0, 1],
    metin: 'Aylardır yağmur yağmadı. Tarlalar kuruyor.',
    secenekler: [
      { ad: 'Kuyu kazdır (−25 taş)', kosul: { tas: 25 }, etki: { res: { tas: -25 } } },
      { ad: 'Yağmur duasına çık', etki: { kuraklik: 0.35 } }
    ]
  },
  {
    id: 'seyyah', baslik: 'Seyyah',
    metin: 'Uzak diyarlardan bir seyyah uğradı. Beyliğinin şanını anlatacağını söylüyor.',
    secenekler: [
      { ad: 'Ziyafet ver (−10 et)', kosul: { et: 10 }, etki: { res: { et: -10 }, mod: { ad: 'Şöhret', mutluluk: 8, gun: 20 }, pop: 3 } },
      { ad: 'Hediye ver (−20 akçe)', kosul: { akce: 20 }, etki: { res: { akce: -20 }, pop: 4 } }
    ]
  },
  {
    id: 'harac', baslik: 'Komşu Beyin Elçisi',
    metin: 'Komşu bey elçi gönderdi. 50 akçe haraç istiyor, yoksa akıncılarını yollayacakmış.',
    secenekler: [
      { ad: 'Haracı öde (−50 akçe)', kosul: { akce: 50 }, etki: { res: { akce: -50 } } },
      { ad: 'Elçiyi geri çevir', etki: { risk: 0.5 } }
    ]
  },
  {
    id: 'dugun', baslik: 'Köy Düğünü',
    metin: 'Köyde büyük bir düğün var. Halk beyin de katılmasını istiyor.',
    secenekler: [
      { ad: 'Katıl, ikram et (−15 ekmek)', kosul: { ekmek: 15 }, etki: { res: { ekmek: -15 }, mod: { ad: 'Düğün sevinci', mutluluk: 12, gun: 12 }, pop: 2 } },
      { ad: 'Tebrik gönder', etki: { mod: { ad: 'Düğün', mutluluk: 3, gun: 8 } } }
    ]
  },
  {
    id: 'ahi', baslik: 'Ahi Esnafı',
    metin: 'Ahi teşkilatından ustalar dükkân açmak istiyor. Karşılığında vergi muafiyeti istiyorlar.',
    secenekler: [
      { ad: 'Kabul et (+üretim, −20 akçe)', kosul: { akce: 20 }, etki: { res: { akce: -20 }, mod: { ad: 'Ahi ustaları', uretim: 0.2, gun: 36 } } },
      { ad: 'Reddet', etki: {} }
    ]
  }
];
