import { InfoBox } from "pixelarticons/react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FactoryType } from "@/content/factories";
import { useFactory } from "@/store/atoms/factories";
import { goldEarnedByFactory } from "@/store/atoms/statistics";

interface FactoryDialogProps {
  /**
   * The factory type
   */
  factoryType: FactoryType;
}

export const FactoryDialog = (props: FactoryDialogProps) => {
  const { factoryType } = props;

  const factory = useFactory(factoryType);

  return (
    <ResponsiveDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveDialogTrigger asChild>
            <Button className="size-9 shrink-0" size="icon-lg" variant="blue">
              <span className="sr-only">{`${factory.name} ledger`}</span>
              <InfoBox className="size-4" />
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>

        <TooltipContent>{`${factory.name} ledger`}</TooltipContent>
      </Tooltip>

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
            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3 py-2 font-medium text-lg text-popover-foreground">
              <span className="shrink-0">Craft pace</span>
              <NumberText className="shrink-0 text-end text-2xl">
                {factory.productionTime}s
              </NumberText>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3 py-2 font-medium text-lg text-popover-foreground">
              <span className="shrink-0">Yield per tap</span>
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={factory.productionValue}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3 py-2 font-medium text-lg text-popover-foreground">
              <span className="shrink-0">Yield per hour</span>
              <AnimatedNumber
                className="shrink-0 text-end text-2xl"
                value={factory.productionValue * 3600}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3 py-2 font-medium text-lg text-popover-foreground">
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
