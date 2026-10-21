// Oyun durumu ve simülasyon
var START_YEAR = 1300;

function newGame(seed) {
  var g = {
    version: 1,
    seed: seed,
    map: generateMap(seed),
    res: { akce: 150, odun: 70, tas: 20, bugday: 0, un: 0, ekmek: 40, et: 25, yun: 0, kilim: 0 },
    buildings: [],
    nextId: 1,
    day: 0,
    dayFrac: 0,
    pop: 10,
    taxLevel: 1,
    mods: [],
    questIdx: 0,
    nextEventDay: 14,
    pendingEvent: null,
    raidRisk: 0,
    kuraklik: 0,
    happiness: 60,
    stats: { food: 0, foodNeed: 0, unemployed: 0, workers: 0, housing: 0, income: 0 },
    flags: {},
    notify: []
  };
  var c = MAP_N / 2;
  placeBuilding(g, 'konak', c - 1, c - 1, true);
  placeBuilding(g, 'ev', c + 2, c - 1, true);
  placeBuilding(g, 'ev', c + 2, c + 1, true);
  rebuildOcc(g);
  assignWorkers(g);
  return g;
}

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

function storageCap(g) {
  var cap = 200;
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n];
    if (b.progress >= 1 && BUILDINGS[b.type].storage) cap += BUILDINGS[b.type].storage;
  }
  return cap;
}

function countTreesNear(g, i, j, w, h, r) {
  var n = 0;
  for (var y = j - r; y < j + h + r; y++) for (var x = i - r; x < i + w + r; x++) {
    if (inMap(x, y) && g.map.trees[y * MAP_N + x]) n++;
  }
  return n;
}

function stoneNear(g, i, j, w, h, r) {
  for (var y = j - r; y < j + h + r; y++) for (var x = i - r; x < i + w + r; x++) {
    if (inMap(x, y) && g.map.tiles[y * MAP_N + x] === T_STONE) return true;
  }
  return false;
}

function avgFert(g, i, j, w, h) {
  var s = 0;
  for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) s += g.map.fert[(j + y) * MAP_N + i + x];
  return s / (w * h);
}

function canAfford(g, cost) {
  for (var k in cost) if ((g.res[k] || 0) < cost[k]) return false;
  return true;
}

function canPlace(g, type, i, j) {
  var d = BUILDINGS[type];
  for (var y = 0; y < d.h; y++) for (var x = 0; x < d.w; x++) {
    var tx = i + x, ty = j + y;
    if (!inMap(tx, ty)) return { ok: false, reason: 'Harita dışı' };
    var k = ty * MAP_N + tx;
    if (g.map.tiles[k] === T_WATER) return { ok: false, reason: 'Suya inşa edilemez' };
    if (g.map.tiles[k] === T_STONE) return { ok: false, reason: 'Kayalığa inşa edilemez' };
    if (g.occ[k]) return { ok: false, reason: 'Burası dolu' };
  }
  var info = '';
  if (d.need === 'orman') {
    var t = countTreesNear(g, i, j, d.w, d.h, 4);
    if (t < 3) return { ok: false, reason: 'Yakında orman yok' };
    info = 'Ağaç: ' + t + ' (verim %' + Math.round(Math.min(1, t / 10) * 100) + ')';
  }
  if (d.need === 'tas') {
    if (!stoneNear(g, i, j, d.w, d.h, 2)) return { ok: false, reason: 'Yakında kayalık yok' };
    info = 'Kayalık yakında';
  }
  if (d.farm) info = 'Toprak verimi %' + Math.round(avgFert(g, i, j, d.w, d.h) * 100);
  if (!canAfford(g, d.cost)) return { ok: false, reason: 'Kaynak yetersiz', info: info };
  return { ok: true, info: info };
}

function placeBuilding(g, type, i, j, free) {
  var d = BUILDINGS[type];
  if (!free) for (var k in d.cost) g.res[k] -= d.cost[k];
  var b = {
    id: g.nextId++, type: type, i: i, j: j,
    progress: d.build ? 0 : 1, workers: 0, paused: false,
    growth: 0, harvest: 0, residents: 0, happy: 50, status: '', factor: 1
  };
  // Ağaçları temizle
  for (var y = 0; y < d.h; y++) for (var x = 0; x < d.w; x++) g.map.trees[(j + y) * MAP_N + i + x] = 0;
  g.buildings.push(b);
  if (g.occ) for (var y2 = 0; y2 < d.h; y2++) for (var x2 = 0; x2 < d.w; x2++) g.occ[(j + y2) * MAP_N + i + x2] = b.id;
  if (free) b.progress = 1;
  g.terrainDirty = true;
  return b;
}

