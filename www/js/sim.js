// =====================================================================
//  BEYLİK — simülasyon çekirdeği
// =====================================================================

function newGame(seed) {
  var res = {};
  RES_KEYS.forEach(function (k) { res[k] = 0; });
  Object.assign(res, { akce: 200, odun: 100, tas: 25, ekmek: 60, et: 30, alet: 25, elbise: 0 });
  var fac = {};
  Object.keys(FACTIONS).forEach(function (f) { fac[f] = { iliski: f === 'turkmen' ? 20 : 0, antlasma: 'yok', guc: FACTIONS[f].guc, sonAI: 0 }; });
  var regions = {};
  REGIONS.forEach(function (r) { regions[r.id] = { sahip: r.sahip, garnizon: r.garnizon, memnun: 50 }; });
  var g = {
    version: 2, seed: seed, map: generateMap(seed),
    res: res, buildings: [], nextId: 1, day: 0, dayFrac: 0,
    pop: 20, taxLevel: 1, mods: [], questIdx: 0, nextEventDay: 45, pendingEvent: null,
    kuraklik: 0, happiness: 60, crime: 0, salgin: 0, titleIdx: 0, laws: [],
    army: { azap: 0, okcu: 0, akinci: 0, sipahi: 0 }, moral: 65, sefer: null, sur: 0,
    fac: fac, regions: regions, caravan: null, nextCaravanDay: 60, kervanYasak: 0, peddler: null,
    borc: null, stats: {}, history: [], log: [], victory: false, gameOver: false,
    pendingDemand: null, fx: [], notify: [], mahalleler: []
  };
  g.map.forest = g.map.trees.slice();
  var c = MAP_N / 2;
  placeBuilding(g, 'konak', c - 1, c - 1, true);
  placeBuilding(g, 'ev', c + 2, c - 1, true);
  placeBuilding(g, 'ev', c + 2, c + 1, true);
  placeBuilding(g, 'ev', c - 1, c + 2, true);
  placeBuilding(g, 'ev', c + 1, c + 3, true);
  placeBuilding(g, 'kuyu', c + 1, c + 1, true);
  rebuildOcc(g);
  assignWorkers(g);
  chronicle(g, 'Kayı boyundan küçük bir oba, Söğüt ovasına konup beyliğin temelini attı.');
  return g;
}

function chronicle(g, txt) {
  g.log.unshift({ gun: g.day, txt: txt });
  if (g.log.length > 120) g.log.length = 120;
}
function dateStr(g, day) {
  var d = day === undefined ? g.day : day;
  return SEASONS[Math.floor(d / SEASON_DAYS) % 4] + ' ' + (START_YEAR + Math.floor(d / YEAR_DAYS));
}

// ---------- Izgara ----------
function rebuildOcc(g) {
  g.occ = new Int32Array(MAP_N * MAP_N);
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n], d = BUILDINGS[b.type];
    for (var y = 0; y < d.h; y++) for (var x = 0; x < d.w; x++) g.occ[(b.j + y) * MAP_N + b.i + x] = b.id;
  }
}
function getBuilding(g, id) {
  for (var n = 0; n < g.buildings.length; n++) if (g.buildings[n].id === id) return g.buildings[n];
  return null;
}
function buildingAt(g, i, j) {
  if (!inMap(i, j)) return null;
  var id = g.occ[j * MAP_N + i];
  return id ? getBuilding(g, id) : null;
}
function centerOf(b) { var d = BUILDINGS[b.type]; return { x: b.i + d.w / 2, y: b.j + d.h / 2 }; }
function built(g, type) { return countB(g, type, true) > 0; }
function hasLaw(g, id) { return g.laws.indexOf(id) >= 0; }

// ---------- Depolama ----------
function storageCaps(g) {
  var c = { gida: 150, ham: 150, mal: 60 };
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n], s = BUILDINGS[b.type].storage;
    if (s && b.progress >= 1) for (var k in s) c[k] += s[k];
  }
  return c;
}
function capOf(g, k, caps) {
  var kat = RES[k].kat;
  if (kat === 'ozel') return Infinity;
  return (caps || storageCaps(g))[kat];
}
function catTotal(g, kat) {
  var s = 0;
  for (var i = 0; i < RES_KEYS.length; i++) if (RES[RES_KEYS[i]].kat === kat) s += g.res[RES_KEYS[i]];
  return s;
}
// Kategoriye göre toplam sınır: bir kategorideki tüm mallar aynı depoyu paylaşır
function addRes(g, k, amt, caps) {
  if (amt <= 0) return 0;
  var kat = RES[k].kat;
  if (kat === 'ozel') { g.res[k] += amt; return amt; }
  var room = Math.max(0, caps[kat] - catTotal(g, kat));
  var a = Math.min(room, amt);
  g.res[k] += a;
  return a;
}

// ---------- Yerleştirme ----------
function countTreesNear(g, i, j, w, h, r) {
  var n = 0;
  for (var y = j - r; y < j + h + r; y++) for (var x = i - r; x < i + w + r; x++) if (inMap(x, y) && g.map.trees[y * MAP_N + x]) n++;
  return n;
}
function tileNear(g, i, j, w, h, r, type) {
  for (var y = j - r; y < j + h + r; y++) for (var x = i - r; x < i + w + r; x++) if (inMap(x, y) && g.map.tiles[y * MAP_N + x] === type) return true;
  return false;
}
function avgFert(g, i, j, w, h) {
  var s = 0;
  for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) s += g.map.fert[(j + y) * MAP_N + i + x];
  return s / (w * h);
}
function canAfford(g, cost) { for (var k in cost) if ((g.res[k] || 0) < cost[k]) return false; return true; }
function unlocked(g, type) { var u = BUILDINGS[type].unlock; return !u || TITLE_IDX[u] <= g.titleIdx; }

function canPlace(g, type, i, j) {
  var d = BUILDINGS[type];
  if (!unlocked(g, type)) return { ok: false, reason: TITLES[TITLE_IDX[d.unlock]].ad + ' olunca açılır' };
  if (d.harika && countB(g, type) > 0) return { ok: false, reason: 'Sadece bir tane yapılabilir' };
  for (var y = 0; y < d.h; y++) for (var x = 0; x < d.w; x++) {
    var tx = i + x, ty = j + y;
    if (!inMap(tx, ty)) return { ok: false, reason: 'Harita dışı' };
    var k = ty * MAP_N + tx, t = g.map.tiles[k];
    if (t === T_WATER) return { ok: false, reason: 'Suya inşa edilemez' };
    if ((t === T_STONE || t === T_IRON) && d.need !== 'demir') return { ok: false, reason: 'Kayalığa inşa edilemez' };
    if (g.occ[k]) return { ok: false, reason: 'Burası dolu' };
  }
  var info = '';
  if (d.need === 'orman') {
    var t2 = countTreesNear(g, i, j, d.w, d.h, 5);
    if (t2 < 4) return { ok: false, reason: 'Yakında orman yok' };
    info = 'Ağaç: ' + t2 + ' (verim %' + Math.round(Math.min(1, t2 / 10) * 100) + ')';
  }
  if (d.need === 'tas') { if (!tileNear(g, i, j, d.w, d.h, 2, T_STONE)) return { ok: false, reason: 'Yakında kayalık yok' }; info = 'Kayalık yakında'; }
  if (d.need === 'demir') { if (!tileNear(g, i, j, d.w, d.h, 1, T_IRON)) return { ok: false, reason: 'Demir damarı (kızıl kaya) yanında olmalı' }; info = 'Demir damarı'; }
  if (d.need === 'kiyi') { if (!tileNear(g, i, j, d.w, d.h, 1, T_WATER)) return { ok: false, reason: 'Nehir kıyısında olmalı' }; info = 'Kıyı'; }
  if (d.need === 'su') { if (!tileNear(g, i, j, d.w, d.h, 4, T_WATER) && !serviceAt(g, i + d.w / 2, j + d.h / 2, 'su')) return { ok: false, reason: 'Suya (nehir, kuyu, çeşme) yakın olmalı' }; }
  if (d.farm) info = 'Toprak verimi %' + Math.round(avgFert(g, i, j, d.w, d.h) * 100);
  if ((d.cost.akce || 0) > g.res.akce) return { ok: false, reason: 'Akçe yetersiz', info: info };
  if ((d.cost.nufuz || 0) > g.res.nufuz) return { ok: false, reason: 'Nüfuz yetersiz', info: info };
  var eksik = [];
  for (var c in d.cost) if (c !== 'akce' && g.res[c] < d.cost[c]) eksik.push(RES[c].ad);
  if (eksik.length) info = (info ? info + ' · ' : '') + '⚠ Eksik: ' + eksik.join(', ') + ' (inşaat bekler)';
  return { ok: true, info: info };
}

