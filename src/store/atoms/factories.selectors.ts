import { useAtomValue } from "jotai";
import { FACTORIES, type FactoryType } from "@/content/factories";
import { managerCost, unitCost, upgradeCost } from "@/game/economy";
import {
  getFactoryEarnPerCycle,
  getFactoryProductionValue,
} from "@/game/factories";
import { store } from "@/providers/store";
import type { GameValue } from "@/utils/decimal";
import { factoriesAtom } from "./factories.atom";
import {
  getGodsProductionMultiplier,
  useGodsProductionMultiplier,
} from "./gods";

const getFactoryConfig = (factory: FactoryType) => {
  const state = store.get(factoriesAtom)[factory];

  return {
    ...state,
    ...FACTORIES[factory],
  };
};

export const useFactory = (factory: FactoryType) => {
  const factories = useAtomValue(factoriesAtom);
  const state = factories[factory];
  const config = FACTORIES[factory];

  return {
    ...state,
    ...config,
    managerCost: managerCost(config.baseBuyCost, state.amount),
    upgradeCost: upgradeCost(config.baseBuyCost, state.amount),
    nextUnitCost: unitCost(config.baseBuyCost, state.amount),
  };
};

export const getFactory = (factory: FactoryType) => {
  const config = getFactoryConfig(factory);

  return {
    ...config,
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
