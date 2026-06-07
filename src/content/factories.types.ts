export const FACTORY_TYPES = [
  "grain",
  "mill",
  "iron",
  "crossbow",
  "longship",
  "reliquary",
] as const;

export type FactoryType = (typeof FACTORY_TYPES)[number];
