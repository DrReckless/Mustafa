// Otomatik mobilya yerleşim motoru.
//
// Her oda tipi için bir "program" (yerleştirilecek birimler listesi) vardır.
// Her birim (ör. yatak + komodinler, koltuk takımı + TV, mutfak tezgâhı) için
// kurallara uyan aday yerleşimler üretilir. Işın araması (beam search) ile
// birimler sırayla eklenir; her adımda adaylar iç mimari kurallarına göre
// puanlanır ve en iyi durumlar tutulur. Sonunda yürüme yolu analizi
// (60 cm'lik geçişle kapılara ve mobilyaların önüne ulaşılabiliyor mu?) yapılır
// ve birbirinden farklı en iyi 3 seçenek döndürülür.

import { CATALOG, makeItem } from './catalog.js';
import { footprint, frontDir, rectsOverlap, openingsForRoom, roomArea, rotForSide } from './model.js';

const BEAM = 24;
const STEP = 10;
const EPS = 0.5;

// ------------------------------------------------------------------
// Oda bağlamı
// ------------------------------------------------------------------

function sideInfo(R, side) {
  switch (side) {
    case 'n': return { side, a0: R.x0, a1: R.x1, horiz: true, rot: 0 };
    case 's': return { side, a0: R.x0, a1: R.x1, horiz: true, rot: 180 };
    case 'w': return { side, a0: R.y0, a1: R.y1, horiz: false, rot: 270 };
    case 'e': return { side, a0: R.y0, a1: R.y1, horiz: false, rot: 90 };
  }
}

// Duvardan içeri doğru, duvar boyunca [a,b] ve derinlik [d0,d1] olan dikdörtgen
function stripRect(R, side, a, b, d0, d1) {
  switch (side) {
    case 'n': return { x0: a, x1: b, y0: R.y0 + d0, y1: R.y0 + d1 };
    case 's': return { x0: a, x1: b, y0: R.y1 - d1, y1: R.y1 - d0 };
    case 'w': return { x0: R.x0 + d0, x1: R.x0 + d1, y0: a, y1: b };
    case 'e': return { x0: R.x1 - d1, x1: R.x1 - d0, y0: a, y1: b };
  }
}

export function buildContext(project, room) {
  const R = { x0: room.x, y0: room.y, x1: room.x + room.w, y1: room.y + room.h };
  const sides = {};
  for (const s of ['n', 'e', 's', 'w']) sides[s] = { ...sideInfo(R, s), doors: [], windows: [] };
  const doorZones = [];
  const windowStrips = [];
  const doorPoints = [];
  for (const o of openingsForRoom(project, room)) {
    const si = sides[o.side];
    const a = si.a0 + o.offset, b = a + o.width;
    if (o.op.kind === 'door') {
      si.doors.push({ a, b, op: o.op });
      const depth = o.swingIn ? Math.max(o.width + 5, 75) : 75;
      doorZones.push(stripRect(R, o.side, a - 5, b + 5, 0, depth));
      const mid = (a + b) / 2;
      const p = stripRect(R, o.side, mid, mid, 35, 35);
      doorPoints.push({ x: p.x0, y: p.y0, op: o.op });
    } else {
      si.windows.push({ a, b, sill: o.op.sill ?? 90, op: o.op });
      windowStrips.push({ rect: stripRect(R, o.side, a - 5, b + 5, 0, 35), sill: o.op.sill ?? 90, side: o.side, a, b });
    }
  }
  return {
    room, R, sides, doorZones, windowStrips, doorPoints,
    W: R.x1 - R.x0, H: R.y1 - R.y0, area: roomArea(room),
    minDim: Math.min(R.x1 - R.x0, R.y1 - R.y0), maxDim: Math.max(R.x1 - R.x0, R.y1 - R.y0),
    project,
  };
}

// ------------------------------------------------------------------
// Yardımcılar
// ------------------------------------------------------------------

function inside(r, R) {
  return r.x0 >= R.x0 - EPS && r.y0 >= R.y0 - EPS && r.x1 <= R.x1 + EPS && r.y1 <= R.y1 + EPS;
}

function frontRect(it, depth) {
  const fp = footprint(it);
  const [dx, dy] = frontDir(it.rot);
  if (dy > 0) return { x0: fp.x0, x1: fp.x1, y0: fp.y1, y1: fp.y1 + depth };
  if (dy < 0) return { x0: fp.x0, x1: fp.x1, y0: fp.y0 - depth, y1: fp.y0 };
  if (dx > 0) return { x0: fp.x1, x1: fp.x1 + depth, y0: fp.y0, y1: fp.y1 };
  return { x0: fp.x0 - depth, x1: fp.x0, y0: fp.y0, y1: fp.y1 };
}

function expand(r, m) {
  return { x0: r.x0 - m, y0: r.y0 - m, x1: r.x1 + m, y1: r.y1 + m };
}

function clipRect(r, R) {
  return { x0: Math.max(r.x0, R.x0), y0: Math.max(r.y0, R.y0), x1: Math.min(r.x1, R.x1), y1: Math.min(r.y1, R.y1) };
}

// Duvara sırtı dayalı eleman
function onWall(ctx, type, side, t, extra = {}) {
  const c = CATALOG[type];
  const w = extra.w ?? c.w, d = extra.d ?? c.d;
  const { R } = ctx;
  let x, y;
  switch (side) {
    case 'n': x = t; y = R.y0 + d / 2; break;
    case 's': x = t; y = R.y1 - d / 2; break;
    case 'w': x = R.x0 + d / 2; y = t; break;
    case 'e': x = R.x1 - d / 2; y = t; break;
  }
  return makeItem(type, x, y, rotForSide(side), ctx.room.id, { w, d, ...extra });
}

function isFloor(it) {
  return !!CATALOG[it.type]?.floor;
}
function isElevated(it) {
  return !!CATALOG[it.type]?.elev;
}
function solid(it) {
  return !isFloor(it) && !isElevated(it);
}
function frontDepth(it) {
  return it._front ?? CATALOG[it.type]?.front ?? 0;
}

// Odaya göre sabit (durumdan bağımsız) geçerlilik
function staticValid(ctx, it) {
  const fp = footprint(it);
  if (!inside(fp, ctx.R)) return false;
  if (!solid(it)) return true;
  for (const z of ctx.doorZones) if (rectsOverlap(fp, z)) return false;
  for (const ws of ctx.windowStrips) if (it.h > ws.sill + 2 && rectsOverlap(fp, ws.rect)) return false;
  const f = frontDepth(it);
  if (f > 0) {
    const fr = frontRect(it, Math.min(f, 60));
    if (!inside(fr, ctx.R)) return false;
  }
  return true;
}

// Duvar boyunca aday merkez konumları
function slotsAlong(si, len, extra = []) {
  const a = si.a0 + len / 2, b = si.a1 - len / 2;
  if (b < a - EPS) return [];
  const set = new Set();
  for (let t = a; t <= b + EPS; t += STEP) set.add(Math.round(t));
  set.add(Math.round(a)); set.add(Math.round(b));
  set.add(Math.round((si.a0 + si.a1) / 2));
  for (const e of extra) if (e >= a - EPS && e <= b + EPS) set.add(Math.round(e));
  return [...set];
}

