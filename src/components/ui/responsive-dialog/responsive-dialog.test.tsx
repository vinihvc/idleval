import { describe, expect, test } from "vitest";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { renderWithProviders } from "@/test/render-with-providers";

describe("ResponsiveDialog", () => {
  test("renders content when open", async () => {
    const screen = await renderWithProviders(
      <ResponsiveDialog open>
        <ResponsiveDialogTrigger asChild>
          <Button sound={false}>Trigger</Button>
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Responsive title</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Responsive description
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody>Responsive body</ResponsiveDialogBody>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    );

    await expect
      .element(screen.getByText("Responsive title"))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText("Responsive body"))
      .toBeInTheDocument();
  });
});