function demolish(g, b) {
  var d = BUILDINGS[b.type];
  if (b.type === 'konak') return false;
  for (var k in d.cost) g.res[k] += Math.floor(d.cost[k] * 0.5);
  g.buildings.splice(g.buildings.indexOf(b), 1);
  rebuildOcc(g);
  if (d.housing) {
    var cap = housingCap(g);
    if (g.pop > cap) g.pop = cap;
  }
  assignWorkers(g);
  return true;
}

function housingCap(g) {
  var c = 0;
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n];
    if (b.progress >= 1 && BUILDINGS[b.type].housing) c += BUILDINGS[b.type].housing;
  }
  return c;
}

function assignWorkers(g) {
  var labor = g.pop, used = 0;
  // Önce hizmet ve yiyecek binaları
  var order = g.buildings.slice().sort(function (a, b) { return priority(a) - priority(b) || a.id - b.id; });
  for (var n = 0; n < order.length; n++) {
    var b = order[n], d = BUILDINGS[b.type];
    b.workers = 0;
    if (!d.workers || b.progress < 1 || b.paused) continue;
    var w = Math.min(d.workers, labor - used);
    b.workers = w; used += w;
  }
  // Evlere sakin dağıt
  var left = g.pop;
  for (var m = 0; m < g.buildings.length; m++) {
    var h = g.buildings[m], hd = BUILDINGS[h.type];
    if (!hd.housing) continue;
    if (h.progress < 1) { h.residents = 0; continue; }
    h.residents = Math.min(hd.housing, left); left -= h.residents;
  }
  g.stats.workers = used;
  g.stats.unemployed = labor - used;
  g.stats.housing = housingCap(g);
}

function priority(b) {
  var t = b.type;
  if (t === 'avci' || t === 'tarla' || t === 'firin' || t === 'degirmen' || t === 'agil') return 0;
  if (t === 'oduncu') return 1;
  if (t === 'cami' || t === 'pazar' || t === 'hamam') return 2;
  return 3;
}

function season(g) { return Math.floor(g.day / SEASON_DAYS) % 4; }
function year(g) { return START_YEAR + Math.floor(g.day / (SEASON_DAYS * 4)); }
function dayOfSeason(g) { return (g.day % SEASON_DAYS) + 1; }

function modSum(g, key) {
  var s = 0;
  for (var n = 0; n < g.mods.length; n++) s += g.mods[n][key] || 0;
  return s;
}

function addRes(g, k, amt, cap) {
  if (k === 'akce') { g.res.akce += amt; return amt; }
  var room = Math.max(0, cap - g.res[k]);
  var add = Math.min(room, amt);
  g.res[k] += add;
  return add;
}

function centerOf(b) {
  var d = BUILDINGS[b.type];
  return { x: b.i + d.w / 2, y: b.j + d.h / 2 };
}

function serviceActive(b) {
  var d = BUILDINGS[b.type];
  if (b.progress < 1 || b.paused) return false;
  if (d.workers && b.workers === 0) return false;
  if (b.noInput) return false;
  return true;
}

