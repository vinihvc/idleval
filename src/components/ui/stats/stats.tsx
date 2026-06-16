import type React from "react";
import { tv } from "tailwind-variants";
import { boxBorder } from "@/components/ui/box-border";
import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";
import { cn } from "@/lib/cn";

const statSurfaceVariants = tv({
  base: [
    "bg-popover",
    "text-muted",
    "border-2 border-primary ring-1 ring-secondary",
    boxBorder({ variant: "brown", size: "sm" }),
    "inset-shadow-xs",
  ],
  variants: {
    shape: {
      tile: "rounded-xl",
      row: "rounded-lg",
    },
  },
  defaultVariants: {
    shape: "tile",
  },
});

interface StatRowProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;
}

interface StatTileProps extends React.ComponentProps<"div"> {
  icon: React.ReactNode;
  label: string;
}

export const StatTile = (props: StatTileProps) => {
  const { icon, label, className, children, ...rest } = props;

  return (
    <ResponsiveTooltip>
      <ResponsiveTooltipTrigger asChild>
        <div
          className={cn(
            "min-w-0",
            "px-1 py-2.5",
            "flex flex-1 flex-col items-center gap-2",
            statSurfaceVariants({ shape: "tile" }),
            className
          )}
          data-slot="stat-tile"
          {...rest}
        >
          <span className="sr-only">{label}</span>
          <span
            aria-hidden
            className={cn(
              "flex shrink-0 items-center justify-center",
              "text-muted/80",
              "[&_svg:not([class*='size-'])]:size-5 [&_svg]:shrink-0",
              className
            )}
          >
            {icon}
          </span>
          <div className="w-full text-center font-medium text-2xl text-muted">
            {children}
          </div>
        </div>
      </ResponsiveTooltipTrigger>

      <ResponsiveTooltipContent fitContent>{label}</ResponsiveTooltipContent>
    </ResponsiveTooltip>
  );
};

export const StatRow = (props: StatRowProps) => {
  const { label, className, children, ...rest } = props;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        "px-3.5 py-1 font-medium text-lg",
        statSurfaceVariants({ shape: "row" }),
        className
      )}
      data-slot="stat-row"
      {...rest}
    >
      <span className="shrink-0">{label}</span>
      {children}
    </div>
  );
};
