import { useDialogContext } from "@ark-ui/react/dialog";
import { useDrawerContext } from "@ark-ui/react/drawer";
import { usePresenceContext } from "@ark-ui/react/presence";
import React from "react";
import { useResponsiveDialog } from "@/components/ui/responsive-dialog";

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
  const childOnClick = children.props.onClick as
    | React.MouseEventHandler<HTMLElement>
    | undefined;

  return React.cloneElement(children, {
    ...children.props,
    ...triggerProps,
    "aria-controls": presence.unmounted
      ? undefined
      : triggerProps["aria-controls"],
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      triggerProps.onClick?.(event);
      childOnClick?.(event);
    },
  });
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
