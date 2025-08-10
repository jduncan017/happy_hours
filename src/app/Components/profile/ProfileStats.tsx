"use client";

import { useState, useEffect } from "react";
import { Heart, Star, MapPin, Calendar } from "lucide-react";
import LoadingSpinner from "@/app/Components/SmallComponents/LoadingSpinner";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";

interface ProfileStatsProps {
  userId?: string; // Made optional since we can get from context
  isMobile?: boolean;
}

interface UserStats {
  savedRestaurants: number;
  reviewsCount: number;
  placesVisited: number;
  joinDate: string;
}

export default function ProfileStats({ isMobile = false }: ProfileStatsProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    const fetchStats = async () => {
      // Wait for user context to load
      if (userLoading) return;

      try {
        if (!user) {
          setStatsLoading(false);
          return;
        }

        // Mock stats for now - in a real app you'd query:
        // - user_favorites table for saved restaurants
        // - reviews table for reviews count
        // - check-ins or visits table for places visited
        const mockStats: UserStats = {
          savedRestaurants: Math.floor(Math.random() * 15) + 5, // 5-20
          reviewsCount: Math.floor(Math.random() * 10) + 1, // 1-11
          placesVisited: Math.floor(Math.random() * 25) + 10, // 10-35
          joinDate: new Date(user.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        };

        setStats(mockStats);
      } catch (error) {
        console.error("ProfileStats: Error in fetchStats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user, userLoading]);

  if (userLoading || statsLoading) {
    return (
      <div className="ProfileStats flex items-center justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="ProfileStats text-center py-8">
        <p className="text-white/60">Unable to load stats</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="ProfileStatsMobile grid grid-cols-2 gap-4">
        <div className="StatItem text-center p-4 rounded-2xl bg-stone-800/70 border border-white/5">
          <div className="StatIcon h-8 w-8 mx-auto mb-2 rounded-lg bg-po1/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-po1" />
          </div>
          <div className="StatNumber text-lg font-bold text-white">
            {stats.savedRestaurants}
          </div>
          <div className="StatLabel text-xs text-white/70">Saved</div>
        </div>

        <div className="StatItem text-center p-4 rounded-2xl bg-stone-800/70 border border-white/5">
          <div className="StatIcon h-8 w-8 mx-auto mb-2 rounded-lg bg-po1/20 flex items-center justify-center">
            <Star className="w-4 h-4 text-py1" />
          </div>
          <div className="StatNumber text-lg font-bold text-white">
            {stats.reviewsCount}
          </div>
          <div className="StatLabel text-xs text-white/70">Reviews</div>
        </div>

        <div className="StatItem text-center p-4 rounded-2xl bg-stone-800/70 border border-white/5">
          <div className="StatIcon h-8 w-8 mx-auto mb-2 rounded-lg bg-po1/20 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-pr1" />
          </div>
          <div className="StatNumber text-lg font-bold text-white">
            {stats.placesVisited}
          </div>
          <div className="StatLabel text-xs text-white/70">Visited</div>
        </div>

        <div className="StatItem text-center p-4 rounded-2xl bg-stone-800/70 border border-white/5">
          <div className="StatIcon h-8 w-8 mx-auto mb-2 rounded-lg bg-po1/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-py1" />
          </div>
          <div className="StatNumber text-sm font-bold text-white">
            {stats.joinDate}
          </div>
          <div className="StatLabel text-xs text-white/70">Member</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ProfileStats space-y-6 flex-1">
      {/* Stats Grid */}
      <div className="StatsGrid grid gap-4">
        <div className="StatItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
          <div className="flex items-center gap-4">
            <div className="StatIcon h-10 w-10 shrink-0 rounded-xl bg-po1/20 grid place-items-center">
              <Heart className="w-5 h-5 text-po1" />
            </div>
            <div>
              <p className="StatNumber text-xl font-bold text-white">
                {stats.savedRestaurants}
              </p>
              <p className="StatLabel text-sm text-white/70">
                Saved Restaurants
              </p>
            </div>
          </div>
        </div>

        <div className="StatItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
          <div className="flex items-center gap-4">
            <div className="StatIcon h-10 w-10 shrink-0 rounded-xl bg-po1/20 grid place-items-center">
              <Star className="w-5 h-5 text-py1" />
            </div>
            <div>
              <p className="StatNumber text-xl font-bold text-white">
                {stats.reviewsCount}
              </p>
              <p className="StatLabel text-sm text-white/70">Reviews Written</p>
            </div>
          </div>
        </div>

        <div className="StatItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
          <div className="flex items-center gap-4">
            <div className="StatIcon h-10 w-10 shrink-0 rounded-xl bg-po1/20 grid place-items-center">
              <MapPin className="w-5 h-5 text-pr1" />
            </div>
            <div>
              <p className="StatNumber text-xl font-bold text-white">
                {stats.placesVisited}
              </p>
              <p className="StatLabel text-sm text-white/70">Places Visited</p>
            </div>
          </div>
        </div>

        <div className="StatItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition">
          <div className="flex items-center gap-4">
            <div className="StatIcon h-10 w-10 shrink-0 rounded-xl bg-po1/20 grid place-items-center">
              <Calendar className="w-5 h-5 text-py1" />
            </div>
            <div>
              <p className="StatNumber text-sm font-bold text-white">
                Member Since
              </p>
              <p className="StatLabel text-sm text-white/70">
                {stats.joinDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badge */}
      <div className="AchievementBadge rounded-2xl bg-gradient-to-r from-po1/20 to-py1/20 border border-po1/30 p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="BadgeIcon h-8 w-8 rounded-lg bg-po1 text-white flex items-center justify-center font-bold">
            🏆
          </div>
          <div>
            <p className="BadgeTitle text-sm font-semibold text-white">
              Happy Hour Explorer
            </p>
            <p className="BadgeDescription text-xs text-white/70">
              {stats.placesVisited >= 20
                ? "Expert Level"
                : stats.placesVisited >= 10
                  ? "Advanced Level"
                  : "Getting Started"}
            </p>
          </div>
        </div>
        <div className="ProgressBar bg-stone-800/50 rounded-full h-2 overflow-hidden">
          <div
            className="ProgressFill h-full bg-gradient-to-r from-po1 to-py1 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (stats.placesVisited / 30) * 100)}%`,
            }}
          />
        </div>
        <p className="ProgressText text-xs text-white/60 mt-2">
          {stats.placesVisited}/30 places discovered
        </p>
      </div>

      {/* Quick Actions */}
      <div className="QuickActions space-y-3">
        <h4 className="text-sm font-semibold text-white/90 mb-3">
          Quick Actions
        </h4>

        <Link
          href="/#search"
          className="QuickAction block w-full text-left p-3 rounded-xl bg-stone-800/50 hover:bg-stone-800/70 transition-colors border border-white/5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white group-hover:text-po1 transition-colors">
              Find New Spots
            </span>
            <span className="text-po1 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          href="/favorites"
          className="QuickAction block w-full text-left p-3 rounded-xl bg-stone-800/50 hover:bg-stone-800/70 transition-colors border border-white/5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-white group-hover:text-po1 transition-colors">
              View Saved Places
            </span>
            <span className="text-po1 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
