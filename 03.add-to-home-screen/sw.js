var CACHE_NAME = '03.add-to-home-screen:v1';

// Cache and return requests
// This allows your app run offline
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
        /**
         * Cache new requests cumulatively
         */
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(
          function(response) {
            console.log('Fetch', event.request.url, 'from remote');
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                console.log('And save', event.request.url, 'to cache');
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});