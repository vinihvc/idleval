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
  type MissionId,
} from "@/content/missions";
import type { MissionSlotView } from "@/game/types";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { formatMissionProgressLabel } from "./format-mission-progress";
import { MissionObjectiveLabel } from "./mission-objective";

const missionSlotVariants = tv({
  base: [
    "relative flex min-w-0 flex-1 basis-0 flex-col gap-0.5 rounded-md border-2 p-0.5",
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
  onOpen: (missionId: MissionId) => void;
  slot: MissionSlotView;
}

export const MissionsCard = (props: MissionsCardProps) => {
  const { slot, onOpen, className, ...rest } = props;
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
  const ariaLabel =
    status === "ready"
      ? m["ui.missions.slot.claimable"]({
          order: String(slot.order),
          title: objectiveLabel,
        })
      : m["ui.missions.slot.inProgress"]({
          order: String(slot.order),
          title: objectiveLabel,
          progress: progressLabel,
        });

  return (
    <button
      aria-label={ariaLabel}
      className={cn(missionSlotVariants({ status }), className)}
      data-slot="mission-slot"
      data-status={status}
      onClick={() => onOpen(missionId)}
      type="button"
      {...rest}
    >
      {objective ? (
        <MissionObjectiveLabel
          className="w-full min-w-0"
          objective={objective}
        />
      ) : (
        <span className="w-full min-w-0 truncate text-xs">
          {objectiveLabel}
        </span>
      )}
      <Progress
        aria-hidden
        className={cn(
          "inset-shadow-xs h-4 w-full shrink-0 gap-0 overflow-hidden rounded-sm border px-0 py-0",
          status === "ready"
            ? "border-success-foreground/40 bg-success"
            : "border-primary/40 bg-muted"
        )}
        value={Math.round(slot.progress.ratio * 100)}
      >
        <ProgressTrack className="absolute inset-0 min-h-0 overflow-hidden bg-transparent">
          <ProgressRange
            className={cn(
              "h-full",
              status === "ready" ? "bg-transparent" : "bg-primary"
            )}
          />
        </ProgressTrack>
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            "flex items-center justify-center px-0.5",
            "font-medium font-number text-xs tabular-nums tracking-wide",
            "truncate text-nowrap",
            status === "ready" ? "text-white" : "text-foreground",
            borderedText({
              variant: status === "ready" ? "green" : "cream",
              size: "sm",
            })
          )}
        >
          {progressLabel}
        </div>
      </Progress>
    </button>
  );
};
