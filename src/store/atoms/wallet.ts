import { useAtomValue } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { FactoryType } from "@/content/factories";
import { store } from "@/store/store";
import { getFactory } from "./factories";
import { setStatistics } from "./statistics";

interface WalletState {
  gold: number;
}

const migrateWallet = (parsed: Record<string, unknown>): WalletState => {
  if (typeof parsed.gold === "number") {
    return { gold: parsed.gold };
  }

  if (typeof parsed.money === "number") {
    return { gold: parsed.money };
  }

  return { gold: 0 };
};

const walletStorage = createJSONStorage<WalletState>(() => localStorage, {
  reviver: (key, value) => {
    if (key === "" && value && typeof value === "object") {
      return migrateWallet(value as Record<string, unknown>);
    }

    return value;
  },
});

export const walletAtom = atomWithStorage("wallet", { gold: 0 }, walletStorage);

export const useWallet = () => useAtomValue(walletAtom);

/**
 * Increase the amount of gold in the wallet
 *
 * @param factory - The factory that produced the gold
 */
export const increaseGold = (factory: FactoryType) => {
  const { amount, productionValue, isUpgraded } = getFactory(factory);

  const goldEarned = amount * productionValue * (isUpgraded ? 2 : 1);

  setStatistics(factory);

  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: prev.gold + goldEarned,
  }));
};

/**
 * Decrease the amount of gold in the wallet
 *
 * @param amount - The amount of gold to decrease
 */
export const decreaseGold = (amount: number) => {
  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: prev.gold - amount,
  }));
};

/**
 * Check if the wallet has enough gold to buy an item
 *
 * @param price - The price of the item
 * @returns `true` if the wallet has enough gold, `false` otherwise
 */
export const hasGoldToBuy = (price: number) => {
  const wallet = store.get(walletAtom);

  return wallet.gold >= price;
};
