import * as THREE from 'three';
import { getTextures } from './textures.js';
import { FramePool } from './pool.js';

// Kamera yönlü parçacık sistemi (tek çizim çağrısı)
class Particles {
  constructor(scene, additive, max) {
    this.max = max; this.n = 0;
    this.pos = new Float32Array(max * 3); this.vel = new Float32Array(max * 3);
    this.life = new Float32Array(max); this.maxLife = new Float32Array(max);
    this.size = new Float32Array(max); this.grow = new Float32Array(max);
    this.col = new Float32Array(max * 3); this.alpha0 = new Float32Array(max);
    this.rot = new Float32Array(max); this.drag = new Float32Array(max); this.grav = new Float32Array(max);
    const geo = new THREE.InstancedBufferGeometry();
    const base = new THREE.PlaneGeometry(1, 1);
    geo.index = base.index;
    geo.setAttribute('position', base.attributes.position);
    geo.setAttribute('uv', base.attributes.uv);
    this.aPos = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.aCol = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4).setUsage(THREE.DynamicDrawUsage);
    this.aSR = new THREE.InstancedBufferAttribute(new Float32Array(max * 2), 2).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aPos', this.aPos); geo.setAttribute('aCol', this.aCol); geo.setAttribute('aSR', this.aSR);
    geo.instanceCount = 0;
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: getTextures().smoke } },
      vertexShader: `
        attribute vec3 aPos; attribute vec4 aCol; attribute vec2 aSR;
        varying vec2 vUv; varying vec4 vCol;
        void main(){
          vUv = uv; vCol = aCol;
          vec4 mv = modelViewMatrix * vec4(aPos, 1.0);
          float c = cos(aSR.y), s = sin(aSR.y);
          vec2 p = vec2(c*position.x - s*position.y, s*position.x + c*position.y) * aSR.x;
          mv.xy += p;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform sampler2D map; varying vec2 vUv; varying vec4 vCol;
        void main(){
          vec4 t = texture2D(map, vUv);
          gl_FragColor = vec4(vCol.rgb, t.a * vCol.a);
          #include <colorspace_fragment>
        }`,
      transparent: true, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = additive ? 11 : 10;
    scene.add(this.mesh);
    this.geo = geo;
  }
  emit(x, y, z, vx, vy, vz, life, size, grow, r, g, b, a, drag = 1, grav = 0) {
    let i = this.n;
    if (i >= this.max) {
      // en yaşlıyı değiştir
      i = Math.floor(Math.random() * this.max);
    } else this.n++;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx; this.vel[i * 3 + 1] = vy; this.vel[i * 3 + 2] = vz;
    this.life[i] = 0; this.maxLife[i] = life; this.size[i] = size; this.grow[i] = grow;
    this.col[i * 3] = r; this.col[i * 3 + 1] = g; this.col[i * 3 + 2] = b; this.alpha0[i] = a;
    this.rot[i] = Math.random() * 6.28; this.drag[i] = drag; this.grav[i] = grav;
  }
  update(dt) {
    let n = this.n;
    for (let i = 0; i < n; i++) {
      this.life[i] += dt;
      if (this.life[i] >= this.maxLife[i]) {
        // son elemanla değiştir
        n--;
        const j = n;
        if (i !== j) {
          for (let k = 0; k < 3; k++) { this.pos[i * 3 + k] = this.pos[j * 3 + k]; this.vel[i * 3 + k] = this.vel[j * 3 + k]; this.col[i * 3 + k] = this.col[j * 3 + k]; }
          this.life[i] = this.life[j]; this.maxLife[i] = this.maxLife[j]; this.size[i] = this.size[j]; this.grow[i] = this.grow[j];
          this.alpha0[i] = this.alpha0[j]; this.rot[i] = this.rot[j]; this.drag[i] = this.drag[j]; this.grav[i] = this.grav[j];
          i--;
        }
        continue;
      }
      const d = Math.pow(this.drag[i], dt);
      this.vel[i * 3] *= d; this.vel[i * 3 + 1] = this.vel[i * 3 + 1] * d - this.grav[i] * dt; this.vel[i * 3 + 2] *= d;
      this.pos[i * 3] += this.vel[i * 3] * dt; this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt; this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      if (this.pos[i * 3 + 1] < 0.05) { this.pos[i * 3 + 1] = 0.05; this.vel[i * 3 + 1] *= -0.3; }
    }
    this.n = n;
    const P = this.aPos.array, Cc = this.aCol.array, S = this.aSR.array;
    for (let i = 0; i < n; i++) {
      const t = this.life[i] / this.maxLife[i];
      P[i * 3] = this.pos[i * 3]; P[i * 3 + 1] = this.pos[i * 3 + 1]; P[i * 3 + 2] = this.pos[i * 3 + 2];
      const fade = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9;
      Cc[i * 4] = this.col[i * 3]; Cc[i * 4 + 1] = this.col[i * 3 + 1]; Cc[i * 4 + 2] = this.col[i * 3 + 2];
      Cc[i * 4 + 3] = this.alpha0[i] * fade;
      S[i * 2] = this.size[i] + this.grow[i] * this.life[i];
      S[i * 2 + 1] = this.rot[i] + this.life[i] * 0.4;
    }
    this.geo.instanceCount = n;
    this.aPos.needsUpdate = this.aCol.needsUpdate = this.aSR.needsUpdate = true;
    this.aPos.addUpdateRange(0, n * 3); this.aCol.addUpdateRange(0, n * 4); this.aSR.addUpdateRange(0, n * 2);
  }
}

