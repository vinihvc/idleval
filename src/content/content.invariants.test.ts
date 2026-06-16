import { describe, expect, it } from "vitest";
import { FACTORY_DATA, FACTORY_TYPES } from "@/content/factories";
import { GOD_COUNT, GOD_DATA } from "@/content/gods";
import {
  MISSION_CATALOG,
  MISSION_COUNT,
  MISSION_IDS,
} from "@/content/missions";
import {
  DAILY_REWARD_CALENDAR,
  DAILY_REWARD_CYCLE_DAYS,
} from "@/content/daily-reward";
import {
  INVENTORY_GRID_SIZE,
  POWER_UP_TYPES,
  RELIC_SLOT_COUNT,
  RITUAL_SLOT_COUNT,
} from "@/content/power-ups";
import { hasMessageKey } from "@/i18n/localize";
import { D } from "@/utils/decimal";

describe("content invariants", () => {
  it("FACTORY_TYPES covers every factory definition", () => {
    expect(FACTORY_TYPES).toEqual(Object.keys(FACTORY_DATA));
  });

  it("factory definitions have positive production and cost values", () => {
    for (const factory of FACTORY_TYPES) {
      const definition = FACTORY_DATA[factory];

      expect(definition.productionTime).toBeGreaterThan(0);
      expect(definition.productionValue).toBeGreaterThan(0);
      expect(definition.baseBuyCost).toBeGreaterThan(0);
      expect(definition.unlockPrice).toBeGreaterThanOrEqual(0);
    }
  });

  it("unlock prices are non-decreasing across factory tiers", () => {
    let previousUnlockPrice = -1;

    for (const factory of FACTORY_TYPES) {
      const unlockPrice = FACTORY_DATA[factory].unlockPrice;

      expect(unlockPrice).toBeGreaterThanOrEqual(previousUnlockPrice);
      previousUnlockPrice = unlockPrice;
    }
  });

  it("every factory has localized message keys", () => {
    for (const factory of FACTORY_TYPES) {
      const prefix = `factory.${factory}`;

      expect(hasMessageKey(`${prefix}.name`)).toBe(true);
      expect(hasMessageKey(`${prefix}.description`)).toBe(true);
      expect(hasMessageKey(`${prefix}.upgrade.name`)).toBe(true);
      expect(hasMessageKey(`${prefix}.upgrade.description`)).toBe(true);
      expect(hasMessageKey(`${prefix}.manager.name`)).toBe(true);
      expect(hasMessageKey(`${prefix}.manager.description`)).toBe(true);
    }
  });

  it("every power-up has localized message keys", () => {
    for (const powerUpId of POWER_UP_TYPES) {
      const prefix = `powerup.${powerUpId}`;

      expect(hasMessageKey(`${prefix}.name`)).toBe(true);
      expect(hasMessageKey(`${prefix}.description`)).toBe(true);
    }
  });

  it("every power-up has wiki lore and mechanics keys", () => {
    for (const powerUpId of POWER_UP_TYPES) {
      const prefix = `wiki.powerup.${powerUpId}`;

      expect(hasMessageKey(`${prefix}.lore`)).toBe(true);
      expect(hasMessageKey(`${prefix}.mechanics`)).toBe(true);
    }
  });

  it("altar grid keeps six relic slots and four ritual circles", () => {
    expect(RELIC_SLOT_COUNT).toBe(6);
    expect(RITUAL_SLOT_COUNT).toBe(4);
    expect(INVENTORY_GRID_SIZE).toBe(RELIC_SLOT_COUNT + RITUAL_SLOT_COUNT);
  });

  it("daily reward calendar matches cycle length", () => {
    expect(DAILY_REWARD_CALENDAR).toHaveLength(DAILY_REWARD_CYCLE_DAYS);
  });

  it("every god has localized message keys", () => {
    for (const god of GOD_DATA) {
      const prefix = `god.${god.id}`;

      expect(hasMessageKey(`${prefix}.name`)).toBe(true);
      expect(hasMessageKey(`${prefix}.description`)).toBe(true);
    }
  });

  it("every god has wiki lore and mechanics keys", () => {
    for (const god of GOD_DATA) {
      const prefix = `wiki.god.${god.id}`;

      expect(hasMessageKey(`${prefix}.lore`)).toBe(true);
      expect(hasMessageKey(`${prefix}.mechanics`)).toBe(true);
    }
  });

  it("every factory has wiki manager and upgrade keys", () => {
    for (const factory of FACTORY_TYPES) {
      const managerPrefix = `wiki.factory.${factory}.manager`;
      const upgradePrefix = `wiki.factory.${factory}.upgrade`;

      expect(hasMessageKey(`${managerPrefix}.lore`)).toBe(true);
      expect(hasMessageKey(`${managerPrefix}.mechanics`)).toBe(true);
      expect(hasMessageKey(`${upgradePrefix}.lore`)).toBe(true);
      expect(hasMessageKey(`${upgradePrefix}.mechanics`)).toBe(true);
    }
  });

  it("god definitions have valid progression values", () => {
    expect(GOD_COUNT).toBe(GOD_DATA.length);

    let previousGold = D(0);

    for (const god of GOD_DATA) {
      expect(god.productionMultiplier).toBeGreaterThanOrEqual(1);

      const goldRequired = D(god.goldRequired);
      expect(goldRequired.gt(previousGold)).toBe(true);
      previousGold = goldRequired;
    }
  });

  it("mission catalog has one hundred unique ordered missions", () => {
    expect(MISSION_CATALOG).toHaveLength(MISSION_COUNT);
    expect(new Set(MISSION_IDS).size).toBe(MISSION_COUNT);

    for (let index = 0; index < MISSION_CATALOG.length; index++) {
      expect(MISSION_CATALOG[index]?.order).toBe(index + 1);
    }
  });

  it("every mission has a localized title key", () => {
    for (const mission of MISSION_CATALOG) {
      expect(hasMessageKey(`mission.${mission.id}.title`)).toBe(true);
    }
  });

  it("every mission objective type has a template key", () => {
    const objectiveTypes = new Set(
      MISSION_CATALOG.map((mission) => mission.objective.type)
    );

    for (const type of objectiveTypes) {
      expect(hasMessageKey(`mission.objective.${type}`)).toBe(true);
      expect(hasMessageKey(`mission.objective.a11y.${type}`)).toBe(true);
    }

    expect(hasMessageKey("mission.objective.goldLabel")).toBe(true);
  });

  it("mission rewards reference valid power-ups when present", () => {
    for (const mission of MISSION_CATALOG) {
      for (const reward of mission.rewards) {
        if (reward.type === "powerUp") {
          expect(POWER_UP_TYPES).toContain(reward.powerUpId);
        }
      }
    }
  });
});
