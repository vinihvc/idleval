import type React from "react";
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
import { FACTORY_TYPES } from "@/content/factories";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { useNotificationDialogHandler } from "@/store/atoms/notifications";
import { ManagersCard } from "./managers.card";

export const ManagersDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  const { announce, message } = useLiveAnnouncer();
  const onOpenChange = useNotificationDialogHandler("managers");

  return (
    <ResponsiveDialog onOpenChange={onOpenChange}>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.managers.singular"]()}
            src="/images/managers/manager.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {m["ui.managers.title"]()}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription hideDescription>
            {m["ui.managers.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <LiveAnnouncer message={message} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {FACTORY_TYPES.map((factoryType) => (
              <ManagersCard
                factoryType={factoryType}
                key={factoryType}
                onPurchase={(name) =>
                  announce(m["ui.a11y.purchased"]({ name }))
                }
              />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default ManagersDialog;
