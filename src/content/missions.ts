import type { FactoryType } from "@/content/factories";
import type { GodId } from "@/content/gods";
import type { PowerUpId, PowerUpTier } from "@/content/power-ups";
import { hasMessageKey, translate, translateParams } from "@/i18n/localize";

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
  | "claimDailyRewards"
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
  | { type: "invokeGod"; godId: GodId; scope: "lifetime" }
  | { type: "holdGold"; target: string; scope: "run" }
  | { type: "completeCycles"; target: number; scope: MissionObjectiveScope }
  | { type: "claimDailyRewards"; target: number; scope: MissionObjectiveScope }
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
  minGodsInvoked?: number;
}

export interface MissionDefinition {
  id: MissionId;
  objective: MissionObjective;
  order: number;
  requires?: MissionRequirements;
  rewards: MissionReward[];
}

export const MISSION_DATA = [
  {
    id: "mission-001",
    order: 1,
    objective: {
      type: "ownUnits",
      factory: "grain",
      target: 1,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "250" }],
  },
  {
    id: "mission-002",
    order: 2,
    objective: {
      type: "completeCycles",
      target: 8,
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "500" }],
  },
  {
    id: "mission-003",
    order: 3,
    objective: {
      type: "earnGold",
      target: "1500",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "750" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "common" },
    ],
  },
  {
    id: "mission-004",
    order: 4,
    objective: {
      type: "ownUnits",
      factory: "grain",
      target: 4,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "1000" }],
  },
  {
    id: "mission-005",
    order: 5,
    objective: {
      type: "earnGold",
      target: "4000",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "1250" }],
  },
  {
    id: "mission-006",
    order: 6,
    objective: {
      type: "upgradeFactory",
      factory: "grain",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "1500" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "common" },
    ],
  },
  {
    id: "mission-007",
    order: 7,
    objective: {
      type: "completeCycles",
      target: 20,
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "1750" }],
  },
  {
    id: "mission-008",
    order: 8,
    objective: {
      type: "earnGold",
      target: "8000",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "2000" },
      { type: "renown", percent: 0.5 },
    ],
  },
  {
    id: "mission-009",
    order: 9,
    objective: {
      type: "ownUnits",
      factory: "grain",
      target: 8,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "2250" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "common" },
    ],
  },
  {
    id: "mission-010",
    order: 10,
    objective: {
      type: "spendGold",
      target: "6000",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "2500" }],
  },
  {
    id: "mission-011",
    order: 11,
    objective: {
      type: "automateFactory",
      factory: "grain",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "2750" }],
  },
  {
    id: "mission-012",
    order: 12,
    objective: {
      type: "holdGold",
      target: "12000",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "3000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "common" },
    ],
  },
  {
    id: "mission-013",
    order: 13,
    objective: {
      type: "ownUnits",
      factory: "grain",
      target: 12,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "3250" }],
  },
  {
    id: "mission-014",
    order: 14,
    objective: {
      type: "earnGold",
      target: "20000",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "3500" }],
  },
  {
    id: "mission-015",
    order: 15,
    objective: {
      type: "claimDailyRewards",
      target: 1,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "3750" }],
  },
  {
    id: "mission-016",
    order: 16,
    objective: {
      type: "completeCycles",
      target: 35,
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "4000" }],
  },
  {
    id: "mission-017",
    order: 17,
    objective: {
      type: "activatePowerUps",
      target: 1,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "4250" }],
  },
  {
    id: "mission-018",
    order: 18,
    objective: {
      type: "spendGold",
      target: "40000",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "4500" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "uncommon" },
    ],
  },
  {
    id: "mission-019",
    order: 19,
    objective: {
      type: "ownUnits",
      factory: "grain",
      target: 18,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "4750" }],
  },
  {
    id: "mission-020",
    order: 20,
    objective: {
      type: "unlockFactory",
      factory: "wine",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "5000" },
      { type: "renown", percent: 0.5 },
    ],
  },
  {
    id: "mission-021",
    order: 21,
    requires: { minFactoryUnlocked: "wine" },
    objective: {
      type: "earnGold",
      target: "165000",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "15000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "uncommon" },
    ],
  },
  {
    id: "mission-022",
    order: 22,
    requires: { minFactoryUnlocked: "wine" },
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 4,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "18000" }],
  },
  {
    id: "mission-023",
    order: 23,
    requires: { minFactoryUnlocked: "wine" },
    objective: {
      type: "completeCycles",
      target: 45,
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "20000" }],
  },
  {
    id: "mission-024",
    order: 24,
    requires: { minFactoryUnlocked: "wine" },
    objective: {
      type: "spendGold",
      target: "120000",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "22000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "uncommon" },
    ],
  },
  {
    id: "mission-025",
    order: 25,
    requires: { minFactoryUnlocked: "wine" },
    objective: {
      type: "earnGold",
      target: "280000",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "25000" },
      { type: "renown", percent: 0.75 },
    ],
  },
  {
    id: "mission-026",
    order: 26,
    requires: { minFactoryUnlocked: "wine" },
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 8,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "28000" }],
  },
  {
    id: "mission-027",
    order: 27,
    requires: { minFactoryUnlocked: "wine" },
    objective: {
      type: "upgradeFactory",
      factory: "wine",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "30000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "uncommon" },
    ],
  },
  {
    id: "mission-028",
    order: 28,
    requires: { minFactoryUnlocked: "wine" },
    objective: {
      type: "automateFactory",
      factory: "wine",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "32000" }],
  },
  {
    id: "mission-029",
    order: 29,
    requires: { minFactoryUnlocked: "wine" },
    objective: {
      type: "unlockFactory",
      factory: "iron",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "35000" }],
  },
  {
    id: "mission-030",
    order: 30,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "ownUnits",
      factory: "iron",
      target: 4,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "40000" }],
  },
  {
    id: "mission-031",
    order: 31,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "earnGold",
      target: "600000",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "45000" }],
  },
  {
    id: "mission-032",
    order: 32,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "completeCycles",
      target: 70,
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "50000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "uncommon" },
    ],
  },
  {
    id: "mission-033",
    order: 33,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "upgradeFactory",
      factory: "iron",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "55000" }],
  },
  {
    id: "mission-034",
    order: 34,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "automateFactory",
      factory: "iron",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "60000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "uncommon" },
    ],
  },
  {
    id: "mission-035",
    order: 35,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "ownUnits",
      factory: "iron",
      target: 10,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "65000" },
      { type: "renown", percent: 0.75 },
    ],
  },
  {
    id: "mission-036",
    order: 36,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "earnGold",
      target: "1200000",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "70000" }],
  },
  {
    id: "mission-037",
    order: 37,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "spendGold",
      target: "800000",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "75000" }],
  },
  {
    id: "mission-038",
    order: 38,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "ownUnits",
      factory: "iron",
      target: 14,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "80000" }],
  },
  {
    id: "mission-039",
    order: 39,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "claimDailyRewards",
      target: 2,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "85000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "rare" },
    ],
  },
  {
    id: "mission-040",
    order: 40,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "activatePowerUps",
      target: 2,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "90000" }],
  },
  {
    id: "mission-041",
    order: 41,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "earnGold",
      target: "2500000",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "95000" }],
  },
  {
    id: "mission-042",
    order: 42,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "holdGold",
      target: "600000",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "100000" },
      { type: "renown", percent: 0.75 },
    ],
  },
  {
    id: "mission-043",
    order: 43,
    requires: { minFactoryUnlocked: "iron" },
    objective: {
      type: "unlockFactory",
      factory: "crossbow",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "120000" }],
  },
  {
    id: "mission-044",
    order: 44,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "ownUnits",
      factory: "crossbow",
      target: 4,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "150000" }],
  },
  {
    id: "mission-045",
    order: 45,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "earnGold",
      target: "8000000",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "180000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "rare" },
    ],
  },
  {
    id: "mission-046",
    order: 46,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "completeCycles",
      target: 110,
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "200000" }],
  },
  {
    id: "mission-047",
    order: 47,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "holdGold",
      target: "8000000",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "220000" }],
  },
  {
    id: "mission-048",
    order: 48,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "ownUnits",
      factory: "crossbow",
      target: 6,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "250000" }],
  },
  {
    id: "mission-049",
    order: 49,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "activatePowerUps",
      target: 3,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "280000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "rare" },
    ],
  },
  {
    id: "mission-050",
    order: 50,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "earnGold",
      target: "15000000",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "300000" },
      { type: "renown", percent: 1 },
    ],
  },
  {
    id: "mission-051",
    order: 51,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "spendGold",
      target: "10000000",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "350000" }],
  },
  {
    id: "mission-052",
    order: 52,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "ownUnits",
      factory: "crossbow",
      target: 10,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "400000" }],
  },
  {
    id: "mission-053",
    order: 53,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "upgradeFactory",
      factory: "crossbow",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "450000" }],
  },
  {
    id: "mission-054",
    order: 54,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "automateFactory",
      factory: "crossbow",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "500000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "rare" },
    ],
  },
  {
    id: "mission-055",
    order: 55,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "earnGold",
      target: "50000000",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "600000" }],
  },
  {
    id: "mission-056",
    order: 56,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "holdGold",
      target: "1e12",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "700000" },
      { type: "renown", percent: 1 },
    ],
  },
  {
    id: "mission-057",
    order: 57,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "completeCycles",
      target: 160,
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "800000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "rare" },
    ],
  },
  {
    id: "mission-058",
    order: 58,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "claimDailyRewards",
      target: 3,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "900000" }],
  },
  {
    id: "mission-059",
    order: 59,
    requires: { minFactoryUnlocked: "crossbow" },
    objective: {
      type: "invokeGod",
      godId: "huangdi",
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "1000000" }],
  },
  {
    id: "mission-060",
    order: 60,
    requires: { minGodsInvoked: 1 },
    objective: {
      type: "earnGold",
      target: "1e13",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "1200000" }],
  },
  {
    id: "mission-061",
    order: 61,
    requires: { minGodsInvoked: 1 },
    objective: {
      type: "unlockFactory",
      factory: "wine",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "1400000" }],
  },
  {
    id: "mission-062",
    order: 62,
    requires: { minGodsInvoked: 1 },
    objective: {
      type: "earnGold",
      target: "5e13",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "1600000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "rare" },
    ],
  },
  {
    id: "mission-063",
    order: 63,
    requires: { minGodsInvoked: 1 },
    objective: {
      type: "invokeGod",
      godId: "dagda",
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "1800000" },
      { type: "renown", percent: 1 },
    ],
  },
  {
    id: "mission-064",
    order: 64,
    requires: { minGodsInvoked: 2 },
    objective: {
      type: "holdGold",
      target: "1e18",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "2000000" }],
  },
  {
    id: "mission-065",
    order: 65,
    requires: { minGodsInvoked: 2 },
    objective: {
      type: "earnGold",
      target: "1e16",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "2200000" }],
  },
  {
    id: "mission-066",
    order: 66,
    requires: { minGodsInvoked: 2 },
    objective: {
      type: "unlockFactory",
      factory: "iron",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "2400000" }],
  },
  {
    id: "mission-067",
    order: 67,
    requires: { minGodsInvoked: 2 },
    objective: {
      type: "completeCycles",
      target: 200,
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "2600000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "epic" },
    ],
  },
  {
    id: "mission-068",
    order: 68,
    requires: { minGodsInvoked: 2 },
    objective: {
      type: "activatePowerUps",
      target: 4,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "2800000" }],
  },
  {
    id: "mission-069",
    order: 69,
    requires: { minGodsInvoked: 2 },
    objective: {
      type: "invokeGod",
      godId: "shango",
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "3000000" },
      { type: "renown", percent: 1 },
    ],
  },
  {
    id: "mission-070",
    order: 70,
    requires: { minGodsInvoked: 3 },
    objective: {
      type: "holdGold",
      target: "1e24",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "3500000" }],
  },
  {
    id: "mission-071",
    order: 71,
    requires: { minGodsInvoked: 3 },
    objective: {
      type: "earnGold",
      target: "1e20",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "4000000" }],
  },
  {
    id: "mission-072",
    order: 72,
    requires: { minGodsInvoked: 3 },
    objective: {
      type: "spendGold",
      target: "1e19",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "4500000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "epic" },
    ],
  },
  {
    id: "mission-073",
    order: 73,
    requires: { minGodsInvoked: 3 },
    objective: {
      type: "unlockFactory",
      factory: "longship",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "5000000" }],
  },
  {
    id: "mission-074",
    order: 74,
    requires: { minFactoryUnlocked: "longship" },
    objective: {
      type: "ownUnits",
      factory: "longship",
      target: 4,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "6000000" }],
  },
  {
    id: "mission-075",
    order: 75,
    requires: { minFactoryUnlocked: "longship" },
    objective: {
      type: "earnGold",
      target: "1e22",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "7000000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "epic" },
    ],
  },
  {
    id: "mission-076",
    order: 76,
    requires: { minFactoryUnlocked: "longship" },
    objective: {
      type: "invokeGod",
      godId: "indra",
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "8000000" },
      { type: "renown", percent: 1.5 },
    ],
  },
  {
    id: "mission-077",
    order: 77,
    requires: { minGodsInvoked: 4 },
    objective: {
      type: "holdGold",
      target: "1e30",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "9000000" }],
  },
  {
    id: "mission-078",
    order: 78,
    requires: { minGodsInvoked: 4 },
    objective: {
      type: "ownUnits",
      factory: "longship",
      target: 8,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "10000000" }],
  },
  {
    id: "mission-079",
    order: 79,
    requires: { minGodsInvoked: 4 },
    objective: {
      type: "completeCycles",
      target: 250,
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "11000000" }],
  },
  {
    id: "mission-080",
    order: 80,
    requires: { minGodsInvoked: 4 },
    objective: {
      type: "earnGold",
      target: "1e24",
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "12000000" },
      { type: "renown", percent: 1.5 },
    ],
  },
  {
    id: "mission-081",
    order: 81,
    requires: { minGodsInvoked: 4 },
    objective: {
      type: "upgradeFactory",
      factory: "longship",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "13000000" }],
  },
  {
    id: "mission-082",
    order: 82,
    requires: { minGodsInvoked: 4 },
    objective: {
      type: "automateFactory",
      factory: "longship",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "14000000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "epic" },
    ],
  },
  {
    id: "mission-083",
    order: 83,
    requires: { minGodsInvoked: 4 },
    objective: {
      type: "holdGold",
      target: "1e33",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "15000000" }],
  },
  {
    id: "mission-084",
    order: 84,
    requires: { minGodsInvoked: 4 },
    objective: {
      type: "ownUnits",
      factory: "longship",
      target: 12,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "16000000" }],
  },
  {
    id: "mission-085",
    order: 85,
    requires: { minGodsInvoked: 4 },
    objective: {
      type: "invokeGod",
      godId: "tangaroa",
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "18000000" },
      { type: "renown", percent: 1.5 },
    ],
  },
  {
    id: "mission-086",
    order: 86,
    requires: { minGodsInvoked: 5 },
    objective: {
      type: "unlockFactory",
      factory: "reliquary",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "20000000" }],
  },
  {
    id: "mission-087",
    order: 87,
    requires: { minFactoryUnlocked: "reliquary" },
    objective: {
      type: "ownUnits",
      factory: "reliquary",
      target: 4,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "22000000" }],
  },
  {
    id: "mission-088",
    order: 88,
    requires: { minFactoryUnlocked: "reliquary" },
    objective: {
      type: "holdGold",
      target: "1e36",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "24000000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "epic" },
    ],
  },
  {
    id: "mission-089",
    order: 89,
    requires: { minFactoryUnlocked: "reliquary" },
    objective: {
      type: "earnGold",
      target: "1e26",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "26000000" }],
  },
  {
    id: "mission-090",
    order: 90,
    requires: { minFactoryUnlocked: "reliquary" },
    objective: {
      type: "invokeGod",
      godId: "inti",
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "28000000" },
      { type: "renown", percent: 2 },
    ],
  },
  {
    id: "mission-091",
    order: 91,
    requires: { minGodsInvoked: 6 },
    objective: {
      type: "ownUnits",
      factory: "reliquary",
      target: 10,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "30000000" }],
  },
  {
    id: "mission-092",
    order: 92,
    requires: { minGodsInvoked: 6 },
    objective: {
      type: "completeCycles",
      target: 300,
      scope: "sinceActive",
    },
    rewards: [
      { type: "gold", amount: "32000000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "epic" },
    ],
  },
  {
    id: "mission-093",
    order: 93,
    requires: { minGodsInvoked: 6 },
    objective: {
      type: "holdGold",
      target: "1e40",
      scope: "run",
    },
    rewards: [{ type: "gold", amount: "34000000" }],
  },
  {
    id: "mission-094",
    order: 94,
    requires: { minGodsInvoked: 6 },
    objective: {
      type: "earnGold",
      target: "1e28",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "36000000" }],
  },
  {
    id: "mission-095",
    order: 95,
    requires: { minGodsInvoked: 6 },
    objective: {
      type: "activatePowerUps",
      target: 5,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "38000000" },
      { type: "renown", percent: 2 },
    ],
  },
  {
    id: "mission-096",
    order: 96,
    requires: { minGodsInvoked: 6 },
    objective: {
      type: "ownUnits",
      factory: "reliquary",
      target: 16,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "40000000" }],
  },
  {
    id: "mission-097",
    order: 97,
    requires: { minGodsInvoked: 6 },
    objective: {
      type: "spendGold",
      target: "1e27",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "42000000" }],
  },
  {
    id: "mission-098",
    order: 98,
    requires: { minGodsInvoked: 6 },
    objective: {
      type: "holdGold",
      target: "1e42",
      scope: "run",
    },
    rewards: [
      { type: "gold", amount: "44000000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "epic" },
    ],
  },
  {
    id: "mission-099",
    order: 99,
    requires: { minGodsInvoked: 6 },
    objective: {
      type: "earnGold",
      target: "1e30",
      scope: "sinceActive",
    },
    rewards: [{ type: "gold", amount: "46000000" }],
  },
  {
    id: "mission-100",
    order: 100,
    requires: { minGodsInvoked: 6 },
    objective: {
      type: "ownUnits",
      factory: "reliquary",
      target: 25,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "50000000" },
      { type: "renown", percent: 2 },
    ],
  },
] as const satisfies readonly MissionDefinition[];

