const fs = require('fs'), vm = require('vm'), path = require('path');
const ctx = { console, Math, JSON, Object, Array, Int32Array, Uint8Array, Infinity };
vm.createContext(ctx);
for (const f of ['data.js', 'world.js', 'sim.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../../www/js', f), 'utf8'), ctx);
vm.runInContext(`
var g = newGame(5), c = MAP_N/2;
g.titleIdx = 2; g.pop = 80;
for (var k in g.res) g.res[k] = 300; g.res.akce = 3000; g.res.nufuz = 200; g.res.silah = 60; g.res.yay = 30; g.res.at = 30;
['kisla'].concat(Array(14).fill('ev')).forEach(function(t){ for (var r=4;r<25;r++){ var ok=false; for (var j=c-r;j<=c+r&&!ok;j++) for (var i=c-r;i<=c+r&&!ok;i++) if (canPlace(g,t,i,j).ok){ placeBuilding(g,t,i,j).progress=1; ok=true;} if(ok)break; } });
g.pop = 80; assignWorkers(g);
var errs = [];
for (var k=0;k<15;k++) { var e = recruit(g,'azap'); if (e) errs.push(e); }
for (var k=0;k<8;k++) recruit(g,'okcu');
for (var k=0;k<8;k++) recruit(g,'akinci');
enactLaw(g,'timar'); for (var k=0;k<5;k++) recruit(g,'sipahi');
console.log('ordu', JSON.stringify(g.army), 'pop', g.pop, errs[0]);
console.log('sefer', startCampaign(g,'yenisehir',{azap:10,okcu:6,akinci:6,sipahi:5},'fetih'));
for (var d=0; d<15; d++) { simDay(g); if (g.pendingEvent) { var ev=EVENTS.filter(function(e){return e.id===g.pendingEvent;})[0]; applyEventChoice(g, ev.secenekler[ev.secenekler.length-1]); } }
console.log(JSON.stringify(g.lastBattle), 'bölge', g.regions.yenisehir.sahip, 'sefer', JSON.stringify(g.sefer));
for (var d=0; d<10; d++) simDay(g);
console.log('dönüş', JSON.stringify(g.army), JSON.stringify(g.sefer));
console.log('akın', startCampaign(g,'karacahisar',{azap:0,okcu:0,akinci:4,sipahi:3},'akin'));
for (var d=0; d<20; d++) { simDay(g); g.pendingEvent=null; g.pendingDemand=null; }
console.log(JSON.stringify(g.lastBattle), 'akce', Math.round(g.res.akce), 'bizans', JSON.stringify(g.fac.bizans));
console.log(g.log.slice(0,8).map(function(l){return dateStr(g,l.gun)+': '+l.txt;}).join('\\n'));
`, ctx);
