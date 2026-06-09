import { Image } from "@unpic/react";
import { Check } from "pixelarticons/react/Check";
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

export type DailyRewardDayStatus = "claimed" | "current" | "locked" | "next";

const formatDayLabel = (day: number): string => String(day).padStart(2, "0");

const getDailyRewardStatusLabel = (
  day: number,
  status: DailyRewardDayStatus
): string => {
  if (status === "claimed") {
    return m["ui.daily.status.claimed"](String(day));
  }

  if (status === "current") {
    return m["ui.daily.status.today"](String(day));
  }

  if (status === "next") {
    return m["ui.daily.status.next"](String(day));
  }

  return m["ui.daily.status.locked"](String(day));
};

const slotFrameVariants = tv({
  base: [
    "relative flex aspect-square items-center justify-center p-1.5",
    "rotate-45 rounded-sm border-3 bg-secondary/40",
    boxBorder({ variant: "default", size: "sm", soft: false }),
  ],
  variants: {
    tier: {
      common: "border-primary/85",
      uncommon: "border-success/75",
      rare: "border-sky-400/80",
      epic: "border-amber-300/90",
    },
    status: {
      claimed: "",
      current: "border-primary shadow-[0_0_0_2px_oklch(0.72_0.14_85/0.45)]",
      locked: "opacity-50 saturate-50",
      next: "border-primary/55 border-dashed",
    },
  },
  defaultVariants: {
    tier: "common",
    status: "locked",
  },
});

const tierDotVariants = tv({
  base: "size-1.5 rounded-full",
  variants: {
    tier: {
      common: "bg-primary",
      uncommon: "bg-success",
      rare: "bg-info",
      epic: "bg-warning",
    },
    filled: {
      true: "",
      false: "opacity-25",
    },
  },
  defaultVariants: {
    tier: "common",
    filled: true,
  },
});

const tierDotCount: Record<PowerUpTier, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
};

export interface DailyRewardDaySlotProps
  extends React.ComponentProps<"figure"> {
  day: number;
  powerUpId: PowerUpId;
  status: DailyRewardDayStatus;
  tier: PowerUpTier;
}

export const DailyRewardDaySlot = (props: DailyRewardDaySlotProps) => {
  const { day, powerUpId, status, tier, className, ...rest } = props;

  const localized = getLocalizedPowerUp(powerUpId);
  const dayLabel = formatDayLabel(day);
  const dots = tierDotCount[tier];

  return (
    <figure
      className={cn("relative min-h-20 w-full overflow-visible", className)}
      data-day={day}
      data-slot="daily-reward-day"
      data-status={status}
      data-tier={tier}
      {...rest}
    >
      <figcaption className="sr-only">
        {m["ui.daily.dayReward"]({
          day: dayLabel,
          name: localized.name,
          status: getDailyRewardStatusLabel(day, status),
        })}
      </figcaption>

      <Badge
        aria-hidden
        className="absolute top-0 left-1/2 z-10 -translate-x-1/2 font-number tabular-nums"
        size="sm"
        variant={status === "claimed" ? "green" : "brown"}
      >
        {status === "claimed" ? (
          <span className="flex items-center gap-0.5">
            <Check className="size-2.5" />
            {dayLabel}
          </span>
        ) : (
          dayLabel
        )}
      </Badge>

      <div
        aria-hidden
        className="absolute inset-x-0 top-5 bottom-5 flex items-center justify-center"
      >
        <div className="size-12 shrink-0">
          <div className={cn(slotFrameVariants({ tier, status }), "size-full")}>
            <div className="flex size-full -rotate-45 flex-col items-center justify-center gap-0.5">
              <Image
                alt=""
                aria-hidden
                className={cn(
                  "pixel-crisp size-7 object-contain",
                  status === "claimed" && "opacity-35",
                  status === "locked" && "opacity-65"
                )}
                height={400}
                src={POWER_UP_DATA[powerUpId].image}
                width={400}
              />

              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4].map((dot) => (
                  <span
                    className={tierDotVariants({
                      tier,
                      filled: dot <= dots,
                    })}
                    key={dot}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Badge
        aria-hidden
        className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 font-number tabular-nums"
        size="sm"
        variant="default"
      >
        {m["ui.daily.rewardQuantity"]({ 0: "1" })}
      </Badge>
    </figure>
  );
};
