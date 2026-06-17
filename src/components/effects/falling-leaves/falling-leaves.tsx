import { useAtomValue } from "jotai";
import React from "react";
import { getGodConfettiColor } from "@/content/gods";
import { store } from "@/providers/store";
import {
  type FallingLeavesTrigger,
  fallingLeavesTriggerAtom,
} from "@/store/atoms/gods";
import {
  FALLING_LEAVES_Z_INDEX,
  fireFallingLeaves,
  setFallingLeavesConfettiLauncher,
} from "./fire-falling-leaves";

let lastProcessedFallingLeavesSeq = 0;

export const resetFallingLeavesTriggerForTests = (): void => {
  lastProcessedFallingLeavesSeq = 0;
  store.set(fallingLeavesTriggerAtom, {
    seq: 0,
    godId: "huangdi",
  } satisfies FallingLeavesTrigger);
};

export const FallingLeaves = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const trigger = useAtomValue(fallingLeavesTriggerAtom);
  const launcherRef = React.useRef<{ reset: () => void } | null>(null);

  React.useEffect(
    () => () => {
      launcherRef.current?.reset();
      launcherRef.current = null;
      setFallingLeavesConfettiLauncher(null);
    },
    []
  );

  React.useEffect(() => {
    if (trigger.seq <= lastProcessedFallingLeavesSeq) {
      return;
    }

    lastProcessedFallingLeavesSeq = trigger.seq;

    const launchFallingLeaves = async (): Promise<void> => {
      if (!launcherRef.current) {
        const confettiModule = await import("canvas-confetti");
        const canvas = canvasRef.current;

        if (!canvas) {
          return;
        }

        const launcher = confettiModule.default.create(canvas, {
          disableForReducedMotion: true,
          resize: true,
        });
        launcherRef.current = launcher;
        setFallingLeavesConfettiLauncher(launcher);
      }

      fireFallingLeaves(getGodConfettiColor(trigger.godId));
    };

    launchFallingLeaves().catch(() => undefined);
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
