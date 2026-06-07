import { Trans, useLingui } from "@lingui/react/macro";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import {
  ResponsiveDialog,
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
  const { t } = useLingui();

  const setSummary = useSetAtom(offlineSummaryAtom);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSummary(null);
    }
  };

  return (
    <ResponsiveDialog onOpenChange={handleOpenChange} open role="alertdialog">
      <ResponsiveDialogContent draggable={false} showCloseButton={false}>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={t`Treasury`}
            src="/images/msc/gift.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            <Trans>Welcome back</Trans>
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription hideDescription={false}>
            <Trans>
              You were away for{" "}
              <span className="font-number text-2xl">
                {formatElapsedDuration(summary.elapsedMs)}
              </span>{" "}
              and earned
              <NumberText className="text-2xl text-primary">
                {" "}
                {amountFormatterWithDolarSign(summary.totalGold)}
              </NumberText>
            </Trans>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button className="w-full" variant="default">
              <Trans>Claim &amp; Continue</Trans>
            </Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
