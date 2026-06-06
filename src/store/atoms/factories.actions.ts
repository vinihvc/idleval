import type { FactoryType } from "@/content/factories";
import { getFactoryEarnPerCycle } from "@/game/factories";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { D } from "@/utils/decimal";
import { factoriesAtom } from "./factories.atom";
import { getFactory } from "./factories.selectors";
import { getGodsProductionMultiplier } from "./gods";
import {
  type PurchaseModeState,
  totalCanBuyByAmount,
  totalToPayByAmount,
} from "./purchase-mode";
import { touchLastSeen } from "./session";
import { recordGoldSpent, recordQuantity } from "./statistics";
import { decreaseGold, hasGoldToBuy, increaseGoldByAmount } from "./wallet";

export const setAmountBySelectedAmount = (
  factory: FactoryType,
  amount: PurchaseModeState["amountToBuy"]
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
  recordGoldSpent(factory, amountToPay);
  recordQuantity(factory, amountToBuy);
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

export const completeProductionCycle = (factory: FactoryType) => {
  const { amount, isAutomated, isUpgraded, productionValue } =
    getFactory(factory);

  store.set(factoriesAtom, (prev) => ({
    ...prev,
    [factory]: {
      ...prev[factory],
      isProducing: false,
    },
  }));

  const goldEarned = getFactoryEarnPerCycle({
    amount,
    godsProductionMultiplier: getGodsProductionMultiplier(),
    isUpgraded,
    productionValue,
  });

  increaseGoldByAmount(factory, goldEarned);

  if (isAutomated) {
    touchLastSeen();
  }
};

/** @deprecated Use `completeProductionCycle` */
export const stopProducing = completeProductionCycle;

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
  recordGoldSpent(factory, cost);
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
  recordGoldSpent(factory, cost);
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
  recordGoldSpent(factory, D(unlockPrice));
  recordQuantity(factory, 1);
};
