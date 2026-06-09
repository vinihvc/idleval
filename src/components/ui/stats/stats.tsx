import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";
import { cn } from "@/lib/cn";

export const statsVariants = tv({
  slots: {
    tile: [
      "min-w-0",
      "flex flex-1 flex-col items-center gap-1",
      "px-1 py-2.5",
      "rounded-lg border",
    ],
    tileIcon: [
      "flex shrink-0 items-center justify-center",
      "[&_svg:not([class*='size-'])]:size-5 [&_svg]:shrink-0 [&_svg]:opacity-80",
    ],
    tileValue: ["w-full text-center font-medium text-2xl"],
    row: [
      "flex items-center justify-between gap-3",
      "rounded-md border px-3.5 py-1 font-medium text-lg",
    ],
  },
  variants: {
    variant: {
      default: {
        tile: "border-primary-foreground/30 bg-primary",
        tileIcon: "text-primary-foreground/80",
        tileValue: "text-primary-foreground",
        row: "border-primary-foreground/30 bg-primary text-primary-foreground",
      },
      brown: {
        tile: "border-primary bg-secondary",
        tileIcon: "text-foreground/80",
        tileValue: "text-foreground",
        row: "border-primary bg-secondary text-foreground",
      },
      cream: {
        tile: "border-primary/60 bg-popover",
        tileIcon: "text-muted/80",
        tileValue: "text-muted",
        row: "border-primary/60 bg-popover text-muted",
      },
      stone: {
        tile: "border-stone-foreground bg-stone",
        tileIcon: "text-white/80",
        tileValue: "text-white",
        row: "border-stone-foreground bg-stone text-white",
      },
      green: {
        tile: "border-success-foreground bg-success",
        tileIcon: "text-white/80",
        tileValue: "text-white",
        row: "border-success-foreground bg-success text-white",
      },
      blue: {
        tile: "border-info-foreground bg-info",
        tileIcon: "text-white/80",
        tileValue: "text-white",
        row: "border-info-foreground bg-info text-white",
      },
      purple: {
        tile: "border-tertiary-foreground bg-tertiary",
        tileIcon: "text-white/80",
        tileValue: "text-white",
        row: "border-tertiary-foreground bg-tertiary text-white",
      },
      destructive: {
        tile: "border-destructive-foreground bg-destructive",
        tileIcon: "text-white/80",
        tileValue: "text-white",
        row: "border-destructive-foreground bg-destructive text-white",
      },
    },
  },
  defaultVariants: {
    variant: "cream",
  },
});

export type StatsVariant = VariantProps<typeof statsVariants>["variant"];

interface StatRowProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof statsVariants> {
  label: React.ReactNode;
}

interface StatTileProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof statsVariants> {
  icon: React.ReactNode;
  label: string;
}

export const StatTile = (props: StatTileProps) => {
  const { icon, label, variant, className, children, ...rest } = props;

  const { tile, tileIcon, tileValue } = statsVariants({ variant });

  return (
    <ResponsiveTooltip>
      <ResponsiveTooltipTrigger asChild>
        <div
          className={cn(tile(), className)}
          data-slot="stat-tile"
          data-variant={variant ?? "cream"}
          {...rest}
        >
          <span className="sr-only">{label}</span>
          <span aria-hidden className={tileIcon()}>
            {icon}
          </span>
          <div className={tileValue()}>{children}</div>
        </div>
      </ResponsiveTooltipTrigger>

      <ResponsiveTooltipContent>{label}</ResponsiveTooltipContent>
    </ResponsiveTooltip>
  );
};

export const StatRow = (props: StatRowProps) => {
  const { label, variant, className, children, ...rest } = props;

  const { row } = statsVariants({ variant });

  return (
    <div
      className={cn(row(), className)}
      data-slot="stat-row"
      data-variant={variant ?? "cream"}
      {...rest}
    >
      <span className="shrink-0">{label}</span>
      {children}
    </div>
  );
};
