self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('kdamk-cache').then(function(cache) {
      return cache.addAll([
        '/kdamk1/login.html',
        '/kdamk1/style.css', // عدّل حسب اسم ملف CSS لو عندك
        '/kdamk1/script.js'  // عدّل حسب ملف JS لو عندك
      ]);
    })
  );
}); 

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
