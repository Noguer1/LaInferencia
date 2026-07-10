#!/usr/bin/env node
/**
 * Genera páginas HTML estáticas por artículo, páginas de categoría,
 * página de autor, sitemap.xml y sitemap-images.xml.
 * Uso: node generate-pages.js
 */

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

// ── Extraer datos de artículos desde main.js ───────────────────
const mainCode  = fs.readFileSync(path.join(__dirname, 'js/main.js'), 'utf-8');
const dataStart = mainCode.indexOf('const ARTICLE_VIEWS');
const dataEnd   = mainCode.indexOf('(function', mainCode.indexOf('const LIBRARY_ARTICLES'));
if (dataStart === -1 || dataEnd === -1) {
  console.error('ERROR: No se encontró ARTICLE_VIEWS o el IIFE después de LIBRARY_ARTICLES en main.js');
  process.exit(1);
}

const sandbox = {};
const dataCode = mainCode.slice(dataStart, dataEnd).replace(/\bconst\s+/g, '').replace(/\blet\s+/g, '');
vm.runInNewContext(dataCode, sandbox);
const { LIBRARY_ARTICLES } = sandbox;
if (!LIBRARY_ARTICLES) {
  console.error('ERROR: No se pudo extraer LIBRARY_ARTICLES');
  process.exit(1);
}

// Extraer AUTHORS y ARTICLE_STATS por separado (están después del primer IIFE)
const authStart  = mainCode.indexOf('const AUTHORS = {');
const authEnd    = mainCode.indexOf('\n};', authStart) + 3;
const statsStart = mainCode.indexOf('const ARTICLE_STATS = {');
const statsEnd   = mainCode.indexOf('\n};', statsStart) + 3;
const sandbox2   = {};
vm.runInNewContext(
  mainCode.slice(authStart, authEnd).replace(/\bconst\s+/g, '') +
  '\n' +
  mainCode.slice(statsStart, statsEnd).replace(/\bconst\s+/g, ''),
  sandbox2
);
const AUTHORS       = sandbox2.AUTHORS || {};
const ARTICLE_STATS = sandbox2.ARTICLE_STATS || {};

const SEO_OVERRIDES = require('./js/seo-overrides.js');

const SITE = 'https://lainferencia.com';
const AUTHOR_URL = `${SITE}/autores/miguel-noguer/`;
const AUTHOR_NAME = 'Miguel Noguer Escudero';

// ── Mapas de categorías ────────────────────────────────────────
const CAT_SLUGS = {
  economia:     'economia',
  moda:         'moda',
  derecho:      'derecho',
  deporte:      'deporte',
  arte:         'arte',
  tecnologia:   'tecnologia',
  relaciones:   'relaciones',
  saludMental:  'salud-mental',
  educacion:    'educacion',
  trabajo:      'trabajo',
  politica:     'politica',
  alimentacion: 'alimentacion',
};

const CAT_LABELS = {
  economia:     'Economía',
  moda:         'Moda',
  derecho:      'Derecho',
  deporte:      'Deporte',
  arte:         'Arte',
  tecnologia:   'Tecnología',
  relaciones:   'Relaciones',
  saludMental:  'Salud Mental',
  educacion:    'Educación',
  trabajo:      'Trabajo',
  politica:     'Política',
  alimentacion: 'Alimentación',
};

const CAT_DESCRIPTIONS = {
  economia:     'Cómo el cerebro distorsiona el valor del dinero, el riesgo y el precio. Sesgos cognitivos en economía conductual explicados a partir de estudios peer-reviewed.',
  moda:         'Cómo la ropa que llevas cambia tu rendimiento, tu credibilidad y cómo te perciben los demás. Psicología del vestir basada en evidencia científica.',
  derecho:      'Memoria de testigos, sesgos judiciales y confesiones falsas. La psicología detrás de las decisiones del sistema judicial, explicada con investigación forense.',
  deporte:      'Rituales, diálogo interno y visualización mental: la psicología que decide el rendimiento deportivo de élite, explicada con estudios científicos.',
  arte:         'Por qué el arte nos conmueve, qué pasa en el cerebro ante una obra ambigua y por qué un original vale más que una copia idéntica. Neuroestética con evidencia.',
  tecnologia:   'Scroll infinito, notificaciones y burbujas de filtros: cómo el diseño digital explota la psicología de la atención y la dopamina.',
  relaciones:   'Apego, conflicto y atracción: la ciencia detrás de cómo amamos, discutimos y nos conectamos con los demás, explicada con investigación en psicología de pareja.',
  saludMental:  'Flujo, autocompasión y ejercicio como antidepresivo: estrategias de bienestar psicológico respaldadas por investigación científica.',
  educacion:    'Por qué las notas matan la motivación, qué son los errores deseables y cómo aprender mejor según la ciencia cognitiva del aprendizaje.',
  trabajo:      'Motivación, burnout y job crafting: la psicología organizacional que explica por qué unos trabajos enganchan y otros queman, con evidencia científica.',
  politica:     'Por qué votamos con las emociones antes que con la razón, y cómo la personalidad predice la ideología mejor que los argumentos. Psicología política basada en evidencia.',
  alimentacion: 'Por qué comemos más en compañía, cómo las emociones controlan el apetito y por qué prohibirte un alimento dispara el deseo de comerlo.',
};

// ── Fecha en español -> ISO 8601 (para datePublished en JSON-LD) ─
const MESES_ES = {
  enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
  julio: '07', agosto: '08', septiembre: '09', setiembre: '09', octubre: '10',
  noviembre: '11', diciembre: '12'
};
function toISODate(str) {
  if (!str) return '';
  const m = String(str).toLowerCase().match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/);
  if (!m) return '';
  const [, day, mes, year] = m;
  const mm = MESES_ES[mes];
  if (!mm) return '';
  return `${year}-${mm}-${day.padStart(2, '0')}`;
}

