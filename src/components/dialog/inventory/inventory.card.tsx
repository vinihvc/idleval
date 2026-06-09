import { InfoBox } from "pixelarticons/react/InfoBox";
import React from "react";
import { Button } from "@/components/ui/button";
import { HoldProgress } from "@/components/ui/hold-button";
import {
  getPowerUpCardClassName,
  PowerUpCardCountBadge,
  PowerUpCardEmptyContent,
  PowerUpCardFilledContent,
  type PowerUpCardTier,
  PowerUpCardTooltipContent,
} from "@/components/ui/power-up/power-up.card";
import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";
import {
  getLocalizedPowerUp,
  type PowerUpId,
  type PowerUpTier,
} from "@/content/power-ups";
import { useHoldPress } from "@/hooks/use-hold-press";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { usePickVariantTools } from "@/providers/variant-tools";

export interface InventoryCardProps extends React.ComponentProps<"button"> {
  count?: number;
  imageClassName?: string;
  index: number;
  isRitualSlot?: boolean;
  onUse?: () => void;
  powerUpId: PowerUpId | null;
  tier?: PowerUpTier;
}

interface InventoryCardContext {
  canHold: boolean;
  className?: string;
  count: number;
  descriptionId: string;
  holdHandlers: ReturnType<typeof useHoldPress>["holdHandlers"];
  imageClassName?: string;
  isDisabled: boolean;
  isFilled: boolean;
  isHolding: boolean;
  isRitualSlot: boolean;
  label: string;
  lore: ReturnType<typeof getLocalizedPowerUp> | null;
  powerUpId: PowerUpId | null;
  resolvedTier: PowerUpCardTier;
  rest: Omit<
    InventoryCardProps,
    | "count"
    | "className"
    | "disabled"
    | "imageClassName"
    | "index"
    | "isRitualSlot"
    | "onUse"
    | "powerUpId"
    | "tier"
    | "type"
  >;
  type: "button" | "submit" | "reset";
}

const InventoryCardHoldFeedback = (props: {
  active: boolean;
  durationMs?: number;
}) => {
  const { active, durationMs = 3400 } = props;

  return (
    <div className="pointer-events-none absolute inset-0 isolate z-20 overflow-hidden rounded-sm">
      <HoldProgress
        active={active}
        className="inset-0"
        durationMs={durationMs}
        fillClassName="bg-primary/40"
      />
      {active ? (
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-background/75 font-bold text-foreground text-xs tracking-wide">
          {m["ui.common.hold"]()}
        </span>
      ) : null}
    </div>
  );
};

const InventoryCardInfoButton = (props: {
  lore: ReturnType<typeof getLocalizedPowerUp>;
}) => {
  const { lore } = props;

  return (
    <ResponsiveTooltip>
      <ResponsiveTooltipTrigger asChild>
        <Button
          aria-label={m["ui.inventory.slot.info"]({ 0: lore.name })}
          className="absolute top-0.5 left-0.5 z-30 size-6 p-0"
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
          size="icon-md"
          type="button"
          variant="blue"
        >
          <InfoBox className="size-3.5" />
        </Button>
      </ResponsiveTooltipTrigger>

      <ResponsiveTooltipContent>
        <PowerUpCardTooltipContent lore={lore} />
      </ResponsiveTooltipContent>
    </ResponsiveTooltip>
  );
};

