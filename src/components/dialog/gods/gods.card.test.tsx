import { beforeEach, describe, expect, test, vi } from "vitest";
import { GodsCard } from "@/components/dialog/gods/gods.card";
import { GOD_DATA, getLocalizedGod } from "@/content/gods";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { godsAtom } from "@/store/atoms/gods";
import { seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

const HOLD_DURATION_MS = 3400;
const huangdi = GOD_DATA[0];
const localizedHuangdi = getLocalizedGod("huangdi");

describe("GodsCard", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  test("shows completed state for invoked god", async () => {
    store.set(godsAtom, { invoked: ["huangdi"] });

    const screen = await renderWithProviders(<GodsCard god={huangdi} />);

    const card = screen.getByRole("button", {
      name: m["ui.common.completed"]({ 0: localizedHuangdi.name }),
    });

    await expect.element(card).toHaveAttribute("data-complete", "true");
    await expect.element(card).toHaveAttribute("aria-disabled", "true");
  });

  test("shows insufficient gold when unaffordable", async () => {
    seedGold(0);

    const screen = await renderWithProviders(<GodsCard god={huangdi} />);

    const card = screen.getByRole("button", {
      name: m["ui.common.insufficientGold"]({ 0: localizedHuangdi.name }),
    });

    await expect.element(card).toHaveAttribute("aria-disabled", "true");
  });

  test("invokes god after hold completes", async () => {
    vi.useFakeTimers();
    seedGold(huangdi.goldRequired);

    const screen = await renderWithProviders(<GodsCard god={huangdi} />);

    const card = screen.getByRole("button", {
      name: m["ui.gods.holdToInvoke"]({ 0: localizedHuangdi.name }),
    });

    card
      .element()
      .dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    await expect.element(card).toHaveAttribute("aria-busy", "true");

    await vi.advanceTimersByTimeAsync(HOLD_DURATION_MS);

    expect(store.get(godsAtom).invoked).toEqual(["huangdi"]);

    vi.useRealTimers();
  });

  test("short tap does not invoke god", async () => {
    seedGold(huangdi.goldRequired);

    const screen = await renderWithProviders(<GodsCard god={huangdi} />);

    const card = screen.getByRole("button", {
      name: m["ui.gods.holdToInvoke"]({ 0: localizedHuangdi.name }),
    });

    const buttonElement = card.element();

    buttonElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    buttonElement.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

    expect(store.get(godsAtom).invoked).toEqual([]);
  });
});
