import { describe, expect, test } from "vitest";
import { WikiDialog } from "@/components/dialog/wiki/wiki";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { godsAtom } from "@/store/atoms/gods";
import { setupStoreTest } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

describe("WikiDialog", () => {
  test("renders tab grids with locked gods by default", async () => {
    setupStoreTest();

    const screen = await renderWithProviders(<WikiDialog open />);

    await expect
      .element(screen.getByRole("heading", { name: m["ui.wiki.title"]() }))
      .toBeInTheDocument();

    const huangdiCard = screen.getByRole("button", {
      name: m["ui.wiki.lockedEntry"]({ 0: m["god.huangdi.name"]() }),
    });

    await expect.element(huangdiCard).toBeDisabled();
    await expect.element(huangdiCard).toHaveAttribute("data-locked", "true");
  });

  test("opens god detail after unlocking and clicking a card", async () => {
    setupStoreTest();
    store.set(godsAtom, { invoked: ["huangdi"] });

    const screen = await renderWithProviders(<WikiDialog open />);

    await screen.getByRole("button", { name: m["god.huangdi.name"]() }).click();

    await expect
      .element(screen.getByRole("heading", { name: m["god.huangdi.name"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.wiki.section.lore"]()))
      .toBeInTheDocument();

    await screen.getByRole("button", { name: m["ui.wiki.back"]() }).click();

    await expect
      .element(screen.getByRole("button", { name: m["god.huangdi.name"]() }))
      .toBeInTheDocument();
  });

  test("renders tips tab entries", async () => {
    const screen = await renderWithProviders(<WikiDialog open />);

    await screen.getByRole("tab", { name: m["ui.wiki.tab.tips"]() }).click();

    await expect
      .element(screen.getByText(m["wiki.tip.gettingStarted.title"]()))
      .toBeInTheDocument();
  });
});
