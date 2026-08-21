# La Inferencia — Documentación Técnica

> Actualizar este archivo cuando haya cambios importantes en funcionalidades o estructura.

---

## Descripción

Web de divulgación de psicología basada en evidencia. Convierte investigación académica (artículos peer-reviewed) en contenido accesible, claro y en español.

- **Fundador:** Miguel Noguer Escudero
- **Tagline:** "Convertimos investigación en conocimiento útil, claro y accesible"
- **Idioma:** Español (es_ES)
- **Estado:** MVP publicado — https://lainferencia.com
- **Audiencia:** Público general con curiosidad por la psicología. Entretenimiento e interés personal, no académico. Accesible también para estudiantes de psicología.
- **Redes:** Solo LinkedIn (cuenta de empresa La Inferencia)
  - Automatizar posts en la página de empresa via LinkedIn API
  - Generar mensajes personalizados con Claude para perfiles seleccionados (~30-50 contactos filtrados por sector/cargo), enviados manualmente
  - Objetivo: reclutar participantes para "Fuera de Bata" y crecimiento orgánico vía red de contactos
- **Stack:** GitHub (github.com/Noguer1/LaInferencia) + Vercel (deploy automático en cada git push) + Supabase (propuestas y votos activos)

---

## Infraestructura de deploy

| Servicio | Detalle |
|----------|---------|
| **GitHub** | github.com/Noguer1/LaInferencia — rama `main` |
| **Vercel** | lainferencia.com — conectado a GitHub, despliega automáticamente en cada push |
| **Supabase** | dbyoxssdbboxnbecgpbf.supabase.co — base de datos PostgreSQL |

**Flujo de trabajo:** editar archivos → `git add` → `git commit` → `git push` → Vercel despliega en ~30s.

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Markup | HTML5 semántico |
| Estilos | CSS3 puro — custom properties, grid, flexbox, backdrop-filter |
| Lógica | JavaScript vanilla (ES6+) |
| Tipografía | Google Fonts — Plus Jakarta Sans (300–800) |
| SEO | JSON-LD schema, Open Graph, robots.txt, sitemap.xml |
| Persistencia local | localStorage (tema, progreso, voter_uuid) |
| Backend | Supabase REST API (propuestas y votos) |
| Web APIs | Web Share API (con fallback a clipboard) |

Sin frameworks JS. Sin bundler. Sin dependencias npm.

---

## Estructura de archivos

```
CarpetaClaude/
├── index.html              # Única página HTML (SPA sin router)
├── css/
│   └── styles.css          # Todos los estilos: variables, componentes, temas, responsive
├── js/
│   └── main.js             # Toda la lógica de la app
├── img/                    # Assets estáticos
│   ├── logo.png / logo2.png / logo3.png
│   ├── cara*.png           # Avatares de autores (Andrew, Drazen, Edward…)
│   ├── Nivel0*.png         # Imágenes del sistema de niveles
│   └── favicon-*.png / apple-touch-icon.png
├── pdfs/                   # Documentos de referencia (documento1–3.pdf)
├── docs/
│   └── proyecto.md         # Este archivo
├── archive/                # Archivos no activos (ver nota abajo)
├── robots.txt
└── sitemap.xml
```

**`archive/` contiene** (no desplegar, no editar):
- `main.js.bak` — versión anterior de main.js
- `contenido_nuevo.js` — contenido ya integrado en main.js (redundante)
- `og-image-generator.html` — herramienta para regenerar `img/OG.png` si hace falta
- `og-image.svg` — diseño fuente de la imagen OG (1200×630)
- `install.ps1` — instalador del skill caveman, ajeno al proyecto web
- `skills-lock.json` — registro de versiones de skills caveman

---

## Funcionalidades

### Navegación principal — Tabs
Tres pestañas principales en el área central:
1. **Por Intereses** (activa por defecto) — artículos filtrados por categoría
2. **Fuera de Bata** — contenido más divulgativo / informal
3. **El Artículo de la Semana** — selección editorial

### Sistema de artículos (`LIBRARY_ARTICLES`)
Base de datos de artículos en JS con estructura:
```js
{
  id, title, summary, sourceUrl, sourceLabel,
  badge,           // categoría: "Economía", "Sesgos"…
  author: { name, university, specialty },
  readingTime, date,
  intro,
  sections: [{ subtitle, paragraphs[] }],
  blockquote: { text, attribution },
  aplicacion,      // aplicación práctica al final
  chart            // SVG embebido con leyenda
}
```
Categorías actuales: Economía (eco-01, eco-02…), Sesgos, otras.

