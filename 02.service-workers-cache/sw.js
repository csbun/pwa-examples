var CACHE_NAME = '02.service-workers-cache:v1';
var URLS_TO_CACHE = [
  // '/pwa-examples/02.service-workers-cache/NOT_EXIST.flie',
  '/pwa-examples/02.service-workers-cache/css/style.css',
  '/pwa-examples/02.service-workers-cache/js/index.js',
  'https://unpkg.com/resize-image@0.0.4/example/google.png',
  // 'https://developers.google.com/web/fundamentals/primers/service-workers/images/sw-lifecycle.png',
];

var URLS_TO_CACHE_NO_CROSS = [
];

// Cache all files on install
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        // return cache.addAll(URLS_TO_CACHE);
        return Promise.all(URLS_TO_CACHE.map(function (url) {
          // https://developers.google.com/web/fundamentals/primers/service-workers/#non-cors_fail_by_default
          const options = /^http[s]:\/\/[^unpkg]/.test(url) ? { mode: 'no-cors' } : {};
          return cache.add(new Request(url, options));
        }));
      })
  );
  console.log('Installed');
});

// Cache and return requests
self.addEventListener('fetch', function(event) {
  // https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
  console.log(event.request.referrer);
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