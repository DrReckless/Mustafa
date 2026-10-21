// Geometri yardımcıları: dünya ölçekli UV'li kutular, çatılar, kemerler ve malzemeye göre birleştirme
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();

function clean(g) {
  let out = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(out.attributes)) {
    if (k !== 'position' && k !== 'normal' && k !== 'uv') out.deleteAttribute(k);
  }
  if (!out.attributes.uv) {
    const n = out.attributes.position.count;
    out.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
  }
  out.clearGroups();
  return out;
}

// Kutunun UV'lerini dünya ölçüsüne çevirir
export function boxGeo(w, h, d, seed = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  const off = (seed * 0.6180339) % 1;
  for (let f = 0; f < 6; f++) {
    for (let v = 0; v < 4; v++) {
      const k = f * 4 + v;
      uv.setXY(k, uv.getX(k) * dims[f][0] + off, uv.getY(k) * dims[f][1] + off * 0.7);
    }
  }
  return g;
}

export function cylGeo(rt, rb, h, seg = 12, open = false) {
  const g = new THREE.CylinderGeometry(rt, rb, h, seg, 1, open);
  const uv = g.attributes.uv;
  const circ = Math.PI * 2 * Math.max(rt, rb);
  for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * circ, uv.getY(k) * h);
  return g;
}

export function domeGeo(r, seg = 20, squash = 1) {
  const g = new THREE.SphereGeometry(r, seg, Math.max(6, seg / 2), 0, Math.PI * 2, 0, Math.PI / 2);
  g.scale(1, squash, 1);
  const uv = g.attributes.uv;
  for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * Math.PI * 2 * r, uv.getY(k) * r * 1.6);
  return g;
}

