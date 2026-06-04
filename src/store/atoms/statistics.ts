import { useAtomValue } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { FACTORIES, type FactoryType } from "@/content/factories";
import { store } from "@/store/store";
import { getFactory, getProductionValue } from "./factories";

const initialStatistics = Object.fromEntries(
  Object.keys(FACTORIES).map((factory) => [
    factory,
    { quantity: 0, goldSpent: 0, goldEarned: 0 },
  ])
);

interface FactoryStatistics {
  goldEarned: number;
  goldSpent: number;
  quantity: number;
}

interface StatisticsState {
  factories: Record<string, FactoryStatistics>;
  goldEarned: number;
  goldSpent: number;
}

const readLegacyNumber = (primary: unknown, legacy: unknown): number => {
  if (typeof primary === "number") {
    return primary;
  }

  if (typeof legacy === "number") {
    return legacy;
  }

  return 0;
};

const migrateFactoryStats = (
  factory: Record<string, unknown>
): FactoryStatistics => ({
  quantity: typeof factory.quantity === "number" ? factory.quantity : 0,
  goldSpent: readLegacyNumber(factory.goldSpent, factory.moneySpent),
  goldEarned: readLegacyNumber(factory.goldEarned, factory.moneyEarned),
});

const migrateStatistics = (
  parsed: Record<string, unknown>
): StatisticsState => {
  const factoriesRaw =
    parsed.factories && typeof parsed.factories === "object"
      ? (parsed.factories as Record<string, Record<string, unknown>>)
      : {};

  const factories = Object.fromEntries(
    Object.keys(FACTORIES).map((factory) => [
      factory,
      migrateFactoryStats(factoriesRaw[factory] ?? {}),
    ])
  );

  return {
    goldEarned: readLegacyNumber(parsed.goldEarned, parsed.moneyEarned),
    goldSpent: readLegacyNumber(parsed.goldSpent, parsed.moneySpent),
    factories,
  };
};

const statisticsStorage = createJSONStorage<StatisticsState>(
  () => localStorage,
  {
    reviver: (key, value) => {
      if (key === "" && value && typeof value === "object") {
        return migrateStatistics(value as Record<string, unknown>);
      }

      return value;
    },
  }
);

export const statisticsAtom = atomWithStorage(
  "statistics",
  {
    goldEarned: 0,
    goldSpent: 0,
    factories: initialStatistics,
  },
  statisticsStorage
);

export const useStatistics = () => useAtomValue(statisticsAtom);

/**
 * Set the statistics for a factory
 *
 * @param factory - The factory to set the statistics for
 */
export const setStatistics = (factory: FactoryType) => {
  const { amount } = getFactory(factory);
  const productionValue = getProductionValue(factory);

  store.set(statisticsAtom, (prev) => ({
    ...prev,
    goldEarned: prev.goldEarned + amount * productionValue,
    factories: {
      ...prev.factories,
      [factory]: {
        ...prev.factories[factory],
        goldEarned:
          prev.factories[factory].goldEarned + amount * productionValue,
      },
    },
  }));
};

/**
 * Get the total gold earned
 *
 * @returns The total gold earned
 */
export const totalGoldEarned = () => {
  const { goldEarned } = store.get(statisticsAtom);

  return goldEarned;
};

/**
 * Get the total gold spent
 *
 * @returns The total gold spent
 */
export const goldEarnedByFactory = (factory: FactoryType) => {
  const { factories } = store.get(statisticsAtom);

  return factories[factory].goldEarned;
};
