import {
  FACTORY_DATA,
  type FactoryType,
  getLocalizedFactory,
  type LocalizedFactory,
} from "@/content/factories";
import { useLocale } from "@/i18n/provider";

export const useLocalizedFactory = (factory: FactoryType): LocalizedFactory => {
  useLocale();

  return getLocalizedFactory(factory);
};

export const useLocalizedFactoryName = (factory: FactoryType): string => {
  useLocale();

  return getLocalizedFactory(factory).name;
};

export const getFactoryData = (factory: FactoryType) => FACTORY_DATA[factory];

export type { LocalizedFactory, LocalizedLore } from "@/content/factories";
