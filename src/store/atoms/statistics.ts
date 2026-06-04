import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { FACTORIES, type FactoryType } from "@/content/factories";
import { store } from "..";
import { getFactory, getProductionValue } from "./factories";

const initialStatistics = Object.fromEntries(
  Object.keys(FACTORIES).map((factory) => [
    factory,
    { quantity: 0, moneySpent: 0, moneyEarned: 0 },
  ])
);

export const statisticsAtom = atomWithStorage("statistics", {
  moneyEarned: 0,
  moneySpent: 0,
  factories: initialStatistics,
});

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
    moneyEarned: prev.moneyEarned + amount * productionValue,
    factories: {
      ...prev.factories,
      [factory]: {
        ...prev.factories[factory],
        moneyEarned:
          prev.factories[factory].moneyEarned + amount * productionValue,
      },
    },
  }));
};

/**
 * Get the total money earned
 *
 * @returns The total money earned
 */
export const totalMoneyEarned = () => {
  const { moneyEarned } = store.get(statisticsAtom);

  return moneyEarned;
};

/**
 * Get the total money spent
 *
 * @returns The total money spent
 */
export const moneyEarnedByFactory = (factory: FactoryType) => {
  const { factories } = store.get(statisticsAtom);

  return factories[factory].moneyEarned;
};