### Filtrado por intereses
Botones de categoría que filtran `LIBRARY_ARTICLES`. La sección "Tus Favoritos" existe en JS (`renderFavSection()` busca `#favoritos-section`) pero está desactivada en HTML. 15 categorías (`.cat-btn`, grid de 5 columnas): las 12 originales más Marketing, Viajes y Redes Sociales (añadidas julio 2026, artículos reales con cita, DOI y autor verificados). Desde agosto 2026 las 15 categorías generan páginas estáticas y entran en el sitemap (`CAT_SLUGS`/`CAT_LABELS`/`CAT_DESCRIPTIONS` en `generate-pages.js`). Si `LIBRARY_ARTICLES[cat]` está vacío para alguna categoría futura, `showCards()` muestra un mensaje "Todavía no hay artículos..." en vez de la cuadrícula, en lugar de romper.

### Sidebar izquierdo — Artículo de la Semana + Fuera de Bata
Desde agosto 2026, dos tarjetas venden las secciones que dejaron de tener pestaña visible (ver "Tab-bar simplificado" abajo):
- **`.sidebar-weekly-card`** (`#sidebar-weekly-card`): rellenada por JS. `renderSidebarWeeklyTeaser(article)` en `main.js` genera una versión compacta del teaser semanal (badge, título recortado con `-webkit-line-clamp`, autor, extracto ~100 caracteres, botón `#sidebar-week-read-btn`). Se invoca desde `initWeeklySection()` con `available[0]` (el artículo destacado de la semana). El botón activa `[data-tab="semana"]` y hace scroll suave a `.dashboard-center`.
- **`.sidebar-fdb-card`**: HTML estático (sin JS de renderizado), vende Fuera de Bata con un resumen corto y el botón `#sidebar-fdb-btn`, que activa `[data-tab="repositorio"]` y también hace scroll a `.dashboard-center`. Listener en su propia IIFE en `main.js`.

Concepto de la Semana (widget + modal + array `CONCEPTOS_SEMANA`) se eliminó por completo en agosto 2026. Radar de Mitos y el test cognitivo "¿Cuánto te manipula tu cerebro?" ya se habían eliminado antes (menos ruido, foco en monetización vía Audible).

### Tab-bar simplificado (agosto 2026)
"Por Intereses" es ahora la experiencia central de la home en escritorio. Las pestañas "Fuera de Bata" (`#tab-repositorio`) y "El Artículo de la Semana" (`#tab-semana`) siguen en el DOM (con `aria-hidden="true"`, `tabindex="-1"` y la clase `.tab-btn--hidden` que las oculta visualmente) porque más de 10 sitios en `main.js` navegan a ellas vía `document.querySelector('[data-tab="semana|repositorio"]')?.click()` (deep-linking, links del footer, redirecciones tras quizzes, las dos tarjetas del sidebar izquierdo). El contenedor `.tab-bar` lleva la clase `.tab-bar--single` cuando solo queda un botón visible: pierde el fondo/borde de selector y el `.tab-pill` deslizante, y pasa a verse como una etiqueta simple, no como una pestaña "seleccionable entre varias".

### Sidebar derecho — Vista previa de efectos
Desde julio 2026 ya no es un acordeón: es una tarjeta fija (`.efectos-preview-card`) con 3 efectos de muestra (`#efectos-list`) y un botón "Ver más" (`#efectos-ver-mas-btn`) que abre el modal de pantalla completa con los 18 efectos (`#efectos-lista-modal`, ya existente). Los otros 15 efectos que no se muestran en la tarjeta viven ocultos en `#efectos-list-full` (`hidden`), solo como fuente de datos para ese modal — `buildListaModal()` en `main.js` clona tarjetas de ambos contenedores.

### Bloque superior a igual altura (`.hero-balanced`)
En la vista de inicio de "Por Intereses" (sin categoría elegida), `.dashboard-layout` recibe la clase `hero-balanced` vía `_syncHeroBalance()` en `main.js` (expuesta como `window._LI_syncHeroBalance`, se llama tras cambiar de pestaña y al final de `showCards()`). Con esa clase, en ≥1101px, `align-items` pasa a `stretch`, pero solo la columna **derecha** lo aprovecha: `.sidebar-right` se estira y la tarjeta de efectos empuja su botón "Ver más" abajo con `margin-top:auto`, terminando justo donde termina la izquierda (queda contenido dentro de una tarjeta con borde, no se ve como hueco). El **centro** hace lo contrario a propósito: `.dashboard-center` lleva `align-self:start` para NO estirarse, y la cuadrícula de temáticas (`.cat-selector`) mantiene `row-gap`/`column-gap` fijos sin `align-content`/`justify-content`/`grid-template-rows` en fracciones — o sea, alto natural y compacto, igual que la izquierda. Como consecuencia, el centro normalmente queda algo más corto que los laterales (hueco moderado debajo, sin filas separadas artificialmente): es la solución pedida tras probar que repartir las filas para llenar toda la altura (`space-between`/`1fr`) separaba demasiado las tarjetas. En cuanto se elige una categoría o se cambia de pestaña, la clase se quita y las tres columnas vuelven a su alto natural (`align-items:start`, comportamiento de siempre).

