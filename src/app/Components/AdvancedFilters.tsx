"use client";

import { useState } from "react";
import type { Restaurant } from "@/lib/types";

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

interface AdvancedFiltersProps {
  restaurants: Restaurant[];
  filters: AdvancedFilterOptions;
  onFiltersChange: (filters: AdvancedFilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdvancedFilters({
  restaurants,
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}: AdvancedFiltersProps) {
  // Extract unique values from restaurants for filter options
  const uniqueAreas = Array.from(
    new Set(
      restaurants
        .map((r) => r.area)
        .filter(Boolean)
        .sort(),
    ),
  );

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
  );

  const handleAreaChange = (area: string, checked: boolean) => {
    const newAreas = checked
      ? [...filters.areas, area]
      : filters.areas.filter((a) => a !== area);

    onFiltersChange({
      ...filters,
      areas: newAreas,
    });
  };

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    const newCuisines = checked
      ? [...filters.cuisineTypes, cuisine]
      : filters.cuisineTypes.filter((c) => c !== cuisine);

    onFiltersChange({
      ...filters,
      cuisineTypes: newCuisines,
    });
  };

  const handleFeatureChange = (
    feature: keyof AdvancedFilterOptions["hasSpecialFeatures"],
    checked: boolean,
  ) => {
    onFiltersChange({
      ...filters,
      hasSpecialFeatures: {
        ...filters.hasSpecialFeatures,
        [feature]: checked,
      },
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      areas: [],
      cuisineTypes: [],
      priceRange: [],
      hasSpecialFeatures: {
        hasWebsite: false,
        hasNotes: false,
        hasMultipleHappyHours: false,
      },
    });
  };

  const activeFilterCount =
    filters.areas.length +
    filters.cuisineTypes.length +
    filters.priceRange.length +
    Object.values(filters.hasSpecialFeatures).filter(Boolean).length;

  return (
    <div className="AdvancedFilters max-w-[1200px] rounded-lg border border-stone-200 bg-white shadow-themeShadow">
      <button
        onClick={onToggle}
        className="FilterToggle flex w-full items-center justify-between rounded-lg px-6 py-4 text-left transition-colors duration-200 hover:bg-stone-50"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-stone-900">Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-po1 rounded-full px-2 py-1 text-xs font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        <span
          className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>

      {isOpen && (
        <div className="FilterContent mt-2 border-t border-stone-200 px-6 pb-6 pt-4">
          {/* Areas Filter */}
          {uniqueAreas.length > 0 && (
            <div className="FilterSection mb-6">
              <h4 className="mb-3 font-medium text-stone-900">Areas</h4>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {uniqueAreas.map((area) => (
                  <label
                    key={area}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.areas.includes(area)}
                      onChange={(e) => handleAreaChange(area, e.target.checked)}
                      className="text-po1 focus:ring-po1 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2"
                    />
                    <span className="text-sm text-stone-700">{area}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Cuisine Types Filter */}
          {detectedCuisines.length > 0 && (
            <div className="FilterSection mb-6">
              <h4 className="mb-3 font-medium text-stone-900">Cuisine Types</h4>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {detectedCuisines.map((cuisine) => (
                  <label
                    key={cuisine}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.cuisineTypes.includes(cuisine)}
                      onChange={(e) =>
                        handleCuisineChange(cuisine, e.target.checked)
                      }
                      className="text-po1 focus:ring-po1 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2"
                    />
                    <span className="text-sm text-stone-700">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Special Features Filter */}
          <div className="FilterSection mb-6">
            <h4 className="mb-3 font-medium text-stone-900">
              Special Features
            </h4>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasSpecialFeatures.hasWebsite}
                  onChange={(e) =>
                    handleFeatureChange("hasWebsite", e.target.checked)
                  }
                  className="text-po1 focus:ring-po1 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2"
                />
                <span className="text-sm text-stone-700">Has Website</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasSpecialFeatures.hasNotes}
                  onChange={(e) =>
                    handleFeatureChange("hasNotes", e.target.checked)
                  }
                  className="text-po1 focus:ring-po1 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2"
                />
                <span className="text-sm text-stone-700">
                  Has Special Notes
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasSpecialFeatures.hasMultipleHappyHours}
                  onChange={(e) =>
                    handleFeatureChange(
                      "hasMultipleHappyHours",
                      e.target.checked,
                    )
                  }
                  className="text-po1 focus:ring-po1 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2"
                />
                <span className="text-sm text-stone-700">
                  Multiple Happy Hour Times
                </span>
              </label>
            </div>
          </div>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="ClearFilters w-full rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition-colors duration-200 hover:bg-stone-200"
            >
              Clear All Filters ({activeFilterCount})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
