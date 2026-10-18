import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { getTextures } from './textures.js';
import { ITEMS } from '../config.js';

// ---------------- malzemeler ----------------
let M = null;
export function materials() {
  if (M) return M;
  const T = getTextures();
  const std = (o) => new THREE.MeshStandardMaterial(o);
  M = {
    concrete: std({ color: 0xd2cec6, map: T.concrete, normalMap: T.concreteN, roughness: 0.92, metalness: 0 }),
    concreteDark: std({ color: 0x8a8780, map: T.concrete, normalMap: T.concreteN, roughness: 0.95 }),
    brick: std({ color: 0x8c5846, map: T.concrete, normalMap: T.concreteN, roughness: 0.9 }),
    steel: std({ color: 0xa3aab2, map: T.metal, roughnessMap: T.metalR, normalMap: T.metalN, metalness: 0.85, roughness: 0.6 }),
    darkSteel: std({ color: 0x41454c, map: T.metal, roughnessMap: T.metalR, normalMap: T.metalN, metalness: 0.75, roughness: 0.7 }),
    yellow: std({ color: 0xd9a21b, map: T.metal, normalMap: T.metalN, metalness: 0.25, roughness: 0.55 }),
    gray: std({ color: 0x66717c, map: T.metal, normalMap: T.metalN, metalness: 0.35, roughness: 0.55 }),
    accent: std({ color: 0xffffff, map: T.metal, normalMap: T.metalN, metalness: 0.3, roughness: 0.5 }),
    rust: std({ color: 0x7a5038, map: T.metal, normalMap: T.metalN, roughnessMap: T.metalR, metalness: 0.55, roughness: 0.8 }),
    rubber: std({ color: 0x1a1a1c, roughness: 0.95, metalness: 0 }),
    belt: std({ color: 0xffffff, map: T.belt, roughness: 0.85, metalness: 0 }),
    copper: std({ color: 0xc27a43, metalness: 1, roughness: 0.32, normalMap: T.metalN }),
    glass: std({ color: 0x1b2836, metalness: 0.9, roughness: 0.08 }),
    solar: std({ color: 0xffffff, map: T.solar, metalness: 0.65, roughness: 0.12 }),
    hazard: std({ color: 0xffffff, map: T.hazard, metalness: 0.2, roughness: 0.6 }),
    olive: std({ color: 0x4d5a36, map: T.metal, metalness: 0.3, roughness: 0.7 }),
    glowFurnace: new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
    glowLight: new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
    glowWindow: new THREE.MeshBasicMaterial({ color: 0xffffff, map: T.windows, toneMapped: false }),
    glowLaser: new THREE.MeshBasicMaterial({ color: 0x8ff6ff, toneMapped: false }),
    blade: std({ color: 0x2a2c30, metalness: 0.6, roughness: 0.5, side: THREE.DoubleSide }),
    white: std({ color: 0xe4e6e8, map: T.metal, normalMap: T.metalN, metalness: 0.2, roughness: 0.45 }),
    blueSteel: std({ color: 0x2f62a8, map: T.metal, normalMap: T.metalN, metalness: 0.45, roughness: 0.5 }),
    patina: std({ color: 0x5f9c86, map: T.metal, normalMap: T.metalN, metalness: 0.4, roughness: 0.65 }),
    graphite: std({ color: 0x232325, metalness: 0.3, roughness: 0.75 }),
    insulator: std({ color: 0x8a5a3a, metalness: 0.1, roughness: 0.3 }),
    ceramic: std({ color: 0xcfd4d6, metalness: 0.05, roughness: 0.35 }),
  };
  {
    const bt = T.belt.clone(); bt.needsUpdate = true;
    M.beltFast = std({ color: 0xbcd8ff, map: bt, roughness: 0.75, metalness: 0.05 });
  }
  M.concreteDS = M.concrete.clone(); M.concreteDS.side = THREE.DoubleSide;
  M.glowFurnace.userData.instColor = true;
  M.glowLight.userData.instColor = true;
  M.accent.userData.instColor = true;
  return M;
}

// ---------------- geometri yardımcıları ----------------
const rbox = (w, h, d, r = 0.05) => new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2.1, h / 2.1, d / 2.1));
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s = 16) => new THREE.CylinderGeometry(rt, rb, h, s);
const sph = (r, ws = 16, hs = 12) => new THREE.SphereGeometry(r, ws, hs);

const _e = new THREE.Euler(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
function xf(o = {}) {
  _e.set(o.rx || 0, o.ry || 0, o.rz || 0);
  _q.setFromEuler(_e);
  _v.set(o.x || 0, o.y || 0, o.z || 0);
  _s.set(o.sx ?? 1, o.sy ?? 1, o.sz ?? 1);
  return new THREE.Matrix4().compose(_v, _q, _s);
}

class Builder {
  constructor() { this.groups = new Map(); }
  // anim: 'static' | ad; pivot: [x,y,z]
  add(geo, mat, t = {}, anim = 'static', pivot = null) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.applyMatrix4(xf(t));
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    const key = mat.uuid + '|' + anim + '|' + (pivot ? pivot.join(',') : '');
    if (!this.groups.has(key)) this.groups.set(key, { mat, anim, pivot, geos: [] });
    this.groups.get(key).geos.push(g);
    return this;
  }
  build() {
    const parts = [];
    for (const g of this.groups.values()) {
      const geo = mergeGeometries(g.geos, false);
      geo.computeBoundingSphere();
      parts.push({
        geo, mat: g.mat, anim: g.anim,
        pivot: g.pivot ? new THREE.Vector3(...g.pivot) : null,
        inst: !!g.mat.userData.instColor,
        glow: g.mat.isMeshBasicMaterial,
      });
    }
    return parts;
  }
}

// ---------------- bina modelleri ----------------
function mBelt(m, fast = false) {
  const b = new Builder();
  b.add(box(2.0, 0.06, 1.42), fast ? m.beltFast : m.belt, { y: 0.4 }, fast ? 'beltFast' : 'belt');
  for (const z of [-0.78, 0.78]) {
    b.add(rbox(2.0, 0.2, 0.12, 0.03), fast ? m.blueSteel : m.darkSteel, { y: 0.36, z });
    b.add(box(2.0, 0.04, 0.16), fast ? m.steel : m.hazard, { y: 0.48, z });
  }
  if (fast) for (const z of [-0.78, 0.78]) for (const x of [-0.6, 0, 0.6]) b.add(box(0.12, 0.03, 0.17), m.blueSteel, { x, y: 0.505, z });
  for (const x of [-0.92, 0.92]) b.add(cyl(0.08, 0.08, 1.5, 10), m.steel, { x, y: 0.36, rx: Math.PI / 2 });
  for (const x of [-0.75, 0.75]) for (const z of [-0.74, 0.74]) b.add(box(0.1, 0.3, 0.1), m.steel, { x, y: 0.15, z });
  b.add(box(1.6, 0.05, 0.05), m.steel, { y: 0.12, z: 0.74 });
  b.add(box(1.6, 0.05, 0.05), m.steel, { y: 0.12, z: -0.74 });
  return b.build();
}

function mMiner(m) {
  const b = new Builder();
  b.add(rbox(1.9, 0.25, 1.9, 0.06), m.concrete, { y: 0.12 });
  for (const x of [-0.62, 0.62]) for (const z of [-0.62, 0.62]) b.add(rbox(0.16, 1.7, 0.16, 0.03), m.steel, { x, y: 1.1, z });
  for (const z of [-0.62, 0.62]) b.add(box(1.3, 0.08, 0.08), m.steel, { y: 0.9, z, rz: 0.55 });
  for (const x of [-0.62, 0.62]) b.add(box(0.08, 0.08, 1.3), m.steel, { x, y: 0.9, rx: 0.55 });
  b.add(rbox(1.42, 0.12, 1.42, 0.03), m.hazard, { y: 1.95 });
  b.add(rbox(1.35, 0.65, 1.35, 0.08), m.yellow, { y: 2.33 });
  b.add(rbox(0.65, 0.45, 0.6, 0.05), m.darkSteel, { x: -0.3, y: 2.85, z: -0.1 });
  b.add(cyl(0.06, 0.06, 0.7, 8), m.darkSteel, { x: -0.5, y: 3.2, z: 0.35 });
  b.add(cyl(0.09, 0.06, 0.08, 8), m.rust, { x: -0.5, y: 3.55, z: 0.35 });
  b.add(cyl(0.18, 0.18, 0.3, 12), m.steel, { x: 0.3, y: 2.8, z: 0.3 });
  // oluk
  b.add(rbox(0.75, 0.08, 0.55, 0.02), m.yellow, { x: 0.7, y: 0.75, rz: -0.45 });
  b.add(box(0.75, 0.25, 0.04), m.yellow, { x: 0.7, y: 0.84, z: 0.27, rz: -0.45 });
  b.add(box(0.75, 0.25, 0.04), m.yellow, { x: 0.7, y: 0.84, z: -0.27, rz: -0.45 });
  b.add(box(0.12, 0.12, 0.12), m.glowLight, { x: 0.69, y: 2.45, z: 0.45 }, 'status');
  // dönen matkap
  b.add(cyl(0.12, 0.12, 2.0, 8), m.steel, { y: 1.0 }, 'drill', [0, 0, 0]);
  b.add(cyl(0.32, 0.05, 0.5, 6), m.darkSteel, { y: 0.25 }, 'drill', [0, 0, 0]);
  for (let i = 0; i < 6; i++) b.add(box(0.5, 0.05, 0.12), m.steel, { y: 0.55 + i * 0.22, ry: i * 1.05 }, 'drill', [0, 0, 0]);
  return b.build();
}

