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

interface FactoryStatistics {
  goldEarned: string;
  goldSpent: string;
  quantity: number;
}

export interface StatisticsState {
  factories: Record<FactoryType, FactoryStatistics>;
  goldEarned: string;
  goldSpent: string;
}

export const createInitialStatistics = (): Record<
  FactoryType,
  FactoryStatistics
> =>
  Object.fromEntries(
    FACTORY_TYPES.map((factory) => [
      factory,
      {
        quantity: 0,
        goldSpent: serializeDecimal(D(0)),
        goldEarned: serializeDecimal(D(0)),
      },
    ])
  ) as Record<FactoryType, FactoryStatistics>;

export const initialStatistics = createInitialStatistics();

export const statisticsAtom = atomWithStorage("statistics", {
  goldEarned: serializeDecimal(D(0)),
  goldSpent: serializeDecimal(D(0)),
  factories: initialStatistics,
} satisfies StatisticsState);

export const useStatistics = () => useAtomValue(statisticsAtom);

export const useTotalGoldEarned = (): GameValue => {
  const { goldEarned } = useStatistics();

  return deserializeDecimal(goldEarned);
};

export const useGoldEarnedByFactory = (factory: FactoryType): GameValue => {
  const { factories } = useStatistics();

  return deserializeDecimal(factories[factory].goldEarned);
};

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

export const recordGoldSpent = (
  factory: FactoryType,
  amount: GameValue
): void => {
  if (amount.lte(0)) {
    return;
  }

  store.set(statisticsAtom, (prev) => ({
    ...prev,
    goldSpent: serializeDecimal(
      deserializeDecimal(prev.goldSpent).plus(amount)
    ),
    factories: {
      ...prev.factories,
      [factory]: {
        ...prev.factories[factory],
        goldSpent: serializeDecimal(
          deserializeDecimal(prev.factories[factory].goldSpent).plus(amount)
        ),
      },
    },
  }));
};

export const recordQuantity = (
  factory: FactoryType,
  quantity: number
): void => {
  if (quantity <= 0) {
    return;
  }

  store.set(statisticsAtom, (prev) => ({
    ...prev,
    factories: {
      ...prev.factories,
      [factory]: {
        ...prev.factories[factory],
        quantity: prev.factories[factory].quantity + quantity,
      },
    },
  }));
};
