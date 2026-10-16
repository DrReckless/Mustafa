// Oyun verileri: eşyalar, tarifler, binalar, birimler, araştırma
export const TILE = 2;           // bir karonun dünya birimi cinsinden boyu
export const MAP_W = 80;
export const MAP_H = 56;
export const TICK = 1 / 20;      // simülasyon adımı (sn)
export const DAY_LENGTH = 240;   // bir gün (sn)

export const DX = [1, 0, -1, 0];
export const DY = [0, 1, 0, -1];

export const ITEMS = {
  iron_ore:     { name: 'Demir Cevheri', color: 0x7a4632, shape: 'ore' },
  copper_ore:   { name: 'Bakır Cevheri', color: 0x4f8f6e, shape: 'ore' },
  coal:         { name: 'Kömür',         color: 0x1b1b1f, shape: 'ore' },
  stone:        { name: 'Taş',           color: 0x8e8a82, shape: 'ore' },
  quartz:       { name: 'Kuvars',        color: 0xd8ecff, shape: 'crystal' },
  iron_ingot:   { name: 'Demir Külçe',   color: 0xa9afb7, shape: 'ingot' },
  copper_ingot: { name: 'Bakır Külçe',   color: 0xd4834a, shape: 'ingot' },
  brick:        { name: 'Beton Blok',    color: 0xb9b4a8, shape: 'block' },
  silicon:      { name: 'Silikon',       color: 0x3d4a66, shape: 'wafer' },
  steel:        { name: 'Çelik Kiriş',   color: 0x5f6873, shape: 'beam' },
  gear:         { name: 'Dişli',         color: 0x8f949b, shape: 'gear' },
  wire:         { name: 'Kablo',         color: 0xd9894a, shape: 'spool' },
  circuit:      { name: 'Devre Kartı',   color: 0x1f7a45, shape: 'board' },
  ammo:         { name: 'Mühimmat',      color: 0xc59a35, shape: 'crate' },
  motor:        { name: 'Motor',         color: 0x3a4250, shape: 'motor' },
};
export const ITEM_KEYS = Object.keys(ITEMS);

export const RECIPES = {
  smelt_iron:   { name: 'Demir Külçe',  building: 'smelter',   inp: { iron_ore: 1 },   out: { iron_ingot: 1 },   time: 2.0 },
  smelt_copper: { name: 'Bakır Külçe',  building: 'smelter',   inp: { copper_ore: 1 }, out: { copper_ingot: 1 }, time: 2.0 },
  smelt_stone:  { name: 'Beton Blok',   building: 'smelter',   inp: { stone: 2 },      out: { brick: 1 },        time: 2.5 },
  smelt_quartz: { name: 'Silikon',      building: 'smelter',   inp: { quartz: 1 },     out: { silicon: 1 },      time: 3.0 },
  steel:        { name: 'Çelik Kiriş',  building: 'foundry',   inp: { iron_ingot: 2, coal: 1 }, out: { steel: 1 }, time: 4.0 },
  ammo_f:       { name: 'Mühimmat',     building: 'foundry',   inp: { iron_ingot: 1, coal: 1 }, out: { ammo: 5 },  time: 3.0 },
  gear:         { name: 'Dişli',        building: 'assembler', inp: { iron_ingot: 2 },  out: { gear: 1 },         time: 2.0 },
  wire:         { name: 'Kablo',        building: 'assembler', inp: { copper_ingot: 1 }, out: { wire: 2 },        time: 1.5 },
  circuit:      { name: 'Devre Kartı',  building: 'assembler', inp: { wire: 3, silicon: 1 }, out: { circuit: 1 }, time: 4.0 },
  ammo:         { name: 'Mühimmat',     building: 'assembler', inp: { iron_ingot: 1, copper_ingot: 1 }, out: { ammo: 4 }, time: 3.0 },
  motor:        { name: 'Motor',        building: 'assembler', inp: { steel: 1, gear: 2, wire: 2 }, out: { motor: 1 }, time: 6.0 },
};

