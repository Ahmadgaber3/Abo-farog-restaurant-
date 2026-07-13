        const CACHE_NAME = 'abo-faroug-cache-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './images/logooo.png'
];

// تثبيت السيرفس وركر وعمل الكاش الأساسي
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// تفعيل السيرفس وركر
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استدعاء الملفات من الكاش عند انقطاع الإنترنت
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});