import type React from "react";
import { Progress, ProgressTrack } from "@/components/ui/progress";
import { borderedText } from "@/components/ui/text-border";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { useTotalToEarnAfterProduce } from "@/store/atoms/factories";
import {
  amountFormatterWithDolarSign,
  timeFormatter,
} from "@/utils/formatters";
import { useFactoryCard } from "./factory-card.context";

interface FactoryCardProgressProps
  extends React.ComponentProps<typeof Progress> {}

export const FactoryCardProgress = (props: FactoryCardProgressProps) => {
  const { className, ...rest } = props;

  const {
    factoryType,
    cycleKey,
    seconds,
    productionTime,
    isRunning,
    isUnlocked,
    isAutomated,
  } = useFactoryCard();

  const totalEarn = useTotalToEarnAfterProduce(factoryType);
  const isAnimating = isUnlocked && isRunning;
  const elapsed = productionTime - seconds;
  const animationDuration = `${productionTime}s`;
  const ariaValueText = m["ui.factoryCard.remainingEarns"]({
    "0": timeFormatter(elapsed),
    "1": amountFormatterWithDolarSign(totalEarn),
  });

  return (
    <Progress
      aria-valuetext={ariaValueText}
      className={cn(
        "group relative inset-shadow-xs h-7 w-full gap-0 overflow-hidden rounded-md border-3 border-primary/40 bg-muted",
        className
      )}
      data-auto={isAutomated}
      data-slot="factory-card-progress"
      max={productionTime}
      min={0}
      value={elapsed}
      {...rest}
    >
      <ProgressTrack
        className="absolute inset-0 min-h-0 overflow-hidden bg-transparent"
        data-slot="factory-card-progress-track"
      >
        <div
          aria-hidden
          className={cn(
            "h-full w-0 bg-primary",
            isAnimating && "animate-progress-fill"
          )}
          key={cycleKey}
          style={{ animationDuration }}
        />
      </ProgressTrack>

      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          "flex items-center justify-between",
          "px-2",
          "font-semibold text-foreground text-lg tracking-wide",
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
    </Progress>
  );
};
