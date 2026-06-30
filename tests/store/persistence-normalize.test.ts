import { describe, expect, it } from "vitest";
import { normalizeGodsState } from "@/store/atoms/gods";
import { normalizeSessionState } from "@/store/atoms/session";
import { normalizeSettings } from "@/store/atoms/settings";
import { normalizeWalletState } from "@/store/atoms/wallet";
import { D, serializeDecimal } from "@/utils/decimal";

describe("persistence normalize", () => {
  describe("normalizeWalletState", () => {
    it("returns default for nullish input", () => {
      expect(normalizeWalletState(null).gold).toBe(serializeDecimal(D(0)));
    });

    it("coerces invalid gold to zero", () => {
      expect(normalizeWalletState({ gold: 42 }).gold).toBe(
        serializeDecimal(D(0))
      );
      expect(normalizeWalletState({ gold: "not-a-number" }).gold).toBe(
        serializeDecimal(D(0))
      );
    });

    it("preserves valid serialized gold", () => {
      const gold = serializeDecimal(D("1e6"));
      expect(normalizeWalletState({ gold }).gold).toBe(gold);
    });
  });

  describe("normalizeSessionState", () => {
    it("returns null lastSeenAt for invalid input", () => {
      expect(normalizeSessionState(undefined)).toEqual({ lastSeenAt: null });
      expect(normalizeSessionState({ lastSeenAt: "bad" })).toEqual({
        lastSeenAt: null,
      });
    });

    it("preserves finite lastSeenAt", () => {
      expect(normalizeSessionState({ lastSeenAt: 1_700_000_000 })).toEqual({
        lastSeenAt: 1_700_000_000,
      });
    });
  });

  describe("normalizeGodsState", () => {
    it("filters unknown god ids", () => {
      expect(
        normalizeGodsState({ invoked: ["huangdi", "not-a-god"] }).invoked
      ).toEqual(["huangdi"]);
    });

    it("returns empty invoked for non-array", () => {
      expect(normalizeGodsState({ invoked: "huangdi" }).invoked).toEqual([]);
    });
  });

  describe("normalizeSettings", () => {
    it("clamps volumes to 0–1", () => {
      expect(
        normalizeSettings({ musicVolume: 2, sfxVolume: -1 })
      ).toMatchObject({
        musicVolume: 1,
        sfxVolume: 0,
      });
    });

    it("uses defaults for missing fields", () => {
      expect(normalizeSettings(null)).toEqual({
        musicVolume: 0.8,
        sfxVolume: 0.8,
      });
    });
  });
});
