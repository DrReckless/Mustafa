// 3D çizim motoru: sahne, ışık, kamera, oyun durumuyla eşitleme
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { loadAll, buildLibrary, M, tex, setAniso, setMaxTexSize } from './materials.js';
import { Terrain, MARGIN, fbm } from './terrain.js';
import { Forest, grassTufts } from './trees.js';
import { buildModel, buildScaffold } from './buildings.js';
import { Builder } from './geom.js';

const QUALITY = {
  yuksek: { pr: 2, shadow: 2048, aa: true, outer: 1, tufts: 2600, tex: 1024 },
  orta: { pr: 1.5, shadow: 1024, aa: true, outer: 0.6, tufts: 1200, tex: 512 },
  dusuk: { pr: 1, shadow: 0, aa: false, outer: 0.3, tufts: 0, tex: 512 }
};

const R = {
  ready: false,
  quality: 'yuksek',
  cam: { tx: 0, tz: 0, dist: 14, yaw: Math.PI / 4, minD: 4, maxD: 34 },
  bmap: new Map()
};

const SEASON_LIGHT = [
  { sun: 0xfff1dd, int: 3.0, hemi: 0.55, fog: 0xc8d6e2, exp: 1.0 },
  { sun: 0xffe9c8, int: 3.4, hemi: 0.55, fog: 0xd6dde0, exp: 1.05 },
  { sun: 0xffcf98, int: 2.6, hemi: 0.5, fog: 0xd5c9b5, exp: 1.0 },
  { sun: 0xe4ecff, int: 2.2, hemi: 0.7, fog: 0xdfe6ee, exp: 1.0 }
];

function init(canvas, opts = {}) {
  R.quality = opts.quality || 'yuksek';
  const q = QUALITY[R.quality];
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: q.aa, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.pr));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = q.shadow > 0;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  setAniso(Math.min(8, renderer.capabilities.getMaxAnisotropy()));
  setMaxTexSize(q.tex);
  R.renderer = renderer;

  const scene = new THREE.Scene();
  R.scene = scene;
  scene.fog = new THREE.Fog(0xc8d6e2, 30, 75);
  scene.background = new THREE.Color(0xc8d6e2);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  R.camera = camera;

  const hemi = new THREE.HemisphereLight(0xdfeaff, 0x6b5a3e, 0.55);
  scene.add(hemi); R.hemi = hemi;
  const sun = new THREE.DirectionalLight(0xfff1dd, 3);
  sun.castShadow = q.shadow > 0;
  if (q.shadow) {
    sun.shadow.mapSize.set(q.shadow, q.shadow);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
  }
  scene.add(sun); scene.add(sun.target); R.sun = sun;

  const base = opts.base || 'tex';
  return loadAll(base, opts.onProgress).then(() => new Promise((res) => {
    new RGBELoader().load(base + '/sky_1k.hdr', (hdr) => {
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      const pm = new THREE.PMREMGenerator(renderer);
      R.env = pm.fromEquirectangular(hdr).texture;
      scene.environment = R.env;
      scene.environmentIntensity = 0.55;
      scene.background = hdr;
      scene.backgroundIntensity = 0.9;
      hdr.dispose && 0;
      pm.dispose();
      res();
    }, undefined, () => res());
  })).then(() => {
    buildLibrary();
    R.ready = true;
    initFx();
  });
}

