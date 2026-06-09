import type React from "react";
import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";
import { cn } from "@/lib/cn";

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
            "flex flex-1 flex-col items-center gap-1",
            "bg-popover",
            "rounded-lg border-2 border-secondary/60",
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

      <ResponsiveTooltipContent>{label}</ResponsiveTooltipContent>
    </ResponsiveTooltip>
  );
};

export const StatRow = (props: StatRowProps) => {
  const { label, className, children, ...rest } = props;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border border-primary/60 bg-popover px-3.5 py-1 font-medium text-lg text-muted",
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
