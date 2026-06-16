import React from "react";

type InstallPromptOutcome = "accepted" | "dismissed";

interface InstallPromptChoice {
  outcome: InstallPromptOutcome;
  platform: string;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  readonly userChoice: Promise<InstallPromptChoice>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

interface InternalInstallPromptState {
  isDismissed: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  promptEvent: BeforeInstallPromptEvent | null;
}

export interface InstallPromptState {
  canInstall: boolean;
  install: () => Promise<InstallPromptOutcome | undefined>;
  isInstalled: boolean;
  isInstalling: boolean;
  showIosInstructions: boolean;
}

const IOS_DEVICE_PATTERN = /iPad|iPhone|iPod/;
const IOS_NON_SAFARI_PATTERN = /CriOS|FxiOS|EdgiOS|OPiOS/;

let isInitialized = false;
const listeners = new Set<() => void>();
let installPromptState: InternalInstallPromptState = {
  isDismissed: false,
  isInstalled: false,
  isInstalling: false,
  promptEvent: null,
};

export const isStandaloneDisplay = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
};

export const isIosDevice = () => {
  if (typeof navigator === "undefined") {
    return false;
  }

  return (
    IOS_DEVICE_PATTERN.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

export const isIosSafari = () => {
  if (!isIosDevice()) {
    return false;
  }

  return !IOS_NON_SAFARI_PATTERN.test(navigator.userAgent);
};

const emitInstallPromptChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const updateInstallPromptState = (
  state: Partial<InternalInstallPromptState>
) => {
  installPromptState = {
    ...installPromptState,
    ...state,
  };
  emitInstallPromptChange();
};

const getInstallPromptSnapshot = () => installPromptState;

const getShowIosInstructions = (state: InternalInstallPromptState) =>
  isIosSafari() &&
  !state.isInstalled &&
  !state.isDismissed &&
  state.promptEvent === null;

const getPublicInstallPromptState = (
  state: InternalInstallPromptState
): Omit<InstallPromptState, "install"> => ({
  canInstall:
    state.promptEvent !== null && !(state.isInstalled || state.isDismissed),
  isInstalled: state.isInstalled,
  isInstalling: state.isInstalling,
  showIosInstructions: getShowIosInstructions(state),
});

export const getInstallPromptStateForTests = () =>
  getPublicInstallPromptState(getInstallPromptSnapshot());

export const resetInstallPromptForTests = () => {
  isInitialized = false;
  installPromptState = {
    isDismissed: false,
    isInstalled: false,
    isInstalling: false,
    promptEvent: null,
  };
  listeners.clear();
};

export const initializeInstallPrompt = () => {
  if (isInitialized || typeof window === "undefined") {
    return;
  }

  isInitialized = true;
  updateInstallPromptState({ isInstalled: isStandaloneDisplay() });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    updateInstallPromptState({
      isDismissed: false,
      isInstalled: false,
      promptEvent: event as BeforeInstallPromptEvent,
    });
  });

  window.addEventListener("appinstalled", () => {
    updateInstallPromptState({
      isInstalled: true,
      promptEvent: null,
    });
  });
};

const executeInstallPrompt = async (): Promise<
  InstallPromptOutcome | undefined
> => {
  const { promptEvent } = getInstallPromptSnapshot();

  if (!promptEvent) {
    return;
  }

  updateInstallPromptState({ isInstalling: true });

  try {
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;

    updateInstallPromptState({
      isDismissed: choice.outcome === "dismissed",
      isInstalled: choice.outcome === "accepted",
      promptEvent: null,
    });

    return choice.outcome;
  } finally {
    updateInstallPromptState({ isInstalling: false });
  }
};

export const runInstallPromptForTests = executeInstallPrompt;

export const useInstallPrompt = (): InstallPromptState => {
  const [state, setState] = React.useState(getInstallPromptSnapshot);

  React.useEffect(() => {
    initializeInstallPrompt();

    const handleChange = () => {
      setState(getInstallPromptSnapshot());
    };

    listeners.add(handleChange);
    handleChange();

    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const install = React.useCallback(executeInstallPrompt, []);

  return {
    canInstall:
      state.promptEvent !== null && !(state.isInstalled || state.isDismissed),
    install,
    isInstalled: state.isInstalled,
    isInstalling: state.isInstalling,
    showIosInstructions: getShowIosInstructions(state),
  };
};
