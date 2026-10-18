// Oyun verileri: eşyalar, tarifler, binalar, birimler, araştırma
export const TILE = 2;           // bir karonun dünya birimi cinsinden boyu
export const MAP_W = 96;
export const MAP_H = 64;
export const TICK = 1 / 20;      // simülasyon adımı (sn)
export const DAY_LENGTH = 240;   // bir gün (sn)

export const DX = [1, 0, -1, 0];
export const DY = [0, 1, 0, -1];

export const ITEMS = {
  // ham kaynaklar
  iron_ore:     { name: 'Demir Cevheri',   color: 0x7a4632, shape: 'ore' },
  copper_ore:   { name: 'Bakır Cevheri',   color: 0x4f8f6e, shape: 'ore' },
  coal:         { name: 'Kömür',           color: 0x1b1b1f, shape: 'ore' },
  stone:        { name: 'Taş',             color: 0x8e8a82, shape: 'ore' },
  quartz:       { name: 'Kuvars',          color: 0xd8ecff, shape: 'crystal' },
  bauxite:      { name: 'Boksit',          color: 0xa4532e, shape: 'ore' },
  sulfur:       { name: 'Kükürt',          color: 0xd9c32c, shape: 'ore' },
  uranium_ore:  { name: 'Uranyum Cevheri', color: 0x4fae3a, shape: 'uore' },
  oil:          { name: 'Ham Petrol',      color: 0x15120f, shape: 'barrel' },
  // eritilmiş
  iron_ingot:   { name: 'Demir Külçe',     color: 0xa9afb7, shape: 'ingot' },
  copper_ingot: { name: 'Bakır Külçe',     color: 0xd4834a, shape: 'ingot' },
  brick:        { name: 'Beton Blok',      color: 0xb9b4a8, shape: 'block' },
  glass:        { name: 'Cam',             color: 0x9ad4e6, shape: 'pane' },
  silicon:      { name: 'Silikon',         color: 0x3d4a66, shape: 'wafer' },
  aluminum:     { name: 'Alüminyum',       color: 0xd5dbe2, shape: 'ingot' },
  steel:        { name: 'Çelik Kiriş',     color: 0x5f6873, shape: 'beam' },
  alloy:        { name: 'Hafif Alaşım',    color: 0xbfcbd8, shape: 'beam' },
  // ara ürünler
  iron_plate:   { name: 'Demir Levha',     color: 0x9aa3ab, shape: 'plate' },
  gear:         { name: 'Dişli',           color: 0x8f949b, shape: 'gear' },
  wire:         { name: 'Kablo',           color: 0xd9894a, shape: 'spool' },
  circuit:      { name: 'Devre Kartı',     color: 0x1f7a45, shape: 'board' },
  motor:        { name: 'Motor',           color: 0x3a4250, shape: 'motor' },
  plastic:      { name: 'Plastik',         color: 0xe6e1d3, shape: 'sheet' },
  fuel:         { name: 'Yakıt',           color: 0xc0501c, shape: 'barrel' },
  explosive:    { name: 'Patlayıcı',       color: 0x8f2a1c, shape: 'crate' },
  battery:      { name: 'Batarya',         color: 0x2c6fc4, shape: 'cell' },
  processor:    { name: 'İşlemci',         color: 0x24303a, shape: 'chip' },
  armor:        { name: 'Kompozit Zırh',   color: 0x4a5560, shape: 'plate' },
  fuel_rod:     { name: 'Yakıt Çubuğu',    color: 0x52e86a, shape: 'rod' },
  // askeri
  ammo:         { name: 'Mühimmat',        color: 0x6b6a3a, shape: 'crate' },
  rocket:       { name: 'Füze',            color: 0xc8c8be, shape: 'rocket' },
};
export const ITEM_KEYS = Object.keys(ITEMS);

