import type React from "react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { DAILY_REWARD_CALENDAR } from "@/content/power-ups";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { useDailyReward } from "@/store/atoms/inventory";
import { useNotificationDialogHandler } from "@/store/atoms/notifications";
import { claimDailyReward } from "@/store/atoms/power-ups.actions";
import { getDailyRewardDayStatus } from "./daily-reward.calendar";
import { DailyRewardDaySlot } from "./daily-reward.day-slot";

export const DailyRewardDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  const onOpenChange = useNotificationDialogHandler("daily");
  const { isPending, offer } = useDailyReward();
  const { announce, message } = useLiveAnnouncer();

  return (
    <ResponsiveDialog onOpenChange={onOpenChange}>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.daily.title"]()}
            src="/images/power-ups/power-ups.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{m["ui.daily.title"]()}</ResponsiveDialogTitle>

          <ResponsiveDialogDescription hideDescription>
            {m["ui.daily.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <LiveAnnouncer message={message} />
        <ResponsiveDialogBody>
          <div className="grid grid-cols-6 gap-2 pt-2">
            {DAILY_REWARD_CALENDAR.map((entry) => (
              <DailyRewardDaySlot
                day={entry.day}
                key={entry.day}
                powerUpId={entry.powerUpId}
                status={getDailyRewardDayStatus(
                  entry.day,
                  offer.dayInCycle,
                  isPending
                )}
              />
            ))}
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button
            className={cn("w-full", {
              "border-primary/25 border-dashed bg-primary/10! text-primary shadow-none hover:bg-primary/10":
                !isPending,
            })}
            disabled={!isPending}
            onClick={
              isPending
                ? () => {
                    if (claimDailyReward()) {
                      announce(m["ui.a11y.claimed"]());
                    }
                  }
                : undefined
            }
            variant={isPending ? "green" : "brown"}
          >
            {isPending ? m["ui.daily.claim"]() : m["ui.daily.claimed"]()}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default DailyRewardDialog;
