console.log('Hello from the service worker!!');

const CACHE_NAME = 'photobooth-v21';
const urlsToCache = ['/index.html'];

self.addEventListener('install', event => {
  console.log('[SW] Install');
  self.skipWaiting();
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(urlsToCache).then(() => {
        console.log('Worker Install Complete');
      })
    )
  );
});

// Intercept Network Requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Cache hit - return response
      if (response) {
        console.info(`Serving ${event.request.url} from SW Cache`);
        return response;
      }

      // Clone the request because it's a one time use stream
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(response => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response because it's a one time use stream
        const responseToCache = response.clone();

        event.waitUntil(
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          })
        );

        return response;
      });
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW]', 'Activate!');
  // delete the old caches
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          // filter for caches that aren't the current one
          .filter(cacheName => cacheName !== CACHE_NAME)
          // map over them and delete them
          .map(cacheName => caches.delete(cacheName))
      )
    )
  );
});
