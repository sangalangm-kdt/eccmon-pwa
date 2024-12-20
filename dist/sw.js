if (!self.define) {
  let e,
    s = {};
  const n = (n, i) => (
    (n = new URL(n + ".js", i).href),
    s[n] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, r) => {
    const l =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[l]) return;
    let o = {};
    const a = (e) => n(e, l),
      t = { module: { uri: l }, exports: o, require: a };
    s[l] = Promise.all(i.map((e) => t[e] || a(e))).then((e) => (r(...e), o));
  };
}
define(["./workbox-879c7532"], function (e) {
  
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "assets/_version-BjL_A-pP.js", revision: null },
        { url: "assets/ForgotPass-Cs_2U3JA.js", revision: null },
        { url: "assets/Home-Br1qTE0j.js", revision: null },
        { url: "assets/icons-Da8nkH19.js", revision: null },
        { url: "assets/index-BGdytESt.css", revision: null },
        { url: "assets/index-C5dg4u7A.js", revision: null },
        { url: "assets/Login-78GC7Z9_.js", revision: null },
        { url: "assets/ProfilePage-BNPTwOhK.js", revision: null },
        { url: "assets/QRScanner-BqKXSBSP.js", revision: null },
        { url: "assets/workbox-window.prod.es5-NU22iWMg.js", revision: null },
        { url: "index.html", revision: "852b35ef9b04d7da8d4fb3072acc0b95" },
        { url: "192x192.png", revision: "4443784e9999f201233b3a884b72bd03" },
        { url: "256x256.png", revision: "499e1056e15861092cdefa5aee6b817b" },
        { url: "384x384.png", revision: "41b898f59e63711afa8970846ac93e09" },
        { url: "512x512.png", revision: "2e95057905570f0b4ed7ee0d9eaec5c8" },
        { url: "favicon.ico", revision: "9790692744091289984835aca2bd325a" },
        {
          url: "maskable_icon.png",
          revision: "4f3c8a7eb052696a4a6b598f9fe4aec9",
        },
        {
          url: "manifest.webmanifest",
          revision: "1f2dd52cb0c39453230107da4fbf561c",
        },
      ],
      {},
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html")),
    ),
    e.registerRoute(
      ({ request: e }) => "document" === e.destination,
      new e.NetworkFirst({
        cacheName: "html-cache",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e }) => "image" === e.destination,
      new e.CacheFirst({
        cacheName: "image-cache",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e }) =>
        "script" === e.destination || "style" === e.destination,
      new e.StaleWhileRevalidate({ cacheName: "js-css-cache", plugins: [] }),
      "GET",
    );
});
