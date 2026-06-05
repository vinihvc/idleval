import { InfoBox } from "pixelarticons/react";
import type React from "react";
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
import { cn } from "@/lib/cn";
import {
  setAmountBySelectedAmount,
  unlockFactory,
  useFactory,
} from "@/store/atoms/factories";
import {
  totalCanBuyByAmount,
  totalToPayByAmount,
  useMsc,
} from "@/store/atoms/msc";
import { hasGoldToBuy } from "@/store/atoms/wallet";
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

  const { isUnlocked, unlockPrice, name, nextUnitCost } =
    useFactory(factoryType);
  const { value: amountToBuy } = useMsc();
  const totalCanBuy = totalCanBuyByAmount(factoryType, amountToBuy);
  const totalToPay = totalToPayByAmount(factoryType, amountToBuy);

  const totalGreaterThan0 = totalCanBuy > 0;
  const buyPrice = totalGreaterThan0 ? totalToPay : nextUnitCost;

  const handleBuy = () => {
    if (isUnlocked) {
      setAmountBySelectedAmount(factoryType, amountToBuy);
    } else {
      unlockFactory(factoryType);
    }
  };

  const canBuyAmount = hasGoldToBuy(totalToPay);
  const canUnlock = hasGoldToBuy(unlockPrice);
  const isLocked = !(isUnlocked || canUnlock);

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
              Buy <NumberText>{amountFormatter(totalCanBuy)}</NumberText>{" "}
              <span className="max-sm:hidden">{name}</span>
            </span>

            <NumberText className="normal-case">
              {amountFormatterWithDolarSign(totalToPay)}
            </NumberText>
          </>
        )}

        {!isUnlocked && canUnlock && (
          <>
            Unlock
            <NumberText className="normal-case">
              {amountFormatterWithDolarSign(unlockPrice)}
            </NumberText>
          </>
        )}

        {isUnlocked && !canBuyAmount && (
          <>
            Empty coffers
            <NumberText className="normal-case">
              {amountFormatterWithDolarSign(buyPrice)}
            </NumberText>
          </>
        )}

        {isUnlocked && canBuyAmount && !totalGreaterThan0 && (
          <>
            Empty coffers
            <NumberText className="normal-case">
              {amountFormatterWithDolarSign(buyPrice)}
            </NumberText>
          </>
        )}

        {isLocked && (
          <>
            <span className="[-webkit-text-stroke-width:0]">Under seal</span>
            <NumberText className="normal-case opacity-80">
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
