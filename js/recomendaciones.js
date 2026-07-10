// Recomendaciones de producto (libro y, en casos puntuales, producto físico)
// por artículo individual. Mismo patrón que seo-overrides.js: objeto plano
// keyed por art.id, consumido por generate-pages.js al construir cada página.
// Enlaces con formato amazon.es/s?k=Título+Autor&tag=lainferencia-21 (búsqueda,
// no ASIN fijo) salvo que se reutilice un enlace /dp/ ya vetado en BOTIQUIN_DATA.
const RECOMENDACIONES = {

  // ── Economía ───────────────────────────────────────────────
  'eco-01': {
    libro: {
      titulo: 'Influencia', autor: 'Robert Cialdini',
      sinopsis: 'Cialdini explica por qué pequeños trucos de formato de precio consiguen que el cerebro decida antes de que la razón intervenga. El mismo mecanismo que hace que 9,99€ se sienta "un nueve" y no "casi diez".',
      amazon: 'https://www.amazon.es/dp/849139690X?tag=lainferencia-21',
    }
  },
  'eco-02': {
    libro: {
      titulo: 'Pensar rápido, pensar despacio', autor: 'Daniel Kahneman',
      sinopsis: 'El propio Kahneman, premio Nobel, explica de primera mano la teoría prospectiva y la aversión a las pérdidas: el marco que hace que perder 100€ duela más de lo que alegra ganarlos.',
      amazon: 'https://www.amazon.es/dp/8483068613?tag=lainferencia-21',
    }
  },
  'eco-03': {
    libro: {
      titulo: 'Las trampas del deseo', autor: 'Dan Ariely',
      sinopsis: 'Ariely documenta, con sus propios experimentos, por qué desacoplar el pago del consumo (tarjeta, apps, suscripciones) desactiva el "dolor de pagar" y dispara el gasto sin que lo notes.',
      amazon: 'https://www.amazon.es/s?k=Las+trampas+del+deseo+Dan+Ariely&tag=lainferencia-21',
    }
  },
  'eco-04': {
    libro: {
      titulo: 'Nudge', autor: 'Richard Thaler y Cass Sunstein',
      sinopsis: 'Thaler y Sunstein explican por qué el esfuerzo invertido en algo infla su valor de forma irracional, y cómo ese mismo sesgo se usa (o se puede neutralizar) al diseñar decisiones.',
      amazon: 'https://www.amazon.es/s?k=Nudge+Thaler+Sunstein&tag=lainferencia-21',
    }
  },
  'eco-05': {
    libro: {
      titulo: 'Por qué más es menos', autor: 'Barry Schwartz',
      sinopsis: 'Schwartz es quien documentó el estudio de las mermeladas que da pie a este artículo. Su libro explica por qué el exceso de opciones no libera: paraliza y reduce la satisfacción con lo elegido.',
      amazon: 'https://www.amazon.es/s?k=Por+que+mas+es+menos+Barry+Schwartz&tag=lainferencia-21',
    }
  },
  'eco-06': {
    libro: {
      titulo: 'Las trampas del deseo', autor: 'Dan Ariely',
      sinopsis: 'El mismo Ariely diseñó experimentos con vino y precio placebo casi idénticos al que aparece en este artículo: cómo el precio reescribe la experiencia sensorial antes de que llegue la primera copa.',
      amazon: 'https://www.amazon.es/s?k=Las+trampas+del+deseo+Dan+Ariely&tag=lainferencia-21',
    }
  },
  'eco-07': {
    libro: {
      titulo: 'Influencia', autor: 'Robert Cialdini',
      sinopsis: 'El priming ambiental (música, olores, luz) es una de las palancas de persuasión menos visibles y más estudiadas. Cialdini cataloga por qué el entorno decide antes que tú.',
      amazon: 'https://www.amazon.es/dp/849139690X?tag=lainferencia-21',
    }
  },

  // ── Moda ───────────────────────────────────────────────────
  'mod-01': {
    libro: {
      titulo: 'El poder de la presencia', autor: 'Amy Cuddy',
      sinopsis: 'Cuddy investiga cómo el cuerpo (postura, ropa, gesto) cambia el estado mental desde fuera hacia dentro, la misma lógica que explica por qué vestirte de cierta forma altera cómo piensas.',
      amazon: 'https://www.amazon.es/s?k=El+poder+de+la+presencia+Amy+Cuddy&tag=lainferencia-21',
    }
  },
  'mod-02': {
    libro: {
      titulo: 'Influencia', autor: 'Robert Cialdini',
      sinopsis: 'La señalización social (qué comunica lo que llevas puesto) es un capítulo entero de la psicología de la persuasión. Cialdini explica por qué mostrar demasiado puede jugar en tu contra.',
      amazon: 'https://www.amazon.es/dp/849139690X?tag=lainferencia-21',
    }
  },
  'mod-03': {
    libro: {
      titulo: 'Rosa borracho', autor: 'Adam Alter',
      sinopsis: 'Alter recopila decenas de estudios (incluido el efecto del rojo) sobre cómo estímulos que ni siquiera notamos —un color, un nombre, un envoltorio— cambian nuestras decisiones y percepciones.',
      amazon: 'https://www.amazon.es/s?k=Rosa+borracho+Adam+Alter&tag=lainferencia-21',
    }
  },
  'mod-04': {
    libro: {
      titulo: 'Las trampas del deseo', autor: 'Dan Ariely',
      sinopsis: 'La necesidad de coherencia (comprar una cosa nueva y sentir que todo lo demás "desentona") es puro sesgo de consistencia. Ariely explica por qué el consumo nunca es un acto aislado.',
      amazon: 'https://www.amazon.es/s?k=Las+trampas+del+deseo+Dan+Ariely&tag=lainferencia-21',
    }
  },
  'mod-05': {
    libro: {
      titulo: 'La fuerza de voluntad', autor: 'Roy Baumeister y John Tierney',
      sinopsis: 'Baumeister es quien documentó la fatiga de decisión que explica por qué Einstein, Obama o Zuckerberg vestían siempre igual: cada elección trivial consume el mismo recurso mental limitado.',
      amazon: 'https://www.amazon.es/s?k=La+fuerza+de+la+voluntad+Baumeister+Tierney&tag=lainferencia-21',
    }
  },

  // ── Derecho ────────────────────────────────────────────────
  'der-01': {
    libro: {
      titulo: 'Eyewitness Testimony', autor: 'Elizabeth Loftus',
      sinopsis: 'El libro de referencia de la propia investigadora que demostró que se puede plantar un recuerdo falso en una mente adulta sana, y por qué el testimonio ocular es la prueba más frágil del sistema judicial.',
      amazon: 'https://www.amazon.es/s?k=Eyewitness+Testimony+Elizabeth+Loftus&tag=lainferencia-21',
    }
  },
  'der-02': {
    libro: {
      titulo: 'Pensar rápido, pensar despacio', autor: 'Daniel Kahneman',
      sinopsis: 'El experimento de Loftus y Palmer es, en el fondo, un experimento sobre framing: cómo una sola palabra en la pregunta reescribe el recuerdo. Kahneman explica el mecanismo general detrás.',
      amazon: 'https://www.amazon.es/dp/8483068613?tag=lainferencia-21',
    }
  },
  'der-03': {
    libro: {
      titulo: 'La fuerza de voluntad', autor: 'Roy Baumeister y John Tierney',
      sinopsis: 'El "juez hambriento" es el ejemplo más citado de fatiga de decisión en el mundo real. Baumeister explica por qué el estado físico condiciona la calidad de cualquier veredicto, judicial o cotidiano.',
      amazon: 'https://www.amazon.es/s?k=La+fuerza+de+la+voluntad+Baumeister+Tierney&tag=lainferencia-21',
    }
  },
  'der-04': {
    libro: {
      titulo: 'Influencia', autor: 'Robert Cialdini',
      sinopsis: 'Las técnicas de interrogatorio que llevan a confesiones falsas usan los mismos principios de autoridad y compromiso que Cialdini documenta en contextos de venta y persuasión cotidiana.',
      amazon: 'https://www.amazon.es/dp/849139690X?tag=lainferencia-21',
    }
  },

  // ── Deporte ────────────────────────────────────────────────
  'dep-01': {
    libro: {
      titulo: 'El poder de los hábitos', autor: 'Charles Duhigg',
      sinopsis: 'Un ritual antes de un lanzamiento decisivo es, neurológicamente, un hábito bien diseñado: señal, rutina, resultado. Duhigg explica por qué esa estructura reduce la variabilidad bajo presión.',
      amazon: 'https://www.amazon.es/dp/8479538163?tag=lainferencia-21',
    }
  },
  'dep-02': {
    libro: {
      titulo: 'Choke', autor: 'Sian Beilock',
      sinopsis: 'Este es el libro de la propia investigadora del experimento citado en el artículo: por qué pensar demasiado en una habilidad automatizada la rompe, y cómo entrenar para que no ocurra en el momento clave.',
      amazon: 'https://www.amazon.es/s?k=Choke+Sian+Beilock&tag=lainferencia-21',
    }
  },
  'dep-03': {
    libro: {
      titulo: 'Mindset: la actitud del éxito', autor: 'Carol Dweck',
      sinopsis: 'El diálogo interno instruccional o motivacional que decide el rendimiento está muy ligado a qué mentalidad tienes sobre tu propia capacidad. Dweck explica cómo cambiarla de forma entrenable.',
      amazon: 'https://www.amazon.es/dp/8416579164?tag=lainferencia-21',
    },
    producto: {
      nombre: 'Cuaderno de entrenamiento mental para deportistas',
      nota: 'Un registro físico donde anotar sesiones de visualización mental es la forma más simple de aplicar hoy mismo lo que dice el estudio.',
      amazon: 'https://www.amazon.es/s?k=cuaderno+entrenamiento+mental+deportivo&tag=lainferencia-21',
    }
  },
  'dep-04': {
    libro: {
      titulo: 'Grit', autor: 'Angela Duckworth',
      sinopsis: 'La visualización mental funciona porque el cerebro trata lo imaginado de forma parecida a lo real, pero solo rinde frutos con repetición sostenida. Duckworth explica qué hace que alguien mantenga esa práctica.',
      amazon: 'https://www.amazon.es/dp/847953964X?tag=lainferencia-21',
    }
  },

  // ── Arte ───────────────────────────────────────────────────
  'art-01': {
    libro: {
      titulo: 'Tu cerebro y la música', autor: 'Daniel J. Levitin',
      sinopsis: 'Levitin explica, desde la neurociencia, por qué ciertas piezas musicales activan el mismo circuito de recompensa que la comida o el sexo, la base de la euforia física que describe este artículo.',
      amazon: 'https://www.amazon.es/s?k=Tu+cerebro+y+la+musica+Daniel+Levitin&tag=lainferencia-21',
    }
  },
  'art-02': {
    libro: {
      titulo: 'La era del inconsciente', autor: 'Eric Kandel',
      sinopsis: 'El premio Nobel Eric Kandel conecta neurociencia y arte para explicar por qué la ambigüedad visual obliga al cerebro a trabajar más, y por qué ese esfuerzo se experimenta como algo placentero.',
      amazon: 'https://www.amazon.es/s?k=La+era+del+inconsciente+Eric+Kandel&tag=lainferencia-21',
    }
  },
  'art-03': {
    libro: {
      titulo: 'Pensar rápido, pensar despacio', autor: 'Daniel Kahneman',
      sinopsis: 'La regla pico-final es investigación original de Kahneman: el "yo recordador" resume una experiencia entera por su momento más intenso y su final, ignorando la duración real.',
      amazon: 'https://www.amazon.es/dp/8483068613?tag=lainferencia-21',
    }
  },
  'art-04': {
    libro: {
      titulo: 'La era del inconsciente', autor: 'Eric Kandel',
      sinopsis: 'Por qué un Picasso falso e idéntico al original vale cero es, en el fondo, una pregunta sobre cómo el cerebro incorpora la historia de un objeto a la propia percepción sensorial. Kandel lo explica con rigor y sin tecnicismos.',
      amazon: 'https://www.amazon.es/s?k=La+era+del+inconsciente+Eric+Kandel&tag=lainferencia-21',
    }
  },

  // ── Tecnología ─────────────────────────────────────────────
  'tec-01': {
    libro: {
      titulo: 'Enganchado', autor: 'Nir Eyal',
      sinopsis: 'Eyal fue el consultor que ayudó a diseñar los mecanismos de enganche que ahora explica cómo desmontar: el mismo refuerzo de ratio variable que hace irresistible el scroll infinito.',
      amazon: 'https://www.amazon.es/s?k=Enganchado+Nir+Eyal+habitos&tag=lainferencia-21',
    },
    producto: {
      nombre: 'Caja con temporizador para guardar el móvil',
      nota: 'Cuando el diseño está hecho para que no puedas parar solo con fuerza de voluntad, quitarte el acceso físico durante un rato es más eficaz que proponértelo.',
      amazon: 'https://www.amazon.es/s?k=caja+temporizador+bloquear+movil&tag=lainferencia-21',
    }
  },
  'tec-02': {
    libro: {
      titulo: 'Trabajo profundo', autor: 'Cal Newport',
      sinopsis: 'El dato de los 23 minutos por interrupción que cita este artículo (Gloria Mark) es precisamente el punto de partida del libro de Newport sobre cómo proteger la concentración en un entorno diseñado contra ella.',
      amazon: 'https://www.amazon.es/dp/8411000516?tag=lainferencia-21',
    },
    producto: {
      nombre: 'Temporizador Pomodoro físico',
      nota: 'Un temporizador sin pantalla ni notificaciones evita añadir una fuente más de interrupción a la sesión que intentas proteger.',
      amazon: 'https://www.amazon.es/s?k=temporizador+pomodoro+cocina&tag=lainferencia-21',
    }
  },
  'tec-03': {
    libro: {
      titulo: 'Irresistible', autor: 'Adam Alter',
      sinopsis: 'Alter investiga por qué los entornos digitales diseñados sin las señales sociales cara a cara (anonimato, invisibilidad, asincronía) cambian por completo lo que la gente se atreve a decir.',
      amazon: 'https://www.amazon.es/dp/8449334020?tag=lainferencia-21',
    }
  },
  'tec-04': {
    libro: {
      titulo: 'El filtro burbuja', autor: 'Eli Pariser',
      sinopsis: 'Pariser acuñó el propio término "filtro burbuja" antes de que se generalizara: cómo el algoritmo aprende qué quieres ver y, al hacerlo, te convence de que el mundo entero piensa como tú.',
      amazon: 'https://www.amazon.es/s?k=El+filtro+burbuja+Eli+Pariser&tag=lainferencia-21',
    }
  },

  // ── Relaciones ─────────────────────────────────────────────
  'rel-01': {
    libro: {
      titulo: 'Siete reglas de oro para vivir en pareja', autor: 'John Gottman',
      sinopsis: 'El propio Gottman, autor de los "cuatro jinetes" que cita este artículo, explica por qué la mayoría de conflictos de pareja no se resuelven nunca y por qué eso no predice el fin de la relación.',
      amazon: 'https://www.amazon.es/s?k=Siete+reglas+de+oro+para+vivir+en+pareja+Gottman&tag=lainferencia-21',
    }
  },
  'rel-02': {
    libro: {
      titulo: 'Por qué amamos', autor: 'Helen Fisher',
      sinopsis: 'Fisher explica la base biológica de la atracción y por qué el cuerpo puede confundir dos activaciones fisiológicas parecidas —el miedo y el deseo— exactamente como ocurre en el puente colgante.',
      amazon: 'https://www.amazon.es/s?k=Por+que+amamos+Helen+Fisher&tag=lainferencia-21',
    }
  },
  'rel-03': {
    libro: {
      titulo: 'Vinculados', autor: 'Amir Levine y Rachel Heller',
      sinopsis: 'Por qué lo que sientes por alguien cambia de forma con el tiempo sin que el amor desaparezca es más comprensible si entiendes primero tu propio estilo de apego. Levine y Heller lo explican con claridad práctica.',
      amazon: 'https://www.amazon.es/dp/8479537817?tag=lainferencia-21',
    }
  },
  'rel-04': {
    libro: {
      titulo: 'Vinculados', autor: 'Amir Levine y Rachel Heller',
      sinopsis: 'La aplicación directa de Hazan, Shaver y Bowlby a la vida adulta: por qué discutes, pides ayuda o te alejas de la forma en que lo haces, y qué se puede hacer al respecto.',
      amazon: 'https://www.amazon.es/dp/8479537817?tag=lainferencia-21',
    }
  },
  'rel-05': {
    libro: {
      titulo: 'Loneliness', autor: 'John Cacioppo y William Patrick',
      sinopsis: 'Cacioppo es el investigador citado en este artículo: el propio autor del "ciclo de la soledad" explica por qué el aislamiento social es tan predictivo de mortalidad como el tabaco.',
      amazon: 'https://www.amazon.es/s?k=Loneliness+John+Cacioppo&tag=lainferencia-21',
    }
  },
  'rel-06': {
    libro: {
      titulo: 'Antes de que puedas pensar', autor: 'John Bargh',
      sinopsis: 'Bargh, el propio autor del experimento de la taza de café caliente, recopila décadas de investigación sobre cuánto decide el inconsciente antes de que la conciencia entre en juego.',
      amazon: 'https://www.amazon.es/s?k=Antes+de+que+puedas+pensar+John+Bargh&tag=lainferencia-21',
    }
  },

  // ── Salud mental ───────────────────────────────────────────
  'sm-01': {
    libro: {
      titulo: 'Fluir (Flow)', autor: 'Mihaly Csikszentmihalyi',
      sinopsis: 'El propio investigador que acuñó el concepto de flujo explica, con el método de muestreo de experiencias que originó la teoría, cómo entrar deliberadamente en ese estado con más frecuencia.',
      amazon: 'https://www.amazon.es/s?k=Fluir+Flow+Mihaly+Csikszentmihalyi&tag=lainferencia-21',
    }
  },
  'sm-02': {
    libro: {
      titulo: 'Mindfulness', autor: 'Ellen Langer',
      sinopsis: 'Ellen Langer, autora del experimento de la planta citado en el artículo, explica por qué la ilusión de control (bien entendida) es una de las variables que más protege la salud a largo plazo.',
      amazon: 'https://www.amazon.es/s?k=Mindfulness+Ellen+Langer&tag=lainferencia-21',
    }
  },
  'sm-03': {
    libro: {
      titulo: 'Spark', autor: 'John Ratey',
      sinopsis: 'Ratey, psiquiatra de Harvard, explica por qué el ejercicio cardiovascular rivaliza con la medicación antidepresiva en varios ensayos clínicos, y qué mecanismos biológicos lo explican más allá de las endorfinas.',
      amazon: 'https://www.amazon.es/s?k=Spark+John+Ratey+ejercicio+cerebro&tag=lainferencia-21',
    },
    producto: {
      nombre: 'Pulsera de actividad física',
      nota: 'Medir los minutos reales de movimiento diario es la forma más simple de comprobar si estás llegando a la dosis que documentan los estudios citados.',
      amazon: 'https://www.amazon.es/s?k=pulsera+actividad+fisica&tag=lainferencia-21',
    }
  },
  'sm-04': {
    libro: {
      titulo: 'Fluir (Flow)', autor: 'Mihaly Csikszentmihalyi',
      sinopsis: 'La neurociencia de la hipofrontalidad transitoria que explica la desaparición del yo durante el flujo está desarrollada en detalle en el libro original de Csikszentmihalyi.',
      amazon: 'https://www.amazon.es/s?k=Fluir+Flow+Mihaly+Csikszentmihalyi&tag=lainferencia-21',
    }
  },
  'sm-05': {
    libro: {
      titulo: 'Autocompasión', autor: 'Kristin Neff',
      sinopsis: 'Neff, la investigadora citada en el artículo, desmonta con sus propios datos el mito de que tratarte bien te vuelve más indulgente: al contrario, predice más motivación tras el fracaso.',
      amazon: 'https://www.amazon.es/dp/8449331986?tag=lainferencia-21',
    }
  },

  // ── Educación ──────────────────────────────────────────────
  'edu-01': {
    libro: {
      titulo: 'La sorprendente verdad sobre qué nos motiva', autor: 'Daniel Pink',
      sinopsis: 'Pink explica, a partir de la teoría de la autodeterminación, por qué evaluar y controlar (notas) reduce justo la motivación intrínseca que hace que alguien quiera aprender por sí mismo.',
      amazon: 'https://www.amazon.es/s?k=La+sorprendente+verdad+sobre+que+nos+motiva+Daniel+Pink&tag=lainferencia-21',
    }
  },
  'edu-02': {
    libro: {
      titulo: 'Make It Stick', autor: 'Brown, Roediger y McDaniel',
      sinopsis: 'Este libro recopila la investigación de Robert Bjork sobre "dificultades deseables": por qué el espaciado, el intercalado y la práctica de recuperación cuestan más y enseñan mejor.',
      amazon: 'https://www.amazon.es/s?k=Make+It+Stick+Brown+Roediger+McDaniel&tag=lainferencia-21',
    },
    producto: {
      nombre: 'Flashcards en blanco',
      nota: 'La práctica de recuperación espaciada que documenta el estudio se aplica de forma más directa con tarjetas físicas que con subrayar apuntes.',
      amazon: 'https://www.amazon.es/s?k=flashcards+en+blanco+estudio&tag=lainferencia-21',
    }
  },
  'edu-03': {
    libro: {
      titulo: 'Make It Stick', autor: 'Brown, Roediger y McDaniel',
      sinopsis: 'El efecto protégé (aprender mejor cuando esperas tener que enseñarlo) es una de las estrategias de aprendizaje activo que este libro documenta con evidencia de aula real, no solo de laboratorio.',
      amazon: 'https://www.amazon.es/s?k=Make+It+Stick+Brown+Roediger+McDaniel&tag=lainferencia-21',
    }
  },
  'edu-04': {
    libro: {
      titulo: 'Mindset: la actitud del éxito', autor: 'Carol Dweck',
      sinopsis: 'El libro que originó todo el campo de investigación citado en este artículo: cómo la creencia sobre si la inteligencia puede cambiar predice, literalmente, cuánto se aprende.',
      amazon: 'https://www.amazon.es/dp/8416579164?tag=lainferencia-21',
    }
  },
  'edu-05': {
    libro: {
      titulo: 'Make It Stick', autor: 'Brown, Roediger y McDaniel',
      sinopsis: 'El estudio de Rohrer sobre bloqueo vs. intercalado que cita este artículo es uno de los pilares centrales de este libro sobre cómo aprender de forma duradera en lugar de solo sentirse dominado durante el estudio.',
      amazon: 'https://www.amazon.es/s?k=Make+It+Stick+Brown+Roediger+McDaniel&tag=lainferencia-21',
    }
  },
  'edu-06': {
    libro: {
      titulo: 'Pensar rápido, pensar despacio', autor: 'Daniel Kahneman',
      sinopsis: 'La fluidez de procesamiento (por qué un texto "fácil de leer" a veces se recuerda peor) es un mecanismo central del Sistema 1 que Kahneman explica con ejemplos muy parecidos al de esta investigación.',
      amazon: 'https://www.amazon.es/dp/8483068613?tag=lainferencia-21',
    }
  },

  // ── Trabajo ────────────────────────────────────────────────
  'tra-01': {
    libro: {
      titulo: 'The Progress Principle', autor: 'Teresa Amabile y Steven Kramer',
      sinopsis: 'Amabile y Kramer, autoras de la investigación citada en el artículo, documentan con miles de diarios de trabajo por qué el progreso percibido —no el salario ni los elogios— es el motivador más potente y más ignorado.',
      amazon: 'https://www.amazon.es/s?k=The+Progress+Principle+Amabile+Kramer&tag=lainferencia-21',
    }
  },
  'tra-02': {
    libro: {
      titulo: 'Esencialismo', autor: 'Greg McKeown',
      sinopsis: 'El job crafting (rediseñar tu puesto desde dentro) empieza por la misma pregunta que plantea McKeown: qué parte de tu trabajo importa de verdad y cuál solo parece urgente.',
      amazon: 'https://www.amazon.es/dp/8418053461?tag=lainferencia-21',
    }
  },
  'tra-03': {
    libro: {
      titulo: 'Trabajo profundo', autor: 'Cal Newport',
      sinopsis: 'Newport documenta por qué las reuniones y la oficina abierta son, literalmente, un diseño de entorno optimizado para la interrupción, y qué hacer para recuperar bloques reales de pensamiento.',
      amazon: 'https://www.amazon.es/dp/8411000516?tag=lainferencia-21',
    },
    producto: {
      nombre: 'Auriculares con cancelación de ruido',
      nota: 'Si el entorno físico es la causa del problema que describe el estudio, aislarte del ruido ambiental es la aplicación más directa e inmediata.',
      amazon: 'https://www.amazon.es/s?k=auriculares+cancelacion+de+ruido&tag=lainferencia-21',
    }
  },
  'tra-04': {
    libro: {
      titulo: 'Cuando el cuerpo dice no', autor: 'Gabor Maté',
      sinopsis: 'Maté conecta el estrés crónico sostenido —la base biológica del burnout que documenta Maslach— con cómo el cuerpo termina somatizando lo que la mente lleva tiempo ignorando.',
      amazon: 'https://www.amazon.es/dp/8484458296?tag=lainferencia-21',
    }
  },
  'tra-05': {
    libro: {
      titulo: 'La sorprendente verdad sobre qué nos motiva', autor: 'Daniel Pink',
      sinopsis: 'Pink construye su libro entero sobre el mismo hallazgo de Deci que cita este artículo: por qué las recompensas económicas externas pueden sustituir, y no sumar, a la motivación intrínseca.',
      amazon: 'https://www.amazon.es/s?k=La+sorprendente+verdad+sobre+que+nos+motiva+Daniel+Pink&tag=lainferencia-21',
    }
  },
  'tra-06': {
    libro: {
      titulo: 'Blindspot', autor: 'Mahzarin Banaji y Anthony Greenwald',
      sinopsis: 'Banaji y Greenwald, creadores del test de asociación implícita, explican cómo un sesgo del que ni siquiera eres consciente puede decidir si tu CV recibe una llamada, sin que nadie tenga intención de discriminar.',
      amazon: 'https://www.amazon.es/s?k=Blindspot+Banaji+Greenwald+sesgos+ocultos&tag=lainferencia-21',
    }
  },

  // ── Política ───────────────────────────────────────────────
  'pol-01': {
    libro: {
      titulo: 'La mente de los justos', autor: 'Jonathan Haidt',
      sinopsis: 'La metáfora del "perro emocional y su cola racional" que da título a este artículo es, literalmente, de Jonathan Haidt: por qué votamos primero con la intuición moral y razonamos después para justificarla.',
      amazon: 'https://www.amazon.es/s?k=La+mente+de+los+justos+Jonathan+Haidt&tag=lainferencia-21',
    }
  },
  'pol-02': {
    libro: {
      titulo: 'La mente de los justos', autor: 'Jonathan Haidt',
      sinopsis: 'Haidt explica por qué el cerebro políticamente comprometido procesa la información como un abogado defensor, no como un juez: busca argumentos para lo que ya cree, no la verdad.',
      amazon: 'https://www.amazon.es/s?k=La+mente+de+los+justos+Jonathan+Haidt&tag=lainferencia-21',
    }
  },
  'pol-03': {
    libro: {
      titulo: 'Why We\'re Polarized', autor: 'Ezra Klein',
      sinopsis: 'Klein documenta cómo el partido se convierte en identidad social antes que en conjunto de ideas, la razón por la que nos cae mal alguien de otro bando aunque pensemos parecido en el fondo.',
      amazon: 'https://www.amazon.es/s?k=Why+We+Are+Polarized+Ezra+Klein&tag=lainferencia-21',
    }
  },
  'pol-04': {
    libro: {
      titulo: 'La mente de los justos', autor: 'Jonathan Haidt',
      sinopsis: 'La teoría de las fundaciones morales de Haidt es la explicación más citada de por qué rasgos de personalidad estables predicen la ideología mejor que cualquier argumento coyuntural.',
      amazon: 'https://www.amazon.es/s?k=La+mente+de+los+justos+Jonathan+Haidt&tag=lainferencia-21',
    }
  },

  // ── Alimentación ───────────────────────────────────────────
  'ali-01': {
    libro: {
      titulo: 'Mindless Eating', autor: 'Brian Wansink',
      sinopsis: 'Wansink documentó con diarios alimentarios reales por qué comer en compañía alarga la comida y activa contagio de normas sociales, haciendo que comas casi el doble sin decidirlo conscientemente.',
      amazon: 'https://www.amazon.es/s?k=Mindless+Eating+Brian+Wansink&tag=lainferencia-21',
    }
  },
  'ali-02': {
    libro: {
      titulo: 'Mindless Eating', autor: 'Brian Wansink',
      sinopsis: 'El mismo investigador explica por qué el entorno y el estado emocional deciden cuánto y qué comes con más peso que la señal real de hambre, y cómo rediseñar ese entorno.',
      amazon: 'https://www.amazon.es/s?k=Mindless+Eating+Brian+Wansink&tag=lainferencia-21',
    }
  },
  'ali-03': {
    libro: {
      titulo: 'Comer Intuitivo', autor: 'Evelyn Tribole y Elyse Resch',
      sinopsis: 'El método que documentan Tribole y Resch es, en esencia, la respuesta práctica al hallazgo de este artículo: prohibirte un alimento dispara el deseo de comerlo; regular sin restringir lo desactiva.',
      amazon: 'https://www.amazon.es/s?k=Comer+Intuitivo+Tribole+Resch&tag=lainferencia-21',
    }
  },
  'ali-04': {
    libro: {
      titulo: 'Mindless Eating', autor: 'Brian Wansink',
      sinopsis: 'Este es exactamente el libro donde Wansink, autor del experimento de las cuatro raciones citado en el artículo, explica el resto de trucos visuales del entorno que deciden cuánto comes sin que lo notes.',
      amazon: 'https://www.amazon.es/s?k=Mindless+Eating+Brian+Wansink&tag=lainferencia-21',
    },
    producto: {
      nombre: 'Set de platos llanos de 20cm',
      nota: 'La aplicación más directa del propio estudio: reducir el tamaño del plato reduce la ración sin que sientas que comes menos.',
      amazon: 'https://www.amazon.es/s?k=set+platos+llanos+20cm&tag=lainferencia-21',
    }
  },

};

if (typeof module !== 'undefined') module.exports = RECOMENDACIONES;
if (typeof window !== 'undefined') window.RECOMENDACIONES = RECOMENDACIONES;
