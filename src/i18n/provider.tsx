import React from "react";
import {
  type AppLocale,
  getDocumentLang,
  normalizeLocale,
} from "@/i18n/locale";
import { syncParaglideLocale } from "@/i18n/paraglide-init";
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

export const I18nProvider = (props: React.PropsWithChildren) => {
  const { children } = props;

  const settings = useSettings();
  const [bootLocale] = React.useState(resolveInitialLocale);
  const locale = normalizeLocale(settings.locale ?? bootLocale);

  React.useEffect(() => {
    syncParaglideLocale(locale);
    document.documentElement.lang = getDocumentLang(locale);
  }, [locale]);

  const setLocale = React.useCallback((nextLocale: AppLocale) => {
    const normalized = normalizeLocale(nextLocale);
    persistLocale(normalized);
    syncParaglideLocale(normalized);
    document.documentElement.lang = getDocumentLang(normalized);
  }, []);

  const value = React.useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale, setLocale]
  );

  return (
    <I18nContext.Provider value={value}>
      <React.Fragment key={locale}>{children}</React.Fragment>
    </I18nContext.Provider>
  );
};
