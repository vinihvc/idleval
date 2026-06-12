import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PowerUpCard } from "@/components/ui/power-up-card/power-up-card";
import { getLocalizedPowerUp } from "@/content/power-ups";
import { canActivatePowerUp } from "@/game/power-ups";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { type InventorySlot, useInventory } from "@/store/atoms/inventory";
import { activatePowerUpAtSlot } from "@/store/atoms/power-ups.actions";

export interface InventoryCardProps extends React.ComponentProps<"div"> {
  item: InventorySlot | undefined;
}

export const InventoryCard = (props: InventoryCardProps) => {
  const { className, item, ...rest } = props;

  const { activePowerUp, slots } = useInventory();
  const { announce, message } = useLiveAnnouncer();

  const slotIndex = item ? slots.indexOf(item) : -1;
  const canUse = Boolean(
    item && slotIndex >= 0 && canActivatePowerUp(activePowerUp, item.count)
  );

  const usePowerUp = () => {
    if (!(item && slotIndex >= 0)) {
      return;
    }

    if (activatePowerUpAtSlot(slotIndex)) {
      announce(
        m["ui.a11y.activated"]({
          name: getLocalizedPowerUp(item.powerUpId).name,
        })
      );
    }
  };

  return (
    <>
      <LiveAnnouncer message={message} />
      <PowerUpCard
        {...rest}
        badge={
          item ? (
            <Badge className="h-6 min-w-6 rounded-sm px-0 font-bold text-lg leading-none">
              {item.count}
            </Badge>
          ) : null
        }
        className={className}
        data-slot="inventory-card"
        footer={
          item ? (
            <Button
              aria-label={m["ui.inventory.useItem"]({
                0: getLocalizedPowerUp(item.powerUpId).name,
              })}
              className="h-7 w-full px-2 font-bold text-sm"
              disabled={!canUse}
              onClick={usePowerUp}
              size="xs"
              sound={false}
              variant="green"
            >
              {m["ui.common.use"]()}
            </Button>
          ) : null
        }
        powerUpId={item?.powerUpId}
      />
    </>
  );
};