function placeBuilding(g, type, i, j, free) {
  var d = BUILDINGS[type];
  if (!free && d.cost.akce) g.res.akce -= d.cost.akce;
  var b = {
    id: g.nextId++, type: type, i: i, j: j,
    progress: free || !d.work ? 1 : 0, workDone: 0, delivered: {},
    workers: 0, builders: 0, paused: false, oncelik: false,
    level: 1, residents: 0, happy: 60, status: '', factor: 1,
    crop: 'bugday', growth: 0, sown: 0, harvest: 0, soil: d.farm ? avgFert(g, i, j, d.w, d.h) : 1,
    age: 0, sheep: d.flock ? 8 : 0, upDays: 0, downDays: 0, cut: 0
  };
  for (var y = 0; y < d.h; y++) for (var x = 0; x < d.w; x++) g.map.trees[(j + y) * MAP_N + i + x] = 0;
  g.buildings.push(b);
  if (g.occ) for (var y2 = 0; y2 < d.h; y2++) for (var x2 = 0; x2 < d.w; x2++) g.occ[(j + y2) * MAP_N + i + x2] = b.id;
  g.terrainDirty = true;
  return b;
}

function demolish(g, b) {
  if (b.type === 'konak') return false;
  var d = BUILDINGS[b.type];
  if (b.progress >= 1) { for (var k in d.cost) if (k !== 'akce') g.res[k] += Math.floor(d.cost[k] * 0.4); }
  else for (var k2 in b.delivered) g.res[k2] += Math.floor(b.delivered[k2] * 0.8);
  g.buildings.splice(g.buildings.indexOf(b), 1);
  rebuildOcc(g);
  var cap = housingCap(g);
  if (g.pop > cap) g.pop = cap;
  assignWorkers(g);
  return true;
}

function houseCap(b) { return HOUSE_LEVELS[b.level].kap; }
function housingCap(g) {
  var c = 0;
  for (var n = 0; n < g.buildings.length; n++) { var b = g.buildings[n]; if (b.type === 'ev' && b.progress >= 1) c += houseCap(b); }
  return c;
}
function workforce(g) { return Math.floor(g.pop * WORK_RATIO); }

// ---------- İşçi dağıtımı ----------
function priority(b) {
  var d = BUILDINGS[b.type];
  if (b.oncelik) return -1;
  if (d.farm || d.flock || (d.prod && FOODS.some(function (f) { return d.prod[f]; })) || b.type === 'degirmen') return 0;
  if (b.type === 'oduncu' || b.type === 'tasocagi') return 1;
  if (d.service) return 2;
  return 3;
}
// Mevsim dışında işi olmayan binalar işçi tutmaz
function needsWorkers(g, b) {
  var d = BUILDINGS[b.type], s = season(g);
  if (d.farm) {
    if (b.crop === 'nadas' || s === 3) return false;
    if (s === 2 && b.harvest <= 0 && dayOfSeason(g) > 1) return false;
    return true;
  }
  if (d.orchard) return s === 1 || s === 2 || (s === 0 && b.age < YEAR_DAYS);
  if (d.sezon && d.sezon[s] === 0) return false;
  // Hammaddesi yoksa işçiler başka işe geçer
  if (d.input && !d.service) for (var ki in d.input) if (g.res[ki] < d.input[ki] * 0.5) return false;
  // Ürünü depoda yeterince varsa işçiler başka işe geçer
  if (d.prod && !b.sinirsiz) {
    var caps = g._caps || storageCaps(g), full = true;
    for (var k in d.prod) { var kat = RES[k].kat; if (kat === 'ozel' || g.res[k] < caps[kat] * 0.5) full = false; }
    if (full) return false;
  }
  return true;
}
function assignWorkers(g) {
  g._caps = storageCaps(g);
  var labor = workforce(g), used = 0;
  var order = g.buildings.slice().sort(function (a, b) { return priority(a) - priority(b) || a.id - b.id; });
  // öncelikli inşaatlar üretimden önce işçi alır
  for (var n0 = 0; n0 < order.length; n0++) {
    var s0 = order[n0]; s0.builders = 0;
    if (s0.progress < 1 && s0.oncelik && !s0.paused) { var w0 = Math.min(4, labor - used); s0.builders = w0; used += w0; }
  }
  for (var n = 0; n < order.length; n++) {
    var b = order[n], d = BUILDINGS[b.type];
    b.workers = 0;
    if (!d.workers || b.progress < 1 || b.paused || !needsWorkers(g, b)) continue;
    var w = Math.min(d.workers, labor - used);
    b.workers = w; used += w;
  }
  var extra = 2; // konağın hizmetkârları yalnız inşaatta çalışır
  for (var m = 0; m < order.length; m++) {
    var s = order[m];
    if (s.progress < 1 && !s.paused) {
      var bw = Math.min(4 - s.builders, labor - used);
      if (bw < 0) bw = 0;
      s.builders += bw; used += bw;
      if (s.builders < 4 && extra > 0) { var ex = Math.min(extra, 4 - s.builders); s.builders += ex; extra -= ex; }
    }
  }
  // Evlere sakin dağıt
  var left = g.pop;
  for (var h = 0; h < g.buildings.length; h++) {
    var hb = g.buildings[h];
    if (hb.type !== 'ev') continue;
    if (hb.progress < 1) { hb.residents = 0; continue; }
    hb.residents = Math.min(houseCap(hb), left); left -= hb.residents;
  }
  g.stats.workers = used;
  g.stats.unemployed = labor - used;
  g.stats.workforce = labor;
}

function season(g) { return Math.floor(g.day / SEASON_DAYS) % 4; }
function year(g) { return START_YEAR + Math.floor(g.day / YEAR_DAYS); }
function dayOfSeason(g) { return (g.day % SEASON_DAYS) + 1; }
function modSum(g, key) { var s = 0; for (var n = 0; n < g.mods.length; n++) s += g.mods[n][key] || 0; return s; }

function serviceActive(b) {
  var d = BUILDINGS[b.type];
  if (b.progress < 1 || b.paused) return false;
  if (d.workers && b.workers === 0) return false;
  if (b.noInput) return false;
  return true;
}
// Bir noktada hizmet var mı
function serviceAt(g, x, y, key) {
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n], d = BUILDINGS[b.type];
    if (d.service !== key || !serviceActive(b)) continue;
    var c = centerOf(b);
    if (Math.hypot(c.x - x, c.y - y) <= d.radius) return b;
  }
  return null;
}

// ---------- İnşaat ----------
function doConstruction(g) {
  var speed = 1 + modSum(g, 'insaat') + (hasLaw(g, 'imece') ? 0.3 : 0);
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n], d = BUILDINGS[b.type];
    if (b.progress >= 1) continue;
    if (b.paused) { b.status = 'Durduruldu'; continue; }
    if (!b.builders) { b.status = 'İnşaatçı yok (boşta işçi gerekli)'; continue; }
    var w = b.builders * speed;
    var target = Math.min(d.work, b.workDone + w);
    var frac = target / d.work, missing = null;
    for (var k in d.cost) {
      if (k === 'akce') continue;
      var avail = (b.delivered[k] || 0) + g.res[k];
      var f = avail / d.cost[k];
      if (f < frac) { frac = f; missing = k; }
    }
    var newWork = Math.max(b.workDone, Math.min(target, frac * d.work));
    var nf = newWork / d.work;
    for (var k2 in d.cost) {
      if (k2 === 'akce') continue;
      var need = d.cost[k2] * nf - (b.delivered[k2] || 0);
      if (need > 0) { var take = Math.min(need, g.res[k2]); g.res[k2] -= take; b.delivered[k2] = (b.delivered[k2] || 0) + take; }
    }
    b.workDone = newWork;
    b.progress = Math.min(1, b.workDone / d.work);
    if (b.progress >= 0.999) {
      b.progress = 1;
      g.notify.push('🏗️ ' + d.ad + ' tamamlandı');
      if (d.harika) chronicle(g, d.ad + ' tamamlandı. Şanı bütün Anadolu\'ya yayıldı.');
    } else b.status = missing && newWork <= b.workDone + 0.001 ? 'Malzeme bekleniyor: ' + RES[missing].ad : 'İnşa ediliyor';
  }
}