export const PURITY = [
  { name: 'Saf Olmayan', mul: 0.5 },
  { name: 'Normal', mul: 1 },
  { name: 'Saf', mul: 2 },
];

// cat: üretim | lojistik | enerji | savunma | askeri
export const BUILDINGS = {
  hq: {
    name: 'Ana Üs', size: 3, hp: 4000, cat: null, cost: {},
    desc: 'Konveyörle gelen tüm malzemeler buraya depolanır. Kaybedersen oyun biter.',
    power: -30,
  },
  miner: {
    name: 'Maden Matkabı', size: 1, hp: 300, cat: 'uretim', power: 8,
    cost: { iron_ingot: 10, brick: 4 },
    desc: 'Cevher yatağının üstüne kurulur, çıkardığı cevheri önüne bırakır.',
  },
  smelter: {
    name: 'Eritme Fırını', size: 1, hp: 350, cat: 'uretim', power: 12,
    cost: { brick: 8, iron_ingot: 6 },
    desc: 'Cevherleri külçeye, taşı beton bloğa, kuvarsı silikona çevirir.',
  },
  assembler: {
    name: 'Montaj Makinesi', size: 1, hp: 350, cat: 'uretim', power: 18,
    cost: { iron_ingot: 20, copper_ingot: 10, brick: 6 },
    desc: 'Dişli, kablo, devre kartı, motor ve mühimmat üretir.',
  },
  foundry: {
    name: 'Dökümhane', size: 1, hp: 450, cat: 'uretim', power: 25,
    cost: { brick: 20, iron_ingot: 20, gear: 8 },
    desc: 'Demir ve kömürü yüksek ısıda birleştirerek çelik ve mühimmat döker.',
  },
  belt: {
    name: 'Konveyör', size: 1, hp: 80, cat: 'lojistik', power: 0,
    cost: { iron_ingot: 1 }, line: true,
    desc: 'Eşyaları taşır. Parmağını sürükleyerek hat çiz.',
  },
  splitter: {
    name: 'Ayırıcı', size: 1, hp: 150, cat: 'lojistik', power: 0,
    cost: { iron_ingot: 4, gear: 2 },
    desc: 'Gelen eşyaları ön, sol ve sağ çıkışlara sırayla dağıtır.',
  },
  generator: {
    name: 'Kömür Jeneratörü', size: 1, hp: 400, cat: 'enerji', power: -80,
    cost: { iron_ingot: 15, copper_ingot: 8, brick: 6 },
    desc: 'Konveyörle gelen kömürü yakarak 80 kW elektrik üretir.',
  },
  solar: {
    name: 'Güneş Paneli', size: 1, hp: 150, cat: 'enerji', power: -25,
    cost: { iron_ingot: 6, wire: 10, silicon: 4 },
    desc: 'Gündüz 25 kW üretir. Gece çalışmaz.',
  },
  wall: {
    name: 'Beton Duvar', size: 1, hp: 900, cat: 'savunma', power: 0,
    cost: { brick: 3 }, line: true,
    desc: 'Düşmanları yavaşlatan sağlam engel.',
  },
  turret_mg: {
    name: 'Makineli Taret', size: 1, hp: 500, cat: 'savunma', power: 0,
    cost: { iron_ingot: 15, copper_ingot: 5 },
    desc: 'Hızlı ateş eder. Depodan mühimmat harcar. Hava ve kara hedefleri vurur.',
    range: 7.5, dmg: 9, rate: 0.12, ammo: 1 / 4, air: true,
  },
  turret_cannon: {
    name: 'Obüs Tareti', size: 1, hp: 800, cat: 'savunma', power: 0,
    cost: { steel: 15, gear: 10 },
    desc: 'Uzun menzilli alan hasarı. Sadece kara hedefleri.',
    range: 11, dmg: 85, rate: 2.2, ammo: 2, splash: 2.2, air: false,
  },
  turret_laser: {
    name: 'Lazer Tareti', size: 1, hp: 600, cat: 'savunma', power: 40,
    cost: { steel: 12, circuit: 12 },
    desc: 'Elektrikle çalışır, mühimmat istemez. Dronlara çok etkili.',
    range: 9, dmg: 30, rate: 0.35, ammo: 0, air: true, laser: true,
  },
  factory: {
    name: 'Araç Fabrikası', size: 2, hp: 1200, cat: 'askeri', power: 30,
    cost: { steel: 40, circuit: 15, brick: 30 },
    desc: 'Muharebe birimleri üretir. Ordunla rakip üslere saldır.',
  },
};

