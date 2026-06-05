import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import { store } from "@/providers/store";
import {
  D,
  deserializeDecimal,
  type GameValue,
  serializeDecimal,
} from "@/utils/decimal";

const initialStatistics = Object.fromEntries(
  FACTORY_TYPES.map((factory) => [
    factory,
    {
      quantity: 0,
      goldSpent: serializeDecimal(D(0)),
      goldEarned: serializeDecimal(D(0)),
    },
  ])
);

interface FactoryStatistics {
  goldEarned: string;
  goldSpent: string;
  quantity: number;
}

interface StatisticsState {
  factories: Record<string, FactoryStatistics>;
  goldEarned: string;
  goldSpent: string;
}

export const statisticsAtom = atomWithStorage("statistics", {
  goldEarned: serializeDecimal(D(0)),
  goldSpent: serializeDecimal(D(0)),
  factories: initialStatistics,
} satisfies StatisticsState);

export const useStatistics = () => useAtomValue(statisticsAtom);

export const setStatistics = (factory: FactoryType, goldEarned: GameValue) => {
  store.set(statisticsAtom, (prev) => ({
    ...prev,
    goldEarned: serializeDecimal(
      deserializeDecimal(prev.goldEarned).plus(goldEarned)
    ),
    factories: {
      ...prev.factories,
      [factory]: {
        ...prev.factories[factory],
        goldEarned: serializeDecimal(
          deserializeDecimal(prev.factories[factory].goldEarned).plus(
            goldEarned
          )
        ),
      },
    },
  }));
};

export const totalGoldEarned = (): GameValue =>
  deserializeDecimal(store.get(statisticsAtom).goldEarned);

export const goldEarnedByFactory = (factory: FactoryType): GameValue =>
  deserializeDecimal(store.get(statisticsAtom).factories[factory].goldEarned);
