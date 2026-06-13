"use client";

import type React from "react";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";

type Direction = "left" | "right" | "up" | "down";
type SpriteState = "idle" | "left" | "right" | "waving";

export type CharacterInstruction =
  | {
      type: "move";
      direction: Direction;
      distance: number;
      speed?: number;
    }
  | {
      type: "moveTo";
      x: number;
      y: number;
      duration?: number;
      speed?: number;
    }
  | {
      type: "wait";
      duration: number;
    }
  | {
      type: "wave";
      duration?: number;
    };

export interface CharactersPetHandle {
  clear: () => void;
  enqueue: (
    instructions: CharacterInstruction | CharacterInstruction[]
  ) => void;
  getPosition: () => { x: number; y: number };
  moveBy: (direction: Direction, distance?: number) => void;
  moveTo: (x: number, y: number) => void;
  wave: () => void;
}

interface SpriteDefinition {
  fps: number;
  frames: number;
  src: string;
}

interface ActiveInstruction {
  elapsed: number;
  instruction: CharacterInstruction;
  remainingDistance?: number;
  startX?: number;
  startY?: number;
}

interface VisualState {
  frame: number;
  state: SpriteState;
}

interface CharactersPetProps {
  "aria-label"?: string;
  className?: string;
  defaultPosition?: {
    x: number;
    y: number;
  };
  imagePath?: string;
  instructions?: CharacterInstruction[];
  ref?: React.Ref<CharactersPetHandle>;
  repeatInstructions?: boolean;
  size?: number;
  speed?: number;
  spriteClassName?: string;
  sprites?: Partial<Record<SpriteState, SpriteDefinition>>;
}

const DEFAULT_SIZE = 192;
const DEFAULT_SPEED = 220;
const DEFAULT_WAVE_DURATION = 700;
const DEFAULT_IMAGE_PATH = "/images/pets/characters-32";

const getSprites = (
  imagePath: string
): Record<SpriteState, SpriteDefinition> => {
  const basePath = imagePath.endsWith("/") ? imagePath.slice(0, -1) : imagePath;

  return {
    idle: {
      fps: 5,
      frames: 6,
      src: `${basePath}/idle.png`,
    },
    left: {
      fps: 11,
      frames: 8,
      src: `${basePath}/running-left.png`,
    },
    right: {
      fps: 11,
      frames: 8,
      src: `${basePath}/running-right.png`,
    },
    waving: {
      fps: 6,
      frames: 4,
      src: `${basePath}/waving.png`,
    },
  };
};

const directionVectors: Record<Direction, { x: number; y: number }> = {
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
};

const getMovementState = (x: number, previous: SpriteState): SpriteState => {
  if (x < 0) {
    return "left";
  }

  if (x > 0) {
    return "right";
  }

  return previous === "left" ? "left" : "right";
};

