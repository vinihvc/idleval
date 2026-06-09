import { Image } from "@unpic/react";
import React from "react";
import { tv } from "tailwind-variants";
import { boxBorder } from "@/components/ui/box-border";
import { useHoldPress } from "@/hooks/use-hold-press";
import { cn } from "@/lib/cn";
import { type SoundsType, sound as soundFunction } from "@/providers/sound";

export type SealedState = "charter" | "open" | "saving";

interface OpenPresetClasses {
  art: string;
  badge: string;
  inner: string;
  overlay: string;
}

interface CompletePresetClasses {
  art: string;
  inner: string;
}

const OPEN_OUTER_FRAME =
  "border-success border-success-foreground/35 bg-success focus-visible:ring-success/50";

const OPEN_PRESET: OpenPresetClasses = {
  art: "inset-shadow-xs border-success/80 bg-success/25",
  badge: "border-success-foreground/40 bg-success/35",
  inner: "border-success-foreground/35 bg-success/30",
  overlay: "bg-success/20",
};

const COMPLETE_PRESET: CompletePresetClasses = {
  art: "inset-shadow-xs border-success/40 bg-success/20",
  inner: "border-success/30 bg-success/30",
};

const EMPTY_OPEN_PRESET: OpenPresetClasses = {
  art: "",
  badge: "",
  inner: "",
  overlay: "",
};

const EMPTY_COMPLETE_PRESET: CompletePresetClasses = {
  art: "",
  inner: "",
};

export const getUpgradeCardCostStyle = (props: {
  affordable: boolean;
  locked: boolean;
}) => {
  const { locked, affordable } = props;

  if (affordable && !locked) {
    return {
      className: "text-lg text-success",
      variant: "green" as const,
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

export const upgradeCardVariants = tv({
  base: [
    "group relative flex aspect-square w-full flex-col text-left",
    "rounded-md border-3 border-primary/90 bg-primary p-1",
    boxBorder({ variant: "brown", size: "md" }),
    "inset-shadow-xs transition-[filter,transform,box-shadow] duration-200",
    "focus-visible:outline-0 focus-visible:ring-[3px] focus-visible:ring-primary/50",
    "disabled:pointer-events-none disabled:cursor-default",
    "aria-disabled:pointer-events-none aria-disabled:cursor-default",
  ],
  variants: {
    interactive: {
      true: "cursor-pointer hover:brightness-105 active:scale-[0.99]",
      false: "",
    },
    greenFrame: {
      true: [boxBorder({ variant: "green", size: "md" }), OPEN_OUTER_FRAME],
      false: "",
    },
  },
  compoundVariants: [
    {
      greenFrame: false,
      interactive: true,
      class: boxBorder({
        variant: "brown",
        size: "md",
        interactiveOnly: true,
      }),
    },
    {
      greenFrame: true,
      interactive: true,
      class: boxBorder({
        variant: "green",
        size: "md",
        interactiveOnly: true,
      }),
    },
  ],
  defaultVariants: {
    greenFrame: false,
    interactive: false,
  },
});

const upgradeCardInnerPanelVariants = tv({
  base: [
    "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm",
    "border-2 border-primary-foreground/25 bg-background",
    "inset-shadow-xs shadow-[inset_0_2px_5px_oklch(0.12_0.02_55/0.3)]",
  ],
  variants: {
    charter: {
      true: "border-popover-foreground/25 border-dashed",
      false: "",
    },
  },
});

const upgradeCardArtAreaVariants = tv({
  base: [
    "relative inset-shadow-xs size-full overflow-hidden rounded-sm border",
    "border-primary-foreground/15 bg-muted",
    "shadow-[inset_0_3px_8px_oklch(0.12_0.02_55/0.38)]",
  ],
});

const upgradeCardArtOverlayVariants = tv({
  base: "pointer-events-none absolute inset-0 z-20 bg-muted",
});

const upgradeCardFactoryBadgeVariants = tv({
  base: [
    "rounded-md border-2 border-primary bg-background p-0.5",
    boxBorder({ variant: "muted", size: "sm" }),
  ],
});

export interface UpgradeCardProps
  extends Omit<React.ComponentProps<"button">, "children" | "title"> {
  affordable?: boolean;
  complete?: boolean;
  cost?: React.ReactNode;
  description?: string;
  durationMs?: number;
  holdLabel?: React.ReactNode;
  icon?: string;
  image: string;
  locked?: boolean;
  onHoldComplete?: () => void;
  sound?: SoundsType | false;
  title: string;
}

interface UpgradeCardArtOverlayProps {
  cost?: React.ReactNode;
  icon?: string;
  openPreset: OpenPresetClasses;
  sealed: SealedState;
}

const UpgradeCardArtOverlay = (props: UpgradeCardArtOverlayProps) => {
  const { sealed, cost, icon, openPreset } = props;
  const isOpen = sealed === "open";

  return (
    <div
      className={cn(
        upgradeCardArtOverlayVariants(),
        isOpen && openPreset.overlay
      )}
    >
      {icon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              upgradeCardFactoryBadgeVariants(),
              isOpen && openPreset.badge
            )}
          >
            <Image
              alt=""
              aria-hidden
              className="pixel-crisp size-7 object-contain"
              height={28}
              layout="constrained"
              src={icon}
              width={28}
            />
          </div>
        </div>
      )}

      {cost && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center px-2 pb-0.5">
          {cost}
        </div>
      )}
    </div>
  );
};

