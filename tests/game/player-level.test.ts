import { describe, expect, it } from "vitest";
import { PLAYER_LEVEL } from "@/config/player-level";
import { GOD_DATA } from "@/content/gods";
import {
  getGodLevelPoints,
  getPlayerLevel,
  getPlayerLevelProgress,
  getWalletLevelPoints,
} from "@/game/player-level";
import {
  createInitialMissionCounters,
  type MissionGameSnapshot,
} from "@/game/types";
import { D } from "@/utils/decimal";

const createSnapshot = (
  overrides: Partial<MissionGameSnapshot> = {}
): MissionGameSnapshot => ({
  statistics: {
    goldEarned: "0",
    goldSpent: "0",
    factories: {
      grain: { goldEarned: "0", goldSpent: "0", quantity: 0 },
      wine: { goldEarned: "0", goldSpent: "0", quantity: 0 },
      iron: { goldEarned: "0", goldSpent: "0", quantity: 0 },
      crossbow: { goldEarned: "0", goldSpent: "0", quantity: 0 },
      longship: { goldEarned: "0", goldSpent: "0", quantity: 0 },
      reliquary: { goldEarned: "0", goldSpent: "0", quantity: 0 },
    },
  },
  factories: {},
  gods: { invoked: [] },
  walletGold: D(0),
  counters: createInitialMissionCounters(),
  ...overrides,
});

describe("player level", () => {
  it("returns level 1 with no wallet gold and no invoked gods", () => {
    expect(getPlayerLevel(createSnapshot())).toBe(PLAYER_LEVEL.minLevel);
  });

  it("increases level with wallet gold", () => {
    const low = getPlayerLevel(createSnapshot({ walletGold: D("1e3") }));
    const high = getPlayerLevel(createSnapshot({ walletGold: D("1e12") }));

    expect(high).toBeGreaterThan(low);
  });

  it("increases level with invoked gods", () => {
    const none = getPlayerLevel(createSnapshot());
    const oneGod = getPlayerLevel(
      createSnapshot({ gods: { invoked: [GOD_DATA[0].id] } })
    );

    expect(oneGod).toBeGreaterThan(none);
  });

  it("never exceeds max level", () => {
    expect(
      getPlayerLevel(
        createSnapshot({
          walletGold: D("1e100"),
          gods: { invoked: GOD_DATA.map((god) => god.id) },
        })
      )
    ).toBe(PLAYER_LEVEL.maxLevel);
  });

  it("keeps a god-invoke floor when wallet resets to zero", () => {
    const afterInvoke = getPlayerLevel(
      createSnapshot({
        walletGold: D(0),
        gods: { invoked: [GOD_DATA[0].id] },
      })
    );

    expect(afterInvoke).toBeGreaterThan(PLAYER_LEVEL.minLevel);
  });

  it("maps god and wallet points within configured caps", () => {
    expect(getGodLevelPoints(0)).toBe(0);
    expect(getGodLevelPoints(GOD_DATA.length)).toBe(PLAYER_LEVEL.godsMaxPoints);
    expect(getWalletLevelPoints(D(0))).toBe(0);
    expect(getWalletLevelPoints(D("1e18"))).toBeCloseTo(
      PLAYER_LEVEL.walletMaxPoints
    );
  });

  it("returns normalized progress between min and max level", () => {
    expect(getPlayerLevelProgress(1)).toBe(0);
    expect(getPlayerLevelProgress(100)).toBe(1);
  });
});
