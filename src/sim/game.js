import {
  MAP_W, MAP_H, DX, DY, ITEMS, RECIPES, BUILDINGS, UNITS, TECH, START_UNLOCKED, START_STOCK,
  RIVALS, PLAYER_HQ, DAY_LENGTH, PURITY,
} from '../config.js';
import { World, ORE_TYPES } from './world.js';
import { MinHeap, mulberry32 } from '../util.js';

const BELT_SPEED = 1.8;     // karo/sn
const BELT_GAP = 0.34;
const MINER_TIME = 2.2;
const MAX_UNITS = 40;
const HQ_GUN = { range: 7, dmg: 7, rate: 0.3 };

const OBJECTIVES = [
  { id: 'miner', text: 'Demir cevheri yatağına bir Maden Matkabı kur', reward: { iron_ingot: 20 } },
  { id: 'smelt', text: 'Matkabın önünden Eritme Fırınına konveyör çek', reward: { brick: 15 } },
  { id: 'iron20', text: 'Ana Üs\'e 20 Demir Külçe teslim et (fırından üsse konveyör)', reward: { iron_ingot: 30, copper_ingot: 20 } },
  { id: 'brick10', text: 'Taş yatağından Beton Blok üret ve 10 tane teslim et', reward: { iron_ingot: 25 } },
  { id: 'gen', text: 'Kömür yatağından beslenen bir Kömür Jeneratörü çalıştır', reward: { copper_ingot: 30 } },
  { id: 'turrets', text: 'Üssünü korumak için 3 Makineli Taret kur', reward: { ammo: 150 } },
  { id: 'otomasyon', text: 'Araştırma: Otomasyon', reward: { iron_ingot: 40 } },
  { id: 'metalurji', text: 'Araştırma: Metalurji', reward: { brick: 60 } },
  { id: 'elektronik', text: 'Araştırma: İleri Elektronik', reward: { steel: 20 } },
  { id: 'army', text: 'Araç Fabrikası kur ve 5 birimlik ordu topla', reward: { circuit: 10 } },
  { id: 'rival1', text: 'Bir rakip üssü yok et', reward: { steel: 50, circuit: 20 } },
  { id: 'rival2', text: 'Tüm rakipleri yok ederek bölgeyi fethet', reward: {} },
];

export class Game {
  constructor(opts = {}) {
    this.seed = opts.seed ?? Math.floor(Math.random() * 1e9);
    this.world = new World(this.seed);
    this.grid = new Int32Array(MAP_W * MAP_H);
    this.buildings = new Map();
    this.units = [];
    this.projectiles = [];
    this.nextId = 1;
    this.stock = {};
    for (const k of Object.keys(ITEMS)) this.stock[k] = 0;
    Object.assign(this.stock, START_STOCK);
    this.delivered = {};
    this.unlocked = new Set(START_UNLOCKED);
    this.unitUnlocked = new Set(['mech']);
    this.researched = new Set();
    this.time = DAY_LENGTH * 0.12;
    this.speed = 1;
    this.power = { supply: 0, demand: 0, ratio: 1, base: 0 };
    this.wave = { n: 0, next: DAY_LENGTH * 1.53, warned: false };
    this.rivals = RIVALS.map((r) => ({ ...r, alive: true, hq: 0, turrets: 0 }));
    this.objective = 0;
    this.state = 'play'; // play | won | lost
    this.listeners = {};
    this.fieldDirty = true; this.fieldTimer = 0;
    this.fields = {};
    this.rnd = mulberry32(this.seed ^ 0x5f3759df);
    this.acc = 0;
    this.stats = { kills: 0, lost: 0, gensBurned: 0 };
  }

  on(ev, fn) { (this.listeners[ev] ||= []).push(fn); }
  emit(ev, ...a) { const l = this.listeners[ev]; if (l) for (const f of l) f(...a); }

  // ---------- kurulum ----------
  setupNew() {
    this.placeBuilding('hq', PLAYER_HQ.x, PLAYER_HQ.y, 0, 0, true);
    for (const r of this.rivals) this.buildRivalBase(r);
  }

  buildRivalBase(r) {
    const hq = this.placeBuilding('hq', r.x, r.y, 0, r.id, true);
    hq.maxHp = hq.hp = 6000;
    r.hq = hq.id;
    const ring = [[-2, -1], [4, 3], [-2, 3], [4, -1]];
    ring.forEach(([dx, dy], i) => {
      this.placeBuilding(i % 2 === 0 ? 'turret_mg' : 'turret_cannon', r.x + dx, r.y + dy, 2, r.id, true);
      r.turrets++;
    });
    // yarım duvar halkası (oyuncuya bakan taraf)
    for (let dy = -3; dy <= 5; dy++) {
      if (dy === 1) continue;
      this.placeBuilding('wall', r.x - 4, r.y + dy, 0, r.id, true);
    }
  }

