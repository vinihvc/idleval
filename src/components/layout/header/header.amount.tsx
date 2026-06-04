import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleAmountToBuy, useMsc } from "@/store/atoms/msc";

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
          size="icon-md"
          variant="white"
        >
          <span>
            <NumberText className="font-semibold text-xl capitalize">
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
