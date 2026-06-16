import React from "react";
import type { MissionId } from "@/content/missions";
import type { MissionProgress, MissionSlotView } from "@/game/types";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { useVisibleMissionSlots } from "@/store/atoms/missions";
import { MissionsCard } from "./missions.card";

const MissionClaimDialog = React.lazy(
  () => import("@/components/dialog/mission/mission")
);

export const Missions = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  const slots = useVisibleMissionSlots();
  const { announce, message } = useLiveAnnouncer();
  const [selectedMission, setSelectedMission] = React.useState<{
    id: MissionId;
    status: MissionSlotView["status"];
    progress: MissionProgress;
  } | null>(null);

  const openMission = (missionId: MissionId) => {
    const slot = slots.find((entry) => entry.id === missionId);

    if (!slot) {
      return;
    }

    setSelectedMission({
      id: missionId,
      status: slot.status,
      progress: slot.progress,
    });
  };

  return (
    <>
      <div
        className={cn(
          "mx-auto flex w-full items-stretch justify-center gap-2",
          className
        )}
        data-slot="mission-slots"
        {...rest}
      >
        {slots.map((slot) => (
          <MissionsCard
            key={slot.id}
            onClaim={() => announce(m["ui.a11y.missionClaimed"]())}
            onOpen={openMission}
            slot={slot}
          />
        ))}
      </div>

      <LiveAnnouncer message={message} />

      <MissionClaimDialog
        missionId={selectedMission?.id ?? null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMission(null);
          }
        }}
        open={selectedMission !== null}
        progress={selectedMission?.progress ?? null}
        status={selectedMission?.status ?? "in_progress"}
      />
    </>
  );
};