// ---------- Üretim ----------
function doProduction(g, s, caps) {
  var prodBonus = 1 + modSum(g, 'uretim');
  var moodF = 0.8 + 0.4 * g.happiness / 100;
  var toolWear = hasLaw(g, 'ahi') ? 0.0018 : 0.0025;
  var noTools = g.res.alet <= 0.01;
  var wearTotal = 0;
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n], d = BUILDINGS[b.type];
    b.noInput = false;
    if (b.progress < 1) continue;
    if (d.orchard || d.farm || d.flock) b.age++;
    if (!d.workers) { b.status = d.house ? '' : (d.storage ? 'Depo' : 'Hizmette'); continue; }
    if (b.paused) { b.status = 'Durduruldu'; continue; }
    if (b.workers === 0) {
      if (!needsWorkers(g, b)) {
        var lack = null; if (d.input) for (var ki2 in d.input) if (g.res[ki2] < d.input[ki2] * 0.5) lack = ki2;
        if (lack) { b.status = 'Hammadde yok: ' + RES[lack].ad; b.noInput = true; continue; }
        b.status = d.prod && !d.farm && !d.orchard && !(d.sezon && d.sezon[s] === 0) ? 'Stok yeterli (işçiler başka işte)' : d.farm ? (b.crop === 'nadas' ? 'Nadasta (toprak dinleniyor)' : season(g) === 3 ? 'Kış: tarla boş' : 'Hasat bitti') : 'Mevsim dışı'; if (d.farm && s === 3) { b.harvest = 0; b.growth = 0; b.sown = 0; } continue; }
      b.status = 'İşçi yok'; continue;
    }
    wearTotal += b.workers * toolWear;
    var eff = b.workers / d.workers * prodBonus * moodF * (noTools ? 0.6 : 1);
    if (d.zanaat && hasLaw(g, 'ahi')) eff *= 1.2;
    var suffix = noTools ? ' (alet yok!)' : '';

    if (d.farm) { doFarm(g, b, d, s, eff, caps); b.status += suffix; continue; }
    if (d.orchard) {
      if (b.age < YEAR_DAYS) { b.status = 'Fidanlar büyüyor (' + Math.round(b.age / YEAR_DAYS * 100) + '%)'; continue; }
      var rate = d.orchard === 'meyve' ? [0, 0.35, 0.8, 0][s] : [0, 0, 1.5, 0][s];
      if (!rate) { b.status = s === 3 ? 'Kış uykusu' : 'Meyve bağlıyor'; continue; }
      addRes(g, d.orchard, rate * eff * d.workers, caps);
      b.status = 'Hasat'; continue;
    }
    if (d.flock) { doFlock(g, b, s, eff, caps); continue; }

    var factor = 1;
    if (d.need === 'orman') factor = Math.min(1, countTreesNear(g, b.i, b.j, d.w, d.h, 5) / 10);
    if (d.sezon) factor *= d.sezon[s];
    b.factor = factor;
    if (factor <= 0) { b.status = 'Mevsim dışı'; continue; }
    var w = d.workers * eff;
    var ratio = 1, missing = null;
    if (d.input) {
      for (var k in d.input) {
        var needAmt = d.input[k] * w;
        var r = needAmt > 0 ? g.res[k] / needAmt : 1;
        if (r < ratio) { ratio = r; missing = k; }
      }
      ratio = Math.max(0, Math.min(1, ratio));
    }
    if (ratio <= 0.01) { b.status = 'Hammadde yok: ' + RES[missing].ad; b.noInput = true; continue; }
    // çıktı için yer var mı
    var room = 1;
    if (d.prod) for (var kp in d.prod) {
      var kat = RES[kp].kat;
      if (kat !== 'ozel' && catTotal(g, kat) >= caps[kat] - 0.01) room = 0;
    }
    if (d.prod && room === 0) { b.status = 'Depo dolu'; continue; }
    if (d.input) for (var k2 in d.input) g.res[k2] = Math.max(0, g.res[k2] - d.input[k2] * w * ratio);
    if (d.prod) for (var k3 in d.prod) {
      var got = addRes(g, k3, d.prod[k3] * w * ratio * factor, caps);
      if (b.type === 'oduncu') cutTrees(g, b, got);
    }
    b.status = (ratio < 1 ? 'Az hammadde' : 'Çalışıyor') + suffix;
  }
  g.res.alet = Math.max(0, g.res.alet - wearTotal);
}

function cutTrees(g, b, amt) {
  b.cut += amt;
  while (b.cut >= 25) {
    b.cut -= 25;
    var d = BUILDINGS[b.type], best = -1, bd = 1e9, c = centerOf(b);
    for (var y = b.j - 5; y < b.j + d.h + 5; y++) for (var x = b.i - 5; x < b.i + d.w + 5; x++) {
      if (!inMap(x, y)) continue;
      var k = y * MAP_N + x;
      if (!g.map.trees[k]) continue;
      var dd = Math.hypot(x + 0.5 - c.x, y + 0.5 - c.y);
      if (dd < bd) { bd = dd; best = k; }
    }
    if (best >= 0) g.map.trees[best] = 0;
  }
}
function regrowForest(g) {
  var f = g.map.forest, t = g.map.trees;
  for (var n = 0; n < 40; n++) {
    var k = Math.floor(Math.random() * f.length);
    if (f[k] && !t[k] && !g.occ[k] && Math.random() < 0.5) t[k] = f[k];
  }
}

function doFarm(g, b, d, s, eff, caps) {
  if (b.crop === 'nadas') { b.status = 'Nadasta (toprak dinleniyor)'; b.growth = 0; return; }
  var bonus = hasLaw(g, 'timar') ? 1.1 : 1;
  if (s === 0) {
    if (b.sown < 1) { b.sown = Math.min(1, b.sown + eff / 10); b.status = 'Ekim %' + Math.round(b.sown * 100); }
    else b.status = 'Filizleniyor';
    b.growth = Math.min(1, b.growth + b.sown * (0.4 + 0.6 * Math.min(1, eff)) / 50 * (1 - g.kuraklik));
  } else if (s === 1) {
    b.growth = Math.min(1, b.growth + b.sown * (0.4 + 0.6 * Math.min(1, eff)) / 50 * (1 - g.kuraklik));
    b.status = 'Ekin büyüyor %' + Math.round(b.growth * 100);
  } else if (s === 2) {
    if (dayOfSeason(g) === 1 && b.growth > 0) {
      b.harvest = 120 * b.growth * b.soil * bonus;
      b.harvestCrop = b.crop;
      b.soil = Math.max(0.3, b.soil - (b.crop === 'arpa' ? 0.06 : 0.11));
      b.growth = 0; b.sown = 0;
    }
    if (b.harvest > 0) {
      var amt = Math.min(b.harvest, 7 * eff);
      b.harvest -= amt;
      var got = addRes(g, b.harvestCrop || 'bugday', amt, caps);
      b.status = got < amt * 0.5 ? 'Hasat: ambar dolu!' : 'Hasat (kalan ' + Math.round(b.harvest) + ')';
    } else b.status = 'Hasat bitti';
  } else {
    if (b.harvest > 1) { g.notify.push('⚠️ Toplanamayan ' + Math.round(b.harvest) + ' ekin tarlada çürüdü'); }
    b.harvest = 0; b.growth = 0; b.sown = 0;
    b.status = 'Kış: tarla boş';
  }
}

function doFlock(g, b, s, eff, caps) {
  var sheep = b.sheep;
  if (s === 3) {
    var feed = sheep * 0.04;
    var got = Math.min(g.res.arpa, feed);
    g.res.arpa -= got;
    if (got < feed * 0.95) {
      var die = Math.max(1, Math.round(sheep * 0.03 * (1 - got / feed)));
      if (Math.random() < 0.35) { b.sheep = Math.max(0, sheep - die); addRes(g, 'deri', die, caps); b.status = 'Koyunlar aç! (yem: arpa)'; }
      else b.status = 'Yem az (arpa)';
    } else b.status = 'Kışlıkta, yemle besleniyor';
    return;
  }
  addRes(g, 'sut', 0.07 * sheep * eff, caps);
  if (s === 0) {
    addRes(g, 'yun', 0.05 * sheep * eff, caps);
    if (sheep < 26) b.sheep = Math.min(26, sheep + sheep * 0.012 * eff);
    b.status = 'Kuzulama ve kırkım';
  } else if (s === 2 && sheep > 14 && dayOfSeason(g) % 3 === 0) {
    b.sheep -= 1; addRes(g, 'et', 3, caps); addRes(g, 'deri', 1, caps);
    b.status = 'Kesim mevsimi';
  } else b.status = 'Otlakta';
}

// ---------- Hane, ihtiyaç ve mutluluk ----------
function houseNeedsMet(g, b, lvl, ctx) {
  var c = centerOf(b), miss = [];
  var L = HOUSE_LEVELS[lvl];
  for (var n = 0; n < L.ihtiyac.length; n++) {
    var k = L.ihtiyac[n], ok = true;
    if (k === 'yemek1') ok = ctx.variety >= 1;
    else if (k === 'yemek2') ok = ctx.variety >= 2;
    else if (k === 'yemek3') ok = ctx.variety >= 3;
    else if (k === 'su') ok = !!ctx.cov(c, 'su');
    else if (k === 'pazar') ok = !!ctx.cov(c, 'pazar');
    else if (k === 'ibadet') ok = !!ctx.cov(c, 'ibadet');
    else if (k === 'hamam') ok = !!ctx.cov(c, 'hamam');
    else if (k === 'medrese') ok = !!ctx.cov(c, 'medrese');
    else if (k === 'elbise') ok = g.res.elbise >= 1;
    else if (k === 'comlek') ok = g.res.comlek >= 1;
    else if (k === 'luks') ok = ctx.luks;
    if (!ok) miss.push(k);
  }
  return miss;
}

