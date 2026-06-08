import { m } from "@/i18n/messages";

type MessageKey = keyof typeof m;

export const translate = (key: string): string =>
  (m[key as MessageKey] as () => string)();

export const hasMessageKey = (key: string): key is MessageKey => key in m;

export const localizeLore = (prefix: string) => ({
  name: translate(`${prefix}.name`),
  description: translate(`${prefix}.description`),
});
