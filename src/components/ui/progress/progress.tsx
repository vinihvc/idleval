import type React from "react";
import { borderedText } from "@/components/ui/text-border";
import type { FactoryType } from "@/content/factories";
import { cn } from "@/lib/cn";
import { totalToEarnAfterProduce, useFactory } from "@/store/atoms/factories";
import {
  amountFormatterWithDolarSign,
  timeFormatter,
} from "@/utils/formatters";
import classes from "./progress.module.css";

interface ProgressProps extends React.ComponentProps<"div"> {
  /**
   * The factory type
   */
  factoryType: FactoryType;
  /**
   * If `true`, add striped animation to the progress bar.
   *
   * @default false
   */
  isAutomated?: boolean;
  /**
   * If `true`, the progress bar will be animated.
   *
   * @default false
   */
  isUnlocked?: boolean;
  /**
   * Current progress value (seconds remaining)
   */
  value?: number;
}

export const Progress = (props: ProgressProps) => {
  const {
    factoryType,
    value,
    isAutomated = false,
    isUnlocked = false,
    className,
    ...rest
  } = props;

  const { productionTime } = useFactory(factoryType);

  const animationDuration = `${productionTime + (isAutomated ? 0 : 1)}s`;

  return (
    <div
      aria-valuenow={value}
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
        style={{ animationDuration }}
      />

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-between px-2 font-semibold text-foreground text-lg tracking-wide",
          borderedText({ variant: "white" })
        )}
        style={{ animationDuration }}
      >
        <span className="w-40 font-number tabular-nums">
          {timeFormatter(productionTime)}
        </span>
        <span className="font-number tabular-nums">
          {amountFormatterWithDolarSign(totalToEarnAfterProduce(factoryType))}
        </span>
      </div>
    </div>
  );
};
