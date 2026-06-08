import { describe, expect, test } from "vitest";
import { GodsCard } from "@/components/dialog/gods/gods.card";
import { GOD_DATA } from "@/content/gods";
import { m } from "@/i18n/messages";
import { seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

describe("GodsCard", () => {
  test("shows invoke action for first god when affordable", async () => {
    seedGold(1_000_000_000);

    const screen = await renderWithProviders(<GodsCard god={GOD_DATA[0]} />);

    await expect
      .element(screen.getByText(m["ui.gods.invoke"]()))
      .toBeInTheDocument();
  });
});
