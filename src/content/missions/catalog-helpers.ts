import { MISSION_DATA } from "./catalog";
import type { MissionDefinition, MissionId } from "./types";

export const MISSION_COUNT = MISSION_DATA.length;

export const MISSION_CATALOG: MissionDefinition[] = [...MISSION_DATA];

export const MISSION_IDS = MISSION_CATALOG.map((mission) => mission.id);

export const getMissionById = (id: MissionId): MissionDefinition | undefined =>
  MISSION_CATALOG.find((mission) => mission.id === id);

export const getMissionByOrder = (
  order: number
): MissionDefinition | undefined =>
  MISSION_CATALOG.find((mission) => mission.order === order);
