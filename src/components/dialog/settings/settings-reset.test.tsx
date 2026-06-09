import { beforeEach, describe, expect, test, vi } from "vitest";
import { SettingsReset } from "@/components/dialog/settings/settings-reset";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { walletAtom } from "@/store/atoms/wallet";
import { seedFactory, seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";
import { deserializeDecimal } from "@/utils/decimal";

const HOLD_DURATION_MS = 3400;

describe("SettingsReset", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  test("renders hold-to-reset button with i18n labels", async () => {
    const screen = await renderWithProviders(<SettingsReset />);

    await expect
      .element(
        screen.getByRole("button", { name: m["ui.settings.resetHold"]() })
      )
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.settings.reset"]()))
      .toBeInTheDocument();
  });

  test("resets game progress after hold completes", async () => {
    vi.useFakeTimers();
    seedGold(10_000);
    seedFactory("grain", { isUnlocked: true, amount: 5, isUpgraded: true });

    const screen = await renderWithProviders(<SettingsReset />);

    const resetButton = screen.getByRole("button", {
      name: m["ui.settings.resetHold"](),
    });

    resetButton
      .element()
      .dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    await vi.advanceTimersByTimeAsync(HOLD_DURATION_MS);

    expect(deserializeDecimal(store.get(walletAtom).gold).toNumber()).toBe(0);
    expect(store.get(factoriesAtom).grain.amount).toBe(1);
    expect(store.get(factoriesAtom).grain.isUpgraded).toBe(false);

    vi.useRealTimers();
  });
});
