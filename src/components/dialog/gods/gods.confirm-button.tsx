import { useLingui } from "@lingui/react/macro";
import type React from "react";
import { HoldButton } from "@/components/ui/hold-button";
import type { UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import type { LocalizedGod } from "@/hooks/use-localized-god";
import { invokeGod } from "@/store/atoms/gods";

interface GodConfirmButtonProps
  extends React.ComponentProps<typeof UpgradeCardTrigger> {
  god: LocalizedGod;
  onInvoke?: () => void;
}

export const GodConfirmButton = (props: GodConfirmButtonProps) => {
  const { god, onInvoke, children, ...rest } = props;
  const { t } = useLingui();

  return (
    <HoldButton
      aria-label={t`Hold to invoke ${god.name}.`}
      className="inset-shadow-none w-full rounded-none rounded-b-md border"
      holdLabel={t`Hold...`}
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
