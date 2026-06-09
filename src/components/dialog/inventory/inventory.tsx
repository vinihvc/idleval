import type React from "react";
import { InventoryCard } from "@/components/dialog/inventory/inventory.card";
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
import { getLocalizedPowerUp, POWER_UP_GRID_LAYOUT } from "@/content/power-ups";
import { canActivatePowerUp } from "@/game/power-ups";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { useInventory } from "@/store/atoms/inventory";
import { useNotificationDialogHandler } from "@/store/atoms/notifications";
import { activatePowerUp } from "@/store/atoms/power-ups.actions";

const InventoryDialogBody = () => {
  const { counts, activePowerUp } = useInventory();
  const { announce, message } = useLiveAnnouncer();

  return (
    <ResponsiveDialogBody className="gap-4">
      <LiveAnnouncer message={message} />
      <div className="grid grid-cols-5 gap-3">
        {POWER_UP_GRID_LAYOUT.map((powerUpId, index) => (
          <InventoryCard
            count={powerUpId ? counts[powerUpId] : 0}
            disabled={
              powerUpId
                ? !canActivatePowerUp(activePowerUp, counts[powerUpId] ?? 0)
                : true
            }
            imageClassName="size-[68%]"
            index={index}
            key={powerUpId ?? `ritual-${index}`}
            onUse={
              powerUpId
                ? () => {
                    if (activatePowerUp(powerUpId)) {
                      announce(
                        m["ui.a11y.activated"]({
                          name: getLocalizedPowerUp(powerUpId).name,
                        })
                      );
                    }
                  }
                : undefined
            }
            powerUpId={powerUpId}
          />
        ))}
      </div>
    </ResponsiveDialogBody>
  );
};

export const InventoryDialog = (props: React.PropsWithChildren) => {
  const { children } = props;
  const onOpenChange = useNotificationDialogHandler("inventory");

  return (
    <ResponsiveDialog onOpenChange={onOpenChange}>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.inventory.title"]()}
            src="/images/msc/inventory.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {m["ui.inventory.title"]()}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {m["ui.inventory.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <InventoryDialogBody />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default InventoryDialog;
