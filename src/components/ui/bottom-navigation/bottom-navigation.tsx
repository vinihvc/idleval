"use client";

import { ark } from "@ark-ui/react/factory";
import type React from "react";
import { cn } from "@/lib/cn";
import { type SoundsType, sound as soundFunction } from "@/providers/sound";

export const BottomNavigation = (props: React.ComponentProps<"nav">) => {
  const { className, ...rest } = props;

  return (
    <nav
      className={cn("w-full shrink-0 sm:hidden", className)}
      data-slot="bottom-navigation"
      {...rest}
    />
  );
};

export const BottomNavigationList = (props: React.ComponentProps<"ul">) => {
  const { "aria-label": ariaLabel, className, ...rest } = props;

  return (
    <ul
      aria-label={ariaLabel}
      className={cn(
        "flex w-full shrink-0 items-center justify-around",
        "min-h-14",
        "border-t-2 bg-background/60 backdrop-blur-sm",
        "pb-[calc(env(safe-area-inset-bottom,0)+var(--spacing)*2)]",
        className
      )}
      data-slot="bottom-navigation-list"
      {...rest}
    />
  );
};

export const BottomNavigationListItem = (props: React.ComponentProps<"li">) => {
  const { className, ...rest } = props;

  return (
    <li
      className={cn("flex min-w-0 flex-1", className)}
      data-slot="bottom-navigation-list-item"
      {...rest}
    />
  );
};

export interface BottomNavigationItemProps
  extends React.ComponentProps<"button"> {
  /**
   * Sound played on click. Pass `false` to disable.
   *
   * @default 'click'
   */
  sound?: SoundsType | false;
}

export const BottomNavigationItem = (props: BottomNavigationItemProps) => {
  const {
    className,
    type = "button",
    sound = "click",
    onClick,
    ...rest
  } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (sound !== false) {
      soundFunction.play(sound);
    }

    onClick?.(event);
  };

  return (
    <button
      className={cn(
        "relative",
        "min-w-0",
        "flex flex-1 flex-col items-center justify-center gap-0.5",
        "p-2",
        "text-muted-foreground",
        "cursor-pointer",
        "transition-colors",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-64",
        "aria-disabled:pointer-events-none aria-disabled:opacity-64",
        "[&_svg:not([class*='size-'])]:size-6 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "has-[data-slot=bottom-navigation-item-label]:size-4",
        "pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
        "motion-reduce:transition-none!",
        className
      )}
      data-slot="bottom-navigation-item"
      type={type}
      {...rest}
      onClick={handleClick}
    />
  );
};

export const BottomNavigationItemIcon = (
  props: React.ComponentProps<typeof ark.span>
) => {
  const { className, ...rest } = props;

  return (
    <ark.span
      aria-hidden
      className={cn("flex items-center justify-center", className)}
      data-slot="bottom-navigation-item-icon"
      {...rest}
    />
  );
};

export const BottomNavigationItemLabel = (
  props: React.ComponentProps<typeof ark.span>
) => {
  const { className, ...rest } = props;

  return (
    <ark.span
      className={cn("truncate font-medium text-xs", className)}
      data-slot="bottom-navigation-item-label"
      {...rest}
    />
  );
};
