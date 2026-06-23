import { describe, expect, test } from "vitest";
import { Switch } from "@/components/ui/switch";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Switch", () => {
  test("renders unchecked by default", async () => {
    const screen = await renderWithProviders(
      <Switch aria-label="Notifications" />
    );

    const switchEl = screen.getByLabelText("Notifications");
    await expect.element(switchEl).toBeInTheDocument();
    await expect.element(switchEl).toHaveAttribute("data-state", "unchecked");
  });

  test("renders checked when defaultChecked", async () => {
    const screen = await renderWithProviders(
      <Switch aria-label="Notifications" defaultChecked />
    );

    await expect
      .element(screen.getByLabelText("Notifications"))
      .toHaveAttribute("data-state", "checked");
  });
});
