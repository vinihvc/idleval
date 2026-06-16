import { Button } from "@/components/ui/button";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { claimDailyReward } from "@/store/atoms/daily-reward.actions";
import { useDailyReward } from "@/store/atoms/daily-reward.atom";

export const DailyRewardClaimButton = () => {
  const { isPending } = useDailyReward();
  const { announce, message } = useLiveAnnouncer();

  const claimReward = () => {
    if (claimDailyReward()) {
      announce(m["ui.a11y.claimed"]());
    }
  };

  return (
    <>
      <LiveAnnouncer message={message} />
      <Button
        className={cn("w-full min-w-0", [
          !isPending && [
            "border-dashed shadow-none",
            "border-secondary/25 bg-secondary/10 text-secondary max-sm:[-webkit-text-stroke-width:0]",
            "sm:border-primary/25 sm:bg-primary/10 sm:text-primary",
          ],
        ])}
        disabled={!isPending}
        onClick={isPending ? claimReward : undefined}
        size="lg"
        variant={isPending ? "green" : "brown"}
      >
        {isPending ? (
          <span className="truncate">{m["ui.daily.claim"]()}</span>
        ) : (
          <span className="truncate">{m["ui.daily.claimed"]()}</span>
        )}
      </Button>
    </>
  );
};
