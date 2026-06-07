import { CalendarRange, Clock, Hand, Heart } from "pixelarticons/react";
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
  const yieldPerHour = yieldPerTap.times(3600).div(factory.productionTime);
  const lifetimeYield = useGoldEarnedByFactory(factoryType);

  return (
    <>
      <ResponsiveDialogMedia>
        <ResponsiveDialogImage
          alt={`Factory of ${factory.name}`}
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
        <div className="flex gap-1.5">
          <StatTile icon={<Clock />} label="Craft pace">
            <FormattedNumber value={factory.productionTime} />s
          </StatTile>

          <StatTile icon={<Hand />} label="Yield per tap">
            <FormattedNumber value={yieldPerTap} />
          </StatTile>

          <StatTile icon={<CalendarRange />} label="Yield per hour">
            <FormattedNumber value={yieldPerHour} />
          </StatTile>

          <StatTile icon={<Heart />} label="Lifetime yield">
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
