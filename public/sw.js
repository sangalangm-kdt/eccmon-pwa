/* eslint-disable no-restricted-globals */


const CACHE_VERSION = "__APP_VERSION__";

const CACHE_NAME = `vite-app-cache-v${CACHE_VERSION}`;

// Keep this minimal (only true “app shell” files)
const ASSETS_TO_CACHE = ["/", "/index.html", "/favicon.ico", "/manifest.json"];

// ---- Install: cache app shell + activate immediately ----
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(ASSETS_TO_CACHE);
      // ✅ activate this SW immediately
      await self.skipWaiting();
    })(),
  );
});

// ---- Activate: clean old caches + control pages immediately ----
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)),
      );

      // ✅ take control without needing refresh
      await self.clients.claim();
    })(),
  );
});

// ---- Optional: allow UI to force update (registration.waiting.postMessage) ----
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ---- Fetch: cache-first for navigation + assets; network-first for others ----
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // ✅ App navigation: serve cached index.html (SPA support)
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match("/index.html");
        try {
          const fresh = await fetch(req);
          return fresh;
        } catch {
          return cached || Response.error();
        }
      })(),
    );
    return;
  }

  // ✅ Static files: cache-first
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);

        // cache only basic successful responses
        if (fresh && fresh.status === 200 && fresh.type === "basic") {
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch {
        return cached || Response.error();
      }
    })(),
  );
});
