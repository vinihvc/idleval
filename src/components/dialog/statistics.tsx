import type { PropsWithChildren } from "react";
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
import { FACTORY_TYPES } from "@/content/factories";
import { goldEarnedByFactory, totalGoldEarned } from "@/store/atoms/statistics";

export const StatisticsDialog = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <ResponsiveDialog>
      {children}

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
            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3.5 py-1 font-medium text-lg text-popover-foreground">
              <span className="shrink-0 capitalize">Realm total</span>
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={totalGoldEarned()}
              />
            </div>

            {FACTORY_TYPES.map((factory) => (
              <div
                className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3.5 py-1 font-medium text-lg text-popover-foreground"
                key={factory}
              >
                <span className="shrink-0 capitalize">{factory}</span>
                <AnimatedNumber
                  className="shrink-0 text-end text-2xl"
                  value={goldEarnedByFactory(factory)}
                />
              </div>
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
