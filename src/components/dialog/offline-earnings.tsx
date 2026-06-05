import { useSetAtom } from "jotai";
import { Coins } from "pixelarticons/react";
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
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { FACTORIES } from "@/content/factories";
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
    <ResponsiveDialog onOpenChange={handleOpenChange} open>
      <ResponsiveDialogContent>
        <ResponsiveDialogImage alt="Treasury" src="/images/msc/gift.webp" />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Welcome back</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Your managers kept the realm earning while you were away for{" "}
            {formatElapsedDuration(summary.elapsedMs)}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex items-center gap-2 font-number text-2xl text-primary">
              <Coins className="size-6" />
              <NumberText>
                {amountFormatterWithDolarSign(summary.totalGold)}
              </NumberText>
            </div>

            {summary.results.length > 0 && (
              <ul className="w-full space-y-2 text-sm">
                {summary.results.map((result) => (
                  <li
                    className="flex items-center justify-between gap-2 rounded-md border border-primary/30 bg-muted/50 px-3.5 py-1"
                    key={result.factory}
                  >
                    <span>{FACTORIES[result.factory].name}</span>
                    <span className="font-number text-muted-foreground">
                      {result.cycles}×{" "}
                      <NumberText>
                        {amountFormatterWithDolarSign(result.goldEarned)}
                      </NumberText>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button className="w-full" variant="default">
              Continue
            </Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
