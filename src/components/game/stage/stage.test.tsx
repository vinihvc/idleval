import { describe, expect, test } from "vitest";
import { GameStage } from "@/components/game/stage/stage";
import { store } from "@/providers/store";
import {
  initialInventoryState,
  inventoryAtom,
} from "@/store/atoms/inventory";
import { renderWithProviders } from "@/test/render-with-providers";

describe("GameStage", () => {
  test("renders stage section landmark", async () => {
    await renderWithProviders(<GameStage />);

    await expect
      .poll(() => document.querySelector('[data-slot="game-stage"]'))
      .not.toBeNull();
  });

  test("shows power-up countdown when a relic is active", async () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      activePowerUp: {
        powerUpId: "auroraDust",
        tier: "common",
        expiresAt: Date.now() + 60_000,
        ghostCandleFactory: null,
      },
    });

    await renderWithProviders(<GameStage />);

    const stage = document.querySelector('[data-slot="game-stage"]');

    await expect
      .poll(() =>
        stage?.querySelector('[data-slot="power-up-countdown"]')
      )
      .not.toBeNull();
  });
});
