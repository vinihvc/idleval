import { describe, expect, it } from "vitest";
import {
  getVisibleResumeAction,
  shouldHeartbeatTouchLastSeen,
  shouldRunOnTabVisible,
} from "./use-offline-earning";

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

describe("getVisibleResumeAction", () => {
  it("touches lastSeenAt for a normal visible heartbeat", () => {
    expect(
      getVisibleResumeAction({
        isVisible: true,
        lastSeenAt: 1000,
        now: 61_000,
      })
    ).toBe("touch");
  });

  it("applies offline earning before touching lastSeenAt after a delayed heartbeat", () => {
    expect(
      getVisibleResumeAction({
        isVisible: true,
        lastSeenAt: 1000,
        now: 120_000,
      })
    ).toBe("apply");
  });

  it("ignores hidden pages", () => {
    expect(
      getVisibleResumeAction({
        isVisible: false,
        lastSeenAt: 1000,
        now: 120_000,
      })
    ).toBe("ignore");
  });

  it("does not apply offline earning when lastSeenAt is missing", () => {
    expect(
      getVisibleResumeAction({
        isVisible: true,
        lastSeenAt: null,
        now: 120_000,
      })
    ).toBe("touch");
  });

  it("does not apply offline earning when lastSeenAt is in the future", () => {
    expect(
      getVisibleResumeAction({
        isVisible: true,
        lastSeenAt: 120_000,
        now: 1000,
      })
    ).toBe("touch");
  });
});
