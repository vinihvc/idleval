import { localizeLore, translate } from "@/i18n/localize";

export const FACTORY_DATA = {
  grain: {
    productionTime: 2,
    productionValue: 20,
    baseBuyCost: 75,
    unlockPrice: 0,
  },
  wine: {
    productionTime: 5,
    productionValue: 160,
    baseBuyCost: 600,
    unlockPrice: 30_000,
  },
  iron: {
    productionTime: 10,
    productionValue: 1280,
    baseBuyCost: 5000,
    unlockPrice: 300_000,
  },
  crossbow: {
    productionTime: 20,
    productionValue: 10_240,
    baseBuyCost: 40_000,
    unlockPrice: 2_000_000,
  },
  longship: {
    productionTime: 40,
    productionValue: 81_920,
    baseBuyCost: 400_000,
    unlockPrice: 25_000_000,
  },
  reliquary: {
    productionTime: 80,
    productionValue: 655_360,
    baseBuyCost: 4_100_000,
    unlockPrice: 250_000_000,
  },
} as const;

export type FactoryDataType = typeof FACTORY_DATA;

export type FactoryType = keyof typeof FACTORY_DATA;

export const FACTORY_TYPES = Object.keys(FACTORY_DATA) as FactoryType[];

export const getLocalizedFactory = (factory: FactoryType) => {
  const prefix = `factory.${factory}`;

  return {
    name: translate(`${prefix}.name`),
    description: translate(`${prefix}.description`),
    upgrade: localizeLore(`${prefix}.upgrade`),
    manager: localizeLore(`${prefix}.manager`),
  };
};

export type LocalizedLore = ReturnType<typeof localizeLore>;
export type LocalizedFactory = ReturnType<typeof getLocalizedFactory>;
