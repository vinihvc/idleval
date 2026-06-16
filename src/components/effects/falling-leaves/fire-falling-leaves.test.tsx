import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const { confettiMock, shapeFromPathMock } = vi.hoisted(() => ({
  confettiMock: vi.fn(),
  shapeFromPathMock: vi.fn(() => ({ type: "path" as const, path: "leaf" })),
}));

vi.mock("canvas-confetti", () => ({
  default: Object.assign(confettiMock, {
    shapeFromPath: shapeFromPathMock,
  }),
}));

import {
  FALLING_LEAVES_BURST_COUNT,
  FALLING_LEAVES_PARTICLES_PER_BURST,
  fireFallingLeaves,
  resetFallingLeavesForTests,
} from "./fire-falling-leaves";

describe("fireFallingLeaves", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    confettiMock.mockClear();
    shapeFromPathMock.mockClear();
    resetFallingLeavesForTests();
  });

  afterEach(() => {
    resetFallingLeavesForTests();
    vi.useRealTimers();
  });

  test("fires staggered leaf bursts with reduced-motion support", () => {
    fireFallingLeaves();

    expect(confettiMock).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(confettiMock).toHaveBeenCalledTimes(FALLING_LEAVES_BURST_COUNT);

    for (const call of confettiMock.mock.calls) {
      const [options] = call;

      expect(options).toMatchObject({
        angle: 270,
        disableForReducedMotion: true,
        origin: { y: 0 },
        particleCount: FALLING_LEAVES_PARTICLES_PER_BURST,
        shapes: [{ type: "path", path: "leaf" }],
        zIndex: 40,
      });
      expect(options.origin.x).toBeGreaterThanOrEqual(0);
      expect(options.origin.x).toBeLessThanOrEqual(1);
    }
  });
});
