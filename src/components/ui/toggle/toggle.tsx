"use client";

import { Toggle as ArkToggle, useToggleContext } from "@ark-ui/react/toggle";
import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const useToggle = useToggleContext;

export const toggleVariants = tv({
  base: [
    "relative",
    "bg-primary/64",
    "text-base text-primary-foreground",
    "active:brightness-95",
    "border-border",
    "hover:brightness-105 focus-visible:ring-primary/20",
    "data-[state=on]:border-primary/30 data-[state=on]:bg-muted data-[state=on]:text-foreground",
    "pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
  ],
  variants: {
    size: {
      sm: "h-7 min-w-7 px-1.5",
      md: "h-8 min-w-8 px-2",
      lg: "h-9 min-w-9 px-2.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface ToggleProps
  extends React.ComponentProps<typeof ArkToggle.Root>,
    VariantProps<typeof toggleVariants> {}

export const Toggle = (props: ToggleProps) => {
  const { size = "md", className, ...rest } = props;

  return (
    <ArkToggle.Root
      className={cn(
        buttonVariants({ clickEffect: false }),
        toggleVariants({ size }),
        className
      )}
      data-slot="toggle"
      {...rest}
    />
  );
};

export const ToggleIndicator = (
  props: React.ComponentProps<typeof ArkToggle.Indicator>
) => {
  const { children, ...rest } = props;

  return (
    <ArkToggle.Indicator
      className="flex items-center gap-2"
      data-slot="toggle-indicator"
      {...rest}
    >
      {children}
    </ArkToggle.Indicator>
  );
};
