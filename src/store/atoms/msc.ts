import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { FactoryType } from "@/content/factories";
import { store } from "@/store/store";
import { getFactory } from "./factories";
import { hasGoldToBuy, walletAtom } from "./wallet";

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
    description: "all you can afford",
    value: "max",
    math: "percentage",
  },
] as const;

export interface MscAtomProps {
  amountToBuy: (typeof AMOUNT_TO_BUY)[number]["value"];
}

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

const getNextAmountToBuy = (
  current: MscAtomProps["amountToBuy"]
): MscAtomProps["amountToBuy"] => {
  if (current === 1) {
    return 10;
  }

  if (current === 10) {
    return 50;
  }

  if (current === 50) {
    return "max";
  }

  return 1;
};

export const toggleAmountToBuy = () => {
  store.set(mscAtom, (prev) => ({
    amountToBuy: getNextAmountToBuy(prev.amountToBuy),
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
  const { gold } = store.get(walletAtom);
  const { buyCost } = getFactory(factory);

  // Return the total amount of gold divided by the buy cost
  if (amount === "max") {
    return Math.max(0, Math.floor(gold / buyCost));
  }

  // Return the total amount of gold divided by the buy cost
  if (amount === 10) {
    const totalCanBuy = Math.floor((gold * 0.1) / buyCost);

    // If gold is greater than the buy cost but 10% is less than 1, return at least 1
    if (gold >= buyCost) {
      return Math.max(1, totalCanBuy);
    }

    return 0;
  }

  // Return the total amount of gold divided by the buy cost
  if (amount === 50) {
    const totalCanBuy = Math.floor((gold * 0.5) / buyCost);

    // If gold is greater than the buy cost but 50% is less than 1, return at least 1
    if (gold >= buyCost) {
      return Math.max(1, totalCanBuy);
    }

    return 0;
  }

  // Return 1 if gold is greater than the buy cost, otherwise return 0
  return hasGoldToBuy(buyCost) ? 1 : 0;
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
