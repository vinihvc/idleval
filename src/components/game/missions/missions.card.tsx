import type React from "react";
import { tv } from "tailwind-variants";
import { boxBorder } from "@/components/ui/box-border";
import {
  Progress,
  ProgressRange,
  ProgressTrack,
} from "@/components/ui/progress";
import { borderedText } from "@/components/ui/text-border";
import {
  getLocalizedMissionObjective,
  getMissionById,
} from "@/content/missions";
import type { MissionSlotView } from "@/game/types";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { claimMissionReward } from "@/store/atoms/missions";
import { formatMissionProgressLabel } from "./format-mission-progress";
import { MissionObjectiveLabel } from "./mission-objective";

const missionSlotVariants = tv({
  base: [
    "relative flex h-full w-full min-w-0 flex-col gap-0.5 rounded-md border-2 p-0.5",
    "text-left transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    boxBorder({ variant: "default", size: "sm" }),
  ],
  variants: {
    status: {
      in_progress: [
        "border-primary/90 bg-card text-card-foreground",
        boxBorder({ variant: "cream", size: "sm" }),
      ],
      ready: [
        "border-success/90 bg-card text-card-foreground",
        boxBorder({ variant: "green", size: "sm" }),
      ],
      claimed: [
        "border-primary/50 bg-muted/80 text-muted-foreground opacity-60",
        boxBorder({ variant: "default", size: "sm" }),
      ],
    },
  },
  defaultVariants: {
    status: "in_progress",
  },
});

interface MissionsCardProps
  extends Omit<React.ComponentProps<"button">, "onClick" | "slot"> {
  onClaim?: () => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  slot: MissionSlotView;
}

const MissionObjectiveContent = (props: {
  objective:
    | NonNullable<ReturnType<typeof getMissionById>>["objective"]
    | undefined;
  objectiveLabel: string;
}) => {
  const { objective, objectiveLabel } = props;

  if (objective) {
    return (
      <MissionObjectiveLabel className="w-full min-w-0" objective={objective} />
    );
  }

  return (
    <span className="w-full min-w-0 truncate text-xs">{objectiveLabel}</span>
  );
};

const missionSlotFooterClassName =
  "inset-shadow-xs h-4 max-h-4 min-h-4 w-full shrink-0 overflow-hidden rounded-sm border-2 px-0.5 py-0 leading-none";

const MissionSlotProgress = (props: {
  progressLabel: string;
  ratio: number;
}) => {
  const { progressLabel, ratio } = props;

  return (
    <Progress
      aria-hidden
      className={cn(
        missionSlotFooterClassName,
        "gap-0 border-primary/40 bg-muted px-0"
      )}
      value={Math.round(ratio * 100)}
    >
      <ProgressTrack className="absolute inset-0 min-h-0 overflow-hidden bg-transparent">
        <ProgressRange className="h-full bg-primary" />
      </ProgressTrack>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          "flex items-center justify-center px-0.5",
          "font-medium font-number text-foreground text-xs tabular-nums tracking-wide",
          "truncate text-nowrap",
          borderedText({ variant: "cream", size: "sm" })
        )}
      >
        {progressLabel}
      </div>
    </Progress>
  );
};

const MissionSlotClaimFooter = () => (
  <div
    aria-hidden
    className={cn(
      missionSlotFooterClassName,
      "flex items-center justify-center border-success-foreground/40 bg-success text-white",
      "font-medium text-xs tracking-wide",
      borderedText({ variant: "green", size: "sm" })
    )}
  >
    <span className="block w-full truncate text-center">
      {m["ui.missions.claim"]()}
    </span>
  </div>
);

export const MissionsCard = (props: MissionsCardProps) => {
  const { slot, onClaim, className, ref, onClick, ...rest } = props;

  const { id: missionId, status } = slot;
  const missionDefinition = getMissionById(missionId);
  const objective = missionDefinition?.objective;
  const objectiveLabel = objective
    ? getLocalizedMissionObjective(objective)
    : missionId;
  const progressLabel = objective
    ? formatMissionProgressLabel(objective, slot.progress)
    : m["ui.missions.progress"]({
        current: String(slot.progress.current),
        target: String(slot.progress.target),
      });
  const slotClassName = cn(missionSlotVariants({ status }), className);
  const isReady = status === "ready";
  const ariaLabel = isReady
    ? m["ui.missions.slot.claimable"]({
        order: String(slot.order),
        title: objectiveLabel,
      })
    : m["ui.missions.slot.inProgress"]({
        order: String(slot.order),
        title: objectiveLabel,
        progress: progressLabel,
      });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isReady) {
      if (claimMissionReward(missionId)) {
        onClaim?.();
      }

      return;
    }

    onClick?.(event);
  };

  return (
    <button
      aria-label={ariaLabel}
      className={slotClassName}
      data-slot="mission-slot"
      data-status={status}
      onClick={handleClick}
      ref={ref}
      type="button"
      {...rest}
    >
      <div className="flex min-h-0 flex-1 items-start">
        <MissionObjectiveContent
          objective={objective}
          objectiveLabel={objectiveLabel}
        />
      </div>
      {isReady ? (
        <MissionSlotClaimFooter />
      ) : (
        <MissionSlotProgress
          progressLabel={progressLabel}
          ratio={slot.progress.ratio}
        />
      )}
    </button>
  );
};
