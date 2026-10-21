// Doku yükleme ve malzeme kütüphanesi
import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const cache = {};
let maxAniso = 4;
let maxSize = 1024;

export function setAniso(a) { maxAniso = a; }
export function setMaxTexSize(s) { maxSize = s; }

// Düşük kalitede dokuları küçült (telefon belleği için)
function shrink(img) {
  const w = img.width || 0;
  if (!w || w <= maxSize) return img;
  const k = maxSize / w;
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c;
}

function loadTex(url, srgb) {
  return new Promise((res) => {
    loader.load(url, (t) => {
      t.image = shrink(t.image);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = maxAniso;
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      res(t);
    }, undefined, () => { console.warn('doku yüklenemedi', url); res(null); });
  });
}

// PBR set: diff + nor + arm (ao/roughness/metal)
const SETS = ['sparse_grass', 'leafy_grass', 'withered_grass', 'farm_soil', 'stony_dirt_path', 'aerial_rocks_02',
  'coast_sand_01', 'snow_field_aerial', 'clay_plaster', 'plastered_wall', 'large_sandstone_blocks', 'stone_wall',
  'clay_roof_tiles_02', 'weathered_planks', 'marble_01', 'pine_bark', 'dark_wooden_planks', 'rock_06'];
const SINGLES = [
  ['foliage_green', 'png', true], ['foliage_autumn', 'png', true], ['foliage_spring', 'png', true],
  ['pine_card', 'png', true], ['pine_card_snow', 'png', true], ['wheat_ripe', 'png', true], ['wheat_green', 'png', true],
  ['kilim', 'jpg', true], ['water_nor', 'jpg', false], ['smoke', 'png', true], ['grass_card', 'png', true]
];

export async function loadAll(base, onProgress) {
  const jobs = [];
  let done = 0;
  const total = SETS.length * 3 + SINGLES.length;
  const tick = () => { done++; onProgress && onProgress(done / total); };
  for (const s of SETS) {
    for (const k of ['diff', 'nor', 'arm']) {
      jobs.push(loadTex(`${base}/${s}_${k}.jpg`, k === 'diff').then((t) => { cache[`${s}_${k}`] = t; tick(); }));
    }
  }
  for (const [n, ext, srgb] of SINGLES) {
    jobs.push(loadTex(`${base}/${n}.${ext}`, srgb).then((t) => { cache[n] = t; tick(); }));
  }
  await Promise.all(jobs);
}

export function tex(name) { return cache[name]; }

// Aynı dokunun farklı tekrar ayarlı kopyası
function rep(t, r) {
  if (!t) return null;
  if (r === 1) return t;
  const c = t.clone();
  c.repeat.set(r, r);
  c.needsUpdate = true;
  return c;
}

export function pbr(set, opts = {}) {
  const r = opts.repeat || 1;
  const m = new THREE.MeshStandardMaterial({
    map: rep(cache[set + '_diff'], r),
    normalMap: rep(cache[set + '_nor'], r),
    roughnessMap: rep(cache[set + '_arm'], r),
    aoMap: null,
    roughness: opts.roughness ?? 1,
    metalness: opts.metalness ?? 0,
    color: opts.color ? new THREE.Color(opts.color) : new THREE.Color(0xffffff),
    side: opts.side || THREE.FrontSide
  });
  if (m.normalMap) m.normalScale.set(opts.normal ?? 1, opts.normal ?? 1);
  return m;
}

export const M = {};

