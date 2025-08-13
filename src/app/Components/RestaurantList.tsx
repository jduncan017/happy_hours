import { useState } from "react";
import Link from "next/link";
import type { Restaurant } from "@/lib/types";
import RestaurantCard from "./RestaurantCard";
import { Plus, Users } from "lucide-react";
import SiteButton from "./SmallComponents/siteButton";

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

      {/* Restaurant Submission CTA */}
      {restaurants.length > 0 && (
        <div className="SubmissionCTA bg-gradient-to-r from-po1/10 to-py1/10 border border-po1/20 rounded-2xl p-8 mx-4 mb-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-po1/20 rounded-full p-3">
              <Users className="w-8 h-8 text-po1" />
            </div>
          </div>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
            Know a Great Happy Hour Spot?
          </h3>
          <p className="text-gray-700 mb-6 max-w-md mx-auto">
            Help grow Denver&apos;s happy hour community! Submit your favorite
            restaurants and bars to help others discover amazing deals.
          </p>
          <Link href="/submit">
            <SiteButton
              size="sm"
              variant="gradient"
              text="+ Submit a Restaurant"
              rounded={true}
            />
          </Link>
        </div>
      )}
    </div>
  );
}
