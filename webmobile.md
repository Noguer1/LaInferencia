# webmobile.md

Investigación a fondo sobre cómo montar la web de **La Inferencia** en móvil: estructura, navegación, estética, comodidad y formato app. Documento de trabajo interno. Sin guion largo en todo el texto (norma del proyecto).

---

## 1. Por qué existe este documento

Se ha rediseñado **Fuera de Bata**: antes vivía dentro del home (`index.html`, sección `#panel-repositorio`) y ahora es una página aparte en `/fuera-de-bata/`.

- **Escritorio:** funciona bien. Desde el home ves el resumen, pulsas y te lleva a la página completa.
- **Móvil:** roto conceptualmente. La barra inferior (`#mobile-bottom-nav`) se construyó asumiendo que **todo era el home**: 5 pestañas (`descubrir`, `fuerabata`, `casa`, `botiquin`, `yo`) que solo cambian clases `mp-*` en el `body` y enseñan u ocultan trozos del mismo `index.html`. La pestaña `fuerabata` ahora abre una vista in-app obsoleta en vez de la página real. El comentario en `js/main.js` ya lo admite: `Móvil (pendiente de rediseño)`.

El encargo: investigar 4 veces, cada vuelta desde cero revisando lo anterior y ampliando, y al final proponer qué hacer.

---

## 2. Método

Cuatro iteraciones. Cada una parte de lo aprendido en la anterior, vuelve a las fuentes, busca en sitios nuevos y añade capa:

1. **Iteración 1:** fundamentos de navegación móvil (patrones, guías oficiales, evidencia de usabilidad).
2. **Iteración 2:** webs de lectura y contenido + formato app real (PWA, app shell, instalable).
3. **Iteración 3:** ergonomía, tipografía de lectura, rendimiento, accesibilidad, áreas seguras.
4. **Iteración 4:** arquitectura (SPA vs MPA), transiciones, estado por pestaña, onboarding, gestos, tendencias 2026.

Luego: síntesis consolidada, diagnóstico de La Inferencia y propuesta.

---

## 3. Iteración 1: fundamentos de navegación móvil

### 3.1 Barra inferior de pestañas (bottom tab bar)

Es el patrón por defecto para la mayoría de apps y de webs con formato app. Motivos:

- Cae dentro del **alcance del pulgar** en la parte baja de la pantalla, mucho más ergonómico que cualquier cosa arriba.
- La navegación principal está **siempre visible**: el usuario ve de un vistazo qué secciones existen y en cuál está.
- Objetivos táctiles grandes, más tolerantes que iconos pequeños.
- Lo recomiendan tanto Apple como Google en sus guías.

**Cuántas pestañas:**

- Material Design 3: entre **3 y 5** destinos de nivel superior, todos de importancia parecida. Menos de 3, usa otra cosa (tabs de contenido). Más de 5, los objetivos táctiles quedan demasiado juntos.
- Apple HIG: **3 a 5** en iOS. Usar el mínimo necesario. Cada pestaña extra añade complejidad y dificulta encontrar las cosas.
- Evitar la pestaña "Más" (overflow): esconde contenido y lo vuelve difícil de descubrir.
- Las pestañas se mantienen visibles aunque su contenido no esté disponible. El set es **estable**: no cambia de una pantalla a otra.

### 3.2 Menú hamburguesa y navegación oculta

Evidencia de Nielsen Norman Group (estudio con 179 participantes, 6 sitios, móvil y escritorio):

- Esconder la navegación principal **reduce casi a la mitad** la "descubribilidad" del contenido.
- Sube el tiempo de tarea y la dificultad percibida.
- Baja la interacción con el contenido, el éxito de tarea y la satisfacción.
- En móvil, la navegación oculta se usa en el **57%** de los casos; una navegación combinada (algo visible + resto en menú) sube al **86%**.
- Aunque casi todo el mundo ya reconoce el icono, sigue añadiendo coste de interacción: un paso extra siempre.

**Conclusión:** la hamburguesa vale para lo secundario (ajustes, "quiénes somos", contacto, temas, aviso legal), nunca para las secciones principales.

### 3.3 Priority+ (prioridad plus)

Para sitios con muchas secciones: enseñar las más importantes y esconder el resto tras un "más". Sirve como complemento, no como navegación primaria.

### 3.4 Regla que sale de la iteración 1

Barra inferior con 3 a 5 destinos estables y de primer nivel. Todo lo demás (secundario) a un menú accesible desde una cabecera ligera o desde la pestaña de perfil.

---

## 4. Iteración 2: webs de lectura y contenido + formato app

### 4.1 Arquitectura de la información en sitios de contenido

- La estructura y el etiquetado del contenido son la base de una navegación usable. Agrupar en **categorías claras**.
- Los sitios editoriales que funcionan en móvil usan **scroll vertical con cortes de sección claros** y jerarquía visual fuerte.
- El "índice" o portada de contenido en móvil necesita jerarquía vertical y elementos grandes para el dedo.
- Revelar el contenido de forma progresiva mientras se hace scroll ayuda a marcar el ritmo de lectura.

### 4.2 Patrones de apps de noticias y lectura (Medium, Pocket, apps de prensa)

- Guardar artículos y poder leerlos **sin conexión**.
- Quejas recurrentes de usuarios: cuerpo de texto pequeño y titulares desproporcionadamente grandes. La lectura manda.
- Jerarquía clara y concisa, pensada para pantalla pequeña.
- Patrón "continuar leyendo" / progreso de lectura para volver donde lo dejaste.

### 4.3 Formato app de verdad: PWA

"La forma de uso en móvil" implica que la web debe **comportarse como app**. Eso es una PWA bien montada:

- **`manifest.json`** con: iconos en varios tamaños, `display: standalone` (aspecto de app nativa, sin barra del navegador, conservando la UI del sistema), `start_url`, `scope`, `theme_color`, `background_color`.
- `standalone` es el modo recomendado para la mayoría de casos: equilibra inmersión y usabilidad. `fullscreen` solo Android y suele ser excesivo para lectura.
- **Instalación a medida:** capturar `beforeinstallprompt` y ofrecer un botón propio de "Añadir a pantalla de inicio" en el momento oportuno (no nada más entrar).
- **Service worker** con Cache API para: carga instantánea del armazón, lectura offline de artículos ya visitados, y resistencia a conexiones malas.
- Integración con el sistema operativo: accesos directos (`shortcuts` en el manifest), compartir entre apps, badging.

### 4.4 App shell (armazón de aplicación)

- El armazón es la UI mínima y estática: cabecera, **barra de navegación**, esqueletos de carga. El service worker lo precachea y se pinta al instante.
- Elementos persistentes (cabecera, barra inferior, pie) **consistentes en todas las páginas o vistas**.
- **Importante:** el patrón app shell no obliga a SPA. Se puede implementar sobre un sitio multipágina tradicional (MPA). La barra inferior puede ser persistente en un MPA.

