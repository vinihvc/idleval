import React from "react";
import { FACTORY_DATA } from "@/content/factories";
import { canPurchaseUnits, canUnlockFactory } from "@/game/purchases";
import {
  setAmountBySelectedAmount,
  unlockFactory,
} from "@/store/atoms/factories";
import {
  computePurchaseTotals,
  usePurchaseMode,
} from "@/store/atoms/purchase-mode";
import { useWallet } from "@/store/atoms/wallet";
import type { FactoryCardModel } from "./use-factory-card";

export const useFactoryPurchase = (model: FactoryCardModel) => {
  const {
    factoryType,
    amount,
    isUnlocked,
    unlockPrice,
    nextUnitCost,
    isLocked,
  } = model;
  const { gold } = useWallet();
  const amountToBuy = usePurchaseMode();
  const catalogBaseBuyCost = FACTORY_DATA[factoryType].baseBuyCost;

  const { totalCanBuy, totalToPay } = React.useMemo(
    () => computePurchaseTotals(amountToBuy, gold, amount, catalogBaseBuyCost),
    [amountToBuy, gold, amount, catalogBaseBuyCost]
  );

  const totalGreaterThan0 = totalCanBuy > 0;
  const buyPrice = totalGreaterThan0 ? totalToPay : nextUnitCost;

  const canBuyAmount = canPurchaseUnits({
    gold,
    quantity: totalCanBuy,
    totalToPay,
  });
  const canUnlock = canUnlockFactory(gold, unlockPrice);

  const canShowBuy = isUnlocked && canBuyAmount && totalGreaterThan0;
  const showEmptyCoffers = isUnlocked && !canShowBuy;
  const isMutedUpgrade = isLocked || showEmptyCoffers;

  const buttonVariant = (): "default" | "green" | "stone" => {
    if (!totalGreaterThan0) {
      return "stone";
    }
    if (isUnlocked && canBuyAmount) {
      return "green";
    }
    if (!isUnlocked && canUnlock) {
      return "default";
    }
    return "stone";
  };

  const handleBuy = () => {
    if (isUnlocked) {
      setAmountBySelectedAmount(factoryType, amountToBuy);
    } else {
      unlockFactory(factoryType);
    }
  };

  return {
    factoryType,
    isLocked,
    isUnlocked,
    unlockPrice,
    totalCanBuy,
    totalToPay,
    totalGreaterThan0,
    buyPrice,
    canBuyAmount,
    canUnlock,
    canShowBuy,
    showEmptyCoffers,
    isMutedUpgrade,
    buttonVariant,
    handleBuy,
    disabled: isUnlocked ? !(canBuyAmount && totalGreaterThan0) : !canUnlock,
  };
};
