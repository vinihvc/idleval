import React from "react";

import { Coin } from "@/components/icons/coin";
import { FormattedNumber } from "@/components/ui/formatted-number";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { borderedText } from "@/components/ui/text-border";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { useWallet } from "@/store/atoms/wallet";

const LazyStatisticsDialog = React.lazy(
  () => import("@/components/dialog/statistics/statistics")
);

export const HeaderGold = () => {
  const { gold } = useWallet();

  return (
    <React.Suspense fallback={null}>
      <LazyStatisticsDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <ResponsiveDialogTrigger asChild>
              <button
                className="relative inset-shadow-xs flex h-8 min-w-32 translate-x-2 items-center justify-end whitespace-nowrap rounded-md border-3 border-primary bg-popover pr-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                type="button"
              >
                <Coin
                  aria-hidden
                  className="absolute top-0 -left-2.5 size-10 shrink-0 -translate-y-2 drop-shadow-md"
                />

                <span
                  className={cn(
                    "font-bold font-number text-lg text-muted tabular-nums sm:text-xl",
                    borderedText({ variant: "default" })
                  )}
                >
                  <FormattedNumber isDollar value={gold} />
                </span>

                <span className="sr-only">{m["ui.statistics.title"]()}</span>
              </button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>

          <TooltipContent>{m["ui.statistics.title"]()}</TooltipContent>
        </Tooltip>
      </LazyStatisticsDialog>
    </React.Suspense>
  );
};
