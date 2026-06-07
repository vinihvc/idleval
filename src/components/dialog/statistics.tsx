import { Image } from "@unpic/react";
import type React from "react";
import { Coin } from "@/components/icons/coin";
import { FormattedNumber } from "@/components/ui/formatted-number";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { StatTile } from "@/components/ui/stats";
import {
  FACTORIES,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
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
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt="Statistics"
            src="/images/msc/statistic.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Statistics</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Review the ledgers of your realm&apos;s triumphs.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            <StatTile
              icon={<Coin aria-hidden className="size-6 shrink-0" />}
              label="Realm total"
            >
              <FormattedNumber value={totalGold} />
            </StatTile>

            {FACTORY_TYPES.map((factory) => (
              <FactoryStatTile factory={factory} key={factory} />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

interface FactoryStatTileProps {
  factory: FactoryType;
}

const FactoryStatTile = (props: FactoryStatTileProps) => {
  const { factory } = props;

  const goldEarned = useGoldEarnedByFactory(factory);

  return (
    <StatTile
      icon={
        <Image
          alt=""
          aria-hidden
          className="pixel-crisp pointer-events-none size-8 rounded-md object-contain"
          height={32}
          layout="constrained"
          src={`/images/factories/${factory}.webp`}
          width={32}
        />
      }
      label={FACTORIES[factory].name}
    >
      <FormattedNumber value={goldEarned} />
    </StatTile>
  );
};
