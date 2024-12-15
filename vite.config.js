import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react({ fastRefresh: false }),
    VitePWA({
      manifest: "./public/manifest.json",
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
