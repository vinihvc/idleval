import React from "react";

import { Coin } from "@/components/icons/coin";
import { Button } from "@/components/ui/button";
import { FormattedNumber } from "@/components/ui/formatted-number";
import { borderedText } from "@/components/ui/text-border";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { useWallet } from "@/store/atoms/wallet";

const LazyStatisticsDialog = React.lazy(
  () => import("@/components/dialog/statistics/statistics")
);

export const HeaderGold = () => {
  const { gold } = useWallet();

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="min-w-32 translate-x-2 justify-end bg-popover px-0 pr-2"
            clickEffect={false}
            onClick={() => toggleDialog(DIALOG_IDS.statistics)}
            size="sm"
            variant="cream"
          >
            <Coin
              aria-hidden
              className="absolute top-0 -left-2.5 size-10 shrink-0 -translate-y-2 drop-shadow-md"
              intrinsicSize={40}
            />

            <span
              className={cn(
                "font-bold font-number text-lg text-muted tabular-nums tracking-normal sm:text-xl",
                borderedText({ variant: "default" })
              )}
            >
              <FormattedNumber isDollar value={gold} />
            </span>

            <span className="sr-only">{m["ui.statistics.title"]()}</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent>{m["ui.statistics.title"]()}</TooltipContent>
      </Tooltip>

      <React.Suspense fallback={null}>
        <LazyStatisticsDialog />
      </React.Suspense>
    </>
  );
};
