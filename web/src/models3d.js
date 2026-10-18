// Mobilyaların 3B modelleri (basit geometrilerden, gerçek ölçülerde).
// Yerel eksen: x = genişlik, z = derinlik (sırt -d/2, ön +d/2), y = yukarı. Birim: metre.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { CATALOG } from './catalog.js';
import { FURN_TONE, FABRIC, fabricTexture, accentColors, grainTexture, stoneTexture, tvTexture, patternRugTexture } from './textures.js';

const cm = (v) => v / 100;

function repeatTex(t, n) {
  const c = t.clone();
  c.needsUpdate = true;
  c.repeat.set(n, n);
  return c;
}

export function makeMaterials(style) {
  const tone = FURN_TONE[style.furniture] || FURN_TONE.dogal;
  const fab = FABRIC[style.fabric] || FABRIC.gri;
  const accents = accentColors(style);
  const fabricMap = repeatTex(fabricTexture(), 4);
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const cloth = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.92, map: fabricMap, sheen: 0.6, sheenRoughness: 0.7, sheenColor: new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.5), ...o });
  const fabricCol = new THREE.Color(fab.color);
  const light = fabricCol.clone().lerp(new THREE.Color('#ffffff'), 0.3);
  const dark = style.furniture === 'antrasit';
  const woodMap = grainTexture(tone.wood);
  const stone = stoneTexture(dark || style.furniture === 'ceviz' ? 'mermer' : 'granit');
  const tvMap = tvTexture();
  return {
    decor: style.decor !== false,
    accents,
    wood: std({ color: '#ffffff', map: woodMap, roughness: 0.5 }),
    woodDark: std({ color: '#5b3f2b', roughness: 0.5, map: woodMap }),
    body: std({ color: tone.body, roughness: 0.42 }),
    fabric: cloth(fabricCol),
    fabricLight: cloth(light),
    linen: cloth('#f4f1eb'),
    linen2: cloth('#e9e3d8'),
    blanket: cloth(accents[0]),
    accent: accents.map((c) => cloth(c)),
    accentGloss: accents.map((c) => std({ color: c, roughness: 0.25 })),
    ceramic: std({ color: '#f7f7f5', roughness: 0.12, metalness: 0 }),
    metal: std({ color: '#c9c9c9', roughness: 0.25, metalness: 0.9 }),
    brass: std({ color: '#c9a24b', roughness: 0.3, metalness: 0.85 }),
    blackMetal: std({ color: '#262626', roughness: 0.38, metalness: 0.6 }),
    screen: std({ color: '#0d0e10', roughness: 0.12, metalness: 0.3 }),
    tvOn: std({ color: '#000000', emissive: '#ffffff', emissiveMap: tvMap, emissiveIntensity: 0.55, roughness: 0.15 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#dfeef2', roughness: 0.05, transparent: true, opacity: 0.25, metalness: 0 }),
    mirror: std({ color: '#d8e2e6', roughness: 0.02, metalness: 1 }),
    counter: std({ color: '#ffffff', map: stone, roughness: 0.28 }),
    kitchen: std({ color: tone.body, roughness: 0.38 }),
    steel: std({ color: '#d4d6d7', roughness: 0.22, metalness: 0.85 }),
    leaf: std({ color: '#4d7a3c', roughness: 0.75, side: THREE.DoubleSide }),
    leaf2: std({ color: '#3c6a46', roughness: 0.7, side: THREE.DoubleSide }),
    leaf3: std({ color: '#6e9a4a', roughness: 0.75, side: THREE.DoubleSide }),
    soil: std({ color: '#3b2d22', roughness: 1 }),
    pot: std({ color: '#d8cfc2', roughness: 0.7 }),
    shade: std({ color: '#f6efe0', roughness: 0.8, emissive: '#ffdca8', emissiveIntensity: 0.35, side: THREE.DoubleSide }),
    bulb: std({ color: '#fff6e6', emissive: '#ffe2b0', emissiveIntensity: 1.2 }),
    water: std({ color: '#cfe3ea', roughness: 0.08 }),
    fruit: [std({ color: '#d9822b', roughness: 0.5 }), std({ color: '#b8352c', roughness: 0.45 }), std({ color: '#9fb53a', roughness: 0.5 })],
    rugMap: (seed) => std({ color: '#ffffff', roughness: 1, map: patternRugTexture(seed, accents) }),
    book: [std({ color: '#8b3a2f', roughness: 0.7 }), std({ color: '#2f4b6b', roughness: 0.7 }), std({ color: '#d8c49c', roughness: 0.7 }), std({ color: '#4e6b47', roughness: 0.7 }), ...accents.map((c) => std({ color: c, roughness: 0.7 }))],
  };
}

function box(g, w, h, d, x, y, z, mat, r = 0) {
  const geo = r > 0 ? new RoundedBoxGeometry(cm(w), cm(h), cm(d), 3, cm(Math.min(r, w / 2, h / 2, d / 2))) : new THREE.BoxGeometry(cm(w), cm(h), cm(d));
  const m = new THREE.Mesh(geo, mat);
  m.position.set(cm(x), cm(y + h / 2), cm(z));
  m.castShadow = true;
  m.receiveShadow = true;
  g.add(m);
  return m;
}

function cyl(g, rTop, rBot, h, x, y, z, mat, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(cm(rTop), cm(rBot), cm(h), seg), mat);
  m.position.set(cm(x), cm(y + h / 2), cm(z));
  m.castShadow = true;
  m.receiveShadow = true;
  g.add(m);
  return m;
}

