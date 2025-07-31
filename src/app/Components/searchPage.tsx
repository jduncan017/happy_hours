"use client";
import React, { useEffect, useState, forwardRef } from "react";
import type { Restaurant } from "@/lib/types";
import {
  sortRestaurants,
  filterHappyHoursToday,
  filterHappyHoursNow,
} from "@/utils/happyHourUtils";
import { useAllRestaurants } from "@/hooks/useRestaurants";
import SearchFilters from "./SearchFilters";
import RestaurantList from "./RestaurantList";
import GoogleMap from "./GoogleMap";
import ViewToggle from "./ViewToggle";
import LocationSearch from "./LocationSearch";

export const SearchPage = forwardRef<HTMLDivElement>((props, ref) => {
  const [today, setToday] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [displayedRestaurants, setDisplayedRestaurants] = useState<
    Restaurant[]
  >([]);
  const [view, setView] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocationBased, setIsLocationBased] = useState(false);

  // Use React Query to fetch restaurants
  const { data: allRestaurants = [], isLoading, error } = useAllRestaurants();

  useEffect(() => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = daysOfWeek[new Date().getDay()];
    setToday(today);
  }, []);

  useEffect(() => {
    if (allRestaurants.length === 0 || isLocationBased) return;

    const sortedRestaurants = sortRestaurants(allRestaurants);
    let filteredRestaurants = sortedRestaurants;

    if (filterOption === "today") {
      filteredRestaurants = filterHappyHoursToday(sortedRestaurants, today);
    } else if (filterOption === "now") {
      filteredRestaurants = filterHappyHoursNow(sortedRestaurants, today);
    }

    setDisplayedRestaurants(filteredRestaurants);
  }, [filterOption, today, allRestaurants, isLocationBased]);

  const handleLocationSearch = (
    restaurants: Restaurant[],
    location: { lat: number; lng: number },
  ) => {
    setDisplayedRestaurants(restaurants);
    setUserLocation(location);
    setIsLocationBased(true);
    setView("map"); // Switch to map view to show results
  };

  const handleBackToAll = () => {
    setIsLocationBased(false);
    setUserLocation(null);
    // This will trigger the normal filtering useEffect
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        id="search-section"
        className="Search lg:bg-n1 mx-auto mt-4 flex flex-col items-center gap-2 border-r p-4 sm:mt-8 sm:p-8 lg:rounded-md lg:shadow-themeShadow"
      >
        <SearchFilters
          filterOption="all"
          onFilterChange={() => {}}
          view={view}
          onViewChange={setView}
        />
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-stone-800"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        id="search-section"
        className="Search lg:bg-n1 mx-auto mt-4 flex flex-col items-center gap-2 border-r p-4 sm:mt-8 sm:p-8 lg:rounded-md lg:shadow-themeShadow"
      >
        <SearchFilters
          filterOption={filterOption}
          onFilterChange={setFilterOption}
          view={view}
          onViewChange={setView}
        />
        <div className="py-8 text-center">
          <p className="mb-4 text-red-600">
            {error instanceof Error ? error.message : String(error)}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-stone-800 px-4 py-2 text-white hover:bg-stone-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id="search-section"
      className="Search lg:bg-n1 mx-auto mt-4 flex flex-col gap-4 border-r p-4 sm:mt-8 sm:p-8 lg:flex-row lg:rounded-md lg:shadow-themeShadow"
    >
      {/* Left Sidebar - Location Search */}
      <div className="Sidebar w-full flex-shrink-0 lg:w-80">
        <LocationSearch
          restaurants={allRestaurants}
          onLocationSearch={handleLocationSearch}
          onError={(error) => console.error("Location error:", error)}
        />

        {isLocationBased && (
          <button
            onClick={handleBackToAll}
            className="BackButton mt-4 w-full rounded-lg px-4 py-3 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all duration-200 border border-stone-200 font-medium"
          >
            ← Back to All Restaurants
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="MainContent flex flex-1 flex-col gap-2">
        <SearchFilters
          filterOption={filterOption}
          onFilterChange={setFilterOption}
          view={view}
          onViewChange={setView}
        />

        {isLocationBased && displayedRestaurants.length === 0 && (
          <div className="NoResults py-8 text-center bg-stone-50 rounded-lg border border-stone-200">
            <p className="mb-2 text-stone-900 font-medium">
              No restaurants found within your selected radius.
            </p>
            <p className="text-sm text-stone-600">
              Try increasing the search distance or selecting a different filter.
            </p>
          </div>
        )}

        {view === "list" ? (
          <RestaurantList restaurants={displayedRestaurants} today={today} />
        ) : (
          <GoogleMap
            restaurants={displayedRestaurants}
            center={userLocation || undefined}
            className="h-[600px] w-full rounded-lg"
          />
        )}
      </div>
    </div>
  );
});

SearchPage.displayName = "Search Page";
