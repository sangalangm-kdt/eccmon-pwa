/* eslint-disable no-restricted-globals */
import { clientsClaim, setCacheNameDetails } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import {
  precacheAndRoute,
  createHandlerBoundToURL,
  cleanupOutdatedCaches,
} from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

const SW_VERSION = "1.0.4"; // ✅ bump per release

setCacheNameDetails({
  prefix: "eccmon",
  suffix: SW_VERSION,
});

clientsClaim();
cleanupOutdatedCaches();

// ✅ Precache build assets
precacheAndRoute(self.__WB_MANIFEST);

// ✅ SPA fallback (Vite-friendly)
registerRoute(
  ({ request, url }) => {
    if (request.mode !== "navigate") return false;
    if (url.pathname.startsWith("/_")) return false;
    if (url.pathname.match(/\/[^/?]+\.[^/]+$/)) return false;
    return true;
  },
  createHandlerBoundToURL("/index.html"),
);

// ✅ Images
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  }),
);

// ✅ Scripts + styles
registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "assets-cache",
  }),
);

// ✅ API (only if same-origin; if your API is another domain, tell me and I’ll adjust)
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24,
      }),
    ],
  }),
);

// ✅ Skip waiting when app asks
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

// ✅ Do not override Workbox fetch handling; only bypass websockets
self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith("wss://")) return;
});
