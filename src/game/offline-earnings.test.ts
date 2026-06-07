import { describe, expect, it } from "vitest";
import { FACTORIES } from "@/content/factories";
import {
  computeOfflineEarnings,
  MIN_OFFLINE_MS,
  meetsMinimumOfflineDuration,
} from "@/game/offline-earnings";
import { initialData } from "@/store/atoms/factories.atom";
import { D } from "@/utils/decimal";

describe("offline-earnings", () => {
  it("meetsMinimumOfflineDuration at the 60s threshold", () => {
    expect(meetsMinimumOfflineDuration(MIN_OFFLINE_MS - 1)).toBe(false);
    expect(meetsMinimumOfflineDuration(MIN_OFFLINE_MS)).toBe(true);
  });

  it("returns empty results when lastSeenAt is null", () => {
    const result = computeOfflineEarnings(Date.now(), null, initialData, D(1));

    expect(result.elapsedMs).toBe(0);
    expect(result.totalGold.toNumber()).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it("returns empty results when lastSeenAt is in the future", () => {
    const now = 1_000_000;
    const result = computeOfflineEarnings(now, now + 1000, initialData, D(1));

    expect(result.totalGold.toNumber()).toBe(0);
  });

  it("awards automated factories for elapsed offline time", () => {
    const factories = structuredClone(initialData);
    factories.grain = {
      ...factories.grain,
      isAutomated: true,
      isUnlocked: true,
      amount: 2,
    };

    const productionTime = FACTORIES.grain.productionTime;
    const cycles = 3;
    const elapsedMs = productionTime * cycles * 1000;
    const lastSeenAt = 0;
    const now = elapsedMs;

    const result = computeOfflineEarnings(now, lastSeenAt, factories, D(1));
    const grain = result.results.find((entry) => entry.factory === "grain");

    expect(grain?.cycles).toBe(cycles);
    expect(result.totalGold.gt(0)).toBe(true);
  });
});
