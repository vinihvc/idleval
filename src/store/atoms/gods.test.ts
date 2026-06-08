import { beforeEach, describe, expect, it, vi } from "vitest";
import { GOD_DATA } from "@/content/gods";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { factoriesAtom, initialData } from "@/store/atoms/factories.atom";
import {
  canInvokeGod,
  getGodsProductionMultiplier,
  godsAtom,
  invokeGod,
  normalizeGodsState,
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

  it("normalizeGodsState migrates legacy count saves", () => {
    expect(normalizeGodsState({ count: 2 })).toEqual({
      invoked: ["huangdi", "dagda"],
    });
  });

  it("invokeGod migrates legacy gods state before invoking", () => {
    store.set(godsAtom, { count: 1 } as never);
    seedGold(GOD_DATA[1].goldRequired);

    expect(invokeGod(1)).toBe(true);

    expect(store.get(godsAtom).invoked).toEqual(["huangdi", "dagda"]);
  });

  it("getGodsProductionMultiplier returns 1 with no invoked gods", () => {
    expect(getGodsProductionMultiplier().toNumber()).toBe(1);
  });

  it("canInvokeGod is false without enough gold", () => {
    expect(canInvokeGod()).toBe(false);
  });

  it("canInvokeGod is true with enough gold for any uninvoked god", () => {
    seedGold(GOD_DATA[0].goldRequired);

    expect(canInvokeGod()).toBe(true);
  });

  it("invokeGod fails without enough gold", () => {
    const beforeInvoked = store.get(godsAtom).invoked;

    expect(invokeGod(0)).toBe(false);
    expect(store.get(godsAtom).invoked).toEqual(beforeInvoked);
    expect(vi.mocked(sound.play)).not.toHaveBeenCalled();
  });

  it("invokeGod increments invoked gods, resets run progress, and preserves statistics", () => {
    seedGold(GOD_DATA[0].goldRequired);
    store.set(statisticsAtom, (previous) => ({
      ...previous,
      goldEarned: "5000",
    }));
    store.set(factoriesAtom, (previous) => ({
      ...previous,
      grain: { ...previous.grain, amount: 5, isUpgraded: true },
    }));

    expect(invokeGod(0)).toBe(true);

    expect(store.get(godsAtom).invoked).toEqual(["huangdi"]);
    expect(store.get(factoriesAtom)).toEqual(initialData);
    expect(deserializeDecimal(store.get(walletAtom).gold).toNumber()).toBe(0);
    expect(store.get(statisticsAtom).goldEarned).toBe("5000");
    expect(vi.mocked(sound.play)).toHaveBeenCalledWith("upgrade");
    expect(getGodsProductionMultiplier().toNumber()).toBe(
      GOD_DATA[0].productionMultiplier
    );
  });

  it("invokeGod can target a later god without invoking earlier ones", () => {
    seedGold(GOD_DATA[1].goldRequired);

    expect(invokeGod(1)).toBe(true);

    expect(store.get(godsAtom).invoked).toEqual(["dagda"]);
    expect(getGodsProductionMultiplier().toNumber()).toBe(
      GOD_DATA[1].productionMultiplier
    );
  });
});
