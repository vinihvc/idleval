import { Button } from "@/components/ui/button";
import type { MissionId } from "@/content/missions";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { claimMissionReward } from "@/store/atoms/missions";

export interface MissionClaimProps {
  missionId: MissionId;
  onClaimed?: () => void;
}

export const MissionClaim = (props: MissionClaimProps) => {
  const { missionId, onClaimed } = props;

  const { announce, message } = useLiveAnnouncer();

  const handleClaim = () => {
    if (!claimMissionReward(missionId)) {
      return;
    }

    announce(m["ui.a11y.missionClaimed"]());
    onClaimed?.();
  };

  return (
    <>
      <LiveAnnouncer message={message} />
      <Button
        className="w-full"
        onClick={handleClaim}
        size="lg"
        variant="green"
      >
        {m["ui.missions.claim"]()}
      </Button>
    </>
  );
};
