import { beforeEach, describe, expect, it } from "vitest";
import { store } from "@/providers/store";
import {
  canOpenDialog,
  closeDialog,
  DIALOG_IDS,
  DIALOG_PRIORITY,
  dialogsAtom,
  getFactoryDialogId,
  getOpenDialogId,
  openDialog,
  toggleDialog,
} from "@/store/atoms/dialogs";
import { isNotificationVisible } from "@/store/atoms/notifications";
import { resetGame } from "@/store/reset";
import { seedGold } from "@/store/test-utils";

describe("dialogs", () => {
  beforeEach(() => {
    resetGame();
  });

  it("opening a dialog closes the previous dialog", () => {
    openDialog(DIALOG_IDS.upgrades);
    openDialog(DIALOG_IDS.managers);

    expect(getOpenDialogId()).not.toBe(DIALOG_IDS.upgrades);
    expect(getOpenDialogId()).toBe(DIALOG_IDS.managers);
  });

  it("defines dialog priority by array order", () => {
    expect(DIALOG_PRIORITY).toEqual([
      DIALOG_IDS.welcome,
      DIALOG_IDS.offlineEarning,
    ]);
  });

  it("toggleDialog opens and closes the same dialog", () => {
    toggleDialog(DIALOG_IDS.upgrades);
    expect(store.get(dialogsAtom)).toBe(DIALOG_IDS.upgrades);

    toggleDialog(DIALOG_IDS.upgrades);
    expect(store.get(dialogsAtom)).toBeNull();
  });

  it("closeDialog does not close a different active dialog", () => {
    openDialog(DIALOG_IDS.managers);
    closeDialog(DIALOG_IDS.upgrades);

    expect(store.get(dialogsAtom)).toBe(DIALOG_IDS.managers);
  });

  it("factory dialog ids include the factory type", () => {
    expect(getFactoryDialogId("grain")).toBe("factory:grain");
    expect(getFactoryDialogId("wine")).toBe("factory:wine");
    expect(getFactoryDialogId("grain")).not.toBe(getFactoryDialogId("wine"));
  });

  it("resetGame clears the open dialog", () => {
    openDialog(DIALOG_IDS.upgrades);

    resetGame();

    expect(store.get(dialogsAtom)).toBeNull();
  });

  it("does not open a lower-priority dialog over a higher-priority dialog", () => {
    openDialog(DIALOG_IDS.welcome);

    openDialog(DIALOG_IDS.offlineEarning);

    expect(store.get(dialogsAtom)).toBe(DIALOG_IDS.welcome);
  });

  it("opens a higher-priority dialog over a lower-priority dialog", () => {
    openDialog(DIALOG_IDS.dailyReward);

    openDialog(DIALOG_IDS.offlineEarning);

    expect(store.get(dialogsAtom)).toBe(DIALOG_IDS.offlineEarning);
  });

  it("does not let an unlisted dialog replace a prioritized dialog", () => {
    openDialog(DIALOG_IDS.offlineEarning);

    openDialog(DIALOG_IDS.settings);

    expect(store.get(dialogsAtom)).toBe(DIALOG_IDS.offlineEarning);
  });

  it("lets a prioritized dialog replace an unlisted dialog", () => {
    openDialog(DIALOG_IDS.settings);

    openDialog(DIALOG_IDS.offlineEarning);

    expect(store.get(dialogsAtom)).toBe(DIALOG_IDS.offlineEarning);
  });

  it("exposes priority checks without changing state", () => {
    expect(canOpenDialog(DIALOG_IDS.settings, DIALOG_IDS.welcome)).toBe(false);
    expect(canOpenDialog(DIALOG_IDS.welcome, DIALOG_IDS.settings)).toBe(true);
    expect(
      canOpenDialog(DIALOG_IDS.offlineEarning, DIALOG_IDS.dailyReward)
    ).toBe(true);
  });

  it("dismisses a mapped notification when opening its dialog", () => {
    seedGold(100_000);

    expect(isNotificationVisible("upgrades")).toBe(true);

    openDialog(DIALOG_IDS.upgrades);

    expect(isNotificationVisible("upgrades")).toBe(false);
  });

  it("dismisses a mapped notification when toggling its dialog open", () => {
    expect(isNotificationVisible("daily")).toBe(true);

    toggleDialog(DIALOG_IDS.dailyReward);

    expect(isNotificationVisible("daily")).toBe(false);
  });
});
