import { useId } from "react";
import { formatMissionProgressLabel } from "@/components/game/missions/format-mission-progress";
import { MissionObjectiveLabel } from "@/components/game/missions/mission-objective";
import type { MissionId } from "@/content/missions";
import { getMissionById } from "@/content/missions";
import type { MissionProgress, MissionSlotStatus } from "@/game/types";
import { m } from "@/i18n/messages";
import { MissionRewardItem } from "./mission.reward-item";
import { MissionProressbar } from "./mission.status";

export interface MissionClaimContentProps {
  missionId: MissionId;
  progress: MissionProgress;
  status: MissionSlotStatus;
}

export const MissionClaimContent = (props: MissionClaimContentProps) => {
  const { missionId, progress, status } = props;

  const rewardsHeadingId = useId();
  const mission = getMissionById(missionId);

  if (!mission) {
    return null;
  }

  const isReady = status === "ready";
  const progressLabel = formatMissionProgressLabel(mission.objective, progress);

  return (
    <div className="flex flex-col gap-4" data-slot="mission-claim-content">
      <MissionObjectiveLabel objective={mission.objective} size="dialog" />

      <div className="space-y-2 text-left">
        <div className="flex items-center justify-between gap-3">
          <p
            className="shrink-0 font-semibold text-muted text-xl tracking-wide"
            id={rewardsHeadingId}
          >
            {m["ui.missions.rewards"]()}
          </p>
          {isReady ? null : (
            <MissionProressbar
              label={progressLabel}
              value={Math.round(progress.ratio * 100)}
            />
          )}
        </div>
        <ul
          aria-labelledby={rewardsHeadingId}
          className="flex list-none flex-col gap-2 font-number text-xl tabular-nums"
        >
          {mission.rewards.map((reward) => (
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
