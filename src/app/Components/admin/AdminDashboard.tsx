import { useState } from "react";
import { Restaurant } from "@/lib/types";
import AdminRestaurantDirectory from "./AdminRestaurantDirectory";
import AdminPendingReview from "./AdminPendingReview";
import {
  Database,
  Shield,
  Users,
} from "lucide-react";

interface AdminStats {
  totalRestaurants: number;
  pendingSubmissions: number;
  verifiedRestaurants: number;
}

interface AdminDashboardProps {
  restaurants: Restaurant[];
  stats: AdminStats;
  totalFiltered: number;
  hasFilters: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    areas: string[];
    cuisineTypes: string[];
    verificationStatus: string[];
  };
  onFilterChange: (
    filterType: "areas" | "cuisineTypes" | "verificationStatus",
    value: string | string[],
  ) => void;
  onClearFilters: () => void;
  uniqueAreas: { value: string; label: string }[];
  uniqueCuisineTypes: { value: string; label: string }[];
}

export default function AdminDashboard({
  restaurants,
  stats,
  totalFiltered,
  hasFilters,
  onLoadMore,
  hasMore,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  uniqueAreas,
  uniqueCuisineTypes,
}: AdminDashboardProps) {
  const [showPendingReview, setShowPendingReview] = useState(false);

  const handleShowPendingReview = () => {
    setShowPendingReview(true);
  };

  const handleShowRestaurantDirectory = () => {
    setShowPendingReview(false);
  };

  return (
    <section className="AdminDashboard flex flex-col gap-6">
      {/* Dashboard Header */}
      <div className="DashboardHeader">
        <h1 className="DashboardTitle text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
          Restaurant Management Dashboard
        </h1>
        <p className="DashboardSubtitle text-white/70">
          Manage restaurant listings, verify submissions, and monitor system
          health
        </p>
      </div>

      {/* Stats Section at Top */}
      <div className="AdminStatsSection">
        <div className="AdminStatsGrid grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleShowRestaurantDirectory}
            className="AdminStatCard rounded-2xl bg-stone-800/70 border border-white/5 p-6 hover:bg-stone-800/90 transition-all w-full text-left group hover:border-po1/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="AdminStatIcon h-10 w-10 rounded-xl bg-po1/20 grid place-items-center text-po1 group-hover:bg-po1/30 transition-colors">
                  <Database className="w-5 h-5" />
                </div>
                <span className="AdminStatLabel text-sm text-white/70 group-hover:text-white/90">
                  Total Restaurants
                </span>
              </div>
              <span className="AdminStatValue text-2xl font-bold text-white group-hover:text-po1 transition-colors">
                {stats.totalRestaurants}
              </span>
            </div>
          </button>

          <div className="AdminStatCard rounded-2xl bg-stone-800/70 border border-white/5 p-6 hover:bg-stone-800/90 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="AdminStatIcon h-10 w-10 rounded-xl bg-green-600/20 grid place-items-center text-green-400">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="AdminStatLabel text-sm text-white/70">
                  Verified
                </span>
              </div>
              <span className="AdminStatValue text-2xl font-bold text-white">
                {stats.verifiedRestaurants}
              </span>
            </div>
          </div>

          <button
            onClick={handleShowPendingReview}
            className="AdminStatCard rounded-2xl bg-stone-800/70 border border-white/5 p-6 hover:bg-stone-800/90 transition-all w-full text-left group hover:border-py1/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="AdminStatIcon h-10 w-10 rounded-xl bg-py1/20 grid place-items-center text-py1 group-hover:bg-py1/30 transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <span className="AdminStatLabel text-sm text-white/70 group-hover:text-white/90">
                  Pending Review
                </span>
              </div>
              <span className="AdminStatValue text-2xl font-bold text-white group-hover:text-py1 transition-colors">
                {stats.pendingSubmissions}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Conditional Content: Restaurant Directory OR Pending Review */}
      {showPendingReview ? (
        <AdminPendingReview />
      ) : (
        <AdminRestaurantDirectory
          restaurants={restaurants}
          totalFiltered={totalFiltered}
          hasFilters={hasFilters}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          uniqueAreas={uniqueAreas}
          uniqueCuisineTypes={uniqueCuisineTypes}
        />
      )}
    </section>
  );
}
