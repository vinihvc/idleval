import type React from "react";
import { HoldButton } from "@/components/ui/hold-button";
import type { UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import type { God } from "@/content/gods";
import { invokeGod } from "@/store/atoms/gods";

const HOLD_TO_INVOKE_MS = 4000;

interface GodConfirmButtonProps
  extends React.ComponentProps<typeof UpgradeCardTrigger> {
  god: God;
  onInvoke?: () => void;
}

export const GodConfirmButton = (props: GodConfirmButtonProps) => {
  const { god, onInvoke, children, ...rest } = props;

  return (
    <HoldButton
      aria-label={`Hold for ${HOLD_TO_INVOKE_MS / 1000} seconds to invoke ${god.name}.`}
      durationMs={HOLD_TO_INVOKE_MS}
      holdLabel="Hold..."
      onHoldComplete={() => {
        if (invokeGod()) {
          onInvoke?.();
        }
      }}
      {...rest}
    >
      {children}
    </HoldButton>
  );
};
