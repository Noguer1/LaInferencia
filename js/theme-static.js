/* Selector de tema para páginas estáticas (no cargan main.js).
   Réplica del selector del home: mismos THEMES, misma clave localStorage
   ('theme'), mismo gating por XP ('li_xp_v1'), mismo popup y swatches.
   El CSS (.theme-toggle, .theme-picker-popup, .theme-swatch-*) ya vive en
   styles.css, compartido. */
(function () {
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? (d || '') : v; } catch (e) { return d || ''; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var html   = document.documentElement;
  var btn    = document.getElementById('theme-toggle');
  var iconEl = document.getElementById('theme-icon');
  if (!btn) return;

  var DARK_BASES = new Set(['dark', 'naranja', 'tormenta', 'cosmos', 'carmesi']);

  var THEMES = [
    { id: 'light',    label: 'Claro',    bg: '#F7F9FF', accent: '#3B82F6', nivel: 0 },
    { id: 'dark',     label: 'Oscuro',   bg: '#07101E', accent: '#60A5FA', nivel: 0 },
    { id: 'verde',    label: 'Verde',    bg: '#F0FBF4', accent: '#16A34A', nivel: 1 },
    { id: 'cosmos',   label: 'Cosmos',   bg: '#08060A', accent: '#F59E0B', nivel: 2 },
    { id: 'tormenta', label: 'Tormenta', bg: '#07030F', accent: '#A855F7', nivel: 3 },
    { id: 'carmesi',  label: 'Carmesí',  bg: '#0A0204', accent: '#C8102E', nivel: 4 },
    { id: 'obsidiana',label: 'Obsidiana',bg: '#080700', accent: '#D4AF37', nivel: 5 },
  ];

  var SUN  = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var MOON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function getUserNivel() {
    var xp = parseInt(lsGet('li_xp_v1', '0'), 10) || 0;
    if (xp >= 2750) return 5;
    if (xp >= 1500) return 4;
    if (xp >= 750)  return 3;
    if (xp >= 300)  return 2;
    if (xp >= 75)   return 1;
    return 0;
  }

  function currentThemeId() { return html.getAttribute('data-theme') || 'light'; }

  function updateIcon() {
    if (!iconEl) return;
    iconEl.innerHTML = DARK_BASES.has(currentThemeId()) ? MOON : SUN;
  }

  function swapLogos(id) {
    var src = id === 'obsidiana' ? '/img/logo3.png' : '/img/logo2.png';
    document.querySelectorAll('img.logo, img.hero-logo, img.mobile-menu-logo, img.static-navbar-logo, img.static-hero-logo').forEach(function (img) {
      img.src = src;
    });
  }

  function doApply(id) {
    if (id === 'light') html.removeAttribute('data-theme');
    else html.setAttribute('data-theme', id);
    if (DARK_BASES.has(id)) html.classList.add('dark-base');
    else html.classList.remove('dark-base');
    lsSet('theme', id);
    swapLogos(id);
    updateIcon();
    updateSwatches();
  }

  function applyTheme(id) {
    if (document.startViewTransition) document.startViewTransition(function () { doApply(id); });
    else doApply(id);
  }

  function toggleSimple() {
    applyTheme(DARK_BASES.has(currentThemeId()) ? 'light' : 'dark');
  }

  var popup = null;

  function buildPopup() {
    var p = document.createElement('div');
    p.className = 'theme-picker-popup';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', 'Seleccionar tema');

    var grid = document.createElement('div');
    grid.className = 'theme-picker-grid';

    var userNivel = getUserNivel();
    THEMES.filter(function (t) { return t.nivel <= userNivel; }).forEach(function (t) {
      var swBtn = document.createElement('button');
      swBtn.className = 'theme-swatch-btn';
      swBtn.dataset.themeId = t.id;
      swBtn.title = t.label;

      var preview = document.createElement('div');
      preview.className = 'theme-swatch-preview';
      preview.style.background = 'linear-gradient(135deg, ' + t.bg + ' 55%, ' + t.accent + ' 55%)';

      var label = document.createElement('span');
      label.className = 'theme-swatch-label';
      label.textContent = t.label;

      swBtn.appendChild(preview);
      swBtn.appendChild(label);
      grid.appendChild(swBtn);

      swBtn.addEventListener('click', function () { applyTheme(t.id); closePopup(); });
    });

    p.appendChild(grid);
    return p;
  }

  function updateSwatches() {
    if (!popup) return;
    var cur = currentThemeId();
    popup.querySelectorAll('.theme-swatch-btn').forEach(function (b) {
      b.classList.toggle('ts-active', b.dataset.themeId === cur);
    });
  }

  function positionPopup() {
    if (!popup) return;
    var rect = btn.getBoundingClientRect();
    popup.style.top   = (rect.bottom + 6) + 'px';
    popup.style.right = (window.innerWidth - rect.right) + 'px';
    popup.style.left  = 'auto';
  }

  function openPopup() {
    popup = buildPopup();
    document.body.appendChild(popup);
    positionPopup();
    updateSwatches();
    btn.setAttribute('aria-expanded', 'true');
    popup.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  function closePopup() {
    if (!popup) return;
    popup.remove();
    popup = null;
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (getUserNivel() >= 1) {
      if (popup) closePopup(); else openPopup();
    } else {
      toggleSimple();
    }
  });

  document.addEventListener('click', function () { closePopup(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });
  window.addEventListener('resize', function () { positionPopup(); });

  var chevron = btn.querySelector('.theme-chevron');
  if (chevron) chevron.style.display = getUserNivel() >= 1 ? '' : 'none';

  swapLogos(currentThemeId());
  updateIcon();
}());
