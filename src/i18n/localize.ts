import { m } from "@/i18n/messages";

type MessageKey = Extract<keyof typeof m, string>;

export const translate = (key: string): string =>
  (m[key as MessageKey] as () => string)();

export const hasMessageKey = (key: string): key is MessageKey => key in m;

export const localizeLore = (prefix: string) => ({
  name: translate(`${prefix}.name`),
  description: translate(`${prefix}.description`),
});
