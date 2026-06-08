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
  toggleAmountToBuy,
  usePurchaseMode,
} from "@/store/atoms/purchase-mode";

const getPurchaseLabel = (
  value: ReturnType<typeof usePurchaseMode>["value"]
): string => {
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

export const AmountToBuy = () => {
  const amount = usePurchaseMode();

  if (!amount) {
    return null;
  }

  const label = getPurchaseLabel(amount.value);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="w-14"
          onClick={toggleAmountToBuy}
          size="icon-md"
          variant="cream"
        >
          <span>
            <NumberText
              className={cn(
                "font-semibold text-xl capitalize",
                borderedText({ variant: "default" })
              )}
            >
              {`${amount.value}${amount.symbol}`}
            </NumberText>
          </span>

          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>

      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
