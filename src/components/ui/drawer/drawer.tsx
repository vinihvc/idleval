"use client";

import { Drawer as ArkDrawer, useDrawerContext } from "@ark-ui/react/drawer";
import { ark } from "@ark-ui/react/factory";
import { Portal } from "@ark-ui/react/portal";
import { Close } from "pixelarticons/react";
import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { WaxSeal } from "@/components/icons/wax-seal";
import { Button } from "@/components/ui/button";
import { DialogImage, DialogMedia } from "@/components/ui/dialog";
import { FantasyCorner } from "@/components/ui/fantasy-corner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/cn";

export const useDrawer = useDrawerContext;

export const DrawerProvider = (
  props: React.ComponentProps<typeof ArkDrawer.Indent>
) => {
  const { className, children, ...rest } = props;

  return (
    <ArkDrawer.Stack>
      <ArkDrawer.IndentBackground
        className={cn(
          "[--indent-opacity:calc(0.1*(1-var(--drawer-swipe-progress,0)))]",
          "fixed inset-0 z-50",
          "bg-background",
          "opacity-0",
          "pointer-events-none",
          "transition-opacity duration-300 ease-in",
          "data-[state=open]:opacity-(--indent-opacity)",
          "motion-reduce:transition-none!"
        )}
        data-slot="drawer-indent-background"
      />
      <ArkDrawer.Indent
        className={cn(
          "[--indent-radius:calc(1rem*(1-var(--drawer-swipe-progress,0)))]",
          "data-active:transform-[scale(calc(0.98+(0.02*var(--drawer-swipe-progress))))_translateY(calc(0.5rem*(1-var(--drawer-swipe-progress))))]",
          "transition-[border-radius,transform] duration-300 ease-in-out will-change-transform",
          "data-active:rounded-(--indent-radius)",
          "motion-reduce:transition-none!",
          className
        )}
        data-slot="drawer-indent"
        {...rest}
      >
        {children}
      </ArkDrawer.Indent>
    </ArkDrawer.Stack>
  );
};

export const Drawer = (props: React.ComponentProps<typeof ArkDrawer.Root>) => {
  const {
    lazyMount = false,
    modal = false,
    unmountOnExit = false,
    snapPoints = [1, 0.98],
    defaultSnapPoint = 1,
    snapToSequentialPoints = true,
    ...rest
  } = props;

  return (
    <ArkDrawer.Root
      data-slot="drawer"
      defaultSnapPoint={defaultSnapPoint}
      lazyMount={lazyMount}
      modal={modal}
      snapPoints={snapPoints}
      snapToSequentialPoints={snapToSequentialPoints}
      unmountOnExit={unmountOnExit}
      {...rest}
    />
  );
};

export const DrawerTrigger = (
  props: React.ComponentProps<typeof ArkDrawer.Trigger>
) => <ArkDrawer.Trigger data-slot="drawer-trigger" {...props} />;

const drawerOverlayVariants = tv({
  base: [
    "[--bg:rgb(20_15_10/calc(0.55*(1-var(--drawer-swipe-progress))))] [--blur:calc(6px*(1-var(--drawer-swipe-progress)))]",
    "fixed inset-0 z-50",
    "bg-(--bg) backdrop-blur-(--blur)",
    "data-[state=open]:fade-in-0 data-[state=open]:animate-in",
    "data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
    "motion-reduce:animate-none!",
  ],
});

export const DrawerOverlay = (
  props: React.ComponentProps<typeof ArkDrawer.Backdrop>
) => {
  const { className, ...rest } = props;
  return (
    <ArkDrawer.Backdrop
      className={cn(drawerOverlayVariants(), className)}
      data-slot="drawer-backdrop"
      {...rest}
    />
  );
};

