// Binaların 3D modelleri (yerel koordinat: karo köşesi 0,0; x∈[0,w], z∈[0,h]; ön yüz +z)
import * as THREE from 'three';
import { Builder, V, gableGeo, hipGeo, domeGeo, cylGeo, boxGeo } from './geom.js';
import { M, tex, stripeTexture } from './materials.js';

function rnd(seed) {
  let s = (seed * 2654435761) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// ---- Ortak parçalar ----
function door(b, face, cx, y, cz, w, h, arch = true) {
  if (arch) b.arch(M.dark, face, cx, y, cz, w, h, true);
  else b.rect(M.dark, face, cx, y, cz, w, h, 0.012);
  // ahşap kanat izi
  const fw = 0.012;
  if (face === '+z') { b.box(M.woodDark, cx - w / 2 - fw / 2, y, cz, fw, h * 0.8, 0.025); b.box(M.woodDark, cx + w / 2 + fw / 2, y, cz, fw, h * 0.8, 0.025); }
  else if (face === '+x') { b.box(M.woodDark, cx, y, cz - w / 2 - fw / 2, 0.025, h * 0.8, fw); b.box(M.woodDark, cx, y, cz + w / 2 + fw / 2, 0.025, h * 0.8, fw); }
  b.box(M.stoneCut, face === '+z' ? cx : cx + 0.02, y - 0.005, face === '+z' ? cz + 0.02 : cz, face === '+z' ? w + 0.06 : 0.05, 0.012, face === '+z' ? 0.05 : w + 0.06);
}
function win(b, face, cx, y, cz, w, h, frame = M.woodDark) {
  b.rect(M.darkBlue, face, cx, y, cz, w, h, 0.012);
  const t = 0.012;
  if (face === '+z' || face === '-z') {
    const zz = cz + (face === '+z' ? 0.01 : -0.01);
    b.box(frame, cx, y - t, zz, w + 0.03, t, 0.03);
    b.box(frame, cx, y + h, zz, w + 0.03, t, 0.02);
    b.box(frame, cx, y, zz + (face === '+z' ? 0.006 : -0.006), t * 0.6, h, 0.012);
    b.box(frame, cx, y + h / 2, zz + (face === '+z' ? 0.006 : -0.006), w, t * 0.6, 0.012);
  } else {
    const xx = cx + (face === '+x' ? 0.01 : -0.01);
    b.box(frame, xx, y - t, cz, 0.03, t, w + 0.03);
    b.box(frame, xx, y + h, cz, 0.02, t, w + 0.03);
    b.box(frame, xx + (face === '+x' ? 0.006 : -0.006), y, cz, 0.012, h, t * 0.6);
    b.box(frame, xx + (face === '+x' ? 0.006 : -0.006), y + h / 2, cz, 0.012, t * 0.6, w);
  }
}
function roofGable(b, cx, y, cz, w, d, h, mat = M.roof, gableMat = M.plaster, o = 0.07, alongZ = false) {
  const { roof, gable } = gableGeo(alongZ ? d : w, alongZ ? w : d, h, o);
  const ry = alongZ ? Math.PI / 2 : 0;
  b.add(roof, mat, cx, y, cz, ry);
  b.add(gable, gableMat, cx, y, cz, ry);
}
function roofHip(b, cx, y, cz, w, d, h, mat = M.roof, o = 0.08) {
  b.add(hipGeo(w, d, h, o), mat, cx, y, cz);
}
function logPile(b, x, z, n = 3, len = 0.32, ry = 0) {
  const c = Math.cos(ry), s = Math.sin(ry);
  let k = 0;
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n - row; col++) {
      const off = (col - (n - row - 1) / 2) * 0.075;
      const y = 0.035 + row * 0.064;
      const px = x + c * off, pz = z - s * off;
      b.cyl(M.bark, px, y - 0.035, pz, 0.035, 0.035, len, 8, Math.PI / 2, 0, ry);
      // kesik uçlar
      b.add(new THREE.CircleGeometry(0.034, 8), M.logEnd, px + s * (len / 2 + 0.001), y, pz + c * (len / 2 + 0.001), ry);
      k++;
    }
  }
}
function sack(b, x, z, s = 1) {
  b.cyl(M.sack, x, 0, z, 0.035 * s, 0.045 * s, 0.07 * s, 8);
  b.add(new THREE.SphereGeometry(0.036 * s, 8, 6), M.sack, x, 0.07 * s, z);
}
function barrel(b, x, z) {
  b.cyl(M.woodDark, x, 0, z, 0.045, 0.045, 0.11, 10);
  b.cyl(M.bronze, x, 0.02, z, 0.047, 0.047, 0.01, 10);
  b.cyl(M.bronze, x, 0.08, z, 0.047, 0.047, 0.01, 10);
}
function crate(b, x, z, ry = 0) { b.box(M.wood, x, 0, z, 0.09, 0.07, 0.09, ry); }
function jar(b, x, z) {
  b.add(new THREE.SphereGeometry(0.04, 10, 8), M.clay, x, 0.04, z, 0, 0, 0, 1, 1.25, 1);
  b.cyl(M.clay, x, 0.08, z, 0.018, 0.022, 0.025, 8);
}
function rock(b, x, z, s, seed) {
  const g = new THREE.IcosahedronGeometry(s, 1);
  const p = g.attributes.position, r = rnd(seed);
  const map = new Map();
  for (let k = 0; k < p.count; k++) {
    const key = `${p.getX(k).toFixed(4)},${p.getY(k).toFixed(4)},${p.getZ(k).toFixed(4)}`;
    if (!map.has(key)) map.set(key, 0.75 + r() * 0.45);
    const f = map.get(key);
    p.setXYZ(k, p.getX(k) * f, Math.max(-s * 0.2, p.getY(k) * f * 0.7), p.getZ(k) * f);
  }
  g.computeVertexNormals();
  b.add(g, M.rock, x, s * 0.25, z, r() * 6);
}
function person(b, x, z, col, ry = 0) {
  b.cyl(col, x, 0, z, 0.03, 0.045, 0.17, 8, 0, 0, ry);
  b.add(new THREE.SphereGeometry(0.03, 8, 6), M.skin, x, 0.205, z);
  b.cyl(M.white, x, 0.225, z, 0.026, 0.03, 0.03, 8);
}

