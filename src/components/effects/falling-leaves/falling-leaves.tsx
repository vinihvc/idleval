import { useAtomValue } from "jotai";
import React from "react";
import { fallingLeavesTriggerAtom } from "@/store/atoms/gods";
import { fireFallingLeaves } from "./fire-falling-leaves";

let lastProcessedFallingLeavesTrigger = 0;

export const resetFallingLeavesTriggerForTests = (): void => {
  lastProcessedFallingLeavesTrigger = 0;
};

export const FallingLeaves = () => {
  const trigger = useAtomValue(fallingLeavesTriggerAtom);

  React.useEffect(() => {
    if (trigger <= lastProcessedFallingLeavesTrigger) {
      return;
    }

    lastProcessedFallingLeavesTrigger = trigger;
    fireFallingLeaves();
  }, [trigger]);

  return null;
};
