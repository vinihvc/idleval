import { describe, expect, test } from "vitest";
import { FactoryGrid } from "@/components/layout/factory-grid";
import { FACTORY_TYPES } from "@/content/factories";
import { renderWithProviders } from "@/test/render-with-providers";

describe("FactoryGrid", () => {
  test("renders a card for each factory type", async () => {
    const screen = await renderWithProviders(<FactoryGrid />);

    const cards = screen.getByRole("article").elements();
    expect(cards.length).toBe(FACTORY_TYPES.length);
  });
});
