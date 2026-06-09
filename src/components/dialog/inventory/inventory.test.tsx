import { describe, expect, test } from "vitest";
import { InventoryDialog } from "@/components/dialog/inventory/inventory";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { POWER_UP_GRID_LAYOUT } from "@/content/power-ups";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("InventoryDialog", () => {
  test("renders altar grid with ritual circles and power-up slots", async () => {
    const screen = await renderWithProviders(
      <InventoryDialog>
        <ResponsiveDialogTrigger>Open inventory</ResponsiveDialogTrigger>
      </InventoryDialog>
    );

    await screen.getByText("Open inventory").click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.inventory.title"]() }))
      .toBeInTheDocument();

    for (let index = 0; index < 4; index++) {
      await expect
        .element(
          screen.getByRole("button", {
            name: m["ui.inventory.slot.ritual"]({ 0: index + 7 }),
          })
        )
        .toBeInTheDocument();
    }

    for (let index = 0; index < POWER_UP_GRID_LAYOUT.length; index++) {
      const powerUpId = POWER_UP_GRID_LAYOUT[index];

      if (!powerUpId) {
        continue;
      }

      await expect
        .element(
          screen.getByRole("button", {
            name: m["ui.inventory.slot.empty"]({ 0: index + 1 }),
          })
        )
        .toBeInTheDocument();
    }
  });
});
