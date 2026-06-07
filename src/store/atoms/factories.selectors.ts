import { useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import { FACTORY_DATA } from "@/content/factories.data";
import type { FactoryType } from "@/content/factories.types";
import { applyDifficultyCost } from "@/game/difficulty";
import { managerCost, unitCost, upgradeCost } from "@/game/economy";
import {
  getFactoryEarnPerCycle,
  getFactoryProductionValue,
} from "@/game/factories";
import type { FactoryPersistedState } from "@/game/types";
import { useLocalizedFactory } from "@/hooks/use-localized-factory";
import { store } from "@/providers/store";
import { getDifficultyLevel } from "@/store/atoms/settings";
import type { GameValue } from "@/utils/decimal";
import { factoriesAtom } from "./factories.atom";
import {
  getGodsProductionMultiplier,
  useGodsProductionMultiplier,
} from "./gods";

const factoryStateAtoms = new Map<
  FactoryType,
  ReturnType<
    typeof selectAtom<
      Record<FactoryType, FactoryPersistedState>,
      FactoryPersistedState
    >
  >
>();

const getFactoryStateAtom = (factory: FactoryType) => {
  let factoryStateAtom = factoryStateAtoms.get(factory);

  if (!factoryStateAtom) {
    factoryStateAtom = selectAtom(
      factoriesAtom,
      (factories) => factories[factory]
    );
    factoryStateAtoms.set(factory, factoryStateAtom);
  }

  return factoryStateAtom;
};

const getFactoryConfig = (factory: FactoryType) => {
  const state = store.get(factoriesAtom)[factory];

  return {
    ...state,
    ...FACTORY_DATA[factory],
  };
};

const getScaledUnlockPrice = (unlockPrice: number): GameValue =>
  applyDifficultyCost(unlockPrice, getDifficultyLevel());

export const useFactory = (factory: FactoryType) => {
  const state = useAtomValue(getFactoryStateAtom(factory));
  const config = FACTORY_DATA[factory];
  const localized = useLocalizedFactory(factory);

  return {
    ...state,
    ...config,
    ...localized,
    unlockPrice: getScaledUnlockPrice(config.unlockPrice),
    managerCost: managerCost(config.baseBuyCost, state.amount),
    upgradeCost: upgradeCost(config.baseBuyCost, state.amount),
    nextUnitCost: unitCost(config.baseBuyCost, state.amount),
  };
};

export const getFactory = (factory: FactoryType) => {
  const config = getFactoryConfig(factory);

  return {
    ...config,
    unlockPrice: getScaledUnlockPrice(FACTORY_DATA[factory].unlockPrice),
    managerCost: managerCost(config.baseBuyCost, config.amount),
    upgradeCost: upgradeCost(config.baseBuyCost, config.amount),
    nextUnitCost: unitCost(config.baseBuyCost, config.amount),
  };
};

export const getProductionValue = (factory: FactoryType): GameValue => {
  const { productionValue, isUpgraded } = getFactory(factory);

  return getFactoryProductionValue({
    godsProductionMultiplier: getGodsProductionMultiplier(),
    isUpgraded,
    productionValue,
  });
};

export const totalToEarnAfterProduce = (factory: FactoryType): GameValue => {
  const { amount, isUpgraded, productionValue } = getFactory(factory);

  return getFactoryEarnPerCycle({
    amount,
    godsProductionMultiplier: getGodsProductionMultiplier(),
    isUpgraded,
    productionValue,
  });
};

export const useProductionValue = (factory: FactoryType): GameValue => {
  const { productionValue, isUpgraded } = useFactory(factory);
  const godsProductionMultiplier = useGodsProductionMultiplier();

  return getFactoryProductionValue({
    godsProductionMultiplier,
    isUpgraded,
    productionValue,
  });
};

export const useTotalToEarnAfterProduce = (factory: FactoryType): GameValue => {
  const { amount, isUpgraded, productionValue } = useFactory(factory);
  const godsProductionMultiplier = useGodsProductionMultiplier();

  return getFactoryEarnPerCycle({
    amount,
    godsProductionMultiplier,
    isUpgraded,
    productionValue,
  });
};
