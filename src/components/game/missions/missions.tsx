import type React from "react";
import MissionClaimDialog from "@/components/dialog/mission/mission";
import { getMissionById } from "@/content/missions";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { useVisibleMissionSlots } from "@/store/atoms/missions";
import { MissionsCard } from "./missions.card";

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

          return (
            <div className="min-w-0" key={slot.id}>
              <MissionClaimDialog
                mission={mission}
                progress={slot.progress}
                status={slot.status}
              >
                <MissionsCard
                  className="h-full w-full"
                  onClaim={() => announce(m["ui.a11y.missionClaimed"]())}
                  slot={slot}
                />
              </MissionClaimDialog>
            </div>
          );
        })}
      </div>

      <LiveAnnouncer message={message} />
    </>
  );
};
