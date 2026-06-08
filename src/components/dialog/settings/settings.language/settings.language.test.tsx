import { describe, expect, test } from "vitest";
import { LOCALE_LABELS } from "@/i18n/locale";
import { renderWithProviders } from "@/test/render-with-providers";
import { SettingsLanguage } from "./settings.language";

describe("SettingsLanguage", () => {
  test("renders all locale options", async () => {
    const screen = await renderWithProviders(<SettingsLanguage />);

    await expect
      .element(screen.getByText(LOCALE_LABELS.en))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(LOCALE_LABELS.es))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(LOCALE_LABELS.pt))
      .toBeInTheDocument();
  });

  test("selects a different locale on click", async () => {
    const screen = await renderWithProviders(<SettingsLanguage />);

    const portuguese = screen.getByText(LOCALE_LABELS.pt);
    await portuguese.click();

    await expect.element(portuguese).toHaveAttribute("data-state", "on");
  });

  test("updates UI strings when locale changes", async () => {
    const screen = await renderWithProviders(<SettingsLanguage />);

    await screen.getByText(LOCALE_LABELS.es).click();

    await expect
      .element(screen.getByText("Idioma", { exact: true }).first())
      .toBeInTheDocument();
  });
});