function sphere(g, r, x, y, z, mat, sx = 1, sy = 1, sz = 1) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(cm(r), 16, 12), mat);
  m.position.set(cm(x), cm(y), cm(z));
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  g.add(m);
  return m;
}

function legs(g, w, d, h, inset, r, mat) {
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, r, r * 0.75, h, sx * (w / 2 - inset), 0, sz * (d / 2 - inset), mat, 10);
}

// Kırlent: hafif yuvarlak, öne eğik
function cushion(g, size, x, y, z, mat, tilt = -0.25, yaw = 0) {
  const m = box(g, size, size, 13, x, y, z, mat, 6);
  m.rotation.x = tilt;
  m.rotation.y = yaw;
  m.scale.z = 0.9;
  return m;
}

function vase(g, x, y, z, mat, M, h = 24, withStems = true) {
  cyl(g, 4, 6, h * 0.25, x, y, z, mat, 16);
  cyl(g, 6, 4, h * 0.5, x, y + h * 0.25, z, mat, 16);
  cyl(g, 2.5, 4, h * 0.25, x, y + h * 0.75, z, mat, 16);
  if (withStems) for (let i = 0; i < 5; i++) {
    const s = cyl(g, 0.3, 0.3, 26, x + (i - 2) * 1.5, y + h - 2, z + ((i % 2) - 0.5) * 2, M.leaf2, 4);
    s.rotation.z = (i - 2) * 0.12;
    sphere(g, 2.4, x + (i - 2) * 4.2, y + h + 23, z + ((i % 2) - 0.5) * 3, M.leaf3, 1, 0.5, 0.8);
  }
}

function booksStack(g, x, y, z, M, seed = 0) {
  const r = mulberry(seed + 11);
  let yy = y;
  for (let i = 0; i < 3; i++) {
    const bw = 22 + r() * 8, bd = 15 + r() * 4, bh = 2.5 + r() * 1.5;
    const b = box(g, bw, bh, bd, x + (r() - 0.5) * 3, yy, z, M.book[Math.floor(r() * M.book.length)], 0.4);
    b.rotation.y = (r() - 0.5) * 0.3;
    yy += bh;
  }
  return yy;
}

function fruitBowl(g, x, y, z, M) {
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(cm(14), 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.ceramic);
  bowl.position.set(cm(x), cm(y + 7), cm(z));
  bowl.scale.y = 0.55;
  bowl.castShadow = true;
  g.add(bowl);
  const r = mulberry(Math.round(x * 13 + z * 7));
  for (let i = 0; i < 5; i++) sphere(g, 3.6, x + (r() - 0.5) * 12, y + 6 + r() * 2, z + (r() - 0.5) * 12, M.fruit[i % 3]);
}

