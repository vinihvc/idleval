import { PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { FACTORIES, type FactoryType } from "@/content/factories";
import {
  moneyEarnedByFactory,
  totalMoneyEarned,
} from "@/store/atoms/statistics";
import { AnimatedNumber } from "../ui/animated-number";
import { DialogNavTrigger } from "./dialog-nav-trigger";

interface StatisticsDialogProps {
  variant?: "bottom" | "header";
}

export const StatisticsDialog = (props: StatisticsDialogProps) => {
  const { variant = "header" } = props;

  return (
    <ResponsiveDialog>
      <DialogNavTrigger
        icon={PieChart}
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
            Check your statistics and see how you are doing.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold capitalize">Total</span>

              <AnimatedNumber value={totalMoneyEarned()} />
            </div>

            {Object.entries(FACTORIES).map(([key]) => (
              <div className="flex items-center justify-between" key={key}>
                <span className="font-semibold capitalize">{key}</span>

                <AnimatedNumber
                  value={moneyEarnedByFactory(key as FactoryType)}
                />
              </div>
            ))}
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button size="xl">Close Statistics</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
