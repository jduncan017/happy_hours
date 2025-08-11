import { useState } from "react";
import { Restaurant } from "@/lib/types";
import RestaurantEditorModal from "./RestaurantEditorModal";
import AdminFilterDropdown from "../SmallComponents/AdminFilterDropdown";
import {
  Building2,
  CheckCircle,
  MapPin,
  Mail,
  Edit3,
  Loader2,
  Database,
  Shield,
  Users,
  Filter,
  Search,
} from "lucide-react";
import CardWrapper from "../SmallComponents/CardWrapper";

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
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowEditorModal(true);
  };

  const handleRestaurantUpdate = (updatedRestaurant: Restaurant) => {
    // Update the local state optimistically
    setSelectedRestaurant(updatedRestaurant);
    // In a real implementation, you'd refetch or update the restaurants list
  };

  const handleCloseModal = () => {
    setShowEditorModal(false);
    setSelectedRestaurant(null);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await onLoadMore();
    setLoadingMore(false);
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
          <div className="AdminStatCard rounded-2xl bg-stone-800/70 border border-white/5 p-6 hover:bg-stone-800/90 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="AdminStatIcon h-10 w-10 rounded-xl bg-po1/20 grid place-items-center text-po1">
                  <Database className="w-5 h-5" />
                </div>
                <span className="AdminStatLabel text-sm text-white/70">
                  Total Restaurants
                </span>
              </div>
              <span className="AdminStatValue text-2xl font-bold text-white">
                {stats.totalRestaurants}
              </span>
            </div>
          </div>

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

          <div className="AdminStatCard rounded-2xl bg-stone-800/70 border border-white/5 p-6 hover:bg-stone-800/90 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="AdminStatIcon h-10 w-10 rounded-xl bg-py1/20 grid place-items-center text-py1">
                  <Users className="w-5 h-5" />
                </div>
                <span className="AdminStatLabel text-sm text-white/70">
                  Pending Review
                </span>
              </div>
              <span className="AdminStatValue text-2xl font-bold text-white">
                {stats.pendingSubmissions}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Search */}
      <div className="RestaurantListInfo flex items-center">
        <div className="RestaurantListIcon w-12 h-12 bg-po1/20 rounded-xl flex items-center justify-center mr-4">
          <Building2 className="w-6 h-6 text-po1" />
        </div>
        <div>
          <h2 className="RestaurantListTitle text-xl font-bold text-white uppercase tracking-wide">
            Restaurant Directory
          </h2>
          <p className="RestaurantListSubtitle text-white/70">
            {hasFilters
              ? `Showing ${restaurants.length} of ${totalFiltered} restaurants`
              : "Use the search bar and filters to find restaurants"}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="AdminFiltersBar">
        <div className="AdminFiltersContainer flex flex-col gap-4 w-full bg-stone-800/50 rounded-2xl p-4 border border-white/10">
          <div className="AdminFiltersRow flex flex-wrap gap-4 items-center">
            {/* Search Bar */}
            <div className="AdminSearchContainer relative flex-1 min-w-[300px]">
              <Search className="AdminSearchIcon absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="AdminSearchInput w-full pl-10 pr-4 py-3 bg-stone-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-po1 focus:border-po1 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="AdminClearSearchButton absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 hover:text-white/80 transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            {/* Verification Status Filter */}
            <div className="AdminFilterGroup">
              <AdminFilterDropdown
                label="Status"
                value={filters.verificationStatus}
                options={[
                  { value: "verified", label: "Verified" },
                  { value: "pending", label: "Pending" },
                ]}
                onChange={(value) =>
                  onFilterChange("verificationStatus", value)
                }
                multiple={true}
                placeholder="Any Status"
              />
            </div>

            {/* Area Filter */}
            <div className="AdminFilterGroup">
              <AdminFilterDropdown
                label="Area"
                value={filters.areas}
                options={uniqueAreas}
                onChange={(value) => onFilterChange("areas", value)}
                multiple={true}
                placeholder="Any Area"
              />
            </div>

            {/* Cuisine Filter */}
            <div className="AdminFilterGroup">
              <AdminFilterDropdown
                label="Cuisine"
                value={filters.cuisineTypes}
                options={uniqueCuisineTypes}
                onChange={(value) => onFilterChange("cuisineTypes", value)}
                multiple={true}
                placeholder="Any Cuisine"
              />
            </div>

            {/* Clear Filters Button */}
            {(filters.areas.length > 0 ||
              filters.cuisineTypes.length > 0 ||
              filters.verificationStatus.length > 0 ||
              searchQuery) && (
              <button
                onClick={onClearFilters}
                className="AdminClearFiltersButton px-4 py-3 bg-stone-700/50 hover:bg-stone-700/70 border border-white/10 rounded-xl text-white/80 hover:text-white transition-all flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Restaurant List */}
          <div className="RestaurantListContainer">
            <div className="RestaurantListHeader flex items-center justify-between mb-2">
              {hasFilters && (
                <div className="RestaurantListStats text-right">
                  <div className="text-sm text-white/70">
                    Total:{" "}
                    <span className="text-white font-medium">
                      {totalFiltered}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Initial State - No Search/No Filters */}
            {!hasFilters && restaurants.length === 0 && (
              <div className="EmptyState text-center py-16 rounded-2xl bg-stone-800/30 border border-white/10">
                <div className="w-20 h-20 mx-auto mb-4 bg-stone-700/50 rounded-full flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-white/50" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No restaurants loaded
                </h3>
                <p className="text-sm text-white/70 max-w-md mx-auto">
                  Use the search bar and filters above to find restaurants. You
                  can search by name, area, cuisine type, or address.
                </p>
              </div>
            )}

            {/* No Results State */}
            {hasFilters && restaurants.length === 0 && (
              <div className="EmptyState text-center py-16 rounded-2xl bg-stone-800/30 border border-white/10">
                <div className="w-20 h-20 mx-auto mb-4 bg-stone-700/50 rounded-full flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-white/50" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No restaurants found
                </h3>
                <p className="text-sm text-white/70 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find
                  restaurants.
                </p>
              </div>
            )}

            {/* Restaurant List Items */}
            {restaurants.length > 0 && (
              <div className="RestaurantListItems space-y-3">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => handleRestaurantSelect(restaurant)}
                    className="RestaurantItem group cursor-pointer rounded-2xl bg-stone-800/50 border border-white/10 p-4 hover:bg-stone-800/70 transition-all"
                  >
                    <div className="RestaurantItemHeader flex items-start justify-between mb-3">
                      <div className="RestaurantItemInfo flex-1">
                        <div className="RestaurantItemNameRow flex items-center gap-3">
                          <h3 className="RestaurantItemName font-bold text-lg text-white group-hover:text-po1 transition-colors">
                            {restaurant.name}
                          </h3>
                          <span className="EditIndicator text-xs text-po1 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <Edit3 className="w-3 h-3" />
                            Edit
                          </span>
                        </div>
                        <p className="RestaurantItemArea text-sm text-white/70 font-medium flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {restaurant.area || "Location TBD"}
                        </p>
                      </div>

                      <div className="RestaurantItemBadges flex flex-col gap-2">
                        {restaurant.verified && (
                          <span className="VerifiedBadge bg-green-600/20 text-green-400 text-xs px-3 py-1 rounded-full font-bold flex items-center border border-green-600/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        )}
                        <span className="CuisineBadge bg-po1/20 text-po1 text-xs px-3 py-1 rounded-full font-medium border border-po1/30">
                          {restaurant.cuisineType || "Cuisine TBD"}
                        </span>
                      </div>
                    </div>

                    <p className="RestaurantItemAddress text-sm text-white/70 bg-stone-900/50 rounded-lg p-2 flex items-start">
                      <Mail className="w-4 h-4 mr-2 mt-0.5 text-white/50 flex-shrink-0" />
                      {restaurant.address}
                    </p>
                  </div>
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="LoadMoreContainer text-center pt-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="LoadMoreButton px-6 py-3 bg-po1/20 hover:bg-po1/30 text-po1 border border-po1/30 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        `Load More (${restaurants.length} of ${totalFiltered})`
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Editor Modal */}
      {showEditorModal && selectedRestaurant && (
        <RestaurantEditorModal
          restaurant={selectedRestaurant}
          onUpdate={handleRestaurantUpdate}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
