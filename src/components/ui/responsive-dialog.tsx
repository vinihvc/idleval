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
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerImage,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

interface RootResponsiveDialogProps extends React.PropsWithChildren {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  role?: "dialog" | "alertdialog";
}

interface ResponsiveDialogProps extends React.PropsWithChildren {
  asChild?: true;
  className?: string;
}

const ResponsiveDialogContext = React.createContext<{
  isDesktop: boolean;
} | null>(null);

export const useResponsiveDialog = () => {
  const context = React.useContext(ResponsiveDialogContext);

  if (!context) {
    throw new Error(
      "ResponsiveDialog components cannot be rendered outside the ResponsiveDialog context"
    );
  }

  return context;
};

export const ResponsiveDialog = (props: RootResponsiveDialogProps) => {
  const { role, onOpenChange, ...rest } = props;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Component = isDesktop ? Dialog : Drawer;

  const handleOpenChange = onOpenChange
    ? (details: { open: boolean }) => {
        onOpenChange(details.open);
      }
    : undefined;

  return (
    <ResponsiveDialogContext.Provider value={{ isDesktop }}>
      <Component onOpenChange={handleOpenChange} role={role} {...rest} />
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

  const {
    bottomStickOnMobile: _bottomStickOnMobile,
    size: _size,
    draggable: _draggable,
    ...drawerProps
  } = props;

  return <DrawerContent variant="inset" {...drawerProps} />;
};

export const ResponsiveDialogImage = (
  props: React.ComponentProps<typeof DialogImage>
) => {
  const { isDesktop } = useResponsiveDialog();

  if (isDesktop) {
    return <DialogImage {...props} />;
  }

  return <DrawerImage {...props} />;
};

export const ResponsiveDialogDescription = (props: ResponsiveDialogProps) => {
  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogDescription : DrawerDescription;

  return <Component {...props} />;
};

export const ResponsiveDialogHeader = (props: ResponsiveDialogProps) => {
  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogHeader : DrawerHeader;

  return <Component {...props} />;
};

export const ResponsiveDialogTitle = (props: ResponsiveDialogProps) => {
  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogTitle : DrawerTitle;

  return <Component {...props} />;
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
