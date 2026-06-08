import { InfoBox } from "pixelarticons/react";
import React from "react";
import { FactoryDialog } from "@/components/dialog/factory";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { canPurchaseUnits, canUnlockFactory } from "@/game/purchases";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
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

interface FactoryCardUpgradeProps extends React.ComponentProps<"div"> {}

export const FactoryCardUpgrade = (props: FactoryCardUpgradeProps) => {
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
          "h-9 min-h-9 min-w-0 flex-1 justify-between gap-1 px-2 font-bold font-number",
          isLocked &&
            "border-popover-foreground/25 border-dashed bg-popover-foreground/10! text-muted/50 shadow-none [-webkit-text-stroke-width:0] hover:bg-popover-foreground/10 active:scale-100"
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

        {isUnlocked && !canBuyAmount && (
          <>
            {m["ui.factoryCard.emptyCoffers"]()}
            <NumberText>{amountFormatterWithDolarSign(buyPrice)}</NumberText>
          </>
        )}

        {isUnlocked && canBuyAmount && !totalGreaterThan0 && (
          <>
            {m["ui.factoryCard.emptyCoffers"]()}
            <NumberText>{amountFormatterWithDolarSign(buyPrice)}</NumberText>
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

      <FactoryDialog factoryType={factoryType}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ResponsiveDialogTrigger asChild>
              <Button className="size-9 shrink-0" size="icon-lg" variant="blue">
                <span className="sr-only">{ledgerLabel}</span>
                <InfoBox className="size-4" />
              </Button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>

          <TooltipContent>{ledgerLabel}</TooltipContent>
        </Tooltip>
      </FactoryDialog>
    </div>
  );
};
