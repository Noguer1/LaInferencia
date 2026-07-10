/* Buscador, standalone, sin dependencias de main.js.
   Busca por palabra clave (con normalización de acentos y ponderación
   por campo) sobre el índice generado en build time por generate-pages.js
   (js/search-index.js). No es un buscador semántico con embeddings: 
   se declara así honestamente en la interfaz. */
(function () {
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  function trapFocus(modal) {
    function els() { return Array.prototype.slice.call(modal.querySelectorAll(FOCUSABLE)).filter(function (e) { return e.offsetParent !== null; }); }
    function onKey(e) {
      if (e.key !== 'Tab') return;
      var focusable = els();
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    }
    modal.addEventListener('keydown', onKey);
    return onKey;
  }
  function releaseFocus(modal, handler, restoreEl) {
    modal.removeEventListener('keydown', handler);
    if (restoreEl && typeof restoreEl.focus === 'function') restoreEl.focus();
  }

  var STOPWORDS = {
    'el':1,'la':1,'los':1,'las':1,'un':1,'una':1,'unos':1,'unas':1,'de':1,'del':1,'al':1,
    'y':1,'o':1,'u':1,'que':1,'no':1,'si':1,'se':1,'su':1,'sus':1,'mi':1,'mis':1,'tu':1,'tus':1,
    'en':1,'con':1,'por':1,'para':1,'es':1,'son':1,'lo':1,'le':1,'les':1,'me':1,'te':1,
    'más':1,'mas':1,'menos':1,'muy':1,'ya':1,'como':1,'cuando':1,'donde':1,'porque':1,
    'este':1,'esta':1,'esto':1,'ese':1,'esa':1,'eso':1,'sobre':1,'entre':1,'sin':1,'hay':1
  };

  /* Pequeño mapa de sinónimos/situaciones cotidianas -> vocabulario real
     de los artículos. Es un parche manual, no un tesauro completo, cubre
     los casos de uso más obvios mientras no haya búsqueda semántica real.
     Ampliarlo con más entradas es trabajo editorial barato y de alto valor. */
  var SINONIMOS = {
    'movil':      ['notificaciones', 'scroll', 'dopamina', 'pantalla'],
    'celular':    ['notificaciones', 'scroll', 'dopamina'],
    'telefono':   ['notificaciones', 'scroll'],
    'pareja':     ['conflicto', 'apego', 'discutir'],
    'discutir':   ['conflicto', 'apego'],
    'dinero':     ['gastas', 'precio', 'financieros'],
    'gastar':     ['gastas', 'precio'],
    'motivacion': ['progreso', 'bonus', 'autodeterminacion'],
    'redes':      ['algoritmo', 'burbuja', 'filtros'],
    'trabajo':    ['burnout', 'reuniones', 'autodeterminacion'],
    'estudiar':   ['aprender', 'errores', 'mezclar'],
    'compras':    ['precio', 'gastas', 'diderot']
  };

  function normalizar(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function tokenizarQuery(query) {
    var base = normalizar(query).split(/\s+/).filter(function (t) {
      return t.length >= 2 && !STOPWORDS[t];
    });
    var ampliados = base.slice();
    base.forEach(function (t) {
      if (SINONIMOS[t]) ampliados = ampliados.concat(SINONIMOS[t]);
    });
    return ampliados;
  }

  function puntuar(item, terminos) {
    var titulo  = normalizar(item.titulo);
    var badge   = normalizar(item.badge);
    var texto   = normalizar(item.texto);
    var puntos  = 0;
    terminos.forEach(function (t) {
      if (!t) return;
      if (titulo.indexOf(t) !== -1) puntos += titulo === t ? 6 : 3;
      if (badge.indexOf(t) !== -1) puntos += 2;
      if (texto.indexOf(t) !== -1) puntos += 1;
    });
    return puntos;
  }

  var SCORE_MINIMO = 1;

  function buscar(query) {
    var index = window.LI_SEARCH_INDEX || [];
    var terminos = tokenizarQuery(query);
    if (!terminos.length) return [];
    var puntuados = index.map(function (item) { return { item: item, score: puntuar(item, terminos) }; })
      .filter(function (r) { return r.score >= SCORE_MINIMO; })
      .sort(function (a, b) { return b.score - a.score; });
    return puntuados.slice(0, 6).map(function (r) { return r.item; });
  }

  /* ── Construcción del modal (una sola vez, reutilizado en toda la sesión) ── */
  var modal, input, resultsEl, closeHandler, lastFocused, debounceTimer;

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'buscador-overlay';
    modal.id = 'buscador-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Buscar en La Inferencia');
    modal.hidden = true;

    modal.innerHTML =
      '<div class="buscador-card">' +
        '<button type="button" class="buscador-close" aria-label="Cerrar búsqueda">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '<div class="buscador-header">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<input type="text" id="buscador-input" placeholder="Busca un tema: «por qué discuto con mi pareja», «anclaje»..." autocomplete="off" aria-label="Buscar artículos y escenarios" />' +
        '</div>' +
        '<div class="buscador-results" id="buscador-results" aria-live="polite"></div>' +
      '</div>';

    document.body.appendChild(modal);
    input = modal.querySelector('#buscador-input');
    resultsEl = modal.querySelector('#buscador-results');

    modal.querySelector('.buscador-close').addEventListener('click', cerrar);
    modal.addEventListener('click', function (e) { if (e.target === modal) cerrar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) cerrar(); });

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () { renderResultados(input.value); }, 90);
    });
  }

  function renderResultados(query) {
    var q = query.trim();
    if (!q) {
      resultsEl.innerHTML = '<p class="buscador-hint">Escribe una situación o un tema, no hace falta acertar el título exacto del artículo.</p>';
      return;
    }
    var resultados = buscar(q);
    if (!resultados.length) {
      resultsEl.innerHTML = '<p class="buscador-hint">Nada por aquí todavía. Prueba con otra palabra, o explora por categorías desde la home.</p>';
      return;
    }
    resultsEl.innerHTML = resultados.map(function (r) {
      var tipoLabel = r.tipo === 'escenario' ? 'Simulador' : r.badge;
      var rec = (window.RECOMENDACIONES || {})[r.id];
      var libroHTML = rec && rec.libro
        ? '<span class="buscador-result-libro">📖 Tiene libro recomendado: ' + rec.libro.titulo + '</span>'
        : '';
      return '<a href="' + r.url + '" class="buscador-result" data-umami-event="buscador-result-click" data-umami-event-query="' + q.replace(/"/g, '') + '">' +
        '<span class="buscador-result-badge">' + tipoLabel + '</span>' +
        '<strong>' + r.titulo + '</strong>' +
        '<p>' + r.resumen + '</p>' +
        libroHTML +
      '</a>';
    }).join('');
  }

  function abrir() {
    if (!modal) buildModal();
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeHandler = trapFocus(modal);
    input.value = '';
    renderResultados('');
    setTimeout(function () { input.focus(); }, 30);
    if (window.umami) { try { window.umami.track('buscador-open'); } catch (_) {} }
  }

  function cerrar() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    releaseFocus(modal, closeHandler, lastFocused);
  }

  function init() {
    document.querySelectorAll('[data-buscador-trigger]').forEach(function (btn) {
      btn.addEventListener('click', abrir);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
