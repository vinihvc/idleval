import { useAtomValue } from "jotai";
import { persistedAtom } from "@/store/storage";
import type { FactoryType } from "@/content/factories";
import { getAffordableUnitCount, getPurchaseTotalCost } from "@/game/purchases";
import { store } from "@/providers/store";
import { getFactory } from "@/store/atoms/factories";
import { getGold } from "./wallet";

export const AMOUNT_TO_BUY = [
  {
    name: "1",
    symbol: "x",
    description: "1",
    value: 1,
  },
  {
    name: "10",
    symbol: "%",
    description: "10%",
    value: 10,
  },
  {
    name: "50",
    symbol: "%",
    description: "50%",
    value: 50,
  },
  {
    name: "max",
    symbol: "",
    description: "all you can afford",
    value: "max",
  },
] as const;

export interface PurchaseModeState {
  amountToBuy: (typeof AMOUNT_TO_BUY)[number]["value"];
}

export const purchaseModeAtom = persistedAtom<PurchaseModeState>("msc", {
  amountToBuy: 1,
});

export const usePurchaseMode = () => {
  const { amountToBuy } = useAtomValue(purchaseModeAtom);

  const found = AMOUNT_TO_BUY.find((a) => a.value === amountToBuy);

  if (!found) {
    return AMOUNT_TO_BUY[0];
  }

  return found;
};

/** @deprecated Use `usePurchaseMode` */
export const useMsc = usePurchaseMode;

const getNextAmountToBuy = (
  current: PurchaseModeState["amountToBuy"]
): PurchaseModeState["amountToBuy"] => {
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
  store.set(purchaseModeAtom, (prev) => ({
    amountToBuy: getNextAmountToBuy(prev.amountToBuy),
  }));
};

export const totalCanBuyByAmount = (
  factory: FactoryType,
  amount: PurchaseModeState["amountToBuy"]
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
  amount: PurchaseModeState["amountToBuy"]
) => {
  const { baseBuyCost, amount: owned } = getFactory(factory);
  const totalCanBuy = totalCanBuyByAmount(factory, amount);

  return getPurchaseTotalCost(baseBuyCost, owned, totalCanBuy);
};