function windowCenters(ctx, side) {
  return ctx.sides[side].windows.map((w) => (w.a + w.b) / 2);
}

function distToWindow(ctx, x, y) {
  let best = Infinity;
  for (const ws of ctx.windowStrips) {
    const cx = (ws.rect.x0 + ws.rect.x1) / 2, cy = (ws.rect.y0 + ws.rect.y1) / 2;
    best = Math.min(best, Math.hypot(cx - x, cy - y));
  }
  return best;
}

function sideHasWindowOver(ctx, side, a, b) {
  return ctx.sides[side].windows.some((w) => w.a < b && w.b > a);
}

function sideDoorNear(ctx, side, a, b, margin) {
  return ctx.sides[side].doors.some((d) => d.a < b + margin && d.b > a - margin);
}

const SIDES = ['n', 'e', 's', 'w'];
const OPP = { n: 's', s: 'n', e: 'w', w: 'e' };
const NEXT = { n: 'e', e: 's', s: 'w', w: 'n' };

function sideLen(ctx, s) {
  return ctx.sides[s].a1 - ctx.sides[s].a0;
}

function along(it, side) {
  return side === 'n' || side === 's' ? it.x : it.y;
}

// ------------------------------------------------------------------
// Birim (unit) üreteçleri — her biri [{items, zones, score, sig}] döndürür
// ------------------------------------------------------------------

function unitValid(ctx, u) {
  for (const it of u.items) if (!staticValid(ctx, it)) return false;
  for (const z of u.zones || []) if (!inside(z, ctx.R)) return false;
  return true;
}

function genBed(ctx, opts) {
  const out = [];
  let types;
  if (opts.kid) types = ctx.minDim >= 300 && ctx.area >= 11 ? ['bed_double_s', 'bed_single'] : ['bed_single', 'bed_single_s'];
  else types = ctx.minDim >= 300 && ctx.area >= 10.5 ? ['bed_double', 'bed_double_s'] : ctx.minDim >= 250 ? ['bed_double_s', 'bed_single'] : ['bed_single', 'bed_single_s'];
  types.forEach((type, ti) => {
    const c = CATALOG[type];
    const double = c.w >= 140;
    for (const s of SIDES) {
      const si = ctx.sides[s];
      for (const t of slotsAlong(si, c.w)) {
        const bed = onWall(ctx, type, s, t, { _front: double ? 70 : 60 });
        if (!staticValid(ctx, bed)) continue;
        const L = t - c.w / 2, Rr = t + c.w / 2;
        const ns = CATALOG.nightstand;
        const left = onWall(ctx, 'nightstand', s, L - ns.w / 2 - 2);
        const right = onWall(ctx, 'nightstand', s, Rr + ns.w / 2 + 2);
        const lOk = staticValid(ctx, left), rOk = staticValid(ctx, right);
        const gapL = L - si.a0, gapR = si.a1 - Rr;
        const variants = [];
        if (lOk && rOk) variants.push([left, right]);
        if (lOk) variants.push([left]);
        if (rOk) variants.push([right]);
        variants.push([]);
        for (const ns2 of variants) {
          let score = 6 - ti * 1.2;
          const len = si.a1 - si.a0;
          const off = Math.abs(t - (si.a0 + si.a1) / 2) / (len / 2 || 1);
          score += double ? 2.2 * (1 - off) : 0.6 * (1 - off);
          if (double) {
            // Çift kişilik yatakta iki yandan da erişim
            if (gapL < 55 || gapR < 55) score -= 4;
            score += ns2.length * 1.1;
          } else {
            // Tek kişilik yatak bir duvara yaslanabilir (alan kazandırır)
            if (gapL < 5 || gapR < 5) score += opts.kid ? 1.2 : 0.4;
            score += ns2.length ? 0.8 : 0;
          }
          // Kapının bulunduğu duvarda başucu: kapı yatağa çok yakınsa ceza
          if (sideDoorNear(ctx, s, L - 45, Rr + 45, 0)) score -= 1.5;
          // Yatak kapının tam karşısında (ayakucu kapıya bakar) — hafif ceza
          if (sideDoorNear(ctx, OPP[s], L, Rr, 0)) score -= 0.6;
          // Pencere karşıda: sabah ışığı, hoş manzara
          if (sideHasWindowOver(ctx, OPP[s], L - 50, Rr + 50)) score += 0.4;
          const zones = [];
          // Yatağın iki yanında ve ayakucunda geçiş
          out.push({ items: [bed, ...ns2], zones, score, sig: `bed:${s}:${Math.round(t / 40)}`, access: bedAccess(bed, double) });
        }
      }
    }
  });
  return out.filter((u) => unitValid(ctx, u));
}

function bedAccess(bed, double) {
  const fp = footprint(bed);
  const [dx, dy] = frontDir(bed.rot);
  const pts = [];
  // yanlardaki erişim noktaları (başucundan 1/2 boy ileride)
  const cx = (fp.x0 + fp.x1) / 2, cy = (fp.y0 + fp.y1) / 2;
  if (dy !== 0) {
    pts.push({ x: fp.x0 - 31, y: cy, any: 'bed' }, { x: fp.x1 + 31, y: cy, any: 'bed' });
  } else {
    pts.push({ x: cx, y: fp.y0 - 31, any: 'bed' }, { x: cx, y: fp.y1 + 31, any: 'bed' });
  }
  return { pts, need: double ? 1 : 1, bonusAll: double };
}

function genWardrobe(ctx) {
  const out = [];
  const types = ['wardrobe_240', 'wardrobe_200', 'wardrobe_160', 'wardrobe_120', 'wardrobe_90'];
  for (const type of types) {
    const c = CATALOG[type];
    for (const s of SIDES) {
      const si = ctx.sides[s];
      for (const t of slotsAlong(si, c.w)) {
        const it = onWall(ctx, type, s, t);
        if (!staticValid(ctx, it)) continue;
        let score = c.w / 60;
        const L = t - c.w / 2, Rr = t + c.w / 2;
        if (L - si.a0 < 3 || si.a1 - Rr < 3) score += 0.8; // köşeye yaslı, gömme dolap etkisi
        out.push({ items: [it], score, sig: `wd:${s}:${Math.round(t / 50)}` });
      }
    }
  }
  return out;
}

function genWallItem(ctx, type, baseScore, opts = {}) {
  const out = [];
  const c = CATALOG[type];
  for (const s of SIDES) {
    const si = ctx.sides[s];
    for (const t of slotsAlong(si, c.w, windowCenters(ctx, s))) {
      const it = onWall(ctx, type, s, t);
      if (!staticValid(ctx, it)) continue;
      let score = baseScore;
      if (opts.score) score += opts.score(it, s, t);
      out.push({ items: [it], score, sig: `${type}:${s}:${Math.round(t / 50)}` });
    }
  }
  return out;
}

function genCornerItem(ctx, type, baseScore) {
  const out = [];
  const c = CATALOG[type];
  for (const s of SIDES) {
    const si = ctx.sides[s];
    for (const t of [si.a0 + c.w / 2 + 5, si.a1 - c.w / 2 - 5]) {
      const it = onWall(ctx, type, s, t);
      // köşe elemanları sırtı duvardan 5 cm uzak dursun
      if (!staticValid(ctx, it)) continue;
      out.push({ items: [it], score: baseScore, sig: `${type}:${s}:${t}` });
    }
  }
  return out;
}

