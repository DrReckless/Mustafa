import { ITEMS, ITEM_KEYS, BUILDINGS, RECIPES, UNITS, TECH, CATEGORIES, PURITY } from './config.js';
import { fmt } from './util.js';

const $ = (s) => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

export class UI {
  constructor(app) {
    this.app = app;
    this.thumbs = app.thumbs;
    this.cat = 'uretim';
    this.lastStock = {};
    this.infoT = 0;
    this.bindStatic();
  }
  get game() { return this.app.game; }
  icon(k, cls = '') { return `<img class="${cls}" src="${this.thumbs.i[k] || ''}" alt="">`; }
  costHtml(cost, mul = 1) {
    return Object.entries(cost).map(([k, v]) => {
      const ok = (this.game.stock[k] || 0) >= v * mul;
      return `<span class="${ok ? '' : 'no'}">${this.icon(k)}${v * mul}</span>`;
    }).join('');
  }

  bindStatic() {
    document.querySelectorAll('.speed button').forEach((b) => b.addEventListener('click', () => {
      this.app.setSpeed(+b.dataset.speed); this.app.audio.play('click');
    }));
    $('#btn-menu').addEventListener('click', () => this.showMenu());
    $('#btn-research').addEventListener('click', () => this.showResearch());
    $('#btn-army').addEventListener('click', () => this.showArmy());
    $('#btn-demolish').addEventListener('click', () => {
      const inp = this.app.input;
      if (inp.tool?.kind === 'demolish') inp.setTool(null); else inp.setTool({ kind: 'demolish' });
    });
    $('#btn-rotate').addEventListener('click', () => this.app.input.rotate());
    $('#btn-cancel').addEventListener('click', () => this.app.input.setTool(null));
    $('#modal .mclose').addEventListener('click', () => this.closeModal());
    $('#modal').addEventListener('pointerdown', (e) => { if (e.target.id === 'modal') this.closeModal(); });
  }

