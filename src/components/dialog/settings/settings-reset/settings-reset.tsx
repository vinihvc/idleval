import { Reload } from "pixelarticons/react";
import { HoldButton } from "@/components/ui/hold-button";
import { m } from "@/i18n/messages";
import { resetGame } from "@/store/reset";

interface SettingsResetProps {
  onResetComplete: () => void;
}

export const SettingsReset = (props: SettingsResetProps) => {
  const { onResetComplete } = props;

  return (
    <HoldButton
      aria-label={m["ui.settings.resetHold"]()}
      className="w-full text-lg"
      holdLabel={m["ui.common.hold"]()}
      onHoldComplete={() => {
        resetGame();
        onResetComplete();
      }}
      size="xl"
      variant="destructive"
    >
      <Reload />
      {m["ui.settings.reset"]()}
    </HoldButton>
  );
};