// ── Generador de slugs ─────────────────────────────────────────
function toSlug(str) {
  let s = str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[¿?¡!,.:;()\[\]«»""''€$%&\/\\—–]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (s.length > 65) {
    s = s.substring(0, 65).replace(/-[^-]*$/, '');
  }

  return s.replace(/^-|-$/g, '');
}

// ── Datos comunes precalculados ────────────────────────────────
const TOTAL_ARTS = Object.values(LIBRARY_ARTICLES).flat().length;
const CAT_KEYS   = Object.keys(LIBRARY_ARTICLES);
const slugMap    = {}; // id -> { catSlug, artSlug, cat }

for (const [cat, arts] of Object.entries(LIBRARY_ARTICLES)) {
  const catSlug = CAT_SLUGS[cat] || cat;
  for (const art of arts) {
    const artSlug = toSlug(art.title);
    slugMap[art.id] = { catSlug, artSlug, cat };
  }
}

function articleUrl(art) {
  const { catSlug, artSlug } = slugMap[art.id];
  return `${SITE}/articulos/${catSlug}/${artSlug}/`;
}

function findArticleById(id) {
  for (const arts of Object.values(LIBRARY_ARTICLES)) {
    const found = arts.find(a => a.id === id);
    if (found) return found;
  }
  return null;
}

// ── Simulador de Sesgos — datos de los 3 escenarios piloto ─────
// Cada escenario cita un artículo real ya publicado (sourceId) — si ese
// artículo cambia de id, este array debe actualizarse a la vez.
const SIMULADOR_ESCENARIOS = [
  {
    id: 'precio-vino',
    slug: 'el-precio-que-cambia-el-sabor',
    titulo: 'El precio que cambia el sabor',
    gancho: 'Antes de probarlo, ya sabes si te va a gustar.',
    resumen: 'Dos personas prueban el mismo vino. Solo una cree que es caro. ¿Su cerebro lo experimenta igual?',
    tipo: 'slider',
    sliderMin: 0,
    sliderMax: 10,
    sliderDefault: 5,
    sliderLabels: ['Malo', 'Excelente'],
    pregunta: 'Sin haberlo probado todavía, ¿qué nota le pondrías a su calidad, del 0 al 10?',
    condiciones: [
      { key: 'caro',   contexto: 'Te sirven una copa de vino. Te dicen que esta botella cuesta <strong>90€</strong>.' },
      { key: 'barato', contexto: 'Te sirven una copa de vino. Te dicen que esta botella cuesta <strong>5€</strong>.' }
    ],
    cayoSiAlto: 'caro',
    cayoSiBajo: 'barato',
    revelarCayo: 'Le has puesto un {rating}/10 sabiendo solo el precio — sin haberlo probado. Es lo que encontró Hilke Plassmann en 2008: el mismo vino, servido con precio distinto, activaba más placer en el cerebro cuando los participantes creían que era caro. El precio no solo cambió tu opinión: en el estudio real, cambió la experiencia sensorial medida en un escáner.',
    revelarNoCayo: 'Esta vez tu {rating}/10 no siguió el precio que viste — pero le pasa a la mayoría: en el estudio de Hilke Plassmann (2008), el mismo vino activaba más placer cerebral cuando los participantes creían que era caro. El precio cambia la experiencia real, no solo la opinión.',
    sourceId: 'eco-06'
  },
  {
    id: 'perdida-ganancia',
    slug: 'ganar-o-no-perder',
    titulo: 'Ganar o no perder',
    gancho: 'La misma decisión, contada de dos formas distintas.',
    resumen: 'Dos decisiones con el mismo resultado matemático, contadas de forma distinta, no se sienten igual.',
    tipo: 'ab',
    condiciones: [
      {
        key: 'ganancia',
        contexto: 'Tienes 1.000€. Debes elegir una opción:',
        opcionA: 'Quedarte con 500€ seguros.',
        opcionB: 'Lanzar una moneda: si sale cara ganas 1.000€ más, si sale cruz no ganas nada más.'
      },
      {
        key: 'perdida',
        contexto: 'Tienes 1.000€, pero vas a perder parte. Debes elegir una opción:',
        opcionA: 'Perder 500€ seguros.',
        opcionB: 'Lanzar una moneda: si sale cara no pierdes nada, si sale cruz pierdes los 1.000€.'
      }
    ],
    cayoSi: { ganancia: 'A', perdida: 'B' },
    revelarCayo: 'Has elegido la opción {opcionElegida} — exactamente lo que predice la teoría prospectiva de Kahneman y Tversky (1979): ante una ganancia, la mayoría prefiere lo seguro; ante una pérdida enmarcada igual, la mayoría prefiere arriesgarse para evitarla. Las dos decisiones tienen el mismo resultado matemático esperado. Solo cambia cómo se cuenta la historia.',
    revelarNoCayo: 'Has elegido la opción {opcionElegida} — la contraria a lo que predice la mayoría en este marco, según la teoría prospectiva de Kahneman y Tversky (1979). Le pasa a la mayoría: ante una pérdida se vuelve más arriesgada, ante una ganancia equivalente se vuelve más conservadora, aunque el resultado matemático sea idéntico.',
    sourceId: 'eco-02'
  },
  {
    id: 'calidez-social',
    slug: 'calidez-fisica-calidez-social',
    titulo: 'Calidez física, calidez social',
    gancho: 'Un vaso en la mano puede cambiar cómo juzgas a un desconocido.',
    resumen: 'Sostener algo caliente o frío durante diez segundos, antes de conocer a alguien, cambia lo que piensas de esa persona.',
    tipo: 'slider',
    sliderMin: 0,
    sliderMax: 10,
    sliderDefault: 5,
    sliderLabels: ['Fría / egoísta', 'Cálida / generosa'],
    pregunta: 'Solo por esa breve charla, ¿qué tan cálida y generosa dirías que es esa persona, del 0 al 10?',
    condiciones: [
      { key: 'caliente', contexto: 'Alguien te da un vaso de café <strong>caliente</strong> para sujetar mientras hablas un momento con un desconocido.', textoCorto: 'algo caliente' },
      { key: 'frio',     contexto: 'Alguien te da un vaso de café <strong>helado</strong> para sujetar mientras hablas un momento con un desconocido.', textoCorto: 'algo helado' }
    ],
    cayoSiAlto: 'caliente',
    cayoSiBajo: 'frio',
    revelarCayo: 'Le has puesto un {rating}/10 después de sujetar algo {condicionTexto} — nada más. Es lo que encontraron Williams y Bargh en 2008: sostener brevemente algo caliente hace que juzguemos a un desconocido como más cálido y generoso, sin que nos demos cuenta de por qué. La temperatura física y la calidez social comparten sustrato neuronal.',
    revelarNoCayo: 'Esta vez tu {rating}/10 no siguió la temperatura del vaso — pero le pasa a la mayoría: Williams y Bargh (2008) encontraron que sostener brevemente algo caliente nos hace juzgar a un desconocido como más cálido y generoso, sin que seamos conscientes de por qué.',
    sourceId: 'rel-06'
  }
];

