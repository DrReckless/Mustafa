// Ağaçlar: gövde + yaprak kartları, örnekli (instanced) çizim, rüzgâr salınımı
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { cylGeo } from './geom.js';
import { M, tex } from './materials.js';

function rnd(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
function clean(g) {
  const o = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(o.attributes)) if (!['position', 'normal', 'uv'].includes(k)) o.deleteAttribute(k);
  return o;
}
function branch(a, b, r0, r1) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const g = clean(cylGeo(r1, r0, len, 6, true));
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1)));
  return g;
}
// Çapraz kart kümesi; normaller taç merkezinden dışa (hacimli ışık)
function cards(centers, size, crown, upBias = 0.35, nPlanes = 3, rr) {
  const pos = [], nor = [], uv = [];
  const tmp = new THREE.Vector3();
  for (const c of centers) {
    const s = size * (0.8 + rr() * 0.4);
    const baseRot = rr() * Math.PI;
    for (let p = 0; p < nPlanes; p++) {
      const ang = baseRot + p * Math.PI / nPlanes;
      const tilt = (rr() - 0.5) * 0.6;
      const ax = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang));
      const ay = new THREE.Vector3(-Math.sin(ang) * tilt, 1, Math.cos(ang) * tilt).normalize();
      const corners = [[-1, -1, 0, 0], [1, -1, 1, 0], [1, 1, 1, 1], [-1, 1, 0, 1]];
      const quad = corners.map(([u, v, tu, tv]) => ({ p: c.clone().addScaledVector(ax, u * s / 2).addScaledVector(ay, v * s / 2), uv: [tu, tv] }));
      for (const idx of [0, 1, 2, 0, 2, 3]) {
        const q = quad[idx];
        pos.push(q.p.x, q.p.y, q.p.z);
        tmp.subVectors(q.p, crown).normalize();
        tmp.y += upBias; tmp.normalize();
        nor.push(tmp.x, tmp.y, tmp.z);
        uv.push(q.uv[0], q.uv[1]);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return g;
}

function oak(seed) {
  const rr = rnd(seed);
  const parts = [branch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.75, 0), 0.075, 0.05)];
  const crown = new THREE.Vector3(0, 1.1, 0);
  for (let k = 0; k < 5; k++) {
    const a = k / 5 * Math.PI * 2 + rr();
    const tip = new THREE.Vector3(Math.cos(a) * 0.38, 0.95 + rr() * 0.35, Math.sin(a) * 0.38);
    parts.push(branch(new THREE.Vector3(0, 0.6 + rr() * 0.15, 0), tip, 0.035, 0.012));
    parts.push(branch(tip, tip.clone().add(new THREE.Vector3(Math.cos(a + 0.8) * 0.15, 0.15, Math.sin(a + 0.8) * 0.15)), 0.012, 0.005));
  }
  parts.push(branch(new THREE.Vector3(0, 0.7, 0), new THREE.Vector3(0.05, 1.45, -0.03), 0.04, 0.012));
  const centers = [];
  for (let k = 0; k < 17; k++) {
    const a = rr() * Math.PI * 2, r = 0.15 + rr() * 0.33;
    centers.push(new THREE.Vector3(Math.cos(a) * r, 0.92 + rr() * 0.6 - r * 0.3, Math.sin(a) * r));
  }
  centers.push(new THREE.Vector3(0, 1.48, 0));
  return { trunk: mergeGeometries(parts), leaves: cards(centers, 0.5, crown, 0.4, 3, rr) };
}
function poplar(seed) {
  const rr = rnd(seed);
  const parts = [branch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 2.1, 0), 0.05, 0.012)];
  for (let k = 0; k < 9; k++) {
    const y = 0.4 + k * 0.17, a = rr() * Math.PI * 2;
    parts.push(branch(new THREE.Vector3(0, y, 0), new THREE.Vector3(Math.cos(a) * 0.12, y + 0.25, Math.sin(a) * 0.12), 0.014, 0.004));
  }
  const centers = [];
  for (let k = 0; k < 13; k++) {
    const y = 0.45 + k * 0.12;
    const w = 0.13 * Math.sin(Math.min(1, (y - 0.3) / 1.7) * Math.PI) + 0.03;
    const a = rr() * Math.PI * 2;
    centers.push(new THREE.Vector3(Math.cos(a) * w * 0.6, y, Math.sin(a) * w * 0.6));
  }
  const crown = new THREE.Vector3(0, 1.2, 0);
  return { trunk: mergeGeometries(parts), leaves: cards(centers, 0.4, crown, 0.2, 3, rr) };
}
function pine(seed) {
  const rr = rnd(seed);
  const parts = [branch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.95, 0), 0.06, 0.01)];
  const pos = [], nor = [], uv = [];
  const push = (p, n, u, v) => { pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z); uv.push(u, v); };
  const layers = 9;
  for (let l = 0; l < layers; l++) {
    const t = l / (layers - 1);
    const y = 0.32 + t * 1.5;
    const len = 0.62 * Math.pow(1 - t, 0.85) + 0.1;
    const cnt = l === layers - 1 ? 4 : 7;
    const off = rr() * Math.PI * 2;
    for (let k = 0; k < cnt; k++) {
      const a = off + k / cnt * Math.PI * 2 + (rr() - 0.5) * 0.3;
      const droop = l === layers - 1 ? 1.4 : -0.28 - rr() * 0.15;
      const d = new THREE.Vector3(Math.cos(a), droop, Math.sin(a)).normalize().multiplyScalar(len);
      const side = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)).multiplyScalar(len * 0.36);
      const p0 = new THREE.Vector3(0, y, 0), p1 = p0.clone().add(d);
      const n = new THREE.Vector3(Math.cos(a) * 0.55, 0.85, Math.sin(a) * 0.55).normalize();
      const A = p0.clone().sub(side), B = p1.clone().sub(side), C = p1.clone().add(side), D = p0.clone().add(side);
      push(A, n, 0, 0); push(B, n, 1, 0); push(C, n, 1, 1);
      push(A, n, 0, 0); push(C, n, 1, 1); push(D, n, 0, 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return { trunk: mergeGeometries(parts), leaves: g };
}

