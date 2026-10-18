// Otomatik mobilya yerleşim motoru.
//
// Yerleşim "mekân" bazında yapılır: ara duvarı kaldırılmış bitişik odalar
// (ör. iki parçadan çizilmiş L salon, salon + Amerikan mutfak) tek bir mekândır.
// Mekânın zemini dikdörtgenlerin birleşimidir; duvarları bu birleşimin dış hattıdır.
//
// Her oda tipi için bir "program" (yerleştirilecek birimler listesi) vardır.
// Her birim (ör. yatak + komodinler, koltuk takımı + TV, mutfak tezgâhı) için
// kurallara uyan aday yerleşimler üretilir. Işın araması (beam search) ile
// birimler sırayla eklenir; her adımda adaylar iç mimari kurallarına göre
// puanlanır ve en iyi durumlar tutulur. Sonunda yürüme yolu analizi
// (60 cm'lik geçişle kapılara ve mobilyaların önüne ulaşılabiliyor mu?) yapılır
// ve birbirinden farklı en iyi 3 seçenek döndürülür.

import { CATALOG, makeItem } from './catalog.js';
import { footprint, frontDir, rectsOverlap, openingsForRoom, rotForSide, computeSpaces, activeOpenings, roomLabel } from './model.js';

const BEAM = 24;
const STEP = 10;
const EPS = 0.5;

const SIDES = ['n', 'e', 's', 'w'];
const OPP = { n: 's', s: 'n', e: 'w', w: 'e' };
const NEXT = { n: 'e', e: 's', s: 'w', w: 'n' };

// ------------------------------------------------------------------
// Geometri: dikdörtgen birleşimleri
// ------------------------------------------------------------------

function subtractRect(p, q) {
  if (q.x0 >= p.x1 || q.x1 <= p.x0 || q.y0 >= p.y1 || q.y1 <= p.y0) return [p];
  const out = [];
  if (q.y0 > p.y0) out.push({ x0: p.x0, x1: p.x1, y0: p.y0, y1: q.y0 });
  if (q.y1 < p.y1) out.push({ x0: p.x0, x1: p.x1, y0: q.y1, y1: p.y1 });
  const y0 = Math.max(p.y0, q.y0), y1 = Math.min(p.y1, q.y1);
  if (q.x0 > p.x0) out.push({ x0: p.x0, x1: q.x0, y0, y1 });
  if (q.x1 < p.x1) out.push({ x0: q.x1, x1: p.x1, y0, y1 });
  return out;
}

function pointIn(rects, x, y, tol = EPS) {
  return rects.some((q) => x >= q.x0 - tol && x <= q.x1 + tol && y >= q.y0 - tol && y <= q.y1 + tol);
}

