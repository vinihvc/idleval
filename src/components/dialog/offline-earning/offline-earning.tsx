import React from "react";
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
  openDialog,
  setDialogOpen,
  useDialogOpen,
} from "@/store/atoms/dialogs";
import {
  clearOfflineSummary,
  type OfflineSummary,
} from "@/store/offline-earning";
import { OfflineEarningActions } from "./offline-earning.actions";
import { OfflineEarningSummary } from "./offline-earning.summary";

interface OfflineEarningDialogProps {
  /**
   * The summary of the offline earning
   */
  summary: OfflineSummary;
}

export const OfflineEarningDialog = (props: OfflineEarningDialogProps) => {
  const { summary } = props;
  const open = useDialogOpen(DIALOG_IDS.offlineEarning);
  const wasOpenRef = React.useRef(open);

  React.useEffect(() => {
    openDialog(DIALOG_IDS.offlineEarning);
  }, []);

  React.useEffect(() => {
    if (wasOpenRef.current && !open) {
      clearOfflineSummary();
    }

    wasOpenRef.current = open;
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    setDialogOpen(DIALOG_IDS.offlineEarning, nextOpen);

    if (!nextOpen) {
      clearOfflineSummary();
    }
  };

  return (
    <ResponsiveDialog
      onOpenChange={handleOpenChange}
      open={open}
      role="alertdialog"
    >
      <ResponsiveDialogContent draggable={false} showCloseButton={false}>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.offline.imageAlt"]()}
            src="/images/characters/zurvan.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {m["ui.offline.welcomeBack"]()}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {m["ui.offline.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <OfflineEarningSummary summary={summary} />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <OfflineEarningActions />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default OfflineEarningDialog;
