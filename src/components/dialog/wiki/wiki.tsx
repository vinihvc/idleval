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
import { WikiContent } from "./wiki.content";

export const WikiDialog = () => {
  const open = useDialogOpen(DIALOG_IDS.wiki);

  return (
    <ResponsiveDialog
      onOpenChange={(nextOpen) => setDialogOpen(DIALOG_IDS.wiki, nextOpen)}
      open={open}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.wiki.imageAlt"]()}
            src="/images/characters/minerva.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{m["ui.wiki.title"]()}</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {m["ui.wiki.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="text-popover-foreground">
          <WikiContent />
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default WikiDialog;
