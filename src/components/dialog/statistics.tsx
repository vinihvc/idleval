import { Trans, useLingui } from "@lingui/react/macro";
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
import { FACTORY_TYPES, type FactoryType } from "@/content/factories.types";
import { useLocalizedFactoryName } from "@/hooks/use-localized-factory";
import { useGods } from "@/store/atoms/gods";
import {
  useGoldEarnedByFactory,
  useTotalGoldEarned,
} from "@/store/atoms/statistics";

export const StatisticsDialog = (props: React.PropsWithChildren) => {
  const { children } = props;
  const { t } = useLingui();

  const totalGold = useTotalGoldEarned();
  const { count: godsInvoked } = useGods();

  return (
    <ResponsiveDialog>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={t`Statistics`}
            src="/images/msc/statistic.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            <Trans>Statistics</Trans>
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            <Trans>Review the ledgers of your realm&apos;s triumphs.</Trans>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            <StatTile
              icon={<Coin aria-hidden className="size-6 shrink-0" />}
              label={t`Realm total`}
            >
              <FormattedNumber value={totalGold} />
            </StatTile>

            <StatTile
              icon={
                <Image
                  alt=""
                  aria-hidden
                  className="pixel-crisp pointer-events-none size-8 rounded-md object-contain"
                  height={32}
                  layout="constrained"
                  src="/images/gods/gods.webp"
                  width={32}
                />
              }
              label={t`Gods`}
            >
              <FormattedNumber value={godsInvoked} />
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
  const name = useLocalizedFactoryName(factory);

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
      label={name}
    >
      <FormattedNumber value={goldEarned} />
    </StatTile>
  );
};
