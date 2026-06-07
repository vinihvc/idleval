import { describe, expect, it } from "vitest";
import { GOD_COUNT } from "@/content/gods";
import {
  canInvokeGodAtIndex,
  getGodCardStatus,
  isGodInvocationComplete,
} from "@/game/gods";
import { D } from "@/utils/decimal";

describe("gods rules", () => {
  it("getGodCardStatus returns the four progression states", () => {
    expect(getGodCardStatus(0, 1)).toBe("completed");
    expect(getGodCardStatus(1, 1)).toBe("available");
    expect(getGodCardStatus(2, 1)).toBe("locked");
    expect(getGodCardStatus(3, 1)).toBe("future");
  });

  it("isGodInvocationComplete is true at god count", () => {
    expect(isGodInvocationComplete(GOD_COUNT)).toBe(true);
    expect(isGodInvocationComplete(GOD_COUNT - 1)).toBe(false);
  });

  it("canInvokeGodAtIndex only allows the next god with enough gold", () => {
    expect(canInvokeGodAtIndex(0, 0, D("1e12"))).toBe(true);
    expect(canInvokeGodAtIndex(1, 0, D("1e12"))).toBe(false);
    expect(canInvokeGodAtIndex(0, 0, D(1))).toBe(false);
    expect(canInvokeGodAtIndex(0, GOD_COUNT, D("1e12"))).toBe(false);
  });
});
