import type React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "min-w-0",
            "flex flex-1 flex-col items-center gap-1",
            "px-1 py-2",
            "bg-popover-foreground/6",
            "rounded-lg border border-primary/25",
            className
          )}
          {...rest}
        >
          <span
            aria-hidden
            className="flex shrink-0 items-center justify-center text-popover-foreground [&_svg:not([class*='size-'])]:size-5 [&_svg]:shrink-0 [&_svg]:opacity-80"
          >
            {icon}
          </span>
          <div className="w-full text-center font-medium text-2xl text-popover-foreground">
            {children}
          </div>
        </div>
      </TooltipTrigger>

      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export const StatRow = (props: StatRowProps) => {
  const { label, className, children, ...rest } = props;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3.5 py-1 font-medium text-lg text-popover-foreground",
        className
      )}
      {...rest}
    >
      <span className="shrink-0">{label}</span>
      {children}
    </div>
  );
};