export const MISSION_COUNT = MISSION_DATA.length;

export const MISSION_CATALOG: MissionDefinition[] = [...MISSION_DATA];

export const MISSION_IDS = MISSION_CATALOG.map((mission) => mission.id);

export const getMissionById = (id: MissionId): MissionDefinition | undefined =>
  MISSION_CATALOG.find((mission) => mission.id === id);

export const getMissionByOrder = (
  order: number
): MissionDefinition | undefined =>
  MISSION_CATALOG.find((mission) => mission.order === order);

export const getLocalizedMissionTitle = (id: MissionId): string => {
  const key = `mission.${id}.title`;

  if (hasMessageKey(key)) {
    return translate(key);
  }

  return translate("mission.fallback.title");
};

const objectiveA11yKey = (
  type: MissionObjective["type"],
  scope: MissionObjective["scope"] | undefined
): string => {
  if (scope === "sinceActive") {
    const sinceActiveKey = `mission.objective.a11y.${type}.sinceActive`;

    if (hasMessageKey(sinceActiveKey)) {
      return sinceActiveKey;
    }
  }

  return `mission.objective.a11y.${type}`;
};

export const getLocalizedMissionObjective = (
  objective: MissionObjective
): string => {
  const key = objectiveA11yKey(
    objective.type,
    "scope" in objective ? objective.scope : undefined
  );

  if (!hasMessageKey(key)) {
    return translate("mission.fallback.objective");
  }

  return mObjectiveA11y(objective, key);
};

