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
import { getFactoryProgressDifficulty } from "@/store/atoms/progress-ease";
import { persistedAtom } from "@/store/storage";
import type { GameValue } from "@/utils/decimal";
import { getGold } from "./wallet";

export const PURCHASE_MODE_VALUES = [1, 10, 50, "max"] as const;

export type PurchaseModeValue = (typeof PURCHASE_MODE_VALUES)[number];

export interface PurchaseModeState {
  amountToBuy: PurchaseModeValue;
}

export const purchaseModeAtom = persistedAtom<PurchaseModeState>(
  LOCAL_STORAGE.purchaseMode,
  {
    amountToBuy: 1,
  }
);

export const usePurchaseModeState = () => useAtomValue(purchaseModeAtom);

export const usePurchaseMode = (): PurchaseModeValue => {
  const { amountToBuy } = usePurchaseModeState();

  return normalizePurchaseAmount(amountToBuy);
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
  const factoryDifficulty = getFactoryProgressDifficulty();
  const totalCanBuy = getAffordableUnitCount({
    amount,
    baseBuyCost,
    factoryDifficulty,
    gold,
    owned,
  });
  const totalToPay = getPurchaseTotalCost(
    baseBuyCost,
    owned,
    totalCanBuy,
    factoryDifficulty
  );

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
    factoryDifficulty: getFactoryProgressDifficulty(),
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
