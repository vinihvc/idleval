import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IS_DEV } from "@/lib/envs";
import {
  DIALOG_IDS,
  setDialogOpen,
  useDialogOpen,
} from "@/store/atoms/dialogs";
import { useFactories } from "@/store/atoms/factories";

export const FactoriesStateDialog = () => {
  const open = useDialogOpen(DIALOG_IDS.debugFactories);
  const factories = useFactories();
  const json = JSON.stringify(factories, null, 2);

  if (!IS_DEV) {
    return null;
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setDialogOpen(DIALOG_IDS.debugFactories, nextOpen);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(json).catch(() => {
      // Clipboard unavailable in this context.
    });
  };

  return (
    <ResponsiveDialog onOpenChange={handleOpenChange} open={open}>
      <ResponsiveDialogContent className="max-h-[85vh] sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Factories state</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="min-h-0 flex-1">
          <ScrollArea className="max-h-[60vh] rounded-md border bg-muted/30 p-3">
            <pre className="whitespace-pre-wrap break-all font-number text-xs">
              {json}
            </pre>
          </ScrollArea>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button onClick={handleCopy} type="button" variant="default">
            Copy
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default FactoriesStateDialog;
