import { Image } from "@unpic/react";
import type React from "react";
import { Coin } from "@/components/icons/coin";
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
import { StatRow } from "@/components/ui/stat-row";
import { FACTORIES, FACTORY_TYPES } from "@/content/factories";
import {
  useGoldEarnedByFactory,
  useTotalGoldEarned,
} from "@/store/atoms/statistics";

export const StatisticsDialog = (props: React.PropsWithChildren) => {
  const { children } = props;
  const totalGold = useTotalGoldEarned();

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
            <StatRow
              label={
                <span className="flex items-center gap-2">
                  <Coin aria-hidden className="size-5 shrink-0" />
                  Realm total
                </span>
              }
            >
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={totalGold}
              />
            </StatRow>

            {FACTORY_TYPES.map((factory) => (
              <FactoryStatRow factory={factory} key={factory} />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

const FactoryStatRow = ({
  factory,
}: {
  factory: (typeof FACTORY_TYPES)[number];
}) => {
  const goldEarned = useGoldEarnedByFactory(factory);

  return (
    <StatRow
      label={
        <span className="flex items-center gap-2">
          <Image
            alt=""
            aria-hidden
            className="pixel-crisp pointer-events-none size-6 rounded-md object-contain"
            height={24}
            layout="constrained"
            src={`/images/factories/${factory}.webp`}
            width={24}
          />
          {FACTORIES[factory].name}
        </span>
      }
    >
      <AnimatedNumber
        className="shrink-0 text-end text-2xl"
        value={goldEarned}
      />
    </StatRow>
  );
};
