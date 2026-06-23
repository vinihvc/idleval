import { describe, expect, test } from "vitest";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Tooltip", () => {
  test("renders trigger", async () => {
    const screen = await renderWithProviders(
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button sound={false}>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    );

    await expect
      .element(screen.getByRole("button", { name: "Hover me" }))
      .toBeInTheDocument();
    await expect.element(screen.getByText("Tooltip text")).toBeInTheDocument();
  });
});
