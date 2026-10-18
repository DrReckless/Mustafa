// Kodla üretilen dokular (internet ve görsel dosyası gerektirmez)
import * as THREE from 'three';

export const WOOD = {
  mese: { label: 'Meşe', base: '#c49a6c' },
  acik: { label: 'Açık Meşe', base: '#dcc4a0' },
  ceviz: { label: 'Ceviz', base: '#7a5235' },
  gri: { label: 'Gri Laminat', base: '#a59d93' },
};
export const TILE = {
  beyaz: { label: 'Beyaz Seramik', base: '#ecebe7', grout: '#cfcdc8' },
  gri: { label: 'Gri Seramik', base: '#b4b3b0', grout: '#9a9894' },
  bej: { label: 'Bej Seramik', base: '#d9cbb3', grout: '#bfb19a' },
  mermer: { label: 'Mermer', base: '#f1efeb', grout: '#dedad3', marble: true },
};
export const FURN_TONE = {
  dogal: { label: 'Doğal Ahşap', wood: '#c8a275', body: '#efe9df' },
  ceviz: { label: 'Ceviz', wood: '#6e4a30', body: '#e9e2d6' },
  beyaz: { label: 'Beyaz', wood: '#d8cbb6', body: '#f4f3f0' },
  antrasit: { label: 'Antrasit', wood: '#a0784f', body: '#43464a' },
};
export const FABRIC = {
  gri: { label: 'Gri', color: '#8e9196' },
  bej: { label: 'Bej', color: '#cdbda2' },
  lacivert: { label: 'Lacivert', color: '#34445f' },
  yesil: { label: 'Yeşil', color: '#61775a' },
  terracotta: { label: 'Kiremit', color: '#b2683f' },
};
export const WALL_COLORS = ['#f2efe9', '#ffffff', '#e9e4da', '#dfe3e4', '#e6dccd', '#d9dfd3', '#cfd8de', '#efe1d6'];

function rnd(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function shade(hex, f) {
  const c = new THREE.Color(hex);
  const hsl = {};
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l * f)));
  return '#' + c.getHexString();
}

const cache = new Map();

function canvasTex(key, size, draw, repeatCm) {
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.userData.repeatCm = repeatCm;
  cache.set(key, t);
  return t;
}

// 1 doku = 160 cm × 160 cm parke (8 sıra × 20 cm)
export function woodTexture(kind) {
  const base = (WOOD[kind] || WOOD.mese).base;
  return canvasTex('wood:' + kind, 1024, (g, S) => {
    const r = rnd(7);
    const rows = 8, h = S / rows;
    for (let i = 0; i < rows; i++) {
      let x = -r() * S * 0.6;
      while (x < S) {
        const len = S * (0.45 + r() * 0.35);
        g.fillStyle = shade(base, 0.86 + r() * 0.24);
        g.fillRect(x, i * h, len, h);
        // damarlar
        g.globalAlpha = 0.09;
        for (let k = 0; k < 9; k++) {
          g.strokeStyle = shade(base, 0.55 + r() * 0.3);
          g.lineWidth = 1 + r() * 2;
          g.beginPath();
          const yy = i * h + r() * h;
          g.moveTo(x, yy);
          g.bezierCurveTo(x + len * 0.3, yy + (r() - 0.5) * 8, x + len * 0.6, yy + (r() - 0.5) * 8, x + len, yy + (r() - 0.5) * 6);
          g.stroke();
        }
        g.globalAlpha = 1;
        g.fillStyle = 'rgba(0,0,0,0.18)';
        g.fillRect(x, i * h, 2, h);
        x += len;
      }
      g.fillStyle = 'rgba(0,0,0,0.22)';
      g.fillRect(0, i * h, S, 1.5);
    }
  }, 160);
}

