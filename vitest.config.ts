import path from "node:path";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { paraglidePluginOptions } from "./src/i18n/paraglide.vite";

export default defineConfig({
  optimizeDeps: {
    include: ["@inlang/paraglide-js-react"],
  },
  plugins: [react(), paraglideVitePlugin(paraglidePluginOptions)],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts"],
          setupFiles: ["src/test/paraglide-test-setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["src/**/*.test.tsx"],
          setupFiles: [
            "src/test/paraglide-test-setup.ts",
            "src/test/browser-setup.ts",
          ],
          browser: {
            enabled: true,
            headless: true,
            screenshotFailures: false,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
