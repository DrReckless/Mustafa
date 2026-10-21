// Ana döngü, arayüz ve dokunmatik kontroller (3D)
(function () {
  var SAVE_KEY = 'beylik_kayit_v1';
  var QKEY = 'beylik_kalite';
  var canvas = document.getElementById('c');
  var $ = function (id) { return document.getElementById(id); };

  var g = null;
  var speed = 1, lastSpeed = 1;
  var ui = { selected: null, ghost: null, buildType: null, tab: 'halk' };
  var walkers = [];
  var lastT = performance.now(), time = 0;
  var modalOpen = false, modalKind = null;
  var uiTimer = 0, panelDay = -1;
  var ready = false, syncTimer = 0, needSync = false;

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
    Render3D.R.cam.dist = 9;
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
    else if (n === 2) { var t = two(); gesture = { type: 'pinch', last: t, moved: true }; }
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!pointers[e.pointerId] || !gesture) return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (gesture.type === 'pan') {
      if (Math.hypot(e.clientX - gesture.sx, e.clientY - gesture.sy) > 9) gesture.moved = true;
      if (gesture.moved) {
        Render3D.pan(e.clientX - gesture.lx, e.clientY - gesture.ly);
        gesture.lx = e.clientX; gesture.ly = e.clientY;
      }
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
    if (ids.length === 1) {
      var p = pointers[ids[0]];
      gesture = { type: 'pan', sx: p.x, sy: p.y, lx: p.x, ly: p.y, t: 0, moved: true };
    } else if (ids.length === 0) gesture = null;
    if (wasTap && e.type === 'pointerup') onTap(e.clientX, e.clientY);
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('wheel', function (e) {
    e.preventDefault();
    Render3D.zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
  }, { passive: false });
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
    ui.buildType = type; ui.selected = null; hidePanel();
    var d = BUILDINGS[type];
    // Hayalet: ekranın ortasına en yakın uygun yer
    var t = Render3D.screenCenterTile() || { i: MAP_N / 2, j: MAP_N / 2 };
    var bi = t.i - Math.floor((d.w - 1) / 2), bj = t.j - Math.floor((d.h - 1) / 2);
    var found = null;
    for (var r = 0; r < 8 && !found; r++) {
      for (var dj = -r; dj <= r && !found; dj++) for (var di = -r; di <= r && !found; di++) {
        if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
        var c = canPlace(g, type, bi + di, bj + dj);
        if (c.ok || (c.reason === 'Kaynak yetersiz')) found = { i: bi + di, j: bj + dj };
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
    setGhost(ui.ghost.i, ui.ghost.j);
    renderCards();
    updateHud();
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
  $('tabs').onclick = function (e) {
    var t = e.target.getAttribute('data-t');
    if (!t) return;
    ui.tab = t; renderTabs(); renderCards();
  };
  function renderCards() {
    if (!g) return;
    var h = '';
    for (var k in BUILDINGS) {
      var d = BUILDINGS[k];
      if (d.kat !== ui.tab) continue;
      var cls = 'card' + (ui.buildType === k ? ' on' : '') + (canAfford(g, d.cost) ? '' : ' no');
      h += '<button class="' + cls + '" data-b="' + k + '"><div class="ic">' + d.ikon + '</div><div class="nm">' + d.ad + '</div><div>' + (fmtCost(d.cost) || 'Bedava') + '</div></button>';
    }
    $('cards').innerHTML = h;
  }
  $('cards').onclick = function (e) {
    var el = e.target.closest('[data-b]');
    if (!el) return;
    var k = el.getAttribute('data-b');
    if (ui.buildType === k) cancelBuild(); else startBuild(k);
  };

  // ---------- Üst çubuk ----------
  function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(1) + 'b' : Math.floor(n).toString(); }
  function updateHud() {
    if (!g) return;
    var cap = storageCap(g), h = '';
    RES_KEYS.forEach(function (k) {
      var v = g.res[k];
      var cls = 'r' + ((FOODS.indexOf(k) >= 0 || k === 'odun') && v < 5 ? ' low' : '') + (k !== 'akce' && v >= cap ? ' full' : '');
      h += '<span class="' + cls + '">' + RES[k].ikon + ' ' + fmt(v) + '</span>';
    });
    $('res').innerHTML = h;
    var s = season(g);
    $('date').textContent = SEASON_ICON[s] + ' ' + SEASONS[s] + ' ' + dayOfSeason(g) + ' · ' + year(g);
    var mood = g.happiness >= 70 ? '😊' : g.happiness >= 45 ? '😐' : '😠';
    $('popbox').textContent = '👥 ' + g.pop + '/' + housingCap(g) + '  ' + mood + ' ' + g.happiness + '  ⚒ ' + g.stats.unemployed + ' boşta';
    var q = QUESTS[g.questIdx];
    $('quest').innerHTML = q ? '📜 ' + q.ad : '📜 Tüm görevler tamam! ' + townTitle(g.pop) + ' büyümeye devam ediyor.';
    var btns = $('speed').children;
    for (var n = 0; n < btns.length; n++) btns[n].classList.toggle('on', +btns[n].getAttribute('data-s') === speed);
  }
  $('speed').onclick = function (e) {
    var s = e.target.getAttribute('data-s');
    if (s === null) return;
    speed = +s; if (speed > 0) lastSpeed = speed;
    updateHud();
  };
  $('menuBtn').onclick = function () { showMenu(); };
  $('quest').onclick = function () { showQuests(); };

  // ---------- Bina paneli ----------
  function showPanel() { $('panel').classList.remove('hidden'); renderPanel(); }
  function hidePanel() { $('panel').classList.add('hidden'); }
  function perDay(obj, eff) {
    var s = [];
    for (var k in obj) s.push(RES[k].ikon + ' ' + (Math.round(obj[k] * eff * 10) / 10) + '/gün');
    return s.join(', ');
  }
  function renderPanel() {
    var b = ui.selected;
    if (!b || g.buildings.indexOf(b) < 0) { hidePanel(); ui.selected = null; return; }
    var d = BUILDINGS[b.type];
    var h = '<button class="close" data-a="close">✕</button>';
    h += '<h3>' + d.ikon + ' ' + d.ad + '</h3>';
    h += '<div class="muted">' + d.desc + '</div>';
    if (b.progress < 1) {
      h += '<div class="row"><span>İnşaat</span><span>%' + Math.round(b.progress * 100) + '</span></div>';
      h += '<div class="bar"><div style="width:' + (b.progress * 100) + '%"></div></div>';
    } else {
      if (b.status) h += '<div class="row"><span>Durum</span><span>' + b.status + '</span></div>';
      if (d.workers) h += '<div class="row"><span>İşçi</span><span>' + b.workers + ' / ' + d.workers + '</span></div>';
      var eff = d.workers ? b.workers / d.workers : 1;
      if (d.prod && !d.farm) h += '<div class="row"><span>Üretim</span><span class="pos">' + perDay(d.prod, eff * (b.factor || 1)) + '</span></div>';
      if (d.input) h += '<div class="row"><span>Tüketim</span><span class="neg">' + perDay(d.input, eff) + '</span></div>';
      if (d.need === 'orman') h += '<div class="row"><span>Orman verimi</span><span>%' + Math.round((b.factor || 0) * 100) + '</span></div>';
      if (d.farm) {
        var fert = avgFert(g, b.i, b.j, d.w, d.h);
        h += '<div class="row"><span>Toprak verimi</span><span>%' + Math.round(fert * 100) + '</span></div>';
        h += '<div class="row"><span>Ekin</span><span>%' + Math.round(b.growth * 100) + '</span></div>';
        h += '<div class="bar"><div style="width:' + (b.growth * 100) + '%"></div></div>';
        if (b.harvest > 0) h += '<div class="row"><span>Kalan hasat</span><span>🌾 ' + Math.round(b.harvest) + '</span></div>';
        h += '<div class="muted">Tahmini hasat: ~' + Math.round(48 * Math.max(b.growth, 0) * fert) + ' buğday (güzün)</div>';
      }
      if (d.housing) {
        h += '<div class="row"><span>Sakinler</span><span>' + b.residents + ' / ' + d.housing + '</span></div>';
        h += '<div class="row"><span>Mutluluk</span><span>' + b.happy + '</span></div>';
        if (b.parts) b.parts.forEach(function (p) {
          h += '<div class="row muted"><span>' + p[0] + '</span><span class="' + (p[1] >= 0 ? 'pos' : 'neg') + '">' + (p[1] > 0 ? '+' : '') + p[1] + '</span></div>';
        });
      }
      if (d.service) h += '<div class="row"><span>Etki alanı</span><span>' + d.radius + ' karo · ' + (serviceActive(b) ? '<span class="pos">aktif</span>' : '<span class="neg">pasif</span>') + '</span></div>';
      if (d.storage) h += '<div class="row"><span>Depo sınırı</span><span>' + storageCap(g) + '</span></div>';
    }
    if (b.type === 'konak') {
      h += '<div class="row"><span>Unvan</span><span>' + townTitle(g.pop) + '</span></div>';
      h += '<div class="row"><span>Nüfus</span><span>' + g.pop + ' / ' + housingCap(g) + '</span></div>';
      h += '<div class="row"><span>Çalışan / boşta</span><span>' + g.stats.workers + ' / ' + g.stats.unemployed + '</span></div>';
      h += '<div class="row"><span>Yiyecek ihtiyacı</span><span>' + (Math.round(g.stats.foodNeed * 10) / 10) + '/gün</span></div>';
      h += '<div class="row"><span>Vergi geliri</span><span>🪙 ' + (Math.round(g.stats.income * 10) / 10) + '/gün</span></div>';
      h += '<div class="row"><span>Depo sınırı</span><span>' + storageCap(g) + '</span></div>';
      h += '<div style="margin-top:8px"><b>Öşür (vergi)</b></div><div class="btns">';
      TAX.forEach(function (t, n) {
        h += '<button class="btn' + (g.taxLevel === n ? ' red' : '') + '" data-a="tax" data-v="' + n + '">' + t.ad + '</button>';
      });
      h += '</div><div class="muted">Vergi arttıkça gelir artar ama halk mutsuz olur.</div>';
      if (g.mods.length) {
        h += '<div style="margin-top:8px"><b>Etkiler</b></div>';
        g.mods.forEach(function (m) {
          var e = m.mutluluk ? (m.mutluluk > 0 ? '+' : '') + m.mutluluk + ' mutluluk' : '+%' + Math.round(m.uretim * 100) + ' üretim';
          h += '<div class="row muted"><span>' + m.ad + '</span><span>' + e + ' · ' + m.gun + ' gün</span></div>';
        });
      }
    }
    h += '<div class="btns">';
    if (b.type === 'kervansaray' && b.progress >= 1) h += '<button class="btn ok" data-a="trade">🐫 Ticaret</button>';
    if (d.workers && b.progress >= 1) h += '<button class="btn" data-a="pause">' + (b.paused ? '▶ Devam ettir' : '⏸ Durdur') + '</button>';
    if (b.type !== 'konak') h += '<button class="btn red" data-a="demolish">Yık (%50 iade)</button>';
    h += '</div>';
    $('panel').innerHTML = h;
  }
  $('panel').onclick = function (e) {
    var el = e.target.closest('[data-a]');
    if (!el) return;
    var a = el.getAttribute('data-a'), b = ui.selected;
    if (a === 'close') { ui.selected = null; hidePanel(); return; }
    if (!b) return;
    if (a === 'tax') { g.taxLevel = +el.getAttribute('data-v'); computeHappiness(g, { hungry: false, variety: 2, cold: false }); }
    if (a === 'pause') { b.paused = !b.paused; assignWorkers(g); }
    if (a === 'demolish') {
      if (!el.dataset.sure) { el.dataset.sure = '1'; el.textContent = 'Emin misin? Tekrar dokun'; return; }
      demolish(g, b); needSync = true; ui.selected = null; hidePanel(); updateHud(); return;
    }
    if (a === 'trade') { showTrade(); return; }
    renderPanel(); updateHud();
  };

  // ---------- Pencereler ----------
  function openModal(html, kind) {
    $('modalBox').innerHTML = html;
    $('modal').classList.remove('hidden');
    modalOpen = true; modalKind = kind || null;
  }
  function closeModal() {
    $('modal').classList.add('hidden');
    modalOpen = false; modalKind = null;
  }

  function showTitle() {
    var h = '<div class="title-screen"><h1>🏯 BEYLİK</h1><div class="sub">Anadolu\'da bir uç beyliği kur. Obanı köye, köyünü kasabaya, kasabanı şehre çevir.</div><div class="opts">';
    if (hasSave()) h += '<button class="btn ok" data-m="continue">Devam Et</button>';
    h += '<button class="btn red" data-m="new">Yeni Oyun</button><button class="btn" data-m="help">Nasıl Oynanır?</button></div></div>';
    openModal(h, 'title');
  }
  function showMenu() {
    var h = '<h2>☰ Menü</h2><div class="opts">';
    h += '<button class="btn ok" data-m="close">Oyuna Dön</button>';
    h += '<button class="btn" data-m="quests">📜 Görevler</button>';
    h += '<button class="btn" data-m="konak">🏯 Bey Konağı (vergi)</button>';
    h += '<button class="btn" data-m="trade"' + (hasTrade(g) ? '' : ' disabled') + '>🐫 Ticaret' + (hasTrade(g) ? '' : ' (kervansaray gerekli)') + '</button>';
    h += '<button class="btn" data-m="save">💾 Kaydet</button>';
    h += '<button class="btn" data-m="help">❔ Nasıl Oynanır?</button>';
    h += '<button class="btn" data-m="quality">⚙️ Grafik: ' + ({ yuksek: 'Yüksek', orta: 'Orta', dusuk: 'Düşük' }[quality()]) + '</button>';
    h += '<button class="btn red" data-m="newask">Yeni Oyun</button>';
    h += '</div>';
    openModal(h, 'menu');
  }
  function showHelp() {
    var h = '<h2>Nasıl Oynanır?</h2>' +
      '<p>• Haritayı <b>tek parmakla kaydır</b>, <b>iki parmakla yakınlaştır</b>.</p>' +
      '<p>• Alttan bir bina seç, haritada bir yere dokun, sonra <b>İnşa Et</b>\'e bas (ya da aynı yere tekrar dokun).</p>' +
      '<p>• <b>Yiyecek</b>: Avcı ve ağıl et verir. Tarla → Değirmen → Fırın zinciri ekmek verir. Halk iki çeşit yiyecek bulursa daha mutlu olur.</p>' +
      '<p>• <b>Tarla</b> baharda ekilir, yazın büyür, <b>güzün hasat</b> edilir. Kış için buğday biriktir.</p>' +
      '<p>• <b>Kışın</b> evler odun yakar. Odun biterse halk üşür.</p>' +
      '<p>• <b>Çeşme, cami, pazar, hamam</b> etki alanındaki evleri mutlu eder. Mutlu halk yeni göçmen getirir.</p>' +
      '<p>• Her bina işçi ister. Nüfus artmazsa yeni ev yap ve halkı mutlu et.</p>' +
      '<p>• <b>Bey Konağı</b>\'na dokunarak vergiyi ayarla. <b>Kervansaray</b> kurunca ticaret açılır; kilim pahalıya satılır.</p>' +
      '<p>• Zaman zaman <b>Divan</b>\'a meseleler gelir; kararını ver.</p>' +
      '<div class="opts"><button class="btn ok" data-m="' + (g ? 'close' : 'title') + '">Tamam</button></div>';
    openModal(h, 'help');
  }
  function showQuests() {
    var h = '<h2>📜 Görevler</h2>';
    QUESTS.forEach(function (q, n) {
      var cls = n < g.questIdx ? 'qdone' : n === g.questIdx ? 'qnow' : '';
      h += '<div class="' + cls + '">' + (n < g.questIdx ? '✅ ' : n === g.questIdx ? '▶ ' : '• ') + q.ad + ' <span class="muted">(' + fmtCost(q.odul) + ')</span></div>';
    });
    h += '<div class="opts"><button class="btn ok" data-m="close">Kapat</button></div>';
    openModal(h, 'quests');
  }
  function showTrade(msg) {
    var h = '<h2>🐫 Kervansaray Ticareti</h2><div class="muted">Akçe: 🪙 ' + Math.floor(g.res.akce) + ' · Depo sınırı: ' + storageCap(g) + '</div>';
    if (msg) h += '<div class="neg"><b>' + msg + '</b></div>';
    h += '<table>';
    for (var k in PRICES) {
      h += '<tr><td>' + RES[k].ikon + ' ' + RES[k].ad + '</td><td>' + Math.floor(g.res[k]) + '</td>' +
        '<td><button class="btn ok" data-tr="' + k + '" data-q="10">Al 10 (' + PRICES[k].al * 10 + ')</button></td>' +
        '<td><button class="btn red" data-tr="' + k + '" data-q="-10">Sat 10 (' + PRICES[k].sat * 10 + ')</button></td></tr>';
    }
    h += '</table><div class="opts"><button class="btn" data-m="close">Kapat</button></div>';
    openModal(h, 'trade');
  }
  function showEvent() {
    var ev = null;
    for (var n = 0; n < EVENTS.length; n++) if (EVENTS[n].id === g.pendingEvent) ev = EVENTS[n];
    if (!ev) { g.pendingEvent = null; return; }
    var h = '<h2>⚖️ Divan: ' + ev.baslik + '</h2><p>' + ev.metin + '</p><div class="opts">';
    ev.secenekler.forEach(function (o, n) {
      var ok = !o.kosul || canAfford(g, o.kosul);
      h += '<button class="btn ' + (n === 0 ? 'ok' : '') + '" data-ev="' + n + '"' + (ok ? '' : ' disabled') + '>' + o.ad + '</button>';
    });
    h += '</div>';
    openModal(h, 'event');
  }

  $('modalBox').onclick = function (e) {
    var el = e.target.closest('button');
    if (!el || el.disabled) return;
    var m = el.getAttribute('data-m');
    if (el.hasAttribute('data-ev')) {
      var ev = EVENTS.filter(function (x) { return x.id === g.pendingEvent; })[0];
      if (ev) applyEventChoice(g, ev.secenekler[+el.getAttribute('data-ev')]);
      closeModal(); updateHud(); return;
    }
    if (el.hasAttribute('data-tr')) {
      var err = trade(g, el.getAttribute('data-tr'), +el.getAttribute('data-q'));
      showTrade(err); updateHud(); return;
    }
    if (m === 'close') closeModal();
    else if (m === 'continue') { if (load()) { closeModal(); afterStart(); } else toast('Kayıt okunamadı'); }
    else if (m === 'new') { startNew(); closeModal(); afterStart(); showHelp(); }
    else if (m === 'newask') openModal('<h2>Yeni oyun?</h2><p>Mevcut oyun silinecek.</p><div class="opts"><button class="btn red" data-m="new">Evet, yeni oyun</button><button class="btn" data-m="close">Vazgeç</button></div>', 'confirm');
    else if (m === 'help') showHelp();
    else if (m === 'title') showTitle();
    else if (m === 'quests') showQuests();
    else if (m === 'trade') showTrade();
    else if (m === 'save') { save(); closeModal(); }
    else if (m === 'quality') {
      var order = ['yuksek', 'orta', 'dusuk'], nq = order[(order.indexOf(quality()) + 1) % 3];
      store(function () { localStorage.setItem(QKEY, nq); });
      save(true);
      openModal('<h2>Grafik ayarı</h2><p>Yeni ayar: <b>' + ({ yuksek: 'Yüksek', orta: 'Orta', dusuk: 'Düşük' }[nq]) + '</b>. Oyun yeniden yüklenecek; kaldığın yerden devam edersin.</p><div class="opts"><button class="btn ok" data-m="reload">Tamam</button></div>', 'confirm');
    }
    else if (m === 'reload') location.reload();
    else if (m === 'konak') {
      closeModal();
      var k = g.buildings.filter(function (b) { return b.type === 'konak'; })[0];
      if (k) { ui.selected = k; showPanel(); Render3D.centerOn(k.i + 1, k.j + 1); }
    }
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
    while (box.children.length > 3) box.removeChild(box.firstChild);
    setTimeout(function () { el.style.opacity = '0'; }, 3200);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3800);
  }

  // ---------- Yürüyen insanlar ----------
  var CLOTH = ['#8b1e1e', '#2e5f9e', '#3f6b25', '#7a5a3a', '#c9a227', '#5b3d7a', '#d2d0c8'];
  var HATS = ['#f2efe6', '#8b1e1e', '#3a2a1a', '#d4a640'];
  function updateWalkers(dt) {
    var homes = [], works = [];
    for (var n = 0; n < g.buildings.length; n++) {
      var b = g.buildings[n];
      if (BUILDINGS[b.type].housing && b.residents > 0) homes.push(b);
      else if (b.workers > 0 || (b.progress < 1)) works.push(b);
    }
    var target = Math.min(g.pop, 45);
    if (!homes.length || !works.length) target = 0;
    while (walkers.length > target) walkers.pop();
    while (walkers.length < target) {
      var h = homes[(Math.random() * homes.length) | 0], c = centerOf(h);
      walkers.push({ x: c.x, y: c.y + 0.45, seed: Math.random() * 10, col: CLOTH[(Math.random() * CLOTH.length) | 0], hat: HATS[(Math.random() * HATS.length) | 0], wait: Math.random() * 3, tx: null });
    }
    var sp = 0.9 * dt;
    walkers.forEach(function (w) {
      if (w.wait > 0) { w.wait -= dt; return; }
      if (w.tx === null) {
        var goWork = !w.atWork;
        var list = goWork ? works : homes;
        var b = list[(Math.random() * list.length) | 0], c = centerOf(b), d = BUILDINGS[b.type];
        w.tx = b.i + d.w / 2 + (Math.random() - 0.5) * 0.4; w.ty = b.j + d.h + 0.15;
        w.goWork = goWork;
        w.carry = !goWork && Math.random() < 0.5 ? ['#9b6e3f', '#bdb6aa', '#e0c070', '#c0262d'][(Math.random() * 4) | 0] : null;
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
      var running = speed > 0 && !modalOpen;
      if (running) {
        g.dayFrac += dt * speed / DAY_SEC;
        var steps = 0;
        while (g.dayFrac >= 1 && steps < 4) {
          g.dayFrac -= 1; steps++;
          simDay(g);
          if (g.pendingEvent) break;
        }
        updateWalkers(dt * Math.min(speed, 2));
      }
      while (g.notify.length) toast(g.notify.shift());
      if (g.autosave) { g.autosave = false; save(true); }
      if (g.pendingEvent && !modalOpen) showEvent();
      uiTimer -= dt;
      if (uiTimer <= 0) {
        uiTimer = 0.25;
        updateHud();
        // Panel sadece gün değişince yenilenir; yoksa dokunulan buton kaybolur
        if (ui.selected && panelDay !== g.day) { panelDay = g.day; renderPanel(); }
        if (ui.buildType) { setGhost(ui.ghost.i, ui.ghost.j); }
        renderCardsAfford();
      }
      if (syncTimer <= 0 || needSync) { syncTimer = 0.2; needSync = false; Render3D.sync(g); }
      syncTimer -= dt;
      Render3D.frame(dt, time, g, ui, walkers, running);
    }
    requestAnimationFrame(frame);
  }
  function renderCardsAfford() {
    var cards = $('cards').children;
    for (var n = 0; n < cards.length; n++) {
      var k = cards[n].getAttribute('data-b');
      cards[n].classList.toggle('no', !canAfford(g, BUILDINGS[k].cost));
    }
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

  // Test kolaylığı
  window.__beylik = { get g() { return g; }, ui: ui, startBuild: startBuild, setGhost: setGhost, confirmPlace: confirmPlace, simDay: function (n) { for (var k = 0; k < (n || 1); k++) simDay(g); } };

  // Telefon grafik belleği yetmezse kaliteyi otomatik düşür
  canvas.addEventListener('webglcontextlost', function (e) {
    e.preventDefault();
    save(true);
    var order = ['yuksek', 'orta', 'dusuk'], cur = quality();
    var nq = order[Math.min(2, order.indexOf(cur) + 1)];
    store(function () { localStorage.setItem(QKEY, nq); });
    openModal('<h2>Grafik belleği yetmedi</h2><p>Telefonun bu grafik ayarını kaldıramadı. Ayar <b>' + ({ yuksek: 'Yüksek', orta: 'Orta', dusuk: 'Düşük' }[nq]) + '</b> yapıldı. Oyun kaldığın yerden devam edecek.</p><div class="opts"><button class="btn ok" data-m="reload">Tamam</button></div>', 'loading');
  });

  renderTabs();
  openModal('<div class="title-screen"><h1>🏯 BEYLİK</h1><div class="sub">Yükleniyor… <span id="lp">0</span>%</div></div>', 'loading');
  Render3D.init(canvas, {
    quality: quality(), base: 'tex',
    onProgress: function (p) { var el = $('lp'); if (el) el.textContent = Math.round(p * 100); }
  }).then(function () { ready = true; showTitle(); })
    .catch(function (e) { openModal('<h2>Hata</h2><p>3D grafik başlatılamadı: ' + e + '</p>', 'loading'); });
  requestAnimationFrame(frame);
})();
