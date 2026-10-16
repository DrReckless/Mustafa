import { MAP_W, MAP_H, PLAYER_HQ, RIVALS } from '../config.js';
import { mulberry32, makeNoise } from '../util.js';

export const T_GRASS = 0, T_DIRT = 1, T_SAND = 2, T_WATER = 3, T_ROCK = 4;
export const ORE_TYPES = [null, 'iron_ore', 'copper_ore', 'coal', 'stone', 'quartz'];

export class World {
  constructor(seed = 1337) {
    this.seed = seed;
    this.w = MAP_W; this.h = MAP_H;
    const n = this.w * this.h;
    this.terrain = new Uint8Array(n);
    this.ore = new Uint8Array(n);
    this.purity = new Uint8Array(n);
    this.tree = new Uint8Array(n);
    this.generate();
  }
  idx(x, y) { return y * this.w + x; }
  inside(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }
  passable(x, y) {
    if (!this.inside(x, y)) return false;
    const t = this.terrain[this.idx(x, y)];
    return t !== T_WATER && t !== T_ROCK;
  }
  buildable(x, y) { return this.passable(x, y); }
  oreAt(x, y) { return this.inside(x, y) ? ORE_TYPES[this.ore[this.idx(x, y)]] : null; }

  generate() {
    const rnd = mulberry32(this.seed);
    const noise = makeNoise(this.seed * 7 + 3);
    const W = this.w, H = this.h;
    const bases = [PLAYER_HQ, ...RIVALS];
    const nearBase = (x, y, r) => bases.some((b) => Math.hypot(b.x + 1 - x, b.y + 1 - y) < r);

    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const m = noise.fbm(x * 0.06, y * 0.06, 4);
      this.terrain[this.idx(x, y)] = m > 0.58 ? T_DIRT : T_GRASS;
    }
    const blob = (cx, cy, r, fn) => {
      for (let y = Math.floor(cy - r - 2); y <= cy + r + 2; y++) for (let x = Math.floor(cx - r - 2); x <= cx + r + 2; x++) {
        if (!this.inside(x, y)) continue;
        const d = Math.hypot(x - cx, y - cy) + (noise.n2(x * 0.5, y * 0.5) - 0.5) * 2.2;
        fn(x, y, d);
      }
    };
    // göller
    let lakes = 0, guard = 0;
    while (lakes < 5 && guard++ < 200) {
      const cx = 6 + rnd() * (W - 12), cy = 4 + rnd() * (H - 8);
      const r = 2.5 + rnd() * 3.5;
      if (nearBase(cx, cy, r + 9)) continue;
      blob(cx, cy, r, (x, y, d) => {
        const i = this.idx(x, y);
        if (d < r) this.terrain[i] = T_WATER;
        else if (d < r + 1.4 && this.terrain[i] !== T_WATER) this.terrain[i] = T_SAND;
      });
      lakes++;
    }
    // kaya çıkıntıları
    let rocks = 0; guard = 0;
    while (rocks < 7 && guard++ < 200) {
      const cx = 4 + rnd() * (W - 8), cy = 3 + rnd() * (H - 6);
      const r = 1.2 + rnd() * 2.2;
      if (nearBase(cx, cy, r + 7)) continue;
      blob(cx, cy, r, (x, y, d) => { if (d < r) this.terrain[this.idx(x, y)] = T_ROCK; });
      rocks++;
    }
    // harita kenarı: kayalık sınır
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const e = Math.min(x, y, W - 1 - x, H - 1 - y);
      if (e === 0 && noise.n2(x * 0.7, y * 0.7) > 0.55) this.terrain[this.idx(x, y)] = T_ROCK;
    }

    // cevher yatakları
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
        if (this.terrain[i] === T_GRASS) this.terrain[i] = T_DIRT;
        placed++;
        open.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    };
    const P = PLAYER_HQ;
    // yakındaki garantili yataklar
    const clearAround = (cx, cy, r) => blob(cx, cy, r, (x, y, d) => {
      if (d < r) { const i = this.idx(x, y); if (this.terrain[i] >= T_WATER) this.terrain[i] = T_DIRT; }
    });
    const guaranteed = [
      ['iron_ore', P.x + 6, P.y - 5, 10], ['copper_ore', P.x + 6, P.y + 6, 8],
      ['coal', P.x - 4, P.y + 6, 8], ['stone', P.x - 4, P.y - 5, 8],
      ['quartz', P.x + 17, P.y + 10, 6], ['iron_ore', P.x + 15, P.y - 10, 9],
      ['coal', P.x + 19, P.y, 7], ['copper_ore', P.x + 22, P.y - 4, 7],
    ];
    for (const [t, x, y, c] of guaranteed) { clearAround(x, y, 3.5); patch(t, x, y, c); }
    for (const r of RIVALS) {
      clearAround(r.x - 6, r.y + 2, 3); patch('iron_ore', r.x - 6, r.y + 2, 6);
      clearAround(r.x + 1, r.y - 6 + (r.y > 30 ? 12 : 0), 3); patch('coal', r.x + 1, r.y - 6 + (r.y > 30 ? 12 : 0), 5);
    }
    const types = ['iron_ore', 'copper_ore', 'coal', 'stone', 'quartz', 'iron_ore', 'copper_ore', 'stone'];
    for (let i = 0; i < 16; i++) {
      const x = Math.floor(22 + rnd() * 40), y = Math.floor(3 + rnd() * (H - 6));
      if (nearBase(x, y, 8)) continue;
      patch(types[i % types.length], x, y, 5 + Math.floor(rnd() * 6));
    }
    // üs alanlarını temizle
    for (const b of bases) blob(b.x + 1, b.y + 1, 4.5, (x, y, d) => {
      if (d < 4.5) { const i = this.idx(x, y); this.terrain[i] = T_DIRT; this.ore[i] = 0; }
    });
    // ağaçlar
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = this.idx(x, y);
      if (this.terrain[i] !== T_GRASS || this.ore[i]) continue;
      if (nearBase(x, y, 7)) continue;
      const f = noise.fbm(x * 0.09 + 40, y * 0.09 + 40, 3);
      if (f > 0.56 && rnd() < (f - 0.5) * 3.2) this.tree[i] = 1 + Math.floor(rnd() * 3);
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
        if (this.terrain[i] >= T_WATER) this.terrain[i] = T_SAND;
      }
    }
  }
}
