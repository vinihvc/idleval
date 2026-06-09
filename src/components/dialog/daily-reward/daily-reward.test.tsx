import { describe, expect, test } from "vitest";
import { DailyRewardDialog } from "@/components/dialog/daily-reward/daily-reward";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("DailyRewardDialog", () => {
  test("renders daily claim when offering is pending", async () => {
    const screen = await renderWithProviders(
      <DailyRewardDialog>
        <ResponsiveDialogTrigger>Open daily reward</ResponsiveDialogTrigger>
      </DailyRewardDialog>
    );

    await screen.getByText("Open daily reward").click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.daily.title"]() }))
      .toBeInTheDocument();

    await expect
      .element(screen.getByRole("button", { name: m["ui.daily.claim"]() }))
      .toBeInTheDocument();

    for (let day = 1; day <= 6; day++) {
      await expect
        .element(
          screen
            .getByRole("dialog")
            .element()
            .querySelector(
              `[data-slot="daily-reward-day"][data-day="${day}"]`
            ) as HTMLElement | null
        )
        .toBeInTheDocument();
    }
  });
});
