import { ITEMS, ITEM_KEYS, BUILDINGS, RECIPES, UNITS, TECH, CATEGORIES, PURITY, MAP_TYPES } from './config.js';
import { RECIPES_OF } from './sim/game.js';
import { fmt } from './util.js';

const $ = (s) => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

export class UI {
  constructor(app) {
    this.app = app;
    this.thumbs = app.thumbs;
    this.cat = 'maden';
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
    $('#st-power').addEventListener('click', () => this.showPower());
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
    const pt = `${Math.round(p.demand)}/${Math.round(p.supply)} kW` + (p.storeCap > 0 ? ` 🔋${Math.round(p.store / p.storeCap * 100)}%` : '') + (p.unpowered ? ` ⚠${p.unpowered}` : '');
    const ptEl = $('#power-txt'); if (ptEl.textContent !== pt) ptEl.textContent = pt;
    const bar = $('#power-bar');
    bar.style.width = `${Math.min(100, p.supply > 0 ? (p.demand / Math.max(1, p.cap || p.supply)) * 100 : 0)}%`;
    bar.style.background = p.worst < 1 ? 'var(--bad)' : p.demand > p.supply * 0.85 ? 'var(--acc)' : 'var(--good)';
    $('#st-power').style.color = p.worst < 1 || p.unpowered ? 'var(--bad)' : '';
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
    if (own && d.machine) {
      const rec = el('div', 'recipes');
      for (const rk of RECIPES_OF[b.type]) {
        const r = RECIPES[rk];
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
      if (d.mine || d.machine || d.speed || d.range || b.type === 'factory' || b.type === 'splitter') {
        const rot = el('button', 'btn', '⟳ Döndür');
        rot.addEventListener('click', () => { g.rotate(b); this.app.audio.play('click'); });
        r.appendChild(rot);
      }
      if (d.power || d.gen || d.store) {
        const tg = el('button', 'btn', b.off ? '▶ Aç' : '⏸ Kapat');
        tg.addEventListener('click', () => { g.toggle(b); this.app.audio.play('click'); tg.textContent = b.off ? '▶ Aç' : '⏸ Kapat'; this.refreshInfo(); });
        r.appendChild(tg);
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
    const pr = g.pr(t);
    if (b.faction !== 0) { dyn.innerHTML = h; return; }
    const net = g.pnet.nets[b.net];
    if (d.power && !d.node) {
      h += b.net < 0 ? `<div class="row"><span>Elektrik</span><b class="no">Bağlantı yok – yakına Elektrik Direği kur</b></div>`
        : `<div class="row"><span>Elektrik</span><b class="${net.ratio < 1 ? 'no' : 'ok'}">${d.power} kW • şebeke %${Math.round(net.ratio * 100)}</b></div>`;
    }
    if (b.off) h += st('Kapalı', '');
    else if (d.mine) {
      const rate = 60 / 2.2 * PURITY[b.purity].mul * d.speed;
      h += `<div class="row"><span>Yatak</span><b>${this.icon(b.ore)} ${ITEMS[b.ore].name} (${PURITY[b.purity].name})</b></div>`;
      h += `<div class="row"><span>Hız</span><b>${rate.toFixed(0)} / dk</b></div>`;
      h += b.outBuf.length >= 2 ? st('Çıkış tıkalı – önüne konveyör bağla', 'no') : b.net < 0 ? st('Elektrik yok', 'no') : pr < 1 ? st('Düşük enerji', 'no') : st('Çalışıyor', 'ok');
      h += `<div class="pbar"><i style="width:${b.progress * 100}%"></i></div>`;
    } else if (d.machine) {
      const r = RECIPES[b.recipe];
      if (!r) h += st('Malzeme bekleniyor (tarif kendiliğinden seçilir)', '');
      else {
        h += `<div class="row"><span>Girdi</span><span class="buf">${Object.keys(r.inp).map((k) => `<span>${this.icon(k)}${b.inBuf[k] || 0}/${r.inp[k]}</span>`).join('')}</span></div>`;
        h += `<div class="row"><span>Çıktı</span><span class="buf">${Object.keys(r.out).map((k) => `<span>${this.icon(k)}${b.outBuf.filter((x) => x === k).length}</span>`).join('')}</span></div>`;
        h += `<div class="row"><span>Hız</span><b>${Object.entries(r.out).map(([k, n]) => `${(60 / r.time * n).toFixed(0)} ${ITEMS[k].name}`).join(' + ')} / dk</b></div>`;
        if (b.outBuf.length >= 6) h += st('Çıkış tıkalı – önüne konveyör bağla', 'no');
        else if (b.working) h += b.net < 0 ? st('Elektrik yok', 'no') : pr < 1 ? st('Düşük enerji', 'no') : st('Üretiyor', 'ok');
        else h += st('Girdi bekleniyor', '');
        h += `<div class="pbar"><i style="width:${b.progress * 100}%"></i></div>`;
      }
    } else if (d.fuel) {
      h += `<div class="row"><span>Yakıt</span><b>${this.icon(d.fuel)} ${b.fuel}${b.burn > 0 ? ` • ${Math.ceil(b.burn)} sn` : ''}</b></div>`;
      h += b.working ? st(`Çalışıyor (+${d.gen} kW)`, 'ok') : b.fuel > 0 ? st('Beklemede (ihtiyaç yok)', '') : st(`${ITEMS[d.fuel].name} gerekli`, 'no');
    } else if (d.store) {
      h += `<div class="row"><span>Dolum</span><b>${Math.round(b.charge)} / ${d.store} kJ (%${Math.round(b.charge / d.store * 100)})</b></div>`;
      h += `<div class="pbar"><i style="width:${b.charge / d.store * 100}%;background:var(--good)"></i></div>`;
      h += b.working ? st(`Enerji veriyor (en çok ${d.rate} kW)`, 'ok') : b.charge >= d.store ? st('Dolu', 'ok') : st('Şarj oluyor / beklemede', '');
    } else {
      switch (b.type) {
        case 'solar':
          h += st(b.out > 0.5 ? `Üretiyor (${Math.round(b.out)} kW)` : 'Gece – üretim yok', b.out > 0.5 ? 'ok' : '');
          break;
        case 'wind':
          h += `<div class="row"><span>Rüzgar</span><b>%${Math.round(g.wind * 100)}</b></div>`;
          h += st(`Üretiyor (${Math.round(b.out || 0)} kW)`, 'ok');
          break;
        case 'pole': case 'pole_big':
          h += `<div class="row"><span>Kapsama / bağlantı</span><b>${d.node.cover} / ${d.node.link} karo</b></div>`;
          if (net) h += `<div class="row"><span>Şebeke</span><b class="${net.ratio < 1 ? 'no' : 'ok'}">${Math.round(net.demand)}/${Math.round(net.supply)} kW • ${net.nodes.length} düğüm • ${net.consumers.length} makine</b></div>`;
          if (net && !net.hasHq && !net.nodes.some((n) => BUILDINGS[n.type].gen)) h += st('Üretim kaynağına bağlı değil', 'no');
          break;
        case 'lamp':
          h += st(b.working ? 'Aydınlatıyor' : 'Gündüz – kapalı', b.working ? 'ok' : '');
          break;
        case 'factory':
          h += `<div class="row"><span>Kuyruk</span><span class="buf">${b.queue.map((k) => `<span><img src="${this.thumbs.u[k]}"></span>`).join('') || '—'}</span></div>`;
          h += `<div class="pbar"><i style="width:${b.progress * 100}%"></i></div>`;
          break;
        case 'hq': {
          const n = g.units.filter((u) => u.faction === 0).length;
          h += `<div class="row"><span>Ordu</span><b>${n} birim</b></div>`;
          h += `<div class="row"><span>Temel enerji</span><b>30 kW</b></div>`;
          if (net) h += `<div class="row"><span>Ana şebeke</span><b class="${net.ratio < 1 ? 'no' : 'ok'}">${Math.round(net.demand)}/${Math.round(net.supply)} kW</b></div>`;
          break;
        }
        case 'splitter':
          break;
        default:
          if (b.items) h += `<div class="row"><span>Taşınan</span><span class="buf">${b.items.map((i) => `<span>${this.icon(i.t)}</span>`).join('') || '—'}</span></div><div class="row"><span>Hız</span><b>${Math.round(1.8 * d.speed / 0.34 * 60)} / dk</b></div>`;
      }
      if (d.range) {
        const item = d.ammoItem || 'ammo';
        h += `<div class="row"><span>Hasar / Menzil</span><b>${d.dmg} / ${g.turretRange(b, g.isNight()).toFixed(1)}${b.lit ? ' 💡' : ''}</b></div>`;
        if (d.ammo) h += `<div class="row"><span>${ITEMS[item].name} (depo)</span><b class="${g.stock[item] < 10 ? 'no' : ''}">${this.icon(item)} ${Math.floor(g.stock[item])}</b></div>`;
        h += b.noAmmo ? st(`${ITEMS[item].name} yok!`, 'no') : b.target ? st('Ateş ediyor', 'no') : st('Nöbette', 'ok');
      }
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
      const lock = !g.techAvailable(t);
      const c = el('div', 'tcard' + (done ? ' done' : lock ? ' lock' : ''));
      const ul = [...t.unlocks.map((k) => [this.thumbs.b[k], BUILDINGS[k].name]), ...(t.units || []).map((k) => [this.thumbs.u[k], UNITS[k].name])].map(([s, n]) => `<img src="${s}" title="${n}">`).join('');
      c.innerHTML = `<h4>${t.name}</h4><div class="ul">${ul}</div><div style="font-size:12px;color:var(--dim)">${t.desc}</div>` +
        (done ? '<div class="ok" style="margin-top:6px;font-weight:700">✓ Tamamlandı</div>' : `<div class="cost">${this.costHtml(t.cost)}</div>`);
      if (!done) {
        const miss = g.techReqs(t).filter((r) => !g.researched.has(r)).map((r) => TECH.find((q) => q.id === r).name).join(', ');
        const b = el('button', 'btn acc', lock ? `Önce: ${miss}` : 'Araştır');
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
      <p><b>Gece Aydınlığı</b></p>
      <div class="opts" id="m-night">${this.nightOpts()}</div>
      <p><b>Ses</b></p>
      <div class="opts" id="m-snd"><button data-s="1" class="${this.app.audio.enabled ? 'on' : ''}">Açık</button><button data-s="0" class="${!this.app.audio.enabled ? 'on' : ''}">Kapalı</button></div>`);
    body.querySelector('#m-resume').addEventListener('click', () => this.closeModal());
    body.querySelector('#m-save').addEventListener('click', () => { this.app.save(); this.toast('Oyun kaydedildi', 'good'); });
    body.querySelector('#m-help').addEventListener('click', () => this.showHelp());
    body.querySelector('#m-new').addEventListener('click', () => {
      this.showNewGame(true);
    });
    body.querySelectorAll('#m-q button').forEach((b) => b.addEventListener('click', () => this.app.setQuality(b.dataset.q)));
    this.bindNightOpts(body);
    body.querySelectorAll('#m-snd button').forEach((b) => b.addEventListener('click', () => {
      this.app.audio.setEnabled(b.dataset.s === '1'); localStorage.setItem('ds_sound', b.dataset.s);
      body.querySelectorAll('#m-snd button').forEach((x) => x.classList.toggle('on', x === b));
    }));
  }
  nightOpts() {
    const m = this.app.view.nightMode;
    return ['Karanlık', 'Normal', 'Aydınlık'].map((n, i) => `<button data-n="${i}" class="${m === i ? 'on' : ''}">${n}</button>`).join('');
  }
  bindNightOpts(body) {
    body.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => {
      this.app.setNight(+b.dataset.n);
      body.querySelectorAll('[data-n]').forEach((x) => x.classList.toggle('on', x === b));
    }));
  }
  showNewGame(confirmLoss) {
    this.modalKind = 'newgame';
    const body = this.openModal(`<h2>🗺 Yeni Oyun – Harita Seç</h2>
      ${confirmLoss ? '<p class="no">Mevcut oyunun silinecek.</p>' : ''}
      <div class="maps">${MAP_TYPES.map((m) => `<button class="mapc" data-m="${m.id}"><b>${m.name}</b><small>${m.desc}</small></button>`).join('')}</div>`);
    body.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => this.app.newGame(b.dataset.m)));
  }
  showPower() {
    this.modalKind = 'power';
    const g = this.game;
    if (g.gridDirty) g.rebuildGrid();
    const p = g.power;
    const nets = g.pnet.nets.filter((n) => n.consumers.length || n.nodes.length > 1 || n.hasHq);
    const src = {};
    for (const n of g.pnet.nets) for (const b of n.nodes) {
      const d = BUILDINGS[b.type];
      if (!d.gen) continue;
      const out = b.off ? 0 : b.type === 'hq' ? d.gen : (b.type === 'solar' || b.type === 'wind') ? (b.out || 0) : b.working ? d.gen : 0;
      const e = (src[b.type] ||= { n: 0, out: 0, cap: 0 });
      e.n++; e.out += out; e.cap += d.gen;
    }
    const use = {};
    for (const n of g.pnet.nets) for (const b of n.consumers) {
      const e = (use[b.type] ||= { n: 0, kw: 0 });
      e.n++; if (b.working && !b.off) e.kw += BUILDINGS[b.type].power;
    }
    const row = (k, a, b) => `<div class="prow"><img src="${this.thumbs.b[k]}"><span>${BUILDINGS[k].name}</span><b>${a}</b><small>${b}</small></div>`;
    this.openModal(`<h2>⚡ Enerji Şebekesi</h2>
      <p>Toplam: <b>${Math.round(p.demand)} kW</b> tüketim / <b>${Math.round(p.supply)} kW</b> üretim${p.storeCap ? ` • Akü: <b>${Math.round(p.store / 1000)}/${Math.round(p.storeCap / 1000)} MJ</b>` : ''} • Rüzgar: %${Math.round(g.wind * 100)}</p>
      ${p.unpowered ? `<p class="no">⚠ ${p.unpowered} yapı hiçbir şebekeye bağlı değil. Yanlarına <b>Elektrik Direği</b> kur (yapıya dokununca kapsama halkaları görünür).</p>` : ''}
      <div class="pcols"><div><h4>Üretim</h4>${Object.entries(src).map(([k, e]) => row(k, `${Math.round(e.out)} kW`, `${e.n} adet • en çok ${e.cap} kW`)).join('') || '<small>—</small>'}</div>
      <div><h4>Tüketim</h4>${Object.entries(use).sort((a, b) => b[1].kw - a[1].kw).map(([k, e]) => row(k, `${Math.round(e.kw)} kW`, `${e.n} adet`)).join('') || '<small>—</small>'}</div></div>
      <h4>Şebekeler (${nets.length})</h4>
      ${nets.map((n, i) => `<div class="prow"><span>${n.hasHq ? 'Ana şebeke' : `Şebeke ${i + 1}`}</span><b class="${n.ratio < 1 ? 'no' : 'ok'}">%${Math.round(n.ratio * 100)}</b><small>${Math.round(n.demand)}/${Math.round(n.supply)} kW • ${n.nodes.length} düğüm • ${n.consumers.length} makine</small></div>`).join('')}
      <p style="font-size:12px;color:var(--dim)">İpucu: Enerji yetmezse o şebekedeki makineler yavaşlar. Gereksiz makineleri bilgi panelinden <b>Kapat</b>, geceler için <b>Akü Deposu</b> ya da <b>Rüzgar Türbini</b> kur.</p>`);
  }
  showHelp() {
    this.modalKind = 'help';
    this.openModal(`<h2>❓ Nasıl Oynanır</h2>
      <p><b>Amaç:</b> Üssünü kur, sanayini büyüt, saldırılara dayan ve üç rakip üssü (Kızıl Lejyon, Pas Klanı, Kara Sancak) yok et.</p>
      <p><b>1. Madencilik:</b> Cevher yataklarının üzerine <b>Maden Matkabı</b> kur (demir: pas rengi, bakır: yeşil, kömür: siyah, taş: gri, kuvars: kristal, boksit: kızıl, kükürt: sarı, uranyum: parlayan yeşil). Petrol sızıntılarına (siyah gölcük) <b>Petrol Pompası</b> gerekir. Matkap çıkardığını <b>ok yönüne</b> bırakır.</p>
      <p><b>2. Taşıma:</b> <b>Konveyör</b> seçip parmağını sürükleyerek hat çiz. Hat, çizdiğin yönde akar. Ana Üs'e giren her şey depoya eklenir. Hızlı konveyörü eski hattın üstüne çizersen yükseltir.</p>
      <p><b>3. Eritme:</b> Her kaynağın kendi fırını var: <b>Demir Fırını</b>, <b>Bakır İzabe Fırını</b>, <b>Taş Fırını</b> (beton/cam), <b>Ark Fırını</b> (silikon), <b>Alüminyum Tesisi</b>, <b>Dökümhane</b> (çelik/alaşım). Fırınlara kömür de verirsen kok tarifleriyle daha verimli üretirsin.</p>
      <p><b>4. Montaj:</b> <b>Montaj Makinesi</b>, <b>İleri Montaj Hattı</b>, <b>Kimya Tesisi</b>, <b>Rafineri</b> ve <b>Zenginleştirme</b> tesislerinde tarifi bilgi panelinden seç. Birden fazla girdi için konveyörleri farklı yanlardan bağla.</p>
      <p><b>5. Enerji:</b> Makineler ancak bir şebekeye bağlıysa çalışır. Ana Üs 10 karo çevresine 30 kW verir. Uzaklara <b>Elektrik Direği</b> ile ulaş. Kömür/yakıt jeneratörü, güneş, rüzgar, akü ve nükleer reaktör kur. ⚡ göstergesine dokunarak şebeke raporunu aç.</p>
      <p><b>6. Savunma:</b> Rakipler düzenli saldırır. <b>Taret</b> ve <b>Duvar</b> kur. Makineli ve obüs taretleri depodan <b>mühimmat</b>, füze bataryası <b>füze</b> harcar. Gece <b>Projektör</b> ışığındaki taretler daha uzağa ateş eder.</p>
      <p><b>7. Araştırma ve Ordu:</b> Malzeme biriktirip araştırma yap. <b>Araç Fabrikası</b>'nda robot, tank ve dron üret; Ordu menüsünden üç rakip üsse saldır. Karargâhlarını yıkınca ganimet kazanırsın.</p>
      <p><b>Gece çok karanlıksa:</b> Menü → <b>Gece Aydınlığı</b> → Aydınlık seç ve üssüne projektör kur.</p>
      <p><b>Kontroller:</b> Tek parmak: kaydır • İki parmak: yakınlaştır/döndür • Bir yapıya dokun: bilgi paneli • ⟳ ile yerleştirme yönünü çevir.</p>`);
  }
  showEnd(won) {
    const g = this.game;
    this.modalKind = 'end';
    const body = this.openModal(`<div class="end"><h2 style="color:${won ? 'var(--good)' : 'var(--bad)'}">${won ? 'ZAFER!' : 'ÜS DÜŞTÜ'}</h2>
      <p style="text-align:center">${won ? 'Tüm rakip üsleri yok ettin. Bölge artık senin!' : 'Ana Üs yok edildi.'}</p>
      <div class="stats"><div><b>${g.day()}</b>Gün</div><div><b>${g.wave.n}</b>Dalga</div><div><b>${g.stats.kills}</b>Düşman</div><div><b>${g.buildings.size}</b>Yapı</div></div>
      <div class="btnrow">${won ? '<button class="btn" id="e-cont">Oynamaya Devam</button>' : ''}<button class="btn acc" id="e-new">Yeni Oyun</button></div></div>`);
    body.querySelector('#e-new').addEventListener('click', () => this.showNewGame(false));
    body.querySelector('#e-cont')?.addEventListener('click', () => { g.state = 'play'; this.closeModal(); });
  }
}
