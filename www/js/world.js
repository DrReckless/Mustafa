// Harita üretimi ve yardımcı fonksiyonlar
var T_GRASS = 0, T_WATER = 1, T_STONE = 2, T_IRON = 3;

function makeRng(seed) {
  var s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    var t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Basit değer gürültüsü (value noise)
function makeNoise(rng, n, cell) {
  var g = [], cols = Math.ceil(n / cell) + 2;
  for (var i = 0; i < cols * cols; i++) g.push(rng());
  function at(x, y) { return g[y * cols + x]; }
  function sm(t) { return t * t * (3 - 2 * t); }
  return function (x, y) {
    var fx = x / cell, fy = y / cell;
    var ix = Math.floor(fx), iy = Math.floor(fy);
    var tx = sm(fx - ix), ty = sm(fy - iy);
    var a = at(ix, iy), b = at(ix + 1, iy), c = at(ix, iy + 1), d = at(ix + 1, iy + 1);
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
  };
}

function generateMap(seed) {
  var rng = makeRng(seed);
  var N = MAP_N, c = N / 2;
  var n1 = makeNoise(rng, N, 8), n2 = makeNoise(rng, N, 4), nf = makeNoise(rng, N, 10);
  var tiles = [], trees = [], fert = [];
  for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
    var k = j * N + i;
    tiles[k] = T_GRASS;
    fert[k] = 0.6 + nf(i, j) * 0.8;
    var v = n1(i, j) * 0.7 + n2(i, j) * 0.3;
    var dc = Math.hypot(i - c, j - c);
    trees[k] = (v > 0.55 && dc > 6) || (dc > 20 && v > 0.45) ? 1 + Math.floor(rng() * 3) : 0;
  }
  // Nehir: haritayı yukarıdan aşağı geçen kıvrımlı dere
  var x = Math.floor(N * 0.15 + rng() * N * 0.15);
  for (var y = 0; y < N; y++) {
    x += Math.round((rng() - 0.45) * 2);
    x = Math.max(2, Math.min(N - 3, x));
    for (var w = 0; w < 2; w++) {
      var k2 = y * N + x + w;
      tiles[k2] = T_WATER; trees[k2] = 0;
    }
    // Nehir kenarı verimli
    for (var d = -3; d <= 4; d++) {
      var xx = x + d;
      if (xx >= 0 && xx < N) fert[y * N + xx] = Math.min(1.5, fert[y * N + xx] + 0.35 - Math.abs(d - 0.5) * 0.08);
    }
  }
  // Kayalık alanlar
  var blobs = 5 + Math.floor(rng() * 3);
  for (var b = 0; b < blobs; b++) {
    var ang = rng() * Math.PI * 2, dist = 9 + rng() * 12;
    var bx = Math.round(c + Math.cos(ang) * dist), by = Math.round(c + Math.sin(ang) * dist);
    var r = 1 + rng() * 1.6;
    for (var jj = -2; jj <= 2; jj++) for (var ii = -2; ii <= 2; ii++) {
      var tx = bx + ii, ty = by + jj;
      if (tx < 0 || ty < 0 || tx >= N || ty >= N) continue;
      if (Math.hypot(ii, jj) <= r) {
        var kk = ty * N + tx;
        if (tiles[kk] === T_GRASS) { tiles[kk] = T_STONE; trees[kk] = 0; }
      }
    }
  }
  // Demir damarları (kızıl kayalık): uzakta
  var irons = 3;
  for (var b2 = 0; b2 < irons; b2++) {
    var ang2 = rng() * Math.PI * 2, dist2 = 16 + rng() * 10;
    var ix = Math.round(c + Math.cos(ang2) * dist2), iy = Math.round(c + Math.sin(ang2) * dist2);
    for (var j3 = -2; j3 <= 2; j3++) for (var i3 = -2; i3 <= 2; i3++) {
      var tx2 = ix + i3, ty2 = iy + j3;
      if (tx2 < 1 || ty2 < 1 || tx2 >= N - 1 || ty2 >= N - 1) continue;
      if (Math.hypot(i3, j3) <= 1.6) {
        var k5 = ty2 * N + tx2;
        if (tiles[k5] !== T_WATER) { tiles[k5] = T_IRON; trees[k5] = 0; }
      }
    }
  }
  // Başlangıç alanını temizle
  for (var j2 = 0; j2 < N; j2++) for (var i2 = 0; i2 < N; i2++) {
    if (Math.hypot(i2 - c, j2 - c) < 6) {
      var k3 = j2 * N + i2;
      trees[k3] = 0;
      if (tiles[k3] === T_STONE || tiles[k3] === T_IRON) tiles[k3] = T_GRASS;
    }
  }
  return { tiles: tiles, trees: trees, fert: fert };
}

function inMap(i, j) { return i >= 0 && j >= 0 && i < MAP_N && j < MAP_N; }

// İzometrik dönüşümler (dünya pikseli)
function isoX(i, j) { return (i - j) * TW / 2; }
function isoY(i, j) { return (i + j) * TH / 2; }
function worldToTile(wx, wy) {
  var a = wx / (TW / 2), b = wy / (TH / 2);
  return { i: Math.floor((a + b) / 2), j: Math.floor((b - a) / 2) };
}
