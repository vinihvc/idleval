"use client";

import { useMediaQuery } from "@uidotdev/usehooks";
import React from "react";
import {
  ToggleTooltip,
  ToggleTooltipArrow,
  ToggleTooltipContent,
  ToggleTooltipTrigger,
} from "@/components/ui/toggle-tooltip";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResponsiveTooltipProps extends React.PropsWithChildren {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

interface ResponsiveTooltipPartProps extends React.PropsWithChildren {
  asChild?: true;
  className?: string;
}

const ResponsiveTooltipContext = React.createContext(
  {} as { isDesktop: boolean }
);

export const useResponsiveTooltip = () => {
  const context = React.use(ResponsiveTooltipContext);

  if (!context) {
    throw new Error(
      "ResponsiveTooltip components cannot be rendered outside the ResponsiveTooltip context"
    );
  }

  return context;
};

export const ResponsiveTooltip = (props: ResponsiveTooltipProps) => {
  const { onOpenChange, ...rest } = props;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Component = isDesktop ? Tooltip : ToggleTooltip;

  const handleOpenChange = onOpenChange
    ? (details: { open: boolean }) => {
        onOpenChange(details.open);
      }
    : undefined;

  return (
    <ResponsiveTooltipContext.Provider value={{ isDesktop }}>
      <Component onOpenChange={handleOpenChange} {...rest} />
    </ResponsiveTooltipContext.Provider>
  );
};

export const ResponsiveTooltipTrigger = (props: ResponsiveTooltipPartProps) => {
  const { isDesktop } = useResponsiveTooltip();

  const Component = isDesktop ? TooltipTrigger : ToggleTooltipTrigger;

  return <Component {...props} />;
};

export const ResponsiveTooltipContent = (
  props: React.ComponentProps<typeof TooltipContent>
) => {
  const { isDesktop } = useResponsiveTooltip();

  const Component = isDesktop ? TooltipContent : ToggleTooltipContent;

  return <Component {...props} />;
};

export const ResponsiveTooltipArrow = (
  props: React.ComponentProps<typeof TooltipArrow>
) => {
  const { isDesktop } = useResponsiveTooltip();

  const Component = isDesktop ? TooltipArrow : ToggleTooltipArrow;

  return <Component {...props} />;
};
