import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { FactoryType } from "@/content/factories";
import { getFactory, hasMoneyToBuy, store, walletAtom } from "..";

export const AMOUNT_TO_BUY = [
  {
    name: "1",
    symbol: "x",
    description: "1",
    value: 1,
    math: "unit",
  },
  {
    name: "10",
    symbol: "%",
    description: "10%",
    value: 10,
    math: "percentage",
  },
  {
    name: "50",
    symbol: "%",
    description: "50%",
    value: 50,
    math: "percentage",
  },
  {
    name: "max",
    symbol: "",
    description: "maximum",
    value: "max",
    math: "percentage",
  },
] as const;

export type MscAtomProps = {
  amountToBuy: (typeof AMOUNT_TO_BUY)[number]["value"];
};

export const mscAtom = atomWithStorage<MscAtomProps>("msc", {
  amountToBuy: 1,
});

export const useMsc = () => {
  const { amountToBuy } = useAtomValue(mscAtom);

  const found = AMOUNT_TO_BUY.find((a) => a.value === amountToBuy);

  if (!found) {
    return AMOUNT_TO_BUY[0];
  }

  return found;
};

export const toggleAmountToBuy = () => {
  store.set(mscAtom, (prev) => ({
    amountToBuy:
      prev.amountToBuy === 1
        ? 10
        : prev.amountToBuy === 10
          ? 50
          : prev.amountToBuy === 50
            ? "max"
            : 1,
  }));
};

/**
 * Get the total amount of a factory that can be bought by amount
 *
 * @param factory - The factory to get the total amount of
 * @returns The total amount of a factory that can be bought by amount
 */
export const totalCanBuyByAmount = (
  factory: FactoryType,
  amount: MscAtomProps["amountToBuy"]
) => {
  const { money } = store.get(walletAtom);
  const { buyCost } = getFactory(factory);

  // Return the total amount of money divided by the buy cost
  if (amount === "max") {
    return Math.max(0, Math.floor(money / buyCost));
  }

  // Return the total amount of money divided by the buy cost
  if (amount === 10) {
    const totalCanBuy = Math.floor((money * 0.1) / buyCost);

    // If the money is greater than the buy cost but 10% is less than 1, return at least 1
    if (money >= buyCost) {
      return Math.max(1, totalCanBuy);
    }

    return 0;
  }

  // Return the total amount of money divided by the buy cost
  if (amount === 50) {
    const totalCanBuy = Math.floor((money * 0.5) / buyCost);

    // If the money is greater than the buy cost but 50% is less than 1, return at least 1
    if (money >= buyCost) {
      return Math.max(1, totalCanBuy);
    }

    return 0;
  }

  // Return 1 if the money is greater than the buy cost, otherwise return 0
  return hasMoneyToBuy(buyCost) ? 1 : 0;
};

/**
 * Get the total amount to pay for a factory by amount
 *
 * @param factory - The factory to get the total amount to pay for
 * @returns The total amount to pay for a factory by amount
 */
export const totalToPayByAmount = (
  factory: FactoryType,
  amount: MscAtomProps["amountToBuy"]
) => {
  const totalCanBuy = totalCanBuyByAmount(factory, amount);
  const { buyCost } = getFactory(factory);

  return totalCanBuy * buyCost;
};
