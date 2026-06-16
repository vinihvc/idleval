import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import {
  ACTIVE_MISSION_SLOTS,
  type MissionDefinition,
  type MissionId,
  type MissionObjective,
  type MissionReward,
} from "@/content/missions";
import { createInitialFactoryState } from "@/game/factories";
import {
  createMissionProgressBaseline,
  type MissionGameSnapshot,
  type MissionProgress,
  type MissionProgressBaseline,
  type MissionSlotStatus,
  type MissionSlotView,
  type MissionsPersistedState,
} from "@/game/types";
import { D, type GameValue } from "@/utils/decimal";

const clampRatio = (current: number, target: number): number => {
  if (target <= 0) {
    return 1;
  }

  return Math.min(1, current / target);
};

const getFactoryState = (snapshot: MissionGameSnapshot, factory: FactoryType) =>
  snapshot.factories[factory] ??
  createInitialFactoryState(factory, { amount: 0 });

const getDecimalProgress = (
  current: GameValue,
  target: GameValue
): MissionProgress => {
  const targetNumber = target.lte(0) ? 1 : target.toNumber();
  const currentNumber = Math.min(Math.max(0, current.toNumber()), targetNumber);

  return {
    current: currentNumber,
    target: targetNumber,
    ratio: clampRatio(currentNumber, targetNumber),
  };
};

const getCountProgress = (current: number, target: number): MissionProgress => {
  const safeCurrent = Math.max(0, Math.min(current, target));

  return {
    current: safeCurrent,
    target,
    ratio: clampRatio(safeCurrent, target),
  };
};

const getFactoryTierIndex = (factory: FactoryType): number =>
  FACTORY_TYPES.indexOf(factory);

export interface PlayerProgressStage {
  godsInvoked: number;
  highestFactory: FactoryType;
  highestFactoryIndex: number;
}

/**
 * Derives the player's macro progression stage from the current snapshot.
 */
export const getPlayerProgressStage = (
  snapshot: MissionGameSnapshot
): PlayerProgressStage => {
  let highestFactoryIndex = 0;

  for (const factory of FACTORY_TYPES) {
    const state = getFactoryState(snapshot, factory);

    if (state.isUnlocked) {
      highestFactoryIndex = Math.max(
        highestFactoryIndex,
        getFactoryTierIndex(factory)
      );
    }
  }

  return {
    highestFactory: FACTORY_TYPES[highestFactoryIndex] ?? "grain",
    highestFactoryIndex,
    godsInvoked: snapshot.gods.invoked.length,
  };
};

export const meetsMissionRequirements = (
  mission: MissionDefinition,
  snapshot: MissionGameSnapshot
): boolean => {
  if (!mission.requires) {
    return true;
  }

  const stage = getPlayerProgressStage(snapshot);

  if (mission.requires.minFactoryUnlocked) {
    const requiredIndex = getFactoryTierIndex(
      mission.requires.minFactoryUnlocked
    );

    if (stage.highestFactoryIndex < requiredIndex) {
      return false;
    }
  }

  if (
    mission.requires.minGodsInvoked !== undefined &&
    stage.godsInvoked < mission.requires.minGodsInvoked
  ) {
    return false;
  }

  return true;
};

const getBaseline = (
  missionId: MissionId,
  state: MissionsPersistedState
): MissionProgressBaseline | undefined => state.progressBaselines[missionId];

const getSinceActiveGoldEarned = (
  snapshot: MissionGameSnapshot,
  baseline: MissionProgressBaseline | undefined
): GameValue => {
  const current = D(snapshot.statistics.goldEarned);
  const base = D(baseline?.goldEarned ?? "0");

  return current.minus(base).max(0);
};

const getSinceActiveGoldSpent = (
  snapshot: MissionGameSnapshot,
  baseline: MissionProgressBaseline | undefined
): GameValue => {
  const current = D(snapshot.statistics.goldSpent);
  const base = D(baseline?.goldSpent ?? "0");

  return current.minus(base).max(0);
};

const getSinceActiveCycles = (
  snapshot: MissionGameSnapshot,
  baseline: MissionProgressBaseline | undefined
): number =>
  Math.max(
    0,
    snapshot.counters.productionCyclesCompleted -
      (baseline?.productionCyclesCompleted ?? 0)
  );

const getSinceActivePowerUps = (
  snapshot: MissionGameSnapshot,
  baseline: MissionProgressBaseline | undefined
): number =>
  Math.max(
    0,
    snapshot.counters.powerUpsActivated - (baseline?.powerUpsActivated ?? 0)
  );

const getSinceActiveDailyRewards = (
  snapshot: MissionGameSnapshot,
  baseline: MissionProgressBaseline | undefined
): number =>
  Math.max(
    0,
    snapshot.counters.dailyRewardsClaimed - (baseline?.dailyRewardsClaimed ?? 0)
  );

