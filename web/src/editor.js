// Dokunmatik 2B plan editörü
import { drawPlan, fitView, PLAN_COLORS } from './plan2d.js';
import { footprint, openingSegment, sideLength, roomAt, uid, fmtM, WALL_GAP, neighborRoom } from './model.js';
import { CATALOG } from './catalog.js';

const SNAP = 5;
const snap = (v) => Math.round(v / SNAP) * SNAP;

export class PlanEditor {
  constructor(container, app) {
    this.app = app;
    this.container = container;
    this.canvas = document.createElement('canvas');
    container.appendChild(this.canvas);
    this.g = this.canvas.getContext('2d');
    this.view = { scale: 1, ox: 0, oy: 0 };
    this.tool = 'select';
    this.selection = null; // { kind, id }
    this.pointers = new Map();
    this.drag = null;
    this.draft = null;
    this.showDims = false;
    this._needsDraw = false;
    this._bind();
    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(container);
  }

  get project() { return this.app.project; }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (!w || !h) return;
    const first = !this._sized;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.dpr = dpr;
    this.W = w; this.H = h;
    this._sized = true;
    if (first) this.fit();
    this.invalidate();
  }

  fit() {
    if (!this.W) return;
    const bottomPad = this.selection ? this.H * 0.35 : 0;
    const v = fitView(this.project, this.W, this.H - bottomPad, 36);
    this.view = v;
    this.invalidate();
  }

  invalidate() {
    if (this._needsDraw) return;
    this._needsDraw = true;
    requestAnimationFrame(() => { this._needsDraw = false; this.draw(); });
  }

  setTool(t) {
    this.tool = t;
    this.invalidate();
  }

  select(sel) {
    this.selection = sel;
    this.app.onSelectionChange?.(sel);
    this.invalidate();
  }

  toWorld(px, py) {
    return [px / this.view.scale + this.view.ox, py / this.view.scale + this.view.oy];
  }

  // ---------------- çizim ----------------
  draw() {
    const g = this.g;
    const { dpr } = this;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#fbfaf7';
    g.fillRect(0, 0, this.W, this.H);
    this._drawGrid(g);
    drawPlan(g, this.project, this.view, { selectedId: this.selection?.id, dims: this.showDims });
    if (this.draft) {
      const { x, y, w, h } = this.draft;
      const s = this.view.scale;
      const X = (x - this.view.ox) * s, Y = (y - this.view.oy) * s;
      g.fillStyle = 'rgba(201,162,75,0.18)';
      g.fillRect(X, Y, w * s, h * s);
      g.strokeStyle = PLAN_COLORS.accent;
      g.lineWidth = 2;
      g.setLineDash([6, 4]);
      g.strokeRect(X, Y, w * s, h * s);
      g.setLineDash([]);
      g.fillStyle = '#5c4510';
      g.font = '600 14px Inter, Roboto, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(`${fmtM(w)} × ${fmtM(h)} m`, X + (w * s) / 2, Y + (h * s) / 2);
    }
  }

  _drawGrid(g) {
    const s = this.view.scale;
    const step = s * 50 < 12 ? 100 : 50;
    const [x0, y0] = this.toWorld(0, 0), [x1, y1] = this.toWorld(this.W, this.H);
    g.lineWidth = 1;
    for (let pass = 0; pass < 2; pass++) {
      g.strokeStyle = pass === 0 ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.075)';
      const st = pass === 0 ? step : step * (step === 50 ? 2 : 5);
      g.beginPath();
      for (let x = Math.floor(x0 / st) * st; x <= x1; x += st) { const X = Math.round((x - this.view.ox) * s) + 0.5; g.moveTo(X, 0); g.lineTo(X, this.H); }
      for (let y = Math.floor(y0 / st) * st; y <= y1; y += st) { const Y = Math.round((y - this.view.oy) * s) + 0.5; g.moveTo(0, Y); g.lineTo(this.W, Y); }
      g.stroke();
    }
  }

  // ---------------- isabet testi ----------------
  hitTest(wx, wy) {
    const p = this.project;
    const tol = Math.max(12, 16 / this.view.scale);
    // Mobilya (halı ve üst dolap en son)
    const order = p.furniture.slice().reverse();
    const pick = (pred) => order.find((f) => pred(f) && inRect(wx, wy, footprint(f)));
    let f = pick((f) => !CATALOG[f.type]?.floor && !CATALOG[f.type]?.elev);
    if (f) return { kind: 'furniture', id: f.id };
    // Açıklık
    for (const op of p.openings) {
      const room = p.rooms.find((r) => r.id === op.roomId);
      if (!room) continue;
      const s = openingSegment(op, room);
      const d = distToSeg(wx, wy, s.ax, s.ay, s.bx, s.by);
      if (d < tol) return { kind: 'opening', id: op.id };
    }
    f = pick((f) => CATALOG[f.type]?.elev) || pick((f) => CATALOG[f.type]?.floor);
    if (f) return { kind: 'furniture', id: f.id };
    const r = roomAt(p, wx, wy);
    if (r) return { kind: 'room', id: r.id };
    return null;
  }

  _cornerHandle(px, py) {
    if (this.selection?.kind !== 'room') return -1;
    const r = this.project.rooms.find((x) => x.id === this.selection.id);
    if (!r) return -1;
    const s = this.view.scale;
    const pts = [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h]];
    for (let i = 0; i < 4; i++) {
      const X = (pts[i][0] - this.view.ox) * s, Y = (pts[i][1] - this.view.oy) * s;
      if (Math.hypot(px - X, py - Y) < 26) return i;
    }
    return -1;
  }

  // ---------------- giriş ----------------
  _bind() {
    const c = this.canvas;
    c.addEventListener('pointerdown', (e) => this._down(e));
    c.addEventListener('pointermove', (e) => this._move(e));
    c.addEventListener('pointerup', (e) => this._up(e));
    c.addEventListener('pointercancel', (e) => this._up(e, true));
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = c.getBoundingClientRect();
      this._zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0015));
    }, { passive: false });
  }

  _pos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }

  _zoomAt(px, py, k) {
    const [wx, wy] = this.toWorld(px, py);
    const s = Math.max(0.08, Math.min(8, this.view.scale * k));
    this.view.scale = s;
    this.view.ox = wx - px / s;
    this.view.oy = wy - py / s;
    this.invalidate();
  }

  _down(e) {
    this.canvas.setPointerCapture(e.pointerId);
    const [px, py] = this._pos(e);
    this.pointers.set(e.pointerId, { px, py });
    if (this.pointers.size === 2) {
      // iki parmak: yakınlaştır/kaydır
      if (this.drag?.moved && this.drag.before) this._restore(this.drag.before);
      this.drag = null;
      this.draft = null;
      const [a, b] = [...this.pointers.values()];
      this.pinch = { d: Math.hypot(a.px - b.px, a.py - b.py), cx: (a.px + b.px) / 2, cy: (a.py + b.py) / 2, scale: this.view.scale, world: this.toWorld((a.px + b.px) / 2, (a.py + b.py) / 2) };
      this.invalidate();
      return;
    }
    if (this.pointers.size > 2) return;
    const [wx, wy] = this.toWorld(px, py);
    const d = { sx: px, sy: py, wx, wy, moved: false, type: 'pan', ox: this.view.ox, oy: this.view.oy };
    if (this.tool === 'room') {
      d.type = 'draw';
    } else if (this.tool === 'select') {
      const ci = this._cornerHandle(px, py);
      if (ci >= 0) {
        d.type = 'resize';
        d.corner = ci;
        d.target = this.selection.id;
      } else {
        const hit = this.hitTest(wx, wy);
        d.hit = hit;
        if (hit && this.selection && hit.id === this.selection.id) d.type = 'move';
        else if (hit && hit.kind === 'furniture') d.type = 'move'; // mobilya doğrudan sürüklenebilir
        else d.type = 'pan';
      }
    }
    this.drag = d;
  }

  _move(e) {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    const [px, py] = this._pos(e);
    p.px = px; p.py = py;
    if (this.pinch && this.pointers.size >= 2) {
      const [a, b] = [...this.pointers.values()];
      const dist = Math.hypot(a.px - b.px, a.py - b.py);
      const cx = (a.px + b.px) / 2, cy = (a.py + b.py) / 2;
      const s = Math.max(0.08, Math.min(8, this.pinch.scale * (dist / (this.pinch.d || 1))));
      this.view.scale = s;
      this.view.ox = this.pinch.world[0] - cx / s;
      this.view.oy = this.pinch.world[1] - cy / s;
      this.invalidate();
      return;
    }
    const d = this.drag;
    if (!d) return;
    if (!d.moved && Math.hypot(px - d.sx, py - d.sy) < 7) return;
    if (!d.moved) {
      d.moved = true;
      if (d.type === 'move' || d.type === 'resize') {
        d.before = JSON.stringify(this.project);
        if (d.type === 'move' && d.hit && (!this.selection || d.hit.id !== this.selection.id)) this.select(d.hit);
        d.orig = this._snapshotTarget();
      }
    }
    const [wx, wy] = this.toWorld(px, py);
    const dx = wx - d.wx, dy = wy - d.wy;
    if (d.type === 'pan') {
      this.view.ox = d.ox - (px - d.sx) / this.view.scale;
      this.view.oy = d.oy - (py - d.sy) / this.view.scale;
    } else if (d.type === 'draw') {
      let x0 = snap(Math.min(d.wx, wx)), y0 = snap(Math.min(d.wy, wy));
      let x1 = snap(Math.max(d.wx, wx)), y1 = snap(Math.max(d.wy, wy));
      [x0, x1] = this._snapEdges(x0, x1, 'x', null, true);
      [y0, y1] = this._snapEdges(y0, y1, 'y', null, true);
      this.draft = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    } else if (d.type === 'move') {
      this._moveSelection(dx, dy, d.orig);
    } else if (d.type === 'resize') {
      this._resizeRoom(d.corner, wx, wy, d.orig);
    }
    this.invalidate();
  }

  _up(e, cancel) {
    this.pointers.delete(e.pointerId);
    if (this.pinch) {
      if (this.pointers.size < 2) this.pinch = null;
      this.drag = null;
      return;
    }
    const d = this.drag;
    this.drag = null;
    if (!d || cancel) { this.draft = null; this.invalidate(); return; }
    if (!d.moved) {
      // dokunma
      if (this.tool === 'select') this.select(d.hit || null);
      else if (this.tool === 'door' || this.tool === 'window') this._addOpening(d.wx, d.wy, this.tool);
      else if (this.tool === 'room') this.app.hint?.('Oda çizmek için parmağınızı sürükleyin');
      return;
    }
    if (d.type === 'draw' && this.draft) {
      const r = this.draft;
      this.draft = null;
      if (r.w >= 60 && r.h >= 60) {
        const before = JSON.stringify(this.project);
        const type = this.project.rooms.some((x) => x.type === 'salon') ? 'yatak' : 'salon';
        const room = { id: uid('r'), type, name: '', x: r.x, y: r.y, w: r.w, h: r.h };
        room.name = this.app.defaultRoomName(type);
        this.project.rooms.push(room);
        this.app.commit(before);
        this.app.setTool('select');
        this.select({ kind: 'room', id: room.id });
      } else this.app.hint?.('Oda en az 60 × 60 cm olmalı');
      this.invalidate();
      return;
    }
    if ((d.type === 'move' || d.type === 'resize') && d.before) {
      this.app.commit(d.before);
      this.app.onSelectionChange?.(this.selection);
    }
    this.invalidate();
  }

  _restore(json) {
    const p = JSON.parse(json);
    Object.assign(this.project, p);
  }

  _snapshotTarget() {
    const sel = this.selection;
    const p = this.project;
    if (!sel) return null;
    if (sel.kind === 'room') {
      const r = p.rooms.find((x) => x.id === sel.id);
      return {
        room: { ...r },
        furn: p.furniture.filter((f) => f.roomId === r.id).map((f) => ({ id: f.id, x: f.x, y: f.y })),
        ops: p.openings.filter((o) => o.roomId === r.id).map((o) => ({ id: o.id, offset: o.offset, width: o.width })),
      };
    }
    if (sel.kind === 'furniture') { const f = p.furniture.find((x) => x.id === sel.id); return { f: { ...f } }; }
    if (sel.kind === 'opening') { const o = p.openings.find((x) => x.id === sel.id); return { o: { ...o } }; }
    return null;
  }

  // Kenar yakalama: diğer odaların kenarlarına (bitişik: duvar payı bırakarak) hizala
  _snapEdges(a, b, axis, excludeId, independent = false) {
    const thr = Math.max(8, 14 / this.view.scale);
    const targets = [];
    for (const r of this.project.rooms) {
      if (r.id === excludeId) continue;
      const lo = axis === 'x' ? r.x : r.y;
      const hi = axis === 'x' ? r.x + r.w : r.y + r.h;
      targets.push(lo, hi, lo - WALL_GAP, hi + WALL_GAP);
    }
    const best = (v) => {
      let bv = v, bd = thr;
      for (const t of targets) { const dd = Math.abs(t - v); if (dd < bd) { bd = dd; bv = t; } }
      return [bv, bd];
    };
    if (independent) return [best(a)[0], best(b)[0]];
    // birlikte kaydır (taşıma)
    const [na, da] = best(a), [nb, db] = best(b);
    if (da <= db && da < thr) return [na, b + (na - a)];
    if (db < thr) return [a + (nb - b), nb];
    return [a, b];
  }

  _moveSelection(dx, dy, orig) {
    const sel = this.selection;
    const p = this.project;
    if (!sel || !orig) return;
    if (sel.kind === 'room') {
      const r = p.rooms.find((x) => x.id === sel.id);
      let nx = snap(orig.room.x + dx), ny = snap(orig.room.y + dy);
      const [sx] = this._snapEdges(nx, nx + r.w, 'x', r.id);
      const [sy] = this._snapEdges(ny, ny + r.h, 'y', r.id);
      nx = sx; ny = sy;
      const ddx = nx - orig.room.x, ddy = ny - orig.room.y;
      r.x = nx; r.y = ny;
      for (const f0 of orig.furn) {
        const f = p.furniture.find((x) => x.id === f0.id);
        if (f) { f.x = f0.x + ddx; f.y = f0.y + ddy; }
      }
    } else if (sel.kind === 'furniture') {
      const f = p.furniture.find((x) => x.id === sel.id);
      f.x = snap(orig.f.x + dx);
      f.y = snap(orig.f.y + dy);
      const room = roomAt(p, f.x, f.y);
      if (room) {
        f.roomId = room.id;
        // duvara yasla
        const fp = footprint(f);
        const t = 14;
        if (Math.abs(fp.x0 - room.x) < t) f.x += room.x - fp.x0;
        else if (Math.abs(room.x + room.w - fp.x1) < t) f.x += room.x + room.w - fp.x1;
        if (Math.abs(fp.y0 - room.y) < t) f.y += room.y - fp.y0;
        else if (Math.abs(room.y + room.h - fp.y1) < t) f.y += room.y + room.h - fp.y1;
      }
    } else if (sel.kind === 'opening') {
      const o = p.openings.find((x) => x.id === sel.id);
      const room = p.rooms.find((r) => r.id === o.roomId);
      const horiz = o.side === 'n' || o.side === 's';
      const len = sideLength(room, o.side);
      o.offset = Math.max(0, Math.min(len - o.width, snap(orig.o.offset + (horiz ? dx : dy))));
    }
  }

  _resizeRoom(corner, wx, wy, orig) {
    const p = this.project;
    const r = p.rooms.find((x) => x.id === orig.room.id);
    const o = orig.room;
    let x0 = o.x, y0 = o.y, x1 = o.x + o.w, y1 = o.y + o.h;
    const sx = snap(wx), sy = snap(wy);
    if (corner === 0 || corner === 2) x0 = Math.min(sx, x1 - 60); else x1 = Math.max(sx, x0 + 60);
    if (corner === 0 || corner === 1) y0 = Math.min(sy, y1 - 60); else y1 = Math.max(sy, y0 + 60);
    [x0, x1] = this._snapEdges(x0, x1, 'x', r.id, true);
    [y0, y1] = this._snapEdges(y0, y1, 'y', r.id, true);
    if (x1 - x0 < 60 || y1 - y0 < 60) return;
    r.x = x0; r.y = y0; r.w = x1 - x0; r.h = y1 - y0;
    // açıklıkların dünya konumunu koru
    for (const s of orig.ops) {
      const op = p.openings.find((x) => x.id === s.id);
      const horiz = op.side === 'n' || op.side === 's';
      let off = s.offset - (horiz ? x0 - o.x : y0 - o.y);
      const len = sideLength(r, op.side);
      let w = Math.min(s.width, len);
      off = Math.max(0, Math.min(len - w, off));
      op.offset = off; op.width = w;
    }
  }

  _addOpening(wx, wy, kind) {
    const p = this.project;
    let best = null;
    const tol = Math.max(45, 30 / this.view.scale);
    for (const r of p.rooms) {
      const sides = [
        ['n', r.x, r.y, r.x + r.w, r.y], ['s', r.x, r.y + r.h, r.x + r.w, r.y + r.h],
        ['w', r.x, r.y, r.x, r.y + r.h], ['e', r.x + r.w, r.y, r.x + r.w, r.y + r.h],
      ];
      const inside = wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h;
      for (const [side, ax, ay, bx, by] of sides) {
        const d = distToSeg(wx, wy, ax, ay, bx, by) - (inside ? 5 : 0);
        if (d < tol && (!best || d < best.d)) best = { d, r, side };
      }
    }
    if (!best) { this.app.hint?.('Kapı/pencere eklemek için bir duvarın üzerine dokunun'); return; }
    const { r, side } = best;
    const len = sideLength(r, side);
    const width = Math.min(kind === 'door' ? 85 : 140, len - 10);
    if (width < 40) { this.app.hint?.('Bu duvar çok kısa'); return; }
    const along = side === 'n' || side === 's' ? wx - r.x : wy - r.y;
    const offset = Math.max(0, Math.min(len - width, snap(along - width / 2)));
    const before = JSON.stringify(p);
    const op = kind === 'door'
      ? { id: uid('o'), kind: 'door', roomId: r.id, side, offset, width, swing: 'in', hinge: 'start', height: 210 }
      : { id: uid('o'), kind: 'window', roomId: r.id, side, offset, width, sill: r.type === 'banyo' || r.type === 'wc' ? 150 : r.type === 'mutfak' ? 100 : 90, height: r.type === 'banyo' || r.type === 'wc' ? 60 : 140 };
    // Balkona açılan kapı: boydan sürgülü cam
    if (kind === 'door') {
      const nb = neighborRoom(p, op);
      if (r.type === 'balkon' || nb?.room.type === 'balkon') {
        const w = Math.min(180, len - 10);
        if (w >= 120) Object.assign(op, { variant: 'sliding', panels: 2, frame: 'antrasit', height: 230, width: w, offset: Math.max(0, Math.min(len - w, snap(along - w / 2))) });
      }
    }
    p.openings.push(op);
    this.app.commit(before);
    this.select({ kind: 'opening', id: op.id });
    if (op.variant === 'sliding') this.app.hint?.('Balkon kapısı boydan sürgülü cam olarak eklendi (özelliklerden değiştirebilirsiniz)');
  }

  // Görünür alanın ortası (yeni mobilya için)
  viewCenter() {
    return this.toWorld(this.W / 2, this.H * 0.4);
  }

  destroy() {
    this._ro.disconnect();
    this.canvas.remove();
  }
}

function inRect(x, y, r) {
  return x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;
}

function distToSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const L = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / L;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