// building: hangi makinede üretildiği
export const RECIPES = {
  // Demir Fırını
  smelt_iron:      { name: 'Demir Külçe',        building: 'smelter_iron',   inp: { iron_ore: 1 },   out: { iron_ingot: 1 },   time: 2.0 },
  smelt_iron_coke: { name: 'Kok ile Eritme',     building: 'smelter_iron',   inp: { iron_ore: 3, coal: 1 }, out: { iron_ingot: 4 }, time: 4.0 },
  // Bakır İzabe Fırını
  smelt_copper:    { name: 'Bakır Külçe',        building: 'smelter_copper', inp: { copper_ore: 1 }, out: { copper_ingot: 1 }, time: 2.0 },
  smelt_copper_coke:{ name: 'Kok ile İzabe',     building: 'smelter_copper', inp: { copper_ore: 3, coal: 1 }, out: { copper_ingot: 4 }, time: 4.0 },
  // Taş Fırını
  smelt_stone:     { name: 'Beton Blok',         building: 'kiln',           inp: { stone: 2 },      out: { brick: 1 },        time: 2.5 },
  glass:           { name: 'Cam',                building: 'kiln',           inp: { quartz: 1 },     out: { glass: 2 },        time: 3.0 },
  // Ark Fırını
  smelt_quartz:    { name: 'Silikon',            building: 'arc_furnace',    inp: { quartz: 1 },     out: { silicon: 1 },      time: 3.0 },
  silicon_coke:    { name: 'Karbotermik Silikon',building: 'arc_furnace',    inp: { quartz: 2, coal: 1 }, out: { silicon: 3 }, time: 5.0 },
  // Alüminyum Tesisi
  aluminum:        { name: 'Alüminyum',          building: 'alu_smelter',    inp: { bauxite: 2 },    out: { aluminum: 1 },     time: 3.0 },
  aluminum_coke:   { name: 'Anotlu Elektroliz',  building: 'alu_smelter',    inp: { bauxite: 3, coal: 1 }, out: { aluminum: 2 }, time: 4.0 },
  // Dökümhane
  steel:           { name: 'Çelik Kiriş',        building: 'foundry',        inp: { iron_ingot: 2, coal: 1 }, out: { steel: 1 }, time: 4.0 },
  alloy:           { name: 'Hafif Alaşım',       building: 'foundry',        inp: { aluminum: 1, copper_ingot: 1 }, out: { alloy: 1 }, time: 3.0 },
  ammo_f:          { name: 'Mühimmat Dökümü',    building: 'foundry',        inp: { iron_ingot: 1, coal: 1 }, out: { ammo: 5 },  time: 3.0 },
  // Montaj Makinesi
  gear:            { name: 'Dişli',              building: 'assembler',      inp: { iron_ingot: 2 },  out: { gear: 1 },         time: 2.0 },
  wire:            { name: 'Kablo',              building: 'assembler',      inp: { copper_ingot: 1 }, out: { wire: 2 },        time: 1.5 },
  iron_plate:      { name: 'Demir Levha',        building: 'assembler',      inp: { iron_ingot: 3 },  out: { iron_plate: 2 },   time: 2.0 },
  ammo:            { name: 'Mühimmat',           building: 'assembler',      inp: { iron_ingot: 1, copper_ingot: 1 }, out: { ammo: 4 }, time: 3.0 },
  circuit:         { name: 'Devre Kartı',        building: 'assembler',      inp: { wire: 3, silicon: 1 }, out: { circuit: 1 }, time: 4.0 },
  motor:           { name: 'Motor',              building: 'assembler',      inp: { steel: 1, gear: 2, wire: 2 }, out: { motor: 1 }, time: 6.0 },
  // İleri Montaj Hattı
  circuit_adv:     { name: 'Seri Devre Kartı',   building: 'adv_assembler',  inp: { wire: 2, silicon: 1, plastic: 1 }, out: { circuit: 2 }, time: 4.0 },
  motor_adv:       { name: 'Seri Motor',         building: 'adv_assembler',  inp: { alloy: 1, gear: 2, wire: 3 }, out: { motor: 2 }, time: 6.0 },
  battery:         { name: 'Batarya',            building: 'adv_assembler',  inp: { aluminum: 1, sulfur: 2, wire: 2 }, out: { battery: 1 }, time: 4.0 },
  processor:       { name: 'İşlemci',            building: 'adv_assembler',  inp: { circuit: 2, silicon: 2, plastic: 1 }, out: { processor: 1 }, time: 6.0 },
  rocket:          { name: 'Füze',               building: 'adv_assembler',  inp: { explosive: 2, alloy: 1, circuit: 1 }, out: { rocket: 2 }, time: 6.0 },
  armor:           { name: 'Kompozit Zırh',      building: 'adv_assembler',  inp: { alloy: 2, plastic: 1, steel: 1 }, out: { armor: 1 }, time: 5.0 },
  // Petrol Rafinerisi
  fuel:            { name: 'Yakıt',              building: 'refinery',       inp: { oil: 2 },  out: { fuel: 2 },     time: 3.0 },
  plastic:         { name: 'Plastik',            building: 'refinery',       inp: { oil: 2 },  out: { plastic: 1 },  time: 3.0 },
  cracking:        { name: 'Ayrıştırma',         building: 'refinery',       inp: { oil: 3 },  out: { fuel: 1, plastic: 1 }, time: 4.0 },
  // Kimya Tesisi
  explosive:       { name: 'Patlayıcı',          building: 'chem_plant',     inp: { sulfur: 2, coal: 1 }, out: { explosive: 2 }, time: 4.0 },
  ammo_chem:       { name: 'Yüksek Verim Mühimmat', building: 'chem_plant',  inp: { explosive: 1, iron_plate: 1 }, out: { ammo: 12 }, time: 3.0 },
  plastic_chem:    { name: 'Kömürden Plastik',   building: 'chem_plant',     inp: { coal: 3, sulfur: 1 }, out: { plastic: 1 }, time: 4.0 },
  // Zenginleştirme
  fuel_rod:        { name: 'Yakıt Çubuğu',       building: 'enricher',       inp: { uranium_ore: 4, aluminum: 1, sulfur: 2 }, out: { fuel_rod: 1 }, time: 10.0 },
};

