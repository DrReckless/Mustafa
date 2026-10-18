// 2B kat planı çizimi (editör ve PDF için ortak)

import { ROOM_TYPES, roomLabel, roomArea, fmtM, fmtArea, openingSegment, footprint } from './model.js';
import { CATALOG } from './catalog.js';
import { computeWalls } from './walls.js';

export const PLAN_COLORS = {
  wall: '#262626',
  parapet: '#8a8a8a',
  line: '#4a4a4a',
  furn: '#ffffff',
  furnLine: '#5b5b5b',
  accent: '#c9a24b',
  dim: '#7a6a45',
};

// view: { scale (px/cm), ox, oy } — ekran = (dünya - o) * scale
export function drawPlan(g, project, view, opts = {}) {
  const { scale } = view;
  const walls = opts.walls || computeWalls(project);
  const print = !!opts.print;
  g.save();
  g.lineJoin = 'round';
  g.lineCap = 'round';
  const T = (x, y) => [(x - view.ox) * scale, (y - view.oy) * scale];

  // Oda zeminleri
  for (const r of project.rooms) {
    const [x, y] = T(r.x, r.y);
    g.fillStyle = print ? (opts.color === false ? '#ffffff' : ROOM_TYPES[r.type]?.color || '#f2f2f2') : ROOM_TYPES[r.type]?.color || '#f2f2f2';
    g.fillRect(x, y, r.w * scale, r.h * scale);
    if (opts.floorPattern !== false) drawFloorPattern(g, r, x, y, scale);
  }
  // Kapı/pencere boşluklarının zemini
  for (const d of walls.doors) {
    const [x, y] = T(d.x, d.y);
    g.fillStyle = print ? '#ffffff' : '#fbfaf7';
    g.fillRect(x, y, d.w * scale, d.h * scale);
  }

  // Mobilyalar
  if (opts.furniture !== false) {
    const list = project.furniture.slice().sort((a, b) => layerOf(a) - layerOf(b));
    for (const f of list) drawFurniture(g, f, view, opts.selectedId === f.id);
  }

  // Duvarlar
  g.fillStyle = PLAN_COLORS.wall;
  for (const w of walls.solids) {
    const [x, y] = T(w.x, w.y);
    g.fillRect(x - 0.25, y - 0.25, w.w * scale + 0.5, w.h * scale + 0.5);
  }
  g.fillStyle = PLAN_COLORS.parapet;
  for (const w of walls.parapets) {
    const [x, y] = T(w.x, w.y);
    g.fillRect(x - 0.25, y - 0.25, w.w * scale + 0.5, w.h * scale + 0.5);
  }
  // Pencereler
  for (const wnd of walls.windows) {
    const [x, y] = T(wnd.x, wnd.y);
    const w = wnd.w * scale, h = wnd.h * scale;
    g.fillStyle = '#ffffff';
    g.fillRect(x, y, w, h);
    g.strokeStyle = PLAN_COLORS.wall;
    g.lineWidth = Math.max(1, scale * 1.2);
    g.strokeRect(x, y, w, h);
    g.strokeStyle = '#6aa6c8';
    g.lineWidth = Math.max(1, scale * 1.4);
    g.beginPath();
    if (wnd.w > wnd.h) { g.moveTo(x, y + h / 2); g.lineTo(x + w, y + h / 2); }
    else { g.moveTo(x + w / 2, y); g.lineTo(x + w / 2, y + h); }
    g.stroke();
  }
  // Kapı kanatları
  for (const op of project.openings) {
    if (op.kind !== 'door') continue;
    const room = project.rooms.find((r) => r.id === op.roomId);
    if (!room) continue;
    drawDoor(g, op, room, view, opts.selectedId === op.id);
  }

  // Oda etiketleri
  if (opts.labels !== false) {
    for (const r of project.rooms) drawRoomLabel(g, r, view, { ...opts, project });
  }
  // Ölçüler
  if (opts.dims) for (const r of project.rooms) drawRoomDims(g, r, view);

  // Seçim
  if (opts.selectedId) {
    const r = project.rooms.find((x) => x.id === opts.selectedId);
    if (r) {
      const [x, y] = T(r.x, r.y);
      g.strokeStyle = PLAN_COLORS.accent;
      g.lineWidth = 3;
      g.setLineDash([8, 5]);
      g.strokeRect(x, y, r.w * scale, r.h * scale);
      g.setLineDash([]);
      drawRoomDims(g, r, view, true);
      // köşe tutamaçları
      for (const [hx, hy] of [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h]]) {
        const [sx, sy] = T(hx, hy);
        g.fillStyle = '#ffffff';
        g.strokeStyle = PLAN_COLORS.accent;
        g.lineWidth = 3;
        g.beginPath();
        g.arc(sx, sy, 11, 0, Math.PI * 2);
        g.fill();
        g.stroke();
      }
    }
    const op = project.openings.find((o) => o.id === opts.selectedId);
    if (op) {
      const room = project.rooms.find((r) => r.id === op.roomId);
      const s = openingSegment(op, room);
      const [ax, ay] = T(s.ax, s.ay), [bx, by] = T(s.bx, s.by);
      g.strokeStyle = PLAN_COLORS.accent;
      g.lineWidth = 8;
      g.globalAlpha = 0.6;
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
      g.globalAlpha = 1;
    }
  }
  g.restore();
}

