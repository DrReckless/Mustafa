import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { TILE, MAP_W, MAP_H, DX, DY, BUILDINGS, UNITS, RECIPES } from '../config.js';
import { getModel, itemModels, materials } from './models.js';
import { Pool, FramePool } from './pool.js';
import { Terrain } from './terrain.js';
import { Effects } from './effects.js';
import { clamp, lerp } from '../util.js';

const FACTION_COL = { 0: new THREE.Color(0x3a74c4), 1: new THREE.Color(0xb3352a), 2: new THREE.Color(0xc96f1c) };
const MUZZLE = {
  hq: { py: 3.6, f: 0.6, u: 0 }, turret_mg: { py: 0.75, f: 1.4, u: 0.3 }, turret_cannon: { py: 0.95, f: 2.4, u: 0.35 }, turret_laser: { py: 1.25, f: 0.95, u: 0 },
  mech: { py: 0.95, f: 0.75, u: 0.3 }, tank: { py: 0.72, f: 1.45, u: 0.18 }, drone: { py: 0, f: 0.35, u: -0.05 },
  raider: { py: 0.85, f: 0.35, u: 0 }, brute: { py: 0.95, f: 1.9, u: 0.22 }, wasp: { py: 0, f: 0.4, u: -0.05 },
};
const CHIMNEY = {
  smelter: [[-0.45, 3.95, -0.38]], foundry: [[-0.15, 3.65, 0]], generator: [[0.55, 2.2, 0.55]],
  factory: [[-1.6, 4.2, -1.2], [-1.6, 4.2, 1.2]],
};
const AIR_H = 2.8;

const _m = new THREE.Matrix4(), _m2 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

