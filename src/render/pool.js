import * as THREE from 'three';

const _zero = new THREE.Matrix4().makeScale(0, 0, 0);

// Kalıcı örnek havuzu: yuva ayır / bırak (swap-remove), gerektiğinde büyür
export class Pool {
  constructor(scene, geo, mat, { cast = true, receive = true, color = false, cap = 16, order = 0 } = {}) {
    this.scene = scene; this.geo = geo; this.mat = mat;
    this.opts = { cast, receive, color, order };
    this.count = 0; this.owners = [];
    this.mesh = this.make(cap);
  }
  make(cap) {
    const m = new THREE.InstancedMesh(this.geo, this.mat, cap);
    m.count = 0;
    m.frustumCulled = false;
    m.castShadow = this.opts.cast; m.receiveShadow = this.opts.receive;
    m.renderOrder = this.opts.order;
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    if (this.opts.color) {
      m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3).fill(1), 3);
      m.instanceColor.setUsage(THREE.DynamicDrawUsage);
    }
    this.cap = cap;
    this.scene.add(m);
    return m;
  }
  grow() {
    const old = this.mesh;
    const m = this.make(this.cap * 2);
    m.instanceMatrix.array.set(old.instanceMatrix.array);
    if (old.instanceColor) m.instanceColor.array.set(old.instanceColor.array);
    m.count = this.count;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    this.scene.remove(old);
    old.dispose();
    this.mesh = m;
  }
  alloc() {
    if (this.count >= this.cap) this.grow();
    const slot = { i: this.count, pool: this };
    this.owners[this.count] = slot;
    this.count++;
    this.mesh.count = this.count;
    this.mesh.setMatrixAt(slot.i, _zero);
    this.mesh.instanceMatrix.needsUpdate = true;
    return slot;
  }
  free(slot) {
    if (slot.i < 0) return;
    const last = this.count - 1;
    const m = this.mesh;
    if (slot.i !== last) {
      const a = m.instanceMatrix.array;
      a.copyWithin(slot.i * 16, last * 16, last * 16 + 16);
      if (m.instanceColor) m.instanceColor.array.copyWithin(slot.i * 3, last * 3, last * 3 + 3);
      const o = this.owners[last];
      o.i = slot.i; this.owners[slot.i] = o;
    }
    this.owners.length = last;
    slot.i = -1;
    this.count = last; m.count = last;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }
  set(slot, mat4) { this.mesh.setMatrixAt(slot.i, mat4); this.mesh.instanceMatrix.needsUpdate = true; }
  color(slot, r, g, b) {
    const a = this.mesh.instanceColor.array, k = slot.i * 3;
    a[k] = r; a[k + 1] = g; a[k + 2] = b;
    this.mesh.instanceColor.needsUpdate = true;
  }
  dispose() { this.scene.remove(this.mesh); this.mesh.dispose(); }
}

// Her karede yeniden doldurulan havuz
export class FramePool {
  constructor(scene, geo, mat, { cast = false, receive = true, color = false, cap = 64, order = 0 } = {}) {
    this.p = new Pool(scene, geo, mat, { cast, receive, color, cap, order });
    this.n = 0;
  }
  begin() { this.n = 0; }
  push(mat4, r, g, b) {
    const p = this.p;
    if (this.n >= p.cap) p.grow();
    p.mesh.setMatrixAt(this.n, mat4);
    if (r !== undefined && p.mesh.instanceColor) {
      const a = p.mesh.instanceColor.array, k = this.n * 3;
      a[k] = r; a[k + 1] = g; a[k + 2] = b;
    }
    this.n++;
  }
  end() {
    const m = this.p.mesh;
    m.count = this.n; this.p.count = this.n;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }
  get mesh() { return this.p.mesh; }
}
