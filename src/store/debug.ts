import { FACTORY_TYPES } from "@/content/factories";
import { POWER_UP_TYPES } from "@/content/power-ups";
import { addInventorySlot } from "@/game/power-ups";
import { store } from "@/providers/store";
import { offlineSummaryAtom } from "@/store/offline-earning";
import { resetGame } from "@/store/reset";
import { D, deserializeDecimal, serializeDecimal } from "@/utils/decimal";
import { factoriesAtom } from "./atoms/factories";
import { inventoryAtom } from "./atoms/inventory";
import { walletAtom } from "./atoms/wallet";

export const DEBUG_GOLD_AMOUNT = D(100_000_000_000);
export const DEBUG_POWER_UP_AMOUNT = 1;
export const GOD_MODE_GOLD_AMOUNT = D("1e100");

export const resetGameState = resetGame;

export const addDebugGold = () => {
  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: serializeDecimal(
      deserializeDecimal(prev.gold).plus(DEBUG_GOLD_AMOUNT)
    ),
  }));
};

export const addDebugPowerUps = () => {
  store.set(inventoryAtom, (previous) => {
    let slots = previous.slots;

    for (const powerUpId of POWER_UP_TYPES) {
      for (let amount = 0; amount < DEBUG_POWER_UP_AMOUNT; amount++) {
        slots = addInventorySlot(slots, {
          powerUpId,
          tier: "common",
        });
      }
    }

    return {
      ...previous,
      slots,
    };
  });
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

export const openDebugOfflineEarning = () => {
  store.set(offlineSummaryAtom, {
    elapsedMs: 3_600_000,
    totalGold: D(12_345),
    results: [],
  });
};