function mAssembler(m) {
  const b = new Builder();
  b.add(rbox(1.9, 0.18, 1.9, 0.05), m.concreteDark, { y: 0.09 });
  b.add(rbox(1.6, 1.0, 1.6, 0.1), m.gray, { y: 0.68 });
  for (const z of [-0.81, 0.81]) for (let i = 0; i < 4; i++) b.add(box(0.9, 0.05, 0.02), m.darkSteel, { x: -0.1, y: 0.45 + i * 0.12, z });
  b.add(rbox(1.0, 0.4, 1.0, 0.05), m.glass, { y: 1.35 });
  b.add(rbox(1.08, 0.06, 1.08, 0.02), m.darkSteel, { y: 1.57 });
  b.add(rbox(0.3, 0.5, 0.9, 0.04), m.darkSteel, { x: 0.82, y: 0.45 });
  b.add(box(0.06, 0.28, 0.6), m.rubber, { x: 0.98, y: 0.45 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.81, y: 1.05, z: 0.6 }, 'status');
  // robot kol
  const P = [0, 1.6, 0];
  b.add(cyl(0.18, 0.22, 0.2, 12), m.yellow, { y: 0.1 }, 'arm', P);
  b.add(rbox(0.16, 0.7, 0.16, 0.04), m.yellow, { y: 0.45, x: 0.1, rz: -0.3 }, 'arm', P);
  b.add(rbox(0.6, 0.13, 0.13, 0.04), m.yellow, { y: 0.78, x: 0.42 }, 'arm', P);
  b.add(cyl(0.05, 0.05, 0.3, 8), m.darkSteel, { y: 0.62, x: 0.7 }, 'arm', P);
  b.add(cyl(0.08, 0.08, 0.2, 10), m.darkSteel, { y: 0.78, x: 0.15, rx: Math.PI / 2 }, 'arm', P);
  return b.build();
}

function mFoundry(m) {
  const b = new Builder();
  b.add(rbox(1.9, 0.2, 1.9, 0.05), m.concreteDark, { y: 0.1 });
  b.add(cyl(0.72, 0.8, 1.4, 20), m.rust, { x: -0.15, y: 0.9 });
  for (const y of [0.5, 0.95, 1.4]) b.add(cyl(0.82, 0.82, 0.08, 20), m.darkSteel, { x: -0.15, y });
  b.add(cyl(0.3, 0.75, 0.5, 20), m.darkSteel, { x: -0.15, y: 1.85 });
  b.add(cyl(0.67, 0.67, 0.04, 20), m.glowFurnace, { x: -0.15, y: 1.61 }, 'furnace');
  b.add(cyl(0.15, 0.18, 1.6, 12), m.darkSteel, { x: -0.15, y: 2.8 });
  b.add(cyl(0.12, 0.15, 2.4, 12), m.darkSteel, { x: -0.7, y: 1.4, z: 0.62 });
  b.add(rbox(0.6, 0.12, 0.3, 0.03), m.darkSteel, { x: 0.65, y: 0.95, rz: -0.35 });
  b.add(box(0.5, 0.06, 0.18), m.glowFurnace, { x: 0.66, y: 1.01, rz: -0.35 }, 'furnace');
  for (const x of [-0.8, 0.6]) for (const z of [-0.8, 0.8]) b.add(box(0.1, 1.6, 0.1), m.steel, { x, y: 0.9, z });
  b.add(box(1.5, 0.08, 0.1), m.steel, { x: -0.1, y: 1.7, z: 0.8 });
  b.add(box(1.5, 0.08, 0.1), m.steel, { x: -0.1, y: 1.7, z: -0.8 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.65, y: 1.5, z: -0.8 }, 'status');
  return b.build();
}

function mGenerator(m) {
  const b = new Builder();
  b.add(rbox(1.9, 0.18, 1.9, 0.05), m.concreteDark, { y: 0.09 });
  b.add(rbox(1.3, 1.0, 1.6, 0.08), m.gray, { x: -0.2, y: 0.68 });
  b.add(box(1.32, 0.12, 1.62), m.hazard, { x: -0.2, y: 0.3 });
  b.add(cyl(0.55, 0.55, 0.22, 20), m.darkSteel, { x: -0.2, y: 1.28 });
  b.add(cyl(0.05, 0.05, 0.25, 8), m.steel, { x: -0.2, y: 1.42 });
  for (let i = 0; i < 5; i++) b.add(box(0.48, 0.02, 0.12), m.blade, { y: 0, rx: 0.4, ry: i * Math.PI * 2 / 5 }, 'fan', [-0.2, 1.42, 0]);
  b.add(cyl(0.12, 0.14, 1.8, 12), m.darkSteel, { x: 0.55, y: 1.2, z: 0.55 });
  b.add(cyl(0.15, 0.15, 0.08, 12), m.rust, { x: 0.55, y: 2.1, z: 0.55 });
  for (let i = 0; i < 3; i++) b.add(cyl(0.12, 0.12, 0.6, 12), m.copper, { x: 0.65, y: 0.5 + i * 0.25, z: -0.45, rx: Math.PI / 2 });
  b.add(rbox(0.3, 0.6, 0.3, 0.04), m.darkSteel, { x: 0.6, y: 0.48, z: 0.0 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.47, y: 1.0, z: -0.75 }, 'status');
  return b.build();
}

function mSolar(m) {
  const b = new Builder();
  b.add(rbox(0.6, 0.2, 0.6, 0.04), m.concrete, { y: 0.1 });
  b.add(cyl(0.08, 0.1, 0.9, 10), m.steel, { y: 0.6 });
  b.add(rbox(1.84, 0.06, 1.84, 0.02), m.darkSteel, { y: 1.05, rz: 0.38 });
  b.add(box(1.76, 0.02, 1.76), m.solar, { y: 1.09, rz: 0.38, x: -0.015 });
  b.add(box(0.06, 0.06, 1.2), m.steel, { y: 0.95, rz: 0.38 });
  return b.build();
}

function mSplitter(m) {
  const b = new Builder();
  b.add(rbox(1.7, 0.5, 1.7, 0.08), m.darkSteel, { y: 0.25 });
  b.add(rbox(1.5, 0.08, 1.5, 0.03), m.hazard, { y: 0.52 });
  b.add(cyl(0.35, 0.4, 0.25, 16), m.steel, { y: 0.66 });
  for (let d = 0; d < 4; d++) {
    const a = d * Math.PI / 2;
    b.add(box(0.22, 0.05, 0.22), m.glowLight, { x: Math.cos(a) * 0.62, y: 0.57, z: -Math.sin(a) * 0.62, ry: Math.PI / 4 }, 'status');
  }
  return b.build();
}

function mWall(m) {
  const b = new Builder();
  b.add(rbox(1.96, 1.5, 1.96, 0.08), m.concrete, { y: 0.75 });
  b.add(rbox(2.0, 0.22, 2.0, 0.05), m.concreteDark, { y: 0.11 });
  b.add(rbox(1.7, 0.12, 1.7, 0.04), m.concreteDark, { y: 1.55 });
  return b.build();
}

function turretBase(b, m, h = 0.55) {
  b.add(cyl(0.8, 0.95, h, 16), m.concrete, { y: h / 2 });
  b.add(cyl(0.62, 0.66, 0.22, 20), m.darkSteel, { y: h + 0.1 });
}
function mTurretMG(m) {
  const b = new Builder();
  turretBase(b, m);
  const P = [0, 0.75, 0];
  b.add(rbox(0.9, 0.48, 0.82, 0.08), m.accent, { y: 0.26 }, 'yaw', P);
  b.add(rbox(0.5, 0.12, 0.6, 0.04), m.darkSteel, { y: 0.55, x: -0.1 }, 'yaw', P);
  for (const z of [-0.14, 0.14]) {
    b.add(cyl(0.05, 0.05, 1.1, 8), m.darkSteel, { x: 0.85, y: 0.3, z, rz: Math.PI / 2 }, 'yaw', P);
    b.add(cyl(0.08, 0.08, 0.35, 8), m.darkSteel, { x: 0.5, y: 0.3, z, rz: Math.PI / 2 }, 'yaw', P);
  }
  b.add(rbox(0.35, 0.3, 0.25, 0.03), m.olive, { x: -0.25, y: 0.25, z: 0.52 }, 'yaw', P);
  b.add(box(0.08, 0.08, 0.08), m.glowLight, { x: 0.46, y: 0.45, z: -0.25 }, 'yawStatus', P);
  return b.build();
}
function mTurretCannon(m) {
  const b = new Builder();
  b.add(cyl(0.9, 1.0, 0.7, 8), m.concrete, { y: 0.35 });
  b.add(cyl(0.72, 0.75, 0.2, 20), m.darkSteel, { y: 0.8 });
  const P = [0, 0.95, 0];
  b.add(rbox(1.25, 0.6, 1.1, 0.12), m.accent, { y: 0.3, x: -0.1 }, 'yaw', P);
  b.add(rbox(0.6, 0.4, 0.9, 0.08), m.accent, { y: 0.3, x: 0.55, rz: -0.25 }, 'yaw', P);
  b.add(cyl(0.11, 0.13, 1.9, 12), m.darkSteel, { x: 1.35, y: 0.35, rz: Math.PI / 2 }, 'yaw', P);
  b.add(rbox(0.3, 0.26, 0.26, 0.04), m.darkSteel, { x: 2.25, y: 0.35 }, 'yaw', P);
  b.add(rbox(0.45, 0.2, 0.3, 0.04), m.darkSteel, { x: -0.5, y: 0.7, z: 0.25 }, 'yaw', P);
  b.add(box(0.08, 0.08, 0.08), m.glowLight, { x: 0.3, y: 0.62, z: -0.4 }, 'yawStatus', P);
  return b.build();
}
function mTurretLaser(m) {
  const b = new Builder();
  b.add(cyl(0.75, 0.9, 0.45, 16), m.concrete, { y: 0.22 });
  b.add(cyl(0.25, 0.35, 0.7, 12), m.steel, { y: 0.8 });
  const P = [0, 1.25, 0];
  b.add(sph(0.45, 20, 14), m.accent, { y: 0 }, 'yaw', P);
  b.add(cyl(0.16, 0.22, 0.65, 14), m.darkSteel, { x: 0.55, rz: Math.PI / 2 }, 'yaw', P);
  b.add(sph(0.13, 12, 10), m.glowLaser, { x: 0.9 }, 'yaw', P);
  for (const z of [-0.5, 0.5]) for (let i = 0; i < 4; i++) b.add(box(0.5, 0.04, 0.12), m.darkSteel, { x: -0.1, y: -0.15 + i * 0.1, z }, 'yaw', P);
  return b.build();
}

