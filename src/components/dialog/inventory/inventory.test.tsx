import { beforeEach, describe, expect, test, vi } from "vitest";
import { InventoryDialog } from "@/components/dialog/inventory/inventory";
import { getLocalizedPowerUp } from "@/content/power-ups";
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

const { useMediaQueryMock } = vi.hoisted(() => ({
  useMediaQueryMock: vi.fn<(query: string) => boolean>(),
}));

vi.mock("@/hooks/use-media-query", () => ({
  useMediaQuery: useMediaQueryMock,
}));

const localizedMimirCoin = getLocalizedPowerUp("mimirCoin");
const localizedUseMimirCoin = m["ui.inventory.useItem"]({
  0: localizedMimirCoin.name,
});

const seedInventorySlot = () => {
  store.set(inventoryAtom, {
    ...initialInventoryState,
    slots: [{ powerUpId: "mimirCoin", count: 2, tier: "common" }],
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

const countInventoryCards = () =>
  document.querySelectorAll('[data-slot="inventory-card"]').length;

describe("InventoryDialog", () => {
  beforeEach(() => {
    vi.useRealTimers();
    resetGame();
    useMediaQueryMock.mockReturnValue(false);
  });

  test("renders eight inventory cards on desktop", async () => {
    useMediaQueryMock.mockReturnValue(false);
    const screen = await openInventory();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.inventory.title"]() }))
      .toBeInTheDocument();

    expect(countInventoryCards()).toBe(8);
  });

  test("renders six inventory cards on mobile", async () => {
    useMediaQueryMock.mockReturnValue(true);
    const screen = await openInventory();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.inventory.title"]() }))
      .toBeInTheDocument();

    expect(countInventoryCards()).toBe(6);
  });

  test("shows use and info buttons for filled relic slot", async () => {
    seedInventorySlot();
    const screen = await openInventory();

    const useButton = screen.getByRole("button", {
      name: localizedUseMimirCoin,
    });

    await expect.element(useButton).toBeInTheDocument();

    await expect
      .element(
        screen.getByRole("button", {
          name: m["ui.inventory.slot.info"]({ 0: localizedMimirCoin.name }),
        })
      )
      .toBeInTheDocument();
  });

  test("consumes mimir coin and grants gold when use button is clicked", async () => {
    seedInventorySlot();
    const screen = await openInventory();

    const useButton = screen.getByRole("button", {
      name: localizedUseMimirCoin,
    });

    await useButton.click();

    expect(getInventoryState().activePowerUp).toBeNull();
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "mimirCoin", count: 1, tier: "common" },
    ]);
  });

  test("disables use button while a timed power-up is active", async () => {
    const localizedHasteRune = getLocalizedPowerUp("hasteRune");

    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [{ powerUpId: "hasteRune", count: 1, tier: "common" }],
      activePowerUp: {
        expiresAt: Date.now() + 60_000,
        powerUpId: "lightningShard",
        tier: "common",
      },
    });

    const screen = await openInventory();

    const useButton = screen.getByRole("button", {
      name: m["ui.inventory.useItem"]({ 0: localizedHasteRune.name }),
    });

    await expect.element(useButton).toBeDisabled();

    const card = document.querySelector('[data-slot="inventory-card"]');
    const footer = document.querySelector('[data-slot="power-up-card-footer"]');

    expect(card?.className.includes("opacity-60")).toBe(false);
    expect(footer?.className.includes("opacity-60")).toBe(true);
  });
});
