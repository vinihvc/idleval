import { Check } from "pixelarticons/react/Check";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import {
  PowerUpCard,
  PowerUpCardMedia,
} from "@/components/ui/power-up-card/power-up-card";
import type { PowerUpId } from "@/content/power-ups";
import { getDailyRewardDayStatus } from "@/game/daily-reward";
import { useDailyReward } from "@/store/atoms/daily-reward.atom";

export interface DailyRewardCardProps extends React.ComponentProps<"div"> {
  /**
   * Calendar day (1-6) for this ritual slot.
   */
  day: number;
  /**
   * The power up ID to display.
   */
  powerUpId: PowerUpId;
}

export const DailyRewardCard = (props: DailyRewardCardProps) => {
  const { day, powerUpId, className, ...rest } = props;

  const { isPending, offer } = useDailyReward();

  const status = getDailyRewardDayStatus(day, offer.dayInCycle, isPending);
  const dayLabel = String(day).padStart(2, "0");

  const isClaimed = status === "claimed";
  const isClaimable = status === "current";
  const isGreen = isClaimed || isClaimable;

  return (
    <PowerUpCard
      className={className}
      variant={isGreen ? "green" : "default"}
      {...rest}
    >
      <PowerUpCardMedia className="py-6 sm:pb-2" powerUpId={powerUpId} />

      {isClaimed && (
        <div
          aria-hidden
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xs bg-success/64"
        >
          <Check className="size-10 text-white" />
        </div>
      )}
      <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 shadow-xs/5">
        <Badge
          className="px-3 font-number text-base tabular-nums"
          size="lg"
          variant={isGreen ? "green" : "brown"}
        >
          {dayLabel}
        </Badge>
      </div>
    </PowerUpCard>
  );
};
