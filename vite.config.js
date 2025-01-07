import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react({ fastRefresh: true }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "maskable_icon.png",
        "192x192.png",
        "256x256.png",
        "384x384.png",
        "512x512.png",
      ],
      manifest: {
        name: "ECCMon",
        short_name: "ECCMon",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "maskable_icon.png", sizes: "196x196", type: "image/png" },
          { src: "192x192.png", sizes: "192x192", type: "image/png" },
          { src: "256x256.png", sizes: "256x256", type: "image/png" },
          { src: "384x384.png", sizes: "384x384", type: "image/png" },
          { src: "512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "js-css-cache",
            },
          },
        ],
      },
    }),
    viteCompression({
      algorithm: "brotliCompress", // Options: 'gzip' | 'brotliCompress'
      threshold: 1024, // Compress files larger than 1KB
      deleteOriginFile: false, // Keep the original uncompressed files as well
    }),
  ],
  css: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
