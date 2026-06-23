import { beforeEach, describe, expect, test } from "vitest";
import { FactoryCard } from "@/components/game/factory-card";
import { getCycleProgress, startCycleTick } from "@/game/factory-cycle";
import { store } from "@/providers/store";
import { productionTicksAtom } from "@/store/atoms/production-ticks.atom";
import { resetGame } from "@/store/reset";
import { seedFactory } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

describe("FactoryCard progress", () => {
  const cycleDurationSec = 60;

  beforeEach(() => {
    resetGame();
  });

  test("shows partial progress after resuming a mid-cycle tick", async () => {
    const now = Date.now();
    const remainingSec = cycleDurationSec / 2;

    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    });

    const seededTick = startCycleTick(store.get(productionTicksAtom).grain, {
      durationSec: cycleDurationSec,
      now,
      remainingSec,
    });

    store.set(productionTicksAtom, (previous) => ({
      ...previous,
      grain: seededTick,
    }));

    const expectedValue =
      getCycleProgress(seededTick, now).progress * cycleDurationSec;

    const screen = await renderWithProviders(<FactoryCard type="grain" />);
    const progressBar = screen.getByRole("progressbar");

    await expect.element(progressBar).toBeInTheDocument();

    const valueNow = Number(
      progressBar.element().getAttribute("aria-valuenow")
    );
    const valueMax = Number(
      progressBar.element().getAttribute("aria-valuemax")
    );

    expect(valueMax).toBe(cycleDurationSec);
    expect(valueNow).toBeCloseTo(expectedValue, 0);

    const progressRange = screen.container.querySelector(
      '[data-slot="factory-card-progress-range"]'
    );

    expect(progressRange).not.toBeNull();
    expect(progressRange?.className).toContain("transition-none");
  });
});
