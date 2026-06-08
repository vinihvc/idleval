import { describe, expect, test } from "vitest";
import { ManagersCard } from "@/components/dialog/managers/managers.card";
import { m } from "@/i18n/messages";
import { seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

describe("ManagersCard", () => {
  test("shows charter required for locked factory", async () => {
    const screen = await renderWithProviders(
      <ManagersCard factoryType="mill" />
    );

    await expect
      .element(screen.getByText(m["ui.common.charterRequired"]()))
      .toBeInTheDocument();
  });

  test("shows appoint action when affordable", async () => {
    seedGold(1_000_000);

    const screen = await renderWithProviders(
      <ManagersCard factoryType="grain" />
    );

    await expect
      .element(screen.getByText(m["ui.managers.appoint"]()))
      .toBeInTheDocument();
  });
});
