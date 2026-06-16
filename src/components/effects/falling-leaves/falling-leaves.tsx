import confetti from "canvas-confetti";
import { useAtomValue } from "jotai";
import React from "react";
import { getGodConfettiColor } from "@/content/gods";
import { fallingLeavesTriggerAtom } from "@/store/atoms/gods";
import {
  FALLING_LEAVES_Z_INDEX,
  fireFallingLeaves,
  setFallingLeavesConfettiLauncher,
} from "./fire-falling-leaves";

let lastProcessedFallingLeavesSeq = 0;

export const resetFallingLeavesTriggerForTests = (): void => {
  lastProcessedFallingLeavesSeq = 0;
};

export const FallingLeaves = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const trigger = useAtomValue(fallingLeavesTriggerAtom);

  React.useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const launcher = confetti.create(canvas, {
      disableForReducedMotion: true,
      resize: true,
    });

    setFallingLeavesConfettiLauncher(launcher);

    return () => {
      launcher.reset();
      setFallingLeavesConfettiLauncher(null);
    };
  }, []);

  React.useEffect(() => {
    if (trigger.seq <= lastProcessedFallingLeavesSeq) {
      return;
    }

    lastProcessedFallingLeavesSeq = trigger.seq;
    fireFallingLeaves(getGodConfettiColor(trigger.godId));
  }, [trigger]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: FALLING_LEAVES_Z_INDEX }}
    >
      <canvas className="pointer-events-none size-full" ref={canvasRef} />
    </div>
  );
};
