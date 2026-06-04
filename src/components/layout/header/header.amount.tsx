import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { toggleAmountToBuy, useMsc } from "@/store/atoms/msc";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

export const AmountToBuy = () => {
  const amount = useMsc();

  if (!amount) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="w-14"
          onClick={toggleAmountToBuy}
          size="icon"
          variant="white"
        >
          <span>
            <span
              className={cn(
                "font-semibold text-base",
                amount.value === "max" && "uppercase"
              )}
            >
              {`${amount.value}${amount.symbol}`}
            </span>
          </span>

          <span className="sr-only">
            {`You are buying ${amount.description} at once`}
          </span>
        </Button>
      </TooltipTrigger>

      <TooltipContent>{`Buy ${amount.description} at once`}</TooltipContent>
    </Tooltip>
  );
};
