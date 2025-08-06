import { useState } from "react";
import Image from "next/image";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useModal } from "@/contexts/ModalContext";
import type { Restaurant } from "@/lib/types";
import FilterDropdown from "./SmallComponents/FilterDropdown";
import FilterButton from "./SmallComponents/FilterButton";
import FilterSearchBar from "./SmallComponents/FilterSearchBar";
import TimeFilterModal, { type TimeFilter } from "./modals/TimeFilterModal";
import Link from "next/link";

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
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTimeFilter, setCurrentTimeFilter] = useState<TimeFilter | null>(
    null,
  );
  const { error } = useGeolocation();
  const { showModal } = useModal();

  // Extract unique values from restaurants for filter options
  const uniqueAreas = Array.from(
    new Set(
      restaurants
        .map((r) => r.area)
        .filter(Boolean)
        .sort(),
    ),
  ).map((area) => ({ value: area, label: area }));

  // Extract cuisine types from restaurant names (basic heuristic)
  const cuisineKeywords = [
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
  ];

  const detectedCuisines = Array.from(
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
  ).map((cuisine) => ({ value: cuisine, label: cuisine }));

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
    <div className="SearchFilters w-full bg-stone-800">
      <div className="NavbarSection bg-black/80 sm:px-8 px-4 py-2 w-full flex items-center gap-2 justify-start mb-4">
        <Link href={"/"}>
          <Image
            src="/h3-logo5.png"
            alt="Happy Hour Hunt"
            width={40}
            height={40}
          />
        </Link>
        <div className="HeroSloganContainer flex flex-wrap gap-2 font-sans font-bold">
          <h2 className="HeroSlogan text-white xs:text-lg">{`It's Happy Hour`}</h2>
          <h2 className="HeroSlogan text-py1 uppercase italic xs:text-lg">
            Somewhere!
          </h2>
        </div>
      </div>

      <div className="FilterRow w-full flex flex-wrap gap-2 text-sm px-4 sm:px-8 pb-4">
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
        >
          {currentTimeFilter
            ? `🕐 ${currentTimeFilter.dayOfWeek} ${new Date(`1970-01-01T${currentTimeFilter.startTime}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}`
            : filterOption === "now"
              ? "🍻 Happy Hour Now"
              : filterOption === "today"
                ? "📅 Happy Hour Today"
                : "🕐 Filter by Time"}
        </FilterButton>

        {/* Area Filter */}
        {uniqueAreas.length > 0 && (
          <FilterDropdown
            label="Area"
            value={advancedFilters.areas}
            options={uniqueAreas}
            onChange={handleAreaChange}
            multiple={true}
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
          searchQuery) && (
          <FilterButton active={false} onClick={handleClearAllFilters}>
            ✕ Clear Filters
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
        <div className="ErrorMessage mt-2 text-center text-xs text-red-300 bg-red-900/30 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
