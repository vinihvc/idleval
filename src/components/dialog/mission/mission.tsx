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
import type { MissionDefinition } from "@/content/missions";
import { getLocalizedMissionTitle } from "@/content/missions";
import type { MissionProgress, MissionSlotStatus } from "@/game/types";
import { m } from "@/i18n/messages";
import { MissionClaim } from "./mission.claim";
import { MissionClaimContent } from "./mission.content";
import { MissionDialogTrigger } from "./mission.trigger";

export interface MissionDialogProps
  extends React.ComponentProps<typeof ResponsiveDialog> {
  children?: React.ReactNode;
  mission: MissionDefinition;
  progress: MissionProgress;
  status: MissionSlotStatus;
}

const MissionDialog = (props: MissionDialogProps) => {
  const {
    children,
    mission,
    open,
    progress,
    status,
    onOpenChange,
    ...dialogProps
  } = props;

  const missionTitle = getLocalizedMissionTitle(mission.id);

  return (
    <ResponsiveDialog
      lazyMount
      onOpenChange={onOpenChange}
      open={open}
      unmountOnExit
      {...dialogProps}
    >
      {status === "in_progress" && children ? (
        <MissionDialogTrigger>{children}</MissionDialogTrigger>
      ) : (
        children
      )}

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
          <MissionClaimContent
            mission={mission}
            progress={progress}
            status={status}
          />
        </ResponsiveDialogBody>

        {status === "ready" && (
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