### Progress tracker (sidebar derecho)
- Artículos leídos, semanales leídos, efectos explorados, quizzes completados, desafíos aceptados
- Persiste en localStorage

### Sistema de temas
6 temas: claro (default), dark-base, naranja, tormenta, cosmos, carmesi. Guardados en localStorage, aplicados vía `data-theme` en `<html>`.

### Compartir contenido
`shareContenido(url, title)` — usa Web Share API nativa si disponible, copia al clipboard si no. Toast: "¡Enlace copiado!" (bottom-right, 2s).

### Propón un Tema — Supabase
Sección al final de la página (`#propuestas`, `.propuestas-section`). Conectada a Supabase REST API.

- **Enviar propuesta:** nombre (opcional) + texto → INSERT en tabla `propuestas`
- **Ver propuestas:** fetch al cargar la página, ordenadas por votos DESC
- **Votar:** genera `voter_uuid` anónimo en localStorage (`li_voter_uuid`), registra en tabla `votos` con constraint unique(propuesta_id, voter_uuid) — evita doble voto por dispositivo
- **Moderar:** borrar filas directamente desde Supabase → Table Editor → tabla `propuestas`

Tablas Supabase:
```sql
propuestas (id uuid PK, nombre text, propuesta text, votos integer, created_at timestamptz)
votos (id uuid PK, propuesta_id uuid FK, voter_uuid text, created_at timestamptz, UNIQUE(propuesta_id, voter_uuid))
```

### Accesibilidad
`trapFocus(modal)` / `releaseFocus()` — focus trap WCAG para modales. Intercepta Tab / Shift+Tab.

### localStorage helpers
`lsSet(key, val)` / `lsGet(key, fallback)` — wrappers con try/catch, fallan silenciosamente en incógnito o cuota llena.

### Sistema de niveles
Widget en navbar (`.nivel-widget`) con barra de progreso animada. Imágenes Nivel00–Nivel3.png. Se colapsa a píldora circular en móvil.

---

## Monetización — recomendaciones de producto (2026-07-10, migrado a Audible 2026-08-21)

Antes de este cambio, los enlaces de afiliado de Amazon (`tag=lainferencia-21`) solo vivían en la home (Botiquín Antisesgos, Mystery unlock, algunos efectos/hitos/artículo semanal). Las 56 páginas de artículo individual —el destino del tráfico SEO— no mostraban ninguno. Se cerró ese hueco así:

- **`js/recomendaciones.js`** — mismo patrón que `js/seo-overrides.js` (objeto plano keyed por `art.id`). Cada entrada tiene `libro: {titulo, autor, sinopsis, amazon}`. Ya no existen bloques `producto` (producto físico): se eliminaron en la migración a Audible porque no tenían equivalente en el nuevo modelo.
- **`buildRecomendacionHTML(id)`** en `generate-pages.js` — genera el bloque `.recomendacion-block`, insertado en `buildPage()` justo después de `aplicacionHTML` y antes del botón "Verificar fuente". Mismo tracking que el resto de módulos de afiliado (`data-umami-event="audible-click"`, `rel="sponsored"`).
- **Cross-link en páginas de categoría** (`buildCategoryPage`) — tira `.cat-libros-teaser` con 2-3 libros del sector del Botiquín equivalente (mapa `CAT_TO_SECTOR`), enlazando a la guía de compra correspondiente.
- **Cierre de Rutas de Aprendizaje** — el bloque `.ruta-finish` (última página de cada ruta) añade `.ruta-finish-libro`: la recomendación del primer artículo de la ruta (evita repetir el libro que ya se muestra en esa misma página).
- **Guías de compra nuevas** — `/guias/` (landing) + `/guias/<slug>/` por cada uno de los 12 sectores de `BOTIQUIN_DATA` (`buildGuiasLandingPage`, `buildGuiaPage` en `generate-pages.js`). Tabla comparativa de los ~5 libros del sector + artículos relacionados de La Inferencia. `BOTIQUIN_DATA` se extrae de `main.js` con el mismo mecanismo `vm.runInNewContext` que ya se usaba para `LIBRARY_ARTICLES`/`AUTHORS`.
- Todo pasa por datos + plantilla — nunca se edita a mano un `articulos/*/index.html`, porque `generate-pages.js` los sobreescribe en cada deploy (`vercel.json`: `buildCommand: node generate-pages.js`).