export function buildLibrary() {
  // UV'ler dünya biriminde (1 birim = 1 karo ≈ 6 m). Tekrar sayısı dokunun gerçek boyutuna göre.
  M.plaster = pbr('plastered_wall', { repeat: 2.5, color: 0xe2c9a0 });
  M.plasterWarm = pbr('clay_plaster', { repeat: 2.5, color: 0xffe2bd });
  M.plasterLight = pbr('plastered_wall', { repeat: 2.5, color: 0xf1e2c8 });
  M.white = pbr('plastered_wall', { repeat: 2.5, color: 0xf7f1e6 });
  M.stoneCut = pbr('marble_01', { repeat: 2.2, color: 0xf2e6cf, roughness: 0.9 });
  M.stoneRough = pbr('stone_wall', { repeat: 3, color: 0xe8dcc8 });
  M.stoneGrey = pbr('large_sandstone_blocks', { repeat: 2.5, color: 0xd8d0c4 });
  M.roof = pbr('clay_roof_tiles_02', { repeat: 2.6, color: 0xffffff });
  M.wood = pbr('weathered_planks', { repeat: 2.5, color: 0xc9a27a });
  M.woodDark = pbr('dark_wooden_planks', { repeat: 2.5, color: 0xb08a66 });
  M.bark = pbr('pine_bark', { repeat: 1.5, color: 0xb59a80 });
  M.soilRoof = pbr('stony_dirt_path', { repeat: 2, color: 0xe8d6b8 });
  M.rock = pbr('rock_06', { repeat: 1.2, color: 0xd6d0c6 });
  M.lead = new THREE.MeshStandardMaterial({ color: 0x8f989e, metalness: 0.3, roughness: 0.62, normalMap: rep(cache.plastered_wall_nor, 3), normalScale: new THREE.Vector2(0.4, 0.4) });
  M.dark = new THREE.MeshStandardMaterial({ color: 0x1b140f, roughness: 1 });
  M.darkBlue = new THREE.MeshStandardMaterial({ color: 0x2a3440, roughness: 0.6 });
  M.gold = new THREE.MeshStandardMaterial({ color: 0xd9aa45, metalness: 1, roughness: 0.3 });
  M.bronze = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, metalness: 0.9, roughness: 0.4 });
  M.waterSmall = new THREE.MeshStandardMaterial({ color: 0x3d6f86, metalness: 0.1, roughness: 0.08, normalMap: cache.water_nor });
  M.leather = new THREE.MeshStandardMaterial({ color: 0x9c7450, roughness: 0.85, side: THREE.DoubleSide });
  M.wool = new THREE.MeshStandardMaterial({ color: 0xece6da, roughness: 1 });
  M.woolDark = new THREE.MeshStandardMaterial({ color: 0x2e2622, roughness: 0.9 });
  M.camel = new THREE.MeshStandardMaterial({ color: 0xb48a58, roughness: 0.95 });
  M.sack = new THREE.MeshStandardMaterial({ color: 0xc9b38a, roughness: 1 });
  M.logEnd = new THREE.MeshStandardMaterial({ color: 0xd9b585, roughness: 0.9 });
  M.kilim = new THREE.MeshStandardMaterial({ map: cache.kilim, roughness: 0.95, side: THREE.DoubleSide });
  M.glow = new THREE.MeshStandardMaterial({ color: 0x331100, emissive: 0xff6a1a, emissiveIntensity: 2.2 });
  M.glass = new THREE.MeshStandardMaterial({ color: 0xdfeef5, emissive: 0x8fb8c8, emissiveIntensity: 0.25, roughness: 0.2 });
  M.fabric = [0xa8322b, 0x2f6b4a, 0x2d4f86, 0xc8922c, 0xe9e0cc].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95, side: THREE.DoubleSide }));
  M.fruit = [0xc0392b, 0xe67e22, 0xf1c40f, 0x6a8f2a, 0x7b2d5a].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 }));
  M.flag = new THREE.MeshStandardMaterial({ map: flagTexture(), roughness: 0.9, side: THREE.DoubleSide });
  M.cloth = new THREE.MeshStandardMaterial({ color: 0xeee6d3, roughness: 0.95, side: THREE.DoubleSide });
  M.skin = new THREE.MeshStandardMaterial({ color: 0xd8a47c, roughness: 0.8 });
  M.rope = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 1 });
  M.clay = new THREE.MeshStandardMaterial({ color: 0xa65b35, roughness: 0.85 });
}

function flagTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 160;
  const x = c.getContext('2d');
  x.fillStyle = '#b3141b'; x.fillRect(0, 0, 256, 160);
  x.fillStyle = '#f4efe4';
  x.beginPath(); x.arc(110, 80, 44, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#b3141b';
  x.beginPath(); x.arc(124, 80, 36, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#f4efe4';
  x.beginPath();
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 9 : 22;
    x.lineTo(168 + Math.cos(a) * r, 80 + Math.sin(a) * r);
  }
  x.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function stripeTexture(c1, c2) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const x = c.getContext('2d');
  for (let k = 0; k < 8; k++) { x.fillStyle = k % 2 ? c2 : c1; x.fillRect(k * 16, 0, 16, 128); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
