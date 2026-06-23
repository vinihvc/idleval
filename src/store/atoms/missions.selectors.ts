import React from "react";
import { MISSION_CATALOG } from "@/content/missions";
import {
  getRenownProductionMultiplier,
  getVisibleMissionSlots,
} from "@/game/missions";
import type { MissionGameSnapshot } from "@/game/types";
import { store } from "@/providers/store";
import { useFactories } from "@/store/atoms/factories";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { getInvokedGods, useGods } from "@/store/atoms/gods";
import {
  getMissionsState,
  useMissionsState,
} from "@/store/atoms/missions.atom";
import { statisticsAtom, useStatistics } from "@/store/atoms/statistics";
import { getGold, useWallet } from "@/store/atoms/wallet";

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
  const { gold } = useWallet();
  const factories = useFactories();
  const statistics = useStatistics();
  const { invoked: godsInvoked } = useGods();

  return React.useMemo(() => {
    const snapshot: MissionGameSnapshot = {
      statistics,
      factories,
      gods: { invoked: godsInvoked },
      walletGold: gold,
      counters: state.counters,
    };

    return getVisibleMissionSlots(MISSION_CATALOG, state, snapshot);
  }, [state, gold, factories, statistics, godsInvoked]);
};
