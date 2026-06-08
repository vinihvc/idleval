import { describe, expect, it } from "vitest";
import {
  shouldApplyOfflineOnVisibilityChange,
  shouldHeartbeatTouchLastSeen,
} from "@/hooks/use-session-sync";

describe("shouldApplyOfflineOnVisibilityChange", () => {
  it("returns false on first render (null → true)", () => {
    expect(shouldApplyOfflineOnVisibilityChange(null, true)).toBe(false);
  });

  it("returns false when tab becomes hidden (true → false)", () => {
    expect(shouldApplyOfflineOnVisibilityChange(true, false)).toBe(false);
  });

  it("returns true when tab regains focus (false → true)", () => {
    expect(shouldApplyOfflineOnVisibilityChange(false, true)).toBe(true);
  });

  it("returns false when visibility stays visible (true → true)", () => {
    expect(shouldApplyOfflineOnVisibilityChange(true, true)).toBe(false);
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
