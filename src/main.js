import { Game } from './sim/game.js';
import { View } from './render/view.js';
import { renderThumbs } from './render/thumbs.js';
import { UI } from './ui.js';
import { Input } from './input.js';
import { Audio } from './audio.js';
import { PLAYER_HQ, TILE } from './config.js';

const SAVE_KEY = 'ds_save_v2';
const $ = (s) => document.querySelector(s);

function detectQuality() {
  const saved = localStorage.getItem('ds_quality');
  if (saved) return saved;
  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  return mobile ? 'medium' : 'high';
}

class App {
  constructor() {
    this.quality = detectQuality();
    this.audio = new Audio();
    this.audio.enabled = localStorage.getItem('ds_sound') !== '0';
    this.playing = false;
    this.last = performance.now();
    this.saveT = 45;
  }
  async boot() {
    const txt = $('#load-txt');
    const tick = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    txt.textContent = 'Modeller hazırlanıyor…'; await tick();
    this.thumbs = renderThumbs();
    txt.textContent = 'Dünya oluşturuluyor…'; await tick();
    this.view = new View($('#c'), this.quality);
    this.view.onSound = (kind, x, z, far) => this.sound(kind, x, z, far);
    this.view.onBoom = (x, z, s) => this.sound('boom', x, z, false, s);
    this.ui = new UI(this);
    this.input = new Input(this, $('#c'));
    const data = this.loadSave();
    if (data) {
      try { this.startGame(Game.load(data)); }
      catch (e) { console.error(e); this.startGame(this.freshGame()); }
      $('#mm-continue').classList.remove('hidden');
    } else this.startGame(this.freshGame());
    this.game.speed = 0;
    this.menuOrbit = true;
    this.bindMenu();
    $('#loading').classList.add('hidden');
    requestAnimationFrame((t) => this.loop(t));
    document.addEventListener('visibilitychange', () => { if (document.hidden && this.playing) this.save(); });
    window.addEventListener('pagehide', () => { if (this.playing) this.save(); });
  }
  freshGame(preset = 'mixed') {
    const g = new Game({ preset });
    g.setupNew();
    return g;
  }
  startGame(g) {
    this.game = g;
    this.view.attach(g);
    g.restore();
    g.computeFields();
    g.on('message', (m, k) => this.ui.toast(m, k));
    g.on('objective', () => { this.ui.updateObjective(); this.audio.play('research'); });
    g.on('alarm', () => this.audio.play('alarm'));
    g.on('gameover', (won) => { this.ui.showEnd(won); if (!won) localStorage.removeItem(SAVE_KEY); });
    g.on('remove', (b, destroyed) => { if (destroyed && b.faction === 0) this.ui.toast(`Yapı kaybedildi: ${b.type === 'hq' ? 'Ana Üs' : ''}`, 'bad'); });
    this.ui.init();
    this.focusTile(PLAYER_HQ.x + 1.5, PLAYER_HQ.y + 1.5);
    this.view.cam.dist = 44;
  }
  bindMenu() {
    $('#mm-new').addEventListener('click', () => {
      this.audio.init();
      this.ui.showNewGame(!!localStorage.getItem(SAVE_KEY));
    });
    $('#mm-continue').addEventListener('click', () => { this.audio.init(); this.play(); });
    $('#mm-help').addEventListener('click', () => this.ui.showHelp());
    $('#mm-settings').addEventListener('click', () => {
      const body = this.ui.openModal(`<h2>Grafik Ayarları</h2><p>Düşük ayar eski telefonlarda daha akıcı çalışır. Yüksek ayar gölgeler, ışıma (bloom) ve yoğun çim içerir.</p>
        <div class="opts">${['low', 'medium', 'high'].map((k) => `<button data-q="${k}" class="${this.quality === k ? 'on' : ''}">${{ low: 'Düşük', medium: 'Orta', high: 'Yüksek' }[k]}</button>`).join('')}</div>
        <p><b>Gece Aydınlığı</b> – gece ekranı karanlık buluyorsan “Aydınlık” seç.</p>
        <div class="opts">${this.ui.nightOpts()}</div>`);
      body.querySelectorAll('button[data-q]').forEach((b) => b.addEventListener('click', () => this.setQuality(b.dataset.q)));
      this.ui.bindNightOpts(body);
    });
  }
  play() {
    $('#mainmenu').classList.add('hidden');
    $('#hud').classList.remove('hidden');
    this.playing = true;
    this.menuOrbit = false;
    this.setSpeed(1);
    this.focusTile(PLAYER_HQ.x + 1.5, PLAYER_HQ.y + 1.5);
    this.view.cam.dist = 40; this.view.cam.yaw = 0; this.view.cam.pitch = 0.92;
    if (this.game.objective === 0 && this.game.time < 5) {
      setTimeout(() => this.ui.toast('Hoş geldin Komutan! Sol üstteki görevleri takip et.', 'info'), 600);
    }
  }
  newGame(preset = 'mixed') {
    localStorage.removeItem(SAVE_KEY);
    this.ui.closeModal();
    this.select(null);
    this.input.setTool(null);
    this.startGame(this.freshGame(preset));
    this.play();
    this.save();
  }
  loadSave() {
    try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  }
  save() {
    if (!this.game || this.game.state === 'lost') return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.game.serialize())); } catch (e) { console.warn('kayıt başarısız', e); }
  }
  setQuality(q) {
    if (this.playing) this.save();
    localStorage.setItem('ds_quality', q);
    location.reload();
  }
  setNight(m) {
    this.view.setNightMode(m);
    localStorage.setItem('ds_night', String(m));
  }
  setSpeed(s, temp = false) {
    this.game.speed = s;
    this.ui.setSpeedButtons(s);
    if (!temp) this.prevSpeed = s;
  }
  onModalClose() {
    if (this.playing && this.game.speed === 0 && this.prevSpeed) this.setSpeed(this.prevSpeed);
  }
  select(sel) {
    this.view.select(sel);
    this.ui.showInfo(sel);
  }
  focusTile(x, y) { this.view.cam.tx = x * TILE; this.view.cam.tz = y * TILE; }
  sound(kind, x, z, far, s = 1) {
    if (!this.playing) return;
    const c = this.view.cam;
    const d = Math.hypot(x - c.tx, z - c.tz);
    const vol = Math.max(0, 1 - d / (c.dist * 2.2)) * Math.min(1, 40 / c.dist) * (kind === 'boom' ? Math.min(1.4, 0.5 + s * 0.4) : 1);
    if (!far || kind === 'boom') this.audio.play(kind, vol);
  }
  loop(t) {
    const dt = Math.min(0.1, (t - this.last) / 1000);
    this.last = t;
    if (this.game) {
      if (this.playing) {
        this.game.update(dt);
        this.input.update(dt);
        this.ui.updateHud(dt);
        this.saveT -= dt;
        if (this.saveT <= 0) { this.saveT = 45; if (this.game.state === 'play') this.save(); }
      } else if (this.menuOrbit) {
        this.view.cam.yaw += dt * 0.05;
        this.view.cam.dist = 52; this.view.cam.pitch = 0.62;
        // menüde zaman akmaya devam etsin (gün ışığı)
        this.game.time += dt * 2;
      }
      this.view.render(dt);
    }
    requestAnimationFrame((tt) => this.loop(tt));
  }
}

const app = new App();
window.__app = app;
app.boot().catch((e) => {
  console.error(e);
  $('#load-txt').textContent = 'Hata: ' + e.message;
});
