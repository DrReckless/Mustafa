import { MAP_W, MAP_H, PLAYER_HQ, RIVALS } from '../config.js';
import { mulberry32, makeNoise } from '../util.js';

// zemin türleri
export const T_GRASS = 0, T_DIRT = 1, T_SAND = 2, T_WATER = 3, T_ROCK = 4, T_ASH = 5, T_SNOW = 6, T_RED = 7, T_LAVA = 8;
export const isBlocked = (t) => t === T_WATER || t === T_ROCK || t === T_LAVA;
export const ORE_TYPES = [null, 'iron_ore', 'copper_ore', 'coal', 'stone', 'quartz', 'bauxite', 'sulfur', 'uranium_ore', 'oil'];
// biyomlar
export const B_TEMPERATE = 0, B_DESERT = 1, B_TUNDRA = 2, B_VOLCANIC = 3;
export const BIOME_NAMES = ['Ilıman', 'Çöl', 'Tundra', 'Volkanik'];
// ağaç türleri
export const TK_PINE = 0, TK_BROAD = 1, TK_PALM = 2, TK_CACTUS = 3, TK_DEAD = 4, TK_SNOWPINE = 5;

const PRESET_BIOME = { temperate: B_TEMPERATE, desert: B_DESERT, tundra: B_TUNDRA, volcanic: B_VOLCANIC };
// biyoma göre tercih edilen cevherler (rastgele yataklar için)
const BIOME_ORES = [
  ['iron_ore', 'copper_ore', 'coal', 'stone', 'quartz', 'iron_ore', 'copper_ore'],
  ['bauxite', 'oil', 'iron_ore', 'stone', 'copper_ore', 'bauxite', 'quartz'],
  ['uranium_ore', 'quartz', 'iron_ore', 'coal', 'stone', 'copper_ore', 'quartz'],
  ['sulfur', 'coal', 'iron_ore', 'copper_ore', 'sulfur', 'stone', 'uranium_ore'],
];
const ADV_ORES = [['bauxite', B_DESERT], ['oil', B_DESERT], ['sulfur', B_VOLCANIC], ['uranium_ore', B_TUNDRA]];

export class World {
  constructor(seed = 1337, preset = 'mixed') {
    this.seed = seed;
    this.preset = PRESET_BIOME[preset] !== undefined || preset === 'mixed' ? preset : 'mixed';
    this.w = MAP_W; this.h = MAP_H;
    const n = this.w * this.h;
    this.terrain = new Uint8Array(n);
    this.ore = new Uint8Array(n);
    this.purity = new Uint8Array(n);
    this.tree = new Uint8Array(n);
    this.treeKind = new Uint8Array(n);
    this.biome = new Uint8Array(n);
    this.generate();
  }
  idx(x, y) { return y * this.w + x; }
  inside(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }
  passable(x, y) {
    if (!this.inside(x, y)) return false;
    return !isBlocked(this.terrain[this.idx(x, y)]);
  }
  buildable(x, y) { return this.passable(x, y); }
  oreAt(x, y) { return this.inside(x, y) ? ORE_TYPES[this.ore[this.idx(x, y)]] : null; }
  biomeAt(x, y) {
    x = Math.max(0, Math.min(this.w - 1, Math.round(x))); y = Math.max(0, Math.min(this.h - 1, Math.round(y)));
    return this.biome[this.idx(x, y)];
  }

