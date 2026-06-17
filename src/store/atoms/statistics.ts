import { useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import { LOCAL_STORAGE } from "@/config/local-storage";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import type {
  MissionFactoryStatistics,
  MissionStatisticsSnapshot,
} from "@/game/types";
import { store } from "@/providers/store";
import { persistedAtomWithNormalize } from "@/store/storage";
import {
  D,
  deserializeDecimal,
  type GameValue,
  serializeDecimal,
} from "@/utils/decimal";

export type FactoryStatistics = MissionFactoryStatistics;

export type StatisticsState = MissionStatisticsSnapshot;

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

const isFactoryStatistics = (value: unknown): value is FactoryStatistics =>
  typeof value === "object" &&
  value !== null &&
  "quantity" in value &&
  typeof value.quantity === "number" &&
  "goldEarned" in value &&
  typeof value.goldEarned === "string" &&
  "goldSpent" in value &&
  typeof value.goldSpent === "string";

const normalizeStatisticsState = (value: unknown): StatisticsState => {
  const empty: StatisticsState = {
    goldEarned: serializeDecimal(D(0)),
    goldSpent: serializeDecimal(D(0)),
    factories: createInitialStatistics(),
  };

  if (typeof value !== "object" || value === null) {
    return empty;
  }

  const raw = value as Partial<StatisticsState> & {
    factories?: Record<string, FactoryStatistics>;
  };

  const factories = createInitialStatistics();
  const rawFactories = raw.factories;

  if (rawFactories && typeof rawFactories === "object") {
    for (const factory of FACTORY_TYPES) {
      const saved = rawFactories[factory];

      if (isFactoryStatistics(saved)) {
        factories[factory] = { ...saved };
      }
    }
  }

  return {
    goldEarned:
      typeof raw.goldEarned === "string" ? raw.goldEarned : empty.goldEarned,
    goldSpent:
      typeof raw.goldSpent === "string" ? raw.goldSpent : empty.goldSpent,
    factories,
  };
};

const initialStatisticsState: StatisticsState = {
  goldEarned: serializeDecimal(D(0)),
  goldSpent: serializeDecimal(D(0)),
  factories: initialStatistics,
};

export const statisticsAtom = persistedAtomWithNormalize<StatisticsState>(
  LOCAL_STORAGE.statistics,
  initialStatisticsState,
  normalizeStatisticsState
);

export const useStatistics = () => useAtomValue(statisticsAtom);

const factoryGoldEarnedAtoms = new Map<
  FactoryType,
  ReturnType<typeof selectAtom<StatisticsState, string>>
>();

const getFactoryGoldEarnedAtom = (factory: FactoryType) => {
  let factoryGoldEarnedAtom = factoryGoldEarnedAtoms.get(factory);

  if (!factoryGoldEarnedAtom) {
    factoryGoldEarnedAtom = selectAtom(
      statisticsAtom,
      (statistics) => statistics.factories[factory].goldEarned
    );
    factoryGoldEarnedAtoms.set(factory, factoryGoldEarnedAtom);
  }

  return factoryGoldEarnedAtom;
};

export const useTotalGoldEarned = (): GameValue => {
  const { goldEarned } = useStatistics();

  return deserializeDecimal(goldEarned);
};

export const useFactoryGoldEarned = (factory: FactoryType) =>
  useAtomValue(getFactoryGoldEarnedAtom(factory));

export const useGoldEarnedByFactory = (factory: FactoryType): GameValue => {
  const goldEarned = useFactoryGoldEarned(factory);

  return deserializeDecimal(goldEarned);
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
