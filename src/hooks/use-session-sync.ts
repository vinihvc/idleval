import { useVisibilityChange } from "@uidotdev/usehooks";
import React from "react";
import { touchLastSeen } from "@/store/atoms/session";

const HEARTBEAT_MS = 60_000;

export const useSessionSync = () => {
  const isVisible = useVisibilityChange();

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
