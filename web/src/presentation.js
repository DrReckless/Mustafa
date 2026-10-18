// Müşteri sunumu (PDF): kapak, ölçülü plan, mobilyalı plan, 3B görüntüler, alan tablosu.
// Her sayfa önce bir tuvale çizilir (Türkçe karakterler sorunsuz), sonra PDF'e eklenir.

import { jsPDF } from 'jspdf';
import { drawPlan, fitView, drawOverallDims, roundRect } from './plan2d.js';
import { ROOM_TYPES, roomLabel, roomArea, fmtArea, fmtM, totalArea, computeSpaces } from './model.js';
import { Viewer3D } from './view3d.js';
import { WOOD, TILE, FURN_TONE, FABRIC } from './textures.js';

const PW = 1754, PH = 1240; // A4 yatay, 150 dpi
const FONT = '"Inter", "Roboto", "Segoe UI", sans-serif';
const BRAND = 'HANTÜRK GAYRİMENKUL';

function loadImg(src) {
  return new Promise((res) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => res(null);
    i.src = src;
  });
}

function newPage() {
  const c = document.createElement('canvas');
  c.width = PW; c.height = PH;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, PW, PH);
  return { c, g };
}

function drawCover(g, img, x, y, w, h) {
  if (!img) return;
  const s = Math.max(w / img.width, h / img.height);
  const iw = img.width * s, ih = img.height * s;
  g.save();
  g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  g.restore();
}

function drawContain(g, img, x, y, w, h) {
  if (!img) return;
  const s = Math.min(w / img.width, h / img.height);
  const iw = img.width * s, ih = img.height * s;
  g.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}

function header(g, title, subtitle, logoBlack, pageNo, projectName) {
  g.fillStyle = '#111111';
  g.fillRect(0, 0, PW, 8);
  g.fillStyle = '#111';
  g.font = `700 46px ${FONT}`;
  g.textBaseline = 'alphabetic';
  g.textAlign = 'left';
  g.fillText(title, 90, 120);
  if (subtitle) {
    g.font = `400 24px ${FONT}`;
    g.fillStyle = '#7a7a7a';
    g.fillText(subtitle, 92, 160);
  }
  g.fillStyle = '#c9a24b';
  g.fillRect(92, 178, 70, 4);
  if (logoBlack) g.drawImage(logoBlack, PW - 90 - 150, 36, 150, 150);
  // alt bilgi
  g.fillStyle = '#e7e3dc';
  g.fillRect(90, PH - 80, PW - 180, 1.5);
  g.font = `500 20px ${FONT}`;
  g.fillStyle = '#8a8a8a';
  g.textAlign = 'left';
  g.fillText(BRAND + '  ·  ' + projectName, 90, PH - 44);
  g.textAlign = 'right';
  g.fillText(String(pageNo), PW - 90, PH - 44);
  g.textAlign = 'left';
}

function dateStr() {
  const d = new Date();
  const m = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
}

function roomCountLabel(p) {
  const sp = computeSpaces(p).spaces;
  const bed = sp.reduce((n, s) => n + (s.types.some((t) => ['yatak', 'cocuk', 'calisma'].includes(t)) ? 1 : 0), 0);
  const sal = sp.filter((s) => s.types.includes('salon')).length;
  if (!bed && !sal) return '';
  return `${bed}+${sal || 1}`;
}

