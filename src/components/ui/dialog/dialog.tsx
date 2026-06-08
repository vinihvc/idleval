"use client";

import { Dialog as ArkDialog, useDialogContext } from "@ark-ui/react/dialog";
import { ark } from "@ark-ui/react/factory";
import { Portal } from "@ark-ui/react/portal";
import { Image, type ImageProps } from "@unpic/react";
import { Close } from "pixelarticons/react/Close";
import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { WaxSeal } from "@/components/icons/wax-seal";
import { Button } from "@/components/ui/button";
import { FantasyCorner } from "@/components/ui/fantasy-corner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/cn";

export const useDialog = useDialogContext;

export const Dialog = (props: React.ComponentProps<typeof ArkDialog.Root>) => {
  const {
    modal = true,
    lazyMount = true,
    unmountOnExit = true,
    ...rest
  } = props;

  return (
    <ArkDialog.Root
      closeOnInteractOutside
      lazyMount={lazyMount}
      modal={modal}
      unmountOnExit={unmountOnExit}
      {...rest}
    />
  );
};

export const DialogTrigger = (
  props: React.ComponentProps<typeof ArkDialog.Trigger>
) => <ArkDialog.Trigger {...props} />;

export const dialogOverlayVariants = tv({
  base: [
    "fixed inset-0 z-50",
    "bg-stone-950/70 backdrop-blur-sm",
    "duration-200",
    "peer peer-data-[slot=dialog-overlay]:hidden",
    "data-[state=open]:fade-in-0 data-[state=open]:animate-in",
    "data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
    "motion-reduce:animate-none!",
  ],
});

export const DialogOverlay = (
  props: React.ComponentProps<typeof ArkDialog.Backdrop>
) => {
  const { className, ...rest } = props;

  return (
    <ArkDialog.Backdrop
      className={cn(dialogOverlayVariants(), className)}
      data-slot="dialog-overlay"
      {...rest}
    />
  );
};

export const DialogPositioner = (
  props: React.ComponentProps<typeof ArkDialog.Positioner>
) => {
  const { className, ...rest } = props;

  return (
    <ArkDialog.Positioner
      className={cn(
        "fixed inset-0 z-50",
        "h-svh w-screen overflow-y-auto",
        // Center dialog vertically; min top row reserves space for DialogMedia (-top-12 / sm:-top-18)
        "grid min-h-svh grid-rows-[minmax(3rem,1fr)_auto_minmax(0,1fr)] justify-items-center",
        "p-4 sm:grid-rows-[minmax(4.5rem,1fr)_auto_minmax(0,1fr)]",
        className
      )}
      data-slot="dialog-positioner"
      {...rest}
    />
  );
};

