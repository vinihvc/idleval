import { describe, expect, test } from "vitest";
import { Button } from "@/components/ui/button";
import {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipTrigger,
} from "@/components/ui/responsive-tooltip";
import { renderWithProviders } from "@/test/render-with-providers";

describe("ResponsiveTooltip", () => {
  test("renders content when open", async () => {
    const screen = await renderWithProviders(
      <ResponsiveTooltip open>
        <ResponsiveTooltipTrigger asChild>
          <Button sound={false}>Info</Button>
        </ResponsiveTooltipTrigger>
        <ResponsiveTooltipContent>More info</ResponsiveTooltipContent>
      </ResponsiveTooltip>
    );

    await expect.element(screen.getByText("More info")).toBeInTheDocument();
  });
});
