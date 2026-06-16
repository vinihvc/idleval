import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { OfflineEarning } from "@/providers/offline-earning/index";
import { StoreProvider, store } from "@/providers/store";
import { sessionAtom } from "@/store/atoms/session";
import { getGold } from "@/store/atoms/wallet";
import { seedFactory } from "@/store/test-utils";

describe("OfflineEarning provider", () => {
  test("applies offline earning when the browser regains focus after a long visible gap", async () => {
    seedFactory("grain", {
      amount: 2,
      isAutomated: true,
      isUnlocked: true,
    });

    const screen = await render(
      <StoreProvider>
        <OfflineEarning>
          <div>ready</div>
        </OfflineEarning>
      </StoreProvider>
    );

    await expect.element(screen.getByText("ready")).toBeInTheDocument();

    store.set(sessionAtom, { lastSeenAt: Date.now() - 120_000 });
    window.dispatchEvent(new Event("focus"));

    await expect.poll(() => getGold().gt(0)).toBe(true);
  });
});