### 4.5 Datos de negocio (por qué merece la pena)

- **Twitter Lite (PWA):** +65% páginas por sesión, +75% tuits enviados, -20% rebote. Ocupa el 3% del espacio de la app nativa.
- **Forbes (PWA):** +50% sesiones completadas, x3 profundidad de scroll, +43% sesiones, +100% engagement.

Publishers de lectura son justo el caso de uso donde la PWA rinde.

### 4.6 Regla que sale de la iteración 2

Barra inferior persistente vía app shell, funcione la web como SPA o como MPA. Encima, PWA instalable con lectura offline. La lectura del artículo es la pantalla más importante y su tipografía es sagrada.

---

## 5. Iteración 3: ergonomía, tipografía, rendimiento, accesibilidad

### 5.1 Zona del pulgar y objetivos táctiles

- **Objetivo táctil mínimo:** 44x44 px (WCAG 2.1) o 48x48 dp (Material). Cómodo real: ~48 px con 8 px de separación. El icono puede seguir siendo de 24 px si amplías el área pulsable con padding hasta 48.
- **Zona verde** (fácil con el pulgar): tercio inferior de la pantalla. **Zona roja**: esquinas superiores.
- En móviles de más de 6,5 pulgadas hay que meter lo crítico en los **dos tercios inferiores**.
- Empezar por las pantallas más usadas (inicio, buscador, artículo) y aplicar áreas de 48 a 56 px con 8 a 12 px de separación.

### 5.2 Tipografía de lectura larga

- **Cuerpo de texto:** mínimo 16 px en móvil. 17 a 18 px suele mejorar la lectura larga sin coste. 18 a 20 px sigue siendo válido.
- **Interlineado:** 1,5 de base; 1,6 a 1,7 para artículos largos.
- **Longitud de línea:** 30 a 50 caracteres por línea en móvil vertical (en escritorio 50 a 75). `max-width` en `ch` como punto de partida.
- Fuentes de sistema cargan al instante y están optimizadas para pantalla. La Inferencia usa Plus Jakarta Sans con fallback `-apple-system`, que es razonable; vigilar peso y `font-display: swap`.
- `clamp()` para escalar el tamaño con el viewport sin saltos.
- Probar en móvil real, sostenido con el brazo estirado. Los emuladores mienten sobre la lectura.

### 5.3 Áreas seguras (notch, home indicator, esquinas)

- `<meta name="viewport" content="viewport-fit=cover">` para activar el manejo de áreas seguras.
- Variables: `env(safe-area-inset-top | right | bottom | left)`.
- Barra inferior: `padding-bottom: max(12px, env(safe-area-inset-bottom))`. El home indicator del iPhone son ~34 px; sin esto, la fila de pestañas queda parcialmente intapable.
- Cabecera fija: contemplar `safe-area-inset-top`.

### 5.4 Accesibilidad de la barra inferior

- **Orden de foco (WCAG 2.4.3):** el lector de pantalla sigue el orden del DOM, no el visual. Si el CSS reordena (`order`, `flex-direction`), el DOM debe seguir teniendo un orden lógico. La Inferencia ya reordena el grid móvil con `order`; hay que auditar que el orden de tabulación siga teniendo sentido.
- `role="navigation"` + `aria-label` en la barra (ya está).
- Estado activo comunicado por texto/aria, no solo por color.
- Cualquier gesto necesita **alternativa visible** con botón. Nunca una acción solo por swipe.
- Respetar `prefers-reduced-motion` en todas las transiciones de página (el proyecto ya tiene el media query).

### 5.5 Rendimiento (encaja con la obsesión del proyecto)

CLAUDE.md ya prohíbe `backdrop-filter` extra, anima solo `transform`/`opacity`, usa `#bg-layer` fijo y `scaleX()` para la barra de progreso. En móvil, además:

- La barra inferior y el armazón, en su propia capa de composición estable, sin repintados por scroll.
- Transiciones de página con `transform`/`opacity`, nunca `width`/`height`/`filter`.
- Imágenes con `loading="lazy"`, `width`/`height` explícitos para no provocar CLS.
- Presupuesto de JS de arranque bajo: el armazón debe pintarse sin esperar al bundle grande.

### 5.6 Regla que sale de la iteración 3

Pulgar primero (todo lo accionable en el tercio inferior, 48 px mínimo), lectura primero (16 a 18 px, interlineado 1,6, línea corta), áreas seguras siempre, foco y movimiento accesibles, y cero coste GPU nuevo.

---

## 6. Iteración 4: arquitectura, transiciones, estado, onboarding, gestos

### 6.1 SPA vs MPA para este caso

- **MPA:** primera carga más rápida (payload menor por página), pero cada navegación recarga HTML/CSS/JS entero. Mejor SEO por defecto y más simple.
- **SPA:** primera carga más lenta (mucho JS), pero navegación posterior fluida sin recargas, sensación de app.
- La Inferencia hoy es **híbrida sin quererlo**: `index.html` es una SPA sin router (pestañas por clases `body`), y los artículos, rutas, guías y ahora Fuera de Bata son páginas estáticas independientes (MPA). Sin frameworks, por decisión de proyecto.
- El punto medio moderno para un sitio así: **MPA + View Transitions + app shell compartido**. Se queda la simplicidad y el SEO de las páginas estáticas y se gana la sensación de app.

### 6.2 View Transitions API entre documentos

- El `@view-transition { navigation: auto; }` en CSS activa transiciones animadas **entre páginas distintas del mismo origen**, sin JavaScript ni framework.
- Soporte: Chrome/Edge 126+, Safari 18.2+. Firefox aún no. Degrada de forma limpia (navegación normal sin animar).
- Enmascara el tiempo de carga y hace entender la relación entre vistas (por ejemplo, tarjeta de artículo que se expande al artículo).
- Encaja perfecto con la restricción de "sin frameworks": es plataforma web pura.

### 6.3 Estado e historial por pestaña

- Cada pestaña debería mantener su **propia pila de navegación** e historial.
- Cambiar de pestaña o cerrar y reabrir la app **conserva el estado** de todas: vista actual y scroll.
- El botón atrás debería moverse dentro de la pestaña actual antes de salir de ella.
- En un MPA esto se aproxima con: restauración de scroll por página (`history.scrollRestoration`), recordar en `sessionStorage` la última URL de cada sección, y que al pulsar una pestaña ya activa se haga scroll al inicio (patrón iOS).

### 6.4 Onboarding en móvil