// ---- Bina tanımları ----
const BUILD = {
  konak(b, g) {
    // avlu duvarı
    const wall = M.stoneRough;
    b.box(wall, 1.0, 0, 0.06, 1.88, 0.16, 0.06);
    b.box(wall, 0.06, 0, 1.0, 0.06, 0.16, 1.88);
    b.box(wall, 1.94, 0, 0.6, 0.06, 0.16, 1.08);
    b.box(wall, 1.94, 0, 1.75, 0.06, 0.16, 0.38);
    b.box(wall, 0.45, 0, 1.94, 0.78, 0.16, 0.06);
    b.box(wall, 1.6, 0, 1.94, 0.74, 0.16, 0.06);
    b.box(M.roof, 1.0, 0.16, 0.06, 1.92, 0.025, 0.1);
    // zemin kat (taş)
    const cx = 0.95, cz = 0.85;
    b.box(M.stoneRough, cx, 0, cz, 1.3, 0.38, 1.0);
    door(b, '+z', cx, 0.0, cz + 0.505, 0.16, 0.3);
    win(b, '+x', cx + 0.655, 0.16, cz - 0.25, 0.08, 0.1);
    win(b, '+x', cx + 0.655, 0.16, cz + 0.25, 0.08, 0.1);
    // çıkmalı üst kat
    const uw = 1.5, ud = 1.18, uy = 0.38, uh = 0.36;
    b.box(M.white, cx, uy, cz, uw, uh, ud);
    // eli böğründe (payandalar)
    for (let k = 0; k < 6; k++) {
      const x = cx - uw / 2 + 0.1 + k * (uw - 0.2) / 5;
      b.beam(M.woodDark, V(x, 0.26, cz + 0.5), V(x, uy, cz + ud / 2 - 0.01), 0.012);
    }
    for (let k = 0; k < 4; k++) {
      const z = cz - ud / 2 + 0.15 + k * (ud - 0.3) / 3;
      b.beam(M.woodDark, V(cx + 0.65, 0.26, z), V(cx + uw / 2 - 0.01, uy, z), 0.012);
    }
    // ahşap karkas çizgileri
    for (let k = 0; k <= 8; k++) {
      const x = cx - uw / 2 + k * uw / 8;
      b.box(M.woodDark, x, uy, cz + ud / 2 + 0.006, 0.022, uh, 0.012);
    }
    for (let k = 0; k <= 6; k++) {
      const z = cz - ud / 2 + k * ud / 6;
      b.box(M.woodDark, cx + uw / 2 + 0.006, uy, z, 0.012, uh, 0.022);
    }
    b.box(M.woodDark, cx, uy + 0.005, cz + ud / 2 + 0.008, uw + 0.02, 0.022, 0.014);
    b.box(M.woodDark, cx + uw / 2 + 0.008, uy + 0.005, cz, 0.014, 0.022, ud + 0.02);
    for (let k = 0; k < 4; k++) {
      win(b, '+z', cx - uw / 2 + 0.19 + k * (uw / 4), uy + 0.09, cz + ud / 2 + 0.008, 0.11, 0.17);
    }
    for (let k = 0; k < 3; k++) win(b, '+x', cx + uw / 2 + 0.008, uy + 0.09, cz - ud / 2 + 0.2 + k * (ud / 3), 0.11, 0.17);
    // geniş saçaklı kırma çatı
    roofHip(b, cx, uy + uh, cz, uw, ud, 0.42, M.roof, 0.2);
    b.box(M.stoneRough, cx - 0.35, uy + uh + 0.15, cz - 0.2, 0.09, 0.42, 0.09);
    // sancak
    const pole = new Builder();
    pole.cyl(M.woodDark, 0, 0, 0, 0.008, 0.012, 0.75, 6);
    pole.add(new THREE.SphereGeometry(0.018, 8, 6), M.gold, 0, 0.76, 0);
    const pg = pole.build();
    pg.position.set(0.2, 0.16, 1.75);
    const fg = new THREE.PlaneGeometry(0.34, 0.21, 12, 3);
    fg.translate(0.17, 0, 0);
    const flag = new THREE.Mesh(fg, M.flag);
    flag.position.set(0, 0.62, 0);
    flag.castShadow = true;
    pg.add(flag);
    b.mesh(pg);
    g.flag = flag;
    g.smoke = [V(cx - 0.35, uy + uh + 0.6, cz - 0.2)];
    jar(b, 1.75, 1.6); jar(b, 1.68, 1.68); barrel(b, 0.3, 0.3);
  },

  ev(b, g, id) {
    const r = rnd(id);
    const v = id % 3;
    const mats = [M.plaster, M.plasterWarm, M.plasterLight];
    const wm = mats[Math.floor(r() * 3)];
    const cx = 0.5, cz = 0.48;
    b.box(M.stoneRough, cx, 0, cz, 0.8, 0.05, 0.7);
    if (v === 0) {
      // düz toprak damlı Anadolu evi
      b.box(wm, cx, 0.05, cz, 0.72, 0.38, 0.62);
      b.box(M.soilRoof, cx, 0.43, cz, 0.8, 0.05, 0.7);
      for (let k = 0; k < 6; k++) b.cyl(M.woodDark, cx - 0.3 + k * 0.12, 0.42, cz + 0.32, 0.013, 0.013, 0.08, 6, Math.PI / 2);
      b.cyl(M.stoneRough, cx - 0.2, 0.47, cz - 0.15, 0.035, 0.04, 0.07, 8);
      door(b, '+z', cx - 0.12, 0.05, cz + 0.315, 0.13, 0.24, false);
      win(b, '+z', cx + 0.17, 0.2, cz + 0.315, 0.1, 0.1);
      win(b, '+x', cx + 0.365, 0.2, cz, 0.1, 0.1);
      g.smoke = [V(cx - 0.2, 0.56, cz - 0.15)];
    } else if (v === 1) {
      // kiremit çatılı, üst katı çıkmalı ev
      b.box(M.stoneRough, cx, 0.05, cz, 0.66, 0.2, 0.56);
      b.box(M.white, cx, 0.25, cz + 0.02, 0.74, 0.22, 0.64);
      for (let k = 0; k <= 4; k++) b.box(M.woodDark, cx - 0.37 + k * 0.185, 0.25, cz + 0.345, 0.018, 0.22, 0.012);
      roofHip(b, cx, 0.47, cz + 0.02, 0.74, 0.64, 0.24, M.roof, 0.11);
      door(b, '+z', cx - 0.15, 0.05, cz + 0.285, 0.12, 0.18, false);
      win(b, '+z', cx + 0.1, 0.31, cz + 0.345, 0.1, 0.11);
      win(b, '+z', cx - 0.15, 0.31, cz + 0.345, 0.1, 0.11);
      win(b, '+x', cx + 0.375, 0.31, cz, 0.1, 0.11);
      b.box(M.stoneRough, cx + 0.2, 0.55, cz - 0.1, 0.06, 0.16, 0.06);
      g.smoke = [V(cx + 0.2, 0.75, cz - 0.1)];
    } else {
      // L planlı, ahşap sundurmalı ev
      b.box(wm, cx - 0.08, 0.05, cz - 0.05, 0.56, 0.36, 0.5);
      b.box(wm, cx + 0.25, 0.05, cz + 0.12, 0.26, 0.3, 0.4);
      roofGable(b, cx - 0.08, 0.41, cz - 0.05, 0.56, 0.5, 0.2, M.roof, wm, 0.06);
      b.box(M.soilRoof, cx + 0.25, 0.35, cz + 0.12, 0.3, 0.04, 0.44);
      // sundurma
      for (const px of [cx - 0.33, cx - 0.08]) b.cyl(M.woodDark, px, 0.05, cz + 0.32, 0.012, 0.012, 0.28, 6);
      b.box(M.wood, cx - 0.2, 0.33, cz + 0.27, 0.34, 0.025, 0.15);
      door(b, '+z', cx - 0.15, 0.05, cz + 0.205, 0.12, 0.22, false);
      win(b, '+x', cx + 0.385, 0.16, cz + 0.12, 0.09, 0.09);
      win(b, '+z', cx + 0.25, 0.16, cz + 0.325, 0.09, 0.09);
      g.smoke = [V(cx - 0.08, 0.66, cz - 0.05)];
    }
    // avlu eşyaları
    if (r() < 0.5) logPile(b, 0.12, 0.88, 2, 0.2, Math.PI / 2);
    else jar(b, 0.15, 0.9);
    if (r() < 0.4) barrel(b, 0.88, 0.9);
  },

  cesme(b) {
    b.box(M.stoneCut, 0.5, 0, 0.5, 0.7, 0.03, 0.7);
    b.box(M.stoneCut, 0.5, 0.03, 0.42, 0.42, 0.42, 0.2);
    b.arch(M.darkBlue, '+z', 0.5, 0.1, 0.521, 0.22, 0.28);
    b.arch(M.stoneCut, '+z', 0.5, 0.1, 0.53, 0.16, 0.2);
    b.cyl(M.bronze, 0.5, 0.17, 0.56, 0.008, 0.008, 0.05, 6, Math.PI / 2);
    // saçak
    roofHip(b, 0.5, 0.45, 0.42, 0.46, 0.24, 0.07, M.lead, 0.07);
    b.box(M.stoneCut, 0.5, 0.42, 0.42, 0.5, 0.03, 0.28);
    // yalak
    b.box(M.stoneCut, 0.5, 0.03, 0.66, 0.4, 0.09, 0.14);
    b.box(M.waterSmall, 0.5, 0.12, 0.66, 0.34, 0.005, 0.09);
    b.cyl(M.stoneCut, 0.18, 0.03, 0.75, 0.035, 0.045, 0.07, 8);
    jar(b, 0.82, 0.72);
  },

  pazar(b, g, id) {
    const r = rnd(id);
    const stalls = [[0.45, 0.45], [1.45, 0.45], [0.45, 1.45], [1.45, 1.45]];
    stalls.forEach(([x, z], n) => {
      for (const [dx, dz] of [[-0.28, -0.22], [0.28, -0.22], [-0.28, 0.22], [0.28, 0.22]]) b.cyl(M.woodDark, x + dx, 0, z + dz, 0.012, 0.012, 0.36 + (dz < 0 ? 0.06 : 0), 6);
      // tente
      const tg = new THREE.PlaneGeometry(0.66, 0.54, 6, 4);
      tg.rotateX(-Math.PI / 2);
      const p = tg.attributes.position;
      for (let k = 0; k < p.count; k++) {
        const u = p.getX(k) / 0.33, w = p.getZ(k) / 0.27;
        p.setY(k, -w * 0.035 - (1 - u * u) * 0.025);
      }
      tg.computeVertexNormals();
      const colors = [['#a8322b', '#efe6d2'], ['#2f6b4a', '#efe6d2'], ['#2d4f86', '#e9dcc0'], ['#c8922c', '#f2ead8']][n];
      const mat = new THREE.MeshStandardMaterial({ map: stripeTexture(colors[0], colors[1]), roughness: 0.95, side: THREE.DoubleSide });
      b.add(tg, mat, x, 0.4, z);
      // tezgâh ve mallar
      b.box(M.wood, x, 0, z + 0.05, 0.5, 0.13, 0.22);
      for (let k = 0; k < 7; k++) {
        const fm = M.fruit[Math.floor(r() * M.fruit.length)];
        b.add(new THREE.SphereGeometry(0.035, 8, 6), fm, x - 0.18 + k * 0.06, 0.155, z + 0.05 + (r() - 0.5) * 0.1);
      }
      sack(b, x - 0.2, z - 0.15); sack(b, x + 0.22, z - 0.12, 0.9);
      if (n % 2) barrel(b, x + 0.3, z + 0.3); else crate(b, x - 0.3, z + 0.3, 0.3);
    });
    b.add(new THREE.PlaneGeometry(0.4, 0.6), M.kilim, 1.0, 0.004, 1.0, 0.3, -Math.PI / 2);
  },

  cami(b, g) {
    b.box(M.stoneCut, 1.0, 0, 1.0, 1.96, 0.04, 1.96);
    // harim
    const hx = 0.95, hz = 0.8, hs = 1.15, hh = 0.62;
    b.box(M.stoneCut, hx, 0.04, hz, hs, hh, hs);
    b.box(M.stoneCut, hx, 0.04 + hh, hz, hs + 0.04, 0.035, hs + 0.04);
    for (let row = 0; row < 2; row++) {
      for (let k = 0; k < 3; k++) {
        const off = -0.35 + k * 0.35;
        b.arch(M.darkBlue, '+x', hx + hs / 2 + 0.002, 0.12 + row * 0.26, hz + off, 0.11, 0.18);
        if (row === 1) b.arch(M.darkBlue, '+z', hx + off, 0.12 + row * 0.26, hz + hs / 2 + 0.002, 0.11, 0.18);
      }
    }
    // kasnak + kubbe
    b.cyl(M.stoneCut, hx, 0.04 + hh + 0.035, hz, 0.47, 0.5, 0.12, 8);
    for (let k = 0; k < 8; k++) {
      const a = k / 8 * Math.PI * 2 + Math.PI / 8;
      b.box(M.darkBlue, hx + Math.cos(a) * 0.475, 0.75, hz + Math.sin(a) * 0.475, 0.06, 0.06, 0.06, -a);
    }
    const domeY = 0.04 + hh + 0.035 + 0.12;
    b.add(domeGeo(0.49, 28, 0.82), M.lead, hx, domeY, hz);
    b.cyl(M.gold, hx, domeY + 0.4, hz, 0.012, 0.012, 0.12, 6);
    b.add(new THREE.TorusGeometry(0.025, 0.005, 6, 12, Math.PI * 1.5), M.gold, hx, domeY + 0.55, hz);
    // son cemaat yeri (revak) 3 küçük kubbe
    const pz = hz + hs / 2 + 0.18;
    b.box(M.stoneCut, hx, 0.39, pz, hs, 0.05, 0.36);
    for (let k = 0; k < 4; k++) b.cyl(M.stoneCut, hx - hs / 2 + 0.04 + k * (hs - 0.08) / 3, 0.04, pz + 0.14, 0.022, 0.026, 0.35, 10);
    for (let k = 0; k < 3; k++) {
      b.add(domeGeo(0.15, 16, 0.8), M.lead, hx - 0.38 + k * 0.38, 0.44, pz);
    }
    // minare
    const mx = 1.72, mz = 0.35;
    b.box(M.stoneCut, mx, 0.04, mz, 0.2, 0.3, 0.2);
    b.cyl(M.stoneCut, mx, 0.34, mz, 0.075, 0.085, 1.0, 12);
    b.cyl(M.stoneCut, mx, 1.3, mz, 0.11, 0.08, 0.06, 12);
    b.cyl(M.stoneCut, mx, 1.36, mz, 0.11, 0.11, 0.02, 12);
    b.cyl(M.stoneCut, mx, 1.36, mz, 0.065, 0.065, 0.22, 12);
    b.add(new THREE.ConeGeometry(0.075, 0.38, 12), M.lead, mx, 1.58 + 0.19, mz);
    b.cyl(M.gold, mx, 1.95, mz, 0.006, 0.006, 0.08, 6);
    // şadırvan
    b.cyl(M.stoneCut, 0.35, 0.04, 1.62, 0.13, 0.14, 0.12, 8);
    b.add(domeGeo(0.15, 12, 0.6), M.lead, 0.35, 0.3, 1.62);
    for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI * 2 + 0.4; b.cyl(M.stoneCut, 0.35 + Math.cos(a) * 0.12, 0.16, 1.62 + Math.sin(a) * 0.12, 0.01, 0.01, 0.14, 6); }
  },

  hamam(b, g) {
    b.box(M.stoneRough, 1.0, 0, 1.0, 1.7, 0.36, 1.5);
    b.box(M.stoneRough, 1.0, 0.36, 1.0, 1.74, 0.03, 1.54);
    b.box(M.stoneCut, 0.75, 0, 1.78, 0.36, 0.48, 0.1);
    b.arch(M.dark, '+z', 0.75, 0.0, 1.835, 0.16, 0.3);
    b.add(domeGeo(0.42, 24, 0.75), M.white, 0.85, 0.39, 0.8);
    b.add(domeGeo(0.26, 18, 0.75), M.white, 1.45, 0.39, 1.25);
    b.add(domeGeo(0.24, 18, 0.75), M.white, 1.45, 0.39, 0.5);
    b.add(domeGeo(0.2, 16, 0.75), M.white, 0.45, 0.39, 1.45);
    // fil gözleri
    const r = rnd(5);
    for (let k = 0; k < 18; k++) {
      const a = r() * Math.PI * 2, rr = 0.12 + r() * 0.22;
      const y = 0.39 + Math.sqrt(Math.max(0, 0.42 * 0.42 - rr * rr)) * 0.75;
      b.add(new THREE.SphereGeometry(0.014, 6, 4), M.glass, 0.85 + Math.cos(a) * rr, y, 0.8 + Math.sin(a) * rr);
    }
    b.box(M.stoneRough, 1.65, 0.36, 0.2, 0.1, 0.32, 0.1);
    for (let k = 0; k < 2; k++) win(b, '+x', 1.856, 0.16, 0.6 + k * 0.6, 0.08, 0.1);
    logPile(b, 1.8, 0.12, 3, 0.25, 0);
    g.smoke = [V(1.65, 0.75, 0.2)];
  },

  oduncu(b, g) {
    b.box(M.stoneRough, 0.4, 0, 0.4, 0.56, 0.04, 0.5);
    b.box(M.wood, 0.4, 0.04, 0.4, 0.5, 0.3, 0.44);
    roofGable(b, 0.4, 0.34, 0.4, 0.5, 0.44, 0.2, M.woodDark, M.wood, 0.07);
    door(b, '+z', 0.35, 0.04, 0.625, 0.11, 0.2, false);
    logPile(b, 0.82, 0.48, 4, 0.36, 0);
    logPile(b, 0.45, 0.85, 3, 0.36, Math.PI / 2);
    // kütük ve balta
    b.cyl(M.bark, 0.85, 0, 0.88, 0.06, 0.065, 0.09, 10);
    b.add(new THREE.CircleGeometry(0.058, 10), M.logEnd, 0.85, 0.091, 0.88, 0, -Math.PI / 2);
    b.beam(M.wood, V(0.85, 0.09, 0.88), V(0.9, 0.2, 0.85), 0.007);
    b.box(M.bronze, 0.9, 0.19, 0.85, 0.05, 0.03, 0.01, 0.5);
  },

  tasocagi(b, g, id) {
    rock(b, 0.25, 0.3, 0.2, id); rock(b, 0.55, 0.2, 0.16, id + 3); rock(b, 0.2, 0.62, 0.14, id + 7);
    for (let k = 0; k < 5; k++) b.box(M.stoneCut, 0.6 + (k % 3) * 0.1, Math.floor(k / 3) * 0.07, 0.65 + (k % 2) * 0.12, 0.09, 0.07, 0.11, k * 0.2);
    // ahşap vinç (üçayak)
    const top = V(0.72, 0.6, 0.42);
    b.beam(M.woodDark, V(0.55, 0, 0.3), top, 0.012);
    b.beam(M.woodDark, V(0.9, 0, 0.32), top, 0.012);
    b.beam(M.woodDark, V(0.72, 0, 0.62), top, 0.012);
    b.beam(M.rope, top, V(0.72, 0.18, 0.42), 0.004);
    b.box(M.stoneCut, 0.72, 0.1, 0.42, 0.08, 0.08, 0.08);
    b.cyl(M.wood, 0.4, 0, 0.88, 0.05, 0.05, 0.08, 8);
  },

  avci(b, g) {
    b.box(M.stoneRough, 0.4, 0, 0.4, 0.5, 0.04, 0.46);
    b.box(M.wood, 0.4, 0.04, 0.4, 0.44, 0.28, 0.4);
    roofGable(b, 0.4, 0.32, 0.4, 0.44, 0.4, 0.18, M.soilRoof, M.wood, 0.06, true);
    door(b, '+z', 0.4, 0.04, 0.605, 0.11, 0.2, false);
    // kurutma askısı ve postlar
    for (const x of [0.62, 0.92]) b.cyl(M.woodDark, x, 0, 0.82, 0.01, 0.01, 0.3, 6);
    b.beam(M.woodDark, V(0.62, 0.29, 0.82), V(0.92, 0.29, 0.82), 0.008);
    b.add(new THREE.PlaneGeometry(0.12, 0.16), M.leather, 0.7, 0.2, 0.82);
    b.add(new THREE.PlaneGeometry(0.1, 0.14), M.leather, 0.84, 0.21, 0.82, 0.2);
    b.cyl(M.woodDark, 0.85, 0, 0.3, 0.025, 0.03, 0.03, 8);
  },

  tarla(b, g) {
    // çit direkleri
    for (let k = 0; k <= 8; k++) {
      for (const [x, z] of [[k * 0.25, 0.02], [1.98, k * 0.25], [k * 0.25, 1.98], [0.02, k * 0.25]]) b.cyl(M.woodDark, x, 0, z, 0.01, 0.012, 0.12, 5);
    }
    // korkuluk
    b.cyl(M.woodDark, 1.5, 0, 0.5, 0.008, 0.008, 0.3, 5);
    b.beam(M.woodDark, V(1.42, 0.24, 0.5), V(1.58, 0.24, 0.5), 0.006);
    b.add(new THREE.SphereGeometry(0.025, 8, 6), M.sack, 1.5, 0.31, 0.5);
    b.cyl(M.fabric[0], 1.5, 0.15, 0.5, 0.03, 0.04, 0.1, 6);
    // ekinler (örnekli)
    const geo = new THREE.BufferGeometry();
    const pos = [], nor = [], uv = [];
    for (let p = 0; p < 2; p++) {
      const a = p * Math.PI / 2 + 0.4;
      for (const [u, v, tu, tv] of [[-1, 0, 0, 0], [1, 0, 1, 0], [1, 1, 1, 1], [-1, 0, 0, 0], [1, 1, 1, 1], [-1, 1, 0, 1]]) {
        pos.push(Math.cos(a) * u * 0.11, v * 0.16, Math.sin(a) * u * 0.11);
        nor.push(0, 1, 0); uv.push(tu, tv);
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    const mat = new THREE.MeshStandardMaterial({ map: tex('wheat_green'), alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.9 });
    const n = 10 * 10;
    const im = new THREE.InstancedMesh(geo, mat, n);
    im.castShadow = true; im.receiveShadow = true;
    const r = rnd(9);
    const base = [];
    for (let z = 0; z < 10; z++) for (let x = 0; x < 10; x++) base.push([0.12 + x * 0.19 + (r() - 0.5) * 0.04, 0.12 + z * 0.19 + (r() - 0.5) * 0.04, r() * 3]);
    g.crops = { im, base, mat, last: -1 };
    b.mesh(im);
  },

  agil(b, g) {
    // çit
    const pts = [V(0.05, 0, 0.05), V(1.95, 0, 0.05), V(1.95, 0, 1.95), V(0.05, 0, 1.95), V(0.05, 0, 0.05)];
    for (let e = 0; e < 4; e++) {
      const a = pts[e], c = pts[e + 1];
      for (let k = 0; k <= 7; k++) {
        const p = a.clone().lerp(c, k / 7);
        b.cyl(M.woodDark, p.x, 0, p.z, 0.011, 0.013, 0.16, 5);
      }
      if (e === 2) {
        b.beam(M.wood, V(a.x, 0.08, a.z), V(1.2, 0.08, a.z), 0.008); b.beam(M.wood, V(a.x, 0.14, a.z), V(1.2, 0.14, a.z), 0.008);
        b.beam(M.wood, V(0.8, 0.08, a.z), V(c.x, 0.08, a.z), 0.008); b.beam(M.wood, V(0.8, 0.14, a.z), V(c.x, 0.14, a.z), 0.008);
      } else {
        b.beam(M.wood, V(a.x, 0.08, a.z), V(c.x, 0.08, c.z), 0.008);
        b.beam(M.wood, V(a.x, 0.14, a.z), V(c.x, 0.14, c.z), 0.008);
      }
    }
    // sundurma
    b.box(M.wood, 0.5, 0, 0.35, 0.75, 0.24, 0.04);
    b.box(M.wood, 0.14, 0, 0.55, 0.04, 0.22, 0.4);
    for (const x of [0.15, 0.85]) b.cyl(M.woodDark, x, 0, 0.75, 0.012, 0.012, 0.2, 6);
    b.add(boxGeo(0.84, 0.03, 0.55), M.woodDark, 0.5, 0.23, 0.55, 0, 0.18);
    b.box(M.wood, 1.5, 0, 0.4, 0.3, 0.05, 0.08);
    // koyunlar ayrı (hareketli)
    const sheep = [];
    const r = rnd(3);
    for (let k = 0; k < 7; k++) {
      const sb = new Builder();
      sb.add(new THREE.SphereGeometry(0.06, 10, 8), M.wool, 0, 0.075, 0, 0, 0, 0, 1.35, 0.85, 0.9);
      sb.add(new THREE.SphereGeometry(0.028, 8, 6), M.woolDark, 0.085, 0.09, 0, 0, 0, 0, 1.3, 1, 0.9);
      for (const [lx, lz] of [[0.045, 0.03], [0.045, -0.03], [-0.045, 0.03], [-0.045, -0.03]]) sb.cyl(M.woolDark, lx, 0, lz, 0.008, 0.008, 0.05, 4);
      const s = sb.build();
      s.position.set(0.5 + r() * 1.2, 0, 0.9 + r() * 0.8);
      s.rotation.y = r() * 6;
      s.userData = { tx: s.position.x, tz: s.position.z, wait: r() * 3 };
      sheep.push(s);
      b.mesh(s);
    }
    g.sheep = sheep;
  },

  degirmen(b, g) {
    b.cyl(M.stoneRough, 0.5, 0, 0.48, 0.22, 0.26, 0.62, 14);
    b.add(new THREE.ConeGeometry(0.27, 0.26, 14), M.woodDark, 0.5, 0.62 + 0.13, 0.48);
    door(b, '+z', 0.5, 0, 0.735, 0.1, 0.2, true);
    win(b, '+x', 0.735, 0.35, 0.48, 0.06, 0.08);
    sack(b, 0.2, 0.85); sack(b, 0.3, 0.88, 0.9); sack(b, 0.82, 0.82);
    // pervane
    const sails = new THREE.Group();
    const sb = new Builder();
    sb.cyl(M.woodDark, 0, 0, 0, 0.03, 0.03, 0.08, 8, Math.PI / 2);
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * Math.PI * 2;
      const tip = V(Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0.04);
      sb.beam(M.woodDark, V(0, 0, 0.04), tip, 0.008);
      const n = V(-Math.sin(a), Math.cos(a), 0);
      const p0 = V(Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0.045), p1 = tip.clone().setZ(0.045);
      const q = [p0, p1, p1.clone().addScaledVector(n, 0.09), p0.clone().addScaledVector(n, 0.07)];
      const sg = new THREE.BufferGeometry().setFromPoints([q[0], q[1], q[2], q[0], q[2], q[3]]);
      sg.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2));
      sg.computeVertexNormals();
      sb.add(sg, M.cloth);
    }
    const sm = sb.build();
    sails.add(sm);
    sails.position.set(0.5, 0.6, 0.76);
    b.mesh(sails);
    g.sails = sails;
  },

  firin(b, g) {
    b.box(M.stoneRough, 0.45, 0, 0.45, 0.66, 0.04, 0.6);
    b.box(M.plasterWarm, 0.4, 0.04, 0.45, 0.56, 0.32, 0.5);
    b.box(M.soilRoof, 0.4, 0.36, 0.45, 0.62, 0.04, 0.56);
    door(b, '+z', 0.28, 0.04, 0.705, 0.11, 0.21, false);
    // taş fırın kubbesi
    b.add(domeGeo(0.17, 16, 0.85), M.plaster, 0.78, 0.04, 0.55);
    b.arch(M.dark, '+z', 0.78, 0.04, 0.715, 0.09, 0.09, false);
    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.035, 10), M.glow);
    glow.position.set(0.78, 0.075, 0.72);
    b.mesh(glow);
    g.glow = glow;
    b.cyl(M.stoneRough, 0.6, 0.36, 0.3, 0.035, 0.04, 0.22, 8);
    win(b, '+z', 0.5, 0.18, 0.705, 0.09, 0.09);
    logPile(b, 0.85, 0.2, 3, 0.22, Math.PI / 2);
    for (let k = 0; k < 3; k++) b.add(new THREE.SphereGeometry(0.03, 8, 6), M.logEnd, 0.18 + k * 0.07, 0.025, 0.85, 0, 0, 0, 1.3, 0.6, 1);
    g.smoke = [V(0.6, 0.6, 0.3)];
  },

  dokumaci(b, g) {
    b.box(M.stoneRough, 0.42, 0, 0.4, 0.62, 0.04, 0.55);
    b.box(M.plasterLight, 0.42, 0.04, 0.4, 0.56, 0.34, 0.48);
    roofHip(b, 0.42, 0.38, 0.4, 0.56, 0.48, 0.2, M.roof, 0.09);
    door(b, '+z', 0.3, 0.04, 0.645, 0.11, 0.22, false);
    win(b, '+z', 0.55, 0.18, 0.645, 0.09, 0.1);
    // dokuma tezgâhı ve kilim
    for (const x of [0.62, 0.95]) b.cyl(M.woodDark, x, 0, 0.85, 0.011, 0.011, 0.36, 6);
    b.beam(M.woodDark, V(0.62, 0.35, 0.85), V(0.95, 0.35, 0.85), 0.01);
    b.beam(M.woodDark, V(0.62, 0.06, 0.85), V(0.95, 0.06, 0.85), 0.01);
    b.add(new THREE.PlaneGeometry(0.3, 0.27), M.kilim, 0.785, 0.205, 0.85);
    // ip üstünde kilim
    b.cyl(M.woodDark, 0.85, 0, 0.12, 0.008, 0.008, 0.3, 5);
    b.beam(M.rope, V(0.85, 0.28, 0.12), V(0.75, 0.3, 0.12), 0.003);
    b.add(new THREE.PlaneGeometry(0.2, 0.32), M.kilim, 0.88, 0.16, 0.17, Math.PI / 2);
  },

  ambar(b, g) {
    b.box(M.stoneRough, 0.5, 0, 0.47, 0.76, 0.1, 0.66);
    b.box(M.wood, 0.5, 0.1, 0.47, 0.72, 0.36, 0.62);
    for (let k = 0; k <= 4; k++) b.box(M.woodDark, 0.14 + k * 0.18, 0.1, 0.785, 0.022, 0.36, 0.012);
    roofGable(b, 0.5, 0.46, 0.47, 0.72, 0.62, 0.26, M.roof, M.wood, 0.07);
    b.box(M.woodDark, 0.5, 0.1, 0.785, 0.24, 0.26, 0.02);
    b.box(M.dark, 0.5, 0.1, 0.788, 0.008, 0.26, 0.02);
    sack(b, 0.15, 0.9); sack(b, 0.24, 0.9); sack(b, 0.85, 0.88); barrel(b, 0.92, 0.2);
  },

  kervansaray(b, g) {
    const wm = M.stoneCut, t = 0.22, h = 0.46;
    b.box(wm, 1.0, 0, 0.12 + t / 2 - 0.11, 1.9, h, t);
    b.box(wm, 1.0, 0, 1.88 - t / 2 + 0.11, 1.9, h, t);
    b.box(wm, 0.12 + t / 2 - 0.11, 0, 1.0, t, h, 1.9 - 2 * t);
    b.box(wm, 1.88 - t / 2 + 0.11, 0, 1.0, t, h, 1.9 - 2 * t);
    // revak çatıları (iç)
    b.box(M.soilRoof, 1.0, h, 1.0, 1.94, 0.03, 1.94);
    b.box(M.stoneGrey, 1.0, 0.0, 1.0, 1.44, 0.015, 1.44);
    // avlu ortası köşk mescit
    b.box(wm, 1.0, 0.015, 1.0, 0.3, 0.32, 0.3);
    b.add(domeGeo(0.15, 16, 0.8), M.lead, 1.0, 0.335, 1.0);
    // köşe kuleleri (payandalar)
    for (const [x, z] of [[0.05, 0.05], [1.95, 0.05], [0.05, 1.95], [1.95, 1.95]]) {
      b.cyl(wm, x, 0, z, 0.1, 0.12, 0.54, 10);
      b.add(domeGeo(0.1, 10, 0.7), wm, x, 0.54, z);
    }
    for (let k = 0; k < 3; k++) {
      b.box(wm, 1.95, 0, 0.45 + k * 0.55, 0.09, 0.42, 0.12);
      b.box(wm, 0.45 + k * 0.55, 0, 0.05, 0.12, 0.42, 0.09);
    }
    // anıtsal taç kapı
    b.box(wm, 1.0, 0, 1.94, 0.62, 0.72, 0.14);
    b.box(M.stoneGrey, 1.0, 0.0, 2.012, 0.5, 0.64, 0.005);
    b.arch(M.dark, '+z', 1.0, 0, 2.015, 0.22, 0.42);
    b.arch(M.stoneGrey, '+z', 1.0, 0.0, 2.016, 0.34, 0.58);
    b.arch(M.dark, '+z', 1.0, 0, 2.02, 0.22, 0.42);
    for (let k = 0; k < 5; k++) b.box(M.stoneCut, 0.78 + k * 0.11, 0.62, 2.015, 0.05, 0.05, 0.015);
    for (let k = 0; k < 4; k++) win(b, '+x', 2.005, 0.2, 0.3 + k * 0.42, 0.04, 0.12);
    // develer
    const camel = (x, z, ry) => {
      const cb = new Builder();
      cb.add(new THREE.SphereGeometry(0.1, 12, 8), M.camel, 0, 0.26, 0, 0, 0, 0, 1.5, 0.75, 0.8);
      cb.add(new THREE.SphereGeometry(0.07, 10, 8), M.camel, -0.02, 0.33, 0, 0, 0, 0, 1.1, 0.9, 0.8);
      cb.beam(M.camel, V(0.13, 0.27, 0), V(0.22, 0.42, 0), 0.025);
      cb.add(new THREE.SphereGeometry(0.035, 8, 6), M.camel, 0.25, 0.43, 0, 0, 0, 0, 1.6, 0.9, 0.9);
      for (const [lx, lz] of [[0.09, 0.04], [0.09, -0.04], [-0.09, 0.04], [-0.09, -0.04]]) cb.cyl(M.camel, lx, 0, lz, 0.012, 0.014, 0.22, 5);
      cb.box(M.kilim, -0.02, 0.32, 0, 0.12, 0.02, 0.17);
      sack(cb, -0.02, 0.1, 0.8);
      const c = cb.build();
      c.position.set(x, 0, z); c.rotation.y = ry;
      b.mesh(c);
    };
    camel(0.35, 2.25, 0.3); camel(1.75, 2.3, 2.6);
  }
};

