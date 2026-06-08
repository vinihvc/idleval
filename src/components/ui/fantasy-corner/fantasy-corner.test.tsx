import { describe, expect, test } from "vitest";
import { FantasyCorner } from "@/components/ui/fantasy-corner";
import { renderWithProviders } from "@/test/render-with-providers";

describe("FantasyCorner", () => {
  test("renders FantasyCorner", async () => {
    const screen = await renderWithProviders(
      <div className="relative size-20" data-testid="corner">
        <FantasyCorner position="tl" />
      </div>
    );

    expect(
      screen.getByTestId("corner").element().querySelector("svg")
    ).not.toBeNull();
  });
});
