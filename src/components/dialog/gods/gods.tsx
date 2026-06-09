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
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { useNotificationDialogHandler } from "@/store/atoms/notifications";
import { GodsCard } from "./gods.card";

export const GodsDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  const [open, setOpen] = React.useState(false);
  const { announce, message } = useLiveAnnouncer();
  const dismissNotification = useNotificationDialogHandler("gods");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    dismissNotification(nextOpen);
  };

  return (
    <ResponsiveDialog onOpenChange={handleOpenChange} open={open}>
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

          <ResponsiveDialogDescription>
            {m["ui.gods.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <LiveAnnouncer message={message} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {GOD_DATA.map((god) => (
              <GodsCard
                god={god}
                key={god.id}
                onInvoke={(name) => {
                  announce(m["ui.a11y.invoked"]({ name }));
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default GodsDialog;
