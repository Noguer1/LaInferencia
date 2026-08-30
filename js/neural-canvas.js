(function () {
  const canvas = document.getElementById('neural-canvas');
  const ctx    = canvas.getContext('2d');
  let pts = [], W, H, rafId = null, running = false;

  /* Configuración por tema: default = teal→azul, obsidiana = oro→blanco cálido */
  const CFGS = {
    /* Oro sobre fondo claro: más nodos, más brillo, destellos visibles */
    obsidiana: { N: 190, MAX_D: 200, nodeAlpha: 0.5, lineAlpha: 0.6, lw: 1.0,
                 l: [212, 175, 55], r: [232, 200, 80], depth: true },
    dark:      { N: 150, MAX_D: 185, nodeAlpha: 0.28, lineAlpha: 0.5, lw: 0.9,
                 l: [150, 190, 255], r: [90, 150, 245], lineRGB: [205, 224, 255], depth: true },
    default:   { N: 150, MAX_D: 185, nodeAlpha: 0.28, lineAlpha: 0.5, lw: 0.9,
                 l: [150, 190, 255], r: [90, 150, 245], lineRGB: [205, 224, 255], depth: true }
  };

  function getCfg() {
    return CFGS[document.documentElement.getAttribute('data-theme')] || CFGS.default;
  }

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function nodeColor(x, a, cfg) {
    const t = Math.min(1, Math.max(0, x / W));
    return `rgba(${Math.round(cfg.l[0]+(cfg.r[0]-cfg.l[0])*t)},${Math.round(cfg.l[1]+(cfg.r[1]-cfg.l[1])*t)},${Math.round(cfg.l[2]+(cfg.r[2]-cfg.l[2])*t)},${a})`;
  }

  function mkPt(cfg) {
    const rnd = Math.random();
    let x;                                  // carga los dos bordes, vacía el centro
    if (rnd < 0.45)      x = Math.random() * W * 0.32;
    else if (rnd < 0.90) x = W * 0.68 + Math.random() * W * 0.32;
    else                 x = W * 0.32 + Math.random() * W * 0.36;
    if (cfg.depth) {
      const t = Math.random();
      let z, r, a, sp;
      if (t < 0.32) {                       // lejos: pequeñas y muy tenues
        z = 0.12;
        r = Math.random() * 0.7 + 0.5;
        a = cfg.nodeAlpha * (Math.random() * 0.25 + 0.35);
        sp = 0.06;
      } else if (t < 0.93) {                // capa base
        z = 0.5;
        r = Math.random() * 1.6 + 1.0;
        a = Math.random() * 0.3 + cfg.nodeAlpha;
        sp = 0.14;
      } else {                              // cerca: grandes y brillantes (con halo)
        z = 0.95;
        r = Math.random() * 1.4 + 2.6;
        a = Math.min(0.95, cfg.nodeAlpha + Math.random() * 0.3 + 0.45);
        sp = 0.20;
      }
      return { x, y: Math.random() * H, z,
               vx: (Math.random() - 0.5) * sp, vy: (Math.random() - 0.5) * sp, r, a };
    }
    return { x, y: Math.random() * H, z: 1,
             vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
             r: Math.random() * 1.6 + 1.0, a: Math.random() * 0.3 + cfg.nodeAlpha };
  }

  let activeCfg = null;
  function syncParticles(cfg) {
    if (activeCfg === cfg) return;
    const wasDepth = activeCfg && activeCfg.depth;
    activeCfg = cfg;
    if (wasDepth !== !!cfg.depth) pts.length = 0;
    while (pts.length < cfg.N) pts.push(mkPt(cfg));
    if (pts.length > cfg.N) pts.length = cfg.N;
  }

  function init() { resize(); activeCfg = getCfg(); pts = Array.from({ length: activeCfg.N }, () => mkPt(activeCfg)); }

  const TARGET_FPS = window.innerWidth > 768 ? 30 : 60;
  const FRAME_MS   = 1000 / TARGET_FPS;
  let lastFrameTime = 0;

  function frame(now) {
    if (now - lastFrameTime < FRAME_MS) {
      if (running) rafId = requestAnimationFrame(frame);
      return;
    }
    lastFrameTime = now;
    const cfg = getCfg();
    syncParticles(cfg);
    const N = pts.length, MAX_D2 = cfg.MAX_D * cfg.MAX_D;
    ctx.clearRect(0, 0, W, H);

    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      if (p.z > 0.9) {                       // halo barato: segundo arco tenue
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor(p.x, p.a * 0.16, cfg);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor(p.x, p.a, cfg);
      ctx.fill();
    }

    ctx.lineWidth = cfg.lw;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (cfg.depth && pts[i].z < 0.25 && pts[j].z < 0.25) continue;
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MAX_D2) {
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
        }
      }
    }
    ctx.strokeStyle = cfg.lineRGB
      ? `rgba(${cfg.lineRGB[0]},${cfg.lineRGB[1]},${cfg.lineRGB[2]},${cfg.lineAlpha * 0.7})`
      : nodeColor(W * 0.5, cfg.lineAlpha * 0.7, cfg);
    ctx.stroke();
    if (running) rafId = requestAnimationFrame(frame);
  }

  function startCanvas() { if (!running) { running = true; rafId = requestAnimationFrame(frame); } }
  function stopCanvas()  { running = false; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  document.addEventListener('visibilitychange', () => { document.hidden ? stopCanvas() : startCanvas(); });
  window.addEventListener('resize', function () {
    resize();
    pts.forEach(p => { if (p.x > W) p.x = Math.random() * W; if (p.y > H) p.y = Math.random() * H; });
  }, { passive: true });

  let scrollPauseTimer = null;
  function onScrollPause() {
    stopCanvas();
    clearTimeout(scrollPauseTimer);
    scrollPauseTimer = setTimeout(startCanvas, 250);
  }
  window.addEventListener('scroll', onScrollPause, { passive: true });
  const _appScroll = document.getElementById('app');
  if (_appScroll) _appScroll.addEventListener('scroll', onScrollPause, { passive: true });

  init(); startCanvas();
}());
