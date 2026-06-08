import { Image } from "@unpic/react";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import { borderedText } from "@/components/ui/text-border";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  canStartManualProduction,
  getUpgradeMultiplierLabel,
} from "@/game/factories";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { startProducing } from "@/store/atoms/factories";
import { useFactoryCard } from "./factory-card.context";

interface FactoryCardProduceProps extends React.ComponentProps<typeof Button> {}

export const FactoryCardProduce = (props: FactoryCardProduceProps) => {
  const { className, ...rest } = props;

  const {
    factoryType,
    name,
    amount,
    isProducing,
    isUnlocked,
    isAutomated,
    isUpgraded,
  } = useFactoryCard();

  const produceLabel = m["ui.factoryCard.produce"]({ name });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "group relative",
            "size-24",
            "bg-card",
            "text-foreground",
            "shrink-0",
            "rounded-full border-3 border-primary/70",
            "transition-all hover:border-primary/80",
            "data-[producing=true]:focus-visible:border-info data-[producing=true]:focus-visible:ring-info/50",
            "data-[producing=true]:border-info",
            className
          )}
          data-auto={isAutomated}
          data-producing={isProducing}
          data-unlocked={isUnlocked}
          disabled={
            !canStartManualProduction({ isProducing, isUnlocked, isAutomated })
          }
          onClick={() => startProducing(factoryType)}
          size="icon-md"
          {...rest}
        >
          <div
            className={cn(
              "relative",
              "p-2",
              "bg-secondary",
              "rounded-full border-3 border-primary/40",
              "group-data-[producing=true]:border-info"
            )}
          >
            <div className="size-16 overflow-hidden rounded-full bg-card p-2 ring-4 ring-offset-4 ring-offset-secondary">
              <Image
                alt={produceLabel}
                className={cn(
                  "",
                  "object-contain",
                  "pixel-crisp",
                  "pointer-events-none",
                  "group-data-[unlocked=false]:grayscale"
                )}
                height={64}
                layout="constrained"
                src={`/images/factories/${factoryType}.webp`}
                width={64}
              />
            </div>

            {isUpgraded && (
              <div className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border border-secondary bg-primary">
                <NumberText className="text-xs" variant="cream">
                  {getUpgradeMultiplierLabel()}
                </NumberText>
              </div>
            )}
          </div>

          <span className="sr-only">{produceLabel}</span>

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
                <NumberText variant="cream">{amount}</NumberText>
              </span>
            </div>
          )}
        </Button>
      </TooltipTrigger>

      <TooltipContent>{produceLabel}</TooltipContent>
    </Tooltip>
  );
};