function mFactory(m) {
  const b = new Builder();
  b.add(rbox(3.9, 0.2, 3.9, 0.06), m.concreteDark, { y: 0.1 });
  b.add(rbox(3.0, 1.9, 3.2, 0.1), m.gray, { x: -0.35, y: 1.15 });
  const roof = new THREE.CylinderGeometry(1.62, 1.62, 3.1, 24, 1, false, 0, Math.PI);
  b.add(roof, m.darkSteel, { x: -0.35, y: 2.1, rz: Math.PI / 2, ry: 0 });
  b.add(new THREE.CylinderGeometry(1.62, 1.62, 3.1, 24, 1, false, 0, Math.PI), m.darkSteel, { x: -0.35, y: 2.1, rz: Math.PI / 2, rx: Math.PI });
  b.add(box(0.06, 1.5, 2.1), m.hazard, { x: 1.17, y: 0.95 });
  b.add(box(0.12, 0.2, 2.4), m.darkSteel, { x: 1.2, y: 1.8 });
  b.add(rbox(1.0, 1.2, 1.0, 0.06), m.accent, { x: 1.4, y: 0.8, z: -1.4 });
  b.add(rbox(1.0, 1.0, 1.0, 0.06), m.accent, { x: 1.4, y: 0.7, z: 1.4 });
  for (const z of [-1.2, 1.2]) {
    b.add(cyl(0.18, 0.22, 2.2, 12), m.darkSteel, { x: -1.6, y: 3.0, z });
    b.add(cyl(0.24, 0.24, 0.1, 12), m.rust, { x: -1.6, y: 4.1, z });
  }
  for (const z of [-1.62, 1.62]) b.add(box(2.6, 0.35, 0.02), m.glowWindow, { x: -0.35, y: 1.5, z }, 'window');
  b.add(box(0.02, 0.3, 0.6), m.glowWindow, { x: 1.91, y: 1.0, z: -1.4 }, 'window');
  // vinç
  b.add(box(0.12, 2.8, 0.12), m.yellow, { x: 1.7, y: 1.5, z: 0.6 });
  b.add(box(1.6, 0.1, 0.1), m.yellow, { x: 1.2, y: 2.9, z: 0.6 });
  b.add(cyl(0.02, 0.02, 1.2, 4), m.darkSteel, { x: 0.6, y: 2.3, z: 0.6 });
  for (let i = 0; i < 4; i++) b.add(box(0.5, 0.01, 0.12), m.hazard, { x: 1.6, y: 0.21, z: -0.9 + i * 0.6 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 1.21, y: 1.95, z: -1.0 }, 'status');
  return b.build();
}

function mHQ(m) {
  const b = new Builder();
  b.add(rbox(5.8, 0.3, 5.8, 0.08), m.concrete, { y: 0.15 });
  b.add(rbox(3.4, 1.8, 3.4, 0.12), m.gray, { y: 1.2 });
  b.add(rbox(3.5, 0.15, 3.5, 0.04), m.accent, { y: 2.15 });
  b.add(rbox(2.4, 1.2, 2.4, 0.1), m.accent, { y: 2.8 });
  b.add(rbox(2.5, 0.1, 2.5, 0.03), m.darkSteel, { y: 3.44 });
  for (const [x, z, ry] of [[1.71, 0, 0], [-1.71, 0, 0], [0, 1.71, Math.PI / 2], [0, -1.71, Math.PI / 2]]) {
    b.add(box(0.02, 0.4, 2.9), m.glowWindow, { x, y: 1.35, z, ry }, 'window');
  }
  for (const [x, z, ry] of [[1.21, 0, 0], [-1.21, 0, 0], [0, 1.21, Math.PI / 2], [0, -1.21, Math.PI / 2]]) {
    b.add(box(0.02, 0.3, 2.0), m.glowWindow, { x, y: 2.9, z, ry }, 'window');
  }
  // kule
  b.add(cyl(0.4, 0.5, 2.6, 14), m.steel, { x: -1.0, y: 4.5, z: -1.0 });
  b.add(rbox(1.1, 0.55, 1.1, 0.08), m.glass, { x: -1.0, y: 5.95, z: -1.0 });
  b.add(rbox(1.2, 0.1, 1.2, 0.03), m.darkSteel, { x: -1.0, y: 6.28, z: -1.0 });
  b.add(cyl(0.02, 0.02, 1.4, 4), m.steel, { x: -1.0, y: 7.0, z: -1.0 });
  b.add(sph(0.09, 8, 6), m.glowLight, { x: -1.0, y: 7.72, z: -1.0 }, 'beacon');
  // radar
  const RP = [0.9, 3.5, 0.9];
  b.add(cyl(0.08, 0.1, 0.9, 8), m.steel, { y: 0.45 }, 'spin', RP);
  const dish = new THREE.SphereGeometry(0.75, 20, 8, 0, Math.PI * 2, 0, 0.9);
  b.add(dish, m.steel, { y: 1.15, x: 0.15, rz: Math.PI / 2 + 0.5 }, 'spin', RP);
  b.add(cyl(0.03, 0.03, 0.6, 6), m.darkSteel, { y: 1.25, x: 0.35, rz: Math.PI / 2 + 0.5 }, 'spin', RP);
  // silolar
  for (const [x, z] of [[-2.25, 1.6], [-1.3, 2.3]]) {
    b.add(cyl(0.45, 0.45, 1.8, 16), m.steel, { x, y: 1.2, z });
    b.add(sph(0.45, 16, 8), m.steel, { x, y: 2.1, z, sy: 0.5 });
    b.add(cyl(0.47, 0.47, 0.1, 16), m.accent, { x, y: 1.6, z });
  }
  // iniş pisti
  b.add(cyl(1.0, 1.0, 0.08, 24), m.darkSteel, { x: 1.7, y: 0.34, z: -1.7 });
  b.add(cyl(0.85, 0.85, 0.02, 24), m.hazard, { x: 1.7, y: 0.39, z: -1.7 });
  // giriş
  b.add(rbox(0.6, 1.0, 1.4, 0.05), m.darkSteel, { x: 1.95, y: 0.8 });
  b.add(box(0.02, 0.7, 1.0), m.glowWindow, { x: 2.26, y: 0.75 }, 'window');
  for (const [x, z] of [[2.6, 2.6], [-2.6, -2.6], [2.6, -0.6], [-2.6, 0.2]]) b.add(cyl(0.05, 0.05, 0.4, 6), m.yellow, { x, y: 0.5, z });
  return b.build();
}

// iki nokta arasında ince kiriş (önceden dönüştürülmüş geometri)
const _Y = new THREE.Vector3(0, 1, 0);
function strut(b, mat, a, c, t = 0.06, anim = 'static', pivot = null) {
  const A = new THREE.Vector3(...a), C = new THREE.Vector3(...c);
  const d = C.clone().sub(A); const len = d.length();
  const g = new THREE.BoxGeometry(t, len, t);
  const q = new THREE.Quaternion().setFromUnitVectors(_Y, d.normalize());
  g.applyMatrix4(new THREE.Matrix4().compose(A.add(C).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1)));
  b.add(g, mat, {}, anim, pivot);
}
function pad(b, m, s = 1.9, h = 0.2, mat = m.concreteDark) { b.add(rbox(s, h, s, 0.05), mat, { y: h / 2 }); }

function mMinerMk2(m) {
  const b = new Builder();
  pad(b, m, 1.95, 0.3, m.concrete);
  for (const x of [-0.7, 0.7]) for (const z of [-0.7, 0.7]) b.add(rbox(0.22, 2.0, 0.22, 0.04), m.darkSteel, { x, y: 1.3, z });
  for (const z of [-0.7, 0.7]) strut(b, m.steel, [-0.7, 0.4, z], [0.7, 2.1, z], 0.08);
  for (const x of [-0.7, 0.7]) strut(b, m.steel, [x, 0.4, -0.7], [x, 2.1, 0.7], 0.08);
  b.add(rbox(1.6, 0.14, 1.6, 0.03), m.hazard, { y: 2.3 });
  b.add(rbox(1.5, 0.8, 1.5, 0.1), m.rust, { y: 2.75 });
  b.add(rbox(1.52, 0.1, 1.52, 0.03), m.yellow, { y: 3.0 });
  b.add(rbox(0.7, 0.5, 0.7, 0.05), m.darkSteel, { x: -0.3, y: 3.4, z: -0.2 });
  for (const z of [-0.15, 0.15]) b.add(cyl(0.06, 0.06, 0.8, 8), m.darkSteel, { x: -0.55, y: 3.8, z: 0.4 + z });
  b.add(cyl(0.22, 0.22, 0.35, 12), m.copper, { x: 0.35, y: 3.3, z: 0.35 });
  // oluk
  b.add(rbox(0.8, 0.08, 0.6, 0.02), m.yellow, { x: 0.72, y: 0.85, rz: -0.45 });
  for (const z of [-0.3, 0.3]) b.add(box(0.8, 0.28, 0.04), m.yellow, { x: 0.72, y: 0.95, z, rz: -0.45 });
  b.add(box(0.12, 0.12, 0.12), m.glowLight, { x: 0.76, y: 2.8, z: 0.5 }, 'status');
  const P = [0, 0, 0];
  b.add(cyl(0.16, 0.16, 2.3, 10), m.steel, { y: 1.15 }, 'drill', P);
  b.add(cyl(0.42, 0.06, 0.6, 8), m.rust, { y: 0.3 }, 'drill', P);
  for (let i = 0; i < 7; i++) b.add(box(0.62, 0.06, 0.14), m.darkSteel, { y: 0.6 + i * 0.22, ry: i * 0.9 }, 'drill', P);
  return b.build();
}

function mPumpjack(m) {
  const b = new Builder();
  pad(b, m, 1.9, 0.18);
  b.add(rbox(1.8, 0.12, 0.5, 0.03), m.darkSteel, { y: 0.24 });
  // samson direği
  for (const z of [-0.3, 0.3]) {
    strut(b, m.yellow, [-0.6, 0.3, z], [0, 1.95, z * 0.4], 0.1);
    strut(b, m.yellow, [0.45, 0.3, z], [0, 1.95, z * 0.4], 0.1);
  }
  b.add(cyl(0.08, 0.08, 0.4, 10), m.darkSteel, { y: 1.98, rx: Math.PI / 2 });
  // motor ve dişli kutusu
  b.add(rbox(0.5, 0.4, 0.4, 0.05), m.gray, { x: -0.65, y: 0.5 });
  b.add(cyl(0.18, 0.18, 0.3, 12), m.darkSteel, { x: -0.65, y: 0.85, rx: Math.PI / 2 });
  // kuyu başı
  b.add(cyl(0.12, 0.15, 0.35, 10), m.darkSteel, { x: 0.85, y: 0.4 });
  b.add(cyl(0.18, 0.18, 0.08, 10), m.rust, { x: 0.85, y: 0.58 });
  b.add(cyl(0.05, 0.05, 0.6, 8), m.copper, { x: 0.6, y: 0.4, rz: Math.PI / 2 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: -0.4, y: 0.6, z: 0.22 }, 'status');
  // sallanan kiriş (pivot: dayanak noktası)
  const P = [0, 2.0, 0];
  b.add(rbox(2.2, 0.16, 0.16, 0.03), m.yellow, { x: 0.05 }, 'nod', P);
  b.add(rbox(0.28, 0.75, 0.24, 0.06), m.darkSteel, { x: 1.18, y: -0.18 }, 'nod', P);
  b.add(rbox(0.55, 0.42, 0.36, 0.06), m.darkSteel, { x: -1.05, y: -0.15 }, 'nod', P);
  b.add(cyl(0.025, 0.025, 1.3, 6), m.steel, { x: 0.85, y: -1.0 }, 'nod', P);
  return b.build();
}

