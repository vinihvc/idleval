import type React from "react";
import { DAILY_REWARD_CALENDAR } from "@/content/power-ups";
import { cn } from "@/lib/cn";
import {
  DailyRewardDaySlot,
  type DailyRewardDayStatus,
} from "./daily-reward.day-slot";

export const getDailyRewardDayStatus = (
  day: number,
  dayInCycle: number,
  isPending: boolean
): DailyRewardDayStatus => {
  if (day < dayInCycle) {
    return "claimed";
  }

  if (day > dayInCycle) {
    return "locked";
  }

  return isPending ? "current" : "next";
};

export interface DailyRewardCalendarProps extends React.ComponentProps<"div"> {
  dayInCycle: number;
  isPending: boolean;
}

export const DailyRewardCalendar = (props: DailyRewardCalendarProps) => {
  const { className, dayInCycle, isPending, ...rest } = props;

  return (
    <div
      className={cn("grid grid-cols-6 gap-2 pt-2", className)}
      data-slot="daily-reward-calendar"
      {...rest}
    >
      {DAILY_REWARD_CALENDAR.map((entry) => (
        <DailyRewardDaySlot
          day={entry.day}
          key={entry.day}
          powerUpId={entry.powerUpId}
          status={getDailyRewardDayStatus(entry.day, dayInCycle, isPending)}
          tier={entry.tier}
        />
      ))}
    </div>
  );
};
