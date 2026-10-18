// Android yerel köprüsü (WebView içinde "HanturkNative" nesnesi).
// Tarayıcıda test ederken localStorage ve indirme bağlantıları kullanılır.

const N = typeof window !== 'undefined' ? window.HanturkNative : null;
export const isAndroid = !!N;

const LS_INDEX = 'hanturk.projects';

function lsGet(k, def) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; }
}
function lsSet(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn(e); }
}

export const storage = {
  list() {
    if (N) {
      try { return JSON.parse(N.listProjects() || '[]'); } catch { return []; }
    }
    return lsGet(LS_INDEX, []);
  },
  load(id) {
    if (N) {
      const s = N.loadProject(id);
      return s ? JSON.parse(s) : null;
    }
    return lsGet('hanturk.p.' + id, null);
  },
  save(project, thumb) {
    const meta = {
      id: project.id, name: project.name, updatedAt: project.updatedAt,
      rooms: project.rooms.length, area: project.rooms.reduce((s, r) => s + (r.w * r.h) / 10000, 0), thumb: thumb || null,
    };
    if (N) {
      N.saveProject(project.id, JSON.stringify(project), JSON.stringify(meta));
      return;
    }
    lsSet('hanturk.p.' + project.id, project);
    const idx = lsGet(LS_INDEX, []).filter((m) => m.id !== project.id);
    idx.unshift(meta);
    lsSet(LS_INDEX, idx);
  },
  remove(id) {
    if (N) { N.deleteProject(id); return; }
    try { localStorage.removeItem('hanturk.p.' + id); } catch {}
    lsSet(LS_INDEX, lsGet(LS_INDEX, []).filter((m) => m.id !== id));
  },
};

// base64 (data URL olmadan) veriyi paylaş / kaydet
export function shareFile(base64, filename, mime, title = 'Paylaş') {
  if (N) { N.shareFile(base64, filename, mime, title); return; }
  // Telefon tarayıcısında sistem paylaşım menüsü (WhatsApp, e-posta…)
  try {
    const file = new File([base64ToBytes(base64)], filename, { type: mime });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title }).catch((e) => {
        if (e && e.name !== 'AbortError') downloadBase64(base64, filename, mime);
      });
      return;
    }
  } catch {}
  downloadBase64(base64, filename, mime);
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function saveFile(base64, filename, mime) {
  if (N) return N.saveToDownloads(base64, filename, mime);
  downloadBase64(base64, filename, mime);
  return true;
}

function downloadBase64(base64, filename, mime) {
  const url = URL.createObjectURL(new Blob([base64ToBytes(base64)], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

// Tarayıcının projeleri kendiliğinden silmemesini iste
if (!N) try { navigator.storage?.persist?.(); } catch {}

export function toast(msg) {
  if (N && N.toast) { N.toast(msg); return; }
  window.dispatchEvent(new CustomEvent('app-toast', { detail: msg }));
}

export function blobToBase64(blob) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

export function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