function simDay(g) {
  var s = season(g);
  var cap = storageCap(g);
  var prodBonus = 1 + modSum(g, 'uretim');
  assignWorkers(g);

  // İnşaat
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n], d = BUILDINGS[b.type];
    if (b.progress < 1) {
      b.progress = Math.min(1, b.progress + 1 / d.build);
      b.status = 'İnşa ediliyor';
      if (b.progress >= 1) g.notify.push(d.ad + ' tamamlandı');
    }
  }
  assignWorkers(g);

  // Üretim
  for (var n2 = 0; n2 < g.buildings.length; n2++) {
    var b2 = g.buildings[n2], d2 = BUILDINGS[b2.type];
    b2.noInput = false;
    if (b2.progress < 1) continue;
    if (!d2.workers) { b2.status = d2.housing ? '' : 'Hizmette'; continue; }
    if (b2.paused) { b2.status = 'Durduruldu'; continue; }
    if (b2.workers === 0) { b2.status = 'İşçi yok'; continue; }
    var eff = b2.workers / d2.workers * prodBonus;

    if (d2.farm) {
      var fert = avgFert(g, b2.i, b2.j, d2.w, d2.h);
      if (s === 0 || s === 1) {
        b2.growth = Math.min(1, b2.growth + eff / (SEASON_DAYS * 2) * (1 - g.kuraklik));
        b2.status = s === 0 ? 'Ekim yapılıyor' : 'Ekin büyüyor';
      } else if (s === 2) {
        if (dayOfSeason(g) === 1 && b2.growth > 0) { b2.harvest = 48 * b2.growth * fert; b2.growth = 0; }
        if (b2.harvest > 0) {
          var amt = Math.min(b2.harvest, 12 * eff);
          b2.harvest -= amt;
          addRes(g, 'bugday', amt, cap);
          b2.status = 'Hasat';
        } else b2.status = 'Hasat bitti';
      } else { b2.status = 'Kış: tarla boş'; b2.growth = 0; b2.harvest = 0; }
      continue;
    }

    var factor = 1;
    if (d2.need === 'orman') factor = Math.min(1, countTreesNear(g, b2.i, b2.j, d2.w, d2.h, 4) / 10);
    if (b2.type === 'avci' && s === 3) factor *= 0.4;
    if (b2.type === 'agil' && s === 3) factor *= 0.5;
    b2.factor = factor;

    var ratio = 1, missing = null;
    if (d2.input) {
      for (var k in d2.input) {
        var needAmt = d2.input[k] * eff;
        var r = needAmt > 0 ? g.res[k] / needAmt : 1;
        if (r < ratio) { ratio = r; missing = k; }
      }
      ratio = Math.max(0, Math.min(1, ratio));
    }
    if (ratio <= 0.01) {
      b2.status = 'Hammadde yok (' + RES[missing].ad + ')';
      b2.noInput = true;
      continue;
    }
    if (d2.input) for (var k2 in d2.input) g.res[k2] = Math.max(0, g.res[k2] - d2.input[k2] * eff * ratio);
    var full = true;
    if (d2.prod) {
      for (var k3 in d2.prod) {
        var got = addRes(g, k3, d2.prod[k3] * eff * ratio * factor, cap);
        if (got > 0.001 || k3 === 'akce') full = false;
      }
    } else full = false;
    b2.status = full ? 'Depo dolu' : (ratio < 1 ? 'Az hammadde' : 'Çalışıyor');
  }

  // Yiyecek tüketimi
  var need = g.pop * 0.07;
  var avail = 0;
  for (var f = 0; f < FOODS.length; f++) avail += g.res[FOODS[f]];
  var variety = 0;
  for (var f2 = 0; f2 < FOODS.length; f2++) if (g.res[FOODS[f2]] >= 1) variety++;
  var hungry = avail < need;
  if (avail > 0) {
    var take = Math.min(need, avail);
    for (var f3 = 0; f3 < FOODS.length; f3++) {
      var fk = FOODS[f3];
      g.res[fk] = Math.max(0, g.res[fk] - take * (g.res[fk] / avail));
    }
  }
  g.stats.foodNeed = need;

  // Isınma
  var houses = 0;
  for (var h = 0; h < g.buildings.length; h++) if (BUILDINGS[g.buildings[h].type].housing && g.buildings[h].residents > 0) houses++;
  var heat = houses * (s === 3 ? 0.15 : s === 2 ? 0.05 : 0);
  var cold = false;
  if (heat > 0) {
    if (g.res.odun >= heat) g.res.odun -= heat;
    else { g.res.odun = 0; cold = s === 3; }
  }

  // Vergi
  var income = g.pop * TAX[g.taxLevel].gelir;
  g.res.akce += income;
  g.stats.income = income;

  computeHappiness(g, { hungry: hungry, variety: variety, cold: cold });

  // Nüfus değişimi
  var capH = housingCap(g);
  var hp = g.happiness;
  if (hungry && g.pop > 0 && Math.random() < 0.5) { g.pop--; g.notify.push('Açlıktan bir kişi göç etti'); }
  else if (hp >= 55 && g.pop < capH) {
    if (Math.random() < 0.35 + (hp - 55) / 80) g.pop += (hp > 75 && capH - g.pop > 1) ? 2 : 1;
  } else if (hp < 35 && g.pop > 0) {
    if (Math.random() < (35 - hp) / 60) { g.pop--; g.notify.push('Mutsuz bir aile göç etti'); }
  }
  if (g.pop > capH) g.pop = capH;

  // Değiştiriciler
  for (var m = g.mods.length - 1; m >= 0; m--) if (--g.mods[m].gun <= 0) g.mods.splice(m, 1);

  // Görev
  var q = QUESTS[g.questIdx];
  if (q && q.check(g)) {
    for (var rk in q.odul) g.res[rk] += q.odul[rk];
    g.notify.push('✅ Görev tamam: ' + q.ad + ' — Ödül: ' + fmtCost(q.odul));
    g.questIdx++;
  }

  // Yeni gün
  g.day++;
  var ns = season(g);
  if (ns !== s) {
    g.notify.push(SEASON_ICON[ns] + ' ' + SEASONS[ns] + ' geldi');
    if (ns === 0) g.kuraklik = 0;
    if (ns === 3 && g.res.odun < houses * 0.15 * SEASON_DAYS) g.notify.push('⚠️ Kış için odun az!');
    g.autosave = true;
  }

  // Akıncı baskını riski
  if (g.raidRisk > 0 && Math.random() < 0.08) {
    if (Math.random() < g.raidRisk) {
      for (var rr in g.res) if (rr !== 'akce') g.res[rr] = Math.floor(g.res[rr] * 0.75);
      g.res.akce = Math.floor(g.res.akce * 0.8);
      g.mods.push({ ad: 'Akıncı baskını', mutluluk: -10, gun: 15 });
      g.notify.push('⚔️ Komşu beyin akıncıları baskın yaptı! Kaynakların bir kısmı yağmalandı.');
    } else g.notify.push('Komşu bey tehdidini unuttu.');
    g.raidRisk = 0;
  }

  // Divan olayı
  if (!g.pendingEvent && g.day >= g.nextEventDay) {
    var pool = EVENTS.filter(function (e) { return !e.mevsim || e.mevsim.indexOf(ns) >= 0; });
    var ev = pool[Math.floor(Math.random() * pool.length)];
    g.pendingEvent = ev.id;
    g.nextEventDay = g.day + 16 + Math.floor(Math.random() * 18);
  }
}

