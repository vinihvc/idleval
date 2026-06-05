import React from "react";
import { touchLastSeen } from "@/store/atoms/session";

const HEARTBEAT_MS = 60_000;

export const useSessionSync = () => {
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        touchLastSeen();
      }
    };

    const handleBeforeUnload = () => {
      touchLastSeen();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    const heartbeat = window.setInterval(() => {
      touchLastSeen();
    }, HEARTBEAT_MS);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.clearInterval(heartbeat);
    };
  }, []);
};
