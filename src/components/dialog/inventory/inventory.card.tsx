import { Image } from "@unpic/react";
import type React from "react";
import { tv } from "tailwind-variants";
import { Badge } from "@/components/ui/badge";
import { boxBorder } from "@/components/ui/box-border";
import {
  getLocalizedPowerUp,
  POWER_UP_DATA,
  type PowerUpId,
  type PowerUpTier,
} from "@/content/power-ups";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";

const inventoryCardTierVariants = tv({
  base: [
    "relative flex aspect-square w-full items-center justify-center",
    "rounded-md border-3 bg-secondary/50 p-1",
    boxBorder({ variant: "default", size: "sm" }),
    "inset-shadow-xs transition-opacity",
  ],
  variants: {
    tier: {
      common: "border-primary/90",
      uncommon: "border-success/70",
      rare: "border-sky-400/80",
      epic: [
        "border-amber-300/90",
        boxBorder({ variant: "cream", size: "sm" }),
      ],
      ritual: "border-primary/90",
    },
    filled: {
      true: "bg-secondary/80",
      false: "bg-secondary/50",
    },
  },
  defaultVariants: {
    tier: "ritual",
    filled: false,
  },
});

export interface InventoryCardProps extends React.ComponentProps<"button"> {
  count?: number;
  imageClassName?: string;
  index: number;
  onUse?: () => void;
  powerUpId: PowerUpId | null;
  tier?: PowerUpTier;
}

export const InventoryCard = (props: InventoryCardProps) => {
  const {
    index,
    powerUpId,
    count = 0,
    tier,
    className,
    imageClassName,
    disabled,
    onUse,
    type = "button",
    ...rest
  } = props;

  const isRitualSlot = powerUpId == null;
  const isFilled = !isRitualSlot && count > 0;
  const resolvedTier = isRitualSlot ? "ritual" : (tier ?? "common");
  const isDisabled = disabled ?? (!isFilled || isRitualSlot);

  const label = isRitualSlot
    ? m["ui.inventory.slot.ritual"]({ 0: index + 1 })
    : isFilled
      ? getLocalizedPowerUp(powerUpId).name
      : m["ui.inventory.slot.empty"]({ 0: index + 1 });

  return (
    <button
      aria-label={
        isFilled
          ? m["ui.inventory.slot.relic"]({
              name: label,
              count: String(count),
            })
          : label
      }
      className={cn(
        inventoryCardTierVariants({
          tier: resolvedTier,
          filled: isFilled,
        }),
        "disabled:cursor-default disabled:opacity-100",
        isDisabled && !isRitualSlot && "opacity-60",
        className
      )}
      data-slot="inventory-card"
      data-tier={resolvedTier}
      disabled={isDisabled}
      onClick={isFilled ? onUse : undefined}
      type={type}
      {...rest}
    >
      {isFilled && powerUpId ? (
        <>
          <Image
            alt=""
            aria-hidden
            className={cn(
              "rounded-sm object-contain",
              imageClassName ?? "size-full"
            )}
            height={400}
            src={POWER_UP_DATA[powerUpId].image}
            width={400}
          />
          <Badge
            className="absolute top-1 right-1 font-number tabular-nums"
            variant="default"
          >
            {count}
          </Badge>
        </>
      ) : (
        <div
          aria-hidden
          className={cn(
            "size-full rounded-sm border-2 border-primary/25 border-dashed",
            "bg-background/20"
          )}
        />
      )}
    </button>
  );
};
