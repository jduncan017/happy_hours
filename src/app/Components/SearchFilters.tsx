import { useMemo, useState } from "react";
import Image from "next/image";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useModal } from "@/contexts/ModalContext";
import type { Restaurant } from "@/lib/types";
import FilterDropdown from "./SmallComponents/FilterDropdown";
import FilterButton from "./SmallComponents/FilterButton";
import FilterSearchBar from "./SmallComponents/FilterSearchBar";
import TimeFilterModal, { type TimeFilter } from "./modals/TimeFilterModal";
import Link from "next/link";
import { Clock, Calendar, Beer, Heart, X } from "lucide-react";

export interface AdvancedFilterOptions {
  areas: string[];
  cuisineTypes: string[];
  priceRange: string[];
  hasSpecialFeatures: {
    hasWebsite: boolean;
    hasNotes: boolean;
    hasMultipleHappyHours: boolean;
  };
}

interface SearchFiltersProps {
  filterOption: string;
  onFilterChange: (value: string) => void;
  restaurants: Restaurant[];
  advancedFilters: AdvancedFilterOptions;
  onAdvancedFiltersChange: (filters: AdvancedFilterOptions) => void;
  onTimeFilter?: (filter: TimeFilter | null) => void;
  onClearAllFilters?: () => void;
  onError?: (error: string) => void;
  onSearchQuery?: (query: string) => void;
  favoritesOnly?: boolean;
  onToggleFavoritesOnly?: (next: boolean) => void;
}

