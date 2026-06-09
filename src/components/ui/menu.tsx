"use client";

import { Portal } from "@ark-ui/react";
import { ark } from "@ark-ui/react/factory";
import {
  Menu as ArkMenu,
  type MenuContentProps,
  useMenuContext,
} from "@ark-ui/react/menu";
import { Check } from "pixelarticons/react/Check";
import { ChevronRight } from "pixelarticons/react/ChevronRight";
import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { boxBorder } from "@/components/ui/box-border";
import { cn } from "@/lib/cn";

export const useMenu = useMenuContext;

export const Menu = (props: React.ComponentProps<typeof ArkMenu.Root>) => {
  const {
    lazyMount = true,
    positioning = { placement: "bottom-end" },
    unmountOnExit = true,
    ...rest
  } = props;

  return (
    <ArkMenu.Root
      data-slot="menu"
      lazyMount={lazyMount}
      positioning={positioning}
      unmountOnExit={unmountOnExit}
      {...rest}
    />
  );
};

export const MenuTrigger = (
  props: React.ComponentProps<typeof ArkMenu.Trigger>
) => <ArkMenu.Trigger data-slot="menu-trigger" {...props} />;

export const MenuPositioner = (
  props: React.ComponentProps<typeof ArkMenu.Positioner>
) => {
  const { className, ...rest } = props;

  return (
    <ArkMenu.Positioner
      className={cn("outline-none", className)}
      data-slot="menu-positioner"
      {...rest}
    />
  );
};

export const menuContentVariants = tv({
  base: [
    "z-[calc(50+var(--nested-layer-count,0))]",
    "max-h-(--available-height) not-[class*='w-']:min-w-36",
    "[--space:--spacing(1.5)]",
    "flex flex-col gap-0.5",
    "p-(--space)",
    "bg-popover",
    "text-muted",
    "rounded-xl border-2 border-primary/40 shadow-lg/5",
    boxBorder({ variant: "brown", size: "sm" }),
    "inset-shadow-xs",
    "origin-(--transform-origin)",
    "outline-none",
    "overflow-y-auto",
    "duration-100",
    "data-[state=open]:animate-in",
    "data-[state=open]:fade-in-0",
    "data-[state=open]:zoom-in-[98%]",
    "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[98%]",
    "data-[state=closed]:animate-out",
    "data-[placement=bottom]:slide-in-from-top-2",
    "data-[placement=left]:slide-in-from-end-2",
    "data-[placement=right]:slide-in-from-start-2",
    "data-[placement=top]:slide-in-from-bottom-2",
    "motion-reduce:animate-none!",
  ],
});

export const MenuContent = (props: MenuContentProps) => {
  const { className, children, ...rest } = props;

  return (
    <Portal>
      <MenuPositioner>
        <ArkMenu.Content
          className={cn(menuContentVariants(), className)}
          data-slot="menu-content"
          {...rest}
        >
          {children}
        </ArkMenu.Content>
      </MenuPositioner>
    </Portal>
  );
};

interface MenuGroupProps
  extends React.ComponentProps<typeof ArkMenu.ItemGroup> {
  /**
   * The heading of the menu item group.
   */
  heading?: string;
}

export const MenuGroup = (props: MenuGroupProps) => {
  const { heading, children, ...rest } = props;

  return (
    <ArkMenu.ItemGroup data-slot="menu-group" {...rest}>
      {!!heading && <MenuGroupLabel>{heading}</MenuGroupLabel>}

      {children}
    </ArkMenu.ItemGroup>
  );
};

export const MenuSeparator = (
  props: React.ComponentProps<typeof ArkMenu.Separator>
) => {
  const { className, ...rest } = props;

  return (
    <ArkMenu.Separator
      className={cn("my-1 h-px bg-primary/20", className)}
      data-slot="menu-separator"
      {...rest}
    />
  );
};

