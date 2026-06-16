"use client";

import { Portal } from "@ark-ui/react/portal";
import {
  Tooltip as ArkTooltip,
  useTooltipContext,
} from "@ark-ui/react/tooltip";
import type React from "react";
import { menuContentVariants } from "@/components/ui/menu";
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
            menuContentVariants(),
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
