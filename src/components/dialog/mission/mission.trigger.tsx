import { useDialogContext } from "@ark-ui/react/dialog";
import { useDrawerContext } from "@ark-ui/react/drawer";
import { usePresenceContext } from "@ark-ui/react/presence";
import React from "react";
import { useResponsiveDialog } from "@/components/ui/responsive-dialog";

interface MissionDialogTriggerChildProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

interface MissionDialogTriggerProps {
  children: React.ReactElement;
}

const mergeTriggerProps = (
  children: React.ReactElement,
  triggerProps: ReturnType<
    ReturnType<typeof useDialogContext>["getTriggerProps"]
  >,
  presence: ReturnType<typeof usePresenceContext>
) => {
  const childProps = children.props as MissionDialogTriggerChildProps;
  const childOnClick = childProps.onClick;

  return React.cloneElement(
    children as React.ReactElement<MissionDialogTriggerChildProps>,
    {
      ...childProps,
      ...triggerProps,
      "aria-controls": presence.unmounted
        ? undefined
        : triggerProps["aria-controls"],
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        triggerProps.onClick?.(event);
        childOnClick?.(event);
      },
    }
  );
};

const MissionDialogDesktopTrigger = (props: MissionDialogTriggerProps) => {
  const { children } = props;
  const dialog = useDialogContext();
  const presence = usePresenceContext();

  return mergeTriggerProps(children, dialog.getTriggerProps(), presence);
};

const MissionDialogDrawerTrigger = (props: MissionDialogTriggerProps) => {
  const { children } = props;
  const drawer = useDrawerContext();
  const presence = usePresenceContext();

  return mergeTriggerProps(children, drawer.getTriggerProps(), presence);
};

export const MissionDialogTrigger = (props: MissionDialogTriggerProps) => {
  const { isDesktop } = useResponsiveDialog();

  if (isDesktop) {
    return <MissionDialogDesktopTrigger {...props} />;
  }

  return <MissionDialogDrawerTrigger {...props} />;
};
