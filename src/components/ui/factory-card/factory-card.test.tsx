import { describe, expect, test } from "vitest";
import { FactoryCard } from "@/components/ui/factory-card";
import { m } from "@/i18n/messages";
import { seedFactory, seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

describe("FactoryCard", () => {
  test("renders unlocked grain factory", async () => {
    const screen = await renderWithProviders(<FactoryCard type="grain" />);

    const card = screen.getByRole("article");
    await expect.element(card).toHaveAttribute("data-unlocked", "true");
    await expect.element(card).toHaveAttribute("data-slot", "factory-card");
  });

  test("renders locked factory", async () => {
    const screen = await renderWithProviders(<FactoryCard type="wine" />);

    await expect
      .element(screen.getByRole("article"))
      .toHaveAttribute("data-locked", "true");
  });

  test("starts production on produce click", async () => {
    const screen = await renderWithProviders(<FactoryCard type="grain" />);

    const produceLabel = m["ui.factoryCard.produce"]({ name: "Grain" });
    await screen.getByRole("button", { name: produceLabel }).click();

    await expect
      .element(screen.getByRole("article"))
      .toHaveAttribute("data-producing", "true");
  });

  test("enables upgrade when affordable", async () => {
    seedGold(1_000_000);
    seedFactory("grain", { isUnlocked: true, amount: 1 });

    const screen = await renderWithProviders(<FactoryCard type="grain" />);

    await expect
      .element(
        screen.getByRole("button", {
          name: new RegExp(m["ui.factoryCard.buy"]()),
        })
      )
      .not.toBeDisabled();
  });
});
