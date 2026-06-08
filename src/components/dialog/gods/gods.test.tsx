import { describe, expect, test } from "vitest";
import { GodsDialog } from "@/components/dialog/gods/gods";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { GOD_DATA } from "@/content/gods";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("GodsDialog", () => {
  test("lists god cards", async () => {
    const screen = await renderWithProviders(
      <GodsDialog>
        <ResponsiveDialogTrigger>Open gods</ResponsiveDialogTrigger>
      </GodsDialog>
    );

    await screen.getByText("Open gods").click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.gods.title"]() }))
      .toBeInTheDocument();

    const cards = screen.getByRole("article").elements();
    expect(cards.length).toBe(GOD_DATA.length);
  });
});
