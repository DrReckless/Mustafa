import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { TILE, MAP_W, MAP_H } from '../config.js';
import {
  T_GRASS, T_DIRT, T_SAND, T_WATER, T_ROCK, T_ASH, T_SNOW, T_RED, T_LAVA, ORE_TYPES,
  B_TEMPERATE, B_DESERT, B_TUNDRA, B_VOLCANIC,
  TK_PINE, TK_BROAD, TK_PALM, TK_CACTUS, TK_DEAD, TK_SNOWPINE,
} from '../sim/world.js';
import { makeNoise, mulberry32 } from '../util.js';
import { getTextures } from './textures.js';
import { treeGeos, rockGeo } from './models.js';

const MARGIN = 34;
export const WATER_Y = -0.2;
const LAVA_GROUND = -0.08;

const C = (h) => new THREE.Color(h);
// biyom paletleri
const PAL = [
  { // ılıman
    grassA: C(0x4a5c28), grassB: C(0x6d7a34), dirt: C(0x6b583f), sand: C(0xb5a27a), rock: C(0x6f6a62),
    cliff: C(0x5d5953), snow: C(0xe9edf0), snowLine: 17, low: C(0x4a5c28), lowB: C(0x6d7a34),
  },
  { // çöl
    grassA: C(0x3f6a26), grassB: C(0x5f8a30), dirt: C(0x8a6e4c), sand: C(0xc9ab78), rock: C(0x93603e),
    cliff: C(0x9a5a36), snow: C(0xe2c9a0), snowLine: 24, low: C(0xc4a272), lowB: C(0xb88a5c),
  },
  { // tundra
    grassA: C(0x6f7458), grassB: C(0x8a8a66), dirt: C(0x8e8a84), sand: C(0x9a968a), rock: C(0x8a8c90),
    cliff: C(0x6e7076), snow: C(0xdfe6ec), snowLine: 5, low: C(0xd6dee6), lowB: C(0xc7d0d8),
  },
  { // volkanik
    grassA: C(0x4d5a2c), grassB: C(0x5d6634), dirt: C(0x4a4038), sand: C(0x5a524a), rock: C(0x3a3634),
    cliff: C(0x2b2927), snow: C(0x55504c), snowLine: 30, low: C(0x3a3836), lowB: C(0x48423c),
  },
];
const SNOW = C(0xdfe6ec), SNOW2 = C(0xf2f5f8), RED = C(0x9c4f2e), RED2 = C(0xb0613a);
const ASH = C(0x3a3836), ASH2 = C(0x4c4642), CHAR = C(0x241812), BED = C(0x4a4434);
const ORE_TINT = {
  iron_ore: C(0x5e3a2b), copper_ore: C(0x4b6650), coal: C(0x2a2928), stone: C(0x8d8981), quartz: C(0x8394a4),
  bauxite: C(0x8a4a2c), sulfur: C(0xb8a52a), uranium_ore: C(0x4a6a3a), oil: C(0x141210),
};
const ROCK_TINT = [C(0x9a958c), C(0xb8724a), C(0xc4c8cc), C(0x45403c)];

// ------- yardımcılar -------
function clean(g) {
  const n = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(k)) n.deleteAttribute(k);
  if (!n.attributes.uv) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2));
  return n;
}
function merge(list) { const g = mergeGeometries(list.map(clean)); g.computeVertexNormals(); return g; }
function xf(g, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1 } = {}) {
  const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
  g.applyMatrix4(m); return g;
}