const drawerPositionerVariants = tv({
  base: [
    "[--drawer-image-overflow:4.5rem] sm:[--drawer-image-overflow:4.5rem]",
    "fixed inset-0 z-50",
    "flex flex-col items-center justify-end",
    "w-screen overscroll-contain",
    // Full viewport height; sheet anchors to bottom-0 (nav overlays via z-index)
    "max-sm:bottom-0 max-sm:overflow-visible",
    "max-sm:pt-[calc(env(safe-area-inset-top,0)+var(--drawer-image-overflow))]",
    "has-data-[swipe-direction=up]:justify-start has-data-[swipe-direction=up]:pt-0 has-data-[swipe-direction=up]:max-sm:bottom-0",
    "has-data-[swipe-direction=left]:items-stretch has-data-[swipe-direction=left]:justify-start has-data-[swipe-direction=left]:pt-0 has-data-[swipe-direction=left]:max-sm:bottom-0",
    "has-data-[swipe-direction=right]:items-stretch has-data-[swipe-direction=right]:justify-end has-data-[swipe-direction=right]:pt-0 has-data-[swipe-direction=right]:max-sm:bottom-0",
  ],
  variants: {
    variant: {
      default: "",
      inset: "max-sm:p-0 sm:p-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface DrawerPositionerProps
  extends React.ComponentProps<typeof ArkDrawer.Positioner>,
    VariantProps<typeof drawerPositionerVariants> {}

export const DrawerPositioner = (props: DrawerPositionerProps) => {
  const { variant = "default", className, ...rest } = props;

  return (
    <ArkDrawer.Positioner
      className={cn(drawerPositionerVariants({ variant }), className)}
      data-slot="drawer-positioner"
      {...rest}
    />
  );
};

const drawerContentVariants = tv({
  base: [
    "[--bleed:2rem] [--drawer-image-overflow:4.5rem] [--space:--spacing(4)]",
    "group/drawer",
    "relative",
    "z-[calc(50+var(--layer-index,0))]",
    "max-h-[98svh] w-full",
    "max-sm:h-auto max-sm:max-h-[calc(100svh-env(safe-area-inset-top,0)-var(--drawer-image-overflow))] max-sm:shrink-0",
    "max-sm:has-data-[slot=drawer-media]:overflow-visible",
    "has-data-[slot=dialog-image]:max-h-[min(100svh,calc(100svh-var(--drawer-image-overflow)-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)))]",
    "-mb-(--bleed) pb-[calc(0+env(safe-area-inset-bottom,0)+var(--bleed))]",
    "max-sm:mb-0 max-sm:pb-(--bottom-nav-height)",
    "border-4 border-primary bg-popover",
    "text-muted",
    "inset-shadow-xs",
    "flex min-h-0 flex-col",
    "duration-300 ease-in-out will-change-transform",
    "data-swiping:select-none",
    "translate-y-[calc(-1.25rem*var(--nested-layer-count))]",
    "scale-[calc(1-0.1*var(--nested-layer-count))] opacity-[calc(1-0.1*var(--nested-layer-count))]",
    "data-[nested=drawer]:data-[state=closed]:slide-in-from-bottom-10 data-[nested=drawer]:data-[state=open]:slide-in-from-bottom-10 data-[has-nested=drawer]:origin-top",
    "motion-reduce:animate-none!",
  ],
  variants: {
    placement: {
      up: [
        "data-[state=open]:slide-in-from-top data-[state=open]:animate-in",
        "data-[state=closed]:slide-out-to-top data-[state=closed]:animate-out",
        "rounded-b-2xl",
      ],
      down: [
        "data-[state=closed]:slide-out-to-bottom data-[state=closed]:animate-out",
        "data-[state=open]:slide-in-from-bottom data-[state=open]:animate-in",
        "rounded-t-2xl",
      ],
      left: [
        "data-[state=open]:slide-in-from-left data-[state=open]:animate-in",
        "data-[state=closed]:slide-out-to-left data-[state=closed]:animate-out",
        "max-h-none max-w-md",
        "size-full",
        "rounded-e-2xl",
      ],
      right: [
        "data-[state=open]:slide-in-from-right data-[state=open]:animate-in",
        "data-[state=closed]:slide-out-to-right data-[state=closed]:animate-out",
        "max-h-none max-w-md",
        "size-full",
        "rounded-s-2xl",
      ],
    },
    variant: {
      default: "",
      inset: [
        "sm:rounded-2xl sm:border",
        "sm:**:data-[slot=drawer-footer]:rounded-b-[calc(var(--radius-2xl)-1px)]",
      ],
    },
  },
  defaultVariants: {
    placement: "down",
    variant: "default",
  },
});

const SWIPE_DIRECTION_TO_PLACEMENT = {
  start: "left",
  end: "right",
  up: "up",
  down: "down",
} as const;

interface DrawerContentProps
  extends React.ComponentProps<typeof ArkDrawer.Content>,
    VariantProps<typeof drawerContentVariants> {
  /**
   * Show close button at the top right corner
   *
   * @default true
   */
  showCloseButton?: boolean;
}

export const DrawerContent = (props: DrawerContentProps) => {
  const {
    variant = "default",
    showCloseButton = true,
    className,
    children,
    ...rest
  } = props;

  return (
    <Portal>
      <DrawerOverlay />
      <ArkDrawer.Context>
        {({ swipeDirection }) => (
          <DrawerPositioner variant={variant}>
            <ArkDrawer.Content
              className={cn(
                drawerContentVariants({
                  variant,
                  placement: SWIPE_DIRECTION_TO_PLACEMENT[swipeDirection],
                }),
                className
              )}
              data-slot="drawer-content"
              {...rest}
            >
              <DrawerGrabber />

              {children}

              <FantasyCorner position="tl" />
              <FantasyCorner position="tr" />

              {!!showCloseButton && (
                <DrawerClose asChild>
                  <Button
                    aria-label="Close"
                    className={cn(
                      "absolute top-2 right-2",
                      "size-12",
                      "inset-shadow-none rounded-full border-0 drop-shadow-[0_4px_5px_rgba(0,0,0,0.45)]",
                      "bg-transparent",
                      "hover:bg-transparent hover:brightness-110",
                      "focus-visible:brightness-110",
                      "active:brightness-95"
                    )}
                    size="icon-xl"
                    variant="ghost"
                  >
                    <WaxSeal className="absolute inset-0 size-full" />
                    <Close className="relative z-10 size-5 drop-shadow-[0_1px_1px_rgba(80,0,0,0.75)] sm:size-6" />
                  </Button>
                </DrawerClose>
              )}
            </ArkDrawer.Content>
          </DrawerPositioner>
        )}
      </ArkDrawer.Context>
    </Portal>
  );
};

export const DrawerContentInner = (
  props: React.ComponentProps<typeof ark.div>
) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        "flex flex-1 flex-col",
        "mx-auto w-full max-w-sm",
        "text-center",
        "transition-opacity duration-300",
        "group-data-[nested=drawer]/drawer:opacity-0 group-data-[nested=drawer]/drawer:data-[state=open]:opacity-100",
        "motion-reduce:transition-none!",
        className
      )}
      data-slot="drawer-content-inner"
      {...rest}
    />
  );
};