for (const esc of SIMULADOR_ESCENARIOS) {
  const art = findArticleById(esc.sourceId);
  if (!art) {
    console.error(`ERROR: el escenario "${esc.id}" del simulador cita el artículo "${esc.sourceId}", que no existe en LIBRARY_ARTICLES.`);
    process.exit(1);
  }
  esc.sourceUrl = articleUrl(art);
  esc.sourceTitle = art.title;
  esc.sourceLabel = art.sourceLabel;
}

// ── Artículos relacionados: 2 misma categoría + 1 de otra ──────
function relatedArticles(art, cat) {
  const sameCategory = LIBRARY_ARTICLES[cat].filter(a => a.id !== art.id);
  const idx = LIBRARY_ARTICLES[cat].findIndex(a => a.id === art.id);
  const sameRelated = [];
  for (let i = 1; i <= sameCategory.length && sameRelated.length < 2; i++) {
    const candidate = LIBRARY_ARTICLES[cat][(idx + i) % LIBRARY_ARTICLES[cat].length];
    if (candidate.id !== art.id) sameRelated.push(candidate);
  }

  const otherCats = CAT_KEYS.filter(c => c !== cat);
  const catIdx = CAT_KEYS.indexOf(cat);
  const otherCat = otherCats[catIdx % otherCats.length];
  const otherRelated = LIBRARY_ARTICLES[otherCat][0];

  return [...sameRelated.map(a => ({ art: a, cat })), { art: otherRelated, cat: otherCat }];
}

function sidebarArticles(art, cat) {
  const idx = LIBRARY_ARTICLES[cat].findIndex(a => a.id === art.id);
  const same = [];
  for (let i = 1; i <= LIBRARY_ARTICLES[cat].length && same.length < 2; i++) {
    const c = LIBRARY_ARTICLES[cat][(idx + i) % LIBRARY_ARTICLES[cat].length];
    if (c.id !== art.id) same.push({ art: c, cat });
  }
  const otherCats = CAT_KEYS.filter(c => c !== cat);
  const catIdx = CAT_KEYS.indexOf(cat);
  const other = [];
  for (let i = 0; i < otherCats.length && other.length < 2; i++) {
    const oc = otherCats[(catIdx + 1 + i) % otherCats.length];
    other.push({ art: LIBRARY_ARTICLES[oc][i % LIBRARY_ARTICLES[oc].length], cat: oc });
  }
  return [...same, ...other];
}

function staticHero() {
  return `
  <header class="static-navbar">
    <div class="static-navbar-inner">
      <a href="/" class="static-navbar-brand">
        <img src="/img/logo2.png" alt="La Inferencia" class="static-navbar-logo" />
        <span>La Inferencia</span>
      </a>
      <div class="static-navbar-links">
        <button type="button" class="static-navbar-search-btn" data-buscador-trigger aria-label="Buscar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <a href="/simulador-de-sesgos/" class="static-navbar-link">Simulador de Sesgos</a>
        <a href="/" class="static-navbar-cta">Explorar los ${TOTAL_ARTS} artículos →</a>
      </div>
    </div>
  </header>
  <section class="static-hero" aria-label="La Inferencia">
    <div class="static-hero-inner">
      <div class="static-hero-visual">
        <img src="/img/logo2.png" alt="La Inferencia" class="static-hero-logo" />
      </div>
      <p class="static-hero-title">La Inferencia</p>
      <p class="static-hero-tagline">La psicología más allá del aula y la consulta.<br>Investigación real, en español, gratis.</p>
    </div>
  </section>`;
}

function staticFooterScripts() {
  return `<script src="/js/search-index.js?v=1"></script>
<script defer src="/js/buscador.js?v=2"></script>`;
}

function htmlHead({ title, description, canonUrl, ldJsonBlocks }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonUrl}" />
  <link rel="alternate" hreflang="es" href="${canonUrl}" />
  <meta property="og:type"        content="website" />
  <meta property="og:site_name"   content="La Inferencia" />
  <meta property="og:title"       content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url"         content="${canonUrl}" />
  <meta property="og:image"       content="${SITE}/img/OG.png" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale"      content="es_ES" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image"       content="${SITE}/img/OG.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
  <link rel="preload" as="style" href="/css/styles.css?v=42" />
  <link rel="stylesheet" href="/css/styles.css?v=42" />
  <link rel="icon" type="image/png" href="/img/logo.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
  <meta name="theme-color" content="#030C1A" />
${ldJsonBlocks.map(b => `  <script type="application/ld+json">\n${b}\n  </script>`).join('\n')}
  <script defer src="https://cloud.umami.is/script.js" data-website-id="79211994-3fb4-4d6a-84d4-8860aeadcd92"></script>
  <script>(function(){var t=localStorage.getItem('theme');if(t&&t!=='light'){document.documentElement.setAttribute('data-theme',t);if(['dark','naranja','tormenta','cosmos','carmesi'].indexOf(t)>-1)document.documentElement.classList.add('dark-base');}})();</script>
