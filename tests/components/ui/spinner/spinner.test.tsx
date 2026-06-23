import { describe, expect, test } from "vitest";
import { Spinner } from "@/components/ui/spinner";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Spinner", () => {
  test("renders with status role", async () => {
    const screen = await renderWithProviders(<Spinner />);

    const spinner = screen.getByRole("status");
    await expect.element(spinner).toBeInTheDocument();
    await expect.element(spinner).toHaveAttribute("data-slot", "spinner");
  });

  test("accepts custom aria-label", async () => {
    const screen = await renderWithProviders(
      <Spinner aria-label="Processing" />
    );

    await expect
      .element(screen.getByRole("status", { name: "Processing" }))
      .toBeInTheDocument();
  });
});
