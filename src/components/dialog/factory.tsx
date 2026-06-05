import { AnimatedNumber } from "@/components/ui/animated-number";
import { NumberText } from "@/components/ui/number-text";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import type { FactoryType } from "@/content/factories";
import { getProductionValue, useFactory } from "@/store/atoms/factories";
import { getGodsProductionMultiplier } from "@/store/atoms/gods";
import { goldEarnedByFactory } from "@/store/atoms/statistics";
import { amountFormatter } from "@/utils/formatters";

interface FactoryDialogProps extends React.PropsWithChildren {
  /**
   * The factory type
   */
  factoryType: FactoryType;
}

export const FactoryDialog = (props: FactoryDialogProps) => {
  const { factoryType, children } = props;

  const factory = useFactory(factoryType);
  const yieldPerTap = getProductionValue(factoryType);
  const yieldPerHour = yieldPerTap.times(3600).div(factory.productionTime);
  const divineMultiplier = getGodsProductionMultiplier();
  const showDivineBonus = divineMultiplier.gt(1);

  return (
    <ResponsiveDialog>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogImage
          alt={`Factory of ${factory.name}`}
          src={`/images/factories/${factoryType}.webp`}
        />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{factory.name}</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {factory.description}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3.5 py-1 font-medium text-lg text-popover-foreground">
              <span className="shrink-0">Craft pace</span>
              <NumberText className="shrink-0 text-end text-2xl">
                {factory.productionTime}s
              </NumberText>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3.5 py-1 font-medium text-lg text-popover-foreground">
              <span className="shrink-0">Yield per tap</span>
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={yieldPerTap}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3.5 py-1 font-medium text-lg text-popover-foreground">
              <span className="shrink-0">Yield per hour</span>
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={yieldPerHour}
              />
            </div>

            {showDivineBonus && (
              <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3.5 py-1 font-medium text-lg text-popover-foreground">
                <span className="shrink-0">Divine bonus</span>
                <NumberText className="shrink-0 text-end text-2xl">
                  ×{amountFormatter(divineMultiplier)}
                </NumberText>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3.5 py-1 font-medium text-lg text-popover-foreground">
              <span className="shrink-0">Lifetime yield</span>
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={goldEarnedByFactory(factoryType)}
              />
            </div>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