export const dialogContentVariants = tv({
  base: [
    "[--space:--spacing(3)] sm:[--space:--spacing(6)]",
    "z-[calc(50+var(--layer-index,0))]",
    "relative",
    "row-start-2",
    "h-auto max-h-[calc(100svh-2rem)] w-full min-w-0",
    "flex flex-col gap-2",
    "bg-popover",
    "text-muted",
    "rounded-xl border-4 border-primary ring-2 ring-secondary",
    "inset-shadow-xs",
    "outline-none",
    "translate-y-[calc(-1.25rem*var(--nested-layer-count))]",
    "transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform",
    "data-[nested=dialog]:data-[state=closed]:slide-in-from-bottom-10 data-[nested=dialog]:data-[state=open]:slide-in-from-bottom-10 data-[has-nested=dialog]:origin-top",
    "scale-[calc(1-0.1*var(--nested-layer-count))] opacity-[calc(1-0.1*var(--nested-layer-count))]",
    "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[98%] data-[state=closed]:animate-out",
    "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[98%] data-[state=open]:animate-in",
    "motion-reduce:animate-none! motion-reduce:transition-none!",
  ],
  variants: {
    size: {
      sm: ["max-w-md"],
      md: ["max-w-lg"],
      lg: ["max-w-xl"],
      xl: ["max-w-2xl"],
      "2xl": ["max-w-3xl"],
      "3xl": ["max-w-4xl"],
      "4xl": ["max-w-5xl"],
      "5xl": ["max-w-6xl"],
      "6xl": ["max-w-7xl"],
      fullscreen: ["size-full"],
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface DialogContentProps
  extends React.ComponentProps<typeof ArkDialog.Content>,
    VariantProps<typeof dialogContentVariants> {
  /**
   * Show close button at the top right corner
   *
   * @default true
   */
  showCloseButton?: boolean;
}

export const DialogContent = (props: DialogContentProps) => {
  const {
    showCloseButton = true,
    size = "md",
    className,
    children,
    ...rest
  } = props;

  return (
    <Portal>
      <DialogOverlay />

      <DialogPositioner>
        <ArkDialog.Content
          className={cn(dialogContentVariants({ size }), className)}
          data-slot="dialog-content"
          {...rest}
        >
          <FantasyCorner position="tl" />
          <FantasyCorner position="tr" />
          <FantasyCorner position="bl" />
          <FantasyCorner position="br" />

          {children}

          {!!showCloseButton && (
            <DialogClose asChild>
              <Button
                aria-label="Close"
                className={cn(
                  "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2",
                  "size-14",
                  "inset-shadow-none rounded-full border-0 drop-shadow-[0_4px_5px_rgba(0,0,0,0.45)]",
                  "bg-transparent",
                  "hover:bg-transparent hover:brightness-110",
                  "focus-visible:ring-0 focus-visible:brightness-110",
                  "active:scale-95 active:brightness-95"
                )}
                size="icon-xl"
                variant="ghost"
              >
                <WaxSeal className="absolute inset-0 size-full" />
                <Close className="size-6 drop-shadow-[0_1px_1px_rgba(80,0,0,0.75)]" />
              </Button>
            </DialogClose>
          )}
        </ArkDialog.Content>
      </DialogPositioner>
    </Portal>
  );
};

interface DialogBodyProps extends React.ComponentProps<typeof ark.div> {
  /**
   * Add a fade effect to the scroll area
   *
   * @default false
   */
  scrollFade?: boolean;
}

export const DialogBody = (props: DialogBodyProps) => {
  const { scrollFade = false, className, ...rest } = props;

  return (
    <ScrollArea
      className="h-auto max-h-[calc(100svh-12rem)] flex-none"
      scrollFade={scrollFade}
    >
      <ark.div
        className={cn(
          "p-(--space)",
          "text-lg max-sm:text-center",
          "overflow-auto",
          "in-[[data-slot=dialog-content]:has([data-slot=dialog-header])]:pt-1",
          "in-[[data-slot=dialog-content]:has([data-slot=dialog-footer]:not(.border-t))]:pb-1",
          className
        )}
        data-slot="dialog-body"
        {...rest}
      />
    </ScrollArea>
  );
};

interface DialogHeaderProps extends React.ComponentProps<typeof ark.div> {
  /**
   * The description of the dialog
   */
  description?: string;
  /**
   * The title of the dialog
   */
  title?: string;
}

export const DialogHeader = (props: DialogHeaderProps) => {
  const { className, title, description, children, ...rest } = props;

  return (
    <ark.div
      className={cn(
        "sm:mt-6",
        "flex flex-col gap-0.5",
        "text-center sm:text-left",
        "p-(--space)",
        "in-[[data-slot=dialog-content]:has([data-slot=dialog-body])]:pb-0",
        className
      )}
      data-slot="dialog-header"
      {...rest}
    >
      {!!title && <DialogTitle>{title}</DialogTitle>}

      {!!description && <DialogDescription>{description}</DialogDescription>}

      {!title && typeof children === "string" ? (
        <DialogTitle>{children}</DialogTitle>
      ) : (
        children
      )}
    </ark.div>
  );
};

export const DialogTitle = (
  props: React.ComponentProps<typeof ArkDialog.Title>
) => {
  const { className, ...rest } = props;

  return (
    <ArkDialog.Title
      className={cn(
        "font-display font-semibold text-2xl text-muted tracking-wide",
        className
      )}
      data-slot="dialog-title"
      {...rest}
    />
  );
};

export const DialogMedia = (props: React.ComponentProps<typeof ark.div>) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        "absolute top-0 left-1/2 -translate-y-2/3 max-md:-translate-x-1/2 md:left-2",
        "inline-flex items-center justify-center",
        "size-24",
        "p-1",
        "bg-card",
        "rounded-full border-8 border-secondary ring-4 ring-primary drop-shadow-lg sm:border-6",
        "overflow-hidden",
        className
      )}
      data-slot="dialog-media"
      {...rest}
    />
  );
};

export const DialogImage = (
  props: Pick<ImageProps, "alt" | "className" | "src">
) => {
  const { alt, className, src } = props;

  return (
    <Image
      alt={alt}
      aria-hidden
      className={cn(
        "pixel-crisp object-cover",
        "aspect-square size-16 sm:size-18",
        "bg-popover",
        "pointer-events-none",
        className
      )}
      data-slot="dialog-image"
      height={112}
      layout="constrained"
      src={src}
      width={112}
    />
  );
};

export const DialogDescription = (
  props: React.ComponentProps<typeof ArkDialog.Description>
) => {
  const { className, ...rest } = props;

  return (
    <ArkDialog.Description
      className={cn("text-xl", className)}
      data-slot="dialog-description"
      {...rest}
    />
  );
};

export const DialogClose = (
  props: React.ComponentProps<typeof ArkDialog.CloseTrigger>
) => <ArkDialog.CloseTrigger data-slot="dialog-close-trigger" {...props} />;

export const DialogFooter = (props: React.ComponentProps<typeof ark.div>) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        "sm:rounded-b-[calc(var(--radius-lg)-1px)]",
        "px-(--space) py-4",
        "bg-muted",
        "border-primary border-t-4",
        className
      )}
      data-slot="dialog-footer"
      {...rest}
    />
  );
};