</head>`;
}

// ── Helpers para replicar el diseño in-app ─────────────────────
function buildAuthorCard(author) {
  const profile  = AUTHORS[author.name] || {};
  const photo    = profile.photo || null;
  const univ     = profile.university || author.university;
  const spec     = profile.specialty  || author.specialty;
  const isFounder = author.name === 'Miguel Noguer Escudero';
  const avatarHTML = photo
    ? `<img src="/${photo}" alt="${author.name}" class="author-avatar-img" />`
    : author.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const metaHTML = isFounder
    ? `<div class="role-badges-row role-badges-row--inline">
         <span class="role-badge">Fundador de La Inferencia</span>
         <span class="role-badge">Director de Fuera de Bata</span>
       </div>`
    : `<span>${univ}</span><span>${spec}</span>`;
  return `<div class="author-card">
      <div class="author-avatar${photo ? ' author-avatar-photo' : ''}">${avatarHTML}</div>
      <div><strong>${author.name}</strong>${metaHTML}</div>
    </div>`;
}

function buildTocHTML(sections) {
  if (!sections || sections.length < 2) return '';
  const links = sections
    .map((s, i) => s.tocSkip ? null : `<li><a class="toc-link" href="#art-sec-${i}">${s.subtitle}</a></li>`)
    .filter(Boolean);
  if (links.length < 2) return '';
  return `<nav class="article-toc" aria-label="Índice del artículo">
    <span class="toc-label">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      Índice
    </span>
    <ol class="toc-list">${links.join('')}</ol>
  </nav>`;
}

function buildStatsHTML(id) {
  const stats = ARTICLE_STATS[id];
  if (!stats || !stats.length) return '';
  return `<div class="stat-callout-row">${stats.map(s =>
    `<div class="stat-callout">
      <span class="stat-value">${s.value}</span>
      <span class="stat-label">${s.label}</span>
      <span class="stat-detail">${s.detail}</span>
    </div>`
  ).join('')}</div>`;
}

// ── Template HTML por artículo ─────────────────────────────────
function buildPage(art, cat) {
  const catSlug  = CAT_SLUGS[cat] || cat;
  const artSlug  = toSlug(art.title);
  const canonUrl = `${SITE}/articulos/${catSlug}/${artSlug}/`;
  const catLabel = CAT_LABELS[cat] || cat;
  const rawDesc  = (art.intro || art.summary || '').replace(/<[^>]+>/g, '');
  const override = SEO_OVERRIDES[art.id] || {};
  const desc     = override.seoDescription || (rawDesc.substring(0, 152) + '…');
  const titleEsc = art.title.replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const seoTitle = (override.seoTitle || `${art.title} — La Inferencia`).replace(/"/g, '&quot;');
  const descEsc  = desc.replace(/"/g, '&quot;');

  const sectionsHTML = (art.sections || []).map((s, i) => {
    const paragraphs = (s.paragraphs || []).map(p => `      <p>${p}</p>`).join('\n');
    const chart = (i === 0 && art.chart)
      ? `\n      <figure class="article-chart">\n        ${art.chart.svg}\n        <figcaption>${art.chart.caption}</figcaption>\n      </figure>`
      : '';
    return `    <h2 class="article-subtitle" id="art-sec-${i}">${s.subtitle}</h2>\n${paragraphs}${chart}`;
  }).join('\n\n');

  const blockquoteHTML = art.blockquote
    ? `    <blockquote class="article-blockquote">\n      <p>${art.blockquote.text}</p>\n      <cite>— ${art.blockquote.attribution}</cite>\n    </blockquote>`
    : '';

  const aplicacionHTML = art.aplicacion
    ? `    <div class="aplicacion-block">\n      <div class="aplicacion-header"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg><strong>¿Cómo te afecta esto hoy?</strong></div>\n      <p>${art.aplicacion}</p>\n    </div>`
    : '';

  const related = relatedArticles(art, cat);
  const relatedHTML = `      <div class="static-related">
        <h2 class="static-related-heading">Seguir leyendo</h2>
        <div class="static-related-grid">
${related.map(r => {
  const url = articleUrl(r.art);
  const lbl = CAT_LABELS[r.cat] || r.cat;
  const sum = (r.art.summary || '').substring(0, 120);
  return `          <a href="${url}" class="static-related-card">
            <span class="static-related-badge">${lbl}</span>
            <strong class="static-related-card-title">${r.art.title}</strong>
            <p class="static-related-card-summary">${sum}</p>
          </a>`;
}).join('\n')}
        </div>
      </div>`;

  const faqs = override.faqs || [];
  const faqJsonLd = faqs.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
    }))
  } : null;

  const faqHTML = faqs.length ? `      <div class="static-faq">
        <h2>Preguntas frecuentes</h2>
