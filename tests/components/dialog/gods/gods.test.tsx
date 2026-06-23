import { describe, expect, test } from "vitest";
import { GodsDialog } from "@/components/dialog/gods/gods";
import { GOD_DATA } from "@/content/gods";
import { m } from "@/i18n/messages";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { renderWithProviders } from "@/test/render-with-providers";

describe("GodsDialog", () => {
  test("lists god cards", async () => {
    const screen = await renderWithProviders(
      <>
        <button onClick={() => toggleDialog(DIALOG_IDS.gods)} type="button">
          Open gods
        </button>
        <GodsDialog />
      </>
    );

    await screen.getByText("Open gods").click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.gods.title"]() }))
      .toBeInTheDocument();

    const cards = screen
      .getByRole("heading", { name: m["ui.gods.title"]() })
      .element()
      .closest("[data-slot='dialog-content'], [data-slot='drawer-content']")
      ?.querySelectorAll("[data-slot='upgrade-card']");

    expect(cards?.length).toBe(GOD_DATA.length);
  });
});
