import type { FactoryType } from "@/content/factories";
import {
  ACTIVE_MISSION_SLOTS,
  type MissionDefinition,
  type MissionId,
  type MissionObjective,
  type MissionReward,
} from "@/content/missions";
import { createInitialFactoryState } from "@/game/factories";
import type {
  MissionGameSnapshot,
  MissionProgress,
  MissionSlotStatus,
  MissionSlotView,
  MissionsPersistedState,
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
  const currentNumber = Math.min(current.toNumber(), targetNumber);

  return {
    current: currentNumber,
    target: targetNumber,
    ratio: clampRatio(currentNumber, targetNumber),
  };
};

const getCountProgress = (
  current: number,
  target: number
): MissionProgress => ({
  current: Math.min(current, target),
  target,
  ratio: clampRatio(current, target),
});

/**
 * Returns progress toward a mission objective from the current game snapshot.
 *
 * @example
 * ```ts
 * getMissionProgress(mission, snapshot);
 * // => { current: 3, target: 10, ratio: 0.3 }
 * ```
 */
export const getMissionProgress = (
  objective: MissionObjective,
  snapshot: MissionGameSnapshot
): MissionProgress => {
  switch (objective.type) {
    case "earnGold":
      return getDecimalProgress(
        D(snapshot.statistics.goldEarned),
        D(objective.target)
      );
    case "spendGold":
      return getDecimalProgress(
        D(snapshot.statistics.goldSpent),
        D(objective.target)
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
      return getCountProgress(
        snapshot.counters.productionCyclesCompleted,
        objective.target
      );
    case "claimDailyRewards":
      return getCountProgress(
        snapshot.counters.dailyRewardsClaimed,
        objective.target
      );
    case "activatePowerUps":
      return getCountProgress(
        snapshot.counters.powerUpsActivated,
        objective.target
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
  objective: MissionObjective,
  snapshot: MissionGameSnapshot
): boolean => getMissionProgress(objective, snapshot).ratio >= 1;

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

const getNextMissionCandidates = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState
): MissionDefinition[] => {
  const claimed = new Set(state.claimedIds);

  return catalog.filter((mission) => !claimed.has(mission.id));
};

/**
 * Keeps the three visible slot ids stable. Existing positions are preserved;
 * empty slots are filled with the next unclaimed missions in catalog order.
 */
export const resolveActiveSlotIds = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState
): MissionId[] => {
  const claimed = new Set(state.claimedIds);

  const isVisibleMission = (id: MissionId): boolean =>
    catalog.some((mission) => mission.id === id) && !claimed.has(id);

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

    if (claimed.has(mission.id) || used.has(mission.id)) {
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
  claimedId: MissionId
): MissionId[] => {
  const slotIndex = state.activeSlotIds.indexOf(claimedId);

  if (slotIndex === -1) {
    return resolveActiveSlotIds(catalog, state);
  }

  const nextSlots = [...state.activeSlotIds];
  const usedIds = new Set(
    nextSlots.filter((id, index) => index !== slotIndex && id !== claimedId)
  );
  const nextMission = getNextMissionCandidates(catalog, state).find(
    (mission) => !usedIds.has(mission.id)
  );

  if (nextMission) {
    nextSlots[slotIndex] = nextMission.id;
  } else {
    nextSlots.splice(slotIndex, 1);
  }

  return resolveActiveSlotIds(catalog, {
    ...state,
    activeSlotIds: nextSlots,
  });
};

/**
 * Returns up to three mission slots for the stage UI.
 */
export const getVisibleMissionSlots = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionSlotView[] => {
  const slots: MissionSlotView[] = [];

  for (const id of resolveActiveSlotIds(catalog, state)) {
    const mission = catalog.find((entry) => entry.id === id);

    if (!mission) {
      continue;
    }

    slots.push({
      id,
      order: mission.order,
      status: getMissionSlotStatus(id, state),
      progress: getMissionProgress(mission.objective, snapshot),
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
  const newlyReady: MissionId[] = [];

  for (const mission of catalog) {
    if (ready.has(mission.id) || claimed.has(mission.id)) {
      continue;
    }

    if (isMissionReadyToClaim(mission.objective, snapshot)) {
      newlyReady.push(mission.id);
    }
  }

  return newlyReady;
};

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