- El único trabajo del onboarding: llevar al usuario al **primer valor** cuanto antes. El ~77% abandona una app en 3 días.
- **Siempre "saltar".** Preferir pistas contextuales a un tour estático.
- Valor primero, explicación después. Llegar al momento "ajá" en los primeros 60 segundos.
- 3 a 5 pantallas como mucho, o menos de 60 segundos.
- Personalización ligera al inicio (elegir intereses) sube activación y retención. La Inferencia ya tiene "Por Intereses" y un paso de intereses (`.ob-interests`): ese es el gancho.

### 6.5 Gestos, bottom sheets y FAB (2026)

- **Gestos:** reducen desorden pero son invisibles. Si el usuario no sabe que existen, no existen. Siempre con affordance visible y alternativa por botón. Acompañar de feedback háptico donde se pueda.
- **Bottom sheet:** patrón esperado en 2026 para todo lo que no merece pantalla completa: filtros, ajustes, compartir, previsualizaciones, confirmaciones. Sustituto natural de muchos modales centrados.
- **FAB:** un solo botón circular flotante para **la acción más importante** de la pantalla. Con moderación. En La Inferencia el centro de la barra actúa como "Inicio" (patrón tipo Instagram), aceptable, aunque un FAB normalmente es acción y no destino.
- **Divulgación progresiva:** empezar con botones visibles y luego introducir atajos por gesto según el usuario demuestra soltura.

### 6.6 Regla que sale de la iteración 4

MPA de páginas estáticas + View Transitions entre documentos + app shell con barra inferior persistente. Estado y scroll recordados por sección. Onboarding mínimo, saltable, anclado en elegir intereses. Bottom sheets en vez de modales; gestos solo como extra con botón equivalente.

---

## 7. Síntesis: principios consolidados para La Inferencia

1. **Barra inferior persistente de 4 o 5 destinos estables**, presente en TODAS las páginas (home, Fuera de Bata, artículo, rutas, biblioteca, guías), no solo en el `index.html`.
2. **La hamburguesa solo para lo secundario** (temas, quiénes somos, participar, contacto, glosario, aviso legal). Nunca secciones principales.
3. **App shell**: cabecera ligera + barra inferior como armazón estático, idéntico en cada página, pintado al instante.
4. **PWA instalable**: `manifest.json` en `standalone`, service worker con lectura offline de artículos visitados y carga instantánea del armazón, prompt de instalación diferido.
5. **MPA + View Transitions API entre documentos** para sensación de app sin framework. Degradación limpia donde no haya soporte.
6. **Estado por sección**: recordar scroll y última URL de cada pestaña; re-pulsar pestaña activa hace scroll arriba.
7. **Pulgar primero**: todo lo accionable en el tercio inferior, objetivos de 48 px, separación de 8 px.
8. **Lectura sagrada**: cuerpo 16 a 18 px, interlineado 1,6 a 1,7, línea de 30 a 50 caracteres, sin titulares desproporcionados.
9. **Áreas seguras**: `viewport-fit=cover` + `env(safe-area-inset-*)` en barra inferior y cabecera.
10. **Home móvil distinto del de escritorio**: en móvil, tras el hero (logo + frase, ya existentes) el protagonista es la **rejilla de temas**. El Artículo de la Semana y el resto, más abajo al hacer scroll. Sin "continuar leyendo". No el dashboard rico de escritorio.
11. **Bottom sheets** para filtros, compartir, ajustes de tema, glosario. Menos modales centrados.
12. **Rendimiento**: sin coste GPU nuevo; transiciones solo `transform`/`opacity`; armazón sin repintados por scroll.
13. **Accesibilidad**: orden de DOM lógico aunque el CSS reordene, foco visible, `prefers-reduced-motion`, gestos con alternativa.
14. **Onboarding**: 3 a 5 pasos máximo, saltable, centrado en elegir intereses para personalizar el feed.

---

## 8. Diagnóstico: La Inferencia en móvil hoy

**Lo que ya está bien:**

- Existe barra inferior con curva y FAB central (`#mobile-bottom-nav`), indicador magnético, transiciones de deslizamiento. Estética cuidada.
- Hay sistema de "páginas" móviles (`mp-casa`, `mp-fuerabata`, `mp-descubrir`, `mp-botiquin`, `mp-yo`).
- Hay cabecera de sección móvil (`#mobile-section-header`).
- Hay onboarding con paso de intereses.
- Analytics sin cookies, sin banner.

**Lo que está roto o cojea:**

1. **La barra solo existe dentro de `index.html`.** En `/fuera-de-bata/`, `/articulos/*`, `/rutas/*`, `/biblioteca/`, `/guias/*` no hay barra inferior. El usuario cae en páginas "sueltas" sin forma de volver al armazón salvo el atrás del navegador. Esto rompe la sensación de app por completo.
2. **La pestaña "Fuera de Bata" abre una vista in-app obsoleta**, no la página real `/fuera-de-bata/`. Código ya marcado como pendiente.
3. **Las "páginas" `mp-*` no son páginas.** Son la misma URL con clases distintas. No hay historial real, el atrás no funciona por pestaña, no hay deep link salvo un par de hashes (`#botiquin`, `#timeline`), y el scroll no se restaura por sección.
4. **Cinco destinos con jerarquía confusa.** `Descubrir` vs `Casa` vs `Botiquín` se solapan conceptualmente para el usuario nuevo. `Botiquín` depende de una lógica ("tu problema, tu libro") que cambió cuando se retiró Audible.
5. **No es PWA instalable de verdad** (según CLAUDE.md no hay manifest activo ni service worker; sí Umami).
6. **Home móvil = home de escritorio troceado.** Se enseñan y ocultan bloques del dashboard con `display`, en vez de tener una portada móvil pensada como punto de entrada.

La raíz de todo: el móvil se construyó como "una SPA que es el home", y el proyecto ha evolucionado a "varias páginas". El modelo mental del código y el de la web ya no coinciden.

---

## 9. Propuesta recomendada

### 9.1 Idea central

Dejar de tratar el móvil como "una pantalla que es el home" y tratarlo como **una app con armazón fijo y varias páginas reales dentro**.

Concretamente:

- **Barra inferior como componente de armazón compartido**, incluido en cada plantilla que genera `generate-pages.js` y en `index.html`. Mismo HTML, mismo CSS, misma posición. Se convierte en un partial reutilizable.
- **Cada pestaña apunta a una URL real:**

| Orden | Pestaña | URL | Contenido |
|---|---|---|---|
| 1 | Inicio | `/` | Portada móvil: hero + frase (ya existen) -> temas -> más abajo, artículo de la semana, novedades, Fuera de Bata, propuestas |
| 2 | Explorar | `/#explorar` (o `/biblioteca/`) | Categorías por interés + buscador + biblioteca. El "índice" navegable. Aquí vive también "Botiquín" como sub-pestaña |
| 3 | Fuera de Bata | `/fuera-de-bata/` | La página nueva, tal cual. Prioridad del proyecto (capta gente para El Claustro) |
| 4 | Yo | `/#yo` | Perfil: nivel, XP, recompensa, rutas, guardados, propuestas |

  **Cuatro destinos, sin botón central.** El detalle de disposición, forma y animación está en 9.7.