  generate() {
    const rnd = mulberry32(this.seed);
    const noise = makeNoise(this.seed * 7 + 3);
    const bn = makeNoise(this.seed * 13 + 11);
    const W = this.w, H = this.h;
    const P = PLAYER_HQ;
    const bases = [P, ...RIVALS];
    const nearBase = (x, y, r) => bases.some((b) => Math.hypot(b.x + 1 - x, b.y + 1 - y) < r);

    // ---- biyom haritası ----
    const fixed = PRESET_BIOME[this.preset];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let b;
      if (fixed !== undefined) b = fixed;
      else {
        // karma: başlangıç bölgesi ılıman, doğuya doğru farklı bölgeler
        const wx = x + (bn.fbm(x * 0.05, y * 0.05, 3) - 0.5) * 14;
        const wy = y + (bn.fbm(x * 0.05 + 30, y * 0.05 + 30, 3) - 0.5) * 14;
        const dHome = Math.hypot(wx - P.x, (wy - P.y) * 1.2);
        const tun = bn.fbm(wx * 0.035 + 5, wy * 0.035, 3) + (1 - wy / H) * 0.75;
        const des = bn.fbm(wx * 0.035 + 50, wy * 0.035 + 20, 3) + (wy / H) * 0.7;
        const vol = bn.fbm(wx * 0.035 + 90, wy * 0.035 + 70, 3) + (wx / W) * 0.5 + Math.max(0, 1 - Math.abs(wy / H - 0.5) * 2.5) * 0.3;
        const tmp = 0.93 + Math.max(0, 1 - dHome / 25) * 2;
        const s = [tmp, des, tun, vol];
        b = 0; for (let k = 1; k < 4; k++) if (s[k] > s[b]) b = k;
      }
      this.biome[this.idx(x, y)] = b;
    }

