import { useAtomValue } from "jotai";
import { LOCAL_STORAGE } from "@/config/local-storage";
import {
  getDailyRewardOffer,
  getLocalDateString,
  hasPendingDailyReward,
} from "@/game/daily-reward";
import { store } from "@/providers/store";
import { persistedAtomWithNormalizeAndLegacy } from "@/store/storage";

export interface DailyRewardState {
  dailyStreak: number;
  lastClaimLocalDate: string | null;
}

export const createInitialDailyRewardState = (): DailyRewardState => ({
  dailyStreak: 0,
  lastClaimLocalDate: null,
});

export const initialDailyRewardState = createInitialDailyRewardState();

const LEGACY_DAILY_REWARD_KEYS = ["daily-reward-v1"] as const;
const LEGACY_INVENTORY_KEYS = ["inventory-v6", LOCAL_STORAGE.inventory] as const;

const readLegacyDailyRewardState = (): unknown => {
  if (typeof localStorage === "undefined") {
    return null;
  }

  for (const key of LEGACY_DAILY_REWARD_KEYS) {
    try {
      const raw = localStorage.getItem(key);

      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // try next legacy key
    }
  }

  for (const key of LEGACY_INVENTORY_KEYS) {
    try {
      const raw = localStorage.getItem(key);

      if (!raw) {
        continue;
      }

      const parsed = JSON.parse(raw) as Partial<DailyRewardState>;

      if (
        typeof parsed.dailyStreak === "number" ||
        typeof parsed.lastClaimLocalDate === "string"
      ) {
        return {
          dailyStreak: parsed.dailyStreak,
          lastClaimLocalDate: parsed.lastClaimLocalDate,
        };
      }
    } catch {
      // try next legacy key
    }
  }

  return null;
};

const normalizeDailyRewardState = (value: unknown): DailyRewardState => {
  if (typeof value === "object" && value !== null) {
    const raw = value as Partial<DailyRewardState>;

    return {
      dailyStreak:
        typeof raw.dailyStreak === "number" ? raw.dailyStreak : 0,
      lastClaimLocalDate:
        typeof raw.lastClaimLocalDate === "string"
          ? raw.lastClaimLocalDate
          : null,
    };
  }

  return createInitialDailyRewardState();
};

export const dailyRewardAtom = persistedAtomWithNormalizeAndLegacy<DailyRewardState>(
  LOCAL_STORAGE.dailyReward,
  initialDailyRewardState,
  normalizeDailyRewardState,
  readLegacyDailyRewardState
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