function genDesk(ctx, baseScore) {
  const out = [];
  for (const type of ['desk', 'desk_s']) {
    const c = CATALOG[type];
    for (const s of SIDES) {
      const si = ctx.sides[s];
      for (const t of slotsAlong(si, c.w, windowCenters(ctx, s))) {
        const desk = onWall(ctx, type, s, t);
        if (!staticValid(ctx, desk)) continue;
        const [dx, dy] = frontDir(desk.rot);
        const ch = makeItem('office_chair', desk.x + dx * (c.d / 2 + 15), desk.y + dy * (c.d / 2 + 15), (desk.rot + 180) % 360, ctx.room.id);
        let score = baseScore + (type === 'desk' ? 0.5 : 0);
        const dw = distToWindow(ctx, desk.x, desk.y);
        if (dw < 400) score += 2 * (1 - dw / 400); // doğal ışık
        out.push({ items: [desk, ch], score, sig: `desk:${s}:${Math.round(t / 50)}` });
      }
    }
  }
  return out.filter((u) => unitValid(ctx, u));
}

// Koltuk takımı + orta sehpa + halı + TV ünitesi (+ berjerler)
function genLiving(ctx, opts = {}) {
  const out = [];
  const big = ctx.area >= 20 && ctx.minDim >= 380;
  const sofaTypes = big ? ['sofa_l', 'sofa_3', 'sofa_2'] : ctx.minDim >= 300 ? ['sofa_3', 'sofa_2'] : ['sofa_2'];
  const tvTypes = ctx.minDim >= 320 ? ['tv_unit', 'tv_unit_s'] : ['tv_unit_s'];

  for (const tvType of tvTypes) {
    const tvc = CATALOG[tvType];
    for (const s of SIDES) {
      const si = ctx.sides[s];
      const depthAvail = s === 'n' || s === 's' ? ctx.H : ctx.W;
      for (const t of slotsAlong(si, tvc.w)) {
        const tv = onWall(ctx, tvType, s, t);
        if (!staticValid(ctx, tv)) continue;
        for (const sofaType of sofaTypes) {
          const sc = CATALOG[sofaType];
          for (const mirror of sofaType === 'sofa_l' ? [false, true] : [false]) {
            // Koltuk TV'nin karşısında; mesafeyi dene. Karşı duvara dayalı varyant da üret.
            const dists = [];
            const wallDist = depthAvail - tvc.d - sc.d; // koltuk sırtı karşı duvarda
            if (wallDist >= 200 && wallDist <= 360) dists.push({ D: wallDist, wall: true });
            for (const D of [230, 260, 300]) if (D < wallDist - 40) dists.push({ D, wall: false });
            for (const { D, wall } of dists) {
              // koltuğu yerleştir (sırtı TV'ye ters)
              const [fx, fy] = frontDir(tv.rot); // TV'nin önü odaya bakar
              const off = tvc.d / 2 + D + sc.d / 2;
              // L koltukta oturma bölümünün ortası TV eksenine gelsin
              const shift = sofaType === 'sofa_l' ? (mirror ? -1 : 1) * (sc.w / 2 - 110) : 0;
              const px = tv.x + fx * off + (fy !== 0 ? shift * (fy > 0 ? -1 : 1) : 0);
              const py = tv.y + fy * off + (fx !== 0 ? shift * (fx > 0 ? 1 : -1) : 0);
              const sofa = makeItem(sofaType, px, py, (tv.rot + 180) % 360, ctx.room.id, { mirror });
              if (!staticValid(ctx, sofa)) continue;
              const items = [tv, sofa];
              // orta sehpa
              const ctc = CATALOG.coffee_table;
              const ctOff = tvc.d / 2 + D - 42 - ctc.d / 2;
              const ctx_ = tv.x + fx * ctOff, cty = tv.y + fy * ctOff;
              const ct = makeItem('coffee_table', fy !== 0 ? tv.x : ctx_, fx !== 0 ? tv.y : cty, tv.rot, ctx.room.id);
              if (fy !== 0) ct.y = cty; else ct.x = ctx_;
              if (D - 42 - ctc.d >= 70 && staticValid(ctx, ct)) items.push(ct);
              // halı
              const rugType = sofaType === 'sofa_l' || sc.w > 200 ? 'rug_l' : 'rug';
              const rc = CATALOG[rugType];
              const rugOff = tvc.d / 2 + D - rc.d / 2 + 25;
              const rug = makeItem(rugType, tv.x + fx * rugOff, tv.y + fy * rugOff, tv.rot, ctx.room.id);
              if (inside(footprint(rug), ctx.R)) items.push(rug);
              // berjerler: sehpanın iki yanında, ona dönük
              const arm = [];
              const ac = CATALOG.armchair;
              for (const sgn of [-1, 1]) {
                const lat = sc.w / 2 + ac.d / 2 - 10;
                const mid = tvc.d / 2 + D - 60;
                const ax = tv.x + fx * mid + (fy !== 0 ? sgn * lat : 0);
                const ay = tv.y + fy * mid + (fx !== 0 ? sgn * lat : 0);
                // berjer önü orta sehpaya baksın
                let rot;
                if (fy !== 0) rot = sgn < 0 ? 270 : 90; else rot = sgn < 0 ? 0 : 180;
                const a = makeItem('armchair', ax, ay, rot, ctx.room.id);
                if (sofaType === 'sofa_l' && ((mirror ? 1 : -1) === sgn)) continue; // L tarafında yer yok
                if (staticValid(ctx, a)) arm.push(a);
              }
              const armSets = [arm];
              if (arm.length === 2) armSets.push([arm[0]], [arm[1]]);
              if (arm.length) armSets.push([]);
              for (const as of armSets) {
                let score = 8;
                score += sofaType === 'sofa_l' ? 2 : sofaType === 'sofa_3' ? 1.2 : 0;
                score += tvType === 'tv_unit' ? 0.4 : 0;
                score += 1.6 - Math.abs(D - 270) / 70; // ideal izleme mesafesi
                score += wall ? 2 : big ? 0.5 : -1;
                const len = si.a1 - si.a0;
                score += 1.2 * (1 - Math.abs(t - (si.a0 + si.a1) / 2) / (len / 2 || 1));
                if (sideHasWindowOver(ctx, s, t - tvc.w, t + tvc.w)) score -= 2.5; // TV arkasında pencere: parlama
                if (ctx.sides[s].doors.length) score -= 0.6;
                score += as.length * 1.0;
                if (!items.find((i) => i.type === 'coffee_table')) score -= 1.5;
                const all = [...items, ...as];
                // Takımın kapladığı alan boyunca serbest geçiş bölgesi yok; dolaşımı genel analiz ölçer
                // TV ile koltuk arasındaki görüş alanı boş kalmalı
                const vw = Math.min(sc.w, tvc.w + 40) / 2;
                const tvFp = footprint(tv);
                let view;
                if (fy > 0) view = { x0: tv.x - vw, x1: tv.x + vw, y0: tvFp.y1, y1: tvFp.y1 + D };
                else if (fy < 0) view = { x0: tv.x - vw, x1: tv.x + vw, y0: tvFp.y0 - D, y1: tvFp.y0 };
                else if (fx > 0) view = { x0: tvFp.x1, x1: tvFp.x1 + D, y0: tv.y - vw, y1: tv.y + vw };
                else view = { x0: tvFp.x0 - D, x1: tvFp.x0, y0: tv.y - vw, y1: tv.y + vw };
                out.push({ items: all, zones: [view], score, sig: `liv:${s}:${Math.round(t / 60)}:${D > 280 ? 1 : 0}`, internalZone: true });
              }
            }
          }
        }
      }
    }
  }
  return out.filter((u) => unitValid(ctx, u));
}