const builders = {
  bed(g, f, M) {
    const { w, d } = f;
    const double = w >= 130;
    box(g, w, 26, d - 6, 0, 8, 3, M.fabric, 3); // baza
    legs(g, w - 10, d - 16, 8, 6, 2.5, M.wood);
    box(g, w - 6, 22, d - 14, 0, 34, 5, M.linen, 6); // yatak
    // kumaş kaplı, dikey dilimli başlık
    const n = Math.max(3, Math.round(w / 28));
    const sw = w / n;
    box(g, w, 102, 6, 0, 8, -d / 2 + 3, M.fabric, 2);
    for (let i = 0; i < n; i++) box(g, sw - 1.5, 80, 6, -w / 2 + sw * (i + 0.5), 30, -d / 2 + 7, M.fabric, 3);
    // yastıklar + dekoratif kırlentler
    const pc = double ? 2 : 1;
    const pw = (w - 24 - (pc - 1) * 6) / pc;
    for (let i = 0; i < pc; i++) {
      const p = box(g, pw, 16, 40, -w / 2 + 12 + pw / 2 + i * (pw + 6), 54, -d / 2 + 34, M.linen, 8);
      p.rotation.x = -0.25;
    }
    if (M.decor) {
      const k = double ? 3 : 1;
      for (let i = 0; i < k; i++) cushion(g, double ? (i === 1 ? 36 : 42) : 38, (i - (k - 1) / 2) * (double ? 44 : 0), 56, -d / 2 + 56, M.accent[(i + 1) % M.accent.length], -0.35);
    }
    // nevresim (üstte kıvrık) ve ayakucu örtüsü
    box(g, w - 2, 6, d * 0.64, 0, 55, d / 2 - d * 0.32 - 2, M.linen2, 3);
    box(g, w - 2, 7, 18, 0, 55, d / 2 - d * 0.64 - 4, M.linen, 3);
    box(g, w + 2, 7, 46, 0, 55.5, d / 2 - 30, M.blanket, 3);
    box(g, 2.5, 26, 46, -w / 2 - 0.5, 36, d / 2 - 30, M.blanket, 1);
    box(g, 2.5, 26, 46, w / 2 + 0.5, 36, d / 2 - 30, M.blanket, 1);
  },
  nightstand(g, f, M) {
    box(g, f.w, f.h - 6, f.d, 0, 6, 0, M.body, 1.5);
    legs(g, f.w - 4, f.d - 4, 6, 3, 1.2, M.wood);
    box(g, f.w - 4, 0.6, 0.6, 0, f.h - 22, f.d / 2, M.wood);
    box(g, 12, 1.2, 1.5, 0, f.h - 14, f.d / 2 + 0.5, M.brass, 0.5);
    // lamba
    cyl(g, 5, 7, 22, 0, f.h, -6, M.accentGloss[3 % M.accentGloss.length], 20);
    const shade = cyl(g, 10, 14, 18, 0, f.h + 22, -6, M.shade, 24);
    shade.castShadow = false;
    if (M.decor) booksStack(g, 2, f.h, 10, M, Math.round(f.x + f.y));
  },
  wardrobe(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h - 8, d - 2, 0, 8, -1, M.body, 1);
    box(g, w - 4, 8, d - 6, 0, 0, -3, M.blackMetal);
    const n = Math.max(2, Math.round(w / 50));
    const dw = w / n;
    for (let i = 0; i < n; i++) {
      box(g, dw - 0.8, h - 12, 2, -w / 2 + dw * (i + 0.5), 10, d / 2 - 1, M.body, 0.6);
      const hx = -w / 2 + dw * (i + 0.5) + (i % 2 ? -1 : 1) * (dw / 2 - 5);
      box(g, 1.4, 60, 2.2, hx, h / 2 - 25, d / 2 + 1, M.blackMetal, 0.6);
    }
    box(g, w, 2, d, 0, h - 2, -1, M.wood);
  },
  dresser(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h - 12, d, 0, 12, 0, M.body, 1.5);
    legs(g, w - 6, d - 6, 12, 3, 1.5, M.wood);
    const rows = 3;
    for (let i = 0; i < rows; i++) {
      const y0 = 12 + ((h - 14) / rows) * i;
      box(g, w - 3, (h - 14) / rows - 1.2, 1.2, 0, y0 + 0.6, d / 2, M.body, 0.4);
      box(g, 16, 1.2, 1.5, 0, y0 + (h - 14) / rows / 2, d / 2 + 1, M.brass, 0.5);
    }
    box(g, w, 2.5, d, 0, h - 2.5, 0, M.wood);
    if (M.decor) {
      vase(g, w * 0.3, h, 0, M.accentGloss[1], M, 22);
      booksStack(g, -w * 0.25, h, 2, M, Math.round(f.x));
      // ayna
      box(g, w * 0.7, 80, 2, 0, h + 20, -d / 2 + 2, M.mirror, 1);
      box(g, w * 0.7 + 4, 84, 1.5, 0, h + 18, -d / 2 + 0.8, M.wood, 1);
    }
  },
  sideboard(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h - 16, d, 0, 16, 0, M.body, 1.5);
    legs(g, w - 8, d - 8, 16, 4, 1.4, M.blackMetal);
    box(g, w, 2.5, d, 0, h - 2.5, 0, M.wood);
    const n = Math.max(2, Math.round(w / 45));
    for (let i = 0; i < n; i++) {
      box(g, w / n - 1, h - 22, 1, -w / 2 + (w / n) * (i + 0.5), 18, d / 2, M.wood, 0.4);
      box(g, 1.2, 12, 1.5, -w / 2 + (w / n) * (i + 0.5) + (i % 2 ? -1 : 1) * (w / n / 2 - 5), h / 2 + 4, d / 2 + 0.8, M.brass, 0.4);
    }
    if (M.decor) {
      vase(g, w * 0.3, h, 0, M.accentGloss[0], M, 28);
      booksStack(g, -w * 0.28, h, 0, M, Math.round(f.y));
      cyl(g, 9, 9, 2, -w * 0.05, h, 2, M.accentGloss[2 % M.accentGloss.length], 24); // dekoratif tabak
    }
  },
  shoe_cabinet(g, f, M) {
    builders.sideboard(g, f, M);
  },
  tv_unit(g, f, M) {
    const { w, d } = f;
    box(g, w, 34, d, 0, 14, 0, M.body, 1.5);
    legs(g, w - 8, d - 8, 14, 4, 1.4, M.blackMetal);
    box(g, w, 2.5, d, 0, 48, 0, M.wood);
    const n = Math.max(2, Math.round(w / 60));
    for (let i = 0; i < n; i++) box(g, w / n - 1, 30, 1, -w / 2 + (w / n) * (i + 0.5), 16, d / 2, M.wood, 0.4);
    // TV (açık ekran)
    const tw = Math.min(140, w * 0.75);
    const th = tw * 0.57;
    box(g, tw, th, 3, 0, 64, -d / 2 + 12, M.screen, 0.8);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(cm(tw - 2.5), cm(th - 2.5)), M.tvOn);
    scr.position.set(0, cm(64 + th / 2), cm(-d / 2 + 13.6));
    g.add(scr);
    box(g, 30, 1.5, 18, 0, 50.5, -d / 2 + 16, M.blackMetal);
    box(g, 4, 12, 4, 0, 52, -d / 2 + 12, M.blackMetal);
    box(g, tw * 0.55, 6, 8, 0, 50.5, d / 2 - 10, M.blackMetal, 2); // ses çubuğu
    if (M.decor) {
      vase(g, w / 2 - 18, 50.5, 0, M.accentGloss[1], M, 22, false);
      booksStack(g, -w / 2 + 20, 50.5, 0, M, Math.round(f.x * 3));
    }
  },
  sofa(g, f, M) {
    const { w, d } = f;
    const seats = CATALOG[f.type]?.seats || 3;
    box(g, w, 28, d - 4, 0, 12, 2, M.fabric, 5);
    legs(g, w - 12, d - 14, 12, 6, 1.8, M.blackMetal);
    box(g, w - 4, 44, 20, 0, 40, -d / 2 + 10, M.fabric, 8); // sırt
    box(g, 18, 24, d - 4, -w / 2 + 9, 40, 2, M.fabric, 8);
    box(g, 18, 24, d - 4, w / 2 - 9, 40, 2, M.fabric, 8);
    const sw = (w - 36) / seats;
    for (let i = 0; i < seats; i++) {
      box(g, sw - 1.5, 14, d - 26, -w / 2 + 18 + sw * (i + 0.5), 40, 10, M.fabricLight, 6);
      const b = box(g, sw - 5, 40, 15, -w / 2 + 18 + sw * (i + 0.5), 50, -d / 2 + 27, M.fabricLight, 7);
      b.rotation.x = -0.12;
    }
    if (M.decor) {
      cushion(g, 42, -w / 2 + 40, 54, -d / 2 + 38, M.accent[0], -0.3, 0.25);
      cushion(g, 38, -w / 2 + 70, 54, -d / 2 + 36, M.accent[1], -0.3, 0.1);
      cushion(g, 42, w / 2 - 40, 54, -d / 2 + 38, M.accent[0], -0.3, -0.25);
      const bl = box(g, 46, 3, 50, w / 2 - 34, 54, 12, M.blanket, 1.5);
      bl.rotation.y = 0.2;
    }
  },
  sofa_l(g, f, M) {
    const { w, d } = f;
    const s = f.mirror ? -1 : 1;
    const sd = 92;
    const inner = new THREE.Group();
    g.add(inner);
    inner.scale.x = s;
    const G = inner;
    box(G, w, 28, sd - 4, 0, 12, -d / 2 + sd / 2 + 2, M.fabric, 5);
    box(G, 95, 28, d - sd, w / 2 - 47.5, 12, -d / 2 + sd + (d - sd) / 2 - 2, M.fabric, 5);
    box(G, w - 4, 44, 20, 0, 40, -d / 2 + 10, M.fabric, 8);
    box(G, 18, 24, sd - 4, -w / 2 + 9, 40, -d / 2 + sd / 2 + 2, M.fabric, 8);
    box(G, 18, 24, d - 4, w / 2 - 9, 40, 0, M.fabric, 8);
    const sw = (w - 95 - 18) / 2;
    for (let i = 0; i < 2; i++) {
      box(G, sw - 2, 14, sd - 28, -w / 2 + 18 + sw * (i + 0.5), 40, -d / 2 + sd / 2 + 10, M.fabricLight, 6);
      box(G, sw - 6, 40, 15, -w / 2 + 18 + sw * (i + 0.5), 50, -d / 2 + 27, M.fabricLight, 7).rotation.x = -0.12;
    }
    box(G, 76, 14, d - 28, w / 2 - 18 - 38, 40, 10, M.fabricLight, 6);
    box(G, 70, 40, 15, w / 2 - 18 - 38, 50, -d / 2 + 27, M.fabricLight, 7).rotation.x = -0.12;
    for (const lx of [-w / 2 + 8, w / 2 - 8]) for (const lz of [-d / 2 + 8, d / 2 - 8]) cyl(G, 1.8, 1.4, 12, lx, 0, lz, M.blackMetal, 10);
    if (M.decor) {
      cushion(G, 42, -w / 2 + 40, 54, -d / 2 + 38, M.accent[0], -0.3, 0.25);
      cushion(G, 38, -w / 2 + 72, 54, -d / 2 + 36, M.accent[1], -0.3, 0.1);
      cushion(G, 42, w / 2 - 40, 54, -d / 2 + 40, M.accent[0], -0.3, -0.35);
      const bl = box(G, 60, 3, 46, w / 2 - 56, 54, d / 2 - 40, M.blanket, 1.5);
      bl.rotation.y = -0.15;
    }
  },
  armchair(g, f, M) {
    const { w, d } = f;
    const mat = M.decor ? M.accent[0] : M.fabric;
    box(g, w, 26, d - 4, 0, 16, 2, mat, 6);
    legs(g, w - 12, d - 14, 16, 6, 1.6, M.wood);
    const back = box(g, w - 4, 46, 14, 0, 40, -d / 2 + 8, mat, 7);
    back.rotation.x = -0.1;
    box(g, 12, 22, d - 8, -w / 2 + 6, 42, 3, mat, 6);
    box(g, 12, 22, d - 8, w / 2 - 6, 42, 3, mat, 6);
    box(g, w - 26, 12, d - 22, 0, 42, 6, mat, 5);
    if (M.decor) cushion(g, 34, 0, 54, -d / 2 + 22, M.accent[2 % M.accent.length], -0.3);
  },
  coffee_table(g, f, M) {
    const { w, d, h } = f;
    box(g, w, 4, d, 0, h - 4, 0, M.wood, 2);
    box(g, w - 10, 2, d - 10, 0, 12, 0, M.body, 1);
    legs(g, w - 8, d - 8, h - 4, 4, 1.5, M.blackMetal);
    if (M.decor) {
      booksStack(g, -w * 0.22, h, 0, M, Math.round(f.x + 3));
      box(g, 34, 1.5, 22, w * 0.18, h, 0, M.woodDark, 1); // tepsi
      cyl(g, 3.5, 3.5, 9, w * 0.13, h + 1.5, -3, M.ceramic, 16); // mum
      vase(g, w * 0.25, h + 1.5, 4, M.accentGloss[1], M, 14, false);
    }
  },
  side_table(g, f, M) {
    cyl(g, f.w / 2, f.w / 2, 3, 0, f.h - 3, 0, M.wood, 28);
    cyl(g, 1.8, 1.8, f.h - 3, 0, 0, 0, M.blackMetal, 10);
    cyl(g, 14, 14, 1.5, 0, 0, 0, M.blackMetal, 24);
  },
  round_table(g, f, M) {
    builders.side_table(g, f, M);
    if (M.decor) vase(g, 0, f.h, 0, M.accentGloss[1], M, 16);
  },
  dining(g, f, M) {
    const { w, d, h } = f;
    box(g, w, 4, d, 0, h - 4, 0, M.wood, 1.5);
    legs(g, w - 14, d - 14, h - 4, 7, 2.8, M.wood);
    box(g, w - 20, 5, 4, 0, h - 10, -d / 2 + 9, M.wood);
    box(g, w - 20, 5, 4, 0, h - 10, d / 2 - 9, M.wood);
    if (M.decor) {
      box(g, Math.min(w - 30, 140), 0.5, 34, 0, h, 0, M.accent[3 % M.accent.length]); // masa örtüsü (runner)
      fruitBowl(g, -w * 0.12, h + 0.5, 0, M);
      vase(g, w * 0.2, h + 0.5, 0, M.accentGloss[0], M, 20);
    } else cyl(g, 7, 5, 12, 0, h, 0, M.ceramic, 18);
  },
  chair(g, f, M) {
    const { w, d } = f;
    box(g, w - 4, 7, d - 10, 0, 42, 3, M.fabricLight, 3);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const l = cyl(g, 1.6, 1.2, 43, sx * (w / 2 - 5), 0, sz * (d / 2 - 8) + 3, M.wood, 8);
      l.rotation.x = sz * 0.05;
    }
    const b = box(g, w - 6, 36, 3, 0, 50, -d / 2 + 4, M.wood, 1.2);
    b.rotation.x = -0.12;
  },
  office_chair(g, f, M) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const leg = box(g, 26, 2.5, 3.5, Math.cos(a) * 13, 4, Math.sin(a) * 13, M.blackMetal, 1);
      leg.rotation.y = -a;
      sphere(g, 2.5, Math.cos(a) * 25, 2.5, Math.sin(a) * 25, M.blackMetal);
    }
    cyl(g, 2.5, 2.5, 38, 0, 6, 0, M.metal, 10);
    box(g, 48, 8, 46, 0, 44, 2, M.fabric, 3);
    box(g, 44, 50, 6, 0, 56, -20, M.fabric, 3).rotation.x = -0.12;
  },
  desk(g, f, M) {
    const { w, d, h } = f;
    box(g, w, 3, d, 0, h - 3, 0, M.wood, 1);
    box(g, 2.5, h - 3, d - 4, -w / 2 + 2, 0, 0, M.blackMetal);
    box(g, 2.5, h - 3, d - 4, w / 2 - 2, 0, 0, M.blackMetal);
    box(g, 40, 14, d - 6, w / 2 - 24, h - 17, 0, M.body, 0.8);
    // ekran + klavye + lamba
    box(g, 55, 32, 2, 0, h + 12, -d / 2 + 12, M.screen, 0.6);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(cm(52), cm(29)), M.tvOn);
    scr.position.set(0, cm(h + 28), cm(-d / 2 + 13.05));
    g.add(scr);
    box(g, 4, 12, 4, 0, h, -d / 2 + 13, M.blackMetal);
    box(g, 40, 1.5, 13, 0, h, 6, M.body, 0.5);
    cyl(g, 7, 9, 3, -w / 2 + 16, h, -d / 2 + 14, M.blackMetal, 16);
    cyl(g, 1, 1, 34, -w / 2 + 16, h + 3, -d / 2 + 14, M.blackMetal, 8);
    const sh = cyl(g, 4, 9, 10, -w / 2 + 16, h + 33, -d / 2 + 18, M.accentGloss[0], 20);
    sh.rotation.x = 0.5;
    if (M.decor) {
      booksStack(g, w / 2 - 22, h, -4, M, Math.round(f.y));
      cyl(g, 4, 3.5, 10, w / 2 - 40, h, 8, M.accentGloss[2 % M.accentGloss.length], 16); // kupa
    }
  },
  bookshelf(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h, 2, 0, 0, -d / 2 + 1, M.body);
    box(g, 2, h, d, -w / 2 + 1, 0, 0, M.wood);
    box(g, 2, h, d, w / 2 - 1, 0, 0, M.wood);
    const shelves = 5;
    for (let i = 0; i <= shelves; i++) box(g, w - 4, 2, d - 2, 0, (h - 2) * (i / shelves), 1, M.wood);
    const r = mulberry(Math.round(f.x * 7 + f.y));
    for (let i = 0; i < shelves; i++) {
      let x = -w / 2 + 4;
      const y0 = (h - 2) * (i / shelves) + 2;
      while (x < w / 2 - 14 && r() > 0.06) {
        if (M.decor && r() > 0.86) {
          // aksesuar: vazo ya da kutu
          if (r() > 0.5) vase(g, x + 6, y0, 0, M.accentGloss[Math.floor(r() * M.accentGloss.length)], M, 16, false);
          else box(g, 12, 10, 14, x + 6, y0, 0, M.accent[Math.floor(r() * M.accent.length)], 1);
          x += 16;
          continue;
        }
        const bw = 2.5 + r() * 3, bh = 18 + r() * 12;
        const b = box(g, bw, bh, d - 10, x + bw / 2, y0, 2, M.book[Math.floor(r() * M.book.length)]);
        if (r() > 0.92) b.rotation.z = 0.15;
        x += bw + 0.4;
      }
    }
  },
  k_base(g, f, M) {
    const { w, d } = f;
    box(g, w - 0.4, 8, d - 6, 0, 0, -3, M.blackMetal);
    box(g, w - 0.4, 78, d - 2, 0, 8, -1, M.kitchen, 0.6);
    box(g, w - 1.5, 76, 0.8, 0, 9, d / 2 - 0.5, M.kitchen, 0.3);
    box(g, w, 4, d + 2, 0, 86, 1, M.counter);
    box(g, Math.min(24, w * 0.45), 1.2, 1.5, 0, 76, d / 2 + 0.6, M.metal, 0.5);
    // tezgâh üstü aksesuarlar (her modülde değil)
    if (M.decor && f.type === 'k_base' && w >= 50) {
      const r = mulberry(Math.round(f.x * 11 + f.y * 3));
      const v = r();
      if (v < 0.18) { // kesme tahtası
        const b = box(g, 36, 2, 24, 0, 90, -d / 2 + 16, M.wood, 1); b.rotation.x = -1.3; b.position.z = cm(-d / 2 + 6); b.position.y = cm(102);
      } else if (v < 0.32) { // kettle
        cyl(g, 7, 8, 18, 0, 90, -d / 2 + 18, M.steel, 20);
        box(g, 2, 12, 9, 8, 96, -d / 2 + 18, M.blackMetal, 1);
      } else if (v < 0.44) { // fesleğen saksısı
        cyl(g, 6, 5, 10, 0, 90, -d / 2 + 14, M.accentGloss[0], 16);
        for (let i = 0; i < 6; i++) sphere(g, 4, (r() - 0.5) * 8, 104 + r() * 4, -d / 2 + 14 + (r() - 0.5) * 6, M.leaf3, 1, 0.6, 1);
      } else if (v < 0.54) { // kavanozlar
        for (let i = 0; i < 3; i++) cyl(g, 4.5, 4.5, 12 + i * 3, -10 + i * 10, 90, -d / 2 + 12, M.glass, 16);
      }
    }
  },
  k_dishwasher(g, f, M) {
    const { w, d } = f;
    box(g, w - 0.4, 8, d - 6, 0, 0, -3, M.blackMetal);
    box(g, w - 0.4, 78, d - 2, 0, 8, -1, M.kitchen, 0.6);
    box(g, w, 4, d + 2, 0, 86, 1, M.counter);
    box(g, w - 6, 2, 1, 0, 78, d / 2 + 0.2, M.steel);
  },
  k_sink(g, f, M) {
    const { w, d } = f;
    builders.k_base(g, f, M);
    box(g, w - 22, 1, d - 26, 0, 90.1, 2, M.steel);
    box(g, w - 28, 0.6, d - 32, 0, 90.4, 2, M.steel);
    // batarya
    cyl(g, 1.8, 2.2, 26, 0, 90, -d / 2 + 8, M.metal, 12);
    const spout = cyl(g, 1.2, 1.2, 18, 0, 114, -d / 2 + 15, M.metal, 10);
    spout.rotation.x = Math.PI / 2;
    box(g, 1.5, 1.5, 8, 4, 108, -d / 2 + 8, M.metal, 0.6);
    if (M.decor) box(g, 8, 3, 6, -w / 2 + 14, 90, -d / 2 + 10, M.accent[1], 1); // sünger
  },
  k_stove(g, f, M) {
    const { w, d } = f;
    box(g, w - 0.4, 8, d - 6, 0, 0, -3, M.blackMetal);
    box(g, w - 0.4, 78, d - 2, 0, 8, -1, M.steel, 0.6);
    box(g, w - 8, 42, 1, 0, 18, d / 2, M.screen); // fırın camı
    box(g, w - 10, 1.5, 2, 0, 66, d / 2 + 1, M.metal, 0.6);
    for (let i = 0; i < 4; i++) cyl(g, 1.8, 1.8, 2, -w / 2 + 10 + i * ((w - 20) / 3), 74, d / 2 + 0.5, M.blackMetal, 12).rotation.x = Math.PI / 2;
    box(g, w, 4, d + 2, 0, 86, 1, M.counter);
    box(g, w - 4, 0.8, d - 6, 0, 90, 0, M.screen);
    for (const [px, pz, r] of [[-14, -12, 8], [14, -12, 6], [-14, 13, 6], [14, 13, 8]]) cyl(g, r, r, 1.2, px, 90.6, pz, M.blackMetal, 20);
    if (M.decor) { cyl(g, 10, 10, 9, -14, 91, 13, M.steel, 20); box(g, 14, 1.5, 2, -28, 98, 13, M.blackMetal); }
  },
  k_fridge(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h, d - 2, 0, 0, -1, M.steel, 1.5);
    box(g, w - 1, 0.6, 0.6, 0, h * 0.62, d / 2, M.blackMetal);
    box(g, 2, 40, 3, -w / 2 + 6, h * 0.66, d / 2 + 1, M.metal, 0.8);
    box(g, 2, 30, 3, -w / 2 + 6, h * 0.62 - 36, d / 2 + 1, M.metal, 0.8);
  },
  k_tall(g, f, M) {
    box(g, f.w - 0.4, f.h, f.d - 2, 0, 0, -1, M.kitchen, 0.6);
    box(g, 1.4, 50, 2, f.w / 2 - 6, f.h / 2 - 25, f.d / 2, M.metal, 0.5);
  },
  k_upper(g, f, M) {
    const { w, d, h } = f;
    const e = f.elev ?? 150;
    if (f.hood) {
      box(g, w, 10, d, 0, e, 0, M.steel, 1);
      box(g, 26, 90, 24, 0, e + 10, -d / 2 + 12, M.steel, 1);
      return;
    }
    box(g, w - 0.4, h, d - 1, 0, e, -0.5, M.kitchen, 0.6);
    box(g, w - 1.5, h - 1, 0.8, 0, e + 0.5, d / 2 - 0.5, M.kitchen, 0.3);
    box(g, Math.min(20, w * 0.35), 1.2, 1.5, 0, e + 5, d / 2 + 0.6, M.metal, 0.5);
    // dolap altı aydınlatma
    const strip = new THREE.Mesh(new THREE.BoxGeometry(cm(w - 6), cm(0.6), cm(2)), M.bulb);
    strip.position.set(0, cm(e - 0.3), cm(d / 2 - 6));
    g.add(strip);
  },
  k_island(g, f, M) {
    const { w, d, h } = f;
    box(g, w - 4, 8, d - 34, 0, 0, -12, M.blackMetal);
    box(g, w - 4, 80, d - 30, 0, 8, -12, M.kitchen, 0.6);
    const n = Math.max(2, Math.round(w / 60));
    for (let i = 0; i < n; i++) {
      box(g, (w - 4) / n - 1.2, 76, 0.8, -w / 2 + 2 + ((w - 4) / n) * (i + 0.5), 9, -d / 2 + 0.4, M.kitchen, 0.3);
      box(g, 20, 1.2, 1.5, -w / 2 + 2 + ((w - 4) / n) * (i + 0.5), 78, -d / 2 - 0.3, M.metal, 0.5);
    }
    box(g, w, 4, d, 0, h - 4, 0, M.counter);
    if (M.decor) fruitBowl(g, w * 0.2, h, -8, M);
  },
  bar_stool(g, f, M) {
    cyl(g, 18, 18, 7, 0, 68, 0, M.decor ? M.accent[0] : M.fabric, 24);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const l = cyl(g, 1.2, 1.2, 70, Math.cos(a) * 12, 0, Math.sin(a) * 12, M.blackMetal, 8);
      l.rotation.z = Math.cos(a) * 0.08;
      l.rotation.x = -Math.sin(a) * 0.08;
    }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(cm(13), cm(0.8), 8, 24), M.blackMetal);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = cm(28);
    g.add(ring);
  },
  toilet(g, f, M) {
    const { w, d } = f;
    box(g, w, 36, 16, 0, 42, -d / 2 + 8, M.ceramic, 4);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(cm(w / 2), cm(w / 2 - 6), cm(40), 28), M.ceramic);
    bowl.scale.z = (d - 16) / w;
    bowl.position.set(0, cm(20), cm(-d / 2 + 16 + (d - 16) / 2));
    bowl.castShadow = bowl.receiveShadow = true;
    g.add(bowl);
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(cm(w / 2 + 0.5), cm(w / 2 + 0.5), cm(2), 28), M.ceramic);
    seat.scale.z = (d - 16) / w;
    seat.position.set(0, cm(41), cm(-d / 2 + 16 + (d - 16) / 2));
    g.add(seat);
    box(g, 6, 1, 3, 0, 78, -d / 2 + 8, M.metal, 0.5);
  },
  basin(g, f, M) {
    const { w, d } = f;
    box(g, w, 48, d - 2, 0, 20, -1, M.body, 1.2);
    box(g, w - 2, 46, 0.8, 0, 21, d / 2 - 1.5, M.body, 0.3);
    box(g, 16, 1.2, 1.5, 0, 62, d / 2, M.metal, 0.5);
    box(g, w, 6, d, 0, 79, 0, M.ceramic, 2);
    box(g, w - 18, 0.5, d - 18, 0, 85, 2, M.water);
    cyl(g, 1.5, 1.5, 16, 0, 85, -d / 2 + 5, M.metal, 10);
    // çerçeveli ayna + aplik
    box(g, w - 4, 70, 1.5, 0, 105, -d / 2 + 1, M.mirror, 0.5);
    box(g, w, 74, 1, 0, 103, -d / 2 + 0.3, M.blackMetal, 0.5);
    box(g, w * 0.5, 3, 4, 0, 180, -d / 2 + 3, M.bulb, 1);
    if (M.decor) {
      // havlu ve sabunluk
      box(g, 3, 40, 26, w / 2 + 2, 42, 0, M.accent[3 % M.accent.length], 1.5);
      box(g, 1, 1, 30, w / 2 + 3.5, 82, 0, M.metal);
      cyl(g, 3, 3, 9, -w / 2 + 9, 85, -d / 2 + 8, M.accentGloss[0], 14);
    }
  },
  shower(g, f, M) {
    const { w, d } = f;
    box(g, w, 6, d, 0, 0, 0, M.ceramic, 2);
    const gl = M.glass;
    box(g, 1, 194, d, w / 2 - 0.5, 6, 0, gl);
    box(g, w, 194, 1, 0, 6, d / 2 - 0.5, gl);
    box(g, 1.5, 194, 1.5, w / 2 - 0.75, 6, d / 2 - 0.75, M.metal);
    box(g, w, 1.5, 1.5, 0, 199, d / 2 - 0.75, M.metal);
    box(g, 1.5, 1.5, d, w / 2 - 0.75, 199, 0, M.metal);
    cyl(g, 1, 1, 100, -w / 2 + 6, 100, -d / 2 + 6, M.metal, 10);
    cyl(g, 10, 10, 1.2, -w / 2 + 14, 195, -d / 2 + 14, M.metal, 20);
  },
  bathtub(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h, d, 0, 0, 0, M.ceramic, 3);
    box(g, w - 14, 1, d - 14, 0, h - 14, 0, M.water, 1);
    cyl(g, 1.5, 1.5, 12, w / 2 - 12, h, -d / 2 + 5, M.metal, 10);
    if (M.decor) box(g, 30, 2, 22, -w / 2 + 24, h, d / 2 - 6, M.accent[3 % M.accent.length], 1).rotation.y = 0.1;
  },
  washer(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h, d - 2, 0, 0, -1, M.ceramic, 2);
    const door = new THREE.Mesh(new THREE.CylinderGeometry(cm(19), cm(19), cm(3), 32), M.glass);
    door.rotation.x = Math.PI / 2;
    door.position.set(0, cm(h * 0.45), cm(d / 2));
    g.add(door);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(cm(20), cm(2), 10, 32), M.metal);
    ring.position.set(0, cm(h * 0.45), cm(d / 2));
    g.add(ring);
    box(g, w - 6, 8, 1, 0, h - 12, d / 2 - 1, M.blackMetal);
  },
  plant(g, f, M) {
    const r = mulberry(Math.round(f.x * 3 + f.y * 5));
    const kind = Math.floor(r() * 3);
    const potMat = M.accentGloss.length ? M.accentGloss[Math.floor(r() * 4) % M.accentGloss.length] : M.pot;
    cyl(g, 16, 12, 34, 0, 0, 0, kind === 0 ? M.pot : potMat, 24);
    cyl(g, 15, 15, 1, 0, 32, 0, M.soil, 20);
    if (kind === 0) {
      // geniş yapraklı (kauçuk / ficus)
      cyl(g, 1.5, 2, 50, 0, 34, 0, M.woodDark, 8);
      for (let i = 0; i < 18; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(cm(13), 10, 8), i % 3 ? M.leaf : M.leaf2);
        leaf.scale.set(1, 0.22, 0.45);
        const a = r() * Math.PI * 2, rad = 6 + r() * 16;
        leaf.position.set(cm(Math.cos(a) * rad), cm(60 + r() * 70), cm(Math.sin(a) * rad));
        leaf.rotation.set(r() * 0.8 - 0.4, a, r() * 0.9 - 0.2);
        leaf.castShadow = true;
        g.add(leaf);
      }
    } else if (kind === 1) {
      // paşa kılıcı: dik uzun yapraklar
      for (let i = 0; i < 11; i++) {
        const hgt = 55 + r() * 45;
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(cm(5), cm(hgt), cm(0.8)), i % 2 ? M.leaf2 : M.leaf3);
        const a = r() * Math.PI * 2, rad = r() * 8;
        leaf.position.set(cm(Math.cos(a) * rad), cm(33 + hgt / 2), cm(Math.sin(a) * rad));
        leaf.rotation.set((r() - 0.5) * 0.3, a, (r() - 0.5) * 0.3);
        leaf.castShadow = true;
        g.add(leaf);
      }
    } else {
      // monstera: büyük yuvarlak yapraklar, eğik saplar
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2 + r() * 0.4;
        const len = 45 + r() * 40;
        const stem = cyl(g, 0.6, 0.8, len, 0, 33, 0, M.leaf2, 6);
        stem.rotation.z = Math.cos(a) * 0.5;
        stem.rotation.x = -Math.sin(a) * 0.5;
        const leaf = new THREE.Mesh(new THREE.CircleGeometry(cm(16), 14), M.leaf);
        leaf.position.set(cm(Math.cos(a) * len * 0.48), cm(33 + len * 0.88), cm(Math.sin(a) * len * 0.48));
        leaf.rotation.set(-Math.PI / 2 + 0.6, a, 0);
        leaf.castShadow = true;
        g.add(leaf);
      }
    }
  },
  floor_lamp(g, f, M) {
    cyl(g, 15, 15, 2, 0, 0, 0, M.blackMetal, 24);
    cyl(g, 1.2, 1.2, 140, 0, 2, 0, M.blackMetal, 8);
    const s = cyl(g, 16, 22, 28, 0, 138, 0, M.shade, 28);
    s.castShadow = false;
    sphere(g, 4, 0, 150, 0, M.bulb);
  },
  rug(g, f, M) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(cm(f.w), cm(1), cm(f.d)), M.rugMap(f.w > 210 ? 2 : 1));
    m.position.y = cm(0.5);
    m.receiveShadow = true;
    g.add(m);
  },
};

function mulberry(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildFurniture(f, M) {
  const g = new THREE.Group();
  const kind = CATALOG[f.type]?.kind;
  const fn = builders[kind];
  if (fn) fn(g, f, M);
  else box(g, f.w, f.h, f.d, 0, 0, 0, M.body, 2);
  g.position.set(cm(f.x), 0, cm(f.y));
  g.rotation.y = (-f.rot * Math.PI) / 180;
  g.userData.furnitureId = f.id;
  return g;
}

export { mulberry };
