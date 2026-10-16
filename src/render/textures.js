import * as THREE from 'three';
import { makeNoise, mulberry32 } from '../util.js';

// Prosedürel dokular (harici dosya gerektirmez)
function canvas(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')];
}
function toTex(c, { srgb = true, repeat = 1 } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}
// yükseklik alanından normal haritası
function normalFromHeight(h, size, strength = 2) {
  const [c, g] = canvas(size);
  const img = g.createImageData(size, size);
  const at = (x, y) => h[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
    const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
    const nz = 1 / Math.sqrt(dx * dx + dy * dy + 1);
    const i = (y * size + x) * 4;
    img.data[i] = (-dx * nz * 0.5 + 0.5) * 255;
    img.data[i + 1] = (dy * nz * 0.5 + 0.5) * 255;
    img.data[i + 2] = nz * 255;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return toTex(c, { srgb: false });
}
// döşenebilir gürültü
function tileNoise(size, seed, scale, oct = 5) {
  const n = makeNoise(seed);
  const h = new Float32Array(size * size);
  const P = scale;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    // dört köşeli harmanlama ile kesintisiz döşeme
    const a = n.fbm(u * P, v * P, oct), b = n.fbm((u - 1) * P, v * P, oct);
    const c = n.fbm(u * P, (v - 1) * P, oct), d = n.fbm((u - 1) * P, (v - 1) * P, oct);
    h[y * size + x] = (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
  }
  return h;
}

const cache = {};
export function getTextures() {
  if (cache.ready) return cache;
  const rnd = mulberry32(99);

  // ---- zemin detay dokusu (gri tonlu; köşe renkleriyle çarpılır)
  {
    const S = 512;
    const h = tileNoise(S, 11, 8, 5);
    const h2 = tileNoise(S, 12, 32, 3);
    const [c, g] = canvas(S);
    const img = g.createImageData(S, S);
    for (let i = 0; i < S * S; i++) {
      const v = 0.72 + (h[i] - 0.5) * 0.5 + (h2[i] - 0.5) * 0.35;
      const k = Math.max(0, Math.min(255, v * 255));
      img.data[i * 4] = k; img.data[i * 4 + 1] = k * 0.98; img.data[i * 4 + 2] = k * 0.95; img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    // çakıl taşları
    for (let i = 0; i < 900; i++) {
      const x = rnd() * S, y = rnd() * S, r = 0.6 + rnd() * 2.2;
      const l = 120 + rnd() * 120;
      g.fillStyle = `rgba(${l},${l * 0.97},${l * 0.92},0.55)`;
      g.beginPath(); g.ellipse(x, y, r, r * (0.6 + rnd() * 0.4), rnd() * 3, 0, Math.PI * 2); g.fill();
    }
    cache.ground = toTex(c, { repeat: 1 });
    const hh = new Float32Array(S * S);
    for (let i = 0; i < S * S; i++) hh[i] = h[i] * 0.6 + h2[i] * 0.8;
    cache.groundN = normalFromHeight(hh, S, 6);
  }

  // ---- metal (fırçalanmış + aşınma)
  {
    const S = 256;
    const h = tileNoise(S, 21, 6, 4);
    const [c, g] = canvas(S);
    const img = g.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const i = y * S + x;
      const streak = Math.sin(y * 1.7 + h[i] * 12) * 0.03;
      const v = 0.82 + (h[i] - 0.5) * 0.25 + streak + (rnd() - 0.5) * 0.04;
      const k = v * 255;
      img.data[i * 4] = k; img.data[i * 4 + 1] = k; img.data[i * 4 + 2] = k; img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    // perçin ve panel çizgileri
    g.strokeStyle = 'rgba(30,30,30,0.45)'; g.lineWidth = 2;
    for (let k = 0; k <= S; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, S); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(S, k); g.stroke(); }
    g.fillStyle = 'rgba(40,40,40,0.5)';
    for (let y = 8; y < S; y += 64) for (let x = 8; x < S; x += 64) {
      for (const [ox, oy] of [[0, 0], [48, 0], [0, 48], [48, 48]]) { g.beginPath(); g.arc(x + ox, y + oy, 2.2, 0, 7); g.fill(); }
    }
    // pas lekeleri
    for (let i = 0; i < 40; i++) {
      const x = rnd() * S, y = rnd() * S, r = 4 + rnd() * 14;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(90,50,30,0.35)'); gr.addColorStop(1, 'rgba(90,50,30,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    cache.metal = toTex(c);
    // pürüzlülük haritası
    const [c2, g2] = canvas(S);
    const im2 = g2.createImageData(S, S);
    for (let i = 0; i < S * S; i++) {
      const v = 0.35 + h[i] * 0.4;
      im2.data[i * 4] = v * 255; im2.data[i * 4 + 1] = v * 255; im2.data[i * 4 + 2] = v * 255; im2.data[i * 4 + 3] = 255;
    }
    g2.putImageData(im2, 0, 0);
    cache.metalR = toTex(c2, { srgb: false });
    cache.metalN = normalFromHeight(h, S, 2);
  }

  // ---- beton
  {
    const S = 256;
    const h = tileNoise(S, 31, 10, 5);
    const [c, g] = canvas(S);
    const img = g.createImageData(S, S);
    for (let i = 0; i < S * S; i++) {
      const v = 0.78 + (h[i] - 0.5) * 0.3 + (rnd() - 0.5) * 0.08;
      img.data[i * 4] = v * 255; img.data[i * 4 + 1] = v * 250; img.data[i * 4 + 2] = v * 240; img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    g.strokeStyle = 'rgba(60,60,60,0.35)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(0, 128); g.lineTo(S, 128); g.moveTo(128, 0); g.lineTo(128, S); g.stroke();
    for (let i = 0; i < 160; i++) {
      g.fillStyle = `rgba(40,40,40,${0.2 + rnd() * 0.3})`;
      g.beginPath(); g.arc(rnd() * S, rnd() * S, 0.5 + rnd() * 1.4, 0, 7); g.fill();
    }
    cache.concrete = toTex(c);
    cache.concreteN = normalFromHeight(h, S, 3);
  }

  // ---- konveyör bandı (kauçuk + nervürler)
  {
    const S = 128;
    const [c, g] = canvas(S);
    g.fillStyle = '#1c1d1f'; g.fillRect(0, 0, S, S);
    for (let x = 0; x < S; x += 16) {
      const gr = g.createLinearGradient(x, 0, x + 16, 0);
      gr.addColorStop(0, '#2a2b2e'); gr.addColorStop(0.5, '#151618'); gr.addColorStop(1, '#2a2b2e');
      g.fillStyle = gr; g.fillRect(x, 0, 6, S);
    }
    for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(255,255,255,${rnd() * 0.04})`; g.fillRect(rnd() * S, rnd() * S, 1, 1); }
    cache.belt = toTex(c);
    cache.belt.repeat.set(1, 1);
  }

  // ---- güneş hücresi
  {
    const S = 256;
    const [c, g] = canvas(S);
    g.fillStyle = '#0b1830'; g.fillRect(0, 0, S, S);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const gr = g.createLinearGradient(x * 64, y * 64, x * 64 + 64, y * 64 + 64);
      gr.addColorStop(0, '#1d3d78'); gr.addColorStop(1, '#0c1d45');
      g.fillStyle = gr; g.fillRect(x * 64 + 2, y * 64 + 2, 60, 60);
      g.strokeStyle = 'rgba(180,200,230,0.35)'; g.lineWidth = 0.7;
      for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x * 64 + k * 16, y * 64 + 2); g.lineTo(x * 64 + k * 16, y * 64 + 62); g.stroke(); }
    }
    cache.solar = toTex(c);
  }

  // ---- uyarı şeridi
  {
    const S = 128;
    const [c, g] = canvas(S);
    g.fillStyle = '#e0a713'; g.fillRect(0, 0, S, S);
    g.fillStyle = '#1a1a1a';
    for (let k = -S; k < S * 2; k += 32) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 16, 0); g.lineTo(k + 16 - S, S); g.lineTo(k - S, S); g.fill(); }
    cache.hazard = toTex(c);
  }

  // ---- pencereler (gece parlaması için emissive)
  {
    const S = 128;
    const [c, g] = canvas(S);
    g.fillStyle = '#000'; g.fillRect(0, 0, S, S);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const on = rnd() > 0.3;
      g.fillStyle = on ? `rgb(255,${190 + rnd() * 40},${110 + rnd() * 50})` : '#111';
      g.fillRect(x * 32 + 6, y * 32 + 8, 20, 14);
    }
    cache.windows = toTex(c);
  }

  // ---- su normal haritası
  {
    const S = 256;
    const h = tileNoise(S, 41, 6, 4);
    const h2 = tileNoise(S, 42, 14, 3);
    for (let i = 0; i < S * S; i++) h[i] = h[i] * 0.7 + h2[i] * 0.5;
    cache.waterN = normalFromHeight(h, S, 5);
  }

  // ---- çim yaprağı (alfa)
  {
    const S = 128;
    const [c, g] = canvas(S);
    g.clearRect(0, 0, S, S);
    for (let i = 0; i < 26; i++) {
      const x = 8 + rnd() * (S - 16), w = 2 + rnd() * 3, top = rnd() * 50, bend = (rnd() - 0.5) * 30;
      const l = 0.6 + rnd() * 0.4;
      g.fillStyle = `rgb(${Math.floor(105 * l)},${Math.floor(140 * l)},${Math.floor(55 * l)})`;
      g.beginPath(); g.moveTo(x - w, S); g.quadraticCurveTo(x + bend * 0.3, (S + top) / 2, x + bend, top); g.quadraticCurveTo(x + bend * 0.3 + w * 0.5, (S + top) / 2, x + w, S); g.fill();
    }
    cache.grass = toTex(c);
    cache.grass.wrapS = cache.grass.wrapT = THREE.ClampToEdgeWrapping;
  }

  // ---- parçacık: yumuşak duman ve ateş
  {
    const S = 128;
    const [c, g] = canvas(S);
    const n = makeNoise(77);
    const img = g.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const dx = (x - S / 2) / (S / 2), dy = (y - S / 2) / (S / 2);
      const d = Math.sqrt(dx * dx + dy * dy);
      const f = Math.max(0, 1 - d) ** 1.5 * (0.55 + n.fbm(x * 0.06, y * 0.06, 4) * 0.9);
      const i = (y * S + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255; img.data[i + 3] = Math.min(255, f * 255);
    }
    g.putImageData(img, 0, 0);
    cache.smoke = toTex(c);
    cache.smoke.wrapS = cache.smoke.wrapT = THREE.ClampToEdgeWrapping;
  }

  // ---- ızgara çizgisi
  {
    const S = 64;
    const [c, g] = canvas(S);
    g.clearRect(0, 0, S, S);
    g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 2;
    g.strokeRect(1, 1, S - 2, S - 2);
    cache.grid = toTex(c, { srgb: false });
  }

  // ---- devre kartı
  {
    const S = 128;
    const [c, g] = canvas(S);
    g.fillStyle = '#145c33'; g.fillRect(0, 0, S, S);
    g.strokeStyle = '#d0a64a'; g.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      g.beginPath(); let x = rnd() * S, y = rnd() * S; g.moveTo(x, y);
      for (let k = 0; k < 3; k++) { if (rnd() < 0.5) x += (rnd() - 0.5) * 60; else y += (rnd() - 0.5) * 60; g.lineTo(x, y); }
      g.stroke();
    }
    g.fillStyle = '#111';
    for (let i = 0; i < 5; i++) g.fillRect(rnd() * 100, rnd() * 100, 18, 12);
    cache.circuit = toTex(c);
  }

  cache.ready = true;
  return cache;
}
