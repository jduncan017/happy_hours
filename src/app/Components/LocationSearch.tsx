"use client";

import { useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { Restaurant } from "@/lib/types";

interface LocationSearchProps {
  restaurants: Restaurant[];
  onLocationSearch: (restaurants: Restaurant[], userLocation: { lat: number; lng: number }) => void;
  onError?: (error: string) => void;
}

// Calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Radius of Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Check if restaurant has happy hour now
function hasHappyHourNow(restaurant: Restaurant): boolean {
  const now = new Date();
  const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
  
  const todayHours = restaurant.happyHours[currentDay];
  if (!todayHours) return false;

  return todayHours.some(timeRange => {
    const [startHour, startMin] = timeRange.Start.split(':').map(Number);
    const [endHour, endMin] = timeRange.End.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    return currentTime >= startTime && currentTime <= endTime;
  });
}

export default function LocationSearch({
  restaurants,
  onLocationSearch,
  onError
}: LocationSearchProps) {
  const [radius, setRadius] = useState(10); // Default 10 miles
  const { location, isLoading, error, requestLocation } = useGeolocation();

  const handleFindNearby = (filterType: 'all' | 'now' | 'today') => {
    if (!location) {
      requestLocation();
      return;
    }

    // Filter restaurants with coordinates and within radius
    let nearbyRestaurants = restaurants
      .filter(restaurant => restaurant.coordinates)
      .map(restaurant => {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          restaurant.coordinates!.lat,
          restaurant.coordinates!.lng
        );
        return { ...restaurant, distance };
      })
      .filter(restaurant => restaurant.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    // Apply time-based filtering
    if (filterType === 'now') {
      nearbyRestaurants = nearbyRestaurants.filter(hasHappyHourNow);
    } else if (filterType === 'today') {
      const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
      nearbyRestaurants = nearbyRestaurants.filter(restaurant => 
        restaurant.happyHours[currentDay] && restaurant.happyHours[currentDay].length > 0
      );
    }

    onLocationSearch(nearbyRestaurants, location);
  };

  if (error) {
    onError?.(error);
  }

  return (
    <div className="LocationSearch bg-white p-6 rounded-lg shadow-lg border border-stone-200">
      <h3 className="font-semibold text-xl mb-4 text-stone-900">Find Happy Hours Near You</h3>
      
      <div className="RadiusSelector mb-4">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Search within:
        </label>
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full p-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-po1 focus:border-po1 bg-white text-stone-900"
        >
          <option value={1}>1 mile</option>
          <option value={5}>5 miles</option>
          <option value={10}>10 miles</option>
          <option value={25}>25 miles</option>
        </select>
      </div>

      <div className="ButtonGroup flex flex-col gap-3">
        <button
          onClick={() => handleFindNearby('now')}
          disabled={isLoading}
          className="LocationButton w-full bg-po1 text-white py-3 px-4 rounded-lg hover:bg-po1/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {isLoading ? '📍 Getting Location...' : '🍻 Find Happy Hour NOW!'}
        </button>
        
        <button
          onClick={() => handleFindNearby('today')}
          disabled={isLoading}
          className="LocationButton w-full bg-stone-100 text-stone-900 py-3 px-4 rounded-lg hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 border border-stone-300"
        >
          📅 Happy Hours Today
        </button>
        
        <button
          onClick={() => handleFindNearby('all')}
          disabled={isLoading}
          className="LocationButton w-full bg-stone-800 text-white py-3 px-4 rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
        >
          📍 All Nearby Restaurants
        </button>
      </div>

      {location && (
        <p className="text-xs text-stone-500 mt-4 bg-stone-50 p-2 rounded">
          📍 Using your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}

      {error && (
        <div className="ErrorMessage mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}