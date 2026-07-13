const CACHE_NAME = 'abu-farouk-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './images/logooo.png'
];

// تثبيت السيرفس وركر وعمل الكاش الأولي
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// تفعيل السيرفس وركر ومسح الكاش القديم تلقائياً لو تغير الاسم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// التعامل مع الطلبات (الاستجابة الفورية لسرعة التطبيق)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});