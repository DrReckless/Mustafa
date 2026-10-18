// Proje veri modeli. Tüm ölçüler santimetre (cm).
// Koordinatlar: x sağa, y aşağı (plan görünümü). 3B'de y → z olur.

export const ROOM_TYPES = {
  salon: { label: 'Salon', color: '#f3ead9', floor: 'wood' },
  yatak: { label: 'Yatak Odası', color: '#e6eef6', floor: 'wood' },
  cocuk: { label: 'Çocuk Odası', color: '#e9f3e6', floor: 'wood' },
  mutfak: { label: 'Mutfak', color: '#f6eadf', floor: 'tile' },
  banyo: { label: 'Banyo', color: '#e0f0f2', floor: 'tile' },
  wc: { label: 'WC', color: '#e0f0f2', floor: 'tile' },
  yemek: { label: 'Yemek Odası', color: '#f4e7e1', floor: 'wood' },
  calisma: { label: 'Çalışma Odası', color: '#ece8f4', floor: 'wood' },
  antre: { label: 'Antre / Hol', color: '#efefef', floor: 'tile' },
  balkon: { label: 'Balkon', color: '#eef2e8', floor: 'deck' },
};

export const ROOM_TYPE_ORDER = ['salon', 'yatak', 'cocuk', 'mutfak', 'banyo', 'wc', 'yemek', 'calisma', 'antre', 'balkon'];

export const DEFAULT_STYLE = {
  wood: 'mese', // mese | ceviz | acik | gri
  tile: 'beyaz', // beyaz | gri | bej | mermer
  wall: '#f2efe9',
  furniture: 'dogal', // dogal | ceviz | beyaz | antrasit
  fabric: 'gri', // gri | bej | lacivert | yesil | terracotta
  accent: 'dogal', // dogal | modern | sicak | canli (kırlent, tablo, halı renkleri)
  decor: true, // perde, tablo, aksesuar, sarkıt lamba
};

export const WALL_GAP = 10; // iki oda arasındaki iç duvar kalınlığı
export const EXT_WALL = 20; // dış duvar kalınlığı

let idCounter = 0;
export function uid(prefix = 'id') {
  idCounter = (idCounter + 1) % 1e6;
  return prefix + '_' + Date.now().toString(36) + '_' + idCounter.toString(36) + Math.random().toString(36).slice(2, 6);
}

export function newProject(name = 'Yeni Proje') {
  const now = Date.now();
  return {
    id: uid('p'),
    name,
    version: 2,
    createdAt: now,
    updatedAt: now,
    wallHeight: 270,
    style: { ...DEFAULT_STYLE },
    rooms: [],
    openings: [],
    furniture: [],
    partitions: {},
  };
}

export function roomLabel(room) {
  return room.name || ROOM_TYPES[room.type]?.label || 'Oda';
}

export function roomArea(room) {
  return (room.w * room.h) / 10000;
}

export function totalArea(project) {
  return computeSpaces(project).spaces.reduce((s, sp) => s + sp.area, 0);
}

export function fmtM(cm, digits = 2) {
  return (cm / 100).toFixed(digits).replace('.', ',');
}

export function fmtArea(m2) {
  return m2.toFixed(1).replace('.', ',') + ' m²';
}

export function bounds(project, pad = 0) {
  if (!project.rooms.length) return { x0: -pad, y0: -pad, x1: 500 + pad, y1: 400 + pad };
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const r of project.rooms) {
    x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y);
    x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h);
  }
  return { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
}

// ---------- Kapı / pencere geometrisi ----------

export function sideLength(room, side) {
  return side === 'n' || side === 's' ? room.w : room.h;
}

// Açıklığın dünya koordinatlarındaki doğru parçası ve odanın içine bakan normal
export function openingSegment(op, room) {
  const { x, y, w, h } = room;
  switch (op.side) {
    case 'n': return { ax: x + op.offset, ay: y, bx: x + op.offset + op.width, by: y, nx: 0, ny: 1, horiz: true };
    case 's': return { ax: x + op.offset, ay: y + h, bx: x + op.offset + op.width, by: y + h, nx: 0, ny: -1, horiz: true };
    case 'w': return { ax: x, ay: y + op.offset, bx: x, by: y + op.offset + op.width, nx: 1, ny: 0, horiz: false };
    case 'e': return { ax: x + w, ay: y + op.offset, bx: x + w, by: y + op.offset + op.width, nx: -1, ny: 0, horiz: false };
  }
  return null;
}

