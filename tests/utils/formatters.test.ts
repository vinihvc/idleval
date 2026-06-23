import { describe, expect, it } from "vitest";
import { D } from "@/utils/decimal";
import {
  amountFormatter,
  amountFormatterWithDolarSign,
  capitalize,
  countdownFormatter,
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
    expect(amountFormatter(1500)).toBe("1.5 K");
  });

  it("formats millions with M suffix", () => {
    expect(amountFormatter(D("2500000"))).toBe("2.5 M");
  });

  it("returns infinity symbol above threshold", () => {
    expect(amountFormatter(D("1e200"))).toBe("∞");
  });

  it("amountFormatterWithDolarSign prefixes dollar sign", () => {
    expect(amountFormatterWithDolarSign(1500)).toBe("$1.5 K");
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
    expect(timeFormatter(66.381)).toBe("1:07");
  });

  it("countdownFormatter formats hours, minutes, and seconds", () => {
    expect(countdownFormatter(45_000)).toBe("0:00:45");
    expect(countdownFormatter(125_000)).toBe("0:02:05");
    expect(countdownFormatter(3_600_000)).toBe("1:00:00");
    expect(countdownFormatter(66_381)).toBe("0:01:07");
  });

  it("formatElapsedDuration formats seconds, minutes, hours, and days", () => {
    expect(formatElapsedDuration(45_000)).toBe("45s");
    expect(formatElapsedDuration(125_000)).toBe("2m 5s");
    expect(formatElapsedDuration(3_600_000)).toBe("1h");
    expect(formatElapsedDuration(86_400_000)).toBe("1d");
  });
});
