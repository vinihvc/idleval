import type { Options as ConfettiOptions } from "canvas-confetti";

export const CONFETTI_RAIN_INTERVAL_MS = 80;
export const CONFETTI_RAIN_DURATION_MS = 3500;
export const CONFETTI_RAIN_PARTICLES_MIN = 2;
export const CONFETTI_RAIN_PARTICLES_MAX = 4;
export const FALLING_LEAVES_Z_INDEX = 9999;

export const getConfettiRainSpawnCount = (): number =>
  Math.floor(CONFETTI_RAIN_DURATION_MS / CONFETTI_RAIN_INTERVAL_MS) + 1;

type ConfettiLauncher = (options?: ConfettiOptions) => void;

const pendingRainIntervals = new Set<number>();
const pendingRainTimeouts = new Set<number>();

let confettiLauncher: ConfettiLauncher | null = null;
let defaultLauncherPromise: Promise<ConfettiLauncher> | null = null;

export const setFallingLeavesConfettiLauncher = (
  launcher: ConfettiLauncher | null
): void => {
  confettiLauncher = launcher;
};

const loadDefaultLauncher = (): Promise<ConfettiLauncher> => {
  defaultLauncherPromise ??= import("canvas-confetti").then(
    (module) => module.default
  );
  return defaultLauncherPromise;
};

const randomInRange = (min: number, max: number): number =>
  min + Math.random() * (max - min);

const randomIntInclusive = (min: number, max: number): number =>
  Math.floor(randomInRange(min, max + 1));

const spawnRainTick = (launcher: ConfettiLauncher, color: string): void => {
  launcher({
    angle: 270,
    colors: [color],
    decay: 1,
    disableForReducedMotion: true,
    drift: randomInRange(-0.3, 0.3),
    flat: true,
    gravity: randomInRange(0.9, 1.1),
    origin: {
      x: Math.random(),
      y: 0,
    },
    particleCount: randomIntInclusive(
      CONFETTI_RAIN_PARTICLES_MIN,
      CONFETTI_RAIN_PARTICLES_MAX
    ),
    scalar: randomInRange(0.9, 1.2),
    spread: 0,
    startVelocity: 0,
    ticks: randomIntInclusive(250, 300),
  });
};

const startRain = (launcher: ConfettiLauncher, color: string): void => {
  spawnRainTick(launcher, color);

  const intervalId = window.setInterval(() => {
    spawnRainTick(launcher, color);
  }, CONFETTI_RAIN_INTERVAL_MS);

  pendingRainIntervals.add(intervalId);

  const stopTimeoutId = window.setTimeout(() => {
    window.clearInterval(intervalId);
    pendingRainIntervals.delete(intervalId);
    pendingRainTimeouts.delete(stopTimeoutId);
  }, CONFETTI_RAIN_DURATION_MS);

  pendingRainTimeouts.add(stopTimeoutId);
};

export const fireFallingLeaves = (color: string): void => {
  if (confettiLauncher) {
    startRain(confettiLauncher, color);
    return;
  }

  loadDefaultLauncher().then((launcher) => {
    startRain(launcher, color);
  });
};

export const resetFallingLeavesForTests = (): void => {
  for (const intervalId of pendingRainIntervals) {
    window.clearInterval(intervalId);
  }

  for (const timeoutId of pendingRainTimeouts) {
    window.clearTimeout(timeoutId);
  }

  pendingRainIntervals.clear();
  pendingRainTimeouts.clear();
  confettiLauncher = null;
  defaultLauncherPromise = null;
};
