import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react({ fastRefresh: false }),
    VitePWA({
      registerType: "prompt", // Automatically triggers the install prompt
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt"], // Include assets like favicon and robots.txt
      manifest: "./public/manifest.json", // Path to manifest file
      workbox: {
        // Define caching strategies for different resources
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document", // Cache HTML documents
            handler: "NetworkFirst", // Fallback to cache if network fails
            options: {
              cacheName: "html-cache",
              expiration: {
                maxEntries: 10, // Limit to 10 cached HTML files
                maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image", // Cache image files
            handler: "CacheFirst", // Serve cached images if available
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 20, // Limit to 20 cached images
                maxAgeSeconds: 30 * 24 * 60 * 60, // Cache images for 30 days
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style", // Cache JS and CSS files
            handler: "StaleWhileRevalidate", // Serve stale content while fetching new content
            options: {
              cacheName: "js-css-cache",
            },
          },
        ],
      },
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

  devOptions: {
    enabled: true, // Enables service worker in development for testing
    type: "module", // Uses ESM modules for the service worker
  },
});
