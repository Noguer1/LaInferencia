/* Botón "Guardar en tu colección" para páginas estáticas de artículo.
   Standalone: no depende de main.js. Usa la misma clave de localStorage
   ('li_favorites') y el mismo formato ('lib-<id>') que el sistema de
   favoritos de la SPA, para que un artículo guardado aquí aparezca en
   "Tus Favoritos" dentro de la SPA, y viceversa. */
(function () {
  var LS_KEY = 'li_favorites';

  function lsGet(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : v; }
    catch (_) { return fallback; }
  }
  function lsSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function getFavs() {
    try { return JSON.parse(lsGet(LS_KEY, '[]')); } catch (_) { return []; }
  }
  function toggleFav(id) {
    var favs = getFavs();
    var i = favs.indexOf(id);
    if (i === -1) favs.push(id); else favs.splice(i, 1);
    lsSet(LS_KEY, JSON.stringify(favs));
    return i === -1; // true → ahora guardado
  }

  var HEART_SVG_OUTLINE = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var HEART_SVG_FILLED  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

  function setButtonState(btn, saved) {
    btn.classList.toggle('active', saved);
    btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    var label = saved ? 'Quitar de tu colección' : 'Guardar en tu colección';
    btn.setAttribute('aria-label', label);
    btn.title = label;
    var icon = btn.querySelector('.save-btn-icon');
    var text = btn.querySelector('.save-btn-text');
    if (icon) icon.innerHTML = saved ? HEART_SVG_FILLED : HEART_SVG_OUTLINE;
    if (text) text.textContent = saved ? 'Guardado' : 'Guardar';
  }

  var toastTimer = null;
  function showToast(message) {
    var el = document.getElementById('li-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'li-toast';
      el.className = 'li-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('li-toast--visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('li-toast--visible');
    }, 2400);
  }

  function init() {
    var buttons = document.querySelectorAll('.save-btn[data-article-id]');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      var articleId = btn.getAttribute('data-article-id');
      var favId = 'lib-' + articleId;
      var saved = getFavs().indexOf(favId) !== -1;
      setButtonState(btn, saved);

      btn.addEventListener('click', function () {
        var nowSaved = toggleFav(favId);
        setButtonState(btn, nowSaved);
        showToast(nowSaved ? 'Guardado en tu colección' : 'Quitado de tu colección');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
