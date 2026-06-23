import { describe, expect, test } from "vitest";
import { ManagersCard } from "@/components/dialog/managers/managers.card";
import { getLocalizedFactory } from "@/content/factories";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { getFactory } from "@/store/atoms/factories";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { seedFactory, seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

describe("ManagersCard", () => {
  test("shows charter sealed state for locked factory", async () => {
    const wineManager = getLocalizedFactory("wine").manager;

    const screen = await renderWithProviders(
      <ManagersCard factoryType="wine" />
    );

    const card = screen.getByRole("button", {
      name: `${wineManager.name}. ${m["ui.common.charterRequired"]()}`,
    });

    await expect.element(card).toHaveAttribute("data-sealed", "charter");
    await expect.element(card).toHaveAttribute("data-locked", "true");
  });

  test("shows insufficient gold when unlocked but unaffordable", async () => {
    const grainManager = getLocalizedFactory("grain").manager;
    seedFactory("grain", { isUnlocked: true, amount: 1 });
    seedGold(0);

    const screen = await renderWithProviders(
      <ManagersCard factoryType="grain" />
    );

    const card = screen.getByRole("button", {
      name: m["ui.common.insufficientGold"]({ 0: grainManager.name }),
    });

    await expect.element(card).toHaveAttribute("aria-disabled", "true");
    await expect.element(card).not.toHaveAttribute("data-affordable", "true");
  });

  test("purchases manager when affordable", async () => {
    const grainManager = getLocalizedFactory("grain").manager;
    const { managerCost: cost } = getFactory("grain");
    seedFactory("grain", { isUnlocked: true, amount: 1 });
    seedGold(cost.toNumber() + 1000);

    const screen = await renderWithProviders(
      <ManagersCard factoryType="grain" />
    );

    const card = screen.getByRole("button", {
      name: `${m["ui.managers.appoint"]()} ${grainManager.name}`,
    });

    await expect.element(card).toHaveAttribute("data-sealed", "open");
    await expect.element(card).toHaveAttribute("data-affordable", "true");

    await card.click();

    expect(store.get(factoriesAtom).grain.isAutomated).toBe(true);
  });

  test("shows completed state when manager is already appointed", async () => {
    const grainManager = getLocalizedFactory("grain").manager;
    seedFactory("grain", {
      isUnlocked: true,
      amount: 1,
      isAutomated: true,
    });

    const screen = await renderWithProviders(
      <ManagersCard factoryType="grain" />
    );

    const card = screen.getByRole("button", {
      name: m["ui.common.completed"]({ 0: grainManager.name }),
    });

    await expect.element(card).toHaveAttribute("data-complete", "true");
    await expect.element(card).toHaveAttribute("aria-disabled", "true");
  });
});
