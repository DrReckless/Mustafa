// Genişletilmiş binaların 3D modelleri
import * as THREE from 'three';
import { Builder, V, domeGeo, boxGeo, cylGeo } from './geom.js';
import { M, tex } from './materials.js';
import { registerModels, H } from './buildings.js';

const { rnd, door, win, roofGable, roofHip, logPile, sack, barrel, crate, jar, rock } = H;

function minaret(b, x, z, h, mat = M.stoneCut, rr = 0.06) {
  b.box(mat, x, 0.04, z, rr * 2.6, 0.25, rr * 2.6);
  b.cyl(mat, x, 0.29, z, rr, rr * 1.12, h, 12);
  b.cyl(mat, x, 0.29 + h * 0.82, z, rr * 1.5, rr * 1.05, rr * 0.8, 12);
  b.cyl(mat, x, 0.29 + h * 0.82 + rr * 0.8, z, rr * 1.5, rr * 1.5, rr * 0.25, 12);
  b.add(new THREE.ConeGeometry(rr, rr * 5, 12), M.lead, x, 0.29 + h + rr * 2.5, z);
  b.cyl(M.gold, x, 0.29 + h + rr * 5, z, 0.005, 0.005, 0.06, 5);
}
function smallTree(b, x, z, s = 1, fruit = null, r = Math.random) {
  b.cyl(M.bark, x, 0, z, 0.018 * s, 0.026 * s, 0.22 * s, 6);
  const leaf = M.treeLeaf || (M.treeLeaf = new THREE.MeshStandardMaterial({ color: 0x5f8a35, roughness: 0.9 }));
  for (let k = 0; k < 4; k++) {
    const a = k / 4 * Math.PI * 2 + r();
    b.add(new THREE.IcosahedronGeometry(0.09 * s, 1), leaf, x + Math.cos(a) * 0.06 * s, 0.27 * s + r() * 0.06 * s, z + Math.sin(a) * 0.06 * s);
  }
  b.add(new THREE.IcosahedronGeometry(0.1 * s, 1), leaf, x, 0.36 * s, z);
  if (fruit) for (let k = 0; k < 7; k++) {
    const a = r() * Math.PI * 2;
    b.add(new THREE.SphereGeometry(0.016 * s, 6, 5), fruit, x + Math.cos(a) * 0.12 * s, 0.24 * s + r() * 0.16 * s, z + Math.sin(a) * 0.12 * s);
  }
}
function horse(color) {
  const hb = new Builder();
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.75 });
  hb.add(new THREE.SphereGeometry(0.06, 10, 8), m, 0, 0.13, 0, 0, 0, 0, 1.7, 0.8, 0.8);
  hb.beam(m, V(0.08, 0.15, 0), V(0.13, 0.24, 0), 0.022);
  hb.add(new THREE.SphereGeometry(0.025, 8, 6), m, 0.15, 0.25, 0, 0, 0, 0, 1.7, 0.8, 0.8);
  for (const [lx, lz] of [[0.07, 0.025], [0.07, -0.025], [-0.07, 0.025], [-0.07, -0.025]]) hb.cyl(m, lx, 0, lz, 0.008, 0.009, 0.11, 5);
  hb.beam(M.woolDark, V(-0.1, 0.15, 0), V(-0.13, 0.08, 0), 0.008);
  return hb.build();
}
function soldier(b, x, z, ry, kind) {
  const col = kind === 'okcu' ? M.fabric[1] : kind === 'sipahi' ? M.fabric[0] : M.fabric[2];
  b.cyl(col, x, 0.02, z, 0.02, 0.03, 0.13, 6);
  b.add(new THREE.SphereGeometry(0.02, 6, 5), M.skin, x, 0.165, z);
  b.cyl(M.white, x, 0.18, z, 0.018, 0.022, 0.03, 6);
  if (kind !== 'okcu') b.beam(M.woodDark, V(x + 0.03, 0, z), V(x + 0.03, 0.3, z), 0.004);
}