export const PURITY = [
  { name: 'Saf Olmayan', mul: 0.5 },
  { name: 'Normal', mul: 1 },
  { name: 'Saf', mul: 2 },
];

// Binalar
//  power: çalışırken çektiği güç (kW)
//  gen:   ürettiği güç (kW, en yüksek)
//  node:  şebeke düğümü { cover: kapsama yarıçapı (karo), link: diğer düğümlere bağlanma menzili }
//  machine: tarif işleyen makine; mine: maden çıkarıcı
export const BUILDINGS = {
  hq: {
    name: 'Ana Üs', size: 3, hp: 4000, cat: null, cost: {}, gen: 30, node: { cover: 10, link: 10 },
    desc: 'Konveyörle gelen tüm malzemeler buraya depolanır. 30 kW temel enerji verir. Kaybedersen oyun biter.',
  },
  // ---- maden ----
  miner: {
    name: 'Maden Matkabı', size: 1, hp: 300, cat: 'maden', power: 8, mine: 'solid', speed: 1,
    cost: { iron_ingot: 10, brick: 4 },
    desc: 'Katı cevher yatağının üstüne kurulur, çıkardığını ok yönüne bırakır. 27 adet/dk (normal yatak).',
  },
  miner_mk2: {
    name: 'Ağır Matkap', size: 1, hp: 500, cat: 'maden', power: 22, mine: 'solid', speed: 2.2,
    cost: { steel: 6, gear: 6, iron_plate: 6 },
    desc: 'Elmas uçlu ağır matkap. Normal matkaptan 2,2 kat hızlı ama çok enerji çeker.',
  },
  pumpjack: {
    name: 'Petrol Pompası', size: 1, hp: 400, cat: 'maden', power: 15, mine: 'oil', speed: 0.9,
    cost: { steel: 8, gear: 8, iron_plate: 8 },
    desc: 'Sadece petrol sızıntısı (siyah gölcük) üzerine kurulur. Ham petrolü varillere doldurur.',
  },
  // ---- eritme ----
  smelter_iron: {
    name: 'Demir Fırını', size: 1, hp: 350, cat: 'eritme', power: 10, machine: true,
    cost: { brick: 8, iron_ingot: 6 },
    desc: 'Demir cevherini külçeye çevirir. Kömür eklenirse (kok tarifi) iki kat verimli.',
  },
  smelter_copper: {
    name: 'Bakır İzabe Fırını', size: 1, hp: 350, cat: 'eritme', power: 10, machine: true,
    cost: { brick: 8, iron_ingot: 6 },
    desc: 'Bakır cevherini külçeye çevirir. Kömürle (kok tarifi) daha verimli çalışır.',
  },
  kiln: {
    name: 'Taş Fırını', size: 1, hp: 350, cat: 'eritme', power: 6, machine: true, auto: true,
    cost: { iron_ingot: 8, brick: 4 },
    desc: 'Taştan beton blok, kuvarstan cam üretir. Tarif gelen malzemeye göre kendiliğinden seçilir.',
  },
  arc_furnace: {
    name: 'Ark Fırını', size: 1, hp: 400, cat: 'eritme', power: 35, machine: true,
    cost: { iron_plate: 8, copper_ingot: 10, brick: 10 },
    desc: 'Elektrik arkıyla kuvarsı silikona dönüştürür. Çok enerji çeker.',
  },
  alu_smelter: {
    name: 'Alüminyum Tesisi', size: 1, hp: 450, cat: 'eritme', power: 60, machine: true,
    cost: { steel: 10, iron_plate: 12, wire: 20 },
    desc: 'Boksiti elektrolizle alüminyuma çevirir. En çok enerji çeken fırın.',
  },
  foundry: {
    name: 'Dökümhane', size: 1, hp: 450, cat: 'eritme', power: 25, machine: true,
    cost: { brick: 20, iron_ingot: 20, gear: 8 },
    desc: 'Yüksek ısıda çelik, hafif alaşım ve mühimmat döker.',
  },
  // ---- montaj ----
  assembler: {
    name: 'Montaj Makinesi', size: 1, hp: 350, cat: 'montaj', power: 18, machine: true,
    cost: { iron_ingot: 20, copper_ingot: 10, brick: 6 },
    desc: 'Dişli, kablo, demir levha, devre kartı, motor ve mühimmat üretir.',
  },
  adv_assembler: {
    name: 'İleri Montaj Hattı', size: 2, hp: 1100, cat: 'montaj', power: 45, machine: true,
    cost: { steel: 30, circuit: 10, iron_plate: 20 },
    desc: 'İki robot kollu üretim hattı: batarya, işlemci, füze, kompozit zırh ve seri üretim tarifleri.',
  },
  refinery: {
    name: 'Petrol Rafinerisi', size: 2, hp: 1000, cat: 'montaj', power: 40, machine: true,
    cost: { steel: 25, iron_plate: 20, gear: 10 },
    desc: 'Ham petrolü yakıta ve plastiğe ayrıştırır.',
  },
  chem_plant: {
    name: 'Kimya Tesisi', size: 1, hp: 400, cat: 'montaj', power: 30, machine: true,
    cost: { steel: 15, glass: 10, iron_plate: 10 },
    desc: 'Kükürtten patlayıcı, yüksek verimli mühimmat ve kömürden plastik üretir.',
  },
  enricher: {
    name: 'Zenginleştirme Tesisi', size: 1, hp: 600, cat: 'montaj', power: 80, machine: true,
    cost: { steel: 30, processor: 10, alloy: 10 },
    desc: 'Santrifüjlerle uranyumu nükleer yakıt çubuğuna dönüştürür.',
  },
  // ---- lojistik ----
  belt: {
    name: 'Konveyör', size: 1, hp: 80, cat: 'lojistik', speed: 1,
    cost: { iron_ingot: 1 }, line: true,
    desc: 'Eşyaları taşır. Parmağını sürükleyerek hat çiz.',
  },
  belt_fast: {
    name: 'Hızlı Konveyör', size: 1, hp: 140, cat: 'lojistik', speed: 2,
    cost: { iron_plate: 1, gear: 1 }, line: true,
    desc: 'İki kat hızlı taşır. Eski konveyörün üstüne çizersen yükseltir.',
  },
  splitter: {
    name: 'Ayırıcı', size: 1, hp: 150, cat: 'lojistik',
    cost: { iron_ingot: 4, gear: 2 },
    desc: 'Gelen eşyaları ön, sol ve sağ çıkışlara sırayla dağıtır.',
  },
  // ---- enerji ----
  pole: {
    name: 'Elektrik Direği', size: 1, hp: 120, cat: 'enerji', node: { cover: 6, link: 12 },
    cost: { iron_ingot: 3, copper_ingot: 2 },
    desc: 'Şebekeyi uzatır. 6 karo çevresindeki makinelere elektrik dağıtır, 12 karo uzaktaki direklere bağlanır.',
  },
  pole_big: {
    name: 'Yüksek Gerilim Kulesi', size: 1, hp: 300, cat: 'enerji', node: { cover: 2, link: 28 },
    cost: { steel: 4, wire: 12, aluminum: 4 },
    desc: 'Uzak üretim sahalarını bağlamak için 28 karo menzilli iletim kulesi.',
  },
  generator: {
    name: 'Kömür Jeneratörü', size: 1, hp: 400, cat: 'enerji', gen: 80, fuel: 'coal', burn: 7, node: { cover: 5, link: 8 },
    cost: { iron_ingot: 15, copper_ingot: 8, brick: 6 },
    desc: 'Konveyörle gelen kömürü yakarak 80 kW üretir. Sadece ihtiyaç olduğunda yakıt harcar.',
  },
  gen_fuel: {
    name: 'Yakıt Jeneratörü', size: 1, hp: 500, cat: 'enerji', gen: 170, fuel: 'fuel', burn: 10, node: { cover: 5, link: 8 },
    cost: { steel: 10, motor: 2, iron_plate: 10 },
    desc: 'Rafineri yakıtıyla çalışan dizel santral. 170 kW üretir.',
  },
  solar: {
    name: 'Güneş Paneli', size: 1, hp: 150, cat: 'enerji', gen: 25, node: { cover: 3, link: 6 },
    cost: { iron_plate: 4, wire: 8, silicon: 3, glass: 2 },
    desc: 'Gündüz 25 kW üretir. Gece çalışmaz.',
  },
  wind: {
    name: 'Rüzgar Türbini', size: 1, hp: 250, cat: 'enerji', gen: 40, node: { cover: 3, link: 8 },
    cost: { iron_plate: 8, gear: 6, wire: 6 },
    desc: 'Gece gündüz çalışır, üretimi rüzgara göre 8–40 kW arasında değişir.',
  },
  battery_bank: {
    name: 'Akü Deposu', size: 1, hp: 400, cat: 'enerji', store: 12000, rate: 150, node: { cover: 4, link: 8 },
    cost: { steel: 6, battery: 6, wire: 10 },
    desc: 'Fazla enerjiyi depolar (12 000 kJ), açık olduğunda 150 kW’a kadar geri verir. Geceler için ideal.',
  },
  reactor: {
    name: 'Nükleer Reaktör', size: 2, hp: 2500, cat: 'enerji', gen: 600, fuel: 'fuel_rod', burn: 90, node: { cover: 6, link: 12 },
    cost: { steel: 80, processor: 15, armor: 10, brick: 60 },
    desc: 'Tek yakıt çubuğuyla 90 sn boyunca 600 kW üretir. Yok edilirse büyük patlama yapar!',
  },
  lamp: {
    name: 'Projektör', size: 1, hp: 120, cat: 'enerji', power: 2,
    cost: { iron_ingot: 4, copper_ingot: 2 },
    desc: 'Gece çevresini aydınlatır. Işığındaki taretler gece %15 daha uzağa ateş eder.',
  },
  // ---- savunma ----
  wall: {
    name: 'Beton Duvar', size: 1, hp: 900, cat: 'savunma',
    cost: { brick: 3 }, line: true,
    desc: 'Düşmanları yavaşlatan sağlam engel.',
  },
  wall_steel: {
    name: 'Zırhlı Duvar', size: 1, hp: 2400, cat: 'savunma',
    cost: { steel: 2, iron_plate: 3 }, line: true,
    desc: 'Çelik takviyeli ağır duvar. Betonun neredeyse üç katı dayanıklı.',
  },
  turret_mg: {
    name: 'Makineli Taret', size: 1, hp: 500, cat: 'savunma',
    cost: { iron_ingot: 15, copper_ingot: 5 },
    desc: 'Hızlı ateş eder. Depodan mühimmat harcar. Hava ve kara hedefleri vurur.',
    range: 7.5, dmg: 9, rate: 0.12, ammo: 1 / 4, air: true,
  },
  turret_cannon: {
    name: 'Obüs Tareti', size: 1, hp: 800, cat: 'savunma',
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
  turret_missile: {
    name: 'Füze Bataryası', size: 1, hp: 900, cat: 'savunma', power: 10,
    cost: { alloy: 15, processor: 6, steel: 20 },
    desc: 'Çok uzun menzilli güdümlü füzeler. Depodan füze harcar, hava ve kara hedeflerini vurur.',
    range: 15, dmg: 150, rate: 3.0, ammo: 1, ammoItem: 'rocket', splash: 2.4, air: true, rocket: true,
  },
  // ---- askeri ----
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
    unlocks: ['assembler', 'splitter'], desc: 'Montaj makinesi (dişli, kablo, levha) ve ayırıcı.' },
  { id: 'yenilenebilir', name: 'Yarı İletkenler', cost: { brick: 40, wire: 40 }, req: 'otomasyon',
    unlocks: ['arc_furnace', 'solar', 'wind'], desc: 'Ark fırını (silikon), güneş paneli ve rüzgar türbini.' },
  { id: 'metalurji', name: 'Metalurji', cost: { brick: 60, gear: 30, wire: 40 }, req: 'otomasyon',
    unlocks: ['foundry', 'turret_cannon', 'belt_fast', 'wall_steel', 'miner_mk2'], desc: 'Dökümhane, obüs, hızlı konveyör, zırhlı duvar ve ağır matkap.' },
  { id: 'elektronik', name: 'İleri Elektronik', cost: { steel: 30, circuit: 20 }, req: 'metalurji',
    unlocks: ['turret_laser', 'factory', 'adv_assembler'], desc: 'Lazer tareti, araç fabrikası ve ileri montaj hattı.' },
  { id: 'petrokimya', name: 'Petrokimya', cost: { steel: 30, iron_plate: 40, circuit: 10 }, req: 'metalurji',
    unlocks: ['pumpjack', 'refinery', 'chem_plant', 'gen_fuel'], desc: 'Petrol pompası, rafineri, kimya tesisi ve yakıt jeneratörü.' },
  { id: 'hafif_metal', name: 'Hafif Metaller', cost: { steel: 30, iron_plate: 30, wire: 60 }, req: 'metalurji',
    unlocks: ['alu_smelter', 'pole_big'], desc: 'Boksitten alüminyum ve yüksek gerilim kuleleri.' },
  { id: 'mekanize', name: 'Mekanize Ordu', cost: { steel: 60, motor: 15, circuit: 30 }, req: 'elektronik',
    unlocks: [], units: ['tank', 'drone'], desc: 'Ağır tank ve saldırı dronu.' },
  { id: 'enerji_depolama', name: 'Enerji Depolama', cost: { aluminum: 30, sulfur: 40, circuit: 20 }, req: ['hafif_metal', 'petrokimya'],
    unlocks: ['battery_bank'], desc: 'Akü deposu: gündüz fazlasını gece kullan.' },
  { id: 'roket', name: 'Roket Teknolojisi', cost: { alloy: 30, explosive: 40, circuit: 30 }, req: ['elektronik', 'petrokimya', 'hafif_metal'],
    unlocks: ['turret_missile'], desc: 'Füze bataryası: 15 karo menzil, hava ve kara.' },
  { id: 'nukleer', name: 'Nükleer Enerji', cost: { processor: 20, alloy: 40, steel: 80 }, req: ['enerji_depolama', 'elektronik'],
    unlocks: ['enricher', 'reactor'], desc: 'Uranyum zenginleştirme ve 600 kW nükleer reaktör.' },
];

