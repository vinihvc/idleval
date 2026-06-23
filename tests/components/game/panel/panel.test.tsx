import { describe, expect, test } from "vitest";
import { GamePanel } from "@/components/game/panel";
import { renderWithProviders } from "@/test/render-with-providers";

describe("GamePanel", () => {
  test("renders children with data-slot", async () => {
    const screen = await renderWithProviders(
      <GamePanel>
        <p>Panel content</p>
      </GamePanel>
    );

    await expect.element(screen.getByText("Panel content")).toBeInTheDocument();
  });
});
