import { GAME_BALANCE } from "@/config/balance";
import {
  FACTORY_DATA,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
import {
  MISSION_CATALOG,
  type MissionDefinition,
  type MissionObjective,
} from "@/content/missions";
import { getScaledFactoryConfig } from "@/game/balance";
import { getFactoryUnlockPrice } from "@/game/factories";
import { D, type GameValue } from "@/utils/decimal";

const UPGRADE_MULTIPLIER = GAME_BALANCE.upgradeProductionMultiplier;
const MISSION_REWARD_MULTIPLIER = GAME_BALANCE.missionGoldReward;
const CAPACITY_BUFFER_SECONDS = 86_400;
const GOLD_TOLERANCE = 1.5;

export interface SimulatedPlayerState {
  automated: Set<FactoryType>;
  renownPercent: number;
  units: Record<FactoryType, number>;
  unlocked: Set<FactoryType>;
  upgraded: Set<FactoryType>;
  wallet: GameValue;
}

export const createInitialPlayerState = (): SimulatedPlayerState => ({
  unlocked: new Set(["grain"]),
  units: Object.fromEntries(
    FACTORY_TYPES.map((factory) => [factory, factory === "grain" ? 1 : 0])
  ) as Record<FactoryType, number>,
  upgraded: new Set(),
  automated: new Set(),
  renownPercent: 0,
  wallet: D(0),
});

const getIncomePerSecond = (state: SimulatedPlayerState): number => {
  const renownMultiplier = 1 + state.renownPercent / 100;
  let total = 0;

  for (const factory of FACTORY_TYPES) {
    if (!state.unlocked.has(factory)) {
      continue;
    }

    const units = state.units[factory];
    if (units <= 0) {
      continue;
    }

    const { productionValue, productionTime } = getScaledFactoryConfig(factory);
    const upgraded = state.upgraded.has(factory) ? UPGRADE_MULTIPLIER : 1;
    const perUnit = (productionValue * upgraded) / productionTime;

    if (state.automated.has(factory)) {
      total += perUnit * units;
    }
  }

  if (total === 0 && state.units.grain > 0) {
    const { productionValue, productionTime } = getScaledFactoryConfig("grain");
    total = (productionValue / productionTime) * state.units.grain;
  }

  return total * renownMultiplier;
};

export const estimateWalletCapacity = (
  state: SimulatedPlayerState
): GameValue => {
  const incomePerSecond = getIncomePerSecond(state);
  const passiveGain = D(incomePerSecond).times(CAPACITY_BUFFER_SECONDS);

  return state.wallet.plus(passiveGain);
};

const applyMissionRewards = (
  state: SimulatedPlayerState,
  mission: MissionDefinition
): void => {
  for (const reward of mission.rewards) {
    if (reward.type === "gold") {
      state.wallet = state.wallet.plus(
        D(reward.amount).times(MISSION_REWARD_MULTIPLIER)
      );
    }
    if (reward.type === "renown") {
      state.renownPercent += reward.percent;
    }
  }
};

const applyObjectiveProgress = (
  state: SimulatedPlayerState,
  objective: MissionObjective
): void => {
  switch (objective.type) {
    case "unlockFactory":
      state.unlocked.add(objective.factory);
      break;
    case "ownUnits":
      state.units[objective.factory] = Math.max(
        state.units[objective.factory],
        objective.target
      );
      break;
    case "upgradeFactory":
      state.upgraded.add(objective.factory);
      break;
    case "automateFactory":
      state.automated.add(objective.factory);
      break;
    case "earnGold":
    case "holdGold":
      state.wallet = state.wallet.plus(D(objective.target));
      break;
    case "spendGold":
      state.wallet = state.wallet.plus(D(objective.target));
      break;
    default:
      break;
  }
};

export const simulateThroughMission = (order: number): SimulatedPlayerState => {
  const state = createInitialPlayerState();

  for (const mission of MISSION_CATALOG) {
    if (mission.order > order) {
      break;
    }

    applyObjectiveProgress(state, mission.objective);
    applyMissionRewards(state, mission);
  }

  return state;
};

export const getGoldObjectiveTarget = (
  objective: MissionObjective
): GameValue | null => {
  if (
    objective.type === "earnGold" ||
    objective.type === "holdGold" ||
    objective.type === "spendGold"
  ) {
    return D(objective.target);
  }

  return null;
};

export interface MissionProgressionIssue {
  capacity: string;
  kind: "gold_exceeds_capacity" | "unlock_unaffordable";
  missionId: string;
  order: number;
  target: string;
}

export const findMissionProgressionIssues = (): MissionProgressionIssue[] => {
  const issues: MissionProgressionIssue[] = [];

  for (const mission of MISSION_CATALOG) {
    const state = simulateThroughMission(mission.order - 1);
    const capacity = estimateWalletCapacity(state).times(GOLD_TOLERANCE);

    if (mission.objective.type === "unlockFactory") {
      const price = getFactoryUnlockPrice(
        FACTORY_DATA[mission.objective.factory].unlockPrice
      );

      if (capacity.lt(price)) {
        issues.push({
          missionId: mission.id,
          order: mission.order,
          kind: "unlock_unaffordable",
          target: price.toString(),
          capacity: capacity.toString(),
        });
      }
    }

    const goldTarget = getGoldObjectiveTarget(mission.objective);

    if (goldTarget && capacity.lt(goldTarget)) {
      issues.push({
        missionId: mission.id,
        order: mission.order,
        kind: "gold_exceeds_capacity",
        target: goldTarget.toString(),
        capacity: capacity.toString(),
      });
    }
  }

  return issues;
};

export const getHighestUnlockedFactory = (
  state: SimulatedPlayerState
): FactoryType => {
  let highest: FactoryType = "grain";

  for (const factory of FACTORY_TYPES) {
    if (state.unlocked.has(factory)) {
      highest = factory;
    }
  }

  return highest;
};

export const meetsMissionGate = (
  mission: MissionDefinition,
  state: SimulatedPlayerState
): boolean => {
  if (!mission.requires?.minFactoryUnlocked) {
    return true;
  }

  return state.unlocked.has(mission.requires.minFactoryUnlocked);
};

export const assertMissionGateOrdering = (): string[] => {
  const violations: string[] = [];

  for (const mission of MISSION_CATALOG) {
    const state = simulateThroughMission(mission.order - 1);

    if (!meetsMissionGate(mission, state)) {
      violations.push(
        `${mission.id} requires ${mission.requires?.minFactoryUnlocked} before player unlocks it`
      );
    }
  }

  return violations;
};
