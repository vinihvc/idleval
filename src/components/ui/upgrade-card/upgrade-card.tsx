import { Image } from "@unpic/react";
import { CheckboxOn } from "pixelarticons/react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpgradeCardFrame } from "@/components/ui/upgrade-card/upgrade-card.frame";
import type { FactoryType } from "@/content/factories";
import { canPurchaseManager, canPurchaseUpgrade } from "@/game/factories";
import { cn } from "@/lib/cn";
import { useFactory } from "@/store/atoms/factories";
import { useWallet } from "@/store/atoms/wallet";
import type { GameValue } from "@/utils/decimal";
import { amountFormatter } from "@/utils/formatters";

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
  purchaseKind: "manager" | "upgrade";
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
    purchaseKind,
    ...rest
  } = props;

  const { isAutomated, isUnlocked, isUpgraded, name } = useFactory(factoryType);
  const { gold } = useWallet();

  const canBuy =
    purchaseKind === "manager"
      ? canPurchaseManager({
          isUnlocked,
          isAutomated,
          gold,
          cost,
        })
      : canPurchaseUpgrade({
          isUnlocked,
          isUpgraded,
          gold,
          cost,
        });
  const affordable = !complete && canBuy;
  const actionable = complete || affordable;
  const isDisabled = complete ? false : !canBuy;

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
          <NumberText variant="default">{amountFormatter(cost)}</NumberText>
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
        disabled={isDisabled}
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
        "bg-primary",
        "transition-all",
        "inset-shadow-xs rounded-lg p-1.5",
        "focus-visible:outline-0 focus-visible:ring-[3px] focus-visible:ring-primary/50",
        className
      )}
      data-affordable={affordable}
      data-complete={complete}
      {...rest}
    >
      <UpgradeCardFrame />

      <div className="relative aspect-square w-full overflow-hidden border-primary/30 group-data-[affordable=true]:border-success/50 group-data-[complete=true]:border-success/70">
        <Image
          alt=""
          aria-hidden
          className="pixel-crisp pointer-events-none size-full rounded-t-md object-cover"
          height={112}
          layout="constrained"
          src={image}
          width={112}
        />
        {title && (
          <p className="absolute inset-x-0 bottom-0 bg-background/85 px-2 py-1 text-center font-medium text-foreground text-sm leading-tight">
            {title}
          </p>
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
        "inset-shadow-none rounded-none rounded-b-md border",
        className
      )}
      clickEffect={false}
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
            "absolute top-2 z-20",
            position === "left" ? "left-2" : "right-2"
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
