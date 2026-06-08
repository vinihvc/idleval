"use client";

import {
  Progress as ArkProgress,
  useProgressContext,
} from "@ark-ui/react/progress";
import type React from "react";
import { FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/cn";

export const useProgress = useProgressContext;

interface ProgressProps
  extends Omit<React.ComponentProps<typeof ArkProgress.Root>, "value"> {
  /**
   * Shows indeterminate progress
   *
   * @default false
   */
  indeterminate?: boolean;
  /**
   * The value of the progress bar
   *
   * @default 0
   */
  value?: number;
}

export const Progress = (props: ProgressProps) => {
  const {
    value,
    orientation = "horizontal",
    indeterminate = false,
    className,
    children,
    ...rest
  } = props;

  return (
    <ArkProgress.Root
      className={cn(
        "relative flex w-full flex-col gap-3",
        "data-[orientation=vertical]:-scale-y-100",
        className
      )}
      data-slot="progress"
      orientation={orientation}
      value={indeterminate ? null : value}
      {...rest}
    >
      {children}
    </ArkProgress.Root>
  );
};

export const ProgressTrack = (
  props: React.ComponentProps<typeof ArkProgress.Track>
) => {
  const { className, ...rest } = props;

  return (
    <ArkProgress.Track
      className={cn(
        "overflow-hidden bg-input",
        "data-[orientation=horizontal]:h-full data-[orientation=horizontal]:min-h-2 data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-full data-[orientation=vertical]:min-w-2",
        className
      )}
      data-slot="progress-track"
      {...rest}
    />
  );
};

export const ProgressRange = (
  props: React.ComponentProps<typeof ArkProgress.Range>
) => {
  const { className, ...rest } = props;

  return (
    <ArkProgress.Range
      className={cn(
        "bg-primary",
        "transition-all duration-300 ease-out",
        "data-[orientation=horizontal]:h-full",
        "data-[orientation=vertical]:h-full",
        "motion-reduce:animate-none! motion-reduce:transition-none!",
        "data-[state=indeterminate]:w-1/3 data-[state=indeterminate]:animate-indeterminate! data-[state=indeterminate]:duration-100",
        className
      )}
      data-slot="progress-range"
      {...rest}
    />
  );
};

export const ProgressValue = (
  props: React.ComponentProps<typeof ArkProgress.ValueText>
) => {
  const { className, ...rest } = props;

  return (
    <FieldLabel asChild>
      <ArkProgress.ValueText
        className={cn("ms-auto tabular-nums", className)}
        data-slot="progress-value"
        {...rest}
      />
    </FieldLabel>
  );
};
