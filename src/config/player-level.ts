export const PLAYER_LEVEL = {
  maxLevel: 100,
  minLevel: 1,
  /** Deuses invocados → até ~45 pontos (0..6 → 0..45) */
  godsMaxPoints: 45,
  /** log10(wallet) mapeado de 1e3..1e18 → até ~55 pontos */
  walletLogMin: 3,
  walletLogMax: 18,
  walletMaxPoints: 55,
  /** Objetivos: mult = objectiveBase ^ (level - 1) */
  missionObjectiveBase: 1.012,
  /** Ouro (generoso): mult = goldBase ^ (level - 1) */
  missionGoldBase: 1.035,
  /** +1 power-up a cada N níveis (além do count do catálogo) */
  powerUpBonusEveryLevels: 20,
} as const;