function doHouses(g, s, ctx) {
  var houses = [], tax = TAX[g.taxLevel];
  var modH = modSum(g, 'mutluluk');
  var vakif = hasLaw(g, 'vakif');
  var total = 0, people = 0, income = 0;
  var noTax = modSum(g, 'vergi') < 0;
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n];
    if (b.type !== 'ev' || b.progress < 1) continue;
    var c = centerOf(b);
    var miss = houseNeedsMet(g, b, b.level, ctx);
    var parts = [['Temel', 45]];
    if (ctx.hungry) parts.push(['Açlık', -40]);
    else parts.push(['Yiyecek çeşidi (' + ctx.variety + ')', [0, 0, 6, 10, 14, 16, 18, 20, 22][Math.min(8, ctx.variety)]]);
    if (miss.length) parts.push(['Eksik ihtiyaç (' + miss.length + ')', -7 * miss.length]);
    if (ctx.cov(c, 'su')) parts.push(['Su', 5]);
    if (ctx.cov(c, 'ibadet')) parts.push(['İbadethane', 6 + (vakif ? 3 : 0)]);
    if (ctx.cov(c, 'pazar')) parts.push(['Pazar', 4]);
    if (ctx.cov(c, 'hamam')) parts.push(['Hamam', 5]);
    if (ctx.cov(c, 'tekke')) parts.push(['Tekke', 6]);
    if (b.level === 1 && ctx.cov(c, 'imaret')) parts.push(['İmaret aşı', 6 + (vakif ? 3 : 0)]);
    if (ctx.cold) parts.push(['Soğuk (odun yok)', -25]);
    if (!noTax && tax.mutluluk) parts.push(['Vergi', tax.mutluluk]);
    var cr = g.crime * (ctx.cov(c, 'asayis') ? 0.3 : 1) / 6;
    if (cr >= 1) parts.push(['Suç', -Math.round(cr)]);
    if (g.salgin > 0) parts.push(['Salgın', ctx.cov(c, 'saglik') ? -4 : -12]);
    if (modH) parts.push(['Olaylar', modH]);
    if (hasLaw(g, 'asayis')) parts.push(['Sıkı asayiş', -4]);
    if (g.fx.some(function (f) { return f.war; })) parts.push(['Savaş korkusu', -5]);
    var v = 0;
    for (var p = 0; p < parts.length; p++) v += parts[p][1];
    b.happy = Math.max(0, Math.min(100, Math.round(v)));
    b.parts = parts; b.miss = miss;
    total += b.happy * b.residents; people += b.residents;
    if (!noTax) income += b.residents * HOUSE_LEVELS[b.level].vergi * tax.carpan;
    // seviye değişimi
    if (miss.length) { b.downDays++; b.upDays = 0; }
    else {
      b.downDays = 0;
      if (b.level < 3) {
        var nextMiss = houseNeedsMet(g, b, b.level + 1, ctx);
        b.nextMiss = nextMiss;
        if (!nextMiss.length) b.upDays++; else b.upDays = 0;
      } else b.nextMiss = [];
    }
    if (b.level < 3 && b.upDays >= 15 && canAfford(g, HOUSE_LEVELS[b.level + 1].yukselt)) {
      var cst = HOUSE_LEVELS[b.level + 1].yukselt;
      for (var k in cst) g.res[k] -= cst[k];
      b.level++; b.upDays = 0;
      g.notify.push('🏡 Bir hane ' + HOUSE_LEVELS[b.level].ad + ' seviyesine yükseldi');
    } else if (b.level > 1 && b.downDays >= 30) {
      b.level--; b.downDays = 0;
      g.notify.push('🏚️ Bir hane ihtiyaçları karşılanmadığı için ' + HOUSE_LEVELS[b.level].ad + ' seviyesine düştü');
    }
    houses.push(b);
  }
  g.happiness = people ? Math.round(total / people) : 50;
  return income;
}

function computeMahalleler(g) {
  var centers = g.buildings.filter(function (b) { return BUILDINGS[b.type].mahalle && b.progress >= 1; });
  var list = centers.map(function (c, n) {
    return { id: c.id, ad: (c.mahAd || (c.mahAd = MAHALLE_NAMES[(c.id * 7) % MAHALLE_NAMES.length])) + ' Mahallesi', merkez: BUILDINGS[c.type].ad, evler: 0, nufus: 0, mutluluk: 0, seviye: [0, 0, 0, 0], imam: serviceActive(c) };
  });
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n];
    if (b.type !== 'ev' || b.progress < 1) continue;
    var hc = centerOf(b), best = null, bd = 1e9;
    centers.forEach(function (c, k) {
      var cc = centerOf(c), dd = Math.hypot(cc.x - hc.x, cc.y - hc.y);
      if (dd <= BUILDINGS[c.type].radius && dd < bd) { bd = dd; best = k; }
    });
    b.mahalle = best === null ? null : list[best].ad;
    if (best !== null) {
      var m = list[best]; m.evler++; m.nufus += b.residents; m.mutluluk += b.happy * b.residents; m.seviye[b.level]++;
    }
  }
  list.forEach(function (m) { m.mutluluk = m.nufus ? Math.round(m.mutluluk / m.nufus) : 0; });
  g.mahalleler = list;
}