const useInventoryCardContext = (
  props: InventoryCardProps
): InventoryCardContext => {
  const {
    index,
    powerUpId,
    count = 0,
    tier,
    className,
    imageClassName,
    disabled,
    isRitualSlot = false,
    onUse,
    type = "button",
    ...rest
  } = props;

  const isFilled = !isRitualSlot && powerUpId != null && count > 0;
  const resolvedTier = isRitualSlot ? "ritual" : (tier ?? "common");
  const isDisabled = disabled ?? (!isFilled || isRitualSlot);
  const canHold = isFilled && !isDisabled;
  const lore = isFilled && powerUpId ? getLocalizedPowerUp(powerUpId) : null;
  const descriptionId = React.useId();

  const { isHolding, holdHandlers } = useHoldPress({
    disabled: !canHold,
    onHoldComplete: canHold ? onUse : undefined,
  });

  let label: string = m["ui.inventory.slot.empty"]({ 0: index + 1 });

  if (isRitualSlot) {
    label = m["ui.inventory.slot.ritual"]({ 0: index + 1 });
  } else if (isFilled && lore) {
    label = lore.name;
  }

  return {
    canHold,
    className,
    count,
    descriptionId,
    holdHandlers,
    imageClassName,
    isDisabled,
    isFilled,
    isHolding,
    isRitualSlot,
    label,
    lore,
    powerUpId,
    resolvedTier,
    rest,
    type,
  };
};

const getInventoryCardAriaLabel = (ctx: InventoryCardContext) => {
  if (ctx.isRitualSlot || !ctx.isFilled) {
    return ctx.label;
  }

  if (ctx.canHold) {
    return m["ui.inventory.holdToActivate"]({ 0: ctx.label });
  }

  return m["ui.inventory.slot.relic"]({
    name: ctx.label,
    count: String(ctx.count),
  });
};

const getInventoryCardButtonClass = (
  ctx: InventoryCardContext,
  layout: "square" | "stacked" = "square"
) =>
  getPowerUpCardClassName({
    tier: ctx.resolvedTier,
    filled: ctx.isFilled,
    layout,
    className: cn(
      "disabled:cursor-default disabled:opacity-100",
      ctx.isDisabled && !ctx.isRitualSlot && "opacity-60",
      ctx.canHold &&
        "touch-manipulation select-none [-webkit-touch-callout:none]",
      ctx.className
    ),
    disabled: false,
  });

const InventoryCardFilled = (props: {
  count: number;
  ctx: InventoryCardContext;
  layout?: "square" | "stacked";
}) => {
  const { count, ctx, layout = "square" } = props;

  if (!ctx.powerUpId) {
    return null;
  }

  return (
    <PowerUpCardFilledContent
      badge={<PowerUpCardCountBadge count={count} />}
      imageClassName={ctx.imageClassName ?? "size-full"}
      layout={layout}
      name={layout === "stacked" ? ctx.label : undefined}
      powerUpId={ctx.powerUpId}
    />
  );
};

const InventoryCardVariantA = (ctx: InventoryCardContext) => {
  const button = (
    <button
      {...(ctx.canHold ? ctx.holdHandlers : {})}
      aria-busy={ctx.isHolding || undefined}
      aria-describedby={ctx.lore ? ctx.descriptionId : undefined}
      aria-label={getInventoryCardAriaLabel(ctx)}
      className={getInventoryCardButtonClass(ctx)}
      data-slot="inventory-card"
      data-tier={ctx.resolvedTier}
      data-variant="a"
      disabled={ctx.isDisabled}
      onClick={ctx.canHold ? ctx.holdHandlers.onClick : undefined}
      type={ctx.type}
      {...ctx.rest}
    >
      {ctx.isFilled && ctx.powerUpId ? (
        <>
          <InventoryCardFilled count={ctx.count} ctx={ctx} />
          {ctx.canHold ? (
            <InventoryCardHoldFeedback active={ctx.isHolding} />
          ) : null}
        </>
      ) : (
        <PowerUpCardEmptyContent />
      )}
    </button>
  );

  if (!ctx.lore) {
    return button;
  }

  return (
    <ResponsiveTooltip>
      <ResponsiveTooltipTrigger asChild>{button}</ResponsiveTooltipTrigger>
      <ResponsiveTooltipContent id={ctx.descriptionId}>
        <PowerUpCardTooltipContent lore={ctx.lore} />
      </ResponsiveTooltipContent>
    </ResponsiveTooltip>
  );
};

