import React from "react";
import {
  formatMissionProgressLabel,
  getMissionProgressBarPercent,
} from "@/components/missions/format-mission-progress";
import { MissionObjectiveLabel } from "@/components/missions/mission-objective";
import type { MissionDefinition } from "@/content/missions";
import {
  getScaledMissionObjective,
  getScaledMissionRewards,
} from "@/game/missions";
import type { MissionProgress, MissionSlotStatus } from "@/game/types";
import { m } from "@/i18n/messages";
import { useGods } from "@/store/atoms/gods";
import { MissionRewardItem } from "./mission.reward-item";
import { MissionProressbar } from "./mission.status";

export interface MissionClaimContentProps {
  mission: MissionDefinition;
  progress: MissionProgress;
  status: MissionSlotStatus;
}

export const MissionClaimContent = (props: MissionClaimContentProps) => {
  const { mission, progress, status } = props;

  const rewardsHeadingId = React.useId();

  const { count: godsInvoked } = useGods();

  const isReady = status === "ready";
  const scaledObjective = getScaledMissionObjective(
    mission.objective,
    godsInvoked
  );
  const scaledRewards = getScaledMissionRewards(mission.rewards, godsInvoked);
  const progressLabel = formatMissionProgressLabel(scaledObjective, progress);

  return (
    <div className="flex flex-col gap-4" data-slot="mission-claim-content">
      <MissionObjectiveLabel objective={scaledObjective} size="dialog" />

      <div className="space-y-2 text-left">
        <div className="flex items-center justify-between gap-3">
          <p
            className="min-w-0 truncate font-semibold text-muted text-xl tracking-wide"
            id={rewardsHeadingId}
          >
            {m["ui.missions.rewards"]()}
          </p>
          {isReady ? null : (
            <MissionProressbar
              label={progressLabel}
              value={getMissionProgressBarPercent(progress.ratio)}
            />
          )}
        </div>
        <ul
          aria-labelledby={rewardsHeadingId}
          className="flex min-w-0 list-none flex-col gap-2 font-number text-xl tabular-nums"
        >
          {scaledRewards.map((reward) => (
            <MissionRewardItem
              key={`${reward.type}-${JSON.stringify(reward)}`}
              reward={reward}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