function mSmelterIron(m) {
  const parts = new Builder();
  // eski eritme fırını + şarj köprüsü
  const b = parts;
  b.add(rbox(1.9, 0.2, 1.9, 0.05), m.concreteDark, { y: 0.1 });
  b.add(rbox(1.35, 1.3, 1.5, 0.1), m.brick, { x: -0.12, y: 0.85 });
  b.add(rbox(1.15, 0.35, 1.25, 0.06), m.darkSteel, { x: -0.15, y: 1.65 });
  b.add(cyl(0.2, 0.27, 2.4, 14), m.darkSteel, { x: -0.45, y: 2.7, z: -0.38 });
  for (const y of [2.0, 2.8, 3.6]) b.add(cyl(0.25, 0.25, 0.08, 14), m.rust, { x: -0.45, y, z: -0.38 });
  b.add(rbox(0.16, 0.75, 1.0, 0.03), m.darkSteel, { x: 0.58, y: 0.78 });
  b.add(box(0.05, 0.45, 0.72), m.glowFurnace, { x: 0.67, y: 0.75 }, 'furnace');
  b.add(rbox(0.5, 0.08, 0.7, 0.02), m.steel, { x: 0.82, y: 0.42 });
  b.add(cyl(0.3, 0.38, 0.6, 14), m.rust, { x: 0.05, y: 2.1, z: 0.3 });
  strut(b, m.steel, [-0.9, 0.2, 0.75], [0.0, 2.4, 0.4], 0.14);
  strut(b, m.steel, [-0.9, 0.2, 0.55], [-0.9, 1.3, 0.55], 0.08);
  b.add(cyl(0.06, 0.06, 1.3, 8), m.copper, { x: 0.25, y: 1.0, z: 0.78, rx: Math.PI / 2, rz: Math.PI / 2 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.6, y: 1.45, z: -0.6 }, 'status');
  return b.build();
}

function mSmelterCopper(m) {
  const b = new Builder();
  pad(b, m);
  b.add(cyl(0.8, 0.88, 1.0, 20), m.brick, { x: -0.1, y: 0.7 });
  b.add(cyl(0.84, 0.84, 0.1, 20), m.patina, { x: -0.1, y: 1.22 });
  b.add(cyl(0.22, 0.84, 0.55, 20), m.patina, { x: -0.1, y: 1.55 });
  b.add(cyl(0.16, 0.2, 1.1, 12), m.patina, { x: -0.4, y: 1.9, z: 0.4 });
  b.add(cyl(0.2, 0.2, 0.08, 12), m.copper, { x: -0.4, y: 2.45, z: 0.4 });
  b.add(rbox(0.3, 0.6, 0.7, 0.04), m.darkSteel, { x: 0.68, y: 0.65 });
  b.add(box(0.05, 0.35, 0.5), m.glowFurnace, { x: 0.84, y: 0.65 }, 'furnace');
  b.add(rbox(0.6, 0.06, 0.18, 0.02), m.copper, { x: 0.8, y: 0.35, rz: -0.25 });
  for (const a of [0.6, 2.2, 3.8]) b.add(cyl(0.03, 0.03, 1.0, 6), m.darkSteel, { x: -0.1 + Math.cos(a) * 0.89, y: 0.7, z: Math.sin(a) * 0.89 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.55, y: 1.1, z: -0.55 }, 'status');
  return b.build();
}

function mKiln(m) {
  const b = new Builder();
  pad(b, m);
  b.add(cyl(0.9, 0.92, 0.35, 20), m.concrete, { y: 0.37 });
  b.add(new THREE.SphereGeometry(0.88, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), m.brick, { y: 0.54 });
  for (let i = 0; i < 3; i++) b.add(new THREE.TorusGeometry(0.89 - i * 0.12, 0.025, 6, 24), m.rust, { y: 0.55 + i * 0.35 + (i ? 0.03 : 0), rx: Math.PI / 2, sx: 1 - i * 0.25, sy: 1 - i * 0.25 });
  // ağız
  b.add(rbox(0.3, 0.7, 0.7, 0.06), m.brick, { x: 0.78, y: 0.65 });
  b.add(new THREE.TorusGeometry(0.24, 0.05, 6, 12, Math.PI), m.rust, { x: 0.94, y: 0.62, ry: Math.PI / 2 });
  b.add(box(0.04, 0.4, 0.44), m.glowFurnace, { x: 0.94, y: 0.6 }, 'furnace');
  b.add(cyl(0.14, 0.18, 2.1, 12), m.brick, { x: -0.55, y: 1.55, z: -0.55 });
  b.add(cyl(0.18, 0.18, 0.08, 12), m.darkSteel, { x: -0.55, y: 2.6, z: -0.55 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.62, y: 1.05, z: 0.45 }, 'status');
  return b.build();
}

function mArcFurnace(m) {
  const b = new Builder();
  pad(b, m);
  b.add(cyl(0.7, 0.6, 0.9, 20), m.darkSteel, { x: 0.05, y: 0.65 });
  b.add(cyl(0.74, 0.74, 0.08, 20), m.rust, { x: 0.05, y: 1.1 });
  b.add(cyl(0.32, 0.72, 0.3, 20), m.gray, { x: 0.05, y: 1.28 });
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI * 2 / 3;
    const x = 0.05 + Math.cos(a) * 0.2, z = Math.sin(a) * 0.2;
    b.add(cyl(0.065, 0.065, 1.3, 8), m.graphite, { x, y: 1.95, z });
    b.add(box(0.95, 0.07, 0.07), m.copper, { x: (x - 0.75) / 2 - 0.05, y: 2.4 + i * 0.12, z, });
  }
  b.add(sph(0.16, 10, 8), m.glowLight, { x: 0.05, y: 1.45 }, 'arc');
  b.add(rbox(0.16, 2.4, 0.16, 0.03), m.yellow, { x: -0.8, y: 1.4 });
  b.add(rbox(0.5, 0.6, 0.45, 0.05), m.gray, { x: -0.6, y: 0.5, z: 0.62 });
  for (let i = 0; i < 3; i++) b.add(box(0.02, 0.4, 0.08), m.darkSteel, { x: -0.34, y: 0.5, z: 0.48 + i * 0.13 });
  strut(b, m.darkSteel, [-0.25, 1.35, -0.25], [-0.6, 1.9, -0.6], 0.16);
  b.add(cyl(0.14, 0.16, 1.4, 12), m.darkSteel, { x: -0.65, y: 2.3, z: -0.65 });
  b.add(rbox(0.5, 0.08, 0.2, 0.02), m.rust, { x: 0.78, y: 0.55, rz: -0.3 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: -0.3, y: 0.85, z: 0.85 }, 'status');
  return b.build();
}

function mAluSmelter(m) {
  const b = new Builder();
  pad(b, m);
  for (const z of [-0.55, 0, 0.55]) {
    b.add(rbox(1.25, 0.5, 0.42, 0.05), m.darkSteel, { x: 0.05, y: 0.45, z });
    b.add(box(1.0, 0.04, 0.26), m.glowFurnace, { x: 0.05, y: 0.71, z }, 'furnace');
    b.add(rbox(1.05, 0.08, 0.32, 0.02), m.gray, { x: 0.05, y: 0.82, z });
    for (const x of [-0.35, 0, 0.35]) b.add(cyl(0.04, 0.04, 0.3, 6), m.graphite, { x: x + 0.05, y: 0.97, z });
  }
  for (const x of [-0.65, 0.75]) b.add(box(0.1, 0.1, 1.7), m.copper, { x, y: 0.6 });
  b.add(box(0.08, 0.08, 1.7), m.copper, { x: 0.05, y: 1.14 });
  // köprü vinç
  for (const z of [-0.85, 0.85]) {
    b.add(box(0.1, 1.7, 0.1), m.yellow, { x: -0.8, y: 1.0, z });
    b.add(box(0.1, 1.7, 0.1), m.yellow, { x: 0.85, y: 1.0, z });
    b.add(box(1.75, 0.12, 0.1), m.yellow, { x: 0.02, y: 1.85, z });
  }
  b.add(box(0.3, 0.14, 1.8), m.yellow, { x: 0.3, y: 1.95 });
  b.add(cyl(0.12, 0.14, 2.5, 12), m.darkSteel, { x: -0.78, y: 1.35, z: -0.0 });
  b.add(cyl(0.16, 0.16, 0.08, 12), m.rust, { x: -0.78, y: 2.6, z: 0 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.86, y: 1.4, z: 0.6 }, 'status');
  return b.build();
}

