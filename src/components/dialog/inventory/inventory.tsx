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
import {
  getLocalizedPowerUp,
  INVENTORY_GRID_SIZE,
  RELIC_SLOT_COUNT,
} from "@/content/power-ups";
import { canActivatePowerUp } from "@/game/power-ups";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { useInventory } from "@/store/atoms/inventory";
import { useNotificationDialogHandler } from "@/store/atoms/notifications";
import { activatePowerUpAtSlot } from "@/store/atoms/power-ups.actions";

export const InventoryDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  const onOpenChange = useNotificationDialogHandler("inventory");
  const { slots, activePowerUp } = useInventory();
  const { announce, message } = useLiveAnnouncer();

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

          <ResponsiveDialogDescription hideDescription>
            {m["ui.inventory.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <LiveAnnouncer message={message} />
          <div className="grid grid-cols-4 gap-3 md:grid-cols-5">
            {Array.from({ length: INVENTORY_GRID_SIZE }, (_, index) => {
              const isRitualSlot = index >= RELIC_SLOT_COUNT;
              const slot = isRitualSlot ? null : slots[index];
              let slotKey = `empty-${index}`;

              if (isRitualSlot) {
                slotKey = `ritual-${index}`;
              } else if (slot) {
                slotKey = `relic-${slot.powerUpId}-${index}`;
              }

              return (
                <InventoryCard
                  count={slot?.count ?? 0}
                  disabled={
                    slot ? !canActivatePowerUp(activePowerUp, slot.count) : true
                  }
                  imageClassName="size-[68%]"
                  index={index}
                  isRitualSlot={isRitualSlot}
                  key={slotKey}
                  onUse={
                    slot
                      ? () => {
                          if (activatePowerUpAtSlot(index)) {
                            announce(
                              m["ui.a11y.activated"]({
                                name: getLocalizedPowerUp(slot.powerUpId).name,
                              })
                            );
                          }
                        }
                      : undefined
                  }
                  powerUpId={slot?.powerUpId ?? null}
                  tier={slot?.tier}
                />
              );
            })}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default InventoryDialog;