// ---------- Oyun dünyasını kur ----------
function setGame(g) {
  const scene = R.scene;
  if (R.world) { scene.remove(R.world); }
  for (const e of R.bmap.values()) scene.remove(e.obj);
  R.bmap.clear();
  R.N = MAP_N;
  const world = new THREE.Group();
  R.world = world;
  scene.add(world);
  R.terrain = new Terrain(MAP_N, g.map);
  world.add(R.terrain.mesh);
  world.add(R.terrain.water);

  // Ağaçlar
  if (!R.forest) R.forest = new Forest(world, MAP_N);
  else R.forest.scene = world;
  const list = [];
  const N = MAP_N, h = N / 2, rng = makeRng(g.seed + 99);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const t = g.map.trees[j * N + i];
    if (!t) continue;
    const x = i - h + 0.3 + rng() * 0.4, z = j - h + 0.3 + rng() * 0.4;
    list.push({ x, z, y: R.terrain.heightAt(x, z) - 0.02, kind: t, s: 0.8 + rng() * 0.45, r: rng() * 6.28, key: j * N + i });
  }
  // dış alan ormanı
  const q = QUALITY[R.quality];
  const S = N + MARGIN * 2;
  for (let z = -S / 2; z < S / 2; z += 1) for (let x = -S / 2; x < S / 2; x += 1) {
    if (Math.abs(x + 0.5) < h + 0.5 && Math.abs(z + 0.5) < h + 0.5) continue;
    const px = x + rng(), pz = z + rng();
    const dens = fbm(px * 0.12 + 3, pz * 0.12);
    if (R.terrain.waterDistAt(px, pz) < 1.6) continue;
    const out = Math.max(Math.abs(px) - h, Math.abs(pz) - h);
    const p = (dens - 0.42) * 2.4 * q.outer * (out > 18 ? 0.6 : 1);
    if (rng() < p) {
      const y = R.terrain.heightAt(px, pz);
      list.push({ x: px, z: pz, y: y - 0.02, kind: y > 2.5 ? (rng() < 0.75 ? 2 : 1) : 1 + Math.floor(rng() * 3), s: 0.8 + rng() * 0.6, r: rng() * 6.28 });
    }
  }
  R.forest.build(list);
  R.treeCache = new Uint8Array(g.map.trees);

  // Ot tutamları ve çalılar
  if (q.tufts) {
    const tl = [];
    for (let n = 0; n < q.tufts; n++) {
      const x = (rng() - 0.5) * (N + 20), z = (rng() - 0.5) * (N + 20);
      if (R.terrain.waterDistAt(x, z) < 1.1) continue;
      const ti = Math.floor(x + h), tj = Math.floor(z + h);
      if (ti >= 0 && tj >= 0 && ti < N && tj < N && g.map.tiles[tj * N + ti] === 2) continue;
      tl.push({ x, z, y: R.terrain.heightAt(x, z), s: 0.7 + rng() * 0.9, r: rng() * 6.28, ti, tj });
    }
    R.tuftList = tl;
    R.tufts = grassTufts(tl);
    world.add(R.tufts);
  }
  // Kayalık karolara kaya
  const rb = new Builder();
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    if (g.map.tiles[j * N + i] !== 2) continue;
    const c = 1 + Math.floor(rng() * 2);
    for (let k = 0; k < c; k++) {
      const s = 0.12 + rng() * 0.22;
      const geo = new THREE.IcosahedronGeometry(s, 1);
      const p = geo.attributes.position, seen = new Map();
      for (let v = 0; v < p.count; v++) {
        const key = `${p.getX(v).toFixed(3)},${p.getY(v).toFixed(3)},${p.getZ(v).toFixed(3)}`;
        if (!seen.has(key)) seen.set(key, 0.7 + rng() * 0.5);
        const f = seen.get(key);
        p.setXYZ(v, p.getX(v) * f, p.getY(v) * f * 0.65, p.getZ(v) * f);
      }
      geo.computeVertexNormals();
      rb.add(geo, M.rock, i - h + 0.2 + rng() * 0.6, s * 0.15, j - h + 0.2 + rng() * 0.6, rng() * 6);
    }
  }
  world.add(rb.build());

  // Seçim ve hayalet nesneleri
  const selMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.35, depthWrite: false });
  R.sel = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), selMat);
  R.sel.visible = false; R.sel.renderOrder = 2;
  world.add(R.sel);
  R.ring = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x9fe0ff, transparent: true, opacity: 0.7, depthWrite: false }));
  R.ringFill = new THREE.Mesh(new THREE.CircleGeometry(1, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x9fe0ff, transparent: true, opacity: 0.1, depthWrite: false }));
  R.ring.visible = R.ringFill.visible = false;
  world.add(R.ring); world.add(R.ringFill);
  R.ghostFoot = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x66ff77, transparent: true, opacity: 0.35, depthWrite: false }));
  R.ghostFoot.visible = false;
  world.add(R.ghostFoot);
  R.ghostType = null;

  R.season = -1;
  R.cam.tx = 0; R.cam.tz = 0;
  sync(g);
}