function armParts(b, m, P, rot = 0) {
  b.add(cyl(0.2, 0.25, 0.22, 12), m.yellow, { y: 0.11 }, 'arm', P);
  b.add(rbox(0.18, 0.8, 0.18, 0.04), m.yellow, { y: 0.5, x: 0.12 * Math.cos(rot), z: -0.12 * Math.sin(rot), rz: -0.3 * Math.cos(rot), rx: -0.3 * Math.sin(rot) }, 'arm', P);
  b.add(rbox(0.7, 0.14, 0.14, 0.04), m.yellow, { y: 0.88, x: 0.45 * Math.cos(rot), z: -0.45 * Math.sin(rot), ry: rot }, 'arm', P);
  b.add(cyl(0.05, 0.05, 0.35, 8), m.darkSteel, { y: 0.7, x: 0.78 * Math.cos(rot), z: -0.78 * Math.sin(rot) }, 'arm', P);
  b.add(cyl(0.09, 0.09, 0.22, 10), m.darkSteel, { y: 0.88, x: 0.15 * Math.cos(rot), z: -0.15 * Math.sin(rot), rx: Math.PI / 2, ry: rot }, 'arm', P);
}
function mAdvAssembler(m) {
  const b = new Builder();
  pad(b, m, 3.9, 0.2);
  b.add(rbox(3.4, 0.2, 3.4, 0.05), m.gray, { y: 0.3 });
  // konveyör
  b.add(box(3.3, 0.06, 0.6), m.belt, { y: 0.5 }, 'belt');
  for (const z of [-0.34, 0.34]) b.add(box(3.3, 0.14, 0.08), m.darkSteel, { y: 0.47, z });
  // iskelet ve cam duvarlar
  for (const x of [-1.65, 1.65]) for (const z of [-1.65, 1.65]) b.add(rbox(0.16, 2.2, 0.16, 0.03), m.darkSteel, { x, y: 1.3, z });
  for (const z of [-1.65, 1.65]) { b.add(box(3.3, 0.14, 0.14), m.darkSteel, { y: 2.4, z }); b.add(box(3.2, 1.2, 0.04), m.glass, { y: 1.0, z }); b.add(box(3.3, 0.1, 0.1), m.hazard, { y: 0.4, z }); }
  for (const x of [-1.65, 1.65]) b.add(box(0.14, 0.14, 3.3), m.darkSteel, { x, y: 2.4 });
  b.add(box(0.14, 0.14, 3.3), m.yellow, { x: 0, y: 2.4 });
  b.add(box(0.04, 1.2, 1.4), m.glass, { x: -1.65, y: 1.0, z: 0.9 });
  b.add(rbox(0.7, 1.0, 1.2, 0.05), m.accent, { x: -1.35, y: 0.85, z: -0.9 });
  b.add(box(0.02, 0.25, 0.8), m.glowWindow, { x: -0.99, y: 1.05, z: -0.9 }, 'window');
  // çıkış ağzı
  b.add(rbox(0.5, 0.7, 0.9, 0.05), m.darkSteel, { x: 1.7, y: 0.65 });
  b.add(box(0.04, 0.4, 0.6), m.rubber, { x: 1.96, y: 0.6 });
  for (let i = 0; i < 3; i++) b.add(box(0.05, 0.05, 0.05), m.darkSteel, { x: -0.8 + i * 0.6, y: 0.56 });
  armParts(b, m, [-0.6, 0.35, 0.95], -Math.PI / 2);
  armParts(b, m, [0.6, 0.35, -0.95], Math.PI / 2);
  b.add(box(0.12, 0.12, 0.12), m.glowLight, { x: 1.7, y: 1.1, z: 0.35 }, 'status');
  return b.build();
}

function mRefinery(m) {
  const b = new Builder();
  pad(b, m, 3.9, 0.2);
  // damıtma kolonları
  for (const [x, z, r, h] of [[-1.0, -0.9, 0.34, 4.2], [-0.15, -1.15, 0.26, 3.2], [0.55, -1.25, 0.2, 2.4]]) {
    b.add(cyl(r, r, h, 16), m.white, { x, y: 0.2 + h / 2, z });
    b.add(sph(r, 16, 8), m.white, { x, y: 0.2 + h, z, sy: 0.5 });
    for (let y = 0.9; y < h; y += 0.9) {
      b.add(cyl(r + 0.12, r + 0.12, 0.04, 16), m.darkSteel, { x, y: y + 0.2, z });
      b.add(new THREE.TorusGeometry(r + 0.12, 0.015, 4, 16), m.yellow, { x, y: y + 0.45, z, rx: Math.PI / 2 });
    }
    b.add(rbox(0.1, h - 0.3, 0.1, 0.02), m.yellow, { x: x + r + 0.08, y: 0.2 + (h - 0.3) / 2, z });
  }
  // küresel tank
  for (const [x, z] of [[0.95, 0.95]]) {
    b.add(sph(0.62, 18, 12), m.white, { x, y: 1.05, z });
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.6; b.add(cyl(0.05, 0.05, 1.0, 6), m.steel, { x: x + Math.cos(a) * 0.5, y: 0.6, z: z + Math.sin(a) * 0.5 }); }
  }
  // yatay tank
  b.add(cyl(0.32, 0.32, 1.5, 16), m.gray, { x: -0.6, y: 0.62, z: 0.95, rz: Math.PI / 2 });
  for (const x of [-1.35, 0.15]) b.add(sph(0.32, 12, 8), m.gray, { x, y: 0.62, z: 0.95, sx: 0.4 });
  // boru rafı
  for (const x of [-1.4, -0.3, 0.8]) for (const z of [-0.05, 0.35]) b.add(box(0.08, 1.4, 0.08), m.steel, { x, y: 0.9, z });
  for (const z of [-0.05, 0.35]) b.add(box(2.3, 0.08, 0.08), m.steel, { x: -0.3, y: 1.6, z });
  b.add(cyl(0.06, 0.06, 2.6, 8), m.copper, { x: -0.3, y: 1.72, z: 0.05, rz: Math.PI / 2 });
  b.add(cyl(0.06, 0.06, 2.6, 8), m.darkSteel, { x: -0.3, y: 1.72, z: 0.2, rz: Math.PI / 2 });
  b.add(cyl(0.05, 0.05, 2.6, 8), m.rust, { x: -0.3, y: 1.72, z: 0.32, rz: Math.PI / 2 });
  // ısıtıcı fırın
  b.add(rbox(0.7, 0.8, 0.6, 0.05), m.brick, { x: 1.3, y: 0.6, z: -0.3 });
  b.add(box(0.04, 0.3, 0.4), m.glowFurnace, { x: 1.66, y: 0.5, z: -0.3 }, 'furnace');
  // meşale bacası
  b.add(cyl(0.07, 0.1, 4.4, 8), m.darkSteel, { x: -1.55, y: 2.4, z: 1.55 });
  b.add(cyl(0.11, 0.08, 0.15, 8), m.rust, { x: -1.55, y: 4.65, z: 1.55 });
  for (const s of [-1, 1]) strut(b, m.steel, [-1.55 + s * 0.3, 0.2, 1.55], [-1.55, 3.0, 1.55], 0.04);
  b.add(box(0.12, 0.12, 0.12), m.glowLight, { x: 1.66, y: 1.1, z: 0.0 }, 'status');
  return b.build();
}

function mChemPlant(m) {
  const b = new Builder();
  pad(b, m);
  for (const z of [-0.5, 0.45]) {
    b.add(cyl(0.34, 0.34, 1.3, 16), m.white, { x: -0.5, y: 0.85, z });
    b.add(sph(0.34, 16, 8), m.white, { x: -0.5, y: 1.5, z, sy: 0.45 });
    b.add(cyl(0.36, 0.36, 0.06, 16), m.yellow, { x: -0.5, y: 1.15, z });
  }
  // cam reaktör kabı
  b.add(cyl(0.4, 0.4, 0.15, 16), m.steel, { x: 0.38, y: 0.32 });
  b.add(cyl(0.36, 0.36, 0.8, 16), m.glass, { x: 0.38, y: 0.8 });
  b.add(cyl(0.38, 0.4, 0.14, 16), m.steel, { x: 0.38, y: 1.27 });
  b.add(cyl(0.3, 0.3, 0.62, 12), m.patina, { x: 0.38, y: 0.72 });
  const P = [0.38, 1.34, 0];
  b.add(rbox(0.22, 0.25, 0.22, 0.04), m.darkSteel, { y: 0.15 }, 'spin', P);
  b.add(box(0.36, 0.05, 0.05), m.steel, { y: 0.3 }, 'spin', P);
  // borular
  b.add(cyl(0.05, 0.05, 0.9, 8), m.copper, { x: -0.05, y: 1.35, z: -0.5, rz: Math.PI / 2 });
  b.add(cyl(0.05, 0.05, 0.9, 8), m.copper, { x: -0.05, y: 1.15, z: 0.45, rz: Math.PI / 2 });
  b.add(cyl(0.05, 0.05, 1.0, 8), m.steel, { x: 0.38, y: 1.6, z: -0.1, rx: Math.PI / 2 });
  b.add(cyl(0.11, 0.13, 2.1, 10), m.darkSteel, { x: -0.85, y: 1.25, z: -0.05 });
  b.add(cyl(0.14, 0.14, 0.08, 10), m.yellow, { x: -0.85, y: 2.3, z: -0.05 });
  b.add(rbox(0.3, 0.45, 0.5, 0.04), m.gray, { x: 0.78, y: 0.45, z: 0.55 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.94, y: 0.6, z: 0.45 }, 'status');
  return b.build();
}

function mEnricher(m) {
  const b = new Builder();
  pad(b, m);
  b.add(rbox(1.6, 0.1, 1.6, 0.03), m.hazard, { y: 0.25 });
  for (const x of [-0.6, -0.12]) for (const z of [-0.55, 0, 0.55]) {
    const P = [x, 0, z];
    b.add(cyl(0.15, 0.15, 1.55, 14), m.white, { y: 1.07 }, 'spinFast', P);
    b.add(cyl(0.155, 0.155, 0.08, 14), m.darkSteel, { y: 1.3 }, 'spinFast', P);
    b.add(box(0.04, 1.2, 0.05), m.blueSteel, { x: 0.14, y: 1.05 }, 'spinFast', P);
    b.add(cyl(0.17, 0.19, 0.2, 14), m.darkSteel, { x, y: 0.38, z });
  }
  for (const x of [-0.6, -0.12]) b.add(cyl(0.04, 0.04, 1.4, 6), m.steel, { x, y: 1.95, rx: Math.PI / 2 });
  b.add(cyl(0.04, 0.04, 0.6, 6), m.steel, { x: -0.36, y: 1.95, rz: Math.PI / 2 });
  b.add(rbox(0.5, 1.1, 1.3, 0.05), m.gray, { x: 0.62, y: 0.8 });
  b.add(box(0.02, 0.3, 0.9), m.glowWindow, { x: 0.88, y: 1.0 }, 'window');
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.88, y: 1.4, z: 0.5 }, 'status');
  return b.build();
}

