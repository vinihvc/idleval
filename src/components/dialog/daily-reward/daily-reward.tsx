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
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { useDailyReward } from "@/store/atoms/inventory";
import { useNotificationDialogHandler } from "@/store/atoms/notifications";
import { claimDailyReward } from "@/store/atoms/power-ups.actions";
import { DailyRewardCalendar } from "./daily-reward.calendar";

const DailyRewardDialogBody = () => {
  const { isPending, offer } = useDailyReward();
  const { announce, message } = useLiveAnnouncer();

  return (
    <>
      <LiveAnnouncer message={message} />
      <ResponsiveDialogBody className="gap-4">
        <DailyRewardCalendar
          dayInCycle={offer.dayInCycle}
          isPending={isPending}
        />
      </ResponsiveDialogBody>

      <ResponsiveDialogFooter>
        <Button
          className="w-full"
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
          variant={isPending ? "default" : "green"}
        >
          {isPending ? m["ui.daily.claim"]() : m["ui.daily.claimed"]()}
        </Button>
      </ResponsiveDialogFooter>
    </>
  );
};

export const DailyRewardDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  const onOpenChange = useNotificationDialogHandler("daily");

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

          <ResponsiveDialogDescription>
            {m["ui.daily.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <DailyRewardDialogBody />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default DailyRewardDialog;
