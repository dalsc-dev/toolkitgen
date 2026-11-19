// Toolkit Gen Service Worker (v4-astro)
// Safe network-first HTML with offline fallback, hashed asset caching, and kill-switch
const BUILD_VERSION = 'v4-astro';
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

// Kill-switch: check if remote flag requests cache purge & unregister
async function checkKillSwitch() {
  try {
    const res = await fetch('/sw-reset.json?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && data.reset === true) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
        await self.registration.unregister();
        const clients = await self.clients.matchAll();
        clients.forEach((c) => c.navigate(c.url));
        return true;
      }
    }
  } catch (e) {}
  return false;
}

self.addEventListener('message', (event) => {
  if (event.data === 'SW_CHECK_RESET') {
    checkKillSwitch();
  }
  if (event.data === 'SW_CLEAR_CACHE') {
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

  // Bypass service worker for sw-reset.json
  if (url.pathname === '/sw-reset.json') {
    return;
  }

  // 1. Static Immutable Hashed Assets (/_astro/*, /assets/*) -> Cache First with runtime update
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
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // 2. HTML Page Navigation -> Network First with 3-second timeout & safe cache fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      new Promise((resolve) => {
        let didTimeout = false;
        const timer = setTimeout(() => {
          didTimeout = true;
          caches.match(request).then((cached) => {
            if (cached) resolve(cached);
          });
        }, 3000);

        fetch(request)
          .then((networkRes) => {
            clearTimeout(timer);
            if (networkRes && networkRes.status === 200) {
              const clone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            if (!didTimeout) resolve(networkRes);
          })
          .catch(() => {
            clearTimeout(timer);
            caches.match(request).then((cached) => {
              if (cached) resolve(cached);
              else resolve(new Response('Offline - Page not in cache', { status: 503, headers: { 'Content-Type': 'text/plain' } }));
            });
          });
      })
    );
    return;
  }
});