function mPole(m) {
  const b = new Builder();
  b.add(cyl(0.25, 0.3, 0.2, 10), m.concrete, { y: 0.1 });
  b.add(cyl(0.07, 0.1, 3.2, 8), m.darkSteel, { y: 1.75 });
  b.add(box(0.1, 0.1, 1.2), m.darkSteel, { y: 3.05 });
  for (const z of [-0.5, 0.5]) strut(b, m.steel, [0, 2.6, 0], [0, 3.0, z * 0.8], 0.04);
  for (const [z, y] of [[-0.5, 3.15], [0.5, 3.15], [0, 3.45]]) {
    b.add(cyl(0.05, 0.05, 0.14, 8), m.insulator, { y, z });
    b.add(cyl(0.07, 0.07, 0.03, 8), m.insulator, { y: y - 0.03, z });
  }
  b.add(rbox(0.18, 0.22, 0.12, 0.02), m.gray, { y: 2.2, x: 0.1 });
  return b.build();
}

function mPoleBig(m) {
  const b = new Builder();
  for (const x of [-0.75, 0.75]) for (const z of [-0.75, 0.75]) {
    b.add(rbox(0.35, 0.25, 0.35, 0.04), m.concrete, { x, y: 0.12, z });
    strut(b, m.steel, [x, 0.2, z], [x * 0.25, 6.0, z * 0.25], 0.09);
  }
  const lv = [0.2, 1.6, 2.9, 4.0, 5.0, 6.0];
  const w = (y) => 0.75 + (0.1875 - 0.75) * (y - 0.2) / 5.8;
  for (let i = 0; i < lv.length - 1; i++) {
    const y0 = lv[i], y1 = lv[i + 1], a = w(y0), c = w(y1);
    for (const s of [-1, 1]) {
      strut(b, m.steel, [-a, y0, s * a], [c, y1, s * c], 0.04);
      strut(b, m.steel, [s * a, y0, -a], [s * c, y1, c], 0.04);
    }
    b.add(box(c * 2, 0.05, 0.05), m.steel, { y: y1, z: c }); b.add(box(c * 2, 0.05, 0.05), m.steel, { y: y1, z: -c });
    b.add(box(0.05, 0.05, c * 2), m.steel, { y: y1, x: c }); b.add(box(0.05, 0.05, c * 2), m.steel, { y: y1, x: -c });
  }
  // kollar
  for (const [y, L] of [[5.0, 1.5], [6.0, 1.0]]) {
    b.add(box(0.12, 0.12, L * 2), m.steel, { y });
    for (const s of [-1, 1]) {
      strut(b, m.steel, [0, y + 0.45, 0], [0, y, s * L], 0.05);
      b.add(cyl(0.05, 0.05, 0.4, 8), m.ceramic, { y: y - 0.25, z: s * (L - 0.1) });
      for (let k = 0; k < 3; k++) b.add(cyl(0.09, 0.09, 0.025, 8), m.ceramic, { y: y - 0.12 - k * 0.11, z: s * (L - 0.1) });
    }
  }
  b.add(cyl(0.02, 0.02, 0.7, 4), m.steel, { y: 6.5 });
  b.add(sph(0.06, 6, 4), m.glowLight, { y: 6.85 }, 'beacon');
  return b.build();
}

function mGenFuel(m) {
  const b = new Builder();
  pad(b, m);
  b.add(rbox(1.5, 0.15, 1.1, 0.03), m.darkSteel, { y: 0.27 });
  b.add(rbox(1.4, 0.85, 1.0, 0.08), m.yellow, { x: 0.05, y: 0.77 });
  for (let i = 0; i < 6; i++) b.add(box(0.02, 0.5, 0.06), m.darkSteel, { x: 0.76, y: 0.78, z: -0.35 + i * 0.14 });
  b.add(box(1.0, 0.04, 1.02), m.hazard, { x: -0.1, y: 0.4 });
  b.add(cyl(0.38, 0.38, 0.1, 18), m.darkSteel, { x: 0.35, y: 1.24 });
  for (let i = 0; i < 6; i++) b.add(box(0.33, 0.02, 0.1), m.blade, { rx: 0.4, ry: i * Math.PI / 3 }, 'fan', [0.35, 1.3, 0]);
  b.add(cyl(0.3, 0.3, 1.5, 16), m.rust, { x: 0, y: 0.45, z: 0.75, rz: Math.PI / 2, sx: 0.8 });
  for (const z of [-0.55, -0.25]) {
    b.add(cyl(0.07, 0.08, 1.0, 8), m.darkSteel, { x: -0.6, y: 1.55, z });
    b.add(cyl(0.09, 0.09, 0.06, 8), m.rust, { x: -0.6, y: 2.05, z });
  }
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.76, y: 1.05, z: 0.4 }, 'status');
  return b.build();
}

function mWind(m) {
  const b = new Builder();
  b.add(cyl(0.55, 0.65, 0.25, 16), m.concrete, { y: 0.12 });
  b.add(cyl(0.11, 0.22, 5.3, 14), m.white, { y: 2.9 });
  b.add(rbox(0.25, 0.4, 0.2, 0.04), m.gray, { x: 0.22, y: 0.5 });
  b.add(rbox(0.9, 0.36, 0.36, 0.1), m.white, { x: -0.12, y: 5.62 });
  b.add(box(0.5, 0.02, 0.1), m.hazard, { x: -0.2, y: 5.81 });
  b.add(box(0.06, 0.06, 0.06), m.glowLight, { x: -0.5, y: 5.84 }, 'beacon');
  const P = [0.4, 5.62, 0];
  b.add(sph(0.15, 12, 8), m.white, { x: 0.05, sx: 1.4 }, 'rotorX', P);
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI * 2 / 3;
    b.add(rbox(0.05, 1.6, 0.17, 0.02), m.white, { x: 0.02, y: Math.cos(a) * 0.92, z: Math.sin(a) * 0.92, rx: a }, 'rotorX', P);
  }
  return b.build();
}

function mBatteryBank(m) {
  const b = new Builder();
  pad(b, m);
  for (const z of [-0.45, 0.45]) {
    b.add(rbox(1.3, 1.1, 0.7, 0.06), m.gray, { x: -0.15, y: 0.75, z });
    b.add(box(1.32, 0.06, 0.72), m.hazard, { x: -0.15, y: 0.26, z });
    for (let i = 0; i < 4; i++) b.add(box(0.03, 0.1, 0.5), m.glowLight, { x: 0.51, y: 0.45 + i * 0.18, z }, 'charge');
    b.add(rbox(1.0, 0.18, 0.5, 0.04), m.darkSteel, { x: -0.25, y: 1.4, z });
  }
  for (const z of [-0.45, 0.45]) for (const x of [-0.6, 0.1]) b.add(cyl(0.05, 0.05, 0.15, 8), m.copper, { x, y: 1.55, z: z + 0.15 });
  b.add(box(0.06, 0.06, 1.0), m.copper, { x: -0.25, y: 1.62 });
  b.add(cyl(0.2, 0.2, 0.08, 12), m.darkSteel, { x: -0.6, y: 1.55, z: -0.45 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.52, y: 1.2, z: 0 }, 'status');
  return b.build();
}

function mReactor(m) {
  const b = new Builder();
  pad(b, m, 3.9, 0.2);
  // soğutma kulesi
  const pts = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, y = t * 3.6;
    const r = 0.62 + 0.36 * Math.pow((t - 0.72) / 0.72, 2) * (t < 0.72 ? 1 : 0.4);
    pts.push(new THREE.Vector2(r, y));
  }
  b.add(new THREE.LatheGeometry(pts, 24), m.concreteDS, { x: -0.95, y: 0.15, z: -0.95 });
  b.add(cyl(0.68, 0.68, 0.05, 20), m.darkSteel, { x: -0.95, y: 3.2, z: -0.95 });
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; b.add(box(0.06, 0.4, 0.06), m.darkSteel, { x: -0.95 + Math.cos(a) * 0.98, y: 0.35, z: -0.95 + Math.sin(a) * 0.98 }); }
  // muhafaza kubbesi
  b.add(cyl(0.85, 0.88, 1.1, 24), m.concrete, { x: 0.85, y: 0.75, z: -0.85 });
  b.add(new THREE.SphereGeometry(0.85, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), m.concrete, { x: 0.85, y: 1.3, z: -0.85 });
  b.add(cyl(0.87, 0.87, 0.08, 24), m.yellow, { x: 0.85, y: 1.1, z: -0.85 });
  b.add(sph(0.08, 8, 6), m.glowLight, { x: 0.85, y: 2.2, z: -0.85 }, 'beacon');
  // türbin salonu
  b.add(rbox(1.9, 1.0, 1.1, 0.08), m.gray, { x: 0.35, y: 0.7, z: 0.95 });
  b.add(rbox(1.95, 0.1, 1.15, 0.03), m.darkSteel, { x: 0.35, y: 1.24, z: 0.95 });
  b.add(box(1.7, 0.2, 0.02), m.glowWindow, { x: 0.35, y: 0.9, z: 1.51 }, 'window');
  b.add(box(0.02, 0.2, 0.8), m.glowWindow, { x: 1.31, y: 0.9, z: 0.95 }, 'window');
  b.add(rbox(0.6, 0.6, 0.6, 0.05), m.accent, { x: -1.1, y: 0.5, z: 1.0 });
  // borular
  b.add(cyl(0.1, 0.1, 1.6, 10), m.steel, { x: -0.1, y: 0.6, z: -0.9, rz: Math.PI / 2 });
  b.add(cyl(0.09, 0.09, 1.0, 10), m.steel, { x: 0.85, y: 0.5, z: 0.0, rx: Math.PI / 2 });
  b.add(box(0.06, 0.12, 0.6), m.hazard, { x: 1.85, y: 0.3, z: -0.85 });
  b.add(box(0.12, 0.12, 0.12), m.glowLight, { x: 1.31, y: 1.15, z: 0.4 }, 'status');
  return b.build();
}

function mLamp(m) {
  const b = new Builder();
  b.add(cyl(0.28, 0.32, 0.2, 10), m.concrete, { y: 0.1 });
  b.add(cyl(0.06, 0.09, 3.4, 8), m.darkSteel, { y: 1.85 });
  b.add(box(0.7, 0.07, 0.1), m.darkSteel, { y: 3.5 });
  b.add(rbox(0.2, 0.3, 0.14, 0.02), m.gray, { y: 1.0, x: 0.09 });
  for (const s of [-1, 1]) {
    b.add(rbox(0.42, 0.24, 0.34, 0.05), m.darkSteel, { x: s * 0.3, y: 3.42, rz: s * -0.5 });
    b.add(box(0.03, 0.17, 0.27), m.glowLight, { x: s * 0.502, y: 3.31, rz: s * -0.5 }, 'lamp');
  }
  return b.build();
}