${faqs.map(f => `        <details class="static-faq-item">\n          <summary>${f.q}</summary>\n          <p>${f.a}</p>\n        </details>`).join('\n')}
      </div>` : '';

  const escenarioRelacionado = SIMULADOR_ESCENARIOS.find(e => e.sourceId === art.id);
  const simuladorCtaHTML = escenarioRelacionado ? `      <div class="static-sim-cta">
        <p><strong>¿Y si te pasara a ti?</strong> Decide antes de leer más — en menos de un minuto.</p>
        <a href="/simulador-de-sesgos/${escenarioRelacionado.slug}/" class="static-sim-cta-btn">Probar «${escenarioRelacionado.titulo}» →</a>
      </div>` : '';

  const articleLdJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': art.title,
    'description': art.summary || rawDesc.substring(0, 155),
    'author': {
      '@type': 'Person',
      '@id': AUTHOR_URL,
      'name': AUTHOR_NAME,
      'url': AUTHOR_URL
    },
    'contributor': {
      '@type': 'Person',
      'name': art.author.name,
      'affiliation': { '@type': 'Organization', 'name': art.author.university }
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'La Inferencia',
      'url': SITE,
      'logo': { '@type': 'ImageObject', 'url': `${SITE}/img/logo2.png` }
    },
    'image': `${SITE}/img/OG.png`,
    'url': canonUrl,
    'inLanguage': 'es',
    'datePublished': toISODate(art.date) || art.date || '',
    'mainEntityOfPage': { '@type': 'WebPage', '@id': canonUrl },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Inicio',    'item': `${SITE}/` },
        { '@type': 'ListItem', 'position': 2, 'name': catLabel,    'item': `${SITE}/articulos/${catSlug}/` },
        { '@type': 'ListItem', 'position': 3, 'name': art.title,   'item': canonUrl }
      ]
    }
  }, null, 2);

  const ldBlocks = [articleLdJson];
  if (faqJsonLd) ldBlocks.push(JSON.stringify(faqJsonLd, null, 2));

  const head = htmlHead({
    title: seoTitle,
    description: descEsc,
    canonUrl,
    ldJsonBlocks: ldBlocks
  });

  const sidebar = sidebarArticles(art, cat);
  const sidebarHTML = `    <aside class="static-sidebar">
      <div class="static-sidebar-inner">
        <p class="static-sidebar-heading">Más artículos</p>
${sidebar.map(r => {
  const url = articleUrl(r.art);
  const lbl = CAT_LABELS[r.cat] || r.cat;
  return `        <a href="${url}" class="static-sidebar-article">
          <span class="static-sidebar-badge">${lbl}</span>
          <span class="static-sidebar-title">${r.art.title}</span>
        </a>`;
}).join('\n')}
        <a href="/" class="static-sidebar-cta">Ver todos los artículos →</a>
      </div>
    </aside>`;

  return `${head}
<body>

  <a class="skip-link" href="#article-main">Saltar al contenido</a>
  <div id="bg-layer" aria-hidden="true"></div>
  <canvas id="static-neural-canvas" aria-hidden="true"></canvas>
${staticHero()}

  <main id="article-main" class="static-art-main">
    <div class="static-layout">
      <div class="static-art-wrap">

      <nav class="static-breadcrumb" aria-label="Ruta de navegación">
        <a href="/">Inicio</a>
        <span aria-hidden="true"> › </span>
        <a href="/articulos/${catSlug}/">${catLabel}</a>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">${art.title}</span>
      </nav>

      <div class="weekly-featured-card">
        <div class="week-label">
          <span class="week-tag">✦ ${art.badge}</span>
          <span class="reading-time">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${art.readingTime} de lectura
          </span>
          <button type="button" class="save-btn" data-article-id="${art.id}" aria-pressed="false" aria-label="Guardar en tu colección" title="Guardar en tu colección" data-umami-event="collection-save" data-umami-event-origen="articulo-estatico" data-umami-event-articulo="${art.id}">
            <span class="save-btn-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
            <span class="save-btn-text">Guardar</span>
          </button>
        </div>
        <h1 class="weekly-title">${art.title}</h1>
        ${buildAuthorCard(art.author)}
        ${buildTocHTML(art.sections)}
        <div class="article-content">
          <p class="article-intro">${art.intro}</p>
          ${buildStatsHTML(art.id)}
${sectionsHTML}
${blockquoteHTML}
${aplicacionHTML}
          <a href="${art.sourceUrl}" class="source-verify-btn" target="_blank" rel="noopener noreferrer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Verificar fuente · ${art.sourceLabel}
          </a>
${simuladorCtaHTML}
${faqHTML}
        </div>
      </div>

${relatedHTML}

      <div class="static-art-cta">
        <p><strong>${TOTAL_ARTS} artículos más</strong> esperando. Sesgos, emociones, decisiones — escritos sobre estudios reales, en español y sin jerga.</p>
        <a href="/" class="static-art-cta-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          Entrar a La Inferencia
        </a>
      </div>

      </div>
${sidebarHTML}
    </div>
  </main>

<script>
(function(){
  var c=document.getElementById('static-neural-canvas');
  if(!c)return;
  var x=c.getContext('2d'),pts=[],W,H,rid=null,run=false;
  var CFG={N:80,MAX_D:140,na:0.28,la:0.42,lw:1.0,l:[16,185,129],r:[37,99,235]};
  function nc(px,a){var t=Math.min(1,Math.max(0,px/W));return 'rgba('+Math.round(CFG.l[0]+(CFG.r[0]-CFG.l[0])*t)+','+Math.round(CFG.l[1]+(CFG.r[1]-CFG.l[1])*t)+','+Math.round(CFG.l[2]+(CFG.r[2]-CFG.l[2])*t)+','+a+')';}
  function mkp(){return{x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*2+1.2,a:Math.random()*.3+CFG.na};}
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  function init(){resize();pts=Array.from({length:CFG.N},mkp);}
  var last=0,FMS=1000/30;
  function frame(now){
    if(now-last<FMS){if(run)rid=requestAnimationFrame(frame);return;}
    last=now;var MD2=CFG.MAX_D*CFG.MAX_D,N=pts.length;
    x.clearRect(0,0,W,H);
    for(var p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle=nc(p.x,p.a);x.fill();}
    x.lineWidth=CFG.lw;x.beginPath();
    for(var i=0;i<N;i++)for(var j=i+1;j<N;j++){var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y;if(dx*dx+dy*dy<MD2){x.moveTo(pts[i].x,pts[i].y);x.lineTo(pts[j].x,pts[j].y);}}
    x.strokeStyle=nc(W*.5,CFG.la*.7);x.stroke();
    if(run)rid=requestAnimationFrame(frame);
  }
  function start(){if(!run){run=true;rid=requestAnimationFrame(frame);}}
  function stop(){run=false;if(rid){cancelAnimationFrame(rid);rid=null;}}
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start();});
  window.addEventListener('resize',function(){resize();pts.forEach(function(p){if(p.x>W)p.x=Math.random()*W;if(p.y>H)p.y=Math.random()*H;});},{passive:true});
  init();start();
}());
</script>
<script defer src="/js/save-button.js?v=1"></script>
${staticFooterScripts()}
</body>
</html>`;
}

// ── Template página de categoría ───────────────────────────────
function buildCategoryPage(cat) {
  const catSlug  = CAT_SLUGS[cat] || cat;
  const catLabel = CAT_LABELS[cat] || cat;
  const canonUrl = `${SITE}/articulos/${catSlug}/`;
  const arts     = LIBRARY_ARTICLES[cat];
  const desc     = CAT_DESCRIPTIONS[cat] || `Artículos de psicología sobre ${catLabel.toLowerCase()} basados en evidencia científica.`;
  const title    = `Psicología de ${catLabel === 'Salud Mental' ? 'la' : (/^[AEIOU]/i.test(catLabel) ? 'la' : 'el/la')} ${catLabel} — Artículos basados en evidencia — La Inferencia`;

  const ldJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `Psicología de ${catLabel}`,
    'description': desc,
    'url': canonUrl,
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': `${SITE}/` },
        { '@type': 'ListItem', 'position': 2, 'name': catLabel, 'item': canonUrl }
      ]
    }
  }, null, 2);

  const head = htmlHead({
    title: `Psicología de ${catLabel} — Artículos basados en evidencia — La Inferencia`,
    description: desc,
    canonUrl,
    ldJsonBlocks: [ldJson]
  });

  const articlesHTML = arts.map(art => {
    const url = articleUrl(art);
    return `        <li class="cat-article-item">
          <a href="${url}">
            <span class="cat-article-badge">${art.badge}</span>
            <h2>${art.title}</h2>
            <p>${art.summary}</p>
          </a>
        </li>`;
  }).join('\n');

  return `${head}
