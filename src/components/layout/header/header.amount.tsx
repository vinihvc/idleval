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

export const AmountToBuy = () => {
  const amount = usePurchaseMode();

  if (!amount) {
    return null;
  }

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

          <span className="sr-only">
            {`Purchase ${amount.description} in one stroke`}
          </span>
        </Button>
      </TooltipTrigger>

      <TooltipContent>{`Purchase ${amount.description} in one stroke`}</TooltipContent>
    </Tooltip>
  );
};