function mWallSteel(m) {
  const b = new Builder();
  b.add(rbox(2.0, 0.22, 2.0, 0.05), m.concreteDark, { y: 0.11 });
  b.add(rbox(1.9, 1.65, 1.9, 0.06), m.darkSteel, { y: 0.98 });
  for (const s of [-1, 1]) {
    b.add(box(1.94, 1.3, 0.06), m.steel, { y: 0.9, z: s * 0.96 });
    b.add(box(0.06, 1.3, 1.94), m.steel, { y: 0.9, x: s * 0.96 });
  }
  b.add(box(1.98, 0.14, 1.98), m.hazard, { y: 1.65 });
  b.add(rbox(1.7, 0.12, 1.7, 0.03), m.gray, { y: 1.85 });
  return b.build();
}

function mTurretMissile(m) {
  const b = new Builder();
  b.add(cyl(0.88, 1.0, 0.6, 8), m.concrete, { y: 0.3 });
  b.add(cyl(0.7, 0.74, 0.2, 20), m.darkSteel, { y: 0.7 });
  const P = [0, 0.95, 0];
  b.add(cyl(0.35, 0.4, 0.3, 14), m.darkSteel, { y: 0.0 }, 'yaw', P);
  for (const z of [-0.5, 0.5]) b.add(rbox(0.5, 0.6, 0.12, 0.03), m.darkSteel, { y: 0.35, z }, 'yaw', P);
  b.add(rbox(1.15, 0.72, 0.85, 0.08), m.accent, { x: -0.05, y: 0.55 }, 'yaw', P);
  b.add(box(0.04, 0.66, 0.79), m.darkSteel, { x: 0.53, y: 0.55 }, 'yaw', P);
  for (const y of [0.38, 0.72]) for (const z of [-0.25, 0, 0.25]) {
    b.add(cyl(0.1, 0.1, 0.06, 10), m.rubber, { x: 0.56, y, z, rz: Math.PI / 2 }, 'yaw', P);
    const cone = new THREE.ConeGeometry(0.07, 0.16, 8);
    b.add(cone, m.white, { x: 0.6, y, z, rz: -Math.PI / 2 }, 'yaw', P);
  }
  b.add(rbox(0.3, 0.2, 0.3, 0.03), m.olive, { x: -0.45, y: 1.0, z: 0.2 }, 'yaw', P);
  b.add(cyl(0.02, 0.02, 0.4, 4), m.steel, { x: -0.5, y: 1.1, z: -0.25 }, 'yaw', P);
  b.add(box(0.08, 0.08, 0.08), m.glowLight, { x: 0.3, y: 0.95, z: -0.38 }, 'yawStatus', P);
  return b.build();
}

// ---------------- birim modelleri ----------------
function mMech(m) {
  const b = new Builder();
  for (const z of [-0.28, 0.28]) {
    b.add(rbox(0.22, 0.7, 0.22, 0.05), m.darkSteel, { y: 0.45, z }, 'legs', [0, 0, 0]);
    b.add(rbox(0.4, 0.1, 0.26, 0.03), m.darkSteel, { y: 0.06, x: 0.05, z }, 'legs', [0, 0, 0]);
  }
  const P = [0, 0.95, 0];
  b.add(rbox(0.6, 0.5, 0.75, 0.08), m.accent, { y: 0.3 }, 'gun', P);
  b.add(rbox(0.3, 0.2, 0.4, 0.05), m.darkSteel, { x: 0.18, y: 0.6 }, 'gun', P);
  b.add(box(0.05, 0.06, 0.25), m.glowLaser, { x: 0.34, y: 0.62 }, 'gun', P);
  for (const z of [-0.48, 0.48]) {
    b.add(rbox(0.3, 0.3, 0.2, 0.04), m.darkSteel, { y: 0.32, z }, 'gun', P);
    b.add(cyl(0.05, 0.05, 0.7, 8), m.darkSteel, { x: 0.4, y: 0.3, z, rz: Math.PI / 2 }, 'gun', P);
  }
  return b.build();
}
function mTank(m) {
  const b = new Builder();
  b.add(rbox(1.6, 0.45, 1.0, 0.1), m.accent, { y: 0.48 }, 'body', [0, 0, 0]);
  for (const z of [-0.6, 0.6]) {
    b.add(rbox(1.75, 0.42, 0.32, 0.12), m.rubber, { y: 0.25, z }, 'body', [0, 0, 0]);
    b.add(rbox(1.5, 0.08, 0.36, 0.02), m.darkSteel, { y: 0.48, z }, 'body', [0, 0, 0]);
  }
  const P = [0, 0.72, 0];
  b.add(rbox(0.85, 0.35, 0.75, 0.1), m.accent, { y: 0.15, x: -0.1 }, 'gun', P);
  b.add(cyl(0.06, 0.07, 1.2, 10), m.darkSteel, { x: 0.85, y: 0.18, rz: Math.PI / 2 }, 'gun', P);
  b.add(cyl(0.09, 0.09, 0.15, 10), m.darkSteel, { x: 1.4, y: 0.18, rz: Math.PI / 2 }, 'gun', P);
  b.add(cyl(0.12, 0.12, 0.1, 10), m.darkSteel, { x: -0.2, y: 0.38, z: 0.18 }, 'gun', P);
  return b.build();
}
function mDrone(m, red = false) {
  const b = new Builder();
  const B = [0, 0, 0];
  b.add(rbox(red ? 0.8 : 0.6, 0.2, red ? 0.4 : 0.6, 0.06), m.accent, { y: 0 }, 'body', B);
  b.add(sph(0.12, 10, 8), m.glowLaser, { x: 0.3, y: -0.05 }, 'body', B);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * Math.PI / 2;
    const x = Math.cos(a) * 0.55, z = Math.sin(a) * 0.55;
    b.add(box(0.6, 0.05, 0.06), m.darkSteel, { x: x / 2, z: z / 2, ry: -a }, 'body', B);
    b.add(cyl(0.06, 0.06, 0.12, 8), m.darkSteel, { x, z, y: 0.05 }, 'body', B);
  }
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * Math.PI / 2;
    const x = Math.cos(a) * 0.55, z = Math.sin(a) * 0.55;
    b.add(box(0.48, 0.01, 0.06), m.blade, { y: 0 }, 'rotor' + i, [x, 0.12, z]);
  }
  return b.build();
}
function mRaider(m) {
  const b = new Builder();
  const B = [0, 0, 0];
  b.add(rbox(1.2, 0.25, 0.7, 0.06), m.rust, { y: 0.45 }, 'body', B);
  b.add(rbox(0.5, 0.2, 0.6, 0.05), m.accent, { y: 0.62, x: 0.35 }, 'body', B);
  for (const x of [-0.4, 0.42]) for (const z of [-0.42, 0.42]) b.add(cyl(0.22, 0.22, 0.16, 12), m.rubber, { x, y: 0.22, z, rx: Math.PI / 2 }, 'body', B);
  for (const z of [-0.3, 0.3]) b.add(box(0.05, 0.5, 0.05), m.darkSteel, { x: -0.1, y: 0.8, z, rz: 0.2 }, 'body', B);
  b.add(box(0.05, 0.05, 0.65), m.darkSteel, { x: -0.05, y: 1.04 }, 'body', B);
  const P = [-0.25, 0.75, 0];
  b.add(cyl(0.1, 0.1, 0.2, 8), m.darkSteel, { y: 0 }, 'gun', P);
  b.add(cyl(0.04, 0.04, 0.6, 6), m.darkSteel, { x: 0.3, y: 0.1, rz: Math.PI / 2 }, 'gun', P);
  return b.build();
}
function mBrute(m) {
  const b = new Builder();
  const B = [0, 0, 0];
  b.add(rbox(1.9, 0.6, 1.25, 0.12), m.rust, { y: 0.6 }, 'body', B);
  b.add(rbox(1.92, 0.1, 1.27, 0.02), m.accent, { y: 0.75 }, 'body', B);
  for (const z of [-0.72, 0.72]) b.add(rbox(2.0, 0.5, 0.36, 0.15), m.rubber, { y: 0.3, z }, 'body', B);
  b.add(rbox(0.3, 0.3, 1.0, 0.05), m.darkSteel, { x: 1.0, y: 0.45 }, 'body', B);
  const P = [-0.1, 0.95, 0];
  b.add(rbox(1.05, 0.45, 0.95, 0.1), m.rust, { y: 0.2 }, 'gun', P);
  b.add(cyl(0.1, 0.12, 1.5, 10), m.darkSteel, { x: 1.1, y: 0.22, rz: Math.PI / 2 }, 'gun', P);
  b.add(rbox(0.2, 0.2, 0.2, 0.03), m.darkSteel, { x: 1.85, y: 0.22 }, 'gun', P);
  return b.build();
}