function layerOf(f) {
  const c = CATALOG[f.type];
  if (c?.floor) return 0;
  if (c?.elev) return 3;
  if (f.type === 'chair' || f.type === 'office_chair') return 1;
  return 2;
}

function drawFloorPattern(g, r, x, y, scale) {
  const kind = ROOM_TYPES[r.type]?.floor;
  g.save();
  g.beginPath();
  g.rect(x, y, r.w * scale, r.h * scale);
  g.clip();
  g.strokeStyle = 'rgba(0,0,0,0.045)';
  g.lineWidth = 1;
  g.beginPath();
  if (kind === 'tile') {
    const s = 60 * scale;
    for (let xx = x; xx < x + r.w * scale; xx += s) { g.moveTo(xx, y); g.lineTo(xx, y + r.h * scale); }
    for (let yy = y; yy < y + r.h * scale; yy += s) { g.moveTo(x, yy); g.lineTo(x + r.w * scale, yy); }
  } else if (kind === 'wood' || kind === 'deck') {
    const s = 20 * scale;
    for (let yy = y; yy < y + r.h * scale; yy += s) { g.moveTo(x, yy); g.lineTo(x + r.w * scale, yy); }
  }
  g.stroke();
  g.restore();
}

function drawDoor(g, op, room, view, selected) {
  const { scale } = view;
  const s = openingSegment(op, room);
  const hingeAtStart = op.hinge !== 'end';
  const hx = hingeAtStart ? s.ax : s.bx, hy = hingeAtStart ? s.ay : s.by;
  const ex = hingeAtStart ? s.bx : s.ax, ey = hingeAtStart ? s.by : s.ay;
  const sgn = op.swing === 'out' ? -1 : 1;
  const nx = s.nx * sgn, ny = s.ny * sgn;
  const L = op.width;
  const ox = hx + nx * L, oy = hy + ny * L; // açık kanadın ucu
  const P = (x, y) => [(x - view.ox) * scale, (y - view.oy) * scale];
  const [hX, hY] = P(hx, hy), [eX, eY] = P(ex, ey), [oX, oY] = P(ox, oy);
  g.strokeStyle = selected ? PLAN_COLORS.accent : PLAN_COLORS.line;
  g.lineWidth = Math.max(1, scale * 1.2);
  // kanat
  g.beginPath(); g.moveTo(hX, hY); g.lineTo(oX, oY); g.stroke();
  // yay
  const a0 = Math.atan2(eY - hY, eX - hX), a1 = Math.atan2(oY - hY, oX - hX);
  let d = a1 - a0;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  g.setLineDash([4, 4]);
  g.lineWidth = Math.max(0.8, scale * 0.8);
  g.beginPath();
  g.arc(hX, hY, L * scale, a0, a1, d < 0);
  g.stroke();
  g.setLineDash([]);
}

