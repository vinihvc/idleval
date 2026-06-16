import confetti from "canvas-confetti";

export const FALLING_LEAVES_BURST_COUNT = 6;
export const FALLING_LEAVES_PARTICLES_PER_BURST = 4;
export const FALLING_LEAVES_DURATION_MS = 3500;
export const FALLING_LEAVES_SPAWN_WINDOW_MS = 1200;
export const FALLING_LEAVES_Z_INDEX = 40;

const LEAF_PATH = "M8 1C4 5 2 9 2 13c0 3 2.5 5 6 5s6-2 6-5c0-4-2-8-6-12Z";

const LEAF_COLORS = ["#6b7c3e", "#4a8a7a", "#7a7a82"] as const;

const leafShape = confetti.shapeFromPath({
  path: LEAF_PATH,
  matrix: new DOMMatrix([0.6, 0, 0, 0.6, -4.8, -5.4]),
});

const pendingBurstTimeouts = new Set<number>();

const randomInRange = (min: number, max: number): number =>
  min + Math.random() * (max - min);

const fireLeafBurst = (): void => {
  confetti({
    angle: 270,
    colors: [...LEAF_COLORS],
    disableForReducedMotion: true,
    drift: randomInRange(-0.3, 0.3),
    gravity: randomInRange(0.6, 0.9),
    origin: {
      x: Math.random(),
      y: 0,
    },
    particleCount: FALLING_LEAVES_PARTICLES_PER_BURST,
    scalar: randomInRange(1, 1.4),
    shapes: [leafShape],
    spread: randomInRange(60, 90),
    startVelocity: randomInRange(12, 18),
    ticks: 180,
    zIndex: FALLING_LEAVES_Z_INDEX,
  });
};

export const fireFallingLeaves = (): void => {
  for (
    let burstIndex = 0;
    burstIndex < FALLING_LEAVES_BURST_COUNT;
    burstIndex++
  ) {
    const delayMs =
      (burstIndex / (FALLING_LEAVES_BURST_COUNT - 1)) *
      FALLING_LEAVES_SPAWN_WINDOW_MS;

    const timeoutId = window.setTimeout(() => {
      pendingBurstTimeouts.delete(timeoutId);
      fireLeafBurst();
    }, delayMs);

    pendingBurstTimeouts.add(timeoutId);
  }
};

export const resetFallingLeavesForTests = (): void => {
  for (const timeoutId of pendingBurstTimeouts) {
    window.clearTimeout(timeoutId);
  }

  pendingBurstTimeouts.clear();
};
