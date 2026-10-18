import test from 'node:test';
import assert from 'node:assert';
import { projectFromTemplate, footprint, rectsOverlap, computeSpaces, newProject, uid, activeOpenings } from '../src/model.js';
import { layoutProject } from '../src/layout.js';
import { computeWalls } from '../src/walls.js';

const NON_SOLID = ['rug', 'rug_l', 'k_upper', 'chair', 'office_chair', 'bar_stool'];

function inUnion(p, f) {
  const sp = computeSpaces(p).byRoom.get(f.roomId);
  const fp = footprint(f);
  // köşe ve kenar ortası noktaları mekânın içinde olmalı
  const pts = [[fp.x0 + 1, fp.y0 + 1], [fp.x1 - 1, fp.y0 + 1], [fp.x0 + 1, fp.y1 - 1], [fp.x1 - 1, fp.y1 - 1], [(fp.x0 + fp.x1) / 2, (fp.y0 + fp.y1) / 2]];
  return pts.every(([x, y]) => sp.rects.some((q) => x >= q.x0 - 1 && x <= q.x1 + 1 && y >= q.y0 - 1 && y <= q.y1 + 1));
}

function check(name, p) {
  const opts = layoutProject(p);
  assert.equal(opts.length, 3);
  for (const [i, o] of opts.entries()) {
    const solid = o.furniture.filter((f) => !NON_SOLID.includes(f.type));
    for (let a = 0; a < solid.length; a++)
      for (let b = a + 1; b < solid.length; b++)
        assert.ok(!rectsOverlap(footprint(solid[a]), footprint(solid[b]), 1), `${name} seçenek ${i}: ${solid[a].type} ile ${solid[b].type} çakışıyor`);
    for (const f of o.furniture) assert.ok(inUnion(p, f), `${name}: ${f.type} mekân dışında`);
  }
  return opts;
}

function summary(p, o) {
  return computeSpaces(p).spaces.map((sp) => `${sp.name}: ${o.furniture.filter((f) => sp.rooms.some((r) => r.id === f.roomId)).map((f) => f.type).join(',')}`).join('\n  ');
}

for (const key of ['1+1', '2+1', '3+1']) {
  test(`şablon ${key}: duvarlar ve yerleşim`, () => {
    const p = projectFromTemplate(key, key);
    const w = computeWalls(p);
    assert.ok(w.solids.length > 0);
    assert.ok(w.doors.length >= activeOpenings(p).filter((o) => o.kind === 'door').length);
    const t0 = Date.now();
    const opts = check(key, p);
    console.log(`\n[${key}] ${Date.now() - t0} ms\n  ` + summary(p, opts[0]) + '\n  notlar: ' + opts.map((o) => o.notes.join('; ')).join(' | '));
  });
}

function room(p, type, x, y, w, h, name) {
  const r = { id: uid('r'), type, name: name || type, x, y, w, h };
  p.rooms.push(r);
  return r;
}

test('L salon: iki salon tek mekân, tek TV ve tek yemek masası', () => {
  const p = newProject('L');
  const a = room(p, 'salon', 0, 0, 420, 380, 'Salon');
  room(p, 'salon', 0, 390, 700, 330, 'Salon 2');
  p.openings.push({ id: uid('o'), kind: 'door', roomId: a.id, side: 'n', offset: 150, width: 90, swing: 'in', hinge: 'start', height: 210 });
  p.openings.push({ id: uid('o'), kind: 'window', roomId: a.id, side: 'w', offset: 100, width: 160, sill: 90, height: 140 });
  const { spaces } = computeSpaces(p);
  assert.equal(spaces.length, 1);
  assert.equal(spaces[0].gaps.length, 1);
  const w = computeWalls(p);
  // aradaki duvar kalkmış olmalı: boşluğun ortası zemin
  const g = w.grid;
  const k = Math.round((200 - g.ox) / 5) + Math.round((385 - g.oy) / 5) * g.cols;
  assert.equal(g.data[k], 1);
  const t0 = Date.now();
  const opts = check('L salon', p);
  const f = opts[0].furniture;
  assert.equal(f.filter((x) => x.type.startsWith('tv_unit')).length, 1);
  assert.ok(f.filter((x) => x.type.startsWith('dining_')).length === 1, 'yemek masası olmalı');
  console.log(`\n[L salon] ${Date.now() - t0} ms\n  ` + summary(p, opts[0]) + '\n  notlar: ' + opts[0].notes.join('; '));
});

test('iki yatak odası yan yana: duvarlı kalır, kullanıcı birleştirebilir', () => {
  const p = newProject('Y');
  const a = room(p, 'yatak', 0, 0, 350, 380);
  const b = room(p, 'yatak', 360, 0, 300, 380);
  assert.equal(computeSpaces(p).spaces.length, 2);
  p.partitions[[a.id, b.id].sort().join('|')] = 'open';
  assert.equal(computeSpaces(p).spaces.length, 1);
  p.openings.push({ id: uid('o'), kind: 'door', roomId: a.id, side: 's', offset: 30, width: 85, swing: 'in', hinge: 'start', height: 210 });
  const opts = check('birleşik yatak', p);
  assert.equal(opts[0].furniture.filter((x) => x.type.startsWith('bed_')).length, 1);
  console.log('\n[birleşik yatak]\n  ' + summary(p, opts[0]));
});

test('Amerikan mutfak: salon + mutfak, ada tezgâh', () => {
  const p = newProject('A');
  const s = room(p, 'salon', 0, 0, 520, 420, 'Salon');
  const m = room(p, 'mutfak', 530, 0, 360, 420, 'Mutfak');
  p.partitions[[s.id, m.id].sort().join('|')] = 'open';
  p.openings.push({ id: uid('o'), kind: 'door', roomId: s.id, side: 's', offset: 60, width: 90, swing: 'in', hinge: 'start', height: 210 });
  p.openings.push({ id: uid('o'), kind: 'window', roomId: m.id, side: 'n', offset: 120, width: 120, sill: 100, height: 120 });
  const sp = computeSpaces(p).spaces;
  assert.equal(sp.length, 1);
  assert.equal(sp[0].name, 'Salon + Mutfak');
  const opts = check('amerikan', p);
  const f = opts[0].furniture;
  assert.ok(f.some((x) => x.type === 'k_sink'));
  assert.ok(f.some((x) => x.type.startsWith('tv_unit')));
  // mutfak elemanları mutfak tarafında
  for (const x of f.filter((x) => ['k_sink', 'k_stove', 'k_fridge'].includes(x.type))) assert.ok(x.x > 500, 'mutfak elemanı salon tarafında: ' + x.type);
  console.log('\n[amerikan]\n  ' + summary(p, opts[0]) + '\n  notlar: ' + opts[0].notes.join('; '));
});

test('kapılı bitişik antreler duvarlı kalır, sürgülü kapı kapı sayılır', () => {
  const p = projectFromTemplate('2+1', 'x');
  const antres = p.rooms.filter((r) => r.type === 'antre');
  const sp = computeSpaces(p);
  assert.notEqual(sp.byRoom.get(antres[0].id), sp.byRoom.get(antres[1].id));
  const p3 = projectFromTemplate('3+1', 'x');
  assert.ok(p3.openings.some((o) => o.variant === 'sliding'));
  const w = computeWalls(p3);
  assert.ok(w.doors.some((d) => d.op.variant === 'sliding'));
});
