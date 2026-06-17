import { assert, describe, expect, it } from "vitest";
import { GAME_BALANCE } from "@/config/balance";
import { FACTORY_TYPES } from "@/content/factories";
import { getMissionById, MISSION_CATALOG } from "@/content/missions";
import {
  canClaimMission,
  captureMissionBaselines,
  findNewlyReadyMissionIds,
  getMissionGodCycleMultiplier,
  getMissionProgress,
  getRenownProductionMultiplier,
  getScaledMissionObjective,
  getScaledMissionRewards,
  getVisibleMissionSlots,
  isMissionReadyToClaim,
  meetsMissionRequirements,
  replaceActiveSlotAfterClaim,
  resetMissionsOnGodInvoke,
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

    expect(summary.gold.eq(1000 * GAME_BALANCE.missionGoldReward)).toBe(true);
    expect(summary.renownPercent).toBe(1.5);
    expect(summary.powerUps).toHaveLength(1);
    expect(getRenownProductionMultiplier(10).eq(1.1)).toBe(true);
  });

  it("scales mission cycle multiplier by invoked god count", () => {
    expect(getMissionGodCycleMultiplier(0)).toBe(1);
    expect(getMissionGodCycleMultiplier(1)).toBe(2);
    expect(getMissionGodCycleMultiplier(2)).toBe(4);
  });

  it("scales gold objectives and rewards for the current god cycle", () => {
    const mission = getMissionById("mission-003");
    assert(mission);

    const scaledObjective = getScaledMissionObjective(mission.objective, 1);
    expect(scaledObjective).toMatchObject({
      type: "earnGold",
      target: "3000",
    });

    const scaledRewards = getScaledMissionRewards(mission.rewards, 1);
    const goldReward = scaledRewards.find((reward) => reward.type === "gold");
    expect(goldReward).toMatchObject({ type: "gold", amount: "1500" });

    const catalogGold = mission.rewards.find(
      (reward) => reward.type === "gold"
    );
    assert(catalogGold?.type === "gold");
    const summary = summarizeMissionRewards(mission.rewards, 1);
    expect(
      summary.gold.eq(
        D(catalogGold.amount).times(GAME_BALANCE.missionGoldReward).times(2)
      )
    ).toBe(true);
  });

  it("tracks own-units progress from cycle baseline after prestige", () => {
    const mission = getMissionById("mission-004");
    assert(mission);
    const state = {
      ...createInitialMissionsState(),
      ownUnitsBaselines: { grain: 10 },
    };
    const snapshot = createSnapshot({
      gods: { invoked: ["huangdi"] },
      statistics: {
        ...createSnapshot().statistics,
        factories: {
          ...createSnapshot().statistics.factories,
          grain: { goldEarned: "0", goldSpent: "0", quantity: 12 },
        },
      },
    });

    const progress = getMissionProgress(
      mission.objective,
      snapshot,
      state,
      mission.id
    );

    expect(progress.current).toBe(2);
    expect(progress.target).toBe(8);
    expect(progress.ratio).toBe(0.25);
  });

  it("resets missions on god invoke while capturing own-units baselines", () => {
    const snapshot = createSnapshot({
      statistics: {
        ...createSnapshot().statistics,
        factories: {
          ...createSnapshot().statistics.factories,
          grain: { goldEarned: "0", goldSpent: "0", quantity: 15 },
        },
      },
    });
    const next = resetMissionsOnGodInvoke(snapshot);

    expect(next.claimedIds).toEqual([]);
    expect(next.renownPercent).toBe(0);
    expect(next.readyToClaimIds).toEqual([]);
    expect(next.ownUnitsBaselines.grain).toBe(15);
  });

  it("tracks large gold progress with decimal ratio accuracy", () => {
    const objective = {
      type: "earnGold" as const,
      scope: "lifetime" as const,
      target: "1e18",
    };
    const snapshot = createSnapshot({
      statistics: {
        ...createSnapshot().statistics,
        goldEarned: "5e17",
      },
    });

    const progress = getMissionProgress(objective, snapshot);

    expect(progress.ratio).toBe(0.5);
    expect(progress.current).toBe(5e17);
    expect(progress.target).toBe(1e18);

    const mission001 = getMissionById("mission-001");
    if (!mission001) {
      throw new Error("mission-001 should exist");
    }

    expect(
      isMissionReadyToClaim(
        { ...mission001, objective },
        snapshot,
        createInitialMissionsState()
      )
    ).toBe(false);

    const completeSnapshot = createSnapshot({
      statistics: {
        ...createSnapshot().statistics,
        goldEarned: "1e18",
      },
    });

    expect(getMissionProgress(objective, completeSnapshot).ratio).toBe(1);
  });

  it("tracks gold objectives across run, lifetime, and since-active scopes", () => {
    const earnRun = {
      type: "earnGold" as const,
      scope: "run" as const,
      target: "100",
    };
    const earnLifetime = {
      type: "earnGold" as const,
      scope: "lifetime" as const,
      target: "1000",
    };
    const spendSinceActive = {
      type: "spendGold" as const,
      scope: "sinceActive" as const,
      target: "50",
    };
    const state = createInitialMissionsState();
    state.progressBaselines = {
      "mission-099": {
        goldEarned: "0",
        goldSpent: "100",
        productionCyclesCompleted: 0,
        powerUpsActivated: 0,
        dailyRewardsClaimed: 0,
      },
    };
    const snapshot = createSnapshot({
      counters: {
        ...createInitialMissionCounters(),
        runGoldEarned: "100",
        runGoldSpent: "0",
      },
      statistics: {
        ...createSnapshot().statistics,
        goldEarned: "1000",
        goldSpent: "150",
      },
      walletGold: D("2500"),
    });

    expect(getMissionProgress(earnRun, snapshot).ratio).toBe(1);
    expect(getMissionProgress(earnLifetime, snapshot).ratio).toBe(1);
    expect(
      getMissionProgress(spendSinceActive, snapshot, state, "mission-099").ratio
    ).toBe(1);
    expect(
      getMissionProgress(
        { type: "holdGold", scope: "run", target: "2500" },
        snapshot
      ).ratio
    ).toBe(1);
  });

  it("gates missions until minimum gods are invoked", () => {
    const mission001 = getMissionById("mission-001");
    if (!mission001) {
      throw new Error("mission-001 should exist");
    }

    const mission = {
      ...mission001,
      requires: { minGodsInvoked: 1 },
    };

    expect(meetsMissionRequirements(mission, createSnapshot())).toBe(false);
    expect(
      meetsMissionRequirements(
        mission,
        createSnapshot({ gods: { invoked: ["huangdi"] } })
      )
    ).toBe(true);
  });
});
