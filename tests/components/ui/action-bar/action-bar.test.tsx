import { describe, expect, test } from "vitest";
import {
  ActionBar,
  ActionBarBody,
  ActionBarContent,
  ActionBarTrigger,
} from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { renderWithProviders } from "@/test/render-with-providers";

describe("ActionBar", () => {
  test("shows content when open", async () => {
    const screen = await renderWithProviders(
      <ActionBar open>
        <ActionBarTrigger asChild>
          <Button sound={false}>Actions</Button>
        </ActionBarTrigger>
        <ActionBarContent>
          <ActionBarBody>Action body</ActionBarBody>
        </ActionBarContent>
      </ActionBar>
    );

    await expect.element(screen.getByText("Action body")).toBeInTheDocument();
  });
});
