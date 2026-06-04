import type React from "react";
import { FactoryDialog } from "@/components/dialog/factory";
import { Button } from "@/components/ui/button";
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
import { hasMoneyToBuy } from "@/store/atoms/wallet";
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

  const { isUnlocked, unlockPrice, name } = useFactory(factoryType);
  const { value: amountToBuy } = useMsc();

  const totalCanBuy = totalCanBuyByAmount(factoryType, amountToBuy);
  const totalToPay = totalToPayByAmount(factoryType, amountToBuy);

  const totalGreaterThan0 = totalCanBuy > 0;

  const handleBuy = () => {
    isUnlocked
      ? setAmountBySelectedAmount(factoryType, amountToBuy)
      : unlockFactory(factoryType);
  };

  const canBuyAmount = hasMoneyToBuy(totalToPay);
  const canUnlock = hasMoneyToBuy(unlockPrice);

  const buttonVariant = () => {
    if (!totalGreaterThan0) {
      return "gray";
    }
    if (isUnlocked && canBuyAmount) {
      return "green";
    }
    if (!isUnlocked && canUnlock) {
      return "black";
    }
    return "gray";
  };

  return (
    <div className={cn("flex min-w-0 items-center gap-1", className)} {...rest}>
      <Button
        className="min-w-0 flex-1 justify-between gap-1 px-2 font-bold text-xs uppercase max-sm:text-[10px]"
        disabled={
          isUnlocked
            ? !(canBuyAmount && totalGreaterThan0)
            : !(canUnlock && totalGreaterThan0)
        }
        onClick={handleBuy}
        variant={buttonVariant()}
      >
        {isUnlocked && canBuyAmount && totalGreaterThan0 && (
          <>
            <span className="flex items-center gap-1">
              {`Buy ${amountFormatter(totalCanBuy)} `}

              <span className="max-sm:hidden">{name}</span>
            </span>

            <span className="normal-case">
              {amountFormatterWithDolarSign(totalToPay)}
            </span>
          </>
        )}

        {!isUnlocked && canUnlock && (
          <>
            Unlock
            <span className="normal-case">
              {amountFormatterWithDolarSign(unlockPrice)}
            </span>
          </>
        )}

        {!(isUnlocked || canUnlock) || (!totalGreaterThan0 && "No money")}

        {isUnlocked && !canBuyAmount && (
          <>
            No money
            <span className="normal-case">
              {amountFormatterWithDolarSign(totalToPay)}
            </span>
          </>
        )}

        {!(isUnlocked || canUnlock) && (
          <>
            Locked
            <span className="normal-case">
              {amountFormatterWithDolarSign(unlockPrice)}
            </span>
          </>
        )}
      </Button>

      <FactoryDialog factoryType={factoryType} />
    </div>
  );
};
