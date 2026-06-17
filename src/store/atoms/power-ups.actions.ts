import { FACTORY_TYPES } from "@/content/factories";
import type { PowerUpId, PowerUpTier } from "@/content/power-ups";
import { getScaledFactoryConfig } from "@/game/balance";
import { isFactoryProductionActive } from "@/game/factories";
import {
  advanceCycleBySeconds,
  isCycleComplete,
  startCycleTick,
  syncCycleSeconds,
} from "@/game/factory-cycle";
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

const advanceFactoryTicksBySeconds = (advanceSeconds: number) => {
  const factories = store.get(factoriesAtom);
  const ticks = store.get(productionTicksAtom);
  const nextTicks = { ...ticks };
  const now = Date.now();

  for (const factory of FACTORY_TYPES) {
    const tick = ticks[factory];
    const factoryState = factories[factory];
    const isActive = isFactoryProductionActive(factoryState);

    if (!(isActive && tick.isRunning)) {
      continue;
    }

    let advancedTick = advanceCycleBySeconds(tick, advanceSeconds);

    while (isCycleComplete(advancedTick, now)) {
      completeProductionCycle(factory);

      const updatedFactory = store.get(factoriesAtom)[factory];
      const keepsRunning =
        updatedFactory.isUnlocked && updatedFactory.isAutomated;
      const productionTime = getEffectiveProductionTimeForActivePowerUp(
        getScaledFactoryConfig(factory).productionTime
      );

      if (!keepsRunning) {
        advancedTick = {
          ...advancedTick,
          cycleDurationSec: productionTime,
          cycleEndsAt: 0,
          isRunning: false,
          seconds: productionTime,
        };
        break;
      }

      const overflowSec = Math.max(0, (now - advancedTick.cycleEndsAt) / 1000);
      advancedTick = startCycleTick(advancedTick, {
        durationSec: productionTime,
        now,
      });

      if (overflowSec > 0) {
        advancedTick = advanceCycleBySeconds(advancedTick, overflowSec);
      }
    }

    nextTicks[factory] = syncCycleSeconds(advancedTick, now);
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
