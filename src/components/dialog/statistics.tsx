import { Chart } from "pixelarticons/react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { FACTORIES, type FactoryType } from "@/content/factories";
import { goldEarnedByFactory, totalGoldEarned } from "@/store/atoms/statistics";
import { DialogNavTrigger } from "./dialog-nav-trigger";

interface StatisticsDialogProps {
  variant?: "bottom" | "header";
}

export const StatisticsDialog = (props: StatisticsDialogProps) => {
  const { variant = "header" } = props;

  return (
    <ResponsiveDialog>
      <DialogNavTrigger
        icon={Chart}
        label="Statistics"
        value="statistics"
        variant={variant}
      />

      <ResponsiveDialogContent>
        <ResponsiveDialogImage
          alt="Statistics"
          src="/images/msc/statistic.webp"
        />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Statistics</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Review the ledgers of your realm&apos;s triumphs.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3 py-2 font-medium text-lg text-popover-foreground">
              <span className="shrink-0 capitalize">Realm total</span>
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={totalGoldEarned()}
              />
            </div>

            {Object.entries(FACTORIES).map(([key]) => (
              <div
                className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3 py-2 font-medium text-lg text-popover-foreground"
                key={key}
              >
                <span className="shrink-0 capitalize">{key}</span>
                <AnimatedNumber
                  className="shrink-0 text-end text-2xl"
                  value={goldEarnedByFactory(key as FactoryType)}
                />
              </div>
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