export const START_UNLOCKED = ['miner', 'belt', 'smelter_iron', 'smelter_copper', 'kiln', 'generator', 'pole', 'lamp', 'wall', 'turret_mg'];

export const START_STOCK = {
  iron_ingot: 130, copper_ingot: 60, brick: 50, ammo: 200, coal: 0, stone: 0,
};

export const CATEGORIES = [
  { id: 'maden', name: 'Maden' },
  { id: 'eritme', name: 'Eritme' },
  { id: 'montaj', name: 'Montaj' },
  { id: 'lojistik', name: 'Lojistik' },
  { id: 'enerji', name: 'Enerji' },
  { id: 'savunma', name: 'Savunma' },
  { id: 'askeri', name: 'Askeri' },
];

export const RIVALS = [
  { id: 1, name: 'Kızıl Lejyon', color: 0xc0392b, x: 81, y: 9, hp: 6000 },
  { id: 2, name: 'Pas Klanı', color: 0xd35400, x: 83, y: 51, hp: 6000 },
  { id: 3, name: 'Kara Sancak', color: 0x7d4bb3, x: 52, y: 55, hp: 4500 },
];
export const PLAYER_HQ = { x: 14, y: 31 };

// Harita tipleri
export const MAP_TYPES = [
  { id: 'mixed', name: 'Karma Bölgeler', desc: 'Ilıman vadide başla; doğuda çöl, tundra ve volkanik bölgeler.' },
  { id: 'temperate', name: 'Ilıman Vadi', desc: 'Yeşil ormanlar, göller ve bol su.' },
  { id: 'desert', name: 'Kızıl Çöl', desc: 'Kum tepeleri, kızıl topraklar, vahalar. Bol petrol ve boksit.' },
  { id: 'tundra', name: 'Donmuş Tundra', desc: 'Karla kaplı ovalar ve çam ormanları. Bol uranyum ve kuvars.' },
  { id: 'volcanic', name: 'Volkanik Ada', desc: 'Kül çölleri ve lav gölleri. Bol kükürt ve kömür.' },
];
