import { assert, beforeEach, describe, expect, it, vi } from "vitest";
import { GAME_BALANCE } from "@/config/balance";
import { getMissionById } from "@/content/missions";
import { store } from "@/providers/store";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { godsAtom } from "@/store/atoms/gods";
import {
  claimMissionReward,
  incrementMissionCounter,
  incrementRunGoldEarned,
  incrementRunGoldSpent,
  syncMissionProgress,
} from "@/store/atoms/missions.actions";
import { missionsAtom } from "@/store/atoms/missions.atom";
import { statisticsAtom } from "@/store/atoms/statistics";
import { walletAtom } from "@/store/atoms/wallet";
import { resetGame } from "@/store/reset";
import { D, deserializeDecimal } from "@/utils/decimal";

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

  it("tracks run gold counters", () => {
    incrementRunGoldEarned(D(100));
    incrementRunGoldSpent(D(40));

    expect(store.get(missionsAtom).counters.runGoldEarned).toBe("100");
    expect(store.get(missionsAtom).counters.runGoldSpent).toBe("40");
  });

  it("applies god-cycle multiplier when claiming gold rewards", () => {
    store.set(godsAtom, { invoked: ["huangdi"] });
    store.set(missionsAtom, (previous) => ({
      ...previous,
      readyToClaimIds: ["mission-001"],
    }));

    const mission = getMissionById("mission-001");
    assert(mission);
    const goldReward = mission.rewards.find((reward) => reward.type === "gold");
    assert(goldReward?.type === "gold");

    const beforeGold = deserializeDecimal(store.get(walletAtom).gold);
    const claimed = claimMissionReward(mission.id);

    expect(claimed).toBe(true);
    expect(
      deserializeDecimal(store.get(walletAtom).gold)
        .minus(beforeGold)
        .eq(D(goldReward.amount).times(GAME_BALANCE.missionGoldReward).times(2))
    ).toBe(true);
  });

  it("syncs and marks holdGold ready when claiming after wallet meets target", () => {
    const mission = getMissionById("mission-103");
    assert(mission);

    store.set(walletAtom, {
      gold: D("62100000000").toString(),
    });
    store.set(factoriesAtom, (previous) => ({
      ...previous,
      reliquary: {
        ...previous.reliquary,
        amount: 1,
        isUnlocked: true,
      },
    }));
    store.set(missionsAtom, (previous) => ({
      ...previous,
      activeSlotIds: ["mission-103"],
      progressBaselines: {
        "mission-103": {
          goldEarned: "0",
          goldSpent: "0",
          productionCyclesCompleted: 0,
          powerUpsActivated: 0,
          dailyRewardsClaimed: 0,
        },
      },
    }));

    const claimed = claimMissionReward(mission.id);

    expect(claimed).toBe(true);
    expect(store.get(missionsAtom).claimedIds).toContain("mission-103");
  });
});
