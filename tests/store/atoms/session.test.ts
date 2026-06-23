import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { store } from "@/providers/store";
import { resetGame } from "@/store/reset";
import {
  getLastSeenAt,
  isDocumentVisible,
  sessionAtom,
  touchLastSeen,
  touchLastSeenIfVisible,
} from "./session";

describe("session", () => {
  beforeEach(() => {
    resetGame();
  });

  it("touchLastSeen uses Date.now by default", () => {
    const before = Date.now();
    touchLastSeen();
    const after = Date.now();
    const lastSeenAt = getLastSeenAt();

    expect(lastSeenAt).not.toBeNull();
    expect(lastSeenAt).toBeGreaterThanOrEqual(before);
    expect(lastSeenAt).toBeLessThanOrEqual(after);
    expect(store.get(sessionAtom).lastSeenAt).toBe(lastSeenAt);
  });

  it("touchLastSeen accepts an explicit timestamp", () => {
    touchLastSeen(1_234_567);

    expect(getLastSeenAt()).toBe(1_234_567);
  });

  describe("touchLastSeenIfVisible", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("does not update lastSeenAt when document is hidden", () => {
      touchLastSeen(1000);
      vi.stubGlobal("document", {
        visibilityState: "hidden",
      });

      touchLastSeenIfVisible(9999);

      expect(getLastSeenAt()).toBe(1000);
    });

    it("updates lastSeenAt when document is visible", () => {
      touchLastSeen(1000);
      vi.stubGlobal("document", {
        visibilityState: "visible",
      });

      touchLastSeenIfVisible(9999);

      expect(getLastSeenAt()).toBe(9999);
    });
  });

  describe("isDocumentVisible", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("returns true when document is undefined", () => {
      vi.stubGlobal("document", undefined);

      expect(isDocumentVisible()).toBe(true);
    });

    it("returns false when visibilityState is hidden", () => {
      vi.stubGlobal("document", {
        visibilityState: "hidden",
      });

      expect(isDocumentVisible()).toBe(false);
    });
  });
});
