import React from "react";
import type { MissionDefinition } from "@/content/missions";
import { getMissionById } from "@/content/missions";
import type { MissionSlotView } from "@/game/types";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { useVisibleMissionSlots } from "@/store/atoms/missions";
import { MissionsCard } from "./missions.card";

const LazyMissionDialog = React.lazy(() =>
  import("@/components/dialog/mission/mission").then((module) => ({
    default: module.MissionDialog,
  }))
);

interface MissionInProgressSlotProps {
  mission: MissionDefinition;
  onClaim: () => void;
  slot: MissionSlotView;
}

const MissionInProgressSlot = (props: MissionInProgressSlotProps) => {
  const { mission, onClaim, slot } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <MissionsCard
        className="h-full w-full"
        onClaim={onClaim}
        onClick={() => setOpen(true)}
        slot={slot}
      />

      {open ? (
        <React.Suspense fallback={null}>
          <LazyMissionDialog
            mission={mission}
            onOpenChange={setOpen}
            open={open}
            progress={slot.progress}
            status={slot.status}
          />
        </React.Suspense>
      ) : null}
    </>
  );
};

export const Missions = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  const slots = useVisibleMissionSlots();
  const { announce, message } = useLiveAnnouncer();

  return (
    <>
      <div
        className={cn(
          "mx-auto grid w-full grid-cols-3 items-stretch gap-2",
          className
        )}
        data-slot="mission-slots"
        {...rest}
      >
        {slots.map((slot) => {
          const mission = getMissionById(slot.id);

          if (!mission) {
            return null;
          }

          const onClaim = () => announce(m["ui.a11y.missionClaimed"]());

          if (slot.status === "ready") {
            return (
              <div className="min-w-0" key={slot.id}>
                <MissionsCard
                  className="h-full w-full"
                  onClaim={onClaim}
                  slot={slot}
                />
              </div>
            );
          }

          return (
            <div className="min-w-0" key={slot.id}>
              <MissionInProgressSlot
                mission={mission}
                onClaim={onClaim}
                slot={slot}
              />
            </div>
          );
        })}
      </div>

      <LiveAnnouncer message={message} />
    </>
  );
};