// options: { includePlan, includeFurniturePlan, include3D, includeRooms, includeTable }
export async function buildPresentation(project, onProgress = () => {}, options = {}) {
  const opt = { includePlan: true, includeFurniturePlan: true, include3D: true, includeRooms: true, includeTable: true, ...options };
  const [logoWhite, logoBlack] = await Promise.all([loadImg('img/logo_white.png'), loadImg('img/logo_black.png')]);
  const pages = [];
  const name = project.name || 'Proje';
  const area = totalArea(project);

  // 3B görüntüler için gizli bir görüntüleyici
  const holder = document.createElement('div');
  holder.style.cssText = 'position:fixed;left:-10000px;top:0;width:800px;height:600px;';
  document.body.appendChild(holder);
  let viewer = null;
  const shots = {};
  const spaces = computeSpaces(project).spaces;
  const roomsForShots = spaces.filter((sp) => !sp.types.every((t) => t === 'antre') && project.furniture.some((f) => sp.rooms.some((r) => r.id === f.roomId)));
  const totalSteps = 3 + roomsForShots.length + 5;
  let step = 0;
  const tick = async (msg) => { step++; onProgress(Math.min(1, step / totalSteps), msg); await new Promise((r) => setTimeout(r, 30)); };

  try {
    if (opt.include3D || opt.includeRooms) {
      viewer = new Viewer3D(holder);
      viewer.setProject(project);
      await tick('3B model hazırlanıyor');
      shots.bird = await loadImg(viewer.captureBird(1600, 1000, 0.65));
      await tick('Kuşbakışı görüntü');
      if (opt.include3D) {
        shots.top = await loadImg(viewer.captureTop(1600, 1050));
        await tick('3B kat planı');
        shots.bird2 = await loadImg(viewer.captureBird(1600, 1000, 0.65 + Math.PI * 0.9));
      }
      if (opt.includeRooms) {
        shots.rooms = [];
        for (const r of roomsForShots) {
          shots.rooms.push({ room: r, name: r.name, img: await loadImg(viewer.captureRoom(r, 1200, 800)) });
          await tick(`${r.name} görüntüsü`);
        }
      }
    }
  } finally {
    viewer?.dispose();
    holder.remove();
  }

  // ---- Kapak ----
  {
    const { c, g } = newPage();
    if (shots.bird) drawCover(g, shots.bird, 0, 0, PW, PH);
    else { g.fillStyle = '#1b1b1b'; g.fillRect(0, 0, PW, PH); }
    const grd = g.createLinearGradient(0, 0, PW * 0.75, 0);
    grd.addColorStop(0, 'rgba(10,10,10,0.92)');
    grd.addColorStop(0.55, 'rgba(10,10,10,0.55)');
    grd.addColorStop(1, 'rgba(10,10,10,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, PW, PH);
    if (logoWhite) g.drawImage(logoWhite, 90, 80, 260, 260);
    g.fillStyle = '#c9a24b';
    g.fillRect(100, 520, 90, 5);
    g.fillStyle = '#ffffff';
    g.font = `300 34px ${FONT}`;
    g.fillText('DAİRE SUNUMU', 100, 590);
    g.font = `700 78px ${FONT}`;
    wrapText(g, name, 100, 690, 900, 88);
    g.font = `400 30px ${FONT}`;
    g.fillStyle = 'rgba(255,255,255,0.85)';
    const rc = roomCountLabel(project);
    g.fillText([rc, `${area.toFixed(1).replace('.', ',')} m² net alan`, `${spaces.length} mekân`].filter(Boolean).join('   ·   '), 100, 840);
    g.font = `400 24px ${FONT}`;
    g.fillStyle = 'rgba(255,255,255,0.65)';
    g.fillText(dateStr(), 100, PH - 90);
    g.textAlign = 'right';
    g.fillText(BRAND, PW - 90, PH - 90);
    g.textAlign = 'left';
    pages.push(c);
  }
  await tick('Kapak');

  let pageNo = 2;
  // ---- Ölçülü kat planı ----
  if (opt.includePlan) {
    const { c, g } = newPage();
    header(g, 'Ölçülü Kat Planı', 'Net iç ölçüler (metre)', logoBlack, pageNo++, name);
    const box = { x: 90, y: 220, w: PW - 180, h: PH - 330 };
    const v = fitView({ ...project }, box.w, box.h, 70);
    g.save();
    g.translate(box.x, box.y);
    drawPlan(g, { ...project, furniture: [] }, v, { print: true, dims: true, furniture: false, labelBg: false });
    drawOverallDims(g, project, v);
    g.restore();
    pages.push(c);
  }
  // ---- Mobilyalı plan ----
  if (opt.includeFurniturePlan && project.furniture.length) {
    const { c, g } = newPage();
    header(g, 'Mobilya Yerleşim Planı', 'Önerilen yerleşim', logoBlack, pageNo++, name);
    const box = { x: 90, y: 220, w: PW - 180, h: PH - 330 };
    const v = fitView(project, box.w, box.h, 50);
    g.save();
    g.translate(box.x, box.y);
    drawPlan(g, project, v, { print: true, dims: false, furniture: true });
    g.restore();
    pages.push(c);
  }
  await tick('Planlar');
  // ---- 3B kat planı ----
  if (opt.include3D && shots.top) {
    const { c, g } = newPage();
    header(g, '3B Kat Planı', 'Üstten görünüş', logoBlack, pageNo++, name);
    imageFrame(g, shots.top, 90, 220, PW - 180, PH - 330, false);
    pages.push(c);
  }
  if (opt.include3D && (shots.bird || shots.bird2)) {
    const { c, g } = newPage();
    header(g, '3B Görünüm', 'Perspektif', logoBlack, pageNo++, name);
    const w = (PW - 180 - 30) / 2;
    if (shots.bird) imageFrame(g, shots.bird, 90, 220, w, PH - 330, true);
    if (shots.bird2) imageFrame(g, shots.bird2, 90 + w + 30, 220, w, PH - 330, true);
    pages.push(c);
  }
  // ---- Oda görüntüleri: sayfa başına 2 ----
  if (opt.includeRooms && shots.rooms?.length) {
    for (let i = 0; i < shots.rooms.length; i += 2) {
      const { c, g } = newPage();
      header(g, 'İç Mekân Görselleri', null, logoBlack, pageNo++, name);
      const pair = shots.rooms.slice(i, i + 2);
      const w = (PW - 180 - 30) / 2;
      const h = PH - 400;
      pair.forEach((s, k) => {
        const x = 90 + k * (w + 30);
        imageFrame(g, s.img, x, 220, w, h, true);
        g.fillStyle = '#111';
        g.font = `600 30px ${FONT}`;
        g.fillText(s.name, x, 220 + h + 48);
        g.font = `400 24px ${FONT}`;
        g.fillStyle = '#7a7a7a';
        g.fillText(s.room.rooms.length === 1 ? `${fmtM(s.room.rooms[0].w)} × ${fmtM(s.room.rooms[0].h)} m   ·   ${fmtArea(s.room.area)}` : `Birleşik açık mekân   ·   ${fmtArea(s.room.area)}`, x, 220 + h + 82);
      });
      pages.push(c);
    }
  }
  // ---- Alan tablosu ----
  if (opt.includeTable) {
    const { c, g } = newPage();
    header(g, 'Alan Tablosu', 'Mekân listesi ve malzeme seçimleri', logoBlack, pageNo++, name);
    const x = 90, colW = [430, 270, 250, 170];
    let y = 260;
    g.font = `600 24px ${FONT}`;
    g.fillStyle = '#111';
    g.fillRect(x, y - 40, colW.reduce((a, b) => a + b, 0), 56);
    g.fillStyle = '#fff';
    ['Mekân', 'Tür', 'Ölçü (m)', 'Alan'].forEach((t, i) => {
      g.textAlign = i === 3 ? 'right' : 'left';
      const cx = x + colW.slice(0, i).reduce((a, b) => a + b, 0) + (i === 3 ? colW[3] - 20 : 20);
      g.fillText(t, cx, y - 3);
    });
    y += 22;
    const rows = spaces.slice().sort((a, b) => b.area - a.area);
    const rowH = Math.min(56, (PH - 420 - y) / (rows.length + 1));
    g.font = `400 ${Math.min(24, rowH * 0.48)}px ${FONT}`;
    rows.forEach((r, k) => {
      if (k % 2 === 0) { g.fillStyle = '#f6f3ee'; g.fillRect(x, y, colW.reduce((a, b) => a + b, 0), rowH); }
      g.fillStyle = '#222';
      const one = r.rooms.length === 1 ? r.rooms[0] : null;
      const cells = [r.name, r.mixed ? 'Açık plan' : ROOM_TYPES[r.type]?.label || '', one ? `${fmtM(one.w)} × ${fmtM(one.h)}` : 'Birleşik', fmtArea(r.area)];
      cells.forEach((t, i) => {
        g.textAlign = i === 3 ? 'right' : 'left';
        const cx = x + colW.slice(0, i).reduce((a, b) => a + b, 0) + (i === 3 ? colW[3] - 20 : 20);
        g.fillText(t, cx, y + rowH * 0.66);
      });
      y += rowH;
    });
    g.fillStyle = '#c9a24b';
    g.fillRect(x, y + 6, colW.reduce((a, b) => a + b, 0), 3);
    g.font = `700 28px ${FONT}`;
    g.fillStyle = '#111';
    g.textAlign = 'left';
    g.fillText('Toplam net alan', x + 20, y + 56);
    g.textAlign = 'right';
    g.fillText(fmtArea(area), x + colW.reduce((a, b) => a + b, 0) - 20, y + 56);
    g.textAlign = 'left';
    // malzeme kartı
    const mx = x + colW.reduce((a, b) => a + b, 0) + 60, mw = PW - 90 - mx;
    let my = 220;
    g.fillStyle = '#f6f3ee';
    roundRect(g, mx, my, mw, 470, 18);
    g.fill();
    g.fillStyle = '#111';
    g.font = `600 28px ${FONT}`;
    g.fillText('Malzeme Seçimleri', mx + 30, my + 60);
    const s = project.style;
    const mat = [
      ['Parke', WOOD[s.wood]?.label],
      ['Seramik', TILE[s.tile]?.label],
      ['Mobilya', FURN_TONE[s.furniture]?.label],
      ['Döşeme', FABRIC[s.fabric]?.label],
    ];
    g.font = `400 24px ${FONT}`;
    mat.forEach(([k, v], i) => {
      g.fillStyle = '#7a7a7a';
      g.fillText(k, mx + 30, my + 120 + i * 62);
      g.fillStyle = '#222';
      g.fillText(v || '-', mx + 200, my + 120 + i * 62);
    });
    g.fillStyle = '#7a7a7a';
    g.fillText('Duvar rengi', mx + 30, my + 120 + 4 * 62);
    g.fillStyle = s.wall;
    roundRect(g, mx + 200, my + 120 + 4 * 62 - 28, 80, 36, 8);
    g.fill();
    g.strokeStyle = '#ccc';
    g.stroke();
    g.font = `400 20px ${FONT}`;
    g.fillStyle = '#9a9a9a';
    wrapText(g, 'Görseller temsilidir. Ölçüler net iç ölçülerdir; uygulama öncesi yerinde kontrol edilmelidir.', mx + 30, my + 430 - 20, mw - 60, 28);
    pages.push(c);
  }
  await tick('PDF oluşturuluyor');

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
  pages.forEach((c, i) => {
    if (i > 0) doc.addPage('a4', 'landscape');
    doc.addImage(c.toDataURL('image/jpeg', 0.88), 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
  });
  doc.setProperties({ title: `${name} - Daire Sunumu`, author: BRAND, creator: 'Hantürk Plan 3D' });
  const base64 = doc.output('datauristring').split(',')[1];
  const thumbs = pages.map((c) => {
    const t = document.createElement('canvas');
    t.width = 420; t.height = 297;
    t.getContext('2d').drawImage(c, 0, 0, 420, 297);
    return t.toDataURL('image/jpeg', 0.75);
  });
  const images = {
    bird: shots.bird?.src, top: shots.top?.src, bird2: shots.bird2?.src,
    rooms: (shots.rooms || []).map((r) => ({ name: r.name, src: r.img?.src })),
  };
  await tick('Hazır');
  return { base64, thumbs, pageCount: pages.length, images };
}

function imageFrame(g, img, x, y, w, h, cover) {
  g.save();
  roundRect(g, x, y, w, h, 14);
  g.clip();
  g.fillStyle = '#efece6';
  g.fillRect(x, y, w, h);
  if (cover) drawCover(g, img, x, y, w, h); else drawContain(g, img, x, y, w, h);
  g.restore();
}

function wrapText(g, text, x, y, maxW, lh) {
  const words = String(text).split(' ');
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (g.measureText(t).width > maxW && line) {
      g.fillText(line, x, y);
      line = w;
      y += lh;
    } else line = t;
  }
  if (line) g.fillText(line, x, y);
  return y;
}
