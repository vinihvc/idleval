import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import type { MissionId } from "@/content/missions";
import { getLocalizedMissionTitle, getMissionById } from "@/content/missions";
import type { MissionProgress, MissionSlotStatus } from "@/game/types";
import { m } from "@/i18n/messages";
import { MissionClaim } from "./mission.claim";
import { MissionClaimContent } from "./mission.content";

export interface MissionDialogProps
  extends React.ComponentProps<typeof ResponsiveDialog> {
  missionId: MissionId | null;
  progress: MissionProgress | null;
  status: MissionSlotStatus;
}

const MissionDialog = (props: MissionDialogProps) => {
  const { missionId, open, progress, status, onOpenChange } = props;

  const mission = missionId ? getMissionById(missionId) : undefined;

  const missionTitle = mission
    ? getLocalizedMissionTitle(mission.id)
    : m["ui.missions.title"]();

  return (
    <ResponsiveDialog onOpenChange={onOpenChange} open={open}>
      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt=""
            aria-hidden
            src="/images/msc/missions.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{missionTitle}</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {m["ui.missions.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          {progress && missionId && (
            <MissionClaimContent
              missionId={missionId}
              progress={progress}
              status={status}
            />
          )}
        </ResponsiveDialogBody>

        {mission && progress && status === "ready" && (
          <ResponsiveDialogFooter>
            <MissionClaim
              missionId={mission.id}
              onClaimed={() => onOpenChange?.(false)}
            />
          </ResponsiveDialogFooter>
        )}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default MissionDialog;
