import type React from "react";
import { HoldButton } from "@/components/ui/hold-button";
import type { UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import type { God } from "@/content/gods";
import { invokeGod } from "@/store/atoms/gods";

interface GodConfirmButtonProps
  extends React.ComponentProps<typeof UpgradeCardTrigger> {
  god: God;
  onInvoke?: () => void;
}

export const GodConfirmButton = (props: GodConfirmButtonProps) => {
  const { god, onInvoke, children, ...rest } = props;

  return (
    <HoldButton
      aria-label={`Hold  to invoke ${god.name}.`}
      className="inset-shadow-none w-full rounded-none border-0"
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