<body>

  <a class="skip-link" href="#cat-main">Saltar al contenido</a>
  <div id="bg-layer" aria-hidden="true"></div>
${staticHero()}

  <main id="cat-main" class="static-art-main">
    <div class="static-art-wrap">

      <nav class="static-breadcrumb" aria-label="Ruta de navegación">
        <a href="/">Inicio</a>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">${catLabel}</span>
      </nav>

      <header class="static-cat-header">
        <h1>Psicología de la ${catLabel} — Artículos basados en evidencia</h1>
        <p>${desc}</p>
      </header>

      <ul class="cat-article-list">
${articlesHTML}
      </ul>

    </div>
  </main>

${staticFooterScripts()}
</body>
</html>`;
}

// ── Template página de autor ───────────────────────────────────
function buildAuthorPage() {
  const canonUrl = AUTHOR_URL;
  const allArts = Object.entries(LIBRARY_ARTICLES).flatMap(([cat, arts]) => arts.map(a => ({ art: a, cat })));

  const ldJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': canonUrl,
    'name': AUTHOR_NAME,
    'url': canonUrl,
    'image': `${SITE}/img/caramiguel.png`,
    'jobTitle': 'Fundador y editor — La Inferencia',
    'worksFor': { '@type': 'Organization', 'name': 'La Inferencia', 'url': SITE },
    'description': 'Fundador de La Inferencia, web de divulgación de psicología basada en evidencia científica. Convierte investigación académica peer-reviewed en contenido accesible en español.',
    'sameAs': [
      'https://www.linkedin.com/company/la-inferencia/'
    ]
  }, null, 2);

  const head = htmlHead({
    title: `${AUTHOR_NAME} — Fundador de La Inferencia`,
    description: `${AUTHOR_NAME} es el fundador y editor de La Inferencia, web de divulgación de psicología basada en evidencia. Conoce su trabajo y todos sus artículos publicados.`,
    canonUrl,
    ldJsonBlocks: [ldJson]
  });

  const articlesHTML = allArts.map(({ art, cat }) => {
    const url = articleUrl(art);
    const catLabel = CAT_LABELS[cat] || cat;
    return `        <li class="cat-article-item">
          <a href="${url}">
            <span class="cat-article-badge">${catLabel}</span>
            <h2>${art.title}</h2>
          </a>
        </li>`;
  }).join('\n');

  return `${head}
<body>

  <a class="skip-link" href="#author-main">Saltar al contenido</a>
  <div id="bg-layer" aria-hidden="true"></div>
${staticHero()}

  <main id="author-main" class="static-art-main">
    <div class="static-art-wrap">

      <nav class="static-breadcrumb" aria-label="Ruta de navegación">
        <a href="/">Inicio</a>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">${AUTHOR_NAME}</span>
      </nav>

      <header class="static-author-header">
        <img src="/img/caramiguel.png" alt="${AUTHOR_NAME}" class="static-author-photo" width="120" height="120" />
        <h1>${AUTHOR_NAME}</h1>
        <p class="static-author-role">Fundador y editor — La Inferencia</p>
        <p class="static-author-bio">Miguel Noguer Escudero fundó La Inferencia para convertir investigación académica peer-reviewed en psicología en contenido accesible, claro y en español. Cada artículo publicado en la web parte de un estudio científico verificable, citado y enlazado a su fuente original.</p>
        <a href="https://www.linkedin.com/company/la-inferencia/" target="_blank" rel="noopener noreferrer" class="static-author-linkedin">LinkedIn de La Inferencia</a>
      </header>

      <h2 class="static-author-arts-title">Artículos publicados (${allArts.length})</h2>
      <ul class="cat-article-list">
${articlesHTML}
      </ul>

    </div>
  </main>

