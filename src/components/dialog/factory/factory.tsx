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
import type { FactoryType } from "@/content/factories";
import { useLocalizedFactoryView } from "@/hooks/use-localized-factory-view";
import { m } from "@/i18n/messages";
import {
  getFactoryDialogId,
  setDialogOpen,
  useDialogOpen,
} from "@/store/atoms/dialogs";
import { FactoryContent } from "./factory.content";

interface FactoryDialogProps {
  /**
   * The factory type
   */
  factoryType: FactoryType;
}

export const FactoryDialog = (props: FactoryDialogProps) => {
  const { factoryType } = props;
  const dialogId = getFactoryDialogId(factoryType);
  const factory = useLocalizedFactoryView(factoryType);
  const open = useDialogOpen(dialogId);

  return (
    <ResponsiveDialog
      onOpenChange={(nextOpen) => setDialogOpen(dialogId, nextOpen)}
      open={open}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.factory.title"]({ "0": factory.name })}
            src={`/images/factories/${factoryType}.webp`}
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{factory.name}</ResponsiveDialogTitle>

          <ResponsiveDialogDescription hideDescription={false}>
            {factory.description}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <FactoryContent factoryType={factoryType} />
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
