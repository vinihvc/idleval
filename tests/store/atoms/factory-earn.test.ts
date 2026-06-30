import { beforeEach, describe, expect, it } from "vitest";
import { store } from "@/providers/store";
import { getTotalEarnPerCycle } from "@/store/atoms/factory-earn";
import { godsAtom } from "@/store/atoms/gods";
import { inventoryAtom } from "@/store/atoms/inventory";
import { missionsAtom } from "@/store/atoms/missions.atom";
import { resetGame } from "@/store/reset";
import { seedFactory } from "@/store/test-utils";

describe("factory-earn", () => {
  beforeEach(() => {
    resetGame();
  });

  it("applies renown production multiplier to cycle earn", () => {
    seedFactory("grain", { amount: 2 });

    store.set(missionsAtom, (previous) => ({
      ...previous,
      renownPercent: 10,
    }));
    const withRenown = getTotalEarnPerCycle("grain");

    store.set(missionsAtom, (previous) => ({
      ...previous,
      renownPercent: 0,
    }));
    const withoutRenown = getTotalEarnPerCycle("grain");

    expect(withRenown.div(withoutRenown).toNumber()).toBeCloseTo(1.1, 5);
  });

  it("applies invoked god multiplier to cycle earn", () => {
    seedFactory("grain", { amount: 2 });

    store.set(godsAtom, { invoked: ["huangdi"] });
    const withGod = getTotalEarnPerCycle("grain");

    store.set(godsAtom, { invoked: [] });
    const withoutGod = getTotalEarnPerCycle("grain");

    expect(withGod.gt(withoutGod)).toBe(true);
  });

  it("includes active power-up income multiplier", () => {
    seedFactory("grain", { amount: 2 });
    const baseOnly = getTotalEarnPerCycle("grain");

    store.set(inventoryAtom, (previous) => ({
      ...previous,
      activePowerUp: {
        powerUpId: "lightningShard",
        tier: "common",
        activatedAt: Date.now(),
        expiresAt: Date.now() + 60_000,
      },
    }));

    expect(getTotalEarnPerCycle("grain").gt(baseOnly)).toBe(true);
  });
});
