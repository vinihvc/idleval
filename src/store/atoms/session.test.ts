import { beforeEach, describe, expect, it } from "vitest";
import { store } from "@/providers/store";
import { resetGame } from "@/store/reset";
import { getLastSeenAt, sessionAtom, touchLastSeen } from "./session";

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
});
