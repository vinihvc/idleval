import { describe, expect, test } from "vitest";
import { Input } from "@/components/ui/input";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Input", () => {
  test("renders text input", async () => {
    const screen = await renderWithProviders(
      <Input aria-label="Name" placeholder="Enter name" />
    );

    const input = screen.getByRole("textbox", { name: "Name" });
    await expect.element(input).toBeInTheDocument();
    await expect.element(input).toHaveAttribute("data-slot", "input");
  });

  test("accepts typed value", async () => {
    const screen = await renderWithProviders(<Input aria-label="Search" />);

    const input = screen.getByRole("textbox", { name: "Search" });
    await input.fill("viking");
    await expect.element(input).toHaveValue("viking");
  });
});