function drawRoomLabel(g, r, view, opts) {
  const { scale } = view;
  const cx = (r.x + r.w / 2 - view.ox) * scale, cy = (r.y + r.h / 2 - view.oy) * scale;
  const base = Math.max(10, Math.min(22, Math.min(r.w, r.h) * scale * 0.09));
  const fs = opts.print ? base * 1.1 : base;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const name = roomLabel(r);
  const area = fmtArea(roomArea(r));
  const hasFurn = opts.furniture !== false && opts.project?.furniture?.some((f) => f.roomId === r.id);
  g.font = `600 ${fs}px "Inter", "Roboto", sans-serif`;
  const tw = Math.max(g.measureText(name).width, g.measureText(area).width);
  if (hasFurn || opts.labelBg) {
    g.fillStyle = 'rgba(255,255,255,0.82)';
    roundRect(g, cx - tw / 2 - 8, cy - fs * 1.15, tw + 16, fs * 2.4, 6);
    g.fill();
  }
  g.fillStyle = '#1d1d1d';
  g.fillText(name, cx, cy - fs * 0.5);
  g.font = `${fs * 0.85}px "Inter", "Roboto", sans-serif`;
  g.fillStyle = '#5a5a5a';
  g.fillText(area, cx, cy + fs * 0.6);
}

function drawRoomDims(g, r, view, strong = false) {
  const { scale } = view;
  const P = (x, y) => [(x - view.ox) * scale, (y - view.oy) * scale];
  const fs = Math.max(10, Math.min(15, scale * 9));
  g.font = `${strong ? 600 : 500} ${fs}px "Inter", "Roboto", sans-serif`;
  g.fillStyle = strong ? '#7a5c12' : PLAN_COLORS.dim;
  g.strokeStyle = strong ? '#7a5c12' : PLAN_COLORS.dim;
  g.lineWidth = 1;
  const off = Math.max(10, fs * 1.1);
  // Üst kenar
  const [x0, y0] = P(r.x, r.y);
  const [x1, y1] = P(r.x + r.w, r.y + r.h);
  if ((x1 - x0) > 40) {
    const yy = y0 + off;
    g.beginPath(); g.moveTo(x0 + 4, yy); g.lineTo(x1 - 4, yy); g.stroke();
    tick(g, x0 + 4, yy, true); tick(g, x1 - 4, yy, true);
    const t = fmtM(r.w);
    g.textAlign = 'center'; g.textBaseline = 'bottom';
    bgText(g, t, (x0 + x1) / 2, yy - 2, fs);
  }
  if ((y1 - y0) > 40) {
    const xx = x0 + off;
    g.beginPath(); g.moveTo(xx, y0 + 4); g.lineTo(xx, y1 - 4); g.stroke();
    tick(g, xx, y0 + 4, false); tick(g, xx, y1 - 4, false);
    g.save();
    g.translate(xx - 2, (y0 + y1) / 2);
    g.rotate(-Math.PI / 2);
    g.textAlign = 'center'; g.textBaseline = 'bottom';
    bgText(g, fmtM(r.h), 0, 0, fs);
    g.restore();
  }
}

function bgText(g, t, x, y, fs) {
  const w = g.measureText(t).width;
  const fill = g.fillStyle;
  g.fillStyle = 'rgba(255,255,255,0.75)';
  g.fillRect(x - w / 2 - 3, y - fs - 1, w + 6, fs + 2);
  g.fillStyle = fill;
  g.fillText(t, x, y);
}

function tick(g, x, y, horiz) {
  g.beginPath();
  if (horiz) { g.moveTo(x - 3, y + 3); g.lineTo(x + 3, y - 3); }
  else { g.moveTo(x - 3, y + 3); g.lineTo(x + 3, y - 3); }
  g.stroke();
}

