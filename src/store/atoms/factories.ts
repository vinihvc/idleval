import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  FACTORIES,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
import { managerCost, unitCost, upgradeCost } from "@/game/economy";
import {
  getFactoryProductionValue,
  getFactoryTotalEarn,
} from "@/game/factories";
import type { FactoryPersistedState } from "@/game/types";
import { store } from "@/providers/store";
import { getGodsProductionMultiplier } from "@/store/atoms/gods";
import type { GameValue } from "@/utils/decimal";
import {
  type MscAtomProps,
  totalCanBuyByAmount,
  totalToPayByAmount,
} from "./msc";
import { touchLastSeen } from "./session";
import { decreaseGold, hasGoldToBuy, increaseGold } from "./wallet";

const INITIAL_FACTORY: FactoryType = "grain";

export const initialData = Object.fromEntries(
  FACTORY_TYPES.map((factory) => [
    factory,
    {
      amount: factory === INITIAL_FACTORY ? 1 : 0,
      isProducing: false,
      isUpgraded: false,
      isAutomated: false,
      isUnlocked: factory === INITIAL_FACTORY,
    },
  ])
) as unknown as Record<FactoryType, FactoryPersistedState>;

export const factoriesAtom = atomWithStorage("factories", initialData);

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

export const setAmountBySelectedAmount = (
  factory: FactoryType,
  amount: MscAtomProps["amountToBuy"]
) => {
  const amountToPay = totalToPayByAmount(factory, amount);
  const amountToBuy = totalCanBuyByAmount(factory, amount);

  const canBuy = hasGoldToBuy(amountToPay);

  if (!canBuy || amountToBuy <= 0) {
    return;
  }

  store.set(factoriesAtom, (prev) => ({
    ...prev,
    [factory]: {
      ...prev[factory],
      amount: prev[factory].amount + amountToBuy,
    },
  }));

  decreaseGold(amountToPay);
};

export const startProducing = (factory: FactoryType) => {
  const { isAutomated, isProducing, isUnlocked } = getFactory(factory);

  if (isProducing || isAutomated || !isUnlocked) {
    return;
  }

  store.set(factoriesAtom, (prev) => ({
    ...prev,
    [factory]: {
      ...prev[factory],
      isProducing: true,
    },
  }));
};

export const stopProducing = (factory: FactoryType) => {
  const { isAutomated } = getFactory(factory);

  store.set(factoriesAtom, (prev) => ({
    ...prev,
    [factory]: {
      ...prev[factory],
      isProducing: false,
    },
  }));

  increaseGold(factory);

  if (isAutomated) {
    touchLastSeen();
  }
};

export const autoFactory = (factory: FactoryType) => {
  const { isUnlocked, managerCost: cost } = getFactory(factory);

  const canAutomate = hasGoldToBuy(cost);

  if (!(isUnlocked && canAutomate)) {
    return;
  }

  store.set(factoriesAtom, (prev) => ({
    ...prev,
    [factory]: {
      ...prev[factory],
      isAutomated: true,
    },
  }));

  decreaseGold(cost);
};

export const upgradeFactory = (factory: FactoryType) => {
  const { isUnlocked, upgradeCost: cost } = getFactory(factory);

  const canUpgrade = hasGoldToBuy(cost);

  if (!(isUnlocked && canUpgrade)) {
    return;
  }

  store.set(factoriesAtom, (prev) => ({
    ...prev,
    [factory]: {
      ...prev[factory],
      isUpgraded: true,
    },
  }));

  decreaseGold(cost);
};

export const unlockFactory = (factory: FactoryType) => {
  const { unlockPrice } = getFactory(factory);

  const canUnlock = hasGoldToBuy(unlockPrice);

  if (!canUnlock) {
    return;
  }

  store.set(factoriesAtom, (prev) => ({
    ...prev,
    [factory]: {
      ...prev[factory],
      isUnlocked: true,
      amount: 1,
    },
  }));

  decreaseGold(unlockPrice);
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

  return getFactoryTotalEarn({
    amount,
    godsProductionMultiplier: getGodsProductionMultiplier(),
    isUpgraded,
    productionValue,
  });
};
