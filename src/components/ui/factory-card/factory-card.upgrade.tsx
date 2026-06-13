import { InfoBox } from "pixelarticons/react/InfoBox";
import React from "react";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { canPurchaseUnits, canUnlockFactory } from "@/game/purchases";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { getFactoryDialogId, toggleDialog } from "@/store/atoms/dialogs";
import {
  setAmountBySelectedAmount,
  unlockFactory,
} from "@/store/atoms/factories";
import {
  computePurchaseTotals,
  usePurchaseMode,
} from "@/store/atoms/purchase-mode";
import { useWallet } from "@/store/atoms/wallet";
import {
  amountFormatter,
  amountFormatterWithDolarSign,
} from "@/utils/formatters";
import { useFactoryCard } from "./factory-card.context";

const LazyFactoryDialog = React.lazy(
  () => import("@/components/dialog/factory/factory")
);

export const FactoryCardUpgrade = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  const {
    factoryType,
    amount,
    baseBuyCost,
    isUnlocked,
    unlockPrice,
    name,
    nextUnitCost,
    isLocked,
  } = useFactoryCard();
  const { gold } = useWallet();
  const { value: amountToBuy } = usePurchaseMode();
  const { totalCanBuy, totalToPay } = React.useMemo(
    () => computePurchaseTotals(amountToBuy, gold, amount, baseBuyCost),
    [amountToBuy, gold, amount, baseBuyCost]
  );

  const totalGreaterThan0 = totalCanBuy > 0;
  const buyPrice = totalGreaterThan0 ? totalToPay : nextUnitCost;
  const ledgerLabel = m["ui.factoryCard.ledger"]({ name });

  const handleBuy = () => {
    if (isUnlocked) {
      setAmountBySelectedAmount(factoryType, amountToBuy);
    } else {
      unlockFactory(factoryType);
    }
  };

  const canBuyAmount = canPurchaseUnits({
    gold,
    quantity: totalCanBuy,
    totalToPay,
  });
  const canUnlock = canUnlockFactory(gold, unlockPrice);

  const canShowBuy = isUnlocked && canBuyAmount && totalGreaterThan0;
  const showEmptyCoffers = isUnlocked && !canShowBuy;
  const isMutedUpgrade = isLocked || showEmptyCoffers;

  const buttonVariant = () => {
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

  return (
    <div
      className={cn("flex min-w-0 items-stretch gap-1", className)}
      {...rest}
    >
      <Button
        className={cn(
          "min-w-0 flex-1 justify-between gap-1 px-2 font-bold font-number",
          {
            "border-popover-foreground/25 border-dashed bg-popover-foreground/10! text-muted/50 shadow-none [-webkit-text-stroke-width:0] hover:bg-popover-foreground/10":
              isMutedUpgrade,
          }
        )}
        data-locked={isLocked}
        disabled={
          isUnlocked ? !(canBuyAmount && totalGreaterThan0) : !canUnlock
        }
        onClick={handleBuy}
        size="md"
        variant={isLocked ? "stone" : buttonVariant()}
      >
        {isUnlocked && canBuyAmount && totalGreaterThan0 && (
          <>
            <span className="flex items-center gap-1">
              {m["ui.factoryCard.buy"]()}
              <NumberText variant="green">
                {amountFormatter(totalCanBuy)}
              </NumberText>
            </span>

            <NumberText variant="green">
              {amountFormatterWithDolarSign(totalToPay)}
            </NumberText>
          </>
        )}

        {!isUnlocked && canUnlock && (
          <>
            {m["ui.factoryCard.unlock"]()}
            <NumberText variant="default">
              {amountFormatterWithDolarSign(unlockPrice)}
            </NumberText>
          </>
        )}

        {showEmptyCoffers && (
          <>
            <span className="[-webkit-text-stroke-width:0]">
              {m["ui.factoryCard.emptyCoffers"]()}
            </span>
            <NumberText className="[-webkit-text-stroke-width:0]">
              {amountFormatterWithDolarSign(buyPrice)}
            </NumberText>
          </>
        )}

        {isLocked && (
          <>
            <span className="[-webkit-text-stroke-width:0]">
              {m["ui.factoryCard.underSeal"]()}
            </span>
            <NumberText className="[-webkit-text-stroke-width:0]">
              {amountFormatterWithDolarSign(unlockPrice)}
            </NumberText>
          </>
        )}
      </Button>

      <React.Suspense fallback={null}>
        <LazyFactoryDialog factoryType={factoryType} />
      </React.Suspense>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => toggleDialog(getFactoryDialogId(factoryType))}
            size="icon-md"
            variant="blue"
          >
            <span className="sr-only">{ledgerLabel}</span>
            <InfoBox className="size-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent>{ledgerLabel}</TooltipContent>
      </Tooltip>
    </div>
  );
};