    // ---- temel zemin ----
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = this.idx(x, y);
      const m = noise.fbm(x * 0.06, y * 0.06, 4);
      const m2 = noise.fbm(x * 0.09 + 17, y * 0.09 + 41, 3);
      let t;
      switch (this.biome[i]) {
        case B_DESERT: t = m2 > 0.56 ? T_RED : m > 0.62 ? T_DIRT : T_SAND; break;
        case B_TUNDRA: t = m > 0.6 ? T_DIRT : m2 < 0.36 ? T_GRASS : T_SNOW; break;
        case B_VOLCANIC: t = m > 0.6 ? T_DIRT : T_ASH; break;
        default: t = m > 0.58 ? T_DIRT : T_GRASS;
      }
      this.terrain[i] = t;
    }
    const blob = (cx, cy, r, fn) => {
      for (let y = Math.floor(cy - r - 2); y <= cy + r + 2; y++) for (let x = Math.floor(cx - r - 2); x <= cx + r + 2; x++) {
        if (!this.inside(x, y)) continue;
        const d = Math.hypot(x - cx, y - cy) + (noise.n2(x * 0.5, y * 0.5) - 0.5) * 2.2;
        fn(x, y, d);
      }
    };

    // ---- göller / vahalar / lav gölleri ----
    let lakes = 0, guard = 0;
    const lakeCount = { temperate: 7, desert: 4, tundra: 7, volcanic: 6, mixed: 8 }[this.preset];
    while (lakes < lakeCount && guard++ < 300) {
      const cx = 6 + rnd() * (W - 12), cy = 4 + rnd() * (H - 8);
      const bio = this.biomeAt(cx, cy);
      let r = 2.5 + rnd() * 3.5;
      if (bio === B_DESERT) r = 1.8 + rnd() * 1.8;
      if (nearBase(cx, cy, r + 9)) continue;
      const lava = bio === B_VOLCANIC && rnd() < 0.75;
      blob(cx, cy, r, (x, y, d) => {
        const i = this.idx(x, y);
        if (d < r) this.terrain[i] = lava ? T_LAVA : T_WATER;
        else if (d < r + 1.4 && !isBlocked(this.terrain[i])) {
          if (lava) this.terrain[i] = T_ROCK === this.terrain[i] ? T_ROCK : T_ASH;
          else if (bio === B_DESERT) this.terrain[i] = T_GRASS;      // vaha kenarı
          else if (bio === B_TUNDRA) this.terrain[i] = T_DIRT;
          else this.terrain[i] = T_SAND;
        } else if (bio === B_DESERT && d < r + 3 && !isBlocked(this.terrain[i]) && rnd() < 0.5) this.terrain[i] = T_GRASS;
      });
      lakes++;
    }
    // ---- kaya çıkıntıları / mesalar ----
    let rocks = 0; guard = 0;
    const rockCount = { temperate: 9, desert: 13, tundra: 10, volcanic: 12, mixed: 11 }[this.preset];
    while (rocks < rockCount && guard++ < 300) {
      const cx = 4 + rnd() * (W - 8), cy = 3 + rnd() * (H - 6);
      const bio = this.biomeAt(cx, cy);
      const r = (bio === B_DESERT ? 1.6 : 1.2) + rnd() * 2.4;
      if (nearBase(cx, cy, r + 7)) continue;
      blob(cx, cy, r, (x, y, d) => { if (d < r) this.terrain[this.idx(x, y)] = T_ROCK; });
      rocks++;
    }
    // harita kenarı: kayalık sınır
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const e = Math.min(x, y, W - 1 - x, H - 1 - y);
      if (e === 0 && noise.n2(x * 0.7, y * 0.7) > 0.55) this.terrain[this.idx(x, y)] = T_ROCK;
    }

    // ---- cevher yatakları ----
    const patch = (type, cx, cy, count) => {
      const id = ORE_TYPES.indexOf(type);
      const open = [[cx, cy]]; const seen = new Set(); let placed = 0;
      while (open.length && placed < count) {
        const k = Math.floor(rnd() * Math.min(open.length, 3));
        const [x, y] = open.splice(k, 1)[0];
        const key = x + ',' + y;
        if (seen.has(key)) continue; seen.add(key);
        if (!this.inside(x, y) || !this.passable(x, y)) continue;
        if (nearBase(x, y, 3.2)) continue;
        const i = this.idx(x, y);
        if (this.ore[i]) continue;
        this.ore[i] = id;
        const d = Math.hypot(x - cx, y - cy);
        this.purity[i] = d < 1.2 ? 2 : d < 2.4 ? 1 : (rnd() < 0.5 ? 0 : 1);
        if (this.terrain[i] === T_GRASS || this.terrain[i] === T_SNOW) this.terrain[i] = T_DIRT;
        placed++;
        if (type === 'oil') open.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1], [x + 2, y], [x, y + 2]);
        else open.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    };
    const clearAround = (cx, cy, r) => blob(cx, cy, r, (x, y, d) => {
      if (d < r) { const i = this.idx(x, y); if (isBlocked(this.terrain[i])) this.terrain[i] = T_DIRT; }
    });
    // başlangıç yakınındaki garantili yataklar
    const guaranteed = [
      ['iron_ore', P.x + 6, P.y - 5, 10], ['copper_ore', P.x + 6, P.y + 6, 8],
      ['coal', P.x - 4, P.y + 6, 8], ['stone', P.x - 4, P.y - 5, 8],
      ['quartz', P.x + 17, P.y + 10, 7], ['iron_ore', P.x + 15, P.y - 10, 9],
      ['coal', P.x + 19, P.y, 7], ['copper_ore', P.x + 22, P.y - 4, 7],
      ['stone', P.x + 4, P.y + 15, 6],
    ];
    for (const [t, x, y, c] of guaranteed) { clearAround(x, y, 3.5); patch(t, x, y, c); }
    // ileri kaynaklar: her birinden en az iki yatak, tercihen kendi biyomunda
    const pickSpot = (bio, minD, maxD) => {
      let fallback = null;
      for (let tries = 0; tries < 120; tries++) {
        const x = Math.floor(6 + rnd() * (W - 12)), y = Math.floor(5 + rnd() * (H - 10));
        const d = Math.hypot(x - P.x, y - P.y);
        if (d < minD || d > maxD || nearBase(x, y, 9)) continue;
        if (isBlocked(this.terrain[this.idx(x, y)])) continue;
        if (this.biome[this.idx(x, y)] === bio) return [x, y];
        if (!fallback) fallback = [x, y];
      }
      return fallback;
    };
    for (const [ore, bio] of ADV_ORES) {
      for (let k = 0; k < 3; k++) {
        const s = pickSpot(bio, k === 0 ? 20 : 26, k === 0 ? 40 : 90);
        if (!s) continue;
        clearAround(s[0], s[1], 2.5);
        patch(ore, s[0], s[1], ore === 'oil' ? 4 + Math.floor(rnd() * 3) : 6 + Math.floor(rnd() * 4));
      }
    }
    for (const r of RIVALS) {
      clearAround(r.x - 6, r.y + 2, 3); patch('iron_ore', r.x - 6, r.y + 2, 6);
      const cy = r.y - 6 + (r.y > 30 ? 12 : 0);
      if (cy > 2 && cy < H - 2) { clearAround(r.x + 1, cy, 3); patch('coal', r.x + 1, cy, 5); }
    }
    // rastgele yataklar (biyoma göre)
    for (let i = 0; i < 26; i++) {
      const x = Math.floor(26 + rnd() * (W - 30)), y = Math.floor(3 + rnd() * (H - 6));
      if (nearBase(x, y, 8)) continue;
      const list = BIOME_ORES[this.biome[this.idx(x, y)]];
      const t = list[Math.floor(rnd() * list.length)];
      patch(t, x, y, t === 'oil' ? 3 + Math.floor(rnd() * 3) : 5 + Math.floor(rnd() * 6));
    }
    // üs alanlarını temizle
    for (const b of bases) blob(b.x + 1, b.y + 1, 4.5, (x, y, d) => {
      if (d < 4.5) {
        const i = this.idx(x, y);
        const bio = this.biome[i];
        this.terrain[i] = bio === B_VOLCANIC ? T_ASH : bio === B_DESERT ? T_SAND : bio === B_TUNDRA ? T_SNOW : T_DIRT;
        this.ore[i] = 0;
      }
    });

    // ---- ağaçlar ----
    const waterNear = (x, y, r) => {
      for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) {
        if (this.inside(x + i, y + j) && this.terrain[this.idx(x + i, y + j)] === T_WATER) return true;
      }
      return false;
    };
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = this.idx(x, y);
      const t = this.terrain[i];
      if (isBlocked(t) || this.ore[i]) continue;
      if (nearBase(x, y, 7)) continue;
      const f = noise.fbm(x * 0.09 + 40, y * 0.09 + 40, 3);
      const bio = this.biome[i];
      let n = 0, kind = TK_PINE;
      if (bio === B_TEMPERATE) {
        if (t === T_GRASS && f > 0.56 && rnd() < (f - 0.5) * 3.2) n = 1 + Math.floor(rnd() * 3);
        kind = noise.n2(x * 0.11 + 7, y * 0.11 + 3) > 0.5 ? TK_BROAD : TK_PINE;
      } else if (bio === B_TUNDRA) {
        if ((t === T_SNOW || t === T_GRASS) && f > 0.55 && rnd() < (f - 0.5) * 2.8) n = 1 + Math.floor(rnd() * 3);
        kind = TK_SNOWPINE;
      } else if (bio === B_DESERT) {
        if (t === T_GRASS && waterNear(x, y, 3) && rnd() < 0.45) { n = 1 + Math.floor(rnd() * 2); kind = TK_PALM; }
        else if ((t === T_SAND || t === T_RED) && rnd() < 0.035) { n = 1; kind = TK_CACTUS; }
      } else if (bio === B_VOLCANIC) {
        if ((t === T_ASH || t === T_DIRT) && f > 0.52 && rnd() < 0.09) { n = 1 + Math.floor(rnd() * 2); kind = TK_DEAD; }
      }
      if (n) { this.tree[i] = n; this.treeKind[i] = kind; }
    }
    this.ensureConnectivity();
  }

  ensureConnectivity() {
    const W = this.w;
    const reach = new Uint8Array(W * this.h);
    const q = [this.idx(PLAYER_HQ.x, PLAYER_HQ.y)]; reach[q[0]] = 1;
    while (q.length) {
      const i = q.pop(); const x = i % W, y = (i / W) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (!this.passable(nx, ny)) continue;
        const j = this.idx(nx, ny);
        if (!reach[j]) { reach[j] = 1; q.push(j); }
      }
    }
    for (const r of RIVALS) {
      if (reach[this.idx(r.x, r.y)]) continue;
      // düz bir koridor aç
      let x = PLAYER_HQ.x, y = PLAYER_HQ.y;
      while (x !== r.x || y !== r.y) {
        if (x !== r.x) x += Math.sign(r.x - x); else y += Math.sign(r.y - y);
        const i = this.idx(x, y);
        if (isBlocked(this.terrain[i])) this.terrain[i] = this.biome[i] === B_VOLCANIC ? T_ASH : T_SAND;
      }
    }
  }
}
