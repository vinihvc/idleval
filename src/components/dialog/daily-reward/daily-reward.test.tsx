import { describe, expect, test } from "vitest";
import { DailyRewardDialog } from "@/components/dialog/daily-reward/daily-reward";
import { m } from "@/i18n/messages";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { renderWithProviders } from "@/test/render-with-providers";

describe("DailyRewardDialog", () => {
  test("renders daily claim when offering is pending", async () => {
    const screen = await renderWithProviders(
      <>
        <button
          onClick={() => toggleDialog(DIALOG_IDS.dailyReward)}
          type="button"
        >
          Open daily reward
        </button>
        <DailyRewardDialog />
      </>
    );

    await screen.getByText("Open daily reward").click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.daily.title"]() }))
      .toBeInTheDocument();

    await expect
      .element(screen.getByRole("button", { name: m["ui.daily.claim"]() }))
      .toBeInTheDocument();

    for (let day = 1; day <= 4; day++) {
      const dayLabel = String(day).padStart(2, "0");

      await expect.element(screen.getByText(dayLabel)).toBeInTheDocument();
    }
  });
});
