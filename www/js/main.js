// =====================================================================
//  BEYLİK — ana döngü, dokunmatik kontroller ve arayüz
// =====================================================================
(function () {
  var SAVE_KEY = 'beylik_kayit_v2';
  var QKEY = 'beylik_kalite';
  var canvas = document.getElementById('c');
  var $ = function (id) { return document.getElementById(id); };

  var g = null;
  var speed = 1, lastSpeed = 1;
  var ui = { selected: null, ghost: null, buildType: null, tab: 'halk' };
  var walkers = [];
  var lastT = performance.now(), time = 0;
  var modalOpen = false, modalKind = null, modalRefresh = null;
  var uiTimer = 0, panelDay = -1, modalDay = -1;
  var ready = false, syncTimer = 0, needSync = false;
  var seferSecim = {};

  // ---------- Kayıt ----------
  function store(fn) { try { return fn(); } catch (e) { return null; } }
  function save(quiet) {
    if (!g) return;
    store(function () { localStorage.setItem(SAVE_KEY, serialize(g)); });
    if (!quiet) toast('💾 Oyun kaydedildi');
  }
  function hasSave() { return !!store(function () { return localStorage.getItem(SAVE_KEY); }); }
  function load() {
    var s = store(function () { return localStorage.getItem(SAVE_KEY); });
    if (!s) return false;
    try { g = deserialize(s); } catch (e) { return false; }
    walkers = [];
    Render3D.setGame(g);
    centerCam();
    return true;
  }
  function startNew() {
    g = newGame((Math.random() * 1e9) | 0);
    walkers = [];
    Render3D.setGame(g);
    centerCam();
    save(true);
  }
  function centerCam() {
    var k = g.buildings.filter(function (b) { return b.type === 'konak'; })[0];
    if (k) Render3D.centerOn(k.i + 1.5, k.j + 1.5); else Render3D.centerOn(MAP_N / 2, MAP_N / 2);
    Render3D.R.cam.dist = 10;
    Render3D.R.cam.yaw = Math.PI / 4;
  }
  function quality() { return store(function () { return localStorage.getItem(QKEY); }) || 'yuksek'; }

  // ---------- Dokunma ----------
  var pointers = {}, gesture = null;
  function two() {
    var ids = Object.keys(pointers);
    var a = pointers[ids[0]], b = pointers[ids[1]];
    return { mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y), ang: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  canvas.addEventListener('pointerdown', function (e) {
    canvas.setPointerCapture(e.pointerId);
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var n = Object.keys(pointers).length;
    if (n === 1) gesture = { type: 'pan', sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now(), moved: false };
    else if (n === 2) { gesture = { type: 'pinch', last: two(), moved: true }; }
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!pointers[e.pointerId] || !gesture) return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (gesture.type === 'pan') {
      if (Math.hypot(e.clientX - gesture.sx, e.clientY - gesture.sy) > 9) gesture.moved = true;
      if (gesture.moved) { Render3D.pan(e.clientX - gesture.lx, e.clientY - gesture.ly); gesture.lx = e.clientX; gesture.ly = e.clientY; }
    } else if (gesture.type === 'pinch' && Object.keys(pointers).length >= 2) {
      var t = two(), l = gesture.last;
      Render3D.pan(t.mx - l.mx, t.my - l.my);
      if (l.d > 10) Render3D.zoom(t.d / l.d, t.mx, t.my);
      var da = t.ang - l.ang;
      if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2;
      Render3D.rotate(-da);
      gesture.last = t;
    }
  });
  function endPointer(e) {
    var wasTap = gesture && gesture.type === 'pan' && !gesture.moved && performance.now() - gesture.t < 500;
    delete pointers[e.pointerId];
    var ids = Object.keys(pointers);
    if (ids.length === 1) { var p = pointers[ids[0]]; gesture = { type: 'pan', sx: p.x, sy: p.y, lx: p.x, ly: p.y, t: 0, moved: true }; }
    else if (ids.length === 0) gesture = null;
    if (wasTap && e.type === 'pointerup') onTap(e.clientX, e.clientY);
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('wheel', function (e) { e.preventDefault(); Render3D.zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY); }, { passive: false });
  $('rotL').onclick = function () { Render3D.rotate(-Math.PI / 4); };
  $('rotR').onclick = function () { Render3D.rotate(Math.PI / 4); };

  function onTap(sx, sy) {
    if (!g || modalOpen) return;
    var t = Render3D.pick(sx, sy);
    if (!t) return;
    if (ui.buildType) {
      var d = BUILDINGS[ui.buildType];
      var gi = t.i - Math.floor((d.w - 1) / 2), gj = t.j - Math.floor((d.h - 1) / 2);
      if (ui.ghost && ui.ghost.i === gi && ui.ghost.j === gj && ui.ghost.ok) { confirmPlace(); return; }
      setGhost(gi, gj);
      return;
    }
    var id = Render3D.pickBuilding(sx, sy);
    var b = id ? getBuilding(g, id) : buildingAt(g, t.i, t.j);
    if (b) { ui.selected = b; showPanel(); }
    else { ui.selected = null; hidePanel(); }
  }

  // ---------- İnşa modu ----------
  function startBuild(type) {
    if (!unlocked(g, type)) { toast('🔒 ' + TITLES[TITLE_IDX[BUILDINGS[type].unlock]].ad + ' olunca açılır (' + TITLES[TITLE_IDX[BUILDINGS[type].unlock]].sart + ')'); return; }
    ui.buildType = type; ui.selected = null; hidePanel();
    var d = BUILDINGS[type];
    var t = Render3D.screenCenterTile() || { i: MAP_N / 2, j: MAP_N / 2 };
    var bi = t.i - Math.floor((d.w - 1) / 2), bj = t.j - Math.floor((d.h - 1) / 2);
    var found = null;
    for (var r = 0; r < 14 && !found; r++) {
      for (var dj = -r; dj <= r && !found; dj++) for (var di = -r; di <= r && !found; di++) {
        if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
        var c = canPlace(g, type, bi + di, bj + dj);
        if (c.ok || /yetersiz/.test(c.reason || '')) found = { i: bi + di, j: bj + dj };
      }
    }
    if (!found) found = { i: bi, j: bj };
    setGhost(found.i, found.j);
    $('placebar').classList.remove('hidden');
    renderCards();
  }
  function setGhost(i, j) {
    var r = canPlace(g, ui.buildType, i, j);
    ui.ghost = { type: ui.buildType, i: i, j: j, ok: r.ok, reason: r.reason, info: r.info };
    updatePlacebar();
  }
  function updatePlacebar() {
    if (!ui.ghost) return;
    var d = BUILDINGS[ui.buildType];
    var txt = '<b>' + d.ad + '</b> ' + fmtCost(d.cost);
    if (!ui.ghost.ok) txt += ' — <span class="neg">' + ui.ghost.reason + '</span>';
    if (ui.ghost.info) txt += ' — ' + ui.ghost.info;
    $('placeinfo').innerHTML = txt;
    $('placeOk').disabled = !ui.ghost.ok;
  }
  function confirmPlace() {
    if (!ui.ghost) return;
    var r = canPlace(g, ui.ghost.type, ui.ghost.i, ui.ghost.j);
    if (!r.ok) { toast(r.reason); return; }
    placeBuilding(g, ui.ghost.type, ui.ghost.i, ui.ghost.j);
    assignWorkers(g);
    needSync = true;
    if (BUILDINGS[ui.ghost.type].harika) { cancelBuild(); return; }
    setGhost(ui.ghost.i, ui.ghost.j);
    renderCards(); updateHud();
  }
  function cancelBuild() {
    ui.buildType = null; ui.ghost = null;
    $('placebar').classList.add('hidden');
    renderCards();
  }
  $('placeOk').onclick = confirmPlace;
  $('placeCancel').onclick = cancelBuild;

  // ---------- Alt menü ----------
  function renderTabs() {
    var h = '';
    CATEGORIES.forEach(function (c) { h += '<button data-t="' + c.id + '" class="' + (ui.tab === c.id ? 'on' : '') + '">' + c.ad + '</button>'; });
    $('tabs').innerHTML = h;
  }
  $('tabs').onclick = function (e) { var t = e.target.getAttribute('data-t'); if (!t) return; ui.tab = t; renderTabs(); renderCards(); };
  function renderCards() {
    if (!g) return;
    var h = '';
    for (var k in BUILDINGS) {
      var d = BUILDINGS[k];
      if (d.kat !== ui.tab) continue;
      var lock = !unlocked(g, k);
      var cls = 'card' + (ui.buildType === k ? ' on' : '') + (lock ? ' lock' : canAfford(g, d.cost) ? '' : ' no');
      h += '<button class="' + cls + '" data-b="' + k + '"><div class="ic">' + (lock ? '🔒' : d.ikon) + '</div><div class="nm">' + d.ad + '</div><div class="ct">' +
        (lock ? TITLES[TITLE_IDX[d.unlock]].ad : (fmtCost(d.cost) || 'Bedava')) + '</div></button>';
    }
    $('cards').innerHTML = h;
  }
  $('cards').onclick = function (e) {
    var el = e.target.closest('[data-b]');
    if (!el) return;
    var k = el.getAttribute('data-b');
    if (ui.buildType === k) cancelBuild(); else startBuild(k);
  };
  function renderCardsAfford() {
    var cards = $('cards').children;
    for (var n = 0; n < cards.length; n++) {
      var k = cards[n].getAttribute('data-b');
      if (unlocked(g, k)) cards[n].classList.toggle('no', !canAfford(g, BUILDINGS[k].cost));
    }
  }

  // ---------- Üst çubuk ----------
  function fmt(n) { n = Math.max(0, n); return n >= 10000 ? Math.round(n / 1000) + 'b' : n >= 1000 ? (n / 1000).toFixed(1) + 'b' : Math.floor(n).toString(); }
  function updateHud() {
    if (!g) return;
    var caps = storageCaps(g), h = '';
    var food = foodTotal(g);
    var items = [
      ['akce', g.res.akce], ['nufuz', g.res.nufuz], ['odun', g.res.odun], ['tas', g.res.tas], ['alet', g.res.alet]
    ];
    items.forEach(function (it) {
      var low = (it[0] === 'odun' && it[1] < 20) || (it[0] === 'alet' && it[1] < 3) || (it[0] === 'akce' && it[1] < 0);
      h += '<span class="r' + (low ? ' low' : '') + '">' + RES[it[0]].ikon + ' ' + (it[1] < 0 ? '-' : '') + fmt(Math.abs(it[1])) + '</span>';
    });
    h += '<span class="r' + (food < g.pop * 1.5 ? ' low' : '') + '">🍽️ ' + fmt(food) + ' <small>(' + (g.stats.variety || 0) + ' çeşit)</small></span>';
    h += '<button class="r btnr" id="ambarBtn">📦 Ambar</button>';
    $('res').innerHTML = h;
    var s = season(g);
    $('date').textContent = SEASON_ICON[s] + ' ' + SEASONS[s] + ' ' + dayOfSeason(g) + ' · ' + year(g);
    var mood = g.happiness >= 70 ? '😊' : g.happiness >= 45 ? '😐' : '😠';
    $('popbox').innerHTML = '👥 ' + g.pop + '/' + housingCap(g) + ' ' + mood + ' ' + g.happiness + ' · ⚒ ' + (g.stats.unemployed || 0) + ' boşta';
    var q = QUESTS[g.questIdx];
    $('quest').innerHTML = '<b>' + TITLES[g.titleIdx].ad + '</b> · 📜 ' + (q ? q.ad : 'Tüm görevler tamam!');
    var btns = $('speed').children;
    for (var n = 0; n < btns.length; n++) btns[n].classList.toggle('on', +btns[n].getAttribute('data-s') === speed);
    // uyarılar
    var al = [];
    if (food < g.stats.foodNeed * 20) al.push('🍽️ Yiyecek az!');
    if (s >= 2 && g.res.odun < 30) al.push('🪵 Kış için odun az!');
    if (g.res.alet < 2) al.push('🔨 Alet yok: üretim düşük');
    if (g.salgin > 0) al.push('☠️ Salgın');
    if (g.crime > 30) al.push('🗡️ Suç yüksek');
    if (g.res.akce < 0) al.push('🪙 Hazine borçta');
    for (var f in g.fac) if (g.fac[f].antlasma === 'savas') al.push('⚔️ ' + FACTIONS[f].ad + ' ile savaş');
    if (g.sefer) al.push('🚩 Ordu seferde (' + g.sefer.gun + ' gün)');
    if (g.caravan && g.caravan.state === 'burada') al.push('🐫 Kervan burada');
    if (g.peddler) al.push('🧳 Seyyar tüccar');
    $('alerts').innerHTML = al.map(function (a) { return '<span>' + a + '</span>'; }).join('');
  }
  $('speed').onclick = function (e) {
    var s = e.target.getAttribute('data-s');
    if (s === null) return;
    speed = +s; if (speed > 0) lastSpeed = speed;
    updateHud();
  };
  $('menuBtn').onclick = function () { showMenu(); };
  $('quest').onclick = function () { showQuests(); };
  $('res').onclick = function (e) { if (e.target.closest('#ambarBtn')) showStock(); };
  $('alerts').onclick = function () { showMenu(); };
  $('qbar').onclick = function (e) {
    var b = e.target.closest('[data-q]'); if (!b) return;
    var q = b.getAttribute('data-q');
    ({ beylik: showBeylik, ordu: showOrdu, harita: showHarita, diplo: showDiplo, ticaret: function () { showTrade(); }, mahalle: showMahalle })[q]();
  };

  // ---------- Bina paneli ----------
  function showPanel() { $('panel').classList.remove('hidden'); renderPanel(); }
  function hidePanel() { $('panel').classList.add('hidden'); }
  function perDay(obj, w) {
    var s = [];
    for (var k in obj) s.push(RES[k].ikon + ' ' + (Math.round(obj[k] * w * 100) / 100) + '/gün');
    return s.join(', ');
  }
  function row(a, b, cls) { return '<div class="row' + (cls ? ' ' + cls : '') + '"><span>' + a + '</span><span>' + b + '</span></div>'; }
  function bar(f) { return '<div class="bar"><div style="width:' + Math.round(Math.max(0, Math.min(1, f)) * 100) + '%"></div></div>'; }
  function renderPanel() {
    var b = ui.selected;
    if (!b || g.buildings.indexOf(b) < 0) { hidePanel(); ui.selected = null; return; }
    var d = BUILDINGS[b.type];
    var title = d.house ? HOUSE_LEVELS[b.level].ad : d.ad;
    var h = '<button class="close" data-a="close">✕</button><h3>' + d.ikon + ' ' + title + '</h3><div class="muted">' + d.desc + '</div>';
    if (b.progress < 1) {
      h += row('İnşaat', '%' + Math.round(b.progress * 100)) + bar(b.progress);
      h += row('Durum', b.status || '-');
      h += row('İnşaatçı', b.builders + ' / 4');
      var m = [];
      for (var k in d.cost) if (k !== 'akce') m.push(RES[k].ikon + ' ' + Math.floor(b.delivered[k] || 0) + '/' + d.cost[k]);
      if (m.length) h += row('Malzeme', m.join(' '));
      h += '<div class="btns"><button class="btn' + (b.oncelik ? ' ok' : '') + '" data-a="oncelik">⭐ Öncelik ' + (b.oncelik ? 'açık' : 'kapalı') + '</button>';
      h += '<button class="btn" data-a="pause">' + (b.paused ? '▶ Devam' : '⏸ Durdur') + '</button><button class="btn red" data-a="demolish">İptal et</button></div>';
      $('panel').innerHTML = h; return;
    }
    if (b.status) h += row('Durum', b.status);
    if (d.workers) h += row('İşçi', b.workers + ' / ' + d.workers);
    var eff = d.workers ? b.workers / d.workers : 1;
    if (d.prod && !d.farm) h += row('Üretim (tam)', '<span class="pos">' + perDay(d.prod, d.workers) + '</span>');
    if (d.input) h += row('Tüketim (tam)', '<span class="neg">' + perDay(d.input, d.workers) + '</span>');
    if (d.need === 'orman') h += row('Orman verimi', '%' + Math.round((b.factor || 0) * 100));
    if (d.sezon) h += row('Mevsim verimi', d.sezon.map(function (v, i) { return SEASON_ICON[i] + Math.round(v * 100); }).join(' '));
    if (d.farm) {
      h += row('Ekin', ({ bugday: '🌾 Buğday', arpa: '🌿 Arpa', nadas: '💤 Nadas' })[b.crop]);
      h += row('Toprak gücü', '%' + Math.round(b.soil * 100)) + bar(b.soil / 1.5);
      if (season(g) < 2) h += row('Ekim / büyüme', '%' + Math.round(b.sown * 100) + ' / %' + Math.round(b.growth * 100));
      if (b.harvest > 0) h += row('Kalan hasat', Math.round(b.harvest));
      h += '<div class="muted">Tahmini hasat: ~' + Math.round(120 * Math.max(b.growth, 0.5) * b.soil) + '. Buğday her hasatta toprağı daha çok yorar; arpa daha az. Nadas toprağı kışın dinlendirir. Ekin değişikliği bir sonraki ekimde geçerlidir.</div>';
      h += '<div class="btns"><button class="btn' + (b.crop === 'bugday' ? ' ok' : '') + '" data-a="crop" data-v="bugday">🌾 Buğday</button><button class="btn' + (b.crop === 'arpa' ? ' ok' : '') + '" data-a="crop" data-v="arpa">🌿 Arpa</button><button class="btn' + (b.crop === 'nadas' ? ' ok' : '') + '" data-a="crop" data-v="nadas">💤 Nadas</button></div>';
    }
    if (d.flock) h += row('Sürü', Math.round(b.sheep) + ' koyun') + '<div class="muted">Kışın koyun başına günde 0,04 arpa yer.</div>';
    if (d.orchard) h += row('Yaş', b.age < YEAR_DAYS ? 'Fidan (%' + Math.round(b.age / YEAR_DAYS * 100) + ')' : 'Verimli');
    if (d.house) {
      h += row('Seviye', b.level + ' / 3 · ' + HOUSE_LEVELS[b.level].ad);
      h += row('Sakinler', b.residents + ' / ' + HOUSE_LEVELS[b.level].kap);
      if (b.mahalle) h += row('Mahalle', b.mahalle);
      h += row('Mutluluk', b.happy);
      h += '<div class="sub">Bu seviyenin ihtiyaçları</div>';
      HOUSE_LEVELS[b.level].ihtiyac.forEach(function (n) { h += '<div class="need ' + ((b.miss || []).indexOf(n) >= 0 ? 'neg' : 'pos') + '">' + ((b.miss || []).indexOf(n) >= 0 ? '✗ ' : '✓ ') + NEED_TEXT[n] + '</div>'; });
      if (b.level < 3) {
        var nl = HOUSE_LEVELS[b.level + 1];
        h += '<div class="sub">' + nl.ad + ' için (' + fmtCost(nl.yukselt) + ')</div>';
        nl.ihtiyac.forEach(function (n) { var miss = (b.nextMiss || nl.ihtiyac).indexOf(n) >= 0; h += '<div class="need ' + (miss ? 'neg' : 'pos') + '">' + (miss ? '✗ ' : '✓ ') + NEED_TEXT[n] + '</div>'; });
        h += '<div class="muted">Tüm ihtiyaçlar 15 gün karşılanırsa ve malzeme varsa ev kendiliğinden yükselir (' + b.upDays + '/15).</div>';
      }
      if (b.parts) { h += '<div class="sub">Mutluluk dökümü</div>'; b.parts.forEach(function (p) { h += row(p[0], '<span class="' + (p[1] >= 0 ? 'pos' : 'neg') + '">' + (p[1] > 0 ? '+' : '') + p[1] + '</span>', 'muted'); }); }
    }
    if (d.service) h += row('Etki alanı', d.radius + ' karo · ' + (serviceActive(b) ? '<span class="pos">aktif</span>' : '<span class="neg">pasif</span>'));
    if (d.nufuz) h += row('Nüfuz', '+' + d.nufuz + '/gün');
    if (d.storage) { var c = storageCaps(g); h += row('Depo sınırları', '🍽️ ' + c.gida + ' · 🪵 ' + c.ham + ' · 📦 ' + c.mal); }
    if (d.kisla) h += row('Kışla', armySize(g) + ' / ' + kislaCap(g) + ' asker');
    if (d.mahalle) { var mh = g.mahalleler.filter(function (x) { return x.id === b.id; })[0]; if (mh) h += row('Mahalle', mh.ad + ' · ' + mh.evler + ' ev · ' + mh.nufus + ' kişi'); }
    h += '<div class="btns">';
    if (b.type === 'konak') h += '<button class="btn ok" data-a="beylik">🏯 Beylik yönetimi</button><button class="btn" data-a="diplo">🤝 Diplomasi</button>';
    if (b.type === 'kervansaray' || (b.type === 'pazar' && g.peddler)) h += '<button class="btn ok" data-a="trade">🐫 Ticaret</button>';
    if (b.type === 'kisla') h += '<button class="btn ok" data-a="ordu">⚔️ Ordu</button>';
    if (d.mahalle) h += '<button class="btn" data-a="mahalle">🏘️ Mahalleler</button>';
    if (d.workers) h += '<button class="btn' + (b.oncelik ? ' ok' : '') + '" data-a="oncelik">⭐ Öncelik</button><button class="btn" data-a="pause">' + (b.paused ? '▶ Devam' : '⏸ Durdur') + '</button>';
    if (d.prod && !d.farm) h += '<button class="btn' + (b.sinirsiz ? ' ok' : '') + '" data-a="sinirsiz" title="Stok dolsa da üret">♾️ Stok sınırı ' + (b.sinirsiz ? 'yok' : 'var') + '</button>';
    if (b.type !== 'konak') h += '<button class="btn red" data-a="demolish">Yık</button>';
    h += '</div>';
    $('panel').innerHTML = h;
  }
  $('panel').onclick = function (e) {
    var el = e.target.closest('[data-a]');
    if (!el) return;
    var a = el.getAttribute('data-a'), b = ui.selected;
    if (a === 'close') { ui.selected = null; hidePanel(); return; }
    if (!b) return;
    if (a === 'pause') { b.paused = !b.paused; assignWorkers(g); }
    if (a === 'oncelik') { b.oncelik = !b.oncelik; assignWorkers(g); }
    if (a === 'sinirsiz') { b.sinirsiz = !b.sinirsiz; assignWorkers(g); }
    if (a === 'crop') { b.crop = el.getAttribute('data-v'); if (b.crop === 'nadas') { b.growth = 0; b.sown = 0; } assignWorkers(g); needSync = true; }
    if (a === 'demolish') {
      if (!el.dataset.sure) { el.dataset.sure = '1'; el.textContent = 'Emin misin? Tekrar dokun'; return; }
      demolish(g, b); needSync = true; ui.selected = null; hidePanel(); updateHud(); return;
    }
    if (a === 'trade') { showTrade(); return; }
    if (a === 'beylik') { showBeylik(); return; }
    if (a === 'diplo') { showDiplo(); return; }
    if (a === 'ordu') { showOrdu(); return; }
    if (a === 'mahalle') { showMahalle(); return; }
    renderPanel(); updateHud();
  };

  // ---------- Pencereler ----------
  function openModal(html, kind, refresh) {
    var keep = modalOpen && kind === modalKind ? $('modalBox').scrollTop : 0;
    $('modalBox').innerHTML = html;
    $('modal').classList.remove('hidden');
    $('modalBox').scrollTop = keep;
    modalOpen = true; modalKind = kind || null; modalRefresh = refresh || null;
  }
  function closeModal() { $('modal').classList.add('hidden'); modalOpen = false; modalKind = null; modalRefresh = null; }
  function tabsHtml(active) {
    var t = [['beylik', '🏯 Beylik'], ['ordu', '⚔️ Ordu'], ['harita', '🗺️ Harita'], ['diplo', '🤝 Diplomasi'], ['ticaret', '🐫 Ticaret'], ['ambar', '📦 Ambar'], ['mahalle', '🏘️ Mahalle'], ['kronik', '📖 Vakayiname'], ['istat', '📈 İstatistik'], ['gorev', '📜 Görevler']];
    return '<div class="mtabs">' + t.map(function (x) { return '<button class="' + (x[0] === active ? 'on' : '') + '" data-m="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '<button data-m="close" class="x">✕</button></div>';
  }

  function showTitle() {
    var h = '<div class="title-screen"><h1>🏯 BEYLİK</h1><div class="sub">Anadolu\'da bir uç beyliği kur. Obanı köye, köyünü kasabaya, kasabanı şehre çevir; komşularını alt et ve Sultanlığa yüksel.</div><div class="opts">';
    if (hasSave()) h += '<button class="btn ok" data-m="continue">Devam Et</button>';
    h += '<button class="btn red" data-m="new">Yeni Oyun</button><button class="btn" data-m="help">Nasıl Oynanır?</button></div></div>';
    openModal(h, 'title');
  }
  function showMenu() {
    var h = '<h2>☰ Menü</h2><div class="opts grid2">';
    h += '<button class="btn ok" data-m="close">▶ Oyuna Dön</button>';
    h += '<button class="btn" data-m="beylik">🏯 Beylik Yönetimi</button>';
    h += '<button class="btn" data-m="ordu">⚔️ Ordu ve Sefer</button>';
    h += '<button class="btn" data-m="harita">🗺️ Bölge Haritası</button>';
    h += '<button class="btn" data-m="diplo">🤝 Diplomasi</button>';
    h += '<button class="btn" data-m="ticaret">🐫 Ticaret</button>';
    h += '<button class="btn" data-m="ambar">📦 Ambar</button>';
    h += '<button class="btn" data-m="mahalle">🏘️ Mahalleler</button>';
    h += '<button class="btn" data-m="kronik">📖 Vakayiname</button>';
    h += '<button class="btn" data-m="istat">📈 İstatistik</button>';
    h += '<button class="btn" data-m="gorev">📜 Görevler</button>';
    h += '<button class="btn" data-m="save">💾 Kaydet</button>';
    h += '<button class="btn" data-m="help">❔ Nasıl Oynanır?</button>';
    h += '<button class="btn" data-m="quality">⚙️ Grafik: ' + ({ yuksek: 'Yüksek', orta: 'Orta', dusuk: 'Düşük' }[quality()]) + '</button>';
    h += '<button class="btn red" data-m="newask">Yeni Oyun</button>';
    h += '</div>';
    openModal(h, 'menu');
  }
  function showHelp() {
    var h = '<h2>Nasıl Oynanır?</h2>' +
      '<p><b>Kontroller:</b> Tek parmakla kaydır, iki parmakla yakınlaştır ve döndür. Alttan bina seç, haritaya dokun, <b>İnşa Et</b>.</p>' +
      '<p><b>İşgücü:</b> Nüfusun ~%65\'i çalışır. Binalar işçi ister; <b>inşaatlar boşta işçi</b> (ve konağın 2 hizmetkârı) ile yapılır, malzeme yavaş yavaş taşınır. İşçi yetmiyorsa bazı binaları durdur veya ⭐ öncelik ver.</p>' +
      '<p><b>Yiyecek:</b> Ekmek, et, balık, sebze, meyve, peynir, bal, pekmez. Çeşit arttıkça halk mutlu olur. Yiyecek bozulur: ambar ve Kıtlık Ambarları kanunu bozulmayı azaltır.</p>' +
      '<p><b>Tarım:</b> Tarlalar baharda ekilir, yazın büyür, güzün hasat edilir. Her hasat toprağı yorar; zaman zaman <b>nadasa</b> bırak. Arpa, koyunlar ve atlar için yemdir.</p>' +
      '<p><b>Kış:</b> Evler odun yakar, koyunlar arpa yer. Kışa hazırlıksız girmek ölüm demektir.</p>' +
      '<p><b>Evler:</b> Kerpiç Ev → Avlulu Ev → Kâgir Konak. Her seviye yeni ihtiyaçlar ister (pazar, mescit, elbise, hamam, medrese, çömlek, lüks yiyecek) ama daha çok kişi barındırır ve daha çok vergi verir. Eve dokunup ihtiyaç listesine bak.</p>' +
      '<p><b>Aletler:</b> Her işçi alet aşındırır. Alet bitince üretim %40 düşer. Önce seyyar tüccardan al, sonra demir madeni → kömürcü → demirci zincirini kur.</p>' +
      '<p><b>Unvanlar:</b> Oba → Köy → Kasaba → Şehir → Sancak. Her unvan yeni binalar ve kanun hakkı açar.</p>' +
      '<p><b>Nüfuz:</b> Mescit, cami, tekke, medrese ve fetihlerden gelir. Kanun çıkarmak, diplomasi ve tımarlı sipahi için harcanır.</p>' +
      '<p><b>Tehlikeler:</b> Salgın (çeşme, hamam, darüşşifa korur), yangın (su yakınsa söndürülür), suç (subaşı, kadı, iş imkânı), komşu baskınları (ordu, sur, gözcü kulesi).</p>' +
      '<p><b>Ordu ve fetih:</b> Kasaba olunca kışla kur, silah/yay/at üret, asker topla. Bölge haritasından sefere çık. Akıncılarla yağma akınları yap. Okçu azabı, akıncı okçuyu, azap akıncıyı yener.</p>' +
      '<p><b>Zafer:</b> Tüm bölgeleri fethet, Ulu Cami\'yi inşa et ve 400 nüfusa ulaş: Sultan ol!</p>' +
      '<div class="opts"><button class="btn ok" data-m="' + (g ? 'close' : 'title') + '">Tamam</button></div>';
    openModal(h, 'help');
  }
  function showQuests() {
    var h = tabsHtml('gorev') + '<h2>📜 Görevler</h2>';
    var last = '';
    QUESTS.forEach(function (q, n) {
      if (q.bolum !== last) { h += '<div class="sub">' + q.bolum + '</div>'; last = q.bolum; }
      var cls = n < g.questIdx ? 'qdone' : n === g.questIdx ? 'qnow' : '';
      h += '<div class="' + cls + '">' + (n < g.questIdx ? '✅ ' : n === g.questIdx ? '▶ ' : '• ') + q.ad + ' <span class="muted">(' + fmtCost(q.odul) + ')</span></div>';
    });
    h += '<div class="sub">Sonraki unvan</div>';
    var nt = TITLES[g.titleIdx + 1];
    h += nt ? '<div>' + nt.ad + ': ' + nt.sart + '</div>' : '<div>En yüksek unvana ulaştın.</div>';
    openModal(h, 'quests', showQuests);
  }

  // --- Beylik yönetimi ---
  function showBeylik(msg) {
    var h = tabsHtml('beylik') + '<h2>🏯 Beylik Yönetimi</h2>';
    if (msg) h += '<div class="neg"><b>' + msg + '</b></div>';
    h += '<div class="cols"><div>';
    h += row('Unvan', TITLES[g.titleIdx].ad) + row('Nüfus', g.pop + ' / ' + housingCap(g)) + row('İşgücü', g.stats.workforce + ' (boşta ' + g.stats.unemployed + ')');
    h += row('Mutluluk', g.happiness) + row('Suç', Math.round(g.crime)) + row('Salgın', g.salgin > 0 ? '<span class="neg">VAR</span>' : 'yok');
    h += row('Vergi geliri', '🪙 ' + (Math.round((g.stats.income || 0) * 10) / 10) + '/gün') + row('Ordu bakımı', '🪙 ' + (Math.round((g.stats.upkeep || 0) * 10) / 10) + '/gün');
    h += row('Nüfuz', '✨ +' + (Math.round((g.stats.nufuz || 0) * 100) / 100) + '/gün');
    h += row('Hırsızlık', '🪙 −' + (Math.round((g.stats.theft || 0) * 10) / 10) + '/gün');
    h += row('Savunma gücü', Math.round(defensePower(g)));
    var nt = TITLES[g.titleIdx + 1];
    if (nt) h += row('Sonraki unvan', nt.ad + ': ' + nt.sart);
    h += '</div><div>';
    h += '<div class="sub">Öşür (vergi)</div><div class="btns">';
    TAX.forEach(function (t, n) { h += '<button class="btn' + (g.taxLevel === n ? ' red' : '') + '" data-tax="' + n + '">' + t.ad + '</button>'; });
    h += '</div><div class="muted">Ağır vergi gelir getirir ama halkı mutsuz eder, isyan çıkarabilir.</div>';
    h += '<div class="sub">Sur</div>';
    h += row('Mevcut', g.sur ? SUR_LEVELS[g.sur].ad : 'Sur yok');
    var ns = SUR_LEVELS[g.sur + 1];
    if (ns) h += '<button class="btn" data-sur="1">🧱 ' + ns.ad + ' yap (' + fmtCost(ns.cost) + ')' + (ns.unlock && g.titleIdx < ns.unlock ? ' 🔒' : '') + '</button>';
    if (g.mods.length) {
      h += '<div class="sub">Süren etkiler</div>';
      g.mods.forEach(function (m) {
        var e = [];
        if (m.mutluluk) e.push((m.mutluluk > 0 ? '+' : '') + m.mutluluk + ' mutluluk');
        if (m.uretim) e.push((m.uretim > 0 ? '+' : '') + Math.round(m.uretim * 100) + '% üretim');
        if (m.insaat) e.push('+' + Math.round(m.insaat * 100) + '% inşaat');
        h += row(m.ad, e.join(', ') + ' · ' + m.gun + ' gün', 'muted');
      });
    }
    h += '</div></div>';
    h += '<div class="sub">📜 Kanunname (' + g.laws.length + ' / ' + lawSlots(g) + ' hak)</div><div class="laws">';
    LAWS.forEach(function (L) {
      var on = hasLaw(g, L.id);
      h += '<div class="law' + (on ? ' on' : '') + '"><b>' + L.ad + '</b> <span class="muted">✨' + L.bedel + '</span><div class="muted">' + L.desc + '</div><button class="btn' + (on ? ' red' : ' ok') + '" data-law="' + L.id + '">' + (on ? 'Kaldır' : 'İlan et') + '</button></div>';
    });
    h += '</div>';
    openModal(h, 'beylik', showBeylik);
  }

  // --- Ordu ---
  function showOrdu(msg) {
    var h = tabsHtml('ordu') + '<h2>⚔️ Ordu</h2>';
    if (msg) h += '<div class="neg"><b>' + msg + '</b></div>';
    h += row('Kışla kapasitesi', (armySize(g) + (g.sefer ? sum(g.sefer.birlik) : 0)) + ' / ' + kislaCap(g));
    h += row('Moral', Math.round(g.moral)) + row('Kuvvet (evde)', Math.round(armyPower(g, g.army))) + row('Savunma gücü', Math.round(defensePower(g)));
    if (!built(g, 'kisla')) h += '<div class="muted">Asker toplamak için önce Kışla inşa et (Kasaba olunca açılır).</div>';
    h += '<table><tr><th>Birlik</th><th>Evde</th><th>Bedel</th><th>Bakım</th><th></th></tr>';
    UNIT_KEYS.forEach(function (u) {
      var U = UNITS[u], err = canRecruit(g, u);
      h += '<tr><td>' + U.ikon + ' ' + U.ad + '<div class="muted">Güç ' + U.guc + ' · ' + UNITS[U.kars].ad + '\'a üstün</div></td><td>' + g.army[u] + '</td><td>' + fmtCost(recruitCost(g, u)) + ' 👤1</td><td>🪙' + U.bakim + '</td>' +
        '<td><button class="btn ok" data-rec="' + u + '"' + (err ? ' disabled title="' + err + '"' : '') + '>+1</button> <button class="btn" data-rec5="' + u + '"' + (err ? ' disabled' : '') + '>+5</button> <button class="btn red" data-dis="' + u + '"' + (g.army[u] ? '' : ' disabled') + '>−1</button></td></tr>';
    });
    h += '</table>';
    if (g.sefer) {
      var R = REGIONS.filter(function (r) { return r.id === g.sefer.hedef; })[0];
      h += '<div class="sub">🚩 Sefer</div>' + row('Hedef', R.ad + ' (' + (g.sefer.mod === 'akin' ? 'akın' : 'fetih') + ')') + row('Durum', g.sefer.durum === 'gidis' ? 'Yolda, ' + g.sefer.gun + ' gün kaldı' : 'Dönüşte, ' + g.sefer.gun + ' gün kaldı');
      h += row('Birlikler', UNIT_KEYS.map(function (u) { return UNITS[u].ikon + (g.sefer.birlik[u] || 0); }).join(' '));
    } else h += '<div class="opts"><button class="btn ok" data-m="harita">🗺️ Sefer için bölge haritasına git</button></div>';
    if (g.lastBattle) {
      var L = g.lastBattle;
      h += '<div class="sub">Son savaş: ' + L.bolge + '</div>' + row('Sonuç', L.sonuc) + row('Kuvvetler', 'Biz ' + L.bizim + ' — Onlar ' + L.onlar) + row('Kayıplarımız', UNIT_KEYS.map(function (u) { return UNITS[u].ikon + (L.kayip[u] || 0); }).join(' '));
    }
    openModal(h, 'ordu', showOrdu);
  }

  // --- Bölge haritası ---
  function showHarita(msg, sel) {
    var h = tabsHtml('harita') + '<h2>🗺️ Bölge Haritası</h2>';
    if (msg) h += '<div class="neg"><b>' + msg + '</b></div>';
    h += '<div class="map"><div class="home" style="left:38%;top:64%">🏯<span>Beyliğin</span></div>';
    REGIONS.forEach(function (r) {
      var reg = g.regions[r.id], own = reg.sahip;
      var col = own === 'biz' ? '#d4a640' : FACTIONS[own] ? FACTIONS[own].renk : '#777';
      h += '<button class="reg' + (sel === r.id ? ' sel' : '') + '" data-reg="' + r.id + '" style="left:' + r.x + '%;top:' + r.y + '%;background:' + col + '">' + (own === 'biz' ? '⭐' : '🏰') + '<span>' + r.ad + '</span></button>';
    });
    h += '</div>';
    if (sel) {
      var R = REGIONS.filter(function (r) { return r.id === sel; })[0], reg = g.regions[sel];
      h += '<div class="sub">' + R.ad + '</div>';
      h += row('Sahibi', reg.sahip === 'biz' ? '<span class="pos">Beyliğimiz</span>' : FACTIONS[reg.sahip].ad);
      h += row('Mesafe', R.mesafe + ' gün');
      h += row('Gelir (fethedilince)', fmtCost(R.gelir) + ' /gün');
      if (reg.sahip === 'biz') h += row('Halkın memnuniyeti', Math.round(reg.memnun) + (reg.memnun < 30 ? ' <span class="neg">isyan tehlikesi!</span>' : ''));
      else {
        h += row('Garnizon', Math.round(reg.garnizon) + ' (savaş gücü ~' + Math.round(reg.garnizon * (reg.garnizon > 150 ? 1.25 : 1)) + ')');
        if (!g.sefer) {
          h += '<div class="sub">Sefere çıkacak birlikler</div><div class="pick">';
          UNIT_KEYS.forEach(function (u) {
            var v = Math.min(seferSecim[u] || 0, g.army[u]);
            seferSecim[u] = v;
            h += '<div>' + UNITS[u].ikon + ' ' + v + '/' + g.army[u] + ' <button class="btn" data-ss="' + u + '" data-d="-1">−</button><button class="btn" data-ss="' + u + '" data-d="1">+</button><button class="btn" data-ss="' + u + '" data-d="99">Hepsi</button></div>';
          });
          h += '</div>';
          var pw = Math.round(armyPower(g, seferSecim, enemyMixFor(reg.sahip)));
          h += row('Tahmini gücümüz', pw + ' vs ~' + Math.round(reg.garnizon * (reg.garnizon > 150 ? 1.25 : 1)));
          h += '<div class="muted">Sefer yiyecek ister (asker × mesafe × 0,1). Ordu seferdeyken şehir savunmasız kalır. Fetih, bölgenin sahibiyle savaş demektir.</div>';
          h += '<div class="btns"><button class="btn red" data-sefer="fetih" data-r="' + sel + '">⚔️ Fethet</button><button class="btn" data-sefer="akin" data-r="' + sel + '">🐎 Akın (yağma)</button></div>';
        }
      }
    }
    openModal(h, 'harita', function () { showHarita(null, sel); });
  }

  // --- Diplomasi ---
  function showDiplo(msg) {
    var h = tabsHtml('diplo') + '<h2>🤝 Diplomasi</h2>';
    if (msg) h += '<div class="neg"><b>' + msg + '</b></div>';
    if (g.titleIdx < 1) h += '<div class="muted">Komşular küçük bir obayla ilgilenmez. Köy olunca diplomasi başlar.</div>';
    h += '<table><tr><th>Devlet</th><th>İlişki</th><th>Durum</th><th>Güç</th><th></th></tr>';
    Object.keys(FACTIONS).forEach(function (f) {
      var F = g.fac[f], A = FACTIONS[f];
      var st = ({ yok: 'Tarafsız', ticaret: 'Ticaret', ittifak: 'İttifak', savas: '<span class="neg">SAVAŞ</span>' })[F.antlasma];
      var rel = Math.round(F.iliski);
      h += '<tr><td><span class="dot" style="background:' + A.renk + '"></span>' + A.ad + '</td><td class="' + (rel >= 0 ? 'pos' : 'neg') + '">' + rel + '</td><td>' + st + '</td><td>' + Math.round(F.guc) + '</td><td class="act">' +
        '<button class="btn" data-dp="hediye" data-f="' + f + '">🎁 Hediye (60🪙)</button>' +
        (F.antlasma === 'yok' ? '<button class="btn" data-dp="ticaret" data-f="' + f + '">📜 Ticaret (✨10)</button>' : '') +
        (F.antlasma === 'ticaret' ? '<button class="btn" data-dp="ittifak" data-f="' + f + '">🤝 İttifak (✨30)</button>' : '') +
        (F.antlasma === 'savas' ? '<button class="btn ok" data-dp="baris" data-f="' + f + '">🕊️ Barış (' + Math.round(F.guc * 0.6) + '🪙)</button>' : '<button class="btn red" data-dp="savas" data-f="' + f + '">⚔️ Savaş ilan et</button>') +
        '</td></tr>';
    });
    h += '</table><div class="muted">Ticaret antlaşmaları kervanları artırır ve fiyatları iyileştirir. Güçlü komşular haraç ister; reddetmek savaş getirebilir. Senin savunma gücün: ' + Math.round(defensePower(g)) + '</div>';
    openModal(h, 'diplo', showDiplo);
  }

  // --- Ticaret ---
  function showTrade(msg) {
    var mode = tradeAvailable(g);
    var h = tabsHtml('ticaret') + '<h2>🐫 Ticaret</h2>';
    if (!mode) { h += '<p>Şu an tüccar yok. Seyyar tüccar ara sıra uğrar; kalıcı ticaret için <b>Kervansaray</b> kur (Kasaba).</p>'; openModal(h, 'trade'); return; }
    h += '<div class="muted">' + (mode === 'seyyar' ? '🧳 Seyyar tüccar: fiyatlar pahalı, ' + g.peddler.gun + ' gün kalacak.' : '🐫 Kervansaray açık. Ticaret ortakları: ' + tradePartners(g)) + '</div>';
    if (g.caravan && g.caravan.state === 'burada') h += '<div class="pos">' + g.caravan.ad + ' burada (' + g.caravan.gun + ' gün): ' + RES[g.caravan.talep].ikon + ' ' + RES[g.caravan.talep].ad + ' ×2 fiyata alıyor, ' + RES[g.caravan.teklif].ikon + ' ' + RES[g.caravan.teklif].ad + ' ucuz satıyor.</div>';
    if (msg) h += '<div class="neg"><b>' + msg + '</b></div>';
    h += '<div class="muted">Akçe: 🪙 ' + Math.floor(g.res.akce) + '</div><table>';
    for (var k in PRICES) {
      h += '<tr><td>' + RES[k].ikon + ' ' + RES[k].ad + '</td><td>' + Math.floor(g.res[k]) + '</td>' +
        '<td><button class="btn ok" data-tr="' + k + '" data-q="10">Al 10 (' + Math.round(priceOf(g, k, true) * 10) + ')</button></td>' +
        '<td><button class="btn red" data-tr="' + k + '" data-q="-10">Sat 10 (' + Math.round(priceOf(g, k, false) * 10) + ')</button></td></tr>';
    }
    h += '</table>';
    openModal(h, 'trade', showTrade);
  }

  // --- Ambar ---
  function showStock() {
    var caps = storageCaps(g);
    var h = tabsHtml('ambar') + '<h2>📦 Ambar ve Depolar</h2>';
    [['gida', '🍽️ Gıda (ambar)'], ['ham', '🪵 Hammadde (depo)'], ['mal', '📦 Mamul mallar (depo)']].forEach(function (c) {
      var tot = catTotal(g, c[0]);
      h += '<div class="sub">' + c[1] + ': ' + Math.round(tot) + ' / ' + caps[c[0]] + '</div>' + bar(tot / caps[c[0]]) + '<div class="stock">';
      RES_KEYS.forEach(function (k) { if (RES[k].kat === c[0]) h += '<span>' + RES[k].ikon + ' ' + RES[k].ad + ' <b>' + Math.floor(g.res[k]) + '</b></span>'; });
      h += '</div>';
    });
    h += '<div class="sub">Özel</div><div class="stock"><span>🪙 Akçe <b>' + Math.floor(g.res.akce) + '</b></span><span>✨ Nüfuz <b>' + Math.floor(g.res.nufuz) + '</b></span></div>';
    h += '<div class="muted">Günlük yiyecek ihtiyacı: ' + (Math.round((g.stats.foodNeed || 0) * 10) / 10) + '. Ambar sayısı arttıkça kapasite büyür; ambar varsa bozulma azalır.</div>';
    openModal(h, 'stock', showStock);
  }

  // --- Mahalleler ---
  function showMahalle() {
    var h = tabsHtml('mahalle') + '<h2>🏘️ Mahalleler</h2>';
    if (!g.mahalleler.length) h += '<p>Henüz mahalle yok. Evlerin yakınına <b>Mescit</b> kur; her mescit veya cami bir mahalle merkezi olur.</p>';
    else {
      h += '<table><tr><th>Mahalle</th><th>Merkez</th><th>Ev</th><th>Nüfus</th><th>Mutluluk</th><th>Kerpiç/Avlulu/Kâgir</th></tr>';
      g.mahalleler.forEach(function (m) { h += '<tr><td>' + m.ad + '</td><td>' + m.merkez + (m.imam ? '' : ' <span class="neg">(imamsız)</span>') + '</td><td>' + m.evler + '</td><td>' + m.nufus + '</td><td>' + m.mutluluk + '</td><td>' + m.seviye[1] + ' / ' + m.seviye[2] + ' / ' + m.seviye[3] + '</td></tr>'; });
      h += '</table>';
      var out = g.buildings.filter(function (b) { return b.type === 'ev' && b.progress >= 1 && !b.mahalle; }).length;
      if (out) h += '<div class="muted">' + out + ' ev hiçbir mahalleye bağlı değil (ibadet ihtiyacı karşılanmaz).</div>';
    }
    openModal(h, 'mahalle', showMahalle);
  }

  // --- Vakayiname ---
  function showKronik() {
    var h = tabsHtml('kronik') + '<h2>📖 Vakayiname</h2><div class="kronik">';
    g.log.forEach(function (l) { h += '<div><span class="muted">' + dateStr(g, l.gun) + '</span> — ' + l.txt + '</div>'; });
    h += '</div>';
    openModal(h, 'kronik', showKronik);
  }

  // --- İstatistik ---
  function spark(key, color, label) {
    var hs = g.history;
    if (hs.length < 2) return '';
    var max = Math.max.apply(null, hs.map(function (x) { return x[key]; })) || 1, min = Math.min(0, Math.min.apply(null, hs.map(function (x) { return x[key]; })));
    var pts = hs.map(function (x, i) { return (i / (hs.length - 1) * 300).toFixed(1) + ',' + (60 - (x[key] - min) / (max - min || 1) * 56).toFixed(1); }).join(' ');
    return '<div class="spark"><div>' + label + ' <b>' + hs[hs.length - 1][key] + '</b> <span class="muted">(en yüksek ' + max + ')</span></div><svg viewBox="0 0 300 62" preserveAspectRatio="none"><polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2"/></svg></div>';
  }
  function showIstat() {
    var h = tabsHtml('istat') + '<h2>📈 İstatistik</h2>';
    h += spark('p', '#2f6b4a', '👥 Nüfus') + spark('h', '#c8922c', '😊 Mutluluk') + spark('a', '#8b1e1e', '🪙 Akçe') + spark('f', '#2d4f86', '🍽️ Yiyecek');
    var counts = {};
    g.buildings.forEach(function (b) { counts[b.type] = (counts[b.type] || 0) + 1; });
    h += '<div class="sub">Binalar</div><div class="stock">';
    Object.keys(counts).forEach(function (k) { h += '<span>' + BUILDINGS[k].ikon + ' ' + BUILDINGS[k].ad + ' <b>' + counts[k] + '</b></span>'; });
    h += '</div>' + row('Kerpiç / Avlulu / Kâgir', countLevel(g, 1) - countLevel(g, 2) + ' / ' + (countLevel(g, 2) - countLevel(g, 3)) + ' / ' + countLevel(g, 3));
    h += row('Fethedilen bölge', ownedRegions(g) + ' / ' + REGIONS.length) + row('Oyun süresi', Math.floor(g.day / YEAR_DAYS) + ' yıl ' + (g.day % YEAR_DAYS) + ' gün');
    openModal(h, 'istat', showIstat);
  }

  // --- Olaylar ve talepler ---
  function showEvent() {
    var ev = EVENTS.filter(function (x) { return x.id === g.pendingEvent; })[0];
    if (!ev) { g.pendingEvent = null; return; }
    var h = '<h2>⚖️ Divan: ' + ev.baslik + '</h2><p>' + ev.metin + '</p><div class="opts">';
    ev.secenekler.forEach(function (o, n) {
      var ok = (!o.kosul || canAfford(g, o.kosul)) && (!o.kosulF || o.kosulF(g));
      h += '<button class="btn ' + (n === 0 ? 'ok' : '') + '" data-ev="' + n + '"' + (ok ? '' : ' disabled') + '>' + o.ad + '</button>';
    });
    h += '</div>';
    openModal(h, 'event');
  }
  function showDemand() {
    var d = g.pendingDemand, A = FACTIONS[d.f];
    var t = { harac: '💰 ' + A.ad + ' Haraç İstiyor', barisTeklif: '🕊️ ' + A.ad + ' Barış Teklif Ediyor', ticaretTeklif: '📜 ' + A.ad + ' Ticaret Teklif Ediyor' }[d.tip];
    var m = { harac: A.ad + ' elçisi ' + d.miktar + ' akçe haraç istiyor. Reddedersen ilişkiler bozulur ve savaş çıkabilir.', barisTeklif: 'Savaştan bıkan ' + A.ad + ' barış istiyor.', ticaretTeklif: A.ad + ' ticaret antlaşması öneriyor: daha çok kervan ve daha iyi fiyatlar.' }[d.tip];
    var h = '<h2>' + t + '</h2><p>' + m + '</p><div class="opts"><button class="btn ok" data-dem="1"' + (d.tip === 'harac' && g.res.akce < d.miktar ? ' disabled' : '') + '>' + (d.tip === 'harac' ? 'Öde (' + d.miktar + ' akçe)' : 'Kabul et') + '</button><button class="btn red" data-dem="0">Reddet</button></div>';
    openModal(h, 'event');
  }

  $('modalBox').onclick = function (e) {
    var el = e.target.closest('button');
    if (!el || el.disabled) return;
    var m = el.getAttribute('data-m');
    if (el.hasAttribute('data-ev')) {
      var ev = EVENTS.filter(function (x) { return x.id === g.pendingEvent; })[0];
      if (ev) applyEventChoice(g, ev.secenekler[+el.getAttribute('data-ev')]);
      closeModal(); updateHud(); needSync = true; return;
    }
    if (el.hasAttribute('data-dem')) { answerDemand(g, el.getAttribute('data-dem') === '1'); closeModal(); updateHud(); return; }
    if (el.hasAttribute('data-tr')) { showTrade(trade(g, el.getAttribute('data-tr'), +el.getAttribute('data-q'))); updateHud(); return; }
    if (el.hasAttribute('data-tax')) { g.taxLevel = +el.getAttribute('data-tax'); showBeylik(); return; }
    if (el.hasAttribute('data-law')) { showBeylik(enactLaw(g, el.getAttribute('data-law'))); return; }
    if (el.hasAttribute('data-sur')) { showBeylik(buildSur(g)); return; }
    if (el.hasAttribute('data-rec')) { showOrdu(recruit(g, el.getAttribute('data-rec'))); updateHud(); return; }
    if (el.hasAttribute('data-rec5')) { var u5 = el.getAttribute('data-rec5'), er = null; for (var k5 = 0; k5 < 5 && !er; k5++) er = recruit(g, u5); showOrdu(er); updateHud(); return; }
    if (el.hasAttribute('data-dis')) { dismiss(g, el.getAttribute('data-dis')); showOrdu(); return; }
    if (el.hasAttribute('data-reg')) { showHarita(null, el.getAttribute('data-reg')); return; }
    if (el.hasAttribute('data-ss')) {
      var u = el.getAttribute('data-ss'), dd = +el.getAttribute('data-d');
      seferSecim[u] = Math.max(0, Math.min(g.army[u], (seferSecim[u] || 0) + (dd === 99 ? g.army[u] : dd)));
      showHarita(null, document.querySelector('.reg.sel').getAttribute('data-reg')); return;
    }
    if (el.hasAttribute('data-sefer')) {
      var b2 = {}; UNIT_KEYS.forEach(function (u) { b2[u] = seferSecim[u] || 0; });
      var err = startCampaign(g, el.getAttribute('data-r'), b2, el.getAttribute('data-sefer'));
      if (!err) { seferSecim = {}; closeModal(); toast('🚩 Ordu yola çıktı'); } else showHarita(err, el.getAttribute('data-r'));
      return;
    }
    if (el.hasAttribute('data-dp')) { showDiplo(diploAction(g, el.getAttribute('data-f'), el.getAttribute('data-dp'))); return; }
    if (m === 'close') closeModal();
    else if (m === 'continue') { if (load()) { closeModal(); afterStart(); } else toast('Kayıt okunamadı'); }
    else if (m === 'new') { startNew(); closeModal(); afterStart(); showHelp(); }
    else if (m === 'newask') openModal('<h2>Yeni oyun?</h2><p>Mevcut oyun silinecek.</p><div class="opts"><button class="btn red" data-m="new">Evet, yeni oyun</button><button class="btn" data-m="close">Vazgeç</button></div>', 'confirm');
    else if (m === 'help') showHelp();
    else if (m === 'title') showTitle();
    else if (m === 'gorev') showQuests();
    else if (m === 'ticaret') showTrade();
    else if (m === 'beylik') showBeylik();
    else if (m === 'ordu') showOrdu();
    else if (m === 'harita') showHarita();
    else if (m === 'diplo') showDiplo();
    else if (m === 'ambar') showStock();
    else if (m === 'mahalle') showMahalle();
    else if (m === 'kronik') showKronik();
    else if (m === 'istat') showIstat();
    else if (m === 'save') { save(); closeModal(); }
    else if (m === 'quality') {
      var order = ['yuksek', 'orta', 'dusuk'], nq = order[(order.indexOf(quality()) + 1) % 3];
      store(function () { localStorage.setItem(QKEY, nq); });
      save(true);
      openModal('<h2>Grafik ayarı</h2><p>Yeni ayar: <b>' + ({ yuksek: 'Yüksek', orta: 'Orta', dusuk: 'Düşük' }[nq]) + '</b>. Oyun yeniden yüklenecek; kaldığın yerden devam edersin.</p><div class="opts"><button class="btn ok" data-m="reload">Tamam</button></div>', 'confirm');
    }
    else if (m === 'reload') location.reload();
  };

  function afterStart() {
    cancelBuild(); ui.selected = null; hidePanel();
    renderTabs(); renderCards(); updateHud();
  }

  // ---------- Bildirimler ----------
  function toast(msg) {
    var el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    var box = $('toasts');
    box.appendChild(el);
    while (box.children.length > 4) box.removeChild(box.firstChild);
    setTimeout(function () { el.style.opacity = '0'; }, 4200);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 4800);
  }

  // ---------- Yürüyen insanlar ----------
  function updateWalkers(dt) {
    var homes = [], works = [], market = null;
    for (var n = 0; n < g.buildings.length; n++) {
      var b = g.buildings[n];
      if (b.type === 'ev' && b.residents > 0) homes.push(b);
      else if (b.workers > 0 || b.builders > 0) works.push(b);
      if (b.type === 'pazar' && b.progress >= 1) market = b;
    }
    var target = Math.min(Math.round(g.pop * 0.6), 60) + (g.marketDay && market ? 15 : 0);
    if (!homes.length || !works.length) target = 0;
    while (walkers.length > target) walkers.pop();
    while (walkers.length < target) {
      var h = homes[(Math.random() * homes.length) | 0], c = centerOf(h);
      walkers.push({ x: c.x, y: c.y + 0.45, seed: Math.random() * 10, wait: Math.random() * 3, tx: null });
    }
    var sp = 0.9 * dt;
    walkers.forEach(function (w) {
      if (w.wait > 0) { w.wait -= dt; return; }
      if (w.tx === null) {
        var goWork = !w.atWork;
        var list = goWork ? works : homes;
        var b = (goWork && g.marketDay && market && Math.random() < 0.5) ? market : list[(Math.random() * list.length) | 0], d = BUILDINGS[b.type];
        w.tx = b.i + d.w / 2 + (Math.random() - 0.5) * 0.4 * d.w; w.ty = b.j + d.h + 0.15;
        w.goWork = goWork;
      }
      var dx = w.tx - w.x, dy = w.ty - w.y, dist = Math.hypot(dx, dy);
      if (dist < sp) { w.x = w.tx; w.y = w.ty; w.tx = null; w.atWork = w.goWork; w.wait = 1 + Math.random() * 4; }
      else { w.x += dx / dist * sp; w.y += dy / dist * sp; }
    });
  }

  // ---------- Döngü ----------
  function frame(now) {
    var dt = Math.min(0.1, (now - lastT) / 1000);
    lastT = now; time += dt;
    if (g) {
      var running = speed > 0 && !modalOpen && !g.gameOver;
      if (running) {
        g.dayFrac += dt * speed / DAY_SEC;
        var steps = 0;
        while (g.dayFrac >= 1 && steps < 4) {
          g.dayFrac -= 1; steps++;
          simDay(g);
          if (g.pendingEvent || g.pendingDemand) break;
        }
        updateWalkers(dt * Math.min(speed, 2));
      }
      while (g.notify.length) toast(g.notify.shift());
      if (g.autosave) { g.autosave = false; save(true); }
      if (!modalOpen) {
        if (g.pendingEvent) showEvent();
        else if (g.pendingDemand) showDemand();
        else if (g.gameOver && !g.goShown) { g.goShown = true; openModal('<h2>☠️ Beylik Dağıldı</h2><p>Halk dağıldı, ocak söndü. Ama tarih yeniden yazılabilir.</p><div class="opts"><button class="btn red" data-m="new">Yeni Oyun</button><button class="btn" data-m="kronik">📖 Vakayiname</button></div>', 'confirm'); }
        else if (g.victory && !g.vShown) { g.vShown = true; openModal('<h2>👑 Sultanlık İlan Edildi!</h2><p>Bütün bölgeler beyliğine bağlandı, Ulu Cami\'nin minarelerinden ezan yükseliyor. Bir cihan devletinin temelini attın! İstersen oynamaya devam edebilirsin.</p><div class="opts"><button class="btn ok" data-m="close">Devam et</button><button class="btn" data-m="kronik">📖 Vakayiname</button></div>', 'confirm'); }
      }
      uiTimer -= dt;
      if (uiTimer <= 0) {
        uiTimer = 0.3;
        updateHud();
        if (ui.selected && panelDay !== g.day) { panelDay = g.day; renderPanel(); }
        if (ui.buildType) setGhost(ui.ghost.i, ui.ghost.j);
        renderCardsAfford();
        if (g.titleIdx !== ui.lastTitle) { ui.lastTitle = g.titleIdx; renderCards(); }
        if (modalOpen && modalRefresh && modalDay !== g.day && modalKind !== 'trade' && modalKind !== 'harita') { modalDay = g.day; }
      }
      if (syncTimer <= 0 || needSync) { syncTimer = 0.2; needSync = false; Render3D.sync(g); }
      syncTimer -= dt;
      Render3D.frame(dt, time, g, ui, walkers, running);
    }
    requestAnimationFrame(frame);
  }

  // Android geri tuşu
  window.handleBack = function () {
    if (modalOpen && modalKind !== 'title' && modalKind !== 'event' && modalKind !== 'loading') { closeModal(); return true; }
    if (ui.buildType) { cancelBuild(); return true; }
    if (ui.selected) { ui.selected = null; hidePanel(); return true; }
    if (!modalOpen && g) { showMenu(); return true; }
    return false;
  };
  document.addEventListener('visibilitychange', function () { if (document.hidden) save(true); });
  window.addEventListener('pagehide', function () { save(true); });

  canvas.addEventListener('webglcontextlost', function (e) {
    e.preventDefault();
    save(true);
    var order = ['yuksek', 'orta', 'dusuk'], nq = order[Math.min(2, order.indexOf(quality()) + 1)];
    store(function () { localStorage.setItem(QKEY, nq); });
    openModal('<h2>Grafik belleği yetmedi</h2><p>Telefonun bu grafik ayarını kaldıramadı. Ayar <b>' + ({ yuksek: 'Yüksek', orta: 'Orta', dusuk: 'Düşük' }[nq]) + '</b> yapıldı. Oyun kaldığın yerden devam edecek.</p><div class="opts"><button class="btn ok" data-m="reload">Tamam</button></div>', 'loading');
  });

  // Test kolaylığı
  window.__beylik = { get g() { return g; }, ui: ui, startBuild: startBuild, setGhost: setGhost, confirmPlace: confirmPlace, simDay: function (n) { for (var k = 0; k < (n || 1); k++) simDay(g); }, show: { beylik: showBeylik, ordu: showOrdu, harita: showHarita, diplo: showDiplo, trade: showTrade, stock: showStock, mahalle: showMahalle, kronik: showKronik, istat: showIstat, quests: showQuests } };

  renderTabs();
  openModal('<div class="title-screen"><h1>🏯 BEYLİK</h1><div class="sub">Yükleniyor… <span id="lp">0</span>%</div></div>', 'loading');
  Render3D.init(canvas, {
    quality: quality(), base: 'tex',
    onProgress: function (p) { var el = $('lp'); if (el) el.textContent = Math.round(p * 100); }
  }).then(function () { ready = true; showTitle(); })
    .catch(function (e) { openModal('<h2>Hata</h2><p>3D grafik başlatılamadı: ' + e + '</p>', 'loading'); });
  requestAnimationFrame(frame);
})();
