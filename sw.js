const CACHE_NAME = 'abo-farog-v2'; // تغيير الاسم هنا بيجبر المتصفح يمسح القديم

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

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

self.addEventListener('fetch', (e) => {
    // بيجيب الملفات من النت مباشرة عشان نضمن إن أي تعديل يظهر فوراً
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
