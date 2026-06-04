"use client";

import { Dialog as ArkDialog, useDialogContext } from "@ark-ui/react/dialog";
import { ark } from "@ark-ui/react/factory";
import { Portal } from "@ark-ui/react/portal";
import { Image } from "@unpic/react";
import { XIcon } from "lucide-react";
import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/cn";

export const useDialog = useDialogContext;

interface DialogContextProps {
  /**
   * Used internally to show or hide overlay
   *
   * @default true
   */
  modal?: boolean;
}

const DialogContext = React.createContext({} as DialogContextProps);

export const Dialog = (props: React.ComponentProps<typeof ArkDialog.Root>) => {
  const {
    modal = true,
    lazyMount = true,
    unmountOnExit = true,
    ...rest
  } = props;

  return (
    <DialogContext.Provider value={{ modal }}>
      <ArkDialog.Root
        lazyMount={lazyMount}
        modal={modal}
        unmountOnExit={unmountOnExit}
        {...rest}
      />
    </DialogContext.Provider>
  );
};

export const DialogTrigger = (
  props: React.ComponentProps<typeof ArkDialog.Trigger>
) => <ArkDialog.Trigger {...props} />;

export const dialogOverlayVariants = tv({
  base: [
    "fixed inset-0 z-50",
    "bg-foreground/40 backdrop-blur-xs",
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

  const { modal } = _useDialog();

  if (!modal) {
    return null;
  }

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
        // Reserve space for DialogImage (-top-12 / sm:-top-28) so it stays on-screen
        "grid grid-rows-[minmax(3rem,1fr)_auto_minmax(0,3fr)] justify-items-center",
        "p-4 sm:grid-rows-[minmax(7rem,1fr)_auto_minmax(0,3fr)]",
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
    "max-h-full min-h-0 w-full min-w-0",
    "flex flex-col gap-4",
    "bg-background text-foreground",
    "rounded-xl border border-foreground shadow-lg",
    "sm:shadow-[-6px_6px_0_0] sm:shadow-foreground",
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
    bottomStickOnMobile: {
      true: [
        "max-sm:max-w-none",
        "max-sm:rounded-none max-sm:rounded-t-2xl max-sm:border-x-0 max-sm:border-t max-sm:border-b-0",
        "max-sm:opacity-[calc(1-min(var(--nested-dialogs),1))]",
        "max-sm:data-[state=closed]:slide-out-to-bottom-5 max-sm:data-[state=open]:slide-in-from-bottom-5",
        "max-sm:data-[state=closed]:zoom-out-100 max-sm:data-[state=open]:zoom-in-100",
      ],
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
   * Stick the dialog to the bottom of the screen on mobile
   *
   * @default true
   */
  bottomStickOnMobile?: boolean;
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
    bottomStickOnMobile = true,
    size = "md",
    className,
    children,
    ...rest
  } = props;

  return (
    <Portal>
      <DialogOverlay />

      <DialogPositioner
        className={cn(
          bottomStickOnMobile &&
            "max-sm:grid-rows-[minmax(3rem,1fr)_auto] max-sm:overflow-y-auto max-sm:p-0 max-sm:pt-0"
        )}
      >
        <ArkDialog.Content
          className={cn(
            dialogContentVariants({ size, bottomStickOnMobile }),
            className
          )}
          data-slot="dialog-content"
          {...rest}
        >
          {children}

          {!!showCloseButton && (
            <DialogClose asChild>
              <Button
                aria-label="Close"
                className="absolute -top-4 -right-4 drop-shadow-lg max-sm:hidden"
                size="icon"
                variant="black"
              >
                <XIcon />
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
    <ScrollArea scrollFade={scrollFade}>
      <ark.div
        className={cn(
          "flex-1",
          "p-(--space)",
          "overflow-auto",
          "in-[[data-slot=dialog-content]:has([data-slot=dialog-header])]:pt-0",
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
        "mt-8 flex flex-col gap-2 text-center sm:mt-12 sm:text-left",
        "p-(--space)",
        "in-[[data-slot=dialog-content]:has([data-slot=dialog-body])]:pb-3",
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
      className={cn("font-bold text-2xl", className)}
      data-slot="dialog-title"
      {...rest}
    />
  );
};

interface DialogImageProps {
  alt: string;
  className?: string;
  src: string;
}

export const DialogImage = (props: DialogImageProps) => {
  const { className, ...rest } = props;

  return (
    <div
      className="absolute -top-12 left-1/2 inline-flex rounded-full border-4 border-foreground max-md:-translate-x-1/2 sm:-top-28 sm:border-6 md:left-2"
      data-slot="dialog-image"
    >
      <Image
        aria-hidden
        className={cn(
          "pointer-events-none aspect-square size-20 rounded-full border-2 border-white bg-foreground text-foreground drop-shadow-lg [image-rendering:pixelated] sm:size-40 sm:border-4",
          className
        )}
        height={200}
        layout="constrained"
        width={200}
        {...rest}
      />
    </div>
  );
};

export const DialogDescription = (
  props: React.ComponentProps<typeof ArkDialog.Description>
) => {
  const { className, ...rest } = props;

  return (
    <ArkDialog.Description
      className={cn("text-base opacity-80", className)}
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
        "sm:rounded-b-[calc(var(--radius-2xl)-1px)]",
        "px-(--space) py-4",
        "bg-muted/48",
        "border-t",
        className
      )}
      data-slot="dialog-footer"
      {...rest}
    />
  );
};

const _useDialog = () => {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
};
