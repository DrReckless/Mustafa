import './styles.css';
import { h, icon, showToast, openSheet, closeTopSheet, closeTopModal, closeAllSheets, dialog, confirmDialog, promptDialog, field, numInput, segmented, selectInput } from './ui.js';
import { storage, shareFile, saveFile, utf8ToBase64, isAndroid } from './bridge.js';
import {
  ROOM_TYPES, ROOM_TYPE_ORDER, TEMPLATES, projectFromTemplate, normalizeProject, roomLabel, roomArea, totalArea,
  fmtArea, fmtM, sideLength, uid, clone, footprint, roomAt,
  computeSpaces, spaceOf, spaceRoomIds, roomNeighbors, isSliding,
} from './model.js';
import { CATALOG, CATEGORIES, makeItem } from './catalog.js';
import { drawPlan, fitView, drawFurniture } from './plan2d.js';
import { PlanEditor } from './editor.js';
import { layoutProject } from './layout.js';
import { WOOD, TILE, FURN_TONE, FABRIC, WALL_COLORS, ACCENTS, THEMES, clearTextureCache } from './textures.js';

const $app = document.getElementById('app');

const app = {
  project: null,
  undo: [],
  redo: [],
  screen: 'home',
  editor: null,
  viewer: null,
  saveTimer: null,
};
window.__app = app;

// ======================================================================
// Ekran yönetimi
// ======================================================================
const screens = {};
function screen(name) {
  if (!screens[name]) {
    screens[name] = h('section', { class: 'screen', id: 'screen-' + name });
    $app.appendChild(screens[name]);
  }
  return screens[name];
}

function show(name) {
  for (const [k, el] of Object.entries(screens)) el.classList.toggle('active', k === name);
  const prev = app.screen;
  app.screen = name;
  if (prev === '3d' && name !== '3d') app.viewer?.stop();
  setStatusBar();
}

function setStatusBar() {
  try { window.HanturkNative?.setStatusBarDark?.(true); } catch {}
}

// ======================================================================
// ANA EKRAN
// ======================================================================
function renderHome() {
  const el = screen('home');
  el.innerHTML = '';
  const list = storage.list().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const fileInput = h('input', { type: 'file', accept: '.json,.hplan,application/json', style: { display: 'none' } });
  fileInput.addEventListener('change', () => importFile(fileInput.files[0]));
  el.append(
    h('div', { class: 'home-hero' },
      h('img', { src: 'img/logo_white.png', alt: 'Hantürk' }),
      h('div', {}, h('h1', {}, 'Hantürk Plan 3D'), h('p', {}, 'Kat planı · Mobilya yerleşimi · 3B sunum'))),
    h('div', { class: 'home-body' },
      h('div', { class: 'home-actions' },
        h('button', { class: 'btn primary', onclick: newProjectDialog }, icon('plus', 20), 'Yeni Proje'),
        h('button', { class: 'btn outline', onclick: () => fileInput.click() }, icon('import', 20), 'İçe Aktar')),
      h('div', { class: 'section-title' }, 'Projelerim'),
      list.length
        ? list.map((m) => projectCard(m))
        : h('div', { class: 'empty' }, h('b', {}, 'Henüz proje yok'), 'Yeni bir proje oluşturup hazır şablonlardan (1+1, 2+1, 3+1) başlayabilir ya da planı sıfırdan çizebilirsiniz.'),
      fileInput),
  );
}

function projectCard(m) {
  const d = new Date(m.updatedAt || Date.now());
  const date = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  const card = h('div', { class: 'project-card' },
    h('div', { class: 'thumb', style: m.thumb ? { backgroundImage: `url(${m.thumb})` } : {} }),
    h('div', { class: 'meta', onclick: () => openProject(m.id) },
      h('div', { class: 'name' }, m.name || 'Adsız proje'),
      h('div', { class: 'sub' }, `${(m.area || 0).toFixed(1).replace('.', ',')} m² · ${m.rooms || 0} mekân`),
      h('div', { class: 'sub' }, date)),
    h('button', { class: 'icon-btn', onclick: (e) => { e.stopPropagation(); projectMenu(m); }, 'aria-label': 'Menü' }, icon('more')));
  card.querySelector('.thumb').addEventListener('click', () => openProject(m.id));
  return card;
}

function projectMenu(m) {
  const s = openSheet(h('div', {},
    h('button', { class: 'menu-item', onclick: () => { s.close(); openProject(m.id); } }, icon('edit'), 'Aç'),
    h('button', { class: 'menu-item', onclick: async () => {
      s.close();
      const n = await promptDialog('Proje adı', m.name);
      if (n) { const p = storage.load(m.id); p.name = n; storage.save(p, m.thumb); renderHome(); }
    } }, icon('edit'), 'Yeniden adlandır'),
    h('button', { class: 'menu-item', onclick: () => {
      s.close();
      const p = storage.load(m.id);
      const c = clone(p);
      c.id = uid('p'); c.name = p.name + ' (kopya)'; c.createdAt = c.updatedAt = Date.now();
      storage.save(c, m.thumb);
      renderHome();
      showToast('Proje kopyalandı');
    } }, icon('copy'), 'Kopyasını oluştur'),
    h('button', { class: 'menu-item', onclick: () => { s.close(); exportProject(storage.load(m.id)); } }, icon('share'), 'Proje dosyasını paylaş'),
    h('button', { class: 'menu-item danger', onclick: async () => {
      s.close();
      if (await confirmDialog('Projeyi sil', `"${m.name}" kalıcı olarak silinecek.`, 'Sil', true)) { storage.remove(m.id); renderHome(); }
    } }, icon('trash'), 'Sil'),
  ), { title: m.name });
}

function exportProject(p) {
  if (!p) return;
  const safe = (p.name || 'proje').replace(/[^\wçğıöşüÇĞİÖŞÜ -]/g, '').trim() || 'proje';
  shareFile(utf8ToBase64(JSON.stringify(p)), `${safe}.hplan.json`, 'application/json', 'Proje dosyasını paylaş');
}

