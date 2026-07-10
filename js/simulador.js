/* Simulador de Sesgos, standalone, sin dependencias de main.js.
   Se carga en /simulador-de-sesgos/ y en cada página de escenario. */
(function () {
  var SUPABASE_URL  = 'https://dbyoxssdbboxnbecgpbf.supabase.co';
  var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRieW94c3NkYmJveG5iZWNncGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDk2ODIsImV4cCI6MjA5NjUyNTY4Mn0.KsXnHzoMfgRzm8EHFaqOTo3GjSFBGrLx9BOEdJ0WVNs';
  var HEADERS = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON,
    'Authorization': 'Bearer ' + SUPABASE_ANON
  };
  var AGGREGATE_THRESHOLD = 50;
  var PROGRESS_KEY = 'li_simulador_progreso';
  var ALL_ESCENARIOS = [
    { id: 'precio-vino',       slug: 'el-precio-que-cambia-el-sabor' },
    { id: 'perdida-ganancia',  slug: 'ganar-o-no-perder' },
    { id: 'calidez-social',    slug: 'calidez-fisica-calidez-social' }
  ];

  function lsGet(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : v; }
    catch (_) { return fallback; }
  }
  function lsSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function getProgress() {
    try { return JSON.parse(lsGet(PROGRESS_KEY, '{}')); } catch (_) { return {}; }
  }
  function saveProgress(escenarioId, data) {
    var p = getProgress();
    p[escenarioId] = data;
    lsSet(PROGRESS_KEY, JSON.stringify(p));
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function fill(template, vars) {
    return template.replace(/\{(\w+)\}/g, function (_, key) {
      return Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : '';
    });
  }

  /* ── Supabase: registrar respuesta + leer agregado (ambos con fallo silencioso) ── */
  function registrarRespuesta(escenarioId, opcion) {
    fetch(SUPABASE_URL + '/rest/v1/sesgos_respuestas', {
      method: 'POST',
      headers: Object.assign({}, HEADERS, { 'Prefer': 'return=minimal' }),
      body: JSON.stringify({ escenario_id: escenarioId, opcion: opcion })
    }).catch(function (err) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('[simulador] no se pudo registrar la respuesta (¿existe la tabla sesgos_respuestas?):', err);
      }
    });
  }

  function obtenerAgregado(escenarioId, opcionBuscada, callback) {
    fetch(SUPABASE_URL + '/rest/v1/sesgos_respuestas?select=opcion&escenario_id=eq.' + encodeURIComponent(escenarioId), {
      headers: HEADERS
    }).then(function (res) {
      if (!res.ok) throw new Error('respuesta no ok');
      return res.json();
    }).then(function (rows) {
      if (!Array.isArray(rows) || rows.length < AGGREGATE_THRESHOLD) { callback(null); return; }
      var coincidencias = rows.filter(function (r) { return r.opcion === opcionBuscada; }).length;
      callback(Math.round((coincidencias / rows.length) * 100));
    }).catch(function () { callback(null); });
  }

  /* ── Render de un escenario ── */
  function renderEscenario(root, esc) {
    var condicion = pick(esc.condiciones);
    var decisionEl = document.createElement('div');
    decisionEl.className = 'sim-decision';

    var card = document.createElement('div');
    card.className = 'sim-card';
    card.innerHTML = '<div class="sim-context">' + condicion.contexto + '</div>';

    if (esc.tipo === 'slider') {
      var q = document.createElement('p');
      q.className = 'sim-question';
      q.textContent = esc.pregunta;
      card.appendChild(q);

      var sliderWrap = document.createElement('div');
      sliderWrap.className = 'sim-slider-wrap';
      var labels = esc.sliderLabels || ['', ''];
      sliderWrap.innerHTML =
        '<input type="range" class="sim-slider" min="' + esc.sliderMin + '" max="' + esc.sliderMax + '" value="' + esc.sliderDefault + '" aria-label="' + esc.pregunta + '" />' +
        '<div class="sim-slider-value" aria-hidden="true">' + esc.sliderDefault + '</div>' +
        '<div class="sim-slider-labels"><span>' + labels[0] + '</span><span>' + labels[1] + '</span></div>';
      decisionEl.appendChild(sliderWrap);

      var confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'sim-confirm-btn';
      confirmBtn.textContent = 'Confirmar mi respuesta';
      decisionEl.appendChild(confirmBtn);

      var slider = sliderWrap.querySelector('.sim-slider');
      var valueDisplay = sliderWrap.querySelector('.sim-slider-value');
      slider.addEventListener('input', function () { valueDisplay.textContent = slider.value; });

      confirmBtn.addEventListener('click', function () {
        var rating = parseInt(slider.value, 10);
        var cayo = (condicion.key === esc.cayoSiAlto && rating >= 6) || (condicion.key === esc.cayoSiBajo && rating <= 4);
        var bucket = condicion.key + ':' + (rating >= 6 ? 'alto' : (rating <= 4 ? 'bajo' : 'medio'));
        finalizarDecision(esc, condicion, cayo, bucket, { rating: rating, condicionTexto: condicion.textoCorto || '' });
      });

    } else if (esc.tipo === 'ab') {
      var abWrap = document.createElement('div');
      abWrap.className = 'sim-ab-wrap';
      var btnA = document.createElement('button');
      btnA.type = 'button';
      btnA.className = 'sim-ab-btn';
      btnA.innerHTML = '<span class="sim-ab-letter">A</span>' + condicion.opcionA;
      var btnB = document.createElement('button');
      btnB.type = 'button';
      btnB.className = 'sim-ab-btn';
      btnB.innerHTML = '<span class="sim-ab-letter">B</span>' + condicion.opcionB;
      abWrap.appendChild(btnA);
      abWrap.appendChild(btnB);
      decisionEl.appendChild(abWrap);

      function elegir(letra, texto, btnElegido) {
        btnA.disabled = true;
        btnB.disabled = true;
        btnElegido.classList.add('sim-ab-btn--selected');
        var cayo = esc.cayoSi[condicion.key] === letra;
        var bucket = condicion.key + ':' + letra;
        finalizarDecision(esc, condicion, cayo, bucket, { opcionElegida: texto });
      }
      btnA.addEventListener('click', function () { elegir('A', condicion.opcionA, btnA); });
      btnB.addEventListener('click', function () { elegir('B', condicion.opcionB, btnB); });
    }

    card.appendChild(decisionEl);
    root.appendChild(card);

    function finalizarDecision(esc, condicion, cayo, bucket, vars) {
      registrarRespuesta(esc.id, bucket);
      saveProgress(esc.id, { cayo: cayo, ts: Date.now() });
      if (window.umami) { try { window.umami.track('simulator-scenario-complete', { escenario: esc.id }); } catch (_) {} }

      decisionEl.remove();
      renderRevelacion(card, esc, cayo, bucket, vars);
    }
  }

  function renderRevelacion(card, esc, cayo, bucket, vars) {
    var reveal = document.createElement('div');
    reveal.className = 'sim-reveal';
    reveal.setAttribute('role', 'status');
    reveal.setAttribute('aria-live', 'polite');

    var texto = fill(cayo ? esc.revelarCayo : esc.revelarNoCayo, vars);

    reveal.innerHTML =
      '<p class="sim-reveal-text">' + texto + '</p>' +
      '<div class="sim-reveal-stat" hidden></div>' +
      '<a href="' + esc.sourceUrl + '" class="sim-reveal-cta" data-umami-event="simulator-cta-article-click" data-umami-event-escenario="' + esc.id + '">Leer el estudio completo · ' + esc.sourceLabel + ' →</a>';

    card.appendChild(reveal);

    obtenerAgregado(esc.id, bucket, function (pct) {
      if (pct === null) return;
      var statEl = reveal.querySelector('.sim-reveal-stat');
      statEl.hidden = false;
      statEl.textContent = 'El ' + pct + '% de quienes hicieron este escenario respondió lo mismo que tú.';
    });

    var progreso = getProgress();
    var completados = ALL_ESCENARIOS.filter(function (e) { return progreso[e.id]; }).length;
    if (completados === ALL_ESCENARIOS.length) {
      if (window.umami) { try { window.umami.track('simulator-finish'); } catch (_) {} }
      var cierre = document.createElement('div');
      cierre.className = 'sim-finish';
      cierre.innerHTML =
        '<h3>Has completado los 3 escenarios</h3>' +
        '<p>Aquí tienes los estudios reales que explican cada uno:</p>' +
        '<div class="sim-finish-links"></div>';
      card.appendChild(cierre);
      var linksWrap = cierre.querySelector('.sim-finish-links');
      (esc.allSources || []).forEach(function (s) {
        var a = document.createElement('a');
        a.href = s.url;
        a.className = 'sim-finish-link';
        a.textContent = s.titulo + ' →';
        linksWrap.appendChild(a);
      });
    }
  }

  /* ── Progreso en la landing ── */
  function markLandingProgress() {
    var progreso = getProgress();
    var completados = 0;
    ALL_ESCENARIOS.forEach(function (e) {
      var card = document.querySelector('.sim-landing-card[href="/simulador-de-sesgos/' + e.slug + '/"]');
      if (card && progreso[e.id]) {
        card.classList.add('sim-landing-card--done');
        completados++;
      }
    });

    var summary = document.getElementById('sim-summary-root');
    if (!summary || completados === 0) return;
    summary.hidden = false;
    summary.textContent = completados === ALL_ESCENARIOS.length
      ? 'Has completado los 3 escenarios. Gracias por decidir antes de leer.'
      : 'Llevas ' + completados + ' de ' + ALL_ESCENARIOS.length + ' escenarios completados.';
  }

  function init() {
    var root = document.getElementById('simulador-root');
    if (root) {
      var raw = root.getAttribute('data-escenario');
      if (!raw) return;
      var esc;
      try { esc = JSON.parse(raw); } catch (_) { return; }
      if (window.umami) { try { window.umami.track('simulator-start', { escenario: esc.id }); } catch (_) {} }
      renderEscenario(root, esc);
      return;
    }

    if (document.querySelector('.sim-landing-grid')) {
      markLandingProgress();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
