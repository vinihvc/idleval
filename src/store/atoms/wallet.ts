import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { FactoryType } from "@/content/factories";
import { setStatistics, store } from "..";
import { getFactory } from "./factories";

export const walletAtom = atomWithStorage("wallet", {
  money: 0,
});

export const useWallet = () => useAtomValue(walletAtom);

/**
 * Increase the amount of money in the wallet
 *
 * @param factory - The factory that produced the money
 */
export const increaseMoney = (factory: FactoryType) => {
  const { amount, productionValue, isUpgraded } = getFactory(factory);

  const moneyEarned = amount * productionValue * (isUpgraded ? 2 : 1);

  setStatistics(factory);

  store.set(walletAtom, (prev) => ({
    ...prev,
    money: prev.money + moneyEarned,
  }));
};

/**
 * Decrease the amount of money in the wallet
 *
 * @param amount - The amount of money to decrease
 */
export const decreaseMoney = (amount: number) => {
  store.set(walletAtom, (prev) => ({
    ...prev,
    money: prev.money - amount,
  }));
};

/**
 * Check if the wallet has enough money to buy an item
 *
 * @param price - The price of the item
 * @returns `true` if the wallet has enough money, `false` otherwise
 */
export const hasMoneyToBuy = (price: number) => {
  const wallet = store.get(walletAtom);

  return wallet.money >= price;
};
