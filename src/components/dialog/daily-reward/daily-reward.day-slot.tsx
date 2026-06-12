import { Check } from "pixelarticons/react/Check";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { PowerUpCard } from "@/components/ui/power-up-card/power-up-card";
import { getLocalizedPowerUp, type PowerUpId } from "@/content/power-ups";
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

export interface DailyRewardDaySlotProps
  extends React.ComponentProps<"figure"> {
  day: number;
  powerUpId: PowerUpId;
  status: DailyRewardDayStatus;
}

export const DailyRewardDaySlot = (props: DailyRewardDaySlotProps) => {
  const { day, powerUpId, status, className, ...rest } = props;

  const localized = getLocalizedPowerUp(powerUpId);
  const dayLabel = formatDayLabel(day);

  return (
    <figure
      className={cn("relative aspect-square w-full", className)}
      data-day={day}
      data-slot="daily-reward-day"
      data-status={status}
      {...rest}
    >
      <figcaption className="sr-only">
        {m["ui.daily.dayReward"]({
          day: dayLabel,
          name: localized.name,
          status: getDailyRewardStatusLabel(day, status),
        })}
      </figcaption>

      <PowerUpCard
        aria-hidden
        badge={
          <Badge
            className="font-number tabular-nums"
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
        }
        powerUpId={powerUpId}
      />
    </figure>
  );
};
