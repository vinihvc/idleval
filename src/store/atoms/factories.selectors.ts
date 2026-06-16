import { useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import { useMemo } from "react";
import { FACTORY_DATA, type FactoryType } from "@/content/factories";
import { managerCost, unitCost, upgradeCost } from "@/game/economy";
import {
  canPurchaseAnyManager as canPurchaseAnyManagerGame,
  canPurchaseAnyUpgrade as canPurchaseAnyUpgradeGame,
  getFactoryEarnPerCycle,
  getFactoryProductionValue,
} from "@/game/factories";
import type { FactoryPersistedState } from "@/game/types";
import { useLocalizedFactory } from "@/i18n/hooks/use-localized-factory";
import { store } from "@/providers/store";
import { getPowerUpIncomeMultiplierForEarn } from "@/store/atoms/inventory";
import { D, type GameValue } from "@/utils/decimal";
import { factoriesAtom, useFactories } from "./factories.atom";
import { useGodsProductionMultiplier } from "./gods";
import { getGold, useWallet } from "./wallet";

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

export const useFactoryState = (factory: FactoryType) =>
  useAtomValue(getFactoryStateAtom(factory));

export const useFactory = (factory: FactoryType) => {
  const state = useFactoryState(factory);
  const config = FACTORY_DATA[factory];
  const localized = useLocalizedFactory(factory);

  return {
    ...state,
    ...config,
    ...localized,
    unlockPrice: D(config.unlockPrice),
    managerCost: managerCost(config.baseBuyCost, state.amount),
    upgradeCost: upgradeCost(config.baseBuyCost, state.amount),
    nextUnitCost: unitCost(config.baseBuyCost, state.amount),
  };
};

export const getFactory = (factory: FactoryType) => {
  const config = getFactoryConfig(factory);

  return {
    ...config,
    unlockPrice: D(FACTORY_DATA[factory].unlockPrice),
    managerCost: managerCost(config.baseBuyCost, config.amount),
    upgradeCost: upgradeCost(config.baseBuyCost, config.amount),
    nextUnitCost: unitCost(config.baseBuyCost, config.amount),
  };
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
  }).times(getPowerUpIncomeMultiplierForEarn());
};

export const canPurchaseAnyUpgrade = (): boolean =>
  canPurchaseAnyUpgradeGame(store.get(factoriesAtom), getGold());

export const canPurchaseAnyManager = (): boolean =>
  canPurchaseAnyManagerGame(store.get(factoriesAtom), getGold());

export const useCanPurchaseAnyUpgrade = (): boolean => {
  const { gold } = useWallet();
  const factories = useFactories();

  return useMemo(
    () => canPurchaseAnyUpgradeGame(factories, gold),
    [factories, gold]
  );
};

export const useCanPurchaseAnyManager = (): boolean => {
  const { gold } = useWallet();
  const factories = useFactories();

  return useMemo(
    () => canPurchaseAnyManagerGame(factories, gold),
    [factories, gold]
  );
};
