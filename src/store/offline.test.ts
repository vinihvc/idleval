import { beforeEach, describe, expect, it } from "vitest";
import { store } from "@/providers/store";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import {
  getLastSeenAt,
  offlineCycleProgressAtom,
  sessionAtom,
} from "@/store/atoms/session";
import { getGold } from "@/store/atoms/wallet";
import { applyOfflineEarnings, offlineSummaryAtom } from "@/store/offline";
import { resetGame } from "@/store/reset";
import { seedFactory } from "@/store/test-utils";

describe("applyOfflineEarnings", () => {
  beforeEach(() => {
    resetGame();
  });

  it("returns null and only touches session when away for less than 60 seconds", () => {
    const now = 100_000;
    store.set(sessionAtom, { lastSeenAt: now - 30_000 });
    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 2,
    });

    const result = applyOfflineEarnings(now);

    expect(result).toBeNull();
    expect(getLastSeenAt()).toBe(now);
    expect(getGold().toNumber()).toBe(0);
  });

  it("applies gold, clears manual producing, and stores offline progress", () => {
    const now = 120_000;

    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      isProducing: false,
      amount: 1,
    });
    store.set(factoriesAtom, (previous) => ({
      ...previous,
      mill: {
        ...previous.mill,
        isProducing: true,
      },
    }));
    store.set(sessionAtom, { lastSeenAt: 0 });

    const summary = applyOfflineEarnings(now);

    expect(summary).not.toBeNull();
    expect(summary?.totalGold.gt(0)).toBe(true);
    expect(getGold().gt(0)).toBe(true);
    expect(store.get(factoriesAtom).mill.isProducing).toBe(false);
    expect(store.get(offlineCycleProgressAtom).grain).toBeDefined();
    expect(getLastSeenAt()).toBe(now);
  });

  it("returns null when total offline gold is zero", () => {
    const now = 120_000;
    store.set(sessionAtom, { lastSeenAt: 0 });

    const summary = applyOfflineEarnings(now);

    expect(summary).toBeNull();
    expect(store.get(offlineSummaryAtom)).toBeNull();
  });

  it("filters zero-cycle results from summary", () => {
    const now = 120_000;

    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    });
    store.set(sessionAtom, { lastSeenAt: 0 });

    const summary = applyOfflineEarnings(now);

    expect(summary?.results.every((result) => result.cycles > 0)).toBe(true);
  });
});
