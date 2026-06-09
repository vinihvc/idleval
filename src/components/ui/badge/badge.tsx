"use client";

import { ark } from "@ark-ui/react/factory";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

export const badgeVariants = tv({
  base: [
    "relative",
    "inline-flex items-center justify-center gap-1",
    "select-none whitespace-nowrap font-medium text-sm",
    "rounded-md border border-transparent",
    "overflow-hidden",
    "transition-colors",
    "[-webkit-text-stroke-width:0]",
    "focus-visible: outline-none focus-visible:ring-[3px] focus-visible:ring-ring/32",
    "[&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0",
    "[button&,a&]:cursor-pointer [button&,a&]:pointer-coarse:after:absolute [button&,a&]:pointer-coarse:after:size-full [button&,a&]:pointer-coarse:after:min-h-11 [button&,a&]:pointer-coarse:after:min-w-11",
    "motion-reduce:transition-none!",
  ],
  variants: {
    variant: {
      default: [
        "bg-primary",
        "border-primary-foreground/30",
        "text-primary-foreground",
        "focus-visible:border-background focus-visible:ring-primary/50",
        "[a&]:hover:brightness-105 [button&]:hover:brightness-105",
      ],
      brown: [
        "bg-secondary",
        "text-foreground",
        "border-primary",
        "focus-visible:ring-primary/50",
        "[a&]:hover:brightness-105 [button&]:hover:brightness-105",
      ],
      cream: [
        "bg-popover",
        "text-muted",
        "border-primary/60",
        "focus-visible:ring-primary/50",
        "[a&]:hover:brightness-105 [button&]:hover:brightness-105",
      ],
      stone: [
        "bg-stone",
        "text-white",
        "border-stone-foreground",
        "focus-visible:ring-stone/50",
        "[a&]:hover:brightness-105 [button&]:hover:brightness-105",
      ],
      green: [
        "bg-success",
        "text-white",
        "border-success-foreground",
        "focus-visible:ring-success/50",
        "[a&]:hover:brightness-105 [button&]:hover:brightness-105",
      ],
      blue: [
        "bg-info",
        "text-white",
        "border-info-foreground",
        "focus-visible:ring-info/50",
        "[a&]:hover:brightness-105 [button&]:hover:brightness-105",
      ],
      purple: [
        "bg-tertiary",
        "text-white",
        "border-tertiary-foreground",
        "focus-visible:ring-tertiary/50",
        "[a&]:hover:brightness-105 [button&]:hover:brightness-105",
      ],
      destructive: [
        "bg-destructive",
        "text-white",
        "border-destructive-foreground",
        "focus-visible:ring-destructive/50",
        "[a&]:hover:brightness-105 [button&]:hover:brightness-105",
      ],
    },
    size: {
      sm: ["h-5 min-w-5", "px-1"],
      md: ["h-5.5 min-w-5.5", "px-1.5"],
      lg: ["h-6.5 min-w-6.5", "px-2", "text-sm"],
    },
    pill: {
      true: [
        "rounded-full",
        "has-[>svg]:data-[size=sm]:pe-1.5",
        "has-[>svg]:data-[size=md]:pe-2",
        "has-[>svg]:data-[size=lg]:pe-2 sm:has-[>svg]:data-[size=lg]:pe-2.5",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    pill: false,
  },
});

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface BadgeProps
  extends React.ComponentProps<typeof ark.span>,
    VariantProps<typeof badgeVariants> {}

export const Badge = (props: BadgeProps) => {
  const {
    variant = "default",
    size = "md",
    pill = false,
    className,
    ...rest
  } = props;

  return (
    <ark.span
      className={cn(badgeVariants({ variant, size, pill }), className)}
      data-size={size}
      data-slot="badge"
      data-variant={variant}
      {...rest}
    />
  );
};