const windUniform = { value: 0 };
function windify(mat) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = windUniform;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
#ifdef USE_INSTANCING
  vec3 ip = vec3(instanceMatrix[3][0], 0.0, instanceMatrix[3][2]);
#else
  vec3 ip = vec3(0.0);
#endif
  float sway = sin(uTime * 1.3 + ip.x * 0.7 + ip.z * 0.5) * 0.5 + sin(uTime * 2.7 + ip.x * 1.9) * 0.25;
  transformed.x += sway * 0.025 * position.y;
  transformed.z += sway * 0.018 * position.y;`);
    // Çift taraflı kartlarda arka yüz karanlık olmasın: normali çevirme
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_begin>', '#include <normal_fragment_begin>\n  normal = normalize( vNormal );');
  };
  return mat;
}

export class Forest {
  constructor(scene, N) {
    this.scene = scene; this.N = N;
    this.types = {};
    this.leafMats = {};
    const mk = (map) => windify(new THREE.MeshStandardMaterial({ map, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.85 }));
    this.leafMats.oak = mk(tex('foliage_green'));
    this.leafMats.poplar = mk(tex('foliage_green'));
    this.leafMats.pine = mk(tex('pine_card'));
    this.barkMat = M.bark;
    this.geos = { 1: oak(11), 2: pine(23), 3: poplar(37) };
    this.kindName = { 1: 'oak', 2: 'pine', 3: 'poplar' };
  }

  // positions: [{x,z,kind,s,r,key}] ; key ile sonradan gizlenebilir
  build(list) {
    for (const t of Object.values(this.types)) { this.scene.remove(t.trunk); this.scene.remove(t.leaves); }
    this.types = {}; this.byKey = new Map();
    const groups = { 1: [], 2: [], 3: [] };
    for (const p of list) groups[p.kind].push(p);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    for (const k of [1, 2, 3]) {
      const arr = groups[k];
      if (!arr.length) continue;
      const geo = this.geos[k];
      const trunk = new THREE.InstancedMesh(geo.trunk, this.barkMat, arr.length);
      const leaves = new THREE.InstancedMesh(geo.leaves, this.leafMats[this.kindName[k]], arr.length);
      arr.forEach((p, n) => {
        q.setFromAxisAngle(up, p.r);
        m.compose(v.set(p.x, p.y, p.z), q, s.set(p.s, p.s * (0.9 + (p.r % 0.2)), p.s));
        trunk.setMatrixAt(n, m); leaves.setMatrixAt(n, m);
        if (p.key !== undefined) this.byKey.set(p.key, { k, n, m: m.clone() });
      });
      for (const im of [trunk, leaves]) {
        im.castShadow = true; im.receiveShadow = true;
        im.instanceMatrix.needsUpdate = true;
        im.computeBoundingSphere();
        this.scene.add(im);
      }
      this.types[k] = { trunk, leaves };
    }
  }
  hide(key) {
    const e = this.byKey.get(key);
    if (!e) return;
    const t = this.types[e.k];
    const z = new THREE.Matrix4().makeScale(0, 0, 0);
    t.trunk.setMatrixAt(e.n, z); t.leaves.setMatrixAt(e.n, z);
    t.trunk.instanceMatrix.needsUpdate = true; t.leaves.instanceMatrix.needsUpdate = true;
    this.byKey.delete(key);
  }
  setSeason(s) {
    const oakMap = s === 0 ? tex('foliage_spring') : s === 2 ? tex('foliage_autumn') : tex('foliage_green');
    this.leafMats.oak.map = oakMap; this.leafMats.oak.needsUpdate = true;
    this.leafMats.poplar.map = s === 2 ? tex('foliage_autumn') : s === 0 ? tex('foliage_spring') : tex('foliage_green');
    this.leafMats.poplar.needsUpdate = true;
    this.leafMats.pine.map = s === 3 ? tex('pine_card_snow') : tex('pine_card');
    this.leafMats.pine.needsUpdate = true;
    for (const k of [1, 3]) if (this.types[k]) this.types[k].leaves.visible = s !== 3;
  }
  update(t) { windUniform.value = t; }
}

// Ot tutamları
export function grassTufts(list) {
  const pos = [], nor = [], uv = [];
  for (let p = 0; p < 2; p++) {
    const a = p * Math.PI / 2;
    const ax = [Math.cos(a), Math.sin(a)];
    const quad = [[-1, 0, 0, 0], [1, 0, 1, 0], [1, 1, 1, 1], [-1, 1, 0, 1]];
    for (const idx of [0, 1, 2, 0, 2, 3]) {
      const [u, v, tu, tv] = quad[idx];
      pos.push(ax[0] * u * 0.14, v * 0.09, ax[1] * u * 0.14);
      nor.push(0, 1, 0); uv.push(tu, tv);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  const mat = windify(new THREE.MeshStandardMaterial({ map: tex('grass_card'), alphaTest: 0.4, side: THREE.DoubleSide, roughness: 1 }));
  const im = new THREE.InstancedMesh(g, mat, list.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  list.forEach((p, n) => {
    q.setFromAxisAngle(up, p.r);
    m.compose(new THREE.Vector3(p.x, p.y, p.z), q, new THREE.Vector3(p.s, p.s, p.s));
    im.setMatrixAt(n, m);
  });
  im.receiveShadow = true;
  im.instanceMatrix.needsUpdate = true;
  im.computeBoundingSphere();
  return im;
}
