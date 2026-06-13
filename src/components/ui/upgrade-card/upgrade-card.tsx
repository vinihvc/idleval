import { Image } from "@unpic/react";
import { InfoBox } from "pixelarticons/react/InfoBox";
import { tv } from "tailwind-variants";
import { boxBorder } from "@/components/ui/box-border";
import { HoldProgress } from "@/components/ui/hold-button";
import { cn } from "@/lib/cn";
import { Button } from "../button";
import {
  ToggleTooltip,
  ToggleTooltipContent,
  ToggleTooltipTrigger,
} from "../toggle-tooltip";

export type SealedState = "charter" | "open" | "saving";
export type UpgradeCardVariant = "brown" | "green";

export const upgradeCardVariants = tv({
  base: [
    "relative",
    "group",
    "aspect-square w-full",
    "flex flex-col",
    "bg-primary",
    "inset-shadow-xs rounded-md border-2 border-primary/90 sm:border-4",
    "transition-[filter,transform,box-shadow] duration-200",
    "focus-visible:outline-0 focus-visible:ring-[3px] focus-visible:ring-primary/50",
    "disabled:pointer-events-none disabled:cursor-default",
    "aria-disabled:cursor-default",
  ],
  variants: {
    variant: {
      brown: boxBorder({ variant: "brown", size: "md" }),
      green: [
        boxBorder({ variant: "green", size: "md" }),
        "border-success-foreground/35 bg-success focus-visible:ring-success/50",
      ],
    },
    interactive: {
      true: "cursor-pointer hover:brightness-105 active:scale-[0.99]",
    },
  },
  compoundVariants: [
    {
      interactive: true,
      variant: "brown",
      class: boxBorder({
        interactiveOnly: true,
        variant: "brown",
        size: "md",
      }),
    },
    {
      interactive: true,
      variant: "green",
      class: boxBorder({
        interactiveOnly: true,
        variant: "green",
        size: "md",
      }),
    },
  ],
  defaultVariants: {
    interactive: false,
    variant: "brown",
  },
});

const upgradeCardInnerPanelVariants = tv({
  base: [
    "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm",
    "bg-background",
    "inset-shadow-xs",
    boxBorder({ inset: "md", variant: "muted", soft: "none" }),
  ],
  variants: {
    charter: {
      true: "border-popover-foreground/25 border-dashed",
    },
  },
});

export interface UpgradeCardProps
  extends Omit<React.ComponentProps<"button">, "title"> {
  interactive?: boolean;
  variant?: UpgradeCardVariant;
}

export const UpgradeCard = (props: UpgradeCardProps) => {
  const {
    type = "button",
    interactive = false,
    variant = "brown",
    className,
    ...rest
  } = props;

  return (
    <button
      className={cn(upgradeCardVariants({ interactive, variant }), className)}
      data-slot="upgrade-card"
      type={type}
      {...rest}
    />
  );
};

export interface UpgradeCardPanelProps extends React.ComponentProps<"div"> {
  charter?: boolean;
  complete?: boolean;
  open?: boolean;
}

export const UpgradeCardPanel = (props: UpgradeCardPanelProps) => {
  const {
    charter = false,
    children,
    className,
    complete = false,
    open = false,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        upgradeCardInnerPanelVariants({ charter }),
        open && "inset-shadow-xs border-success-foreground/35 bg-success/30",
        complete && "inset-shadow-xs border-success/30 bg-success/30",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export interface UpgradeCardHeaderProps extends React.ComponentProps<"div"> {
  icon?: string;
  title: string;
}

export const UpgradeCardHeader = (props: UpgradeCardHeaderProps) => {
  const { className, icon, title, ...rest } = props;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center gap-1 border-success/40 border-b-2",
        "bg-background px-1.5 py-1",
        "inset-shadow-xs",
        boxBorder({ inset: "sm", variant: "muted", soft: "none" }),
        className
      )}
      {...rest}
    >
      {icon && (
        <Image
          alt=""
          aria-hidden
          className="pixel-crisp pointer-events-none size-4 shrink-0 rounded-sm object-contain"
          height={16}
          layout="constrained"
          src={icon}
          width={16}
        />
      )}
      <p className="min-w-0 flex-1 truncate text-left font-bold text-foreground text-xs leading-tight tracking-wide">
        {title}
      </p>
      <ToggleTooltip>
        <ToggleTooltipTrigger asChild>
          <Button
            asChild
            // TODO: add to i18n
            // aria-label={m["ui.upgradeCard.info"]({ 0: title })}
            className="size-5 rounded-md border"
            size="icon-xs"
            variant="blue"
          >
            <span className="cursor-pointer" tabIndex={0}>
              <InfoBox />
            </span>
          </Button>
        </ToggleTooltipTrigger>
        <ToggleTooltipContent>
          <h3>{title}</h3>

          {/* TODO: add description to content */}
          {/* <p>{description}</p> */}
        </ToggleTooltipContent>
      </ToggleTooltip>
    </div>
  );
};

