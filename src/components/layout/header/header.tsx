import { Trans } from "@lingui/react/macro";
import type React from "react";
import { SettingsDialog } from "@/components/dialog/settings";
import { StatisticsDialog } from "@/components/dialog/statistics";
import { Coin } from "@/components/icons/coin";
import { HeaderNavigation } from "@/components/layout/navigation";
import { FormattedNumber } from "@/components/ui/formatted-number";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { borderedText } from "@/components/ui/text-border";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { useWallet } from "@/store/atoms/wallet";
import { AmountToBuy } from "./header.amount";

interface HeaderProps extends React.ComponentProps<"header"> {}

export const Header = (props: HeaderProps) => {
  const { className, ...rest } = props;

  const { gold } = useWallet();

  return (
    <header
      className={cn(
        "z-50 flex shrink-0 items-center justify-between border-primary border-b-2 bg-secondary/90 p-3 backdrop-blur-md",
        "max-sm:pt-[calc(var(--spacing)*3+env(safe-area-inset-top,0))]",
        "sm:sticky sm:top-0",
        className
      )}
      {...rest}
    >
      <StatisticsDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <ResponsiveDialogTrigger asChild>
              <button
                className="relative inset-shadow-xs flex h-8 min-w-32 translate-x-2 cursor-pointer items-center justify-end whitespace-nowrap rounded-md border-3 border-primary bg-popover pr-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                type="button"
              >
                <Coin
                  aria-hidden
                  className="absolute top-0 -left-2 size-10 shrink-0 -translate-y-1.5 drop-shadow-md"
                />

                <span
                  className={cn(
                    "font-bold font-number text-muted text-xl tabular-nums",
                    borderedText({ variant: "default" })
                  )}
                >
                  <FormattedNumber isDollar value={gold} />
                </span>

                <span className="sr-only">
                  <Trans>Statistics</Trans>
                </span>
              </button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>

          <TooltipContent>
            <Trans>Statistics</Trans>
          </TooltipContent>
        </Tooltip>
      </StatisticsDialog>

      <HeaderNavigation />

      <nav className="flex gap-2">
        <AmountToBuy />
        <SettingsDialog />
      </nav>
    </header>
  );
};
