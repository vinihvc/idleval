import { describe, expect, test } from "vitest";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Field", () => {
  test("renders label and input", async () => {
    const screen = await renderWithProviders(
      <Field>
        <FieldLabel>Username</FieldLabel>
        <Input aria-label="Username" />
        <FieldDescription>Pick a unique username.</FieldDescription>
      </Field>
    );

    await expect
      .element(screen.getByText("Pick a unique username."))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("textbox", { name: "Username" }))
      .toBeInTheDocument();
  });
});
