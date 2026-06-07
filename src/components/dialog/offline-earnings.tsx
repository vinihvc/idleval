import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { type OfflineSummary, offlineSummaryAtom } from "@/store/offline";
import {
  amountFormatterWithDolarSign,
  formatElapsedDuration,
} from "@/utils/formatters";

interface OfflineEarningsDialogProps {
  summary: OfflineSummary;
}

export const OfflineEarningsDialog = (props: OfflineEarningsDialogProps) => {
  const { summary } = props;

  const setSummary = useSetAtom(offlineSummaryAtom);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSummary(null);
    }
  };

  return (
    <ResponsiveDialog onOpenChange={handleOpenChange} open role="alertdialog">
      <ResponsiveDialogContent showCloseButton={false}>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage alt="Treasury" src="/images/msc/gift.webp" />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Welcome back</ResponsiveDialogTitle>

          <ResponsiveDialogDescription hideDescription={false}>
            You were away for{" "}
            <span className="font-number text-2xl">
              {" "}
              {formatElapsedDuration(summary.elapsedMs)}
            </span>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="flex flex-col items-center gap-2 py-2">
            <span className="font-medium text-lg">You earned</span>
            <NumberText
              className="text-4xl text-primary tracking-widest"
              size="lg"
            >
              {amountFormatterWithDolarSign(summary.totalGold)}
            </NumberText>
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button className="w-full" variant="default">
              Claim &amp; Continue
            </Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
