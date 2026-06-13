import { Button } from "@/components/ui/button";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { useDailyReward } from "@/store/atoms/inventory";
import { claimDailyReward } from "@/store/atoms/power-ups.actions";

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
        className={cn("w-full", [
          !isPending && [
            "border-dashed shadow-none",
            "border-secondary/25 bg-secondary/10 text-secondary max-sm:[-webkit-text-stroke-width:0]",
            "sm:border-primary/25 sm:bg-primary/10 sm:text-primary",
          ],
        ])}
        disabled={!isPending}
        onClick={isPending ? claimReward : undefined}
        variant={isPending ? "green" : "brown"}
      >
        {isPending ? m["ui.daily.claim"]() : m["ui.daily.claimed"]()}
      </Button>
    </>
  );
};
