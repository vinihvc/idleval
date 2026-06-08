import { describe, expect, test } from "vitest";
import { UpgradesCard } from "@/components/dialog/upgrades/upgrades.card";
import { m } from "@/i18n/messages";
import { seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

describe("UpgradesCard", () => {
  test("shows charter required for locked factory", async () => {
    const screen = await renderWithProviders(
      <UpgradesCard factoryType="mill" />
    );

    await expect
      .element(screen.getByText(m["ui.common.charterRequired"]()))
      .toBeInTheDocument();
  });

  test("shows improve action when affordable", async () => {
    seedGold(1_000_000);

    const screen = await renderWithProviders(
      <UpgradesCard factoryType="grain" />
    );

    await expect
      .element(screen.getByText(m["ui.upgrades.improve"]()))
      .toBeInTheDocument();
  });
});