  rivalGrow(r) {
    if (!r.alive || r.turrets > 14) return;
    for (let tries = 0; tries < 30; tries++) {
      const a = this.rnd() * Math.PI * 2, d = 3.5 + this.rnd() * 3.5;
      const x = Math.round(r.x + 1 + Math.cos(a) * d), y = Math.round(r.y + 1 + Math.sin(a) * d);
      const type = this.wave.n > 4 && this.rnd() < 0.35 ? 'turret_laser' : this.rnd() < 0.5 ? 'turret_cannon' : 'turret_mg';
      if (this.canPlace(type, x, y, true).ok) {
        this.placeBuilding(type, x, y, 2, r.id, true); r.turrets++; return;
      }
    }
  }

  // ---------- yerleştirme ----------
  footprint(type, x, y) {
    const s = BUILDINGS[type].size; const out = [];
    for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) out.push([x + i, y + j]);
    return out;
  }
  canPlace(type, x, y, free = false) {
    const def = BUILDINGS[type];
    if (!free && !this.unlocked.has(type)) return { ok: false, why: 'Kilitli' };
    for (const [tx, ty] of this.footprint(type, x, y)) {
      if (!this.world.inside(tx, ty)) return { ok: false, why: 'Harita dışı' };
      if (!this.world.buildable(tx, ty)) return { ok: false, why: 'Bu zemine inşa edilemez' };
      if (this.grid[ty * MAP_W + tx]) return { ok: false, why: 'Alan dolu' };
    }
    if (type === 'miner' && !this.world.oreAt(x, y)) return { ok: false, why: 'Cevher yatağı gerekli' };
    if (!free && !this.canAfford(def.cost)) return { ok: false, why: 'Yetersiz malzeme' };
    return { ok: true };
  }
  canAfford(cost, mul = 1) {
    for (const k in cost) if ((this.stock[k] || 0) < cost[k] * mul) return false;
    return true;
  }
  pay(cost, mul = 1) { for (const k in cost) this.stock[k] -= cost[k] * mul; }

  placeBuilding(type, x, y, dir, faction = 0, free = false) {
    const def = BUILDINGS[type];
    const chk = this.canPlace(type, x, y, free);
    if (!chk.ok) return null;
    if (!free) this.pay(def.cost);
    const b = {
      id: this.nextId++, type, x, y, dir, size: def.size, faction,
      hp: def.hp, maxHp: def.hp, born: this.time,
    };
    this.initBuilding(b);
    this.addBuildingObj(b);
    return b;
  }
  initBuilding(b) {
    switch (b.type) {
      case 'belt': b.items = []; break;
      case 'miner': {
        const i = b.y * MAP_W + b.x;
        b.ore = ORE_TYPES[this.world.ore[i]]; b.purity = this.world.purity[i];
        b.outBuf = []; b.progress = 0; break;
      }
      case 'smelter': case 'assembler': case 'foundry':
        b.recipe = b.recipe ?? (b.type === 'assembler' ? 'gear' : b.type === 'foundry' ? 'steel' : null);
        b.inBuf = b.inBuf ?? {}; b.outBuf = b.outBuf ?? []; b.progress = b.progress ?? 0; break;
      case 'generator': b.fuel = b.fuel ?? 0; b.burn = b.burn ?? 0; break;
      case 'splitter': b.hold = null; b.rr = 0; break;
      case 'factory': b.queue = b.queue ?? []; b.progress = b.progress ?? 0; break;
      case 'turret_mg': case 'turret_cannon': case 'turret_laser':
        b.yaw = (b.yaw ?? -b.dir * Math.PI / 2); b.cd = 0; b.target = null; b.retarget = 0; break;
    }
    b.working = false;
  }
  addBuildingObj(b) {
    for (const [tx, ty] of this.footprint(b.type, b.x, b.y)) {
      const i = ty * MAP_W + tx;
      this.grid[i] = b.id;
      if (this.world.tree[i]) { this.world.tree[i] = 0; this.emit('treeRemoved', tx, ty); }
    }
    this.buildings.set(b.id, b);
    this.fieldDirty = true;
    this.emit('add', b);
  }
  removeBuilding(b, destroyed = false) {
    if (!this.buildings.has(b.id)) return;
    for (const [tx, ty] of this.footprint(b.type, b.x, b.y)) this.grid[ty * MAP_W + tx] = 0;
    this.buildings.delete(b.id);
    this.fieldDirty = true;
    this.emit('remove', b, destroyed);
  }
  demolish(b) {
    if (b.type === 'hq' || b.faction !== 0) return false;
    const cost = BUILDINGS[b.type].cost;
    for (const k in cost) this.stock[k] += Math.floor(cost[k] * 0.6);
    if (b.items) for (const it of b.items) this.stock[it.t]++;
    if (b.outBuf) for (const t of b.outBuf) this.stock[t]++;
    if (b.inBuf) for (const k in b.inBuf) this.stock[k] += b.inBuf[k];
    this.removeBuilding(b);
    return true;
  }
  rotate(b) {
    if (b.faction !== 0 || b.size > 1 || b.type === 'hq') return;
    b.dir = (b.dir + 1) % 4;
    if (b.type.startsWith('turret')) b.yaw = -b.dir * Math.PI / 2;
    this.emit('update', b);
  }
  at(x, y) {
    if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return null;
    const id = this.grid[y * MAP_W + x];
    return id ? this.buildings.get(id) : null;
  }

  // ---------- araştırma ----------
  research(id) {
    const t = TECH.find((q) => q.id === id);
    if (!t || this.researched.has(id)) return false;
    if (t.req && !this.researched.has(t.req)) return false;
    if (!this.canAfford(t.cost)) return false;
    this.pay(t.cost);
    this.researched.add(id);
    for (const u of t.unlocks) this.unlocked.add(u);
    if (t.units) for (const u of t.units) this.unitUnlocked.add(u);
    this.emit('message', `Araştırma tamamlandı: ${t.name}`, 'good');
    return true;
  }

  // ---------- fabrika ----------
  queueUnit(b, type) {
    const def = UNITS[type];
    if (!def || !this.unitUnlocked.has(type)) return false;
    if (b.queue.length >= 5) return false;
    if (!this.canAfford(def.cost)) return false;
    this.pay(def.cost);
    b.queue.push(type);
    return true;
  }

  // ---------- eşya aktarımı ----------
  // fromSide: hedef binanın hangi yüzünden giriyor (0..3, hedefin merkezinden kaynağa yön)
  accept(b, t, fromSide) {
    if (b.faction !== 0) return false;
    switch (b.type) {
      case 'belt': {
        if (fromSide === b.dir) return false;
        const it = b.items;
        if (it.length >= 3) return false;
        if (it.length && it[it.length - 1].p < BELT_GAP) return false;
        it.push({ t, p: 0, s: fromSide });
        return true;
      }
      case 'splitter':
        if (b.hold) return false;
        b.hold = t; b.holdFrom = fromSide; return true;
      case 'smelter': case 'assembler': case 'foundry': {
        if (!b.recipe && b.type === 'smelter') {
          const r = Object.keys(RECIPES).find((k) => RECIPES[k].building === 'smelter' && RECIPES[k].inp[t]);
          if (!r) return false;
          b.recipe = r; this.emit('update', b);
        }
        const r = RECIPES[b.recipe];
        if (!r || !r.inp[t]) return false;
        if ((b.inBuf[t] || 0) >= r.inp[t] * 3 + 1) return false;
        b.inBuf[t] = (b.inBuf[t] || 0) + 1;
        return true;
      }
      case 'generator':
        if (t !== 'coal' || b.fuel >= 8) return false;
        b.fuel++; return true;
      case 'hq':
        this.stock[t] = (this.stock[t] || 0) + 1;
        this.delivered[t] = (this.delivered[t] || 0) + 1;
        return true;
      case 'turret_mg': case 'turret_cannon':
        if (t !== 'ammo') return false;
        this.stock.ammo++; return true;
    }
    return false;
  }
  pushTo(b, dir, t) {
    const tx = b.x + DX[dir], ty = b.y + DY[dir];
    const tgt = this.at(tx, ty);
    if (!tgt || tgt === b) return false;
    return this.accept(tgt, t, (dir + 2) % 4);
  }

  // ---------- güncelleme ----------
  update(realDt) {
    if (this.state !== 'play') return;
    this.acc += Math.min(realDt, 0.25) * this.speed;
    const step = 1 / 20;
    let n = 0;
    while (this.acc >= step && n < 12) { this.step(step); this.acc -= step; n++; }
    if (n >= 12) this.acc = 0;
  }

  dayPhase() { return (this.time % DAY_LENGTH) / DAY_LENGTH; }
  sunLevel() {
    const t = this.dayPhase();
    return t < 0.65 ? Math.sin(Math.PI * t / 0.65) : -Math.sin(Math.PI * (t - 0.65) / 0.35) * 0.6;
  }
  clock() {
    const t = this.dayPhase();
    const h = t < 0.65 ? 6 + (t / 0.65) * 13 : 19 + ((t - 0.65) / 0.35) * 11;
    const hh = Math.floor(h) % 24, mm = Math.floor((h % 1) * 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }
  day() { return Math.floor(this.time / DAY_LENGTH) + 1; }

  step(dt) {
    this.time += dt;
    // enerji
    const sun = Math.max(0, this.sunLevel());
    let base = 0, gen = 0, demand = 0, genCap = 0;
    for (const b of this.buildings.values()) {
      if (b.faction !== 0) continue;
      if (b.type === 'hq') base += 30;
      else if (b.type === 'solar') base += 25 * Math.min(1, sun * 1.4);
      else if (b.type === 'generator') genCap += 80;
      else if (b.working) demand += BUILDINGS[b.type].power;
    }
    const needGen = demand > base;
    for (const b of this.buildings.values()) {
      if (b.type !== 'generator') continue;
      if (b.burn <= 0 && needGen && b.fuel > 0) { b.fuel--; b.burn = 7; this.stats.gensBurned++; }
      b.working = b.burn > 0;
      if (b.burn > 0) { b.burn -= dt; gen += 80; }
    }
    this.power.supply = base + gen; this.power.demand = demand; this.power.cap = base + genCap;
    this.power.ratio = demand > 0 ? Math.min(1, (base + gen) / demand) : 1;
    const pr = this.power.ratio;

    for (const b of this.buildings.values()) {
      switch (b.type) {
        case 'belt': this.stepBelt(b, dt); break;
        case 'miner': this.stepMiner(b, dt, pr); break;
        case 'smelter': case 'assembler': case 'foundry': this.stepMachine(b, dt, pr); break;
        case 'splitter': this.stepSplitter(b); break;
        case 'factory': this.stepFactory(b, dt, pr); break;
        case 'turret_mg': case 'turret_cannon': case 'turret_laser': this.stepTurret(b, dt, pr); break;
        case 'hq': this.stepHQ(b, dt); break;
      }
    }
    // akış alanları
    this.fieldTimer -= dt;
    if (this.fieldDirty && this.fieldTimer <= 0) { this.computeFields(); this.fieldDirty = false; this.fieldTimer = 1; }
    this.stepUnits(dt);
    this.stepProjectiles(dt);
    this.stepWaves(dt);
    this.checkObjectives();
  }

  stepBelt(b, dt) {
    const it = b.items;
    if (!it.length) return;
    const adv = BELT_SPEED * dt;
    for (let k = 0; k < it.length; k++) {
      const item = it[k];
      let lim = k === 0 ? 1 : it[k - 1].p - BELT_GAP;
      item.p = Math.min(item.p + adv, Math.max(item.p, lim));
    }
    if (it[0].p >= 1) {
      if (this.pushTo(b, b.dir, it[0].t)) it.shift();
      else it[0].p = 1;
    }
  }
  stepMiner(b, dt, pr) {
    b.working = b.outBuf.length < 2;
    if (b.working) {
      b.progress += dt * pr * PURITY[b.purity].mul / MINER_TIME;
      if (b.progress >= 1) { b.progress -= 1; b.outBuf.push(b.ore); }
    }
    if (b.outBuf.length && this.pushTo(b, b.dir, b.outBuf[0])) b.outBuf.shift();
  }
  stepMachine(b, dt, pr) {
    const r = RECIPES[b.recipe];
    b.working = false;
    if (r) {
      if (b.progress > 0 || this.hasInputs(b, r)) {
        if (b.progress === 0) { for (const k in r.inp) b.inBuf[k] -= r.inp[k]; b.progress = 1e-6; }
        if (b.outBuf.length < 6) {
          b.working = true;
          b.progress += dt * pr / r.time;
          if (b.progress >= 1) {
            b.progress = 0;
            for (const k in r.out) for (let i = 0; i < r.out[k]; i++) b.outBuf.push(k);
          }
        }
      }
    }
    if (b.outBuf.length && this.pushTo(b, b.dir, b.outBuf[0])) b.outBuf.shift();
  }
  hasInputs(b, r) { for (const k in r.inp) if ((b.inBuf[k] || 0) < r.inp[k]) return false; return true; }
  stepSplitter(b) {
    if (!b.hold) return;
    for (let k = 0; k < 4; k++) {
      const d = (b.rr + k) % 4;
      if (d === b.holdFrom) continue;
      if (this.pushTo(b, d, b.hold)) { b.hold = null; b.rr = (d + 1) % 4; return; }
    }
  }
  stepFactory(b, dt, pr) {
    b.working = b.queue.length > 0;
    if (!b.working) return;
    if (this.units.filter((u) => u.faction === 0).length >= MAX_UNITS) { b.working = false; return; }
    b.progress += dt * pr / UNITS[b.queue[0]].time;
    if (b.progress >= 1) {
      b.progress = 0;
      const t = b.queue.shift();
      const u = this.spawnUnit(t, 0, b.x + 1 + DX[b.dir] * 1.6, b.y + 1 + DY[b.dir] * 1.6);
      u.mode = 'guard';
      this.emit('message', `${UNITS[t].name} hazır`, 'info');
    }
  }

  // ---------- savaş ----------
  hostile(fa, fb) { return (fa === 0) !== (fb === 0); }
  canHit(attAir, target) { return !target.air || attAir; }

  findTarget(x, y, faction, range, aa) {
    let best = null, bd = range * range;
    for (const u of this.units) {
      if (!this.hostile(faction, u.faction) || u.hp <= 0) continue;
      if (u.air && !aa) continue;
      const dx = u.x - x, dy = u.y - y, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = u; }
    }
    const r = Math.ceil(range);
    const x0 = Math.floor(x), y0 = Math.floor(y);
    let bestB = null, bdB = range * range;
    for (let j = y0 - r; j <= y0 + r; j++) for (let i = x0 - r; i <= x0 + r; i++) {
      if (i < 0 || j < 0 || i >= MAP_W || j >= MAP_H) continue;
      const id = this.grid[j * MAP_W + i]; if (!id) continue;
      const b = this.buildings.get(id);
      if (!this.hostile(faction, b.faction)) continue;
      const dx = i + 0.5 - x, dy = j + 0.5 - y, d = dx * dx + dy * dy;
      if (d < bdB) { bdB = d; bestB = b; }
    }
    // birimlere öncelik ver
    if (best && (bd < bdB * 1.6 || !bestB)) return best;
    return bestB || best;
  }
  targetPos(t) {
    if (t.kind === 'unit') return [t.x, t.y];
    const s = t.size / 2; return [t.x + s, t.y + s];
  }
  alive(t) {
    if (!t) return false;
    if (t.kind === 'unit') return t.hp > 0 && this.units.includes(t);
    return this.buildings.get(t.id) === t;
  }

  stepTurret(b, dt, pr) {
    const def = BUILDINGS[b.type];
    b.cd -= dt;
    b.retarget -= dt;
    b.working = false;
    const cx = b.x + 0.5, cy = b.y + 0.5;
    if (b.retarget <= 0 || !this.alive(b.target)) {
      b.target = this.findTarget(cx, cy, b.faction, def.range, def.air);
      b.retarget = 0.4;
    }
    if (!b.target) return;
    const [tx, ty] = this.targetPos(b.target);
    const dx = tx - cx, dy = ty - cy;
    if (dx * dx + dy * dy > def.range * def.range) { b.target = null; return; }
    const want = Math.atan2(-dy, dx);
    let diff = want - b.yaw;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    const turn = 4.5 * dt;
    b.yaw += Math.max(-turn, Math.min(turn, diff));
    if (def.laser) b.working = true;
    if (Math.abs(diff) > 0.2 || b.cd > 0) return;
    // mühimmat / enerji
    if (b.faction === 0) {
      if (def.ammo) {
        if (this.stock.ammo < def.ammo) { b.noAmmo = true; return; }
        this.stock.ammo -= def.ammo;
      }
      b.noAmmo = false;
      if (def.laser && pr < 0.3) return;
    }
    b.cd = def.rate / (def.laser && b.faction === 0 ? Math.max(0.3, pr) : 1);
    this.fire(b, cx, cy, b.target, def, b.type === 'turret_cannon' ? 'shell' : def.laser ? 'laser' : 'bullet');
  }

  // karargâhların kendi hafif savunma topu var
  stepHQ(b, dt) {
    b.cd = (b.cd || 0) - dt;
    b.retarget = (b.retarget || 0) - dt;
    const cx = b.x + 1.5, cy = b.y + 1.5;
    if (b.retarget <= 0 || !this.alive(b.target)) { b.target = this.findTarget(cx, cy, b.faction, HQ_GUN.range, true); b.retarget = 0.5; }
    if (!b.target || b.cd > 0) return;
    const [tx, ty] = this.targetPos(b.target);
    if ((tx - cx) ** 2 + (ty - cy) ** 2 > HQ_GUN.range ** 2) { b.target = null; return; }
    b.yaw = Math.atan2(-(ty - cy), tx - cx);
    b.cd = HQ_GUN.rate;
    this.fire(b, cx, cy, b.target, HQ_GUN, 'bullet');
  }

  fire(src, x, y, target, def, kind) {
    const [tx, ty] = this.targetPos(target);
    const dmgMul = src.faction === 0 ? 1 : 1 + this.wave.n * 0.05;
    if (kind === 'shell') {
      const d = Math.hypot(tx - x, ty - y);
      this.projectiles.push({ x, y, tx, ty, t: 0, dur: 0.35 + d * 0.06, dmg: def.dmg * dmgMul, splash: def.splash || 1.5, faction: src.faction, air: false });
      this.emit('shot', src, x, y, tx, ty, kind, target);
    } else {
      this.emit('shot', src, x, y, tx, ty, kind, target);
      this.damage(target, def.dmg * dmgMul, src.faction);
    }
  }

  damage(t, dmg, byFaction) {
    if (!this.alive(t)) return;
    t.hp -= dmg;
    t.hitT = this.time;
    if (t.hp > 0) return;
    if (t.kind === 'unit') {
      this.units.splice(this.units.indexOf(t), 1);
      this.emit('unitDie', t);
      if (t.faction !== 0) this.stats.kills++; else this.stats.lost++;
    } else {
      this.emit('explode', t.x + t.size / 2, t.y + t.size / 2, t.size * 1.2 + (t.type === 'hq' ? 2 : 0));
      this.removeBuilding(t, true);
      if (t.type === 'hq') this.onHqDestroyed(t);
    }
  }

  onHqDestroyed(b) {
    if (b.faction === 0) {
      this.state = 'lost';
      this.emit('gameover', false);
      return;
    }
    const r = this.rivals.find((q) => q.id === b.faction);
    r.alive = false;
    // kalan rakip yapılarını yok et
    for (const o of [...this.buildings.values()]) {
      if (o.faction === r.id) {
        this.emit('explode', o.x + 0.5, o.y + 0.5, 1.2);
        this.removeBuilding(o, true);
      }
    }
    for (const u of [...this.units]) if (u.faction === r.id) this.damage(u, 1e9, 0);
    // ganimet
    const loot = { steel: 60, circuit: 30, motor: 10, ammo: 300, iron_ingot: 150, copper_ingot: 100 };
    for (const k in loot) this.stock[k] += loot[k];
    this.emit('message', `${r.name} yok edildi! Ganimet depoya eklendi.`, 'good');
    if (this.rivals.every((q) => !q.alive)) { this.state = 'won'; this.emit('gameover', true); }
    for (const u of this.units) if (u.faction === 0 && u.goal === r.id) { u.mode = 'guard'; u.goal = null; }
  }

  stepProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.t += dt;
      if (p.t < p.dur) continue;
      this.projectiles.splice(i, 1);
      this.emit('explode', p.tx, p.ty, 0.7);
      const r2 = p.splash * p.splash;
      for (const u of [...this.units]) {
        if (!this.hostile(p.faction, u.faction) || u.air) continue;
        const d = (u.x - p.tx) ** 2 + (u.y - p.ty) ** 2;
        if (d < r2) this.damage(u, p.dmg * (1 - d / r2 * 0.6), p.faction);
      }
      const R = Math.ceil(p.splash), seen = new Set();
      for (let j = Math.floor(p.ty) - R; j <= Math.floor(p.ty) + R; j++) for (let k = Math.floor(p.tx) - R; k <= Math.floor(p.tx) + R; k++) {
        const b = this.at(k, j);
        if (!b || seen.has(b) || !this.hostile(p.faction, b.faction)) continue;
        const d = (k + 0.5 - p.tx) ** 2 + (j + 0.5 - p.ty) ** 2;
        if (d < r2) { seen.add(b); this.damage(b, p.dmg * (1 - d / r2 * 0.6), p.faction); }
      }
    }
  }

  // ---------- birimler ----------
  spawnUnit(type, faction, x, y) {
    const d = UNITS[type];
    const u = {
      kind: 'unit', id: this.nextId++, type, faction, x, y, hp: d.hp, maxHp: d.hp,
      yaw: 0, tyaw: 0, cd: Math.random() * d.rate, retarget: 0, target: null,
      air: d.air, mode: faction === 0 ? 'guard' : 'attack', goal: null, moving: false, born: this.time,
    };
    if (faction !== 0) {
      const m = 1 + this.wave.n * 0.08;
      u.hp = u.maxHp = Math.round(d.hp * m);
    }
    this.units.push(u);
    this.emit('unitAdd', u);
    return u;
  }

  computeFields() {
    const P = PLAYER_HQ;
    this.fields.player = this.field([[P.x, P.y, 3]], 'enemy');
    this.fields.home = this.field([[P.x, P.y, 3]], 'player');
    for (const r of this.rivals) {
      if (r.alive) this.fields['r' + r.id] = this.field([[r.x, r.y, 3]], 'player');
    }
  }
  // mover: 'enemy' (oyuncu yapıları engel) veya 'player'
  field(goals, mover) {
    const W = MAP_W, H = MAP_H, N = W * H;
    const dist = new Float32Array(N).fill(Infinity);
    const heap = new MinHeap();
    for (const [gx, gy, s] of goals) for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) {
      const k = (gy + j) * W + gx + i; dist[k] = 0; heap.push(0, k);
    }
    const nb = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
    const terr = this.world.terrain;
    const tileCost = (k) => {
      if (terr[k] >= 3) return Infinity;
      const id = this.grid[k];
      if (!id) return 1;
      const b = this.buildings.get(id);
      const enemyOwned = b.faction !== 0;
      if (mover === 'enemy') return enemyOwned ? 3 : 1 + Math.min(12, b.hp / 80);
      return enemyOwned ? 1 + Math.min(12, b.hp / 80) : (b.type === 'belt' ? 1.2 : 3);
    };
    while (heap.size) {
      const k = heap.pop();
      const d0 = dist[k];
      const x = k % W, y = (k / W) | 0;
      for (const [dx, dy, c] of nb) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        if (dx && dy && (terr[y * W + nx] >= 3 || terr[ny * W + x] >= 3)) continue;
        const nk = ny * W + nx;
        const tc = tileCost(nk);
        if (tc === Infinity) continue;
        const nd = d0 + c * tc;
        if (nd < dist[nk]) { dist[nk] = nd; heap.push(nd, nk); }
      }
    }
    return dist;
  }

  stepUnits(dt) {
    const units = this.units;
    for (const u of units) {
      const def = UNITS[u.type];
      u.cd -= dt; u.retarget -= dt;
      if (u.retarget <= 0 || !this.alive(u.target)) {
        u.target = this.findTarget(u.x, u.y, u.faction, def.range, def.air || u.type === 'mech' || u.type === 'raider');
        u.retarget = 0.35 + Math.random() * 0.2;
      }
      let moveTo = null;
      if (u.target) {
        const [tx, ty] = this.targetPos(u.target);
        const dx = tx - u.x, dy = ty - u.y;
        const d = Math.hypot(dx, dy);
        const r = def.range + (u.target.kind === 'unit' ? 0 : u.target.size * 0.5);
        if (d > r) { u.target = null; }
        else {
          const want = Math.atan2(-dy, dx);
          let diff = Math.atan2(Math.sin(want - u.tyaw), Math.cos(want - u.tyaw));
          u.tyaw += Math.max(-6 * dt, Math.min(6 * dt, diff));
          if (u.cd <= 0 && Math.abs(diff) < 0.3) {
            u.cd = def.rate;
            const kind = def.splash ? 'shell' : (u.type === 'drone' ? 'laser' : 'bullet');
            this.fire(u, u.x, u.y, u.target, def, kind);
          }
          if (!u.air || d < def.range * 0.6) { u.moving = false; continue; }
          moveTo = [tx, ty];
        }
      }
      // hareket hedefi
      let field = null;
      if (u.faction !== 0) {
        field = this.fields.player;
        if (u.air && !moveTo) { const P = PLAYER_HQ; moveTo = [P.x + 1.5, P.y + 1.5]; }
      } else if (u.mode === 'attack' && u.goal) {
        const r = this.rivals.find((q) => q.id === u.goal);
        if (!r || !r.alive) { u.mode = 'guard'; u.goal = null; }
        else { field = this.fields['r' + r.id]; if (u.air && !moveTo) moveTo = [r.x + 1.5, r.y + 1.5]; }
      }
      if (u.faction === 0 && u.mode === 'guard' && !moveTo) {
        // en yakın düşmana müdahale (12 karo)
        const e = this.findTarget(u.x, u.y, 0, 12, def.air || u.type === 'mech');
        if (e && e.kind === 'unit') moveTo = [e.x, e.y];
        else {
          const P = PLAYER_HQ;
          const a = (u.id * 2.39996) % (Math.PI * 2);
          const rx = P.x + 1.5 + Math.cos(a) * (4 + (u.id % 3)), ry = P.y + 1.5 + Math.sin(a) * (4 + (u.id % 3));
          if (Math.hypot(rx - u.x, ry - u.y) > 0.6) {
            if (Math.hypot(P.x + 1.5 - u.x, P.y + 1.5 - u.y) > 8 && !u.air) field = this.fields.home;
            else moveTo = [rx, ry];
          }
        }
      }
      if (!moveTo && field) moveTo = this.flowStep(u, field);
      u.moving = false;
      if (moveTo) {
        const dx = moveTo[0] - u.x, dy = moveTo[1] - u.y, d = Math.hypot(dx, dy);
        if (d > 0.05) {
          let sp = def.speed * dt;
          // binaların üzerinden geçen kara birimleri yavaşlar
          if (!u.air && this.at(Math.floor(u.x), Math.floor(u.y))) sp *= 0.6;
          const s = Math.min(sp, d);
          u.x += dx / d * s; u.y += dy / d * s;
          const want = Math.atan2(-dy, dx);
          const diff = Math.atan2(Math.sin(want - u.yaw), Math.cos(want - u.yaw));
          u.yaw += Math.max(-5 * dt, Math.min(5 * dt, diff));
          if (!u.target) u.tyaw += Math.atan2(Math.sin(u.yaw - u.tyaw), Math.cos(u.yaw - u.tyaw)) * Math.min(1, 4 * dt);
          u.moving = true;
        }
      }
    }
    // ayrışma
    for (let i = 0; i < units.length; i++) {
      const a = units[i];
      for (let j = i + 1; j < units.length; j++) {
        const b = units[j];
        if (a.air !== b.air) continue;
        const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
        if (d2 < 0.49 && d2 > 1e-6) {
          const d = Math.sqrt(d2), push = (0.7 - d) * 0.5;
          const nx = dx / d * push, ny = dy / d * push;
          a.x -= nx; a.y -= ny; b.x += nx; b.y += ny;
        }
      }
      // su/kaya içine girmeyi engelle
      if (!a.air) {
        a.x = Math.max(0.3, Math.min(MAP_W - 0.3, a.x));
        a.y = Math.max(0.3, Math.min(MAP_H - 0.3, a.y));
        if (!this.world.passable(Math.floor(a.x), Math.floor(a.y))) {
          const ox = a.px ?? a.x, oy = a.py ?? a.y; a.x = ox; a.y = oy;
        }
        a.px = a.x; a.py = a.y;
      }
    }
  }
  flowStep(u, field) {
    if (!field) return null;
    const x = Math.floor(u.x), y = Math.floor(u.y);
    const W = MAP_W;
    let best = field[y * W + x], bx = -1, by = -1;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= MAP_H) continue;
      if (dx && dy && (!this.world.passable(nx, y) || !this.world.passable(x, ny))) continue;
      const v = field[ny * W + nx];
      if (v < best) { best = v; bx = nx; by = ny; }
    }
    if (bx < 0) return null;
    return [bx + 0.5, by + 0.5];
  }

  commandAttack(rivalId) {
    let n = 0;
    for (const u of this.units) if (u.faction === 0) { u.mode = 'attack'; u.goal = rivalId; n++; }
    return n;
  }
  commandRecall() {
    for (const u of this.units) if (u.faction === 0) { u.mode = 'guard'; u.goal = null; }
  }

  // ---------- dalgalar ----------
  stepWaves(dt) {
    const w = this.wave;
    w.next -= dt;
    if (!w.warned && w.next < 25) { w.warned = true; this.emit('message', 'Düşman saldırısı yaklaşıyor!', 'warn'); this.emit('alarm'); }
    if (w.next > 0) return;
    w.n++; w.warned = false;
    w.next = DAY_LENGTH * (w.n < 3 ? 1 : 0.75);
    const alive = this.rivals.filter((r) => r.alive);
    if (!alive.length) return;
    const n = w.n;
    const comp = [];
    const raiders = Math.round(2 + n * 1.4);
    for (let i = 0; i < raiders; i++) comp.push('raider');
    for (let i = 0; i < Math.floor((n - 1) * 0.7); i++) comp.push('brute');
    for (let i = 0; i < Math.max(0, n - 2); i++) comp.push('wasp');
    comp.forEach((t, i) => {
      const r = alive[i % alive.length];
      const a = this.rnd() * Math.PI * 2;
      const u = this.spawnUnit(t, r.id, r.x - 3 + Math.cos(a) * 1.5, r.y + 1.5 + Math.sin(a) * 1.5);
      u.mode = 'attack';
    });
    this.emit('message', `${n}. dalga: ${comp.length} düşman birimi üssüne ilerliyor!`, 'bad');
    this.emit('wave', n);
    for (const r of alive) { this.rivalGrow(r); if (n > 3) this.rivalGrow(r); }
  }

  // ---------- görevler ----------
  checkObjectives() {
    const o = OBJECTIVES[this.objective];
    if (!o) return;
    let done = false;
    const count = (t, f) => { let c = 0; for (const b of this.buildings.values()) if (b.faction === 0 && b.type === t && (!f || f(b))) c++; return c; };
    switch (o.id) {
      case 'miner': done = count('miner', (b) => b.ore === 'iron_ore') > 0; break;
      case 'smelt': done = count('smelter', (b) => b.progress > 0 || b.outBuf.length > 0) > 0; break;
      case 'iron20': done = (this.delivered.iron_ingot || 0) >= 20; break;
      case 'brick10': done = (this.delivered.brick || 0) >= 10; break;
      case 'gen': done = this.stats.gensBurned > 0; break;
      case 'turrets': done = count('turret_mg') >= 3; break;
      case 'otomasyon': case 'metalurji': case 'elektronik': done = this.researched.has(o.id); break;
      case 'army': done = this.units.filter((u) => u.faction === 0).length >= 5; break;
      case 'rival1': done = this.rivals.some((r) => !r.alive); break;
      case 'rival2': done = this.rivals.every((r) => !r.alive); break;
    }
    if (done) {
      for (const k in o.reward) this.stock[k] += o.reward[k];
      const rw = Object.entries(o.reward).map(([k, v]) => `+${v} ${ITEMS[k].name}`).join(', ');
      this.emit('message', `Görev tamamlandı! ${rw}`, 'good');
      this.objective++;
      this.emit('objective');
    }
  }
  objectiveText() { return OBJECTIVES[this.objective]?.text ?? 'Tüm görevler tamamlandı.'; }
  objectiveIndex() { return [this.objective, OBJECTIVES.length]; }

  // ---------- kayıt ----------
  serialize() {
    const bs = [];
    for (const b of this.buildings.values()) {
      const o = { id: b.id, type: b.type, x: b.x, y: b.y, dir: b.dir, f: b.faction, hp: Math.round(b.hp), mhp: b.maxHp };
      if (b.items) o.items = b.items.map((i) => [i.t, +i.p.toFixed(2), i.s]);
      if (b.recipe) o.recipe = b.recipe;
      if (b.inBuf) o.inBuf = b.inBuf;
      if (b.outBuf) o.outBuf = b.outBuf;
      if (b.progress) o.progress = b.progress;
      if (b.fuel) o.fuel = b.fuel;
      if (b.queue) o.queue = b.queue;
      bs.push(o);
    }
    return {
      v: 1, seed: this.seed, time: this.time, nextId: this.nextId, stock: this.stock, delivered: this.delivered,
      unlocked: [...this.unlocked], unitUnlocked: [...this.unitUnlocked], researched: [...this.researched],
      wave: this.wave, rivals: this.rivals, objective: this.objective, stats: this.stats, trees: Array.from(this.world.tree),
      buildings: bs,
      units: this.units.map((u) => ({ type: u.type, f: u.faction, x: u.x, y: u.y, hp: u.hp, mhp: u.maxHp, mode: u.mode, goal: u.goal })),
    };
  }
  static load(data) {
    const g = new Game({ seed: data.seed });
    g.time = data.time; g.stock = { ...g.stock, ...data.stock }; g.delivered = data.delivered || {};
    g.unlocked = new Set(data.unlocked); g.unitUnlocked = new Set(data.unitUnlocked); g.researched = new Set(data.researched);
    g.wave = data.wave; g.rivals = data.rivals; g.objective = data.objective; g.stats = data.stats || g.stats;
    if (data.trees) g.world.tree.set(data.trees);
    g._pending = data;
    return g;
  }
  restore() {
    const data = this._pending; if (!data) return;
    for (const o of data.buildings) {
      const b = { id: o.id, type: o.type, x: o.x, y: o.y, dir: o.dir, size: BUILDINGS[o.type].size, faction: o.f, hp: o.hp, maxHp: o.mhp, born: -10 };
      if (o.items) b.items = o.items.map(([t, p, s]) => ({ t, p, s }));
      b.recipe = o.recipe; b.inBuf = o.inBuf; b.outBuf = o.outBuf; b.progress = o.progress; b.fuel = o.fuel; b.queue = o.queue;
      this.initBuilding(b);
      if (o.items) b.items = o.items.map(([t, p, s]) => ({ t, p, s }));
      this.addBuildingObj(b);
    }
    this.nextId = Math.max(data.nextId, this.nextId);
    for (const u of data.units) {
      const n = this.spawnUnit(u.type, u.f, u.x, u.y);
      n.hp = u.hp; n.maxHp = u.mhp; n.mode = u.mode; n.goal = u.goal; n.born = -10;
    }
    this._pending = null;
  }
}
