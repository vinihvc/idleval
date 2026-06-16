import type { FactoryType } from "@/content/factories";
import type { GodId } from "@/content/gods";
import type { MissionId } from "@/content/missions";
import type { GameValue } from "@/utils/decimal";

export interface FactoryPersistedState {
  /** Number of factory units owned by the player. */
  amount: number;
  /** Whether the factory runs automatically without manual clicks. */
  isAutomated: boolean;
  /** Whether the factory is currently running a manual production cycle. */
  isProducing: boolean;
  /** Whether the factory tier is available to use. */
  isUnlocked: boolean;
  /** Whether the factory production upgrade has been purchased. */
  isUpgraded: boolean;
  /** Epoch ms when the current manual cycle started; null when idle. */
  productionStartedAt: number | null;
  /** Effective cycle duration (seconds) locked at manual cycle start; null when idle. */
  productionDurationSec: number | null;
}

export type FactoriesPersistedState = Partial<
  Record<FactoryType, FactoryPersistedState>
>;

export type PurchaseAmount = 1 | 10 | 50 | "max";

export interface MissionFactoryStatistics {
  goldEarned: string;
  goldSpent: string;
  quantity: number;
}

export interface MissionStatisticsSnapshot {
  factories: Record<FactoryType, MissionFactoryStatistics>;
  goldEarned: string;
  goldSpent: string;
}

export interface MissionCounters {
  dailyRewardsClaimed: number;
  powerUpsActivated: number;
  productionCyclesCompleted: number;
}

export const createInitialMissionCounters = (): MissionCounters => ({
  productionCyclesCompleted: 0,
  powerUpsActivated: 0,
  dailyRewardsClaimed: 0,
});

export interface MissionsPersistedState {
  activeSlotIds: MissionId[];
  claimedIds: MissionId[];
  counters: MissionCounters;
  readyToClaimIds: MissionId[];
  renownPercent: number;
}

export const createInitialMissionsState = (): MissionsPersistedState => ({
  activeSlotIds: [],
  claimedIds: [],
  readyToClaimIds: [],
  counters: createInitialMissionCounters(),
  renownPercent: 0,
});

export interface MissionGameSnapshot {
  counters: MissionCounters;
  factories: FactoriesPersistedState;
  gods: { invoked: GodId[] };
  statistics: MissionStatisticsSnapshot;
  walletGold: GameValue;
}

export type MissionSlotStatus = "in_progress" | "ready" | "claimed";

export interface MissionSlotView {
  id: MissionId;
  order: number;
  progress: MissionProgress;
  status: MissionSlotStatus;
}

export interface MissionProgress {
  current: number;
  ratio: number;
  target: number;
}
