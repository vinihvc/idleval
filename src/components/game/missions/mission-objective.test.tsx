import { describe, expect, test } from "vitest";
import { MissionObjectiveLabel } from "@/components/game/missions/mission-objective";
import { COIN_IMAGE_SRC } from "@/components/icons/coin";
import type { MissionObjective } from "@/content/missions";
import { translate, translateParams } from "@/i18n/localize";
import { renderWithProviders } from "@/test/render-with-providers";

const objectives: Array<{
  label: string;
  objective: MissionObjective;
  hasCoin?: boolean;
  factoryImage?: string;
  invokeGodName?: string;
}> = [
  {
    label: "earnGold",
    objective: { type: "earnGold", target: "500", scope: "lifetime" },
    hasCoin: true,
  },
  {
    label: "spendGold",
    objective: { type: "spendGold", target: "500", scope: "lifetime" },
    hasCoin: true,
  },
  {
    label: "holdGold",
    objective: { type: "holdGold", target: "1000", scope: "run" },
    hasCoin: true,
  },
  {
    label: "ownUnits",
    objective: {
      type: "ownUnits",
      factory: "grain",
      target: 1,
      scope: "lifetime",
    },
    factoryImage: "/images/factories/grain.webp",
  },
  {
    label: "unlockFactory",
    objective: { type: "unlockFactory", factory: "wine", scope: "run" },
    factoryImage: "/images/factories/wine.webp",
  },
  {
    label: "upgradeFactory",
    objective: { type: "upgradeFactory", factory: "grain", scope: "run" },
    factoryImage: "/images/factories/grain.webp",
  },
  {
    label: "invokeGod",
    objective: { type: "invokeGod", godId: "shango", scope: "lifetime" },
    invokeGodName: translate("god.shango.name"),
  },
  {
    label: "completeCycles",
    objective: { type: "completeCycles", target: 5, scope: "lifetime" },
    factoryImage: "/images/factories/grain.webp",
  },
];

describe("MissionObjectiveLabel", () => {
  test.each(objectives)("renders $label objective text", async ({
    objective,
    hasCoin,
    factoryImage,
    invokeGodName,
  }) => {
    await renderWithProviders(<MissionObjectiveLabel objective={objective} />);

    const root = document.querySelector("span.flex");

    expect(root).not.toBeNull();

    if (hasCoin) {
      expect(root?.textContent).toContain(
        translate(`mission.objective.${objective.type}`)
      );
      expect(
        root?.querySelector(`img[src="${COIN_IMAGE_SRC}"]`)
      ).not.toBeNull();
    }

    if (factoryImage) {
      expect(root?.querySelector(`img[src="${factoryImage}"]`)).not.toBeNull();
    }

    if (objective.type === "ownUnits") {
      expect(root?.textContent).toContain(
        translateParams("mission.objective.ownUnits", {
          factory: translate(`factory.${objective.factory}.name`),
        })
      );
    }

    if (invokeGodName) {
      expect(root?.textContent).toContain(
        translateParams("mission.objective.invokeGod", {
          god: invokeGodName,
        })
      );
    }

    if (objective.type === "completeCycles") {
      expect(root?.textContent).toContain(
        translate("mission.objective.completeCycles")
      );
    }
  });

  test("places the objective icon before the label text", async () => {
    await renderWithProviders(
      <MissionObjectiveLabel
        objective={{
          type: "ownUnits",
          factory: "grain",
          target: 1,
          scope: "lifetime",
        }}
      />
    );

    const root = document.querySelector("span.flex");
    const children = [...(root?.children ?? [])];

    expect(children[0]?.querySelector("img")).not.toBeNull();
    expect(children[1]?.classList.contains("min-w-0")).toBe(true);
  });

  test("uses larger icon wrapper in dialog size", async () => {
    await renderWithProviders(
      <MissionObjectiveLabel
        objective={{ type: "earnGold", target: "500", scope: "lifetime" }}
        size="dialog"
      />
    );

    const iconWrapper = document.querySelector("span.inline-flex");

    expect(iconWrapper?.className).toContain("size-6");
  });

  test("uses compact icon wrapper by default", async () => {
    await renderWithProviders(
      <MissionObjectiveLabel
        objective={{ type: "earnGold", target: "500", scope: "lifetime" }}
      />
    );

    const iconWrapper = document.querySelector("span.inline-flex");

    expect(iconWrapper?.className).toContain("size-4");
  });

  test("renders a manager image for automateFactory objectives", async () => {
    await renderWithProviders(
      <MissionObjectiveLabel
        objective={{ type: "automateFactory", factory: "grain", scope: "run" }}
      />
    );

    expect(
      document.querySelector('img[src="/images/managers/grain.webp"]')
    ).not.toBeNull();
  });

  test("renders a power-ups image for claimDailyRewards objectives", async () => {
    await renderWithProviders(
      <MissionObjectiveLabel
        objective={{
          type: "claimDailyRewards",
          target: 3,
          scope: "lifetime",
        }}
      />
    );

    expect(
      document.querySelector('img[src="/images/power-ups/power-ups.webp"]')
    ).not.toBeNull();
  });

  test("renders an inventory image for activatePowerUps objectives", async () => {
    await renderWithProviders(
      <MissionObjectiveLabel
        objective={{
          type: "activatePowerUps",
          target: 1,
          scope: "lifetime",
        }}
      />
    );

    expect(
      document.querySelector('img[src="/images/msc/inventory.webp"]')
    ).not.toBeNull();
  });
});