const InventoryCardVariantB = (ctx: InventoryCardContext) => (
  <button
    {...(ctx.canHold ? ctx.holdHandlers : {})}
    aria-busy={ctx.isHolding || undefined}
    aria-describedby={ctx.lore ? ctx.descriptionId : undefined}
    aria-label={getInventoryCardAriaLabel(ctx)}
    className={getInventoryCardButtonClass(ctx)}
    data-slot="inventory-card"
    data-tier={ctx.resolvedTier}
    data-variant="b"
    disabled={ctx.isDisabled}
    onClick={ctx.canHold ? ctx.holdHandlers.onClick : undefined}
    type={ctx.type}
    {...ctx.rest}
  >
    {ctx.isFilled && ctx.powerUpId ? (
      <>
        <InventoryCardFilled count={ctx.count} ctx={ctx} />
        {ctx.lore ? (
          <span className="sr-only" id={ctx.descriptionId}>
            {ctx.lore.description}
          </span>
        ) : null}
        {ctx.canHold ? (
          <InventoryCardHoldFeedback active={ctx.isHolding} />
        ) : null}
      </>
    ) : (
      <PowerUpCardEmptyContent />
    )}
  </button>
);

const InventoryCardVariantC = (ctx: InventoryCardContext) => (
  <div className="relative aspect-square w-full" data-variant="c">
    <button
      {...(ctx.canHold ? ctx.holdHandlers : {})}
      aria-busy={ctx.isHolding || undefined}
      aria-describedby={ctx.lore ? ctx.descriptionId : undefined}
      aria-label={getInventoryCardAriaLabel(ctx)}
      className={cn(getInventoryCardButtonClass(ctx), "size-full")}
      data-slot="inventory-card"
      data-tier={ctx.resolvedTier}
      disabled={ctx.isDisabled}
      onClick={ctx.canHold ? ctx.holdHandlers.onClick : undefined}
      type={ctx.type}
      {...ctx.rest}
    >
      {ctx.isFilled && ctx.powerUpId ? (
        <>
          <InventoryCardFilled count={ctx.count} ctx={ctx} />
          {ctx.lore ? (
            <span className="sr-only" id={ctx.descriptionId}>
              {ctx.lore.description}
            </span>
          ) : null}
          {ctx.canHold ? (
            <InventoryCardHoldFeedback active={ctx.isHolding} />
          ) : null}
        </>
      ) : (
        <PowerUpCardEmptyContent />
      )}
    </button>

    {ctx.lore ? <InventoryCardInfoButton lore={ctx.lore} /> : null}
  </div>
);

const InventoryCardVariantD = (ctx: InventoryCardContext) => (
  <div className="relative aspect-square w-full" data-variant="d">
    <button
      {...(ctx.canHold ? ctx.holdHandlers : {})}
      aria-busy={ctx.isHolding || undefined}
      aria-describedby={ctx.lore ? ctx.descriptionId : undefined}
      aria-label={getInventoryCardAriaLabel(ctx)}
      className={cn(getInventoryCardButtonClass(ctx, "stacked"), "size-full")}
      data-slot="inventory-card"
      data-tier={ctx.resolvedTier}
      disabled={ctx.isDisabled}
      onClick={ctx.canHold ? ctx.holdHandlers.onClick : undefined}
      type={ctx.type}
      {...ctx.rest}
    >
      {ctx.isFilled && ctx.powerUpId ? (
        <>
          <InventoryCardFilled count={ctx.count} ctx={ctx} layout="stacked" />
          {ctx.lore ? (
            <span className="sr-only" id={ctx.descriptionId}>
              {ctx.lore.description}
            </span>
          ) : null}
          {ctx.canHold ? (
            <InventoryCardHoldFeedback active={ctx.isHolding} />
          ) : null}
        </>
      ) : (
        <PowerUpCardEmptyContent />
      )}
    </button>

    {ctx.lore ? <InventoryCardInfoButton lore={ctx.lore} /> : null}
  </div>
);

export const InventoryCard = (props: InventoryCardProps) => {
  const ctx = useInventoryCardContext(props);

  return usePickVariantTools({
    a: InventoryCardVariantA(ctx),
    b: InventoryCardVariantB(ctx),
    c: InventoryCardVariantC(ctx),
    d: InventoryCardVariantD(ctx),
  });
};