Fuera de alcance por ahora: el contenido "Fuera de Bata" (`bata-*`) no genera páginas estáticas propias, solo vive en la SPA — se puede rellenar con el mismo patrón de `libroRelacionado` que ya usan `EFECTOS_DATA`/`HITOS` si se quiere más adelante.

### Migración a Audible (2026-08-21)

Se sustituyó por completo el modelo de afiliados de Amazon (comisión por venta de libro) por el programa de afiliados de la prueba gratuita de Audible (comisión fija ~10€ por alta, sin coste para el usuario). Cambios clave:

- **`AUDIBLE_LINK`** — constante con el link de afiliado (`amazon.es/hz/audible/mlp/mdp/discovery?actionCode=...&tag=lainferencia-21`, es un link genérico de prueba, no apunta a la ficha de un libro concreto). Se declara **una sola vez**, en `js/recomendaciones.js` (necesario porque ese archivo también se `require()`a desde Node en `generate-pages.js`). `js/main.js` la reutiliza como global del navegador — **no la redeclara**, porque en `index.html` ambos scripts comparten el mismo scope global y un `const` duplicado rompe la página entera (`Identifier 'AUDIBLE_LINK' has already been declared`). `generate-pages.js` extrae esa misma declaración por regex desde `recomendaciones.js` para poder evaluar en sandbox (`vm.runInNewContext`) los fragmentos de `main.js` que también usan `AUDIBLE_LINK` (`WEEKLY_ARTICLES`, `BOTIQUIN_DATA`, `MYSTERY_LIBROS`).
- **Se eliminó toda la ocultación de título de libro** que existía para forzar el clic a Amazon (candado sobre la portada en las tarjetas flip del Botiquín, sinopsis sin título en la recompensa-misterio del quiz, chip "🔒 Libro oculto dentro" en el timeline). Con un link genérico de Audible, ocultar el título ya no tenía sentido (el clic no "revela" nada). Ahora título y autor se muestran siempre (portada sin implementar, no hay fuente de imagen); el CTA vende directamente el valor ("Consigue este audiolibro gratis").
- **Copy**: CTA principal siempre en clave de valor, nunca "descúbrelo"/"misterio". Bloque `.recomendacion-block` sigue el patrón botón (valor grande) + `.recomendacion-valor` (línea de beneficio: "+miles de audiolibros, 30 días sin coste") + `.recomendacion-disclaimer` (legal, pequeño: "Enlace de afiliado.").
- **Eventos umami**: `amazon-click` → `audible-click` en todos los módulos.

### Estrategia de venta y objetivo (2026-08-21)

**Objetivo:** maximizar altas en la prueba gratuita de Audible (comisión fija ~10€ por alta, sin coste para el usuario). Cada punto de contacto con un libro recomendado en la web es una oportunidad de conversión hacia `AUDIBLE_LINK`.

**Principio rector:** el lector siempre debe percibir regalo/valor, nunca publicidad.

