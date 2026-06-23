const CACHE_NAME = 'wszystkokolwiek-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192-v2.png',
  '/icon-512-v2.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(async () => {
      const match = await caches.match(event.request);
      if (match) return match;
      
      const rootMatch = await caches.match('/');
      if (rootMatch) return rootMatch;

      return new Response('Zostaleś odłączony od sieci (Offline Mode).', {
        status: 200,
        headers: new Headers({ 'Content-Type': 'text/plain' })
      });
    })
  );
});
