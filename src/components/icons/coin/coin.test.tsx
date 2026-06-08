import { describe, expect, test } from "vitest";
import { renderWithProviders } from "@/test/render-with-providers";
import { Coin } from "./coin";

describe("Coin", () => {
  test("renders hidden svg", async () => {
    const screen = await renderWithProviders(
      <div data-testid="coin-icon">
        <Coin />
      </div>
    );

    const svg = screen.getByTestId("coin-icon").element().querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });
});
