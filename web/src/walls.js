// Duvar geometrisi: odaların etrafında 5 cm'lik bir ızgara kurup
// "odaların dışında ama bir odaya 20 cm'den yakın" hücreleri duvar sayar.
// Böylece bitişik odalar arasındaki boşluk otomatik iç duvar olur,
// dış kenarlar 20 cm dış duvar olur. Kapı/pencere açıklıkları ızgaradan oyulur.

import { EXT_WALL, openingSegment } from './model.js';

const G = 5; // hücre boyutu (cm)
const CUT_DEPTH = 45;

// Hücre kodları
const EMPTY = 0, ROOM = 1, WALL = 2, DOOR = 3, WIN = 4;

export function computeWalls(project) {
  const rooms = project.rooms;
  if (!rooms.length) return { solids: [], doors: [], windows: [], parapets: [] };

  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const r of rooms) {
    x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y);
    x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h);
  }
  const pad = EXT_WALL + G * 2;
  const ox = Math.floor((x0 - pad) / G) * G;
  const oy = Math.floor((y0 - pad) / G) * G;
  const cols = Math.ceil((x1 + pad - ox) / G);
  const rows = Math.ceil((y1 + pad - oy) / G);
  const grid = new Uint8Array(cols * rows);
  const owner = new Int16Array(cols * rows).fill(-1); // hangi açıklık
  const nonBalcony = new Uint8Array(cols * rows); // balkon dışı bir odaya komşu mu

  const ci = (x) => Math.round((x - ox) / G);
  const cj = (y) => Math.round((y - oy) / G);

  // Duvar bölgesi: genişletilmiş dikdörtgenler
  const ext = EXT_WALL / G;
  rooms.forEach((r) => {
    const a = ci(r.x) - ext, b = ci(r.x + r.w) + ext, c = cj(r.y) - ext, d = cj(r.y + r.h) + ext;
    const nb = r.type !== 'balkon';
    for (let j = Math.max(0, c); j < Math.min(rows, d); j++)
      for (let i = Math.max(0, a); i < Math.min(cols, b); i++) {
        const k = j * cols + i;
        if (grid[k] === EMPTY) grid[k] = WALL;
        if (nb) nonBalcony[k] = 1;
      }
  });
  // Oda içleri
  rooms.forEach((r) => {
    for (let j = cj(r.y); j < cj(r.y + r.h); j++)
      for (let i = ci(r.x); i < ci(r.x + r.w); i++) grid[j * cols + i] = ROOM;
  });

  // Açıklıkları oy
  project.openings.forEach((op, idx) => {
    const room = rooms.find((r) => r.id === op.roomId);
    if (!room) return;
    const s = openingSegment(op, room);
    const code = op.kind === 'door' ? DOOR : WIN;
    const steps = CUT_DEPTH / G;
    if (s.horiz) {
      const jEdge = cj(s.ay);
      const dir = -s.ny; // dışarı doğru
      for (let i = ci(s.ax); i < ci(s.bx); i++) {
        let j = dir < 0 ? jEdge - 1 : jEdge;
        for (let n = 0; n < steps && j >= 0 && j < rows; n++, j += dir) {
          const k = j * cols + i;
          if (grid[k] === WALL) { grid[k] = code; owner[k] = idx; }
          else if (grid[k] !== DOOR && grid[k] !== WIN) break;
        }
      }
    } else {
      const iEdge = ci(s.ax);
      const dir = -s.nx;
      for (let j = cj(s.ay); j < cj(s.by); j++) {
        let i = dir < 0 ? iEdge - 1 : iEdge;
        for (let n = 0; n < steps && i >= 0 && i < cols; n++, i += dir) {
          const k = j * cols + i;
          if (grid[k] === WALL) { grid[k] = code; owner[k] = idx; }
          else if (grid[k] !== DOOR && grid[k] !== WIN) break;
        }
      }
    }
  });

  // Hücreleri dikdörtgenlere birleştir
  const merge = (pred, keyFn) => {
    const used = new Uint8Array(cols * rows);
    const out = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        if (used[k] || !pred(k)) continue;
        const key = keyFn(k);
        let w = 1;
        while (i + w < cols && !used[k + w] && pred(k + w) && keyFn(k + w) === key) w++;
        let h = 1;
        outer: while (j + h < rows) {
          for (let t = 0; t < w; t++) {
            const kk = (j + h) * cols + i + t;
            if (used[kk] || !pred(kk) || keyFn(kk) !== key) break outer;
          }
          h++;
        }
        for (let a = 0; a < h; a++) for (let t = 0; t < w; t++) used[(j + a) * cols + i + t] = 1;
        out.push({ x: ox + i * G, y: oy + j * G, w: w * G, h: h * G, key });
      }
    }
    return out;
  };

  const all = merge((k) => grid[k] === WALL, (k) => nonBalcony[k]);
  const solids = all.filter((r) => r.key === 1);
  const parapets = all.filter((r) => r.key === 0);
  const doors = merge((k) => grid[k] === DOOR, (k) => owner[k]).map((r) => ({ ...r, op: project.openings[r.key] }));
  const windows = merge((k) => grid[k] === WIN, (k) => owner[k]).map((r) => ({ ...r, op: project.openings[r.key] }));
  return { solids, doors, windows, parapets, grid: { ox, oy, cols, rows, data: grid } };
}
