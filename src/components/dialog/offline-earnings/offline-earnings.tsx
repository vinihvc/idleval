import { ParaglideMessage } from "@inlang/paraglide-js-react";
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
import { m } from "@/i18n/messages";
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
      <ResponsiveDialogContent draggable={false} showCloseButton={false}>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.nav.treasury"]()}
            src="/images/msc/gift.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {m["ui.offline.welcomeBack"]()}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription hideDescription={false}>
            <ParaglideMessage
              inputs={{
                "0": formatElapsedDuration(summary.elapsedMs),
                "1": amountFormatterWithDolarSign(summary.totalGold),
              }}
              markup={{
                duration: ({ children }) => (
                  <span className="font-number text-2xl">{children}</span>
                ),
                amount: ({ children }) => (
                  <NumberText className="text-2xl text-primary">
                    {children}
                  </NumberText>
                ),
              }}
              message={m["ui.offline.summary"]}
            />
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button className="w-full" variant="default">
              {m["ui.offline.claimContinue"]()}
            </Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
