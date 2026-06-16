import { Image } from "@unpic/react";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import { borderedText } from "@/components/ui/text-border";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ECONOMY } from "@/game/economy";
import { canStartManualProduction } from "@/game/factories";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { startProducing } from "@/store/atoms/factories";
import { useFactoryCard } from "./factory-card.context";

export const FactoryCardProduce = (
  props: React.ComponentProps<typeof Button>
) => {
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
            "group",
            "absolute top-1/2 left-0 z-10 -translate-y-1/2",
            "size-24 border-0 bg-transparent p-0 shadow-none",
            "hover:bg-transparent",
            "focus-visible:ring-0",
            className
          )}
          data-auto={isAutomated}
          data-producing={isProducing}
          data-unlocked={isUnlocked}
          disabled={
            !canStartManualProduction({ isProducing, isUnlocked, isAutomated })
          }
          onClick={() => startProducing(factoryType)}
          variant="ghost"
          {...rest}
        >
          <div
            className={cn(
              "relative inline-flex items-center justify-center",
              "size-24",
              "p-1",
              "bg-card",
              "rounded-full border-8 border-secondary ring-4 ring-primary drop-shadow-md/5 sm:border-6",
              "group-data-[producing=true]:border-info group-data-[producing=true]:ring-info/50"
            )}
            data-slot="dialog-media"
          >
            <div
              className={cn(
                "relative",
                "group-data-[producing=true]:border-info",
                "group-data-[unlocked=false]:grayscale"
              )}
            >
              <Image
                alt={produceLabel}
                aria-hidden
                className={cn(
                  "pixel-crisp object-cover",
                  "aspect-square size-13",
                  "pointer-events-none"
                )}
                data-slot="dialog-image"
                height={112}
                layout="constrained"
                src={`/images/factories/${factoryType}.webp`}
                width={112}
              />
            </div>

            {isUpgraded && (
              <div className="absolute -top-1 -right-1 flex size-6.5 items-center justify-center rounded-full border-2 border-secondary bg-primary p-1">
                <NumberText className="text-base" variant="cream">
                  {`${ECONOMY.upgradeProductionMultiplier}x`}
                </NumberText>
              </div>
            )}

            {isUnlocked && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
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
          </div>

          <span className="sr-only">{produceLabel}</span>
        </Button>
      </TooltipTrigger>

      <TooltipContent>{produceLabel}</TooltipContent>
    </Tooltip>
  );
};
