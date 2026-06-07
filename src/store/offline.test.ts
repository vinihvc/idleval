import { describe, expect, it } from "vitest";
import {
  MIN_OFFLINE_MS,
  meetsMinimumOfflineDuration,
} from "@/game/offline-earnings";

describe("offline", () => {
  it("requires at least one minute away before applying offline earnings", () => {
    expect(MIN_OFFLINE_MS).toBe(60_000);
    expect(meetsMinimumOfflineDuration(59_999)).toBe(false);
    expect(meetsMinimumOfflineDuration(60_000)).toBe(true);
    expect(meetsMinimumOfflineDuration(120_000)).toBe(true);
  });
});
