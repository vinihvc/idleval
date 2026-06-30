import { assert, beforeEach, describe, expect, it, vi } from "vitest";
import { GOD_DATA } from "@/content/gods";
import { getMissionById, MISSION_CATALOG } from "@/content/missions";
import {
  getScaledMissionObjective,
  summarizeMissionRewards,
} from "@/game/missions";
import { getPlayerLevel } from "@/game/player-level";
import { store } from "@/providers/store";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { godsAtom } from "@/store/atoms/gods";
import { inventoryAtom } from "@/store/atoms/inventory";
import {
  claimMissionReward,
  incrementMissionCounter,
  incrementRunGoldEarned,
  incrementRunGoldSpent,
  syncMissionProgress,
} from "@/store/atoms/missions.actions";
import { missionsAtom } from "@/store/atoms/missions.atom";
import { buildMissionGameSnapshot } from "@/store/atoms/missions.selectors";
import { statisticsAtom } from "@/store/atoms/statistics";
import { decreaseGold, walletAtom } from "@/store/atoms/wallet";
import { resetGame } from "@/store/reset";
import { seedFactory } from "@/store/test-utils";
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

  it("applies player-level gold multiplier when claiming rewards", () => {
    store.set(godsAtom, {
      invoked: GOD_DATA.map((god) => god.id),
    });
    store.set(walletAtom, { gold: D(0).toString() });

    const mission = getMissionById("mission-001");
    assert(mission);
    syncMissionProgress();
    const scaledTarget = getScaledMissionObjective(
      mission.objective,
      getPlayerLevel(buildMissionGameSnapshot())
    );
    assert(scaledTarget.type === "ownUnits");

    store.set(statisticsAtom, (previous) => ({
      ...previous,
      factories: {
        ...previous.factories,
        grain: {
          ...previous.factories.grain,
          quantity: scaledTarget.target,
        },
      },
    }));
    syncMissionProgress();
    const expectedGold = summarizeMissionRewards(
      mission.rewards,
      getPlayerLevel(buildMissionGameSnapshot())
    ).gold;

    const beforeGold = deserializeDecimal(store.get(walletAtom).gold);
    const claimed = claimMissionReward(mission.id);

    expect(claimed).toBe(true);
    expect(
      deserializeDecimal(store.get(walletAtom).gold)
        .minus(beforeGold)
        .eq(expectedGold)
    ).toBe(true);
  });

  it("syncs and marks holdGold ready when claiming after wallet meets target", () => {
    const mission = getMissionById("mission-103");
    assert(mission);

    const reliquaryFactory = {
      amount: 1,
      isAutomated: false,
      isProducing: false,
      isUnlocked: true,
      isUpgraded: false,
      productionStartedAt: null,
      productionDurationSec: null,
    };
    store.set(godsAtom, { invoked: [] });
    store.set(factoriesAtom, (previous) => ({
      ...previous,
      reliquary: {
        ...previous.reliquary,
        ...reliquaryFactory,
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
        },
      },
    }));

    let wallet = D(
      mission.objective.type === "holdGold" ? mission.objective.target : "1e9"
    );
    for (let attempt = 0; attempt < 60; attempt++) {
      store.set(walletAtom, { gold: wallet.toString() });
      syncMissionProgress();
      const snapshot = buildMissionGameSnapshot();
      const scaledObjective = getScaledMissionObjective(
        mission.objective,
        getPlayerLevel(snapshot)
      );
      assert(scaledObjective.type === "holdGold");
      const scaledTarget = D(scaledObjective.target);

      if (wallet.gte(scaledTarget)) {
        break;
      }

      wallet = wallet.times(1.25);
    }

    const claimed = claimMissionReward(mission.id);

    expect(claimed).toBe(true);
    expect(store.get(missionsAtom).claimedIds).toContain("mission-103");
  });

  it("keeps three active slots when nearly the entire catalog is claimed", () => {
    const claimedIds = MISSION_CATALOG.slice(0, 197).map(
      (mission) => mission.id
    );

    store.set(missionsAtom, (previous) => ({
      ...previous,
      activeSlotIds: ["mission-198", "mission-199", "mission-200"],
      claimedIds,
    }));
    store.set(factoriesAtom, (previous) => ({
      ...previous,
      reliquary: {
        ...previous.reliquary,
        amount: 1,
        isAutomated: false,
        isProducing: false,
        isUnlocked: true,
        isUpgraded: false,
        productionStartedAt: null,
        productionDurationSec: null,
      },
    }));

    syncMissionProgress();

    expect(store.get(missionsAtom).activeSlotIds).toHaveLength(3);
  });

  it("does not duplicate claimed ids when replaying a mission", () => {
    store.set(missionsAtom, (previous) => ({
      ...previous,
      activeSlotIds: ["mission-001"],
      claimedIds: ["mission-001"],
    }));
    store.set(statisticsAtom, (previous) => ({
      ...previous,
      factories: {
        ...previous.factories,
        grain: {
          ...previous.factories.grain,
          quantity: 0,
        },
      },
    }));

    syncMissionProgress();

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

    const claimed = claimMissionReward("mission-001");

    expect(claimed).toBe(true);
    expect(
      store.get(missionsAtom).claimedIds.filter((id) => id === "mission-001")
    ).toHaveLength(1);
  });

  it("rejects holdGold claim after spending below scaled target", () => {
    const mission = getMissionById("mission-103");
    assert(mission?.objective.type === "holdGold");

    const reliquaryFactory = {
      amount: 1,
      isAutomated: false,
      isProducing: false,
      isUnlocked: true,
      isUpgraded: false,
      productionStartedAt: null,
      productionDurationSec: null,
    };
    store.set(factoriesAtom, (previous) => ({
      ...previous,
      reliquary: {
        ...previous.reliquary,
        ...reliquaryFactory,
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
        },
      },
    }));

    assert(mission.objective.type === "holdGold");
    let wallet = D(mission.objective.target);
    for (let attempt = 0; attempt < 60; attempt++) {
      store.set(walletAtom, { gold: wallet.toString() });
      syncMissionProgress();
      const snapshot = buildMissionGameSnapshot();
      const scaledObjective = getScaledMissionObjective(
        mission.objective,
        getPlayerLevel(snapshot)
      );
      assert(scaledObjective.type === "holdGold");
      const scaledTarget = D(scaledObjective.target);

      if (wallet.gte(scaledTarget)) {
        break;
      }

      wallet = wallet.times(1.25);
    }

    syncMissionProgress();
    expect(store.get(missionsAtom).readyToClaimIds).toContain("mission-103");

    decreaseGold(deserializeDecimal(store.get(walletAtom).gold));
    syncMissionProgress();

    expect(store.get(missionsAtom).readyToClaimIds).not.toContain(
      "mission-103"
    );
    expect(claimMissionReward("mission-103")).toBe(false);
  });

  it("applies renown reward to missions state on claim", () => {
    store.set(missionsAtom, (previous) => ({
      ...previous,
      activeSlotIds: ["mission-008"],
      progressBaselines: {
        "mission-008": {
          goldEarned: "0",
          goldSpent: "0",
          productionCyclesCompleted: 0,
          powerUpsActivated: 0,
        },
      },
    }));
    store.set(statisticsAtom, (previous) => ({
      ...previous,
      goldEarned: "10000",
    }));
    syncMissionProgress();

    const renownBefore = store.get(missionsAtom).renownPercent;
    const claimed = claimMissionReward("mission-008");

    expect(claimed).toBe(true);
    expect(store.get(missionsAtom).renownPercent).toBeGreaterThan(renownBefore);
  });

  it("grants power-up inventory slots on claim", () => {
    seedFactory("grain", { isUpgraded: true });
    store.set(missionsAtom, (previous) => ({
      ...previous,
      activeSlotIds: ["mission-006"],
      progressBaselines: {
        "mission-006": {
          goldEarned: "0",
          goldSpent: "0",
          productionCyclesCompleted: 0,
          powerUpsActivated: 0,
        },
      },
    }));
    syncMissionProgress();

    const slotsBefore = store.get(inventoryAtom).slots.length;
    const claimed = claimMissionReward("mission-006");

    expect(claimed).toBe(true);
    expect(store.get(inventoryAtom).slots.length).toBeGreaterThan(slotsBefore);
  });
});
