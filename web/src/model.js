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
    version: 1,
    createdAt: now,
    updatedAt: now,
    wallHeight: 270,
    style: { ...DEFAULT_STYLE },
    rooms: [],
    openings: [],
    furniture: [],
  };
}

export function roomLabel(room) {
  return room.name || ROOM_TYPES[room.type]?.label || 'Oda';
}

export function roomArea(room) {
  return (room.w * room.h) / 10000;
}

export function totalArea(project) {
  return project.rooms.reduce((s, r) => s + roomArea(r), 0);
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
export function openingsForRoom(project, room) {
  const list = [];
  for (const op of project.openings) {
    if (op.roomId === room.id) {
      list.push({ op, side: op.side, offset: op.offset, width: op.width, own: true, swingIn: op.swing !== 'out' });
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
      list.push({ op, side: nb.side, offset, width, own: false, swingIn: op.swing === 'out' });
    }
  }
  return list;
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
  const win = (r, side, offset, width = 140, opts = {}) =>
    p.openings.push({ id: uid('o'), kind: 'window', roomId: r.id, side, offset, width, sill: 90, height: 140, ...opts });
  return { p, room, door, win };
}

export const TEMPLATES = {
  bos: { label: 'Boş plan', desc: 'Sıfırdan çiz', build: () => ({ rooms: [], openings: [] }) },
  '1+1': {
    label: '1+1', desc: '≈ 55 m²',
    build() {
      const { p, room, door, win } = builder();
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
      door(salon, 'n', 200, 90);
      win(salon, 'n', 40, 140);
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
      const { p, room, door, win } = builder();
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
      const { p, room, door, win } = builder();
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
      door(salon, 'n', 260, 90);
      door(mutfak, 's', 40, 80);
      door(yatak, 'n', 320, 85);
      door(banyo, 'n', 20, 75);
      door(wc, 'w', 30, 70);
      door(cocuk, 'n', 20, 85);
      door(calisma, 'w', 170, 85);
      win(salon, 'n', 30, 160);
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
  return p;
}
