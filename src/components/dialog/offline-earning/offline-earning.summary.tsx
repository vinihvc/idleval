import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { NumberText } from "@/components/ui/number-text";
import { m } from "@/i18n/messages";
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

  return (
    <ParaglideMessage
      inputs={{
        "0": formatElapsedDuration(summary.elapsedMs),
        "1": amountFormatterWithDolarSign(summary.totalGold),
      }}
      markup={{
        duration: ({ children }) => (
          <span className="font-number text-2xl">{children}</span>
        ),
        amount: ({ children }) => (
          <NumberText className="text-2xl text-primary">{children}</NumberText>
        ),
      }}
      message={m["ui.offline.summary"]}
    />
  );
};