export class View {
  constructor(canvas, quality) {
    this.quality = quality;
    const r = new THREE.WebGLRenderer({ canvas, antialias: quality !== 'low', powerPreference: 'high-performance', stencil: false });
    const dpr = window.devicePixelRatio || 1;
    r.setPixelRatio(quality === 'high' ? Math.min(dpr, 2) : quality === 'medium' ? Math.min(dpr, 1.5) : Math.min(dpr, 1));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.9;
    r.shadowMap.enabled = quality !== 'low';
    r.shadowMap.type = quality === 'high' ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
    this.renderer = r;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.5, 900);
    this.cam = { tx: 30, tz: 56, dist: 44, yaw: 0, pitch: 0.92, vx: 0, vz: 0 };
    this.time = 0;
    this.setupLights();
    if (quality === 'high') this.setupPost();
    this.bviews = new Map();
    this.uviews = new Map();
    this.pools = new Map();
    this.ghostPools = new Map();
    this.items = null;
    this.ghosts = [];
    this.selected = null;
    this.chimneyT = 0;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  // --------- kurulum ---------
  setupLights() {
    const s = this.scene;
    this.sky = new Sky();
    this.sky.scale.setScalar(800);
    const u = this.sky.material.uniforms;
    u.turbidity.value = 5; u.rayleigh.value = 1.4; u.mieCoefficient.value = 0.004; u.mieDirectionalG.value = 0.82;
    s.add(this.sky);
    // ortam haritası: kontrollü gradyan gökyüzü (Sky gölgelendiricisi çok parlak)
    this.envScene = new THREE.Scene();
    this.envU = {
      top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, bot: { value: new THREE.Color() },
      sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color() },
    };
    const envMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, uniforms: this.envU, depthWrite: false,
      vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform vec3 top, hor, bot, sunCol; uniform vec3 sunDir; varying vec3 vDir;
        void main(){ vec3 d = normalize(vDir); float y = d.y;
          vec3 c = y > 0.0 ? mix(hor, top, pow(y, 0.55)) : mix(hor, bot, pow(-y, 0.35));
          float s = max(dot(d, sunDir), 0.0);
          c += sunCol * (pow(s, 48.0) * 3.0 + pow(s, 5.0) * 0.35);
          gl_FragColor = vec4(c, 1.0); }`,
    });
    this.envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), envMat));
    this.pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envRT = null; this.envTimer = 0; this.lastEnvSun = -9;

    this.sun = new THREE.DirectionalLight(0xffffff, 3);
    this.sun.castShadow = this.quality !== 'low';
    const ms = this.quality === 'high' ? 4096 : 2048;
    this.sun.shadow.mapSize.set(ms, ms);
    this.sun.shadow.bias = -0.0004; this.sun.shadow.normalBias = 0.04;
    this.sun.shadow.camera.near = 1; this.sun.shadow.camera.far = 300;
    s.add(this.sun, this.sun.target);
    this.hemi = new THREE.HemisphereLight(0xbcd6ff, 0x4a3f2a, 0.5);
    s.add(this.hemi);
    s.fog = new THREE.FogExp2(0xb9c7d3, 0.0042);

    // yıldızlar
    const sg = new THREE.BufferGeometry();
    const sp = [];
    for (let i = 0; i < 1500; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random() * 0.9 + 0.1);
      sp.push(Math.sin(ph) * Math.cos(th) * 600, Math.cos(ph) * 600, Math.sin(ph) * Math.sin(th) * 600);
    }
    sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
    s.add(this.stars);
  }
  setupPost() {
    const r = this.renderer;
    const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(r, rt);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.5, 0.45, 0.92);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
  }
  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.composer) {
      this.composer.setPixelRatio(this.renderer.getPixelRatio());
      this.composer.setSize(w, h);
      this.bloom.resolution.set(w / 2, h / 2);
    }
  }

  attach(game) {
    this.game = game;
    if (this.terrain) this.disposeWorld();
    this.terrain = new Terrain(this.scene, game.world, this.quality);
    this.fx = new Effects(this.scene, this.quality);
    const im = itemModels();
    this.items = {};
    for (const [k, v] of Object.entries(im)) this.items[k] = new FramePool(this.scene, v.geo, v.mat, { cast: this.quality === 'high', cap: 32 });
    // sağlık çubukları
    const bg = new THREE.PlaneGeometry(1, 0.14);
    const fg = new THREE.PlaneGeometry(1, 0.1); fg.translate(0.5, 0, 0);
    this.hpBg = new FramePool(this.scene, bg, new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.7, depthWrite: false, toneMapped: false }), { order: 20, cast: false, receive: false });
    this.hpFg = new FramePool(this.scene, fg, new THREE.MeshBasicMaterial({ color: 0xffffff, depthWrite: false, toneMapped: false, transparent: true }), { color: true, order: 21, cast: false, receive: false });
    this.hpBg.mesh.material.depthTest = false; this.hpFg.mesh.material.depthTest = false;
    // seçim halkası
    this.selRing = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.0, 48).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x7fd4ff, transparent: true, opacity: 0.85, toneMapped: false, depthWrite: false }));
    this.selRing.visible = false; this.selRing.renderOrder = 5;
    this.rangeRing = new THREE.Mesh(new THREE.RingGeometry(0.97, 1.0, 96).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xffd27f, transparent: true, opacity: 0.5, toneMapped: false, depthWrite: false }));
    this.rangeRing.visible = false;
    this.scene.add(this.selRing, this.rangeRing);
    // yön oku
    const ag = new THREE.ConeGeometry(0.35, 0.8, 3); ag.rotateZ(-Math.PI / 2); ag.scale(1, 0.25, 1);
    this.arrows = new FramePool(this.scene, ag, new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, opacity: 0.9, depthWrite: false }), { color: true, cast: false, receive: false, order: 6 });
    this.ghostMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42, depthWrite: false, toneMapped: false });

    game.on('add', (b) => this.addBuilding(b));
    game.on('remove', (b, destroyed) => this.removeBuilding(b, destroyed));
    game.on('update', (b) => this.refreshBuilding(b));
    game.on('unitAdd', (u) => this.addUnit(u));
    game.on('unitDie', (u) => { this.removeUnit(u); const w = this.toWorld(u.x, u.y); this.fx.explosion(w.x, w.z, u.type === 'brute' || u.type === 'tank' ? 1.3 : 0.8); this.onBoom?.(w.x, w.z, 0.8); });
    game.on('treeRemoved', (x, y) => this.terrain.clearTile(x, y));
    game.on('explode', (x, y, s) => { const w = this.toWorld(x, y); this.fx.explosion(w.x, w.z, s); this.onBoom?.(w.x, w.z, s); });
    game.on('shot', (src, x, y, tx, ty, kind, target) => this.onShot(src, kind, target));
    for (const b of game.buildings.values()) this.addBuilding(b);
    for (const u of game.units) this.addUnit(u);
  }
  disposeWorld() {
    // basit yaklaşım: sahneyi temizle ve ışıkları yeniden kur
    for (const p of this.pools.values()) p.dispose();
    this.pools.clear(); this.bviews.clear(); this.uviews.clear(); this.ghostPools.clear();
    while (this.scene.children.length) this.scene.remove(this.scene.children[0]);
    this.setupLights();
    if (this.composer) { this.composer.passes[0].scene = this.scene; }
  }

  toWorld(x, y) { return { x: x * TILE, z: y * TILE }; }

  // --------- binalar ---------
  pool(type, pi, part, ghost = false) {
    const key = type + '|' + pi + (ghost ? '|g' : '');
    const map = ghost ? this.ghostPools : this.pools;
    let p = map.get(key);
    if (!p) {
      if (ghost) p = new FramePool(this.scene, part.geo, this.ghostMat, { color: true, cast: false, receive: false, order: 4 });
      else p = new Pool(this.scene, part.geo, part.mat, { color: part.inst, cast: !part.glow && this.quality !== 'low', receive: true, cap: type === 'belt' ? 64 : 8 });
      map.set(key, p);
    }
    return p;
  }
  addBuilding(b) {
    const parts = getModel(b.type);
    const v = { b, slots: [], dyn: false, ang: Math.random() * 6, status: [] };
    parts.forEach((part, pi) => {
      const pool = this.pool(b.type, pi, part);
      const slot = pool.alloc();
      const s = { slot, part, pool };
      v.slots.push(s);
      if (!['static', 'belt', 'window', 'status', 'furnace', 'beacon'].includes(part.anim)) v.dyn = true;
      if (part.inst) {
        if (part.mat === materials().accent) { const c = FACTION_COL[b.faction] || FACTION_COL[1]; pool.color(slot, c.r, c.g, c.b); }
        else v.status.push(s);
      }
    });
    const cx = (b.x + b.size / 2) * TILE, cz = (b.y + b.size / 2) * TILE;
    v.cx = cx; v.cz = cz;
    v.grow = this.game.time - b.born < 1 ? 0 : 1;
    this.bviews.set(b.id, v);
    for (let j = 0; j < b.size; j++) for (let i = 0; i < b.size; i++) this.terrain.clearTile(b.x + i, b.y + j);
    this.placeStatic(v);
    if (v.grow < 1) this.fx.dust(cx, cz, b.size);
  }
  refreshBuilding(b) { const v = this.bviews.get(b.id); if (v) this.placeStatic(v); }
  baseMatrix(v, out) {
    const g = v.grow < 1 ? easeOutBack(v.grow) : 1;
    _q.setFromAxisAngle(_up, -v.b.dir * Math.PI / 2);
    _v.set(v.cx, 0, v.cz); _s.set(1, Math.max(0.02, g), 1);
    return out.compose(_v, _q, _s);
  }
  placeStatic(v) {
    this.baseMatrix(v, _m);
    for (const s of v.slots) {
      if (s.part.anim === 'yaw' || s.part.anim === 'yawStatus') this.yawMatrix(v, s.part, _m2);
      else _m2.copy(_m);
      s.pool.set(s.slot, _m2);
    }
  }
  yawMatrix(v, part, out) {
    const g = v.grow < 1 ? easeOutBack(v.grow) : 1;
    _q.setFromAxisAngle(_up, v.b.yaw);
    _v.set(v.cx + part.pivot.x, part.pivot.y * g, v.cz + part.pivot.z); _s.set(1, Math.max(0.02, g), 1);
    return out.compose(_v, _q, _s);
  }
  removeBuilding(b, destroyed) {
    const v = this.bviews.get(b.id);
    if (!v) return;
    for (const s of v.slots) s.pool.free(s.slot);
    this.bviews.delete(b.id);
    if (this.selected && this.selected.b === b) this.select(null);
    if (!destroyed) this.fx.dust(v.cx, v.cz, b.size * 0.8);
  }
  updateBuildings(dt) {
    const t = this.time;
    const night = this.nightF;
    const pr = this.game.power.ratio;
    const blink = Math.sin(t * 6) > 0;
    for (const v of this.bviews.values()) {
      const b = v.b;
      if (v.grow < 1) {
        v.grow = Math.min(1, v.grow + dt * 1.6);
        this.placeStatic(v);
      }
      if (b.working) v.ang += dt * (b.type === 'generator' ? 14 : 4) * Math.max(0.2, pr);
      if (v.dyn) {
        this.baseMatrix(v, _m);
        for (const s of v.slots) {
          const a = s.part.anim;
          if (a === 'static' || a === 'belt' || a === 'window' || a === 'status' || a === 'furnace' || a === 'beacon') continue;
          if (a === 'yaw' || a === 'yawStatus') { this.yawMatrix(v, s.part, _m2); s.pool.set(s.slot, _m2); continue; }
          let ang = 0;
          if (a === 'drill') ang = v.ang * 1.5;
          else if (a === 'arm') ang = Math.sin(v.ang * 0.8) * 1.4;
          else if (a === 'fan') ang = v.ang;
          else if (a === 'spin') ang = t * 0.8;
          _q.setFromAxisAngle(_up, ang);
          _m2.compose(s.part.pivot || _v.set(0, 0, 0), _q, _s.set(1, 1, 1));
          s.pool.set(s.slot, _m2.premultiply(_m));
        }
      }
      // durum ışıkları
      for (const s of v.status) {
        const a = s.part.anim;
        if (a === 'furnace') {
          const k = b.working ? 1.6 + Math.sin(t * 13 + b.id) * 0.25 + Math.sin(t * 7.3) * 0.2 : 0.12;
          s.pool.color(s.slot, 3.0 * k, 1.05 * k, 0.25 * k);
        } else if (a === 'beacon') {
          const on = Math.sin(t * 3 + b.id) > 0.6;
          s.pool.color(s.slot, on ? 6 : 0.3, on ? 0.4 : 0.05, on ? 0.3 : 0.05);
        } else if (b.faction !== 0) {
          s.pool.color(s.slot, 3.5, 0.3, 0.2);
        } else if (b.type.startsWith('turret')) {
          if (b.noAmmo) s.pool.color(s.slot, blink ? 4 : 0.2, blink ? 1.8 : 0.1, 0);
          else if (b.target) s.pool.color(s.slot, 4, 0.3, 0.2);
          else s.pool.color(s.slot, 0.3, 2.6, 0.5);
        } else if (b.type === 'splitter') {
          s.pool.color(s.slot, 0.3, 1.6, 2.6);
        } else {
          if (b.working && pr < 0.6) s.pool.color(s.slot, blink ? 4 : 0.3, 0.2, 0.1);
          else if (b.working) s.pool.color(s.slot, 0.3, 3.0, 0.6);
          else s.pool.color(s.slot, 2.8, 1.6, 0.1);
        }
      }
      // baca dumanı
      if (b.working && CHIMNEY[b.type] && Math.random() < dt * (b.type === 'generator' ? 6 : 3.5)) {
        for (const [lx, ly, lz] of CHIMNEY[b.type]) {
          const c = Math.cos(-b.dir * Math.PI / 2), sn = Math.sin(-b.dir * Math.PI / 2);
          const wx = v.cx + lx * c + lz * sn, wz = v.cz - lx * sn + lz * c;
          this.fx.chimney(wx, ly, wz, b.type === 'generator');
        }
      }
    }
    void night;
  }

  // --------- birimler ---------
  addUnit(u) {
    const parts = getModel(u.type);
    const v = { u, slots: [], walk: Math.random() * 6 };
    parts.forEach((part, pi) => {
      const pool = this.pool(u.type, pi, part);
      const slot = pool.alloc();
      if (part.inst) { const c = FACTION_COL[u.faction] || FACTION_COL[1]; pool.color(slot, c.r, c.g, c.b); }
      v.slots.push({ slot, part, pool });
    });
    this.uviews.set(u.id, v);
    if (this.game.time - u.born < 0.5) { const w = this.toWorld(u.x, u.y); this.fx.dust(w.x, w.z, 0.6); }
  }
  removeUnit(u) {
    const v = this.uviews.get(u.id);
    if (!v) return;
    for (const s of v.slots) s.pool.free(s.slot);
    this.uviews.delete(u.id);
    if (this.selected && this.selected.u === u) this.select(null);
  }
  unitY(u, v) {
    if (u.air) return AIR_H + Math.sin(this.time * 2 + u.id) * 0.15;
    if (u.type === 'mech' && u.moving) return Math.abs(Math.sin(v.walk)) * 0.08;
    return 0;
  }
  updateUnits(dt) {
    for (const v of this.uviews.values()) {
      const u = v.u;
      if (u.moving) v.walk += dt * 9;
      const wx = u.x * TILE, wz = u.y * TILE, wy = this.unitY(u, v);
      for (const s of v.slots) {
        const a = s.part.anim;
        const P = s.part.pivot || _v.set(0, 0, 0);
        if (a === 'gun') {
          _q.setFromAxisAngle(_up, u.yaw);
          _m.compose(_s.set(wx, wy, wz), _q, _v.set(1, 1, 1));
          _q.setFromAxisAngle(_up, u.tyaw - u.yaw);
          _m2.compose(s.part.pivot, _q, _s.set(1, 1, 1));
          _m.multiply(_m2);
        } else if (a.startsWith('rotor')) {
          _q.setFromAxisAngle(_up, u.yaw);
          _m.compose(_s.set(wx, wy, wz), _q, _v.set(1, 1, 1));
          _q.setFromAxisAngle(_up, this.time * 40 + u.id);
          _m2.compose(s.part.pivot, _q, _s.set(1, 1, 1));
          _m.multiply(_m2);
        } else {
          // gövde/bacak/statik
          let tilt = 0;
          if (a === 'legs' && u.moving) tilt = Math.sin(v.walk) * 0.15;
          _q.setFromAxisAngle(_up, u.yaw);
          if (tilt) _q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), tilt));
          _m.compose(_s.set(wx, a === 'legs' ? 0 : wy, wz), _q, _v.set(1, 1, 1));
          void P;
        }
        s.pool.set(s.slot, _m);
      }
      // toz izi
      if (u.moving && !u.air && Math.random() < dt * (u.type === 'raider' ? 10 : 5)) this.fx.trail(wx - Math.cos(u.yaw) * 0.8, 0.2, wz + Math.sin(u.yaw) * 0.8);
    }
  }

  // --------- atış efektleri ---------
  muzzlePos(src) {
    const mz = MUZZLE[src.type];
    if (!mz) return null;
    if (src.kind === 'unit') {
      const v = this.uviews.get(src.id);
      const y = (v ? this.unitY(src, v) : 0) + mz.py + mz.u;
      return new THREE.Vector3(src.x * TILE + Math.cos(src.tyaw) * mz.f, y, src.y * TILE - Math.sin(src.tyaw) * mz.f);
    }
    const cx = (src.x + src.size / 2) * TILE, cz = (src.y + src.size / 2) * TILE;
    return new THREE.Vector3(cx + Math.cos(src.yaw) * mz.f, mz.py + mz.u, cz - Math.sin(src.yaw) * mz.f);
  }
  targetWorld(t) {
    if (t.kind === 'unit') return new THREE.Vector3(t.x * TILE, t.air ? AIR_H : 0.6, t.y * TILE);
    return new THREE.Vector3((t.x + t.size / 2) * TILE + (Math.random() - 0.5), 0.8 + Math.random() * 0.6 * t.size, (t.y + t.size / 2) * TILE + (Math.random() - 0.5));
  }
  onShot(src, kind, target) {
    const a = this.muzzlePos(src);
    if (!a) return;
    // görüş alanı dışında efekt üretme
    const dx = a.x - this.cam.tx, dz = a.z - this.cam.tz;
    const far = dx * dx + dz * dz > (this.cam.dist * 2.2) ** 2;
    this.onSound?.(kind, a.x, a.z, far);
    if (far) return;
    const b = this.targetWorld(target);
    const k = kind === 'laser' && src.faction !== 0 ? 'elaser' : kind;
    if (kind !== 'shell') {
      this.fx.tracer(a, b, k);
      if (kind === 'bullet') this.fx.fire.emit(b.x, b.y, b.z, 0, 0.5, 0, 0.08, 0.3, 2, 3, 2.2, 1, 0.8);
      else this.fx.fire.emit(b.x, b.y, b.z, 0, 0.3, 0, 0.15, 0.6, 2, k === 'elaser' ? 3 : 0.5, k === 'elaser' ? 0.4 : 2.5, k === 'elaser' ? 0.3 : 3, 1);
    }
    this.fx.muzzle(a, kind);
    if (Math.random() < (kind === 'bullet' ? 0.25 : 1)) this.fx.flash(a.x, a.y + 0.3, a.z, kind === 'shell' ? 25 : 8, kind.includes('laser') ? 0x60f0ff : 0xffb050, 0.07);
  }

  // --------- konveyör eşyaları ---------
  updateItems() {
    for (const p of Object.values(this.items)) p.begin();
    for (const v of this.bviews.values()) {
      const b = v.b;
      if (b.type !== 'belt' || !b.items.length) continue;
      const g = v.grow < 1 ? v.grow : 1;
      for (let k = 0; k < b.items.length; k++) {
        const it = b.items[k];
        const s = it.s;
        let x, z;
        if (it.p < 0.5) {
          const f = it.p * 2;
          x = lerp(DX[s] * 0.5, 0, f); z = lerp(DY[s] * 0.5, 0, f);
        } else {
          const f = (it.p - 0.5) * 2;
          x = DX[b.dir] * 0.5 * f; z = DY[b.dir] * 0.5 * f;
        }
        _q.setFromAxisAngle(_up, -b.dir * Math.PI / 2 + ((b.id * 7 + k * 3) % 5) * 0.3);
        _v.set(v.cx + x * TILE, 0.43 * g, v.cz + z * TILE);
        _m.compose(_v, _q, _s.set(1, 1, 1));
        this.items[it.t].push(_m);
      }
    }
    for (const p of Object.values(this.items)) p.end();
  }

  // --------- sağlık çubukları ---------
  updateHp() {
    this.hpBg.begin(); this.hpFg.begin();
    const cq = this.camera.quaternion;
    const add = (x, y, z, w, ratio) => {
      _m.compose(_v.set(x, y, z), cq, _s.set(w, 1, 1));
      this.hpBg.push(_m);
      _v.set(-w / 2, 0, 0.01).applyQuaternion(cq).add(_s.set(x, y, z));
      _m.compose(_v, cq, _s.set(w * Math.max(0, ratio), 1, 1));
      const r = ratio > 0.5 ? (1 - ratio) * 2 : 1, gg = ratio > 0.5 ? 1 : ratio * 2;
      this.hpFg.push(_m, r * 1.2, gg * 1.1, 0.15);
    };
    for (const v of this.bviews.values()) {
      const b = v.b;
      if (b.hp >= b.maxHp) continue;
      add(v.cx, (b.type === 'hq' ? 4.6 : b.type === 'wall' ? 2.2 : 2.8), v.cz, b.size * 1.4, b.hp / b.maxHp);
    }
    for (const v of this.uviews.values()) {
      const u = v.u;
      if (u.hp >= u.maxHp) continue;
      add(u.x * TILE, this.unitY(u, v) + 2.0, u.y * TILE, 1.2, u.hp / u.maxHp);
    }
    this.hpBg.end(); this.hpFg.end();
  }

  // --------- hayalet önizleme ---------
  updateGhosts() {
    for (const p of this.ghostPools.values()) p.begin();
    this.arrows.begin();
    for (const g of this.ghosts) {
      const parts = getModel(g.type);
      const size = BUILDINGS[g.type].size;
      const cx = (g.x + size / 2) * TILE, cz = (g.y + size / 2) * TILE;
      _q.setFromAxisAngle(_up, -g.dir * Math.PI / 2);
      _m.compose(_v.set(cx, 0.02, cz), _q, _s.set(1, 1, 1));
      const [r, gg, bb] = g.ok ? [0.3, 1.6, 0.6] : [1.8, 0.25, 0.2];
      parts.forEach((part, pi) => {
        const p = this.pool(g.type, pi, part, true);
        if (part.pivot && (part.anim === 'yaw' || part.anim === 'yawStatus')) {
          _m2.compose(_v.set(cx + part.pivot.x, part.pivot.y, cz + part.pivot.z), _q, _s.set(1, 1, 1));
          p.push(_m2, r, gg, bb);
        } else if (part.pivot) {
          _m2.makeTranslation(part.pivot.x, part.pivot.y, part.pivot.z).premultiply(_m);
          p.push(_m2, r, gg, bb);
        } else p.push(_m, r, gg, bb);
      });
      if (this.showsDir(g.type)) this.pushArrow(cx, cz, g.dir, size, g.ok);
    }
    // seçili binanın yönü
    const sb = this.selected?.b;
    if (sb && this.showsDir(sb.type) && sb.faction === 0) {
      this.pushArrow((sb.x + sb.size / 2) * TILE, (sb.y + sb.size / 2) * TILE, sb.dir, sb.size, true);
    }
    for (const p of this.ghostPools.values()) p.end();
    this.arrows.end();
  }
  showsDir(type) { return ['belt', 'miner', 'smelter', 'assembler', 'foundry', 'factory'].includes(type); }
  pushArrow(cx, cz, dir, size, ok) {
    _q.setFromAxisAngle(_up, -dir * Math.PI / 2);
    const off = size * TILE * 0.5 + 0.5;
    _m.compose(_v.set(cx + DX[dir] * off, 0.35, cz + DY[dir] * off), _q, _s.set(1, 1, 1));
    const pulse = 1.5 + Math.sin(this.time * 6) * 0.6;
    this.arrows.push(_m, ok ? 0.3 * pulse : pulse, ok ? 1.4 * pulse : 0.2, ok ? 2 * pulse : 0.2);
  }

  select(sel) {
    this.selected = sel;
  }
  updateSelection() {
    const s = this.selected;
    if (!s) { this.selRing.visible = false; this.rangeRing.visible = false; return; }
    let x, z, r, range = 0;
    if (s.b) {
      const b = s.b;
      x = (b.x + b.size / 2) * TILE; z = (b.y + b.size / 2) * TILE; r = b.size * 1.05;
      range = BUILDINGS[b.type].range || 0;
    } else if (s.u) {
      x = s.u.x * TILE; z = s.u.y * TILE; r = 0.9; range = UNITS[s.u.type].range;
    }
    this.selRing.visible = true;
    this.selRing.position.set(x, 0.08, z);
    const p = 1 + Math.sin(this.time * 4) * 0.04;
    this.selRing.scale.setScalar(r * p);
    this.rangeRing.visible = range > 0;
    if (range) { this.rangeRing.position.set(x, 0.07, z); this.rangeRing.scale.setScalar(range * TILE); }
  }

  // --------- gün/gece ---------
  updateSky(dt) {
    const g = this.game;
    const s = g.sunLevel();
    const ph = g.dayPhase();
    const dayFrac = ph < 0.65 ? ph / 0.65 : (ph - 0.65) / 0.35;
    const az = ph < 0.65 ? Math.PI * (1 - dayFrac) : Math.PI * (1 - dayFrac);
    const el = Math.max(-0.35, s) * 1.15;
    const sunDir = new THREE.Vector3(Math.cos(az) * Math.cos(el), Math.sin(el), 0.45 + Math.sin(az) * 0.3).normalize();
    this.sky.material.uniforms.sunPosition.value.copy(sunDir);
    const day = clamp(s * 4, 0, 1);
    const night = clamp(-s * 4, 0, 1);
    this.nightF = clamp(1 - s * 3.5, 0, 1);
    const tgt = new THREE.Vector3(this.cam.tx, 0, this.cam.tz);
    // güneş ya da ay
    let ldir;
    if (s > -0.02) {
      ldir = sunDir.clone(); if (ldir.y < 0.08) ldir.y = 0.08;
      const warm = new THREE.Color(0xff9a50).lerp(new THREE.Color(0xfff2e2), clamp(s * 2.2, 0, 1));
      this.sun.color.copy(warm);
      this.sun.intensity = 0.25 + 3.2 * day;
    } else {
      ldir = new THREE.Vector3(-0.35, 0.85, 0.4).normalize();
      this.sun.color.set(0x8aa4ff);
      this.sun.intensity = 0.7 * night + 0.35;
    }
    this.sun.position.copy(tgt).addScaledVector(ldir, 120);
    this.sun.target.position.copy(tgt);
    const sc = this.sun.shadow.camera, half = clamp(this.cam.dist * 1.05, 26, 80);
    if (sc.right !== half) { sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half; sc.updateProjectionMatrix(); }
    this.hemi.color.set(0x3a4c80).lerp(new THREE.Color(0xbcd6ff), day);
    this.hemi.groundColor.set(0x1c1a16).lerp(new THREE.Color(0x4a3f2a), day);
    this.hemi.intensity = 0.7 - 0.0 * day;
    const fog = new THREE.Color(0x0b1322).lerp(new THREE.Color(0xd9a27a), clamp(1 - Math.abs(s - 0.08) * 6, 0, 1) * (s > -0.1 ? 1 : 0));
    fog.lerp(new THREE.Color(0xb9c7d3), clamp((s - 0.15) * 3, 0, 1));
    this.scene.fog.color.copy(fog);
    this.scene.environmentIntensity = 1;
    this.renderer.toneMappingExposure = 0.85 + night * 0.35;
    this.stars.material.opacity = night * 0.9;
    this.stars.position.copy(this.camera.position);
    this.sky.position.copy(this.camera.position);
    materials().glowWindow.color.setScalar(0.15 + this.nightF * 2.2);
    // ortam haritası
    this.envTimer -= dt;
    if (this.envTimer <= 0 && (Math.abs(s - this.lastEnvSun) > 0.04 || !this.envRT)) {
      this.envTimer = this.quality === 'low' ? 30 : 3;
      this.lastEnvSun = s;
      const u = this.envU, dusk = clamp(1 - Math.abs(s - 0.06) * 5, 0, 1);
      u.top.value.setRGB(0.03, 0.045, 0.1).lerp(new THREE.Color(0.16, 0.32, 0.7), day);
      u.hor.value.setRGB(0.05, 0.065, 0.11).lerp(new THREE.Color(0.62, 0.66, 0.7), day).lerp(new THREE.Color(0.85, 0.45, 0.25), dusk * 0.6);
      u.bot.value.setRGB(0.01, 0.01, 0.012).lerp(new THREE.Color(0.2, 0.18, 0.14), day);
      u.sunDir.value.copy(s > -0.02 ? sunDir : new THREE.Vector3(-0.35, 0.85, 0.4).normalize());
      u.sunCol.value.copy(this.sun.color).multiplyScalar(s > -0.02 ? 1.2 * day + 0.2 : 0.05);
      const rt = this.pmrem.fromScene(this.envScene, 0, 0.1, 200);
      if (this.envRT) this.envRT.dispose();
      this.envRT = rt;
      this.scene.environment = rt.texture;
    }
  }

  // --------- kamera ---------
  updateCamera(dt) {
    const c = this.cam;
    if (!this.dragging) {
      c.tx += c.vx * dt; c.tz += c.vz * dt;
      const k = Math.pow(0.02, dt);
      c.vx *= k; c.vz *= k;
    }
    c.tx = clamp(c.tx, -6, MAP_W * TILE + 6);
    c.tz = clamp(c.tz, -6, MAP_H * TILE + 6);
    c.dist = clamp(c.dist, 12, 110);
    c.pitch = clamp(c.pitch, 0.45, 1.35);
    const cp = Math.cos(c.pitch);
    this.camera.position.set(
      c.tx + Math.sin(c.yaw) * cp * c.dist,
      Math.sin(c.pitch) * c.dist,
      c.tz + Math.cos(c.yaw) * cp * c.dist,
    );
    this.camera.lookAt(c.tx, 0, c.tz);
    this.scene.fog.density = 0.0026 + 0.06 / (c.dist + 40);
  }
  screenToGround(px, py) {
    const ndc = new THREE.Vector2((px / window.innerWidth) * 2 - 1, -(py / window.innerHeight) * 2 + 1);
    const rc = new THREE.Raycaster();
    rc.setFromCamera(ndc, this.camera);
    const t = -rc.ray.origin.y / rc.ray.direction.y;
    if (!(t > 0)) return null;
    const p = rc.ray.origin.clone().addScaledVector(rc.ray.direction, t);
    return { wx: p.x, wz: p.z, x: Math.floor(p.x / TILE), y: Math.floor(p.z / TILE), fx: p.x / TILE, fy: p.z / TILE };
  }
  pickUnit(fx, fy) {
    let best = null, bd = 1.2;
    for (const u of this.game.units) {
      const d = Math.hypot(u.x - fx, u.y - fy - (u.air ? -0.4 : 0));
      if (d < bd) { bd = d; best = u; }
    }
    return best;
  }

  render(dt) {
    this.time += dt;
    this.updateCamera(dt);
    if (this.game) {
      this.updateSky(dt);
      this.terrain.update(this.time);
      this.beltPhase = ((this.beltPhase || 0) + dt * 1.8 * this.game.speed) % 1;
      materials().belt.map.offset.x = -this.beltPhase;
      this.updateBuildings(dt);
      this.updateUnits(dt);
      this.updateItems();
      this.updateHp();
      this.updateGhosts();
      this.updateSelection();
      this.fx.update(dt, this.game, (x, y) => this.toWorld(x, y));
      this.terrain.grid.visible = this.ghosts.length > 0 || !!this.showGrid;
    }
    if (this.composer) this.composer.render(dt);
    else this.renderer.render(this.scene, this.camera);
  }
}

function easeOutBack(x) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
export { FACTION_COL, RECIPES };
