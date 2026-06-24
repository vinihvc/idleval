import type { FactoryType } from "../factories";
import type { GodId } from "../gods";
import type { PowerUpId, PowerUpTier } from "../power-ups";

export const ACTIVE_MISSION_SLOTS = 3;

export type MissionObjectiveType =
  | "earnGold"
  | "spendGold"
  | "ownUnits"
  | "unlockFactory"
  | "upgradeFactory"
  | "automateFactory"
  | "invokeGod"
  | "holdGold"
  | "completeCycles"
  | "activatePowerUps";

export type MissionObjectiveScope = "lifetime" | "run" | "sinceActive";

export type MissionObjective =
  | { type: "earnGold"; target: string; scope: MissionObjectiveScope }
  | { type: "spendGold"; target: string; scope: MissionObjectiveScope }
  | {
      type: "ownUnits";
      factory: FactoryType;
      target: number;
      scope: "lifetime";
    }
  | { type: "unlockFactory"; factory: FactoryType; scope: "run" }
  | { type: "upgradeFactory"; factory: FactoryType; scope: "run" }
  | { type: "automateFactory"; factory: FactoryType; scope: "run" }
  /** @reserved No catalog mission uses this yet; UI and progress rules still support it. */
  | { type: "invokeGod"; godId: GodId; scope: "lifetime" }
  | { type: "holdGold"; target: string; scope: "run" }
  | { type: "completeCycles"; target: number; scope: MissionObjectiveScope }
  | { type: "activatePowerUps"; target: number; scope: MissionObjectiveScope };

export type MissionReward =
  | { type: "gold"; amount: string }
  | {
      type: "powerUp";
      powerUpId: PowerUpId;
      tier: PowerUpTier;
      count?: number;
    }
  | { type: "renown"; percent: number };

export type MissionId = `mission-${string}`;

export interface MissionRequirements {
  minFactoryUnlocked?: FactoryType;
  /** @reserved No catalog mission uses this yet; `meetsMissionRequirements` still enforces it. */
  minGodsInvoked?: number;
}

export interface MissionDefinition {
  id: MissionId;
  objective: MissionObjective;
  order: number;
  requires?: MissionRequirements;
  rewards: MissionReward[];
}
