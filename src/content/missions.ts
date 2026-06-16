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

export type MissionObjective =
  | { type: "earnGold"; target: string; scope: "lifetime" }
  | { type: "spendGold"; target: string; scope: "lifetime" }
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
  | { type: "completeCycles"; target: number; scope: "lifetime" }
  | { type: "claimDailyRewards"; target: number; scope: "lifetime" }
  | { type: "activatePowerUps"; target: number; scope: "lifetime" };

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

export interface MissionDefinition {
  id: MissionId;
  objective: MissionObjective;
  order: number;
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
    objective: { type: "earnGold", target: "500", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "500" }],
  },
  {
    id: "mission-003",
    order: 3,
    objective: { type: "completeCycles", target: 5, scope: "lifetime" },
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
      target: 3,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "1000" }],
  },
  {
    id: "mission-005",
    order: 5,
    objective: { type: "earnGold", target: "2000", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "1250" },
      { type: "renown", percent: 0.5 },
    ],
  },
  {
    id: "mission-006",
    order: 6,
    objective: { type: "upgradeFactory", factory: "grain", scope: "run" },
    rewards: [
      { type: "gold", amount: "1500" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "common" },
    ],
  },
  {
    id: "mission-007",
    order: 7,
    objective: { type: "earnGold", target: "5000", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "1750" }],
  },
  {
    id: "mission-008",
    order: 8,
    objective: {
      type: "ownUnits",
      factory: "grain",
      target: 8,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "2000" }],
  },
  {
    id: "mission-009",
    order: 9,
    objective: { type: "completeCycles", target: 20, scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "2250" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "common" },
    ],
  },
  {
    id: "mission-010",
    order: 10,
    objective: { type: "spendGold", target: "3000", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "2500" },
      { type: "renown", percent: 0.5 },
    ],
  },
  {
    id: "mission-011",
    order: 11,
    objective: { type: "automateFactory", factory: "grain", scope: "run" },
    rewards: [{ type: "gold", amount: "2750" }],
  },
  {
    id: "mission-012",
    order: 12,
    objective: { type: "holdGold", target: "10000", scope: "run" },
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
      target: 15,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "3250" }],
  },
  {
    id: "mission-014",
    order: 14,
    objective: { type: "earnGold", target: "25000", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "3500" }],
  },
  {
    id: "mission-015",
    order: 15,
    objective: { type: "claimDailyRewards", target: 1, scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "3750" },
      { type: "renown", percent: 0.5 },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "common" },
    ],
  },
  {
    id: "mission-016",
    order: 16,
    objective: { type: "completeCycles", target: 50, scope: "lifetime" },
    rewards: [{ type: "gold", amount: "4000" }],
  },
  {
    id: "mission-017",
    order: 17,
    objective: { type: "activatePowerUps", target: 1, scope: "lifetime" },
    rewards: [{ type: "gold", amount: "4250" }],
  },
  {
    id: "mission-018",
    order: 18,
    objective: { type: "spendGold", target: "50000", scope: "lifetime" },
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
      target: 25,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "4750" }],
  },
  {
    id: "mission-020",
    order: 20,
    objective: { type: "unlockFactory", factory: "wine", scope: "run" },
    rewards: [
      { type: "gold", amount: "5000" },
      { type: "renown", percent: 0.5 },
    ],
  },
  {
    id: "mission-021",
    order: 21,
    objective: { type: "earnGold", target: "315000", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "52500" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "uncommon" },
    ],
  },
  {
    id: "mission-022",
    order: 22,
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 4,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "55000" }],
  },
  {
    id: "mission-023",
    order: 23,
    objective: { type: "completeCycles", target: 92, scope: "lifetime" },
    rewards: [{ type: "gold", amount: "57500" }],
  },
  {
    id: "mission-024",
    order: 24,
    objective: { type: "spendGold", target: "192000", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "60000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "uncommon" },
    ],
  },
  {
    id: "mission-025",
    order: 25,
    objective: { type: "earnGold", target: "375000", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "62500" },
      { type: "renown", percent: 0.75 },
    ],
  },
  {
    id: "mission-026",
    order: 26,
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 8,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "65000" }],
  },
  {
    id: "mission-027",
    order: 27,
    objective: { type: "completeCycles", target: 108, scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "67500" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "uncommon" },
    ],
  },
  {
    id: "mission-028",
    order: 28,
    objective: { type: "spendGold", target: "224000", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "70000" }],
  },
  {
    id: "mission-029",
    order: 29,
    objective: { type: "earnGold", target: "435000", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "72500" }],
  },
  {
    id: "mission-030",
    order: 30,
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 12,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "75000" },
      { type: "renown", percent: 0.75 },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "uncommon" },
    ],
  },
  {
    id: "mission-031",
    order: 31,
    objective: { type: "completeCycles", target: 124, scope: "lifetime" },
    rewards: [{ type: "gold", amount: "77500" }],
  },
  {
    id: "mission-032",
    order: 32,
    objective: { type: "spendGold", target: "256000", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "80000" }],
  },
  {
    id: "mission-033",
    order: 33,
    objective: { type: "earnGold", target: "495000", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "82500" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "uncommon" },
    ],
  },
  {
    id: "mission-034",
    order: 34,
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 16,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "85000" }],
  },
  {
    id: "mission-035",
    order: 35,
    objective: { type: "completeCycles", target: 140, scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "87500" },
      { type: "renown", percent: 0.75 },
    ],
  },
  {
    id: "mission-036",
    order: 36,
    objective: { type: "upgradeFactory", factory: "wine", scope: "run" },
    rewards: [
      { type: "gold", amount: "90000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "uncommon" },
    ],
  },
  {
    id: "mission-037",
    order: 37,
    objective: { type: "automateFactory", factory: "wine", scope: "run" },
    rewards: [{ type: "gold", amount: "92500" }],
  },
  {
    id: "mission-038",
    order: 38,
    objective: { type: "unlockFactory", factory: "iron", scope: "run" },
    rewards: [{ type: "gold", amount: "95000" }],
  },
  {
    id: "mission-039",
    order: 39,
    objective: { type: "completeCycles", target: 90, scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "97500" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "uncommon" },
    ],
  },
  {
    id: "mission-040",
    order: 40,
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 9,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "100000" },
      { type: "renown", percent: 0.75 },
    ],
  },
  {
    id: "mission-041",
    order: 41,
    objective: { type: "completeCycles", target: 110, scope: "lifetime" },
    rewards: [{ type: "gold", amount: "102500" }],
  },
  {
    id: "mission-042",
    order: 42,
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 13,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "105000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "rare" },
    ],
  },
  {
    id: "mission-043",
    order: 43,
    objective: { type: "completeCycles", target: 130, scope: "lifetime" },
    rewards: [{ type: "gold", amount: "107500" }],
  },
  {
    id: "mission-044",
    order: 44,
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 17,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "110000" }],
  },
  {
    id: "mission-045",
    order: 45,
    objective: { type: "completeCycles", target: 150, scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "112500" },
      { type: "renown", percent: 0.75 },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "rare" },
    ],
  },
  {
    id: "mission-046",
    order: 46,
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 21,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "115000" }],
  },
  {
    id: "mission-047",
    order: 47,
    objective: { type: "completeCycles", target: 170, scope: "lifetime" },
    rewards: [{ type: "gold", amount: "117500" }],
  },
  {
    id: "mission-048",
    order: 48,
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 25,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "120000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "rare" },
    ],
  },
  {
    id: "mission-049",
    order: 49,
    objective: { type: "completeCycles", target: 190, scope: "lifetime" },
    rewards: [{ type: "gold", amount: "122500" }],
  },
  {
    id: "mission-050",
    order: 50,
    objective: {
      type: "ownUnits",
      factory: "wine",
      target: 29,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "125000" },
      { type: "renown", percent: 0.75 },
    ],
  },
  {
    id: "mission-051",
    order: 51,
    objective: { type: "earnGold", target: "1e6", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "1275000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "rare" },
    ],
  },
  {
    id: "mission-052",
    order: 52,
    objective: {
      type: "ownUnits",
      factory: "iron",
      target: 4,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "1300000" }],
  },
  {
    id: "mission-053",
    order: 53,
    objective: { type: "upgradeFactory", factory: "iron", scope: "run" },
    rewards: [{ type: "gold", amount: "1325000" }],
  },
  {
    id: "mission-054",
    order: 54,
    objective: { type: "automateFactory", factory: "iron", scope: "run" },
    rewards: [
      { type: "gold", amount: "1350000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "rare" },
    ],
  },
  {
    id: "mission-055",
    order: 55,
    objective: { type: "earnGold", target: "1e6", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "1375000" },
      { type: "renown", percent: 1 },
    ],
  },
  {
    id: "mission-056",
    order: 56,
    objective: {
      type: "ownUnits",
      factory: "iron",
      target: 8,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "1400000" }],
  },
  {
    id: "mission-057",
    order: 57,
    objective: { type: "upgradeFactory", factory: "iron", scope: "run" },
    rewards: [
      { type: "gold", amount: "1425000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "rare" },
    ],
  },
  {
    id: "mission-058",
    order: 58,
    objective: { type: "automateFactory", factory: "iron", scope: "run" },
    rewards: [{ type: "gold", amount: "1450000" }],
  },
  {
    id: "mission-059",
    order: 59,
    objective: { type: "earnGold", target: "1e7", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "1475000" }],
  },
  {
    id: "mission-060",
    order: 60,
    objective: {
      type: "ownUnits",
      factory: "iron",
      target: 12,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "1500000" },
      { type: "renown", percent: 1 },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "rare" },
    ],
  },
  {
    id: "mission-061",
    order: 61,
    objective: { type: "upgradeFactory", factory: "iron", scope: "run" },
    rewards: [{ type: "gold", amount: "1525000" }],
  },
  {
    id: "mission-062",
    order: 62,
    objective: { type: "automateFactory", factory: "iron", scope: "run" },
    rewards: [{ type: "gold", amount: "1550000" }],
  },
  {
    id: "mission-063",
    order: 63,
    objective: { type: "earnGold", target: "1e8", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "1575000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "rare" },
    ],
  },
  {
    id: "mission-064",
    order: 64,
    objective: {
      type: "ownUnits",
      factory: "iron",
      target: 16,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "1600000" }],
  },
  {
    id: "mission-065",
    order: 65,
    objective: { type: "upgradeFactory", factory: "iron", scope: "run" },
    rewards: [
      { type: "gold", amount: "1625000" },
      { type: "renown", percent: 1 },
    ],
  },
  {
    id: "mission-066",
    order: 66,
    objective: { type: "unlockFactory", factory: "crossbow", scope: "run" },
    rewards: [
      { type: "gold", amount: "1650000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "rare" },
    ],
  },
  {
    id: "mission-067",
    order: 67,
    objective: { type: "earnGold", target: "1e8", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "1675000" }],
  },
  {
    id: "mission-068",
    order: 68,
    objective: { type: "earnGold", target: "1e8", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "1700000" }],
  },
  {
    id: "mission-069",
    order: 69,
    objective: {
      type: "ownUnits",
      factory: "crossbow",
      target: 3,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "1725000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "rare" },
    ],
  },
  {
    id: "mission-070",
    order: 70,
    objective: { type: "invokeGod", godId: "shango", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "1750000" },
      { type: "renown", percent: 1 },
    ],
  },
  {
    id: "mission-071",
    order: 71,
    objective: { type: "earnGold", target: "1e9", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "1775000" }],
  },
  {
    id: "mission-072",
    order: 72,
    objective: {
      type: "ownUnits",
      factory: "crossbow",
      target: 5,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "1800000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "epic" },
    ],
  },
  {
    id: "mission-073",
    order: 73,
    objective: { type: "earnGold", target: "1e9", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "1825000" }],
  },
  {
    id: "mission-074",
    order: 74,
    objective: { type: "earnGold", target: "1e10", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "1850000" }],
  },
  {
    id: "mission-075",
    order: 75,
    objective: {
      type: "ownUnits",
      factory: "crossbow",
      target: 6,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "1875000" },
      { type: "renown", percent: 1 },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "epic" },
    ],
  },
  {
    id: "mission-076",
    order: 76,
    objective: { type: "earnGold", target: "1e10", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "1900000" }],
  },
  {
    id: "mission-077",
    order: 77,
    objective: { type: "invokeGod", godId: "indra", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "1925000" }],
  },
  {
    id: "mission-078",
    order: 78,
    objective: {
      type: "ownUnits",
      factory: "crossbow",
      target: 8,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "1950000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "epic" },
    ],
  },
  {
    id: "mission-079",
    order: 79,
    objective: { type: "earnGold", target: "1e11", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "1975000" }],
  },
  {
    id: "mission-080",
    order: 80,
    objective: { type: "earnGold", target: "1e11", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "2000000" },
      { type: "renown", percent: 1 },
    ],
  },
  {
    id: "mission-081",
    order: 81,
    objective: { type: "unlockFactory", factory: "longship", scope: "run" },
    rewards: [
      { type: "gold", amount: "20250000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "epic" },
    ],
  },
  {
    id: "mission-082",
    order: 82,
    objective: { type: "holdGold", target: "1e12", scope: "run" },
    rewards: [{ type: "gold", amount: "20500000" }],
  },
  {
    id: "mission-083",
    order: 83,
    objective: {
      type: "ownUnits",
      factory: "longship",
      target: 3,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "20750000" }],
  },
  {
    id: "mission-084",
    order: 84,
    objective: { type: "invokeGod", godId: "inti", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "21000000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "epic" },
    ],
  },
  {
    id: "mission-085",
    order: 85,
    objective: { type: "unlockFactory", factory: "reliquary", scope: "run" },
    rewards: [
      { type: "gold", amount: "21250000" },
      { type: "renown", percent: 1.5 },
    ],
  },
  {
    id: "mission-086",
    order: 86,
    objective: { type: "holdGold", target: "1e13", scope: "run" },
    rewards: [{ type: "gold", amount: "21500000" }],
  },
  {
    id: "mission-087",
    order: 87,
    objective: {
      type: "ownUnits",
      factory: "longship",
      target: 7,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "21750000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "epic" },
    ],
  },
  {
    id: "mission-088",
    order: 88,
    objective: { type: "invokeGod", godId: "inti", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "22000000" }],
  },
  {
    id: "mission-089",
    order: 89,
    objective: { type: "completeCycles", target: 700, scope: "lifetime" },
    rewards: [{ type: "gold", amount: "22250000" }],
  },
  {
    id: "mission-090",
    order: 90,
    objective: { type: "holdGold", target: "1e15", scope: "run" },
    rewards: [
      { type: "gold", amount: "22500000" },
      { type: "renown", percent: 1.5 },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "epic" },
    ],
  },
  {
    id: "mission-091",
    order: 91,
    objective: {
      type: "ownUnits",
      factory: "longship",
      target: 11,
      scope: "lifetime",
    },
    rewards: [{ type: "gold", amount: "22750000" }],
  },
  {
    id: "mission-092",
    order: 92,
    objective: { type: "invokeGod", godId: "inti", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "23000000" }],
  },
  {
    id: "mission-093",
    order: 93,
    objective: { type: "completeCycles", target: 800, scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "23250000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "epic" },
    ],
  },
  {
    id: "mission-094",
    order: 94,
    objective: { type: "holdGold", target: "1e16", scope: "run" },
    rewards: [{ type: "gold", amount: "23500000" }],
  },
  {
    id: "mission-095",
    order: 95,
    objective: { type: "invokeGod", godId: "tangaroa", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "23750000" },
      { type: "renown", percent: 2 },
    ],
  },
  {
    id: "mission-096",
    order: 96,
    objective: {
      type: "ownUnits",
      factory: "reliquary",
      target: 10,
      scope: "lifetime",
    },
    rewards: [
      { type: "gold", amount: "24000000" },
      { type: "powerUp", powerUpId: "yggdrasilTear", tier: "epic" },
    ],
  },
  {
    id: "mission-097",
    order: 97,
    objective: { type: "earnGold", target: "1e15", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "24250000" }],
  },
  {
    id: "mission-098",
    order: 98,
    objective: { type: "invokeGod", godId: "inti", scope: "lifetime" },
    rewards: [{ type: "gold", amount: "24500000" }],
  },
  {
    id: "mission-099",
    order: 99,
    objective: { type: "holdGold", target: "1e18", scope: "run" },
    rewards: [
      { type: "gold", amount: "24750000" },
      { type: "powerUp", powerUpId: "mimirCoin", tier: "epic" },
    ],
  },
  {
    id: "mission-100",
    order: 100,
    objective: { type: "earnGold", target: "1e20", scope: "lifetime" },
    rewards: [
      { type: "gold", amount: "25000000" },
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

export const getLocalizedMissionObjective = (
  objective: MissionObjective
): string => {
  const key = `mission.objective.a11y.${objective.type}`;

  if (!hasMessageKey(key)) {
    return translate("mission.fallback.objective");
  }

  return mObjectiveA11y(objective);
};

const mObjectiveA11y = (objective: MissionObjective): string => {
  const factoryName = (factory: FactoryType) =>
    translate(`factory.${factory}.name`);

  switch (objective.type) {
    case "earnGold":
    case "spendGold":
      return translateParams(`mission.objective.a11y.${objective.type}`, {
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
      return translateParams(`mission.objective.a11y.${objective.type}`, {
        amount: String(objective.target),
      });
    default: {
      const exhaustiveCheck: never = objective;
      return exhaustiveCheck;
    }
  }
};