interface UpgradeCardBodyProps {
  complete?: boolean;
  completePreset: CompletePresetClasses;
  cost?: React.ReactNode;
  durationMs: number;
  holdLabel?: React.ReactNode;
  icon?: string;
  image: string;
  isHolding: boolean;
  openPreset: OpenPresetClasses;
  sealedState: SealedState | null;
  showGhostArt: boolean;
  title: string;
}

const UpgradeCardBody = (props: UpgradeCardBodyProps) => {
  const {
    complete,
    completePreset,
    cost,
    durationMs,
    holdLabel,
    icon,
    image,
    isHolding,
    openPreset,
    sealedState,
    showGhostArt,
    title,
  } = props;

  const isOpen = sealedState === "open";

  return (
    <div
      className={cn(
        upgradeCardInnerPanelVariants({ charter: sealedState === "charter" }),
        isOpen && openPreset.inner,
        complete && completePreset.inner
      )}
    >
      {complete && (
        <div
          className={cn(
            "relative flex shrink-0 items-center gap-1.5 border-success/40 border-b-2",
            "bg-background px-1.5 py-1",
            "inset-shadow-xs shadow-[inset_0_1px_3px_oklch(0.12_0.02_55/0.2)]"
          )}
        >
          <p className="min-w-0 flex-1 truncate text-left font-bold text-foreground text-xs leading-tight tracking-wide">
            {title}
          </p>
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
        </div>
      )}

      <div className="relative min-h-0 flex-1 overflow-hidden bg-background p-2">
        <div
          className={cn(
            upgradeCardArtAreaVariants(),
            isOpen && openPreset.art,
            complete && completePreset.art
          )}
        >
          {(complete || showGhostArt) && (
            <Image
              alt=""
              aria-hidden
              className="pixel-crisp pointer-events-none size-full object-contain object-center"
              height={140}
              layout="constrained"
              src={image}
              width={112}
            />
          )}

          {sealedState && (
            <UpgradeCardArtOverlay
              cost={cost}
              icon={icon}
              openPreset={openPreset}
              sealed={sealedState}
            />
          )}

          {isHolding && (
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-30 origin-left scale-x-100 bg-primary/25 transition-transform ease-linear"
                style={{ transitionDuration: `${durationMs}ms` }}
              />
              {holdLabel && (
                <span className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-background font-bold text-foreground text-xs">
                  {holdLabel}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const UpgradeCard = (props: UpgradeCardProps) => {
  const {
    image,
    icon,
    title,
    cost,
    description,
    locked,
    affordable,
    complete,
    className,
    disabled,
    onClick,
    onHoldComplete,
    holdLabel,
    durationMs = 3400,
    sound = "click",
    type = "button",
    ...rest
  } = props;

  const descriptionId = React.useId();
  const isInactive = Boolean(disabled);
  const sealedState = getSealedState({ complete, locked, affordable });
  const isMasked = sealedState !== null;
  const isHoldCard = Boolean(onHoldComplete) && !isInactive;
  const isInteractive =
    isHoldCard || (Boolean(onClick) && !onHoldComplete && !isInactive);
  const showGhostArt = sealedState === "charter";
  const isGreenFrame = sealedState === "open" || Boolean(complete);
  const openPreset = sealedState === "open" ? OPEN_PRESET : EMPTY_OPEN_PRESET;
  const completePreset = complete ? COMPLETE_PRESET : EMPTY_COMPLETE_PRESET;

  const { isHolding, holdHandlers } = useHoldPress({
    disabled: !isHoldCard,
    durationMs,
    onHoldComplete,
  });

  const { onClick: _holdClick, ...holdProps } = holdHandlers;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isHoldCard) {
      holdHandlers.onClick(event);
      return;
    }

    if (sound !== false) {
      soundFunction.play(sound);
    }

    onClick?.(event);
  };

  return (
    <button
      aria-busy={isHolding || undefined}
      aria-describedby={description ? descriptionId : undefined}
      aria-disabled={isInactive || undefined}
      className={cn(
        upgradeCardVariants({
          greenFrame: isGreenFrame,
          interactive: isInteractive,
        }),
        isHoldCard &&
          "touch-manipulation select-none [-webkit-touch-callout:none]",
        className
      )}
      data-affordable={affordable}
      data-complete={complete}
      data-locked={locked}
      data-masked={isMasked}
      data-sealed={sealedState ?? undefined}
      data-slot="upgrade-card"
      onClick={isInactive ? undefined : handleClick}
      type={type}
      {...(isHoldCard ? holdProps : {})}
      {...rest}
    >
      {description && (
        <span className="sr-only" id={descriptionId}>
          {description}
        </span>
      )}
      <UpgradeCardBody
        complete={complete}
        completePreset={completePreset}
        cost={cost}
        durationMs={durationMs}
        holdLabel={holdLabel}
        icon={icon}
        image={image}
        isHolding={isHolding}
        openPreset={openPreset}
        sealedState={sealedState}
        showGhostArt={showGhostArt}
        title={title}
      />
    </button>
  );
};
