import type React from "react";
import { cn } from "@/lib/cn";

interface StatRowProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;
}

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