function tileToWorld(i, j) { return { x: i - R.N / 2, z: j - R.N / 2 }; }

// ---------- Eşitleme ----------
function sync(g) {
  if (!R.terrain) return;
  const seen = new Set();
  const s = season(g);
  for (const b of g.buildings) {
    seen.add(b.id);
    let e = R.bmap.get(b.id);
    const built = b.progress >= 1;
    if (!e || e.built !== built) {
      if (e) R.world.remove(e.obj);
      const def = Object.assign({ key: b.type }, BUILDINGS[b.type]);
      const obj = built ? buildModel(b.type, b.id) : buildScaffold(def);
      const w = tileToWorld(b.i, b.j);
      obj.position.set(w.x, 0, w.z);
      R.world.add(obj);
      const isNew = !e;
      e = { obj, built, type: b.type, b };
      R.bmap.set(b.id, e);
      if (isNew) groundPaint(b, def);
      hideTufts(b, def);
    }
    e.b = b;
    if (!built) {
      const wall = e.obj.userData.wall;
      wall.scale.y = Math.max(0.03, b.progress) * e.obj.userData.wallH;
    } else {
      const d = e.obj.userData.dyn;
      const working = b.workers > 0 && !b.paused && !b.noInput;
      e.working = working;
      if (d.glow) d.glow.visible = working;
      if (d.crops) updateCrops(d.crops, b, s);
    }
  }
  for (const [id, e] of R.bmap) {
    if (!seen.has(id)) {
      R.world.remove(e.obj);
      R.bmap.delete(id);
      if (e.type === 'tarla') {
        const w = tileToWorld(e.b.i, e.b.j);
        R.terrain.paint(3, w.x, w.z, w.x + 2, w.z + 2, 0, 'set', 0.05);
      }
    }
  }
  // kesilen ağaçlar
  const tr = g.map.trees;
  for (let k = 0; k < tr.length; k++) {
    if (R.treeCache[k] && !tr[k]) { R.forest.hide(k); R.treeCache[k] = 0; }
  }
  if (s !== R.season) setSeason(s);
}

function groundPaint(b, def) {
  const w = tileToWorld(b.i, b.j);
  if (b.type === 'tarla') {
    R.terrain.paint(3, w.x + 0.04, w.z + 0.04, w.x + 1.96, w.z + 1.96, 255, 'max', 0.05);
  } else if (b.type === 'agil') {
    R.terrain.paint(0, w.x + 0.1, w.z + 0.1, w.x + 1.9, w.z + 1.9, 170, 'max', 0.3);
  } else {
    R.terrain.paint(0, w.x + 0.1, w.z + 0.1, w.x + def.w - 0.1, w.z + def.h - 0.1, 230, 'max', 0.35);
  }
}
function hideTufts(b, def) {
  if (!R.tufts) return;
  const z = new THREE.Matrix4().makeScale(0, 0, 0);
  let ch = false;
  R.tuftList.forEach((t, n) => {
    if (t.ti >= b.i - 0 && t.ti < b.i + def.w && t.tj >= b.j && t.tj < b.j + def.h) { R.tufts.setMatrixAt(n, z); ch = true; }
  });
  if (ch) R.tufts.instanceMatrix.needsUpdate = true;
}

