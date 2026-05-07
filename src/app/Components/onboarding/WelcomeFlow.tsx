"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import toast from "react-hot-toast";
import { Heart, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { normalizeImageUrl } from "@/utils/image/normalizeImageUrl";
import CardWrapper from "@/app/Components/SmallComponents/CardWrapper";
import LoadingSpinner from "@/app/Components/SmallComponents/LoadingSpinner";

interface PickRestaurant {
  id: string;
  name: string;
  area: string | null;
  address: string;
  hero_image: string | null;
}

interface WelcomeFlowProps {
  initialFullName: string;
  pickRestaurants: PickRestaurant[];
}

const PAGE_SIZE = 12;

export default function WelcomeFlow({
  initialFullName,
  pickRestaurants,
}: WelcomeFlowProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useUser();

  const startStep = initialFullName.trim() ? 2 : 1;
  const [step, setStep] = useState<1 | 2>(startStep);
  const [fullName, setFullName] = useState(initialFullName);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(pickRestaurants.length / PAGE_SIZE));
  const pageItems = pickRestaurants.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  const togglePick = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const finish = async () => {
    if (!user) {
      toast.error("Session expired — please sign in again.");
      router.push("/auth/login");
      return;
    }
    setSubmitting(true);

    const supabase = createClient();

    const profileUpdate: Record<string, unknown> = {
      onboarding_completed_at: new Date().toISOString(),
    };
    if (fullName.trim() && fullName !== initialFullName) {
      profileUpdate.full_name = fullName.trim();
    }

    const { error: profileError } = await supabase
      .from("user_profiles")
      .update(profileUpdate)
      .eq("id", user.id);

    if (profileError) {
      console.error("Failed to update profile:", profileError);
      toast.error("Couldn't save your profile. Try again?");
      setSubmitting(false);
      return;
    }

    if (picked.size > 0) {
      const rows = Array.from(picked).map((restaurant_id) => ({
        user_id: user.id,
        restaurant_id,
      }));
      const { error: favError } = await supabase
        .from("restaurant_favorites")
        .upsert(rows, { onConflict: "user_id,restaurant_id" });
      if (favError) {
        console.error("Failed to save favorites:", favError);
        toast.error(
          "Saved your profile, but couldn't save favorites. You can heart them on /search.",
        );
      }
    }

    await refreshProfile();
    // Force the favorites query to refetch so /search and /profile reflect picks
    queryClient.invalidateQueries({ queryKey: ["favorites", user.id] });
    toast.success("All set — let's find some happy hours!");
    router.push("/search");
  };

  const skip = async () => {
    if (!user) return;
    setSubmitting(true);
    const supabase = createClient();
    await supabase
      .from("user_profiles")
      .update({ onboarding_completed_at: new Date().toISOString() })
      .eq("id", user.id);
    await refreshProfile();
    router.push("/search");
  };

  return (
    <CardWrapper variant="dark-glass" padding="lg" className="w-full">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-po1" />
          <span className="text-xs uppercase tracking-wider text-po1/80 font-semibold">
            Step {step} of 2
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
          {step === 1 ? "What should we call you?" : "Pick a few you've been to."}
        </h1>
        <p className="text-white/70">
          {step === 1
            ? "Just for personalization — you can change it later."
            : `Tap a few of these spots to seed your favorites list. Or skip and explore on your own.`}
        </p>
      </header>

      {step === 1 ? (
        <div className="space-y-6">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="w-full rounded-xl bg-stone-800/80 border border-white/10 px-4 py-3 placeholder:text-white/40 text-white focus:ring-2 focus:ring-po1 focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={skip}
              disabled={submitting}
              className="text-sm text-white/60 hover:text-white transition"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!fullName.trim() || submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-po1 to-py1 px-5 py-2.5 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            role="listbox"
            aria-multiselectable
          >
            {pageItems.map((r) => {
              const isPicked = picked.has(r.id);
              const imgUrl = normalizeImageUrl(r.hero_image, "");
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isPicked}
                    onClick={() => togglePick(r.id)}
                    className={`PickCard relative flex h-full w-full flex-col text-left overflow-hidden rounded-xl border transition-all ${
                      isPicked
                        ? "border-po1 bg-po1/10 ring-2 ring-po1/40"
                        : "border-white/10 bg-stone-800/60 hover:border-white/30"
                    }`}
                  >
                    <div className="relative aspect-video w-full bg-stone-700 flex-shrink-0">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 50vw, 200px"
                          className="object-cover"
                          unoptimized={imgUrl.startsWith("/")}
                        />
                      ) : null}
                      {isPicked && (
                        <span className="absolute top-2 right-2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-po1 text-white">
                          <Heart className="w-4 h-4" fill="currentColor" />
                        </span>
                      )}
                    </div>
                    <div className="p-2.5 min-h-[64px] flex flex-col justify-start">
                      <p className="text-sm font-medium text-white line-clamp-1">
                        {r.name}
                      </p>
                      <p className="text-xs text-white/60 line-clamp-1">
                        {r.area ?? r.address}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <div className="PagerRow flex items-center justify-center gap-3 text-white/70">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || submitting}
                aria-label="Previous page"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-stone-800/60 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page >= totalPages - 1 || submitting}
                aria-label="Next page"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-stone-800/60 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={submitting}
              className="text-sm text-white/60 hover:text-white transition"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={skip}
                disabled={submitting}
                className="text-sm text-white/60 hover:text-white transition"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={finish}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-po1 to-py1 px-5 py-2.5 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Finishing...
                  </>
                ) : (
                  <>
                    Finish
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
          {picked.size > 0 && (
            <p className="text-xs text-white/60 text-center">
              {picked.size} saved to your favorites
            </p>
          )}
        </div>
      )}
    </CardWrapper>
  );
}
