import { describe, expect, test } from "vitest";
import { ManagersDialog } from "@/components/dialog/managers/managers";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { FACTORY_TYPES } from "@/content/factories";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("ManagersDialog", () => {
  test("lists manager cards for all factories", async () => {
    const screen = await renderWithProviders(
      <ManagersDialog>
        <ResponsiveDialogTrigger>Open managers</ResponsiveDialogTrigger>
      </ManagersDialog>
    );

    await screen.getByText("Open managers").click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.managers.title"]() }))
      .toBeInTheDocument();

    const cards = screen
      .getByRole("heading", { name: m["ui.managers.title"]() })
      .element()
      .closest("[data-slot='dialog-content'], [data-slot='drawer-content']")
      ?.querySelectorAll("[data-slot='upgrade-card']");

    expect(cards?.length).toBe(FACTORY_TYPES.length);
  });
});