// ---------- Günlük döngü ----------
function simDay(g) {
  if (g.gameOver) return;
  var s = season(g);
  var caps = storageCaps(g);
  assignWorkers(g);
  doConstruction(g);
  assignWorkers(g);
  doProduction(g, s, caps);

  // hizmet kapsama önbelleği
  var services = g.buildings.filter(function (b) { return BUILDINGS[b.type].service && serviceActive(b); });
  var cov = function (c, key) {
    for (var n = 0; n < services.length; n++) {
      var sb = services[n], sd = BUILDINGS[sb.type];
      if (sd.service !== key) continue;
      var sc = centerOf(sb);
      if (Math.hypot(sc.x - c.x, sc.y - c.y) <= sd.radius) return true;
    }
    return false;
  };

  // Yiyecek tüketimi (askerler dahil)
  var eaters = g.pop + armySize(g);
  var need = eaters * 0.05;
  var avail = 0, variety = 0, luks = false;
  FOODS.forEach(function (f) { avail += g.res[f]; if (g.res[f] >= 1) { variety++; if (RES[f].luks) luks = true; } });
  var hungry = avail < need * 0.6;
  if (avail > 0) {
    var take = Math.min(need, avail);
    FOODS.forEach(function (f) { g.res[f] = Math.max(0, g.res[f] - take * (g.res[f] / avail)); });
  }
  g.stats.foodNeed = need; g.stats.variety = variety;
  // Mal tüketimi
  var l2 = 0, l3 = 0;
  g.buildings.forEach(function (b) { if (b.type === 'ev' && b.progress >= 1) { if (b.level >= 2) l2 += b.residents; if (b.level >= 3) l3 += b.residents; } });
  g.res.elbise = Math.max(0, g.res.elbise - l2 * 0.004);
  g.res.comlek = Math.max(0, g.res.comlek - l3 * 0.003);
  // Bozulma
  var spoilF = (built(g, 'ambar') ? 0.6 : 1) * (hasLaw(g, 'kitlik') ? 0.5 : 1) * [1, 1.3, 1, 0.6][s];
  FOODS.forEach(function (f) { g.res[f] *= (1 - RES[f].bozul * spoilF); });
  ['un', 'sut', 'uzum'].forEach(function (f) { g.res[f] *= (1 - 0.01 * spoilF); });

  // Isınma
  var houses = 0;
  g.buildings.forEach(function (b) { if (b.type === 'ev' && b.residents > 0) houses++; });
  var heat = houses * (s === 3 ? 0.1 : s === 2 ? 0.03 : 0);
  var cold = false;
  if (heat > 0) { if (g.res.odun >= heat) g.res.odun -= heat; else { g.res.odun = 0; cold = s === 3; } }

  // Hamam yakıtı ve hizmetler: doProduction'da input ile karşılandı
  var income = doHouses(g, s, { hungry: hungry, variety: variety, luks: luks, cold: cold, cov: cov });
  g.res.akce += income;
  g.stats.income = income;

  // Nüfuz
  var nuf = 0.01 * (g.titleIdx + 1);
  g.buildings.forEach(function (b) { var d = BUILDINGS[b.type]; if (d.nufuz && serviceActive(b)) nuf += d.nufuz; });
  if (hasLaw(g, 'ilim')) nuf *= 1.5;
  g.res.nufuz += nuf;
  g.stats.nufuz = nuf;

  // Suç
  var hasKadi = built(g, 'kadi');
  var target = Math.max(0, (g.pop - 40) * 0.12 + g.stats.unemployed * 0.7 + Math.max(0, 55 - g.happiness) * 0.6);
  if (hasKadi) target *= 0.6;
  if (hasLaw(g, 'asayis')) target *= 0.5;
  if (services.some(function (b) { return BUILDINGS[b.type].service === 'asayis'; })) target *= 0.7;
  if (services.some(function (b) { return BUILDINGS[b.type].service === 'imaret'; })) target *= 0.8;
  g.crime += (Math.min(100, target) - g.crime) * 0.05;
  if (g.crime > 15) { var theft = g.crime * 0.02 * Math.max(1, g.pop / 50); g.res.akce = Math.max(0, g.res.akce - theft); g.stats.theft = theft; } else g.stats.theft = 0;

  // Salgın
  var hasDS = services.some(function (b) { return BUILDINGS[b.type].service === 'saglik'; });
  if (g.salgin > 0) {
    var deaths = g.pop * 0.004 * (hasDS ? 0.25 : 1) * (1 - modSum(g, 'saglik'));
    if (Math.random() < deaths % 1) deaths = Math.ceil(deaths); else deaths = Math.floor(deaths);
    if (deaths > 0) g.pop = Math.max(0, g.pop - deaths);
    g.salgin -= 1 / 30;
    if (g.salgin <= 0) { g.salgin = 0; g.notify.push('Salgın sona erdi.'); chronicle(g, 'Salgın dindi.'); }
  } else if (g.pop > 30) {
    var waterCov = 0, hc = 0;
    g.buildings.forEach(function (b) { if (b.type === 'ev' && b.progress >= 1) { hc++; if (cov(centerOf(b), 'su')) waterCov++; } });
    var risk = 0.00035 * (g.pop / 60) * (hc && waterCov / hc < 0.6 ? 2 : 1) * (built(g, 'hamam') ? 0.6 : 1) * (hasDS ? 0.35 : 1) * (1 - modSum(g, 'saglik')) + modSum(g, 'salginRisk');
    if (Math.random() < risk) { g.salgin = 1; g.notify.push('☠️ Şehirde salgın başladı!'); chronicle(g, 'Şehre salgın düştü.'); }
  }

  // Yangın
  var fireMod = 1 + modSum(g, 'yangin');
  for (var fb = g.buildings.length - 1; fb >= 0; fb--) {
    var bb = g.buildings[fb], fd = BUILDINGS[bb.type];
    if (!fd.fire || bb.progress < 1) continue;
    if (Math.random() < 0.00012 * fd.fire * (s === 1 ? 2 : 1) * fireMod) {
      var cc = centerOf(bb);
      g.fx.push({ type: 'fire', i: bb.i, j: bb.j, t: 25 });
      if (cov(cc, 'su') && Math.random() < 0.75) { g.notify.push('🔥 ' + fd.ad + ' tutuştu ama söndürüldü'); }
      else {
        g.notify.push('🔥 ' + fd.ad + ' yanıp kül oldu!');
        chronicle(g, 'Büyük bir yangında ' + fd.ad + ' yandı.');
        g.buildings.splice(fb, 1); rebuildOcc(g);
      }
    }
  }

  // Nüfus değişimi
  var capH = housingCap(g), hp = g.happiness;
  var mig = hasLaw(g, 'istimalet') ? 1.3 : 1;
  if (hungry && g.pop > 0) { if (Math.random() < 0.5) { g.pop--; g.notify.push('Açlıktan bir kişi göç etti'); } }
  else if (hp >= 52 && g.pop < capH) {
    var exp = Math.min(0.6, (0.04 + (hp - 52) / 110) * mig * (0.4 + g.pop / 160));
    var add = Math.floor(exp) + (Math.random() < exp % 1 ? 1 : 0);
    g.pop = Math.min(capH, g.pop + add);
  } else if (hp < 38 && g.pop > 0) {
    if (Math.random() < (38 - hp) / 40) { g.pop--; g.notify.push('Mutsuz bir aile göç etti'); }
  }
  if (cold && Math.random() < 0.15 && g.pop > 0) g.pop--;
  if (g.pop > capH) g.pop = capH;

  // Ordu, diplomasi, ticaret, bölgeler
  doArmy(g);
  doRegions(g);
  doDiplomacy(g);
  doTrade(g, caps);

  // Pazar günü
  if (g.day % 7 === 6 && services.some(function (b) { return BUILDINGS[b.type].service === 'pazar'; })) {
    var tax2 = g.pop * 0.06 * Math.min(2, countB(g, 'pazar', true));
    g.res.akce += tax2;
    g.mods.push({ ad: 'Pazar günü', mutluluk: 5, gun: 2 });
    g.marketDay = 2;
    if (g.day % 28 === 27) g.notify.push('🛒 Pazar kuruldu (+' + Math.round(tax2) + ' akçe pazar vergisi)');
  }
  if (g.marketDay) g.marketDay--;

  // Borç
  if (g.borc) {
    if (--g.borc.gun <= 0) {
      g.res.akce -= g.borc.tutar;
      g.notify.push('💰 Tüccara ' + g.borc.tutar + ' akçe borç ödendi');
      if (g.res.akce < 0) { g.mods.push({ ad: 'Borç batağı', mutluluk: -10, gun: 40 }); chronicle(g, 'Bey borcunu ödeyemedi, itibarı sarsıldı.'); g.res.nufuz = Math.max(0, g.res.nufuz - 15); }
      g.borc = null;
    }
  }
  if (g.res.akce < 0 && Math.random() < 0.05) g.notify.push('⚠️ Hazine boş! Askerler ve hizmetler sıkıntıda.');

  // Değiştiriciler ve efektler
  for (var m = g.mods.length - 1; m >= 0; m--) if (--g.mods[m].gun <= 0) g.mods.splice(m, 1);
  for (var e = g.fx.length - 1; e >= 0; e--) if (--g.fx[e].t <= 0) g.fx.splice(e, 1);
  if (g.kervanYasak > 0) g.kervanYasak--;

  // Unvan
  var nt = TITLES[g.titleIdx + 1];
  if (nt && g.pop >= nt.pop && (!nt.l2 || countLevel(g, 2) >= nt.l2) && (!nt.l3 || countLevel(g, 3) >= nt.l3) && (!nt.bolge || ownedRegions(g) >= nt.bolge)) {
    g.titleIdx++;
    g.notify.push('👑 Beyliğin artık bir ' + nt.ad + '! Yeni binalar açıldı.');
    chronicle(g, 'Obamız büyüdü ve ' + nt.ad + ' oldu.');
    g.res.nufuz += 10 * g.titleIdx;
  }

  // Görev
  var q = QUESTS[g.questIdx];
  if (q && q.check(g)) {
    for (var rk in q.odul) g.res[rk] += q.odul[rk];
    g.notify.push('✅ Görev tamam: ' + q.ad + ' — ' + fmtCost(q.odul));
    g.questIdx++;
    if (g.questIdx >= QUESTS.length && !g.victory) { g.victory = true; chronicle(g, 'Bey, Sultan unvanını aldı. Bir cihan devletinin temeli atıldı.'); }
  }

  // Yeni gün
  g.day++;
  if (g.day % 10 === 0) {
    g.history.push({ d: g.day, p: g.pop, h: g.happiness, a: Math.round(g.res.akce), f: Math.round(foodTotal(g)) });
    if (g.history.length > 200) g.history.shift();
  }
  computeMahalleler(g);
  var ns = season(g);
  if (ns !== s) {
    g.notify.push(SEASON_ICON[ns] + ' ' + SEASONS[ns] + ' geldi');
    if (ns === 0) { g.kuraklik = 0; }
    if (ns === 3) {
      var needW = houses * 0.1 * SEASON_DAYS;
      if (g.res.odun < needW) g.notify.push('⚠️ Kış için odun az! Gerekli: ~' + Math.round(needW));
      // Nadas tarlaları dinlenir
      g.buildings.forEach(function (b) {
        if (!BUILDINGS[b.type].farm) return;
        var base = avgFert(g, b.i, b.j, 3, 3);
        b.soil = Math.min(base * 1.1, b.soil + (b.crop === 'nadas' ? 0.3 : 0.03));
      });
    }
    g.autosave = true;
  }
  if (ns === 0) regrowForest(g);

  if (g.pop <= 0 && !g.gameOver) { g.gameOver = true; chronicle(g, 'Beylik dağıldı.'); }

  // Divan olayı
  if (!g.pendingEvent && !g.pendingDemand && g.day >= g.nextEventDay) {
    var pool = EVENTS.filter(function (e) { return (!e.mevsim || e.mevsim.indexOf(ns) >= 0) && (!e.kosul || e.kosul(g)) && e.id !== g.lastEvent; });
    if (pool.length) {
      var ev = pool[Math.floor(Math.random() * pool.length)];
      g.pendingEvent = ev.id; g.lastEvent = ev.id;
    }
    g.nextEventDay = g.day + 22 + Math.floor(Math.random() * 25);
  }
}

