export const SUPPORTED_LOCALES = ["en", "es", "pt"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

const isAppLocale = (value: string): value is AppLocale =>
  SUPPORTED_LOCALES.includes(value as AppLocale);

export const normalizeLocale = (value: unknown): AppLocale => {
  if (typeof value !== "string") {
    return DEFAULT_LOCALE;
  }

  if (isAppLocale(value)) {
    return value;
  }

  const lower = value.toLowerCase();

  if (lower.startsWith("pt")) {
    return "pt";
  }

  if (lower.startsWith("es")) {
    return "es";
  }

  if (lower.startsWith("en")) {
    return "en";
  }

  return DEFAULT_LOCALE;
};

export const detectBrowserLocale = (): AppLocale => {
  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE;
  }

  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate);

    if (
      normalized !== DEFAULT_LOCALE ||
      candidate.toLowerCase().startsWith("en")
    ) {
      return normalized;
    }
  }

  return DEFAULT_LOCALE;
};

export const getDocumentLang = (locale: AppLocale): string => locale;
