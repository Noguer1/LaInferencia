# La Inferencia — Documentación Técnica

> Actualizar este archivo cuando haya cambios importantes en funcionalidades o estructura.

---

## Descripción

Web de divulgación de psicología basada en evidencia. Convierte investigación académica (artículos peer-reviewed) en contenido accesible, claro y en español.

- **Fundador:** Miguel Noguer Escudero
- **Tagline:** "Convertimos investigación en conocimiento útil, claro y accesible"
- **Idioma:** Español (es_ES)
- **Estado:** En desarrollo — URL pendiente (placeholder: TU-DOMINIO.com)
- **Audiencia:** Público general con curiosidad por la psicología. Entretenimiento e interés personal, no académico. Accesible también para estudiantes de psicología.
- **Redes:** Solo LinkedIn (cuenta de empresa La Inferencia)
  - Automatizar posts en la página de empresa via LinkedIn API
  - Generar mensajes personalizados con Claude para perfiles seleccionados (~30-50 contactos filtrados por sector/cargo), enviados manualmente
  - Objetivo: reclutar participantes para "Fuera de Bata" y crecimiento orgánico vía red de contactos
- **Stack previsto:** Hosting propio + GitHub (deploy vía git push) + Supabase (backend futuro)

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Markup | HTML5 semántico |
| Estilos | CSS3 puro — custom properties, grid, flexbox, backdrop-filter |
| Lógica | JavaScript vanilla (ES6+) |
| Tipografía | Google Fonts — Plus Jakarta Sans (300–800) |
| SEO | JSON-LD schema, Open Graph, robots.txt, sitemap.xml |
| Persistencia | localStorage ahora → Supabase en el futuro |
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
- `main.js.bak` — versión anterior de main.js (592 líneas menos que la actual)
- `contenido_nuevo.js` — contenido ya integrado en main.js (redundante)
- `og-image-generator.html` — herramienta para generar `img/og-image.png` cuando sea necesario
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

### Accesibilidad
`trapFocus(modal)` / `releaseFocus()` — focus trap WCAG para modales. Intercepta Tab / Shift+Tab.

### localStorage helpers
`lsSet(key, val)` / `lsGet(key, fallback)` — wrappers con try/catch, fallan silenciosamente en incógnito o cuota llena.

### Sistema de niveles
Widget en navbar (`.nivel-widget`) con barra de progreso animada. Imágenes Nivel00–Nivel3.png. Se colapsa a píldora circular en móvil.

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
Tres `radial-gradient` superpuestos sobre #F7F9FF:
- Cyan (5% opacidad) — esquina top-left
- Violeta (3%) — esquina bottom-right
- Azul (4%) — centro-bottom

### Efectos
- Glassmorphism: `backdrop-filter: blur(8px)`
- Transiciones: 0.2s (hover rápido), 0.7s (acordeones)
- Sombras: `rgba(37, 99, 235, 0.1–0.15)`

### Responsive
Breakpoint principal: **≤680px**. Orden grid móvil: `"center" "right" "left"` (Tu Progreso + Lista Efectos antes que Test + Mitos).

---

## Decisiones técnicas relevantes

| Decisión | Motivo |
|----------|--------|
| Sin frameworks JS | Proyecto ligero, sin build step, máximo control |
| localStorage sin backend | MVP — sin servidor ni autenticación |
| `lsGet`/`lsSet` con try/catch | Modo incógnito lanza excepciones en algunos browsers |
| Acordeón de Efectos solo en móvil | En desktop el espacio lo permite sin colapsar |
| Orden grid `"right"` antes que `"left"` en móvil | Tu Progreso es más relevante que el Test en primer scroll |
| `display: none !important` en hero buttons móvil | Prioridad de espacio — los botones hero no son esenciales en móvil |

---

## Problema conocido — OG image rota

`og:image` en `index.html` apunta a `img/og-image.png` que **no existe**. Al compartir la web en WhatsApp, X, Facebook o LinkedIn no se muestra ninguna imagen previa.

Para arreglarlo: abrir `archive/og-image-generator.html` en el navegador → capturar el canvas como PNG → guardar como `img/og-image.png`.

---

*Última actualización: 2026-06-08 — limpieza de archivos, carpeta archive/ creada*
