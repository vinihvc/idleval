import { InfoBox } from "pixelarticons/react/InfoBox";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  PowerUpCard,
  PowerUpCardFooter,
  PowerUpCardMedia,
} from "@/components/ui/power-up-card/power-up-card";
import {
  ToggleTooltip,
  ToggleTooltipContent,
  ToggleTooltipTrigger,
} from "@/components/ui/toggle-tooltip";
import { getLocalizedPowerUp } from "@/content/power-ups";
import { canActivatePowerUp } from "@/game/power-ups";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { type InventorySlot, useInventory } from "@/store/atoms/inventory";

export interface InventoryCardProps extends React.ComponentProps<"div"> {
  /**
   * The inventory slot to display.
   */
  item: InventorySlot | undefined;
  /**
   * The function to call when the power up is used.
   */
  onUse: (item: InventorySlot) => void;
}

export const InventoryCard = (props: InventoryCardProps) => {
  const { item, className, onUse, ...rest } = props;

  const { activePowerUp } = useInventory();
  const canUse = Boolean(item && canActivatePowerUp(activePowerUp, item.count));

  const usePowerUp = () => {
    if (!item) {
      return;
    }

    onUse(item);
  };

  return (
    <PowerUpCard
      {...rest}
      className={cn("h-32", !canUse && "opacity-60", className)}
      data-slot="inventory-card"
    >
      <PowerUpCardMedia className="pt-6" powerUpId={item?.powerUpId} />

      {item && (
        <div
          className="absolute top-1 right-1 font-number"
          data-slot="power-up-card-badge"
        >
          <div className="flex size-5 select-none items-center justify-center rounded-md border bg-popover text-popover-foreground text-sm">
            {item.count}
          </div>
        </div>
      )}

      {item && (
        <>
          <ToggleTooltip>
            <ToggleTooltipTrigger asChild>
              <Button
                aria-label={m["ui.inventory.slot.info"]({
                  0: getLocalizedPowerUp(item.powerUpId).name,
                })}
                className="absolute top-1 left-1 size-5 rounded-md border"
                size="icon-xs"
                variant="blue"
              >
                <InfoBox />
              </Button>
            </ToggleTooltipTrigger>
            <ToggleTooltipContent>
              <h3 className="font-bold text-lg">
                {getLocalizedPowerUp(item.powerUpId).name}
              </h3>
              <p>{getLocalizedPowerUp(item.powerUpId).description}</p>
            </ToggleTooltipContent>
          </ToggleTooltip>

          <PowerUpCardFooter className="flex items-center p-1">
            <Button
              aria-label={m["ui.inventory.useItem"]({
                0: getLocalizedPowerUp(item.powerUpId).name,
              })}
              className="w-full rounded-md font-bold text-sm"
              disabled={!canUse}
              onClick={usePowerUp}
              size="xs"
              variant="green"
            >
              {m["ui.common.use"]()}
            </Button>
          </PowerUpCardFooter>
        </>
      )}
    </PowerUpCard>
  );
};
