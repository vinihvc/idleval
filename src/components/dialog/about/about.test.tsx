import { describe, expect, test } from "vitest";
import { AboutDialog } from "@/components/dialog/about";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("AboutDialog", () => {
  test("shows about content when opened", async () => {
    const screen = await renderWithProviders(
      <AboutDialog>
        <ResponsiveDialogTrigger>Open about</ResponsiveDialogTrigger>
      </AboutDialog>
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
