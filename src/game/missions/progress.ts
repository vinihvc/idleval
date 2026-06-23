import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import type {
  MissionDefinition,
  MissionId,
  MissionObjective,
} from "@/content/missions";
import { createInitialFactoryState } from "@/game/factories";
import {
  createInitialMissionsState,
  type MissionGameSnapshot,
  type MissionProgress,
  type MissionProgressBaseline,
  type MissionStatisticsSnapshot,
  type MissionsPersistedState,
} from "@/game/types";
import { D, type GameValue } from "@/utils/decimal";
import { getScaledMissionObjective } from "./scaling";

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
  const safeTarget = target.lte(0) ? D(1) : target;
  const safeCurrent = current.max(0);
  const isComplete = safeCurrent.gte(safeTarget);
  const clampedCurrent = isComplete ? safeTarget : safeCurrent;
  const ratio = isComplete
    ? 1
    : Math.min(1, Math.max(0, safeCurrent.div(safeTarget).toNumber()));

  return {
    current: clampedCurrent.toNumber(),
    target: safeTarget.toNumber(),
    ratio,
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

const captureFactoryQuantities = (
  statistics: MissionStatisticsSnapshot
): Partial<Record<FactoryType, number>> => {
  const baselines: Partial<Record<FactoryType, number>> = {};

  for (const factory of FACTORY_TYPES) {
    baselines[factory] = statistics.factories[factory]?.quantity ?? 0;
  }

  return baselines;
};

/**
 * Returns mission state reset for a new god cycle, preserving own-units baselines.
 */
export const resetMissionsOnGodInvoke = (
  snapshot: MissionGameSnapshot
): MissionsPersistedState => ({
  ...createInitialMissionsState(),
  ownUnitsBaselines: captureFactoryQuantities(snapshot.statistics),
});

const getOwnUnitsProgress = (
  objective: Extract<MissionObjective, { type: "ownUnits" }>,
  snapshot: MissionGameSnapshot,
  state: MissionsPersistedState | undefined
): MissionProgress => {
  const lifetimeQuantity =
    snapshot.statistics.factories[objective.factory]?.quantity ?? 0;
  const baseline = state?.ownUnitsBaselines[objective.factory] ?? 0;
  const current = Math.max(0, lifetimeQuantity - baseline);

  return getCountProgress(current, objective.target);
};

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
 *
 * @example
 * getMissionProgress(mission.objective, snapshot, missionsState, mission.id).ratio
 */
export const getMissionProgress = (
  objective: MissionObjective,
  snapshot: MissionGameSnapshot,
  state?: MissionsPersistedState,
  missionId?: MissionId
): MissionProgress => {
  const baseline =
    state && missionId ? getBaseline(missionId, state) : undefined;
  const godsInvoked = snapshot.gods.invoked.length;
  const scaled = getScaledMissionObjective(objective, godsInvoked);

  switch (scaled.type) {
    case "earnGold":
      return getScopedGoldProgress(
        scaled.scope,
        scaled.target,
        snapshot.counters.runGoldEarned,
        snapshot.statistics.goldEarned,
        getSinceActiveGoldEarned(snapshot, baseline)
      );
    case "spendGold":
      return getScopedGoldProgress(
        scaled.scope,
        scaled.target,
        snapshot.counters.runGoldSpent,
        snapshot.statistics.goldSpent,
        getSinceActiveGoldSpent(snapshot, baseline)
      );
    case "holdGold":
      return getDecimalProgress(snapshot.walletGold, D(scaled.target));
    case "ownUnits":
      return getOwnUnitsProgress(scaled, snapshot, state);
    case "unlockFactory": {
      const factory = getFactoryState(snapshot, scaled.factory);

      return getCountProgress(factory.isUnlocked ? 1 : 0, 1);
    }
    case "upgradeFactory": {
      const factory = getFactoryState(snapshot, scaled.factory);

      return getCountProgress(factory.isUpgraded ? 1 : 0, 1);
    }
    case "automateFactory": {
      const factory = getFactoryState(snapshot, scaled.factory);

      return getCountProgress(factory.isAutomated ? 1 : 0, 1);
    }
    case "invokeGod":
      return getCountProgress(
        snapshot.gods.invoked.includes(scaled.godId) ? 1 : 0,
        1
      );
    case "completeCycles":
      return getScopedCountProgress(
        scaled.scope,
        scaled.target,
        snapshot.counters.productionCyclesCompleted,
        getSinceActiveCycles(snapshot, baseline)
      );
    case "claimDailyRewards":
      return getScopedCountProgress(
        scaled.scope,
        scaled.target,
        snapshot.counters.dailyRewardsClaimed,
        getSinceActiveDailyRewards(snapshot, baseline)
      );
    case "activatePowerUps":
      return getScopedCountProgress(
        scaled.scope,
        scaled.target,
        snapshot.counters.powerUpsActivated,
        getSinceActivePowerUps(snapshot, baseline)
      );
    default: {
      const exhaustiveCheck: never = scaled;
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
