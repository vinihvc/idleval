import { describe, expect, test } from "vitest";
import { UpgradesCard } from "@/components/dialog/upgrades/upgrades.card";
import { seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

describe("UpgradesCard", () => {
  test("shows lock overlay and cost for locked factory", async () => {
    const screen = await renderWithProviders(
      <UpgradesCard factoryType="wine" />
    );

    await expect
      .element(screen.getByRole("button"))
      .toHaveAttribute("data-sealed", "charter");
    await expect
      .element(screen.getByRole("button"))
      .toHaveAttribute("data-locked", "true");
    await expect.element(screen.getByText("1.13 M")).toBeInTheDocument();
    await expect
      .poll(() =>
        screen
          .getByRole("button")
          .element()
          .querySelector('img[src*="factories/wine"]')
      )
      .not.toBeNull();
  });

  test("shows masked affordable card with cost overlay", async () => {
    seedGold(1_000_000);

    const screen = await renderWithProviders(
      <UpgradesCard factoryType="grain" />
    );

    await expect
      .element(screen.getByRole("button"))
      .toHaveAttribute("data-sealed", "open");
    await expect
      .element(screen.getByRole("button"))
      .toHaveAttribute("data-affordable", "true");
    await expect
      .element(screen.getByRole("button"))
      .toHaveAttribute("data-masked", "true");
    await expect.element(screen.getByText("75 K")).toBeInTheDocument();
    await expect
      .poll(() =>
        screen
          .getByRole("button")
          .element()
          .querySelector('img[src*="factories/grain"]')
      )
      .not.toBeNull();
  });
});
