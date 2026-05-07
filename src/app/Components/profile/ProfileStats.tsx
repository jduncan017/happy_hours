"use client";

import { useMemo } from "react";
import { Heart, Calendar } from "lucide-react";
import LoadingSpinner from "@/app/Components/SmallComponents/LoadingSpinner";
import { useUser } from "@/contexts/UserContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useAllRestaurants } from "@/hooks/useRestaurants";

interface ProfileStatsProps {
  userId?: string;
  isMobile?: boolean;
}

const PROFILE_FAVORITES_PREVIEW = 5;

export default function ProfileStats({ isMobile = false }: ProfileStatsProps) {
  const { user, loading: userLoading } = useUser();
  const { favorites, isLoading: favsLoading } = useFavorites();
  const { data: allRestaurants = [] } = useAllRestaurants();

  // Join favorite ids → full restaurant rows, preserving favorite order (newest first)
  const favoriteRestaurants = useMemo(() => {
    if (!allRestaurants.length || !favorites.length) return [];
    const byId = new Map(allRestaurants.map((r) => [r.id, r]));
    return favorites
      .map((f) => byId.get(f.restaurant_id))
      .filter((r): r is NonNullable<typeof r> => Boolean(r));
  }, [favorites, allRestaurants]);

  if (userLoading || favsLoading) {
    return (
      <div className="ProfileStats flex items-center justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ProfileStats text-center py-8">
        <p className="text-white/60">Sign in to see your stats.</p>
      </div>
    );
  }

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (isMobile) {
    return (
      <div className="ProfileStatsMobile space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatTile
            icon={<Heart className="w-4 h-4 text-po1" />}
            number={favorites.length.toString()}
            label="Favorites"
          />
          <StatTile
            icon={<Calendar className="w-4 h-4 text-py1" />}
            number={memberSince}
            label="Member"
            small
          />
        </div>
        {favoriteRestaurants.length > 0 && (
          <FavoritesList restaurants={favoriteRestaurants} />
        )}
      </div>
    );
  }

  return (
    <div className="ProfileStats space-y-6 flex-1">
      <div className="StatsGrid grid gap-4">
        <StatRow
          icon={<Heart className="w-5 h-5 text-po1" />}
          number={favorites.length.toString()}
          label="Favorite Restaurants"
        />
        <StatRow
          icon={<Calendar className="w-5 h-5 text-py1" />}
          number="Member Since"
          label={memberSince}
        />
      </div>

      {favoriteRestaurants.length > 0 ? (
        <FavoritesList restaurants={favoriteRestaurants} />
      ) : (
        <div className="EmptyFavorites rounded-2xl bg-stone-800/50 border border-white/5 p-5">
          <p className="text-sm text-white/80 mb-1">No favorites yet.</p>
          <p className="text-xs text-white/60">
            Tap the heart on any restaurant to save it here.
          </p>
        </div>
      )}
    </div>
  );
}

function StatRow({
  icon,
  number,
  label,
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
}) {
  return (
    <div className="StatItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5">
      <div className="flex items-center gap-4">
        <div className="StatIcon h-10 w-10 shrink-0 rounded-xl bg-po1/20 grid place-items-center">
          {icon}
        </div>
        <div>
          <p className="StatNumber text-xl font-bold text-white">{number}</p>
          <p className="StatLabel text-sm text-white/70">{label}</p>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  number,
  label,
  small,
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
  small?: boolean;
}) {
  return (
    <div className="StatItem text-center p-4 rounded-2xl bg-stone-800/70 border border-white/5">
      <div className="StatIcon h-8 w-8 mx-auto mb-2 rounded-lg bg-po1/20 flex items-center justify-center">
        {icon}
      </div>
      <div
        className={`StatNumber font-bold text-white ${small ? "text-sm" : "text-lg"}`}
      >
        {number}
      </div>
      <div className="StatLabel text-xs text-white/70">{label}</div>
    </div>
  );
}

function FavoritesList({
  restaurants,
}: {
  restaurants: { id: string; name: string; area?: string; address: string }[];
}) {
  const preview = restaurants.slice(0, PROFILE_FAVORITES_PREVIEW);
  const overflow = restaurants.length - preview.length;

  return (
    <div className="FavoritesList rounded-2xl bg-stone-800/50 border border-white/5 p-4 sm:p-5">
      <h4 className="text-sm font-semibold text-white/90 mb-3">
        Your Favorites
      </h4>
      <ul className="space-y-2">
        {preview.map((r) => (
          <li
            key={r.id}
            className="FavoriteEntry flex items-start justify-between gap-3 rounded-lg bg-stone-900/40 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{r.name}</p>
              <p className="text-xs text-white/60 truncate">
                {r.area ? `${r.area} · ` : ""}
                {r.address}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {overflow > 0 && (
        <p className="text-xs text-white/60 mt-3">
          + {overflow} more saved
        </p>
      )}
    </div>
  );
}