// ---------------- eşyalar (konveyör üstü) ----------------
function merge(parts) {
  const ps = parts.map((p) => {
    const g = p.index ? p.toNonIndexed() : p;
    for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    return g;
  });
  return mergeGeometries(ps, false);
}
function itemGeo(shape) {
  switch (shape) {
    case 'ore': {
      const g = new THREE.IcosahedronGeometry(0.22, 0);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * (0.85 + Math.sin(i * 7.1) * 0.2), p.getY(i) * 0.8, p.getZ(i) * (0.9 + Math.cos(i * 3.3) * 0.2));
      g.computeVertexNormals(); g.translate(0, 0.16, 0); return g;
    }
    case 'crystal': { const g = new THREE.OctahedronGeometry(0.2, 0); g.scale(0.8, 1.4, 0.8); g.translate(0, 0.25, 0); return g; }
    case 'ingot': { const g = new RoundedBoxGeometry(0.45, 0.16, 0.24, 1, 0.04); g.translate(0, 0.08, 0); return g; }
    case 'block': { const g = new RoundedBoxGeometry(0.34, 0.26, 0.34, 1, 0.03); g.translate(0, 0.13, 0); return g; }
    case 'wafer': { const g = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 16); g.translate(0, 0.03, 0); return g; }
    case 'beam': { const g = new THREE.BoxGeometry(0.55, 0.14, 0.18); g.translate(0, 0.07, 0); return g; }
    case 'gear': { const g = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 10); g.translate(0, 0.04, 0); return g; }
    case 'spool': { const g = new THREE.TorusGeometry(0.15, 0.07, 8, 16); g.rotateX(Math.PI / 2); g.translate(0, 0.07, 0); return g; }
    case 'board': { const g = new THREE.BoxGeometry(0.4, 0.04, 0.3); g.translate(0, 0.02, 0); return g; }
    case 'crate': { const g = new RoundedBoxGeometry(0.34, 0.24, 0.26, 1, 0.03); g.translate(0, 0.12, 0); return g; }
    case 'motor': { const g = new THREE.CylinderGeometry(0.14, 0.14, 0.36, 12); g.rotateZ(Math.PI / 2); g.translate(0, 0.14, 0); return g; }
    case 'uore': {
      const parts = [];
      const base = new THREE.IcosahedronGeometry(0.18, 0); base.scale(1, 0.7, 0.9); base.translate(0, 0.12, 0); parts.push(base);
      for (const [x, z, r] of [[0.06, 0.04, 0.3], [-0.07, -0.03, -0.35], [0.0, -0.08, 0.1]]) {
        const c = new THREE.OctahedronGeometry(0.07, 0); c.scale(0.8, 2.0, 0.8); c.rotateZ(r); c.translate(x, 0.26, z); parts.push(c);
      }
      return merge(parts);
    }
    case 'barrel': {
      const parts = [new THREE.CylinderGeometry(0.17, 0.17, 0.4, 14)];
      for (const y of [-0.12, 0.12]) { const t = new THREE.TorusGeometry(0.17, 0.015, 4, 14); t.rotateX(Math.PI / 2); t.translate(0, y, 0); parts.push(t); }
      const g = merge(parts); g.translate(0, 0.2, 0); return g;
    }
    case 'plate': { const g = new RoundedBoxGeometry(0.42, 0.05, 0.3, 1, 0.015); g.translate(0, 0.03, 0); return g; }
    case 'pane': { const g = new THREE.BoxGeometry(0.4, 0.03, 0.3); g.rotateZ(0.12); g.translate(0, 0.05, 0); return g; }
    case 'sheet': {
      const parts = [];
      for (let i = 0; i < 3; i++) { const s = new THREE.BoxGeometry(0.38, 0.025, 0.28); s.rotateY(i * 0.15); s.translate(0, 0.015 + i * 0.03, 0); parts.push(s); }
      return merge(parts);
    }
    case 'cell': {
      const a = new THREE.CylinderGeometry(0.1, 0.1, 0.32, 14); a.translate(0, 0.16, 0);
      const c = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 8); c.translate(0, 0.34, 0);
      const g = merge([a, c]); g.rotateZ(Math.PI / 2); g.translate(0, 0.1, 0); return g;
    }
    case 'chip': {
      const parts = [new THREE.BoxGeometry(0.26, 0.05, 0.26)];
      for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
        const p1 = new THREE.BoxGeometry(0.03, 0.02, 0.06); p1.translate(-0.09 + i * 0.06, -0.01, s * 0.15); parts.push(p1);
        const p2 = new THREE.BoxGeometry(0.06, 0.02, 0.03); p2.translate(s * 0.15, -0.01, -0.09 + i * 0.06); parts.push(p2);
      }
      const g = merge(parts); g.translate(0, 0.04, 0); return g;
    }
    case 'rod': {
      const parts = [];
      for (const [x, z] of [[-0.05, -0.04], [0.05, -0.04], [0, 0.05]]) { const r = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8); r.rotateZ(Math.PI / 2); r.translate(0, 0.05, 0); r.translate(0, x * 0.6 + 0.02, z); parts.push(r); }
      return merge(parts);
    }
    case 'rocket': {
      const body = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 10);
      const nose = new THREE.ConeGeometry(0.06, 0.14, 10); nose.translate(0, 0.27, 0);
      const parts = [body, nose];
      for (let i = 0; i < 4; i++) { const f = new THREE.BoxGeometry(0.01, 0.1, 0.1); f.translate(0, -0.15, 0.08); f.rotateY(i * Math.PI / 2); parts.push(f); }
      const g = merge(parts); g.rotateZ(-Math.PI / 2); g.translate(0, 0.08, 0); return g;
    }
  }
  return new THREE.BoxGeometry(0.3, 0.3, 0.3);
}
export function itemModels() {
  const T = getTextures();
  const out = {};
  for (const [k, it] of Object.entries(ITEMS)) {
    const o = { color: it.color, roughness: 0.6, metalness: 0.1 };
    if (it.shape === 'ingot' || it.shape === 'beam' || it.shape === 'gear') { o.metalness = 0.9; o.roughness = 0.35; o.map = T.metal; }
    if (it.shape === 'ore') { o.roughness = 0.9; o.normalMap = T.concreteN; o.flatShading = true; }
    if (k === 'coal') { o.roughness = 0.45; o.metalness = 0.2; }
    if (it.shape === 'crystal') { o.roughness = 0.1; o.metalness = 0.1; o.emissive = new THREE.Color(0x3a6a8a); o.emissiveIntensity = 0.4; }
    if (it.shape === 'board') { o.map = T.circuit; o.color = 0xffffff; }
    if (it.shape === 'wafer') { o.metalness = 0.8; o.roughness = 0.15; }
    if (it.shape === 'crate') { o.map = T.metal; }
    if (it.shape === 'block') { o.map = T.concrete; }
    if (it.shape === 'uore' || it.shape === 'rod') { o.emissive = new THREE.Color(0x2fbf3a); o.emissiveIntensity = 0.8; o.roughness = 0.4; o.metalness = 0.2; }
    if (it.shape === 'uore') o.flatShading = true;
    if (it.shape === 'pane') { o.transparent = true; o.opacity = 0.6; o.roughness = 0.05; o.metalness = 0.1; }
    if (it.shape === 'barrel') { o.metalness = 0.55; o.roughness = 0.45; o.map = T.metal; }
    if (it.shape === 'plate') { o.metalness = 0.85; o.roughness = 0.4; o.map = T.metal; }
    if (it.shape === 'sheet') { o.roughness = 0.35; o.metalness = 0; }
    if (it.shape === 'chip') { o.metalness = 0.35; o.roughness = 0.4; }
    if (it.shape === 'cell') { o.metalness = 0.75; o.roughness = 0.3; }
    if (it.shape === 'rocket') { o.metalness = 0.6; o.roughness = 0.35; }
    out[k] = { geo: itemGeo(it.shape), mat: new THREE.MeshStandardMaterial(o) };
  }
  return out;
}

const BUILDERS = {
  belt: (m) => mBelt(m), belt_fast: (m) => mBelt(m, true), miner: mMiner, assembler: mAssembler, foundry: mFoundry,
  generator: mGenerator, solar: mSolar, splitter: mSplitter, wall: mWall,
  turret_mg: mTurretMG, turret_cannon: mTurretCannon, turret_laser: mTurretLaser,
  miner_mk2: mMinerMk2, pumpjack: mPumpjack, smelter_iron: mSmelterIron, smelter_copper: mSmelterCopper,
  kiln: mKiln, arc_furnace: mArcFurnace, alu_smelter: mAluSmelter, adv_assembler: mAdvAssembler,
  refinery: mRefinery, chem_plant: mChemPlant, enricher: mEnricher, pole: mPole, pole_big: mPoleBig,
  gen_fuel: mGenFuel, wind: mWind, battery_bank: mBatteryBank, reactor: mReactor, lamp: mLamp,
  wall_steel: mWallSteel, turret_missile: mTurretMissile,
  factory: mFactory, hq: mHQ,
  mech: mMech, tank: mTank, drone: (m) => mDrone(m), raider: mRaider, brute: mBrute, wasp: (m) => mDrone(m, true),
};
export const MODEL_META = {
  chimney: {
    smelter_iron: [[-0.45, 3.95, -0.38]], smelter_copper: [[-0.4, 2.5, 0.4]], kiln: [[-0.55, 2.65, -0.55]],
    arc_furnace: [[-0.65, 3.05, -0.65]], alu_smelter: [[-0.78, 2.65, 0]], foundry: [[-0.15, 3.65, 0]],
    generator: [[0.55, 2.2, 0.55]], gen_fuel: [[-0.6, 2.1, -0.55], [-0.6, 2.1, -0.25]],
    refinery: [[-1.55, 4.75, 1.55]], chem_plant: [[-0.85, 2.35, -0.05]],
    factory: [[-1.6, 4.2, -1.2], [-1.6, 4.2, 1.2]], reactor: [[-0.95, 3.8, -0.95]],
  },
  muzzle: { turret_missile: { py: 0.95, f: 0.65, u: 0.55 } },
};
const modelCache = {};
export function getModel(type) {
  if (!modelCache[type]) modelCache[type] = BUILDERS[type](materials());
  return modelCache[type];
}

// ---------------- çevre (ağaç, kaya, cevher) ----------------
export function treeGeos() {
  const trunk = new THREE.CylinderGeometry(0.09, 0.14, 1.2, 7);
  trunk.translate(0, 0.6, 0);
  const layers = [];
  for (let i = 0; i < 5; i++) {
    const r = 1.0 - i * 0.17, h = 1.25 - i * 0.12;
    const c = new THREE.ConeGeometry(r, h, 11, 2);
    const p = c.attributes.position;
    for (let k = 0; k < p.count; k++) {
      const y = p.getY(k);
      const j = Math.sin(k * 12.9898) * 0.08;
      p.setXYZ(k, p.getX(k) * (1 + j), y + (y < 0 ? -0.08 + j : 0), p.getZ(k) * (1 - j));
    }
    c.translate(0, 1.15 + i * 0.5, 0);
    layers.push(c.toNonIndexed());
  }
  const fol = mergeGeometries(layers);
  fol.computeVertexNormals();
  return { trunk, fol };
}
export function rockGeo(seed = 1, detail = 1) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * 3.1 + seed) * 0.15 + Math.sin(v.y * 4.7 + seed * 2) * 0.12 + Math.cos(v.z * 3.9 + seed * 3) * 0.14;
    v.multiplyScalar(1 + n);
    v.y *= 0.65;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}
