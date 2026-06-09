"use client";

import { Tabs as ArkTabs, useTabsContext } from "@ark-ui/react/tabs";
import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { boxBorder } from "@/components/ui/box-border";
import { cn } from "@/lib/cn";

const selectedTabShadow = boxBorder({
  variant: "default",
  size: "sm",
  soft: false,
  intensity: "subtle",
})
  .split(/\s+/)
  .filter(Boolean)
  .map(
    (shadowClass) => `**:data-[slot=tabs-trigger]:aria-selected:${shadowClass}`
  );

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
      "flex items-stretch justify-start gap-1",
      "data-[orientation=vertical]:flex-col",
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
          "w-full max-w-full overflow-x-auto",
          "rounded-md border-3 border-primary/70 bg-secondary/15 p-1",
          "text-popover-foreground/65",
          "shadow-[inset_0_2px_10px_oklch(0.12_0.02_55/0.22)]",
          "**:data-[slot=tabs-trigger]:min-w-0 **:data-[slot=tabs-trigger]:flex-1 **:data-[slot=tabs-trigger]:sm:flex-none",
          "**:data-[slot=tabs-trigger]:rounded-t-sm **:data-[slot=tabs-trigger]:rounded-b-none",
          "**:data-[slot=tabs-trigger]:border-2 **:data-[slot=tabs-trigger]:border-transparent",
          "**:data-[slot=tabs-trigger]:bg-transparent",
          "**:data-[slot=tabs-trigger]:text-popover-foreground/65",
          "**:data-[slot=tabs-trigger]:hover:border-primary/25 **:data-[slot=tabs-trigger]:hover:bg-primary/10",
          "**:data-[slot=tabs-trigger]:hover:text-popover-foreground",
          "**:data-[slot=tabs-trigger]:aria-selected:z-10",
          "**:data-[slot=tabs-trigger]:aria-selected:-translate-y-px",
          "**:data-[slot=tabs-trigger]:aria-selected:border-primary/80",
          "**:data-[slot=tabs-trigger]:aria-selected:bg-primary",
          "**:data-[slot=tabs-trigger]:aria-selected:text-primary-foreground",
          ...selectedTabShadow,
        ],
        indicator: ["hidden"],
      },
      underline: {
        base: [
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
    "relative",
    "h-9 sm:h-8",
    "flex shrink-0 items-center justify-center gap-1.5",
    "px-3 sm:px-2.5",
    "whitespace-nowrap font-display font-semibold text-sm tracking-wide",
    "cursor-pointer",
    "transition-[color,background-color,border-color,box-shadow,transform]",
    "data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/32",
    "data-disabled:pointer-events-none data-disabled:opacity-64",
    "[&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
    "motion-reduce:transition-none!",
  ],
});

const tabsContentVariants = tv({
  base: ["flex-1 outline-none"],
  variants: {
    variant: {
      default: [
        "rounded-md border-3 border-secondary/45 border-t-2 border-t-primary/35 bg-secondary/8 p-0.5",
        "shadow-[inset_0_1px_0_oklch(1_0_0/0.05)]",
      ],
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

  return (
    <ArkTabs.Trigger
      className={cn(tabsTriggerVariants(), className)}
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
