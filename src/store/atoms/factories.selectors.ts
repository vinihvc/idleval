import { useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import React from "react";
import { FACTORY_DATA, type FactoryType } from "@/content/factories";
import { getScaledFactoryConfig } from "@/game/balance";
import { managerCost, unitCost, upgradeCost } from "@/game/economy";
import {
  canPurchaseAnyManager as canPurchaseAnyManagerGame,
  canPurchaseAnyUpgrade as canPurchaseAnyUpgradeGame,
  getFactoryProductionValue,
  getFactoryUnlockPrice,
} from "@/game/factories";
import type { FactoryPersistedState } from "@/game/types";
import { store } from "@/providers/store";
import { getTotalEarnPerCycle } from "@/store/atoms/factory-earn";
import { getFactoryProgressDifficulty } from "@/store/atoms/progress-ease";
import type { GameValue } from "@/utils/decimal";
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
    ...getScaledFactoryConfig(factory),
  };
};

export const useFactoryState = (factory: FactoryType) =>
  useAtomValue(getFactoryStateAtom(factory));

export const useFactory = (factory: FactoryType) => {
  const state = useFactoryState(factory);
  const raw = FACTORY_DATA[factory];
  const scaled = getScaledFactoryConfig(factory);
  const factoryDifficulty = getFactoryProgressDifficulty();

  return {
    ...state,
    ...scaled,
    unlockPrice: getFactoryUnlockPrice(raw.unlockPrice, factoryDifficulty),
    managerCost: managerCost(raw.baseBuyCost, state.amount, factoryDifficulty),
    upgradeCost: upgradeCost(raw.baseBuyCost, state.amount, factoryDifficulty),
    nextUnitCost: unitCost(raw.baseBuyCost, state.amount, factoryDifficulty),
  };
};

export const getFactory = (factory: FactoryType) => {
  const config = getFactoryConfig(factory);
  const raw = FACTORY_DATA[factory];
  const factoryDifficulty = getFactoryProgressDifficulty();

  return {
    ...config,
    unlockPrice: getFactoryUnlockPrice(raw.unlockPrice, factoryDifficulty),
    managerCost: managerCost(raw.baseBuyCost, config.amount, factoryDifficulty),
    upgradeCost: upgradeCost(raw.baseBuyCost, config.amount, factoryDifficulty),
    nextUnitCost: unitCost(raw.baseBuyCost, config.amount, factoryDifficulty),
  };
};

export const useProductionValue = (factory: FactoryType): GameValue => {
  const { isUpgraded } = useFactoryState(factory);
  const godsProductionMultiplier = useGodsProductionMultiplier();

  return getFactoryProductionValue({
    factoryDifficulty: getFactoryProgressDifficulty(),
    godsProductionMultiplier,
    isUpgraded,
    productionValue: FACTORY_DATA[factory].productionValue,
  });
};

export const useTotalToEarnAfterProduce = (factory: FactoryType): GameValue => {
  const { amount, isUpgraded } = useFactoryState(factory);
  const godsProductionMultiplier = useGodsProductionMultiplier();

  return getTotalEarnPerCycle(factory, {
    amount,
    isUpgraded,
    godsProductionMultiplier,
  });
};

export const canPurchaseAnyUpgrade = (): boolean =>
  canPurchaseAnyUpgradeGame(
    store.get(factoriesAtom),
    getGold(),
    getFactoryProgressDifficulty()
  );

export const canPurchaseAnyManager = (): boolean =>
  canPurchaseAnyManagerGame(
    store.get(factoriesAtom),
    getGold(),
    getFactoryProgressDifficulty()
  );

export const useCanPurchaseAnyUpgrade = (): boolean => {
  const { gold } = useWallet();
  const factories = useFactories();

  return React.useMemo(
    () =>
      canPurchaseAnyUpgradeGame(
        factories,
        gold,
        getFactoryProgressDifficulty()
      ),
    [factories, gold]
  );
};

export const useCanPurchaseAnyManager = (): boolean => {
  const { gold } = useWallet();
  const factories = useFactories();

  return React.useMemo(
    () =>
      canPurchaseAnyManagerGame(
        factories,
        gold,
        getFactoryProgressDifficulty()
      ),
    [factories, gold]
  );
};