// 1 doku = 120 × 120 cm (60'lık 4 karo)
export function tileTexture(kind) {
  const t = TILE[kind] || TILE.beyaz;
  return canvasTex('tile:' + kind, 1024, (g, S) => {
    const r = rnd(11);
    const n = 2, s = S / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      g.fillStyle = shade(t.base, 0.97 + r() * 0.05);
      g.fillRect(i * s, j * s, s, s);
      if (t.marble) {
        g.globalAlpha = 0.18;
        for (let k = 0; k < 6; k++) {
          g.strokeStyle = r() > 0.5 ? '#9b9890' : '#bdb7ab';
          g.lineWidth = 0.6 + r() * 2.2;
          g.beginPath();
          let px = i * s + r() * s, py = j * s;
          g.moveTo(px, py);
          for (let q = 0; q < 8; q++) { px += (r() - 0.4) * s * 0.25; py += s / 8; g.lineTo(px, py); }
          g.stroke();
        }
        g.globalAlpha = 1;
      } else {
        // hafif benek
        g.globalAlpha = 0.05;
        for (let k = 0; k < 400; k++) { g.fillStyle = r() > 0.5 ? '#000' : '#fff'; g.fillRect(i * s + r() * s, j * s + r() * s, 2, 2); }
        g.globalAlpha = 1;
      }
    }
    g.strokeStyle = t.grout;
    g.lineWidth = 4;
    for (let i = 0; i <= n; i++) {
      g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, S); g.stroke();
      g.beginPath(); g.moveTo(0, i * s); g.lineTo(S, i * s); g.stroke();
    }
  }, 120);
}

// Duvar seramiği: 30 × 60 cm karolar, 1 doku = 120 × 120 cm
export function wallTileTexture(kind) {
  const t = TILE[kind] || TILE.beyaz;
  return canvasTex('wtile:' + kind, 512, (g, S) => {
    const r = rnd(19);
    const cw = S / 2, ch = S / 4;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 4; j++) {
      g.fillStyle = shade(t.base, 0.9 + r() * 0.04);
      g.fillRect(i * cw, j * ch, cw, ch);
    }
    g.strokeStyle = t.grout;
    g.lineWidth = 3;
    for (let i = 0; i <= 2; i++) { g.beginPath(); g.moveTo(i * cw, 0); g.lineTo(i * cw, S); g.stroke(); }
    for (let j = 0; j <= 4; j++) { g.beginPath(); g.moveTo(0, j * ch); g.lineTo(S, j * ch); g.stroke(); }
  }, 120);
}

export function deckTexture() {
  return canvasTex('deck', 512, (g, S) => {
    const r = rnd(3);
    const n = 6, h = S / n;
    for (let i = 0; i < n; i++) {
      g.fillStyle = shade('#8f6e52', 0.9 + r() * 0.2);
      g.fillRect(0, i * h, S, h - 6);
      g.fillStyle = '#3d3229';
      g.fillRect(0, i * h + h - 6, S, 6);
    }
  }, 90);
}

export function fabricTexture() {
  return canvasTex('fabric', 256, (g, S) => {
    const r = rnd(5);
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, S, S);
    g.globalAlpha = 0.07;
    for (let y = 0; y < S; y += 2) { g.fillStyle = '#000'; g.fillRect(0, y, S, 1); }
    for (let x = 0; x < S; x += 2) { g.fillStyle = '#000'; g.fillRect(x, 0, 1, S); }
    g.globalAlpha = 0.06;
    for (let k = 0; k < 2000; k++) { g.fillStyle = r() > 0.5 ? '#000' : '#fff'; g.fillRect(r() * S, r() * S, 1.5, 1.5); }
    g.globalAlpha = 1;
  }, 25);
}

export function rugTexture(seed = 1) {
  return canvasTex('rug' + seed, 512, (g, S) => {
    const r = rnd(seed * 13);
    g.fillStyle = '#d8cdbb';
    g.fillRect(0, 0, S, S);
    g.strokeStyle = '#a99780';
    g.lineWidth = 10;
    g.strokeRect(22, 22, S - 44, S - 44);
    g.lineWidth = 3;
    g.strokeRect(44, 44, S - 88, S - 88);
    g.globalAlpha = 0.25;
    for (let i = 0; i < 18; i++) {
      g.strokeStyle = r() > 0.5 ? '#8a7a64' : '#f3ece0';
      g.lineWidth = 2 + r() * 6;
      g.beginPath();
      g.moveTo(60 + r() * (S - 120), 60);
      g.lineTo(60 + r() * (S - 120), S - 60);
      g.stroke();
    }
    g.globalAlpha = 0.08;
    for (let k = 0; k < 6000; k++) { g.fillStyle = r() > 0.5 ? '#000' : '#fff'; g.fillRect(r() * S, r() * S, 2, 2); }
    g.globalAlpha = 1;
  }, 0);
}

export function clearTextureCache() {
  for (const t of cache.values()) t.dispose();
  cache.clear();
}
