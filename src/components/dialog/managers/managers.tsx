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
import { ManagersContent } from "./managers.content";

export const ManagersDialog = () => {
  const open = useDialogOpen(DIALOG_IDS.managers);

  return (
    <ResponsiveDialog
      onOpenChange={(nextOpen) => setDialogOpen(DIALOG_IDS.managers, nextOpen)}
      open={open}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.managers.imageAlt"]()}
            src="/images/characters/whiskerwick.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {m["ui.managers.title"]()}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {m["ui.managers.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <ManagersContent />
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
