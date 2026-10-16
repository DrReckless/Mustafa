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
  };
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
function mBelt(m) {
  const b = new Builder();
  b.add(box(2.0, 0.06, 1.42), m.belt, { y: 0.4 }, 'belt');
  for (const z of [-0.78, 0.78]) {
    b.add(rbox(2.0, 0.2, 0.12, 0.03), m.darkSteel, { y: 0.36, z });
    b.add(box(2.0, 0.04, 0.16), m.hazard, { y: 0.48, z });
  }
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

function mSmelter(m) {
  const b = new Builder();
  b.add(rbox(1.9, 0.2, 1.9, 0.05), m.concreteDark, { y: 0.1 });
  b.add(rbox(1.35, 1.3, 1.5, 0.1), m.brick, { x: -0.12, y: 0.85 });
  b.add(rbox(1.15, 0.35, 1.25, 0.06), m.darkSteel, { x: -0.15, y: 1.65 });
  b.add(cyl(0.2, 0.27, 2.4, 14), m.darkSteel, { x: -0.45, y: 2.7, z: -0.38 });
  for (const y of [2.0, 2.8, 3.6]) b.add(cyl(0.25, 0.25, 0.08, 14), m.rust, { x: -0.45, y, z: -0.38 });
  b.add(rbox(0.16, 0.75, 1.0, 0.03), m.darkSteel, { x: 0.58, y: 0.78 });
  b.add(box(0.05, 0.45, 0.72), m.glowFurnace, { x: 0.67, y: 0.75 }, 'furnace');
  b.add(rbox(0.5, 0.08, 0.7, 0.02), m.steel, { x: 0.82, y: 0.42 });
  b.add(box(0.7, 0.55, 0.9), m.steel, { x: -0.8, y: 1.3, rz: 0.35 });
  b.add(cyl(0.06, 0.06, 1.3, 8), m.copper, { x: 0.25, y: 1.0, z: 0.78, rx: Math.PI / 2, rz: Math.PI / 2 });
  b.add(cyl(0.06, 0.06, 1.1, 8), m.copper, { x: 0.55, y: 0.45, z: 0.78 });
  b.add(box(0.1, 0.1, 0.1), m.glowLight, { x: 0.6, y: 1.45, z: -0.6 }, 'status');
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
    if (it.shape === 'crate') { o.map = T.metal; o.color = 0x6b6a3a; }
    if (it.shape === 'block') { o.map = T.concrete; }
    out[k] = { geo: itemGeo(it.shape), mat: new THREE.MeshStandardMaterial(o) };
  }
  return out;
}

const BUILDERS = {
  belt: mBelt, miner: mMiner, smelter: mSmelter, assembler: mAssembler, foundry: mFoundry,
  generator: mGenerator, solar: mSolar, splitter: mSplitter, wall: mWall,
  turret_mg: mTurretMG, turret_cannon: mTurretCannon, turret_laser: mTurretLaser,
  factory: mFactory, hq: mHQ,
  mech: mMech, tank: mTank, drone: (m) => mDrone(m), raider: mRaider, brute: mBrute, wasp: (m) => mDrone(m, true),
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
