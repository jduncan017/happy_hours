"use client";
import React, { forwardRef, useState } from "react";
import type { Restaurant } from "@/lib/types";
import RestaurantList from "./RestaurantList";
import GoogleMap from "./GoogleMap";

interface SearchResultsProps {
  restaurants: Restaurant[];
  today: string;
  userLocation?: { lat: number; lng: number };
  isLocationBased: boolean;
  isLoading: boolean;
  error: Error | null;
  onBackToAll: () => void;
}

export const SearchResults = forwardRef<HTMLDivElement, SearchResultsProps>(
  (
    {
      restaurants,
      today,
      userLocation,
      isLocationBased,
      isLoading,
      error,
      onBackToAll,
    },
    ref,
  ) => {
    // Mobile tab state
    const [activeTab, setActiveTab] = useState<"list" | "map">("list");
    // Loading state
    if (isLoading) {
      return (
        <div ref={ref} id="search-section" className="Search w-full relative">
          {/* Desktop Loading */}
          <div className="hidden lg:flex h-screen w-full">
            <div className="LeftPanel flex w-2/3 flex-col">
              <div className="ResultsSection flex flex-1 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-stone-800"></div>
              </div>
            </div>
            <div className="RightPanel h-full w-1/3 bg-gray-100 border-l border-gray-300">
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
              </div>
            </div>
          </div>

          {/* Mobile Loading */}
          <div className="lg:hidden h-screen flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-stone-800"></div>
          </div>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div ref={ref} id="search-section" className="Search w-full relative">
          {/* Desktop Error */}
          <div className="hidden lg:flex h-screen w-full">
            <div className="LeftPanel flex w-2/3 flex-col">
              <div className="ResultsSection flex flex-1 items-center justify-center p-8">
                <div className="text-center">
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
            </div>
            <div className="RightPanel h-full w-1/3 bg-gray-100 border-l border-gray-300">
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Map unavailable</p>
              </div>
            </div>
          </div>

          {/* Mobile Error */}
          <div className="lg:hidden h-screen flex items-center justify-center p-8">
            <div className="text-center">
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
        </div>
      );
    }

    return (
      <div ref={ref} id="search-section" className="Search w-full relative">
        {/* Desktop Layout - Hidden on Mobile */}
        <div className="hidden lg:flex h-screen w-full">
          {/* Left Side - Search Results */}
          <div className="LeftPanel flex w-2/3 max-w-[1000px] flex-col overflow-hidden">
            {/* Back to All Button */}
            {isLocationBased && (
              <div className="BackButtonSection flex-shrink-0 border-b border-gray-200 bg-white p-4">
                <button
                  onClick={onBackToAll}
                  className="BackButton w-full rounded-lg border border-stone-200 bg-stone-100 px-4 py-3 font-medium text-stone-700 transition-all duration-200 hover:bg-stone-200"
                >
                  ← Back to All Restaurants
                </button>
              </div>
            )}

            {/* Search Results - Scrollable */}
            <div className="ResultsSection flex-1 overflow-y-auto p-4">
              <RestaurantList restaurants={restaurants} today={today} />
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="RightPanel h-full flex-1 border-l border-gray-300">
            <GoogleMap
              restaurants={restaurants}
              center={userLocation || undefined}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Mobile Layout - Hidden on Desktop */}
        <div className="MobileResults overflow-scroll lg:hidden w-full">
          {/* Mobile Tab Navigation */}
          <div className="MobileTabNav bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="flex">
              <button
                onClick={() => setActiveTab("list")}
                className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                  activeTab === "list"
                    ? "text-po1 border-b-1 border-po1 bg-white"
                    : "text-gray-500 bg-gray-100 hover:text-gray-700"
                }`}
              >
                List ({restaurants.length})
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                  activeTab === "map"
                    ? "text-po1 border-b-1 border-po1 bg-white"
                    : "text-gray-500 bg-gray-100 hover:text-gray-700"
                }`}
              >
                Map
              </button>
            </div>
          </div>

          {/* Mobile Tab Content */}
          <div className="MobileTabContent">
            {activeTab === "list" ? (
              <div className="MobileListView">
                {/* Back to All Button */}
                {isLocationBased && (
                  <div className="BackButtonSection bg-white p-4 border-b border-gray-200">
                    <button
                      onClick={onBackToAll}
                      className="BackButton w-full rounded-lg border border-stone-200 bg-stone-100 px-4 py-3 font-medium text-stone-700 transition-all duration-200 hover:bg-stone-200"
                    >
                      ← Back to All Restaurants
                    </button>
                  </div>
                )}

                {/* Search Results */}
                <div className="ResultsSection p-4 pb-20 h-[calc(100svh-240px)]">
                  <RestaurantList restaurants={restaurants} today={today} />
                </div>
              </div>
            ) : (
              <div className="MobileMapView h-[calc(100svh-240px)]">
                <GoogleMap
                  restaurants={restaurants}
                  center={userLocation || undefined}
                  className="h-full w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

SearchResults.displayName = "Search Results";
