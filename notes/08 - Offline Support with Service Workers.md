# Service Workers

Service workers are the last piece of the pie for us today.

Service Workers are scripts that can run in the background of your browser - it's sort of a "3rd space" where they run. They don't run in the Browser's open web page, they don't run on the server, but they run in the background of the browser.

The main ideas behind what service workers can do:

1. Cache files
1. Intercept Network requests
1. Run code when the user isn't on the page

This paves the way for desktop app-like features:

1. Background Sync
1. Offline Access
1. Push Notifications (possibly hated)

Today we are going to be focusing on making our application both load instantly after first visit as well as work offline.

Remember that Service Workers don't run in the web page, and they have no access to the current page or the DOM. They run in a background process and have elevated privileges. Because of the elevated privileges, you always need to run service workers on a secure origin, that is either `localhost` or an `https://` site.


## Registering a Service Worker

Our first step is to write some client-side code in our app.js file that registers the service worker. Let's talk through each of these together.

```js
// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registration = await navigator.serviceWorker.register('./service-worker.js', {
      scope: '/',
    });
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
    // TODO: listen for updates
  });
}
```

A few important notes about the above:

1. The service-worker.js is the file that runs in the background - the code above is just client-side code to register it.
1. The service worker must be in the root of your document that you wish to cache. If the service worker is in a sub-folder, it is unable to cache anything above it.

## Service Worker Dev Tools

The Dev tools with Service Workers are a must-have. We can get into some really weird spots where we cache our app.js, and before we write the code to clear that cache, we will be stuck in that cache forever.

The dev tools allows us to clear or bypass that cache, refresh the service worker, and emulate offline mode.

Let's look at them now.

## Installing The SW and Caching Files

Here is a great diagram detailing the lifecycle of a service worker taken from [Google's docs on Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers/)

![](https://developers.google.com/web/fundamentals/primers/service-workers/images/sw-lifecycle.png)

For each of these lifecycle stages, the Service worker will emit an event - we can hook into these events.

1. Installing: Cache the page
2. Fetch Intercept: Serve Page from Cache
3. Activated: Clear old cache when a new SW is activated

So let's start off with the first bit which is caching the entire page:

```js
const CACHE_NAME = 'photobooth-v2';
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
```

## Intercepting Network Requests

Next we need to intercept any network requests and service the value from the cache. This is an incredibly complicated piece of code - I don't expect you to type it yourself.

Service workers are very low level — I believe we will (and are already) see tools that make this level of development unnecessary to most web developers - Google has a project called [workbox](https://developers.google.com/web/tools/workbox/) that aims to do this.

```js
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
```

## Handling Updates

Every time the page loads, the browser will check to see if there is a new service worker available. If there is even a byte of difference between the old service worker and the new service worker, the the new one will be put into "waiting" mode while the old one will be used until the user refreshes the page. Upon refreshing, the old one will be deactivated and the new one will be installed.

To handle updates, we first need to change the cache name:

```js
const CACHE_NAME = 'photobooth-v4';
```

And then we need to hook into the "activate" event and clear out any older cache.

```js
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
```

Finally, we need some sort of way to tell the user to refresh the page, so we can do that in our SW registration where we have the TODO:

```js
registration.onupdatefound = () => {
  alert('Hey, there is an update to this app! Just refresh your browser to see');
};
```
