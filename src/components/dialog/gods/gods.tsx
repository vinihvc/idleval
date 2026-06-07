import React from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { GODS } from "@/content/gods";
import { GodsCard } from "./gods.card";

export const GodsDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  const [open, setOpen] = React.useState(false);

  return (
    <ResponsiveDialog onOpenChange={setOpen} open={open}>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage alt="Gods" src="/images/gods/gods.webp" />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Gods</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Each invocation is an offering of sacrifice: surrender everything
            you have now, and the gods will return even greater abundance in the
            future.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-3 gap-2">
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
