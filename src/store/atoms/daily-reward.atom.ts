import { useAtomValue } from "jotai";
import { LOCAL_STORAGE } from "@/config/local-storage";
import {
  getDailyRewardOffer,
  getLocalDateString,
  hasPendingDailyReward,
} from "@/game/daily-reward";
import { store } from "@/providers/store";
import { persistedAtomWithNormalize } from "@/store/storage";

export interface DailyRewardState {
  dailyStreak: number;
  lastClaimLocalDate: string | null;
}

export const createInitialDailyRewardState = (): DailyRewardState => ({
  dailyStreak: 0,
  lastClaimLocalDate: null,
});

export const initialDailyRewardState = createInitialDailyRewardState();

const normalizeDailyRewardState = (value: unknown): DailyRewardState => {
  if (typeof value === "object" && value !== null) {
    const raw = value as Partial<DailyRewardState>;

    return {
      dailyStreak: typeof raw.dailyStreak === "number" ? raw.dailyStreak : 0,
      lastClaimLocalDate:
        typeof raw.lastClaimLocalDate === "string"
          ? raw.lastClaimLocalDate
          : null,
    };
  }

  return createInitialDailyRewardState();
};

export const dailyRewardAtom = persistedAtomWithNormalize<DailyRewardState>(
  LOCAL_STORAGE.dailyReward,
  initialDailyRewardState,
  normalizeDailyRewardState
);

export const getDailyRewardState = (): DailyRewardState =>
  store.get(dailyRewardAtom);

export const getHasPendingDailyReward = (): boolean => {
  const state = getDailyRewardState();

  return hasPendingDailyReward(state.lastClaimLocalDate, getLocalDateString());
};

export const useDailyRewardState = () => useAtomValue(dailyRewardAtom);

export const useDailyReward = () => {
  const state = useDailyRewardState();
  const today = getLocalDateString();

  return {
    dailyStreak: state.dailyStreak,
    isPending: hasPendingDailyReward(state.lastClaimLocalDate, today),
    offer: getDailyRewardOffer(state.dailyStreak),
    today,
  };
};
