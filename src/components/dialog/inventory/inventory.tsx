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
import { INVENTORY_GRID_SIZE } from "@/content/power-ups";
import { m } from "@/i18n/messages";
import { useInventory } from "@/store/atoms/inventory";
import { useNotificationDialogHandler } from "@/store/atoms/notifications";

const INVENTORY_CARD_KEYS = Array.from(
  { length: INVENTORY_GRID_SIZE },
  (_, index) => `inventory-card-${index}`
);

export const InventoryDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  const onOpenChange = useNotificationDialogHandler("inventory");
  const { slots } = useInventory();

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
          <div className="grid grid-cols-4 gap-3 md:grid-cols-5">
            {INVENTORY_CARD_KEYS.map((cardKey, index) => {
              const slot = slots[index];

              return <InventoryCard item={slot} key={cardKey} />;
            })}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default InventoryDialog;
