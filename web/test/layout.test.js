import test from 'node:test';
import assert from 'node:assert';
import { projectFromTemplate, footprint, rectsOverlap } from '../src/model.js';
import { layoutProject } from '../src/layout.js';
import { computeWalls } from '../src/walls.js';

for (const key of ['1+1', '2+1', '3+1']) {
  test(`şablon ${key}: duvarlar ve yerleşim`, () => {
    const p = projectFromTemplate(key, key);
    const w = computeWalls(p);
    assert.ok(w.solids.length > 0);
    assert.ok(w.doors.length >= p.openings.filter((o) => o.kind === 'door').length);
    const t0 = Date.now();
    const opts = layoutProject(p);
    const ms = Date.now() - t0;
    assert.equal(opts.length, 3);
    for (const [i, o] of opts.entries()) {
      // Katı elemanlar üst üste binmemeli
      const solid = o.furniture.filter((f) => !['rug', 'rug_l', 'k_upper', 'chair', 'office_chair'].includes(f.type));
      for (let a = 0; a < solid.length; a++)
        for (let b = a + 1; b < solid.length; b++)
          assert.ok(!rectsOverlap(footprint(solid[a]), footprint(solid[b]), 1), `${key} seçenek ${i}: ${solid[a].type} ile ${solid[b].type} çakışıyor`);
      // Her eleman kendi odasının içinde
      for (const f of o.furniture) {
        const r = p.rooms.find((r) => r.id === f.roomId);
        const fp = footprint(f);
        assert.ok(fp.x0 >= r.x - 1 && fp.x1 <= r.x + r.w + 1 && fp.y0 >= r.y - 1 && fp.y1 <= r.y + r.h + 1, `${f.type} oda dışında`);
      }
    }
    const summary = p.rooms.map((r) => `${r.name}: ${opts[0].furniture.filter((f) => f.roomId === r.id).map((f) => f.type).join(',')}`);
    console.log(`\n[${key}] ${ms} ms\n  ` + summary.join('\n  ') + '\n  notlar: ' + opts.map((o) => o.notes.join('; ')).join(' | '));
  });
}
