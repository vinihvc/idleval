import { describe, expect, test } from "vitest";
import { StatisticsDialog } from "@/components/dialog/statistics/statistics";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { missionsAtom } from "@/store/atoms/missions.atom";
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

  test("shows quest renown stat tile", async () => {
    store.set(missionsAtom, (previous) => ({
      ...previous,
      renownPercent: 15,
    }));

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
        screen.getByText(m["ui.statistics.renownValue"]({ percent: "15" }))
      )
      .toBeInTheDocument();
  });
});
