import { useEffect } from "react";
import {
  syncNotificationDismissals,
  useNotificationActiveMap,
} from "@/store/atoms/notifications";

export const useNotificationSync = () => {
  const activeByKey = useNotificationActiveMap();

  useEffect(() => {
    syncNotificationDismissals(activeByKey);
  }, [activeByKey]);
};
