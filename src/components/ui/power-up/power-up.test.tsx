import { describe, expect, test } from "vitest";
import { GameStagePowerUp } from "@/components/ui/power-up/power-up";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import {
  initialInventoryState,
  inventoryAtom,
} from "@/store/atoms/inventory";
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
        powerUpId: "auroraDust",
        tier: "common",
        expiresAt,
        ghostCandleFactory: null,
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

  test("shows cauldron pending label when harvest boost is queued", async () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      pendingCauldronDrop: true,
    });

    const screen = await renderWithProviders(<GameStagePowerUp />);

    await expect
      .element(
        screen.getByRole("status", {
          name: m["ui.powerUp.cauldronPending"](),
        })
      )
      .toBeInTheDocument();
  });
});
