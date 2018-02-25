var CACHE_NAME = '02.service-workers-cache:v1';
var urlsToCache = [
  // '/pwa-examples/02.service-workers-cache/NOT_EXIST.flie',
  '/pwa-examples/02.service-workers-cache/css/style.css',
  '/pwa-examples/02.service-workers-cache/js/index.js',
];

// Cache all files on install
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  console.log('Installed');
});

// Cache and return requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('Fetch from cache:', event.request.url);
          return response;
        }

        console.log('Fetch from remote:', event.request.url);
        return fetch(event.request);
      })
    );
});