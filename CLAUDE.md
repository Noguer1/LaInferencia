# CLAUDE.md

## Qué hace el proyecto

**La Inferencia** — web de divulgación de psicología basada en evidencia. Convierte investigación académica (artículos peer-reviewed) en contenido accesible, claro y en español. Fundador: Miguel Noguer Escudero.

Sin frameworks — HTML/CSS/JS puro. URL: https://lainferencia.club

**Audiencia:** Público general con curiosidad por la psicología — entretenimiento e interés personal, no académico. También accesible para estudiantes. Tono ligero y enganchante.

**Stack:** GitHub (github.com/Noguer1/LaInferencia) + Vercel (deploy automático en cada git push) + **Supabase** (backend activo — propuestas de comunidad y votos; sin autenticación de usuarios).

**Redes:** Solo LinkedIn — cuenta de empresa La Inferencia.
- Automatizar posts en la página de empresa con la API de LinkedIn
- Generar mensajes personalizados con Claude para perfiles seleccionados entre los ~2.000 contactos (filtrados por sector/cargo/contexto), enviados manualmente desde el navegador
- Objetivo: captar participantes para "Fuera de Bata" y promover la web a través de su red

---

## Estado actual *(2026-06-09)*

- **Fase:** MVP publicado y en producción.
- **URL:** https://lainferencia.club
- **GitHub:** github.com/Noguer1/LaInferencia — rama `main`, deploy automático vía Vercel
- **Supabase:** dbyoxssdbboxnbecgpbf.supabase.co — tablas `propuestas` y `votos` activas
- **Dominio:** `lainferencia.club` activo en Vercel y Spaceship. SSL automático.
- **Email:** `contacto@lainferencia.club` reenvía a `noguermiguel@gmail.com` (Spaceship Email Forwarding). Solo recepción — enviar desde ese email requiere Google Workspace (de pago).
- **Analytics:** Bloque GA4 comentado en `index.html` — activar cuando se quiera.
- **OG image:** `img/OG.png` existe. Si se regenera, usar `archive/og-image-generator.html`.
- **Glosario:** Modal funcional. Array `GLOSARIO` en `main.js`. Completamente funcional.
- **Propuestas:** Conectadas a Supabase. Feed compartido. Votos anónimos por dispositivo (`li_voter_uuid` en localStorage). Moderación desde Supabase Table Editor.
- **Sección Favoritos:** `renderFavSection()` busca `#favoritos-section` que no existe — desactivada intencionalmente.

---

## Decisiones importantes tomadas

| Decisión | Motivo |
|----------|--------|
| Sin frameworks JS | Sin build step, máximo control, proyecto ligero |
| localStorage para progreso y tema | Sin autenticación — datos del usuario en su propio dispositivo |
| `lsSet`/`lsGet` con try/catch | Modo incógnito lanza excepciones en algunos browsers |
| Acordeón de Efectos solo en ≤680px | Desktop tiene espacio; colapsar allí no aporta |
| Orden grid móvil `"center" "right" "left"` | Tu Progreso + Lista Efectos más útiles que Test + Mitos en primer scroll |
| Hero buttons ocultos en móvil | Espacio limitado; los botones hero no son esenciales en móvil |
| Favoritos desactivados en HTML | Funcionalidad no lista — JS preparado pero HTML no tiene el nodo |
| Propuestas en Supabase sin auth | Feed compartido entre usuarios sin pedirles cuenta — más confianza |
| Votos por `voter_uuid` anónimo | Evita doble voto sin registro; si borran cookies pueden votar de nuevo (aceptable en MVP) |

---

## Problemas conocidos

- `renderFavSection()` busca `#favoritos-section` que no existe — no lanza error visible pero la feature no funciona

---

## Próximas prioridades

1. Activar Google Analytics 4 — desbloquear bloque comentado en `index.html` y sustituir `G-XXXXXXXXXX`
2. LinkedIn — automatizar posts en página de empresa y mensajes personalizados a contactos

---

## Estructura de carpetas

```
CarpetaClaude/
├── index.html              # Página única (SPA sin router)
├── css/
│   └── styles.css          # Todo el CSS — variables, componentes, temas, responsive
├── js/
│   └── main.js             # Lógica principal: tabs, acordeones, progress tracker, temas
├── img/                    # Logos, avatares de autores (cara*.png), iconos, favicons
├── pdfs/                   # Documentos de referencia (3 PDFs)
├── docs/
│   └── proyecto.md         # Documentación técnica completa
├── archive/                # Archivos no activos — main.js.bak, contenido_nuevo.js,
│                           # og-image-generator.html, og-image.svg, install.ps1, skills-lock.json
└── robots.txt / sitemap.xml
```

---

## Estilo visual

- **Paleta:** Navy (#0B132B), Azul acción (#2563EB / hover #1D4ED8), Cyan acento (#00E5FF)
- **Fondo:** #F7F9FF con 3 radial-gradients sutiles (cyan, violeta, azul)
- **Tipografía:** Plus Jakarta Sans (300–800), fallback -apple-system
- **Efectos:** Glassmorphism (backdrop-filter blur), transiciones 0.2–0.7s, sombras con azul semitransparente
- **Temas:** claro (default), dark-base, naranja, tormenta, cosmos, carmesi — vía `data-theme` + localStorage
- **Responsive:** mobile-first, breakpoint principal ≤680px
- **Estética:** científica, moderna, minimalista — nunca recargada ni agresiva

---

## Cosas que nunca deben romperse

1. **Tabs principales** — "Por Intereses", "Fuera de Bata", "El Artículo de la Semana" en ese orden
2. **Persistencia de tema** — el tema elegido sobrevive recarga (localStorage)
3. **Acordeones en móvil** — Lista de Efectos (≤680px) y Radar de Mitos colapsan/expanden bien
4. **Progress tracker** — "Mitos desmentidos" y "Pruebas realizadas" incrementan y persisten
5. **Compartir contenido** — `shareContenido()` con fallback a clipboard nunca lanza errores visibles
6. **localStorage wrappers** — `lsSet`/`lsGet` fallan silenciosamente (incógnito, cuota llena)
7. **Focus trap en modales** — `trapFocus()` / `releaseFocus()` necesarios para accesibilidad WCAG
8. **Orden móvil del grid** — `"center" "right" "left"` (Tu Progreso + Lista Efectos antes que Test + Mitos)
9. **SEO metadata** — title, description, OG tags, JSON-LD coherentes
10. **Sin dependencias JS externas** — solo Google Fonts permitido

---

## Cómo prefiero trabajar

- Preguntar si hay duda sobre alcance antes de tocar código
- Cambios pequeños y quirúrgicos — no refactorizar lo que no está roto
- No añadir comentarios innecesarios al código
- Actualizar `docs/proyecto.md` cuando haya cambios importantes en funcionalidades o estructura
- Sin frameworks nuevos salvo decisión explícita
- Confirmar antes de cualquier acción destructiva o irreversible
