import { describe, expect, test } from "vitest";
import { SettingsDialog } from "@/components/dialog/settings/settings";
import { m } from "@/i18n/messages";
import { openDialog } from "@/test/component-helpers";
import { renderWithProviders } from "@/test/render-with-providers";

describe("SettingsDialog", () => {
  test("opens and shows sections", async () => {
    const screen = await renderWithProviders(<SettingsDialog />);

    await openDialog(screen, m["ui.settings.open"]());

    await expect
      .element(screen.getByRole("heading", { name: m["ui.settings.title"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.settings.music"]()))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.settings.reset"]()))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: m["ui.wiki.open"]() }))
      .toBeInTheDocument();
  });

  test.skip("opens wiki and closes settings", async () => {
    const screen = await renderWithProviders(<SettingsDialog />);

    await openDialog(screen, m["ui.settings.open"]());

    await screen.getByRole("button", { name: m["ui.wiki.open"]() }).click();

    await expect
      .poll(
        () =>
          screen.getByRole("heading", { name: m["ui.wiki.title"]() }).elements()
            .length
      )
      .toBeGreaterThan(0);
    await expect
      .poll(
        () =>
          screen
            .getByRole("heading", { name: m["ui.settings.title"]() })
            .elements().length
      )
      .toBe(0);
  });
});
