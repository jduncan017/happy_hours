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
} from "@/utils/advancedFilterUtils";
import { useAllRestaurants } from "@/hooks/useRestaurants";
import SearchFilters, { type AdvancedFilterOptions } from "./SearchFilters";
import { type TimeFilter } from "./modals/TimeFilterModal";
import { SearchResults } from "./SearchResults";

// Helper function to convert time string to minutes since restaurant day start (8am)
// Restaurant day runs 8am-2am, so we need to handle the overnight period
const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  
  // If it's 8am or later (8:00-23:59), return as-is
  if (hours >= 8) {
    return totalMinutes;
  }
  // If it's early hours (0:00-2:59), add 24 hours to put it at end of restaurant day
  else if (hours <= 2) {
    return totalMinutes + (24 * 60);
  }
  // Hours 3-7 are not valid for restaurant operations, but handle gracefully
  else {
    return totalMinutes;
  }
};

// Function to filter restaurants by time range
const filterRestaurantsByTimeRange = (restaurants: Restaurant[], timeFilter: TimeFilter): Restaurant[] => {
  return restaurants.filter(restaurant => {
    const dayHours = restaurant.happyHours[timeFilter.dayOfWeek];
    if (!dayHours || dayHours.length === 0) return false;

    const filterStartMinutes = timeToMinutes(timeFilter.startTime);
    const filterEndMinutes = timeToMinutes(timeFilter.endTime);

    return dayHours.some(timeRange => {
      const happyHourStartMinutes = timeToMinutes(timeRange.Start);
      const happyHourEndMinutes = timeToMinutes(timeRange.End);

      // Check if there's any overlap between the filter time range and happy hour time range
      return (
        (happyHourStartMinutes <= filterEndMinutes && happyHourEndMinutes >= filterStartMinutes) ||
        (filterStartMinutes <= happyHourEndMinutes && filterEndMinutes >= happyHourStartMinutes)
      );
    });
  });
};

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

  useEffect(() => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = daysOfWeek[new Date().getDay()];
    setToday(today);
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
    // Don't filter when location-based
    if (isLocationBased) {
      return [];
    }

    // Don't filter until we have data
    if (allRestaurants.length === 0) {
      return [];
    }

    const sortedRestaurants = sortRestaurants(allRestaurants);
    let result = sortedRestaurants;

    // Apply search filter first
    result = filterRestaurantsBySearch(result, searchQuery);

    // Apply basic time-based filters
    if (filterOption === "today") {
      result = filterHappyHoursToday(result, today);
    } else if (filterOption === "now") {
      result = filterHappyHoursNow(result, today);
    }

    // Apply time filter if active
    if (timeFilter) {
      result = filterRestaurantsByTimeRange(result, timeFilter);
    }

    // Apply advanced filters
    if (hasActiveAdvancedFilters(advancedFilters)) {
      result = applyAdvancedFilters(result, advancedFilters);
    }

    return result;
  }, [filterOption, today, allRestaurants, advancedFilters, isLocationBased, timeFilter, searchQuery]);

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