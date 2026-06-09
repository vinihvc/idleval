import {
  FACTORY_DATA,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
import type { PowerUpId, PowerUpTier } from "@/content/power-ups";
import { isFactoryProductionActive } from "@/game/factories";
import {
  type ActivePowerUp,
  addInventorySlot,
  canActivatePowerUp,
  consumeInventorySlot,
  getDailyRewardOffer,
  getLocalDateString,
  getPowerUpDurationMs,
  getYggdrasilAdvanceSeconds,
  hasPendingDailyReward,
  isInstantPowerUp,
  isTimedPowerUpActive,
  pickGhostCandleFactory,
  shouldResetDailyStreak,
} from "@/game/power-ups";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { completeProductionCycle } from "@/store/atoms/factories";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { getInventoryState, inventoryAtom } from "@/store/atoms/inventory";
import { getEffectiveProductionTimeForActivePowerUp } from "@/store/atoms/power-ups.selectors";
import {
  type FactoryTickState,
  productionTicksAtom,
} from "@/store/atoms/production-ticks.atom";

const setInventory = (
  updater: (
    state: ReturnType<typeof getInventoryState>
  ) => ReturnType<typeof getInventoryState>
) => {
  store.set(inventoryAtom, (previous) => updater(previous));
};

export const refreshDailyStreakState = () => {
  const today = getLocalDateString();

  setInventory((state) => {
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
  const state = getInventoryState();

  if (!hasPendingDailyReward(state.lastClaimLocalDate, today)) {
    return false;
  }

  const offer = getDailyRewardOffer(state.dailyStreak);

  setInventory((current) => ({
    ...current,
    slots: addInventorySlot(current.slots, {
      powerUpId: offer.powerUpId,
      tier: offer.tier,
    }),
    dailyStreak: current.dailyStreak + 1,
    lastClaimLocalDate: today,
  }));

  sound.play("upgrade");

  return true;
};

export const refreshExpiredPowerUps = () => {
  const state = getInventoryState();
  const { activePowerUp } = state;

  if (!activePowerUp) {
    return;
  }

  if (isTimedPowerUpActive(activePowerUp)) {
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
  ghostCandleFactory: FactoryType | null,
  now: number
): ActivePowerUp => {
  const durationMs = getPowerUpDurationMs(powerUpId);

  return {
    powerUpId,
    tier,
    ghostCandleFactory,
    expiresAt: durationMs == null ? null : now + durationMs,
  };
};

const advanceFactoryTicksBySeconds = (seconds: number) => {
  const factories = store.get(factoriesAtom);
  const ticks = store.get(productionTicksAtom);
  const activePowerUp = getInventoryState().activePowerUp;
  const nextTicks = { ...ticks };

  for (const factory of FACTORY_TYPES) {
    const tick = ticks[factory];
    const factoryState = factories[factory];
    const isGhostActive =
      activePowerUp?.powerUpId === "ghostCandle" &&
      activePowerUp.ghostCandleFactory === factory;
    const isActive = isFactoryProductionActive(factoryState) || isGhostActive;

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
): boolean => {
  if (powerUpId === "cauldronDrop") {
    setInventory((state) => ({
      ...state,
      pendingCauldronDrop: true,
    }));
    return true;
  }

  if (powerUpId === "yggdrasilTear") {
    advanceFactoryTicksBySeconds(getYggdrasilAdvanceSeconds(tier));
    return true;
  }

  return false;
};

const startGhostCandleProduction = (factory: FactoryType) => {
  const tick = store.get(productionTicksAtom)[factory];

  if (tick.isRunning) {
    return;
  }

  store.set(productionTicksAtom, (previous) => ({
    ...previous,
    [factory]: {
      cycleKey: previous[factory].cycleKey + 1,
      isRunning: true,
      seconds: getEffectiveProductionTimeForActivePowerUp(
        FACTORY_DATA[factory].productionTime
      ),
    } satisfies FactoryTickState,
  }));
};

export const activatePowerUpAtSlot = (slotIndex: number): boolean => {
  refreshExpiredPowerUps();

  const state = getInventoryState();
  const slot = state.slots[slotIndex];

  if (!slot) {
    return false;
  }

  if (!canActivatePowerUp(state.activePowerUp, slot.count)) {
    return false;
  }

  const { powerUpId, tier } = slot;
  const now = Date.now();

  if (isInstantPowerUp(powerUpId)) {
    const activated = activateInstantPowerUp(powerUpId, tier);

    if (!activated) {
      return false;
    }

    setInventory((current) => ({
      ...current,
      slots: consumeInventorySlot(current.slots, slotIndex),
    }));

    sound.play("upgrade");

    return true;
  }

  const factories = store.get(factoriesAtom);
  let ghostCandleFactory: FactoryType | null = null;

  if (powerUpId === "ghostCandle") {
    ghostCandleFactory = pickGhostCandleFactory(factories);

    if (!ghostCandleFactory) {
      return false;
    }
  }

  setInventory((current) => ({
    ...current,
    slots: consumeInventorySlot(current.slots, slotIndex),
    activePowerUp: createTimedActivePowerUp(
      powerUpId,
      tier,
      ghostCandleFactory,
      now
    ),
  }));

  if (ghostCandleFactory) {
    startGhostCandleProduction(ghostCandleFactory);
  }

  sound.play("upgrade");

  return true;
};

export const consumePendingCauldronDrop = (): boolean => {
  const state = getInventoryState();

  if (!state.pendingCauldronDrop) {
    return false;
  }

  setInventory((current) => ({
    ...current,
    pendingCauldronDrop: false,
  }));

  return true;
};

export const isGhostCandleFactoryActive = (factory: FactoryType): boolean => {
  refreshExpiredPowerUps();

  const activePowerUp = getInventoryState().activePowerUp;

  return (
    isTimedPowerUpActive(activePowerUp) &&
    activePowerUp?.powerUpId === "ghostCandle" &&
    activePowerUp.ghostCandleFactory === factory
  );
};

export const isFactoryDrivenByScheduler = (
  factory: FactoryType,
  factoryState: {
    isAutomated: boolean;
    isProducing: boolean;
    isUnlocked: boolean;
  }
): boolean =>
  isFactoryProductionActive(factoryState) ||
  isGhostCandleFactoryActive(factory);
