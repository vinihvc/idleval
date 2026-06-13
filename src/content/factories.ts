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
    baseBuyCost: 1125,
    unlockPrice: 55_000,
  },
  iron: {
    productionTime: 10,
    productionValue: 1280,
    baseBuyCost: 16_875,
    unlockPrice: 825_000,
  },
  crossbow: {
    productionTime: 20,
    productionValue: 10_240,
    baseBuyCost: 253_125,
    unlockPrice: 12_500_000,
  },
  longship: {
    productionTime: 40,
    productionValue: 81_920,
    baseBuyCost: 3_796_875,
    unlockPrice: 187_500_000,
  },
  reliquary: {
    productionTime: 80,
    productionValue: 655_360,
    baseBuyCost: 56_953_125,
    unlockPrice: 2_812_500_000,
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
