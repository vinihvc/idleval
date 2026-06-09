import { Image } from "@unpic/react";
import type React from "react";
import { tv } from "tailwind-variants";
import { Badge } from "@/components/ui/badge";
import { boxBorder } from "@/components/ui/box-border";
import {
  type getLocalizedPowerUp,
  POWER_UP_DATA,
  type PowerUpId,
  type PowerUpTier,
} from "@/content/power-ups";
import { cn } from "@/lib/cn";

export type PowerUpCardTier = PowerUpTier | "ritual";

export type PowerUpCardStatus =
  | "default"
  | "claimed"
  | "current"
  | "locked"
  | "next";

export const powerUpCardTierVariants = tv({
  base: [
    "relative flex aspect-square w-full items-center justify-center",
    "rounded-md border-3 bg-secondary/50 p-1",
    "inset-shadow-xs transition-opacity",
  ],
  variants: {
    tier: {
      common: "border-primary/90",
      uncommon: "border-success/70",
      rare: "border-sky-400/80",
      epic: cn(
        boxBorder({ variant: "cream", size: "sm" }),
        "border-amber-300/90"
      ),
      ritual: "border-primary/90",
    },
    filled: {
      true: "bg-secondary/80",
      false: "bg-secondary/50",
    },
    layout: {
      square: "",
      stacked: "flex-col gap-0.5",
    },
    status: {
      default: "",
      claimed: "",
      current: cn(
        "border-primary",
        boxBorder({ variant: "cream", size: "sm", soft: "none", ring: true })
      ),
      locked: "opacity-60 saturate-50",
      next: "border-primary/55 border-dashed",
    },
  },
  defaultVariants: {
    tier: "common",
    filled: true,
    layout: "square",
    status: "default",
  },
});

export const powerUpCardBadgeClassName =
  "absolute top-0.5 right-0.5 font-number tabular-nums";

export const getPowerUpCardClassName = (options: {
  tier: PowerUpCardTier;
  filled?: boolean;
  layout?: "square" | "stacked";
  status?: PowerUpCardStatus;
  className?: string;
  elevated?: boolean;
  disabled?: boolean;
}) => {
  const {
    tier,
    filled = true,
    layout = "square",
    status = "default",
    className,
    elevated = true,
    disabled = false,
  } = options;

  return cn(
    powerUpCardTierVariants({ tier, filled, layout, status }),
    elevated && boxBorder({ variant: "default", size: "sm" }),
    disabled && "opacity-60",
    className
  );
};

const getPowerUpCardImageOpacity = (status: PowerUpCardStatus) => {
  if (status === "claimed") {
    return "opacity-35";
  }

  if (status === "locked") {
    return "opacity-65";
  }

  return "";
};

export const PowerUpCardTooltipContent = (props: {
  lore: ReturnType<typeof getLocalizedPowerUp>;
}) => {
  const { lore } = props;

  return (
    <span className="flex flex-col gap-1 text-left">
      <span className="font-bold">{lore.name}</span>
      <span className="font-normal text-base">{lore.description}</span>
    </span>
  );
};

export const PowerUpCardEmptyContent = () => (
  <div
    aria-hidden
    className={cn(
      "size-full rounded-sm border-2 border-primary/25 border-dashed",
      "bg-background/20"
    )}
  />
);

export interface PowerUpCardFilledContentProps {
  badge?: React.ReactNode;
  imageClassName?: string;
  layout?: "square" | "stacked";
  name?: string;
  powerUpId: PowerUpId;
  status?: PowerUpCardStatus;
}

export const PowerUpCardFilledContent = (
  props: PowerUpCardFilledContentProps
) => {
  const {
    badge,
    imageClassName,
    layout = "square",
    name,
    powerUpId,
    status = "default",
  } = props;

  return (
    <>
      <div
        className={cn(
          "relative min-h-0 w-full",
          layout === "stacked" ? "flex-1" : "size-full"
        )}
      >
        <Image
          alt=""
          aria-hidden
          className={cn(
            "rounded-sm object-contain",
            imageClassName ?? "size-full",
            getPowerUpCardImageOpacity(status)
          )}
          height={400}
          src={POWER_UP_DATA[powerUpId].image}
          width={400}
        />
        {badge}
      </div>
      {name ? (
        <p className="w-full truncate px-0.5 text-center font-bold text-foreground text-xs leading-tight">
          {name}
        </p>
      ) : null}
    </>
  );
};

export interface PowerUpCardCountBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children"> {
  count: number;
}

export const PowerUpCardCountBadge = (props: PowerUpCardCountBadgeProps) => {
  const { count, className, variant = "default", ...rest } = props;

  return (
    <Badge
      className={cn(powerUpCardBadgeClassName, className)}
      variant={variant}
      {...rest}
    >
      {count}
    </Badge>
  );
};
