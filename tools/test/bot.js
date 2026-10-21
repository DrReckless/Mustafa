// Basit bot: oyunu hızlı oynatıp dengeyi ölçer. Kullanım: node bot.js [gün] [tohum]
const fs = require('fs'), vm = require('vm'), path = require('path');
const ctx = { console, Math, JSON, Object, Array, Int32Array, Uint8Array, Infinity };
vm.createContext(ctx);
for (const f of ['data.js', 'world.js', 'sim.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../../www/js', f), 'utf8'), ctx);
const DAYS = +process.argv[2] || 1200, SEED = +process.argv[3] || 7;
vm.runInContext(`
var g = newGame(${SEED}); var DAYSX = ${DAYS};
var c = MAP_N / 2;
function place(t) {
  var d = BUILDINGS[t];
  for (var r = 3; r < 28; r++) for (var j = c - r; j <= c + r; j++) for (var i = c - r; i <= c + r; i++) {
    if (Math.max(Math.abs(i - c), Math.abs(j - c)) !== r) continue;
    var p = canPlace(g, t, i, j);
    if (p.ok && !/Eksik/.test(p.info || '')) { placeBuilding(g, t, i, j); return true; }
  }
  return false;
}
function sites() { return g.buildings.filter(function (b) { return b.progress < 1; }).length; }
var plan = [
  ['oduncu',1],['avci',1],['tarla',1],['degirmen',1],['firin',1],['ambar',1],['balikci',1],['tasocagi',1],['depo',1],['agil',1],['tarla',2],
['dokumaci',1],['pazar',1],['mescit',1],['cesme',1],['bostan',1],['oduncu',2],['mandira',1],['arici',1],['tarla',3],['kilocagi',1],['comlekci',1],['ambar',2],
  ['maden',1],['komurcu',1],['demirci',1],['cami',1],['hamam',1],['kervansaray',1],['bag',1],['meyve',1],['pekmezhane',1],['kisla',1],['silahhane',1],['subasi',1],['tarla',5],['depo',2],['oduncu',3],['agil',2],['dokumaci',2],['ahir',1],['yayci',1],['imaret',1],['kilimci',1],['tekke',1],
  ['medrese',1],['darussifa',1],['kadi',1],['bedesten',1],['mescit',3],['tarla',7],['ambar',4],['firin',2],['degirmen',2],['mehterhane',1],['ulucami',1]
];
var log = [], lastTitle = 0;
for (var day = 0; day < ${DAYS}; day++) {
  // olaylara son seçenek
  if (g.pendingEvent) { var ev = EVENTS.filter(function (e) { return e.id === g.pendingEvent; })[0]; applyEventChoice(g, ev.secenekler[ev.secenekler.length - 1]); }
  if (g.pendingDemand) answerDemand(g, g.pendingDemand.tip !== 'harac' || g.res.akce > g.pendingDemand.miktar * 2);
  if (g.laws.length < lawSlots(g)) { ['imece','kitlik','ahi','vakif','timar','kervan'].some(function (l) { return !hasLaw(g,l) && !enactLaw(g, l); }); }
  if (season(g) === 0 && dayOfSeason(g) === 1) g.buildings.forEach(function(b){ if (BUILDINGS[b.type].farm) b.crop = b.soil < 0.6 ? 'nadas' : (b.id % 3 === 0 ? 'arpa' : 'bugday'); });
  // ticaret: alet ve yiyecek
  if (tradeAvailable(g)) {
    if (g.res.alet < 8 && g.res.akce > 60) trade(g, 'alet', 2);
    if (foodTotal(g) < g.pop * 1.5 && g.res.akce > 80) trade(g, 'ekmek', 10);
    ['kilim','pekmez','bal'].forEach(function(k){ if (g.res[k] > 30) trade(g, k, -10); });
  }
  var foodDays = foodTotal(g) / Math.max(0.1, g.stats.foodNeed || 1);
  var woodNeed = countB(g, 'oduncu') < Math.ceil(g.pop / 14) + countB(g,'komurcu');
  if (g.res.odun < 50 && woodNeed && sites() < 4) place('oduncu');
  if (sites() < 3 && g.stats.unemployed >= 2) {
    if (false) ;
    else if (foodDays < 50 && countB(g,'avci') + countB(g,'balikci') < 1 + g.pop / 25) place(countB(g,'balikci') <= countB(g,'avci') ? 'balikci' : 'avci');
    else if (foodDays < 50 && countB(g,'tarla') < 1 + g.pop / 20) place('tarla');
  }
  if (sites() < 3) {
    if (g.pop >= housingCap(g) - 3 && g.res.odun > 30) place('ev');
    else if (g.stats.unemployed >= 2 || sites() === 0) for (var n = 0; n < plan.length; n++) { var t = plan[n][0]; if (countB(g, t) < plan[n][1] && unlocked(g, t)) { if (place(t)) break; } }
  }
  simDay(g); g.notify.length = 0;
  if (g.titleIdx !== lastTitle) { lastTitle = g.titleIdx; log.push('GÜN ' + g.day + ' (' + (g.day*4/60).toFixed(0) + ' dk@1x): ' + TITLES[g.titleIdx].ad); }
  if (g.day % (DAYSX < 300 ? 10 : 120) === 0) log.push('Yıl ' + (g.day/120) + ': pop=' + g.pop + '/' + housingCap(g) + ' mut=' + g.happiness + ' akce=' + Math.round(g.res.akce) + ' nufuz=' + Math.round(g.res.nufuz) + ' yemek=' + Math.round(foodTotal(g)) + ' cesit=' + g.stats.variety + ' odun=' + Math.round(g.res.odun) + ' tas=' + Math.round(g.res.tas) + ' alet=' + g.res.alet.toFixed(1) + ' L2=' + countLevel(g,2) + ' L3=' + countLevel(g,3) + ' suc=' + Math.round(g.crime) + ' bina=' + g.buildings.length + ' boşta=' + g.stats.unemployed + ' gorev=' + g.questIdx + ' insaat=' + sites() + ' ev=' + countB(g,'ev') + (g.salgin?' SALGIN':''));
  if (g.gameOver) { log.push('OYUN BİTTİ gün ' + g.day); break; }
}
`, ctx);
console.log(ctx.log.join('\n'));
vm.runInContext("var st = g.buildings.map(function(b){ return b.type + '[' + b.workers + '/' + (BUILDINGS[b.type].workers||0) + ' b' + b.builders + '] ' + b.status + (b.factor!==1?' f'+b.factor.toFixed(2):''); }).join('\\n'); var wf = 'workforce ' + workforce(g) + ' used ' + g.stats.workers;", ctx);
if (process.argv[4]) console.log(ctx.st + '\n' + ctx.wf);
vm.runInContext("var kr = g.log.slice(0, 25).map(function(l){ return dateStr(g,l.gun)+': '+l.txt; }).join('\\n');", ctx); console.log('--- VAKAYİNAME\n' + ctx.kr);
