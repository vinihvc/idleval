import { beforeEach, describe, expect, test } from "vitest";
import { FactoryCard } from "@/components/game/factory-card";
import { FACTORY_DATA } from "@/content/factories";
import { getFactoryEarnPerCycle } from "@/game/factories";
import { m } from "@/i18n/messages";
import { getTotalEarnPerCycle } from "@/store/atoms/factory-earn";
import { getPowerUpIncomeMultiplierForEarn } from "@/store/atoms/inventory";
import { getFactoryProgressDifficulty } from "@/store/atoms/progress-ease";
import { resetGame } from "@/store/reset";
import { seedFactory, seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";
import { D } from "@/utils/decimal";
import { amountFormatterWithDolarSign } from "@/utils/formatters";

describe("FactoryCard", () => {
  beforeEach(() => {
    resetGame();
  });

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

  test("shows one-unit earnings on sealed factory", async () => {
    const expectedEarn = amountFormatterWithDolarSign(
      getFactoryEarnPerCycle({
        amount: 1,
        factoryDifficulty: getFactoryProgressDifficulty(),
        godsProductionMultiplier: D(1),
        isUpgraded: false,
        productionValue: FACTORY_DATA.wine.productionValue,
      }).times(getPowerUpIncomeMultiplierForEarn())
    );

    const screen = await renderWithProviders(<FactoryCard type="wine" />);

    await expect.element(screen.getByText(expectedEarn)).toBeInTheDocument();
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

  test("updates progress bar earnings after buying a unit", async () => {
    seedGold(1_000_000);
    seedFactory("grain", { isUnlocked: true, amount: 2 });

    const earnBefore = amountFormatterWithDolarSign(
      getTotalEarnPerCycle("grain", { amount: 2 })
    );
    const earnAfter = amountFormatterWithDolarSign(
      getTotalEarnPerCycle("grain", { amount: 3 })
    );

    const screen = await renderWithProviders(<FactoryCard type="grain" />);

    await expect.element(screen.getByText(earnBefore)).toBeInTheDocument();

    await screen
      .getByRole("button", {
        name: new RegExp(m["ui.factoryCard.buy"]()),
      })
      .click();

    await expect.element(screen.getByText(earnAfter)).toBeInTheDocument();
    expect(screen.getByText(earnBefore).elements()).toHaveLength(0);
  });

  test("opens factory ledger dialog", async () => {
    const screen = await renderWithProviders(<FactoryCard type="grain" />);

    await screen
      .getByRole("button", {
        name: m["ui.factoryCard.ledger"]({ name: "Grain" }),
      })
      .click();

    await expect
      .poll(() =>
        screen
          .getByRole("heading", { name: "Grain" })
          .elements()
          .some((element) => element.tagName === "H2")
      )
      .toBe(true);
  });
});