// Açıklığın öbür tarafındaki oda (varsa)
export function neighborRoom(project, op) {
  const room = project.rooms.find((r) => r.id === op.roomId);
  if (!room) return null;
  const s = openingSegment(op, room);
  const mid = s.horiz ? (s.ax + s.bx) / 2 : (s.ay + s.by) / 2;
  for (const r of project.rooms) {
    if (r.id === room.id) continue;
    if (s.horiz) {
      if (mid < r.x || mid > r.x + r.w) continue;
      if (op.side === 'n' && Math.abs(r.y + r.h - s.ay) <= 45) return { room: r, side: 's' };
      if (op.side === 's' && Math.abs(r.y - s.ay) <= 45) return { room: r, side: 'n' };
    } else {
      if (mid < r.y || mid > r.y + r.h) continue;
      if (op.side === 'w' && Math.abs(r.x + r.w - s.ax) <= 45) return { room: r, side: 'e' };
      if (op.side === 'e' && Math.abs(r.x - s.ax) <= 45) return { room: r, side: 'w' };
    }
  }
  return null;
}

// Bir odayı etkileyen tüm açıklıklar (kendi duvarındakiler + komşunun ortak duvardakileri),
// odanın kendi koordinatlarına çevrilmiş halde.
export function openingsForRoom(project, room, active = null) {
  const list = [];
  for (const op of active || activeOpenings(project)) {
    if (op.roomId === room.id) {
      list.push({ op, side: op.side, offset: op.offset, width: op.width, own: true, swingIn: !isSliding(op) && op.swing !== 'out' });
      continue;
    }
    const nb = neighborRoom(project, op);
    if (nb && nb.room.id === room.id) {
      const src = project.rooms.find((r) => r.id === op.roomId);
      const s = openingSegment(op, src);
      let offset = s.horiz ? s.ax - room.x : s.ay - room.y;
      let width = op.width;
      // Odanın sınırına kırp
      const len = sideLength(room, nb.side);
      if (offset < 0) { width += offset; offset = 0; }
      if (offset + width > len) width = len - offset;
      if (width <= 0) continue;
      list.push({ op, side: nb.side, offset, width, own: false, swingIn: !isSliding(op) && op.swing === 'out' });
    }
  }
  return list;
}

// ---------- Sürgülü kapı ----------

export function isSliding(op) {
  return op && op.kind === 'door' && op.variant === 'sliding';
}

// ---------- Açık mekânlar (ara duvarsız birleşen odalar) ----------
// Bitişik iki oda arasında duvar olup olmayacağı:
//  - kullanıcı seçimi (project.partitions["idA|idB"] = 'open' | 'wall') her zaman geçerlidir;
//  - seçim yoksa: aynı türden salon / mutfak / yemek / antre / balkon odaları,
//    aralarında kapı yoksa otomatik birleşir. Diğer türler duvarlı kalır.

export const AUTO_OPEN_TYPES = ['salon', 'mutfak', 'yemek', 'antre', 'balkon'];
const MAX_GAP = 2 * EXT_WALL;
const MIN_CONTACT = 30;

export function pairKey(a, b) {
  return a < b ? a + '|' + b : b + '|' + a;
}

// İki odanın temas ettiği kenar (aradaki boşluk duvar kalınlığı kadar olabilir)
export function roomContact(A, B) {
  const ov = (a0, a1, b0, b1) => [Math.max(a0, b0), Math.min(a1, b1)];
  const tryX = (P, Q) => {
    const g = Q.x - (P.x + P.w);
    if (g < -0.5 || g > MAX_GAP) return null;
    const [lo, hi] = ov(P.y, P.y + P.h, Q.y, Q.y + Q.h);
    if (hi - lo < MIN_CONTACT) return null;
    return { dir: 'x', first: P, second: Q, g0: P.x + P.w, g1: Math.max(Q.x, P.x + P.w), lo, hi, sideFirst: 'e', sideSecond: 'w' };
  };
  const tryY = (P, Q) => {
    const g = Q.y - (P.y + P.h);
    if (g < -0.5 || g > MAX_GAP) return null;
    const [lo, hi] = ov(P.x, P.x + P.w, Q.x, Q.x + Q.w);
    if (hi - lo < MIN_CONTACT) return null;
    return { dir: 'y', first: P, second: Q, g0: P.y + P.h, g1: Math.max(Q.y, P.y + P.h), lo, hi, sideFirst: 's', sideSecond: 'n' };
  };
  return tryX(A, B) || tryX(B, A) || tryY(A, B) || tryY(B, A);
}