export const CharactersPet = (props: CharactersPetProps) => {
  const {
    "aria-label": ariaLabel = "Royal Manager pet",
    className,
    defaultPosition = { x: 80, y: 120 },
    imagePath = DEFAULT_IMAGE_PATH,
    instructions = [],
    repeatInstructions = false,
    ref,
    size = DEFAULT_SIZE,
    speed = DEFAULT_SPEED,
    spriteClassName,
    sprites: customSprites,
  } = props;

  const sprites = useMemo(
    () => ({ ...getSprites(imagePath), ...customSprites }),
    [customSprites, imagePath]
  );
  const hostRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef<CharacterInstruction[]>([...instructions]);
  const activeInstructionRef = useRef<ActiveInstruction | null>(null);
  const positionRef = useRef({ ...defaultPosition });
  const visualRef = useRef<VisualState>({ frame: 0, state: "idle" });
  const frameElapsedRef = useRef(0);
  const lastFacingRef = useRef<SpriteState>("right");
  const lastTimeRef = useRef(0);
  const [visual, setVisual] = useState<VisualState>(visualRef.current);

  const clampPosition = useCallback(
    (position: { x: number; y: number }) => {
      const host = hostRef.current;

      if (!host) {
        return position;
      }

      return {
        x: Math.min(
          Math.max(position.x, 0),
          Math.max(host.clientWidth - size, 0)
        ),
        y: Math.min(
          Math.max(position.y, 0),
          Math.max(host.clientHeight - size, 0)
        ),
      };
    },
    [size]
  );

  const setPosition = useCallback(
    (nextPosition: { x: number; y: number }) => {
      const clamped = clampPosition(nextPosition);
      positionRef.current = clamped;

      if (spriteRef.current) {
        spriteRef.current.style.transform = `translate3d(${clamped.x}px, ${clamped.y}px, 0)`;
      }
    },
    [clampPosition]
  );

  const setSpriteState = useCallback((nextState: SpriteState) => {
    if (visualRef.current.state === nextState) {
      return;
    }

    visualRef.current = { frame: 0, state: nextState };
    frameElapsedRef.current = 0;
    setVisual(visualRef.current);
  }, []);

  const enqueue = useCallback(
    (nextInstructions: CharacterInstruction | CharacterInstruction[]) => {
      queueRef.current.push(
        ...(Array.isArray(nextInstructions)
          ? nextInstructions
          : [nextInstructions])
      );
    },
    []
  );

  const clear = useCallback(() => {
    queueRef.current = [];
    activeInstructionRef.current = null;
    setSpriteState("idle");
  }, [setSpriteState]);

  useImperativeHandle(
    ref,
    () => ({
      clear,
      enqueue,
      getPosition: () => ({ ...positionRef.current }),
      moveBy: (direction, distance = 180) => {
        enqueue({ direction, distance, type: "move" });
      },
      moveTo: (x, y) => {
        enqueue({ type: "moveTo", x, y });
      },
      wave: () => {
        enqueue({ type: "wave" });
      },
    }),
    [clear, enqueue]
  );

  useEffect(() => {
    queueRef.current = [...instructions];
    activeInstructionRef.current = null;
  }, [instructions]);

  useEffect(() => {
    setPosition(defaultPosition);
  }, [defaultPosition, setPosition]);

  useEffect(() => {
    let animationFrame = 0;

    const completeInstruction = () => {
      activeInstructionRef.current = null;
    };

    const getActiveInstruction = () => {
      if (
        repeatInstructions &&
        !activeInstructionRef.current &&
        queueRef.current.length === 0 &&
        instructions.length > 0
      ) {
        queueRef.current = [...instructions];
      }

      if (!activeInstructionRef.current && queueRef.current.length > 0) {
        const instruction = queueRef.current.shift();

        if (instruction) {
          activeInstructionRef.current = {
            elapsed: 0,
            instruction,
            remainingDistance:
              instruction.type === "move" ? instruction.distance : undefined,
            startX: positionRef.current.x,
            startY: positionRef.current.y,
          };
        }
      }

      return activeInstructionRef.current;
    };

    const applyMoveInstruction = (
      activeInstruction: ActiveInstruction,
      deltaSeconds: number
    ) => {
      const instruction = activeInstruction.instruction;

      if (instruction.type !== "move") {
        return;
      }

      const vector = directionVectors[instruction.direction];
      const currentSpeed = instruction.speed ?? speed;
      const nextDistance = Math.min(
        activeInstruction.remainingDistance ?? 0,
        currentSpeed * deltaSeconds
      );
      const nextState = getMovementState(vector.x, lastFacingRef.current);
      lastFacingRef.current = nextState;
      setSpriteState(nextState);
      setPosition({
        x: positionRef.current.x + vector.x * nextDistance,
        y: positionRef.current.y + vector.y * nextDistance,
      });
      activeInstruction.remainingDistance =
        (activeInstruction.remainingDistance ?? 0) - nextDistance;

      if ((activeInstruction.remainingDistance ?? 0) <= 0) {
        completeInstruction();
      }
    };

    const applyMoveToInstruction = (activeInstruction: ActiveInstruction) => {
      const instruction = activeInstruction.instruction;

      if (instruction.type !== "moveTo") {
        return;
      }

      const startX = activeInstruction.startX ?? positionRef.current.x;
      const startY = activeInstruction.startY ?? positionRef.current.y;
      const deltaX = instruction.x - startX;
      const deltaY = instruction.y - startY;
      const totalDistance = Math.hypot(deltaX, deltaY);
      const currentSpeed = instruction.speed ?? speed;
      const duration =
        instruction.duration ?? (totalDistance / currentSpeed) * 1000;
      const progress = Math.min(activeInstruction.elapsed / duration, 1);
      const nextState = getMovementState(deltaX, lastFacingRef.current);
      lastFacingRef.current = nextState;
      setSpriteState(nextState);
      setPosition({
        x: startX + deltaX * progress,
        y: startY + deltaY * progress,
      });

      if (progress >= 1) {
        completeInstruction();
      }
    };

    const applyWaitInstruction = (activeInstruction: ActiveInstruction) => {
      const instruction = activeInstruction.instruction;

      if (instruction.type !== "wait") {
        return;
      }

      setSpriteState("idle");

      if (activeInstruction.elapsed >= instruction.duration) {
        completeInstruction();
      }
    };

    const applyWaveInstruction = (activeInstruction: ActiveInstruction) => {
      const instruction = activeInstruction.instruction;

      if (instruction.type !== "wave") {
        return;
      }

      setSpriteState("waving");

      if (
        activeInstruction.elapsed >=
        (instruction.duration ?? DEFAULT_WAVE_DURATION)
      ) {
        completeInstruction();
      }
    };

    const applyInstruction = (deltaSeconds: number) => {
      const activeInstruction = getActiveInstruction();

      if (!activeInstruction) {
        setSpriteState("idle");
        return;
      }

      activeInstruction.elapsed += deltaSeconds * 1000;

      switch (activeInstruction.instruction.type) {
        case "move":
          applyMoveInstruction(activeInstruction, deltaSeconds);
          break;
        case "moveTo":
          applyMoveToInstruction(activeInstruction);
          break;
        case "wait":
          applyWaitInstruction(activeInstruction);
          break;
        case "wave":
          applyWaveInstruction(activeInstruction);
          break;
        default:
          completeInstruction();
      }
    };

    const tick = (time: number) => {
      const previousTime = lastTimeRef.current || time;
      const deltaSeconds = Math.min((time - previousTime) / 1000, 0.05);
      lastTimeRef.current = time;

      applyInstruction(deltaSeconds);

      const sprite = sprites[visualRef.current.state];
      frameElapsedRef.current += deltaSeconds;

      if (frameElapsedRef.current >= 1 / sprite.fps) {
        frameElapsedRef.current = 0;
        visualRef.current = {
          frame: (visualRef.current.frame + 1) % sprite.frames,
          state: visualRef.current.state,
        };
        setVisual(visualRef.current);
      }

      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [
    instructions,
    repeatInstructions,
    setPosition,
    setSpriteState,
    speed,
    sprites,
  ]);

  const activeSprite = sprites[visual.state];
  const backgroundSize = `${activeSprite.frames * size}px ${size}px`;
  const backgroundPosition = `-${visual.frame * size}px 0px`;

  return (
    <div
      className={cn(
        "relative isolate min-h-[520px] overflow-hidden rounded-xl border bg-muted",
        className
      )}
      ref={hostRef}
    >
      <div
        aria-label={ariaLabel}
        className={cn(
          "pixel-crisp absolute inset-s-0 top-0 select-none bg-no-repeat",
          spriteClassName
        )}
        data-frame={visual.frame}
        data-state={visual.state}
        ref={spriteRef}
        role="img"
        style={{
          backgroundImage: `url(${activeSprite.src})`,
          backgroundPosition,
          backgroundSize,
          height: size,
          width: size,
        }}
      />
    </div>
  );
};
