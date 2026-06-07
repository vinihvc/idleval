import { useMediaQuery } from "@uidotdev/usehooks";
import React from "react";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogImage,
  DialogMedia,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerImage,
  DrawerMedia,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  notifyDrawerOpen,
  registerDrawer,
} from "@/components/ui/drawer-exclusive";

interface RootResponsiveDialogProps extends React.PropsWithChildren {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /**
   * The role of the dialog
   *
   * @default "dialog"
   */
  role?: "dialog" | "alertdialog";
}

interface ResponsiveDialogProps extends React.PropsWithChildren {
  asChild?: true;
  className?: string;
}

const ResponsiveDialogContext = React.createContext(
  {} as { isDesktop: boolean }
);

export const useResponsiveDialog = () => {
  const context = React.use(ResponsiveDialogContext);

  if (!context) {
    throw new Error(
      "ResponsiveDialog components cannot be rendered outside the ResponsiveDialog context"
    );
  }

  return context;
};

export const ResponsiveDialog = (props: RootResponsiveDialogProps) => {
  const { role = "dialog", open, onOpenChange, children, ...rest } = props;

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const drawerId = React.useId();

  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }

      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (isDesktop) {
      return;
    }

    return registerDrawer(drawerId, () => {
      setOpen(false);
    });
  }, [drawerId, isDesktop, setOpen]);

  const handleMobileOpenChange = React.useCallback(
    (details: { open: boolean }) => {
      if (details.open) {
        notifyDrawerOpen(drawerId);
      }

      setOpen(details.open);
    },
    [drawerId, setOpen]
  );

  const handleDesktopOpenChange = onOpenChange
    ? (details: { open: boolean }) => {
        onOpenChange(details.open);
      }
    : undefined;

  return (
    <ResponsiveDialogContext.Provider value={{ isDesktop }}>
      {isDesktop ? (
        <Dialog
          closeOnInteractOutside={role === "dialog"}
          onOpenChange={handleDesktopOpenChange}
          open={open}
          role={role}
          {...rest}
        >
          {children}
        </Dialog>
      ) : (
        <Drawer
          closeOnInteractOutside={role === "dialog"}
          modal={false}
          onOpenChange={handleMobileOpenChange}
          open={isOpen}
          role={role}
          trapFocus={false}
          {...rest}
        >
          {children}
        </Drawer>
      )}
    </ResponsiveDialogContext.Provider>
  );
};

export const ResponsiveDialogTrigger = (props: ResponsiveDialogProps) => {
  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogTrigger : DrawerTrigger;

  return <Component {...props} />;
};

export const ResponsiveDialogClose = (props: ResponsiveDialogProps) => {
  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogClose : DrawerClose;

  return <Component {...props} />;
};

interface ResponsiveDialogContentProps
  extends React.ComponentProps<typeof DialogContent> {}

export const ResponsiveDialogContent = (
  props: ResponsiveDialogContentProps
) => {
  const { isDesktop } = useResponsiveDialog();

  if (isDesktop) {
    return <DialogContent {...props} />;
  }

  const { size: _size, draggable: _draggable, ...drawerProps } = props;

  return <DrawerContent variant="inset" {...drawerProps} />;
};

export const ResponsiveDialogMedia = (
  props: React.ComponentProps<typeof DialogMedia>
) => {
  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogMedia : DrawerMedia;

  return <Component {...props} />;
};

export const ResponsiveDialogImage = (
  props: React.ComponentProps<typeof DialogImage>
) => {
  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogImage : DrawerImage;

  return <Component {...props} />;
};

export const ResponsiveDialogHeader = (props: ResponsiveDialogProps) => {
  const { className, ...rest } = props;

  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogHeader : DrawerHeader;

  return <Component className={className} {...rest} />;
};

export const ResponsiveDialogTitle = (props: ResponsiveDialogProps) => {
  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogTitle : DrawerTitle;

  return <Component {...props} />;
};

interface ResponsiveDialogDescriptionProps
  extends React.ComponentProps<typeof DialogDescription> {
  /**
   * Whether to hide the description on mobile
   */
  hideDescription?: boolean;
}

export const ResponsiveDialogDescription = (
  props: ResponsiveDialogDescriptionProps
) => {
  const { hideDescription = true, ...rest } = props;

  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogDescription : DrawerDescription;

  return <Component {...rest} />;
};

export const ResponsiveDialogBody = (props: ResponsiveDialogProps) => {
  const { isDesktop } = useResponsiveDialog();

  const { className, ...rest } = props;

  if (isDesktop) {
    return <DialogBody className={className} {...rest} />;
  }

  return <DrawerBody className={className} {...rest} />;
};

export const ResponsiveDialogFooter = (props: ResponsiveDialogProps) => {
  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogFooter : DrawerFooter;

  return <Component {...props} />;
};
