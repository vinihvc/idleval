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

export const FactoryCardProgress = (
  props: React.ComponentProps<typeof Progress>
) => {
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
  const remainingTime = isAnimating ? seconds : productionTime;
  const animationDuration = `${productionTime}s`;
  const ariaValueText = m["ui.factoryCard.remainingEarns"]({
    "0": timeFormatter(remainingTime),
    "1": amountFormatterWithDolarSign(totalEarn),
  });

  return (
    <Progress
      aria-valuetext={ariaValueText}
      className={cn(
        "group inset-shadow-xs h-7 gap-0 overflow-hidden rounded-md border-3 border-primary/40 bg-muted",
        className
      )}
      data-auto={isAutomated}
      data-slot="factory-card-progress"
      max={productionTime}
      min={0}
      value={productionTime - seconds}
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
          "absolute inset-0",
          "flex items-center justify-between",
          "px-2",
          "font-semibold text-foreground text-lg tracking-wide",
          "pointer-events-none",
          "text-nowrap"
        )}
      >
        <span
          className={cn(
            "shrink-0 font-number tabular-nums",
            borderedText({ variant: "cream" })
          )}
        >
          {timeFormatter(remainingTime)}
        </span>
        <span
          className={cn(
            "min-w-0 text-right font-number tabular-nums",
            borderedText({ variant: "cream", truncateSafe: true })
          )}
        >
          {amountFormatterWithDolarSign(totalEarn)}
        </span>
      </div>
    </Progress>
  );
};