### 9.2 Navegación entre páginas

- **MPA real**: cada pestaña navega a su URL. Se acaban las clases `mp-*` como sustituto de páginas.
- **View Transitions API entre documentos** (`@view-transition { navigation: auto; }` + `view-transition-name` en la tarjeta y el artículo) para que la navegación se sienta app. Sin framework, plataforma pura. Degrada limpio en Firefox.
- **Restauración de estado**: `history.scrollRestoration = 'manual'` + guardar scroll por URL en `sessionStorage`. Re-pulsar la pestaña activa hace scroll arriba.
- La barra marca la pestaña activa según `location.pathname` / hash, no según una variable de JS.

### 9.3 Formato app (PWA)

- Añadir `manifest.webmanifest`: `name`, `short_name` ("La Inferencia"), `start_url: "/?utm_source=pwa"`, `display: "standalone"`, `theme_color` navy, `background_color` `#F7F9FF`, iconos 192/512/maskable (ya hay favicons en `img/`).
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- **Service worker** mínimo: precache del armazón (CSS, JS core, logo, fuentes) + estrategia stale-while-revalidate para artículos ya visitados (lectura offline). Sin frameworks: `sw.js` a mano, ~60 líneas.
- **Prompt de instalación diferido**: capturar `beforeinstallprompt`, guardarlo, y ofrecer "Añadir a inicio" en la pestaña Yo o tras leer el segundo o tercer artículo, nunca al entrar.
- `shortcuts` en el manifest: "Fuera de Bata", "Artículo de la semana", "Mis rutas".

### 9.4 Home móvil: los temas primero (revisado con la web delante)

Revisión sobre lo que ya hay en `index.html`:

- La web **ya se explica** nada más entrar: bajo `<h1>La Inferencia</h1>` está la frase "La psicología aplicada a tus intereses. Nosotros leemos los estudios, tú te quedas con lo que sirve." ([index.html:260-262](index.html)). No hace falta añadir texto de presentación.
- La home móvil (`mp-casa`) **ya enseña la rejilla de temas pronto**: hero (logo + frase) -> buscador -> `.cat-selector` (Economía, Moda, etc.) -> newsletter -> propuestas -> pie. El Artículo de la Semana vive en una columna lateral que en móvil hoy **no se muestra**.

Conclusión: la portada móvil **no necesita rediseño de contenido**, solo confirmar y afinar el orden. Los temas son el protagonista, no un extra.

Orden recomendado en móvil:

1. **Hero**: logo + "La Inferencia" + la frase que ya existe.
2. **Buscador**.
3. **Temas** (rejilla de categorías): lo primero de peso. Es lo que hace entender la web ("hay artículos de psicología sobre política, derecho, marketing...").
4. Al hacer scroll: **Artículo de la Semana**, **novedades** (últimos artículos), **bloque de Fuera de Bata**, **propuestas** de la comunidad.

Descartado por decisión de proyecto:

- **"Continuar leyendo" NO va.** Obligar a retomar la lectura molesta al que vuelve. Si algún día se prueba, que sea una línea discreta y descartable, nunca un bloque grande arriba.
- **El Artículo de la Semana NO va arriba**, por encima de los temas. Va después, cuando la persona ya ha empezado a bajar.

El dashboard rico (sidebars, widgets) se queda para escritorio.

### 9.5 Secundario a su sitio

Aquí hay que separar dos cosas que no son lo mismo:

- **Dónde está el botón que abre el menú.** Va en la **cabecera, arriba a la derecha** (el icono de tres rayas actual, `#hamburger-btn`). Es lo normal y es lo que ya hay. No se mueve.
- **Qué forma tiene el panel que aparece al pulsarlo.** Hay tres opciones: entra desde la derecha (drawer lateral, lo actual), baja desde la cabecera, o sube desde el borde inferior (bottom sheet). El bottom sheet **no se pisa con la barra de navegación**: cuando se abre, el panel se dibuja por encima de todo (barra incluida), y la barra queda oculta o atenuada mientras está abierto; al cerrar, la barra vuelve. Nunca conviven en el mismo espacio.

Para este proyecto la decisión de forma es **menor**: el menú tiene 5 o 6 enlaces y se abre poco. Cualquiera de las tres vale. Si el botón arriba a la derecha con drawer lateral (lo actual) resulta natural, se deja así. Lo importante, y en eso no hay discusión: **este menú es solo para lo secundario** (Temas, Quiénes somos, Participar, Contacto, Glosario, Simulador de sesgos, Aviso legal). Las secciones de leer artículos van siempre en la barra inferior, nunca aquí.

- El **selector de tema** puede abrirse desde este menú o como panel propio; bottom sheet queda cómodo para el pulgar, pero no es obligatorio.
- El **glosario** ya es modal y funciona; en móvil un bottom sheet se lee mejor, cambio opcional.

### 9.7 Barra inferior: disposición, forma y animación

Investigación específica para pasar de "5 pestañas con montaña central" a "4 pestañas premium sin botón central".

#### 9.7.1 Por qué se quita la montaña central

La curva con muesca (notch) y el botón elevado en el centro existen **para un elemento especial**: normalmente un FAB de acción, o una sección destacada. Con 5 pestañas de igual peso ya era discutible; con **4 pestañas de igual peso no tiene sentido**: no hay nada que merezca ir en un pedestal. Mantener la montaña con 4 tabs repartidos daría una forma arbitraria que "grita" sin motivo.

Además, la barra con muesca + FAB es un patrón muy de 2018-2020. Hoy lo que se lee como moderno y caro es: **barra plana pegada al borde** o **píldora flotante despegada del borde**, siempre con indicador que se desliza.

#### 9.7.2 Disposición de los 4 destinos

- **Reparto:** 4 ranuras iguales al 25% de ancho cada una. Área táctil = 25% de ancho x alto completo de la barra, muy por encima de los 48 px.
- **Orden:** `Inicio | Explorar | Fuera de Bata | Yo`. Inicio a la izquierda (convención: el "home" es el primer tab, no el central).
- **Contenido de cada ranura:** icono de 24 px arriba + etiqueta de 10 a 12 px debajo. Las etiquetas **se quedan** (Material recomienda etiqueta visible con 5 destinos o menos; en una web de contenido las palabras importan: "Explorar", "Yo" no se entienden solo con icono).
- **Icono:** contorno (outline) cuando está inactivo, relleno (filled) cuando está activo. Es el lenguaje estándar de estado.
- **Problema real a resolver:** "Fuera de Bata" es una etiqueta larga para el 25% de ancho en móviles pequeños (360 px). Opciones, por orden de preferencia:
  1. Etiqueta en **dos líneas** centradas ("Fuera de" / "Bata") con tamaño 10 px. Encaja y no se trunca.
  2. Acortar a **"Fuera d. Bata"** no; mejor **"F. de Bata"** tampoco (feo). Descartado.
  3. Etiqueta corta **"Bata"** con el icono de libreta. Reconocible una vez aprendido, arriesgado al principio.
  Recomendación: opción 1 (dos líneas), y que las otras tres etiquetas también admitan dos líneas para que la altura sea uniforme.

