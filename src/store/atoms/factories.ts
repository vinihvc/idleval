import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { FACTORIES, type FactoryType } from "@/content/factories";
import { store } from "@/store/store";
import {
  type MscAtomProps,
  totalCanBuyByAmount,
  totalToPayByAmount,
} from "./msc";
import { decreaseGold, hasGoldToBuy, increaseGold } from "./wallet";

const INITIAL_FACTORY = "potato";

export const initialData = Object.fromEntries(
  Object.keys(FACTORIES).map((factory) => [
    factory,
    {
      amount: factory === INITIAL_FACTORY ? 1 : 0,
      isProducing: false,
      isUpgraded: false,
      isAutomated: false,
      isUnlocked: factory === INITIAL_FACTORY,
    },
  ])
);

export const factoriesAtom = atomWithStorage("factories", initialData);

export const useFactory = (factory: FactoryType) => {
  const factories = useAtomValue(factoriesAtom);

  return {
    ...factories[factory],
    ...FACTORIES[factory as FactoryType],
  };
};

/**
 * Get a factory from the store
 *
 * @param factory - The factory to get
 * @returns The factory
 */
export const getFactory = (factory: FactoryType) => ({
  ...store.get(factoriesAtom)[factory],
  ...FACTORIES[factory as FactoryType],
});

/**
 * Set the amount of a factory
 *
 * @param factory - The factory to set the amount of
 */
export const setAmountBySelectedAmount = (
  factory: FactoryType,
  amount: MscAtomProps["amountToBuy"]
) => {
  const amountToPay = totalToPayByAmount(factory, amount);
  const amountToBuy = totalCanBuyByAmount(factory, amount);

  const canBuy = hasGoldToBuy(amountToPay);

  if (!canBuy) {
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

/**
 * Start producing a factory
 *
 * @param factory - The factory to start producing
 */
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

/**
 * Stop producing a factory
 *
 * @param factory - The factory to stop producing
 */
export const stopProducing = (factory: FactoryType) => {
  store.set(factoriesAtom, (prev) => ({
    ...prev,
    [factory]: {
      ...prev[factory],
      isProducing: false,
    },
  }));

  increaseGold(factory);
};

/**
 * Enable automation for a factory
 *
 * @param factory - The factory to enable automation for
 */
export const autoFactory = (factory: FactoryType) => {
  const { isUnlocked, automatedCost } = getFactory(factory);

  const canAutomate = hasGoldToBuy(automatedCost);

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

  decreaseGold(automatedCost);
};

/**
 * Upgrade a factory, generating more gold per second
 *
 * @param factory - The factory to upgrade
 */
export const upgradeFactory = (factory: FactoryType) => {
  const { isUnlocked, upgradeCost } = getFactory(factory);

  const canUpgrade = hasGoldToBuy(upgradeCost);

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

  decreaseGold(upgradeCost);
};

/**
 * Upgrade a factory to unlock
 *
 * @param factory - The factory to upgrade to unlock
 */
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

export const getProductionValue = (factory: FactoryType) => {
  const { productionValue, isUpgraded } = getFactory(factory);

  return productionValue * (isUpgraded ? 2 : 1);
};

/**
 * Get the total amount of gold a factory will earn after producing
 *
 * @param factory - The factory to get the total amount of gold for
 * @returns The total amount of gold a factory will earn after producing
 */
export const totalToEarnAfterProduce = (factory: FactoryType) => {
  const { amount } = getFactory(factory);
  const productionValue = getProductionValue(factory);

  return amount * productionValue;
};
