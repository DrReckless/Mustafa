import { BUILDINGS, TILE } from './config.js';

// Dokunmatik + fare + klavye kontrolleri
export class Input {
  constructor(app, canvas) {
    this.app = app; this.canvas = canvas;
    this.pointers = new Map();
    this.tool = null;
    this.rot = 0;
    this.keys = new Set();
    this.line = null;
    canvas.addEventListener('pointerdown', (e) => this.down(e));
    window.addEventListener('pointermove', (e) => this.move(e));
    window.addEventListener('pointerup', (e) => this.up(e));
    window.addEventListener('pointercancel', (e) => this.up(e, true));
    canvas.addEventListener('wheel', (e) => { e.preventDefault(); this.cam.dist *= Math.pow(1.0015, e.deltaY); }, { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('keydown', (e) => this.key(e, true));
    window.addEventListener('keyup', (e) => this.key(e, false));
  }
  get view() { return this.app.view; }
  get cam() { return this.app.view.cam; }
  get game() { return this.app.game; }

  setTool(t) {
    this.tool = t;
    this.line = null;
    this.view.ghosts = [];
    this.view.toolType = t?.kind === 'build' ? t.type : null;
    this.app.ui.setToolUI(t);
    if (t) this.app.select(null);
  }
  rotate() {
    this.rot = (this.rot + 1) % 4;
    this.app.audio.play('click');
    if (this.hover) this.updateGhost(this.hover);
  }

  key(e, d) {
    if (!this.app.playing) return;
    const k = e.key.toLowerCase();
    if (d) this.keys.add(k); else this.keys.delete(k);
    if (!d) return;
    if (k === 'r') this.rotate();
    if (k === 'escape') { if (this.tool) this.setTool(null); else this.app.select(null); }
    if (k === 'x') this.setTool(this.tool?.kind === 'demolish' ? null : { kind: 'demolish' });
    if (k === ' ') this.app.setSpeed(this.app.game.speed === 0 ? 1 : 0);
  }
  update(dt) {
    const c = this.cam, s = c.dist * 1.2 * dt;
    let mx = 0, mz = 0;
    if (this.keys.has('w') || this.keys.has('arrowup')) mz -= 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) mz += 1;
    if (this.keys.has('a') || this.keys.has('arrowleft')) mx -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) mx += 1;
    if (this.keys.has('q')) c.yaw += dt * 1.5;
    if (this.keys.has('e')) c.yaw -= dt * 1.5;
    if (mx || mz) {
      const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
      c.tx += (mx * cy + mz * sy) * s; c.tz += (-mx * sy + mz * cy) * s;
    }
  }

