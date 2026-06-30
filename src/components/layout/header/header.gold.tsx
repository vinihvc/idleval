import React from "react";

import { Coin } from "@/components/icons/coin";
import { Button } from "@/components/ui/button";
import { FormattedNumber } from "@/components/ui/formatted-number";
import {
  Progress,
  ProgressRange,
  ProgressTrack,
} from "@/components/ui/progress";
import { borderedText } from "@/components/ui/text-border";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPlayerLevelProgress } from "@/game/player-level";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { useMissionsState } from "@/store/atoms/missions.atom";
import { usePlayerLevel } from "@/store/atoms/missions.selectors";
import { useWallet } from "@/store/atoms/wallet";

const LazyStatisticsDialog = React.lazy(() =>
  import("@/components/dialog/statistics/statistics").then((module) => ({
    default: module.StatisticsDialog,
  }))
);

export const HeaderGold = () => {
  const { gold } = useWallet();
  const playerLevel = usePlayerLevel();
  const { renownPercent } = useMissionsState();
  const progressLabelId = React.useId();
  const levelProgressPercent = Math.round(
    getPlayerLevelProgress(playerLevel) * 100
  );
  const levelLabel = m["ui.playerLevel.label"]({ level: String(playerLevel) });

  return (
    <>
      <div className="flex min-w-0 max-w-[40vw] items-center gap-2 sm:max-w-none">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex w-full min-w-14 shrink-0 flex-col gap-0.5">
              <p
                className={cn(
                  "rounded-md border border-primary/40 bg-popover px-2 py-1 text-center font-bold font-number text-muted text-sm tabular-nums",
                  borderedText({ variant: "default", size: "sm" })
                )}
              >
                {levelLabel}
              </p>

              <Progress
                aria-labelledby={progressLabelId}
                className={cn(
                  "inset-shadow-xs h-1.5 w-full shrink-0 overflow-hidden rounded-sm border border-primary/40 bg-muted px-0 py-0",
                  "gap-0 leading-none"
                )}
                value={levelProgressPercent}
              >
                <ProgressTrack className="absolute inset-0 min-h-0 overflow-hidden bg-transparent">
                  <ProgressRange className="h-full bg-primary" />
                </ProgressTrack>
              </Progress>

              <span className="sr-only" id={progressLabelId}>
                {m["ui.playerLevel.progressA11y"]({
                  percent: String(levelProgressPercent),
                })}
              </span>

              <span className="sr-only">
                {m["ui.playerLevel.a11y"]({ level: String(playerLevel) })}
              </span>
            </div>
          </TooltipTrigger>

          <TooltipContent className="max-w-xs text-center">
            <p>
              {m["ui.playerLevel.tooltip"]({
                level: String(playerLevel),
                percent: String(levelProgressPercent),
              })}
            </p>
            {renownPercent > 0 ? (
              <p className="mt-1 text-muted-foreground text-xs">
                {m["ui.renown.activeBonus"]({
                  percent: String(renownPercent),
                })}
              </p>
            ) : null}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="min-w-32 max-w-full translate-x-2 justify-end bg-popover px-0 pr-2 [-webkit-text-stroke-width:0]"
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
                  "min-w-0 font-bold font-number text-lg text-muted tabular-nums tracking-normal sm:text-xl",
                  borderedText({ variant: "default", size: "sm" })
                )}
              >
                <FormattedNumber isDollar value={gold} />
              </span>

              <span className="sr-only">{m["ui.statistics.title"]()}</span>
            </Button>
          </TooltipTrigger>

          <TooltipContent>{m["ui.statistics.title"]()}</TooltipContent>
        </Tooltip>
      </div>

      <React.Suspense fallback={null}>
        <LazyStatisticsDialog />
      </React.Suspense>
    </>
  );
};
