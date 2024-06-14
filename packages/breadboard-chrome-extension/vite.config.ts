import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";
import { resolve } from "path";
import path from "path";

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, "src");
const pagesDir = resolve(srcDir, "pages");

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@breadboard": path.resolve(__dirname, "./src/breadboard"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@background": path.resolve(__dirname, "./src/pages/background"),
      "@popup": path.resolve(__dirname, "./src/pages/popup"),
      "@settings": path.resolve(__dirname, "./src/pages/settings"),
    },
  },
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(pagesDir, "popup", "index.html"),
        settings: resolve(pagesDir, "settings", "index.html"),
        permission: resolve(pagesDir, "permission", "index.html"),
      },
      output: {
        entryFileNames: "src/pages/[name]/index.js",
      },
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true, //browsers can handle top-level-await features
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/anthropic": {
        target: "https://api.anthropic.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/anthropic/, ""),
      },
      "/claude": {
        target: "https://api.anthropic.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/claude/, "/v1/complete"),
      },
    },
  },
});
