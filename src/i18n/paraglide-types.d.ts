declare module "@/i18n/paraglide/messages.js" {
  type MessageFunction = (inputs?: unknown) => string;

  export const m: Record<string, MessageFunction>;
}

declare module "@/i18n/paraglide/runtime.js" {
  export type Locale = "en" | "es" | "pt";

  export const baseLocale: Locale;
  export const locales: readonly Locale[];

  export const defineCustomClientStrategy: (
    strategy: `custom-${string}`,
    handler: {
      getLocale: () => Locale;
      setLocale: (locale: string) => void;
    }
  ) => void;

  export const getLocale: () => Locale;
  export const overwriteGetLocale: (fn: () => Locale) => void;
  export const setLocale: (
    locale: Locale,
    options?: { reload?: boolean }
  ) => void;
}