(Nota de orden: esta sección 9.7 se lee antes que 9.6 "Qué NO tocar"; el número alto es solo para no renumerar el resto del documento.)

#### 9.7.3 Forma y material

Dos direcciones válidas, ambas premium:

- **A) Barra plana al borde.** `position: fixed; bottom: 0`, ancho completo, filo superior con hairline de 1 px + sombra suave hacia arriba, fondo sólido. `padding-bottom: max(8px, env(safe-area-inset-bottom))`. Clásica, envejece bien, cero riesgo.
- **B) Píldora flotante.** Despegada del borde con margen lateral de 12 a 16 px y `bottom: max(12px, env(safe-area-inset-bottom))`, esquinas muy redondeadas (`border-radius: 28px` o `999px`), sombra ambiental, fondo sólido. Es lo que se lee hoy como "editorial / caro" (iOS 26, componentes premium de Framer/shadcn). Se mantiene en zona del pulgar y se siente intencional.

**Sobre el cristal esmerilado (frosted glass / `backdrop-filter`):** es la estética de moda (iOS 26 "Liquid Glass"), pero:
  1. CLAUDE.md ha eliminado `backdrop-filter` de casi todo por coste de GPU. Una barra fija con blur estático es de los usos más defendibles (no anima), pero el proyecto es estricto.
  2. NN/G ya ha documentado que el Liquid Glass de iOS 26 **perjudica la legibilidad**: controles apretados, área táctil reducida, navegación fragmentada, elementos semitransparentes que tapan el contenido.

  **Recomendación:** fondo **sólido** (o con un tinte de gradiente muy sutil), **sin blur**. Coste GPU casi nulo, cumple la norma del proyecto, y el contraste de iconos y etiquetas está garantizado siempre (mínimo 3:1), también sobre imágenes de artículo. Si más adelante se quiere el efecto cristal, que sea una sola capa estática y medida, nunca animada.

  **Recomendación de forma:** empezar por **B (píldora flotante) con fondo sólido**. Da el salto de "moderno y premium" que se busca sin depender del blur. Si en pruebas molesta el hueco entre la píldora y el borde (roza contenido, sensación de "flotar raro"), se cae a **A (plana)** sin cambiar nada más.

#### 9.7.4 Animación

Todo con `transform` y `opacity`, nunca `width`, `left`, `filter` o `font-weight` animados (coincide con las normas del proyecto). Duración corta, 200 a 280 ms, curva `ease-out` o un spring suave.

- **Indicador activo (lo principal):** una **píldora** absolutamente posicionada detrás del icono+etiqueta del tab activo, que se **desliza** entre ranuras con `transform: translateX()`. Nada de animar posición con `left`. El proyecto **ya hace exactamente esto** con `#mbn-indicator` ("indicador magnético") y con `.tab-pill`: se reaprovecha el mecanismo, solo cambia que ahora hay 4 posiciones fijas y ninguna es "casa oculta".
  - Cálculo de la posición: `translateX((indiceActivo + 0.5) * (anchoBarra / 4) - mitadPildora)`. Aritmética pura, sin `getBoundingClientRect` por frame.
  - Alternativa **sin JS**: con `:has()` (ya soportado de forma amplia) se puede mover la píldora en CSS puro según cuál `<a>` tenga `aria-current="page"`. Menos código, menos riesgo. Recomendado si se confirma soporte en el parque de dispositivos objetivo.
- **Icono:** cambio de contorno a relleno con un `opacity` cruzado entre las dos versiones (dos SVG superpuestos) + un micro `scale` del icono activo (1 -> 1.08 -> 1) de ~180 ms. Sin reflow.
- **Etiqueta:** solo cambia de color (inactivo: gris; activo: color de marca). **No** cambiar el `font-weight` en caliente: cambia el ancho del texto y provoca salto de layout. Si se quiere el efecto "negrita al activar", tener dos copias (normal y bold) superpuestas y cruzar `opacity`.
- **Toque (feedback):** `navigator.vibrate(10)` al cambiar de pestaña. Funciona en Android; en iOS Safari **no está soportado** y simplemente no hace nada (no da error). Se añade como mejora progresiva con comprobación de soporte, nunca como algo de lo que dependa la sensación.
- **Transición de página al cambiar de tab:** con MPA real + View Transitions API entre documentos, un **cross-fade** corto (o elemento compartido si la tarjeta y la página lo permiten). Donde no haya soporte (Firefox), navegación normal sin animar. Respetar `prefers-reduced-motion`: sin deslizamientos ni fades, cambio seco.

#### 9.7.5 Extras premium (fase de pulido, opcionales)

- **Encoger al hacer scroll (shrink-on-scroll):** al bajar, la barra reduce un poco su alto y colapsa las etiquetas dejando solo iconos; al subir, se expande. Es lo que hacen Apple Music/News en iOS 26. Da sensación de producto cuidado. Requiere un listener de scroll con `requestAnimationFrame` y `prefers-reduced-motion`. Coste bajo si se hace con `transform: scaleY()` o cambiando una variable CSS de alto con `transition`.
- **Auto-ocultar en el artículo:** en páginas de lectura, la barra se desliza fuera al bajar (más pantalla para leer) y vuelve al subir. Patrón típico de apps de lectura (Medium, Pocket). Solo en la vista de artículo, no en las secciones.
- **Scrubbing con el dedo:** arrastrar a lo largo de la barra y que el indicador siga al dedo 1:1, navegando al soltar. Es un detalle de gama alta (lo hace el componente `expo-glass-tabs`). Bonito pero es bastante trabajo y hay que competir un `pan` contra un `tap` sin romper la pulsación normal. Solo si sobra tiempo.

#### 9.7.6 Construcción técnica

- Barra en el **partial de armazón**, como 4 `<a href>` **reales** (no `<button>`): así funciona como navegación MPA de verdad, es accesible y funciona sin JS.
- `role="navigation"` + `aria-label` en el contenedor (ya está). `aria-current="page"` en el enlace activo, calculado por `location.pathname` (no por una variable de estado de JS).
- Capa de composición propia y estable: `transform: translateZ(0)`; `will-change: transform` solo en el indicador, no en toda la barra.
- Alto ~56 a 64 px + área segura. Iconos con área táctil real de 25% de ancho.
- Sin dependencia de JS para verse: la barra y el estado activo se pintan con HTML + CSS; el JS solo suaviza la animación del indicador (y ni eso, si se usa `:has()`).
- Contraste comprobado en los 6 temas (claro, dark-base, naranja, tormenta, cosmos, carmesi).

