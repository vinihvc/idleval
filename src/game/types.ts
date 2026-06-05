import type { FactoryType } from "@/content/factories";

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
}

export type FactoriesPersistedState = Partial<
  Record<FactoryType, FactoryPersistedState>
>;

export type PurchaseAmount = 1 | 10 | 50 | "max";
