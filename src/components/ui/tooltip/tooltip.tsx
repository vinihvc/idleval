"use client";

import { Portal } from "@ark-ui/react/portal";
import {
  Tooltip as ArkTooltip,
  useTooltipContext,
} from "@ark-ui/react/tooltip";
import type React from "react";
import { boxBorder } from "@/components/ui/box-border";
import { cn } from "@/lib/cn";

export const useTooltip = useTooltipContext;

export const Tooltip = (
  props: React.ComponentProps<typeof ArkTooltip.Root>
) => {
  const {
    positioning = {
      placement: "top",
    },
    lazyMount = true,
    unmountOnExit = true,
    closeDelay = 100,
    openDelay = 600,
    ...rest
  } = props;

  return (
    <ArkTooltip.Root
      closeDelay={closeDelay}
      data-slot="tooltip"
      lazyMount={lazyMount}
      openDelay={openDelay}
      positioning={positioning}
      unmountOnExit={unmountOnExit}
      {...rest}
    />
  );
};

export const TooltipTrigger = (
  props: React.ComponentProps<typeof ArkTooltip.Trigger>
) => <ArkTooltip.Trigger data-slot="tooltip-trigger" {...props} />;

export const TooltipContent = (
  props: React.ComponentProps<typeof ArkTooltip.Content>
) => {
  const { className, children, ...rest } = props;

  return (
    <Portal>
      <ArkTooltip.Positioner data-slot="tooltip-positioner">
        <ArkTooltip.Content
          className={cn(
            "[--space:--spacing(1.5)]",
            "p-(--space)",
            "bg-popover text-muted",
            "rounded-xl border-2 border-primary ring-1 ring-secondary",
            boxBorder({ variant: "brown", size: "sm" }),
            "inset-shadow-xs",
            "origin-(--transform-origin) outline-none duration-100",
            "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[98%] data-[state=open]:animate-in",
            "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[98%] data-[state=closed]:animate-out",
            "data-[placement=bottom]:slide-in-from-top-2",
            "data-[placement=left]:slide-in-from-end-2",
            "data-[placement=right]:slide-in-from-start-2",
            "data-[placement=top]:slide-in-from-bottom-2",
            "motion-reduce:animate-none!",
            "z-50 hidden w-fit sm:block",
            "not-[class*='w-']:min-w-0",
            className
          )}
          data-slot="tooltip-content"
          {...rest}
        >
          {children}
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </Portal>
  );
};

export const TooltipArrow = (
  props: React.ComponentProps<typeof ArkTooltip.Arrow>
) => {
  const { style, ...rest } = props;

  return (
    <ArkTooltip.Arrow
      data-slot="tooltip-arrow"
      style={
        {
          "--arrow-background": "var(--popover)",
          "--arrow-size": "calc(1.5 * var(--spacing))",
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      <ArkTooltip.ArrowTip className="border-primary/40 border-s border-t" />
    </ArkTooltip.Arrow>
  );
};
