import { describe, expect, test } from "vitest";
import { GameShell } from "@/components/game/shell";
import { renderWithProviders } from "@/test/render-with-providers";

describe("GameShell", () => {
  test("renders children", async () => {
    const screen = await renderWithProviders(
      <GameShell>
        <p>Game content</p>
      </GameShell>
    );

    await expect.element(screen.getByText("Game content")).toBeInTheDocument();
  });
});
