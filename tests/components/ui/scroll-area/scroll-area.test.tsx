import { describe, expect, test } from "vitest";
import { ScrollArea } from "@/components/ui/scroll-area";
import { renderWithProviders } from "@/test/render-with-providers";

describe("ScrollArea", () => {
  test("renders scrollable content", async () => {
    const screen = await renderWithProviders(
      <ScrollArea className="h-32">
        <div>Scroll item</div>
      </ScrollArea>
    );

    await expect.element(screen.getByText("Scroll item")).toBeInTheDocument();
  });
});
