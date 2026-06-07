import { i18n as linguiCore } from "@lingui/core";
import type { AppLocale } from "@/i18n/locale";
import { messages as enMessages } from "../../locales/en/messages.ts";

export const i18n = linguiCore;

const localeLoaders: Record<
  AppLocale,
  () => Promise<{ messages: Record<string, string> }>
> = {
  en: () => import("../../locales/en/messages.po?lingui"),
  "es-MX": () => import("../../locales/es-MX/messages.po?lingui"),
  "pt-BR": () => import("../../locales/pt-BR/messages.po?lingui"),
};

i18n.loadAndActivate({ locale: "en", messages: enMessages });

if (import.meta.env.DEV) {
  i18n.on("missing", (event) => {
    console.warn(
      `[i18n] Missing translation: ${event.id} (${event.locale})`
    );
  });
}

export const dynamicActivate = async (locale: AppLocale) => {
  if (locale === "en") {
    i18n.loadAndActivate({ locale, messages: enMessages });
    return;
  }

  const { messages } = await localeLoaders[locale]();
  i18n.loadAndActivate({ locale, messages });
};

