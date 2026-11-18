/* Mesa 3D animada de la portada: se reparten las cartas, se voltean, caen fichas al bote. Three.js r128. */
(function () {
  const host = document.getElementById('heroImg'); if (!host || !window.THREE) return;
  const T = THREE, W = () => host.clientWidth, Hh = () => host.clientHeight;
  const R = new T.WebGLRenderer({ antialias: true, alpha: true }); R.setPixelRatio(Math.min(2, devicePixelRatio)); R.setSize(W(), Hh());
  R.outputEncoding = T.sRGBEncoding; R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  host.innerHTML = ''; host.appendChild(R.domElement);
  const S = new T.Scene(); S.fog = new T.Fog(0x020403, 6, 13);
  const C = new T.PerspectiveCamera(36, W() / Hh(), .1, 50); C.position.set(0, 3.1, 4.6); C.lookAt(0, 0, .2);

  // luces
  S.add(new T.AmbientLight(0x406050, .55));
  const spot = new T.SpotLight(0xffffff, 1.6, 14, Math.PI / 5, .45, 1.2); spot.position.set(0, 6, 1.2); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); S.add(spot); S.add(spot.target);
  const gl = new T.PointLight(0x2bd47d, 1.4, 6); gl.position.set(0, .6, 0); S.add(gl);

  // mesa: borde, paño con textura y anillo de luz verde
  const noise = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); const g = x.createRadialGradient(128, 110, 10, 128, 128, 170); g.addColorStop(0, '#1d7a4c'); g.addColorStop(.6, '#0d4128'); g.addColorStop(1, '#05180f'); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    const d = x.getImageData(0, 0, 256, 256); for (let i = 0; i < d.data.length; i += 4) { const n = (Math.random() - .5) * 14; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; } x.putImageData(d, 0, 0);
    x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 2; x.beginPath(); x.ellipse(128, 128, 96, 96, 0, 0, 7); x.stroke(); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t; })();
  const tbl = new T.Group(); S.add(tbl);
  const rail = new T.Mesh(new T.CylinderGeometry(1.0, 1.04, .16, 96), new T.MeshStandardMaterial({ color: 0x15191a, roughness: .55, metalness: .3 })); rail.scale.set(2.05, 1, 1.15); rail.position.y = -.08; rail.receiveShadow = true; tbl.add(rail);
  const felt = new T.Mesh(new T.CylinderGeometry(.92, .92, .02, 96), new T.MeshStandardMaterial({ map: noise, roughness: .95 })); felt.scale.set(2.05, 1, 1.15); felt.position.y = .01; felt.receiveShadow = true; tbl.add(felt);
  const ring = new T.Mesh(new T.TorusGeometry(.985, .012, 12, 160), new T.MeshBasicMaterial({ color: 0x2bd47d })); ring.rotation.x = Math.PI / 2; ring.scale.set(2.05, 1.15, 1); ring.position.y = .02; tbl.add(ring);
  const glow = new T.Mesh(new T.TorusGeometry(.985, .06, 12, 160), new T.MeshBasicMaterial({ color: 0x2bd47d, transparent: true, opacity: .14 })); glow.rotation.x = Math.PI / 2; glow.scale.set(2.05, 1.15, 1); glow.position.y = .02; tbl.add(glow);

  // cartas (cara dibujada en canvas + reverso)
  function face(r, s) { const c = document.createElement('canvas'); c.width = 256; c.height = 360; const x = c.getContext('2d'); x.fillStyle = '#f6f8f6'; x.beginPath(); x.roundRect ? x.roundRect(0, 0, 256, 360, 22) : x.rect(0, 0, 256, 360); x.fill();
    const red = s === '♥' || s === '♦'; x.fillStyle = red ? '#e11d48' : '#0b0f0d'; x.font = 'bold 74px Arial'; x.fillText(r, 22, 82); x.font = '64px Arial'; x.fillText(s, 26, 150); x.font = '150px Arial'; x.textAlign = 'center'; x.fillText(s, 128, 255);
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t; }
  const back = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 360; const x = c.getContext('2d'); x.fillStyle = '#071510'; x.fillRect(0, 0, 256, 360); x.strokeStyle = 'rgba(43,212,125,.6)'; x.lineWidth = 6; x.strokeRect(14, 14, 228, 332);
    x.strokeStyle = 'rgba(43,212,125,.12)'; x.lineWidth = 3; for (let i = -360; i < 360; i += 16) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 360, 360); x.stroke(); } x.fillStyle = '#2bd47d'; x.font = '90px Arial'; x.textAlign = 'center'; x.fillText('♠', 128, 210); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t; })();
  const geo = new T.PlaneGeometry(.3, .42);
  function card(r, s) { const g = new T.Group(); const f = new T.Mesh(geo, new T.MeshStandardMaterial({ map: face(r, s), roughness: .4 })); const b = new T.Mesh(geo, new T.MeshStandardMaterial({ map: back, roughness: .5 })); b.rotation.y = Math.PI; f.castShadow = b.castShadow = true; g.add(f, b); S.add(g); return g; }
  const BOARD = [['A', '♠'], ['K', '♠'], ['Q', '♠'], ['J', '♠'], ['10', '♠']];
  const cards = BOARD.map(([r, s]) => card(r, s)), hole = [card('A', '♥'), card('A', '♦')];

  // fichas
  const COLS = [0x111111, 0x2bd47d, 0xe7c873, 0xe11d48, 0xf4f4f5];
  const chipGeo = new T.CylinderGeometry(.075, .075, .022, 40);
  const chipMat = COLS.map(c => new T.MeshStandardMaterial({ color: c, roughness: .35, metalness: .25 }));
  const edgeMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: .4 });
  function chip(ci) { const g = new T.Group(); const m = new T.Mesh(chipGeo, chipMat[ci]); m.castShadow = true; g.add(m); const e = new T.Mesh(new T.TorusGeometry(.068, .006, 6, 24), edgeMat); e.rotation.x = Math.PI / 2; e.position.y = .012; g.add(e); S.add(g); return g; }
  const stacks = [[-1.25, .45, 1, 9], [-1.05, .62, 0, 6], [1.2, .5, 2, 8], [1.02, .66, 3, 5], [-.3, .78, 4, 4], [.35, .78, 1, 7]];
  stacks.forEach(([x, z, c, n]) => { for (let i = 0; i < n; i++) { const k = chip(c); k.position.set(x + (Math.random() - .5) * .01, .035 + i * .023, z + (Math.random() - .5) * .01); k.rotation.y = Math.random() * 6; } });
  const pot = []; for (let i = 0; i < 14; i++) { const k = chip(i % 5); k.visible = false; pot.push(k); }

  // polvo en el aire
  const pg = new T.BufferGeometry(), pc = new Float32Array(300 * 3); for (let i = 0; i < 300; i++) { pc[i * 3] = (Math.random() - .5) * 8; pc[i * 3 + 1] = Math.random() * 4; pc[i * 3 + 2] = (Math.random() - .5) * 6; }
  pg.setAttribute('position', new T.BufferAttribute(pc, 3)); const dust = new T.Points(pg, new T.PointsMaterial({ color: 0x9fe8c1, size: .018, transparent: true, opacity: .55 })); S.add(dust);

  // ciclo: repartir → voltear flop/turn/river → fichas al bote → recoger
  const DECK = new T.Vector3(0, .9, -1.6), spots = BOARD.map((_, i) => new T.Vector3(-.72 + i * .36, .025, -.05));
  const holeSpots = [new T.Vector3(-.17, .03, .62), new T.Vector3(.17, .03, .62)];
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, cl = (a, b, t) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  function place(g, from, to, t, flipAt, flipDur, tilt) {
    const k = ease(t); g.position.lerpVectors(from, to, k); g.position.y += Math.sin(k * Math.PI) * .35;
    const f = ease(cl(flipAt, flipAt + flipDur, t)); g.rotation.set(-Math.PI / 2, 0, tilt || 0); g.rotateY(Math.PI * (1 - f));
  }
  let mx = 0, my = 0; addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  const CYCLE = 11, clock = new T.Clock();
  function frame() {
    const t = clock.getElapsedTime(), c = t % CYCLE;
    hole.forEach((g, i) => { const p = cl(.2 + i * .25, .9 + i * .25, c), fl = cl(1.4, 2, c); place(g, DECK, holeSpots[i], p, 0, 0, (i ? .12 : -.12)); g.rotation.set(-Math.PI / 2 + .02, 0, i ? .12 : -.12); g.rotateY(Math.PI * (1 - ease(fl))); });
    cards.forEach((g, i) => { const st = 2.2 + (i < 3 ? i * .3 : i === 3 ? 3.2 : 4.2), p = cl(st, st + .6, c); place(g, DECK, spots[i], p, .55, .45, 0); if (c < st) g.position.copy(DECK).setY(-5); });
    pot.forEach((k, i) => { const a = 6 + i * .12, p = cl(a, a + .55, c); k.visible = c > a && c < CYCLE - .4; const from = new T.Vector3(i % 2 ? 1.1 : -1.1, .6, .5), to = new T.Vector3((Math.random() < 0 ? 0 : 0) + (i % 4 - 1.5) * .05, .035 + Math.floor(i / 4) * .023, -.45 + (i % 2) * .05);
      k.position.lerpVectors(from, to, ease(p)); k.position.y += Math.sin(ease(p) * Math.PI) * .4; k.rotation.y = i; });
    ring.material.color.setHSL(.41, .66, .5 + Math.sin(t * 2) * .06); glow.material.opacity = .12 + Math.sin(t * 2) * .05; gl.intensity = 1.2 + Math.sin(t * 2) * .3;
    dust.rotation.y = t * .02; tbl.rotation.y = Math.sin(t * .15) * .06;
    C.position.x += ((Math.sin(t * .12) * .5 + mx * .8) - C.position.x) * .05; C.position.y += ((3.1 - my * .5) - C.position.y) * .05; C.lookAt(0, 0, .15);
    R.render(S, C); requestAnimationFrame(frame);
  }
  frame();
  addEventListener('resize', () => { R.setSize(W(), Hh()); C.aspect = W() / Hh(); C.updateProjectionMatrix(); });
})();
