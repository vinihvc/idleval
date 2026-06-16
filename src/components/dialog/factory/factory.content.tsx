import { CalendarRange } from "pixelarticons/react/CalendarRange";
import { Clock } from "pixelarticons/react/Clock";
import { Hand } from "pixelarticons/react/Hand";
import { Heart } from "pixelarticons/react/Heart";
import { FormattedNumber } from "@/components/ui/formatted-number";
import { StatTile } from "@/components/ui/stats";
import type { FactoryType } from "@/content/factories";
import { getFactoryYieldPerHour } from "@/game/factories";
import { m } from "@/i18n/messages";
import { useFactory, useProductionValue } from "@/store/atoms/factories";
import { useGoldEarnedByFactory } from "@/store/atoms/statistics";

interface FactoryContentProps {
  factoryType: FactoryType;
}

export const FactoryContent = (props: FactoryContentProps) => {
  const { factoryType } = props;

  const factory = useFactory(factoryType);
  const yieldPerTap = useProductionValue(factoryType);
  const yieldPerHour = getFactoryYieldPerHour(
    yieldPerTap,
    factory.productionTime
  );
  const lifetimeYield = useGoldEarnedByFactory(factoryType);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <StatTile icon={<Clock />} label={m["ui.factory.craftPace"]()}>
        <FormattedNumber value={factory.productionTime} />s
      </StatTile>

      <StatTile icon={<Hand />} label={m["ui.factory.yieldPerTap"]()}>
        <FormattedNumber isDollar value={yieldPerTap} />
      </StatTile>

      <StatTile icon={<CalendarRange />} label={m["ui.factory.yieldPerHour"]()}>
        <FormattedNumber isDollar value={yieldPerHour} />
      </StatTile>

      <StatTile icon={<Heart />} label={m["ui.factory.lifetimeYield"]()}>
        <FormattedNumber isDollar value={lifetimeYield} />
      </StatTile>
    </div>
  );
};
