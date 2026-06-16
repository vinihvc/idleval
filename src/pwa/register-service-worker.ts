import { registerSW } from "virtual:pwa-register";

const SERVICE_WORKER_UPDATE_INTERVAL_MS = 60 * 60 * 1000;

export function registerServiceWorker() {
  registerSW({
    immediate: true,
    onRegisteredSW(_url, registration) {
      if (!registration) {
        return;
      }

      const checkForUpdates = () => {
        registration.update().catch(() => undefined);
      };

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          checkForUpdates();
        }
      });

      window.setInterval(checkForUpdates, SERVICE_WORKER_UPDATE_INTERVAL_MS);
    },
  });
}
