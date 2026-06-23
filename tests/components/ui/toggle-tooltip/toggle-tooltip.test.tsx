import { describe, expect, test } from "vitest";
import { Button } from "@/components/ui/button";
import {
  ToggleTooltip,
  ToggleTooltipContent,
  ToggleTooltipTrigger,
} from "@/components/ui/toggle-tooltip";
import { renderWithProviders } from "@/test/render-with-providers";

describe("ToggleTooltip", () => {
  test("renders content when open", async () => {
    const screen = await renderWithProviders(
      <ToggleTooltip open>
        <ToggleTooltipTrigger asChild>
          <Button sound={false}>Info</Button>
        </ToggleTooltipTrigger>
        <ToggleTooltipContent>More info</ToggleTooltipContent>
      </ToggleTooltip>
    );

    await expect.element(screen.getByText("More info")).toBeInTheDocument();
  });
});
