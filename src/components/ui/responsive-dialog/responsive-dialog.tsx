import { useMediaQuery } from "@uidotdev/usehooks";
import { InfoBox } from "pixelarticons/react/InfoBox";
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
import { cn } from "@/lib/cn";
import { Button } from "../button";
import {
  ToggleTooltip,
  ToggleTooltipContent,
  ToggleTooltipTrigger,
} from "../toggle-tooltip";

interface RootResponsiveDialogProps extends React.PropsWithChildren {
  lazyMount?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /**
   * The role of the dialog
   *
   * @default "dialog"
   */
  role?: "dialog" | "alertdialog";
  unmountOnExit?: boolean;
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
  const { role = "dialog", onOpenChange, ...rest } = props;

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
        closeOnInteractOutside={role === "dialog"}
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

export const ResponsiveDialogContent = (
  props: React.ComponentProps<typeof DialogContent>
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

  return (
    <Component
      className={cn(
        "has-data-[slot=drawer-tooltip]:flex-row has-data-[slot=drawer-tooltip]:items-center has-data-[slot=drawer-tooltip]:gap-2 has-data-[slot=drawer-tooltip]:max-sm:justify-center",
        className
      )}
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
   *
   * @default false
   */
  hideDescription?: boolean;
}

export const ResponsiveDialogDescription = (
  props: ResponsiveDialogDescriptionProps
) => {
  const { hideDescription = true, ...rest } = props;

  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogDescription : DrawerDescription;

  if (hideDescription && props.children) {
    return (
      <ToggleTooltip positioning={{ placement: "top-start" }}>
        <ToggleTooltipTrigger asChild data-slot="drawer-tooltip">
          <Button
            className="size-5 rounded-md border"
            size="icon-xs"
            sound={false}
            variant="blue"
          >
            <InfoBox />
          </Button>
        </ToggleTooltipTrigger>
        <ToggleTooltipContent>
          <Component {...rest}>{rest.children}</Component>
        </ToggleTooltipContent>
      </ToggleTooltip>
    );
  }

  return <Component {...rest} />;
};

export const ResponsiveDialogBody = (
  props: React.ComponentProps<typeof DialogBody>
) => {
  const { isDesktop } = useResponsiveDialog();

  if (isDesktop) {
    return <DialogBody {...props} />;
  }

  return <DrawerBody {...props} />;
};

export const ResponsiveDialogFooter = (props: ResponsiveDialogProps) => {
  const { isDesktop } = useResponsiveDialog();

  const Component = isDesktop ? DialogFooter : DrawerFooter;

  return <Component {...props} />;
};
