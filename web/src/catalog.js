// Mobilya kataloğu. w = genişlik (sırt boyunca), d = derinlik, h = yükseklik (cm).
// "front" = önünde boş kalması gereken alan (kullanım/açılma payı).
// "elev" = yerden yükseklik (üst dolap gibi asılı elemanlar için).

export const CATEGORIES = [
  { key: 'yatak', label: 'Yatak Odası' },
  { key: 'oturma', label: 'Oturma' },
  { key: 'yemek', label: 'Yemek' },
  { key: 'mutfak', label: 'Mutfak' },
  { key: 'banyo', label: 'Banyo' },
  { key: 'calisma', label: 'Çalışma' },
  { key: 'depolama', label: 'Depolama' },
  { key: 'dekor', label: 'Dekor' },
];

export const CATALOG = {
  // Yatak odası
  bed_double: { name: 'Çift Kişilik Yatak 160×200', cat: 'yatak', w: 170, d: 215, h: 100, front: 60, kind: 'bed' },
  bed_double_s: { name: 'Çift Kişilik Yatak 140×190', cat: 'yatak', w: 150, d: 205, h: 95, front: 60, kind: 'bed' },
  bed_single: { name: 'Tek Kişilik Yatak 100×200', cat: 'yatak', w: 105, d: 210, h: 90, front: 50, kind: 'bed' },
  bed_single_s: { name: 'Tek Kişilik Yatak 90×190', cat: 'yatak', w: 95, d: 200, h: 85, front: 50, kind: 'bed' },
  nightstand: { name: 'Komodin', cat: 'yatak', w: 45, d: 40, h: 50, front: 0, kind: 'nightstand' },
  wardrobe_240: { name: 'Gardırop 240', cat: 'yatak', w: 240, d: 60, h: 230, front: 80, kind: 'wardrobe' },
  wardrobe_200: { name: 'Gardırop 200', cat: 'yatak', w: 200, d: 60, h: 230, front: 80, kind: 'wardrobe' },
  wardrobe_160: { name: 'Gardırop 160', cat: 'yatak', w: 160, d: 60, h: 230, front: 80, kind: 'wardrobe' },
  wardrobe_120: { name: 'Gardırop 120', cat: 'yatak', w: 120, d: 60, h: 220, front: 75, kind: 'wardrobe' },
  wardrobe_90: { name: 'Gardırop 90', cat: 'yatak', w: 90, d: 58, h: 210, front: 70, kind: 'wardrobe' },
  dresser: { name: 'Şifonyer', cat: 'yatak', w: 120, d: 45, h: 80, front: 70, kind: 'dresser' },

  // Oturma
  sofa_3: { name: 'Üçlü Koltuk', cat: 'oturma', w: 220, d: 92, h: 85, front: 40, kind: 'sofa', seats: 3 },
  sofa_2: { name: 'İkili Koltuk', cat: 'oturma', w: 165, d: 90, h: 85, front: 40, kind: 'sofa', seats: 2 },
  sofa_l: { name: 'L Koltuk', cat: 'oturma', w: 280, d: 170, h: 85, front: 40, kind: 'sofa_l' },
  armchair: { name: 'Berjer', cat: 'oturma', w: 80, d: 82, h: 90, front: 35, kind: 'armchair' },
  coffee_table: { name: 'Orta Sehpa', cat: 'oturma', w: 110, d: 60, h: 42, front: 0, kind: 'coffee_table' },
  side_table: { name: 'Yan Sehpa', cat: 'oturma', w: 45, d: 45, h: 55, front: 0, kind: 'side_table' },
  tv_unit: { name: 'TV Ünitesi', cat: 'oturma', w: 180, d: 42, h: 50, front: 60, kind: 'tv_unit' },
  tv_unit_s: { name: 'TV Ünitesi (Küçük)', cat: 'oturma', w: 130, d: 40, h: 50, front: 50, kind: 'tv_unit' },
  rug: { name: 'Halı', cat: 'dekor', w: 200, d: 140, h: 1, front: 0, kind: 'rug', floor: true },
  rug_l: { name: 'Büyük Halı', cat: 'dekor', w: 240, d: 170, h: 1, front: 0, kind: 'rug', floor: true },

  // Yemek
  dining_6: { name: 'Yemek Masası (6 kişilik)', cat: 'yemek', w: 180, d: 90, h: 76, front: 0, kind: 'dining', chairs: 6, clear: 75 },
  dining_4: { name: 'Yemek Masası (4 kişilik)', cat: 'yemek', w: 130, d: 80, h: 76, front: 0, kind: 'dining', chairs: 4, clear: 70 },
  dining_2: { name: 'Yemek Masası (2 kişilik)', cat: 'yemek', w: 80, d: 70, h: 76, front: 0, kind: 'dining', chairs: 2, clear: 65 },
  sideboard: { name: 'Konsol / Büfe', cat: 'yemek', w: 180, d: 45, h: 80, front: 60, kind: 'sideboard' },

  // Mutfak (modüler)
  k_base: { name: 'Alt Dolap', cat: 'mutfak', w: 60, d: 60, h: 90, front: 100, kind: 'k_base' },
  k_sink: { name: 'Eviye Modülü', cat: 'mutfak', w: 80, d: 60, h: 90, front: 100, kind: 'k_sink' },
  k_stove: { name: 'Ocak + Fırın', cat: 'mutfak', w: 60, d: 60, h: 90, front: 100, kind: 'k_stove' },
  k_dishwasher: { name: 'Bulaşık Makinesi', cat: 'mutfak', w: 60, d: 60, h: 90, front: 100, kind: 'k_dishwasher' },
  k_fridge: { name: 'Buzdolabı', cat: 'mutfak', w: 75, d: 70, h: 190, front: 100, kind: 'k_fridge' },
  k_tall: { name: 'Boy Dolabı', cat: 'mutfak', w: 60, d: 60, h: 215, front: 90, kind: 'k_tall' },
  k_upper: { name: 'Üst Dolap', cat: 'mutfak', w: 60, d: 35, h: 70, elev: 150, front: 0, kind: 'k_upper', wallOnly: true },
  k_corner: { name: 'Köşe Dolabı', cat: 'mutfak', w: 60, d: 60, h: 90, front: 0, kind: 'k_base' },
  k_island: { name: 'Ada Tezgâh', cat: 'mutfak', w: 180, d: 90, h: 92, front: 0, kind: 'k_island' },
  bar_stool: { name: 'Bar Taburesi', cat: 'mutfak', w: 40, d: 40, h: 78, front: 0, kind: 'bar_stool' },

  // Banyo
  toilet: { name: 'Klozet', cat: 'banyo', w: 40, d: 62, h: 80, front: 60, kind: 'toilet', side: 20 },
  basin: { name: 'Lavabo Dolabı', cat: 'banyo', w: 70, d: 47, h: 85, front: 70, kind: 'basin' },
  basin_s: { name: 'Küçük Lavabo', cat: 'banyo', w: 50, d: 40, h: 85, front: 60, kind: 'basin' },
  shower: { name: 'Duşakabin 90×90', cat: 'banyo', w: 90, d: 90, h: 200, front: 60, kind: 'shower' },
  shower_s: { name: 'Duşakabin 80×80', cat: 'banyo', w: 80, d: 80, h: 200, front: 55, kind: 'shower' },
  bathtub: { name: 'Küvet 170×75', cat: 'banyo', w: 170, d: 75, h: 58, front: 60, kind: 'bathtub' },
  washer: { name: 'Çamaşır Makinesi', cat: 'banyo', w: 60, d: 60, h: 85, front: 70, kind: 'washer' },

  // Çalışma
  desk: { name: 'Çalışma Masası', cat: 'calisma', w: 120, d: 60, h: 75, front: 80, kind: 'desk' },
  desk_s: { name: 'Çalışma Masası (Küçük)', cat: 'calisma', w: 100, d: 55, h: 75, front: 75, kind: 'desk' },
  office_chair: { name: 'Çalışma Sandalyesi', cat: 'calisma', w: 55, d: 55, h: 95, front: 0, kind: 'office_chair' },
  bookshelf: { name: 'Kitaplık', cat: 'depolama', w: 90, d: 35, h: 200, front: 60, kind: 'bookshelf' },

  // Depolama / antre
  shoe_cabinet: { name: 'Portmanto / Ayakkabılık', cat: 'depolama', w: 100, d: 38, h: 110, front: 60, kind: 'shoe_cabinet' },
  console: { name: 'Dresuar', cat: 'depolama', w: 110, d: 35, h: 80, front: 50, kind: 'sideboard' },

  // Dekor
  plant: { name: 'Saksı Bitki', cat: 'dekor', w: 45, d: 45, h: 130, front: 0, kind: 'plant' },
  floor_lamp: { name: 'Lambader', cat: 'dekor', w: 40, d: 40, h: 165, front: 0, kind: 'floor_lamp' },
  chair: { name: 'Sandalye', cat: 'yemek', w: 45, d: 50, h: 90, front: 0, kind: 'chair' },
  balcony_set: { name: 'Balkon Masası', cat: 'dekor', w: 70, d: 70, h: 72, front: 0, kind: 'round_table' },
  lounge_chair: { name: 'Balkon Koltuğu', cat: 'dekor', w: 65, d: 70, h: 80, front: 0, kind: 'armchair' },
};

export function catalogItem(type) {
  return CATALOG[type];
}

export function makeItem(type, x, y, rot, roomId, extra = {}) {
  const c = CATALOG[type];
  return { id: 'f_' + Math.random().toString(36).slice(2, 10), type, roomId, x, y, rot, w: c.w, d: c.d, h: c.h, ...extra };
}
