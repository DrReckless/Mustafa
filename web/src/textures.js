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

// Vurgu renkleri: kırlent, örtü, halı deseni, tablo, vazo, berjer
export const ACCENTS = {
  dogal: { label: 'Doğal', colors: ['#b5835a', '#7d8f69', '#e8dcc4', '#5d6b7a'] },
  modern: { label: 'Modern Gri', colors: ['#2f3e4e', '#c9a24b', '#9aa5ad', '#262626'] },
  sicak: { label: 'Sıcak Toprak', colors: ['#c46a3c', '#d9a441', '#7a4b33', '#efe1c6'] },
  canli: { label: 'Canlı', colors: ['#e0a526', '#3f8f8b', '#d0583f', '#7fb069'] },
};

// Hazır temalar: tek dokunuşla uyumlu malzeme seti
export const THEMES = {
  dogal: { label: 'Doğal', wood: 'mese', tile: 'beyaz', wall: '#f2efe9', furniture: 'dogal', fabric: 'bej', accent: 'dogal' },
  modern: { label: 'Modern Gri', wood: 'gri', tile: 'mermer', wall: '#ffffff', furniture: 'beyaz', fabric: 'gri', accent: 'modern' },
  sicak: { label: 'Sıcak Toprak', wood: 'ceviz', tile: 'bej', wall: '#e6dccd', furniture: 'ceviz', fabric: 'terracotta', accent: 'sicak' },
  canli: { label: 'Canlı', wood: 'acik', tile: 'beyaz', wall: '#f2efe9', furniture: 'dogal', fabric: 'lacivert', accent: 'canli' },
};

export function accentColors(style) {
  return (ACCENTS[style?.accent] || ACCENTS.dogal).colors;
}

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

// Mobilya yüzeyi için ince ahşap damarı (1 doku = 80 cm)
export function grainTexture(hex) {
  return canvasTex('grain:' + hex, 512, (g, S) => {
    const r = rnd(23);
    g.fillStyle = hex;
    g.fillRect(0, 0, S, S);
    for (let k = 0; k < 70; k++) {
      g.strokeStyle = shade(hex, 0.78 + r() * 0.3);
      g.globalAlpha = 0.12 + r() * 0.12;
      g.lineWidth = 0.6 + r() * 2.2;
      const y = r() * S, amp = 2 + r() * 6, ph = r() * 6;
      g.beginPath();
      for (let x = 0; x <= S; x += 16) g.lineTo(x, y + Math.sin(x / 70 + ph) * amp);
      g.stroke();
    }
    g.globalAlpha = 1;
  }, 80);
}

// Tezgâh taşı: koyu granit ya da beyaz mermer (1 doku = 100 cm)
export function stoneTexture(kind) {
  return canvasTex('stone:' + kind, 512, (g, S) => {
    const r = rnd(29);
    const dark = kind === 'granit';
    g.fillStyle = dark ? '#3b3c3e' : '#f0eeea';
    g.fillRect(0, 0, S, S);
    if (dark) {
      for (let k = 0; k < 9000; k++) {
        const v = r();
        g.fillStyle = v > 0.7 ? '#5a5b5e' : v > 0.4 ? '#2a2b2d' : v > 0.38 ? '#8d8a84' : '#47484b';
        g.fillRect(r() * S, r() * S, 1 + r() * 2, 1 + r() * 2);
      }
    } else {
      g.globalAlpha = 0.22;
      for (let k = 0; k < 7; k++) {
        g.strokeStyle = r() > 0.5 ? '#a9a59d' : '#c9c4ba';
        g.lineWidth = 0.6 + r() * 2;
        g.beginPath();
        let x = r() * S, y = 0;
        g.moveTo(x, y);
        while (y < S) { x += (r() - 0.45) * 60; y += 30 + r() * 30; g.lineTo(x, y); }
        g.stroke();
      }
      g.globalAlpha = 1;
    }
  }, 100);
}