export interface UpgradeCardArtProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  complete?: boolean;
  open?: boolean;
  showImage?: boolean;
  src: string;
}

export const UpgradeCardArt = (props: UpgradeCardArtProps) => {
  const {
    children,
    className,
    complete = false,
    open = false,
    showImage = false,
    src,
    ...rest
  } = props;

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-background p-2">
      <div
        className={cn(
          "relative inset-shadow-xs size-full overflow-hidden rounded-sm border",
          "border-primary-foreground/15 bg-muted",
          boxBorder({ inset: "lg", variant: "muted", soft: "none" }),
          open && "inset-shadow-xs border-success/80 bg-success/25",
          complete && "inset-shadow-xs border-success/40 bg-success/20",
          className
        )}
        {...rest}
      >
        {showImage && (
          <Image
            alt=""
            aria-hidden
            className="pixel-crisp pointer-events-none size-full object-contain object-center"
            height={140}
            layout="constrained"
            src={src}
            width={112}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export interface UpgradeCardSealProps extends React.ComponentProps<"div"> {
  cost?: React.ReactNode;
  icon?: string;
  open?: boolean;
  sealed: SealedState;
}

export const UpgradeCardSeal = (props: UpgradeCardSealProps) => {
  const { cost, icon, open = false, sealed, ...rest } = props;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 bg-muted",
        open && "bg-success/20"
      )}
      data-sealed={sealed}
      {...rest}
    >
      {icon && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "rounded-md border-2 border-primary bg-background p-0.5 sm:p-1",
              boxBorder({ variant: "muted", size: "sm" }),
              open && "border-success-foreground/40 bg-success/35"
            )}
          >
            <Image
              alt=""
              aria-hidden
              className="pixel-crisp size-7 object-contain sm:size-7.5"
              height={28}
              layout="constrained"
              src={icon}
              width={28}
            />
          </div>
        </div>
      )}

      {cost && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0",
            "flex items-end justify-center",
            "px-2 sm:px-2.5",
            "pointer-events-none"
          )}
        >
          {cost}
        </div>
      )}
    </div>
  );
};

export interface UpgradeCardHoldFeedbackProps {
  active: boolean;
  durationMs?: number;
  label?: React.ReactNode;
}

export const UpgradeCardHoldFeedback = (
  props: UpgradeCardHoldFeedbackProps
) => {
  const { active, durationMs = 3400, label } = props;

  return (
    <div className="pointer-events-none absolute inset-0 isolate z-30 overflow-hidden">
      <HoldProgress
        active={active}
        className="inset-0"
        durationMs={durationMs}
        fillClassName="bg-success-foreground/50"
      />
      {active && label && (
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-background/5 font-bold text-foreground text-sm tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
};

export const getUpgradeCardCostStyle = (props: {
  affordable: boolean;
  locked: boolean;
}) => {
  const { locked, affordable } = props;

  if (affordable && !locked) {
    return {
      className: "text-lg text-success",
      variant: "black" as const,
    };
  }

  return {
    className: "text-lg text-primary",
    variant: "brown" as const,
  };
};

export const getSealedState = (props: {
  affordable?: boolean;
  complete?: boolean;
  locked?: boolean;
}): SealedState | null => {
  const { complete, locked, affordable } = props;

  if (complete) {
    return null;
  }

  if (locked) {
    return "charter";
  }

  if (affordable) {
    return "open";
  }

  return "saving";
};
