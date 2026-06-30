import { assert, describe, expect, it } from "vitest";
import { BALANCE_BASELINE } from "@/config/balance";
import { FACTORY_TYPES } from "@/content/factories";
import { getMissionById, MISSION_CATALOG } from "@/content/missions";
import { getGameDifficulty } from "@/game/difficulty";
import {
  canClaimMission,
  captureMissionBaselines,
  findNewlyReadyMissionIds,
  getMissionGoldRewardLevelMultiplier,
  getMissionObjectiveLevelMultiplier,
  getMissionPowerUpRewardCount,
  getMissionProgress,
  getRenownProductionMultiplier,
  getScaledMissionObjective,
  getScaledMissionRewards,
  getVisibleMissionSlots,
  isMissionReadyToClaim,
  isMissionReplay,
  meetsMissionRequirements,
  replaceActiveSlotAfterClaim,
  resetMissionsOnGodInvoke,
  resolveActiveSlotIds,
  resolveMissionSlotStatus,
  scaleMissionCountTarget,
  summarizeMissionRewards,
} from "@/game/missions";
import { getPlayerLevel } from "@/game/player-level";
import {
  createInitialMissionCounters,
  createInitialMissionsState,
  type MissionGameSnapshot,
} from "@/game/types";
import { D, type GameValue } from "@/utils/decimal";

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

const createReliquaryHoldGoldFactories =
  (): MissionGameSnapshot["factories"] => ({
    grain: createSnapshot().factories.grain,
    reliquary: {
      amount: 1,
      isAutomated: false,
      isProducing: false,
      isUnlocked: true,
      isUpgraded: false,
      productionStartedAt: null,
      productionDurationSec: null,
    },
  });

const findHoldGoldReadyWallet = (
  mission: NonNullable<ReturnType<typeof getMissionById>>,
  factories: MissionGameSnapshot["factories"]
): GameValue => {
  const state = createInitialMissionsState();
  state.activeSlotIds = [mission.id];
  let wallet = D(
    mission.objective.type === "holdGold" ? mission.objective.target : "1e9"
  );

  for (let attempt = 0; attempt < 60; attempt++) {
    const snapshot = createSnapshot({ walletGold: wallet, factories });

    if (isMissionReadyToClaim(mission, snapshot, state)) {
      return wallet;
    }

    wallet = wallet.times(1.25);
  }

  throw new Error(`Could not find holdGold ready wallet for ${mission.id}`);
};

