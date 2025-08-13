/**
 * Restaurant Filtering Utilities
 * Reusable filtering functions for both admin and public search interfaces
 */

import type { Restaurant } from "@/lib/types";

// Common filter interfaces
export interface RestaurantSearchFilters {
  searchQuery?: string;
  areas?: string[];
  cuisineTypes?: string[];
  verificationStatus?: string[];
}

export interface SearchOptions {
  includeNotes?: boolean;
  caseSensitive?: boolean;
  exactMatch?: boolean;
}

/**
 * Filter restaurants by search query
 * Supports multi-term search across name, area, address, cuisine, and optionally notes
 */
export function filterRestaurantsBySearch(
  restaurants: Restaurant[],
  query: string,
  options: SearchOptions = {}
): Restaurant[] {
  if (!query.trim()) return restaurants;

  const {
    includeNotes = true,
    caseSensitive = false,
    exactMatch = false,
  } = options;

  const processedQuery = caseSensitive ? query : query.toLowerCase();
  const searchTerms = exactMatch 
    ? [processedQuery]
    : processedQuery.split(' ').filter(term => term.length > 0);

  return restaurants.filter(restaurant => {
    const searchFields = [
      restaurant.name,
      restaurant.area || '',
      restaurant.address,
      restaurant.cuisineType || '',
    ];

    if (includeNotes && restaurant.notes) {
      searchFields.push(restaurant.notes.join(' '));
    }

    const searchableText = searchFields
      .join(' ')
      .toLowerCase();

    return exactMatch
      ? searchableText.includes(processedQuery)
      : searchTerms.every(term => searchableText.includes(term));
  });
}

/**
 * Filter restaurants by areas
 */
export function filterRestaurantsByAreas(
  restaurants: Restaurant[],
  areas: string[]
): Restaurant[] {
  if (areas.length === 0) return restaurants;
  
  return restaurants.filter(restaurant => 
    restaurant.area && areas.includes(restaurant.area)
  );
}

/**
 * Filter restaurants by cuisine types
 */
export function filterRestaurantsByCuisineTypes(
  restaurants: Restaurant[],
  cuisineTypes: string[]
): Restaurant[] {
  if (cuisineTypes.length === 0) return restaurants;
  
  return restaurants.filter(restaurant => 
    restaurant.cuisineType && cuisineTypes.includes(restaurant.cuisineType)
  );
}

/**
 * Filter restaurants by verification status
 * Supports 'verified', 'pending', or both
 */
export function filterRestaurantsByVerification(
  restaurants: Restaurant[],
  verificationStatus: string[]
): Restaurant[] {
  if (verificationStatus.length === 0) return restaurants;

  return restaurants.filter(restaurant => {
    if (verificationStatus.includes("verified") && restaurant.verified) {
      return true;
    }
    if (verificationStatus.includes("pending") && !restaurant.verified) {
      return true;
    }
    return false;
  });
}

/**
 * Apply multiple filters in sequence
 * This is the main filtering function that combines all filter types
 */
export function applyRestaurantFilters(
  restaurants: Restaurant[],
  filters: RestaurantSearchFilters,
  searchOptions: SearchOptions = {}
): Restaurant[] {
  let filtered = restaurants;

  // Apply search filter
  if (filters.searchQuery) {
    filtered = filterRestaurantsBySearch(filtered, filters.searchQuery, searchOptions);
  }

  // Apply area filter
  if (filters.areas && filters.areas.length > 0) {
    filtered = filterRestaurantsByAreas(filtered, filters.areas);
  }

  // Apply cuisine filter
  if (filters.cuisineTypes && filters.cuisineTypes.length > 0) {
    filtered = filterRestaurantsByCuisineTypes(filtered, filters.cuisineTypes);
  }

  // Apply verification status filter
  if (filters.verificationStatus && filters.verificationStatus.length > 0) {
    filtered = filterRestaurantsByVerification(filtered, filters.verificationStatus);
  }

  return filtered;
}

/**
 * Check if any filters are active
 */
export function hasActiveRestaurantFilters(filters: RestaurantSearchFilters): boolean {
  return Boolean(
    filters.searchQuery?.trim() ||
    (filters.areas && filters.areas.length > 0) ||
    (filters.cuisineTypes && filters.cuisineTypes.length > 0) ||
    (filters.verificationStatus && filters.verificationStatus.length > 0)
  );
}

/**
 * Extract unique values from restaurant array for filter options
 */
export function extractUniqueFilterOptions(restaurants: Restaurant[]) {
  const areas = Array.from(
    new Set(
      restaurants
        .map(r => r.area)
        .filter(Boolean)
        .sort()
    )
  ).map(area => ({ value: area, label: area }));

  const cuisineTypes = Array.from(
    new Set(
      restaurants
        .map(r => r.cuisineType)
        .filter(Boolean)
        .sort()
    )
  ).map(cuisine => ({ value: cuisine, label: cuisine }));

  return { areas, cuisineTypes };
}

/**
 * Create a clean filters object with no active filters
 */
export function createEmptyFilters(): RestaurantSearchFilters {
  return {
    searchQuery: "",
    areas: [],
    cuisineTypes: [],
    verificationStatus: [],
  };
}

/**
 * Merge filter objects, combining arrays and overriding primitives
 */
export function mergeFilters(
  baseFilters: RestaurantSearchFilters,
  newFilters: Partial<RestaurantSearchFilters>
): RestaurantSearchFilters {
  return {
    searchQuery: newFilters.searchQuery ?? baseFilters.searchQuery,
    areas: newFilters.areas ?? baseFilters.areas,
    cuisineTypes: newFilters.cuisineTypes ?? baseFilters.cuisineTypes,
    verificationStatus: newFilters.verificationStatus ?? baseFilters.verificationStatus,
  };
}