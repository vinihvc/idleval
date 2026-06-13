import { describe, expect, test } from "vitest";
import { WikiDialog } from "@/components/dialog/wiki/wiki";
import { m } from "@/i18n/messages";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { setupStoreTest } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

const openWikiDialog = async () => {
  const screen = await renderWithProviders(
    <>
      <button onClick={() => toggleDialog(DIALOG_IDS.wiki)} type="button">
        Open wiki
      </button>
      <WikiDialog />
    </>
  );

  await screen.getByText("Open wiki").click();

  return screen;
};

describe("WikiDialog", () => {
  test("renders all god cards by default", async () => {
    setupStoreTest();

    const screen = await openWikiDialog();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.wiki.title"]() }))
      .toBeInTheDocument();

    await expect
      .element(screen.getByRole("button", { name: m["god.huangdi.name"]() }))
      .toBeInTheDocument();
  });

  test("opens god detail without requiring invocation", async () => {
    setupStoreTest();

    const screen = await openWikiDialog();

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
});