export const UNITS = {
  // oyuncu
  mech:  { name: 'Muharebe Robotu', hp: 260, speed: 2.2, range: 5.5, dmg: 14, rate: 0.5, air: false, cost: { steel: 8, circuit: 2, ammo: 20 }, time: 8 },
  tank:  { name: 'Ağır Tank', hp: 700, speed: 1.6, range: 8.5, dmg: 70, rate: 2.0, splash: 1.6, air: false, cost: { steel: 20, motor: 2, ammo: 40 }, time: 14, tech: 'mekanize' },
  drone: { name: 'Saldırı Dronu', hp: 160, speed: 4.2, range: 4.5, dmg: 18, rate: 0.4, air: true, cost: { circuit: 4, motor: 1 }, time: 9, tech: 'mekanize' },
  // düşman
  raider:  { name: 'Yağmacı Cipi', hp: 120, speed: 3.2, range: 4.5, dmg: 6, rate: 0.4, air: false },
  brute:   { name: 'Zırhlı Paletli', hp: 520, speed: 1.4, range: 6, dmg: 45, rate: 1.8, splash: 1.2, air: false },
  wasp:    { name: 'Eşek Arısı Dronu', hp: 90, speed: 4.6, range: 3.5, dmg: 10, rate: 0.35, air: true },
};

export const TECH = [
  { id: 'otomasyon', name: 'Otomasyon', cost: { iron_ingot: 60, copper_ingot: 40 },
    unlocks: ['assembler', 'splitter'], desc: 'Montaj makinesi ve ayırıcı.' },
  { id: 'yenilenebilir', name: 'Yarı İletkenler', cost: { brick: 40, wire: 40 }, req: 'otomasyon',
    unlocks: ['solar'], desc: 'Güneş paneli. Kuvars → silikon zinciri.' },
  { id: 'metalurji', name: 'Metalurji', cost: { brick: 60, gear: 30, wire: 40 }, req: 'otomasyon',
    unlocks: ['foundry', 'turret_cannon'], desc: 'Dökümhane (çelik) ve obüs tareti.' },
  { id: 'elektronik', name: 'İleri Elektronik', cost: { steel: 30, circuit: 20 }, req: 'metalurji',
    unlocks: ['turret_laser', 'factory'], desc: 'Lazer tareti ve araç fabrikası (robot).' },
  { id: 'mekanize', name: 'Mekanize Ordu', cost: { steel: 60, motor: 15, circuit: 30 }, req: 'elektronik',
    unlocks: [], units: ['tank', 'drone'], desc: 'Ağır tank ve saldırı dronu.' },
];

export const START_UNLOCKED = ['miner', 'belt', 'smelter', 'generator', 'wall', 'turret_mg'];

export const START_STOCK = {
  iron_ingot: 120, copper_ingot: 50, brick: 50, ammo: 200, coal: 0, stone: 0,
};

export const CATEGORIES = [
  { id: 'uretim', name: 'Üretim' },
  { id: 'lojistik', name: 'Lojistik' },
  { id: 'enerji', name: 'Enerji' },
  { id: 'savunma', name: 'Savunma' },
  { id: 'askeri', name: 'Askeri' },
];

export const RIVALS = [
  { id: 1, name: 'Kızıl Lejyon', color: 0xc0392b, x: 68, y: 12 },
  { id: 2, name: 'Pas Klanı', color: 0xd35400, x: 70, y: 44 },
];
export const PLAYER_HQ = { x: 13, y: 28 };
