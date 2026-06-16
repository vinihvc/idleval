import { describe, expect, test } from "vitest";
import { GameStagePowerUp } from "@/components/ui/power-up/power-up";
import { store } from "@/providers/store";
import { initialInventoryState, inventoryAtom } from "@/store/atoms/inventory";
import { renderWithProviders } from "@/test/render-with-providers";

describe("GameStagePowerUp", () => {
  test("renders nothing when no power-up is active", async () => {
    await renderWithProviders(<GameStagePowerUp />);

    await expect
      .poll(() => document.querySelector('[data-slot="power-up"]'))
      .toBeNull();
  });

  test("shows countdown and status badge for timed power-up", async () => {
    const expiresAt = Date.now() + 90_000;

    store.set(inventoryAtom, {
      ...initialInventoryState,
      activePowerUp: {
        powerUpId: "hasteRune",
        tier: "common",
        expiresAt,
      },
    });

    const screen = await renderWithProviders(<GameStagePowerUp />);

    await expect
      .poll(() => document.querySelector('[data-slot="power-up-countdown"]'))
      .not.toBeNull();

    const statuses = screen.getByRole("status").elements();
    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses[0]?.getAttribute("aria-label") ?? "").toContain("left");
  });
});
