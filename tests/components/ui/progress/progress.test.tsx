import { describe, expect, test } from "vitest";
import {
  Progress,
  ProgressRange,
  ProgressTrack,
} from "@/components/ui/progress";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Progress", () => {
  test("renders progress bar with value", async () => {
    const screen = await renderWithProviders(
      <Progress value={50}>
        <ProgressTrack>
          <ProgressRange />
        </ProgressTrack>
      </Progress>
    );

    const progress = screen.getByRole("progressbar");
    await expect.element(progress).toBeInTheDocument();
    await expect.element(progress).toHaveAttribute("aria-valuenow", "50");
  });
});