export function roundRect(g, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// ------------------ Mobilya sembolleri (üstten görünüş) ------------------

export function drawFurniture(g, f, view, selected) {
  const { scale } = view;
  const c = CATALOG[f.type] || {};
  g.save();
  g.translate((f.x - view.ox) * scale, (f.y - view.oy) * scale);
  g.rotate((f.rot * Math.PI) / 180);
  g.scale(scale, scale);
  const w = f.w, d = f.d;
  const lw = 1.1 / scale;
  g.lineWidth = lw;
  g.strokeStyle = PLAN_COLORS.furnLine;
  g.fillStyle = PLAN_COLORS.furn;
  const X = -w / 2, Y = -d / 2;
  const box = (x, y, ww, hh, r = 2, fill = PLAN_COLORS.furn) => {
    roundRect(g, x, y, ww, hh, r);
    g.fillStyle = fill;
    g.fill();
    g.stroke();
  };
  const line = (x0, y0, x1, y1) => { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
  const circle = (x, y, r, fill = PLAN_COLORS.furn) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); g.stroke(); };

  switch (c.kind) {
    case 'bed': {
      box(X, Y, w, d, 4);
      box(X + 2, Y, w - 4, 8, 2, '#ece6dc'); // başlık
      const pillows = w >= 130 ? 2 : 1;
      const pw = (w - 20 - (pillows - 1) * 6) / pillows;
      for (let i = 0; i < pillows; i++) box(X + 10 + i * (pw + 6), Y + 13, pw, 32, 8);
      box(X + 3, Y + d * 0.36, w - 6, d * 0.64 - 3, 4, '#f3efe8'); // yorgan
      line(X + 3, Y + d * 0.36 + 16, X + w - 3, Y + d * 0.36 + 16);
      break;
    }
    case 'nightstand':
      box(X, Y, w, d, 2);
      circle(0, 0, Math.min(w, d) * 0.22);
      break;
    case 'wardrobe': {
      box(X, Y, w, d, 1);
      line(X, Y + d - 6, X + w, Y + d - 6);
      const n = Math.max(1, Math.round(w / 50));
      for (let i = 1; i < n; i++) line(X + (w / n) * i, Y + d - 6, X + (w / n) * i, Y + d);
      g.setLineDash([3, 3]);
      line(X + 4, Y + d / 2 - 3, X + w - 4, Y + d / 2 - 3);
      g.setLineDash([]);
      break;
    }
    case 'dresser':
    case 'sideboard':
    case 'shoe_cabinet': {
      box(X, Y, w, d, 1);
      const n = Math.max(2, Math.round(w / 45));
      for (let i = 1; i < n; i++) line(X + (w / n) * i, Y + 3, X + (w / n) * i, Y + d - 3);
      break;
    }
    case 'tv_unit':
      box(X, Y, w, d, 1);
      box(-w * 0.32, Y + 4, w * 0.64, 5, 1, '#3a3a3a');
      break;
    case 'sofa': {
      box(X, Y, w, d, 8);
      box(X + 3, Y + 3, w - 6, 20, 6, '#efeae3'); // sırt
      box(X + 2, Y + 3, 16, d - 6, 6, '#efeae3');
      box(X + w - 18, Y + 3, 16, d - 6, 6, '#efeae3');
      const seats = c.seats || 3;
      const sw = (w - 36) / seats;
      for (let i = 0; i < seats; i++) box(X + 18 + i * sw + 1, Y + 24, sw - 2, d - 30, 5);
      break;
    }
    case 'sofa_l': {
      // ana gövde sırtta, şezlong bir yanda öne uzanır
      const m = f.mirror ? -1 : 1;
      g.save();
      g.scale(m, 1);
      const sd = 92;
      g.beginPath();
      g.moveTo(X, Y); g.lineTo(X + w, Y); g.lineTo(X + w, Y + d); g.lineTo(X + w - 95, Y + d); g.lineTo(X + w - 95, Y + sd); g.lineTo(X, Y + sd); g.closePath();
      g.fillStyle = PLAN_COLORS.furn; g.fill(); g.stroke();
      box(X + 3, Y + 3, w - 6, 20, 6, '#efeae3');
      box(X + 2, Y + 3, 16, sd - 6, 6, '#efeae3');
      box(X + w - 18, Y + 3, 16, d - 6, 6, '#efeae3');
      const sw = (w - 95 - 18) / 2;
      for (let i = 0; i < 2; i++) box(X + 18 + i * sw + 1, Y + 24, sw - 2, sd - 30, 5);
      box(X + w - 95 + 1, Y + 24, 76, d - 30, 5);
      g.restore();
      break;
    }
    case 'armchair':
      box(X, Y, w, d, 8);
      box(X + 3, Y + 3, w - 6, 16, 6, '#efeae3');
      box(X + 2, Y + 3, 13, d - 6, 5, '#efeae3');
      box(X + w - 15, Y + 3, 13, d - 6, 5, '#efeae3');
      box(X + 16, Y + 20, w - 32, d - 26, 5);
      break;
    case 'coffee_table':
    case 'side_table':
      box(X, Y, w, d, 6, '#f7f3ec');
      break;
    case 'round_table':
      circle(0, 0, Math.min(w, d) / 2, '#f7f3ec');
      break;
    case 'dining':
      box(X, Y, w, d, 4, '#f7f3ec');
      box(X + 6, Y + 6, w - 12, d - 12, 3, '#f7f3ec');
      break;
    case 'chair':
      box(X + 2, Y + 4, w - 4, d - 6, 5);
      box(X + 3, Y, w - 6, 8, 3, '#e8e2d8');
      break;
    case 'office_chair':
      circle(0, 3, w * 0.4);
      g.beginPath(); g.arc(0, 3, w * 0.42, Math.PI * 1.15, Math.PI * 1.85); g.lineWidth = 6; g.strokeStyle = '#8b8b8b'; g.stroke();
      break;
    case 'desk':
      box(X, Y, w, d, 2);
      box(-18, Y + 5, 36, 4, 1, '#3a3a3a');
      box(-14, Y + d * 0.45, 28, 16, 2, '#e9e9e9');
      break;
    case 'bookshelf': {
      box(X, Y, w, d, 1);
      const n = Math.max(2, Math.round(w / 30));
      for (let i = 1; i < n; i++) line(X + (w / n) * i, Y + 2, X + (w / n) * i, Y + d - 2);
      break;
    }
    case 'k_base':
    case 'k_dishwasher':
      box(X, Y, w, d, 0, '#fafafa');
      line(X, Y + d - 4, X + w, Y + d - 4);
      if (c.kind === 'k_dishwasher') { line(X + 6, Y + 6, X + w - 6, Y + d - 10); line(X + w - 6, Y + 6, X + 6, Y + d - 10); }
      break;
    case 'k_sink':
      box(X, Y, w, d, 0, '#fafafa');
      box(X + 8, Y + 10, w - 16, d - 22, 6, '#e6edf1');
      circle(0, Y + 6, 2.5);
      break;
    case 'k_stove':
      box(X, Y, w, d, 0, '#fafafa');
      for (const [px, py, r] of [[-14, -12, 8], [14, -12, 6], [-14, 13, 6], [14, 13, 8]]) circle(px, py, r, '#efefef');
      break;
    case 'k_fridge':
      box(X, Y, w, d, 2, '#f4f6f7');
      line(X + 4, Y + d - 8, X + w - 4, Y + d - 8);
      line(X + 4, Y + 4, X + w - 4, Y + d - 12);
      break;
    case 'k_tall':
      box(X, Y, w, d, 1, '#fafafa');
      line(X + 4, Y + 4, X + w - 4, Y + d - 4);
      break;
    case 'k_upper':
      g.setLineDash([4, 3]);
      g.strokeStyle = '#9a9a9a';
      g.strokeRect(X, Y, w, d);
      g.setLineDash([]);
      break;
    case 'toilet':
      box(X + 2, Y, w - 4, 18, 3);
      g.beginPath(); g.ellipse(0, Y + 18 + (d - 18) / 2, w / 2 - 2, (d - 18) / 2, 0, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill(); g.stroke();
      g.beginPath(); g.ellipse(0, Y + 20 + (d - 18) / 2, w / 2 - 9, (d - 18) / 2 - 8, 0, 0, Math.PI * 2); g.stroke();
      break;
    case 'basin':
      box(X, Y, w, d, 3);
      g.beginPath(); g.ellipse(0, 3, w / 2 - 9, d / 2 - 9, 0, 0, Math.PI * 2); g.fillStyle = '#eef3f5'; g.fill(); g.stroke();
      circle(0, Y + 5, 2);
      break;
    case 'shower':
      box(X, Y, w, d, 2, '#f1f6f8');
      line(X + 4, Y + 4, X + w - 4, Y + d - 4); line(X + w - 4, Y + 4, X + 4, Y + d - 4);
      circle(0, 0, 3);
      break;
    case 'bathtub':
      box(X, Y, w, d, 6, '#ffffff');
      box(X + 7, Y + 7, w - 14, d - 14, 18, '#eef4f6');
      circle(X + w - 22, 0, 3);
      break;
    case 'washer':
      box(X, Y, w, d, 3);
      circle(0, 3, Math.min(w, d) * 0.3, '#eef3f5');
      break;
    case 'plant': {
      circle(0, 0, w * 0.32, '#e5ddd0');
      g.fillStyle = '#7fa36b';
      g.strokeStyle = '#5c7f4c';
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        g.beginPath(); g.ellipse(Math.cos(a) * w * 0.22, Math.sin(a) * w * 0.22, w * 0.2, w * 0.09, a, 0, Math.PI * 2); g.fill(); g.stroke();
      }
      break;
    }
    case 'floor_lamp':
      circle(0, 0, w * 0.45, '#fbf6e9');
      circle(0, 0, w * 0.12, '#d9c79a');
      break;
    case 'rug': {
      g.fillStyle = 'rgba(201,162,75,0.10)';
      g.fillRect(X, Y, w, d);
      g.strokeStyle = 'rgba(150,120,60,0.45)';
      g.strokeRect(X, Y, w, d);
      g.strokeRect(X + 8, Y + 8, w - 16, d - 16);
      break;
    }
    default:
      box(X, Y, w, d, 2);
  }
  if (selected) {
    g.strokeStyle = PLAN_COLORS.accent;
    g.lineWidth = 3 / scale;
    g.setLineDash([6 / scale, 4 / scale]);
    g.strokeRect(X - 4, Y - 4, w + 8, d + 8);
    g.setLineDash([]);
    // ön yön oku
    g.fillStyle = PLAN_COLORS.accent;
    g.beginPath(); g.moveTo(-8, d / 2 + 8); g.lineTo(8, d / 2 + 8); g.lineTo(0, d / 2 + 18); g.closePath(); g.fill();
  }
  g.restore();
}

