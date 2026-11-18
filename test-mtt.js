// Simula torneos multimesa completos: registro, registro tardío, recompras, KO, balanceo y premios.
require('./engine.js'); require('./mttcore.js');
const H = globalThis.Holdem, M = globalThis.MTT; let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } };
let seed = 3; Math.random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
for (const N of [12, 40, 95]) {
  let now = 1.8e12; Date.now = () => now;
  const T = M.create({ code: 'MT', name: 'test', hostUid: 'h', money: { usd: 50 }, bounty: 10, rebuy: { cost: 50, chips: 3000, untilLevel: 2 }, lateLevel: 3, stack: 3000, levelMs: 120000, bb0: 40 });
  for (let i = 0; i < N; i++) ok(!M.register(T, { uid: 'p' + i, name: 'P' + i }, now), 'register');
  ok(!M.start(T, now), 'start'); ok(T.tables.length === Math.ceil(N / 9), 'tables ' + T.tables.length);
  let late = 0, reb = 0, steps = 0; const maxT = T.tables.length;
  while (!T.finished && steps < 400000) {
    steps++; now += 400;
    if (late < 5 && M.lateOpen(T, now) && steps % 500 === 0) { ok(!M.register(T, { uid: 'L' + late, name: 'Late' + late }, now), 'late reg'); late++; }
    T.order.forEach(u => { const p = T.players[u]; if (p.wait && Math.random() < .02) { if (!M.doRebuy(T, u)) reb++; } });
    M.tick(T, now);
    T.tables.forEach(g => {
      if (g.closed || !H.inBetting(g)) return; const p = g.seats[g.toAct]; if (!p) return; const r = Math.random(), toCall = g.curBet - p.bet;
      const e = r < .25 ? H.act(g, p.uid, 'fold') : r < .85 ? H.act(g, p.uid, toCall ? 'call' : 'check') : H.act(g, p.uid, 'raise', p.bet + p.stack);
      if (e) H.act(g, p.uid, toCall ? 'call' : 'check');
    });
    if (steps % 997 === 0) { // las fichas nunca se crean ni se pierden: iniciales + registros tardíos + recompras
      const chips = T.tables.reduce((a, g) => a + g.seats.reduce((b, s) => b + (s ? s.stack + (H.inBetting(g) ? s.contrib : 0) : 0), 0), 0);
      const expect = (N + late) * 3000 + reb * 3000; ok(chips === expect, `chips ${chips} vs ${expect} N${N} step${steps}`); if (fails > 3) break;
    }
    const open = T.tables.filter(g => !g.closed); if (open.length > 1) { const c = open.map(g => g.seats.filter(Boolean).length); T.__imb = Math.max(...c) - Math.min(...c) > 2 ? (T.__imb || 0) + 1 : 0; ok(T.__imb < 300, 'balance stuck ' + c); if (fails > 3) break; }
  }
  ok(T.finished, 'finished N' + N); const n = T.order.length;
  const places = T.order.map(u => T.players[u].place).sort((a, b) => a - b); ok(places.every((p, i) => p === i + 1), 'places unique 1..' + n);
  if (T.results) {
    const prizes = T.results.reduce((a, r) => a + r.prize, 0), ko = T.results.reduce((a, r) => a + r.koUsd, 0);
    ok(Math.abs(prizes - T.pool) < 1, `prizes ${prizes} pool ${T.pool}`); ok(Math.abs(ko - n * 10) < 0.01, `ko ${ko} vs ${n * 10}`);
    ok(T.tables.filter(g => !g.closed).length === 1, 'final table only');
    console.log(`N=${N}+${late} late · rebuys ${reb} · ${maxT} tables → final · pool $${T.pool} · winner ${T.results[0].name} $${T.results[0].total} · ${T.results.filter(r => r.prize > 0).length} paid · ${steps} steps`);
  }
  if (fails > 3) break;
}
console.log(fails ? fails + ' failures' : 'MTT tests passed');
