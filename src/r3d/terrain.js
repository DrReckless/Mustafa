// Arazi: yükseklik, doku karışımı (çimen/toprak/kaya/kum/tarla/kar), nehir suyu
import * as THREE from 'three';
import { tex } from './materials.js';

export const MARGIN = 26;        // oynanabilir alanın dışındaki dekor arazi (karo)
const RES = 2;                   // karo başına köşe sayısı
const SPLAT = 4;                 // karo başına splat pikseli

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}
export function fbm(x, y) {
  return vnoise(x, y) * 0.55 + vnoise(x * 2.1, y * 2.1) * 0.28 + vnoise(x * 4.3, y * 4.3) * 0.17;
}

export class Terrain {
  constructor(N, map) {
    this.N = N; this.map = map;
    this.size = N + MARGIN * 2;
    this.buildRiverField();
    this.buildMesh();
    this.buildWater();
  }

  // Oyun ızgarasında nehir; dış alana doğrusal uzatılır
  isWater(i, j) {
    const N = this.N;
    const jj = Math.max(0, Math.min(N - 1, j));
    if (i < 0 || i >= N) return false;
    return this.map.tiles[jj * N + i] === 1;
  }
  buildRiverField() {
    const N = this.N, S = this.size, R = 4;
    // her karo için en yakın suya uzaklık (karo cinsinden)
    this.wdist = new Float32Array(S * S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const i = x - MARGIN, j = y - MARGIN;
      let best = R;
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        if (this.isWater(i + dx, j + dy)) {
          const d = Math.hypot(dx, dy);
          if (d < best) best = d;
        }
      }
      this.wdist[y * S + x] = best;
    }
  }
  waterDistAt(wx, wz) {
    // wx,wz dünya koordinatı; karo merkezlerinden bilineer
    const S = this.size;
    const fx = wx + this.N / 2 + MARGIN - 0.5, fz = wz + this.N / 2 + MARGIN - 0.5;
    const x0 = Math.max(0, Math.min(S - 2, Math.floor(fx))), z0 = Math.max(0, Math.min(S - 2, Math.floor(fz)));
    const tx = Math.max(0, Math.min(1, fx - x0)), tz = Math.max(0, Math.min(1, fz - z0));
    const a = this.wdist[z0 * S + x0], b = this.wdist[z0 * S + x0 + 1], c = this.wdist[(z0 + 1) * S + x0], d = this.wdist[(z0 + 1) * S + x0 + 1];
    return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz;
  }
  heightAt(wx, wz) {
    const N = this.N, h = N / 2;
    // oynanabilir alan dışına uzaklık
    const ox = Math.max(0, Math.abs(wx) - h), oz = Math.max(0, Math.abs(wz) - h);
    const out = Math.hypot(ox, oz);
    let y = (fbm(wx * 0.15, wz * 0.15) - 0.5) * 0.06;
    const hill = Math.min(1, out / 14);
    y += hill * hill * (1.2 + fbm(wx * 0.07 + 9, wz * 0.07) * 7);
    const wd = this.waterDistAt(wx, wz);
    const bank = Math.max(0, 1 - wd / 1.6);
    y = y * (1 - Math.min(1, bank * 1.5)) - bank * bank * 0.38;
    return y;
  }

  buildMesh() {
    const S = this.size, seg = S * RES;
    const g = new THREE.PlaneGeometry(S, S, seg, seg);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position, uv = g.attributes.uv;
    for (let k = 0; k < pos.count; k++) {
      const x = pos.getX(k), z = pos.getZ(k);
      pos.setY(k, this.heightAt(x, z));
      uv.setXY(k, x * 0.5, z * 0.5);
    }
    g.computeVertexNormals();

    // Splat dokusu: r=toprak/yol, g=kaya, b=kum, a=tarla
    const sp = S * SPLAT;
    this.splatSize = sp;
    this.splatData = new Uint8Array(sp * sp * 4);
    for (let y = 0; y < sp; y++) for (let x = 0; x < sp; x++) {
      const wx = x / SPLAT - S / 2, wz = y / SPLAT - S / 2;
      const ti = Math.floor(wx + this.N / 2), tj = Math.floor(wz + this.N / 2);
      let r = 0, gg = 0, b = 0;
      const wd = this.waterDistAt(wx, wz);
      if (wd < 1.35) b = Math.min(255, (1.35 - wd) / 0.6 * 255);
      if (ti >= 0 && tj >= 0 && ti < this.N && tj < this.N && this.map.tiles[tj * this.N + ti] === 2) gg = 230;
      // dış tepelerde kayalık
      const hgt = this.heightAt(wx, wz);
      if (hgt > 3.2) gg = Math.max(gg, Math.min(255, (hgt - 3.2) * 120 * fbm(wx * 0.3, wz * 0.3)));
      // hafif doğal toprak lekeleri
      const n = fbm(wx * 0.35 + 50, wz * 0.35);
      if (n > 0.7) r = Math.min(80, (n - 0.7) * 700);
      const o = (y * sp + x) * 4;
      this.splatData[o] = r; this.splatData[o + 1] = gg; this.splatData[o + 2] = b; this.splatData[o + 3] = 0;
    }
    this.splat = new THREE.DataTexture(this.splatData, sp, sp, THREE.RGBAFormat);
    this.splat.magFilter = THREE.LinearFilter; this.splat.minFilter = THREE.LinearFilter;
    this.splat.needsUpdate = true;
    this.blurSplatRegion(0, 0, sp, sp, 2);

    const mat = new THREE.MeshStandardMaterial({
      map: tex('leafy_grass_diff'), normalMap: tex('leafy_grass_nor'), roughness: 1, metalness: 0
    });
    this.uniforms = {
      tGrass2: { value: tex('sparse_grass_diff') },
      tDry: { value: tex('withered_grass_diff') },
      tDirt: { value: tex('stony_dirt_path_diff') },
      tRock: { value: tex('aerial_rocks_02_diff') },
      tSand: { value: tex('coast_sand_01_diff') },
      tField: { value: tex('farm_soil_diff') },
      tSnow: { value: tex('snow_field_aerial_diff') },
      tSplat: { value: this.splat },
      uSnow: { value: 0 }, uAutumn: { value: 0 }, uSize: { value: S }
    };
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, this.uniforms);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vTerr;\nvarying float vUpN;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvTerr = position.xz;\nvUpN = normal.y;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
uniform sampler2D tGrass2, tDry, tDirt, tRock, tSand, tField, tSnow, tSplat;
uniform float uSnow, uAutumn, uSize;
varying vec2 vTerr; varying float vUpN;`)
        .replace('#include <map_fragment>', `
