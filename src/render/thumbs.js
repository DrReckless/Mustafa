import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { getModel, itemModels, materials } from './models.js';
import { BUILDINGS, UNITS, ITEMS } from '../config.js';

// Bina, birim ve eşya simgelerini gerçek 3B modellerden üretir
export function renderThumbs() {
  const out = { b: {}, u: {}, i: {} };
  const S = 128;
  let r;
  try {
    r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  } catch { return out; }
  r.setSize(S, S); r.setPixelRatio(1);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(r);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const sun = new THREE.DirectionalLight(0xfff2e0, 2.5); sun.position.set(3, 6, 4); scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x403528, 0.6));
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const accentCol = new THREE.Color(0x3a74c4);
  const glowCol = { furnace: new THREE.Color(3, 1.1, 0.25), status: new THREE.Color(0.3, 3, 0.6), yawStatus: new THREE.Color(0.3, 3, 0.6), beacon: new THREE.Color(5, 0.3, 0.3), arc: new THREE.Color(1.5, 2, 4), charge: new THREE.Color(0.3, 3, 0.6), lamp: new THREE.Color(4, 3.6, 2.8) };
  const M = materials();
  const shoot = (group, radius, center) => {
    const d = radius * 2.75;
    cam.position.set(center.x + d * 0.75, center.y + d * 0.62, center.z + d * 0.9);
    cam.lookAt(center);
    scene.add(group);
    r.render(scene, cam);
    const url = r.domElement.toDataURL('image/png');
    scene.remove(group);
    return url;
  };
  const fromParts = (parts) => {
    const g = new THREE.Group();
    for (const p of parts) {
      let mat = p.mat;
      if (p.inst) {
        mat = p.mat.clone();
        mat.color = p.mat === M.accent ? accentCol.clone() : (glowCol[p.anim] || new THREE.Color(1, 1, 1)).clone();
      }
      const mesh = new THREE.Mesh(p.geo, mat);
      if (p.pivot) mesh.position.copy(p.pivot);
      g.add(mesh);
    }
    return g;
  };
  for (const k of Object.keys(BUILDINGS)) {
    const g = fromParts(getModel(k));
    const box = new THREE.Box3().setFromObject(g);
    const sph = box.getBoundingSphere(new THREE.Sphere());
    out.b[k] = shoot(g, sph.radius, sph.center);
  }
  for (const k of Object.keys(UNITS)) {
    const g = fromParts(getModel(k));
    const box = new THREE.Box3().setFromObject(g);
    const sph = box.getBoundingSphere(new THREE.Sphere());
    out.u[k] = shoot(g, sph.radius, sph.center);
  }
  const im = itemModels();
  for (const k of Object.keys(ITEMS)) {
    const mesh = new THREE.Mesh(im[k].geo, im[k].mat);
    mesh.rotation.y = 0.6;
    const g = new THREE.Group(); g.add(mesh);
    const box = new THREE.Box3().setFromObject(g);
    const sph = box.getBoundingSphere(new THREE.Sphere());
    out.i[k] = shoot(g, sph.radius * 0.85, sph.center);
  }
  r.dispose();
  r.forceContextLoss?.();
  return out;
}
