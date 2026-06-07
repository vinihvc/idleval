import { useMediaQuery } from "@uidotdev/usehooks";
import { InfoBox } from "pixelarticons/react";
import React from "react";
import { Button } from "@/components/ui/button";
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
  ToggleTooltip,
  ToggleTooltipContent,
  ToggleTooltipTrigger,
} from "@/components/ui/toggle-tooltip";
import { cn } from "@/lib/cn";

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
      <Component
        modal={false}
        onOpenChange={handleOpenChange}
        role={role}
        {...rest}
      />
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

  if (isDesktop) {
    return <DialogHeader className={className} {...rest} />;
  }

  return (
    <DrawerHeader
      className={cn("flex-row items-center justify-center gap-2", className)}
      {...rest}
    />
  );
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

  if (isDesktop) {
    return <DialogDescription {...rest} />;
  }

  if (hideDescription) {
    return (
      <ToggleTooltip>
        <ToggleTooltipTrigger asChild>
          <Button data-slot="drawer-tooltip" size="icon-xs" variant="blue">
            <DrawerDescription aria-label="More information">
              <InfoBox />
            </DrawerDescription>
          </Button>
        </ToggleTooltipTrigger>
        <ToggleTooltipContent>{rest.children}</ToggleTooltipContent>
      </ToggleTooltip>
    );
  }

  return <DrawerDescription {...rest} />;
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