vec2 tuv = vMapUv;
vec4 sp = texture2D(tSplat, vTerr / uSize + 0.5);
vec3 g1 = texture2D(map, tuv).rgb;
vec3 g2 = texture2D(tGrass2, tuv * 0.73 + 0.31).rgb;
float macro = texture2D(tGrass2, tuv * 0.043).g;
float mixG = smoothstep(0.35, 0.65, texture2D(tDry, tuv * 0.031 + 0.5).r);
vec3 grass = mix(g1, g2, mixG * 0.35) * vec3(0.95, 1.06, 0.82);
vec3 dry = texture2D(tDry, tuv).rgb;
grass = mix(grass, dry * vec3(1.05, 0.92, 0.7), uAutumn * 0.75);
grass *= mix(0.82, 1.18, macro);
float lum0 = dot(grass, vec3(0.3, 0.59, 0.11));
grass = mix(grass, vec3(lum0) * vec3(0.78, 1.12, 0.5), 0.55 * (1.0 - uAutumn));
vec3 col = grass;
col = mix(col, texture2D(tSand, tuv * 0.8).rgb, sp.b);
col = mix(col, texture2D(tDirt, tuv * 0.9).rgb * 0.95, sp.r);
col = mix(col, texture2D(tRock, tuv * 0.5).rgb, sp.g);
col = mix(col, texture2D(tField, tuv * 0.7).rgb, sp.a);
float sn = uSnow * smoothstep(0.55, 0.85, vUpN) * (0.75 + 0.25 * macro);
col = mix(col, texture2D(tSnow, tuv * 0.5).rgb * 1.05, clamp(sn, 0.0, 1.0));
diffuseColor.rgb *= col;
`);
    };
    this.material = mat;
    this.mesh = new THREE.Mesh(g, mat);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;
  }

  // Splat'e boya: kanal 0=r(toprak) 3=a(tarla); wx,wz dünya dikdörtgeni
  paint(ch, x0, z0, x1, z1, val, mode = 'max', soft = 0.25) {
    const S = this.size, sp = this.splatSize;
    const px0 = Math.max(0, Math.floor((x0 - soft + S / 2) * SPLAT)), px1 = Math.min(sp - 1, Math.ceil((x1 + soft + S / 2) * SPLAT));
    const pz0 = Math.max(0, Math.floor((z0 - soft + S / 2) * SPLAT)), pz1 = Math.min(sp - 1, Math.ceil((z1 + soft + S / 2) * SPLAT));
    for (let y = pz0; y <= pz1; y++) for (let x = px0; x <= px1; x++) {
      const wx = x / SPLAT - S / 2, wz = y / SPLAT - S / 2;
      const dx = Math.max(x0 - wx, 0, wx - x1), dz = Math.max(z0 - wz, 0, wz - z1);
      const d = Math.hypot(dx, dz);
      const f = soft > 0 ? Math.max(0, 1 - d / soft) : (d === 0 ? 1 : 0);
      const o = (y * sp + x) * 4 + ch;
      const v = val * f;
      if (mode === 'max') this.splatData[o] = Math.max(this.splatData[o], v);
      else if (mode === 'set') this.splatData[o] = Math.round(this.splatData[o] * (1 - f) + val * f);
      else if (mode === 'add') this.splatData[o] = Math.min(255, this.splatData[o] + v);
    }
    this.splat.needsUpdate = true;
  }
  blurSplatRegion() { /* yumuşak geçiş zaten doğrusal filtreyle sağlanıyor */ }

  buildWater() {
    const S = this.size;
    const g = new THREE.PlaneGeometry(S, S, 1, 1);
    g.rotateX(-Math.PI / 2);
    const n = tex('water_nor');
    this.waterNor = n;
    n.repeat.set(S / 3, S / 3);
    const m = new THREE.MeshStandardMaterial({
      color: 0x2f5a6a, roughness: 0.06, metalness: 0.15, normalMap: n,
      normalScale: new THREE.Vector2(0.6, 0.6), transparent: true, opacity: 0.88
    });
    this.water = new THREE.Mesh(g, m);
    this.water.position.y = -0.13;
    this.water.receiveShadow = true;
  }
  update(t) {
    if (this.waterNor) this.waterNor.offset.set(t * 0.012, t * 0.02);
  }
}
