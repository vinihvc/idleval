import { describe, expect, test, vi } from "vitest";
import { Button } from "@/components/ui/button";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Button", () => {
  test("renders children", async () => {
    const screen = await renderWithProviders(<Button>Click me</Button>);

    await expect.element(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("sets data-slot and variant", async () => {
    const screen = await renderWithProviders(
      <Button variant="green">Buy</Button>
    );

    const button = screen.getByRole("button", { name: "Buy" });
    await expect.element(button).toHaveAttribute("data-slot", "button");
    await expect.element(button).toHaveAttribute("data-variant", "green");
  });

  test("shows loading state", async () => {
    const screen = await renderWithProviders(
      <Button isLoading>Loading</Button>
    );

    const button = screen.getByRole("button");
    await expect.element(button).toHaveAttribute("data-state", "loading");
    await expect.element(button).toHaveAttribute("aria-busy", "true");
  });

  test("calls onClick handler", async () => {
    const onClick = vi.fn();
    const screen = await renderWithProviders(
      <Button onClick={onClick} sound={false}>
        Tap
      </Button>
    );

    await screen.getByRole("button", { name: "Tap" }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
