"use client";

import { useState, useEffect, useMemo } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isAdmin } from "@/lib/supabase/auth";
import { getAllRestaurants } from "@/lib/supabase/restaurants";
import AdminDashboard from "@/app/Components/admin/AdminDashboard";
import AdminTabs, { AdminTab } from "@/app/Components/admin/AdminTabs";
import AdminAnalytics from "@/app/Components/admin/AdminAnalytics";
import AdminUsers from "@/app/Components/admin/AdminUsers";
import AdminSettings from "@/app/Components/admin/AdminSettings";
import CardWrapper from "@/app/Components/SmallComponents/CardWrapper";
import Link from "next/link";
import { Home, Shield } from "lucide-react";
import { Restaurant } from "@/lib/types";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("directory");
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    [],
  );
  const [displayedRestaurants, setDisplayedRestaurants] = useState<
    Restaurant[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    areas: [] as string[],
    cuisineTypes: [] as string[],
    verificationStatus: [] as string[],
  });
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    pendingSubmissions: 0,
    verifiedRestaurants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 25;

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Check if user is admin
      const userIsAdmin = await isAdmin(supabase);
      if (!userIsAdmin) {
        redirect("/auth/login");
      }

      // Only fetch stats initially, not restaurants
      const { count: restaurantCount } = await supabase
        .from("restaurants")
        .select("*", { count: "exact" });

      const { count: pendingSubmissions } = await supabase
        .from("restaurant_submissions")
        .select("*", { count: "exact" })
        .eq("status", "pending");

      setStats({
        totalRestaurants: restaurantCount || 0,
        pendingSubmissions: pendingSubmissions || 0,
        verifiedRestaurants: 0, // Will be calculated when restaurants are actually loaded
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  // Fetch restaurants only when there's an active search or filter
  useEffect(() => {
    const hasActiveFilters = Boolean(
      searchQuery ||
        filters.areas.length > 0 ||
        filters.cuisineTypes.length > 0 ||
        filters.verificationStatus.length > 0,
    );

    if (hasActiveFilters && allRestaurants.length === 0) {
      const fetchRestaurants = async () => {
        const supabase = createClient();
        const restaurants = await getAllRestaurants(supabase);
        setAllRestaurants(restaurants);

        // Update verified count in stats
        setStats((prev) => ({
          ...prev,
          verifiedRestaurants: restaurants.filter((r: Restaurant) => r.verified)
            .length,
        }));
      };
      fetchRestaurants();
    }
  }, [searchQuery, filters, allRestaurants.length]);

  // Extract unique values for filters
  const uniqueAreas = useMemo(() => {
    return Array.from(
      new Set(
        allRestaurants
          .map((r) => r.area)
          .filter(Boolean)
          .sort(),
      ),
    ).map((area) => ({ value: area, label: area }));
  }, [allRestaurants]);

  const uniqueCuisineTypes = useMemo(() => {
    return Array.from(
      new Set(
        allRestaurants
          .map((r) => r.cuisineType)
          .filter(Boolean)
          .sort(),
      ),
    ).map((cuisine) => ({ value: cuisine, label: cuisine }));
  }, [allRestaurants]);

  // Filter restaurants based on search and filters
  useEffect(() => {
    let filtered = allRestaurants;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.area?.toLowerCase().includes(query) ||
          restaurant.cuisineType?.toLowerCase().includes(query) ||
          restaurant.address.toLowerCase().includes(query),
      );
    }

    // Apply area filter
    if (filters.areas.length > 0) {
      filtered = filtered.filter((restaurant) =>
        filters.areas.includes(restaurant.area),
      );
    }

    // Apply cuisine filter
    if (filters.cuisineTypes.length > 0) {
      filtered = filtered.filter((restaurant) =>
        filters.cuisineTypes.includes(restaurant.cuisineType),
      );
    }

    // Apply verification status filter
    if (filters.verificationStatus.length > 0) {
      if (filters.verificationStatus.includes("verified")) {
        filtered = filtered.filter((restaurant) => restaurant.verified);
      }
      if (filters.verificationStatus.includes("pending")) {
        filtered = filtered.filter((restaurant) => !restaurant.verified);
      }
    }

    setFilteredRestaurants(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allRestaurants, searchQuery, filters]);

  // Progressive rendering - load restaurants in batches
  useEffect(() => {
    const startIndex = (currentPage - 1) * restaurantsPerPage;
    const endIndex = startIndex + restaurantsPerPage;
    setDisplayedRestaurants(filteredRestaurants.slice(startIndex, endIndex));
  }, [filteredRestaurants, currentPage]);

  // Initialize with no restaurants displayed
  useEffect(() => {
    const hasActiveFilters = Boolean(
      searchQuery ||
        filters.areas.length > 0 ||
        filters.cuisineTypes.length > 0 ||
        filters.verificationStatus.length > 0,
    );
    if (!hasActiveFilters) {
      setDisplayedRestaurants([]);
      setFilteredRestaurants([]);
    }
  }, [searchQuery, filters]);

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string | string[],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value as string[],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      areas: [],
      cuisineTypes: [],
      verificationStatus: [],
    });
    setSearchQuery("");
    setCurrentPage(1);
    // Clear displayed restaurants when filters are cleared
    setDisplayedRestaurants([]);
    setFilteredRestaurants([]);
  };

  if (loading) {
    return (
      <div className="AdminPage relative min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="AdminPage flex w-full bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
      {/* Fixed Left Side - Admin Info Panel */}
      <div className="AdminInfoPanel min-h-full w-80 z-10 pt-[74px] sm:pt-0">
        <CardWrapper
          variant="panel-dark"
          padding="lg"
          className="border-r rounded-none h-full"
        >
          <div className="AdminPanelHeader mb-6">
            <div className="AdminPanelIcon w-16 h-16 bg-gradient-to-br from-po1 to-py1 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-stone-900" />
            </div>
            <h2 className="AdminPanelTitle text-2xl sm:text-3xl font-serif font-bold leading-tight text-white mb-4">
              Admin Command Center
            </h2>
            <p className="AdminPanelText text-white/70 max-w-prose mb-8">
              Manage Denver&apos;s happy hour ecosystem with powerful tools and
              real-time insights.
            </p>
          </div>

          {/* Admin Tabs */}
          <div className="AdminTabsSection mb-8">
            <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Quick Actions */}
          <div className="AdminQuickActions space-y-3 mt-auto">
            <Link
              href="/"
              className="QuickActionButton group flex items-center gap-3 w-full rounded-2xl bg-stone-800/70 border border-white/5 p-4 hover:bg-stone-800/90 transition"
            >
              <div className="QuickActionIcon h-9 w-9 rounded-xl bg-white/10 grid place-items-center text-white/70 group-hover:text-white transition-colors">
                <Home className="w-5 h-5" />
              </div>
              <span className="QuickActionText text-white font-medium">
                Back to Site
              </span>
            </Link>
          </div>
        </CardWrapper>
      </div>

      {/* Scrollable Right Side - Dashboard Content */}
      <div className="AdminDashboardSide h-[calc(100vh-74px)] overflow-scroll flex-1">
        <div className="DashboardContent p-4 sm:p-10">
          {activeTab === "directory" && (
            <AdminDashboard
              restaurants={displayedRestaurants}
              stats={stats}
              totalFiltered={filteredRestaurants.length}
              hasFilters={Boolean(
                searchQuery ||
                  filters.areas.length > 0 ||
                  filters.cuisineTypes.length > 0 ||
                  filters.verificationStatus.length > 0,
              )}
              onLoadMore={handleLoadMore}
              hasMore={displayedRestaurants.length < filteredRestaurants.length}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              uniqueAreas={uniqueAreas}
              uniqueCuisineTypes={uniqueCuisineTypes}
            />
          )}

          {activeTab === "analytics" && <AdminAnalytics />}
          {activeTab === "users" && <AdminUsers />}
          {activeTab === "settings" && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}
