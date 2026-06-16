import { FACTORY_DATA, FACTORY_TYPES } from "@/content/factories";
import type { PowerUpId, PowerUpTier } from "@/content/power-ups";
import { isFactoryProductionActive } from "@/game/factories";
import {
  type ActivePowerUp,
  canActivatePowerUp,
  consumeInventorySlot,
  getPowerUpDurationMs,
  getYggdrasilAdvanceSeconds,
  isInstantPowerUp,
  isTimedPowerUpActive,
  rollMimirCoinGold,
} from "@/game/power-ups";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { completeProductionCycle } from "@/store/atoms/factories";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { getInvokedGods } from "@/store/atoms/gods";
import {
  getEffectiveProductionTimeForActivePowerUp,
  getInventoryState,
  inventoryAtom,
} from "@/store/atoms/inventory";
import {
  incrementMissionCounter,
  syncMissionProgress,
} from "@/store/atoms/missions.actions";
import { getMissionsState } from "@/store/atoms/missions.atom";
import { productionTicksAtom } from "@/store/atoms/production-ticks.atom";
import { increaseGoldByAmount } from "@/store/atoms/wallet";
import type { GameValue } from "@/utils/decimal";

const setInventory = (
  updater: (
    state: ReturnType<typeof getInventoryState>
  ) => ReturnType<typeof getInventoryState>
) => {
  store.set(inventoryAtom, (previous) => updater(previous));
};

export interface ActivatePowerUpResult {
  mimirCoinGold?: GameValue;
  success: boolean;
}

export const refreshExpiredPowerUps = (now = Date.now()) => {
  const state = getInventoryState();
  const { activePowerUp } = state;

  if (!activePowerUp) {
    return;
  }

  if (isTimedPowerUpActive(activePowerUp, now)) {
    return;
  }

  setInventory((current) => ({
    ...current,
    activePowerUp: null,
  }));
};

const createTimedActivePowerUp = (
  powerUpId: PowerUpId,
  tier: PowerUpTier,
  now: number
): ActivePowerUp => {
  const durationMs = getPowerUpDurationMs(powerUpId);

  return {
    powerUpId,
    tier,
    expiresAt: durationMs == null ? null : now + durationMs,
  };
};

const advanceFactoryTicksBySeconds = (seconds: number) => {
  const factories = store.get(factoriesAtom);
  const ticks = store.get(productionTicksAtom);
  const nextTicks = { ...ticks };

  for (const factory of FACTORY_TYPES) {
    const tick = ticks[factory];
    const factoryState = factories[factory];
    const isActive = isFactoryProductionActive(factoryState);

    if (!(isActive && tick.isRunning)) {
      continue;
    }

    let remainingSeconds = tick.seconds - seconds;

    while (remainingSeconds <= 0) {
      completeProductionCycle(factory);
      const effectiveProductionTime =
        getEffectiveProductionTimeForActivePowerUp(
          FACTORY_DATA[factory].productionTime
        );
      remainingSeconds += effectiveProductionTime;
    }

    nextTicks[factory] = {
      ...tick,
      seconds: remainingSeconds,
    };
  }

  store.set(productionTicksAtom, nextTicks);
};

const activateInstantPowerUp = (
  powerUpId: PowerUpId,
  tier: PowerUpTier
): { mimirCoinGold?: GameValue; success: boolean } => {
  if (powerUpId === "mimirCoin") {
    const gold = rollMimirCoinGold(tier, {
      factories: store.get(factoriesAtom),
      godsInvoked: getInvokedGods(),
      renownPercent: getMissionsState().renownPercent,
    });

    increaseGoldByAmount("grain", gold);
    sound.play("coin");

    return { success: true, mimirCoinGold: gold };
  }

  if (powerUpId === "yggdrasilTear") {
    advanceFactoryTicksBySeconds(getYggdrasilAdvanceSeconds());
    return { success: true };
  }

  return { success: false };
};

export const activatePowerUpAtSlot = (
  slotIndex: number
): ActivatePowerUpResult => {
  refreshExpiredPowerUps();

  const state = getInventoryState();
  const slot = state.slots[slotIndex];

  if (!slot) {
    return { success: false };
  }

  if (!canActivatePowerUp(state.activePowerUp, slot.count)) {
    return { success: false };
  }

  const { powerUpId, tier } = slot;
  const now = Date.now();

  if (isInstantPowerUp(powerUpId)) {
    const instantResult = activateInstantPowerUp(powerUpId, tier);

    if (!instantResult.success) {
      return { success: false };
    }

    setInventory((current) => ({
      ...current,
      slots: consumeInventorySlot(current.slots, slotIndex),
    }));

    if (powerUpId !== "mimirCoin") {
      sound.play("upgrade");
    }

    incrementMissionCounter("powerUpsActivated");
    syncMissionProgress();

    return {
      success: true,
      mimirCoinGold: instantResult.mimirCoinGold,
    };
  }

  setInventory((current) => ({
    ...current,
    slots: consumeInventorySlot(current.slots, slotIndex),
    activePowerUp: createTimedActivePowerUp(powerUpId, tier, now),
  }));

  sound.play("upgrade");
  incrementMissionCounter("powerUpsActivated");
  syncMissionProgress();

  return { success: true };
};
