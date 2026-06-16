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
import { AboutContent } from "./about.content";

export const AboutDialog = () => {
  const open = useDialogOpen(DIALOG_IDS.about);

  return (
    <ResponsiveDialog
      onOpenChange={(nextOpen) => setDialogOpen(DIALOG_IDS.about, nextOpen)}
      open={open}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.about.imageAlt"]()}
            src="/images/characters/aru.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{m["ui.about.title"]()}</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {m["ui.about.realmDescription"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <AboutContent />
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default AboutDialog;
