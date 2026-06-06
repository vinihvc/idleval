import { CalendarRange, Clock, Crown, Hand, Heart } from "pixelarticons/react";
import type React from "react";
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
import { StatRow } from "@/components/ui/stat-row";
import type { FactoryType } from "@/content/factories";
import { useFactory, useProductionValue } from "@/store/atoms/factories";
import { useGodsProductionMultiplier } from "@/store/atoms/gods";
import { useGoldEarnedByFactory } from "@/store/atoms/statistics";
import { amountFormatter } from "@/utils/formatters";

interface FactoryDialogProps extends React.PropsWithChildren {
  factoryType: FactoryType;
}

export const FactoryDialog = (props: FactoryDialogProps) => {
  const { factoryType, children } = props;

  const factory = useFactory(factoryType);
  const yieldPerTap = useProductionValue(factoryType);
  const yieldPerHour = yieldPerTap.times(3600).div(factory.productionTime);
  const divineMultiplier = useGodsProductionMultiplier();
  const lifetimeYield = useGoldEarnedByFactory(factoryType);
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
            <StatRow
              label={
                <span className="flex items-center gap-2">
                  <Clock aria-hidden className="size-5 shrink-0" />
                  Craft pace
                </span>
              }
            >
              <NumberText className="shrink-0 text-end text-2xl">
                {factory.productionTime}s
              </NumberText>
            </StatRow>

            <StatRow
              label={
                <span className="flex items-center gap-2">
                  <Hand aria-hidden className="size-5 shrink-0" />
                  Yield per tap
                </span>
              }
            >
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={yieldPerTap}
              />
            </StatRow>

            <StatRow
              label={
                <span className="flex items-center gap-2">
                  <CalendarRange aria-hidden className="size-5 shrink-0" />
                  Yield per hour
                </span>
              }
            >
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={yieldPerHour}
              />
            </StatRow>

            {showDivineBonus && (
              <StatRow
                label={
                  <span className="flex items-center gap-2">
                    <Crown aria-hidden className="size-5 shrink-0" />
                    Divine bonus
                  </span>
                }
              >
                <NumberText className="shrink-0 text-end text-2xl">
                  ×{amountFormatter(divineMultiplier)}
                </NumberText>
              </StatRow>
            )}

            <StatRow
              label={
                <span className="flex items-center gap-2">
                  <Heart aria-hidden className="size-5 shrink-0" />
                  Lifetime yield
                </span>
              }
            >
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={lifetimeYield}
              />
            </StatRow>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
