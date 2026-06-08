import { describe, expect, test } from "vitest";
import { SettingsReset } from "@/components/dialog/settings/settings-reset";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("SettingsReset", () => {
  test("renders reset hold button", async () => {
    const screen = await renderWithProviders(
      <SettingsReset onResetComplete={() => undefined} />
    );

    await expect
      .element(
        screen.getByRole("button", { name: m["ui.settings.resetHold"]() })
      )
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.settings.reset"]()))
      .toBeInTheDocument();
  });
});