const mObjectiveA11y = (
  objective: MissionObjective,
  key = objectiveA11yKey(
    objective.type,
    "scope" in objective ? objective.scope : undefined
  )
): string => {
  const factoryName = (factory: FactoryType) =>
    translate(`factory.${factory}.name`);

  switch (objective.type) {
    case "earnGold":
    case "spendGold":
      return translateParams(key, {
        amount: objective.target,
      });
    case "holdGold":
      return translateParams("mission.objective.a11y.holdGold", {
        amount: objective.target,
      });
    case "ownUnits":
      return translateParams("mission.objective.a11y.ownUnits", {
        amount: String(objective.target),
        factory: factoryName(objective.factory),
      });
    case "unlockFactory":
    case "upgradeFactory":
    case "automateFactory":
      return translateParams(`mission.objective.a11y.${objective.type}`, {
        factory: factoryName(objective.factory),
      });
    case "invokeGod":
      return translateParams("mission.objective.a11y.invokeGod", {
        god: translate(`god.${objective.godId}.name`),
      });
    case "completeCycles":
    case "claimDailyRewards":
    case "activatePowerUps":
      return translateParams(key, {
        amount: String(objective.target),
      });
    default: {
      const exhaustiveCheck: never = objective;
      return exhaustiveCheck;
    }
  }
};