// ------- ağaç türleri -------
function broadGeos() {
  const trunk = merge([
    xf(new THREE.CylinderGeometry(0.1, 0.17, 1.5, 7), { y: 0.75 }),
    xf(new THREE.CylinderGeometry(0.05, 0.08, 0.8, 5), { x: 0.2, y: 1.45, rz: -0.6 }),
  ]);
  const blobs = [[0, 2.2, 0, 0.95], [0.55, 1.9, 0.2, 0.7], [-0.45, 1.95, -0.25, 0.72], [0.1, 2.75, -0.1, 0.7], [-0.15, 1.8, 0.5, 0.6]];
  const fol = merge(blobs.map(([x, y, z, r], i) => {
    const g = new THREE.IcosahedronGeometry(r, 1);
    const p = g.attributes.position;
    for (let k = 0; k < p.count; k++) {
      const j = 1 + Math.sin(k * 12.9898 + i * 7) * 0.12;
      p.setXYZ(k, p.getX(k) * j, p.getY(k) * j * 0.85, p.getZ(k) * j);
    }
    return xf(g, { x, y, z });
  }));
  return { trunk, fol };
}
function palmGeos() {
  const segs = [];
  let x = 0, y = 0, a = 0;
  for (let i = 0; i < 6; i++) {
    const len = 0.55, r = 0.11 - i * 0.008;
    const nx = x + Math.sin(a) * len, ny = y + Math.cos(a) * len;
    segs.push(xf(new THREE.CylinderGeometry(r * 0.92, r, len + 0.04, 6), { x: (x + nx) / 2, y: (y + ny) / 2, rz: -a }));
    x = nx; y = ny; a += 0.07;
  }
  const trunk = merge(segs);
  const fr = [];
  for (let i = 0; i < 8; i++) {
    const ry = i * Math.PI * 2 / 8 + (i % 2) * 0.2;
    // iki parçalı sarkık yaprak
    const g1 = xf(new THREE.BoxGeometry(0.75, 0.03, 0.28), { x: 0.37, rz: 0.25 });
    const g2 = xf(new THREE.BoxGeometry(0.7, 0.03, 0.2), { x: 1.02, y: -0.14, rz: -0.45 });
    fr.push(xf(g1, { ry, x, y: y + 0.02 }), xf(g2, { ry, x, y: y + 0.02 }));
  }
  fr.push(xf(new THREE.SphereGeometry(0.16, 6, 5), { x, y: y - 0.05 }));
  return { trunk, fol: merge(fr) };
}
function cactusGeos() {
  const parts = [
    xf(new THREE.CylinderGeometry(0.2, 0.22, 1.9, 8), { y: 0.95 }),
    xf(new THREE.SphereGeometry(0.2, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), { y: 1.9 }),
    // sağ kol
    xf(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 7), { x: 0.3, y: 0.9, rz: Math.PI / 2 }),
    xf(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 7), { x: 0.48, y: 1.2 }),
    xf(new THREE.SphereGeometry(0.12, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2), { x: 0.48, y: 1.55 }),
    // sol kol
    xf(new THREE.CylinderGeometry(0.11, 0.11, 0.34, 7), { x: -0.27, y: 1.25, rz: Math.PI / 2 }),
    xf(new THREE.CylinderGeometry(0.11, 0.11, 0.5, 7), { x: -0.42, y: 1.48 }),
    xf(new THREE.SphereGeometry(0.11, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2), { x: -0.42, y: 1.73 }),
  ];
  return { trunk: null, fol: merge(parts) };
}
function deadGeos() {
  const parts = [
    xf(new THREE.CylinderGeometry(0.06, 0.15, 2.0, 6), { y: 1.0, rz: 0.05 }),
    xf(new THREE.CylinderGeometry(0.03, 0.06, 0.9, 5), { x: 0.3, y: 1.5, rz: -0.8 }),
    xf(new THREE.CylinderGeometry(0.025, 0.05, 0.7, 5), { x: -0.25, y: 1.25, z: 0.1, rz: 0.9, rx: 0.3 }),
    xf(new THREE.CylinderGeometry(0.02, 0.04, 0.6, 5), { x: 0.05, y: 1.8, z: -0.2, rx: -0.7 }),
    xf(new THREE.CylinderGeometry(0.02, 0.035, 0.45, 4), { x: 0.55, y: 1.95, rz: -0.3 }),
  ];
  return { trunk: merge(parts), fol: null };
}
function snowPineGeos() {
  const { trunk, fol } = treeGeos();
  const g = fol.index ? fol.toNonIndexed() : fol.clone();
  const p = g.attributes.position, n = g.attributes.normal;
  const col = new Float32Array(p.count * 3);
  const green = C(0x2c4a30), white = C(0xf0f4f8);
  for (let i = 0; i < p.count; i++) {
    // yukarı bakan yüzeyler ve uçlar karlı
    const up = n.getY(i);
    const s = THREE.MathUtils.clamp((up - 0.25) * 2.2 + (p.getY(i) - 2.2) * 0.25 + Math.sin(i * 3.7) * 0.15, 0, 1);
    const c = green.clone().lerp(white, s);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return { trunk, fol: g };
}

function lavaTexture() {
  const S = 256;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  const img = g.createImageData(S, S);
  const nz = makeNoise(4242);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const v = nz.fbm(x * 0.03, y * 0.03, 4);
    const cr = 1 - Math.abs(nz.fbm(x * 0.05 + 30, y * 0.05 + 10, 3) * 2 - 1); // damarlar
    let k = Math.pow(cr, 5) * 1.5 + Math.pow(v, 2) * 0.55;
    k = Math.max(0, Math.min(1, k));
    const i = (y * S + x) * 4;
    img.data[i] = 26 + 229 * Math.min(1, k * 1.5);
    img.data[i + 1] = 6 + 190 * Math.pow(k, 2.2);
    img.data[i + 2] = 3 + 70 * Math.pow(k, 5);
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Terrain {
  constructor(scene, world, quality) {
    this.scene = scene; this.world = world; this.quality = quality;
    this.noise = makeNoise(world.seed + 5);
    this.rnd = mulberry32(world.seed + 9);
    this.tileInst = new Map(); // karo -> [[mesh, index], ...]
    this.T = getTextures();
    this.buildGround();
    this.buildWater();
    this.buildLava();
    this.buildOres();
    this.buildRocks();
    this.buildTrees();
    if (quality !== 'low') this.buildGrass();
    this.buildGrid();
  }
  edgeBiome(tx, ty) { return this.world.biomeAt(tx, ty); }
  outerHeight(tx, ty) {
    // tx,ty: karo köşe koordinatı (harita dışı)
    const dx = tx < 0 ? -tx : tx > MAP_W ? tx - MAP_W : 0;
    const dy = ty < 0 ? -ty : ty > MAP_H ? ty - MAP_H : 0;
    const d = Math.hypot(dx, dy);
    if (d <= 0) return 0;
    const n = this.noise.fbm(tx * 0.07, ty * 0.07, 5);
    const ridge = 1 - Math.abs(this.noise.fbm(tx * 0.04 + 9, ty * 0.04 + 3, 4) * 2 - 1);
    const s = Math.min(1, d / 14);
    return s * s * (3 + n * 14 + ridge * 12) + (d > 1 ? n * 0.6 : 0);
  }
  tileCol(x, y) {
    const wd = this.world, nz = this.noise;
    const i = wd.idx(x, y);
    const t = wd.terrain[i];
    const b = wd.biome[i];
    const P = PAL[b];
    const ore = ORE_TYPES[wd.ore[i]];
    let c;
    switch (t) {
      case T_WATER: c = BED.clone(); break;
      case T_LAVA: c = CHAR.clone(); break;
      case T_SAND: c = P.sand.clone().lerp(b === B_DESERT ? C(0xd8bc88) : P.sand, nz.n2(x * 0.25, y * 0.25) * 0.6); break;
      case T_ROCK: c = P.rock.clone(); break;
      case T_ASH: c = ASH.clone().lerp(ASH2, nz.fbm(x * 0.2, y * 0.2, 3)); break;
      case T_SNOW: c = SNOW.clone().lerp(SNOW2, nz.fbm(x * 0.18, y * 0.18, 3)); break;
      case T_RED: c = RED.clone().lerp(RED2, nz.n2(x * 0.3, y * 0.3)); break;
      case T_DIRT: c = P.dirt.clone().lerp(b === B_TEMPERATE ? P.grassA : P.dirt, nz.n2(x * 0.3, y * 0.3) * 0.4); break;
      default: c = P.grassA.clone().lerp(P.grassB, nz.fbm(x * 0.12, y * 0.12, 3));
    }
    if (ore) c.lerp(ORE_TINT[ore], ore === 'oil' ? 0.55 : 0.75);
    // lav kenarı kömürleşmiş
    if (t !== T_LAVA) {
      for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        if (wd.inside(x + ox, y + oy) && wd.terrain[wd.idx(x + ox, y + oy)] === T_LAVA) { c.lerp(CHAR, 0.55); break; }
      }
    }
    return c;
  }
  buildGround() {
    const W = MAP_W + MARGIN * 2, H = MAP_H + MARGIN * 2;
    const geo = new THREE.PlaneGeometry(W * TILE, H * TILE, W, H);
    geo.rotateX(-Math.PI / 2);
    geo.translate((W * TILE) / 2 - MARGIN * TILE, 0, (H * TILE) / 2 - MARGIN * TILE);
    const pos = geo.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    const wd = this.world;
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const ix = i % (W + 1), iy = Math.floor(i / (W + 1));
      const tx = ix - MARGIN, ty = iy - MARGIN;
      let h = 0; let c;
      if (tx >= 0 && ty >= 0 && tx <= MAP_W && ty <= MAP_H) {
        let water = 0, lava = 0, n = 0;
        c = new THREE.Color(0, 0, 0);
        for (const [ox, oy] of [[-1, -1], [0, -1], [-1, 0], [0, 0]]) {
          const x = tx + ox, y = ty + oy;
          if (!wd.inside(x, y)) continue;
          n++;
          const tt = wd.terrain[wd.idx(x, y)];
          if (tt === T_WATER) water++;
          else if (tt === T_LAVA) lava++;
          tmp.copy(this.tileCol(x, y)); c.r += tmp.r; c.g += tmp.g; c.b += tmp.b;
        }
        c.multiplyScalar(1 / Math.max(1, n));
        const nh = (this.noise.n2(tx * 0.9, ty * 0.9) - 0.5) * 0.06;
        if (water) h = [0, -0.06, -0.38, -0.85, -1.25][water] + nh;
        else if (lava) h = LAVA_GROUND * (lava >= 3 ? 1 : 0.6);
        else h = nh;
        if (tx === 0 || ty === 0 || tx === MAP_W || ty === MAP_H) h += 0.05;
      } else {
        h = this.outerHeight(tx, ty);
        const P = PAL[this.edgeBiome(tx, ty)];
        const slope = Math.abs(this.outerHeight(tx + 1, ty) - h) + Math.abs(this.outerHeight(tx, ty + 1) - h);
        c = P.low.clone().lerp(P.lowB, this.noise.fbm(tx * 0.1, ty * 0.1, 3));
        c.lerp(P.cliff, Math.min(1, slope * 0.35 + Math.max(0, h - 6) * 0.08));
        const sl = P.snowLine + this.noise.n2(tx * 0.3, ty * 0.3) * 4;
        if (h > sl) c.lerp(P.snow, Math.min(1, (h - sl) * 0.25));
      }
      pos.setY(i, h);
      const v = 0.92 + this.noise.n2(tx * 1.7, ty * 1.7) * 0.16;
      cols[i * 3] = c.r * v; cols[i * 3 + 1] = c.g * v; cols[i * 3 + 2] = c.b * v;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    const map = this.T.ground.clone(); map.repeat.set(W / 2.5, H / 2.5); map.needsUpdate = true;
    const nmap = this.T.groundN.clone(); nmap.repeat.set(W / 2.5, H / 2.5); nmap.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true, map, normalMap: nmap, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.96, metalness: 0,
    });
    this.ground = new THREE.Mesh(geo, mat);
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
    this.groundGeo = geo; this.gw = W;
  }
  heightAt(wx, wz) {
    const tx = wx / TILE, ty = wz / TILE;
    if (tx >= 0 && ty >= 0 && tx <= MAP_W && ty <= MAP_H) return 0;
    return this.outerHeight(Math.round(tx), Math.round(ty));
  }
  buildWater() {
    const geo = new THREE.PlaneGeometry(MAP_W * TILE, MAP_H * TILE, 1, 1);
    geo.rotateX(-Math.PI / 2);
    geo.translate(MAP_W * TILE / 2, WATER_Y, MAP_H * TILE / 2);
    const n = this.T.waterN.clone(); n.repeat.set(MAP_W / 4, MAP_H / 4); n.needsUpdate = true;
    const tundra = this.world.preset === 'tundra';
    const mat = new THREE.MeshStandardMaterial({
      color: tundra ? 0x1d3f52 : 0x0f3442, roughness: 0.05, metalness: 0.1, normalMap: n, normalScale: new THREE.Vector2(0.35, 0.35),
      transparent: true, opacity: 0.86, envMapIntensity: 1.4,
    });
    this.water = new THREE.Mesh(geo, mat);
    this.water.receiveShadow = true;
    this.scene.add(this.water);
    this.waterN = n;
  }
  buildLava() {
    const wd = this.world;
    // lav karolarının sınır kutusu
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let y = 0; y < wd.h; y++) for (let x = 0; x < wd.w; x++) {
      if (wd.terrain[wd.idx(x, y)] !== T_LAVA) continue;
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
    if (x1 < 0) return;
    x0 -= 1; y0 -= 1; x1 += 2; y1 += 2;
    const R = 3; // karo başına alt bölüm
    const nx = (x1 - x0) * R, ny = (y1 - y0) * R;
    const isL = (x, y) => wd.inside(x, y) && wd.terrain[wd.idx(x, y)] === T_LAVA ? 1 : 0;
    const pos = [], uv = [], al = [], idx = [];
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
      const fx = x0 + i / R, fy = y0 + j / R;
      // karo merkezlerinden çift doğrusal örnekleme + gürültü = yumuşak kıyı
      const gx = fx - 0.5, gy = fy - 0.5, ix = Math.floor(gx), iy = Math.floor(gy), tx = gx - ix, ty = gy - iy;
      let v = isL(ix, iy) * (1 - tx) * (1 - ty) + isL(ix + 1, iy) * tx * (1 - ty) + isL(ix, iy + 1) * (1 - tx) * ty + isL(ix + 1, iy + 1) * tx * ty;
      v += (this.noise.n2(fx * 1.7, fy * 1.7) - 0.5) * 0.35;
      pos.push(fx * TILE, -0.03, fy * TILE); uv.push(fx * TILE / 7, fy * TILE / 7); al.push(v);
    }
    const W = nx + 1;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const a = j * W + i, b = a + 1, c = a + W, d = c + 1;
      if (Math.max(al[a], al[b], al[c], al[d]) < 0.45) continue;
      idx.push(a, c, b, b, c, d);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setAttribute('aL', new THREE.Float32BufferAttribute(al, 1));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const tex = lavaTexture();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1e0a05, emissive: 0xff6a20, emissiveMap: tex, emissiveIntensity: 2.4, map: tex,
      roughness: 0.6, metalness: 0, polygonOffset: true, polygonOffsetFactor: -1,
    });
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = 'attribute float aL;\nvarying float vL;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvL = aL;');
      sh.fragmentShader = 'varying float vL;\n' + sh.fragmentShader
        .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif (vL < 0.5) discard;')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance *= smoothstep(0.5, 0.85, vL);');
    };
    this.lava = new THREE.Mesh(geo, mat);
    this.lava.receiveShadow = false;
    this.scene.add(this.lava);
    this.lavaTex = tex;
  }
  track(x, y, mesh, idx) {
    const k = y * MAP_W + x;
    if (!this.tileInst.has(k)) this.tileInst.set(k, []);
    this.tileInst.get(k).push([mesh, idx]);
  }
  clearTile(x, y) {
    const k = y * MAP_W + x;
    const l = this.tileInst.get(k);
    if (!l) return;
    const z = new THREE.Matrix4().makeScale(0, 0, 0);
    for (const [mesh, i] of l) { mesh.setMatrixAt(i, z); mesh.instanceMatrix.needsUpdate = true; }
    this.tileInst.delete(k);
  }
  buildOres() {
    const wd = this.world, rnd = this.rnd;
    const N = this.T.concreteN;
    const mats = {
      iron_ore: new THREE.MeshStandardMaterial({ color: 0x7a4430, roughness: 0.7, metalness: 0.35, normalMap: N, flatShading: true }),
      copper_ore: new THREE.MeshStandardMaterial({ color: 0x4f8a64, roughness: 0.55, metalness: 0.45, normalMap: N, flatShading: true }),
      coal: new THREE.MeshStandardMaterial({ color: 0x19191b, roughness: 0.35, metalness: 0.25, flatShading: true }),
      stone: new THREE.MeshStandardMaterial({ color: 0xa29d94, roughness: 0.95, normalMap: N, flatShading: true }),
      quartz: new THREE.MeshStandardMaterial({ color: 0xa9d4f0, roughness: 0.06, metalness: 0.1, emissive: 0x3a6a9a, emissiveIntensity: 0.35, transparent: true, opacity: 0.92 }),
      bauxite: new THREE.MeshStandardMaterial({ color: 0xa4532e, roughness: 0.92, metalness: 0.05, normalMap: N, flatShading: true }),
      sulfur: new THREE.MeshStandardMaterial({ color: 0xe0c828, roughness: 0.45, metalness: 0.05, emissive: 0x3a3000, emissiveIntensity: 0.6, flatShading: true }),
      uranium_ore: new THREE.MeshStandardMaterial({ color: 0x6ad050, roughness: 0.2, metalness: 0.1, emissive: 0x2fbf3a, emissiveIntensity: 0.9, transparent: true, opacity: 0.93 }),
      oil: new THREE.MeshStandardMaterial({ color: 0x0a0908, roughness: 0.04, metalness: 0.35, envMapIntensity: 1.6 }),
    };
    const crystal = new THREE.OctahedronGeometry(0.5, 0); crystal.scale(0.45, 1.6, 0.45);
    const sulfGeo = new THREE.DodecahedronGeometry(0.8, 0);
    const geo = rockGeo(3, 0);
    const puddle = new THREE.CircleGeometry(1, 18); puddle.rotateX(-Math.PI / 2);
    {
      const p = puddle.attributes.position;
      for (let i = 1; i < p.count; i++) { const k = 0.8 + Math.sin(i * 2.3) * 0.15 + Math.cos(i * 5.1) * 0.08; p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); }
    }
    const bubble = new THREE.SphereGeometry(1, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2);
    const geoFor = { quartz: crystal, uranium_ore: crystal, sulfur: sulfGeo, oil: puddle };
    const lists = {};
    const bubbles = [];
    for (let y = 0; y < wd.h; y++) for (let x = 0; x < wd.w; x++) {
      const i = wd.idx(x, y);
      const ore = ORE_TYPES[wd.ore[i]];
      if (!ore) continue;
      const n = ore === 'oil' ? 1 + (wd.purity[i] > 1 ? 1 : 0) : 3 + wd.purity[i] * 2;
      for (let k = 0; k < n; k++) (lists[ore] ||= []).push([x, y, k]);
      if (ore === 'oil') for (let k = 0; k < 2 + wd.purity[i]; k++) bubbles.push([x, y]);
    }
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
    for (const [ore, list] of Object.entries(lists)) {
      const mesh = new THREE.InstancedMesh(geoFor[ore] || geo, mats[ore], list.length);
      const cryst = ore === 'quartz' || ore === 'uranium_ore';
      mesh.castShadow = ore !== 'oil'; mesh.receiveShadow = true;
      list.forEach(([x, y, k], i) => {
        if (ore === 'oil') {
          const sc = k === 0 ? 0.55 + rnd() * 0.25 : 0.3 + rnd() * 0.2;
          p.set((x + 0.25 + rnd() * 0.5) * TILE, 0.025 + k * 0.004, (y + 0.25 + rnd() * 0.5) * TILE);
          q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * 6.28);
          s.set(sc * TILE * 0.5 * (1 + rnd() * 0.4), 1, sc * TILE * 0.5);
          mesh.setMatrixAt(i, m.compose(p, q, s));
          return;
        }
        const sc = cryst ? 0.35 + rnd() * 0.45 : ore === 'sulfur' ? 0.18 + rnd() * 0.22 : 0.22 + rnd() * 0.32;
        p.set((x + 0.15 + rnd() * 0.7) * TILE, cryst ? sc * 0.3 : sc * 0.15, (y + 0.15 + rnd() * 0.7) * TILE);
        e.set(cryst ? (rnd() - 0.5) * 0.8 : rnd() * 6, rnd() * 6, cryst ? (rnd() - 0.5) * 0.8 : 0);
        q.setFromEuler(e); s.set(sc * (0.8 + rnd() * 0.5), sc * (ore === 'sulfur' ? 0.7 : 1), sc * (0.8 + rnd() * 0.5));
        mesh.setMatrixAt(i, m.compose(p, q, s));
      });
      this.scene.add(mesh);
    }
    if (bubbles.length) {
      const bm = new THREE.InstancedMesh(bubble, mats.oil, bubbles.length);
      bubbles.forEach(([x, y], i) => {
        const r = 0.04 + rnd() * 0.07;
        p.set((x + 0.25 + rnd() * 0.5) * TILE, 0.02, (y + 0.25 + rnd() * 0.5) * TILE);
        q.identity(); s.set(r, r * 0.8, r);
        bm.setMatrixAt(i, m.compose(p, q, s));
      });
      this.scene.add(bm);
    }
    this.oreMats = mats;
  }
  buildRocks() {
    const wd = this.world, rnd = this.rnd;
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, normalMap: this.T.concreteN, flatShading: true, map: this.T.concrete });
    const geos = [rockGeo(1, 1), rockGeo(7, 1)];
    const items = [[], []];
    for (let y = 0; y < wd.h; y++) for (let x = 0; x < wd.w; x++) {
      const i = wd.idx(x, y);
      const t = wd.terrain[i], b = wd.biome[i];
      if (t === T_ROCK) {
        for (let k = 0; k < 3; k++) items[k % 2].push({ x: (x + 0.2 + rnd() * 0.6) * TILE, z: (y + 0.2 + rnd() * 0.6) * TILE, s: 0.9 + rnd() * 0.8, y: 0.2, tile: null, sy: (b === B_DESERT ? 1.5 : 1.1) + rnd() * 0.9, b });
      } else if (!wd.ore[i] && t !== T_WATER && t !== T_LAVA && t !== T_SNOW && rnd() < (t === T_ASH ? 0.08 : t === T_GRASS || t === T_DIRT || t === T_RED ? 0.05 : 0.02)) {
        items[0].push({ x: (x + rnd()) * TILE, z: (y + rnd()) * TILE, s: 0.12 + rnd() * 0.25, y: 0, tile: [x, y], sy: 1, b });
      }
    }
    for (let i = 0; i < 380; i++) {
      const ang = rnd() * Math.PI * 2;
      const wx = MAP_W * TILE / 2 + Math.cos(ang) * (MAP_W * TILE * (0.55 + rnd() * 0.35));
      const wz = MAP_H * TILE / 2 + Math.sin(ang) * (MAP_H * TILE * (0.62 + rnd() * 0.45));
      const tx = wx / TILE, tz = wz / TILE;
      if (tx > -1 && tz > -1 && tx < MAP_W + 1 && tz < MAP_H + 1) continue;
      items[1].push({ x: wx, z: wz, s: 1 + rnd() * 3, y: this.heightAt(wx, wz) - 0.3, tile: null, sy: 0.8 + rnd(), b: this.edgeBiome(tx, tz) });
    }
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
    items.forEach((list, gi) => {
      if (!list.length) return;
      const mesh = new THREE.InstancedMesh(geos[gi], mat, list.length);
      mesh.castShadow = true; mesh.receiveShadow = true;
      list.forEach((r, i) => {
        p.set(r.x, r.y + r.s * 0.2, r.z); e.set(rnd() * 0.4, rnd() * 6, rnd() * 0.4); q.setFromEuler(e);
        s.set(r.s, r.s * r.sy, r.s * (0.8 + rnd() * 0.4));
        mesh.setMatrixAt(i, m.compose(p, q, s));
        c.copy(ROCK_TINT[r.b]).multiplyScalar(0.85 + rnd() * 0.3);
        mesh.setColorAt(i, c);
        if (r.tile) this.track(r.tile[0], r.tile[1], mesh, i);
      });
      this.scene.add(mesh);
    });
  }
  buildTrees() {
    const wd = this.world, rnd = this.rnd;
    const pine = treeGeos();
    const G = {
      [TK_PINE]: pine, [TK_BROAD]: broadGeos(), [TK_PALM]: palmGeos(), [TK_CACTUS]: cactusGeos(),
      [TK_DEAD]: deadGeos(), [TK_SNOWPINE]: snowPineGeos(),
    };
    const trunkMats = {
      def: new THREE.MeshStandardMaterial({ color: 0x4a3626, roughness: 0.95 }),
      palm: new THREE.MeshStandardMaterial({ color: 0x7a6248, roughness: 0.95, map: this.T.concrete }),
      dead: new THREE.MeshStandardMaterial({ color: 0x3d3530, roughness: 0.98 }),
    };
    const folMats = {
      def: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0 }),
      snow: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0, vertexColors: true }),
      palm: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0, side: THREE.DoubleSide }),
    };
    const trunkMat = (k) => (k === TK_PALM ? trunkMats.palm : k === TK_DEAD ? trunkMats.dead : trunkMats.def);
    const folMat = (k) => (k === TK_SNOWPINE ? folMats.snow : k === TK_PALM ? folMats.palm : folMats.def);
    const folColor = (k, c) => {
      switch (k) {
        case TK_BROAD: return c.setHSL(0.22 + rnd() * 0.08, 0.38 + rnd() * 0.2, 0.12 + rnd() * 0.07);
        case TK_PALM: return c.setHSL(0.24 + rnd() * 0.05, 0.45, 0.16 + rnd() * 0.06);
        case TK_CACTUS: return c.setHSL(0.28 + rnd() * 0.04, 0.35, 0.17 + rnd() * 0.05);
        case TK_SNOWPINE: { const v = 0.8 + rnd() * 0.2; return c.setRGB(v, v, v * 1.02); }
        default: return c.setHSL(0.25 + rnd() * 0.08, 0.32 + rnd() * 0.2, 0.075 + rnd() * 0.05);
      }
    };
    const inner = {}, outer = {};
    const add = (bag, k, t) => (bag[k] ||= []).push(t);
    for (let y = 0; y < wd.h; y++) for (let x = 0; x < wd.w; x++) {
      const i = wd.idx(x, y);
      const n = wd.tree[i];
      if (!n) continue;
      const k = wd.treeKind[i];
      for (let j = 0; j < n; j++) add(inner, k, { x: (x + 0.2 + rnd() * 0.6) * TILE, z: (y + 0.2 + rnd() * 0.6) * TILE, s: 0.8 + rnd() * 0.7, tile: [x, y], y: 0 });
    }
    // dış orman (kenar biyomuna göre)
    const outerN = this.quality === 'low' ? 400 : this.quality === 'medium' ? 900 : 1500;
    const dens = [1, 0.15, 0.9, 0.25];
    let placed = 0;
    for (let i = 0; i < outerN * 6 && placed < outerN + 1200; i++) {
      const wx = (-MARGIN * 0.9 + rnd() * (MAP_W + MARGIN * 1.8)) * TILE;
      const wz = (-MARGIN * 0.9 + rnd() * (MAP_H + MARGIN * 1.8)) * TILE;
      const tx = wx / TILE, tz = wz / TILE;
      if (tx > -0.5 && tz > -0.5 && tx < MAP_W + 0.5 && tz < MAP_H + 0.5) continue;
      const h = this.heightAt(wx, wz);
      const b = this.edgeBiome(tx, tz);
      if (h > (b === B_TUNDRA ? 10 : 13) || this.noise.fbm(tx * 0.08, tz * 0.08, 3) < 0.45) continue;
      if (rnd() > dens[b]) continue;
      let k;
      if (b === B_DESERT) k = rnd() < 0.5 ? TK_PALM : TK_CACTUS;
      else if (b === B_TUNDRA) k = TK_SNOWPINE;
      else if (b === B_VOLCANIC) k = TK_DEAD;
      else k = this.noise.n2(tx * 0.11 + 7, tz * 0.11 + 3) > 0.5 ? TK_BROAD : TK_PINE;
      add(outer, k, { x: wx, z: wz, s: 0.9 + rnd() * 1.1, tile: null, y: h - 0.1 });
      placed++;
    }
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
    const up = new THREE.Vector3(0, 1, 0);
    const make = (k, list, shadows) => {
      const g = G[k];
      const tm = g.trunk ? new THREE.InstancedMesh(g.trunk, trunkMat(k), list.length) : null;
      const fm = g.fol ? new THREE.InstancedMesh(g.fol, folMat(k), list.length) : null;
      for (const mm of [tm, fm]) if (mm) { mm.castShadow = shadows; mm.receiveShadow = true; }
      list.forEach((t, i) => {
        p.set(t.x, t.y, t.z); q.setFromAxisAngle(up, rnd() * 6.28);
        s.set(t.s, t.s * (0.9 + rnd() * 0.3), t.s);
        m.compose(p, q, s);
        if (tm) tm.setMatrixAt(i, m);
        if (fm) { fm.setMatrixAt(i, m); fm.setColorAt(i, folColor(k, c)); }
        if (t.tile) { if (tm) this.track(t.tile[0], t.tile[1], tm, i); if (fm) this.track(t.tile[0], t.tile[1], fm, i); }
      });
      if (tm) this.scene.add(tm);
      if (fm) this.scene.add(fm);
      return fm;
    };
    for (const [k, list] of Object.entries(inner)) {
      const fm = make(+k, list, true);
      if (+k === TK_PINE || !this.folMesh) this.folMesh = fm || this.folMesh;
    }
    for (const [k, list] of Object.entries(outer)) make(+k, list, false);
  }
  buildGrass() {
    const wd = this.world, rnd = this.rnd;
    const g1 = new THREE.PlaneGeometry(0.9, 0.55); g1.translate(0, 0.27, 0);
    const g2 = g1.clone(); g2.rotateY(Math.PI / 2);
    const g3 = g1.clone(); g3.rotateY(Math.PI / 4);
    const geo = new THREE.BufferGeometry();
    {
      const parts = [g1, g2, g3].map((g) => g.toNonIndexed());
      const pos = [], nor = [], uv = [];
      for (const g of parts) {
        pos.push(...g.attributes.position.array); uv.push(...g.attributes.uv.array);
        for (let i = 0; i < g.attributes.position.count; i++) nor.push(0, 1, 0);
      }
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    }
    const list = [];
    const dens = this.quality === 'high' ? 3 : 1.6;
    for (let y = 0; y < wd.h; y++) for (let x = 0; x < wd.w; x++) {
      const i = wd.idx(x, y);
      const t = wd.terrain[i], b = wd.biome[i];
      if (t !== T_GRASS && !(t === T_DIRT && b === B_TEMPERATE && rnd() < 0.15)) continue;
      if (wd.ore[i]) continue;
      const n = Math.floor(dens * (b === B_TUNDRA ? 0.6 : 1) * (0.5 + this.noise.fbm(x * 0.15, y * 0.15, 2)) + rnd());
      for (let k = 0; k < n; k++) list.push([x, y, b]);
    }
    if (!list.length) return;
    const mat = new THREE.MeshStandardMaterial({
      map: this.T.grass, alphaTest: 0.45, side: THREE.DoubleSide, color: 0xffffff, roughness: 0.9,
    });
    const uni = { uTime: { value: 0 } };
    this.grassUniforms = uni;
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = uni.uTime;
      sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        vec4 ip = instanceMatrix * vec4(0.0,0.0,0.0,1.0);
        float sway = sin(uTime*1.7 + ip.x*0.35 + ip.z*0.25) * 0.5 + sin(uTime*2.9 + ip.x*0.8) * 0.25;
        transformed.x += sway * position.y * 0.35;
        transformed.z += sway * position.y * 0.15;`);
    };
    const mesh = new THREE.InstancedMesh(geo, mat, list.length);
    mesh.receiveShadow = true;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
    list.forEach(([x, y, b], i) => {
      p.set((x + rnd()) * TILE, 0, (y + rnd()) * TILE);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * 6.28);
      const sc = 0.7 + rnd() * 0.8; s.set(sc, sc * (0.7 + rnd() * 0.6), sc);
      mesh.setMatrixAt(i, m.compose(p, q, s));
      if (b === B_TUNDRA) c.setHSL(0.12 + rnd() * 0.05, 0.22, 0.62 + rnd() * 0.2);
      else if (b === B_DESERT) c.setHSL(0.22 + rnd() * 0.06, 0.5, 0.5 + rnd() * 0.2);
      else if (b === B_VOLCANIC) c.setHSL(0.15 + rnd() * 0.06, 0.25, 0.45 + rnd() * 0.2);
      else c.setHSL(0.17 + rnd() * 0.08, 0.35, 0.55 + rnd() * 0.25);
      mesh.setColorAt(i, c);
      this.track(x, y, mesh, i);
    });
    this.scene.add(mesh);
  }
  buildGrid() {
    const geo = new THREE.PlaneGeometry(MAP_W * TILE, MAP_H * TILE);
    geo.rotateX(-Math.PI / 2);
    geo.translate(MAP_W * TILE / 2, 0.06, MAP_H * TILE / 2);
    const t = this.T.grid.clone(); t.repeat.set(MAP_W, MAP_H); t.needsUpdate = true;
    const mat = new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0.18, depthWrite: false, color: 0xd8f0ff });
    this.grid = new THREE.Mesh(geo, mat);
    this.grid.visible = false;
    this.grid.renderOrder = 2;
    this.scene.add(this.grid);
  }
  update(t) {
    if (this.grassUniforms) this.grassUniforms.uTime.value = t;
    this.waterN.offset.set(t * 0.012, t * 0.007);
    if (this.lava) {
      this.lavaTex.offset.set(t * 0.006, Math.sin(t * 0.05) * 0.04);
      this.lava.material.emissiveIntensity = 2.2 + Math.sin(t * 1.3) * 0.25 + Math.sin(t * 3.1) * 0.12;
    }
  }
}
