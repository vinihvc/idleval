import { DAILY_REWARD_CALENDAR } from "@/content/power-ups";
import { DailyRewardCard } from "./daily-reward.card";

export const DailyRewardContent = () => (
  <div className="mt-2 grid grid-cols-3 gap-2 gap-y-4 sm:grid-cols-6 sm:gap-y-2">
    {DAILY_REWARD_CALENDAR.map((entry) => (
      <DailyRewardCard key={entry.powerUpId} powerUpId={entry.powerUpId} />
    ))}
  </div>
);
