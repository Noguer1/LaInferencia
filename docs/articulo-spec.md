# Spec de artículo — La Inferencia

> Cómo se escribe y reescribe un artículo de divulgación de la web.
> Aplica a los 120 artículos de `LIBRARY_ARTICLES` en `js/main.js` y a los nuevos.
> Objetivo del proyecto de reescritura (agosto 2026): que cada artículo se lea entero,
> enganche y explique de verdad, sin dejar de ser riguroso.

---

## 1. Diagnóstico del molde actual

Cada artículo hoy es el mismo esqueleto repetido 120 veces:

- `intro` corta (2-3 frases)
- Sección 1 con subtítulo calcado: *"El experimento de X e Y"*
- Sección 2 con subtítulo calcado: *"El mecanismo psicológico"*
- `blockquote`
- `aplicacion` de una frase

Resultado: ~400 palabras, registro de abstract académico, sin escena, sin tensión, sin
motivo para llegar al final. El tema casi siempre da para más.

Lo que **no** hay que cambiar: el rigor, la fuente citada, que cada afirmación sea
rastreable al estudio. Se amplía el relato, no los datos.

---

## 2. Estructura del data object

Campos que **nunca** se tocan al reescribir:

| Campo | Regla |
|-------|-------|
| `id` | Inmutable. Rompe URLs, rutas, recomendaciones, search-index. |
| `sourceUrl` | Inmutable salvo error comprobado de enlace. |
| `sourceLabel` | Inmutable salvo error comprobado de cita. |
| `date` | Inmutable. |
| `author` | Inmutable salvo error de dato. |
| `badge` | Solo se cambia si el actual es impreciso. |

Campos que se reescriben:

| Campo | Qué es ahora | Qué pasa a ser |
|-------|--------------|----------------|
| `title` | Correcto en general | Se deja salvo que sea plano; puede afinarse el gancho sin inventar. |
| `summary` | Frase de tarjeta / meta description | 1 frase, ~140 caracteres, con anzuelo, sin spoiler total. |
| `intro` | 2-3 frases | Gancho real (ver §3). 1-2 párrafos. |
| `sections` | 2 secciones fijas | Número y orden **libres por artículo** (ver §4). Subtítulos redactados a medida, nunca plantilla. |
| `blockquote` | Cita del investigador | Se mantiene. Debe ser cita real y verificable, o se quita. |
| `aplicacion` | 1 frase | 2-4 frases. Concreta y honesta (ver §6). |
| `readingTime` | `'3 min'` etc., **almacenado a mano** | Recalcular tras reescribir: ~200 palabras/min, redondeo hacia arriba. |
| `chart` | Opcional, SVG inline | Se mantiene el que haya. No es obligatorio crear nuevos. |

El template (`generate-pages.js:487` y el render de la SPA) ya soporta cualquier número de
secciones y párrafos, TOC automático desde los subtítulos, y `tocSkip: true` en una sección
para ocultarla del índice. **No hay que tocar código**, solo datos + `node generate-pages.js`.

---

## 3. El gancho (`intro`)

