import type { MissionDefinition, MissionId } from "@/content/missions";
import { ACTIVE_MISSION_SLOTS, getMissionById } from "@/content/missions";
import {
  createMissionProgressBaseline,
  type MissionGameSnapshot,
  type MissionSlotStatus,
  type MissionSlotView,
  type MissionsPersistedState,
} from "@/game/types";
import {
  getMissionProgress,
  isMissionReadyToClaim,
  meetsMissionRequirements,
} from "./progress";
import { isMissionReplay } from "./replay";

const getEligibleMissions = (
  catalog: MissionDefinition[],
  _state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionDefinition[] =>
  catalog.filter((mission) => meetsMissionRequirements(mission, snapshot));

const findNextMissionAfterClaim = (
  catalog: MissionDefinition[],
  candidates: MissionDefinition[],
  claimedId: MissionId,
  usedIds: Set<MissionId>
): MissionDefinition | null => {
  const candidateIds = new Set(candidates.map((mission) => mission.id));
  const claimedIndex = catalog.findIndex((mission) => mission.id === claimedId);

  if (claimedIndex === -1) {
    return null;
  }

  for (let offset = 1; offset <= catalog.length; offset++) {
    const mission = catalog[(claimedIndex + offset) % catalog.length];

    if (candidateIds.has(mission.id) && !usedIds.has(mission.id)) {
      return mission;
    }
  }

  return null;
};

export const getMissionSlotStatus = (
  id: MissionId,
  state: MissionsPersistedState
): MissionSlotStatus => {
  if (state.activeSlotIds.includes(id) || !state.claimedIds.includes(id)) {
    if (state.readyToClaimIds.includes(id)) {
      return "ready";
    }

    return "in_progress";
  }

  return "claimed";
};

/**
 * Resolves slot status from persisted state and live snapshot progress.
 */
export const resolveMissionSlotStatus = (
  mission: MissionDefinition,
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionSlotStatus => {
  if (
    !state.activeSlotIds.includes(mission.id) &&
    state.claimedIds.includes(mission.id)
  ) {
    return "claimed";
  }

  if (
    state.readyToClaimIds.includes(mission.id) ||
    isMissionReadyToClaim(mission, snapshot, state)
  ) {
    return "ready";
  }

  return "in_progress";
};

export const canClaimMission = (
  id: MissionId,
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): boolean => {
  if (!state.readyToClaimIds.includes(id)) {
    return false;
  }

  const mission = getMissionById(id);

  return mission ? isMissionReadyToClaim(mission, snapshot, state) : false;
};

/**
 * Captures baselines for active missions. Replays overwrite existing baselines.
 */
export const captureMissionBaselines = (
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot,
  activeSlotIds: MissionId[]
): MissionsPersistedState => {
  let progressBaselines = state.progressBaselines;
  let ownUnitsBaselines = state.ownUnitsBaselines;
  let changed = false;

  for (const id of activeSlotIds) {
    const replay = isMissionReplay(state, id);
    const mission = getMissionById(id);

    if (!replay && progressBaselines[id]) {
      continue;
    }

    progressBaselines = {
      ...progressBaselines,
      [id]: createMissionProgressBaseline(snapshot),
    };
    changed = true;

    if (replay && mission?.objective.type === "ownUnits") {
      const factory = mission.objective.factory;

      if (state.ownUnitsBaselines[factory] === undefined) {
        ownUnitsBaselines = {
          ...ownUnitsBaselines,
          [factory]: snapshot.statistics.factories[factory]?.quantity ?? 0,
        };
      }
    }
  }

  if (!changed) {
    return state;
  }

  return {
    ...state,
    progressBaselines,
    ownUnitsBaselines,
  };
};

/**
 * Keeps the three visible slot ids stable. Existing positions are preserved;
 * empty slots are filled with the next eligible missions in catalog order.
 */
export const resolveActiveSlotIds = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionId[] => {
  const eligible = new Set(
    getEligibleMissions(catalog, state, snapshot).map((mission) => mission.id)
  );

  const isVisibleMission = (id: MissionId): boolean =>
    catalog.some((mission) => mission.id === id) && eligible.has(id);

  const slots: MissionId[] = [];
  const used = new Set<MissionId>();

  for (const id of state.activeSlotIds) {
    if (slots.length >= ACTIVE_MISSION_SLOTS) {
      break;
    }

    if (!isVisibleMission(id) || used.has(id)) {
      continue;
    }

    slots.push(id);
    used.add(id);
  }

  for (const mission of catalog) {
    if (slots.length >= ACTIVE_MISSION_SLOTS) {
      break;
    }

    if (used.has(mission.id) || !eligible.has(mission.id)) {
      continue;
    }

    slots.push(mission.id);
    used.add(mission.id);
  }

  return slots;
};

/**
 * Replaces only the claimed mission's slot with the next eligible mission.
 */
export const replaceActiveSlotAfterClaim = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  claimedId: MissionId,
  snapshot: MissionGameSnapshot
): MissionId[] => {
  const slotIndex = state.activeSlotIds.indexOf(claimedId);

  if (slotIndex === -1) {
    return resolveActiveSlotIds(catalog, state, snapshot);
  }

  const nextSlots = [...state.activeSlotIds];
  const usedIds = new Set(
    nextSlots.filter((id, index) => index !== slotIndex && id !== claimedId)
  );
  const candidates = getEligibleMissions(catalog, state, snapshot);
  const nextMission = findNextMissionAfterClaim(
    catalog,
    candidates,
    claimedId,
    usedIds
  );

  if (nextMission) {
    nextSlots[slotIndex] = nextMission.id;
  } else {
    nextSlots.splice(slotIndex, 1);
  }

  return resolveActiveSlotIds(
    catalog,
    {
      ...state,
      activeSlotIds: nextSlots,
    },
    snapshot
  );
};

/**
 * Returns up to three mission slots for the stage UI.
 */
export const getVisibleMissionSlots = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionSlotView[] => {
  const activeSlotIds = resolveActiveSlotIds(catalog, state, snapshot);
  const slots: MissionSlotView[] = [];

  for (const id of activeSlotIds) {
    const mission = catalog.find((entry) => entry.id === id);

    if (!mission) {
      continue;
    }

    slots.push({
      id,
      order: mission.order,
      status: resolveMissionSlotStatus(mission, state, snapshot),
      progress: getMissionProgress(mission.objective, snapshot, state, id),
    });
  }

  return slots;
};

/**
 * Finds missions that became ready since the last sync.
 */
export const findNewlyReadyMissionIds = (
  catalog: MissionDefinition[],
  state: MissionsPersistedState,
  snapshot: MissionGameSnapshot
): MissionId[] => {
  const ready = new Set(state.readyToClaimIds);
  const activeSlotIds = resolveActiveSlotIds(catalog, state, snapshot);
  const active = new Set(activeSlotIds);
  const newlyReady: MissionId[] = [];

  for (const mission of catalog) {
    if (ready.has(mission.id) || !active.has(mission.id)) {
      continue;
    }

    if (!meetsMissionRequirements(mission, snapshot)) {
      continue;
    }

    if (isMissionReadyToClaim(mission, snapshot, state)) {
      newlyReady.push(mission.id);
    }
  }

  return newlyReady;
};

export const getHasClaimableMission = (
  state: MissionsPersistedState
): boolean => state.readyToClaimIds.length > 0;

export { isMissionReplay } from "./replay";