// Yemek masası + sandalyeler
function genDining(ctx, types, opts = {}) {
  const out = [];
  for (const type of types) {
    const c = CATALOG[type];
    const clear = c.clear;
    for (const vertical of [false, true]) {
      const tw = vertical ? c.d : c.w, th = vertical ? c.w : c.d;
      for (const wallSide of opts.allowWall ? [null, 'n', 's', 'w', 'e'] : [null]) {
        // sandalye yerleşimini kenarlara göre hesapla
        const sidesUsed = { n: true, s: true, w: true, e: true };
        if (wallSide) sidesUsed[wallSide] = false;
        const zm = {
          n: sidesUsed.n ? clear : 0, s: sidesUsed.s ? clear : 0,
          w: sidesUsed.w ? clear : 0, e: sidesUsed.e ? clear : 0,
        };
        // Masa uzun kenarlarına sandalye
        const longH = tw >= th; // uzun kenar yatay mı
        const xs = [];
        for (let x = ctx.R.x0 + zm.w + tw / 2; x <= ctx.R.x1 - zm.e - tw / 2 + EPS; x += 20) xs.push(x);
        const ys = [];
        for (let y = ctx.R.y0 + zm.n + th / 2; y <= ctx.R.y1 - zm.s - th / 2 + EPS; y += 20) ys.push(y);
        if (wallSide === 'n') { ys.length = 0; ys.push(ctx.R.y0 + th / 2); }
        if (wallSide === 's') { ys.length = 0; ys.push(ctx.R.y1 - th / 2); }
        if (wallSide === 'w') { xs.length = 0; xs.push(ctx.R.x0 + tw / 2); }
        if (wallSide === 'e') { xs.length = 0; xs.push(ctx.R.x1 - tw / 2); }
        for (const x of xs) for (const y of ys) {
          const table = makeItem(type, x, y, vertical ? 90 : 0, ctx.room.id);
          const items = [table];
          const chairs = chairPositions(type, x, y, tw, th, longH, sidesUsed);
          if (!chairs) continue;
          for (const ch of chairs) items.push(makeItem('chair', ch.x, ch.y, ch.rot, ctx.room.id));
          const fp = { x0: x - tw / 2, y0: y - th / 2, x1: x + tw / 2, y1: y + th / 2 };
          const zone = { x0: fp.x0 - zm.w, y0: fp.y0 - zm.n, x1: fp.x1 + zm.e, y1: fp.y1 + zm.s };
          const u = { items, zones: [zone], score: 0, sig: `din:${Math.round(x / 60)}:${Math.round(y / 60)}` };
          if (!inside(zone, ctx.R)) continue;
          let bad = false;
          for (const z of ctx.doorZones) if (rectsOverlap(zone, z)) { bad = true; break; }
          if (bad) continue;
          if (!unitValid(ctx, u)) continue;
          let score = { dining_6: 5, dining_4: 4, dining_2: 2.5 }[type];
          const dw = distToWindow(ctx, x, y);
          if (dw < 500) score += 1 * (1 - dw / 500);
          if (wallSide) score -= 0.3;
          u.score = score + (opts.bonus || 0);
          u.access = { pts: [{ x: zone.x0 + 1, y: y }, { x: zone.x1 - 1, y }, { x, y: zone.y0 + 1 }, { x, y: zone.y1 - 1 }].map((p) => ({ ...p, any: 'din' })), need: 1 };
          out.push(u);
        }
      }
    }
  }
  return out;
}

function chairPositions(type, x, y, tw, th, longH, used) {
  const c = CATALOG[type];
  const n = c.chairs;
  const res = [];
  const tuck = 12; // sandalye masanın altına biraz girer
  const chD = 50;
  const addLong = (count) => {
    const L = longH ? tw : th;
    for (const sideKey of longH ? ['n', 's'] : ['w', 'e']) {
      if (!used[sideKey]) continue;
      for (let i = 0; i < count; i++) {
        const t = -L / 2 + (L / count) * (i + 0.5);
        if (sideKey === 'n') res.push({ x: x + t, y: y - th / 2 - chD / 2 + tuck, rot: 0 });
        if (sideKey === 's') res.push({ x: x + t, y: y + th / 2 + chD / 2 - tuck, rot: 180 });
        if (sideKey === 'w') res.push({ x: x - tw / 2 - chD / 2 + tuck, y: y + t, rot: 270 });
        if (sideKey === 'e') res.push({ x: x + tw / 2 + chD / 2 - tuck, y: y + t, rot: 90 });
      }
    }
  };
  const addEnds = () => {
    for (const sideKey of longH ? ['w', 'e'] : ['n', 's']) {
      if (!used[sideKey]) continue;
      if (sideKey === 'w') res.push({ x: x - tw / 2 - chD / 2 + tuck, y, rot: 270 });
      if (sideKey === 'e') res.push({ x: x + tw / 2 + chD / 2 - tuck, y, rot: 90 });
      if (sideKey === 'n') res.push({ x, y: y - th / 2 - chD / 2 + tuck, rot: 0 });
      if (sideKey === 's') res.push({ x, y: y + th / 2 + chD / 2 - tuck, rot: 180 });
    }
  };
  // Not: sandalye "önü" masaya bakar: kuzeydeki sandalyenin önü güneye bakar → rot 0
  if (n === 6) { addLong(2); addEnds(); }
  else if (n === 4) { addLong(2); if (res.length < 4) addEnds(); }
  else { addLong(1); if (res.length < 2) addEnds(); }
  return res.length >= Math.min(n, 2) ? res.slice(0, n) : null;
}

// --------------------- Mutfak ---------------------

function freeIntervals(ctx, side, depth) {
  const si = ctx.sides[side];
  const strip = stripRect(ctx.R, side, si.a0, si.a1, 0, depth);
  let ivs = [[si.a0, si.a1]];
  const cut = (a, b) => {
    const n = [];
    for (const [x, y] of ivs) {
      if (b <= x || a >= y) { n.push([x, y]); continue; }
      if (a > x) n.push([x, a]);
      if (b < y) n.push([b, y]);
    }
    ivs = n;
  };
  for (const z of ctx.doorZones) {
    if (!rectsOverlap(strip, z)) continue;
    if (si.horiz) cut(z.x0, z.x1); else cut(z.y0, z.y1);
  }
  return ivs.filter(([a, b]) => b - a >= 30);
}

