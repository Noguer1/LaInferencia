(function () {
  const canvas = document.getElementById('neural-canvas');
  const ctx    = canvas.getContext('2d');
  let pts = [], W, H, rafId = null, running = false;

  /* Configuración por tema: default = teal→azul, obsidiana = oro→blanco cálido */
  const CFGS = {
    /* Oro sobre fondo claro: más nodos, más brillo, destellos visibles */
    obsidiana: { N: 152, MAX_D: 170, nodeAlpha: 0.45, lineAlpha: 0.55, lw: 1.1,
                 l: [212, 175, 55], r: [232, 200, 80] },
    dark:      { N: 55,  MAX_D: 120, nodeAlpha: 0.15, lineAlpha: 0.28, lw: 0.8,
                 l: [96, 165, 250], r: [37, 99, 235], depth: true },
    default:   { N: 55,  MAX_D: 120, nodeAlpha: 0.15, lineAlpha: 0.28, lw: 0.8,
                 l: [16, 185, 129], r: [37, 99, 235] }
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
    const x   = rnd < 0.63 ? Math.random() * W * 0.42 : W * 0.42 + Math.random() * W * 0.58;
    if (cfg.depth) {
      const z  = Math.random();
      const sp = 0.10 + z * 0.28;
      return { x, y: Math.random() * H, z,
               vx: (Math.random() - 0.5) * sp, vy: (Math.random() - 0.5) * sp,
               r: 0.6 + z * 2.2, a: cfg.nodeAlpha * (0.35 + z * 0.9) };
    }
    return { x, y: Math.random() * H, z: 1,
             vx: (Math.random() - 0.5) * 0.30, vy: (Math.random() - 0.5) * 0.30,
             r: Math.random() * 2.0 + 1.2, a: Math.random() * 0.35 + cfg.nodeAlpha };
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
    ctx.strokeStyle = nodeColor(W * 0.5, cfg.lineAlpha * 0.7, cfg);
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
