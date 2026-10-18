// 3B görünüm: sahne kurulumu, kuşbakışı / içeride gezme, yüksek çözünürlüklü görüntü alma
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { computeWalls } from './walls.js';
import { ROOM_TYPES, openingSegment, footprint, roomArea, openingsForRoom, rotForSide } from './model.js';
import { CATALOG } from './catalog.js';
import { woodTexture, tileTexture, deckTexture, wallTileTexture } from './textures.js';
import { makeMaterials, buildFurniture } from './models3d.js';

const cm = (v) => v / 100;

export class Viewer3D {
  constructor(container) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.touchAction = 'none';

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#e8e5df');
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = this.envTex;
    if ('environmentIntensity' in this.scene) this.scene.environmentIntensity = 0.55;
    pmrem.dispose();

    this.hemi = new THREE.HemisphereLight('#ffffff', '#b8a98f', 0.55);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight('#fff3e2', 2.1);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.02;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.05, 200);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI * 0.47;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 60;

    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.mode = 'orbit';
    this.wallMode = 'full';
    this.walk = { yaw: 0, pitch: -0.08, move: [0, 0], keys: {} };
    this._raf = null;
    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize);
    this._setupWalkInput();
    this.resize();
  }

  setProject(project) {
    this.project = project;
    this.build();
    this.resetCamera();
  }

  build() {
    const p = this.project;
    const H = p.wallHeight || 270;
    // eski içeriği temizle
    this.root.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    this.scene.remove(this.root);
    this.root = new THREE.Group();
    this.scene.add(this.root);

    const M = makeMaterials(p.style);
    this.M = M;
    const walls = computeWalls(p);
    this.walls = walls;
    const wallH = this.wallMode === 'full' ? H : 110;
    const wallMat = new THREE.MeshStandardMaterial({ color: p.style.wall, roughness: 0.92 });
    const capMat = new THREE.MeshStandardMaterial({ color: '#3a3836', roughness: 0.9 });
    const frameMat = new THREE.MeshStandardMaterial({ color: '#f4f4f2', roughness: 0.4 });
    const doorMat = new THREE.MeshStandardMaterial({ color: '#f1eee8', roughness: 0.45 });
    const mats = [wallMat, wallMat, capMat, wallMat, wallMat, wallMat];

    const addBox = (x, y, w, d, z0, z1, mat) => {
      if (z1 - z0 < 0.5) return null;
      const m = new THREE.Mesh(new THREE.BoxGeometry(cm(w), cm(z1 - z0), cm(d)), mat);
      m.position.set(cm(x + w / 2), cm((z0 + z1) / 2), cm(y + d / 2));
      m.castShadow = true;
      m.receiveShadow = true;
      this.root.add(m);
      return m;
    };

    // Zemin dokuları
    const floorMat = (room) => {
      const kind = ROOM_TYPES[room.type]?.floor || 'wood';
      let tex;
      const wet = room.type === 'banyo' || room.type === 'wc';
      if (kind === 'tile') tex = tileTexture(wet && p.style.tile === 'beyaz' ? 'gri' : p.style.tile);
      else if (kind === 'deck') tex = deckTexture();
      else tex = woodTexture(p.style.wood);
      const t = tex.clone();
      t.needsUpdate = true;
      const rep = tex.userData.repeatCm || 100;
      t.repeat.set(room.w / rep, room.h / rep);
      if (room.w < room.h && kind === 'wood') { t.rotation = Math.PI / 2; t.repeat.set(room.h / rep, room.w / rep); }
      return new THREE.MeshStandardMaterial({ map: t, roughness: kind === 'tile' ? 0.35 : 0.6, metalness: 0 });
    };

    for (const r of p.rooms) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(cm(r.w), cm(r.h)), floorMat(r));
      m.rotation.x = -Math.PI / 2;
      m.position.set(cm(r.x + r.w / 2), 0, cm(r.y + r.h / 2));
      m.receiveShadow = true;
      this.root.add(m);
    }
    // Zemin altı (dış alan)
    const b = this._bounds();
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(cm(b.w + 3000), cm(b.h + 3000)), new THREE.MeshStandardMaterial({ color: '#d7d2c9', roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(cm(b.cx), -0.01, cm(b.cy));
    ground.receiveShadow = true;
    this.root.add(ground);

    // Duvarlar
    for (const w of walls.solids) addBox(w.x, w.y, w.w, w.h, 0, wallH, mats);
    for (const w of walls.parapets) {
      addBox(w.x, w.y, w.w, w.h, 0, Math.min(wallH, 100), mats);
    }
    // Kapı boşlukları: eşik + lento
    for (const d of walls.doors) {
      const top = d.op.height || 210;
      if (wallH > top) addBox(d.x, d.y, d.w, d.h, top, wallH, mats);
      const sill = new THREE.Mesh(new THREE.BoxGeometry(cm(d.w), 0.01, cm(d.h)), new THREE.MeshStandardMaterial({ color: '#cfc8bc', roughness: 0.5 }));
      sill.position.set(cm(d.x + d.w / 2), 0.004, cm(d.y + d.h / 2));
      sill.receiveShadow = true;
      this.root.add(sill);
    }
    // Pencereler: denizlik altı + üstü + cam + çerçeve
    for (const wnd of walls.windows) {
      const op = wnd.op;
      const sill = op.sill ?? 90, top = sill + (op.height ?? 140);
      addBox(wnd.x, wnd.y, wnd.w, wnd.h, 0, Math.min(sill, wallH), mats);
      if (wallH > top) addBox(wnd.x, wnd.y, wnd.w, wnd.h, top, wallH, mats);
      if (wallH > sill) {
        const horiz = wnd.w >= wnd.h;
        const glassTop = Math.min(top, wallH);
        const len = horiz ? wnd.w : wnd.h;
        const cx = wnd.x + wnd.w / 2, cy = wnd.y + wnd.h / 2;
        const glass = new THREE.Mesh(new THREE.BoxGeometry(cm(horiz ? len : 1), cm(glassTop - sill), cm(horiz ? 1 : len)), M.glass);
        glass.position.set(cm(cx), cm((sill + glassTop) / 2), cm(cy));
        this.root.add(glass);
        // çerçeve
        const fr = (fw, fh, fx, fz0, fz1) => {
          const g = new THREE.Mesh(new THREE.BoxGeometry(cm(horiz ? fw : 6), cm(fz1 - fz0), cm(horiz ? 6 : fw)), frameMat);
          const off = fx;
          g.position.set(cm(horiz ? cx + off : cx), cm((fz0 + fz1) / 2), cm(horiz ? cy : cy + off));
          g.castShadow = true;
          this.root.add(g);
        };
        fr(5, 0, -len / 2 + 2.5, sill, glassTop);
        fr(5, 0, len / 2 - 2.5, sill, glassTop);
        if (len > 110) fr(4, 0, 0, sill, glassTop);
        const hb = (z) => {
          const g = new THREE.Mesh(new THREE.BoxGeometry(cm(horiz ? len : 6), cm(5), cm(horiz ? 6 : len)), frameMat);
          g.position.set(cm(cx), cm(z), cm(cy));
          this.root.add(g);
        };
        hb(sill + 2.5);
        if (glassTop === top) hb(top - 2.5);
        // mermer denizlik (iç taraf)
        const ds = new THREE.Mesh(new THREE.BoxGeometry(cm(horiz ? len + 6 : (horiz ? 0 : wnd.w + 8)), cm(3), cm(horiz ? wnd.h + 8 : len + 6)), new THREE.MeshStandardMaterial({ color: '#ece9e3', roughness: 0.3 }));
        ds.position.set(cm(cx), cm(sill - 1.5), cm(cy));
        ds.castShadow = true;
        this.root.add(ds);
      }
    }
    // Kapı kanatları (aralık açık)
    for (const op of p.openings) {
      if (op.kind !== 'door') continue;
      const room = p.rooms.find((r) => r.id === op.roomId);
      if (!room) continue;
      const s = openingSegment(op, room);
      const hingeStart = op.hinge !== 'end';
      const hx = hingeStart ? s.ax : s.bx, hy = hingeStart ? s.ay : s.by;
      const ex = hingeStart ? s.bx : s.ax, ey = hingeStart ? s.by : s.ay;
      const sgn = op.swing === 'out' ? -1 : 1;
      const nx = s.nx * sgn, ny = s.ny * sgn;
      const open = (75 * Math.PI) / 180;
      const cdx = (ex - hx) / op.width, cdy = (ey - hy) / op.width;
      // kapalı yön ile açık yön arasında döndür
      const dx = cdx * Math.cos(open) + nx * Math.sin(open);
      const dy = cdy * Math.cos(open) + ny * Math.sin(open);
      const L = op.width - 4;
      const dh = Math.min((op.height || 210) - 3, wallH - 1);
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(cm(L), cm(dh), cm(4)), doorMat);
      leaf.position.set(cm(hx + nx * 2 + dx * (L / 2 + 2)), cm(dh / 2 + 1), cm(hy + ny * 2 + dy * (L / 2 + 2)));
      leaf.rotation.y = -Math.atan2(dy, dx);
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      this.root.add(leaf);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 8), M.metal);
      knob.position.set(cm(hx + nx * 2 + dx * (L - 6)), cm(100), cm(hy + ny * 2 + dy * (L - 6)));
      this.root.add(knob);
    }

    // Banyo/WC duvar seramiği, mutfak tezgâh arası
    const cladTex = wallTileTexture(p.style.tile);
    const clad = (room, side, a, b, z0, z1) => {
      if (b - a < 2 || z1 - z0 < 2) return;
      const t = cladTex.clone();
      t.needsUpdate = true;
      t.repeat.set((b - a) / 120, (z1 - z0) / 120);
      t.offset.set(a / 120, z0 / 120);
      const mat = new THREE.MeshStandardMaterial({ map: t, roughness: 0.25 });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(cm(b - a), cm(z1 - z0)), mat);
      const mid = (a + b) / 2, zm = cm((z0 + z1) / 2), e = 0.6;
      if (side === 'n') { m.position.set(cm(mid), zm, cm(room.y + e)); }
      if (side === 's') { m.position.set(cm(mid), zm, cm(room.y + room.h - e)); m.rotation.y = Math.PI; }
      if (side === 'w') { m.position.set(cm(room.x + e), zm, cm(mid)); m.rotation.y = Math.PI / 2; }
      if (side === 'e') { m.position.set(cm(room.x + room.w - e), zm, cm(mid)); m.rotation.y = -Math.PI / 2; }
      m.receiveShadow = true;
      this.root.add(m);
    };
    const cladTop = Math.min(wallH, 220);
    for (const r of p.rooms) {
      const wet = r.type === 'banyo' || r.type === 'wc';
      const kitchen = r.type === 'mutfak';
      if (!wet && !kitchen) continue;
      const ops = openingsForRoom(p, r);
      for (const side of ['n', 'e', 's', 'w']) {
        const horiz = side === 'n' || side === 's';
        const s0 = horiz ? r.x : r.y, s1 = horiz ? r.x + r.w : r.y + r.h;
        let spans = [[s0, s1]];
        if (kitchen) {
          // sadece tezgâh olan kısımlar
          spans = [];
          for (const f of p.furniture) {
            if (f.roomId !== r.id || !/^k_(base|sink|stove|dishwasher|corner)/.test(f.type) || f.rot !== rotForSide(side)) continue;
            const t = horiz ? f.x : f.y;
            spans.push([t - f.w / 2, t + f.w / 2]);
          }
        }
        const cut = (a, b) => {
          const n = [];
          for (const [x, y] of spans) {
            if (b <= x || a >= y) { n.push([x, y]); continue; }
            if (a > x) n.push([x, a]);
            if (b < y) n.push([b, y]);
          }
          spans = n;
        };
        const winSpans = [];
        for (const o of ops) {
          if (o.side !== side) continue;
          const a = s0 + o.offset, b = a + o.width;
          if (o.op.kind === 'door') cut(a, b);
          else { cut(a, b); winSpans.push([a, b, o.op.sill ?? 90]); }
        }
        const z0 = kitchen ? 90 : 0, z1 = kitchen ? 150 : cladTop;
        for (const [a, b] of spans) clad(r, side, a, b, z0, z1);
        for (const [a, b, sill] of winSpans) clad(r, side, a, b, z0, Math.min(z1, sill));
      }
    }

    // Tavan (içeride gezme / iç mekân görüntüleri için)
    this.ceiling = new THREE.Group();
    const ceilMat = new THREE.MeshStandardMaterial({ color: '#fbfaf8', roughness: 0.95, side: THREE.DoubleSide });
    for (const r of p.rooms) {
      if (r.type === 'balkon') continue;
      const c = new THREE.Mesh(new THREE.PlaneGeometry(cm(r.w + 40), cm(r.h + 40)), ceilMat);
      c.rotation.x = Math.PI / 2;
      c.position.set(cm(r.x + r.w / 2), cm(H), cm(r.y + r.h / 2));
      c.castShadow = false;
      c.receiveShadow = false;
      this.ceiling.add(c);
      // tavan lambası
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 24), new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff1d6', emissiveIntensity: 0.9 }));
      lamp.position.set(cm(r.x + r.w / 2), cm(H) - 0.02, cm(r.y + r.h / 2));
      this.ceiling.add(lamp);
    }
    this.ceiling.visible = this.mode === 'walk';
    this.root.add(this.ceiling);

    // Mobilyalar
    for (const f of p.furniture) this.root.add(buildFurniture(f, M));

    this._placeSun();
  }

  _bounds() {
    const p = this.project;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const r of p.rooms) {
      x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y);
      x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h);
    }
    if (!isFinite(x0)) { x0 = 0; y0 = 0; x1 = 500; y1 = 400; }
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  }

  _placeSun() {
    const b = this._bounds();
    const R = cm(Math.max(b.w, b.h)) * 0.75 + 2;
    const c = new THREE.Vector3(cm(b.cx), 0, cm(b.cy));
    this.sun.position.copy(c).add(new THREE.Vector3(R * 0.45, R * 1.6, R * 0.75));
    this.sun.target.position.copy(c);
    const sc = this.sun.shadow.camera;
    sc.left = -R; sc.right = R; sc.top = R; sc.bottom = -R;
    sc.near = 0.5; sc.far = R * 5;
    sc.updateProjectionMatrix();
  }

  resetCamera() {
    const b = this._bounds();
    const c = new THREE.Vector3(cm(b.cx), 0, cm(b.cy));
    const size = cm(Math.max(b.w, b.h));
    if (this.mode === 'orbit') {
      this.camera.fov = 45;
      this.camera.near = 0.05;
      this.camera.updateProjectionMatrix();
      const fovR = (this.camera.fov * Math.PI) / 180;
      const aspect = this.camera.aspect || 1;
      const dist = (size * 0.8) / Math.tan(fovR / 2) / Math.min(1, aspect * 1.25) + 1;
      this.camera.position.set(c.x + dist * 0.38, dist * 0.8, c.z + dist * 0.55);
      this.controls.target.copy(c);
      this.controls.update();
    } else {
      // en büyük odanın ortasında başla
      const room = this.project.rooms.slice().sort((a, b2) => roomArea(b2) - roomArea(a))[0];
      if (room) {
        this.camera.position.set(cm(room.x + room.w / 2), 1.6, cm(room.y + room.h / 2));
        this.walk.yaw = room.w > room.h ? -Math.PI / 2 : 0;
      }
      this.walk.pitch = -0.08;
      this.camera.fov = 70;
      this.camera.updateProjectionMatrix();
    }
  }

  _interiorLight(on) {
    if ('environmentIntensity' in this.scene) this.scene.environmentIntensity = on ? 0.4 : 0.55;
    this.hemi.intensity = on ? 0.35 : 0.55;
    this.renderer.toneMappingExposure = 1.0;
  }

  setMode(mode) {
    this.mode = mode;
    this._interiorLight(mode === 'walk');
    this.controls.enabled = mode === 'orbit';
    if (this.ceiling) this.ceiling.visible = mode === 'walk';
    if (mode === 'walk' && this.wallMode !== 'full') { this.wallMode = 'full'; this.build(); }
    this.resetCamera();
  }

  setWallMode(m) {
    this.wallMode = m;
    this.build();
  }

  resize() {
    const w = this.container.clientWidth || 1, h = this.container.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (this._raf) return;
    let last = performance.now();
    const loop = (t) => {
      this._raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (this.mode === 'orbit') this.controls.update();
      else this._updateWalk(dt);
      this.renderer.render(this.scene, this.camera);
    };
    this._raf = requestAnimationFrame(loop);
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this._onResize);
    this.controls.dispose();
    this.root.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    this.renderer.dispose();
    this.renderer.forceContextLoss?.();
    this.renderer.domElement.remove();
  }

  // ------------- İçeride gezme kontrolleri -------------
  _setupWalkInput() {
    const el = this.renderer.domElement;
    const ptrs = new Map();
    el.addEventListener('pointerdown', (e) => {
      if (this.mode !== 'walk') return;
      el.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      const isJoy = e.clientX - rect.left < rect.width * 0.45 && e.clientY - rect.top > rect.height * 0.45;
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, joy: isJoy });
      if (isJoy) this.onJoystick?.({ active: true, x: e.clientX - rect.left, y: e.clientY - rect.top, dx: 0, dy: 0 });
    });
    el.addEventListener('pointermove', (e) => {
      const p = ptrs.get(e.pointerId);
      if (!p || this.mode !== 'walk') return;
      if (p.joy) {
        const dx = e.clientX - p.sx, dy = e.clientY - p.sy;
        const m = 60;
        const len = Math.min(1, Math.hypot(dx, dy) / m);
        const a = Math.atan2(dy, dx);
        this.walk.move = [Math.cos(a) * len, Math.sin(a) * len];
        const rect = el.getBoundingClientRect();
        this.onJoystick?.({ active: true, x: p.sx - rect.left, y: p.sy - rect.top, dx: Math.cos(a) * len * m, dy: Math.sin(a) * len * m });
      } else {
        this.walk.yaw -= (e.clientX - p.x) * 0.005;
        this.walk.pitch = Math.max(-1.2, Math.min(1.0, this.walk.pitch - (e.clientY - p.y) * 0.004));
      }
      p.x = e.clientX; p.y = e.clientY;
    });
    const end = (e) => {
      const p = ptrs.get(e.pointerId);
      if (p?.joy) { this.walk.move = [0, 0]; this.onJoystick?.({ active: false }); }
      ptrs.delete(e.pointerId);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    window.addEventListener('keydown', (e) => { this.walk.keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', (e) => { this.walk.keys[e.key.toLowerCase()] = false; });
  }

  _updateWalk(dt) {
    const k = this.walk.keys;
    let mx = this.walk.move[0], my = this.walk.move[1];
    if (k.w || k.arrowup) my = -1;
    if (k.s || k.arrowdown) my = 1;
    if (k.a || k.arrowleft) mx = -1;
    if (k.d || k.arrowright) mx = 1;
    const speed = 1.4;
    const fwd = new THREE.Vector3(-Math.sin(this.walk.yaw), 0, -Math.cos(this.walk.yaw));
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
    const pos = this.camera.position;
    const next = pos.clone().addScaledVector(fwd, -my * speed * dt).addScaledVector(right, mx * speed * dt);
    if (this._walkable(next.x * 100, next.z * 100)) pos.copy(next);
    else {
      // duvar boyunca kay
      const nx = pos.clone(); nx.x = next.x;
      const nz = pos.clone(); nz.z = next.z;
      if (this._walkable(nx.x * 100, nx.z * 100)) pos.copy(nx);
      else if (this._walkable(nz.x * 100, nz.z * 100)) pos.copy(nz);
    }
    pos.y = 1.6;
    const look = new THREE.Vector3(
      pos.x - Math.sin(this.walk.yaw) * Math.cos(this.walk.pitch),
      pos.y + Math.sin(this.walk.pitch),
      pos.z - Math.cos(this.walk.yaw) * Math.cos(this.walk.pitch),
    );
    this.camera.lookAt(look);
  }

  // Duvarlardan geçmeyi engelle (kapılardan geçilebilir)
  _walkable(x, y) {
    const g = this.walls?.grid;
    if (!g) return true;
    const r = 18; // kişi yarıçapı
    for (const [ox, oy] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) {
      const i = Math.round((x + ox - g.ox) / 5), j = Math.round((y + oy - g.oy) / 5);
      if (i < 0 || j < 0 || i >= g.cols || j >= g.rows) return false;
      const v = g.data[j * g.cols + i];
      if (v === 2 || v === 4 || v === 0) return false;
    }
    return true;
  }

  // ------------- Görüntü alma -------------

  // Belirli bir kamera ile yüksek çözünürlüklü JPEG üret
  renderShot(camera, width, height, { ceiling = false, wallMode = null } = {}) {
    const prevWall = this.wallMode;
    if (wallMode && wallMode !== this.wallMode) { this.wallMode = wallMode; this.build(); }
    const prevCeil = this.ceiling.visible;
    this.ceiling.visible = ceiling;
    this._interiorLight(ceiling);
    const prevSize = new THREE.Vector2();
    this.renderer.getSize(prevSize);
    const prevRatio = this.renderer.getPixelRatio();
    const prevMap = this.sun.shadow.mapSize.x;
    this.sun.shadow.mapSize.set(4096, 4096);
    if (this.sun.shadow.map) { this.sun.shadow.map.dispose(); this.sun.shadow.map = null; }
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix?.();
    this.renderer.render(this.scene, camera);
    const url = this.renderer.domElement.toDataURL('image/jpeg', 0.9);
    // geri al
    this.sun.shadow.mapSize.set(prevMap, prevMap);
    if (this.sun.shadow.map) { this.sun.shadow.map.dispose(); this.sun.shadow.map = null; }
    this.renderer.setPixelRatio(prevRatio);
    this.renderer.setSize(prevSize.x, prevSize.y, false);
    this.ceiling.visible = prevCeil;
    this._interiorLight(this.mode === 'walk');
    if (wallMode && prevWall !== this.wallMode) { this.wallMode = prevWall; this.build(); }
    this.resize();
    return url;
  }

  captureCurrent(width = 1920, height = 1080) {
    const cam = this.camera.clone();
    return this.renderShot(cam, width, height, { ceiling: this.mode === 'walk' });
  }

  // Kuşbakışı perspektif (sunum kapağı)
  captureBird(width, height, azimuth = 0.6) {
    const b = this._bounds();
    const cam = new THREE.PerspectiveCamera(35, width / height, 0.1, 300);
    const c = new THREE.Vector3(cm(b.cx), 0, cm(b.cy));
    const size = cm(Math.max(b.w, b.h));
    const dist = size * 1.55 + 3;
    cam.position.set(c.x + Math.sin(azimuth) * dist * 0.55, dist * 0.95, c.z + Math.cos(azimuth) * dist * 0.55);
    cam.lookAt(c.x, -0.4, c.z);
    return this.renderShot(cam, width, height, { ceiling: false, wallMode: 'full' });
  }

  // Tam tepeden 3B kat planı
  captureTop(width, height) {
    const b = this._bounds();
    const pad = 60;
    const w = cm(b.w + pad * 2), h = cm(b.h + pad * 2);
    const aspect = width / height;
    let vw = w, vh = h;
    if (vw / vh < aspect) vw = vh * aspect; else vh = vw / aspect;
    const cam = new THREE.OrthographicCamera(-vw / 2, vw / 2, vh / 2, -vh / 2, 0.1, 100);
    cam.position.set(cm(b.cx), 30, cm(b.cy));
    cam.up.set(0, 0, -1);
    cam.lookAt(cm(b.cx), 0, cm(b.cy));
    return this.renderShot(cam, width, height, { ceiling: false, wallMode: 'full' });
  }

  // Oda içi görüntü: odanın içinden, en çok mobilya gören ve önü açık noktadan bakış
  captureRoom(room, width, height) {
    const p = this.project;
    const H = p.wallHeight || 270;
    const items = p.furniture.filter((f) => f.roomId === room.id);
    const eye = Math.min(150, H - 50);
    const small = room.w * room.h < 80000;
    const fovV = small ? 72 : 62;
    const fovH = (2 * Math.atan(Math.tan((fovV * Math.PI) / 360) * (width / height)) * 180) / Math.PI;
    // göz hizasını kesen engeller
    const obst = items.filter((f) => {
      const c = CATALOG[f.type] || {};
      const top = (c.elev || 0) + f.h;
      const bottom = c.elev || 0;
      return top > eye - 20 && bottom < eye + 20;
    }).map((f) => footprint(f));
    const R = { x0: room.x, y0: room.y, x1: room.x + room.w, y1: room.y + room.h };
    // açık kapı kanatlarının taradığı alan da engel sayılır
    for (const o of openingsForRoom(p, room)) {
      if (o.op.kind !== 'door' || !o.swingIn) continue;
      const a = (o.side === 'n' || o.side === 's' ? room.x : room.y) + o.offset, b = a + o.width, d = o.width;
      if (o.side === 'n') obst.push({ x0: a, x1: b, y0: R.y0, y1: R.y0 + d });
      if (o.side === 's') obst.push({ x0: a, x1: b, y0: R.y1 - d, y1: R.y1 });
      if (o.side === 'w') obst.push({ x0: R.x0, x1: R.x0 + d, y0: a, y1: b });
      if (o.side === 'e') obst.push({ x0: R.x1 - d, x1: R.x1, y0: a, y1: b });
    }
    const ray = (x, y, a) => {
      const dx = Math.cos(a), dy = Math.sin(a);
      for (let t = 0; t < 2000; t += 5) {
        const px = x + dx * t, py = y + dy * t;
        if (px < R.x0 || px > R.x1 || py < R.y0 || py > R.y1) return t;
        for (const o of obst) if (px > o.x0 && px < o.x1 && py > o.y0 && py < o.y1) return t;
      }
      return 2000;
    };
    const cands = [];
    const ins = small ? 20 : 35;
    const cx = room.x + room.w / 2, cy = room.y + room.h / 2;
    for (const [px, py] of [
      [R.x0 + ins, R.y0 + ins], [R.x1 - ins, R.y0 + ins], [R.x0 + ins, R.y1 - ins], [R.x1 - ins, R.y1 - ins],
      [cx, R.y0 + ins], [cx, R.y1 - ins], [R.x0 + ins, cy], [R.x1 - ins, cy],
    ]) {
      // kamera bir engelin içinde olmasın
      if (obst.some((o) => px > o.x0 - 8 && px < o.x1 + 8 && py > o.y0 - 8 && py < o.y1 + 8)) continue;
      const base = Math.atan2(cy - py, cx - px);
      for (const off of [-0.35, -0.17, 0, 0.17, 0.35]) {
        const a = base + off;
        let sum = 0, minD = Infinity;
        const N = 9;
        for (let k = 0; k < N; k++) {
          const aa = a + ((k / (N - 1)) - 0.5) * (fovH * Math.PI / 180) * 0.9;
          const d = ray(px, py, aa);
          sum += d;
          if (Math.abs(k - (N - 1) / 2) <= 2) minD = Math.min(minD, d);
        }
        // görüş alanındaki mobilyalar
        let vis = 0;
        for (const f of items) {
          const fp = footprint(f);
          const mx = (fp.x0 + fp.x1) / 2, my = (fp.y0 + fp.y1) / 2;
          let da = Math.atan2(my - py, mx - px) - a;
          while (da > Math.PI) da -= 2 * Math.PI;
          while (da < -Math.PI) da += 2 * Math.PI;
          if (Math.abs(da) > (fovH * Math.PI) / 360 * 0.85) continue;
          const dist = Math.hypot(mx - px, my - py);
          if (dist < 60) continue;
          const size = Math.min(4, ((fp.x1 - fp.x0) * (fp.y1 - fp.y0)) / 6000);
          vis += size * (ray(px, py, Math.atan2(my - py, mx - px)) + 30 >= dist ? 1 : 0.35);
        }
        const diag = Math.hypot(room.w, room.h);
        let score = vis * 1.4 + (sum / N / diag) * 4;
        if (minD < 90) score -= 8;
        else if (minD < 150) score -= 2;
        cands.push({ px, py, a, score });
      }
    }
    if (!cands.length) cands.push({ px: cx, py: cy, a: 0, score: 0 });
    cands.sort((a, b) => b.score - a.score);
    const best = cands[0];
    const cam = new THREE.PerspectiveCamera(fovV, width / height, 0.05, 100);
    cam.position.set(cm(best.px), cm(eye), cm(best.py));
    cam.lookAt(cm(best.px + Math.cos(best.a) * 300), cm(eye - 300 * Math.tan(0.16)), cm(best.py + Math.sin(best.a) * 300));
    // Tavan lambası: gölgeli nokta ışık
    const lamp = new THREE.PointLight('#ffe7c4', 1, 0, 2);
    lamp.power = (this.lampPower ?? 110) * Math.max(1, (room.w * room.h) / 150000);
    lamp.position.set(cm(cx), cm(H - 35), cm(cy));
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(1024, 1024);
    lamp.shadow.bias = -0.002;
    lamp.shadow.radius = 4;
    this.scene.add(lamp);
    const prevSun = this.sun.intensity;
    this.sun.intensity = prevSun * 0.35;
    this.ceiling.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    const url = this.renderShot(cam, width, height, { ceiling: true, wallMode: 'full' });
    this.ceiling.traverse((o) => { if (o.isMesh) o.castShadow = false; });
    this.sun.intensity = prevSun;
    this.scene.remove(lamp);
    lamp.dispose();
    return url;
  }
}
