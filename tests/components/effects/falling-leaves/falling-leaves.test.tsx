import { beforeEach, describe, expect, test, vi } from "vitest";
import { getGodConfettiColor } from "@/content/gods";
import { triggerFallingLeaves } from "@/store/atoms/gods";
import { renderWithProviders } from "@/test/render-with-providers";

const { fireFallingLeavesMock, createMock, resetMock } = vi.hoisted(() => ({
  fireFallingLeavesMock: vi.fn(),
  createMock: vi.fn(() => Object.assign(vi.fn(), { reset: vi.fn() })),
  resetMock: vi.fn(),
}));

vi.mock("canvas-confetti", () => ({
  default: Object.assign(vi.fn(), {
    create: createMock,
    reset: resetMock,
  }),
}));

vi.mock("@/components/effects/falling-leaves/fire-falling-leaves", () => ({
  fireFallingLeaves: fireFallingLeavesMock,
  setFallingLeavesConfettiLauncher: vi.fn(),
  FALLING_LEAVES_Z_INDEX: 9999,
}));

import {
  FallingLeaves,
  resetFallingLeavesTriggerForTests,
} from "@/components/effects/falling-leaves/falling-leaves";

describe("FallingLeaves", () => {
  beforeEach(() => {
    fireFallingLeavesMock.mockClear();
    resetFallingLeavesTriggerForTests();
  });

  test("renders a non-interactive full-screen overlay", async () => {
    const screen = await renderWithProviders(<FallingLeaves />);

    const overlay = screen.container.querySelector('[aria-hidden="true"]');

    expect(overlay).not.toBeNull();
    expect(overlay).toHaveClass("pointer-events-none", "fixed", "inset-0");
    expect(overlay?.querySelector("canvas")).toHaveClass(
      "pointer-events-none",
      "size-full"
    );
  });

  test("calls fireFallingLeaves with the invoked god color when triggered", async () => {
    await renderWithProviders(<FallingLeaves />);

    triggerFallingLeaves("shango");

    await expect.poll(() => fireFallingLeavesMock.mock.calls.length).toBe(1);
    expect(fireFallingLeavesMock).toHaveBeenCalledWith(
      getGodConfettiColor("shango")
    );
  });

  test("does not replay on remount", async () => {
    const screen = await renderWithProviders(<FallingLeaves key="initial" />);

    triggerFallingLeaves("dagda");

    await expect.poll(() => fireFallingLeavesMock.mock.calls.length).toBe(1);

    await screen.rerender(<FallingLeaves key="remount" />);

    await expect.poll(() => fireFallingLeavesMock.mock.calls.length).toBe(1);
  });

  test("fires again when trigger increments", async () => {
    await renderWithProviders(<FallingLeaves />);

    triggerFallingLeaves("huangdi");
    await expect.poll(() => fireFallingLeavesMock.mock.calls.length).toBe(1);

    triggerFallingLeaves("indra");
    await expect.poll(() => fireFallingLeavesMock.mock.calls.length).toBe(2);
    expect(fireFallingLeavesMock).toHaveBeenLastCalledWith(
      getGodConfettiColor("indra")
    );
  });
});
