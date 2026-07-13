const CACHE_NAME = 'abu-farouk-v2';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './images/logooo.png'
];

self.addEventListener('install', e => {
  self.skipWaiting(); // تفعيل فوري يجبر المتصفح على قبول التثبيت
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim()); // السيطرة الفورية على الصفحة
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});