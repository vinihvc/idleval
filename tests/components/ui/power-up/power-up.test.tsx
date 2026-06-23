import { describe, expect, test } from "vitest";
import { GameStagePowerUp } from "@/components/ui/power-up/power-up";
import { getLocalizedPowerUp } from "@/content/power-ups";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { initialInventoryState, inventoryAtom } from "@/store/atoms/inventory";
import { renderWithProviders } from "@/test/render-with-providers";

const POWER_UP_LEFT_BUTTON = /left/i;

describe("GameStagePowerUp", () => {
  test("renders nothing when no power-up is active", async () => {
    await renderWithProviders(<GameStagePowerUp />);

    await expect
      .poll(() => document.querySelector('[data-slot="power-up"]'))
      .toBeNull();
  });

  test("shows countdown inside tooltip for timed power-up", async () => {
    const expiresAt = Date.now() + 90_000;

    store.set(inventoryAtom, {
      ...initialInventoryState,
      activePowerUp: {
        powerUpId: "hasteRune",
        tier: "common",
        expiresAt,
      },
    });

    const screen = await renderWithProviders(<GameStagePowerUp />);

    await expect
      .poll(() => document.querySelector('[data-slot="power-up-badge"]'))
      .not.toBeNull();

    const trigger = screen.getByRole("button", { name: POWER_UP_LEFT_BUTTON });
    await trigger.click();

    await expect
      .poll(() => document.querySelector('[data-slot="power-up-countdown"]'))
      .not.toBeNull();

    await expect
      .element(screen.getByRole("heading", { level: 3 }))
      .toHaveTextContent(getLocalizedPowerUp("hasteRune").name);

    await expect
      .element(screen.getByText(getLocalizedPowerUp("hasteRune").description))
      .toBeInTheDocument();

    await expect
      .element(screen.getByText(m["ui.powerUp.countdownLabel"]()))
      .toBeInTheDocument();
  });
});
