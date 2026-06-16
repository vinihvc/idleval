import { assert, beforeEach, describe, expect, it, vi } from "vitest";
import { getMissionById } from "@/content/missions";
import { store } from "@/providers/store";
import {
  claimMissionReward,
  incrementMissionCounter,
  incrementRunGoldEarned,
  incrementRunGoldSpent,
  syncMissionProgress,
} from "@/store/atoms/missions.actions";
import { missionsAtom } from "@/store/atoms/missions.atom";
import { statisticsAtom } from "@/store/atoms/statistics";
import { resetGame } from "@/store/reset";
import { resetRunProgress } from "@/store/reset-run-progress";
import { D } from "@/utils/decimal";

vi.mock("@/providers/sound", () => ({
  sound: { play: vi.fn() },
}));

describe("missions actions", () => {
  beforeEach(() => {
    resetGame();
  });

  it("increments mission counters", () => {
    incrementMissionCounter("productionCyclesCompleted", 3);

    expect(store.get(missionsAtom).counters.productionCyclesCompleted).toBe(3);
  });

  it("marks mission ready when objective is met", () => {
    store.set(statisticsAtom, (previous) => ({
      ...previous,
      factories: {
        ...previous.factories,
        grain: {
          ...previous.factories.grain,
          quantity: 1,
        },
      },
    }));

    syncMissionProgress();

    expect(store.get(missionsAtom).readyToClaimIds).toContain("mission-001");
  });

  it("claims mission rewards and moves id to claimed", () => {
    store.set(missionsAtom, (previous) => ({
      ...previous,
      readyToClaimIds: ["mission-001"],
    }));

    const mission = getMissionById("mission-001");
    assert(mission);
    const claimed = claimMissionReward(mission.id);

    expect(claimed).toBe(true);
    expect(store.get(missionsAtom).claimedIds).toContain("mission-001");
    expect(store.get(missionsAtom).readyToClaimIds).not.toContain(
      "mission-001"
    );
  });

  it("tracks run gold counters and resets them on prestige", () => {
    incrementRunGoldEarned(D(100));
    incrementRunGoldSpent(D(40));

    expect(store.get(missionsAtom).counters.runGoldEarned).toBe("100");
    expect(store.get(missionsAtom).counters.runGoldSpent).toBe("40");

    resetRunProgress();

    expect(store.get(missionsAtom).counters.runGoldEarned).toBe("0");
    expect(store.get(missionsAtom).counters.runGoldSpent).toBe("0");
  });
});
