import {
  getMissionById,
  MISSION_CATALOG,
  type MissionId,
} from "@/content/missions";
import {
  canClaimMission,
  captureMissionBaselines,
  findNewlyReadyMissionIds,
  replaceActiveSlotAfterClaim,
  resolveActiveSlotIds,
  summarizeMissionRewards,
} from "@/game/missions";
import { addInventorySlot } from "@/game/power-ups";
import type { MissionCounters, MissionsPersistedState } from "@/game/types";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { inventoryAtom } from "@/store/atoms/inventory";
import { missionsAtom } from "@/store/atoms/missions.atom";
import { buildMissionGameSnapshot } from "@/store/atoms/missions.selectors";
import { increaseGoldByAmount } from "@/store/atoms/wallet";
import {
  deserializeDecimal,
  type GameValue,
  serializeDecimal,
} from "@/utils/decimal";

type MissionCounterKey = keyof Pick<
  MissionCounters,
  "dailyRewardsClaimed" | "powerUpsActivated" | "productionCyclesCompleted"
>;

const setMissions = (
  updater: (state: MissionsPersistedState) => MissionsPersistedState
) => {
  store.set(missionsAtom, updater);
};

export const incrementMissionCounter = (
  key: MissionCounterKey,
  amount = 1
): void => {
  if (amount <= 0) {
    return;
  }

  setMissions((previous) => ({
    ...previous,
    counters: {
      ...previous.counters,
      [key]: previous.counters[key] + amount,
    },
  }));
};

export const incrementRunGoldEarned = (amount: GameValue): void => {
  if (amount.lte(0)) {
    return;
  }

  setMissions((previous) => ({
    ...previous,
    counters: {
      ...previous.counters,
      runGoldEarned: serializeDecimal(
        deserializeDecimal(previous.counters.runGoldEarned).plus(amount)
      ),
    },
  }));
};

export const incrementRunGoldSpent = (amount: GameValue): void => {
  if (amount.lte(0)) {
    return;
  }

  setMissions((previous) => ({
    ...previous,
    counters: {
      ...previous.counters,
      runGoldSpent: serializeDecimal(
        deserializeDecimal(previous.counters.runGoldSpent).plus(amount)
      ),
    },
  }));
};

const applyMissionSync = (
  previous: MissionsPersistedState,
  snapshot = buildMissionGameSnapshot()
): MissionsPersistedState => {
  const activeSlotIds = resolveActiveSlotIds(
    MISSION_CATALOG,
    previous,
    snapshot
  );
  const withBaselines = captureMissionBaselines(
    { ...previous, activeSlotIds },
    snapshot,
    activeSlotIds
  );
  const newlyReady = findNewlyReadyMissionIds(
    MISSION_CATALOG,
    withBaselines,
    snapshot
  );
  const readyToClaimIds = [
    ...new Set([...withBaselines.readyToClaimIds, ...newlyReady]),
  ];

  return {
    ...withBaselines,
    readyToClaimIds,
    activeSlotIds: resolveActiveSlotIds(
      MISSION_CATALOG,
      { ...withBaselines, readyToClaimIds },
      snapshot
    ),
  };
};

export const syncMissionProgress = (): void => {
  const snapshot = buildMissionGameSnapshot();

  setMissions((previous) => {
    const next = applyMissionSync(previous, snapshot);

    if (
      next.activeSlotIds.join() === previous.activeSlotIds.join() &&
      next.readyToClaimIds.join() === previous.readyToClaimIds.join() &&
      next.progressBaselines === previous.progressBaselines
    ) {
      return previous;
    }

    return next;
  });
};

export const claimMissionReward = (id: MissionId): boolean => {
  const state = store.get(missionsAtom);

  if (!canClaimMission(id, state)) {
    return false;
  }

  const mission = getMissionById(id);

  if (!mission) {
    return false;
  }

  const rewards = summarizeMissionRewards(mission.rewards);

  if (rewards.gold.gt(0)) {
    increaseGoldByAmount("grain", rewards.gold);
  }

  if (rewards.renownPercent > 0) {
    setMissions((previous) => ({
      ...previous,
      renownPercent: previous.renownPercent + rewards.renownPercent,
    }));
  }

  if (rewards.powerUps.length > 0) {
    store.set(inventoryAtom, (previous) => {
      let slots = previous.slots;

      for (const reward of rewards.powerUps) {
        const count = reward.count ?? 1;

        for (let index = 0; index < count; index++) {
          slots = addInventorySlot(slots, {
            powerUpId: reward.powerUpId,
            tier: reward.tier,
          });
        }
      }

      return { ...previous, slots };
    });
  }

  setMissions((previous) => {
    const snapshot = buildMissionGameSnapshot();
    const readyToClaimIds = previous.readyToClaimIds.filter(
      (readyId) => readyId !== id
    );
    const claimedIds = [...previous.claimedIds, id];
    const { [id]: _removed, ...progressBaselines } = previous.progressBaselines;
    const afterClaim = {
      ...previous,
      readyToClaimIds,
      claimedIds,
      progressBaselines,
    };

    const activeSlotIds = replaceActiveSlotAfterClaim(
      MISSION_CATALOG,
      afterClaim,
      id,
      snapshot
    );

    return captureMissionBaselines(
      {
        ...afterClaim,
        activeSlotIds,
      },
      snapshot,
      activeSlotIds
    );
  });

  sound.play("upgrade");
  syncMissionProgress();

  return true;
};