function applyEventChoice(g, opt) {
  var e = opt.etki;
  if (e.res) for (var k in e.res) g.res[k] = Math.max(0, g.res[k] + e.res[k]);
  if (e.mod) g.mods.push(Object.assign({}, e.mod));
  if (e.pop) {
    if (e.pop > 0) {
      var room = housingCap(g) - g.pop, add = Math.max(0, Math.min(e.pop, room));
      g.pop += add;
      if (add < e.pop) g.notify.push((e.pop - add) + ' kişi ev bulamadığı için gitti');
    } else g.pop = Math.max(1, g.pop + e.pop);
  }
  if (e.kayip) for (var r in g.res) if (r !== 'akce' && r !== 'nufuz') g.res[r] = Math.floor(g.res[r] * (1 - e.kayip));
  if (e.kuraklik) g.kuraklik = Math.max(g.kuraklik, e.kuraklik);
  if (e.iliski) for (var f in e.iliski) changeRel(g, f, e.iliski[f]);
  if (e.suc) g.crime = Math.max(0, g.crime + e.suc);
  if (e.moral) g.moral = Math.max(0, Math.min(100, g.moral + e.moral));
  if (e.asker) for (var u in e.asker) g.army[u] += e.asker[u];
  if (e.kayipAsker) { for (var u2 in g.army) if (g.army[u2] > 0) { g.army[u2] -= e.kayipAsker; break; } }
  if (e.koyunKayip) g.buildings.forEach(function (b) { if (b.sheep) b.sheep = Math.floor(b.sheep * (1 - e.koyunKayip)); });
  if (e.sel) { g.buildings.forEach(function (b) { if (tileNear(g, b.i, b.j, 1, 1, 1, T_WATER) && b.type !== 'balikci') b.paused = b.paused; }); g.mods.push({ ad: 'Sel hasarı', uretim: -0.1, gun: 15 }); }
  if (e.kervanYasak) g.kervanYasak = Math.max(g.kervanYasak, e.kervanYasak);
  if (e.borc) g.borc = Object.assign({}, e.borc);
  if (e.salgin && Math.random() < e.salgin) { g.salgin = 1; g.notify.push('☠️ Salgın başladı!'); }
  if (e.vergiIndir) g.taxLevel = Math.max(0, g.taxLevel - 2);
  if (e.haracIlhanli) { var t = Math.round(30 + g.pop * 0.5); g.res.akce -= t; g.notify.push(t + ' akçe vergi ödendi'); }
  if (e.ganimet) { var gn = Math.round(g.army.akinci * 12 * (hasLaw(g, 'akinci') ? 2 : 1)); g.res.akce += gn; g.notify.push('⚔️ Akıncılar ' + gn + ' akçe ganimetle döndü'); }
  g.pendingEvent = null;
  assignWorkers(g);
}

// ---------- Ordu ----------
function kislaCap(g) { var c = 0; g.buildings.forEach(function (b) { if (b.progress >= 1 && BUILDINGS[b.type].kisla) c += BUILDINGS[b.type].kisla; }); return c; }
function canRecruit(g, u) {
  var U = UNITS[u];
  if (!built(g, 'kisla')) return 'Kışla gerekli';
  if (U.timar && !hasLaw(g, 'timar')) return 'Tımar Kanunu gerekli';
  if (armySize(g) + (g.sefer ? sum(g.sefer.birlik) : 0) >= kislaCap(g)) return 'Kışla dolu';
  if (g.pop <= 12) return 'Nüfus çok az';
  var cost = recruitCost(g, u);
  for (var k in cost) if (g.res[k] < cost[k]) return RES[k].ad + ' yetersiz';
  return null;
}
function recruitCost(g, u) {
  var c = Object.assign({}, UNITS[u].bedel);
  if (u === 'akinci' && hasLaw(g, 'akinci')) c.akce = Math.round(c.akce * 0.7);
  return c;
}
function recruit(g, u) {
  var err = canRecruit(g, u);
  if (err) return err;
  var cost = recruitCost(g, u);
  for (var k in cost) g.res[k] -= cost[k];
  g.army[u]++; g.pop--;
  assignWorkers(g);
  return null;
}
function dismiss(g, u) { if (g.army[u] > 0) { g.army[u]--; if (g.pop < housingCap(g)) g.pop++; } }
function sum(o) { var s = 0; for (var k in o) s += o[k]; return s; }
function moraleF(g) { return (g.moral / 70) * (built(g, 'mehterhane') ? 1.15 : 1) * (hasLaw(g, 'mehter') ? 1.2 : 1); }
function armyPower(g, birlik, enemyMix) {
  var p = 0;
  for (var u in birlik) {
    var U = UNITS[u], bonus = 1 + (enemyMix ? (enemyMix[U.kars] || 0) * 0.6 : 0);
    p += birlik[u] * U.guc * bonus;
  }
  return p * moraleF(g);
}
function defensePower(g) {
  var kule = 0;
  g.buildings.forEach(function (b) { if (b.type === 'kule' && serviceActive(b)) kule += BUILDINGS.kule.savunma; });
  return armyPower(g, g.army) * 4 + [0, 40, 110, 220][g.sur] + kule + g.pop * 0.15;
}
function doArmy(g) {
  var size = armySize(g) + (g.sefer ? sum(g.sefer.birlik) : 0);
  if (size > 0) {
    var upkeep = 0;
    for (var u in UNITS) upkeep += (g.army[u] + (g.sefer ? g.sefer.birlik[u] || 0 : 0)) * UNITS[u].bakim;
    g.res.akce -= upkeep;
    g.stats.upkeep = upkeep;
    if (g.res.akce < 0) { g.moral = Math.max(0, g.moral - 0.6); if (Math.random() < 0.05) { for (var u2 in g.army) if (g.army[u2] > 0) { g.army[u2]--; g.notify.push('Maaş alamayan bir asker firar etti'); break; } } }
    else g.moral += (65 - g.moral) * 0.01;
  } else g.stats.upkeep = 0;
  // Sefer
  var s = g.sefer;
  if (s) {
    s.gun--;
    if (s.gun <= 0) {
      if (s.durum === 'gidis') resolveBattle(g);
      else { for (var k in s.birlik) g.army[k] += s.birlik[k]; if (s.ganimet) g.res.akce += s.ganimet; g.notify.push('🏠 Ordu sefer dönüşü kışlaya ulaştı' + (s.ganimet ? ' (+' + s.ganimet + ' akçe ganimet)' : '')); g.sefer = null; }
    }
  }
}
function enemyMixFor(faction) {
  var m = { bizans: { azap: 0.5, okcu: 0.3, akinci: 0.0, sipahi: 0.2 }, germiyan: { azap: 0.3, okcu: 0.4, akinci: 0.3, sipahi: 0 },
    karaman: { azap: 0.3, okcu: 0.3, akinci: 0.3, sipahi: 0.1 }, ilhanli: { azap: 0.1, okcu: 0.5, akinci: 0.4, sipahi: 0 }, turkmen: { azap: 0.2, okcu: 0.5, akinci: 0.3, sipahi: 0 } };
  return m[faction] || m.turkmen;
}
function startCampaign(g, regionId, birlik, mode) {
  if (g.sefer) return 'Ordu zaten seferde';
  var n = sum(birlik);
  if (n < 1) return 'Asker seç';
  for (var u in birlik) if (birlik[u] > g.army[u]) return 'Yeterli asker yok';
  var R = REGIONS.filter(function (r) { return r.id === regionId; })[0];
  var food = n * R.mesafe * 2 * 0.05;
  if (foodTotal(g) < food) return 'Sefer için yiyecek yetmez (' + Math.ceil(food) + ')';
  var take = food, tot = foodTotal(g);
  FOODS.forEach(function (f) { g.res[f] -= take * g.res[f] / tot; });
  for (var u2 in birlik) g.army[u2] -= birlik[u2];
  g.sefer = { hedef: regionId, birlik: birlik, gun: R.mesafe, durum: 'gidis', mod: mode || 'fetih' };
  var own = g.regions[regionId].sahip;
  if (own !== 'biz' && mode === 'fetih' && g.fac[own] && g.fac[own].antlasma !== 'savas') { declareWar(g, own, true); }
  chronicle(g, (mode === 'akin' ? 'Akıncılar ' : 'Ordu ') + R.ad + ' üzerine yola çıktı.');
  return null;
}
function resolveBattle(g) {
  var s = g.sefer, R = REGIONS.filter(function (r) { return r.id === s.hedef; })[0], reg = g.regions[s.hedef];
  var mix = enemyMixFor(reg.sahip);
  var ours = armyPower(g, s.birlik, mix);
  var enemyStr = reg.garnizon * (reg.garnizon > 150 ? 1.25 : 1) * (0.85 + Math.random() * 0.3);
  if (s.mod === 'akin') enemyStr *= 0.45;
  var r = ours / Math.max(1, enemyStr);
  var report = { bolge: R.ad, bizim: Math.round(ours), onlar: Math.round(enemyStr), kayip: {}, sonuc: '' };
  var lossF = r >= 1 ? Math.min(0.5, 0.22 / r) : Math.min(0.85, 0.35 + 0.35 * (1 - r));
  for (var u in s.birlik) { var l = Math.round(s.birlik[u] * lossF * (0.8 + Math.random() * 0.4)); l = Math.min(l, s.birlik[u]); report.kayip[u] = l; s.birlik[u] -= l; }
  if (r >= 1) {
    if (s.mod === 'akin') {
      s.ganimet = Math.round((30 + reg.garnizon * 0.8) * (hasLaw(g, 'akinci') ? 2 : 1) * Math.min(2, r));
      report.sonuc = 'Akın başarılı! ' + s.ganimet + ' akçe ganimet toplandı.';
      reg.garnizon = Math.max(10, Math.round(reg.garnizon * 0.85));
      if (g.fac[reg.sahip]) changeRel(g, reg.sahip, -12);
    } else {
      var prev = reg.sahip;
      reg.sahip = 'biz'; reg.garnizon = 20; reg.memnun = hasLaw(g, 'istimalet') ? 65 : 45; reg.eski = prev;
      report.sonuc = R.ad + ' fethedildi!';
      chronicle(g, R.ad + ' fethedildi.');
      g.res.nufuz += 15;
      g.moral = Math.min(100, g.moral + 10);
      if (g.fac[prev]) { changeRel(g, prev, -40); g.fac[prev].guc *= 0.85; }
    }
  } else {
    report.sonuc = 'Yenilgi! Ordu geri çekildi.';
    reg.garnizon = Math.max(10, Math.round(reg.garnizon - ours * 0.4));
    g.moral = Math.max(0, g.moral - 15);
    chronicle(g, R.ad + ' önünde yenilgi.');
  }
  g.lastBattle = report;
  g.notify.push('⚔️ ' + report.sonuc);
  s.durum = 'donus'; s.gun = R.mesafe;
  if (sum(s.birlik) === 0) g.sefer = null;
}
function doRegions(g) {
  var R = REGIONS;
  for (var n = 0; n < R.length; n++) {
    var reg = g.regions[R[n].id];
    if (reg.sahip === 'biz') {
      for (var k in R[n].gelir) g.res[k] += R[n].gelir[k] * (reg.memnun / 60);
      var targetM = 55 + (hasLaw(g, 'istimalet') ? 15 : 0) - g.taxLevel * 5 + Math.min(15, armySize(g) / 3);
      reg.memnun += (targetM - reg.memnun) * 0.01;
      if (reg.memnun < 25 && Math.random() < 0.01 * (hasLaw(g, 'istimalet') ? 0.5 : 1)) {
        reg.sahip = reg.eski && FACTIONS[reg.eski] ? reg.eski : 'turkmen'; reg.garnizon = 40;
        g.notify.push('🔥 ' + R[n].ad + ' isyan edip elimizden çıktı!');
        chronicle(g, R[n].ad + ' halkı isyan etti.');
      }
    } else if (g.day % 30 === 0) {
      var f = g.fac[reg.sahip];
      reg.garnizon = Math.min(R[n].garnizon * 1.5, reg.garnizon + R[n].garnizon * 0.05 * (f ? 1 : 0.5));
    }
  }
}

