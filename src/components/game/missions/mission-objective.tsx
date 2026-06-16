import { Image } from "@unpic/react";
import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Coin } from "@/components/icons/coin";
import { GOD_DATA } from "@/content/gods";
import type { MissionObjective } from "@/content/missions";
import { translate, translateParams } from "@/i18n/localize";
import { cn } from "@/lib/cn";

const missionObjectiveVariants = tv({
  slots: {
    root: "flex min-w-0 items-center",
    icon: "inline-flex shrink-0 items-center justify-center",
    image: "pixel-crisp object-contain",
    text: "min-w-0 truncate font-medium font-number tabular-nums leading-tight",
  },
  variants: {
    size: {
      compact: {
        root: "gap-0.5",
        icon: "size-4 sm:size-[18px]",
        image: "size-4 sm:size-[18px]",
        text: "text-sm sm:text-base",
      },
      dialog: {
        root: "gap-1.5",
        icon: "size-6 sm:size-7",
        image: "size-6 sm:size-7",
        text: "text-xl",
      },
    },
  },
  defaultVariants: {
    size: "compact",
  },
});

type MissionObjectiveSize = NonNullable<
  VariantProps<typeof missionObjectiveVariants>["size"]
>;

const intrinsicSizes = {
  compact: 18,
  dialog: 28,
} as const satisfies Record<MissionObjectiveSize, number>;

const renderMissionObjectiveText = (
  objective: MissionObjective
): React.ReactNode => {
  switch (objective.type) {
    case "earnGold":
      return translate("mission.objective.earnGold");
    case "spendGold":
      return translate("mission.objective.spendGold");
    case "holdGold":
      return translate("mission.objective.holdGold");
    case "ownUnits":
      return translateParams("mission.objective.ownUnits", {
        factory: translate(`factory.${objective.factory}.name`),
      });
    case "unlockFactory":
      return translate("mission.objective.unlockFactory");
    case "upgradeFactory":
      return translate("mission.objective.upgradeFactory");
    case "automateFactory":
      return translate("mission.objective.automateFactory");
    case "invokeGod":
      return translateParams("mission.objective.invokeGod", {
        god: translate(`god.${objective.godId}.name`),
      });
    case "completeCycles":
    case "claimDailyRewards":
    case "activatePowerUps":
      return translate(`mission.objective.${objective.type}`);
    default: {
      const exhaustiveCheck: never = objective;
      return exhaustiveCheck;
    }
  }
};

const getMissionObjectiveIconSource = (
  objective: MissionObjective
): { kind: "coin" } | { kind: "image"; src: string } => {
  switch (objective.type) {
    case "earnGold":
    case "spendGold":
    case "holdGold":
      return { kind: "coin" };
    case "ownUnits":
    case "unlockFactory":
      return {
        kind: "image",
        src: `/images/factories/${objective.factory}.webp`,
      };
    case "upgradeFactory":
      return {
        kind: "image",
        src: `/images/factories/${objective.factory}.webp`,
      };
    case "automateFactory":
      return {
        kind: "image",
        src: `/images/managers/${objective.factory}.webp`,
      };
    case "invokeGod": {
      const god = GOD_DATA.find((entry) => entry.id === objective.godId);

      return {
        kind: "image",
        src: god?.icon ?? "/images/gods/gods.webp",
      };
    }
    case "completeCycles":
      return { kind: "image", src: "/images/factories/grain.webp" };
    case "claimDailyRewards":
      return { kind: "image", src: "/images/characters/fizzwick.webp" };
    case "activatePowerUps":
      return { kind: "image", src: "/images/characters/grimbold.webp" };
    default: {
      const exhaustiveCheck: never = objective;
      return exhaustiveCheck;
    }
  }
};

const MissionObjectiveIcon = (props: {
  objective: MissionObjective;
  size: MissionObjectiveSize;
}) => {
  const { objective, size } = props;
  const styles = missionObjectiveVariants({ size });
  const iconSource = getMissionObjectiveIconSource(objective);
  const dimension = intrinsicSizes[size];

  return (
    <span className={styles.icon()}>
      {iconSource.kind === "coin" ? (
        <Coin
          aria-hidden
          className={cn(styles.image(), "p-px")}
          intrinsicSize={dimension}
        />
      ) : (
        <Image
          alt=""
          aria-hidden
          className={styles.image()}
          height={dimension}
          layout="constrained"
          src={iconSource.src}
          width={dimension}
        />
      )}
    </span>
  );
};

export interface MissionObjectiveLabelProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof missionObjectiveVariants> {
  objective: MissionObjective;
}

export const MissionObjectiveLabel = (props: MissionObjectiveLabelProps) => {
  const { objective, size, className, ...rest } = props;

  const labelSize = size ?? "compact";
  const styles = missionObjectiveVariants({ size: labelSize });

  return (
    <span className={cn(styles.root(), className)} {...rest}>
      <MissionObjectiveIcon objective={objective} size={labelSize} />
      <span className={styles.text()}>
        {renderMissionObjectiveText(objective)}
      </span>
    </span>
  );
};
