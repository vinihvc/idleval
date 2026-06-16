import {
  type AppLocale,
  detectBrowserLocale,
  normalizeLocale,
} from "@/i18n/locale";
import {
  defineCustomClientStrategy,
  getLocale as getParaglideLocale,
  setLocale as setParaglideLocale,
} from "@/i18n/paraglide/runtime.js";
import { store } from "@/providers/store";
import { settingsAtom } from "@/store/atoms/settings";

const readSettingsLocale = (): AppLocale => {
  const persisted = store.get(settingsAtom).locale;

  if (persisted) {
    return normalizeLocale(persisted);
  }

  return detectBrowserLocale();
};

defineCustomClientStrategy("custom-settings", {
  getLocale: () => readSettingsLocale(),
  setLocale: (locale: string) => {
    const normalized = normalizeLocale(locale);
    store.set(settingsAtom, (prev) => ({
      ...prev,
      locale: normalized,
    }));
  },
});

export const syncParaglideLocale = (locale: AppLocale) => {
  const normalized = normalizeLocale(locale);

  if (getParaglideLocale() === normalized) {
    return;
  }

  setParaglideLocale(normalized, { reload: false });
};

export { getLocale as getParaglideLocale } from "@/i18n/paraglide/runtime.js";