// ---------- Diplomasi ----------
function changeRel(g, f, d) { if (!g.fac[f]) return; g.fac[f].iliski = Math.max(-100, Math.min(100, g.fac[f].iliski + d)); }
function declareWar(g, f, silent) {
  g.fac[f].antlasma = 'savas'; changeRel(g, f, -40);
  g.notify.push('⚔️ ' + FACTIONS[f].ad + ' ile savaş başladı!');
  chronicle(g, FACTIONS[f].ad + ' ile savaş başladı.');
}
function diploAction(g, f, act) {
  var F = g.fac[f], A = FACTIONS[f];
  if (act === 'hediye') { if (g.res.akce < 60) return 'Akçe yetersiz (60)'; g.res.akce -= 60; changeRel(g, f, 10); return null; }
  if (act === 'ticaret') {
    if (F.antlasma === 'savas') return 'Savaştasınız';
    if (F.iliski < 20) return 'İlişki en az 20 olmalı'; if (g.res.nufuz < 10) return 'Nüfuz yetersiz (10)';
    g.res.nufuz -= 10; F.antlasma = 'ticaret'; chronicle(g, A.ad + ' ile ticaret antlaşması imzalandı.'); return null;
  }
  if (act === 'ittifak') {
    if (F.iliski < 55) return 'İlişki en az 55 olmalı'; if (g.res.nufuz < 30) return 'Nüfuz yetersiz (30)';
    g.res.nufuz -= 30; F.antlasma = 'ittifak'; chronicle(g, A.ad + ' ile ittifak kuruldu.'); return null;
  }
  if (act === 'savas') { declareWar(g, f); return null; }
  if (act === 'baris') {
    if (F.antlasma !== 'savas') return 'Savaşta değilsiniz';
    var bedel = Math.round(F.guc * 0.6);
    if (g.res.akce < bedel) return 'Barış için ' + bedel + ' akçe gerekir';
    g.res.akce -= bedel; F.antlasma = 'yok'; F.iliski = Math.max(F.iliski, -20); chronicle(g, A.ad + ' ile barış yapıldı.'); return null;
  }
  return null;
}
function doDiplomacy(g) {
  var myPow = defensePower(g);
  Object.keys(g.fac).forEach(function (f) {
    var F = g.fac[f], A = FACTIONS[f];
    F.guc += A.buyume * (1 + g.day / 2400);
    if (g.day - F.sonAI < 20) return;
    F.sonAI = g.day + Math.floor(Math.random() * 6);
    // ilişki zamanla nötre döner
    if (F.antlasma !== 'savas') F.iliski += F.iliski > 0 ? -1 : 1;
    if (F.antlasma === 'ittifak' && F.iliski < 20) { F.antlasma = 'ticaret'; g.notify.push(A.ad + ' ittifaktan ayrıldı'); }
    if (g.titleIdx < 1) return; // obaya kimse ilgi göstermez
    if (F.antlasma === 'savas') {
      F.savasGun = (F.savasGun || 0) + 20;
      if (Math.random() < 0.28) raid(g, f, myPow);
      else if ((F.guc < myPow * 0.8 || F.savasGun > 160 || (F.baskin || 0) >= 3) && Math.random() < 0.45) { g.pendingDemand = { f: f, tip: 'barisTeklif' }; }
      return;
    }
    F.savasGun = 0; F.baskin = 0;
    if (F.antlasma === 'ittifak') return;
    if (A.tavir === 'haracci' && F.guc > myPow * 1.3 && Math.random() < 0.35) { g.pendingDemand = { f: f, tip: 'harac', miktar: Math.round(40 + g.pop * 0.8) }; return; }
    if (g.titleIdx < 2) return; // savaşlar kasaba olunca başlar
    if (A.tavir === 'saldirgan' && F.iliski < -15 && F.guc > myPow * 1.1 && Math.random() < 0.35) { declareWar(g, f); return; }
    if (A.tavir === 'firsatci' && F.iliski < -30 && F.guc > myPow && Math.random() < 0.3) { declareWar(g, f); return; }
    if (F.iliski > 30 && F.antlasma === 'yok' && Math.random() < 0.2) g.pendingDemand = { f: f, tip: 'ticaretTeklif' };
  });
}
function raid(g, f, myPow) {
  var F = g.fac[f], A = FACTIONS[f];
  var str = F.guc * (0.12 + Math.random() * 0.16);
  F.baskin = (F.baskin || 0) + 1;
  g.fx.push({ war: true, t: 20 });
  if (myPow >= str) {
    var l = Math.min(armySize(g), Math.round(str / 40));
    for (var u in g.army) if (l > 0 && g.army[u] > 0) { var d = Math.min(l, g.army[u]); g.army[u] -= d; l -= d; }
    g.notify.push('🛡️ ' + A.ad + ' baskını püskürtüldü!');
    chronicle(g, A.ad + ' baskını püskürtüldü.');
    F.guc *= 0.95; g.moral = Math.min(100, g.moral + 5);
  } else {
    for (var r in g.res) if (r !== 'nufuz') g.res[r] = Math.floor(g.res[r] * 0.88);
    var burn = Math.floor(Math.random() * 3);
    var cand = g.buildings.filter(function (b) { return b.type !== 'konak' && BUILDINGS[b.type].kat !== 'askeri'; });
    for (var n = 0; n < burn && cand.length; n++) {
      var b = cand.splice(Math.floor(Math.random() * cand.length), 1)[0];
      g.fx.push({ type: 'fire', i: b.i, j: b.j, t: 25 });
      g.buildings.splice(g.buildings.indexOf(b), 1);
    }
    rebuildOcc(g);
    var dead = Math.min(g.pop - 1, 2 + Math.floor(Math.random() * 4));
    g.pop -= dead;
    g.mods.push({ ad: 'Yağma', mutluluk: -15, gun: 40 });
    g.notify.push('🔥 ' + A.ad + ' akıncıları beldeyi yağmaladı! ' + burn + ' yapı yandı, ' + dead + ' kişi öldü.');
    chronicle(g, A.ad + ' beldeyi yağmaladı.');
  }
}
function answerDemand(g, accept) {
  var d = g.pendingDemand; if (!d) return;
  var F = g.fac[d.f], A = FACTIONS[d.f];
  if (d.tip === 'harac') {
    if (accept) { g.res.akce -= d.miktar; changeRel(g, d.f, 10); chronicle(g, A.ad + '\'ya ' + d.miktar + ' akçe haraç ödendi.'); }
    else { changeRel(g, d.f, -30); if (g.titleIdx >= 2 && Math.random() < 0.5) declareWar(g, d.f); }
  } else if (d.tip === 'barisTeklif') {
    if (accept) { F.antlasma = 'yok'; F.iliski = -10; chronicle(g, A.ad + ' ile barış yapıldı.'); }
  } else if (d.tip === 'ticaretTeklif') {
    if (accept) { F.antlasma = 'ticaret'; chronicle(g, A.ad + ' ile ticaret antlaşması imzalandı.'); }
  }
  g.pendingDemand = null;
}

