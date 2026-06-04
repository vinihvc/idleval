import { Image } from "@unpic/react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FactoryType } from "@/content/factories";
import { cn } from "@/lib/cn";
import { startProducing, useFactory } from "@/store/atoms/factories";
import { capitalize } from "@/utils/formatters";
import { AnimatedNumber } from "../animated-number";
import { borderedText } from "../text-border";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

interface FactoryCardProduceProps extends React.ComponentProps<typeof Button> {
  /**
   * The factory type
   */
  factoryType: FactoryType;
}

export const FactoryCardProduce = (props: FactoryCardProduceProps) => {
  const { factoryType, className, ...rest } = props;

  const { name, amount, isProducing, isUnlocked, isAutomated, isUpgraded } =
    useFactory(factoryType);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "group relative",
            "size-22",
            "text-background",
            "border-2",
            "shrink-0",
            "rounded-full border-foreground",
            "data-[producing=true]:focus-visible:border-blue-600 data-[producing=true]:focus-visible:ring-blue-600/50",
            "data-[producing=true]:border-blue-600",
            className
          )}
          data-auto={isAutomated}
          data-producing={isProducing}
          data-unlocked={isUnlocked}
          disabled={isProducing || !isUnlocked || isAutomated}
          onClick={() => startProducing(factoryType)}
          size="icon"
          {...rest}
        >
          <div className="relative rounded-full border border-background/50 p-1 group-data-[producing=true]:border-blue-600">
            <Image
              alt={`Produce ${factoryType}`}
              className={cn(
                "rounded-full",
                "bg-background p-1",
                "[image-rendering:pixelated]",
                "pointer-events-none",
                "group-data-[unlocked=false]:grayscale"
              )}
              height={80}
              layout="constrained"
              src={`/images/factories/${factoryType}.webp`}
              width={80}
            />

            {isUpgraded && (
              <div className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-background/20 bg-foreground">
                <span className="font-bold text-[10px]">2x</span>
              </div>
            )}
          </div>

          <span className="sr-only">{`Produce ${name}`}</span>

          {isUnlocked && (
            <div className="absolute -bottom-2">
              <span
                className={cn(
                  "fade-in-50 slide-in-from-bottom-1 flex h-6 w-18 animate-in items-center justify-center rounded-lg border border-background/20 bg-foreground text-background text-xs",
                  "group-data-[producing=true]:border-blue-800 group-data-[producing=true]:bg-blue-600",
                  borderedText({ variant: isProducing ? "blue" : "black" })
                )}
              >
                <AnimatedNumber value={amount} />
              </span>
            </div>
          )}

          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LockKeyhole className="size-5" />
            </div>
          )}
        </Button>
      </TooltipTrigger>

      <TooltipContent>{`Produce ${capitalize(factoryType)}`}</TooltipContent>
    </Tooltip>
  );
};