### 9.6 Qué NO tocar

- Los 3 tabs de contenido del home ("Por Intereses", "Fuera de Bata", "El Artículo de la Semana") en escritorio: intactos.
- Persistencia de tema, sincronía de niveles (array `NIVELES` triplicado), progress tracker, focus trap, `lsSet`/`lsGet`, `shareContenido()`.
- Sin frameworks. Todo lo propuesto es HTML/CSS/JS y APIs de plataforma.

---

## 10. Plan de implementación por fases

> **Estado a fecha de hoy** (actualizado durante la ejecución):
>
> - **Fase 0** ✅ hecha. Acabó siendo la vista rápida in-app de Fuera de Bata (`mp-fuerabata`) con enlace al catálogo completo, no una navegación pelada. Ver 10.ter.
> - **Fase 1** ✅ hecha, completa. Barra de 4 destinos sin botón central, indicador deslizante, fondo sólido, safe-area, iconos SVG, auto-ocultar al scroll, `@view-transition`. `sharedBottomNav(active)` en `generate-pages.js` la inyecta en artículos, categorías, semanales, rutas, guías, biblioteca y ficha de autor, además de `index.html`. Los 10 artículos de `/fuera-de-bata/` (mantenidos a mano) llevan el mismo snippet añadido a mano, con "Fuera de Bata" como pestaña activa.
> - **Fase 2** ✅ hecha (versión "sin salir de la página rápida"). Se mantiene el sistema `mp-*` (que es lo que hace instantáneo el cambio de sección) y encima se añade enrutado por hash: cada sección tiene su dirección (`/#explorar`, `/#fuerabata`, `/#botiquin`, `/#yo`, `/` para Inicio), el botón atrás/adelante recorre las secciones, recargar o abrir un enlace cae en la sección correcta, y el scroll se recuerda por sección. Re-pulsar la pestaña activa sube al principio. Cero recargas: todo dentro del mismo documento. Convive con el enrutador `?v=` existente (efectos, glosario, artículo de biblioteca).
> - **Fase 3** ⬇️ degradada a tarea pequeña. La portada móvil ya está adaptada (hero + temas, sin columnas de escritorio). Solo falta añadir Artículo de la Semana + bloque de Fuera de Bata más abajo. No es una fase.
> - **Fase 4** ⚠️ a medias. `@view-transition { navigation: auto }` entre documentos: hecho. Bottom sheets para tema / glosario / menú secundario: pendiente.
> - **Fase 5** ❌ no hecha. Sin `manifest.webmanifest`, sin service worker, sin prompt de instalación.
> - **Fase 6** ⚠️ parcial. Probado en emulación (claro/oscuro) y en Android Chrome real. Falta iPhone y repaso de los 6 temas.

**Fase 0. Parche urgente (1 cambio):**
Que la pestaña "Fuera de Bata" en móvil navegue a `/fuera-de-bata/` en vez de abrir la vista in-app obsoleta. Ya está medio identificado en `js/main.js`.

**Fase 1. Barra inferior nueva (4 destinos) + armazón compartido:**
- Rediseñar la barra: de 5 pestañas con montaña central a **4 pestañas planas o en píldora flotante, sin botón central** (detalle completo en 9.7). Orden `Inicio | Explorar | Fuera de Bata | Yo`.
- Indicador que se desliza con `transform: translateX()` (reaprovecha el mecanismo de `#mbn-indicator` / `.tab-pill` que ya existe).
- Fondo sólido, sin `backdrop-filter`. Etiquetas en dos líneas para que "Fuera de Bata" no se trunque.
- Extraer la barra a un partial que `generate-pages.js` inyecta en todas las plantillas (artículo, ruta, guía, biblioteca) además de `index.html`.
- La barra detecta la pestaña activa por `location.pathname`, no por una variable de JS. `aria-current="page"` en el enlace activo.
- CSS del armazón aislado, con `padding-bottom: max(8px, env(safe-area-inset-bottom))`.
- En páginas de artículo, la barra puede auto-ocultarse al hacer scroll hacia abajo y reaparecer al subir (patrón de apps de lectura), respetando `prefers-reduced-motion`.

**Fase 2. URLs y botón atrás, SIN salir de la página rápida (redefinida):**
- La idea original ("cada sección un documento aparte") se descartó: reintroduciría la misma pausa que tenía Fuera de Bata entre TODAS las secciones. Lo instantáneo del cambio de sección viene de que todo vive en el mismo documento; eso se protege.
- Se mantiene el sistema `mp-*` y encima se añade enrutado por hash: cada sección tiene su dirección (`/#explorar`, `/#fuerabata`, `/#botiquin`, `/#yo`, `/`), `history.pushState` en cada cambio para que el botón atrás/adelante recorra las secciones, `popstate` para atender atrás/adelante, y scroll recordado por sección en memoria de sesión.
- Re-pulsar la pestaña activa sube al principio (patrón iOS).
- Convive con el enrutador `?v=` existente (efectos, glosario, artículo de biblioteca) sin pisarse: cada handler filtra por su propia clave de estado.
- `history.scrollRestoration = 'manual'` ya estaba puesto globalmente.

**Fase 3. Portada móvil: ~~una fase~~ una tarea pequeña:**
- Revisado con la web delante: la portada móvil ya muestra hero + temas y **las columnas laterales de escritorio ya están ocultas**. La premisa ("es la de escritorio troceada") estaba desfasada.
- Lo único que queda: añadir el Artículo de la Semana y un bloque de Fuera de Bata más abajo en la portada. Es media hora, no una fase. "Continuar leyendo" descartado por el usuario.

**Fase 4. Sensación de app:**
- `@view-transition` entre documentos + `view-transition-name` en tarjetas y artículos.
- Bottom sheets para tema, glosario, menú secundario.

**Fase 5. PWA:**
- `manifest.webmanifest` + iconos maskable.
- `sw.js` mínimo: armazón + lectura offline.
- Prompt de instalación diferido.

**Fase 6. Pulido:**
- Auditoría de objetivos táctiles (48 px), tipografía de artículo (16 a 18 px, interlineado 1,6), orden de foco, contraste en los 6 temas.
- Test en iPhone y Android reales.

Fases 0 y 1 resuelven el problema que ha motivado esto. El resto es la mejora de fondo.

Cada fase es **independiente y desplegable por sí sola**. Si una da problemas, se revierte sin tocar las demás.

---

## 10.bis. Nivel de certeza y riesgos (respuesta honesta)

No puedo garantizar al 100% que todo funcione perfecto sin implementarlo y probarlo en dispositivos. Lo que sí puedo afirmar:

