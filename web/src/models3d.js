// Mobilyaların 3B modelleri (basit geometrilerden, gerçek ölçülerde).
// Yerel eksen: x = genişlik, z = derinlik (sırt -d/2, ön +d/2), y = yukarı. Birim: metre.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { CATALOG } from './catalog.js';
import { FURN_TONE, FABRIC, fabricTexture, rugTexture } from './textures.js';

const cm = (v) => v / 100;

export function makeMaterials(style) {
  const tone = FURN_TONE[style.furniture] || FURN_TONE.dogal;
  const fab = FABRIC[style.fabric] || FABRIC.gri;
  const ft = fabricTexture();
  const fabricMap = ft.clone();
  fabricMap.needsUpdate = true;
  fabricMap.repeat.set(4, 4);
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const fabricCol = new THREE.Color(fab.color);
  const light = fabricCol.clone().lerp(new THREE.Color('#ffffff'), 0.35);
  const dark = style.furniture === 'antrasit';
  return {
    wood: std({ color: tone.wood, roughness: 0.55 }),
    body: std({ color: tone.body, roughness: 0.45 }),
    fabric: std({ color: fabricCol, roughness: 0.95, map: fabricMap }),
    fabricLight: std({ color: light, roughness: 0.95, map: fabricMap }),
    linen: std({ color: '#f3f0ea', roughness: 0.9, map: fabricMap }),
    blanket: std({ color: light, roughness: 0.95, map: fabricMap }),
    ceramic: std({ color: '#f7f7f5', roughness: 0.15, metalness: 0 }),
    metal: std({ color: '#b9b9b9', roughness: 0.3, metalness: 0.85 }),
    blackMetal: std({ color: '#2b2b2b', roughness: 0.4, metalness: 0.6 }),
    screen: std({ color: '#111214', roughness: 0.15, metalness: 0.2 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#dfeef2', roughness: 0.05, transmission: 0, transparent: true, opacity: 0.28, metalness: 0 }),
    counter: std({ color: dark ? '#e4e0d8' : '#3c3d3f', roughness: 0.35 }),
    kitchen: std({ color: tone.body, roughness: 0.4 }),
    steel: std({ color: '#cfd1d2', roughness: 0.25, metalness: 0.8 }),
    leaf: std({ color: '#4d7a3c', roughness: 0.8, side: THREE.DoubleSide }),
    pot: std({ color: '#d8cfc2', roughness: 0.8 }),
    shade: std({ color: '#f6efe0', roughness: 0.8, emissive: '#ffdca8', emissiveIntensity: 0.35, side: THREE.DoubleSide }),
    water: std({ color: '#cfe3ea', roughness: 0.1 }),
    rugMap: (seed) => std({ color: '#ffffff', roughness: 1, map: rugTexture(seed) }),
    book: [std({ color: '#8b3a2f', roughness: 0.7 }), std({ color: '#2f4b6b', roughness: 0.7 }), std({ color: '#d8c49c', roughness: 0.7 }), std({ color: '#4e6b47', roughness: 0.7 })],
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

function legs(g, w, d, h, inset, r, mat) {
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, r, r * 0.8, h, sx * (w / 2 - inset), 0, sz * (d / 2 - inset), mat, 10);
}

const builders = {
  bed(g, f, M) {
    const { w, d } = f;
    const double = w >= 130;
    box(g, w, 28, d - 6, 0, 8, 3, M.fabric, 3); // baza
    legs(g, w - 10, d - 16, 8, 6, 2.5, M.wood);
    box(g, w - 6, 22, d - 14, 0, 36, 5, M.linen, 6); // yatak
    box(g, w, 100, 8, 0, 8, -d / 2 + 4, M.fabric, 4); // başlık
    // yastıklar
    const n = double ? 2 : 1;
    const pw = (w - 24 - (n - 1) * 6) / n;
    for (let i = 0; i < n; i++) box(g, pw, 14, 38, -w / 2 + 12 + pw / 2 + i * (pw + 6), 56, -d / 2 + 34, M.linen, 7);
    // yorgan
    box(g, w - 2, 6, d * 0.62, 0, 56, d / 2 - d * 0.31 - 2, M.blanket, 3);
    box(g, w - 2, 7, 22, 0, 56, d / 2 - d * 0.62 - 6, M.fabricLight, 3);
  },
  nightstand(g, f, M) {
    box(g, f.w, f.h - 4, f.d, 0, 4, 0, M.body, 1.5);
    legs(g, f.w - 4, f.d - 4, 4, 3, 1.2, M.wood);
    box(g, f.w - 6, 0.8, 0.8, 0, f.h - 22, f.d / 2, M.wood);
    // lamba
    cyl(g, 6, 7, 20, 0, f.h, -4, M.ceramic, 20);
    const shade = cyl(g, 10, 14, 18, 0, f.h + 20, -4, M.shade, 24);
    shade.castShadow = false;
  },
  wardrobe(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h - 8, d - 2, 0, 8, -1, M.body, 1);
    box(g, w - 4, 8, d - 6, 0, 0, -3, M.wood);
    const n = Math.max(2, Math.round(w / 50));
    const dw = w / n;
    for (let i = 0; i < n; i++) {
      box(g, dw - 1.2, h - 12, 2, -w / 2 + dw * (i + 0.5), 10, d / 2 - 1, M.body, 0.8);
      const hx = -w / 2 + dw * (i + 0.5) + (i % 2 ? -1 : 1) * (dw / 2 - 5);
      box(g, 1.5, 30, 2, hx, h / 2 - 10, d / 2 + 1, M.metal);
    }
  },
  dresser(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h - 10, d, 0, 10, 0, M.body, 1.5);
    legs(g, w - 6, d - 6, 10, 3, 1.5, M.wood);
    const rows = 3;
    for (let i = 1; i < rows; i++) box(g, w - 4, 0.6, 0.6, 0, 10 + ((h - 10) / rows) * i, d / 2, M.wood);
    box(g, w, 2, d, 0, h - 2, 0, M.wood);
  },
  sideboard(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h - 14, d, 0, 14, 0, M.body, 1.5);
    legs(g, w - 8, d - 8, 14, 4, 1.4, M.wood);
    box(g, w, 2.5, d, 0, h - 2.5, 0, M.wood);
    const n = Math.max(2, Math.round(w / 45));
    for (let i = 1; i < n; i++) box(g, 0.6, h - 20, 0.6, -w / 2 + (w / n) * i, 16, d / 2, M.wood);
    // vazo
    cyl(g, 5, 7, 26, w * 0.28, h, 0, M.ceramic, 16);
  },
  shoe_cabinet(g, f, M) {
    builders.sideboard(g, f, M);
  },
  tv_unit(g, f, M) {
    const { w, d } = f;
    box(g, w, 36, d, 0, 12, 0, M.body, 1.5);
    legs(g, w - 8, d - 8, 12, 4, 1.4, M.blackMetal);
    box(g, w, 2.5, d, 0, 48, 0, M.wood);
    // TV
    const tw = Math.min(140, w * 0.75);
    box(g, tw, tw * 0.57, 3, 0, 62, -d / 2 + 14, M.screen, 0.8);
    box(g, 30, 1.5, 18, 0, 50.5, -d / 2 + 16, M.blackMetal);
    box(g, 4, 10, 4, 0, 52, -d / 2 + 15, M.blackMetal);
  },
  sofa(g, f, M) {
    const { w, d } = f;
    const seats = CATALOG[f.type]?.seats || 3;
    box(g, w, 30, d - 4, 0, 10, 2, M.fabric, 5);
    legs(g, w - 12, d - 14, 10, 6, 2, M.wood);
    box(g, w - 4, 45, 22, 0, 40, -d / 2 + 11, M.fabric, 8); // sırt
    box(g, 18, 26, d - 4, -w / 2 + 9, 40, 2, M.fabric, 8);
    box(g, 18, 26, d - 4, w / 2 - 9, 40, 2, M.fabric, 8);
    const sw = (w - 36) / seats;
    for (let i = 0; i < seats; i++) {
      box(g, sw - 2, 14, d - 28, -w / 2 + 18 + sw * (i + 0.5), 40, 10, M.fabricLight, 6);
      box(g, sw - 6, 38, 14, -w / 2 + 18 + sw * (i + 0.5), 50, -d / 2 + 28, M.fabricLight, 7);
    }
    box(g, 40, 38, 12, -w / 2 + 40, 52, -d / 2 + 38, M.blanket, 6).rotation.z = 0.2;
  },
  sofa_l(g, f, M) {
    const { w, d } = f;
    const s = f.mirror ? -1 : 1;
    const sd = 92;
    const inner = new THREE.Group();
    g.add(inner);
    inner.scale.x = s;
    const G = inner;
    box(G, w, 30, sd - 4, 0, 10, -d / 2 + sd / 2 + 2, M.fabric, 5);
    box(G, 95, 30, d - sd, w / 2 - 47.5, 10, -d / 2 + sd + (d - sd) / 2 - 2, M.fabric, 5);
    box(G, w - 4, 45, 22, 0, 40, -d / 2 + 11, M.fabric, 8);
    box(G, 18, 26, sd - 4, -w / 2 + 9, 40, -d / 2 + sd / 2 + 2, M.fabric, 8);
    box(G, 18, 26, d - 4, w / 2 - 9, 40, 2 - 2, M.fabric, 8);
    const sw = (w - 95 - 18) / 2;
    for (let i = 0; i < 2; i++) {
      box(G, sw - 2, 14, sd - 28, -w / 2 + 18 + sw * (i + 0.5), 40, -d / 2 + sd / 2 + 10, M.fabricLight, 6);
      box(G, sw - 6, 38, 14, -w / 2 + 18 + sw * (i + 0.5), 50, -d / 2 + 28, M.fabricLight, 7);
    }
    box(G, 76, 14, d - 28, w / 2 - 18 - 38, 40, 10, M.fabricLight, 6);
    box(G, 70, 38, 14, w / 2 - 18 - 38, 50, -d / 2 + 28, M.fabricLight, 7);
    for (const lx of [-w / 2 + 8, w / 2 - 8]) for (const lz of [-d / 2 + 8, d / 2 - 8]) cyl(G, 2, 1.6, 10, lx, 0, lz, M.wood, 10);
  },
  armchair(g, f, M) {
    const { w, d } = f;
    box(g, w, 28, d - 4, 0, 14, 2, M.fabric, 6);
    legs(g, w - 12, d - 14, 14, 6, 1.8, M.wood);
    box(g, w - 4, 44, 16, 0, 42, -d / 2 + 8, M.fabric, 7);
    box(g, 13, 22, d - 6, -w / 2 + 6.5, 42, 3, M.fabric, 6);
    box(g, 13, 22, d - 6, w / 2 - 6.5, 42, 3, M.fabric, 6);
    box(g, w - 28, 12, d - 22, 0, 42, 6, M.fabricLight, 5);
  },
  coffee_table(g, f, M) {
    const { w, d, h } = f;
    box(g, w, 4, d, 0, h - 4, 0, M.wood, 2);
    box(g, w - 10, 2, d - 10, 0, 10, 0, M.body, 1);
    legs(g, w - 8, d - 8, h - 4, 4, 1.6, M.blackMetal);
    // dekor
    box(g, 26, 3, 20, -w * 0.2, h, 0, M.book[0], 0.5);
    box(g, 22, 3, 16, -w * 0.2, h + 3, 0, M.book[2], 0.5);
    cyl(g, 9, 6, 6, w * 0.22, h, 0, M.ceramic, 18);
  },
  side_table(g, f, M) {
    cyl(g, f.w / 2, f.w / 2, 3, 0, f.h - 3, 0, M.wood, 28);
    cyl(g, 1.8, 1.8, f.h - 3, 0, 0, 0, M.blackMetal, 10);
    cyl(g, 14, 14, 1.5, 0, 0, 0, M.blackMetal, 24);
  },
  round_table(g, f, M) {
    builders.side_table(g, f, M);
  },
  dining(g, f, M) {
    const { w, d, h } = f;
    box(g, w, 4, d, 0, h - 4, 0, M.wood, 1.5);
    legs(g, w - 12, d - 12, h - 4, 6, 2.6, M.wood);
    cyl(g, 7, 5, 12, 0, h, 0, M.ceramic, 18);
    const n = w >= 150 ? 3 : 2;
    for (let i = 0; i < n; i++) box(g, 30, 0.8, 22, -w / 2 + (w / n) * (i + 0.5), h, 0, M.linen);
  },
  chair(g, f, M) {
    const { w, d } = f;
    box(g, w - 4, 6, d - 10, 0, 42, 3, M.fabricLight, 2.5);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, 1.6, 1.3, 42, sx * (w / 2 - 5), 0, sz * (d / 2 - 8) + 3, M.wood, 8);
    box(g, w - 6, 40, 3, 0, 48, -d / 2 + 4, M.wood, 1.2);
  },
  office_chair(g, f, M) {
    cyl(g, 3, 3, 40, 0, 6, 0, M.blackMetal, 10);
    cyl(g, 24, 24, 3, 0, 4, 0, M.blackMetal, 5);
    box(g, 48, 8, 46, 0, 46, 2, M.fabric, 3);
    box(g, 44, 46, 6, 0, 56, -20, M.fabric, 3);
  },
  desk(g, f, M) {
    const { w, d, h } = f;
    box(g, w, 3, d, 0, h - 3, 0, M.wood, 1);
    box(g, 2.5, h - 3, d - 4, -w / 2 + 2, 0, 0, M.body);
    box(g, 2.5, h - 3, d - 4, w / 2 - 2, 0, 0, M.body);
    box(g, 40, 12, d - 6, w / 2 - 24, h - 15, 0, M.body);
    // ekran + klavye
    box(g, 55, 32, 2, 0, h + 12, -d / 2 + 12, M.screen, 0.6);
    box(g, 4, 12, 4, 0, h, -d / 2 + 13, M.blackMetal);
    box(g, 40, 1.5, 13, 0, h, 6, M.body, 0.5);
    cyl(g, 7, 9, 3, -w / 2 + 16, h, -d / 2 + 14, M.blackMetal, 16);
    cyl(g, 1, 1, 34, -w / 2 + 16, h + 3, -d / 2 + 14, M.blackMetal, 8);
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
      while (x < w / 2 - 14 && r() > 0.08) {
        const bw = 2.5 + r() * 3, bh = 18 + r() * 12;
        if (r() > 0.85) { x += 10; continue; }
        box(g, bw, bh, d - 10, x + bw / 2, (h - 2) * (i / shelves) + 2, 2, M.book[Math.floor(r() * 4)]);
        x += bw + 0.4;
      }
    }
  },
  k_base(g, f, M) {
    const { w, d } = f;
    box(g, w - 0.4, 8, d - 6, 0, 0, -3, M.blackMetal);
    box(g, w - 0.4, 78, d - 2, 0, 8, -1, M.kitchen, 0.6);
    box(g, w, 4, d + 2, 0, 86, 1, M.counter);
    box(g, Math.min(20, w * 0.4), 1.2, 1.5, 0, 74, d / 2, M.metal);
  },
  k_dishwasher(g, f, M) {
    builders.k_base(g, f, M);
    box(g, f.w - 6, 2, 1, 0, 78, f.d / 2 + 0.2, M.steel);
  },
  k_sink(g, f, M) {
    const { w, d } = f;
    builders.k_base(g, f, M);
    box(g, w - 22, 1, d - 26, 0, 90.1, 2, M.steel);
    box(g, w - 28, 0.6, d - 32, 0, 90.4, 2, M.screen).material = M.steel;
    // batarya
    cyl(g, 1.8, 2, 22, 0, 90, -d / 2 + 8, M.metal, 12);
    const spout = box(g, 2.5, 2.5, 18, 0, 110, -d / 2 + 16, M.metal, 1);
    void spout;
  },
  k_stove(g, f, M) {
    const { w, d } = f;
    box(g, w - 0.4, 8, d - 6, 0, 0, -3, M.blackMetal);
    box(g, w - 0.4, 78, d - 2, 0, 8, -1, M.steel, 0.6);
    box(g, w - 8, 40, 1, 0, 20, d / 2, M.screen);
    box(g, w, 4, d + 2, 0, 86, 1, M.counter);
    box(g, w - 4, 0.8, d - 6, 0, 90, 0, M.screen);
    for (const [px, pz, r] of [[-14, -12, 8], [14, -12, 6], [-14, 13, 6], [14, 13, 8]]) cyl(g, r, r, 1.2, px, 90.6, pz, M.blackMetal, 20);
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
    box(g, Math.min(16, w * 0.3), 1.2, 1.5, 0, e + 4, d / 2, M.metal);
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
  },
  basin(g, f, M) {
    const { w, d } = f;
    box(g, w, 50, d - 2, 0, 18, -1, M.body, 1.2);
    box(g, w, 6, d, 0, 79, 0, M.ceramic, 2);
    box(g, w - 18, 0.5, d - 18, 0, 85, 2, M.water);
    cyl(g, 1.5, 1.5, 16, 0, 85, -d / 2 + 5, M.metal, 10);
    // ayna
    box(g, w - 4, 70, 2, 0, 105, -d / 2 + 1, M.glass);
  },
  shower(g, f, M) {
    const { w, d } = f;
    box(g, w, 6, d, 0, 0, 0, M.ceramic, 2);
    const gl = M.glass;
    box(g, 1, 194, d, w / 2 - 0.5, 6, 0, gl);
    box(g, w, 194, 1, 0, 6, d / 2 - 0.5, gl);
    box(g, 1.5, 194, 1.5, w / 2 - 0.75, 6, d / 2 - 0.75, M.metal);
    cyl(g, 1, 1, 100, -w / 2 + 6, 100, -d / 2 + 6, M.metal, 10);
    cyl(g, 10, 10, 1.2, -w / 2 + 14, 195, -d / 2 + 14, M.metal, 20);
  },
  bathtub(g, f, M) {
    const { w, d, h } = f;
    box(g, w, h, d, 0, 0, 0, M.ceramic, 3);
    box(g, w - 14, 1, d - 14, 0, h - 14, 0, M.water, 1);
    cyl(g, 1.5, 1.5, 12, w / 2 - 12, h, -d / 2 + 5, M.metal, 10);
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
    cyl(g, 16, 12, 34, 0, 0, 0, M.pot, 20);
    cyl(g, 1.5, 2, 50, 0, 34, 0, M.wood, 8);
    const r = mulberry(Math.round(f.x * 3 + f.y * 5));
    for (let i = 0; i < 16; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(cm(13), 10, 8), M.leaf);
      leaf.scale.set(1, 0.25, 0.45);
      const a = r() * Math.PI * 2, rad = 6 + r() * 14;
      leaf.position.set(cm(Math.cos(a) * rad), cm(60 + r() * 65), cm(Math.sin(a) * rad));
      leaf.rotation.set(r() * 0.8 - 0.4, a, r() * 0.9 - 0.2);
      leaf.castShadow = true;
      g.add(leaf);
    }
  },
  floor_lamp(g, f, M) {
    cyl(g, 15, 15, 2, 0, 0, 0, M.blackMetal, 24);
    cyl(g, 1.2, 1.2, 140, 0, 2, 0, M.blackMetal, 8);
    const s = cyl(g, 16, 22, 28, 0, 138, 0, M.shade, 28);
    s.castShadow = false;
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
