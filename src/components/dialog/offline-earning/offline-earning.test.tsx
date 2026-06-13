import { beforeEach, describe, expect, test } from "vitest";
import { AboutDialog } from "@/components/dialog/about/about";
import { OfflineEarningDialog } from "@/components/dialog/offline-earning/offline-earning";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { DIALOG_IDS, openDialog, toggleDialog } from "@/store/atoms/dialogs";
import { offlineSummaryAtom } from "@/store/offline-earning";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";
import { D } from "@/utils/decimal";

const summary = {
  elapsedMs: 3_600_000,
  results: [],
  totalGold: D(500),
};

describe("OfflineEarningDialog", () => {
  beforeEach(() => {
    resetGame();
  });

  test("shows offline earnings summary", async () => {
    const screen = await renderWithProviders(
      <OfflineEarningDialog summary={summary} />
    );

    await expect
      .poll(
        () =>
          screen
            .getByRole("heading", { name: m["ui.offline.welcomeBack"]() })
            .elements().length
      )
      .toBeGreaterThan(0);
    await expect.element(screen.getByText("$500")).toBeInTheDocument();
  });

  test("keeps offline summary when a lower-priority dialog is blocked", async () => {
    store.set(offlineSummaryAtom, summary);
    const screen = await renderWithProviders(
      <>
        <button onClick={() => toggleDialog(DIALOG_IDS.about)} type="button">
          Open about
        </button>
        <OfflineEarningDialog summary={summary} />
        <AboutDialog />
      </>
    );

    await expect
      .poll(
        () =>
          screen
            .getByRole("heading", { name: m["ui.offline.welcomeBack"]() })
            .elements().length
      )
      .toBeGreaterThan(0);

    await screen.getByRole("button", { name: "Open about" }).click();

    await expect
      .poll(
        () =>
          screen
            .getByRole("heading", { name: m["ui.offline.welcomeBack"]() })
            .elements().length
      )
      .toBeGreaterThan(0);
    expect(store.get(offlineSummaryAtom)).toEqual(summary);
  });

  test("clears offline summary when a higher-priority dialog replaces it", async () => {
    store.set(offlineSummaryAtom, summary);
    const screen = await renderWithProviders(
      <>
        <button onClick={() => openDialog(DIALOG_IDS.welcome)} type="button">
          Open welcome
        </button>
        <OfflineEarningDialog summary={summary} />
      </>
    );

    await expect
      .poll(
        () =>
          screen
            .getByRole("heading", { name: m["ui.offline.welcomeBack"]() })
            .elements().length
      )
      .toBeGreaterThan(0);

    await screen.getByRole("button", { name: "Open welcome" }).click();

    await expect.poll(() => store.get(offlineSummaryAtom)).toBeNull();
  });
});
