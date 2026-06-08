import { describe, expect, it } from "vitest";
import {
  shouldHeartbeatTouchLastSeen,
  shouldRunOnTabVisible,
} from "@/hooks/use-offline-bootstrap";

describe("shouldRunOnTabVisible", () => {
  it("returns false on first render (null → true)", () => {
    expect(shouldRunOnTabVisible(null, true)).toBe(false);
  });

  it("returns false when tab becomes hidden (true → false)", () => {
    expect(shouldRunOnTabVisible(true, false)).toBe(false);
  });

  it("returns true when tab regains focus (false → true)", () => {
    expect(shouldRunOnTabVisible(false, true)).toBe(true);
  });

  it("returns false when visibility stays visible (true → true)", () => {
    expect(shouldRunOnTabVisible(true, true)).toBe(false);
  });
});

describe("shouldHeartbeatTouchLastSeen", () => {
  it("returns true when tab is visible", () => {
    expect(shouldHeartbeatTouchLastSeen(true)).toBe(true);
  });

  it("returns false when tab is hidden", () => {
    expect(shouldHeartbeatTouchLastSeen(false)).toBe(false);
  });
});
