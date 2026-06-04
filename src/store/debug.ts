import { FACTORIES, type FactoryType } from "@/content/factories";
import { allianceAtom } from "./atoms/alliance";
import { factoriesAtom, initialData } from "./atoms/factories";
import { mscAtom } from "./atoms/msc";
import { statisticsAtom } from "./atoms/statistics";
import { walletAtom } from "./atoms/wallet";
import { store } from "./store";

export const DEBUG_GOLD_AMOUNT = 1_000_000;
export const GOD_MODE_GOLD_AMOUNT = 1e15;

const initialStatistics = Object.fromEntries(
  Object.keys(FACTORIES).map((factory) => [
    factory,
    { quantity: 0, goldSpent: 0, goldEarned: 0 },
  ])
);

export const resetGameState = () => {
  store.set(walletAtom, { gold: 0 });
  store.set(factoriesAtom, initialData);
  store.set(statisticsAtom, {
    goldEarned: 0,
    goldSpent: 0,
    factories: initialStatistics,
  });
  store.set(allianceAtom, { count: 0 });
  store.set(mscAtom, { amountToBuy: 1 });
};

export const addDebugGold = () => {
  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: prev.gold + DEBUG_GOLD_AMOUNT,
  }));
};

const setAllFactoriesFlag = (
  flag: "isUpgraded" | "isAutomated",
  value: boolean
) => {
  store.set(factoriesAtom, (prev) => {
    const next = { ...prev };

    for (const factory of Object.keys(FACTORIES) as FactoryType[]) {
      next[factory] = { ...next[factory], [flag]: value };
    }

    return next;
  });
};

export const enableAllUpgrades = () => {
  setAllFactoriesFlag("isUpgraded", true);
};

export const enableAllManagers = () => {
  setAllFactoriesFlag("isAutomated", true);
};

export const unlockAllFactories = () => {
  store.set(factoriesAtom, (prev) => {
    const next = { ...prev };

    for (const factory of Object.keys(FACTORIES) as FactoryType[]) {
      const { amount } = next[factory];

      next[factory] = {
        ...next[factory],
        isUnlocked: true,
        amount: amount > 0 ? amount : 1,
      };
    }

    return next;
  });
};

export const enableGodMode = () => {
  unlockAllFactories();
  enableAllUpgrades();
  enableAllManagers();
  store.set(walletAtom, { gold: GOD_MODE_GOLD_AMOUNT });
};