La primera frase entra en materia. Prohibido abrir con generalización ("En el mundo de la
economía conductual…", "Todos hemos sentido alguna vez…").

Tres aperturas que funcionan, se elige la que pida el tema:

1. **Afirmación contraintuitiva y seca.** "Perder 500 € no duele lo que alegra ganarlos.
   Duele el doble."
2. **Escena concreta y cotidiana.** Un gesto que el lector reconoce, contado en presente,
   sin adjetivos de relleno.
3. **La pregunta que el estudio responde**, formulada como la haría alguien con curiosidad
   real, no un profesor.

El `intro` deja una deuda abierta: el lector tiene que querer saber cómo se resuelve.

---

## 4. Cuerpo (`sections`) — flexible por artículo

No hay esqueleto fijo. Se elige entre estos bloques los que el tema necesite, en el orden
que mejor cuente la historia. Un artículo simple puede llevar 3 secciones; uno con más tela,
6. Longitud objetivo **variable por tema**: desde ~900 palabras hasta ~1600.

Bloques disponibles (los subtítulos son ejemplos, se redactan a medida):

- **El enigma / la situación.** Por qué esto importa, dónde aparece en la vida real, qué
  tensión o paradoja hay. Es el puente entre el gancho y el estudio.
- **El estudio, contado como historia.** Quién lo hizo, dónde, en qué año, con quién, y el
  giro: qué esperaban y qué encontraron. Números reales del paper (n, efecto, porcentajes).
  Nada de "los investigadores demostraron que"; se cuenta qué hicieron paso a paso.
- **Por qué pasa (mecanismo).** La explicación psicológica o neuro, pero tejida con una
  analogía o un ejemplo, no un párrafo de manual. Una sola transición didáctica en todo el
  artículo como máximo ("la explicación que mejor encaja es…").
- **El matiz / qué NO significa.** Límites del hallazgo, si se ha replicado, a quién no
  aplica, crítica razonable. Esta sección es la que separa divulgación seria de listicle.
  Casi siempre merece la pena incluirla.
- **Dónde se ve esto hoy.** Ejemplos actuales, casos de uso, cómo lo explotan empresas o
  instituciones. Aterriza el hallazgo en el presente del lector.

Reglas transversales del cuerpo:

- Un dato concreto por párrafo como mínimo en las secciones de estudio.
- Nada de afirmaciones que no estén en la fuente citada. Si el paper no lo dice, no se
  escribe. Si hace falta contexto externo, se marca `<!-- verificar -->` para revisión.
- Evitar arcos perfectamente simétricos. Cortar un beat, fusionar dos ideas, romper el
  orden esperado alguna vez.

---

## 5. Cita (`blockquote`)

Se mantiene si es una frase real del investigador o del paper, verificable. Si es una
paráfrasis disfrazada de cita, se sustituye por una frase fiel al abstract o a las
conclusiones, atribuida al paper (`Autor et al. (año)`), no al investigador como si fuera
una declaración textual suya.

**No se puede poner `blockquote: null`.** El render de la SPA (`main.js`, biblioteca y
semanal) emite el bloque sin comprobar si existe, así que un `null` rompe la página. Si en
el futuro se quiere permitir artículos sin cita, hay que envolver esos tres puntos de
render en un ternario primero (el generador estático ya lo hace bien).

---

## 6. Cierre (`aplicacion`)

Se renderiza bajo el epígrafe *"¿Cómo te afecta esto hoy?"*. 2-4 frases.

- Algo que el lector pueda hacer o notar mañana, concreto.
- Honesto: si el sesgo no se puede "arreglar" del todo, se dice.
- No un resumen del artículo. Idea útil nueva.
- Sin cierre reconciliador tipo "en definitiva, entender esto nos hace mejores".

---

## 7. Voz

Se aplica el skill **`voz-miguel`** (que incluye `anti-ia` obligatorio) a cada artículo,
dos pasadas. Puntos que más se incumplen en los artículos actuales:

- **Guion largo "—": prohibido siempre.** Coma, punto y seguido, paréntesis, o dos puntos
  con moderación.
- **Dos puntos como muletilla de subtítulo.** Nada de 6 secciones tituladas "Concepto:
  explicación". Variar: la mitad como frase corrida.
- **Ritmo irregular.** Frases de 5-8 palabras entre párrafos largos de 28-35. La
  homogeneidad de longitud es la firma de la IA.
- **Cero vocabulario corporativo vago** (ver lista negra en `anti-ia/references/patrones-ia.md`).
  Máximo 1 conector formal por párrafo.
- **Sin apertura vacía y sin cierre que sintetiza** (ya cubierto en §3 y §6).
- **Atenuadores con contrapeso.** Si un párrafo lleva dos "puede que" / "posiblemente",
  necesita también una afirmación rotunda.
- **Registro:** culto pero con permiso para bajar a la calle dentro del mismo párrafo.
  Divulgación para público general con curiosidad, no para estudiantes de posgrado. Tono
  ligero y enganchante, nunca sensacionalista ni agresivo.
- **Deontología:** en temas de sufrimiento real (adicciones, trastornos graves, exclusión)
  el filo viene del argumento y la revelación, no de exponer el padecimiento como gancho.

---

## 7bis. Arranque de sesión (para no perder calidad al limpiar el chat)

Al empezar una sesión nueva para este proyecto, antes de tocar nada:

1. Leer este archivo entero.
2. Leer como referencia de nivel dos artículos ya terminados en `js/main.js`:
   `eco-05` (con sección de matiz fuerte) y `der-03`. Ese es el listón.
3. Invocar el skill `voz-miguel` (arrastra `anti-ia`).
4. Mirar §9 para saber qué categoría toca.
5. Trabajar una sola categoría por sesión. No commitear hasta que Miguel revise.

Frase de arranque tipo: *"Sigue con la reescritura de artículos según docs/articulo-spec.md.
Siguiente categoría: [nombre]. Mismo proceso que economía."*

## 8. Proceso de reescritura de los 120

1. **Piloto:** 3 artículos completos (el de ejemplo que marque Miguel + 2 de otras
   categorías). Miguel valida. Quedan como modelos de referencia enlazados desde aquí.
2. **Despliegue por categoría.** 15 categorías, ~8 artículos cada una. Por lote:
   - Claude reescribe los objetos en `js/main.js`.
   - `node generate-pages.js`.
   - Revisar el diff + abrir 1-2 páginas renderizadas para comprobar que el JS sigue válido
     y el TOC sale bien.
   - Commit por lote (`Artículos <categoría>: reescritura a fondo`).
   - Miguel revisa antes del siguiente lote.
3. **Guardarraíles:**
   - No inventar detalles de estudios. Solo lo rastreable a `sourceUrl`.
   - No tocar `id`, `sourceUrl`, `sourceLabel`, `date`.
   - `readingTime` recalculado en cada artículo tocado.
   - Si un `blockquote` no se puede verificar como cita literal, se quita.
4. Actualizar `docs/proyecto.md` cuando cambie el estado del proyecto de reescritura.

---

## 9. Modelos de referencia

Piloto cerrado y aplicado a `js/main.js` (agosto 2026). Los tres siguen el arco flexible,
subieron de ~400 a ~950-1000 palabras y de `'3 min'` a `'5 min'`:

- **`eco-01`** · Economía · *Por qué pagamos más cuando el precio termina en ,99€*.
  Añade la condición del dígito izquierdo y el efecto de distancia (ausentes antes).
  `sourceUrl` roto corregido.
- **`der-03`** · Derecho · *El juez hambriento*. Sección de matiz con la réplica de
  Weinshall-Margel & Shapard y la simulación de Glöckner. Elimina el "descartaron las
  explicaciones alternativas una a una", que es justo lo que la crítica disputa.
- **`edu-06`** · Educación · *Comic Sans*. Sección "Y luego no se replicó" con Rummer 2016,
  el metaanálisis de 2018 y el fracaso de Sans Forgetica.

Pendiente de verificar con el PDF (no bloquea publicación, sí conviene antes de promocionar):

- `eco-01`: si "540 adultos", "seguimiento ocular" y "30% menos de tiempo" del texto viejo
  eran correctos, se pueden reincorporar. La reescritura solo usa lo confirmado.
- `der-03` / `edu-06`: los `blockquote` son frases fieles al paper, no citas textuales
  verificadas. Sustituir por cita literal si se tiene acceso.

### Progreso del despliegue

- **Economía (7/7)** — hecho. `eco-01` a `eco-07` reescritos y en `main.js`, regenerado.
  Correcciones de fondo: `eco-03` atribuía a Prelec & Simester un resultado de fMRI que
  es de Knutson et al. (2007), corregido. `eco-05` (mermeladas) ahora incluye el
  metaanálisis de Scheibehenne et al. (2010) que dejó el efecto casi en cero. `eco-02`
  añade la crítica de Gal & Rucker (2018) al coeficiente de aversión a la pérdida.
- Resto de categorías: sin empezar. Orden sugerido: las que más tráfico tengan primero.
