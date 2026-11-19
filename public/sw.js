// sw.js
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

// Chrome requires a fetch handler to consider the app installable.
// This simple pass-through satisfies the requirement without messing with your network requests.
self.addEventListener('fetch', (e) => {
    return;
});