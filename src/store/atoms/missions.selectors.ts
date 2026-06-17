import React from "react";
import { MISSION_CATALOG } from "@/content/missions";
import {
  getRenownProductionMultiplier,
  getVisibleMissionSlots,
} from "@/game/missions";
import type { MissionGameSnapshot } from "@/game/types";
import { store } from "@/providers/store";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { getInvokedGods } from "@/store/atoms/gods";
import {
  getMissionsState,
  useMissionsState,
} from "@/store/atoms/missions.atom";
import { statisticsAtom } from "@/store/atoms/statistics";
import { getGold } from "@/store/atoms/wallet";

export const buildMissionGameSnapshot = (): MissionGameSnapshot => {
  const statistics = store.get(statisticsAtom);
  const factories = store.get(factoriesAtom);
  const missions = getMissionsState();

  return {
    statistics,
    factories,
    gods: { invoked: getInvokedGods() },
    walletGold: getGold(),
    counters: missions.counters,
  };
};

export const getMissionRenownProductionMultiplier = () =>
  getRenownProductionMultiplier(getMissionsState().renownPercent);

export const useVisibleMissionSlots = () => {
  const state = useMissionsState();

  return React.useMemo(
    () =>
      getVisibleMissionSlots(
        MISSION_CATALOG,
        state,
        buildMissionGameSnapshot()
      ),
    [state]
  );
};
