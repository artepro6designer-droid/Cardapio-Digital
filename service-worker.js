const CACHE_NAME = "doces-da-lua-v3-cardapio-02";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/products.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./assets/images/logo-square.png",
  "./assets/images/logo-horizontal.png",
  "./assets/images/footer/logo-doces-da-lua-footer@2x.png",
  "./assets/images/footer/logo-delivery-footer@2x.png",
  "./assets/images/bolo-de-pote.png",
  "./assets/images/trufas.png",
  "./assets/images/alfajor.png",
  "./assets/images/cone-trufado.png",
  "./assets/images/copos.png",
  "./assets/images/coracao-de-chocolate.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match("./index.html"));
  }));
});