function genKitchen(ctx) {
  const out = [];
  const D = 60;
  const runsBySide = {};
  for (const s of SIDES) runsBySide[s] = freeIntervals(ctx, s, D);

  const configs = [];
  for (const s of SIDES) for (const iv of runsBySide[s]) if (iv[1] - iv[0] >= 200) configs.push({ name: 'düz', runs: [{ side: s, a: iv[0], b: iv[1] }] });
  // L: köşede birleşen iki duvar
  const reachesCorner = (s, iv, end) => {
    const si = ctx.sides[s];
    return end === 'start' ? Math.abs(iv[0] - si.a0) < 1 : Math.abs(iv[1] - si.a1) < 1;
  };
  // köşe: s duvarının hangi ucu, t duvarının hangi ucuyla buluşur
  const cornerEnds = { 'n-e': ['end', 'start'], 'e-s': ['end', 'end'], 's-w': ['start', 'end'], 'w-n': ['start', 'start'] };
  for (const [key, [endA, endB]] of Object.entries(cornerEnds)) {
    const [A, B] = key.split('-');
    for (const ivA of runsBySide[A]) for (const ivB of runsBySide[B]) {
      if (!reachesCorner(A, ivA, endA) || !reachesCorner(B, ivB, endB)) continue;
      // B'nin köşe ucunu D kadar kısalt (köşe A'ya ait)
      const rb = endB === 'start' ? { side: B, a: ivB[0] + D, b: ivB[1] } : { side: B, a: ivB[0], b: ivB[1] - D };
      if (rb.b - rb.a < 60 || ivA[1] - ivA[0] < 120) continue;
      configs.push({ name: 'L', runs: [{ side: A, a: ivA[0], b: ivA[1], corner: endA }, rb] });
    }
  }
  // Paralel (koridor tipi)
  for (const [A, B] of [['n', 's'], ['w', 'e']]) {
    const aisle = (A === 'n' ? ctx.H : ctx.W) - 2 * D;
    if (aisle < 100) continue;
    for (const ivA of runsBySide[A]) for (const ivB of runsBySide[B]) {
      if (ivA[1] - ivA[0] < 150 || ivB[1] - ivB[0] < 150) continue;
      configs.push({ name: 'paralel', runs: [{ side: A, a: ivA[0], b: ivA[1] }, { side: B, a: ivB[0], b: ivB[1] }] });
    }
  }

  for (const cfg of configs) {
    // Yerleştirme konumlarını (run, merkez) olarak tanımla
    const fridgeOpts = [];
    for (const run of cfg.runs) {
      const ends = [];
      if (run.corner !== 'start') ends.push(run.a + 37.5);
      if (run.corner !== 'end') ends.push(run.b - 37.5);
      for (const t of ends) {
        const fr = onWall(ctx, 'k_fridge', run.side, t);
        if (staticValid(ctx, fr)) fridgeOpts.push({ run, t, it: fr });
      }
    }
    if (!fridgeOpts.length) continue;
    for (const fo of fridgeOpts) {
      const frA = fo.t - 37.5, frB = fo.t + 37.5;
      // Eviye ve ocak konum adayları
      const pos = (run, w) => {
        const res = new Set();
        for (let t = run.a + w / 2; t <= run.b - w / 2 + EPS; t += 30) res.add(Math.round(t));
        res.add(Math.round(run.b - w / 2));
        for (const wc of windowCenters(ctx, run.side)) if (wc >= run.a + w / 2 && wc <= run.b - w / 2) res.add(Math.round(wc));
        return [...res];
      };
      const blockedByCorner = (run, a, b) => {
        if (run.corner === 'start') return a < run.a + D;
        if (run.corner === 'end') return b > run.b - D;
        return false;
      };
      for (const rs of cfg.runs) for (const ts of pos(rs, 80)) {
        const sa = ts - 40, sb = ts + 40;
        if (blockedByCorner(rs, sa, sb)) continue;
        if (rs === fo.run && sa < frB + 1 && sb > frA - 1) continue;
        const sink = onWall(ctx, 'k_sink', rs.side, ts);
        if (!staticValid(ctx, sink)) continue;
        for (const rt of cfg.runs) for (const tt of pos(rt, 60)) {
          const oa = tt - 30, ob = tt + 30;
          if (blockedByCorner(rt, oa, ob)) continue;
          if (rt === fo.run && oa < frB + 30 && ob > frA - 30) continue;
          if (rt === rs && oa < sb + 40 && ob > sa - 40) continue;
          if (oa < rt.a + 20 || ob > rt.b - 20) continue; // ocağın yanında tezgâh
          if (sideHasWindowOver(ctx, rt.side, oa - 10, ob + 10)) continue; // pencere altında ocak olmaz
          const stove = onWall(ctx, 'k_stove', rt.side, tt);
          if (!staticValid(ctx, stove)) continue;
          // Çalışma üçgeni
          const d1 = Math.hypot(fo.it.x - sink.x, fo.it.y - sink.y);
          const d2 = Math.hypot(sink.x - stove.x, sink.y - stove.y);
          const d3 = Math.hypot(stove.x - fo.it.x, stove.y - fo.it.y);
          const sum = d1 + d2 + d3;
          let score = 10;
          for (const d of [d1, d2, d3]) {
            if (d < 100) score -= (100 - d) / 30;
            if (d > 280) score -= (d - 280) / 60;
          }
          if (sum < 360) score -= (360 - sum) / 60;
          if (sum > 790) score -= (sum - 790) / 80;
          if (sideHasWindowOver(ctx, rs.side, sa, sb)) score += 2.2; // eviye pencere önünde
          let total = 0;
          for (const r of cfg.runs) total += r.b - r.a;
          score += Math.min(total, 700) / 200;
          if (cfg.name === 'L') score += 0.8;
          if (cfg.name === 'paralel') score -= 0.3;
          out.push({ cfg, fo, sink, stove, score, sig: `k:${cfg.name}:${cfg.runs.map((r) => r.side).join('')}:${fo.run.side}` });
        }
      }
    }
  }
  out.sort((a, b) => b.score - a.score);
  // Çeşitlilik: her imzadan en fazla 3 aday
  const per = {};
  const picked = [];
  for (const k of out) {
    per[k.sig] = (per[k.sig] || 0) + 1;
    if (per[k.sig] > 3) continue;
    picked.push(k);
    if (picked.length >= 30) break;
  }
  return picked.map((k) => kitchenItems(ctx, k)).filter((u) => u && unitValid(ctx, u));
}

