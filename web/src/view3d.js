// 3B görünüm: sahne kurulumu, kuşbakışı / içeride gezme, açılır kapılar,
// dekor (perde, tablo, sarkıt lamba), yüksek çözünürlüklü görüntü alma (ortam kapatma gölgeli)
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { computeWalls } from './walls.js';
import {
  ROOM_TYPES, openingSegment, footprint, frontDir, openingsForRoom, activeOpenings, computeSpaces, isSliding, neighborRoom,
} from './model.js';
import { CATALOG } from './catalog.js';
import { woodTexture, tileTexture, deckTexture, wallTileTexture, artTexture } from './textures.js';
import { makeMaterials, buildFurniture } from './models3d.js';
import { buildSpaceContext } from './layout.js';

const cm = (v) => v / 100;
const HINGE_OPEN = (85 * Math.PI) / 180;
const CURTAIN_ROOMS = ['salon', 'yatak', 'cocuk', 'calisma', 'yemek'];

// Ortam kapatma geçişi: yarı saydam camları hesaba katma
class AOPass extends GTAOPass {
  overrideVisibility() {
    super.overrideVisibility();
    this.scene.traverse((o) => { if (o.isMesh && o.material && o.material.transparent) o.visible = false; });
  }
}

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
    this.ao = true;
    this.walk = { yaw: 0, pitch: -0.08, move: [0, 0], keys: {} };
    this.doors = [];
    this.doorState = new Map(); // op.id → hedef (0 kapalı, 1 açık)
    this.nearDoor = null;
    this._raf = null;
    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize);
    this._setupInput();
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
    this.root.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    this.scene.remove(this.root);
    this.root = new THREE.Group();
    this.scene.add(this.root);

    const M = makeMaterials(p.style);
    this.M = M;
    const walls = computeWalls(p);
    this.walls = walls;
    const spaces = computeSpaces(p);
    this.spaces = spaces;
    const active = activeOpenings(p);
    const wallH = this.wallMode === 'full' ? H : 110;
    this.wallH = wallH;
    const wallMat = new THREE.MeshStandardMaterial({ color: p.style.wall, roughness: 0.92 });
    const capMat = new THREE.MeshStandardMaterial({ color: '#3a3836', roughness: 0.9 });
    const frameMat = new THREE.MeshStandardMaterial({ color: '#f4f4f2', roughness: 0.4 });
    const mats = [wallMat, wallMat, capMat, wallMat, wallMat, wallMat];

    const addBox = (x, y, w, d, z0, z1, mat, parent = this.root) => {
      if (z1 - z0 < 0.5 || w < 0.1 || d < 0.1) return null;
      const m = new THREE.Mesh(new THREE.BoxGeometry(cm(w), cm(z1 - z0), cm(d)), mat);
      m.position.set(cm(x + w / 2), cm((z0 + z1) / 2), cm(y + d / 2));
      m.castShadow = true;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };

    // ---- Zemin: dokular dünya koordinatına göre, birleşik mekânlarda kesintisiz ----
    const floorMats = new Map();
    const floorMat = (room, rotate) => {
      const kind = ROOM_TYPES[room.type]?.floor || 'wood';
      const wet = room.type === 'banyo' || room.type === 'wc';
      const key = `${kind}:${wet}:${rotate}`;
      if (floorMats.has(key)) return floorMats.get(key);
      let tex;
      if (kind === 'tile') tex = tileTexture(wet && p.style.tile === 'beyaz' ? 'gri' : p.style.tile);
      else if (kind === 'deck') tex = deckTexture();
      else tex = woodTexture(p.style.wood);
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: kind === 'tile' ? 0.32 : 0.58, metalness: 0 });
      mat.userData.rep = tex.userData.repeatCm || 100;
      floorMats.set(key, mat);
      return mat;
    };
    const floorPlane = (x0, y0, x1, y1, mat, rotate) => {
      const geo = new THREE.PlaneGeometry(cm(x1 - x0), cm(y1 - y0));
      const pos = geo.attributes.position, uv = geo.attributes.uv;
      const rep = mat.userData.rep;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      for (let i = 0; i < pos.count; i++) {
        const wx = cx + pos.getX(i) * 100, wy = cy - pos.getY(i) * 100;
        if (rotate) uv.setXY(i, wy / rep, wx / rep); else uv.setXY(i, wx / rep, -wy / rep);
      }
      const m = new THREE.Mesh(geo, mat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(cm(cx), 0, cm(cy));
      m.receiveShadow = true;
      this.root.add(m);
    };
    for (const sp of spaces.spaces) {
      const rotate = sp.primary.w < sp.primary.h;
      for (const r of sp.rooms) {
        const sameFloor = ROOM_TYPES[r.type]?.floor === ROOM_TYPES[sp.primary.type]?.floor;
        floorPlane(r.x, r.y, r.x + r.w, r.y + r.h, floorMat(r, sameFloor ? rotate : r.w < r.h), sameFloor ? rotate : r.w < r.h);
      }
      for (const q of sp.gaps) floorPlane(q.x0, q.y0, q.x1, q.y1, floorMat(sp.primary, rotate), rotate);
    }
    const b = this._bounds();
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(cm(b.w + 3000), cm(b.h + 3000)), new THREE.MeshStandardMaterial({ color: '#d7d2c9', roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(cm(b.cx), -0.01, cm(b.cy));
    ground.receiveShadow = true;
    this.root.add(ground);

    // ---- Duvarlar ----
    for (const w of walls.solids) addBox(w.x, w.y, w.w, w.h, 0, wallH, mats);
    for (const w of walls.parapets) addBox(w.x, w.y, w.w, w.h, 0, Math.min(wallH, 100), mats);
    // Kapı boşlukları: eşik + lento
    const thresholdMat = new THREE.MeshStandardMaterial({ color: '#cfc8bc', roughness: 0.5 });
    const doorRects = new Map();
    for (const d of walls.doors) {
      const top = d.op.height || 210;
      if (wallH > top) addBox(d.x, d.y, d.w, d.h, top, wallH, mats);
      const sill = new THREE.Mesh(new THREE.BoxGeometry(cm(d.w), 0.01, cm(d.h)), thresholdMat);
      sill.position.set(cm(d.x + d.w / 2), 0.004, cm(d.y + d.h / 2));
      sill.receiveShadow = true;
      this.root.add(sill);
      if (!doorRects.has(d.op.id)) doorRects.set(d.op.id, []);
      doorRects.get(d.op.id).push(d);
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
        const fr = (fw, fx, fz0, fz1) => {
          const g = new THREE.Mesh(new THREE.BoxGeometry(cm(horiz ? fw : 6), cm(fz1 - fz0), cm(horiz ? 6 : fw)), frameMat);
          g.position.set(cm(horiz ? cx + fx : cx), cm((fz0 + fz1) / 2), cm(horiz ? cy : cy + fx));
          g.castShadow = true;
          this.root.add(g);
        };
        fr(5, -len / 2 + 2.5, sill, glassTop);
        fr(5, len / 2 - 2.5, sill, glassTop);
        if (len > 110) fr(4, 0, sill, glassTop);
        const hb = (z) => {
          const g = new THREE.Mesh(new THREE.BoxGeometry(cm(horiz ? len : 6), cm(5), cm(horiz ? 6 : len)), frameMat);
          g.position.set(cm(cx), cm(z), cm(cy));
          this.root.add(g);
        };
        hb(sill + 2.5);
        if (glassTop === top) hb(top - 2.5);
        const ds = new THREE.Mesh(new THREE.BoxGeometry(cm(horiz ? len + 6 : wnd.w + 8), cm(3), cm(horiz ? wnd.h + 8 : len + 6)), new THREE.MeshStandardMaterial({ color: '#ece9e3', roughness: 0.3 }));
        ds.position.set(cm(cx), cm(sill - 1.5), cm(cy));
        ds.castShadow = true;
        this.root.add(ds);
      }
    }

    // ---- Kapılar (açılır / sürgülü) ----
    this.doorRoot = new THREE.Group();
    this.root.add(this.doorRoot);
    this.doors = [];
    for (const op of active) {
      if (op.kind !== 'door') continue;
      const rects = doorRects.get(op.id);
      if (!rects) continue;
      if (isSliding(op)) this._buildSlider(op, rects, M);
      else this._buildHinged(op, rects, M, wallH);
    }

    // ---- Duvar kaplaması, süpürgelik (mekân dış hattı boyunca) ----
    const cladTex = wallTileTexture(p.style.tile);
    const cladTop = Math.min(wallH, 220);
    const skirtMat = new THREE.MeshStandardMaterial({ color: '#f5f3ef', roughness: 0.5 });
    const plane = (seg, a, b, z0, z1, mat, inset) => {
      if (b - a < 2 || z1 - z0 < 0.5) return;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(cm(b - a), cm(z1 - z0)), mat);
      const mid = (a + b) / 2, zm = cm((z0 + z1) / 2);
      if (seg.side === 'n') m.position.set(cm(mid), zm, cm(seg.line + inset));
      if (seg.side === 's') { m.position.set(cm(mid), zm, cm(seg.line - inset)); m.rotation.y = Math.PI; }
      if (seg.side === 'w') { m.position.set(cm(seg.line + inset), zm, cm(mid)); m.rotation.y = Math.PI / 2; }
      if (seg.side === 'e') { m.position.set(cm(seg.line - inset), zm, cm(mid)); m.rotation.y = -Math.PI / 2; }
      m.receiveShadow = true;
      this.root.add(m);
    };
    const cladMat = (a, z0, len, hgt) => {
      const t = cladTex.clone();
      t.needsUpdate = true;
      t.repeat.set(len / 120, hgt / 120);
      t.offset.set(a / 120, z0 / 120);
      return new THREE.MeshStandardMaterial({ map: t, roughness: 0.22 });
    };
    this.spaceCtx = new Map();
    for (const sp of spaces.spaces) {
      const ctx = buildSpaceContext(p, sp);
      this.spaceCtx.set(sp.id, ctx);
      const wet = sp.rooms.every((r) => r.type === 'banyo' || r.type === 'wc');
      const kitchen = sp.rooms.some((r) => r.type === 'mutfak');
      const balcony = sp.rooms.every((r) => r.type === 'balkon');
      for (const seg of ctx.walls) {
        let free = [[seg.a0, seg.a1]];
        for (const d of seg.doors) free = cut(free, d.a, d.b);
        if (wet) {
          let spans = free;
          const wins = [];
          for (const w of seg.windows) { spans = cut(spans, w.a, w.b); wins.push(w); }
          for (const [a, bb] of spans) plane(seg, a, bb, 0, cladTop, cladMat(a, 0, bb - a, cladTop), 0.6);
          for (const w of wins) plane(seg, w.a, w.b, 0, Math.min(cladTop, w.sill), cladMat(w.a, 0, w.b - w.a, Math.min(cladTop, w.sill)), 0.6);
          continue;
        }
        if (kitchen) {
          // yalnızca tezgâh arkası (90–150 cm)
          for (const f of p.furniture) {
            if (!/^k_(base|sink|stove|dishwasher|corner)/.test(f.type) || f.rot !== seg.rot || !sp.rooms.some((r) => r.id === f.roomId)) continue;
            const fp = footprint(f);
            const back = { n: fp.y0, s: fp.y1, w: fp.x0, e: fp.x1 }[seg.side];
            if (Math.abs(back - seg.line) > 2) continue;
            const t = seg.horiz ? f.x : f.y;
            let spans = [[Math.max(seg.a0, t - f.w / 2), Math.min(seg.a1, t + f.w / 2)]];
            for (const w of seg.windows) spans = cut(spans, w.a, w.b);
            for (const [a, bb] of spans) plane(seg, a, bb, 90, Math.min(150, wallH), cladMat(a, 90, bb - a, 60), 0.6);
          }
        }
        if (balcony) continue;
        // süpürgelik
        for (const [a, bb] of free) {
          if (bb - a < 3) continue;
          const len = bb - a, mid = (a + bb) / 2;
          const sk = new THREE.Mesh(new THREE.BoxGeometry(cm(seg.horiz ? len : 1.4), cm(8), cm(seg.horiz ? 1.4 : len)), skirtMat);
          const off = 0.7 * (seg.side === 'n' || seg.side === 'w' ? 1 : -1);
          if (seg.horiz) sk.position.set(cm(mid), cm(4), cm(seg.line + off));
          else sk.position.set(cm(seg.line + off), cm(4), cm(mid));
          sk.receiveShadow = true;
          this.root.add(sk);
        }
      }
    }

    // ---- Tavan (içeride gezme / iç mekân görüntüleri için) ----
    this.ceiling = new THREE.Group();
    const ceilMat = new THREE.MeshStandardMaterial({ color: '#fbfaf8', roughness: 0.95, side: THREE.DoubleSide });
    const lampMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#fff1d6', emissiveIntensity: 0.9 });
    const tablesByRoom = new Set(p.furniture.filter((f) => /^dining_|k_island/.test(f.type)).map((f) => f.roomId));
    for (const r of p.rooms) {
      if (r.type === 'balkon') continue;
      const c = new THREE.Mesh(new THREE.PlaneGeometry(cm(r.w + 40), cm(r.h + 40)), ceilMat);
      c.rotation.x = Math.PI / 2;
      c.position.set(cm(r.x + r.w / 2), cm(H), cm(r.y + r.h / 2));
      this.ceiling.add(c);
      if (!tablesByRoom.has(r.id) || !M.decor) {
        const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 24), lampMat);
        lamp.position.set(cm(r.x + r.w / 2), cm(H) - 0.02, cm(r.y + r.h / 2));
        this.ceiling.add(lamp);
      }
    }
    for (const sp of spaces.spaces) for (const q of sp.gaps) {
      if (sp.primary.type === 'balkon') continue;
      const c = new THREE.Mesh(new THREE.PlaneGeometry(cm(q.x1 - q.x0 + 2), cm(q.y1 - q.y0 + 2)), ceilMat);
      c.rotation.x = Math.PI / 2;
      c.position.set(cm((q.x0 + q.x1) / 2), cm(H) - 0.002, cm((q.y0 + q.y1) / 2));
      this.ceiling.add(c);
    }
    this.ceiling.visible = this.mode === 'walk';
    this.root.add(this.ceiling);

    // ---- Dekor ----
    if (M.decor) this._buildDecor(active, walls, M, H);

    // ---- Mobilyalar ----
    for (const f of p.furniture) this.root.add(buildFurniture(f, M));

    this._applyDoors(true);
    this._placeSun();
  }

  // ---------------- Kapılar ----------------
  _doorAxis(rects) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const r of rects) { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h); }
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
  }

  _buildHinged(op, rects, M, wallH) {
    const p = this.project;
    const room = p.rooms.find((r) => r.id === op.roomId);
    if (!room) return;
    const s = openingSegment(op, room);
    const hingeStart = op.hinge !== 'end';
    const hx = hingeStart ? s.ax : s.bx, hy = hingeStart ? s.ay : s.by;
    const ex = hingeStart ? s.bx : s.ax, ey = hingeStart ? s.by : s.ay;
    const sgn = op.swing === 'out' ? -1 : 1;
    const n = { x: s.nx * sgn, y: s.ny * sgn };
    const c = { x: (ex - hx) / op.width, y: (ey - hy) / op.width };
    const entrance = /giri/i.test(op.name || '');
    const L = op.width - 4;
    const dh = Math.min((op.height || 210) - 2, wallH - 1);
    const leafMat = entrance
      ? new THREE.MeshStandardMaterial({ color: '#4a4643', roughness: 0.45, metalness: 0.35 })
      : new THREE.MeshStandardMaterial({ color: '#f3f0ea', roughness: 0.35 });
    const casingMat = new THREE.MeshStandardMaterial({ color: entrance ? '#3d3a37' : '#f6f4f0', roughness: 0.4 });
    // pervaz (her iki yüzde)
    const R = this._doorAxis(rects);
    const horiz = R.w >= R.h;
    const top = Math.min(op.height || 210, wallH);
    for (const face of [0, 1]) {
      const fpos = horiz ? (face ? R.y1 + 0.75 : R.y0 - 0.75) : (face ? R.x1 + 0.75 : R.x0 - 0.75);
      const jamb = (t) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(cm(horiz ? 7 : 1.5), cm(top + 3), cm(horiz ? 1.5 : 7)), casingMat);
        m.position.set(cm(horiz ? t : fpos), cm((top + 3) / 2), cm(horiz ? fpos : t));
        m.castShadow = true;
        this.root.add(m);
      };
      const a0 = horiz ? R.x0 : R.y0, a1 = horiz ? R.x1 : R.y1;
      jamb(a0 - 1.5); jamb(a1 + 1.5);
      if (wallH > top + 3) {
        const head = new THREE.Mesh(new THREE.BoxGeometry(cm(horiz ? a1 - a0 + 14 : 1.5), cm(7), cm(horiz ? 1.5 : a1 - a0 + 14)), casingMat);
        head.position.set(cm(horiz ? (a0 + a1) / 2 : fpos), cm(top + 3.5), cm(horiz ? fpos : (a0 + a1) / 2));
        this.root.add(head);
      }
    }
    const pivot = new THREE.Group();
    pivot.position.set(cm(hx - n.x * 2 + c.x * 1), 0, cm(hy - n.y * 2 + c.y * 1));
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(cm(L), cm(dh), cm(4)), leafMat);
    leaf.position.set(cm(L / 2 + 1), cm(dh / 2 + 1), 0);
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    pivot.add(leaf);
    // panel çizgileri
    if (!entrance) {
      for (const sz of [-1, 1]) {
        const groove = new THREE.Mesh(new THREE.BoxGeometry(cm(L - 22), cm(dh * 0.36), cm(0.4)), new THREE.MeshStandardMaterial({ color: '#e7e3dc', roughness: 0.4 }));
        groove.position.set(cm(L / 2 + 1), cm(dh * 0.72), cm(sz * 2.05));
        pivot.add(groove);
        const g2 = groove.clone();
        g2.position.y = cm(dh * 0.28);
        pivot.add(g2);
      }
    }
    // kol (iki yüzde)
    const handleMat = entrance ? M.brass : M.metal;
    for (const sz of [-1, 1]) {
      const rose = new THREE.Mesh(new THREE.CylinderGeometry(cm(2.6), cm(2.6), cm(1), 16), handleMat);
      rose.rotation.x = Math.PI / 2;
      rose.position.set(cm(L - 6), cm(100), cm(sz * 2.5));
      pivot.add(rose);
      const lever = new THREE.Mesh(new THREE.BoxGeometry(cm(13), cm(1.8), cm(1.8)), handleMat);
      lever.position.set(cm(L - 11), cm(100), cm(sz * 5));
      pivot.add(lever);
    }
    this.doorRoot.add(pivot);
    const prev = this.doorState.get(op.id);
    const target = prev ?? (entrance ? 0 : 1);
    const obj = { op, kind: 'hinged', pivot, n, c, target, cur: target, rects, center: { x: (s.ax + s.bx) / 2, y: (s.ay + s.by) / 2 }, label: entrance ? 'Giriş kapısı' : 'Kapı' };
    leaf.userData.door = obj;
    this.doors.push(obj);
  }

  _buildSlider(op, rects, M) {
    const R = this._doorAxis(rects);
    const horiz = R.w >= R.h;
    const L = horiz ? R.w : R.h, T = horiz ? R.h : R.w;
    const a0 = horiz ? R.x0 : R.y0;
    const mid = horiz ? (R.y0 + R.y1) / 2 : (R.x0 + R.x1) / 2;
    const n = op.panels === 3 ? 3 : 2;
    const ov = 5;
    const pl = (L + ov * (n - 1)) / n;
    const top = Math.min(op.height || 230, this.wallH);
    const frameMat = new THREE.MeshStandardMaterial({ color: op.frame === 'beyaz' ? '#f1f1ef' : '#3a3e43', roughness: 0.35, metalness: op.frame === 'beyaz' ? 0.1 : 0.55 });
    const glass = new THREE.MeshPhysicalMaterial({ color: '#e3f0f3', roughness: 0.03, transparent: true, opacity: 0.18, metalness: 0, envMapIntensity: 1.5 });
    const place = (m, along, across, y) => {
      if (horiz) m.position.set(cm(along), cm(y), cm(across)); else m.position.set(cm(across), cm(y), cm(along));
    };
    const bar = (len, hgt, thick, along, across, y, mat, parent) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(cm(horiz ? len : thick), cm(hgt), cm(horiz ? thick : len)), mat);
      place(m, along, across, y);
      m.castShadow = true;
      parent.add(m);
      return m;
    };
    // kasa: üst, alt ray ve yan dikmeler
    bar(L, 6, T, a0 + L / 2, mid, top - 3, frameMat, this.root);
    bar(L, 2, T, a0 + L / 2, mid, 1, frameMat, this.root);
    bar(5, top, T, a0 + 2.5, mid, top / 2, frameMat, this.root);
    bar(5, top, T, a0 + L - 2.5, mid, top / 2, frameMat, this.root);
    const panels = [];
    const ph = top - 8;
    for (let i = 0; i < n; i++) {
      const g = new THREE.Group();
      const across = mid + (i - (n - 1) / 2) * Math.min(3, (T - 4) / n);
      const along = a0 + pl / 2 + i * (pl - ov);
      bar(pl, 5, 3, 0, 0, ph - 2.5 + 2, frameMat, g);
      bar(pl, 6, 3, 0, 0, 5, frameMat, g);
      bar(5, ph, 3, -pl / 2 + 2.5, 0, ph / 2 + 2, frameMat, g);
      bar(5, ph, 3, pl / 2 - 2.5, 0, ph / 2 + 2, frameMat, g);
      const pane = bar(pl - 10, ph - 11, 0.8, 0, 0, ph / 2 + 2.5, glass, g);
      pane.castShadow = false;
      if (i > 0) bar(2, 40, 5, -pl / 2 + 8, 0, 100, frameMat, g); // kulp
      g.userData.base = { along, across };
      place(g, along, across, 0);
      this.doorRoot.add(g);
      panels.push(g);
      g.traverse((o) => { if (o.isMesh) o.userData.door = null; });
    }
    const prev = this.doorState.get(op.id);
    const obj = { op, kind: 'slide', panels, horiz, pl, ov, target: prev ?? 0, cur: prev ?? 0, rects, center: { x: (R.x0 + R.x1) / 2, y: (R.y0 + R.y1) / 2 }, label: 'Sürgülü kapı' };
    for (const g of panels) g.traverse((o) => { if (o.isMesh) o.userData.door = obj; });
    this.doors.push(obj);
  }

  _applyDoors(instant = false, dt = 0) {
    for (const d of this.doors) {
      if (instant) d.cur = d.target;
      else if (d.cur !== d.target) {
        const step = dt * (d.kind === 'slide' ? 1.6 : 2.2);
        d.cur = d.target > d.cur ? Math.min(d.target, d.cur + step) : Math.max(d.target, d.cur - step);
      }
      const e = d.cur * d.cur * (3 - 2 * d.cur); // yumuşak hareket
      if (d.kind === 'hinged') {
        const th = e * HINGE_OPEN;
        const dx = d.c.x * Math.cos(th) + d.n.x * Math.sin(th), dy = d.c.y * Math.cos(th) + d.n.y * Math.sin(th);
        d.pivot.rotation.y = -Math.atan2(dy, dx);
      } else {
        d.panels.forEach((g, i) => {
          const { along, across } = g.userData.base;
          const a = along - i * (d.pl - d.ov) * e;
          if (d.horiz) g.position.set(cm(a), 0, cm(across)); else g.position.set(cm(across), 0, cm(a));
        });
      }
    }
  }

  toggleDoor(d) {
    if (!d) return;
    d.target = d.target > 0.5 ? 0 : 1;
    this.doorState.set(d.op.id, d.target);
    this.onDoorsChange?.();
  }

  setAllDoors(open) {
    for (const d of this.doors) { d.target = open ? 1 : 0; this.doorState.set(d.op.id, d.target); }
    this.onDoorsChange?.();
  }

  doorsOpenCount() {
    return this.doors.filter((d) => d.target > 0.5).length;
  }

  _doorBlocks(x, y) {
    for (const d of this.doors) {
      const closed = d.kind === 'hinged' ? d.cur < 0.45 : d.cur < 0.5;
      if (!closed) continue;
      for (const r of d.rects) if (x > r.x - 3 && x < r.x + r.w + 3 && y > r.y - 3 && y < r.y + r.h + 3) return true;
    }
    return false;
  }

  // ---------------- Dekor ----------------
  _buildDecor(active, walls, M, H) {
    const p = this.project;
    const grid = walls.grid;
    const cellAt = (x, y) => {
      const i = Math.round((x - grid.ox) / 5), j = Math.round((y - grid.oy) / 5);
      if (i < 0 || j < 0 || i >= grid.cols || j >= grid.rows) return 0;
      return grid.data[j * grid.cols + i];
    };
    // Perdeler: pencere ve sürgülü kapıların iç tarafında
    const rectsByOp = new Map();
    for (const r of [...walls.windows, ...walls.doors]) {
      if (!rectsByOp.has(r.op.id)) rectsByOp.set(r.op.id, []);
      rectsByOp.get(r.op.id).push(r);
    }
    const curtainMat = M.linen2.clone();
    curtainMat.side = THREE.DoubleSide;
    const accentCurtain = M.accent[3 % M.accent.length].clone();
    accentCurtain.side = THREE.DoubleSide;
    const rodMat = M.blackMetal;
    for (const op of active) {
      if (op.kind === 'door' && !isSliding(op)) continue;
      let room = p.rooms.find((r) => r.id === op.roomId);
      if (!room) continue;
      let flip = false;
      if (room.type === 'balkon' && isSliding(op)) {
        const nb = neighborRoom(p, op);
        if (!nb) continue;
        room = nb.room;
        flip = true;
      }
      if (!CURTAIN_ROOMS.includes(room.type)) continue;
      const rs = rectsByOp.get(op.id);
      if (!rs) continue;
      const R = this._doorAxis(rs);
      const srcRoom = p.rooms.find((r) => r.id === op.roomId);
      const s = openingSegment(op, srcRoom);
      const nx = flip ? -s.nx : s.nx, ny = flip ? -s.ny : s.ny;
      const horiz = R.w >= R.h;
      // iç yüz
      const face = horiz ? (ny > 0 ? R.y1 : R.y0) : (nx > 0 ? R.x1 : R.x0);
      const off = face + (horiz ? ny : nx) * 12;
      const a = horiz ? R.x0 : R.y0, bb = horiz ? R.x1 : R.y1;
      const topOpen = op.kind === 'door' ? op.height || 230 : (op.sill ?? 90) + (op.height ?? 140);
      const rodY = Math.min(H - 6, topOpen + 16);
      const hgt = rodY - 2;
      const wp = Math.max(35, Math.min(70, (bb - a) * 0.28));
      const mat = room.type === 'cocuk' || room.type === 'yatak' ? accentCurtain : curtainMat;
      for (const end of [0, 1]) {
        const center = end ? bb + 18 - wp / 2 : a - 18 + wp / 2;
        const geo = new THREE.PlaneGeometry(cm(wp), cm(hgt), 24, 1);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin((pos.getX(i) / cm(wp)) * Math.PI * 7) * 0.025);
        geo.computeVertexNormals();
        const m = new THREE.Mesh(geo, mat);
        m.castShadow = true;
        m.receiveShadow = true;
        if (horiz) { m.position.set(cm(center), cm(2 + hgt / 2), cm(off)); }
        else { m.position.set(cm(off), cm(2 + hgt / 2), cm(center)); m.rotation.y = Math.PI / 2; }
        this.root.add(m);
      }
      const rodLen = bb - a + 50;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(cm(1.2), cm(1.2), cm(rodLen), 10), rodMat);
      rod.rotation.z = Math.PI / 2;
      if (horiz) rod.position.set(cm((a + bb) / 2), cm(rodY + 2), cm(off));
      else { rod.position.set(cm(off), cm(rodY + 2), cm((a + bb) / 2)); rod.rotation.set(Math.PI / 2, 0, 0); }
      this.root.add(rod);
    }

    // Tablolar: koltuk, yatak ve büfe arkasındaki duvarda
    const accents = M.accents;
    let seed = 1;
    for (const f of p.furniture) {
      const kind = CATALOG[f.type]?.kind;
      let aw, ah, cy;
      if (kind === 'sofa' || kind === 'sofa_l') { aw = Math.min(120, f.w * 0.5); ah = aw * 0.66; cy = 150; }
      else if (kind === 'bed') { aw = Math.min(100, f.w * 0.6); ah = aw * 0.62; cy = 155; }
      else if (f.type === 'sideboard' || f.type === 'console') { aw = 70; ah = 90; cy = 150; }
      else continue;
      const [fx, fy] = frontDir(f.rot);
      const back = f.d / 2;
      const bx = f.x - fx * back, by = f.y - fy * back;
      if (cellAt(bx - fx * 8, by - fy * 8) !== 2) continue; // arkada duvar yok
      const g = new THREE.Group();
      const frame = new THREE.Mesh(new THREE.BoxGeometry(cm(aw + 5), cm(ah + 5), cm(2.5)), seed % 2 ? M.blackMetal : M.wood);
      frame.castShadow = true;
      g.add(frame);
      const canvasMat = new THREE.MeshStandardMaterial({ map: artTexture(seed + Math.round(f.x) % 7, accents), roughness: 0.85 });
      const pic = new THREE.Mesh(new THREE.PlaneGeometry(cm(aw), cm(ah)), canvasMat);
      pic.position.z = cm(1.3);
      g.add(pic);
      g.position.set(cm(bx + fx * 1.6), cm(cy), cm(by + fy * 1.6));
      g.rotation.y = (-f.rot * Math.PI) / 180;
      this.root.add(g);
      seed++;
    }

    // Sarkıt lambalar: yemek masası ve ada üstünde (tavanla birlikte görünür)
    const shadeMat = new THREE.MeshStandardMaterial({ color: '#1f1f1f', roughness: 0.4, metalness: 0.5, side: THREE.DoubleSide });
    const inner = new THREE.MeshStandardMaterial({ color: '#fff3dc', emissive: '#ffd9a0', emissiveIntensity: 0.9, side: THREE.BackSide });
    const pendant = (x, y, bottom) => {
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, cm(H - bottom - 22), 6), M.blackMetal);
      cord.position.set(cm(x), cm((H + bottom + 22) / 2), cm(y));
      this.ceiling.add(cord);
      const shade = new THREE.Mesh(new THREE.ConeGeometry(cm(20), cm(22), 28, 1, true), shadeMat);
      shade.position.set(cm(x), cm(bottom + 11), cm(y));
      shade.castShadow = true;
      this.ceiling.add(shade);
      const lin = new THREE.Mesh(new THREE.ConeGeometry(cm(19.5), cm(21.5), 28, 1, true), inner);
      lin.position.copy(shade.position);
      this.ceiling.add(lin);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(cm(4), 12, 8), M.bulb);
      bulb.position.set(cm(x), cm(bottom + 4), cm(y));
      this.ceiling.add(bulb);
      const rose = new THREE.Mesh(new THREE.CylinderGeometry(cm(5), cm(5), cm(2), 16), M.blackMetal);
      rose.position.set(cm(x), cm(H - 1), cm(y));
      this.ceiling.add(rose);
    };
    for (const f of p.furniture) {
      if (/^dining_/.test(f.type)) pendant(f.x, f.y, f.h + 78);
      if (f.type === 'k_island') {
        const [fx, fy] = frontDir(f.rot);
        const ax = -fy, ay = fx; // ada boyunca
        for (const sgn of [-1, 1]) pendant(f.x + ax * sgn * f.w * 0.25, f.y + ay * sgn * f.w * 0.25, f.h + 75);
      }
    }
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
      // en büyük mekânın ortasında, boş bir noktada başla
      const sp = (this.spaces?.spaces || []).slice().sort((a, b2) => b2.area - a.area)[0];
      const room = sp?.primary;
      if (room) {
        let px = room.x + room.w / 2, py = room.y + room.h / 2;
        if (!this._walkable(px, py)) {
          outer: for (let rad = 30; rad < Math.max(room.w, room.h); rad += 30) {
            for (let k = 0; k < 12; k++) {
              const qx = px + Math.cos((k / 12) * Math.PI * 2) * rad, qy = py + Math.sin((k / 12) * Math.PI * 2) * rad;
              if (this._walkable(qx, qy)) { px = qx; py = qy; break outer; }
            }
          }
        }
        this.camera.position.set(cm(px), 1.6, cm(py));
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
    if (mode !== 'walk' && this.nearDoor) { this.nearDoor = null; this.onNearDoor?.(null); }
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
      this._applyDoors(false, dt);
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
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    this.controls.dispose();
    this.root.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    this.renderer.dispose();
    this.renderer.forceContextLoss?.();
    this.renderer.domElement.remove();
  }

  // ------------- Dokunma: gezinme ve kapıya dokunma -------------
  _setupInput() {
    const el = this.renderer.domElement;
    const ptrs = new Map();
    el.addEventListener('pointerdown', (e) => {
      const rect = el.getBoundingClientRect();
      const isJoy = this.mode === 'walk' && e.clientX - rect.left < rect.width * 0.45 && e.clientY - rect.top > rect.height * 0.45;
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), joy: isJoy, moved: 0 });
      if (this.mode !== 'walk') return;
      el.setPointerCapture(e.pointerId);
      if (isJoy) this.onJoystick?.({ active: true, x: e.clientX - rect.left, y: e.clientY - rect.top, dx: 0, dy: 0 });
    });
    el.addEventListener('pointermove', (e) => {
      const p = ptrs.get(e.pointerId);
      if (!p) return;
      p.moved = Math.max(p.moved, Math.hypot(e.clientX - p.sx, e.clientY - p.sy));
      if (this.mode !== 'walk') return;
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
      // kısa dokunuş: kapıyı aç/kapat
      if (p && e.type === 'pointerup' && p.moved < 10 && performance.now() - p.t < 450 && !ptrs.size) this._tap(e.clientX, e.clientY, p.joy);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    this._onKeyDown = (e) => { this.walk.keys[e.key.toLowerCase()] = true; };
    this._onKeyUp = (e) => { this.walk.keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  _tap(cx, cy, fromJoy) {
    const el = this.renderer.domElement;
    const rect = el.getBoundingClientRect();
    const ndc = new THREE.Vector2(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const hits = ray.intersectObjects(this.doorRoot ? this.doorRoot.children : [], true);
    const hit = hits.find((h) => h.object.userData.door);
    if (hit) {
      // içeride gezerken çok uzaktaki kapılar dokunuşla açılmaz
      if (this.mode === 'walk' && hit.distance > 6) return;
      this.toggleDoor(hit.object.userData.door);
      return;
    }
    if (!fromJoy) this.onTapEmpty?.();
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
    // yakındaki kapı (önümüzde, 1,8 m içinde)
    let best = null, bd = 180;
    const px = pos.x * 100, py = pos.z * 100;
    for (const d of this.doors) {
      const dx = d.center.x - px, dy = d.center.y - py;
      const dist = Math.hypot(dx, dy);
      if (dist > bd) continue;
      const dot = (dx * fwd.x + dy * fwd.z) / (dist || 1);
      if (dot < 0.35 && dist > 60) continue;
      best = d; bd = dist;
    }
    if (best !== this.nearDoor) { this.nearDoor = best; this.onNearDoor?.(best); }
  }

  // Duvarlardan ve kapalı kapılardan geçmeyi engelle
  _walkable(x, y) {
    const g = this.walls?.grid;
    if (!g) return true;
    const r = 18; // kişi yarıçapı
    for (const [ox, oy] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) {
      const i = Math.round((x + ox - g.ox) / 5), j = Math.round((y + oy - g.oy) / 5);
      if (i < 0 || j < 0 || i >= g.cols || j >= g.rows) return false;
      const v = g.data[j * g.cols + i];
      if (v === 2 || v === 4 || v === 0) return false;
      if (v === 3 && this._doorBlocks(x + ox, y + oy)) return false;
    }
    return true;
  }

  // ------------- Görüntü alma -------------

  // Belirli bir kamera ile yüksek çözünürlüklü JPEG üret (ortam kapatma gölgeleriyle)
  renderShot(camera, width, height, { ceiling = false, wallMode = null, aoRadius = 0.3 } = {}) {
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
    let done = false;
    if (this.ao) {
      try {
        const rt = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: 4 });
        const composer = new EffectComposer(this.renderer, rt);
        composer.setPixelRatio(1);
        composer.setSize(width, height);
        composer.addPass(new RenderPass(this.scene, camera));
        const ao = new AOPass(this.scene, camera, width, height);
        ao.updateGtaoMaterial({ radius: aoRadius, distanceExponent: 1.5, thickness: 1.5, scale: 1.1, samples: 16 });
        ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
        ao.blendIntensity = 0.85;
        composer.addPass(ao);
        composer.addPass(new OutputPass());
        composer.render();
        ao.dispose();
        composer.dispose();
        rt.dispose();
        done = true;
      } catch (e) {
        console.warn('AO kapatıldı', e);
        this.ao = false;
      }
    }
    if (!done) this.renderer.render(this.scene, camera);
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

  // Sunum görüntüleri için kapıları geçici olarak aç
  _withDoorsForShot(fn) {
    const saved = this.doors.map((d) => [d, d.cur, d.target]);
    for (const d of this.doors) if (d.kind === 'hinged') d.target = 1;
    this._applyDoors(true);
    try { return fn(); } finally {
      for (const [d, cur, target] of saved) { d.cur = cur; d.target = target; }
      this._applyDoors(true);
    }
  }

  captureCurrent(width = 1920, height = 1080) {
    const cam = this.camera.clone();
    return this.renderShot(cam, width, height, { ceiling: this.mode === 'walk', aoRadius: this.mode === 'walk' ? 0.3 : 0.6 });
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
    return this._withDoorsForShot(() => this.renderShot(cam, width, height, { ceiling: false, wallMode: 'full', aoRadius: 0.6 }));
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
    return this._withDoorsForShot(() => this.renderShot(cam, width, height, { ceiling: false, wallMode: 'full', aoRadius: 0.5 }));
  }

  // Mekân içi görüntü: mekânın içinden, en çok mobilya gören ve önü açık noktadan bakış.
  // target: oda ya da mekân (birleşik odalar tek görüntüde)
  captureRoom(target, width, height) {
    const p = this.project;
    const sp = target.rects ? target : computeSpaces(p).byRoom.get(target.id);
    const rooms = sp.rooms;
    const ids = new Set(rooms.map((r) => r.id));
    const rects = sp.rects;
    const H = p.wallHeight || 270;
    const items = p.furniture.filter((f) => ids.has(f.roomId));
    const eye = Math.min(150, H - 50);
    const small = sp.area < 8;
    const fovV = small ? 72 : 62;
    const fovH = (2 * Math.atan(Math.tan((fovV * Math.PI) / 360) * (width / height)) * 180) / Math.PI;
    const inSpace = (x, y) => rects.some((q) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1);
    // göz hizasını kesen engeller
    const obst = items.filter((f) => {
      const c = CATALOG[f.type] || {};
      const top = (c.elev || f.elev || 0) + f.h;
      const bottom = c.elev || f.elev || 0;
      return top > eye - 20 && bottom < eye + 20;
    }).map((f) => footprint(f));
    // açık kapı kanatlarının taradığı alan da engel sayılır
    const active = activeOpenings(p);
    for (const room of rooms) {
      const R = { x0: room.x, y0: room.y, x1: room.x + room.w, y1: room.y + room.h };
      for (const o of openingsForRoom(p, room, active)) {
        if (o.op.kind !== 'door' || !o.swingIn) continue;
        const a = (o.side === 'n' || o.side === 's' ? room.x : room.y) + o.offset, b2 = a + o.width, d = o.width;
        if (o.side === 'n') obst.push({ x0: a, x1: b2, y0: R.y0, y1: R.y0 + d });
        if (o.side === 's') obst.push({ x0: a, x1: b2, y0: R.y1 - d, y1: R.y1 });
        if (o.side === 'w') obst.push({ x0: R.x0, x1: R.x0 + d, y0: a, y1: b2 });
        if (o.side === 'e') obst.push({ x0: R.x1 - d, x1: R.x1, y0: a, y1: b2 });
      }
    }
    const ray = (x, y, a) => {
      const dx = Math.cos(a), dy = Math.sin(a);
      for (let t = 0; t < 2500; t += 5) {
        const px = x + dx * t, py = y + dy * t;
        if (!inSpace(px, py)) return t;
        for (const o of obst) if (px > o.x0 && px < o.x1 && py > o.y0 && py < o.y1) return t;
      }
      return 2500;
    };
    let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
    for (const q of rects) { bx0 = Math.min(bx0, q.x0); by0 = Math.min(by0, q.y0); bx1 = Math.max(bx1, q.x1); by1 = Math.max(by1, q.y1); }
    const diag = Math.hypot(bx1 - bx0, by1 - by0);
    // bakılacak merkez: mobilyaların ağırlık merkezi (yoksa mekân ortası)
    let gx = 0, gy = 0, gw = 0;
    for (const f of items) { const w = f.w * f.d; gx += f.x * w; gy += f.y * w; gw += w; }
    const cx = gw ? gx / gw : (bx0 + bx1) / 2, cy = gw ? gy / gw : (by0 + by1) / 2;
    const cands = [];
    const ins = small ? 20 : 35;
    const spots = [];
    for (const room of rooms) {
      const R = { x0: room.x, y0: room.y, x1: room.x + room.w, y1: room.y + room.h };
      const rx = room.x + room.w / 2, ry = room.y + room.h / 2;
      spots.push([R.x0 + ins, R.y0 + ins], [R.x1 - ins, R.y0 + ins], [R.x0 + ins, R.y1 - ins], [R.x1 - ins, R.y1 - ins],
        [rx, R.y0 + ins], [rx, R.y1 - ins], [R.x0 + ins, ry], [R.x1 - ins, ry]);
    }
    for (const [px, py] of spots) {
      if (!inSpace(px, py)) continue;
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
    // Tavan lambaları: her odada gölgeli nokta ışık
    const lamps = [];
    for (const room of rooms) {
      if (room.type === 'balkon') continue;
      const lamp = new THREE.PointLight('#ffe7c4', 1, 0, 2);
      lamp.power = (this.lampPower ?? 110) * Math.max(1, (room.w * room.h) / 150000);
      lamp.position.set(cm(room.x + room.w / 2), cm(H - 35), cm(room.y + room.h / 2));
      lamp.castShadow = lamps.length < 2;
      lamp.shadow.mapSize.set(1024, 1024);
      lamp.shadow.bias = -0.002;
      lamp.shadow.radius = 4;
      this.scene.add(lamp);
      lamps.push(lamp);
    }
    const prevSun = this.sun.intensity;
    this.sun.intensity = prevSun * 0.35;
    this.ceiling.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    const url = this._withDoorsForShot(() => this.renderShot(cam, width, height, { ceiling: true, wallMode: 'full', aoRadius: 0.3 }));
    this.ceiling.traverse((o) => { if (o.isMesh) o.castShadow = false; });
    this.sun.intensity = prevSun;
    for (const l of lamps) { this.scene.remove(l); l.dispose(); }
    return url;
  }
}

function cut(ivs, a, b) {
  const n = [];
  for (const [x, y] of ivs) {
    if (b <= x || a >= y) { n.push([x, y]); continue; }
    if (a > x) n.push([x, a]);
    if (b < y) n.push([b, y]);
  }
  return n;
}
