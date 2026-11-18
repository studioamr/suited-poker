/* Animaciones en loop para promociones y tarjetas de juego (canvas). Si existe img/<nombre>.jpg, la foto las reemplaza. */
(function () {
  const G = '#2bd47d', GOLD = '#e7c873';
  function coin(x, cx, cy, r, sx, col) {
    x.save(); x.translate(cx, cy); x.scale(sx, 1);
    const g = x.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, '#fff'); g.addColorStop(.35, col); g.addColorStop(1, '#063b22');
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill(); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = r * .1; x.setLineDash([r * .3, r * .22]); x.beginPath(); x.arc(0, 0, r * .72, 0, 7); x.stroke(); x.setLineDash([]); x.restore();
  }
  function chip(x, cx, cy, r, col) {
    x.fillStyle = 'rgba(0,0,0,.45)'; x.beginPath(); x.ellipse(cx, cy + r * .2, r, r * .42, 0, 0, 7); x.fill();
    x.fillStyle = col; x.beginPath(); x.ellipse(cx, cy, r, r * .42, 0, 0, 7); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 2; x.setLineDash([5, 4]); x.beginPath(); x.ellipse(cx, cy, r * .7, r * .29, 0, 0, 7); x.stroke(); x.setLineDash([]);
  }
  function cardRect(x, cx, cy, w, h, rot, fill, txt, red) {
    x.save(); x.translate(cx, cy); x.rotate(rot); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 20; x.fillStyle = fill; x.beginPath(); x.roundRect ? x.roundRect(-w / 2, -h / 2, w, h, w * .1) : x.rect(-w / 2, -h / 2, w, h); x.fill(); x.shadowBlur = 0;
    if (txt) { x.fillStyle = red ? '#e11d48' : '#0b0f0d'; x.font = `700 ${w * .28}px Manrope,Arial`; x.fillText(txt, -w / 2 + w * .1, -h / 2 + w * .34); }
    x.restore();
  }
  const SCENES = {
    welcome(x, w, h, t, S) { // monedas que caen y forman una pila
      if (!S.c) S.c = Array.from({ length: 26 }, (_, i) => ({ x: w * (.15 + Math.random() * .7), y: -Math.random() * h, v: 1 + Math.random() * 2, r: 12 + Math.random() * 14, s: Math.random() * 6 }));
      S.c.forEach(c => { c.y += c.v * 1.6; if (c.y > h + 40) { c.y = -40; c.x = w * (.15 + Math.random() * .7); } coin(x, c.x, c.y, c.r, Math.cos(t * 3 + c.s), G); });
    },
    daily(x, w, h, t) { // moneda girando con rayos
      const cx = w * .72, cy = h * .42; x.save(); x.translate(cx, cy); x.rotate(t * .3);
      for (let i = 0; i < 16; i++) { x.rotate(Math.PI / 8); const g = x.createLinearGradient(0, 0, 0, -h); g.addColorStop(0, 'rgba(231,200,115,.35)'); g.addColorStop(1, 'rgba(231,200,115,0)'); x.fillStyle = g; x.beginPath(); x.moveTo(-8, 0); x.lineTo(-30, -h); x.lineTo(30, -h); x.lineTo(8, 0); x.fill(); }
      x.restore(); coin(x, cx, cy, Math.min(w, h) * .2, Math.cos(t * 2.2), GOLD);
    },
    sng(x, w, h, t, S) { // trofeo con partículas
      const cx = w * .72, cy = h * .44, s = Math.min(w, h) * .32;
      if (!S.p) S.p = Array.from({ length: 50 }, () => ({ a: Math.random() * 6.28, r: Math.random(), v: .3 + Math.random() }));
      S.p.forEach(p => { p.r += .004 * p.v; if (p.r > 1) p.r = 0; const rr = p.r * s * 1.6; x.fillStyle = `rgba(201,166,255,${1 - p.r})`; x.fillRect(cx + Math.cos(p.a) * rr, cy + Math.sin(p.a) * rr - p.r * 30, 2, 2); });
      const g = x.createLinearGradient(cx - s, cy - s, cx + s, cy + s); g.addColorStop(0, '#fff3c4'); g.addColorStop(.5, GOLD); g.addColorStop(1, '#7a5a12'); x.fillStyle = g; x.shadowColor = GOLD; x.shadowBlur = 30 + Math.sin(t * 2) * 10;
      x.beginPath(); x.moveTo(cx - s * .55, cy - s * .6); x.lineTo(cx + s * .55, cy - s * .6); x.quadraticCurveTo(cx + s * .5, cy + s * .15, cx + s * .08, cy + s * .25); x.lineTo(cx + s * .08, cy + s * .5); x.lineTo(cx + s * .3, cy + s * .62); x.lineTo(cx - s * .3, cy + s * .62); x.lineTo(cx - s * .08, cy + s * .5); x.lineTo(cx - s * .08, cy + s * .25); x.quadraticCurveTo(cx - s * .5, cy + s * .15, cx - s * .55, cy - s * .6); x.fill(); x.shadowBlur = 0;
    },
    climb(x, w, h, t) { // tarjetas de nivel abriéndose en abanico
      const M = [['#1f7a4d', '#062818'], ['#f2f4f7', '#6c737c'], ['#fbe8a6', '#8a6416'], ['#f4fbff', '#7d93a1'], ['#3a3a3f', '#000'], ['#e4f8ff', '#2d7fb0'], ['#ffe3fb', '#3c2f9e']];
      const cx = w * .7, cy = h * .62, cw = Math.min(w, h) * .42, sp = .5 + .5 * Math.sin(t * .9);
      M.forEach((m, i) => { const a = (i - 3) * .17 * sp; x.save(); x.translate(cx, cy); x.rotate(a); x.translate(0, -cw * .35); const g = x.createLinearGradient(-cw / 2, -cw * .32, cw / 2, cw * .32); g.addColorStop(0, m[0]); g.addColorStop(1, m[1]); x.fillStyle = g; x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 16; x.beginPath(); x.roundRect ? x.roundRect(-cw / 2, -cw * .32, cw, cw * .63, 10) : x.rect(-cw / 2, -cw * .32, cw, cw * .63); x.fill(); x.restore(); });
    },
    cash(x, w, h, t) { // pilas de fichas que crecen
      const cols = ['#111', G, GOLD, '#e11d48', '#f4f4f5'], base = h * .78;
      cols.forEach((c, i) => { const n = 4 + Math.floor((Math.sin(t * 1.3 + i) * .5 + .5) * 9), cx = w * (.2 + i * .15); for (let k = 0; k < n; k++) chip(x, cx, base - k * 7, 22, c); });
    },
    sngcard(x, w, h, t) { // reloj de ciegas
      const cx = w / 2, cy = h * .52, r = Math.min(w, h) * .3, p = (t * .12) % 1;
      x.lineWidth = 10; x.strokeStyle = 'rgba(255,255,255,.08)'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
      x.strokeStyle = GOLD; x.shadowColor = GOLD; x.shadowBlur = 18; x.beginPath(); x.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + p * 6.283); x.stroke(); x.shadowBlur = 0;
      const lv = 1 + Math.floor(t * .12) % 10; x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = `700 ${r * .42}px Unbounded,Arial`; x.fillText('LV ' + lv, cx, cy + r * .12); x.font = `600 ${r * .18}px JetBrains Mono,monospace`; x.fillStyle = GOLD; x.fillText(`${20 * lv}/${40 * lv}`, cx, cy + r * .45); x.textAlign = 'left';
    },
    private(x, w, h, t) { // candado con el código de la mesa
      const cx = w / 2, cy = h * .5, s = Math.min(w, h) * .26, C = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let code = ''; for (let i = 0; i < 6; i++) code += C[(Math.floor(t * 4 + i * 7) * (i + 3)) % C.length];
      x.strokeStyle = '#7fd8ff'; x.lineWidth = 8; x.shadowColor = '#7fd8ff'; x.shadowBlur = 20; x.beginPath(); x.arc(cx, cy - s * .35, s * .45, Math.PI, 0); x.stroke();
      x.fillStyle = 'rgba(127,216,255,.12)'; x.strokeRect(cx - s * .75, cy - s * .35, s * 1.5, s * 1.1); x.fillRect(cx - s * .75, cy - s * .35, s * 1.5, s * 1.1); x.shadowBlur = 0;
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = `700 ${s * .32}px JetBrains Mono,monospace`; x.fillText(code, cx, cy + s * .32); x.textAlign = 'left';
    }
  };
  const live = [];
  document.querySelectorAll('[data-art]').forEach(el => {
    const fn = SCENES[el.dataset.art]; if (!fn) return;
    const c = document.createElement('canvas'); c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'; if (getComputedStyle(el).position === 'static') el.style.position = 'relative'; el.appendChild(c);
    live.push({ el, c, x: c.getContext('2d'), fn, S: {} });
  });
  const vis = new Set(); const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)), { threshold: 0 });
  live.forEach(l => io.observe(l.el));
  function frame(ms) {
    const t = ms / 1000;
    live.forEach(l => { if (!vis.has(l.el) || !l.c.isConnected) return; const d = Math.min(2, devicePixelRatio), w = l.el.clientWidth, h = l.el.clientHeight; if (l.c.width !== w * d) { l.c.width = w * d; l.c.height = h * d; }
      l.x.setTransform(d, 0, 0, d, 0, 0); l.x.clearRect(0, 0, w, h); l.fn(l.x, w, h, t, l.S); });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
