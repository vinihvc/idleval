import { beforeEach, describe, expect, test } from "vitest";
import { GameSectionDialogs } from "@/components/layout/game-section-dialogs";
import { Header } from "@/components/layout/header/header";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { initialInventoryState, inventoryAtom } from "@/store/atoms/inventory";
import { resetGame } from "@/store/reset";
import { seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

const POWER_UP_LEFT_BUTTON = /left/i;

describe("Header", () => {
  beforeEach(() => {
    resetGame();
  });

  test("renders gold amount and navigation", async () => {
    seedGold(500);

    const screen = await renderWithProviders(
      <>
        <Header />
        <GameSectionDialogs />
      </>
    );

    await expect.element(screen.getByText("$500")).toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.playerLevel.label"]({ level: "1" })))
      .toBeInTheDocument();
    await expect
      .poll(() => screen.container.querySelector('[data-slot="progress"]'))
      .not.toBeNull();
    await expect
      .element(screen.getByRole("button", { name: m["ui.nav.upgrades"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: m["ui.nav.daily"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: m["ui.settings.open"]() }))
      .toBeInTheDocument();
  });

  test("opens header dialogs from their triggers", async () => {
    const screen = await renderWithProviders(<Header />);

    await screen.getByRole("button", { name: m["ui.settings.open"]() }).click();
    await expect
      .element(screen.getByRole("heading", { name: m["ui.settings.title"]() }))
      .toBeInTheDocument();

    await screen
      .getByRole("button", { name: m["ui.statistics.title"]() })
      .click();
    await expect
      .element(
        screen.getByRole("heading", { name: m["ui.statistics.title"]() })
      )
      .toBeInTheDocument();

    await screen.getByRole("button", { name: m["ui.nav.daily"]() }).click();
    await expect
      .element(screen.getByRole("heading", { name: m["ui.daily.title"]() }))
      .toBeInTheDocument();
  });

  test("shows power-up countdown when a relic is active", async () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      activePowerUp: {
        powerUpId: "hasteRune",
        tier: "common",
        expiresAt: Date.now() + 60_000,
      },
    });

    const screen = await renderWithProviders(<Header />);

    await expect
      .poll(() => document.querySelector('[data-slot="power-up-badge"]'))
      .not.toBeNull();

    await screen.getByRole("button", { name: POWER_UP_LEFT_BUTTON }).click();

    await expect
      .poll(() => document.querySelector('[data-slot="power-up-countdown"]'))
      .not.toBeNull();
  });
});