export function buildModel(type, id) {
  const b = new Builder();
  const g = {};
  BUILD[type](b, g, id || 1);
  const grp = b.build();
  grp.userData.dyn = g;
  return grp;
}

// İnşaat iskelesi
export function buildScaffold(def) {
  const w = def.w, d = def.h;
  const b = new Builder();
  b.box(M.stoneRough, w / 2, 0, d / 2, w * 0.8, 0.04, d * 0.8);
  const ph = w > 1 ? 0.7 : 0.5;
  const pts = [[0.12, 0.12], [w - 0.12, 0.12], [0.12, d - 0.12], [w - 0.12, d - 0.12], [w / 2, d - 0.08], [w - 0.08, d / 2]];
  for (const [x, z] of pts) b.cyl(M.woodDark, x, 0, z, 0.012, 0.012, ph, 5);
  for (const y of [ph * 0.45, ph * 0.9]) {
    b.beam(M.wood, V(0.12, y, d - 0.12), V(w - 0.12, y, d - 0.12), 0.01);
    b.beam(M.wood, V(w - 0.12, y, 0.12), V(w - 0.12, y, d - 0.12), 0.01);
  }
  logPile(b, 0.15, d - 0.05, 3, 0.25, Math.PI / 2);
  b.box(M.stoneCut, w - 0.2, 0, d + 0.02, 0.1, 0.07, 0.1);
  b.box(M.stoneCut, w - 0.08, 0, d + 0.02, 0.1, 0.07, 0.1, 0.3);
  const grp = b.build();
  const wallMat = ['cami', 'kervansaray', 'cesme', 'hamam'].includes(def.key) ? M.stoneCut : ['oduncu', 'avci', 'ambar'].includes(def.key) ? M.wood : M.plaster;
  const wg = boxGeo(w * 0.7, 1, d * 0.6);
  wg.translate(0, 0.5, 0);
  const wall = new THREE.Mesh(wg, wallMat);
  wall.position.set(w / 2, 0.04, d / 2);
  wall.castShadow = true; wall.receiveShadow = true;
  grp.add(wall);
  grp.userData.wall = wall;
  grp.userData.wallH = w > 1 ? 0.55 : 0.38;
  return grp;
}
