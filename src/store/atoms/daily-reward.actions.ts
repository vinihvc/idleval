import {
  getDailyRewardOffer,
  getLocalDateString,
  hasPendingDailyReward,
  shouldResetDailyStreak,
} from "@/game/daily-reward";
import { addInventorySlot } from "@/game/power-ups";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import {
  dailyRewardAtom,
  getDailyRewardState,
} from "@/store/atoms/daily-reward.atom";
import { getInventoryState, inventoryAtom } from "@/store/atoms/inventory";

const setDailyReward = (
  updater: (
    state: ReturnType<typeof getDailyRewardState>
  ) => ReturnType<typeof getDailyRewardState>
) => {
  store.set(dailyRewardAtom, (previous) => updater(previous));
};

export const refreshDailyStreakState = () => {
  const today = getLocalDateString();

  setDailyReward((state) => {
    if (!shouldResetDailyStreak(state.lastClaimLocalDate, today)) {
      return state;
    }

    return {
      ...state,
      dailyStreak: 0,
    };
  });
};

export const claimDailyReward = (): boolean => {
  const today = getLocalDateString();
  const dailyState = getDailyRewardState();

  if (!hasPendingDailyReward(dailyState.lastClaimLocalDate, today)) {
    return false;
  }

  const offer = getDailyRewardOffer(dailyState.dailyStreak);
  const inventory = getInventoryState();

  store.set(inventoryAtom, {
    ...inventory,
    slots: addInventorySlot(inventory.slots, {
      powerUpId: offer.powerUpId,
      tier: offer.tier,
    }),
  });

  setDailyReward((current) => ({
    ...current,
    dailyStreak: current.dailyStreak + 1,
    lastClaimLocalDate: today,
  }));

  sound.play("upgrade");

  return true;
};
