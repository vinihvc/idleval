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
  dismissInstallPrompt: () => void;
  install: () => Promise<InstallPromptOutcome | undefined>;
  isInstalled: boolean;
  isInstalling: boolean;
}

let isInitialized = false;
const listeners = new Set<() => void>();
let installPromptState: InternalInstallPromptState = {
  isDismissed: false,
  isInstalled: false,
  isInstalling: false,
  promptEvent: null,
};

const isStandaloneDisplay = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
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

  const dismissInstallPrompt = React.useCallback(() => {
    updateInstallPromptState({ isDismissed: true });
  }, []);

  const install = React.useCallback(async () => {
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
  }, []);

  return {
    canInstall:
      state.promptEvent !== null && !(state.isInstalled || state.isDismissed),
    dismissInstallPrompt,
    install,
    isInstalled: state.isInstalled,
    isInstalling: state.isInstalling,
  };
};
