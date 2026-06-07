const closers = new Map<string, () => void>();

export const registerDrawer = (
  id: string,
  onClose: () => void
): (() => void) => {
  closers.set(id, onClose);

  return () => {
    closers.delete(id);
  };
};

export const notifyDrawerOpen = (id: string): void => {
  for (const [otherId, onClose] of closers) {
    if (otherId !== id) {
      onClose();
    }
  }
};
