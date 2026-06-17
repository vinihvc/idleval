import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import { borderedText } from "@/components/ui/text-border";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import {
  type PurchaseModeValue,
  toggleAmountToBuy,
  usePurchaseMode,
} from "@/store/atoms/purchase-mode";

const getPurchaseLabel = (value: PurchaseModeValue): string => {
  if (value === 1) {
    return m["purchase.mode.1"]();
  }

  if (value === 10) {
    return m["purchase.mode.10pct"]();
  }

  if (value === 50) {
    return m["purchase.mode.50pct"]();
  }

  return m["purchase.mode.max"]();
};

const getPurchaseSymbol = (value: PurchaseModeValue): string => {
  if (value === 1) {
    return "x";
  }

  if (value === 10 || value === 50) {
    return "%";
  }

  return "";
};

export const AmountToBuy = () => {
  const value = usePurchaseMode();
  const label = getPurchaseLabel(value);
  const symbol = getPurchaseSymbol(value);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="w-14"
          onClick={toggleAmountToBuy}
          size="icon-sm"
          variant="cream"
        >
          <span>
            <NumberText
              className={cn(
                "font-semibold text-xl capitalize",
                borderedText({ variant: "default" })
              )}
            >
              {`${value}${symbol}`}
            </NumberText>
          </span>

          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>

      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