export const DrawerGrabber = (
  props: React.ComponentProps<typeof ArkDrawer.Grabber>
) => {
  const { className, ...rest } = props;

  return (
    <ark.div className="shrink-0 p-(--space)">
      <ArkDrawer.Grabber
        className={cn(
          "h-1 w-12",
          "mx-auto",
          "hidden shrink-0",
          "bg-primary/50",
          "rounded-full",
          "touch-none",
          "group-data-[swipe-direction=down]/drawer:flex",
          className
        )}
        {...rest}
        data-slot="drawer-grabber"
      >
        <ArkDrawer.GrabberIndicator
          className="size-full rounded-full"
          data-slot="drawer-grabber-indicator"
        />
      </ArkDrawer.Grabber>
    </ark.div>
  );
};

interface DrawerHeaderProps extends React.ComponentProps<typeof ark.div> {
  /**
   * The description of the drawer
   */
  description?: string;
  /**
   * The title of the drawer
   */
  title?: string;
}

export const DrawerHeader = (props: DrawerHeaderProps) => {
  const { className, title, description, children, ...rest } = props;

  return (
    <ark.div
      className={cn(
        "flex shrink-0 flex-col gap-1 text-center",
        "mt-4 p-(--space) pt-0 sm:mt-8",
        "in-[[data-slot=drawer-content]:has([data-slot=drawer-body])]:pb-3",
        className
      )}
      data-slot="drawer-header"
      {...rest}
    >
      {!!title && <DrawerTitle>{title}</DrawerTitle>}

      {!!description && <DrawerDescription>{description}</DrawerDescription>}

      {!title && typeof children === "string" ? (
        <DrawerTitle>{children}</DrawerTitle>
      ) : (
        children
      )}
    </ark.div>
  );
};

export const DrawerTitle = (
  props: React.ComponentProps<typeof ArkDrawer.Title>
) => {
  const { className, ...rest } = props;
  return (
    <ArkDrawer.Title
      className={cn(
        "muted font-display font-semibold text-xl leading-snug tracking-wide",
        className
      )}
      data-slot="drawer-title"
      {...rest}
    />
  );
};

export const DrawerDescription = (
  props: React.ComponentProps<typeof ArkDrawer.Description>
) => {
  const { className, ...rest } = props;

  return (
    <ArkDrawer.Description
      className={cn("text-xl leading-relaxed", className)}
      data-slot="drawer-description"
      {...rest}
    />
  );
};

interface DrawerBodyProps extends React.ComponentProps<typeof ark.div> {
  /**
   * Add a fade effect to the scroll area
   *
   * @default false
   */
  scrollFade?: boolean;
}

export const DrawerBody = (props: DrawerBodyProps) => {
  const { scrollFade = false, className, ...rest } = props;

  return (
    <ScrollArea className="min-h-0 flex-1" scrollFade={scrollFade}>
      <ark.div
        className={cn(
          "px-(--space) pt-(--space) max-sm:pb-2 sm:p-(--space)",
          "text-lg max-sm:text-center",
          "in-[[data-slot=drawer-content]:has([data-slot=drawer-footer]:not(.border-t))]:pb-1",
          className
        )}
        data-slot="drawer-body"
        {...rest}
      />
    </ScrollArea>
  );
};

export const DrawerMedia = (
  props: React.ComponentProps<typeof DialogMedia>
) => <DialogMedia data-slot="drawer-media" {...props} />;

export const DrawerImage = (
  props: React.ComponentProps<typeof DialogImage>
) => <DialogImage data-slot="drawer-image" {...props} />;

export const DrawerClose = (
  props: React.ComponentProps<typeof ArkDrawer.CloseTrigger>
) => <ArkDrawer.CloseTrigger data-slot="drawer-close" {...props} />;

export const DrawerFooter = (props: React.ComponentProps<typeof ark.div>) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        "**:data-[slot=drawer-content-inner]:flex-col-reverse **:data-[slot=drawer-content-inner]:gap-2",
        "flex flex-col-reverse gap-2",
        "sm:rounded-none",
        "px-(--space) pt-4",
        className
      )}
      data-slot="drawer-footer"
      {...rest}
    />
  );
};
