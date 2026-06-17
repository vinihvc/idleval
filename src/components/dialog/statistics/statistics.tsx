import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
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
import { StatisticsContent } from "./statistics.content";

export const StatisticsDialog = () => {
  const open = useDialogOpen(DIALOG_IDS.statistics);

  return (
    <ResponsiveDialog
      onOpenChange={(nextOpen) =>
        setDialogOpen(DIALOG_IDS.statistics, nextOpen)
      }
      open={open}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.statistics.imageAlt"]()}
            src="/images/characters/tallyfang.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {m["ui.statistics.title"]()}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {m["ui.statistics.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <StatisticsContent />
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