function kitchenItems(ctx, k) {
  const items = [k.fo.it, k.sink, k.stove];
  const D = 60;
  for (const run of k.cfg.runs) {
    // dolu aralıklar
    const occ = [];
    for (const it of items) {
      if (it.rot !== rotForSide(run.side)) continue;
      const t = along(it, run.side);
      const w = it.w;
      if (t + w / 2 <= run.a + 1 || t - w / 2 >= run.b - 1) continue;
      occ.push([t - w / 2, t + w / 2]);
    }
    // köşe dolabı
    if (run.corner) {
      const t = run.corner === 'start' ? run.a + D / 2 : run.b - D / 2;
      items.push(onWall(ctx, 'k_corner', run.side, t));
      occ.push([t - D / 2, t + D / 2]);
    }
    occ.sort((a, b) => a[0] - b[0]);
    // boşlukları alt dolapla doldur; eviyenin yanına bulaşık makinesi
    let cur = run.a;
    const gaps = [];
    for (const [a, b] of occ) {
      if (a - cur >= 1) gaps.push([cur, a]);
      cur = Math.max(cur, b);
    }
    if (run.b - cur >= 1) gaps.push([cur, run.b]);
    let dwPlaced = items.some((i) => i.type === 'k_dishwasher');
    for (const [a, b] of gaps) {
      let len = b - a;
      if (len < 15) continue;
      let start = a;
      // bulaşık makinesi eviyeye bitişik boşlukta
      if (!dwPlaced && len >= 60 && k.sink.rot === rotForSide(run.side)) {
        const st = along(k.sink, run.side);
        if (Math.abs(st + 40 - a) < 2) { items.push(onWall(ctx, 'k_dishwasher', run.side, a + 30)); start = a + 60; len -= 60; dwPlaced = true; }
        else if (Math.abs(st - 40 - b) < 2) { items.push(onWall(ctx, 'k_dishwasher', run.side, b - 30)); len -= 60; dwPlaced = true; }
      }
      const end = start + len;
      const n = Math.max(1, Math.round(len / 60));
      const w = len / n;
      for (let i = 0; i < n; i++) {
        const t = start + w * (i + 0.5);
        if (w < 15) continue;
        items.push(onWall(ctx, 'k_base', run.side, t, { w: Math.round(w * 10) / 10 }));
      }
      void end;
    }
    // Üst dolaplar: pencere ve ocak üstü hariç, buzdolabı üstü hariç
    const si = ctx.sides[run.side];
    let ups = [[run.a, run.b]];
    const cut = (a, b) => {
      const n = [];
      for (const [x, y] of ups) {
        if (b <= x || a >= y) { n.push([x, y]); continue; }
        if (a > x) n.push([x, a]);
        if (b < y) n.push([b, y]);
      }
      ups = n;
    };
    for (const w of si.windows) cut(w.a - 10, w.b + 10);
    for (const it of items) {
      if (it.rot !== rotForSide(run.side)) continue;
      if (it.type === 'k_fridge' || it.type === 'k_stove') { const t = along(it, run.side); cut(t - it.w / 2, t + it.w / 2); }
    }
    for (const [a, b] of ups) {
      const len = b - a;
      if (len < 30) continue;
      const n = Math.max(1, Math.round(len / 60));
      const w = len / n;
      for (let i = 0; i < n; i++) items.push(onWall(ctx, 'k_upper', run.side, a + w * (i + 0.5), { w: Math.round(w * 10) / 10, d: 35, h: 70, elev: 150 }));
    }
    // Ocak üstü davlumbaz
  }
  const stoveSideHasUpper = true;
  void stoveSideHasUpper;
  const hood = onWall(ctx, 'k_upper', k.stove.rot === 0 ? 'n' : k.stove.rot === 90 ? 'e' : k.stove.rot === 180 ? 's' : 'w', along(k.stove, { 0: 'n', 90: 'e', 180: 's', 270: 'w' }[k.stove.rot]), { w: 60, d: 50, h: 45, elev: 165, hood: true });
  items.push(hood);
  const access = { pts: [], need: 0 };
  for (const it of [k.fo.it, k.sink, k.stove]) {
    const fr = frontRect(it, 31);
    access.pts.push({ x: (fr.x0 + fr.x1) / 2 + frontDir(it.rot)[0] * 0, y: (fr.y0 + fr.y1) / 2 + 0, all: true, dx: frontDir(it.rot)[0], dy: frontDir(it.rot)[1], fp: footprint(it) });
  }
  return { items, zones: [], score: k.score, sig: k.sig, access: kitchenAccess(access) };
}

function kitchenAccess(a) {
  return {
    pts: a.pts.map((p) => ({ x: p.dx ? (p.dx > 0 ? p.fp.x1 + 31 : p.fp.x0 - 31) : (p.fp.x0 + p.fp.x1) / 2, y: p.dy ? (p.dy > 0 ? p.fp.y1 + 31 : p.fp.y0 - 31) : (p.fp.y0 + p.fp.y1) / 2 })),
    need: 3,
  };
}

// --------------------- Banyo ---------------------

function genWet(ctx) {
  const out = [];
  const types = [];
  if (ctx.area >= 5 && ctx.maxDim >= 175) types.push('bathtub');
  types.push('shower', 'shower_s');
  for (const type of types) {
    const c = CATALOG[type];
    for (const s of SIDES) {
      const si = ctx.sides[s];
      for (const t of [si.a0 + c.w / 2, si.a1 - c.w / 2]) {
        const it = onWall(ctx, type, s, t);
        if (!staticValid(ctx, it)) continue;
        let score = type === 'bathtub' ? 6 : type === 'shower' ? 5 : 4.2;
        if (type === 'bathtub') {
          const len = si.a1 - si.a0;
          if (len - c.w < 12) score += 1.2; // duvardan duvara küvet
        }
        // kapıdan uzak olması tercih
        const dp = ctx.doorPoints[0];
        if (dp) score += Math.min(1, Math.hypot(dp.x - it.x, dp.y - it.y) / 300);
        out.push({ items: [it], score, sig: `wet:${type}:${s}:${t}` });
      }
    }
  }
  return out;
}

function genToilet(ctx, base) {
  const out = [];
  const c = CATALOG.toilet;
  for (const s of SIDES) {
    const si = ctx.sides[s];
    for (const t of slotsAlong(si, 80)) {
      const it = onWall(ctx, 'toilet', s, t);
      if (!staticValid(ctx, it)) continue;
      const zone = stripRect(ctx.R, s, t - 40, t + 40, 0, c.d + 55);
      if (!inside(zone, ctx.R)) continue;
      let score = base;
      const dp = ctx.doorPoints[0];
      if (dp) score += Math.min(1.2, Math.hypot(dp.x - it.x, dp.y - it.y) / 250); // kapı açılınca ilk görünen olmasın
      if (sideDoorNear(ctx, OPP[s], t - 40, t + 40, 0)) score -= 1; // kapının tam karşısı
      out.push({ items: [it], zones: [zone], score, sig: `wc:${s}:${Math.round(t / 40)}` });
    }
  }
  return out;
}

// ------------------------------------------------------------------
// Programlar
// ------------------------------------------------------------------