// ---------- Ticaret ----------
function tradePartners(g) { var n = 0; for (var f in g.fac) if (g.fac[f].antlasma === 'ticaret' || g.fac[f].antlasma === 'ittifak') n++; return n; }
function doTrade(g, caps) {
  var ks = g.buildings.filter(function (b) { return b.type === 'kervansaray' && serviceActive(b); });
  // seyyar tüccar
  if (!ks.length && g.day % 40 === 20 && g.titleIdx >= 0) { g.peddler = { gun: 6 }; g.notify.push('🧳 Seyyar tüccar geldi (6 gün kalacak)'); }
  if (g.peddler && --g.peddler.gun <= 0) g.peddler = null;
  // kervan
  if (g.caravan) {
    var cv = g.caravan;
    if (cv.state === 'yolda') { cv.t += 1 / 6; if (cv.t >= 1) { cv.state = 'burada'; cv.gun = 10; g.res.akce += cv.gumruk; g.notify.push('🐫 ' + cv.ad + ' kervansaraya ulaştı (+' + cv.gumruk + ' akçe gümrük). ' + RES[cv.talep].ad + ' arıyorlar, ' + RES[cv.teklif].ad + ' ucuz satıyorlar.'); } }
    else if (cv.state === 'burada') { if (--cv.gun <= 0) { cv.state = 'gidiyor'; cv.t = 0; } }
    else { cv.t += 1 / 6; if (cv.t >= 1) g.caravan = null; }
  } else if (ks.length && g.kervanYasak <= 0 && g.day >= g.nextCaravanDay) {
    var k = ks[0], kc = centerOf(k);
    var names = ['Halep kervanı', 'Tebriz kervanı', 'Konya kervanı', 'Kefe kervanı', 'Bağdat kervanı', 'Sivas kervanı'];
    var keys = Object.keys(PRICES);
    var edge = Math.random() < 0.5 ? { x: 0, y: kc.y } : { x: kc.x, y: MAP_N - 1 };
    g.caravan = { ad: names[Math.floor(Math.random() * names.length)], state: 'yolda', t: 0, from: edge, to: { x: kc.x, y: kc.y + 2 },
      talep: keys[Math.floor(Math.random() * keys.length)], teklif: keys[Math.floor(Math.random() * keys.length)], gumruk: 15 + Math.floor(Math.random() * 30) + tradePartners(g) * 10 };
    var gap = Math.max(18, 50 - tradePartners(g) * 8) * (hasLaw(g, 'kervan') ? 0.7 : 1);
    g.nextCaravanDay = g.day + Math.round(gap);
  }
  // kervansaray gümrüğü
  ks.forEach(function (b) { g.res.akce += 1.2 * b.workers / 3 * (1 + tradePartners(g) * 0.25); });
  // bedesten satışları
  g.buildings.forEach(function (b) {
    if (b.type !== 'bedesten' || !serviceActive(b)) return;
    var eff = b.workers / 4;
    ['kilim', 'comlek', 'pekmez', 'bal', 'elbise', 'peynir'].forEach(function (r) {
      var keep = 15, q = Math.min(Math.max(0, g.res[r] - keep), 0.4 * eff);
      if (q > 0) { g.res[r] -= q; g.res.akce += q * PRICES[r].sat * 1.3; }
    });
    g.res.akce += 2 * eff;
  });
}
function tradeAvailable(g) {
  if (built(g, 'kervansaray')) return 'kervansaray';
  if (g.peddler) return 'seyyar';
  return null;
}
function priceOf(g, k, buy) {
  var p = PRICES[k][buy ? 'al' : 'sat'];
  var mode = tradeAvailable(g);
  if (mode === 'seyyar') p = buy ? p * 1.5 : p * 0.6;
  var cv = g.caravan && g.caravan.state === 'burada' ? g.caravan : null;
  if (cv) { if (!buy && cv.talep === k) p *= 2; if (buy && cv.teklif === k) p *= 0.6; }
  if (mode === 'kervansaray' && tradePartners(g)) p = buy ? p * (1 - 0.04 * tradePartners(g)) : p * (1 + 0.05 * tradePartners(g));
  return Math.max(1, Math.round(p * 10) / 10);
}
function trade(g, k, qty) {
  if (!tradeAvailable(g)) return 'Tüccar yok';
  var caps = storageCaps(g);
  if (qty > 0) {
    var cost = Math.round(priceOf(g, k, true) * qty);
    if (g.res.akce < cost) return 'Akçe yetersiz';
    var kat = RES[k].kat;
    if (catTotal(g, kat) + qty > caps[kat]) return 'Depo dolu';
    g.res.akce -= cost; g.res[k] += qty;
  } else {
    var q = -qty;
    if (g.res[k] < q) return 'Yeterli mal yok';
    g.res[k] -= q; g.res.akce += Math.round(priceOf(g, k, false) * q);
  }
  return null;
}

// ---------- Kanunlar ve sur ----------
function lawSlots(g) { return LAW_SLOTS[g.titleIdx] + (built(g, 'kadi') ? 1 : 0); }
function enactLaw(g, id) {
  var L = LAWS.filter(function (l) { return l.id === id; })[0];
  if (hasLaw(g, id)) { g.laws.splice(g.laws.indexOf(id), 1); return null; }
  if (g.laws.length >= lawSlots(g)) return 'Kanun hakkı dolu (' + lawSlots(g) + ')';
  if (L.req && !built(g, L.req)) return BUILDINGS[L.req].ad + ' gerekli';
  if (g.res.nufuz < L.bedel) return 'Nüfuz yetersiz (' + L.bedel + ')';
  g.res.nufuz -= L.bedel; g.laws.push(id);
  chronicle(g, L.ad + ' kanunu ilan edildi.');
  return null;
}
var SUR_LEVELS = [
  null,
  { ad: 'Ahşap Palanka', cost: { odun: 150, akce: 60 } },
  { ad: 'Taş Sur', cost: { tas: 300, akce: 200, alet: 20 }, unlock: 2 },
  { ad: 'Kale', cost: { tas: 600, akce: 500, alet: 40, demir: 60 }, unlock: 3 }
];
function buildSur(g) {
  var n = SUR_LEVELS[g.sur + 1];
  if (!n) return 'En üst seviye';
  if (n.unlock && g.titleIdx < n.unlock) return TITLES[n.unlock].ad + ' olunca açılır';
  if (!canAfford(g, n.cost)) return 'Kaynak yetersiz';
  for (var k in n.cost) g.res[k] -= n.cost[k];
  g.sur++;
  chronicle(g, n.ad + ' inşa edildi.');
  return null;
}

function fmtCost(c) { var s = []; for (var k in c) s.push(RES[k].ikon + ' ' + c[k]); return s.join('  '); }

// ---------- Kayıt ----------
function serialize(g) {
  var o = {};
  for (var k in g) if (k !== 'occ' && k !== 'notify' && k !== 'terrainDirty') o[k] = g[k];
  return JSON.stringify(o);
}
function deserialize(str) {
  var g = JSON.parse(str);
  if (g.version !== 2) throw new Error('eski kayıt');
  g.notify = [];
  rebuildOcc(g);
  assignWorkers(g);
  return g;
}
