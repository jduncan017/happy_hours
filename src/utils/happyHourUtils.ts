import type { LegacyRestaurant, LegacyHappyHoursData } from "@/lib/types";
import type { Restaurant } from "@/lib/types";
import { getCurrentTime, isTimeInRange } from "./time/timeUtils";

// sorts happy hours by name - supports both legacy and new restaurant types
export function sortHappyHours(happyHourDataList: LegacyHappyHoursData) {
  return happyHourDataList.CO.Denver.sort((a: LegacyRestaurant, b: LegacyRestaurant) => {
    return a.name.localeCompare(b.name);
  });
}

// sorts enhanced restaurants by name
export function sortRestaurants(restaurants: Restaurant[]) {
  return [...restaurants].sort((a: Restaurant, b: Restaurant) => {
    return a.name.localeCompare(b.name);
  });
}

// filters for happy hours on the current day of the week
export function filterHappyHoursToday<T extends LegacyRestaurant | Restaurant>(
  restaurants: T[],
  today: string,
): T[] {
  return restaurants.filter(
    (restaurant) => restaurant.happyHours[today],
  );
}

// filters for happy hours happening now
export function filterHappyHoursNow<T extends LegacyRestaurant | Restaurant>(
  restaurants: T[],
  today: string,
): T[] {
  const currentTime = getCurrentTime();

  return restaurants.filter((restaurant) => {
    const timesForDay = restaurant.happyHours[today];
    if (!timesForDay) return false;
    return timesForDay.some((time) => {
      return isTimeInRange(currentTime, time.Start, time.End);
    });
  });
}
