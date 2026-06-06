import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { GOD_COUNT, GODS } from "@/content/gods";
import { useGods } from "@/store/atoms/gods";
import { GodsCard } from "./gods.card";

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
            {GODS.map((god) => (
              <GodsCard
                god={god}
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
