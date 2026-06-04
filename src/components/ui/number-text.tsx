import type React from "react";
import { cn } from "@/lib/cn";

export const NumberText = (props: React.ComponentProps<"span">) => {
  const { className, ...rest } = props;

  return (
    <span className={cn("font-number tabular-nums", className)} {...rest} />
  );
};
