// const CACHE_NAME = 'map-tiles-cache-v1'; // Use versioning for cache
// const urlsToCache: string[] = [
//     // List other assets or routes to cache
// ];

// self.addEventListener('install', (event: ExtendableEvent) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(urlsToCache);
//         })
//     );
// });

// self.addEventListener('fetch', (event: FetchEvent) => {
//     if (event.request.url.includes('mapbox.com/styles')) {
//         event.respondWith(
//             caches.match(event.request).then((response) => {
//                 if (response) {
//                     // Serve from cache and update in background
//                     fetch(event.request).then((networkResponse) => {
//                         caches.open(CACHE_NAME).then((cache) => {
//                             cache.put(event.request.url, networkResponse.clone());
//                         });
//                     });
//                     return response;
//                 }
//                 return fetch(event.request).then((networkResponse) => {
//                     return caches.open(CACHE_NAME).then((cache) => {
//                         cache.put(event.request.url, networkResponse.clone());
//                         return networkResponse;
//                     });
//                 });
//             })
//         );
//     } else {
//         event.respondWith(
//             fetch(event.request).catch(() => caches.match(event.request))
//         );
//     }
// });

// self.addEventListener('activate', (event: ExtendableEvent) => {
//     const cacheWhitelist = [CACHE_NAME];
//     event.waitUntil(
//         caches.keys().then((cacheNames) =>
//             Promise.all(
//                 cacheNames.map((cacheName) => {
//                     if (!cacheWhitelist.includes(cacheName)) {
//                         return caches.delete(cacheName);
//                     }
//                 })
//             )
//         )
//     );
// });
