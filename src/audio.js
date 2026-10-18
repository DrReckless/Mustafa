// WebAudio ile sentezlenen ses efektleri (harici dosya yok)
export class Audio {
  constructor() {
    this.ctx = null; this.enabled = true; this.vol = 0.6;
    this.last = {};
  }
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.gain.value = this.vol;
      const comp = this.ctx.createDynamicsCompressor();
      this.master.connect(comp); comp.connect(this.ctx.destination);
      const len = this.ctx.sampleRate * 1.5;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.ambient();
    } catch { this.ctx = null; }
  }
  resume() { this.ctx?.state === 'suspended' && this.ctx.resume(); }
  setEnabled(v) { this.enabled = v; if (this.master) this.master.gain.value = v ? this.vol : 0; }
  throttle(key, ms) {
    const t = performance.now();
    if (this.last[key] && t - this.last[key] < ms) return false;
    this.last[key] = t; return true;
  }
  noiseBurst(dur, f0, f1, gain, type = 'lowpass', q = 1, delay = 0) {
    const c = this.ctx, t = c.currentTime + delay;
    const src = c.createBufferSource(); src.buffer = this.noise;
    const f = c.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(t, Math.random()); src.stop(t + dur + 0.05);
  }
  tone(dur, f0, f1, gain, type = 'sine', delay = 0) {
    const c = this.ctx, t = c.currentTime + delay;
    const o = c.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.05);
  }
  play(kind, vol = 1) {
    if (!this.ctx || !this.enabled || vol <= 0.02) return;
    switch (kind) {
      case 'bullet': if (this.throttle('b', 55)) { this.noiseBurst(0.07, 3500, 600, 0.35 * vol, 'bandpass', 0.8); this.tone(0.05, 180, 60, 0.15 * vol, 'square'); } break;
      case 'shell': if (this.throttle('s', 120)) { this.noiseBurst(0.35, 900, 80, 0.8 * vol); this.tone(0.25, 90, 35, 0.5 * vol); } break;
      case 'rocket': if (this.throttle('r', 150)) { this.noiseBurst(0.7, 2500, 300, 0.5 * vol, 'bandpass', 0.7); this.tone(0.4, 300, 90, 0.2 * vol, 'sawtooth'); } break;
      case 'laser': if (this.throttle('l', 90)) this.tone(0.16, 1800, 300, 0.12 * vol, 'sawtooth'); break;
      case 'boom': if (this.throttle('x', 70)) { this.noiseBurst(0.9, 1400, 40, 1.0 * vol); this.tone(0.6, 70, 25, 0.7 * vol); } break;
      case 'build': this.tone(0.08, 520, 400, 0.15, 'triangle'); this.noiseBurst(0.12, 2000, 300, 0.2, 'bandpass', 2, 0.03); break;
      case 'click': this.tone(0.04, 900, 700, 0.08, 'triangle'); break;
      case 'error': this.tone(0.15, 220, 180, 0.15, 'square'); break;
      case 'research': [523, 659, 784, 1046].forEach((f, i) => this.tone(0.3, f, f, 0.12, 'triangle', i * 0.09)); break;
      case 'alarm': for (let i = 0; i < 3; i++) this.tone(0.35, 880, 440, 0.18, 'sawtooth', i * 0.45); break;
      case 'demolish': this.noiseBurst(0.4, 1200, 100, 0.4); break;
    }
  }
  ambient() {
    // hafif rüzgar
    const c = this.ctx;
    const src = c.createBufferSource(); src.buffer = this.noise; src.loop = true;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380;
    const g = c.createGain(); g.gain.value = 0.05;
    const lfo = c.createOscillator(); lfo.frequency.value = 0.08;
    const lg = c.createGain(); lg.gain.value = 140;
    lfo.connect(lg); lg.connect(f.frequency);
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(); lfo.start();
  }
}