function updateCrops(c, b, s) {
  let h = 0, ripe = false;
  if (s === 0) h = 0.15 + b.growth * 0.9;
  else if (s === 1) h = 0.15 + b.growth * 0.9;
  else if (s === 2) { h = b.harvest > 1 ? 1 : 0; ripe = true; }
  if (s === 1 && b.growth > 0.75) ripe = true;
  const key = Math.round(h * 20) + (ripe ? 100 : 0) + (b.harvest > 1 ? Math.round(b.harvest / 5) * 1000 : 0);
  if (key === c.last) return;
  c.last = key;
  c.mat.map = tex(ripe ? 'wheat_ripe' : 'wheat_green');
  c.mat.needsUpdate = true;
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  // hasatta tarlanın bir kısmı biçilmiş görünür
  const frac = s === 2 && b.harvest > 1 ? Math.min(1, b.harvest / 40) : 1;
  c.base.forEach(([x, z, r], n) => {
    const on = h > 0 && (n / c.base.length) < frac + 0.001;
    q.setFromAxisAngle(up, r);
    const sc = on ? h * (0.85 + (r % 0.3)) : 0;
    m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(on ? 1 : 0, sc, on ? 1 : 0));
    c.im.setMatrixAt(n, m);
  });
  c.im.instanceMatrix.needsUpdate = true;
}

function setSeason(s) {
  R.season = s;
  const L = SEASON_LIGHT[s];
  R.sun.color.setHex(L.sun); R.sun.intensity = L.int;
  R.hemi.intensity = L.hemi;
  R.scene.fog.color.setHex(L.fog);
  R.terrain.uniforms.uSnow.value = s === 3 ? 1 : 0;
  R.terrain.uniforms.uAutumn.value = s === 2 ? 1 : s === 1 ? 0.12 : 0;
  R.forest.setSeason(s);
  if (R.tufts) R.tufts.visible = s !== 3;
  if (R.snow) R.snow.visible = s === 3;
  // kışın çatılarda kar
  const snowy = s === 3;
  for (const k of ['roof', 'soilRoof', 'lead']) {
    const m = M[k];
    if (m.userData.base === undefined) { m.userData.base = m.color.getHex(); m.userData.origMap = m.map; }
    m.color.setHex(snowy ? 0xf4f7fb : m.userData.base);
    m.map = snowy ? tex('snow_field_aerial_diff') : m.userData.origMap;
    m.needsUpdate = true;
  }
}

// ---------- Efektler: duman, kar, insanlar ----------
function initFx() {
  const smat = new THREE.SpriteMaterial({ map: tex('smoke'), transparent: true, depthWrite: false, opacity: 0.5, color: 0xdddddd });
  R.smokePool = [];
  for (let k = 0; k < 120; k++) {
    const sp = new THREE.Sprite(smat.clone());
    sp.visible = false;
    R.scene.add(sp);
    R.smokePool.push({ sp, life: 0 });
  }
  R.smokeT = 0;
  // kar taneleri
  const n = 1800, pos = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) { pos[k * 3] = (Math.random() - 0.5) * 40; pos[k * 3 + 1] = Math.random() * 14; pos[k * 3 + 2] = (Math.random() - 0.5) * 40; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  R.snow = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.85, depthWrite: false }));
  R.snow.visible = false;
  R.scene.add(R.snow);
  R.people = [];
}

function emitSmoke(p) {
  const s = R.smokePool.find((x) => x.life <= 0);
  if (!s) return;
  s.life = 1; s.sp.visible = true;
  s.sp.position.copy(p);
  s.vx = (Math.random() - 0.5) * 0.05 + 0.08; s.vz = (Math.random() - 0.5) * 0.05;
}

const CLOTH = [0x8b1e1e, 0x2e5f9e, 0x3f6b25, 0x7a5a3a, 0xb08a2a, 0x5b3d7a, 0xd2d0c8, 0x4a4a4a];
function makePerson(k) {
  const b = new Builder();
  const col = new THREE.MeshStandardMaterial({ color: CLOTH[k % CLOTH.length], roughness: 0.95 });
  b.cyl(col, 0, 0.02, 0, 0.022, 0.034, 0.14, 7);
  b.cyl(M.woolDark, -0.0, 0, 0.0, 0.02, 0.02, 0.03, 6);
  b.add(new THREE.SphereGeometry(0.022, 8, 6), M.skin, 0, 0.18, 0);
  if (k % 3 === 0) b.add(new THREE.SphereGeometry(0.026, 8, 6), M.white, 0, 0.195, 0, 0, 0, 0, 1, 0.7, 1);
  else if (k % 3 === 1) b.cyl(M.fabric[0], 0, 0.19, 0, 0.018, 0.022, 0.035, 8);
  else b.cyl(M.woodDark, 0, 0.19, 0, 0.02, 0.024, 0.03, 8);
  const o = b.build();
  o.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  return o;
}

