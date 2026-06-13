import { useAtomValue } from "jotai";
import { LOCAL_STORAGE } from "@/config/local-storage";
import type { FactoryType } from "@/content/factories";
import {
  getAffordableUnitCount,
  getPurchaseTotalCost,
  normalizePurchaseAmount,
} from "@/game/purchases";
import { store } from "@/providers/store";
import { getFactory } from "@/store/atoms/factories";
import { persistedAtom } from "@/store/storage";
import type { GameValue } from "@/utils/decimal";
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

export const purchaseModeAtom = persistedAtom<PurchaseModeState>(
  LOCAL_STORAGE.purchaseMode,
  {
    amountToBuy: 1,
  }
);

export const usePurchaseModeState = () => useAtomValue(purchaseModeAtom);

export const usePurchaseMode = () => {
  const { amountToBuy } = usePurchaseModeState();
  const normalizedAmount = normalizePurchaseAmount(amountToBuy);
  const found = AMOUNT_TO_BUY.find((a) => a.value === normalizedAmount);

  if (!found) {
    return AMOUNT_TO_BUY[0];
  }

  return found;
};

const getNextAmountToBuy = (
  current: PurchaseModeState["amountToBuy"] | unknown
): PurchaseModeState["amountToBuy"] => {
  const amount = normalizePurchaseAmount(current);

  if (amount === 1) {
    return 10;
  }

  if (amount === 10) {
    return 50;
  }

  if (amount === 50) {
    return "max";
  }

  return 1;
};

export const toggleAmountToBuy = () => {
  store.set(purchaseModeAtom, (prev) => ({
    amountToBuy: getNextAmountToBuy(prev.amountToBuy),
  }));
};

export const computePurchaseTotals = (
  amount: PurchaseModeState["amountToBuy"],
  gold: GameValue,
  owned: number,
  baseBuyCost: number
) => {
  const totalCanBuy = getAffordableUnitCount({
    amount,
    baseBuyCost,
    gold,
    owned,
  });
  const totalToPay = getPurchaseTotalCost(baseBuyCost, owned, totalCanBuy);

  return { totalCanBuy, totalToPay };
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
  const gold = getGold();
  const { baseBuyCost, amount: owned } = getFactory(factory);

  return computePurchaseTotals(amount, gold, owned, baseBuyCost).totalToPay;
};
