import { Image } from "@unpic/react";
import { Coin } from "@/components/icons/coin";
import { FormattedNumber } from "@/components/ui/formatted-number";
import { StatTile } from "@/components/ui/stats";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import { useLocalizedFactoryName } from "@/i18n/hooks/use-localized-factory";
import { m } from "@/i18n/messages";
import { useGods } from "@/store/atoms/gods";
import {
  useGoldEarnedByFactory,
  useTotalGoldEarned,
} from "@/store/atoms/statistics";

export const StatisticsContent = () => {
  const totalGold = useTotalGoldEarned();
  const { count: godsInvoked } = useGods();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <StatTile
        icon={
          <Coin aria-hidden className="size-6 shrink-0" intrinsicSize={24} />
        }
        label={m["ui.statistics.realmTotal"]()}
      >
        <FormattedNumber isDollar value={totalGold} />
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
        label={m["ui.nav.gods"]()}
      >
        <FormattedNumber value={godsInvoked} />
      </StatTile>

      {FACTORY_TYPES.map((factory) => (
        <FactoryStatTile factory={factory} key={factory} />
      ))}
    </div>
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
      <FormattedNumber isDollar value={goldEarned} />
    </StatTile>
  );
};