async function importFile(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const p = normalizeProject(JSON.parse(text));
    if (!Array.isArray(p.rooms)) throw new Error('geçersiz');
    p.id = uid('p');
    p.updatedAt = Date.now();
    storage.save(p, makeThumb(p));
    renderHome();
    showToast('Proje içe aktarıldı');
  } catch (e) {
    showToast('Dosya okunamadı: geçerli bir proje dosyası değil');
  }
}

function newProjectDialog() {
  let chosen = '2+1';
  const name = h('input', { class: 'input', placeholder: 'Örn. Bahçeşehir Daire 12', value: '' });
  const grid = h('div', { class: 'tpl-grid' });
  const render = () => {
    grid.innerHTML = '';
    for (const [key, t] of Object.entries(TEMPLATES)) {
      const cv = h('canvas', { width: 300, height: 180 });
      const btn = h('button', { class: `tpl ${key === chosen ? 'on' : ''}`, onclick: () => { chosen = key; render(); } }, cv, h('b', {}, t.label), h('span', {}, t.desc));
      grid.appendChild(btn);
      const p = projectFromTemplate(key, '');
      const g = cv.getContext('2d');
      g.fillStyle = '#f6f4f0'; g.fillRect(0, 0, 300, 180);
      if (p.rooms.length) drawPlan(g, p, fitView(p, 300, 180, 10), { labels: false, floorPattern: false });
      else { g.fillStyle = '#b8b1a5'; g.font = '600 40px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('+', 150, 90); }
    }
  };
  render();
  const s = openSheet(h('div', {},
    field('Proje adı', name),
    h('div', { class: 'field-label' }, 'Başlangıç şablonu'),
    grid,
    h('div', { style: { height: '14px' } }),
    h('button', { class: 'btn primary block', onclick: () => {
      const n = name.value.trim() || `Proje ${new Date().toLocaleDateString('tr-TR')}`;
      const p = projectFromTemplate(chosen, n);
      storage.save(p, makeThumb(p));
      s.close();
      openProject(p.id, p);
    } }, 'Oluştur'),
  ), { title: 'Yeni Proje', tall: true });
}

function makeThumb(p) {
  const c = document.createElement('canvas');
  c.width = 288; c.height = 216;
  const g = c.getContext('2d');
  g.fillStyle = '#f0ede7';
  g.fillRect(0, 0, c.width, c.height);
  if (p.rooms.length) drawPlan(g, p, fitView(p, c.width, c.height, 10), { labels: false, floorPattern: false });
  return c.toDataURL('image/jpeg', 0.8);
}

// ======================================================================
// EDİTÖR
// ======================================================================
function openProject(id, proj) {
  const p = proj || storage.load(id);
  if (!p) { showToast('Proje açılamadı'); return; }
  app.project = normalizeProject(p);
  app.undo = [];
  app.redo = [];
  buildEditor();
  show('editor');
  requestAnimationFrame(() => { app.editor.resize(); app.editor.fit(); });
  if (!app.project.rooms.length) hint('Oda çizmek için alttan "Oda" aracını seçip parmağınızı sürükleyin');
}

app.commit = (beforeJson) => {
  app.undo.push(beforeJson);
  if (app.undo.length > 80) app.undo.shift();
  app.redo = [];
  app.project.updatedAt = Date.now();
  scheduleSave();
  updateUndo();
  app.editor?.invalidate();
};

function scheduleSave() {
  clearTimeout(app.saveTimer);
  app.saveTimer = setTimeout(saveNow, 600);
}
function saveNow() {
  clearTimeout(app.saveTimer);
  if (app.project) storage.save(app.project, makeThumb(app.project));
}

function doUndo() {
  if (!app.undo.length) return;
  app.redo.push(JSON.stringify(app.project));
  app.project = normalizeProject(JSON.parse(app.undo.pop()));
  afterHistory();
}
function doRedo() {
  if (!app.redo.length) return;
  app.undo.push(JSON.stringify(app.project));
  app.project = normalizeProject(JSON.parse(app.redo.pop()));
  afterHistory();
}
function afterHistory() {
  const sel = app.editor.selection;
  if (sel && !findSel(sel)) app.editor.select(null);
  else app.onSelectionChange(sel);
  scheduleSave();
  updateUndo();
  app.editor.invalidate();
}

function updateUndo() {
  const u = document.getElementById('btn-undo'), r = document.getElementById('btn-redo');
  if (u) u.disabled = !app.undo.length;
  if (r) r.disabled = !app.redo.length;
}

let hintTimer = null;
function hint(text, ms = 3200) {
  const el = document.getElementById('editor-hint');
  if (!el) return;
  el.textContent = text;
  el.style.opacity = 1;
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => (el.style.opacity = 0), ms);
}
app.hint = hint;

app.defaultRoomName = (type, exceptId = null) => {
  const base = ROOM_TYPES[type]?.label || 'Oda';
  const n = app.project.rooms.filter((r) => r.type === type && r.id !== exceptId).length;
  return n ? `${base} ${n + 1}` : base;
};

const TOOLS = [
  { key: 'select', label: 'Seç', icon: 'pointer', hint: 'Seçmek için dokunun, taşımak için sürükleyin. İki parmakla yakınlaştırın.' },
  { key: 'room', label: 'Oda', icon: 'room', hint: 'Oda çizmek için parmağınızı köşeden köşeye sürükleyin' },
  { key: 'door', label: 'Kapı', icon: 'door', hint: 'Kapı eklemek için bir duvarın üzerine dokunun' },
  { key: 'window', label: 'Pencere', icon: 'window', hint: 'Pencere eklemek için bir duvarın üzerine dokunun' },
  { key: 'furniture', label: 'Mobilya', icon: 'sofa' },
  { key: 'auto', label: 'Otomatik', icon: 'magic', accent: true },
];

