"use client";
import React, { useEffect, useState, forwardRef, useMemo } from "react";
import type { Restaurant } from "@/lib/types";
import {
  sortRestaurants,
  filterHappyHoursToday,
  filterHappyHoursNow,
} from "@/utils/happyHourUtils";
import {
  applyAdvancedFilters,
  hasActiveAdvancedFilters,
} from "@/utils/search/advancedFilterUtils";
import { useAllRestaurants } from "@/hooks/useRestaurants";
import SearchFilters, { type AdvancedFilterOptions } from "./SearchFilters";
import { type TimeFilter } from "./modals/TimeFilterModal";
import { SearchResults } from "./SearchResults";
import { getCurrentDayOfWeek } from "@/utils/time/timeUtils";
import { useTimeBasedFiltering } from "@/hooks/useTimeBasedFiltering";
import { performanceMonitor } from "@/utils/performance/performanceMonitor";

export const SearchPage = forwardRef<HTMLDivElement>((_, ref) => {
  const [today, setToday] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [displayedRestaurants, setDisplayedRestaurants] = useState<
    Restaurant[]
  >([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocationBased, setIsLocationBased] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterOptions>(
    {
      areas: [],
      cuisineTypes: [],
      priceRange: [],
      hasSpecialFeatures: {
        hasWebsite: false,
        hasNotes: false,
        hasMultipleHappyHours: false,
      },
    },
  );
  const [timeFilter, setTimeFilter] = useState<TimeFilter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query to fetch restaurants
  const { data: allRestaurants = [], isLoading, error } = useAllRestaurants();

  // Time-based filtering hook
  const timeFilters = useTimeBasedFiltering(allRestaurants);

  useEffect(() => {
    setToday(getCurrentDayOfWeek());
  }, []);

  // Function to filter restaurants by search query
  const filterRestaurantsBySearch = (restaurants: Restaurant[], query: string): Restaurant[] => {
    if (!query.trim()) return restaurants;
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return restaurants.filter(restaurant => {
      const searchableText = [
        restaurant.name,
        restaurant.area,
        restaurant.address,
        restaurant.cuisineType,
        restaurant.notes || ''
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  };

  // Memoized filtering calculation to prevent unnecessary re-computation
  const filteredRestaurants = useMemo(() => {
    const perfTracker = performanceMonitor.trackFilterPerformance(
      allRestaurants.length, 
      `${filterOption}${timeFilter ? '-custom-time' : ''}${hasActiveAdvancedFilters(advancedFilters) ? '-advanced' : ''}${searchQuery ? '-search' : ''}`
    );

    // Don't filter when location-based
    if (isLocationBased) {
      perfTracker.end();
      return [];
    }

    // Don't filter until we have data
    if (allRestaurants.length === 0) {
      perfTracker.end();
      return [];
    }

    const sortedRestaurants = sortRestaurants(allRestaurants);
    let result = sortedRestaurants;

    // Apply basic time-based filters
    if (filterOption === "today") {
      result = timeFilters.filterByToday(today);
    } else if (filterOption === "now") {
      result = timeFilters.filterByNow(today);
    }

    // Apply time filter if active
    if (timeFilter) {
      result = timeFilters.filterByTimeRange(timeFilter);
    }

    // Apply search filter
    result = filterRestaurantsBySearch(result, searchQuery);

    // Apply advanced filters
    if (hasActiveAdvancedFilters(advancedFilters)) {
      result = applyAdvancedFilters(result, advancedFilters);
    }

    perfTracker.end();
    return result;
  }, [filterOption, today, allRestaurants, advancedFilters, isLocationBased, timeFilter, searchQuery, timeFilters]);

  // Update displayed restaurants when filtered results change, but prevent updates during loading
  useEffect(() => {
    if (isLoading) return; // Skip updates while loading
    
    if (!isLocationBased) {
      setDisplayedRestaurants(filteredRestaurants);
    }
  }, [filteredRestaurants, isLocationBased, isLoading]);

  const handleBackToAll = () => {
    setIsLocationBased(false);
    setUserLocation(null);
    // This will trigger the normal filtering useEffect
  };

  const handleAdvancedFiltersChange = (newFilters: AdvancedFilterOptions) => {
    setAdvancedFilters(newFilters);
  };

  const handleTimeFilter = (filter: TimeFilter | null) => {
    setTimeFilter(filter);
  };

  const handleClearAllFilters = () => {
    setTimeFilter(null);
    setIsLocationBased(false);
    setUserLocation(null);
    setSearchQuery("");
  };

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div ref={ref} className="SearchContainer w-full">
      {/* Full Width Search Filters */}
      <SearchFilters
        filterOption={filterOption}
        onFilterChange={setFilterOption}
        restaurants={allRestaurants}
        advancedFilters={advancedFilters}
        onAdvancedFiltersChange={handleAdvancedFiltersChange}
        onTimeFilter={handleTimeFilter}
        onClearAllFilters={handleClearAllFilters}
        onSearchQuery={handleSearchQuery}
        onError={(error) => console.error("Search filter error:", error)}
      />

      {/* Search Results with Map */}
      <SearchResults
        restaurants={displayedRestaurants}
        today={timeFilter ? timeFilter.dayOfWeek : today}
        userLocation={userLocation || undefined}
        isLocationBased={isLocationBased}
        isLoading={isLoading}
        error={error}
        onBackToAll={handleBackToAll}
      />
    </div>
  );
});

SearchPage.displayName = "Search Page";