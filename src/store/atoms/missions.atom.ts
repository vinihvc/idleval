import { useAtomValue } from "jotai";
import { LOCAL_STORAGE } from "@/config/local-storage";
import {
  createInitialMissionsState,
  type MissionsPersistedState,
} from "@/game/types";
import { store } from "@/providers/store";
import { persistedAtomWithNormalize } from "@/store/storage";

const isMissionCounters = (
  value: unknown
): value is MissionsPersistedState["counters"] =>
  typeof value === "object" &&
  value !== null &&
  "productionCyclesCompleted" in value &&
  typeof value.productionCyclesCompleted === "number" &&
  "powerUpsActivated" in value &&
  typeof value.powerUpsActivated === "number" &&
  "dailyRewardsClaimed" in value &&
  typeof value.dailyRewardsClaimed === "number";

const normalizeMissionsState = (value: unknown): MissionsPersistedState => {
  const empty = createInitialMissionsState();

  if (typeof value !== "object" || value === null) {
    return empty;
  }

  const raw = value as Partial<MissionsPersistedState>;

  return {
    activeSlotIds: Array.isArray(raw.activeSlotIds)
      ? raw.activeSlotIds.filter(
          (id): id is MissionsPersistedState["activeSlotIds"][number] =>
            typeof id === "string"
        )
      : empty.activeSlotIds,
    claimedIds: Array.isArray(raw.claimedIds)
      ? raw.claimedIds.filter(
          (id): id is MissionsPersistedState["claimedIds"][number] =>
            typeof id === "string"
        )
      : empty.claimedIds,
    readyToClaimIds: Array.isArray(raw.readyToClaimIds)
      ? raw.readyToClaimIds.filter(
          (id): id is MissionsPersistedState["readyToClaimIds"][number] =>
            typeof id === "string"
        )
      : empty.readyToClaimIds,
    counters: isMissionCounters(raw.counters) ? raw.counters : empty.counters,
    renownPercent:
      typeof raw.renownPercent === "number" && raw.renownPercent >= 0
        ? raw.renownPercent
        : empty.renownPercent,
  };
};

export const missionsAtom = persistedAtomWithNormalize<MissionsPersistedState>(
  LOCAL_STORAGE.missions,
  createInitialMissionsState(),
  normalizeMissionsState
);

export const getMissionsState = (): MissionsPersistedState =>
  store.get(missionsAtom);

export const useMissionsState = () => useAtomValue(missionsAtom);
