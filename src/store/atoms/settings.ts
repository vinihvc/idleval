import { useAtomValue } from "jotai";
import { LOCAL_STORAGE } from "@/config/local-storage";
import {
  type AppLocale,
  detectBrowserLocale,
  normalizeLocale,
} from "@/i18n/locale";
import { store } from "@/providers/store";
import { persistedAtomWithNormalize } from "@/store/storage";

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export interface Settings {
  locale?: AppLocale;
  musicVolume: number;
  sfxVolume: number;
}

const defaultSettings = (): Settings => ({
  musicVolume: 0.8,
  sfxVolume: 0.8,
});

export const normalizeSettings = (value: unknown): Settings => {
  if (typeof value !== "object" || value === null) {
    return defaultSettings();
  }

  const raw = value as Record<string, unknown>;
  const locale =
    typeof raw.locale === "string"
      ? normalizeLocale(raw.locale as AppLocale)
      : undefined;

  return {
    locale,
    musicVolume:
      typeof raw.musicVolume === "number"
        ? clampVolume(raw.musicVolume)
        : defaultSettings().musicVolume,
    sfxVolume:
      typeof raw.sfxVolume === "number"
        ? clampVolume(raw.sfxVolume)
        : defaultSettings().sfxVolume,
  };
};

export const settingsAtom = persistedAtomWithNormalize<Settings>(
  LOCAL_STORAGE.settings,
  defaultSettings(),
  normalizeSettings
);

export const getSettings = (): Settings => {
  const settings = store.get(settingsAtom);

  return {
    ...settings,
    locale: settings.locale ? normalizeLocale(settings.locale) : undefined,
  };
};

export const getLocale = (): AppLocale | undefined => {
  const locale = store.get(settingsAtom).locale;

  return locale ? normalizeLocale(locale) : undefined;
};

export const resolveInitialLocale = (): AppLocale => {
  const persisted = getLocale();

  if (persisted) {
    return persisted;
  }

  const detected = detectBrowserLocale();
  store.set(settingsAtom, (prev) => ({
    ...prev,
    locale: detected,
  }));

  return detected;
};

export const useSettings = () => useAtomValue(settingsAtom);

export const setLocale = (locale: AppLocale) =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    locale: normalizeLocale(locale),
  }));

export const setMusicVolume = (value: number) =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    musicVolume: clampVolume(value),
  }));

export const setSfxVolume = (value: number) =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    sfxVolume: clampVolume(value),
  }));
