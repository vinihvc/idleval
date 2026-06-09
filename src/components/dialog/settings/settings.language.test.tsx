import { describe, expect, test } from "vitest";
import { SettingsLanguage } from "@/components/dialog/settings/settings.language";
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/i18n/locale";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { settingsAtom } from "@/store/atoms/settings";
import { renderWithProviders } from "@/test/render-with-providers";

describe("SettingsLanguage", () => {
  test("renders locale toggle group with all supported locales", async () => {
    const screen = await renderWithProviders(<SettingsLanguage />);

    await expect
      .element(
        screen.getByRole("group", { name: m["ui.settings.language"]() })
      )
      .toBeInTheDocument();

    for (const locale of SUPPORTED_LOCALES) {
      await expect
        .element(screen.getByRole("radio", { name: LOCALE_LABELS[locale] }))
        .toBeInTheDocument();
    }
  });

  test("updates persisted locale when selecting another language", async () => {
    const screen = await renderWithProviders(<SettingsLanguage />);

    await screen.getByRole("radio", { name: LOCALE_LABELS.es }).click();

    expect(store.get(settingsAtom).locale).toBe("es");
  });
});
