import path from "node:path";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { paraglidePluginOptions } from "./src/i18n/paraglide.vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    paraglideVitePlugin(paraglidePluginOptions),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    VitePWA({
      includeAssets: [
        "apple-touch-icon.png",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "favicon.ico",
      ],
      workbox: {
        globPatterns: [
          "**/*.{css,html,ico,js,png,wav,webmanifest,webp,woff,woff2}",
        ],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },
      manifest: {
        id: "/",
        name: "Idleval",
        short_name: "Idleval",
        description:
          "Step into a medieval realm where you build, expand, and defend.",
        lang: "en",
        theme_color: "#2a2418",
        background_color: "#2a2418",
        display: "standalone",
        display_override: ["standalone", "browser"],
        orientation: "any",
        categories: ["games"],
        scope: ".",
        start_url: "./",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
      },
      registerType: "autoUpdate",
    }),
  ],
  base: "",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    target: "es2022",
    minify: "oxc",
    rolldownOptions: {
      treeshake: {
        annotations: true,
        manualPureFunctions: ["clsx", "cn", "tv"],
        moduleSideEffects: [{ test: /\.css$/, sideEffects: true }],
      },
      output: {
        codeSplitting: {
          groups: [
            {
              name: "vendor-react",
              test: /node_modules\/(react|react-dom|scheduler)\//,
            },
            {
              name: "vendor-ark",
              test: /node_modules\/@ark-ui\//,
            },
            {
              name: "vendor",
              test: /node_modules/,
            },
          ],
        },
      },
    },
  },
});
