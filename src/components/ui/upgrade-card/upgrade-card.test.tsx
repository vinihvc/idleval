import { describe, expect, test, vi } from "vitest";
import {
  UpgradeCard,
  UpgradeCardArt,
  UpgradeCardHeader,
  UpgradeCardHoldFeedback,
  UpgradeCardPanel,
  UpgradeCardSeal,
} from "@/components/ui/upgrade-card";
import { useHoldPress } from "@/hooks/use-hold-press";
import { renderWithProviders } from "@/test/render-with-providers";

const OpenCard = () => (
  <UpgradeCard data-affordable data-masked data-sealed="open" greenFrame>
    <UpgradeCardPanel open>
      <UpgradeCardArt open showImage={false} src="/images/upgrades/grain.webp">
        <UpgradeCardSeal
          cost={<span>75K</span>}
          icon="/images/factories/grain.webp"
          open
          sealed="open"
        />
      </UpgradeCardArt>
    </UpgradeCardPanel>
  </UpgradeCard>
);

const CompleteCard = () => (
  <UpgradeCard data-complete greenFrame>
    <UpgradeCardPanel complete>
      <UpgradeCardHeader title="Done" />
      <UpgradeCardArt complete showImage src="/images/upgrades/grain.webp" />
    </UpgradeCardPanel>
  </UpgradeCard>
);

const SavingCard = () => (
  <UpgradeCard data-masked data-sealed="saving">
    <UpgradeCardPanel>
      <UpgradeCardArt showImage={false} src="/images/upgrades/grain.webp">
        <UpgradeCardSeal
          cost={<span>75K</span>}
          icon="/images/factories/grain.webp"
          sealed="saving"
        />
      </UpgradeCardArt>
    </UpgradeCardPanel>
  </UpgradeCard>
);

const CharterCard = () => (
  <UpgradeCard data-locked data-masked data-sealed="charter">
    <UpgradeCardPanel charter>
      <UpgradeCardArt showImage src="/images/upgrades/grain.webp">
        <UpgradeCardSeal
          cost={<span>1.13M</span>}
          icon="/images/factories/wine.webp"
          sealed="charter"
        />
      </UpgradeCardArt>
    </UpgradeCardPanel>
  </UpgradeCard>
);

const HoldCard = () => {
  const { isHolding, holdHandlers } = useHoldPress({
    onHoldComplete: vi.fn(),
  });

  return (
    <UpgradeCard
      {...holdHandlers}
      aria-busy={isHolding || undefined}
      className="touch-manipulation select-none [-webkit-touch-callout:none]"
      data-affordable
      data-masked
      data-sealed="open"
      greenFrame
      interactive
      onClick={holdHandlers.onClick}
    >
      <UpgradeCardPanel open>
        <UpgradeCardArt
          open
          showImage={false}
          src="/images/upgrades/grain.webp"
        >
          <UpgradeCardSeal
            cost={<span>75K</span>}
            icon="/images/factories/grain.webp"
            open
            sealed="open"
          />
          <UpgradeCardHoldFeedback active={isHolding} label="Hold..." />
        </UpgradeCardArt>
      </UpgradeCardPanel>
    </UpgradeCard>
  );
};

describe("UpgradeCard", () => {
  test("open state uses green outer frame and preset styling", async () => {
    const screen = await renderWithProviders(<OpenCard />);

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
    const screen = await renderWithProviders(<CompleteCard />);

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
    const screen = await renderWithProviders(<SavingCard />);

    const button = screen.getByRole("button");

    await expect.element(button).toHaveAttribute("data-sealed", "saving");
    await expect.element(screen.getByText("75K")).toBeInTheDocument();
  });

  test("reveals title when complete", async () => {
    const screen = await renderWithProviders(<CompleteCard />);

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

  test("shows hold progress feedback while pressing", async () => {
    const screen = await renderWithProviders(<HoldCard />);

    const button = screen.getByRole("button");

    const findProgressBar = () =>
      button.element().querySelector("span[aria-hidden].origin-left");

    await expect
      .poll(() => findProgressBar()?.className.includes("scale-x-0"))
      .toBe(true);

    button
      .element()
      .dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    await expect.element(button).toHaveAttribute("aria-busy", "true");
    await expect.element(screen.getByText("Hold...")).toBeInTheDocument();
    await expect
      .poll(() => findProgressBar()?.className.includes("scale-x-100"))
      .toBe(true);
  });

  test("charter sealed state shows factory and cost", async () => {
    const screen = await renderWithProviders(<CharterCard />);

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