function buildEditor() {
  const el = screen('editor');
  el.innerHTML = '';
  app.editor?.destroy();
  const titleEl = h('div', { class: 'title', onclick: renameProject }, app.project.name, h('small', {}, 'Kat planı'));
  const wrap = h('div', { class: 'editor-wrap' });
  const toolbar = h('div', { class: 'toolbar' });
  const props = h('div', { class: 'props', id: 'props' });
  el.append(
    h('div', { class: 'topbar' },
      h('button', { class: 'icon-btn', onclick: goHome, 'aria-label': 'Geri' }, icon('back')),
      titleEl,
      h('button', { class: 'icon-btn', id: 'btn-undo', onclick: doUndo, disabled: true, 'aria-label': 'Geri al' }, icon('undo')),
      h('button', { class: 'icon-btn', id: 'btn-redo', onclick: doRedo, disabled: true, 'aria-label': 'Yinele' }, icon('redo')),
      h('button', { class: 'pill-btn', onclick: open3D }, icon('cube', 18), '3B'),
      h('button', { class: 'pill-btn gold', onclick: openPresent, style: { marginLeft: '6px' } }, icon('doc', 18), 'Sunum')),
    wrap,
    toolbar,
  );
  wrap.append(
    h('div', { class: 'hint', id: 'editor-hint', style: { opacity: 0 } }),
    h('div', { class: 'float-tools' },
      h('button', { class: 'icon-btn', onclick: () => app.editor.fit(), 'aria-label': 'Sığdır' }, icon('fit')),
      h('button', { class: 'icon-btn', id: 'btn-dims', onclick: () => { app.editor.showDims = !app.editor.showDims; app.editor.invalidate(); hint(app.editor.showDims ? 'Tüm ölçüler gösteriliyor' : 'Ölçüler gizlendi', 1500); }, 'aria-label': 'Ölçüler' }, h('b', { style: { fontSize: '12px' } }, 'm')),
    ),
    props,
  );
  app.editor = new PlanEditor(wrap, app);
  // canvas, ipucu ve panellerin altında kalmalı
  wrap.insertBefore(app.editor.canvas, wrap.firstChild);
  const renderTools = () => {
    toolbar.innerHTML = '';
    for (const t of TOOLS) {
      toolbar.appendChild(h('button', {
        class: `tool ${app.editor.tool === t.key ? 'on' : ''} ${t.accent ? 'accent' : ''}`,
        onclick: () => {
          if (t.key === 'furniture') { openCatalog(); return; }
          if (t.key === 'auto') { openAutoLayout(); return; }
          app.setTool(t.key);
          if (t.hint) hint(t.hint);
        },
      }, icon(t.icon), t.label));
    }
  };
  app.setTool = (k) => { app.editor.setTool(k); if (k !== 'select') app.editor.select(null); renderTools(); };
  renderTools();
  updateUndo();
}

async function renameProject() {
  const n = await promptDialog('Proje adı', app.project.name);
  if (n) {
    const before = JSON.stringify(app.project);
    app.project.name = n;
    app.commit(before);
    const t = document.querySelector('#screen-editor .topbar .title');
    if (t) t.firstChild.textContent = n;
  }
}

function goHome() {
  saveNow();
  closeAllSheets();
  renderHome();
  show('home');
}

function findSel(sel) {
  if (!sel) return null;
  const p = app.project;
  if (sel.kind === 'room') return p.rooms.find((x) => x.id === sel.id);
  if (sel.kind === 'opening') return p.openings.find((x) => x.id === sel.id);
  if (sel.kind === 'furniture') return p.furniture.find((x) => x.id === sel.id);
  return null;
}

