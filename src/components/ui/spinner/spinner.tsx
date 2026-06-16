"use client";

import { Loader } from "pixelarticons/react/Loader";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";

export const Spinner = (props: React.ComponentProps<"svg">) => {
  const { "aria-label": ariaLabel, className, ...rest } = props;

  return (
    <Loader
      aria-label={ariaLabel ?? m["ui.a11y.loading"]()}
      className={cn("size-4 animate-spin", className)}
      data-slot="spinner"
      role="status"
      {...rest}
    />
  );
};
