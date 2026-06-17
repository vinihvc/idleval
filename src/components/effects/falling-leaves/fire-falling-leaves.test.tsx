import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const { confettiMock } = vi.hoisted(() => ({
  confettiMock: vi.fn(),
}));

vi.mock("canvas-confetti", () => ({
  default: confettiMock,
}));

import {
  CONFETTI_RAIN_DURATION_MS,
  CONFETTI_RAIN_INTERVAL_MS,
  CONFETTI_RAIN_PARTICLES_MAX,
  CONFETTI_RAIN_PARTICLES_MIN,
  fireFallingLeaves,
  getConfettiRainSpawnCount,
  resetFallingLeavesForTests,
  setFallingLeavesConfettiLauncher,
} from "./fire-falling-leaves";

describe("fireFallingLeaves", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    confettiMock.mockClear();
    resetFallingLeavesForTests();
  });

  afterEach(() => {
    resetFallingLeavesForTests();
    vi.useRealTimers();
  });

  test("spawns continuous top-down rain without burst physics", async () => {
    fireFallingLeaves("#f8c808");

    await expect.poll(() => confettiMock.mock.calls.length).toBe(1);

    vi.advanceTimersByTime(CONFETTI_RAIN_DURATION_MS);

    expect(confettiMock).toHaveBeenCalledTimes(getConfettiRainSpawnCount());

    for (const call of confettiMock.mock.calls) {
      const [options] = call;

      expect(options).toMatchObject({
        angle: 270,
        colors: ["#f8c808"],
        decay: 1,
        disableForReducedMotion: true,
        flat: true,
        origin: { y: 0 },
        spread: 0,
        startVelocity: 0,
      });
      expect(options.particleCount).toBeGreaterThanOrEqual(
        CONFETTI_RAIN_PARTICLES_MIN
      );
      expect(options.particleCount).toBeLessThanOrEqual(
        CONFETTI_RAIN_PARTICLES_MAX
      );
      expect(options.ticks).toBeGreaterThanOrEqual(250);
      expect(options.ticks).toBeLessThanOrEqual(300);
      expect(options.origin.x).toBeGreaterThanOrEqual(0);
      expect(options.origin.x).toBeLessThanOrEqual(1);
    }
  });

  test("stops spawning after the rain duration", async () => {
    fireFallingLeaves("#f8c808");

    await expect.poll(() => confettiMock.mock.calls.length).toBeGreaterThan(0);

    vi.advanceTimersByTime(CONFETTI_RAIN_DURATION_MS);
    const spawnCount = confettiMock.mock.calls.length;

    vi.advanceTimersByTime(CONFETTI_RAIN_INTERVAL_MS * 5);

    expect(confettiMock.mock.calls.length).toBe(spawnCount);
  });

  test("uses the registered canvas launcher when available", () => {
    const launcher = vi.fn();
    setFallingLeavesConfettiLauncher(launcher);

    fireFallingLeaves("#d82808");

    vi.advanceTimersByTime(CONFETTI_RAIN_DURATION_MS);

    expect(launcher).toHaveBeenCalledTimes(getConfettiRainSpawnCount());
    expect(confettiMock).not.toHaveBeenCalled();
  });
});
