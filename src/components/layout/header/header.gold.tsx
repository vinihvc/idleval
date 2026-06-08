import { StatisticsDialog } from "@/components/dialog/statistics";
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

export const HeaderGold = () => {
  const { gold } = useWallet();

  return (
    <StatisticsDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveDialogTrigger asChild>
            <button
              className="relative inset-shadow-xs flex h-7 min-w-32 translate-x-2 items-center justify-end whitespace-nowrap rounded-md border-3 border-primary bg-popover pr-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-8"
              type="button"
            >
              <Coin
                aria-hidden
                className="absolute top-0 -left-2 size-10 shrink-0 -translate-y-1.5 drop-shadow-md max-sm:size-8"
              />

              <span
                className={cn(
                  "font-bold font-number text-muted text-xl tabular-nums max-sm:text-lg",
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
    </StatisticsDialog>
  );
};