function program(ctx) {
  const t = ctx.room.type;
  const A = ctx.area;
  const U = (key, gen, opt = {}) => ({ key, gen, required: !!opt.required, label: opt.label || key, skipPenalty: opt.skipPenalty ?? (opt.required ? 12 : 0) });
  switch (t) {
    case 'yatak':
      return [
        U('bed', () => genBed(ctx, {}), { required: true, label: 'Yatak' }),
        U('wardrobe', () => genWardrobe(ctx), { required: true, label: 'Gardırop', skipPenalty: 6 }),
        U('dresser', () => genWallItem(ctx, 'dresser', 1.4, { score: (it) => (distToWindow(ctx, it.x, it.y) < 250 ? 0.4 : 0) }), { label: 'Şifonyer' }),
        U('plant', () => genCornerItem(ctx, 'plant', 0.3)),
      ];
    case 'cocuk':
      return [
        U('bed', () => genBed(ctx, { kid: true }), { required: true, label: 'Yatak' }),
        U('wardrobe', () => genWardrobe(ctx), { required: true, label: 'Gardırop', skipPenalty: 5 }),
        U('desk', () => genDesk(ctx, 3), { label: 'Çalışma masası', skipPenalty: 2 }),
        U('shelf', () => genWallItem(ctx, 'bookshelf', 1.2)),
      ];
    case 'calisma':
      return [
        U('desk', () => genDesk(ctx, 6), { required: true, label: 'Çalışma masası' }),
        U('shelf', () => genWallItem(ctx, 'bookshelf', 2)),
        U('shelf2', () => genWallItem(ctx, 'bookshelf', 1)),
        U('arm', () => genCornerItem(ctx, 'armchair', 1)),
        U('plant', () => genCornerItem(ctx, 'plant', 0.3)),
      ];
    case 'salon': {
      const hasDiningRoom = ctx.project.rooms.some((r) => r.type === 'yemek');
      const units = [U('living', () => genLiving(ctx), { required: true, label: 'Oturma grubu' })];
      if (!hasDiningRoom && A >= 20) units.push(U('dining', () => genDining(ctx, A >= 26 ? ['dining_6', 'dining_4'] : ['dining_4'], { bonus: 2 }), { label: 'Yemek masası', skipPenalty: 2 }));
      units.push(U('sideboard', () => genWallItem(ctx, 'sideboard', 1.2)));
      units.push(U('plant', () => genCornerItem(ctx, 'plant', 0.5)));
      units.push(U('lamp', () => genCornerItem(ctx, 'floor_lamp', 0.4)));
      return units;
    }
    case 'yemek':
      return [
        U('dining', () => genDining(ctx, ['dining_6', 'dining_4', 'dining_2']), { required: true, label: 'Yemek masası' }),
        U('sideboard', () => genWallItem(ctx, 'sideboard', 2)),
        U('plant', () => genCornerItem(ctx, 'plant', 0.4)),
      ];
    case 'mutfak':
      return [
        U('kitchen', () => genKitchen(ctx), { required: true, label: 'Mutfak tezgâhı' }),
        U('dining', () => genDining(ctx, ['dining_4', 'dining_2'], { allowWall: true }), { label: 'Kahvaltı masası' }),
      ];
    case 'banyo':
      return [
        U('wet', () => genWet(ctx), { required: true, label: 'Duş / küvet' }),
        U('toilet', () => genToilet(ctx, 4), { required: true, label: 'Klozet' }),
        U('basin', () => [...genWallItem(ctx, 'basin', 3.2), ...genWallItem(ctx, 'basin_s', 2.2)], { required: true, label: 'Lavabo' }),
        U('washer', () => genWallItem(ctx, 'washer', 1.6), { label: 'Çamaşır makinesi' }),
      ];
    case 'wc':
      return [
        U('toilet', () => genToilet(ctx, 4), { required: true, label: 'Klozet' }),
        U('basin', () => [...genWallItem(ctx, 'basin_s', 2.5), ...genWallItem(ctx, 'basin', 2)], { required: true, label: 'Lavabo' }),
      ];
    case 'antre': {
      if (ctx.minDim < 110) return [];
      const entry = ctx.doorPoints.find((d) => /giri/i.test(d.op.name || ''));
      if (!entry) return ctx.minDim >= 150 ? [U('console', () => genWallItem(ctx, 'console', 0.6))] : [];
      const near = (it) => (entry ? Math.max(0, 2.5 - Math.hypot(entry.x - it.x, entry.y - it.y) / 120) : 0);
      const units = [U('shoe', () => genWallItem(ctx, 'shoe_cabinet', 2, { score: near }), { label: 'Ayakkabılık' })];
      if (ctx.minDim >= 130) units.push(U('console', () => genWallItem(ctx, 'console', 0.6)));
      if (ctx.minDim >= 150) units.push(U('plant', () => genCornerItem(ctx, 'plant', 0.3)));
      return units;
    }
    case 'balkon':
      return [
        U('set', () => genDining(ctx, ['dining_2'], { allowWall: true }).map((u) => ({ ...u, items: u.items.map((i) => (i.type === 'dining_2' ? { ...i, type: 'balcony_set', w: 70, d: 70, h: 72 } : i)) })), { label: 'Balkon masası' }),
        U('plant', () => genCornerItem(ctx, 'plant', 0.5)),
      ];
  }
  return [];
}

// ------------------------------------------------------------------
// Durum kontrolü & dolaşım analizi
// ------------------------------------------------------------------

function compatible(state, unit) {
  for (const it of unit.items) {
    if (!solid(it)) continue;
    const fp = footprint(it);
    const fr = frontDepth(it) > 0 ? clipRect(frontRect(it, frontDepth(it)), expand(fp, 9999)) : null;
    for (const o of state.solids) {
      if (rectsOverlap(fp, o.fp)) return false;
      if (fr && rectsOverlap(fr, o.fp)) return false;
      if (o.fr && rectsOverlap(fp, o.fr)) return false;
    }
    for (const z of state.zones) if (rectsOverlap(fp, z)) return false;
  }
  for (const z of unit.zones || []) for (const o of state.solids) if (rectsOverlap(z, o.fp)) return false;
  // Halılar üst üste binmesin
  for (const it of unit.items) {
    if (!isFloor(it)) continue;
    const fp = footprint(it);
    for (const o of state.items) if (isFloor(o) && rectsOverlap(fp, footprint(o))) return false;
  }
  return true;
}

function addUnit(state, unit, extraScore) {
  const solids = state.solids.slice();
  for (const it of unit.items) {
    if (!solid(it)) continue;
    const f = frontDepth(it);
    solids.push({ fp: footprint(it), fr: f > 0 ? frontRect(it, f) : null });
  }
  return {
    items: state.items.concat(unit.items),
    solids,
    zones: state.zones.concat(unit.zones || []),
    access: unit.access ? state.access.concat([unit.access]) : state.access.concat(defaultAccess(unit)),
    score: state.base + extraScore,
    base: state.base + extraScore,
    sig: state.sig.concat([unit.sig || '']),
    skipped: state.skipped,
  };
}

function defaultAccess(unit) {
  const res = [];
  for (const it of unit.items) {
    if (!solid(it)) continue;
    const f = frontDepth(it);
    if (f < 40) continue;
    const fp = footprint(it);
    const [dx, dy] = frontDir(it.rot);
    const x = dx ? (dx > 0 ? fp.x1 + 31 : fp.x0 - 31) : (fp.x0 + fp.x1) / 2;
    const y = dy ? (dy > 0 ? fp.y1 + 31 : fp.y0 - 31) : (fp.y0 + fp.y1) / 2;
    res.push({ pts: [{ x, y }], need: 1 });
  }
  return res;
}

const CELL = 10;
const HALF = 3; // 60 cm'lik geçiş: merkezden 3 hücre