const findHoldGoldWalletJustBelowTarget = (
  mission: NonNullable<ReturnType<typeof getMissionById>>,
  factories: MissionGameSnapshot["factories"]
): GameValue => {
  const state = createInitialMissionsState();
  state.activeSlotIds = [mission.id];
  let wallet = findHoldGoldReadyWallet(mission, factories);

  while (wallet.gt(0)) {
    wallet = wallet.times(0.999);
    const snapshot = createSnapshot({ walletGold: wallet, factories });

    if (!isMissionReadyToClaim(mission, snapshot, state)) {
      return wallet;
    }
  }

  throw new Error(
    `Could not find holdGold below-target wallet for ${mission.id}`
  );
};

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
      },
      "mission-002": {
        goldEarned: "0",
        goldSpent: "0",
        productionCyclesCompleted: 0,
        powerUpsActivated: 0,
      },
      "mission-003": {
        goldEarned: "0",
        goldSpent: "0",
        productionCyclesCompleted: 0,
        powerUpsActivated: 0,
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
    expect(canClaimMission(mission.id, state, snapshot)).toBe(true);
  });

  it("summarizes rewards and renown multiplier", () => {
    const summary = summarizeMissionRewards(
      [
        { type: "gold", amount: "1000" },
        { type: "renown", percent: 1.5 },
        {
          type: "powerUp",
          powerUpId: "mimirCoin",
          tier: "common",
        },
      ],
      1
    );

    expect(
      summary.gold.eq(
        D(1000)
          .times(BALANCE_BASELINE.missionGoldReward)
          .times(getGameDifficulty())
      )
    ).toBe(true);
    expect(summary.renownPercent).toBe(1.5);
    expect(summary.powerUps).toHaveLength(1);
    expect(getRenownProductionMultiplier(10).eq(1.1)).toBe(true);
  });

  it("scales mission multipliers by player level", () => {
    expect(getMissionObjectiveLevelMultiplier(1)).toBe(1);
    expect(getMissionGoldRewardLevelMultiplier(1)).toBe(1);
    expect(getMissionGoldRewardLevelMultiplier(50)).toBeGreaterThan(
      getMissionObjectiveLevelMultiplier(50)
    );
    expect(getMissionPowerUpRewardCount(1, 40)).toBe(3);
  });

  it("scales gold objectives and rewards for the current player level", () => {
    const mission = getMissionById("mission-003");
    assert(mission);
    const playerLevel = 50;
    const objectiveMultiplier = getMissionObjectiveLevelMultiplier(playerLevel);
    const goldMultiplier = getMissionGoldRewardLevelMultiplier(playerLevel);

    const scaledObjective = getScaledMissionObjective(
      mission.objective,
      playerLevel
    );
    expect(scaledObjective).toMatchObject({
      type: "earnGold",
      target: D("1500").times(objectiveMultiplier).round().toString(),
    });

    const scaledRewards = getScaledMissionRewards(mission.rewards, playerLevel);
    const goldReward = scaledRewards.find((reward) => reward.type === "gold");
    expect(goldReward).toMatchObject({
      type: "gold",
      amount: D("750").times(goldMultiplier).round().toString(),
    });

    const catalogGold = mission.rewards.find(
      (reward) => reward.type === "gold"
    );
    assert(catalogGold?.type === "gold");
    const summary = summarizeMissionRewards(mission.rewards, playerLevel);
    expect(
      summary.gold.eq(
        D(catalogGold.amount)
          .times(BALANCE_BASELINE.missionGoldReward)
          .times(getGameDifficulty())
          .times(goldMultiplier)
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
    const playerLevel = getPlayerLevel(snapshot);
    assert(mission.objective.type === "ownUnits");
    const expectedTarget = scaleMissionCountTarget(
      mission.objective.target,
      getMissionObjectiveLevelMultiplier(playerLevel)
    );

    expect(progress.current).toBe(2);
    expect(progress.target).toBe(expectedTarget);
    expect(progress.ratio).toBeCloseTo(2 / expectedTarget);
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

  it("does not mark holdGold ready when wallet is slightly below billion-scale target", () => {
    const mission = getMissionById("mission-103");
    assert(mission);
    const state = createInitialMissionsState();
    state.activeSlotIds = ["mission-103"];
    const factories = createReliquaryHoldGoldFactories();
    const snapshot = createSnapshot({
      walletGold: findHoldGoldWalletJustBelowTarget(mission, factories),
      factories,
    });

    expect(isMissionReadyToClaim(mission, snapshot, state)).toBe(false);
    expect(
      getMissionProgress(mission.objective, snapshot, state, mission.id).ratio
    ).toBeLessThan(1);
  });

  it("marks holdGold ready at exact billion-scale target", () => {
    const mission = getMissionById("mission-103");
    assert(mission);
    const state = createInitialMissionsState();
    state.activeSlotIds = ["mission-103"];
    const factories = createReliquaryHoldGoldFactories();
    const snapshot = createSnapshot({
      walletGold: findHoldGoldReadyWallet(mission, factories),
      factories,
    });

    expect(isMissionReadyToClaim(mission, snapshot, state)).toBe(true);
    expect(
      findNewlyReadyMissionIds(MISSION_CATALOG, state, snapshot)
    ).toContain("mission-103");
  });

  it("shows live ready status before sync persists readyToClaimIds", () => {
    const mission = getMissionById("mission-103");
    assert(mission);
    const state = createInitialMissionsState();
    state.activeSlotIds = ["mission-103"];
    const factories = createReliquaryHoldGoldFactories();
    const snapshot = createSnapshot({
      walletGold: findHoldGoldReadyWallet(mission, factories),
      factories,
    });

    const slots = getVisibleMissionSlots(MISSION_CATALOG, state, snapshot);
    const slot = slots.find((entry) => entry.id === "mission-103");

    expect(slot?.status).toBe("ready");
    expect(state.readyToClaimIds).not.toContain("mission-103");
  });

  it("tracks sinceActive earnGold progress for mission-102", () => {
    const mission = getMissionById("mission-102");
    assert(mission);
    const state = createInitialMissionsState();
    state.activeSlotIds = ["mission-102"];
    state.progressBaselines = {
      "mission-102": {
        goldEarned: "0",
        goldSpent: "0",
        productionCyclesCompleted: 0,
        powerUpsActivated: 0,
      },
    };
    const snapshot = createSnapshot({
      statistics: {
        ...createSnapshot().statistics,
        goldEarned: "54999500000",
      },
      factories: {
        grain: createSnapshot().factories.grain,
        reliquary: {
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

    expect(isMissionReadyToClaim(mission, snapshot, state)).toBe(false);

    const completeSnapshot = createSnapshot({
      statistics: {
        ...createSnapshot().statistics,
        goldEarned: "55000000000",
      },
      factories: snapshot.factories,
    });

    expect(isMissionReadyToClaim(mission, completeSnapshot, state)).toBe(true);
  });

  it("wraps the catalog after the last mission when claiming near the end", () => {
    const state = createInitialMissionsState();
    state.activeSlotIds = ["mission-198", "mission-199", "mission-200"];
    state.claimedIds = MISSION_CATALOG.slice(0, 197).map(
      (mission) => mission.id
    );
    state.claimedIds.push("mission-198");
    const snapshot = createSnapshot({
      factories: createReliquaryHoldGoldFactories(),
    });

    const nextSlots = replaceActiveSlotAfterClaim(
      MISSION_CATALOG,
      state,
      "mission-198",
      snapshot
    );

    expect(nextSlots).toEqual(["mission-001", "mission-199", "mission-200"]);
  });

  it("treats replay missions in active slots as in progress, not claimed", () => {
    const mission = getMissionById("mission-001");
    assert(mission);
    const state = createInitialMissionsState();
    state.activeSlotIds = ["mission-001"];
    state.claimedIds = ["mission-001"];
    const snapshot = createSnapshot();

    expect(resolveMissionSlotStatus(mission, state, snapshot)).not.toBe(
      "claimed"
    );
    expect(isMissionReplay(state, "mission-001")).toBe(true);
  });

  it("requires new lifetime progress when a mission is replayed", () => {
    const mission = getMissionById("mission-198");
    assert(mission);
    const state = createInitialMissionsState();
    state.activeSlotIds = ["mission-198"];
    state.claimedIds = ["mission-198"];
    state.progressBaselines = {
      "mission-198": {
        goldEarned: "0",
        goldSpent: "0",
        productionCyclesCompleted: 0,
        powerUpsActivated: 12,
      },
    };
    const snapshot = createSnapshot({
      counters: {
        ...createInitialMissionCounters(),
        powerUpsActivated: 12,
      },
      factories: createReliquaryHoldGoldFactories(),
    });

    expect(
      getMissionProgress(mission.objective, snapshot, state, mission.id).ratio
    ).toBe(0);
    expect(isMissionReadyToClaim(mission, snapshot, state)).toBe(false);
  });

  it("recaptures baselines when a claimed mission becomes active again", () => {
    const snapshot = createSnapshot({
      statistics: {
        ...createSnapshot().statistics,
        goldEarned: "1000",
      },
      counters: {
        ...createInitialMissionCounters(),
        productionCyclesCompleted: 50,
      },
    });
    const state = captureMissionBaselines(
      {
        ...createInitialMissionsState(),
        activeSlotIds: ["mission-002"],
        claimedIds: ["mission-002"],
        progressBaselines: {
          "mission-002": {
            goldEarned: "0",
            goldSpent: "0",
            productionCyclesCompleted: 0,
            powerUpsActivated: 0,
          },
        },
      },
      snapshot,
      ["mission-002"]
    );

    expect(
      state.progressBaselines["mission-002"]?.productionCyclesCompleted
    ).toBe(50);
  });
});
