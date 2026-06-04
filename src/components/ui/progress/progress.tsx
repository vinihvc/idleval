import type * as React from "react";
import type { FactoryType } from "@/content/factories";
import { cn } from "@/lib/cn";
import { totalToEarnAfterProduce, useFactory } from "@/store";
import {
  amountFormatterWithDolarSign,
  timeFormatter,
} from "@/utils/formatters";
import { borderedText } from "../text-border";
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
        "group relative h-6 w-full overflow-hidden rounded-full border border-foreground/50 bg-background",
        className
      )}
      data-auto={isAutomated}
      role="progressbar"
      {...rest}
    >
      <div
        className={cn(
          "h-full w-0 flex-1 bg-blue-600",
          isUnlocked && classes.fill
        )}
        style={{ animationDuration }}
      />

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-between px-3 font-semibold text-background text-sm tracking-wide",
          borderedText({ variant: "blue" })
        )}
      >
        <span className="w-40 text-xs">{timeFormatter(productionTime)}</span>
        <span>
          {amountFormatterWithDolarSign(totalToEarnAfterProduce(factoryType))}
        </span>
      </div>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-between px-3 font-semibold text-foreground text-sm tracking-wide",
          borderedText({ variant: "white" }),
          isUnlocked && classes.clip
        )}
        style={{ animationDuration }}
      >
        <span className="w-40 text-xs">{timeFormatter(productionTime)}</span>
        <span>
          {amountFormatterWithDolarSign(totalToEarnAfterProduce(factoryType))}
        </span>
      </div>
    </div>
  );
};