// Planı verilen boyuttaki tuvale sığdır
export function fitView(project, width, height, margin = 40) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const r of project.rooms) {
    x0 = Math.min(x0, r.x - 25); y0 = Math.min(y0, r.y - 25);
    x1 = Math.max(x1, r.x + r.w + 25); y1 = Math.max(y1, r.y + r.h + 25);
  }
  if (!isFinite(x0)) { x0 = 0; y0 = 0; x1 = 600; y1 = 500; }
  const scale = Math.min((width - margin * 2) / (x1 - x0), (height - margin * 2) / (y1 - y0));
  return { scale, ox: (x0 + x1) / 2 - width / 2 / scale, oy: (y0 + y1) / 2 - height / 2 / scale };
}

// Dış ölçü zinciri (PDF için): toplam genişlik/derinlik
export function drawOverallDims(g, project, view) {
  if (!project.rooms.length) return;
  const { scale } = view;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const r of project.rooms) {
    x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y);
    x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h);
  }
  const P = (x, y) => [(x - view.ox) * scale, (y - view.oy) * scale];
  const [a, b] = P(x0 - 20, y0 - 20), [c, d] = P(x1 + 20, y1 + 20);
  g.save();
  g.strokeStyle = '#555';
  g.fillStyle = '#333';
  g.lineWidth = 1;
  g.font = '600 13px "Inter", "Roboto", sans-serif';
  const yy = b - 22;
  g.beginPath(); g.moveTo(a, yy); g.lineTo(c, yy); g.moveTo(a, yy - 6); g.lineTo(a, yy + 6); g.moveTo(c, yy - 6); g.lineTo(c, yy + 6); g.stroke();
  g.textAlign = 'center'; g.textBaseline = 'bottom';
  g.fillText(fmtM(x1 - x0 + 40) + ' m', (a + c) / 2, yy - 4);
  const xx = a - 22;
  g.beginPath(); g.moveTo(xx, b); g.lineTo(xx, d); g.moveTo(xx - 6, b); g.lineTo(xx + 6, b); g.moveTo(xx - 6, d); g.lineTo(xx + 6, d); g.stroke();
  g.translate(xx - 4, (b + d) / 2);
  g.rotate(-Math.PI / 2);
  g.fillText(fmtM(y1 - y0 + 40) + ' m', 0, 0);
  g.restore();
}

export { footprint };
