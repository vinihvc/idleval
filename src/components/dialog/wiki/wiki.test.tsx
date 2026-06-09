import { describe, expect, test } from "vitest";
import { WikiDialog } from "@/components/dialog/wiki/wiki";
import { m } from "@/i18n/messages";
import { setupStoreTest } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

describe("WikiDialog", () => {
  test("renders all god cards by default", async () => {
    setupStoreTest();

    const screen = await renderWithProviders(<WikiDialog open />);

    await expect
      .element(screen.getByRole("heading", { name: m["ui.wiki.title"]() }))
      .toBeInTheDocument();

    await expect
      .element(screen.getByRole("button", { name: m["god.huangdi.name"]() }))
      .toBeInTheDocument();
  });

  test("opens god detail without requiring invocation", async () => {
    setupStoreTest();

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
});
