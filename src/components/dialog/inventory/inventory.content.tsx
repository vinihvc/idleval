import { useMediaQuery } from "@uidotdev/usehooks";
import { InventoryCard } from "@/components/dialog/inventory/inventory.card";
import { getLocalizedPowerUp } from "@/content/power-ups";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { type InventorySlot, useInventory } from "@/store/atoms/inventory";
import { activatePowerUpAtSlot } from "@/store/atoms/power-ups.actions";
import { amountFormatterWithDolarSign } from "@/utils/formatters";

const DESKTOP_INVENTORY_SLOTS = 8;
const MOBILE_INVENTORY_SLOTS = 9;

export const InventoryContent = () => {
  const { slots } = useInventory();
  const { announce, message } = useLiveAnnouncer();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleUseItem = (slotIndex: number, item: InventorySlot) => {
    const result = activatePowerUpAtSlot(slotIndex);

    if (!result.success) {
      return;
    }

    if (result.mimirCoinGold) {
      announce(
        m["ui.a11y.mimirCoinGranted"]({
          amount: amountFormatterWithDolarSign(result.mimirCoinGold),
        })
      );
      return;
    }

    announce(
      m["ui.a11y.activated"]({
        name: getLocalizedPowerUp(item.powerUpId).name,
      })
    );
  };

  return (
    <>
      <LiveAnnouncer message={message} />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
        {Array.from({
          length: isMobile ? MOBILE_INVENTORY_SLOTS : DESKTOP_INVENTORY_SLOTS,
        }).map((_, index) => {
          const key = `inventory-card-${index}`;

          const slot = slots[index];

          return (
            <InventoryCard
              item={slot}
              key={key}
              onUse={(item) => {
                handleUseItem(index, item);
              }}
            />
          );
        })}
      </div>
    </>
  );
};
