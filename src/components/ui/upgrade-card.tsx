import { Image } from "@unpic/react";
import { ArrowBigUpDash, UserSearch } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import type { FactoryType } from "@/content/factories";
import { cn } from "@/lib/cn";
import { useFactory } from "@/store/atoms/factories";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type UpgradeCardType = "upgrade" | "manager";

interface UpgradeCardContextType {
  /**
   * Whether the card is enabled
   */
  isEnabled: boolean;
}

const UpgradeCardContext = React.createContext({} as UpgradeCardContextType);

interface UpgradeCardProps extends React.ComponentProps<"div"> {
  /**
   * The factory type
   */
  factoryType: FactoryType;
  /**
   * Image to display on the card
   */
  image: string;
  /**
   * Whether the card is enabled
   */
  isEnabled: boolean;
  /**
   * The type of card
   */
  type: UpgradeCardType;
}

const ICON_MAP = {
  upgrade: { tooltip: "Upgrade", icon: ArrowBigUpDash },
  manager: { tooltip: "Manager", icon: UserSearch },
};

export const UpgradeCard = (props: UpgradeCardProps) => {
  const { factoryType, type, image, isEnabled, className, children, ...rest } =
    props;

  const { name } = useFactory(factoryType);

  const { tooltip, icon: Icon } = ICON_MAP[type];

  return (
    <UpgradeCardContext.Provider value={{ isEnabled }}>
      <article
        className={cn(
          "group relative",
          "border-2 border-foreground",
          "bg-foreground",
          "rounded-md",
          "transition-all",
          'data-[enabled="true"]:border-green-600 data-[enabled="true"]:bg-green-600',
          "outline-0 focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-foreground/50",
          className
        )}
        data-enabled={isEnabled}
        {...rest}
      >
        <div className="rounded-t-md border-inherit border-b-2">
          <Image
            alt={factoryType}
            className="pointer-events-none aspect-square rounded-t-sm"
            height={200}
            layout="constrained"
            src={image}
            width={200}
          />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-1 right-1">
              <div className="flex size-7 items-center justify-center rounded-lg border-2 border-foreground bg-background text-foreground">
                <Icon className="size-4" />
              </div>
            </div>
          </TooltipTrigger>

          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-1 left-1">
              <Image
                className="pointer-events-none aspect-square size-7 rounded-lg border-2 border-foreground object-contain"
                height={28}
                layout="constrained"
                src={`/images/factories/${factoryType}.webp`}
                width={28}
              />
            </div>
          </TooltipTrigger>

          <TooltipContent>{name}</TooltipContent>
        </Tooltip>

        {children}
      </article>
    </UpgradeCardContext.Provider>
  );
};

export const UpgradeCardTrigger = (
  props: React.ComponentProps<typeof Button>
) => {
  const { isEnabled } = useUpgradeCard();

  return (
    <Button
      className="relative w-full rounded-t-none rounded-b-sm border-0 font-medium text-[10px] uppercase group-data-[enabled='false']:disabled:opacity-50"
      type="button"
      variant={isEnabled ? "green" : "black"}
      {...props}
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