${staticFooterScripts()}
</body>
</html>`;
}

// ── Template landing del Simulador de Sesgos ────────────────────
const SIMULADOR_URL = `${SITE}/simulador-de-sesgos/`;

function buildSimuladorLandingPage() {
  const ldJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Simulador de Sesgos — La Inferencia',
    'description': 'Decide antes de leer. Tres escenarios de 60 segundos que demuestran, sobre tu propia decisión, cómo funcionan los sesgos cognitivos más estudiados de la psicología.',
    'url': SIMULADOR_URL,
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': `${SITE}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Simulador de Sesgos', 'item': SIMULADOR_URL }
      ]
    }
  }, null, 2);

  const head = htmlHead({
    title: 'Simulador de Sesgos — Decide antes de leer — La Inferencia',
    description: 'Tres escenarios de 60 segundos. Decides primero, y después descubres en qué sesgo cognitivo acabas de caer — con el estudio real detrás.',
    canonUrl: SIMULADOR_URL,
    ldJsonBlocks: [ldJson]
  });

  const cardsHTML = SIMULADOR_ESCENARIOS.map(esc => `        <a href="/simulador-de-sesgos/${esc.slug}/" class="sim-landing-card">
          <span class="sim-landing-card-badge">${esc.gancho}</span>
          <h2>${esc.titulo}</h2>
          <p>${esc.resumen}</p>
          <span class="sim-landing-card-cta">Decidir ahora →</span>
        </a>`).join('\n');

  return `${head}
<body>

  <a class="skip-link" href="#sim-main">Saltar al contenido</a>
  <div id="bg-layer" aria-hidden="true"></div>
${staticHero()}

  <main id="sim-main" class="static-art-main">
    <div class="static-art-wrap">

      <nav class="static-breadcrumb" aria-label="Ruta de navegación">
        <a href="/">Inicio</a>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">Simulador de Sesgos</span>
      </nav>

      <header class="static-cat-header">
        <h1>Simulador de Sesgos</h1>
        <p>Decides antes de leer. Cada escenario dura menos de un minuto — al final descubres en qué sesgo cognitivo acabas de caer, con el estudio real que lo demostró.</p>
      </header>

      <div class="sim-landing-grid">
${cardsHTML}
      </div>

      <div id="sim-summary-root" data-role="landing-summary" hidden></div>

    </div>
  </main>

<script defer src="/js/simulador.js?v=1"></script>
${staticFooterScripts()}
</body>
</html>`;
}

// ── Template de un escenario individual del Simulador de Sesgos ─
function buildEscenarioPage(esc) {
  const canonUrl = `${SITE}/simulador-de-sesgos/${esc.slug}/`;

  const ldJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${esc.titulo} — Simulador de Sesgos — La Inferencia`,
    'description': esc.resumen,
    'url': canonUrl,
    'isPartOf': { '@type': 'CollectionPage', 'name': 'Simulador de Sesgos', 'url': SIMULADOR_URL },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': `${SITE}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Simulador de Sesgos', 'item': SIMULADOR_URL },
        { '@type': 'ListItem', 'position': 3, 'name': esc.titulo, 'item': canonUrl }
      ]
    }
  }, null, 2);

  const head = htmlHead({
    title: `${esc.titulo} — Simulador de Sesgos — La Inferencia`,
    description: `${esc.resumen} Decide en menos de un minuto y descubre el estudio real detrás: ${esc.sourceLabel}.`,
    canonUrl,
    ldJsonBlocks: [ldJson]
  });

  const escConfig = {
    id: esc.id,
    titulo: esc.titulo,
    tipo: esc.tipo,
    condiciones: esc.condiciones,
    cayoSiAlto: esc.cayoSiAlto,
    cayoSiBajo: esc.cayoSiBajo,
    cayoSi: esc.cayoSi,
    pregunta: esc.pregunta,
    sliderMin: esc.sliderMin,
    sliderMax: esc.sliderMax,
    sliderDefault: esc.sliderDefault,
    sliderLabels: esc.sliderLabels,
    revelarCayo: esc.revelarCayo,
    revelarNoCayo: esc.revelarNoCayo,
    sourceUrl: esc.sourceUrl,
    sourceTitle: esc.sourceTitle,
    sourceLabel: esc.sourceLabel,
    allSources: SIMULADOR_ESCENARIOS.map(e => ({ titulo: e.sourceTitle, url: e.sourceUrl }))
  };
  const escConfigJson = JSON.stringify(escConfig).replace(/</g, '\\u003c').replace(/'/g, '&#39;');

  return `${head}
<body>

  <a class="skip-link" href="#sim-esc-main">Saltar al contenido</a>
  <div id="bg-layer" aria-hidden="true"></div>
${staticHero()}

  <main id="sim-esc-main" class="static-art-main">
    <div class="static-art-wrap">

      <nav class="static-breadcrumb" aria-label="Ruta de navegación">
        <a href="/">Inicio</a>
        <span aria-hidden="true"> › </span>
        <a href="/simulador-de-sesgos/">Simulador de Sesgos</a>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">${esc.titulo}</span>
      </nav>

      <div id="simulador-root" data-escenario='${escConfigJson}'></div>

    </div>
  </main>

<script defer src="/js/simulador.js?v=1"></script>
${staticFooterScripts()}
</body>
</html>`;
}

// ── Índice de búsqueda (para js/buscador.js) ────────────────────
// Se genera en build time a partir del mismo contenido que ya existe —
// no es una llamada a ningún servicio externo de embeddings, es un
// índice de palabras clave ponderado. Se declara honestamente como
// "buscador" en la interfaz, no como "IA semántica".
function buildSearchIndex() {
  const items = [];

  for (const [cat, arts] of Object.entries(LIBRARY_ARTICLES)) {
    for (const art of arts) {
      items.push({
        tipo: 'articulo',
        id: art.id,
        titulo: art.title,
        badge: art.badge,
        resumen: (art.summary || art.intro || '').substring(0, 160),
        texto: [art.title, art.badge, art.summary, (art.intro || '').substring(0, 200), ...(art.sections || []).map(s => s.subtitle)].filter(Boolean).join(' '),
        url: articleUrl(art)
      });
    }
  }

  for (const esc of SIMULADOR_ESCENARIOS) {
    items.push({
      tipo: 'escenario',
      id: esc.id,
      titulo: esc.titulo,
      badge: 'Simulador de Sesgos',
      resumen: esc.resumen,
      texto: [esc.titulo, esc.gancho, esc.resumen].filter(Boolean).join(' '),
      url: `${SITE}/simulador-de-sesgos/${esc.slug}/`
    });
  }

  return items;
}