- **CTA siempre en clave de regalo, nunca de curiosidad.** Texto fijo: "Consigue este audiolibro gratis" (sin variantes tipo "Descúbrelo" o "Ver más" que generan gancho de misterio en vez de valor directo).
- **Sin ocultar nada.** Título, autor, sinopsis y valoración se muestran siempre antes del clic — el usuario decide con toda la información, no "abre una caja sorpresa". (Ver arriba: eliminación de mecánicas de ocultación de julio-agosto 2026.)
- **Refuerzo de valor explícito junto al botón.** Línea `.recomendacion-valor` / `.mystery-unlock-valor`: "Además, tienes acceso a miles de audiolibros más durante 30 días, sin coste." — vende la prueba gratuita en sí, no solo el libro puntual.
- **Disclaimer legal separado y discreto.** "Enlace de afiliado." va aparte, pequeño, después de la línea de valor — cumple LSSICE/Amazon Associates sin competir visualmente con el mensaje de valor.
- **Botón como elemento dominante.** CTA con color de marca Audible (#FF9900), tamaño y sombra por encima del resto de botones secundarios de la tarjeta/bloque ("¿Qué dice la ciencia?", "Ver otra recomendación") — el ojo va primero al regalo.
- Al evaluar cualquier cambio futuro en estos módulos (nuevo copy, nuevo punto de inserción, rediseño de tarjeta), la pregunta de referencia es: **¿esto se siente a que le estoy regalando algo, o a que le estoy vendiendo algo?** Si se acerca a lo segundo, replantear.

---

## Diseño visual

### Paleta de colores
```css
--navy:       #0B132B   /* base oscura */
--blue:       #2563EB   /* acción principal */
--blue-hover: #1D4ED8
--accent:     #00E5FF   /* cyan — acentos y detalles */
--text-body:  #64748B
--text-muted: #94A3B8
--bg:         #F7F9FF   /* fondo general */
```

### Fondo
Tres `radial-gradient` superpuestos sobre #F7F9FF. Definidos en `#bg-layer` (div `position: fixed; inset: 0; z-index: 0`), no en el body. Esto permite cachear el gradiente como capa GPU fija.

### Efectos
- Glassmorphism eliminado de la mayoría de elementos — `backdrop-filter` solo donde sea imprescindible
- Transiciones: 0.2s (hover rápido), 0.7s (acordeones)
- Sombras: `rgba(37, 99, 235, 0.1–0.15)`
- Animaciones CSS solo con `transform` u `opacity` — nunca con `filter` animado (fuerza rasterización CPU por frame)

### Responsive
Breakpoint principal: **≤680px**. Orden grid móvil: `"center" "right" "left"` (Tu Progreso + Lista Efectos antes que las tarjetas Artículo de la Semana / Fuera de Bata del sidebar izquierdo).

---

## Decisiones técnicas relevantes

| Decisión | Motivo |
|----------|--------|
| Sin frameworks JS | Proyecto ligero, sin build step, máximo control |
| localStorage para progreso y tema | Sin autenticación — datos del usuario en su propio dispositivo |
| `lsGet`/`lsSet` con try/catch | Modo incógnito lanza excepciones en algunos browsers |
| Propuestas en Supabase sin auth | Feed compartido sin pedirles cuenta — más confianza |
| Votos por voter_uuid anónimo | Evita doble voto sin registro; aceptable en MVP |
| Acordeón de Efectos solo en móvil | En desktop el espacio lo permite sin colapsar |
| Orden grid `"right"` antes que `"left"` en móvil | Tu Progreso es más relevante que el Test en primer scroll |
| `display: none !important` en hero buttons móvil | Prioridad de espacio — los botones hero no son esenciales en móvil |
| `#bg-layer` separado del `body` | Div `position:fixed` dedicado para los radial-gradient — cacheado como capa GPU independiente |
| Animaciones CSS solo con `transform`/`opacity` | `filter` animado fuerza rasterización software cada frame — eliminado de `logo-breathe`, `brain-pulse` |
| Barra de progreso usa `transform: scaleX()` | Más eficiente que animar `width` — no dispara layout, solo composite |
| `scheduleProgress` con rAF throttle | `updateProgress` solo corre una vez por frame aunque lleguen múltiples eventos scroll |
| Sin `backdrop-filter` en la mayoría de elementos | Cada `backdrop-filter` crea una capa GPU extra que el compositor debe mezclar — eliminado donde no era esencial |

---

## Problema conocido — Favoritos desactivados

`renderFavSection()` en JS busca `#favoritos-section` que no existe en HTML. No lanza error visible pero la feature no funciona. JS preparado, HTML no tiene el nodo — desactivado intencionalmente.

---

## Rendimiento — diagnóstico y fixes (2026-06-09)

**Síntoma:** scroll lagueado en desktop (primera sección) — ~20fps. Móvil fluido. Fondo de página fluido.

**Causa raíz:** Chrome tenía el compositor en modo software (`Compositing: Software only`) para la GPU del equipo de desarrollo. Comprobable en `chrome://gpu`. **Fix del usuario:** activar `chrome://flags/#ignore-gpu-blocklist` → "Override software rendering list" → Enabled → Relaunch.

**Optimizaciones CSS aplicadas** (benefician a todos los usuarios independientemente del compositor):
- `backdrop-filter` eliminado de `.nivel-widget`, `.hero-bubble-disk` y la mayoría de elementos
- Animaciones CSS solo con `transform`/`opacity` — quitado `filter` animado de `logo-breathe`, `logo-breathe-dark`, `brain-pulse`
- `#bg-layer` como div `position:fixed` dedicado para los gradientes de fondo
- Barra de progreso usa `transform: scaleX()` en vez de `width`
- `scheduleProgress` throttlea `updateProgress` via rAF
- Sombras de cards simplificadas (menos capas, menos blur)

---

*Última actualización: 2026-06-25 — acceso anticipado eliminado, web pública*