const MODELS = {
  kuyu(b) {
    b.box(M.stoneRough, 0.5, 0, 0.5, 0.5, 0.02, 0.5);
    b.cyl(M.stoneRough, 0.5, 0.02, 0.5, 0.13, 0.14, 0.13, 12);
    b.add(new THREE.CircleGeometry(0.11, 12), M.waterSmall, 0.5, 0.12, 0.5, 0, -Math.PI / 2);
    for (const x of [0.36, 0.64]) b.cyl(M.woodDark, x, 0.02, 0.5, 0.012, 0.012, 0.32, 5);
    b.beam(M.woodDark, V(0.36, 0.3, 0.5), V(0.64, 0.3, 0.5), 0.01);
    roofGable(b, 0.5, 0.34, 0.5, 0.36, 0.2, 0.08, M.roof, M.wood, 0.03);
    b.beam(M.rope, V(0.5, 0.3, 0.5), V(0.5, 0.18, 0.5), 0.003);
    b.cyl(M.woodDark, 0.5, 0.14, 0.5, 0.02, 0.018, 0.04, 6);
    b.cyl(M.woodDark, 0.72, 0.02, 0.62, 0.03, 0.025, 0.05, 6);
  },

  imaret(b, g) {
    b.box(M.stoneCut, 1, 0, 1, 1.9, 0.03, 1.9);
    b.box(M.stoneCut, 0.55, 0.03, 0.75, 0.9, 0.32, 1.2);
    b.box(M.stoneCut, 1.35, 0.03, 0.55, 0.8, 0.3, 0.8);
    for (let k = 0; k < 3; k++) b.add(domeGeo(0.14, 14, 0.8), M.lead, 0.55, 0.35, 0.35 + k * 0.4);
    for (let k = 0; k < 4; k++) {
      const x = 1.15 + (k % 2) * 0.4, z = 0.35 + Math.floor(k / 2) * 0.4;
      b.cyl(M.stoneCut, x, 0.33, z, 0.04, 0.05, 0.16, 8);
      b.add(new THREE.ConeGeometry(0.05, 0.08, 8), M.lead, x, 0.53, z);
    }
    door(b, '+z', 0.55, 0.03, 1.355, 0.14, 0.24, true);
    win(b, '+x', 1.005, 0.13, 0.75, 0.07, 0.1);
    // kazan
    b.add(new THREE.SphereGeometry(0.1, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.bronze, 1.35, 0.15, 1.45);
    b.cyl(M.stoneRough, 1.35, 0.03, 1.45, 0.12, 0.13, 0.06, 10);
    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.04, 8), M.glow);
    glow.position.set(1.35, 0.06, 1.585); b.mesh(glow); g.glow = glow;
    for (let k = 0; k < 3; k++) b.box(M.wood, 1.0 + k * 0.25, 0.03, 1.7, 0.18, 0.07, 0.07);
    g.smoke = [V(1.15, 0.6, 0.35), V(1.55, 0.6, 0.75)];
  },

  subasi(b) {
    b.box(M.stoneRough, 0.5, 0, 0.5, 0.6, 0.36, 0.55);
    b.box(M.wood, 0.5, 0.36, 0.52, 0.66, 0.22, 0.62);
    b.box(M.woodDark, 0.5, 0.36, 0.84, 0.66, 0.02, 0.06);
    for (let k = 0; k < 5; k++) b.cyl(M.woodDark, 0.2 + k * 0.15, 0.38, 0.86, 0.006, 0.006, 0.1, 4);
    roofHip(b, 0.5, 0.58, 0.52, 0.66, 0.62, 0.22, M.roof, 0.1);
    door(b, '+z', 0.5, 0, 0.775, 0.12, 0.22, true);
    win(b, '+x', 0.805, 0.42, 0.52, 0.08, 0.1);
    for (let k = 0; k < 3; k++) b.beam(M.woodDark, V(0.12 + k * 0.05, 0, 0.92), V(0.1 + k * 0.05, 0.32, 0.9), 0.005);
    b.add(new THREE.CircleGeometry(0.05, 10), M.fabric[0], 0.88, 0.15, 0.85);
  },

  darussifa(b) {
    const m = M.stoneCut;
    b.box(m, 1, 0, 1, 1.9, 0.03, 1.9);
    b.box(m, 1, 0.03, 0.3, 1.7, 0.36, 0.4);
    b.box(m, 0.3, 0.03, 1.1, 0.4, 0.36, 1.2);
    b.box(m, 1.7, 0.03, 1.1, 0.4, 0.36, 1.2);
    for (let k = 0; k < 6; k++) b.add(domeGeo(0.1, 12, 0.8), M.lead, 0.4 + k * 0.24, 0.39, 0.3);
    for (let k = 0; k < 3; k++) { b.add(domeGeo(0.1, 12, 0.8), M.lead, 0.3, 0.39, 0.75 + k * 0.3); b.add(domeGeo(0.1, 12, 0.8), M.lead, 1.7, 0.39, 0.75 + k * 0.3); }
    // avlu revakları
    for (let k = 0; k < 5; k++) b.cyl(m, 0.6 + k * 0.2, 0.03, 0.55, 0.018, 0.02, 0.3, 8);
    b.box(m, 1, 0.33, 0.6, 0.95, 0.04, 0.14);
    b.cyl(m, 1, 0.03, 1.15, 0.12, 0.14, 0.08, 10);
    b.add(new THREE.CircleGeometry(0.11, 12), M.waterSmall, 1, 0.115, 1.15, 0, -Math.PI / 2);
    // taç kapı
    b.box(m, 1, 0.03, 1.82, 0.5, 0.5, 0.12);
    b.arch(M.dark, '+z', 1, 0.03, 1.885, 0.18, 0.34);
    b.box(m, 0.55, 0.03, 1.8, 0.4, 0.28, 0.08); b.box(m, 1.45, 0.03, 1.8, 0.4, 0.28, 0.08);
    win(b, '+x', 1.905, 0.15, 1.0, 0.07, 0.12); win(b, '+x', 1.905, 0.15, 1.4, 0.07, 0.12);
  },

  bostan(b, g, id) {
    const r = rnd(id);
    for (let k = 0; k <= 8; k++) for (const [x, z] of [[k * 0.25, 0.03], [1.97, k * 0.25], [k * 0.25, 1.97], [0.03, k * 0.25]]) b.cyl(M.woodDark, x, 0, z, 0.006, 0.008, 0.1, 4);
    const greens = [new THREE.MeshStandardMaterial({ color: 0x4f8a2a, roughness: 0.9 }), new THREE.MeshStandardMaterial({ color: 0x6aa83a, roughness: 0.9 })];
    for (let row = 0; row < 8; row++) for (let c = 0; c < 9; c++) {
      const x = 0.18 + c * 0.2, z = 0.2 + row * 0.22;
      b.add(new THREE.IcosahedronGeometry(0.045, 0), greens[(row + c) % 2], x, 0.03, z, r() * 3, 0, 0, 1, 0.6, 1);
      if (row % 3 === 1 && c % 2) b.add(new THREE.SphereGeometry(0.02, 6, 5), M.fruit[0], x + 0.03, 0.04, z);
      if (row % 3 === 2 && c % 3 === 0) b.add(new THREE.SphereGeometry(0.03, 6, 5), M.fruit[3], x, 0.03, z, 0, 0, 0, 1.3, 0.8, 1);
    }
    b.cyl(M.stoneRough, 1.75, 0, 0.25, 0.07, 0.08, 0.08, 8);
    b.cyl(M.woodDark, 1.75, 0.08, 0.25, 0.025, 0.02, 0.05, 6);
  },

  meyve(b, g, id) {
    const r = rnd(id);
    for (let z = 0; z < 3; z++) for (let x = 0; x < 3; x++) smallTree(b, 0.33 + x * 0.66, 0.33 + z * 0.66, 0.9 + r() * 0.3, M.fruit[(x + z) % 2 ? 0 : 2], r);
    for (let k = 0; k < 3; k++) b.box(M.wood, 1.7 + k * 0.08, 0, 1.85, 0.07, 0.06, 0.1);
    g.trees = true;
  },

  bag(b, g, id) {
    const r = rnd(id);
    const grape = new THREE.MeshStandardMaterial({ color: 0x4b2050, roughness: 0.4 });
    const vine = new THREE.MeshStandardMaterial({ color: 0x5e8a2c, roughness: 0.9 });
    for (let row = 0; row < 6; row++) {
      const z = 0.2 + row * 0.32;
      for (let c = 0; c < 6; c++) b.cyl(M.woodDark, 0.15 + c * 0.34, 0, z, 0.008, 0.008, 0.2, 4);
      b.beam(M.rope, V(0.15, 0.18, z), V(1.85, 0.18, z), 0.002);
      for (let c = 0; c < 11; c++) {
        const x = 0.2 + c * 0.16;
        b.add(new THREE.IcosahedronGeometry(0.06, 0), vine, x, 0.14, z, r() * 3, 0, 0, 1, 0.8, 0.6);
        if (c % 2) b.add(new THREE.SphereGeometry(0.022, 6, 5), grape, x, 0.09, z + 0.04, 0, 0, 0, 1, 1.3, 1);
      }
    }
    g.trees = true;
  },

  balikci(b) {
    for (const [x, z] of [[0.25, 0.25], [0.65, 0.25], [0.25, 0.6], [0.65, 0.6]]) b.cyl(M.woodDark, x, 0, z, 0.015, 0.015, 0.12, 5);
    b.box(M.wood, 0.45, 0.12, 0.42, 0.52, 0.03, 0.46);
    b.box(M.wood, 0.45, 0.15, 0.4, 0.44, 0.24, 0.36);
    roofGable(b, 0.45, 0.39, 0.4, 0.44, 0.36, 0.16, M.soilRoof, M.wood, 0.06);
    door(b, '+z', 0.45, 0.15, 0.585, 0.1, 0.18, false);
    // balık kurutma askısı
    for (const x of [0.7, 0.95]) b.cyl(M.woodDark, x, 0, 0.85, 0.008, 0.008, 0.25, 4);
    b.beam(M.woodDark, V(0.7, 0.24, 0.85), V(0.95, 0.24, 0.85), 0.005);
    const fish = new THREE.MeshStandardMaterial({ color: 0x9aa5ad, metalness: 0.4, roughness: 0.4 });
    for (let k = 0; k < 5; k++) b.add(new THREE.SphereGeometry(0.018, 6, 4), fish, 0.73 + k * 0.05, 0.2, 0.85, 0, 0, 0, 0.6, 2, 0.4);
    // sandal
    const boat = new THREE.SphereGeometry(0.16, 12, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    b.add(boat, M.woodDark, 0.25, 0.08, 0.88, 0.4, 0, 0, 1.6, 0.5, 0.6);
    b.beam(M.wood, V(0.05, 0.06, 0.95), V(0.4, 0.1, 0.75), 0.006);
    jar(b, 0.85, 0.3);
  },

  arici(b, g, id) {
    b.box(M.wood, 0.25, 0, 0.25, 0.3, 0.22, 0.28);
    roofGable(b, 0.25, 0.22, 0.25, 0.3, 0.28, 0.1, M.soilRoof, M.wood, 0.04);
    const hive = new THREE.MeshStandardMaterial({ color: 0xc9a25a, roughness: 1 });
    for (let k = 0; k < 8; k++) {
      const x = 0.5 + (k % 4) * 0.13, z = 0.55 + Math.floor(k / 4) * 0.22;
      b.box(M.woodDark, x, 0, z, 0.08, 0.04, 0.08);
      b.cyl(hive, x, 0.04, z, 0.04, 0.045, 0.09, 8, 0, 0, 0);
      b.add(domeGeo(0.04, 8, 0.6), hive, x, 0.13, z);
    }
    for (let k = 0; k < 4; k++) b.add(new THREE.SphereGeometry(0.035, 6, 5), M.fruit[4], 0.15 + k * 0.08, 0.02, 0.8);
  },

  mandira(b) {
    b.box(M.stoneRough, 0.45, 0, 0.42, 0.66, 0.04, 0.6);
    b.box(M.white, 0.45, 0.04, 0.42, 0.6, 0.32, 0.54);
    roofGable(b, 0.45, 0.36, 0.42, 0.6, 0.54, 0.2, M.roof, M.white, 0.06);
    door(b, '+z', 0.35, 0.04, 0.695, 0.11, 0.2, false);
    win(b, '+x', 0.755, 0.18, 0.42, 0.08, 0.08);
    const cheese = new THREE.MeshStandardMaterial({ color: 0xf0d886, roughness: 0.6 });
    for (let k = 0; k < 5; k++) b.cyl(cheese, 0.62 + (k % 3) * 0.1, Math.floor(k / 3) * 0.035, 0.85, 0.045, 0.045, 0.035, 12);
    for (let k = 0; k < 3; k++) b.cyl(M.bronze, 0.15 + k * 0.08, 0, 0.85, 0.028, 0.03, 0.08, 8);
  },

  pekmezhane(b, g) {
    b.box(M.stoneRough, 0.4, 0, 0.38, 0.6, 0.04, 0.55);
    b.box(M.plasterWarm, 0.4, 0.04, 0.38, 0.54, 0.3, 0.48);
    b.box(M.soilRoof, 0.4, 0.34, 0.38, 0.6, 0.04, 0.54);
    door(b, '+z', 0.3, 0.04, 0.625, 0.1, 0.2, false);
    b.cyl(M.stoneRough, 0.72, 0, 0.78, 0.13, 0.14, 0.1, 10);
    b.add(new THREE.SphereGeometry(0.12, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.bronze, 0.72, 0.2, 0.78);
    b.add(new THREE.CircleGeometry(0.11, 12), new THREE.MeshStandardMaterial({ color: 0x3a1208, roughness: 0.2 }), 0.72, 0.195, 0.78, 0, -Math.PI / 2);
    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.035, 8), M.glow);
    glow.position.set(0.72, 0.04, 0.925); b.mesh(glow); g.glow = glow;
    const grape = new THREE.MeshStandardMaterial({ color: 0x4b2050, roughness: 0.5 });
    for (let k = 0; k < 3; k++) { b.cyl(M.sack, 0.15 + k * 0.11, 0, 0.85, 0.04, 0.035, 0.06, 8); b.add(new THREE.SphereGeometry(0.035, 6, 5), grape, 0.15 + k * 0.11, 0.06, 0.85, 0, 0, 0, 1, 0.5, 1); }
    g.smoke = [V(0.72, 0.35, 0.78)];
  },

  kilocagi(b) {
    const clay = new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: 1 });
    b.add(new THREE.CircleGeometry(0.3, 16), new THREE.MeshStandardMaterial({ color: 0x5a3a26, roughness: 1 }), 0.45, 0.005, 0.45, 0, -Math.PI / 2);
    for (let k = 0; k < 4; k++) b.add(new THREE.SphereGeometry(0.08, 8, 6), clay, 0.2 + k * 0.18, 0.02, 0.85, 0, 0, 0, 1.2, 0.5, 1);
    for (const x of [0.2, 0.7]) b.cyl(M.woodDark, x, 0, 0.3, 0.01, 0.01, 0.28, 5);
    b.beam(M.woodDark, V(0.2, 0.27, 0.3), V(0.7, 0.27, 0.3), 0.008);
    b.add(new THREE.PlaneGeometry(0.5, 0.3).rotateX(-Math.PI / 2 + 0.2), M.leather, 0.45, 0.28, 0.4);
    b.cyl(M.woodDark, 0.8, 0, 0.5, 0.06, 0.05, 0.08, 8);
    b.beam(M.wood, V(0.85, 0, 0.6), V(0.95, 0.25, 0.65), 0.006);
  },

  maden(b, g, id) {
    rock(b, 0.7, 0.55, 0.42, id); rock(b, 1.25, 0.45, 0.35, id + 2); rock(b, 0.4, 0.95, 0.28, id + 5);
    // giriş
    b.box(M.dark, 1.0, 0, 0.92, 0.26, 0.3, 0.08);
    for (const x of [0.86, 1.14]) b.box(M.woodDark, x, 0, 0.97, 0.04, 0.32, 0.04);
    b.box(M.woodDark, 1.0, 0.3, 0.97, 0.34, 0.04, 0.05);
    // ray ve vagon
    for (const x of [0.95, 1.05]) b.beam(M.bronze, V(x, 0.005, 1.0), V(x, 0.005, 1.8), 0.006);
    for (let k = 0; k < 7; k++) b.box(M.woodDark, 1.0, 0, 1.05 + k * 0.11, 0.16, 0.01, 0.03);
    b.box(M.woodDark, 1.0, 0.02, 1.55, 0.14, 0.08, 0.2);
    const ore = new THREE.MeshStandardMaterial({ color: 0x7a3b28, roughness: 0.9 });
    for (let k = 0; k < 6; k++) b.add(new THREE.IcosahedronGeometry(0.035, 0), ore, 1.0 + (k % 3 - 1) * 0.04, 0.1, 1.5 + Math.floor(k / 3) * 0.08);
    for (let k = 0; k < 8; k++) b.add(new THREE.IcosahedronGeometry(0.05, 0), ore, 1.5 + (k % 4) * 0.08, 0.02, 1.6 + Math.floor(k / 4) * 0.1);
    b.box(M.wood, 0.45, 0, 1.55, 0.4, 0.28, 0.35);
    roofGable(b, 0.45, 0.28, 1.55, 0.4, 0.35, 0.14, M.woodDark, M.wood, 0.05);
  },

  komurcu(b, g) {
    b.add(domeGeo(0.24, 16, 0.75), M.soilRoof, 0.4, 0, 0.45);
    for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2; b.box(M.dark, 0.4 + Math.cos(a) * 0.2, 0.02, 0.45 + Math.sin(a) * 0.2, 0.03, 0.03, 0.03); }
    logPile(b, 0.8, 0.3, 3, 0.25, 0);
    const coal = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
    for (let k = 0; k < 9; k++) b.add(new THREE.IcosahedronGeometry(0.035, 0), coal, 0.7 + (k % 3) * 0.06, 0.02 + Math.floor(k / 3) * 0.02, 0.8 + (k % 2) * 0.05);
    b.cyl(M.woodDark, 0.2, 0, 0.85, 0.008, 0.008, 0.25, 4);
    g.smoke = [V(0.4, 0.2, 0.45)];
    g.alwaysSmoke = true;
  },

  dokumaci(b) {
    b.box(M.stoneRough, 0.42, 0, 0.4, 0.62, 0.04, 0.55);
    b.box(M.plasterLight, 0.42, 0.04, 0.4, 0.56, 0.32, 0.48);
    roofGable(b, 0.42, 0.36, 0.4, 0.56, 0.48, 0.2, M.roof, M.plasterLight, 0.07);
    door(b, '+z', 0.3, 0.04, 0.645, 0.11, 0.21, false);
    win(b, '+z', 0.55, 0.18, 0.645, 0.09, 0.1);
    // çamaşır ipinde kumaşlar
    for (const x of [0.12, 0.92]) b.cyl(M.woodDark, x, 0, 0.85, 0.008, 0.008, 0.28, 4);
    b.beam(M.rope, V(0.12, 0.27, 0.85), V(0.92, 0.27, 0.85), 0.002);
    for (let k = 0; k < 4; k++) b.add(new THREE.PlaneGeometry(0.14, 0.16), M.fabric[k], 0.22 + k * 0.19, 0.19, 0.85);
    b.cyl(M.woodDark, 0.85, 0, 0.25, 0.06, 0.06, 0.02, 10);
  },

  comlekci(b, g) {
    b.box(M.stoneRough, 0.35, 0, 0.35, 0.5, 0.04, 0.5);
    b.box(M.plasterWarm, 0.35, 0.04, 0.35, 0.44, 0.3, 0.42);
    b.box(M.soilRoof, 0.35, 0.34, 0.35, 0.5, 0.04, 0.48);
    door(b, '+z', 0.3, 0.04, 0.565, 0.1, 0.2, false);
    // fırın
    const brick = new THREE.MeshStandardMaterial({ color: 0x9c5a3a, roughness: 0.9 });
    b.add(domeGeo(0.15, 12, 1.1), brick, 0.78, 0, 0.3);
    b.cyl(brick, 0.78, 0.15, 0.3, 0.03, 0.04, 0.12, 8);
    for (let k = 0; k < 8; k++) jar(b, 0.15 + (k % 4) * 0.1, 0.78 + Math.floor(k / 4) * 0.12);
    b.box(M.wood, 0.75, 0, 0.75, 0.25, 0.1, 0.15);
    g.smoke = [V(0.78, 0.3, 0.3)];
  },

  demirci(b, g) {
    b.box(M.stoneRough, 0.5, 0, 0.45, 0.8, 0.04, 0.7);
    for (const [x, z] of [[0.15, 0.15], [0.85, 0.15], [0.15, 0.75], [0.85, 0.75]]) b.cyl(M.woodDark, x, 0.04, z, 0.015, 0.015, 0.34, 5);
    roofGable(b, 0.5, 0.38, 0.45, 0.76, 0.66, 0.18, M.roof, M.wood, 0.04);
    b.box(M.stoneRough, 0.5, 0.04, 0.2, 0.7, 0.28, 0.08);
    // ocak
    b.box(M.stoneRough, 0.3, 0.04, 0.35, 0.2, 0.14, 0.18);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.1).rotateX(-Math.PI / 2), M.glow);
    glow.position.set(0.3, 0.185, 0.35); b.mesh(glow); g.glow = glow;
    b.cyl(M.stoneRough, 0.3, 0.18, 0.28, 0.04, 0.06, 0.4, 8);
    // örs
    const iron = new THREE.MeshStandardMaterial({ color: 0x2c2c2e, metalness: 0.8, roughness: 0.4 });
    b.cyl(M.bark, 0.6, 0.04, 0.5, 0.04, 0.045, 0.08, 8);
    b.box(iron, 0.6, 0.12, 0.5, 0.12, 0.04, 0.05);
    b.box(iron, 0.67, 0.13, 0.5, 0.04, 0.02, 0.03);
    for (let k = 0; k < 4; k++) b.beam(M.woodDark, V(0.8 + k * 0.03, 0.04, 0.9), V(0.82 + k * 0.03, 0.22, 0.92), 0.005);
    barrel(b, 0.15, 0.9);
    g.smoke = [V(0.3, 0.62, 0.28)];
  },

  silahhane(b) {
    b.box(M.stoneCut, 1, 0, 0.9, 1.6, 0.04, 1.3);
    b.box(M.stoneRough, 1, 0.04, 0.75, 1.4, 0.4, 0.9);
    roofGable(b, 1, 0.44, 0.75, 1.4, 0.9, 0.3, M.roof, M.stoneRough, 0.08);
    door(b, '+z', 1, 0.04, 1.205, 0.2, 0.3, true);
    for (let k = 0; k < 3; k++) win(b, '+x', 1.705, 0.2, 0.45 + k * 0.3, 0.06, 0.12);
    // mızrak ve kalkan askısı
    for (let k = 0; k < 8; k++) b.beam(M.woodDark, V(0.4 + k * 0.06, 0.04, 1.42), V(0.4 + k * 0.06, 0.48, 1.38), 0.005);
    b.beam(M.woodDark, V(0.35, 0.3, 1.4), V(0.9, 0.3, 1.4), 0.008);
    for (let k = 0; k < 4; k++) { b.add(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 12).rotateX(Math.PI / 2), M.fabric[k % 2 ? 0 : 2], 1.25 + k * 0.13, 0.15, 1.42); b.add(new THREE.SphereGeometry(0.012, 6, 4), M.bronze, 1.25 + k * 0.13, 0.15, 1.43); }
    for (let k = 0; k < 3; k++) crate(b, 0.3 + k * 0.12, 1.65, k * 0.3);
  },

  yayci(b) {
    b.box(M.stoneRough, 0.42, 0, 0.4, 0.6, 0.04, 0.52);
    b.box(M.wood, 0.42, 0.04, 0.4, 0.54, 0.3, 0.46);
    roofGable(b, 0.42, 0.34, 0.4, 0.54, 0.46, 0.18, M.roof, M.wood, 0.07);
    door(b, '+z', 0.3, 0.04, 0.635, 0.1, 0.2, false);
    for (let k = 0; k < 4; k++) {
      const bow = new THREE.TorusGeometry(0.08, 0.006, 4, 12, Math.PI * 0.9);
      b.add(bow, M.woodDark, 0.6 + k * 0.08, 0.2, 0.68, 0, 0, Math.PI / 2 + 0.05);
    }
    for (const x of [0.15, 0.85]) b.cyl(M.woodDark, x, 0, 0.88, 0.008, 0.008, 0.25, 4);
    b.beam(M.woodDark, V(0.15, 0.24, 0.88), V(0.85, 0.24, 0.88), 0.005);
    for (let k = 0; k < 3; k++) b.add(new THREE.PlaneGeometry(0.12, 0.14), M.leather, 0.3 + k * 0.2, 0.16, 0.88);
  },

  ahir(b, g) {
    b.box(M.stoneRough, 1, 0, 0.5, 1.7, 0.06, 0.6);
    b.box(M.wood, 1, 0.06, 0.5, 1.6, 0.3, 0.5);
    roofGable(b, 1, 0.36, 0.5, 1.6, 0.5, 0.22, M.roof, M.wood, 0.08);
    for (let k = 0; k < 4; k++) b.box(M.dark, 0.5 + k * 0.33, 0.06, 0.755, 0.14, 0.2, 0.01);
    // padok
    const pts = [V(0.1, 0, 0.9), V(1.9, 0, 0.9), V(1.9, 0, 1.9), V(0.1, 0, 1.9), V(0.1, 0, 0.9)];
    for (let e = 0; e < 4; e++) {
      const a = pts[e], c = pts[e + 1];
      for (let k = 0; k <= 6; k++) { const p = a.clone().lerp(c, k / 6); b.cyl(M.woodDark, p.x, 0, p.z, 0.01, 0.012, 0.15, 5); }
      b.beam(M.wood, V(a.x, 0.13, a.z), V(c.x, 0.13, c.z), 0.007);
      b.beam(M.wood, V(a.x, 0.07, a.z), V(c.x, 0.07, c.z), 0.007);
    }
    b.box(M.wood, 1.5, 0, 1.2, 0.3, 0.06, 0.08);
    const cols = [0x5a3a22, 0x2a1d14, 0xb08a60, 0x6e4a2e];
    const horses = [];
    for (let k = 0; k < 4; k++) {
      const h = horse(cols[k]);
      h.position.set(0.4 + k * 0.35, 0, 1.2 + (k % 2) * 0.35);
      h.rotation.y = k * 1.3;
      h.userData = { tx: h.position.x, tz: h.position.z, wait: k, box: [0.25, 1.0, 1.75, 1.8] };
      horses.push(h); b.mesh(h);
    }
    g.sheep = horses;
    g.sheepBox = [0.25, 1.0, 1.75, 1.8];
  },

  mescit(b) {
    b.box(M.stoneRough, 0.45, 0, 0.45, 0.7, 0.04, 0.7);
    b.box(M.white, 0.45, 0.04, 0.45, 0.56, 0.36, 0.56);
    roofHip(b, 0.45, 0.4, 0.45, 0.56, 0.56, 0.26, M.roof, 0.1);
    door(b, '+z', 0.45, 0.04, 0.731, 0.12, 0.22, true);
    win(b, '+x', 0.731, 0.18, 0.35, 0.06, 0.11); win(b, '+x', 0.731, 0.18, 0.55, 0.06, 0.11);
    // ahşap minare
    b.box(M.woodDark, 0.85, 0.04, 0.2, 0.1, 0.5, 0.1);
    b.box(M.wood, 0.85, 0.54, 0.2, 0.14, 0.03, 0.14);
    b.box(M.woodDark, 0.85, 0.57, 0.2, 0.08, 0.12, 0.08);
    b.add(new THREE.ConeGeometry(0.07, 0.16, 4), M.roof, 0.85, 0.77, 0.2, Math.PI / 4);
    b.cyl(M.gold, 0.85, 0.85, 0.2, 0.004, 0.004, 0.05, 4);
    // avlu ve musalla taşı
    b.box(M.stoneCut, 0.2, 0.04, 0.85, 0.12, 0.05, 0.25);
  },

  tekke(b) {
    b.box(M.stoneRough, 1, 0, 1, 1.9, 0.03, 1.9);
    // derviş hücreleri
    b.box(M.plasterLight, 1, 0.03, 0.3, 1.6, 0.3, 0.36);
    roofGable(b, 1, 0.33, 0.3, 1.6, 0.36, 0.16, M.roof, M.plasterLight, 0.06);
    for (let k = 0; k < 5; k++) { door(b, '+z', 0.4 + k * 0.3, 0.03, 0.485, 0.08, 0.17, false); }
    // semahane
    b.box(M.plasterLight, 0.4, 0.03, 1.1, 0.5, 0.36, 0.7);
    roofHip(b, 0.4, 0.39, 1.1, 0.5, 0.7, 0.22, M.roof, 0.08);
    win(b, '+x', 0.655, 0.16, 1.0, 0.06, 0.1); win(b, '+x', 0.655, 0.16, 1.25, 0.06, 0.1);
    // türbe (sekizgen, külahlı)
    b.cyl(M.stoneCut, 1.35, 0.03, 1.25, 0.24, 0.24, 0.36, 8);
    b.add(new THREE.ConeGeometry(0.27, 0.3, 8), M.lead, 1.35, 0.39 + 0.15, 1.25, Math.PI / 8);
    b.arch(M.dark, '+z', 1.35, 0.03, 1.47, 0.1, 0.2);
    // avlu ağacı (çınar)
    b.cyl(M.bark, 1.0, 0.03, 1.65, 0.03, 0.045, 0.35, 7);
    const leaf = M.treeLeaf || (M.treeLeaf = new THREE.MeshStandardMaterial({ color: 0x5f8a35, roughness: 0.9 }));
    for (let k = 0; k < 6; k++) { const a = k; b.add(new THREE.IcosahedronGeometry(0.12, 1), leaf, 1.0 + Math.cos(a) * 0.1, 0.45 + (k % 2) * 0.08, 1.65 + Math.sin(a) * 0.1); }
  },

  medrese(b) {
    const m = M.stoneCut;
    b.box(m, 1, 0, 1, 1.94, 0.03, 1.94);
    // U planlı hücreler
    b.box(m, 1, 0.03, 0.25, 1.8, 0.3, 0.32);
    b.box(m, 0.25, 0.03, 1.05, 0.32, 0.3, 1.3);
    b.box(m, 1.75, 0.03, 1.05, 0.32, 0.3, 1.3);
    for (let k = 0; k < 7; k++) b.add(domeGeo(0.09, 12, 0.85), M.lead, 0.25 + k * 0.25, 0.33, 0.25);
    for (let k = 0; k < 4; k++) { b.add(domeGeo(0.09, 12, 0.85), M.lead, 0.25, 0.33, 0.6 + k * 0.28); b.add(domeGeo(0.09, 12, 0.85), M.lead, 1.75, 0.33, 0.6 + k * 0.28); }
    // dershane (büyük kubbe) ve eyvan
    b.box(m, 1, 0.03, 0.55, 0.6, 0.42, 0.45);
    b.add(domeGeo(0.3, 20, 0.85), M.lead, 1, 0.45, 0.55);
    b.arch(M.dark, '+z', 1, 0.03, 0.78, 0.28, 0.36);
    // revaklar
    for (let k = 0; k < 4; k++) { b.cyl(m, 0.5, 0.03, 0.75 + k * 0.28, 0.016, 0.018, 0.26, 8); b.cyl(m, 1.5, 0.03, 0.75 + k * 0.28, 0.016, 0.018, 0.26, 8); }
    // taç kapı
    b.box(m, 1, 0.03, 1.85, 0.5, 0.52, 0.14);
    b.arch(M.darkBlue, '+z', 1, 0.03, 1.925, 0.24, 0.42);
    b.arch(M.dark, '+z', 1, 0.03, 1.93, 0.14, 0.26);
    b.box(m, 0.5, 0.03, 1.85, 0.5, 0.3, 0.1); b.box(m, 1.5, 0.03, 1.85, 0.5, 0.3, 0.1);
    b.cyl(m, 1, 0.03, 1.25, 0.1, 0.12, 0.06, 10);
    b.add(new THREE.CircleGeometry(0.09, 12), M.waterSmall, 1, 0.095, 1.25, 0, -Math.PI / 2);
    minaret(b, 1.6, 1.82, 0.8, m, 0.045);
  },

  kadi(b) {
    b.box(M.stoneCut, 1, 0, 1, 1.8, 0.05, 1.6);
    b.box(M.stoneCut, 1, 0.05, 0.8, 1.4, 0.48, 0.9);
    roofHip(b, 1, 0.53, 0.8, 1.4, 0.9, 0.34, M.roof, 0.16);
    // revak
    for (let k = 0; k < 6; k++) b.cyl(M.stoneCut, 0.4 + k * 0.24, 0.05, 1.42, 0.025, 0.03, 0.42, 10);
    b.box(M.stoneCut, 1, 0.47, 1.42, 1.4, 0.06, 0.12);
    roofHip(b, 1, 0.53, 1.36, 1.4, 0.18, 0.06, M.roof, 0.06);
    door(b, '+z', 1, 0.05, 1.255, 0.18, 0.3, true);
    for (let k = 0; k < 2; k++) { win(b, '+z', 0.6 + k * 0.8, 0.2, 1.255, 0.1, 0.16); }
    for (let k = 0; k < 3; k++) win(b, '+x', 1.705, 0.2, 0.5 + k * 0.3, 0.08, 0.16);
    for (let k = 0; k < 3; k++) b.box(M.stoneCut, 1, 0, 1.65 + k * 0.05, 0.7 - k * 0.1, 0.05 - k * 0.012, 0.06);
  },

  ulucami(b, g) {
    const m = M.stoneCut;
    b.box(m, 2, 0, 2, 3.9, 0.05, 3.9);
    // harim: 2x3 kubbe
    b.box(m, 2, 0.05, 1.35, 3.0, 0.78, 2.2);
    b.box(m, 2, 0.83, 1.35, 3.06, 0.05, 2.26);
    for (let r2 = 0; r2 < 2; r2++) for (let c = 0; c < 3; c++) {
      const x = 1.0 + c * 1.0, z = 0.8 + r2 * 1.1;
      b.cyl(m, x, 0.88, z, 0.42, 0.44, 0.12, 12);
      b.add(domeGeo(0.43, 24, 0.75), M.lead, x, 1.0, z);
      b.cyl(M.gold, x, 1.32, z, 0.008, 0.008, 0.1, 5);
    }
    for (let k = 0; k < 6; k++) { b.arch(M.darkBlue, '+z', 0.7 + k * 0.52, 0.2, 2.452, 0.14, 0.3); b.arch(M.darkBlue, '+z', 0.7 + k * 0.52, 0.55, 2.452, 0.12, 0.2); }
    for (let k = 0; k < 4; k++) { b.arch(M.darkBlue, '+x', 3.502, 0.2, 0.55 + k * 0.55, 0.14, 0.3); b.arch(M.darkBlue, '+x', 3.502, 0.55, 0.55 + k * 0.55, 0.12, 0.2); }
    // avlu ve revaklar
    b.box(M.stoneGrey, 2, 0.05, 3.15, 3.0, 0.01, 1.3);
    for (let k = 0; k < 9; k++) { b.cyl(m, 0.6 + k * 0.35, 0.05, 3.75, 0.025, 0.03, 0.4, 10); }
    b.box(m, 2, 0.45, 3.75, 3.0, 0.05, 0.2);
    for (let k = 0; k < 8; k++) b.add(domeGeo(0.12, 12, 0.8), M.lead, 0.78 + k * 0.35, 0.5, 3.75);
    b.box(m, 0.55, 0.05, 3.15, 0.12, 0.35, 1.3); b.box(m, 3.45, 0.05, 3.15, 0.12, 0.35, 1.3);
    // şadırvan
    b.cyl(m, 2, 0.05, 3.1, 0.25, 0.27, 0.15, 10);
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; b.cyl(m, 2 + Math.cos(a) * 0.24, 0.2, 3.1 + Math.sin(a) * 0.24, 0.012, 0.012, 0.22, 5); }
    b.add(new THREE.ConeGeometry(0.34, 0.2, 8), M.lead, 2, 0.52, 3.1, Math.PI / 8);
    // taç kapı
    b.box(m, 2, 0.05, 2.5, 0.8, 1.0, 0.18);
    b.arch(M.darkBlue, '+z', 2, 0.05, 2.595, 0.4, 0.8);
    b.arch(M.dark, '+z', 2, 0.05, 2.6, 0.24, 0.45);
    // iki minare
    minaret(b, 0.3, 0.3, 2.1, m, 0.08);
    minaret(b, 3.7, 0.3, 2.1, m, 0.08);
  },

  depo(b) {
    b.box(M.stoneRough, 0.5, 0, 0.47, 0.8, 0.06, 0.7);
    b.box(M.stoneRough, 0.5, 0.06, 0.47, 0.74, 0.34, 0.64);
    roofGable(b, 0.5, 0.4, 0.47, 0.74, 0.64, 0.22, M.roof, M.stoneRough, 0.07, true);
    b.box(M.woodDark, 0.5, 0.06, 0.795, 0.26, 0.24, 0.02);
    for (let k = 0; k < 4; k++) crate(b, 0.12 + k * 0.1, 0.92, k * 0.3);
    barrel(b, 0.9, 0.88); sack(b, 0.82, 0.12);
  },

  bedesten(b) {
    const m = M.stoneCut;
    b.box(m, 1, 0, 1.5, 1.95, 0.04, 2.95);
    b.box(m, 1, 0.04, 1.5, 1.3, 0.52, 2.3);
    b.box(m, 1, 0.56, 1.5, 1.36, 0.04, 2.36);
    for (let r2 = 0; r2 < 3; r2++) for (let c = 0; c < 2; c++) {
      const x = 0.68 + c * 0.64, z = 0.73 + r2 * 0.76;
      b.cyl(m, x, 0.6, z, 0.26, 0.27, 0.08, 10);
      b.add(domeGeo(0.27, 18, 0.7), M.lead, x, 0.68, z);
    }
    // dış dükkânlar (arasta)
    for (let k = 0; k < 6; k++) {
      const z = 0.55 + k * 0.38;
      b.box(m, 1.8, 0.04, z, 0.3, 0.3, 0.34);
      b.box(M.woodDark, 1.951, 0.06, z, 0.01, 0.2, 0.24);
      b.box(m, 0.2, 0.04, z, 0.3, 0.3, 0.34);
    }
    roofGable(b, 1.8, 0.34, 1.5, 0.34, 2.32, 0.08, M.roof, m, 0.04, true);
    roofGable(b, 0.2, 0.34, 1.5, 0.34, 2.32, 0.08, M.roof, m, 0.04, true);
    b.box(m, 1, 0.04, 2.7, 0.5, 0.62, 0.12);
    b.arch(M.dark, '+z', 1, 0.04, 2.765, 0.22, 0.4);
    b.add(new THREE.PlaneGeometry(0.3, 0.4).rotateX(-Math.PI / 2), M.kilim, 1.75, 0.38, 2.85);
    for (let k = 0; k < 3; k++) jar(b, 0.15 + k * 0.1, 2.85);
  },

  kisla(b, g) {
    const m = M.stoneRough;
    b.box(M.soilRoof, 1.5, 0, 1.5, 2.9, 0.01, 2.9);
    // duvarlar
    b.box(m, 1.5, 0, 0.08, 2.9, 0.34, 0.12);
    b.box(m, 0.08, 0, 1.5, 0.12, 0.34, 2.9);
    b.box(m, 2.92, 0, 1.5, 0.12, 0.34, 2.9);
    b.box(m, 0.75, 0, 2.92, 1.4, 0.34, 0.12);
    b.box(m, 2.35, 0, 2.92, 1.2, 0.34, 0.12);
    for (let k = 0; k < 14; k++) { b.box(m, 0.1 + k * 0.2, 0.34, 0.08, 0.1, 0.06, 0.12); }
    // kapı kuleleri
    for (const x of [1.4, 1.8]) { b.box(m, x, 0, 2.92, 0.22, 0.55, 0.22); roofHip(b, x, 0.55, 2.92, 0.22, 0.22, 0.14, M.roof, 0.04); }
    // koğuş
    b.box(M.wood, 1.5, 0.01, 0.55, 2.4, 0.32, 0.6);
    roofGable(b, 1.5, 0.33, 0.55, 2.4, 0.6, 0.22, M.roof, M.wood, 0.06);
    for (let k = 0; k < 6; k++) b.box(M.dark, 0.6 + k * 0.36, 0.01, 0.855, 0.1, 0.18, 0.01);
    // çadırlar
    for (let k = 0; k < 3; k++) b.add(new THREE.ConeGeometry(0.16, 0.25, 8), M.cloth, 0.45, 0.125, 1.3 + k * 0.42);
    // sancak
    b.cyl(M.woodDark, 2.6, 0, 1.3, 0.008, 0.01, 0.8, 5);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.19, 8, 2).translate(0.15, 0, 0), M.flag);
    fl.position.set(2.6, 0.7, 1.3); b.mesh(fl); g.flag = fl;
    // talim kuklaları
    for (let k = 0; k < 3; k++) { b.cyl(M.woodDark, 2.5, 0, 1.8 + k * 0.25, 0.01, 0.01, 0.22, 4); b.add(new THREE.SphereGeometry(0.03, 6, 5), M.sack, 2.5, 0.24, 1.8 + k * 0.25); }
    g.kisla = true;
  },

  kule(b) {
    b.box(M.stoneRough, 0.5, 0, 0.5, 0.5, 0.9, 0.5);
    b.box(M.stoneRough, 0.5, 0.9, 0.5, 0.6, 0.05, 0.6);
    for (let k = 0; k < 4; k++) for (let s = 0; s < 3; s++) {
      const off = -0.22 + s * 0.22;
      const pos = [[off, 0.28], [0.28, off], [off, -0.28], [-0.28, off]][k];
      b.box(M.stoneRough, 0.5 + pos[0], 0.95, 0.5 + pos[1], 0.08, 0.08, 0.08);
    }
    b.add(new THREE.ConeGeometry(0.36, 0.4, 4), M.roof, 0.5, 1.25, 0.5, Math.PI / 4);
    for (const [x, z] of [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]]) b.cyl(M.woodDark, x, 0.95, z, 0.01, 0.01, 0.12, 4);
    win(b, '+z', 0.5, 0.5, 0.751, 0.06, 0.12);
    door(b, '+z', 0.5, 0, 0.751, 0.12, 0.22, true);
  },

  mehterhane(b) {
    b.box(M.stoneCut, 0.5, 0, 0.5, 0.8, 0.06, 0.8);
    for (const [x, z] of [[0.18, 0.18], [0.82, 0.18], [0.18, 0.82], [0.82, 0.82]]) b.cyl(M.stoneCut, x, 0.06, z, 0.025, 0.03, 0.34, 8);
    roofHip(b, 0.5, 0.4, 0.5, 0.7, 0.7, 0.26, M.lead, 0.08);
    const drum = new THREE.MeshStandardMaterial({ color: 0xa83a2a, roughness: 0.7 });
    b.cyl(drum, 0.4, 0.06, 0.45, 0.1, 0.1, 0.14, 12);
    b.cyl(M.cloth, 0.4, 0.2, 0.45, 0.1, 0.1, 0.005, 12);
    b.add(new THREE.SphereGeometry(0.12, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.bronze, 0.65, 0.18, 0.6);
    b.cyl(M.cloth, 0.65, 0.18, 0.6, 0.12, 0.12, 0.005, 12);
    for (let k = 0; k < 3; k++) b.cyl(M.gold, 0.3 + k * 0.08, 0.06, 0.75, 0.025, 0.025, 0.005, 10);
  }
};

registerModels(MODELS);
export { soldier, horse };
