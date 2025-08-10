"use client";

import { useState } from "react";
import { Restaurant } from "@/lib/types";
import RestaurantEditor from "./RestaurantEditor";
import CardWrapper from "@/app/Components/SmallComponents/CardWrapper";
import TextInput from "@/app/Components/SmallComponents/TextInput";
import {
  Building2,
  CheckCircle,
  Clock,
  Search,
  MapPin,
  Mail,
} from "lucide-react";

interface AdminStats {
  totalRestaurants: number;
  pendingSubmissions: number;
  verifiedRestaurants: number;
}

interface AdminDashboardProps {
  restaurants: Restaurant[];
  stats: AdminStats;
}

export default function AdminDashboard({
  restaurants,
  stats,
}: AdminDashboardProps) {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.area?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = !showVerifiedOnly || restaurant.verified;

    return matchesSearch && matchesVerified;
  });

  return (
    <div className="AdminDashboard grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Stats Cards */}
      <div className="StatsCardsContainer lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <CardWrapper hover className="group">
          <div className="StatsCardIcon w-12 h-12 bg-po1 rounded-xl flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="StatsCardTitle text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">
            Total Restaurants
          </h3>
          <p className="StatsCardValue text-3xl font-bold text-po1 mb-1">
            {stats.totalRestaurants}
          </p>
          <div className="StatsCardChange text-xs text-gray-600 font-medium">
            Active locations
          </div>
        </CardWrapper>

        <CardWrapper hover className="group">
          <div className="StatsCardIcon w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="StatsCardTitle text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">
            Verified
          </h3>
          <p className="StatsCardValue text-3xl font-bold text-green-600 mb-1">
            {stats.verifiedRestaurants}
          </p>
          <div className="StatsCardChange text-xs text-gray-600 font-medium">
            {stats.totalRestaurants > 0
              ? Math.round(
                  (stats.verifiedRestaurants / stats.totalRestaurants) * 100,
                )
              : 0}
            % verified
          </div>
        </CardWrapper>

        <CardWrapper hover className="group">
          <div className="StatsCardIcon w-12 h-12 bg-py1 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="StatsCardTitle text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">
            Pending Review
          </h3>
          <p className="StatsCardValue text-3xl font-bold text-py1 mb-1">
            {stats.pendingSubmissions}
          </p>
          <div className="StatsCardChange text-xs text-gray-600 font-medium">
            {stats.pendingSubmissions > 0
              ? "Needs attention"
              : "All caught up!"}
          </div>
        </CardWrapper>
      </div>

      {/* Restaurant List */}
      <div className="RestaurantListContainer lg:col-span-2">
        <CardWrapper>
          <div className="flex items-center mb-6">
            <div className="RestaurantListIcon w-10 h-10 bg-po1 rounded-xl flex items-center justify-center mr-4">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="RestaurantListTitle text-2xl font-bold text-gray-800 uppercase tracking-wide">
                Restaurant Directory
              </h2>
              <p className="RestaurantListSubtitle text-gray-700">
                Manage and edit restaurant listings
              </p>
            </div>
          </div>

          <div className="RestaurantListControls flex flex-col sm:flex-row gap-4">
            <TextInput
              placeholder="Search restaurants by name or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              containerClassName="flex-1"
              variant="search"
            />

            <label className="FilterCheckbox flex items-center gap-3 bg-white rounded-xl px-4 py-3 border-2 border-n3 hover:bg-n3 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={showVerifiedOnly}
                onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-400 text-po1 focus:ring-po1"
              />
              <span className="text-sm font-medium text-gray-800">
                Verified only
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </label>
          </div>
        </CardWrapper>

        <div className="RestaurantListItems space-y-3 max-h-[600px] overflow-y-auto pr-2 mt-6">
          {filteredRestaurants.map((restaurant) => (
            <CardWrapper
              key={restaurant.id}
              onClick={() => setSelectedRestaurant(restaurant)}
              hover
              selected={selectedRestaurant?.id === restaurant.id}
              className="group cursor-pointer"
            >
              <div className="RestaurantItemHeader flex items-start justify-between mb-3">
                <div className="RestaurantItemInfo flex-1">
                  <h3 className="RestaurantItemName font-bold text-lg text-gray-800 group-hover:text-po1 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="RestaurantItemArea text-sm text-gray-700 font-medium flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {restaurant.area || "Location TBD"}
                  </p>
                </div>

                <div className="RestaurantItemBadges flex flex-col gap-2">
                  {restaurant.verified && (
                    <span className="VerifiedBadge bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  )}
                  <span className="CuisineBadge bg-po1 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {restaurant.cuisineType || "Cuisine TBD"}
                  </span>
                </div>
              </div>

              <p className="RestaurantItemAddress text-sm text-gray-700 bg-n3 rounded-lg p-2 flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-0.5 text-gray-600 flex-shrink-0" />
                {restaurant.address}
              </p>

              <div className="RestaurantItemActions mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-xs text-po1 font-medium">
                  Click to edit →
                </div>
              </div>
            </CardWrapper>
          ))}

          {filteredRestaurants.length === 0 && (
            <CardWrapper className="EmptyState text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-n3 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No restaurants found
              </h3>
              <p className="text-sm text-gray-700">
                Try adjusting your search criteria
              </p>
            </CardWrapper>
          )}
        </div>
      </div>

      {/* Restaurant Editor */}
      <div className="RestaurantEditorContainer lg:col-span-1">
        {selectedRestaurant ? (
          <RestaurantEditor
            restaurant={selectedRestaurant}
            onUpdate={(updatedRestaurant) => {
              // Update the local state optimistically
              setSelectedRestaurant(updatedRestaurant);
              // In a real implementation, you'd refetch or update the restaurants list
            }}
            onClose={() => setSelectedRestaurant(null)}
          />
        ) : (
          <CardWrapper padding="lg" className="EditorPlaceholder text-center">
            <div className="EditorPlaceholderIcon w-20 h-20 mx-auto mb-6 bg-po1 rounded-2xl flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="EditorPlaceholderTitle text-xl font-bold text-gray-800 mb-2 uppercase tracking-wide">
              Restaurant Editor
            </h3>
            <p className="EditorPlaceholderText text-gray-700 mb-4">
              Select a restaurant from the list to edit its details
            </p>
            <div className="EditorPlaceholderFeatures space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Edit basic information
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="w-4 h-4 mr-2" />
                Update location details
              </div>
              <div className="flex items-center justify-center">
                <Building2 className="w-4 h-4 mr-2" />
                Manage verification status
              </div>
            </div>
          </CardWrapper>
        )}
      </div>
    </div>
  );
}