export function contactRect(c) {
  return c.dir === 'x' ? { x0: c.g0, x1: c.g1, y0: c.lo, y1: c.hi } : { x0: c.lo, x1: c.hi, y0: c.g0, y1: c.g1 };
}

// Açıklık bu temas kenarının üzerinde mi?
function openingOnContact(op, c) {
  let room, side;
  if (op.roomId === c.first.id) { room = c.first; side = c.sideFirst; }
  else if (op.roomId === c.second.id) { room = c.second; side = c.sideSecond; }
  else return false;
  if (op.side !== side) return false;
  const s = openingSegment(op, room);
  const a = s.horiz ? s.ax : s.ay, b = s.horiz ? s.bx : s.by;
  const o = Math.min(b, c.hi) - Math.max(a, c.lo);
  return o > Math.min(20, (b - a) / 2);
}

export function defaultPartition(project, c) {
  const A = c.first, B = c.second;
  if (A.type !== B.type || !AUTO_OPEN_TYPES.includes(A.type)) return 'wall';
  // Aralarında kapı varsa duvar vardır
  if (project.openings.some((op) => op.kind === 'door' && openingOnContact(op, c))) return 'wall';
  return 'open';
}

export function partitionOf(project, c) {
  const v = project.partitions?.[pairKey(c.first.id, c.second.id)];
  return v === 'open' || v === 'wall' ? v : defaultPartition(project, c);
}

const spaceCache = new WeakMap();

// Odaları açık mekânlara grupla. Sonuç proje içeriği değişene kadar önbellekte tutulur.
export function computeSpaces(project) {
  const key = JSON.stringify([project.rooms, project.partitions || null, project.openings.filter((o) => o.kind === 'door').map((o) => [o.roomId, o.side, o.offset, o.width])]);
  const hit = spaceCache.get(project);
  if (hit && hit.key === key) return hit.value;
  const rooms = project.rooms;
  const contacts = [];
  for (let i = 0; i < rooms.length; i++) for (let j = i + 1; j < rooms.length; j++) {
    const c = roomContact(rooms[i], rooms[j]);
    if (!c) continue;
    c.state = partitionOf(project, c);
    c.auto = !project.partitions?.[pairKey(c.first.id, c.second.id)];
    contacts.push(c);
  }
  const parent = new Map(rooms.map((r) => [r.id, r.id]));
  const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  for (const c of contacts) if (c.state === 'open') parent.set(find(c.first.id), find(c.second.id));
  const groups = new Map();
  for (const r of rooms) {
    const k = find(r.id);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }
  const spaces = [];
  const byRoom = new Map();
  for (const list of groups.values()) {
    const sorted = list.slice().sort((a, b) => b.w * b.h - a.w * a.h);
    const primary = sorted[0];
    const ids = new Set(list.map((r) => r.id));
    const gaps = contacts.filter((c) => c.state === 'open' && ids.has(c.first.id) && ids.has(c.second.id) && c.g1 - c.g0 > 0.5).map(contactRect);
    const rects = list.map((r) => ({ x0: r.x, y0: r.y, x1: r.x + r.w, y1: r.y + r.h, roomId: r.id })).concat(gaps.map((g) => ({ ...g, gap: true })));
    const area = rects.reduce((s, q) => s + (q.x1 - q.x0) * (q.y1 - q.y0), 0) / 10000;
    const types = [...new Set(sorted.map((r) => r.type))];
    let name;
    if (types.length === 1) {
      // "Salon 2" yerine "Salon": numarasız adı tercih et
      const plain = sorted.find((r) => !/\s\d+$/.test(roomLabel(r)));
      name = roomLabel(plain || primary);
    }
    else {
      const names = [];
      for (const t of types) {
        const of = sorted.filter((r) => r.type === t);
        names.push(roomLabel(of.find((r) => !/\s\d+$/.test(roomLabel(r))) || of[0]));
      }
      name = names.join(' + ');
    }
    const sp = { id: primary.id, rooms: sorted, primary, type: primary.type, types, mixed: types.length > 1, name, rects, gaps, area };
    spaces.push(sp);
    for (const r of list) byRoom.set(r.id, sp);
  }
  const value = { spaces, byRoom, contacts };
  spaceCache.set(project, { key, value });
  return value;
}

export function spaceOf(project, roomId) {
  return computeSpaces(project).byRoom.get(roomId) || null;
}

