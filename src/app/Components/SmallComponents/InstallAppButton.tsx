"use client";

import { Download, Share, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useModal } from "@/contexts/ModalContext";

export default function InstallAppButton() {
  const { canPrompt, isIos, isInstalled, prompt } = useInstallPrompt();
  const { showModal, hideModal } = useModal();

  // Hide if already installed, or if browser hasn't offered the prompt
  // and we're not on iOS (where we always show instructions).
  if (isInstalled) return null;
  if (!canPrompt && !isIos) return null;

  const handleClick = async () => {
    if (isIos) {
      showModal(<IosInstallModal onClose={hideModal} />);
      return;
    }
    const accepted = await prompt();
    if (accepted) {
      toast.success("Added to your home screen.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Install HappyHourHunt as an app"
      className="InstallAppButton inline-flex items-center gap-1.5 rounded-full bg-po1/15 hover:bg-po1/25 border border-po1/40 text-po1 text-xs font-semibold px-3 py-1.5 transition cursor-pointer"
    >
      <Download className="w-3.5 h-3.5" />
      Install app
    </button>
  );
}

function IosInstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2
          id="install-modal-title"
          className="text-xl font-serif font-bold text-stone-900 mb-2"
        >
          Add to home screen
        </h2>
        <p className="text-sm text-stone-600 mb-5">
          Get one-tap access to HappyHourHunt. No app store, no download.
        </p>

        <ol className="space-y-3 text-sm text-stone-800">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-po1/15 text-po1 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <span className="flex-1 inline-flex items-center gap-1.5 flex-wrap">
              Tap the
              <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 border border-stone-200 px-1.5 py-0.5 text-xs font-medium">
                <Share className="w-3.5 h-3.5" /> Share
              </span>
              button at the bottom of Safari.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-po1/15 text-po1 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <span className="flex-1 inline-flex items-center gap-1.5 flex-wrap">
              Scroll down and pick
              <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 border border-stone-200 px-1.5 py-0.5 text-xs font-medium">
                <Plus className="w-3.5 h-3.5" /> Add to Home Screen
              </span>
              .
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-po1/15 text-po1 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <span className="flex-1">
              Tap <strong>Add</strong>. The icon appears on your home screen.
            </span>
          </li>
        </ol>

        <p className="mt-5 text-xs text-stone-500">
          Works only in Safari. If you&apos;re in Chrome, open this page in
          Safari first.
        </p>
      </div>
    </div>
  );
}
