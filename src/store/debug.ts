import { FACTORY_TYPES } from "@/content/factories";
import { resetRunProgress } from "@/game/reset-run";
import { store } from "@/providers/store";
import { D, deserializeDecimal, serializeDecimal } from "@/utils/decimal";
import { factoriesAtom } from "./atoms/factories";
import { godsAtom } from "./atoms/gods";
import { statisticsAtom } from "./atoms/statistics";
import { walletAtom } from "./atoms/wallet";

export const DEBUG_GOLD_AMOUNT = D(100_000_000_000);
export const GOD_MODE_GOLD_AMOUNT = D("1e100");

const initialStatistics = Object.fromEntries(
  FACTORY_TYPES.map((factory) => [
    factory,
    {
      quantity: 0,
      goldSpent: serializeDecimal(D(0)),
      goldEarned: serializeDecimal(D(0)),
    },
  ])
);

export const resetGameState = () => {
  resetRunProgress();
  store.set(statisticsAtom, {
    goldEarned: serializeDecimal(D(0)),
    goldSpent: serializeDecimal(D(0)),
    factories: initialStatistics,
  });
  store.set(godsAtom, { count: 0 });
};

export const addDebugGold = () => {
  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: serializeDecimal(
      deserializeDecimal(prev.gold).plus(DEBUG_GOLD_AMOUNT)
    ),
  }));
};

const setAllFactoriesFlag = (
  flag: "isUpgraded" | "isAutomated",
  value: boolean
) => {
  store.set(factoriesAtom, (prev) => {
    const next = { ...prev };

    for (const factory of FACTORY_TYPES) {
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

    for (const factory of FACTORY_TYPES) {
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
  store.set(walletAtom, { gold: serializeDecimal(GOD_MODE_GOLD_AMOUNT) });
};
