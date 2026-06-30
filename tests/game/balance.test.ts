import { describe, expect, it } from "vitest";
import { BALANCE_BASELINE } from "@/config/balance";
import { FACTORY_DATA } from "@/content/factories";
import {
  getScaledBaseBuyCost,
  getScaledFactoryConfig,
  getScaledGodGoldRequired,
  getScaledProductionTime,
  getScaledProductionValue,
  getScaledUnlockPrice,
} from "@/game/balance";
import { D } from "@/utils/decimal";

describe("balance", () => {
  it("scales grain factory config from baseline values", () => {
    const raw = FACTORY_DATA.grain;
    const scaled = getScaledFactoryConfig("grain");

    expect(scaled.productionValue).toBe(
      getScaledProductionValue(raw.productionValue)
    );
    expect(scaled.productionTime).toBe(
      getScaledProductionTime(raw.productionTime)
    );
    expect(scaled.baseBuyCost).toBe(getScaledBaseBuyCost(raw.baseBuyCost));
    expect(scaled.unlockPrice).toBe(getScaledUnlockPrice(raw.unlockPrice));
  });

  it("scales wine unlock price by baseline multiplier", () => {
    expect(getScaledUnlockPrice(55_000)).toBe(
      Math.round(55_000 * BALANCE_BASELINE.unlockPrice)
    );
  });

  it("scales god gold thresholds", () => {
    expect(getScaledGodGoldRequired("1e12")).toBe(
      D("1e12").times(BALANCE_BASELINE.godGoldRequired).toString()
    );
  });

  it("scales production time inversely with difficulty", () => {
    expect(getScaledProductionTime(10, 1.2)).toBe(
      Math.max(1, Math.round((10 * BALANCE_BASELINE.productionTime) / 1.2))
    );
  });
});
