const CACHE_NAME = 'antirracismo-v1.7';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './img/img1.png',
  './img/img2.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k))))
  );
  clients.claim();
});

// Cache-first para estáticos; network-first para navegação (SPA fallback)
self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }

  event.respondWith(caches.match(req).then(res => res || fetch(req)));
});
