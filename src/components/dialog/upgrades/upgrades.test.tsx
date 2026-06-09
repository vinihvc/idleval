import { describe, expect, test } from "vitest";
import { UpgradesDialog } from "@/components/dialog/upgrades/upgrades";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { FACTORY_TYPES } from "@/content/factories";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("UpgradesDialog", () => {
  test("lists upgrade cards for all factories", async () => {
    const screen = await renderWithProviders(
      <UpgradesDialog>
        <ResponsiveDialogTrigger>Open upgrades</ResponsiveDialogTrigger>
      </UpgradesDialog>
    );

    await screen.getByText("Open upgrades").click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.upgrades.title"]() }))
      .toBeInTheDocument();

    const cards = screen
      .getByRole("heading", { name: m["ui.upgrades.title"]() })
      .element()
      .closest("[data-slot='dialog-content'], [data-slot='drawer-content']")
      ?.querySelectorAll("[data-slot='upgrade-card']");

    expect(cards?.length).toBe(FACTORY_TYPES.length);
  });
});
