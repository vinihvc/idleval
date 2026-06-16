import { InfoBox } from "pixelarticons/react/InfoBox";
import React from "react";
import { tv } from "tailwind-variants";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { getFactoryDialogId, toggleDialog } from "@/store/atoms/dialogs";
import {
  amountFormatter,
  amountFormatterWithDolarSign,
} from "@/utils/formatters";
import { useFactoryCard } from "./factory-card.context";
import { useFactoryPurchase } from "./use-factory-purchase";

const factoryCardUpgradeButtonVariants = tv({
  base: [
    "min-w-0",
    "flex-1 justify-between gap-1",
    "px-2",
    "font-bold font-number text-base",
  ],
  variants: {
    muted: {
      true: [
        "border-popover-foreground/25 border-dashed bg-popover-foreground/10! text-muted/50 shadow-none [-webkit-text-stroke-width:0] hover:bg-popover-foreground/10",
      ],
    },
  },
});

const LazyFactoryDialog = React.lazy(
  () => import("@/components/dialog/factory/factory")
);

export const FactoryCardUpgrade = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  const factoryCard = useFactoryCard();
  const purchase = useFactoryPurchase(factoryCard);
  const {
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
    showEmptyCoffers,
    isMutedUpgrade,
    buttonVariant,
    handleBuy,
    disabled,
  } = purchase;

  const { name } = factoryCard;

  const ledgerLabel = m["ui.factoryCard.ledger"]({ name });

  return (
    <div
      className={cn("flex min-w-0 items-stretch gap-1", className)}
      {...rest}
    >
      <Button
        className={factoryCardUpgradeButtonVariants({ muted: isMutedUpgrade })}
        data-locked={isLocked}
        disabled={disabled}
        onClick={handleBuy}
        size="md"
        variant={isLocked ? "stone" : buttonVariant()}
      >
        {isUnlocked && canBuyAmount && totalGreaterThan0 && (
          <>
            <span className="flex min-w-0 shrink items-center gap-1 truncate">
              {m["ui.factoryCard.buy"]()}
              <NumberText className="shrink-0 text-base" variant="green">
                {amountFormatter(totalCanBuy)}
              </NumberText>
            </span>

            <NumberText className="shrink-0 text-base" variant="green">
              {amountFormatterWithDolarSign(totalToPay)}
            </NumberText>
          </>
        )}

        {!isUnlocked && canUnlock && (
          <>
            <span className="min-w-0 shrink truncate">
              {m["ui.factoryCard.unlock"]()}
            </span>
            <NumberText className="shrink-0 text-base" variant="default">
              {amountFormatterWithDolarSign(unlockPrice)}
            </NumberText>
          </>
        )}

        {showEmptyCoffers && (
          <>
            <span className="min-w-0 shrink truncate [-webkit-text-stroke-width:0]">
              {m["ui.factoryCard.emptyCoffers"]()}
            </span>
            <NumberText className="shrink-0 text-base [-webkit-text-stroke-width:0]">
              {amountFormatterWithDolarSign(buyPrice)}
            </NumberText>
          </>
        )}

        {isLocked && (
          <>
            <span className="min-w-0 shrink truncate [-webkit-text-stroke-width:0]">
              {m["ui.factoryCard.underSeal"]()}
            </span>
            <NumberText className="shrink-0 text-base [-webkit-text-stroke-width:0]">
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
