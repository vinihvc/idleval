import { beforeEach, describe, expect, test, vi } from "vitest";
import { InventoryDialog } from "@/components/dialog/inventory/inventory";
import { getLocalizedPowerUp, INVENTORY_GRID_SIZE } from "@/content/power-ups";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import {
  getInventoryState,
  initialInventoryState,
  inventoryAtom,
} from "@/store/atoms/inventory";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";

const localizedAuroraDust = getLocalizedPowerUp("auroraDust");
const localizedUseAuroraDust = m["ui.inventory.useItem"]({
  0: localizedAuroraDust.name,
});

const seedInventorySlot = () => {
  store.set(inventoryAtom, {
    ...initialInventoryState,
    slots: [{ powerUpId: "auroraDust", count: 2, tier: "common" }],
  });
};

const openInventory = async () => {
  const screen = await renderWithProviders(
    <>
      <button onClick={() => toggleDialog(DIALOG_IDS.inventory)} type="button">
        Open inventory
      </button>
      <InventoryDialog />
    </>
  );

  await screen.getByText("Open inventory").click();

  return screen;
};

describe("InventoryDialog", () => {
  beforeEach(() => {
    vi.useRealTimers();
    resetGame();
  });

  test("renders inventory grid", async () => {
    const screen = await openInventory();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.inventory.title"]() }))
      .toBeInTheDocument();

    expect(
      document.querySelectorAll('[data-slot="inventory-card"]')
    ).toHaveLength(INVENTORY_GRID_SIZE);
  });

  test("shows use button for filled relic slot without an info button", async () => {
    seedInventorySlot();
    const screen = await openInventory();

    const useButton = screen.getByRole("button", {
      name: localizedUseAuroraDust,
    });

    await expect.element(useButton).toBeInTheDocument();

    await expect
      .element(
        screen.getByRole("button", {
          name: m["ui.inventory.slot.info"]({ 0: localizedAuroraDust.name }),
        })
      )
      .not.toBeInTheDocument();
  });

  test("activates power-up when use button is clicked", async () => {
    seedInventorySlot();
    const screen = await openInventory();

    const useButton = screen.getByRole("button", {
      name: localizedUseAuroraDust,
    });

    await useButton.click();

    expect(getInventoryState().activePowerUp?.powerUpId).toBe("auroraDust");
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "auroraDust", count: 1, tier: "common" },
    ]);
  });
});
