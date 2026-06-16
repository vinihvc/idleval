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
import { SettingsContent } from "./settings.content";

export const SettingsDialog = () => {
  const open = useDialogOpen(DIALOG_IDS.settings);

  return (
    <ResponsiveDialog
      onOpenChange={(nextOpen) => setDialogOpen(DIALOG_IDS.settings, nextOpen)}
      open={open}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.settings.imageAlt"]()}
            src="/images/characters/chiron.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {m["ui.settings.title"]()}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {m["ui.settings.subtitle"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="grid min-w-0 gap-4 overflow-x-hidden">
          <SettingsContent />
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default SettingsDialog;
