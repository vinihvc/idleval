import { describe, expect, it } from "vitest";
import { D } from "@/utils/decimal";
import { amountFormatter } from "@/utils/formatters";

describe("formatters", () => {
  it("formats small values without suffix", () => {
    expect(amountFormatter(0)).toBe("0");
    expect(amountFormatter(999)).toBe("999");
  });

  it("formats thousands with K suffix", () => {
    expect(amountFormatter(1500)).toBe("1.5K");
  });

  it("formats millions with M suffix", () => {
    expect(amountFormatter(D("2500000"))).toBe("2.5M");
  });

  it("returns infinity symbol above threshold", () => {
    expect(amountFormatter(D("1e200"))).toBe("∞");
  });
});