function updateWalkers(walkers, t) {
  while (R.people.length < walkers.length) { const p = makePerson(R.people.length); R.scene.add(p); R.people.push(p); }
  R.people.forEach((p, n) => {
    const w = walkers[n];
    if (!w) { p.visible = false; return; }
    p.visible = true;
    const wx = w.x - R.N / 2, wz = w.y - R.N / 2;
    const dx = wx - p.position.x, dz = wz - p.position.z;
    if (Math.abs(dx) + Math.abs(dz) > 0.0005) p.rotation.y = Math.atan2(dx, dz);
    const moving = Math.abs(dx) + Math.abs(dz) > 0.0005 && Math.abs(dx) + Math.abs(dz) < 1;
    p.position.set(wx, (R.terrain ? Math.max(0, R.terrain.heightAt(wx, wz)) : 0) + (moving ? Math.abs(Math.sin(t * 9 + n)) * 0.012 : 0), wz);
    // yürünen yerde patika oluşur
    if (moving && Math.random() < 0.02) R.terrain.paint(0, wx - 0.05, wz - 0.05, wx + 0.05, wz + 0.05, 3, 'add', 0.08);
  });
}

// ---------- Kare ----------
let lastSmoke = 0;
function frame(dt, t, g, ui, walkers, running) {
  if (!R.ready || !R.terrain) return;
  const cv = R.renderer.domElement;
  const w = cv.clientWidth, h = cv.clientHeight;
  if (R.vw !== w || R.vh !== h) {
    R.vw = w; R.vh = h;
    R.renderer.setSize(w, h, false);
    R.camera.aspect = w / h;
    R.camera.updateProjectionMatrix();
  }
  updateCamera();
  R.terrain.update(t);
  R.forest.update(t);

  // seçim
  if (ui.selected && R.bmap.has(ui.selected.id)) {
    const d = BUILDINGS[ui.selected.type];
    const p = tileToWorld(ui.selected.i, ui.selected.j);
    R.sel.visible = true;
    R.sel.scale.set(d.w, 1, d.h);
    R.sel.position.set(p.x + d.w / 2, 0.03, p.z + d.h / 2);
    showRing(d.radius, p.x + d.w / 2, p.z + d.h / 2);
  } else { R.sel.visible = false; if (!ui.ghost) showRing(0); }

  // hayalet
  if (ui.ghost) {
    const d = BUILDINGS[ui.ghost.type];
    if (R.ghostType !== ui.ghost.type) {
      if (R.ghost) R.world.remove(R.ghost);
      R.ghost = buildModel(ui.ghost.type, 7);
      R.ghostMat = new THREE.MeshStandardMaterial({ color: 0x88ff99, transparent: true, opacity: 0.55, depthWrite: false });
      R.ghost.traverse((m) => { if (m.isMesh) { m.material = R.ghostMat; m.castShadow = false; } });
      R.world.add(R.ghost);
      R.ghostType = ui.ghost.type;
    }
    const p = tileToWorld(ui.ghost.i, ui.ghost.j);
    R.ghost.visible = true;
    R.ghost.position.set(p.x, 0.01, p.z);
    R.ghostMat.color.setHex(ui.ghost.ok ? 0x88ff99 : 0xff6655);
    R.ghostFoot.visible = true;
    R.ghostFoot.scale.set(d.w, 1, d.h);
    R.ghostFoot.position.set(p.x + d.w / 2, 0.035, p.z + d.h / 2);
    R.ghostFoot.material.color.setHex(ui.ghost.ok ? 0x66ff77 : 0xff4444);
    showRing(d.radius || (d.need === 'orman' ? 4.5 : 0), p.x + d.w / 2, p.z + d.h / 2);
  } else if (R.ghost) { R.ghost.visible = false; R.ghostFoot.visible = false; }

  // hareketli parçalar
  const s = R.season;
  for (const e of R.bmap.values()) {
    if (!e.built) continue;
    const d = e.obj.userData.dyn;
    if (d.sails && e.working && running) d.sails.rotation.z -= dt * 1.4;
    if (d.flag) {
      const p = d.flag.geometry.attributes.position;
      for (let k = 0; k < p.count; k++) {
        const x = p.getX(k);
        p.setZ(k, Math.sin(t * 5 + x * 18) * 0.025 * x * 3);
      }
      p.needsUpdate = true;
    }
    if (d.sheep && running) {
      for (const sh of d.sheep) {
        const u = sh.userData;
        if (u.wait > 0) { u.wait -= dt; continue; }
        const dx = u.tx - sh.position.x, dz = u.tz - sh.position.z, dd = Math.hypot(dx, dz);
        if (dd < 0.02) { u.tx = 0.3 + Math.random() * 1.4; u.tz = 0.85 + Math.random() * 0.95; u.wait = 1 + Math.random() * 5; }
        else { sh.position.x += dx / dd * dt * 0.12; sh.position.z += dz / dd * dt * 0.12; sh.rotation.y = Math.atan2(dx, dz) - Math.PI / 2; }
      }
    }
  }

  // duman
  if (running) lastSmoke += dt;
  if (lastSmoke > 0.35) {
    lastSmoke = 0;
    for (const e of R.bmap.values()) {
      if (!e.built) continue;
      const d = e.obj.userData.dyn;
      if (!d.smoke) continue;
      const house = e.type === 'ev' || e.type === 'konak';
      if ((house && (s === 2 || s === 3)) || (!house && e.working)) {
        for (const p of d.smoke) emitSmoke(p.clone().add(e.obj.position));
      }
    }
  }
  for (const sm of R.smokePool) {
    if (sm.life <= 0) continue;
    sm.life -= dt * 0.28;
    if (sm.life <= 0) { sm.sp.visible = false; continue; }
    sm.sp.position.y += dt * 0.22;
    sm.sp.position.x += sm.vx * dt; sm.sp.position.z += sm.vz * dt;
    const a = 1 - sm.life;
    sm.sp.scale.setScalar(0.12 + a * 0.5);
    sm.sp.material.opacity = 0.45 * sm.life * Math.min(1, a * 5);
  }
  if (R.snow && R.snow.visible) {
    const p = R.snow.geometry.attributes.position;
    for (let k = 0; k < p.count; k++) {
      let y = p.getY(k) - dt * 0.9;
      if (y < 0) y += 14;
      p.setY(k, y);
      p.setX(k, p.getX(k) + Math.sin(t + k) * dt * 0.1);
    }
    p.needsUpdate = true;
    R.snow.position.set(R.cam.tx, 0, R.cam.tz);
  }
  updateWalkers(walkers, t);

  R.renderer.render(R.scene, R.camera);
}

