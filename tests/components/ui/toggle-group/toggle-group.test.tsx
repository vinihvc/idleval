import { describe, expect, test } from "vitest";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { renderWithProviders } from "@/test/render-with-providers";

describe("ToggleGroup", () => {
  test("toggle group renders items", async () => {
    const screen = await renderWithProviders(
      <ToggleGroup defaultValue={["a"]} multiple={false}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );

    await expect
      .element(screen.getByRole("radio", { name: "A" }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("radio", { name: "B" }))
      .toBeInTheDocument();
  });
});