// Dışbükey çokgenlerden düz yüzeyli geometri (UV yüzey düzleminde, dünya ölçeğinde)
export function polyGeo(polys, both = false) {
  const pos = [], nor = [], uvs = [];
  const add = (pts) => {
    const a = pts[0], b = pts[1], c = pts[2];
    const t = new THREE.Vector3().subVectors(b, a).normalize();
    const n = new THREE.Vector3().subVectors(c, a).cross(new THREE.Vector3().subVectors(b, a)).normalize().negate();
    const bt = new THREE.Vector3().crossVectors(n, t);
    for (let k = 1; k < pts.length - 1; k++) {
      for (const p of [pts[0], pts[k], pts[k + 1]]) {
        pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z);
        uvs.push(p.dot(t), p.dot(bt));
      }
    }
  };
  for (const p of polys) {
    add(p);
    if (both) add(p.slice().reverse());
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  return g;
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Beşik çatı: mahya x ekseni boyunca. Tabanı y=0, merkez (0,0)
export function gableGeo(w, d, h, o = 0.06) {
  const x0 = -w / 2 - o, x1 = w / 2 + o, z0 = -d / 2 - o, z1 = d / 2 + o;
  const roof = polyGeo([
    [V(x0, 0, z1), V(x1, 0, z1), V(x1, h, 0), V(x0, h, 0)],
    [V(x1, 0, z0), V(x0, 0, z0), V(x0, h, 0), V(x1, h, 0)]
  ], true);
  const gx0 = -w / 2, gx1 = w / 2, hz = d / 2;
  const gable = polyGeo([
    [V(gx1, 0, hz), V(gx1, 0, -hz), V(gx1, h * (hz / (hz + o)), 0)],
    [V(gx0, 0, -hz), V(gx0, 0, hz), V(gx0, h * (hz / (hz + o)), 0)]
  ]);
  return { roof, gable };
}

// Kırma çatı (dört yana eğimli)
export function hipGeo(w, d, h, o = 0.08) {
  const x0 = -w / 2 - o, x1 = w / 2 + o, z0 = -d / 2 - o, z1 = d / 2 + o;
  if (w >= d) {
    const r = (w - d) / 2;
    return polyGeo([
      [V(x0, 0, z1), V(x1, 0, z1), V(r, h, 0), V(-r, h, 0)],
      [V(x1, 0, z0), V(x0, 0, z0), V(-r, h, 0), V(r, h, 0)],
      [V(x1, 0, z1), V(x1, 0, z0), V(r, h, 0)],
      [V(x0, 0, z0), V(x0, 0, z1), V(-r, h, 0)]
    ].map(fixTri), true);
  }
  const r = (d - w) / 2;
  return polyGeo([
    [V(x1, 0, z1), V(x1, 0, z0), V(0, h, -r), V(0, h, r)],
    [V(x0, 0, z0), V(x0, 0, z1), V(0, h, r), V(0, h, -r)],
    [V(x0, 0, z1), V(x1, 0, z1), V(0, h, r)],
    [V(x1, 0, z0), V(x0, 0, z0), V(0, h, -r)]
  ].map(fixTri), true);
}
function fixTri(p) {
  // dejenere (sıfır uzunluklu) kenarları ayıkla
  const out = [];
  for (const v of p) if (!out.some((u) => u.distanceTo(v) < 1e-5)) out.push(v);
  return out;
}

// Sivri kemer şekli (genişlik w, yükseklik h; taban ortası 0,0)
export function archShape(w, h, pointed = true) {
  const s = new THREE.Shape();
  const hw = w / 2, sh = h - hw * (pointed ? 1.15 : 1);
  s.moveTo(-hw, 0); s.lineTo(hw, 0); s.lineTo(hw, sh);
  if (pointed) {
    s.quadraticCurveTo(hw, h - hw * 0.25, 0, h);
    s.quadraticCurveTo(-hw, h - hw * 0.25, -hw, sh);
  } else {
    s.absarc(0, sh, hw, 0, Math.PI, false);
  }
  s.lineTo(-hw, 0);
  return s;
}
export function archGeo(w, h, pointed = true, depth = 0.015) {
  const g = new THREE.ExtrudeGeometry(archShape(w, h, pointed), { depth, bevelEnabled: false, curveSegments: 8 });
  return g;
}

// Malzemeye göre parçaları toplayıp birleştiren yardımcı
export class Builder {
  constructor() { this.parts = new Map(); this.extra = []; }
  add(geo, mat, x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    _e.set(rx, ry, rz, 'YXZ');
    _q.setFromEuler(_e);
    _m.compose(_p.set(x, y, z), _q, _s.set(sx, sy, sz));
    const g = clean(geo).applyMatrix4(_m);
    if (!this.parts.has(mat)) this.parts.set(mat, []);
    this.parts.get(mat).push(g);
    return g;
  }
  // Kutu: (x,z) merkez, y taban
  box(mat, x, y, z, w, h, d, ry = 0, seed = 0) { return this.add(boxGeo(w, h, d, seed + x * 3.1 + z * 1.7), mat, x, y + h / 2, z, ry); }
  cyl(mat, x, y, z, rt, rb, h, seg = 10, rx = 0, rz = 0, ry = 0) { return this.add(cylGeo(rt, rb, h, seg), mat, x, y + h / 2, z, ry, rx, rz); }
  // İki nokta arası silindir (kiriş, dal)
  beam(mat, a, b, r, seg = 6) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const g = clean(cylGeo(r, r, len, seg));
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    _m.compose(new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5), q, _s.set(1, 1, 1));
    g.applyMatrix4(_m);
    if (!this.parts.has(mat)) this.parts.set(mat, []);
    this.parts.get(mat).push(g);
  }
  // Duvara kemerli açıklık: face: '+z' | '+x' | '-z' | '-x'
  arch(mat, face, cx, y, cz, w, h, pointed = true) {
    const g = archGeo(w, h, pointed);
    let ry = 0;
    if (face === '+x') ry = Math.PI / 2;
    else if (face === '-z') ry = Math.PI;
    else if (face === '-x') ry = -Math.PI / 2;
    return this.add(g, mat, cx, y, cz, ry);
  }
  rect(mat, face, cx, y, cz, w, h, depth = 0.02) {
    if (face === '+z' || face === '-z') return this.box(mat, cx, y, cz, w, h, depth);
    return this.box(mat, cx, y, cz, depth, h, w);
  }
  mesh(obj) { this.extra.push(obj); }
  build(shadows = true) {
    const grp = new THREE.Group();
    for (const [mat, list] of this.parts) {
      const g = mergeGeometries(list, false);
      if (!g) continue;
      g.computeBoundingSphere();
      const mesh = new THREE.Mesh(g, mat);
      mesh.castShadow = shadows; mesh.receiveShadow = true;
      grp.add(mesh);
    }
    for (const e of this.extra) grp.add(e);
    return grp;
  }
}

export { V };