// Seçime göre özellik paneli
app.onSelectionChange = (sel) => {
  const panel = document.getElementById('props');
  if (!panel) return;
  const obj = findSel(sel);
  if (!obj) { panel.classList.remove('show'); return; }
  panel.innerHTML = '';
  const change = (fn) => {
    const before = JSON.stringify(app.project);
    fn();
    app.commit(before);
  };
  const refresh = () => app.onSelectionChange(app.editor.selection);
  let title, sub, body;
  if (sel.kind === 'room') {
    const r = obj;
    title = roomLabel(r);
    sub = `${fmtM(r.w)} × ${fmtM(r.h)} m · ${fmtArea(roomArea(r))}`;
    const sp = spaceOf(app.project, r.id);
    const merged = sp && sp.rooms.length > 1;
    const nbs = roomNeighbors(app.project, r);
    const nbBox = nbs.length ? h('div', { class: 'nb-box' },
      h('div', { class: 'field-label' }, 'Komşu odalarla ara duvar'),
      ...nbs.map((nb) => h('div', { class: 'nb-row' },
        h('span', {}, roomLabel(nb.room)),
        segmented([{ value: 'wall', label: 'Var' }, { value: 'open', label: 'Yok' }], nb.state, (v) => change(() => {
          app.project.partitions = app.project.partitions || {};
          app.project.partitions[nb.key] = v;
          refresh();
          hint(v === 'open' ? 'Ara duvar kaldırıldı: iki oda tek mekân olarak döşenir' : 'Ara duvar eklendi', 2200);
        })))),
      merged ? h('div', { class: 'field-hint' }, `Birleşik mekân: ${sp.name} · ${fmtArea(sp.area)}. Otomatik yerleşim bu mekânı bir bütün olarak planlar.`) : null,
    ) : null;
    body = h('div', {},
      h('div', { class: 'row' },
        field('Oda adı', (() => { const i = h('input', { class: 'input', value: r.name || '' }); i.addEventListener('change', () => change(() => { r.name = i.value.trim(); refresh(); })); return i; })()),
        field('Tür', selectInput(ROOM_TYPE_ORDER.map((k) => ({ value: k, label: ROOM_TYPES[k].label })), r.type, (v) => change(() => {
          const oldDefault = !r.name || Object.values(ROOM_TYPES).some((t) => r.name.startsWith(t.label));
          if (oldDefault) r.name = app.defaultRoomName(v, r.id);
          r.type = v;
          refresh();
        })))),
      h('div', { class: 'row' },
        field('Genişlik (cm)', numInput(r.w, (v) => change(() => { r.w = v; clampOpenings(r); refresh(); }), { min: 60, max: 3000 })),
        field('Uzunluk (cm)', numInput(r.h, (v) => change(() => { r.h = v; clampOpenings(r); refresh(); }), { min: 60, max: 3000 }))),
      nbBox,
      h('div', { class: 'actions' },
        h('button', { class: 'btn gold', onclick: () => openAutoLayout([r.id]) }, icon('magic', 18), merged ? 'Bu mekânı döşe' : 'Bu odayı döşe'),
        h('button', { class: 'btn outline', onclick: () => change(() => { app.project.furniture = app.project.furniture.filter((f) => f.roomId !== r.id); }) }, 'Mobilyaları kaldır'),
        h('button', { class: 'btn outline', onclick: () => {
          const before = JSON.stringify(app.project);
          const c = { ...r, id: uid('r'), x: r.x + r.w + 10, name: app.defaultRoomName(r.type) };
          app.project.rooms.push(c);
          app.commit(before);
          app.editor.select({ kind: 'room', id: c.id });
        } }, icon('copy', 18), 'Kopyala'),
        h('button', { class: 'btn danger', onclick: () => {
          const before = JSON.stringify(app.project);
          app.project.rooms = app.project.rooms.filter((x) => x.id !== r.id);
          for (const k of Object.keys(app.project.partitions || {})) if (k.split('|').includes(r.id)) delete app.project.partitions[k];
          app.project.openings = app.project.openings.filter((o) => o.roomId !== r.id);
          app.project.furniture = app.project.furniture.filter((f) => f.roomId !== r.id);
          app.commit(before);
          app.editor.select(null);
        } }, icon('trash', 18), 'Sil')),
      h('div', { class: 'field-hint', style: { marginTop: '10px' } }, 'İpucu: Odayı sürükleyerek taşıyın, köşelerdeki tutamaçlarla boyutlandırın. Komşu odaya yaklaştırınca duvar payı bırakarak yapışır. Aynı türden salon, mutfak, antre ve balkonlar aralarında kapı yoksa otomatik birleşir.'),
    );
  } else if (sel.kind === 'opening') {
    const o = obj;
    const room = app.project.rooms.find((r) => r.id === o.roomId);
    const len = sideLength(room, o.side);
    title = o.kind === 'door' ? (isSliding(o) ? 'Sürgülü Cam Kapı' : 'Kapı') : 'Pencere';
    sub = `${roomLabel(room)} · ${{ n: 'kuzey', s: 'güney', e: 'doğu', w: 'batı' }[o.side]} duvarı`;
    const items = [
      h('div', { class: 'row' },
        field('Genişlik (cm)', numInput(o.width, (v) => change(() => { o.width = Math.min(v, len); o.offset = Math.min(o.offset, len - o.width); refresh(); }), { min: 40, max: len })),
        field('Duvar başından (cm)', numInput(o.offset, (v) => change(() => { o.offset = Math.min(v, len - o.width); refresh(); }), { min: 0, max: len }))),
    ];
    if (o.kind === 'door') {
      items.push(field('Kapı türü', segmented([{ value: 'hinged', label: 'Menteşeli' }, { value: 'sliding', label: 'Sürgülü cam' }], isSliding(o) ? 'sliding' : 'hinged', (v) => change(() => {
        if (v === 'sliding') {
          o.variant = 'sliding'; o.panels = o.panels || 2; o.frame = o.frame || 'antrasit'; o.height = 230;
          const w = Math.min(len, Math.max(o.width, 180));
          o.offset = Math.max(0, Math.min(o.offset - (w - o.width) / 2, len - w)); o.width = w;
        } else { delete o.variant; o.height = 210; o.width = Math.min(o.width, 100); }
        refresh();
      }))));
    }
    if (isSliding(o)) {
      items.push(
        h('div', { class: 'row' },
          field('Kanat sayısı', segmented([{ value: 2, label: '2' }, { value: 3, label: '3' }], o.panels || 2, (v) => change(() => (o.panels = v)))),
          field('Çerçeve', segmented([{ value: 'antrasit', label: 'Antrasit' }, { value: 'beyaz', label: 'Beyaz' }], o.frame || 'antrasit', (v) => change(() => (o.frame = v))))),
        field('Yükseklik (cm)', numInput(o.height ?? 230, (v) => change(() => (o.height = v)), { min: 180, max: 290 }), 'Boydan cam; 3B görünümde dokununca kanat kayarak açılır'),
      );
    } else if (o.kind === 'door') {
      items.push(
        h('div', { class: 'row' },
          field('Açılış yönü', segmented([{ value: 'in', label: 'İçe' }, { value: 'out', label: 'Dışa' }], o.swing || 'in', (v) => change(() => (o.swing = v)))),
          field('Menteşe', segmented([{ value: 'start', label: 'Sol' }, { value: 'end', label: 'Sağ' }], o.hinge || 'start', (v) => change(() => (o.hinge = v))))),
        field('Giriş kapısı mı?', segmented([{ value: 'no', label: 'Hayır' }, { value: 'yes', label: 'Evet' }], /giri/i.test(o.name || '') ? 'yes' : 'no', (v) => change(() => (o.name = v === 'yes' ? 'Giriş' : ''))), 'Ayakkabılık giriş kapısının yanına yerleştirilir'),
      );
    } else {
      items.push(h('div', { class: 'row' },
        field('Denizlik yüksekliği (cm)', numInput(o.sill ?? 90, (v) => change(() => (o.sill = v)), { min: 0, max: 200 })),
        field('Pencere yüksekliği (cm)', numInput(o.height ?? 140, (v) => change(() => (o.height = v)), { min: 30, max: 260 }))));
    }
    items.push(h('div', { class: 'actions' },
      h('button', { class: 'btn outline', onclick: () => change(() => { o.kind = o.kind === 'door' ? 'window' : 'door'; delete o.variant; if (o.kind === 'door') { o.swing = 'in'; o.hinge = 'start'; o.height = 210; } else { o.sill = 90; o.height = 140; } refresh(); }) }, o.kind === 'door' ? 'Pencereye çevir' : 'Kapıya çevir'),
      h('button', { class: 'btn danger', onclick: () => { change(() => { app.project.openings = app.project.openings.filter((x) => x.id !== o.id); }); app.editor.select(null); } }, icon('trash', 18), 'Sil')));
    items.push(h('div', { class: 'field-hint', style: { marginTop: '10px' } }, 'İpucu: Seçiliyken duvar boyunca sürükleyerek konumunu değiştirebilirsiniz.'));
    body = h('div', {}, items);
  } else {
    const f = obj;
    const c = CATALOG[f.type] || {};
    title = c.name || 'Mobilya';
    sub = `${Math.round(f.w)} × ${Math.round(f.d)} × ${Math.round(f.h)} cm`;
    body = h('div', {},
      h('div', { class: 'row' },
        field('Genişlik', numInput(f.w, (v) => change(() => { f.w = v; refresh(); }), { min: 10, max: 600 })),
        field('Derinlik', numInput(f.d, (v) => change(() => { f.d = v; refresh(); }), { min: 10, max: 600 })),
        field('Yükseklik', numInput(f.h, (v) => change(() => { f.h = v; refresh(); }), { min: 1, max: 300 }))),
      h('div', { class: 'actions' },
        h('button', { class: 'btn outline', onclick: () => change(() => { f.rot = (f.rot + 90) % 360; }) }, icon('rotate', 18), 'Döndür'),
        c.kind === 'sofa_l' ? h('button', { class: 'btn outline', onclick: () => change(() => { f.mirror = !f.mirror; }) }, icon('flip', 18), 'Aynala') : null,
        h('button', { class: 'btn outline', onclick: () => {
          const before = JSON.stringify(app.project);
          const n = { ...f, id: uid('f'), x: f.x + 20, y: f.y + 20 };
          app.project.furniture.push(n);
          app.commit(before);
          app.editor.select({ kind: 'furniture', id: n.id });
        } }, icon('copy', 18), 'Çoğalt'),
        h('button', { class: 'btn danger', onclick: () => { change(() => { app.project.furniture = app.project.furniture.filter((x) => x.id !== f.id); }); app.editor.select(null); } }, icon('trash', 18), 'Sil')),
      h('div', { class: 'field-hint', style: { marginTop: '10px' } }, 'İpucu: Sürükleyerek taşıyın; duvara yaklaşınca otomatik yaslanır. Altın ok mobilyanın ön yüzünü gösterir.'),
    );
  }
  const collapsed = panel.classList.contains('collapsed') && panel.dataset.sel === sel.id;
  panel.dataset.sel = sel.id;
  panel.classList.toggle('collapsed', collapsed);
  panel.append(
    h('div', { class: 'props-head', onclick: (e) => { if (e.target.closest('button')) return; panel.classList.toggle('collapsed'); } },
      h('div', { class: 't' }, title, h('small', {}, sub)),
      h('button', { class: 'icon-btn', onclick: () => app.editor.select(null), 'aria-label': 'Kapat' }, icon('close'))),
    h('div', { class: 'props-body' }, body),
  );
  panel.classList.add('show');
};

