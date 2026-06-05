import { Image } from "@unpic/react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import { borderedText } from "@/components/ui/text-border";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FactoryType } from "@/content/factories";
import { cn } from "@/lib/cn";
import { startProducing, useFactory } from "@/store/atoms/factories";
import { capitalize } from "@/utils/formatters";

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
            "size-24",
            "text-foreground",
            "border-3",
            "shrink-0",
            "rounded-full border-primary/70",
            "transition-all hover:border-primary/80",
            "data-[producing=true]:focus-visible:border-info data-[producing=true]:focus-visible:ring-info/50",
            "data-[producing=true]:border-info",
            className
          )}
          data-auto={isAutomated}
          data-producing={isProducing}
          data-unlocked={isUnlocked}
          disabled={isProducing || !isUnlocked || isAutomated}
          onClick={() => startProducing(factoryType)}
          size="icon-md"
          {...rest}
        >
          <div className="relative rounded-full border border-primary/40 p-1 group-data-[producing=true]:border-info">
            <Image
              alt={`Produce ${factoryType}`}
              className={cn(
                "rounded-full",
                "object-contain",
                "bg-popover p-1",
                "pixel-crisp",
                "pointer-events-none",
                "group-data-[unlocked=false]:grayscale"
              )}
              height={80}
              layout="constrained"
              src={`/images/factories/${factoryType}.webp`}
              width={80}
            />

            {isUpgraded && (
              <div className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border border-secondary bg-primary">
                <NumberText className="font-bold text-primary-foreground text-sm">
                  2x
                </NumberText>
              </div>
            )}
          </div>

          <span className="sr-only">{`Produce ${name}`}</span>

          {isUnlocked && (
            <div className="absolute -bottom-2">
              <span
                className={cn(
                  "h-6 w-18",
                  "flex items-center justify-center",
                  "bg-accent text-accent-foreground",
                  "font-number text-sm",
                  "rounded-lg border-3 border-primary/40",
                  "fade-in-50 slide-in-from-bottom-1 animate-in",
                  "group-data-[producing=true]:border-info-foreground/40 group-data-[producing=true]:bg-info group-data-[producing=true]:text-white",
                  borderedText({ variant: isProducing ? "blue" : "cream" })
                )}
              >
                <AnimatedNumber value={amount} />
              </span>
            </div>
          )}
        </Button>
      </TooltipTrigger>

      <TooltipContent>{`Produce ${capitalize(factoryType)}`}</TooltipContent>
    </Tooltip>
  );
};
