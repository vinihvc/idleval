import { describe, expect, test } from "vitest";
import { Separator } from "@/components/ui/separator";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Separator", () => {
  test("renders horizontal separator", async () => {
    const screen = await renderWithProviders(<Separator />);

    const separator = screen.getByRole("separator");
    await expect.element(separator).toBeInTheDocument();
    await expect.element(separator).toHaveAttribute("data-slot", "separator");
    await expect
      .element(separator)
      .toHaveAttribute("data-orientation", "horizontal");
  });

  test("renders vertical separator", async () => {
    const screen = await renderWithProviders(
      <Separator orientation="vertical" />
    );

    await expect
      .element(screen.getByRole("separator"))
      .toHaveAttribute("data-orientation", "vertical");
  });
});