function clampOpenings(r) {
  for (const o of app.project.openings) {
    if (o.roomId !== r.id) continue;
    const len = sideLength(r, o.side);
    o.width = Math.min(o.width, len);
    o.offset = Math.max(0, Math.min(o.offset, len - o.width));
  }
}

// ---------------- Katalog ----------------
function openCatalog() {
  let cat = CATEGORIES[0].key;
  const tabs = h('div', { class: 'tabs' });
  const grid = h('div', { class: 'cat-grid' });
  const render = () => {
    tabs.innerHTML = '';
    for (const c of CATEGORIES) tabs.appendChild(h('button', { class: `tab ${c.key === cat ? 'on' : ''}`, onclick: () => { cat = c.key; render(); } }, c.label));
    grid.innerHTML = '';
    for (const [type, item] of Object.entries(CATALOG)) {
      if (item.cat !== cat || type === 'k_corner') continue;
      const cv = h('canvas', { width: 144, height: 128 });
      grid.appendChild(h('button', { class: 'cat-item', onclick: () => { s.close(); addFurniture(type); } }, cv, h('span', {}, item.name), h('small', {}, `${item.w}×${item.d} cm`)));
      const g = cv.getContext('2d');
      const sc = Math.min(120 / item.w, 104 / item.d, 1.6);
      drawFurniture(g, { type, x: 0, y: 0, rot: 0, w: item.w, d: item.d, h: item.h }, { scale: sc, ox: -72 / sc, oy: -64 / sc }, false);
    }
  };
  render();
  const s = openSheet(h('div', {}, tabs, grid), { title: 'Mobilya Ekle', tall: true });
}

function addFurniture(type) {
  const p = app.project;
  const [cx, cy] = app.editor.viewCenter();
  let room = roomAt(p, cx, cy);
  if (app.editor.selection?.kind === 'room') room = p.rooms.find((r) => r.id === app.editor.selection.id) || room;
  if (!room) room = p.rooms[0];
  const x = room ? room.x + room.w / 2 : cx, y = room ? room.y + room.h / 2 : cy;
  const before = JSON.stringify(p);
  const c = CATALOG[type];
  const f = makeItem(type, Math.round(x / 5) * 5, Math.round(y / 5) * 5, 0, room?.id || null, c.elev ? { elev: c.elev } : {});
  f.id = uid('f');
  p.furniture.push(f);
  app.commit(before);
  app.setTool('select');
  app.editor.select({ kind: 'furniture', id: f.id });
  hint('Mobilyayı sürükleyerek yerleştirin');
}

