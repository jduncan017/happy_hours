"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  restaurantId: string;
  restaurantName: string;
  className?: string;
}

export default function FavoriteButton({
  restaurantId,
  restaurantName,
  className = "",
}: FavoriteButtonProps) {
  const { favoriteIds, isSignedIn } = useFavorites();
  const toggle = useToggleFavorite();
  const isFavorited = favoriteIds.has(restaurantId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.custom(
        (t) => (
          <div
            className={`SignInToast bg-stone-900 border border-white/10 rounded-2xl shadow-2xl p-5 max-w-sm w-full text-center ${
              t.visible ? "animate-enter" : "animate-leave"
            }`}
          >
            <p className="text-white font-semibold text-base mb-1">
              Sign in to save favorites
            </p>
            <p className="text-white/70 text-sm mb-4">
              Build your list of go-to happy hour spots.
            </p>
            <div className="flex gap-2">
              <Link
                href="/auth/signup"
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 rounded-lg bg-gradient-to-r from-po1 to-py1 !text-white text-sm font-semibold px-4 py-2.5 hover:opacity-90 transition"
              >
                Sign up
              </Link>
              <Link
                href="/auth/login"
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 rounded-lg bg-stone-800 border border-white/10 !text-white text-sm font-semibold px-4 py-2.5 hover:bg-stone-700 transition"
              >
                Sign in
              </Link>
            </div>
          </div>
        ),
        { duration: 6000 },
      );
      return;
    }

    const action = isFavorited ? "remove" : "add";
    toggle.mutate(
      { restaurantId, action },
      {
        onSuccess: () => {
          toast.success(
            action === "add"
              ? `Saved ${restaurantName} to your favorites`
              : `Removed ${restaurantName} from your favorites`,
            { duration: 2000 },
          );
        },
        onError: (err) => {
          toast.error(`Couldn't update favorites: ${(err as Error).message}`);
        },
      },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isFavorited}
      aria-label={
        isFavorited
          ? `Remove ${restaurantName} from favorites`
          : `Save ${restaurantName} to favorites`
      }
      className={`FavoriteButton group inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-150 ${
        isFavorited
          ? "border-pr1/40 bg-pr1/10 text-pr1 hover:bg-pr1/20"
          : "border-stone-300 bg-white text-stone-500 hover:border-pr1/40 hover:text-pr1"
      } ${className}`}
    >
      <Heart
        className="h-5 w-5 transition-transform duration-150 group-active:scale-90"
        fill={isFavorited ? "currentColor" : "none"}
        strokeWidth={isFavorited ? 0 : 2}
      />
    </button>
  );
}