// Soyut tablo (vurgu renkleriyle)
export function artTexture(seed, colors) {
  return canvasTex('art:' + seed + colors.join(), 512, (g, S) => {
    const r = rnd(seed * 31 + 7);
    g.fillStyle = '#f3efe7';
    g.fillRect(0, 0, S, S);
    const style = seed % 3;
    if (style === 0) {
      // büyük yarım daireler
      for (let i = 0; i < 4; i++) {
        g.fillStyle = colors[i % colors.length];
        g.globalAlpha = 0.85;
        g.beginPath();
        g.arc(S * (0.2 + r() * 0.6), S * (0.25 + r() * 0.55), S * (0.14 + r() * 0.2), Math.PI * r(), Math.PI * (1 + r()));
        g.fill();
      }
    } else if (style === 1) {
      // kesişen bloklar
      for (let i = 0; i < 5; i++) {
        g.fillStyle = colors[i % colors.length];
        g.globalAlpha = 0.75;
        g.fillRect(S * r() * 0.6, S * r() * 0.7, S * (0.2 + r() * 0.35), S * (0.12 + r() * 0.3));
      }
    } else {
      // ufuk çizgisi manzara
      const grd = g.createLinearGradient(0, 0, 0, S);
      grd.addColorStop(0, '#efe6d6');
      grd.addColorStop(1, colors[3] || '#c9b9a0');
      g.fillStyle = grd;
      g.fillRect(0, 0, S, S);
      g.fillStyle = colors[0];
      g.beginPath(); g.arc(S * 0.68, S * 0.35, S * 0.1, 0, Math.PI * 2); g.fill();
      for (let i = 0; i < 3; i++) {
        g.fillStyle = colors[(i + 1) % colors.length];
        g.globalAlpha = 0.8;
        g.beginPath();
        g.moveTo(0, S);
        const base = S * (0.55 + i * 0.12);
        for (let x = 0; x <= S; x += 32) g.lineTo(x, base - Math.sin(x / (80 + i * 40) + r() * 2) * S * 0.06);
        g.lineTo(S, S);
        g.fill();
      }
    }
    g.globalAlpha = 0.05;
    for (let k = 0; k < 3000; k++) { g.fillStyle = r() > 0.5 ? '#000' : '#fff'; g.fillRect(r() * S, r() * S, 2, 2); }
    g.globalAlpha = 1;
  }, 0);
}

// Açık TV ekranı: sakin bir manzara
export function tvTexture() {
  return canvasTex('tv', 512, (g, S) => {
    const grd = g.createLinearGradient(0, 0, 0, S);
    grd.addColorStop(0, '#6f9cc4');
    grd.addColorStop(0.55, '#d8c7a6');
    grd.addColorStop(1, '#3f5a46');
    g.fillStyle = grd;
    g.fillRect(0, 0, S, S);
    g.fillStyle = '#2f4a3c';
    g.beginPath(); g.moveTo(0, S * 0.7);
    for (let x = 0; x <= S; x += 16) g.lineTo(x, S * 0.62 - Math.sin(x / 60) * 20 - Math.sin(x / 23) * 6);
    g.lineTo(S, S); g.lineTo(0, S); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.08)';
    g.beginPath(); g.moveTo(0, 0); g.lineTo(S * 0.5, 0); g.lineTo(0, S * 0.5); g.fill();
  }, 0);
}

// Desenli halı (vurgu renkleriyle)
export function patternRugTexture(seed, colors) {
  return canvasTex('prug:' + seed + colors.join(), 512, (g, S) => {
    const r = rnd(seed * 17 + 3);
    const base = seed % 2 ? '#e3d9c8' : '#d6d0c6';
    g.fillStyle = base;
    g.fillRect(0, 0, S, S);
    g.strokeStyle = colors[0];
    g.globalAlpha = 0.8;
    g.lineWidth = 12;
    g.strokeRect(20, 20, S - 40, S - 40);
    g.lineWidth = 3;
    g.strokeRect(42, 42, S - 84, S - 84);
    // orta madalyon / eşkenar dörtgenler
    const n = 4;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const cx = 60 + ((S - 120) / n) * (i + 0.5), cy = 60 + ((S - 120) / n) * (j + 0.5), rr = (S - 120) / n * 0.32;
      g.fillStyle = colors[(i + j) % 2 ? 1 : 3] || colors[1];
      g.globalAlpha = 0.45;
      g.beginPath(); g.moveTo(cx, cy - rr); g.lineTo(cx + rr, cy); g.lineTo(cx, cy + rr); g.lineTo(cx - rr, cy); g.closePath(); g.fill();
    }
    g.globalAlpha = 0.1;
    for (let k = 0; k < 7000; k++) { g.fillStyle = r() > 0.5 ? '#000' : '#fff'; g.fillRect(r() * S, r() * S, 2, 2); }
    g.globalAlpha = 1;
  }, 0);
}

export function clearTextureCache() {
  for (const t of cache.values()) t.dispose();
  cache.clear();
}
