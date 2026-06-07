import { describe, expect, it } from "vitest";
import { D } from "@/utils/decimal";
import {
  amountFormatter,
  amountFormatterWithDolarSign,
  capitalize,
  formatElapsedDuration,
  suffixAmountFormatter,
  timeFormatter,
} from "@/utils/formatters";

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

  it("amountFormatterWithDolarSign prefixes dollar sign", () => {
    expect(amountFormatterWithDolarSign(1500)).toBe("$1.5K");
  });

  it("suffixAmountFormatter returns suffix only", () => {
    expect(suffixAmountFormatter(1500)).toBe("K");
    expect(suffixAmountFormatter(500)).toBe("");
  });

  it("capitalize uppercases the first letter", () => {
    expect(capitalize("grain")).toBe("Grain");
  });

  it("timeFormatter formats minutes and seconds", () => {
    expect(timeFormatter(120)).toBe("2:00");
    expect(timeFormatter(65)).toBe("1:05");
  });

  it("formatElapsedDuration formats seconds, minutes, hours, and days", () => {
    expect(formatElapsedDuration(45_000)).toBe("45s");
    expect(formatElapsedDuration(125_000)).toBe("2m 5s");
    expect(formatElapsedDuration(3_600_000)).toBe("1h");
    expect(formatElapsedDuration(86_400_000)).toBe("1d");
  });
});
