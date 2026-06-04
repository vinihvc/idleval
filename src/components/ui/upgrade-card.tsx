import { Image } from "@unpic/react";
import { ArrowUpBox, Briefcase } from "pixelarticons/react";
import React from "react";
import { Button } from "@/components/ui/button";
import type { FactoryType } from "@/content/factories";
import { cn } from "@/lib/cn";
import { useFactory } from "@/store/atoms/factories";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type UpgradeCardType = "upgrade" | "manager";

interface UpgradeCardContextType {
  /**
   * Whether the player can afford the purchase right now
   */
  canAfford: boolean;
  /**
   * Whether the upgrade or manager is already owned
   */
  isComplete: boolean;
}

const UpgradeCardContext = React.createContext({} as UpgradeCardContextType);

interface UpgradeCardProps extends React.ComponentProps<"div"> {
  /**
   * Whether the player can afford the purchase right now
   */
  canAfford: boolean;
  /**
   * The factory type
   */
  factoryType: FactoryType;
  /**
   * Image to display on the card
   */
  image: string;
  /**
   * Whether the upgrade or manager is already owned
   */
  isComplete: boolean;
  /**
   * The type of card
   */
  type: UpgradeCardType;
}

const ICON_MAP = {
  upgrade: { tooltip: "Improve", icon: ArrowUpBox },
  manager: { tooltip: "Steward", icon: Briefcase },
};

export const UpgradeCard = (props: UpgradeCardProps) => {
  const {
    factoryType,
    type,
    image,
    canAfford,
    isComplete,
    className,
    children,
    ...rest
  } = props;

  const { name } = useFactory(factoryType);

  const { tooltip, icon: Icon } = ICON_MAP[type];

  return (
    <UpgradeCardContext.Provider value={{ canAfford, isComplete }}>
      <article
        className={cn(
          "group relative",
          "bg-muted",
          "transition-all",
          "inset-shadow-xs overflow-hidden rounded-md border-3",
          'data-[affordable="true"]:border-success/80',
          'data-[complete="true"]:border-success data-[complete="true"]:bg-success',
          "focus-visible: outline-0 focus-visible:ring-[3px] focus-visible:ring-primary/50",
          className
        )}
        data-affordable={canAfford}
        data-complete={isComplete}
        {...rest}
      >
        <div className="relative aspect-square w-full overflow-hidden border-inherit border-b-2">
          <Image
            alt={factoryType}
            className="pixel-crisp pointer-events-none size-full object-cover"
            height={200}
            layout="constrained"
            src={image}
            width={200}
          />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-1 left-1">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-lg border-2 border-primary/60 bg-secondary text-secondary-foreground"
                )}
              >
                <Image
                  alt=""
                  aria-hidden
                  className="pixel-crisp pointer-events-none size-full rounded-md object-contain"
                  height={28}
                  layout="constrained"
                  src={`/images/factories/${factoryType}.webp`}
                  width={28}
                />
              </div>
            </div>
          </TooltipTrigger>

          <TooltipContent>{name}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-1 right-1">
              <div className="flex size-7 items-center justify-center rounded-lg border-2 border-primary/60 bg-secondary text-secondary-foreground">
                <Icon className="size-4" />
              </div>
            </div>
          </TooltipTrigger>

          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>

        {children}
      </article>
    </UpgradeCardContext.Provider>
  );
};

export const UpgradeCardTrigger = (
  props: React.ComponentProps<typeof Button>
) => {
  const { className, ...rest } = props;

  const { canAfford, isComplete } = useUpgradeCard();

  return (
    <Button
      className={cn(
        "w-full",
        "font-medium text-sm",
        "rounded-none border-0",
        className
      )}
      clickEffect={false}
      overrideSound="upgrade"
      variant={isComplete || canAfford ? "green" : "black"}
      {...rest}
    />
  );
};

const useUpgradeCard = () => {
  const context = React.useContext(UpgradeCardContext);

  if (!context) {
    throw new Error("UpgradeCard must be used within a UpgradeCardContext");
  }

  return context;
};
