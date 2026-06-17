import type React from "react";
import {
  Progress,
  ProgressRange,
  ProgressTrack,
} from "@/components/ui/progress";
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

  const { factoryType, progress, productionTime, remainingSec, isAutomated } =
    useFactoryCard();

  const totalEarn = useTotalToEarnAfterProduce(factoryType);
  const progressValue = progress * productionTime;
  const ariaValueText = m["ui.factoryCard.remainingEarns"]({
    "0": timeFormatter(remainingSec),
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
      value={progressValue}
      {...rest}
    >
      <ProgressTrack
        className="absolute inset-0 min-h-0 overflow-hidden bg-transparent"
        data-slot="factory-card-progress-track"
      >
        <ProgressRange
          className="transition-none motion-reduce:transition-none!"
          data-slot="factory-card-progress-range"
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
          {timeFormatter(remainingSec)}
        </span>
        <span
          className={cn(
            "min-w-0 shrink text-right font-number tabular-nums",
            borderedText({ variant: "cream" })
          )}
        >
          {amountFormatterWithDolarSign(totalEarn)}
        </span>
      </div>
    </Progress>
  );
};
