"use client";

import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { Portal } from "@ark-ui/react/portal";
import type React from "react";
import { menuContentVariants } from "@/components/ui/menu";
import { cn } from "@/lib/cn";

export const ToggleTooltip = (
  props: React.ComponentProps<typeof ArkPopover.Root>
) => {
  const {
    positioning = {
      placement: "top",
      gutter: 20,
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
      <ArkPopover.Positioner
        className={cn(
          "z-100 sm:max-w-[min(20rem,calc(100vw-2rem))]",
          fitContent
            ? "max-sm:w-fit max-sm:max-w-[calc(100vw-1rem)]"
            : "max-sm:fixed max-sm:inset-x-2 max-sm:max-w-[calc(100vw-1rem)]"
        )}
        data-slot="toggle-tooltip-positioner"
      >
        <ArkPopover.Content
          className={cn(
            menuContentVariants(),
            "relative z-100",
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