  down(e) {
    if (!this.app.playing) return;
    this.app.audio.resume();
    this.canvas.setPointerCapture?.(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), btn: e.button });
    const n = this.pointers.size;
    this.view.dragging = true;
    this.cam.vx = this.cam.vz = 0;
    if (n === 1) {
      this.moved = false;
      const g = this.view.screenToGround(e.clientX, e.clientY);
      if (this.tool?.kind === 'build' && BUILDINGS[this.tool.type].line && e.button === 0 && g) {
        this.line = { x0: g.x, y0: g.y, x1: g.x, y1: g.y, axis: null };
        this.updateLineGhost();
      } else if (this.tool?.kind === 'build' && g) {
        this.hover = g; this.updateGhost(g);
      }
    } else {
      // ikinci parmak: çizimi iptal et
      this.line = null; if (this.tool) this.view.ghosts = [];
      this.gesture = this.gestureState();
    }
  }
  gestureState() {
    const p = [...this.pointers.values()];
    const dx = p[1].x - p[0].x, dy = p[1].y - p[0].y;
    return { d: Math.hypot(dx, dy), a: Math.atan2(dy, dx), mx: (p[0].x + p[1].x) / 2, my: (p[0].y + p[1].y) / 2, dist: this.cam.dist, yaw: this.cam.yaw, pitch: this.cam.pitch };
  }
  move(e) {
    if (!this.app.playing) return;
    const p = this.pointers.get(e.pointerId);
    if (!p) {
      // fare gezinmesi: hayalet önizleme
      if (e.pointerType === 'mouse' && this.tool?.kind === 'build' && !BUILDINGS[this.tool.type].line) {
        const g = this.view.screenToGround(e.clientX, e.clientY);
        if (g) { this.hover = g; this.updateGhost(g); }
      }
      return;
    }
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (Math.hypot(p.x - p.sx, p.y - p.sy) > 8) this.moved = true;
    const c = this.cam;
    if (this.pointers.size >= 2 && this.gesture) {
      const g = this.gestureState(), g0 = this.gesture;
      c.dist = g0.dist * (g0.d / Math.max(20, g.d));
      let da = g.a - g0.a; da = Math.atan2(Math.sin(da), Math.cos(da));
      c.yaw = g0.yaw - da;
      // iki parmak dikey kaydırma: eğim; ortalama kaydırma: pan
      const pdx = g.mx - g0.mx, pdy = g.my - g0.my;
      this.panBy(pdx, pdy);
      g0.mx = g.mx; g0.my = g.my;
      return;
    }
    if (this.line) {
      const g = this.view.screenToGround(e.clientX, e.clientY);
      if (g && (g.x !== this.line.x1 || g.y !== this.line.y1)) {
        this.line.x1 = g.x; this.line.y1 = g.y;
        if (!this.line.axis && (g.x !== this.line.x0 || g.y !== this.line.y0)) this.line.axis = Math.abs(g.x - this.line.x0) >= Math.abs(g.y - this.line.y0) ? 'x' : 'y';
        this.updateLineGhost();
      }
      return;
    }
    if (p.btn === 2 || (e.pointerType === 'mouse' && e.buttons === 4)) {
      c.yaw -= dx * 0.006; c.pitch += dy * 0.004;
      return;
    }
    if (this.tool?.kind === 'build' && e.pointerType !== 'mouse' && !this.moved) {
      const g = this.view.screenToGround(e.clientX, e.clientY);
      if (g) { this.hover = g; this.updateGhost(g); }
    }
    if (this.moved) {
      this.panBy(dx, dy);
      const now = performance.now(), dtm = Math.max(1, now - (p.lt || now - 16)) / 1000;
      p.lt = now;
      const k = this.cam.dist / window.innerHeight * 1.25;
      const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
      const vx = -(dx * cy + dy * sy) * k / dtm, vz = -(-dx * sy + dy * cy) * k / dtm;
      c.vx = c.vx * 0.5 + vx * 0.5; c.vz = c.vz * 0.5 + vz * 0.5;
    }
  }
  panBy(dx, dy) {
    const c = this.cam;
    const k = c.dist / window.innerHeight * 1.25;
    const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
    c.tx -= (dx * cy + dy * sy) * k;
    c.tz -= (-dx * sy + dy * cy) * k;
  }
  up(e, cancel = false) {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.gesture = null;
    if (this.pointers.size === 0) this.view.dragging = false;
    if (this.pointers.size > 0) { this.moved = true; return; }
    if (cancel || !this.app.playing) { this.line = null; return; }
    const dt = performance.now() - p.t;
    if (this.line) {
      this.commitLine();
      return;
    }
    const tap = !this.moved && dt < 600;
    if (!tap) {
      if (this.tool?.kind === 'build' && e.pointerType !== 'mouse') { /* hayalet kalır */ }
      return;
    }
    const g = this.view.screenToGround(e.clientX, e.clientY);
    if (!g) return;
    this.cam.vx = this.cam.vz = 0;
    if (this.tool?.kind === 'build') this.placeAt(g);
    else if (this.tool?.kind === 'demolish') {
      const b = this.game.at(g.x, g.y);
      if (b && this.game.demolish(b)) this.app.audio.play('demolish');
      else this.app.audio.play('error');
    } else {
      if (p.btn === 2) return;
      const u = this.view.pickUnit(g.fx, g.fy);
      if (u) this.app.select({ u });
      else {
        const b = this.game.at(g.x, g.y);
        this.app.select(b ? { b } : null);
      }
    }
  }

  // ---------- yerleştirme ----------
  originFor(type, g) {
    const s = BUILDINGS[type].size;
    if (s === 1) return [g.x, g.y];
    return [Math.round(g.fx - s / 2), Math.round(g.fy - s / 2)];
  }
  updateGhost(g) {
    if (this.tool?.kind !== 'build') return;
    const t = this.tool.type;
    const [x, y] = this.originFor(t, g);
    const ok = this.game.canPlace(t, x, y).ok;
    this.view.ghosts = [{ type: t, x, y, dir: this.rot, ok }];
  }
  placeAt(g) {
    const t = this.tool.type;
    const [x, y] = this.originFor(t, g);
    const chk = this.game.canPlace(t, x, y);
    if (!chk.ok) { this.app.ui.toast(chk.why, 'warn'); this.app.audio.play('error'); return; }
    this.game.placeBuilding(t, x, y, this.rot);
    this.app.audio.play('build');
    this.updateGhost(g);
    if (!this.game.canAfford(BUILDINGS[t].cost)) this.setTool(null);
  }
  linePath() {
    const L = this.line;
    const out = [];
    const { x0, y0, x1, y1 } = L;
    if (x0 === x1 && y0 === y1) { out.push([x0, y0, this.rot]); return out; }
    const sx = Math.sign(x1 - x0), sy = Math.sign(y1 - y0);
    const dirX = sx > 0 ? 0 : 2, dirY = sy > 0 ? 1 : 3;
    if (L.axis !== 'y') {
      for (let x = x0; x !== x1; x += sx) out.push([x, y0, dirX]);
      if (y0 === y1) out.push([x1, y0, dirX]);
      else { for (let y = y0; y !== y1; y += sy) out.push([x1, y, dirY]); out.push([x1, y1, dirY]); }
    } else {
      for (let y = y0; y !== y1; y += sy) out.push([x0, y, dirY]);
      if (x0 === x1) out.push([x0, y1, dirY]);
      else { for (let x = x0; x !== x1; x += sx) out.push([x, y1, dirX]); out.push([x1, y1, dirX]); }
    }
    return out.slice(0, 80);
  }
  updateLineGhost() {
    const t = this.tool.type;
    const cost = BUILDINGS[t].cost;
    const stock = { ...this.game.stock };
    this.view.ghosts = this.linePath().map(([x, y, d]) => {
      let ok = this.game.canPlace(t, x, y, true).ok;
      if (ok) {
        for (const k in cost) if ((stock[k] || 0) < cost[k]) ok = false;
        if (ok) for (const k in cost) stock[k] -= cost[k];
      }
      const ex = this.game.at(x, y);
      if (ex && ex.items && BUILDINGS[t].speed && ex.faction === 0) ok = ex.type === t || this.game.canAfford(BUILDINGS[t].cost);
      return { type: t, x, y, dir: BUILDINGS[t].speed ? d : 0, ok };
    });
  }
  commitLine() {
    const t = this.tool.type;
    let n = 0, fail = 0;
    for (const [x, y, d] of this.linePath()) {
      const ex = this.game.at(x, y);
      const isBelt = !!BUILDINGS[t].speed;
      // var olan konveyör: yönünü güncelle ya da türünü yükselt
      if (ex && ex.items && isBelt && ex.faction === 0) {
        if (ex.type === t) { if (ex.dir !== d) { ex.dir = d; this.game.emit('update', ex); n++; } }
        else if (this.game.replaceBelt(ex, t, d)) n++; else fail++;
        continue;
      }
      if (this.game.placeBuilding(t, x, y, isBelt ? d : 0)) n++; else if (!ex) fail++;
    }
    this.line = null;
    this.view.ghosts = [];
    if (n) this.app.audio.play('build');
    if (fail && !this.game.canAfford(BUILDINGS[t].cost)) this.app.ui.toast('Yetersiz malzeme', 'warn');
    void TILE;
  }
}
