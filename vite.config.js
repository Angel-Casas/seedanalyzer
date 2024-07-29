import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import { VitePWA as pwa } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    pwa({
      strategies: "generateSW",
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "robots.txt"],
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        cacheId: Date.now().toString(32),
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      }
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