function showRing(r, x, z) {
  if (!r) { R.ring.visible = R.ringFill.visible = false; return; }
  R.ring.visible = R.ringFill.visible = true;
  R.ring.scale.set(r, 1, r); R.ringFill.scale.set(r, 1, r);
  R.ring.position.set(x, 0.05, z); R.ringFill.position.set(x, 0.04, z);
}

// ---------- Kamera ----------
function updateCamera() {
  const c = R.cam;
  const tN = (c.dist - c.minD) / (c.maxD - c.minD);
  const pitch = THREE.MathUtils.lerp(0.5, 0.95, Math.pow(tN, 0.7)); // yaklaştıkça daha yatay
  const hz = Math.cos(pitch) * c.dist, y = Math.sin(pitch) * c.dist;
  const ty = R.terrain ? Math.max(0, R.terrain.heightAt(c.tx, c.tz)) : 0;
  R.camera.position.set(c.tx + Math.sin(c.yaw) * hz, ty + y, c.tz + Math.cos(c.yaw) * hz);
  R.camera.lookAt(c.tx, ty + 0.3, c.tz);
  // gölge kamerası hedefi izler
  const sd = Math.max(8, c.dist * 1.1);
  const sunDir = new THREE.Vector3(-0.55, 0.75, 0.35).normalize();
  R.sun.position.set(c.tx + sunDir.x * 30, sunDir.y * 30, c.tz + sunDir.z * 30);
  R.sun.target.position.set(c.tx, 0, c.tz);
  if (R.sun.castShadow) {
    const sc = R.sun.shadow.camera;
    sc.left = -sd; sc.right = sd; sc.top = sd; sc.bottom = -sd; sc.near = 1; sc.far = 80;
    sc.updateProjectionMatrix();
  }
  R.scene.fog.near = c.dist * 1.6; R.scene.fog.far = c.dist * 4.5 + 25;
}

