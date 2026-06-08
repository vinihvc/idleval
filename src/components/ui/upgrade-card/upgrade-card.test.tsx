import { describe, expect, test } from "vitest";
import { UpgradeCard, UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import { renderWithProviders } from "@/test/render-with-providers";

describe("UpgradeCard", () => {
  test("renders title and image", async () => {
    const screen = await renderWithProviders(
      <UpgradeCard
        affordable
        image="/images/upgrades/grain.webp"
        title="Irrigation"
      >
        <UpgradeCardTrigger sound={false}>Improve</UpgradeCardTrigger>
      </UpgradeCard>
    );

    await expect.element(screen.getByText("Irrigation")).toBeInTheDocument();
    await expect.element(screen.getByText("Improve")).toBeInTheDocument();
  });

  test("marks complete state", async () => {
    const screen = await renderWithProviders(
      <UpgradeCard complete image="/images/upgrades/grain.webp" title="Done" />
    );

    await expect
      .element(screen.getByRole("article"))
      .toHaveAttribute("data-complete", "true");
  });
});
