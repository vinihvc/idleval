import { CalendarRange } from "pixelarticons/react/CalendarRange";
import { Clock } from "pixelarticons/react/Clock";
import { Hand } from "pixelarticons/react/Hand";
import { Heart } from "pixelarticons/react/Heart";
import React from "react";
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
import type { FactoryType } from "@/content/factories";
import { getFactoryYieldPerHour } from "@/game/factories";
import { m } from "@/i18n/messages";
import { useFactory, useProductionValue } from "@/store/atoms/factories";
import { useGoldEarnedByFactory } from "@/store/atoms/statistics";

interface FactoryDialogProps extends React.PropsWithChildren {
  /**
   * The factory type
   */
  factoryType: FactoryType;
}

interface FactoryDialogBodyProps {
  factoryType: FactoryType;
}

const FactoryDialogBody = (props: FactoryDialogBodyProps) => {
  const { factoryType } = props;

  const factory = useFactory(factoryType);
  const yieldPerTap = useProductionValue(factoryType);
  const yieldPerHour = getFactoryYieldPerHour(
    yieldPerTap,
    factory.productionTime
  );
  const lifetimeYield = useGoldEarnedByFactory(factoryType);

  return (
    <>
      <ResponsiveDialogMedia>
        <ResponsiveDialogImage
          alt={m["ui.factory.title"]({ "0": factory.name })}
          src={`/images/factories/${factoryType}.webp`}
        />
      </ResponsiveDialogMedia>

      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>{factory.name}</ResponsiveDialogTitle>

        <ResponsiveDialogDescription>
          {factory.description}
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>

      <ResponsiveDialogBody>
        <div className="flex gap-2">
          <StatTile icon={<Clock />} label={m["ui.factory.craftPace"]()}>
            <FormattedNumber value={factory.productionTime} />s
          </StatTile>

          <StatTile icon={<Hand />} label={m["ui.factory.yieldPerTap"]()}>
            <FormattedNumber value={yieldPerTap} />
          </StatTile>

          <StatTile
            icon={<CalendarRange />}
            label={m["ui.factory.yieldPerHour"]()}
          >
            <FormattedNumber value={yieldPerHour} />
          </StatTile>

          <StatTile icon={<Heart />} label={m["ui.factory.lifetimeYield"]()}>
            <FormattedNumber value={lifetimeYield} />
          </StatTile>
        </div>
      </ResponsiveDialogBody>
    </>
  );
};

export const FactoryDialog = (props: FactoryDialogProps) => {
  const { factoryType, children } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <ResponsiveDialog onOpenChange={setOpen} open={open}>
      {children}

      <ResponsiveDialogContent>
        {open ? <FactoryDialogBody factoryType={factoryType} /> : null}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default FactoryDialog;