- **Dirección:** alta confianza. Cada pieza (barra inferior persistente, 4 destinos, indicador con `translateX`, MPA + View Transitions, PWA con `sw.js`, safe areas) es un patrón conocido, soportado y documentado. No hay nada experimental ni exótico.
- **Fase 0 (parche):** riesgo casi nulo. Un cambio de una línea de comportamiento.
- **Fase 1 (barra nueva + compartida):** riesgo bajo-medio. El diseño visual y la animación reaprovechan mecanismos que ya existen en el código. El trabajo fino es que "Fuera de Bata" quepa y que la barra se vea bien en los 6 temas y con notch. Se prueba en móvil real antes de dar por buena.
- **Fase 2 (páginas reales en vez de `mp-*`):** es **la parte más delicada**. El sistema `mp-*` toca varios archivos y está en la lista de "cosas que nunca deben romperse" de CLAUDE.md (orden del grid móvil). Hay que hacerlo con red: rama aparte, pruebas de que niveles/XP, progreso, tema y focus trap siguen intactos. Es abordable, pero es donde más hay que mirar.
- **Fase 4 (View Transitions):** soporte parcial (Chrome/Edge/Safari sí, Firefox no). Degrada limpio: sin animación, navegación normal. Cero riesgo funcional, solo estético en Firefox.
- **Fase 5 (PWA):** riesgo bajo. Un `sw.js` mal hecho puede servir contenido cacheado viejo; se mitiga con versionado de caché y estrategia conservadora (network-first para HTML).

Resumen: el plan es sólido y se puede ejecutar por partes sin comprometer lo que ya funciona. La única fase que exige cuidado real es la 2.

---

## 10.ter. Desvío del plan: Fuera de Bata como vista rápida in-app

El plan original tenía a "Fuera de Bata" como una navegación real a `/fuera-de-bata/` desde la barra. En ejecución, el usuario probó en Android Chrome y esa entrada se sentía lenta comparada con las pestañas SPA (Inicio, Explorar, Yo), que son instantáneas por ser un cambio de clase en el mismo documento.

Se intentó cerrar la brecha sin cambiar arquitectura (View Transitions entre documentos, luego Speculation Rules `prerender`), pero el listón era "exactamente igual de fluido que Inicio -> Explorar", y eso solo se consigue si NO hay navegación real.

**Decisión:** la pestaña "Fuera de Bata" vuelve a ser una página in-app (`mp-fuerabata`) que muestra una **vista rápida**: título con la probeta (mismo SVG que la pestaña), entradilla, stats con count-up, artículo destacado, y dos botones ("Ver el catálogo completo" -> `/fuera-de-bata/`, "Cómo publicar aquí"). El cambio de pestaña es 0 ms, igual que el resto.

- **Una sola URL canónica:** `/fuera-de-bata/` y `/fuera-de-bata/<slug>/`. La vista rápida no tiene URL propia; es solo la pestaña. Compartir un enlace funciona en cualquier dispositivo, SEO intacto.
- **Coste:** doble mantenimiento leve. El texto y el destacado de la vista rápida están en `index.html`; el catálogo completo, los filtros y el buscador de autor solo en `fuera-de-bata/index.html`. Añadir una pieza nueva: solo la página completa.
- **Contenido extra de esa pantalla** (no en el plan original): halo de texto sobre los nodos, entrada escalonada de los bloques, contadores animados, probeta con burbuja. Detalle en el historial de commits.

---

## 11. Checklist de "web móvil bien hecha" para este proyecto

- [x] Barra inferior visible en TODAS las páginas: generadas (artículos, categorías, semanales, rutas, guías, biblioteca, autor), `index.html`, `/fuera-de-bata/` y los 10 artículos de `/fuera-de-bata/` (estos últimos a mano, no generados).
- [x] 4 destinos (`Inicio | Explorar | Fuera de Bata | Yo`), sin botón central, barra plana.
- [x] Indicador activo que se desliza con `transform: translateX()`; iconos SVG de trazo; etiqueta cambia de color.
- [x] Barra con fondo sólido, sin `backdrop-filter`.
- [ ] Etiqueta "Fuera de Bata" verificada sin truncar en móvil de 360 px (cabe en 1 línea en las pruebas).
- [ ] Contraste 3:1 comprobado en los 6 temas.
- [ ] Cada destino con URL real y estado propio (sigue con `mp-*`).
- [ ] Hamburguesa (bottom sheet) solo para secundario.
- [ ] `viewport-fit=cover` + `env(safe-area-inset-*)` en barra y cabecera.
- [ ] Objetivos táctiles de 48 px con 8 px de separación en la barra.
- [ ] Cuerpo de artículo 16 a 18 px, interlineado 1,6 a 1,7, línea de 30 a 50 caracteres.
- [ ] Scroll restaurado por sección; re-pulsar pestaña activa sube arriba.
- [ ] Transiciones entre páginas con View Transitions, degradación limpia.
- [ ] Solo `transform`/`opacity` animados; sin `backdrop-filter` nuevo.
- [ ] `prefers-reduced-motion` respetado en todo.
- [ ] Orden de DOM lógico aunque el CSS reordene con `order`.
- [ ] `manifest.webmanifest` en `standalone` con iconos maskable.
- [ ] Service worker: armazón precacheado + lectura offline de artículos visitados.
- [ ] Prompt de instalación diferido, nunca al entrar.
- [ ] Home móvil = portada de entrada, no dashboard de escritorio troceado.
- [ ] Onboarding de 3 a 5 pasos, saltable, centrado en intereses.
- [ ] Probado en iPhone con notch y en Android reales.

---

## 12. Fuentes

