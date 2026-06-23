import { describe, expect, it } from "vitest";
import {
  D,
  deserializeDecimal,
  serializeDecimal,
  toDisplayNumber,
} from "@/utils/decimal";

describe("decimal", () => {
  it("serializeDecimal and deserializeDecimal round-trip values", () => {
    const value = D("123456789.5");
    const serialized = serializeDecimal(value);

    expect(typeof serialized).toBe("string");
    expect(deserializeDecimal(serialized).eq(value)).toBe(true);
  });

  it("deserializeDecimal accepts numbers", () => {
    expect(deserializeDecimal(42).toNumber()).toBe(42);
  });

  it("toDisplayNumber returns finite numbers for normal values", () => {
    expect(toDisplayNumber(D(123))).toBe(123);
    expect(Number.isFinite(toDisplayNumber(D("1000.5")))).toBe(true);
  });

  it("toDisplayNumber returns infinity for extremely large values", () => {
    expect(toDisplayNumber(D("1e400"))).toBe(Number.POSITIVE_INFINITY);
  });

  it("D returns the same Decimal instance when passed a Decimal", () => {
    const value = D(10);

    expect(D(value)).toBe(value);
  });
});
