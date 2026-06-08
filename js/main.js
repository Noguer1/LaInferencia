/* ── FORZAR INICIO EN TOP — evita que el navegador móvil restaure
   scroll de sesiones anteriores ─────────────────────────────── */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load', () => window.scrollTo(0, 0));

/* ── Compartir contenido — navigator.share con fallback a clipboard ── */
function shareContenido(title, text, url) {
  const fullUrl = url || window.location.href;
  if (navigator.share) {
    navigator.share({ title, text, url: fullUrl }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(fullUrl).then(() => {
      const tip = document.createElement('div');
      tip.textContent = '¡Enlace copiado!';
      tip.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0B132B;color:#fff;padding:0.6rem 1.2rem;border-radius:999px;font-size:0.82rem;font-weight:600;z-index:9999;pointer-events:none;';
      document.body.appendChild(tip);
      setTimeout(() => tip.remove(), 2000);
    });
  }
}

/* ── localStorage seguro — falla silenciosamente en modo incógnito o quota llena ── */
function lsSet(key, value) {
  try { localStorage.setItem(key, value); } catch (_) {}
}
function lsGet(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch (_) { return fallback; }
}

/* ── Focus trap para modales — accesibilidad WCAG ── */
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
function trapFocus(modal) {
  const els = () => Array.from(modal.querySelectorAll(FOCUSABLE)).filter(e => e.offsetParent !== null);
  function onKey(e) {
    if (e.key !== 'Tab') return;
    const focusable = els();
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
  }
  modal.addEventListener('keydown', onKey);
  return onKey; /* devuelve la función para poder removerla al cerrar */
}
function releaseFocus(modal, handler, restoreEl) {
  modal.removeEventListener('keydown', handler);
  if (restoreEl && typeof restoreEl.focus === 'function') restoreEl.focus();
}

const LIBRARY_ARTICLES = {
  economia: [
    {
      id: 'eco-01',
      title: 'Por qué pagamos más cuando el precio termina en ,99€',
      summary: 'El efecto ancla y el precio de imagen izquierda distorsionan la percepción de valor en cada decisión de compra.',
      sourceUrl: 'https://doi.org/10.1086/431213',
      sourceLabel: 'Thomas & Morwitz (2005) — Journal of Consumer Research',
      badge: 'Economía conductual',
      author: { name: 'Manoj Thomas', university: 'Cornell University', specialty: 'Psicología del Consumidor' },
      readingTime: '3 min',
      date: '2 de junio de 2026',
      intro: 'El precio de 9,99 € no es 10 € menos un céntimo. Es una trampa cognitiva documentada que explota la forma en que tu cerebro procesa los dígitos de izquierda a derecha.',
      sections: [
        {
          subtitle: 'El experimento de Thomas y Morwitz',
          paragraphs: [
            'En 2005, Manoj Thomas y Vicki Morwitz reclutaron a 540 adultos y les presentaron comparaciones de precios de productos del hogar. A un grupo se le mostraba la diferencia entre 5,00 $ y 4,00 $; al otro, entre 4,99 $ y 3,99 $. El ahorro real era idéntico en ambos casos: exactamente 1 $. Sin embargo, el segundo grupo percibió el descuento como significativamente mayor. No porque los números dijeran algo diferente, sino porque el dígito de la izquierda —el "4" frente al "3"— activó la sensación de haber cruzado una frontera de categoría de precio.',
            'En un segundo experimento con seguimiento ocular, confirmaron que los participantes fijaban la vista en el dígito izquierdo primero y dedicaban un 30% menos de tiempo a procesar el precio completo cuando terminaba en ,99. El cerebro tomaba una decisión antes de terminar de leer el número.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'El fenómeno se llama efecto de imagen izquierda o left-digit anchoring. El cerebro humano procesa los números de izquierda a derecha y codifica el valor global a partir del primer dígito que encuentra. Un precio de 3,99 € se almacena en memoria en la categoría mental de "los treses", no de "los cuatros", aunque la diferencia con 4,00 € sea de un solo céntimo.',
            'El efecto es más potente cuando el consumidor está bajo carga cognitiva —estresado, distraído o con prisa— porque el Sistema 1 de Kahneman (el rápido e intuitivo) toma el relevo sin esperar al Sistema 2. Es por eso que los precios ,99 están omnipresentes en supermercados y plataformas online pero rara vez en restaurantes de alta gama, donde la experiencia requiere calma y la señal de calidad se comunica precisamente prescindiendo de ese recurso.'
          ]
        }
      ],
      blockquote: { text: '«El primer dígito de un precio ancla la percepción de valor antes de que el cerebro procese el número completo.»', attribution: 'Manoj Thomas & Vicki Morwitz' },
      aplicacion: 'La próxima vez que veas un precio que termina en ,99 o ,95, escríbelo redondeado en un papel antes de decidir. Ese simple acto activa el procesamiento numérico correcto y neutraliza parcialmente el sesgo.'
    },
    {
      id: 'eco-02',
      title: 'El error que comete tu cerebro al evaluar riesgos financieros',
      summary: 'La teoría prospectiva de Kahneman y Tversky demuestra que el dolor de perder dinero es el doble de intenso que el placer de ganarlo.',
      sourceUrl: 'https://doi.org/10.2307/1914185',
      sourceLabel: 'Kahneman & Tversky (1979) — Econometrica',
      badge: 'Toma de decisiones',
      author: { name: 'Daniel Kahneman', university: 'Universidad de Princeton', specialty: 'Psicología Cognitiva y Economía Conductual' },
      readingTime: '4 min',
      date: '26 de mayo de 2026',
      intro: 'Perder 500 € no duele igual que ganarlos alegra. Duele entre 1,5 y 2,5 veces más. Este asimétrico fundamental explica por qué los inversores venden demasiado pronto las ganancias y aguantan demasiado tiempo las pérdidas.',
      sections: [
        {
          subtitle: 'El experimento de Kahneman y Tversky',
          paragraphs: [
            'En 1979, Daniel Kahneman y Amos Tversky presentaron a sus participantes una serie de elecciones entre apuestas con valores esperados matemáticamente idénticos. El hallazgo central: cuando las opciones se enmarcaban en términos de pérdidas, los participantes elegían la apuesta arriesgada para evitar la pérdida segura. Cuando se enmarcaban en términos de ganancias, preferían la ganancia segura. La lógica matemática era irrelevante; lo que mandaba era el marco.',
            'Para cuantificar la asimetría, construyeron la función de valor en forma de S: su pendiente es más pronunciada en la zona de pérdidas que en la de ganancias. Calcularon que perder 100 € produce un impacto emocional equivalente al que produciría ganar entre 150 € y 250 €. Esta relación de 1,5 a 2,5 es estable entre culturas y niveles de renta.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'La aversión a las pérdidas tiene una base neurobiológica sólida. La amígdala —el sistema de alarma del cerebro— se activa más intensamente ante la posibilidad de perder que ante la de ganar una cantidad equivalente. Esta asimetría es evolutivamente coherente: en entornos de escasez, una pérdida de recursos puede ser fatal; una ganancia equivalente, simplemente cómoda.',
            'Las consecuencias prácticas son profundas. El efecto dotación explica por qué valoramos más lo que ya poseemos que lo que podríamos obtener: venderlo activa la zona de pérdidas, que duele más de lo que alegra la posibilidad de comprarlo. Los inversores aguantan posiciones perdedoras durante meses esperando recuperar el punto de entrada —lo que los economistas llaman disposition effect— y venden las ganadoras antes de tiempo para "asegurar" la ganancia. En ambos casos, la lógica financiera cede ante la asimetría emocional documentada por Kahneman.'
          ]
        }
      ],
      blockquote: { text: '«Las pérdidas se sienten más grandes que las ganancias de igual magnitud. Eso no es irracionalidad: es la arquitectura de la mente humana.»', attribution: 'Daniel Kahneman' },
      aplicacion: 'Antes de revisar tu cartera o tomar una decisión financiera importante, escribe en papel qué perderías y qué ganarías con cada opción. Externalizar los números neutraliza parcialmente el peso emocional asimétrico de las pérdidas.',
      chart: {
        caption: 'Función de valor de la Teoría Prospectiva (Kahneman & Tversky, 1979). La curva desciende más bruscamente en pérdidas que asciende en ganancias de igual magnitud.',
        svg: `<svg viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Función de valor asimétrica: la pendiente de pérdidas es más pronunciada que la de ganancias">
  <defs>
    <linearGradient id="cg-gain" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10B981"/><stop offset="100%" stop-color="#059669" stop-opacity="0.6"/></linearGradient>
    <linearGradient id="cg-loss" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#EF4444" stop-opacity="0.6"/><stop offset="100%" stop-color="#DC2626"/></linearGradient>
  </defs>
  <!-- Ejes -->
  <line x1="20" y1="120" x2="320" y2="120" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.25"/>
  <line x1="170" y1="12" x2="170" y2="228" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.25"/>
  <!-- Etiquetas ejes -->
  <text x="322" y="124" font-size="9" fill="currentColor" opacity="0.5">resultado</text>
  <text x="174" y="11" font-size="9" fill="currentColor" opacity="0.5">valor</text>
  <text x="150" y="134" font-size="8" fill="currentColor" opacity="0.4">0</text>
  <!-- Zona ganancias label -->
  <text x="240" y="16" font-size="8.5" fill="#10B981" font-weight="600">Ganancias</text>
  <!-- Zona pérdidas label -->
  <text x="46" y="232" font-size="8.5" fill="#EF4444" font-weight="600">Pérdidas</text>
  <!-- Curva ganancias (cuadrante superior derecho) — cóncava, crece rápido luego se aplana -->
  <path d="M170,120 C195,100 220,82 240,72 C260,62 285,58 312,55" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Curva pérdidas (cuadrante inferior izquierdo) — convexa, pendiente más pronunciada -->
  <path d="M170,120 C145,148 118,168 96,182 C74,196 44,206 28,210" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Flechas indicadoras de asimetría -->
  <line x1="248" y1="120" x2="248" y2="72" stroke="#10B981" stroke-width="1" stroke-dasharray="3,2" stroke-opacity="0.6"/>
  <line x1="92" y1="120" x2="92" y2="182" stroke="#EF4444" stroke-width="1" stroke-dasharray="3,2" stroke-opacity="0.6"/>
  <text x="252" y="100" font-size="7.5" fill="#10B981" opacity="0.85">+ganancia</text>
  <text x="52" y="115" font-size="7.5" fill="#EF4444" opacity="0.85">−pérdida</text>
  <text x="54" y="125" font-size="7.5" fill="#EF4444" opacity="0.85">× 1,5–2,5</text>
</svg>`
      }
    },
    {
      id: 'eco-03',
      title: 'Por qué gastas más cuando no ves el dinero físico',
      summary: 'El dolor de pagar se atenúa drásticamente con tarjeta o pago digital, lo que dispara el gasto impulsivo de forma sistemática.',
      sourceUrl: 'https://doi.org/10.1023/A:1008196717017',
      sourceLabel: 'Prelec & Simester (2001) — Marketing Letters',
      badge: 'Neuroeconomía',
      author: { name: 'Drazen Prelec', university: 'MIT Sloan School of Management', specialty: 'Neuroeconomía y Comportamiento del Consumidor' },
      readingTime: '3 min',
      date: '19 de mayo de 2026',
      intro: 'Cuando pagas en efectivo, el cerebro activa la ínsula anterior —la región asociada al dolor físico. Con tarjeta, esa activación desaparece casi por completo. El resultado: gastas más, sin sentirlo.',
      sections: [
        {
          subtitle: 'El experimento de Prelec y Simester',
          paragraphs: [
            'En el MIT, Drazen Prelec y Duncan Simester realizaron una subasta de entradas para partidos de la NBA muy cotizados. Dividieron a los participantes en dos grupos: uno podía pujar solo en efectivo, el otro solo con tarjeta de crédito. El resultado fue contundente: el grupo de tarjeta pujó el doble que el grupo de efectivo por las mismas entradas. La disposición a pagar no dependía del valor del objeto, sino del método de pago.',
            'En estudios posteriores usando fMRI, el equipo confirmó que el acto de pagar en efectivo activa la ínsula anterior con una intensidad proporcional al importe pagado. El pago con tarjeta, en cambio, no muestra prácticamente activación en esa región. La tarjeta elimina el dolor de pagar eliminando la experiencia sensorial del intercambio.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'Prelec y Loewenstein lo denominaron desacoplamiento del pago: cuando el momento de consumo y el momento de pago se separan temporalmente —como ocurre con las tarjetas de crédito o las suscripciones mensuales— el cerebro trata el gasto como una abstracción futura y no como un coste real presente. La vigilancia del gasto se desactiva.',
            'Este mecanismo explica por qué los restaurantes que cobran al inicio (como los cruceros con todo incluido) generan mayor satisfacción en el consumo: el dolor del pago ya quedó atrás y disfrutar no activa ninguna señal de alarma. Las apps de delivery, las plataformas de streaming y los modelos de suscripción explotan este desacoplamiento de forma sistemática. El usuario percibe el servicio como "gratuito" en cada uso individual porque el momento del pago ya pasó —o todavía no ha llegado.'
          ]
        }
      ],
      blockquote: { text: '«El dinero físico hace que el coste psicológico de una compra sea real y presente. El pago digital lo convierte en una abstracción futura.»', attribution: 'Drazen Prelec' },
      aplicacion: 'Para compras no planificadas, oblígate a pagar en efectivo durante una semana. La incomodidad cognitiva que sientes al entregar los billetes es información valiosa sobre si la compra merece realmente ese coste.'
    },
    {
      id: 'eco-04',
      title: 'El efecto IKEA: por qué valoras más lo que construiste tú',
      summary: 'Invertir esfuerzo en algo infla artificialmente su valor percibido, incluso cuando el resultado es objetivamente inferior al de un experto.',
      sourceUrl: 'https://doi.org/10.1016/j.jcps.2011.08.002',
      sourceLabel: 'Norton, Mochon & Ariely (2012) — Journal of Consumer Psychology',
      badge: 'Psicología del consumidor',
      author: { name: 'Michael Norton', university: 'Harvard Business School', specialty: 'Comportamiento del consumidor y economía conductual' },
      readingTime: '3 min',
      date: '12 de mayo de 2026',
      intro: 'En 2012, Michael Norton y sus colegas pagaron a participantes para que montaran cajas de IKEA siguiendo las instrucciones. Al terminar, les preguntaron cuánto pagarían por ellas. El resultado fue desconcertante: valoraban sus propias cajas casi al mismo nivel que idénticas montadas por carpinteros expertos, y esperaban que otros hicieran lo mismo. Nadie más lo hizo. Esa asimetría tiene nombre y mecanismo.',
      sections: [
        {
          subtitle: 'Origami, LEGO y cajas: el esfuerzo como distorsionador del valor',
          paragraphs: [
            'Norton replicó el efecto en tres categorías de objetos: cajas de almacenaje, figuras de origami y modelos de LEGO. El patrón fue consistente: quien había construido el objeto pagaba entre tres y cinco veces más por él que los observadores externos. Más revelador aún: cuando los participantes construían objetos manifiestamente mal hechos —origamis torcidos, cajas con piezas que no encajaban bien—, los valoraban casi igual que los de calidad. El esfuerzo anulaba el juicio estético.',
            'En una variante, Norton comparó grupos según cuánto esfuerzo habían invertido: quien completaba el montaje completo valoraba el objeto significativamente más que quien solo hacía la mitad. Y en la condición más sorprendente: cuando las instrucciones eran confusas o incompletas —haciendo el proceso más frustrante—, la valoración subía todavía más. El dolor del esfuerzo no disuadía; amplificaba el amor por el resultado.'
          ]
        },
        {
          subtitle: 'El mecanismo: esfuerzo como proxy de valor y extensión del yo',
          paragraphs: [
            'El efecto opera por dos rutas paralelas. La primera es la justificación cognitiva: haber invertido tiempo y energía genera presión hacia la coherencia. Decir que el objeto no vale mucho equivale a reconocer que el esfuerzo fue en vano, y eso activa disonancia. La segunda ruta es la identidad: cuando construyes algo con tus manos, dejas una huella de ti mismo en él. No lo evalúas como un objeto externo, sino como una extensión tuya.',
            'Norton identifica el paralelo con lo que denomina "disonancia del creador": artistas, escritores y emprendedores sobrevaloran sistemáticamente sus obras frente a la audiencia objetiva. No es arrogancia —es biología. El cerebro no tiene acceso limpio al valor objetivo de lo que produce; solo tiene acceso al coste que le supuso producirlo, y ese coste se convierte en el proxy del valor.'
          ]
        }
      ],
      blockquote: { text: '«El esfuerzo no es solo el coste de crear algo: es la causa de que lo ames.»', attribution: 'Michael Norton' },
      aplicacion: 'Cuando evalúes un proyecto, idea o producto que tú mismo hayas desarrollado, busca deliberadamente el feedback de alguien que no haya participado en su creación. No para validarte, sino para calibrar: la diferencia entre lo que tú valoras y lo que ellos ven es la medida exacta del efecto IKEA distorsionando tu juicio.'
    },
    {
      id: 'eco-05',
      title: 'La paradoja de la elección: por qué más opciones te hacen decidir peor',
      summary: 'Multiplicar las alternativas no mejora las decisiones: las paraliza, aumenta el arrepentimiento y reduce la satisfacción, aunque elijas objetivamente bien.',
      sourceUrl: 'https://doi.org/10.1037/0022-3514.79.6.995',
      sourceLabel: 'Iyengar & Lepper (2000) — Journal of Personality and Social Psychology',
      badge: 'Economía conductual',
      author: { name: 'Barry Schwartz', university: 'Swarthmore College', specialty: 'Psicología de la decisión y bienestar subjetivo' },
      readingTime: '3 min',
      date: '5 de mayo de 2026',
      intro: 'En 2000, Sheena Iyengar y Mark Lepper montaron en un supermercado de California dos expositores de mermeladas artesanales: uno con 24 variedades, otro con 6. El de 24 atrajo a más curiosos —era visualmente más imponente—. Pero el de 6 vendió diez veces más. Esa asimetría entre atracción y conversión es uno de los hallazgos más citados en la psicología del comportamiento económico, y tiene consecuencias en casi todas las decisiones de tu vida.',
      sections: [
        {
          subtitle: 'La mermelada, el chocolate y el coste oculto de la abundancia',
          paragraphs: [
            'Iyengar y Lepper alternaron los expositores en distintos sábados para controlar el efecto de localización. El 60% de los clientes se detenía ante el de 24 variedades, pero solo el 3% compraba. Del de 6, se detenía el 40% —menos tráfico—, pero compraba el 30%. La diferencia en ventas fue de diez a uno. En economía estándar, más opciones deberían ser siempre mejor o neutro: nunca deberían perjudicar. Pero perjudicaban.',
            'En un experimento de laboratorio complementario, participantes que elegían un chocolate entre 6 reportaron mayor satisfacción que quienes elegían entre 30, aunque el chocolate seleccionado fuera el mismo. Los del grupo de 30 mostraron mayor arrepentimiento post-decisional, mayor probabilidad de desear haber elegido otro, y menor probabilidad de volver a comprar. Disfrutaban menos lo que habían elegido porque no podían dejar de pensar en lo que no habían elegido.'
          ]
        },
        {
          subtitle: 'Maximizadores y satisficers: dos formas de relacionarse con las opciones',
          paragraphs: [
            'Barry Schwartz formalizó el mecanismo en "The Paradox of Choice" (2004). La raíz del problema es el coste de oportunidad: cuando tienes 6 opciones, al elegir una renuncias a 5. Cuando tienes 24, renuncias a 23, y el cerebro no puede ignorar todas esas rutas no tomadas. La elección entre 24 alternativas requiere el doble de esfuerzo cognitivo y produce el doble de arrepentimiento, independientemente de la calidad del resultado.',
            'Schwartz introduce la distinción clave entre "maximizadores" (quienes buscan la mejor opción posible) y "satisficers" (quienes buscan una opción suficientemente buena). Los maximizadores sufren más con la abundancia: cuantas más opciones tienen, más probable es que se pregunten si eligieron la mejor. Los satisficers deciden antes, se arrepienten menos y reportan mayor bienestar, aunque sus elecciones objetivas sean a veces inferiores. El problema no es la inteligencia ni el criterio: es la estrategia de decisión.'
          ]
        }
      ],
      blockquote: { text: '«Aprender a elegir es difícil. Aprender a elegir bien es más difícil. Y aprender a elegir bien en un mundo de opciones ilimitadas es lo más difícil de todo.»', attribution: 'Barry Schwartz' },
      aplicacion: 'La próxima vez que enfrentes una decisión con muchas alternativas —plataformas, proveedores, candidatos, restaurantes—, impón deliberadamente una restricción previa: trabaja solo con un máximo de tres finalistas. Descartar primero, decidir después. La pérdida de calidad óptima es estadísticamente mínima; la ganancia en satisfacción y velocidad de decisión es significativa.',
      chart: {
        caption: 'Experimento de Iyengar & Lepper (2000). El expositor de 24 mermeladas atraía más visitantes, pero el de 6 convertía diez veces más en ventas.',
        svg: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparativa: 24 opciones atraen más visitantes pero venden 10 veces menos que 6 opciones">
  <defs>
    <linearGradient id="cg-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#1D4ED8"/></linearGradient>
    <linearGradient id="cg-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10B981"/><stop offset="100%" stop-color="#059669"/></linearGradient>
  </defs>
  <!-- Título columnas -->
  <text x="86" y="16" font-size="8.5" fill="currentColor" opacity="0.7" text-anchor="middle">24 opciones</text>
  <text x="234" y="16" font-size="8.5" fill="currentColor" opacity="0.7" text-anchor="middle">6 opciones</text>
  <!-- Barra: se detienen (60% vs 40%) -->
  <rect x="52" y="25" width="68" height="72" rx="4" fill="url(#cg-a)" opacity="0.85"/>
  <rect x="200" y="49" width="68" height="48" rx="4" fill="url(#cg-a)" opacity="0.85"/>
  <text x="86" y="21" font-size="20" fill="#2563EB" font-weight="700" text-anchor="middle" dy="24">60%</text>
  <text x="234" y="45" font-size="20" fill="#2563EB" font-weight="700" text-anchor="middle" dy="24">40%</text>
  <text x="86" y="108" font-size="7.5" fill="currentColor" opacity="0.55" text-anchor="middle">se detienen</text>
  <text x="234" y="108" font-size="7.5" fill="currentColor" opacity="0.55" text-anchor="middle">se detienen</text>
  <!-- Separador -->
  <line x1="24" y1="118" x2="296" y2="118" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.15"/>
  <!-- Barra: compran (3% vs 30%) -->
  <rect x="68" y="172" width="36" height="10" rx="3" fill="url(#cg-b)" opacity="0.9"/>
  <rect x="200" y="130" width="68" height="52" rx="4" fill="url(#cg-b)" opacity="0.9"/>
  <text x="86" y="196" font-size="14" fill="#10B981" font-weight="700" text-anchor="middle">3%</text>
  <text x="234" y="126" font-size="20" fill="#10B981" font-weight="700" text-anchor="middle" dy="24">30%</text>
  <text x="86" y="198" font-size="7.5" fill="currentColor" opacity="0.55" text-anchor="middle" dy="8">compran</text>
  <text x="234" y="193" font-size="7.5" fill="currentColor" opacity="0.55" text-anchor="middle">compran</text>
  <!-- Flecha diferencia -->
  <line x1="152" y1="158" x2="192" y2="145" stroke="#10B981" stroke-width="1.2" stroke-dasharray="3,2" stroke-opacity="0.7"/>
  <text x="158" y="165" font-size="7.5" fill="#10B981" font-weight="600">× 10</text>
</svg>`
      }
    }
  ],

  moda: [
    {
      id: 'mod-01',
      title: 'La ropa que llevas decide cómo piensas: el efecto de la cognición investida',
      summary: 'Ponerse una bata de médico o un traje formal no cambia solo cómo te ven los demás: cambia mediblemente cómo rinde tu cerebro.',
      sourceUrl: 'https://doi.org/10.1016/j.jesp.2012.01.001',
      sourceLabel: 'Adam & Galinsky (2012) — Journal of Experimental Social Psychology',
      badge: 'Cognición vestida',
      author: { name: 'Hajo Adam', university: 'Northwestern University', specialty: 'Psicología Social y Comportamiento Organizacional' },
      readingTime: '3 min',
      date: '2 de junio de 2026',
      intro: 'En 2012, Hajo Adam y Adam Galinsky demostraron en una serie de experimentos controlados que ponerse una bata blanca de laboratorio —idéntica en todos los casos— mejoraba el rendimiento en tareas de atención sostenida únicamente cuando se le decía al participante que era una "bata de médico". Cuando se describía como "bata de pintor", el efecto desaparecía.',
      sections: [
        {
          subtitle: 'El experimento de Adam y Galinsky',
          paragraphs: [
            'El diseño fue quirúrgico. Adam dividió a los participantes en tres condiciones: el primer grupo llevaba una bata blanca que se describía como "bata de médico"; el segundo llevaba la misma bata descrita como "bata de pintor"; el tercero simplemente veía la bata sobre una mesa sin ponérsela. Los tres grupos realizaron el mismo test de atención sostenida —la tarea de Stroop, que mide la capacidad de ignorar información irrelevante.',
            'Resultado: solo el grupo que vestía la bata de médico mostró una mejora significativa en precisión y menor número de errores. El grupo de la bata de pintor rindió igual que el grupo sin bata. La prenda era idéntica; el significado simbólico asignado era lo que cambiaba el cerebro. Ver la bata sin ponérsela tampoco producía ningún efecto.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'Adam acuñó el término enclothed cognition para describir la influencia que la ropa ejerce sobre los procesos psicológicos del que la lleva. El mecanismo requiere dos condiciones simultáneas: el contacto físico con la prenda y la activación del significado simbólico que el sujeto asocia a ella. Ninguna de las dos sola es suficiente.',
            'Cuando te pones ropa asociada a un rol —la bata del médico, el traje del negociador, el uniforme del deportista— activas en memoria las representaciones cognitivas de ese rol: sus atributos, sus valores, su nivel de alerta. Esas representaciones influyen en cómo procesas la información y cómo tomas decisiones. No es autosugestión vaga: es activación de esquemas cognitivos medible con herramientas de neuroimagen. La ropa es, en términos técnicos, un prime contextual de enorme potencia.'
          ]
        }
      ],
      blockquote: { text: '«La ropa no solo comunica quiénes somos a los demás. Le dice a nuestro cerebro quiénes debemos ser.»', attribution: 'Hajo Adam' },
      aplicacion: 'Antes de una tarea que requiera concentración o autoridad, vístete de forma acorde al rol que necesitas desempeñar, aunque estés en casa. No es vanidad: es activar las representaciones mentales asociadas a ese contexto.'
    },
    {
      id: 'mod-02',
      title: 'Por qué el lujo visible hace que te fíen menos',
      summary: 'Mostrar marcas de lujo en contextos competitivos activa en los observadores señales de alerta sobre fiabilidad e integridad.',
      sourceUrl: 'https://doi.org/10.1016/j.evolhumbehav.2011.03.001',
      sourceLabel: 'Nelissen & Meijers (2011) — Evolution and Human Behavior',
      badge: 'Señalización social',
      author: { name: 'Rob Nelissen', university: 'Universidad de Tilburg', specialty: 'Psicología Social y Evolución del Comportamiento' },
      readingTime: '3 min',
      date: '26 de mayo de 2026',
      intro: 'Las marcas de lujo visibles —logos grandes, accesorios reconocibles— generan en los observadores inferencias automáticas sobre estatus y recursos. Sin embargo, en contextos donde la confianza importa más que la dominancia, esas mismas señales disparan deducciones negativas sobre la calidez y la fiabilidad de quien las lleva.',
      sections: [
        {
          subtitle: 'El experimento de Nelissen y Meijers',
          paragraphs: [
            'En la Universidad de Tilburg, Rob Nelissen fotografió a actores con dos versiones de la misma vestimenta: una con logos visibles de marcas de lujo reconocidas (Lacoste, Tommy Hilfiger) y otra sin marca o con marcas desconocidas. Los observadores evaluaban a los sujetos en distintos contextos —entrevista de trabajo, recaudador de fondos para ONG, consulta médica.',
            'En la entrevista de trabajo, el candidato con marcas de lujo era contratado con mayor frecuencia y se le asignaban salarios un 9% más altos. Pero cuando el mismo actor aparecía como recaudador de fondos, los observadores confiaban menos en él, donaban cantidades menores y lo calificaban significativamente por debajo en calidez e integridad. El mismo logo que abría puertas en un contexto las cerraba en el otro.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'La percepción social opera a través de dos dimensiones fundamentales: competencia y calidez. Las marcas de lujo son señales de recursos y éxito, lo que activa inferencias de competencia. Pero en contextos donde la confianza es el capital central —medicina, trabajo social, negociaciones colaborativas— la señal de lujo activa también la sospecha de que quien las lleva prioriza su propio estatus sobre el bienestar colectivo.',
            'Desde la perspectiva evolutiva, los símbolos de estatus son señales de dominancia. En jerarquías competitivas, la dominancia es deseable. En contextos cooperativos, una señal de dominancia activa la desconfianza: ¿por qué alguien que claramente prioriza su estatus va a sacrificarse por mi bien? El observador no razona explícitamente esto; lo infiere en milisegundos a través de heurísticas automáticas que evolucionaron para detectar si el otro es aliado o competidor.'
          ]
        }
      ],
      blockquote: { text: '«El mismo símbolo de estatus que abre puertas en negociaciones de poder las cierra en contextos donde la confianza es el capital más valioso.»', attribution: 'Rob Nelissen' },
      aplicacion: 'Antes de una reunión importante, pregúntate qué quieres proyectar: competencia o confianza. Son señales vestimentarias distintas, a menudo incompatibles, y el contexto debe decidir cuál priorizar.'
    },
    {
      id: 'mod-03',
      title: 'El color de tu ropa altera cómo procesan tu mensaje los demás',
      summary: 'Los colores activan esquemas cognitivos automáticos que modulan la credibilidad, la agresividad percibida y la atracción interpersonal.',
      sourceUrl: 'https://doi.org/10.1037/0022-3514.95.5.1150',
      sourceLabel: 'Elliot & Niesta (2008) — Journal of Personality and Social Psychology',
      badge: 'Psicología del color',
      author: { name: 'Andrew Elliot', university: 'Universidad de Rochester', specialty: 'Psicología de la Motivación y el Color' },
      readingTime: '3 min',
      date: '19 de mayo de 2026',
      intro: 'El rojo no es solo un color. En una serie de seis experimentos, Elliot y Niesta demostraron que las mujeres vestidas de rojo eran valoradas consistentemente como más atractivas por los hombres —y que este efecto desaparecía cuando el color era azul, verde o gris, incluso con fotografías idénticas en todos los demás aspectos.',
      sections: [
        {
          subtitle: 'El experimento de Elliot y Niesta',
          paragraphs: [
            'La Universidad de Rochester diseñó seis experimentos con participantes de cinco países distintos —EE.UU., Reino Unido, Alemania, China e India— para descartar que el efecto fuera un artefacto cultural. En todos los casos, mostraron fotografías idénticas de mujeres enmarcadas o vestidas con diferentes colores. Los hombres calificaban consistentemente las fotos con rojo entre 1,2 y 1,5 puntos más altas en una escala de atractivo de 7 puntos que las mismas fotografías con otros colores.',
            'El efecto era exclusivo del juicio de atractivo: el rojo no influía en valoraciones de amabilidad, inteligencia o competencia. Y era exclusivo de los hombres heterosexuales: las mujeres evaluando a otras mujeres no mostraban el efecto. Esto sugería un mecanismo específico de señalización sexual, no una respuesta estética generalizada.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'En la mayoría de primates no humanos, el enrojecimiento de la piel durante el período fértil —en la zona genital, el pecho o el rostro— actúa como señal directa de receptividad sexual. Elliot argumenta que esta asociación rojo-señal-sexual está evolutivamente arraigada en el sistema visual humano con suficiente profundidad como para operar de forma automática, antes de cualquier procesamiento consciente.',
            'Lo más relevante para el comportamiento cotidiano es que el efecto ocurre aunque el observador no sea consciente de él. En los experimentos, ningún participante reportó espontáneamente que el color hubiera influido en su juicio. La inferencia opera por debajo del umbral de introspección. El color rojo en contextos deportivos funciona de forma similar pero en la dimensión de dominancia: equipos con uniforme rojo ganan más frecuentemente en deportes de contacto directo, como documentaron Hill y Barton en 2005 analizando los Juegos Olímpicos de Atenas.'
          ]
        }
      ],
      blockquote: { text: '«El color activa esquemas cognitivos automáticos antes de que ningún proceso consciente tenga tiempo de mediar.»', attribution: 'Andrew Elliot' },
      aplicacion: 'La próxima vez que elijas qué ponerte para un evento social o profesional, considera el color no como estética sino como señal: ¿qué esquema cognitivo quieres activar en quien te observe?'
    },
    {
      id: 'mod-04',
      title: 'El efecto Diderot: por qué comprar una cosa te hace querer cambiarlo todo',
      summary: 'Adquirir un objeto nuevo genera una presión psicológica en cadena para actualizar todo lo que lo rodea, convirtiendo una compra en un ciclo de consumo difícil de detener.',
      sourceUrl: 'https://doi.org/10.1086/209631',
      sourceLabel: 'McCracken (1988) — Culture and Consumption · Journal of Consumer Research',
      badge: 'Psicología del consumo',
      author: { name: 'Grant McCracken', university: 'Royal Ontario Museum / MIT Media Lab', specialty: 'Cultura del consumo y antropología económica' },
      readingTime: '3 min',
      date: '12 de mayo de 2026',
      intro: 'En 1769, el filósofo Denis Diderot recibió como regalo una suntuosa bata de seda escarlata. Poco después, escribió un ensayo titulado "Arrepentimiento por mi vieja bata de casa". El problema: la nueva bata hacía que todo lo demás en su estudio —la silla desgastada, el escritorio irregular, las estanterías viejas— pareciera indigno de ella. Fue reemplazando cada objeto uno a uno hasta quedar, según sus palabras, "esclavo de una bata". Dos siglos después, el antropólogo Grant McCracken formalizó este mecanismo y le puso nombre.',
      sections: [
        {
          subtitle: 'El mecanismo: coherencia simbólica y presión de identidad',
          paragraphs: [
            'McCracken identificó que los objetos no son solo útiles: son marcadores de identidad y de pertenencia cultural. Cada persona construye lo que McCracken llama un "conjunto de complementariedad Diderot": una colección de objetos que comparten un sistema simbólico coherente y que comunican una identidad unificada. Cuando un objeto nuevo rompe esa coherencia —porque es demasiado bueno, demasiado distinto o demasiado nuevo— genera tensión. El cerebro necesita restaurar la coherencia.',
            'El efecto se activa especialmente con adquisiciones de estatus (un coche nuevo, un bolso de diseño, un apartamento reformado): la nueva referencia simbólica eleva el estándar implícito del resto. Lo que antes parecía suficiente ahora parece desajustado. La compra no cierra un deseo; abre una cadena de necesidades percibidas que pueden ser ilimitadas.'
          ]
        },
        {
          subtitle: 'Por qué los marketers lo conocen y nosotros no',
          paragraphs: [
            'La industria del consumo explota el efecto Diderot de forma sistemática. Los fabricantes de cocinas de lujo saben que quien compra una encimera de mármol actualizará los electrodomésticos, la iluminación y probablemente el suelo. Los vendedores de coches premium calculan cuántos años tarda el comprador en sentir que su garaje, su ropa y sus vacaciones necesitan "alcanzar" al coche. La venta del objeto ancla es solo el primer dominó.',
            'El efecto tiene mayor intensidad en las "compras aspiracionales" —aquellas que el comprador hace para señalar a quién quiere ser— que en las compras funcionales. Una aspiración satisfecha no se asienta: eleva el estándar del entorno inmediato, que ahora parece no estar a la altura. El resultado es lo que los economistas del bienestar llaman "adaptación hedónica asimétrica": el placer del objeto nuevo se desvanece rápido, pero la presión de actualizar lo que lo rodea persiste.'
          ]
        }
      ],
      blockquote: { text: '«Los objetos no son solo posesiones: son declaraciones sobre quiénes somos, y la coherencia entre ellos es una presión silenciosa pero constante.»', attribution: 'Grant McCracken' },
      aplicacion: 'Antes de una compra importante, hazte esta pregunta: "¿Qué más me hará sentir que necesito reemplazar?" Si la respuesta incluye más de dos cosas que ya tienes, el efecto Diderot ya está activo. El coste real de la compra es la suma de todos los objetos que te hará sentir que necesitas cambiar después.'
    },
    {
      id: 'mod-05',
      title: 'El uniforme de los que deciden mucho: por qué Einstein, Obama y Zuckerberg visten siempre lo mismo',
      summary: 'Eliminar las decisiones triviales del día preserva la capacidad cognitiva para las que realmente importan. La ropa es el laboratorio más visible de este principio.',
      sourceUrl: 'https://doi.org/10.1111/j.1467-9280.2008.02250.x',
      sourceLabel: 'Baumeister et al. (2008) — Psychological Science · Muraven & Baumeister (2000)',
      badge: 'Autorregulación cognitiva',
      author: { name: 'Roy Baumeister', university: 'University of Queensland / Florida State University', specialty: 'Autocontrol, fuerza de voluntad y toma de decisiones' },
      readingTime: '3 min',
      date: '5 de mayo de 2026',
      intro: 'Barack Obama tomaba miles de decisiones al día como presidente. Por eso tomó una menos: dejó de decidir qué ponerse. "Solo visto trajes grises o azules —explicó en 2012—. Intento reducir las decisiones. No quiero tomar decisiones sobre lo que como o lo que llevo porque tengo demasiadas otras decisiones que tomar." Einstein, Steve Jobs y Mark Zuckerberg practicaron variantes del mismo principio. No es excentricidad: es neurociencia aplicada.',
      sections: [
        {
          subtitle: 'La fatiga de decisión: el recurso que se agota con cada elección',
          paragraphs: [
            'Roy Baumeister y sus colegas documentaron a lo largo de múltiples estudios un fenómeno que denominaron "ego depletion" o agotamiento del yo: la capacidad de tomar decisiones de calidad es un recurso finito que se gasta con cada elección realizada, desde lo trivial a lo crucial. En el estudio más conocido, participantes que tomaban muchas decisiones de consumo previas tomaban después decisiones financieras peor que grupos de control —pedían préstamos más irracionales, aceptaban condiciones menos favorables.',
            'El mecanismo biológico involucra glucosa y actividad en la corteza prefrontal: tomar decisiones consume recursos metabólicos reales. El juez que falla a las 3 de la tarde tiene el mismo cociente intelectual que a las 10 de la mañana, pero su corteza prefrontal —la región de la deliberación consciente— está más agotada. Cada "¿qué me pongo hoy?" usa exactamente el mismo recurso que "¿contrato a este candidato?"'
          ]
        },
        {
          subtitle: 'El uniforme como estrategia, no como pereza',
          paragraphs: [
            'La investigación de Baumeister sobre "decision ecology" muestra que el entorno de decisiones importa tanto como la calidad del decisor. Simplificar los dominios de baja importancia no es delegación ni pereza intelectual: es una estrategia de gestión de recursos cognitivos con evidencia sólida. El cerebro no distingue la complejidad cualitativa de una decisión; solo registra el coste de procesarla.',
            'Los "uniformes" cognitivos no se limitan a la ropa. La misma lógica aplica a fijar un menú semanal (Obama también lo hacía), a tener una rutina matutina inamovible, a usar plantillas para decisiones recurrentes. Cada automatismo libera capacidad para la deliberación en dominios donde la calidad de la decisión realmente importa. El diseño del entorno cotidiano es, en este sentido, la forma más infrautilizada de gestión del rendimiento.'
          ]
        }
      ],
      blockquote: { text: '«La fuerza de voluntad no es un rasgo de carácter: es un recurso biológico que se agota. Gestionarla bien es la diferencia entre decidir y solo reaccionar.»', attribution: 'Roy Baumeister' },
      aplicacion: 'Identifica las tres decisiones triviales que repites cada mañana (qué desayunar, qué ponerte, con qué empezar el día de trabajo) y automatízalas esta semana. Fija una respuesta estándar y no la cuestionas. Observa si la calidad de tus decisiones importantes mejora en las horas siguientes.'
    }
  ],

  derecho: [
    {
      id: 'der-01',
      title: 'Por qué la memoria de los testigos oculares es la prueba más peligrosa del sistema judicial',
      summary: 'Más del 70% de las condenas erróneas en EE.UU. demostradas por prueba de ADN incluyeron testimonio ocular como prueba principal.',
      sourceUrl: 'https://doi.org/10.1111/j.1745-6924.2006.tb00060.x',
      sourceLabel: 'Wells et al. (2006) — Psychological Science in the Public Interest',
      badge: 'Psicología Forense',
      author: { name: 'Elizabeth Loftus', university: 'Universidad de California, Irvine', specialty: 'Psicología Cognitiva y Forense' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'El Innocence Project ha documentado más de 375 condenas erróneas revertidas por prueba de ADN en Estados Unidos desde 1989. En más del 69% de esos casos, el testimonio ocular fue la prueba principal. No porque los testigos mintieran: sino porque la memoria es maleable, reconstructiva y extraordinariamente sensible a la sugestión post-evento.',
      sections: [
        {
          subtitle: 'El experimento de Loftus: plantar un recuerdo falso en adultos sanos',
          paragraphs: [
            'En 1995, Elizabeth Loftus y Jacqueline Pickrell reclutaron a 24 adultos y les entregaron un cuadernillo con cuatro episodios de su infancia, supuestamente confirmados por sus familias. Tres eran reales. El cuarto era un evento completamente fabricado: haberse perdido en un centro comercial a los cinco años y ser rescatado por un desconocido. Tras dos o tres entrevistas espaciadas en dos semanas, el 25% de los participantes no solo aceptó el recuerdo falso como propio, sino que empezó a añadir detalles que nadie les había dado: el color de la camisa del desconocido, el ruido del centro comercial, la expresión de su madre al encontrarlos.',
            'Un experimento posterior demostró que bastaba con sugerir que el participante había visto a Bugs Bunny en Disneyland —lo cual es imposible, ya que Bugs Bunny es un personaje de Warner Bros— para que el 36% de los sujetos "recordara" haberlo visto durante una supuesta visita al parque.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'La memoria no funciona como una grabación que se reproduce. Es un proceso reconstructivo: cada vez que recordamos algo, reactivamos la huella de memoria y la volvemos a almacenar, pero esta vez incorporando el contexto del presente —las preguntas que nos han hecho, las cosas que hemos leído después, las expectativas de quien nos pregunta. El proceso se llama reconsolidación, y tiene una consecuencia radical: recordar es siempre, en algún grado, reescribir.',
            'La sugestión post-evento funciona porque la información nueva se integra en la huella mnémica original sin que el sujeto sea capaz de distinguir qué vio realmente y qué le fue introducido después. La certeza subjetiva —la sensación de "yo lo vi con mis propios ojos"— no tiene ninguna correlación fiable con la precisión del recuerdo. En entornos judiciales, esta disociación entre confianza del testigo y exactitud del testimonio es particularmente peligrosa, porque los jurados otorgan más credibilidad a los testigos que recuerdan con mayor seguridad.'
          ]
        }
      ],
      blockquote: { text: '«Un testigo que cree con absoluta certeza estar recordando algo puede estar, sin saberlo, recitando una memoria implantada por las preguntas del investigador.»', attribution: 'Elizabeth Loftus' },
      aplicacion: 'Cuando alguien te cuente un hecho del pasado con total seguridad, recuerda que la certeza subjetiva no es indicador de precisión. La memoria más vívida puede ser la más modificada.'
    },
    {
      id: 'der-02',
      title: 'El efecto del lenguaje en los veredictos: cómo las palabras del fiscal deciden la pena',
      summary: 'La formulación lingüística de los hechos —no solo su contenido— altera sistemáticamente las sentencias que los jurados consideran apropiadas.',
      sourceUrl: 'https://doi.org/10.1016/S0022-5371(74)80011-3',
      sourceLabel: 'Loftus & Palmer (1974) — Journal of Verbal Learning and Verbal Behavior',
      badge: 'Lingüística forense',
      author: { name: 'Elizabeth Loftus', university: 'Universidad de California, Irvine', specialty: 'Psicología Cognitiva y Forense' },
      readingTime: '3 min',
      date: '26 de mayo de 2026',
      intro: 'Cuando los participantes de un experimento veían el mismo vídeo de un accidente de coche pero se les preguntaba con el verbo "chocaron" en lugar de "se tocaron", estimaban velocidades más altas, recordaban daños que no existían y asignaban más culpabilidad al conductor. El verbo —no el hecho— decidía el recuerdo.',
      sections: [
        {
          subtitle: 'El experimento de Loftus y Palmer',
          paragraphs: [
            'En 1974, Loftus y Palmer mostraron a 45 estudiantes universitarios siete clips de vídeo de accidentes de tráfico reales. Después, les pidieron que estimaran la velocidad de los coches usando cinco verbos distintos distribuidos aleatoriamente entre grupos: "smashed" (chocaron violentamente), "collided" (colisionaron), "bumped" (golpearon), "hit" (impactaron) y "contacted" (se tocaron). Los que oyeron "smashed" estimaron una velocidad media de 40,8 millas por hora. Los que oyeron "contacted" estimaron 31,8 millas. El mismo vídeo, diferencia de 9 millas/hora.',
            'Una semana después, el equipo llamó a los mismos participantes y les preguntó si recordaban haber visto cristales rotos en el vídeo. No había cristales en ninguno de los clips. El 32% del grupo que oyó "smashed" dijo que sí los había visto. Solo el 14% del grupo con "hit" lo afirmó. El grupo de "contacted": ninguno. Un solo verbo había implantado un detalle falso en la memoria de un tercio de los participantes durante siete días.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'El verbo no describe solo la acción: activa un esquema cognitivo completo asociado a esa palabra. "Smashed" activa el esquema "accidente grave", que en la memoria semántica va acompañado de cristales rotos, alta velocidad, daños severos. Cuando se le pide al cerebro que reconstruya el recuerdo del vídeo, este esquema compite con la huella mnémica real y, en muchos casos, la contamina retroactivamente.',
            'Las implicaciones legales son directas. Los protocolos de entrevista policial en Reino Unido, Australia y muchos estados de EE.UU. fueron reformados tras los trabajos de Loftus para eliminar verbos valorativos y preguntas que sugieran la respuesta esperada. La entrevista cognitiva, diseñada con base en estos hallazgos, instruye a los agentes para que usen preguntas abiertas y neutrales, y para que nunca confirmen ni contradigan ningún detalle del testigo, porque cualquier retroalimentación contamina irremediablemente la memoria para interrogatorios posteriores.'
          ]
        }
      ],
      blockquote: { text: '«Una sola palabra puede plantar en la memoria de un testigo un detalle que nunca existió, y ese testigo lo defenderá con convicción absoluta.»', attribution: 'Elizabeth Loftus' },
      aplicacion: 'Presta atención a cómo está formulada la pregunta cuando alguien —un jefe, un familiar, un medio de comunicación— te pide que recuerdes o evalúes un hecho. El marco lingüístico de la pregunta está pre-construyendo tu respuesta.'
    },
    {
      id: 'der-03',
      title: 'El juez hambriento: cómo el estado físico decide el veredicto',
      summary: 'Un análisis de 1.112 resoluciones judiciales reveló que los jueces concedían libertad condicional en el 65% de los casos tras comer, y en casi el 0% justo antes del descanso.',
      sourceUrl: 'https://doi.org/10.1073/pnas.1018033108',
      sourceLabel: 'Danziger, Levav & Avnaim-Pesso (2011) — PNAS',
      badge: 'Psicología forense',
      author: { name: 'Shai Danziger', university: 'Universidad de Tel Aviv', specialty: 'Toma de decisiones judicial y sesgos cognitivos' },
      readingTime: '3 min',
      date: '12 de mayo de 2026',
      intro: 'Durante diez meses, Shai Danziger y sus colegas siguieron a ocho jueces israelíes que celebraban juntas de libertad condicional para presos. Analizaron 1.112 resoluciones y buscaron el factor que mejor predecía si el preso saldría libre. Esperaban encontrar la gravedad del delito, el historial del recluso o el tipo de crimen. Encontraron otra cosa: la hora del día y cuánto tiempo había pasado desde el último descanso del juez.',
      sections: [
        {
          subtitle: 'Los datos: un patrón que no debería existir',
          paragraphs: [
            'Los resultados fueron estadísticamente inequívocos. Al inicio de la jornada, justo después del desayuno, los jueces concedían libertad condicional en aproximadamente el 65% de los casos. A medida que avanzaba la mañana —sin que el tipo de caso cambiara estadísticamente—, la tasa de concesión caía de forma gradual hasta rozar el 0% inmediatamente antes del descanso de media mañana. Después del descanso, la tasa volvía a subir al 65%. El mismo patrón se repetía antes y después del almuerzo. El predictor más potente del resultado no era el expediente del preso: era el reloj.',
            'Los investigadores descartaron las explicaciones alternativas una a una: los casos no estaban ordenados por gravedad ni por tipo de delito, el orden de presentación era prácticamente aleatorio, y los jueces no compartían casos entre sí de formas que pudieran crear sesgo sistemático. La explicación más parsimoniosa era también la más incómoda: el agotamiento cognitivo lleva al cerebro a elegir la opción más segura, que en una decisión judicial es siempre denegar. Conceder la libertad requiere justificación activa; denegar, no.'
          ]
        },
        {
          subtitle: 'El mecanismo: fatiga cognitiva y default conservador',
          paragraphs: [
            'La "status quo bias" —la tendencia a favorecer la opción de no cambiar nada— se intensifica con el agotamiento. Cuando el cerebro no tiene suficiente glucosa o capacidad cognitiva disponible para deliberar activamente, colapsa a la opción de menor esfuerzo. En un tribunal de libertad condicional, la opción por defecto es siempre mantener al preso en prisión: no requiere argumentación activa, no produce consecuencias inmediatas para el juez si es equivocada. Conceder la libertad, en cambio, requiere justificación consciente y asume el riesgo de reincidencia.',
            'El hallazgo tiene consecuencias directas sobre la arquitectura del sistema judicial: el momento del día en que se programa una vista influye en el resultado de formas que el derecho no contempla. Y el problema no es corrupción ni mala fe: es biología. El juez no sabe que está decidiendo peor; subjetivamente, cree que está aplicando criterios objetivos. La fatiga cognitiva es, en este sentido, el sesgo más difícil de detectar porque es invisible para quien lo padece.'
          ]
        }
      ],
      blockquote: { text: '«Los factores extralegales —el hambre, el cansancio, la hora del día— afectan las decisiones judiciales tanto como los factores legales que se supone que deberían ser los únicos relevantes.»', attribution: 'Shai Danziger' },
      aplicacion: 'Las decisiones importantes —laborales, médicas, legales, económicas— nunca deberían tomarse en los últimos 30 minutos antes de una pausa o al final de una sesión larga. Si eres quien decide, programa los asuntos más complejos en las primeras horas. Si eres quien es evaluado —en una entrevista, una negociación, un examen oral—, intenta que te asignen un turno temprano.'
    },
    {
      id: 'der-04',
      title: 'La confesión falsa: por qué personas inocentes confiesan crímenes que no cometieron',
      summary: 'Las técnicas de interrogatorio psicológico pueden llevar a personas completamente inocentes a confesar crímenes inventados, y esas confesiones convencen después a los jurados.',
      sourceUrl: 'https://doi.org/10.1111/j.1467-9280.1996.tb00344.x',
      sourceLabel: 'Kassin & Kiechel (1996) — Psychological Science',
      badge: 'Psicología del interrogatorio',
      author: { name: 'Saul Kassin', university: 'Williams College / John Jay College', specialty: 'Psicología forense y credibilidad del testimonio' },
      readingTime: '4 min',
      date: '5 de mayo de 2026',
      intro: 'El Innocence Project ha documentado más de 375 condenas erróneas revertidas por ADN en Estados Unidos. En el 29% de esos casos, el condenado había firmado una confesión. No porque mintiera estratégicamente: en la mayoría de los casos, la persona genuinamente llegó a creer, aunque fuera momentáneamente, que había cometido el crimen del que se le acusaba. Saul Kassin lleva tres décadas estudiando cómo ocurre esto.',
      sections: [
        {
          subtitle: 'El experimento: colapsar en 60 segundos',
          paragraphs: [
            'En 1996, Kassin y Kiechel montaron un experimento aparentemente sencillo: reclutaron a participantes para una tarea de mecanografía y les advirtieron explícitamente que no pulsaran la tecla Alt, porque causaría un "fallo del sistema" que haría perder todos los datos. Poco después, el ordenador se "bloqueaba" y el experimentador acusaba al participante de haber pulsado la tecla prohibida. Nadie lo había hecho.',
            'En la condición de alta presión —con un cómplice que "testificaba" haber visto al participante pulsar la tecla—, el 69% de los participantes acabó firmando una declaración de culpabilidad. Muchos no solo firmaron: empezaron a elaborar recuerdos de haber pulsado la tecla, añadiendo detalles que no podían existir. En 60 segundos de presión social moderada, la realidad percibida había sido reescrita. En interrogatorios reales, las sesiones duran horas.'
          ]
        },
        {
          subtitle: 'La técnica Reid y la psicología de la capitulación',
          paragraphs: [
            'La técnica de interrogatorio más extendida en EE.UU. —el método Reid— usa estrategias de presión psicológica documentadas: minimización (sugerir que el crimen fue un accidente o que las consecuencias legales serán menores si confiesas), maximización (exagerar la solidez de las pruebas, aunque no existan), y privación de sueño, que es legal en muchos estados. Estas técnicas no están diseñadas para extraer la verdad: están diseñadas para obtener una confesión.',
            'El problema es que el cerebro humano, bajo presión prolongada, puede llegar a dudar de sus propios recuerdos. Este fenómeno —las "confesiones internalizadas"— ocurre cuando el sospechoso no solo firma para escapar de la situación, sino que llega genuinamente a creer que hizo algo que no hizo. Las personas más vulnerables son adolescentes, personas con discapacidad cognitiva, y cualquiera que lleve muchas horas sin dormir. La presión social puede reescribir la memoria con suficiente intensidad.'
          ]
        }
      ],
      blockquote: { text: '«La gente asume que nadie confesaría un crimen que no ha cometido. Esa suposición es el mayor aliado de las confesiones falsas.»', attribution: 'Saul Kassin' },
      aplicacion: 'Si alguna vez eres interrogado por cualquier autoridad —incluso en un contexto laboral o disciplinario—, recuerda que tienes derecho a solicitar asesoramiento antes de responder. El instinto de cooperar para demostrar inocencia es completamente comprensible y psicológicamente natural. También es el mecanismo que más frecuentemente produce confesiones falsas.'
    }
  ],

  deporte: [
    {
      id: 'dep-01',
      title: 'El ritual antes de tirar el penalti que aumenta la precisión un 17%',
      summary: 'Los rituales pre-rendimiento no son superstición: reducen la ansiedad cognitiva y estabilizan el control motor en situaciones de alta presión.',
      sourceUrl: 'https://doi.org/10.1177/0956797610372631',
      sourceLabel: 'Damisch et al. (2010) — Psychological Science',
      badge: 'Psicología del deporte',
      author: { name: 'Lysann Damisch', university: 'Universidad de Colonia', specialty: 'Psicología Social y Rendimiento' },
      readingTime: '3 min',
      date: '2 de junio de 2026',
      intro: 'En 2010, Lysann Damisch y sus colegas de la Universidad de Colonia demostraron en una serie de experimentos que activar la superstición de un participante —diciéndole "buena suerte" o devolviéndole su "pelota de la suerte"— mejoraba su rendimiento motor en un 17% de media. El mecanismo no era la magia: era la autoeficacia.',
      sections: [
        {
          subtitle: 'El experimento de la bola de la suerte',
          paragraphs: [
            'El equipo de Lysann Damisch no se limitó a la teoría. Pusieron a prueba a un grupo de participantes en una tarea de precisión motora (golf). A la mitad se les dijo simplemente: "Aquí tienes la bola". A la otra mitad se les entregó diciendo: "Esta ha sido la bola de la suerte hasta ahora". El simple hecho de creer que contaban con un factor a favor hizo que este segundo grupo metiera un 17% más de lanzamientos.',
            'En un segundo experimento, los participantes podían traer su propio amuleto personal. A la mitad se le devolvió el objeto al inicio de la prueba; a la otra mitad se lo retiraron con una excusa. El grupo que tenía su amuleto consigo no solo rindió mejor en la tarea motora, sino que reportó una percepción de autoeficacia significativamente más alta antes de comenzar. La confianza era el puente entre el objeto y el rendimiento.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'La clave no es la magia, es la autoeficacia. El concepto, acuñado por Albert Bandura, describe la creencia de una persona en su propia capacidad para ejecutar con éxito un comportamiento específico. Cuando crees que tienes un factor a favor —un ritual, un amuleto, una frase— tu cerebro reduce la actividad en las áreas prefrontales asociadas a la vigilancia del error y la anticipación del fracaso. Hay menos ruido mental.',
            'Con menos interferencia cognitiva, los circuitos motores que almacenan los automatismos —el tiro, el swing, la ejecución técnica— funcionan sin la supervisión consciente que los degrada. Es exactamente el mecanismo inverso al "choke under pressure" de Beilock: donde el exceso de supervisión consciente destruye el rendimiento experto, el ritual lo protege creando un estado mental de confianza que mantiene el Sistema 2 fuera del proceso motor.'
          ]
        }
      ],
      blockquote: { text: '«Los rituales funcionan porque el cerebro que cree que tiene ventaja ejecuta de forma diferente al cerebro que duda.»', attribution: 'Lysann Damisch' },
      aplicacion: 'Diseña un ritual de preparación breve y repetible para las situaciones de alta presión en tu vida —antes de una presentación, un examen o una conversación difícil. La consistencia del ritual es la señal que le dice a tu cerebro: este es el modo de rendimiento.'
    },
    {
      id: 'dep-02',
      title: 'Por qué los atletas de élite cometen más errores cuando piensan demasiado',
      summary: 'El fenómeno "choke under pressure" ocurre cuando el pensamiento consciente interfiere con patrones motores automatizados que funcionan mejor sin supervisión.',
      sourceUrl: 'https://doi.org/10.1037/0096-3445.130.4.701',
      sourceLabel: 'Beilock & Carr (2001) — Journal of Experimental Psychology: General',
      badge: 'Neurociencia del rendimiento',
      author: { name: 'Sian Beilock', university: 'University of Chicago', specialty: 'Neurociencia Cognitiva y Rendimiento Bajo Presión' },
      readingTime: '4 min',
      date: '26 de mayo de 2026',
      intro: 'Los golfistas expertos cometen más errores cuando se les pide que piensen conscientemente en su swing. Los novatos, en cambio, mejoran con exactamente las mismas instrucciones. La pericia crea automatismos que se destruyen en el momento en que el sistema consciente intenta supervisarlos.',
      sections: [
        {
          subtitle: 'El experimento de Beilock y Carr',
          paragraphs: [
            'En la Universidad de Michigan, Sian Beilock y Thomas Carr dividieron a golfistas en dos grupos según su nivel: expertos (más de cuatro años de práctica regular) y novatos (sin experiencia previa). Ambos grupos puttearon bajo dos condiciones: en la primera, debían concentrarse en un aspecto específico de su técnica —el punto exacto donde el palo contacta la bola—; en la segunda, realizaban una tarea de escucha paralela —detectar un tono específico entre una secuencia de sonidos— que les distraía del movimiento.',
            'Los novatos mejoraron cuando se concentraban en la técnica: la instrucción explícita les daba estructura. Los expertos empeoraron. Y cuando se les distraía con la tarea auditiva —liberando sus circuitos de movimiento de la supervisión consciente— los expertos rendían significativamente mejor. La atención consciente sobre el propio movimiento era el problema, no la solución.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'La expertise motora implica un proceso de procedurización: las habilidades aprendidas conscientemente migran desde la memoria de trabajo —que es lenta, secuencial y limitada a unos pocos elementos simultáneos— hacia la memoria procedimental, que es rápida, paralela y opera fuera de la conciencia. Un golfista experto no "piensa" en su swing; lo ejecuta. Y ese sistema procedimental funciona mejor sin supervisión.',
            'El "choke under pressure" ocurre cuando la ansiedad aumenta la autoevaluación: el deportista empieza a monitorizarse, y ese monitoreo reactiva el procesamiento explícito que interfiere con el procedimental. La trampa es que cuanto más rico es el sistema de memoria de trabajo del atleta —es decir, cuanto más inteligente y analítico— más capacidad tiene para interferir en sus propios automatismos. Beilock documentó que los atletas con mayor capacidad de memoria de trabajo son, paradójicamente, los más vulnerables al choke en situaciones de alta presión.'
          ]
        }
      ],
      blockquote: { text: '«La presión hace que los expertos regresen al modo de procesamiento del principiante. Y eso es precisamente lo que los destruye.»', attribution: 'Sian Beilock' },
      aplicacion: 'En situaciones de alta presión donde eres experto, enfoca tu atención en un punto externo —el resultado, no el proceso— para dejar que los automatismos actúen sin interferencia consciente. El ruido mental es el mayor adversario del rendimiento experto.'
    },
    {
      id: 'dep-03',
      title: 'El poder del diálogo interno: cómo la voz en tu cabeza decide el rendimiento',
      summary: 'El lenguaje que usas contigo mismo durante un esfuerzo —específico, técnico o motivacional según el momento— mejora el rendimiento de forma objetivamente medible.',
      sourceUrl: 'https://doi.org/10.1177/1745691611413136',
      sourceLabel: 'Hatzigeorgiadis et al. (2011) — Perspectives on Psychological Science',
      badge: 'Psicología del rendimiento',
      author: { name: 'Antonis Hatzigeorgiadis', university: 'Universidad de Tesalia (Grecia)', specialty: 'Psicología del deporte y autorregulación cognitiva' },
      readingTime: '3 min',
      date: '12 de mayo de 2026',
      intro: 'En 2011, Antonis Hatzigeorgiadis y su equipo publicaron un metaanálisis de 32 estudios controlados sobre self-talk —el diálogo interno durante el rendimiento deportivo— que acumulaba datos de más de 600 participantes. La conclusión fue clara y cuantificable: hablar con uno mismo durante el esfuerzo mejora el rendimiento. Pero con un matiz que lo cambia todo: el tipo de diálogo importa tanto como la cantidad.',
      sections: [
        {
          subtitle: 'Instruccional vs. motivacional: dos funciones distintas para dos situaciones distintas',
          paragraphs: [
            'El metaanálisis de Hatzigeorgiadis distinguió dos categorías de self-talk con efectos diferenciados. El diálogo instruccional —frases técnicas como "dobla las rodillas", "extiende el brazo", "cadencia constante"— mejoraba especialmente las tareas de precisión motora fina: tiros libres, golpes de tenis, habilidades técnicas que requieren control detallado. El diálogo motivacional —"¡puedo hacerlo!", "un paso más", "fuerte"— era más eficaz en tareas de resistencia y de máximo esfuerzo, donde el factor limitante es psicológico más que técnico.',
            'El estudio también reveló que la especificidad del diálogo importa más que su positividad. "¡Ánimo!" es menos efectivo que "mantén los codos pegados". El cerebro necesita información procesable, no solo energía emocional. Las frases vagas generan activación; las frases específicas generan dirección. En los estudios donde los participantes diseñaban ellos mismos sus frases —en lugar de usar las que el investigador les asignaba—, los efectos eran significativamente mayores.'
          ]
        },
        {
          subtitle: 'El mecanismo: atención, esquemas y autoeficacia',
          paragraphs: [
            'El self-talk mejora el rendimiento por tres rutas simultáneas. Primero, dirige la atención hacia los aspectos relevantes de la tarea y aleja las distracciones externas e internas. Segundo, activa los esquemas motores correctos: nombrar una acción técnica en voz baja o internamente es un prime que facilita su ejecución. Tercero, incrementa la autoeficacia —la creencia de que puedes ejecutar con éxito—, que Bandura demostró que es un predictor independiente del rendimiento.',
            'Una variante especialmente bien documentada es el self-talk en segunda persona: "tú puedes hacerlo" en lugar de "yo puedo hacerlo". Varios estudios muestran que hablarse en segunda o tercera persona reduce la activación del circuito de autocrítica y de amenaza al ego, produciendo un estado más estable y menos cargado emocionalmente durante el esfuerzo. Es la misma lógica que hace más fácil dar buenos consejos a un amigo que aplicarlos a uno mismo.'
          ]
        }
      ],
      blockquote: { text: '«El diálogo interno no es superstición deportiva: es un sistema de regulación cognitiva con mecanismos neurológicos precisos y efectos medibles.»', attribution: 'Antonis Hatzigeorgiadis' },
      aplicacion: 'Para tu próxima situación de rendimiento —deportiva, profesional o social—, diseña dos frases específicas antes de empezar: una técnica (algo concreto sobre cómo ejecutar) y una motivacional (algo sobre por qué puedes). Escríbelas. Practícalas. Úsalas en los 30 segundos previos al momento de máxima exigencia, no después de que ya hayas fallado.'
    },
    {
      id: 'dep-04',
      title: 'La visualización mental: el entrenamiento que ocurre solo en tu cabeza',
      summary: 'Ensayar mentalmente un movimiento activa los mismos circuitos neurales que ejecutarlo físicamente. Un metaanálisis cuantifica en qué porcentaje mejora el rendimiento sin tocar nada.',
      sourceUrl: 'https://doi.org/10.1037/0021-9010.79.4.481',
      sourceLabel: 'Driskell, Copper & Moran (1994) — Journal of Applied Psychology',
      badge: 'Neurociencia del rendimiento',
      author: { name: 'James Driskell', university: 'Florida Maxima Corp / Naval Air Warfare Center', specialty: 'Psicología del rendimiento y entrenamiento cognitivo' },
      readingTime: '3 min',
      date: '5 de mayo de 2026',
      intro: 'Los pianistas que practican mentalmente —sin tocar el teclado— activan las mismas regiones motoras que los que practican físicamente. Los cirujanos que visualizan un procedimiento antes de operar cometen menos errores. Los atletas olímpicos que más tiempo dedican a la visualización son, consistentemente, los que mejor rinden bajo presión. Driskell y sus colegas cuantificaron este fenómeno en un metaanálisis de 35 estudios: la práctica mental sola produce dos tercios de los beneficios de la práctica física, sin mover un músculo.',
      sections: [
        {
          subtitle: 'El metaanálisis: números que sorprenden',
          paragraphs: [
            'Driskell, Copper y Moran analizaron 35 estudios controlados con más de 3.000 participantes que practicaban tareas motoras, cognitivas o de rendimiento bajo alguna modalidad de práctica mental. Los resultados cuantificaron el efecto: comparado con ninguna práctica, la práctica mental sola mejoraba el rendimiento en un 66% de lo que lograba la práctica física. La combinación de ambas era la mejor condición, pero la práctica mental por sí sola producía ganancias reales y estadísticamente significativas en comparación con grupos de control sin práctica.',
            'El metaanálisis también identificó los moderadores: la visualización es más efectiva para tareas cognitivamente complejas que para las puramente físicas y de fuerza. Funciona mejor en expertos que en principiantes —porque tienen una representación mental más precisa del movimiento correcto—. Y los beneficios son mayores cuando la visualización se realiza en tiempo real (no acelerada) y en primera persona (vista desde los propios ojos, no como espectador).'
          ]
        },
        {
          subtitle: 'El mecanismo: la realidad funcional de lo imaginado',
          paragraphs: [
            'El cerebro no puede distinguir perfectamente entre una acción imaginada con alta fidelidad y una acción ejecutada realmente. Los estudios de neuroimagen muestran que la visualización motora activa la corteza premotora, el área motora suplementaria y el cerebelo —exactamente las mismas áreas que se activan durante el movimiento físico—. La diferencia está en la intensidad de activación, no en los circuitos implicados. La imaginación motora es una ejecución atenuada.',
            'Desde esta perspectiva, cada repetición mental fortalece las conexiones sinápticas involucradas en el movimiento, aunque el músculo no se mueva. Por eso los experimentos con pacientes en rehabilitación muestran que la visualización activa preserva la representación cortical del movimiento durante períodos de inmovilización. El cerebro práctica aunque el cuerpo no pueda. Y esas prácticas se acumulan.'
          ]
        }
      ],
      blockquote: { text: '«La mente puede practicar lo que el cuerpo aún no puede ejecutar. Eso no es una metáfora: es neurofisiología.»', attribution: 'James Driskell' },
      aplicacion: 'Antes de una situación de rendimiento importante, dedica 10 minutos a una visualización en primera persona y en tiempo real: ve todo lo que verías, siente las sensaciones físicas, imagina los sonidos del entorno. Incluye también cómo gestionas un contratiempo y te recuperas. La visualización que solo imagina el éxito es menos efectiva que la que también entrena la respuesta al error.'
    }
  ],

  arte: [
    {
      id: 'art-01',
      title: 'La psicología detrás de por qué algunas obras de arte te generan euforia física',
      summary: 'El síndrome de Stendhal no es metáfora: la exposición a arte de alta densidad emocional activa los mismos circuitos de recompensa que el orgasmo o la música.',
      sourceUrl: 'https://www.nature.com/articles/nn.2726',
      sourceLabel: 'Salimpoor et al. (2011) — Nature Neuroscience',
      badge: 'Neuroestética',
      author: { name: 'Valorie Salimpoor', university: 'McGill University', specialty: 'Neurociencia Cognitiva y Respuesta Estética' },
      readingTime: '3 min',
      date: '2 de junio de 2026',
      intro: 'El escalofrío físico ante una obra de arte —o ante el momento cumbre de una pieza musical— tiene un nombre técnico: frisson. Y en 2011, Valorie Salimpoor demostró mediante PET y fMRI que ese escalofrío coincide con la liberación de dopamina en el núcleo accumbens: el mismo circuito activado por la cocaína, el sexo o la comida.',
      sections: [
        {
          subtitle: 'El experimento de Salimpoor',
          paragraphs: [
            'McGill University, 2011. Ocho participantes que reportaban experimentar escalofríos físicos de forma consistente con determinadas piezas musicales fueron sometidos a escáneres de PET y fMRI de forma simultánea mientras escuchaban sus selecciones personales. La combinación de ambas técnicas permitió medir tanto la liberación real de dopamina como el flujo sanguíneo cerebral con resolución temporal alta.',
            'Durante los momentos de máxima intensidad emocional —los picos que producían el escalofrío— se registró un aumento del 6 al 9% en la liberación de dopamina en el núcleo accumbens y en el caudado. Pero el hallazgo más sorprendente fue que la dopamina se liberaba en dos fases: primero en el caudado, durante la anticipación de los 15 segundos previos al clímax musical; después en el núcleo accumbens, durante el clímax mismo. El cerebro no solo recompensa la experiencia: recompensa también la predicción correcta de que algo intenso está por llegar.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'La música explota el sistema de predicción-recompensa del cerebro de una forma que ningún otro estímulo hace con la misma eficacia. El cerebro construye expectativas sobre qué nota, qué ritmo o qué cambio armónico viene a continuación. Cuando esa expectativa se cumple de una forma inesperadamente satisfactoria —o cuando se viola de una manera que retroactivamente tiene sentido— el sistema dopaminérgico se dispara.',
            'Lo que distingue al frisson de otras respuestas de recompensa es su naturaleza abstracta. La dopamina ante la comida o el sexo responde a la satisfacción de una necesidad biológica. La dopamina ante la música o el arte responde a la resolución de un patrón puramente cognitivo. Salimpoor argumenta que esto convierte la experiencia estética en una forma de cognición de alto orden: el cerebro se recompensa a sí mismo por procesar con éxito estructuras complejas. No consume el mundo; lo comprende.'
          ]
        }
      ],
      blockquote: { text: '«El cerebro trata la belleza extrema como una recompensa de supervivencia. El arte que produce escalofríos está explotando la misma maquinaria que nos mantuvo vivos como especie.»', attribution: 'Valorie Salimpoor' },
      aplicacion: 'La próxima vez que una obra, pieza musical o imagen te provoque una reacción física, presta atención al momento exacto en que ocurre. Ese instante revela algo sobre los patrones de expectativa y resolución que tu cerebro ha construido a lo largo de tu vida.'
    },
    {
      id: 'art-02',
      title: 'Por qué el arte ambiguo activa más el cerebro que el arte figurativo',
      summary: 'La incertidumbre visual fuerza al cerebro a generar múltiples hipótesis simultáneas, lo que maximiza la activación de redes neurales y la experiencia estética.',
      sourceUrl: 'https://doi.org/10.3389/fnhum.2012.00001',
      sourceLabel: 'Vessel, Starr & Rubin (2012) — Frontiers in Human Neuroscience',
      badge: 'Neuroestética',
      author: { name: 'Edward Vessel', university: 'Max Planck Institute', specialty: 'Percepción Visual y Respuesta Estética' },
      readingTime: '3 min',
      date: '26 de mayo de 2026',
      intro: 'Las obras que no se dejan descifrar fácilmente generan mayor activación cerebral que las que se entienden al instante. El cerebro, ante la ambigüedad, no se rinde: multiplica sus hipótesis interpretativas, y ese proceso de búsqueda activa sin resolución es precisamente lo que maximiza la experiencia estética.',
      sections: [
        {
          subtitle: 'El experimento de Vessel, Starr y Rubin',
          paragraphs: [
            'En el Max Planck Institute de Leipzig, Edward Vessel y sus colegas escanearon a 16 participantes mientras visualizaban 109 obras de arte de estilos y épocas muy distintos. Los participantes evaluaban cada obra en una escala del 1 al 4: desde "no me mueve en absoluto" hasta "me ha afectado profundamente". Los investigadores compararon la activación cerebral en los dos extremos de esa escala.',
            'Las obras calificadas como "profundamente conmovedoras" activaban una red específica que no se activaba ante las obras meramente "bellas": la red de modo por defecto (DMN), que normalmente se suprime durante tareas cognitivas activas. Esta red se asocia con el pensamiento autorreferencial, la memoria autobiográfica y la cognición social. Las obras que "hablaban" al sujeto eran las que forzaban al cerebro a referenciarse a sí mismo.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'La diferencia entre "creo que es una obra hermosa" y "esta obra me habla" no es de grado sino de naturaleza neurológica. La primera es una evaluación estética externa; la segunda implica la activación del sistema que el cerebro usa para pensar sobre sí mismo. El arte que resulta profundamente movedor fuerza una comparación activa entre lo que se percibe y la propia historia, los propios valores, las propias memorias.',
            'La ambigüedad visual o narrativa es el detonador de este proceso porque una obra inmediatamente comprensible no requiere esfuerzo interpretativo: el cerebro la clasifica y pasa adelante. Una obra ambigua mantiene el sistema de generación de hipótesis activo de forma sostenida, y ese estado de indeterminación activa la búsqueda autorreferencial. El espectador pregunta "¿qué significa esto?" y, en el proceso, pregunta también "¿qué significa para mí?" Esa segunda pregunta es la que activa la DMN y produce la experiencia de ser conmovido.'
          ]
        }
      ],
      blockquote: { text: '«El arte que más nos afecta es el que mantiene al cerebro en un estado permanente de pregunta sin respuesta definitiva.»', attribution: 'Edward Vessel' },
      aplicacion: 'Exponte deliberadamente a obras que no entiendas de inmediato. La incomodidad de la ambigüedad no es un defecto de la obra: es la señal de que tu cerebro está trabajando en un modo de alta intensidad cognitiva.'
    },
    {
      id: 'art-03',
      title: 'La regla pico-final: por qué el último acorde importa más que toda la sinfonía',
      summary: 'Tu cerebro no evalúa una experiencia por su promedio: la juzga por su momento de mayor intensidad y por cómo termina. La duración, sorprendentemente, importa muy poco.',
      sourceUrl: 'https://doi.org/10.1037/0033-2909.117.1.34',
      sourceLabel: 'Kahneman, Fredrickson, Schreiber & Redelmeier (1993) — Psychological Science',
      badge: 'Psicología de la experiencia',
      author: { name: 'Daniel Kahneman', university: 'Universidad de Princeton', specialty: 'Psicología Cognitiva y Economía Conductual' },
      readingTime: '3 min',
      date: '12 de mayo de 2026',
      intro: 'En 1993, Kahneman y sus colegas realizaron un experimento que debería obligar a replantear cómo diseñamos cualquier experiencia: los conciertos, las presentaciones, los viajes, las reuniones. Pidieron a pacientes que sometieran su mano al agua fría en dos condiciones diferentes. En una, aguantaban 60 segundos a una temperatura desagradable. En otra, aguantaban esos mismos 60 segundos más 30 adicionales de agua ligeramente menos fría. La segunda condición era objetivamente peor —más tiempo de incomodidad—. Pero era la que los pacientes preferían repetir.',
      sections: [
        {
          subtitle: 'El yo recordador y el yo experiencial: dos sistemas en conflicto',
          paragraphs: [
            'El experimento del agua fría ilustra la distinción que Kahneman consideraba central en su investigación posterior: la diferencia entre el "yo experiencial" —el que vive el momento presente— y el "yo recordador" —el que evalúa la experiencia en retrospectiva y toma decisiones basándose en ese recuerdo—. El yo recordador no hace la media: aplica la regla pico-final. Evalúa la experiencia por su intensidad máxima y por cómo terminó. La duración apenas cuenta.',
            'Esta asimetría tiene consecuencias masivas para el arte y el diseño de experiencias. Un concierto que termina con la canción más emotiva del repertorio se recuerda mejor que uno con un promedio ligeramente superior pero un final discreto. Una exposición de arte que termina en una sala de obras menores produce un recuerdo más negativo que una que termina en la pieza más impactante, aunque el contenido total sea idéntico. El creador que entiende esto no diseña experiencias planas de buena calidad constante: diseña picos y finales.'
          ]
        },
        {
          subtitle: 'La neglect de duración y el diseño de lo memorable',
          paragraphs: [
            'La "neglect de duración" —la insensibilidad del yo recordador a cuánto dura una experiencia— tiene implicaciones contraintuitivas. Una conferencia de 45 minutos con un cierre brillante se recuerda mejor que una de 60 minutos con el mismo contenido pero un final mediocre. Un álbum musical que termina con la canción más poderosa construye una memoria más positiva del conjunto. Los directores de teatro clásico intuían esto: la última escena no es una mera conclusión, es la única parte que el público lleva a casa.',
            'El efecto también explica fenómenos aparentemente irracionales en la experiencia artística: por qué un film con un final sorprendente se recuerda mejor que uno con una narrativa más consistente pero un desenlace predecible; por qué la última nota de un solo de guitarra puede redimir o destruir lo que vino antes. No es capricho estético: es la arquitectura mnemónica del yo recordador aplicada al arte.'
          ]
        }
      ],
      blockquote: { text: '«Las personas no eligen entre experiencias: eligen entre recuerdos de experiencias. Y el yo recordador ignora la duración de forma casi total.»', attribution: 'Daniel Kahneman' },
      aplicacion: 'Diseña el final de tus experiencias más importantes —presentaciones, reuniones, citas, proyectos— con la misma atención que dedicas al contenido central. Los últimos tres minutos de cualquier interacción tienen un peso desproporcionado en cómo será recordada. La impresión final no cierra la experiencia: la define.'
    },
    {
      id: 'art-04',
      title: 'La paradoja de la autenticidad: por qué un Picasso falso e idéntico vale cero',
      summary: 'Cuando sabemos que algo es una falsificación perfecta, lo valoramos y sentimos de forma radicalmente diferente aunque sea indistinguible del original. El origen importa más que la experiencia.',
      sourceUrl: 'https://doi.org/10.1017/S0140525X09990409',
      sourceLabel: 'Bloom (2010) — How Pleasure Works · Behavioral and Brain Sciences',
      badge: 'Psicología del arte y la autenticidad',
      author: { name: 'Paul Bloom', university: 'Yale University / University of Toronto', specialty: 'Psicología cognitiva del placer y la moral' },
      readingTime: '3 min',
      date: '5 de mayo de 2026',
      intro: 'Imagina que tienes delante dos cuadros absolutamente indistinguibles: pigmentos idénticos, técnica idéntica, dimensiones idénticas. Uno es un Picasso original. El otro es una falsificación perfecta realizada por el mejor imitador del mundo. ¿Cuál disfrutas más? La respuesta parece obvia, pero el hecho de que lo sea revela algo profundo y extraño sobre cómo el cerebro procesa el arte —y prácticamente cualquier otra cosa que valore.',
      sections: [
        {
          subtitle: 'El esencialismo psicológico: la historia como parte del objeto',
          paragraphs: [
            'Paul Bloom propone que los humanos somos "esencialistas" por defecto: creemos que los objetos contienen algo de la "esencia" de quien los creó, de su historia y de su origen, y que esa esencia invisible pero real forma parte de su valor. No es una creencia consciente ni una posición filosófica: es una inferencia automática que opera antes de que cualquier razonamiento consciente tenga lugar. Por eso el cepillo de dientes de una celebrity se subasta por miles de euros mientras el mismo producto en el supermercado cuesta un euro.',
            'En experimentos con niños, Bloom y sus colegas demostraron que incluso los preescolares de tres años resisten la idea de que una copia perfecta de su objeto favorito sea idéntica al original. Cuando se les propone hacer una copia exacta de su peluche preferido y destruir el original, los niños rechazan el intercambio aunque la copia sea molecularmente idéntica. La historia del objeto —que fue "el mío"— es irreemplazable.'
          ]
        },
        {
          subtitle: 'Cómo el origen cambia la experiencia sensorial real',
          paragraphs: [
            'Lo más sorprendente de la investigación de Bloom es que el conocimiento del origen no solo cambia la valoración cognitiva: cambia la experiencia sensorial real. En estudios de neuroimagen, contemplar una obra de arte que el participante cree que es original activa circuitos de recompensa con más intensidad que contemplar la misma obra cuando se le dice que es una copia, aunque visualmente sean indistinguibles. El cerebro no está solo razonando sobre el valor: está procesando la experiencia estética de forma diferente según la historia del objeto.',
            'Este efecto —que Bloom llama "pensamiento mágico adulto"— opera en dominios muy alejados del arte. Explica por qué las réplicas de ropa de lujo no producen la misma satisfacción que los originales aunque nadie pueda distinguirlas. Por qué las casas donde vivieron personajes históricos se valoran más que edificios idénticos. Por qué los autógrafos de músicos fallecidos tienen un valor que los de músicos vivos de igual talento no alcanzan. La autenticidad no es solo una propiedad del objeto: es una propiedad de la relación entre el objeto y su historia.'
          ]
        }
      ],
      blockquote: { text: '«El placer que obtenemos de algo no depende solo de lo que es, sino de lo que creemos que es. El origen invisible de un objeto cambia la experiencia visible que produce.»', attribution: 'Paul Bloom' },
      aplicacion: 'La próxima vez que evalúes algo —una obra de arte, un producto, una idea, el trabajo de alguien—, hazte esta pregunta: "¿Valoraría esto igual si no supiera quién lo hizo?" Si la respuesta es no, parte de tu evaluación está siendo determinada por la historia y el origen, no por las cualidades observables. Puede ser legítimo. Pero merece ser consciente.'
    }
  ],

  tecnologia: [
    {
      id: 'tec-01',
      title: 'Por qué el scroll infinito está diseñado para secuestrar tu dopamina',
      summary: 'El diseño de refuerzo variable en redes sociales replica el mismo mecanismo neurológico de las máquinas tragaperras para maximizar el tiempo de uso.',
      sourceUrl: 'https://doi.org/10.1177/1461444819876980',
      sourceLabel: 'Panova & Carbonell (2018) — New Media & Society · Skinner (1938)',
      badge: 'Psicología del diseño',
      author: { name: 'Tristan Harris', university: 'Stanford University (Persuasive Tech Lab)', specialty: 'Diseño Persuasivo y Ética Tecnológica' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'El feed de Instagram no tiene fondo. El de TikTok tampoco. Eso no es un accidente técnico: es una decisión de diseño deliberada basada en la psicología del refuerzo variable de B.F. Skinner. La incertidumbre de si el próximo contenido será relevante o no es el mecanismo exacto que hace que las palomas de Skinner sigan picando sin parar.',
      sections: [
        {
          subtitle: 'El experimento de Skinner aplicado al diseño digital',
          paragraphs: [
            'En los años 50, B.F. Skinner colocó palomas en cajas con una palanca. Cuando la palanca daba comida en cada quinta pulsación (refuerzo de ratio fijo), las palomas pulsaban de forma regular y paraban cuando estaban saciadas. Cuando la palanca daba comida de forma aleatoria —a veces a la tercera pulsación, a veces a la décima, a veces a la vigésima— las palomas no paraban nunca. Seguían pulsando obsesivamente incluso cuando habían comido. La incertidumbre sobre cuándo llegaría la recompensa era más poderosa que la recompensa misma.',
            'Tristan Harris, ex diseñador de Google y fundador del Center for Humane Technology, documentó cómo el equipo de Instagram restructuró deliberadamente su algoritmo en 2012 para abandonar el feed cronológico —que era predecible— y adoptar un feed curado algorítmicamente, que es impredecible. El gesto de deslizar el dedo hacia abajo en la pantalla y esperar a que cargue el contenido es, en términos conductuales, exactamente el mismo que el de la paloma pulsando la palanca.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'Los programas de refuerzo de ratio variable producen las tasas de respuesta más altas y más resistentes a la extinción de todos los esquemas de condicionamiento conocidos. La razón es neurobiológica: la dopamina no se libera principalmente ante la recompensa, sino ante la anticipación incierta de la recompensa. Los estudios de Schultz (1997) con primates demostraron que las neuronas dopaminérgicas responden con más intensidad a la señal que predice una recompensa posible que a la recompensa misma cuando ya es segura.',
            'El scroll infinito explota esto de dos formas simultáneas: elimina el punto de parada natural (no hay página siguiente, no hay fin visible) y mantiene la incertidumbre sobre qué aparecerá a continuación. Cada deslizamiento es una tirada de tragaperras. El "like" inesperado, el comentario sorpresivo, el vídeo que resulta ser exactamente lo que buscabas: son los pellets de Skinner. Y como en las máquinas tragaperras, el sistema está diseñado para que el intervalo entre recompensas sea suficientemente variable para mantener la conducta sin ser tan largo como para provocar abandono.'
          ]
        }
      ],
      blockquote: { text: '«No estamos compitiendo con otras apps. Estamos compitiendo con el sueño, la intimidad y la conversación en persona.»', attribution: 'Tristan Harris' },
      aplicacion: 'Desactiva el scroll infinito donde puedas (algunas plataformas lo permiten en configuración). Cuando no puedas, pon un temporizador antes de abrir la app. El simple acto de marcar un límite temporal activa el control ejecutivo prefrontal y reduce el consumo pasivo.'
    },
    {
      id: 'tec-02',
      title: 'Cómo las notificaciones fragmentan tu concentración durante 23 minutos por interrupción',
      summary: 'Una sola notificación, aunque no se atienda, rompe el estado de flujo cognitivo y requiere una media de 23 minutos para recuperarlo completamente.',
      sourceUrl: 'https://dl.acm.org/doi/10.1145/1357054.1357072',
      sourceLabel: 'Mark, Gudith & Klocke (2008) — CHI Conference on Human Factors',
      badge: 'Cognición y tecnología',
      author: { name: 'Gloria Mark', university: 'UC Irvine', specialty: 'Informática y Comportamiento Humano' },
      readingTime: '3 min',
      date: '26 de mayo de 2026',
      intro: 'Gloria Mark y su equipo de la Universidad de California Irvine cronometraron durante años el comportamiento real de trabajadores de oficina. Su hallazgo más citado: después de una interrupción, el trabajador necesita una media de 23 minutos y 15 segundos para recuperar el nivel de concentración previo. Y recibe una media de 87 interrupciones al día.',
      sections: [
        {
          subtitle: 'El experimento de Gloria Mark',
          paragraphs: [
            'El equipo de UC Irvine siguió a 36 trabajadores de oficina durante más de 1.000 horas a lo largo de varios años, registrando cada interrupción mediante observación directa y registros de actividad en ordenador. Cada interrupción fue catalogada por tipo —iniciada por tecnología, por colegas o por el propio trabajador— y se midió el tiempo exacto hasta que el trabajador regresaba a la tarea original. El resultado fue 23 minutos y 15 segundos de media.',
            'Un hallazgo secundario fue igual de relevante: los trabajadores que eran interrumpidos frecuentemente no tardaban más en completar su trabajo —compensaban trabajando más rápido— pero reportaban niveles significativamente más altos de estrés, frustración y carga mental percibida. En estudios posteriores, Mark utilizó sensores de conductancia galvánica de la piel para medir el estrés fisiológico en tiempo real, y documentó que los picos de estrés coincidían exactamente con los momentos de revisión del correo electrónico.'
          ]
        },
        {
          subtitle: 'El mecanismo psicológico',
          paragraphs: [
            'La investigadora Sophie Leroy acuñó el concepto de residuo atencional para explicar por qué la recuperación no es instantánea: cuando cambias de tarea, una parte de los recursos cognitivos continúa procesando la tarea anterior durante un período que puede durar entre 3 y 25 minutos, dependiendo de la complejidad y del grado de completitud de la tarea interrumpida. Durante ese tiempo, la nueva tarea se ejecuta con menos recursos disponibles.',
            'Para tareas de alta complejidad cognitiva —escritura, programación, análisis, diseño— el coste es especialmente alto porque estas tareas requieren mantener activo en memoria de trabajo un modelo contextual complejo: qué se está haciendo, por qué, qué se ha decidido ya y qué queda por resolver. Construir ese modelo lleva tiempo. Destruirlo —mediante una interrupción— es instantáneo. Las notificaciones de las apps explotan exactamente esta asimetría: interrumpir es gratuito para quien interrumpe; reconstruir la concentración tiene un coste real y medible para quien es interrumpido.'
          ]
        }
      ],
      blockquote: { text: '«El mayor coste de las notificaciones no es el tiempo que tardas en leerlas. Es el tiempo que tarda tu cerebro en volver a donde estaba.»', attribution: 'Gloria Mark' },
      aplicacion: 'Activa el modo "No molestar" en bloques de 90 minutos durante tu trabajo más importante. No como disciplina personal, sino como corrección de una asimetría de diseño: las apps están optimizadas para interrumpirte; tú debes optimizarte para resistirlo.'
    },
    {
      id: 'tec-03',
      title: 'El efecto de desinhibición online: por qué la gente dice en internet lo que nunca diría en persona',
      summary: 'La pantalla elimina las señales sociales que regulan el comportamiento en persona, produciendo conductas más extremas en ambos sentidos: más apertura y más agresividad.',
      sourceUrl: 'https://doi.org/10.1089/1094931041291295',
      sourceLabel: 'Suler (2004) — CyberPsychology & Behavior',
      badge: 'Psicología digital',
      author: { name: 'John Suler', university: 'Rider University', specialty: 'Psicología del ciberespacio y comportamiento online' },
      readingTime: '3 min',
      date: '12 de mayo de 2026',
      intro: 'Internet libera algo en las personas. Algunas comparten sus miedos más profundos con extraños en foros de salud mental con una franqueza que nunca tendrían con su médico en persona. Otras insultan, amenazan o humillan a desconocidos con una crueldad que jamás mostrarían cara a cara. En ambos casos, el mecanismo es el mismo: la pantalla desactiva los inhibidores del comportamiento que evolucionaron para el entorno social presencial. John Suler fue el primero en articularlo sistemáticamente.',
      sections: [
        {
          subtitle: 'Los seis factores que producen la desinhibición',
          paragraphs: [
            'Suler identificó seis condiciones que, en distintas combinaciones, producen la desinhibición online. El anonimato disociativo: online puedes ser "nadie" o "alguien diferente", y tu nombre real no está en juego. La invisibilidad: no ves la cara del receptor de tus palabras, no ves su reacción de dolor, sorpresa o alegría. La comunicación asincrónica: no tienes que esperar la respuesta inmediata, lo que elimina la presión del tiempo real. La minimización de la autoridad: online, la jerarquía social del mundo físico se aplana o desaparece.',
            'A estas cuatro se añaden la disociación del yo —la sensación de que "el yo online" es un personaje diferente al yo real, lo que reduce la responsabilidad percibida— y la solipsismo fantaseado: el receptor online existe como una proyección en tu mente, no como una persona completa con vida interior. Hablarle es, cognitivamente, hablarle a una imagen, no a un ser humano tridimensional. Eso hace que la crueldad sea fácil y la empatía difícil.'
          ]
        },
        {
          subtitle: 'La desinhibición benigna y la tóxica: las dos caras del mismo fenómeno',
          paragraphs: [
            'Suler subraya que la desinhibición no es inherentemente negativa. La desinhibición benigna lleva a personas a compartir emociones vulnerables, pedir ayuda para problemas que nunca llevarían a un médico, explorar identidades alternativas de forma segura, o ser más honestas en sus evaluaciones de trabajo. Muchos estudios muestran que los pacientes comunican síntomas más honestamente en formularios digitales que en consulta presencial. La misma pantalla que produce trolls produce también una confesión médica más precisa.',
            'La diferencia entre ambas formas de desinhibición depende de la personalidad preexistente y del contexto de la plataforma, no de la tecnología en sí. Las plataformas que combinan anonimato, audiencia masiva y sistemas de "likes" están diseñadas —aunque no intencionalmente en muchos casos— para maximizar la desinhibición tóxica. El aplauso de muchos anónimos ante un comentario agresivo refuerza la conducta con la misma lógica del refuerzo variable de Skinner.'
          ]
        }
      ],
      blockquote: { text: '«En el ciberespacio, la ausencia de señales físicas convierte al receptor en una proyección de la mente del emisor. Y con proyecciones no se tiene empatía.»', attribution: 'John Suler' },
      aplicacion: 'Antes de publicar algo que sientes con intensidad —un comentario crítico, una respuesta enfadada, una valoración negativa—, aplica el "test del tiempo real": imagina que lo dices en voz alta en una sala con la persona delante y con testigos. Si el escenario te incomoda, la desinhibición está hablando por ti. El texto permanece. La emoción que lo generó, no.'
    },
    {
      id: 'tec-04',
      title: 'La burbuja de filtros: cómo el algoritmo te convence de que el mundo piensa como tú',
      summary: 'Los sistemas de recomendación reducen sistemáticamente tu exposición a ideas contrarias, creando una ilusión de consenso que distorsiona la percepción de la realidad social.',
      sourceUrl: 'https://doi.org/10.1126/science.aaa1160',
      sourceLabel: 'Bakshy, Messing & Adamic (2015) — Science · Pariser (2011)',
      badge: 'Psicología de las redes sociales',
      author: { name: 'Eli Pariser', university: 'MoveOn.org / Upworthy', specialty: 'Ética algorítmica y sesgos en plataformas digitales' },
      readingTime: '4 min',
      date: '5 de mayo de 2026',
      intro: 'En 2011, Eli Pariser observó algo desconcertante en su feed de Facebook: sus amigos conservadores habían desaparecido. No los había bloqueado. No habían dejado de publicar. Simplemente, el algoritmo había decidido —basándose en sus patrones de interacción— que sus publicaciones no le interesaban y había dejado de mostrárselas. Pariser llamó a este fenómeno "filter bubble" y alertó sobre una consecuencia que entonces parecía hipotética: si cada persona vive en un entorno de información que confirma lo que ya cree, la democracia deliberativa se convierte en una ilusión.',
      sections: [
        {
          subtitle: 'Los datos: cuánto sesga el algoritmo y cuánto nos sesgamos nosotros',
          paragraphs: [
            'En 2015, un equipo de Facebook publicó en la revista Science el estudio más grande realizado hasta entonces sobre burbujas de filtros: analizó los feeds de 10 millones de usuarios con información política diversa. El resultado fue matizado pero importante: el algoritmo de Facebook reducía la exposición a contenido ideológicamente contrario en un 8% para los conservadores y un 5% para los liberales. Pero la selección individual —qué contenido elige hacer clic cada usuario entre lo que sí aparece en el feed— añadía una reducción adicional del 26-36%.',
            'El mensaje es incómodo para ambos lados del debate sobre las redes sociales: el algoritmo sesga, pero tú también. La autopropaganda no requiere un sistema activamente manipulador; basta con que el sistema muestre lo que genera más clics, y lo que genera más clics es lo que confirma lo que ya creemos y lo que nos indigna. El sesgo de confirmación y la heurística de disponibilidad hacen el resto: lo que aparece más en el feed parece más representativo de la realidad.'
          ]
        },
        {
          subtitle: 'El efecto sobre la percepción de la realidad social',
          paragraphs: [
            'La consecuencia más documentada de las burbujas de filtros no es el extremismo —que es compleja y discutida—, sino la distorsión en la percepción de la prevalencia de opiniones. Estudios de ciencia política muestran sistemáticamente que personas en entornos de alta homofilia digital sobreestiman cuántos ciudadanos comparten su posición y subestiman cuántos sostienen la contraria. Esto tiene efectos políticos concretos: reduce la disposición a buscar compromiso, incrementa la certeza de que "la mayoría" está de tu lado, y hace más probable interpretar el disenso como error o mala fe en lugar de diferencia legítima.',
            'El mecanismo psicológico subyacente es la "espiral del silencio" de Elisabeth Noelle-Neumann: si crees que tu opinión es mayoritaria (porque tu feed la confirma constantemente), la expresas con más confianza; si crees que es minoritaria, la silencias. El feed crea percepciones sesgadas de mayoría; esas percepciones cambian la disposición a hablar; los que callan desaparecen del feed; la percepción de mayoría se consolida. El ciclo es autorreferente.'
          ]
        }
      ],
      blockquote: { text: '«La web nos está mostrando un universo personalizado para cada uno de nosotros, y ese universo tiene muy poca ventana hacia lo que piensa el resto.»', attribution: 'Eli Pariser' },
      aplicacion: 'Dedica 10 minutos a la semana a buscar activamente tres fuentes informativas con las que generalmente no estás de acuerdo —no extremistas, sino voces serias que razonan desde otras premisas—. No para cambiar de opinión, sino para calibrar: si solo consumes lo que confirma lo que ya crees, tu modelo de la realidad social es tan distorsionado como el de quien hace lo opuesto.'
    }
  ],

  relaciones: [
    {
      id: 'rel-01',
      title: 'El 69% de los conflictos de pareja no tienen solución — y eso está bien',
      summary: 'Tres décadas de investigación con cientos de parejas revelan que la mayoría de sus conflictos son "perpetuos" — enraizados en diferencias de personalidad que nunca desaparecerán.',
      sourceUrl: 'https://doi.org/10.1207/s15327760jpfr0302_7',
      sourceLabel: 'Gottman & Levenson (1992) — Journal of Personal and Family Relationships',
      badge: 'Psicología de la pareja',
      author: { name: 'John Gottman', university: 'Universidad de Washington', specialty: 'Psicología de la pareja y predicción del divorcio' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'John Gottman empezó a estudiar parejas en los años 70 con una pregunta aparentemente simple: ¿podemos predecir qué matrimonios durarán? Tras grabar miles de horas de conversación en su "Love Lab" de la Universidad de Washington y hacer seguimiento durante décadas, desarrolló un modelo con una precisión de predicción del divorcio superior al 90%. Lo que encontró en el camino fue más perturbador que la predicción en sí: la mayoría de los problemas de pareja no tienen solución, y las parejas que lo entienden son más felices que las que intentan resolverlos.',
      sections: [
        {
          subtitle: 'Problemas solucionables vs. problemas perpetuos: la distinción que lo cambia todo',
          paragraphs: [
            'Gottman categoriza los conflictos de pareja en dos tipos. Los problemas solucionables son circunstanciales: quién hace las tareas, cómo gastar las vacaciones, la logística de los hijos. Tienen solución porque son negociables. Los problemas perpetuos son existenciales: diferencias fundamentales en valores, en necesidades de orden o espontaneidad, en la relación con el dinero, en la intensidad emocional que cada persona necesita o puede dar. Estos reflejan quiénes somos, no lo que hacemos.',
            'El dato que Gottman repite en todas sus obras: el 69% de los conflictos de pareja son perpetuos. Dos personas que comparten una vida compartirán inevitablemente diferencias de carácter que nunca desaparecerán. Las parejas estables no han resuelto esos conflictos: han aprendido a hablar de ellos con humor, afecto y tolerancia. Las parejas que fracasan no tienen más conflictos perpetuos que las estables —la proporción es similar en todos los grupos—. La diferencia está en cómo los manejan.'
          ]
        },
        {
          subtitle: 'Los cuatro jinetes: los predictores reales del divorcio',
          paragraphs: [
            'Lo que predice el fracaso de una pareja no es la frecuencia de los conflictos sino el estilo de comunicación durante ellos. Gottman identificó cuatro patrones que llama "los cuatro jinetes del apocalipsis relacional": la crítica (atacar el carácter del otro, no el comportamiento), el desprecio (cualquier forma de comunicar superioridad moral), la actitud defensiva (rechazar la responsabilidad convirtiendo toda crítica en un contraataque) y el bloqueo emocional (retirarse de la conversación y dejar de responder).',
            'De los cuatro, el desprecio es el predictor más potente del divorcio, incluso controlado por todos los demás factores. El desprecio —el sarcasmo, los ojos en blanco, el humor que humilla— comunica algo que el cerebro del receptor registra como una amenaza existencial: que quien le ama le considera inferior. Una pareja puede sobrevivir muchos conflictos intensos si están libres de desprecio. Una pareja con poco conflicto explícito pero con desprecio recurrente tiene pronóstico estadísticamente peor.'
          ]
        }
      ],
      blockquote: { text: '«El objetivo del matrimonio no es eliminar el conflicto, sino construir un sistema de comunicación lo suficientemente robusto como para manejar el conflicto que inevitablemente existirá.»', attribution: 'John Gottman' },
      aplicacion: 'La próxima vez que estés en una discusión repetida con tu pareja, párate y hazte esta pregunta: ¿es esto un problema que podemos resolver, o es una diferencia de carácter que necesitamos gestionar? Si es lo segundo, el objetivo de la conversación no es ganar ni convencer, sino entender mejor la posición del otro y llegar a un acuerdo de convivencia, aunque el problema de fondo permanezca.'
    },
    {
      id: 'rel-02',
      title: 'El experimento del puente colgante: cuando confundimos el miedo con la atracción',
      summary: 'Cruzar un puente de altura genera la misma activación fisiológica que la atracción romántica, y el cerebro atribuye ese estado de excitación al estímulo más saliente: una persona atractiva cercana.',
      sourceUrl: 'https://doi.org/10.1037/h0037031',
      sourceLabel: 'Dutton & Aron (1974) — Journal of Personality and Social Psychology',
      badge: 'Atracción interpersonal',
      author: { name: 'Donald Dutton', university: 'Universidad de British Columbia', specialty: 'Psicología social y atracción interpersonal' },
      readingTime: '3 min',
      date: '26 de mayo de 2026',
      intro: 'Vancouver, 1974. Un puente colgante de 70 metros de altura sobre el río Capilano oscila suavemente. Un segundo puente, sólido y a solo tres metros del suelo, cruza el mismo río 100 metros más abajo. Dutton y Aron colocan una investigadora atractiva en el centro de cada puente, que entrega cuestionarios a los hombres que lo cruzan solos y les da su número de teléfono "por si tienen preguntas". La llamada a esa investigadora iba a medir algo que ella no necesitaba saber: qué tan efectivo había sido el puente colgante como afrodisíaco involuntario.',
      sections: [
        {
          subtitle: 'El experimento: miedo que se convierte en deseo',
          paragraphs: [
            'De los hombres que cruzaron el puente colgante y hablaron con la investigadora, el 50% la llamó posteriormente. De los que cruzaron el puente sólido con la misma investigadora, solo lo hizo el 12,5%. Los cuestionarios que completaron mientras estaban en el puente contenían una tarea de escritura proyectiva: quienes estaban en el puente colgante producían textos con significativamente más contenido sexual y romántico. La atracción no era una impresión subjetiva: se medía en conductas concretas y en producción narrativa.',
            'Dutton y Aron diseñaron variaciones de control para descartar explicaciones alternativas. Cuando la persona en el puente era un hombre, no se producía el efecto. Cuando la investigadora esperaba a los participantes al final del puente —después de que la excitación fisiológica del cruce hubiera disminuido— el efecto también desaparecía. La excitación tenía que ser contemporánea al encuentro para producir la malinterpretación. El timing era tan importante como la persona.'
          ]
        },
        {
          subtitle: 'El mecanismo: la atribución errónea de la excitación',
          paragraphs: [
            'El fenómeno se denomina "misattribution of arousal" —atribución errónea de la excitación—. El cerebro detecta un estado de activación fisiológica (pulso elevado, adrenalina, alerta) y necesita explicarlo. En ausencia de una etiqueta clara —"estoy nervioso porque el puente oscila"—, atribuye ese estado al estímulo más saliente del entorno: una persona atractiva. La excitación no crea la atracción; la amplifica y puede generarla donde sin ese contexto no existiría.',
            'El efecto funciona en múltiples sentidos. Puede hacer que personas se sientan más atraídas entre sí en contextos de alta excitación —una primera cita en una montaña rusa, un partido de fútbol, una situación de riesgo compartido—. Pero también puede producir lo inverso: la excitación de una discusión intensa puede ser malinterpretada como pasión, creando ciclos de conflicto que se perpetúan porque el conflicto mismo genera la intensidad que la pareja confunde con vitalidad relacional.'
          ]
        }
      ],
      blockquote: { text: '«El cuerpo no distingue bien entre el miedo y el deseo. Ambos activan el mismo sistema, y la mente busca la causa en el contexto.»', attribution: 'Donald Dutton & Arthur Aron' },
      aplicacion: 'Las primeras citas en entornos con cierta excitación fisiológica —un espectáculo de teatro, una película de suspense, una actividad física— generan más atracción percibida que las cenas convencionales. No es manipulación: es que las condiciones del entorno facilitan la atribución de la excitación a la persona. Pero también merece preguntarse: ¿cuánta de la intensidad que sentimos en ciertas relaciones viene de la persona y cuánta del contexto?'
    },
    {
      id: 'rel-03',
      title: 'La teoría triangular del amor: por qué cambia lo que sientes con el tiempo y eso no significa que el amor desaparezca',
      summary: 'El amor tiene tres componentes independientes —pasión, intimidad y compromiso— que evolucionan a ritmos distintos. Confundirlos produce diagnósticos erróneos sobre el estado de una relación.',
      sourceUrl: 'https://doi.org/10.1037/0033-295X.93.2.119',
      sourceLabel: 'Sternberg (1986) — Psychological Review',
      badge: 'Psicología del amor',
      author: { name: 'Robert Sternberg', university: 'Universidad de Yale / Universidad de Cornell', specialty: 'Psicología de la inteligencia, la creatividad y el amor' },
      readingTime: '3 min',
      date: '19 de mayo de 2026',
      intro: 'La mayoría de los idiomas tienen una sola palabra para el amor. El griego clásico tenía seis. Robert Sternberg propuso en 1986 que esa insuficiencia lingüística tiene consecuencias psicológicas reales: confundimos bajo la misma etiqueta estados emocionales completamente distintos, con dinámicas distintas y predicciones distintas. Su teoría triangular del amor es el marco más citado en psicología de las relaciones, y ofrece una herramienta para diagnosticar con más precisión qué está ocurriendo en una relación —y qué se puede esperar.',
      sections: [
        {
          subtitle: 'Los tres vértices: pasión, intimidad y compromiso',
          paragraphs: [
            'Sternberg propone que el amor completo —lo que llama "amor consumado"— requiere la presencia simultánea de tres componentes. La pasión es el componente motivacional: deseo físico, atracción, excitación. Se activa rápido, se habita rápido. La intimidad es el componente emocional: cercanía, conexión, la sensación de ser conocido por alguien. Crece lentamente y de forma más estable. El compromiso es el componente cognitivo: la decisión de amar y mantener esa relación. Puede existir sin ninguno de los otros dos.',
            'Diferentes combinaciones de estos tres componentes producen tipos de amor cualitativamente distintos. La pasión sin intimidad ni compromiso es "encaprichamiento". La intimidad sin pasión ni compromiso es "amor fraternal" o de amistad profunda. El compromiso sin pasión ni intimidad es "amor vacío" —el que queda en algunos matrimonios largos donde ya no queda conexión pero sí costumbre. La combinación de intimidad y compromiso sin pasión es lo que Sternberg llama "amor compañero" —estable, cálido, frecuente en relaciones maduras—.'
          ]
        },
        {
          subtitle: 'Por qué el tiempo cambia el triángulo y cómo interpretarlo',
          paragraphs: [
            'La evolución temporal de los tres componentes no es paralela ni simétrica. La pasión tiene la curva más pronunciada: máxima en los primeros meses o años, decae con la familiaridad y la habitación. Los estudios neurobiológicos de Fisher, Aron y Brown muestran que el sistema dopaminérgico asociado a la pasión romántica se normaliza con el tiempo para la mayoría de las personas. La intimidad, en cambio, crece de forma más gradual y sostenida si la pareja invierte en revelación mutua y experiencias compartidas. El compromiso es relativamente estable y voluntario.',
            'El error de diagnóstico más común en las relaciones largas es interpretar la disminución de la pasión como evidencia de que "el amor se acabó". Desde la perspectiva de Sternberg, lo que ha cambiado es un componente específico, cuya disminución es estadísticamente normal y neurobiológicamente esperable. Si los otros dos componentes —intimidad y compromiso— han crecido o se han mantenido, la relación puede estar evolucionando correctamente, no deteriorándose. El problema es que la cultura romántica occidental ha sobrerrepresentado la pasión como el marcador del amor verdadero, invisibilizando los otros dos.'
          ]
        }
      ],
      blockquote: { text: '«Las relaciones que solo tienen pasión son intensas pero frágiles. Las que tienen los tres componentes son raras pero extraordinariamente resilientes.»', attribution: 'Robert Sternberg' },
      aplicacion: 'Evalúa tu relación actual —o la que quieras entender— a través de los tres vértices por separado: ¿Hay pasión? ¿Hay intimidad (sensación de ser conocido y de conocer)? ¿Hay compromiso? Diagnosticar qué componente está bajo te da una dirección mucho más útil que el diagnóstico global de "esto no funciona". Y te protege de confundir el ciclo normal del primer componente con el colapso del conjunto.'
    },
    {
      id: 'rel-04',
      title: 'Tu estilo de apego decide cómo discutes, cómo pides ayuda y cómo te vas',
      summary: 'El tipo de vínculo que formaste con tus cuidadores en los primeros años predice con sorprendente precisión los patrones de conflicto, cercanía y ruptura en tus relaciones adultas.',
      sourceUrl: 'https://doi.org/10.1037/0022-3514.52.3.511',
      sourceLabel: 'Hazan & Shaver (1987) — Journal of Personality and Social Psychology',
      badge: 'Psicología del apego',
      author: { name: 'Cindy Hazan', university: 'Universidad de Cornell', specialty: 'Apego adulto y relaciones románticas' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'En 1987, Cindy Hazan y Phillip Shaver publicaron un estudio que cambió la psicología de las relaciones adultas: la forma en que los adultos se relacionan románticamente replica, con asombrosa fidelidad, los patrones de apego que desarrollaron con sus cuidadores en la infancia. No como determinismo inescapable, sino como una arquitectura por defecto que opera a menos que haya razones para reconstruirla.',
      sections: [
        { subtitle: 'El estudio: un cuestionario en el periódico que replicó la teoría de Bowlby', paragraphs: ['Hazan y Shaver diseñaron tres párrafos que describían tres estilos relacionales —seguro, ansioso y evitativo— y los publicaron en el periódico local de Denver pidiéndole a los lectores que eligieran cuál les describía mejor. Recogieron más de 600 respuestas y las cruzaron con medidas de historia de apego infantil, calidad de las relaciones románticas actuales y modelos mentales sobre el amor. Los resultados fueron inequívocos: los tres estilos de apego infantil de Ainsworth encontraban su correlato exacto en las relaciones adultas.', 'Las personas con apego seguro (56% de la muestra) describían sus relaciones como de fácil cercanía, confianza mutua y comodidad con la dependencia recíproca. Las personas con apego ansioso-ambivalente (20%) reportaban relaciones intensas pero inestables, con miedo constante al abandono y necesidad de reafirmación continua. Las personas con apego evitativo (24%) evitaban activamente la cercanía, se sentían incómodas con la dependencia y tendían a desconectarse emocionalmente bajo estrés relacional.'] },
        { subtitle: 'El mecanismo: los modelos internos de trabajo', paragraphs: ['Bowlby propuso que los patrones de respuesta del cuidador crean en el niño "modelos internos de trabajo": representaciones mentales de uno mismo (¿soy alguien digno de ser amado?), del otro (¿son los demás fiables cuando los necesito?) y de la relación (¿es la cercanía segura o peligrosa?). Estas representaciones no son creencias conscientes: son esquemas automáticos que filtran la percepción, organizan la respuesta emocional y guían el comportamiento relacional antes de que ningún razonamiento consciente tenga oportunidad de intervenir.', 'La investigación de Mary Main con el Adult Attachment Interview demostró que los modelos internos de trabajo son sorprendentemente estables a lo largo de la vida, pero no inmutables. Las relaciones con una pareja segura, la psicoterapia orientada al apego y ciertos tipos de experiencias correctoras pueden reorganizar parcialmente esos modelos. La transmisión intergeneracional del apego —el estilo de apego de una madre predice con 75% de precisión el tipo de apego que desarrollará su hijo— no es genética ni inevitable: es aprendizaje que puede interrumpirse con conciencia y apoyo.'] }
      ],
      blockquote: { text: '«El amor romántico adulto es, en sus estructuras más profundas, el mismo sistema de apego que organizó la relación del bebé con su cuidador. Hemos crecido, pero el sistema no ha cambiado.»', attribution: 'Cindy Hazan & Phillip Shaver, 1987' },
      aplicacion: 'Identificar tu estilo de apego predominante no es un ejercicio de categorización rígida: es un mapa de los patrones que aparecen automáticamente bajo estrés relacional. Si tiendes al evitativo, observa los momentos en que te retiras emocionalmente justo cuando la cercanía aumenta. Si tiendes al ansioso, observa los momentos en que la necesidad de reafirmación intensifica el conflicto. El reconocimiento del patrón es el primer paso para elegir una respuesta distinta.'
    },
    {
      id: 'rel-05',
      title: 'La soledad es tan letal como fumar 15 cigarrillos al día',
      summary: 'Décadas de investigación epidemiológica demuestran que el aislamiento social y la soledad subjetiva son predictores de mortalidad tan potentes como la obesidad, el sedentarismo o el tabaquismo.',
      sourceUrl: 'https://doi.org/10.1371/journal.pmed.1000316',
      sourceLabel: 'Holt-Lunstad, Smith & Layton (2010) — PLOS Medicine',
      badge: 'Psicología de la salud',
      author: { name: 'Julianne Holt-Lunstad', university: 'Brigham Young University', specialty: 'Relaciones sociales, salud cardiovascular y longevidad' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'En 2010, Julianne Holt-Lunstad y sus colegas publicaron un metaanálisis que analizaba los datos de 148 estudios longitudinales, con más de 300.000 participantes seguidos durante una media de 7,5 años. La pregunta era directa: ¿cuánto importan las relaciones sociales para la supervivencia? La respuesta fue incómoda para una cultura que trata la soledad como un estado emocional privado y no como un problema de salud pública.',
      sections: [
        { subtitle: 'El metaanálisis: 148 estudios y una conclusión perturbadora', paragraphs: ['Holt-Lunstad y su equipo encontraron que las personas con relaciones sociales adecuadas tenían un 50% más de probabilidades de sobrevivir en el período de seguimiento que las personas con relaciones sociales inadecuadas. La magnitud del efecto era comparable —y en algunos análisis superior— a los factores de riesgo más establecidos en salud pública. Tener pocas conexiones sociales era tan predictivo de mortalidad prematura como fumar hasta 15 cigarrillos al día, y más predictivo que la obesidad, el sedentarismo o el consumo excesivo de alcohol.', 'El estudio distinguía entre aislamiento objetivo (pocos contactos sociales), soledad subjetiva (sentirse solo independientemente del número de contactos) y vivir solo. Las tres variables predicaban mortalidad de forma independiente, pero la soledad subjetiva —el sentimiento de estar desconectado— era el predictor más potente. Esto implica que el problema no es cuántas personas tienes en tu vida, sino si las conexiones que tienes te hacen sentir comprendido y perteneciente.'] },
        { subtitle: 'El mecanismo: cómo la soledad destruye el cuerpo', paragraphs: ['John Cacioppo, el investigador que más profundamente estudió la neurobiología de la soledad, documentó que el aislamiento social activa el sistema de vigilancia de amenazas del cerebro de forma crónica. Las personas solitarias muestran niveles más altos de cortisol basal, mayor respuesta inflamatoria, peor calidad del sueño, activación aumentada del sistema nervioso simpático y expresión génica alterada en células del sistema inmune. La soledad, en el sentido evolutivo, era una señal de peligro: un humano separado del grupo era un humano vulnerable.', 'El circuito es autorreferente y difícil de interrumpir. La hipervigilancia que genera la soledad produce sesgos atencionales hacia las amenazas sociales, lo que genera conductas de retirada que aumentan el aislamiento, que profundiza la hipervigilancia. Cacioppo llamó a esto el "ciclo de la soledad", y documentó que la soledad predice soledad futura con más fuerza que cualquier otra variable. La intervención más eficaz no es aumentar el número de contactos sino modificar los sesgos cognitivos que hacen percibir las interacciones sociales como más amenazantes de lo que son.'] }
      ],
      blockquote: { text: '«La soledad no es un problema de introversión ni de preferencia personal. Es una señal de alarma biológica con consecuencias físicas tan reales como el hambre o el dolor.»', attribution: 'John T. Cacioppo' },
      aplicacion: 'La calidad de las conexiones importa más que la cantidad. Una conversación real —donde te sientes visto y escuchado— tiene efectos fisiológicos distintos a una interacción social superficial. Identifica una relación en tu vida donde la conexión es genuina pero has dejado que se espacie por inercia, y activa una forma concreta de retomar ese contacto esta semana.'
    }
  ],

  saludMental: [
    {
      id: 'sm-01',
      title: 'El estado de flujo: la ciencia detrás de cuando el tiempo desaparece',
      summary: 'Existe un punto exacto entre el aburrimiento y la ansiedad donde el rendimiento y el bienestar alcanzan su pico simultáneamente. Csikszentmihalyi lo mapeó con décadas de investigación.',
      sourceUrl: 'https://www.jstor.org/stable/20159000',
      sourceLabel: 'Csikszentmihalyi (1975/1990) — Flow: The Psychology of Optimal Experience',
      badge: 'Psicología positiva',
      author: { name: 'Mihaly Csikszentmihalyi', university: 'Universidad de Chicago / Claremont Graduate University', specialty: 'Psicología de la experiencia óptima y el bienestar' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'En los años 70, Mihaly Csikszentmihalyi entrevistó a cientos de personas que realizaban actividades que no les pagaban y que nadie les pedía: escaladores, ajedrecistas, cirujanos operando de forma voluntaria, artistas. Buscaba entender qué les motivaba cuando la recompensa externa era mínima o inexistente. Lo que encontró era una experiencia que describían de forma casi idéntica, con un vocabulario sorprendentemente convergente: un estado de concentración total donde el tiempo se distorsiona, el yo desaparece y la actividad fluye sin esfuerzo consciente. Lo llamó "flujo".',
      sections: [
        {
          subtitle: 'Las condiciones del flujo: el canal entre el aburrimiento y la ansiedad',
          paragraphs: [
            'Csikszentmihalyi identificó que el flujo ocurre cuando el nivel de desafío de una tarea y el nivel de habilidad del ejecutante están perfectamente equilibrados y son ambos suficientemente altos. Si el desafío supera con mucho la habilidad, aparece la ansiedad. Si la habilidad supera con mucho el desafío, aparece el aburrimiento. En el canal estrecho entre ambos extremos, con desafío y habilidad elevados y equilibrados, aparece el flujo. El equilibrio debe producirse en el nivel alto: una tarea fácil realizada por un principiante no produce flujo, produce rutina.',
            'El estado de flujo tiene características subjetivas consistentes que Csikszentmihalyi documentó transculturalmente: concentración intensa y sin esfuerzo, fusión entre acción y conciencia, pérdida del sentido del tiempo, desaparición de la autoconsciencia, sensación de control, y lo que denomina "experiencia autotélica" —gratificante en sí misma, independientemente del resultado externo. Las personas en flujo no trabajan para conseguir algo: trabajan porque el proceso en sí es la recompensa.'
          ]
        },
        {
          subtitle: 'El flujo y el cerebro: qué ocurre neurológicamente',
          paragraphs: [
            'La investigación neuroimagen posterior al trabajo de Csikszentmihalyi ha aportado datos sobre el sustrato biológico del flujo. El estado se asocia con una reducción de actividad en la corteza prefrontal dorsolateral —la región involucrada en la autoconsciencia, la evaluación crítica y la planificación deliberada—. Esta "hipofrontalidad transitoria" explica la desaparición del yo: el sistema que monitorea y evalúa el desempeño se desconecta parcialmente, liberando recursos cognitivos para la ejecución.',
            'Al mismo tiempo, el flujo activa el sistema de recompensa (liberación de dopamina y norepinefrina) y aumenta la sincronización entre diferentes regiones cerebrales. El cerebro en flujo procesa más información de forma más eficiente, con menos ruido interno y más señal útil. Por eso el rendimiento en flujo suele superar al rendimiento en estados de esfuerzo consciente: el sistema de supervisión que normalmente introduce interferencia ha bajado su actividad.'
          ]
        }
      ],
      blockquote: { text: '«La mejor manera de mejorar la calidad de vida es hacer que las experiencias cotidianas sean más agradables. Y la experiencia de flujo es la más agradable que los humanos pueden tener de forma consistente.»', attribution: 'Mihaly Csikszentmihalyi' },
      aplicacion: 'Para diseñar flujo deliberadamente: identifica una habilidad que tengas al 70% de tu capacidad máxima, define un objetivo concreto y medible para la sesión (no "trabajar en X" sino "completar la sección Y de X"), y elimina todas las interrupciones posibles durante al menos 90 minutos. Las notificaciones no son distracciones: son el mecanismo exacto que imposibilita el flujo, que requiere acumulación de atención sostenida.'
    },
    {
      id: 'sm-02',
      title: 'La ilusión de control: por qué creer que mandas sobre lo que no controlas te mantiene más sano',
      summary: 'Percibir que tienes control sobre tu entorno —aunque esa percepción sea parcialmente ilusoria— tiene efectos biológicos reales y medibles sobre la salud y la longevidad.',
      sourceUrl: 'https://doi.org/10.1037/0022-3514.32.2.311',
      sourceLabel: 'Langer & Rodin (1976) — Journal of Personality and Social Psychology',
      badge: 'Psicología del control',
      author: { name: 'Ellen Langer', university: 'Universidad de Harvard', specialty: 'Mindfulness, control percibido y psicología de la salud' },
      readingTime: '3 min',
      date: '26 de mayo de 2026',
      intro: 'En 1976, Ellen Langer y Judith Rodin realizaron un experimento en una residencia de ancianos de Connecticut que cambiaría la gerontología y la psicología de la salud. Dividieron a los residentes en dos grupos que recibían exactamente el mismo nivel de atención médica y el mismo entorno físico. La única diferencia: un grupo podía tomar pequeñas decisiones sobre su habitación y su rutina, y tenía una planta que ellos mismos cuidaban. El otro grupo tenía la planta, pero la cuidaba el personal. Dieciocho meses después, los datos eran tan claros que perturbaron al equipo.',
      sections: [
        {
          subtitle: 'El experimento: cómo una planta puede extender la vida',
          paragraphs: [
            'Los residentes con autonomía para tomar pequeñas decisiones —qué mueble mover, qué película ver el martes, cómo distribuir la habitación— y con la responsabilidad de cuidar una planta viva reportaron mayor bienestar subjetivo, mayor nivel de actividad y mayor nivel de alerta que el grupo de control a los 18 meses de seguimiento. Pero el dato que nadie esperaba fue este: la tasa de mortalidad en el grupo de control duplicaba la del grupo con autonomía. El control percibido sobre pequeñas cosas había reducido a la mitad la mortalidad.',
            'Langer ha replicado el principio en múltiples formas a lo largo de décadas. En un estudio posterior, trabajadores de una empresa de limpieza que eran informados de que sus tareas equivalían a ejercicio físico moderado mostraron mejoras en presión arterial, peso e índice de masa corporal en comparación con un grupo de control con el mismo trabajo pero sin esa información. La percepción había cambiado la biología.'
          ]
        },
        {
          subtitle: 'El mecanismo: control, estrés y biología',
          paragraphs: [
            'La psicología del control tiene un sustrato biológico bien documentado. La percepción de incontrolabilidad activa el eje hipotalámico-pituitario-adrenal (HPA) y produce una liberación crónica de cortisol, que a largo plazo suprime el sistema inmune, deteriora la memoria del hipocampo y acelera el envejecimiento celular. La percepción de control actúa como buffer: reduce la respuesta de estrés ante eventos negativos, porque el cerebro interpreta que existe alguna vía de acción posible.',
            'Lo que Langer subraya —y que tiene consecuencias éticas importantes en el diseño de instituciones— es que el control no tiene que ser real para tener efectos biológicos reales. La percepción de control sobre cualquier dominio, por pequeño que sea, generaliza sus efectos protectores más allá de ese dominio. Un residente que decide qué flor regar está tomando una decisión biológicamente equivalente a "tengo agencia en mi vida". El cerebro no hace la distinción.'
          ]
        }
      ],
      blockquote: { text: '«La sensación de control no es un lujo psicológico: es una necesidad biológica con efectos medibles sobre la salud y la longevidad.»', attribution: 'Ellen Langer' },
      aplicacion: 'Cuando te sientas abrumado por una situación que percibas como incontrolable, no intentes controlar lo grande —probablemente no puedas—. Identifica el elemento más pequeño y concreto sobre el que sí tienes agencia y ejecútalo. El efecto protector del control se generaliza: el cerebro no requiere que el dominio controlado sea importante, solo que sea real.'
    },
    {
      id: 'sm-03',
      title: 'El ejercicio como antidepresivo: por qué caminar 30 minutos rivaliza con la medicación',
      summary: 'Un estudio controlado de Duke University demostró que el ejercicio aeróbico produce los mismos efectos sobre la depresión mayor que la medicación, con tasas de recaída significativamente menores a los 10 meses.',
      sourceUrl: 'https://doi.org/10.1001/archpsyc.56.10.980',
      sourceLabel: 'Blumenthal et al. (1999) — Archives of General Psychiatry',
      badge: 'Neurociencia clínica',
      author: { name: 'James Blumenthal', university: 'Universidad de Duke', specialty: 'Psicología de la salud y neurociencia cardiovascular' },
      readingTime: '3 min',
      date: '19 de mayo de 2026',
      intro: 'En 1999, James Blumenthal y su equipo de Duke publicaron un estudio que desafió la jerarquía terapéutica en el tratamiento de la depresión. Durante 16 semanas, asignaron aleatoriamente a 156 adultos con depresión mayor a tres condiciones: medicación sola (sertralina, un ISRS), ejercicio aeróbico solo (30 minutos tres veces por semana), o combinación de ambos. Al final del período de tratamiento, los tres grupos habían mejorado de forma comparable. El ejercicio solo había producido exactamente lo mismo que el fármaco.',
      sections: [
        {
          subtitle: 'El seguimiento: donde el ejercicio gana claramente',
          paragraphs: [
            'La diferencia real entre los grupos no apareció durante el tratamiento, sino en el seguimiento a los 10 meses. El equipo de Blumenthal contactó a los participantes que habían entrado en remisión para evaluar la tasa de recaída. Los resultados fueron sorprendentes: el grupo que solo había tomado medicación tenía una tasa de recaída del 38%. El grupo de medicación más ejercicio, del 31%. El grupo de solo ejercicio: del 8%. El tratamiento objetivamente menos intervencionista producía la mayor protección a largo plazo.',
            'El mecanismo de la ventaja no era simplista. Blumenthal argumenta que el ejercicio no solo produce cambios bioquímicos; también desarrolla lo que él llama "autoeficacia conductual": la experiencia repetida de comprometerse con una conducta difícil y mantenerla produce una creencia genuina en la propia capacidad de regulación. Las personas que habían entrenado durante 16 semanas habían aprendido algo sobre sí mismas que el fármaco no enseña.'
          ]
        },
        {
          subtitle: 'El mecanismo biológico: más que endorfinas',
          paragraphs: [
            'La narrativa popular sobre el ejercicio y el estado de ánimo se centra en las endorfinas. La neurociencia contemporánea apunta a un mecanismo más complejo y más robusto. El ejercicio aeróbico aumenta la expresión de BDNF (Factor Neurotrófico Derivado del Cerebro), una proteína que promueve la supervivencia de neuronas existentes y el crecimiento de nuevas conexiones, especialmente en el hipocampo —la región cerebral cuyo volumen está reducido en la depresión y que es central para la regulación del estado de ánimo y la memoria.',
            'Al mismo tiempo, el ejercicio regular reduce los niveles basales de cortisol (la hormona del estrés), aumenta la sensibilidad de los receptores de serotonina y dopamina, y activa la neuroplasticidad. Estos efectos no son agudos —no ocurren después de una sesión— sino acumulativos: se desarrollan con semanas de práctica consistente y son parcialmente reversibles si se deja de practicar. La regularidad es el medicamento activo, no el esfuerzo máximo de una sesión aislada.'
          ]
        }
      ],
      blockquote: { text: '«El ejercicio no es un complemento al tratamiento de la depresión: es un tratamiento en sí mismo, con un perfil de eficacia comparable a la medicación y un perfil de efectos secundarios radicalmente mejor.»', attribution: 'James Blumenthal' },
      aplicacion: 'El protocolo con evidencia más sólida es: 30 minutos de ejercicio aeróbico moderado (caminar rápido, nadar, bicicleta) tres veces por semana durante al menos 8 semanas. Este no es un consejo de bienestar general: es un protocolo clínico con estudios de eficacia controlada. Si empezar con 30 minutos parece imposible, empieza con 10: los beneficios neurobiológicos comienzan antes de alcanzar la dosis óptima.'
    },
    {
      id: 'sm-04',
      title: 'El estado de flujo: la ciencia de cuando el tiempo desaparece y el yo también',
      summary: 'Csikszentmihalyi identificó las condiciones precisas bajo las que el cerebro alcanza su rendimiento y bienestar máximos simultáneamente, y demostró que ese estado puede diseñarse.',
      sourceUrl: 'https://doi.org/10.1037/0003-066X.55.1.5',
      sourceLabel: 'Csikszentmihalyi (2000) — American Psychologist',
      badge: 'Psicología positiva',
      author: { name: 'Mihaly Csikszentmihalyi', university: 'Universidad de Chicago / Claremont Graduate University', specialty: 'Psicología de la experiencia óptima y el bienestar' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: '¿Por qué un cirujano de fama mundial opera voluntariamente sin cobrar en hospitales de países pobres? ¿Por qué un escalador arriesga su vida en una pared de hielo sin ninguna recompensa externa? Mihaly Csikszentmihalyi pasó décadas investigando esas preguntas y encontró que estas personas no estaban persiguiendo placer ni evitando dolor: estaban persiguiendo un estado psicológico específico que describían con vocabulario casi idéntico, independientemente de su cultura o actividad. Lo llamó flujo.',
      sections: [
        { subtitle: 'La investigación: el muestreo de experiencias a escala', paragraphs: ['Para ir más allá de las entrevistas, Csikszentmihalyi desarrolló el método de muestreo de experiencias (ESM): daba bippers a participantes de diferentes culturas, edades y profesiones que sonaban a horas aleatorias durante semanas. Al sonar, los participantes anotaban qué hacían, cómo se sentían y cuánto se concentraban. Tras analizar decenas de miles de registros, el patrón emergió con consistencia: los estados de mayor bienestar y mayor rendimiento coincidían con situaciones específicas y predecibles.', 'Las características del flujo eran transculturalmente consistentes: concentración intensa y sin esfuerzo consciente, fusión entre la acción y la conciencia del que actúa, pérdida de la noción del tiempo, desaparición de la autoconsciencia, sensación de control sin esfuerzo, y motivación completamente intrínseca —la actividad se convierte en un fin en sí misma, no un medio. Csikszentmihalyi encontró el flujo en cirujanos, jugadores de ajedrez, bailarines de ballet, trabajadores de cadenas de montaje y madres cuidando a sus hijos: la actividad era irrelevante; las condiciones eran universales.'] },
        { subtitle: 'La neurociencia del flujo: hipofrontalidad y sistema de recompensa', paragraphs: ['La investigación con neuroimagen ha identificado el sustrato cerebral del flujo. El estado se asocia con una reducción de actividad en la corteza prefrontal ventromedial y el cíngulo anterior, regiones involucradas en la autoconsciencia, la evaluación crítica y la supervisión del rendimiento. Esta "hipofrontalidad transitoria" explica la característica más desconcertante del flujo: la desaparición del yo.', 'Al mismo tiempo, el flujo activa el núcleo accumbens y la vía dopaminérgica mesolímbica, junto con la liberación de norepinefrina, anandamida y serotonina. El resultado neuroquímico es una experiencia que el cerebro codifica como extraordinariamente valiosa, lo que explica por qué las personas en flujo buscan repetir el estado y por qué el trabajo en flujo genera más satisfacción que el trabajo igualmente completado sin ese estado.'] }
      ],
      blockquote: { text: '«La felicidad no es algo que ocurre. No resulta de la buena fortuna o el azar. No se puede comprar con dinero ni coercionar con poder. Depende de cómo filtramos e interpretamos las experiencias cotidianas.»', attribution: 'Mihaly Csikszentmihalyi' },
      aplicacion: 'Para inducir flujo de forma deliberada se necesitan tres condiciones simultáneas: un objetivo claro y concreto para la sesión (no "trabajar en X" sino "completar la sección Y hasta Z"), ausencia total de interrupciones durante al menos 90 minutos, y una tarea cuyo desafío supere ligeramente —pero no desborde— tu nivel de habilidad actual. Si la tarea es demasiado fácil, auméntala; si genera ansiedad paralizante, divídela en subtareas manejables.'
    },
    {
      id: 'sm-05',
      title: 'La autocompasión no es autoindulgencia: la investigación que desmonta el mito',
      summary: 'Kristin Neff demostró que tratarse a uno mismo con amabilidad ante el fracaso predice mejor el bienestar, la resiliencia y el rendimiento que la autoestima alta, y sin sus efectos secundarios.',
      sourceUrl: 'https://doi.org/10.1023/B:SELF.0000009865.37384.9b',
      sourceLabel: 'Neff (2003) — Self and Identity',
      badge: 'Psicología positiva',
      author: { name: 'Kristin Neff', university: 'Universidad de Texas en Austin', specialty: 'Autocompasión, bienestar psicológico y regulación emocional' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'La cultura occidental asocia la autoevaluación negativa con la mejora: si no te exiges duramente, si no te criticas con rigor, si no sientes vergüenza ante el fracaso, no te esforzarás por hacerlo mejor. Kristin Neff pasó dos décadas investigando si esa asunción tiene base empírica. Encontró que no solo carece de ella: los datos apuntan exactamente en la dirección opuesta.',
      sections: [
        { subtitle: 'Autocompasión vs. autoestima: dos constructos muy distintos', paragraphs: ['Neff operacionalizó la autocompasión en tres componentes que se miden de forma independiente: amabilidad hacia uno mismo (tratarse con comprensión en lugar de juicio severo ante el fracaso), humanidad compartida (reconocer que el sufrimiento y la imperfección son parte de la experiencia humana universal, no un fracaso personal) y mindfulness (observar los pensamientos y sentimientos dolorosos sin sobreidentificarse con ellos ni suprimirlos). En más de 80 estudios publicados hasta 2020, la autocompasión predecía consistentemente mayor bienestar emocional, menor ansiedad, menor depresión, mayor motivación para el aprendizaje y mayor resiliencia ante el fracaso.', 'La diferencia crítica con la autoestima es que la autoestima alta está condicionada al éxito: se infla cuando las cosas van bien y colapsa cuando van mal, lo que la convierte en un regulador emocional inestable. La autocompasión, en cambio, es más estable porque no depende de los resultados. Neff encontró que personas con alta autocompasión y autoestima moderada tenían mejores indicadores de bienestar que personas con autoestima muy alta pero baja autocompasión.'] },
        { subtitle: 'El mito de la autoindulgencia: por qué la autocompasión mejora el rendimiento', paragraphs: ['La objeción más común a la autocompasión es que suaviza la motivación. Neff diseñó estudios específicos para responder a esta pregunta. En uno de los más citados, expuso a los participantes a situaciones de fracaso y midió su disposición a intentarlo de nuevo. Las personas con mayor autocompasión mostraron mayor motivación para corregir sus errores y mayor disposición a afrontar tareas difíciles, no menor. La razón: la autocrítica severa activa el sistema de amenaza del cerebro (amígdala, cortisol), que no es un buen ambiente cognitivo para el aprendizaje. La autocompasión activa el sistema de calma y afiliación (oxitocina, serotonina), que sí lo es.', 'En un estudio sobre el fracaso académico, los estudiantes con mayor autocompasión respondían al suspenso con más motivación de estudio, más análisis de sus errores y menor probabilidad de rendirse, en comparación con los de baja autocompasión y alta autocrítica. El mecanismo es contraintuitivo: castigarse por el error no genera más compromiso; genera más evitación del dominio donde el error ocurrió.'] }
      ],
      blockquote: { text: '«Cuando te dices cosas a ti mismo que nunca le dirías a un amigo que está sufriendo, no te estás motivando: te estás dañando con la ilusión de que el daño es productivo.»', attribution: 'Kristin Neff' },
      aplicacion: 'La próxima vez que cometas un error importante, aplica el test del amigo: ¿qué le dirías a un amigo cercano que hubiera cometido exactamente ese mismo error? Escríbelo. Luego compáralo con lo que te estás diciendo a ti mismo. La diferencia entre ambos textos es la medida exacta de la dureza con que te tratas, y el primero es el tono que produce mejor motivación y aprendizaje.'
    }
  ],

  educacion: [
    {
      id: 'edu-01',
      title: 'Cómo las notas destruyen el amor por aprender: la investigación que pone en cuestión la evaluación escolar',
      summary: 'Un metaanálisis de 128 estudios demuestra que las recompensas externas contingentes al rendimiento reducen sistemáticamente la motivación intrínseca por la actividad recompensada.',
      sourceUrl: 'https://doi.org/10.1037/0033-2909.125.6.627',
      sourceLabel: 'Deci, Koestner & Ryan (1999) — Psychological Bulletin',
      badge: 'Psicología educativa',
      author: { name: 'Edward Deci', university: 'Universidad de Rochester', specialty: 'Teoría de la Autodeterminación y motivación intrínseca' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'En los años 70, Edward Deci realizó un experimento que los sistemas educativos de todo el mundo todavía prefieren ignorar. Reclutó a estudiantes universitarios para resolver puzzles interesantes —sin recompensa— y midió cuánto tiempo dedicaban a ellos libremente cuando el experimentador salía de la sala. En la segunda sesión, a la mitad del grupo les empezó a pagar por resolver los mismos puzzles. En la tercera sesión, les retiró el pago. El resultado fue claro: el grupo que había recibido dinero dedicaba menos tiempo libre a los puzzles que antes de que les pagaran. El pago había reducido la motivación que ya existía.',
      sections: [
        {
          subtitle: 'El metaanálisis: 128 estudios y una conclusión incómoda',
          paragraphs: [
            'En 1999, Deci, Koestner y Ryan publicaron el metaanálisis más exhaustivo sobre este tema: 128 estudios controlados, con resultados consistentes. Las recompensas externas tangibles contingentes al rendimiento —exactamente las que produce el sistema de notas— reducen la motivación intrínseca de forma estadísticamente significativa y replicable. El efecto es especialmente pronunciado cuando la recompensa está condicionada a la ejecución: "te doy X si haces Y bien." Cuando la recompensa es un reconocimiento no esperado ("hiciste algo excelente"), el efecto negativo es menor.',
            'El mecanismo que proponen Deci y Ryan desde la Teoría de la Autodeterminación es el cambio en el "locus de causalidad percibido": cuando una recompensa externa controla el comportamiento, la persona desplaza internamente la causa de su acción de "lo hago porque me interesa" a "lo hago por la nota". La actividad deja de ser un fin y se convierte en un medio. Y los medios no sostienen el comportamiento cuando la recompensa desaparece.'
          ]
        },
        {
          subtitle: 'La distinción crítica: informar vs. controlar',
          paragraphs: [
            'El matiz más importante del trabajo de Deci es la distinción entre feedback informativo y feedback controlador. El feedback que te dice algo sobre tu competencia —"resolviste el problema de forma especialmente elegante porque usaste la propiedad X de forma inesperada"— puede aumentar la motivación intrínseca o mantenerla. El feedback que establece juicios de valor sobre tu persona —"tienes un 8"— tiene el efecto contrario. La diferencia está en si el feedback te da información sobre tu capacidad o si establece control sobre tu comportamiento.',
            'Esta distinción tiene implicaciones directas para el diseño educativo: el problema no es la evaluación en sí, sino el tipo de evaluación. Los sistemas de evaluación que priorizan la descripción de competencias y el progreso sobre el proceso tienen mejores resultados en motivación a largo plazo que los sistemas de calificación numérica pura. Y el elogio específico —centrado en el proceso, no en el resultado— produce más motivación sostenida que el elogio genérico sobre la inteligencia o el talento.'
          ]
        }
      ],
      blockquote: { text: '«Cuando se paga a las personas por hacer lo que ya hacían por placer, se convierten en trabajadores que necesitan que se les pague para seguir haciéndolo.»', attribution: 'Edward Deci' },
      aplicacion: 'Si quieres que alguien (o tú mismo) mantenga el interés por una actividad a largo plazo, prioriza el feedback que informa sobre competencia específica ("lo que hiciste aquí fue…") sobre el feedback que evalúa y clasifica ("esto vale un 7"). Y si introduces incentivos externos en actividades que ya generan motivación intrínseca, hazlo con cautela: puedes estar destruyendo algo más valioso de lo que ofreces a cambio.'
    },
    {
      id: 'edu-02',
      title: 'Los errores deseables: por qué aprender a duras penas es aprender mejor',
      summary: 'Las condiciones de aprendizaje que lo hacen más lento y más difícil en el corto plazo producen retención y transferencia significativamente superiores a largo plazo.',
      sourceUrl: 'https://doi.org/10.1006/ceps.1994.1009',
      sourceLabel: 'Bjork (1994) — Learning, Remembering, and Believing · Bjork & Bjork (2011)',
      badge: 'Ciencia del aprendizaje',
      author: { name: 'Robert Bjork', university: 'UCLA', specialty: 'Memoria, aprendizaje y dificultades deseables' },
      readingTime: '3 min',
      date: '26 de mayo de 2026',
      intro: 'Robert Bjork lleva décadas documentando una paradoja que contradice la intuición sobre el aprendizaje: las condiciones que hacen que el aprendizaje se sienta más fluido y fácil producen, sistemáticamente, peor retención a largo plazo. Y las condiciones que lo hacen más lento, más frustrante y más cargado de errores producen una retención y una transferencia significativamente mejores. Bjork las llama "dificultades deseables", y el catálogo de evidencias que las respalda es uno de los hallazgos más robustos de la psicología cognitiva aplicada.',
      sections: [
        {
          subtitle: 'Las tres dificultades mejor documentadas: espaciado, intercalado y recuperación',
          paragraphs: [
            'La primera dificultad deseable es el espaciado: estudiar el mismo material en varias sesiones separadas por tiempo produce mucho mejor retención que estudiarlo todo seguido, aunque en el momento la sesión concentrada se sienta más productiva. La segunda es el intercalado: mezclar diferentes tipos de problemas o materias en una misma sesión de estudio es más frustrante que trabajar todos los problemas del mismo tipo juntos, pero produce mejor transferencia —capacidad de aplicar lo aprendido a situaciones nuevas—. La tercera es la práctica de recuperación: intentar recordar información sin mirar las notas es más difícil que releer, pero produce entre 2 y 5 veces más retención.',
            'El patrón común a las tres es que dificultan la fluidez inmediata del aprendizaje —hacen que cometer errores sea más probable, que el progreso sea más lento, que la sensación de competencia durante el estudio sea menor—. Y es exactamente esa dificultad la que activa los mecanismos de consolidación mnémica más profundos. El esfuerzo de recuperación, por ejemplo, fortalece la huella de memoria en mayor medida que la mera reexposición porque fuerza al cerebro a procesar el material con mayor profundidad.'
          ]
        },
        {
          subtitle: 'El problema del feedback inmediato: cuándo ayuda y cuándo destruye',
          paragraphs: [
            'Bjork también documenta que el feedback inmediato y constante —que parece maximizar el aprendizaje porque permite corregir errores en el acto— puede paradójicamente reducir la retención a largo plazo si se proporciona antes de que el aprendiz haya tenido oportunidad de intentar la solución por sí mismo. El mecanismo es similar: el feedback inmediato elimina el esfuerzo de búsqueda que es precisamente el proceso que consolida la memoria.',
            'El "efecto de generación" ilustra esto con claridad: recordamos mejor las palabras que hemos tenido que completar (ca___) que las palabras que hemos leído enteras (cama), aunque en el momento de estudio la condición de lectura se sienta más productiva. El cerebro procesa más profundamente lo que construye que lo que simplemente registra. La dificultad de construir es el mecanismo del aprendizaje, no un obstáculo para él.'
          ]
        }
      ],
      blockquote: { text: '«La fluidez del aprendizaje es una ilusión seductora. Lo que se siente fácil al estudiar se olvida pronto. Lo que se siente difícil se recuerda.»', attribution: 'Robert Bjork' },
      aplicacion: 'La próxima vez que necesites aprender algo de forma duradera, cierra el libro o las notas e intenta recordar todo lo que puedas sin mirar. Escríbelo. Comprueba luego qué faltó. El proceso de intentar recordar —aunque falles, especialmente si fallas— es el aprendizaje real. La relectura es reconocimiento; la recuperación es aprendizaje.'
    },
    {
      id: 'edu-03',
      title: 'El efecto protégé: enseñar para aprender',
      summary: 'Los estudiantes que saben que tendrán que explicar el material a otros aprenden más y mejor que los que estudian para un examen, incluso cuando nunca llegan a enseñar a nadie.',
      sourceUrl: 'https://doi.org/10.3758/s13421-014-0416-z',
      sourceLabel: 'Nestojko, Bui, Kornell & Bjork (2014) — Memory & Cognition',
      badge: 'Metacognición',
      author: { name: 'John Nestojko', university: 'Washington University en St. Louis', specialty: 'Memoria, metacognición y estrategias de aprendizaje' },
      readingTime: '3 min',
      date: '12 de mayo de 2026',
      intro: 'En 2014, John Nestojko y sus colegas de Washington University realizaron un experimento sencillo pero con implicaciones profundas. Pidieron a dos grupos de estudiantes que leyeran un pasaje largo sobre un tema que desconocían. A un grupo se le dijo que después se les haría un examen. Al otro se le dijo que después tendrían que explicar el material a otros estudiantes. En realidad, ambos grupos acabaron haciendo el mismo examen de comprensión. El grupo que había estudiado para enseñar puntuó significativamente más alto, con mejor comprensión de la estructura del material y mejor capacidad de conectar ideas.',
      sections: [
        {
          subtitle: 'El experimento: la expectativa de enseñar cambia cómo se aprende',
          paragraphs: [
            'Los resultados de Nestojko fueron especialmente marcados en las preguntas que requerían inferencia y comprensión estructural —no solo memorización de hechos—. Los estudiantes que habían leído para enseñar identificaban mejor las ideas principales, construían representaciones más organizadas del material y eran más capaces de responder preguntas sobre relaciones implícitas entre conceptos que no estaban explícitamente en el texto. La expectativa de tener que transmitir el conocimiento había activado una forma de procesamiento cualitativamente distinta.',
            'El efecto es tan robusto que persiste incluso cuando los estudiantes nunca llegan a enseñar nada. La simple expectativa —"voy a tener que explicar esto"— produce los beneficios de aprendizaje sin necesidad de que la enseñanza ocurra. Esto indica que el mecanismo no está en el acto de explicar, sino en la estrategia de estudio que se activa cuando la persona anticipa esa obligación.'
          ]
        },
        {
          subtitle: 'El mecanismo: la organización para transmitir activa el procesamiento profundo',
          paragraphs: [
            'Cuando estudias para un examen, tu objetivo implícito es retener información. Cuando estudias para enseñar, tu objetivo implícito es organizar y articular información de forma que otro pueda entenderla. Esto activa estrategias de procesamiento profundo de forma automática: búsqueda de la lógica interna del material, identificación de analogías y ejemplos, jerarquización de lo esencial frente a lo secundario, anticipación de las preguntas que alguien podría hacerte.',
            'El "efecto de explicación" —la mejora del aprendizaje cuando se explica el material a otro— está bien documentado en investigación sobre aprendizaje colaborativo. Lo novedoso de Nestojko es demostrar que la mera anticipación de explicar —sin que la explicación ocurra— activa los mismos beneficios. El cerebro prepara para transmitir, y esa preparación produce comprensión más profunda que la preparación para acumular. Es la diferencia entre aprender para saber y aprender para hacer saber.'
          ]
        }
      ],
      blockquote: { text: '«La mejor forma de aprender algo no es estudiarlo pensando en que te van a examinar: es estudiarlo pensando en cómo se lo explicarías a alguien que no sabe nada del tema.»', attribution: 'John Nestojko' },
      aplicacion: 'Cuando necesites aprender algo que quieras que realmente se quede, escribe una explicación de ese tema como si se la fueras a mandar a alguien que no sabe nada de él. Hazla de verdad: clara, organizada, con ejemplos. Los huecos que aparezcan en esa explicación —los momentos en que no sabes cómo continuar— señalan exactamente qué no has entendido todavía.'
    },
    {
      id: 'edu-04',
      title: 'Mentalidad fija vs. mentalidad de crecimiento: la creencia que decide cuánto aprendes',
      summary: 'Carol Dweck demostró que la creencia sobre si la inteligencia es fija o maleable —no el CI real— predice el rendimiento académico, la respuesta al fracaso y el desarrollo a largo plazo.',
      sourceUrl: 'https://doi.org/10.1111/1467-9280.02405',
      sourceLabel: 'Blackwell, Trzesniewski & Dweck (2007) — Child Development',
      badge: 'Psicología educativa',
      author: { name: 'Carol S. Dweck', university: 'Universidad de Stanford', specialty: 'Motivación, desarrollo cognitivo y mentalidades implícitas' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: '¿Por qué dos estudiantes con el mismo CI, el mismo entorno familiar y la misma calidad de enseñanza divergen de forma dramática en su desarrollo académico y profesional? Carol Dweck lleva cuatro décadas investigando esa pregunta y ha encontrado una respuesta que contradice la intuición: la diferencia no está en la cantidad de inteligencia, sino en la teoría implícita que cada persona tiene sobre la naturaleza de su inteligencia.',
      sections: [
        { subtitle: 'El estudio longitudinal: dos años que demuestran la divergencia', paragraphs: ['Blackwell, Trzesniewski y Dweck siguieron a 373 estudiantes durante la transición al instituto —uno de los períodos más desafiantes del desarrollo académico— durante dos años. Al inicio midieron sus mentalidades implícitas sobre la inteligencia: ¿crees que la inteligencia es algo fijo que tienes en cierta cantidad, o que puedes desarrollarla con esfuerzo? Al inicio, ambos grupos tenían rendimiento equivalente. Durante los dos años siguientes, sus trayectorias divergieron de forma significativa: los estudiantes con mentalidad de crecimiento mejoraron progresivamente, mientras los de mentalidad fija se estancaron o declinaron.', 'El predictor no fue el CI, el nivel socioeconómico ni el estilo de enseñanza: fue exclusivamente la teoría implícita sobre la inteligencia. Los estudiantes con mentalidad de crecimiento buscaban activamente los desafíos, persistían ante el fracaso y usaban las estrategias de estudio más eficaces. Los de mentalidad fija evitaban los desafíos que podían revelar sus "límites" y se rendían ante la dificultad con mayor rapidez.'] },
        { subtitle: 'La intervención: cambiar la mentalidad en ocho sesiones', paragraphs: ['La prueba más relevante de la teoría de Dweck es que la mentalidad puede cambiarse y ese cambio tiene efectos medibles. Un subgrupo de estudiantes recibió ocho sesiones de intervención donde aprendían cómo funciona el aprendizaje neuronal: que el cerebro forma nuevas conexiones cuando se enfrenta a desafíos, que la dificultad es la señal de que el cerebro está trabajando, no de que uno no sirve para algo. Comparados con el grupo de control, los estudiantes que recibieron la intervención mostraron mejoras en notas de matemáticas, en disposición a esforzarse y en respuesta al fracaso.', 'Dweck es cuidadosa con no reducir la mentalidad de crecimiento a un eslogan motivacional. El elogio equivocado puede producir mentalidad fija: decir a un niño "eres muy inteligente" tras un éxito le enseña que la inteligencia es algo que se tiene, no algo que se construye. El elogio centrado en el proceso —"estudiaste de una forma muy eficaz", "encontraste una estrategia nueva para resolver esto"— refuerza la mentalidad de crecimiento.'] }
      ],
      blockquote: { text: '«La pasión por el esfuerzo, por el aprendizaje y por el enfrentamiento a los desafíos es la base de logros extraordinarios. Y eso puede enseñarse.»', attribution: 'Carol S. Dweck' },
      aplicacion: 'Observa cómo te explicas tus propios fracasos y dificultades en áreas donde te importa mejorar. ¿Los atribuyes a limitaciones fijas ("no soy bueno en esto", "no tengo esa capacidad") o a proceso y estrategia ("todavía no he encontrado el método correcto", "necesito más práctica deliberada en X")? El lenguaje que usas para explicarte el fracaso es el termómetro más directo de tu mentalidad implícita —y cambiarlo es el primer paso para cambiar la mentalidad.'
    },
    {
      id: 'edu-05',
      title: 'Por qué estudiar un tema hasta dominarlo es peor que mezclar todo a la vez',
      summary: 'El efecto de intercalado demuestra que mezclar distintos tipos de problemas en una misma sesión es más frustrante pero produce una comprensión y retención hasta tres veces superior al estudio en bloques.',
      sourceUrl: 'https://doi.org/10.1177/0956797612440753',
      sourceLabel: 'Rohrer, Dedrick & Burgess (2014) — Psychological Science',
      badge: 'Ciencia del aprendizaje',
      author: { name: 'Doug Rohrer', university: 'Universidad del Sur de Florida', specialty: 'Memoria, aprendizaje espaciado e intercalado' },
      readingTime: '3 min',
      date: '2 de junio de 2026',
      intro: 'Hay una forma de estudiar que se siente productiva pero que produce retención mediocre, y una forma que se siente frustrante pero que produce retención excelente. Doug Rohrer lleva más de una década documentando esta paradoja con experimentos controlados, y sus conclusiones siguen siendo ignoradas por la mayoría de los sistemas educativos del mundo, que diseñan sus libros de texto de la forma demostrativamente peor.',
      sections: [
        { subtitle: 'El experimento: bloques vs. intercalado en matemáticas', paragraphs: ['Rohrer y sus colegas asignaron a estudiantes de secundaria a dos condiciones de estudio de geometría. El grupo de bloqueo estudiaba todos los problemas de un tipo juntos. El grupo de intercalado mezclaba los distintos tipos de problemas de forma aleatoria a lo largo de la sesión. Durante el estudio, el grupo de bloqueo puntuaba mejor y reportaba mayor sensación de dominio. Una semana después, en un examen de sorpresa, los resultados se invertían: el grupo de intercalado puntuaba significativamente más alto, con diferencias de hasta el 50% en algunos estudios.', 'El patrón se ha replicado en matemáticas, ciencias, vocabulario de idiomas, categorización de obras de arte y diagnóstico médico. La consistencia transcurricular es llamativa: no parece ser un efecto específico de las matemáticas sino una propiedad general del aprendizaje.'] },
        { subtitle: 'El mecanismo: discriminación y selección de estrategia', paragraphs: ['Robert Bjork explica el mecanismo del intercalado en términos de lo que el cerebro tiene que hacer en cada condición. En el estudio en bloque, el estudiante sabe qué tipo de problema va a encontrar antes de leerlo: está en el bloque de cilindros, así que usará la fórmula del cilindro. El sistema cognitivo no necesita discriminar. En el intercalado, antes de poder resolver el problema, el estudiante debe identificar qué tipo de problema es y seleccionar la estrategia apropiada. Este proceso de discriminación y selección de estrategia es más difícil —y más frustrante—, pero es exactamente el proceso que el estudiante necesitará ejecutar en el examen y en la vida real.', 'El intercalado es, en este sentido, una forma de práctica de recuperación aplicada a la estrategia y no solo al contenido. Los libros de texto que agrupan todos los problemas del mismo tipo al final de cada capítulo están optimizados para la sensación de dominio durante el estudio —y contra la retención real.'] }
      ],
      blockquote: { text: '«El estudio en bloques es la forma más popular de practicar. Y también es la menos eficaz. Porque lo que hace fácil el estudio es, con frecuencia, exactamente lo que hace malo el aprendizaje.»', attribution: 'Doug Rohrer & Robert Bjork' },
      aplicacion: 'La próxima vez que prepares un examen o necesites aprender varias categorías de contenido, resiste la tentación de dominar un tema antes de pasar al siguiente. Mezcla los tipos de problemas o contenidos desde el principio, aunque la sesión se sienta más lenta y con más errores. La frustración que sientes al no saber inmediatamente qué estrategia aplicar es exactamente la señal de que el aprendizaje profundo está ocurriendo.'
    }
  ],

  trabajo: [
    {
      id: 'tra-01',
      title: 'El principio del progreso: el único motivador que realmente importa en el trabajo',
      summary: 'Un análisis de 12.000 entradas de diario de trabajadores del conocimiento reveló que el predictor más potente del bienestar y la motivación diarios no era el reconocimiento ni los incentivos: era hacer avanzar un trabajo con sentido.',
      sourceUrl: 'https://hbr.org/2011/05/the-power-of-small-wins',
      sourceLabel: 'Amabile & Kramer (2011) — Harvard Business Review · "The Progress Principle"',
      badge: 'Psicología organizacional',
      author: { name: 'Teresa Amabile', university: 'Harvard Business School', specialty: 'Creatividad, motivación y bienestar en el trabajo' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'Teresa Amabile y Steven Kramer pasaron años recogiendo datos de una manera que pocos investigadores han tenido la paciencia de sostener: pedían a trabajadores del conocimiento de distintas industrias que escribieran cada día, durante meses, una entrada de diario describiendo lo mejor y lo peor del día laboral. Al final, tenían 12.000 entradas. Cuando analizaron qué predecía los días de mayor motivación, creatividad y bienestar, encontraron algo que los propios directivos de las empresas no habían adivinado cuando se les preguntó: no era el reconocimiento, no era el salario, no era la relación con los compañeros. Era el progreso.',
      sections: [
        {
          subtitle: 'Los datos: los directivos no saben qué motiva a sus equipos',
          paragraphs: [
            'Antes de analizar los diarios, Amabile y Kramer encuestaron a 669 directivos de distintas industrias y les preguntaron cuáles eran, en su opinión, los factores que más influían en la motivación y el estado emocional de sus equipos. Los directivos colocaron el "progreso en el trabajo" en el quinto y último lugar de la lista, por detrás del reconocimiento, los incentivos, el apoyo interpersonal y los objetivos claros. El análisis de los 12.000 diarios lo colocaba en el primero. Con diferencia.',
            'El 76% de los días que los trabajadores describían como sus mejores días reportaban haber avanzado en un trabajo con sentido, aunque ese avance fuera pequeño. La correlación entre "hoy avancé" y "hoy me sentí bien en el trabajo" era la más alta del conjunto de variables analizadas. Y lo contrario también era cierto: los días más desmotivadores, con mayor bloqueo emocional y menor creatividad, eran los días en que el progreso se había frenado o revertido —no necesariamente por causas dramáticas, sino por pequeños obstáculos, cambios de prioridad o ausencia de recursos.'
          ]
        },
        {
          subtitle: 'El catalítico del progreso: el papel de los gestores y el entorno',
          paragraphs: [
            'Amabile y Kramer identificaron los factores que facilitan o bloquean el progreso diario. Los catalizadores: objetivos claros, autonomía, recursos suficientes y protección del tiempo de trabajo concentrado. Los inhibidores: cambios frecuentes de prioridades, burocracia que ralentiza sin añadir valor, reuniones que fragmentan el tiempo sin producir decisiones, y feedback que evalúa sin dar dirección. La distinción más importante: los gestores que generan mayor bienestar en sus equipos no son necesariamente los más empáticos o los más carismáticos, sino los que más consistentemente eliminan obstáculos y protegen el trabajo enfocado.',
            'La implicación para las organizaciones es estructural más que interpersonal: el bienestar en el trabajo no se gestiona principalmente con beneficios o con reconocimiento; se gestiona con el diseño del entorno de trabajo. Un entorno que permite avanzar en algo con sentido cada día produce motivación y bienestar de forma consistente. Un entorno que fragmenta constantemente el trabajo —con reuniones, cambios de prioridad e interrupciones— los destruye aunque el salario y el reconocimiento sean excelentes.'
          ]
        }
      ],
      blockquote: { text: '«De todas las cosas que pueden impulsar las emociones, la motivación y las percepciones durante la jornada laboral, la más importante es progresar en un trabajo con sentido.»', attribution: 'Teresa Amabile & Steven Kramer' },
      aplicacion: 'Al final de cada día de trabajo, escribe una sola frase que describa el avance más concreto que hiciste hoy. No "trabajé en X" sino "completé la sección Y" o "resolví el bloqueo Z". Ese acto de nombrar el progreso específico activa el circuito de recompensa y construye la inercia motivacional para mañana. Si no puedes escribir nada, es una señal valiosa: algo en el entorno o en el diseño del día estaba bloqueando el progreso.'
    },
    {
      id: 'tra-02',
      title: 'El crafting del trabajo: cómo rediseñar tu puesto desde dentro sin que nadie te lo pida',
      summary: 'Las personas que proactivamente remodelan las tareas, relaciones y significado de su trabajo reportan más engagement, más sentido y mejor desempeño — sin cambiar de empresa.',
      sourceUrl: 'https://doi.org/10.5465/AMR.2001.4378011',
      sourceLabel: 'Wrzesniewski & Dutton (2001) — Academy of Management Review',
      badge: 'Psicología del trabajo',
      author: { name: 'Amy Wrzesniewski', university: 'Universidad de Yale', specialty: 'Sentido del trabajo, identidad profesional y job crafting' },
      readingTime: '3 min',
      date: '26 de mayo de 2026',
      intro: 'Amy Wrzesniewski y Jane Dutton pasaron tiempo en un hospital observando y entrevistando al personal de limpieza. En teoría, este era uno de los roles más delimitados y menos autónomos del hospital: el puesto estaba completamente definido, las tareas eran fijas, el margen de decisión era mínimo. Sin embargo, algunos limpiadores describían su trabajo como una "vocación" y reportaban niveles de satisfacción y sentido comparables a los del personal médico. Cuando Wrzesniewski indagó en qué hacían diferente, encontró que habían rediseñado su trabajo sin que nadie se lo pidiera ni les autorizara.',
      sections: [
        {
          subtitle: 'El job crafting en acción: tres dimensiones de rediseño',
          paragraphs: [
            'Wrzesniewski y Dutton identificaron que los limpiadores con alta satisfacción habían realizado modificaciones autónomas en tres dimensiones. En las tareas: coordinaban con las enfermeras para limpiar las habitaciones de los pacientes en el momento más conveniente para su recuperación, elegían el orden de las limpiezas basándose en qué pacientes parecían más solos o más necesitados de un contacto humano, memorizaban los medicamentos de los pacientes para poder hablar con ellos de forma más informada. En las relaciones: habían construido vínculos con el personal médico que iban más allá de lo funcional. En el significado: se describían a sí mismos no como limpiadores sino como parte del equipo terapéutico del hospital.',
            'Ninguna de estas modificaciones requería autorización formal ni un cambio de posición. Eran reencuadres y expansiones informales del rol existente. Wrzesniewski llama a este proceso "job crafting" —artesanía del trabajo— para capturar la idea de que el trabajo no es un objeto fijo que se recibe, sino un material con el que uno trabaja activamente. Dentro de casi cualquier posición, existe margen para moldear las tareas, las relaciones y el sentido de formas que lo hagan más acorde a las propias fortalezas e intereses.'
          ]
        },
        {
          subtitle: 'Por qué el sentido importa más que el cargo',
          paragraphs: [
            'En una investigación paralela, Wrzesniewski encontró que la distinción más predictiva del bienestar en el trabajo no era el salario ni el cargo ni el nivel de autonomía formal: era la orientación de la persona hacia su trabajo. Identificó tres orientaciones distintas. Las personas que ven su trabajo como un "empleo" lo valoran principalmente como fuente de sustento; su satisfacción personal es externa al trabajo en sí. Las que lo ven como una "carrera" valoran el ascenso, el estatus y el avance. Las que lo ven como una "vocación" encuentran satisfacción intrínseca en las actividades del trabajo mismo y lo describirían como parte de lo que las define.',
            'La clave del hallazgo es que la orientación hacia la vocación no correlaciona con el tipo de trabajo ni con su estatus social: se encontraba tanto entre limpiadores de hospital como entre directivos, tanto entre trabajos manuales como intelectuales. Es una relación activamente construida con el trabajo, no una propiedad objetiva del puesto. Y el job crafting es el mecanismo concreto a través del cual las personas que reportan mayor sentido construyen esa relación.'
          ]
        }
      ],
      blockquote: { text: '«Los trabajadores no son recipientes pasivos del trabajo que se les asigna: son artesanos activos que modelan sus trabajos para que tengan sentido.»', attribution: 'Amy Wrzesniewski & Jane Dutton' },
      aplicacion: 'Identifica en tu trabajo actual: (1) una tarea que podrías añadir de forma informal porque te interesa y te da más sentido, (2) una que podrías delegar o reducir porque no conecta con lo que haces mejor, y (3) una relación profesional que podrías cultivar más porque te aporta o porque tu contribución es valiosa para esa persona. Estos tres cambios, hechos esta semana sin pedir permiso, constituyen un job craft mínimo pero real.'
    },
    {
      id: 'tra-03',
      title: 'Las reuniones destruyen el pensamiento: la evidencia sobre fragmentación cognitiva en el trabajo',
      summary: 'El trabajo creativo y cognitivamente exigente requiere bloques de atención sostenida que la cultura de reuniones y open offices sistemáticamente imposibilita.',
      sourceUrl: 'https://hbr.org/2016/01/collaborative-overload',
      sourceLabel: 'Cross, Rebele & Grant (2016) — Harvard Business Review · Bernstein & Turban (2018) — Phil. Trans.',
      badge: 'Neurociencia organizacional',
      author: { name: 'Rob Cross', university: 'Babson College', specialty: 'Redes organizacionales y colaboración' },
      readingTime: '3 min',
      date: '12 de mayo de 2026',
      intro: 'En 1999, el 20% del tiempo productivo de los trabajadores del conocimiento se consumía en reuniones y solicitudes de colaboración. En 2016, esa cifra había alcanzado el 80%. Rob Cross y sus colegas de Babson College documentaron este incremento en un estudio longitudinal de 300 organizaciones y lo denominaron "collaborative overload" —sobrecarga colaborativa—. La paradoja: en nombre de la colaboración, las organizaciones habían creado entornos donde era estructuralmente imposible hacer el trabajo que requiere colaboración.',
      sections: [
        {
          subtitle: 'Los datos: cuánto tiempo hay disponible para pensar',
          paragraphs: [
            'Cross y sus colegas encontraron que los trabajadores que más tiempo dedicaban a colaborar, reunirse y responder solicitudes de ayuda eran también los que reportaban mayor agotamiento, menor satisfacción y peor rendimiento en las métricas más exigentes. La colaboración excesiva no producía más output creativo: producía más ocupación y menos producción real. Y el efecto se intensificaba en los perfiles más capaces: los trabajadores con más expertise eran los que más solicitudes de colaboración recibían y, por tanto, los que menos tiempo tenían para hacer el trabajo que hacía valioso su expertise.',
            'El análisis de Gloria Mark (UC Irvine) añade la dimensión del tiempo de recuperación: una interrupción —aunque sea responder un mensaje de 30 segundos— requiere una media de 23 minutos para recuperar el estado de concentración previo. En un día de trabajo estándar con reuniones, notificaciones y peticiones distribuidas a lo largo de la jornada, los "bloques de atención sostenida" —fragmentos de más de 90 minutos sin interrupción— prácticamente no existen. Y es en esos bloques donde ocurre el pensamiento que no puede ocurrir en ninguna reunión.'
          ]
        },
        {
          subtitle: 'La oficina abierta: el entorno diseñado para la interrupción',
          paragraphs: [
            'Ethan Bernstein y Stephen Turban estudiaron en 2018 qué ocurrió con la interacción real en empresas que eliminaron las paredes para instalar espacios abiertos. La paradoja fue completa: la interacción cara a cara —que las open offices pretendían promover— cayó un 70% tras la transición. La interacción digital —mensajes, emails— se incrementó en la misma proporción. Las personas habían respondido al exceso de exposición social con una retirada cognitiva: se pusieron auriculares, bajaron la mirada, crearon barreras invisibles. La arquitectura diseñada para fomentar la colaboración había conseguido exactamente lo contrario.',
            'El problema no es la colaboración en sí —que es esencial para el trabajo complejo— sino la distinción entre colaboración de alta calidad (reuniones con propósito específico, bien preparadas, con decisiones concretas al final) y colaboración de baja calidad (interrupciones, presencia por visibilidad, reuniones sin agenda). Las organizaciones que han mejorado tanto la colaboración como el trabajo individual tienen algo en común: han normalizado los bloques de tiempo protegido como un derecho, no como un lujo o una señal de antisocialidad.'
          ]
        }
      ],
      blockquote: { text: '«Las organizaciones han confundido la ocupación con la productividad, la presencia con la contribución, y la colaboración constante con el trabajo colaborativo de calidad.»', attribution: 'Rob Cross & Adam Grant' },
      aplicacion: 'Protege al menos un bloque de 90 minutos cada día donde no hay reuniones posibles y las notificaciones están desactivadas. No como productividad personal: como la condición mínima para hacer el tipo de trabajo que no puede hacerse en ninguna reunión. Si tu organización no te lo permite, negocia esa protección como parte de tus condiciones de trabajo. Lo que no se nombra no se defiende.'
    },
    {
      id: 'tra-04',
      title: 'Burnout: la diferencia entre estar cansado y estar quemado — y por qué importa',
      summary: 'Christina Maslach identificó las tres dimensiones del burnout y demostró que el problema no es el trabajador que no resiste: es el entorno que no permite que nadie resista durante demasiado tiempo.',
      sourceUrl: 'https://doi.org/10.1146/annurev.psych.52.1.397',
      sourceLabel: 'Maslach, Schaufeli & Leiter (2001) — Annual Review of Psychology',
      badge: 'Psicología organizacional',
      author: { name: 'Christina Maslach', university: 'Universidad de California, Berkeley', specialty: 'Burnout, bienestar laboral y psicología organizacional' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'El burnout se menciona constantemente pero se entiende poco. No es estrés crónico, ni agotamiento puntual, ni la simple consecuencia de trabajar mucho. Christina Maslach lleva cuarenta años estudiando el fenómeno y ha llegado a una conclusión que incomoda a muchas organizaciones: el burnout no es un problema del individuo que no aguanta. Es el síntoma de un entorno de trabajo que tiene demandas que ningún ser humano puede sostener indefinidamente.',
      sections: [
        { subtitle: 'El MBI y las tres dimensiones: agotamiento, cinismo, ineficacia', paragraphs: ['Maslach desarrolló el Maslach Burnout Inventory (MBI) en 1981 como el primer instrumento psicométrico validado para medir el burnout. El modelo describe tres dimensiones que no son simplemente síntomas, sino aspectos de una transformación progresiva en la relación de la persona con su trabajo. El agotamiento emocional es la dimensión central: la sensación de estar vaciado, de no tener más recursos emocionales que dar. La despersonalización —el cinismo— es la respuesta defensiva al agotamiento: distanciarse emocionalmente del trabajo y de las personas involucradas. La reducción de la eficacia personal es el colapso de la sensación de competencia y logro.', 'El burnout no es un estado discreto sino un continuo. Su opuesto en el MBI es el engagement: energía en lugar de agotamiento, dedicación en lugar de cinismo, eficacia en lugar de ineficacia. Y lo que Maslach documenta con datos es que el paso de uno al otro no depende primariamente de la cantidad de trabajo, sino de seis dimensiones del entorno laboral: la carga de trabajo, el control, la recompensa, la comunidad, la equidad y los valores.'] },
        { subtitle: 'El error del "individuo quemado": burnout como problema sistémico', paragraphs: ['La consecuencia más importante —y más ignorada— de la investigación de Maslach es que el burnout es fundamentalmente un problema del contexto, no del carácter. Sus estudios comparativos entre organizaciones muestran que las tasas de burnout varían de forma dramática entre equipos que realizan trabajos similares en la misma empresa, dependiendo del liderazgo, la cultura y el diseño del trabajo.', 'Las intervenciones puramente individuales —mindfulness corporativo, resiliencia, técnicas de gestión del estrés— tienen eficacia limitada y a veces contraproducente: ofrecen al individuo herramientas para adaptarse a un entorno que sigue siendo dañino, lo que puede retrasar el reconocimiento del problema organizacional y culpabilizar implícitamente al trabajador por no "gestionarlo mejor". Maslach argumenta que la única intervención duradera es cambiar las condiciones que generan el desajuste.'] }
      ],
      blockquote: { text: '«No se trata de que las personas fallen en el trabajo: se trata de que el trabajo está fallando en las personas. El burnout es la señal de ese fallo.»', attribution: 'Christina Maslach' },
      aplicacion: 'Si sospechas que estás en un proceso de burnout, evalúa las seis dimensiones de Maslach en tu trabajo actual: ¿Es la carga manejable? ¿Tienes control sobre cómo realizas tu trabajo? ¿El reconocimiento es proporcional al esfuerzo? ¿Hay un sentido genuino de comunidad? ¿Percibes equidad? ¿Los valores del lugar coinciden con los tuyos? Más de dos "no" sostenidos en el tiempo es el perfil de entorno que genera burnout en la mayoría de las personas, independientemente de su resiliencia personal.'
    },
    {
      id: 'tra-05',
      title: 'Por qué los bonus no funcionan: la teoría de la autodeterminación aplicada al trabajo',
      summary: 'Deci y Ryan demostraron que las recompensas externas contingentes no solo no mejoran el rendimiento en tareas complejas: activamente destruyen la motivación intrínseca que ya existía.',
      sourceUrl: 'https://doi.org/10.1037/0033-2909.125.6.627',
      sourceLabel: 'Deci, Koestner & Ryan (1999) — Psychological Bulletin',
      badge: 'Psicología del trabajo',
      author: { name: 'Edward Deci', university: 'Universidad de Rochester', specialty: 'Teoría de la Autodeterminación, motivación intrínseca y bienestar' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'La gestión empresarial lleva más de un siglo construida sobre un axioma que parece de sentido común: las personas trabajan más si se les paga más. Sin embargo, desde los años 70, la psicología ha acumulado evidencia que pone en cuestión ese axioma de forma sistemática —no para todas las tareas, no en todos los contextos, pero con suficiente consistencia como para que ignorarla sea una decisión cara.',
      sections: [
        { subtitle: 'El experimento fundacional y el metaanálisis de 128 estudios', paragraphs: ['En 1971, Edward Deci reclutó a estudiantes universitarios para resolver puzzles interesantes, sin ningún tipo de recompensa. En la segunda sesión, pagó a la mitad por cada puzzle resuelto. En la tercera sesión, retiró el pago para todos. El grupo que había sido pagado pasó significativamente menos tiempo con los puzzles que antes de que existiera la recompensa. El pago no había añadido motivación: había sustituido la motivación interna por una externa, y al retirarla, la motivación no regresó a su nivel original.', 'En 1999, Deci, Koestner y Ryan publicaron el metaanálisis más exhaustivo sobre el tema: 128 estudios controlados, con más de 15.000 participantes. La conclusión fue robusta: las recompensas externas tangibles contingentes al rendimiento reducen la motivación intrínseca de forma estadísticamente significativa y replicable. El efecto es más pronunciado en tareas que implican interés, creatividad o comprensión profunda —exactamente las que importan en el trabajo del conocimiento.'] },
        { subtitle: 'Las necesidades psicológicas básicas y el entorno que las satisface', paragraphs: ['La Teoría de la Autodeterminación (SDT) de Deci y Ryan propone que los seres humanos tienen tres necesidades psicológicas básicas cuya satisfacción predice la motivación intrínseca: autonomía (sentir que uno es el origen de sus acciones), competencia (sentir que mejora y es eficaz) y vinculación (sentir conexión genuina con las personas con quienes trabaja). Cuando las tres están satisfechas, la motivación intrínseca florece.', 'El diseño de puestos de trabajo óptimo, desde la SDT, no consiste en añadir incentivos económicos: consiste en diseñar condiciones que nutran las tres necesidades básicas. Dar autonomía en cómo se ejecuta el trabajo, crear oportunidades reales de desarrollo de competencia, y cultivar relaciones de trabajo donde las personas se sienten valoradas como personas y no solo como recursos. Este diseño predice mejor el rendimiento a largo plazo que los sistemas de incentivos económicos más elaborados.'] }
      ],
      blockquote: { text: '«Si quieres que alguien deje de disfrutar algo que ya le gusta, págale por hacerlo. El dinero convierte la actividad en trabajo, y el trabajo requiere pago para continuarse.»', attribution: 'Edward Deci' },
      aplicacion: 'Si eres responsable de personas, revisa tu sistema de incentivos: ¿estás pagando por tareas donde ya existe motivación intrínseca? El reconocimiento no esperado —específico y centrado en el proceso, no en el resultado— preserva la motivación intrínseca mejor que el bonus predecible. Y dar más autonomía en el cómo suele mejorar el rendimiento más que cualquier incentivo económico equivalente.'
    }
  ],

  politica: [
    {
      id: 'pol-01',
      title: 'Por qué tus emociones votan antes que tú',
      summary: 'Haidt demostró que los juicios morales y políticos no se forman razonando: el cerebro decide por intuición primero, y los argumentos se fabrican después para justificarlo.',
      sourceUrl: 'https://doi.org/10.1037/0033-295X.108.4.814',
      sourceLabel: 'Haidt (2001) — Psychological Review',
      badge: 'Intuicionismo moral',
      author: { name: 'Jonathan Haidt', university: 'New York University Stern School of Business', specialty: 'Psicología Moral y Social' },
      readingTime: '4 min',
      date: '2 de junio de 2026',
      intro: 'En 1999, Jonathan Haidt presentó a cientos de estudiantes universitarios una serie de escenarios diseñados para provocar repulsión moral sin que hubiera daño real. En uno de ellos, dos hermanos adultos que viajan solos deciden tener sexo una sola vez, de mutuo acuerdo, usando anticonceptivos, y nunca se lo cuentan a nadie. Ambos lo recuerdan como una experiencia que los unió. La pregunta era simple: ¿hicieron algo malo? La gran mayoría respondió que sí, de forma inmediata y con convicción. Cuando se les pedía que explicaran por qué, llegaban a un punto en el que se les habían agotado los argumentos —pero seguían tan convencidos como antes. A ese fenómeno Haidt lo llamó "perplejidad moral": saber que algo está mal sin poder decir por qué.',
      sections: [
        {
          subtitle: 'El experimento del tabú inocuo y la perplejidad moral',
          paragraphs: [
            'Haidt diseñó varios escenarios de "tabú inocuo": situaciones que generaban respuesta moral negativa aunque no implicaran ningún daño verificable. Además del incesto consentido, presentó otro en el que una familia cocinaba y comía a su perro tras haberle atropellado un coche, o un hombre que usaba una bandera nacional como paño de limpieza en su casa y completamente en privado. En todos los casos, los participantes emitían un juicio moral de forma casi instantánea —"esto está mal"— y con alta certeza.',
            'Lo revelador llegaba en el interrogatorio posterior. Cuando los investigadores refutaban sistemáticamente cada argumento del participante —"pero no hay víctima", "nadie lo sabe", "no hay consecuencias"— los sujetos reconocían que sus argumentos eran inválidos, pero no cambiaban su juicio. Se quedaban "moralmente perplejos": sin argumentos válidos que esgrimir, pero aún completamente seguros de que el acto era moralmente reprobable. Haidt interpretó esto como evidencia de que el juicio no había surgido del razonamiento —porque el razonamiento se acababa antes— sino de una intuición emocional previa a cualquier deliberación.'
          ]
        },
        {
          subtitle: 'El mecanismo: el perro emocional y su cola racional',
          paragraphs: [
            'El modelo que Haidt propuso en 2001 invirtió el orden asumido por dos milenios de filosofía moral. La visión dominante —desde Platón hasta Kohlberg— sostenía que los juicios morales son el producto del razonamiento: primero se valoran los hechos, luego se aplican principios, y el resultado es el juicio. Haidt argumentó que el proceso es el inverso: una respuesta intuitiva rápida —emocional, automática, inconsciente— genera el juicio; el razonamiento llega después con el único propósito de justificarlo ante los demás.',
            'La metáfora que acuñó es tan precisa que se convirtió en el título del artículo: "el perro emocional y su cola racional". El perro —la intuición— va delante y marca la dirección. La cola —el razonamiento— sigue detrás, agitándose para aparentar que conduce. El razonamiento moral, en este modelo, cumple una función primariamente social: no nos ayuda a descubrir qué es correcto, sino a convencer a los demás de que nuestra posición ya formada es correcta. Esto tiene una consecuencia directa para el debate político: si ambas partes llegan a la conversación con intuiciones ya formadas y razonamientos diseñados para defenderlas, el debate rara vez cambia opiniones. Solo lo hacen las experiencias que alteran la intuición subyacente.'
          ]
        }
      ],
      blockquote: { text: '«El razonamiento moral no nos lleva a conclusiones. Nos ayuda a defender las que ya habíamos alcanzado por otro camino.»', attribution: 'Jonathan Haidt' },
      aplicacion: 'La próxima vez que debatas política, hazte esta pregunta antes de hablar: ¿sabía ya lo que iba a concluir antes de escuchar los argumentos? Si la respuesta es sí, puede que estés racionalizando una intuición, no razonando desde premisas. Los debates que sí cambian mentes no presentan mejores argumentos: presentan experiencias o perspectivas que reencuadran la intuición original.'
    },
    {
      id: 'pol-02',
      title: 'Por qué los argumentos contrarios te convencen menos si ya tienes opinión',
      summary: 'Las personas con mayor conocimiento político son más —no menos— resistentes a la información que contradice sus creencias. La sofisticación amplifica el sesgo, no lo reduce.',
      sourceUrl: 'https://doi.org/10.1111/j.1540-5907.2006.00214.x',
      sourceLabel: 'Taber & Lodge (2006) — American Journal of Political Science',
      badge: 'Razonamiento motivado',
      author: { name: 'Charles S. Taber', university: 'Stony Brook University', specialty: 'Psicología Política y Cognición Social' },
      readingTime: '4 min',
      date: '26 de mayo de 2026',
      intro: 'Durante décadas, la teoría democrática asumió que el problema de la polarización política se resolvería con más educación: ciudadanos mejor informados tomarían decisiones más racionales y se mostrarían más abiertos a la evidencia. En 2006, Charles Taber y Milton Lodge demostraron en un experimento controlado que lo opuesto es cierto: cuanto más sofisticado políticamente es alguien, más eficaz es su cerebro para rechazar la información que amenaza sus creencias. El conocimiento no reduce el sesgo; le proporciona munición.',
      sections: [
        {
          subtitle: 'El experimento: cómo procesa la información política el cerebro comprometido',
          paragraphs: [
            'Taber y Lodge reclutaron 130 participantes con distintos niveles de conocimiento político y diferentes posiciones sobre acción afirmativa y control de armas —dos temas con fuerte carga ideológica en el contexto estadounidense. Se les presentaron argumentos reales a favor y en contra de cada posición, y debían leerlos y evaluarlos mientras los investigadores registraban el tiempo de lectura y las notas de valoración de cada argumento.',
            'Los resultados mostraron dos sesgos sistemáticos. El primero fue el "efecto de actitud previa": antes de leer cualquier argumento, la mera mención del tema político activaba automáticamente una respuesta afectiva (positiva o negativa) que condicionaba la evaluación subsiguiente. El segundo, y más sorprendente, fue el "sesgo de desconfirmación": los participantes dedicaban significativamente más tiempo a leer los argumentos que contradecían su posición —no para asimilarlos, sino para encontrar sus fallos. Y cuanto mayor era el conocimiento político del participante, más eficaz era en esa búsqueda de defectos. El efecto se invirtió respecto a lo esperado: la sofisticación amplificaba el sesgo.'
          ]
        },
        {
          subtitle: 'El mecanismo: el cerebro político como abogado defensor',
          paragraphs: [
            'Taber y Lodge distinguen dos componentes del razonamiento motivado aplicado a la política. El primero es el sesgo de confirmación: tendemos activamente a buscar información que confirme lo que ya creemos. El segundo es el sesgo de desconfirmación: cuando nos exponemos a información contraria, la escrutamos con un estándar más exigente, buscamos inconsistencias internas, cuestionamos la fiabilidad de las fuentes, y generamos contraargumentos de forma automática. La persona con más conocimiento político dispone de un arsenal más rico de contraargumentos, lo que la hace más hábil en desestimar evidencia incómoda.',
            'La paradoja del ciudadano informado, como la llaman los autores, tiene consecuencias relevantes para el debate público: aumentar la disponibilidad de información política no produce, por sí solo, ciudadanos más racionales ni debates más productivos. Los mecanismos de búsqueda de información están contaminados desde el origen por las actitudes previas. El antídoto que la investigación sugiere no es "más información", sino desarrollar conciencia metacognitiva sobre cuándo uno está actuando como juez (buscando la verdad) y cuándo como abogado (buscando argumentos para una causa ya elegida). Esa distinción, aunque simple, rara vez se enseña.'
          ]
        }
      ],
      blockquote: { text: '«El conocimiento político no hace a las personas más abiertas a la evidencia contraria. Les da mejores herramientas para descartarla.»', attribution: 'Charles S. Taber' },
      aplicacion: 'Antes de rechazar un argumento político con el que no estás de acuerdo, hazte esta pregunta: ¿buscarías los mismos defectos si el argumento apoyara tu posición? Si la respuesta es no, estás aplicando un estándar doble. La heurística más eficaz contra el razonamiento motivado no es leer más: es intentar formular la versión más sólida posible del argumento contrario antes de refutarlo.'
    },
    {
      id: 'pol-03',
      title: 'La polarización que no es ideológica: por qué nos caemos mal aunque pensemos parecido',
      summary: 'Stanford midió 40 años de datos electorales y encontró que la antipatía entre partidos creció mucho más que las diferencias ideológicas reales. La guerra política es más tribal que doctrinal.',
      sourceUrl: 'https://doi.org/10.1093/poq/nfs038',
      sourceLabel: 'Iyengar, Sood & Lelkes (2012) — Public Opinion Quarterly',
      badge: 'Polarización afectiva',
      author: { name: 'Shanto Iyengar', university: 'Stanford University', specialty: 'Psicología Política y Comunicación' },
      readingTime: '4 min',
      date: '19 de mayo de 2026',
      intro: 'Si le preguntas a un demócrata típico cuántos republicanos son "extremistas", te dirá que alrededor del 70%. Si le preguntas a un republicano lo mismo sobre los demócratas, obtendrás una cifra similar. La realidad, medida en encuestas con muestras representativas, es que esos extremistas no llegan al 30% en ninguno de los dos grupos. Pero la percepción distorsionada importa tanto como la realidad: cuando crees que el otro bando es más radical de lo que es, tu hostilidad hacia él se calibra sobre esa percepción, no sobre los hechos. Iyengar y sus colegas de Stanford pasaron cuatro décadas midiendo cómo esta hostilidad —independientemente de su justificación ideológica— no ha parado de crecer.',
      sections: [
        {
          subtitle: 'Cuarenta años de termómetro afectivo: los datos de Stanford',
          paragraphs: [
            'Iyengar, Sood y Lelkes analizaron datos de los American National Election Studies desde 1972 hasta 2012, una fuente que incluye miles de entrevistas representativas cada dos años. Utilizaron una medida clásica de psicología política llamada "termómetro de sentimientos": se pide al encuestado que evalúe su temperatura emocional hacia distintos grupos políticos en una escala de 0 (hostilidad máxima) a 100 (máxima simpatía). La diferencia entre la temperatura promedio que los demócratas asignan a otros demócratas y la que asignan a los republicanos —y viceversa— mide la "polarización afectiva".',
            'El resultado fue llamativo. Durante los años 70, la diferencia promedio entre in-group y out-group era de unos 23 puntos. Para 2012, había crecido hasta 40 puntos. En paralelo, el análisis de las posiciones declaradas sobre políticas concretas —impuestos, sanidad, inmigración— mostró un crecimiento mucho más modesto en la distancia ideológica real. El gap emocional entre partidos creció casi el doble que el gap de posiciones. La conclusión central del estudio: los americanos no se han vuelto más polarizados en sus ideas; se han vuelto más polarizados en su antipatía mutua.'
          ]
        },
        {
          subtitle: 'El mecanismo: cuando el partido se convierte en identidad social',
          paragraphs: [
            'Iyengar y sus colegas interpretaron este patrón desde la teoría de la identidad social de Tajfel y Turner: las personas definen parte de su autoconcepto a través de los grupos a los que pertenecen, y esa pertenencia activa automáticamente el favoritismo hacia el in-group y la desconfianza hacia el out-group, independientemente de los contenidos ideológicos del grupo. Cuando la afiliación partidista se convierte en una identidad central —comparable en importancia a la religión o la etnia en generaciones anteriores— la hostilidad hacia el otro partido deja de necesitar justificación ideológica: es simplemente la respuesta natural a quienes no son "como nosotros".',
            'Las consecuencias prácticas son profundas. Los autores documentaron que la afiliación política afecta cada vez más la elección de barrio, de pareja, de amistades y de empleados: en 2010, el 49% de los republicanos y el 33% de los demócratas declararían sentirse "disgustados" si su hijo se casara con alguien del partido contrario, frente a valores inferiores al 10% medidos en 1960. La polarización no es solo una cuestión de qué pensamos sobre políticas: es una reconfiguración de a quién consideramos "nuestros".'
          ]
        }
      ],
      blockquote: { text: '«Los americanos no se han vuelto más distintos en sus ideas políticas. Se han vuelto más distintos en cuánto se desagradan mutuamente.»', attribution: 'Shanto Iyengar' },
      aplicacion: 'Cuando sientas rechazo hacia alguien por su posición política, hazte esta pregunta: ¿estás reaccionando a sus ideas concretas o a la señal de tribu que representan? La distinción importa porque solo la primera tiene solución a través del diálogo. Reducir el contacto con el "termómetro afectivo" propio —qué tan caliente o frío te sientes hacia el grupo contrario— es el primer paso para evitar que la identidad tribal reemplace al juicio.'
    },
    {
      id: 'pol-04',
      title: 'Tu personalidad predice tu voto mejor que tus argumentos',
      summary: 'La apertura a la experiencia y la escrupulosidad del modelo de los Cinco Grandes predicen la orientación política de forma robusta, incluso a través de diferentes culturas e idiomas.',
      sourceUrl: 'https://doi.org/10.1111/j.1467-9221.2008.00668.x',
      sourceLabel: 'Carney, Jost, Gosling & Potter (2008) — Political Psychology',
      badge: 'Personalidad y política',
      author: { name: 'John T. Jost', university: 'New York University', specialty: 'Psicología Social y Política' },
      readingTime: '3 min',
      date: '12 de mayo de 2026',
      intro: 'Si entras en el dormitorio de alguien sin saber nada sobre sus opiniones políticas, puedes predecir su orientación ideológica con una precisión significativamente mejor que el azar solo mirando sus estanterías, el orden de su espacio y los objetos que ha elegido exponer. Eso es lo que Dana Carney, John Jost y sus colegas demostraron en 2008, y lo que hace del estudio uno de los más citados de la psicología política de las dos últimas décadas: la política no empieza en los argumentos; empieza en la personalidad.',
      sections: [
        {
          subtitle: 'El experimento: qué revela tu habitación sobre tu voto',
          paragraphs: [
            'Carney y su equipo reclutaron a estudiantes universitarios en Estados Unidos y Canadá. Primero midieron su orientación política con escalas estándar y sus rasgos de personalidad con el NEO-PI-R, el cuestionario más validado del modelo de los Cinco Grandes. Después, enviaron evaluadores que inspeccionaban los dormitorios de los participantes sin saber nada de su política y registraban sistemáticamente qué objetos contenían: libros y su variedad temática, música, fotografías, artículos de limpieza y organización, decoración, artículos deportivos, elementos identitarios como banderas.',
            'Los patrones fueron claros y replicables. Los espacios de los participantes con orientación liberal contenían más libros (y de mayor variedad temática), más obras de arte, más artículos vinculados a viajes y otras culturas, y un mayor nivel de desorden funcional. Los espacios de los conservadores estaban más organizados, contenían más material de limpieza, más artículos deportivos y más elementos identitarios. Más relevante aún: estas diferencias espaciales correlacionaban directamente con los rasgos de personalidad. Apertura a la experiencia predecía orientación liberal con un coeficiente de correlación de en torno a .40. Escrupulosidad —en especial la subfaceta de orden— predecía orientación conservadora con fuerza comparable.'
          ]
        },
        {
          subtitle: 'El mecanismo: la ideología como función psicológica',
          paragraphs: [
            'Jost ha articulado durante dos décadas una teoría que denomina "cognición social motivada": las personas adoptan ideologías políticas que satisfacen necesidades psicológicas básicas. La apertura a la experiencia —comodidad con la ambigüedad, la novedad y la complejidad— hace a las personas más receptivas a cambios sociales, diversidad y políticas que amplían el espacio de lo posible. La escrupulosidad y la necesidad de orden hacen a las personas más receptivas a instituciones estables, normas claras y políticas que preservan estructuras conocidas. En ambos casos, la ideología no es solo un conjunto de posiciones sobre temas concretos: es un sistema coherente con la arquitectura de la personalidad.',
            'Esto no implica determinismo ni superioridad de ninguna orientación. La apertura y la escrupulosidad son rasgos adaptativos en distintos contextos, y la distribución de orientaciones en una sociedad puede interpretarse como una división funcional del trabajo entre personas que valoran el cambio y personas que valoran la estabilidad. Lo que sí implica, con fuerza, es que cambiar la opinión política de alguien mediante argumentos tiene un límite: los argumentos operan en la superficie de creencias que están enraizadas en la personalidad. La persuasión política eficaz no ataca las posiciones; reencuadra los valores subyacentes.'
          ]
        }
      ],
      blockquote: { text: '«La ideología política es, en gran medida, la personalidad aplicada a la organización de la sociedad.»', attribution: 'John T. Jost' },
      aplicacion: 'Si quieres entender por qué alguien tiene las opiniones políticas que tiene —incluidas las tuyas—, pregúntate primero qué necesidades psicológicas satisfacen esas opiniones: ¿necesidad de orden y predictibilidad, o de apertura y cambio? Esa pregunta llega más lejos que analizar los argumentos, porque los argumentos son la punta del iceberg.'
    }
  ],

  alimentacion: [
    {
      id: 'ali-01',
      title: 'Por qué comes casi el doble cuando estás en compañía',
      summary: 'El número de personas en la mesa predice la ingesta calórica mejor que el hambre. Con seis o más comensales, comemos de media un 76 % más que en solitario.',
      sourceUrl: 'https://doi.org/10.1016/0031-9384(94)90286-0',
      sourceLabel: 'de Castro (1994) — Physiology & Behavior',
      badge: 'Facilitación social',
      author: { name: 'John M. de Castro', university: 'Sam Houston State University', specialty: 'Psicobiología de la Alimentación' },
      readingTime: '3 min',
      date: '2 de junio de 2026',
      intro: 'Hay una variable que predice cuánto vas a comer en tu próxima comida mejor que tu nivel de hambre, que el tipo de alimento y que la hora del día. Esa variable es cuántas personas se sientan contigo a la mesa. John de Castro lo midió durante años en condiciones de vida real, con miles de episodios de ingesta documentados con precisión de diario, y encontró que el efecto social sobre la cantidad comida es uno de los más robustos y sistemáticamente infravalorados de toda la psicología de la alimentación.',
      sections: [
        {
          subtitle: 'El experimento: 365 días de diarios alimentarios en condiciones reales',
          paragraphs: [
            'De Castro diseñó una metodología que resolvía uno de los problemas crónicos de la investigación nutricional: el laboratorio artificial. En lugar de llevar a participantes a un contexto controlado, les entregó diarios estructurados y les pidió que registraran durante siete días consecutivos cada episodio de ingesta: qué comieron, cuándo, dónde, cuánta hambre tenían antes de empezar, cómo estaba su estado de ánimo, y —la variable clave— cuántas personas estaban presentes. El análisis acumuló más de 2.600 episodios de comida a lo largo de varios estudios.',
            'Los resultados fueron consistentes y de gran magnitud. Comer con una persona adicional aumentaba la ingesta media un 33 % respecto a comer solo. Con dos comensales más, el incremento llegaba al 47 %. Con cuatro, al 58 %. Con seis o más personas en la mesa, el efecto alcanzaba el 76 %. El análisis estadístico confirmó que el número de comensales predecía la ingesta mejor que el nivel de hambre autoreportado, mejor que el tipo de comida y mejor que el momento del día. Y crucialmente: los participantes no percibían que estaban comiendo más. El exceso de ingesta ocurría por debajo del umbral de conciencia.'
          ]
        },
        {
          subtitle: 'El mecanismo: la duración de la comida y el contagio de normas sociales',
          paragraphs: [
            'De Castro identificó dos mecanismos que operan en paralelo. El primero es mecánico: las comidas en compañía duran más, porque la conversación dilata el tiempo en la mesa. Y más tiempo en la mesa equivale a más oportunidades de servirse, de picar o de aceptar lo que ofrecen. El segundo mecanismo es social: comemos ajustándonos inconscientemente al ritmo y la cantidad de nuestros comensales. Cuando todos toman postre, el umbral cognitivo para tomarlo uno mismo baja; cuando alguien repite, el permiso implícito de repetir aumenta. Estas normas no se negocian explícitamente: se contagian.',
            'El efecto era mayor con familia y amigos que con extraños, porque la relajación en contextos de confianza reduce la vigilancia sobre la propia ingesta. Con familiares cercanos, el comer se convierte en un acto de pertenencia y afecto, no solo de nutrición, lo que desacopla la señal de hambre de la señal de parar. Desde una perspectiva evolutiva, compartir comida con aliados de confianza era —y sigue siendo— una de las señales más potentes de vínculo social, lo que hace plausible que el cerebro haya "aprendido" a extender la duración de esas comidas más allá de lo que dictan las necesidades calóricas.'
          ]
        }
      ],
      blockquote: { text: '«No comemos según el hambre que tenemos. Comemos según cuántos nos acompañan.»', attribution: 'John M. de Castro' },
      aplicacion: 'Si tu objetivo es controlar la ingesta calórica, el entorno social es una palanca más poderosa que la fuerza de voluntad individual. Saber que en grupos grandes comerás más te permite tomar decisiones preventivas: servírte menos en el plato inicial, pedir a alguien que no repita contigo, o al menos ser consciente del mecanismo cuando notes que sigues comiendo aunque ya no tengas hambre.'
    },
    {
      id: 'ali-02',
      title: 'Cómo tus emociones controlan lo que comes aunque creas que no',
      summary: 'Las emociones no solo influyen en la cantidad de comida: determinan el tipo de alimento, el ritmo de ingesta y la experiencia de cada bocado, a través de cinco rutas psicológicas distintas.',
      sourceUrl: 'https://doi.org/10.1016/j.appet.2007.07.002',
      sourceLabel: 'Macht (2008) — Appetite',
      badge: 'Alimentación emocional',
      author: { name: 'Michael Macht', university: 'University of Würzburg', specialty: 'Psicología de la Alimentación y las Emociones' },
      readingTime: '4 min',
      date: '26 de mayo de 2026',
      intro: 'La relación entre emociones y comida es una de las más discutidas en psicología clínica, pero también una de las más malentendidas. Durante décadas se habló de "comer emocional" como si fuera un fenómeno unitario: las personas tristes o estresadas comen más. Michael Macht revisó sistemáticamente la literatura disponible y propuso, en 2008, un modelo de cinco vías que demostró que la realidad es considerablemente más compleja: emociones distintas producen efectos opuestos sobre la ingesta, y el mismo estado emocional puede aumentar o reducir la apetencia dependiendo de la intensidad, el tipo de alimento y la historia personal del individuo.',
      sections: [
        {
          subtitle: 'Las cinco vías: por qué el miedo reduce el apetito y el aburrimiento lo dispara',
          paragraphs: [
            'Macht integró los hallazgos de más de 200 estudios en un modelo de cinco rutas. La primera vía es la supresión emocional de la ingesta: emociones de alta activación negativa —miedo intenso, asco, ansiedad aguda— activan el eje hipotalámico-hipofisario-adrenal y producen respuesta de estrés fisiológico que bloquea las señales de hambre. El cerebro interpreta la amenaza como incompatible con la ingesta: "esto no es momento de comer". La segunda vía es la inversa: emociones de baja activación, especialmente el aburrimiento y la tristeza moderada, no activan el sistema de alarma pero sí aumentan la búsqueda de estimulación, y la comida —especialmente la palatablemente rica en grasa y azúcar— actúa como estímulo accesible y predecible.',
            'Las otras tres vías son igualmente relevantes. La tercera es la regulación activa: el individuo usa deliberadamente la comida como herramienta para gestionar estados emocionales desagradables. La cuarta es el efecto de la emoción sobre la experiencia misma de comer: bajo estados emocionales negativos, el individuo come más rápido, presta menos atención al sabor y reporta menor placer por bocado. La quinta vía es la que modula todas las anteriores: los rasgos individuales de "alimentación emocional", medidos con cuestionarios como el DEBQ de Van Strien, determinan en qué medida el sistema de regulación emocional de una persona está conectado con la conducta alimentaria. Alguien con alta puntuación en alimentación emocional responderá a las mismas emociones con patrones de ingesta muy distintos a alguien con baja puntuación.'
          ]
        },
        {
          subtitle: 'El ciclo de regulación: por qué funciona a corto plazo y falla a largo',
          paragraphs: [
            'El aspecto más importante del modelo de Macht para la práctica cotidiana es la tercera vía: la comida como herramienta de regulación emocional. El mecanismo funciona: comer alimentos palatables libera dopamina en el estriado ventral, activa el sistema de recompensa y produce una reducción real y medible de la activación emocional negativa. El problema no es que no funcione —es que funciona demasiado bien a corto plazo. Esa eficacia inmediata es exactamente lo que convierte el comportamiento en un hábito.',
            'A largo plazo, el ciclo presenta dos problemas. El primero es que comer no resuelve la emoción subyacente: la atenúa temporalmente, pero la causa permanece. El segundo es el aprendizaje condicionado: el cerebro asocia progresivamente el estado emocional negativo con el alivio que proviene de la comida, de modo que basta con anticipar la emoción para que aparezca el deseo de comer. Las empresas de alimentación ultra-procesada comprenden este mecanismo mejor que la mayoría de consumidores: sus productos están formulados para maximizar la respuesta hedónica inmediata y el alivio emocional a corto plazo, optimizando exactamente la parte del ciclo que genera dependencia.'
          ]
        }
      ],
      blockquote: { text: '«El comer emocional no es una debilidad de carácter. Es el resultado de un sistema de regulación que funciona bien a corto plazo y que nadie te enseñó a gestionar de otro modo.»', attribution: 'Michael Macht' },
      aplicacion: 'Antes de comer cuando no tienes hambre física, nombra la emoción que estás sintiendo. Investigación de Brené Brown y otros ha mostrado que poner nombre a una emoción —"estoy ansioso", "estoy aburrido", "me siento solo"— reduce su intensidad y activa la corteza prefrontal, lo que abre un espacio entre el impulso y la acción. No siempre es suficiente para romper el ciclo, pero es el primer paso necesario.'
    },
    {
      id: 'ali-03',
      title: 'La paradoja de las dietas: por qué prohibirte un alimento dispara el deseo de comerlo',
      summary: 'Cuando los dieters violan su restricción, comen más que los no-dieters. La restricción cognitiva no gestiona el hambre: la amplifica y la vuelve incontrolable cuando falla.',
      sourceUrl: 'https://doi.org/10.1111/j.1467-6494.1975.tb00727.x',
      sourceLabel: 'Herman & Mack (1975) — Journal of Personality',
      badge: 'Restricción cognitiva',
      author: { name: 'C. Peter Herman', university: 'University of Toronto', specialty: 'Psicología de la Alimentación y Autorregulación' },
      readingTime: '4 min',
      date: '19 de mayo de 2026',
      intro: 'En 1975, C. Peter Herman y Deborah Mack realizaron en la Universidad de Toronto un experimento que contradijo una de las intuiciones más arraigadas sobre las dietas. Invitaron a mujeres de peso normal al laboratorio para una supuesta "prueba de sabor" de helado. A algunas les daban antes uno o dos batidos de chocolate; a otras, nada. Después, dejaban a todas comer helado libremente. El resultado fue el opuesto de lo esperado: las mujeres que habían tomado el batido —es decir, que ya habían comido más— comían más helado, no menos. Pero solo si eran dieters. Las no-dieters se comportaban de forma normal: menos hambre, menos helado.',
      sections: [
        {
          subtitle: 'El experimento del batido que desbloqueó el hambre',
          paragraphs: [
            'Herman y Mack clasificaron a sus participantes en "comedoras restringidas" y "comedoras no restringidas" usando el Restraint Scale, un cuestionario que mide el grado en que una persona regula cognitivamente su ingesta. Las no-restringidas se comportaron como predice la fisiología: después de consumir las calorías del batido, tenían menos hambre y comían menos helado. La señal de saciedad funcionó correctamente. Las restringidas mostraron el patrón inverso y llamativo: con un batido previo comían de media un 16 % más de helado que sin batido, y con dos batidos, un 26 % más.',
            'Lo más revelador de los experimentos posteriores del mismo grupo fue la manipulación cognitiva. Herman y Polivy demostraron que el efecto no dependía del contenido calórico real del batido: bastaba con hacer creer a las participantes que habían tomado un batido alto en calorías —aunque no lo fuera— para producir el mismo patrón de desinhibición. El mecanismo era puramente cognitivo. El batido rompía la regla mental ("hoy ya me lo he saltado"), y esa rotura era suficiente para desactivar toda restricción posterior. Herman y Polivy llamaron a este fenómeno "el efecto qué-más-da": una vez que la norma se ha violado, la lógica de la dieta colapsa y la persona come todo lo que la restricción había estado bloqueando.'
          ]
        },
        {
          subtitle: 'El mecanismo: restricción cognitiva frente a regulación fisiológica',
          paragraphs: [
            'El modelo de límites que Herman desarrolló distingue dos sistemas de regulación. El sistema fisiológico funciona mediante señales de hambre y saciedad: el hipotálamo integra señales hormonales —grelina, leptina, GLP-1— para indicar cuándo empezar y cuándo parar de comer. Ese sistema es robusto y difícil de engañar durante períodos prolongados. El sistema cognitivo que activan las dietas es diferente: impone un límite arbitrario —"no comer más de X calorías"— que no tiene correlato fisiológico. Ese límite cognitivo puede violarse con un solo pensamiento: "ya da igual".',
            'El problema añadido es el que Daniel Wegner documentó en lo que llamó el "proceso irónico": intentar suprimir el pensamiento de un alimento prohibido aumenta su frecuencia y viveza. Pídete no pensar en chocolate y el chocolate ocupará más espacio en tu mente que antes de la instrucción. La restricción convierte el alimento prohibido en el centro de gravedad cognitivo de la experiencia alimentaria. La consecuencia práctica de toda esta investigación es contraintuitiva pero sólida: las dietas de prohibición tienden a producir los mismos comportamientos de ingesta que intentan prevenir. Los enfoques basados en permiso condicional y saciedad gestionada tienen, en general, mejores resultados a largo plazo.'
          ]
        }
      ],
      blockquote: { text: '«Prohibirte un alimento no suprime el deseo de comerlo. Lo convierte en el único pensamiento que no puedes dejar de tener.»', attribution: 'C. Peter Herman' },
      aplicacion: 'Si tienes alimentos "prohibidos", considera si la prohibición absoluta es la estrategia más efectiva o si en realidad amplifica el deseo. La investigación sugiere que el permiso condicional y consciente —"puedo comer esto si de verdad lo quiero"— reduce la carga cognitiva del alimento y, paradójicamente, tiende a disminuir la ingesta. La restricción extrema rara vez produce los resultados que promete.'
    },
    {
      id: 'ali-04',
      title: 'El tamaño del plato decide cuánto comes, no el hambre',
      summary: 'Cuando las raciones se duplican, la ingesta calórica aumenta un 30 % sin que los participantes lo noten. El cerebro usa el plato como señal de saciedad; el estómago llega demasiado tarde.',
      sourceUrl: 'https://doi.org/10.1093/ajcn/76.6.1207',
      sourceLabel: 'Rolls, Morris & Roe (2002) — American Journal of Clinical Nutrition',
      badge: 'Señales de porción',
      author: { name: 'Barbara J. Rolls', university: 'Penn State University', specialty: 'Ciencias de la Nutrición y Psicología del Apetito' },
      readingTime: '3 min',
      date: '12 de mayo de 2026',
      intro: 'En un experimento de Penn State, cincuenta y un adultos —la mitad con peso normal, la mitad con sobrepeso— recibieron pasta en cuatro tamaños de ración distintos a lo largo de varias semanas. Antes de cada comida se registraba su nivel de hambre. Después de comer, se registraba cuánto habían ingerido y cómo de llenos se sentían. La hipótesis de Barbara Rolls era simple: si el cerebro regula la ingesta por señales de hambre y saciedad, el tamaño de la ración no debería afectar sistemáticamente cuánto se come. Los datos le dieron la razón en sentido inverso: el tamaño de la ración era el predictor dominante, y el hambre previa apenas explicaba varianza.',
      sections: [
        {
          subtitle: 'El experimento: cuatro raciones, un solo resultado',
          paragraphs: [
            'Rolls y sus colegas sirvieron macarrones con queso en cuatro tamaños: 500 g, 625 g, 750 g y 1.000 g, en sesiones diferentes separadas por varios días. Los participantes podían comer cuanto quisieran. Las instrucciones eran neutras: "esto es una prueba de sabor, come lo que quieras". El nivel de hambre antes de comer se midió con escalas visuales analógicas estandarizadas y fue estadísticamente similar en todas las condiciones.',
            'Los resultados siguieron una función lineal precisa: a mayor ración servida, mayor ingesta, sin excepción. La ración más pequeña produjo una ingesta media de 529 kilocalorías. La más grande, de 702 kilocalorías —un 30 % más—. La diferencia se mantuvo tanto en participantes con peso normal como con sobrepeso, lo que descartó que el efecto se limitara a personas con dificultades de regulación del apetito. Tras cada comida, los niveles de saciedad reportados eran sorprendentemente similares entre condiciones: quienes habían comido más no se sentían proporcionalmente más llenos. Habían ingerido más calorías sin que eso se tradujera en una señal de saciedad equivalente.'
          ]
        },
        {
          subtitle: 'El mecanismo: la señal visual como ancla de saciedad',
          paragraphs: [
            'Las señales fisiológicas de saciedad —la liberación de GLP-1, PYY y la distensión gástrica que llega al nervio vago— tardan entre 15 y 20 minutos en alcanzar el hipotálamo con suficiente intensidad para modular la conducta de ingesta. La mayoría de las comidas dura entre 10 y 20 minutos. En la práctica, esto significa que las decisiones sobre cuándo parar de comer no se toman cuando el cerebro ya tiene información fisiológica completa; se toman usando señales visuales y cognitivas —el tamaño del plato, cuánto queda, qué comen los demás— como proxy del cuánto.',
            'Rolls y su equipo desarrollaron el concepto de "densidad energética volumétrica" para describir cómo la cantidad visual de comida —su volumen— puede disociarse de su carga calórica. Alimentos con alto contenido en agua o fibra ocupan más espacio visual por caloría. Esta disociación es la base de su "Volumetrics" approach: diseñar comidas donde el volumen visual genere la señal de suficiencia antes de que las calorías superen el umbral deseable. Lo inverso también opera: la industria alimentaria formula productos de alto contenido calórico y bajo volumen —snacks densos, bebidas azucaradas— que no activan las señales visuales de haber comido suficiente.'
          ]
        }
      ],
      blockquote: { text: '«El cerebro usa el plato como señal de cuánto necesita comer. El estómago llega demasiado tarde para corregirle.»', attribution: 'Barbara J. Rolls' },
      aplicacion: 'Sirve los alimentos de alta densidad calórica en platos más pequeños, y los de baja densidad en platos grandes. No es autoengaño: es alinear las señales visuales que tu cerebro usa para decidir cuándo parar con la información calórica real de lo que estás comiendo. El experimento de Rolls sugiere que este ajuste es suficiente para reducir la ingesta entre un 20 y un 30 % sin que el nivel de saciedad percibida cambie.'
    }
  ]
};

(function () {
  const canvas = document.getElementById('neural-canvas');
  const ctx    = canvas.getContext('2d');
  let pts = [], W, H, rafId = null, running = false;

  /* Configuración por tema: default = teal→azul, obsidiana = oro→blanco cálido */
  const CFGS = {
    /* Oro sobre fondo claro: más nodos, más brillo, destellos visibles */
    obsidiana: { N: 152, MAX_D: 170, nodeAlpha: 0.45, lineAlpha: 0.55, lw: 1.1,
                 l: [212, 175, 55], r: [232, 200, 80] },
    default:   { N: 92,  MAX_D: 155, nodeAlpha: 0.15, lineAlpha: 0.28, lw: 0.8,
                 l: [16, 185, 129], r: [37, 99, 235] }
  };

  function getCfg() {
    return CFGS[document.documentElement.getAttribute('data-theme')] || CFGS.default;
  }

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function nodeColor(x, a, cfg) {
    const t = Math.min(1, Math.max(0, x / W));
    return `rgba(${Math.round(cfg.l[0]+(cfg.r[0]-cfg.l[0])*t)},${Math.round(cfg.l[1]+(cfg.r[1]-cfg.l[1])*t)},${Math.round(cfg.l[2]+(cfg.r[2]-cfg.l[2])*t)},${a})`;
  }

  function mkPt(cfg) {
    const rnd = Math.random();
    const x   = rnd < 0.63 ? Math.random() * W * 0.42 : W * 0.42 + Math.random() * W * 0.58;
    return { x, y: Math.random() * H,
             vx: (Math.random() - 0.5) * 0.30, vy: (Math.random() - 0.5) * 0.30,
             r: Math.random() * 2.0 + 1.2, a: Math.random() * 0.35 + cfg.nodeAlpha };
  }

  let activeCfg = null;
  function syncParticles(cfg) {
    if (activeCfg === cfg) return;
    activeCfg = cfg;
    while (pts.length < cfg.N) pts.push(mkPt(cfg));
    if (pts.length > cfg.N) pts.length = cfg.N;
  }

  function init() { resize(); activeCfg = getCfg(); pts = Array.from({ length: activeCfg.N }, () => mkPt(activeCfg)); }

  function frame() {
    const cfg = getCfg();
    syncParticles(cfg);
    const N = pts.length, MAX_D2 = cfg.MAX_D * cfg.MAX_D;
    ctx.clearRect(0, 0, W, H);

    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor(p.x, p.a, cfg);
      ctx.fill();
    }

    ctx.lineWidth = cfg.lw;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MAX_D2) {
          const mx = (pts[i].x + pts[j].x) * 0.5;
          const op = (1 - Math.sqrt(d2) / cfg.MAX_D) * cfg.lineAlpha;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = nodeColor(mx, op, cfg);
          ctx.stroke();
        }
      }
    }
    if (running) rafId = requestAnimationFrame(frame);
  }

  function startCanvas() { if (!running) { running = true; rafId = requestAnimationFrame(frame); } }
  function stopCanvas()  { running = false; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  document.addEventListener('visibilitychange', () => { document.hidden ? stopCanvas() : startCanvas(); });
  window.addEventListener('resize', function () {
    resize();
    pts.forEach(p => { if (p.x > W) p.x = Math.random() * W; if (p.y > H) p.y = Math.random() * H; });
  }, { passive: true });

  init(); startCanvas();
}());


/* ── NAVBAR ──────────────────────────────────────────────────── */
(function () {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');
  const infoModal    = document.getElementById('info-modal');
  const modalClose   = document.getElementById('info-modal-close');
  const infoSections = document.querySelectorAll('.info-section');

  let infoTrapHandler = null, infoTriggerEl = null;

  function openInfo(panelId) {
    infoTriggerEl = document.activeElement;
    infoSections.forEach(s => s.classList.remove('active'));
    const target = document.getElementById('info-sec-' + panelId);
    if (target) target.classList.add('active');
    infoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (mobileMenu && !mobileMenu.hidden) closeMobileMenu();
    infoTrapHandler = trapFocus(infoModal);
    requestAnimationFrame(() => modalClose && modalClose.focus());
  }

  function closeInfo() {
    infoModal.classList.remove('open');
    document.body.style.overflow = '';
    if (infoTrapHandler) { releaseFocus(infoModal, infoTrapHandler, infoTriggerEl); infoTrapHandler = null; }
  }

  /* Overlay para click-fuera */
  const menuOverlay = document.createElement('div');
  menuOverlay.className = 'mobile-menu-overlay';
  document.body.appendChild(menuOverlay);
  menuOverlay.addEventListener('click', () => closeMobileMenu());

  function openMobileMenu() {
    mobileMenu.hidden = false;
    mobileMenu.removeAttribute('inert');
    mobileMenu.removeAttribute('aria-hidden');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    mobileMenu.hidden = true;
    mobileMenu.setAttribute('inert', '');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    /* Colapsar todos los paneles inline al cerrar el menú */
    document.querySelectorAll('.mobile-nav-toggle').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      const p = document.getElementById('mob-panel-' + b.dataset.mobPanel);
      if (p) p.classList.remove('is-open');
    });
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      if (mobileMenu.hidden) openMobileMenu(); else closeMobileMenu();
    });
  }

  /* Desktop nav → abre modal */
  document.querySelectorAll('.nav-link[data-panel]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      openInfo(link.dataset.panel);
    });
  });

  /* Botón glosario en navbar */
  document.getElementById('nav-glosario-btn')?.addEventListener('click', () => {
    if (window._LI_openGlosario) window._LI_openGlosario();
  });

  /* Botón glosario en menú móvil */
  document.getElementById('mob-glosario-btn')?.addEventListener('click', () => {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.setAttribute('hidden', '');
      menu.setAttribute('aria-hidden', 'true');
      menu.setAttribute('inert', '');
      document.body.classList.remove('menu-open');
      const ham = document.getElementById('hamburger-btn');
      if (ham) ham.setAttribute('aria-expanded', 'false');
    }
    if (window._LI_openGlosario) window._LI_openGlosario();
  });

  /* Widget glosario en sección Explorar */
  document.getElementById('mob-glosario-widget-btn')?.addEventListener('click', () => {
    if (window._LI_openGlosario) window._LI_openGlosario();
  });

  /* Menú móvil → expande panel inline */
  document.querySelectorAll('.mobile-nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.dataset.mobPanel;
      const panel   = document.getElementById('mob-panel-' + panelId);
      if (!panel) return;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      /* Cerrar todos los demás */
      document.querySelectorAll('.mobile-nav-toggle').forEach(b => {
        if (b !== btn) {
          b.setAttribute('aria-expanded', 'false');
          const p = document.getElementById('mob-panel-' + b.dataset.mobPanel);
          if (p) { p.classList.remove('is-open'); }
        }
      });
      /* Toggle este */
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.classList.toggle('is-open', !isOpen);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeInfo);
    modalClose.addEventListener('touchstart', e => { e.preventDefault(); closeInfo(); }, { passive: false });
  }
  if (infoModal) {
    infoModal.addEventListener('click', e => { if (e.target === infoModal) closeInfo(); });
    infoModal.addEventListener('touchstart', e => { if (e.target === infoModal) { e.preventDefault(); closeInfo(); } }, { passive: false });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (infoModal && infoModal.classList.contains('open')) closeInfo();
      if (mobileMenu && !mobileMenu.hidden) closeMobileMenu();
    }
  });
}());


/* ── CITA APA ────────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.cite-btn').forEach(btn => {
    const originalHTML = btn.innerHTML;
    let timer = null;

    btn.addEventListener('click', function () {
      const text = btn.dataset.apa || '';

      function onCopied() {
        btn.classList.add('copied');
        btn.textContent = '✓ ¡Copiado!';
        clearTimeout(timer);
        timer = setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('copied');
        }, 2200);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(onCopied).catch(onCopied);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
        onCopied();
      }
    });
  });
}());


/* ── ARTÍCULOS SEMANALES ─────────────────────────────────────── */
function getWeekOfYear(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNum = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - dayNum);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

const WEEKLY_ARTICLES = [
  /* ── Semanas nuevas ───────────────────────────────────────── */
  {
    week: 19,
    author: { name: 'Stanley Milgram', university: 'Universidad de Yale', specialty: 'Psicología Social y Obediencia a la Autoridad' },
    badge: 'Psicología Social',
    title: '¿Obedecerías hasta el final? El experimento que rompió la fe en la racionalidad humana',
    readingTime: '4 min',
    date: '4 de mayo de 2026',
    intro: `En 1961, en un sótano de la Universidad de Yale, Stanley Milgram reclutó a cuarenta hombres corrientes —electricistas, vendedores, profesores de secundaria— para un supuesto experimento de aprendizaje. Se les dijo que debían administrar descargas eléctricas a un "alumno" cada vez que cometiera un error de memoria. Las descargas comenzaban en 15 voltios y escalaban hasta 450, con etiquetas que iban de «Ligera» a «Peligro: descarga grave». El alumno era un actor. Las descargas, ficticias. Pero el 65% de los participantes llegó hasta el final. Sin coerción física. Sin amenazas. Solo con la frase de un hombre con bata blanca: «Por favor, continúe».`,
    sections: [
      {
        subtitle: 'El experimento que Milgram diseñó para responder a Nuremberg',
        paragraphs: [
          'Milgram concibió el experimento en respuesta directa al juicio de Adolf Eichmann en Jerusalén. Eichmann, arquitecto logístico del Holocausto, declaró que había "cumplido órdenes". La pregunta de Milgram era brutal en su simplicidad: ¿cuánto de lo que ocurrió en la Alemania nazi podría reproducirse en ciudadanos corrientes de Connecticut con una figura de autoridad legítima y un entorno de laboratorio?',
          'El procedimiento era meticuloso. El participante veía cómo el "alumno" era atado a una silla con electrodos en la muñeca. Desde otra habitación, el participante pulsaba botones. Cada error provocaba una descarga más intensa y los gritos pregrabados del actor aumentaban en intensidad: a 150V pedía que le liberaran, a 300V golpeaba la pared, a 330V dejaba de responder. Cuando el participante dudaba, el experimentador usaba exactamente cuatro frases: "Por favor, continúe", "El experimento requiere que continúe", "Es absolutamente esencial que continúe" y "No tiene otra alternativa, debe continuar". El 65% obedeció hasta los 450 voltios.'
        ]
      },
      {
        subtitle: 'El mecanismo: el estado agente y la distancia moral',
        paragraphs: [
          'Milgram identificó lo que llamó el estado agente: cuando una persona se sitúa bajo la autoridad legítima de otra, transfiere la responsabilidad moral al superior. Deja de actuar como agente moral autónomo y se convierte en ejecutor. El participante no decía "yo estoy descargando" sino "el experimento requiere". Esta disociación verbal acompañaba una disociación psicológica real.',
          'La distancia física demostró ser el modulador más potente de obediencia. Cuando el actor estaba en la misma sala y el participante debía sujetarle la mano sobre el electrodo, la obediencia completa caía al 30%. Cuando el actor estaba en otra habitación pero se escuchaban sus respuestas verbales, el 62,5% llegó al final. Cuando el contacto era solo auditivo mediante grabaciones, el 65%. Cuando era completamente remoto —el participante no escuchaba nada—, el porcentaje superaba el 90%. La distancia física genera distancia moral. Es el mecanismo que explica por qué los pilotos de bombardero duermen mejor que los soldados de infantería.'
        ]
      },
      {
        subtitle: 'Lo que Milgram demostró que nadie quería ver',
        paragraphs: [
          'Antes del experimento, Milgram preguntó a psiquiatras, estudiantes y ciudadanos cuántas personas creían que llegarían al final. La estimación media fue el 1,2%. Nadie predijo el 65% real. Ese abismo entre la predicción y el resultado es en sí mismo un hallazgo: subestimamos sistemáticamente el poder de la situación y sobrestimamos el del carácter individual.',
          'Las réplicas del experimento —en Alemania, Australia, España, Jordania— produjeron resultados similares o superiores. Las variaciones donde el experimentador era una voz por teléfono o un civil sin bata blanca reducían drásticamente la obediencia. No era la crueldad lo que explicaba el comportamiento: era la estructura. La lección más incómoda de Milgram no es que los humanos sean malvados, sino que la maldad no requiere serlo.'
        ]
      }
    ],
    blockquote: { text: '«Si un sistema de autoridad legítima pide al individuo que actúe contra sus valores más profundos, es el sistema —y no la naturaleza del individuo— lo que determina el resultado.»', attribution: 'Stanley Milgram, Obedience to Authority, 1974' },
    aplicacion: `La próxima vez que alguien con autoridad —un jefe, un protocolo, una norma institucional— te pida hacer algo que activa tu incomodidad moral, identifica el momento exacto en que tu consciencia lo registra. Ese instante de tensión es tu sistema de alarma autónomo. Milgram demostró que la mayoría de personas lo siente pero lo silencia con la comodidad de "son las instrucciones". Nombrar la incomodidad en voz alta —incluso solo para ti mismo— activa el sistema prefrontal y reduce la probabilidad de entrar en el estado agente.`
  },
  {
    week: 18,
    author: { name: 'Albert Bandura', university: 'Universidad de Stanford', specialty: 'Psicología Cognitivo-Social y Aprendizaje Vicario' },
    badge: 'Aprendizaje social',
    title: 'Aprendemos lo que vemos: el muñeco Bobo y el origen de la violencia aprendida',
    readingTime: '4 min',
    date: '27 de abril de 2026',
    intro: `En 1961, Albert Bandura colocó a un grupo de niños de guardería frente a un adulto que golpeaba, pateaba y gritaba insultos a un muñeco hinchable de metro y medio llamado Bobo. Después, los niños fueron llevados a otra sala con juguetes atractivos que les retiraron deliberadamente para frustrarlos, y finalmente se les dejó solos con el muñeco Bobo. Los niños que habían observado al adulto agresivo imitaron sus conductas con una precisión que sorprendió al propio Bandura: los mismos golpes, las mismas posturas, los mismos insultos. Los que no habían visto al modelo agresivo no mostraron ninguna de esas conductas. Con ese experimento, Bandura desmanteló cincuenta años de conductismo.`,
    sections: [
      {
        subtitle: 'El experimento que demostró que no necesitamos refuerzo para aprender',
        paragraphs: [
          'El conductismo clásico de Skinner sostenía que la conducta solo se aprende a través del refuerzo directo: haces algo, recibes una recompensa o un castigo, y eso modela tu comportamiento futuro. Bandura sospechaba que eso no era toda la historia. En el experimento del muñeco Bobo, diseñó tres condiciones: un grupo de niños veía al adulto ser recompensado por su agresión, otro lo veía ser castigado, y un tercero no veía ninguna consecuencia. Cuando se les dejó con el muñeco, todos los grupos mostraron las mismas conductas agresivas cuando se les ofreció un incentivo. La diferencia estaba en si las ejecutaban espontáneamente: el grupo que había visto castigo era más inhibido, pero tenía el aprendizaje igualmente adquirido.',
          'Este hallazgo estableció la diferencia fundamental entre aprendizaje y actuación. Los niños habían aprendido la conducta solo con observarla —sin practicarla, sin ser reforzados por ella—. El refuerzo no determinaba el aprendizaje; determinaba si lo que ya se había aprendido se expresaba o no. Bandura llamó a esto aprendizaje observacional o vicario, y redefinió con ello el alcance de la teoría del aprendizaje.'
        ]
      },
      {
        subtitle: 'El mecanismo: cuatro procesos que convierten la observación en conducta',
        paragraphs: [
          'Bandura identificó cuatro procesos necesarios para que el aprendizaje vicario ocurra. El primero es la atención: observamos mejor a quienes son similares a nosotros, tienen estatus o son atractivos. El segundo es la retención: codificamos lo observado en representaciones mentales que pueden recuperarse después. El tercero es la reproducción: necesitamos las capacidades físicas o cognitivas para ejecutar lo aprendido. El cuarto —y el que distingue el aprendizaje de la actuación— es la motivación: la expectativa de consecuencias determina si ejecutamos o inhibimos lo aprendido.',
          'Las implicaciones del modelo trascendieron la psicología experimental. Si los niños aprenden conductas agresivas por observación —sin necesitar refuerzo directo—, los medios de comunicación, los videojuegos, los padres y los grupos de pares son máquinas de aprendizaje vicario constante. Bandura no afirmó que la violencia mediática cause violencia directamente, sino algo más matizado y más preocupante: amplía el repertorio conductual disponible y reduce las inhibiciones ante su uso en contextos que el observador perciba como similares al observado.'
        ]
      }
    ],
    blockquote: { text: '«La mayor parte del comportamiento humano se aprende por observación, a través del modelado. Al observar a otros, uno se forma una idea de cómo se realizan las conductas nuevas y, en ocasiones posteriores, esa información codificada sirve de guía para la acción.»', attribution: 'Albert Bandura, Social Learning Theory, 1977' },
    aplicacion: `Durante los próximos tres días, presta atención consciente a qué modelos de conducta consumes: qué series ves, qué personas sigues en redes sociales, qué conversaciones escuchas en tu entorno cercano. Bandura demostró que el repertorio conductual disponible en tu mente refleja lo que has observado, aunque nunca lo hayas practicado. Curar tus modelos es una forma de curar tu conducta antes de que esta aparezca.`
  },
  {
    week: 17,
    author: { name: 'Robert Cialdini', university: 'Universidad Estatal de Arizona', specialty: 'Psicología de la Influencia y Persuasión' },
    badge: 'Psicología de la influencia',
    title: 'Los seis mecanismos que te hacen decir sí sin querer',
    readingTime: '4 min',
    date: '20 de abril de 2026',
    intro: `Robert Cialdini pasó tres años infiltrado. Se formó como vendedor de coches de segunda mano, teleoperador de telemarketing, captador de donaciones para organizaciones benéficas y captador para grupos de presión. No lo hacía para ganarse la vida: lo hacía para entender, desde dentro, qué técnicas de influencia funcionan y por qué. El resultado fue Influence: The Psychology of Persuasion, publicado en 1984, uno de los libros de psicología aplicada más vendidos de la historia. Lo que Cialdini descubrió no fue que los vendedores manipulan a los incautos: fue que explotan mecanismos cognitivos legítimos que el cerebro humano usa para decidir rápido en un mundo complejo.`,
    sections: [
      {
        subtitle: 'Los seis principios: atajos cognitivos convertidos en armas de influencia',
        paragraphs: [
          'El primer principio es la reciprocidad: cuando alguien nos da algo —una muestra gratuita, un favor no solicitado, un cumplido—, sentimos una presión psicológica real de devolver el gesto. La industria de los regalos corporativos existe sobre esta base. El segundo es el compromiso y coherencia: una vez que tomamos una posición o hacemos algo pequeño —firmar una petición, probar un producto—, queremos ser coherentes con esa posición. Los vendedores de coches llaman a esto el "pie en la puerta": una primera concesión pequeña siembra el terreno para decisiones mayores.',
          'El tercer principio es la prueba social: en condiciones de incertidumbre, miramos a los demás para decidir qué es correcto. Las reseñas de cinco estrellas, los contadores de "X personas ya se han suscrito" y los aplausos enlatados explotan este mecanismo. El cuarto es la autoridad: obedecemos a los expertos aunque no comprendamos sus razones. El quinto es el gusto: somos más persuadidos por quienes nos caen bien, son similares a nosotros o son físicamente atractivos. El sexto es la escasez: lo que es raro parece más valioso. "Solo quedan 2 habitaciones disponibles" no es una descripción del inventario: es un disparador de urgencia diseñado.'
        ]
      },
      {
        subtitle: 'Por qué estos principios funcionan incluso cuando los conoces',
        paragraphs: [
          'La contribución más perturbadora de Cialdini no es el catálogo de los seis principios —que otros habían descrito antes—, sino la explicación de por qué son tan resistentes al conocimiento consciente. Cada uno de ellos es un atajo cognitivo evolutivamente adaptativo. La reciprocidad construyó alianzas sociales durante millones de años. La prueba social calibra el riesgo en situaciones nuevas. La escasez señala recursos genuinamente valiosos. El problema es que estos atajos no distinguen entre contextos genuinos y artificiales: responden al disparador, no a la situación real.',
          'En sus experimentos de campo —no de laboratorio—, Cialdini demostró que una simple palabra añadida a una petición multiplicaba el cumplimiento. Cuando un actor preguntaba "¿puedo usar la fotocopiadora porque tengo prisa?", el 94% cedía. Cuando preguntaba "¿puedo usar la fotocopiadora?" sin más, cedía el 60%. Pero lo más revelador: "¿puedo usar la fotocopiadora porque necesito hacer copias?" —una razón vacía que no aporta ninguna información— producía el 93% de cumplimiento. El cerebro no evalúa la calidad de la razón: responde al patrón de "razón porque petición".'
        ]
      }
    ],
    blockquote: { text: '«El arma de influencia más poderosa no es la mentira. Es un principio psicológico legítimo aplicado fuera de contexto con suficiente habilidad para que no lo reconozcas.»', attribution: 'Robert Cialdini, Influence, 1984' },
    aplicacion: `Antes de tomar cualquier decisión de compra, acuerdo o compromiso en los próximos días, identifica cuál de los seis disparadores está activo: ¿te sientes obligado porque recibiste algo? ¿actúas por coherencia con algo que dijiste antes? ¿lo compras porque "los demás" lo hacen? ¿te urge porque "quedan pocas unidades"? Nombrar el mecanismo no te hace inmune, pero te da un segundo de distancia suficiente para evaluar si la decisión responde a tu criterio o al del diseñador del sistema.`
  },
  {
    week: 16,
    author: { name: 'Jonathan Haidt', university: 'Universidad de Nueva York (Stern)', specialty: 'Psicología Moral y Política' },
    badge: 'Psicología moral',
    title: 'Tu moral no es tuya: el perro emocional y su cola racional',
    readingTime: '4 min',
    date: '13 de abril de 2026',
    intro: `Imagina que lees lo siguiente: una familia cuyo perro muere atropellado decide cocinarlo y comérselo, ya que han oído que la carne de perro es deliciosa y ningún vecino va a saberlo. No han hecho daño a nadie. El perro ya estaba muerto. ¿Es esto moralmente incorrecto? La mayoría de las personas dice que sí con una convicción inmediata. Pero cuando se les pregunta por qué, se quedan sin argumentos. Han llegado a un estado que Jonathan Haidt llama "perplejidad moral": sienten con certeza que algo está mal pero no pueden justificarlo racionalmente. Este ejemplo, y miles como él, llevaron a Haidt a reformular por completo cómo entendemos la moral humana.`,
    sections: [
      {
        subtitle: 'El error de Kohlberg: la moral no es razonamiento, es intuición',
        paragraphs: [
          'Durante décadas, la psicología moral dominante asumía que los juicios morales son el resultado de un proceso de razonamiento deliberado. Lawrence Kohlberg propuso que la madurez moral consistía en alcanzar niveles más altos de razonamiento lógico sobre principios universales. Haidt demostró que esto es, en gran medida, una ficción retrospectiva.',
          'En sus experimentos con dilemas morales, Haidt y sus colegas encontraron que los participantes generaban juicios morales en fracciones de segundo —mucho antes de que pudiera producirse ningún razonamiento consciente— y que sus "razones" eran construidas después del juicio, no antes. Cuando una razón era refutada, la gente no cambiaba su juicio: buscaba otra razón. Y cuando se quedaban sin razones, reconocían estar "perplejos moralmente" pero mantenían su posición. Haidt llamó a esto "el perro emocional y su cola racional": la intuición es el perro, el razonamiento es la cola que el perro mueve, no al revés.'
        ]
      },
      {
        subtitle: 'Las fundaciones morales: cinco sistemas innatos, no uno universal',
        paragraphs: [
          'Haidt y su equipo propusieron que la moral humana no descansa sobre un único principio —el daño, como sostiene la ética utilitaria, o la justicia, como la kantiana—, sino sobre al menos seis fundaciones innatas que evolucionaron para resolver problemas adaptativos distintos. La de cuidado/daño responde a la vulnerabilidad de las crías. La de imparcialidad/engaño gestiona la cooperación recíproca. La de lealtad/traición regula la cohesión grupal. La de autoridad/subversión jerarquiza las relaciones sociales. La de santidad/degradación protege de patógenos y contaminantes. La sexta, añadida después, es la de libertad/opresión.',
          'La contribución política más controvertida de Haidt es que conservadores y progresistas no difieren en su racionalidad sino en qué fundaciones morales priorizan. Los progresistas basan su moral casi exclusivamente en cuidado e imparcialidad. Los conservadores equilibran las seis fundaciones. Esto explica por qué los debates morales entre grupos políticos son tan frustrantes: cada parte asume que la otra está siendo irracional, cuando en realidad está operando desde un conjunto diferente de intuiciones morales igualmente legítimas desde el punto de vista evolutivo.'
        ]
      }
    ],
    blockquote: { text: '«La razón moral es más parecida a un abogado defensor que a un juez: su trabajo no es encontrar la verdad sino construir el mejor caso posible para la conclusión a la que ya ha llegado su cliente.»', attribution: 'Jonathan Haidt, The Righteous Mind, 2012' },
    aplicacion: `La próxima vez que sientas indignación moral ante una conducta ajena, añade un paso antes de articular tu argumento: identifica qué fundación moral ha activado esa reacción (¿daño, injusticia, traición, degradación?). Descubrirás que tu razonamiento lo construiste después. Ese reconocimiento no invalida tu posición, pero la vuelve más honesta y mucho más persuasiva para quien opera desde otras fundaciones.`
  },
  {
    week: 15,
    author: { name: 'Carol Dweck', university: 'Universidad de Stanford', specialty: 'Psicología de la Motivación y el Desarrollo' },
    badge: 'Psicología del desarrollo',
    title: 'El poder de «todavía»: cómo una palabra transforma el potencial de las personas',
    readingTime: '3 min',
    date: '6 de abril de 2026',
    intro: `En una escuela de Chicago, algunos estudiantes que suspendían una asignatura recibían en su expediente la calificación "Todavía no aprobado" en lugar del suspenso convencional. Carol Dweck quedó fascinada por esa práctica. Frente al suspenso ordinario —que dice "has fallado"—, "todavía no" comunica algo radicalmente diferente: "estás en el camino, pero aún no has llegado". Esa distinción, aparentemente semántica, tiene consecuencias medibles en el rendimiento, la persistencia y el bienestar psicológico. Dweck había identificado décadas antes el mecanismo que explica por qué: la diferencia entre una mentalidad fija y una mentalidad de crecimiento.`,
    sections: [
      {
        subtitle: 'El experimento que reveló dos formas radicalmente distintas de procesar el fracaso',
        paragraphs: [
          'Dweck y su equipo presentaron a niños de diez años problemas de matemáticas ligeramente por encima de su nivel. Después les dieron feedback de dos tipos: a un grupo les dijeron "eres muy inteligente para haber hecho esto tan bien" (alabanza de habilidad); al otro, "has trabajado muy duro para conseguir esto" (alabanza de esfuerzo). Luego les ofrecieron elegir entre dos tareas: una fácil y otra difícil. El 67% del grupo de habilidad eligió la fácil; el 92% del grupo de esfuerzo eligió la difícil.',
          'Cuando ambos grupos enfrentaron problemas claramente demasiado difíciles para ellos, las diferencias se hicieron dramáticas. El grupo de habilidad atribuyó sus errores a falta de inteligencia, reportó menos disfrute y peor rendimiento posterior. El grupo de esfuerzo interpretó los mismos errores como señal de que necesitaban más estrategia o práctica, mantuvo el disfrute y mejoró su rendimiento. Una sola frase de feedback había activado dos marcos mentales completamente distintos para interpretar el desafío.'
        ]
      },
      {
        subtitle: 'Mentalidad fija vs. mentalidad de crecimiento: lo que está en juego',
        paragraphs: [
          'Dweck definió la mentalidad fija como la creencia de que las capacidades intelectuales son atributos innatos y fijos —tienes o no tienes talento—. La mentalidad de crecimiento es la creencia de que las capacidades se desarrollan a través del esfuerzo, las estrategias correctas y la ayuda de otros. No son tipos de personas sino estados psicológicos que pueden activarse según el contexto y el tipo de feedback recibido.',
          'Las implicaciones son amplias. En el ámbito empresarial, Dweck analizó empleados de empresas con culturas de mentalidad fija y de crecimiento: los primeros reportaban más deshonestidad, más ocultación de errores y menos innovación, porque admitir un error equivalía a admitir una deficiencia innata. En el ámbito deportivo, los atletas con mentalidad de crecimiento usaban el fracaso como información; los de mentalidad fija, como veredicto. Y en las relaciones de pareja, quienes creían que la compatibilidad es innata abandonaban antes las relaciones difíciles que quienes creían que se construye.'
        ]
      }
    ],
    blockquote: { text: '«En una mentalidad fija, el esfuerzo es una mala noticia: si tienes que esforzarte, significa que no eres inteligente. En una mentalidad de crecimiento, el esfuerzo es lo que activa la inteligencia.»', attribution: 'Carol Dweck, Mindset, 2006' },
    aplicacion: `Durante esta semana, cuando cometas un error —en el trabajo, en una conversación, en una tarea física— añade la palabra "todavía" a tu evaluación. No "no sé hacerlo" sino "todavía no sé hacerlo". No es optimismo vacío: es redirigir la atención del veredicto al proceso. Dweck demostró que este cambio lingüístico mínimo modifica qué información procesas del fracaso y cuánto tiempo persistes antes de abandonar.`
  },
  /* ── Semanas existentes ───────────────────────────────────── */
  {
    week: 22,
    author: { name: 'Lera Boroditsky', university: 'Universidad de California, San Diego', specialty: 'Psicolingüística y Cognición' },
    badge: 'Psicolingüística',
    title: 'El idioma que hablamos decide cómo pensamos el tiempo',
    readingTime: '4 min',
    date: '25 de mayo de 2026',
    intro: `Imagine que le pido que cierre los ojos e imagine la sucesión del tiempo: el pasado, el presente y el futuro. Probablemente ha concebido una línea horizontal, con el pasado a su izquierda y el futuro a su derecha. Ahora imagine que ha crecido hablando kuuk thaayorre, una lengua de los aborígenes del norte de Australia. No conoce los conceptos "izquierda" y "derecha": no existen en su lengua. Todo se orienta por los puntos cardinales —norte, sur, este, oeste— aunque esté usted en una habitación sin ventanas. Si alguien le pide que ordene fotos cronológicas, las colocará siempre de este a oeste, en la dirección en que se mueve el sol. Para usted, el tiempo no va de izquierda a derecha: va de este a oeste.`,
    sections: [
      {
        subtitle: 'El experimento que cambió la psicolingüística',
        paragraphs: [
          `Lera Boroditsky, psicóloga de la Universidad de California en San Diego, lleva dos décadas demostrando que el idioma que hablamos no es un simple vehículo de transmisión de ideas, sino un molde que da forma a cómo pensamos, recordamos y percibimos el mundo. Su investigación más conocida comenzó con una pregunta aparentemente trivial: ¿cómo conceptualizamos el tiempo?`,
          `En inglés, el tiempo es horizontal ("look forward to the future", "put the past behind you"). En mandarín, el tiempo también puede ser vertical: el mes pasado está "arriba" (上个月) y el mes que viene está "abajo" (下个月). Cuando Boroditsky preguntó a hablantes de mandarín si diciembre estaba "arriba" o "abajo" de junio, respondieron sin dudar. Los hablantes de inglés tardaban mucho más en entender la pregunta.`
        ]
      },
      {
        subtitle: '¿Qué ocurre cuando el idioma no tiene palabras para los números?',
        paragraphs: [
          `El hallazgo se vuelve aún más perturbador cuando miramos lenguas sin sistema numérico. El pueblo pirahã, de la Amazonia brasileña, no tiene palabras para los números: solo existen "poco" y "mucho". Cuando se les pide reproducir una secuencia de objetos, su precisión cae en picado a partir de tres elementos. No porque sean menos inteligentes, sino porque el lenguaje no les ha dado las herramientas mentales para construir ese concepto.`,
          `Lo mismo ocurre con los colores. Los hablantes de ruso distinguen obligatoriamente entre azul claro (goluboy) y azul oscuro (siniy). En experimentos de discriminación visual, los rusos detectan diferencias entre esos tonos significativamente más rápido que los anglohablantes, precisamente en la región del cerebro dedicada al procesamiento verbal.`
        ]
      },
      {
        subtitle: 'Pensar en otro idioma es pensar de otra manera',
        paragraphs: [
          `Quizás el experimento más sorprendente de Boroditsky es el siguiente: cuando se les pide a los hablantes de aymara que señalen el futuro, señalan hacia atrás. Para ellos, el futuro está detrás —porque no puede verse— y el pasado está delante, a la vista, conocido y visible.`,
          `Esto tiene implicaciones que van mucho más allá de la lingüística académica. Si el idioma moldea cómo pensamos el tiempo, también moldea cómo planificamos, cómo ahorramos, cómo nos arrepentimos. Boroditsky ha demostrado que describir un crimen con distintos verbos influye directamente en las sentencias que los jurados consideran apropiadas.`
        ]
      }
    ],
    blockquote: { text: '«El lenguaje es la herramienta más sofisticada que los humanos hemos desarrollado. No solo describe la realidad: la construye.»', attribution: 'Lera Boroditsky' },
    aplicacion: `Hoy, cuando tengas que hablar de algo abstracto —el tiempo, el dinero, el futuro—, presta atención a la metáfora que usas de forma automática. ¿Ves el futuro como algo que "viene hacia ti" o como algo hacia lo que "te diriges"? Cambia conscientemente esa metáfora y observa si cambia tu relación emocional con el concepto. Tu lengua es el primer filtro de tu realidad.`
  },
  {
    week: 21,
    author: { name: 'Elizabeth Loftus', university: 'Universidad de California, Irvine', specialty: 'Psicología Cognitiva y Forense' },
    badge: 'Memoria y cognición',
    title: 'Sus recuerdos de infancia son, en parte, ficción',
    readingTime: '4 min',
    date: '18 de mayo de 2026',
    intro: `¿Recuerda la primera vez que se perdió de pequeño? ¿La angustia, las lágrimas, el alivio cuando sus padres aparecieron? Si tiene ese recuerdo grabado con viveza, la psicóloga Elizabeth Loftus tiene una propuesta desconcertante para usted: ese episodio, tal y como lo recuerda, probablemente nunca ocurrió exactamente así. Y existe una posibilidad no despreciable de que ni siquiera ocurriera.`,
    sections: [
      {
        subtitle: 'El estudio que plantó un recuerdo falso en adultos sanos',
        paragraphs: [
          `En 1995, Loftus y su equipo en la Universidad de Washington llevaron a cabo un experimento que sacudió los cimientos de la psicología forense y judicial. Reclutaron a adultos y les entregaron un pequeño libro con cuatro episodios supuestamente extraídos de sus historias familiares, confirmados por sus parientes. Tres eran reales. El cuarto era inventado: un episodio en el que el participante se había perdido en un centro comercial de niño y era rescatado por un amable desconocido.`,
          `Al cabo de varias entrevistas, el 25% de los participantes no solo aceptaron el recuerdo falso como propio, sino que comenzaron a añadir detalles: el color de la camisa del desconocido, el olor del centro comercial, la expresión de su madre al encontrarlos. Inventaban con toda buena fe una experiencia que nunca habían vivido.`
        ]
      },
      {
        subtitle: 'La memoria no es un archivo: es un documento en edición constante',
        paragraphs: [
          `El error conceptual que cometemos casi todos es imaginar la memoria como una grabación fiel y estable. La neurociencia lleva décadas demostrando lo contrario. Cada vez que recuperamos un recuerdo, lo reactivamos —y al reactivarlo, lo volvemos a almacenar levemente modificado por el contexto del presente. El proceso se llama reconsolidación, y tiene una consecuencia radical: recordar algo es, en cierta medida, reescribirlo.`,
          `Loftus demostró que basta con formular una pregunta de forma distinta para alterar el recuerdo. En uno de sus estudios más replicados, mostró a participantes un vídeo de un accidente de coche. A un grupo preguntó: "¿A qué velocidad iban los coches cuando chocaron?" A otro: "¿A qué velocidad iban cuando se estrellaron?" El segundo grupo estimó velocidades significativamente más altas, y una semana después recordaba haber visto cristales rotos. No había cristales.`
        ]
      },
      {
        subtitle: 'Implicaciones para la justicia y para todos nosotros',
        paragraphs: [
          `Las investigaciones de Loftus tuvieron consecuencias directas en el sistema judicial. Fue perita en más de 300 casos penales, demostrando que el testimonio ocular —considerado durante décadas la prueba reina— es sistemáticamente poco fiable, especialmente cuando media estrés, armas en escena o diferencias raciales entre testigo y acusado.`,
          `Más allá de los juzgados, sus hallazgos nos conciernen a todos. Los debates políticos y las narrativas emocionales son máquinas de implantar recuerdos alterados en millones de personas simultáneamente. La pregunta "¿recuerda cuando...?" seguida de una descripción distorsionada es un mecanismo de manipulación cognitiva con base experimental sólida.`
        ]
      }
    ],
    blockquote: { text: '«La memoria no funciona como una cámara de vídeo. Cada vez que recuerdas algo, lo estás modificando.»', attribution: 'Elizabeth Loftus' },
    aplicacion: `La próxima vez que recuerdes con claridad algún conflicto del pasado, hazte esta pregunta: ¿cuántos de esos detalles los construí yo después, basándome en lo que quería que hubiera pasado? Antes de una conversación importante sobre un hecho pasado, escribe tu versión sin consultarla con nadie. Compárala después con la de la otra persona. La diferencia puede ser reveladora —y liberadora.`
  },
  {
    week: 20,
    author: { name: 'Daniel Kahneman', university: 'Universidad de Princeton', specialty: 'Psicología Cognitiva y Economía Conductual' },
    badge: 'Sesgos cognitivos',
    title: 'La trampa de pensar rápido: cómo tu cerebro te engaña cada día',
    readingTime: '5 min',
    date: '11 de mayo de 2026',
    intro: `Resuelva esto en voz alta y sin pensarlo: un bate y una pelota cuestan 1,10 euros en total. El bate cuesta un euro más que la pelota. ¿Cuánto cuesta la pelota? Si su respuesta inmediata ha sido "diez céntimos", su cerebro acaba de hacer exactamente lo que Daniel Kahneman lleva cuarenta años estudiando. La respuesta correcta es cinco céntimos —bate: 1,05 €; pelota: 0,05 €; total: 1,10 €—, pero más del 80% de los universitarios que reciben este problema por primera vez responden diez. No porque sean malos en matemáticas. Porque están usando el sistema equivocado.`,
    sections: [
      {
        subtitle: 'Dos sistemas que piensan por usted',
        paragraphs: [
          `Kahneman, psicólogo israelí-estadounidense y Premio Nobel de Economía en 2002, popularizó en <em>Pensar rápido, pensar despacio</em> una distinción central en la psicología cognitiva: el cerebro opera mediante dos modos radicalmente distintos. El Sistema 1 es rápido, automático, emocional e inconsciente. Es el que le dice que 2+2=4 sin esfuerzo, el que detecta el peligro antes de que usted lo haya racionalizado.`,
          `El Sistema 2 es lento, deliberado, esforzado y consciente. Es el que necesita para resolver el problema del bate y la pelota correctamente. Y tiene un problema fundamental: es perezoso. Cuando el Sistema 1 propone una respuesta plausible, el Sistema 2 tiende a aceptarla sin verificarla.`
        ]
      },
      {
        subtitle: 'Sesgos que no podemos ver porque somos nosotros mismos',
        paragraphs: [
          `Lo verdaderamente perturbador de la investigación de Kahneman no es que cometamos errores: es que los cometemos de forma predecible, sistemática y resistente a la corrección incluso cuando nos los señalan. El efecto ancla demuestra que el primer número que escuchamos contamina todos los juicios numéricos posteriores, aunque sea completamente arbitrario. En uno de sus experimentos, pidió a participantes que giraran una ruleta trucada que solo podía dar 10 o 65. Después les preguntó cuántos países africanos había en la ONU. Los que habían obtenido el 65 daban estimaciones significativamente más altas.`,
          `La heurística de disponibilidad explica por qué creemos que los accidentes de avión son más mortales que los de coche, o que el crimen está en máximos históricos cuando está en mínimos. Lo que recordamos con facilidad —porque apareció en las noticias, porque nos impresionó— nos parece más frecuente y más probable.`
        ]
      },
      {
        subtitle: 'Por qué esto importa más allá de la psicología',
        paragraphs: [
          `La obra de Kahneman tuvo un impacto inmediato en la economía conductual y el diseño de políticas públicas. Su colaborador Richard Thaler recibió también el Nobel en 2017 por aplicar estos hallazgos al diseño de <em>nudges</em>: empujones suaves que guían las decisiones sin restricciones ni incentivos económicos.`,
          `Cambiar el valor por defecto de "no donante" a "donante" en los formularios de donación de órganos ha triplicado la disponibilidad en los países que lo han implementado. Kahneman murió en marzo de 2024, pero su mayor legado es habernos enseñado a desconfiar de nuestra propia certeza: la intuición que se siente más verdadera es, a menudo, la que más necesita ser cuestionada.`
        ]
      }
    ],
    blockquote: { text: '«Somos máquinas de encontrar patrones en el ruido. El problema es que no podemos apagar esa máquina.»', attribution: 'Daniel Kahneman' },
    aplicacion: `Antes de tomar cualquier decisión que te importe hoy —comprar algo, responder un mensaje de forma impulsiva, juzgar a alguien—, párate exactamente dos segundos y hazte una pregunta: ¿es esto lo que pienso o es lo que mi cerebro me ha puesto delante por ser lo más rápido y fácil? Esa micro-pausa activa el Sistema 2. Es el coste mínimo de pensar por ti mismo.`
  }
];

/* ── PERFILES DE AUTORES ─────────────────────────────────────── */
const AUTHORS = {
  'Miguel Noguer Escudero': {
    photo: 'img/caramiguel.png',
    university: 'La Inferencia',
    specialty: 'Fundador y Director de Fuera de Bata'
  },
  'Valorie Salimpoor': {
    photo: 'img/caravalorie.png',
    university: 'McGill University / Rotman Research Institute',
    specialty: 'Neurobiología de la música y el placer'
  },
  'Manoj Thomas': {
    photo: 'img/caramanoj.png',
    university: 'Cornell University',
    specialty: 'Comportamiento del consumidor y psicología del precio'
  },
  'Daniel Kahneman': {
    photo: 'img/carakahneman.png',
    university: 'Princeton University',
    specialty: 'Juicio, toma de decisiones y psicología cognitiva'
  },
  'Drazen Prelec': {
    photo: 'img/caradrazen.png',
    university: 'MIT Sloan School of Management',
    specialty: 'Economía conductual y neuroeconomía'
  },
  'Hajo Adam': {
    photo: 'img/carahajo.png',
    university: 'Northwestern University / Rice University',
    specialty: 'Cognición vestida y comportamiento organizacional'
  },
  'Rob Nelissen': {
    photo: 'img/cararob.png',
    university: 'Tilburg University',
    specialty: 'Psicología social, emociones y estatus social'
  },
  'Edward Vessel': {
    photo: 'img/caraedward.png',
    university: 'Max Planck Institute for Empirical Aesthetics',
    specialty: 'Neuroestética y percepción del arte'
  },
  'Tristan Harris': {
    photo: 'img/caratristan.png',
    university: 'Center for Humane Technology',
    specialty: 'Psicología de la atención y ética tecnológica'
  },
  'Gloria Mark': {
    photo: 'img/caragloria.png',
    university: 'University of California, Irvine',
    specialty: 'Distracción digital, atención y uso de pantallas'
  },
  'Andrew Elliot': {
    photo: 'img/caraandrew.png',
    university: 'University of Rochester',
    specialty: 'Motivación, psicología del logro y efectos del color'
  },
  'Elizabeth Loftus': {
    photo: 'img/caraelizabeth.png',
    university: 'University of California, Irvine',
    specialty: 'Memoria humana, falsos recuerdos y psicología forense'
  },
  'Sian Beilock': {
    photo: 'img/carasian.png',
    university: 'Dartmouth College / Barnard College',
    specialty: 'Psicología del rendimiento y bloqueo bajo presión'
  },
  'Lera Boroditsky': {
    photo: 'img/caralera.png',
    university: 'University of California, San Diego',
    specialty: 'Psicolingüística cognitiva y relación entre lenguaje y pensamiento'
  },
  'Lysann Damisch': {
    photo: null,
    university: 'Universidad de Colonia',
    specialty: 'Psicología Social y Rendimiento'
  },
  'Stanley Milgram': {
    photo: null,
    university: 'Universidad de Yale / CUNY',
    specialty: 'Psicología social, obediencia a la autoridad y redes sociales'
  },
  'Albert Bandura': {
    photo: null,
    university: 'Universidad de Stanford',
    specialty: 'Aprendizaje social, autoeficacia y cognición social'
  },
  'Robert Cialdini': {
    photo: null,
    university: 'Universidad Estatal de Arizona',
    specialty: 'Persuasión, influencia social y comportamiento del consumidor'
  },
  'Jonathan Haidt': {
    photo: null,
    university: 'New York University (Stern School of Business)',
    specialty: 'Psicología moral, política y fundamentos de la intuición ética'
  },
  'Carol Dweck': {
    photo: null,
    university: 'Universidad de Stanford',
    specialty: 'Motivación, mentalidad de crecimiento y psicología del desarrollo'
  },
  'Michael Norton': {
    photo: null,
    university: 'Harvard Business School',
    specialty: 'Comportamiento del consumidor, dinero y felicidad'
  },
  'Barry Schwartz': {
    photo: null,
    university: 'Swarthmore College',
    specialty: 'Psicología de la elección, el bienestar y la motivación'
  },
  'Grant McCracken': {
    photo: null,
    university: 'MIT Media Lab / Royal Ontario Museum',
    specialty: 'Antropología del consumo y cultura de los objetos'
  },
  'Roy Baumeister': {
    photo: null,
    university: 'University of Queensland / Florida State University',
    specialty: 'Autocontrol, ego depletion y toma de decisiones'
  },
  'Shai Danziger': {
    photo: null,
    university: 'Universidad de Tel Aviv',
    specialty: 'Toma de decisiones judicial y sesgos cognitivos'
  },
  'Saul Kassin': {
    photo: null,
    university: 'Williams College / John Jay College of Criminal Justice',
    specialty: 'Psicología forense, confesiones y credibilidad del testimonio'
  },
  'Antonis Hatzigeorgiadis': {
    photo: null,
    university: 'Universidad de Tesalia, Grecia',
    specialty: 'Psicología del deporte y regulación cognitiva del rendimiento'
  },
  'James Driskell': {
    photo: null,
    university: 'Florida Maxima Corp / Naval Air Warfare Center',
    specialty: 'Psicología del rendimiento y entrenamiento mental'
  },
  'Paul Bloom': {
    photo: null,
    university: 'Yale University / University of Toronto',
    specialty: 'Psicología del placer, la moral y el esencialismo'
  },
  'John Suler': {
    photo: null,
    university: 'Rider University',
    specialty: 'Psicología del ciberespacio y comportamiento online'
  },
  'Eli Pariser': {
    photo: null,
    university: 'MoveOn.org / New America Foundation',
    specialty: 'Ética de los algoritmos y burbuja de filtros'
  },
  'John Gottman': {
    photo: null,
    university: 'Universidad de Washington',
    specialty: 'Psicología de la pareja y predicción del divorcio'
  },
  'Donald Dutton': {
    photo: null,
    university: 'Universidad de British Columbia',
    specialty: 'Psicología social y atracción interpersonal'
  },
  'Robert Sternberg': {
    photo: null,
    university: 'Universidad de Yale / Cornell University',
    specialty: 'Inteligencia, creatividad y psicología del amor'
  },
  'Mihaly Csikszentmihalyi': {
    photo: null,
    university: 'Universidad de Chicago / Claremont Graduate University',
    specialty: 'Psicología positiva, flujo y experiencia óptima'
  },
  'Ellen Langer': {
    photo: null,
    university: 'Universidad de Harvard',
    specialty: 'Mindfulness, control percibido y psicología de la salud'
  },
  'James Blumenthal': {
    photo: null,
    university: 'Universidad de Duke',
    specialty: 'Psicología de la salud cardiovascular y tratamiento de la depresión'
  },
  'Edward Deci': {
    photo: null,
    university: 'Universidad de Rochester',
    specialty: 'Teoría de la Autodeterminación y motivación intrínseca'
  },
  'Robert Bjork': {
    photo: null,
    university: 'UCLA',
    specialty: 'Memoria, aprendizaje y dificultades deseables'
  },
  'John Nestojko': {
    photo: null,
    university: 'Washington University en St. Louis',
    specialty: 'Metacognición y estrategias de aprendizaje'
  },
  'Teresa Amabile': {
    photo: null,
    university: 'Harvard Business School',
    specialty: 'Creatividad, motivación y bienestar en organizaciones'
  },
  'Amy Wrzesniewski': {
    photo: null,
    university: 'Universidad de Yale',
    specialty: 'Sentido del trabajo, identidad profesional y job crafting'
  },
  'Rob Cross': {
    photo: null,
    university: 'Babson College',
    specialty: 'Redes organizacionales, colaboración y liderazgo'
  }
};

/* ── QUIZ BANK ──────────────────────────────────────────────────
   2 preguntas por artículo. correct: índice 0-based de la opción correcta.
   Artículos sin entrada simplemente no muestran botón de quiz.        */
const QUIZ_BANK = {
  /* ECONOMÍA */
  'eco-01': [
    { q: '¿Cómo se llama el efecto por el que el dígito izquierdo de un precio domina su percepción?', opts: ['Efecto ancla temporal','Efecto de imagen izquierda','Sesgo de redondeo','Efecto de umbral'], correct: 1 },
    { q: 'En el estudio de seguimiento ocular, ¿cuánto menos tiempo procesaban el precio completo cuando terminaba en ,99?', opts: ['Un 10% menos','Un 20% menos','Un 30% menos','Un 50% menos'], correct: 2 }
  ],
  'eco-02': [
    { q: 'Según Kahneman y Tversky, perder 100 € duele…', opts: ['Igual que ganarlos alegra','El doble de lo que alegra ganarlos','Entre 1,5 y 2,5 veces más de lo que alegra ganarlos','Tres veces más'], correct: 2 },
    { q: '¿Cómo se llama la tendencia de los inversores a vender ganancias antes de tiempo y aguantar pérdidas demasiado?', opts: ['Efecto dotación','Disposition effect','Sesgo del statu quo','Aversión a la incertidumbre'], correct: 1 }
  ],
  'eco-03': [
    { q: 'En la subasta de entradas de la NBA, ¿cuánto más pujó el grupo de tarjeta frente al de efectivo?', opts: ['Un 30% más','Lo mismo','El doble','El triple'], correct: 2 },
    { q: '¿Cómo llamaron Prelec y Loewenstein al fenómeno de separar el momento de pago del consumo?', opts: ['Efecto tarjeta','Desacoplamiento del pago','Abstracción financiera','Diferimiento hedónico'], correct: 1 }
  ],
  'eco-04': [
    { q: '¿Cuánto más valoran los participantes los objetos que ellos mismos construyeron vs. observadores externos?', opts: ['Un 20% más','El doble','Entre 3 y 5 veces más','Lo mismo que los expertos'], correct: 2 },
    { q: '¿Qué ocurría con la valoración cuando el proceso de montaje era más frustrante e incompleto?', opts: ['La valoración bajaba','No cambiaba','La valoración subía aún más','El efecto desaparecía'], correct: 2 }
  ],
  'eco-05': [
    { q: 'En el experimento de la mermelada, ¿cuántas más veces vendía el expositor de 6 variedades frente al de 24?', opts: ['Lo mismo','3 veces más','5 veces más','10 veces más'], correct: 3 },
    { q: '¿Cómo llama Schwartz a quienes siempre buscan la opción absolutamente óptima (no solo suficientemente buena)?', opts: ['Satisficers','Maximizadores','Optimizadores','Racionales perfectos'], correct: 1 }
  ],
  /* MODA */
  'mod-01': [
    { q: '¿Qué condición es imprescindible para que la ropa influya en el rendimiento cognitivo?', opts: ['Que sea nueva y de calidad','Llevarla puesta Y activar su significado simbólico','Solo verla sin ponérsela','Que sea de un color específico'], correct: 1 },
    { q: '¿Qué nombre acuñó Adam para el efecto de la ropa sobre los procesos psicológicos?', opts: ['Cognición sartorial','Priming vestimentario','Enclothed cognition','Efecto uniforme'], correct: 2 }
  ],
  'mod-02': [
    { q: 'En el experimento de Nelissen, ¿en qué contexto el logo de lujo PERJUDICABA al portador?', opts: ['Entrevista de trabajo','Negociación salarial','Como recaudador de fondos para ONG','Primera cita romántica'], correct: 2 },
    { q: '¿Qué dos dimensiones usa el cerebro para evaluar a las personas socialmente?', opts: ['Atractivo y éxito','Riqueza y estatus','Competencia y calidez','Inteligencia y autoridad'], correct: 2 }
  ],
  'mod-03': [
    { q: '¿En cuántos países realizaron el experimento para descartar sesgos culturales?', opts: ['2','3','5','7'], correct: 2 },
    { q: '¿El rojo también aumentaba las valoraciones de inteligencia o amabilidad?', opts: ['Sí, en todos los juicios','Solo en la inteligencia','No, únicamente en el atractivo percibido','Solo en hombres mayores de 30'], correct: 2 }
  ],
  'mod-04': [
    { q: '¿Qué evento inspiró el ensayo de Diderot que da nombre al efecto?', opts: ['Reformar su estudio','Comprar un escritorio nuevo','Recibir una bata de seda de regalo','Perder todos sus muebles'], correct: 2 },
    { q: '¿Con qué tipo de compras tiene el efecto Diderot mayor intensidad?', opts: ['Compras funcionales','Compras impulsivas online','Compras aspiracionales que señalizan identidad','Compras en oferta'], correct: 2 }
  ],
  'mod-05': [
    { q: '¿Cómo llamó Baumeister al agotamiento cognitivo producido por decisiones acumuladas?', opts: ['Fatiga prefrontal','Sobrecarga decisional','Ego depletion','Síndrome decisor'], correct: 2 },
    { q: '¿Qué recurso biológico concreto consume la toma de decisiones, según Baumeister?', opts: ['Serotonina','Glucosa y actividad en la corteza prefrontal','Dopamina y noradrenalina','Oxígeno cerebral'], correct: 1 }
  ],
  /* DERECHO */
  'der-01': [
    { q: '¿Qué porcentaje de condenas erróneas demostradas por ADN incluían testimonio ocular como prueba principal?', opts: ['El 30%','Más del 45%','Más del 69%','El 90%'], correct: 2 },
    { q: '¿Cómo se llama el proceso por el que cada vez que recordamos algo lo reescribimos incorporando el contexto presente?', opts: ['Consolidación','Recuperación mnémica','Reconsolidación','Reactivación cortical'], correct: 2 }
  ],
  'der-02': [
    { q: '¿Cuánta diferencia en la estimación de velocidad producía el verbo "smashed" (chocaron) vs. "contacted" (se tocaron)?', opts: ['~1 milla/hora','~5 millas/hora','~9 millas/hora','~15 millas/hora'], correct: 2 },
    { q: '¿Qué porcentaje del grupo que oyó "smashed" dijo haber visto cristales rotos (inexistentes) una semana después?', opts: ['El 14%','El 22%','El 32%','El 50%'], correct: 2 }
  ],
  'der-03': [
    { q: '¿Cuál era la tasa de libertad condicional concedida justo DESPUÉS de comer, según el estudio de Danziger?', opts: ['El 30%','El 50%','El 65%','El 80%'], correct: 2 },
    { q: '¿Por qué denegar la libertad condicional es la opción "por defecto" del juez cognitivamente agotado?', opts: ['Es más rápido administrativamente','No requiere justificación activa y minimiza el riesgo percibido','Por presión del fiscal','Por sesgo sistemático del sistema'], correct: 1 }
  ],
  'der-04': [
    { q: 'En el experimento de Kassin, ¿qué porcentaje firmó la declaración de culpabilidad falsa cuando había un "testigo" cómplice?', opts: ['El 30%','El 50%','El 69%','El 90%'], correct: 2 },
    { q: '¿Cómo se llaman las confesiones en que el sospechoso genuinamente llega a creer que cometió lo que no cometió?', opts: ['Confesiones coactivas','Confesiones inducidas','Confesiones internalizadas','Confesiones estratégicas'], correct: 2 }
  ],
  /* DEPORTE */
  'dep-01': [
    { q: '¿En qué porcentaje mejoró la precisión el grupo que creyó tener la "pelota de la suerte"?', opts: ['7%','12%','17%','25%'], correct: 2 },
    { q: '¿Cuál es el mecanismo psicológico real detrás del efecto de los rituales en el rendimiento?', opts: ['La relajación muscular','El efecto placebo puro','El aumento de autoeficacia (creencia en la propia capacidad)','La distracción de los nervios'], correct: 2 }
  ],
  'dep-02': [
    { q: '¿En quiénes empeoraba el rendimiento cuando pensaban conscientemente en su técnica?', opts: ['Exclusivamente en los novatos','Los atletas de mayor edad','Los expertos (no los novatos)','Los dos grupos por igual'], correct: 2 },
    { q: '¿Qué tipo de memoria almacena los automatismos del experto que se deterioran bajo supervisión consciente?', opts: ['Memoria semántica','Memoria episódica','Memoria de trabajo','Memoria procedimental'], correct: 3 }
  ],
  'dep-03': [
    { q: '¿Qué tipo de diálogo interno es más eficaz para tareas de precisión motora fina?', opts: ['Motivacional ("¡puedo hacerlo!")','Instruccional (técnico y específico)','Ambos son igual de efectivos','El silencio mental'], correct: 1 },
    { q: '¿Por qué hablar a uno mismo en segunda persona ("tú puedes") puede ser más efectivo que en primera?', opts: ['Activa más el sistema motor','Mejora la memoria de trabajo','Reduce la activación del circuito de autocrítica y amenaza al ego','Aumenta los niveles de dopamina'], correct: 2 }
  ],
  'dep-04': [
    { q: '¿Qué porcentaje de los beneficios de la práctica física produce la práctica mental sola, según el metaanálisis?', opts: ['El 33%','El 50%','El 66%','El 80%'], correct: 2 },
    { q: '¿En quiénes es más efectiva la visualización mental, y por qué?', opts: ['En principiantes, porque tienen más que aprender','En expertos, porque tienen una representación mental más precisa del movimiento correcto','En ambos por igual','Solo en atletas de élite'], correct: 1 }
  ],
  /* ARTE */
  'art-01': [
    { q: '¿En qué región cerebral se registró el mayor aumento de dopamina durante el frisson musical?', opts: ['Corteza prefrontal','Amígdala','Núcleo accumbens y caudado','Hipocampo'], correct: 2 },
    { q: '¿Por qué la dopamina se libera en DOS fases distintas durante la escucha musical?', opts: ['Una fase de placer y otra de habituación','Una de anticipación (caudado) y otra durante el clímax (núcleo accumbens)','Una al inicio y otra al final de la pieza','Por dos circuitos independientes sin relación'], correct: 1 }
  ],
  'art-02': [
    { q: '¿Qué red neuronal activaban las obras "profundamente conmovedoras" que las meramente "bellas" no activaban?', opts: ['La red frontoparietal','La red de modo por defecto (DMN)','La red de atención ejecutiva','El sistema límbico basal'], correct: 1 },
    { q: '¿Por qué el arte ambiguo activa más el cerebro que el figurativo?', opts: ['Requiere más esfuerzo visual perceptual','Fuerza al cerebro a generar múltiples hipótesis y buscar referencias autobiográficas','Es más complejo de procesar visualmente','Activa más la memoria semántica'], correct: 1 }
  ],
  'art-03': [
    { q: 'En el experimento del agua fría, ¿cuál de las dos condiciones preferían repetir los participantes?', opts: ['La condición más corta (60 seg)','La más larga (90 seg, con el último tramo algo menos frío)','Ambas por igual','La que les parecía más justa'], correct: 1 },
    { q: '¿Cómo llama Kahneman al sistema que evalúa experiencias basándose en el recuerdo (pico + final)?', opts: ['El yo presente','El yo racional','El yo recordador','El yo experiencial'], correct: 2 }
  ],
  'art-04': [
    { q: '¿Cómo llama Bloom a la creencia automática de que los objetos contienen la "esencia" de su origen e historia?', opts: ['Sesgo de autenticidad','Esencialismo psicológico','Efecto de procedencia','Heurística de origen'], correct: 1 },
    { q: '¿Qué muestran los estudios de neuroimagen al contemplar una obra que se cree "original" vs. una "copia" indistinguible?', opts: ['La activación es idéntica','La copia activa más recompensa','El original activa circuitos de recompensa con más intensidad','Solo el juicio cognitivo cambia, no la experiencia'], correct: 2 }
  ],
  /* TECNOLOGÍA */
  'tec-01': [
    { q: '¿Qué psicólogo demostró que el refuerzo de ratio variable produce las tasas de respuesta más altas y resistentes?', opts: ['Pavlov','Bandura','B.F. Skinner','Watson'], correct: 2 },
    { q: '¿Por qué el feed algorítmico (impredecible) genera más uso compulsivo que el cronológico?', opts: ['Porque carga más rápido','Porque elimina el punto de parada y mantiene la incertidumbre sobre qué vendrá','Porque muestra más contenido relevante','Por el diseño visual'], correct: 1 }
  ],
  'tec-02': [
    { q: '¿Cuánto tiempo necesita de media el trabajador para recuperar la concentración plena tras una interrupción?', opts: ['5 minutos','10 minutos','23 minutos y 15 segundos','45 minutos'], correct: 2 },
    { q: '¿Cómo llamó Sophie Leroy al fenómeno de que recursos cognitivos siguen procesando la tarea anterior tras un cambio?', opts: ['Carga cognitiva','Residuo atencional','Fragmentación de tarea','Interferencia proactiva'], correct: 1 }
  ],
  'tec-03': [
    { q: '¿Cuántos factores identifica Suler como causantes de la desinhibición online?', opts: ['3','4','6','8'], correct: 2 },
    { q: '¿Cuál de estos es un efecto POSITIVO de la desinhibición online según Suler?', opts: ['El trolling anónimo','La polarización política','Compartir vulnerabilidades con más honestidad que en consulta presencial','La radicalización de ideas'], correct: 2 }
  ],
  'tec-04': [
    { q: 'Según el estudio de Facebook publicado en Science (2015), ¿cuánto reducía el algoritmo la exposición a contenido contrario en conservadores?', opts: ['El 2%','El 8%','El 20%','El 50%'], correct: 1 },
    { q: '¿Quién acuñó el término "filter bubble" (burbuja de filtros)?', opts: ['Mark Zuckerberg','Tristan Harris','Eli Pariser','Shoshana Zuboff'], correct: 2 }
  ],
  /* RELACIONES */
  'rel-01': [
    { q: '¿Qué porcentaje de conflictos de pareja son "perpetuos" (sin solución posible), según Gottman?', opts: ['El 30%','El 50%','El 69%','El 85%'], correct: 2 },
    { q: '¿Cuál de los "cuatro jinetes" de Gottman es el predictor MÁS potente del divorcio?', opts: ['La crítica al carácter','El desprecio','La actitud defensiva','El bloqueo emocional'], correct: 1 }
  ],
  'rel-02': [
    { q: '¿Qué porcentaje de los hombres que cruzaron el puente COLGANTE llamó después a la investigadora?', opts: ['El 12,5%','El 25%','El 40%','El 50%'], correct: 3 },
    { q: '¿Cómo se llama el fenómeno de atribuir la excitación fisiológica al estímulo más saliente del entorno?', opts: ['Efecto de transferencia emocional','Misattribution of arousal','Sesgo de atribución situacional','Efecto halo emocional'], correct: 1 }
  ],
  'rel-03': [
    { q: '¿Cuál de los tres componentes del amor de Sternberg decrece más rápidamente con la familiaridad?', opts: ['La intimidad','El compromiso','La pasión','Los tres por igual'], correct: 2 },
    { q: '¿Cómo llama Sternberg a la combinación de intimidad + compromiso SIN pasión?', opts: ['Amor consumado','Amor romántico','Amor compañero','Encaprichamiento'], correct: 2 }
  ],
  /* SALUD MENTAL */
  'sm-01': [
    { q: '¿Qué condición produce el estado de flujo, según Csikszentmihalyi?', opts: ['Tarea fácil sin presión','Desafío y habilidad altos y equilibrados entre sí','Máxima habilidad con mínimo desafío','Ausencia total de estrés'], correct: 1 },
    { q: '¿Qué ocurre neurológicamente con la corteza prefrontal durante el flujo?', opts: ['Se activa al máximo','Aumenta la autoconsciencia crítica','Se produce hipofrontalidad transitoria (desconexión parcial)','Libera serotonina masivamente'], correct: 2 }
  ],
  'sm-02': [
    { q: 'En el experimento de Langer y Rodin en la residencia de ancianos, ¿cuánto más alta era la mortalidad del grupo SIN autonomía a los 18 meses?', opts: ['Un 20% más alta','El doble','El triple','Igual'], correct: 1 },
    { q: '¿Por qué percibir control sobre algo pequeño tiene efectos biológicos más allá de ese dominio concreto?', opts: ['Por el efecto placebo puro','El cerebro no distingue el tamaño del dominio, solo si existe agencia','Porque reduce el cortisol solo en ese ámbito','Por aumento de autoestima'], correct: 1 }
  ],
  'sm-03': [
    { q: 'En el estudio de Blumenthal, ¿cuál fue la tasa de recaída en depresión del grupo de SOLO ejercicio a los 10 meses?', opts: ['El 8%','El 20%','El 31%','El 38%'], correct: 0 },
    { q: '¿Qué proteína aumenta con el ejercicio aeróbico y promueve el crecimiento de nuevas conexiones neuronales?', opts: ['Serotonina','Dopamina','BDNF (Factor Neurotrófico Derivado del Cerebro)','Endorfinas'], correct: 2 }
  ],
  /* EDUCACIÓN */
  'edu-01': [
    { q: 'En el experimento de Deci, ¿qué ocurrió con la motivación intrínseca cuando se retiró el pago?', opts: ['Volvió a los niveles originales','Se mantuvo igual que sin pago','El grupo que cobró dedicaba menos tiempo libre a los puzzles que antes de cobrar','Aumentó por sentirse más libre'], correct: 2 },
    { q: '¿Cómo se llama la reducción de motivación interna cuando se añade una recompensa externa contingente?', opts: ['Efecto de sobre-justificación','Sesgo de recompensa extrínseca','Paradoja del incentivo','Crowding-out motivacional'], correct: 0 }
  ],
  /* TRABAJO */
  'tra-01': [
    { q: '¿Qué factor motivador resultó ser el más poderoso en el trabajo, según el metaanálisis de Amabile?', opts: ['El salario y los beneficios','El reconocimiento público','El progreso significativo cotidiano en el trabajo','La autonomía total'], correct: 2 },
    { q: 'Según el principio del progreso, ¿qué tipo de logros tienen mayor impacto motivacional diario?', opts: ['Los grandes hitos anuales','Los pequeños avances cotidianos','Las recompensas sorpresa','Los proyectos completamente nuevos'], correct: 1 }
  ],
  'tra-02': [
    { q: '¿En qué tres dimensiones pueden los trabajadores hacer "crafting" de su puesto, según Wrzesniewski?', opts: ['Horario, salario y beneficios','Tareas, relaciones y significado del trabajo','Herramientas, equipo y métodos de trabajo','Jefe, colegas y clientes'], correct: 1 },
    { q: '¿Qué diferenciaba a los trabajadores que hacían job crafting de los que no, con el mismo puesto?', opts: ['Ganaban más dinero','Trabajaban menos horas','Reportaban más engagement y sentido, sin cambiar de empresa','Eran más creativos en general'], correct: 2 }
  ],
  /* SEMANALES */
  'weekly-19': [
    { q: '¿Qué porcentaje de participantes en el experimento original de Milgram llegó hasta los 450 voltios?', opts: ['El 25%','El 45%','El 65%','El 85%'], correct: 2 },
    { q: '¿Cómo llamó Milgram al estado en que la persona transfiere la responsabilidad moral a quien da las órdenes?', opts: ['Estado de sumisión','Estado agente','Estado de conformidad','Estado de obediencia ciega'], correct: 1 }
  ],
  'weekly-18': [
    { q: '¿Qué demostró el experimento del muñeco Bobo sobre el aprendizaje vicario?', opts: ['El aprendizaje requiere refuerzo directo','El refuerzo no determina el aprendizaje: determina si lo aprendido se expresa o no','Los niños solo aprenden conductas positivas observadas','El castigo elimina completamente la conducta aprendida'], correct: 1 },
    { q: '¿Cuántos procesos identifica Bandura como necesarios para el aprendizaje vicario?', opts: ['2 (observación e imitación)','3 (atención, retención y motivación)','4 (atención, retención, reproducción y motivación)','5 procesos independientes'], correct: 2 }
  ],
  'weekly-17': [
    { q: '¿Cuántos principios de influencia social identificó Cialdini?', opts: ['4','5','6','7'], correct: 2 },
    { q: 'En el experimento de la fotocopiadora con "razón vacía", ¿qué demostró?', opts: ['Las razones concretas son más persuasivas','El cerebro responde al patrón "razón + petición" aunque la razón no aporte información real','La urgencia multiplica la persuasión','Solo las peticiones urgentes tienen efecto'], correct: 1 }
  ],
  'weekly-16': [
    { q: '¿Cómo llama Haidt al estado en que sentimos que algo está moralmente mal pero no podemos justificarlo?', opts: ['Disonancia moral','Perplejidad moral','Sesgo intuitivo','Cortocircuito ético'], correct: 1 },
    { q: 'Según la teoría de Haidt, ¿qué papel cumple el razonamiento moral consciente?', opts: ['Es la fuente de nuestros juicios morales','Es una justificación posterior de juicios ya tomados por intuición emocional','Corrige los errores intuitivos','Varía completamente según la cultura'], correct: 1 }
  ],
  'weekly-15': [
    { q: '¿Cómo llamó Dweck a la creencia de que la inteligencia es fija e inmodificable?', opts: ['Mentalidad cerrada','Fixed mindset (mentalidad fija)','Rigidez cognitiva','Sesgo de capacidad'], correct: 1 },
    { q: '¿Qué tipo de elogio a los niños producía peor rendimiento posterior en tareas difíciles?', opts: ['Elogiar el esfuerzo','Elogiar la inteligencia o el talento innato','No elogiar en absoluto','Elogiar el resultado final'], correct: 1 }
  ]
};

/* ── DESAFÍOS DE LA SEMANA ──────────────────────────────────────
   Bloque accionable concreto para cada artículo semanal.           */
const DESAFIOS_SEMANA = {
  19: { texto: 'Durante 48 horas, identifica tres situaciones cotidianas donde estés siguiendo instrucciones sin cuestionarlas —un protocolo, una norma social, una petición de alguien con autoridad—. Para cada una, anota: «¿Lo haría igual si nadie me lo pidiera?» No para desobedecer, sino para distinguir cuándo actúas desde criterio propio y cuándo desde el estado agente.', duracion: '48 h' },
  18: { texto: 'Audita durante 3 días tus modelos observacionales: las tres personas que más sigues en redes, las series o podcasts habituales, las conversaciones recurrentes. Para cada uno, pregúntate: «¿Qué conductas estoy aprendiendo por observación?» Elimina deliberadamente uno que amplíe un repertorio de conductas que no quieres en tu vida.', duracion: '3 días' },
  17: { texto: 'Durante los próximos 7 días, ante cualquier decisión de compra, acuerdo o compromiso, identifica qué disparador de Cialdini está activo ANTES de decidir (reciprocidad, escasez, prueba social, autoridad, gusto, coherencia). Apúntalo en el momento. Al final de la semana, cuenta cuántas veces actuaste con conciencia del mecanismo.', duracion: '7 días' },
  16: { texto: 'En tu próxima conversación sobre un tema que genere indignación moral, añade un paso antes de argumentar: identifica qué fundación moral activó tu reacción (¿daño? ¿injusticia? ¿traición? ¿degradación?). Luego pregúntate si tu argumento es la causa de ese juicio o la justificación que construiste después.', duracion: '3 días' },
  15: { texto: 'Durante 5 días, cuando enfrentes algo difícil o cometas un error, reformula tu diálogo interno: cambia «no soy bueno en esto» por «aún no lo domino». Anota cada vez que usas el "aún" conscientemente. Observa si cambia tu disposición a intentarlo de nuevo.', duracion: '5 días' },
  14: { texto: 'Elige una tarea importante para esta semana y diseña deliberadamente el estado de flujo: define un objetivo concreto y medible (no "trabajar en X", sino "completar la sección Y"), elimina notificaciones durante 90 minutos seguidos y asegúrate de que el desafío está ligeramente por encima de tu nivel actual de comodidad.', duracion: '1 semana' },
  13: { texto: 'Identifica una decisión reciente que tomaste de forma reactiva y reconstrúyela: ¿qué heurístico estaba activo? ¿prueba social, disponibilidad, anclaje? Escribe en papel cuál habría sido tu decisión si hubieras tenido el doble de tiempo y la información necesaria. La distancia entre ambas es la medida de tu sesgo en ese momento.', duracion: '3 días' },
  12: { texto: 'Esta semana, antes de cualquier negociación o conversación importante, aplica el principio de la primera oferta: quien ancla primero define el campo de juego. Practica lanzar el ancla tú primero y observa cómo cambia la dinámica comparado con cuando esperas a que el otro empiece.', duracion: '1 semana' },
  11: { texto: 'Escoge un hábito que quieras establecer y diseña el entorno antes de empezar: pon la fricción más baja posible para la conducta que quieres (zapatillas al lado de la cama, libro en la mesita) y la fricción más alta posible para la que no quieres (teléfono fuera del dormitorio, snack detrás de objetos). Observa el resultado durante 5 días.', duracion: '5 días' },
  10: { texto: 'Esta semana, cuando tengas que dar feedback a alguien (en el trabajo, en casa), usa el enfoque de Gottman: comienza con algo genuinamente positivo, luego el comportamiento concreto que quieres cambiar (no el carácter), y termina con una expectativa clara. Observa si la recepción cambia respecto a tu forma habitual.', duracion: '1 semana' }
};

/* ── ESTADÍSTICAS DESTACADAS ─────────────────────────────────────
   Datos clave de cada artículo, visualizados como callout.         */
const ARTICLE_STATS = {
  'eco-01': [{ value: '30%', label: 'menos tiempo', detail: 'en procesar el precio completo cuando termina en ,99' }],
  'eco-02': [{ value: '1,5–2,5×', label: 'más duele perder', detail: 'que alegra ganar la misma cantidad de dinero' }],
  'eco-03': [{ value: '2×', label: 'más alta la puja', detail: 'al pagar con tarjeta vs. efectivo por las mismas entradas' }],
  'eco-05': [{ value: '10×', label: 'más ventas', detail: 'con 6 variedades de mermelada frente a 24 opciones' }],
  'der-01': [{ value: '+69%', label: 'de condenas erróneas', detail: 'incluían testimonio ocular como prueba principal' }],
  'der-03': [{ value: '65% → 0%', label: 'libertad concedida', detail: 'justo después de comer vs. justo antes del descanso' }],
  'dep-01': [{ value: '+17%', label: 'de precisión', detail: 'simplemente creyendo tener una "pelota de la suerte"' }],
  'dep-04': [{ value: '66%', label: 'de beneficios', detail: 'de la práctica física se obtienen con práctica mental sola' }],
  'sm-03':  [{ value: '8% vs 38%', label: 'recaída a 10 meses', detail: 'solo ejercicio vs. solo medicación (mismo período de tratamiento)' }],
  'tec-02': [{ value: '23 min', label: 'para recuperar', detail: 'la concentración plena tras una sola interrupción' }],
  'rel-01': [{ value: '69%', label: 'de conflictos de pareja', detail: 'son perpetuos — no tienen solución, solo gestión' }],
  'rel-02': [{ value: '50% vs 12,5%', label: 'la llamaron después', detail: 'puente colgante vs. puente sólido — mismo encuentro, distinta excitación' }],
  'art-01': [{ value: '6–9%', label: 'más dopamina', detail: 'en el núcleo accumbens durante el frisson musical' }]
};

/* ── FUNCIONES HELPER DE ARTÍCULO ──────────────────────────────── */
function _buildTocHTML(sections) {
  if (!sections || sections.length < 2) return '';
  return `<nav class="article-toc" aria-label="Índice del artículo">
    <span class="toc-label">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      Índice
    </span>
    <ol class="toc-list">${sections.map((s, i) =>
      `<li><a class="toc-link" href="#art-sec-${i}">${s.subtitle}</a></li>`
    ).join('')}</ol>
  </nav>`;
}

function _buildStatsHTML(id) {
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

(function _initQuizDone() {})(); /* placeholder — quiz IIFE below registers helpers */
function _getQuizDone(id) {
  try { return JSON.parse(localStorage.getItem('li_quizzes') || '{}')[id] || false; } catch { return false; }
}

function _buildQuizBtnHTML(id) {
  if (!QUIZ_BANK[id]) return '';
  const done = _getQuizDone(id);
  return `<div class="quiz-launch-wrap">
    <button class="quiz-launch-btn${done ? ' quiz-done' : ''}" data-quiz-id="${id}" aria-label="${done ? 'Quiz ya completado' : 'Abrir quiz del artículo'}">
      ${done
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Quiz completado`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Comprueba lo que aprendiste`
      }
    </button>
  </div>`;
}

function _buildDesafioHTML(week) {
  const d = DESAFIOS_SEMANA[week];
  if (!d) return '';
  let accepted = false;
  try { accepted = !!(JSON.parse(localStorage.getItem('li_challenges') || '{}')[week]); } catch {}
  return `<div class="desafio-block${accepted ? ' desafio-accepted' : ''}" id="desafio-w${week}">
    <div class="desafio-header">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      <strong>Desafío de la semana</strong>
      <span class="desafio-duracion">${d.duracion}</span>
    </div>
    <p class="desafio-texto">${d.texto}</p>
    <button class="desafio-accept-btn" data-week="${week}" ${accepted ? 'disabled' : ''} aria-pressed="${accepted}">
      ${accepted
        ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Desafío aceptado`
        : '¿Lo aceptas? →'
      }
    </button>
  </div>`;
}

function _buildRelatedWeeklyHTML(badge, currentWeek) {
  const pool = Object.entries(LIBRARY_ARTICLES).flatMap(([cat, arr]) =>
    arr.map(a => ({ ...a, _cat: cat }))
  );
  const sameBadge = pool.filter(a => a.badge === badge);
  const others    = pool.filter(a => a.badge !== badge);
  const shuffle   = arr => arr.sort(() => Math.random() - 0.5);
  const picks     = [...shuffle(sameBadge), ...shuffle(others)].slice(0, 2);
  if (!picks.length) return '';
  return `<div class="related-articles">
    <div class="related-header">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      También puede interesarte
    </div>
    <div class="related-grid">
      ${picks.map(a => `
        <div class="related-card" data-rel-id="${a.id}" data-rel-cat="${a._cat}" role="button" tabindex="0">
          <span class="doc-badge">${a.badge}</span>
          <p class="related-title">${a.title}</p>
          <span class="related-author">${a.author.name}</span>
        </div>`).join('')}
    </div>
  </div>`;
}

/*
 * REGLA DE TIEMPOS DE LECTURA
 * ─────────────────────────────────────────────────────────────────
 * • LIBRARY_ARTICLES y WEEKLY_ARTICLES: readingTime almacenado a la
 *   mitad de la estimación bruta (valores: '3 min', '4 min', '5 min').
 * • Fuera de Bata: tiempos hardcodeados en index.html — NO modificar.
 *   Esos artículos son más largos y sus tiempos están calibrados.
 * ─────────────────────────────────────────────────────────────────
 */

/* Genera el HTML de un botón de favorito leyendo localStorage directamente,
   para que funcione antes de que el IIFE de favoritos se haya inicializado. */
function _favBtnHTML(id, extraClass) {
  try {
    const faved = (JSON.parse(localStorage.getItem('li_favorites') || '[]')).includes(id);
    const svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="${faved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    return `<button class="fav-btn fav-btn-dyn${extraClass ? ' ' + extraClass : ''}${faved ? ' active' : ''}" data-fav-id="${id}" aria-label="${faved ? 'Quitar de favoritos' : 'Guardar en favoritos'}" title="${faved ? 'Quitar de favoritos' : 'Guardar en favoritos'}">${svg}</button>`;
  } catch (_) { return ''; }
}

function renderAuthorCard(author) {
  const profile    = AUTHORS[author.name] || {};
  const photo      = profile.photo || null;
  const univ       = profile.university || author.university;
  const spec       = profile.specialty  || author.specialty;
  const isFounder  = author.name === 'Miguel Noguer Escudero';
  const avatarHTML = photo
    ? `<img src="${photo}" alt="${author.name}" class="author-avatar-img" />`
    : author.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const metaHTML = isFounder
    ? `<div class="role-badges-row role-badges-row--inline">
         <span class="role-badge">Fundador de La Inferencia</span>
         <span class="role-badge">Director de Fuera de Bata</span>
       </div>`
    : `<span>${univ}</span><span>${spec}</span>`;
  return `
    <div class="author-card">
      <div class="author-avatar${photo ? ' author-avatar-photo' : ''}">${avatarHTML}</div>
      <div>
        <strong>${author.name}</strong>
        ${metaHTML}
      </div>
    </div>`;
}


function renderFeaturedWeekly(article) {
  const { week, author, badge, title, readingTime, intro, sections, blockquote, aplicacion } = article;
  const sectionsHTML = sections.map((s, i) =>
    `<h3 class="article-subtitle" id="art-sec-${i}">${s.subtitle}</h3>${s.paragraphs.map(p => `<p>${p}</p>`).join('')}`
  ).join('');
  /* Marcar artículo semanal como leído */
  if (window._LI_markWeeklyRead) window._LI_markWeeklyRead(week);
  const speechAvailable = !!window.speechSynthesis;
  const enfocado = document.body.classList.contains('modo-enfoque-activo');
  return `
    <div class="weekly-featured-card">
      <div class="week-label">
        <span class="week-tag">✦ Artículo de la Semana ${week}</span>
        <span class="reading-time"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="url(#clock-grad)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${readingTime} de lectura</span>
        <button class="btn-modo-enfoque" id="btn-modo-enfoque" aria-pressed="${enfocado}">${enfocado ? '✕ Salir de enfoque' : '📖 Modo Enfoque'}</button>
        ${_favBtnHTML('weekly-' + week, 'fav-btn--article')}
        <button class="article-share-btn" data-share-title="${title.replace(/"/g,'&quot;')}" data-share-text="Artículo de La Inferencia: ${title.replace(/"/g,'&quot;')}" aria-label="Compartir artículo" title="Compartir">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Compartir
        </button>
      </div>
      <span class="doc-badge" style="margin-bottom:0.5rem;">${badge}</span>
      <h2 class="weekly-title">${title}</h2>
      ${renderAuthorCard(author)}
      ${_buildTocHTML(sections)}
      <div class="article-content">
        <p class="article-intro">${intro}</p>
        ${_buildStatsHTML('weekly-' + week)}
        ${sectionsHTML}
        <blockquote class="article-blockquote">
          <p>${blockquote.text}</p>
          <cite>— ${blockquote.attribution}</cite>
        </blockquote>
        ${aplicacion ? `<div class="aplicacion-block">
          <div class="aplicacion-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            <strong>¿Cómo te afecta esto hoy?</strong>
          </div>
          <p>${aplicacion}</p>
        </div>` : ''}
        ${_buildDesafioHTML(week)}
        ${_buildQuizBtnHTML('weekly-' + week)}
        ${_buildRelatedWeeklyHTML(badge, week)}
      </div>
    </div>`;
}

function renderPreviousCard(article) {
  const excerpt = article.intro.substring(0, 190) + '…';
  return `
    <div class="weekly-prev-card" data-week="${article.week}" style="position:relative">
      ${_favBtnHTML('weekly-' + article.week, 'fav-btn--prev-card')}
      <span class="doc-badge">${article.badge}</span>
      <h3>${article.title}</h3>
      <p class="weekly-prev-meta">${article.author.name} · ${article.date} · <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="url(#clock-grad)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${article.readingTime}</p>
      <p class="weekly-prev-excerpt">${excerpt}</p>
    </div>`;
}

function renderWeeklyView(available, featured) {
  const container = document.getElementById('weekly-container');
  if (!container || !featured) return;
  const previous = available.filter(a => a.week !== featured.week);
  let html = renderFeaturedWeekly(featured);

  if (previous.length > 0) {
    /* ── Desktop: grid de tarjetas ── */
    html += `<div class="weekly-prev-section">
      <div class="seccion-header"><h2>Semanas Anteriores</h2><div class="seccion-linea"></div></div>
      <div class="weekly-prev-grid">${previous.map(renderPreviousCard).join('')}</div>
    </div>`;

    /* ── Móvil: botón disparador + drawer bottom-sheet ── */
    const drawerItems = previous.map(a => `
      <div class="wpd-item" data-week="${a.week}" role="button" tabindex="0" aria-label="${a.title}">
        <div class="wpd-item-left">
          <span class="doc-badge wpd-badge">${a.badge}</span>
          <div class="wpd-item-body">
            <span class="wpd-item-title">${a.title}</span>
            <span class="wpd-item-meta">${a.author.name} · ${a.date} · ${a.readingTime} de lectura</span>
          </div>
        </div>
        <svg class="wpd-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </div>`).join('');

    html += `
    <div class="weekly-prev-mob-trigger">
      <button class="weekly-prev-mob-btn" id="weekly-prev-mob-btn" aria-haspopup="dialog" aria-controls="weekly-prev-drawer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Ver semanas anteriores
        <span class="wpd-count">${previous.length}</span>
      </button>
    </div>

    <div class="weekly-prev-drawer" id="weekly-prev-drawer" role="dialog" aria-modal="true" aria-label="Semanas anteriores" hidden>
      <div class="wpd-overlay" id="wpd-overlay"></div>
      <div class="wpd-sheet" role="document">
        <div class="wpd-handle" aria-hidden="true"></div>
        <div class="wpd-header">
          <span class="wpd-title">Semanas anteriores</span>
          <button class="wpd-close" id="wpd-close" aria-label="Cerrar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="wpd-list">${drawerItems}</div>
      </div>
    </div>`;
  }

  container.innerHTML = html;

  /* Clicks en grid desktop */
  container.querySelectorAll('.weekly-prev-card').forEach(card => {
    card.addEventListener('click', () => {
      const wk  = parseInt(card.dataset.week);
      const art = WEEKLY_ARTICLES.find(a => a.week === wk);
      if (art) {
        renderWeeklyView(available, art);
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Drawer móvil */
  const drawer  = document.getElementById('weekly-prev-drawer');
  const trigger = document.getElementById('weekly-prev-mob-btn');
  const overlay = document.getElementById('wpd-overlay');
  const closeBtn= document.getElementById('wpd-close');

  function openDrawer()  {
    if (!drawer) return;
    drawer.removeAttribute('hidden');
    /* No bloquear el scroll del body — el drawer es position:fixed */
    requestAnimationFrame(() => drawer.classList.add('wpd-open'));
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('wpd-open');
    setTimeout(() => drawer.setAttribute('hidden', ''), 320);
  }

  trigger?.addEventListener('click', openDrawer);
  overlay?.addEventListener('click', closeDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function wpdEsc(e) {
    if (e.key === 'Escape' && drawer && !drawer.hasAttribute('hidden')) {
      closeDrawer();
      document.removeEventListener('keydown', wpdEsc);
    }
  });

  /* Clicks en items del drawer */
  container.querySelectorAll('.wpd-item').forEach(item => {
    const activate = () => {
      const wk  = parseInt(item.dataset.week);
      const art = WEEKLY_ARTICLES.find(a => a.week === wk);
      if (art) {
        closeDrawer();
        setTimeout(() => {
          renderWeeklyView(available, art);
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 160);
      }
    };
    item.addEventListener('click', activate);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }});
  });
}

function initWeeklySection() {
  const currentWeek = getWeekOfYear(new Date());
  const available = [...WEEKLY_ARTICLES]
    .filter(a => a.week <= currentWeek)
    .sort((a, b) => b.week - a.week);
  const container = document.getElementById('weekly-container');
  if (!container) return;
  if (available.length === 0) {
    container.innerHTML = '<p class="empty-state" style="display:block">No hay artículos disponibles aún.</p>';
    return;
  }
  renderWeeklyView(available, available[0]);

  window._LI_renderWeekly = function(week) {
    const art = available.find(a => a.week === week);
    if (art) {
      renderWeeklyView(available, art);
      document.getElementById('weekly-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState({ v: 'semana', n: week }, '', `?v=semana&n=${week}`);
    }
  };
}


/* ── PESTAÑAS ────────────────────────────────────────────────── */
(function () {
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const panels     = document.querySelectorAll('.tab-panel');
  const filterPills = document.getElementById('filter-pills');

  /* Posiciona el pill deslizante bajo el tab activo */
  function moveTabPill(activeBtn, animate) {
    const bar  = activeBtn.closest('.tab-bar');
    const pill = bar && bar.querySelector('.tab-pill');
    if (!pill || !bar) return;
    const barRect = bar.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const isCol   = getComputedStyle(bar).flexDirection === 'column';
    if (!animate) pill.style.transition = 'none';
    if (isCol) {
      pill.style.left   = '4px';
      pill.style.width  = (barRect.width - 8) + 'px';
      pill.style.top    = (btnRect.top - barRect.top) + 'px';
      pill.style.height = btnRect.height + 'px';
    } else {
      pill.style.top    = '4px';
      pill.style.height = (barRect.height - 8) + 'px';
      pill.style.left   = (btnRect.left - barRect.left) + 'px';
      pill.style.width  = btnRect.width + 'px';
    }
    if (!animate) {
      pill.offsetHeight;
      pill.style.transition = '';
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
        b.setAttribute('aria-selected', b.dataset.tab === tab);
      });
      panels.forEach(p => p.classList.toggle('active', p.id === `panel-${tab}`));
      if (filterPills) filterPills.style.display = tab === 'repositorio' ? '' : 'none';
      moveTabPill(btn, true);
      /* Desactivar modo enfoque al cambiar de pestaña */
      if (document.body.classList.contains('modo-enfoque-activo')) {
        if (window._LI_setEnfoque) window._LI_setEnfoque(false);
      }
    });
  });

  /* Inicializar pill sin animación */
  requestAnimationFrame(() => {
    const activeBtn = document.querySelector('.tab-btn.active');
    if (activeBtn) moveTabPill(activeBtn, false);
  });

  /* Reposicionar al cambiar tamaño de ventana */
  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.tab-btn.active');
    if (activeBtn) moveTabPill(activeBtn, false);
  }, { passive: true });

  initWeeklySection();
}());


/* ── BÚSQUEDA UNIVERSAL ──────────────────────────────────────── */
(function () {
  const input      = document.getElementById('search-input');
  const pills      = document.querySelectorAll('.pill');
  const cards      = document.querySelectorAll('.doc-card');
  const grid2      = document.getElementById('docs-grid-2');
  const emptyState = document.getElementById('empty-state');
  if (!input) return;

  /* ── Panel de resultados ── */
  const panel = document.createElement('div');
  panel.id = 'srp-panel';
  panel.className = 'srp-panel';
  panel.setAttribute('role', 'listbox');
  panel.setAttribute('aria-label', 'Resultados de búsqueda');
  panel.hidden = true;
  input.closest('.search-bar').appendChild(panel);

  /* ── Filtros de Fuera de Bata (comportamiento original) ── */
  let filter = 'todos';
  function applyDocFilter(q) {
    let visible = 0;
    cards.forEach(card => {
      const cat  = card.dataset.category || '';
      const text = (card.textContent + ' ' + (card.dataset.text || '')).toLowerCase();
      const ok   = (filter === 'todos' || cat === filter) && (q === '' || text.includes(q));
      card.style.display = ok ? '' : 'none';
      if (ok) visible++;
    });
    if (grid2) {
      const g2v = Array.from(grid2.querySelectorAll('.doc-card')).some(c => c.style.display !== 'none');
      grid2.style.display = g2v ? '' : 'none';
    }
    if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
  }
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filter = pill.dataset.filter;
      applyDocFilter(input.value.toLowerCase().trim());
    });
  });

  /* ── Búsqueda global ── */
  function buildIndex() {
    const idx = [];

    /* 1 · Biblioteca de artículos (Por Intereses) */
    Object.entries(LIBRARY_ARTICLES).forEach(([cat, arts]) => {
      arts.forEach(a => idx.push({
        type: 'lib', cat,
        title: a.title,
        sub: a.author.name + ' · ' + a.badge,
        search: (a.title + ' ' + (a.summary || '') + ' ' + (a.intro || '') + ' ' +
                 a.author.name + ' ' + a.badge + ' ' + cat).toLowerCase(),
        id: a.id
      }));
    });

    /* 2 · Artículos semanales */
    WEEKLY_ARTICLES.forEach(a => idx.push({
      type: 'weekly', week: a.week,
      title: a.title,
      sub: a.author.name + ' · Semana ' + a.week,
      search: (a.title + ' ' + (a.summary || '') + ' ' + (a.intro || '') + ' ' +
               a.author.name + ' ' + (a.badge || '')).toLowerCase()
    }));

    /* 3 · Efectos y sesgos cognitivos (con texto extendido de EFECTOS_EXTRA) */
    if (typeof EFECTOS_DATA !== 'undefined') {
      Object.entries(EFECTOS_DATA).forEach(([id, e]) => {
        const extra = (typeof EFECTOS_EXTRA !== 'undefined' && EFECTOS_EXTRA[id]) || {};
        idx.push({
          type: 'efecto', id,
          title: e.nombre,
          sub: e.gancho,
          search: (e.nombre + ' ' + e.gancho + ' ' + e.explicacion + ' ' +
                   (e.aplicaciones || []).join(' ') + ' ' +
                   (extra.mecanismo || '') + ' ' + (extra.mecanismo2 || '') + ' ' +
                   (extra.explicacion2 || '')).toLowerCase()
        });
      });
    }

    /* 4 · Documentos de Fuera de Bata (tarjetas HTML con data-text) */
    document.querySelectorAll('#documentos-list .doc-card').forEach(card => {
      const titleEl = card.querySelector('h3');
      const descEl  = card.querySelector('.doc-desc');
      const badgeEl = card.querySelector('.doc-badge');
      if (!titleEl) return;
      const title    = titleEl.textContent.trim();
      const desc     = descEl  ? descEl.textContent.trim()  : '';
      const badge    = badgeEl ? badgeEl.textContent.trim() : '';
      const dataText = card.dataset.text || '';
      idx.push({
        type: 'doc',
        title,
        sub: 'Fuera de Bata · ' + badge,
        search: (title + ' ' + desc + ' ' + badge + ' ' + dataText).toLowerCase()
      });
    });

    return idx;
  }
  let searchIndex = null;

  function renderPanel(q) {
    if (!q || q.length < 2) { panel.hidden = true; return; }
    if (!searchIndex) searchIndex = buildIndex();

    const hits = searchIndex.filter(item => item.search.includes(q)).slice(0, 12);
    if (!hits.length) {
      panel.innerHTML = `<div class="li-empty srp-empty">
        <span class="li-empty-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
        <span><strong>Sin resultados</strong>No encontramos nada para "<em>${q}</em>"</span>
      </div>`;
      panel.hidden = false;
      return;
    }

    const typeLabel = {
      lib:    'Por Intereses',
      weekly: 'Artículo semanal',
      efecto: 'Efecto cognitivo',
      doc:    'Fuera de Bata'
    };
    const typeIcon  = {
      lib:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
      weekly: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      efecto: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      doc:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
    };

    panel.innerHTML = hits.map(h => `
      <div class="srp-item" data-type="${h.type}" data-id="${h.id || ''}" data-cat="${h.cat || ''}" data-week="${h.week || ''}" role="option" tabindex="0">
        <span class="srp-icon">${typeIcon[h.type]}</span>
        <span class="srp-body">
          <span class="srp-title">${h.title}</span>
          <span class="srp-sub">${typeLabel[h.type]} · ${h.sub}</span>
        </span>
      </div>`).join('');
    panel.hidden = false;

    panel.querySelectorAll('.srp-item').forEach(item => {
      const go = () => {
        panel.hidden = true;
        input.value = '';
        const { type, id, cat, week } = item.dataset;
        if (type === 'lib') {
          document.querySelector('.tab-btn[data-tab="biblioteca"]')?.click();
          setTimeout(() => {
            document.querySelector(`.cat-btn[data-cat="${cat}"]`)?.click();
            setTimeout(() => { if (window._LI_openLibArticle) window._LI_openLibArticle(id, cat); }, 120);
          }, 80);
        } else if (type === 'weekly') {
          document.querySelector('.tab-btn[data-tab="semana"]')?.click();
          setTimeout(() => { if (window._LI_renderWeekly) window._LI_renderWeekly(parseInt(week)); }, 80);
        } else if (type === 'efecto') {
          document.querySelector(`.efecto-card[data-efecto="${id}"]`)?.click();
        } else if (type === 'doc') {
          document.querySelector('.tab-btn[data-tab="repositorio"]')?.click();
          setTimeout(() => {
            const lista = document.getElementById('documentos-list');
            if (lista) lista.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
      };
      item.addEventListener('click', go);
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
  }

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    /* applyDocFilter solo cuando la pestaña de Fuera de Bata está activa */
    const repoActive = document.getElementById('panel-repositorio')?.classList.contains('active');
    if (repoActive) applyDocFilter(q);
    renderPanel(q);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) panel.hidden = false;
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-bar') && !e.target.closest('#srp-panel')) {
      panel.hidden = true;
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { panel.hidden = true; input.blur(); }
  });
}());


/* ── EXPERIMENTO INTERACTIVO ─────────────────────────────────── */
(function () {
  const QUESTIONS = [
    {
      sesgo: 'Sistema 1 — Pensamiento rápido (Kahneman)',
      pregunta: 'Un bate y una pelota cuestan 1,10 € en total. El bate cuesta 1 € más que la pelota. ¿Cuánto cuesta la pelota?',
      opciones: ['10 céntimos', '5 céntimos', '50 céntimos'],
      correcta: 1,
      pctWrong: 80,
      labelWrong: 'de las personas respondieron "10 céntimos"',
      labelRight: 'respondieron correctamente (5 céntimos)',
      explicacion: 'Si la pelota costara 10 céntimos, el bate costaría 1,10 € y el total sería 1,20 €. La respuesta correcta es 5 céntimos (bate: 1,05 € + pelota: 0,05 € = 1,10 €). El Sistema 1 genera la respuesta intuitiva sin verificarla, y el Sistema 2 no la cuestiona. Kahneman usó este problema para ilustrar exactamente cómo funciona el pensamiento perezoso.'
    },
    {
      sesgo: 'Efecto framing — Enmarcamiento lingüístico (Kahneman)',
      pregunta: 'Una epidemia amenaza con matar a 600 personas. Elige un programa de respuesta: el Programa A garantiza salvar a 200 personas. El Programa B tiene un 33% de probabilidad de salvar a las 600 y un 67% de que no sobreviva nadie.',
      opciones: ['Programa A — 200 personas seguras', 'Programa B — probabilidad de salvar todas'],
      correcta: null,
      pctA: 72, pctB: 28,
      labelA: 'eligieron el Programa A (enmarcado como "vidas salvadas")',
      labelB: 'eligieron el Programa B',
      explicacion: 'El 72% elige el Programa A cuando se enmarca en términos de "vidas salvadas". Pero si se reformula como "400 personas morirán" vs. "33% de que no muera nadie", el 78% elige el Programa B. El resultado matemático es idéntico. El marco lingüístico —no la lógica— guía tu decisión. Esto es lo que Kahneman llamó efecto framing.'
    },
    {
      sesgo: 'Falsos recuerdos — Efecto DRM (Loftus & Deese-Roediger-McDermott)',
      pregunta: 'Lee con atención esta lista de palabras: CAMA · DESCANSO · CANSADO · SUEÑO · SIESTA · NOCHE · ALMOHADA. Ahora responde sin releer: ¿aparecía la palabra DORMIR en la lista?',
      opciones: ['Sí, la vi en la lista', 'No, no estaba en la lista'],
      correcta: 1,
      pctWrong: 65,
      labelWrong: 'creyeron recordar haber leído "DORMIR"',
      labelRight: 'respondieron correctamente (no estaba)',
      explicacion: 'DORMIR no aparecía en la lista. Sin embargo, el 65% de las personas recuerda haberla visto. Todas las palabras de la lista están semánticamente asociadas a "dormir", lo que activa esa representación en tu memoria aunque nunca apareciese. Tu cerebro construyó ese recuerdo. Esto es precisamente el fenómeno que Elizabeth Loftus lleva décadas estudiando.'
    },
    {
      sesgo: 'Efecto de Anclaje (Tversky & Kahneman, 1974)',
      pregunta: 'Estima mentalmente, en 5 segundos, el resultado de esta multiplicación: 1 × 2 × 3 × 4 × 5 × 6 × 7 × 8',
      opciones: ['Menos de 1.000', 'Entre 1.000 y 10.000', 'Más de 10.000'],
      correcta: 2,
      pctWrong: 78,
      labelWrong: 'eligieron "menos de 1.000" (el ancla del número 1 arrastra la percepción)',
      labelRight: 'acertaron — el resultado real es 40.320',
      explicacion: 'El resultado es 40.320. Tversky y Kahneman encontraron que cuando la multiplicación se presenta en orden ascendente (1×2×3…) la estimación media es 512; en orden descendente (8×7×6…), sube a 2.250. En ambos casos, muy lejos del resultado real. El primer número actúa como ancla: el cerebro hace los primeros pasos y extrapola desde ese valor inicial sin ajustar suficientemente hacia arriba.'
    },
    {
      sesgo: 'Sesgo de Confirmación — Tarea de Wason (1960)',
      pregunta: 'Hay cuatro cartas: 4 · 7 · ROJA · AZUL. Cada carta tiene un número en un lado y un color en el otro. La regla: «Si una carta tiene el 4, el reverso es rojo». ¿Cuáles hay que dar la vuelta para saber si la regla es FALSA?',
      opciones: ['La carta 4 y la carta ROJA', 'La carta 4 y la carta AZUL', 'Solo la carta 4'],
      correcta: 1,
      pctWrong: 89,
      labelWrong: 'eligieron "4 y ROJA" — el error más común',
      labelRight: 'correcto — hay que intentar falsificar, no confirmar',
      explicacion: 'La respuesta es dar la vuelta a la carta 4 (verificar si su reverso es rojo) y a la carta AZUL (ver si al otro lado hay un 4, lo que violaría la regla). La carta ROJA no importa: tenga el número que tenga, no viola la regla. El sesgo de confirmación nos hace buscar evidencia que valide la hipótesis en lugar de intentar falsificarla. Solo el 10% de participantes lo resuelve correctamente, incluso entre universitarios de ciencias.'
    },
    {
      sesgo: 'Heurística de Disponibilidad (Kahneman & Tversky, 1973)',
      pregunta: '¿Cuál de estas causas de muerte mata a más personas cada año en España?',
      opciones: ['Accidentes de aviación', 'Caídas accidentales (escaleras, andamios, bañeras…)'],
      correcta: 1,
      pctWrong: 71,
      labelWrong: 'dijeron que los accidentes de aviación',
      labelRight: 'correcto — las caídas accidentales causan entre 15 y 20 veces más muertes',
      explicacion: 'Los accidentes de aviación generan cobertura mediática masiva cuando ocurren. Las caídas domésticas matan silenciosamente a miles de personas cada año sin un solo titular. La heurística de disponibilidad confunde facilidad de recuerdo con frecuencia real: lo que aparece en las noticias parece más probable, independientemente de la estadística.'
    },
    {
      sesgo: 'Efecto Halo (Edward Thorndike, 1920)',
      pregunta: 'Un candidato entra a una entrevista bien vestido, sonriente y con apretón de manos firme. Sin haber dicho aún nada, ¿qué probabilidad de competencia profesional le asignas?',
      opciones: ['Alta — la primera impresión dice mucho', 'No lo sé todavía, necesito escucharle', 'Baja — las apariencias engañan'],
      correcta: 1,
      pctWrong: 63,
      labelWrong: 'asignaron alta probabilidad sin datos reales de competencia (efecto halo)',
      labelRight: 'correcto — aún no hay información sobre su capacidad real',
      explicacion: 'El efecto halo demuestra que una cualidad positiva visible —apariencia cuidada, simpatía, postura— contamina automáticamente nuestra valoración de atributos no relacionados. Thorndike lo documentó en evaluaciones militares donde las puntuaciones en aspecto físico correlacionaban artificialmente con la inteligencia estimada. La primera impresión activa un marco que filtra toda la información siguiente.'
    },
    {
      sesgo: 'Sesgo del Coste Hundido (Richard Thaler, 1980)',
      pregunta: 'Pagaste 80 € por una entrada de concierto. El día del evento tienes fiebre, llueve a cántaros y el artista que más te gustaba acaba de cancelar su actuación. ¿Qué haces?',
      opciones: ['Voy de todas formas — ya pagué el dinero', 'Me quedo en casa — ir así sería peor que no ir'],
      correcta: 1,
      pctWrong: 61,
      labelWrong: 'irían aunque las condiciones garanticen una mala experiencia',
      labelRight: 'racional — el dinero ya está perdido independientemente de la decisión',
      explicacion: 'Los 80 € están perdidos con o sin ir. Racionalmente, la decisión solo debería basarse en si ir esta noche —con fiebre, lluvia y sin el artista principal— produce más valor que quedarse en casa. El sesgo del coste hundido nos empuja a «recuperar» la inversión aunque hacerlo garantice una experiencia peor. Thaler demostró que este error afecta desde la gestión de proyectos empresariales hasta relaciones personales que ya no funcionan.'
    }
  ];

  let current = 0, score = 0;
  const container = document.getElementById('exp-card');
  if (!container) return;

  function render(html) { container.innerHTML = html; }

  function showStart() {
    render(`<div class="exp-start">
      <svg class="neural-brain-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Lucide Brain icon — silueta anatómica certificada, stroke puro -->
        <path class="brain-outline-path" stroke="url(#clock-grad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
        <path class="brain-outline-path" stroke="url(#clock-grad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
        <path class="brain-outline-path" stroke="url(#clock-grad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
        <path class="brain-outline-path" stroke="url(#clock-grad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
        <path class="brain-outline-path" stroke="url(#clock-grad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
        <path class="brain-outline-path" stroke="url(#clock-grad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
        <path class="brain-outline-path" stroke="url(#clock-grad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          d="M19.938 10.5a4 4 0 0 1 .585.396"/>
        <path class="brain-outline-path" stroke="url(#clock-grad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          d="M6 18a4 4 0 0 1-1.967-.516"/>
        <path class="brain-outline-path" stroke="url(#clock-grad)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          d="M19.967 17.484A4 4 0 0 1 18 18"/>
      </svg>
      <h3>8 preguntas. ¿Cuántas acierta tu cerebro?</h3>
      <p>Dilemas clásicos de psicología cognitiva basados en experimentos reales. Responde lo primero que te venga a la mente.</p>
      <button class="exp-btn-primary" id="exp-start-btn">Comenzar</button>
    </div>`);
    document.getElementById('exp-start-btn').addEventListener('click', () => { current = 0; score = 0; showQuestion(); });
  }

  function showQuestion() {
    const q = QUESTIONS[current];
    const opts = q.opciones.map((o, i) => `<button class="exp-option" data-i="${i}">${o}</button>`).join('');
    render(`<div class="exp-q-wrapper">
      <div class="exp-progress-row">
        <span class="exp-sesgo-tag">${q.sesgo}</span>
        <span class="exp-counter">${current + 1} / ${QUESTIONS.length}</span>
      </div>
      <div class="exp-progress-track"><div class="exp-progress-fill" style="width:${(current / QUESTIONS.length) * 100}%"></div></div>
      <p class="exp-q-text">${q.pregunta}</p>
      <div class="exp-options">${opts}</div>
    </div>`);
    container.querySelectorAll('.exp-option').forEach(btn =>
      btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.i)))
    );
  }

  function handleAnswer(idx) {
    const q = QUESTIONS[current];
    const correct = q.correcta !== null && idx === q.correcta;
    if (correct) score++;
    if (window._LI_incrementPrueba) window._LI_incrementPrueba();

    let barsHTML = '';
    if (q.pctWrong !== undefined) {
      const r = 100 - q.pctWrong;
      barsHTML = `
        <div class="exp-bar-row"><span class="exp-bar-label">${q.pctWrong}% ${q.labelWrong}</span>
          <div class="exp-bar-track"><div class="exp-bar-fill exp-bar-wrong" data-pct="${q.pctWrong}" style="width:0"></div></div></div>
        <div class="exp-bar-row"><span class="exp-bar-label">${r}% ${q.labelRight}</span>
          <div class="exp-bar-track"><div class="exp-bar-fill exp-bar-right" data-pct="${r}" style="width:0"></div></div></div>`;
    } else {
      barsHTML = `
        <div class="exp-bar-row"><span class="exp-bar-label">${q.pctA}% ${q.labelA}</span>
          <div class="exp-bar-track"><div class="exp-bar-fill exp-bar-wrong" data-pct="${q.pctA}" style="width:0"></div></div></div>
        <div class="exp-bar-row"><span class="exp-bar-label">${q.pctB}% ${q.labelB}</span>
          <div class="exp-bar-track"><div class="exp-bar-fill exp-bar-right" data-pct="${q.pctB}" style="width:0"></div></div></div>`;
    }

    const isLast = current === QUESTIONS.length - 1;
    render(`<div class="exp-result">
      <div class="exp-result-badge ${correct ? 'exp-correct' : 'exp-incorrect'}">${correct ? '✓ Correcto' : q.correcta === null ? '✓ Registrado' : '✗ Incorrecto'}</div>
      <p class="exp-explain">${q.explicacion}</p>
      <div class="exp-bars">${barsHTML}</div>
      <button class="exp-btn-primary" id="exp-next">${isLast ? 'Ver resultado final →' : 'Siguiente pregunta →'}</button>
    </div>`);

    setTimeout(() => {
      container.querySelectorAll('.exp-bar-fill').forEach(el => { el.style.width = el.dataset.pct + '%'; });
    }, 80);

    document.getElementById('exp-next').addEventListener('click', () => {
      if (isLast) showFinal(); else { current++; showQuestion(); }
    });
  }

  function getPerfilFinal(s, total) {
    const pct = s / total;
    if (pct === 1)    return { titulo: 'Resistencia cognitiva excepcional',   msg: 'Perfecto. O ya conocías estos experimentos, o tu pensamiento deliberado es inusualmente activo. Recuerda: saber los sesgos no te hace inmune — pero sí más consciente que casi nadie.' };
    if (pct >= 0.75)  return { titulo: 'Alta resistencia a los atajos',        msg: 'Tu Sistema 2 intervino en los momentos más importantes. Estás en el 12% superior de quienes realizan esta prueba. La vigilancia cognitiva sostenida es el único antídoto real.' };
    if (pct >= 0.5)   return { titulo: 'Por encima de la media',               msg: 'Acertaste en más de la mitad. Tu cerebro usó atajos donde la pregunta lo facilitaba, pero los resististe en otros. Reconocer el patrón es exactamente de lo que trata la psicología cognitiva.' };
    if (pct >= 0.25)  return { titulo: 'El Sistema 1 ganó en la mayoría',      msg: 'Tu cerebro eligió el camino rápido en la mayor parte de las preguntas. Eso te hace humano: estos sesgos son independientes de la inteligencia. La práctica de la duda activa marca la diferencia.' };
    return               { titulo: 'El Sistema 1 venció en casi todas',        msg: 'Los atajos cognitivos dominaron tus respuestas. No hay ningún problema: estos patrones son universales. Lo importante es que ahora sabes que existen, y eso ya cambia algo.' };
  }

  function showFinal() {
    const perfil = getPerfilFinal(score, QUESTIONS.length);
    render(`<div class="exp-final">
      <div class="exp-score-display">${score}<span>/ ${QUESTIONS.length}</span></div>
      <p class="exp-final-titulo">${perfil.titulo}</p>
      <p class="exp-final-msg">${perfil.msg}</p>
      <button class="exp-btn-secondary" id="exp-retry">Repetir el test</button>
    </div>`);
    document.getElementById('exp-retry').addEventListener('click', () => { current = 0; score = 0; showQuestion(); });
  }

  showStart();
}());


/* ── RADAR DE MITOS (T/F interactivo) ──────────────────────── */
(function () {
  document.querySelectorAll('.mito-tf-card').forEach(card => {
    const correct = card.dataset.answer;
    const reveal  = card.querySelector('.mito-reveal');
    const badge   = card.querySelector('.mito-reveal-badge');
    const btns    = card.querySelectorAll('.tf-btn');

    btns.forEach(btn => {
      btn.addEventListener('click', function () {
        if (card.classList.contains('answered')) return;
        card.classList.add('answered');

        const chosen    = this.dataset.val;
        const isCorrect = chosen === correct;

        btns.forEach(b => {
          b.disabled = true;
          if (b.dataset.val === correct) {
            b.classList.add('tf-show-correct');
          } else if (b === this && !isCorrect) {
            b.classList.add('tf-chosen-wrong');
          }
        });

        badge.textContent = isCorrect
          ? '✓ Correcto'
          : '✗ Incorrecto — es ' + correct.charAt(0).toUpperCase() + correct.slice(1);
        badge.className = 'mito-reveal-badge ' + (isCorrect ? 'badge-correct' : 'badge-incorrect');

        reveal.classList.add('open');
        reveal.style.maxHeight = '0';
        reveal.style.overflow  = 'hidden';
        reveal.style.transition = 'max-height 0.4s ease';
        setTimeout(() => { reveal.style.maxHeight = '250px'; }, 15);
      });
    });
  });

  /* Botón ver más mitos */
  const verMasBtn = document.getElementById('mitos-ver-mas-btn');
  const extra     = document.getElementById('mitos-extra');
  if (verMasBtn && extra) {
    verMasBtn.addEventListener('click', () => {
      const expanded = verMasBtn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        extra.setAttribute('hidden', '');
        verMasBtn.setAttribute('aria-expanded', 'false');
        verMasBtn.innerHTML = 'Ver los 15 mitos restantes <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
      } else {
        extra.removeAttribute('hidden');
        verMasBtn.setAttribute('aria-expanded', 'true');
        verMasBtn.innerHTML = 'Ocultar mitos <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
      }
    });
  }
}());


/* ── MITOS — MODAL DETALLE ──────────────────────────────────── */
(function () {
  const MITOS_DATA = {
    'mito-01': {
      answer: 'falso',
      statement: '«Solo usamos el 10% de nuestro cerebro»',
      porque: 'El origen es confuso: versiones populares lo atribuyeron erróneamente a Einstein o a estudios de principios del siglo XX. También se malinterpretaron hallazgos sobre la glía —el 90% de las células cerebrales no son neuronas— y la idea de que "en cada momento solo se activa una pequeña parte" del cerebro.',
      realidad: 'Las técnicas de neuroimagen (fMRI, PET) muestran actividad en prácticamente todas las regiones cerebrales durante cualquier tarea cognitiva compleja. En reposo, el cerebro sigue consumiendo el 20% de la energía corporal pese a representar solo el 2% del peso. Si el 90% estuviera inactivo, esa zona sufriría atrofia por desuso, lo que no se observa en ningún cerebro sano. Las lesiones cerebrales en cualquier área producen déficits observables, lo que refuta la idea de zonas "prescindibles".',
      ciencia: 'Los estudios de neuroimagen funcional son concluyentes: no existe ninguna región cerebral que permanezca consistentemente inactiva en personas sanas. Draganski et al. (2004) en Nature mostraron cambios estructurales rápidos ante cualquier tipo de aprendizaje. La Sociedad de Neurociencia (SfN) ha catalogado explícitamente este mito como uno de los neuromitos más extendidos.',
      ref: 'Draganski et al. (2004) — Nature · Pasquinelli (2012) — Nature Reviews Neuroscience'
    },
    'mito-02': {
      answer: 'verdadero',
      statement: '«Perder 100 € nos duele más de lo que nos alegra ganarlos»',
      porque: 'Intuitivamente parece que ganar y perder deberían compensarse. La economía clásica asumía que las personas son agentes racionales que evalúan las ganancias y pérdidas simétricamente. Esta idea dominó la teoría económica hasta los años 70.',
      realidad: 'Kahneman y Tversky demostraron que el impacto emocional de perder dinero es entre 1,5 y 2,5 veces mayor que el de ganarlo en la misma cantidad. Esta asimetría no es irracionalidad: tiene base neurobiológica. La amígdala se activa más intensamente ante la posibilidad de pérdida. En entornos de escasez evolutiva, perder recursos podía ser fatal; una ganancia equivalente, solo cómoda.',
      ciencia: 'Kahneman y Tversky desarrollaron la Teoría Prospectiva y construyeron la función de valor en forma de S, con pendiente más pronunciada en pérdidas. Este hallazgo es uno de los más replicados de la psicología conductual y llevó a Kahneman al Premio Nobel de Economía en 2002. El "disposition effect" (vender ganancias demasiado pronto y aguantar pérdidas demasiado tiempo) es su manifestación más documentada en mercados financieros.',
      ref: 'Kahneman & Tversky (1979) — Econometrica · Shefrin & Statman (1985) — Journal of Finance'
    },
    'mito-03': {
      answer: 'falso',
      statement: '«Los estilos de aprendizaje visual, auditivo y kinestésico tienen respaldo científico»',
      porque: 'La teoría VAK se popularizó en los años 80 con el modelo de Neil Fleming. Su atractivo era obvio: personalizaba la educación, daba a alumnos y docentes un "perfil" claro, y resonaba con la experiencia subjetiva de que aprendemos de formas distintas. Millones de educadores fueron formados bajo este modelo.',
      realidad: 'La hipótesis de meshing —que rendir mejor cuando el formato de enseñanza coincide con tu "estilo" preferido— no tiene respaldo empírico. Las personas tienen preferencias, sí, pero esas preferencias no predicen qué formato produce mejor aprendizaje. Casi todas las materias se aprenden mejor con técnicas multimodales independientemente del perfil del alumno.',
      ciencia: 'Pashler et al. (2008) en Psychological Science in the Public Interest publicaron una revisión sistemática y encontraron que no existe evidencia sólida de que adaptar la instrucción al estilo preferido mejore el rendimiento. Rogowsky et al. (2020) y múltiples metaanálisis posteriores confirman el mismo resultado. La Asociación Psicológica Americana clasifica la teoría VAK como neuromito.',
      ref: 'Pashler et al. (2008) — Psychological Science in the Public Interest · Rogowsky et al. (2020) — Journal of Educational Psychology'
    },
    'mito-04': {
      answer: 'verdadero',
      statement: '«Dormir menos de 7 horas deteriora el rendimiento cognitivo de forma objetivamente medible»',
      porque: 'Culturalmente, dormir poco se ha asociado a productividad y ambición. La creencia de que "ya dormiré cuando me muera" o que los líderes de éxito duermen poco está muy extendida. Y subjetivamente, quienes duermen poco se adaptan y dejan de notar el déficit.',
      realidad: 'La adaptación subjetiva es real pero engañosa: el cuerpo percibe que está bien mientras las pruebas objetivas de atención, memoria de trabajo y toma de decisiones muestran deterioro progresivo. Walker (2017) documentó que después de 17 horas sin dormir, el rendimiento cognitivo equivale al de una tasa de alcoholemia de 0,05%.',
      ciencia: 'Walker (2017) en "Why We Sleep" recopiló décadas de investigación: privación crónica de sueño aumenta el riesgo de Alzheimer, cáncer, enfermedades cardiovasculares y obesidad. La Fundación Nacional del Sueño y la OMS recomiendan 7-9 horas en adultos. Estudios con fMRI muestran reducción de la actividad del córtex prefrontal (toma de decisiones) y aumento de la reactividad de la amígdala (reacción emocional) con solo dos noches de sueño reducido.',
      ref: 'Walker (2017) — Why We Sleep · Killgore (2010) — Progress in Brain Research'
    },
    'mito-05': {
      answer: 'falso',
      statement: '«Escuchar música de Mozart aumenta la inteligencia»',
      porque: 'El estudio original de Rauscher, Shaw & Ky (1993) fue genuino pero modesto: un aumento de 15 minutos en tareas espaciales en adultos universitarios. Los medios de comunicación lo transformaron en "Mozart hace a los bebés más inteligentes" y se construyó toda una industria de productos "Baby Einstein" y "Baby Mozart".',
      realidad: 'El efecto original —temporal, en adultos, solo para tareas espaciales— fue difícil de replicar. Nunca se demostró en bebés. El metaanálisis de Chabris (1999) analizó 16 estudios y encontró que el efecto era tan pequeño que no tenía significado práctico, y que probablemente se debía a la activación emocional general, no a algo específico de Mozart.',
      ciencia: 'Chabris (1999) en Psychological Bulletin concluye que el efecto generalizado no existe. Hetland (2000) revisó 36 estudios y encontró efectos cercanos a cero. El estado de Georgia (EE.UU.) llegó a aprobar un presupuesto para enviar CDs de Mozart a todos los recién nacidos; fue derogado al conocerse la evidencia. La American Psychological Association lo considera un ejemplo de distorsión mediática de la ciencia.',
      ref: 'Chabris (1999) — Psychological Bulletin · Hetland (2000) — Journal of Aesthetic Education'
    },
    'mito-06': {
      answer: 'falso',
      statement: '«"Soltar vapor" —gritar o golpear un cojín— reduce la agresividad»',
      porque: 'La hipótesis catártica de Lorenz y la tradición psicoanalítica popularizaron la idea de que la agresividad es como una presión que necesita salida. Si no la expresas, se acumula y explota. Esta narrativa se convirtió en sentido común terapéutico y los medios la reforzaron durante décadas.',
      realidad: 'Practicar conductas agresivas activa los mismos circuitos neuronales que producen la agresividad, y los refuerza. En lugar de aliviar el enfado, la descarga lo amplifica. El cerebro aprende que la conducta agresiva es la respuesta adecuada a la frustración, exactamente lo contrario del objetivo terapéutico.',
      ciencia: 'Bushman (2002) en Journal of Personality and Social Psychology dividió a participantes frustrados en tres grupos: golpear un saco de boxeo, sentarse tranquilos o no hacer nada. El grupo del saco mostró la mayor agresividad posterior. Bushman & Baumeister (1998) encontraron que "ventilar" el enfado con un insulto aumentaba la probabilidad de agresión posterior. La investigación sugiere que la regulación emocional (distancia cognitiva, reencuadre) es consistentemente más efectiva.',
      ref: 'Bushman (2002) — Journal of Personality and Social Psychology · Berkowitz (1999) — Current Directions in Psychological Science'
    },
    'mito-07': {
      answer: 'falso',
      statement: '«Los recuerdos son fijos: una vez formados, no cambian»',
      porque: 'La metáfora del "archivo" o la "grabación" es intuitivamente poderosa: si recuerdas algo con viveza y detalle, parece que debe ser exacto. La experiencia subjetiva del recuerdo se siente completamente auténtica. No percibimos que estamos reconstruyendo activamente.',
      realidad: 'Cada vez que recordamos algo lo reconstruimos activamente a partir de fragmentos, expectativas y contexto presentes. El recuerdo puede alterarse por información post-evento, sugestión, emociones del momento e incluso el modo en que se formula una pregunta. Los falsos recuerdos son tan vívidos y convincentes como los reales, incluso para quien los tiene.',
      ciencia: 'Loftus & Palmer (1974) mostraron que cambiar una sola palabra ("¿a qué velocidad se empotraron?" vs "¿a qué velocidad chocaron?") alteraba tanto el estimado de velocidad como la probabilidad de "recordar" vidrios rotos que no existían. Loftus plantó recuerdos completamente falsos de haberse perdido de niño en adultos sanos con una tasa de éxito del 25%. Schacter (2001) identificó los "siete pecados de la memoria" que documentan esta maleabilidad sistemática.',
      ref: 'Loftus & Palmer (1974) — Journal of Verbal Learning · Schacter (2001) — The Seven Sins of Memory'
    },
    'mito-08': {
      answer: 'falso',
      statement: '«Las personas más inteligentes son menos susceptibles a los sesgos cognitivos»',
      porque: 'Parece lógico: mayor capacidad de razonamiento debería implicar mayor capacidad de detectar errores en el propio pensamiento. Si puedes resolver problemas complejos, deberías identificar mejor cuándo estás razonando mal.',
      realidad: 'La alta capacidad cognitiva no protege de los sesgos; en algunos casos los amplifica. Las personas con mayor CI son más hábiles en construir justificaciones convincentes para las conclusiones a las que ya querían llegar —lo que se llama "myside bias" o razonamiento motivado. El problema es que la inteligencia predice la calidad del razonamiento analítico, pero no la disposición a aplicarlo cuando el resultado amenaza las creencias previas.',
      ciencia: 'West, Meserve & Stanovich (2012) encontraron que mayor CI no reducía los sesgos estándar y, significativamente, aumentaba el sesgo de punto ciego: creer que uno mismo tiene menos sesgos que los demás. Stanovich (2009) distingue entre "inteligencia" (capacidad algorítmica) y "racionalidad" (disposición a usarla correctamente): ambas son independientes. Shermer (2011) acuñó "smart people believe weird things" para describir este patrón.',
      ref: 'West, Meserve & Stanovich (2012) — Journal of Personality and Social Psychology · Stanovich (2009) — What Intelligence Tests Miss'
    },
    'mito-09': {
      answer: 'falso',
      statement: '«El estrés siempre es perjudicial para la salud»',
      porque: 'Décadas de mensajes de salud pública se han centrado en reducir el estrés. El estrés crónico es genuinamente dañino —aumenta el cortisol, suprime el sistema inmune, daña el hipocampo— y esa verdad real se overgeneralizó a todo estrés, incluyendo el agudo y moderado.',
      realidad: 'El estrés moderado y de duración limitada —eustrés— mejora el rendimiento cognitivo, aumenta la motivación, refuerza la memoria y prepara el cuerpo para la acción. La curva de Yerkes-Dodson documenta que el rendimiento alcanza su pico con activación moderada, no en ausencia de ella. Lo que daña es el estrés crónico e incontrolable, no el estrés per se.',
      ciencia: 'Yerkes & Dodson (1908) establecieron la curva que lleva su nombre. McGonigal (2013) analizó los datos de un estudio con 30.000 adultos durante 8 años: el alto estrés solo aumentaba la mortalidad en quienes creían que el estrés era perjudicial. Quienes lo percibían como energizante tenían el riesgo de mortalidad más bajo de toda la muestra, incluso inferior al grupo de bajo estrés. La percepción del estrés modula sus efectos biológicos.',
      ref: 'Yerkes & Dodson (1908) — Journal of Comparative Neurology · Keller et al. (2012) — Health Psychology'
    },
    'mito-10': {
      answer: 'falso',
      statement: '«Los hombres y las mujeres tienen cerebros radicalmente diferentes»',
      porque: 'Las diferencias de comportamiento entre sexos son reales y observables en algunos dominios. La explicación biológica directa —cerebros distintos— parecía la más parsimoniosa. Libros como "Los hombres son de Marte, las mujeres de Venus" (Gray, 1992) y estudios sobre lateralización reforzaron una narrativa de dos tipos cerebrales claramente distintos.',
      realidad: 'Los cerebros masculinos y femeninos se solapan enormemente en casi todas las medidas estructurales y funcionales. Las diferencias medias entre grupos son pequeñas y están eclipsadas por la variabilidad dentro de cada grupo. La mayoría de personas tiene un "mosaico" de características que mezclan rasgos estadísticamente típicos de hombres y mujeres.',
      ciencia: 'Joel et al. (2015) en PNAS analizaron 1.400 cerebros con resonancia magnética: solo entre el 0% y el 8% mostraba el patrón consistentemente "masculino" o "femenino" en todas las medidas. Nielsen et al. (2013) encontraron resultados similares. Fine (2010) en "Delusions of Gender" revisó sistemáticamente la literatura y documentó errores metodológicos en muchos estudios que afirmaban diferencias radicales.',
      ref: 'Joel et al. (2015) — PNAS · Fine (2010) — Delusions of Gender'
    },
    'mito-11': {
      answer: 'falso',
      statement: '«La multitarea es una habilidad que algunos dominan bien»',
      porque: 'Las personas experimentan subjetivamente hacer varias cosas "a la vez" y no notan el coste. El cambio rápido entre tareas se siente como simultaneidad. Además, algunas combinaciones (caminar y hablar) funcionan porque una de ellas está automatizada y no requiere recursos atencionales.',
      realidad: 'Para tareas cognitivas demandantes, el cerebro no puede procesarlas simultáneamente: alterna rápidamente entre ellas (task-switching), y cada alternancia tiene un coste real en tiempo, precisión y carga cognitiva. El hallazgo más contraintuitivo: quienes se consideran buenos en multitarea son sistemáticamente los peores en pruebas objetivas.',
      ciencia: 'Strayer & Watson (2012) encontraron que solo el 2,5% de la población son verdaderos "supertaskers" sin coste medible en doble tarea. Ophir, Nass & Wagner (2009) en PNAS compararon "heavy multitaskers" con personas que raramente hacen multitarea: los primeros rendían peor en todas las tareas cognitivas, incluyendo la propia multitarea en laboratorio. Meyer & Kieras (1997) calcularon que el coste del task-switching puede representar hasta el 40% del tiempo productivo.',
      ref: 'Strayer & Watson (2012) — Psychological Science · Ophir, Nass & Wagner (2009) — PNAS'
    },
    'mito-12': {
      answer: 'falso',
      statement: '«Las personas que mienten evitan el contacto visual»',
      porque: 'La creencia está tan arraigada que la policía, los jueces y los jurados la usan activamente en sus evaluaciones. Tiene lógica aparente: si tienes algo que ocultar, evitas la mirada. Se refuerza constantemente en la ficción, los medios y la formación en "lenguaje corporal".',
      realidad: 'No existe una señal corporal única y fiable del engaño. Los mentirosos saben que se espera que eviten la mirada y muchos la mantienen deliberadamente para parecer creíbles. Incluso cuando hay señales reales, su variabilidad entre individuos y culturas las hace prácticamente inútiles para el diagnóstico individual.',
      ciencia: 'DePaulo et al. (2003) en Psychological Bulletin realizaron un meta-análisis de 116 estudios: el contacto visual no predice el engaño de forma fiable. Bond & DePaulo (2006) calcularon la tasa de detección de mentiras en 206 estudios con 24.000 participantes: un 54% de media, apenas por encima del azar del 50%. Vrig (2008) demostró que el entrenamiento en "detección de señales" no mejora el rendimiento y en algunos casos lo empeora al reforzar creencias erróneas.',
      ref: 'DePaulo et al. (2003) — Psychological Bulletin · Bond & DePaulo (2006) — Psychological Bulletin'
    },
    'mito-13': {
      answer: 'falso',
      statement: '«Los test MBTI (Myers-Briggs) predicen con fiabilidad el éxito profesional»',
      porque: 'El MBTI es fácil de administrar, produce resultados que parecen reveladores y las categorías tienen validez aparente —todos nos reconocemos un poco en la descripción. Las empresas lo adoptaron masivamente: se estima que más del 80% de las empresas Fortune 500 lo han utilizado.',
      realidad: 'La fiabilidad test-retest es débil: el 50% de las personas obtiene un tipo diferente si repite el test 5 semanas después. Las categorías son dicotómicas (introvertido/extrovertido) cuando las dimensiones son continuas en la realidad. Y su validez predictiva del rendimiento laboral es prácticamente nula según revisiones sistemáticas.',
      ciencia: 'Pittenger (1993) en Journal of Career Planning and Employment revisó sistemáticamente la evidencia y concluyó que el MBTI no predice el rendimiento laboral. Kahneman (2011) lo cita como ejemplo de "ilusión de validez". En contraste, el modelo Big Five sí muestra validez predictiva incremental demostrada: especialmente Responsabilidad y Estabilidad Emocional predicen el rendimiento en casi todos los roles.',
      ref: 'Pittenger (1993) — Journal of Career Planning · Tett, Jackson & Rothstein (1991) — Personnel Psychology'
    },
    'mito-14': {
      answer: 'falso',
      statement: '«El azúcar causa hiperactividad en los niños»',
      porque: 'La correlación temporal es muy convincente: los niños parecen hiperactivos en cumpleaños y fiestas navideñas donde hay mucho azúcar. Los padres observan el patrón repetidamente y sacan la conclusión obvia. El mito está tan extendido que muchos pediatras lo refuerzan implícitamente.',
      realidad: 'La hiperactividad en esas situaciones se debe al contexto: un entorno excitante, con muchos estímulos, poca rutina y permisividad especial. El azúcar no tiene ningún efecto demostrado sobre el comportamiento infantil bajo condiciones controladas. El efecto real es el de las expectativas de los padres.',
      ciencia: 'Wolraich et al. (1995) en JAMA publicaron el meta-análisis definitivo de 23 ensayos controlados y aleatorizados: el azúcar no afecta el comportamiento ni la cognición en niños, incluyendo aquellos con TDAH. Hoover & Milich (1994) demostraron que padres que creían que su hijo había tomado azúcar (cuando había tomado placebo) calificaban su comportamiento como significativamente más hiperactivo. El efecto era completamente mediado por las expectativas parentales.',
      ref: 'Wolraich et al. (1995) — JAMA · Hoover & Milich (1994) — Journal of Abnormal Child Psychology'
    },
    'mito-15': {
      answer: 'falso',
      statement: '«Los sueños revelan deseos inconscientes ocultos»',
      porque: 'Freud propuso en "La interpretación de los sueños" (1900) que los sueños son la "vía regia" al inconsciente, con contenido manifiesto (lo que recuerdas) que oculta un contenido latente (el deseo verdadero). Durante décadas fue el marco dominante, impregnó la cultura popular y todavía resuena con fuerza.',
      realidad: 'Las teorías actuales con mayor respaldo empírico apuntan a que los sueños sirven para consolidar memorias, procesar emociones y simular escenarios de amenaza. No hay evidencia de que sean mensajes simbólicos interpretables según un código universal. El contenido de los sueños varía entre culturas, lo que contradice la idea de símbolos universales del inconsciente.',
      ciencia: 'Hobson & McCarley (1977) propusieron la hipótesis de activación-síntesis: los sueños son el resultado de la activación aleatoria del tronco encefálico durante el sueño REM y la interpretación narrativa que el córtex hace de esas señales. Walker et al. (2002) demostraron que el sueño REM procesa memorias emocionales reduciendo la carga afectiva. Revonsuo (2000) propuso la "teoría de simulación de amenazas" con mayor apoyo empírico que la interpretación freudiana.',
      ref: 'Hobson & McCarley (1977) — American Journal of Psychiatry · Walker et al. (2002) — Neuron'
    },
    'mito-16': {
      answer: 'falso',
      statement: '«La regla de las 10.000 horas garantiza la maestría en cualquier disciplina»',
      porque: 'Malcolm Gladwell popularizó el número en "Outliers" (2008) a partir de la investigación de Ericsson sobre músicos. La narrativa fue irresistible: cualquiera puede llegar a ser experto con suficiente esfuerzo. Democratizaba el talento y ofrecía una receta clara.',
      realidad: 'Ericsson criticó explícitamente la interpretación de Gladwell: su investigación era sobre práctica deliberada —diseñada específicamente para corregir debilidades, con feedback inmediato y supervisión experta— no sobre cualquier tipo de práctica. Las 10.000 horas son un promedio con enorme varianza. Y la práctica solo explica una parte de la maestría.',
      ciencia: 'Ericsson, Krampe & Tesch-Römer (1993) en Psychological Review describieron la práctica deliberada como el factor central, pero no único. Macnamara et al. (2014) realizaron un meta-análisis de 88 estudios: la práctica deliberada explica el 18-26% de la varianza en deporte y música. Los factores genéticos, la edad de inicio y la calidad del entrenamiento explican el resto. Hambrick et al. (2014) encontraron que en ajedrez, la práctica explica menos del 30% de las diferencias entre expertos.',
      ref: 'Ericsson et al. (1993) — Psychological Review · Macnamara et al. (2014) — Psychological Science'
    },
    'mito-17': {
      answer: 'falso',
      statement: '«Los introvertidos son simplemente tímidos»',
      porque: 'La introversión y la timidez coexisten con frecuencia y comparten algunas consecuencias conductuales observables: ambas llevan a retirada de situaciones sociales. La confusión se refuerza porque la cultura occidental valora la extroversión y trata la introversión como un problema que necesita corrección.',
      realidad: 'Introversión y timidez son constructos psicológicamente distintos. La introversión es una preferencia por la baja estimulación social y la necesidad de tiempo a solas para recargar energía. La timidez es miedo o ansiedad ante la evaluación social negativa. Un introvertido puede hablar cómodamente ante miles de personas; un extrovertido puede ser profundamente tímido.',
      ciencia: 'Cheek & Buss (1981) establecieron empíricamente que introversión y timidez son constructos distintos con correlaciones solo moderadas. Eysenck (1967) propuso que la introversión se debe a mayor arousal cortical basal, no a ansiedad social. Cain (2012) en "Quiet" documentó cómo muchos líderes, artistas y científicos con gran impacto público son introvertidos sin timidez.',
      ref: 'Cheek & Buss (1981) — Journal of Personality and Social Psychology · Eysenck (1967) — The Biological Basis of Personality'
    },
    'mito-18': {
      answer: 'falso',
      statement: '«Las personas funcionan principalmente con el hemisferio izquierdo o el derecho»',
      porque: 'Hay hallazgos reales sobre lateralización: el lenguaje se procesa predominantemente en el hemisferio izquierdo en la mayoría de diestros; el procesamiento espacial tiene cierta lateralización derecha. Estos hallazgos reales se sobreextendieron a un modelo de personalidad: "personas del hemisferio izquierdo" (lógicas) vs "del hemisferio derecho" (creativas).',
      realidad: 'La neuroimagen muestra que prácticamente todas las funciones cognitivas complejas requieren ambos hemisferios trabajando en red. La lateralización existe a nivel de proceso específico y microestructural, no a nivel de rasgos de personalidad. No hay ningún individuo cuyo cerebro "domine" sistemáticamente un hemisferio en todas las funciones.',
      ciencia: 'Nielsen et al. (2013) en PLOS One analizaron la conectividad funcional de 1.000 cerebros mediante fMRI en reposo: no encontraron evidencia de dominancia hemisférica como rasgo individual en ningún sujeto. El estudio fue diseñado explícitamente para probar el mito y lo refutó con claridad. Corballis (2012) revisó la literatura de lateralización y concluyó que el mito del "hemisferio dominante" como tipo de personalidad carece de base.',
      ref: 'Nielsen et al. (2013) — PLOS One · Corballis (2012) — WIREs Cognitive Science'
    },
    'mito-19': {
      answer: 'falso',
      statement: '«Los humanos detectamos las mentiras mejor que el azar»',
      porque: 'La creencia de que "se nota" cuando alguien miente es casi universal y muy resistente a la evidencia. Policías, jueces, jurados y profesionales de inteligencia confían activamente en su capacidad de detectar el engaño, lo que ha contribuido a condenas erróneas documentadas.',
      realidad: 'La tasa media de detección de mentiras en humanos es del 54%, apenas 4 puntos por encima del azar. Los profesionales entrenados —policías, agentes del FBI, psiquiatras— no mejoran significativamente ese porcentaje. La confianza en la propia capacidad no correlaciona en absoluto con la precisión real.',
      ciencia: 'Bond & DePaulo (2006) realizaron el mayor meta-análisis sobre detección de engaño: 206 estudios, 24.000 participantes, tasa media del 54%. Ekman et al. (1999) identificaron un grupo muy reducido de "wizards" capaces de superar el azar, pero representaban menos del 1% de cualquier muestra. Vrig (2008) documentó que el entrenamiento estándar en "detección de mentiras" no mejora el rendimiento y puede empeorarlo al reforzar señales irrelevantes como el contacto visual.',
      ref: 'Bond & DePaulo (2006) — Psychological Bulletin · Ekman et al. (1999) — Psychological Science'
    },
    'mito-20': {
      answer: 'falso',
      statement: '«Releer y subrayar son técnicas de estudio tan efectivas como el repaso activo»',
      porque: 'Releer y subrayar producen una sensación de familiaridad con el material —lo reconoces, lo entiendes, te sientes cómodo— que confundimos con aprendizaje real. Esta "ilusión de fluidez" es metacognitivamente convincente: parece que lo sabes porque te resulta fácil de leer, cuando en realidad solo lo reconoces.',
      realidad: 'El acto de intentar recordar algo sin mirar el material —aunque sea con dificultad o errores— es entre 1,5 y 3 veces más efectivo para la retención a largo plazo que la relectura. El testing no es solo evaluación: es el mejor método de estudio conocido. La dificultad durante el aprendizaje (desirable difficulty) indica que el cerebro está construyendo la memoria, no que el método no funciona.',
      ciencia: 'Roediger & Karpicke (2006) en Psychological Science mostraron que estudiantes que se autoevaluaban recordaban el 61% del material una semana después; los que releyeron, el 40%. Dunlosky et al. (2013) en Psychological Science in the Public Interest revisaron 10 técnicas de estudio: solo "práctica de recuperación" y "práctica espaciada" obtuvieron el rating de alta utilidad. El subrayado obtuvo utilidad baja.',
      ref: 'Roediger & Karpicke (2006) — Psychological Science · Dunlosky et al. (2013) — Psychological Science in the Public Interest'
    }
  };

  const overlay  = document.getElementById('mito-info-modal');
  const closeBtn = document.getElementById('mito-info-close');
  if (!overlay) return;

  let trapHandler = null, triggerEl = null;

  function openMito(id) {
    const d = MITOS_DATA[id];
    if (!d) return;
    triggerEl = document.activeElement;

    document.getElementById('mi-eyebrow').textContent   = 'Radar de Mitos · Análisis completo';
    document.getElementById('mi-statement').textContent = d.statement;
    document.getElementById('mi-porque').textContent    = d.porque;
    document.getElementById('mi-realidad').textContent  = d.realidad;
    document.getElementById('mi-ciencia').textContent   = d.ciencia;
    document.getElementById('mi-ref').textContent       = d.ref;

    const v = document.getElementById('mi-veredicto');
    if (d.answer === 'verdadero') {
      v.textContent  = '✓ Verdadero';
      v.className    = 'mito-info-veredicto veredicto-verdadero';
    } else {
      v.textContent  = '✗ Falso';
      v.className    = 'mito-info-veredicto veredicto-falso';
    }

    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    trapHandler = trapFocus(overlay);
    requestAnimationFrame(() => closeBtn && closeBtn.focus());
  }

  function closeMito() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (trapHandler) { releaseFocus(overlay, trapHandler, triggerEl); trapHandler = null; }
  }

  document.querySelectorAll('.mito-detalle-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openMito(btn.dataset.mito);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMito);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeMito(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeMito();
  });
}());


/* ── MODAL AUTOR ─────────────────────────────────────────────── */
(function () {
  const modal    = document.getElementById('author-modal');
  const closeBtn = document.getElementById('author-modal-close');
  if (!modal) return;

  let trapHandler = null, triggerEl = null;

  function openModal() {
    triggerEl = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    trapHandler = trapFocus(modal);
    requestAnimationFrame(() => closeBtn && closeBtn.focus());
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (trapHandler) { releaseFocus(modal, trapHandler, triggerEl); trapHandler = null; }
  }

  document.querySelectorAll('.author-trigger').forEach(btn =>
    btn.addEventListener('click', openModal)
  );

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('touchstart', e => { e.preventDefault(); closeModal(); }, { passive: false });
  }
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  modal.addEventListener('touchstart', e => { if (e.target === modal) { e.preventDefault(); closeModal(); } }, { passive: false });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
}());


/* ── ACCESO RÁPIDO MÓVIL ─────────────────────────────────────── */
(function () {
  const expBtn    = document.getElementById('hqa-exp-btn');
  const mitosBtn  = document.getElementById('hqa-mitos-btn');
  const sideLeft  = document.querySelector('.sidebar-left');
  const sideRight = document.querySelector('.sidebar-right');

  function openPanel(panel) {
    if (!panel) return;
    panel.classList.add('mobile-open');
    document.body.style.overflow = 'hidden';
    panel.scrollTop = 0;
  }

  function closeAll() {
    [sideLeft, sideRight].forEach(s => s && s.classList.remove('mobile-open'));
    document.body.style.overflow = '';
  }

  if (expBtn) expBtn.addEventListener('click', () => {
    /* En móvil abre el sidebar izquierdo; en desktop abre el acordeón */
    if (window.innerWidth <= 768) {
      openPanel(sideLeft);
    }
    const expSection = document.getElementById('exp-section');
    const expToggle  = document.getElementById('exp-toggle-btn');
    if (expSection && !expSection.classList.contains('is-open')) {
      expSection.classList.add('is-open');
      expToggle?.setAttribute('aria-expanded', 'true');
    }
  });
  if (mitosBtn) mitosBtn.addEventListener('click', () => openPanel(sideRight));

  document.querySelectorAll('.sidebar-close-btn').forEach(btn =>
    btn.addEventListener('click', closeAll)
  );

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAll();
  });
}());


/* ── LISTA DE EFECTOS ────────────────────────────────────────── */
(function () {
  const EFECTOS_DATA = {
    'dunning-kruger': {
      nombre: 'Efecto Dunning-Kruger',
      gancho: 'Los que menos saben creen saber más.',
      explicacion: 'En 1999, David Dunning y Justin Kruger demostraron en una serie de estudios en Cornell que las personas con menor competencia en un dominio sobreestiman sistemáticamente su rendimiento. El mecanismo es circular: las habilidades necesarias para ser competente en algo son exactamente las mismas que se necesitan para reconocer la propia incompetencia. Quien no sabe, no sabe que no sabe.',
      experimento: 'Kruger & Dunning · Cornell University · 1999',
      descExp: 'Participantes que puntuaron en el cuartil inferior de tests lógicos estimaron haber rendido mejor que el 62% de sus compañeros. La realidad: habían superado solo al 12%.',
      aplicaciones: [
        'En entrevistas de trabajo, los candidatos menos preparados suelen proyectar más confianza que los bien preparados.',
        'En debates públicos, quienes expresan más certeza sobre temas complejos suelen tener el conocimiento más superficial.',
        'En medicina, pacientes con escaso conocimiento médico rechazan con más seguridad tratamientos que no comprenden.'
      ]
    },
    'halo': {
      nombre: 'Efecto Halo',
      gancho: 'Una cualidad visible contamina tu percepción de todo lo demás.',
      explicacion: 'Descrito por Edward Thorndike en 1920, el efecto halo ocurre cuando una característica positiva o negativa de una persona influye de forma desproporcionada en la evaluación global que hacemos de ella. Si alguien es físicamente atractivo, tendemos a asumir que también es más inteligente, honesto y competente, aunque no exista ninguna correlación real entre estos atributos.',
      experimento: 'Thorndike · Columbia University · 1920',
      descExp: 'Oficiales militares evaluando a sus subordinados asignaban puntuaciones similares en rasgos tan distintos como aspecto físico, inteligencia y liderazgo, sin datos objetivos que justificaran esa correlación.',
      aplicaciones: [
        'En entrevistas de trabajo, candidatos más atractivos son percibidos como más competentes con independencia de su currículum.',
        'En juicios, acusados físicamente atractivos reciben condenas más leves por los mismos delitos.',
        'En educación, los profesores califican mejor los exámenes de alumnos de quienes tienen buenas impresiones previas.'
      ]
    },
    'confirmacion': {
      nombre: 'Sesgo de Confirmación',
      gancho: 'Tu cerebro filtra la realidad para tener siempre razón.',
      explicacion: 'Descrito sistemáticamente por Peter Wason en los años 60, el sesgo de confirmación es la tendencia a buscar, interpretar y recordar información de una manera que confirme nuestras creencias previas. Lo sorprendente no es que ocurra, sino que persiste incluso cuando somos advertidos explícitamente de él y cuando el tema no tiene carga emocional alguna. El cerebro no busca la verdad: busca la coherencia.',
      experimento: 'Wason · University College London · 1960',
      descExp: 'En el "Problema de selección de Wason", solo el 10% de los participantes elige las cartas que podrían falsificar una regla. El 90% busca únicamente confirmarla.',
      aplicaciones: [
        'Inversores que seleccionan solo noticias que validan su posición en el mercado, ignorando señales de alerta.',
        'Médicos que, tras un diagnóstico inicial, interpretan síntomas ambiguos como confirmación del mismo.',
        'Los algoritmos de redes sociales amplifican este sesgo mostrando solo el contenido que refuerza las creencias ya existentes.'
      ]
    },
    'placebo': {
      nombre: 'Efecto Placebo',
      gancho: 'Creer que funciona lo hace funcionar de verdad.',
      explicacion: 'El efecto placebo es uno de los fenómenos más documentados de la medicina: una sustancia inerte produce efectos reales y medibles simplemente porque el paciente cree que es efectiva. Lo extraordinario es que opera a nivel biológico: los placebos activan la liberación de endorfinas reales, modifican la presión sanguínea y alteran la actividad neuronal medible con escáneres.',
      experimento: 'Beecher · Harvard Medical School · 1955',
      descExp: 'Tras analizar 15 estudios controlados, Beecher encontró que el 35% de los pacientes obtenían alivio significativo de síntomas reales con placebos. Estudios de imagen posteriores confirman que la activación cerebral es biológicamente indistinguible de la producida por el fármaco real.',
      aplicaciones: [
        'En deporte, el simple hecho de creer que se ha tomado un suplemento de rendimiento mejora objetivamente los tiempos.',
        'En fisioterapia, la confianza del paciente en el terapeuta amplifica los efectos del tratamiento real.',
        'El efecto nocebo funciona en sentido inverso: creer que algo daña produce efectos adversos reales y medibles.'
      ]
    },
    'bystander': {
      nombre: 'Efecto Espectador',
      gancho: 'Cuantos más testigos, menos probabilidad de que alguien ayude.',
      explicacion: 'Formulado por Darley y Latané en 1968, el efecto espectador demuestra que la probabilidad de que alguien intervenga en una emergencia disminuye a medida que aumenta el número de testigos. El mecanismo es doble: difusión de responsabilidad (cada uno asume que otro actuará) e ignorancia pluralista (al ver que nadie reacciona, se interpreta que la situación no es grave).',
      experimento: 'Darley & Latané · Columbia University · 1968',
      descExp: 'Cuando un participante creía ser el único testigo de una convulsión epiléptica simulada, el 85% llamaba al auxiliar. Cuando creía que había 5 testigos más, solo lo hacía el 31%.',
      aplicaciones: [
        'En equipos de trabajo, una tarea asignada a todos sin responsable explícito tiene alta probabilidad de que nadie la complete.',
        'En entornos digitales, las peticiones de ayuda con muchos destinatarios reciben menos respuestas que las directas a una persona.',
        'Conocer el efecto lo contrarresta parcialmente: asignar responsabilidad explícita a alguien concreto rompe la difusión.'
      ]
    },
    'retrospectiva': {
      nombre: 'Sesgo de Retrospectiva',
      gancho: 'Tras conocer el resultado, siempre "lo sabías".',
      explicacion: 'Documentado por Baruch Fischhoff en los años 70, el sesgo de retrospectiva es la tendencia a creer, una vez conocido el resultado de un evento, que siempre supiste cuál sería ese resultado. No es una mentira consciente: el conocimiento del resultado modifica retroactivamente la memoria de lo que creíamos antes de saberlo.',
      experimento: 'Fischhoff · Hebrew University of Jerusalem · 1975',
      descExp: 'Participantes que conocían el resultado de eventos históricos estimaban haberle asignado alta probabilidad desde el principio, aunque grupos de control —sin conocer el resultado— mostraran estimaciones mucho más bajas y dispersas.',
      aplicaciones: [
        'Médicos que conocen el diagnóstico final tienden a creer que los síntomas previos eran "obvios", lo que dificulta el aprendizaje.',
        'Analistas financieros que conocen una caída bursátil afirman haberla "visto venir", distorsionando la evaluación de sus modelos.',
        'Votantes que juzgan decisiones pasadas con el beneficio del resultado que sus autores no podían conocer en el momento.'
      ]
    },
    'mera-exposicion': {
      nombre: 'Efecto de Mera Exposición',
      gancho: 'Cuanto más ves algo, más te atrae sin razón aparente.',
      explicacion: 'Demostrado por Robert Zajonc en 1968, el efecto de mera exposición establece que la simple familiaridad con un estímulo —una cara, una palabra, una melodía— incrementa la actitud positiva hacia él, incluso sin ninguna experiencia consciente de haberlo visto antes. Los estudios con estimulación subliminal muestran el mismo patrón: la exposición no necesita ser consciente para generar preferencia.',
      experimento: 'Zajonc · University of Michigan · 1968',
      descExp: 'Participantes expuestos a caracteres chinos sin significado para ellos los calificaron como más positivos cuanto más frecuentemente habían aparecido en sesiones previas, incluso sin recordar haberlos visto.',
      aplicaciones: [
        'En publicidad, la exposición repetida a una marca incrementa la preferencia por ella con independencia del contenido del anuncio.',
        'En relaciones interpersonales, la proximidad física frecuente es uno de los predictores más robustos de atracción.',
        'En política, los candidatos más conocidos tienen ventaja sistemática sobre los menos conocidos, con independencia de sus posiciones.'
      ]
    },
    'anclaje': {
      nombre: 'Anclaje Cognitivo',
      gancho: 'El primer número que oyes decide todos los demás.',
      explicacion: 'Descrito por Kahneman y Tversky en 1974, el efecto de anclaje ocurre cuando la primera pieza de información numérica recibida influye de forma desproporcionada en los juicios posteriores, incluso cuando esa información es claramente arbitraria. El cerebro usa el ancla como punto de partida y ajusta insuficientemente desde él.',
      experimento: 'Tversky & Kahneman · Hebrew University of Jerusalem · 1974',
      descExp: 'Participantes que hacían girar una ruleta trucada para obtener 10 o 65 estimaban después que el porcentaje de países africanos en la ONU era 25% (grupo del 10) o 45% (grupo del 65). La ruleta era obviamente arbitraria — y aun así ancló los juicios.',
      aplicaciones: [
        'En negociaciones salariales, quien hace la primera oferta ancla toda la discusión en torno a ese número.',
        'En comercio, los precios "originales" tachados anclan la percepción de ganga aunque nunca existieran a ese precio.',
        'En medicina, los primeros síntomas reportados anclan el diagnóstico y dificultan la consideración de alternativas.'
      ]
    },
    'barnum': {
      nombre: 'Efecto Barnum (o Forer)',
      gancho: 'Crees que una descripción genérica te define a ti en concreto.',
      explicacion: 'En 1949, Bertram Forer administró un test de personalidad a sus estudiantes y entregó a todos exactamente el mismo informe de resultados. Sin embargo, cada estudiante calificó su "perfil personalizado" con una puntuación media de 4,26 sobre 5 en precisión. El truco: el informe estaba compuesto de afirmaciones vagas y positivas aplicables a cualquier persona. Este efecto explica por qué la astrología, los horóscopos y muchos tests de personalidad virales resultan tan persuasivos.',
      experimento: 'Bertram Forer · Universidad de California · 1949',
      descExp: 'El 87% de los estudiantes calificó el perfil genérico como "muy preciso" o "exacto". Ninguno sabía que su compañero tenía idéntico resultado. La media de puntuación fue 4,26 sobre 5.',
      aplicaciones: [
        'Las predicciones astrológicas usan deliberadamente el efecto Barnum: son lo suficientemente vagas para que cualquiera las reconozca como propias.',
        'Los tests de personalidad virales en redes sociales explotan este efecto combinando validación positiva con ambigüedad estratégica.',
        'Los "lectores de mentes" y videntes construyen toda su actuación sobre este principio: la gente completa los huecos con sus propias experiencias.'
      ]
    },
    'disponibilidad': {
      nombre: 'Sesgo de Disponibilidad',
      gancho: 'Lo que recuerdas fácilmente parece más probable que lo que no.',
      explicacion: 'Descrito por Kahneman y Tversky en 1973, la heurística de disponibilidad ocurre cuando juzgamos la probabilidad de un evento en función de la facilidad con que podemos recordar ejemplos. Si algo es fácil de recordar —porque fue reciente, emotivo o ampliamente cubierto mediáticamente— lo percibimos como más frecuente y probable, con independencia de la estadística real.',
      experimento: 'Tversky & Kahneman · Hebrew University · 1973',
      descExp: 'Cuando se pregunta si hay más palabras en inglés que empiecen por "k" o que tengan "k" en tercera posición, la mayoría elige la primera. En realidad hay el triple de palabras con "k" en tercera posición, pero las que empiezan por "k" son más fáciles de recuperar de memoria.',
      aplicaciones: [
        'Los accidentes de avión generan más miedo que los de coche aunque estadísticamente sean mucho menos letales: la cobertura mediática los hace más disponibles en memoria.',
        'Tras una noticia de crimen violento, el público sobreestima sistemáticamente la tasa de criminalidad aunque haya bajado.',
        'Los médicos sobrediagnostican enfermedades raras que han visto recientemente porque están "activadas" en su memoria de trabajo.'
      ]
    },
    'pigmalion': {
      nombre: 'Efecto Pigmalión',
      gancho: 'Las expectativas de los demás sobre ti acaban cumpliéndose.',
      explicacion: 'En 1968, Robert Rosenthal y Lenore Jacobson demostraron que las expectativas de los profesores influían directamente en el rendimiento de sus alumnos. Comunicaron falsamente a varios maestros que ciertos alumnos tenían un "potencial intelectual excepcional". Al final del año, esos alumnos —elegidos aleatoriamente— habían mejorado significativamente más que el resto. Las expectativas modificaron la conducta del profesor, que a su vez modificó la del alumno.',
      experimento: 'Rosenthal & Jacobson · Universidad de Harvard · 1968',
      descExp: 'Alumnos etiquetados aleatoriamente como "de alto potencial" mejoraron hasta 15 puntos de CI en un año comparado con el resto. No recibieron instrucción especial: sus profesores simplemente esperaban más de ellos y eso cambió cómo interactuaban con ellos.',
      aplicaciones: [
        'En entornos laborales, los empleados de quienes sus jefes esperan más rinden significativamente mejor, independientemente de sus habilidades iniciales.',
        'En medicina, los médicos que transmiten confianza en el tratamiento obtienen mejores resultados que los que expresan dudas.',
        'En crianza, las expectativas explícitas que los padres comunican a los hijos predicen el rendimiento académico mejor que el nivel socioeconómico.'
      ]
    },
    'superviviente': {
      nombre: 'Sesgo del Superviviente',
      gancho: 'Solo ves los éxitos porque los fracasos no cuentan su historia.',
      explicacion: 'Durante la Segunda Guerra Mundial, el estadístico Abraham Wald recibió el encargo de reforzar los aviones que regresaban de combate. Los militares querían blindar las zonas con más impactos visibles. Wald señaló el error: solo veían los aviones supervivientes. Los que habían recibido daño en otras zonas nunca regresaban para contarlo. Había que blindar precisamente las zonas sin impactos, no las dañadas.',
      experimento: 'Abraham Wald · Statistical Research Group · 1943',
      descExp: 'El análisis de Wald demostró que los aviones con daños en el motor raramente regresaban. Las marcas de impacto visibles en los supervivientes indicaban las zonas que podían tolerarse. Reforzar donde había marcas hubiera sido exactamente al revés.',
      aplicaciones: [
        'Los libros de autoayuda sobre el éxito solo entrevistan a quienes triunfaron, ignorando estructuralmente a quienes siguieron los mismos pasos y fracasaron.',
        'Los inversores exitosos se vuelven famosos; los que usaron la misma estrategia y perdieron desaparecen del mapa mediático.',
        'Las startups que analizamos son las que sobrevivieron; las miles que fracasaron con ideas similares son invisibles y no aprenden de ellas.'
      ]
    },
    'autoservicio': {
      nombre: 'Sesgo de Autoservicio',
      gancho: 'Tus éxitos son tuyos; tus fracasos, culpa de las circunstancias.',
      explicacion: 'El sesgo de autoservicio es la tendencia a atribuir los resultados positivos a factores internos (habilidad, esfuerzo, mérito) y los negativos a factores externos (mala suerte, la situación, los demás). Este patrón asimétrico protege la autoestima y es universal en culturas individualistas, aunque varía en intensidad según el contexto cultural.',
      experimento: 'Lau & Russell · Journal of Personality and Social Psychology · 1980',
      descExp: 'El análisis de más de 100 artículos periodísticos sobre resultados deportivos mostró que los atletas atribuían las victorias a su esfuerzo y habilidad en el 75% de los casos, mientras que atribuían las derrotas a factores externos —árbitros, lesiones, condiciones del campo— en el 80%.',
      aplicaciones: [
        'En equipos de trabajo, el sesgo de autoservicio genera conflictos: cada miembro tiende a asumir el mérito del éxito colectivo y a distribuir la responsabilidad del fracaso.',
        'En relaciones de pareja, ambas partes suelen verse como el miembro más colaborador y al otro como el más problemático.',
        'En política, los gobernantes atribuyen el crecimiento económico a su gestión y la recesión a factores heredados o internacionales.'
      ]
    },
    'primacia': {
      nombre: 'Efecto de Primacía',
      gancho: 'Lo primero que aprendes de alguien domina todo lo que viene después.',
      explicacion: 'Documentado por Solomon Asch en 1946, el efecto de primacía establece que la primera información que recibimos sobre una persona tiene un peso desproporcionado en nuestra impresión final, independientemente de lo que llegue después. El primer dato activa un marco de interpretación que filtra toda la información posterior.',
      experimento: 'Solomon Asch · Swarthmore College · 1946',
      descExp: 'Asch presentó a dos grupos la misma lista de adjetivos en orden inverso: "inteligente, industrioso, impulsivo, crítico, obstinado, envidioso" vs. el orden contrario. El primer grupo calificó a la persona descrita como fundamentalmente positiva; el segundo, como fundamentalmente negativa. Mismos adjetivos, orden diferente, impresiones opuestas.',
      aplicaciones: [
        'En entrevistas de trabajo, las primeras palabras del candidato establecen un marco que filtra toda la evaluación posterior.',
        'En negociaciones, la primera oferta ancla la percepción de valor de todo el acuerdo.',
        'En educación, la primera calificación de un alumno influye en cómo el profesor interpreta sus trabajos posteriores, independientemente de su calidad objetiva.'
      ]
    },
    'optimismo': {
      nombre: 'Sesgo de Optimismo',
      gancho: 'Tu cerebro cree que los malos eventos le ocurren a los demás, no a ti.',
      explicacion: 'Documentado exhaustivamente por Tali Sharot en el University College London, el sesgo de optimismo es la tendencia a creer que tenemos más probabilidad que la media de vivir eventos positivos y menos de sufrir los negativos. Más del 80% de la población muestra este patrón. No es irracionalidad pura: tiene valor evolutivo al mantener la motivación y el comportamiento de búsqueda de metas.',
      experimento: 'Sharot et al. · UCL London · 2011',
      descExp: 'Usando fMRI, Sharot demostró que el cerebro actualiza sus estimaciones de riesgo de forma asimétrica: cuando la información es mejor de lo esperado, el procesamiento es rápido y completo; cuando es peor, el cerebro actualiza significativamente menos. Somos sesgados hacia el optimismo a nivel neurológico.',
      aplicaciones: [
        'El 90% de los emprendedores cree que su empresa estará en el 10% que sobrevive, aunque la estadística base muestre lo contrario.',
        'Las personas subestiman sus probabilidades de divorciarse, enfermarse o ser víctimas de un accidente comparado con "la media".',
        'El sesgo de optimismo reduce el comportamiento preventivo: "eso no me va a pasar a mí" es una de las frases más documentadas antes de eventos evitables.'
      ]
    },
    'bandwagon': {
      nombre: 'Efecto Bandwagon',
      gancho: 'Cuanta más gente cree algo, más probable te parece que sea verdad.',
      explicacion: 'El efecto de arrastre describe la tendencia a adoptar creencias o comportamientos porque un número creciente de personas lo hace. La conformidad social es evolutivamente adaptativa —en entornos ancestrales, seguir al grupo era frecuentemente la mejor estrategia de supervivencia. En el mundo moderno, sin embargo, genera burbujas de información y polarización.',
      experimento: 'Solomon Asch · Swarthmore College · 1951',
      descExp: 'En el famoso experimento de conformidad, el 75% de los participantes se conformó al menos una vez con la respuesta incorrecta del grupo, aunque la respuesta correcta fuera visualmente obvia. El 32% de todos los juicios individuales fueron erróneos cuando el grupo daba una respuesta incorrecta.',
      aplicaciones: [
        'Las listas de éxitos musicales generan un bucle autorreferencial: lo popular se vuelve más popular no por calidad intrínseca sino por visibilidad.',
        'En mercados financieros, el bandwagon alimenta burbujas especulativas donde los inversores compran porque "todos lo están haciendo".',
        'Las encuestas electorales publicadas antes del voto influyen en el resultado activando el efecto de arrastre.'
      ]
    },
    'status-quo': {
      nombre: 'Sesgo del Statu Quo',
      gancho: 'Cambiar duele más que seguir igual, aunque seguir igual sea peor.',
      explicacion: 'Documentado por Samuelson y Zeckhauser en 1988, el sesgo del statu quo es la preferencia irracional por el estado actual de las cosas. El cambio se percibe como una pérdida, y dado que las pérdidas duelen más que las ganancias equivalentes, seguir igual tiende a parecer la opción más segura incluso cuando no lo es. Es el mecanismo detrás de la inercia en política, hábitos y relaciones.',
      experimento: 'Samuelson & Zeckhauser · Journal of Risk and Uncertainty · 1988',
      descExp: 'En experimentos donde los participantes debían elegir carteras de inversión, elegían mantener la cartera por defecto (la heredada) en lugar de cambiar a opciones objetivamente superiores. El porcentaje de elección de la opción por defecto aumentaba a medida que crecía la complejidad de las alternativas.',
      aplicaciones: [
        'Los sistemas de donación de órganos opt-out (todos son donantes salvo que lo rechacen) tienen tasas de donación drásticamente más altas que los opt-in.',
        'Los planes de suscripción con renovación automática explotan este sesgo: cancelar requiere acción activa y eso es costoso psicológicamente.',
        'En política, los incumbentes tienen ventaja sistemática no solo por reconocimiento sino porque el cambio se percibe como más arriesgado que la continuidad.'
      ]
    },
    'efecto-espejo': {
      nombre: 'Efecto Espejo (Rapport)',
      gancho: 'Imitar inconscientemente al otro genera confianza y empatía inmediata.',
      explicacion: 'La mímica no consciente de gestos, postura y lenguaje del interlocutor genera empatía y sensación de afinidad en ambas partes. Documentado por Chartrand y Bargh en 1999, el efecto camaleón demuestra que imitamos sin saberlo a quien nos gusta y generamos afecto en quien nos imita, sin que ninguna parte sea consciente del proceso.',
      experimento: 'Chartrand & Bargh · New York University · 1999',
      descExp: 'Participantes que interactuaban con un cómplice que imitaba sutilmente sus posturas y gestos calificaron la interacción como significativamente más agradable y al cómplice como más simpático, sin reportar haber notado la imitación.',
      aplicaciones: [
        'Los negociadores y diplomáticos entrenados en técnicas de rapport usan la mímica deliberada para construir confianza rápidamente.',
        'En atención al cliente, los operadores que adaptan su tono y velocidad de habla a los del cliente obtienen mejores valoraciones.',
        'En terapia, el efecto camaleón es parte del mecanismo detrás de la alianza terapéutica, uno de los predictores más robustos del éxito del tratamiento.'
      ]
    }
  };

  const overlay  = document.getElementById('efecto-modal');
  const closeBtn = document.getElementById('efecto-modal-close');
  const content  = document.getElementById('efecto-modal-content');
  if (!overlay) return;

  let efectoTrap = null, efectoTrigger = null;

  function openEfecto(id) {
    efectoTrigger = document.activeElement;
    const base = EFECTOS_DATA[id];
    if (!base) return;
    const d = Object.assign({}, base, EFECTOS_EXTRA[id] || {});
    content.innerHTML = `
      <h2 class="efecto-modal-nombre">${d.nombre}</h2>
      <p class="efecto-modal-gancho">${d.gancho}</p>
      <p class="efecto-modal-explicacion">${d.explicacion}</p>
      ${d.explicacion2 ? `<p class="efecto-modal-explicacion">${d.explicacion2}</p>` : ''}
      <div class="experimento-box">
        <div class="experimento-box-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          El Experimento Original
        </div>
        <p class="experimento-box-titulo">${d.experimento}</p>
        <p>${d.descExp}</p>
      </div>
      ${d.mecanismo ? `<div class="mecanismo-box">
        <div class="mecanismo-box-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>
          ¿Por qué ocurre?
        </div>
        <p>${d.mecanismo}</p>
        ${d.mecanismo2 ? `<p style="margin-top:0.55rem">${d.mecanismo2}</p>` : ''}
      </div>` : ''}
      <div class="aplicaciones-label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        Aplicaciones en la vida real
      </div>
      <ul class="aplicaciones-list">${d.aplicaciones.map(a => `<li>${a}</li>`).join('')}</ul>`;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    window._LI_currentEfecto = id;
    history.pushState({ v: 'efecto', id }, '', `?v=efecto&id=${id}`);
    efectoTrap = trapFocus(overlay);
    requestAnimationFrame(() => closeBtn && closeBtn.focus());
  }

  function closeEfecto() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    window._LI_currentEfecto = null;
    if (efectoTrap) { releaseFocus(overlay, efectoTrap, efectoTrigger); efectoTrap = null; }
    if (history.state?.v === 'efecto') history.pushState({}, '', window.location.pathname);
  }

  document.querySelectorAll('.efecto-card').forEach(card =>
    card.addEventListener('click', () => openEfecto(card.dataset.efecto))
  );

  if (closeBtn) {
    closeBtn.addEventListener('click', closeEfecto);
    closeBtn.addEventListener('touchstart', e => { e.preventDefault(); closeEfecto(); }, { passive: false });
  }
  overlay.addEventListener('click', e => { if (e.target === overlay) closeEfecto(); });
  overlay.addEventListener('touchstart', e => { if (e.target === overlay) { e.preventDefault(); closeEfecto(); } }, { passive: false });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeEfecto();
  });

  window._LI_openEfecto = openEfecto;
}());


/* ── PANEL DE FAVORITOS (navbar) ────────────────────────────── */
(function () {
  const navBtn = document.getElementById('fav-nav-btn');
  const badge  = document.getElementById('fav-nav-badge');
  if (!navBtn) return;

  const LS_KEY = 'li_favorites';
  function getFavs() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; } }
  function removeFav(id) {
    const f = getFavs().filter(x => x !== id);
    lsSet(LS_KEY, JSON.stringify(f));
    /* sincronizar botones en el resto de la UI */
    document.querySelectorAll(`.fav-btn[data-fav-id="${id}"]`).forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-label', 'Guardar en favoritos');
    });
  }

  /* Icono del tipo de favorito */
  function typeIcon(type) {
    return { doc:'📄', efecto:'🧠', weekly:'📰', lib:'📖' }[type] || '♡';
  }

  /* Subtítulo por tipo */
  function typeSub(item) {
    if (item.type === 'doc')    return item.author + ' · ' + item.time;
    if (item.type === 'efecto') return item.gancho;
    if (item.type === 'weekly') return item.authorName + ' · Semana ' + item.week;
    if (item.type === 'lib')    return item.authorName + ' · ' + item.readingTime;
    return '';
  }

  /* Acción al pulsar un ítem */
  function openItem(item, id) {
    closePanel();
    if (item.type === 'efecto') {
      if (window._LI_openEfecto) window._LI_openEfecto(id);
    } else if (item.type === 'weekly') {
      document.querySelector('[data-tab="semana"]')?.click();
      setTimeout(() => { if (window._LI_renderWeekly) window._LI_renderWeekly(item.week); }, 60);
    } else if (item.type === 'lib') {
      document.querySelector('[data-tab="biblioteca"]')?.click();
      setTimeout(() => { if (window._LI_openLibArticle) window._LI_openLibArticle(item.id, item.cat); }, 60);
    } else if (item.type === 'doc' && item.pdf) {
      window.open(item.pdf, '_blank');
    }
  }

  let panel = null;

  function updateBadge() {
    const count = getFavs().length;
    if (badge) {
      badge.hidden  = count === 0;
      badge.textContent = count;
    }
    navBtn.classList.toggle('has-favs', count > 0);
  }

  function buildPanel() {
    if (panel) panel.remove();
    panel = document.createElement('div');
    panel.className = 'fav-nav-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Mis favoritos');

    const favIds = getFavs();
    /* CATALOG puede no estar disponible aún si se llama antes del IIFE de favoritos */
    const catalog = window._LI_CATALOG || {};

    panel.innerHTML = `
      <div class="fav-nav-panel-header">
        <span class="fav-nav-panel-title">Mis favoritos ${favIds.length > 0 ? '(' + favIds.length + ')' : ''}</span>
        <button class="fav-nav-panel-close" aria-label="Cerrar">✕</button>
      </div>
      ${favIds.length === 0
        ? `<div class="li-empty fav-nav-empty">
            <span class="li-empty-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
            <span><strong>Sin favoritos aún</strong>Pulsa el ♡ en artículos o efectos para guardarlos aquí.</span>
           </div>`
        : `<div class="fav-nav-list">${favIds.map(id => {
            const item = catalog[id];
            if (!item) return '';
            const title = item.title || item.nombre || id;
            return `<div class="fav-nav-item" data-fav-id="${id}">
              <span class="fav-nav-item-icon">${typeIcon(item.type)}</span>
              <span class="fav-nav-item-body">
                <span class="fav-nav-item-title">${title}</span>
                <span class="fav-nav-item-sub">${typeSub(item)}</span>
              </span>
              <button class="fav-nav-item-remove" data-remove-id="${id}" aria-label="Quitar de favoritos" title="Quitar">✕</button>
            </div>`;
          }).join('')}</div>`
      }`;

    document.body.appendChild(panel);

    panel.querySelector('.fav-nav-panel-close')?.addEventListener('click', closePanel);

    panel.querySelectorAll('.fav-nav-item').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.closest('.fav-nav-item-remove')) return;
        const item = catalog[el.dataset.favId];
        if (item) openItem(item, el.dataset.favId);
      });
    });

    panel.querySelectorAll('.fav-nav-item-remove').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        removeFav(btn.dataset.removeId);
        buildPanel();       /* reconstruir panel tras eliminar */
        updateBadge();
        /* refrescar sección favoritos si está visible */
        document.querySelectorAll('.tab-btn[data-tab="biblioteca"]')
          .forEach(b => { if (b.classList.contains('active')) setTimeout(() => {}, 0); });
      });
    });
  }

  function openPanel() { buildPanel(); }
  function closePanel() { if (panel) { panel.remove(); panel = null; } }

  navBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (panel) closePanel(); else openPanel();
  });

  document.addEventListener('click', e => {
    if (panel && !panel.contains(e.target) && e.target !== navBtn) closePanel();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel) closePanel();
  });

  /* Actualizar badge cuando cambien los favoritos */
  updateBadge();
  window._LI_updateFavBadge = updateBadge;
}());


/* ── SELECTOR DE TEMA ────────────────────────────────────────── */
(function () {
  const html   = document.documentElement;
  const btn    = document.getElementById('theme-toggle');
  const iconEl = document.getElementById('theme-icon');
  if (!btn) return;

  const DARK_BASES = new Set(['dark', 'naranja', 'tormenta', 'cosmos', 'carmesi']);

  /* nivel: XP mínimo para desbloquear (0 = siempre disponible) */
  const THEMES = [
    { id: 'light',    label: 'Claro',    bg: '#F7F9FF', accent: '#3B82F6', nivel: 0 },
    { id: 'dark',     label: 'Oscuro',   bg: '#07101E', accent: '#60A5FA', nivel: 0 },
    { id: 'verde',    label: 'Verde',    bg: '#F0FBF4', accent: '#16A34A', nivel: 1 },
    { id: 'cosmos',   label: 'Cosmos',   bg: '#08060A', accent: '#F59E0B', nivel: 2 },
    { id: 'tormenta', label: 'Tormenta', bg: '#07030F', accent: '#A855F7', nivel: 3 },
    { id: 'carmesi',  label: 'Carmesí',  bg: '#0A0204', accent: '#C8102E', nivel: 4 },
    { id: 'obsidiana',label: 'Obsidiana',bg: '#080700', accent: '#D4AF37', nivel: 5 },
  ];

  const SUN  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const MOON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function getUserNivel() {
    const xp = parseInt(lsGet('li_xp_v1', '0'), 10) || 0;
    if (xp >= 5500) return 5;
    if (xp >= 3000) return 4;
    if (xp >= 1500) return 3;
    if (xp >= 600)  return 2;
    if (xp >= 150)  return 1;
    return 0;
  }

  function currentThemeId() {
    return html.getAttribute('data-theme') || 'light';
  }

  function updateIcon() {
    if (!iconEl) return;
    iconEl.innerHTML = DARK_BASES.has(currentThemeId()) ? MOON : SUN;
  }

  function swapLogos(id) {
    const logoSrc = id === 'obsidiana' ? 'img/logo3.png' : 'img/logo2.png';
    document.querySelectorAll('img.logo, img.hero-logo, img.mobile-menu-logo').forEach(img => {
      img.src = logoSrc;
    });
  }

  function doApply(id) {
    if (id === 'light') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', id);
    }
    if (DARK_BASES.has(id)) {
      html.classList.add('dark-base');
    } else {
      html.classList.remove('dark-base');
    }
    lsSet('theme', id);
    swapLogos(id);
    updateIcon();
    updateSwatches();
  }

  function applyTheme(id) {
    if (document.startViewTransition) {
      document.startViewTransition(() => doApply(id));
    } else {
      doApply(id);
    }
  }

  /* ── Toggle simple (nivel 0) ── */
  function toggleSimple() {
    const next = DARK_BASES.has(currentThemeId()) ? 'light' : 'dark';
    applyTheme(next);
  }

  /* ── Popup picker (nivel 1+) ── */
  let popup = null;

  function buildPopup() {
    const p = document.createElement('div');
    p.className = 'theme-picker-popup';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', 'Seleccionar tema');

    const grid = document.createElement('div');
    grid.className = 'theme-picker-grid';

    const userNivel = getUserNivel();
    THEMES.filter(t => t.nivel <= userNivel).forEach(t => {
      const swBtn = document.createElement('button');
      swBtn.className = 'theme-swatch-btn';
      swBtn.dataset.themeId = t.id;
      swBtn.title = t.label;

      const preview = document.createElement('div');
      preview.className = 'theme-swatch-preview';
      preview.style.background = `linear-gradient(135deg, ${t.bg} 55%, ${t.accent} 55%)`;

      const label = document.createElement('span');
      label.className = 'theme-swatch-label';
      label.textContent = t.label;

      swBtn.appendChild(preview);
      swBtn.appendChild(label);
      grid.appendChild(swBtn);

      swBtn.addEventListener('click', () => { applyTheme(t.id); closePopup(); });
    });

    p.appendChild(grid);
    return p;
  }

  function updateSwatches() {
    if (!popup) return;
    const cur = currentThemeId();
    popup.querySelectorAll('.theme-swatch-btn').forEach(b => {
      b.classList.toggle('ts-active', b.dataset.themeId === cur);
    });
  }

  function positionPopup() {
    if (!popup) return;
    const rect = btn.getBoundingClientRect();
    popup.style.top   = (rect.bottom + 6) + 'px';
    popup.style.right = (window.innerWidth - rect.right) + 'px';
    popup.style.left  = 'auto';
  }

  function openPopup() {
    popup = buildPopup();
    document.body.appendChild(popup);
    positionPopup();
    updateSwatches();
    btn.setAttribute('aria-expanded', 'true');
    popup.addEventListener('click', e => e.stopPropagation());
  }

  function closePopup() {
    if (!popup) return;
    popup.remove();
    popup = null;
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (getUserNivel() >= 1) {
      if (popup) { closePopup(); } else { openPopup(); }
    } else {
      toggleSimple();
    }
  });

  document.addEventListener('click', () => closePopup());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });
  window.addEventListener('resize', () => positionPopup());

  /* En nivel 0 oculta el chevron (no hay dropdown) */
  const chevron = btn.querySelector('.theme-chevron');
  if (chevron) chevron.style.display = getUserNivel() >= 1 ? '' : 'none';

  swapLogos(currentThemeId());
  updateIcon();
}());


/* ── ONBOARDING — primera visita ────────────────────────────── */
(function () {
  const overlay = document.getElementById('onboarding-overlay');
  const nextBtn = document.getElementById('onboarding-next');
  const skipBtn = document.getElementById('onboarding-skip');
  if (!overlay || !nextBtn || !skipBtn) return;

  const LS_KEY = 'li_onboarded';
  if (lsGet(LS_KEY)) return; /* ya ha visitado antes */

  const steps = Array.from(overlay.querySelectorAll('.onboarding-step'));
  const dots  = Array.from(overlay.querySelectorAll('.onboarding-dot'));
  let current = 0;
  let transitioning = false;

  const CHEVRON = `<svg class="ob-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;

  function updateBtn() {
    nextBtn.innerHTML = (current === steps.length - 1 ? '¡Empezar! ' : 'Siguiente ') + CHEVRON;
  }

  function retriggerIcon(step) {
    const icon = step.querySelector('.onboarding-icon');
    if (!icon) return;
    icon.classList.remove('icon-retrigger');
    void icon.offsetWidth;
    icon.classList.add('icon-retrigger');
  }

  function goTo(n) {
    if (transitioning) return;
    transitioning = true;

    const leaving = steps[current];
    leaving.classList.add('step-exiting');
    dots[current].classList.remove('active');

    setTimeout(() => {
      leaving.classList.remove('active', 'step-exiting');
      current = n;
      steps[current].classList.add('active');
      dots[current].classList.add('active');
      retriggerIcon(steps[current]);
      updateBtn();
      transitioning = false;
    }, 210);
  }

  function close() {
    overlay.hidden = true;
    lsSet(LS_KEY, '1');
  }

  nextBtn.addEventListener('click', () => {
    if (current < steps.length - 1) goTo(current + 1);
    else close();
  });
  skipBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  trapFocus(overlay);

  /* Mostrar con pequeño retraso para no interrumpir la carga */
  setTimeout(() => {
    overlay.hidden = false;
    updateBtn();
    nextBtn.focus();
  }, 800);
}());

/* ── BOTÓN VOLVER ARRIBA ─────────────────────────────────────── */
(function () {
  const btn = document.getElementById('btn-volver-arriba');
  if (!btn) return;
  function getScrollTop() {
    const appEl = document.getElementById('app');
    return (appEl && document.body.scrollHeight === document.body.clientHeight)
      ? appEl.scrollTop
      : window.scrollY;
  }
  function scrollToTop() {
    const appEl = document.getElementById('app');
    if (appEl && document.body.scrollHeight === document.body.clientHeight) {
      appEl.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  function onScroll() { btn.classList.toggle('visible', getScrollTop() > 400); }
  window.addEventListener('scroll', onScroll, { passive: true });
  const appEl = document.getElementById('app');
  if (appEl) appEl.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', scrollToTop);
}());


/* ── MODO LECTURA ENFOQUE ────────────────────────────────────── */
(function () {
  const layout = document.querySelector('.dashboard-layout');

  function colsExpandidas() {
    const pl = parseFloat(getComputedStyle(layout).paddingLeft)  || 0;
    const pr = parseFloat(getComputedStyle(layout).paddingRight) || 0;
    return `0px ${layout.clientWidth - pl - pr}px 0px`;
  }

  function aplicarEnfoque(activo) {
    document.querySelectorAll('.btn-modo-enfoque').forEach(b => {
      b.textContent = activo ? '✕ Salir de enfoque' : '📖 Modo Enfoque';
      b.setAttribute('aria-pressed', String(activo));
    });

    /* ── ENTRADA ──────────────────────────────────────────────── */
    if (activo) {
      document.body.classList.add('modo-enfoque-activo');
      if (!layout || window.innerWidth < 1101) return;

      /* Suprimir transición, expandir el grid al instante */
      layout.style.transition          = 'none';
      layout.style.gridTemplateColumns = colsExpandidas();
      layout.style.gap                 = '0px';

      /* Restaurar transición en el siguiente frame */
      requestAnimationFrame(() => {
        layout.style.transition = '';
      });

    /* ── SALIDA ───────────────────────────────────────────────── */
    } else {
      if (!layout || window.innerWidth < 1101) {
        document.body.classList.remove('modo-enfoque-activo');
        return;
      }

      /* 1. Quitar la clase INMEDIATAMENTE: los sidebars y el resto
            empiezan a reaparecer vía CSS transition al instante */
      document.body.classList.remove('modo-enfoque-activo');

      /* 2. Suprimir la transición del grid en este frame */
      layout.style.transition = 'none';

      /* 3. Limpiar los estilos inline → el grid vuelve a las columnas
            CSS sin ninguna animación (reset limpio e instantáneo) */
      layout.style.gridTemplateColumns = '';
      layout.style.gap                 = '';

      /* 4. Restaurar la transición en el siguiente frame para que
            futuras entradas sigan animándose */
      requestAnimationFrame(() => {
        layout.style.transition = '';
      });
    }
  }

  window._LI_setEnfoque = aplicarEnfoque;

  document.addEventListener('click', e => {
    if (!e.target.closest('.btn-modo-enfoque')) return;
    aplicarEnfoque(!document.body.classList.contains('modo-enfoque-activo'));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('modo-enfoque-activo')) {
      aplicarEnfoque(false);
    }
  });

  window.addEventListener('resize', () => {
    if (!document.body.classList.contains('modo-enfoque-activo') || !layout) return;
    if (window.innerWidth < 1101) {
      layout.style.gridTemplateColumns = '';
      layout.style.gap                 = '';
    } else {
      layout.style.gridTemplateColumns = colsExpandidas();
      layout.style.gap                 = '0px';
    }
  }, { passive: true });
}());


/* ── BARRA DE PROGRESO DE LECTURA ────────────────────────────── */
(function () {
  const bar  = document.getElementById('reading-progress-bar');
  const fill = document.getElementById('reading-progress-fill');
  if (!bar || !fill) return;

  function updateProgress() {
    const appEl = document.getElementById('app');
    const scrollEl   = (appEl && document.body.scrollHeight === document.body.clientHeight) ? appEl : document.documentElement;
    const scrollTop  = (appEl && document.body.scrollHeight === document.body.clientHeight) ? appEl.scrollTop : window.scrollY;
    const totalHeight = scrollEl.scrollHeight - scrollEl.clientHeight;
    if (totalHeight <= 0) return;

    const pct = Math.min(100, Math.max(0, (scrollTop / totalHeight) * 100));

    if (pct <= 0) {
      bar.classList.remove('visible');
      fill.style.width = '0%';
    } else {
      bar.classList.add('visible');
      fill.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', Math.round(pct));
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  const _appEl = document.getElementById('app');
  if (_appEl) _appEl.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}());


/* ── SKELETON LOADING ────────────────────────────────────────── */
(function () {
  const efectosList = document.getElementById('efectos-list');
  const docsLayout  = document.getElementById('documentos-list');

  /* Reveal efectos con stagger suave */
  setTimeout(() => {
    if (!efectosList) return;
    efectosList.classList.remove('sk-init');
    const cards = efectosList.querySelectorAll('.efecto-card');
    cards.forEach((card, i) => {
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(7px)';
      card.style.transition = `opacity 0.32s ${i * 0.055}s ease, transform 0.32s ${i * 0.055}s ease`;
    });
    requestAnimationFrame(() => {
      cards.forEach(card => { card.style.opacity = '1'; card.style.transform = 'none'; });
    });
    setTimeout(() => {
      cards.forEach(card => { card.style.opacity = ''; card.style.transform = ''; card.style.transition = ''; });
    }, 900);
  }, 420);

  /* Reveal docs cards */
  setTimeout(() => {
    if (!docsLayout) return;
    docsLayout.classList.remove('sk-init');
    const cards = docsLayout.querySelectorAll('.doc-card');
    cards.forEach((card, i) => {
      card.style.opacity    = '0';
      card.style.transition = `opacity 0.3s ${i * 0.07}s ease`;
    });
    requestAnimationFrame(() => {
      cards.forEach(card => { card.style.opacity = '1'; });
    });
    setTimeout(() => {
      cards.forEach(card => { card.style.opacity = ''; card.style.transition = ''; });
    }, 900);
  }, 540);
}());


/* ── BOTIQUÍN ANTISESGOS ─────────────────────────────────────── */
(function () {
  const BOTIQUIN_DATA = {
    productividad: [
      { frente: '¿Por qué sé lo que tengo que hacer y no lo hago?',
        libro: 'Los 5 elementos del pensamiento efectivo', autor: 'Edward B. Burger', estrellas: '4,3',
        ciencia: 'La procrastinación activa las mismas regiones cerebrales que el dolor. El cerebro obtiene alivio inmediato al posponer la tarea, reforzando el ciclo mediante condicionamiento operante negativo.',
        sinopsis: 'Este libro desmonta el bloqueo desde la raíz y te da herramientas concretas para empezar aunque no te sientas preparado.', amazon: 'https://www.amazon.es/s?k=Los+5+elementos+del+pensamiento+efectivo+Burger&tag=lainferencia-21' },
      { frente: 'Tengo 7 tareas abiertas y no avanzo nada',
        libro: 'Esencialismo', autor: 'Greg McKeown', estrellas: '4,6',
        ciencia: 'El efecto Zeigarnik muestra que las tareas incompletas ocupan memoria de trabajo de forma involuntaria. Múltiples frentes abiertos reducen la capacidad cognitiva disponible incluso cuando no trabajas en ellos.',
        sinopsis: 'McKeown te entrena para eliminar lo que parece urgente pero no importa, y enfocarte en lo único que mueve la aguja de verdad.', amazon: 'https://www.amazon.es/dp/8418053461?tag=lainferencia-21' },
      { frente: 'Empiezo con energía y abandono a mitad',
        libro: 'Grit', autor: 'Angela Duckworth', estrellas: '4,5',
        ciencia: 'La motivación inicial está impulsada por dopamina anticipatoria. Al consumirse, debe ser reemplazada por hábito o propósito. Sin esa transición, la caída motivacional es neurológicamente inevitable.',
        sinopsis: 'Lo que separa a quien termina de quien abandona no es el talento sino la perseverancia entrenada. Duckworth explica exactamente cómo se construye esa resistencia.', amazon: 'https://www.amazon.es/dp/847953964X?tag=lainferencia-21' },
      { frente: 'Siempre digo sí a todo y no llego a nada',
        libro: 'Cuando digo no, me siento culpable', autor: 'Manuel J. Smith', estrellas: '4,4',
        ciencia: 'Decir sí activa el sistema de recompensa social de forma inmediata, mientras la sobrecarga queda diferida. El cerebro prioriza el alivio presente sobre el bienestar futuro: descuento temporal hiperbólico.',
        sinopsis: 'Este clásico de la asertividad te da un lenguaje concreto para poner límites sin sentir que estás defraudando a nadie.', amazon: 'https://www.amazon.es/dp/8499086497?tag=lainferencia-21' },
      { frente: 'Trabajo mucho pero siento que no produzco',
        libro: 'Trabajo profundo', autor: 'Cal Newport', estrellas: '4,7',
        ciencia: 'Según Gloria Mark (UC Irvine), tras cada interrupción el cerebro tarda 23 minutos en recuperar el mismo nivel de concentración. El trabajo superficial produce la ilusión de actividad sin generar valor cognitivo real.',
        sinopsis: 'Newport te muestra por qué el trabajo superficial te agota sin avanzar y cómo recuperar la concentración que las notificaciones te han ido robando.', amazon: 'https://www.amazon.es/dp/8411000516?tag=lainferencia-21' }
    ],
    relaciones: [
      { frente: 'Discuto y la conversación siempre empeora',
        libro: 'El arte de tener razón', autor: 'Arthur Schopenhauer', estrellas: '4,4',
        ciencia: 'Cuando el cortisol supera cierto umbral la conversación deja de ser razonada y se vuelve puramente reactiva. Gottman lo llama «inundación fisiológica» y es el predictor más fiable de rupturas.',
        sinopsis: 'Schopenhauer cataloga las trampas que usamos sin saberlo para ganar en lugar de entendernos, y reconocerlas es el primer paso para salir del bucle.', amazon: 'https://www.amazon.es/s?k=El+arte+de+tener+razon+Schopenhauer&tag=lainferencia-21' },
      { frente: 'Me cuesta decir lo que siento sin que suene a ataque',
        libro: 'Comunicación no violenta', autor: 'Marshall Rosenberg', estrellas: '4,7',
        ciencia: 'Los mensajes en primera persona activan menos defensa en el receptor que los mensajes en segunda persona. El marco lingüístico de la acusación dispara respuesta defensiva antes de que el otro procese el contenido.',
        sinopsis: 'Rosenberg ofrece un método simple para expresar necesidades reales sin activar la defensiva del otro.', amazon: 'https://www.amazon.es/dp/8415053665?tag=lainferencia-21' },
      { frente: 'Asumo lo que el otro piensa y me equivoco',
        libro: 'Conversaciones cruciales', autor: 'Patterson, Grenny y McMillan', estrellas: '4,6',
        ciencia: 'El «mindreading» es un atajo del Sistema 1: el cerebro llena los vacíos de información con sus propias proyecciones. Los errores de atribución se multiplican cuando hay estrés o fatiga cognitiva.',
        sinopsis: 'Este libro te enseña a distinguir lo que observas de lo que interpretas, y a abrir conversaciones que normalmente se evitan.', amazon: 'https://www.amazon.es/dp/8416997586?tag=lainferencia-21' },
      { frente: 'Las mismas discusiones se repiten siempre',
        libro: 'Atados al amor', autor: 'Susan Forward', estrellas: '4,3',
        ciencia: 'Los patrones repetitivos son esquemas relacionales aprendidos en la infancia que funcionan como guiones automáticos. Bowlby los llamó «modelos operativos internos» y se activan con independencia de la voluntad consciente.',
        sinopsis: 'Forward te ayuda a identificar los programas que siguen ejecutándose en automático y a reescribirlos.', amazon: 'https://www.amazon.es/s?k=Atados+al+amor+Susan+Forward&tag=lainferencia-21' },
      { frente: 'Me afectan demasiado los comentarios de otros',
        libro: 'Los cuatro acuerdos', autor: 'Miguel Ruiz', estrellas: '4,7',
        ciencia: 'La hipersensibilidad al juicio ajeno está ligada al córtex cingulado anterior, la misma región que procesa el dolor físico. Eisenberger (2003) demostró que el rechazo social y el dolor comparten sustrato neuronal.',
        sinopsis: 'Ruiz construye una filosofía práctica para dejar de tomar como personal lo que nunca fue dirigido a ti de verdad.', amazon: 'https://www.amazon.es/dp/847953253X?tag=lainferencia-21' }
    ],
    finanzas: [
      { frente: 'Compro cuando estoy estresado o aburrido',
        libro: 'La trampa del dinero', autor: 'Brent Kessel', estrellas: '4,2',
        ciencia: 'El estrés crónico eleva el umbral de recompensa dopaminérgico, necesitando estímulos cada vez más intensos. El retail therapy genera alivio real pero construye un ciclo compra-culpa que se retroalimenta.',
        sinopsis: 'Kessel conecta la psicología profunda con el comportamiento financiero y te da herramientas para romper ese circuito antes de que llegues al carrito.', amazon: 'https://www.amazon.es/s?k=La+trampa+del+dinero+Brent+Kessel&tag=lainferencia-21' },
      { frente: 'Me cuesta invertir por miedo a perderlo todo',
        libro: 'Pensar rápido, pensar despacio', autor: 'Daniel Kahneman', estrellas: '4,7',
        ciencia: 'La aversión a la pérdida (Kahneman & Tversky, 1979) es uno de los sesgos más robustos: perder 100€ genera entre 1,5 y 2,5 veces más respuesta emocional que ganar la misma cantidad.',
        sinopsis: 'Kahneman es la lectura obligatoria para entender por qué tus decisiones financieras casi nunca son tan racionales como crees.', amazon: 'https://www.amazon.es/dp/8483068613?tag=lainferencia-21' },
      { frente: 'Gasto más con tarjeta que con efectivo',
        libro: 'Dinero: domina el juego', autor: 'Tony Robbins', estrellas: '4,5',
        ciencia: 'El efecto «pain of paying» (Prelec & Loewenstein, 1998) muestra que el efectivo activa la ínsula generando una señal de dolor que frena el gasto. El pago digital desactiva esa señal por completo.',
        sinopsis: 'Robbins te da una arquitectura mental y práctica para relacionarte con el dinero desde la consciencia y no desde el impulso.', amazon: 'https://www.amazon.es/dp/8423429016?tag=lainferencia-21' },
      { frente: 'Siento que una oferta es una oportunidad que no puedo perder',
        libro: 'Influencia', autor: 'Robert Cialdini', estrellas: '4,8',
        ciencia: 'La escasez artificial activa el sistema de amenaza cerebral, produciendo urgencia que deteriora el pensamiento deliberado. Bajo ese estado el córtex prefrontal delega en la amígdala, favoreciendo decisiones de las que luego se arrepiente.',
        sinopsis: 'Cialdini disecciona los 6 mecanismos psicológicos que usa el marketing para que decidas sin darte cuenta de que estás decidiendo.', amazon: 'https://www.amazon.es/dp/849139690X?tag=lainferencia-21' },
      { frente: 'Sé que debería ahorrar pero lo dejo para después',
        libro: 'El hombre más rico de Babilonia', autor: 'George S. Clason', estrellas: '4,6',
        ciencia: 'El descuento hiperbólico (Ainslie, 1975) explica por qué preferimos recompensas pequeñas ahora a grandes más tarde. El «yo futuro» se procesa neurológicamente como si fuera otra persona.',
        sinopsis: 'Clason explica de forma irresistiblemente clara por qué pagarte a ti primero es la única regla financiera que realmente cambia el rumbo.', amazon: 'https://www.amazon.es/dp/8491115706?tag=lainferencia-21' }
    ],
    saludMental: [
      { frente: 'La ansiedad me bloquea antes de poder actuar',
        libro: 'Adiós, ansiedad', autor: 'Judson Brewer', estrellas: '4,5',
        ciencia: 'La ansiedad anticipatoria activa la amígdala ante amenazas inexistentes, generando un bucle que el córtex prefrontal interpreta como peligro real. Es un circuito de hábito, y como tal puede interrumpirse.',
        sinopsis: 'Brewer explica cómo funciona el bucle de la ansiedad desde la neurociencia y ofrece técnicas basadas en mindfulness para salir de él sin suprimirlo.', amazon: 'https://www.amazon.es/dp/8449338999?tag=lainferencia-21' },
      { frente: 'No puedo salir de los pensamientos negativos en bucle',
        libro: 'Mindfulness para la felicidad', autor: 'Mark Williams y Danny Penman', estrellas: '4,6',
        ciencia: 'El rumineo activa la red neuronal por defecto (default mode network), el mismo circuito que dispara la depresión. La mente que divaga hacia el pasado incrementa el cortisol de forma proporcional al tiempo que pasa en ese estado.',
        sinopsis: 'Williams y Penman ofrecen un programa de 8 semanas basado en la terapia cognitiva para interrumpir el ciclo de rumiación que alimenta la tristeza crónica.', amazon: 'https://www.amazon.es/dp/8408237497?tag=lainferencia-21' },
      { frente: 'Me afecta todo mucho y no sé cómo regularlo',
        libro: 'Inteligencia emocional', autor: 'Daniel Goleman', estrellas: '4,6',
        ciencia: 'La regulación emocional depende de la comunicación entre amígdala (respuesta emocional) y córtex prefrontal (control consciente). Este canal se puede entrenar deliberadamente; no es un rasgo de personalidad fijo.',
        sinopsis: 'Goleman explica por qué el coeficiente emocional predice el bienestar mejor que el intelectual, y cómo desarrollar las habilidades que nos hacen funcionar con los demás.', amazon: 'https://www.amazon.es/dp/8472453715?tag=lainferencia-21' },
      { frente: 'Hace tiempo que nada me ilusiona de verdad',
        libro: 'El hombre en busca de sentido', autor: 'Viktor Frankl', estrellas: '4,8',
        ciencia: 'La anhedonia está ligada a déficits en el sistema dopaminérgico de anticipación. Recuperar propósito activa vías de recompensa que la inercia cotidiana anestesia, independientemente de las circunstancias externas.',
        sinopsis: 'Desde los campos de concentración, Frankl construye una argumentación poderosa: quien tiene un porqué puede soportar casi cualquier cómo.', amazon: 'https://www.amazon.es/dp/8425423317?tag=lainferencia-21' },
      { frente: 'Sé que algo me pasa pero no sé ponerle nombre',
        libro: 'El cuerpo lleva la cuenta', autor: 'Bessel van der Kolk', estrellas: '4,8',
        ciencia: 'Las emociones no procesadas se almacenan en el cuerpo como tensión crónica y patrones autonómicos. El trauma no necesita ser grave para dejar huella somática, y el cuerpo la registra incluso cuando la mente no lo recuerda.',
        sinopsis: 'Van der Kolk revolucionó la psicología al demostrar que el trauma vive en el cuerpo. Un libro que redefine lo que significa sanar.', amazon: 'https://www.amazon.es/dp/8412067193?tag=lainferencia-21' }
    ],
    trabajo: [
      { frente: 'Nada de lo que hago parece suficiente',
        libro: 'Los dones de la imperfección', autor: 'Brené Brown', estrellas: '4,5',
        ciencia: 'El perfeccionismo no es un estándar de calidad: es un escudo frente al juicio ajeno. Genera un ciclo de esfuerzo-insatisfacción que Hewitt llama «perfeccionismo socialmente prescrito» y correlaciona con burnout.',
        sinopsis: 'Brown te invita a soltar la armadura del perfeccionismo y construir una vida basada en lo que realmente te importa, no en lo que crees que deberías ser.', amazon: 'https://www.amazon.es/dp/8484456560?tag=lainferencia-21' },
      { frente: 'Me comparo con compañeros y siempre salgo perdiendo',
        libro: 'Mindset: la actitud del éxito', autor: 'Carol Dweck', estrellas: '4,6',
        ciencia: 'La comparación social ascendente activa los mismos circuitos de amenaza que el dolor físico (Eisenberger, 2003). La diferencia entre quien se paraliza y quien se motiva está en el tipo de mentalidad con que la procesa.',
        sinopsis: 'Dweck demuestra que la diferencia entre prosperar y estancarse no es el talento, sino la creencia sobre si ese talento puede cambiar.', amazon: 'https://www.amazon.es/dp/8416579164?tag=lainferencia-21' },
      { frente: 'Siento que no merezco el puesto que tengo',
        libro: 'El síndrome del impostor', autor: 'Jessamy Hibberd', estrellas: '4,3',
        ciencia: 'El síndrome del impostor afecta al 70% de las personas en algún momento (Clance & Imes, 1978). Es más frecuente en entornos de alta exigencia y correlaciona con el pensamiento todo-o-nada y la atribución externa del éxito.',
        sinopsis: 'Hibberd explica por qué personas brillantes se sienten un fraude, y ofrece estrategias concretas para cambiar la narrativa interna.', amazon: 'https://www.amazon.es/dp/8419870145?tag=lainferencia-21' },
      { frente: 'Las reuniones me agotan y siento que pierdo el tiempo',
        libro: 'El poder de los introvertidos', autor: 'Susan Cain', estrellas: '4,7',
        ciencia: 'Las reuniones de más de 7 personas disparan el «social loafing» (Ringelmann): la responsabilidad individual se diluye al aumentar el grupo, resultando en menos producción por persona aunque se perciba como trabajo.',
        sinopsis: 'Cain reivindica el valor del pensamiento tranquilo en un mundo diseñado para los extrovertidos, con implicaciones directas para cómo organizamos el trabajo.', amazon: 'https://www.amazon.es/dp/849006363X?tag=lainferencia-21' },
      { frente: 'Me cuesta pedir ayuda por miedo a parecer incapaz',
        libro: 'El poder de la vulnerabilidad', autor: 'Brené Brown', estrellas: '4,7',
        ciencia: 'Pedir ayuda activa la misma red cerebral que la amenaza social. Sin embargo, quienes piden ayuda son percibidos como más competentes por sus equipos, no menos: el efecto es contrario a la intuición.',
        sinopsis: 'Brown convierte la vulnerabilidad en fortaleza, demostrando que la conexión real con los demás solo es posible cuando dejamos de fingir que todo está bajo control.', amazon: 'https://www.amazon.es/dp/8479539496?tag=lainferencia-21' }
    ],
    autoconocimiento: [
      { frente: 'No sé bien qué quiero de mi vida',
        libro: 'Ikigai', autor: 'Héctor García y Francesc Miralles', estrellas: '4,5',
        ciencia: 'La ambigüedad de identidad activa los mismos marcadores de estrés que el dolor físico. La psicología de las metas distingue entre metas de aproximación (lo que quieres) y de evitación (lo que temes), y solo las primeras generan bienestar sostenido.',
        sinopsis: 'García y Miralles exploran el concepto japonés de ikigai —la razón de ser— y ofrecen claves concretas para encontrar el cruce entre lo que amas, lo que sabes hacer y lo que el mundo necesita.', amazon: 'https://www.amazon.es/dp/8479539224?tag=lainferencia-21' },
      { frente: 'Me cuesta mantener las promesas que me hago a mí mismo',
        libro: 'El instinto de la fuerza de voluntad', autor: 'Kelly McGonigal', estrellas: '4,5',
        ciencia: 'La fuerza de voluntad funciona como un músculo: se agota con el uso (Baumeister, 1998, ego depletion). Las promesas que más se rompen son las que se hacen en estados de alta activación emocional.',
        sinopsis: 'McGonigal convierte la ciencia del autocontrol en un programa práctico. No se trata de tener más fuerza de voluntad, sino de usarla de forma más inteligente.', amazon: 'https://www.amazon.es/dp/8479538171?tag=lainferencia-21' },
      { frente: 'Reacciono de formas que luego no entiendo',
        libro: 'Vinculados', autor: 'Amir Levine y Rachel Heller', estrellas: '4,7',
        ciencia: 'Los patrones de respuesta emocional se codifican antes de los 7 años en circuitos subcorticales. Cuando se activan, el córtex prefrontal queda temporalmente desconectado: actuamos de formas que no elegimos conscientemente.',
        sinopsis: 'Levine y Heller aplican la teoría del apego adulto para explicar por qué te comportas así en las relaciones cercanas, y cómo cambiar esos patrones.', amazon: 'https://www.amazon.es/dp/8479537817?tag=lainferencia-21' },
      { frente: 'Siempre pongo las necesidades de los demás antes que las mías',
        libro: 'Límites', autor: 'Henry Cloud y John Townsend', estrellas: '4,6',
        ciencia: 'La complacencia crónica activa el sistema de recompensa a corto plazo (evitar el conflicto) pero acumula resentimiento en la memoria emocional. Los psicólogos llaman a este patrón «afrontamiento sumiso» y correlaciona con burnout y pérdida de identidad.',
        sinopsis: 'Cloud y Townsend explican qué son los límites, por qué nos cuesta tanto tenerlos y cómo establecerlos sin culpa ni conflicto.', amazon: 'https://www.amazon.es/dp/0829750045?tag=lainferencia-21' },
      { frente: 'Me cuesta cambiar aunque sé que necesito hacerlo',
        libro: 'Switch: cómo cambiar las cosas cuando el cambio es difícil', autor: 'Chip y Dan Heath', estrellas: '4,5',
        ciencia: 'El cerebro interpreta el cambio como pérdida incluso cuando es positivo (sesgo del statu quo). La neuroplasticidad muestra que el cambio duradero requiere repetición en contexto emocional positivo, no solo voluntad consciente.',
        sinopsis: 'Los Heath proponen un marco sencillo con tres elementos: dirigir al jinete racional, motivar al elefante emocional y moldear el camino del entorno.', amazon: 'https://www.amazon.es/s?k=Switch+como+cambiar+las+cosas+Heath&tag=lainferencia-21' }
    ],
    crianza: [
      { frente: 'Mi hijo tiene rabietas que no sé cómo manejar',
        libro: 'El cerebro del niño', autor: 'Daniel J. Siegel y Tina Payne Bryson', estrellas: '4,7',
        ciencia: 'Hasta los 3-4 años el córtex prefrontal aún no está conectado con la amígdala. El niño literalmente no puede regular su respuesta emocional sin ayuda externa: no es manipulación, es inmadurez neurológica.',
        sinopsis: 'Siegel y Bryson explican cómo funciona el cerebro infantil y ofrecen estrategias concretas para convertir los momentos difíciles en oportunidades de desarrollo.', amazon: 'https://www.amazon.es/dp/8484287149?tag=lainferencia-21' },
      { frente: 'Me preocupa cuánto tiempo pasa mi hijo con el móvil',
        libro: 'La generación ansiosa', autor: 'Jonathan Haidt', estrellas: '4,6',
        ciencia: 'El uso de redes sociales activa el sistema de recompensa variable (similar a las tragaperras), reduciendo la tolerancia al aburrimiento y aumentando la necesidad de validación social externa, especialmente en la adolescencia.',
        sinopsis: 'Haidt documenta con datos el impacto de los smartphones en la salud mental de los adolescentes y propone una agenda concreta para los padres y las escuelas.', amazon: 'https://www.amazon.es/dp/8423437299?tag=lainferencia-21' },
      { frente: 'No sé cómo hablar con mi hijo adolescente',
        libro: 'El cerebro adolescente', autor: 'Frances E. Jensen', estrellas: '4,5',
        ciencia: 'Durante la adolescencia el sistema límbico (emociones e impulsos) madura antes que el córtex prefrontal (juicio y planificación). El adolescente no es irracional: es neurológicamente inmaduro de forma normal y temporal.',
        sinopsis: 'Jensen explica la neurociencia detrás del comportamiento adolescente con un lenguaje accesible, transformando la frustración en comprensión.', amazon: 'https://www.amazon.es/dp/8491872434?tag=lainferencia-21' },
      { frente: 'Siento que estoy transmitiendo mis miedos a mis hijos',
        libro: 'Padres conscientes', autor: 'Daniel J. Siegel y Mary Hartzell', estrellas: '4,5',
        ciencia: 'Los miedos parentales se transmiten a través de señales no verbales: tono de voz, contacto ocular, postura corporal. Los niños aprenden qué es «peligroso» observando principalmente las respuestas emocionales de sus cuidadores.',
        sinopsis: 'Siegel y Hartzell muestran cómo la historia emocional de los padres influye en los hijos, y cómo desarrollar la conciencia necesaria para romper esos ciclos.', amazon: 'https://www.amazon.es/dp/8466656944?tag=lainferencia-21' },
      { frente: 'Pongo límites pero no se cumplen',
        libro: 'Disciplina sin lágrimas', autor: 'Daniel J. Siegel y Tina Payne Bryson', estrellas: '4,6',
        ciencia: 'Los límites fallidos casi siempre se establecen en momentos de alta activación emocional del adulto, cuando el niño está menos receptivo. La neurociencia del aprendizaje muestra que los límites se interiorizan en estados de calma relacional.',
        sinopsis: 'Siegel y Bryson ofrecen un enfoque que combina firmeza y conexión emocional, demostrando que los límites más efectivos son los que no necesitan gritos.', amazon: 'https://www.amazon.es/s?k=Disciplina+sin+lagrimas+Siegel+Bryson&tag=lainferencia-21' }
    ],
    sueno: [
      { frente: 'No puedo apagar el cerebro cuando me acuesto',
        libro: 'Por qué dormimos', autor: 'Matthew Walker', estrellas: '4,7',
        ciencia: 'El insomnio de activación ocurre porque el córtex prefrontal no consigue inhibir la amígdala y la red de modo por defecto. La preocupación nocturna eleva el cortisol, hormona incompatible con el inicio del sueño.',
        sinopsis: 'Walker, neurocientífico de Berkeley, explica con datos por qué el sueño no es un lujo sino el sistema de mantenimiento más crítico de tu cerebro y tu salud.', amazon: 'https://www.amazon.es/dp/8412064526?tag=lainferencia-21' },
      { frente: 'Me despierto a las 3 de la madrugada y no puedo volver a dormirme',
        libro: 'Duerme', autor: 'Nick Littlehales', estrellas: '4,3',
        ciencia: 'El despertar a mitad de noche coincide con un ciclo ultradiaco de sueño ligero. El problema real no es el despertar sino la ansiedad secundaria que genera intentar forzar el retorno al sueño, lo que activa aún más el sistema nervioso.',
        sinopsis: 'El entrenador de sueño de atletas de élite como Cristiano Ronaldo comparte el sistema que usa en el deporte profesional para optimizar la recuperación nocturna.', amazon: 'https://www.amazon.es/dp/8408168630?tag=lainferencia-21' },
      { frente: 'Duermo 8 horas y sigo amaneciendo destrozado',
        libro: 'La solución del sueño', autor: 'W. Chris Winter', estrellas: '4,4',
        ciencia: 'La eficiencia del sueño importa más que la duración. Pasar muchas horas en cama fragmenta la presión de sueño acumulada (adenosina), generando noches superficiales aunque largas. La restricción controlada del tiempo en cama mejora la calidad.',
        sinopsis: 'Winter, especialista en medicina del sueño, explica por qué lo que cuentas como descanso quizás no te está reparando y cómo reajustar el sistema sin pastillas.', amazon: 'https://www.amazon.es/s?k=La+solucion+del+sueno+Winter&tag=lainferencia-21' },
      { frente: 'El estrés del día no me deja desconectar al llegar a casa',
        libro: 'Duerme bien para vivir mejor', autor: 'Eduard Estivill', estrellas: '4,2',
        ciencia: 'El estrés crónico mantiene elevado el cortisol durante la tarde-noche, bloqueando la secreción de melatonina en la glándula pineal. Sin ese descenso hormonal, el reloj circadiano no puede iniciar el proceso de sueño correctamente.',
        sinopsis: 'Estivill, el médico más consultado en España sobre sueño, da un método claro y progresivo para reeducar el ciclo vigilia-sueño sin medicación.', amazon: 'https://www.amazon.es/s?k=Duerme+bien+para+vivir+mejor+Estivill&tag=lainferencia-21' },
      { frente: 'Las pantallas hasta tarde me destrozan las mañanas',
        libro: 'Irresistible', autor: 'Adam Alter', estrellas: '4,4',
        ciencia: 'La luz azul LED suprime la melatonina hasta 3 horas (Harvard Medical School, 2015). Pero el efecto mayor es conductual: la hiperactivación dopaminérgica por scroll y notificaciones mantiene el sistema de recompensa activo de forma incompatible con el inicio del sueño.',
        sinopsis: 'Alter investiga la ciencia del diseño adictivo desde dentro. Entender cómo funciona es el primer paso para recuperar el control de tus noches.', amazon: 'https://www.amazon.es/dp/8449334020?tag=lainferencia-21' }
    ],
    ansiedad: [
      { frente: 'Siento que algo malo va a pasar aunque todo vaya bien',
        libro: 'Atrévete', autor: 'Barry McDonagh', estrellas: '4,6',
        ciencia: 'La ansiedad anticipatoria se mantiene por dos mecanismos: la evitación (que confirma al cerebro que el peligro era real) y la lucha contra el propio estado ansioso, que activa aún más el sistema de amenaza. Ambos retroalimentan el ciclo.',
        sinopsis: 'McDonagh propone una estrategia contraintuitiva basada en ACT: en lugar de combatir la ansiedad, acercarse a ella. Escrito desde su propia recuperación del trastorno de pánico.', amazon: 'https://www.amazon.es/s?k=Atrevete+ansiedad+Barry+McDonagh&tag=lainferencia-21' },
      { frente: 'Mi cuerpo reacciona antes de que yo entienda qué está pasando',
        libro: 'El cuerpo lleva la cuenta', autor: 'Bessel van der Kolk', estrellas: '4,8',
        ciencia: 'La amígdala procesa señales de amenaza 12 veces más rápido que el córtex prefrontal. La respuesta corporal (taquicardia, tensión, respiración acelerada) precede a la consciencia del estímulo; lo que el cuerpo registra no siempre llega al lenguaje.',
        sinopsis: 'Van der Kolk explica con décadas de investigación clínica por qué la ansiedad crónica y el trauma se alojan en el cuerpo, y cuáles son las vías de recuperación que realmente funcionan.', amazon: 'https://www.amazon.es/dp/8412067193?tag=lainferencia-21' },
      { frente: 'Me preocupo por cosas que sé que probablemente nunca van a pasar',
        libro: 'La trampa de la felicidad', autor: 'Russ Harris', estrellas: '4,4',
        ciencia: 'La mente produce en torno a 60.000 pensamientos diarios, la mayoría repetitivos y negativos. Este sesgo de negatividad tiene valor evolutivo, pero en entornos seguros mantiene al sistema nervioso en alerta permanente innecesaria.',
        sinopsis: 'Harris introduce la Terapia de Aceptación y Compromiso: no combatir los pensamientos ansiosos sino cambiar la relación que tienes con ellos, reduciendo su impacto sin necesidad de suprimirlos.', amazon: 'https://www.amazon.es/dp/8408261908?tag=lainferencia-21' },
      { frente: 'Los ataques de pánico me asustan más que el miedo en sí',
        libro: 'Adiós, ansiedad', autor: 'David D. Burns', estrellas: '4,5',
        ciencia: 'El pánico sigue un ciclo predecible: sensación física → catastrofización → más activación → más sensaciones. La interpretación catastrófica de síntomas benignos es el motor del ciclo (Clark, 1986), no las sensaciones corporales en sí.',
        sinopsis: 'Burns adapta la terapia cognitivo-conductual a un formato accesible y práctico: técnicas concretas para identificar y cortar el ciclo del pánico antes de que escale.', amazon: 'https://www.amazon.es/s?k=Adios+ansiedad+Burns+cognitivo&tag=lainferencia-21' },
      { frente: 'Me siento ansioso sin saber exactamente por qué',
        libro: 'Cuando el cuerpo dice no', autor: 'Gabor Maté', estrellas: '4,7',
        ciencia: 'La ansiedad difusa sin desencadenante aparente suele estar ligada al estrés crónico acumulado y a la desconexión emocional. Maté documenta cómo la supresión sistemática de emociones se convierte en una señal de estrés sostenido que el cuerpo termina expresando.',
        sinopsis: 'Maté conecta la biología del estrés con la historia emocional personal, mostrando cómo el cuerpo acaba hablando lo que la mente no ha procesado.', amazon: 'https://www.amazon.es/dp/8484458296?tag=lainferencia-21' }
    ],
    autoestima: [
      { frente: 'Me critico a mí mismo constantemente por cualquier error',
        libro: 'Autocompasión', autor: 'Kristin Neff', estrellas: '4,6',
        ciencia: 'La autocrítica activa el mismo sistema de amenaza que un ataque externo: libera cortisol y activa la amígdala. La autocompasión, en cambio, activa el sistema de cuidado, libera oxitocina y reduce la respuesta de estrés de forma medible.',
        sinopsis: 'Neff, investigadora de referencia mundial en autocompasión, demuestra que tratarse con amabilidad no es debilidad sino la base neurológica de la resiliencia y el rendimiento sostenido.', amazon: 'https://www.amazon.es/dp/8449331986?tag=lainferencia-21' },
      { frente: 'Necesito que los demás me aprueben para sentirme bien',
        libro: 'Los seis pilares de la autoestima', autor: 'Nathaniel Branden', estrellas: '4,5',
        ciencia: 'La dependencia de la validación externa está asociada a un locus de control externo y a niveles bajos de autoeficacia. Bandura mostró que la autoeficacia percibida predice el bienestar con más fiabilidad que el éxito objetivamente medido.',
        sinopsis: 'Branden construye el modelo más completo sobre autoestima disponible en español: no como algo que se tiene o no se tiene sino como algo que se practica con acciones diarias específicas.', amazon: 'https://www.amazon.es/dp/8449324750?tag=lainferencia-21' },
      { frente: 'Siento que no merezco lo bueno que me pasa',
        libro: 'El síndrome del impostor', autor: 'Jessamy Hibberd', estrellas: '4,4',
        ciencia: 'El síndrome del impostor es más prevalente en personas de alto rendimiento: cuanto más exigente el entorno, más se activan los mecanismos de comparación ascendente. La mente atribuye los éxitos al azar y los fracasos a deficiencias internas permanentes.',
        sinopsis: 'Hibberd examina la psicología del sentimiento de fraude y ofrece estrategias basadas en TCC para reconocer el patrón y recalibrar la narrativa interna.', amazon: 'https://www.amazon.es/dp/8419870145?tag=lainferencia-21' },
      { frente: 'Me comparo con los demás y siempre salgo perdiendo',
        libro: 'Mindset: la actitud del éxito', autor: 'Carol Dweck', estrellas: '4,7',
        ciencia: 'La comparación social ascendente constante está ligada al mindset fijo: cuando el éxito se atribuye a rasgos invariables, compararse genera amenaza identitaria directa. Dweck mostró que atribuir el progreso al esfuerzo reduce ese impacto drásticamente.',
        sinopsis: 'Dweck demuestra con 20 años de investigación que la diferencia entre quien crece y quien se estanca no es el talento: es la creencia sobre si ese talento puede cambiar.', amazon: 'https://www.amazon.es/dp/8416579164?tag=lainferencia-21' },
      { frente: 'Me cuesta aceptar un elogio sin restarlo o negarlo',
        libro: 'Amarse con los ojos abiertos', autor: 'Jorge Bucay y Silvia Salinas', estrellas: '4,3',
        ciencia: 'La dificultad para aceptar elogios está ligada a la disonancia cognitiva: el reconocimiento externo contradice el modelo interno negativo. El cerebro tiende a resolver esa contradicción descartando la información discordante antes que revisar la creencia.',
        sinopsis: 'Bucay aborda la relación con uno mismo como el eje del que parten todas las demás, con un lenguaje directo y accesible construido desde décadas de práctica clínica.', amazon: 'https://www.amazon.es/dp/6075570551?tag=lainferencia-21' }
    ],
    duelo: [
      { frente: 'He perdido a alguien importante y no sé cómo seguir',
        libro: 'El año del pensamiento mágico', autor: 'Joan Didion', estrellas: '4,5',
        ciencia: 'El duelo activa en el cerebro los mismos circuitos que el dolor físico. La búsqueda obsesiva de la persona perdida es una respuesta adaptativa del sistema de apego, no patología: el cerebro continúa ejecutando comportamientos de vinculación durante meses.',
        sinopsis: 'Didion narra con precisión clínica y literaria el año tras la muerte repentina de su marido, convirtiendo la experiencia más íntima en una descripción universal de cómo el duelo transforma la percepción de la realidad.', amazon: 'https://www.amazon.es/dp/8439729073?tag=lainferencia-21' },
      { frente: 'Una ruptura me tiene completamente paralizado',
        libro: 'Cómo curar un corazón roto', autor: 'Guy Winch', estrellas: '4,4',
        ciencia: 'El rechazo romántico activa el núcleo accumbens y la corteza cingulada anterior de la misma forma que la adicción. Cuando el cerebro ha construido un apego, su interrupción genera un proceso neurológico de abstinencia real.',
        sinopsis: 'Winch, psicólogo clínico, aplica ciencia al proceso de ruptura y da herramientas específicas para acortar el sufrimiento innecesario sin saltarse el proceso necesario.', amazon: 'https://www.amazon.es/s?k=Como+curar+un+corazon+roto+Guy+Winch&tag=lainferencia-21' },
      { frente: 'Un cambio importante me genera más pérdida que alivio',
        libro: 'Transiciones', autor: 'William Bridges', estrellas: '4,3',
        ciencia: 'Los cambios externos generan transiciones internas que siguen tres fases: final, zona neutral y nuevo inicio. Saltarse el cierre del final es la causa más frecuente de bloqueo ante el cambio, no la falta de adaptación o resiliencia.',
        sinopsis: 'Bridges distingue entre el cambio (lo que ocurre fuera) y la transición (lo que ocurre dentro), y explica por qué gestionar bien los finales es la única forma real de empezar algo nuevo.', amazon: 'https://www.amazon.es/s?k=Transiciones+William+Bridges&tag=lainferencia-21' },
      { frente: 'Sigo aferrado a algo que ya sé que no va a volver',
        libro: 'Desapegarse sin anestesia', autor: 'Walter Riso', estrellas: '4,5',
        ciencia: 'El apego patológico activa el sistema de amenaza cada vez que la mente anticipa la pérdida. La resistencia al cambio está mediada por el mismo circuito dopaminérgico que refuerza los hábitos: lo familiar es preferido aunque no sea beneficioso.',
        sinopsis: 'Riso analiza el apego desde la psicología cognitiva y da argumentos y herramientas para soltar sin que sea una rendición: sin anestesia emocional pero sin autocastigo.', amazon: 'https://www.amazon.es/dp/8408136658?tag=lainferencia-21' },
      { frente: 'Me cuesta aceptar que algo (o alguien) ya no está',
        libro: 'Sobre el duelo y el dolor', autor: 'Elisabeth Kübler-Ross', estrellas: '4,6',
        ciencia: 'Las etapas del duelo de Kübler-Ross (negación, ira, negociación, depresión, aceptación) no son lineales sino cíclicas. Bonanno mostró que la mayoría de personas son resilientes al duelo de forma natural, pero necesitan tiempo, permiso y comprensión del proceso.',
        sinopsis: 'La psiquiatra que revolucionó la comprensión occidental de la pérdida escribe sobre el duelo desde dentro, combinando la mirada clínica con la experiencia profundamente humana.', amazon: 'https://www.amazon.es/dp/8415864906?tag=lainferencia-21' }
    ],
    habitos: [
      { frente: 'Sé que debería mantener el hábito pero a la semana lo dejo',
        libro: 'Hábitos atómicos', autor: 'James Clear', estrellas: '4,8',
        ciencia: 'Los hábitos se forman mediante un bucle neurológico: señal, rutina, recompensa. Cada repetición mieliniza el circuito haciéndolo más automático. El problema no es la motivación sino el diseño del entorno que facilita o dificulta la señal de inicio.',
        sinopsis: 'El libro de hábitos más vendido de la última década. Clear explica que la diferencia no está en la fuerza de voluntad sino en hacer que el comportamiento correcto sea el más fácil.', amazon: 'https://www.amazon.es/dp/8418118032?tag=lainferencia-21' },
      { frente: 'Intento dejar un mal hábito pero vuelvo a él cuando estoy estresado',
        libro: 'El poder de los hábitos', autor: 'Charles Duhigg', estrellas: '4,6',
        ciencia: 'Los hábitos bajo estrés se vuelven más automáticos, no menos. El estrés reduce la actividad del córtex prefrontal y aumenta la dependencia del estriado, donde los hábitos están almacenados. Cambiar el hábito requiere cambiar la señal, no solo la respuesta.',
        sinopsis: 'Duhigg explica la neurociencia del bucle habitual y muestra por qué los hábitos negativos son tan resistentes al cambio voluntario, y cómo hackear el sistema desde dentro.', amazon: 'https://www.amazon.es/dp/8479538163?tag=lainferencia-21' },
      { frente: 'Empiezo con motivación y a los días ya no puedo más',
        libro: 'Pequeños hábitos', autor: 'BJ Fogg', estrellas: '4,5',
        ciencia: 'La motivación es un recurso que fluctúa con el sueño, el estrés y el estado emocional. Fogg demostró en Stanford que anclar un comportamiento nuevo a uno ya existente tiene una tasa de mantenimiento muy superior a depender de la motivación variable.',
        sinopsis: 'Fogg propone empezar ridículamente pequeño: el tamaño del comportamiento inicial determina si se convierte en hábito automático o se convierte en otra promesa rota.', amazon: 'https://www.amazon.es/dp/841769434X?tag=lainferencia-21' },
      { frente: 'Cojo el teléfono sin saber cómo llegué a él',
        libro: 'Enganchado', autor: 'Nir Eyal', estrellas: '4,4',
        ciencia: 'Las aplicaciones usan refuerzo de ratio variable, el mismo mecanismo que hace adictivas las tragaperras. El scroll infinito y las notificaciones están diseñadas para secuestrar el sistema dopaminérgico de búsqueda de novedad de forma específica e intencional.',
        sinopsis: 'Eyal explica cómo funciona el diseño adictivo desde dentro —fue el consultor que lo diseñó— y ahora escribe exactamente cómo recuperar el control de la atención.', amazon: 'https://www.amazon.es/s?k=Enganchado+Nir+Eyal+habitos&tag=lainferencia-21' },
      { frente: 'Cuando estoy solo recaigo en lo de siempre aunque no quiera',
        libro: 'La fuerza de voluntad', autor: 'Roy Baumeister y John Tierney', estrellas: '4,4',
        ciencia: 'El ego depletion (Baumeister, 1998) muestra que la fuerza de voluntad es un recurso que se agota con las decisiones sucesivas. Las recaídas vespertinas o solitarias no son falta de carácter: son el resultado predecible del agotamiento del sistema de autocontrol.',
        sinopsis: 'Baumeister, el mayor investigador en autocontrol del mundo, demuestra que la voluntad no es un rasgo de personalidad sino un recurso que puede gestionarse inteligentemente con estrategias concretas.', amazon: 'https://www.amazon.es/s?k=La+fuerza+de+la+voluntad+Baumeister+Tierney&tag=lainferencia-21' }
    ]
  };

  const SECTOR_LABEL = {
    productividad: 'Productividad', relaciones: 'Relaciones', finanzas: 'Finanzas',
    saludMental: 'Salud Mental', trabajo: 'Trabajo', autoconocimiento: 'Autoconocimiento', crianza: 'Crianza',
    sueno: 'Sueño', ansiedad: 'Ansiedad', autoestima: 'Autoestima', duelo: 'Duelo', habitos: 'Hábitos'
  };

  const SECTOR_ICONS = {
    productividad:    '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    relaciones:       '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    finanzas:         '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    saludMental:      '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>',
    trabajo:          '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
    autoconocimiento: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/>',
    crianza:          '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    sueno:            '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    ansiedad:         '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    autoestima:       '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    duelo:            '<line x1="12" y1="22" x2="12" y2="11"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5"/><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5"/>',
    habitos:          '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'
  };

  const BOTIQUIN_BADGES = {
    'Grit': 'Bestseller NYT',
    'Trabajo profundo': 'Bestseller NYT',
    'Comunicación no violenta': 'Referencia mundial en CNV',
    'Conversaciones cruciales': 'Bestseller NYT',
    'Los cuatro acuerdos': '+9 millones de lectores',
    'Pensar rápido, pensar despacio': 'Premio Nobel · Kahneman',
    'Influencia': 'Clásico de la psicología social',
    'El hombre más rico de Babilonia': 'Clásico desde 1926',
    'Inteligencia emocional': '+5 millones de lectores',
    'El hombre en busca de sentido': '+12 millones de lectores',
    'El cuerpo lleva la cuenta': 'Bestseller NYT',
    'Mindset: la actitud del éxito': '#1 en psicología positiva',
    'El poder de los introvertidos': 'Bestseller NYT',
    'El poder de la vulnerabilidad': '+6 millones de lectores',
    'Ikigai': 'Bestseller internacional',
    'Vinculados': 'Bestseller NYT',
    'Switch: cómo cambiar las cosas cuando el cambio es difícil': 'Bestseller NYT',
    'El cerebro del niño': '#1 en psicología infantil',
    'La generación ansiosa': 'Bestseller NYT 2024',
    'Por qué dormimos': '#1 en neurociencia del sueño',
    'Cuando el cuerpo dice no': 'Referencia en medicina psicosomática',
    'Autocompasión': '#1 en autocompasión',
    'Los seis pilares de la autoestima': 'Clásico de referencia',
    'El año del pensamiento mágico': 'Premio Pulitzer',
    'Hábitos atómicos': '#1 Bestseller mundial',
    'El poder de los hábitos': 'Bestseller NYT',
  };

  const grid       = document.getElementById('bq-grid');
  const tabsWrap   = document.getElementById('bq-tabs-wrap');
  const tabs       = document.querySelectorAll('.bq-tab');
  const resultsLbl = document.getElementById('bq-results-label');
  if (!grid || !tabs.length) return;

  let activeSector  = 'productividad';
  let searchActive  = false;

  function stars(rating) {
    const n = Math.round(parseFloat(rating.replace(',', '.')));
    return Array.from({ length: 5 }, (_, i) => i < n ? '★' : '☆').join('');
  }

  /* ── MODAL ¿QUÉ DICE LA CIENCIA? ── */
  const cienciaModal = document.createElement('div');
  cienciaModal.id = 'bq-ciencia-modal';
  cienciaModal.className = 'bq-modal-overlay';
  cienciaModal.setAttribute('hidden', '');
  cienciaModal.setAttribute('role', 'dialog');
  cienciaModal.setAttribute('aria-modal', 'true');
  cienciaModal.innerHTML = `
    <div class="bq-modal-card">
      <button class="bq-modal-close" id="bq-modal-close" aria-label="Cerrar">&#x2715;</button>
      <div class="bq-modal-science-label">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
        ¿Qué dice la ciencia?
      </div>
      <p class="bq-modal-book" id="bq-modal-book"></p>
      <p class="bq-modal-author" id="bq-modal-author"></p>
      <p class="bq-modal-ciencia-text" id="bq-modal-ciencia"></p>
    </div>`;
  document.body.appendChild(cienciaModal);

  /* Gradient defs compartido para todos los iconos de categoría */
  const _svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  _svgDefs.setAttribute('aria-hidden', 'true');
  _svgDefs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  _svgDefs.innerHTML = '<defs><linearGradient id="bq-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#6366F1"/></linearGradient></defs>';
  document.body.appendChild(_svgDefs);

  function openCienciaModal(item) {
    cienciaModal.querySelector('#bq-modal-book').textContent   = item.libro;
    cienciaModal.querySelector('#bq-modal-author').textContent = item.autor;
    cienciaModal.querySelector('#bq-modal-ciencia').textContent = item.ciencia;
    cienciaModal.removeAttribute('hidden');
    cienciaModal.querySelector('#bq-modal-close').focus();
  }
  function closeCienciaModal() { cienciaModal.setAttribute('hidden', ''); }

  cienciaModal.querySelector('#bq-modal-close').addEventListener('click', closeCienciaModal);
  cienciaModal.addEventListener('click', e => { if (e.target === cienciaModal) closeCienciaModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !cienciaModal.hasAttribute('hidden')) closeCienciaModal(); });

  /* Construye una tarjeta flip y devuelve el elemento DOM */
  function buildCard(item, sector) {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', item.frente);

    let currentItem   = item;
    let currentSector = sector;
    let _busy         = false;

    function getPool() {
      const result = [];
      Object.entries(BOTIQUIN_DATA).forEach(([s, its]) => {
        its.forEach(it => { if (it !== currentItem) result.push({ item: it, sector: s }); });
      });
      return result;
    }

    function update(newItem, newSector) {
      const newBadge = BOTIQUIN_BADGES[newItem.libro] || '';
      card.setAttribute('aria-label', newItem.frente);
      card.querySelector('.flip-front-sector').textContent = SECTOR_LABEL[newSector] || newSector;
      card.querySelector('.flip-front-q').textContent      = newItem.frente;
      const iconSvg = card.querySelector('.flip-front-icon-wrap svg');
      if (iconSvg) iconSvg.innerHTML = SECTOR_ICONS[newSector] || '';
      const coverEl = card.querySelector('.flip-card-cover');
      coverEl.src = newItem.imagen || '';
      if (newItem.imagen) coverEl.removeAttribute('hidden'); else coverEl.setAttribute('hidden', '');
      const badgeEl = card.querySelector('.flip-back-badge');
      badgeEl.querySelector('.flip-back-badge-text').textContent = newBadge;
      if (newBadge) badgeEl.removeAttribute('hidden'); else badgeEl.setAttribute('hidden', '');
      card.querySelector('.flip-back-book').textContent     = newItem.libro;
      card.querySelector('.flip-back-author').textContent   = newItem.autor;
      card.querySelector('.bq-stars').textContent           = stars(newItem.estrellas);
      card.querySelector('.bq-rating').textContent          = newItem.estrellas + ' / 5';
      card.querySelector('.flip-back-sinopsis').textContent = newItem.sinopsis;
      const cienciaBtn = card.querySelector('.flip-back-ciencia-btn');
      if (newItem.ciencia) cienciaBtn.removeAttribute('hidden'); else cienciaBtn.setAttribute('hidden', '');
      card.querySelector('.flip-back-btn').href = newItem.amazon || '#';
      currentItem   = newItem;
      currentSector = newSector;
    }

    const badge = BOTIQUIN_BADGES[item.libro] || '';
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front" aria-hidden="false">
          <div class="flip-front-header">
            <div class="flip-front-icon-wrap" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#bq-icon-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${SECTOR_ICONS[sector] || ''}</svg>
            </div>
            <span class="flip-front-sector">${SECTOR_LABEL[sector] || sector}</span>
          </div>
          <p class="flip-front-q">${item.frente}</p>
          <div class="flip-front-hint">
            <div class="flip-front-hint-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#bq-icon-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1"/><path d="m5.1 8-2.9-.8"/><path d="M14 4.1 12 6"/><path d="m6 12-1.9 2"/></svg>
            </div>
            <span>Clic para revelar la solución</span>
          </div>
        </div>
        <div class="flip-card-back" aria-hidden="true">
          <div class="flip-card-back-top">
            <img class="flip-card-cover" src="${item.imagen || ''}" alt="Portada de ${item.libro}" loading="lazy"${!item.imagen ? ' hidden' : ''}>
            <div class="flip-card-back-meta">
              <span class="flip-back-badge"${!badge ? ' hidden' : ''}>
                <svg class="flip-back-badge-star" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span class="flip-back-badge-text">${badge}</span>
              </span>
              <p class="flip-back-book">${item.libro}</p>
              <p class="flip-back-author">${item.autor}</p>
              <div class="flip-back-stars">
                <span class="bq-stars">${stars(item.estrellas)}</span>
                <span class="bq-rating">${item.estrellas} / 5</span>
              </div>
            </div>
          </div>
          <p class="flip-back-sinopsis">${item.sinopsis}</p>
          <button class="flip-back-ciencia-btn" type="button"${!item.ciencia ? ' hidden' : ''} aria-label="Ver qué dice la ciencia sobre este libro">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            ¿Qué dice la ciencia?
          </button>
          <div class="flip-back-actions">
            <a href="${item.amazon || '#'}" class="flip-back-btn" target="_blank" rel="noopener noreferrer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Ver precio en Amazon
            </a>
            <button class="flip-back-otro-btn" type="button">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
              No me convence, ver otro
            </button>
          </div>
        </div>
      </div>`;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.flip-back-btn'))         return;
      if (e.target.closest('.flip-back-ciencia-btn')) return;
      if (e.target.closest('.flip-back-otro-btn'))    return;
      if (_busy) return;
      _busy = true;
      const front     = card.querySelector('.flip-card-front');
      const back      = card.querySelector('.flip-card-back');
      const isFlipped = card.classList.toggle('is-flipped');
      front.setAttribute('aria-hidden', isFlipped ? 'true'  : 'false');
      back.setAttribute( 'aria-hidden', isFlipped ? 'false' : 'true');
      setTimeout(() => { _busy = false; }, 650);
    });

    card.querySelector('.flip-back-btn').addEventListener('click', e => {
      e.stopPropagation();
      if (e.currentTarget.getAttribute('href') === '#') e.preventDefault();
    });

    card.querySelector('.flip-back-ciencia-btn').addEventListener('click', e => {
      e.stopPropagation();
      openCienciaModal(currentItem);
    });

    card.querySelector('.flip-back-otro-btn').addEventListener('click', e => {
      e.stopPropagation();
      const pool = getPool();
      if (!pool.length) return;
      const { item: newItem, sector: newSector } = pool[Math.floor(Math.random() * pool.length)];
      if (card.classList.contains('is-flipped')) {
        const front = card.querySelector('.flip-card-front');
        const back  = card.querySelector('.flip-card-back');
        card.classList.remove('is-flipped');
        front.setAttribute('aria-hidden', 'false');
        back.setAttribute( 'aria-hidden', 'true');
        setTimeout(() => update(newItem, newSector), 350);
      } else {
        update(newItem, newSector);
      }
    });

    return card;
  }

  function showGrid(items, sector) {
    grid.innerHTML = '';
    grid.style.opacity = '0';
    items.forEach(item => grid.appendChild(buildCard(item, sector || item._sector)));
    requestAnimationFrame(() => {
      grid.style.transition = 'opacity 0.32s ease';
      grid.style.opacity    = '1';
    });
  }

  function renderSector(sector) {
    if (resultsLbl) resultsLbl.hidden = true;
    showGrid(BOTIQUIN_DATA[sector] || [], sector);
  }

  /* ── BUSCADOR POR SÍNTOMA ── */
  const searchInput = document.getElementById('bq-search');
  const searchClear = document.getElementById('bq-search-clear');

  function performSearch(query) {
    if (searchClear) searchClear.hidden = !query;

    if (!query) {
      searchActive = false;
      if (tabsWrap) tabsWrap.hidden = false;
      if (resultsLbl) resultsLbl.hidden = true;
      renderSector(activeSector);
      return;
    }

    searchActive = true;
    if (tabsWrap) tabsWrap.hidden = true;

    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const allItems = [];

    Object.entries(BOTIQUIN_DATA).forEach(([sector, items]) => {
      items.forEach(item => {
        const text = [item.frente, item.sinopsis, item.ciencia || ''].join(' ').toLowerCase();
        const score = words.filter(w => text.includes(w)).length;
        if (score > 0) allItems.push({ ...item, _sector: sector, _score: score });
      });
    });

    allItems.sort((a, b) => b._score - a._score);

    if (resultsLbl) {
      resultsLbl.hidden = false;
      resultsLbl.textContent = allItems.length
        ? `${allItems.length} resultado${allItems.length !== 1 ? 's' : ''} para «${query}»`
        : `Sin resultados para «${query}»`;
    }

    if (!allItems.length) {
      grid.innerHTML = '<p class="bq-no-results">Prueba con otras palabras: «ansiedad», «pareja», «dinero»…</p>';
      grid.style.opacity = '1';
      return;
    }

    showGrid(allItems, null);
  }

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => performSearch(searchInput.value.trim()), 180);
    });
    searchClear?.addEventListener('click', () => {
      searchInput.value = '';
      performSearch('');
      searchInput.focus();
    });
  }

  /* Cambio de sector */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      /* Si hay búsqueda activa, limpiarla */
      if (searchInput && searchInput.value) {
        searchInput.value = '';
        if (searchClear) searchClear.hidden = true;
        if (tabsWrap) tabsWrap.hidden = false;
      }

      const sector = tab.dataset.sector;
      if (sector === activeSector && !searchActive) return;
      activeSector  = sector;
      searchActive  = false;

      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      const count = BOTIQUIN_DATA[sector]?.length || 5;
      grid.innerHTML = Array(count).fill('<div class="bq-skeleton-card sk-pulse"></div>').join('');
      grid.style.transition = 'opacity 0.2s ease';
      grid.style.opacity = '0';
      setTimeout(() => renderSector(activeSector), 240);
    });
  });

  /* Render inicial */
  renderSector(activeSector);
}());


/* ── SISTEMA DE FAVORITOS ─────────────────────────────────────── */
(function () {
  const LS_KEY = 'li_favorites';

  /* ---- helpers localStorage ---- */
  function getFavs()    { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; } }
  function setFavs(arr) { lsSet(LS_KEY, JSON.stringify(arr)); }
  function isFav(id)    { return getFavs().includes(id); }
  function toggleFav(id) {
    const f = getFavs();
    const i = f.indexOf(id);
    if (i === -1) f.push(id); else f.splice(i, 1);
    setFavs(f);
    return i === -1; // true → ahora es favorito
  }

  /* ---- catálogo de ítems favoriteables ---- */
  const CATALOG = {
    'doc-analisis-lenguaje':  { type:'doc', badge:'Análisis del lenguaje', time:'7 min',
      title:'Cómo extraer información de una persona a través de cómo habla',
      author:'Miguel Noguer Escudero', pdf:'pdfs/documento3.pdf' },
    'doc-framing-cognitivo':  { type:'doc', badge:'Framing cognitivo', time:'7 min',
      title:'Análisis de la manipulación del lenguaje y su influencia en la toma de decisiones',
      author:'Miguel Noguer Escudero', pdf:'pdfs/documento1.pdf' },
    'doc-metafora-conceptual':{ type:'doc', badge:'Metáfora conceptual', time:'13 min',
      title:'Cómo el lenguaje metafórico manipula el razonamiento humano',
      author:'Miguel Noguer Escudero', pdf:'pdfs/documento2.pdf' },
    'dunning-kruger':  { type:'efecto', nombre:'Efecto Dunning-Kruger',     gancho:'Los que menos saben creen saber más.' },
    'halo':            { type:'efecto', nombre:'Efecto Halo',               gancho:'Una cualidad visible contamina tu percepción de todo lo demás.' },
    'confirmacion':    { type:'efecto', nombre:'Sesgo de Confirmación',     gancho:'Tu cerebro filtra la realidad para tener siempre razón.' },
    'placebo':         { type:'efecto', nombre:'Efecto Placebo',            gancho:'Creer que funciona lo hace funcionar de verdad.' },
    'bystander':       { type:'efecto', nombre:'Efecto Espectador',         gancho:'Cuantos más testigos, menos probabilidad de que alguien ayude.' },
    'retrospectiva':   { type:'efecto', nombre:'Sesgo de Retrospectiva',    gancho:'Tras conocer el resultado, siempre "lo sabías".' },
    'mera-exposicion': { type:'efecto', nombre:'Efecto de Mera Exposición', gancho:'Cuanto más ves algo, más te atrae sin razón aparente.' },
    'anclaje':         { type:'efecto', nombre:'Anclaje Cognitivo',         gancho:'El primer número que oyes decide todos los demás.' },
    'barnum':          { type:'efecto', nombre:'Efecto Barnum',             gancho:'Crees que una descripción genérica te define a ti en concreto.' },
    'disponibilidad':  { type:'efecto', nombre:'Sesgo de Disponibilidad',   gancho:'Lo que recuerdas fácilmente parece más probable que lo que no.' },
    'pigmalion':       { type:'efecto', nombre:'Efecto Pigmalión',          gancho:'Las expectativas de los demás sobre ti acaban cumpliéndose.' },
    'superviviente':   { type:'efecto', nombre:'Sesgo del Superviviente',   gancho:'Solo ves los éxitos porque los fracasos no cuentan su historia.' },
    'autoservicio':    { type:'efecto', nombre:'Sesgo de Autoservicio',     gancho:'Tus éxitos son tuyos; tus fracasos, culpa de las circunstancias.' },
    'primacia':        { type:'efecto', nombre:'Efecto de Primacía',        gancho:'Lo primero que aprendes de alguien domina todo lo que viene después.' },
    'optimismo':       { type:'efecto', nombre:'Sesgo de Optimismo',        gancho:'Tu cerebro cree que los malos eventos le ocurren a los demás, no a ti.' },
    'bandwagon':       { type:'efecto', nombre:'Efecto Bandwagon',          gancho:'Cuanta más gente cree algo, más probable te parece que sea verdad.' },
    'status-quo':      { type:'efecto', nombre:'Sesgo del Statu Quo',       gancho:'Cambiar duele más que seguir igual, aunque seguir igual sea peor.' },
    'efecto-espejo':   { type:'efecto', nombre:'Efecto Espejo',             gancho:'Imitar inconscientemente al otro genera confianza y empatía inmediata.' }
  };

  /* ---- Añadir artículos semanales y de biblioteca al catálogo ---- */
  WEEKLY_ARTICLES.forEach(a => {
    CATALOG['weekly-' + a.week] = { type:'weekly', week:a.week, badge:a.badge, title:a.title, authorName:a.author.name, readingTime:a.readingTime, date:a.date };
  });
  Object.entries(LIBRARY_ARTICLES).forEach(([cat, arts]) => {
    arts.forEach(art => {
      CATALOG['lib-' + art.id] = { type:'lib', id:art.id, cat, badge:art.badge, title:art.title, authorName:art.author.name, readingTime:art.readingTime };
    });
  });

  /* ---- SVG corazón reutilizable ---- */
  function heartSVG(filled) {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  }

  /* ---- crear botón de corazón ---- */
  function makeFavBtn(id, extraClass) {
    const faved = isFav(id);
    const btn   = document.createElement('button');
    btn.className   = `fav-btn${faved ? ' active' : ''}${extraClass ? ' ' + extraClass : ''}`;
    btn.dataset.favId = id;
    btn.setAttribute('aria-label', faved ? 'Quitar de favoritos' : 'Guardar en favoritos');
    btn.title   = faved ? 'Quitar de favoritos' : 'Guardar en favoritos';
    btn.innerHTML = heartSVG(faved);

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const nowFaved = toggleFav(id);
      syncFavBtns(id, nowFaved);
      renderFavSection();
      if (window._LI_updateFavBadge) window._LI_updateFavBadge();
    });
    return btn;
  }

  /* ---- sincronizar todos los botones del mismo id ---- */
  function syncFavBtns(id, isFaved) {
    document.querySelectorAll(`.fav-btn[data-fav-id="${id}"]`).forEach(b => {
      b.classList.toggle('active', isFaved);
      b.innerHTML = heartSVG(isFaved);
      b.setAttribute('aria-label', isFaved ? 'Quitar de favoritos' : 'Guardar en favoritos');
      b.title = isFaved ? 'Quitar de favoritos' : 'Guardar en favoritos';
    });
  }

  /* ---- inyectar botones en tarjetas de documentos ---- */
  function initDocBtns() {
    [
      { sel: '.doc-card.doc-featured',              id: 'doc-analisis-lenguaje'   },
      { sel: '#docs-grid-2 .doc-card:first-child',  id: 'doc-framing-cognitivo'   },
      { sel: '#docs-grid-2 .doc-card:last-child',   id: 'doc-metafora-conceptual' }
    ].forEach(({ sel, id }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.dataset.favId = id;
      el.appendChild(makeFavBtn(id, 'fav-btn--doc'));
    });
  }

  /* ---- inyectar botones en tarjetas de efectos ---- */
  function initEfectoBtns() {
    document.querySelectorAll('.efecto-card[data-efecto]').forEach(card => {
      card.appendChild(makeFavBtn(card.dataset.efecto, 'fav-btn--efecto'));
    });
  }

  /* ---- renderizar la sección Tus Favoritos ---- */
  function renderFavSection() {
    const section   = document.getElementById('favoritos-section');
    const container = document.getElementById('favoritos-container');
    const empty     = document.getElementById('favoritos-empty');
    if (!section || !container) return;

    const favs = getFavs().filter(id => CATALOG[id]);

    // NOTE: En el futuro, mapear las categorías de los favoritos a libros
    // recomendados: CATALOG_BOOKS[item.category] → título + ISBN.
    // Los type='doc' apuntan a psicología del lenguaje/cognición;
    // los type='efecto' a psicología cognitiva y conductual.

    if (favs.length === 0) {
      container.innerHTML = '';
      section.hidden = false;
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    section.hidden = false;
    container.innerHTML = '';

    favs.forEach(id => {
      const item = CATALOG[id];
      const card = document.createElement('div');
      card.className = 'fav-item-card';

      const removeBtn = `<button class="fav-btn active fav-btn--fav-list" data-fav-id="${id}" aria-label="Quitar de favoritos" title="Quitar">${heartSVG(true)}</button>`;

      if (item.type === 'doc') {
        card.innerHTML = `
          <div class="fav-item-top"><span class="doc-badge">${item.badge}</span>${removeBtn}</div>
          <h3 class="fav-item-title">${item.title}</h3>
          <p class="fav-item-sub">${item.author} · ${item.time} de lectura</p>
          <a href="${item.pdf}" class="fav-item-cta" download>↓ Descargar PDF</a>`;

      } else if (item.type === 'efecto') {
        card.innerHTML = `
          <div class="fav-item-top"><span class="doc-badge">Sesgo / Efecto</span>${removeBtn}</div>
          <h3 class="fav-item-title">${item.nombre}</h3>
          <p class="fav-item-sub">${item.gancho}</p>
          <button class="fav-item-cta fav-efecto-open" data-efecto="${id}">Ver efecto →</button>`;

      } else if (item.type === 'weekly') {
        card.innerHTML = `
          <div class="fav-item-top"><span class="doc-badge">${item.badge}</span>${removeBtn}</div>
          <h3 class="fav-item-title">${item.title}</h3>
          <p class="fav-item-sub">${item.authorName} · ${item.date}</p>
          <button class="fav-item-cta fav-weekly-open" data-week="${item.week}">Leer artículo →</button>`;

      } else if (item.type === 'lib') {
        card.innerHTML = `
          <div class="fav-item-top"><span class="doc-badge">${item.badge}</span>${removeBtn}</div>
          <h3 class="fav-item-title">${item.title}</h3>
          <p class="fav-item-sub">${item.authorName} · ${item.readingTime} de lectura</p>
          <button class="fav-item-cta fav-lib-open" data-id="${item.id}" data-cat="${item.cat}">Leer artículo →</button>`;
      }

      container.appendChild(card);
    });

    /* Quitar de favoritos */
    container.querySelectorAll('.fav-btn--fav-list').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        toggleFav(btn.dataset.favId);
        syncFavBtns(btn.dataset.favId, false);
        renderFavSection();
      });
    });

    /* Abrir efecto */
    container.querySelectorAll('.fav-efecto-open').forEach(btn => {
      btn.addEventListener('click', () => { if (window._LI_openEfecto) window._LI_openEfecto(btn.dataset.efecto); });
    });

    /* Abrir artículo semanal */
    container.querySelectorAll('.fav-weekly-open').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('[data-tab="semana"]')?.click();
        setTimeout(() => { if (window._LI_renderWeekly) window._LI_renderWeekly(parseInt(btn.dataset.week)); }, 60);
      });
    });

    /* Abrir artículo de biblioteca */
    container.querySelectorAll('.fav-lib-open').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('[data-tab="biblioteca"]')?.click();
        setTimeout(() => { if (window._LI_openLibArticle) window._LI_openLibArticle(btn.dataset.id, btn.dataset.cat); }, 60);
      });
    });
  }

  /* ---- Delegación global para fav-btn-dyn (artículos renderizados dinámicamente) ---- */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.fav-btn-dyn');
    if (!btn) return;
    e.stopPropagation();
    const id = btn.dataset.favId;
    if (!id) return;
    const nowFaved = toggleFav(id);
    syncFavBtns(id, nowFaved);
    renderFavSection();
    if (window._LI_updateFavBadge) window._LI_updateFavBadge();
  });

  /* ---- Exponer catálogo para el panel del navbar ---- */
  window._LI_CATALOG = CATALOG;

  /* ---- init ---- */
  initDocBtns();
  initEfectoBtns();
  renderFavSection();

  /* actualizar al activar "Por Intereses" */
  document.querySelectorAll('.tab-btn[data-tab="biblioteca"]').forEach(b =>
    b.addEventListener('click', () => setTimeout(renderFavSection, 40))
  );
}());


/* ── COMPARTIR ARTÍCULO (delegado — botones generados dinámicamente) ── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.article-share-btn');
  if (!btn) return;
  const title = btn.dataset.shareTitle || document.title;
  const text  = btn.dataset.shareText  || '';
  shareContenido(title, text, window.location.href);
});

/* ── COMPARTIR + DEEP LINK POR URL ───────────────────────────── */
(function () {
  const shareBtn = document.getElementById('efecto-share-btn');
  const tooltip  = document.getElementById('share-tooltip');
  let shareTimer = null;

  /* ---- copiar enlace con parámetro ?efecto=id ---- */
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const id = window._LI_currentEfecto;
      if (!id) return;

      const url = new URL(window.location.href);
      url.searchParams.set('efecto', id);
      const link = url.toString();

      function onCopied() {
        if (!tooltip) return;
        tooltip.classList.add('visible');
        clearTimeout(shareTimer);
        shareTimer = setTimeout(() => tooltip.classList.remove('visible'), 1500);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(link).then(onCopied).catch(onCopied);
      } else {
        const ta = document.createElement('textarea');
        ta.value = link;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
        onCopied();
      }
    });
  }

  /* ---- auto-abrir modal si la URL incluye ?efecto=id (formato legacy) ---- */
  const legacyEfecto = new URLSearchParams(window.location.search).get('efecto');
  if (legacyEfecto) {
    const tryOpen = () => { if (window._LI_openEfecto) window._LI_openEfecto(legacyEfecto); };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(tryOpen, 450));
    } else {
      setTimeout(tryOpen, 450);
    }
  }
}());

/* ── URL DEEP-LINKING — leer parámetros al cargar ─────────────── */
(function () {
  const p = new URLSearchParams(window.location.search);
  const v = p.get('v');
  if (!v) return;

  function tryNavigate() {
    if (v === 'efecto' && p.get('id')) {
      if (window._LI_openEfecto) window._LI_openEfecto(p.get('id'));

    } else if (v === 'semana' && p.get('n')) {
      const n = parseInt(p.get('n'));
      document.querySelector('.tab-btn[data-tab="semana"]')?.click();
      setTimeout(() => { if (window._LI_renderWeekly) window._LI_renderWeekly(n); }, 120);

    } else if (v === 'art' && p.get('id') && p.get('cat')) {
      document.querySelector('.tab-btn[data-tab="biblioteca"]')?.click();
      const cat = p.get('cat');
      setTimeout(() => {
        document.querySelector(`.cat-btn[data-cat="${cat}"]`)?.click();
        setTimeout(() => {
          if (window._LI_openLibArticle) window._LI_openLibArticle(p.get('id'), cat);
        }, 120);
      }, 80);

    } else if (v === 'glosario' && p.get('t')) {
      /* Se activará cuando el glosario esté implementado */
      window._LI_pendingGlosario = p.get('t');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(tryNavigate, 500));
  } else {
    setTimeout(tryNavigate, 500);
  }

  /* Botón atrás del navegador */
  window.addEventListener('popstate', e => {
    const st = e.state;
    if (!st) return;
    if (st.v === 'efecto' && st.id && window._LI_openEfecto) window._LI_openEfecto(st.id);
  });
}());


/* ══════════════════════════════════════════════════════════════
   GLOSARIO DE PSICOLOGÍA
══════════════════════════════════════════════════════════════ */
const GLOSARIO = [
  { id:'anclaje', termino:'Sesgo de Anclaje', letra:'A', categoria:'Psicología Cognitiva', definicion:'Tendencia a apoyarse desproporcionadamente en el primer dato recibido para tomar decisiones posteriores. Una vez establecida esa referencia inicial, todos los ajustes siguientes orbitan alrededor de ella, incluso cuando el ancla es arbitraria o irrelevante.', origen:'Tversky & Kahneman, 1974 — experimentos de ruleta numérica', ejemplo:'Un vendedor que menciona primero el precio original de 1.000 € logra que el descuento a 650 € parezca una ganga, aunque el precio justo sea 400 €.', relacionados:['disponibilidad','status-quo','confirmacion'] },
  { id:'apego', termino:'Teoría del Apego', letra:'A', categoria:'Psicología del Desarrollo', definicion:'Sistema motivacional innato que impulsa a los niños a buscar proximidad con sus cuidadores en situaciones de amenaza. Los patrones de respuesta del cuidador forman un "modelo interno de trabajo" que guía las expectativas relacionales durante toda la vida.', origen:'John Bowlby, 1969 — Mary Ainsworth formalizó los tipos de apego (1978)', ejemplo:'Un adulto con apego ansioso necesita constante reafirmación de su pareja porque de niño experimentó cuidado inconsistente.', relacionados:['autoservicio','pigmalion','efecto-espejo'] },
  { id:'atribucion-fundamental', termino:'Error Fundamental de Atribución', letra:'E', categoria:'Psicología Social', definicion:'Tendencia sistemática a explicar el comportamiento ajeno en términos de rasgos de personalidad e ignorar los factores situacionales, mientras que para el propio comportamiento se hace exactamente lo contrario.', origen:'Lee Ross, 1977 — Universidad de Stanford', ejemplo:'Cuando alguien llega tarde asumes que es irresponsable; cuando llegas tú, lo atribuyes al tráfico.', relacionados:['autoservicio','halo','confirmacion'] },
  { id:'autocompasion', termino:'Autocompasión', letra:'A', categoria:'Psicología Positiva', definicion:'Capacidad de relacionarse con el propio sufrimiento y fracaso con la misma amabilidad que se ofrecería a un amigo. Comprende amabilidad hacia uno mismo, reconocimiento de la humanidad compartida y mindfulness.', origen:'Kristin Neff, 2003 — Universidad de Texas en Austin', ejemplo:'Tras cometer un error en el trabajo, en lugar de la autocrítica destructiva, reconoces que equivocarse es humano y te preguntas qué puedes aprender.', relacionados:['resiliencia','optimismo','status-quo'] },
  { id:'autoservicio', termino:'Sesgo de Autoservicio', letra:'S', categoria:'Psicología Cognitiva', definicion:'Tendencia a atribuir los éxitos a factores internos (habilidad, esfuerzo) y los fracasos a factores externos (mala suerte, dificultad). El mecanismo protege la autoestima a costa de impedir el aprendizaje real de los errores.', origen:'Constructo consolidado por Miller & Ross (1975)', ejemplo:'Un estudiante que aprueba un examen difícil concluye que es brillante; si lo suspende, el examen era injusto.', relacionados:['confirmacion','retrospectiva','dunning-kruger'] },
  { id:'bandwagon', termino:'Efecto Bandwagon', letra:'E', categoria:'Psicología Social', definicion:'Tendencia a adoptar creencias o comportamientos porque otras personas lo hacen, independientemente de la evidencia. La popularidad de una opción actúa como señal de su corrección.', origen:'Formalizado en psicología por Leibenstein (1950)', ejemplo:'Un restaurante vacío recibe menos clientes que uno lleno con críticas mediocres; la cola en sí misma es señal de calidad.', relacionados:['disponibilidad','status-quo','mera-exposicion'] },
  { id:'barnum', termino:'Efecto Barnum', letra:'E', categoria:'Psicología Cognitiva', definicion:'Tendencia a aceptar descripciones de personalidad vagas y generales como si fueran específicamente precisas para uno mismo. Sustenta la credibilidad percibida de la astrología y los tests superficiales.', origen:'Bertram Forer, 1949 — experimento con estudiantes universitarios', ejemplo:'Lees tu horóscopo —"Eres una persona profunda que a veces duda de sí misma"— y sientes que te describe con precisión asombrosa.', relacionados:['confirmacion','halo','dunning-kruger'] },
  { id:'bystander', termino:'Efecto Bystander', letra:'E', categoria:'Psicología Social', definicion:'Fenómeno por el que la probabilidad de que un individuo ayude a una víctima disminuye a medida que aumenta el número de testigos presentes. La difusión de responsabilidad y la ignorancia pluralista producen la paradoja de que más observadores resultan en menos ayuda.', origen:'Darley & Latané, 1968 — motivados por el caso del asesinato de Kitty Genovese en Nueva York (1964)', ejemplo:'Una persona se desmaya en un metro lleno y nadie actúa porque todos asumen que alguien más lo hará; en un vagón vacío, la misma persona recibiría ayuda inmediata.', relacionados:['optimismo','autoservicio','bandwagon'] },
  { id:'burnout', termino:'Síndrome de Burnout', letra:'S', categoria:'Psicología Clínica', definicion:'Estado de agotamiento físico, emocional y mental derivado del estrés laboral crónico no gestionado. Se caracteriza por agotamiento emocional, despersonalización y reducción del sentido de eficacia personal.', origen:'Herbert Freudenberger, 1974; operacionalizado por Christina Maslach (1981)', ejemplo:'Un médico con alta vocación que, tras años de turnos excesivos, llega a ver a los pacientes como obstáculos.', relacionados:['autoservicio','resiliencia','status-quo'] },
  { id:'condicionamiento', termino:'Condicionamiento Clásico', letra:'C', categoria:'Psicología del Aprendizaje', definicion:'Proceso de aprendizaje asociativo por el que un estímulo neutro adquiere la capacidad de producir una respuesta tras ser emparejado repetidamente con un estímulo que ya produce dicha respuesta de forma natural.', origen:'Ivan Pavlov, 1897 — descubierto en experimentos sobre digestión canina', ejemplo:'El sonido de un anuncio musical activa antojo del producto asociado aunque no tengas hambre, por el emparejamiento repetido.', relacionados:['mera-exposicion','disponibilidad'] },
  { id:'conformidad', termino:'Conformidad Social', letra:'C', categoria:'Psicología Social', definicion:'Cambio en el comportamiento o las creencias de un individuo como resultado de la presión real o imaginada del grupo. Puede derivar de la necesidad de aceptación o de la creencia en que el grupo tiene información superior.', origen:'Solomon Asch, 1951 — experimentos de comparación de líneas', ejemplo:'En una reunión, todos asienten a una propuesta deficiente porque el primero en hablar lo hizo con confianza.', relacionados:['bystander','bandwagon','status-quo'] },
  { id:'cortex-prefrontal', termino:'Corteza Prefrontal', letra:'C', categoria:'Neuropsicología', definicion:'Región anterior del lóbulo frontal responsable de las funciones ejecutivas: planificación, toma de decisiones, control de impulsos y regulación de la conducta social. Su maduración completa no se produce hasta los 25 años.', origen:'Relevancia establecida por lesiones (Phineas Gage, 1848) y neuroimagen (1990-2000)', ejemplo:'Un adolescente actúa impulsivamente ante un riesgo que un adulto evitaría porque su corteza prefrontal todavía no ha madurado.', relacionados:['burnout','condicionamiento','disponibilidad'] },
  { id:'disonancia', termino:'Disonancia Cognitiva', letra:'D', categoria:'Psicología Cognitiva', definicion:'Estado de tensión mental que surge cuando se mantienen dos cogniciones mutuamente contradictorias, o cuando la conducta entra en conflicto con las creencias. El malestar motiva cambios para restaurar la coherencia interna.', origen:'Leon Festinger, 1957 — experimento de los puzzles aburridos', ejemplo:'Un fumador que conoce los datos sobre el cáncer de pulmón se convence de que los estudios están exagerados.', relacionados:['confirmacion','autoservicio'] },
  { id:'dopamina', termino:'Dopamina y Sistema de Recompensa', letra:'D', categoria:'Neuropsicología', definicion:'La dopamina regula la motivación, el placer y el aprendizaje por refuerzo. El sistema mesolímbico dopaminérgico codifica no el placer en sí, sino la predicción y la señal de novedad de las recompensas.', origen:'Arvid Carlsson (Premio Nobel 2000); Schultz, Dayan & Montague (1997)', ejemplo:'Las notificaciones del móvil generan dopamina no porque el mensaje sea importante, sino por la incertidumbre de si lo será.', relacionados:['condicionamiento','burnout','status-quo'] },
  { id:'dunning-kruger', termino:'Efecto Dunning-Kruger', letra:'E', categoria:'Psicología Cognitiva', definicion:'Los individuos con escaso conocimiento sobrestiman sistemáticamente su competencia porque carecen de la metacognición necesaria para reconocer sus propias limitaciones. A la vez, los expertos tienden a subestimar su competencia.', origen:'David Dunning & Justin Kruger, 1999 — Universidad de Cornell', ejemplo:'Alguien que ha leído un artículo sobre inversión en bolsa se siente preparado para superar a gestores profesionales.', relacionados:['confirmacion','autoservicio','retrospectiva'] },
  { id:'efecto-espejo', termino:'Efecto Espejo / Neuronas Espejo', letra:'E', categoria:'Neuropsicología', definicion:'Las neuronas espejo se activan tanto cuando se ejecuta una acción como cuando se observa a otro realizarla. Este sistema es el sustrato neurológico de la empatía, la imitación y la comprensión de las intenciones ajenas.', origen:'Giacomo Rizzolatti et al., 1992 — Universidad de Parma', ejemplo:'Ver a alguien morder un limón en televisión activa en el observador las mismas regiones motoras orales.', relacionados:['condicionamiento','conformidad','apego'] },
  { id:'enmarque', termino:'Efecto de Enmarque (Framing)', letra:'E', categoria:'Psicología Cognitiva', definicion:'La misma información genera decisiones distintas dependiendo de cómo se presenta. Describir una cirugía con "90% de supervivencia" o "10% de mortalidad" son matemáticamente idénticos pero producen tasas de aceptación muy diferentes.', origen:'Tversky & Kahneman, 1981 — problema de la enfermedad asiática, publicado en Science', ejemplo:'El mismo yogur se vende más etiquetado como "95% sin grasa" que como "con 5% de grasa", aunque el producto sea idéntico.', relacionados:['anclaje','status-quo','optimismo'] },
  { id:'extinction', termino:'Extinción y Recuperación Espontánea', letra:'E', categoria:'Psicología del Aprendizaje', definicion:'La extinción es la desaparición de una respuesta condicionada cuando el estímulo condicionado se presenta repetidamente sin el estímulo incondicionado. Sin embargo, la respuesta extinguida puede reaparecer espontáneamente después de un período de descanso, lo que indica que el aprendizaje original no se borra sino que se inhibe.', origen:'Ivan Pavlov, 1927; la recuperación espontánea fue uno de los hallazgos más sorprendentes del programa pavloviano', ejemplo:'Un fóbico que supera su miedo a los perros con terapia puede experimentar una reaparición del miedo años después en una situación de estrés.', relacionados:['condicionamiento','resiliencia'] },
  { id:'flujo', termino:'Estado de Flujo', letra:'E', categoria:'Psicología Positiva', definicion:'Estado de concentración óptima donde la conciencia del yo desaparece, el tiempo se distorsiona y la actividad se experimenta como intrínsecamente gratificante. Ocurre cuando el desafío y la habilidad son ambos altos y perfectamente equilibrados.', origen:'Mihaly Csikszentmihalyi, 1975 — Universidad de Chicago', ejemplo:'Un programador que lleva cuatro horas resolviendo un problema complejo sin notar el paso del tiempo está en estado de flujo.', relacionados:['burnout','dopamina','autoservicio'] },
  { id:'fobia', termino:'Fobia Específica', letra:'F', categoria:'Psicología Clínica', definicion:'Miedo intenso, persistente y desproporcionado a un objeto o situación específica que produce evitación activa e interferencia con la vida cotidiana, aunque la persona reconozca que el peligro es irracional.', origen:'Término formalizado por Westphal (1872); bases conductuales por Watson (1920)', ejemplo:'Una persona con aracnofobia severa reorganiza su vida para evitar cualquier posibilidad de encontrar arañas.', relacionados:['condicionamiento','disponibilidad'] },
  { id:'halo', termino:'Efecto Halo', letra:'E', categoria:'Psicología Social', definicion:'Tendencia a que una impresión positiva en un atributo de una persona se extienda a todos los demás. Una característica sobresaliente —el atractivo físico, la elocuencia, la primera impresión— contamina el juicio sobre capacidades completamente independientes.', origen:'Edward Thorndike, 1920 — primeras evaluaciones militares', ejemplo:'Un candidato atractivo es calificado como más inteligente y honesto que uno igualmente competente con peor presencia.', relacionados:['confirmacion','barnum','primacia'] },
  { id:'indefension', termino:'Indefensión Aprendida', letra:'I', categoria:'Psicología Clínica', definicion:'Estado en el que un individuo que ha experimentado repetidamente situaciones dolorosas incontrolables deja de intentar escapar, incluso cuando las circunstancias cambian y la acción sería posible y eficaz.', origen:'Martin Seligman & Steven Maier, 1967 — Universidad de Pennsylvania', ejemplo:'Un trabajador que ha visto rechazadas todas sus propuestas durante años deja de proponer ideas nuevas aunque cambie el equipo directivo.', relacionados:['resiliencia','optimismo','burnout'] },
  { id:'inteligencia-emocional', termino:'Inteligencia Emocional', letra:'I', categoria:'Psicología Positiva', definicion:'Capacidad de percibir, usar, comprender y gestionar las emociones propias y ajenas de forma adaptativa. En el modelo de Mayer y Salovey incluye percepción emocional, facilitación del pensamiento, comprensión y regulación emocional.', origen:'Mayer & Salovey, 1990; popularizado por Daniel Goleman (1995)', ejemplo:'Un directivo con alta IE detecta la tensión no expresada en su equipo antes de que explote y aborda la situación preventivamente.', relacionados:['apego','efecto-espejo','resiliencia'] },
  { id:'mecanismos-defensa', termino:'Mecanismos de Defensa', letra:'M', categoria:'Psicología Psicoanalítica', definicion:'Estrategias psicológicas inconscientes que el yo utiliza para protegerse de la ansiedad generada por impulsos, conflictos internos o amenazas externas. Pueden ser maduros (sublimación, humor) o inmaduros (proyección, negación).', origen:'Sigmund Freud, 1894; sistematizados por Anna Freud (1936)', ejemplo:'Una persona que siente envidia intensa hacia un colega la niega y lo critica constantemente por razones superficiales.', relacionados:['disonancia','proyeccion'] },
  { id:'memoria-trabajo', termino:'Memoria de Trabajo', letra:'M', categoria:'Neuropsicología', definicion:'Sistema cognitivo de capacidad limitada que mantiene y manipula activamente la información durante breves períodos. Su capacidad promedio es de 7 ± 2 elementos (Miller) o solo 4 chunks (Cowan), y es el cuello de botella del procesamiento consciente.', origen:'Baddeley & Hitch, 1974 — modelo del bucle fonológico y ejecutivo central', ejemplo:'Intentar hacer cálculos mentales complejos mientras mantienes una conversación resulta imposible porque ambas tareas compiten por el mismo recurso limitado.', relacionados:['cortex-prefrontal','flujo','dopamina'] },
  { id:'mentalidad-crecimiento', termino:'Mentalidad de Crecimiento', letra:'M', categoria:'Psicología Educativa', definicion:'Creencia de que las capacidades y la inteligencia son cualidades maleables que pueden desarrollarse mediante el esfuerzo y las estrategias adecuadas. Su opuesto, la mentalidad fija, concibe las capacidades como rasgos innatos e inmutables.', origen:'Carol Dweck, 1986 — Universidad de Stanford', ejemplo:'Un estudiante con mentalidad de crecimiento interpreta un suspenso como información sobre qué necesita aprender, no como evidencia de que no es inteligente.', relacionados:['indefension','optimismo','dunning-kruger'] },
  { id:'mera-exposicion', termino:'Efecto de Mera Exposición', letra:'E', categoria:'Psicología Cognitiva', definicion:'La exposición repetida a un estímulo aumenta la actitud positiva hacia él, incluso sin ningún refuerzo consciente. El mero contacto genera familiaridad y la familiaridad genera preferencia, independientemente de la calidad objetiva del estímulo.', origen:'Robert Zajonc, 1968 — experimentos con ideogramas chinos', ejemplo:'Una canción que te pareció mediocre la primera vez se convierte en favorita tras varias semanas de escucharla.', relacionados:['disponibilidad','bandwagon','confirmacion'] },
  { id:'mindfulness', termino:'Mindfulness (Atención Plena)', letra:'M', categoria:'Psicología Clínica', definicion:'Estado de conciencia que surge al prestar atención de forma intencional al momento presente, sin emitir juicios. En contexto clínico, tiene eficacia establecida para la reducción del estrés, la prevención de recaídas en depresión y el tratamiento del dolor crónico.', origen:'Jon Kabat-Zinn, 1979 — adaptación de prácticas contemplativas al contexto médico secular', ejemplo:'Comer una fruta prestando atención completa a su textura, sabor y aroma sin pensar en otra cosa es la forma más básica de mindfulness.', relacionados:['autocompasion','flujo','cortex-prefrontal'] },
  { id:'optimismo', termino:'Sesgo de Optimismo', letra:'S', categoria:'Psicología Cognitiva', definicion:'Tendencia sistemática a creer que uno tiene menos probabilidades de experimentar eventos negativos y más de experimentar positivos que la media. Afecta a aproximadamente el 80% de la población.', origen:'Neil Weinstein, 1980; Tali Sharot consolidó las bases neurológicas (2011)', ejemplo:'La mayoría de los conductores se considera por encima de la media en seguridad, lo que es matemáticamente imposible pero estadísticamente universal.', relacionados:['autoservicio','dunning-kruger','disponibilidad'] },
  { id:'pigmalion', termino:'Efecto Pigmalión', letra:'E', categoria:'Psicología Social', definicion:'Las expectativas que otros tienen sobre una persona moldean el rendimiento real de esa persona mediante el trato diferencial que generan. Cuando alguien es tratado como competente, tiende a volverse más competente.', origen:'Rosenthal & Jacobson, 1968 — experimento "Pygmalion in the Classroom"', ejemplo:'Los alumnos sobre quienes el maestro tiene altas expectativas reciben más atención y feedback más elaborado, produciendo mejoras reales.', relacionados:['halo','confirmacion','mentalidad-crecimiento'] },
  { id:'plasticidad', termino:'Neuroplasticidad', letra:'N', categoria:'Neuropsicología', definicion:'Capacidad del sistema nervioso para modificar su estructura y función en respuesta a la experiencia, el aprendizaje y el daño. Incluye la formación de nuevas sinapsis, la poda sináptica y la reorganización cortical.', origen:'William James intuyó el concepto en 1890; consolidado por Merzenich y Kaas en los años 1980', ejemplo:'Los taxistas de Londres muestran mayor volumen en el hipocampo posterior que la población general, evidencia directa de plasticidad por aprendizaje.', relacionados:['memoria-trabajo','cortex-prefrontal','mentalidad-crecimiento'] },
  { id:'primacia', termino:'Efecto de Primacía y Recencia', letra:'E', categoria:'Psicología Cognitiva', definicion:'En una lista de elementos, los primeros (primacía) y los últimos (recencia) se recuerdan mejor que los del centro. La primacía se debe a la consolidación en memoria a largo plazo; la recencia, a que los últimos elementos están en memoria de trabajo.', origen:'Hermann Ebbinghaus, 1885; formalizado por Murdock (1962)', ejemplo:'En una entrevista, el candidato que actúa primero o último es recordado mejor que los del medio, independientemente de su desempeño real.', relacionados:['halo','anclaje','memoria-trabajo'] },
  { id:'proyeccion', termino:'Proyección Psicológica', letra:'P', categoria:'Psicología Psicoanalítica', definicion:'Mecanismo de defensa por el que se atribuyen a otras personas los propios pensamientos, emociones o impulsos inaceptables. Al proyectar, el individuo reduce la ansiedad al localizar en el exterior lo que no puede tolerar en sí mismo.', origen:'Sigmund Freud, 1895', ejemplo:'Una persona que siente hostilidad inconsciente hacia un compañero percibe constantemente que ese compañero le tiene antipatía.', relacionados:['mecanismos-defensa','atribucion-fundamental','confirmacion'] },
  { id:'racializacion', termino:'Racionalización', letra:'R', categoria:'Psicología Psicoanalítica', definicion:'Mecanismo de defensa por el que una persona construye argumentos lógicos y aceptables para justificar conductas o decisiones que tienen motivos diferentes y menos aceptables. Produce la ilusión de haber razonado cuando en realidad se está justificando.', origen:'Ernest Jones, 1908 — elaborado dentro del marco psicoanalítico freudiano', ejemplo:'Alguien que compra un coche de alta gama que no puede permitirse argumenta que "la seguridad de la familia es lo primero".', relacionados:['disonancia','mecanismos-defensa','autoservicio'] },
  { id:'resiliencia', termino:'Resiliencia', letra:'R', categoria:'Psicología Positiva', definicion:'Capacidad de adaptarse positivamente ante la adversidad, el trauma o el estrés significativo. No implica ausencia de dificultad o angustia, sino que la adaptación exitosa puede coexistir con el sufrimiento y no requiere recursos extraordinarios.', origen:'Emmy Werner (1971) en estudios longitudinales en Kauai; Marco Rutter lo consolidó en los años 1980', ejemplo:'Una persona que pierde su empleo reorienta su carrera en seis meses, usando la crisis como oportunidad de cambio.', relacionados:['autocompasion','indefension','optimismo'] },
  { id:'retrospectiva', termino:'Sesgo de Retrospectiva', letra:'S', categoria:'Psicología Cognitiva', definicion:'Tendencia a percibir los eventos pasados como más predecibles de lo que realmente eran antes de que ocurrieran. Una vez conocido el resultado, el cerebro reescribe el recuerdo del proceso produciendo la ilusión de que "ya lo sabía".', origen:'Baruch Fischhoff, 1975 — experimento sobre la guerra chino-india', ejemplo:'Después de que una empresa quiebre, analistas explican con detalle por qué "era inevitable", aunque sus informes previos no contenían esa evaluación.', relacionados:['confirmacion','dunning-kruger','autoservicio'] },
  { id:'serotonina', termino:'Serotonina y Estado de Ánimo', letra:'S', categoria:'Neuropsicología', definicion:'La serotonina regula el estado de ánimo, el apetito, el sueño y funciones cognitivas. La hipótesis serotoninérgica de la depresión (déficit = depresión) está siendo revisada, con evidencia que apunta a mecanismos más complejos de neuroplasticidad y neuroinflamación.', origen:'Descubierta por Rapport et al. (1948); hipótesis de la depresión: Coppen (1967)', ejemplo:'El ejercicio aeróbico aumenta la serotonina cerebral y mejora el estado de ánimo, explicando parcialmente sus efectos antidepresivos.', relacionados:['dopamina','cortex-prefrontal','burnout'] },
  { id:'status-quo', termino:'Sesgo del Statu Quo', letra:'S', categoria:'Psicología Cognitiva', definicion:'Preferencia por el estado actual de las cosas de forma que cualquier cambio es percibido como una pérdida potencial mayor que la ganancia equivalente. Combina la aversión a las pérdidas con la aversión al arrepentimiento.', origen:'Samuelson & Zeckhauser, 1988', ejemplo:'Un inversor mantiene acciones que llevan años sin rendir simplemente porque venderlas implicaría tomar una decisión activa.', relacionados:['anclaje','enmarque','optimismo'] },
  { id:'superviviente', termino:'Sesgo del Superviviente', letra:'S', categoria:'Psicología Cognitiva', definicion:'Error lógico que ocurre cuando solo se tienen en cuenta los casos de éxito de un proceso de selección, ignorando los fracasos que no son visibles. Al observar solo a los supervivientes, se distorsiona la probabilidad de éxito.', origen:'Abraham Wald, 1943 — análisis de aviones de guerra', ejemplo:'Los libros de negocios estudian empresas exitosas e identifican sus rasgos comunes, ignorando que miles con los mismos rasgos fracasaron.', relacionados:['disponibilidad','optimismo','confirmacion'] },
  { id:'teoria-mente', termino:'Teoría de la Mente', letra:'T', categoria:'Neuropsicología', definicion:'Capacidad cognitiva de atribuir estados mentales —creencias, intenciones, deseos— a uno mismo y a los demás, entendiendo que esos estados son distintos de los propios. Su déficit es uno de los rasgos centrales del autismo.', origen:'Premack & Woodruff, 1978; test de falsa creencia: Wimmer & Perner (1983)', ejemplo:'Un niño de 4 años entiende que su amigo pensará que no hay nada en la caja aunque el niño sepa que sí hay un juguete.', relacionados:['efecto-espejo','inteligencia-emocional','conformidad'] },
  { id:'trauma', termino:'Trauma Psicológico', letra:'T', categoria:'Psicología Clínica', definicion:'Respuesta psicológica a un evento que desborda la capacidad de afrontamiento del individuo, dejando huellas persistentes en la memoria, la respuesta al estrés y las relaciones interpersonales. El TEPT es la presentación clínica más documentada.', origen:'Pierre Janet, 1889; formalizado como PTSD en DSM-III (1980)', ejemplo:'Una persona que sufrió un accidente de tráfico experimenta flashbacks y pánico ante el sonido de frenos.', relacionados:['mecanismos-defensa','apego','indefension'] },
  { id:'disponibilidad', termino:'Sesgo de Disponibilidad', letra:'S', categoria:'Psicología Cognitiva', definicion:'Tendencia a juzgar la probabilidad de un evento en función de la facilidad con que podemos recordar ejemplos. Si algo es fácil de recordar —por ser reciente, emotivo o mediático— lo percibimos como más frecuente y probable.', origen:'Tversky & Kahneman, 1973', ejemplo:'Los accidentes de avión generan más miedo que los de coche aunque estadísticamente sean mucho menos letales: la cobertura mediática los hace más disponibles en memoria.', relacionados:['mera-exposicion','optimismo','confirmacion'] },
  { id:'confirmacion', termino:'Sesgo de Confirmación', letra:'S', categoria:'Psicología Cognitiva', definicion:'Tendencia a buscar, interpretar y recordar información de manera que confirme las creencias previas, ignorando la evidencia contradictoria. Opera tanto en la búsqueda activa como en la evaluación pasiva de información.', origen:'Peter Wason, 1960 — experimento de la regla 2-4-6', ejemplo:'Alguien convencido de que las vacunas son peligrosas lee el mismo estudio que el escéptico, pero solo retiene los párrafos que apoyan su posición.', relacionados:['disponibilidad','dunning-kruger','retrospectiva'] }
];

/* ── GLOSARIO: modal y búsqueda ──────────────────────────────── */
(function () {
  const overlay  = document.getElementById('glosario-modal');
  const closeBtn = document.getElementById('glosario-modal-close');
  const searchEl = document.getElementById('glosario-search');
  const list     = document.getElementById('glosario-list');
  const detail   = document.getElementById('glosario-detail');
  if (!overlay) return;

  let glosarioTrap = null, glosarioTrigger = null;

  /* Ordenar por letra */
  const sorted = [...GLOSARIO].sort((a, b) => a.termino.localeCompare(b.termino, 'es'));

  function renderList(q) {
    const filter = (q || '').toLowerCase().trim();
    const items  = filter
      ? sorted.filter(t => t.termino.toLowerCase().includes(filter) || t.definicion.toLowerCase().includes(filter) || t.categoria.toLowerCase().includes(filter))
      : sorted;

    if (!items.length) {
      list.innerHTML = `<div class="li-empty"><span class="li-empty-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span><span><strong>Sin resultados</strong>No hay términos que coincidan con "${filter}"</span></div>`;
      return;
    }

    /* Agrupar por letra inicial del termino */
    const byLetter = {};
    items.forEach(t => {
      const l = t.termino[0].toUpperCase();
      if (!byLetter[l]) byLetter[l] = [];
      byLetter[l].push(t);
    });

    list.innerHTML = Object.keys(byLetter).sort().map(letra => `
      <div class="glosario-group">
        <div class="glosario-letter">${letra}</div>
        ${byLetter[letra].map(t => `
          <button class="glosario-item" data-id="${t.id}" aria-expanded="false">
            <span class="glosario-item-term">${t.termino}</span>
            <span class="glosario-item-cat">${t.categoria}</span>
            <svg class="glosario-item-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
          </button>`).join('')}
      </div>`).join('');

    list.querySelectorAll('.glosario-item').forEach(btn => {
      btn.addEventListener('click', () => openTerm(btn.dataset.id));
    });
  }

  function openTerm(id) {
    const t = GLOSARIO.find(x => x.id === id);
    if (!t) return;
    const related = (t.relacionados || [])
      .map(r => GLOSARIO.find(x => x.id === r) || { termino: r, id: r })
      .map(r => `<button class="glosario-rel-tag" data-id="${r.id}">${r.termino}</button>`)
      .join('');
    detail.innerHTML = `
      <button class="glosario-back-btn" id="glosario-back">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Volver al glosario
      </button>
      <div class="glosario-detail-cat">${t.categoria}</div>
      <h3 class="glosario-detail-title">${t.termino}</h3>
      <p class="glosario-detail-def">${t.definicion}</p>
      <div class="glosario-detail-block">
        <div class="glosario-detail-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> Origen</div>
        <p class="glosario-detail-origen">${t.origen}</p>
      </div>
      <div class="glosario-detail-block">
        <div class="glosario-detail-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg> En la práctica</div>
        <p class="glosario-detail-ejemplo">${t.ejemplo}</p>
      </div>
      ${related ? `<div class="glosario-detail-label" style="margin-top:1rem">Relacionado con</div><div class="glosario-related">${related}</div>` : ''}`;
    detail.hidden = false;
    list.hidden   = true;
    if (searchEl) searchEl.closest('.glosario-search-wrap').hidden = true;
    detail.querySelector('#glosario-back').addEventListener('click', closeTerm);
    detail.querySelectorAll('.glosario-rel-tag').forEach(btn => btn.addEventListener('click', () => openTerm(btn.dataset.id)));

    /* URL */
    history.pushState({ v: 'glosario', t: id }, '', `?v=glosario&t=${id}`);
  }

  function closeTerm() {
    detail.hidden = true;
    list.hidden   = false;
    if (searchEl) searchEl.closest('.glosario-search-wrap').hidden = false;
    if (history.state?.v === 'glosario') history.pushState({}, '', window.location.pathname);
  }

  function openGlosario(termId) {
    glosarioTrigger = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    glosarioTrap = trapFocus(overlay);
    renderList('');
    if (searchEl) { searchEl.value = ''; searchEl.focus(); }
    if (termId) setTimeout(() => openTerm(termId), 50);
    history.pushState({ v: 'glosario' }, '', '?v=glosario');
  }

  function closeGlosario() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (glosarioTrap) { releaseFocus(overlay, glosarioTrap, glosarioTrigger); glosarioTrap = null; }
    detail.hidden = true;
    list.hidden   = false;
    if (searchEl) searchEl.closest('.glosario-search-wrap').hidden = false;
    if (history.state?.v === 'glosario') history.pushState({}, '', window.location.pathname);
  }

  window._LI_openGlosario = openGlosario;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeGlosario);
    closeBtn.addEventListener('touchstart', e => { e.preventDefault(); closeGlosario(); }, { passive: false });
  }
  overlay.addEventListener('click', e => { if (e.target === overlay) closeGlosario(); });
  overlay.addEventListener('touchstart', e => { if (e.target === overlay) { e.preventDefault(); closeGlosario(); } }, { passive: false });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) closeGlosario(); });

  if (searchEl) {
    searchEl.addEventListener('input', () => {
      closeTerm();
      renderList(searchEl.value);
    });
  }

  /* Activar desde la URL */
  if (window._LI_pendingGlosario) {
    setTimeout(() => openGlosario(window._LI_pendingGlosario), 600);
  }
}());


/* ── CONCEPTO DE LA SEMANA ───────────────────────────────────── */
const CONCEPTOS_SEMANA = [
  {
    week: 23,
    termino: 'Efecto Pigmalión',
    origen: 'Rosenthal & Jacobson, 1968',
    definicion: 'Las expectativas que otros tienen sobre nosotros moldean nuestro rendimiento real. El trato diferencial generado por esas expectativas produce cambios objetivamente medibles, incluso cuando las expectativas son completamente falsas.',
    definicionFull: 'El efecto Pigmalión es el fenómeno por el que las expectativas de una persona sobre otra se convierten en profecías autocumplidas. El trato diferencial —inconsciente— que genera la expectativa produce cambios reales en el comportamiento y el rendimiento de quien es evaluado. La denominación hace referencia al mito griego de Pigmalión, el escultor enamorado de su propia estatua, que cobró vida. El efecto no requiere intención ni engaño: basta con que una expectativa exista para que comience a materializarse a través del comportamiento cotidiano del que evalúa.',
    experimento: 'Rosenthal y Jacobson informaron a maestros de primaria que ciertos alumnos —elegidos completamente al azar— habían obtenido puntuaciones excepcionales en un test de "potencial de crecimiento intelectual". El test era ficticio. Al cabo de un año, esos alumnos habían mejorado significativamente más en CI medido que sus compañeros de control. Los maestros no habían recibido ninguna instrucción adicional: la diferencia estaba en cómo trataban a los alumnos etiquetados como prometedores. Les prestaban más atención, daban feedback más elaborado, proponían más desafíos y toleraban mejor sus dudas. No por intención consciente, sino por expectativa inconsciente.',
    mecanismo: 'Las expectativas operan a través de cuatro canales simultáneos: el clima emocional (más calidez y apoyo hacia quien se percibe como prometedor), el feedback (más detallado y constructivo), la cantidad de input (material más estimulante y desafiante), y las oportunidades de respuesta (más tiempo para responder, mayor tolerancia al error). Estos cuatro canales, sumados y sostenidos en el tiempo, producen diferencias de rendimiento reales que no existían antes de que la expectativa fuera formulada.',
    reconoceras: [
      'Un jefe que etiqueta a un empleado como "promedio" le asigna tareas rutinarias, confirma su propia predicción y nunca descubre el potencial real',
      'Los hijos mayores sistemáticamente superan a los menores en pruebas estandarizadas: los padres les dedican más atención antes de que lleguen los hermanos',
      'La diferencia entre un entrenador que te dice "llegarás lejos" y uno que te descarta cambia cómo te tratan mucho antes de que cambies tú',
      'Los sesgos implícitos en procesos de selección laboral generan los resultados que los seleccionadores esperaban: los candidatos tratados como mejores acaban siendo mejores en la entrevista'
    ],
    aplicacion: 'Tus expectativas sobre las personas a tu cargo no son predicciones neutrales: son acciones que moldean el resultado antes de que ocurra. Si crees que alguien tiene potencial y lo tratas de acuerdo con esa creencia, puede que no estés observando algo que ya existe. Puede que lo estés creando. Pregúntate qué tipo de expectativas estás comunicando con tu comportamiento cotidiano, y a quién.'
  },
  {
    week: 22,
    termino: 'Disonancia cognitiva',
    origen: 'Leon Festinger, 1957',
    definicion: 'El malestar mental que surge al sostener dos pensamientos contradictorios o cuando nuestras acciones contradicen lo que creemos. El cerebro trabaja para eliminar esa tensión, generalmente cambiando la creencia más cómoda, no la más correcta.',
    definicionFull: 'La disonancia cognitiva es el estado de tensión psicológica que experimenta una persona al mantener simultáneamente dos ideas, creencias o actitudes que se contradicen, o cuando su conducta entra en conflicto con lo que cree o valora. Festinger propuso que este malestar no es una experiencia opcional: es un mecanismo automático del sistema cognitivo que genera presión hacia la resolución. Lo perturbador no es solo que ocurra, sino cómo el cerebro elige resolverla.',
    experimento: 'En 1959, Festinger y Carlsmith pagaron a participantes 1 o 20 dólares para mentirle a un desconocido diciéndole que una tarea aburrida había sido fascinante. Después preguntaron a los participantes cuánto les había gustado la tarea. Los que recibieron 1 dólar dijeron que había sido significativamente más interesante que los que recibieron 20. La lógica es contraintuitiva: quienes cobraron más podían justificar la mentira con el dinero; quienes cobraron poco necesitaban creer que la tarea era buena para sentirse coherentes consigo mismos.',
    mecanismo: 'El cerebro trata la coherencia interna como señal de salud cognitiva. Cuando detecta una contradicción, activa el mismo sistema de alerta que usa ante amenazas externas. Para reducir ese malestar tiene tres opciones: cambiar una de las creencias, añadir una creencia que justifique la inconsistencia, o minimizar la importancia de la contradicción. La primera opción es la más honesta pero exige más esfuerzo. Las otras dos —racionalización y trivialización— son las que el cerebro elige por defecto.',
    reconoceras: [
      'Comprar algo que no necesitabas y convencerte después de que era una inversión necesaria',
      'Votar a alguien y recordar selectivamente solo sus aciertos, ignorando sistemáticamente sus fracasos',
      'Seguir en una relación que no funciona y decirte que "en realidad no está tan mal"',
      'El fumador que concluye que "algo te va a matar de todas formas" en lugar de afrontar la contradicción real'
    ],
    aplicacion: 'La próxima vez que notes que estás construyendo argumentos para justificar una decisión que ya tomaste, detente. Eso es disonancia resuelta de la forma más cómoda, no más honesta. Hazte esta pregunta: "¿Cambiaría esta decisión si no la hubiera tomado ya?" Si la respuesta no es un no claro, probablemente estás racionalizando, no razonando.'
  },
  {
    week: 21,
    termino: 'Heurística de disponibilidad',
    origen: 'Kahneman & Tversky, 1973',
    definicion: 'Juzgamos la frecuencia o probabilidad de algo según la facilidad con que ejemplos nos vienen a la mente. Lo que aparece más en las noticias parece más probable, independientemente de las estadísticas reales.',
    definicionFull: 'La heurística de disponibilidad es el atajo mental por el que evaluamos la probabilidad o frecuencia de un evento basándonos en la facilidad con que podemos evocar ejemplos. Si recordamos fácilmente instancias de algo, concluimos que es frecuente. Si nos cuesta, concluimos que es raro. El problema es que la facilidad de recuerdo depende de la intensidad emocional, la cobertura mediática y la proximidad temporal, no solo de la frecuencia real.',
    experimento: 'Tversky y Kahneman pidieron estimar cuál era más frecuente en inglés: palabras que empiezan por "r" o palabras con "r" como tercera letra. La mayoría eligió las que empiezan por "r". En realidad, hay casi el doble de palabras con "r" en tercera posición. Las palabras que empiezan por una letra se recuperan más fácilmente, así que parecen más numerosas. La misma ilusión opera a escala real con aviones, tiburones y crímenes violentos.',
    mecanismo: 'El cerebro usa la facilidad de recuperación como señal de frecuencia porque, en entornos con información limitada y estable, esa correlación era válida: lo que habías visto muchas veces era realmente más común. El problema surge en un mundo de medios que amplifican lo raro y lo dramático. Un accidente de avión recibe cobertura en todo el mundo; miles de accidentes de tráfico ese mismo día, ninguna. El cerebro registra la cobertura, no la estadística.',
    reconoceras: [
      'Creer que los accidentes de avión matan a más gente que las caídas en el hogar (las caídas causan 15 veces más muertes)',
      'Pensar que la criminalidad está en máximos históricos cuando está en mínimos, por la cobertura mediática de cada crimen',
      'Sobreestimar la probabilidad de un atentado terrorista frente a la de una enfermedad cardiovascular',
      'Juzgar que el mercado inmobiliario "siempre sube" porque solo recuerdas los períodos de bonanza que se celebraron públicamente'
    ],
    aplicacion: 'Antes de estimar un riesgo o tomar una decisión importante, pregúntate: "¿Me viene fácilmente a la mente porque es realmente frecuente, o porque fue emocionalmente impactante o mediáticamente amplificado?" Son preguntas distintas con respuestas distintas. Busca las estadísticas reales antes de dejarte guiar por la primera impresión.'
  },
  {
    week: 20,
    termino: 'Autodeterminación',
    origen: 'Deci & Ryan, 1985',
    definicion: 'Las personas necesitan tres cosas para estar genuinamente motivadas: sentir que eligen (autonomía), que mejoran (competencia) y que pertenecen (vinculación). Privar de cualquiera de las tres destruye la motivación intrínseca, aunque el salario sea alto.',
    definicionFull: 'La Teoría de la Autodeterminación propone que los seres humanos tienen tres necesidades psicológicas básicas y universales: la autonomía (sentir que uno es el origen de sus propias acciones), la competencia (sentir que uno es efectivo en su entorno y mejora) y la vinculación (sentir conexión con los demás). Cuando estas tres necesidades están satisfechas, las personas experimentan motivación intrínseca, bienestar y desarrollo psicológico. Cuando están frustradas, aparecen la desmotivación, el malestar y la reducción de la calidad del trabajo.',
    experimento: 'Deci reclutó a universitarios para resolver puzzles interesantes sin recompensa. En la segunda sesión, pagó a la mitad por cada puzzle resuelto. En la tercera, eliminó el pago. Los que habían sido pagados pasaron significativamente menos tiempo con los puzzles que antes de que existiera la recompensa. El pago externo había sustituido la motivación interna, y al retirarse, la motivación no regresó a su nivel original. Este resultado fue confirmado por un metaanálisis de 128 estudios.',
    mecanismo: 'Cuando una recompensa externa controla el comportamiento, la persona desplaza la causa de su acción de "lo hago porque me interesa" a "lo hago por la recompensa". La actividad deja de ser un fin y se convierte en un medio. Y los medios no sostienen el comportamiento cuando la recompensa desaparece. Las notas escolares, los bonus laborales y las recompensas tangibles condicionadas al rendimiento operan exactamente así: pueden incrementar la conducta a corto plazo mientras destruyen la motivación a largo plazo.',
    reconoceras: [
      'Un trabajador que hacía horas extra voluntarias deja de hacerlas en cuanto empiezan a pagárselas: ahora "es una obligación"',
      'Un niño que leía por placer pierde el hábito en verano cuando no hay deberes que lo obliguen: "leer" se había convertido en una tarea',
      'Sentirte menos dueño de tus decisiones cuando tu jefe te supervisa de cerca, aunque hagas exactamente lo mismo que harías solo',
      'Preferir un trabajo con menos dinero pero donde sientes que tu trabajo importa y tienes control sobre cómo lo realizas'
    ],
    aplicacion: 'Antes de introducir incentivos externos en una actividad que ya genera motivación intrínseca, considera si el beneficio a corto plazo merece el coste a largo plazo. El reconocimiento no esperado ("lo que hiciste hoy fue excelente porque...") preserva la motivación mejor que el incentivo contingente ("si lo haces bien, te doy X"). La diferencia es si el control percibido se mantiene interno o se externaliza.'
  },
  {
    week: 19,
    termino: 'Reconsolidación mnémica',
    origen: 'Nader, Schafe & LeDoux, 2000',
    definicion: 'Cada vez que recuperamos un recuerdo, este vuelve a ser vulnerable a modificaciones durante varias horas antes de consolidarse de nuevo. La memoria no es un archivo: es un documento en edición permanente que se reescribe cada vez que se abre.',
    definicionFull: 'La reconsolidación mnémica es el proceso por el que un recuerdo, al ser recuperado de la memoria a largo plazo, vuelve a un estado lábil durante un período de varias horas, antes de consolidarse de nuevo. Esto implica que cada acto de recordar es también un acto de reescritura: el recuerdo se vuelve a almacenar integrando elementos del contexto presente. Las implicaciones son profundas tanto para la comprensión del testimonio judicial como para el tratamiento clínico del trauma.',
    experimento: 'Nader, Schafe y LeDoux entrenaron a ratas en un condicionamiento de miedo: un sonido seguido de una descarga. Al día siguiente, reactivaron el recuerdo del miedo haciendo sonar el tono solo. Inmediatamente después, bloquearon la síntesis de proteínas en la amígdala —necesaria para que el recuerdo se reconsolidara—. Las ratas perdieron el miedo de forma permanente, aunque habían tardado días en aprenderlo. El hallazgo demostró que el recuerdo reactivado vuelve a ser modificable, y que esa ventana puede usarse para extinguirlo.',
    mecanismo: 'Cuando recuperamos un recuerdo, se reactiva la huella mnémica original y se integran en ella el estado emocional actual, las preguntas que alguien nos hace, y lo que sabemos ahora que no sabíamos entonces. Después, el recuerdo se reconsolida incorporando esas modificaciones. El resultado es que los recuerdos más evocados son los más reescritos. La memoria episódica de larga duración no es un registro fiel del pasado: es una reconstrucción influida por el presente.',
    reconoceras: [
      'Recordar la misma discusión de forma diferente según cómo te sientes hoy al evocarla',
      'Que tus recuerdos de la infancia difieran significativamente de los de tus hermanos que vivieron los mismos eventos',
      'Que un testimonio judicial sea más fiable si se toma inmediatamente después del evento que semanas después de múltiples interrogatorios',
      'Que las preguntas de un terapeuta sobre el pasado puedan, sin quererlo, modificar los recuerdos que el paciente evoca en cada sesión'
    ],
    aplicacion: 'Antes de una conversación difícil sobre un hecho del pasado, escribe tu versión sin consultarla con la otra persona. Compárala después. La diferencia entre ambas versiones no refleja quién miente: refleja cómo cada recuerdo ha sido reescrito por los contextos distintos en que cada persona lo ha evocado. Eso es reconsolidación, no mala fe.'
  },
  {
    week: 18,
    termino: 'Priming',
    origen: 'Meyer & Schvaneveldt, 1971 · Bargh et al., 1996',
    definicion: 'La exposición a un estímulo modifica —sin que lo notemos— cómo respondemos a estímulos posteriores relacionados. Palabras, imágenes y contextos activan esquemas que dirigen el comportamiento siguiente antes de que ningún proceso consciente intervenga.',
    definicionFull: 'El priming es el fenómeno por el que la exposición a un estímulo (el prime) influye en la respuesta a estímulos posteriores relacionados, sin que el sujeto sea consciente de esa influencia. El prime puede ser perceptivo (una palabra activa otras semánticamente relacionadas), conceptual (una idea activa conceptos asociados) o comportamental (un concepto activa conductas relacionadas con él). El efecto opera de forma automática, antes de cualquier procesamiento consciente.',
    experimento: 'John Bargh (1996) hizo que participantes descodificaran frases con palabras relacionadas con la vejez (arrugas, jubilación, Florida, olvido). Al salir del laboratorio, caminaban significativamente más despacio que los que habían descodificado frases neutras. Nadie los había instruido sobre la velocidad de paso; ni siquiera sabían que eso se medía. El concepto de "ancianidad" había activado el esquema de comportamiento asociado sin que mediara ninguna intención consciente.',
    mecanismo: 'El cerebro almacena conceptos en redes semánticas: nodos vinculados según la frecuencia con que han aparecido juntos en la experiencia. Cuando se activa un nodo, la activación se propaga por los nodos conectados, bajando el umbral de activación de conductas y percepciones relacionadas. El sujeto no experimenta esta propagación: solo experimenta sus efectos en las respuestas posteriores.',
    reconoceras: [
      'Que el ambiente elegante de una tienda de lujo haga el precio parecer menos importante antes de que lo veas',
      'Que estudiar rodeado de objetos relacionados con el trabajo (libros, escritorio) genere más concentración que hacerlo en el sofá',
      'Que ver un thriller antes de dormir haga más probable que interpretes ruidos nocturnos normales como amenazas',
      'Que el diseño de una web o aplicación —colores, palabras, imágenes— active disposiciones emocionales antes de que leas el mensaje principal'
    ],
    aplicacion: 'El entorno en el que tomas tus decisiones importantes no es neutral: está primando tu pensamiento antes de que lo notes. Si necesitas generar ideas creativas, no trabajes en un espacio caótico. Si necesitas tomar decisiones financieras importantes, no lo hagas mientras consumes publicidad. Diseña el contexto con la misma atención con que diseñas el contenido de tu trabajo.'
  },
  {
    week: 17,
    termino: 'Estado de Flujo',
    origen: 'Mihaly Csikszentmihalyi, 1975',
    definicion: 'Estado de concentración total donde el yo desaparece, el tiempo se distorsiona y la tarea fluye sin esfuerzo consciente. Ocurre exactamente cuando desafío y habilidad son ambos altos y están perfectamente equilibrados.',
    definicionFull: 'El estado de flujo es una forma de experiencia psicológica óptima caracterizada por concentración intensa, fusión de la acción y la consciencia, pérdida de la noción del tiempo y de la autoconsciencia, sensación de control, y motivación intrínseca sostenida por el proceso en sí mismo. Csikszentmihalyi lo identificó tras entrevistar durante años a cirujanos, escaladores, músicos y ajedrecistas que describían sus mejores momentos con un vocabulario sorprendentemente convergente, independientemente de la cultura y la actividad.',
    experimento: 'Csikszentmihalyi desarrolló el Muestreo de Experiencias: daba bippers a participantes que sonaban a horas aleatorias, en las que debían anotar qué hacían y cómo se sentían. Analizando miles de registros, identificó que los estados de máximo bienestar y rendimiento coincidían con situaciones donde el nivel de desafío era alto y exactamente calibrado al nivel de habilidad. Demasiado fácil: aburrimiento. Demasiado difícil: ansiedad. En el canal entre ambos, con ambos elevados: flujo.',
    mecanismo: 'Los estudios de neuroimagen muestran que el flujo se asocia con hipofrontalidad transitoria: una reducción de la actividad en la corteza prefrontal dorsolateral, la región responsable de la autoconsciencia y la autocrítica. Al desconectarse parcialmente ese sistema, los recursos cognitivos liberados se destinan íntegramente a la tarea. El resultado es mayor eficiencia de procesamiento, menos ruido interno, y mayor rendimiento. Simultáneamente, el sistema de recompensa libera dopamina y norepinefrina, haciendo la experiencia intrínsecamente gratificante.',
    reconoceras: [
      'Mirar el reloj después de lo que te pareció una hora y descubrir que han pasado cuatro',
      'Estar tan absorbido en un problema difícil que olvidas comer, aunque habitualmente pienses mucho en la comida',
      'La sensación específica de "no quiero que esto acabe" cuando tocas un instrumento o escribes algo que fluye',
      'Que los videojuegos más adictivos son exactamente los que calibran automáticamente la dificultad a tu nivel: nunca demasiado fáciles, nunca imposibles'
    ],
    aplicacion: 'Para diseñar flujo deliberadamente: define un objetivo claro y específico para la sesión (no "trabajar en X", sino "completar la sección Y"); asegúrate de que la tarea supere ligeramente tu zona de confort actual sin ser imposible; elimina todas las interrupciones durante al menos 90 minutos. Las notificaciones no son distracciones menores: son el mecanismo exacto que imposibilita el flujo, que requiere acumulación de atención sostenida para activarse.'
  }
];

(function () {
  const block = document.getElementById('concepto-widget-block');
  if (!block) return;

  /* ── Calcular semana actual ── */
  const week = (function () {
    const d   = new Date();
    const day = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - day);
    const y   = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - y) / 86400000) + 1) / 7);
  }());

  const concepto = CONCEPTOS_SEMANA.find(c => c.week === week)
    || CONCEPTOS_SEMANA[0];

  /* ── Rellenar widget compacto ── */
  const termEl   = document.getElementById('concepto-termino');
  const origenEl = document.getElementById('concepto-origen');
  const defEl    = document.getElementById('concepto-def');

  if (termEl)   termEl.textContent   = concepto.termino;
  if (origenEl) origenEl.textContent = concepto.origen;
  if (defEl)    defEl.textContent    = concepto.definicion;

  /* ── Modal ── */
  const modal       = document.getElementById('concepto-modal');
  const closeBtn    = document.getElementById('concepto-modal-close');
  const abrirBtn    = document.getElementById('concepto-abrir-btn');
  let conceptoTrap  = null;

  function openModal() {
    if (!modal) return;
    const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text || ''; };

    set('cm-termino',    concepto.termino);
    set('cm-origen',     concepto.origen);
    set('cm-def',        concepto.definicionFull || concepto.definicion);
    set('cm-experimento', concepto.experimento || '');
    set('cm-mecanismo',  concepto.mecanismo || '');
    set('cm-aplicacion', concepto.aplicacion || '');

    /* Lista "Lo reconocerás en" */
    const ul = document.getElementById('cm-reconoceras');
    if (ul) {
      ul.innerHTML = '';
      (concepto.reconoceras || []).forEach(txt => {
        const li = document.createElement('li');
        li.textContent = txt;
        ul.appendChild(li);
      });
    }

    /* Ocultar secciones vacías */
    const secExp = modal.querySelector('.concepto-modal-section--exp');
    const secMec = modal.querySelector('.concepto-modal-section--mec');
    const secRec = modal.querySelector('.concepto-modal-section--reco');
    if (secExp) secExp.hidden = !concepto.experimento;
    if (secMec) secMec.hidden = !concepto.mecanismo;
    if (secRec) secRec.hidden = !(concepto.reconoceras && concepto.reconoceras.length);

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    conceptoTrap = trapFocus(modal);
    requestAnimationFrame(() => closeBtn && closeBtn.focus());
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (conceptoTrap) { releaseFocus(modal, conceptoTrap, abrirBtn); conceptoTrap = null; }
    else if (abrirBtn) abrirBtn.focus();
  }

  if (abrirBtn) abrirBtn.addEventListener('click', openModal);
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('touchstart', e => { e.preventDefault(); closeModal(); }, { passive: false });
  }

  if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    modal.addEventListener('touchstart', e => { if (e.target === modal) { e.preventDefault(); closeModal(); } }, { passive: false });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });
}());


/* ── BIBLIOTECA POR INTERESES ─────────────────────────────────── */
(function () {
  const container = document.getElementById('biblioteca-container');
  const catBtns   = document.querySelectorAll('.cat-btn');
  if (!container) return;

  const CAT_LABELS = {
    economia:    'Economía',
    moda:        'Moda y Estética',
    derecho:     'Derecho',
    deporte:     'Deporte',
    arte:        'Arte y Creatividad',
    tecnologia:  'Tecnología',
    relaciones:  'Relaciones',
    saludMental: 'Salud Mental',
    educacion:   'Educación',
    trabajo:      'Trabajo',
    politica:     'Política',
    alimentacion: 'Alimentación'
  };

  let currentCat = null;

  /* ── Lectura leída ── */
  const LS_READ = 'li_lib_read';
  function getRead() { try { return JSON.parse(localStorage.getItem(LS_READ) || '[]'); } catch { return []; } }
  function markRead(id) {
    const r = getRead();
    if (!r.includes(id)) { r.push(id); lsSet(LS_READ, JSON.stringify(r)); }
    updateCatProgress();
  }

  function updateCatProgress() {
    const read = getRead();
    catBtns.forEach(btn => {
      const cat  = btn.dataset.cat;
      const arts = LIBRARY_ARTICLES[cat] || [];
      if (!arts.length) return;
      const count = arts.filter(a => read.includes(a.id)).length;
      const pct   = Math.round(count / arts.length * 100);
      let bar = btn.querySelector('.cat-pbar');
      if (!bar) {
        bar = document.createElement('div');
        bar.className = 'cat-pbar';
        bar.innerHTML = '<div class="cat-pbar-fill"></div>';
        btn.appendChild(bar);
      }
      bar.querySelector('.cat-pbar-fill').style.width = pct + '%';
      btn.setAttribute('data-read', count + '/' + arts.length);
    });
  }
  updateCatProgress();

  function renderCard(art, cat) {
    const isRead = getRead().includes(art.id);
    return `
      <div class="lib-card${isRead ? ' is-read' : ''}" data-id="${art.id}" data-cat="${cat}" role="button" tabindex="0" style="position:relative">
        ${isRead ? `<span class="read-badge" title="Ya leído" aria-label="Ya leído">✓</span>` : ''}
        ${_favBtnHTML('lib-' + art.id, 'fav-btn--lib-card')}
        <span class="doc-badge">${art.badge}</span>
        <h3>${art.title}</h3>
        <p class="lib-card-summary">${art.summary}</p>
        <div class="lib-card-meta">
          <span>${art.author.name}</span>
          <span class="sep">·</span>
          <span>${art.readingTime} de lectura</span>
        </div>
      </div>`;
  }

  function renderFull(art) {
    const chartHTML = art.chart ? `
      <figure class="article-chart">
        ${art.chart.svg}
        <figcaption>${art.chart.caption}</figcaption>
      </figure>` : '';

    const sectionsHTML = art.sections.map((s, i) => {
      const ps = s.paragraphs.map(p => `<p>${p}</p>`).join('');
      const injectChart = (i === 0 && art.chart) ? chartHTML : '';
      return `<h3 class="article-subtitle" id="art-sec-${i}">${s.subtitle}</h3>${ps}${injectChart}`;
    }).join('');

    const enfocadoLib = document.body.classList.contains('modo-enfoque-activo');
    return `
      <button class="lib-back-btn" id="lib-back-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Volver a ${CAT_LABELS[currentCat] || currentCat}
      </button>
      <div class="weekly-featured-card">
        <div class="week-label">
          <span class="week-tag">✦ ${art.badge}</span>
          <span class="reading-time">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="url(#clock-grad)" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${art.readingTime} de lectura
          </span>
          <button class="btn-modo-enfoque" aria-pressed="${enfocadoLib}">${enfocadoLib ? '✕ Salir de enfoque' : '📖 Modo Enfoque'}</button>
          ${_favBtnHTML('lib-' + art.id, 'fav-btn--article')}
          <button class="article-share-btn" data-share-title="${art.title.replace(/"/g,'&quot;')}" data-share-text="Artículo de La Inferencia: ${art.title.replace(/"/g,'&quot;')}" aria-label="Compartir artículo" title="Compartir">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Compartir
          </button>
        </div>
        <h2 class="weekly-title">${art.title}</h2>
        ${renderAuthorCard(art.author)}
        ${_buildTocHTML(art.sections)}
        <div class="article-content">
          <p class="article-intro">${art.intro}</p>
          ${_buildStatsHTML(art.id)}
          ${sectionsHTML}
          <blockquote class="article-blockquote">
            <p>${art.blockquote.text}</p>
            <cite>— ${art.blockquote.attribution}</cite>
          </blockquote>
          ${art.aplicacion ? `<div class="aplicacion-block">
            <div class="aplicacion-header">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              <strong>¿Cómo te afecta esto hoy?</strong>
            </div>
            <p>${art.aplicacion}</p>
          </div>` : ''}
          ${_buildQuizBtnHTML(art.id)}
          <a href="${art.sourceUrl}" class="source-verify-btn" target="_blank" rel="noopener noreferrer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Verificar fuente · ${art.sourceLabel}
          </a>
          ${renderRelated(art)}
        </div>
      </div>`;
  }

  function renderRelated(art) {
    const cat  = currentCat || '';
    const pool = Object.entries(LIBRARY_ARTICLES).flatMap(([c, arr]) =>
      arr.filter(a => a.id !== art.id).map(a => ({ ...a, _cat: c }))
    );
    /* Prefer same category, then random others */
    const sameCat = pool.filter(a => a._cat === cat);
    const other   = pool.filter(a => a._cat !== cat);
    const shuffle  = arr => arr.sort(() => Math.random() - 0.5);
    const picks    = [...shuffle(sameCat), ...shuffle(other)].slice(0, 2);
    if (!picks.length) return '';
    return `<div class="related-articles">
      <div class="related-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        También puede interesarte
      </div>
      <div class="related-grid">
        ${picks.map(a => `
          <div class="related-card" data-rel-id="${a.id}" data-rel-cat="${a._cat}" role="button" tabindex="0">
            <span class="doc-badge">${a.badge}</span>
            <p class="related-title">${a.title}</p>
            <span class="related-author">${a.author.name}</span>
          </div>`).join('')}
      </div>
    </div>`;
  }

  function openArticle(art, cat) {
    currentCat = cat || currentCat;
    container.innerHTML = renderFull(art);
    markRead(art.id);
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('lib-back-btn')?.addEventListener('click', () => showCards(currentCat));
    /* Related cards */
    container.querySelectorAll('.related-card').forEach(card => {
      const act = () => {
        const a = (LIBRARY_ARTICLES[card.dataset.relCat] || []).find(x => x.id === card.dataset.relId);
        if (a) openArticle(a, card.dataset.relCat);
      };
      card.addEventListener('click', act);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); }});
    });
  }

  function showCards(cat) {
    currentCat = cat;
    const arts = LIBRARY_ARTICLES[cat] || [];
    container.innerHTML = `<div class="lib-cards-grid">${arts.map(a => renderCard(a, cat)).join('')}</div>`;
    container.querySelectorAll('.lib-card').forEach(card => {
      const activate = () => {
        const art = (LIBRARY_ARTICLES[card.dataset.cat] || []).find(a => a.id === card.dataset.id);
        if (art) openArticle(art, card.dataset.cat);
      };
      card.addEventListener('click', activate);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
    });
  }

  /* ── Sorpréndeme ── */
  const sorBtn = document.getElementById('sorprendeme-btn');
  if (sorBtn) {
    sorBtn.addEventListener('click', () => {
      const cats = Object.keys(LIBRARY_ARTICLES);
      const cat  = cats[Math.floor(Math.random() * cats.length)];
      const arts = LIBRARY_ARTICLES[cat];
      const art  = arts[Math.floor(Math.random() * arts.length)];
      catBtns.forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
      openArticle(art, cat);
      sorBtn.classList.add('spinning');
      setTimeout(() => sorBtn.classList.remove('spinning'), 600);
    });
  }

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showCards(btn.dataset.cat);
      setTimeout(() => container.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    });
  });

  window._LI_openLibArticle = function(id, cat) {
    const art = (LIBRARY_ARTICLES[cat] || []).find(a => a.id === id);
    if (!art) return;
    openArticle(art, cat);
    history.pushState({ v: 'art', id, cat }, '', `?v=art&id=${id}&cat=${cat}`);
  };
}());


/* ── HERO BUBBLE — scroll suave a #botiquin ─────────────────── */
(function () {
  const bubble  = document.getElementById('hero-bubble');
  const target  = document.getElementById('botiquin');
  if (!bubble || !target) return;
  bubble.addEventListener('click', e => {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}());


/* ── EXPERIMENTO TOGGLE ──────────────────────────────────────── */
(function () {
  const btn     = document.getElementById('exp-toggle-btn');
  const section = document.getElementById('exp-section');
  if (btn && section) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      section.classList.toggle('is-open', !expanded);
    });
  }
}());


/* ── RADAR DE MITOS TOGGLE ───────────────────────────────────── */
(function () {
  const btn     = document.getElementById('mitos-toggle-btn');
  const section = document.getElementById('mitos-cards-wrap');
  if (btn && section) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      section.classList.toggle('is-open', !expanded);
    });
  }
}());

/* ── MITOS CAROUSEL COUNTER + NAV ───────────────────────────── */
(function () {
  const track   = document.getElementById('mitos-cards');
  const counter = document.getElementById('mitos-counter');
  const prevBtn = document.getElementById('mitos-prev');
  const nextBtn = document.getElementById('mitos-next');
  if (!track || !counter) return;

  const cards = Array.from(track.querySelectorAll('.mito-tf-card'));
  const total = cards.length;

  function currentIndex() {
    return Math.round(track.scrollLeft / track.offsetWidth);
  }

  function updateCounter() {
    const idx = currentIndex();
    counter.textContent = (idx + 1) + ' / ' + total;
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === total - 1;
  }

  function goTo(idx) {
    track.scrollTo({ left: idx * track.offsetWidth, behavior: 'smooth' });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(Math.max(0, currentIndex() - 1)));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(Math.min(total - 1, currentIndex() + 1)));
  track.addEventListener('scroll', updateCounter, { passive: true });
  updateCounter();
}());


/* ── LISTA DE EFECTOS TOGGLE (solo activo en móvil) ─────────── */
(function () {
  const btn     = document.getElementById('efectos-toggle-btn');
  const section = document.getElementById('efectos-content-wrap');
  if (btn && section) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      section.classList.toggle('is-open', !expanded);
      /* El contenido se expande hacia abajo con la animación CSS —
         sin scrollIntoView para no interrumpir el scroll nativo del usuario */
    });
  }
}());


/* ── RESEARCH TOGGLE + EFECTOS VER MÁS ──────────────────────── */
(function () {
  /* Research section toggle */
  const btn     = document.getElementById('research-toggle-btn');
  const section = document.getElementById('research-section');
  if (btn && section) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      section.classList.toggle('is-open', !expanded);
    });
  }

  /* Efectos "Ver más" */
  const verMasBtn   = document.getElementById('efectos-ver-mas-btn');
  const efectosExtra = document.getElementById('efectos-extra');
  if (verMasBtn && efectosExtra) {
    verMasBtn.addEventListener('click', () => {
      const expanded = verMasBtn.getAttribute('aria-expanded') === 'true';
      verMasBtn.setAttribute('aria-expanded', String(!expanded));
      efectosExtra.hidden = expanded;
      /* Re-attach fav buttons to newly revealed cards */
      if (!expanded && window._LI_reinitFavEfectos) window._LI_reinitFavEfectos();
    });
  }
}());




/* ── CONTENIDO EXTENDIDO DE EFECTOS ─────────────────────────── */
const EFECTOS_EXTRA = {
  'dunning-kruger': {
    explicacion2: 'En un segundo experimento con participantes de lógica, gramática y humor, el patrón se repitió en las tres disciplinas. Los participantes del cuartil inferior sobreestimaron no solo su rendimiento absoluto sino también el relativo. Más perturbador aún: cuando se les proporcionaba formación específica, su precisión en la autoevaluación mejoraba simultáneamente a su competencia, confirmando que la misma habilidad necesaria para rendir bien es la necesaria para saber cuánto se rinde.',
    mecanismo: 'El mecanismo es metacognitivo: evaluar tu propio rendimiento requiere exactamente las mismas habilidades que produce ese rendimiento. Si te falta competencia en lógica, te falta también la capacidad para detectar cuándo tu razonamiento lógico es erróneo. No es soberbia deliberada: es un déficit estructural en el sistema de retroalimentación interna. Dunning lo denominó problema de doble carga.',
    mecanismo2: 'Los competentes caen en la trampa contraria: suponen que lo que les resulta fácil también lo es para los demás, y subestiman su propio nivel. El efecto no dice que quienes se creen buenos son malos —dice que quienes son malos no pueden saberlo, y quienes son buenos tienden a dudar. La única salida documentada es la formación: adquirir competencia real activa simultáneamente la capacidad de autoevaluarse con precisión.'
  },
  'halo': {
    explicacion2: 'El efecto funciona en sentido negativo con igual intensidad —lo que se llamó efecto horn o cuerno. Una primera impresión negativa (descuido en el vestir, un comentario brusco) irradia hacia todos los demás atributos de la persona, degradando evaluaciones en dimensiones completamente independientes. Thorndike identificó correlaciones absurdamente altas entre atributos como "inteligencia" y "puntualidad" en evaluaciones militares, donde ambas deberían tener distribuciones independientes.',
    mecanismo: 'El procesamiento cognitivo en evaluaciones multidimensionales es costoso: valorar objetivamente a alguien en doce atributos distintos exigiría doce juicios independientes. En lugar de eso, el cerebro identifica el atributo más saliente —el de mayor carga emocional o que aparece primero— y lo usa como proxy para todos los demás. Es economía cognitiva: en entornos evolutivos donde las decisiones sociales debían ser rápidas, este atajo era adaptativo.',
    mecanismo2: 'El contexto modula la intensidad del efecto: bajo presión de tiempo, estrés cognitivo, o cuando el atributo inicial es especialmente cargado (belleza física, estatus social), el halo es más fuerte. En situaciones de deliberación pausada y con criterios explícitos puede reducirse parcialmente, aunque no eliminarse. Conocer el efecto sin procedimientos estructurados no es suficiente para contrarrestarlo.'
  },
  'confirmacion': {
    explicacion2: 'Lo más sorprendente del hallazgo de Wason no es que la gente cometa el error, sino que persiste incluso cuando se advierte explícitamente al participante de la trampa y se le pide que intente falsificar la regla. El sesgo opera antes del razonamiento consciente: es el sistema de búsqueda de información el que está sesgado, no solo su interpretación posterior.',
    mecanismo: 'Tres mecanismos cooperan para producir el sesgo. El primero es la búsqueda selectiva: buscamos información que confirme las hipótesis existentes. El segundo es la interpretación tendenciosa: la información ambigua se decodifica como favorable a la creencia previa. El tercero es la memoria selectiva: los episodios que confirman las propias predicciones se codifican y recuperan mejor que los que las contradicen.',
    mecanismo2: 'La función evolutiva es la coherencia del modelo mental del mundo. Un sistema cognitivo que actualizara radicalmente sus creencias ante cada dato contrario sería inestable. El coste en el mundo moderno es la acumulación de errores sistemáticos que nunca se corrigen porque el sistema de retroalimentación está sesgado hacia su propia validación. Los algoritmos de redes sociales amplifican industrialmente este sesgo individual.'
  },
  'placebo': {
    explicacion2: 'En los años 90, estudios de neuroimagen demostraron que los placebos activan las mismas vías neurobiológicas que los fármacos activos. Cuando un paciente con dolor crónico recibe un placebo con la expectativa de alivio, su cerebro libera opioides endógenos reales, baja la actividad de la ínsula anterior (asociada al procesamiento del dolor) y modifica la conductancia de la piel. Los efectos no son "solo psicológicos": son fisiológicos y medibles con los mismos instrumentos que miden los fármacos reales.',
    mecanismo: 'El placebo opera a través de dos mecanismos. El primero es la expectativa: la anticipación de una mejora activa el sistema de recompensa y el eje hipotálamo-hipófisis-suprarrenal, que libera hormonas que modulan el dolor y la inflamación. El segundo es el condicionamiento clásico: si el paciente ha recibido un fármaco activo en un contexto similar, ese contexto (el olor de la consulta, el uniforme del médico, el color de la pastilla) actúa como estímulo condicionado que desencadena las mismas respuestas fisiológicas previas.',
    mecanismo2: 'Lo más perturbador para la ética médica es el placebo abierto: en ensayos recientes, pacientes a quienes se les dijo explícitamente "esta pastilla no contiene ningún principio activo" mostraron igualmente mejoras significativas frente al grupo sin tratamiento. El ritual del tratamiento parece tener efectos propios, independientemente del engaño. La expectativa del paciente es, en sí misma, un agente farmacológico.'
  },
  'bystander': {
    explicacion2: 'Los experimentos de Darley y Latané identificaron dos mecanismos independientes que actúan simultáneamente. El primero es la difusión de responsabilidad: cuando hay más personas, cada una asume que otra se hará cargo, y la responsabilidad se divide como si fuera un fluido. El segundo es la ignorancia pluralista: al ver que nadie más reacciona, cada espectador interpreta que la situación no es urgente, aunque todos estén haciendo exactamente lo mismo por la misma razón.',
    mecanismo: 'La presencia de otros activa un proceso de comparación social: antes de actuar en una situación ambigua, el cerebro busca pistas en el comportamiento de los demás para calibrar si la respuesta alarmada es apropiada. Si los otros parecen tranquilos, la señal interna de alarma se inhibe. El resultado paradójico es que cuantos más testigos hay, más atenúa cada uno su propia alarma al inferir que los demás no la perciben como grave.',
    mecanismo2: 'El efecto tiene una aplicación directa y documentada: se rompe explícitamente. Si en una situación de emergencia señalas a una persona concreta —"usted, con la chaqueta azul, llame al 112"— la difusión de responsabilidad se elimina porque la responsabilidad deja de ser difusa. Este simple acto activa el sistema de acción en lugar del de comparación social, y es la técnica más eficaz enseñada en formaciones de respuesta a emergencias.'
  },
  'retrospectiva': {
    explicacion2: 'La razón por la que el sesgo resiste la introspección es que la memoria que se actualiza no es la declarativa («¿qué creía antes?») sino la huella implícita de certeza. Cuando el participante trata de recordar su estimación original, no accede a un archivo intacto: accede a una representación ya modificada por el conocimiento del resultado. No recuerda haber sido incierto porque la memoria de la incertidumbre ha sido sobreescrita.',
    mecanismo: 'El mecanismo es la reconsolidación de la memoria de certeza subjetiva. Saber el resultado activa retroactivamente los recuerdos previos y los procesa como si ese resultado hubiera sido el más probable. El cerebro no distingue entre "lo sabía antes" y "ahora sé que era el resultado más probable". La certeza retroactiva es la norma, no la excepción, porque el sistema de memoria favorece la coherencia narrativa sobre la precisión histórica.',
    mecanismo2: 'Las consecuencias para el aprendizaje son graves: médicos, inversores y tomadores de decisiones que evalúan sus elecciones pasadas mediante el sesgo de retrospectiva no aprenden de sus errores reales porque reorganizan el pasado para que sus decisiones "parecieran razonables en ese momento". La autocorrección efectiva requiere notas escritas antes de conocer los resultados —el único mecanismo que ha demostrado contrarrestar el sesgo de forma sistemática.'
  },
  'mera-exposicion': {
    explicacion2: 'El hallazgo más sorprendente de Zajonc fue que el efecto funcionaba con estimulación subliminal: cuando los caracteres se presentaban por debajo del umbral de percepción consciente (demasiado brevemente para ser reportados), la preferencia aumentaba igualmente con la frecuencia de exposición. Esto demuestra que el efecto opera a un nivel de procesamiento más temprano que el reconocimiento consciente: la familiaridad genera preferencia sin necesitar que el individuo sepa qué es familiar.',
    mecanismo: 'El mecanismo propuesto es la fluidez de procesamiento: los estímulos familiares se procesan con menos esfuerzo cognitivo que los novedosos. El cerebro interpreta esa fluidez como señal de que el estímulo es seguro, conocido y positivo. En términos evolutivos, "lo que ya he visto antes no me mató" es una heurística razonable. En el mundo moderno, esa señal la generan también logotipos, candidatos políticos e ideas repetidas en los medios.',
    mecanismo2: 'La potencia del efecto aumenta cuando el estímulo inicial es neutro o ligeramente negativo: la exposición repetida puede convertir una reacción de malestar en indiferencia y después en preferencia. Esta es la base del condicionamiento en publicidad: aunque no sea junto a estímulos positivos, simplemente mostrar una marca repetidamente ya incrementa el afecto hacia ella. La familiaridad es la forma más silenciosa de persuasión.'
  },
  'anclaje': {
    explicacion2: 'En 2006, Ariely, Loewenstein y Prelec replicaron el efecto con productos reales: pedían a participantes que anotaran los dos últimos dígitos de su número de seguro social y luego pujaran por botellas de vino y chocolatinas. Los participantes con los números más altos pujaban entre un 60% y un 120% más que los de números bajos. Su propio número de seguro social —completamente irrelevante para el valor de la botella— ancló sistemáticamente su disposición a pagar.',
    mecanismo: 'El proceso funciona en dos fases. En la primera, el ancla se activa y se establece como punto de referencia mental, independientemente de su relevancia para la tarea. En la segunda, el cerebro genera un juicio ajustando desde ese ancla en la dirección correcta, pero el ajuste siempre es insuficiente: se detiene en cuanto llega a un valor que "parece plausible", sin continuar hasta el valor correcto. La insuficiencia del ajuste es el núcleo del sesgo.',
    mecanismo2: 'Existen dos tipos de anclaje con mecanismos distintos. El ancla informativa ocurre cuando el valor inicial proporciona información sobre el rango plausible. El ancla incidental es más inquietante: ocurre aunque el ancla sea explícitamente irrelevante (como la ruleta de Kahneman). Para el segundo tipo, ninguna estrategia conocida elimina el efecto por completo, aunque usar múltiples referencias independientes antes de decidir y preguntarse "¿de dónde viene este número?" puede atenuarlo parcialmente.'
  },
  'barnum': {
    explicacion2: 'El nombre viene de P.T. Barnum, empresario del siglo XIX al que se atribuye la frase "hay un ingenuo naciendo cada minuto". Barnum construía atracciones vagas que cada espectador rellenaba con su propia interpretación. El fenómeno también explica por qué los polígrafos no son fiables: el examinado tiende a validar cualquier interpretación que parezca plausible. Y es la base de todas las lecturas del tarot, la grafología y muchos cuestionarios de personalidad corporativos sin base científica.',
    mecanismo: 'Dos procesos cooperan para producir el efecto. El primero es la validación personal: las afirmaciones positivas vagas activan el autoconcepto del receptor, que las procesa buscando evidencia de que son ciertas en su caso particular. El segundo es ignorar la tasa base: el sujeto evalúa si la descripción se le aplica, pero no considera si se le aplicaría igualmente a cualquier otra persona. El resultado es una ilusión de especificidad construida sobre generalidades.'
  },
  'disponibilidad': {
    explicacion2: 'Tversky y Kahneman identificaron tres fuentes de disponibilidad que distorsionan el juicio de frecuencia: la imaginabilidad (lo más fácil de imaginar parece más probable), la familiaridad (los eventos frecuentemente mencionados en medios parecen más comunes) y el sesgo de asociación (un evento pasado vivido con intensidad emocional distorsiona las estimaciones para eventos similares). Las tres operan sin que el sujeto sea consciente de que su estimación de probabilidad está siendo generada por la facilidad de recuperación en lugar de por datos reales.',
    mecanismo: 'El mecanismo es la confusión entre fluidez de recuperación y frecuencia real. El cerebro usa la señal "¿qué tan fácilmente me viene a la mente un ejemplo?" como proxy para "¿qué tan frecuente es esto?". Esa señal es normalmente una buena aproximación: eventos más frecuentes dejan más trazos mnémicos y son más fáciles de recuperar. El problema es que la fluidez de recuperación está también determinada por la relevancia emocional, la recencia y la cobertura mediática —factores independientes de la frecuencia real.'
  },
  'pigmalion': {
    explicacion2: 'El efecto opera a través de cuatro mecanismos conductuales identificados por Rosenthal: el clima (los profesores crean un ambiente más cálido con los alumnos de quienes esperan más), el input (les asignan tareas más desafiantes), el output (les dan más tiempo para responder y piden respuestas más elaboradas) y el feedback (les proporcionan retroalimentación más detallada). Ninguno de estos comportamientos era consciente: los profesores no sabían que estaban tratando de forma diferente a los alumnos etiquetados.',
    mecanismo: 'El mecanismo es un bucle de expectativa-comportamiento-confirmación. Las expectativas del profesor modifican su conducta de formas micrométricas: el tiempo que espera antes de dar la respuesta, la cantidad de pistas que ofrece, el tono con que formula las preguntas. El alumno percibe estas señales y ajusta su autopercepción de competencia, lo que modifica su rendimiento real, lo que confirma las expectativas iniciales. El efecto no requiere que ninguna de las partes sea consciente del ciclo.'
  },
  'superviviente': {
    explicacion2: 'Wald fue más allá: calculó la distribución esperada de impactos si los daños fueran aleatorios, y la comparó con la observada en los supervivientes. Las zonas "limpias" de impactos en los aviones que regresaban no eran afortunadas: eran zonas cuyo daño garantizaba que el avión no regresara. Su análisis contradecía directamente la recomendación de los ingenieros militares, que veían los mismos datos pero los interpretaban con el sesgo del superviviente.',
    mecanismo: 'El sesgo ocurre cuando la muestra observable está sistemáticamente correlacionada con el resultado de interés. Los supervivientes (o éxitos, o regresantes) son visibles; los no-supervivientes son invisibles. Si el proceso que determina quién llega a ser observable está relacionado con la variable que se investiga, cualquier análisis de la muestra visible generará conclusiones sesgadas. La corrección requiere preguntarse activamente: "¿Quién no está en esta muestra y por qué?"',
    mecanismo2: 'En la práctica moderna, el sesgo del superviviente impregna industrias enteras: los fondos de inversión que quebraron desaparecen de las bases de datos de rendimiento histórico, haciendo que el promedio de los fondos supervivientes parezca mejor de lo que es la industria real. Los libros de historia empresarial solo entrevistan a las empresas que sobrevivieron. La única inmunización es la disciplina de buscar explícitamente los datos de los que no llegaron.'
  },
  'autoservicio': {
    explicacion2: 'El sesgo tiene variaciones interculturales importantes. En culturas colectivistas (Japón, China), el sesgo puede invertirse parcialmente en contextos grupales: los individuos atribuyen los fracasos del grupo a sí mismos para proteger la armonía colectiva. Sin embargo, en tareas individuales, el sesgo de autoservicio es igualmente robusto en todas las culturas estudiadas, lo que sugiere que su base es motivacional (protección de la autoestima) más que cultural.',
    mecanismo: 'El sesgo sirve a dos funciones psicológicas distintas. La primera es la autopotenciación: mantener una visión positiva de uno mismo incrementa la autoconfianza, la persistencia ante los obstáculos y la disposición a asumir riesgos. La segunda es la gestión de la reputación: atribuir éxitos a factores internos y fracasos a externos es la estrategia óptima para la imagen social. El sesgo sirve simultáneamente a la psicología interna y a la comunicación externa, lo que lo hace extremadamente resistente.'
  },
  'primacia': {
    explicacion2: 'El efecto de primacía tiene una contraparte temporal: el efecto de recencia. En listas largas, tanto los primeros elementos como los últimos se recuerdan mejor que los del medio. La primacía domina en impresiones de personas y conceptos, donde el primer dato establece el marco; la recencia domina en listas de ítems neutros. En una evaluación social, lo que dices primero y lo que dices al final son desproporcionadamente influyentes; lo que ocurre en el medio tiene peso mínimo.',
    mecanismo: 'El mecanismo es la activación de esquemas interpretativos. El primer dato sobre una persona no es solo un dato: activa una categoría mental ("este tipo de persona") que proporciona el contexto en el que se procesan todos los datos siguientes. Si el primer adjetivo es "inteligente", los datos ambiguos posteriores se interpretan a la luz del esquema "persona inteligente". Si el primero es "envidioso", los mismos datos ambiguos se interpretan bajo el esquema "persona problemática". Los datos no tienen peso absoluto: su peso depende del marco activado antes de recibirlos.'
  },
  'optimismo': {
    explicacion2: 'El sesgo no es uniforme: es mayor para eventos negativos de baja probabilidad y alta severidad (enfermedades graves, accidentes), y menor para eventos cotidianos de probabilidad media. Paradójicamente, la protección del sesgo es mayor exactamente donde su corrección sería más valiosa: las personas aceptan razonablemente bien que pueden coger un resfriado, pero subestiman sistemáticamente su riesgo de cáncer o accidente de tráfico.',
    mecanismo: 'Sharot y sus colegas identificaron el sustrato neurológico. Cuando actualizamos creencias sobre el futuro, el córtex prefrontal izquierdo inferior procesa la información positiva de forma completa, mientras que el procesamiento de información negativa se atenúa. Esta asimetría no es cognitiva sino neurológica: el cerebro literalmente procesa las malas noticias con menos recursos que las buenas. El resultado es una actualización sistemáticamente sesgada hacia el optimismo en las estimaciones sobre el propio futuro.',
    mecanismo2: 'La aplicación práctica tiene dos caras. La primera es protectora: el sesgo de optimismo mantiene la motivación, reduce el estrés y mejora la salud (los optimistas tienen mejores resultados cardiovasculares y de recuperación tras cirugía). La segunda es peligrosa: el mismo sesgo alimenta proyecciones empresariales irrealistas, subestimación del riesgo financiero y negligencia en comportamientos preventivos de salud. La clave no es eliminar el optimismo sino calibrarlo con datos reales cuando la decisión importa.'
  },
  'bandwagon': {
    explicacion2: 'La investigación moderna de redes sociales ha cuantificado el efecto con precisión. Salganik, Dodds y Watts crearon en 2006 una plataforma de música experimental donde distintos grupos podían o no ver cuántas veces había sido descargada cada canción. En versiones donde las descargas eran visibles, los éxitos eran más exitosos y los fracasos más fracasados. El mismo conjunto de canciones generaba distribuciones de éxito radicalmente distintas dependiendo únicamente de si los usuarios podían ver las elecciones de los demás.',
    mecanismo: 'El efecto opera a través de la heurística de prueba social: en condiciones de incertidumbre, el comportamiento de otros proporciona información sobre qué elección es probablemente correcta. En entornos ancestrales, seguir al grupo era frecuentemente la decisión óptima. En el mundo moderno, esa misma heurística se activa ante la popularidad de una idea, un candidato o un producto, independientemente de su valor intrínseco. La certeza del grupo sustituye al análisis propio porque el análisis propio es caro cognitivamente.',
    mecanismo2: 'El diseño de plataformas digitales explota sistemáticamente este mecanismo: los "likes", los recuentos de seguidores y las recomendaciones algorítmicas basadas en popularidad son señales de prueba social que amplifican el bandwagon a escala industrial. Una idea con muchos compartidos parece más verdadera que la misma idea con pocos, aunque el contenido sea idéntico. La popularidad social es el proxy cognitivo más potente de verdad en ausencia de criterio propio.'
  },
  'status-quo': {
    explicacion2: 'El sesgo se manifiesta con especial intensidad cuando las alternativas son complejas o numerosas. En experimentos sobre la paradoja de la elección, la opción por defecto era elegida más frecuentemente cuanto más opciones alternativas se presentaban, incluso cuando las opciones adicionales eran explícitamente superiores. La complejidad amplifica el sesgo porque calcular el coste del cambio se vuelve más difícil, y la inercia de quedarse como está se presenta como la única certeza en un mar de incertidumbre.',
    mecanismo: 'El sesgo del statu quo es el resultado de la interacción entre aversión a las pérdidas y aversión a la incertidumbre. El statu quo tiene la ventaja asimétrica de ser conocido: sus inconvenientes son familiares y predecibles, mientras que los de la alternativa son inciertos. Como las pérdidas duelen más que las ganancias equivalentes, y como los inconvenientes del cambio incluyen el componente adicional de la incertidumbre, el statu quo supera sistemáticamente a las alternativas objetivamente superiores en la evaluación subjetiva.',
    mecanismo2: 'La implicación para el diseño de sistemas es profunda y documentada. Los sistemas opt-out (todos participan por defecto, pueden salir si quieren) generan tasas de participación del 85-90%; los opt-in (hay que apuntarse activamente) generan tasas del 15-20% para los mismos programas. Esta asimetría es la base del diseño de "nudges" de Thaler y Sunstein: cambiar la opción por defecto es la intervención política con mayor impacto por unidad de coste en salud pública y ahorro previsional.'
  },
  'efecto-espejo': {
    explicacion2: 'Chartrand y Bargh establecieron que la mímica no solo genera simpatía: también produce comportamiento prosocial en cascada. Los participantes que habían sido imitados donaban más a causas benéficas, ayudaban más en tareas no relacionadas con el experimento y reportaban mayor sentido de conexión social general. La imitación activa un mecanismo de pertenencia grupal con efectos que van mucho más allá de la interacción inmediata.',
    mecanismo: 'El mecanismo involucra el sistema de neuronas espejo: neuronas que se activan tanto al ejecutar una acción como al observarla en otro. La imitación mutua sincroniza los estados internos de los interlocutores, lo que el cerebro interpreta como señal de afiliación y seguridad grupal. En términos evolutivos, los individuos que imitaban a los miembros del propio grupo construían alianzas más sólidas. La mímica es el lenguaje no verbal de la pertenencia.',
    mecanismo2: 'El efecto espejo tiene una aplicación clínica importante: la mímica terapéutica deliberada (adaptar el ritmo del habla, la postura y el tono al del paciente) es parte del mecanismo detrás de la alianza terapéutica, uno de los predictores más robustos del éxito del tratamiento psicológico. El terapeuta no comunica solo con sus palabras: su cuerpo le dice al paciente "estoy aquí, somos del mismo bando" con cada gesto sincronizado. Ignorar esta dimensión es ignorar más de la mitad de la comunicación terapéutica real.'
  }
};


/* ── PROGRESS TRACKER + RACHA ────────────────────────────────── */
(function () {
  const LS_EFECTOS   = 'li_efectos_seen';
  const LS_MITOS     = 'li_mitos_answered';
  const LS_PRUEBAS   = 'li_pruebas_done';
  const LS_STREAK    = 'li_streak';
  const LS_LAST      = 'li_last_visit';
  const LS_LIB_READ  = 'li_lib_read';
  const LS_WEEKLY_R  = 'li_weekly_read';
  const TOTAL_EFECTOS = 18;
  const TOTAL_MITOS   = 20;
  const TOTAL_PRUEBAS = 8;

  function getSeenEfectos()  { try { return JSON.parse(localStorage.getItem(LS_EFECTOS)  || '[]'); } catch { return []; } }
  function getMitosCount()   { return parseInt(localStorage.getItem(LS_MITOS)   || '0', 10); }
  function getPruebasCount() { return parseInt(localStorage.getItem(LS_PRUEBAS) || '0', 10); }
  function getReadLib()      { try { return JSON.parse(localStorage.getItem(LS_LIB_READ) || '[]'); } catch { return []; } }
  function getReadWeekly()   { try { return JSON.parse(localStorage.getItem(LS_WEEKLY_R) || '[]'); } catch { return []; } }
  function getQuizzesDone()  { try { return Object.keys(JSON.parse(localStorage.getItem('li_quizzes') || '{}')).length; } catch { return 0; } }
  function getDesafiosDone() { try { return Object.keys(JSON.parse(localStorage.getItem('li_challenges') || '{}')).length; } catch { return 0; } }

  /* ── Racha de visitas ── */
  function calcStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const last  = localStorage.getItem(LS_LAST);
    let   streak = parseInt(localStorage.getItem(LS_STREAK) || '0', 10);
    if (!last) {
      streak = 1;
    } else if (last === today) {
      /* misma sesión, no cambiar */
    } else {
      const diff = Math.round((new Date(today) - new Date(last)) / 86400000);
      streak = diff === 1 ? streak + 1 : 1;
    }
    lsSet(LS_LAST, today);
    lsSet(LS_STREAK, streak);
    return streak;
  }

  calcStreak();

  function updateUI() {
    const totalLib     = Object.values(LIBRARY_ARTICLES).flat().length;
    const totalWeekly  = WEEKLY_ARTICLES.length;
    const totalQuizzes = Object.keys(QUIZ_BANK).length;
    const totalDesafios= Object.keys(DESAFIOS_SEMANA).length;

    const artRead      = getReadLib().length;
    const weekRead     = getReadWeekly().length;
    const efectosSeen  = getSeenEfectos().length;
    const mitosAnsw    = Math.min(getMitosCount(),   TOTAL_MITOS);
    const pruebasDone  = Math.min(getPruebasCount(), TOTAL_PRUEBAS);
    const quizzesDone  = getQuizzesDone();
    const desafiosDone = getDesafiosDone();

    function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }

    const sets = [
      ['pt-articulos-bar',  'pt-articulos-count',  artRead,      totalLib,       totalLib],
      ['pt-semanales-bar',  'pt-semanales-count',  weekRead,     totalWeekly,    totalWeekly],
      ['pt-efectos-bar',    'pt-efectos-count',    efectosSeen,  TOTAL_EFECTOS,  TOTAL_EFECTOS],
      ['pt-mitos-bar',      'pt-mitos-count',      mitosAnsw,    TOTAL_MITOS,    TOTAL_MITOS],
      ['pt-quizzes-bar',    'pt-quizzes-count',    quizzesDone,  totalQuizzes,   totalQuizzes],
      ['pt-desafios-bar',   'pt-desafios-count',   desafiosDone, totalDesafios,  totalDesafios],
      ['pt-pruebas-bar',    'pt-pruebas-count',    pruebasDone,  TOTAL_PRUEBAS,  TOTAL_PRUEBAS],
    ];
    sets.forEach(([barId, cntId, val, total, display]) => {
      const bar = document.getElementById(barId);
      const cnt = document.getElementById(cntId);
      const p   = pct(val, total);
      if (bar) {
        bar.style.width = p + '%';
        /* Actualizar atributos ARIA para lectores de pantalla */
        const wrap = bar.parentElement;
        if (wrap) {
          wrap.setAttribute('role', 'progressbar');
          wrap.setAttribute('aria-valuemin', '0');
          wrap.setAttribute('aria-valuemax', '100');
          wrap.setAttribute('aria-valuenow', p);
          wrap.setAttribute('aria-label', cntId.replace('pt-', '').replace('-count', '').replace(/-/g, ' '));
        }
      }
      if (cnt) cnt.textContent = val + ' / ' + display;
    });

    const strk = document.getElementById('pt-streak-value');
    if (strk) {
      const cur = parseInt(localStorage.getItem(LS_STREAK) || '0', 10);
      strk.textContent = cur + (cur === 1 ? ' día' : ' días');
      strk.classList.toggle('streak-hot', cur >= 3);
    }
  }

  /* Hook en apertura de efectos */
  document.querySelectorAll('.efecto-card[data-efecto]').forEach(card => {
    card.addEventListener('click', () => {
      const id   = card.dataset.efecto;
      const seen = getSeenEfectos();
      if (!seen.includes(id)) {
        seen.push(id);
        lsSet(LS_EFECTOS, JSON.stringify(seen));
        updateUI();
      }
    });
  });

  /* Hook en respuesta de mitos */
  document.querySelectorAll('.mito-tf-card').forEach(card => {
    let tracked = false;
    card.querySelectorAll('.tf-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (tracked) return;
        tracked = true;
        const count = Math.min(getMitosCount() + 1, 20);
        lsSet(LS_MITOS, count);
        updateUI();
      });
    });
  });

  /* Hook en artículo semanal visto */
  window._LI_markWeeklyRead = function(week) {
    const r = getReadWeekly();
    if (!r.includes(week)) {
      r.push(week);
      lsSet(LS_WEEKLY_R, JSON.stringify(r));
      updateUI();
    }
  };

  window._LI_incrementPrueba = function () {
    const count = Math.min(getPruebasCount() + 1, TOTAL_PRUEBAS);
    lsSet(LS_PRUEBAS, count);
    updateUI();
  };

  /* Actualizar cuando quiz o desafío cambian */
  window._LI_updateProgress = updateUI;

  updateUI();
}());


/* ── SHARE BUTTONS EN DOC-CARDS ──────────────────────────────── */
(function () {
  const SVG_SHARE = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;

  function makeShareBtn(label) {
    const btn = document.createElement('button');
    btn.className   = 'doc-share-btn';
    btn.innerHTML   = SVG_SHARE + ' Compartir';
    btn.setAttribute('aria-label', label || 'Compartir este artículo');
    let timer = null;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const url = window.location.href.split('?')[0];
      function onCopied() {
        btn.classList.add('copied');
        btn.innerHTML = SVG_SHARE + ' ¡Copiado!';
        clearTimeout(timer);
        timer = setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = SVG_SHARE + ' Compartir';
        }, 2000);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(onCopied).catch(onCopied);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
        onCopied();
      }
    });
    return btn;
  }

  /* Tarjeta destacada: añadir al doc-aside */
  const featuredAside = document.querySelector('.doc-card.doc-featured .doc-aside');
  if (featuredAside) featuredAside.appendChild(makeShareBtn('Compartir artículo destacado'));

  /* Tarjetas del grid: añadir al doc-card-actions */
  document.querySelectorAll('#docs-grid-2 .doc-card').forEach(card => {
    const actions = card.querySelector('.doc-card-actions');
    if (actions) actions.appendChild(makeShareBtn('Compartir artículo'));
  });
}());


/* ── TIMELINE ───────────────────────────────────────────────── */
(function () {
  const HITOS = [
    { año: '1848', tag: 'Phineas Gage · Vermont', cat: 'neuro', emoji: '⚡',
      titulo: 'El cerebro que cambió con una barra de hierro',
      desc: 'Una explosión lanza una barra de hierro a través del cráneo de Gage. Sobrevive. Pero su personalidad cambia por completo: de trabajador disciplinado a impulsivo e irresponsable.',
      importa: 'Fue la primera evidencia de que la personalidad tiene base biológica y que el daño en el lóbulo frontal la transforma. Hoy ese principio guía la neuropsicología clínica y la rehabilitación.' },

    { año: '1885', tag: 'Hermann Ebbinghaus · Berlín', cat: 'cognitivo', emoji: '📉',
      titulo: 'La curva del olvido: por qué olvidamos casi todo en 24 horas',
      desc: 'Ebbinghaus se convierte en su propio sujeto experimental: memoriza miles de sílabas sin sentido y mide cuánto retiene con el tiempo. Descubre que el olvido sigue una curva predecible y exponencial.',
      importa: 'Su hallazgo es el fundamento de todas las técnicas de repetición espaciada (Anki, Duolingo). Si estudias hoy y revisas mañana, retienes entre 3 y 5 veces más que si solo estudias hoy.' },

    { año: '1890', tag: 'William James · Harvard', cat: 'cognitivo', emoji: '📖',
      titulo: 'La atención como recurso limitado',
      desc: 'James publica los Principios de Psicología y describe la atención como un recurso finito y voluntario: "La facultad de traer de vuelta una mente que divaga, una y otra vez, es la raíz misma de la voluntad."',
      importa: 'Describió en 1890 exactamente lo que la neurociencia moderna confirma con neuroimagen. La lucha con las notificaciones y el multitasking es exactamente el problema que James formuló.' },

    { año: '1906', tag: 'Ivan Pavlov · San Petersburgo', cat: 'conductual', emoji: '🔔',
      titulo: 'El perro que salivaba al escuchar una campana',
      desc: 'Pavlov descubre por accidente que sus perros salivaban al ver llegar al técnico —antes de ver la comida. Sistematiza el condicionamiento clásico: un estímulo neutro, asociado repetidamente a uno significativo, produce la misma respuesta.',
      importa: 'Explica los miedos irracionales, las adicciones, el marketing de marcas y los rituales deportivos. Tu respuesta emocional ante una canción de la infancia es condicionamiento clásico puro.' },

    { año: '1913', tag: 'John B. Watson · Johns Hopkins', cat: 'conductual', emoji: '🔬',
      titulo: 'El manifiesto que borró la mente de la psicología',
      desc: 'Watson publica el "Manifiesto conductista": la psicología debe estudiar solo lo observable y medible. La consciencia, las emociones internas y los procesos mentales quedan fuera del ámbito científico.',
      importa: 'Aunque el conductismo extremo fue superado, su método —medir comportamientos observables— sigue siendo la columna vertebral del diseño experimental en psicología y de terapias como la TCC.' },

    { año: '1920', tag: 'Edward Thorndike · Columbia', cat: 'social', emoji: '👁',
      titulo: 'El efecto halo: una cualidad colorea todo lo demás',
      desc: 'Thorndike descubre que los oficiales militares califican a sus subordinados de forma idéntica en atributos tan distintos como aspecto físico, inteligencia y liderazgo. Una característica positiva contamina todas las demás.',
      importa: 'Afecta cada entrevista de trabajo, cada evaluación educativa y cada jurado penal. Los candidatos más atractivos cobran un 10% más en igualdad de condiciones. El efecto halo no discrimina.' },

    { año: '1938', tag: 'B. F. Skinner · Minnesota', cat: 'conductual', emoji: '🎮',
      titulo: 'Cómo las recompensas moldean el comportamiento —y nos atrapan',
      desc: 'Skinner inventa la "caja de Skinner" y documenta el condicionamiento operante: el comportamiento seguido de refuerzo se repite; el seguido de castigo se extingue. El refuerzo variable (impredecible) produce la mayor persistencia.',
      importa: 'El scroll infinito de las redes sociales es refuerzo variable aplicado a escala industrial. Las tragaperras, los "me gusta" y las cajas de recompensa de los videojuegos son ingeniería skinneriana.' },

    { año: '1943', tag: 'Abraham Maslow · Brooklyn College', cat: 'humanista', emoji: '🏔',
      titulo: 'La pirámide que explica por qué el dinero no basta',
      desc: 'Maslow propone que las necesidades humanas forman una jerarquía: fisiológicas → seguridad → pertenencia → estima → autorrealización. No se puede aspirar a las superiores sin tener cubiertas las inferiores.',
      importa: 'Aunque la pirámide exacta ha sido cuestionada empíricamente, el principio sigue siendo válido: un trabajador que no se siente seguro en su empleo no puede dar su mejor desempeño creativo, aunque le paguen muy bien.' },

    { año: '1957', tag: 'Leon Festinger · Stanford', cat: 'cognitivo', emoji: '⚡',
      titulo: 'Disonancia cognitiva: el malestar de contradecirse a uno mismo',
      desc: 'Festinger infiltra una secta que predice el fin del mundo. Cuando no ocurre, los miembros no abandonan la fe —la refuerzan y hacen proselitismo. Documentó cómo el cerebro resuelve la contradicción entre creencias y hechos.',
      importa: 'Explica por qué es tan difícil cambiar de opinión con argumentos. La disonancia se resuelve cambiando la creencia o descartando el argumento, y el segundo camino cuesta menos. La racionalización es la salida más usada.' },

    { año: '1960', tag: 'Peter Wason · UCL', cat: 'cognitivo', emoji: '🃏',
      titulo: 'El sesgo que hace que busquemos tener razón en lugar de buscar la verdad',
      desc: 'El problema de selección de Wason muestra que el 90% de las personas busca confirmar una hipótesis en lugar de intentar falsificarla, incluso cuando la tarea requiere explícitamente lo contrario.',
      importa: 'Es la raíz de las cámaras de eco, el pensamiento tribal y la pseudociencia. Los mejores científicos y los mejores tomadores de decisiones tienen algo en común: buscan activamente evidencia contra sus propias teorías.' },

    { año: '1961', tag: 'Albert Bandura · Stanford', cat: 'social', emoji: '👦',
      titulo: 'El muñeco Bobo: aprendemos lo que vemos, aunque nadie nos lo enseñe',
      desc: 'Niños que observan a un adulto golpear un muñeco inflable repiten exactamente las mismas conductas después, sin haber sido reforzados ni instruidos. El aprendizaje vicario no requiere práctica.',
      importa: 'Fundamenta la investigación sobre violencia en medios, modelos en redes sociales y liderazgo. Los comportamientos que observamos —de nuestros padres, jefes o influencers— se integran en nuestro repertorio sin que lo notemos.' },

    { año: '1963', tag: 'Stanley Milgram · Yale', cat: 'social', emoji: '⚡',
      titulo: 'El experimento que mostró que casi todos podemos causar daño si nos lo piden',
      desc: 'El 65% de participantes ordinarios administró lo que creía que eran descargas eléctricas dolorosas a desconocidos, siguiendo las instrucciones de un experimentador con bata blanca.',
      importa: 'No habla de maldad individual, sino del poder de la autoridad y la situación. Predice obediencia en estructuras jerárquicas. El principio se usa en ética empresarial: diseñar sistemas que dificulten conductas dañinas, no solo prohibirlas.' },

    { año: '1968', tag: 'Darley & Latané · Columbia', cat: 'social', emoji: '👥',
      titulo: 'Efecto espectador: más testigos, menos ayuda',
      desc: 'El 85% de personas que creen ser el único testigo de una emergencia interviene. Cuando creen que hay 5 testigos más, solo el 31% actúa. La responsabilidad se diluye entre los presentes.',
      importa: 'En equipos de trabajo, las tareas asignadas a "todos" tienden a no hacerse. En entornos digitales, una petición de ayuda con muchos destinatarios obtiene menos respuesta que una dirigida a una persona concreta.' },

    { año: '1971', tag: 'Philip Zimbardo · Stanford', cat: 'social', emoji: '🔒',
      titulo: 'La prisión de Stanford: los roles cambian quiénes somos',
      desc: 'Estudiantes universitarios asignados aleatoriamente a roles de guardia o prisionero en una prisión simulada comenzaron a actuar con violencia y trauma en menos de seis días. El experimento se interrumpió.',
      importa: 'Los roles y los contextos institucionales moldean el comportamiento más rápido y profundamente de lo que creemos. La pregunta no es "¿quién haría algo así?" sino "¿qué condiciones llevan a cualquiera a hacerlo?"' },

    { año: '1973', tag: 'Kahneman & Tversky · Israel', cat: 'cognitivo', emoji: '🧩',
      titulo: 'Atajos mentales que funcionan —y que nos llevan a errores sistemáticos',
      desc: 'Documentan las heurísticas cognitivas: la disponibilidad (lo que recuerdas fácil parece más probable), el anclaje (el primer número sesgua todos los demás) y la representatividad (lo que parece un X probablemente es un X).',
      importa: 'Explican por qué somos malos estimando riesgos, por qué los precios tachados funcionan, por qué los titulares sensacionalistas distorsionan la percepción de la realidad y por qué los primeros datos de una negociación son los más poderosos.' },

    { año: '1974', tag: 'Elizabeth Loftus · Washington', cat: 'cognitivo', emoji: '🧠',
      titulo: 'La memoria no graba: construye, y cada vez que recuerdas, reescribes',
      desc: 'Un verbo diferente en una pregunta ("¿A qué velocidad iban cuando chocaron?" vs "cuando se tocaron") cambia la velocidad estimada y planta recuerdos de cristales rotos que no existían.',
      importa: 'Más del 69% de las condenas erróneas revertidas por ADN incluyeron testimonio ocular como prueba principal. Tu recuerdo más vívido puede ser el más modificado. Cada vez que lo evocas, lo reescribes un poco.' },

    { año: '1975', tag: 'Mihaly Csikszentmihalyi · Chicago', cat: 'humanista', emoji: '🌊',
      titulo: 'El flujo: cuando el tiempo desaparece y el rendimiento es máximo',
      desc: 'Entrevistando a escaladores, cirujanos, ajedrecistas y artistas, Csikszentmihalyi identifica un estado de concentración total —con desafío y habilidad perfectamente equilibrados— donde el yo desaparece y el trabajo fluye.',
      importa: 'No es una metáfora: el flujo reduce la actividad en la corteza prefrontal (autoconsciencia) y activa el sistema de recompensa. Diseñar tu entorno de trabajo para facilitarlo es la intervención de productividad con mayor retorno.' },

    { año: '1977', tag: 'Albert Bandura · Stanford', cat: 'social', emoji: '💪',
      titulo: 'Autoeficacia: creer que puedes hacerlo cambia si lo haces',
      desc: 'Bandura demuestra que la creencia en la propia capacidad de ejecutar una tarea es uno de los predictores más potentes del rendimiento, por encima de la habilidad objetiva en muchos contextos.',
      importa: 'Las personas con alta autoeficacia se recuperan más rápido de los fracasos, eligen desafíos más altos y persisten más. El feedback que construye autoeficacia ("lo lograste porque te esforzaste") es fundamentalmente diferente del que la destruye.' },

    { año: '1979', tag: 'Kahneman & Tversky · Israel', cat: 'cognitivo', emoji: '📊',
      titulo: 'Teoría Prospectiva: perder duele dos veces más que ganar alegra',
      desc: 'La función de valor en forma de S demuestra que las pérdidas tienen un impacto psicológico 1,5 a 2,5 veces mayor que las ganancias equivalentes. El dolor de perder 100€ supera el placer de ganarlos.',
      importa: 'Explica por qué los inversores aguantan posiciones perdedoras, por qué los descuentos funcionan mejor que los precios bajos directos, y por qué los "últimas 3 plazas" en webs de viajes son tan efectivos.' },

    { año: '1984', tag: 'Robert Cialdini · Arizona State', cat: 'social', emoji: '🎭',
      titulo: 'Los seis atajos que hacen que digamos sí sin querer',
      desc: 'Tras tres años infiltrado en sectores de ventas, Cialdini sistematiza los principios de influencia: reciprocidad, escasez, autoridad, coherencia, prueba social y simpatía. Cada uno explota un atajo cognitivo legítimo.',
      importa: 'Son tan efectivos porque funcionan incluso cuando los conoces. El cerebro usa atajos porque la deliberación completa es imposible para cada decisión. Conocerlos da un segundo de distancia; no los elimina, pero ayuda.' },

    { año: '1990', tag: 'Martin Seligman · Pennsylvania', cat: 'clinico', emoji: '☀',
      titulo: 'El giro: de estudiar lo que nos destruye a estudiar lo que nos hace florecer',
      desc: 'Seligman, como presidente de la APA, propone reformular la psicología: de ciencia del trastorno a ciencia del bienestar. Nace la psicología positiva con evidencia sobre fortalezas, sentido y optimismo aprendido.',
      importa: 'No es autoayuda con bata: PERMA (Positive emotions, Engagement, Relationships, Meaning, Achievement) es un modelo empírico de bienestar. Sus aplicaciones en escuelas y organizaciones tienen estudios controlados con resultados medibles.' },

    { año: '1994', tag: 'Antonio Damasio · Iowa', cat: 'neuro', emoji: '💭',
      titulo: 'Las emociones no interfieren con la razón: son su fundamento',
      desc: 'Pacientes con daño en la corteza prefrontal ventromedial tienen inteligencia intacta pero no pueden tomar decisiones simples. Sin la señal emocional que guía las opciones, la deliberación racional no puede comenzar.',
      importa: 'Desmiente siglos de filosofía que separaban razón y emoción. Las personas que suprimen emociones no deciden mejor: deciden peor. Las emociones no son ruido en el sistema racional: son información de alta prioridad.' },

    { año: '1999', tag: 'Dunning & Kruger · Cornell', cat: 'cognitivo', emoji: '🪞',
      titulo: 'Cuanto menos sabes, más seguro estás — y no lo sabes',
      desc: 'Participantes en el cuartil inferior de competencia en lógica, gramática y humor creían haber rendido mejor que el 62% de sus compañeros. Su rendimiento real los situaba en el 12%.',
      importa: 'El mismo déficit que limita tu competencia limita tu capacidad de detectar ese déficit. La única salida es la formación real. El efecto se aplica a cualquier dominio: política, medicina, inversión.' },

    { año: '2000', tag: 'Nader, Schafe & LeDoux · NYU', cat: 'neuro', emoji: '🔄',
      titulo: 'La reconsolidación: cada vez que recuerdas, reescribes',
      desc: 'Al reactivar un recuerdo de miedo en ratas, este vuelve a ser lábil —modificable— durante varias horas antes de reconsolidarse. Si se bloquea la reconsolidación, el miedo desaparece permanentemente.',
      importa: 'Abrió una nueva vía terapéutica para el PTSD: en lugar de inhibir el miedo, modificarlo en el momento de su reactivación. También confirma que tus recuerdos no son archivos: son documentos que se editan cada vez que los abres.' },

    { año: '2002', tag: 'Daniel Kahneman · Princeton', cat: 'cognitivo', emoji: '🏆',
      titulo: 'Nobel de Economía para un psicólogo: el momento en que todo cambió',
      desc: 'Kahneman recibe el Nobel de Economía sin ser economista. La academia reconoce que las decisiones humanas reales no siguen la lógica del homo economicus racional, sino los principios de la psicología cognitiva.',
      importa: 'Legitimó décadas de investigación en economía conductual y abrió la puerta al "diseño de nudges": modificar el contexto de las decisiones para mejorarlas sin prohibir ni obligar. Hoy se usa en política pública, salud y finanzas.' },

    { año: '2011', tag: 'Valorie Salimpoor · McGill', cat: 'neuro', emoji: '🎵',
      titulo: 'El escalofrío musical activa el mismo circuito que la cocaína',
      desc: 'Con PET y fMRI simultáneos, Salimpoor muestra que los picos musicales liberan dopamina en el núcleo accumbens —el mismo circuito de recompensa que activa la comida, el sexo o las drogas.',
      importa: 'La belleza abstracta activa circuitos de supervivencia. Y ocurre en dos fases: la dopamina sube en la anticipación del momento cumbre, no solo durante él. Tu cerebro recompensa predecir correctamente la belleza.' },

    { año: '2015', tag: 'Open Science Collaboration · 270 investigadores', cat: 'cognitivo', emoji: '🔍',
      titulo: 'La crisis de reproducibilidad: la mitad de la psicología no se puede replicar',
      desc: 'Un consorcio de 270 investigadores intenta replicar 100 estudios publicados en revistas de psicología de alto impacto. Solo el 39% obtiene resultados similares a los originales.',
      importa: 'No destruye la psicología: la hace más fuerte. Generó la revolución del Open Science: pre-registro de hipótesis, datos abiertos, tamaños de muestra más grandes, replicaciones antes de publicar. La ciencia se autocorrige, y eso es exactamente lo que tiene que hacer.' }
  ];

  const track   = document.getElementById('timeline-track');
  if (!track) return;

  const detail  = document.getElementById('tl-detail');
  const dClose  = document.getElementById('tl-detail-close');
  const dYear   = document.getElementById('tl-d-year');
  const dTag    = document.getElementById('tl-d-tag');
  const dTitulo = document.getElementById('tl-d-titulo');
  const dDesc   = document.getElementById('tl-d-desc');
  const dImp    = document.getElementById('tl-d-importa');

  let activeItem = null;

  function catIcon(cat) {
    const g = 'stroke="url(#clock-grad)"';
    const s = `width="15" height="15" viewBox="0 0 24 24" fill="none" ${g} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
    const map = {
      cognitivo:  `<svg ${s}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>`,
      conductual: `<svg ${s}><path d="M9 3H5a2 2 0 0 0-2 2v4"/><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M9 21H5a2 2 0 0 1-2-2v-4"/><path d="M15 21h4a2 2 0 0 0 2-2v-4"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>`,
      social:     `<svg ${s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      neuro:      `<svg ${s}><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
      clinico:    `<svg ${s}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
      humanista:  `<svg ${s}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    };
    return map[cat] || map.cognitivo;
  }

  function catLabel(c) {
    return { cognitivo:'Cognición', conductual:'Comportamiento', social:'Social', neuro:'Neurociencia', clinico:'Clínica', humanista:'Humanismo' }[c] || c;
  }

  function openDetail(h, itemEl) {
    if (activeItem) activeItem.classList.remove('active');
    activeItem = itemEl;
    itemEl.classList.add('active');
    dYear.textContent   = h.año;
    dTag.textContent    = h.tag;
    dTitulo.textContent = h.titulo;
    dDesc.textContent   = h.desc;
    dImp.textContent    = h.importa;
    detail.hidden = false;
    requestAnimationFrame(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }

  function renderTimeline() {
    track.innerHTML = '';
    HITOS.forEach(h => {
      const item = document.createElement('div');
      item.className = 'tl-item';
      item.dataset.cat = h.cat;
      item.setAttribute('role', 'listitem');
      item.innerHTML = `
        <div class="tl-node">
          <div class="tl-dot" aria-hidden="true"></div>
          <div class="tl-node-meta">
            <span class="tl-year">${h.año}</span>
            <span class="tl-tag">${h.tag}</span>
          </div>
        </div>
        <div class="tl-card" tabindex="0" role="button" aria-label="${h.titulo}">
          <div class="tl-card-head">
            <span class="tl-card-icon" aria-hidden="true">${catIcon(h.cat)}</span>
            <span class="tl-cat-badge tl-cat-${h.cat}">${catLabel(h.cat)}</span>
          </div>
          <h3 class="tl-titulo">${h.titulo}</h3>
        </div>`;
      const card = item.querySelector('.tl-card');
      const open = () => openDetail(h, item);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      track.appendChild(item);
    });
  }

  if (dClose) {
    dClose.addEventListener('click', () => {
      detail.hidden = true;
      if (activeItem) { activeItem.classList.remove('active'); activeItem = null; }
    });
  }

  /* Drag-to-scroll */
  let isDown = false, startX, scrollL;
  track.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - track.offsetLeft; scrollL = track.scrollLeft; });
  document.addEventListener('mouseup',  () => { isDown = false; });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    track.scrollLeft = scrollL - (e.pageX - track.offsetLeft - startX) * 1.4;
  });

  renderTimeline();
}());


/* ── MAPA DE CONCEPTOS ───────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('mapa-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Paleta ── */
  const COLORS = {
    persona: { fill: '#7C3AED', stroke: '#6D28D9', text: '#fff' },
    sesgo:   { fill: '#DC2626', stroke: '#B91C1C', text: '#fff' },
    efecto:  { fill: '#0891B2', stroke: '#0E7490', text: '#fff' },
    teoria:  { fill: '#059669', stroke: '#047857', text: '#fff' }
  };

  const NODES = [
    /* Personas */
    { id:'kahneman',   cat:'persona', label:'Kahneman',        r:24, desc:'Nobel de Economía 2002. Desarrolló la teoría prospectiva, los sistemas 1 y 2, y documentó decenas de sesgos cognitivos junto a Tversky.' },
    { id:'tversky',    cat:'persona', label:'Tversky',          r:20, desc:'Junto a Kahneman, pionero en el estudio de heurísticas y sesgos. Falleció en 1996 antes de recibir el Nobel.' },
    { id:'festinger',  cat:'persona', label:'Festinger',        r:18, desc:'Descubrió la disonancia cognitiva estudiando el comportamiento de una secta que predijo el fin del mundo.' },
    { id:'bandura',    cat:'persona', label:'Bandura',          r:20, desc:'Formuló el aprendizaje vicario y la autoeficacia. Su muñeco Bobo cambió cómo entendemos cómo aprendemos lo que vemos.' },
    { id:'loftus',     cat:'persona', label:'Loftus',           r:19, desc:'Demostró que la memoria es reconstructiva y puede ser implantada. Perita en más de 300 casos penales.' },
    { id:'milgram',    cat:'persona', label:'Milgram',          r:18, desc:'Su experimento de obediencia mostró que el 65% de personas ordinarias causa daño si una autoridad lo pide.' },
    { id:'cialdini',   cat:'persona', label:'Cialdini',         r:18, desc:'Tres años infiltrado en sectores de ventas le dieron los seis principios de la influencia social.' },
    { id:'skinner',    cat:'persona', label:'Skinner',          r:19, desc:'Desarrolló el condicionamiento operante. El refuerzo variable de sus cajas es el principio de diseño detrás de las redes sociales.' },
    { id:'pavlov',     cat:'persona', label:'Pavlov',           r:17, desc:'Descubrió el condicionamiento clásico estudiando la salivación de perros. Nada en psicología del aprendizaje empieza sin él.' },
    { id:'csikszent',  cat:'persona', label:'Csikszentmihalyi', r:17, desc:'Describió el flujo tras entrevistar a cientos de personas en estados de máximo rendimiento y bienestar.' },
    { id:'damasio',    cat:'persona', label:'Damasio',          r:16, desc:'Demostró que las emociones son el fundamento de la razón, no su opuesto.' },
    { id:'gottman',    cat:'persona', label:'Gottman',          r:16, desc:'Predice el divorcio con >90% de precisión analizando 4 patrones de comunicación en pareja.' },
    { id:'deci',       cat:'persona', label:'Deci',             r:15, desc:'Co-desarrolló la Teoría de la Autodeterminación: las personas necesitan autonomía, competencia y vinculación para estar motivadas.' },
    /* Sesgos */
    { id:'confirmacion', cat:'sesgo', label:'Sesgo de\nConfirmación', r:20, desc:'Buscamos información que confirme lo que ya creemos, ignoramos la que lo contradice.' },
    { id:'anclaje',      cat:'sesgo', label:'Anclaje',               r:19, desc:'El primer número que oímos domina todos los juicios numéricos posteriores, aunque sea arbitrario.' },
    { id:'disponibilidad', cat:'sesgo', label:'Heurística de\nDisponibilidad', r:18, desc:'Lo que recordamos fácilmente parece más probable. Los titulares sobreestiman los riesgos mediáticos.' },
    { id:'retrospectiva', cat:'sesgo', label:'Sesgo de\nRetrospectiva', r:16, desc:'Tras conocer el resultado, creemos que siempre lo supimos. Dificulta aprender de los errores.' },
    { id:'dunning',      cat:'sesgo', label:'Dunning-Kruger',         r:18, desc:'Quien menos sabe más seguro está. El déficit cognitivo impide detectar el propio déficit cognitivo.' },
    { id:'superviviente', cat:'sesgo', label:'Sesgo del\nSuperviviente', r:15, desc:'Solo vemos los éxitos porque los fracasos no cuentan su historia. Distorsiona qué estrategias "funcionan".' },
    { id:'statusquo',    cat:'sesgo', label:'Sesgo del\nStatu Quo',   r:15, desc:'Cambiar duele más que quedarse igual, aunque quedarse igual sea objetivamente peor.' },
    { id:'autoservicio', cat:'sesgo', label:'Sesgo de\nAutoservicio', r:14, desc:'Atribuimos los éxitos a nosotros mismos y los fracasos a las circunstancias.' },
    /* Efectos */
    { id:'halo',         cat:'efecto', label:'Efecto Halo',        r:18, desc:'Una característica positiva visible condiciona toda la percepción de la persona.' },
    { id:'placebo',      cat:'efecto', label:'Efecto Placebo',      r:17, desc:'Creer que un tratamiento funciona lo hace funcionar biológicamente a través de opioides endógenos.' },
    { id:'espectador',   cat:'efecto', label:'Efecto Espectador',   r:17, desc:'Más testigos = menos probabilidad de que alguien ayude. La responsabilidad se diluye.' },
    { id:'pigmalion',    cat:'efecto', label:'Efecto Pigmalión',    r:16, desc:'Las expectativas de otros sobre nosotros moldean nuestro rendimiento real.' },
    { id:'priming',      cat:'efecto', label:'Priming',             r:16, desc:'Un estímulo modifica la respuesta a estímulos posteriores sin que seamos conscientes de la conexión.' },
    { id:'mera-exposicion', cat:'efecto', label:'Mera Exposición',  r:15, desc:'Cuanto más vemos algo, más nos atrae, incluso sin experiencia consciente previa.' },
    /* Teorías */
    { id:'prospectiva',  cat:'teoria', label:'Teoría Prospectiva',   r:20, desc:'Las pérdidas duelen 1,5-2,5 veces más que las ganancias equivalentes. Base de la economía conductual.' },
    { id:'disonancia',   cat:'teoria', label:'Disonancia Cognitiva', r:18, desc:'El malestar de mantener creencias contradictorias. El cerebro lo resuelve cambiando una de las creencias o ignorando la evidencia.' },
    { id:'flujo',        cat:'teoria', label:'Estado de Flujo',      r:17, desc:'Concentración total cuando desafío y habilidad están equilibrados. El rendimiento y el bienestar alcanzan su pico.' },
    { id:'autodeter',    cat:'teoria', label:'Autodeterminación',    r:16, desc:'Autonomía + competencia + vinculación = motivación intrínseca. Quitar cualquiera de los tres destruye la motivación.' },
    { id:'sist12',       cat:'teoria', label:'Sistemas 1 y 2',       r:19, desc:'El cerebro tiene un sistema rápido-intuitivo (1) y uno lento-deliberado (2). La mayoría de errores ocurren cuando el 1 gobierna donde debería gobernar el 2.' },
    { id:'cond-clasico', cat:'teoria', label:'Condicionamiento\nClásico', r:17, desc:'Un estímulo neutro, asociado a uno significativo, produce la misma respuesta. Base de miedos, adicciones y preferencias de marca.' },
    { id:'cond-operante', cat:'teoria', label:'Condicionamiento\nOperante', r:17, desc:'El comportamiento seguido de recompensa se repite; el seguido de castigo se extingue. El refuerzo variable produce la mayor adicción conductual.' }
  ];

  const EDGES = [
    ['kahneman','prospectiva'],['kahneman','anclaje'],['kahneman','disponibilidad'],['kahneman','sist12'],['kahneman','retrospectiva'],
    ['tversky','prospectiva'],['tversky','anclaje'],['tversky','disponibilidad'],
    ['festinger','disonancia'],['disonancia','confirmacion'],['disonancia','autoservicio'],
    ['bandura','pigmalion'],['bandura','autoservicio'],
    ['loftus','retrospectiva'],['loftus','confirmacion'],
    ['milgram','espectador'],
    ['cialdini','mera-exposicion'],['cialdini','statusquo'],
    ['skinner','cond-operante'],
    ['pavlov','cond-clasico'],['cond-clasico','placebo'],['cond-clasico','priming'],
    ['csikszent','flujo'],
    ['deci','autodeter'],['autodeter','flujo'],
    ['damasio','sist12'],
    ['gottman','autoservicio'],
    ['dunning','confirmacion'],['dunning','autoservicio'],
    ['sist12','anclaje'],['sist12','disponibilidad'],['sist12','confirmacion'],
    ['prospectiva','statusquo'],['prospectiva','anclaje'],
    ['halo','confirmacion'],['halo','priming'],
    ['priming','disponibilidad'],['priming','halo'],
    ['pigmalion','placebo'],
    ['cond-operante','priming']
  ];

  /* ── Layout: posiciones en círculo por categoría ── */
  function initPositions() {
    const CX = canvas.width / 2, CY = canvas.height / 2;
    const catGroups = {};
    NODES.forEach(n => { if (!catGroups[n.cat]) catGroups[n.cat] = []; catGroups[n.cat].push(n); });
    const catCenters = {
      persona: { x: CX - 220, y: CY - 120 },
      sesgo:   { x: CX + 200, y: CY - 130 },
      efecto:  { x: CX + 190, y: CY + 140 },
      teoria:  { x: CX - 200, y: CY + 140 }
    };
    Object.entries(catGroups).forEach(([cat, nodes]) => {
      const c   = catCenters[cat];
      const R   = 95;
      nodes.forEach((n, i) => {
        const angle = (2 * Math.PI * i / nodes.length) - Math.PI / 2;
        n.x  = c.x + R * Math.cos(angle);
        n.y  = c.y + R * Math.sin(angle);
        n.vx = 0; n.vy = 0;
      });
    });
  }

  /* ── Simple force simulation (50 ticks) ── */
  function simulate() {
    const nodeMap = {};
    NODES.forEach(n => { nodeMap[n.id] = n; });
    for (let t = 0; t < 60; t++) {
      /* Repulsion */
      for (let i = 0; i < NODES.length; i++) {
        for (let j = i + 1; j < NODES.length; j++) {
          const a = NODES[i], b = NODES[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minD = a.r + b.r + 28;
          if (dist < minD) {
            const f = (minD - dist) / dist * 0.5;
            a.x -= dx * f; a.y -= dy * f;
            b.x += dx * f; b.y += dy * f;
          }
        }
      }
      /* Attraction along edges */
      EDGES.forEach(([sid, tid]) => {
        const a = nodeMap[sid], b = nodeMap[tid];
        if (!a || !b) return;
        let dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const target = a.r + b.r + 55;
        const f = (dist - target) / dist * 0.1;
        a.x += dx * f; a.y += dy * f;
        b.x -= dx * f; b.y -= dy * f;
      });
    }
  }

  /* ── Canvas sizing ── */
  function resize() {
    const wrap = canvas.parentElement;
    canvas.width  = wrap.clientWidth;
    canvas.height = Math.max(520, wrap.clientWidth * 0.65);
  }
  resize();

  /* ── State ── */
  let hoveredNode = null;
  let selectedNode = null;
  let dragging = null;
  let dragOffX = 0, dragOffY = 0;
  let panX = 0, panY = 0;
  let scale = 1;
  let isPanning = false, panStartX = 0, panStartY = 0, panStartTX = 0, panStartTY = 0;

  /* ── Init ── */
  initPositions();
  simulate();

  /* ── Draw ── */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(scale, scale);

    const nodeMap = {};
    NODES.forEach(n => { nodeMap[n.id] = n; });
    const connectedIds = new Set();
    if (hoveredNode || selectedNode) {
      const active = hoveredNode || selectedNode;
      EDGES.forEach(([s, t]) => {
        if (s === active.id || t === active.id) { connectedIds.add(s); connectedIds.add(t); }
      });
    }

    /* Edges */
    EDGES.forEach(([sid, tid]) => {
      const a = nodeMap[sid], b = nodeMap[tid];
      if (!a || !b) return;
      const isActive = connectedIds.has(sid) && connectedIds.has(tid) && (hoveredNode || selectedNode);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = isActive ? 'rgba(99,102,241,0.55)' : 'rgba(148,163,184,0.18)';
      ctx.lineWidth   = isActive ? 1.5 : 0.8;
      ctx.stroke();
    });

    /* Nodes */
    NODES.forEach(n => {
      const isHov  = n === hoveredNode;
      const isSel  = n === selectedNode;
      const isDim  = (hoveredNode || selectedNode) && !connectedIds.has(n.id)
                     && n !== hoveredNode && n !== selectedNode;
      const col    = COLORS[n.cat];
      const r      = n.r * (isHov ? 1.15 : 1);
      const alpha  = isDim ? 0.28 : 1;

      ctx.globalAlpha = alpha;

      /* Shadow on hover/select */
      if (isHov || isSel) {
        ctx.shadowColor = col.fill;
        ctx.shadowBlur  = 14;
      }

      /* Node circle */
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle   = isSel ? col.stroke : col.fill;
      ctx.strokeStyle = isSel ? '#fff' : col.stroke;
      ctx.lineWidth   = isSel ? 2.5 : 1.5;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur  = 0;

      /* Label */
      const lines = n.label.split('\n');
      ctx.fillStyle  = col.text;
      ctx.textAlign  = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(8, Math.min(11, r * 0.56));
      ctx.font = `700 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      const lh = fontSize * 1.25;
      lines.forEach((line, li) => {
        ctx.fillText(line, n.x, n.y + (li - (lines.length - 1) / 2) * lh);
      });

      ctx.globalAlpha = 1;
    });

    ctx.restore();
  }

  /* ── Pointer helpers ── */
  function getNodeAt(ex, ey) {
    const cx = (ex - panX) / scale, cy = (ey - panY) / scale;
    return NODES.find(n => Math.hypot(n.x - cx, n.y - cy) <= n.r + 4) || null;
  }

  /* ── Info panel ── */
  const panel    = document.getElementById('mapa-info-panel');
  const closeBtn = document.getElementById('mapa-info-close');
  const infoConx = document.getElementById('mapa-info-conexiones');

  function showPanel(node) {
    selectedNode = node;
    if (!panel) return;
    document.getElementById('mapa-info-cat').textContent     = { persona:'Investigador', sesgo:'Sesgo', efecto:'Efecto', teoria:'Teoría' }[node.cat] || node.cat;
    document.getElementById('mapa-info-titulo').textContent  = node.label.replace('\n', ' ');
    document.getElementById('mapa-info-desc').textContent    = node.desc;
    /* Conexiones */
    const nodeMap = {};
    NODES.forEach(n => { nodeMap[n.id] = n; });
    const connected = EDGES
      .filter(([s, t]) => s === node.id || t === node.id)
      .map(([s, t]) => nodeMap[s === node.id ? t : s])
      .filter(Boolean);
    infoConx.innerHTML = connected.length
      ? '<span class="mapa-info-conx-label">Conectado con:</span> ' +
        connected.map(n => `<span class="mapa-info-chip mapa-chip-${n.cat}">${n.label.replace('\n',' ')}</span>`).join('')
      : '';
    panel.hidden = false;
    draw();
  }

  function hidePanel() {
    selectedNode = null;
    if (panel) panel.hidden = true;
    draw();
  }

  if (closeBtn) closeBtn.addEventListener('click', hidePanel);

  /* ── Interaction ── */
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const ex   = e.clientX - rect.left, ey = e.clientY - rect.top;
    if (dragging) {
      dragging.x = (ex - panX) / scale + dragOffX;
      dragging.y = (ey - panY) / scale + dragOffY;
      draw(); return;
    }
    if (isPanning) {
      panX = panStartTX + (ex - panStartX);
      panY = panStartTY + (ey - panStartY);
      draw(); return;
    }
    const node = getNodeAt(ex, ey);
    hoveredNode = node;
    canvas.style.cursor = node ? 'pointer' : 'grab';
    draw();
  });

  canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const ex   = e.clientX - rect.left, ey = e.clientY - rect.top;
    const node = getNodeAt(ex, ey);
    if (node) {
      dragging  = node;
      dragOffX  = node.x - (ex - panX) / scale;
      dragOffY  = node.y - (ey - panY) / scale;
    } else {
      isPanning  = true;
      panStartX  = ex; panStartY  = ey;
      panStartTX = panX; panStartTY = panY;
      canvas.style.cursor = 'grabbing';
    }
  });

  canvas.addEventListener('mouseup', e => {
    const rect = canvas.getBoundingClientRect();
    const ex   = e.clientX - rect.left, ey = e.clientY - rect.top;
    if (dragging) { dragging = null; draw(); return; }
    isPanning = false;
    canvas.style.cursor = 'grab';
    const node = getNodeAt(ex, ey);
    if (node) showPanel(node); else hidePanel();
  });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const rect  = canvas.getBoundingClientRect();
    const ex    = e.clientX - rect.left, ey = e.clientY - rect.top;
    const delta = e.deltaY < 0 ? 1.1 : 0.91;
    const newScale = Math.min(2.5, Math.max(0.45, scale * delta));
    panX = ex - (ex - panX) * (newScale / scale);
    panY = ey - (ey - panY) * (newScale / scale);
    scale = newScale;
    draw();
  }, { passive: false });

  /* Touch support */
  canvas.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    const t    = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const ex   = t.clientX - rect.left, ey = t.clientY - rect.top;
    const node = getNodeAt(ex, ey);
    if (node) {
      dragging = node;
      dragOffX = node.x - (ex - panX) / scale;
      dragOffY = node.y - (ey - panY) / scale;
    } else {
      isPanning = true; panStartX = ex; panStartY = ey;
      panStartTX = panX; panStartTY = panY;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', e => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    const t    = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const ex   = t.clientX - rect.left, ey = t.clientY - rect.top;
    if (dragging) { dragging.x = (ex - panX) / scale + dragOffX; dragging.y = (ey - panY) / scale + dragOffY; }
    else if (isPanning) { panX = panStartTX + ex - panStartX; panY = panStartTY + ey - panStartY; }
    draw();
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    if (!dragging && !isPanning) return;
    const wasDragging = dragging;
    dragging = null; isPanning = false;
    if (!wasDragging) {
      const t    = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const node = getNodeAt(t.clientX - rect.left, t.clientY - rect.top);
      if (node) showPanel(node); else hidePanel();
    }
    draw();
  });

  /* Resize */
  window.addEventListener('resize', () => { resize(); initPositions(); simulate(); draw(); }, { passive: true });

  draw();
}());


/* ── SISTEMA DE NIVELES XP ──────────────────────────────────── */
(function () {
  const LS_XP = 'li_xp_v1';

  const NIVELES = [
    { nivel: 0, nombre: 'Estado Latente',       xpMin: 0,    xpMax: 149,      badge: 'img/Nivel00.png' },
    { nivel: 1, nombre: 'Observador Casual',    xpMin: 150,  xpMax: 599,      badge: 'img/Nivel1.png'  },
    { nivel: 2, nombre: 'Mente Inquisitiva',    xpMin: 600,  xpMax: 1499,     badge: 'img/Nivel2.png'  },
    { nivel: 3, nombre: 'Analista Crítico',     xpMin: 1500, xpMax: 2999,     badge: 'img/Nivel3.png'  },
    { nivel: 4, nombre: 'Pensador Estratégico', xpMin: 3000, xpMax: 5499,     badge: 'img/Nivel04.png' },
    { nivel: 5, nombre: 'Córtex Supremo',       xpMin: 5500, xpMax: Infinity, badge: 'img/Nivel05.png' }
  ];

  const RECOMPENSAS = {
    1: {
      perfil:    'Tu historial sugiere un enfoque exploratorio. Los perfiles así son los primeros en detectar un sesgo antes de que el grupo lo nombre.',
      percentil: 'Has superado al 60% de visitantes que no pasan del primer impacto.',
      tema:      { id: 'verde',    nombre: 'Verde',    color: '#16A34A' }
    },
    2: {
      perfil:    'Tu historial muestra una tendencia hacia el análisis contextual. Eso correlaciona con mayor resistencia al sesgo de confirmación.',
      percentil: 'Solo el 30% de los visitantes alcanza este nivel de exploración.',
      tema:      { id: 'cosmos',   nombre: 'Cosmos',   color: '#F59E0B' }
    },
    3: {
      perfil:    'Tu patrón de uso sugiere pensamiento deliberado. En términos de Kahneman, activas el Sistema 2 más de lo habitual.',
      percentil: 'Menos del 15% de los visitantes llega aquí.',
      mensaje:   'Pocas personas llegan aquí. Gracias por tomarte la psicología en serio.',
      tema:      { id: 'tormenta', nombre: 'Tormenta', color: '#A855F7' }
    },
    4: {
      perfil:    'Tu perfil de exploración es inusual: abarcas tanto sesgos emocionales como cognitivos. Eso es raro y, según la investigación, valioso.',
      percentil: 'Estás entre el 5% con mayor profundidad de exploración.',
      mensaje:   'Pocas personas llegan aquí. Gracias por tomarte la psicología en serio.',
      tema:      { id: 'carmesi',  nombre: 'Carmesí',  color: '#C8102E' }
    },
    5: {
      perfil:    'Hay un punto en el que conocer los sesgos empieza a cambiarte. Tú has cruzado esa línea.',
      percentil: 'Menos del 1% de los visitantes alcanza Córtex Supremo.',
      mensaje:   'Llevas mucho tiempo con nosotros. Eso no se olvida fácilmente. Gracias.',
      tema:      { id: 'obsidiana', nombre: 'Obsidiana', color: '#D4AF37' }
    }
  };

  function getXP()    { return parseInt(localStorage.getItem(LS_XP) || '0', 10); }
  function setXP(v)   { lsSet(LS_XP, String(v)); }

  function getNivel(xp) {
    for (let i = NIVELES.length - 1; i >= 0; i--) {
      if (xp >= NIVELES[i].xpMin) return NIVELES[i];
    }
    return NIVELES[0];
  }

  function updateNavbar(xp) {
    const n    = getNivel(xp);
    const next = NIVELES[n.nivel + 1];
    const pct  = next
      ? Math.round(((xp - n.xpMin) / (n.xpMax - n.xpMin + 1)) * 100)
      : 100;
    const img  = document.getElementById('nivel-badge-img');
    const nom  = document.getElementById('nivel-nombre');
    const bar  = document.getElementById('nivel-bar-fill');
    const trk  = document.getElementById('nivel-bar-track');
    if (img) { img.src = n.badge; img.alt = n.nombre; }
    if (nom)  nom.textContent = n.nombre;
    if (bar)  bar.style.width = pct + '%';
    if (trk)  trk.setAttribute('aria-valuenow', pct);
  }

  function addXP(amount) {
    const prev      = getXP();
    const prevNivel = getNivel(prev).nivel;
    const next      = prev + amount;
    setXP(next);
    updateNavbar(next);
    const newNivel = getNivel(next).nivel;
    if (newNivel > prevNivel) {
      setTimeout(() => playLevelUp(NIVELES[newNivel]), 350);
    }
  }
  window._LI_addXP = addXP;

  /* ── Animación sináptica ── */
  function playLevelUp(nivelData) {
    const overlay = document.getElementById('levelup-overlay');
    const canvas  = document.getElementById('levelup-canvas');
    const card    = document.getElementById('levelup-card');
    if (!overlay || !canvas || !card) return;

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    card.classList.remove('visible');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const cx  = canvas.width  / 2;
    const cy  = canvas.height / 2;

    /* Nodos en los bordes */
    const nodes = Array.from({ length: 32 }, () => {
      const side = Math.floor(Math.random() * 4);
      let x, y;
      if      (side === 0) { x = Math.random() * canvas.width; y = 0; }
      else if (side === 1) { x = canvas.width;  y = Math.random() * canvas.height; }
      else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height; }
      else                 { x = 0; y = Math.random() * canvas.height; }
      return { x, y, p: 0, spd: 0.028 + Math.random() * 0.020, op: 0, cx: x, cy: y };
    });

    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        if (dx*dx + dy*dy < 300*300) edges.push([i, j]);
      }
    }

    let frame = 0;
    const TOTAL = 72;

    function draw() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(3,8,20,' + Math.min(0.88, frame / 16) + ')';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach(n => {
        n.p  = Math.min(1, n.p  + n.spd);
        n.op = Math.min(1, n.op + 0.07);
        n.cx = n.x + (cx - n.x) * n.p;
        n.cy = n.y + (cy - n.y) * n.p;
      });

      ctx.shadowBlur  = 7;
      ctx.shadowColor = '#00C8F0';
      edges.forEach(([a, b]) => {
        const op = Math.min(nodes[a].op, nodes[b].op) * 0.50;
        ctx.beginPath();
        ctx.moveTo(nodes[a].cx, nodes[a].cy);
        ctx.lineTo(nodes[b].cx, nodes[b].cy);
        ctx.strokeStyle = `rgba(0,200,240,${op})`;
        ctx.lineWidth   = 0.65;
        ctx.stroke();
      });

      ctx.shadowBlur  = 5;
      ctx.shadowColor = '#2563EB';
      nodes.forEach(n => {
        if (n.p < 0.25) return;
        ctx.beginPath();
        ctx.moveTo(n.cx, n.cy);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = `rgba(37,99,235,${n.p * n.op * 0.35})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      });

      ctx.shadowBlur  = 12;
      ctx.shadowColor = '#00E5FF';
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.cx, n.cy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${n.op * 0.88})`;
        ctx.fill();
      });

      if (frame > 28) {
        const r  = ((frame - 28) / TOTAL) * 90;
        const op = Math.max(0, 0.55 - (frame - 28) / TOTAL);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,229,255,${op})`;
        ctx.lineWidth   = 2.5;
        ctx.shadowBlur  = 22;
        ctx.shadowColor = '#00E5FF';
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      if (frame < TOTAL) {
        requestAnimationFrame(draw);
      } else {
        showCard(nivelData);
      }
    }
    draw();
  }

  function showCard(nivelData) {
    const r   = RECOMPENSAS[nivelData.nivel] || {};
    const els = {
      card:       document.getElementById('levelup-card'),
      badge:      document.getElementById('levelup-badge-anim'),
      nombre:     document.getElementById('levelup-nombre-card'),
      perfil:     document.getElementById('levelup-perfil'),
      percentil:  document.getElementById('levelup-percentil'),
      mensaje:    document.getElementById('levelup-mensaje'),
      temaWrap:   document.getElementById('levelup-tema-wrap'),
      temaDot:    document.getElementById('levelup-tema-dot'),
      temaNombre: document.getElementById('levelup-tema-nombre')
    };
    if (els.badge)     { els.badge.src = nivelData.badge; els.badge.alt = nivelData.nombre; }
    if (els.nombre)    els.nombre.textContent    = nivelData.nombre;
    if (els.perfil)    els.perfil.textContent    = r.perfil    || '';
    if (els.percentil) els.percentil.textContent = r.percentil || '';
    if (els.mensaje)   {
      els.mensaje.textContent = r.mensaje || '';
      els.mensaje.style.display = r.mensaje ? '' : 'none';
    }
    if (els.temaWrap) {
      if (r.tema) {
        els.temaWrap.hidden = false;
        if (els.temaDot)    els.temaDot.style.background = r.tema.color;
        if (els.temaNombre) els.temaNombre.textContent   = r.tema.nombre;
      } else {
        els.temaWrap.hidden = true;
      }
    }
    requestAnimationFrame(() => els.card && els.card.classList.add('visible'));
  }

  /* Cerrar overlay */
  function closeLevelUp() {
    const overlay = document.getElementById('levelup-overlay');
    const card    = document.getElementById('levelup-card');
    if (overlay) overlay.hidden = true;
    if (card)    card.classList.remove('visible');
    document.body.style.overflow = '';
    const canvas = document.getElementById('levelup-canvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }

  const closeBtn = document.getElementById('levelup-close');
  const overlay  = document.getElementById('levelup-overlay');
  if (closeBtn) closeBtn.addEventListener('click', closeLevelUp);
  if (overlay)  overlay.addEventListener('click', e => { if (e.target === overlay) closeLevelUp(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay && !overlay.hidden) closeLevelUp(); });

  /* ── Hooks de XP via delegación global ── */
  const XP_ONCE = new Set(); /* evitar duplicar XP por el mismo elemento en misma sesión */

  document.addEventListener('click', function (e) {
    const addOnce = (key, amt) => { if (XP_ONCE.has(key)) return; XP_ONCE.add(key); addXP(amt); };
    const t = e.target;

    /* Efectos explorados */
    const efectoCard = t.closest('.efecto-card[data-efecto]');
    if (efectoCard) { addOnce('efecto-' + efectoCard.dataset.efecto, 5); return; }

    /* Mito respondido */
    const tfBtn = t.closest('.tf-btn');
    if (tfBtn) {
      const mitoCard = tfBtn.closest('.mito-tf-card');
      if (mitoCard && !mitoCard.classList.contains('answered')) { addXP(8); }
      return;
    }

    /* Tarjeta botiquín — XP solo la primera vez que se voltea cada tarjeta */
    const flipCard = t.closest('.flip-card');
    if (flipCard && !t.closest('.flip-back-btn')) {
      const key = 'bq-' + (flipCard.getAttribute('aria-label') || '').slice(0, 40);
      addOnce(key, 6);
      return;
    }

    /* Enlace a Zenodo */
    if (t.closest('.btn-descarga')) { addXP(15); return; }

    /* Favorito guardado (solo al añadir, no al quitar) */
    const favBtn = t.closest('.fav-btn');
    if (favBtn && !favBtn.classList.contains('active')) { addXP(5); return; }

    /* Quiénes somos / Participar / Contacto */
    if (t.closest('.nav-link, .mobile-nav-toggle')) { addXP(5); return; }

    /* Artículo semanal previo */
    if (t.closest('.weekly-prev-card')) { addXP(10); return; }

    /* Artículo biblioteca */
    const libCard = t.closest('.lib-card');
    if (libCard) { addOnce('lib-' + (libCard.dataset.id || ''), 12); return; }
  }, { passive: true });

  /* Experimento completado — MutationObserver */
  const expCard = document.getElementById('exp-card');
  if (expCard) {
    new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType === 1 && n.classList && n.classList.contains('exp-final')) addXP(25);
      }));
    }).observe(expCard, { childList: true });
  }

  updateNavbar(getXP());
}());


/* ── GLOSARIO EMERGENTE ──────────────────────────────────────── */
(function () {
  const GLOSARIO = {
    'framing':              'Técnica de influencia que modifica la percepción de una información cambiando su marco de presentación, sin alterar su contenido objetivo.',
    'enmarcamiento':        'Sinónimo de framing: el marco lingüístico de un mensaje cambia cómo se percibe aunque el contenido sea idéntico.',
    'sesgo cognitivo':      'Error sistemático y predecible en el razonamiento humano, producido por atajos mentales automáticos (heurísticas).',
    'heurística':           'Regla mental simplificada que el cerebro usa para tomar decisiones rápidas, sacrificando precisión a cambio de velocidad.',
    'metacognición':        'Capacidad de pensar sobre el propio pensamiento; conocer y regular los propios procesos cognitivos.',
    'reconsolidación':      'Proceso por el que un recuerdo se reactiva y se vuelve a almacenar levemente modificado, lo que permite que sea alterado.',
    'dopamina':             'Neurotransmisor asociado al circuito de recompensa. No produce placer directamente: genera la anticipación de este.',
    'fMRI':                 'Resonancia magnética funcional; técnica que mide la actividad cerebral indirectamente a través del flujo sanguíneo.',
    'Sistema 1':            'Modo de pensamiento rápido, automático e intuitivo descrito por Kahneman. Opera sin esfuerzo consciente.',
    'Sistema 2':            'Modo de pensamiento lento, deliberado y analítico descrito por Kahneman. Requiere atención consciente.',
    'aversión a las pérdidas': 'Tendencia documentada por Kahneman y Tversky: las pérdidas generan más impacto psicológico que las ganancias equivalentes.',
    'efecto placebo':       'Mejora real y medible producida por un tratamiento inerte, mediada por las expectativas del paciente.',
    'neuromito':            'Creencia popular sobre el funcionamiento del cerebro sin respaldo científico real.',
    'córtex prefrontal':    'Región frontal del cerebro implicada en el razonamiento, la planificación y el control de impulsos.',
    'cortex prefrontal':    'Región frontal del cerebro implicada en el razonamiento, la planificación y el control de impulsos.',
    'amígdala':             'Estructura cerebral clave en el procesamiento emocional, especialmente el miedo y las respuestas de alerta.',
    'neurotransmisor':      'Molécula química que transmite señales entre neuronas en el sistema nervioso.',
    'condicionamiento':     'Proceso de aprendizaje asociativo donde un estímulo adquiere la capacidad de generar una respuesta.',
    'autoeficacia':         'Creencia de una persona en su propia capacidad para ejecutar con éxito un comportamiento específico. Concepto acuñado por Bandura.',
    'refuerzo variable':    'Esquema de condicionamiento que proporciona recompensas de forma impredecible; produce las tasas de respuesta más persistentes.',
    'efecto halo':          'Sesgo por el que una cualidad positiva de una persona contamina la valoración de todos sus demás atributos.',
    'prueba social':        'Heurística por la que el comportamiento de otros sirve de guía para decidir qué es correcto o apropiado.',
    'disonancia cognitiva': 'Malestar psicológico que surge al mantener simultáneamente dos creencias contradictorias o una creencia y una acción incompatibles.'
  };

  /* Ordenar por longitud (más largos primero) para evitar match parcial */
  const TERMS   = Object.keys(GLOSARIO).sort((a, b) => b.length - a.length);
  const ESCAPED = TERMS.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const RE = new RegExp('(' + ESCAPED.join('|') + ')', 'gi');

  const SKIP = new Set(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE', 'CODE', 'PRE', 'H1', 'H2', 'H3', 'STRONG', 'B']);

  function wrapIn(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p || SKIP.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.classList.contains('gloss') || p.closest('.gloss')) return NodeFilter.FILTER_REJECT;
        return RE.test(node.textContent) ? (RE.lastIndex = 0, NodeFilter.FILTER_ACCEPT) : NodeFilter.FILTER_SKIP;
      }
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(node => {
      RE.lastIndex = 0;
      const text = node.textContent;
      const frag = document.createDocumentFragment();
      let last = 0, m;
      while ((m = RE.exec(text)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const key = TERMS.find(t => t.toLowerCase() === m[0].toLowerCase());
        if (key) {
          const sp = document.createElement('span');
          sp.className = 'gloss';
          sp.setAttribute('data-def', GLOSARIO[key]);
          sp.textContent = m[0];
          frag.appendChild(sp);
        } else {
          frag.appendChild(document.createTextNode(m[0]));
        }
        last = m.index + m[0].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      if (frag.childNodes.length > 1 || frag.firstChild?.nodeName !== '#text') {
        node.parentNode.replaceChild(frag, node);
      }
    });
  }

  /* Contenido estático */
  ['mito-evidence', 'doc-desc', 'fuera-bata-desc', 'article-intro'].forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(wrapIn);
  });

  /* Contenido dinámico (efecto modal + artículos) — evita bucles */
  let busy = false;
  function safeWrap(el) { if (busy || !el) return; busy = true; wrapIn(el); busy = false; }

  const dynTargets = [
    document.getElementById('efecto-modal-content'),
    document.getElementById('weekly-container'),
    document.getElementById('biblioteca-container')
  ].filter(Boolean);

  const obs = new MutationObserver(() => dynTargets.forEach(safeWrap));
  dynTargets.forEach(el => obs.observe(el, { childList: true, subtree: false }));
}());


/* ── POPUP DE NIVEL ──────────────────────────────────────────── */
(function () {
  const widget = document.getElementById('nivel-widget');
  if (!widget) return;

  const LS_XP = 'li_xp_v1';

  /* ⚠️ Mismos umbrales que el IIFE principal del XP — deben mantenerse sincronizados */
  const NIVELES = [
    { nivel: 0, nombre: 'Estado Latente',       xpMin: 0,    xpMax: 149,      badge: 'img/Nivel00.png' },
    { nivel: 1, nombre: 'Observador Casual',    xpMin: 150,  xpMax: 599,      badge: 'img/Nivel1.png'  },
    { nivel: 2, nombre: 'Mente Inquisitiva',    xpMin: 600,  xpMax: 1499,     badge: 'img/Nivel2.png'  },
    { nivel: 3, nombre: 'Analista Crítico',     xpMin: 1500, xpMax: 2999,     badge: 'img/Nivel3.png'  },
    { nivel: 4, nombre: 'Pensador Estratégico', xpMin: 3000, xpMax: 5499,     badge: 'img/Nivel04.png' },
    { nivel: 5, nombre: 'Córtex Supremo',       xpMin: 5500, xpMax: Infinity, badge: 'img/Nivel05.png' }
  ];

  const MSGS = [
    'Explora efectos, responde mitos y completa el experimento. Cada acción suma XP y desbloquea recompensas.',
    'Buen comienzo. Sigue abriendo efectos, leyendo artículos y respondiendo mitos para seguir subiendo.',
    'Tu curiosidad va en serio. Continúa explorando para desbloquear niveles con recompensas exclusivas.',
    'Pocos llegan hasta aquí. Cada sesgo que exploras te acerca a recompensas que muy pocos ven.',
    'Estás en el 5% superior. Un último esfuerzo y alcanzarás el nivel máximo.',
    'Has llegado al nivel más alto. Eres parte del grupo más reducido de exploradores de La Inferencia.'
  ];

  function getXP() { return parseInt(localStorage.getItem(LS_XP) || '0', 10); }

  function getNivel(xp) {
    for (let i = NIVELES.length - 1; i >= 0; i--) {
      if (xp >= NIVELES[i].xpMin) return NIVELES[i];
    }
    return NIVELES[0];
  }

  /* Popup fuera del navbar para evitar clipping por backdrop-filter/overflow */
  const popup = document.createElement('div');
  popup.className = 'nivel-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-label', 'Tu nivel en La Inferencia');
  popup.hidden = true;
  document.body.appendChild(popup);  /* ← body, NO widget */

  function positionPopup() {
    const rect  = widget.getBoundingClientRect();
    const vw    = window.innerWidth;
    const pw    = Math.min(248, vw - 16);  /* ancho del popup */
    const top   = rect.bottom + 8;
    /* Alineado a la derecha del widget, pero que no se salga por la izquierda */
    let right = vw - rect.right;
    if (rect.right - pw < 8) right = vw - pw - 8;
    popup.style.top   = top   + 'px';
    popup.style.right = right + 'px';
    popup.style.width = pw    + 'px';
    popup.style.left  = 'auto';
  }

  function buildPopup() {
    const xp   = getXP();
    const n    = getNivel(xp);
    const next = NIVELES[n.nivel + 1];
    const pct  = next
      ? Math.round(((xp - n.xpMin) / (n.xpMax - n.xpMin + 1)) * 100)
      : 100;
    const xpFaltan = next ? next.xpMin - xp : 0;

    popup.innerHTML = `
      <img class="nivel-popup-badge" src="${n.badge}" alt="${n.nombre}" loading="lazy" />
      <div class="nivel-popup-level">Nivel ${n.nivel}</div>
      <div class="nivel-popup-name">${n.nombre}</div>
      <div class="nivel-popup-xp">${xp} XP${next ? ' · faltan ' + xpFaltan + ' para el siguiente' : ' · nivel máximo alcanzado'}</div>
      <div class="nivel-popup-bar-track">
        <div class="nivel-popup-bar-fill" style="width:0%"></div>
      </div>
      <p class="nivel-popup-msg">${MSGS[n.nivel]}</p>
      ${next ? `<div class="nivel-popup-next">Siguiente nivel: <strong>${next.nombre}</strong></div>` : ''}`;

    requestAnimationFrame(() => {
      const fill = popup.querySelector('.nivel-popup-bar-fill');
      if (fill) fill.style.width = pct + '%';
    });
  }

  function open() {
    positionPopup();
    buildPopup();
    popup.hidden = false;
  }

  function close() {
    popup.hidden = true;
  }

  widget.addEventListener('click', e => {
    e.stopPropagation();
    if (popup.hidden) open(); else close();
  });

  /* Cerrar al hacer clic fuera del widget Y del popup */
  document.addEventListener('click', e => {
    if (!popup.hidden && !widget.contains(e.target) && !popup.contains(e.target)) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !popup.hidden) close();
  });

  /* Reposicionar si cambia el tamaño de la ventana con el popup abierto */
  window.addEventListener('resize', () => {
    if (!popup.hidden) positionPopup();
  }, { passive: true });
}());


/* ── GLOSARIO TOOLTIP TÁCTIL ─────────────────────────────────── */
(function () {
  /* Solo activo en dispositivos sin hover (móvil/tablet táctil) */
  if (window.matchMedia && window.matchMedia('(hover: hover)').matches) return;

  let tip    = null;
  let active = null;

  function getTip() {
    if (tip) return tip;
    tip = document.createElement('div');
    tip.className = 'gloss-tip';
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
    return tip;
  }

  function show(term) {
    const def = term.dataset.def || '';
    if (!def) return;
    const el = getTip();
    el.textContent = def;
    el.classList.add('visible');

    /* Posicionar encima del término, con clamp al viewport */
    requestAnimationFrame(() => {
      const rect = term.getBoundingClientRect();
      const elW  = el.offsetWidth;
      const elH  = el.offsetHeight;
      let top  = rect.top - elH - 10;
      let left = rect.left + rect.width / 2 - elW / 2;
      /* Si se sale por arriba, mostrar debajo */
      if (top < 8) top = rect.bottom + 10;
      /* Clamp horizontal */
      left = Math.max(8, Math.min(left, window.innerWidth - elW - 8));
      el.style.top  = top  + 'px';
      el.style.left = left + 'px';
    });

    active = term;
  }

  function hide() {
    if (tip) tip.classList.remove('visible');
    active = null;
  }

  document.addEventListener('click', function (e) {
    const g = e.target.closest('.gloss');
    if (g) {
      e.stopPropagation();
      if (g === active) { hide(); return; }
      show(g);
      return;
    }
    hide();
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
}());


/* ── PROPÓN UN TEMA ──────────────────────────────────────────── */
(function () {
  const SUPABASE_URL  = 'https://dbyoxssdbboxnbecgpbf.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRieW94c3NkYmJveG5iZWNncGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDk2ODIsImV4cCI6MjA5NjUyNTY4Mn0.KsXnHzoMfgRzm8EHFaqOTo3GjSFBGrLx9BOEdJ0WVNs';
  const HEADERS       = { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + SUPABASE_ANON };

  const form     = document.getElementById('propuestas-form');
  const textoIn  = document.getElementById('prop-texto');
  const nombreIn = document.getElementById('prop-nombre');
  const feed     = document.getElementById('propuestas-feed');
  const counter  = document.getElementById('prop-counter');
  const charCnt  = document.getElementById('prop-char-count');
  if (!form || !feed) return;

  function getVoterUUID() {
    let id = lsGet('li_voter_uuid', '');
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now());
      lsSet('li_voter_uuid', id);
    }
    return id;
  }
  function getVotedIds() { try { return JSON.parse(localStorage.getItem('li_voted_ids') || '[]'); } catch { return []; } }
  function saveVotedId(id) { const v = getVotedIds(); if (!v.includes(id)) { v.push(id); lsSet('li_voted_ids', JSON.stringify(v)); } }

  if (textoIn && charCnt) {
    textoIn.addEventListener('input', () => { charCnt.textContent = textoIn.value.length; });
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  function renderFeed(props) {
    const voted = getVotedIds();
    if (counter) {
      const n = props.length;
      counter.textContent = n === 0 ? '0 propuestas' : n === 1 ? '1 propuesta' : n + ' propuestas';
    }
    if (props.length === 0) {
      feed.innerHTML = `<div class="li-empty prop-empty">
        <span class="li-empty-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg></span>
        <span><strong>Sé el primero</strong>Aún no hay propuestas. ¡Sugiere un tema!</span>
      </div>`;
      return;
    }
    feed.innerHTML = props.map(p => {
      const hasVoted = voted.includes(p.id);
      const votos    = p.votos || 0;
      return `
      <div class="prop-card" data-id="${p.id}">
        <p class="prop-card-texto">«${p.propuesta}»</p>
        <div class="prop-card-footer">
          <div class="prop-card-meta">
            <span>${p.nombre || 'Anónimo'}</span>
            <span>·</span>
            <span>${formatDate(p.created_at)}</span>
          </div>
          <button class="prop-vote-btn${hasVoted ? ' voted' : ''}" data-id="${p.id}" aria-label="Votar esta propuesta" aria-pressed="${hasVoted}" title="${hasVoted ? 'Ya has votado esta propuesta' : 'Votar esta propuesta'}">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="${hasVoted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
            <span class="prop-vote-count">${votos > 0 ? votos : ''}</span>
          </button>
        </div>
      </div>`;
    }).join('');

    feed.querySelectorAll('.prop-vote-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (getVotedIds().includes(id)) return;
        const voterUUID = getVoterUUID();
        try {
          await fetch(SUPABASE_URL + '/rest/v1/votos', {
            method: 'POST',
            headers: { ...HEADERS, 'Prefer': 'return=minimal' },
            body: JSON.stringify({ propuesta_id: id, voter_uuid: voterUUID })
          });
          const card    = feed.querySelector(`.prop-card[data-id="${id}"]`);
          const countEl = card ? card.querySelector('.prop-vote-count') : null;
          const current = parseInt(countEl ? countEl.textContent || '0' : '0', 10);
          await fetch(SUPABASE_URL + '/rest/v1/propuestas?id=eq.' + id, {
            method: 'PATCH',
            headers: { ...HEADERS, 'Prefer': 'return=minimal' },
            body: JSON.stringify({ votos: current + 1 })
          });
          saveVotedId(id);
          if (window._LI_addXP) window._LI_addXP(5);
          loadAndRender();
        } catch (_) {}
      });
    });
  }

  async function loadAndRender() {
    try {
      const res   = await fetch(SUPABASE_URL + '/rest/v1/propuestas?select=*&order=votos.desc,created_at.desc', { headers: HEADERS });
      const props = await res.json();
      renderFeed(Array.isArray(props) ? props : []);
    } catch (_) {
      feed.innerHTML = '<div class="li-empty prop-empty"><span>No se pudieron cargar las propuestas.</span></div>';
    }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const texto  = (textoIn  ? textoIn.value  : '').trim();
    const nombre = (nombreIn ? nombreIn.value : '').trim();
    if (texto.length < 10) {
      if (textoIn) { textoIn.style.borderColor = '#EF4444'; setTimeout(() => { textoIn.style.borderColor = ''; }, 1500); }
      return;
    }
    const submitBtn = form.querySelector('.prop-btn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }
    try {
      await fetch(SUPABASE_URL + '/rest/v1/propuestas', {
        method: 'POST',
        headers: { ...HEADERS, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ propuesta: texto, nombre: nombre || 'Anónimo', votos: 0 })
      });
      if (textoIn)  { textoIn.value  = ''; if (charCnt) charCnt.textContent = '0'; }
      if (nombreIn)   nombreIn.value = '';
      if (window._LI_addXP) window._LI_addXP(15);
      loadAndRender();
    } catch (_) {}
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Enviar'; }
  });

  loadAndRender();
}());


/* ── QUIZ ────────────────────────────────────────────────────────── */
(function () {
  const overlay  = document.getElementById('quiz-modal');
  const closeBtn = document.getElementById('quiz-modal-close');
  const body     = document.getElementById('quiz-modal-body');
  if (!overlay) return;

  const LS_KEY = 'li_quizzes';
  function getDone() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } }
  function markDone(id, score) {
    const d = getDone(); d[id] = { score, date: Date.now() };
    lsSet(LS_KEY, JSON.stringify(d));
  }

  let currentId   = null;
  let currentIdx  = 0;
  let answers     = [];

  function open(id) {
    const qs = QUIZ_BANK[id];
    if (!qs || !qs.length) return;
    currentId  = id;
    currentIdx = 0;
    answers    = [];
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    renderQuestion(qs);
  }

  function close() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    currentId = null;
  }

  function renderQuestion(qs) {
    const q    = qs[currentIdx];
    const done = getDone()[currentId];
    if (!q) { renderResult(qs); return; }
    body.innerHTML = `
      <div class="quiz-progress">
        <span class="quiz-prog-text">Pregunta ${currentIdx + 1} de ${qs.length}</span>
        <div class="quiz-prog-bar"><div class="quiz-prog-fill" style="width:${Math.round(currentIdx/qs.length*100)}%"></div></div>
      </div>
      <p class="quiz-question">${q.q}</p>
      <div class="quiz-opts">
        ${q.opts.map((opt, i) =>
          `<button class="quiz-opt-btn" data-idx="${i}">${opt}</button>`
        ).join('')}
      </div>`;

    body.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = +btn.dataset.idx;
        answers.push(chosen);
        /* reveal correct/wrong */
        body.querySelectorAll('.quiz-opt-btn').forEach((b, i) => {
          b.disabled = true;
          if (i === q.correct) b.classList.add('correct');
          else if (i === chosen && chosen !== q.correct) b.classList.add('wrong');
        });
        /* next after short delay */
        setTimeout(() => {
          currentIdx++;
          renderQuestion(qs);
        }, 900);
      });
    });
  }

  function renderResult(qs) {
    const correct = answers.filter((a, i) => a === qs[i].correct).length;
    const pct     = Math.round(correct / qs.length * 100);
    const xp      = correct * 20;
    markDone(currentId, pct);
    if (xp > 0 && window._LI_addXP) window._LI_addXP(xp);
    if (window._LI_updateProgress) window._LI_updateProgress();

    /* Actualizar botones en la UI */
    document.querySelectorAll(`.quiz-launch-btn[data-quiz-id="${currentId}"]`).forEach(b => {
      b.classList.add('quiz-done');
      b.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Quiz completado`;
      b.setAttribute('aria-label', 'Quiz ya completado');
    });

    const emoji = pct === 100 ? '🏆' : pct >= 50 ? '🎯' : '📚';
    body.innerHTML = `
      <div class="quiz-result">
        <span class="quiz-result-emoji">${emoji}</span>
        <p class="quiz-result-score">${correct} de ${qs.length} correctas</p>
        <div class="quiz-result-bar">
          <div class="quiz-result-fill" style="width:${pct}%"></div>
        </div>
        ${xp > 0 ? `<p class="quiz-result-xp">+${xp} XP ganados</p>` : ''}
        <p class="quiz-result-msg">${
          pct === 100 ? '¡Perfecto! Tienes el estudio muy bien asimilado.' :
          pct >= 50   ? 'Buen trabajo. Repasa las secciones que no recordabas.' :
                        'Vale la pena releer el artículo para fijar los conceptos.'
        }</p>
        <button class="quiz-close-final" id="quiz-close-final">Cerrar</button>
      </div>`;
    body.querySelector('#quiz-close-final')?.addEventListener('click', close);
  }

  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) close(); });

  document.addEventListener('click', e => {
    const btn = e.target.closest('.quiz-launch-btn');
    if (btn && btn.dataset.quizId && !btn.classList.contains('quiz-done')) open(btn.dataset.quizId);
  });
}());


/* ── DESAFÍOS — aceptar ─────────────────────────────────────────── */
(function () {
  const LS_KEY = 'li_challenges';
  document.addEventListener('click', e => {
    const btn = e.target.closest('.desafio-accept-btn');
    if (!btn || btn.disabled) return;
    const week = +btn.dataset.week;
    try {
      const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      d[week] = { date: Date.now() };
      lsSet(LS_KEY, JSON.stringify(d));
    } catch {}
    const block = document.getElementById('desafio-w' + week);
    if (block) {
      block.classList.add('desafio-accepted');
      btn.disabled = true;
      btn.setAttribute('aria-pressed', 'true');
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> Desafío aceptado`;
    }
    if (window._LI_addXP) window._LI_addXP(10);
    if (window._LI_updateProgress) window._LI_updateProgress();
  });
}());


/* ── MOBILE BOTTOM NAV — sistema de páginas ─────────────────────── */
(function () {
  const BREAKPOINT = 768;
  const nav        = document.getElementById('mobile-bottom-nav');
  const overlay    = document.getElementById('mbn-overlay');
  const tabs       = nav ? Array.from(nav.querySelectorAll('.mbn-tab')) : [];
  const PAGE_CLS   = ['mp-casa', 'mp-fuerabata', 'mp-descubrir', 'mp-botiquin', 'mp-yo'];
  const TAB_ORDER  = ['descubrir', 'fuerabata', 'casa', 'botiquin', 'yo'];
  const msh        = document.getElementById('msh-section-name');

  const PAGE_NAMES = {
    casa:      'Inicio',
    fuerabata: 'Fuera de Bata',
    descubrir: 'Descubrir',
    botiquin:  'Botiquín',
    yo:        'Mi perfil'
  };

  if (!nav || !tabs.length) return;

  function isMobile() { return window.innerWidth <= BREAKPOINT; }

  /* ── Paths dinámicos: actualiza viewBox y d= de ambos SVGs al ancho real de la barra ── */
  function updateNavCurvePaths() {
    if (!nav || !isMobile()) return;
    const W  = nav.offsetWidth;
    if (!W) return;
    const H  = 40;
    const cx = W / 2;
    /* Arco circular verdadero: mbn-home-wrap top:-14px h:58px → centro SVG y=55, radio=29
       Offset 8px → radio arco=37; puntos tangentes donde y=H intersecta el arco */
    const R_arc = 37;
    const cy_btn = 55;
    const half_w = Math.sqrt(R_arc * R_arc - (cy_btn - H) * (cy_btn - H));

    const lx = cx - half_w;
    const rx = cx + half_w;

    /* Bezier suave (G1 en entrada/salida, curvatura G2-matched al arco en el pico):
       Dos cúbicas simétricas unidas en el pico — sin quiebro perceptible al inicio/fin */
    const peak_y = cy_btn - R_arc;          // misma altura que el arco original (≈18)
    const span   = half_w * 1.55;           // semi-anchura extendida para entrada gradual
    const lx_b   = cx - span;
    const rx_b   = cx + span;
    const arm_h  = span * 0.57;             // longitud del brazo horizontal (arranque suave)
    const arm_v  = 31.4;                    // brazo vertical (iguala curvatura 1/R_arc en pico)

    const fillD   = `M0,${H} L${lx_b},${H} C${lx_b+arm_h},${H} ${cx-arm_v},${peak_y} ${cx},${peak_y} C${cx+arm_v},${peak_y} ${rx_b-arm_h},${H} ${rx_b},${H} L${W},${H} Z`;
    const strokeD = `M0,${H} L${lx_b},${H} C${lx_b+arm_h},${H} ${cx-arm_v},${peak_y} ${cx},${peak_y} C${cx+arm_v},${peak_y} ${rx_b-arm_h},${H} ${rx_b},${H} L${W},${H}`;

    const fillSvg = document.getElementById('mbn-curve-fill');
    if (fillSvg) {
      fillSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const p = fillSvg.querySelector('path');
      if (p) p.setAttribute('d', fillD);
    }

    const plasmaSvg = document.getElementById('mbn-curve-plasma');
    if (plasmaSvg) {
      plasmaSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const p = plasmaSvg.querySelector('path');
      if (p) p.setAttribute('d', strokeD);
      const grad = document.getElementById('plasma-grad');
      if (grad) {
        grad.setAttribute('x2', String(W));
        /* Actualizar el barrido para cubrir el nuevo ancho */
        const a1 = grad.querySelector('animate[attributeName="x1"]');
        const a2 = grad.querySelector('animate[attributeName="x2"]');
        if (a1) a1.setAttribute('values', `-${W};${W};-${W}`);
        if (a2) a2.setAttribute('values', `0;${W*2};0`);
      }
    }
  }

  /* ── Mover el indicador magnético al tab activo ── */
  function moveIndicator(page, instant) {
    const indicator = document.getElementById('mbn-indicator');
    if (!indicator) return;

    const wasHidden = indicator.classList.contains('mbn-indicator--hidden');

    /* Aritmética pura — no depende de getBoundingClientRect ni del estado del layout */
    function getCenterX(tabName) {
      const idx = tabs.findIndex(t => t.dataset.mbn === tabName);
      if (idx === -1) return null;
      return (idx + 0.5) * (nav.offsetWidth / tabs.length);
    }

    if (page === 'casa') {
      if (!instant && !wasHidden) {
        /* Animación 3D: viajar hacia el botón casa (X + Y + scale) luego ocultar */
        const casaX = getCenterX('casa');
        if (casaX !== null) indicator.style.left = casaX + 'px';
        indicator.classList.add('mbn-indicator--casa');
        setTimeout(() => {
          indicator.classList.add('mbn-indicator--hidden');
          /* Restablecer posición silenciosamente mientras está oculto */
          setTimeout(() => {
            indicator.style.transition = 'none';
            indicator.classList.remove('mbn-indicator--casa');
            indicator.offsetHeight;
            indicator.style.transition = '';
          }, 220);
        }, 280);
      } else {
        indicator.classList.add('mbn-indicator--hidden');
        indicator.classList.remove('mbn-indicator--casa');
      }
      return;
    }

    const activeTab = tabs.find(t => t.dataset.mbn === page);
    if (!activeTab) return;
    const tabRect = activeTab.getBoundingClientRect();
    const centerX = tabRect.left - nav.getBoundingClientRect().left + tabRect.width / 2;

    if (instant) {
      indicator.style.transition = 'none';
      indicator.classList.remove('mbn-indicator--casa');
      indicator.style.left = centerX + 'px';
      indicator.offsetHeight;
      indicator.style.transition = '';
    } else if (wasHidden) {
      /* Venimos de casa — el indicador "emerge" desde la posición del botón casa */
      indicator.style.transition = 'none';
      const casaX = getCenterX('casa');
      if (casaX !== null) indicator.style.left = casaX + 'px';
      indicator.classList.add('mbn-indicator--casa');
      indicator.classList.remove('mbn-indicator--hidden');
      indicator.offsetHeight; /* forzar reflow: aplica todo lo anterior sin transición */
      indicator.style.transition = '';
      /* Ahora animar simultáneamente: X, Y y scale hacia el tab destino */
      indicator.classList.remove('mbn-indicator--casa');
      indicator.style.left = centerX + 'px';
    } else {
      indicator.style.left = centerX + 'px';
    }

    indicator.classList.remove('mbn-indicator--hidden');
  }

  /* ── Cambiar de página con transición de fade + deslizamiento lateral ── */
  function switchPage(page, instant) {
    if (!isMobile()) return;

    const slideWrap = document.getElementById('mob-slide-wrap');

    /* Determinar dirección del deslizamiento */
    const prevPage = PAGE_CLS.find(c => document.body.classList.contains(c))?.replace('mp-', '');
    const prevIdx  = TAB_ORDER.indexOf(prevPage);
    const nextIdx  = TAB_ORDER.indexOf(page);
    const slideDir = (nextIdx > prevIdx) ? 'right' : 'left';

    const doSwitch = () => {
      PAGE_CLS.forEach(c => document.body.classList.remove(c));
      document.body.classList.add('mp-' + page);
      tabs.forEach(t => t.classList.toggle('mbn-tab--active', t.dataset.mbn === page));
      if (msh) msh.textContent = PAGE_NAMES[page] || page;
      if (instant) moveIndicator(page, true);
    };

    if (instant) {
      (document.getElementById('app') || document.documentElement).scrollTop = 0;
      doSwitch();
      return;
    }

    /* En móvil el scroll ocurre en #app (body overflow:hidden) → sin cambio de viewport */
    (document.getElementById('app') || document.documentElement).scrollTop = 0;

    /* Indicador se mueve YA (nav vive sobre el overlay → animación siempre visible) */
    moveIndicator(page, false);

    /* Fade out → switch + slide → fade in */
    overlay.classList.add('mbn-fade');
    setTimeout(() => {
      doSwitch();
      /* Disparar animación de deslizamiento en el contenido */
      if (slideWrap) {
        slideWrap.classList.remove('slide-enter-right', 'slide-enter-left');
        slideWrap.offsetHeight; /* forzar reflow */
        slideWrap.classList.add(slideDir === 'right' ? 'slide-enter-right' : 'slide-enter-left');
        setTimeout(() => slideWrap.classList.remove('slide-enter-right', 'slide-enter-left'), 320);
      }
      requestAnimationFrame(() => {
        overlay.classList.remove('mbn-fade');
      });
    }, 145);
  }

  /* ── Inicializar en Casa ── */
  function init() {
    document.body.classList.add('mobile-nav-active');
    /* Paths dinámicos al primer render */
    updateNavCurvePaths();
    const hash = window.location.hash;
    if (hash === '#botiquin') {
      switchPage('botiquin', true);
    } else if (hash === '#timeline') {
      switchPage('descubrir', true);
    } else {
      switchPage('casa', true);
    }
  }

  /* Recalcular paths si el viewport cambia (orientación, etc.) */
  window.addEventListener('resize', () => { updateNavCurvePaths(); }, { passive: true });

  /* ── Click en tabs ── */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (!isMobile()) return;
      const current = PAGE_CLS.find(c => document.body.classList.contains(c));
      if (current === 'mp-' + tab.dataset.mbn) return; /* ya estamos aquí */
      switchPage(tab.dataset.mbn);
    });
  });

  /* ── La burbuja "Tu problema, tu libro" abre Botiquín en móvil ── */
  const heroBubble = document.getElementById('hero-bubble');
  if (heroBubble) {
    heroBubble.addEventListener('click', e => {
      if (isMobile()) {
        e.preventDefault();
        switchPage('botiquin');
      }
    });
  }

  /* ── Arranque ── */
  if (isMobile()) init();

  /* ── Resize: cruzar el breakpoint ── */
  let wasMobile = isMobile();
  window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (nowMobile === wasMobile) return;
    wasMobile = nowMobile;
    if (nowMobile) {
      init();
    } else {
      document.body.classList.remove('mobile-nav-active', ...PAGE_CLS);
    }
  }, { passive: true });

  /* Exponer para uso desde otros módulos */
  window._LI_mobileNav = { switchPage };
}());


/* ── TOC — smooth scroll + active section ───────────────────────── */
(function () {
  let tocObserver = null;

  function initToc() {
    const links = document.querySelectorAll('.toc-link');
    if (!links.length) return;

    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    if (tocObserver) tocObserver.disconnect();
    const headings = document.querySelectorAll('.article-subtitle[id]');
    tocObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('toc-active'));
          const active = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('toc-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    headings.forEach(h => tocObserver.observe(h));
  }

  /* Reinicializar TOC cada vez que se renderiza un artículo */
  const observer = new MutationObserver(() => {
    if (document.querySelector('.article-toc')) initToc();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}());


/* ── SECCIÓN YO — Perfil Premium Móvil ─────────────────────── */
(function () {
  const LS_XP      = 'li_xp_v1';
  const LS_EFECTOS = 'li_efectos_seen';
  const LS_MITOS   = 'li_mitos_answered';
  const LS_PRUEBAS = 'li_pruebas_done';
  const LS_STREAK  = 'li_streak';
  const LS_LIB     = 'li_lib_read';
  const LS_WEEKLY  = 'li_weekly_read';
  const LS_FAVS    = 'li_favorites';

  const TOTAL_EFECTOS = 18;
  const TOTAL_MITOS   = 20;
  const TOTAL_PRUEBAS = 8;

  const NIVELES = [
    { nivel: 0, nombre: 'Estado Latente',       xpMin: 0,    xpMax: 149,      badge: 'img/Nivel00.png' },
    { nivel: 1, nombre: 'Observador Casual',    xpMin: 150,  xpMax: 599,      badge: 'img/Nivel1.png'  },
    { nivel: 2, nombre: 'Mente Inquisitiva',    xpMin: 600,  xpMax: 1499,     badge: 'img/Nivel2.png'  },
    { nivel: 3, nombre: 'Analista Crítico',     xpMin: 1500, xpMax: 2999,     badge: 'img/Nivel3.png'  },
    { nivel: 4, nombre: 'Pensador Estratégico', xpMin: 3000, xpMax: 5499,     badge: 'img/Nivel04.png' },
    { nivel: 5, nombre: 'Córtex Supremo',       xpMin: 5500, xpMax: Infinity, badge: 'img/Nivel05.png' }
  ];

  function safeLs(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || fallback); } catch { return JSON.parse(fallback); }
  }

  function getNivel(xp) {
    for (let i = NIVELES.length - 1; i >= 0; i--) {
      if (xp >= NIVELES[i].xpMin) return NIVELES[i];
    }
    return NIVELES[0];
  }

  function updateYoPerfil() {
    const section = document.getElementById('mob-yo-section');
    if (!section) return;
    const $ = id => document.getElementById(id);

    /* XP y nivel */
    const xp   = parseInt(localStorage.getItem(LS_XP) || '0', 10);
    const n    = getNivel(xp);
    const next = NIVELES[n.nivel + 1];
    const pct  = next
      ? Math.min(Math.round(((xp - n.xpMin) / (n.xpMax - n.xpMin + 1)) * 100), 100)
      : 100;

    const badge = $('mob-yo-badge-img');
    if (badge) { badge.src = n.badge; badge.alt = n.nombre; }
    const rank = $('mob-yo-rank');
    if (rank) rank.textContent = n.nombre;
    const chip = $('mob-yo-xp-chip');
    if (chip) chip.textContent = 'Nivel ' + n.nivel;
    const xpFill = $('mob-yo-xp-fill');
    if (xpFill) xpFill.style.width = pct + '%';
    const xpTrack = $('mob-yo-xp-track');
    if (xpTrack) xpTrack.setAttribute('aria-valuenow', pct);
    const legend = $('mob-yo-xp-legend');
    if (legend) {
      legend.textContent = next
        ? xp + ' XP · ' + (n.xpMax + 1 - xp) + ' XP para el siguiente nivel'
        : xp + ' XP · Nivel máximo alcanzado';
    }

    /* Stats */
    const artRead     = safeLs(LS_LIB, '[]').length;
    const weekRead    = safeLs(LS_WEEKLY, '[]').length;
    const efectosSeen = safeLs(LS_EFECTOS, '[]').length;
    const mitosAnsw   = Math.min(parseInt(localStorage.getItem(LS_MITOS) || '0', 10), TOTAL_MITOS);
    const streak      = parseInt(localStorage.getItem(LS_STREAK) || '0', 10);
    const pruebasDone = Math.min(parseInt(localStorage.getItem(LS_PRUEBAS) || '0', 10), TOTAL_PRUEBAS);

    function setStat(numId, barId, val, total, fmt) {
      const num = $(numId);
      const bar = $(barId);
      if (num) num.textContent = fmt ? fmt(val, total) : String(val);
      if (bar) bar.style.width = (total ? Math.min(Math.round(val / total * 100), 100) : 0) + '%';
    }

    setStat('mob-yo-s-art', 'mob-yo-b-art', artRead,     null,           v => v);
    setStat('mob-yo-s-sem', 'mob-yo-b-sem', weekRead,    null,           v => v);
    setStat('mob-yo-s-efe', 'mob-yo-b-efe', efectosSeen, TOTAL_EFECTOS,  (v,t) => v + ' / ' + t);
    setStat('mob-yo-s-mit', 'mob-yo-b-mit', mitosAnsw,   TOTAL_MITOS,    (v,t) => v + ' / ' + t);
    setStat('mob-yo-s-rac', 'mob-yo-b-rac', streak,      7,              v => v);
    setStat('mob-yo-s-pru', 'mob-yo-b-pru', pruebasDone, TOTAL_PRUEBAS,  (v,t) => v + ' / ' + t);

    /* Favoritos */
    const favIds  = safeLs(LS_FAVS, '[]');
    const catalog = window._LI_CATALOG || {};
    const favGrid = $('mob-yo-favs-grid');
    const favCnt  = $('mob-yo-favs-count');
    if (favCnt) favCnt.textContent = String(favIds.length);

    if (favGrid) {
      if (favIds.length === 0) {
        favGrid.innerHTML = '<div class="mob-yo-favs-empty">'
          + '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
          + '<p>Aún no tienes favoritos. Guarda artículos con el botón ♥ de cualquier sección.</p>'
          + '</div>';
      } else {
        favGrid.innerHTML = favIds.slice(0, 6).map(id => {
          const item = catalog[id];
          if (!item) return '';
          return '<div class="mob-yo-fav-card" role="button" tabindex="0" data-fav-id="' + id + '">'
            + '<span class="mob-yo-fav-cat">' + (item.badge || item.type || 'Artículo') + '</span>'
            + '<p class="mob-yo-fav-title">' + item.title + '</p>'
            + '</div>';
        }).filter(Boolean).join('');
      }
    }
  }

  /* Actualizar al hacer clic en el tab Yo */
  document.addEventListener('DOMContentLoaded', () => {
    const yoTab = document.querySelector('.mbn-tab[data-mbn="yo"]');
    if (yoTab) yoTab.addEventListener('click', () => setTimeout(updateYoPerfil, 180));
    if (document.body.classList.contains('mp-yo')) updateYoPerfil();
  });

  window._LI_updateYoPerfil = updateYoPerfil;
}());
