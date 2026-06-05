import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { FactoryType } from "@/content/factories";
import { getAffordableUnitCount, getPurchaseTotalCost } from "@/game/purchases";
import { store } from "@/providers/store";
import { getFactory } from "./factories";
import { getGold } from "./wallet";

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

export const totalCanBuyByAmount = (
  factory: FactoryType,
  amount: MscAtomProps["amountToBuy"]
) => {
  const gold = getGold();
  const { baseBuyCost, amount: owned } = getFactory(factory);

  return getAffordableUnitCount({
    amount,
    baseBuyCost,
    gold,
    owned,
  });
};

export const totalToPayByAmount = (
  factory: FactoryType,
  amount: MscAtomProps["amountToBuy"]
) => {
  const { baseBuyCost, amount: owned } = getFactory(factory);
  const totalCanBuy = totalCanBuyByAmount(factory, amount);

  return getPurchaseTotalCost(baseBuyCost, owned, totalCanBuy);
};
