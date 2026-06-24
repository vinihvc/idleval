import { useAtomValue } from "jotai";
import { LOCAL_STORAGE } from "@/config/local-storage";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import type { MissionId } from "@/content/missions";
import {
  createInitialMissionCounters,
  createInitialMissionsState,
  type MissionsPersistedState,
} from "@/game/types";
import { store } from "@/providers/store";
import { persistedAtomWithNormalize } from "@/store/storage";

const normalizeMissionCounters = (
  value: unknown
): MissionsPersistedState["counters"] => {
  const empty = createInitialMissionCounters();

  if (typeof value !== "object" || value === null) {
    return empty;
  }

  const raw = value as Partial<MissionsPersistedState["counters"]>;

  return {
    productionCyclesCompleted:
      typeof raw.productionCyclesCompleted === "number"
        ? raw.productionCyclesCompleted
        : empty.productionCyclesCompleted,
    powerUpsActivated:
      typeof raw.powerUpsActivated === "number"
        ? raw.powerUpsActivated
        : empty.powerUpsActivated,
    runGoldEarned:
      typeof raw.runGoldEarned === "string"
        ? raw.runGoldEarned
        : empty.runGoldEarned,
    runGoldSpent:
      typeof raw.runGoldSpent === "string"
        ? raw.runGoldSpent
        : empty.runGoldSpent,
  };
};

const isMissionProgressBaseline = (
  value: unknown
): value is MissionsPersistedState["progressBaselines"][MissionId] =>
  typeof value === "object" &&
  value !== null &&
  "goldEarned" in value &&
  typeof value.goldEarned === "string" &&
  "goldSpent" in value &&
  typeof value.goldSpent === "string" &&
  "productionCyclesCompleted" in value &&
  typeof value.productionCyclesCompleted === "number" &&
  "powerUpsActivated" in value &&
  typeof value.powerUpsActivated === "number";

const normalizeProgressBaselines = (
  value: unknown
): MissionsPersistedState["progressBaselines"] => {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  const entries = Object.entries(value).filter(
    (
      entry
    ): entry is [
      MissionId,
      MissionsPersistedState["progressBaselines"][MissionId],
    ] => typeof entry[0] === "string" && isMissionProgressBaseline(entry[1])
  );

  return Object.fromEntries(entries);
};

const normalizeOwnUnitsBaselines = (
  value: unknown
): MissionsPersistedState["ownUnitsBaselines"] => {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  const raw = value as Record<string, unknown>;
  const baselines: Partial<Record<FactoryType, number>> = {};

  for (const factory of FACTORY_TYPES) {
    const quantity = raw[factory];

    if (typeof quantity === "number" && quantity >= 0) {
      baselines[factory] = quantity;
    }
  }

  return baselines;
};

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
    counters: normalizeMissionCounters(raw.counters),
    progressBaselines: normalizeProgressBaselines(raw.progressBaselines),
    ownUnitsBaselines: normalizeOwnUnitsBaselines(raw.ownUnitsBaselines),
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
