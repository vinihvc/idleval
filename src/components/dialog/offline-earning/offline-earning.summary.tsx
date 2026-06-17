import { Clock } from "pixelarticons/react/Clock";
import { boxBorder } from "@/components/ui/box-border";
import { NumberText } from "@/components/ui/number-text";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import type { OfflineSummary } from "@/store/offline-earning";
import {
  amountFormatterWithDolarSign,
  formatElapsedDuration,
} from "@/utils/formatters";

interface OfflineEarningSummaryProps {
  /**
   * The summary of the offline earning
   */
  summary: OfflineSummary;
}

export const OfflineEarningSummary = (props: OfflineEarningSummaryProps) => {
  const { summary } = props;

  const duration = formatElapsedDuration(summary.elapsedMs);
  const amount = amountFormatterWithDolarSign(summary.totalGold);

  return (
    <div className="flex flex-col items-center gap-5 text-center sm:pb-2">
      <p className="sr-only">
        {m["ui.offline.summaryA11y"]({ 0: duration, 1: amount })}
      </p>

      <div
        className="flex flex-col items-center gap-1.5 text-lg text-popover-foreground"
        data-slot="offline-earning-duration"
      >
        <p className="font-semibold tracking-wide">
          {m["ui.offline.durationLabel"]()}
        </p>
        <div className="flex items-center justify-center gap-2">
          <Clock
            aria-hidden
            className="size-5 shrink-0 text-popover-foreground"
          />
          <NumberText
            className="text-3xl text-popover-foreground sm:text-4xl"
            size="sm"
            variant="default"
          >
            {duration}
          </NumberText>
        </div>
      </div>

      <div
        className={cn(
          "flex w-full flex-col items-center gap-2.5 rounded-xl border-2 border-secondary bg-card px-4 py-4",
          boxBorder({ variant: "brown" })
        )}
        data-slot="offline-earning-gold"
      >
        <p className="font-semibold tracking-wide">
          {m["ui.offline.earnedLabel"]()}
        </p>
        <NumberText className="text-5xl text-primary" size="lg" variant="cream">
          {amount}
        </NumberText>
      </div>
    </div>
  );
};