  init() {
    const cats = $('#cats'); cats.innerHTML = '';
    for (const c of CATEGORIES) {
      const b = el('button', c.id === this.cat ? 'on' : '', c.name);
      b.addEventListener('click', () => { this.cat = c.id; this.app.audio.play('click'); this.renderCards(); cats.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); });
      cats.appendChild(b);
    }
    this.renderCards();
    this.renderRes(true);
    this.updateObjective();
  }

  renderCards() {
    const box = $('#cards'); box.innerHTML = '';
    this.cards = [];
    for (const [k, d] of Object.entries(BUILDINGS)) {
      if (d.cat !== this.cat) continue;
      const c = el('button', 'card');
      c.innerHTML = `<img src="${this.thumbs.b[k] || ''}"><div class="nm">${d.name}</div><div class="cost"></div>`;
      c.addEventListener('click', () => {
        if (!this.game.unlocked.has(k)) {
          const t = TECH.find((q) => q.unlocks.includes(k));
          this.toast(`Kilitli: ${t ? t.name + ' araştırması gerekli' : ''}`, 'warn'); this.app.audio.play('error'); return;
        }
        const inp = this.app.input;
        if (inp.tool?.type === k) inp.setTool(null); else inp.setTool({ kind: 'build', type: k });
        this.app.audio.play('click');
      });
      box.appendChild(c);
      this.cards.push({ k, c, cost: c.querySelector('.cost') });
    }
    this.refreshCards();
  }
  refreshCards() {
    if (!this.cards) return;
    const tool = this.app.input?.tool;
    for (const { k, c, cost } of this.cards) {
      const locked = !this.game.unlocked.has(k);
      c.classList.toggle('locked', locked);
      c.classList.toggle('sel', tool?.type === k);
      c.classList.toggle('poor', !this.game.canAfford(BUILDINGS[k].cost));
      const h = this.costHtml(BUILDINGS[k].cost);
      if (cost._h !== h) { cost.innerHTML = h; cost._h = h; }
    }
  }

  renderRes(force) {
    const g = this.game;
    const box = $('#res');
    const show = ITEM_KEYS.filter((k) => g.stock[k] > 0 || ['iron_ingot', 'copper_ingot', 'brick', 'ammo'].includes(k));
    const sig = show.join(',');
    if (force || box._sig !== sig) {
      box.innerHTML = '';
      this.resEls = {};
      for (const k of show) {
        const e = el('div', 'ri', `${this.icon(k)}<span></span>`);
        e.title = ITEMS[k].name;
        e.addEventListener('click', () => this.toast(`${ITEMS[k].name}: ${Math.floor(g.stock[k])}`, 'info'));
        box.appendChild(e);
        this.resEls[k] = e;
      }
      box._sig = sig;
    }
    for (const k of show) {
      const v = Math.floor(g.stock[k]);
      const e = this.resEls[k];
      const sp = e.lastChild;
      const s = fmt(v);
      if (sp.textContent !== s) {
        if (v > (this.lastStock[k] ?? v)) { e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); }
        sp.textContent = s;
        sp.className = k === 'ammo' && v < 30 ? 'no' : '';
      }
      this.lastStock[k] = v;
    }
  }

  updateHud(dt) {
    const g = this.game;
    this.renderRes();
    const p = g.power;
    $('#power-txt').textContent = `${Math.round(p.demand)}/${Math.round(p.supply)} kW`;
    const bar = $('#power-bar');
    bar.style.width = `${Math.min(100, p.supply > 0 ? (p.demand / Math.max(1, p.cap || p.supply)) * 100 : 0)}%`;
    bar.style.background = p.ratio < 1 ? 'var(--bad)' : p.demand > p.supply * 0.85 ? 'var(--acc)' : 'var(--good)';
    $('#st-power').style.color = p.ratio < 1 ? 'var(--bad)' : '';
    $('#clock').textContent = g.clock();
    $('#day').textContent = `${g.day()}. Gün`;
    const w = g.wave.next;
    const alive = g.rivals.some((r) => r.alive);
    $('#wave-txt').textContent = alive ? `${Math.floor(w / 60)}:${String(Math.floor(w % 60)).padStart(2, '0')}` : '—';
    $('#st-wave').style.color = w < 25 && alive ? 'var(--bad)' : '';
    this.infoT -= dt;
    if (this.infoT <= 0) { this.infoT = 0.25; this.refreshCards(); this.refreshInfo(); }
  }
  updateObjective() {
    const [i, n] = this.game.objectiveIndex();
    $('#obj-n').textContent = i < n ? `${i + 1}/${n}` : '';
    $('#obj-txt').textContent = this.game.objectiveText();
  }
  setSpeedButtons(s) {
    document.querySelectorAll('.speed button').forEach((b) => b.classList.toggle('on', +b.dataset.speed === s));
  }

  toast(msg, kind = 'info') {
    const box = $('#toasts');
    const t = el('div', 'toast ' + kind, msg);
    box.appendChild(t);
    while (box.children.length > 3) box.firstChild.remove();
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, kind === 'bad' || kind === 'warn' ? 4200 : 2800);
  }

  setToolUI(tool) {
    $('#toolctl').classList.toggle('hidden', !tool);
    $('#btn-demolish').classList.toggle('on', tool?.kind === 'demolish');
    if (tool) {
      $('#tool-name').textContent = tool.kind === 'demolish' ? 'Sökme: yapıya dokun' : BUILDINGS[tool.type].name + (BUILDINGS[tool.type].line ? ' • sürükle' : ' • dokun');
      $('#btn-rotate').classList.toggle('hidden', tool.kind === 'demolish');
    }
    this.refreshCards();
  }

  // ---------------- bilgi paneli ----------------
  showInfo(sel) {
    this.sel = sel;
    const box = $('#info');
    if (!sel) { box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    box.innerHTML = '';
    const close = el('button', 'x', '✕'); close.addEventListener('click', () => this.app.select(null));
    box.appendChild(close);
    if (sel.u) return this.unitInfo(box, sel.u);
    const b = sel.b, d = BUILDINGS[b.type], g = this.game;
    const own = b.faction === 0;
    const rival = g.rivals.find((r) => r.id === b.faction);
    const name = b.type === 'hq' && rival ? `${rival.name} Karargâhı` : (rival ? `${rival.name}: ` : '') + d.name;
    box.appendChild(el('h3', '', `<img src="${this.thumbs.b[b.type]}">${name}`));
    box.appendChild(el('div', 'hpbar', '<i id="i-hp"></i>'));
    box.appendChild(el('div', 'desc', own ? d.desc : 'Düşman yapısı. Ordunu bu üsse saldırmaya gönder.'));
    const dyn = el('div', ''); dyn.id = 'i-dyn'; box.appendChild(dyn);
    if (own && ['smelter', 'assembler', 'foundry'].includes(b.type)) {
      const rec = el('div', 'recipes');
      for (const [rk, r] of Object.entries(RECIPES)) {
        if (r.building !== b.type) continue;
        const btn = el('button', 'recipe' + (b.recipe === rk ? ' on' : ''));
        const io = Object.entries(r.inp).map(([k, v]) => `${v}${this.icon(k)}`).join('+') + ' → ' + Object.entries(r.out).map(([k, v]) => `${v}${this.icon(k)}`).join('');
        btn.innerHTML = `<b>${r.name}</b><div class="io">${io}</div>`;
        btn.addEventListener('click', () => {
          if (b.recipe !== rk) {
            for (const k in b.inBuf) g.stock[k] = (g.stock[k] || 0) + b.inBuf[k];
            b.inBuf = {}; b.progress = 0; b.recipe = rk;
          }
          this.app.audio.play('click');
          this.showInfo(sel);
        });
        rec.appendChild(btn);
      }
      box.appendChild(rec);
    }
    if (own && b.type === 'factory') {
      const ub = el('div', '');
      for (const [uk, u] of Object.entries(UNITS)) {
        if (!u.cost) continue;
        const unlocked = g.unitUnlocked.has(uk);
        const btn = el('button', 'unitbtn');
        btn.innerHTML = `<img src="${this.thumbs.u[uk]}"><div><b>${u.name}</b>${unlocked ? '' : ' 🔒'}<div class="c">${this.costHtml(u.cost)}</div><small style="color:var(--dim)">Can ${u.hp} • Menzil ${u.range} • ${u.air ? 'Hava' : 'Kara'}</small></div>`;
        btn.disabled = !unlocked;
        btn.addEventListener('click', () => {
          if (g.queueUnit(b, uk)) { this.app.audio.play('click'); this.refreshInfo(); }
          else { this.app.audio.play('error'); this.toast(b.queue.length >= 5 ? 'Üretim kuyruğu dolu' : 'Yetersiz malzeme', 'warn'); }
        });
        ub.appendChild(btn);
      }
      box.appendChild(ub);
    }
    if (own && b.type === 'hq') {
      const r = el('div', 'btnrow');
      const b1 = el('button', 'btn acc', '🔬 Araştırma'); b1.addEventListener('click', () => this.showResearch());
      const b2 = el('button', 'btn', '🎖 Ordu'); b2.addEventListener('click', () => this.showArmy());
      r.append(b1, b2); box.appendChild(r);
    }
    if (own && b.type !== 'hq') {
      const r = el('div', 'btnrow');
      if (d.size === 1) {
        const rot = el('button', 'btn', '⟳ Döndür');
        rot.addEventListener('click', () => { g.rotate(b); this.app.audio.play('click'); });
        r.appendChild(rot);
      }
      const dem = el('button', 'btn red', '⛏ Sök (%60 iade)');
      dem.addEventListener('click', () => { g.demolish(b); this.app.audio.play('demolish'); this.app.select(null); });
      r.appendChild(dem);
      box.appendChild(r);
    }
    if (!own && rival) {
      const r = el('div', 'btnrow');
      const a = el('button', 'btn acc', `⚔ Orduyu Gönder`);
      a.addEventListener('click', () => this.attack(rival.id));
      r.appendChild(a); box.appendChild(r);
    }
    this.refreshInfo();
  }
  unitInfo(box, u) {
    const d = UNITS[u.type];
    const rival = this.game.rivals.find((r) => r.id === u.faction);
    box.appendChild(el('h3', '', `<img src="${this.thumbs.u[u.type]}">${rival ? rival.name + ': ' : ''}${d.name}`));
    box.appendChild(el('div', 'hpbar', '<i id="i-hp"></i>'));
    const dyn = el('div', ''); dyn.id = 'i-dyn'; box.appendChild(dyn);
    box.appendChild(el('div', 'desc', `Hasar ${d.dmg} • Menzil ${d.range} • Hız ${d.speed} • ${d.air ? 'Hava birimi' : 'Kara birimi'}`));
    if (u.faction === 0) {
      const r = el('div', 'btnrow');
      const a = el('button', 'btn acc', '🎖 Ordu Komutları'); a.addEventListener('click', () => this.showArmy());
      r.appendChild(a); box.appendChild(r);
    }
    this.refreshInfo();
  }
  refreshInfo() {
    const sel = this.sel;
    if (!sel) return;
    const g = this.game;
    const t = sel.b || sel.u;
    const alive = sel.b ? g.buildings.get(t.id) === t : g.units.includes(t);
    if (!alive) { this.app.select(null); return; }
    const hp = document.getElementById('i-hp');
    if (hp) { const r = t.hp / t.maxHp; hp.style.width = r * 100 + '%'; hp.style.background = r > 0.5 ? 'var(--good)' : r > 0.25 ? 'var(--acc)' : 'var(--bad)'; }
    const dyn = document.getElementById('i-dyn');
    if (!dyn) return;
    let h = `<div class="row"><span>Dayanıklılık</span><b>${Math.ceil(t.hp)} / ${t.maxHp}</b></div>`;
    if (sel.u) {
      const mode = t.faction !== 0 ? 'Saldırıda' : t.mode === 'attack' ? 'Saldırı: ' + (g.rivals.find((r) => r.id === t.goal)?.name || '') : 'Üs savunması';
      h += `<div class="row"><span>Görev</span><b>${mode}</b></div>`;
      dyn.innerHTML = h; return;
    }
    const b = t, d = BUILDINGS[b.type];
    const st = (s, c) => `<div class="row"><span>Durum</span><b class="${c}">${s}</b></div>`;
    const pr = g.power.ratio;
    if (b.faction !== 0) { dyn.innerHTML = h; return; }
    switch (b.type) {
      case 'miner': {
        const rate = 60 / 2.2 * PURITY[b.purity].mul;
        h += `<div class="row"><span>Yatak</span><b>${this.icon(b.ore)} ${ITEMS[b.ore].name} (${PURITY[b.purity].name})</b></div>`;
        h += `<div class="row"><span>Hız</span><b>${rate.toFixed(0)} / dk</b></div>`;
        h += b.outBuf.length >= 2 ? st('Çıkış tıkalı – önüne konveyör bağla', 'no') : pr < 1 ? st('Düşük enerji', 'no') : st('Çalışıyor', 'ok');
        h += `<div class="pbar"><i style="width:${b.progress * 100}%"></i></div>`;
        break;
      }
      case 'smelter': case 'assembler': case 'foundry': {
        const r = RECIPES[b.recipe];
        if (!r) { h += st('Cevher bekleniyor (otomatik tarif)', ''); break; }
        h += `<div class="row"><span>Girdi</span><span class="buf">${Object.keys(r.inp).map((k) => `<span>${this.icon(k)}${b.inBuf[k] || 0}</span>`).join('')}</span></div>`;
        h += `<div class="row"><span>Çıktı</span><span class="buf">${Object.keys(r.out).map((k) => `<span>${this.icon(k)}${b.outBuf.filter((x) => x === k).length}</span>`).join('')}</span></div>`;
        h += `<div class="row"><span>Hız</span><b>${(60 / r.time * Object.values(r.out)[0]).toFixed(0)} / dk</b></div>`;
        if (b.outBuf.length >= 6) h += st('Çıkış tıkalı – önüne konveyör bağla', 'no');
        else if (b.working) h += pr < 1 ? st('Düşük enerji', 'no') : st('Üretiyor', 'ok');
        else h += st('Girdi bekleniyor', '');
        h += `<div class="pbar"><i style="width:${b.progress * 100}%"></i></div>`;
        break;
      }
      case 'generator':
        h += `<div class="row"><span>Yakıt</span><b>${this.icon('coal')} ${b.fuel}</b></div>`;
        h += b.working ? st('Yakıyor (+80 kW)', 'ok') : b.fuel > 0 ? st('Beklemede (ihtiyaç yok)', '') : st('Kömür gerekli', 'no');
        break;
      case 'solar':
        h += st(g.sunLevel() > 0.05 ? `Üretiyor (${Math.round(25 * Math.min(1, g.sunLevel() * 1.4))} kW)` : 'Gece – üretim yok', g.sunLevel() > 0.05 ? 'ok' : '');
        break;
      case 'turret_mg': case 'turret_cannon': case 'turret_laser':
        h += `<div class="row"><span>Hasar / Menzil</span><b>${d.dmg} / ${d.range}</b></div>`;
        if (d.ammo) h += `<div class="row"><span>Mühimmat (depo)</span><b class="${g.stock.ammo < 30 ? 'no' : ''}">${this.icon('ammo')} ${Math.floor(g.stock.ammo)}</b></div>`;
        else h += `<div class="row"><span>Enerji</span><b>${d.power} kW</b></div>`;
        h += b.noAmmo ? st('Mühimmat yok!', 'no') : b.target ? st('Ateş ediyor', 'no') : st('Nöbette', 'ok');
        break;
      case 'factory':
        h += `<div class="row"><span>Kuyruk</span><span class="buf">${b.queue.map((k) => `<span><img src="${this.thumbs.u[k]}"></span>`).join('') || '—'}</span></div>`;
        h += `<div class="pbar"><i style="width:${b.progress * 100}%"></i></div>`;
        break;
      case 'hq': {
        const n = g.units.filter((u) => u.faction === 0).length;
        h += `<div class="row"><span>Ordu</span><b>${n} birim</b></div>`;
        h += `<div class="row"><span>Taban enerji</span><b>30 kW</b></div>`;
        break;
      }
      case 'belt':
        h += `<div class="row"><span>Taşınan</span><span class="buf">${b.items.map((i) => `<span>${this.icon(i.t)}</span>`).join('') || '—'}</span></div>`;
        break;
    }
    if (dyn._h !== h) { dyn.innerHTML = h; dyn._h = h; }
  }

  // ---------------- modallar ----------------
  openModal(html, cls = '') {
    const m = $('#modal');
    m.classList.remove('hidden');
    const body = m.querySelector('.mbody');
    body.className = 'mbody ' + cls;
    body.innerHTML = html;
    this.modalOpen = true;
    return body;
  }
  closeModal() { $('#modal').classList.add('hidden'); this.modalOpen = false; this.modalKind = null; this.app.onModalClose?.(); }

  showResearch() {
    this.modalKind = 'research';
    const g = this.game;
    const body = this.openModal('<h2>🔬 Araştırma</h2><p>Ana Üs deposundaki malzemeleri harcayarak yeni teknolojiler aç.</p><div class="tech"></div>');
    const box = body.querySelector('.tech');
    for (const t of TECH) {
      const done = g.researched.has(t.id);
      const lock = t.req && !g.researched.has(t.req);
      const c = el('div', 'tcard' + (done ? ' done' : lock ? ' lock' : ''));
      const ul = [...t.unlocks.map((k) => this.thumbs.b[k]), ...(t.units || []).map((k) => this.thumbs.u[k])].map((s) => `<img src="${s}">`).join('');
      c.innerHTML = `<h4>${t.name}</h4><div class="ul">${ul}</div><div style="font-size:12px;color:var(--dim)">${t.desc}</div>` +
        (done ? '<div class="ok" style="margin-top:6px;font-weight:700">✓ Tamamlandı</div>' : `<div class="cost">${this.costHtml(t.cost)}</div>`);
      if (!done) {
        const b = el('button', 'btn acc', lock ? `Önce: ${TECH.find((q) => q.id === t.req).name}` : 'Araştır');
        b.disabled = lock || !g.canAfford(t.cost);
        b.addEventListener('click', () => {
          if (g.research(t.id)) { this.app.audio.play('research'); this.showResearch(); this.renderCards(); }
        });
        c.appendChild(b);
      }
      box.appendChild(c);
    }
  }

  showArmy() {
    this.modalKind = 'army';
    const g = this.game;
    const mine = g.units.filter((u) => u.faction === 0);
    const counts = {};
    for (const u of mine) counts[u.type] = (counts[u.type] || 0) + 1;
    const body = this.openModal(`<h2>🎖 Ordu Komutanlığı</h2>
      <p>${mine.length ? 'Birimlerin hazır. Bir rakip üsse saldırı emri ver ya da üssü savunmaları için geri çağır.' : 'Henüz birimin yok. <b>Araç Fabrikası</b> kurup birim üret (İleri Elektronik araştırması gerekir).'}</p>
      <div class="army">${Object.entries(counts).map(([k, n]) => `<span><img src="${this.thumbs.u[k]}">${n}× ${UNITS[k].name}</span>`).join('')}</div>
      <div id="rivals"></div>
      <div class="btnrow"><button class="btn" id="recall">🛡 Tümünü Geri Çağır</button></div>`);
    const rv = body.querySelector('#rivals');
    for (const r of g.rivals) {
      const hq = g.buildings.get(r.hq);
      const row = el('div', 'rv');
      const col = '#' + r.color.toString(16).padStart(6, '0');
      row.innerHTML = `<div class="dot" style="background:${col}"></div><div class="g"><b>${r.name}</b><br><small style="color:var(--dim)">${r.alive ? `Karargâh: ${hq ? Math.ceil(hq.hp / hq.maxHp * 100) : 0}% • ${[...g.buildings.values()].filter((b) => b.faction === r.id && b.type.startsWith('turret')).length} taret` : 'Yok edildi'}</small></div>`;
      if (r.alive) {
        const a = el('button', 'btn acc', '⚔ Saldır');
        a.style.flex = '0 0 auto';
        a.disabled = !mine.length;
        a.addEventListener('click', () => this.attack(r.id));
        const look = el('button', 'btn', '👁');
        look.style.flex = '0 0 auto';
        look.addEventListener('click', () => { this.closeModal(); this.app.focusTile(r.x + 1.5, r.y + 1.5); });
        row.append(look, a);
      }
      rv.appendChild(row);
    }
    body.querySelector('#recall').addEventListener('click', () => { g.commandRecall(); this.toast('Ordu üsse dönüyor', 'info'); this.closeModal(); });
  }
  attack(id) {
    const n = this.game.commandAttack(id);
    const r = this.game.rivals.find((q) => q.id === id);
    if (!n) { this.toast('Saldıracak birimin yok', 'warn'); return; }
    this.toast(`${n} birim ${r.name} üssüne saldırıyor!`, 'warn');
    this.closeModal();
    this.app.audio.play('alarm');
  }

  showMenu() {
    this.modalKind = 'menu';
    this.app.setSpeed(0, true);
    const q = this.app.quality;
    const body = this.openModal(`<h2>☰ Menü</h2>
      <div class="btnrow"><button class="btn acc" id="m-resume">▶ Devam</button><button class="btn" id="m-save">💾 Kaydet</button></div>
      <div class="btnrow"><button class="btn" id="m-help">❓ Nasıl Oynanır</button><button class="btn red" id="m-new">⟲ Yeni Oyun</button></div>
      <p style="margin-top:14px"><b>Grafik Kalitesi</b> <small style="color:var(--dim)">(değişiklik oyunu yeniden yükler, ilerleme kaydedilir)</small></p>
      <div class="opts" id="m-q">${['low', 'medium', 'high'].map((k) => `<button data-q="${k}" class="${q === k ? 'on' : ''}">${{ low: 'Düşük', medium: 'Orta', high: 'Yüksek' }[k]}</button>`).join('')}</div>
      <p><b>Ses</b></p>
      <div class="opts" id="m-snd"><button data-s="1" class="${this.app.audio.enabled ? 'on' : ''}">Açık</button><button data-s="0" class="${!this.app.audio.enabled ? 'on' : ''}">Kapalı</button></div>`);
    body.querySelector('#m-resume').addEventListener('click', () => this.closeModal());
    body.querySelector('#m-save').addEventListener('click', () => { this.app.save(); this.toast('Oyun kaydedildi', 'good'); });
    body.querySelector('#m-help').addEventListener('click', () => this.showHelp());
    body.querySelector('#m-new').addEventListener('click', () => {
      if (confirm('Mevcut oyun silinecek. Emin misin?')) this.app.newGame();
    });
    body.querySelectorAll('#m-q button').forEach((b) => b.addEventListener('click', () => this.app.setQuality(b.dataset.q)));
    body.querySelectorAll('#m-snd button').forEach((b) => b.addEventListener('click', () => {
      this.app.audio.setEnabled(b.dataset.s === '1'); localStorage.setItem('ds_sound', b.dataset.s);
      body.querySelectorAll('#m-snd button').forEach((x) => x.classList.toggle('on', x === b));
    }));
  }
  showHelp() {
    this.modalKind = 'help';
    this.openModal(`<h2>❓ Nasıl Oynanır</h2>
      <p><b>Amaç:</b> Üssünü kur, sanayini büyüt, gece gelen saldırılara dayan ve iki rakip üssü (Kızıl Lejyon, Pas Klanı) yok et.</p>
      <p><b>1. Madencilik:</b> Cevher yataklarının (demir: pas rengi, bakır: yeşil, kömür: siyah, taş: gri, kuvars: kristal) üzerine <b>Maden Matkabı</b> kur. Matkap cevheri <b>ok yönünde</b> önüne bırakır.</p>
      <p><b>2. Taşıma:</b> <b>Konveyör</b> seçip parmağını sürükleyerek hat çiz. Hat, çizdiğin yönde akar. Ana Üs'e giren her şey depoya eklenir.</p>
      <p><b>3. İşleme:</b> Cevheri <b>Eritme Fırını</b>'na sok (tarif kendiliğinden seçilir), çıkanı konveyörle üsse taşı. <b>Montaj Makinesi</b> ve <b>Dökümhane</b>'de tarifi bilgi panelinden seç. Birden fazla girdi için konveyörleri yan taraflardan bağla.</p>
      <p><b>4. Enerji:</b> Ana Üs 30 kW verir. Fazlası için <b>Kömür Jeneratörü</b>'ne kömür taşı ya da <b>Güneş Paneli</b> kur. Enerji yetmezse makineler yavaşlar.</p>
      <p><b>5. Savunma:</b> Her gece rakipler saldırır. <b>Taret</b> ve <b>Beton Duvar</b> kur. Makineli ve obüs taretleri depodan <b>mühimmat</b> harcar – mühimmat üretimini ihmal etme!</p>
      <p><b>6. Araştırma ve Ordu:</b> Malzeme biriktirip araştırma yap. <b>Araç Fabrikası</b>'nda robot, tank ve dron üret; Ordu menüsünden rakip üslere saldır. Karargâhlarını yıkınca ganimet kazanırsın.</p>
      <p><b>Kontroller:</b> Tek parmak: kaydır • İki parmak: yakınlaştır/döndür • Bir yapıya dokun: bilgi paneli • ⟳ ile yerleştirme yönünü çevir.</p>`);
  }
  showEnd(won) {
    const g = this.game;
    this.modalKind = 'end';
    const body = this.openModal(`<div class="end"><h2 style="color:${won ? 'var(--good)' : 'var(--bad)'}">${won ? 'ZAFER!' : 'ÜS DÜŞTÜ'}</h2>
      <p style="text-align:center">${won ? 'Tüm rakip üsleri yok ettin. Bölge artık senin!' : 'Ana Üs yok edildi.'}</p>
      <div class="stats"><div><b>${g.day()}</b>Gün</div><div><b>${g.wave.n}</b>Dalga</div><div><b>${g.stats.kills}</b>Düşman</div><div><b>${g.buildings.size}</b>Yapı</div></div>
      <div class="btnrow">${won ? '<button class="btn" id="e-cont">Oynamaya Devam</button>' : ''}<button class="btn acc" id="e-new">Yeni Oyun</button></div></div>`);
    body.querySelector('#e-new').addEventListener('click', () => this.app.newGame());
    body.querySelector('#e-cont')?.addEventListener('click', () => { g.state = 'play'; this.closeModal(); });
  }
}