const getScopedGoldProgress = (
  scope: MissionObjective["scope"],
  target: string,
  runValue: string,
  lifetimeValue: string,
  sinceActiveValue: GameValue
): MissionProgress => {
  if (scope === "run") {
    return getDecimalProgress(D(runValue), D(target));
  }

  if (scope === "sinceActive") {
    return getDecimalProgress(sinceActiveValue, D(target));
  }

  return getDecimalProgress(D(lifetimeValue), D(target));
};

const getScopedCountProgress = (
  scope: MissionObjective["scope"],
  target: number,
  lifetimeValue: number,
  sinceActiveValue: number
): MissionProgress => {
  if (scope === "sinceActive") {
    return getCountProgress(sinceActiveValue, target);
  }

  return getCountProgress(lifetimeValue, target);
};

/**
 * Returns progress toward a mission objective from the current game snapshot.
 */
export const getMissionProgress = (
  objective: MissionObjective,
  snapshot: MissionGameSnapshot,
  state?: MissionsPersistedState,
  missionId?: MissionId
): MissionProgress => {
  const baseline =
    state && missionId ? getBaseline(missionId, state) : undefined;

  switch (objective.type) {
    case "earnGold":
      return getScopedGoldProgress(
        objective.scope,
        objective.target,
        snapshot.counters.runGoldEarned,
        snapshot.statistics.goldEarned,
        getSinceActiveGoldEarned(snapshot, baseline)
      );
    case "spendGold":
      return getScopedGoldProgress(
        objective.scope,
        objective.target,
        snapshot.counters.runGoldSpent,
        snapshot.statistics.goldSpent,
        getSinceActiveGoldSpent(snapshot, baseline)
      );
    case "holdGold":
      return getDecimalProgress(snapshot.walletGold, D(objective.target));
    case "ownUnits":
      return getCountProgress(
        snapshot.statistics.factories[objective.factory]?.quantity ?? 0,
        objective.target
      );
    case "unlockFactory": {
      const factory = getFactoryState(snapshot, objective.factory);

      return getCountProgress(factory.isUnlocked ? 1 : 0, 1);
    }
    case "upgradeFactory": {
      const factory = getFactoryState(snapshot, objective.factory);

      return getCountProgress(factory.isUpgraded ? 1 : 0, 1);
    }
    case "automateFactory": {
      const factory = getFactoryState(snapshot, objective.factory);

      return getCountProgress(factory.isAutomated ? 1 : 0, 1);
    }
    case "invokeGod":
      return getCountProgress(
        snapshot.gods.invoked.includes(objective.godId) ? 1 : 0,
        1
      );
    case "completeCycles":
      return getScopedCountProgress(
        objective.scope,
        objective.target,
        snapshot.counters.productionCyclesCompleted,
        getSinceActiveCycles(snapshot, baseline)
      );
    case "claimDailyRewards":
      return getScopedCountProgress(
        objective.scope,
        objective.target,
        snapshot.counters.dailyRewardsClaimed,
        getSinceActiveDailyRewards(snapshot, baseline)
      );
    case "activatePowerUps":
      return getScopedCountProgress(
        objective.scope,
        objective.target,
        snapshot.counters.powerUpsActivated,
        getSinceActivePowerUps(snapshot, baseline)
      );
    default: {
      const exhaustiveCheck: never = objective;
      return exhaustiveCheck;
    }
  }
};

/**
 * Whether a mission objective is complete in the current snapshot.
 */
export const isMissionReadyToClaim = (
  mission: MissionDefinition,
  snapshot: MissionGameSnapshot,
  state: MissionsPersistedState
): boolean =>
  getMissionProgress(mission.objective, snapshot, state, mission.id).ratio >= 1;

export const getMissionSlotStatus = (
  id: MissionId,
  state: MissionsPersistedState
): MissionSlotStatus => {
  if (state.claimedIds.includes(id)) {
    return "claimed";
  }

  if (state.readyToClaimIds.includes(id)) {
    return "ready";
  }

  return "in_progress";
};

export const canClaimMission = (
  id: MissionId,
  state: MissionsPersistedState
): boolean => state.readyToClaimIds.includes(id);

const getEligibleMissions = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionDefinition[] => {
  const claimed = new Set(state.claimedIds);

  return catalog.filter(
    (mission) =>
      !claimed.has(mission.id) && meetsMissionRequirements(mission, snapshot)
  );
};

const getNextMissionCandidates = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionDefinition[] => getEligibleMissions(catalog, state, snapshot);

/**
 * Captures baselines for active missions that do not have one yet.
 */
export const captureMissionBaselines = (
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot,
  activeSlotIds: MissionId[]
): MissionsPersistedState => {
  let progressBaselines = state.progressBaselines;
  let changed = false;

  for (const id of activeSlotIds) {
    if (progressBaselines[id]) {
      continue;
    }

    progressBaselines = {
      ...progressBaselines,
      [id]: createMissionProgressBaseline(snapshot),
    };
    changed = true;
  }

  if (!changed) {
    return state;
  }

  return {
    ...state,
    progressBaselines,
  };
};