export function circulation(ctx, state) {
  const { R } = ctx;
  const cols = Math.max(1, Math.round((R.x1 - R.x0) / CELL));
  const rows = Math.max(1, Math.round((R.y1 - R.y0) / CELL));
  const blocked = new Uint8Array(cols * rows);
  for (const s of state.solids) {
    const i0 = Math.max(0, Math.floor((s.fp.x0 - R.x0) / CELL + 0.01));
    const i1 = Math.min(cols, Math.ceil((s.fp.x1 - R.x0) / CELL - 0.01));
    const j0 = Math.max(0, Math.floor((s.fp.y0 - R.y0) / CELL + 0.01));
    const j1 = Math.min(rows, Math.ceil((s.fp.y1 - R.y0) / CELL - 0.01));
    for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) blocked[j * cols + i] = 1;
  }
  // toplam alan tablosu
  const W1 = cols + 1;
  const sat = new Int32Array(W1 * (rows + 1));
  for (let j = 0; j < rows; j++) {
    let rowSum = 0;
    for (let i = 0; i < cols; i++) {
      rowSum += blocked[j * cols + i];
      sat[(j + 1) * W1 + i + 1] = sat[j * W1 + i + 1] + rowSum;
    }
  }
  const pass = new Uint8Array(cols * rows);
  for (let j = HALF; j <= rows - HALF; j++) {
    for (let i = HALF; i <= cols - HALF; i++) {
      const a = i - HALF, b = i + HALF, c = j - HALF, d = j + HALF;
      const sum = sat[d * W1 + b] - sat[c * W1 + b] - sat[d * W1 + a] + sat[c * W1 + a];
      if (sum === 0) pass[j * cols + i] = 1;
    }
  }
  const cellOf = (x, y) => {
    const i = Math.round((x - R.x0) / CELL), j = Math.round((y - R.y0) / CELL);
    return [i, j];
  };
  // en yakın geçilebilir hücre (2 hücre tolerans)
  const snap = (x, y) => {
    const [i, j] = cellOf(x, y);
    let best = -1, bd = 99;
    for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) {
      const ii = i + di, jj = j + dj;
      if (ii < 0 || jj < 0 || ii >= cols || jj >= rows) continue;
      if (!pass[jj * cols + ii]) continue;
      const dd = Math.abs(di) + Math.abs(dj);
      if (dd < bd) { bd = dd; best = jj * cols + ii; }
    }
    return best;
  };
  // BFS
  const comp = new Int32Array(cols * rows).fill(-1);
  let compId = 0;
  const compSize = [];
  const queue = new Int32Array(cols * rows);
  for (let k = 0; k < cols * rows; k++) {
    if (!pass[k] || comp[k] >= 0) continue;
    let qh = 0, qt = 0;
    queue[qt++] = k; comp[k] = compId;
    while (qh < qt) {
      const c = queue[qh++];
      const i = c % cols, j = (c / cols) | 0;
      const nb = [i > 0 ? c - 1 : -1, i < cols - 1 ? c + 1 : -1, j > 0 ? c - cols : -1, j < rows - 1 ? c + cols : -1];
      for (const n of nb) if (n >= 0 && pass[n] && comp[n] < 0) { comp[n] = compId; queue[qt++] = n; }
    }
    compSize.push(qt);
    compId++;
  }
  let penalty = 0;
  const problems = [];
  // Ana bileşen: kapıların bulunduğu bileşen (yoksa en büyük)
  const doorCells = ctx.doorPoints.map((p) => snap(p.x, p.y));
  let main = -1;
  for (const dc of doorCells) if (dc >= 0) { main = comp[dc]; break; }
  if (main < 0) {
    if (ctx.doorPoints.length) { penalty += 15; problems.push('Kapı önü kapalı'); }
    let best = -1;
    compSize.forEach((s, i) => { if (best < 0 || s > compSize[best]) best = i; });
    main = best;
  }
  for (const dc of doorCells) if (dc < 0 || comp[dc] !== main) { penalty += 10; problems.push('Kapılar arası geçiş yok'); }
  for (const acc of state.access) {
    let ok = 0;
    for (const p of acc.pts) {
      const c = snap(p.x, p.y);
      if (c >= 0 && comp[c] === main) ok++;
    }
    const need = acc.need === 3 ? acc.pts.length : acc.need;
    if (ok < need) { penalty += 3.5 * (need - ok); problems.push('Erişim'); }
    if (acc.bonusAll && ok === acc.pts.length) penalty -= 1.5;
  }
  // Serbest alan oranı (ferahlık)
  const freeRatio = main >= 0 ? compSize[main] / (cols * rows) : 0;
  return { penalty, freeRatio, problems };
}

// ------------------------------------------------------------------
// Arama
// ------------------------------------------------------------------

export function layoutRoom(project, room, nAlt = 3) {
  const ctx = buildContext(project, room);
  const units = program(ctx);
  let beam = [{ items: [], solids: [], zones: [], access: [], score: 0, base: 0, sig: [], skipped: [] }];
  if (!units.length) return [{ items: [], score: 0, notes: [] }];

  for (const unit of units) {
    const cands = unit.gen();
    const next = [];
    for (const st of beam) {
      let any = false;
      for (const c of cands) {
        if (!compatible(st, c)) continue;
        any = true;
        next.push(addUnit(st, c, c.score));
      }
      // Birimi atlama seçeneği
      const sk = { ...st, base: st.base - unit.skipPenalty, score: st.base - unit.skipPenalty, sig: st.sig.concat(['-']), skipped: st.skipped.concat(unit.required || unit.skipPenalty > 1 ? [unit.label] : []) };
      if (!unit.required || !any) next.push(sk);
    }
    // Ön eleme + dolaşım puanı
    next.sort((a, b) => b.base - a.base);
    const pre = diversify(next, BEAM * 3, unit === units[0] ? 2 : 4);
    for (const st of pre) {
      const c = circulation(ctx, st);
      st.circ = c;
      st.score = st.base - c.penalty + c.freeRatio * 2;
    }
    pre.sort((a, b) => b.score - a.score);
    beam = diversify(pre, BEAM, 6);
  }
  beam.sort((a, b) => b.score - a.score);
  // farklı alternatifler: ilk birimin imzası farklı olsun
  const res = [];
  const seen = new Set();
  for (const st of beam) {
    const key = st.sig.slice(0, 2).join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    res.push(st);
    if (res.length >= nAlt) break;
  }
  for (const st of beam) {
    if (res.length >= nAlt) break;
    if (!res.includes(st)) res.push(st);
  }
  return res.map((st) => ({
    items: st.items.map(cleanItem),
    score: st.score,
    notes: [...new Set(st.skipped)].map((l) => `${room.name}: ${l} için uygun yer bulunamadı`)
      .concat(st.circ && st.circ.penalty >= 10 ? [`${room.name}: geçiş alanı dar`] : []),
  }));
}

function diversify(list, n, perSig) {
  const out = [];
  const count = {};
  for (const st of list) {
    const k = st.sig[0] || '';
    count[k] = (count[k] || 0) + 1;
    if (count[k] > perSig && list.length > n) continue;
    out.push(st);
    if (out.length >= n) break;
  }
  return out;
}

function cleanItem(it) {
  const o = { ...it };
  delete o._front;
  return o;
}

// Tüm proje için: 3 alternatif
export function layoutProject(project, roomIds = null, nAlt = 3) {
  const rooms = project.rooms.filter((r) => !roomIds || roomIds.includes(r.id));
  const perRoom = rooms.map((r) => ({ room: r, alts: layoutRoom(project, r, nAlt) }));
  const options = [];
  for (let k = 0; k < nAlt; k++) {
    const furniture = [];
    const notes = [];
    let score = 0;
    for (const pr of perRoom) {
      const alt = pr.alts[Math.min(k, pr.alts.length - 1)];
      if (!alt) continue;
      furniture.push(...alt.items);
      notes.push(...alt.notes);
      score += alt.score;
    }
    options.push({ furniture, notes, score });
  }
  return options;
}
