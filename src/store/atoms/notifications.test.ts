import { beforeEach, describe, expect, it } from "vitest";
import { store } from "@/providers/store";
import {
  clearDismissed,
  dismissNotification,
  getActiveNotificationsByKey,
  initialNotificationsState,
  isNotificationVisible,
  notificationsAtom,
  syncNotificationDismissals,
} from "@/store/atoms/notifications";
import { claimDailyReward } from "@/store/atoms/power-ups.actions";
import { resetGame } from "@/store/reset";
import { seedGold } from "@/store/test-utils";

describe("notifications", () => {
  beforeEach(() => {
    resetGame();
  });

  it("shows daily notification when reward is pending and not dismissed", () => {
    expect(isNotificationVisible("daily")).toBe(true);
  });

  it("hides notification after dismiss while condition stays active", () => {
    seedGold(100_000);

    expect(isNotificationVisible("upgrades")).toBe(true);

    dismissNotification("upgrades");

    expect(isNotificationVisible("upgrades")).toBe(false);
    expect(store.get(notificationsAtom).dismissed.upgrades).toBe(true);
  });

  it("clears dismissed state so notification can show again", () => {
    dismissNotification("daily");

    expect(isNotificationVisible("daily")).toBe(false);

    clearDismissed("daily");

    expect(isNotificationVisible("daily")).toBe(true);
    expect(store.get(notificationsAtom).dismissed.daily).toBeUndefined();
  });

  it("syncNotificationDismissals clears dismissed when notification becomes inactive", () => {
    seedGold(100_000);

    dismissNotification("upgrades");

    expect(store.get(notificationsAtom).dismissed.upgrades).toBe(true);

    syncNotificationDismissals({
      ...getActiveNotificationsByKey(),
      upgrades: false,
    });

    expect(store.get(notificationsAtom).dismissed.upgrades).toBeUndefined();
  });

  it("syncNotificationDismissals keeps dismissed while notification stays active", () => {
    seedGold(100_000);

    dismissNotification("upgrades");

    syncNotificationDismissals(getActiveNotificationsByKey());

    expect(store.get(notificationsAtom).dismissed.upgrades).toBe(true);
  });

  it("hides notification when condition becomes inactive", () => {
    dismissNotification("daily");

    expect(claimDailyReward()).toBe(true);
    expect(isNotificationVisible("daily")).toBe(false);
  });

  it("resets dismissed state on resetGame", () => {
    dismissNotification("upgrades");
    dismissNotification("daily");

    resetGame();

    expect(store.get(notificationsAtom)).toEqual(initialNotificationsState());
    expect(isNotificationVisible("daily")).toBe(true);
  });
});
