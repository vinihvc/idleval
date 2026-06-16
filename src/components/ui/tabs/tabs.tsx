"use client";

import { Tabs as ArkTabs, useTabsContext } from "@ark-ui/react/tabs";
import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const useTabs = useTabsContext;

export const Tabs = (props: React.ComponentProps<typeof ArkTabs.Root>) => {
  const { lazyMount = true, unmountOnExit = true, className, ...rest } = props;

  return (
    <ArkTabs.Root
      className={cn(
        "flex flex-col gap-2",
        "data-[orientation=vertical]:flex-row",
        className
      )}
      data-slot="tabs"
      lazyMount={lazyMount}
      unmountOnExit={unmountOnExit}
      {...rest}
    />
  );
};

const tabsListVariants = tv({
  slots: {
    base: [
      "relative z-0",
      "w-fit",
      "flex items-center gap-2 rounded-lg",
      "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
    ],
    indicator: [
      "pointer-events-none absolute inset-s-0 bottom-0",
      "h-(--height) w-(--width)",
      "transition-[width,translate] duration-200 ease-in-out",
      "motion-reduce:transition-none!",
    ],
  },
  variants: {
    variant: {
      default: {
        base: [
          "w-full max-w-full",
          "**:data-[slot=tabs-trigger]:min-w-0 **:data-[slot=tabs-trigger]:flex-1 **:data-[slot=tabs-trigger]:sm:flex-none",
        ],
        indicator: ["hidden"],
      },
      underline: {
        base: [
          "items-stretch justify-start gap-1",
          "text-popover-foreground/60",
          "data-[orientation=vertical]:px-1",
          "data-[orientation=horizontal]:border-primary/25 data-[orientation=horizontal]:border-b-2",
          "data-[orientation=horizontal]:py-1",
          "**:data-[slot=tabs-trigger]:hover:bg-primary/10",
          "**:data-[slot=tabs-trigger]:hover:text-popover-foreground",
          "**:data-[slot=tabs-trigger]:aria-selected:text-popover-foreground",
        ],
        indicator: [
          "z-10 bg-primary",
          "data-[orientation=horizontal]:h-0.5",
          "data-[orientation=vertical]:w-0.5",
        ],
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const tabsTriggerVariants = tv({
  base: [
    "relative shrink-0",
    "flex items-center justify-center gap-1.5",
    "whitespace-nowrap text-base tracking-wide",
    "cursor-pointer",
    "data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start",
    "focus-visible:z-10 focus-visible:outline-none",
    "data-disabled:pointer-events-none data-disabled:opacity-64",
    "[&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
    "motion-reduce:transition-none!",
  ],
  variants: {
    variant: {
      default: [
        buttonVariants({ clickEffect: false }),
        "h-9 min-w-9 px-2.5",
        "bg-primary/64 text-primary-foreground",
        "border-border",
        "active:brightness-95",
        "hover:brightness-105 focus-visible:ring-primary/20",
        "aria-selected:z-10",
        "aria-selected:border-primary/30 aria-selected:bg-secondary aria-selected:text-foreground",
        "pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
      ],
      underline: [
        "h-9 px-3 sm:h-8 sm:px-2.5",
        "font-display font-semibold text-sm",
        "transition-[color,background-color,border-color,box-shadow,transform]",
        "focus-visible:ring-[3px] focus-visible:ring-ring/32",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const tabsContentVariants = tv({
  base: ["flex-1 outline-none"],
  variants: {
    variant: {
      default: [],
      underline: [],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TabsVariantContextValue {
  variant: NonNullable<VariantProps<typeof tabsListVariants>["variant"]>;
}

const TabsVariantContext = React.createContext<TabsVariantContextValue>({
  variant: "default",
});

interface TabsListProps
  extends React.ComponentProps<typeof ArkTabs.List>,
    VariantProps<typeof tabsListVariants> {}

export const TabsList = (props: TabsListProps) => {
  const { variant = "default", className, children, ...rest } = props;

  const { base, indicator } = tabsListVariants({ variant });

  return (
    <TabsVariantContext.Provider value={{ variant }}>
      <ArkTabs.List
        className={cn(base(), className)}
        data-slot="tabs-list"
        data-variant={variant}
        {...rest}
      >
        {children}

        <ArkTabs.Indicator
          className={cn(indicator())}
          data-slot="tab-indicator"
        />
      </ArkTabs.List>
    </TabsVariantContext.Provider>
  );
};

export const TabsTrigger = (
  props: React.ComponentProps<typeof ArkTabs.Trigger>
) => {
  const { className, ...rest } = props;
  const { variant } = React.useContext(TabsVariantContext);

  return (
    <ArkTabs.Trigger
      className={cn(tabsTriggerVariants({ variant }), className)}
      data-slot="tabs-trigger"
      {...rest}
    />
  );
};

interface TabsContentProps
  extends React.ComponentProps<typeof ArkTabs.Content>,
    VariantProps<typeof tabsContentVariants> {}

export const TabsContent = (props: TabsContentProps) => {
  const { variant, className, ...rest } = props;
  const context = React.useContext(TabsVariantContext);
  const resolvedVariant = variant ?? context.variant;

  return (
    <ArkTabs.Content
      className={cn(
        tabsContentVariants({ variant: resolvedVariant }),
        className
      )}
      data-slot="tabs-content"
      {...rest}
    />
  );
};
