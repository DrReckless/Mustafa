import * as THREE from 'three';
import { TILE, MAP_W, MAP_H } from '../config.js';
import { T_GRASS, T_DIRT, T_SAND, T_WATER, T_ROCK, ORE_TYPES } from '../sim/world.js';
import { makeNoise, mulberry32 } from '../util.js';
import { getTextures } from './textures.js';
import { treeGeos, rockGeo } from './models.js';

const MARGIN = 34;
export const WATER_Y = -0.2;

const C = (h) => new THREE.Color(h);
const COL = {
  grassA: C(0x4a5c28), grassB: C(0x6d7a34), dirt: C(0x6b583f), sand: C(0xb5a27a), bed: C(0x4a4434),
  rock: C(0x6f6a62), snow: C(0xe9edf0), cliff: C(0x5d5953),
};
const ORE_TINT = { iron_ore: C(0x5e3a2b), copper_ore: C(0x4b6650), coal: C(0x2a2928), stone: C(0x8d8981), quartz: C(0x8394a4) };

export class Terrain {
  constructor(scene, world, quality) {
    this.scene = scene; this.world = world; this.quality = quality;
    this.noise = makeNoise(world.seed + 5);
    this.rnd = mulberry32(world.seed + 9);
    this.tileInst = new Map(); // karo -> [[mesh, index], ...]
    this.T = getTextures();
    this.buildGround();
    this.buildWater();
    this.buildOres();
    this.buildRocks();
    this.buildTrees();
    if (quality !== 'low') this.buildGrass();
    this.buildGrid();
  }
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
  buildGround() {
    const W = MAP_W + MARGIN * 2, H = MAP_H + MARGIN * 2;
    const geo = new THREE.PlaneGeometry(W * TILE, H * TILE, W, H);
    geo.rotateX(-Math.PI / 2);
    geo.translate((W * TILE) / 2 - MARGIN * TILE, 0, (H * TILE) / 2 - MARGIN * TILE);
    const pos = geo.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    const wd = this.world;
    const tileCol = (x, y) => {
      const i = wd.idx(x, y);
      const t = wd.terrain[i];
      const ore = ORE_TYPES[wd.ore[i]];
      let c;
      if (t === T_WATER) c = COL.bed.clone();
      else if (t === T_SAND) c = COL.sand.clone();
      else if (t === T_ROCK) c = COL.rock.clone();
      else if (t === T_DIRT) c = COL.dirt.clone().lerp(COL.grassA, this.noise.n2(x * 0.3, y * 0.3) * 0.4);
      else c = COL.grassA.clone().lerp(COL.grassB, this.noise.fbm(x * 0.12, y * 0.12, 3));
      if (ore) c.lerp(ORE_TINT[ore], 0.75);
      return c;
    };
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const ix = i % (W + 1), iy = Math.floor(i / (W + 1));
      const tx = ix - MARGIN, ty = iy - MARGIN;
      let h = 0; let c;
      if (tx >= 0 && ty >= 0 && tx <= MAP_W && ty <= MAP_H) {
        let water = 0, n = 0;
        c = new THREE.Color(0, 0, 0);
        for (const [ox, oy] of [[-1, -1], [0, -1], [-1, 0], [0, 0]]) {
          const x = tx + ox, y = ty + oy;
          if (!wd.inside(x, y)) continue;
          n++;
          if (wd.terrain[wd.idx(x, y)] === T_WATER) water++;
          tmp.copy(tileCol(x, y)); c.r += tmp.r; c.g += tmp.g; c.b += tmp.b;
        }
        c.multiplyScalar(1 / Math.max(1, n));
        h = [0, -0.06, -0.38, -0.85, -1.25][water] + (this.noise.n2(tx * 0.9, ty * 0.9) - 0.5) * 0.06;
        if (tx === 0 || ty === 0 || tx === MAP_W || ty === MAP_H) h += 0.05;
      } else {
        h = this.outerHeight(tx, ty);
        const slope = Math.abs(this.outerHeight(tx + 1, ty) - h) + Math.abs(this.outerHeight(tx, ty + 1) - h);
        c = COL.grassA.clone().lerp(COL.grassB, this.noise.fbm(tx * 0.1, ty * 0.1, 3));
        c.lerp(COL.cliff, Math.min(1, slope * 0.35 + Math.max(0, h - 6) * 0.08));
        if (h > 17 + this.noise.n2(tx * 0.3, ty * 0.3) * 4) c.lerp(COL.snow, Math.min(1, (h - 17) * 0.25));
      }
      pos.setY(i, h);
      // hafif rastgele ton
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
    // dış dağlar için yaklaşık yükseklik
    const tx = wx / TILE, ty = wz / TILE;
    if (tx >= 0 && ty >= 0 && tx <= MAP_W && ty <= MAP_H) return 0;
    return this.outerHeight(Math.round(tx), Math.round(ty));
  }
  buildWater() {
    const geo = new THREE.PlaneGeometry(MAP_W * TILE, MAP_H * TILE, 1, 1);
    geo.rotateX(-Math.PI / 2);
    geo.translate(MAP_W * TILE / 2, WATER_Y, MAP_H * TILE / 2);
    const n = this.T.waterN.clone(); n.repeat.set(MAP_W / 4, MAP_H / 4); n.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0f3442, roughness: 0.05, metalness: 0.1, normalMap: n, normalScale: new THREE.Vector2(0.35, 0.35),
      transparent: true, opacity: 0.86, envMapIntensity: 1.4,
    });
    this.water = new THREE.Mesh(geo, mat);
    this.water.receiveShadow = true;
    this.scene.add(this.water);
    this.waterN = n;
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
    const mats = {
      iron_ore: new THREE.MeshStandardMaterial({ color: 0x7a4430, roughness: 0.7, metalness: 0.35, normalMap: this.T.concreteN, flatShading: true }),
      copper_ore: new THREE.MeshStandardMaterial({ color: 0x4f8a64, roughness: 0.55, metalness: 0.45, normalMap: this.T.concreteN, flatShading: true }),
      coal: new THREE.MeshStandardMaterial({ color: 0x19191b, roughness: 0.35, metalness: 0.25, flatShading: true }),
      stone: new THREE.MeshStandardMaterial({ color: 0xa29d94, roughness: 0.95, normalMap: this.T.concreteN, flatShading: true }),
      quartz: new THREE.MeshStandardMaterial({ color: 0xa9d4f0, roughness: 0.06, metalness: 0.1, emissive: 0x3a6a9a, emissiveIntensity: 0.35, transparent: true, opacity: 0.92 }),
    };
    const crystal = new THREE.OctahedronGeometry(0.5, 0); crystal.scale(0.45, 1.6, 0.45);
    const geo = rockGeo(3, 0);
    const lists = {};
    for (let y = 0; y < wd.h; y++) for (let x = 0; x < wd.w; x++) {
      const ore = ORE_TYPES[wd.ore[wd.idx(x, y)]];
      if (!ore) continue;
      const n = 3 + wd.purity[wd.idx(x, y)] * 2;
      for (let k = 0; k < n; k++) (lists[ore] ||= []).push([x, y, k]);
    }
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
    for (const [ore, list] of Object.entries(lists)) {
      const mesh = new THREE.InstancedMesh(ore === 'quartz' ? crystal : geo, mats[ore], list.length);
      mesh.castShadow = true; mesh.receiveShadow = true;
      list.forEach(([x, y, k], i) => {
        const sc = ore === 'quartz' ? 0.35 + rnd() * 0.45 : 0.22 + rnd() * 0.32;
        p.set((x + 0.15 + rnd() * 0.7) * TILE, ore === 'quartz' ? sc * 0.3 : sc * 0.15, (y + 0.15 + rnd() * 0.7) * TILE);
        e.set(ore === 'quartz' ? (rnd() - 0.5) * 0.8 : rnd() * 6, rnd() * 6, ore === 'quartz' ? (rnd() - 0.5) * 0.8 : 0);
        q.setFromEuler(e); s.set(sc * (0.8 + rnd() * 0.5), sc, sc * (0.8 + rnd() * 0.5));
        mesh.setMatrixAt(i, m.compose(p, q, s));
      });
      this.scene.add(mesh);
    }
    this.oreMats = mats;
  }
  buildRocks() {
    const wd = this.world, rnd = this.rnd;
    const mat = new THREE.MeshStandardMaterial({ color: 0x7c776e, roughness: 0.92, normalMap: this.T.concreteN, flatShading: true, map: this.T.concrete });
    const geos = [rockGeo(1, 1), rockGeo(7, 1)];
    const items = [[], []];
    // kayalık karolar
    for (let y = 0; y < wd.h; y++) for (let x = 0; x < wd.w; x++) {
      const t = wd.terrain[wd.idx(x, y)];
      if (t === T_ROCK) {
        for (let k = 0; k < 3; k++) items[k % 2].push({ x: (x + 0.2 + rnd() * 0.6) * TILE, z: (y + 0.2 + rnd() * 0.6) * TILE, s: 0.9 + rnd() * 0.8, y: 0.2, tile: null, sy: 1.1 + rnd() * 0.9 });
      } else if ((t === T_GRASS || t === T_DIRT) && !wd.ore[wd.idx(x, y)] && rnd() < 0.05) {
        items[0].push({ x: (x + rnd()) * TILE, z: (y + rnd()) * TILE, s: 0.12 + rnd() * 0.25, y: 0, tile: [x, y], sy: 1 });
      }
    }
    // dağ kayaları
    for (let i = 0; i < 380; i++) {
      const ang = rnd() * Math.PI * 2;
      const wx = MAP_W * TILE / 2 + Math.cos(ang) * (MAP_W * TILE * (0.55 + rnd() * 0.35));
      const wz = MAP_H * TILE / 2 + Math.sin(ang) * (MAP_H * TILE * (0.62 + rnd() * 0.45));
      const tx = wx / TILE, tz = wz / TILE;
      if (tx > -1 && tz > -1 && tx < MAP_W + 1 && tz < MAP_H + 1) continue;
      items[1].push({ x: wx, z: wz, s: 1 + rnd() * 3, y: this.heightAt(wx, wz) - 0.3, tile: null, sy: 0.8 + rnd() });
    }
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
    items.forEach((list, gi) => {
      const mesh = new THREE.InstancedMesh(geos[gi], mat, list.length);
      mesh.castShadow = true; mesh.receiveShadow = true;
      list.forEach((r, i) => {
        p.set(r.x, r.y + r.s * 0.2, r.z); e.set(rnd() * 0.4, rnd() * 6, rnd() * 0.4); q.setFromEuler(e);
        s.set(r.s, r.s * r.sy, r.s * (0.8 + rnd() * 0.4));
        mesh.setMatrixAt(i, m.compose(p, q, s));
        if (r.tile) this.track(r.tile[0], r.tile[1], mesh, i);
      });
      this.scene.add(mesh);
    });
  }
  buildTrees() {
    const wd = this.world, rnd = this.rnd;
    const { trunk, fol } = treeGeos();
    const list = [];
    for (let y = 0; y < wd.h; y++) for (let x = 0; x < wd.w; x++) {
      const t = wd.tree[wd.idx(x, y)];
      if (!t) continue;
      for (let k = 0; k < t; k++) list.push({ x: (x + 0.2 + rnd() * 0.6) * TILE, z: (y + 0.2 + rnd() * 0.6) * TILE, s: 0.8 + rnd() * 0.7, tile: [x, y], y: 0 });
    }
    // dış orman
    const outer = this.quality === 'low' ? 400 : this.quality === 'medium' ? 900 : 1500;
    for (let i = 0; i < outer * 4 && list.length < outer + 1200; i++) {
      const wx = (-MARGIN * 0.9 + rnd() * (MAP_W + MARGIN * 1.8)) * TILE;
      const wz = (-MARGIN * 0.9 + rnd() * (MAP_H + MARGIN * 1.8)) * TILE;
      const tx = wx / TILE, tz = wz / TILE;
      if (tx > -0.5 && tz > -0.5 && tx < MAP_W + 0.5 && tz < MAP_H + 0.5) continue;
      const h = this.heightAt(wx, wz);
      if (h > 13 || this.noise.fbm(tx * 0.08, tz * 0.08, 3) < 0.45) continue;
      list.push({ x: wx, z: wz, s: 0.9 + rnd() * 1.1, tile: null, y: h - 0.1 });
      if (list.length > outer + 1200) break;
    }
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3626, roughness: 0.95 });
    const folMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0 });
    const tm = new THREE.InstancedMesh(trunk, trunkMat, list.length);
    const fm = new THREE.InstancedMesh(fol, folMat, list.length);
    tm.castShadow = fm.castShadow = true; tm.receiveShadow = fm.receiveShadow = true;
    // harita içindeki ağaçlar önce gelir; dışarıdakiler gölge düşürmeyen ayrı ağda
    const inner = list.filter((t) => t.tile).length;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3(), c = new THREE.Color();
    list.forEach((t, i) => {
      p.set(t.x, t.y, t.z); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * 6.28);
      s.set(t.s, t.s * (0.9 + rnd() * 0.3), t.s);
      m.compose(p, q, s);
      tm.setMatrixAt(i, m); fm.setMatrixAt(i, m);
      c.setHSL(0.25 + rnd() * 0.08, 0.32 + rnd() * 0.2, 0.075 + rnd() * 0.05);
      fm.setColorAt(i, c);
      if (t.tile) { this.track(t.tile[0], t.tile[1], tm, i); this.track(t.tile[0], t.tile[1], fm, i); }
    });
    tm.count = fm.count = inner;
    const om = new THREE.InstancedMesh(fol, folMat, Math.max(1, list.length - inner));
    const ot = new THREE.InstancedMesh(trunk, trunkMat, Math.max(1, list.length - inner));
    om.receiveShadow = true; ot.receiveShadow = true;
    for (let i = inner; i < list.length; i++) {
      tm.getMatrixAt(i, m); om.setMatrixAt(i - inner, m); ot.setMatrixAt(i - inner, m);
      fm.getColorAt(i, c); om.setColorAt(i - inner, c);
    }
    om.count = ot.count = list.length - inner;
    this.scene.add(tm, fm, om, ot);
    this.folMesh = fm; this.trunkMesh = tm;
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
      const t = wd.terrain[i];
      if (t !== T_GRASS && !(t === T_DIRT && rnd() < 0.15)) continue;
      if (wd.ore[i]) continue;
      const n = Math.floor(dens * (0.5 + this.noise.fbm(x * 0.15, y * 0.15, 2)) + rnd());
      for (let k = 0; k < n; k++) list.push([x, y]);
    }
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
    list.forEach(([x, y], i) => {
      p.set((x + rnd()) * TILE, 0, (y + rnd()) * TILE);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * 6.28);
      const sc = 0.7 + rnd() * 0.8; s.set(sc, sc * (0.7 + rnd() * 0.6), sc);
      mesh.setMatrixAt(i, m.compose(p, q, s));
      c.setHSL(0.17 + rnd() * 0.08, 0.35, 0.55 + rnd() * 0.25);
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
  }
}