Navegación y patrones:
- [Tab bars, Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/components/navigation-and-search/tab-bars)
- [Navigation bar, Material Design 3](https://m3.material.io/components/navigation-bar/guidelines)
- [Hamburger Menus and Hidden Navigation Hurt UX Metrics, NN/G](https://www.nngroup.com/articles/hamburger-menus/)
- [Beyond the Hamburger: What Makes Navigation Discoverable on Mobile, NN/G](https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/)
- [Hidden and Visible Navigation Study: Methodology, NN/G](https://www.nngroup.com/articles/hidden-navigation-methodology/)
- [Basic Patterns For Mobile Navigation: Pros And Cons, Smashing Magazine](https://www.smashingmagazine.com/2017/05/basic-patterns-mobile-navigation/)
- [Mobile Navigation Patterns: Pros and Cons, UXPin](https://www.uxpin.com/studio/blog/mobile-navigation-patterns-pros-and-cons/)
- [Mobile Navigation Design: 8 Types, Examples & Best Practices 2026, UXPin](https://www.uxpin.com/studio/blog/mobile-navigation-examples/)
- [Mobile Navigation UX Best Practices, Patterns & Examples 2026, DesignStudio](https://www.designstudiouiux.com/blog/mobile-navigation-ux/)

Contenido y lectura:
- [Information And Information Architecture: The BIG Picture, Smashing Magazine](https://www.smashingmagazine.com/2020/07/information-architecture-big-picture/)
- [Efficiently Simplifying Navigation, Part 1: Information Architecture, Smashing Magazine](https://www.smashingmagazine.com/2013/12/efficiently-simplifying-navigation-information-architecture/)
- [The ultimate guide to UX of news apps, Medium](https://medium.com/@uiuxyash/the-ultimate-guide-to-ux-of-news-apps-redesign-ui-ux-case-study-e90bc7ef7fe9)
- [Mobile UX: Study Guide, NN/G](https://www.nngroup.com/articles/mobile-ux-study-guide/)

Formato app y PWA:
- [App design, web.dev Learn PWA](https://web.dev/learn/pwa/app-design)
- [Architecture, web.dev Learn PWA](https://web.dev/learn/pwa/architecture/)
- [Beyond SPAs: alternative architectures for your PWA, Chrome for Developers](https://developer.chrome.com/blog/beyond-spa)
- [Optimizing PWAs For Different Display Modes, Smashing Magazine (2025)](https://www.smashingmagazine.com/2025/08/optimizing-pwas-different-display-modes/)
- [Best practices for PWAs, Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/best-practices)
- [Twitter Lite PWA case study, web.dev](https://web.dev/case-studies/twitter)
- [How to Implement App Shell Architecture in PWAs, PixelFreeStudio](https://blog.pixelfreestudio.com/how-to-implement-app-shell-architecture-in-pwas/)

Ergonomía, tipografía, áreas seguras:
- [Mastering the Thumb Zone, Parachute Design](https://parachutedesign.ca/blog/thumb-zone-ux/)
- [Designing for the Thumb Zone, Tim Graf](https://timgraf.com/ux-design/designing-for-the-thumb-zone-a-modern-guide-to-mobile-ux-that-respects-human-anatomy/)
- [Perfect Mobile Button Size, DesignMonks](https://www.designmonks.co/blog/perfect-mobile-button-size)
- [Optimal Line Length for Readability, UXPin](https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/)
- [10 Mobile Typography Tips for Better Readability, OneNine](https://onenine.com/10-mobile-typography-tips-for-better-readability/)
- [Typography for Mobile Apps, Toptal](https://www.toptal.com/designers/typography/typography-for-mobile-apps)
- [env(), CSS-Tricks Almanac](https://css-tricks.com/almanac/functions/e/env/)
- [Understanding env() Safe Area Insets in CSS, Medium](https://medium.com/@developerr.ayush/understanding-env-safe-area-insets-in-css-from-basics-to-react-and-tailwind-a0b65811a8ab)

Arquitectura, transiciones, estado, tendencias:
- [SPA vs MPA, GeeksforGeeks](https://www.geeksforgeeks.org/blogs/spa-vs-mpa-which-one-is-better-for-you/)
- [Cross-document view transitions for multi-page applications, Chrome for Developers](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document)
- [View Transition API, MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [How to implement view transitions in multi-page apps, LogRocket](https://blog.logrocket.com/how-to-implement-view-transitions-multi-page-apps/)
- [Common UI Recipe, Android Developers (back stack por pestaña)](https://developer.android.com/guide/navigation/navigation-3/recipes/common-ui)
- [State Persistence Techniques for the Flutter Bottom Navigation Bar, DEV](https://dev.to/nicks101/state-persistence-techniques-for-the-flutter-bottom-navigation-bar-3ikc)
- [Mobile App Design Trends 2026, Muzli](https://muz.li/blog/whats-changing-in-mobile-app-design-ui-patterns-that-matter-in-2026/)
- [What Is Mobile UI? Principles, Patterns, and Best Practices 2026, UXPin](https://www.uxpin.com/studio/blog/what-is-mobile-ui/)
- [Mobile App Navigation Design: 2026 UX Best Practices, Medium](https://medium.com/ui-ux-designing-trends/mobile-app-navigation-design-2026-ux-best-practices-5b2db901790d)

Barra inferior: forma, disposición y animación:
- [Navigation bar, Material Design 3 (indicador de píldora, icono relleno/contorno)](https://m3.material.io/components/navigation-bar)
- [NavigationIndicator class, Flutter API (animación del indicador, radio 16)](https://api.flutter.dev/flutter/material/NavigationIndicator-class.html)
- [Bottom Tab Bar Navigation Design Best Practices, UX Planet](https://uxplanet.org/bottom-tab-bar-navigation-design-best-practices-48d46a3b0c36)
- [Bottom Tab Bar Design Best Practices, Nick Babich, UX Planet](https://uxplanet.org/bottom-tab-bar-design-best-practices-ef3ee71de0fc)
- [Exploring tab bars on iOS 26 with Liquid Glass, Donny Wals](https://www.donnywals.com/exploring-tab-bars-on-ios-26-with-liquid-glass/)
- [Liquid Glass Is Cracked, and Usability Suffers in iOS 26, NN/G](https://www.nngroup.com/articles/liquid-glass/)
- [expo-glass-tabs: floating glass tab bar (minimize-on-scroll, sliding highlight, scrubbing, haptics)](https://github.com/davidmokos/expo-glass-tabs)
- [Floating Pill Navbar, Framer Community (patrón premium editorial)](https://www.framer.com/community/marketplace/components/floating-pill-navbar/)
- [Material 3 Expressive: navigation changes, 9to5Google](https://9to5google.com/2025/05/14/material-3-expressive-navigation/)
- [Haptic Feedback for Web Apps with the Vibration API, OpenReplay](https://blog.openreplay.com/haptic-feedback-for-web-apps-with-the-vibration-api/)
- [I Open-Sourced an OSS Library for Haptic Feedback in iOS Safari (limitación de iOS), Medium](https://medium.com/@posaune0423/i-open-sourced-an-oss-library-for-arbitrary-haptic-feedback-in-ios-safari-5b8ca74a5f05)

Onboarding y accesibilidad:
- [User Onboarding Best Practices, Scandiweb](https://scandiweb.com/blog/user-onboarding-best-practices/)
- [7 Mobile Onboarding Best Practices for 2025, NextNative](https://nextnative.dev/blog/mobile-onboarding-best-practices)
- [Mobile App Onboarding: 11 Best Practices & Examples 2026, DesignStudio](https://www.designstudiouiux.com/blog/mobile-app-onboarding-best-practices/)
- [Making mobile apps accessible with WCAG, Medium](https://medium.com/design-bootcamp/making-mobile-apps-accessible-with-wcag-8323eecbc60f)
- [Understanding WCAG SC 2.4.3 Focus Order, DigitalA11Y](https://www.digitala11y.com/focus-order-understanding-sc-2-4-3/)
