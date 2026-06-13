import type React from "react";
import { Badge } from "@/components/ui/badge";
import {
  PowerUpCard,
  PowerUpCardMedia,
} from "@/components/ui/power-up-card/power-up-card";
import { DAILY_REWARD_CALENDAR, type PowerUpId } from "@/content/power-ups";
import { useDailyReward } from "@/store/atoms/inventory";

export interface DailyRewardCardProps extends React.ComponentProps<"div"> {
  /**
   * The power up ID to display.
   */
  powerUpId: PowerUpId;
}

export const DailyRewardCard = (props: DailyRewardCardProps) => {
  const { powerUpId, className, ...rest } = props;

  const { isPending, offer } = useDailyReward();

  const entry = DAILY_REWARD_CALENDAR.find(
    (reward) => reward.powerUpId === powerUpId
  );
  const day = entry?.day ?? offer.dayInCycle;
  const status = getDailyRewardDayStatus(day, offer.dayInCycle, isPending);
  const dayLabel = formatDayLabel(day);

  return (
    <PowerUpCard
      className={className}
      variant={status === "claimed" ? "green" : "default"}
      {...rest}
    >
      <PowerUpCardMedia className="py-6" powerUpId={powerUpId} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Badge
          className="px-3 font-number text-base tabular-nums"
          size="lg"
          variant={status === "claimed" ? "green" : "brown"}
        >
          {dayLabel}
        </Badge>
      </div>
    </PowerUpCard>
  );
};

export const getDailyRewardDayStatus = (
  day: number,
  dayInCycle: number,
  isPending: boolean
) => {
  if (day < dayInCycle) {
    return "claimed";
  }

  if (day > dayInCycle) {
    return "locked";
  }

  return isPending ? "current" : "next";
};

const formatDayLabel = (day: number): string => String(day).padStart(2, "0");
