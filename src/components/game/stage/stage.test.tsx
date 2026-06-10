import { describe, expect, test } from "vitest";
import { Characters } from "@/components/characters";
import { GameStage } from "@/components/game/stage/stage";
import { store } from "@/providers/store";
import { initialInventoryState, inventoryAtom } from "@/store/atoms/inventory";
import { renderWithProviders } from "@/test/render-with-providers";

describe("GameStage", () => {
  test("renders stage section landmark", async () => {
    await renderWithProviders(<GameStage />);

    await expect
      .poll(() => document.querySelector('[data-slot="game-stage"]'))
      .not.toBeNull();
  });

  test("renders the characters sprite in the stage", async () => {
    await renderWithProviders(
      <GameStage>
        <Characters
          imagePath="/images/pets/characters-32"
          instructions={[{ duration: 100, type: "wait" }]}
        />
      </GameStage>
    );

    await expect
      .poll(() =>
        document.querySelector('[data-slot="game-stage"] [role="img"]')
      )
      .toBeDefined();

    const sprite = document.querySelector(
      '[data-slot="game-stage"] [role="img"]'
    );
    const element = sprite as HTMLElement;

    expect(element.style.width).toBe("32px");
    expect(element.style.height).toBe("32px");
    expect(element.style.backgroundImage).toContain("characters-32");
  });

  test("passes custom image paths to the stage character", async () => {
    await renderWithProviders(
      <Characters
        imagePath="/images/pets/example-character"
        instructions={[{ duration: 100, type: "wait" }]}
      />
    );

    await expect
      .poll(() => document.querySelector('[role="img"]'))
      .toBeDefined();

    const sprite = document.querySelector('[role="img"]') as HTMLElement;

    expect(sprite.style.backgroundImage).toContain(
      "/images/pets/example-character/idle.png"
    );
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
      .poll(() => stage?.querySelector('[data-slot="power-up-countdown"]'))
      .not.toBeNull();
  });
});
