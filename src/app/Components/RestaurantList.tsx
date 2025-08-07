import { useState } from "react";
import type { Restaurant } from "@/lib/types";
import RestaurantCard from "./RestaurantCard";

interface RestaurantListProps {
  restaurants: Restaurant[];
  today: string;
}

export default function RestaurantList({
  restaurants,
  today,
}: RestaurantListProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = (restaurantName: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(restaurantName)) {
        newSet.delete(restaurantName);
      } else {
        newSet.add(restaurantName);
      }
      return newSet;
    });
  };

  if (restaurants.length === 0) {
    return (
      <div className="RestaurantList w-full">
        <div className="NoRestaurants bg-white rounded-lg shadow-themeShadow px-10 py-12 text-center">
          <p className="text-stone-600 text-lg">
            Sadly, There are no happy hours that match these filters. 😔
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="RestaurantList w-full flex flex-col">
      {restaurants.map((restaurant: Restaurant, index: number) => {
        const isExpanded = expanded.has(restaurant.name);

        return (
          <RestaurantCard
            key={restaurant.id || index}
            restaurant={restaurant}
            today={today}
            isExpanded={isExpanded}
            onToggleExpanded={() => toggleExpanded(restaurant.name)}
          />
        );
      })}
    </div>
  );
}
