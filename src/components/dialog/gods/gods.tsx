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
import { GOD_DATA } from "@/content/gods";
import { m } from "@/i18n/messages";
import { GodsCard } from "./gods.card";

export const GodsDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  const [open, setOpen] = React.useState(false);

  return (
    <ResponsiveDialog onOpenChange={setOpen} open={open}>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.gods.title"]()}
            src="/images/gods/gods.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{m["ui.gods.title"]()}</ResponsiveDialogTitle>

          <ResponsiveDialogDescription hideDescription>
            {m["ui.gods.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {GOD_DATA.map((god) => (
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
