import { Reload } from "pixelarticons/react/Reload";
import { HoldButton } from "@/components/ui/hold-button";
import { m } from "@/i18n/messages";
import { resetGame } from "@/store/reset";

export const SettingsReset = (
  props: React.ComponentProps<typeof HoldButton>
) => (
  <HoldButton
    aria-label={m["ui.settings.resetHold"]()}
    className="w-full text-lg"
    holdLabel={m["ui.common.hold"]()}
    onHoldComplete={resetGame}
    size="xl"
    variant="destructive"
    {...props}
  >
    <Reload />
    {m["ui.settings.reset"]()}
  </HoldButton>
);
