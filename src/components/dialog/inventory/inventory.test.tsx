import { beforeEach, describe, expect, test, vi } from "vitest";
import { InventoryDialog } from "@/components/dialog/inventory/inventory";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { getLocalizedPowerUp, RELIC_SLOT_COUNT } from "@/content/power-ups";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import {
  getInventoryState,
  initialInventoryState,
  inventoryAtom,
} from "@/store/atoms/inventory";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";

const HOLD_DURATION_MS = 3400;
const localizedAuroraDust = getLocalizedPowerUp("auroraDust");

const seedInventorySlot = () => {
  store.set(inventoryAtom, {
    ...initialInventoryState,
    slots: [{ powerUpId: "auroraDust", count: 2, tier: "common" }],
  });
};

const openInventory = async () => {
  const screen = await renderWithProviders(
    <InventoryDialog>
      <ResponsiveDialogTrigger>Open inventory</ResponsiveDialogTrigger>
    </InventoryDialog>
  );

  await screen.getByText("Open inventory").click();

  return screen;
};

describe("InventoryDialog", () => {
  beforeEach(() => {
    vi.useRealTimers();
    resetGame();
  });

  test("renders altar grid with ritual circles and empty relic slots", async () => {
    const screen = await openInventory();

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

    for (let index = 0; index < RELIC_SLOT_COUNT; index++) {
      await expect
        .element(
          screen.getByRole("button", {
            name: m["ui.inventory.slot.empty"]({ 0: index + 1 }),
          })
        )
        .toBeInTheDocument();
    }
  });

  test("variant D shows info button and hold label for filled relic slot", async () => {
    seedInventorySlot();
    const screen = await openInventory();

    const relicCard = screen.getByRole("button", {
      name: m["ui.inventory.holdToActivate"]({ 0: localizedAuroraDust.name }),
    });

    await expect.element(relicCard).toBeInTheDocument();

    await expect
      .element(
        screen.getByRole("button", {
          name: m["ui.inventory.slot.info"]({ 0: localizedAuroraDust.name }),
        })
      )
      .toBeInTheDocument();
  });

  test("activates power-up after hold completes", async () => {
    vi.useFakeTimers();
    seedInventorySlot();
    const screen = await openInventory();

    const relicCard = screen.getByRole("button", {
      name: m["ui.inventory.holdToActivate"]({ 0: localizedAuroraDust.name }),
    });

    relicCard
      .element()
      .dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    await expect.element(relicCard).toHaveAttribute("aria-busy", "true");

    await vi.advanceTimersByTimeAsync(HOLD_DURATION_MS);

    expect(getInventoryState().activePowerUp?.powerUpId).toBe("auroraDust");
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "auroraDust", count: 1, tier: "common" },
    ]);

    vi.useRealTimers();
  });

  test("short tap does not activate power-up", async () => {
    seedInventorySlot();
    const screen = await openInventory();

    const relicCard = screen.getByRole("button", {
      name: m["ui.inventory.holdToActivate"]({ 0: localizedAuroraDust.name }),
    });

    const buttonElement = relicCard.element();

    buttonElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    buttonElement.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

    expect(getInventoryState().activePowerUp).toBeNull();
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "auroraDust", count: 2, tier: "common" },
    ]);
  });
});
