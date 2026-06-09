import { describe, expect, test } from "vitest";
import { Badge } from "@/components/ui/badge";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Badge", () => {
  test("renders text", async () => {
    const screen = await renderWithProviders(<Badge>New</Badge>);

    await expect.element(screen.getByText("New")).toBeInTheDocument();
  });

  test("sets variant data attribute", async () => {
    const screen = await renderWithProviders(
      <Badge variant="green">Active</Badge>
    );

    const badge = screen.getByText("Active");
    await expect.element(badge).toHaveAttribute("data-slot", "badge");
    await expect.element(badge).toHaveAttribute("data-variant", "green");
  });
});
