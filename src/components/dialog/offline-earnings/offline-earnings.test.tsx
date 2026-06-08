import { describe, expect, test } from "vitest";
import { OfflineEarningsDialog } from "@/components/dialog/offline-earnings";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";
import { D } from "@/utils/decimal";

describe("OfflineEarningsDialog", () => {
  test("shows offline earnings summary", async () => {
    const screen = await renderWithProviders(
      <OfflineEarningsDialog
        summary={{
          elapsedMs: 3_600_000,
          results: [],
          totalGold: D(500),
        }}
      />
    );

    await expect
      .element(
        screen.getByRole("heading", { name: m["ui.offline.welcomeBack"]() })
      )
      .toBeInTheDocument();
    await expect.element(screen.getByText("$500")).toBeInTheDocument();
  });
});
