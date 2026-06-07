import { useAtomValue } from "jotai";
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
import type { FactoryType } from "@/content/factories";
import {
  canPurchaseUnits,
  canUnlockFactory,
  isFactorySealed,
} from "@/game/purchases";
import { cn } from "@/lib/cn";
import {
  setAmountBySelectedAmount,
  unlockFactory,
  useFactory,
} from "@/store/atoms/factories";
import {
  computePurchaseTotals,
  usePurchaseMode,
} from "@/store/atoms/purchase-mode";
import { walletAtom } from "@/store/atoms/wallet";
import { deserializeDecimal } from "@/utils/decimal";
import {
  amountFormatter,
  amountFormatterWithDolarSign,
} from "@/utils/formatters";

interface FactoryCardUpgradeProps extends React.ComponentProps<"div"> {
  /**
   * The type of factory
   */
  factoryType: FactoryType;
}

export const FactoryCardUpgrade = (props: FactoryCardUpgradeProps) => {
  const { factoryType, className, ...rest } = props;

  const { amount, baseBuyCost, isUnlocked, unlockPrice, name, nextUnitCost } =
    useFactory(factoryType);
  const { gold: goldSerialized } = useAtomValue(walletAtom);
  const gold = deserializeDecimal(goldSerialized);
  const purchaseMode = usePurchaseMode();
  const { value: amountToBuy } = purchaseMode;
  const { totalCanBuy, totalToPay } = React.useMemo(
    () =>
      computePurchaseTotals(
        amountToBuy,
        deserializeDecimal(goldSerialized),
        amount,
        baseBuyCost
      ),
    [amountToBuy, goldSerialized, amount, baseBuyCost]
  );

  // #region agent log
  React.useEffect(() => {
    fetch("http://127.0.0.1:7620/ingest/0d90553c-a60c-49af-9fa4-e621890cbf4b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "ece29d",
      },
      body: JSON.stringify({
        sessionId: "ece29d",
        runId: "pre-fix",
        hypothesisId: "A-B-E",
        location: "factory-card.upgrade.tsx:purchase-state",
        message: "Factory purchase button state",
        data: {
          factoryType,
          purchaseModeValue: purchaseMode.value,
          purchaseModeName: purchaseMode.name,
          amountToBuyType: typeof amountToBuy,
          amountToBuy,
          owned: amount,
          baseBuyCost,
          gold: gold.toString(),
          totalCanBuy,
          totalToPay: totalToPay.toString(),
          canBuyAmount: canPurchaseUnits({
            gold,
            quantity: totalCanBuy,
            totalToPay,
          }),
          isUnlocked,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => undefined);
  }, [
    factoryType,
    purchaseMode.value,
    purchaseMode.name,
    amountToBuy,
    amount,
    baseBuyCost,
    gold,
    totalCanBuy,
    totalToPay,
    isUnlocked,
  ]);
  // #endregion

  const totalGreaterThan0 = totalCanBuy > 0;
  const buyPrice = totalGreaterThan0 ? totalToPay : nextUnitCost;

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
  const isLocked = isFactorySealed({ isUnlocked, gold, unlockPrice });

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
            "border-popover-foreground/25 border-dashed bg-popover-foreground/10! text-popover-foreground/50 shadow-none [-webkit-text-stroke-width:0] hover:bg-popover-foreground/10 active:scale-100"
        )}
        data-locked={isLocked}
        disabled={
          isUnlocked
            ? !(canBuyAmount && totalGreaterThan0)
            : !(canUnlock && totalGreaterThan0)
        }
        onClick={handleBuy}
        size="md"
        variant={isLocked ? "stone" : buttonVariant()}
      >
        {isUnlocked && canBuyAmount && totalGreaterThan0 && (
          <>
            <span className="flex items-center gap-1">
              Buy{" "}
              <NumberText variant="green">
                {amountFormatter(totalCanBuy)}
              </NumberText>{" "}
              <span className="max-sm:hidden md:max-lg:hidden">{name}</span>
            </span>

            <NumberText variant="green">
              {amountFormatterWithDolarSign(totalToPay)}
            </NumberText>
          </>
        )}

        {!isUnlocked && canUnlock && (
          <>
            Unlock
            <NumberText variant="default">
              {amountFormatterWithDolarSign(unlockPrice)}
            </NumberText>
          </>
        )}

        {isUnlocked && !canBuyAmount && (
          <>
            Empty coffers
            <NumberText>{amountFormatterWithDolarSign(buyPrice)}</NumberText>
          </>
        )}

        {isUnlocked && canBuyAmount && !totalGreaterThan0 && (
          <>
            Empty coffers
            <NumberText>{amountFormatterWithDolarSign(buyPrice)}</NumberText>
          </>
        )}

        {isLocked && (
          <>
            <span className="[-webkit-text-stroke-width:0]">Under seal</span>
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
                <span className="sr-only">{`${name} ledger`}</span>
                <InfoBox className="size-4" />
              </Button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>

          <TooltipContent>{`${name} ledger`}</TooltipContent>
        </Tooltip>
      </FactoryDialog>
    </div>
  );
};
