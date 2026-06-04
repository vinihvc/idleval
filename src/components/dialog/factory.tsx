import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
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
import { moneyEarnedByFactory, useFactory } from "@/store";
import { AnimatedNumber } from "../ui/animated-number";

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
            <Button className="shrink-0" size="icon" variant="blue">
              <span className="sr-only">{`${factory.name}'s Info`}</span>
              <Info className="size-4" />
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>

        <TooltipContent>{`${factory.name}'s Info`}</TooltipContent>
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
            <p className="font-semibold text-lg">Statistics</p>

            <div className="flex justify-between">
              <div>Production speed</div>

              <span>{`${factory.productionTime}s`}</span>
            </div>

            <div className="flex justify-between">
              <div>Production per click</div>
              <AnimatedNumber value={factory.productionValue} />
            </div>

            <div className="flex justify-between">
              <div>Production per hour</div>
              <AnimatedNumber value={factory.productionValue * 3600} />
            </div>

            <div className="flex justify-between">
              <div>Total produced</div>
              <AnimatedNumber value={moneyEarnedByFactory(factoryType)} />
            </div>
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button size="xl">Close Info</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
