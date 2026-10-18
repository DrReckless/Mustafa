// Küçük arayüz yardımcıları: eleman oluşturma, alt panel, diyalog, bildirim

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return el;
}

// Basit çizgi ikonları (SVG)
const ICONS = {
  back: '<path d="M15 5l-7 7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',
  redo: '<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 000 12h3"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  pointer: '<path d="M6 3l12 9-5 1 3 6-3 1-3-6-4 4z"/>',
  room: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 12h6v8"/>',
  door: '<path d="M5 20V4h9v16"/><path d="M14 20a9 9 0 00-9-9" stroke-dasharray="2 2"/><circle cx="11.5" cy="12" r=".6"/>',
  window: '<rect x="4" y="5" width="16" height="14" rx="1"/><path d="M12 5v14M4 12h16"/>',
  sofa: '<path d="M4 11V8a2 2 0 012-2h12a2 2 0 012 2v3"/><path d="M3 11h4v4h10v-4h4v6H3z"/><path d="M5 17v2M19 17v2"/>',
  magic: '<path d="M5 19L17 7"/><path d="M15 5l4 4"/><path d="M8 3v3M6.5 4.5h3M19 14v3M17.5 15.5h3"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  rotate: '<path d="M20 12a8 8 0 11-3-6.2"/><path d="M20 4v5h-5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/>',
  fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  palette: '<path d="M12 3a9 9 0 100 18c1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5s.8-1.5 2-1.5H17a4 4 0 004-4c0-4.7-4-8.5-9-8.5z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  walls: '<path d="M3 20V9l9-5 9 5v11"/><path d="M3 14h18"/>',
  doorOpen: '<path d="M4 20h16"/><path d="M6 20V4h8v16"/><path d="M14 4l5 2v14"/><circle cx="12" cy="12" r=".7"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  more: '<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2-6 3 3v3M9 12l2-4 4 2 2 3M11 8l-3 3"/>',
  orbit: '<ellipse cx="12" cy="12" rx="9" ry="4"/><circle cx="12" cy="12" r="2"/>',
  import: '<path d="M12 15V4M7 9l5-5 5 5M5 20h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  flip: '<path d="M12 3v18"/><path d="M8 7L3 12l5 5zM16 7l5 5-5 5z"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
};

export function icon(name, size = 22) {
  const span = document.createElement('span');
  span.className = 'ic';
  span.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  return span;
}

// ------------ Bildirim ------------
let toastTimer = null;
export function showToast(msg) {
  let el = document.getElementById('toast');
  if (!el) { el = h('div', { id: 'toast' }); document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}
window.addEventListener('app-toast', (e) => showToast(e.detail));

// ------------ Alt panel (sheet) ------------
const sheetStack = [];
export function openSheet(content, { title, onClose, tall = false, cls = '' } = {}) {
  const backdrop = h('div', { class: 'sheet-backdrop' });
  const close = () => closeSheet(entry);
  const panel = h('div', { class: `sheet ${tall ? 'tall' : ''} ${cls}` },
    h('div', { class: 'sheet-handle' }),
    title ? h('div', { class: 'sheet-head' }, h('div', { class: 'sheet-title' }, title), h('button', { class: 'icon-btn', onclick: close, 'aria-label': 'Kapat' }, icon('close'))) : null,
    h('div', { class: 'sheet-body' }, content));
  backdrop.addEventListener('click', close);
  document.body.append(backdrop, panel);
  requestAnimationFrame(() => { backdrop.classList.add('show'); panel.classList.add('show'); });
  const entry = { panel, backdrop, onClose };
  sheetStack.push(entry);
  return { close, panel };
}

export function closeSheet(entry) {
  const i = sheetStack.indexOf(entry);
  if (i < 0) return;
  sheetStack.splice(i, 1);
  entry.panel.classList.remove('show');
  entry.backdrop.classList.remove('show');
  setTimeout(() => { entry.panel.remove(); entry.backdrop.remove(); }, 250);
  entry.onClose?.();
}

export function closeTopSheet() {
  const e = sheetStack[sheetStack.length - 1];
  if (e) { closeSheet(e); return true; }
  return false;
}

export function closeAllSheets() {
  while (sheetStack.length) closeSheet(sheetStack[sheetStack.length - 1]);
}

// ------------ Diyaloglar ------------
export function dialog({ title, body, actions }) {
  return new Promise((resolve) => {
    const wrap = h('div', { class: 'modal-backdrop' });
    const done = (v) => { wrap.classList.remove('show'); setTimeout(() => wrap.remove(), 200); modalStack.pop(); resolve(v); };
    const box = h('div', { class: 'modal' },
      title ? h('div', { class: 'modal-title' }, title) : null,
      body ? h('div', { class: 'modal-body' }, body) : null,
      h('div', { class: 'modal-actions' }, ...actions.map((a) => h('button', { class: `btn ${a.primary ? 'primary' : a.danger ? 'danger' : 'ghost'}`, onclick: () => done(a.value) }, a.label))));
    wrap.appendChild(box);
    wrap.addEventListener('click', (e) => { if (e.target === wrap) done(null); });
    document.body.appendChild(wrap);
    modalStack.push(() => done(null));
    requestAnimationFrame(() => wrap.classList.add('show'));
  });
}
const modalStack = [];
export function closeTopModal() {
  const f = modalStack[modalStack.length - 1];
  if (f) { f(); return true; }
  return false;
}

export async function confirmDialog(title, text, okLabel = 'Tamam', danger = false) {
  const r = await dialog({ title, body: h('p', {}, text), actions: [{ label: 'Vazgeç', value: false }, { label: okLabel, value: true, primary: !danger, danger }] });
  return !!r;
}

export async function promptDialog(title, value = '', placeholder = '') {
  const input = h('input', { class: 'input', value, placeholder });
  setTimeout(() => { input.focus(); input.select(); }, 250);
  const r = await dialog({ title, body: input, actions: [{ label: 'Vazgeç', value: null }, { label: 'Kaydet', value: 'ok', primary: true }] });
  return r === 'ok' ? input.value.trim() : null;
}

// Form alanları
export function field(label, input, hint) {
  return h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), input, hint ? h('span', { class: 'field-hint' }, hint) : null);
}

export function numInput(value, onChange, { min = 0, max = 5000, step = 1 } = {}) {
  const el = h('input', { class: 'input', type: 'number', inputmode: 'decimal', value: Math.round(value * 10) / 10, min, max, step });
  el.addEventListener('change', () => {
    let v = parseFloat(String(el.value).replace(',', '.'));
    if (!isFinite(v)) return;
    v = Math.max(min, Math.min(max, v));
    el.value = v;
    onChange(v);
  });
  return el;
}

export function segmented(options, value, onChange) {
  const wrap = h('div', { class: 'seg' });
  const render = (v) => {
    wrap.innerHTML = '';
    for (const o of options) {
      wrap.appendChild(h('button', { class: `seg-btn ${o.value === v ? 'on' : ''}`, onclick: () => { render(o.value); onChange(o.value); } }, o.icon ? icon(o.icon, 18) : null, o.label));
    }
  };
  render(value);
  return wrap;
}

export function selectInput(options, value, onChange) {
  const el = h('select', { class: 'input' }, ...options.map((o) => h('option', { value: o.value, selected: o.value === value }, o.label)));
  el.addEventListener('change', () => onChange(el.value));
  return el;
}
