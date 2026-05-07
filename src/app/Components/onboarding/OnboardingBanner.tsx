"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/contexts/UserContext";

const DISMISS_KEY = "hh:onboarding-banner-dismissed";

/**
 * Shown above the search results to signed-in users whose onboarding isn't
 * complete. Dismissable for the rest of the browser session via localStorage.
 */
export default function OnboardingBanner() {
  const { user } = useUser();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setNeedsOnboarding(false);
      return;
    }
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("user_profiles")
      .select("onboarding_completed_at")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        setNeedsOnboarding(!data?.onboarding_completed_at);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user || !needsOnboarding || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISS_KEY, "1");
    }
  };

  return (
    <div className="OnboardingBannerWrap absolute top-0 left-0 right-0 z-30 flex justify-center px-4 pt-3 pointer-events-none">
      <div
        className="OnboardingBanner pointer-events-auto w-full max-w-[800px] rounded-2xl border border-po1/40 bg-stone-50/95 backdrop-blur shadow-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
        role="region"
        aria-label="Finish setting up your account"
      >
        <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-po1/20">
          <Sparkles className="w-5 h-5 text-po1" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-900">
            Finish setting up your account
          </p>
          <p className="text-xs text-stone-700">
            Pick a few favorites so we can tailor recommendations.
          </p>
        </div>
        <Link
          href="/welcome"
          className="rounded-lg bg-stone-900 !text-po1 hover:!text-white text-sm font-semibold px-3 py-2 hover:bg-stone-800 transition whitespace-nowrap cursor-pointer"
        >
          Continue
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 rounded-md p-1.5 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
