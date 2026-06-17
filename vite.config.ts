import { paraglideVitePlugin } from "@inlang/paraglide-js";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";
import { paraglidePluginOptions } from "./src/i18n/paraglide.vite";
import { pwaPluginOptions } from "./src/pwa/pwa.vite";
import { srcAlias } from "./vite.shared";

const VENDOR_REACT_PATTERN = /node_modules\/(react|react-dom|scheduler)\//;
const VENDOR_ARK_PATTERN = /node_modules\/@ark-ui\//;
const VENDOR_PATTERN = /node_modules/;
const CSS_SIDE_EFFECTS_PATTERN = /\.css$/;

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    paraglideVitePlugin(paraglidePluginOptions),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
    VitePWA(pwaPluginOptions as Partial<VitePWAOptions>),
  ],
  base: "",
  resolve: {
    alias: srcAlias,
    dedupe: ["react", "react-dom"],
  },
  build: {
    target: "es2022",
    minify: "oxc" as const,
    rolldownOptions: {
      treeshake: {
        annotations: true,
        manualPureFunctions: ["clsx", "cn", "tv", "twMerge"],
        moduleSideEffects: [
          { test: CSS_SIDE_EFFECTS_PATTERN, sideEffects: true },
        ],
      },
      output: {
        codeSplitting: {
          groups: [
            {
              name: "vendor-react",
              test: VENDOR_REACT_PATTERN,
            },
            {
              name: "vendor-ark",
              test: VENDOR_ARK_PATTERN,
            },
            {
              name: "vendor",
              test: VENDOR_PATTERN,
            },
          ],
        },
      },
    },
  },
}));
