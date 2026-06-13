import { describe, expect, test } from "vitest";
import { AboutDialog } from "@/components/dialog/about/about";
import { m } from "@/i18n/messages";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { renderWithProviders } from "@/test/render-with-providers";

describe("AboutDialog", () => {
  test("shows about content when opened", async () => {
    const screen = await renderWithProviders(
      <>
        <button onClick={() => toggleDialog(DIALOG_IDS.about)} type="button">
          Open about
        </button>
        <AboutDialog />
      </>
    );

    await screen.getByText("Open about").click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.about.title"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.about.codex"]()))
      .toBeInTheDocument();
  });
});