export class Effects {
  constructor(scene, quality) {
    this.scene = scene;
    const mx = quality === 'low' ? 500 : 1500;
    this.smoke = new Particles(scene, false, mx);
    this.fire = new Particles(scene, true, mx);
    // mermi izleri
    const tg = new THREE.BoxGeometry(1, 1, 1); tg.translate(0.5, 0, 0);
    const tm = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    this.tracerPool = new FramePool(scene, tg, tm, { color: true, cast: false, receive: false, order: 12 });
    this.tracers = [];
    const sg = new THREE.SphereGeometry(0.14, 8, 6);
    const sm = new THREE.MeshBasicMaterial({ color: 0xffc070, toneMapped: false });
    this.shellPool = new FramePool(scene, sg, sm, { cast: false, receive: false });
    const rg = new THREE.CylinderGeometry(0.07, 0.09, 0.7, 8); rg.rotateZ(-Math.PI / 2);
    this.rocketPool = new FramePool(scene, rg, new THREE.MeshStandardMaterial({ color: 0xd8d8d0, metalness: 0.6, roughness: 0.35 }), { cast: false, receive: false });
    this._a = new THREE.Vector3(); this._b = new THREE.Vector3(); this._x = new THREE.Vector3(1, 0, 0);
    // ışık havuzu
    this.lights = [];
    const nl = quality === 'low' ? 2 : 4;
    for (let i = 0; i < nl; i++) {
      const l = new THREE.PointLight(0xffa040, 0, 14, 2);
      l.userData.t = 0; scene.add(l); this.lights.push(l);
    }
    this.li = 0;
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._v = new THREE.Vector3(); this._s = new THREE.Vector3();
  }
  flash(x, y, z, intensity, color = 0xffa040, dur = 0.12) {
    const l = this.lights[this.li++ % this.lights.length];
    l.position.set(x, y, z); l.color.setHex(color);
    l.userData.i = intensity; l.userData.t = dur; l.userData.d = dur;
    l.intensity = intensity;
  }
  tracer(a, b, kind) {
    const col = kind === 'laser' ? [0.4, 3.5, 4.0] : kind === 'elaser' ? [4, 0.6, 0.4] : [4, 2.6, 0.9];
    this.tracers.push({ a: a.clone(), b: b.clone(), t: 0, d: kind.includes('laser') ? 0.14 : 0.06, w: kind.includes('laser') ? 0.09 : 0.05, col });
  }
  muzzle(p, kind) {
    if (kind === 'laser' || kind === 'elaser') {
      this.fire.emit(p.x, p.y, p.z, 0, 0, 0, 0.12, 0.5, 2, 0.4, 2.0, 2.5, 1);
      return;
    }
    const big = kind === 'shell';
    this.fire.emit(p.x, p.y, p.z, 0, 0.3, 0, big ? 0.15 : 0.06, big ? 1.1 : 0.5, 3, 3.0, 1.8, 0.6, 1);
    if (big) for (let i = 0; i < 4; i++) this.smoke.emit(p.x, p.y, p.z, (Math.random() - 0.5), 0.6, (Math.random() - 0.5), 1.2, 0.6, 1.2, 0.5, 0.48, 0.45, 0.5, 0.5);
  }
  explosion(x, z, size = 1) {
    const s = size;
    this.flash(x, 1.5, z, 30 * s, 0xff8a30, 0.35);
    for (let i = 0; i < 14 * s + 4; i++) {
      const a = Math.random() * 6.28, sp = (1 + Math.random() * 3) * s;
      this.fire.emit(x, 0.5 + Math.random() * s, z, Math.cos(a) * sp, 1 + Math.random() * 3 * s, Math.sin(a) * sp, 0.35 + Math.random() * 0.4, 0.6 * s, 2.5 * s, 3.2, 1.4, 0.4, 1, 0.1);
    }
    for (let i = 0; i < 10 * s + 3; i++) {
      const a = Math.random() * 6.28, sp = Math.random() * 1.6 * s;
      const g = 0.2 + Math.random() * 0.15;
      this.smoke.emit(x, 0.6 + Math.random() * s, z, Math.cos(a) * sp, 1 + Math.random() * 1.5, Math.sin(a) * sp, 2 + Math.random() * 2, 0.8 * s, 1.6 * s, g, g * 0.95, g * 0.9, 0.75, 0.6);
    }
    for (let i = 0; i < 10 * s; i++) {
      const a = Math.random() * 6.28, sp = 4 + Math.random() * 6;
      this.fire.emit(x, 0.6, z, Math.cos(a) * sp, 3 + Math.random() * 5, Math.sin(a) * sp, 0.6 + Math.random() * 0.5, 0.12, 0, 3, 2, 0.8, 1, 0.9, 12);
    }
  }
  chimney(x, y, z, dark = false) {
    const g = dark ? 0.18 : 0.55 + Math.random() * 0.1;
    this.smoke.emit(x + (Math.random() - 0.5) * 0.2, y, z + (Math.random() - 0.5) * 0.2, 0.25 + Math.random() * 0.2, 1.1 + Math.random() * 0.4, 0.1 + (Math.random() - 0.5) * 0.3,
      3 + Math.random() * 2, 0.35, 0.7, g, g, g * 1.02, dark ? 0.55 : 0.35, 0.8);
  }
  steam(x, y, z) {
    for (let i = 0; i < 2; i++) {
      const g = 0.82 + Math.random() * 0.1;
      this.smoke.emit(x + (Math.random() - 0.5) * 1.2, y, z + (Math.random() - 0.5) * 1.2, 0.3 + Math.random() * 0.2, 1.4 + Math.random() * 0.6, (Math.random() - 0.5) * 0.3,
        4 + Math.random() * 2, 1.0, 1.4, g, g, g * 1.03, 0.32, 0.85);
    }
  }
  dust(x, z, s = 1) {
    for (let i = 0; i < 8 * s; i++) {
      const a = Math.random() * 6.28, sp = 1 + Math.random() * 2;
      this.smoke.emit(x + Math.cos(a) * 0.6 * s, 0.2, z + Math.sin(a) * 0.6 * s, Math.cos(a) * sp, 0.3 + Math.random() * 0.5, Math.sin(a) * sp, 1 + Math.random(), 0.5 * s, 0.8 * s, 0.55, 0.48, 0.38, 0.5, 0.3);
    }
  }
  trail(x, y, z) {
    this.smoke.emit(x, y, z, (Math.random() - 0.5) * 0.3, 0.3, (Math.random() - 0.5) * 0.3, 0.8, 0.25, 0.6, 0.5, 0.44, 0.36, 0.25, 0.5);
  }
  update(dt, game, toWorld) {
    this.smoke.update(dt); this.fire.update(dt);
    for (const l of this.lights) {
      if (l.userData.t > 0) { l.userData.t -= dt; l.intensity = l.userData.i * Math.max(0, l.userData.t / l.userData.d); }
      else l.intensity = 0;
    }
    const m = this._m, q = this._q, v = this._v, s = this._s;
    this.tracerPool.begin();
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tr = this.tracers[i];
      tr.t += dt;
      if (tr.t > tr.d) { this.tracers.splice(i, 1); continue; }
      v.subVectors(tr.b, tr.a);
      const len = v.length();
      v.normalize();
      q.setFromUnitVectors(new THREE.Vector3(1, 0, 0), v);
      const f = 1 - tr.t / tr.d;
      s.set(len, tr.w, tr.w);
      m.compose(tr.a, q, s);
      this.tracerPool.push(m, tr.col[0] * f, tr.col[1] * f, tr.col[2] * f);
    }
    this.tracerPool.end();
    this.shellPool.begin(); this.rocketPool.begin();
    for (const p of game.projectiles) {
      const k = p.t / p.dur;
      if (p.kind === 'rocket') {
        const pos = (kk, o) => {
          const x = p.x + (p.tx - p.x) * kk, y = p.y + (p.ty - p.y) * kk;
          const w = toWorld(x, y);
          return o.set(w.x, 1 + Math.sin(kk * Math.PI) * (1.5 + p.dur * 3), w.z);
        };
        const a = pos(k, this._a), b = pos(Math.min(1, k + 0.03), this._b);
        v.subVectors(b, a); if (v.lengthSq() < 1e-6) v.set(1, 0, 0); v.normalize();
        q.setFromUnitVectors(this._x, v);
        m.compose(a, q, s.set(1, 1, 1));
        this.rocketPool.push(m);
        this.fire.emit(a.x - v.x * 0.4, a.y - v.y * 0.4, a.z - v.z * 0.4, -v.x, -v.y, -v.z, 0.12, 0.4, 1.2, 3.2, 1.6, 0.5, 1);
        if (Math.random() < 0.7) this.smoke.emit(a.x, a.y, a.z, (Math.random() - 0.5) * 0.3, 0.2, (Math.random() - 0.5) * 0.3, 1.2, 0.3, 0.9, 0.6, 0.6, 0.6, 0.45, 0.5);
        continue;
      }
      const x = p.x + (p.tx - p.x) * k, y = p.y + (p.ty - p.y) * k;
      const w = toWorld(x, y);
      const h = 1 + Math.sin(k * Math.PI) * (2 + p.dur * 6);
      m.makeTranslation(w.x, h, w.z);
      this.shellPool.push(m);
      if (Math.random() < 0.5) this.trail(w.x, h, w.z);
    }
    this.shellPool.end(); this.rocketPool.end();
  }
}