// Verilen odaların bulunduğu mekânlardaki tüm oda kimlikleri
export function spaceRoomIds(project, roomIds) {
  const { byRoom } = computeSpaces(project);
  const out = new Set();
  for (const id of roomIds) {
    const sp = byRoom.get(id);
    if (sp) sp.rooms.forEach((r) => out.add(r.id)); else out.add(id);
  }
  return [...out];
}

// Bir odanın komşuları ve aradaki duvar durumu (özellik paneli için)
export function roomNeighbors(project, room) {
  return computeSpaces(project).contacts
    .filter((c) => c.first.id === room.id || c.second.id === room.id)
    .map((c) => ({ room: c.first.id === room.id ? c.second : c.first, state: c.state, auto: c.auto, key: pairKey(c.first.id, c.second.id) }));
}

// Açık bir kenarın üzerinde kalan (artık duvarı olmayan) açıklıklar hariç
export function activeOpenings(project) {
  const open = computeSpaces(project).contacts.filter((c) => c.state === 'open');
  if (!open.length) return project.openings;
  return project.openings.filter((op) => !open.some((c) => openingOnContact(op, c)));
}

// ---------- Mobilya geometrisi ----------
// rot: 0 = sırtı kuzey duvara (önü +y), 90 = sırtı doğuya, 180 = güneye, 270 = batıya.

export function footprint(f) {
  const swap = f.rot === 90 || f.rot === 270;
  const fw = swap ? f.d : f.w;
  const fd = swap ? f.w : f.d;
  return { x0: f.x - fw / 2, y0: f.y - fd / 2, x1: f.x + fw / 2, y1: f.y + fd / 2 };
}

export function frontDir(rot) {
  switch (rot) {
    case 0: return [0, 1];
    case 90: return [-1, 0];
    case 180: return [0, -1];
    case 270: return [1, 0];
  }
  return [0, 1];
}

export function rotForSide(side) {
  return { n: 0, e: 90, s: 180, w: 270 }[side];
}

export function rectsOverlap(a, b, eps = 0.5) {
  return a.x0 < b.x1 - eps && a.x1 > b.x0 + eps && a.y0 < b.y1 - eps && a.y1 > b.y0 + eps;
}

export function pointInRect(px, py, r) {
  return px >= r.x0 && px <= r.x1 && py >= r.y0 && py <= r.y1;
}

export function roomRect(room) {
  return { x0: room.x, y0: room.y, x1: room.x + room.w, y1: room.y + room.h };
}

export function roomAt(project, px, py) {
  for (let i = project.rooms.length - 1; i >= 0; i--) {
    const r = project.rooms[i];
    if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) return r;
  }
  return null;
}

export function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

// ---------- Hazır şablonlar ----------

function builder() {
  const p = { rooms: [], openings: [] };
  const room = (type, x, y, w, h, name) => {
    const r = { id: uid('r'), type, name: name || ROOM_TYPES[type].label, x, y, w, h };
    p.rooms.push(r);
    return r;
  };
  const door = (r, side, offset, width = 85, opts = {}) =>
    p.openings.push({ id: uid('o'), kind: 'door', roomId: r.id, side, offset, width, swing: 'in', hinge: 'start', height: 210, ...opts });
  const slider = (r, side, offset, width = 180) =>
    p.openings.push({ id: uid('o'), kind: 'door', variant: 'sliding', roomId: r.id, side, offset, width, height: 230, panels: 2, frame: 'antrasit', swing: 'in', hinge: 'start' });
  const win = (r, side, offset, width = 140, opts = {}) =>
    p.openings.push({ id: uid('o'), kind: 'window', roomId: r.id, side, offset, width, sill: 90, height: 140, ...opts });
  return { p, room, door, win, slider };
}

