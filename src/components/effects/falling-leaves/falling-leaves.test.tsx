import { beforeEach, describe, expect, test, vi } from "vitest";
import { triggerFallingLeaves } from "@/store/atoms/gods";
import { renderWithProviders } from "@/test/render-with-providers";

const { fireFallingLeavesMock } = vi.hoisted(() => ({
  fireFallingLeavesMock: vi.fn(),
}));

vi.mock("@/components/effects/falling-leaves/fire-falling-leaves", () => ({
  fireFallingLeaves: fireFallingLeavesMock,
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

  test("calls fireFallingLeaves when triggered", async () => {
    await renderWithProviders(<FallingLeaves />);

    triggerFallingLeaves();

    await expect.poll(() => fireFallingLeavesMock.mock.calls.length).toBe(1);
  });

  test("does not refire when remounted with the same trigger value", async () => {
    const screen = await renderWithProviders(<FallingLeaves key="initial" />);

    triggerFallingLeaves();

    await expect.poll(() => fireFallingLeavesMock.mock.calls.length).toBe(1);

    await screen.rerender(<FallingLeaves key="remount" />);

    await expect.poll(() => fireFallingLeavesMock.mock.calls.length).toBe(1);
  });

  test("fires again on a subsequent trigger", async () => {
    await renderWithProviders(<FallingLeaves />);

    triggerFallingLeaves();
    await expect.poll(() => fireFallingLeavesMock.mock.calls.length).toBe(1);

    triggerFallingLeaves();
    await expect.poll(() => fireFallingLeavesMock.mock.calls.length).toBe(2);
  });
});