export default function SearchFilters({
  filterOption,
  onFilterChange,
  restaurants,
  advancedFilters,
  onAdvancedFiltersChange,
  onTimeFilter,
  onClearAllFilters,
  onError,
  onSearchQuery,
  favoritesOnly = false,
  onToggleFavoritesOnly,
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTimeFilter, setCurrentTimeFilter] = useState<TimeFilter | null>(
    null,
  );
  const { error } = useGeolocation();
  const { showModal } = useModal();

  // Cuisine keyword list — module-level constant would be cleaner, but keep
  // it scoped here. The lookup is memoized below.
  const cuisineKeywords = useMemo(
    () => [
      "Mexican",
      "Italian",
      "Chinese",
      "Thai",
      "Japanese",
      "Korean",
      "Indian",
      "Mediterranean",
      "American",
      "Bar",
      "Grill",
      "Brewery",
      "Steakhouse",
      "Seafood",
      "Pizza",
      "Burgers",
      "Wings",
      "BBQ",
      "Sushi",
      "Tacos",
      "Cafe",
      "Pub",
      "Bistro",
      "Sports Bar",
    ],
    [],
  );

  const uniqueAreas = useMemo(
    () =>
      Array.from(
        new Set(
          restaurants
            .map((r) => r.area)
            .filter(Boolean)
            .sort(),
        ),
      ).map((area) => ({ value: area, label: area })),
    [restaurants],
  );

  const detectedCuisines = useMemo(
    () =>
      Array.from(
        new Set(
          restaurants
            .map((r) => {
              const name = r.name.toLowerCase();
              return cuisineKeywords.find((cuisine) =>
                name.includes(cuisine.toLowerCase()),
              );
            })
            .filter((cuisine): cuisine is string => Boolean(cuisine))
            .sort(),
        ),
      ).map((cuisine) => ({ value: cuisine, label: cuisine })),
    [restaurants, cuisineKeywords],
  );

  const handleAreaChange = (value: string | string[]) => {
    onAdvancedFiltersChange({
      ...advancedFilters,
      areas: value as string[],
    });
  };

  const handleCuisineChange = (value: string | string[]) => {
    onAdvancedFiltersChange({
      ...advancedFilters,
      cuisineTypes: value as string[],
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearchQuery?.(query);
  };

  const handleTimeFilter = (filter: TimeFilter) => {
    setCurrentTimeFilter(filter);
    onTimeFilter?.(filter);
  };

  const handleClearAllFilters = () => {
    // Clear advanced filters
    onAdvancedFiltersChange({
      areas: [],
      cuisineTypes: [],
      priceRange: [],
      hasSpecialFeatures: {
        hasWebsite: false,
        hasNotes: false,
        hasMultipleHappyHours: false,
      },
    });
    // Clear time filter
    setCurrentTimeFilter(null);
    onTimeFilter?.(null);
    // Reset basic filter to 'all'
    onFilterChange("all");
    // Clear search
    setSearchQuery("");
    onSearchQuery?.("");
    // Call additional clear function if provided
    onClearAllFilters?.();
  };

  const handleOpenTimeFilterModal = () => {
    showModal(
      <TimeFilterModal
        onApplyFilter={handleTimeFilter}
        onApplyNowFilter={() => {
          onFilterChange("now");
          setCurrentTimeFilter(null);
        }}
        onApplyTodayFilter={() => {
          onFilterChange("today");
          setCurrentTimeFilter(null);
        }}
        onClose={() => showModal(null)}
        currentFilter={currentTimeFilter || undefined}
      />,
    );
  };

  if (error) {
    onError?.(error);
  }

  return (
    <div
      className="SearchFilters w-full bg-stone-800"
      role="search"
      aria-label="Restaurant filters and search"
    >
      <div
        className="FilterRow w-full flex flex-wrap gap-2 px-4 sm:px-8 py-4"
        role="toolbar"
        aria-label="Restaurant filter controls"
      >
        <FilterSearchBar
          placeholder="Search restaurants, cuisine, area..."
          onSearch={handleSearch}
          value={searchQuery}
          className="w-full max-w-md min-w-[360px] flex-1"
        />

        {/* Filter Row - Yelp Style */}

        {/* Filter by Time Button */}
        <FilterButton
          active={
            !!currentTimeFilter ||
            filterOption === "now" ||
            filterOption === "today"
          }
          onClick={handleOpenTimeFilterModal}
          aria-label="Filter restaurants by time - currently showing all times"
          aria-expanded={
            !!currentTimeFilter ||
            filterOption === "now" ||
            filterOption === "today"
          }
        >
          <span className="inline-flex items-center gap-1.5">
            {filterOption === "now" ? (
              <Beer className="w-4 h-4" />
            ) : filterOption === "today" ? (
              <Calendar className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
            {currentTimeFilter
              ? `${currentTimeFilter.dayOfWeek} ${new Date(`1970-01-01T${currentTimeFilter.startTime}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}`
              : filterOption === "now"
                ? "Happening Now"
                : filterOption === "today"
                  ? "Today"
                  : "Filter by Time"}
          </span>
        </FilterButton>

        {/* Favorites Only Filter */}
        {onToggleFavoritesOnly && (
          <FilterButton
            active={favoritesOnly}
            onClick={() => onToggleFavoritesOnly(!favoritesOnly)}
            aria-label={
              favoritesOnly ? "Show all restaurants" : "Show only favorites"
            }
            aria-pressed={favoritesOnly}
          >
            <span className="inline-flex items-center gap-1.5">
              <Heart
                className="w-4 h-4"
                fill={favoritesOnly ? "currentColor" : "none"}
                strokeWidth={favoritesOnly ? 0 : 2}
              />
              Favorites
            </span>
          </FilterButton>
        )}

        {/* Area Filter */}
        {uniqueAreas.length > 0 && (
          <FilterDropdown
            label="Area"
            value={advancedFilters.areas}
            options={uniqueAreas}
            onChange={handleAreaChange}
            multiple={false}
          />
        )}

        {/* Cuisine Filter */}
        {detectedCuisines.length > 0 && (
          <FilterDropdown
            label="Cuisine"
            value={advancedFilters.cuisineTypes}
            options={detectedCuisines}
            onChange={handleCuisineChange}
            multiple={true}
          />
        )}

        {/* Clear Filters - only show when filters are active */}
        {(advancedFilters.areas.length > 0 ||
          advancedFilters.cuisineTypes.length > 0 ||
          currentTimeFilter ||
          filterOption !== "all" ||
          searchQuery ||
          favoritesOnly) && (
          <FilterButton
            active={false}
            onClick={handleClearAllFilters}
            aria-label="Clear all active filters"
          >
            <span className="inline-flex items-center gap-1.5">
              <X className="w-4 h-4" />
              Clear filters
            </span>
          </FilterButton>
        )}

        {/* Near Me Button */}
        {/* <FilterButton
          onClick={handleFindNearby}
          disabled={isLoading}
        >
          {isLoading ? '📍 Loading...' : '📍 Near Me'}
        </FilterButton> */}
      </div>

      {/* Error Display */}
      {error && (
        <div
          className="ErrorMessage mt-2 text-center text-xs text-red-300 bg-red-900/30 p-2 rounded"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}
