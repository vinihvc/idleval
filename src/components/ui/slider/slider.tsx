"use client";

import { Slider as ArkSlider, useSliderContext } from "@ark-ui/react/slider";
import React from "react";
import { FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/cn";

export const useSlider = useSliderContext;

export const Slider = (props: React.ComponentProps<typeof ArkSlider.Root>) => {
  const {
    value,
    defaultValue,
    min = 0,
    max = 100,
    className,
    children,
    ...rest
  } = props;

  const values = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value;
    }

    if (Array.isArray(defaultValue)) {
      return defaultValue;
    }

    return [min, max];
  }, [value, defaultValue, min, max]);

  return (
    <ArkSlider.Root
      className={cn(
        "flex min-w-0 flex-col gap-3",
        "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:max-w-full",
        "data-[orientation=vertical]:h-full",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      value={value}
      {...rest}
    >
      {children}

      <ArkSlider.Control
        className={cn(
          "relative w-full min-w-0 max-w-full",
          "flex items-center",
          "touch-none select-none",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          "data-disabled:pointer-events-none data-disabled:opacity-64"
        )}
        data-slot="slider-control"
      >
        <ArkSlider.Track
          className={cn(
            "grow",
            "rounded-full border-2 border-border bg-secondary/30",
            "select-none overflow-hidden",
            "data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full",
            "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5"
          )}
          data-slot="slider-track"
        >
          <ArkSlider.Range
            className={cn(
              "absolute",
              "bg-secondary",
              "select-none",
              "data-[orientation=horizontal]:h-full",
              "data-[orientation=vertical]:w-full data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch"
            )}
            data-slot="slider-range"
          />
        </ArkSlider.Track>

        {Array.from({ length: values.length }, (_, index) => {
          const key = `slider-thumb-${index}`;

          return (
            <ArkSlider.Thumb
              className={cn(
                "relative",
                "shrink-0",
                "size-5",
                "rounded-full border-3 border-border bg-popover shadow-sm",
                "cursor-grab select-none",
                "transition-[color,box-shadow,transform]",
                "focus-visible:border-popover-foreground focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/32",
                "origin-left data-dragging:scale-110 data-dragging:cursor-grabbing data-dragging:border-popover-foreground data-dragging:ring-[3px] data-dragging:ring-ring/32",
                "motion-reduce:transition-none!"
              )}
              data-slot="slider-thumb"
              index={index}
              key={key}
            >
              <ArkSlider.HiddenInput />
            </ArkSlider.Thumb>
          );
        })}
      </ArkSlider.Control>
    </ArkSlider.Root>
  );
};

export const SliderLabel = (props: React.ComponentProps<typeof FieldLabel>) => {
  const { children, ...rest } = props;

  return (
    <FieldLabel {...rest}>
      <ArkSlider.Label data-slot="slider-label">{children}</ArkSlider.Label>
    </FieldLabel>
  );
};

export const SliderValue = (
  props: React.ComponentProps<typeof ArkSlider.ValueText>
) => {
  const { className, ...rest } = props;

  return (
    <FieldLabel asChild>
      <ArkSlider.ValueText
        className={cn("ms-auto tabular-nums", className)}
        data-slot="slider-value"
        {...rest}
      />
    </FieldLabel>
  );
};
