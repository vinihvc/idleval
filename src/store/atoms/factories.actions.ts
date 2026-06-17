import type { FactoryType } from "@/content/factories";
import {
  canPurchaseManager,
  canPurchaseUpgrade,
  canStartManualProduction,
} from "@/game/factories";
import { clearManualProductionFields } from "@/game/manual-production";
import { canPurchaseUnits, canUnlockFactory } from "@/game/purchases";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { getEffectiveProductionTimeForActivePowerUp } from "@/store/atoms/inventory";
import {
  incrementMissionCounter,
  incrementRunGoldSpent,
  syncMissionProgress,
} from "@/store/atoms/missions.actions";
import { D } from "@/utils/decimal";
import { factoriesAtom } from "./factories.atom";
import { getFactory } from "./factories.selectors";
import { getTotalEarnPerCycle } from "./factory-earn";
import {
  type PurchaseModeState,
  totalCanBuyByAmount,
  totalToPayByAmount,
} from "./purchase-mode";
import { touchLastSeenIfVisible } from "./session";
import { recordGoldSpent, recordQuantity } from "./statistics";
import { decreaseGold, getGold, increaseGoldByAmount } from "./wallet";

export const setAmountBySelectedAmount = (
  factory: FactoryType,
  amount: PurchaseModeState["amountToBuy"]
) => {
  const amountToPay = totalToPayByAmount(factory, amount);
  const amountToBuy = totalCanBuyByAmount(factory, amount);

  if (
    !canPurchaseUnits({
      gold: getGold(),
      quantity: amountToBuy,
      totalToPay: amountToPay,
    })
  ) {
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
  incrementRunGoldSpent(amountToPay);
  recordQuantity(factory, amountToBuy);
  syncMissionProgress();
};

export const startProducing = (factory: FactoryType) => {
  const { isAutomated, isProducing, isUnlocked, productionTime } =
    getFactory(factory);

  if (!canStartManualProduction({ isProducing, isAutomated, isUnlocked })) {
    return;
  }

  const now = Date.now();
  const productionDurationSec =
    getEffectiveProductionTimeForActivePowerUp(productionTime);

  store.set(factoriesAtom, (prev) => ({
    ...prev,
    [factory]: {
      ...prev[factory],
      isProducing: true,
      productionStartedAt: now,
      productionDurationSec,
    },
  }));
};

export const completeProductionCycle = (factory: FactoryType) => {
  const { isAutomated } = getFactory(factory);

  store.set(factoriesAtom, (prev) => ({
    ...prev,
    [factory]: clearManualProductionFields(prev[factory]),
  }));

  const goldEarned = getTotalEarnPerCycle(factory);

  increaseGoldByAmount(factory, goldEarned);
  incrementMissionCounter("productionCyclesCompleted");
  syncMissionProgress();

  if (!isAutomated) {
    sound.play("coin");
  }

  if (isAutomated) {
    touchLastSeenIfVisible();
  }
};

export const autoFactory = (factory: FactoryType) => {
  const { isAutomated, isUnlocked, managerCost: cost } = getFactory(factory);

  if (!canPurchaseManager({ isUnlocked, isAutomated, gold: getGold(), cost })) {
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
  incrementRunGoldSpent(cost);
  syncMissionProgress();
};

export const upgradeFactory = (factory: FactoryType) => {
  const { isUnlocked, isUpgraded, upgradeCost: cost } = getFactory(factory);

  if (!canPurchaseUpgrade({ isUnlocked, isUpgraded, gold: getGold(), cost })) {
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
  incrementRunGoldSpent(cost);
  syncMissionProgress();
};

export const unlockFactory = (factory: FactoryType) => {
  const { unlockPrice } = getFactory(factory);

  if (!canUnlockFactory(getGold(), unlockPrice)) {
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
  incrementRunGoldSpent(D(unlockPrice));
  recordQuantity(factory, 1);
  syncMissionProgress();
};