// ---------------- Otomatik yerleşim ----------------
function openAutoLayout(roomIds = null) {
  const p = app.project;
  if (!p.rooms.length) { showToast('Önce kat planına oda ekleyin'); return; }
  const body = h('div', {}, h('div', { class: 'spinner' }), h('p', { style: { textAlign: 'center', color: '#74706a' } }, 'Yerleşim seçenekleri hesaplanıyor…'));
  if (roomIds) roomIds = spaceRoomIds(p, roomIds);
  const scopeName = roomIds ? (spaceOf(p, roomIds[0])?.name || roomLabel(p.rooms.find((r) => r.id === roomIds[0]))) : 'Tüm daire';
  const s = openSheet(body, { title: `Otomatik Yerleşim · ${scopeName}`, tall: true });
  setTimeout(() => {
    let options;
    try {
      options = layoutProject(p, roomIds);
    } catch (e) {
      console.error(e);
      body.innerHTML = '';
      body.append(h('p', {}, 'Yerleşim hesaplanırken bir hata oluştu.'));
      return;
    }
    body.innerHTML = '';
    body.append(h('p', { class: 'notes', style: { marginTop: 0 } },
      'Odalar; kapı açılma alanları, pencereler, geçiş yolları (en az 60 cm), mobilya ön boşlukları ve iç mimari kurallarına göre değerlendirildi. ' +
      'Ara duvarı olmayan bitişik odalar tek mekân olarak birlikte planlandı. ' +
      (roomIds ? 'Bu mekândaki mevcut mobilyalar' : 'Mevcut tüm mobilyalar') + ' seçtiğiniz seçenekle değiştirilecek.'));
    const unique = [];
    options.forEach((o, i) => {
      const sig = JSON.stringify(o.furniture.map((f) => [f.type, Math.round(f.x), Math.round(f.y), f.rot]));
      if (unique.some((u) => u.sig === sig)) return;
      unique.push({ o, i, sig });
    });
    unique.forEach(({ o }, k) => {
      const preview = { ...p, furniture: keepOthers(p, roomIds).concat(o.furniture) };
      const cv = h('canvas', { width: 900, height: 640 });
      const g = cv.getContext('2d');
      g.fillStyle = '#fbfaf7'; g.fillRect(0, 0, 900, 640);
      const scope = roomIds ? { ...preview, rooms: preview.rooms.filter((r) => roomIds.includes(r.id)) } : preview;
      drawPlan(g, preview, fitView(scope, 900, 640, 24), {});
      body.appendChild(h('div', { class: `opt-card ${k === 0 ? 'best' : ''}` },
        h('div', { class: 'opt-head' }, h('b', {}, `Seçenek ${k + 1}`), k === 0 ? h('span', { class: 'badge' }, 'En uygun') : h('span', { class: 'badge', style: { background: '#f1eee8', color: '#74706a' } }, 'Alternatif')),
        cv,
        o.notes.length ? h('div', { class: 'notes' }, '• ' + [...new Set(o.notes)].join('\n• ')) : null,
        h('button', { class: 'btn primary block', style: { marginTop: '8px' }, onclick: () => {
          const before = JSON.stringify(p);
          p.furniture = keepOthers(p, roomIds).concat(o.furniture.map((f) => ({ ...f, id: uid('f') })));
          app.commit(before);
          s.close();
          app.editor.select(null);
          showToast(`Seçenek ${k + 1} uygulandı`);
        } }, 'Bu seçeneği uygula')));
    });
  }, 60);
}

function keepOthers(p, roomIds) {
  if (!roomIds) return [];
  return p.furniture.filter((f) => !roomIds.includes(f.roomId));
}

// ======================================================================
// 3B GÖRÜNÜM
// ======================================================================
let Viewer3DClass = null;
async function open3D() {
  saveNow();
  app.editor.select(null);
  const el = screen('3d');
  el.innerHTML = '';
  const view = h('div', { class: 'view3d' });
  const joy = h('div', { class: 'joy' }, h('i'));
  const help = h('div', { class: 'walk-help', style: { display: 'none' } }, 'Sol altta parmağınızı sürükleyerek yürüyün, ekranın geri kalanında sürükleyerek etrafa bakın. Kapıya dokunarak açıp kapatın.');
  const doorBtn = h('button', { class: 'door-btn', style: { display: 'none' }, onclick: () => { app.viewer.toggleDoor(app.viewer.nearDoor); updateDoorBtn(); } });
  const updateDoorBtn = () => {
    const d = app.viewer?.nearDoor;
    if (!d || mode !== 'walk') { doorBtn.style.display = 'none'; return; }
    doorBtn.style.display = '';
    doorBtn.innerHTML = '';
    doorBtn.append(icon('doorOpen', 20), `${d.label}: ${d.target > 0.5 ? 'Kapat' : 'Aç'}`);
  };
  let mode = 'orbit';
  const seg = segmented([{ value: 'orbit', label: 'Kuşbakışı', icon: 'orbit' }, { value: 'walk', label: 'İçeride Gez', icon: 'walk' }], mode, (v) => {
    mode = v;
    app.viewer.setMode(v);
    help.style.display = v === 'walk' ? 'block' : 'none';
    wallBtn.style.display = v === 'walk' ? 'none' : '';
    if (v === 'walk') setTimeout(() => { help.style.display = 'none'; }, 7000);
    updateDoorBtn();
  });
  const wallBtn = h('button', { class: 'icon-btn', 'aria-label': 'Duvar yüksekliği', onclick: () => {
    const m = app.viewer.wallMode === 'full' ? 'low' : 'full';
    app.viewer.setWallMode(m);
    showToast(m === 'full' ? 'Duvarlar tam yükseklikte' : 'Duvarlar alçaltıldı (içerisi daha iyi görünür)');
  } }, icon('walls'));
  el.append(
    h('div', { class: 'topbar' },
      h('button', { class: 'icon-btn', onclick: () => { show('editor'); requestAnimationFrame(() => app.editor.resize()); }, 'aria-label': 'Geri' }, icon('back')),
      h('div', { class: 'title' }, app.project.name, h('small', {}, '3B görünüm')),
      h('button', { class: 'pill-btn gold', onclick: openPresent }, icon('doc', 18), 'Sunum')),
    view,
  );
  view.append(
    h('div', { class: 'v3-top' }, seg),
    joy, help, doorBtn,
    h('div', { class: 'v3-tools' },
      h('button', { class: 'icon-btn', onclick: () => app.viewer.resetCamera(), 'aria-label': 'Görünümü sıfırla' }, icon('fit')),
      h('button', { class: 'icon-btn', 'aria-label': 'Tüm kapılar', onclick: () => {
        const v = app.viewer;
        if (!v.doors.length) { showToast('Planda kapı yok'); return; }
        const open = v.doorsOpenCount() < v.doors.length / 2;
        v.setAllDoors(open);
        showToast(open ? 'Tüm kapılar açıldı' : 'Tüm kapılar kapatıldı');
      } }, icon('doorOpen')),
      wallBtn,
      h('button', { class: 'icon-btn', onclick: openMaterials, 'aria-label': 'Malzemeler' }, icon('palette')),
      h('button', { class: 'icon-btn gold', onclick: takePhoto, 'aria-label': 'Fotoğraf' }, icon('camera'))),
  );
  show('3d');
  if (!Viewer3DClass) {
    const loading = h('div', { class: 'spinner', style: { position: 'absolute', left: '50%', top: '45%', margin: '-17px' } });
    view.appendChild(loading);
    Viewer3DClass = (await import('./view3d.js')).Viewer3D;
    loading.remove();
  }
  if (app.viewer) app.viewer.dispose();
  try {
    app.viewer = new Viewer3DClass(view);
  } catch (e) {
    console.error(e);
    view.append(h('div', { class: 'empty' }, h('b', {}, '3B görünüm başlatılamadı'), 'Cihazınızın grafik desteği (WebGL) kapalı olabilir.'));
    return;
  }
  view.insertBefore(app.viewer.renderer.domElement, view.firstChild);
  app.viewer.onJoystick = (j) => {
    if (!j.active) { joy.style.display = 'none'; return; }
    joy.style.display = 'block';
    joy.style.left = j.x + 'px';
    joy.style.top = j.y + 'px';
    joy.firstChild.style.transform = `translate(${j.dx}px, ${j.dy}px)`;
  };
  app.viewer.onNearDoor = updateDoorBtn;
  app.viewer.onDoorsChange = updateDoorBtn;
  app.viewer.resize();
  app.viewer.setProject(app.project);
  app.viewer.start();
  if (!localStorage.getItem('hint-doors')) {
    showToast('İpucu: Kapılara dokunarak açıp kapatabilirsiniz');
    try { localStorage.setItem('hint-doors', '1'); } catch {}
  }
}