// ── Generar ficheros HTML ──────────────────────────────────────
const ROOT        = __dirname;
const ARTS_DIR    = path.join(ROOT, 'articulos');
const today       = new Date().toISOString().split('T')[0];
let   count       = 0;

fs.mkdirSync(ARTS_DIR, { recursive: true });

for (const [cat, arts] of Object.entries(LIBRARY_ARTICLES)) {
  const catSlug = CAT_SLUGS[cat] || cat;
  const catDir  = path.join(ARTS_DIR, catSlug);
  fs.mkdirSync(catDir, { recursive: true });

  for (const art of arts) {
    const { artSlug } = slugMap[art.id];
    const artDir = path.join(catDir, artSlug);
    fs.mkdirSync(artDir, { recursive: true });
    fs.writeFileSync(path.join(artDir, 'index.html'), buildPage(art, cat), 'utf-8');
    count++;
    console.log(`  ✓ /articulos/${catSlug}/${artSlug}/`);
  }

  // Página de categoría
  fs.writeFileSync(path.join(catDir, 'index.html'), buildCategoryPage(cat), 'utf-8');
  console.log(`  ✓ /articulos/${catSlug}/ (categoría)`);
}

console.log(`\n✅ ${count} páginas de artículo + ${CAT_KEYS.length} páginas de categoría generadas\n`);

// ── Simulador de Sesgos ──────────────────────────────────────────
const SIM_DIR = path.join(ROOT, 'simulador-de-sesgos');
fs.mkdirSync(SIM_DIR, { recursive: true });
fs.writeFileSync(path.join(SIM_DIR, 'index.html'), buildSimuladorLandingPage(), 'utf-8');
console.log('  ✓ /simulador-de-sesgos/ (landing)');
for (const esc of SIMULADOR_ESCENARIOS) {
  const escDir = path.join(SIM_DIR, esc.slug);
  fs.mkdirSync(escDir, { recursive: true });
  fs.writeFileSync(path.join(escDir, 'index.html'), buildEscenarioPage(esc), 'utf-8');
  console.log(`  ✓ /simulador-de-sesgos/${esc.slug}/`);
}
console.log(`\n✅ Simulador de Sesgos generado (1 landing + ${SIMULADOR_ESCENARIOS.length} escenarios)\n`);

// ── Página de autor ─────────────────────────────────────────────
const AUTHOR_DIR = path.join(ROOT, 'autores', 'miguel-noguer');
fs.mkdirSync(AUTHOR_DIR, { recursive: true });
fs.writeFileSync(path.join(AUTHOR_DIR, 'index.html'), buildAuthorPage(), 'utf-8');
console.log('✅ Página de autor generada en /autores/miguel-noguer/\n');

// ── Regenerar sitemap.xml con URLs limpias ─────────────────────
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <lastmod>${today}</lastmod>
  </url>
`;

for (const cat of CAT_KEYS) {
  const catSlug = CAT_SLUGS[cat] || cat;
  sitemap += `  <url><loc>${SITE}/articulos/${catSlug}/</loc><changefreq>weekly</changefreq><priority>0.9</priority><lastmod>${today}</lastmod></url>\n`;
}

sitemap += `  <url><loc>${AUTHOR_URL}</loc><changefreq>monthly</changefreq><priority>0.6</priority><lastmod>${today}</lastmod></url>\n`;

sitemap += `  <url><loc>${SIMULADOR_URL}</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>${today}</lastmod></url>\n`;
for (const esc of SIMULADOR_ESCENARIOS) {
  sitemap += `  <url><loc>${SITE}/simulador-de-sesgos/${esc.slug}/</loc><changefreq>monthly</changefreq><priority>0.7</priority><lastmod>${today}</lastmod></url>\n`;
}

for (const [cat, arts] of Object.entries(LIBRARY_ARTICLES)) {
  for (const art of arts) {
    const { catSlug, artSlug } = slugMap[art.id];
    sitemap += `  <url><loc>${SITE}/articulos/${catSlug}/${artSlug}/</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>${today}</lastmod></url>\n`;
  }
}

sitemap += `</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf-8');
console.log(`✅ sitemap.xml actualizado con ${count} artículos + ${CAT_KEYS.length} categorías + autor + simulador de sesgos`);

// ── sitemap-images.xml ──────────────────────────────────────────
let imgSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE}/</loc>
    <image:image>
      <image:loc>${SITE}/img/OG.png</image:loc>
      <image:title>La Inferencia — Psicología basada en evidencia</image:title>
    </image:image>
  </url>
`;

for (const [cat, arts] of Object.entries(LIBRARY_ARTICLES)) {
  for (const art of arts) {
    const { catSlug, artSlug } = slugMap[art.id];
    const titleEsc = art.title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    imgSitemap += `  <url>
    <loc>${SITE}/articulos/${catSlug}/${artSlug}/</loc>
    <image:image>
      <image:loc>${SITE}/img/OG.png</image:loc>
      <image:title>${titleEsc}</image:title>
    </image:image>
  </url>
`;
  }
}

imgSitemap += `</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap-images.xml'), imgSitemap, 'utf-8');
console.log(`✅ sitemap-images.xml generado con ${count + 1} entradas`);

// ── Índice de búsqueda ────────────────────────────────────────
const searchIndex = buildSearchIndex();
fs.writeFileSync(
  path.join(ROOT, 'js', 'search-index.js'),
  `window.LI_SEARCH_INDEX = ${JSON.stringify(searchIndex)};\n`,
  'utf-8'
);
console.log(`✅ js/search-index.js generado con ${searchIndex.length} entradas`);
