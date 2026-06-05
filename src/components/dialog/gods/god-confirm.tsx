import type React from "react";
import { HoldActionButton } from "@/components/ui/hold-button";
import { UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import type { God } from "@/content/gods";
import { getMultiplierAfterInvocation } from "@/game/gods";
import { invokeGod } from "@/store/atoms/gods";
import { amountFormatter } from "@/utils/formatters";

const HOLD_TO_INVOKE_MS = 4000;

interface GodConfirmButtonProps
  extends React.ComponentProps<typeof UpgradeCardTrigger> {
  god: God;
  godIndex: number;
  onInvoke?: () => void;
}

export const GodConfirmButton = (props: GodConfirmButtonProps) => {
  const { god, godIndex, onInvoke, children, ...rest } = props;

  const multiplierAfter = getMultiplierAfterInvocation(godIndex);
  const multiplierLabel = amountFormatter(multiplierAfter);

  return (
    <HoldActionButton
      aria-label={`Hold for 4 seconds to invoke ${god.name}. This resets your realm and raises your divine bonus to x${multiplierLabel}.`}
      buttonComponent={UpgradeCardTrigger}
      durationMs={HOLD_TO_INVOKE_MS}
      holdingChildren="Hold..."
      onHoldComplete={() => {
        if (invokeGod()) {
          onInvoke?.();
        }
      }}
      {...rest}
    >
      {children}
    </HoldActionButton>
  );
};
