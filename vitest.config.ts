import path from "node:path";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { paraglidePluginOptions } from "./src/i18n/paraglide.vite";
import { srcAlias } from "./vite.shared";

export default defineConfig({
  optimizeDeps: {
    entries: ["tests/**/*.test.tsx"],
    include: [
      "@inlang/paraglide-js-react",
      "@vercel/analytics/react",
      "@ark-ui/react",
      "@ark-ui/react/menu",
      "@unpic/react",
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-dev-runtime",
      "react/jsx-runtime",
      "pixelarticons/react/AppWindows",
      "pixelarticons/react/ArrowUpBox",
      "pixelarticons/react/AudioWaveform",
      "pixelarticons/react/Backpack",
      "pixelarticons/react/BookOpen",
      "pixelarticons/react/Briefcase",
      "pixelarticons/react/CalendarRange",
      "pixelarticons/react/Check",
      "pixelarticons/react/ChevronLeft",
      "pixelarticons/react/ChevronRight",
      "pixelarticons/react/Clock",
      "pixelarticons/react/Close",
      "pixelarticons/react/Coins",
      "pixelarticons/react/Crown",
      "pixelarticons/react/Download",
      "pixelarticons/react/Gift",
      "pixelarticons/react/Hand",
      "pixelarticons/react/Heart",
      "pixelarticons/react/InfoBox",
      "pixelarticons/react/Loader",
      "pixelarticons/react/Lock",
      "pixelarticons/react/Menu",
      "pixelarticons/react/Message",
      "pixelarticons/react/Music",
      "pixelarticons/react/Potion",
      "pixelarticons/react/Reload",
      "pixelarticons/react/Volume1",
      "pixelarticons/react/Volume2",
      "pixelarticons/react/Volume3",
    ],
  },
  plugins: [react(), paraglideVitePlugin(paraglidePluginOptions)],
  resolve: {
    alias: {
      ...srcAlias,
      "virtual:pwa-register": path.resolve(
        import.meta.dirname,
        "./tests/setup/pwa-register-mock.ts"
      ),
    },
    dedupe: ["react", "react-dom"],
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/game/**", "src/store/**"],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 75,
        statements: 85,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/**/*.test.ts"],
          setupFiles: ["tests/setup/paraglide-test-setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          fileParallelism: false,
          include: ["tests/**/*.test.tsx"],
          setupFiles: [
            "tests/setup/paraglide-test-setup.ts",
            "tests/setup/browser-setup.ts",
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
