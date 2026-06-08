import React from "react";
import { tv } from "tailwind-variants";
import type { FactoryType } from "@/content/factories";
import { cn } from "@/lib/cn";
import { FactoryCardProvider, useFactoryCard } from "./factory-card.context";
import { FactoryCardProduce } from "./factory-card.produce";
import { FactoryCardProgress } from "./factory-card.progress";
import { FactoryCardUpgrade } from "./factory-card.upgrade";

export const factoryCardPanelVariants = tv({
  base: [
    "inset-shadow-xs grid h-22 w-full min-w-0 gap-1 overflow-hidden rounded-r-xl border-3 py-2 pr-3 pl-16",
    "border-primary bg-popover/90 text-muted",
  ],
  variants: {
    locked: {
      true: "border-popover-foreground/25 border-dashed",
      false: "",
    },
    producing: {
      true: "border-info shadow-[inset_0_0_12px_oklch(0.65_0.12_240/0.12)]",
      false: "",
    },
    idle: {
      true: "shadow-[inset_0_0_12px_oklch(0.78_0.12_85/0.08)]",
      false: "",
    },
  },
});

interface FactoryCardProps extends React.ComponentProps<"article"> {
  /**
   * The type of factory
   */
  type: FactoryType;
}

const FactoryCardContent = (props: Omit<FactoryCardProps, "type">) => {
  const { className, ...rest } = props;

  const { name, isUnlocked, isAutomated, isProducing, isLocked } =
    useFactoryCard();

  const headingId = React.useId();

  return (
    <>
      <h3 className="sr-only" id={headingId}>
        {name}
      </h3>

      <article
        aria-labelledby={headingId}
        className={cn(
          "relative inset-shadow-xs flex min-w-0 items-center pl-10",
          className
        )}
        data-automated={isAutomated}
        data-locked={isLocked}
        data-producing={isProducing}
        data-slot="factory-card"
        data-unlocked={isUnlocked}
        {...rest}
      >
        <FactoryCardProduce className="absolute top-1/2 left-0 z-10 -translate-y-1/2" />

        <div
          className={factoryCardPanelVariants({
            locked: isLocked,
            producing: isProducing,
            idle: isUnlocked && !isLocked && !isProducing,
          })}
          data-slot="factory-card-panel"
        >
          <FactoryCardProgress />

          <FactoryCardUpgrade />
        </div>
      </article>
    </>
  );
};

export const FactoryCard = (props: FactoryCardProps) => {
  const { type, ...rest } = props;

  return (
    <FactoryCardProvider factoryType={type}>
      <FactoryCardContent {...rest} />
    </FactoryCardProvider>
  );
};
