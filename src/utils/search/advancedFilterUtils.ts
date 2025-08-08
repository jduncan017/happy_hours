import type { Restaurant } from "@/lib/types";
import type { AdvancedFilterOptions } from "@/app/Components/AdvancedFilters";

export function applyAdvancedFilters(
  restaurants: Restaurant[],
  filters: AdvancedFilterOptions,
): Restaurant[] {
  return restaurants.filter((restaurant) => {
    // Area filter
    if (filters.areas.length > 0) {
      if (!restaurant.area || !filters.areas.includes(restaurant.area)) {
        return false;
      }
    }

    // Cuisine type filter (basic heuristic based on name)
    if (filters.cuisineTypes.length > 0) {
      const restaurantName = restaurant.name.toLowerCase();
      const matchesCuisine = filters.cuisineTypes.some((cuisine) =>
        restaurantName.includes(cuisine.toLowerCase()),
      );
      if (!matchesCuisine) {
        return false;
      }
    }

    // Special features filters
    if (filters.hasSpecialFeatures.hasWebsite) {
      if (!restaurant.website || restaurant.website.trim() === "") {
        return false;
      }
    }

    if (filters.hasSpecialFeatures.hasNotes) {
      if (!restaurant.notes || restaurant.notes.length === 0) {
        return false;
      }
    }

    if (filters.hasSpecialFeatures.hasMultipleHappyHours) {
      const totalHappyHourSlots = Object.values(restaurant.happyHours).reduce(
        (total, dayHours) => total + (dayHours?.length || 0),
        0,
      );
      if (totalHappyHourSlots <= 1) {
        return false;
      }
    }

    return true;
  });
}

export function hasActiveAdvancedFilters(
  filters: AdvancedFilterOptions,
): boolean {
  return (
    filters.areas.length > 0 ||
    filters.cuisineTypes.length > 0 ||
    filters.priceRange.length > 0 ||
    Object.values(filters.hasSpecialFeatures).some(Boolean)
  );
}

export function getActiveFilterCount(filters: AdvancedFilterOptions): number {
  return (
    filters.areas.length +
    filters.cuisineTypes.length +
    filters.priceRange.length +
    Object.values(filters.hasSpecialFeatures).filter(Boolean).length
  );
}
