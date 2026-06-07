import { Image } from "@unpic/react";
import { CheckboxOn } from "pixelarticons/react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FactoryType } from "@/content/factories";
import { cn } from "@/lib/cn";
import { useFactory } from "@/store/atoms/factories";
import { hasGoldToBuy } from "@/store/atoms/wallet";
import type { GameValue } from "@/utils/decimal";
import { amountFormatter } from "@/utils/formatters";
import { NumberText } from "./number-text";

interface UpgradeCardBaseProps extends React.ComponentProps<"article"> {
  affordable?: boolean;
  complete?: boolean;
  description?: string;
  image: string;
  title?: string;
}

interface UpgradeCardCompoundProps extends UpgradeCardBaseProps {
  actionLabel?: never;
  cost?: never;
  factoryType?: never;
  onAction?: never;
}

interface UpgradeCardFactoryProps extends UpgradeCardBaseProps {
  actionLabel: string;
  cost: GameValue;
  factoryType: FactoryType;
  onAction: () => void;
}

export type UpgradeCardProps =
  | UpgradeCardCompoundProps
  | UpgradeCardFactoryProps;

export const UpgradeCard = (props: UpgradeCardProps) => {
  if ("factoryType" in props && props.factoryType) {
    return <UpgradeCardWithFactoryAction {...props} />;
  }

  return <UpgradeCardLayout {...props} />;
};

const UpgradeCardWithFactoryAction = (props: UpgradeCardFactoryProps) => {
  const {
    actionLabel,
    cost,
    factoryType,
    image,
    title,
    description,
    complete,
    onAction,
    ...rest
  } = props;

  const { isUnlocked, name } = useFactory(factoryType);

  const canBuy = hasGoldToBuy(cost);
  const affordable = isUnlocked && !complete && canBuy;
  const actionable = complete || affordable;

  const getTriggerContent = () => {
    if (!isUnlocked) {
      return "Charter required";
    }
    if (complete) {
      return <CheckboxOn />;
    }
    return (
      <>
        <span>{actionLabel}</span>
        <Badge variant="default">
          <NumberText>{amountFormatter(cost)}</NumberText>
        </Badge>
      </>
    );
  };

  return (
    <UpgradeCardLayout
      affordable={affordable}
      complete={complete}
      description={description}
      image={image}
      title={title}
      {...rest}
    >
      <UpgradeCardBadge
        icon={
          <Image
            alt=""
            aria-hidden
            className="pixel-crisp pointer-events-none size-full rounded-md object-contain"
            height={28}
            layout="constrained"
            src={`/images/factories/${factoryType}.webp`}
            width={28}
          />
        }
      >
        {name}
      </UpgradeCardBadge>
      <UpgradeCardTrigger
        disabled={!(isUnlocked && canBuy)}
        onClick={onAction}
        sound="upgrade"
        variant={actionable ? "green" : "brown"}
      >
        {getTriggerContent()}
      </UpgradeCardTrigger>
    </UpgradeCardLayout>
  );
};

const UpgradeCardLayout = (
  props: UpgradeCardBaseProps & { children?: React.ReactNode }
) => {
  const {
    image,
    title,
    description,
    affordable,
    complete,
    className,
    children,
    ...rest
  } = props;

  return (
    <article
      className={cn(
        "group relative",
        "bg-muted",
        "transition-all",
        "inset-shadow-xs overflow-hidden rounded-md border-3",
        "data-[affordable=true]:border-success/80",
        "data-[complete=true]:border-success data-[complete=true]:bg-success",
        "focus-visible:outline-0 focus-visible:ring-[3px] focus-visible:ring-primary/50",
        className
      )}
      data-affordable={affordable}
      data-complete={complete}
      {...rest}
    >
      <div className="relative aspect-square w-full overflow-hidden border-inherit border-b-2">
        <Image
          alt=""
          aria-hidden
          className="pixel-crisp pointer-events-none size-full object-cover"
          height={112}
          layout="constrained"
          src={image}
          width={112}
        />
        {title && (
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="absolute inset-x-0 bottom-0 bg-background/85 px-2 py-1 text-center font-medium text-foreground text-sm leading-tight">
                {title}
              </p>
            </TooltipTrigger>
            {description && (
              <TooltipContent className="max-w-xs">
                {description}
              </TooltipContent>
            )}
          </Tooltip>
        )}
      </div>

      {children}
    </article>
  );
};

export const UpgradeCardTrigger = (
  props: React.ComponentProps<typeof Button>
) => {
  const { className, ...rest } = props;

  return (
    <Button
      className={cn(
        "w-full",
        "font-medium text-sm",
        "inset-shadow-none rounded-none border-0",
        className
      )}
      clickEffect={false}
      size="sm"
      {...rest}
    />
  );
};

interface UpgradeCardBadgeProps extends React.ComponentProps<"div"> {
  icon: React.ReactNode;
  position?: "left" | "right";
}

export const UpgradeCardBadge = (props: UpgradeCardBadgeProps) => {
  const { position = "right", icon, className, children } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "absolute top-1",
            position === "left" ? "left-1" : "right-1"
          )}
        >
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-lg border-2 border-secondary bg-popover text-secondary-foreground",
              className
            )}
          >
            {icon}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
};
