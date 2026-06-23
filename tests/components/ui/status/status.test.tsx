import { describe, expect, test } from "vitest";
import { Status } from "@/components/ui/status";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Status", () => {
  test("renders indicator dot", async () => {
    const screen = await renderWithProviders(
      <Status data-testid="status" variant="success" />
    );

    const status = screen.getByTestId("status");
    await expect
      .element(status)
      .toHaveAttribute("data-slot", "status-indicator");
    await expect.element(status).toHaveAttribute("data-variant", "success");
    await expect.element(status).toHaveAttribute("data-size", "sm");
  });

  test("supports size variants", async () => {
    const screen = await renderWithProviders(
      <Status data-testid="status" size="lg" variant="info" />
    );

    await expect
      .element(screen.getByTestId("status"))
      .toHaveAttribute("data-size", "lg");
  });
});