const menuItemVariants = tv({
  base: [
    "group/menu-item",
    "relative",
    "w-full",
    "px-3 py-2",
    "flex items-center gap-2",
    "select-none font-medium text-base tracking-wide",
    "rounded-lg border-2 border-transparent",
    "outline-hidden",
    "transition-all",
    "group-data-[date=open]/trigger-item:border-primary/40 group-data-[date=open]/trigger-item:bg-secondary group-data-[date=open]/trigger-item:text-foreground",
    "data-disabled:pointer-events-none data-disabled:opacity-64",
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    "motion-reduce:transition-none!",
  ],
  variants: {
    variant: {
      default: [
        "data-highlighted:border-primary/40",
        "data-highlighted:bg-secondary",
        "data-highlighted:text-foreground",
        "data-highlighted:brightness-105",
      ],
      destructive: [
        "text-destructive",
        "data-highlighted:border-destructive/40",
        "data-highlighted:bg-destructive/10",
        "data-highlighted:text-destructive",
        "**:[svg]:text-destructive!",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface MenuItemProps
  extends React.ComponentProps<typeof ArkMenu.Item>,
    VariantProps<typeof menuItemVariants> {}

export const MenuItem = (props: MenuItemProps) => {
  const { variant = "default", className, ...rest } = props;

  return (
    <ArkMenu.Item
      className={cn(menuItemVariants({ variant }), className)}
      data-variant={variant}
      {...rest}
    />
  );
};

export const MenuQuickItem = (props: MenuItemProps) => {
  const { variant = "default", className, ...rest } = props;

  return (
    <ArkMenu.Item
      className={cn(
        menuItemVariants({ variant }),
        "flex-col gap-1",
        "[&_svg:not([class*='size-'])]:size-4.5",
        className
      )}
      {...rest}
    />
  );
};

export const MenuCheckboxItem = (
  props: React.ComponentProps<typeof ArkMenu.CheckboxItem>
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkMenu.CheckboxItem
      className={cn(
        menuItemVariants({ variant: "default" }),
        "ps-8",
        className
      )}
      {...rest}
    >
      <ArkMenu.ItemIndicator className="pointer-events-none absolute inset-s-2 flex size-4 items-center justify-center">
        <Check aria-hidden />
      </ArkMenu.ItemIndicator>

      <ArkMenu.ItemText>{children}</ArkMenu.ItemText>
    </ArkMenu.CheckboxItem>
  );
};

interface MenuRadioGroupProps
  extends React.ComponentProps<typeof ArkMenu.RadioItemGroup> {
  /**
   * The heading of the menu radio item group.
   */
  heading?: string;
}

export const MenuRadioGroup = (props: MenuRadioGroupProps) => {
  const { heading, children, ...rest } = props;

  return (
    <ArkMenu.RadioItemGroup data-slot="menu-radio-group" {...rest}>
      {!!heading && <MenuGroupLabel>{heading}</MenuGroupLabel>}

      {children}
    </ArkMenu.RadioItemGroup>
  );
};

export const MenuGroupLabel = (
  props: React.ComponentProps<typeof ArkMenu.ItemGroupLabel>
) => {
  const { className, ...rest } = props;

  return (
    <ArkMenu.ItemGroupLabel
      className={cn(
        "px-3 py-1.5",
        "font-medium text-muted/80 text-sm tracking-wide",
        "pointer-events-none",
        className
      )}
      data-slot="menu-group-label"
      {...rest}
    />
  );
};

export const MenuRadioItem = (
  props: React.ComponentProps<typeof ArkMenu.RadioItem>
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkMenu.RadioItem
      className={cn(
        menuItemVariants({ variant: "default" }),
        "ps-8",
        className
      )}
      data-slot="menu-radio-item"
      {...rest}
    >
      <ArkMenu.ItemIndicator className="pointer-events-none absolute inset-s-2 flex size-4 items-center justify-center">
        <Check aria-hidden />
      </ArkMenu.ItemIndicator>

      <ArkMenu.ItemText data-slot="menu-radio-item-text">
        {children}
      </ArkMenu.ItemText>
    </ArkMenu.RadioItem>
  );
};

export const MenuSub = (props: React.ComponentProps<typeof Menu>) => (
  <Menu data-slot="menu-sub" {...props} />
);

export const MenuSubContent = (
  props: React.ComponentProps<typeof ArkMenu.Content>
) => {
  const { className, ...rest } = props;

  return (
    <Portal>
      <MenuPositioner data-slot="menu-sub-positioner">
        <ArkMenu.Content
          className={cn(menuContentVariants(), className)}
          data-slot="menu-sub-content"
          {...rest}
        />
      </MenuPositioner>
    </Portal>
  );
};

export const MenuSubTrigger = (
  props: React.ComponentProps<typeof ArkMenu.TriggerItem>
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkMenu.TriggerItem
      className={cn(menuItemVariants({ variant: "default" }), className)}
      data-slot="menu-sub-trigger"
      {...rest}
    >
      {children}

      <MenuShortcut>
        <ChevronRight aria-hidden />
      </MenuShortcut>
    </ArkMenu.TriggerItem>
  );
};

export const MenuShortcut = (props: React.ComponentProps<typeof ark.span>) => {
  const { className, ...rest } = props;

  return (
    <ark.span
      className={cn(
        "ms-auto rtl:me-auto",
        "text-muted/80 text-sm tracking-wide",
        "group-data-highlighted/menu-item:group-data-[variant=destructive]/menu-item:text-destructive",
        className
      )}
      data-slot="menu-shortcut"
      {...rest}
    />
  );
};

export const MenuArrow = (
  props: React.ComponentProps<typeof ArkMenu.Arrow>
) => {
  const { style, ...rest } = props;

  return (
    <ArkMenu.Arrow
      style={
        {
          "--arrow-background": "var(--popover)",
          "--arrow-size": "calc(1.5 * var(--spacing))",
          ...style,
          left: "20px",
        } as React.CSSProperties
      }
      {...rest}
    >
      <ArkMenu.ArrowTip className="border-primary/40 border-s border-t" />
    </ArkMenu.Arrow>
  );
};
