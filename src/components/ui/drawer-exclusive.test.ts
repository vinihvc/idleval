import { describe, expect, it, vi } from "vitest";
import { notifyDrawerOpen, registerDrawer } from "./drawer-exclusive";

describe("drawer-exclusive", () => {
  it("closes other drawers when one opens", () => {
    const closeA = vi.fn();
    const closeB = vi.fn();

    const unregisterA = registerDrawer("a", closeA);
    registerDrawer("b", closeB);

    notifyDrawerOpen("b");

    expect(closeA).toHaveBeenCalledOnce();
    expect(closeB).not.toHaveBeenCalled();

    unregisterA();
  });

  it("does not close the drawer that is opening", () => {
    const closeA = vi.fn();

    registerDrawer("a", closeA);

    notifyDrawerOpen("a");

    expect(closeA).not.toHaveBeenCalled();
  });
});
