import path from "node:path";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          path.resolve(__dirname, "../../packages/ui/src/styles"),
        ],
      },
    },
  },
  plugins: [
    /* Please make sure that '@tanstack/router-plugin'
     * is passed before '@vitejs/plugin-react'
     */
    tanstackRouter({
      autoCodeSplitting: true,
      routeFileIgnorePattern: "\\.(test|spec)\\.(tsx|ts)$",
      target: "react",
    }),
    react(),
  ],
  resolve: {
    alias: {
      "app/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
