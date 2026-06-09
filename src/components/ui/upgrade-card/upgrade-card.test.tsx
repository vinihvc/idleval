import { describe, expect, test } from "vitest";
import { UpgradeCard } from "@/components/ui/upgrade-card";
import { renderWithProviders } from "@/test/render-with-providers";

describe("UpgradeCard", () => {
  test("open state uses green outer frame and preset styling", async () => {
    const screen = await renderWithProviders(
      <UpgradeCard
        affordable
        cost={<span>75K</span>}
        icon="/images/factories/grain.webp"
        image="/images/upgrades/grain.webp"
        title="Irrigation"
      />
    );

    const button = screen.getByRole("button");
    const innerPanel = button.element().firstElementChild;

    await expect.element(button).toHaveAttribute("data-sealed", "open");
    await expect.element(button).toHaveAttribute("data-masked", "true");
    await expect
      .element(screen.getByText("Irrigation"))
      .not.toBeInTheDocument();
    await expect.element(screen.getByText("75K")).toBeInTheDocument();
    await expect
      .poll(() => button.element().querySelector('img[src*="factories/grain"]'))
      .not.toBeNull();
    await expect
      .poll(() => button.element().className.includes("bg-success"))
      .toBe(true);
    await expect
      .poll(() => button.element().className.includes("border-success"))
      .toBe(true);
    await expect
      .poll(() => innerPanel?.className.includes("bg-success/30"))
      .toBe(true);
  });

  test("complete state uses green outer frame and preset inner panel", async () => {
    const screen = await renderWithProviders(
      <UpgradeCard complete image="/images/upgrades/grain.webp" title="Done" />
    );

    const button = screen.getByRole("button");
    const innerPanel = button.element().firstElementChild;
    const header = innerPanel?.firstElementChild;

    await expect.element(button).toHaveAttribute("data-complete", "true");
    await expect
      .poll(() => button.element().className.includes("border-success"))
      .toBe(true);
    await expect
      .poll(() => innerPanel?.className.includes("bg-success/30"))
      .toBe(true);
    await expect
      .poll(() => header?.className.includes("border-success/40"))
      .toBe(true);
    await expect
      .poll(() => header?.className.includes("bg-background"))
      .toBe(true);
  });

  test("saving sealed state shows factory and cost", async () => {
    const screen = await renderWithProviders(
      <UpgradeCard
        cost={<span>75K</span>}
        icon="/images/factories/grain.webp"
        image="/images/upgrades/grain.webp"
        locked={false}
        title="Irrigation"
      />
    );

    const button = screen.getByRole("button");

    await expect.element(button).toHaveAttribute("data-sealed", "saving");
    await expect.element(screen.getByText("75K")).toBeInTheDocument();
  });

  test("reveals title when complete", async () => {
    const screen = await renderWithProviders(
      <UpgradeCard complete image="/images/upgrades/grain.webp" title="Done" />
    );

    const button = screen.getByRole("button");

    await expect.element(button).toHaveAttribute("data-complete", "true");
    await expect.element(screen.getByText("Done")).toBeInTheDocument();
    await expect
      .poll(() => button.element().className.includes("border-success"))
      .toBe(true);
    await expect
      .poll(() => button.element().className.includes("bg-success"))
      .toBe(true);
  });

  test("charter sealed state shows factory and cost", async () => {
    const screen = await renderWithProviders(
      <UpgradeCard
        cost={<span>1.13M</span>}
        icon="/images/factories/wine.webp"
        image="/images/upgrades/grain.webp"
        locked
        title="Locked"
      />
    );

    const button = screen.getByRole("button");

    await expect.element(button).toHaveAttribute("data-sealed", "charter");
    await expect.element(button).toHaveAttribute("data-locked", "true");
    await expect.element(screen.getByText("Locked")).not.toBeInTheDocument();
    await expect.element(screen.getByText("1.13M")).toBeInTheDocument();
    await expect
      .poll(() => button.element().querySelector('img[src*="factories/wine"]'))
      .not.toBeNull();
  });
});