function clampCam() {
  const c = R.cam, h = (R.N || 48) / 2 + 2;
  c.tx = Math.max(-h, Math.min(h, c.tx));
  c.tz = Math.max(-h, Math.min(h, c.tz));
  c.dist = Math.max(c.minD, Math.min(c.maxD, c.dist));
}
function pan(dxPx, dyPx) {
  const c = R.cam;
  const k = c.dist * 0.0016 * (1000 / Math.max(400, R.vh || 600));
  const fx = -Math.sin(c.yaw), fz = -Math.cos(c.yaw);   // ileri (ekranın yukarısı)
  const rx = Math.cos(c.yaw), rz = -Math.sin(c.yaw);   // sağ
  c.tx -= (rx * dxPx - fx * dyPx) * k;
  c.tz -= (rz * dxPx - fz * dyPx) * k;
  clampCam();
}
function zoom(f, sx, sy) {
  const before = sx !== undefined ? pickWorld(sx, sy) : null;
  R.cam.dist /= f;
  clampCam();
  if (before) {
    updateCamera();
    R.camera.updateMatrixWorld();
    const after = pickWorld(sx, sy);
    if (after) { R.cam.tx += before.x - after.x; R.cam.tz += before.z - after.z; clampCam(); }
  }
}
function rotate(a) { R.cam.yaw += a; }
function centerOn(i, j) { const w = tileToWorld(i, j); R.cam.tx = w.x; R.cam.tz = w.z; clampCam(); }

const _ray = new THREE.Raycaster();
const _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
function pickWorld(sx, sy) {
  const cv = R.renderer.domElement;
  const ndc = new THREE.Vector2(sx / cv.clientWidth * 2 - 1, -(sy / cv.clientHeight) * 2 + 1);
  _ray.setFromCamera(ndc, R.camera);
  const p = new THREE.Vector3();
  if (!_ray.ray.intersectPlane(_plane, p)) return null;
  return p;
}
function pick(sx, sy) {
  const p = pickWorld(sx, sy);
  if (!p) return null;
  return { i: Math.floor(p.x + R.N / 2), j: Math.floor(p.z + R.N / 2) };
}
// Binalara doğrudan dokunma (yüksek binalar için)
function pickBuilding(sx, sy) {
  const cv = R.renderer.domElement;
  const ndc = new THREE.Vector2(sx / cv.clientWidth * 2 - 1, -(sy / cv.clientHeight) * 2 + 1);
  _ray.setFromCamera(ndc, R.camera);
  const objs = [];
  for (const e of R.bmap.values()) objs.push(e.obj);
  const hits = _ray.intersectObjects(objs, true);
  if (!hits.length) return null;
  let o = hits[0].object;
  while (o && o.parent && !objs.includes(o)) o = o.parent;
  for (const [id, e] of R.bmap) if (e.obj === o) return id;
  return null;
}
function screenCenterTile() {
  const cv = R.renderer.domElement;
  return pick(cv.clientWidth / 2, cv.clientHeight / 2);
}

window.Render3D = { init, setGame, sync, frame, pan, zoom, rotate, pick, pickBuilding, centerOn, screenCenterTile, R, QUALITY };
