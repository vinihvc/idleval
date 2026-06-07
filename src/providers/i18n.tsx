import { I18nProvider as LinguiProvider } from "@lingui/react";
import React from "react";
import { dynamicActivate, i18n } from "@/i18n/i18n";
import {
  type AppLocale,
  getDocumentLang,
  normalizeLocale,
} from "@/i18n/locale";
import {
  setLocale as persistLocale,
  resolveInitialLocale,
  useSettings,
} from "@/store/atoms/settings";

interface I18nContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
}

const I18nContext = React.createContext({} as I18nContextValue);

export const useLocale = (): I18nContextValue => {
  const context = React.use(I18nContext);

  if (!context) {
    throw new Error("useLocale must be used within I18nProvider");
  }

  return context;
};

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider = (props: I18nProviderProps) => {
  const { children } = props;

  const settings = useSettings();
  const [bootLocale] = React.useState(resolveInitialLocale);
  const locale = normalizeLocale(settings.locale ?? bootLocale);
  const [readyLocale, setReadyLocale] = React.useState<AppLocale>(locale);

  React.useEffect(() => {
    let cancelled = false;

    const activate = async () => {
      await dynamicActivate(locale);

      if (!cancelled) {
        document.documentElement.lang = getDocumentLang(locale);
        setReadyLocale(locale);
      }
    };

    activate().catch(() => {
      // Locale activation failed; keep previous locale active.
    });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const setLocale = React.useCallback((nextLocale: AppLocale) => {
    persistLocale(nextLocale);
  }, []);

  const value = React.useMemo(
    () => ({
      locale: readyLocale,
      setLocale,
    }),
    [readyLocale, setLocale]
  );

  return (
    <I18nContext.Provider value={value}>
      <LinguiProvider i18n={i18n}>{children}</LinguiProvider>
    </I18nContext.Provider>
  );
};