function computeHappiness(g, ctx) {
  var houses = [], services = [];
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n], d = BUILDINGS[b.type];
    if (d.housing) houses.push(b);
    else if (d.service && serviceActive(b)) services.push(b);
  }
  var tax = TAX[g.taxLevel].mutluluk;
  var modH = modSum(g, 'mutluluk');
  var total = 0, people = 0;
  for (var h = 0; h < houses.length; h++) {
    var hb = houses[h], c = centerOf(hb);
    var have = {};
    for (var s2 = 0; s2 < services.length; s2++) {
      var sv = services[s2], sd = BUILDINGS[sv.type], sc = centerOf(sv);
      if (Math.hypot(sc.x - c.x, sc.y - c.y) <= sd.radius) have[sd.service] = true;
    }
    var parts = [['Temel', 40]];
    if (ctx.hungry) parts.push(['Açlık', -40]);
    else if (ctx.variety >= 2) parts.push(['Yiyecek çeşidi', 10]);
    parts.push(have.su ? ['Çeşme', 10] : ['Su yok', -5]);
    if (have.pazar) parts.push(['Pazar', 8]);
    if (have.cami) parts.push(['Cami', 12]);
    if (have.hamam) parts.push(['Hamam', 8]);
    if (ctx.cold) parts.push(['Soğuk', -25]);
    if (tax) parts.push(['Vergi', tax]);
    if (modH) parts.push(['Olaylar', modH]);
    var v = 0;
    for (var p = 0; p < parts.length; p++) v += parts[p][1];
    hb.happy = Math.max(0, Math.min(100, v));
    hb.parts = parts;
    total += hb.happy * hb.residents; people += hb.residents;
  }
  g.happiness = people ? Math.round(total / people) : 50;
}

function applyEventChoice(g, opt) {
  var e = opt.etki;
  if (e.res) for (var k in e.res) g.res[k] = Math.max(0, g.res[k] + e.res[k]);
  if (e.mod) g.mods.push({ ad: e.mod.ad, mutluluk: e.mod.mutluluk || 0, uretim: e.mod.uretim || 0, gun: e.mod.gun });
  if (e.pop) {
    var room = housingCap(g) - g.pop;
    var add = Math.max(0, Math.min(e.pop, room));
    g.pop += add;
    if (add < e.pop) g.notify.push((e.pop - add) + ' kişi ev bulamadığı için gitti');
  }
  if (e.kayip) for (var r in g.res) if (r !== 'akce') g.res[r] = Math.floor(g.res[r] * (1 - e.kayip));
  if (e.kuraklik) g.kuraklik = e.kuraklik;
  if (e.risk) g.raidRisk = e.risk;
  g.pendingEvent = null;
  assignWorkers(g);
}

function hasTrade(g) {
  for (var n = 0; n < g.buildings.length; n++) {
    var b = g.buildings[n];
    if (b.type === 'kervansaray' && b.progress >= 1) return true;
  }
  return false;
}

function trade(g, k, qty) {
  var p = PRICES[k];
  if (qty > 0) {
    var cost = p.al * qty;
    if (g.res.akce < cost) return 'Akçe yetersiz';
    if (g.res[k] + qty > storageCap(g)) return 'Depo dolu';
    g.res.akce -= cost; g.res[k] += qty;
  } else {
    var q = -qty;
    if (g.res[k] < q) return 'Yeterli mal yok';
    g.res[k] -= q; g.res.akce += p.sat * q;
  }
  return null;
}

function fmtCost(c) {
  var s = [];
  for (var k in c) s.push(RES[k].ikon + ' ' + c[k]);
  return s.join('  ');
}

// Kayıt
function serialize(g) {
  var o = {};
  for (var k in g) if (k !== 'occ' && k !== 'notify' && k !== 'terrainDirty') o[k] = g[k];
  return JSON.stringify(o);
}
function deserialize(str) {
  var g = JSON.parse(str);
  g.notify = [];
  rebuildOcc(g);
  assignWorkers(g);
  return g;
}
