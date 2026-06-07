import { useVisibilityChange } from "@uidotdev/usehooks";
import React from "react";
import { touchLastSeen } from "@/store/atoms/session";

const HEARTBEAT_MS = 60_000;

export const shouldApplyOfflineOnVisibilityChange = (
  prevVisible: boolean | null,
  nextVisible: boolean
): boolean => prevVisible === false && nextVisible === true;

export const useSessionSync = (onVisible?: () => void) => {
  const isVisible = useVisibilityChange();
  const prevVisibleRef = React.useRef<boolean | null>(null);
  const onVisibleRef = React.useRef(onVisible);

  React.useEffect(() => {
    onVisibleRef.current = onVisible;
  }, [onVisible]);

  React.useEffect(() => {
    if (prevVisibleRef.current === null) {
      prevVisibleRef.current = isVisible;
      return;
    }

    if (
      shouldApplyOfflineOnVisibilityChange(prevVisibleRef.current, isVisible)
    ) {
      onVisibleRef.current?.();
    }

    prevVisibleRef.current = isVisible;
  }, [isVisible]);

  React.useEffect(() => {
    if (!isVisible) {
      touchLastSeen();
    }
  }, [isVisible]);

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      touchLastSeen();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const heartbeat = window.setInterval(() => {
      touchLastSeen();
    }, HEARTBEAT_MS);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.clearInterval(heartbeat);
    };
  }, []);
};