// r tamamen mekânın zemininde mi?
function inside(r, ctx) {
  const R = ctx.R;
  if (r.x0 < R.x0 - EPS || r.y0 < R.y0 - EPS || r.x1 > R.x1 + EPS || r.y1 > R.y1 + EPS) return false;
  if (ctx.single) return true;
  const p0 = { x0: r.x0 + EPS, y0: r.y0 + EPS, x1: r.x1 - EPS, y1: r.y1 - EPS };
  if (p0.x1 <= p0.x0 || p0.y1 <= p0.y0) return pointIn(ctx.rects, (r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2);
  let pieces = [p0];
  for (const q of ctx.rects) {
    pieces = pieces.flatMap((p) => subtractRect(p, q));
    if (!pieces.length) return true;
  }
  return pieces.every((p) => p.x1 - p.x0 < 1 || p.y1 - p.y0 < 1);
}

function cutIntervals(ivs, a, b) {
  const n = [];
  for (const [x, y] of ivs) {
    if (b <= x || a >= y) { n.push([x, y]); continue; }
    if (a > x) n.push([x, a]);
    if (b < y) n.push([b, y]);
  }
  return n;
}

// Birleşimin dış hattı: her biri bir yöne bakan duvar parçaları.
// side 'n' = parçanın kuzeyinde duvar var (eleman sırtını buna verir, önü +y).
function outline(rects) {
  const segs = [];
  for (const Q of rects) {
    for (const side of SIDES) {
      const horiz = side === 'n' || side === 's';
      const line = { n: Q.y0, s: Q.y1, w: Q.x0, e: Q.x1 }[side];
      let ivs = [horiz ? [Q.x0, Q.x1] : [Q.y0, Q.y1]];
      for (const P of rects) {
        if (P === Q) continue;
        let covers;
        if (side === 'n') covers = P.y0 < line - 0.5 && P.y1 >= line - 0.5;
        else if (side === 's') covers = P.y1 > line + 0.5 && P.y0 <= line + 0.5;
        else if (side === 'w') covers = P.x0 < line - 0.5 && P.x1 >= line - 0.5;
        else covers = P.x1 > line + 0.5 && P.x0 <= line + 0.5;
        if (!covers) continue;
        ivs = horiz ? cutIntervals(ivs, P.x0, P.x1) : cutIntervals(ivs, P.y0, P.y1);
      }
      for (const [a, b] of ivs) if (b - a >= 1) segs.push({ side, line, a0: a, a1: b });
    }
  }
  segs.sort((p, q) => (p.side < q.side ? -1 : p.side > q.side ? 1 : p.line - q.line || p.a0 - q.a0));
  const out = [];
  for (const s of segs) {
    const last = out[out.length - 1];
    if (last && last.side === s.side && Math.abs(last.line - s.line) < 0.5 && s.a0 <= last.a1 + 0.5) last.a1 = Math.max(last.a1, s.a1);
    else out.push({ ...s });
  }
  return out.map((s) => ({ ...s, horiz: s.side === 'n' || s.side === 's', rot: rotForSide(s.side), doors: [], windows: [] }));
}

// Duvardan içeri doğru, duvar boyunca [a,b] ve derinlik [d0,d1] olan dikdörtgen
function stripRect(si, a, b, d0, d1) {
  const L = si.line;
  switch (si.side) {
    case 'n': return { x0: a, x1: b, y0: L + d0, y1: L + d1 };
    case 's': return { x0: a, x1: b, y0: L - d1, y1: L - d0 };
    case 'w': return { x0: L + d0, x1: L + d1, y0: a, y1: b };
    case 'e': return { x0: L - d1, x1: L - d0, y0: a, y1: b };
  }
}

function pointAt(si, t, depth) {
  switch (si.side) {
    case 'n': return [t, si.line + depth];
    case 's': return [t, si.line - depth];
    case 'w': return [si.line + depth, t];
    case 'e': return [si.line - depth, t];
  }
}

// ------------------------------------------------------------------
// Mekân bağlamı
// ------------------------------------------------------------------

function roomRectOf(r) {
  return { x0: r.x, y0: r.y, x1: r.x + r.w, y1: r.y + r.h };
}

export function buildSpaceContext(project, space) {
  const rects = space.rects.map((q) => ({ x0: q.x0, y0: q.y0, x1: q.x1, y1: q.y1 }));
  const R = {
    x0: Math.min(...rects.map((q) => q.x0)), y0: Math.min(...rects.map((q) => q.y0)),
    x1: Math.max(...rects.map((q) => q.x1)), y1: Math.max(...rects.map((q) => q.y1)),
  };
  const walls = outline(rects);
  const doorZones = [];
  const windowStrips = [];
  const doorPoints = [];
  const active = activeOpenings(project);
  const seen = new Set();
  for (const room of space.rooms) {
    for (const o of openingsForRoom(project, room, active)) {
      const horiz = o.side === 'n' || o.side === 's';
      const line = { n: room.y, s: room.y + room.h, w: room.x, e: room.x + room.w }[o.side];
      const a = (horiz ? room.x : room.y) + o.offset, b = a + o.width;
      const key = `${o.op.id}:${o.side}:${Math.round(line)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      let seg = null, best = 0;
      for (const s of walls) {
        if (s.side !== o.side || Math.abs(s.line - line) > 1) continue;
        const ov = Math.min(b, s.a1) - Math.max(a, s.a0);
        if (ov > best) { best = ov; seg = s; }
      }
      const si = seg || { side: o.side, line };
      if (o.op.kind === 'door') {
        if (seg) seg.doors.push({ a, b, op: o.op });
        const depth = o.swingIn ? Math.max(o.width + 5, 75) : 75;
        doorZones.push(stripRect(si, a - 5, b + 5, 0, depth));
        const [px, py] = pointAt(si, (a + b) / 2, 35);
        doorPoints.push({ x: px, y: py, op: o.op });
      } else {
        if (seg) seg.windows.push({ a, b, sill: o.op.sill ?? 90, op: o.op });
        windowStrips.push({ rect: stripRect(si, a - 5, b + 5, 0, 35), sill: o.op.sill ?? 90, side: o.side, a, b });
      }
    }
  }
  // Dolaşım ızgarası için mekân dışı hücreler
  const cols = Math.max(1, Math.round((R.x1 - R.x0) / CELL));
  const rows = Math.max(1, Math.round((R.y1 - R.y0) / CELL));
  const outMask = new Uint8Array(cols * rows);
  if (rects.length > 1) {
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      if (!pointIn(rects, R.x0 + (i + 0.5) * CELL, R.y0 + (j + 0.5) * CELL, 0)) outMask[j * cols + i] = 1;
    }
  }
  return {
    project, space, rects, R, walls, doorZones, windowStrips, doorPoints,
    single: rects.length === 1,
    mixed: space.mixed,
    grid: { cols, rows, outMask },
    W: R.x1 - R.x0, H: R.y1 - R.y0,
  };
}

// Belirli bir oda türü için bağlam (karma mekânlarda her tür kendi bölümüne yerleşir)
function typedContext(base, type) {
  const rooms = base.space.rooms.filter((r) => r.type === type);
  const area = base.mixed ? rooms.reduce((s, r) => s + r.w * r.h, 0) / 10000 : base.space.area;
  const minDim = Math.max(...rooms.map((r) => Math.min(r.w, r.h)));
  const maxDim = base.mixed ? Math.max(...rooms.map((r) => Math.max(r.w, r.h))) : Math.max(base.W, base.H);
  const home = rooms.map((r) => { const q = roomRectOf(r); return { x0: q.x0 - 25, y0: q.y0 - 25, x1: q.x1 + 25, y1: q.y1 + 25 }; });
  return { ...base, type, room: rooms[0], typeRooms: rooms, area, minDim, maxDim, home, merged: base.space.rooms.length > 1 };
}

// Geriye dönük uyumluluk: tek oda için bağlam
export function buildContext(project, room) {
  const sp = computeSpaces(project).byRoom.get(room.id);
  return typedContext(buildSpaceContext(project, sp), room.type);
}

// ------------------------------------------------------------------
// Yardımcılar
// ------------------------------------------------------------------

function frontRect(it, depth) {
  const fp = footprint(it);
  const [dx, dy] = frontDir(it.rot);
  if (dy > 0) return { x0: fp.x0, x1: fp.x1, y0: fp.y1, y1: fp.y1 + depth };
  if (dy < 0) return { x0: fp.x0, x1: fp.x1, y0: fp.y0 - depth, y1: fp.y0 };
  if (dx > 0) return { x0: fp.x1, x1: fp.x1 + depth, y0: fp.y0, y1: fp.y1 };
  return { x0: fp.x0 - depth, x1: fp.x0, y0: fp.y0, y1: fp.y1 };
}

// Duvara sırtı dayalı eleman
function onWall(ctx, type, si, t, extra = {}) {
  const c = CATALOG[type];
  const w = extra.w ?? c.w, d = extra.d ?? c.d;
  const [x, y] = pointAt(si, t, d / 2);
  return makeItem(type, x, y, si.rot, ctx.room.id, { w, d, ...extra });
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

// Mekâna göre sabit (durumdan bağımsız) geçerlilik
function staticValid(ctx, it) {
  const fp = footprint(it);
  if (!inside(fp, ctx)) return false;
  if (!solid(it)) return true;
  for (const z of ctx.doorZones) if (rectsOverlap(fp, z)) return false;
  for (const ws of ctx.windowStrips) if (it.h > ws.sill + 2 && rectsOverlap(fp, ws.rect)) return false;
  const f = frontDepth(it);
  if (f > 0) {
    const fr = frontRect(it, Math.min(f, 60));
    if (!inside(fr, ctx)) return false;
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

function windowCenters(si) {
  return si.windows.map((w) => (w.a + w.b) / 2);
}

function distToWindow(ctx, x, y) {
  let best = Infinity;
  for (const ws of ctx.windowStrips) {
    const cx = (ws.rect.x0 + ws.rect.x1) / 2, cy = (ws.rect.y0 + ws.rect.y1) / 2;
    best = Math.min(best, Math.hypot(cx - x, cy - y));
  }
  return best;
}

function winOver(si, a, b) {
  return !!si && si.windows.some((w) => w.a < b && w.b > a);
}

function doorNear(si, a, b, margin) {
  return !!si && si.doors.some((d) => d.a < b + margin && d.b > a - margin);
}

// si duvarının t noktasından bakınca karşıda kalan en yakın duvar
function facing(ctx, si, t) {
  const opp = OPP[si.side];
  let best = null, bd = Infinity;
  for (const s2 of ctx.walls) {
    if (s2.side !== opp || t < s2.a0 - EPS || t > s2.a1 + EPS) continue;
    const d = si.side === 'n' || si.side === 'w' ? s2.line - si.line : si.line - s2.line;
    if (d > 0 && d < bd) { bd = d; best = s2; }
  }
  return best ? { seg: best, dist: bd } : null;
}

function along(it, side) {
  return side === 'n' || side === 's' ? it.x : it.y;
}

// ------------------------------------------------------------------
// Birim (unit) üreteçleri — her biri [{items, zones, score, sig}] döndürür
// ------------------------------------------------------------------

function unitValid(ctx, u) {
  for (const it of u.items) if (!staticValid(ctx, it)) return false;
  for (const z of u.zones || []) if (!inside(z, ctx)) return false;
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
    for (const si of ctx.walls) {
      const s = si.side;
      for (const t of slotsAlong(si, c.w)) {
        const bed = onWall(ctx, type, si, t, { _front: double ? 70 : 60 });
        if (!staticValid(ctx, bed)) continue;
        const L = t - c.w / 2, Rr = t + c.w / 2;
        const ns = CATALOG.nightstand;
        const left = onWall(ctx, 'nightstand', si, L - ns.w / 2 - 2);
        const right = onWall(ctx, 'nightstand', si, Rr + ns.w / 2 + 2);
        const lOk = staticValid(ctx, left), rOk = staticValid(ctx, right);
        const gapL = L - si.a0, gapR = si.a1 - Rr;
        const variants = [];
        if (lOk && rOk) variants.push([left, right]);
        if (lOk) variants.push([left]);
        if (rOk) variants.push([right]);
        variants.push([]);
        const fc = facing(ctx, si, t);
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
          if (doorNear(si, L - 45, Rr + 45, 0)) score -= 1.5;
          // Yatak kapının tam karşısında (ayakucu kapıya bakar) — hafif ceza
          if (fc && doorNear(fc.seg, L, Rr, 0)) score -= 0.6;
          // Pencere karşıda: sabah ışığı, hoş manzara
          if (fc && winOver(fc.seg, L - 50, Rr + 50)) score += 0.4;
          out.push({ items: [bed, ...ns2], zones: [], score, sig: `bed:${s}:${Math.round(t / 40)}`, access: bedAccess(bed, double) });
        }
      }
    }
  });
  return out.filter((u) => unitValid(ctx, u));
}

function bedAccess(bed, double) {
  const fp = footprint(bed);
  const [, dy] = frontDir(bed.rot);
  const pts = [];
  const cx = (fp.x0 + fp.x1) / 2, cy = (fp.y0 + fp.y1) / 2;
  if (dy !== 0) pts.push({ x: fp.x0 - 31, y: cy, any: 'bed' }, { x: fp.x1 + 31, y: cy, any: 'bed' });
  else pts.push({ x: cx, y: fp.y0 - 31, any: 'bed' }, { x: cx, y: fp.y1 + 31, any: 'bed' });
  return { pts, need: 1, bonusAll: double };
}

function genWardrobe(ctx) {
  const out = [];
  const types = ['wardrobe_240', 'wardrobe_200', 'wardrobe_160', 'wardrobe_120', 'wardrobe_90'];
  for (const type of types) {
    const c = CATALOG[type];
    for (const si of ctx.walls) {
      for (const t of slotsAlong(si, c.w)) {
        const it = onWall(ctx, type, si, t);
        if (!staticValid(ctx, it)) continue;
        let score = c.w / 60;
        const L = t - c.w / 2, Rr = t + c.w / 2;
        if (L - si.a0 < 3 || si.a1 - Rr < 3) score += 0.8; // köşeye yaslı, gömme dolap etkisi
        out.push({ items: [it], score, sig: `wd:${si.side}:${Math.round(t / 50)}` });
      }
    }
  }
  return out;
}

function genWallItem(ctx, type, baseScore, opts = {}) {
  const out = [];
  const c = CATALOG[type];
  for (const si of ctx.walls) {
    for (const t of slotsAlong(si, c.w, windowCenters(si))) {
      const it = onWall(ctx, type, si, t);
      if (!staticValid(ctx, it)) continue;
      let score = baseScore;
      if (opts.score) score += opts.score(it, si, t);
      out.push({ items: [it], score, sig: `${type}:${si.side}:${Math.round(t / 50)}` });
    }
  }
  return out;
}

function genCornerItem(ctx, type, baseScore) {
  const out = [];
  const c = CATALOG[type];
  for (const si of ctx.walls) {
    for (const t of [si.a0 + c.w / 2 + 5, si.a1 - c.w / 2 - 5]) {
      const it = onWall(ctx, type, si, t);
      if (!staticValid(ctx, it)) continue;
      out.push({ items: [it], score: baseScore, sig: `${type}:${si.side}:${Math.round(t)}` });
    }
  }
  return out;
}

function genDesk(ctx, baseScore) {
  const out = [];
  for (const type of ['desk', 'desk_s']) {
    const c = CATALOG[type];
    for (const si of ctx.walls) {
      for (const t of slotsAlong(si, c.w, windowCenters(si))) {
        const desk = onWall(ctx, type, si, t);
        if (!staticValid(ctx, desk)) continue;
        const [dx, dy] = frontDir(desk.rot);
        const ch = makeItem('office_chair', desk.x + dx * (c.d / 2 + 15), desk.y + dy * (c.d / 2 + 15), (desk.rot + 180) % 360, ctx.room.id);
        let score = baseScore + (type === 'desk' ? 0.5 : 0);
        const dw = distToWindow(ctx, desk.x, desk.y);
        if (dw < 400) score += 2 * (1 - dw / 400); // doğal ışık
        out.push({ items: [desk, ch], score, sig: `desk:${si.side}:${Math.round(t / 50)}` });
      }
    }
  }
  return out.filter((u) => unitValid(ctx, u));
}

// Koltuk takımı + orta sehpa + halı + TV ünitesi (+ berjerler)
function genLiving(ctx) {
  const out = [];
  const big = ctx.area >= 20 && ctx.minDim >= 380;
  const sofaTypes = big ? ['sofa_l', 'sofa_3', 'sofa_2'] : ctx.minDim >= 300 ? ['sofa_3', 'sofa_2'] : ['sofa_2'];
  const tvTypes = ctx.minDim >= 320 ? ['tv_unit', 'tv_unit_s'] : ['tv_unit_s'];

  for (const tvType of tvTypes) {
    const tvc = CATALOG[tvType];
    for (const si of ctx.walls) {
      const s = si.side;
      for (const t of slotsAlong(si, tvc.w)) {
        const tv = onWall(ctx, tvType, si, t);
        if (!staticValid(ctx, tv)) continue;
        const fc = facing(ctx, si, t);
        const depthAvail = fc ? fc.dist : Infinity;
        for (const sofaType of sofaTypes) {
          const sc = CATALOG[sofaType];
          for (const mirror of sofaType === 'sofa_l' ? [false, true] : [false]) {
            // Koltuk TV'nin karşısında; mesafeyi dene. Karşı duvara dayalı varyant da üret.
            const dists = [];
            const wallDist = depthAvail - tvc.d - sc.d; // koltuk sırtı karşı duvarda
            if (wallDist >= 200 && wallDist <= 360) dists.push({ D: wallDist, wall: true });
            for (const D of [230, 260, 300]) if (D < wallDist - 40) dists.push({ D, wall: false });
            for (const { D, wall } of dists) {
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
              const ct = makeItem('coffee_table', tv.x + fx * ctOff, tv.y + fy * ctOff, tv.rot, ctx.room.id);
              if (D - 42 - ctc.d >= 70 && staticValid(ctx, ct)) items.push(ct);
              // halı
              const rugType = sofaType === 'sofa_l' || sc.w > 200 ? 'rug_l' : 'rug';
              const rc = CATALOG[rugType];
              const rugOff = tvc.d / 2 + D - rc.d / 2 + 25;
              const rug = makeItem(rugType, tv.x + fx * rugOff, tv.y + fy * rugOff, tv.rot, ctx.room.id);
              if (inside(footprint(rug), ctx)) items.push(rug);
              // berjerler: sehpanın iki yanında, ona dönük
              const arm = [];
              const ac = CATALOG.armchair;
              for (const sgn of [-1, 1]) {
                const lat = sc.w / 2 + ac.d / 2 - 10;
                const mid = tvc.d / 2 + D - 60;
                const ax = tv.x + fx * mid + (fy !== 0 ? sgn * lat : 0);
                const ay = tv.y + fy * mid + (fx !== 0 ? sgn * lat : 0);
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
                if (winOver(si, t - tvc.w, t + tvc.w)) score -= 2.5; // TV arkasında pencere: parlama
                if (si.doors.length) score -= 0.6;
                score += as.length * 1.0;
                if (!items.find((i) => i.type === 'coffee_table')) score -= 1.5;
                const all = [...items, ...as];
                // TV ile koltuk arasındaki görüş alanı boş kalmalı
                const vw = Math.min(sc.w, tvc.w + 40) / 2;
                const tvFp = footprint(tv);
                let view;
                if (fy > 0) view = { x0: tv.x - vw, x1: tv.x + vw, y0: tvFp.y1, y1: tvFp.y1 + D };
                else if (fy < 0) view = { x0: tv.x - vw, x1: tv.x + vw, y0: tvFp.y0 - D, y1: tvFp.y0 };
                else if (fx > 0) view = { x0: tvFp.x1, x1: tvFp.x1 + D, y0: tv.y - vw, y1: tv.y + vw };
                else view = { x0: tvFp.x0 - D, x1: tvFp.x0, y0: tv.y - vw, y1: tv.y + vw };
                out.push({ items: all, zones: [view], score, sig: `liv:${s}:${Math.round(t / 60)}:${D > 280 ? 1 : 0}`, homeN: 2 });
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
  const R = ctx.R;
  for (const type of types) {
    const c = CATALOG[type];
    const clear = c.clear;
    for (const vertical of [false, true]) {
      const tw = vertical ? c.d : c.w, th = vertical ? c.w : c.d;
      const longH = tw >= th;
      const variants = [{ wall: null }];
      if (opts.allowWall) for (const si of ctx.walls) variants.push({ wall: si });
      for (const { wall } of variants) {
        const sidesUsed = { n: true, s: true, w: true, e: true };
        if (wall) sidesUsed[wall.side] = false;
        const zm = { n: sidesUsed.n ? clear : 0, s: sidesUsed.s ? clear : 0, w: sidesUsed.w ? clear : 0, e: sidesUsed.e ? clear : 0 };
        const pos = [];
        if (!wall) {
          const area = (R.x1 - R.x0) * (R.y1 - R.y0);
          const step = area > 400000 ? 30 : 20;
          for (let x = R.x0 + zm.w + tw / 2; x <= R.x1 - zm.e - tw / 2 + EPS; x += step)
            for (let y = R.y0 + zm.n + th / 2; y <= R.y1 - zm.s - th / 2 + EPS; y += step) pos.push([x, y]);
        } else {
          const len = wall.horiz ? tw : th;
          const depth = wall.horiz ? th : tw;
          for (const t of slotsAlong(wall, len + 2 * clear)) pos.push(pointAt(wall, t, depth / 2));
        }
        for (const [x, y] of pos) {
          const table = makeItem(type, x, y, vertical ? 90 : 0, ctx.room.id);
          const items = [table];
          const chairs = chairPositions(type, x, y, tw, th, longH, sidesUsed);
          if (!chairs) continue;
          for (const ch of chairs) items.push(makeItem('chair', ch.x, ch.y, ch.rot, ctx.room.id));
          const fp = { x0: x - tw / 2, y0: y - th / 2, x1: x + tw / 2, y1: y + th / 2 };
          const zone = { x0: fp.x0 - zm.w, y0: fp.y0 - zm.n, x1: fp.x1 + zm.e, y1: fp.y1 + zm.s };
          if (!inside(zone, ctx)) continue;
          let bad = false;
          for (const z of ctx.doorZones) if (rectsOverlap(zone, z)) { bad = true; break; }
          if (bad) continue;
          const u = { items, zones: [zone], score: 0, sig: `din:${Math.round(x / 60)}:${Math.round(y / 60)}` };
          if (!unitValid(ctx, u)) continue;
          let score = { dining_6: 5, dining_4: 4, dining_2: 2.5 }[type];
          const dw = distToWindow(ctx, x, y);
          if (dw < 500) score += 1 * (1 - dw / 500);
          if (wall) score -= 0.3;
          u.score = score + (opts.bonus || 0);
          u.access = { pts: [{ x: zone.x0 + 1, y }, { x: zone.x1 - 1, y }, { x, y: zone.y0 + 1 }, { x, y: zone.y1 - 1 }].map((p) => ({ ...p, any: 'din' })), need: 1 };
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

function freeIntervals(ctx, si, depth) {
  const strip = stripRect(si, si.a0, si.a1, 0, depth);
  let ivs = [[si.a0, si.a1]];
  // Karma mekânda yalnızca kendi odasının duvarları
  if (ctx.mixed) {
    const keep = [];
    for (const r of ctx.typeRooms) {
      const onLine = si.horiz ? si.line >= r.y - 1 && si.line <= r.y + r.h + 1 : si.line >= r.x - 1 && si.line <= r.x + r.w + 1;
      if (!onLine) continue;
      const [ra, rb] = si.horiz ? [r.x, r.x + r.w] : [r.y, r.y + r.h];
      for (const [a, b] of ivs) if (Math.min(b, rb) - Math.max(a, ra) > 0) keep.push([Math.max(a, ra), Math.min(b, rb)]);
    }
    ivs = keep;
  }
  for (const z of ctx.doorZones) {
    if (!rectsOverlap(strip, z)) continue;
    ivs = si.horiz ? cutIntervals(ivs, z.x0, z.x1) : cutIntervals(ivs, z.y0, z.y1);
  }
  return ivs.filter(([a, b]) => b - a >= 30);
}

function endpoint(si, which) {
  const t = which === 'start' ? si.a0 : si.a1;
  return si.horiz ? [t, si.line] : [si.line, t];
}

// köşe: A duvarının hangi ucu, B duvarının hangi ucuyla buluşur (B = A'nın saat yönündeki komşusu)
const CORNER_ENDS = { n: ['end', 'start'], e: ['end', 'end'], s: ['start', 'end'], w: ['start', 'start'] };

function cornerOf(A, B) {
  if (NEXT[A.side] !== B.side) return null;
  const [eA, eB] = CORNER_ENDS[A.side];
  const pa = endpoint(A, eA), pb = endpoint(B, eB);
  if (Math.abs(pa[0] - pb[0]) > 1 || Math.abs(pa[1] - pb[1]) > 1) return null;
  return [eA, eB];
}

function reaches(si, iv, end) {
  return end === 'start' ? Math.abs(iv[0] - si.a0) < 1 : Math.abs(iv[1] - si.a1) < 1;
}

function trimRun(si, iv, end, D) {
  return end === 'start' ? { a: iv[0] + D, b: iv[1] } : { a: iv[0], b: iv[1] - D };
}

function genKitchen(ctx, opts = {}) {
  const out = [];
  const D = 60;
  const runs = new Map();
  for (const si of ctx.walls) runs.set(si, freeIntervals(ctx, si, D));

  const configs = [];
  for (const si of ctx.walls) for (const iv of runs.get(si)) if (iv[1] - iv[0] >= 200) configs.push({ name: 'düz', runs: [{ si, side: si.side, a: iv[0], b: iv[1] }] });
  // L: köşede birleşen iki duvar; U: iki köşe
  const Ls = [];
  for (const A of ctx.walls) for (const B of ctx.walls) {
    const ce = cornerOf(A, B);
    if (!ce) continue;
    const [endA, endB] = ce;
    for (const ivA of runs.get(A)) for (const ivB of runs.get(B)) {
      if (!reaches(A, ivA, endA) || !reaches(B, ivB, endB)) continue;
      const rb = trimRun(B, ivB, endB, D);
      if (rb.b - rb.a < 60 || ivA[1] - ivA[0] < 120) continue;
      const cfg = { name: 'L', runs: [{ si: A, side: A.side, a: ivA[0], b: ivA[1], corner: endA }, { si: B, side: B.side, ...rb }] };
      configs.push(cfg);
      Ls.push({ A, B, ivA, ivB, endA, endB });
    }
  }
  for (const l1 of Ls) for (const l2 of Ls) {
    if (l1.B !== l2.A || l1.ivB !== l2.ivA) continue;
    // orta duvar iki uçtan da köşe dolabına ayrılır
    const mid = l1.ivB;
    const a = mid[0] + (l1.endB === 'start' || l2.endA === 'start' ? D : 0);
    const b = mid[1] - (l1.endB === 'end' || l2.endA === 'end' ? D : 0);
    if (b - a < 60) continue;
    const cRun = trimRun(l2.B, l2.ivB, l2.endB, 0);
    if (cRun.b - cRun.a < 120 || l1.ivA[1] - l1.ivA[0] < 120) continue;
    // A ile C arasındaki koridor
    const gap = Math.abs(l1.A.line - l2.B.line) - 2 * D;
    if (gap < 120 || gap > 260) continue;
    configs.push({ name: 'U', runs: [
      { si: l1.A, side: l1.A.side, a: l1.ivA[0], b: l1.ivA[1], corner: l1.endA },
      { si: l1.B, side: l1.B.side, a, b },
      { si: l2.B, side: l2.B.side, a: l2.ivB[0], b: l2.ivB[1], corner: l2.endB },
    ] });
  }
  // Paralel (koridor tipi)
  for (const A of ctx.walls) {
    if (A.side !== 'n' && A.side !== 'w') continue;
    for (const B of ctx.walls) {
      if (B.side !== OPP[A.side]) continue;
      const dist = B.line - A.line;
      const aisle = dist - 2 * D;
      if (aisle < 100 || aisle > 200) continue;
      for (const ivA of runs.get(A)) for (const ivB of runs.get(B)) {
        if (ivA[1] - ivA[0] < 150 || ivB[1] - ivB[0] < 150) continue;
        if (Math.min(ivA[1], ivB[1]) - Math.max(ivA[0], ivB[0]) < 100) continue;
        configs.push({ name: 'paralel', runs: [{ si: A, side: A.side, a: ivA[0], b: ivA[1] }, { si: B, side: B.side, a: ivB[0], b: ivB[1] }] });
      }
    }
  }

  for (const cfg of configs) {
    const fridgeOpts = [];
    for (const run of cfg.runs) {
      const ends = [];
      if (run.corner !== 'start') ends.push(run.a + 37.5);
      if (run.corner !== 'end') ends.push(run.b - 37.5);
      for (const t of ends) {
        const fr = onWall(ctx, 'k_fridge', run.si, t);
        if (staticValid(ctx, fr)) fridgeOpts.push({ run, t, it: fr });
      }
    }
    if (!fridgeOpts.length) continue;
    for (const fo of fridgeOpts) {
      const frA = fo.t - 37.5, frB = fo.t + 37.5;
      const pos = (run, w) => {
        const res = new Set();
        for (let t = run.a + w / 2; t <= run.b - w / 2 + EPS; t += 30) res.add(Math.round(t));
        res.add(Math.round(run.b - w / 2));
        for (const wc of windowCenters(run.si)) if (wc >= run.a + w / 2 && wc <= run.b - w / 2) res.add(Math.round(wc));
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
        const sink = onWall(ctx, 'k_sink', rs.si, ts);
        if (!staticValid(ctx, sink)) continue;
        for (const rt of cfg.runs) for (const tt of pos(rt, 60)) {
          const oa = tt - 30, ob = tt + 30;
          if (blockedByCorner(rt, oa, ob)) continue;
          if (rt === fo.run && oa < frB + 30 && ob > frA - 30) continue;
          if (rt === rs && oa < sb + 40 && ob > sa - 40) continue;
          if (oa < rt.a + 20 || ob > rt.b - 20) continue; // ocağın yanında tezgâh
          if (winOver(rt.si, oa - 10, ob + 10)) continue; // pencere altında ocak olmaz
          const stove = onWall(ctx, 'k_stove', rt.si, tt);
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
          if (winOver(rs.si, sa, sb)) score += 2.2; // eviye pencere önünde
          let total = 0;
          for (const r of cfg.runs) total += r.b - r.a;
          score += Math.min(total, 700) / 200;
          if (cfg.name === 'L') score += 0.8;
          if (cfg.name === 'U') score += ctx.area >= 12 ? 1.0 : 0.3;
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
  const units = [];
  for (const k of picked) {
    const u = kitchenItems(ctx, k);
    if (!u || !unitValid(ctx, u)) continue;
    units.push(u);
    if (opts.island) {
      const iu = withIsland(ctx, k, u);
      if (iu) units.push(iu);
    }
  }
  return units;
}

function kitchenItems(ctx, k) {
  const items = [k.fo.it, k.sink, k.stove];
  const D = 60;
  for (const run of k.cfg.runs) {
    const occ = [];
    for (const it of items) {
      if (it.rot !== rotForSide(run.side) || Math.abs(lineOf(it, run.si) - run.si.line) > 2) continue;
      const t = along(it, run.side);
      const w = it.w;
      if (t + w / 2 <= run.a + 1 || t - w / 2 >= run.b - 1) continue;
      occ.push([t - w / 2, t + w / 2]);
    }
    // köşe dolabı
    if (run.corner) {
      const t = run.corner === 'start' ? run.a + D / 2 : run.b - D / 2;
      items.push(onWall(ctx, 'k_corner', run.si, t));
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
    const sinkHere = k.sink.rot === rotForSide(run.side) && Math.abs(lineOf(k.sink, run.si) - run.si.line) <= 2;
    for (const [a, b] of gaps) {
      let len = b - a;
      if (len < 15) continue;
      let start = a;
      if (!dwPlaced && len >= 60 && sinkHere) {
        const st = along(k.sink, run.side);
        if (Math.abs(st + 40 - a) < 2) { items.push(onWall(ctx, 'k_dishwasher', run.si, a + 30)); start = a + 60; len -= 60; dwPlaced = true; }
        else if (Math.abs(st - 40 - b) < 2) { items.push(onWall(ctx, 'k_dishwasher', run.si, b - 30)); len -= 60; dwPlaced = true; }
      }
      if (len < 15) continue;
      const n = Math.max(1, Math.round(len / 60));
      const w = len / n;
      for (let i = 0; i < n; i++) items.push(onWall(ctx, 'k_base', run.si, start + w * (i + 0.5), { w: Math.round(w * 10) / 10 }));
    }
    // Üst dolaplar: pencere, ocak ve buzdolabı üstü hariç
    let ups = [[run.a, run.b]];
    for (const w of run.si.windows) ups = cutIntervals(ups, w.a - 10, w.b + 10);
    for (const it of items) {
      if (it.rot !== rotForSide(run.side) || Math.abs(lineOf(it, run.si) - run.si.line) > 2) continue;
      if (it.type === 'k_fridge' || it.type === 'k_stove') { const t = along(it, run.side); ups = cutIntervals(ups, t - it.w / 2, t + it.w / 2); }
    }
    for (const [a, b] of ups) {
      const len = b - a;
      if (len < 30) continue;
      const n = Math.max(1, Math.round(len / 60));
      const w = len / n;
      for (let i = 0; i < n; i++) items.push(onWall(ctx, 'k_upper', run.si, a + w * (i + 0.5), { w: Math.round(w * 10) / 10, d: 35, h: 70, elev: 150 }));
    }
  }
  // Ocak üstü davlumbaz
  const stoveRun = k.cfg.runs.find((r) => r.side === { 0: 'n', 90: 'e', 180: 's', 270: 'w' }[k.stove.rot] && Math.abs(lineOf(k.stove, r.si) - r.si.line) <= 2);
  if (stoveRun) items.push(onWall(ctx, 'k_upper', stoveRun.si, along(k.stove, stoveRun.side), { w: 60, d: 50, h: 45, elev: 165, hood: true }));
  const pts = [k.fo.it, k.sink, k.stove].map((it) => {
    const fp = footprint(it);
    const [dx, dy] = frontDir(it.rot);
    return { x: dx ? (dx > 0 ? fp.x1 + 31 : fp.x0 - 31) : (fp.x0 + fp.x1) / 2, y: dy ? (dy > 0 ? fp.y1 + 31 : fp.y0 - 31) : (fp.y0 + fp.y1) / 2 };
  });
  return { items, zones: [], score: k.score, sig: k.sig, access: { pts, need: 3 }, homeN: 3, cfg: k.cfg };
}

// Elemanın sırtının dayandığı duvar çizgisi
function lineOf(it, si) {
  const fp = footprint(it);
  return { n: fp.y0, s: fp.y1, w: fp.x0, e: fp.x1 }[si.side];
}

// Açık mutfakta ada tezgâh + bar tabureleri
function withIsland(ctx, k, u) {
  const run = k.cfg.runs.slice().sort((a, b) => (b.b - b.a) - (a.b - a.a))[0];
  const len = run.b - run.a;
  const iw = len >= 260 ? 180 : 150;
  const id = 90, aisle = 110;
  const t = (run.a + run.b) / 2;
  const fc = facing(ctx, run.si, t);
  if (!fc || fc.dist < 60 + aisle + id + 75) return null;
  const rot = (rotForSide(run.side) + 180) % 360;
  const [ix, iy] = pointAt(run.si, t, 60 + aisle + id / 2);
  const island = makeItem('k_island', ix, iy, rot, ctx.room.id, { w: iw, _front: 0 });
  const stools = [];
  const n = iw >= 180 ? 3 : 2;
  for (let i = 0; i < n; i++) {
    const tt = t - iw / 2 + (iw / n) * (i + 0.5);
    const [sx, sy] = pointAt(run.si, tt, 60 + aisle + id + 12);
    stools.push(makeItem('bar_stool', sx, sy, rot, ctx.room.id));
  }
  const zones = [
    stripRect(run.si, t - iw / 2, t + iw / 2, 60, 60 + aisle), // çalışma koridoru
    stripRect(run.si, t - iw / 2 - 10, t + iw / 2 + 10, 60 + aisle + id, 60 + aisle + id + 75), // tabure arkası
  ];
  for (const z of zones) for (const dz of ctx.doorZones) if (rectsOverlap(z, dz)) return null;
  const nu = { ...u, items: [...u.items, island, ...stools], zones: [...u.zones, ...zones], score: u.score + 2.5, sig: u.sig + ':ada' };
  for (const it of [island, ...stools]) if (!staticValid(ctx, it)) return null;
  for (const z of zones) if (!inside(z, ctx)) return null;
  return nu;
}

// --------------------- Banyo ---------------------

function genWet(ctx) {
  const out = [];
  const types = [];
  if (ctx.area >= 5 && ctx.maxDim >= 175) types.push('bathtub');
  types.push('shower', 'shower_s');
  for (const type of types) {
    const c = CATALOG[type];
    for (const si of ctx.walls) {
      for (const t of [si.a0 + c.w / 2, si.a1 - c.w / 2]) {
        const it = onWall(ctx, type, si, t);
        if (!staticValid(ctx, it)) continue;
        let score = type === 'bathtub' ? 6 : type === 'shower' ? 5 : 4.2;
        if (type === 'bathtub' && si.a1 - si.a0 - c.w < 12) score += 1.2; // duvardan duvara küvet
        const dp = ctx.doorPoints[0];
        if (dp) score += Math.min(1, Math.hypot(dp.x - it.x, dp.y - it.y) / 300);
        out.push({ items: [it], score, sig: `wet:${type}:${si.side}:${Math.round(t)}` });
      }
    }
  }
  return out;
}

function genToilet(ctx, base) {
  const out = [];
  const c = CATALOG.toilet;
  for (const si of ctx.walls) {
    for (const t of slotsAlong(si, 80)) {
      const it = onWall(ctx, 'toilet', si, t);
      if (!staticValid(ctx, it)) continue;
      const zone = stripRect(si, t - 40, t + 40, 0, c.d + 55);
      if (!inside(zone, ctx)) continue;
      let score = base;
      const dp = ctx.doorPoints[0];
      if (dp) score += Math.min(1.2, Math.hypot(dp.x - it.x, dp.y - it.y) / 250); // kapı açılınca ilk görünen olmasın
      const fc = facing(ctx, si, t);
      if (fc && doorNear(fc.seg, t - 40, t + 40, 0)) score -= 1; // kapının tam karşısı
      out.push({ items: [it], zones: [zone], score, sig: `wc:${si.side}:${Math.round(t / 40)}` });
    }
  }
  return out;
}

// ------------------------------------------------------------------
// Programlar
// ------------------------------------------------------------------

function program(ctx) {
  const t = ctx.type;
  const A = ctx.area;
  const types = ctx.space.types;
  const U = (key, gen, opt = {}) => ({ key, gen, required: !!opt.required, label: opt.label || key, skipPenalty: opt.skipPenalty ?? (opt.required ? 12 : 0), order: opt.order ?? (opt.required ? 0 : 1) });
  switch (t) {
    case 'yatak': {
      const units = [
        U('bed', () => genBed(ctx, {}), { required: true, label: 'Yatak' }),
        U('wardrobe', () => genWardrobe(ctx), { required: true, label: 'Gardırop', skipPenalty: 6 }),
        U('dresser', () => genWallItem(ctx, 'dresser', 1.4, { score: (it) => (distToWindow(ctx, it.x, it.y) < 250 ? 0.4 : 0) }), { label: 'Şifonyer' }),
      ];
      // Geniş (birleşik) yatak odası: çalışma köşesi ve okuma koltuğu
      if (A >= 17) {
        units.push(U('desk', () => genDesk(ctx, 1.6), { label: 'Çalışma masası' }));
        units.push(U('arm', () => genCornerItem(ctx, 'armchair', 1.0)));
      }
      units.push(U('plant', () => genCornerItem(ctx, 'plant', 0.3)));
      return units;
    }
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
      if (!hasDiningRoom && A >= 20) units.push(U('dining', () => genDining(ctx, A >= 26 ? ['dining_6', 'dining_4'] : ['dining_4'], { bonus: 2 }), { label: 'Yemek masası', skipPenalty: 2, order: 0.5 }));
      units.push(U('sideboard', () => genWallItem(ctx, 'sideboard', 1.2)));
      if (A >= 30) units.push(U('shelf', () => genWallItem(ctx, 'bookshelf', 0.8)));
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
    case 'mutfak': {
      // Salon / yemek odasıyla birleşik (Amerikan) mutfakta yemek masası yerine ada tezgâh
      const openPlan = ctx.mixed && (types.includes('salon') || types.includes('yemek'));
      const roomy = A >= 14 && ctx.minDim >= 330;
      const units = [U('kitchen', () => genKitchen(ctx, { island: openPlan || roomy }), { required: true, label: 'Mutfak tezgâhı', order: -1 })];
      if (!openPlan) units.push(U('dining', () => genDining(ctx, ['dining_4', 'dining_2'], { allowWall: true }), { label: 'Kahvaltı masası' }));
      return units;
    }
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
      const near = (it) => Math.max(0, 2.5 - Math.hypot(entry.x - it.x, entry.y - it.y) / 120);
      const units = [U('shoe', () => genWallItem(ctx, 'shoe_cabinet', 2, { score: near }), { label: 'Ayakkabılık' })];
      if (ctx.minDim >= 130) units.push(U('console', () => genWallItem(ctx, 'console', 0.6)));
      if (ctx.minDim >= 150) units.push(U('plant', () => genCornerItem(ctx, 'plant', 0.3)));
      return units;
    }
    case 'balkon': {
      const units = [
        U('set', () => genDining(ctx, ['dining_2'], { allowWall: true }).map((u) => ({ ...u, items: u.items.map((i) => (i.type === 'dining_2' ? { ...i, type: 'balcony_set', w: 70, d: 70, h: 72 } : i)) })), { label: 'Balkon masası' }),
      ];
      if (A >= 6) units.push(U('lounge', () => genCornerItem(ctx, 'lounge_chair', 0.6)));
      units.push(U('plant', () => genCornerItem(ctx, 'plant', 0.5)));
      units.push(U('plant2', () => genCornerItem(ctx, 'plant', 0.3)));
      return units;
    }
  }
  return [];
}

// Karma mekânda birimin ana elemanları kendi odası tarafında olmalı
function homeFilter(ctx, cands) {
  if (!ctx.mixed) return cands;
  return cands.filter((u) => {
    const n = Math.min(u.homeN ?? 1, u.items.length);
    for (let i = 0; i < n; i++) if (!pointIn(ctx.home, u.items[i].x, u.items[i].y, 0)) return false;
    return true;
  });
}

const TYPE_PRIORITY = { mutfak: 0, salon: 1, yatak: 2, cocuk: 3, yemek: 4, calisma: 5, banyo: 6, wc: 7, antre: 8, balkon: 9 };

function spaceProgram(base) {
  const units = [];
  const types = base.space.types.slice().sort((a, b) => (TYPE_PRIORITY[a] ?? 9) - (TYPE_PRIORITY[b] ?? 9));
  types.forEach((type, ti) => {
    const ctx = typedContext(base, type);
    for (const u of program(ctx)) {
      const gen = u.gen;
      units.push({ ...u, gen: () => homeFilter(ctx, gen()), ti, ctx });
    }
  });
  // Önce zorunlu büyük birimler (tüm türler için), sonra tamamlayıcılar
  return units.map((u, i) => ({ u, i })).sort((a, b) => a.u.order - b.u.order || a.i - b.i).map((x) => x.u);
}

// ------------------------------------------------------------------
// Durum kontrolü & dolaşım analizi
// ------------------------------------------------------------------

function compatible(state, unit) {
  for (const it of unit.items) {
    if (!solid(it)) continue;
    const fp = footprint(it);
    const fr = frontDepth(it) > 0 ? frontRect(it, frontDepth(it)) : null;
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
  const { cols, rows, outMask } = ctx.grid;
  const blocked = outMask.slice();
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
  // en yakın geçilebilir hücre (2 hücre tolerans)
  const snap = (x, y) => {
    const i = Math.round((x - R.x0) / CELL), j = Math.round((y - R.y0) / CELL);
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
  let floorCells = cols * rows;
  if (!ctx.single) { floorCells = 0; for (let k = 0; k < outMask.length; k++) if (!outMask[k]) floorCells++; }
  const freeRatio = main >= 0 ? compSize[main] / Math.max(1, floorCells) : 0;
  return { penalty, freeRatio, problems };
}

// ------------------------------------------------------------------
// Arama
// ------------------------------------------------------------------

export function layoutSpace(project, space, nAlt = 3) {
  const base = buildSpaceContext(project, space);
  const units = spaceProgram(base);
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
      const c = circulation(base, st);
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
  const name = space.name;
  return res.map((st) => ({
    items: st.items.map((it) => cleanItem(it, space)),
    score: st.score,
    notes: [...new Set(st.skipped)].filter((l) => !(l === 'Yemek masası' && st.items.some((i) => i.type === 'k_island'))).map((l) => `${name}: ${l} için uygun yer bulunamadı`)
      .concat(st.circ && st.circ.penalty >= 10 ? [`${name}: geçiş alanı dar`] : []),
  }));
}

// Geriye dönük uyumluluk
export function layoutRoom(project, room, nAlt = 3) {
  return layoutSpace(project, computeSpaces(project).byRoom.get(room.id), nAlt);
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

// Elemanı merkezinin bulunduğu odaya bağla
function cleanItem(it, space) {
  const o = { ...it };
  delete o._front;
  if (space.rooms.length > 1) {
    const r = space.rooms.find((r) => o.x >= r.x - 0.5 && o.x <= r.x + r.w + 0.5 && o.y >= r.y - 0.5 && o.y <= r.y + r.h + 0.5);
    let best = r;
    if (!best) {
      let bd = Infinity;
      for (const q of space.rooms) {
        const dx = Math.max(q.x - o.x, 0, o.x - q.x - q.w), dy = Math.max(q.y - o.y, 0, o.y - q.y - q.h);
        const d = dx + dy;
        if (d < bd) { bd = d; best = q; }
      }
    }
    o.roomId = best.id;
  }
  return o;
}

// Tüm proje (ya da seçili odaların mekânları) için: 3 alternatif
export function layoutProject(project, roomIds = null, nAlt = 3) {
  const { spaces } = computeSpaces(project);
  const chosen = spaces.filter((sp) => !roomIds || sp.rooms.some((r) => roomIds.includes(r.id)));
  const perSpace = chosen.map((sp) => ({ space: sp, alts: layoutSpace(project, sp, nAlt) }));
  const options = [];
  for (let k = 0; k < nAlt; k++) {
    const furniture = [];
    const notes = [];
    let score = 0;
    for (const pr of perSpace) {
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

export { roomLabel };
