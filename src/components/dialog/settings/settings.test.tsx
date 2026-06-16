import { describe, expect, test } from "vitest";
import { SettingsDialog } from "@/components/dialog/settings/settings";
import { Button } from "@/components/ui/button";
import { m } from "@/i18n/messages";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { openDialog } from "@/test/component-helpers";
import { renderWithProviders } from "@/test/render-with-providers";

const renderSettingsDialog = () =>
  renderWithProviders(
    <>
      <Button onClick={() => toggleDialog(DIALOG_IDS.settings)}>
        {m["ui.settings.open"]()}
      </Button>
      <SettingsDialog />
    </>
  );

describe("SettingsDialog", () => {
  test("opens and shows sections", async () => {
    const screen = await renderSettingsDialog();

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
  });
});
