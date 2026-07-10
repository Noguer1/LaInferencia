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
Botones de categoría que filtran `LIBRARY_ARTICLES`. La sección "Tus Favoritos" existe en JS (`renderFavSection()` busca `#favoritos-section`) pero está desactivada en HTML.

### Sidebar izquierdo — Radar de Mitos
Acordeón colapsable. Toggle: `#mitos-toggle-btn`, contenido: `#mitos-cards-wrap.accordion-content`.

### Sidebar izquierdo — ¿Cuánto te manipula tu cerebro?
Sección colapsable (`exp-sidebar-btn`). Estilo: gradiente + borde izquierdo azul.

### Sidebar derecho — Lista de Efectos
Acordeón solo en móvil (≤680px). En desktop: header fijo `.efectos-widget-header-desktop`. Toggle: `#efectos-toggle-btn`, contenido: `#efectos-content-wrap`.

### Progress tracker (sidebar derecho)
- **Mitos desmentidos** — barra `#pt-mitos-bar` / contador `#pt-mitos-count`
- **Pruebas realizadas** — barra `#pt-pruebas-bar` / contador `#pt-pruebas-count` (0/8)
- Cada respuesta en el test cognitivo llama `window._LI_incrementPrueba()`
- Persiste en localStorage

### Test cognitivo (hero)
Botón "Test cognitivo" en sección hero. Oculto en móvil (`display: none !important` en ≤680px). Llama `_LI_incrementPrueba()` al responder.

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

## Monetización — recomendaciones de producto (2026-07-10)

Antes de este cambio, los enlaces de afiliado de Amazon (`tag=lainferencia-21`) solo vivían en la home (Botiquín Antisesgos, Mystery unlock, algunos efectos/hitos/artículo semanal). Las 56 páginas de artículo individual —el destino del tráfico SEO— no mostraban ninguno. Se cerró ese hueco así:

- **`js/recomendaciones.js`** — mismo patrón que `js/seo-overrides.js` (objeto plano keyed por `art.id`). Cada entrada tiene `libro: {titulo, autor, sinopsis, amazon}` y, en ~7 artículos donde es genuinamente coherente, un `producto` físico opcional (mismo formato). Enlaces siempre `amazon.es/s?k=Título+Autor&tag=lainferencia-21` (búsqueda) o el `/dp/` ya vetado en `BOTIQUIN_DATA` cuando se reutiliza el mismo libro — nunca ASIN inventado.
- **`buildRecomendacionHTML(id)`** en `generate-pages.js` — genera el bloque `.recomendacion-block`, insertado en `buildPage()` justo después de `aplicacionHTML` y antes del botón "Verificar fuente". Mismo tracking que el resto de módulos de afiliado (`data-umami-event="amazon-click"`, `rel="sponsored"`).
- **Cross-link en páginas de categoría** (`buildCategoryPage`) — tira `.cat-libros-teaser` con 2-3 libros del sector del Botiquín equivalente (mapa `CAT_TO_SECTOR`), enlazando a la guía de compra correspondiente.
- **Cierre de Rutas de Aprendizaje** — el bloque `.ruta-finish` (última página de cada ruta) añade `.ruta-finish-libro`: la recomendación del primer artículo de la ruta (evita repetir el libro que ya se muestra en esa misma página).
- **Guías de compra nuevas** — `/guias/` (landing) + `/guias/<slug>/` por cada uno de los 12 sectores de `BOTIQUIN_DATA` (`buildGuiasLandingPage`, `buildGuiaPage` en `generate-pages.js`). Tabla comparativa de los ~5 libros del sector + artículos relacionados de La Inferencia. `BOTIQUIN_DATA` se extrae de `main.js` con el mismo mecanismo `vm.runInNewContext` que ya se usaba para `LIBRARY_ARTICLES`/`AUTHORS`.
- Todo pasa por datos + plantilla — nunca se edita a mano un `articulos/*/index.html`, porque `generate-pages.js` los sobreescribe en cada deploy (`vercel.json`: `buildCommand: node generate-pages.js`).

Fuera de alcance por ahora: el contenido "Fuera de Bata" (`bata-*`) no genera páginas estáticas propias, solo vive en la SPA — se puede rellenar con el mismo patrón de `libroRelacionado` que ya usan `EFECTOS_DATA`/`HITOS` si se quiere más adelante.

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
Breakpoint principal: **≤680px**. Orden grid móvil: `"center" "right" "left"` (Tu Progreso + Lista Efectos antes que Test + Mitos).

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
