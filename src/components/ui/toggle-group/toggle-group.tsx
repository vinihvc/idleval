"use client";

import {
  ToggleGroup as ArkToggleGroup,
  useToggleGroupContext as useArkToggleGroupContext,
} from "@ark-ui/react/toggle-group";
import React from "react";
import { tv } from "tailwind-variants";
import { Toggle, type ToggleProps } from "@/components/ui/toggle";
import { cn } from "@/lib/cn";

export const useToggleGroup = useArkToggleGroupContext;

type ToggleGroupContextProps = Pick<ToggleProps, "size">;

const ToggleGroupContext = React.createContext({} as ToggleGroupContextProps);

interface ToggleGroupProps
  extends React.ComponentProps<typeof ArkToggleGroup.Root>,
    ToggleGroupContextProps {}

const toggleGroupVariants = tv({
  base: ["w-fit", "flex items-center gap-2", "rounded-lg"],
  variants: {
    orientation: {
      horizontal: "flex-row pointer-coarse:*:after:min-w-auto",
      vertical: "flex-col items-stretch pointer-coarse:*:after:min-h-auto",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const ToggleGroup = (props: ToggleGroupProps) => {
  const {
    multiple = true,
    orientation = "horizontal",
    size = "md",
    className,
    ...rest
  } = props;

  return (
    <ToggleGroupContext.Provider value={{ size }}>
      <ArkToggleGroup.Root
        className={cn(toggleGroupVariants({ orientation }), className)}
        data-slot="toggle-group"
        multiple={multiple}
        orientation={orientation}
        {...rest}
      />
    </ToggleGroupContext.Provider>
  );
};

interface ToggleGroupItemProps
  extends React.ComponentProps<typeof ArkToggleGroup.Item> {}

export const ToggleGroupItem = (props: ToggleGroupItemProps) => {
  const { value, className, ...rest } = props;

  const { size } = useToggleGroupContext();

  return (
    <ArkToggleGroup.Item asChild data-slot="toggle-group-item" value={value}>
      <Toggle
        className={cn("shrink-0 focus:z-10 focus-visible:z-10", className)}
        size={size}
        {...rest}
      />
    </ArkToggleGroup.Item>
  );
};

const useToggleGroupContext = () => {
  const context = React.useContext(ToggleGroupContext);

  if (!context) {
    throw new Error("useToggleGroupContext must be used within a ToggleGroup");
  }

  return context;
};