export const TEMPLATES = {
  bos: { label: 'Boş plan', desc: 'Sıfırdan çiz', build: () => ({ rooms: [], openings: [] }) },
  '1+1': {
    label: '1+1', desc: '≈ 55 m²',
    build() {
      const { p, room, door, win, slider } = builder();
      const salon = room('salon', 0, 0, 480, 420);
      const mutfak = room('mutfak', 490, 0, 260, 280);
      const antre = room('antre', 490, 290, 260, 130);
      const yatak = room('yatak', 0, 430, 400, 340);
      const banyo = room('banyo', 410, 430, 220, 220);
      room('balkon', 0, -170, 300, 160);
      door(antre, 'e', 15, 100, { name: 'Giriş' });
      door(antre, 'w', 20, 90);
      door(mutfak, 's', 30, 80);
      door(yatak, 'e', 20, 85);
      door(banyo, 'n', 10, 75, { swing: 'in' });
      slider(salon, 'n', 60, 180);
      win(salon, 'n', 320, 130);
      win(salon, 'w', 140, 160);
      win(mutfak, 'n', 70, 120, { sill: 100, height: 120 });
      win(yatak, 'w', 90, 150);
      win(banyo, 's', 80, 60, { sill: 150, height: 60 });
      return p;
    },
  },
  '2+1': {
    label: '2+1', desc: '≈ 90 m²',
    build() {
      const { p, room, door, win, slider } = builder();
      const salon = room('salon', 0, 0, 540, 450);
      const mutfak = room('mutfak', 550, 0, 350, 300);
      const antre = room('antre', 550, 310, 350, 140);
      const hol = room('antre', 0, 460, 900, 120, 'Hol');
      const yatak = room('yatak', 0, 590, 430, 380);
      const banyo = room('banyo', 440, 590, 210, 380);
      const cocuk = room('cocuk', 660, 590, 240, 380);
      door(antre, 'e', 20, 100, { name: 'Giriş' });
      door(antre, 's', 30, 90);
      door(salon, 'e', 340, 90);
      door(mutfak, 's', 30, 80);
      door(yatak, 'n', 330, 85);
      door(banyo, 'n', 20, 75);
      door(cocuk, 'n', 140, 85, { hinge: 'end' });
      win(salon, 'n', 160, 200);
      win(salon, 'w', 130, 160);
      win(mutfak, 'n', 120, 130, { sill: 100, height: 120 });
      win(yatak, 's', 130, 160);
      win(cocuk, 's', 60, 120);
      win(banyo, 's', 75, 60, { sill: 150, height: 60 });
      return p;
    },
  },
  '3+1': {
    label: '3+1', desc: '≈ 125 m²',
    build() {
      const { p, room, door, win, slider } = builder();
      const salon = room('salon', 0, 0, 620, 480);
      const mutfak = room('mutfak', 630, 0, 380, 320);
      const antre = room('antre', 630, 330, 380, 150);
      const hol = room('antre', 0, 490, 1010, 120, 'Hol');
      const yatak = room('yatak', 0, 620, 420, 400, 'Ebeveyn Yatak Odası');
      const banyo = room('banyo', 430, 620, 240, 250);
      const wc = room('wc', 430, 880, 240, 140, 'Ebeveyn WC');
      const cocuk = room('cocuk', 680, 620, 330, 400);
      const calisma = room('yatak', 1020, 330, 320, 280, 'Yatak Odası 2');
      room('balkon', 0, -170, 380, 160);
      door(antre, 'e', 20, 100, { name: 'Giriş' });
      door(antre, 's', 40, 100);
      door(salon, 'e', 380, 90);
      slider(salon, 'n', 190, 180);
      door(mutfak, 's', 40, 80);
      door(yatak, 'n', 320, 85);
      door(banyo, 'n', 20, 75);
      door(wc, 'w', 30, 70);
      door(cocuk, 'n', 20, 85);
      door(calisma, 'w', 170, 85);
      win(salon, 'n', 20, 140);
      win(salon, 'w', 150, 180);
      win(mutfak, 'n', 130, 130, { sill: 100, height: 120 });
      win(yatak, 's', 120, 170);
      win(cocuk, 's', 100, 140);
      win(calisma, 'e', 70, 140);
      win(banyo, 's', 90, 60, { sill: 150, height: 60 });
      return p;
    },
  },
};

export function projectFromTemplate(key, name) {
  const p = newProject(name);
  const t = TEMPLATES[key] || TEMPLATES.bos;
  const built = t.build();
  p.rooms = built.rooms;
  p.openings = built.openings;
  return p;
}

// Eski / eksik alanları tamamla
export function normalizeProject(p) {
  p.style = { ...DEFAULT_STYLE, ...(p.style || {}) };
  p.wallHeight = p.wallHeight || 270;
  p.rooms = p.rooms || [];
  p.openings = (p.openings || []).filter((o) => p.rooms.some((r) => r.id === o.roomId));
  p.furniture = p.furniture || [];
  p.partitions = p.partitions && typeof p.partitions === 'object' ? p.partitions : {};
  p.version = 2;
  return p;
}
