/* Barra de progreso de lectura para las páginas estáticas.
   La SPA (index.html) tiene su propia versión dentro de js/main.js. */
(function () {
  var bar  = document.getElementById('reading-progress-bar');
  var fill = document.getElementById('reading-progress-fill');
  if (!bar || !fill) return;

  var doc = document.documentElement;

  function update() {
    var total = doc.scrollHeight - doc.clientHeight;
    if (total <= 0) {
      bar.classList.remove('visible');
      fill.style.transform = 'scaleX(0)';
      return;
    }
    var pct = (window.scrollY || doc.scrollTop) / total;
    if (pct < 0) pct = 0;
    if (pct > 1) pct = 1;
    if (pct <= 0) {
      bar.classList.remove('visible');
      fill.style.transform = 'scaleX(0)';
    } else {
      bar.classList.add('visible');
      fill.style.transform = 'scaleX(' + pct + ')';
      bar.setAttribute('aria-valuenow', Math.round(pct * 100));
    }
  }

  var rafPending = false;
  function schedule() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () { rafPending = false; update(); });
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
}());
