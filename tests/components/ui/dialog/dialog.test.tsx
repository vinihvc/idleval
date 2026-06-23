import { describe, expect, test } from "vitest";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Dialog", () => {
  test("opens dialog on trigger click", async () => {
    const screen = await renderWithProviders(
      <Dialog>
        <DialogTrigger asChild>
          <Button sound={false}>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
          <DialogBody>Body content</DialogBody>
          <DialogFooter>Footer</DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await screen.getByRole("button", { name: "Open" }).click();

    await expect.element(screen.getByText("Test Dialog")).toBeInTheDocument();
    await expect.element(screen.getByText("Body content")).toBeInTheDocument();
  });

  test("localizes the close button label", async () => {
    const screen = await renderWithProviders(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await expect
      .element(screen.getByRole("button", { name: m["ui.common.close"]() }))
      .toBeInTheDocument();
  });
});
