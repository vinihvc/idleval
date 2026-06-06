"use client";

import { Switch as ArkSwitch, useSwitchContext } from "@ark-ui/react/switch";
import type React from "react";
import { cn } from "@/lib/cn";

export const useSwitch = useSwitchContext;

export const Switch = (props: React.ComponentProps<typeof ArkSwitch.Root>) => {
  const { className, tabIndex, ...rest } = props;

  return (
    <ArkSwitch.Root
      className={cn(
        "group/switch",
        "[--thumb-size:--spacing(6)] sm:[--thumb-size:--spacing(5)]",
        "h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)]",
        "p-px",
        "inline-flex shrink-0 items-center",
        "rounded-full border border-border/80 shadow-sm",
        "transition-all",
        "outline-none [[data-focus-visible],[data-invalid]]:ring-[3px]",
        "data-focus-visible: data-focus-visible:ring-ring/32",
        "data-invalid:border-destructive data-invalid:ring-destructive/24",
        "dark:data-invalid:border-destructive-foreground dark:data-invalid:ring-destructive-foreground/20",
        "data-[state=checked]:border-secondary-foreground/25 data-[state=checked]:bg-secondary",
        "data-[state=unchecked]:bg-secondary/40",
        "data-disabled:pointer-events-none data-disabled:opacity-64",
        "motion-reduce:transition-none!",
        className
      )}
      data-slot="switch"
      {...rest}
    >
      <ArkSwitch.Control
        className="flex size-full items-center"
        data-slot="switch-control"
      >
        <ArkSwitch.Thumb
          className={cn(
            "block",
            "aspect-square h-full w-auto",
            "bg-card",
            "rounded-full shadow-md ring-1 ring-foreground/15",
            "pointer-events-none",
            "transition-transform",
            "data-[state=checked]:translate-x-[calc(var(--thumb-size)-4px)]",
            "data-[state=checked]:bg-secondary-foreground",
            "data-[state=unchecked]:translate-x-0",
            "motion-reduce:transition-none!"
          )}
          data-slot="switch-thumb"
        />
      </ArkSwitch.Control>

      <ArkSwitch.HiddenInput tabIndex={tabIndex} />
    </ArkSwitch.Root>
  );
};
