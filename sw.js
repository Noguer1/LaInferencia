/* Service worker mínimo: solo habilita el "formato app" (que se pueda
   añadir a la pantalla de inicio y abrir en modo standalone).
   NO cachea artículos ni contenido: sin lectura sin conexión, por decisión.
   El listener de fetch es passthrough (no llama a respondWith), lo justo
   para que el navegador considere la web instalable. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => { /* passthrough: lo maneja el navegador */ });
