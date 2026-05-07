"use client";

import { useEffect, useState } from "react";

/**
 * Browser install prompt event. Chromium fires this on supported pages;
 * we stash it and call .prompt() when the user taps our install button.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptState {
  /** Browser supports programmatic prompt and we have a captured event */
  canPrompt: boolean;
  /** iOS Safari — no programmatic install, must show manual instructions */
  isIos: boolean;
  /** App is already installed (running in standalone display mode) */
  isInstalled: boolean;
  /** Trigger the native install prompt. Resolves true if accepted. */
  prompt: () => Promise<boolean>;
}

export function useInstallPrompt(): InstallPromptState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect iOS — UA sniff is the only reliable path here
    const ua = window.navigator.userAgent;
    const iosByUa = /iPhone|iPad|iPod/.test(ua);
    // iPad on iOS 13+ reports as Mac; differentiate via touch points
    const iPadOS = ua.includes("Mac") && navigator.maxTouchPoints > 1;
    setIsIos(iosByUa || iPadOS);

    // Detect already-installed: standalone display mode or iOS standalone flag
    const standaloneMq = window.matchMedia("(display-mode: standalone)");
    const iosStandalone =
      "standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean })
        .standalone === true;
    setIsInstalled(standaloneMq.matches || iosStandalone);

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const prompt = async (): Promise<boolean> => {
    if (!deferred) return false;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    return choice.outcome === "accepted";
  };

  return {
    canPrompt: !!deferred,
    isIos,
    isInstalled,
    prompt,
  };
}
