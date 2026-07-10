/* Progreso de Rutas de Aprendizaje, standalone, sin dependencias de main.js.
   La navegación entre pasos (anterior/siguiente) es 100% estática, generada
   en build time, esto solo añade la capa de "qué llevo ya leído", que es
   pura mejora visual y nunca bloquea nada si falla o no carga. */
(function () {
  var LS_KEY = 'li_rutas_progreso';

  function lsGet(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : v; }
    catch (_) { return fallback; }
  }
  function lsSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function getProgreso() {
    try { return JSON.parse(lsGet(LS_KEY, '{}')); } catch (_) { return {}; }
  }

  function marcarVisitado(rutaId, articuloId) {
    var progreso = getProgreso();
    var visitados = progreso[rutaId] || [];
    if (visitados.indexOf(articuloId) === -1) {
      visitados.push(articuloId);
      progreso[rutaId] = visitados;
      lsSet(LS_KEY, JSON.stringify(progreso));
    }
    return visitados;
  }

  function initBanner() {
    var banner = document.querySelector('.ruta-banner[data-ruta-id]');
    if (!banner) return;
    var rutaId = banner.getAttribute('data-ruta-id');
    var articuloId = banner.getAttribute('data-articulo-id');
    var visitados = marcarVisitado(rutaId, articuloId);
    document.querySelectorAll('.ruta-dot[data-ruta-dot-id]').forEach(function (dot) {
      if (visitados.indexOf(dot.getAttribute('data-ruta-dot-id')) !== -1) {
        dot.classList.add('ruta-dot--visto');
      }
    });
  }

  function initListas() {
    var tarjetas = document.querySelectorAll('[data-ruta-progreso-id]');
    if (!tarjetas.length) return;
    var progreso = getProgreso();
    tarjetas.forEach(function (el) {
      var rutaId = el.getAttribute('data-ruta-progreso-id');
      var totalArts = JSON.parse(el.getAttribute('data-ruta-articulos') || '[]');
      var visitados = (progreso[rutaId] || []).filter(function (id) { return totalArts.indexOf(id) !== -1; });
      var badge = el.querySelector('[data-ruta-progreso-badge]');
      if (badge && visitados.length > 0) {
        badge.hidden = false;
        badge.textContent = visitados.length === totalArts.length
          ? 'Completada'
          : visitados.length + ' de ' + totalArts.length + ' leídos';
      }
    });
  }

  function init() {
    initBanner();
    initListas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
