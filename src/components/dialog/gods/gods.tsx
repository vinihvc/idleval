import React from "react";
import { Badge } from "@/components/ui/badge";
import { HoldButton } from "@/components/ui/hold-button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import type { UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import { GOD_COUNT, GODS, type God } from "@/content/gods";
import { invokeGod, useGods } from "@/store/atoms/gods";
import { GodsCard } from "./gods.card";

const HOLD_TO_INVOKE_MS = 4000;

interface GodConfirmButtonProps
  extends React.ComponentProps<typeof UpgradeCardTrigger> {
  god: God;
  godIndex: number;
  onInvoke?: () => void;
}

export const GodConfirmButton = (props: GodConfirmButtonProps) => {
  const { god, godIndex, onInvoke, children, ...rest } = props;

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

export const GodsDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  const { count: godsLevel } = useGods();

  const [open, setOpen] = React.useState(false);

  return (
    <ResponsiveDialog onOpenChange={setOpen} open={open}>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogImage alt="Gods" src="/images/gods/gods.webp" />

        <ResponsiveDialogHeader>
          <div className="flex items-center justify-between gap-2">
            <ResponsiveDialogTitle>Gods</ResponsiveDialogTitle>

            <Badge variant="secondary">
              <span className="font-semibold">Gods worshiped:</span>
              {` ${godsLevel} / ${GOD_COUNT}`}
            </Badge>
          </div>

          <ResponsiveDialogDescription>
            Each invocation is an offering of sacrifice: surrender everything
            you have now, and the gods will return even greater abundance in the
            future.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {GODS.map((god, index) => (
              <GodsCard
                godIndex={index}
                key={god.id}
                onInvoke={() => setOpen(false)}
              />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