/**
 * Keeps the three visible slot ids stable. Existing positions are preserved;
 * empty slots are filled with the next unclaimed missions in catalog order.
 */
export const resolveActiveSlotIds = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionId[] => {
  const claimed = new Set(state.claimedIds);
  const eligible = new Set(
    getEligibleMissions(catalog, state, snapshot).map((mission) => mission.id)
  );

  const isVisibleMission = (id: MissionId): boolean =>
    catalog.some((mission) => mission.id === id) &&
    !claimed.has(id) &&
    eligible.has(id);

  const slots: MissionId[] = [];
  const used = new Set<MissionId>();

  for (const id of state.activeSlotIds) {
    if (slots.length >= ACTIVE_MISSION_SLOTS) {
      break;
    }

    if (!isVisibleMission(id) || used.has(id)) {
      continue;
    }

    slots.push(id);
    used.add(id);
  }

  for (const mission of catalog) {
    if (slots.length >= ACTIVE_MISSION_SLOTS) {
      break;
    }

    if (
      claimed.has(mission.id) ||
      used.has(mission.id) ||
      !eligible.has(mission.id)
    ) {
      continue;
    }

    slots.push(mission.id);
    used.add(mission.id);
  }

  return slots;
};

/**
 * Replaces only the claimed mission's slot with the next unclaimed mission.
 */
export const replaceActiveSlotAfterClaim = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  claimedId: MissionId,
  snapshot: MissionGameSnapshot
): MissionId[] => {
  const slotIndex = state.activeSlotIds.indexOf(claimedId);

  if (slotIndex === -1) {
    return resolveActiveSlotIds(catalog, state, snapshot);
  }

  const nextSlots = [...state.activeSlotIds];
  const usedIds = new Set(
    nextSlots.filter((id, index) => index !== slotIndex && id !== claimedId)
  );
  const nextMission = getNextMissionCandidates(catalog, state, snapshot).find(
    (mission) => !usedIds.has(mission.id)
  );

  if (nextMission) {
    nextSlots[slotIndex] = nextMission.id;
  } else {
    nextSlots.splice(slotIndex, 1);
  }

  return resolveActiveSlotIds(
    catalog,
    {
      ...state,
      activeSlotIds: nextSlots,
    },
    snapshot
  );
};

/**
 * Returns up to three mission slots for the stage UI.
 */
export const getVisibleMissionSlots = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionSlotView[] => {
  const activeSlotIds = resolveActiveSlotIds(catalog, state, snapshot);
  const slots: MissionSlotView[] = [];

  for (const id of activeSlotIds) {
    const mission = catalog.find((entry) => entry.id === id);

    if (!mission) {
      continue;
    }

    slots.push({
      id,
      order: mission.order,
      status: getMissionSlotStatus(id, state),
      progress: getMissionProgress(mission.objective, snapshot, state, id),
    });
  }

  return slots;
};

/**
 * Finds missions that became ready since the last sync.
 */
export const findNewlyReadyMissionIds = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionId[] => {
  const ready = new Set(state.readyToClaimIds);
  const claimed = new Set(state.claimedIds);
  const activeSlotIds = resolveActiveSlotIds(catalog, state, snapshot);
  const active = new Set(activeSlotIds);
  const newlyReady: MissionId[] = [];

  for (const mission of catalog) {
    if (
      ready.has(mission.id) ||
      claimed.has(mission.id) ||
      !active.has(mission.id)
    ) {
      continue;
    }

    if (!meetsMissionRequirements(mission, snapshot)) {
      continue;
    }

    if (isMissionReadyToClaim(mission, snapshot, state)) {
      newlyReady.push(mission.id);
    }
  }

  return newlyReady;
};

export const getHasClaimableMission = (
  state: MissionsPersistedState
): boolean => state.readyToClaimIds.length > 0;

/**
 * Permanent production multiplier from stacked renown rewards.
 */
export const getRenownProductionMultiplier = (
  renownPercent: number
): GameValue => D(1).plus(D(renownPercent).div(100));

export interface AppliedMissionRewards {
  gold: GameValue;
  powerUps: Array<MissionReward & { type: "powerUp" }>;
  renownPercent: number;
}

/**
 * Aggregates mission rewards for the store layer to apply.
 */
export const summarizeMissionRewards = (
  rewards: MissionReward[]
): AppliedMissionRewards => {
  let gold = D(0);
  let renownPercent = 0;
  const powerUps: Array<MissionReward & { type: "powerUp" }> = [];

  for (const reward of rewards) {
    switch (reward.type) {
      case "gold":
        gold = gold.plus(D(reward.amount));
        break;
      case "renown":
        renownPercent += reward.percent;
        break;
      case "powerUp":
        powerUps.push(reward);
        break;
      default: {
        const exhaustiveCheck: never = reward;
        return exhaustiveCheck;
      }
    }
  }

  return { gold, renownPercent, powerUps };
};
