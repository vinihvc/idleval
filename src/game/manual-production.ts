import type { FactoryPersistedState } from "./types";

export type ManualProductionReconcileResult =
  | { kind: "idle" }
  | { kind: "complete" }
  | { kind: "in_progress"; secondsRemaining: number };

/**
 * Reconciles a manual production cycle against wall-clock time.
 * At most one cycle completes per reconciliation (manual tap semantics).
 *
 * @example
 * reconcileManualCycle(
 *   { isProducing: true, productionStartedAt: 0, productionDurationSec: 10, ... },
 *   12_000
 * )
 * // => { kind: "complete" }
 */
export const reconcileManualCycle = (
  state: FactoryPersistedState,
  now: number
): ManualProductionReconcileResult => {
  if (
    !state.isProducing ||
    state.isAutomated ||
    state.productionStartedAt == null ||
    state.productionDurationSec == null
  ) {
    return { kind: "idle" };
  }

  const durationSec = state.productionDurationSec;

  if (now <= state.productionStartedAt) {
    return {
      kind: "in_progress",
      secondsRemaining: durationSec,
    };
  }

  const elapsedSec = (now - state.productionStartedAt) / 1000;

  if (elapsedSec >= durationSec) {
    return { kind: "complete" };
  }

  return {
    kind: "in_progress",
    secondsRemaining: Math.max(1, Math.ceil(durationSec - elapsedSec)),
  };
};

/**
 * Clears manual cycle fields after completion or invalid state.
 */
export const clearManualProductionFields = (
  state: FactoryPersistedState
): FactoryPersistedState => ({
  ...state,
  isProducing: false,
  productionStartedAt: null,
  productionDurationSec: null,
});
