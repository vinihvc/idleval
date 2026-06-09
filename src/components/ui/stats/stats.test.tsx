import { describe, expect, test } from "vitest";
import { StatRow, StatTile } from "@/components/ui/stats";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Stats", () => {
  test("renders stat row", async () => {
    const screen = await renderWithProviders(
      <StatRow label="Gold earned">1.23K</StatRow>
    );

    await expect.element(screen.getByText("Gold earned")).toBeInTheDocument();
    await expect.element(screen.getByText("1.23K")).toBeInTheDocument();
  });

  test("renders stat row with variant", async () => {
    const screen = await renderWithProviders(
      <StatRow label="Gold earned" variant="green">
        1.23K
      </StatRow>
    );

    await expect.element(screen.getByText("Gold earned")).toBeInTheDocument();
    await expect
      .element(
        screen
          .getByText("Gold earned")
          .element()
          .closest("[data-slot=stat-row]") as HTMLElement | null
      )
      .toHaveAttribute("data-variant", "green");
  });

  test("renders stat tile with default cream variant", async () => {
    const screen = await renderWithProviders(
      <StatTile icon={<span aria-hidden>★</span>} label="Total runs">
        42
      </StatTile>
    );

    await expect.element(screen.getByText("42")).toBeInTheDocument();
    await expect
      .element(
        screen
          .getByText("42")
          .element()
          .closest("[data-slot=stat-tile]") as HTMLElement | null
      )
      .toHaveAttribute("data-variant", "cream");
  });
});
