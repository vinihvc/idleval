import { describe, expect, test } from "vitest";
import { StatisticsDialog } from "@/components/dialog/statistics/statistics";
import { m } from "@/i18n/messages";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { renderWithProviders } from "@/test/render-with-providers";

describe("StatisticsDialog", () => {
  test("shows statistics when opened", async () => {
    const screen = await renderWithProviders(
      <>
        <button
          onClick={() => toggleDialog(DIALOG_IDS.statistics)}
          type="button"
        >
          Open stats
        </button>
        <StatisticsDialog />
      </>
    );

    await screen.getByText("Open stats").click();

    await expect
      .element(
        screen.getByRole("heading", { name: m["ui.statistics.title"]() })
      )
      .toBeInTheDocument();
  });
});