function openMaterials() {
  const st = app.project.style;
  const body = h('div', {});
  const apply = (fn) => {
    const before = JSON.stringify(app.project);
    fn();
    app.commit(before);
    clearTextureCache();
    app.viewer.build();
    render();
  };
  const chipRow = (obj, key, colorKey) => h('div', { class: 'chips' }, ...Object.entries(obj).map(([k, v]) =>
    h('button', { class: `chip ${st[key] === k ? 'on' : ''}`, onclick: () => apply(() => (st[key] = k)) }, h('i', { style: { background: v[colorKey] } }), v.label)));
  const render = () => {
    body.innerHTML = '';
    body.append(
      field('Hazır tema', h('div', { class: 'chips' }, ...Object.entries(THEMES).map(([k, t]) =>
        h('button', { class: `chip theme ${st.accent === t.accent && st.furniture === t.furniture && st.fabric === t.fabric ? 'on' : ''}`, onclick: () => apply(() => {
          for (const key of ['wood', 'tile', 'wall', 'furniture', 'fabric', 'accent']) st[key] = t[key];
        }) }, h('span', { class: 'dots' }, ...ACCENTS[t.accent].colors.map((c) => h('i', { style: { background: c } }))), t.label))),
        'Parke, seramik, duvar, mobilya ve kumaş renklerini uyumlu bir sette değiştirir'),
      field('Seramik (mutfak, banyo, antre)', chipRow(TILE, 'tile', 'base')),
      field('Duvar rengi', h('div', { class: 'swatches' }, ...WALL_COLORS.map((c) => h('button', { class: `swatch ${st.wall === c ? 'on' : ''}`, style: { background: c }, onclick: () => apply(() => (st.wall = c)), 'aria-label': c })))),
      field('Mobilya tonu', chipRow(FURN_TONE, 'furniture', 'body')),
      field('Döşeme / kumaş rengi', chipRow(FABRIC, 'fabric', 'color')),
      field('Vurgu renkleri (kırlent, tablo, halı, berjer)', h('div', { class: 'chips' }, ...Object.entries(ACCENTS).map(([k, a]) =>
        h('button', { class: `chip theme ${st.accent === k ? 'on' : ''}`, onclick: () => apply(() => (st.accent = k)) }, h('span', { class: 'dots' }, ...a.colors.map((c) => h('i', { style: { background: c } }))), a.label)))),
      field('Dekor ve aksesuarlar', segmented([{ value: true, label: 'Açık' }, { value: false, label: 'Kapalı' }], st.decor !== false, (v) => apply(() => (st.decor = v))), 'Perde, tablo, kırlent, sarkıt lamba, tezgâh ve masa üstü aksesuarları'),
    );
  };
  render();
  openSheet(body, { title: 'Malzeme ve Renkler' });
}

function takePhoto() {
  showToast('Görüntü hazırlanıyor…');
  setTimeout(() => {
    const url = app.viewer.captureCurrent(1920, 1080);
    const b64 = url.split(',')[1];
    const name = `${(app.project.name || 'proje').replace(/\s+/g, '_')}_${Date.now()}.jpg`;
    const s = openSheet(h('div', {},
      h('img', { class: 'shot-img', src: url }),
      h('div', { class: 'actions', style: { marginTop: '12px' } },
        h('button', { class: 'btn primary', onclick: () => shareFile(b64, name, 'image/jpeg', 'Görseli paylaş') }, icon('share', 18), 'Paylaş'),
        h('button', { class: 'btn outline', onclick: () => { if (saveFile(b64, name, 'image/jpeg')) showToast('Görsel İndirilenler klasörüne kaydedildi'); } }, icon('download', 18), 'Kaydet'))),
    { title: 'Fotoğraf (1920×1080)' });
    void s;
  }, 50);
}

