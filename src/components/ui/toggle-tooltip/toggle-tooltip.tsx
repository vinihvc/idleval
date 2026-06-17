"use client";

import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { Portal } from "@ark-ui/react/portal";
import type React from "react";
import { boxBorder } from "@/components/ui/box-border";
import { cn } from "@/lib/cn";

export const ToggleTooltip = (
  props: React.ComponentProps<typeof ArkPopover.Root>
) => {
  const {
    positioning = {
      placement: "top",
    },
    lazyMount = true,
    unmountOnExit = true,
    modal = false,
    ...rest
  } = props;

  return (
    <ArkPopover.Root
      data-slot="toggle-tooltip"
      lazyMount={lazyMount}
      modal={modal}
      positioning={positioning}
      unmountOnExit={unmountOnExit}
      {...rest}
    />
  );
};

export const ToggleTooltipTrigger = (
  props: React.ComponentProps<typeof ArkPopover.Trigger>
) => <ArkPopover.Trigger data-slot="toggle-tooltip-trigger" {...props} />;

export const ToggleTooltipContent = (
  props: React.ComponentProps<typeof ArkPopover.Content> & {
    fitContent?: boolean;
  }
) => {
  const { className, children, fitContent = false, ...rest } = props;

  return (
    <Portal>
      <ArkPopover.Positioner data-slot="toggle-tooltip-positioner">
        <ArkPopover.Content
          className={cn(
            "relative z-100",
            "px-2.5 py-1.5",
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
            fitContent
              ? "max-sm:w-fit max-sm:max-w-none sm:max-w-72"
              : "w-full min-w-0 max-sm:max-w-[calc(100vw-1rem)] sm:max-w-72",
            "not-[class*='w-']:min-w-0",
            "wrap-break-word whitespace-normal text-pretty",
            className
          )}
          data-slot="toggle-tooltip-content"
          {...rest}
        >
          {children}

          <ToggleTooltipClose className="absolute inset-0 focus-visible:outline-none" />
        </ArkPopover.Content>
      </ArkPopover.Positioner>
    </Portal>
  );
};

export const ToggleTooltipArrow = (
  props: React.ComponentProps<typeof ArkPopover.Arrow>
) => {
  const { style, ...rest } = props;

  return (
    <ArkPopover.Arrow
      data-slot="toggle-tooltip-arrow"
      style={
        {
          "--arrow-background": "var(--popover)",
          "--arrow-size": "calc(1.5 * var(--spacing))",
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      <ArkPopover.ArrowTip className="border-primary/40 border-s border-t" />
    </ArkPopover.Arrow>
  );
};

export const ToggleTooltipClose = (
  props: React.ComponentProps<typeof ArkPopover.CloseTrigger>
) => <ArkPopover.CloseTrigger data-slot="toggle-tooltip-close" {...props} />;
