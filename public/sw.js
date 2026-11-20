// Toolkit Gen Service Worker (v5-clean)
// Robust network-first navigation with offline cache fallback, asset caching, and zero-hang guarantees
const BUILD_VERSION = 'v5-clean';
const CACHE_NAME = `tg-cache-${BUILD_VERSION}`;

const PRECACHE_SHELL = [
  '/',
  '/tool',
  '/assets/favicon/favicon.svg',
  '/assets/favicon/favicon-96x96.png',
  '/assets/katex/katex.min.css'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_SHELL)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SW_CLEAR_CACHE' || event.data === 'SW_CHECK_RESET') {
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Strictly same-origin GET requests only
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // 1. Static Immutable Hashed Assets (/_astro/*, /assets/*) -> Cache First with network fallback
  if (
    url.pathname.startsWith('/_astro/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.match(/\.(woff2?|ttf|png|svg|ico|css|js|wasm)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // 2. HTML Page Navigation -> Transparent Network First with Offline Fallback (ZERO HANGS)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            return caches.match('/') || new Response('Offline - Toolkit Gen', { status: 503, headers: { 'Content-Type': 'text/plain' } });
          });
        })
    );
    return;
  }
});
