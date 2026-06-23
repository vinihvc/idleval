import type { FactoryType } from "@/content/factories";
import { seedFactory } from "@/store/test-utils";

export const seedUnlockedFactory = (type: FactoryType) => {
  seedFactory(type, { isUnlocked: true, amount: 1 });
};

interface TestLocator {
  click: () => Promise<void>;
}

export const openDialog = async (
  screen: {
    getByRole: (role: string, options?: { name?: string }) => TestLocator;
  },
  triggerLabel: string
) => {
  const trigger = screen.getByRole("button", { name: triggerLabel });
  await trigger.click();
  return trigger;
};

export const setLocalStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};

export const removeLocalStorage = (key: string) => {
  window.localStorage.removeItem(key);
};
