import { describe, expect, it } from "vitest";
import { getActivePowerUpDisplayState } from "@/game/power-ups";

describe("game-stage power-up display", () => {
  it("returns null display state when nothing is active", () => {
    expect(
      getActivePowerUpDisplayState({
        activePowerUp: null,
        pendingCauldronDrop: false,
      })
    ).toBeNull();
  });
});
