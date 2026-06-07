import { beforeEach, describe, expect, it, vi } from "vitest";
import { GODS } from "@/content/gods";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { factoriesAtom, initialData } from "@/store/atoms/factories.atom";
import {
  canInvokeGod,
  getGodsProductionMultiplier,
  godsAtom,
  invokeGod,
} from "@/store/atoms/gods";
import { statisticsAtom } from "@/store/atoms/statistics";
import { walletAtom } from "@/store/atoms/wallet";
import { resetGame } from "@/store/reset";
import { seedGold } from "@/store/test-utils";
import { deserializeDecimal } from "@/utils/decimal";

vi.mock("@/providers/sound", () => ({
  sound: { play: vi.fn() },
}));

describe("gods store", () => {
  beforeEach(() => {
    resetGame();
    vi.mocked(sound.play).mockClear();
  });

  it("getGodsProductionMultiplier returns 1 at level zero", () => {
    expect(getGodsProductionMultiplier().toNumber()).toBe(1);
  });

  it("canInvokeGod is false without enough gold", () => {
    expect(canInvokeGod()).toBe(false);
  });

  it("canInvokeGod is true with enough gold at level zero", () => {
    seedGold(GODS[0].goldRequired);

    expect(canInvokeGod()).toBe(true);
  });

  it("invokeGod fails without enough gold", () => {
    const beforeCount = store.get(godsAtom).count;

    expect(invokeGod()).toBe(false);
    expect(store.get(godsAtom).count).toBe(beforeCount);
    expect(vi.mocked(sound.play)).not.toHaveBeenCalled();
  });

  it("invokeGod increments count, resets run progress, and preserves statistics", () => {
    seedGold(GODS[0].goldRequired);
    store.set(statisticsAtom, (previous) => ({
      ...previous,
      goldEarned: "5000",
    }));
    store.set(factoriesAtom, (previous) => ({
      ...previous,
      grain: { ...previous.grain, amount: 5, isUpgraded: true },
    }));

    expect(invokeGod()).toBe(true);

    expect(store.get(godsAtom).count).toBe(1);
    expect(store.get(factoriesAtom)).toEqual(initialData);
    expect(deserializeDecimal(store.get(walletAtom).gold).toNumber()).toBe(0);
    expect(store.get(statisticsAtom).goldEarned).toBe("5000");
    expect(vi.mocked(sound.play)).toHaveBeenCalledWith("upgrade");
    expect(getGodsProductionMultiplier().toNumber()).toBe(
      GODS[0].productionMultiplier
    );
  });
});
