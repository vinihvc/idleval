import { beforeEach, describe, expect, it } from "vitest";
import { createInitialMissionsState } from "@/game/types";
import { store } from "@/providers/store";
import { factoriesAtom, initialData } from "@/store/atoms/factories.atom";
import { godsAtom } from "@/store/atoms/gods";
import { missionsAtom } from "@/store/atoms/missions.atom";
import { purchaseModeAtom } from "@/store/atoms/purchase-mode";
import { sessionAtom } from "@/store/atoms/session";
import { statisticsAtom } from "@/store/atoms/statistics";
import { walletAtom } from "@/store/atoms/wallet";
import {
  offlineCycleProgressAtom,
  offlineSummaryAtom,
} from "@/store/offline-earning";
import { resetGame, resetRunProgress } from "@/store/reset";
import { seedGold } from "@/store/test-utils";
import { D, deserializeDecimal } from "@/utils/decimal";

describe("reset", () => {
  beforeEach(() => {
    resetGame();
  });

  it("resetRunProgress clears wallet, factories, and purchase mode", () => {
    seedGold(5000);
    store.set(purchaseModeAtom, { amountToBuy: "max" });
    store.set(factoriesAtom, (previous) => ({
      ...previous,
      grain: {
        ...previous.grain,
        amount: 10,
        isUpgraded: true,
      },
    }));

    resetRunProgress();

    expect(deserializeDecimal(store.get(walletAtom).gold).toNumber()).toBe(0);
    expect(store.get(factoriesAtom)).toEqual(initialData);
    expect(store.get(purchaseModeAtom).amountToBuy).toBe(1);
  });

  it("resetGame clears run progress, gods, statistics, session, and offline state", () => {
    seedGold(5000);
    store.set(godsAtom, { invoked: ["huangdi", "dagda"] });
    store.set(statisticsAtom, (previous) => ({
      ...previous,
      goldEarned: "999",
    }));
    store.set(offlineCycleProgressAtom, { grain: 1 });
    store.set(offlineSummaryAtom, {
      elapsedMs: 60_000,
      results: [],
      totalGold: D(100),
    });
    store.set(missionsAtom, (previous) => ({
      ...previous,
      claimedIds: ["mission-001"],
      renownPercent: 5,
    }));

    resetGame();

    expect(deserializeDecimal(store.get(walletAtom).gold).toNumber()).toBe(0);
    expect(store.get(godsAtom).invoked).toEqual([]);
    expect(store.get(statisticsAtom).goldEarned).toBe("0");
    expect(store.get(offlineCycleProgressAtom)).toEqual({});
    expect(store.get(offlineSummaryAtom)).toBeNull();
    expect(store.get(missionsAtom)).toEqual(createInitialMissionsState());
    expect(store.get(sessionAtom).lastSeenAt).not.toBeNull();
  });
});
