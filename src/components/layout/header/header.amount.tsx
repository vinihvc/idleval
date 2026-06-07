import { Trans } from "@lingui/react/macro";
import type React from "react";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import { borderedText } from "@/components/ui/text-border";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import {
  toggleAmountToBuy,
  usePurchaseMode,
} from "@/store/atoms/purchase-mode";

const getPurchaseLabel = (
  value: ReturnType<typeof usePurchaseMode>["value"]
): React.ReactNode => {
  if (value === 1) {
    return (
      <Trans id="purchase.mode.1">Purchase 1 unit in one stroke</Trans>
    );
  }

  if (value === 10) {
    return (
      <Trans id="purchase.mode.10pct">
        Purchase 10% of your gold in one stroke
      </Trans>
    );
  }

  if (value === 50) {
    return (
      <Trans id="purchase.mode.50pct">
        Purchase 50% of your gold in one stroke
      </Trans>
    );
  }

  return (
    <Trans id="purchase.mode.max">
      Purchase all you can afford in one stroke
    </Trans>
  );
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
