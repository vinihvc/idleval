import { describe, expect, test } from "vitest";
import { StatisticsDialog } from "@/components/dialog/statistics";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("StatisticsDialog", () => {
  test("shows statistics when opened", async () => {
    const screen = await renderWithProviders(
      <StatisticsDialog>
        <ResponsiveDialogTrigger>Open stats</ResponsiveDialogTrigger>
      </StatisticsDialog>
    );

    await screen.getByText("Open stats").click();

    await expect
      .element(
        screen.getByRole("heading", { name: m["ui.statistics.title"]() })
      )
      .toBeInTheDocument();
  });
});
