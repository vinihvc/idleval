import { describe, expect, it } from "vitest";
import type { FactoryPersistedState } from "@/game/types";
import {
  isWikiFigureUnlocked,
  isWikiGodUnlocked,
  isWikiUpgradeUnlocked,
} from "@/game/wiki";

const baseFactoryState: FactoryPersistedState = {
  amount: 0,
  isAutomated: false,
  isProducing: false,
  isUnlocked: true,
  isUpgraded: false,
};

describe("wiki unlock rules", () => {
  it("unlocks gods only after invocation", () => {
    expect(isWikiGodUnlocked(0, [])).toBe(false);
    expect(isWikiGodUnlocked(0, ["huangdi"])).toBe(true);
    expect(isWikiGodUnlocked(1, ["huangdi"])).toBe(false);
  });

  it("unlocks figures only after appointing a manager", () => {
    expect(isWikiFigureUnlocked(baseFactoryState)).toBe(false);
    expect(
      isWikiFigureUnlocked({ ...baseFactoryState, isAutomated: true })
    ).toBe(true);
  });

  it("unlocks upgrades only after purchasing them", () => {
    expect(isWikiUpgradeUnlocked(baseFactoryState)).toBe(false);
    expect(
      isWikiUpgradeUnlocked({ ...baseFactoryState, isUpgraded: true })
    ).toBe(true);
  });
});
