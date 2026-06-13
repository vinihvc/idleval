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
import { m } from "@/i18n/messages";
import {
  DIALOG_IDS,
  setDialogOpen,
  useDialogOpen,
} from "@/store/atoms/dialogs";
import { DailyRewardClaimButton } from "./daily-reward.claim-button";
import { DailyRewardContent } from "./daily-reward.content";

export const DailyRewardDialog = () => {
  const open = useDialogOpen(DIALOG_IDS.dailyReward);

  return (
    <ResponsiveDialog
      onOpenChange={(nextOpen) =>
        setDialogOpen(DIALOG_IDS.dailyReward, nextOpen)
      }
      open={open}
    >
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

        <ResponsiveDialogBody>
          <DailyRewardContent />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <DailyRewardClaimButton />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default DailyRewardDialog;
