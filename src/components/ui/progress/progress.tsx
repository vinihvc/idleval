import type React from "react";
import { borderedText } from "@/components/ui/text-border";
import type { FactoryType } from "@/content/factories";
import { cn } from "@/lib/cn";
import {
  useFactory,
  useTotalToEarnAfterProduce,
} from "@/store/atoms/factories";
import {
  amountFormatterWithDolarSign,
  timeFormatter,
} from "@/utils/formatters";
import classes from "./progress.module.css";

interface ProgressProps extends React.ComponentProps<"div"> {
  cycleKey?: number;
  factoryType: FactoryType;
  isAutomated?: boolean;
  isUnlocked?: boolean;
  value?: number;
}

export const Progress = (props: ProgressProps) => {
  const {
    factoryType,
    value = 0,
    cycleKey = 0,
    isAutomated = false,
    isUnlocked = false,
    className,
    ...rest
  } = props;

  const { productionTime } = useFactory(factoryType);
  const totalEarn = useTotalToEarnAfterProduce(factoryType);

  const animationDuration = `${productionTime}s`;
  const elapsed = productionTime - value;

  return (
    <div
      aria-valuemax={productionTime}
      aria-valuemin={0}
      aria-valuenow={elapsed}
      aria-valuetext={`${timeFormatter(elapsed)} remaining, earns ${amountFormatterWithDolarSign(totalEarn)}`}
      className={cn(
        "group relative inset-shadow-xs h-7 w-full overflow-hidden rounded-md border-3 border-primary/40 bg-muted",
        className
      )}
      data-auto={isAutomated}
      role="progressbar"
      {...rest}
    >
      <div
        className={cn(
          "h-full w-0 flex-1 bg-primary",
          isUnlocked && classes.fill
        )}
        key={cycleKey}
        style={{ animationDuration }}
      />

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-between px-2 font-semibold text-foreground text-lg tracking-wide",
          borderedText({ variant: "cream" })
        )}
      >
        <span className="w-40 font-number tabular-nums">
          {timeFormatter(productionTime)}
        </span>
        <span className="font-number tabular-nums">
          {amountFormatterWithDolarSign(totalEarn)}
        </span>
      </div>
    </div>
  );
};
