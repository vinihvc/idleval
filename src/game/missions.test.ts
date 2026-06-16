import { assert, describe, expect, it } from "vitest";
import { FACTORY_TYPES } from "@/content/factories";
import { getMissionById, MISSION_CATALOG } from "@/content/missions";
import {
  canClaimMission,
  captureMissionBaselines,
  findNewlyReadyMissionIds,
  getMissionProgress,
  getRenownProductionMultiplier,
  getVisibleMissionSlots,
  isMissionReadyToClaim,
  meetsMissionRequirements,
  replaceActiveSlotAfterClaim,
  resolveActiveSlotIds,
  summarizeMissionRewards,
} from "@/game/missions";
import {
  createInitialMissionCounters,
  createInitialMissionsState,
  type MissionGameSnapshot,
} from "@/game/types";
import { D } from "@/utils/decimal";

const createSnapshot = (
  overrides: Partial<MissionGameSnapshot> = {}
): MissionGameSnapshot => ({
  statistics: {
    goldEarned: "0",
    goldSpent: "0",
    factories: Object.fromEntries(
      FACTORY_TYPES.map((factory) => [
        factory,
        { goldEarned: "0", goldSpent: "0", quantity: 0 },
      ])
    ) as MissionGameSnapshot["statistics"]["factories"],
  },
  factories: {
    grain: {
      amount: 0,
      isAutomated: false,
      isProducing: false,
      isUnlocked: true,
      isUpgraded: false,
      productionStartedAt: null,
      productionDurationSec: null,
    },
  },
  gods: { invoked: [] },
  walletGold: D(0),
  counters: createInitialMissionCounters(),
  ...overrides,
});

describe("missions", () => {
  it("tracks own-units progress from statistics", () => {
    const mission = getMissionById("mission-001");
    assert(mission);
    const state = createInitialMissionsState();
    const snapshot = createSnapshot({
      statistics: {
        goldEarned: "0",
        goldSpent: "0",
        factories: {
          ...createSnapshot().statistics.factories,
          grain: { goldEarned: "0", goldSpent: "0", quantity: 1 },
        },
      },
    });

    expect(
      getMissionProgress(mission.objective, snapshot, state, mission.id).ratio
    ).toBe(1);
    expect(isMissionReadyToClaim(mission, snapshot, state)).toBe(true);
  });

  it("requires since-active progress after baseline capture", () => {
    const mission = getMissionById("mission-002");
    assert(mission);
    const snapshot = createSnapshot({
      counters: {
        ...createInitialMissionCounters(),
        productionCyclesCompleted: 20,
      },
    });
    const state = captureMissionBaselines(
      {
        ...createInitialMissionsState(),
        activeSlotIds: ["mission-002"],
        progressBaselines: {
          "mission-002": {
            goldEarned: "0",
            goldSpent: "0",
            productionCyclesCompleted: 20,
            powerUpsActivated: 0,
            dailyRewardsClaimed: 0,
          },
        },
      },
      snapshot,
      ["mission-002"]
    );

    expect(
      getMissionProgress(mission.objective, snapshot, state, mission.id).ratio
    ).toBe(0);
    expect(isMissionReadyToClaim(mission, snapshot, state)).toBe(false);
  });

  it("gates missions until factory tier is unlocked", () => {
    const state = createInitialMissionsState();
    const snapshot = createSnapshot();
    const wineMission = getMissionById("mission-021");
    assert(wineMission);

    expect(meetsMissionRequirements(wineMission, snapshot)).toBe(false);

    const unlockedWine = createSnapshot({
      factories: {
        grain: createSnapshot().factories.grain,
        wine: {
          amount: 1,
          isAutomated: false,
          isProducing: false,
          isUnlocked: true,
          isUpgraded: false,
          productionStartedAt: null,
          productionDurationSec: null,
        },
      },
    });

    expect(meetsMissionRequirements(wineMission, unlockedWine)).toBe(true);
    expect(resolveActiveSlotIds(MISSION_CATALOG, state, snapshot)).toEqual([
      "mission-001",
      "mission-002",
      "mission-003",
    ]);
  });

  it("keeps ready missions in their original slot position", () => {
    const state = createInitialMissionsState();
    state.activeSlotIds = ["mission-001", "mission-002", "mission-003"];
    state.readyToClaimIds = ["mission-003"];
    state.progressBaselines = {
      "mission-001": {
        goldEarned: "0",
        goldSpent: "0",
        productionCyclesCompleted: 0,
        powerUpsActivated: 0,
        dailyRewardsClaimed: 0,
      },
      "mission-002": {
        goldEarned: "0",
        goldSpent: "0",
        productionCyclesCompleted: 0,
        powerUpsActivated: 0,
        dailyRewardsClaimed: 0,
      },
      "mission-003": {
        goldEarned: "0",
        goldSpent: "0",
        productionCyclesCompleted: 0,
        powerUpsActivated: 0,
        dailyRewardsClaimed: 0,
      },
    };
    const snapshot = createSnapshot();

    const slots = getVisibleMissionSlots(MISSION_CATALOG, state, snapshot);

    expect(slots).toHaveLength(3);
    expect(slots[0]?.id).toBe("mission-001");
    expect(slots[1]?.id).toBe("mission-002");
    expect(slots[2]?.id).toBe("mission-003");
    expect(slots[2]?.status).toBe("ready");
    expect(slots[0]?.status).toBe("in_progress");
  });

  it("replaces only the claimed slot when advancing the queue", () => {
    const state = createInitialMissionsState();
    state.activeSlotIds = ["mission-001", "mission-002", "mission-003"];
    const snapshot = createSnapshot();

    const nextSlots = replaceActiveSlotAfterClaim(
      MISSION_CATALOG,
      { ...state, claimedIds: ["mission-001"] },
      "mission-001",
      snapshot
    );

    expect(nextSlots).toEqual(["mission-004", "mission-002", "mission-003"]);
  });

  it("finds newly ready missions and supports claim checks", () => {
    const mission = getMissionById("mission-001");
    assert(mission);
    const state = createInitialMissionsState();
    state.activeSlotIds = ["mission-001"];
    state.progressBaselines = {
      "mission-001": {
        goldEarned: "0",
        goldSpent: "0",
        productionCyclesCompleted: 0,
        powerUpsActivated: 0,
        dailyRewardsClaimed: 0,
      },
    };
    const snapshot = createSnapshot({
      statistics: {
        ...createSnapshot().statistics,
        factories: {
          ...createSnapshot().statistics.factories,
          grain: { goldEarned: "0", goldSpent: "0", quantity: 1 },
        },
      },
    });

    expect(
      findNewlyReadyMissionIds(MISSION_CATALOG, state, snapshot)
    ).toContain(mission.id);

    state.readyToClaimIds = [mission.id];
    expect(canClaimMission(mission.id, state)).toBe(true);
  });

  it("summarizes rewards and renown multiplier", () => {
    const summary = summarizeMissionRewards([
      { type: "gold", amount: "1000" },
      { type: "renown", percent: 1.5 },
      {
        type: "powerUp",
        powerUpId: "mimirCoin",
        tier: "common",
      },
    ]);

    expect(summary.gold.eq(1000)).toBe(true);
    expect(summary.renownPercent).toBe(1.5);
    expect(summary.powerUps).toHaveLength(1);
    expect(getRenownProductionMultiplier(10).eq(1.1)).toBe(true);
  });
});