// ======================================================================
// SUNUM
// ======================================================================
function openPresent() {
  saveNow();
  app.viewer?.stop();
  const el = screen('present');
  el.innerHTML = '';
  const p = app.project;
  const opts = { includePlan: true, includeFurniturePlan: true, include3D: true, includeRooms: true, includeTable: true };
  const labels = {
    includePlan: 'Ölçülü kat planı',
    includeFurniturePlan: 'Mobilya yerleşim planı',
    include3D: '3B kat planı ve perspektif görünümler',
    includeRooms: 'Oda oda iç mekân görselleri',
    includeTable: 'Alan tablosu ve malzeme seçimleri',
  };
  const body = h('div', { class: 'present-body' });
  const result = h('div', {});
  const progress = h('div', { class: 'progress', style: { display: 'none' } }, h('i'));
  const status = h('div', { class: 'notes', style: { textAlign: 'center' } });
  const goBtn = h('button', { class: 'btn gold block', onclick: run }, icon('doc', 18), 'Sunumu Oluştur');
  body.append(
    h('div', { class: 'card' },
      h('h3', {}, 'Müşteri Sunumu (PDF)'),
      h('p', {}, `${p.name} · ${fmtArea(totalArea(p))} · ${computeSpaces(p).spaces.length} mekân. Kapakta firma logonuz yer alır.`)),
    h('div', { class: 'card' }, ...Object.keys(opts).map((k) => {
      const cb = h('input', { type: 'checkbox', checked: true });
      cb.addEventListener('change', () => (opts[k] = cb.checked));
      return h('label', { class: 'check' }, cb, labels[k]);
    })),
    !p.furniture.length ? h('div', { class: 'card' }, h('p', {}, 'Not: Planda henüz mobilya yok. Önce editörde "Otomatik" ile yerleşim yapmanız önerilir.')) : null,
    goBtn, progress, status, result,
  );
  el.append(
    h('div', { class: 'topbar' },
      h('button', { class: 'icon-btn', onclick: () => { show('editor'); requestAnimationFrame(() => app.editor.resize()); }, 'aria-label': 'Geri' }, icon('back')),
      h('div', { class: 'title' }, 'Sunum', h('small', {}, p.name))),
    body,
  );
  show('present');

  async function run() {
    goBtn.disabled = true;
    result.innerHTML = '';
    progress.style.display = 'block';
    status.textContent = 'Hazırlanıyor…';
    try {
      const { buildPresentation } = await import('./presentation.js');
      const res = await buildPresentation(p, (f, msg) => { progress.firstChild.style.width = Math.round(f * 100) + '%'; status.textContent = msg; }, opts);
      status.textContent = `${res.pageCount} sayfalık sunum hazır`;
      const fname = `${(p.name || 'Sunum').replace(/[^\wçğıöşüÇĞİÖŞÜ -]/g, '').trim().replace(/\s+/g, '_')}_Sunum.pdf`;
      result.append(
        h('div', { class: 'actions' },
          h('button', { class: 'btn primary', onclick: () => shareFile(res.base64, fname, 'application/pdf', 'Sunumu paylaş') }, icon('share', 18), 'PDF Paylaş'),
          h('button', { class: 'btn outline', onclick: () => { if (saveFile(res.base64, fname, 'application/pdf')) showToast('PDF İndirilenler klasörüne kaydedildi'); } }, icon('download', 18), 'Kaydet')),
        h('div', { class: 'pages' }, ...res.thumbs.map((t) => h('img', { src: t }))),
        res.images.bird ? h('div', { class: 'section-title' }, 'Görseller (tek tek paylaşmak için dokunun)') : null,
        h('div', { class: 'pages' }, ...[
          res.images.bird && { name: 'Kuşbakışı', src: res.images.bird },
          res.images.top && { name: '3B Kat Planı', src: res.images.top },
          res.images.bird2 && { name: 'Perspektif', src: res.images.bird2 },
          ...res.images.rooms,
        ].filter((x) => x && x.src).map((im) => h('img', { src: im.src, title: im.name, onclick: () => shareFile(im.src.split(',')[1], `${im.name.replace(/\s+/g, '_')}.jpg`, 'image/jpeg', 'Görseli paylaş') }))),
      );
    } catch (e) {
      console.error(e);
      status.textContent = 'Sunum oluşturulamadı: ' + (e.message || e);
    } finally {
      goBtn.disabled = false;
      progress.style.display = 'none';
    }
  }
}

// ======================================================================
// Geri tuşu (Android) ve başlangıç
// ======================================================================
window.onAndroidBack = () => {
  if (closeTopModal()) return true;
  if (closeTopSheet()) return true;
  if (app.screen === 'editor' && app.editor?.selection) { app.editor.select(null); return true; }
  if (app.screen === '3d' || app.screen === 'present') { show('editor'); requestAnimationFrame(() => app.editor.resize()); return true; }
  if (app.screen === 'editor') { goHome(); return true; }
  return false;
};

window.addEventListener('pagehide', saveNow);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); });
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); e.shiftKey ? doRedo() : doUndo(); }
  if (e.key === 'Delete' && app.screen === 'editor' && app.editor?.selection) {
    const sel = app.editor.selection;
    const before = JSON.stringify(app.project);
    if (sel.kind === 'furniture') app.project.furniture = app.project.furniture.filter((f) => f.id !== sel.id);
    if (sel.kind === 'opening') app.project.openings = app.project.openings.filter((f) => f.id !== sel.id);
    app.commit(before);
    app.editor.select(null);
  }
});

renderHome();
show('home');
const splash = document.getElementById('splash');
if (splash) setTimeout(() => { splash.classList.add('hide'); setTimeout(() => splash.remove(), 400); }, 500);
void isAndroid; void footprint; void dialog;
