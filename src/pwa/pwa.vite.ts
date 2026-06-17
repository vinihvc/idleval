const PWA_DESCRIPTION =
  "Step into a tiny fantasy realm. Hire strange helpers, court impossible powers, and watch your coffers grow while you are away.";

const AUDIO_CACHE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const SOUNDS_URL_PATTERN = /\/sounds\/.*\.wav$/i;
const IMAGES_URL_PATTERN = /\/images\/.*\.(webp|png)$/i;
const API_NAVIGATE_DENYLIST = /^\/api\//;

export const pwaPluginOptions = {
  includeAssets: [
    "apple-touch-icon.png",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon.ico",
    "icon-192.png",
    "icon-512.png",
  ],
  workbox: {
    globPatterns: ["**/*.{css,html,ico,js,webmanifest,woff,woff2}"],
    globIgnores: ["**/sounds/**"],
    maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
    navigateFallback: "index.html",
    navigateFallbackDenylist: [API_NAVIGATE_DENYLIST],
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: SOUNDS_URL_PATTERN,
        handler: "CacheFirst",
        options: {
          cacheName: "idleval-audio",
          expiration: {
            maxEntries: 8,
            maxAgeSeconds: AUDIO_CACHE_MAX_AGE_SECONDS,
          },
        },
      },
      {
        urlPattern: IMAGES_URL_PATTERN,
        handler: "StaleWhileRevalidate",
        options: { cacheName: "idleval-images" },
      },
    ],
  },
  manifest: {
    id: "/",
    name: "Idleval",
    short_name: "Idleval",
    description: PWA_DESCRIPTION,
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
    enabled: process.env.VITE_PWA_DEV === "true",
    suppressWarnings: true,
  },
  registerType: "autoUpdate" as const,
};
